#!/usr/bin/env python3
"""Split two AI Studio recordings into the scene takes expected by the app.

Record all narrator lines, in script order, as one Sulafat take and all
character lines, in script order, as one two-speaker conversation. Save the
untouched WAVs as scene/_group-originals/<id>-narration.wav and
<id>-dialogue.wav. This tool uses local Whisper to find the word boundaries,
then cuts the recordings at the midpoints between scene segments. No API key
is used.

Run: python tools/split_grouped_scene_takes.py <scene-id> [--model small]
Then run assemble_scenes.py and align_scenes.py as usual.
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

from align import WORD, align, duration

ROOT = Path(__file__).resolve().parent.parent
GROUP = ROOT / "scene" / "_group-originals"
DRY = ROOT / "scene" / "_dry-originals"
TAG = re.compile(r"<[^>]+>\s*")


def scene_data(scene_id):
    code = r'''
const vm=require("vm"), fs=require("fs"), c={sceneId:process.argv[2]}; vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8")+
  ";this.O={S:SCENES[sceneId],G:sceneSegments(sceneId)}", c);
console.log(JSON.stringify(c.O));
'''
    done = subprocess.run(
        ["node", "-e", code, str(ROOT / "scenes.js"), scene_id],
        capture_output=True, text=True, check=True,
    )
    data = json.loads(done.stdout)
    if not data["S"]:
        raise ValueError(f"Unknown scene: {scene_id}")
    return data["S"], data["G"]


def clean(text):
    return re.sub(r"\s+", " ", TAG.sub("", text)).strip()


def split_kind(scene_id, scene, groups, kind, model):
    src = GROUP / f"{scene_id}-{kind}.wav"
    if not src.is_file():
        raise FileNotFoundError(src)
    lines = scene["lines"]
    indices = [i for i, line in enumerate(lines)
               if (line["w"] == "N") == (kind == "narration")]
    texts = [clean(lines[i]["t"]) for i in indices]
    counts = [len(WORD.findall(text)) for text in texts]
    script = " ".join(texts)
    transcribed = model.transcribe(
        str(src), language="en", word_timestamps=True, fp16=False,
        verbose=None, condition_on_previous_text=False,
    )
    heard = [word for seg in transcribed["segments"] for word in seg.get("words", [])]
    timed, fraction, differences = align(script, heard, duration(src))
    print(f"{src.name}: {len(timed['w'])} words, {fraction:.0%} exact")
    if fraction < 0.8:
        raise ValueError(f"Review {src.name}: {differences}")

    positions = {}
    offset = 0
    for index, count in zip(indices, counts):
        positions[index] = (offset, offset + count - 1)
        offset += count
    takes = [g for g in groups if g["kind"] == kind]
    spans = []
    for take in takes:
        first = positions[take["lines"][0]][0]
        last = positions[take["lines"][-1]][1]
        spans.append((timed["w"][first][0], timed["w"][last][1]))

    cuts = [0.0]
    for before, after in zip(spans, spans[1:]):
        cuts.append(round((before[1] + after[0]) / 2, 3))
    cuts.append(timed["dur"])
    DRY.mkdir(parents=True, exist_ok=True)
    for take, start, end in zip(takes, cuts, cuts[1:]):
        if end <= start:
            raise ValueError(f"Invalid cut for {take['key']}: {start}–{end}")
        out = DRY / f"{take['key']}.wav"
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", str(src),
            "-ss", str(start), "-t", str(round(end - start, 3)),
            "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(out),
        ], check=True)
        print(f"  {out.name}: {start:.2f}–{end:.2f}s")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scene_id")
    parser.add_argument("--model", default="small")
    parser.add_argument("--kind", choices=["narration", "dialogue"])
    args = parser.parse_args()
    scene, groups = scene_data(args.scene_id)
    import whisper
    model = whisper.load_model(args.model)
    for kind in ([args.kind] if args.kind else ("narration", "dialogue")):
        split_kind(args.scene_id, scene, groups, kind, model)


if __name__ == "__main__":
    main()
