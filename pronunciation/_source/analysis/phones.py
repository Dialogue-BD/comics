"""Add phone timings (`ph`) to the single-word clips, for the 3D mouth.

The mouth moves from sound to sound, so it needs to know when each sound starts and
ends. Phones come from the same MBROLA alignment as the syllables; the vowel and the
aspiration spans are then snapped to the hand-checked values in finalize.py.

    VOICELAB_WORK=/path/to/work python3 phones.py vow- con- asp- th- clu-
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from analyse import analyse_clip, STEP
from spec import WORDS, SAY
from finalize import VOWEL, ASP
from voice import app_json
import phon

APP = app_json()


def phones_for(k):
    text, _ = WORDS[k]
    c = analyse_clip(k)
    on, off = c['on'] * STEP, c['off'] * STEP
    say = SAY.get(k, text.replace('·', ''))
    phs = phon.align(c['x'], c['sr'], [say], [False], on=max(0, on - 0.02), off=min(c['dur'], off + 0.02))
    out = [[phon.base(p), round(a, 3), round(b, 3)] for p, a, b, _ in phs]
    # snap the main vowel to the measured span, neighbours follow
    if k in VOWEL:
        va, vb = VOWEL[k]
        vi = [i for i, p in enumerate(out) if phon.is_vowel(p[0])]
        if vi:
            i = max(vi, key=lambda j: out[j][2] - out[j][1])
            out[i][1], out[i][2] = va, vb
            if i > 0: out[i - 1][2] = va
            if i < len(out) - 1: out[i + 1][1] = vb
    if k in ASP:
        a, b = ASP[k]
        # the stop before the release ends at the burst; its vowel starts at voicing
        for i, p in enumerate(out):
            if p[0] in ('p', 't', 'k') and abs(p[2] - b) < 0.12:
                p[2] = a
                if i < len(out) - 1: out[i + 1][1] = a
                break
    for i in range(len(out)):
        if out[i][2] < out[i][1]: out[i][2] = out[i][1]
    return out


if __name__ == '__main__':
    pref = sys.argv[1:] or ['vow-', 'con-', 'asp-', 'th-', 'clu-', 'acc-']
    app = json.load(open(APP))
    for k in WORDS:
        if any(k.startswith(p) for p in pref) and k in app:
            app[k]['ph'] = phones_for(k)
            print(k, ' '.join(f'{p}{a:.2f}-{b:.2f}' for p, a, b in app[k]['ph']))
    open(APP, 'w').write(json.dumps(dict(sorted(app.items())), separators=(',', ':')))
