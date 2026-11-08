#!/usr/bin/env python3
"""
Pre-generate all edge-tts neural voice clips for "How the Brain Learns Language".
Uses Microsoft Edge Neural TTS:
  - Nurturer / Coach lines: en-US-EmmaNeural (rate -15%)
  - Learner recast lines:   en-US-AvaNeural  (rate -15%)
"""

import asyncio
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(os.path.dirname(HERE), "assets", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

EMMA = "en-US-EmmaNeural"
AVA = "en-US-AvaNeural"

# Complete clip list matching CLIPMAP in index.html + new interactive features
CLIPS = [
    ("voice-on", "Voice on.", EMMA),
    ("monitor-idea", "The monitor checks rules. The filter blocks input when we feel stressed. Low anxiety lets language in.", EMMA),
    ("finish-line", "Remember: look, listen, tap, play. Fifteen minutes every day. Your underwater English will grow, and speaking will rise on its own.", EMMA),
    ("noise-question", "Plokta zorin fek tor. Which picture is it? Take a guess.", EMMA),
    ("alien-sentence", "Plokta zorin fek tor.", EMMA),
    ("watch-zorin", "Watch. Zorin.", EMMA),
    ("zorin", "Zorin.", EMMA),
    ("plokta", "Plokta.", EMMA),
    ("vamu", "Vamu.", EMMA),
    ("trelo", "Trelo.", EMMA),
    ("plokta-zorin-try", "Plokta zorin? Now you try.", EMMA),
    ("where-zorin", "Where is Zorin?", EMMA),
    ("where-plokta", "Where is Plokta?", EMMA),
    ("where-vamu", "Where is Vamu?", EMMA),
    ("where-trelo", "Where is Trelo?", EMMA),
    ("guess-noise", "That was a guess. Sound alone is just noise. Now, watch and listen.", EMMA),
    ("yes-zorin", "Yes! Zorin is the apple. You learned it — with no translation at all.", EMMA),
    ("yes-plokta", "Yes! Plokta is the cup. You matched the sound right to the picture.", EMMA),
    ("yes-vamu", "Yes! Vamu is the dog. Zero grammar rules needed.", EMMA),
    ("yes-trelo", "Yes! Trelo is the bicycle. You acquired all four words naturally!", EMMA),
    ("try-again", "Try again. Zorin was the round red fruit.", EMMA),
    ("try-again-general", "Not that one. Trust the picture in your mind and try again.", EMMA),
    ("drill-melt", "Twenty drill words, pushed onto the tip. Watch them melt.", EMMA),
    ("ci-flows", "Comprehensible input flows in. Understanding grows below the surface, and speaking rises on its own.", EMMA),
    ("silent-1", "Week one and two. Just listen.", EMMA),
    ("silent-2", "Week three and four. Point, tap, play.", EMMA),
    ("silent-3", "Week five and six. Yes, no, nod — understanding is already here.", EMMA),
    ("silent-4", "Week seven and eight. Chunks pop out by themselves.", EMMA),
    ("silent-5", "Week nine. Your own sentences arrive — because the iceberg is ready.", EMMA),
    ("two-students", "Two students order coffee. The first one is checking rules, and freezes. The second one listened, in context, for months — and the words simply come.", EMMA),
    ("coffee-line", "Hi! Can I have a coffee, please — for here. Thanks!", AVA),
    ("frozen-line", "I... would... like... uh... is it a coffee or... Sorry, sorry...", AVA),
    ("qd-ask-boots", "Find the boots. Where are the boots?", EMMA),
    ("qd-yes-boots", "Yes! Those are the black boots.", EMMA),
    ("qd-ask-scarf", "Now — show me the red scarf.", EMMA),
    ("qd-yes-scarf", "Beautiful! The red scarf, soft and warm.", EMMA),
    ("qd-ask-banana", "Where is the banana?", EMMA),
    ("qd-yes-banana", "Yes! The yellow banana. Sweet and ripe.", EMMA),
    ("qd-ask-book", "Show me the book, please.", EMMA),
    ("qd-yes-book", "That's the book! Full of stories.", EMMA),
    ("qd-ask-key", "Can you find the key?", EMMA),
    ("qd-yes-key", "You found the key! It opens the door.", EMMA),
    ("qd-ask-umbrella", "Last one — where is the umbrella?", EMMA),
    ("qd-yes-umbrella", "The umbrella! Ready for the rain. You did all six!", EMMA),
    ("qd-complete", "Wonderful! You understood everything. Comprehension first, always.", EMMA),
    ("listen-again", "Listen again.", EMMA),
    ("thats-boots", "That's the boots.", EMMA),
    ("thats-scarf", "That's the red scarf.", EMMA),
    ("thats-banana", "That's the banana.", EMMA),
    ("thats-book", "That's the book.", EMMA),
    ("thats-key", "That's the key.", EMMA),
    ("thats-umbrella", "That's the umbrella.", EMMA),
    ("thats-hat", "That's the hat.", EMMA),
    ("thats-chair", "That's the chair.", EMMA),
    ("label-boots", "boots.", EMMA),
    ("label-scarf", "red scarf.", EMMA),
    ("label-banana", "banana.", EMMA),
    ("label-book", "book.", EMMA),
    ("label-key", "key.", EMMA),
    ("label-umbrella", "umbrella.", EMMA),
    ("label-hat", "hat.", EMMA),
    ("label-chair", "chair.", EMMA),
    ("recast-me-0", "Boy run road.", AVA),
    ("recast-me-1", "He go store.", AVA),
    ("recast-me-2", "She have two child.", AVA),
    ("recast-me-3", "Yesterday I buy phone.", AVA),
    ("recast-me-4", "Tea very hot no drink.", AVA),
    ("recast-me-5", "Bus late I walk school.", AVA),
    ("recast-ai-0", "Yes! The young boy is running down the busy road. Where is he headed?", EMMA),
    ("recast-ai-1", "Ah, yes! He went to the grocery store to buy apples. What did he buy?", EMMA),
    ("recast-ai-2", "She has two children! Are they playing outside today?", EMMA),
    ("recast-ai-3", "You bought a new phone yesterday — exciting! Is it fast?", EMMA),
    ("recast-ai-4", "Oh, the tea is too hot to drink right now! Let's wait a minute for it to cool down.", EMMA),
    ("recast-ai-5", "The bus was late, so you walked all the way to school! Were you tired when you arrived?", EMMA),
    ("story-1", "Look at the busy market. A woman in a green sari is buying fresh mangoes.", EMMA),
    ("story-2", "Beside her, a little boy is pointing at a basket of sweet bananas.", EMMA),
    ("story-3", "A stray dog is sleeping peacefully under the wooden table in the shade.", EMMA),
    ("hero-intro", "Your brain already knows how to learn a language. Don't study the pictures. Just look, listen, and tap.", EMMA),
]


def synth_via_gradio(slug: str, text: str, voice: str, rate: int = -15) -> bool:
    out_path = os.path.join(AUDIO_DIR, f"{slug}.mp3")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
        return True

    base = "https://innoai-edge-tts-text-to-speech.hf.space"
    voice_label = f"{voice} - en-US (Female)"
    for attempt in range(4):
        try:
            req = urllib.request.Request(
                f"{base}/gradio_api/call/tts_interface",
                data=json.dumps({"data": [text, voice_label, rate, 0]}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            resp = json.loads(urllib.request.urlopen(req, timeout=15).read().decode("utf-8"))
            event_id = resp["event_id"]

            mp3_url = None
            with urllib.request.urlopen(f"{base}/gradio_api/call/tts_interface/{event_id}", timeout=30) as stream:
                for raw_line in stream:
                    line = raw_line.decode("utf-8").strip()
                    if line.startswith("data:") and "url" in line:
                        payload = json.loads(line[5:].strip())
                        mp3_url = payload[0]["url"]
                        break

            if not mp3_url:
                raise RuntimeError("No audio URL returned")

            audio_bytes = urllib.request.urlopen(mp3_url, timeout=20).read()
            if len(audio_bytes) < 500:
                raise RuntimeError(f"Audio too small ({len(audio_bytes)} bytes)")

            tmp_path = out_path + ".part"
            with open(tmp_path, "wb") as f:
                f.write(audio_bytes)
            os.replace(tmp_path, out_path)
            print(f"  [OK] {slug}.mp3 ({len(audio_bytes)} bytes) · {voice}")
            return True
        except Exception as e:
            if attempt == 3:
                print(f"  [FAIL] {slug}: {e}", file=sys.stderr)
                return False
    return False


async def synth_direct_edge_tts():
    """Fallback direct edge-tts when run outside a WebSocket-restricted proxy."""
    import edge_tts

    for slug, text, voice in CLIPS:
        out_path = os.path.join(AUDIO_DIR, f"{slug}.mp3")
        if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
            continue
        comm = edge_tts.Communicate(text, voice, rate="-15%")
        await comm.save(out_path)
        print(f"  [OK] {slug}.mp3 · {voice}")


def main():
    print(f"Generating {len(CLIPS)} neural edge-tts clips into {AUDIO_DIR} ...")
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda item: synth_via_gradio(*item), CLIPS))
    ok = sum(1 for r in results if r)
    print(f"\nCompleted: {ok}/{len(CLIPS)} clips ready in {AUDIO_DIR}")
    if ok < len(CLIPS):
        sys.exit(1)


if __name__ == "__main__":
    main()
