/* Phone mode (screens under 900px): two clear places, one job at a time.
 *
 *   💬 Coach — a chat with Cog, the gear guide. Each step is one spoken line,
 *              the task card under it (words, story, sort, talk), and one big
 *              button. Earlier lines stay above, to scroll back and hear again.
 *   📱 Ayesha's phone — the phone fills the screen. A dark strip above it says
 *              the one thing to do now (🔊, Show me, Next); a gold ring marks
 *              where to tap. Nothing from the lesson sits on top of the phone.
 *
 * A tab bar switches between them. Each step opens in the right place by itself,
 * and a pulsing dot marks where the next action is. Nothing is locked: Next is
 * always there.
 *
 * The engine is untouched: it still renders #csay, #cbody, #cact and the phone.
 * This file moves #csay and #cbody into the chat, uses the engine's own
 * data-c buttons (back / show / next / rewind), and puts everything back if the
 * screen becomes wide.
 */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NARROW=matchMedia('(max-width:899px)');
const COL={del:'#C98D2E',des:'#169486',dis:'#5B6CD3',dil:'#CC4B40',idle:'#B9924F'};
const NAME={del:'Delegation',des:'Description',dis:'Discernment',dil:'Diligence'};
const MAJOR=['words','story','phrases','sort','choice','checklist','pickeach'];

/* Cog: one of the four Ds' gears — chunky machined teeth in the D's colour, the
   film's gold hub for a face. It turns while it talks and frowns at risky choices. */
const GEAR=(()=>{ const N=12,T=360/N,R=42,A=6,rad=a=>a*Math.PI/180,pt=(r,a)=>`${(r*Math.cos(rad(a))).toFixed(2)} ${(r*Math.sin(rad(a))).toFixed(2)}`, p=[];
  for(let k=0;k<N;k++){const c=k*T; p.push(`${k?'L':'M'}${pt(R-A,c-.33*T)}`,`L${pt(R+A,c-.21*T)}`,`A${R+A} ${R+A} 0 0 1 ${pt(R+A,c+.21*T)}`,`L${pt(R-A,c+.33*T)}`,`A${R-A} ${R-A} 0 0 1 ${pt(R-A,c+.67*T)}`)}
  return p.join('')+'Z'; })();
const HOLES=Array.from({length:6},(_,i)=>{const a=(i*60+30)*Math.PI/180;return `<circle cx="${(30.5*Math.cos(a)).toFixed(1)}" cy="${(30.5*Math.sin(a)).toFixed(1)}" r="3.6"/>`}).join('');
const COG=`<svg class="cog" viewBox="-50 -50 100 100" aria-hidden="true"><defs>
  <radialGradient id="cogHi" cx="34%" cy="26%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  <radialGradient id="cogHub" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="#FFF8DE"/><stop offset=".45" stop-color="#EBCB82"/><stop offset="1" stop-color="#A27830"/></radialGradient></defs>
  <g class="g-teeth"><path d="${GEAR}" class="g-body"/><path d="${GEAR}" fill="url(#cogHi)"/><g class="g-holes">${HOLES}</g><circle r="24.5" class="g-ring"/></g>
  <circle r="22.5" class="g-face" fill="url(#cogHub)"/>
  <g class="g-eyes"><rect x="-10" y="-9" width="6" height="9.5" rx="3"/><rect x="4" y="-9" width="6" height="9.5" rx="3"/></g>
  <g class="g-glint"><circle cx="-7.6" cy="-6.6" r="1.4"/><circle cx="6.4" cy="-6.6" r="1.4"/></g>
  <path class="g-brow" d="M-13 -14 L-4 -17 M13 -14 L4 -17"/>
  <path class="g-smile" d="M-6 5.5 Q0 10.5 6 5.5"/><ellipse class="g-mouth" cx="0" cy="7.5" rx="4" ry="3"/></svg>`;
const ICO={home:'<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 18.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  hand:'<svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1V4.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0V15c0 3.5-2.5 6-6 6h-1c-2 0-3.3-.8-4.4-2.2L4 15.2c-.7-.9-.4-2.1.6-2.6.8-.4 1.7-.2 2.3.5L9 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:'<svg viewBox="0 0 24 24"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M19 12H6m5-6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};

let on=false, E={}, homes=[], obs=null, timer=0, mode='coach', stepKey='', lastSay='', plan={}, hubWas=false, typingT=0, phoneSig='', phoneNew=false;
const sigOf=()=>{ const sc=$('#screen'); const t=(sc&&sc.textContent||'').replace(/\s+/g,' ').trim(); return t.length+':'+t.slice(0,240); };

function build(){
  if(E.head) return;
  const coach=$('#coach'), mk=(tag,id,html,cls)=>{const n=document.createElement(tag); if(id) n.id=id; if(cls) n.className=cls; n.innerHTML=html||''; return n;};
  E.head=mk('header','fhead',`<button class="fh-btn" data-flow="home" aria-label="Ayesha's lock screen">${ICO.home}</button>
    <div class="fh-mid"><span class="fh-cog">${COG}</span><span class="fh-tx"><b class="fh-title"></b><small class="fh-sub"></small></span></div>
    <button class="fh-bn" data-flow="bn" lang="bn" aria-label="বাংলা">বাংলা</button><button class="fh-btn" data-flow="menu" aria-label="Menu">${ICO.menu}</button>
    <div class="fh-prog"><i></i></div>`);
  E.strip=mk('div','fstrip',`<div class="fs-row"><span class="fs-cog">${COG}</span><div class="fs-tx"><p class="fs-say"></p><p class="fs-bn" lang="bn"></p><div class="fs-fb"></div></div><button class="fs-ear ear" data-speak="" aria-label="Listen">🔊</button></div><div class="fs-panel"></div><div class="fs-act"></div>`);
  E.gap=mk('div','fgap');
  E.thread=mk('div','fthread',`<div id="fhist"></div><div id="flive"><div class="fm"><span class="fm-cog">${COG}</span><div class="fm-b" id="fsay"><div class="fm-typing" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><div class="fthread-end"></div>`);
  E.bar=mk('div','fbar');
  E.tabs=mk('nav','ftabs',`<button data-flow="coach" aria-label="Coach">${ICO.chat}<span>Coach</span><i class="ft-dot"></i></button><button data-flow="phone" aria-label="Ayesha's phone">${ICO.phone}<span>Ayesha’s phone</span><i class="ft-dot"></i></button>`);
  E.spot=mk('div','fspot','<i></i><i></i>');
  [E.head,E.strip,E.gap,E.thread,E.bar,E.tabs].forEach(n=>coach.appendChild(n));
  document.body.appendChild(E.spot);
  coach.addEventListener('click',onClick);
  talkingHook();
}
/* the engine's pieces move into the chat; they keep their ids, so the engine never notices */
function adopt(){
  homes=[];
  const put=(el,where,before)=>{ const mark=document.createComment('flow:'+el.id); el.parentNode.insertBefore(mark,el); homes.push([el,mark]); where.insertBefore(el,before||null); };
  put($('#csay'),$('#fsay'));
  put($('#cbody'),$('#flive'));
}
function release(){ homes.forEach(([el,mark])=>{ mark.parentNode.insertBefore(el,mark); mark.remove(); }); homes=[]; }

function enable(){
  if(on) return; on=true; build(); adopt(); document.body.classList.add('flow');
  obs=new MutationObserver(schedule);
  [$('#csay'),$('#cbody'),$('#screen'),$('#cact')].forEach(n=>obs.observe(n,{childList:true,subtree:true,characterData:true}));
  obs.observe($('#csay'),{attributes:true,subtree:true,attributeFilter:['class']});
  obs.observe($('#coach'),{attributes:true,attributeFilter:['class']}); obs.observe(document.body,{attributes:true,attributeFilter:['class']});
  addEventListener('resize',schedule);
  stepKey=''; sync(); tick();
}
function disable(){
  if(!on) return; on=false; if(obs) obs.disconnect(); obs=null; clearTimeout(timer); removeEventListener('resize',schedule);
  release(); document.body.classList.remove('flow','flow-phone','flow-coach','flow-hub','flow-cq'); E.spot.classList.remove('on');
}
let pend=false; function schedule(){ if(pend||!on) return; pend=true; requestAnimationFrame(()=>{pend=false; sync()}); }

/* ---------- reading the step ---------- */
const fnv=(v,x)=>typeof v==='function'?v(x):v;
function readStep(){
  const inLesson=document.body.classList.contains('inlesson');
  const cq=$('#csay').classList.contains('cq');
  if(!inLesson) return {inLesson,cq:false,key:'hub'};
  let x=null,b={},L=null,beat=0; try{ x=AFL.ctx(); b=x.beat; L=x.L; beat=L.beats.indexOf(b); }catch(e){}
  const c=(x&&fnv(b.card,x))||{}, talk=!!b.talk;
  const major=MAJOR.includes(c.type)||talk;
  const act=!!(b.tap||b.compose||b.decide||b.check||$('#screen [data-ui^="opt:"],#screen [data-ui^="pick:"]'));
  const cards=$$('#cbody > :not(.peek)').some(n=>!n.matches('.dshift,.note,.good,.warn'));
  const dd=x&&fnv(b.decide,x); let decided=!!(dd&&x.get(dd.key)!=null);
  if(b.check&&x){ const v=x.get(b.check.key,{}); decided=Object.keys(v).length>=b.check.lines.length; }
  const d=((($('#dband')||{}).className||'').match(/\bd-(del|des|dis|dil)\b/)||[])[1]||'idle';
  const stage=L&&(L.stages.find(s=>s.id===b.stage)||{}).label||'';
  return {inLesson,cq,x,b,L,beat,total:L?L.beats.length:1,major,act,cards,decided,d,stage,title:L?L.title:'',key:(location.hash||'')+(cq?'|cq':'')};
}

/* ---------- drawing ---------- */
function sync(){
  if(!on) return;
  const s=readStep(), body=document.body;
  body.classList.toggle('flow-hub',!s.inLesson); body.classList.toggle('flow-cq',!!s.cq);
  // a new step: keep the last line in the history, open the right place, type the new line in
  if(s.key!==stepKey){
    const prev=stepKey; stepKey=s.key;
    if(prev&&prev!=='hub'&&lastSay) pushHistory(lastSay);
    if(!s.inLesson){ if(prev&&prev!=='hub'){ $('#fhist').innerHTML=''; } setMode('phone'); }
    else { const sig=sigOf(), was=mode; phoneNew=!!prev&&sig!==phoneSig; phoneSig=sig; plan=s;
      // a tap on the phone that changed what the phone shows: stay and look first, then the coach
      const lookFirst=was==='phone'&&phoneNew&&prev!=='hub';
      setMode(s.cq||s.act||lookFirst?'phone':(s.major||s.cards)?'coach':'phone'); typing(); }
  }
  if(s.inLesson){ const say=$('#csay'); if(say.textContent.trim()) lastSay=say.innerHTML; }
  // header
  const c=COL[s.d||'idle'];
  $('#coach').style.setProperty('--gc',c); E.spot.style.setProperty('--gc',c==='#B9924F'?'#E8C979':c);
  $('.fh-title',E.head).textContent=s.inLesson?s.title:'Ayesha’s phone';
  $('.fh-sub',E.head).innerHTML=s.inLesson?`${esc(s.stage)}${s.d&&s.d!=='idle'?` · <em style="color:${c}">${NAME[s.d]}</em>`:''}`:'AI Fluency Lab';
  $('.fh-prog i',E.head).style.width=s.inLesson?Math.round((s.beat+1)/s.total*100)+'%':'0%';
  // the strip over the phone: the one thing to do now
  const sayEl=$('#csay .say'), bnEl=$('#csay > .bn, #csay .sayrow + .bn');
  let say=s.inLesson?(sayEl?sayEl.textContent:''):'Tap a notification to start a workflow.';
  let bn=s.inLesson?(bnEl?bnEl.textContent:''):'শুরু করতে একটা নোটিফিকেশনে চাপো।';
  { const w=s.cq&&$('#csay .cqw'); $('.fs-tx',E.strip).dataset.when=w?w.textContent.replace('⏩','').trim():''; }
  $('.fs-say',E.strip).textContent=say; $('.fs-bn',E.strip).textContent=bn;
  $('.fs-ear',E.strip).dataset.speak=s.inLesson?(sayEl?sayEl.textContent:''):'Tap a notification to start a workflow.';
  const nx=$('#cact [data-c=next]'), sh=$('#cact [data-c=show]'), rw=$('#cact [data-c=rewind]');
  const nlabel=nx?nx.textContent.trim():'Next';
  let fa='';
  if(!s.inLesson) fa=`<button class="fs-b gold" data-c="intro">▶ Watch the four Ds</button><button class="fs-b" data-flow="coach">More</button>`;
  else if(s.cq) fa=`${rw?`<button class="fs-b gold" data-c="rewind">↩ Choose again</button>`:''}<button class="fs-b" data-flow="coach">${ICO.chat}What went wrong?</button>`;
  else { const pl=$('#cbody .peek .pl'), lab=pl?pl.textContent.trim():'Coach', nextMain=!s.act||s.decided;
    if(!s.act&&(s.major||s.cards)) fa=`<button class="fs-b gold" data-flow="coach">${ICO.chat}<span>${esc(lab)}</span></button><button class="fs-b next quiet" data-c="next">${esc(nlabel)}${ICO.next}</button>`;
    else fa=`${sh&&!s.decided?`<button class="fs-b" data-c="show">${ICO.hand}Show me</button>`:''}${(s.cards||s.major)&&!(s.b&&s.b.check)?`<button class="fs-b" data-flow="coach">${ICO.chat}<span>${esc(lab)}</span></button>`:''}<button class="fs-b next${nextMain?'':' quiet'}" data-c="next">${esc(nlabel)}${ICO.next}</button>`; }
  { const v=s.decided&&$('#cbody > .good, #cbody > .warn, #cbody > .note'), box=$('.fs-fb',E.strip), h=v?`<div class="${v.className}">${v.innerHTML}</div>`:'';
    if(box.dataset.v!==h){ box.innerHTML=h; box.dataset.v=h; } }
  { const pn=$('.fs-panel',E.strip); let h='';
    if(s.inLesson&&s.b&&s.b.check){ h=$$('#cbody > :not(.peek):not(.dshift):not(.note):not(.docstrip)').map(n=>n.outerHTML).join(''); }
    if(pn.dataset.v!==h){ pn.innerHTML=h; pn.dataset.v=h; } }
  if($('.fs-act',E.strip).dataset.v!==fa){ $('.fs-act',E.strip).innerHTML=fa; $('.fs-act',E.strip).dataset.v=fa; }
  // a wrong tap: the coach's line shakes; so does the strip
  if(sayEl&&sayEl.classList.contains('nudge')&&!E.strip.classList.contains('nudge')){ E.strip.classList.add('nudge'); setTimeout(()=>{E.strip.classList.remove('nudge'); sayEl.classList.remove('nudge');},600); }
  // the chat's big button
  let fb='';
  if(!s.inLesson) fb=`<button class="fb-main" data-flow="phone">${ICO.phone}<span>Go to Ayesha’s phone</span></button>`;
  else if(s.cq) fb=`<button class="fb-back" data-c="back" aria-label="Back">${ICO.back}</button>${rw?`<button class="fb-main gold" data-c="rewind">↩ Choose again</button>`:''}<button class="fb-main${rw?' quiet':''}" data-c="next">${esc(nlabel)}${ICO.next}</button>`;
  else if(s.act) fb=`<button class="fb-back" data-c="back" aria-label="Back">${ICO.back}</button><button class="fb-main gold" data-flow="phone">${ICO.phone}<span>${s.act?'Now on the phone':'Look at the phone'}</span></button><button class="fb-skip" data-c="next" aria-label="${esc(nlabel)}">${ICO.next}</button>`;
  else fb=`<button class="fb-back" data-c="back" aria-label="Back">${ICO.back}</button><button class="fb-main" data-c="next"><span>${esc(nlabel)}</span>${ICO.next}</button>`;
  if(E.bar.dataset.v!==fb){ E.bar.innerHTML=fb; E.bar.dataset.v=fb; }
  // tab dots: where the next action is
  const tc=$('[data-flow=coach]',E.tabs), tp=$('[data-flow=phone]',E.tabs);
  tc.classList.toggle('on',mode==='coach'); tp.classList.toggle('on',mode==='phone');
  tc.classList.toggle('need',mode!=='coach'&&(s.inLesson?(s.major||s.cq||(!s.act&&s.cards)):false));
  tp.classList.toggle('need',mode!=='phone'&&(s.inLesson?s.act&&!s.cq:true));
  measure(); place(s);
}
function esc(t){ return String(t||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function setMode(m){
  mode=m; document.body.classList.toggle('flow-phone',m==='phone'); document.body.classList.toggle('flow-coach',m==='coach');
  if(m==='coach') requestAnimationFrame(toTop);
  schedule();
}
/* the new step sits at the top of the chat; earlier lines are a scroll away */
function toTop(){ const live=$('#flive'), th=E.thread, end=$('.fthread-end',th); if(!live||!th) return;
  end.style.height=Math.max(0,th.clientHeight-live.offsetHeight-36)+'px';
  th.style.scrollBehavior='auto'; th.scrollTop=Math.max(0,live.offsetTop-14); th.style.scrollBehavior=''; }
function pushHistory(html){
  const n=document.createElement('div'); n.className='fm old';
  n.innerHTML=`<span class="fm-cog">${COG}</span><div class="fm-b">${html}</div>`;
  $$('button:not(.ear)',n).forEach(b=>b.remove());
  $('#fhist').appendChild(n);
  const h=$('#fhist'); while(h.children.length>30) h.firstChild.remove();
}
function typing(){
  const f=$('#flive'); f.classList.remove('in'); f.classList.add('typing'); clearTimeout(typingT);
  typingT=setTimeout(()=>{ f.classList.remove('typing'); f.classList.add('in'); toTop(); },520); toTop();
}
/* Ayesha's phone is drawn as a phone: a framed handset, a little smaller than the screen
   (laid out ~400px wide like a real phone, shown at 90%), so it reads as "her phone", not ours */
const ZOOM=.9;
function measure(){
  const top=(mode==='phone'?E.strip.getBoundingClientRect().bottom:E.head.getBoundingClientRect().bottom), bot=E.tabs.offsetHeight;
  const R=document.documentElement.style; R.setProperty('--ftop',Math.round(top)+'px'); R.setProperty('--fbot',Math.round(bot)+'px');
  const aw=innerWidth, ah=innerHeight-top-bot;
  const w=Math.round((aw-34)/ZOOM), h=Math.round((ah-26)/ZOOM);
  R.setProperty('--dw',w+'px'); R.setProperty('--dh',h+'px'); R.setProperty('--dz',ZOOM);
}
/* the spot the step wants tapped */
function target(){
  if(!document.body.classList.contains('inlesson')) return $('#screen [data-hit^="start:"]');
  try{ const x=AFL.ctx(), b=x.beat; let t=fnv(b.tap,x); if(!t) return null;
    // a message to build first: no ring on Send until there is something to send
    const cm=b.compose&&fnv(b.compose,x); if(cm&&!String(x.get(cm.key,'')||'').trim()&&[].concat(t).some(id=>/^send/.test(id))) return null;
    for(const id of [].concat(t)){ const el=$(`#screen [data-hit="${CSS.escape(id)}"]`); if(el&&el.getClientRects().length) return el; } }catch(e){}
  return null;
}
let scrolledFor='';
/* bring the spot into view inside the phone (its own screen scrolls, the page never does) */
function reveal(el){
  const dev=$('#device').getBoundingClientRect(), r=el.getBoundingClientRect();
  if(r.top>=dev.top+40&&r.bottom<=dev.bottom-30) return;
  let p=el.parentElement; const sc=$('#screen');
  while(p&&p!==sc.parentElement){ const o=getComputedStyle(p).overflowY; if((o==='auto'||o==='scroll')&&p.scrollHeight>p.clientHeight+2) break; p=p.parentElement; }
  if(!p||p===sc.parentElement) return;
  const pr=p.getBoundingClientRect(), z=dev.width/($('#device').offsetWidth||dev.width);
  p.scrollTop+= ((r.top+r.height/2)-(pr.top+pr.height/2))/z;
}
function place(){
  const el=mode==='phone'?target():null;
  if(el&&scrolledFor!==stepKey){ scrolledFor=stepKey; reveal(el); }
  let r=el&&el.getBoundingClientRect();
  const dv=$('#device').getBoundingClientRect();
  if(r&&(r.width<2||r.bottom<dv.top+20||r.top>dv.bottom-12)) r=null;
  if(r){ const p=6; Object.assign(E.spot.style,{left:(r.left-p)+'px',top:(r.top-p)+'px',width:(r.width+2*p)+'px',height:(r.height+2*p)+'px'}); E.spot.classList.add('on'); }
  else E.spot.classList.remove('on');
}
function tick(){ if(!on) return; measure(); place(); timer=setTimeout(tick,250); }

function onClick(e){
  const t=e.target.closest('[data-flow]'); if(!t) return;
  const a=t.dataset.flow;
  if(a==='coach'||a==='phone') setMode(a);
  else if(a==='home'){ if(document.body.classList.contains('inlesson')) AFL.hub(); else setMode('phone'); }
  else if(a==='menu') $('#btn-menu').click();
  else if(a==='bn') (document.body.classList.contains('bangla')?$('#lang-en'):$('#lang-bn')).click();
}
/* Cog talks while a line plays */
let hooked=false;
function talkingHook(){
  if(hooked) return; hooked=true;
  const P=HTMLMediaElement.prototype, play=P.play;
  P.play=function(){ const a=this; if(a.closest&&a.closest('#intro')) return play.apply(this,arguments);
    const done=()=>{ document.body.classList.remove('g-talk'); a.removeEventListener('ended',done); a.removeEventListener('pause',done); };
    document.body.classList.add('g-talk'); a.addEventListener('ended',done); a.addEventListener('pause',done);
    const r=play.apply(this,arguments); if(r&&r.catch) r.catch(done); return r; };
  try{ const sp=speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak=u=>{ document.body.classList.add('g-talk'); const end=u.onend; u.onend=ev=>{ if(!speechSynthesis.pending) document.body.classList.remove('g-talk'); end&&end(ev); }; sp(u); }; }catch(e){}
}

function check(){ (NARROW.matches&&!document.body.classList.contains('stage'))?enable():disable(); }
NARROW.addEventListener?NARROW.addEventListener('change',check):NARROW.addListener(check);
new MutationObserver(check).observe(document.body,{attributes:true,attributeFilter:['class']});
if(document.readyState==='loading') addEventListener('DOMContentLoaded',check); else setTimeout(check,0);
window.TOUR={enable,disable,mode:m=>setMode(m),sync:schedule};
})();
