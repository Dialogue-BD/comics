#!/usr/bin/env python3
"""Fill unrecorded words and card-back questions with Edge stand-ins.

    python3 -m pip install --user edge-tts      # once
    python3 scripts/edge_backup.py              # from the picture-this-bangla folder

Each clip is trimmed and levelled to match the Gemini recordings (needs ffmpeg).
An ordinary run fills missing files in audio/ and question-audio/. Each
directory keeps its own sources.json so Edge clips can be upgraded to Gemini
one at a time. Refresh the audio index after recording.
Runs on Python 3.8+.

Options
    --questions  record only missing back-of-card questions
    --test       record 4 words with ড়/ঢ় both ways (as spelled on the card, and
                 with the single-character ড়/ঢ়) into ~/Desktop/edge-rr-test/
    --redo-rr    re-record every Edge word containing ড়/ঢ় using the
                 single-character form (never touches Gemini recordings)
"""
import argparse, asyncio, json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

from build_web import load_questions

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.environ.get("EDGE_VOICE", "bn-BD-NabanitaNeural")
RATE = os.environ.get("EDGE_RATE", "-10%")


RR_DECOMPOSED = ("\u09a1\u09bc", "\u09a2\u09bc")          # ড + ় , ঢ + ়


def tts_text(label):
    """What Edge is given: the card spelling with ড়/ঢ় as single characters.
    The cards write them as letter + nukta, and Edge drops the nukta."""
    return label.replace("\u09a1\u09bc", "\u09dc").replace("\u09a2\u09bc", "\u09dd")


def has_rr(label):
    return any(x in label for x in RR_DECOMPOSED) or "\u09dc" in label or "\u09dd" in label


TARGET_LUFS = -16.6       # median loudness of the Gemini recordings
FFMPEG = shutil.which("ffmpeg") or next((p for p in ("/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg") if os.path.exists(p)), None)


def _lufs(path):
    out = subprocess.run([FFMPEG, "-hide_banner", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    vals = [l for l in out.splitlines() if l.strip().startswith("I:")]
    return float(vals[-1].split()[1]) if vals else None


def finish_clip(path):
    """Match the Gemini clips: trim Edge's silence to 80 ms before / 150 ms after,
    level to TARGET_LUFS with peaks under -1 dBFS, 64 kbps mono MP3 at 24 kHz."""
    trim = ("silenceremove=start_periods=1:start_threshold=-50dB:detection=peak,areverse,"
            "silenceremove=start_periods=1:start_threshold=-50dB:detection=peak,areverse,"
            "adelay=80:all=1,apad=pad_dur=0.15,afade=t=in:d=0.01")
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "t.wav")
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", path, "-af", trim, "-ac", "1", "-ar", "24000", wav], check=True)
        cur = _lufs(wav)
        gain = (TARGET_LUFS - cur) if cur is not None and cur > -70 else 0.0
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", wav, "-af", "volume=%.2fdB,alimiter=limit=0.89:level=false" % gain,
                        "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", "64k", "-f", "mp3", path],
                       check=True)


def load_deck():
    txt = open(os.path.join(HERE, "deck-data.js"), encoding="utf-8").read()
    return json.loads(txt.split("window.PTB_DECK = ", 1)[1].split(";\nwindow.PICTURE_THIS_GAME_DATA", 1)[0])


def read_sources(path):
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


async def record_missing(edge_tts, items, directory, kind, workers, redo_rr=False):
    directory.mkdir(parents=True, exist_ok=True)
    source_path = directory / "sources.json"
    if redo_rr:
        sources = read_sources(source_path)
        todo = [item for item in items if has_rr(item["label"])
                and sources.get(item["id"], "edge").startswith("edge")]
    else:
        todo = [item for item in items if not (directory / (item["id"] + ".mp3")).is_file()]
    print(f"{len(todo)} {kind} need a stand-in recording ({VOICE}, rate {RATE}).", flush=True)
    if not todo:
        return 0
    sem = asyncio.Semaphore(workers)
    done, failed = [], []

    async def one(item, staging):
        key, label = item["id"], item["label"]
        out = directory / (key + ".mp3")
        tmp = staging / (key + ".mp3")
        async with sem:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(tts_text(label), VOICE, rate=RATE).save(str(tmp))
                    if tmp.stat().st_size < 1500:
                        raise RuntimeError("empty audio")
                    if FFMPEG:
                        await asyncio.get_running_loop().run_in_executor(None, finish_clip, str(tmp))
                except Exception as exc:
                    error = exc
                    await asyncio.sleep(2 + attempt * 3)
                else:
                    break
            else:
                failed.append(f"{key} ({label}): {error}")
                return

            sources = read_sources(source_path)
            if redo_rr:
                if sources.get(key, "edge").startswith("edge"):
                    tmp.replace(out)
                else:
                    return
            else:
                try:
                    os.link(tmp, out)  # Publish this clip only if no recording has appeared meanwhile.
                except FileExistsError:
                    return
            sources[key] = "edge:" + VOICE + ("+single-char-rr" if has_rr(label) else "")
            pending_sources = staging / "sources.json"
            pending_sources.write_text(json.dumps(dict(sorted(sources.items())), indent=1, ensure_ascii=False),
                                       encoding="utf-8")
            pending_sources.replace(source_path)
            done.append(key)
            if len(done) % 25 == 0:
                print(f"  {len(done)}/{len(todo)} {kind}", flush=True)

    with tempfile.TemporaryDirectory(dir=directory, prefix=".edge-") as staging:
        await asyncio.gather(*(one(item, Path(staging)) for item in todo))
    print(f"Done: {len(done)} {kind} saved, {len(failed)} failed.", flush=True)
    for failure in failed:
        print("  FAILED", failure)
    return len(failed)


async def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--questions", action="store_true", help="Fill only missing question recordings.")
    mode.add_argument("--test", action="store_true", help="Record example word spellings for comparison.")
    mode.add_argument("--redo-rr", action="store_true", help="Refresh existing Edge words containing ড়/ঢ়.")
    args = parser.parse_args()
    try:
        import edge_tts
    except ImportError:
        sys.exit("edge-tts is not installed. Run:  python3 -m pip install --user edge-tts")
    items = [] if args.questions else [it for card in load_deck()["cards"] for it in card["items"]]
    if args.test:
        out = os.path.expanduser("~/Desktop/edge-rr-test")
        os.makedirs(out, exist_ok=True)
        picks = [it for it in items if has_rr(it["label"])][:4]
        for n, it in enumerate(picks, 1):
            await edge_tts.Communicate(it["label"], VOICE, rate=RATE).save(os.path.join(out, f"{n}a-as-spelled-{it['id']}.mp3"))
            await edge_tts.Communicate(tts_text(it["label"]), VOICE, rate=RATE).save(os.path.join(out, f"{n}b-single-char-{it['id']}.mp3"))
            print(f"{n}. {it['label']}  ({it['gloss']})")
        print("Saved to", out, "- compare each a (as spelled) with b (single-character ড়/ঢ়).")
        os.system('open "%s"' % out)
        return
    failed = 0
    if not args.questions:
        failed = await record_missing(edge_tts, items, Path(HERE) / "audio", "words", 4, args.redo_rr)
    if not args.redo_rr:
        questions = load_questions()
        if args.questions and not questions:
            parser.error("Build question-data.js with build_web.py --source before recording.")
        question_items = [{"id": key, "label": text} for record in questions.values()
                          for key, text in zip(record["ids"], record["questions"])]
        if question_items:
            failed += await record_missing(edge_tts, question_items, Path(HERE) / "question-audio", "questions", 16)
    if failed:
        sys.exit("Run the same command again to retry missing recordings.")


if __name__ == "__main__":
    asyncio.run(main())
