"""Choose one ElevenLabs take per clip and voice, and bring it into the app's audio folder.

    python3 pick_takes.py tts/linking.tsv            # report only
    python3 pick_takes.py tts/linking.tsv --write    # copy the chosen takes into ../../audio/

For each take: the speech span (frames within 35 dB of the take's loudest), the longest
silent run inside it (frames 30 dB below the loudest), and whether pocketsphinx can align
the expected words. Takes of the same phrase share the same stop closures, so the take with
the shortest silent run is the one with no pause at the joins. Ties go to the take whose
length is nearest the median of its siblings (an odd take is usually a mis-read).
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
from align_ps import ps_align
from spec import WORDS, SENTENCES, SAY
from analyse import parse_sentence

TAKES = os.path.join(HERE, 'tts-takes')
PRE, POST, FADE_IN, FADE_OUT = 0.05, 0.12, 0.008, 0.012


def lines(path):
    for ln in open(path, encoding='utf-8'):
        ln = ln.rstrip('\n')
        if not ln or ln.startswith('#') or '\t' not in ln: continue
        k, text = ln.split('\t', 1)
        yield k, text


def words_of(text):
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


def write(m, mp3, wav):
    y, sr = m['y'], m['sr']
    s, e = max(0, int((m['on'] - PRE) * sr)), min(len(y), int((m['off'] + POST) * sr))
    y = y[s:e].copy()
    k = int(FADE_IN * sr); y[:k] *= np.linspace(0, 1, k)
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
    for k, text in lines(argv[0]):
        ws, levels, pauses = plan(k) if (k in WORDS or k in SENTENCES) else (words_of(text), None, [])
        for v in ('alice', 'brian'):
            d = os.path.join(TAKES, v)
            takes = sorted(f for f in os.listdir(d) if f.startswith(k + '-') and f[len(k) + 1:-4].isdigit())
            ms = {int(f[len(k) + 1:-4]): measure(os.path.join(d, f), ws, pauses) for f in takes}
            if not ms: print(f'{k:22s} {v}: no takes'); continue
            med = statistics.median(m['span'] for m in ms.values())
            if pauses:
                # thought groups: as many clear pauses as the line has group boundaries
                score = lambda t: (not ms[t]['ok'], abs(ms[t]['pauses'] - len(pauses)), abs(ms[t]['span'] - med))
            else:
                score = lambda t: (not ms[t]['ok'], round(ms[t]['gap'], 2), abs(ms[t]['span'] - med))
            pick = forced.get((k, v)) or min(ms, key=score)
            info = lambda m: f" gap{m['gap']*1000:3.0f} p{m['pauses']}"
            row = '  '.join(f"{t}:{m['span']:.2f}s{info(m)}{'' if m['ok'] else ' ALIGN?'}{'*' if t == pick else ' '}" for t, m in sorted(ms.items()))
            print(f'{k:22s} {v:5s}  {row}')
            if do_write:
                write(ms[pick], os.path.join(audio_dir(v), f'{k}.mp3'), os.path.join(work[v], 'wav', f'{k}.wav'))
