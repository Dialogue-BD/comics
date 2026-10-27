#!/usr/bin/env python3
"""Install single-line recordings (production/cv-tts/takes/cv-ayesha-sa-<key>.wav for Ayesha,
cv-coach-sh-<key>.wav for the coach's feedback-sheet lines)
as audio/<key>.mp3, trimmed like tools/gemini_tts.py, and refresh audio/manifest.json.

  python3 tools/install-sa-clips.py [KEY,KEY...]     # default: every sa take newer than its mp3
"""
import json, os, pathlib, shutil, subprocess, sys, time
ROOT = pathlib.Path(__file__).resolve().parents[1]
AUD, TAKES = ROOT / 'audio', ROOT / 'production/cv-tts/takes'
TRIM = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,'
        'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse,afade=t=in:d=0.03')
def dur(p):
    r = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)],capture_output=True,text=True)
    return float(r.stdout.strip() or 0)
lines = {l['key']: l for l in json.loads((AUD/'lines.json').read_text())}
want = set(sys.argv[1].split(',')) if len(sys.argv) > 1 else None
man = json.loads((AUD/'manifest.json').read_text())
done = []
for wav in sorted([*TAKES.glob('cv-ayesha-sa-*.wav'), *TAKES.glob('cv-coach-sh-*.wav')]):
    k = wav.stem.rsplit('-', 1)[1]
    if k not in lines: print('not a current line, skipped:', wav.name); continue
    out = AUD / (k + '.mp3')
    if want is not None and k not in want: continue
    if want is None and out.exists() and out.stat().st_mtime > wav.stat().st_mtime: continue
    if out.exists():
        rej = AUD / '_rejected'; rej.mkdir(exist_ok=True); shutil.copy2(out, rej / (k + '.pre-accent.mp3'))
    r = subprocess.run(['ffmpeg','-hide_banner','-nostdin','-loglevel','error','-y','-i',str(wav),'-af',TRIM,
                        '-ac','1','-ar','24000','-codec:a','libmp3lame','-b:a','40k',str(out)],capture_output=True,text=True)
    if r.returncode: print('ffmpeg failed', k, r.stderr[:200]); continue
    d = round(dur(out), 2)
    if d < .3: print('empty clip', k); continue
    man['dur'][k] = d
    if k not in man['keys']: man['keys'].append(k)
    done.append(k); print(f'✓ {k} {d:5.2f}s  {lines[k]["text"][:60]}')
if done:
    man['keys'] = sorted(man['keys']); man['v'] = str(int(time.time()))
    (AUD/'manifest.json').write_text(json.dumps(man))
print(len(done), 'clips installed')
