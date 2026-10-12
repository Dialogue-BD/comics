"""Make the "melody off" recordings: the same voice, words and timing, spoken in a monotone.

The first version flattened the pitch to one dead-straight note, which sounds like a
robot. A person talking in a flat, bored voice still has the small, quick wobbles of a
real throat (micro-prosody) and drifts slowly down through a sentence. So we keep those
and only squash the slow melody — the rises and falls that carry meaning:

    new pitch = median + gentle declination + KEEP * (slow melody) + quick wobble

where the slow melody is the pitch line smoothed over ~0.3 s and the quick wobble is
what is left over. Resynthesis is Praat's PSOLA, so the voice quality is unchanged.

    [VOICELAB_VOICE=brian] VOICELAB_WORK=/path/to/work python3 monotone.py
reads  ../../audio[/<voice>]/pro-sent1.mp3, pro-sent2.mp3
writes ../../audio[/<voice>]/pro-sent1-mono.mp3, pro-sent2-mono.mp3 and their pitch in the voice's clip data
"""
import json, os, subprocess, sys, tempfile
import numpy as np, parselmouth as pm
from parselmouth.praat import call

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from voice import audio_dir, app_json, F0_RANGE
AUDIO = audio_dir()
APP = app_json()
KEEP = 0.12          # how much of the slow melody survives (0 = robot, 1 = natural)
WOBBLE = 1.0         # how much of the quick micro-prosody survives
DECLINE = -1.6       # semitones of slow downward drift across the sentence
SLOW = 0.15          # seconds: Gaussian sigma that separates melody from wobble
PAIRS = {'pro-sent1': 'pro-sent1-mono', 'pro-sent2': 'pro-sent2-mono'}


def decode(mp3):
    fn = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ac', '1', fn], check=True)
    return fn


def monotone(src_wav, out_wav):
    s = pm.Sound(src_wav)
    man = call(s, 'To Manipulation', 0.01, F0_RANGE[0], F0_RANGE[1])
    pitch = s.to_pitch_ac(time_step=0.01, pitch_floor=F0_RANGE[0], pitch_ceiling=F0_RANGE[1], very_accurate=True)
    t = pitch.xs(); f = pitch.selected_array['frequency']
    v = f > 0
    med = float(np.median(f[v]))
    st = np.full(len(f), np.nan); st[v] = 12 * np.log2(f[v] / med)
    # slow melody: interpolate across unvoiced gaps, then a wide Gaussian
    filled = np.interp(np.arange(len(st)), np.where(v)[0], st[v])
    r = int(SLOW / 0.01 * 3)
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / (SLOW / 0.01)) ** 2); k /= k.sum()
    slow = np.convolve(np.pad(filled, r, mode='edge'), k, mode='same')[r:-r]
    quick = np.clip(st - slow, -1.2, 1.2)            # a real throat wobbles; it does not leap
    t0, t1 = t[v][0], t[v][-1]
    decl = DECLINE * (t - t0) / max(0.1, t1 - t0) - DECLINE / 2
    new = KEEP * slow + WOBBLE * quick + decl
    tier = call(man, 'Extract pitch tier')
    call(tier, 'Remove points between', 0, s.duration)
    for ti, ok, y in zip(t, v, new):
        if ok: call(tier, 'Add point', float(ti), float(med * 2 ** (y / 12)))
    call([tier, man], 'Replace pitch tier')
    out = call(man, 'Get resynthesis (overlap-add)')
    out.save(out_wav, 'WAV')
    return med


def contour(wav_path, breaks):
    """Pitch line for the app, measured exactly as the other clips are."""
    sys.path.insert(0, HERE)
    from analyse import f0_track
    from finalize import smooth_contour, STEP
    s = pm.Sound(wav_path)
    n = int(np.ceil(s.duration / STEP))
    tf, f0 = f0_track(s)
    F = np.zeros(n)
    for i, tt in enumerate(tf):
        j = int(tt / STEP)
        if 0 <= j < n: F[j] = f0[i]
    return smooth_contour(F, breaks)


if __name__ == '__main__':
    app = json.load(open(APP))
    for src, dst in PAIRS.items():
        w = decode(os.path.join(AUDIO, src + '.mp3'))
        o = tempfile.mktemp(suffix='.wav')
        med = monotone(w, o)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', o, '-ac', '1', '-ar', '44100', '-b:a', '128k',
                        os.path.join(AUDIO, dst + '.mp3')], check=True)
        words = app[src]['words']
        breaks = [(a['e'] + b['s']) / 2 for a, b in zip(words[:-1], words[1:]) if a.get('gap')]
        pitch, m = contour(o, breaks)
        d = dict(app[src]); d['pitch'] = pitch; d['med'] = m
        app[dst] = d
        rng = [y for _, ys in pitch for y in ys]
        src_rng = [y for _, ys in app[src]['pitch'] for y in ys]
        print(dst, f'range {min(rng):.1f}..{max(rng):.1f} st (natural {min(src_rng):.1f}..{max(src_rng):.1f})')
    open(APP, 'w').write(json.dumps(dict(sorted(app.items())), separators=(',', ':')))
