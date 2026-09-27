#!/usr/bin/env python3
"""Build karaoke timings with local Whisper word timestamps.

Whisper times the clean recordings in audio/_dry-originals/. The displayed
words remain the scripts in scenarios.js; differences in spelling, contractions
and number formatting are reconciled before timings.js is written.

Run: python3 tools/align.py  (needs openai-whisper and ffmpeg)
For reviewing a saved Whisper pass: python3 tools/align.py --raw-json FILE
No API key is used; a cached model also needs no network access.
"""

import argparse
import difflib
import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "audio" / "_dry-originals"
SCEN = ROOT / "scenarios.js"
OUT = ROOT / "timings.js"
WORD = re.compile(r"[A-Za-z’'-]+")  # same rule as index.html
HEARD_WORD = re.compile(r"[A-Za-z0-9’'-]+")
ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
         "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty",
        "seventy", "eighty", "ninety"]


def norm(word):
    word = re.sub(r"[^a-z0-9]", "", word.lower().replace("’", "'"))
    if not word.isdigit():
        return word
    n = int(word)
    if n < 10:
        return ONES[n]
    if n < 20:
        return TEENS[n - 10]
    if n < 100:
        return TENS[n // 10] + (ONES[n % 10] if n % 10 else "")
    return word


def scripts_from_js():
    code = r'''
const vm=require("vm"), fs=require("fs"), c={}; vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8")+";this.O=SCENARIOS", c);
const out={}; c.O.forEach(s=>s.speakers.forEach((sp,i)=>out[s.id+"-"+(i+1)]=sp.script));
console.log(JSON.stringify(out));
'''
    done = subprocess.run(["node", "-e", code, str(SCEN)], capture_output=True,
                          text=True, check=True)
    return json.loads(done.stdout)


def duration(path):
    done = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                           "format=duration", "-of",
                           "default=noprint_wrappers=1:nokey=1", str(path)],
                          capture_output=True, text=True, check=True)
    return float(done.stdout.strip())


def heard_tokens(words):
    """Split rare multiword ASR items while retaining their timed span."""
    result = []
    for item in words:
        bits = HEARD_WORD.findall(item["word"])
        if not bits:
            continue
        start, end = float(item["start"]), float(item["end"])
        weights = [max(1, len(bit)) for bit in bits]
        total = sum(weights)
        t = start
        for bit, weight in zip(bits, weights):
            next_t = t + (end - start) * weight / total
            result.append((bit, t, next_t))
            t = next_t
    return result


def distribute(tokens, left, right):
    """Place script words across one mismatched ASR span."""
    left, right = max(0.0, left), max(left, right)
    weights = [max(1, len(norm(token))) for token in tokens]
    total = sum(weights)
    result, t = [], left
    for weight in weights:
        next_t = t + (right - left) * weight / total
        result.append([t, next_t])
        t = next_t
    return result


def align(script, asr_words, dur):
    tokens = WORD.findall(script)
    heard = heard_tokens(asr_words)
    if not heard:
        raise ValueError("Whisper returned no timed words")
    a, b = [norm(token) for token in tokens], [norm(word) for word, _, _ in heard]
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    times = [None] * len(tokens)
    matched, differences = 0, []
    for kind, i0, i1, j0, j1 in matcher.get_opcodes():
        if kind == "equal":
            matched += i1 - i0
            for i, j in zip(range(i0, i1), range(j0, j1)):
                times[i] = [heard[j][1], heard[j][2]]
            continue
        differences.append({"script": " ".join(tokens[i0:i1]),
                            "heard": " ".join(item[0] for item in heard[j0:j1])})
        if i0 == i1:  # an ASR word with no on-screen counterpart
            continue
        left = heard[j0][1] if j0 < j1 else (heard[j0 - 1][2] if j0 else 0.0)
        right = heard[j1 - 1][2] if j0 < j1 else (
            heard[j0][1] if j0 < len(heard) else dur)
        times[i0:i1] = distribute(tokens[i0:i1], left, right)

    if any(pair is None for pair in times):
        raise ValueError("A transcript word received no timing")
    # Whisper occasionally gives a spoken word a zero-width boundary. A script
    # word inside an ASR contraction can also need a brief display window.
    for i, pair in enumerate(times):
        if pair[1] - pair[0] >= 0.04:
            continue
        before = times[i - 1] if i else None
        after = times[i + 1] if i + 1 < len(times) else None
        gap_before = pair[0] - (before[1] if before else 0.0)
        gap_after = (after[0] if after else dur) - pair[1]
        if gap_before >= 0.08:
            pair[0] -= min(0.16, gap_before)
        elif gap_after >= 0.08:
            pair[1] += min(0.16, gap_after)
        else:
            take_before = min(0.06, (before[1] - before[0]) / 3) if before else 0
            take_after = min(0.06, (after[1] - after[0]) / 3) if after else 0
            if before:
                before[1] -= take_before
                pair[0] -= take_before
            if after:
                after[0] += take_after
                pair[1] += take_after
    previous = 0.0
    for pair in times:
        pair[0] = min(dur, max(previous, pair[0]))
        pair[1] = min(dur, max(pair[0], pair[1]))
        previous = pair[1]
    return {"dur": round(dur, 3),
            "w": [[round(start, 3), round(end, 3)] for start, end in times]}, \
           matched / len(tokens), differences


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default="small", help="Whisper model (default: small)")
    parser.add_argument("--raw-json", type=Path, help="reuse a saved Whisper output")
    args = parser.parse_args()
    scripts = scripts_from_js()
    raw = json.loads(args.raw_json.read_text()) if args.raw_json else None
    model = None
    if raw is None:
        import whisper
        model = whisper.load_model(args.model)

    result, report = {}, []
    for key, script in sorted(scripts.items()):
        mp3 = SRC / (key + ".mp3")
        if not mp3.is_file():
            raise FileNotFoundError(mp3)
        if raw is None:
            transcription = model.transcribe(str(mp3), language="en",
                                              word_timestamps=True, fp16=False,
                                              verbose=None,
                                              condition_on_previous_text=False)
            words = [word for segment in transcription["segments"]
                     for word in segment.get("words", [])]
        else:
            words = raw[key]["words"]
        item, fraction, differences = align(script, words, duration(mp3))
        result[key] = item
        report.append((key, fraction, differences))
        print(f"{key:34} {len(item['w']):3} words, {fraction:.1%} exact ASR match")

    poor = [(key, fraction, differences) for key, fraction, differences in report
            if fraction < 0.80]
    if poor:
        for key, fraction, differences in poor:
            print(f"REVIEW {key}: {fraction:.1%} match; {differences}")
        raise SystemExit("Transcript and audio differ too much; timings were not written")

    header = ("/* Word timings for the recorded interviews.\n"
              "   Whisper word timestamps, reconciled to scenarios.js by tools/align.py.\n"
              "   One [start, end] pair per transcript word, in transcript order.\n"
              "   Do not hand-edit: regenerate if a recording or script changes. */\n")
    OUT.write_text(header + "const TIMINGS = "
                   + json.dumps(result, separators=(",", ":")) + ";\n"
                   + "if (typeof module !== 'undefined') module.exports = { TIMINGS };\n")
    exact = sum(round(fraction * len(result[key]["w"])) for key, fraction, _ in report)
    total = sum(len(result[key]["w"]) for key, _, _ in report)
    print(f"\n{len(report)} files, {exact}/{total} transcript words matched exactly ({exact / total:.1%})")
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} kB)")


if __name__ == "__main__":
    main()
