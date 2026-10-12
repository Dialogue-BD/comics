"""Bring a second voice's recordings into Voice Lab under the same clip ids.

    python3 import_voice.py brian /path/to/voice-lab-brian [/path/to/fixes …] [--work DIR] [--only con-,vow-]

A fixes folder is laid out like the export (audio/<module>/<name>.mp3, or <module>/<name>.mp3)
and replaces those files.

The Brian export also carries Alice's British half of the accent pairs (accent/*_br.mp3):
    python3 import_voice.py alice /path/to/voice-lab-brian --only acc-

Reads the export (audio/<module>/<name>.mp3), maps each file to its clip id, trims any
scrap of the carrier phrase ("Say ...", "The word is ...") left at the start, and writes
    ../../audio/<voice>/<id>.mp3   (what the app plays)
    <work>/wav/<id>.wav            (22 kHz mono, for analyse.py)

Clips listed in SKIP are not imported: their recordings were cut off (a missing first or
last sound). The app then uses Alice for that word, and for any pair the word belongs to,
so a minimal pair is never split across two voices. Re-run after a corrected export:
take the id out of SKIP and run this again, then analyse / finalize / phones / monotone
with VOICELAB_VOICE=<voice> (see README.md).
"""
import os, re, subprocess, sys, tempfile
import numpy as np, librosa

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from voice import audio_dir

PREFIX = {'consonants': 'con', 'vowels': 'vow', 'decoder': 'dec', 'th': 'th', 'aspiration': 'asp',
          'clusters': 'clu', 'linking': 'lnk', 'numbers': 'num', 'compounds': 'cmp'}
NAMES = {
    'sentences/sent1': 'pro-sent1', 'sentences/sent2': 'pro-sent2', 'sentences/sent3': 'pro-sent3',
    'sentences/sent4': 'pro-sent4', 'sentences/nopause': 'pro-nopause',
    'numbers/date_oct12': 'num-date-oct12', 'numbers/price_14000': 'num-price-14000',
    'numbers/time_530': 'num-time-530',
}
# Accent pairs: the same word in each voice's own accent (Alice British, Brian American).
ACCENT = {'brian': '_am', 'alice': '_br'}

# Cut off in the October 2026 Brian export (checked on spectrograms against Alice's). The
# corrected batches fixed fan, van, jew, zoo, west, zip, pin, pat, price, safe, sip, sank,
# best, team, tim, earth, decision, ability and disagree.
SKIP = {'brian': {
    'con-bet', 'con-hard', 'con-wet', 'vow-about', 'vow-bit', 'vow-supply', 'dec-agree',
    'dec-baby', 'dec-bed', 'dec-go', 'dec-hopping', 'dec-sunset', 'dec-transport', 'th-that', 'th-this',
    'th-those', 'clu-street', 'cmp-greenhouse-n', 'cmp-hotdog-n',
    'num-phone',    # says "phone number with chunking" (the manifest note), not the digits
}}
# Where the word starts (s), when the carrier runs straight into it with no pause.
TRIM = {'brian': {'con-fin': .115, 'vow-full': .115, 'dec-famous': .095, 'dec-happiness': .215, 'dec-me': .43,
                  'vow-beat': .2, 'dec-hoping': .125, 'con-sip': .135, 'th-sank': .165, 'con-safe': .075},
        'alice': {'acc-dance': .15}}
FADE_IN, FADE_OUT = 0.008, 0.012


def clip_id(rel):
    """'consonants/fan.mp3' -> 'con-fan'; None if the file is not a Voice Lab clip."""
    mod, name = rel[:-4].split('/')
    key = f'{mod}/{name}'
    if key in NAMES: return NAMES[key]
    if mod == 'accent': return None
    if mod in PREFIX:
        return f"{PREFIX[mod]}-{name.replace('_', '-')}"
    return None


def carrier_end(y, sr):
    """If the clip opens with a short voiced scrap, then a pause, return where the word starts."""
    hop = int(sr * 0.01)
    n = len(y) // hop
    rms = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    db = 20 * np.log10(rms + 1e-7); top = np.percentile(db, 99)
    on = db > top - 35
    zcr = np.array([np.mean(np.abs(np.diff(np.sign(y[i * hop:(i + 1) * hop])))) / 2 for i in range(n)])
    if not on.any(): return 0.0
    a = int(np.argmax(on)); b = a
    while b < n and on[b]: b += 1
    c = b
    while c < n and not on[c]: c += 1
    island, pause = (b - a) * 0.01, (c - b) * 0.01
    voiced = np.mean(zcr[a:b] < 0.12) if b > a else 0
    if b * 0.01 <= 0.3 and island <= 0.17 and pause >= 0.06 and voiced >= 0.5 and c < n:
        return max(0.0, c * 0.01 - 0.05)
    return 0.0


def write(y, sr, mp3, wav, br):
    tmp = tempfile.mktemp(suffix='.wav')
    import soundfile as sf
    sf.write(tmp, y, sr)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-ac', '1', '-ar', '44100', '-b:a', br, mp3], check=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '22050', wav], check=True)
    os.remove(tmp)


def sources(srcs):
    """{'consonants/fan.mp3': path}; a later export folder replaces files from an earlier one."""
    out = {}
    for src in srcs:
        base = os.path.join(src, 'audio') if os.path.isdir(os.path.join(src, 'audio')) else src
        for mod in sorted(os.listdir(base)):
            d = os.path.join(base, mod)
            if not os.path.isdir(d): continue
            for f in sorted(os.listdir(d)):
                if f.endswith('.mp3'): out[f'{mod}/{f}'] = os.path.join(d, f)
    return out


def main(voice, srcs, work, only=()):
    out = audio_dir(voice); os.makedirs(out, exist_ok=True)
    os.makedirs(f'{work}/wav', exist_ok=True)
    skip, trim = SKIP.get(voice, set()), TRIM.get(voice, {})
    done = []
    for rel, path in sorted(sources(srcs).items()):
        mod, f = rel.split('/')
        if mod == 'accent':
            m = re.match(r'(\w+)' + ACCENT.get(voice, '#') + r'\.mp3$', f)
            if not m: continue
            cid = f'acc-{m.group(1)}'
        else:
            cid = clip_id(rel)
        if not cid or cid in skip: continue
        if only and not any(cid.startswith(o) for o in only): continue
        y, sr = librosa.load(path, sr=44100, mono=True)
        t = trim.get(cid)
        # whole utterances were generated directly (no carrier); compounds open with "a"
        if t is None: t = carrier_end(y, sr) if mod not in ('sentences', 'linking', 'numbers', 'prosody', 'compounds') else 0.0
        if t > 0: y = y[int(t * sr):]
        # short fades so a clip cut at full loudness never clicks
        k = int(FADE_IN * sr); y[:k] *= np.linspace(0, 1, k)
        k = int(FADE_OUT * sr); y[-k:] *= np.linspace(1, 0, k)
        br = '128k' if mod in ('sentences', 'numbers', 'linking', 'compounds') else '64k'
        write(y, sr, os.path.join(out, f'{cid}.mp3'), f'{work}/wav/{cid}.wav', br)
        done.append((cid, t, len(y) / sr))
    for cid, t, dur in done:
        print(f'{cid:22s} {dur:5.2f}s' + (f'  trimmed {t:.3f}s' if t else ''))
    print(len(done), 'clips ->', out)


if __name__ == '__main__':
    argv = sys.argv[1:]
    def opt(name, default=None):
        if name not in argv: return default
        i = argv.index(name); v = argv[i + 1]; del argv[i:i + 2]; return v
    work = opt('--work', os.environ.get('VOICELAB_WORK', '/home/claude'))
    only = tuple(filter(None, (opt('--only', '') or '').split(',')))
    main(argv[0], argv[1:], work, only)
