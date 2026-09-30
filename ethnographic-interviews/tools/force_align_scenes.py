#!/usr/bin/env python3
"""Force-align exact scene scripts against final MP3s using Stable-ts.

Requires stable-ts, openai-whisper and ffmpeg. No API key or remote audio service.
Uses known take boundaries to constrain alignment, then refines word endpoints.
Caches each scene by audio + script hash. Run after assemble_scenes.py.
"""
import argparse, hashlib, json
from pathlib import Path
from align import align, duration
from align_scenes import ROOT, OUT, BUILD, lines_from_js


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--model',default='small')
    ap.add_argument('--scene',action='append')
    args=ap.parse_args()
    import stable_whisper
    model=None
    scripts=lines_from_js()
    cache=ROOT/'scene'/'_alignment'; cache.mkdir(exist_ok=True)
    results={}
    if OUT.exists():
        results=json.loads(OUT.read_text().split('const SCENE_TIMINGS = ',1)[1].split(';\n',1)[0])
    for sid,lines in scripts.items():
        if args.scene and sid not in args.scene: continue
        audio=ROOT/'scene'/f'{sid}.mp3'
        text='\n'.join(lines)
        signature=hashlib.sha256(audio.read_bytes()+text.encode()+args.model.encode()+b'force-refine-v1').hexdigest()
        target=cache/f'{sid}.json'
        old=json.loads(target.read_text()) if target.exists() else {}
        if old.get('signature')==signature:
            results[sid]=old['timings'];print(sid,'cached',flush=True);continue
        if model is None:model=stable_whisper.load_model(args.model)
        manifest=json.loads((BUILD/f'{sid}.json').read_text())
        segments=[{'start':t['start'],'end':t['start']+t['len'],'text':' '.join(lines[i] for i in t['lines'])} for t in manifest['takes']]
        result=model.align_words(str(audio),segments,language='en',verbose=None,regroup=False)
        model.refine(str(audio),result,steps='se',precision=.04,abs_dur_change=.3,verbose=None)
        words=[w.to_dict() for s in result.segments for w in s.words]
        timing, fraction, differences=align(' '.join(lines),words,duration(audio))
        if fraction<.98: raise ValueError(f'{sid}: forced text mismatch {differences}')
        timing.update(script=text,method='stable-ts forced alignment + endpoint refinement',audio_sha256=hashlib.sha256(audio.read_bytes()).hexdigest())
        target.write_text(json.dumps({'signature':signature,'timings':timing,'words':words},ensure_ascii=False,indent=2))
        results[sid]=timing
        print(sid,len(timing['w']),'words aligned to final MP3',flush=True)
    OUT.write_text('/* Exact scripts aligned against final MP3s by tools/force_align_scenes.py. */\nconst SCENE_TIMINGS = '+json.dumps(results,separators=(',',':'))+';\nif (typeof module !== \'undefined\') module.exports = { SCENE_TIMINGS };\n')

if __name__=='__main__':main()
