from pathlib import Path
import json,subprocess,concurrent.futures,shutil
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'audio';SRC=ROOT/'tools'
items=json.loads((SRC/'definition-scripts.json').read_text())
def make(item):
 dest=OUT/(item['id']+'.mp3');meta=OUT/(item['id']+'.json');script=OUT/'scripts'/(item['id']+'.txt');script.write_text(item['text'])
 if dest.exists() and meta.exists():
  old=json.loads(meta.read_text())
  if old['turns'][0]['text']==item['text']:return old
 aiff=OUT/('_'+item['id']+'.aiff')
 subprocess.run(['/usr/bin/say','-v','Jamie (Premium)','-r','145','-f',str(script),'-o',str(aiff)],check=True,capture_output=True)
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(aiff),'-af','loudnorm=I=-18:TP=-2:LRA=7','-ac','1','-ar','24000','-c:a','libmp3lame','-b:a','64k',str(dest)],check=True,capture_output=True)
 seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(dest)],text=True));assert seconds>1
 r={'id':item['id'],'concept':item['concept'],'duration':seconds,'turns':[{'role':'Definition','text':item['text'],'start':0,'end':seconds,'voice':'Jamie (Premium)'}],'provenance':'Original lesson definition, synthesised using an installed Apple English voice.'}
 meta.write_text(json.dumps(r,ensure_ascii=False,indent=2));aiff.unlink();return r
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=list(pool.map(make,items))
(SRC/'definition-audio-manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('Produced',len(results),'recorded definitions; total',round(sum(r['duration'] for r in results)),'seconds')
