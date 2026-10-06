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
AUDIO = ROOT / 'audio/kindness-story.mp3'
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
 # Recover both neighbors from measured ASR intervals where a repaired word
 # overlaps a forced boundary. A later recovered boundary can also expose an
 # earlier overlap, so repeat until the entire chain is valid. Never interpolate.
 for attempt in range(len(pairs)):
  overlaps=[i for i in range(1,len(pairs)) if pairs[i][0]<pairs[i-1][1]]
  if not overlaps:break
  for i in overlaps:
   if i not in mapping or i-1 not in mapping:raise RuntimeError('Overlapping boundary requires acoustic review')
   left=acoustic[mapping[i-1]];right=acoustic[mapping[i]]
   candidates=[[round(w['start'],3),round(w['end'],3)] for w in (left,right)]
   if any(e<=s for s,e in candidates) or candidates[0][1]>candidates[1][0]:raise RuntimeError('Independent acoustic boundaries overlap')
   for j,candidate in zip((i-1,i),candidates):
    pairs[j]=candidate
    refinements.append(dict(word=j,text=expected[j],method='independent ASR adjacent boundary',interval=candidate))
 else:raise RuntimeError('Acoustic boundaries did not converge')
 audit['acoustic_boundary_refinements']=refinements
 audit['difference_review'] = [
  'Bengali loanwords are recognized with variable Roman spellings. The Bengali-orthography voice direction is preserved; native pronunciation quality still needs human listening.',
  'Tea-seller is ASR hyphenation; the canonical English spelling tea seller has two acoustic word intervals.',
  'Seller and cellar are homophones in the directed American accent. The context and canonical text identify the tea seller.',
  'Small recognizes heartily in the short correction take; independent base recognition of the same dry take says hardly, supporting the canonical wording.',
  'The disputed Yet/But sentence and unintended Hindi insertion in the initial take were replaced with exact same-voice recordings. Neither difference remains in final ASR.',
  'The initial independent recognizers agree on the spoken contraction he\'d in the repayment sentence. The displayed transcript adopts that contraction.'
 ]
 (OUT/'alignment-audit.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False))
 previous=0
 for s,e in pairs:
  if s<previous-.001 or e<=s or e>dur:raise RuntimeError(f'Invalid aligned interval: {s,e}, previous {previous}')
  previous=e
 timing=dict(script=script,script_sha256=script_hash,audio_sha256=audio_hash,dur=dur,w=pairs,method='stable-ts 2.19.1 / Whisper small exact-script forced alignment; independent ASR audit')
 (ROOT/'story-timings.js').write_text('const KINDNESS_TIMINGS = '+json.dumps(timing,ensure_ascii=False,separators=(',',':'))+';\nif(typeof module!=="undefined") module.exports={KINDNESS_TIMINGS};\n')
 print(f'Wrote {len(pairs)} forced-aligned word intervals, {dur:.2f} seconds.',flush=True)
if __name__=='__main__':main()
