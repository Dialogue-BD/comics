#!/usr/bin/env python3
"""Make and upload the Busy Pictures "natural voice" clips (Phonon TTS, voice V1).

Run on a Mac in the `phonon` conda environment (the one set up for the
listening test). Everything is resumable: stop with Ctrl+C at any time and
run the same command again to carry on where it stopped.

ONE-TIME SETUP
    conda activate phonon
    pip install lameenc                 # MP3 encoder

MAKE CLIPS (pictures 1-22, the ones students can open)
    python3 busy-pictures/tools/make_phonon_clips.py
    python3 busy-pictures/tools/make_phonon_clips.py --pictures 1-3   # just some

UPLOAD TO THE SITE (needs the TTS_UPLOAD_TOKEN secret set in Replit)
    python3 busy-pictures/tools/make_phonon_clips.py --upload --token <TOKEN>

SEE PROGRESS
    python3 busy-pictures/tools/make_phonon_clips.py --status

Clips are saved in ~/phonon-clips/v1/ as <key>.mp3, where <key> is a hash
of the exact text the page speaks (clip_key below must match clipKey() in
busy-pictures/index.html). After you correct a sentence, just run the
script again: only the changed sentences are made and uploaded.
"""

import argparse
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
BP = os.path.dirname(HERE)
JSON_PATH = os.path.join(BP, "spatial_index.json")
HTML_PATH = os.path.join(BP, "index.html")

VOICE_ID = "v1"
VOICE_FILE = "voices/LMDIYE0Oa377Qh6Z.safetensors"   # the "V1" voice from the listening test
MODEL_ID = "gradium/phonon-31m-en"                    # Apache 2.0 English model
VOICES_REPO = "gradium/phonon-voices"
MP3_KBPS = 32
DEFAULT_SITE = "https://dialogue-bd.com"
UPLOAD_BATCH = 250                                    # clips per upload request (~4 MB)

TENSES = ("main_simple_present", "main_present_continuous", "main_simple_past",
          "main_past_continuous", "main_present_perfect", "main_future_going_to",
          "main_future_will")
FORMS = ("", "_negative", "_question")


# ---------------------------------------------------------------------------
# The clip key. cyrb53 over UTF-16 code units, base 36 - identical to
# clipKey() in busy-pictures/index.html (verified on all 103,878 texts).
# ---------------------------------------------------------------------------
def clip_key(text):
    mask = 0xFFFFFFFF

    def imul(a, b):
        return (a * b) & mask

    h1, h2 = 0xDEADBEEF, 0x41C6CE57
    units = text.encode("utf-16-le")
    for i in range(0, len(units), 2):
        ch = units[i] | (units[i + 1] << 8)
        h1 = imul(h1 ^ ch, 2654435761)
        h2 = imul(h2 ^ ch, 1597334677)
    h1 = imul(h1 ^ (h1 >> 16), 2246822507)
    h1 ^= imul(h2 ^ (h2 >> 13), 3266489909)
    h2 = imul(h2 ^ (h2 >> 16), 2246822507)
    h2 ^= imul(h1 ^ (h1 >> 13), 3266489909)
    n = 4294967296 * (2097151 & h2) + (h1 & mask)
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while True:
        n, r = divmod(n, 36)
        out = digits[r] + out
        if n == 0:
            return out


def spoken_sentence(value):
    """Exactly what buildGrammarSentence() in index.html hands to the voice."""
    out = str(value).strip()
    if not re.search(r"[.?!]$", out):
        out += "."
    return out


# ---------------------------------------------------------------------------
# What to say
# ---------------------------------------------------------------------------
def visible_pictures():
    html = open(HTML_PATH, encoding="utf-8").read()
    match = re.search(r"var images = (\[.*?\]);", html)
    names = json.loads(match.group(1)) if match else []
    return [int(re.search(r"wimmelbook_(\d+)", n).group(1)) for n in names]


def parse_pictures(spec):
    pictures = []
    for part in spec.split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-", 1)
            pictures.extend(range(int(a), int(b) + 1))
        elif part:
            pictures.append(int(part))
    return pictures


def texts_for(pictures):
    """Unique spoken texts in a sensible order: picture by picture, names first,
    then every tense affirmative, then negatives, then questions."""
    index = json.load(open(JSON_PATH, encoding="utf-8"))
    seen, ordered = set(), []

    def add(text):
        text = text.strip()
        if text and text not in seen:
            seen.add(text)
            ordered.append(text)

    for picture in pictures:
        objects = index.get("wimmelbook_%d" % picture, [])
        for obj in objects:
            add(obj["name"])
        for form in FORMS:
            for tense in TENSES:
                for obj in objects:
                    value = (obj.get("grammar_data") or {}).get(tense + form)
                    if value:
                        add(spoken_sentence(value))
    return ordered


# ---------------------------------------------------------------------------
# Making clips
# ---------------------------------------------------------------------------
class Voice:
    def __init__(self):
        import torch
        from huggingface_hub import hf_hub_download
        from safetensors.torch import load_file
        from transformers import AutoProcessor, GradiumPhononTTSForConditionalGeneration
        import lameenc  # noqa: F401  (fail early if missing)

        self.torch = torch
        print("Loading Phonon 31m (English), voice V1 ...")
        self.processor = AutoProcessor.from_pretrained(MODEL_ID)
        self.model = GradiumPhononTTSForConditionalGeneration.from_pretrained(MODEL_ID)
        self.model.eval()
        self.voice = load_file(hf_hub_download(VOICES_REPO, VOICE_FILE))["speaker_wavs"][0].T
        self.rate = self.processor.feature_extractor.sampling_rate

    def wav(self, text):
        conversation = [{"role": "user", "content": [{"type": "audio"}, {"type": "text", "text": text}]}]
        inputs = self.processor.apply_chat_template(
            conversation, tokenize=True, return_dict=True, add_generation_prompt=True,
            processor_kwargs={"audio_prompt_latents": [self.voice]},
        ).to(self.model.device)
        with self.torch.no_grad():
            outputs = self.model.generate(**inputs)
        return self.processor.decode(outputs.audio_latents, outputs.audio_latents_mask)[0]

    def mp3(self, text):
        import lameenc
        import numpy as np
        samples = self.wav(text).cpu().float().numpy()
        peak = float(np.abs(samples).max()) if samples.size else 0.0
        if peak > 0.99:                       # never clip
            samples = samples * (0.99 / peak)
        pcm = (np.clip(samples, -1.0, 1.0) * 32767.0).astype("<i2").tobytes()
        encoder = lameenc.Encoder()
        encoder.set_bit_rate(MP3_KBPS)
        encoder.set_in_sample_rate(self.rate)
        encoder.set_channels(1)
        encoder.set_quality(2)                # 2 = high quality, slower encode (still fast)
        return encoder.encode(pcm) + encoder.flush(), len(samples) / self.rate


def clip_path(out_dir, key):
    return os.path.join(out_dir, VOICE_ID, key + ".mp3")


def make(texts, out_dir):
    os.makedirs(os.path.join(out_dir, VOICE_ID), exist_ok=True)
    todo = [t for t in texts if not os.path.exists(clip_path(out_dir, clip_key(t)))]
    print("%d texts, %d already made, %d to make" % (len(texts), len(texts) - len(todo), len(todo)))
    if not todo:
        return
    voice = Voice()
    started = time.time()
    audio_seconds = 0.0
    for i, text in enumerate(todo, 1):
        data, seconds = voice.mp3(text)
        path = clip_path(out_dir, clip_key(text))
        with open(path + ".part", "wb") as f:
            f.write(data)
        os.replace(path + ".part", path)
        audio_seconds += seconds
        if i == 1 or i % 50 == 0 or i == len(todo):
            elapsed = time.time() - started
            per = elapsed / i
            left = (len(todo) - i) * per
            print("  %6d / %d   %.2fs each   about %s left   (%s)" % (
                i, len(todo), per, _duration(left), text[:60]))
    print("Done: %d clips, %.1f minutes of speech, in %s." % (
        len(todo), audio_seconds / 60, _duration(time.time() - started)))


def _duration(seconds):
    seconds = int(seconds)
    if seconds < 90:
        return "%ds" % seconds
    if seconds < 5400:
        return "%dm" % (seconds // 60)
    return "%dh %02dm" % (seconds // 3600, (seconds % 3600) // 60)


# ---------------------------------------------------------------------------
# Uploading clips
# ---------------------------------------------------------------------------
def uploaded_log(out_dir):
    return os.path.join(out_dir, VOICE_ID, ".uploaded-%s.txt" % _site_slug())


_SITE = DEFAULT_SITE


def _site_slug():
    return re.sub(r"[^a-z0-9]+", "-", _SITE.lower()).strip("-")


def upload(texts, out_dir, token):
    log_path = uploaded_log(out_dir)
    done = set()
    if os.path.exists(log_path):
        done = set(open(log_path).read().split())
    keys = [clip_key(t) for t in texts]
    ready = [k for k in keys if k not in done and os.path.exists(clip_path(out_dir, k))]
    not_made = sum(1 for k in keys if not os.path.exists(clip_path(out_dir, k)))
    print("%d clips to upload to %s (%d already uploaded, %d not made yet)" % (
        len(ready), _SITE, sum(1 for k in keys if k in done), not_made))
    if not ready:
        return
    status = _request("GET", _SITE + "/api/tts/status")
    print("Site storage:", status.get("storage"), status.get("storageError") or "")
    if status.get("storage") != "replit-app-storage" and "localhost" not in _SITE and "127.0.0.1" not in _SITE:
        raise SystemExit("The site has no App Storage bucket yet. Create one in Replit's App Storage tool, "
                         "republish, then upload again.")
    started = time.time()
    sent = 0
    with open(log_path, "a") as log:
        for start in range(0, len(ready), UPLOAD_BATCH):
            batch = ready[start:start + UPLOAD_BATCH]
            buffer = io.BytesIO()
            with zipfile.ZipFile(buffer, "w", zipfile.ZIP_STORED) as archive:
                for key in batch:
                    archive.write(clip_path(out_dir, key), "%s/%s.mp3" % (VOICE_ID, key))
            reply = _request("POST", _SITE + "/api/tts/upload", buffer.getvalue(), token)
            if reply.get("stored") != len(batch):
                raise SystemExit("Upload stopped: %r" % reply)
            log.write("\n".join(batch) + "\n")
            log.flush()
            sent += len(batch)
            per = (time.time() - started) / sent
            print("  uploaded %d / %d   about %s left" % (sent, len(ready), _duration((len(ready) - sent) * per)))
    print("Upload complete.")


def _request(method, url, body=None, token=None, attempts=5):
    headers = {"User-Agent": "make_phonon_clips"}
    if body is not None:
        headers["Content-Type"] = "application/zip"
    if token:
        headers["Authorization"] = "Bearer " + token
    for attempt in range(1, attempts + 1):
        try:
            request = urllib.request.Request(url, data=body, method=method, headers=headers)
            with urllib.request.urlopen(request, timeout=120) as response:
                return json.loads(response.read() or b"{}")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")[:300]
            if exc.code in (400, 401, 403, 404):
                raise SystemExit("%s %s -> %d %s" % (method, url, exc.code, detail))
            error = "%d %s" % (exc.code, detail)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as exc:
            error = str(exc)
        wait = min(60, 5 * attempt)
        print("  network problem (%s); retrying in %ds" % (error, wait))
        time.sleep(wait)
    raise SystemExit("Giving up after %d attempts. Run the same command again to resume." % attempts)


# ---------------------------------------------------------------------------
def main():
    global _SITE
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--pictures", help="e.g. 1-22 or 1,4,7 (default: the pictures students can open)")
    parser.add_argument("--out", default=os.path.expanduser("~/phonon-clips"), help="clip folder")
    parser.add_argument("--limit", type=int, help="only the first N texts (for a quick test)")
    parser.add_argument("--upload", action="store_true", help="upload made clips instead of making them")
    parser.add_argument("--site", default=DEFAULT_SITE, help="site to upload to (default %(default)s)")
    parser.add_argument("--token", default=os.environ.get("TTS_UPLOAD_TOKEN", ""), help="upload token")
    parser.add_argument("--status", action="store_true", help="show how many clips are made and uploaded")
    args = parser.parse_args()
    _SITE = args.site.rstrip("/")

    pictures = parse_pictures(args.pictures) if args.pictures else visible_pictures()
    texts = texts_for(pictures)
    if args.limit:
        texts = texts[:args.limit]

    if args.status:
        keys = [clip_key(t) for t in texts]
        made = sum(1 for k in keys if os.path.exists(clip_path(args.out, k)))
        log_path = uploaded_log(args.out)
        done = set(open(log_path).read().split()) if os.path.exists(log_path) else set()
        print("pictures %s: %d texts, %d made, %d uploaded to %s" % (
            ",".join(map(str, pictures)), len(texts), made, sum(1 for k in keys if k in done), _SITE))
        return
    if args.upload:
        if not args.token and "localhost" not in _SITE and "127.0.0.1" not in _SITE:
            raise SystemExit("Pass --token <TTS_UPLOAD_TOKEN> (the secret you set in Replit).")
        upload(texts, args.out, args.token)
        return
    make(texts, args.out)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopped. Run the same command again to carry on.")
        sys.exit(130)
