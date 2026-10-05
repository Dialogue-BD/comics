"""Build the player data and combined recording from the existing source files.

Transcribe sources first. Review source.js before changing it: its text is the
displayed transcript, and changing it requires rebuilding timing and audits.
"""
import hashlib
import json
import re
import subprocess
import sys
import wave
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parent / "ethnographic-interviews" / "tools"))
from align import align

WORD = re.compile(r"[A-Za-z’'-]+")
RATE = 24000
GAP = .45


def js_data(filename, constant):
    code = f"console.log(JSON.stringify(require(process.argv[1]).{constant}))"
    return json.loads(subprocess.check_output(["node", "-e", code, str(ROOT / filename)], text=True))


def captions(text):
    result = []
    for sentence in re.findall(r"[^.!?]+[.!?]", text):
        remaining = sentence.strip()
        while len(WORD.findall(remaining)) > 25:
            words = list(WORD.finditer(remaining))
            limit = words[23].end()
            cuts = [m.end() for m in re.finditer(r"[,;:]", remaining[:limit]) if m.end() > words[7].end()]
            cut = cuts[-1] if cuts else words[19].end()
            result.append(remaining[:cut].strip())
            remaining = remaining[cut:].strip()
        if remaining:
            result.append(remaining)
    return result


def write_js(path, name, value):
    path.write_text(f"const {name} = " + json.dumps(value, ensure_ascii=False, indent=2)
                    + f";\nif (typeof module !== 'undefined') module.exports = {{ {name} }};\n")


def main():
    source = js_data("source.js", "ECCLESIASTES_SOURCE")
    glosses = js_data("glossary-source.js", "ECCLESIASTES_GLOSSARY")
    for folder in ["audio", "assets/pages", "review"]:
        (ROOT / folder).mkdir(parents=True, exist_ok=True)
    lines, camera, beats, frames, chapters, all_times, report = [], [], [], [], [], [], []
    sample_cursor = 0
    pcm_blocks = []
    for page, item in enumerate(source, 1):
        original = ROOT / f"page_{page}.jpg"
        edited = ROOT / "assets" / "source" / f"page-{page:02}-edited.png"
        art = edited if edited.exists() else original
        image = Image.open(art).convert("RGB")
        image.save(ROOT / "assets" / "pages" / f"{page:02}.webp", quality=90, method=6)
        frames.append({"src": f"assets/pages/{page:02}.webp", "alt": item["alt"], "width": image.width, "height": image.height})
        raw = json.loads((ROOT / "review" / "asr" / f"page-{page:02}.json").read_text())
        audio = ROOT / f"audio_{page}.mp3"
        assert raw["audio_sha256"] == hashlib.sha256(audio.read_bytes()).hexdigest(), "Stale ASR"
        pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(audio), "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"])
        page_duration = len(pcm) / (RATE * 2)
        offset = sample_cursor / RATE
        timed_words = [w for seg in raw["segments"] for w in seg.get("words", [])]
        timing, fraction, diffs = align(item["text"], timed_words, page_duration)
        if fraction < .94:
            raise ValueError(f"Page {page}: alignment match {fraction:.1%}; review transcript")
        all_times.extend([[round(a + offset, 3), round(b + offset, 3)] for a, b in timing["w"]])
        report.append({"page": page, "audio": audio.name, "audio_sha256": raw["audio_sha256"],
                       "start": round(offset, 6), "duration": page_duration, "word_count": len(timing["w"]),
                       "exact_fraction": round(fraction, 4), "differences": diffs,
                       "expected": item["text"], "heard": raw["text"].strip()})
        first_line = len(lines)
        page_lines = captions(item["text"])
        starts, count = [], 0
        for text in page_lines:
            starts.append(count)
            count += len(WORD.findall(text))
            lines.append({"frame": page, "chapter": page, "text": text})
            camera.append({"p": page, "py": .5, "pz": 1, "lx": .5, "ly": .5, "lz": 1})
        assert count == len(timing["w"]), "Caption splitting changed the words"
        # Convert authored phrase anchors to exact token indices. Each caption
        # inherits the active target, even when it starts between two cues.
        cue_tokens = []
        last_char = 0
        for cue in item["cues"]:
            phrase, rect, *portrait = cue
            at = item["text"].lower().find(phrase.lower(), last_char)
            if at < 0:
                raise ValueError(f"Page {page}: camera phrase not found in order: {phrase}")
            token = len(WORD.findall(item["text"][:at]))
            cue_tokens.append((token, phrase, rect, portrait[0] if portrait else rect))
            last_char = at + len(phrase)
        assert cue_tokens[0][0] == 0
        for local_line, start in enumerate(starts):
            end = starts[local_line + 1] if local_line + 1 < len(starts) else count
            inherited = [c for c in cue_tokens if c[0] <= start][-1]
            active = [(start, *inherited[1:])] + [c for c in cue_tokens if start < c[0] < end]
            for token, label, landscape, portrait in active:
                beats.append({"line": first_line + local_line, "word": token - start, "label": label,
                              "frame": page, "page": page, "landscape": landscape, "portrait": portrait})
        chapters.append({"title": item["title"], "page": page, "line": first_line,
                         "start": round(offset, 3), "end": round(offset + page_duration, 3)})
        pcm_blocks.append(pcm)
        sample_cursor += len(pcm) // 2
        if page < len(source):
            gap = b"\0\0" * round(GAP * RATE)
            pcm_blocks.append(gap)
            sample_cursor += len(gap) // 2
    wav = ROOT / "audio" / "ecclesiastes-story.wav"
    with wave.open(str(wav), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        for block in pcm_blocks:
            output.writeframesraw(block)
    mp3 = ROOT / "audio" / "ecclesiastes-story.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(mp3)], check=True)
    script = "\n".join(line["text"] for line in lines)
    glossary = []
    for page, phrase, kind, meaning, bn in glosses:
        matches = [i for i, line in enumerate(lines) if line["chapter"] == page and phrase.lower() in line["text"].lower()]
        if not matches:
            raise ValueError(f"Glossary phrase crosses captions or is missing: {page}: {phrase}")
        glossary.append({"line": matches[0], "phrase": phrase, "kind": kind, "meaning": meaning, "bn": bn})
    story = {"id": "ecclesiastes", "title": "Ecclesiastes", "titleBn": "হেদায়েতকারী", "kicker": "A story under the sun",
             "audio": "audio/ecclesiastes-story.mp3", "version": "20261005a", "frames": frames,
             "portraitPages": frames, "camera": camera, "cameraBeats": beats, "chapters": chapters,
             "lines": lines, "glossary": glossary, "mediaLayout": "full-pages",
             "voice": {"source": "The ten original English recordings", "speaker": "One narrator"}}
    timing = {"dur": round(sample_cursor / RATE, 3), "w": all_times, "script": script,
              "method": "Whisper small word timestamps, reviewed against source recordings and reconciled to captions",
              "audio_sha256": hashlib.sha256(mp3.read_bytes()).hexdigest()}
    write_js(ROOT / "story.js", "ECCLESIASTES_STORY", story)
    write_js(ROOT / "story-timings.js", "ECCLESIASTES_TIMINGS", timing)
    (ROOT / "review" / "alignment-audit.json").write_text(json.dumps({"method": timing["method"], "audio_sha256": timing["audio_sha256"],
        "duration": timing["dur"], "word_count": len(all_times), "chapters": report}, indent=2, ensure_ascii=False) + "\n")
    print(f"Built {len(chapters)} chapters, {len(lines)} captions, {len(beats)} camera beats, {len(glossary)} explanations, {len(all_times)} words, {timing['dur']}s")


if __name__ == "__main__":
    main()
