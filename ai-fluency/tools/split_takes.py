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
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, 'audio')
NOISE, MIN_GAP = '-38dB', 0.45          # what counts as silence between lines


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


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src = os.path.expanduser(sys.argv[1]); force = '--force' in sys.argv
    takes = json.load(open(os.path.join(AUD, 'takes.json')))
    lines = {l['key']: l for l in json.load(open(os.path.join(AUD, 'lines.json')))}
    done, skipped, flagged = 0, [], []
    for tid, keys in takes.items():
        f = next((os.path.join(src, tid + e) for e in ('.wav', '.mp3', '.m4a') if os.path.exists(os.path.join(src, tid + e))), None)
        if not f:
            continue
        if not force and all(os.path.exists(os.path.join(AUD, k + '.mp3')) for k in keys):
            continue
        total = duration(f)
        # inner silences only: not the lead-in or the tail
        gaps = [(a, b) for a, b in silences(f) if a > 0.15 and b < total - 0.15]
        need = len(keys) - 1
        if len(gaps) < need:
            skipped.append(f'{tid}: {len(keys)} lines but only {len(gaps)} pauses found — record again with <long pause> between lines')
            continue
        cuts = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[:need])
        bounds = [0.0] + [(a + b) / 2 for a, b in cuts] + [total]
        for i, k in enumerate(keys):
            a, b = bounds[i], bounds[i + 1]
            out = os.path.join(AUD, k + '.mp3')
            trim = (f'silenceremove=start_periods=1:start_threshold={NOISE},areverse,'
                    f'silenceremove=start_periods=1:start_threshold={NOISE},areverse,'
                    'adelay=80|80,apad=pad_dur=0.12')
            r = ff(['-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', f, '-af', trim,
                    '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '96k', out])
            if r.returncode:
                skipped.append(f'{tid}: ffmpeg failed on line {i + 1}'); break
            got = duration(out); words = len(lines[k]['text'].split())
            want = words / 2.3                       # a slow, clear read: ~2.3 words a second
            if got < want * 0.45 or got > want * 2.4 + 1.5:
                flagged.append(f'{tid} line {i + 1} ({got:.1f}s for {words} words): "{lines[k]["text"][:60]}"')
        else:
            done += 1
            print(f'✓ {tid}: {len(keys)} lines')
    have = sorted(k for k in lines if os.path.exists(os.path.join(AUD, k + '.mp3')))
    json.dump({'keys': have}, open(os.path.join(AUD, 'manifest.json'), 'w'))
    print(f'\n{done} takes cut · {len(have)} of {len(lines)} lines recorded · audio/manifest.json updated')
    for s in skipped:
        print('SKIPPED ', s)
    for s in flagged:
        print('LISTEN  ', s)


if __name__ == '__main__':
    main()
