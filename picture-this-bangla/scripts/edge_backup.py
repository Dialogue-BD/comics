#!/usr/bin/env python3
"""Fill every unrecorded word with a free Microsoft Edge voice as a stand-in.

    python3 -m pip install --user edge-tts      # once
    python3 scripts/edge_backup.py              # from the picture-this-bangla folder

Only words with no recording in audio/ are generated, so the Gemini recordings
are never touched and the script can be re-run safely. Each Edge clip is marked
"edge" in audio/sources.json; when a Gemini recording replaces it, its entry is
updated, so it is always clear which words still need a better take.
Runs on Python 3.8+.

Options
    --test       record 4 words with ড়/ঢ় both ways (as spelled on the card, and
                 with the single-character ড়/ঢ়) into ~/Desktop/edge-rr-test/
    --redo-rr    re-record every Edge word containing ড়/ঢ় using the
                 single-character form (never touches Gemini recordings)
"""
import asyncio, json, os, sys

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


def load_deck():
    txt = open(os.path.join(HERE, "deck-data.js"), encoding="utf-8").read()
    return json.loads(txt.split("window.PTB_DECK = ", 1)[1].split(";\nwindow.PICTURE_THIS_GAME_DATA", 1)[0])


async def main():
    try:
        import edge_tts
    except ImportError:
        sys.exit("edge-tts is not installed. Run:  python3 -m pip install --user edge-tts")
    audio_dir = os.path.join(HERE, "audio")
    os.makedirs(audio_dir, exist_ok=True)
    src_path = os.path.join(audio_dir, "sources.json")
    sources = json.load(open(src_path, encoding="utf-8")) if os.path.exists(src_path) else {}
    items = [it for c in load_deck()["cards"] for it in c["items"]]
    if "--test" in sys.argv:
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
    if "--redo-rr" in sys.argv:
        todo = [it for it in items if has_rr(it["label"]) and sources.get(it["id"], "edge").startswith("edge")]
        print(f"Re-recording {len(todo)} Edge words with ড়/ঢ় as single characters.")
    else:
        todo = [it for it in items if not os.path.exists(os.path.join(audio_dir, it["id"] + ".mp3"))]
        print(f"{len(todo)} words need a stand-in recording ({VOICE}, rate {RATE}).")
    sem = asyncio.Semaphore(4)
    done, failed = [], []

    async def one(it):
        out = os.path.join(audio_dir, it["id"] + ".mp3")
        async with sem:
            for attempt in range(3):
                try:
                    tmp = out + ".part"
                    await edge_tts.Communicate(tts_text(it["label"]), VOICE, rate=RATE).save(tmp)
                    if os.path.getsize(tmp) < 1500:
                        raise RuntimeError("empty audio")
                    os.replace(tmp, out)
                    sources[it["id"]] = "edge:" + VOICE + ("+single-char-rr" if has_rr(it["label"]) else "")
                    done.append(it["id"])
                    if len(done) % 25 == 0:
                        print(f"  {len(done)}/{len(todo)}")
                    return
                except Exception as e:
                    err = e
                    await asyncio.sleep(2 + attempt * 3)
            failed.append(f"{it['id']} ({it['label']}): {err}")

    await asyncio.gather(*(one(it) for it in todo))
    json.dump(dict(sorted(sources.items())), open(src_path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"Done: {len(done)} saved, {len(failed)} failed.")
    for f in failed:
        print("  FAILED", f)
    if failed:
        print("Run the same command again to retry the failed words.")


if __name__ == "__main__":
    asyncio.run(main())
