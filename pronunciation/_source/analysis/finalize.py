"""Turn analysis.json into the compact clip data the app ships with.

Adds hand-checked syllable timings for multi-syllable words (read off
spectrograms), a smoothed semitone pitch contour, the strong vowel core,
air/voice spans and the aspiration (VOT) measure.
"""
import importlib, json, os, sys, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from voice import VOICE, DEFAULT, app_json

WORK = os.environ.get('VOICELAB_WORK', '/home/claude')
A = json.load(open(f'{WORK}/ana/out/analysis.json'))
APP = app_json()
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
 # accent words (pocketsphinx alignment, align_ps.py)
 'acc-water': [(0.040, 0.190, 0.365), (0.365, 0.500, 0.720)],
 'acc-schedule': [(0.040, 0.180, 0.285), (0.285, 0.360, 0.550)],   # re-recorded Nov 2026: British SHED-yool
 'acc-vitamin': [(0.050, 0.200, 0.265), (0.265, 0.380, 0.465), (0.465, 0.465, 0.770)],
 'acc-tomato': [(0.040, 0.080, 0.190), (0.190, 0.260, 0.435), (0.435, 0.550, 0.830)],   # re-recorded Nov 2026: British to-MAH-to
 # November 2026 (ElevenLabs): align_ps.py, checked on spectrograms
 'dec-photographer': [(0.030, 0.120, 0.185), (0.185, 0.270, 0.365), (0.365, 0.420, 0.505), (0.505, 0.590, 0.630)],
 'dec-education': [(0.010, 0.040, 0.205), (0.205, 0.240, 0.305), (0.305, 0.430, 0.545), (0.545, 0.650, 0.860)],
 'dec-conversation': [(0.030, 0.110, 0.225), (0.225, 0.260, 0.305), (0.305, 0.390, 0.525), (0.525, 0.620, 0.830)],
 'dec-discussion': [(0.040, 0.090, 0.145), (0.145, 0.310, 0.425), (0.425, 0.540, 0.800)],
 'dec-permission': [(0.040, 0.110, 0.145), (0.145, 0.145, 0.285), (0.285, 0.410, 0.640)],
 'dec-economic': [(0.020, 0.050, 0.135), (0.135, 0.220, 0.265), (0.265, 0.265, 0.415), (0.415, 0.420, 0.740)],
 'dec-scientific': [(0.000, 0.120, 0.265), (0.265, 0.265, 0.325), (0.325, 0.410, 0.465), (0.465, 0.530, 0.870)],
 'dec-university': [(0.000, 0.090, 0.165), (0.165, 0.165, 0.285), (0.285, 0.350, 0.505), (0.505, 0.600, 0.665), (0.665, 0.750, 0.980)],
 'dec-electricity': [(0.030, 0.060, 0.115), (0.115, 0.115, 0.325), (0.325, 0.430, 0.485), (0.485, 0.570, 0.635), (0.635, 0.720, 0.980)],
 'dec-enormous': [(0.010, 0.030, 0.105), (0.105, 0.240, 0.385), (0.385, 0.385, 0.730)],
 'dec-delicious': [(0.040, 0.090, 0.165), (0.165, 0.270, 0.365), (0.365, 0.470, 0.810)],
 'vow-banana': [(0.030, 0.050, 0.130), (0.130, 0.170, 0.400), (0.400, 0.430, 0.620)],
 'vow-today': [(0.040, 0.110, 0.155), (0.155, 0.190, 0.470)],
 'vow-problem': [(0.040, 0.120, 0.175), (0.175, 0.250, 0.630)],
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
 # November 2026 linking phrases (ElevenLabs): align_ps.py, corrected on spectrograms
 'lnk-an-hour': [[(0.020, 0.050, 0.245)], [(0.245, 0.245, 0.460)]],
 'lnk-do-it': [[(0.030, 0.060, 0.185)], [(0.185, 0.190, 0.490)]],
 'lnk-i-am': [[(0.000, 0.020, 0.135)], [(0.135, 0.135, 0.500)]],
 'lnk-see-it': [[(0.000, 0.130, 0.285)], [(0.285, 0.285, 0.550)]],
 'lnk-far-away': [[(0.010, 0.100, 0.275)], [(0.275, 0.275, 0.345), (0.345, 0.390, 0.690)]],
 'lnk-where-is-it': [[(0.040, 0.110, 0.255)], [(0.255, 0.255, 0.395)], [(0.395, 0.410, 0.780)]],
 'lnk-more-and-more': [[(0.010, 0.090, 0.345)], [(0.345, 0.345, 0.465)], [(0.465, 0.530, 0.830)]],
 'lnk-bus-stop': [[(0.030, 0.060, 0.285)], [(0.285, 0.370, 0.660)]],
 'lnk-black-coffee': [[(0.030, 0.070, 0.295)], [(0.295, 0.390, 0.465), (0.465, 0.560, 0.750)]],
 'lnk-some-more': [[(0.000, 0.110, 0.215)], [(0.215, 0.270, 0.550)]],
 'lnk-come-on-in': [[(0.020, 0.080, 0.245)], [(0.245, 0.260, 0.425)], [(0.425, 0.430, 0.770)]],
 'lnk-hold-on': [[(0.010, 0.070, 0.215)], [(0.215, 0.240, 0.370)], [(0.370, 0.375, 0.415)], [(0.415, 0.460, 0.545), (0.545, 0.560, 0.840)]],
 'lnk-take-a-seat': [[(0.040, 0.080, 0.245)], [(0.245, 0.280, 0.325)], [(0.325, 0.450, 0.850)]],
 'lnk-come-in-sit-down': [[(0.040, 0.130, 0.255)], [(0.255, 0.270, 0.435)], [(0.435, 0.435, 0.585)], [(0.585, 0.680, 0.785)], [(0.785, 0.890, 1.290)]],
 'lnk-look-out': [[(0.040, 0.090, 0.205)], [(0.205, 0.230, 0.750)]],
 'lnk-who-is-it': [[(0.040, 0.100, 0.235)], [(0.235, 0.235, 0.345)], [(0.345, 0.380, 0.750)]],
 'lnk-go-away': [[(0.020, 0.060, 0.225)], [(0.225, 0.225, 0.255), (0.255, 0.280, 0.580)]],
 'lnk-stop-it-now': [[(0.000, 0.160, 0.275)], [(0.275, 0.320, 0.405)], [(0.405, 0.450, 0.690)]],
 'num-year1994': [[(.07, .10, .35), (.35, .40, .66)], [(.66, .68, .87), (.87, .92, 1.0)], [(1.0, 1.13, 1.48)]],
 'num-year2026': [[(.04, .12, .33), (.33, .36, .53)], [(.53, .60, .77), (.77, .79, .93)], [(.93, 1.03, 1.55)]],
 'num-price-14000': [[(.03, .12, .35), (.35, .41, .65)], [(.65, .72, .93), (.93, .97, 1.17)], [(1.19, 1.25, 1.40), (1.40, 1.42, 1.65)]],
 'num-date-oct12': [[(.05, .06, .20), (.20, .27, .47), (.47, .49, .65)], [(.65, .79, 1.30)]],
 'num-time-530': [[(.06, .14, .42)], [(.42, .50, .72), (.72, .80, 1.02)]],
 # November 2026 (ElevenLabs): align_ps.py, checked on spectrograms
 'pro-john': [[(0.020, 0.040, 0.125)], [(0.125, 0.160, 0.295)], [(0.295, 0.350, 0.515)], [(0.515, 0.600, 0.920)]],
 'pro-teacher-said': [[(0.040, 0.070, 0.135)], [(0.135, 0.220, 0.325), (0.325, 0.410, 0.475)], [(0.475, 0.570, 0.725)], [(0.725, 0.770, 0.825)], [(0.825, 1.000, 1.105), (1.105, 1.140, 1.285)], [(1.285, 1.300, 1.445)], [(1.445, 1.480, 1.735), (1.735, 1.810, 2.000)]],
 'nv-record-n': [[(0.010, 0.040, 0.185)], [(0.185, 0.220, 0.285), (0.285, 0.440, 0.770)]],
 'nv-record-v': [[(0.030, 0.120, 0.175)], [(0.175, 0.190, 0.265), (0.265, 0.410, 0.770)]],
 'nv-present-n': [[(0.020, 0.050, 0.125)], [(0.125, 0.230, 0.325), (0.325, 0.390, 0.690)]],
 'nv-present-v': [[(0.040, 0.100, 0.155)], [(0.155, 0.210, 0.285), (0.285, 0.380, 0.800)]],
 'nv-object-n': [[(0.030, 0.060, 0.135)], [(0.135, 0.135, 0.295), (0.295, 0.390, 0.860)]],
 'nv-object-v': [[(0.040, 0.130, 0.185)], [(0.185, 0.185, 0.325), (0.325, 0.430, 0.940)]],
 'nv-increase-n': [[(0.030, 0.050, 0.125)], [(0.125, 0.130, 0.305), (0.305, 0.420, 0.790)]],
 'nv-increase-v': [[(0.030, 0.130, 0.245)], [(0.245, 0.245, 0.365), (0.365, 0.460, 0.890)]],
 # thought groups with the pauses written in (<break>), November 2026
 'pro-sent5': [[(0.030, 0.060, 0.145)], [(0.145, 0.170, 0.265)], [(0.265, 0.340, 0.675)], [(0.675, 0.730, 0.775), (0.775, 0.820, 0.925), (0.925, 0.970, 1.100)], [(1.580, 1.630, 1.735)], [(1.735, 1.890, 1.985)], [(1.985, 1.985, 2.065)], [(2.065, 2.180, 2.520)]],
 'pro-sent6': [[(0.040, 0.070, 0.155)], [(0.155, 0.230, 0.395)], [(0.395, 0.470, 0.930)], [(1.290, 1.300, 1.680)], [(2.070, 2.090, 2.235), (2.235, 2.235, 2.610)], [(2.980, 3.020, 3.225)], [(3.225, 3.370, 3.680)]],
 'pro-sent7': [[(0.030, 0.070, 0.215)], [(0.215, 0.215, 0.335)], [(0.335, 0.335, 0.425), (0.425, 0.430, 0.665)], [(0.665, 0.690, 0.765)], [(0.765, 0.800, 0.855)], [(0.855, 0.990, 1.135), (1.135, 1.240, 1.380)], [(1.850, 1.900, 1.945)], [(1.945, 2.070, 2.295)], [(2.295, 2.310, 2.445)], [(2.445, 2.470, 2.645), (2.645, 2.680, 2.785), (2.785, 2.830, 2.915)], [(2.915, 2.980, 3.400)]],
 'pro-sent8': [[(0.040, 0.080, 0.175)], [(0.175, 0.260, 0.335), (0.335, 0.470, 0.630)], [(1.070, 1.070, 1.195)], [(1.195, 1.250, 1.425)], [(1.425, 1.440, 1.575)], [(1.575, 1.630, 1.775), (1.775, 1.880, 2.030)], [(2.450, 2.480, 2.575)], [(2.575, 2.590, 2.655)], [(2.655, 2.730, 2.945), (2.945, 3.010, 3.160)]],
 'pro-john-comma': [[(0.040, 0.070, 0.145)], [(0.145, 0.200, 0.355)], [(0.355, 0.400, 0.520)], [(1.170, 1.240, 1.550)]],
 'pro-teacher-comma': [[(0.050, 0.080, 0.135)], [(0.135, 0.230, 0.365), (0.365, 0.460, 0.600)], [(1.050, 1.140, 1.255)], [(1.255, 1.300, 1.345)], [(1.345, 1.490, 1.605), (1.605, 1.640, 1.890)], [(2.250, 2.290, 2.465)], [(2.465, 2.600, 2.805), (2.805, 2.890, 3.170)]],
 # compounds cut from primer sentences (November 2026): align_ps.py, checked on spectrograms
 'cmp-blackboard-n': [[(0.040, 0.060, 0.255), (0.255, 0.370, 0.680)]],
 'cmp-black-board-p': [[(0.030, 0.060, 0.235)], [(0.235, 0.360, 0.840)]],
 'cmp-greenhouse-n': [[(0.020, 0.080, 0.255), (0.255, 0.350, 0.700)]],
 'cmp-green-house-p': [[(0.000, 0.090, 0.355)], [(0.355, 0.450, 0.870)]],
 'cmp-hotdog-n': [[(0.000, 0.020, 0.305), (0.305, 0.350, 0.710)]],
 'cmp-hot-dog-p': [[(0.000, 0.030, 0.305)], [(0.305, 0.380, 0.870)]],   # from "…not a hot cat. It was a hot dog."
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


# The tables above were read off Alice's recordings. Other voices keep their own in
# manual_<voice>.py (same four names).
if VOICE != DEFAULT:
    _m = importlib.import_module(f'manual_{VOICE}')
    MANUAL, MANUAL_S, VOWEL, ASP = _m.MANUAL, _m.MANUAL_S, _m.VOWEL, _m.ASP


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
        app = json.load(open(APP)) if os.path.exists(APP) else {}
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
