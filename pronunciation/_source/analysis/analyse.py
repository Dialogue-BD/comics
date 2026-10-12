"""Acoustic analysis of every Voice Lab clip.

For each clip: onset/offset, F0 (10 ms, octave-cleaned), a waveform envelope,
frame classes (silence / air / voice), syllables (nuclei from intensity peaks,
count fixed by the spec), per-syllable prominence, word timings (DTW against
espeak-ng for sentences), and a playback gain so every clip plays at a similar
loudness.
"""
import json, os, subprocess, sys, tempfile
import numpy as np, parselmouth as pm, librosa
from scipy.signal import medfilt, find_peaks
sys.path.insert(0, os.path.dirname(__file__))
from spec import WORDS, SENTENCES

WAV = '/home/claude/wav'
OUT = '/home/claude/ana/out'
os.makedirs(OUT, exist_ok=True)
STEP = 0.01


def load(k):
    s = pm.Sound(f'{WAV}/{k}.wav')
    return s, s.values[0], s.sampling_frequency


def f0_track(s):
    p = s.to_pitch_ac(time_step=STEP, pitch_floor=75, pitch_ceiling=500, voicing_threshold=0.42,
                      octave_jump_cost=0.6, very_accurate=True)
    t = p.xs(); f = p.selected_array['frequency'].copy()
    v = f > 0
    if v.sum() < 3:
        return t, f
    med = np.median(f[v])
    # octave clean: fold frames more than ~0.75 octave from the median
    for i in np.where(v)[0]:
        r = np.log2(f[i] / med)
        if r > 0.75: f[i] /= 2
        elif r < -0.85: f[i] *= 2
    # running-median continuity: fix jumps vs a 7-frame local median
    out = f.copy()
    idx = np.where(f > 0)[0]
    for j, i in enumerate(idx):
        lo, hi = max(0, j - 3), min(len(idx), j + 4)
        loc = np.median(f[idx[lo:hi]])
        r = np.log2(f[i] / loc)
        if r > 0.6: out[i] = f[i] / 2
        elif r < -0.6: out[i] = f[i] * 2
    f = out
    # drop voiced islands shorter than 40 ms
    i = 0
    while i < len(f):
        if f[i] > 0:
            j = i
            while j < len(f) and f[j] > 0: j += 1
            if (j - i) * STEP < 0.04: f[i:j] = 0
            i = j
        else:
            i += 1
    # light smoothing inside voiced runs
    g = f.copy()
    for i in range(1, len(f) - 1):
        if f[i] > 0 and f[i - 1] > 0 and f[i + 1] > 0:
            g[i] = np.median([f[i - 1], f[i], f[i + 1]])
    return t, g


def frame_feats(x, sr, n):
    """RMS, zero-crossing rate per 10 ms frame (centred at k*STEP)."""
    hop = int(sr * STEP); win = hop * 2
    rms = np.zeros(n); zcr = np.zeros(n)
    for k in range(n):
        c = int((k + 0.5) * hop)
        a, b = max(0, c - win // 2), min(len(x), c + win // 2)
        seg = x[a:b]
        if len(seg) < 4: continue
        rms[k] = np.sqrt(np.mean(seg ** 2))
        zcr[k] = np.mean(np.abs(np.diff(np.sign(seg)))) / 2
    return rms, zcr


def analyse_clip(k):
    s, x, sr = load(k)
    dur = s.duration
    n = int(np.ceil(dur / STEP))
    tf, f0 = f0_track(s)
    # resample f0 onto our frame grid (frame k centre = (k+.5)*STEP)
    grid = (np.arange(n) + 0.5) * STEP
    F = np.zeros(n)
    for i, t in enumerate(tf):
        k2 = int(t / STEP)
        if 0 <= k2 < n: F[k2] = f0[i]
    rms, zcr = frame_feats(x, sr, n)
    db = 20 * np.log10(rms + 1e-6)
    top = np.percentile(db, 99)
    sil_th = top - 32
    loud = db > sil_th
    on = int(np.argmax(loud)); off = int(n - np.argmax(loud[::-1]))
    # frame class: 0 silence, 1 air (noise), 2 voice
    cls = np.zeros(n, dtype=int)
    for i in range(n):
        if F[i] > 0 and db[i] > top - 40: cls[i] = 2
        elif db[i] > top - 30 and zcr[i] > 0.18: cls[i] = 1
        elif db[i] > sil_th and zcr[i] > 0.25: cls[i] = 1
    # playback gain: bring active speech RMS to -20 dBFS
    act = rms[loud]
    act_db = 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9) if len(act) else -30
    gain = float(np.clip(10 ** ((-20 - act_db) / 20), 0.5, 4.0))
    peak = float(np.abs(x).max())
    gain = float(min(gain, 0.95 / max(peak, 1e-6)))
    # intensity for syllables (5 ms)
    it = s.to_intensity(minimum_pitch=100, time_step=0.005)
    ti = it.xs(); vi = it.values[0]
    vi = np.convolve(vi, np.ones(5) / 5, mode='same')
    # low-mid band energy per frame (vowel-ness)
    S = np.abs(librosa.stft(x.astype(np.float32), n_fft=1024, hop_length=int(sr * STEP), win_length=int(sr * 0.025))) ** 2
    fr = librosa.fft_frequencies(sr=sr, n_fft=1024)
    band = 10 * np.log10(S[(fr > 300) & (fr < 2500)].sum(0) + 1e-10)
    band = np.pad(band, (0, max(0, n - len(band))))[:n]
    return dict(band=band, k=k, dur=dur, n=n, F=F, rms=rms, db=db, top=top, cls=cls, on=on, off=off,
                gain=gain, ti=ti, vi=vi, x=x, sr=sr)


def nuclei(c, t_a, t_b, count):
    """Pick `count` syllable nuclei between t_a and t_b; return (peaks, bounds)."""
    ti, vi, F = c['ti'], c['vi'], c['F']
    m = (ti >= t_a) & (ti <= t_b)
    idx = np.where(m)[0]
    if len(idx) == 0:
        mid = np.linspace(t_a, t_b, count + 1)
        return list((mid[:-1] + mid[1:]) / 2), list(mid)
    seg = vi[idx]
    pk, props = find_peaks(seg, prominence=0.8, distance=int(0.07 / 0.005))
    cands = []
    for p, pr in zip(pk, props['prominences']):
        t = ti[idx[p]]
        fk = int(t / STEP)
        voiced = any(0 <= j < len(F) and F[j] > 0 for j in range(fk - 3, fk + 4))
        score = pr + (3 if voiced else -6) + (seg[p] - seg.max()) * 0.15
        cands.append((score, t))
    cands.sort(reverse=True)
    chosen = sorted(t for _, t in cands[:count])
    if len(chosen) < count:
        # fallback: split the span evenly
        mid = np.linspace(t_a, t_b, count + 1)
        chosen = sorted(list(chosen) + list(((mid[:-1] + mid[1:]) / 2)[len(chosen):]))
        chosen = chosen[:count]
    bounds = [t_a]
    for a, b in zip(chosen[:-1], chosen[1:]):
        mm = (ti > a) & (ti < b)
        j = np.where(mm)[0]
        bounds.append(float(ti[j[np.argmin(vi[j])]]) if len(j) else (a + b) / 2)
    bounds.append(t_b)
    return [float(v) for v in chosen], [float(v) for v in bounds]


def syl_feats(c, a, b, nuc):
    F, db = c['F'], c['db']
    ka, kb = int(a / STEP), max(int(a / STEP) + 1, int(b / STEP))
    f = F[ka:kb]; f = f[f > 0]
    kn = int(nuc / STEP)
    pkdb = float(np.max(db[max(0, kn - 4):kn + 5])) if len(db) else 0
    voiced_dur = float(np.sum(F[ka:kb] > 0) * STEP)
    return dict(s=round(a, 3), e=round(b, 3), n=round(nuc, 3), db=round(pkdb - c['top'], 1),
                f0=round(float(np.max(f)), 1) if len(f) else 0,
                f0m=round(float(np.mean(f)), 1) if len(f) else 0, vd=round(voiced_dur, 3))


def prominence(syls):
    """Combine loudness, voiced duration and pitch into a 0..1 score per syllable."""
    if not syls: return
    def z(vals):
        v = np.array(vals, float)
        return (v - v.mean()) / (v.std() + 1e-6) if len(v) > 1 else np.zeros(len(v))
    st = [12 * np.log2(s['f0'] / 100) if s['f0'] > 0 else 0 for s in syls]
    sc = 0.45 * z([s['db'] for s in syls]) + 0.35 * z([s['vd'] for s in syls]) + 0.3 * z(st)
    if len(syls) == 1:
        syls[0]['p'] = 1.0; return
    lo, hi = sc.min(), sc.max()
    for s, v in zip(syls, sc):
        s['p'] = round(float((v - lo) / (hi - lo + 1e-6)), 3)


def envelope(c, bar=0.02):
    x, sr = c['x'], c['sr']
    hop = int(sr * bar)
    nb = int(np.ceil(len(x) / hop))
    e = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(nb)])
    e = e / (e.max() + 1e-9)
    return [round(float(v), 3) for v in np.sqrt(e)]


def synth(words, gaps):
    """espeak each word; return (audio, boundaries) at 22050 Hz."""
    sr = 22050; pieces = []; bounds = []; t = 0.0
    for w, gap in zip(words, gaps):
        fn = tempfile.mktemp(suffix='.wav')
        subprocess.run(['espeak-ng', '-v', 'en-us', '-s', '150', '-w', fn, w], check=True)
        y, _ = librosa.load(fn, sr=sr); os.remove(fn)
        yt, _ = librosa.effects.trim(y, top_db=30)
        bounds.append((t, t + len(yt) / sr))
        pieces.append(yt); t += len(yt) / sr
        if gap:
            pieces.append(np.zeros(int(0.22 * sr))); t += 0.22
    return np.concatenate(pieces), bounds, sr


def align_words(c, words, gaps):
    y_syn, b_syn, sr = synth(words, gaps)
    y_real = c['x'].astype(np.float32)
    if c['sr'] != sr: y_real = librosa.resample(y_real, orig_sr=c['sr'], target_sr=sr)
    hop = int(sr * 0.01)
    A = librosa.feature.mfcc(y=y_syn, sr=sr, n_mfcc=20, hop_length=hop)[1:]
    B = librosa.feature.mfcc(y=y_real, sr=sr, n_mfcc=20, hop_length=hop)[1:]
    A = (A - A.mean(1, keepdims=True)) / (A.std(1, keepdims=True) + 1e-6)
    B = (B - B.mean(1, keepdims=True)) / (B.std(1, keepdims=True) + 1e-6)
    D, wp = librosa.sequence.dtw(X=A, Y=B, metric='cosine')
    wp = wp[::-1]
    def map_t(ts):
        fa = int(ts / 0.01)
        ys = [j for i, j in wp if i == fa]
        if not ys:
            ys = [j for i, j in wp if abs(i - fa) <= 2]
        return float(np.median(ys)) * 0.01 if ys else ts
    out = []
    for (a, b) in b_syn:
        out.append([map_t(a), map_t(b)])
    return out


def refine(c, t, rad=0.04):
    """Snap a boundary to the quietest point within +-rad."""
    db = c['db']; k = int(t / STEP); r = int(rad / STEP)
    lo, hi = max(0, k - r), min(len(db) - 1, k + r)
    j = lo + int(np.argmin(db[lo:hi + 1]))
    return (j + 0.5) * STEP


def pack(c):
    F = c['F']
    return dict(dur=round(c['dur'], 3), on=round(c['on'] * STEP, 3), off=round(c['off'] * STEP, 3),
                gain=round(c['gain'], 3),
                f0=[int(round(v)) for v in F], cls=''.join(str(v) for v in c['cls']),
                env=envelope(c))


import phon
from spec import SAY


def refine_vowel(c, va, vb, sa):
    band, F = c['band'], c['F']
    k0 = max(0, int((max(sa, va - 0.09)) / STEP)); k1 = min(len(band) - 1, int(vb / STEP))
    if k1 <= k0: return va
    win = band[k0:k1 + 1]
    th = win.max() - 7
    for j in range(k0, k1 + 1):
        if band[j] >= th and (F[j] > 0 or band[j] >= win.max() - 3):
            return round(j * STEP, 3)
    return va


def syls_from_phones(c, phs, texts, levels):
    groups = phon.syllabify([p for p in phs], len(texts))
    out = []
    for i, g in enumerate(groups):
        if not g: continue
        a, b = phs[g[0]][1], phs[g[-1]][2]
        vi = [j for j in g if phon.is_vowel(phs[j][0])]
        va, vb = (phs[vi[0]][1], phs[vi[-1]][2]) if vi else (a, b)
        va = refine_vowel(c, va, vb, a)
        f = syl_feats(c, a, b, (va + vb) / 2)
        f['v'] = [round(va, 3), round(vb, 3)]
        f['ph'] = [[phs[j][0], phs[j][1], phs[j][2]] for j in g]
        out.append(dict(t=texts[i] if i < len(texts) else '', lv=int(levels[i]) if i < len(levels) else 1, **f))
    # beat = vowel onset; keep boundaries between beats
    for i in range(1, len(out)):
        bt = out[i]['v'][0]
        if out[i]['s'] > bt - 0.02 or out[i]['s'] < out[i - 1]['v'][0] + 0.04:
            nb = round(max(out[i - 1]['v'][0] + 0.04, bt - 0.05), 3)
            out[i]['s'] = nb; out[i - 1]['e'] = nb
    return out


def do_word(k):
    text, levels = WORDS[k]
    c = analyse_clip(k)
    on, off = c['on'] * STEP, c['off'] * STEP
    say = SAY.get(k, text.replace('·', ''))
    phs = phon.align(c['x'], c['sr'], [say], [False], on=max(0, on - 0.02), off=min(c['dur'], off + 0.02))
    texts = text.split('·')
    syls = syls_from_phones(c, phs, texts, levels)
    d = pack(c)
    d['words'] = [dict(w=text.replace('·', ''), s=round(phs[0][1], 3), e=round(phs[-1][2], 3), syl=syls)]
    return d


def parse_sentence(spec):
    groups = [g.strip() for g in spec.split('|')]
    words = []
    for gi, g in enumerate(groups):
        toks = g.split()
        for ti_, tok in enumerate(toks):
            tonic = tok.startswith('*'); tok = tok.lstrip('*')
            w, lv = tok.split(':')
            words.append(dict(w=w.replace('·', ''), syl=w.split('·'), lv=lv, tonic=tonic, group=gi,
                              gap_after=(ti_ == len(toks) - 1 and gi < len(groups) - 1)))
    return words


def pauses(c, a, b, n):
    """The n longest silent runs (>=80 ms) strictly inside (a, b)."""
    db, top = c['db'], c['top']
    ka, kb = int(a / STEP) + 5, int(b / STEP) - 5
    runs = []; st = None
    for j in range(ka, kb):
        q = db[j] < top - 28
        if q and st is None: st = j
        if (not q or j == kb - 1) and st is not None:
            if (j - st) * STEP >= 0.08: runs.append((st, j))
            st = None
    runs.sort(key=lambda r: r[0] - r[1])
    runs = sorted(runs[:n])
    return [(r[0] * STEP, r[1] * STEP) for r in runs]


def do_sentence(k):
    c = analyse_clip(k)
    words = parse_sentence(SENTENCES[k])
    on, off = c['on'] * STEP, c['off'] * STEP
    times = align_words(c, [w['w'] for w in words], [w['gap_after'] for w in words])
    times[0][0] = on; times[-1][1] = off
    db, top = c['db'], c['top']
    for i in range(len(times) - 1):
        if words[i]['gap_after']:
            k0 = max(0, int(times[i][1] / STEP) - 15); k1 = min(len(db) - 1, int(times[i + 1][0] / STEP) + 15)
            quiet = [j for j in range(k0, k1) if db[j] < top - 26]
            if quiet:
                runs = []; st = quiet[0]; pv = quiet[0]
                for j in quiet[1:]:
                    if j != pv + 1: runs.append((st, pv)); st = j
                    pv = j
                runs.append((st, pv))
                r = max(runs, key=lambda r: r[1] - r[0])
                times[i][1] = r[0] * STEP; times[i + 1][0] = (r[1] + 1) * STEP
            else:
                times[i][1] = times[i + 1][0] = refine(c, (times[i][1] + times[i + 1][0]) / 2)
        else:
            t = refine(c, (times[i][1] + times[i + 1][0]) / 2, 0.03)
            times[i][1] = times[i + 1][0] = t
    for i in range(len(times)):
        if times[i][1] <= times[i][0] + 0.04: times[i][1] = times[i][0] + 0.04
    out = []
    for w, (a, b) in zip(words, times):
        phs = phon.align(c['x'], c['sr'], [w['w']], [False], on=a, off=b)
        syls = syls_from_phones(c, phs, w['syl'], w['lv'])
        out.append(dict(w=w['w'], s=round(a, 3), e=round(b, 3), tonic=w['tonic'], group=w['group'],
                        gap=w['gap_after'], syl=syls))
    d = pack(c)
    d['words'] = out
    return d


if __name__ == '__main__':
    res = {}
    for k in WORDS:
        res[k] = do_word(k)
    for k in SENTENCES:
        res[k] = do_sentence(k)
    json.dump(res, open(f'{OUT}/analysis.json', 'w'))
    for k, d in res.items():
        ws = d['words']
        print(k, f"{d['dur']:.2f}s g{d['gain']:.2f} ", ' '.join(w['w']+'['+' '.join(f"{s['t']}{s['s']:.2f}-{s['e']:.2f}" for s in w['syl'])+']' for w in ws))
