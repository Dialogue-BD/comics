#!/usr/bin/env python3
"""Offline ASR check of newly recorded first-challenge clips; never a listening sign-off."""
import argparse
import difflib
import json
import pathlib
import re

import torch
import whisper

root = pathlib.Path(__file__).resolve().parents[1]
out = root / 'production/cv-tts/asr-review.json'
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--model', required=True, help='Path to a preinstalled Whisper .pt model')
args = ap.parse_args()
torch.set_num_threads(4)
model = whisper.load_model(args.model, device='cpu')
lines = {l['key']: l for l in json.loads((root / 'audio/lines.json').read_text())}
report = json.loads((root / 'production/cv-tts/audio-audit.json').read_text())
keys = {key for take in report['takes'].values() for key in take}
session = root / 'production/cv-tts/session-queue.json'
if session.exists():
    for take in json.loads(session.read_text())['queue']:
        if take['id'].startswith('cv-ayesha-sa-'):
            keys.update(take['keys'])
try:
    reviewed = json.loads(out.read_text())
except FileNotFoundError:
    reviewed = {}


def normalise(text):
    text = text.lower().replace('’', "'").replace('eye-sha', 'ayesha')
    text = text.replace('a.i.', 'ai').replace('a i', 'ai')
    text = re.sub(r'\b(?:sathi|shathi|shati|saathi|sati)\b', 'sathi', text)
    text = text.replace('সাথী', 'sathi').replace('___', '')
    words = re.findall(r"[a-z0-9]+(?:'[a-z]+)?", text)
    numbers = dict(zip(('zero', 'one', 'two', 'three', 'four', 'five', 'six',
                        'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'),
                       map(str, range(13))))
    return [numbers.get(word, word) for word in words]


for key in sorted(keys):
    path = root / 'audio' / (key + '.mp3')
    if not path.exists():
        continue
    stamp = path.stat().st_mtime_ns
    if (reviewed.get(key, {}).get('mtime_ns') == stamp
            and reviewed.get(key, {}).get('spoken') == lines[key]['spoken']):
        continue
    line = lines[key]
    result = model.transcribe(str(path), language='en', beam_size=5, fp16=False,
                              initial_prompt='Ayesha, Sathi AI, Cog, CV, RUCEI, IELTS, Stata.')
    transcript = result['text'].strip()
    ratio = difflib.SequenceMatcher(None, normalise(line['spoken']), normalise(transcript)).ratio()
    reviewed[key] = {'expected': line['text'], 'transcript': transcript,
                     'spoken': line['spoken'],
                     'similarity': round(ratio, 3), 'needs_review': ratio < .94,
                     'mtime_ns': stamp, 'perceptual_listening_verified': False}
    out.write_text(json.dumps(reviewed, ensure_ascii=False, indent=2)+'\n')
    print(('REVIEW' if ratio < .94 else 'OK'), key, round(ratio, 2), transcript, flush=True)
print(f'{len(reviewed)} clips transcribed; '
      f'{sum(r["needs_review"] for r in reviewed.values())} flagged. '
      'Pronunciation still requires listening.', flush=True)
