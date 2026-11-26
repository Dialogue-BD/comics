#!/usr/bin/env python3
"""Fill unrecorded words, card-back questions and Nurturer phrases with Edge stand-ins.

    python3 -m pip install --user edge-tts      # once
    python3 scripts/edge_backup.py              # from the picture-this-bangla folder

Each clip is trimmed and levelled to match the Gemini recordings (needs ffmpeg).
An ordinary run fills missing files in audio/, question-audio/ and nurturer-audio/. Each
directory keeps its own sources.json so Edge clips can be upgraded to Gemini
one at a time. Refresh the audio index after recording.
Runs on Python 3.8+.

Options
    --questions  record only missing back-of-card questions
    --nurturer   record only missing Nurturer phrases
    --test       record 4 words with ড়/ঢ় both ways (as spelled on the card, and
                 with the single-character ড়/ঢ়) into ~/Desktop/edge-rr-test/
    --redo-rr    re-record every Edge word containing ড়/ঢ় using the
                 single-character form (never touches Gemini recordings)
    --test-respell  for each word in scripts/edge_respell.json, record an example
                 as spelled and with each spelling in its "try" list into
                 ~/Desktop/edge-respell-test/
    --redo-respell  re-record Edge words, questions and phrases whose Edge text changes
                 under scripts/edge_respell.json (never touches Gemini recordings)

Respellings: scripts/edge_respell.json lists everyday words Edge says wrongly
(কোন, কেন, যেন ...) and the spelling Edge is given instead. Only the text sent to
Edge changes. Add a word there when a nurturer reports one, check it with
--test-respell, then run --redo-respell.
"""
import argparse, asyncio, hashlib, json, os, shutil, subprocess, sys, tempfile, unicodedata
from pathlib import Path

from build_web import load_questions, load_web_deck, nurturer_phrases
from edge_respell import respell, load_list, hits

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.environ.get("EDGE_VOICE", "bn-BD-NabanitaNeural")
RATE = os.environ.get("EDGE_RATE", "-10%")


RR_DECOMPOSED = ("\u09a1\u09bc", "\u09a2\u09bc")          # ড + ় , ঢ + ়


def rr_text(label):
    """The card spelling with ড়/ঢ় as single characters.
    The cards write them as letter + nukta, and Edge drops the nukta."""
    return label.replace("\u09a1\u09bc", "\u09dc").replace("\u09a2\u09bc", "\u09dd")


def tts_text(label):
    """What Edge is given: single-character ড়/ঢ়, then the edge_respell.json respellings."""
    return respell(rr_text(label))


def is_respelled(label):
    return respell(label) != label


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


async def say_to_file(edge_tts, text, path, attempts=4):
    """One Edge request with retries: Edge sometimes answers with no audio."""
    for attempt in range(attempts):
        try:
            await edge_tts.Communicate(text, VOICE, rate=RATE).save(path)
            if os.path.getsize(path) >= 1500:
                return True
        except Exception as exc:
            error = exc
        await asyncio.sleep(2 + attempt * 3)
    print(f"   (no audio from Edge after {attempts} tries, skipped)")
    return False


def read_sources(path):
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


def as_sentence(text):
    return text if text.endswith(("।", "?", "!", ".")) else text + "।"


async def record_missing(edge_tts, items, directory, kind, workers, redo_rr=False, redo_respell=False,
                         phrase_batch_size=0):
    directory.mkdir(parents=True, exist_ok=True)
    source_path = directory / "sources.json"
    redo = redo_rr or redo_respell

    def source_entry(label):
        source = ("edge:" + VOICE + ("+single-char-rr" if has_rr(label) else "")
                  + ("+respell" if is_respelled(label) else ""))
        if phrase_batch_size:
            digest = hashlib.sha256(tts_text(label).encode("utf-8")).hexdigest()[:12]
            source += ":text=" + digest
        return source

    if redo:
        sources = read_sources(source_path)
        wanted = has_rr if redo_rr else is_respelled
        if phrase_batch_size and redo_respell:
            todo = [item for item in items if sources.get(item["id"], "").startswith("edge:")
                    and sources[item["id"]] != source_entry(item["label"])]
        else:
            todo = [item for item in items if wanted(item["label"])
                    and sources.get(item["id"], "edge").startswith("edge")
                    and not (redo_respell and "+respell" in sources.get(item["id"], ""))]
    else:
        todo = [item for item in items if not (directory / (item["id"] + ".mp3")).is_file()]
    print(f"{len(todo)} {kind} need a stand-in recording ({VOICE}, rate {RATE}).", flush=True)
    if not todo:
        return 0
    sem = asyncio.Semaphore(workers)
    done, failed = [], []

    def publish(item, staging):
        key, label = item["id"], item["label"]
        out = directory / (key + ".mp3")
        tmp = staging / (key + ".mp3")
        sources = read_sources(source_path)
        if redo:
            if not sources.get(key, "edge").startswith("edge"):
                return
            tmp.replace(out)
        else:
            try:
                os.link(tmp, out)  # Publish only if no recording appeared meanwhile.
            except FileExistsError:
                return
        sources[key] = source_entry(label)
        pending_sources = staging / "sources.json"
        pending_sources.write_text(json.dumps(dict(sorted(sources.items())), indent=1, ensure_ascii=False),
                                   encoding="utf-8")
        pending_sources.replace(source_path)
        done.append(key)
        if len(done) % 25 == 0:
            print(f"  {len(done)}/{len(todo)} {kind}", flush=True)

    async def one(item, staging):
        key, label = item["id"], item["label"]
        tmp = staging / (key + ".mp3")
        for attempt in range(3):
            try:
                text, rate = tts_text(label), RATE
                if phrase_batch_size:
                    # Edge can return no audio for one request but accept the same words with a new ending or rate.
                    text = as_sentence(text) if attempt != 1 else text.rstrip("।.")
                    if attempt == 2 and RATE == "-10%":
                        rate = "-8%"
                await edge_tts.Communicate(text, VOICE, rate=rate).save(str(tmp))
                if tmp.stat().st_size < 1500:
                    raise RuntimeError("empty audio")
                if FFMPEG:
                    await asyncio.get_running_loop().run_in_executor(None, finish_clip, str(tmp))
            except Exception as exc:
                error = exc
                await asyncio.sleep(2 + attempt * 3)
            else:
                publish(item, staging)
                return
        failed.append(f"{key} ({label}): {error}")

    async def record_group(group, staging, rate):
        if len(group) == 1:
            await one(group[0], staging)
            return
        try:
            await record_phrase_batch(edge_tts, group, staging, rate)
        except (ValueError, OSError, RuntimeError, subprocess.SubprocessError, edge_tts.exceptions.EdgeTTSException):
            # Retry smaller groups when Edge fails or the boundaries cannot be verified.
            mid = len(group) // 2
            retry_rate = "-8%" if rate == "-10%" else RATE
            await record_group(group[:mid], staging, retry_rate)
            await record_group(group[mid:], staging, retry_rate)
        else:
            for item in group:
                publish(item, staging)

    async def worker(group, staging):
        async with sem:
            await record_group(group, staging, RATE)

    with tempfile.TemporaryDirectory(dir=directory, prefix=".edge-") as staging:
        size = phrase_batch_size or 1
        await asyncio.gather(*(worker(todo[i:i + size], Path(staging)) for i in range(0, len(todo), size)))
    print(f"Done: {len(done)} {kind} saved, {len(failed)} failed.", flush=True)
    for failure in failed:
        print("  FAILED", failure)
    return len(failed)


async def record_phrase_batch(edge_tts, items, staging, rate):
    # Sentence offsets let us share a request without guessing which utterance is in a clip.
    def boundary_text(text):
        return " ".join(unicodedata.normalize("NFC", text).strip(" ।.!?…").split())

    labels = [tts_text(item["label"]) for item in items]
    text = " ".join(map(as_sentence, labels))
    parts, boundaries = [], []
    async for chunk in edge_tts.Communicate(text, VOICE, rate=rate, boundary="SentenceBoundary").stream():
        if chunk["type"] == "audio":
            parts.append(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            boundaries.append(chunk)
    if [boundary_text(chunk["text"]) for chunk in boundaries] != [boundary_text(label) for label in labels]:
        raise ValueError("Edge sentence boundaries do not match the requested phrases")
    starts = [0.0] + [chunk["offset"] / 10_000_000 for chunk in boundaries[1:]]
    if not parts or any(end - start < 0.2 for start, end in zip(starts, starts[1:])):
        raise ValueError("Edge returned unusable phrase timings")

    def split_and_finish():
        with tempfile.TemporaryDirectory(dir=staging) as folder:
            combined = Path(folder) / "batch.mp3"
            combined.write_bytes(b"".join(parts))
            for item, start, end in zip(items, starts, starts[1:] + [None]):
                raw = Path(folder) / "phrase.wav"
                cut = ["-t", str(end - start)] if end is not None else []
                subprocess.run([FFMPEG, "-v", "error", "-y", "-i", combined, "-ss", str(start),
                                *cut, raw], check=True)
                finish_clip(raw)
                if raw.stat().st_size < 1500:
                    raise ValueError("Edge returned an empty phrase clip")
                raw.replace(staging / (item["id"] + ".mp3"))

    await asyncio.get_running_loop().run_in_executor(None, split_and_finish)


async def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--questions", action="store_true", help="Fill only missing question recordings.")
    mode.add_argument("--nurturer", action="store_true", help="Fill only missing Nurturer recordings.")
    mode.add_argument("--test", action="store_true", help="Record example word spellings for comparison.")
    mode.add_argument("--redo-rr", action="store_true", help="Refresh existing Edge words containing ড়/ঢ়.")
    mode.add_argument("--test-respell", action="store_true", help="Record edge_respell.json words as spelled and respelled.")
    mode.add_argument("--redo-respell", action="store_true", help="Refresh Edge words/questions changed by edge_respell.json.")
    args = parser.parse_args()
    try:
        import edge_tts
    except ImportError:
        sys.exit("edge-tts is not installed. Run:  python3 -m pip install --user edge-tts")
    deck = load_web_deck()
    items = [it for card in deck["cards"] for it in card["items"]]
    phrases = [{"id": key, "label": text} for key, text in nurturer_phrases(deck).items()]
    question_items = [{"id": key, "label": text} for record in load_questions().values()
                      for key, text in zip(record["ids"], record["questions"])]
    if args.test_respell:
        out = os.path.expanduser("~/Desktop/edge-respell-test")
        os.makedirs(out, exist_ok=True)
        for n, (word, entry) in enumerate(load_list().items(), 1):
            # Prefer a short question that uses the word, else the bare word.
            uses = sorted((q["label"] for q in question_items + phrases + items if word in hits(q["label"])), key=len)
            text = rr_text(uses[0]) if uses else word
            print(f"{n}. {word} ({entry.get('gloss', '')}): {text}")
            await say_to_file(edge_tts, text, os.path.join(out, f"{n}a-as-spelled.mp3"))
            for k, alt in enumerate(entry.get("try") or [entry["say"]]):
                alt_text = text.replace(word, alt) if uses else alt
                name = f"{n}{chr(ord('b') + k)}-{'say' if alt == entry['say'] else 'try'}.mp3"
                print(f"   {chr(ord('b') + k)}: {alt_text}" + ("   <- current 'say'" if alt == entry["say"] else ""))
                await say_to_file(edge_tts, alt_text, os.path.join(out, name))
        print("Saved to", out, "- compare each a (as spelled) with b, c ... (respelled).")
        os.system('open "%s"' % out)
        return
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
    if not (args.questions or args.nurturer):
        failed = await record_missing(edge_tts, items, Path(HERE) / "audio", "words", 4, args.redo_rr, args.redo_respell)
    if not (args.redo_rr or args.nurturer):
        if args.questions and not question_items:
            parser.error("Build question-data.js with build_web.py --source before recording.")
        if question_items:
            failed += await record_missing(edge_tts, question_items, Path(HERE) / "question-audio", "questions", 16,
                                           redo_respell=args.redo_respell)
    if not (args.questions or args.redo_rr):
        if args.nurturer and not phrases:
            parser.error("Build deck-data.js with build_web.py --source before recording Nurturer phrases.")
        if phrases:
            if not FFMPEG:
                parser.error("Install ffmpeg before recording Nurturer phrases.")
            failed += await record_missing(edge_tts, phrases, Path(HERE) / "nurturer-audio", "Nurturer phrases", 6,
                                           redo_respell=args.redo_respell, phrase_batch_size=8)
    if failed:
        sys.exit("Run the same command again to retry missing recordings.")


if __name__ == "__main__":
    asyncio.run(main())
