#!/usr/bin/env python3
"""Generate beat narration MP3s, export Gemini/Studio script, and measure timings.

Usage:
  python3 forevergreen/tools/build_narration.py                   # macOS say (Daniel) + ffmpeg
  python3 forevergreen/tools/build_narration.py --engine edge     # neural edge-tts upgrade
  python3 forevergreen/tools/build_narration.py --script-only     # export narration script only
"""

import argparse
import asyncio
import datetime
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORY_JS = ROOT / "story.js"
TIMINGS_JS = ROOT / "beat-timings.js"
SCRIPT_TXT = ROOT / "production" / "narration-script.txt"

FFMPEG = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
LOUDNORM = "loudnorm=I=-15:TP=-1.5:LRA=11"
MIN_GAP_SEC = 1.5
ACT_END_MARGIN_SEC = 0.5


def load_story() -> dict:
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            f"const {{ FOREVERGREEN_STORY }} = require({json.dumps(str(STORY_JS))});"
            "process.stdout.write(JSON.stringify(FOREVERGREEN_STORY));",
        ],
        text=True,
    )
    return json.loads(raw)


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        text=True,
    ).strip()
    return round(float(out), 3)


def export_script(story: dict) -> None:
    SCRIPT_TXT.parent.mkdir(parents=True, exist_ok=True)
    acts_by_id = {a["id"]: a for a in story["acts"]}
    lines = [
        "FOREVERGREEN — GPA PHASE 3 NARRATION SCRIPT",
        "Voice direction: Warm, unhurried storyteller (British or neutral General American),",
        "~155-165 words per minute. Leave calm pauses between beats so the film music breathes.",
        "Model recommendation: Gemini 2.5 Pro Preview TTS (Gacrux) or edge-tts en-GB-RyanNeural.",
        "",
    ]
    current_act = None
    for beat in story["beats"]:
        if beat["act"] != current_act:
            current_act = beat["act"]
            act = acts_by_id[current_act]
            lines.append(f"=== Act {act['id']}: {act['title']} ({act['start']}s-{act['end']}s) ===")
        mm, ss = divmod(beat["start"], 60)
        lines.append(f"[{beat['id']}] ({mm}:{ss:02d} / {beat['start']}s) {beat['text']}")
    lines.append("")
    SCRIPT_TXT.write_text("\n".join(lines), encoding="utf-8")


def normalize_to_mp3(src_audio: Path, dest_mp3: Path) -> None:
    dest_mp3.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        FFMPEG
        + [
            "-i",
            str(src_audio),
            "-af",
            LOUDNORM,
            "-ar",
            "44100",
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            str(dest_mp3),
        ],
        check=True,
    )


def build_say(beats: list, voice: str, rate: int) -> None:
    with tempfile.TemporaryDirectory(prefix="fg-say-", dir="/tmp") as tmpdir:
        tmp = Path(tmpdir)
        for beat in beats:
            aiff = tmp / f"{beat['id']}.aiff"
            mp3 = ROOT / beat["audio"]
            subprocess.run(
                ["/usr/bin/say", "-v", voice, "-r", str(rate), "-o", str(aiff), beat["text"]],
                check=True,
            )
            if not aiff.exists() or aiff.stat().st_size < 5000:
                raise RuntimeError(
                    f"say produced empty audio for {beat['id']} ({aiff.stat().st_size if aiff.exists() else 0} bytes). "
                    "macOS SpeechSynthesisServer must be reachable."
                )
            normalize_to_mp3(aiff, mp3)


async def _edge_synth_all(beats: list, voice: str, rate_pct: str, tmpdir: Path) -> None:
    import edge_tts

    sem = asyncio.Semaphore(4)

    async def one(beat):
        raw_mp3 = tmpdir / f"{beat['id']}_raw.mp3"
        dest_mp3 = ROOT / beat["audio"]
        async with sem:
            comm = edge_tts.Communicate(beat["text"], voice, rate=rate_pct)
            await comm.save(str(raw_mp3))
            normalize_to_mp3(raw_mp3, dest_mp3)

    await asyncio.gather(*(one(b) for b in beats))


def build_edge(beats: list, voice: str, rate_pct: str) -> None:
    with tempfile.TemporaryDirectory(prefix="fg-edge-", dir="/tmp") as tmpdir:
        asyncio.run(_edge_synth_all(beats, voice, rate_pct, Path(tmpdir)))


def write_timings_and_check(story: dict, engine: str, voice: str) -> int:
    acts_by_id = {a["id"]: a for a in story["acts"]}
    beats = story["beats"]
    durations = {}
    collisions = []

    for i, beat in enumerate(beats):
        mp3 = ROOT / beat["audio"]
        if not mp3.exists():
            raise FileNotFoundError(f"Missing audio file: {mp3}")
        dur = probe_duration(mp3)
        durations[beat["id"]] = dur
        end_time = beat["start"] + dur

        act = acts_by_id[beat["act"]]
        if end_time > act["end"] - ACT_END_MARGIN_SEC:
            collisions.append(
                f"{beat['id']} (Act {act['id']}) ends at {end_time:.2f}s, exceeding act end {act['end']}s - {ACT_END_MARGIN_SEC}s"
            )
        if i + 1 < len(beats):
            nxt = beats[i + 1]
            gap = nxt["start"] - end_time
            if gap < MIN_GAP_SEC:
                collisions.append(
                    f"{beat['id']} ({beat['start']}s + {dur:.2f}s = {end_time:.2f}s) leaves only {gap:.2f}s before {nxt['id']} ({nxt['start']}s)"
                )

    payload = {
        "version": story["version"],
        "engine": engine,
        "voice": voice,
        "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "durations": durations,
    }
    TIMINGS_JS.write_text(
        "const FOREVERGREEN_TIMINGS = "
        + json.dumps(payload, indent=2)
        + ";\nif (typeof module !== \"undefined\") module.exports = { FOREVERGREEN_TIMINGS };\n",
        encoding="utf-8",
    )

    print(f"Measured {len(durations)} beat MP3s -> {TIMINGS_JS.relative_to(ROOT.parent)}")
    if collisions:
        print("TIMING COLLISIONS FOUND:", file=sys.stderr)
        for c in collisions:
            print(f"  - {c}", file=sys.stderr)
        return 1
    print("Zero timing collisions (all gaps >= 1.5s and within act bounds).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", choices=("say", "edge", "measure"), default="say")
    parser.add_argument("--voice", default="")
    parser.add_argument("--rate", type=int, default=168, help="Words per minute for macOS say")
    parser.add_argument("--edge-rate", default="-4%", help="Rate string for edge-tts")
    parser.add_argument("--script-only", action="store_true", help="Write narration script text only")
    args = parser.parse_args()

    story = load_story()
    export_script(story)
    print(f"Wrote narration script -> {SCRIPT_TXT.relative_to(ROOT.parent)}")
    if args.script_only:
        return 0

    voice = args.voice or ("en-GB-RyanNeural" if args.engine == "edge" else "Daniel")
    if args.engine == "say":
        build_say(story["beats"], voice=voice, rate=args.rate)
    elif args.engine == "edge":
        build_edge(story["beats"], voice=voice, rate_pct=args.edge_rate)

    return write_timings_and_check(story, engine=args.engine, voice=voice)


if __name__ == "__main__":
    raise SystemExit(main())
