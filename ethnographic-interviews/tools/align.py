#!/usr/bin/env python3
"""Word-level timings for the eighteen interviews, by forced alignment.

We already know every word that was said, so this is alignment, not
recognition: PocketSphinx is handed the transcript and asked where in the
waveform each word falls. The acoustic model ships inside the wheel, which
matters here because the sandbox cannot reach a model host.

Three words in the whole activity are outside the CMU dictionary. Hyphenated
compounds are aligned as their parts and then collapsed back to one span, and
the rest go through a small substitution table — the label the page shows
always comes from the transcript, never from this file, so a stand-in
pronunciation costs nothing.

Output: timings.js — { "<key>": {dur, w:[[start,end], ...]} }, one pair per
transcript word, in transcript order, so the page can zip them straight onto
its own tokens with no matching at runtime.
Run it with:  python3 tools/align.py       (needs pocketsphinx and ffmpeg)

The clean takes in audio/_dry-originals/ are what get aligned — the ambience
beds cost the recogniser accuracy and the durations are identical either way,
so the times apply to the files the page actually plays.
"""
import os, re, json, subprocess, sys, difflib
from pocketsphinx import Decoder, Config, get_model_path

# run from anywhere: everything is found relative to this file
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                       # ethnographic-interviews/
SRC  = os.path.join(ROOT, "audio", "_dry-originals")   # align the clean takes
SCEN = os.path.join(ROOT, "scenarios.js")
OUT  = os.path.join(ROOT, "timings.js")

WORD = re.compile(r"[A-Za-z’'-]+")

model = get_model_path()
dict_path = os.path.join(model, "en-us", "cmudict-en-us.dict")
KNOWN = set()
for line in open(dict_path, encoding="latin-1"):
    w = line.split("\t")[0].split(" ")[0].strip()
    KNOWN.add(re.sub(r"\(\d+\)$", "", w).lower())


def parts_for(token):
    """What to hand the aligner for one transcript word, as a list."""
    t = token.lower().replace("’", "'")
    if t in KNOWN:
        return [t]
    if "-" in t:                                  # twenty-two-year-old, half-formed
        bits = [b for b in t.split("-") if b]
        if all(b in KNOWN for b in bits):
            return bits
    stripped = t.strip("'")
    if stripped in KNOWN:
        return [stripped]
    # a name the dictionary has never met (Pune). The nearest spelling gives a
    # close-enough pronunciation, and the label on screen comes from the
    # transcript regardless, so the stand-in is never seen.
    near = difflib.get_close_matches(t, KNOWN, n=1, cutoff=0.6)
    if near:
        print("   (%s aligned as %s)" % (t, near[0]))
        return [near[0]]
    return None                                   # unalignable; time it by neighbours


scripts = json.loads(subprocess.run(["node", "-e", """
const vm=require("vm"),fs=require("fs");const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1],"utf8")+";this.O=SCENARIOS",c);
const out={};c.O.forEach(s=>s.speakers.forEach((sp,i)=>out[s.id+"-"+(i+1)]=sp.script));
console.log(JSON.stringify(out));
""", SCEN], capture_output=True, text=True, check=True).stdout)

cfg = Config(hmm=os.path.join(model, "en-us", "en-us"), dict=dict_path,
             samprate=16000, loglevel="ERROR")
dec = Decoder(cfg)

result, report = {}, []
for key in sorted(scripts):
    mp3 = os.path.join(SRC, key + ".mp3")
    pcm = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
                          "-i", mp3, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    dur = len(pcm) / 2 / 16000.0

    tokens = WORD.findall(scripts[key])
    align_words, owner = [], []          # owner[i] = index of the transcript token
    for ti, tok in enumerate(tokens):
        p = parts_for(tok)
        if p:
            for w in p:
                align_words.append(w); owner.append(ti)

    dec.set_align_text(" ".join(align_words))
    dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()

    # segment times come back in 10 ms frames, silences included
    spans, ai = [None] * len(align_words), 0
    for seg in dec.seg():
        w = seg.word.lower()
        if w in ("<sil>", "<s>", "</s>", "[noise]", "(null)"):
            continue
        w = re.sub(r"\(\d+\)$", "", w)
        if ai < len(align_words):
            spans[ai] = (seg.start_frame / 100.0, seg.end_frame / 100.0)
            ai += 1

    times = [None] * len(tokens)
    for i, sp in enumerate(spans):
        if not sp: continue
        ti = owner[i]
        if times[ti] is None: times[ti] = [sp[0], sp[1]]
        else: times[ti][1] = sp[1]        # collapse a hyphenated compound back to one

    matched = sum(1 for t in times if t)
    known_i = [i for i, t in enumerate(times) if t]
    if not known_i:
        print("!! %s: alignment produced nothing" % key); continue
    for i in range(known_i[0]):
        times[i] = [0.0, times[known_i[0]][0]]
    for i in range(known_i[-1] + 1, len(times)):
        times[i] = [times[known_i[-1]][1], dur]
    for x, y in zip(known_i, known_i[1:]):
        if y - x < 2: continue
        t0, t1 = times[x][1], times[y][0]
        step = (t1 - t0) / (y - x)
        for k in range(1, y - x):
            times[x + k] = [t0 + step * (k - 1), t0 + step * k]

    result[key] = {"dur": round(dur, 3),
                   "w": [[round(a, 3), round(b, 3)] for a, b in times]}
    report.append((key, len(tokens), matched, dur))
    print("%-34s %3d words, %3d aligned (%3.0f%%), %5.1fs" %
          (key, len(tokens), matched, matched / len(tokens) * 100, dur))

with open(OUT, "w") as f:
    f.write("/* Word timings for the eighteen recordings.\n"
            "   Forced alignment, produced by tools/align.py — see audio/README.md.\n"
            "   One [start, end] pair per transcript word, in transcript order.\n"
            "   Do not hand-edit: regenerate if a recording or a script changes. */\n")
    f.write("const TIMINGS = " + json.dumps(result, separators=(",", ":")) + ";\n")
    f.write("if (typeof module !== 'undefined') module.exports = { TIMINGS };\n")

tot = sum(r[1] for r in report); ok = sum(r[2] for r in report)
print("\n%d files, %d/%d words aligned (%.1f%%)" % (len(report), ok, tot, ok / tot * 100))
print("wrote %s (%.0f kB)" % (OUT, os.path.getsize(OUT) / 1024))
