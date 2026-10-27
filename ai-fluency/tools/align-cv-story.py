#!/usr/bin/env python3
"""Align Ayesha's exact story transcript to its existing delivered MP3s.

Uses cached local Whisper small + stable-ts. No speech is regenerated.
Stores original alignment and independent recognition audit under production/.
"""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'audio/story-timings.js'
CACHE = ROOT / 'production/visual-polish/story-alignment'
WORD = re.compile(r"[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*")


def norm(t):
    return re.sub(r'[^a-z0-9]', '', t.lower())


def story_lines():
    js = """
global.window=global;global.document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}};
require('./compass.js');require('./engine.js');require('./story-voice.js');require('./cv-art.js');require('./lesson-cv.js');
const c=AFL.LESSONS.cv.beats.find(b=>b.card?.type==='story').card;
console.log(JSON.stringify(c.panels.map(p=>({text:p.en,key:AFL.audioKey(p.en)}))));
"""
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT, text=True))


def duration(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
        'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(p)], text=True))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--model', required=True, help='Path to a preinstalled Whisper .pt file')
    args = ap.parse_args()
    import torch
    import stable_whisper
    torch.set_num_threads(4)
    CACHE.mkdir(parents=True, exist_ok=True)
    model = None
    entries = {}
    for line in story_lines():
        key, text = line['key'], line['text']
        audio = ROOT / 'audio' / (key + '.mp3')
        audio_hash = hashlib.sha256(audio.read_bytes()).hexdigest()
        signature = hashlib.sha256((audio_hash + text + args.model + 'align-refine-v2-lexical').encode()).hexdigest()
        target = CACHE / (key + '.json')
        old = json.loads(target.read_text()) if target.exists() else {}
        if old.get('signature') == signature:
            entries[key] = old['timing']
            print(key, 'cached', flush=True)
            continue
        if (old.get('timing', {}).get('audio_sha256') == audio_hash
                and old['timing']['text'] == text and old.get('model') == args.model):
            raw_words = old['aligned_words']
            transcript = old['independent_transcript']
        else:
            if model is None:
                model = stable_whisper.load_model(args.model, device='cpu')
            # Separate recognition provides evidence of what the recording says.
            heard = model.transcribe(str(audio), language='en', fp16=False, verbose=None,
                                     condition_on_previous_text=False, vad=False)
            transcript = heard.text.strip()
            aligned = model.align(str(audio), text, language='en', verbose=None,
                                  regroup=False, vad=False)
            if aligned is None:
                raise ValueError('Cannot align ' + key)
            model.refine(str(audio), aligned, steps='se', precision=.02,
                         abs_dur_change=.3, verbose=None)
            raw_words = [w.to_dict() for s in aligned.segments for w in s.words]
        # A standalone dash is silence, not the onset of the following word.
        words = [w for w in raw_words if norm(w['word'])]
        expected = WORD.findall(text)
        # Join tokenizer pieces belonging to a single written contraction/name.
        intervals = []
        wi = 0
        for token in expected:
            joined = ''
            first = wi
            while wi < len(words) and joined != norm(token):
                joined += norm(words[wi]['word'])
                wi += 1
                if not norm(token).startswith(joined):
                    raise ValueError(f'{key}: aligner text differs at {token}: {joined}')
            if joined != norm(token) or wi == first:
                raise ValueError(f'{key}: no aligned interval for {token}')
            intervals.append([round(words[first]['start'], 3), round(words[wi-1]['end'], 3)])
        if wi != len(words):
            raise ValueError(f'{key}: extra aligned words')
        dur = duration(audio)
        previous = 0
        for start, end in intervals:
            if not (previous <= start < end <= dur + .025):
                raise ValueError(f'{key}: invalid/nonmonotonic word interval {start, end}')
            previous = end
        timing = dict(text=text, words=expected, w=intervals, dur=round(dur, 3),
                      audio_sha256=audio_hash,
                      method='stable-ts exact-text alignment + endpoint refinement')
        audit = dict(signature=signature, timing=timing, independent_transcript=transcript,
                     aligned_words=raw_words, model=args.model,
                     perceptual_listening_verified=False)
        target.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n')
        entries[key] = timing
        print(key, len(expected), 'words', transcript, flush=True)
    OUT.write_text('/* Generated by tools/align-cv-story.py against the delivered MP3s. */\n'
        'const CV_STORY_TIMINGS = ' + json.dumps(entries, ensure_ascii=False, separators=(',', ':')) + ';\n'
        'if (typeof module !== "undefined") module.exports = CV_STORY_TIMINGS;\n')


if __name__ == '__main__':
    main()
