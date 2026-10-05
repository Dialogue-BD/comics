"""A second ASR pass over ambiguous phrases; no uploads or API calls."""
import json
from pathlib import Path
import whisper

ROOT = Path(__file__).resolve().parent.parent
model = whisper.load_model("base")
checks = [(2, 49, 61), (3, 9, 17), (3, 21, 26), (3, 48, 64),
          (6, 23, 30), (6, 43, 52), (8, 51, 61), (9, 25, 32), (9, 54, 61), (10, 75, 84)]
out = []
for page, start, end in checks:
    wave = whisper.load_audio(str(ROOT / f"audio_{page}.mp3"))
    result = model.transcribe(wave[int(start * 16000):int(end * 16000)],
                              language="en", fp16=False, verbose=None)
    item = {"page": page, "start": start, "end": end, "heard": result["text"]}
    out.append(item)
    print(item, flush=True)
(ROOT / "review" / "transcription-review.json").write_text(json.dumps(out, indent=2) + "\n")
