"""Compare matched passages of the preserved and cleaned deliveries."""
import json,subprocess,tempfile,wave
from pathlib import Path
import numpy as np
R=Path(__file__).resolve().parent.parent
B=R/'audio/_originals/lost-son-before-cleanup.mp3'
A=R/'audio/_originals/lost-son-eq-attempt.mp3'
OUT=R/'production/audio-review'
def read(p):
 with wave.open(str(p)) as w:return w.getframerate(),np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768
with tempfile.TemporaryDirectory(prefix='lost-son-audio-review-',dir='/private/tmp') as temp:
 files=[]
 for i,source in enumerate([B,A]):
  target=Path(temp)/f'{i}.wav';subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source),'-ar','24000','-c:a','pcm_s16le',str(target)],check=True);files.append(target)
 sr,x=read(files[0]);sr2,y=read(files[1]);assert sr==sr2 and len(x)==len(y)
 n=8192;f=np.fft.rfftfreq(n,1/sr)
 def power(a,start,end):
  frames=np.lib.stride_tricks.sliding_window_view(a[int(start*sr):int(end*sr)],n)[::4096]
  return np.mean(abs(np.fft.rfft(frames*np.hanning(n),axis=1))**2,axis=0)
 report=[]
 for start,end in [(10,45),(170,210),(250,290),(300,340),(340,380),(382,401)]:
  a=power(x,start,end);b=power(y,start,end);voice=(f>=120)&(f<4000);high=(f>=4000)&(f<=11500)
  r=dict(start=start,end=end,voice_band_change_db=round(float(10*np.log10(b[voice].sum()/a[voice].sum())),2),high_band_change_db=round(float(10*np.log10(b[high].sum()/a[high].sum())),2),before_high_to_voice_db=round(float(10*np.log10(a[high].sum()/a[voice].sum())),2),after_high_to_voice_db=round(float(10*np.log10(b[high].sum()/b[voice].sum())),2))
  if start==340:r['whine_bands']=[dict(hz=hz,reduction_db=round(float(10*np.log10(b[abs(f-hz)<70].sum()/a[abs(f-hz)<70].sum())),2)) for hz in [9050,9330,9920,10860]]
  report.append(r)
 OUT.joinpath('cleanup-comparison.json').write_text(json.dumps(dict(decoded_samples=len(x),sample_rate=sr,identical_decoded_duration=True,sections=report),indent=2)+'\n')
 for label,source in [('original',B),('cleaned',A)]:subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','340','-t','35','-i',str(source),'-codec:a','libmp3lame','-b:a','128k',str(OUT/f'ending-{label}.mp3')],check=True)
 print(json.dumps(report[2:5],indent=2))
