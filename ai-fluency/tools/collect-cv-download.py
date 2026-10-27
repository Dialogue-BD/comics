#!/usr/bin/env python3
"""Collect the single WAV just requested through AI Studio's Download control."""
import json
import pathlib
import shutil
import time

root = pathlib.Path(__file__).resolve().parents[1]
production = root / 'production/cv-tts'
pending = production / 'pending-download.json'
request = json.loads(pending.read_text())
downloads = pathlib.Path.home() / 'Downloads'
before = set(request['existing'])
for attempt in range(40):
    candidates = [p for p in downloads.glob('Generated Audio*.wav') if p.name not in before]
    if len(candidates) == 1 and candidates[0].stat().st_size > 44:
        source = candidates[0]
        size = source.stat().st_size
        time.sleep(.2)
        if source.stat().st_size == size:
            target = production / 'takes' / (request['id'] + '.wav')
            shutil.copyfile(source, target)
            print(f'Saved {target.name}: {size} bytes')
            pending.unlink()
            break
    if len(candidates) > 1:
        raise SystemExit('Multiple new WAVs found; verify their take assignments before continuing.')
    time.sleep(.2)
else:
    raise SystemExit('No completed WAV download yet; the pending request is preserved.')
