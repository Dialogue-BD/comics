/* Sound and celebration — everything is made in the browser (no audio files).
 *   FX.sfx(name)            short synthesised sounds: tick, ok, no, clock, gear, result, ping
 *   FX.gearTurned(el,d)     a gear locks in: it ticks faster and faster, clunks, chimes, confetti
 *   FX.missionDone(root)    four gears lock one after another, fanfare, the stars count up
 *   FX.unlock()             call from the first tap so phones allow sound later
 * Sound follows the "Cog reads aloud" switch (FX.on); motion respects reduced-motion. */
(function(){
const FX={on:()=>true};
let ac=null,master=null;
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){return false}};
function ensure(){
  if(ac) return ac;
  try{ ac=new (window.AudioContext||window.webkitAudioContext)(); master=ac.createGain(); master.gain.value=.8; master.connect(ac.destination); }catch(e){ ac=null; }
  return ac;
}
FX.unlock=()=>{ try{ ensure(); if(ac&&ac.state==='suspended') ac.resume(); }catch(e){} };
const T=()=>ac.currentTime;
function tone(f,t0,d,type,v,f2){
  const o=ac.createOscillator(),g=ac.createGain(); o.type=type||'sine';
  o.frequency.setValueAtTime(f,t0); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t0+d);
  g.gain.setValueAtTime(.0001,t0); g.gain.exponentialRampToValueAtTime(v||.2,t0+.012); g.gain.exponentialRampToValueAtTime(.0001,t0+d);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0+d+.03);
}
/* a bell: the note, its octave and a soft fifth */
function bell(f,t0,d,v){ tone(f,t0,d,'sine',v||.22); tone(f*2,t0,d*.6,'sine',(v||.22)*.35); tone(f*3.01,t0,d*.3,'sine',(v||.22)*.12); }
function noise(t0,d,v,f1,f2,q){
  const n=Math.max(1,Math.floor(ac.sampleRate*d)),buf=ac.createBuffer(1,n,ac.sampleRate),a=buf.getChannelData(0);
  for(let i=0;i<n;i++) a[i]=Math.random()*2-1;
  const s=ac.createBufferSource(); s.buffer=buf;
  const bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=q||1.2; bp.frequency.setValueAtTime(f1,t0); bp.frequency.exponentialRampToValueAtTime(f2,t0+d);
  const g=ac.createGain(); g.gain.setValueAtTime(.0001,t0); g.gain.exponentialRampToValueAtTime(v,t0+d*.25); g.gain.exponentialRampToValueAtTime(.0001,t0+d);
  s.connect(bp); bp.connect(g); g.connect(master); s.start(t0); s.stop(t0+d+.02);
}
const tick=(t0,v)=>{ tone(2300,t0,.03,'square',(v||.12)*.45); tone(620,t0,.05,'triangle',v||.2); };
const clunk=(t0)=>{ tone(150,t0,.22,'triangle',.5,48); tone(70,t0,.3,'sine',.45,40); noise(t0,.08,.25,900,200,.8); };
const sparkle=(t0,n)=>{ for(let i=0;i<n;i++) tone(2200+Math.random()*3200,t0+i*.07+Math.random()*.05,.22,'sine',.07+Math.random()*.05); };
const NOTE={C5:523.25,E5:659.25,G5:783.99,C6:1046.5,E6:1318.5,G6:1568,D5:587.33,A5:880,G4:392,C4:261.63,E4:329.63};

const SOUNDS={
  tick:()=>tick(T()),
  ping:(o)=>bell(NOTE.C6*(1+(o||0)*.06),T(),.35,.14),
  ok:()=>{ const t=T(); bell(NOTE.E6,t,.4,.13); bell(NOTE.G6,t+.09,.55,.12); },
  no:()=>{ const t=T(); tone(220,t,.16,'triangle',.22,150); tone(165,t+.13,.24,'triangle',.2,110); },
  /* a clock: four steady ticks, then the hands race, then a soft landing bell */
  clock:()=>{ const t=T(); for(let i=0;i<4;i++) tick(t+i*.17,.2);
    const w=t+.75; noise(w,1.25,.32,250,4200,.9);
    tone(140,w,1.25,'sawtooth',.06,820); tone(95,w,1.25,'triangle',.07,540);
    for(let i=0;i<14;i++) tick(w+.1+i*(.088-i*.0035),.07);
    bell(NOTE.G5,t+2.05,.9,.16); },
  /* a gear locks in: tick-tick-tick faster and faster, a clunk, then a bright arpeggio and sparkles */
  gear:()=>{ const t=T(); let at=0,gap=.24; for(let i=0;i<8;i++){ tick(t+at,.12+i*.02); at+=gap; gap*=.8; }
    const lock=t+1.42; clunk(lock);
    [NOTE.C5,NOTE.E5,NOTE.G5,NOTE.C6].forEach((f,i)=>{ bell(f,lock+.1+i*.09,1.1,.2); });
    bell(NOTE.E6,lock+.5,1.2,.14); sparkle(lock+.25,9); noise(lock,.45,.12,2000,7000,.7); },
  /* the mission: four gears land one after another, then the fanfare */
  gearsLand:(i)=>{ const t=T(); clunk(t); const f=[NOTE.C5,NOTE.E5,NOTE.G5,NOTE.C6][i%4]; bell(f,t+.05,1,.22); bell(f*1.5,t+.05,.8,.1); sparkle(t+.1,4); },
  fanfare:()=>{ const t=T(); noise(t,.7,.2,300,6000,.8);
    [[NOTE.C4,0],[NOTE.E4,.0],[NOTE.G4,0],[NOTE.C5,0]].forEach(([f])=>{ tone(f,t+.1,1.6,'triangle',.18); tone(f*2,t+.1,1.3,'sine',.07); });
    [NOTE.G5,NOTE.C6,NOTE.E6,NOTE.G6].forEach((f,i)=>bell(f,t+.18+i*.11,1.3,.22));
    sparkle(t+.4,16); }
};
FX.sfx=(name,arg)=>{ try{ if(!FX.on()) return; if(!ensure()) return; if(ac.state==='suspended') ac.resume(); const f=SOUNDS[name]; if(f) f(arg); }catch(e){} };

/* ---------------- confetti on one full-screen canvas ---------------- */
let cv=null,cx=null,parts=[],raf=0,last=0;
function canvas(){
  if(cv) return cv;
  cv=document.createElement('canvas'); cv.id='fx'; cv.setAttribute('aria-hidden','true');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:95';
  document.body.appendChild(cv); sizeCv(); addEventListener('resize',sizeCv); return cv;
}
function sizeCv(){ if(!cv) return; const r=Math.min(2,devicePixelRatio||1); cv.width=Math.round(innerWidth*r); cv.height=Math.round(innerHeight*r); cx=cv.getContext('2d'); cx.setTransform(r,0,0,r,0,0); }
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function star(c,r){ c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.45:r; c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr); } c.closePath(); c.fill(); }
function gearShape(c,r){ c.beginPath(); for(let i=0;i<24;i++){ const a=i*Math.PI/12, rr=(i%2?.72:1)*r; c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr); } c.closePath(); c.fill(); c.globalCompositeOperation='destination-out'; c.beginPath(); c.arc(0,0,r*.34,0,7); c.fill(); c.globalCompositeOperation='source-over'; }
function draw(now){
  const dt=Math.min(.04,(now-last)/1000||.016); last=now;
  cx.clearRect(0,0,innerWidth,innerHeight);
  parts=parts.filter(p=>p.life>0&&p.y<innerHeight+40);
  for(const p of parts){
    p.life-=dt; p.vy+=p.g*dt; p.vx*=p.drag; p.vy*=p.drag2; p.x+=p.vx*dt; p.y+=p.vy*dt; p.rot+=p.vr*dt;
    cx.save(); cx.globalAlpha=Math.max(0,Math.min(1,p.life*2.2)); cx.translate(p.x,p.y); cx.rotate(p.rot); cx.fillStyle=p.c;
    if(p.k==='r'){ cx.scale(1,Math.abs(Math.sin(p.rot*1.7+p.ph))*.9+.12); cx.fillRect(-p.s,-p.s*.5,p.s*2,p.s); }
    else if(p.k==='c'){ cx.beginPath(); cx.arc(0,0,p.s*.6,0,7); cx.fill(); }
    else if(p.k==='s') star(cx,p.s*1.4);
    else gearShape(cx,p.s*1.5);
    cx.restore();
  }
  if(parts.length) raf=requestAnimationFrame(draw); else { raf=0; cx.clearRect(0,0,innerWidth,innerHeight); }
}
function burst(x,y,colors,n,o){
  if(reduced()) return; canvas(); o=o||{};
  const kinds=o.kinds||['r','r','c','s','g'];
  for(let i=0;i<n;i++){
    const a=(o.dir!=null?o.dir:-Math.PI/2)+(Math.random()-.5)*(o.spread||Math.PI*1.7), sp=(o.speed||520)*(.35+Math.random()*.75);
    parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:o.g||900,drag:.992,drag2:.994,rot:Math.random()*6,vr:(Math.random()-.5)*14,ph:Math.random()*6,
      s:4+Math.random()*5.5,c:colors[i%colors.length],k:kinds[(Math.random()*kinds.length)|0],life:(o.life||2.1)*(.7+Math.random()*.5)});
  }
  if(!raf){ last=performance.now(); raf=requestAnimationFrame(draw); }
}
FX.burst=burst;
const centre=el=>{ const r=el.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2,r]; };
const DCOL=d=>css('--d-'+d)||'#2F7A4B';
const GOLD=['#F5C542','#FFE08A','#E0A81C'];

/* ---------------- a gear locks in ---------------- */
FX.gearTurned=(root,d)=>{
  const g=root.querySelector('.lvl-gear'); if(!g) return;
  FX.sfx('gear');
  g.classList.remove('cele'); void g.offsetWidth; g.classList.add('cele');
  const col=[DCOL(d),...GOLD,'#ffffff',DCOL(d)];
  setTimeout(()=>{ if(!document.body.contains(g)) return; const [x,y,r]=centre(g);
    const ring=document.createElement('i'); ring.className='shock'; ring.style.cssText=`left:${x}px;top:${y}px;--c:${DCOL(d)}`; document.body.appendChild(ring); setTimeout(()=>ring.remove(),1100);
    burst(x,y,col,70,{speed:640,g:820,spread:Math.PI*2,dir:0,kinds:['r','r','c','s','g','s']});
    setTimeout(()=>burst(x-r.width*.4,y+10,col,26,{speed:520,dir:-Math.PI*.78,spread:.9}),160);
    setTimeout(()=>burst(x+r.width*.4,y+10,col,26,{speed:520,dir:-Math.PI*.22,spread:.9}),160);
    const k=root.querySelector('.lvl-k'); if(k){ k.classList.remove('bump'); void k.offsetWidth; k.classList.add('bump'); }
  },1420);
};

/* ---------------- the mission is done ---------------- */
FX.missionDone=(root)=>{
  const gears=root.querySelector('.res-gears'), stars=root.querySelector('.res-stars b'), box=root.querySelector('.res');
  if(!gears) return;
  gears.classList.remove('cele'); void gears.offsetWidth; gears.classList.add('cele');
  const ds=['del','des','dis','dil'];
  ds.forEach((d,i)=>setTimeout(()=>{ if(!document.body.contains(gears)) return; FX.sfx('gearsLand',i);
    const [x,y]=centre(gears.querySelector('svg')||gears); burst(x+(i%2?24:-24),y+(i<2?-20:20),[DCOL(d),...GOLD],22,{speed:420,spread:Math.PI*2,dir:0,g:700,life:1.6});
  },380+i*430));
  setTimeout(()=>{ if(!document.body.contains(gears)) return; FX.sfx('fanfare');
    const w=innerWidth,h=innerHeight, cols=[DCOL('del'),DCOL('des'),DCOL('dis'),DCOL('dil'),...GOLD,'#fff'];
    burst(w*.2,h*.78,cols,80,{speed:900,g:900,dir:-Math.PI*.38,spread:.8});
    burst(w*.8,h*.78,cols,80,{speed:900,g:900,dir:-Math.PI*.62,spread:.8});
    setTimeout(()=>burst(w*.5,h*.35,cols,90,{speed:620,spread:Math.PI*2,dir:0,g:620,life:2.4,kinds:['r','c','s','s','g']}),380);
    if(box) box.classList.add('party');
    if(stars){ const to=+stars.dataset.to||0; let n=0; stars.textContent='0'; const stepT=Math.max(60,Math.min(160,900/Math.max(1,to)));
      const iv=setInterval(()=>{ if(!document.body.contains(stars)){clearInterval(iv);return} n++; stars.textContent=n; stars.classList.remove('bump'); void stars.offsetWidth; stars.classList.add('bump'); FX.sfx('ping',n); if(n>=to) clearInterval(iv); },stepT); if(to<=0) stars.textContent='0'; }
  },380+4*430+120);
};

/* ---------------- time passes: a clock whose hands tick, then spin ---------------- */
FX.clock=(root)=>{ const c=root&&root.querySelector&&root.querySelector('.clk'); if(c){ FX.sfx('clock'); } };

window.FX=FX;
})();
