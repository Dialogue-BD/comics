/* Phone mode: the whole screen is Ayesha's phone, and a guide teaches on top of it.
 *
 * On a narrow screen (< 900px) the coach panel steps aside. The phone fills
 * the screen, and a little gear (the guide) carries the coach's words in a
 * speech bubble: what to do, the 🔊, Back / Show me / Next. When a step has
 * a card (words, a story, a sort, a talk task), the guide pulls it up as a
 * sheet over the phone; drop it to see the phone again. When the step wants a
 * tap on the phone, a gold ring marks the spot and the guide moves out of its
 * way and looks at it.
 *
 * The guide is the four Ds' gear: it turns gold, teal, blue or red with the D
 * Ayesha is using, spins while it talks, and frowns when a risky choice plays
 * out. Nothing here changes the lessons: the engine still renders the coach
 * (#csay, #cbody, #cact, #dband); this file moves those pieces into the
 * bubble and the sheet, and puts them back if the screen gets wide again.
 */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NARROW=matchMedia('(max-width:899px)');
const COL={del:'#C98D2E',des:'#169486',dis:'#5B6CD3',dil:'#CC4B40',idle:'#B9924F'};

/* the guide: a 12-tooth gear (the same gear as the film and the coach's compass) with a face */
const GEAR=(()=>{ const N=12,T=360/N,R=36,A=7.5,rad=a=>a*Math.PI/180,pt=(r,a)=>`${(r*Math.cos(rad(a))).toFixed(2)} ${(r*Math.sin(rad(a))).toFixed(2)}`, p=[];
  for(let k=0;k<N;k++){const c=k*T; p.push(`${k?'L':'M'}${pt(R-A,c-.36*T)}`,`L${pt(R+A,c-.17*T)}`,`A${R+A} ${R+A} 0 0 1 ${pt(R+A,c+.17*T)}`,`L${pt(R-A,c+.36*T)}`,`A${R-A} ${R-A} 0 0 1 ${pt(R-A,c+.64*T)}`)}
  return p.join('')+'Z'; })();
const COG=`<svg viewBox="-50 -50 100 100" aria-hidden="true">
  <ellipse class="g-shadow" cx="0" cy="47" rx="26" ry="4"/>
  <g class="g-body"><g class="g-teeth"><path d="${GEAR}"/><circle r="31" class="g-rim"/></g>
   <circle r="26" class="g-face"/>
   <g class="g-eyes"><g class="g-eye" transform="translate(-9 -4)"><ellipse rx="4.2" ry="5.4" class="g-white"/><circle r="2.6" class="g-pupil"/></g>
    <g class="g-eye" transform="translate(9 -4)"><ellipse rx="4.2" ry="5.4" class="g-white"/><circle r="2.6" class="g-pupil"/></g></g>
   <path class="g-brow" d="M-14 -11 Q-10 -14 -5 -16 M14 -11 Q10 -14 5 -16"/>
   <path class="g-smile" d="M-8 8 Q0 15 8 8"/><ellipse class="g-mouth" cx="0" cy="10" rx="5" ry="3.6"/>
   <circle class="g-cheek" cx="-15" cy="6" r="3.4"/><circle class="g-cheek" cx="15" cy="6" r="3.4"/></g></svg>`;

let on=false, wrap, bub, cog, spot, scrim, chip, hubBox, top, homes=[], obs=null, raf=0, lastKey='', minimised=false, hubSheet=false, lastPlace='';

function build(){
  if(wrap) return;
  const coach=$('#coach');
  scrim=document.createElement('div'); scrim.id='gscrim';
  wrap=document.createElement('div'); wrap.id='gwrap';
  wrap.innerHTML=`<button id="cog" type="button" aria-label="Guide — hide or show what it says">${COG}<span class="g-dot" aria-hidden="true"></span></button>
   <div id="gbub" role="region" aria-label="Guide">
    <div class="gb-top"><span class="gb-d"></span><span class="grow"></span><button type="button" class="gb-bn" data-tour="bn" lang="bn" aria-label="বাংলা subtitles">বাংলা</button><button type="button" class="gb-menu" data-tour="menu" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>
    <div class="gb-hub"></div>
    <button type="button" class="gb-card" data-tour="card"></button>
   </div>`;
  coach.appendChild(scrim); coach.appendChild(wrap);
  bub=$('#gbub',wrap); cog=$('#cog',wrap); chip=$('.gb-card',wrap); hubBox=$('.gb-hub',wrap); top=$('.gb-d',wrap);
  spot=document.createElement('div'); spot.id='gspot'; spot.innerHTML='<i></i><i></i>'; document.body.appendChild(spot);
  coach.addEventListener('click',onClick);
  scrim.addEventListener('click',()=>sheet(false));
  talkingHook();
}

/* move the engine's pieces into the bubble (and back) — they keep their ids, so the engine never notices */
function adopt(){
  homes=[];
  const put=(el,where,before)=>{ const mark=document.createComment('tour:'+el.id); el.parentNode.insertBefore(mark,el); homes.push([el,mark]); where.insertBefore(el,before||null); };
  put($('#dband'),top);
  put($('#csay'),bub,hubBox);
  put($('#cact'),bub);
}
function release(){ homes.forEach(([el,mark])=>{ mark.parentNode.insertBefore(el,mark); mark.remove(); }); homes=[]; }

function enable(){
  if(on) return; on=true; build(); adopt(); document.body.classList.add('tour');
  obs=new MutationObserver(()=>schedule());
  [$('#csay'),$('#cbody'),$('#screen'),$('#cact')].forEach(n=>obs.observe(n,{childList:true,subtree:true,characterData:true}));
  obs.observe($('#coach'),{attributes:true,attributeFilter:['class']}); obs.observe(document.body,{attributes:true,attributeFilter:['class']});
  obs.observe($('#kb'),{attributes:true,attributeFilter:['hidden']});
  addEventListener('resize',schedule); addEventListener('scroll',schedule,true);
  sync(true); loop();
}
function disable(){
  if(!on) return; on=false; if(obs) obs.disconnect(); obs=null; clearTimeout(raf);
  removeEventListener('resize',schedule); removeEventListener('scroll',schedule,true);
  release(); document.body.classList.remove('tour','tour-hub','tour-sheet','tour-cq'); spot.classList.remove('on');
}
let pending=false; function schedule(){ if(pending||!on) return; pending=true; requestAnimationFrame(()=>{pending=false; sync(false)}); }

/* ---------- what the guide shows ---------- */
function state(){
  const coach=$('#coach'), inLesson=document.body.classList.contains('inlesson');
  const band=$('#dband'); const d=(band&&!band.hidden&&(band.className.match(/\bd-(del|des|dis|dil)\b/)||[])[1])||'idle';
  const hasCard=inLesson&&!coach.classList.contains('no-sheet')&&!!$('#cbody').children.length;
  const cq=$('#csay').classList.contains('cq');
  return {inLesson,d,hasCard,cq,up:coach.classList.contains('sheet-up')};
}
function sync(first){
  const s=state(), body=document.body;
  body.classList.toggle('tour-hub',!s.inLesson);
  body.classList.toggle('tour-cq',s.cq);
  wrap.style.setProperty('--gc',COL[s.d]); spot.style.setProperty('--gc',COL[s.d]==='#B9924F'?'#E8C979':COL[s.d]);
  wrap.dataset.d=s.d;
  // a new step: the guide hops, the bubble comes back if it was tucked away
  const key=(location.hash||'')+'|'+($('#csay').textContent||'').slice(0,60);
  if(key!==lastKey){ const was=lastKey; lastKey=key; if(was){ minimised=false; hop(); } if(!s.inLesson) hubSheet=false; }
  wrap.classList.toggle('min',minimised);
  // the hub: Ayesha's lock screen, her notifications start the workflows; the rest is one tap away
  if(!s.inLesson){
    hubBox.innerHTML=`<div class="sayrow"><p class="say">This is Ayesha’s phone. Learn AI — and English — by doing real tasks.</p><button class="ear" data-speak="This is Ayesha’s phone. Learn AI, and English, by doing real tasks." aria-label="Listen">🔊</button></div>
      <span class="bn" lang="bn">এটা আয়েশার ফোন। বাস্তব কাজ করে করে AI — আর ইংরেজি — শেখো।</span>
      <p class="gb-hint">Tap a notification to start a workflow.<span class="bn" lang="bn">শুরু করতে একটা নোটিফিকেশনে চাপো।</span></p>
      <div class="gb-row"><button class="btn gold" data-c="intro">▶ Watch the four Ds</button><button class="btn quiet" data-tour="card">More</button></div>`;
    $('#coach').classList.toggle('sheet-up',hubSheet);
    const cb=$('#cbody'); if(cb.firstElementChild&&!cb.firstElementChild.matches('.peek')){ const pk=document.createElement('button'); pk.className='peek'; pk.dataset.tour='hide'; pk.innerHTML='<span class="pl">Start here</span><span class="pc">▲</span>'; cb.prepend(pk); }
  } else if(hubBox.innerHTML) hubBox.innerHTML='';
  // the card chip: what the sheet holds, when it is down
  const pl=$('#cbody .peek .pl');
  chip.hidden=!(s.inLesson&&s.hasCard&&!s.up);
  if(!chip.hidden) chip.innerHTML=`<span class="gc-ic">▲</span><span class="gc-l">${pl?pl.innerHTML:'Open the card'}</span>`;
  body.classList.toggle('tour-sheet',(s.inLesson?s.hasCard&&s.up:hubSheet));
  place(s);
}

/* the spot the step wants tapped, if any */
function target(){
  if(!document.body.classList.contains('inlesson')){ return $('#screen [data-hit^="start:"]'); }
  try{ const x=AFL.ctx(), b=x.beat; let t=typeof b.tap==='function'?b.tap(x):b.tap; if(!t) return null; t=[].concat(t);
    for(const id of t){ const el=$(`#screen [data-hit="${CSS.escape(id)}"]`); if(el&&el.getClientRects().length) return el; } }catch(e){}
  return null;
}
function place(s){
  const sheetUp=document.body.classList.contains('tour-sheet');
  const el=sheetUp?null:target(); let r=el&&el.getBoundingClientRect();
  if(r&&(r.width<2||r.bottom<0||r.top>innerHeight)) r=null;
  // the ring
  if(r){ const pad=6; Object.assign(spot.style,{left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+2*pad)+'px',height:(r.height+2*pad)+'px'}); spot.classList.add('on'); }
  else spot.classList.remove('on');
  // the guide keeps out of the way: up top when the spot (or the keyboard) is in the lower half
  const kb=$('#kb'), kbUp=kb&&!kb.hidden, typing=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('#screen textarea,#screen input');
  // everything on the phone the student may need to reach this step: the spot, options, chips, the text box
  const need=[...(r?[r,r,r,r,r,r]:[]),...$$('#screen [data-ui^="opt:"],#screen [data-ui^="pick:"],#screen [data-ui^="chip:"],#screen textarea').map(e=>e.getBoundingClientRect()).filter(q=>q.width>2&&q.bottom>0&&q.top<innerHeight)];
  const h=bub.offsetHeight+16, lo=innerHeight-h-34, hi=34+h;
  const cover=(a,b)=>need.reduce((t,q)=>t+Math.max(0,Math.min(q.bottom,b)-Math.max(q.top,a))*q.width,0);
  const up=!sheetUp&&(kbUp||typing||(need.length?cover(34,hi)<cover(lo,innerHeight):false));
  const where=up?'top':'bottom';
  if(where!==lastPlace){ wrap.classList.toggle('at-top',up); lastPlace=where; }
  // over a card the guide sits on the sheet's top edge
  const sh=$('#cbody'); const sheetH=sheetUp?Math.max(0,innerHeight-sh.getBoundingClientRect().top):0;
  wrap.style.setProperty('--lift',sheetH+'px');
  document.documentElement.style.setProperty('--gbh',(wrap.offsetHeight||0)+'px');
  // the guide watches the spot
  const c=cog.getBoundingClientRect(), cx=c.left+c.width/2, cy=c.top+c.height/2;
  let lx=0,ly=0; if(r){ const dx=r.left+r.width/2-cx, dy=r.top+r.height/2-cy, m=Math.hypot(dx,dy)||1; lx=dx/m*2.4; ly=dy/m*2.4; }
  wrap.style.setProperty('--lx',lx.toFixed(2)); wrap.style.setProperty('--ly',ly.toFixed(2));
}
function loop(){ if(!on) return; place(state()); raf=setTimeout(()=>requestAnimationFrame(loop),200); }

function hop(){ cog.classList.remove('hop'); void cog.offsetWidth; cog.classList.add('hop'); bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop'); }
function sheet(up){
  if(!document.body.classList.contains('inlesson')){ hubSheet=up; sync(false); return; }
  const coach=$('#coach'), pk=$('#cbody .peek');
  if(coach.classList.contains('sheet-up')!==up&&pk) pk.click(); else coach.classList.toggle('sheet-up',up);
}
function onClick(e){
  if(e.target.closest('#gwrap #cog')){ minimised=!minimised; wrap.classList.toggle('min',minimised); schedule(); return; }
  const t=e.target.closest('[data-tour]'); if(!t) return;
  const a=t.dataset.tour;
  if(a==='card') sheet(true);
  else if(a==='hide') sheet(false);
  else if(a==='menu') $('#btn-menu').click();
  else if(a==='bn') (document.body.classList.contains('bangla')?$('#lang-en'):$('#lang-bn')).click();
}

/* the guide talks while a line plays */
function talkingHook(){
  const P=HTMLMediaElement.prototype, play=P.play;
  P.play=function(){ const a=this; if(a.closest&&a.closest('#intro')) return play.apply(this,arguments);
    const done=()=>{ document.body.classList.remove('g-talk'); a.removeEventListener('ended',done); a.removeEventListener('pause',done); };
    document.body.classList.add('g-talk'); a.addEventListener('ended',done); a.addEventListener('pause',done);
    const r=play.apply(this,arguments); if(r&&r.catch) r.catch(done); return r; };
  try{ const sp=speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak=u=>{ document.body.classList.add('g-talk'); const end=u.onend; u.onend=e=>{ if(!speechSynthesis.pending) document.body.classList.remove('g-talk'); end&&end(e); }; sp(u); }; }catch(e){}
}

function check(){ (NARROW.matches&&!document.body.classList.contains('stage'))?enable():disable(); }
NARROW.addEventListener?NARROW.addEventListener('change',check):NARROW.addListener(check);
new MutationObserver(check).observe(document.body,{attributes:true,attributeFilter:['class']});
if(document.readyState==='loading') addEventListener('DOMContentLoaded',check); else setTimeout(check,0);
window.TOUR={enable,disable,sync:()=>schedule()};
})();
