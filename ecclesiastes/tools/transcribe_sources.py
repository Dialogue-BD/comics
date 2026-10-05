"""Cache local Whisper transcription of the ten existing recordings."""
import hashlib
import json
from pathlib import Path
import whisper

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "review" / "asr"
OUT.mkdir(parents=True, exist_ok=True)
model = whisper.load_model("small")
for page in range(1, 11):
    audio = ROOT / f"audio_{page}.mp3"
    target = OUT / f"page-{page:02}.json"
    digest = hashlib.sha256(audio.read_bytes()).hexdigest()
    if target.exists() and json.loads(target.read_text()).get("audio_sha256") == digest:
        print(f"Page {page}: cached", flush=True)
        continue
    result = model.transcribe(str(audio), language="en", word_timestamps=True,
                              fp16=False, verbose=None, condition_on_previous_text=False)
    result["audio_sha256"] = digest
    result["model"] = "Whisper small"
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"Page {page}: {result['text']}", flush=True)
