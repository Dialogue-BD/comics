#!/usr/bin/env python3
"""Make and upload Phonon TTS (voice V1) clips for Picture This.

Uses the same voice, clip folder, clip naming and upload route as Busy Pictures
(busy-pictures/tools/make_phonon_clips.py), so a text already recorded for one
activity is never recorded twice. The page plays a clip whenever one exists for
the exact text it is about to say, and the device's own voice otherwise, so you
can make and upload clips in any order and at any pace.

ONE-TIME SETUP (already done for Busy Pictures)
    conda activate phonon
    pip install lameenc

MAKE CLIPS (resumable: stop with Ctrl+C and run again to carry on)
    python3 picture-this/tools/make_phonon_clips.py                  # everything
    python3 picture-this/tools/make_phonon_clips.py --sets words,questions
    python3 picture-this/tools/make_phonon_clips.py --limit 20       # quick test

UPLOAD TO THE SITE (TTS_UPLOAD_TOKEN, as for Busy Pictures)
    python3 picture-this/tools/make_phonon_clips.py --upload --token <TOKEN>

SEE PROGRESS
    python3 picture-this/tools/make_phonon_clips.py --status

SETS
    words      the six picture labels on every card (Hint button, Audio Match)
    questions  the six discussion questions on the back of every card
    nurturer   GPA Nurturer lines: prompts, affirmations, recasts, "We often
               say: ..." collocation lines, single collocations, and the fixed
               phrases that link them
"""
import argparse, importlib.util, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PT = os.path.dirname(HERE)
ROOT = os.path.dirname(PT)
BUSY_TOOL = os.path.join(ROOT, "busy-pictures", "tools", "make_phonon_clips.py")

spec = importlib.util.spec_from_file_location("busy_clips", BUSY_TOOL)
busy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(busy)

FIXED_PHRASES = [
    "Round complete!",
    "Wonderful! You found all six pictures.",
    "Next:",
    "Take your time.",
    "Tap an audio tile to hear a word, then point to its matching picture.",
]


def load_data():
    """Evaluate the page's data files exactly as the browser does."""
    js = r"""
      const vm = require("vm"), fs = require("fs"), path = require("path");
      const ctx = { window: {} }; vm.createContext(ctx);
      for (const f of ["game-data.js", "question-data.js", "nurturer-data.js"]) {
        vm.runInContext(fs.readFileSync(path.join(process.argv[1], f), "utf8"), ctx);
      }
      const w = ctx.window;
      process.stdout.write(JSON.stringify({
        game: w.PICTURE_THIS_GAME_DATA || {},
        questions: w.PICTURE_THIS_QUESTION_DATA || {},
        nurturer: w.PICTURE_THIS_NURTURER_DATA || {},
      }));
    """
    out = subprocess.check_output(["node", "-e", js, PT])
    return json.loads(out)


def card_titles():
    """Card titles, from the cards array inside index.html."""
    js = r"""
      const fs = require("fs");
      const html = fs.readFileSync(process.argv[1], "utf8");
      const m = html.match(/const cards = (\[[\s\S]*?\n    \]);/);
      process.stdout.write(JSON.stringify(m ? eval(m[1]).map(c => c.title) : []));
    """
    return json.loads(subprocess.check_output(["node", "-e", js, os.path.join(PT, "index.html")]))


def nurturer_entry(data, card_id, index, fallback_label):
    """Mirror of nurturerEntryFor() in picture-this/index.html."""
    entries = data["nurturer"].get(card_id)
    entry = entries[index] if isinstance(entries, list) and index < len(entries) else None
    entry = entry or {}
    labels = data["game"].get(card_id) or []
    label = entry.get("label") or fallback_label or (labels[index] if index < len(labels) else "") or "this item"
    collocations = entry.get("collocations") if isinstance(entry.get("collocations"), list) and entry.get("collocations") else \
        ["see %s" % label, "talk about %s" % label, "notice %s" % label]
    return {
        "label": label,
        "ask": entry.get("ask") or "Where is %s? Can you point to %s?" % (label, label),
        "yes": entry.get("yes") or "Yes! That’s %s." % label,
        "recast": entry.get("recast") or "Ah, you pointed to %s." % label,
        "collocations": collocations,
    }


def texts_for(sets):
    data = load_data()
    seen, out = set(), []

    def add(text):
        text = str(text or "").strip()          # the page trims every piece too
        if text and text not in seen:
            seen.add(text)
            out.append(text)

    if "words" in sets:
        for labels in data["game"].values():
            for label in labels:
                add(label)
    if "questions" in sets:
        for record in data["questions"].values():
            for q in record.get("questions") or []:
                add(q)
    if "nurturer" in sets:
        for phrase in FIXED_PHRASES:
            add(phrase)
        for title in card_titles():
            add("Wonderful! You found all six pictures in %s." % title)
        for card_id, labels in data["game"].items():
            for index, label in enumerate(labels):
                e = nurturer_entry(data, card_id, index, label)
                add(e["ask"]); add(e["yes"]); add(e["recast"])
                add("We often say: %s." % ", ".join(e["collocations"]))
                for phrase in e["collocations"]:
                    add(phrase)
                add("Take your time and listen again for %s." % label)
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sets", default="words,questions,nurturer")
    p.add_argument("--out", default=os.path.expanduser("~/phonon-clips"))
    p.add_argument("--limit", type=int)
    p.add_argument("--upload", action="store_true")
    p.add_argument("--site", default=busy.DEFAULT_SITE)
    p.add_argument("--token", default=os.environ.get("TTS_UPLOAD_TOKEN", ""))
    p.add_argument("--status", action="store_true")
    p.add_argument("--list", action="store_true", help="print the texts and their clip keys")
    a = p.parse_args()
    sets = [s.strip() for s in a.sets.split(",") if s.strip()]
    texts = texts_for(sets)
    if a.limit:
        texts = texts[:a.limit]
    busy._SITE = a.site.rstrip("/")
    if a.list:
        for t in texts:
            print(busy.clip_key(t), t)
        return
    if a.status:
        made = sum(1 for t in texts if os.path.exists(busy.clip_path(a.out, busy.clip_key(t))))
        log = busy.uploaded_log(a.out)
        up = set(open(log).read().split()) if os.path.exists(log) else set()
        print("%d texts (%s): %d made, %d uploaded" % (
            len(texts), ", ".join(sets), made, sum(1 for t in texts if busy.clip_key(t) in up)))
        return
    if a.upload:
        if not a.token:
            sys.exit("Upload needs --token (or the TTS_UPLOAD_TOKEN environment variable).")
        busy.upload(texts, a.out, a.token)
    else:
        busy.make(texts, a.out)


if __name__ == "__main__":
    main()
