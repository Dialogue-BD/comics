#!/usr/bin/env python3
"""Generate beat narration MP3s with Phonon TTS V1 (default), say, or edge-tts.

Usage:
  /Users/timothyhall/miniforge3/envs/phonon/bin/python forevergreen/tools/build_narration.py
  python3 forevergreen/tools/build_narration.py --engine say
  python3 forevergreen/tools/build_narration.py --engine edge
  python3 forevergreen/tools/build_narration.py --script-only
"""

import argparse
import asyncio
import datetime
import json
import re
import subprocess
import sys
import tempfile
import wave
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORY_JS = ROOT / "story.js"
WORD_GLOSSARY_JS = ROOT / "word-glossary.js"
SCENE_ITEMS_JS = ROOT / "scene-items.js"
TIMINGS_JS = ROOT / "beat-timings.js"
SCRIPT_TXT = ROOT / "production" / "narration-script.txt"
BEATS_DIR = ROOT / "audio" / "beats"
PHRASES_DIR = ROOT / "audio" / "phrases"
WORDS_DIR = ROOT / "audio" / "words"
ITEMS_DIR = ROOT / "audio" / "items"
ITEM_FORMS_DIR = ITEMS_DIR / "forms"

GRAMMAR_FORM_SLUGS = (
    ("presentContinuous", "now"),
    ("simplePast", "past"),
    ("simplePresent", "present"),
    ("question", "ask"),
)

PHONON_MODEL_ID = "gradium/phonon-31m-en"
PHONON_VOICES_REPO = "gradium/phonon-voices"
PHONON_VOICE_FILE = "voices/LMDIYE0Oa377Qh6Z.safetensors"

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


def load_scenes() -> list:
    if not SCENE_ITEMS_JS.exists():
        return []
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            f"const {{ FOREVERGREEN_SCENES }} = require({json.dumps(str(SCENE_ITEMS_JS))});"
            "process.stdout.write(JSON.stringify(FOREVERGREEN_SCENES));",
        ],
        text=True,
    )
    return json.loads(raw)


def load_word_glossary() -> dict:
    if not WORD_GLOSSARY_JS.exists():
        return {}
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            f"const {{ FOREVERGREEN_WORD_GLOSSARY }} = require({json.dumps(str(WORD_GLOSSARY_JS))});"
            "process.stdout.write(JSON.stringify(FOREVERGREEN_WORD_GLOSSARY));",
        ],
        text=True,
    )
    return json.loads(raw)


def word_slug(word: str) -> str:
    return re.sub(
        r"[^a-z0-9]+",
        "_",
        str(word).lower().replace("’", "apos").replace("'", "apos"),
    ).strip("_")


def word_targets(word_glossary: dict) -> list:
    items = []
    seen_slugs: dict[str, str] = {}
    for w in sorted(word_glossary.keys()):
        slug = word_slug(w)
        if not slug:
            continue
        if slug in seen_slugs and seen_slugs[slug] != w:
            raise ValueError(f"Word slug collision {slug!r} for {seen_slugs[slug]!r} and {w!r}")
        seen_slugs[slug] = w
        items.append({
            "id": slug,
            "word": w,
            "audio": f"audio/words/{slug}.mp3",
            "text": w.rstrip(".!?") + ".",
        })
    return items


def iter_item_entries(scenes: list):
    for scene in scenes:
        for item in scene.get("items", []):
            beats = item.get("beats")
            if isinstance(beats, list) and beats:
                for idx, beat in enumerate(beats):
                    yield item, beat, f"{item['id']}__b{idx}"
            else:
                yield item, item, item["id"]


def scene_item_targets(scenes: list) -> list:
    items = []
    seen_audio: set[str] = set()
    for item, src, tid in iter_item_entries(scenes):
        name = str(item.get("name", "")).strip()
        sentence = str(src.get("sentence", "")).strip()
        audio = str(src.get("audio", "")).strip()
        if name and sentence and audio and audio not in seen_audio:
            seen_audio.add(audio)
            items.append({
                "id": tid,
                "audio": audio,
                "text": name.rstrip(".!?") + ".",
                "example": sentence,
            })
    return items


def scene_item_form_targets(scenes: list) -> list:
    forms = []
    seen_audio: set[str] = set()
    for item, src, tid in iter_item_entries(scenes):
        grammar = src.get("grammar") or {}
        grammar_audio = src.get("grammarAudio") or {}
        stem = Path(str(src.get("audio") or f"audio/items/{tid}.mp3")).stem or tid
        for gkey, slug in GRAMMAR_FORM_SLUGS:
            gtext = str(grammar.get(gkey, "")).strip()
            audio = str(grammar_audio.get(gkey) or f"audio/items/forms/{stem}__{slug}.mp3").strip()
            if gtext and audio and audio not in seen_audio:
                seen_audio.add(audio)
                forms.append({
                    "id": f"{stem}__{slug}",
                    "item_id": tid,
                    "form": slug,
                    "audio": audio,
                    "text": gtext,
                })
    return forms


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
        "FOREVERGREEN — GPA PHASE 3 NARRATION SCRIPT (ZERO-SPOILER TIMED)",
        "Voice: Phonon 31M EN V1 (voices/LMDIYE0Oa377Qh6Z.safetensors)",
        "Direction: Warm, unhurried storyteller. Leave calm pauses between beats so film music breathes.",
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


def normalize_to_mp3(src_audio: Path, dest_mp3: Path, bitrate: str = "96k", mono: bool = False) -> None:
    dest_mp3.parent.mkdir(parents=True, exist_ok=True)
    cmd = FFMPEG + [
        "-i",
        str(src_audio),
        "-af",
        LOUDNORM,
        "-ar",
        "44100",
    ]
    if mono:
        cmd += ["-ac", "1"]
    cmd += [
        "-codec:a",
        "libmp3lame",
        "-b:a",
        bitrate,
        str(dest_mp3),
    ]
    subprocess.run(cmd, check=True)


def phrase_slug(phrase: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", phrase.lower()).strip("-")


def phrase_items(story: dict) -> list:
    items = []
    for phrase, entry in story.get("glossary", {}).items():
        slug = phrase_slug(phrase)
        example = str((entry or {}).get("example") or "").strip()
        items.append({
            "id": slug,
            "phrase": phrase,
            "audio": f"audio/phrases/{slug}.mp3",
            "text": phrase.rstrip(".!?") + ".",
            "example": example,
        })
    return items


def prune_stale_dir(directory: Path, items: list) -> None:
    expected = {(ROOT / p["audio"]).resolve() for p in items}
    if directory.exists():
        for mp3 in directory.glob("*.mp3"):
            if mp3.resolve() not in expected:
                mp3.unlink()


def tts_text(text: str) -> str:
    """Apply pronunciation respellings for TTS engines without altering displayed text."""
    text = re.sub(r"\bpinecone(s?)\b", r"pine cone\1", text, flags=re.IGNORECASE)
    text = re.sub(r"\bchasm(s?)\b", r"kasm\1", text, flags=re.IGNORECASE)
    return text


def _build_phonon_shard(worker_id: int, total_workers: int, beats: list) -> None:
    import numpy as np
    import torch
    from huggingface_hub import hf_hub_download
    from safetensors.torch import load_file
    from transformers import AutoProcessor, GradiumPhononTTSForConditionalGeneration

    prefix = f"[w{worker_id}/{total_workers}] " if total_workers > 1 else ""
    if total_workers > 1:
        torch.set_num_threads(1)
    print(f"{prefix}Loading Phonon 31m ({PHONON_VOICE_FILE}) ...", flush=True)
    processor = AutoProcessor.from_pretrained(PHONON_MODEL_ID)
    model = GradiumPhononTTSForConditionalGeneration.from_pretrained(PHONON_MODEL_ID)
    model.eval()
    voice_latents = load_file(hf_hub_download(PHONON_VOICES_REPO, PHONON_VOICE_FILE))["speaker_wavs"][0].T
    sample_rate = processor.feature_extractor.sampling_rate

    pcm_cache: dict[str, bytes] = {}

    def synth_pcm(spoken_text: str) -> bytes:
        spoken = tts_text(spoken_text)
        if spoken in pcm_cache:
            return pcm_cache[spoken]
        conversation = [{"role": "user", "content": [{"type": "audio"}, {"type": "text", "text": spoken}]}]
        inputs = processor.apply_chat_template(
            conversation,
            tokenize=True,
            return_dict=True,
            add_generation_prompt=True,
            processor_kwargs={"audio_prompt_latents": [voice_latents]},
        ).to(model.device)
        with torch.no_grad():
            outputs = model.generate(**inputs)
        samples = processor.decode(outputs.audio_latents, outputs.audio_latents_mask)[0].cpu().float().numpy()
        peak = float(np.abs(samples).max()) if samples.size else 0.0
        if peak > 0.99:
            samples = samples * (0.99 / peak)
        raw_pcm = (np.clip(samples, -1.0, 1.0) * 32767.0).astype("<i2").tobytes()
        pcm_cache[spoken] = raw_pcm
        return raw_pcm

    gap_pcm = b"\x00\x00" * int(sample_rate * 0.45)

    with tempfile.TemporaryDirectory(prefix=f"fg-phonon-{worker_id}-", dir="/tmp") as tmpdir:
        tmp = Path(tmpdir)
        for i, beat in enumerate(beats, 1):
            example = str(beat.get("example") or "").strip()
            if example:
                phrase_pcm = synth_pcm(beat["text"])
                example_pcm = synth_pcm(example)
                pcm = phrase_pcm + gap_pcm + example_pcm + gap_pcm + phrase_pcm
            else:
                pcm = synth_pcm(beat["text"])

            wav_path = tmp / f"{beat['id']}.wav"
            with wave.open(str(wav_path), "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(sample_rate)
                wf.writeframes(pcm)

            mp3_path = ROOT / beat["audio"]
            is_item = beat["audio"].startswith("audio/items/")
            normalize_to_mp3(wav_path, mp3_path, bitrate="64k" if is_item else "96k", mono=is_item)
            if len(beats) <= 100 or i == 1 or i == len(beats) or i % 20 == 0:
                print(f"  {prefix}[{i}/{len(beats)}] {beat['id']} -> {mp3_path.name}", flush=True)


def build_phonon(beats: list, workers: int = 1) -> None:
    if not beats:
        return
    workers = max(1, min(workers, len(beats)))
    if workers == 1:
        _build_phonon_shard(1, 1, beats)
        return

    shards = [beats[w::workers] for w in range(workers)]
    with ProcessPoolExecutor(max_workers=workers) as pool:
        futures = [
            pool.submit(_build_phonon_shard, idx + 1, workers, shard)
            for idx, shard in enumerate(shards)
        ]
        for fut in futures:
            fut.result()


def build_say(beats: list, voice: str, rate: int) -> None:
    with tempfile.TemporaryDirectory(prefix="fg-say-", dir="/tmp") as tmpdir:
        tmp = Path(tmpdir)
        for beat in beats:
            aiff = tmp / f"{beat['id']}.aiff"
            mp3 = ROOT / beat["audio"]
            subprocess.run(
                ["/usr/bin/say", "-v", voice, "-r", str(rate), "-o", str(aiff), tts_text(beat["text"])],
                check=True,
            )
            if not aiff.exists() or aiff.stat().st_size < 5000:
                raise RuntimeError(f"say produced empty audio for {beat['id']}.")
            normalize_to_mp3(aiff, mp3)


async def _edge_synth_all(beats: list, voice: str, rate_pct: str, tmpdir: Path) -> None:
    import edge_tts

    sem = asyncio.Semaphore(4)

    async def one(beat):
        raw_mp3 = tmpdir / f"{beat['id']}_raw.mp3"
        dest_mp3 = ROOT / beat["audio"]
        async with sem:
            comm = edge_tts.Communicate(tts_text(beat["text"]), voice, rate=rate_pct)
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

    phrase_audio = {}
    for item in phrase_items(story):
        if (ROOT / item["audio"]).exists():
            phrase_audio[item["phrase"]] = item["audio"]

    word_audio = {}
    for witem in word_targets(load_word_glossary()):
        if (ROOT / witem["audio"]).exists():
            word_audio[witem["word"]] = witem["audio"]

    payload = {
        "version": story["version"],
        "engine": engine,
        "voice": voice,
        "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "durations": durations,
        "phraseAudio": phrase_audio,
        "wordAudio": word_audio,
    }
    TIMINGS_JS.write_text(
        "const FOREVERGREEN_TIMINGS = "
        + json.dumps(payload, indent=2)
        + ";\nif (typeof module !== \"undefined\") module.exports = { FOREVERGREEN_TIMINGS };\n",
        encoding="utf-8",
    )

    print(
        f"Measured {len(durations)} beat MP3s + {len(phrase_audio)} phrase MP3s + {len(word_audio)} word MP3s -> {TIMINGS_JS.relative_to(ROOT.parent)}"
    )
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
    parser.add_argument("--beats", default="", help="Comma-separated beat IDs to regenerate (e.g. b05,b06)")
    parser.add_argument("--phrases-only", action="store_true", help="Regenerate only glossary phrase MP3s")
    parser.add_argument("--phrases", default="", help="Comma-separated phrase slugs to regenerate")
    parser.add_argument("--words-only", action="store_true", help="Regenerate only transcript word MP3s")
    parser.add_argument("--items-only", action="store_true", help="Regenerate only Busy-Picture scene item MP3s")
    parser.add_argument("--item-forms-only", action="store_true", help="Regenerate only Busy-Picture item grammar-form MP3s")
    parser.add_argument("--items", default="", help="Comma-separated scene item IDs to regenerate")
    parser.add_argument("--skip-existing", action="store_true", help="Skip targets whose MP3 already exists (> 1000 bytes)")
    parser.add_argument("--workers", type=int, default=1, help="Parallel Phonon synthesis worker count")
    parser.add_argument("--script-only", action="store_true", help="Write narration script text only")
    args = parser.parse_args()

    story = load_story()
    export_script(story)
    print(f"Wrote narration script -> {SCRIPT_TXT.relative_to(ROOT.parent)}")
    if args.script_only:
        return 0

    scenes = load_scenes()
    all_phrases = phrase_items(story)
    all_words = word_targets(load_word_glossary())
    all_items = scene_item_targets(scenes)
    all_item_forms = scene_item_form_targets(scenes)
    prune_stale_dir(BEATS_DIR, story["beats"])
    prune_stale_dir(PHRASES_DIR, all_phrases)
    if all_words:
        prune_stale_dir(WORDS_DIR, all_words)
    if all_items:
        prune_stale_dir(ITEMS_DIR, all_items)
    if all_item_forms:
        prune_stale_dir(ITEM_FORMS_DIR, all_item_forms)

    selected_beats = {b.strip() for b in args.beats.split(",") if b.strip()}
    selected_phrases = {p.strip() for p in args.phrases.split(",") if p.strip()}
    selected_items = {it.strip() for it in args.items.split(",") if it.strip()}

    targets = []
    if args.item_forms_only:
        if selected_items:
            targets = [f for f in all_item_forms if f["item_id"] in selected_items]
            if not targets:
                print(f"No matching item forms for --items={args.items}", file=sys.stderr)
                return 1
        else:
            targets = all_item_forms
    elif args.items_only:
        targets = all_items
    elif args.words_only:
        targets = all_words
    elif selected_items:
        targets = [it for it in all_items if it["id"] in selected_items] + [
            f for f in all_item_forms if f["item_id"] in selected_items
        ]
        if not targets:
            print(f"No matching items for --items={args.items}", file=sys.stderr)
            return 1
    elif args.phrases_only:
        targets = all_phrases
    elif selected_phrases:
        targets = [p for p in all_phrases if p["id"] in selected_phrases]
        if not targets:
            print(f"No matching phrases for --phrases={args.phrases}", file=sys.stderr)
            return 1
    elif selected_beats:
        targets = [b for b in story["beats"] if b["id"] in selected_beats]
        if not targets:
            print(f"No matching beats for --beats={args.beats}", file=sys.stderr)
            return 1
    elif args.engine != "measure":
        targets = list(story["beats"]) + list(all_phrases) + list(all_words) + list(all_items) + list(all_item_forms)

    if args.skip_existing and targets:
        before = len(targets)
        targets = [
            t for t in targets
            if not ((ROOT / t["audio"]).exists() and (ROOT / t["audio"]).stat().st_size > 1000)
        ]
        print(f"Skipping {before - len(targets)} existing MP3s; {len(targets)} remaining.")

    if args.engine == "phonon":
        voice = args.voice or "phonon-31m-en/V1"
        build_phonon(targets, workers=args.workers)
    elif args.engine == "say":
        voice = args.voice or "Daniel"
        build_say(targets, voice=voice, rate=args.rate)
    elif args.engine == "edge":
        voice = args.voice or "en-GB-RyanNeural"
        build_edge(targets, voice=voice, rate_pct=args.edge_rate)
    else:
        voice = args.voice or "phonon-31m-en/V1"

    recorded_engine = "phonon" if args.engine == "measure" else args.engine
    return write_timings_and_check(story, engine=recorded_engine, voice=voice)


if __name__ == "__main__":
    raise SystemExit(main())
