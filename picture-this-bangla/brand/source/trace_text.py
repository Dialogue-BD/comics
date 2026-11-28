"""Trace lettering from the original logo (16x, smoothed) into 720-grid SVG path data."""
from PIL import Image, ImageFilter
import numpy as np, potrace
SRC='/mnt/user-data/uploads/Intl Student Problems Wordless Action Picture/.worktree-ptb-bhasha-vai/picture-this-bangla/bhasha-vai-logo.png'
S=16
o=Image.open(SRC).convert('RGBA')
big=np.array(o.resize((180*S,180*S),Image.BICUBIC)).astype(float)
R,G,B,A=[big[...,i] for i in range(4)]
def smooth(arr, r):
    im=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)); return np.array(im).astype(float)
lum=smooth(0.299*R+0.587*G+0.114*B, S*0.45)/255
alpha=smooth(A, S*0.6)
green=smooth(np.clip((G-R)*2.2,0,255)*(A/255), S*0.45)     # "AI" in the wordmark: strongly green, light-ish
def trace(mask, region, alphamax=0.85, tol=0.4, turd=300):
    x0,y0,x1,y1=[int(v*S/4) for v in region]   # region in 720-grid coords
    reg=np.zeros_like(mask); reg[y0:y1,x0:x1]=True
    m=mask&reg
    plist=potrace.Bitmap(~m).trace(turdsize=turd, alphamax=alphamax, opticurve=True, opttolerance=tol)
    k=720/(180*S); out=[]
    for c in plist:
        st=c.start_point; out.append(f"M{st.x*k:.2f} {st.y*k:.2f}")
        for sg in c.segments:
            if sg.is_corner: out.append(f"L{sg.c.x*k:.2f} {sg.c.y*k:.2f}L{sg.end_point.x*k:.2f} {sg.end_point.y*k:.2f}")
            else: out.append(f"C{sg.c1.x*k:.2f} {sg.c1.y*k:.2f} {sg.c2.x*k:.2f} {sg.c2.y*k:.2f} {sg.end_point.x*k:.2f} {sg.end_point.y*k:.2f}")
        out.append("Z")
    return ''.join(out)
dark=(lum<0.33)&(alpha>140)
paths={
 'ai_bubble': trace(dark, (400,150,625,325)),
 'word1':     trace(dark, (30,430,680,575)),
 'word2_bh':  trace(dark, (110,578,340,716)),
 'word2_ai':  trace((alpha>128)&(lum>0.33), (336,578,545,716)),
}
import json; json.dump(paths, open('/home/claude/bv/traced_text.json','w'))
print({k:len(v) for k,v in paths.items()})
