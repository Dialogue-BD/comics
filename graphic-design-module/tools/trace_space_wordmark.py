from PIL import Image
from pathlib import Path
from collections import defaultdict
import json,math
source=Path('graphic-design-handoff/reference/comprehensible-input-slides/Graphic-Design--Comprehensible-Input-16.png')
im=Image.open(source).convert('L').crop((1188,28,1894,253))
w,h=im.size;p=list(im.getdata());ink={(x,y) for y in range(h) for x in range(w) if p[y*w+x]<128}
minx=min(x for x,y in ink);miny=min(y for x,y in ink);ink={(x-minx,y-miny) for x,y in ink}
# Follow directed pixel boundaries, then simplify below one source pixel.
def simplify(points,tol=1.0):
 if len(points)<3:return points
 ax,ay=points[0];bx,by=points[-1];dx=bx-ax;dy=by-ay;length=dx*dx+dy*dy
 def dist(q):
  x,y=q;t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/length)) if length else 0
  return (x-ax-t*dx)**2+(y-ay-t*dy)**2
 i=max(range(1,len(points)-1),key=lambda i:dist(points[i]))
 if dist(points[i])<=tol*tol:return [points[0],points[-1]]
 return simplify(points[:i+1],tol)[:-1]+simplify(points[i:],tol)
def paths(pixels):
 edges=defaultdict(list)
 for x,y in pixels:
  if (x,y-1) not in pixels:edges[(x,y)].append((x+1,y))
  if (x+1,y) not in pixels:edges[(x+1,y)].append((x+1,y+1))
  if (x,y+1) not in pixels:edges[(x+1,y+1)].append((x,y+1))
  if (x-1,y) not in pixels:edges[(x,y+1)].append((x,y))
 out=[]
 while edges:
  start=next(iter(edges));v=start;points=[v]
  for _ in range(10000):
   candidates=edges[v];n=candidates.pop()
   if not candidates:del edges[v]
   points.append(n);v=n
   if v==start:break
  else:raise RuntimeError('Unclosed trace')
  split=max(range(len(points)-1),key=lambda i:(points[i][0]-start[0])**2+(points[i][1]-start[1])**2)
  points=simplify(points[:split+1])[:-1]+simplify(points[split:])[:-1]
  # Smooth curved runs with cubic tangents; preserve angular corners exactly.
  tangents=[];corners=[]
  for i,q in enumerate(points):
   prev=points[i-1];nxt=points[(i+1)%len(points)]
   ux=q[0]-prev[0];uy=q[1]-prev[1];vx=nxt[0]-q[0];vy=nxt[1]-q[1]
   a=math.hypot(ux,uy);b=math.hypot(vx,vy)
   ux/=a;uy/=a;vx/=b;vy/=b
   corners.append(ux*vx+uy*vy<math.cos(math.radians(35)))
   tx=ux+vx;ty=uy+vy;length=math.hypot(tx,ty)
   tangents.append((tx/length,ty/length) if length else (vx,vy))
  d=f'M{points[0][0]},{points[0][1]}'
  for i,q in enumerate(points):
   j=(i+1)%len(points);nxt=points[j];length=math.hypot(nxt[0]-q[0],nxt[1]-q[1])
   if corners[i] and corners[j]:d+=f'L{nxt[0]},{nxt[1]}'
   else:
    t1=((nxt[0]-q[0])/length,(nxt[1]-q[1])/length) if corners[i] else tangents[i]
    t2=((nxt[0]-q[0])/length,(nxt[1]-q[1])/length) if corners[j] else tangents[j]
    c1=(q[0]+t1[0]*length/3,q[1]+t1[1]*length/3)
    c2=(nxt[0]-t2[0]*length/3,nxt[1]-t2[1]*length/3)
    d+=f'C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {nxt[0]},{nxt[1]}'
  out.append(d+'Z')
 return ''.join(out)
groups={'s':{(x,y) for x,y in ink if x<185},'pa':{(x,y) for x,y in ink if 185<=x<430},'ce':{(x,y) for x,y in ink if x>=430}}
result={'source':str(source),'crop':[1188,28,1894,253],'method':'Thresholded contour trace, simplified to one source pixel and smoothed with cubic tangents while preserving angular corners; reference silhouettes retained as SVG paths.','width':max(x for x,y in ink)+1,'height':max(y for x,y in ink)+1,'groups':{}}
for name,pixels in groups.items():
 xs=[x for x,y in pixels];ys=[y for x,y in pixels]
 result['groups'][name]={'path':paths(pixels),'bounds':[min(xs),min(ys),max(xs)+1,max(ys)+1]}
Path('graphic-design-module/tools/space-wordmark.json').write_text(json.dumps(result,indent=2)+'\n')
print({k:v['bounds'] for k,v in result['groups'].items()});print('size',result['width'],result['height']);print('path bytes',sum(len(v['path']) for v in result['groups'].values()))
