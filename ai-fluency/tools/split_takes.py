#!/usr/bin/env python3
"""Cut AI Studio takes into one mp3 per line for the AI Fluency Lab.

    cd ai-fluency && python3 tools/split_takes.py ~/Downloads [--force]

For every take in audio/takes.json it looks in the folder for <take>.wav
(or .mp3 / .m4a), finds the silences that <long pause> made between lines,
cuts the take there, trims each piece and writes audio/<key>.mp3. Then it
rewrites audio/manifest.json, which is how the page knows a recording exists.

Needs ffmpeg (brew install ffmpeg). Standard library only otherwise.

A take is skipped, not guessed at, when it has fewer clear pauses than it
needs: re-record it. A take is cut at its N-1 longest pauses, so a pause
inside a sentence never splits it as long as the gaps between lines are the
longest silences in the file. Lines whose length is far from what the words
predict are reported, so a misplaced cut is easy to spot by ear.

When the pauses are close, it tries the cuts whose line lengths best fit the
words, and only uses them if one answer is clearly best. A take that still
won't cut can be recorded a line at a time as <take>_L1.wav, <take>_L2.wav ...
"""
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, 'audio')
NOISE, MIN_GAP = '-38dB', 0.45          # what counts as silence
LINE_GAP = 1.5                          # <long pause> <long pause> between lines is usually 2-7 s


def ff(args):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostdin'] + args, capture_output=True, text=True)


def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def silences(path):
    log = ff(['-i', path, '-af', f'silencedetect=noise={NOISE}:d={MIN_GAP}', '-f', 'null', '-']).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    return list(zip(starts, ends))


def expect(text):
    """rough spoken length in 'word units': a gap ___ is read as a pause worth about two words"""
    blanks = text.count('___')
    words = len(text.replace('___', ' ').split())
    return max(1.0, words + 2.0 * blanks)


def by_timing(keys, lines, gaps, lead, tail):
    """When the pauses between lines are not clearly the longest, pick the set of cuts whose
    line lengths best match the words in each line. Only long-ish pauses can be cuts, and the
    best set must beat the next best clearly; otherwise give up (record again)."""
    from itertools import combinations
    from math import log
    need = len(keys) - 1
    cand = sorted(g for g in gaps if g[1] - g[0] >= 0.9)
    if len(cand) < need or len(cand) > 14:
        return None
    w = [expect(lines[k]['text']) for k in keys]
    scored = []
    for combo in combinations(cand, need):
        starts = [lead] + [b for a, b in combo]
        ends = [a for a, b in combo] + [tail]
        spans = [e - s0 for s0, e in zip(starts, ends)]
        if min(spans) <= 0.3:
            continue
        pace = sum(spans) / sum(w)
        err = sum(log(sp / (x * pace)) ** 2 for sp, x in zip(spans, w))
        worst = max(abs(log(sp / (x * pace))) for sp, x in zip(spans, w))
        scored.append((err, worst, list(combo)))
    if not scored:
        return None
    scored.sort(key=lambda t: t[0])
    best = scored[0]
    second = scored[1][0] if len(scored) > 1 else 99
    # every line within about x1.7 of its words, and the runner-up clearly worse
    if best[1] > 0.55 or second < best[0] * 2.5 + 0.05:
        return None
    return best[2]


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src = os.path.expanduser(sys.argv[1]); force = '--force' in sys.argv
    takes = json.load(open(os.path.join(AUD, 'takes.json')))
    lines = {l['key']: l for l in json.load(open(os.path.join(AUD, 'lines.json')))}
    done, skipped, flagged = 0, [], []
    recut = set()
    # a take that will not cut cleanly can be recorded one line at a time: <take>_L<n>.wav
    for tid, keys in list(takes.items()):
        for i, k in enumerate(keys):
            if any(os.path.exists(os.path.join(src, f'{tid}_L{i + 1}{e}')) for e in ('.wav', '.mp3', '.m4a')):
                takes[f'{tid}_L{i + 1}'] = [k]
    for tid, keys in takes.items():
        f = next((os.path.join(src, tid + e) for e in ('.wav', '.mp3', '.m4a') if os.path.exists(os.path.join(src, tid + e))), None)
        if not f:
            continue
        if not force and all(os.path.exists(os.path.join(AUD, k + '.mp3')) for k in keys):
            continue
        total = duration(f)
        sil = silences(f)
        lead = next((b for a, b in sil if a <= 0.15), 0.0)                 # silence at the very start
        tail = next((a for a, b in sil if b >= total - 0.15), total)       # silence at the very end
        # inner silences only: not the lead-in or the tail
        gaps = [(a, b) for a, b in sil if a > 0.15 and b < total - 0.15]
        need = len(keys) - 1
        by_len = sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)
        if len(gaps) < need:
            skipped.append(f'{tid}: {len(keys)} lines but only {len(gaps)} pauses found — record again')
            continue
        if need:
            weakest = by_len[need - 1][1] - by_len[need - 1][0]
            nextgap = (by_len[need][1] - by_len[need][0]) if len(by_len) > need else 0
            # the pauses between lines must be clearly longer than any pause inside a line;
            # otherwise a line was probably dropped or merged, and guessing would mislabel clips
            if weakest < LINE_GAP or (nextgap and weakest < nextgap * 1.6):
                fit = by_timing(keys, lines, gaps, lead, tail)
                if not fit:
                    skipped.append(f'{tid}: pauses are ambiguous ({weakest:.2f}s between lines vs {nextgap:.2f}s inside) — a line was probably dropped; record again')
                    continue
                by_len = fit + [g for g in by_len if g not in fit]
                flagged.append(f'{tid}: cut by word timing, not pause length — listen once')
        elif '_L' not in tid and by_len and by_len[0][1] - by_len[0][0] >= LINE_GAP:
            skipped.append(f'{tid}: one line expected but there is a long pause inside it — record again')
            continue
        cuts = sorted(by_len[:need])
        # each line runs from the end of the pause before it to the start of the pause after it
        starts = [lead] + [b for a, b in cuts]
        ends = [a for a, b in cuts] + [tail]
        # second check: each piece must be about as long as its words, at this take's own pace.
        # A pause inside a sentence that is longer than a pause between lines shows up here.
        words = [max(1, len(lines[k]['text'].split())) for k in keys]
        spans = [e - s0 for s0, e in zip(starts, ends)]
        pace = sum(spans) / sum(words)
        bad = [i + 1 for i, (sp, w) in enumerate(zip(spans, words)) if not (0.5 * w * pace - 0.4 <= sp <= 1.9 * w * pace + 0.6)]
        if bad:
            skipped.append(f'{tid}: line {",".join(map(str, bad))} is the wrong length for its words — the cut is off; record again')
            # move any clips this take made earlier aside (audio/_rejected is not published)
            rej = os.path.join(AUD, '_rejected'); os.makedirs(rej, exist_ok=True)
            for k in keys:
                p_ = os.path.join(AUD, k + '.mp3')
                if os.path.exists(p_): shutil.move(p_, os.path.join(rej, k + '.mp3'))
            continue
        for i, k in enumerate(keys):
            a, b = max(0.0, starts[i] - 0.12), min(total, ends[i] + 0.2)
            out = os.path.join(AUD, k + '.mp3')
            # trim with a filter, not -ss: AI Studio's WAVs don't seek reliably
            r = ff(['-y', '-i', f,
                    '-af', f'atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,'
                           f'afade=t=in:d=0.03,afade=t=out:st={max(0.0, b - a - 0.06):.3f}:d=0.06',
                    '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '40k', out])  # speech: 40 kb/s mono is clear and ~20 KB a line
            if r.returncode:
                skipped.append(f'{tid}: ffmpeg failed on line {i + 1}'); break
            recut.add(k)
            got = duration(out); words = len(lines[k]['text'].split())
            want = words / 2.3                       # a slow, clear read: ~2.3 words a second
            if got < want * 0.45 or got > want * 2.4 + 1.5:
                flagged.append(f'{tid} line {i + 1} ({got:.1f}s for {words} words): "{lines[k]["text"][:60]}"')
        else:
            done += 1
            print(f'✓ {tid}: {len(keys)} lines')
    have = sorted(k for k in lines if os.path.exists(os.path.join(AUD, k + '.mp3')))
    # clip lengths, so the intro film can time itself to the recordings
    try: man = json.load(open(os.path.join(AUD, 'manifest.json'))); old = man.get('dur', {}); ver = man.get('v', '')
    except Exception: old = {}; ver = ''
    dur = {k: (old[k] if k in old and k not in recut else round(duration(os.path.join(AUD, k + '.mp3')), 2)) for k in have}
    json.dump({'keys': have, 'dur': dur, 'v': ver}, open(os.path.join(AUD, 'manifest.json'), 'w'))  # v: bump to make phones fetch new files
    print(f'\n{done} takes cut · {len(have)} of {len(lines)} lines recorded · audio/manifest.json updated')
    for s in skipped:
        print('SKIPPED ', s)
    for s in flagged:
        print('LISTEN  ', s)


if __name__ == '__main__':
    main()
