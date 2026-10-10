"""Measure straight panel gutters in accepted sheets; do not estimate from text."""
from pathlib import Path
import json,numpy as np
from PIL import Image
R=Path(__file__).resolve().parent.parent
columns={1:[[1/3,2/3]]*3,2:[[.25,.5,.75]]*3,3:[[1/3,2/3],[1/3,2/3],[.31,.50,.76]],4:[[.25,.5,.75]]*3,5:[[1/3,2/3]]*3,6:[[1/3,2/3]]*3,7:[[.2,.4,.6,.8],[.25,.5,.75],[1/3,2/3]]}
rects={};evidence=[]
for page,cols in columns.items():
 p=R/f'assets/art-v2/page-{page}.png';im=np.asarray(Image.open(p).convert('RGB'));h,w=im.shape[:2];gray=im.mean(axis=2)
 def boundary(score,centre,extent,radius):
  lo=max(1,int((centre-radius)*extent));hi=min(extent-1,int((centre+radius)*extent));i=lo+int(np.argmin(score[lo:hi]));assert score[i]<45,(page,centre,score[i]);return i
 ys=[0]+[boundary(gray.mean(axis=1),f,h,.055) for f in [1/3,2/3]]+[h]
 panels={};n=1
 for row,cs in enumerate(cols):
  y0,y1=ys[row],ys[row+1];score=gray[y0+8:y1-8].mean(axis=0);xs=[0]+[boundary(score,f,w,.035) for f in cs]+[w]
  for x0,x1 in zip(xs,xs[1:]):
   pad=5;panels[n]=[(x0+pad)/w,(y0+pad)/h,(x1-x0-2*pad)/w,(y1-y0-2*pad)/h];n+=1
  evidence.append(dict(page=page,row=row+1,y=[y0,y1],x=xs,native=[w,h]))
 rects[page]=panels
(R/'production/art-v2/panel-geometry.json').write_text(json.dumps(rects,indent=2)+'\n')
(R/'production/art-v2/gutter-measurements.json').write_text(json.dumps(evidence,indent=2)+'\n')
print('Measured',sum(map(len,rects.values())),'panels from native sheets:',[(p,Image.open(R/f'assets/art-v2/page-{p}.png').size) for p in columns])
