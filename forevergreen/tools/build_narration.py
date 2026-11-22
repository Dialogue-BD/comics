#!/usr/bin/env python3
"""Generate beat narration MP3s, export Gemini/Studio script, and measure timings.

Usage:
  conda activate phonon
  python3 forevergreen/tools/build_narration.py                   # Phonon V1 (default): beats + phrases
  python3 forevergreen/tools/build_narration.py --engine say      # macOS say (Daniel) + ffmpeg
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


# ---------------------------------------------------------------- Phonon
# Same model, voice and conda env as the Busy Pictures clips: runs on the Mac,
# no key, no cost. Clips go through the same loudnorm -> MP3 step as the others.
PHONON_MODEL = "gradium/phonon-31m-en"
PHONON_VOICES_REPO = "gradium/phonon-voices"
PHONON_VOICE_FILE = "voices/LMDIYE0Oa377Qh6Z.safetensors"   # "V1"
PHRASE_GAP_SEC = 0.8


class PhononVoice:
    def __init__(self):
        import torch
        from huggingface_hub import hf_hub_download
        from safetensors.torch import load_file
        from transformers import AutoProcessor, GradiumPhononTTSForConditionalGeneration
        self.torch = torch
        print("Loading Phonon 31m (English), voice V1 ...")
        self.processor = AutoProcessor.from_pretrained(PHONON_MODEL)
        self.model = GradiumPhononTTSForConditionalGeneration.from_pretrained(PHONON_MODEL)
        self.model.eval()
        self.voice = load_file(hf_hub_download(PHONON_VOICES_REPO, PHONON_VOICE_FILE))["speaker_wavs"][0].T
        self.rate = self.processor.feature_extractor.sampling_rate

    def samples(self, text):
        import numpy as np
        conv = [{"role": "user", "content": [{"type": "audio"}, {"type": "text", "text": text}]}]
        inputs = self.processor.apply_chat_template(
            conv, tokenize=True, return_dict=True, add_generation_prompt=True,
            processor_kwargs={"audio_prompt_latents": [self.voice]},
        ).to(self.model.device)
        with self.torch.no_grad():
            out = self.model.generate(**inputs)
        x = np.asarray(self.processor.decode(out.audio_latents, out.audio_latents_mask)[0].cpu().float().numpy()).reshape(-1)
        return trim_silence(x, self.rate)


def trim_silence(x, rate, pad=0.06):
    import numpy as np
    hop = max(1, int(rate * 0.02))
    n = len(x) // hop
    if n == 0:
        return x
    rms = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    on = np.flatnonzero(rms > max(rms.max() * 0.06, 1e-4))
    if not on.size:
        return x
    a = max(0, on[0] * hop - int(pad * rate))
    b = min(len(x), (on[-1] + 1) * hop + int(pad * rate))
    return x[a:b]


def write_wav(path: Path, x, rate: int) -> None:
    import wave
    import numpy as np
    peak = float(np.abs(x).max()) if x.size else 0.0
    if peak > 0.99:
        x = x * (0.99 / peak)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def phrase_slug(phrase: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", phrase.lower()).strip("-")


def build_phonon(story: dict) -> dict:
    """All 35 beats, plus every glossary phrase as phrase · example · phrase.
    Returns {phrase: "audio/phrases/<slug>.mp3"} for the timings file."""
    import numpy as np
    voice = PhononVoice()
    rate = voice.rate
    phrases = {}
    with tempfile.TemporaryDirectory(prefix="fg-phonon-", dir="/tmp") as tmpdir:
        tmp = Path(tmpdir)
        beats = story["beats"]
        for i, beat in enumerate(beats, 1):
            wav = tmp / f"{beat['id']}.wav"
            write_wav(wav, voice.samples(beat["text"]), rate)
            normalize_to_mp3(wav, ROOT / beat["audio"])
            print(f"  beat {i}/{len(beats)} {beat['id']}")
        gloss = story.get("glossary", {})
        gap = np.zeros(int(PHRASE_GAP_SEC * rate), dtype=np.float32)
        for i, (phrase, entry) in enumerate(gloss.items(), 1):
            spoken = phrase[:1].upper() + phrase[1:] + "."
            parts = [voice.samples(spoken)]
            if entry.get("example"):
                parts += [gap, voice.samples(entry["example"]), gap, voice.samples(spoken)]
            rel = f"audio/phrases/{phrase_slug(phrase)}.mp3"
            wav = tmp / f"p{i}.wav"
            write_wav(wav, np.concatenate(parts), rate)
            normalize_to_mp3(wav, ROOT / rel)
            phrases[phrase] = rel
            print(f"  phrase {i}/{len(gloss)} {phrase}")
    return phrases


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


def write_timings_and_check(story: dict, engine: str, voice: str, phrases: dict = None) -> int:
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
    if phrases:
        payload["phrases"] = phrases
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
    parser.add_argument("--engine", choices=("phonon", "say", "edge", "measure"), default="phonon")
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

    voice = args.voice or {"edge": "en-GB-RyanNeural", "phonon": "Phonon V1"}.get(args.engine, "Daniel")
    phrases = None
    if args.engine == "phonon":
        phrases = build_phonon(story)
    elif args.engine == "say":
        build_say(story["beats"], voice=voice, rate=args.rate)
    elif args.engine == "edge":
        build_edge(story["beats"], voice=voice, rate_pct=args.edge_rate)

    return write_timings_and_check(story, engine=args.engine, voice=voice, phrases=phrases)


if __name__ == "__main__":
    raise SystemExit(main())
