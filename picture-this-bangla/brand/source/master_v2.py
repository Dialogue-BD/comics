import re
D="/home/claude/bv/brand2/svg"
def parts(fn):
    s=open(f"{D}/{fn}.svg").read()
    vb=[float(v) for v in re.search(r'viewBox="([^"]+)"',s).group(1).split()]
    body=re.sub(r'^<svg[^>]*>|</svg>\s*$','',s.strip()); body=re.sub(r'<title>.*?</title>','',body)
    defs=''.join(re.findall(r'<defs>(.*?)</defs>',body)); body=re.sub(r'<defs>.*?</defs>','',body)
    return vb, body, defs
alldefs=[]
def place(fn, x, y, k=None, h=None, tag=""):
    (vx,vy,vw,vh), body, defs = parts(fn); k = k if k else h/vh
    for i in re.findall(r'id="([^"]+)"',defs):
        defs=defs.replace(f'id="{i}"',f'id="{i}{tag}"'); body=body.replace(f'url(#{i})',f'url(#{i}{tag})')
    alldefs.append(defs)
    return f'<g transform="translate({x:.1f} {y:.1f}) scale({k:.4f}) translate({-vx:.2f} {-vy:.2f})">{body}</g>', vw*k
W,H=1420,1500; out=[f'<rect width="{W}" height="{H}" fill="#F3F4F6"/>']
for i,(bg,suf) in enumerate((("#FFFFFF","On-Light"),("#0B1220","On-Dark"))):
    y0=60+i*560; c='AB'[i]
    out.append(f'<rect x="60" y="{y0}" width="{W-120}" height="500" rx="36" fill="{bg}"/>')
    g,w=place(f"01{c}-Bhasha-BhAI-Logo-{suf}",120,y0+40,h=420,tag=f"p{i}"); out.append(g); x=120+w+90
    g,_=place(f"02{c}-Bhasha-BhAI-Logo-Horizontal-{suf}",x,y0+70,h=140,tag=f"h{i}"); out.append(g)
    g,w2=place("03A-Bhasha-BhAI-Logomark",x,y0+260,h=190,tag=f"m{i}"); out.append(g); xx=x+w2+70
    g,w3=place("04-Bhasha-BhAI-Favicon",xx,y0+300,h=120,tag=f"f{i}"); out.append(g); xx+=w3+70
    out.append(place("05-Bhasha-BhAI-App-Icon",xx,y0+290,h=140,tag=f"a{i}")[0])
y0=1180
out.append(f'<rect x="60" y="{y0}" width="635" height="260" rx="30" fill="#FFFFFF"/><rect x="725" y="{y0}" width="635" height="260" rx="30" fill="#141714"/>')
for px,tone,c1,c2 in ((0,"Black","C","B"),(665,"White","D","C")):
    out.append(place(f"02{c1}-Bhasha-BhAI-Logo-Horizontal-Mono-{tone}",100+px,y0+87,k=0.29,tag=f"x{tone}")[0])
    out.append(place(f"03{c2}-Bhasha-BhAI-Logomark-Mono-{tone}",500+px,y0+66,k=0.27,tag=f"y{tone}")[0])
open(f"{D}/00M-Bhasha-BhAI-Master-Sheet.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Bhasha BhAI logo system"><title>Bhasha BhAI logo system</title><defs>{"".join(alldefs)}</defs>{"".join(out)}</svg>\n')
