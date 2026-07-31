#!/usr/bin/env python3
"""
Pre-generate narration MP3s for the busy-pictures app using Microsoft Edge's
neural voices (free, via the edge-tts package).

Why pre-generate instead of using the browser's speechSynthesis:
  * Android only exposes the English accents whose voice data is installed on
    that particular handset, which is why only two accents ever worked.
  * Chrome on desktop falls back to robotic local voices.
  * Pre-generated files sound identical on every device and work offline.

Run it on your own machine (it needs to reach Microsoft's endpoint):

    pip install edge-tts
    python3 tools/make_audio.py --page 1
    python3 tools/make_audio.py            # all ten pages

It is resumable: anything already generated is skipped, so you can stop it
with Ctrl-C and run it again later.

Identical sentences share one file, so the ~22,000 sentences on pages 1-10
collapse to however many distinct strings there actually are.
"""

import argparse
import asyncio
import hashlib
import json
import os
import sys

VOICE_CHOICES = {
    "gb-female": "en-GB-SoniaNeural",
    "gb-male": "en-GB-RyanNeural",
    "us-female": "en-US-AriaNeural",
    "us-male": "en-US-GuyNeural",
    "au-female": "en-AU-NatashaNeural",
    "in-female": "en-IN-NeerjaNeural",
}

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, "spatial_index.json")


def audio_key(text: str) -> str:
    return hashlib.sha1(text.strip().encode("utf-8")).hexdigest()


def audio_path(root: str, key: str) -> str:
    return os.path.join(root, key[:2], key + ".mp3")


def collect_strings(pages):
    """Every string the app can speak: each sentence, plus each object name
    (spoken on its own when a grammar point does not apply to that object)."""
    data = json.load(open(INDEX, encoding="utf-8"))
    out = {}
    for page in pages:
        key = "wimmelbook_%d" % page
        for obj in data.get(key, []):
            out.setdefault(obj["name"].strip(), page)
            for field, value in obj.get("grammar_data", {}).items():
                if field == "subject":
                    continue
                value = value.strip()
                if value:
                    out.setdefault(value, page)
    return out


async def synth_one(sem, text, path, voice, rate, retries=3):
    import edge_tts

    os.makedirs(os.path.dirname(path), exist_ok=True)
    async with sem:
        for attempt in range(retries):
            try:
                comm = edge_tts.Communicate(text, voice, rate=rate)
                tmp = path + ".part"
                await comm.save(tmp)
                if os.path.getsize(tmp) == 0:
                    raise RuntimeError("empty audio")
                os.replace(tmp, path)
                return True
            except Exception as exc:  # noqa: BLE001 - report and retry
                if attempt == retries - 1:
                    print("  FAILED %r: %s" % (text[:60], exc), file=sys.stderr)
                    return False
                await asyncio.sleep(1.5 * (attempt + 1))
    return False


async def run(args):
    pages = [args.page] if args.page else list(range(1, 11))
    strings = collect_strings(pages)
    outdir = os.path.join(ROOT, args.outdir)

    todo = []
    for text in strings:
        path = audio_path(outdir, audio_key(text))
        if not os.path.exists(path):
            todo.append((text, path))

    print("pages          : %s" % ", ".join(str(p) for p in pages))
    print("distinct lines : %d" % len(strings))
    print("already done   : %d" % (len(strings) - len(todo)))
    print("to generate    : %d" % len(todo))
    print("voice          : %s" % args.voice)
    if not todo:
        print("nothing to do")
        return

    sem = asyncio.Semaphore(args.concurrency)
    done = 0
    batch = 200
    for start in range(0, len(todo), batch):
        chunk = todo[start:start + batch]
        results = await asyncio.gather(
            *[synth_one(sem, t, p, args.voice, args.rate) for t, p in chunk]
        )
        done += sum(1 for r in results if r)
        print("  %d/%d generated" % (done, len(todo)), flush=True)

    manifest = os.path.join(outdir, "manifest.json")
    existing = {}
    if os.path.exists(manifest):
        existing = json.load(open(manifest, encoding="utf-8"))
    for text in strings:
        key = audio_key(text)
        if os.path.exists(audio_path(outdir, key)):
            existing[key] = True
    json.dump(existing, open(manifest, "w", encoding="utf-8"))
    print("manifest: %d entries -> %s" % (len(existing), manifest))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--page", type=int, help="only this page (1-10)")
    ap.add_argument("--voice", default=VOICE_CHOICES["gb-female"],
                    help="edge-tts voice, e.g. en-GB-SoniaNeural. "
                         "Shortcuts: " + ", ".join(VOICE_CHOICES))
    ap.add_argument("--rate", default="-8%",
                    help="speech rate, slower suits learners (default -8%%)")
    ap.add_argument("--outdir", default="audio")
    ap.add_argument("--concurrency", type=int, default=6)
    args = ap.parse_args()
    args.voice = VOICE_CHOICES.get(args.voice, args.voice)
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
