from pathlib import Path
import json,subprocess,concurrent.futures,shutil
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'tools';OUT=ROOT/'audio';OUT.mkdir(exist_ok=True);(OUT/'scripts').mkdir(exist_ok=True)
lang=json.loads((SRC/'language-curriculum.json').read_text());listen=json.loads((SRC/'listening-curriculum.json').read_text());jobs=[]
voices=['Zoe (Premium)','Jamie (Premium)','Isha (Premium)','Lee (Premium)']
for lab,tasks in lang.items():
 for i,t in enumerate(tasks):
  turns=[]
  for j,(who,line) in enumerate(t['dialogue']):turns.append({'text':line,'voice':voices[i%4] if j%2==0 else 'Daniel (Enhanced)','role':who})
  jobs.append({'id':t['id'],'turns':turns})
for item in listen:jobs.append({'id':item['id'],'turns':[{'text':item['script'],'voice':item['voice'],'role':item['kind']}]})
def run(job):
 dest=OUT/(job['id']+'.mp3');meta=OUT/(job['id']+'.json')
 if dest.exists() and dest.stat().st_size>1000 and meta.exists():
  cached=json.loads(meta.read_text())
  if [(t['text'],t['voice'],t['role']) for t in cached['turns']]==[(t['text'],t['voice'],t['role']) for t in job['turns']]:return cached
 temp=OUT/('_'+job['id']);temp.mkdir(exist_ok=True);files=[];dur=[]
 for i,t in enumerate(job['turns']):
  script=OUT/'scripts'/(job['id']+f'-{i}.txt');script.write_text(t['text']);aiff=temp/(str(i)+'.aiff');wav=temp/(str(i)+'.wav')
  subprocess.run(['/usr/bin/say','-v',t['voice'],'-r','155','-f',str(script),'-o',str(aiff)],check=True,capture_output=True)
  subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(aiff),'-af','apad=pad_dur=0.35','-ac','1','-ar','24000',str(wav)],check=True,capture_output=True)
  seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(wav)],text=True));assert seconds>1
  files.append(wav);dur.append(seconds)
 listing=temp/'concat.txt';listing.write_text('\n'.join("file '"+str(f)+"'" for f in files))
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(listing),'-af','loudnorm=I=-18:TP=-2:LRA=7','-c:a','libmp3lame','-b:a','64k',str(dest)],check=True,capture_output=True)
 length=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(dest)],text=True))
 result={'id':job['id'],'duration':length,'turns':[],'provenance':'Original lesson script, synthesised with installed Apple English voices.'};start=0
 for t,seconds in zip(job['turns'],dur):result['turns'].append({'role':t['role'],'text':t['text'],'start':round(start,3),'end':round(start+seconds,3),'voice':t['voice']});start+=seconds
 meta.write_text(json.dumps(result,ensure_ascii=False,indent=2));shutil.rmtree(temp);return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(run,jobs):
  results.append(result);print('Ready:',result['id'],round(result['duration'],1),'sec',flush=True)
(SRC/'audio-manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print('Finished',len(results),'recordings.',flush=True)
