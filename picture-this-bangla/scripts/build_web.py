#!/usr/bin/env python3
"""Build the web files for /picture-this-bangla/.

  python3 scripts/build_web.py --source <Codex deck folder>   # cards: deck-data.js + pages/*.jpg
  python3 scripts/build_web.py --audio-only                   # refresh all recording indexes

The page reads three generated files with a cache-busting query:
  deck-data.js   — card pages, picture items, and questions for the report wizard
  question-data.js — the six questions and their speaker positions on each back
  audio-index.js — available word, question and Nurturer phrase recordings

Adding recordings: drop <item-id>.mp3 files into audio/ and run --audio-only.
A card's Hint button appears once all six of its items have a recording, and
those items join the Audio Match pool automatically. audio/sources.json records
where each recording came from (gemini:<model>/<voice> or edge:<voice>), so
stand-in Edge clips can be found and replaced by Gemini takes later.
"""
import argparse, datetime, glob, hashlib, json, os, sys, unicodedata
from pathlib import Path

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # picture-this-bangla/
QUESTION_DATA_PREFIX = "window.PICTURE_THIS_QUESTION_DATA = "


def question_record(manifest, path):
    questions = manifest.get("questions")
    endpoints = manifest.get("question_endpoints")
    if not isinstance(questions, list) or len(questions) != 6 or not all(
        isinstance(question, str) and question.strip() for question in questions
    ):
        sys.exit(f"{path}: expected six questions")
    if not isinstance(endpoints, list) or len(endpoints) != 6 or not all(
        isinstance(point, dict) and all(isinstance(point.get(axis), (int, float)) and 0 < point[axis] < 100
                                         for axis in ("x", "y"))
        for point in endpoints
    ):
        sys.exit(f"{path}: expected six rendered question endpoints")
    questions = [unicodedata.normalize("NFC", q.strip()) for q in questions]
    ids = []
    for index, question in enumerate(questions, 1):
        digest = hashlib.sha256(question.encode("utf-8")).hexdigest()[:12]
        ids.append(f"{manifest['slug']}-q{index}-{digest}")
    return {"questions": questions, "endpoints": endpoints, "ids": ids}


def load_questions():
    path = Path(HERE) / "question-data.js"
    if not path.is_file():
        return {}
    data = path.read_text(encoding="utf-8").split(QUESTION_DATA_PREFIX, 1)[1].strip()
    return json.loads(data.rstrip(";"))


def load_web_deck():
    path = Path(HERE) / "deck-data.js"
    data = path.read_text(encoding="utf-8")
    return json.loads(data.split("window.PTB_DECK = ", 1)[1].split(";\nwindow.PICTURE_THIS_GAME_DATA", 1)[0])


def collocation_records(item, path):
    phrases = item.get("collocations")
    if not isinstance(phrases, list) or not phrases or not all(isinstance(p, str) and p.strip() for p in phrases):
        sys.exit(f"{path}: {item['id']} needs at least one Bangla Nurturer phrase in collocations")
    phrases = [unicodedata.normalize("NFC", phrase.strip()) for phrase in phrases]
    if len(phrases) != len(set(phrases)):
        sys.exit(f"{path}: duplicate Nurturer phrase for {item['id']}")
    return [phrase_record(phrase) for phrase in phrases]


def phrase_record(text):
    return {"text": text, "id": hashlib.sha256(text.encode("utf-8")).hexdigest()[:20]}


def load_nurturer_lines():
    path = Path(HERE) / "scripts" / "nurturer-lines.json"
    lines = json.loads(path.read_text(encoding="utf-8"))
    for role in ("ask", "yes", "recast", "done"):
        variants = [lines[role]] if role == "done" else lines[role]
        for line in variants:
            line["bangla"] = [phrase_record(unicodedata.normalize("NFC", text)) for text in line["bangla"]]
            for segment in line["bangla"]:
                if "{w}" in segment["text"]:
                    del segment["id"]  # Use the item's existing word clip for the label.
    for role in ("example", "next", "retry"):
        lines[role] = phrase_record(unicodedata.normalize("NFC", lines[role]))
    return lines


def nurturer_phrases(deck):
    phrases = {phrase["id"]: phrase["text"] for card in deck["cards"] for item in card["items"]
               for phrase in item.get("collocations", [])}
    lines = deck.get("nurturerLines")
    if lines:
        for line in [*lines["ask"], *lines["yes"], *lines["recast"], lines["done"]]:
            phrases.update((segment["id"], segment["text"]) for segment in line["bangla"] if "id" in segment)
        phrases.update((lines[role]["id"], lines[role]["text"]) for role in ("example", "next", "retry"))
    return phrases


def build_deck(source):
    from PIL import Image
    paths = sorted(glob.glob(os.path.join(source, "cards", "*", "card.json")),
                   key=lambda p: int(os.path.basename(os.path.dirname(p)).split("-")[0]))
    os.makedirs(os.path.join(HERE, "pages"), exist_ok=True)
    cards, names, question_records = [], {}, {}
    for p in paths:
        folder = os.path.dirname(p)
        num = int(os.path.basename(folder).split("-")[0])
        c = json.load(open(p, encoding="utf-8"))
        slug = c["slug"]
        if slug in question_records:
            sys.exit(f"{p}: duplicate card slug {slug}")
        record = question_record(c, p)
        question_records[slug] = record
        pages = {}
        for side in ("front", "back"):
            rel = f"pages/{num:03d}-{side}.jpg"
            out = os.path.join(HERE, rel)
            src = os.path.join(folder, f"{side}.png")
            if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src):
                Image.open(src).convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
            pages[side] = rel
        items = []
        for it in c["items"]:
            entry = {"id": it["id"], "label": it["label"], "gloss": it.get("english_gloss", "")}
            entry["collocations"] = collocation_records(it, p)
            items.append(entry)
        if len(items) != 6:
            sys.exit(f"{p}: expected 6 items, found {len(items)}")
        cards.append({"id": slug, "number": num, "title": c["title"],
                      "front": pages["front"], "back": pages["back"], "items": items,
                      "questions": record["questions"]})
        names[slug] = [it["label"] for it in items]
    ids = [it["id"] for c in cards for it in c["items"]]
    if len(ids) != len(set(ids)):
        sys.exit("item ids are not unique across the deck")
    with open(os.path.join(HERE, "deck-data.js"), "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_web.py from the Codex deck (cards/*/card.json). Do not edit by hand.\n")
        f.write("window.PTB_DECK = " + json.dumps({"cards": cards, "nurturerLines": load_nurturer_lines()},
                                                  ensure_ascii=False, indent=1) + ";\n")
        f.write("window.PICTURE_THIS_GAME_DATA = " + json.dumps(names, ensure_ascii=False) + ";\n")
    with open(os.path.join(HERE, "question-data.js"), "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_web.py from the card manifests. Do not edit by hand.\n")
        f.write(QUESTION_DATA_PREFIX + json.dumps(question_records, ensure_ascii=False, indent=1) + ";\n")
    print(f"deck-data.js: {len(cards)} cards, {len(ids)} items")


def build_audio_index():
    audio_dir = os.path.join(HERE, "audio")
    os.makedirs(audio_dir, exist_ok=True)
    have = sorted(os.path.splitext(f)[0] for f in os.listdir(audio_dir) if f.endswith(".mp3"))
    deck = {"cards": []}
    deck_file = os.path.join(HERE, "deck-data.js")
    if os.path.exists(deck_file):
        deck = load_web_deck()
        deck_ids = {it["id"] for c in deck["cards"] for it in c["items"]}
        stray = [i for i in have if i not in deck_ids]
        if stray:
            print("warning: mp3s with no matching card item:", stray)
        full = sum(1 for c in deck["cards"] if all(it["id"] in have for it in c["items"]))
        print(f"audio-index.js: {len(have)} recordings, {full} of {len(deck['cards'])} cards complete")
    src_file = os.path.join(audio_dir, "sources.json")
    sources = json.load(open(src_file, encoding="utf-8")) if os.path.exists(src_file) else {}
    sources = {i: sources.get(i, "unknown") for i in have}
    kinds = {}
    for v in sources.values():
        kinds[v.split(":")[0]] = kinds.get(v.split(":")[0], 0) + 1
    print("sources:", kinds)
    questions = load_questions()
    question_dir = Path(HERE) / "question-audio"
    question_ids = {key for record in questions.values() for key in record["ids"]}
    question_files = {path.stem for path in question_dir.glob("*.mp3") if path.stat().st_size}
    if stray_questions := sorted(question_files - question_ids):
        print("warning: mp3s with no matching card question:", stray_questions)
    recorded_questions = sorted(question_ids & question_files)
    question_source_path = question_dir / "sources.json"
    question_sources = (json.loads(question_source_path.read_text(encoding="utf-8"))
                        if question_source_path.is_file() else {})
    full_questions = sum(question_files.issuperset(record["ids"]) for record in questions.values())
    print(f"question audio: {len(recorded_questions)}/{len(question_ids)} recordings, "
          f"{full_questions} of {len(questions)} card backs complete")
    phrases = nurturer_phrases(deck)
    nurturer_dir = Path(HERE) / "nurturer-audio"
    nurturer_files = {path.stem for path in nurturer_dir.glob("*.mp3") if path.stat().st_size}
    if stray_phrases := sorted(nurturer_files - phrases.keys()):
        print("warning: mp3s with no matching Nurturer phrase:", stray_phrases)
    recorded_phrases = sorted(nurturer_files & phrases.keys())
    full_nurturer = sum(all(item.get("collocations") and all(p["id"] in nurturer_files for p in item["collocations"])
                            for item in card["items"]) for card in deck["cards"])
    print(f"Nurturer audio: {len(recorded_phrases)}/{len(phrases)} recordings, "
          f"{full_nurturer} of {len(deck['cards'])} cards complete")
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    with open(os.path.join(HERE, "audio-index.js"), "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_web.py from audio/ and question-audio/. Do not edit by hand.\n")
        f.write("window.PTB_AUDIO = " + json.dumps({
            "version": stamp, "ids": have, "sources": sources,
            "questions": {"ids": recorded_questions,
                          "sources": {key: question_sources.get(key, "unknown") for key in recorded_questions}},
            "nurturer": {"ids": recorded_phrases},
        }) + ";\n")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", help="Codex deck folder containing cards/*/card.json")
    ap.add_argument("--audio-only", action="store_true")
    a = ap.parse_args()
    if not a.audio_only:
        if not a.source:
            ap.error("--source is required unless --audio-only")
        build_deck(a.source)
    build_audio_index()
