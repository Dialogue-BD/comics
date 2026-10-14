"""Reproducible crops of the supplied guide; normalized boxes preserve source page mapping."""
from pathlib import Path
import json,subprocess,tempfile,sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(json.loads((ROOT/'tools/guide-pages.json').read_text())['source_file'])
clips=json.loads((ROOT/'tools/effect-clips.json').read_text())
out=ROOT/'guide-crops';out.mkdir(exist_ok=True)
selected={id:c for id,c in clips.items() if not sys.argv[1:] or id in sys.argv[1:]}
with tempfile.TemporaryDirectory(prefix='gareth-guide-') as tmp:
 pages={}
 for n in sorted({c['page'] for c in selected.values()}):
  target=Path(tmp)/f'page-{n}'
  subprocess.run(['pdftoppm','-f',str(n),'-l',str(n),'-scale-to','2400','-png','-singlefile',str(SOURCE),str(target)],check=True,stderr=subprocess.DEVNULL)
  pages[n]=Image.open(str(target)+'.png').convert('RGB')
 for id,c in selected.items():
  im=pages[c['page']];w,h=im.size
  parts=[im.crop(tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(box))) for box in c['boxes']]
  if c.get('layout')=='palette':
   wheel,strip=parts;wheel.thumbnail((230,230),Image.Resampling.LANCZOS);strip.thumbnail((650,170),Image.Resampling.LANCZOS)
   result=Image.new('RGB',(920,260),(237,237,237));result.paste(wheel,(10,(260-wheel.height)//2));result.paste(strip,(260,(260-strip.height)//2))
  elif len(parts)>1:
   height=360
   parts=[p.resize((round(p.width*height/p.height),height),Image.Resampling.LANCZOS) for p in parts]
   result=Image.new('RGB',(sum(p.width for p in parts)+16*(len(parts)-1),height),'white');x=0
   for p in parts:result.paste(p,(x,0));x+=p.width+16
  else:result=parts[0]
  result.thumbnail((1200,850),Image.Resampling.LANCZOS)
  # Treat monochrome diagrams as ink on transparent paper; retain photo/colour detail.
  if c.get('treatment')=='green-ink':
   from PIL import ImageOps
   grey=ImageOps.grayscale(result);alpha=grey.point(lambda v:max(0,min(255,round((237-v)*255/237))))
   result=Image.new('RGBA',result.size,(36,67,49,0));result.putalpha(alpha)
  elif id.startswith('color-'):
   result=result.convert('RGBA');pixels=list(result.get_flattened_data());result.putdata([(r,g,b,0 if min(r,g,b)>=234 and max(r,g,b)<=244 and max(r,g,b)-min(r,g,b)<=5 else 255) for r,g,b,a in pixels])
  result.save(out/c['file'],'WEBP',quality=91,method=6)
 thumbs=[]
 for id,c in clips.items():
  im=Image.open(out/c['file']);im.thumbnail((240,190));thumb=Image.new('RGB',(260,230),'#f5f0e4');thumb.paste(im,((260-im.width)//2,30+(190-im.height)//2),im if im.mode=='RGBA' else None);
  from PIL import ImageDraw
  ImageDraw.Draw(thumb).text((8,7),f'{id} · p{c["page"]}',fill='black');thumbs.append(thumb)
 for start in range(0,len(thumbs),16):
  batch=thumbs[start:start+16];sheet=Image.new('RGB',(1040,230*((len(batch)+3)//4)),'white')
  for i,im in enumerate(batch):sheet.paste(im,((i%4)*260,(i//4)*230))
  sheet.save(Path('/tmp')/f'guide-crops-{start}.jpg',quality=92)
print('Rendered',len(clips),'source crops with page and crop-box provenance.')
