"""Turn analysis.json into the compact clip data the app ships with.

Adds hand-checked syllable timings for multi-syllable words (read off
spectrograms), a smoothed semitone pitch contour, the strong vowel core,
air/voice spans and the aspiration (VOT) measure.
"""
import json, os, sys, numpy as np

WORK = os.environ.get('VOICELAB_WORK', '/home/claude')
A = json.load(open(f'{WORK}/ana/out/analysis.json'))
APP = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'clips.json')
STEP = 0.01

# Hand-checked from fine-grid spectrograms: (syllable start, vowel onset, end) per syllable.
MANUAL = {
 'dec-information': [(.15, .16, .32), (.32, .40, .53), (.53, .55, .71), (.71, .84, 1.05)],
 'dec-photographic': [(.04, .19, .31), (.31, .37, .47), (.47, .52, .78), (.78, .79, 1.15)],
 'dec-photograph': [(.08, .26, .40), (.40, .46, .54), (.54, .59, 1.05)],
 'dec-decision': [(.16, .18, .27), (.27, .41, .53), (.53, .58, .90)],
 'dec-ability': [(.07, .08, .21), (.21, .25, .45), (.45, .49, .57), (.57, .59, .84)],
 'dec-famous': [(.08, .28, .57), (.57, .62, .93)],
 'dec-baby': [(.07, .08, .29), (.29, .31, .62)],
 'dec-sunset': [(.09, .27, .50), (.50, .58, .98)],
 'dec-hoping': [(.09, .24, .43), (.43, .47, .82)],
 'dec-hopping': [(.08, .15, .40), (.40, .45, .78)],
 'vow-about': [(.06, .07, .19), (.19, .22, .74)],
 'vow-sofa': [(.09, .29, .48), (.48, .57, .82)],
 'vow-supply': [(.07, .22, .30), (.30, .36, .88)],
 'clu-eekul': [(.03, .03, .45), (.45, .66, 1.03)],
 'clu-sitreet': [(.09, .29, .45), (.45, .55, 1.03)],
}


# Multi-word clips: per word, (syllable start, vowel onset, end) per syllable, read off
# spectrograms where the DTW alignment drifted (short linked phrases, numbers).
MANUAL_S = {
 'lnk-turn-off': [[(.04, .13, .33)], [(.33, .36, .56)], [(.56, .60, .66)], [(.66, .70, 1.30)]],
 'lnk-pick-it-up': [[(.06, .09, .21)], [(.21, .24, .37)], [(.37, .40, .80)]],
 'lnk-an-apple': [[(.04, .05, .28)], [(.28, .28, .47), (.47, .52, .80)]],
 'lnk-come-in': [[(.02, .09, .23)], [(.23, .24, .68)]],
 'lnk-go-on': [[(.03, .09, .26)], [(.26, .27, .62)]],
 'lnk-whats-up': [[(.04, .06, .32)], [(.32, .33, .66)]],
 'num-year1994': [[(.07, .10, .35), (.35, .40, .66)], [(.66, .68, .87), (.87, .92, 1.0)], [(1.0, 1.13, 1.48)]],
 'num-year2026': [[(.04, .12, .33), (.33, .36, .53)], [(.53, .60, .77), (.77, .79, .93)], [(.93, 1.03, 1.55)]],
 'num-price-14000': [[(.03, .12, .35), (.35, .41, .65)], [(.65, .72, .93), (.93, .97, 1.17)], [(1.19, 1.25, 1.40), (1.40, 1.42, 1.65)]],
 'num-date-oct12': [[(.05, .06, .20), (.20, .27, .47), (.47, .49, .65)], [(.65, .79, 1.30)]],
 'num-time-530': [[(.06, .14, .42)], [(.42, .50, .72), (.72, .80, 1.02)]],
}


# Vowel spans read off spectrograms (onset -> where formants give way to m/l/closure).
VOWEL = {'vow-team': (.19, .45), 'vow-tim': (.21, .40), 'vow-beat': (.24, .47), 'vow-bit': (.23, .41),
         'vow-fool': (.33, .55), 'vow-full': (.20, .36), 'vow-pool': (.31, .52), 'vow-pull': (.31, .47),
         'con-safe': (.09, .29), 'con-save': (.28, .67), 'con-price': (.22, .46), 'con-prize': (.27, .70),
         'con-herd': (.30, .65), 'con-hard': (.25, .45), 'con-earth': (.15, .50), 'con-earn': (.28, .62)}
# Release burst -> start of voicing (VOT), read off spectrograms.
ASP = {'asp-pin': (.26, .34), 'asp-spin': (.35, .36), 'asp-top': (.20, .29), 'asp-stop': (.13, .14),
       'asp-key': (.16, .28), 'asp-ski': (.32, .34), 'con-pin': (.30, .41), 'con-pat': (.22, .30),
       'vow-pool': (.20, .31), 'vow-pull': (.22, .31), 'vow-team': (.09, .19), 'vow-tim': (.11, .21)}


def smooth_contour(f0, breaks):
    """Semitones re: the clip median; interpolate gaps < 150 ms; break at pauses."""
    f = np.array(f0, float)
    v = f > 0
    if v.sum() < 3:
        return [], 0
    med = float(np.median(f[v]))
    st = np.full(len(f), np.nan)
    st[v] = 12 * np.log2(f[v] / med)
    idx = np.where(v)[0]
    segs = []
    cur = [idx[0]]
    for a, b in zip(idx[:-1], idx[1:]):
        gap = (b - a - 1) * STEP
        brk = any(a * STEP < t < b * STEP for t in breaks)
        if gap > 0.15 or brk:
            segs.append(cur); cur = [b]
        else:
            cur.append(b)
    segs.append(cur)
    out = []
    for s in segs:
        if len(s) < 4: continue
        a, b = s[0], s[-1]
        xs = np.arange(a, b + 1)
        ys = np.interp(xs, s, st[s])
        # gaussian smooth (sigma ~2.5 frames)
        k = np.exp(-0.5 * (np.arange(-6, 7) / 2.5) ** 2); k /= k.sum()
        pad = np.pad(ys, 6, mode='edge')
        ys = np.convolve(pad, k, mode='same')[6:-6]
        out.append([round(a * STEP, 3), [round(float(y), 2) for y in ys]])
    return out, round(med, 1)


def runs(mask, min_len=1, allow_gap=0):
    out = []; i = 0; n = len(mask)
    while i < n:
        if mask[i]:
            j = i; gaps = 0; last = i
            while j < n and (mask[j] or gaps < allow_gap):
                if mask[j]: last = j; gaps = 0
                else: gaps += 1
                j += 1
            if last - i + 1 >= min_len: out.append((i, last + 1))
            i = j
        else:
            i += 1
    return out


def finalize():
    res = {}
    import parselmouth as pm, librosa
    for k, d in A.items():
        x, sr = librosa.load(f'{WORK}/wav/{k}.wav', sr=None)
        n = len(d['f0'])
        S = np.abs(librosa.stft(x, n_fft=1024, hop_length=int(sr * STEP), win_length=int(sr * .025))) ** 2
        fr = librosa.fft_frequencies(sr=sr, n_fft=1024)
        band = 10 * np.log10(S[(fr > 300) & (fr < 2500)].sum(0) + 1e-10)[:n]
        band = np.pad(band, (0, max(0, n - len(band))))
        f0 = np.array(d['f0'])
        cls = [int(c) for c in d['cls']]
        words = d['words']
        if k in MANUAL:
            w = words[0]
            for s, (a, v, e) in zip(w['syl'], MANUAL[k]):
                s['s'], s['v'], s['e'] = a, [v, e], e
            w['s'], w['e'] = MANUAL[k][0][0], MANUAL[k][-1][2]
        if k in MANUAL_S:
            for w, sy in zip(words, MANUAL_S[k]):
                for s, (a, v, e) in zip(w['syl'], sy):
                    s['s'], s['v'], s['e'] = a, [v, e], e
                w['s'], w['e'] = sy[0][0], sy[-1][2]
        # strong vowel core per syllable: voiced & band >= local max - 6 dB
        for w in words:
            for s in w['syl']:
                a, b = int(s['s'] / STEP), max(int(s['s'] / STEP) + 1, int(s['e'] / STEP))
                seg = band[a:b]
                if len(seg) == 0: s['core'] = [s['s'], s['e']]; continue
                th = seg.max() - 6
                m = [(band[j] >= th and f0[j] > 0) for j in range(a, b)]
                rr = runs(m, 2, 2)
                if rr:
                    r = max(rr, key=lambda r: r[1] - r[0])
                    s['core'] = [round((a + r[0]) * STEP, 3), round((a + r[1]) * STEP, 3)]
                else:
                    s['core'] = [s['v'][0], s['v'][1]]
        # breaks for the contour: pauses between groups
        breaks = []
        for i in range(len(words) - 1):
            if words[i].get('gap'):
                breaks.append((words[i]['e'] + words[i + 1]['s']) / 2)
        contour, med = smooth_contour(f0, breaks)
        # air / voice spans
        air = [[round(a * STEP, 3), round(b * STEP, 3)] for a, b in runs([c == 1 for c in cls], 2, 1)]
        voi = [[round(a * STEP, 3), round(b * STEP, 3)] for a, b in runs([c == 2 for c in cls], 3, 2)]
        # aspiration: air immediately before the first long voiced run
        asp = None
        if voi:
            v0 = voi[0][0] if (voi[0][1] - voi[0][0]) > 0.06 else (voi[1][0] if len(voi) > 1 else voi[0][0])
            before = [a for a in air if a[1] <= v0 + 0.015 and a[1] >= v0 - 0.03]
            if before:
                asp = [before[-1][0], round(v0, 3)]
        if k in ASP: asp = list(ASP[k])
        out = dict(dur=d['dur'], on=d['on'], off=d['off'], gain=d['gain'], med=med,
                   pitch=contour, env=d['env'], air=air, voice=voi, asp=asp,
                   words=[])
        if k in VOWEL: out['vowel'] = list(VOWEL[k])
        for w in words:
            ww = dict(w=w['w'], s=round(w['s'], 3), e=round(w['e'], 3))
            for key in ('tonic', 'group', 'gap'):
                if key in w: ww[key] = w[key]
            ww['syl'] = [dict(t=s['t'], lv=s['lv'], s=round(s['s'], 3), e=round(s['e'], 3),
                              v=round(s['v'][0], 3), core=s['core']) for s in w['syl']]
            out['words'].append(ww)
        res[k] = out
    return res


if __name__ == '__main__':
    r = finalize()
    if '--merge' in sys.argv:
        # add / replace only the clips analysed this run; keep the rest of the app's data
        app = json.load(open(APP))
        app.update(r)
        r = dict(sorted(app.items()))
        js = json.dumps(r, separators=(',', ':'))
        open(APP, 'w').write(js)
    else:
        js = json.dumps(r, separators=(',', ':'))
        open(f'{WORK}/ana/out/clips.json', 'w').write(js)
    print(len(js), 'bytes')
    if '--merge' in sys.argv: sys.exit(0)
    for k in ['vow-team', 'vow-tim', 'vow-fool', 'vow-full', 'vow-beat', 'vow-bit', 'vow-pool', 'vow-pull',
              'asp-pin', 'asp-spin', 'asp-top', 'asp-stop', 'asp-key', 'asp-ski', 'clu-school', 'clu-eekul']:
        c = r[k]
        print(k, 'core', [s['core'] for w in c['words'] for s in w['syl']], 'asp', c['asp'], 'air', c['air'][:3])
