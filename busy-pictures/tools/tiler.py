import sys
from PIL import Image, ImageDraw
def make_tiles(src,outdir,prefix,cols=4,rows=3,pad=3.0,scale=3):
    im=Image.open(src).convert('RGB'); W,H=im.size; out=[]
    for r in range(rows):
        for c in range(cols):
            x0p=max(0,c*100.0/cols-pad); x1p=min(100,(c+1)*100.0/cols+pad)
            y0p=max(0,r*100.0/rows-pad); y1p=min(100,(r+1)*100.0/rows+pad)
            t=im.crop((int(x0p/100*W),int(y0p/100*H),int(x1p/100*W),int(y1p/100*H)))
            tw,th=t.size; t=t.resize((tw*scale,th*scale),Image.LANCZOS); tw,th=t.size
            ov=Image.new('RGBA',(tw,th),(0,0,0,0)); dr=ImageDraw.Draw(ov)
            px=lambda p:(p-x0p)/(x1p-x0p)*tw; py=lambda p:(p-y0p)/(y1p-y0p)*th
            p=int(x0p)+1
            while p<x1p:
                M=(p%5==0); dr.line([(px(p),0),(px(p),th)],fill=(255,0,255,150 if M else 55),width=2 if M else 1)
                if M: dr.text((px(p)+3,4),f"x{p}",fill=(255,0,255,255))
                p+=1
            p=int(y0p)+1
            while p<y1p:
                M=(p%5==0); dr.line([(0,py(p)),(tw,py(p))],fill=(0,200,255,150 if M else 55),width=2 if M else 1)
                if M: dr.text((4,py(p)+2),f"y{p}",fill=(0,150,255,255))
                p+=1
            Image.alpha_composite(t.convert('RGBA'),ov).convert('RGB').save(f"{outdir}/{prefix}_r{r}c{c}.png")
            out.append((f"{prefix}_r{r}c{c}.png",round(x0p,1),round(x1p,1),round(y0p,1),round(y1p,1)))
    return out
if __name__=='__main__':
    for n,a,b,c,d in make_tiles(sys.argv[1],sys.argv[2],sys.argv[3]): print(n,f"x{a}-{b} y{c}-{d}")
