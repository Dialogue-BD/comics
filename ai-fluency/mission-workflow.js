/* A route through the four Ds, followed by the whole mechanism turning.
   This is a recap of one mission, not a prescribed order for every task. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const text=(en,bn,on)=>esc(en)+(on?`<span class="bn" lang="bn">${esc(bn)}</span>`:'');
const POS={des:[49.09,100],del:[100,49.09],dis:[150.91,100],dil:[100,150.91]};
const path=(steps,i)=>{
 const a=i?POS[steps[i-1].d]:[100,100],b=POS[steps[i].d];
 const c=i===3?[100,65]:i===4?[100,135]:[100,100];
 return `M${a} Q${c} ${b}`;
};
let live=null;
function html(steps,bn){
 return `<section class="mission-workflow" aria-label="${bn?'চার গিয়ারে আয়েশার পথ':'Ayesha’s route through the four gears'}" data-bn="${bn?'1':'0'}">
  <header><small>${text('Mission complete · look back','মিশন সম্পূর্ণ · ফিরে দেখো',bn)}</small>
   <h2>${text('Four gears. One honest CV.','চারটি গিয়ার। একটি সৎ CV।',bn)}</h2>
   <p>${text('There is no fixed order. Each gear informs the others.','কোনো বাঁধা ক্রম নেই। প্রতিটি গিয়ার অন্যগুলোকে পথ দেখায়।',bn)}</p></header>
  <div class="wf-layout"><div class="wf-picture">
   ${D4.svg({on:'all',loops:true,sweet:true,labels:true,title:'Delegation, Description, Discernment and Diligence work together'})}
   <svg class="wf-trace" viewBox="0 0 200 200" aria-hidden="true">${steps.map((s,i)=>`<path class="wf-link" data-link="${i}" d="${path(steps,i)}"/>`).join('')}<circle class="wf-push" r="3.5"/></svg>
  </div><div class="wf-story"><div class="wf-caption" aria-live="polite" aria-atomic="true"></div>
   <div class="wf-controls"><button type="button" data-wf="play"></button><button type="button" data-wf="all">${text('See all four together','চারটিকে একসাথে দেখো',bn)}</button></div>
  </div></div>
  <ol class="wf-route-list" aria-label="${bn?'আয়েশার এই মিশনের পথ':'The route in Ayesha’s mission'}">${steps.map((s,i)=>`<li><button type="button" data-wf-step="${i}" class="d-${s.d}" aria-label="${i+1}. ${D4.META[s.d].n}: ${esc(s.en)}"><span class="wf-number">${i+1}</span>${D4.badge(s.d,24)}<span>${D4.META[s.d].n}</span></button></li>`).join('')}</ol>
 </section>`;
}
function mount(container,steps){
 const root=container.querySelector('.mission-workflow');if(!root||root.dataset.bound)return;
 root.dataset.bound='1';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Keep the recap's position when the language or another preference redraws it.
 const previous=live&&live.steps===steps&&!live.root.isConnected?live:null;
 if(live)cancelAnimationFrame(live.frame);
 const state=live={root,steps,index:previous?previous.index:reduced?steps.length:0,elapsed:previous?previous.elapsed:0,angle:previous?previous.angle:0,playing:previous?previous.playing:!reduced,frame:0};
 const bn=root.dataset.bn==='1',say=(en,b)=>text(en,b,bn);
 const caption=root.querySelector('.wf-caption'),play=root.querySelector('[data-wf="play"]'),push=root.querySelector('.wf-push');
 const gears=[...root.querySelectorAll('.compass .gear')],links=[...root.querySelectorAll('.wf-link')],buttons=[...root.querySelectorAll('[data-wf-step]')];
 let length=0,last=performance.now();
 function draw(){
  const done=state.index===steps.length,s=steps[state.index];
  root.classList.toggle('wf-together',done);
  gears.forEach(g=>g.classList.toggle('wf-current',!done&&g.classList.contains('g-'+s.d)));
  links.forEach((p,i)=>{p.style.strokeDasharray='none';p.style.strokeDashoffset='0';p.classList.toggle('wf-past',i<state.index);p.classList.toggle('wf-active',!done&&i===state.index);});
  buttons.forEach((b,i)=>{b.classList.toggle('wf-visited',i<state.index);b.setAttribute('aria-current',i===state.index?'step':'false');});
  caption.innerHTML=done?`<small>${say('All four together','চারটিই একসাথে')}</small><h3>${say('They kept changing each other.','একটি অন্যটিকে বদলে দিয়েছে।')}</h3><p>${say('The plan shaped the prompt. Checking changed the instructions. Responsibility shaped what she shared and sent.','পরিকল্পনা প্রম্পটকে গড়েছে। যাচাই থেকে নির্দেশ বদলেছে। দায়িত্ববোধ ঠিক করেছে সে কী শেয়ার করবে ও পাঠাবে।')}</p><p class="wf-takeaway">${say('Use the gear the task needs. Keep the others in mind.','কাজের প্রয়োজনে গিয়ার বেছে নাও। অন্যগুলোকেও মাথায় রাখো।')}</p>`:
   `<small>${state.index+1} / ${steps.length} · ${D4.META[s.d].n}${bn?` · ${D4.META[s.d].nbn}`:''}</small><h3>${say(s.en,s.bn)}</h3><p>${say(s.detail,s.detailbn)}</p>`;
  play.textContent=done?(bn?'↻ পথটি আবার দেখো':'↻ Replay the route'):state.playing?(bn?'❚❚ বিরতি':'❚❚ Pause'):(bn?'▶ চালাও':'▶ Play');
  play.setAttribute('aria-label',play.textContent);
  if(!done)length=links[state.index].getTotalLength();
  paint();
 }
 function paint(){
  root.querySelector('.compass').style.setProperty('--ga',state.angle+'deg');
  const p=links[state.index];
  if(!p||reduced){push.style.opacity='0';return;}
  const t=Math.min(1,state.elapsed/950),point=p.getPointAtLength(length*t);
  p.style.strokeDasharray=length;p.style.strokeDashoffset=length*(1-t);
  push.setAttribute('cx',point.x);push.setAttribute('cy',point.y);push.style.opacity=t<1?'1':'0';
 }
 function go(index){state.index=index;state.elapsed=0;draw();}
 root.addEventListener('click',e=>{
  const step=e.target.closest('[data-wf-step]'),action=e.target.closest('[data-wf]');
  if(step){state.playing=false;go(+step.dataset.wfStep);state.elapsed=950;paint();return;}
  if(!action)return;
  if(action.dataset.wf==='all'){state.playing=!reduced;go(steps.length);return;}
  if(state.index===steps.length){state.playing=!reduced;go(0);}
  else{state.playing=!state.playing;draw();}
 });
 function tick(now){
  if(!root.isConnected||live!==state)return;
  const dt=Math.min(80,now-last);last=now;
  if(state.playing&&!reduced){
   state.angle+=dt*.008;
   state.elapsed+=dt;
   if(state.index<steps.length){if(state.elapsed>=4800)go(state.index+1);}
   else if(state.elapsed>=4000)state.playing=false;
   paint();
  }
  state.frame=requestAnimationFrame(tick);
 }
 draw();state.frame=requestAnimationFrame(tick);
}
window.MISSION_WORKFLOW={html,mount};
})();
