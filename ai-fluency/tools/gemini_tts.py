#!/usr/bin/env python3
"""Record the AI Fluency Lab's spoken lines straight from the Gemini TTS API — one request per line,
so there is nothing to cut and nothing to rename. Replaces the AI Studio paste-and-split workflow.

  pip3 install google-genai          (once)
  export GEMINI_API_KEY=...          (or put the key alone in a file called ~/.gemini_key — never in the repo)
  cd <repo>/ai-fluency
  node tools/voice-script.js         # refresh audio/lines.json from the lesson files
  python3 tools/gemini_tts.py --audition          # one sample per voice into audio/_audition/ (listen, pick voices)
  python3 tools/gemini_tts.py --limit 5           # record the first 5 missing lines
  python3 tools/gemini_tts.py                     # record every missing line (safe to stop and re-run: it resumes)

Free keys have small per-minute and per-day limits. The script waits between requests, backs off when it is
told to slow down, and stops cleanly when the day's quota is gone; run it again tomorrow and it carries on.
Options: --coach NAME --ayesha NAME (voice names), --model ID, --only KEY[,KEY], --force (re-record), --pause SECONDS.
Needs ffmpeg (brew install ffmpeg). Clips are 40 kb/s mono mp3, like the cut takes."""
import argparse, base64, json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(HERE, '..', 'audio')
MAN = os.path.join(AUD, 'manifest.json')

def load_key():
    k = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not k:
        f = os.path.expanduser('~/.gemini_key')
        if os.path.exists(f): k = open(f).read().strip()
    if not k: sys.exit('No API key. Run:  export GEMINI_API_KEY=your-key   (or save it alone in ~/.gemini_key)')
    return k

def ffmpeg(args):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-loglevel', 'error'] + args, capture_output=True, text=True)

def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: return 0.0

def to_mp3(wav, out):
    trim = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,'
            'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse,'
            'afade=t=in:d=0.03')
    r = ffmpeg(['-y', '-i', wav, '-af', trim, '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '40k', out])
    if r.returncode: raise RuntimeError('ffmpeg: ' + r.stderr.strip()[:300])
    d = duration(out)
    if d < 0.3: raise RuntimeError('clip is empty (%.2fs)' % d)
    return d

def style_for(v):
    # the API has no separate profile/scene/context fields: the one free-text style carries delivery and voice character
    return (v['style'] + '. ' + v['profile']).strip()

def synth(client, model, voice, style, text):
    it = client.interactions.create(
        model=model,
        input=[{'type': 'user_input', 'content': [{'type': 'text', 'text': text,
                'annotations': [{'type': 'speech_metadata', 'style': style}]}]}],
        response_format={'type': 'audio'},
        generation_config={'speech_config': [{'voice': voice}]})
    return base64.b64decode(it.output_audio.data)

def retry_delay(msg):
    m = re.search(r'retry[^0-9]{0,30}([0-9]+(?:\.[0-9]+)?)\s*s', msg, re.I)
    return float(m.group(1)) + 1 if m else None

def save_manifest(man):
    json.dump(man, open(MAN, 'w'))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--coach', default='Sulafat'); ap.add_argument('--ayesha', default='Leda')
    ap.add_argument('--model', default='gemini-3.8-flash-tts')
    ap.add_argument('--only'); ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--force', action='store_true'); ap.add_argument('--audition', action='store_true')
    ap.add_argument('--pause', type=float, default=6.0)
    ap.add_argument('--list-voices', action='store_true')
    a = ap.parse_args()

    lines = json.load(open(os.path.join(AUD, 'lines.json')))
    voices = json.load(open(os.path.join(AUD, 'voices.json')))
    if any('spoken' not in l for l in lines) or not voices:
        sys.exit('audio/lines.json is out of date. Run:  node tools/voice-script.js')
    vname = {'coach': a.coach, 'ayesha': a.ayesha}

    from google import genai
    client = genai.Client(api_key=load_key())

    if a.list_voices:
        for acc in ('Bangladeshi', 'Indian'):
            try:
                for v in client.voices.list(accent=acc, gender='female' if False else None): print(acc, v)
            except Exception as e: print('voice listing failed:', str(e)[:200]); break
        return

    if a.audition:
        out = os.path.join(AUD, '_audition'); os.makedirs(out, exist_ok=True)
        for who in ('coach', 'ayesha'):
            l = next(x for x in lines if x['voice'] == who)
            wav = synth(client, a.model, vname[who], style_for(voices[who]), l['spoken'])
            p = os.path.join(out, f'{who}-{vname[who]}.wav'); open(p, 'wb').write(wav); print('wrote', p, '·', l['text'])
        print('Listen, then re-run with --coach NAME / --ayesha NAME until both sound right.'); return

    try: man = json.load(open(MAN))
    except Exception: man = {}
    keys = list(man.get('keys', [])); dur = dict(man.get('dur', {})); man = {'keys': keys, 'dur': dur, 'v': man.get('v', '')}
    have = set(keys)
    only = set(a.only.split(',')) if a.only else None
    todo = [l for l in lines if (only and l['key'] in only) or (not only and (a.force or l['key'] not in have or not os.path.exists(os.path.join(AUD, l['key'] + '.mp3'))))]
    if a.limit: todo = todo[:a.limit]
    print(f'{len(todo)} lines to record · coach={a.coach} ayesha={a.ayesha} · {a.model}')
    tmp = os.path.join(AUD, '_tmp'); os.makedirs(tmp, exist_ok=True)
    done = 0
    for i, l in enumerate(todo, 1):
        wav = os.path.join(tmp, l['key'] + '.wav'); out = os.path.join(AUD, l['key'] + '.mp3')
        for attempt in range(6):
            try:
                open(wav, 'wb').write(synth(client, a.model, vname[l['voice']], style_for(voices[l['voice']]), l['spoken']))
                d = to_mp3(wav, out); break
            except Exception as e:
                msg = str(e)
                if re.search(r'per.?day|daily|RESOURCE_EXHAUSTED.*day', msg, re.I) and '429' in msg:
                    print('\nDaily quota is used up. Run this again tomorrow; everything so far is saved.'); save_manifest(man); return
                w = retry_delay(msg) or (15 * (attempt + 1)) if ('429' in msg or 'RESOURCE_EXHAUSTED' in msg or '503' in msg) else None
                if w is None or attempt == 5:
                    print(f'  ! {l["key"]}: {msg[:200]} — skipped'); d = None; break
                print(f'  … slowing down, waiting {w:.0f}s'); time.sleep(w)
        if os.path.exists(wav): os.remove(wav)
        if d is None: continue
        if l['key'] not in have: keys.append(l['key']); have.add(l['key'])
        dur[l['key']] = round(d, 2); save_manifest(man); done += 1
        words = len(l['text'].split())
        flag = '  ← check by ear' if not (0.18 * words <= d <= 0.9 * words + 1.5) else ''
        print(f'[{i}/{len(todo)}] {l["key"]} {d:.1f}s · {l["text"][:60]}{flag}')
        if i < len(todo): time.sleep(a.pause)
    if done:
        man['v'] = str(int(time.time())); save_manifest(man)   # new version string: phones fetch the new files
    try: os.rmdir(tmp)
    except OSError: pass
    print(f'\n{done} clips recorded · audio/manifest.json updated')

if __name__ == '__main__':
    main()
