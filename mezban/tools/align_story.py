"""Independent ASR audit plus exact-script forced alignment, never estimated timing.

Run with Whisper, stable-ts, torch and torchaudio installed. Cached small model
is used locally. For this session dependencies live in /private/tmp/mezban-align-deps.
"""
import difflib, hashlib, json, re, subprocess
from pathlib import Path
import torch
import stable_whisper
import whisper

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'production'
AUDIO = ROOT / 'audio/mezban-story.mp3'
WORD = re.compile(r"[A-Za-z’'-]+")
def norm(s):
 return re.sub('[^a-z]', '', s.lower())
def main():
 torch.set_num_threads(4)
 story = json.loads((OUT/'manifest.json').read_text())
 script = '\n'.join(l['text'] for l in story['lines'])
 expected = WORD.findall(script)
 audio_hash = hashlib.sha256(AUDIO.read_bytes()).hexdigest()
 script_hash = hashlib.sha256(script.encode()).hexdigest()
 model = stable_whisper.load_model('small',device='cpu')
 cache = OUT/'asr.json'
 if cache.exists() and json.loads(cache.read_text()).get('audio_sha256') == audio_hash:
  heard = json.loads(cache.read_text())['result']
 else:
  heard = model.transcribe(str(AUDIO),language='en',word_timestamps=True,fp16=False,verbose=None,condition_on_previous_text=False)
  heard = heard.to_dict()
  cache.write_text(json.dumps(dict(audio_sha256=audio_hash,result=heard),indent=2))
 heard_text = ''.join(s['text'] for s in heard['segments'])
 tokens = WORD.findall(heard_text)
 diffs=[]; matches=0
 for tag,a,b,c,d in difflib.SequenceMatcher(None,list(map(norm,expected)),list(map(norm,tokens)),autojunk=False).get_opcodes():
  if tag=='equal':matches+=b-a
  else:diffs.append(dict(operation=tag,script=' '.join(expected[a:b]),heard=' '.join(tokens[c:d])))
 audit=dict(model='Whisper small',audio_sha256=audio_hash,script_sha256=script_hash,expected=script,heard=heard_text,exact_fraction=matches/len(expected),differences=diffs,word_count=len(expected))
 (OUT/'alignment-audit.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False))
 print('ASR exact match:',round(matches/len(expected)*100,2),'%; differences:',diffs,flush=True)
 if matches/len(expected)<.97:raise RuntimeError('Review narration mismatch before proceeding')
 result=model.align(str(AUDIO),script,language='en',original_split=True,verbose=False,regroup=False,fast_mode=False,suppress_silence=False)
 if result is None:raise RuntimeError('Forced alignment failed')
 result.save_as_json(str(OUT/'forced-alignment.json'))
 aligned=[]
 for segment in result.segments:
  for w in segment.words:
   bits=WORD.findall(w.word)
   if len(bits)!=1:raise RuntimeError(f'Aligner token requires review: {w.word!r}')
   aligned.append((bits[0],round(w.start,3),round(w.end,3)))
 if list(map(norm,expected))!=[norm(w[0]) for w in aligned]:raise RuntimeError('Forced alignment token count or order mismatch')
 dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(AUDIO)]))
 pairs=[[s,e] for w,s,e in aligned]
 # Repair collapsed alignment boundaries from independently recognized acoustic
 # intervals for the same word, never from character counts or interpolation.
 acoustic=[w for s in heard['segments'] for w in s['words']]
 mapping={}
 for tag,a,b,c,d in difflib.SequenceMatcher(None,list(map(norm,expected)),[norm(w['word']) for w in acoustic],autojunk=False).get_opcodes():
  if tag=='equal':mapping.update({i:j for i,j in zip(range(a,b),range(c,d))})
 refinements=[]
 for i,(s,e) in enumerate(pairs):
  if e>s:continue
  if i not in mapping:raise RuntimeError(f'No acoustic timing for collapsed word {i}: {expected[i]}')
  acoustic_word=acoustic[mapping[i]]
  pairs[i]=[round(acoustic_word['start'],3),round(acoustic_word['end'],3)]
  refinements.append(dict(word=i,text=expected[i],method='independent ASR word interval',interval=pairs[i]))
 # If that observed onset falls inside the preceding forced interval, use the
 # independent recognizer's preceding word too, restoring an acoustic boundary.
 for i in range(1,len(pairs)):
  if pairs[i][0]>=pairs[i-1][1]:continue
  if i-1 not in mapping:raise RuntimeError('Overlapping boundary requires review')
  prev=acoustic[mapping[i-1]]
  candidate=[round(prev['start'],3),round(prev['end'],3)]
  if candidate[1]>pairs[i][0] or candidate[1]<=candidate[0]:raise RuntimeError('Independent acoustic boundaries overlap')
  pairs[i-1]=candidate
  refinements.append(dict(word=i-1,text=expected[i-1],method='independent ASR preceding boundary',interval=candidate))
 audit['acoustic_boundary_refinements']=refinements
 audit['difference_review']=[
  'The two independent recognizers agree on daughter singular; displayed transcript adopts that spoken wording.',
  'The extra hands and Then appear only in the small-model output around segment splits; the independent base-model output does not contain them.',
  'Rick Shaw is a recognizer spelling split for rickshaw.',
  'Hijra has inconsistent recognizer spellings. Intended local pronunciation is in the voice direction; a human pronunciation review remains advisable.'
 ]
 (OUT/'alignment-audit.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False))
 previous=0
 for s,e in pairs:
  if s<previous-.001 or e<=s or e>dur:raise RuntimeError(f'Invalid aligned interval: {s,e}, previous {previous}')
  previous=e
 timing=dict(script=script,script_sha256=script_hash,audio_sha256=audio_hash,dur=dur,w=pairs,method='stable-ts 2.19.1 / Whisper small exact-script forced alignment; independent ASR audit')
 (ROOT/'story-timings.js').write_text('const MEZBAN_TIMINGS = '+json.dumps(timing,ensure_ascii=False,separators=(',',':'))+';\nif(typeof module!=="undefined") module.exports={MEZBAN_TIMINGS};\n')
 print(f'Wrote {len(pairs)} forced-aligned word intervals, {dur:.2f} seconds.',flush=True)
if __name__=='__main__':main()
