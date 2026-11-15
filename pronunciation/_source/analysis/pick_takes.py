"""Choose one ElevenLabs take per clip and voice, and bring it into the app's audio folder.

    python3 pick_takes.py tts/linking.tsv            # report only
    python3 pick_takes.py tts/linking.tsv --write    # copy the chosen takes into ../../audio/

For each take: the speech span (frames within 35 dB of the take's loudest), the longest
silent run inside it (frames 30 dB below the loudest), and whether pocketsphinx can align
the expected words. Takes of the same phrase share the same stop closures, so the take with
the shortest silent run is the one with no pause at the joins. Ties go to the take whose
length is nearest the median of its siblings (an odd take is usually a mis-read).
A line with a third column (the words to keep) was recorded inside a primer sentence that
gives the voice the meaning ("The teacher wrote on the blackboard." / "I found an old, black
board."): the kept words are cut out at the quietest point by the word boundary, and for a
…-n / …-p pair the takes that differ most are kept (lean(): the first beat against the
second, by vowel length, loudness and pitch).

A line with thought groups (`|` in spec.py) is judged the other way round: it keeps the take
with as many clear pauses (silences of 150 ms or more; ElevenLabs pauses that long at a
comma, while stop closures are shorter) as the line has group boundaries. Stress is not
judged automatically: on recordings known to be right, loudness, length and pitch picked the
big beat only about half the time, so check stress pairs (nv-…) by ear or on a pitch plot.
`--choose id:voice:take` overrides a choice after listening.

The chosen take is trimmed to 50 ms before the speech and 120 ms after it, given short
fades, and written as 44.1 kHz mono 128k mp3, like the other linking clips; a 22 kHz wav
goes to $VOICELAB_WORK/wav for analyse.py (one work folder per voice).
"""
import os, sys, subprocess, tempfile, statistics
import numpy as np, librosa, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from voice import audio_dir
from align_ps import ps_align, syllabify, VOWELS
from spec import WORDS, SENTENCES, SAY
from analyse import parse_sentence

TAKES = os.path.join(HERE, 'tts-takes')
PRE, POST, FADE_IN, FADE_OUT = 0.05, 0.12, 0.008, 0.012


def lines(path):
    """(clip id, what the voice says, the words to keep or None)."""
    for ln in open(path, encoding='utf-8'):
        ln = ln.rstrip('\n')
        if not ln or ln.startswith('#') or '\t' not in ln: continue
        k, text, *keep = ln.split('\t')
        yield k, text, (keep[0] if keep and keep[0].strip() else None)


def words_of(text):
    import re
    text = re.sub(r'<[^>]*>', ' ', text)          # <break …/> tags are not words
    return [w.strip('.,!?').lower().replace('’', "'") for w in text.split()]


def plan(k):
    """(words to align, syllable levels per word, indexes of the word boundaries that should pause)."""
    if k in WORDS:
        text, lv = WORDS[k]
        return [SAY.get(k, text.replace('·', '')).lower().replace(' ', '')], [lv], []
    ws = parse_sentence(SENTENCES[k])
    return ([w['w'].lower() for w in ws], [''.join(str(l) for l in w['lv']) for w in ws],
            [i for i, w in enumerate(ws[:-1]) if w['gap_after']])


def measure(path, words, pauses=()):
    y, sr = librosa.load(path, sr=44100, mono=True)
    hop = int(sr * 0.01)
    n = len(y) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(n)]) + 1e-7)
    top = np.percentile(db, 99)
    sp = np.where(db > top - 35)[0]
    a, b = int(sp[0]), int(sp[-1]) + 1
    quiet = db[a:b] < top - 30
    run = best = 0; runs = []
    for q in list(quiet) + [False]:
        if q: run += 1
        else:
            if run: runs.append(run)
            run = 0
        best = max(best, run)
    try: ok = len(ps_align(path, words)) == len(words)
    except Exception: ok = False
    # an ElevenLabs comma pause is 150 ms or more; stop closures inside words are shorter
    return dict(y=y, sr=sr, on=a * 0.01, off=b * 0.01, span=(b - a) * 0.01, gap=best * 0.01, ok=ok,
                pauses=sum(r >= 15 for r in runs))


def edge(y, sr, t, back=0.05, fwd=0.02):
    """The quietest 5 ms near t: where to cut between two words."""
    hop = int(sr * 0.005)
    a, b = max(0, int((t - back) * sr)), min(len(y), int((t + fwd) * sr))
    seg = y[a:b]
    if len(seg) < 2 * hop: return t
    e = [np.sqrt(np.mean(seg[i:i + hop] ** 2)) for i in range(0, len(seg) - hop, hop)]
    return (a + int(np.argmin(e)) * hop) / sr


def cut(m, path, sentence, keep):
    """Keep only the words `keep` from a take of the whole sentence (the primer gives the voice
    the meaning; the clip is just the words). Adds the phones of the kept words for lean()."""
    al = ps_align(path, sentence)
    if len(al) != len(sentence): m['ok'] = False; return m
    ks = keep.lower().split()
    i = next((j for j in range(len(sentence) - len(ks) + 1) if sentence[j:j + len(ks)] == ks), None)
    if i is None: m['ok'] = False; return m
    start, end = al[i][0][1], al[i + len(ks) - 1][-1][2]
    m['on'] = edge(m['y'], m['sr'], start)
    nxt = al[i + len(ks)][0][1] if i + len(ks) < len(al) else None
    m['off'] = min(end, nxt) if nxt else end
    m['pre'], m['post'] = 0.0, (0.02 if nxt else 0.12)
    m['span'] = m['off'] - m['on']
    m['phones'] = al[i:i + len(ks)]
    return m


def lean(m):
    """How much the first beat stands out over the second in the kept words: vowel length,
    loudness and top pitch, as log ratios. A compound (BLACKboard) should lean further forward
    than its phrase (black BOARD). Only meaningful between takes of the same pair."""
    import parselmouth
    phs = m.get('phones')
    if not phs: return 0.0
    units = syllabify(phs[0], 2) if len(phs) == 1 else [phs[0], phs[1]]
    y, sr = m['y'], m['sr']
    snd = parselmouth.Sound(y, sr); pitch = snd.to_pitch(time_step=0.01, pitch_floor=60, pitch_ceiling=450)
    f = []
    for u in units[:2]:
        vs = [p for p in u if p[0] in VOWELS]
        if not vs: return 0.0
        a, b = vs[0][1], vs[-1][2]
        seg = y[int(a * sr):max(int(b * sr), int(a * sr) + 1)]
        fs = [x for x in (pitch.get_value_at_time(t) for t in np.arange(a, b, 0.01)) if x == x]
        f.append((b - a, 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-7), max(fs) if fs else 0))
    if len(f) < 2 or not f[0][2] or not f[1][2]: return 0.0
    (d1, r1, p1), (d2, r2, p2) = f
    return float(np.log(d1 / d2) + (r1 - r2) / 6 + np.log(p1 / p2))


def write(m, mp3, wav):
    y, sr = m['y'], m['sr']
    pre, post = m.get('pre', PRE), m.get('post', POST)
    s, e = max(0, int((m['on'] - pre) * sr)), min(len(y), int((m['off'] + post) * sr))
    y = y[s:e].copy()
    k = int((0.015 if m.get('phones') else FADE_IN) * sr); y[:k] *= np.linspace(0, 1, k)
    k = int(FADE_OUT * sr); y[-k:] *= np.linspace(1, 0, k)
    tmp = tempfile.mktemp(suffix='.wav'); sf.write(tmp, y, sr)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-ac', '1', '-ar', '44100', '-b:a', '128k', mp3], check=True)
    os.makedirs(os.path.dirname(wav), exist_ok=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '22050', wav], check=True)
    os.remove(tmp)


if __name__ == '__main__':
    argv = sys.argv[1:]
    do_write = '--write' in argv
    forced = {}
    while '--choose' in argv:
        i = argv.index('--choose'); k, v, t = argv[i + 1].split(':'); forced[(k, v)] = int(t); del argv[i:i + 2]
    argv = [a for a in argv if a != '--write']
    work = {v: os.environ.get(f'VOICELAB_WORK_{v.upper()}', f'/home/claude/work-{v}') for v in ('alice', 'brian')}
    # an id ending @alice / @brian belongs to that voice only (each voice's own accent)
    rows = [(k.partition('@')[0], text, keep, (k.partition('@')[2],) if '@' in k else ('alice', 'brian'))
            for k, text, keep in lines(argv[0])]
    meas = {}
    for k, text, keep, voices in rows:
        if keep:
            sent = words_of(text); ws, pauses = sent, []
        else:
            ws, levels, pauses = plan(k) if (k in WORDS or k in SENTENCES) else (words_of(text), None, [])
        for v in voices:
            d = os.path.join(TAKES, v)
            takes = sorted(f for f in os.listdir(d) if f.startswith(k + '-') and f[len(k) + 1:-4].isdigit())
            ms = {}
            for f in takes:
                path = os.path.join(d, f)
                m = measure(path, ws, pauses)
                if keep: m = cut(m, path, sent, keep); m['lean'] = lean(m) if m['ok'] else 0.0
                ms[int(f[len(k) + 1:-4])] = m
            meas[(k, v)] = (ms, pauses, keep)
    # a pair cut from primers (…-n / …-p): the beat-first take that leans furthest forward and
    # the beat-second take that leans furthest back, so the difference comes through
    for k, text, keep, voices in rows:
        for v in voices:
            ms, pauses, keep = meas[(k, v)]
            if not ms: print(f'{k:22s} {v}: no takes'); continue
            med = statistics.median(m['span'] for m in ms.values())
            if keep:
                sign = -1 if k.endswith('-n') else 1
                score = lambda t: (not ms[t]['ok'], round(sign * ms[t]['lean'], 2), abs(ms[t]['span'] - med))
                info = lambda m: f" lean{m.get('lean', 0):+.2f}"
            elif pauses:
                # thought groups: as many clear pauses as the line has group boundaries
                score = lambda t: (not ms[t]['ok'], abs(ms[t]['pauses'] - len(pauses)), abs(ms[t]['span'] - med))
                info = lambda m: f" gap{m['gap']*1000:3.0f} p{m['pauses']}"
            else:
                score = lambda t: (not ms[t]['ok'], round(ms[t]['gap'], 2), abs(ms[t]['span'] - med))
                info = lambda m: f" gap{m['gap']*1000:3.0f} p{m['pauses']}"
            pick = forced.get((k, v)) or min(ms, key=score)
            row = '  '.join(f"{t}:{m['span']:.2f}s{info(m)}{'' if m['ok'] else ' ALIGN?'}{'*' if t == pick else ' '}" for t, m in sorted(ms.items()))
            print(f'{k:22s} {v:5s}  {row}')
            if do_write:
                write(ms[pick], os.path.join(audio_dir(v), f'{k}.mp3'), os.path.join(work[v], 'wav', f'{k}.wav'))
