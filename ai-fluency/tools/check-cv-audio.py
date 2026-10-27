#!/usr/bin/env python3
"""Audit first-challenge narration and listening controls; prepare browser takes.

Run voice-script.js first. This checks real files, not just manifest entries.
Generated feedback sheets are outside the static line collector's coverage.
"""
import argparse
import concurrent.futures
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
AUD = ROOT / 'audio'
OUT = ROOT / 'production' / 'cv-tts'


def belongs(line):
    for use in line.get('uses', [line]):
        lesson, where = use['lesson'], use['where']
        if lesson in ('common', 'cv', 'intro', 'introd', 'sheets'):
            return True
        if where.startswith(('#cv/', 'cv ·')):
            return True
        if lesson == 'cq' and where in ('consequence question', 'consequence frame'):
            return True
    return False


def inspect(line, manifest):
    key = line['key']
    path = AUD / (key + '.mp3')
    result = {'key': key, 'text': line['text'], 'voice': line['voice']}
    if key not in manifest.get('keys', []) or not path.is_file():
        return dict(result, status='missing')
    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries',
         'format=duration:stream=codec_name,sample_rate,channels',
         '-of', 'json', str(path)], capture_output=True, text=True)
    decode = subprocess.run(
        ['ffmpeg', '-v', 'error', '-nostdin', '-i', str(path), '-f', 'null', '-'],
        capture_output=True, text=True)
    try:
        meta = json.loads(probe.stdout)
        duration = float(meta['format']['duration'])
        stream = meta['streams'][0]
    except (ValueError, KeyError, IndexError):
        return dict(result, status='invalid', error='Cannot read audio metadata')
    if probe.returncode or decode.returncode or duration < .3:
        return dict(result, status='invalid', error=(probe.stderr + decode.stderr).strip())
    declared = manifest.get('dur', {}).get(key)
    return dict(result, status='recorded', duration=round(duration, 3),
                codec=stream['codec_name'], sample_rate=stream['sample_rate'],
                channels=stream['channels'],
                duration_matches_manifest=declared is not None and abs(declared-duration) <= .1)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--allow-missing', action='store_true')
    args = ap.parse_args()
    lines = json.loads((AUD / 'lines.json').read_text())
    manifest = json.loads((AUD / 'manifest.json').read_text())
    takes = json.loads((AUD / 'takes.json').read_text())
    voices = json.loads((AUD / 'voices.json').read_text())
    selected = [line for line in lines if belongs(line)]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        checks = list(pool.map(lambda line: inspect(line, manifest), selected))
    by_key = {line['key']: line for line in selected}
    pending = {c['key'] for c in checks if c['status'] != 'recorded'}
    # Keep the full take when a shared take contains another lesson's line:
    # split_takes.py must receive the exact sequence it was generated for.
    queue = {name: keys for name, keys in takes.items() if pending.intersection(keys)}
    all_by_key = {line['key']: line for line in lines}
    report = {
        'scope': 'CV challenge, shared onboarding, four-D film, and authored listening controls',
        'coverage_limit': 'Dynamically assembled feedback sheets are not enumerated by voice-script.js.',
        'source_digest': hashlib.sha256((AUD / 'lines.json').read_bytes()).hexdigest(),
        'total': len(checks),
        'recorded': sum(c['status'] == 'recorded' for c in checks),
        'missing': sum(c['status'] == 'missing' for c in checks),
        'invalid': sum(c['status'] == 'invalid' for c in checks),
        'perceptual_listening_verified': False,
        'takes': queue,
        'lines': checks,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'audio-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    md = ['# First challenge — browser recording queue', '',
          f"{report['recorded']} existing clips decode successfully; "
          f"{report['missing']} missing, {report['invalid']} invalid.", '',
          'This queue includes shared onboarding and the four-D film. '
          'Dynamically assembled feedback sheets still need a separate coverage pass.', '',
          'Record in Google AI Studio, Gemini 3.8 Flash TTS. '
          'Use Sulafat for the coach and Leda for Ayesha, matching the existing recorder settings. '
          'Keep each downloaded WAV named exactly as its take heading. '
          'Keep the long pauses between lines; the splitter uses them.', '']
    for voice in ('coach', 'ayesha'):
        v = voices[voice]
        md += ['## '+v['name'], '', '**Style:** '+v['style'], '', v['profile'], '']
        for name, keys in queue.items():
            if all_by_key[keys[0]]['voice'] != voice:
                continue
            md += ['### '+name+'.wav', '', '```text',
                   '\n<long pause> <long pause>\n'.join(all_by_key[k]['spoken'] for k in keys),
                   '```', '']
    md += ['After downloading, run the existing splitter against the download folder, '
           'then refresh voice-script.js and rerun this audit. '
           'The content-derived take names prevent old WAVs from being assigned to new lines.', '']
    (OUT / 'browser-recording-queue.md').write_text('\n'.join(md))
    print(f"CV audio: {report['recorded']}/{report['total']} recorded; "
          f"{report['missing']} missing; {report['invalid']} invalid; {len(queue)} takes queued")
    print(OUT / 'browser-recording-queue.md')
    if report['invalid'] or (report['missing'] and not args.allow_missing):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
