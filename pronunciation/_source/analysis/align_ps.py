"""Syllable timings by forced alignment (pocketsphinx, US English acoustic model).

The espeak/MBROLA DTW in analyse.py is good enough for single words, but in connected
speech it drifts, which is why Alice's sentences and phrases were checked by hand
(MANUAL / MANUAL_S in finalize.py). For a new voice, a real acoustic model does most of
that work: pocketsphinx aligns the known words to the recording, phone by phone; the
phones are grouped into the spec's syllables, and each vowel onset is settled on the
recording's own rise of voiced energy.

    pip install pocketsphinx
    VOICELAB_VOICE=brian VOICELAB_WORK=/path/to/work python3 align_ps.py > manual_brian_aligned.py

writes MANUAL (multi-syllable single words) and MANUAL_S (multi-word clips) in the
format finalize.py reads.
"""
import os, sys
import numpy as np, librosa

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from spec import WORDS, SENTENCES, SAY
from voice import audio_dir
from analyse import analyse_clip, parse_sentence, refine, refine_vowel, STEP

VOWELS = {'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'}
ONSETS = {('S', 'P'), ('S', 'T'), ('S', 'K'), ('P', 'R'), ('P', 'L'), ('B', 'R'), ('B', 'L'), ('T', 'R'),
          ('D', 'R'), ('K', 'R'), ('K', 'L'), ('G', 'R'), ('G', 'L'), ('F', 'R'), ('F', 'L'), ('TH', 'R'),
          ('S', 'L'), ('S', 'M'), ('S', 'N'), ('S', 'W'), ('T', 'W'), ('K', 'W'), ('HH', 'Y'), ('K', 'Y')}
# Words the pocketsphinx dictionary does not know.
EXTRA = {'taka': 'T AA K AH', 'eeskool': 'IY S K UW L', 'sitreet': 'S IH T R IY T', 'iskul': 'IH S K UW L',
         'ihskool': 'IH S K UW L', 'sihtreet': 'S IH T R IY T', 'hotdog': 'HH AA T D AO G',
         'greenhouse': 'G R IY N HH AW S', 'blackboard': 'B L AE K B AO R D',
         'watar': 'W AO T AA R', 'eschool': 'EH S K UW L'}


VOWEL_KEYS = ['vow-team', 'vow-tim', 'vow-beat', 'vow-bit', 'vow-fool', 'vow-full', 'vow-pool', 'vow-pull',
              'vow-sheep', 'vow-ship', 'con-safe', 'con-save', 'con-price', 'con-prize', 'con-herd', 'con-hard',
              'con-earth', 'con-earn']


def ps_align(path, words):
    from pocketsphinx import Decoder
    y, _ = librosa.load(path, sr=16000)
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()
    d = Decoder(samprate=16000, bestpath=False, loglevel='FATAL')
    for w, pr in EXTRA.items():
        if d.lookup_word(w) is None: d.add_word(w, pr, False)
    d.set_align_text(' '.join(words))
    d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()      # pass 1: words
    segs = [(sg.word, sg.start_frame / 100, (sg.end_frame + 1) / 100) for sg in d.seg()]
    segs = [g for g in segs if not g[0].startswith('<') and not g[0].startswith('[')]
    try:
        d.set_alignment()                                               # pass 2: phones
        d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
        out = []
        for w in d.get_alignment():
            if w.name.startswith('<') or w.name.startswith('['): continue
            out.append([(p.name, p.start / 100, (p.start + p.duration) / 100) for p in w])
        return out
    except RuntimeError:
        # long strings of digits can defeat the phone pass: keep the word spans and mark
        # them with a single pseudo-phone; timings() splits them using MBROLA DTW
        return [[('WORD', a, b)] for _, a, b in segs]


def syllabify(phs, n):
    nuc = [i for i, p in enumerate(phs) if p[0] in VOWELS]
    if not nuc: return [phs]
    cuts = [0]
    for a, b in zip(nuc[:-1], nuc[1:]):
        cons = list(range(a + 1, b))
        if not cons: cut = b
        elif len(cons) == 1: cut = cons[0]
        else: cut = cons[-2] if (phs[cons[-2]][0], phs[cons[-1]][0]) in ONSETS else cons[-1]
        cuts.append(cut)
    cuts.append(len(phs))
    syl = [phs[cuts[i]:cuts[i + 1]] for i in range(len(cuts) - 1)]
    while len(syl) > n:                       # the spec decides how many syllables a word has
        j = min(range(len(syl) - 1), key=lambda i: len(syl[i]) + len(syl[i + 1]))
        syl[j] = syl[j] + syl.pop(j + 1)
    while len(syl) < n:
        j = max(range(len(syl)), key=lambda i: len(syl[i]))
        s = syl[j]
        if len(s) < 2: break
        h = len(s) // 2; syl[j:j + 1] = [s[:h], s[h:]]
    return syl


def timings(k, words, nsyl):
    """[[(start, vowel onset, end) per syllable] per word]."""
    c = analyse_clip(k)
    on = c['on'] * STEP
    al = ps_align(f'{audio_dir()}/{k}.mp3', words)
    if len(al) != len(words): raise RuntimeError(f'{k}: aligned {len(al)} of {len(words)} words')
    out = []
    for wi, (phs, n) in enumerate(zip(al, nsyl)):
        if phs[0][0] == 'WORD':
            import phon
            a, b = phs[0][1], phs[0][2]
            ph = phon.align(c['x'], c['sr'], [words[wi]], [False], on=a, off=b)
            groups = phon.syllabify(ph, n)
            row = []
            for g in groups:
                vi = [ph[j] for j in g if phon.is_vowel(ph[j][0])]
                row.append([ph[g[0]][1], vi[0][1] if vi else ph[g[0]][1], ph[g[-1]][2]])
            row[0][0] = a; row[-1][2] = b
            out.append(row); continue
        row = []
        for sy in syllabify(phs, n):
            a, e = sy[0][1], sy[-1][2]
            vi = [p for p in sy if p[0] in VOWELS]
            v = vi[0][1] if vi else a
            row.append([a, v, e])
        out.append(row)
    flat = [s for w in out for s in w]
    flat[0][0] = max(flat[0][0], on - 0.01)
    for i, s in enumerate(flat):
        if i > 0 and abs(s[0] - flat[i - 1][2]) < 0.015:     # joined: settle on the quietest frame
            t = refine(c, s[0], 0.025); s[0] = t; flat[i - 1][2] = t
        s[1] = refine_vowel(c, max(s[0], s[1] - 0.03), max(s[2], s[1] + 0.08), s[0])
        s[1] = min(max(s[1], s[0]), s[2] - 0.02)
    return [[tuple(round(x, 3) for x in s) for s in w] for w in out]


def fmt(rows):
    return '[' + ', '.join('[' + ', '.join('(%.3f, %.3f, %.3f)' % s for s in w) + ']' for w in rows) + ']'


if __name__ == '__main__':
    only = sys.argv[1:]
    want = lambda k: (not only or any(k.startswith(p) for p in only)) and os.path.exists(f'{audio_dir()}/{k}.mp3')
    print('# Generated by align_ps.py (pocketsphinx forced alignment), then checked on spectrograms.')
    print('MANUAL = {')
    for k, (text, lv) in WORDS.items():
        if not want(k) or len(lv) < 2: continue
        say = SAY.get(k, text.replace('·', '')).lower().replace(' ', '')
        try: r = timings(k, [say], [len(lv)])
        except Exception as e: print(f' # {k}: {e}'); continue
        print(f" '{k}': {fmt(r)[1:-1]},")
    print('}')
    # vowel spans for the long / short and voiced / voiceless pairs
    print('VOWEL = {')
    for k in VOWEL_KEYS:
        if not want(k): continue
        text, _ = WORDS[k]
        c = analyse_clip(k)
        al = ps_align(f'{audio_dir()}/{k}.mp3', [SAY.get(k, text).lower()])
        vs = [p for w in al for p in w if p[0] in VOWELS]
        if not vs: continue
        a, b = vs[0][1], vs[-1][2]
        a = refine_vowel(c, max(0, a - 0.03), b, max(0, a - 0.05))
        print(f" '{k}': ({a:.3f}, {b:.3f}),")
    print('}')
    print('MANUAL_S = {')
    for k, spec in SENTENCES.items():
        if not want(k): continue
        ws = parse_sentence(spec)
        try: r = timings(k, [w['w'].lower() for w in ws], [len(w['syl']) for w in ws])
        except Exception as e: print(f' # {k}: {e}'); continue
        print(f" '{k}': {fmt(r)},")
    print('}')
