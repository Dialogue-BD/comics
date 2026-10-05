#!/usr/bin/env python3
"""Audit and align the Hingsha narration with local Whisper.

The English script in story.js is canonical. Whisper supplies word boundaries;
the shared Culture Circles aligner reconciles ASR spelling and contractions to
one interval for every displayed word. No API key or remote service is used.

Run with the Python environment that has openai-whisper installed:

    python tools/align_story.py --model small
"""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT.parent
SHARED_TOOLS = PROJECT / "ethnographic-interviews" / "tools"
sys.path.insert(0, str(SHARED_TOOLS))
from align import align, duration  # noqa: E402

AUDIO = ROOT / "audio" / "hingsha-story.mp3"
STORY = ROOT / "story.js"
OUT = ROOT / "story-timings.js"
AUDIT = ROOT / "review" / "alignment-audit.json"


def load_script():
    code = r'''
const {HINGSHA_STORY:S}=require(process.argv[1]);
console.log(JSON.stringify(S.lines.map(x=>x.text)));
'''
    done = subprocess.run(["node", "-e", code, str(STORY)], check=True,
                          capture_output=True, text=True)
    return json.loads(done.stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default="small")
    args = parser.parse_args()
    if not AUDIO.is_file():
        raise FileNotFoundError(AUDIO)

    lines = load_script()
    script = "\n".join(lines)
    import whisper
    model = whisper.load_model(args.model)
    transcription = model.transcribe(
        str(AUDIO), language="en", word_timestamps=True, fp16=False,
        verbose=None, condition_on_previous_text=False)
    heard = [word for segment in transcription["segments"]
             for word in segment.get("words", [])]
    timing, fraction, differences = align(script, heard, duration(AUDIO))
    timing.update({
        "script": script,
        "method": f"Whisper {args.model} word timestamps reconciled to exact script",
        "audio_sha256": hashlib.sha256(AUDIO.read_bytes()).hexdigest(),
    })
    audit = {
        "model": args.model,
        "audio": str(AUDIO.relative_to(ROOT)),
        "audio_sha256": timing["audio_sha256"],
        "duration": timing["dur"],
        "expected": script,
        "heard": transcription["text"].strip(),
        "exact_fraction": round(fraction, 4),
        "differences": differences,
        "word_count": len(timing["w"]),
    }
    AUDIT.parent.mkdir(exist_ok=True)
    AUDIT.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(timing['w'])} words, {fraction:.1%} exact ASR match")
    if differences:
        print(json.dumps(differences, ensure_ascii=False, indent=2))
    if fraction < .90:
        raise SystemExit("Transcript and recording differ too much; timings were not written")

    header = ("/* Exact Hingsha script aligned to audio/hingsha-story.mp3 with local Whisper.\n"
              "   One [start, end] interval per displayed word. Regenerate after any script or audio edit. */\n")
    OUT.write_text(header + "const HINGSHA_TIMINGS = "
                   + json.dumps(timing, separators=(",", ":"), ensure_ascii=False)
                   + ";\nif (typeof module !== 'undefined') module.exports = { HINGSHA_TIMINGS };\n")
    print(f"wrote {OUT}")
    print(f"wrote {AUDIT}")


if __name__ == "__main__":
    main()
