"""Localize conservative treble/whine filtering without changing audio timing."""
import json,wave
from pathlib import Path
import numpy as np

def blend(source,filtered,target,start=210,full=280,stop=381.080958,fade_out=.2):
 with wave.open(str(source)) as w:
  params=w.getparams();x=np.frombuffer(w.readframes(w.getnframes()),'<i2').copy()
 with wave.open(str(filtered)) as w:
  assert w.getparams()==params,'Filtering changed audio format or frame count'
  y=np.frombuffer(w.readframes(w.getnframes()),'<i2')
 assert params.nchannels==1 and params.sampwidth==2
 sr=params.framerate;z=np.empty_like(x)
 for first in range(0,len(x),sr*5):
  last=min(first+sr*5,len(x));t=np.arange(first,last)/sr
  r=np.clip((t-start)/(full-start),0,1);weight=r*r*(3-2*r)
  r=np.clip((stop-t)/fade_out,0,1);weight*=r*r*(3-2*r)
  z[first:last]=np.rint(x[first:last]*(1-weight)+y[first:last]*weight).clip(-32768,32767).astype('<i2')
 with wave.open(str(target),'wb') as w:w.setparams(params);w.writeframes(z.tobytes())
 assert np.array_equal(x[:int(start*sr)],z[:int(start*sr)]),'Early source changed'
 assert np.array_equal(x[int(np.ceil(stop*sr)):],z[int(np.ceil(stop*sr)):]),'Fresh closing take changed'
 assert len(x)==len(z)
 return dict(samples=len(x),sample_rate=sr,seconds=len(x)/sr,protected_first_seconds=start,fully_filtered_from=full,filtering_stops=stop,fade_out_seconds=fade_out,peak=float(np.max(abs(z.astype(float)))/32768),unchanged_early_samples=True,unchanged_closing_samples=True)
