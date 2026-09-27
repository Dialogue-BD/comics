#!/usr/bin/env python3
"""Karaoke timings for the scene comics, one recording per line.

The same method as tools/align.py (and its alignment code, imported from it):
local Whisper times the clean takes in scene/_dry-originals/, and the words
the page displays -- the lines in scenes.js, with the <tag> audio cues
removed -- are matched to them. Writes scene-timings.js.

Lines with no recording yet are skipped, so this can run after every batch;
the page estimates word timing for any line not in the file.

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
SRC = ROOT / "scene" / "_dry-originals"
SCENES = ROOT / "scenes.js"
OUT = ROOT / "scene-timings.js"
TAG = re.compile(r"<[^>]+>\s*")


def lines_from_js():
    code = r'''
const vm=require("vm"), fs=require("fs"), c={}; vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8")+";this.O=SCENES", c);
const out={};
for (const id in c.O) c.O[id].lines.forEach((L,i)=>out[id+"-"+String(i+1).padStart(2,"0")]=L.t);
console.log(JSON.stringify(out));
'''
    done = subprocess.run(["node", "-e", code, str(SCENES)], capture_output=True,
                          text=True, check=True)
    return {k: re.sub(r"\s+", " ", TAG.sub("", v)).strip()
            for k, v in json.loads(done.stdout).items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default="small", help="Whisper model (default: small)")
    args = parser.parse_args()
    lines = lines_from_js()
    todo = [(k, t) for k, t in sorted(lines.items())
            if (SRC / (k + ".wav")).is_file() or (SRC / (k + ".mp3")).is_file()]
    print(f"{len(todo)} of {len(lines)} lines have a dry take")
    if not todo:
        return
    import whisper
    model = whisper.load_model(args.model)
    result, poor = {}, []
    for key, text in todo:
        src = SRC / (key + ".wav")
        if not src.is_file():
            src = SRC / (key + ".mp3")
        tr = model.transcribe(str(src), language="en", word_timestamps=True,
                              fp16=False, verbose=None,
                              condition_on_previous_text=False)
        words = [w for seg in tr["segments"] for w in seg.get("words", [])]
        item, fraction, diffs = align(text, words, duration(src))
        result[key] = item
        print(f"{key:34} {len(item['w']):3} words, {fraction:.0%} exact")
        if fraction < 0.8 and len(item["w"]) > 2:
            poor.append((key, fraction, diffs))
    for key, fraction, diffs in poor:
        print(f"REVIEW {key}: {fraction:.0%} match; {diffs}")
    if poor:
        raise SystemExit("Some takes differ from their lines; timings were not written")
    OUT.write_text("/* Word timings for the scene comics, one entry per recorded line.\n"
                   "   Written by tools/align_scenes.py -- do not hand-edit. */\n"
                   "const SCENE_TIMINGS = " + json.dumps(result, separators=(",", ":")) + ";\n"
                   "if (typeof module !== 'undefined') module.exports = { SCENE_TIMINGS };\n")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
