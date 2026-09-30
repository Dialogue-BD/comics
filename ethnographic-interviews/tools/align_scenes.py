#!/usr/bin/env python3
"""Karaoke timings for the scene comics: every word, in the whole scene file.

Run after tools/assemble_scenes.py. For each scene it has built, Whisper times
the clean takes in scene/_dry-originals/ (local model, no API key), the words
the page displays — the lines in scenes.js, with the <tag> audio cues removed
— are matched to them with the same code as the interviews (tools/align.py),
and each take's times are moved to where assemble_scenes.py placed it
(scene/_build/<id>.json). Writes scene-timings.js.

The page reads line boundaries from these timings: it turns the panel as a
line starts, seeks to a line when a student replays it, and lights each word.
Re-run whenever a take is re-recorded or a line changes.

Run: python3 tools/align_scenes.py   (needs openai-whisper and ffmpeg)
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from align import align, duration  # noqa: E402  same rules as the interviews

ROOT = Path(__file__).resolve().parent.parent
DRY = ROOT / "scene" / "_dry-originals"
BUILD = ROOT / "scene" / "_build"
SCENES = ROOT / "scenes.js"
OUT = ROOT / "scene-timings.js"
TAG = re.compile(r"<[^>]+>\s*")


def lines_from_js():
    code = r'''
const vm=require("vm"), fs=require("fs"), c={}; vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8")+";this.O=SCENES", c);
const out={}; for (const id in c.O) out[id]=c.O[id].lines.map(L=>L.t);
console.log(JSON.stringify(out));
'''
    done = subprocess.run(["node", "-e", code, str(SCENES)], capture_output=True,
                          text=True, check=True)
    return {k: [re.sub(r"\s+", " ", TAG.sub("", t)).strip() for t in v]
            for k, v in json.loads(done.stdout).items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default="small", help="Whisper model (default: small)")
    args = parser.parse_args()
    lines = lines_from_js()
    built = sorted(BUILD.glob("*.json")) if BUILD.is_dir() else []
    if not built:
        print("No assembled scenes yet — run tools/assemble_scenes.py first.")
        return
    import whisper
    model = whisper.load_model(args.model)

    result, poor, audit = {}, [], []
    for mf in built:
        m = json.loads(mf.read_text())
        sid = m["id"]
        words = []
        for take in m["takes"]:
            text = " ".join(lines[sid][i] for i in take["lines"])
            src = DRY / (take["key"] + ".wav")
            tr = model.transcribe(str(src), language="en", word_timestamps=True,
                                  fp16=False, verbose=None,
                                  condition_on_previous_text=False)
            heard = [w for seg in tr["segments"] for w in seg.get("words", [])]
            item, fraction, diffs = align(text, heard, duration(src))
            audit.append({"take": take["key"], "exact": round(fraction, 4), "expected": text, "heard": tr["text"], "differences": diffs})
            shift = take["start"] - take["trim"]
            end = take["start"] + take["len"]
            for a, b in item["w"]:
                a = min(end, max(take["start"], a + shift))
                b = min(end, max(a, b + shift))
                words.append([round(a, 3), round(b, 3)])
            print(f"{take['key']:32} {len(item['w']):3} words, {fraction:.0%} exact")
            if fraction < 0.8 and len(item["w"]) > 2:
                poor.append((take["key"], fraction, diffs))
        result[sid] = {"dur": m["dur"], "script": "\n".join(lines[sid]), "w": words}

    review = ROOT / "scene" / "review"
    review.mkdir(exist_ok=True)
    (review / "alignment-audit.json").write_text(json.dumps(audit, indent=2))
    for key, fraction, diffs in poor:
        print(f"REVIEW {key}: {fraction:.0%} match; {diffs}")
    if poor:
        raise SystemExit("Some takes differ from their lines; timings were not written")
    OUT.write_text("/* Word timings for the scene comics: every transcript word of each scene\n"
                   "   file, in line order, [start, end] in seconds.\n"
                   "   Written by tools/align_scenes.py -- do not hand-edit. */\n"
                   "const SCENE_TIMINGS = " + json.dumps(result, separators=(",", ":")) + ";\n"
                   "if (typeof module !== 'undefined') module.exports = { SCENE_TIMINGS };\n")
    print(f"wrote {OUT} ({len(result)} scenes)")


if __name__ == "__main__":
    main()
