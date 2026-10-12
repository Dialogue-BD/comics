"""Phoneme-level alignment by DTW against MBROLA (espeak-ng mb-us1) synthesis."""
import os, subprocess, tempfile
import numpy as np, librosa

VOWELS = {'i', 'I', 'E', '{', 'A', 'V', 'U', 'u', '@', 'r=', '3', '3`', 'O', 'aI', 'aU', 'OI', 'EI', 'eI',
          '@U', 'oU', 'o', 'e', 'a', '@`', 'Q', 'i@', 'e@', 'U@', 'l='}
ONSET2 = {('s', 'p'), ('s', 't'), ('s', 'k'), ('p', 'r'), ('p', 'l'), ('b', 'r'), ('b', 'l'), ('t', 'r'),
          ('d', 'r'), ('k', 'r'), ('k', 'l'), ('g', 'r'), ('g', 'l'), ('f', 'r'), ('f', 'l'), ('T', 'r'),
          ('s', 'l'), ('s', 'm'), ('s', 'n'), ('s', 'w'), ('t', 'w'), ('k', 'w'), ('p', 'j'), ('k', 'j'),
          ('f', 'j'), ('m', 'j'), ('h', 'j'), ('S', 'r')}
SR = 16000


def base(p):
    return p.split('_')[0]


def is_vowel(p):
    return base(p) in VOWELS


def pho(text):
    out = subprocess.run(['espeak-ng', '-v', 'mb-us1', '-q', '--pho', text], capture_output=True, text=True).stdout
    ph = []
    for line in out.splitlines():
        f = line.split()
        if len(f) >= 2:
            ph.append((f[0], int(f[1]) / 1000.0))
    return ph


def wav(text):
    fn = tempfile.mktemp(suffix='.wav')
    subprocess.run(['espeak-ng', '-v', 'mb-us1', '-w', fn, text], check=True)
    y, _ = librosa.load(fn, sr=SR)
    os.remove(fn)
    return y


def synth_words(say_words, gaps):
    """Synthesize each word, trim the trailing silence MBROLA adds, and return
    (audio, phones) where phones = [(phone, start, end, word_index)]."""
    pieces, phones, t = [], [], 0.0
    for wi, (w, gap) in enumerate(zip(say_words, gaps)):
        ph = pho(w)
        y = wav(w)
        speech = [(p, d) for p, d in ph if p != '_']
        # leading silences
        lead = 0.0
        for p, d in ph:
            if p == '_': lead += d
            else: break
        L = sum(d for _, d in speech)
        a = int(lead * SR); b = int((lead + L) * SR)
        pieces.append(y[a:b])
        tt = t
        for p, d in speech:
            phones.append((p, tt, tt + d, wi)); tt += d
        t += L
        if gap:
            pieces.append(np.zeros(int(0.25 * SR))); t += 0.25
    return np.concatenate(pieces), phones


def feats(y, sr, hop):
    M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20, hop_length=hop, n_fft=512)[1:]
    d = librosa.feature.delta(M)
    X = np.vstack([M, d * 0.5])
    return (X - X.mean(1, keepdims=True)) / (X.std(1, keepdims=True) + 1e-6)


def align(real, real_sr, say_words, gaps, on=None, off=None):
    """Return phones mapped onto the real recording's time axis."""
    y_syn, phones = synth_words(say_words, gaps)
    y = real.astype(np.float32)
    if real_sr != SR: y = librosa.resample(y, orig_sr=real_sr, target_sr=SR)
    off_s = on or 0.0
    if on is not None:
        y = y[int(on * SR):int((off or len(y) / SR) * SR)]
    hop = int(SR * 0.005)
    A = feats(y_syn, SR, hop); B = feats(y, SR, hop)
    D, wp = librosa.sequence.dtw(X=A, Y=B, metric='cosine')
    wp = wp[::-1]
    # for each synthetic frame, the mean real frame
    m = {}
    for i, j in wp: m.setdefault(i, []).append(j)
    nA = A.shape[1]
    def T(ts):
        fa = min(nA - 1, max(0, int(round(ts / 0.005))))
        while fa not in m and fa > 0: fa -= 1
        return off_s + float(np.mean(m.get(fa, [0]))) * 0.005
    out = []
    for p, a, b, wi in phones:
        out.append([p, round(T(a), 3), round(T(b), 3), wi])
    # make contiguous within words
    for k in range(1, len(out)):
        if out[k][3] == out[k - 1][3]:
            out[k][1] = out[k - 1][2]
    return out


def syllabify(phs, n_target=None):
    """Group a word's phones into syllables. Returns list of lists of phone indices."""
    nuc = [i for i, p in enumerate(phs) if is_vowel(p[0])]
    if not nuc:
        return [list(range(len(phs)))]
    bounds = [0]
    for a, b in zip(nuc[:-1], nuc[1:]):
        cons = list(range(a + 1, b))
        k = len(cons)
        if k == 0: cut = b
        elif k == 1: cut = cons[0]
        else:
            pair = (base(phs[cons[-2]][0]), base(phs[cons[-1]][0]))
            cut = cons[-2] if pair in ONSET2 else cons[-1]
        bounds.append(cut)
    bounds.append(len(phs))
    syl = [list(range(bounds[i], bounds[i + 1])) for i in range(len(bounds) - 1)]
    if n_target and len(syl) != n_target:
        # merge or split to match the spec count
        while len(syl) > n_target:
            # merge the shortest adjacent pair
            j = min(range(len(syl) - 1), key=lambda i: len(syl[i]) + len(syl[i + 1]))
            syl[j] = syl[j] + syl.pop(j + 1)
        while len(syl) < n_target:
            j = max(range(len(syl)), key=lambda i: len(syl[i]))
            s = syl[j]
            if len(s) < 2: break
            h = len(s) // 2
            syl[j:j + 1] = [s[:h], s[h:]]
    return syl
