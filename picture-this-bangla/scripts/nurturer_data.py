"""Build the exact Bangla utterances and their existing Edge fallbacks."""
import hashlib
import json
import re
import unicodedata
from pathlib import Path

PREFIX = "window.PTB_NURTURER = "


def load_nurturer_data(path):
    text = path.read_text(encoding="utf-8").split(PREFIX, 1)[1].strip()
    return json.loads(text.rstrip(";"))


def collocations(item, path):
    phrases = item.get("collocations")
    if not isinstance(phrases, list) or not phrases or not all(isinstance(p, str) and p.strip() for p in phrases):
        raise ValueError(f"{path}: {item['id']} needs at least one Bangla Nurturer example in collocations")
    phrases = [unicodedata.normalize("NFC", phrase.strip()) for phrase in phrases]
    if len(phrases) != len(set(phrases)):
        raise ValueError(f"{path}: duplicate Nurturer example for {item['id']}")
    return phrases


def variant(seed, options):
    # Retain the same deterministic variant that the page previously chose.
    value = 0
    for char in seed:
        value = (value * 31 + ord(char)) & 0xffffffff
    return options[value % len(options)]


def line_records(data):
    yield from data["shared"].values()
    for pictures in data["cards"].values():
        for picture in pictures.values():
            for kind, value in picture.items():
                if kind == "examples":
                    yield from value
                else:
                    yield value


def build_nurturer_data(cards):
    templates = json.loads(Path(__file__).with_name("nurturer-lines.json").read_text(encoding="utf-8"))
    clips = {}

    def legacy_clip(text):
        clip_id = hashlib.sha256(text.encode("utf-8")).hexdigest()[:20]
        clips[clip_id] = text
        return {"clip": clip_id}

    def line(scope, kind, text, fallback, english=None):
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]
        record = {"id": "--".join((*scope, kind, digest)), "text": text, "fallback": fallback}
        if english is not None:
            record["english"] = english
        return record

    def spoken_line(scope, kind, template, label="", gloss="", word=None):
        segments = [unicodedata.normalize("NFC", text) for text in template["bangla"]]
        fallback = []
        for segment in segments:
            if word is not None and segment.strip() in ("{w}", "{w}।", "{w}?", "{w}!"):
                fallback.append(word)
            else:
                fallback.append(legacy_clip(segment.replace("{w}", label)))
        text = " ".join(segment.replace("{w}", label) for segment in segments)
        return line(scope, kind, text, fallback, template["english"].replace("{g}", gloss))

    shared = {}
    for kind in ("example-intro", "next", "retry"):
        text = unicodedata.normalize("NFC", templates[kind])
        shared[kind] = line(("shared",), kind, text, [legacy_clip(text)])
    shared["done"] = spoken_line(("shared",), "done", templates["done"])

    by_card = {}
    for card in cards:
        pictures = {}
        for picture in card["items"]:
            label, item_id = picture["label"], picture["id"]
            scope = (card["id"], item_id)
            if not all(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", part) for part in scope):
                raise ValueError(f"Invalid Nurturer line scope: {scope}")
            word = {"word": item_id}
            entry = {"word": line(scope, "word", label, [word])}
            for kind in ("ask", "yes", "recast"):
                entry[kind] = spoken_line(scope, kind, variant(item_id, templates[kind]),
                                          label, picture["gloss"] or label, word)
            entry["examples"] = [line(scope, f"example-{index}", text, [legacy_clip(text)])
                                 for index, text in enumerate(picture["collocations"], 1)]
            pictures[item_id] = entry
        by_card[card["id"]] = pictures
    return {"shared": shared, "cards": by_card, "edgeClips": clips, "display": templates["display"]}
