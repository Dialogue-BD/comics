const el=(tag,cls,parent,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(parent)parent.appendChild(e);return e};
const ICON={
  warn:'<svg viewBox="0 0 92 84"><path d="M46 6 L88 78 H4 Z" fill="#e2684a" stroke="#fffdf7" stroke-width="6" stroke-linejoin="round"/><rect x="42" y="30" width="8" height="26" rx="4" fill="#fffdf7"/><circle cx="46" cy="66" r="5" fill="#fffdf7"/></svg>',
  question:'<svg viewBox="0 0 92 92"><circle cx="46" cy="46" r="42" fill="#d2b978" stroke="#fffdf7" stroke-width="5"/><path d="M33 36 C33 22 59 22 59 37 C59 47 46 47 46 58" fill="none" stroke="#0c3319" stroke-width="8" stroke-linecap="round"/><circle cx="46" cy="71" r="5.5" fill="#0c3319"/></svg>',
  heart:'<svg viewBox="0 0 92 92"><path d="M46 80 C10 54 8 30 22 20 C33 12 43 18 46 28 C49 18 59 12 70 20 C84 30 82 54 46 80 Z" fill="#e2684a" stroke="#fffdf7" stroke-width="5" stroke-linejoin="round"/></svg>',
  bulb:'<svg viewBox="0 0 92 92"><path d="M46 8 C28 8 18 21 18 35 C18 47 27 52 31 62 H61 C65 52 74 47 74 35 C74 21 64 8 46 8 Z" fill="#ffd978" stroke="#fffdf7" stroke-width="5"/><rect x="33" y="66" width="26" height="8" rx="4" fill="#fffdf7"/><rect x="37" y="77" width="18" height="7" rx="3.5" fill="#fffdf7"/></svg>',
  clock:'<svg viewBox="0 0 92 92"><circle cx="46" cy="46" r="40" fill="#fffdf7" stroke="#d2b978" stroke-width="7"/><path d="M46 22 V46 L62 56" fill="none" stroke="#0c3319" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 92 92"><circle cx="46" cy="46" r="42" fill="#2f9d6c" stroke="#fffdf7" stroke-width="5"/><path d="M27 47 L41 61 L66 33" fill="none" stroke="#fffdf7" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross:'<svg viewBox="0 0 92 92"><circle cx="46" cy="46" r="42" fill="#c2553a" stroke="#fffdf7" stroke-width="5"/><path d="M31 31 L61 61 M61 31 L31 61" fill="none" stroke="#fffdf7" stroke-width="9" stroke-linecap="round"/></svg>',
  spark:'<svg viewBox="0 0 120 120"><defs><radialGradient id="sg"><stop offset="0" stop-color="#fff8d8"/><stop offset=".35" stop-color="#ffd978" stop-opacity=".85"/><stop offset="1" stop-color="#ffd978" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="60" r="58" fill="url(#sg)"/><path d="M60 22 C63 46 74 57 98 60 C74 63 63 74 60 98 C57 74 46 63 22 60 C46 57 57 46 60 22 Z" fill="#fffdf7"/></svg>'
};



export function buildScene(host,V,transcript){
  const D=transcript.duration;
  const W=transcript.words;
  const norm=s=>s.replace(/[^a-z0-9'-]/gi,'').toLowerCase();
  const at=(word,n=1)=>{if(typeof word==='number')return word;let k=0;for(const x of W){if(norm(x.w)===norm(word)&&++k===n)return x.s}throw new Error(V.id+': no word “'+word+'” #'+n)};
  const T=ref=>Array.isArray(ref)?at(ref[0],ref[1]||1)+(ref[2]||0):at(ref);
  const dir=new URL(`assets/${V.id}/`,import.meta.url).href;
  const stage=el('div','hq-layered',host);
  const fit=()=>{stage.style.transform=`scale(${host.clientWidth/1280})`};
  const observer=new ResizeObserver(fit);observer.observe(host);fit();
  el('div','speaker-chip',stage,`${V.name} · ${V.topic}`.toUpperCase());
  const dots=el('div','dots',stage);

  const tl=gsap.timeline({paused:true,defaults:{ease:'power2.out'}});
  const X=.4,SC=V.scenes.map(s=>({...s}));SC.forEach((s,i)=>{s.t=i?T(s.at):0});
  const after=[];

  SC.forEach((s,i)=>{
    const t0=s.t,t1=i+1<SC.length?SC[i+1].t:D;
    const sec=el('section','sc',stage),cam=el('div','cam',sec);
    const bg=el('img','bg',cam);bg.src=dir+s.bg+'.webp';bg.alt='';if(s.blur)bg.style.filter=`blur(${s.blur}px)`;
    const smog=el('div','ov smog',cam),shade=el('div','ov shade',cam),sun=el('div','ov sun',cam);
    const fxl=el('div','fxl',cam);el('div','vig',cam);
    const props=el('div','props',cam);el('div','floor',cam);
    const S={V,D,W,at,T,tl,sec,cam,bg,props,fxl,t0,t1,dir,el,pop,ICON,scene:s};
    /* scene in/out + camera */
    tl.set(sec,{autoAlpha:0},0);
    tl.to(sec,{autoAlpha:1,duration:t0?X:.01,ease:'power1.inOut'},Math.max(0,t0-X/2));
    if(t1<D)tl.to(sec,{autoAlpha:0,duration:X,ease:'power1.inOut'},t1-X/2+.02);
    const c=s.cam||(i%2?[{scale:1.02,yPercent:1},{scale:1.11,yPercent:-1.2}]:[{scale:1.1,xPercent:-1.5},{scale:1.02,xPercent:1}]);
    tl.fromTo(cam,c[0],{...c[1],duration:t1-t0+X,ease:'none',immediateRender:false},Math.max(0,t0-X/2));
    /* character poses */
    const poses=s.poses||[];let prev=null;
    poses.forEach((p,k)=>{
      const im=el('img','char'+(s.side==='right'?' right':''),sec);im.src=dir+'pose-'+p[0]+'.webp';im.alt='';
      if(s.side==='right')gsap.set(im,{scaleX:-1});
      const tp=k?T(p.slice(1)):t0;
      if(!k)tl.fromTo(im,{x:s.side==='right'?70:-70,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'power3.out',immediateRender:false},Math.max(0,t0-.12));
      else{gsap.set(im,{autoAlpha:0});tl.to(prev,{autoAlpha:0,duration:.22},tp).fromTo(im,{autoAlpha:0},{autoAlpha:1,duration:.22,immediateRender:false},tp)}
      const b0=tp+.5,b1=(k+1<poses.length?T(poses[k+1].slice(1)):t1);
      if(b1-b0>1){const n=Math.max(1,Math.round((b1-b0)/1.7));tl.fromTo(im,{scaleY:1},{scaleY:1.012,duration:(b1-b0)/n/2,ease:'sine.inOut',yoyo:true,repeat:n*2-1,immediateRender:false},b0)}
      prev=im;
    });
    /* background grade */
    let cur=s.init||[1,1];const f=a=>`saturate(${a[0]}) brightness(${a[1]})`+(s.blur?` blur(${s.blur}px)`:'');
    if(s.init)tl.set(bg,{filter:f(cur)},0);
    /* effects */
    (s.fx||[]).forEach(x=>{const k=x[0];
      if(k==='tint'){const to=[x[2],x[3]];tl.fromTo(bg,{filter:f(cur)},{filter:f(to),duration:x[4]||.9,ease:'power1.inOut',immediateRender:false},T(x[1])-.05);cur=to}
      else if(k==='smog')tl.to(smog,{opacity:x[2],duration:x[3]||.8,ease:'power1.inOut'},T(x[1])-.05);
      else if(k==='shade')tl.to(shade,{opacity:x[2]==null?1:x[2],duration:.8,ease:'power1.inOut'},T(x[1])-.1);
      else if(k==='sun')tl.to(sun,{opacity:x[2]==null?1:x[2],duration:1,ease:'power1.inOut'},T(x[1])-.1);
      else if(k==='puffs'){const t=T(x[1]);x[2].forEach(([px,py,sz],j)=>{const p=el('div','puff',fxl);p.style.cssText=`left:${px-sz/2}px;top:${py-sz/2}px;width:${sz}px;height:${sz}px`;
        tl.fromTo(p,{autoAlpha:0,y:40,scale:.5},{autoAlpha:.95,y:-90-j%2*30,scale:1.5,duration:1.5,ease:'power1.out',immediateRender:false},t-.1+j*.07)})}
      else if(k==='spark'){const sp=el('div','spark',sec,ICON.spark);x[1].forEach((p,j)=>{const t=T(p[0]),o={x:p[1]-60,y:p[2]-60};
        if(!j)tl.fromTo(sp,{autoAlpha:0,x:o.x-150,y:o.y+150,scale:.3,rotation:-90},{autoAlpha:1,...o,scale:p[3]||1,rotation:0,duration:.6,ease:'back.out(1.6)',immediateRender:false},t-.05);
        else tl.to(sp,{...o,scale:p[3]||1,rotation:180*j,duration:p[4]||1,ease:'power2.inOut'},t-.3)});
        const last=T(x[1][x[1].length-1][0])+.8;if(t1-last>.8)tl.to(sp,{scale:'+=.22',duration:.5,yoyo:true,repeat:Math.max(1,2*Math.floor((t1-last)/1)-1),ease:'sine.inOut'},last);
        if(x[2])tl.to(sp,{autoAlpha:0,scale:.3,duration:.4},T(x[2]))}
      else if(k==='icon'){const ic=el('div','icon',sec,ICON[x[1]]);ic.style.left=x[3]-46+'px';ic.style.top=x[4]-46+'px';const t=T(x[2]);
        pop(ic,t,x[5]);tl.to(ic,{scale:1.12,duration:.28,yoyo:true,repeat:3,ease:'sine.inOut'},t+.45)}
      else if(k==='count'){const tg=el('div','tag '+(x[6]||'gold'),sec,`<i></i><b>${x[2]}</b>&nbsp;${x[4]}`);tg.style.left=x[5][0]+'px';tg.style.top=x[5][1]+'px';const t=T(x[1]),o={v:x[2]},b=tg.querySelector('b');
        pop(tg,t,0);tl.to(o,{v:x[3],duration:x[7]||1.4,ease:'none',onUpdate:()=>{b.textContent=Math.round(o.v)}},t)}
    });
    /* word labels */
    (s.tags||[]).forEach(g=>{const tg=el('div','tag '+(g[4]||'gold'),sec,`<i></i>${g[0]}`);tg.style.left=g[2]+'px';tg.style.top=g[3]+'px';pop(tg,T(g[1]),g[5]||0)});
    if(s.build)after.push(()=>s.build(S));
    const d=el('b','',dots);const u=el('u','',d);tl.fromTo(u,{scaleX:0},{scaleX:1,duration:t1-t0,ease:'none',immediateRender:false},t0);
  });
  tl.to({}, {duration:.01}, D);
  function pop(node,t,hold,o={}){
    tl.fromTo(node,{autoAlpha:0,scale:.55,y:18},{autoAlpha:1,scale:1,y:0,duration:.42,ease:'back.out(2.2)',immediateRender:false,...o},t-.06);
    if(hold)tl.to(node,{autoAlpha:0,y:-10,duration:.3,ease:'power1.in'},t+hold);
  }

  after.forEach(f=>f());
  const scenes=SC.map((s,i)=>({start:s.t,end:SC[i+1]?.t??D,title:s.title,meaning:s.sub}));
  const ready=Promise.all([...stage.querySelectorAll('img')].map(im=>im.decode()));
  let reduced=false,time=0;
  function seek(t){time=Math.max(0,Math.min(D,t));
    const scene=scenes.findLast(s=>s.start<=time)||scenes[0];
    tl.time(reduced?Math.min(scene.end-.1,scene.start+1):Math.max(.01,time),false);
  }
  seek(0);
  return {ready,scenes,seek,setReduced(v){reduced=v;seek(time)},dispose(){observer.disconnect();tl.kill();stage.remove()}};
}
