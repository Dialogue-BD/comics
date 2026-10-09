/* Reading Altitude, in 30 seconds — how to SKIM a document for a map, pick KEYWORDS, SCAN one part, then CHECK.
 * The same skills as IELTS / TOEFL / GRE reading. Plays on one of Ayesha's own documents.
 *   ALT.html(card,bn)   markup for the card
 *   ALT.play(root,{speak,voice})   start the animation (call after the markup is in the page) */
(function(){
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const BN=(t,bn)=>bn&&t?`<span class="bn" lang="bn">${t}</span>`:'';
const ALT={};
let timers=[],tok=0;
const clear=()=>{ timers.forEach(clearTimeout); timers=[]; };
const at=(ms,fn,t)=>{ timers.push(setTimeout(()=>{ if(t===tok) fn(); },ms)); };

ALT.html=(c,bn)=>{
  const words=c.claim.map(w=>`<span class="aw ${w.k?'k':''}">${esc(w.w)}</span>`).join(' ');
  const tags=c.map.map((m,i)=>`<i class="alt-tag" data-i="${i}" style="left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%"><b>${esc(m.l)}</b></i>`).join('');
  return `<div class="alt" data-step="0" data-n="${c.steps.length}">
   <div class="alt-badge"><span aria-hidden="true">✈️</span> ${esc(c.badge||'IELTS Reading · skim and scan')}</div>
   <div class="alt-claim"><small>${esc(c.ai||'The AI wrote')}</small><div class="alt-words" data-say="${esc(c.claim.map(w=>w.w).join(' '))}">${words}</div>
     <div class="alt-tfn"><b>TRUE</b><b>FALSE</b><b>NOT GIVEN</b></div></div>
   <div class="alt-cap" data-say=""><span class="alt-txt"></span><button class="say" type="button" aria-label="Hear it">🔊</button></div>
   <div class="alt-frame"><div class="alt-pan"><img src="${esc(c.img)}" alt="${esc(c.alt||'Her document')}" draggable="false">
     <div class="alt-ov">${tags}<i class="alt-found" style="left:${c.found.x}%;top:${c.found.y}%;width:${c.found.w}%;height:${c.found.h}%"></i><i class="alt-sweep" style="left:${c.zoom.x0}%;width:${c.zoom.w}%"></i><i class="alt-eye"></i></div></div>
     <div class="alt-count" aria-hidden="true"></div><div class="alt-stamp" aria-hidden="true">${esc(c.verdict||'FALSE')}</div>   <div class="alt-chk">${c.checks.map((k,i)=>`<span class="${k.ok?'ok':'no'}" data-i="${i}"><small>${esc(k.q)}</small><b>${k.ok?'✓':'✗'} ${esc(k.a)}</b></span>`).join('')}</div></div>
   <div class="alt-ctl"><button type="button" data-alt="back" aria-label="Back">‹</button><span class="alt-dots">${c.steps.map((s,i)=>`<button type="button" data-alt="go:${i}" class="${i?'':'on'}" aria-label="Step ${i+1}"></button>`).join('')}</span><button type="button" data-alt="next" class="alt-next">▶</button></div>
  </div>`;
};

ALT.play=(root,o)=>{
  const el=root.querySelector('.alt'); if(!el||el.dataset.bound) return; el.dataset.bound='1';
  const c=o.card, bn=o.bn; const t=++tok; clear();
  const pan=el.querySelector('.alt-pan'), eye=el.querySelector('.alt-eye'), sweep=el.querySelector('.alt-sweep'), count=el.querySelector('.alt-count');
  const tags=[...el.querySelectorAll('.alt-tag')], words=[...el.querySelectorAll('.aw')], chks=[...el.querySelectorAll('.alt-chk span')];
  const txt=el.querySelector('.alt-txt'), cap=el.querySelector('.alt-cap');
  const zoom=(s,cx,cy)=>{ pan.style.transform=s===1?'none':`translate(${50-s*cx}%,${50-s*cy}%) scale(${s})`; };
  let auto=true;
  function go(n,fromUser){
    if(fromUser) auto=false;
    n=Math.max(0,Math.min(c.steps.length-1,n)); tok++; const tk=tok; clear(); el.dataset.step=n;
    el.querySelectorAll('.alt-dots button').forEach((b,i)=>b.classList.toggle('on',i===n));
    el.querySelector('.alt-next').textContent=n===c.steps.length-1?'↻':'▶';
    const s=c.steps[n]; txt.innerHTML=`<b>${esc(s.h)}</b> ${esc(s.en)}${BN(s.bn,bn)}`; cap.dataset.say=s.h+'. '+s.en;
    if(o.voice&&o.voice()) o.speak(s.h+'. '+s.en);
    // reset
    el.classList.remove('s-skim','s-key','s-scan','s-chk'); tags.forEach(g=>g.classList.remove('on','pick')); words.forEach(w=>w.classList.remove('on','off'));
    chks.forEach(k=>k.classList.remove('on')); eye.style.opacity=0; sweep.classList.remove('go'); el.querySelector('.alt-found').classList.remove('on'); count.textContent=''; zoom(1);
    const stamp=el.querySelector('.alt-stamp'); stamp.classList.remove('on');
    const dwell=s.ms||5200;
    if(n===1){ el.classList.add('s-skim'); let read=0;
      c.map.forEach((m,i)=>{ at(300+i*430,()=>{ tags[i].classList.add('on'); eye.style.opacity=1; eye.style.left=(m.x+3)+'%'; eye.style.top=(m.y+m.h/2)+'%'; read+=m.n||2; count.textContent=(bn?'পড়া শব্দ: ':'Words read: ')+read+' / '+c.total; },tk); });
    }
    if(n===2){ el.classList.add('s-key'); tags.forEach(g=>g.classList.add('on'));
      words.forEach((w,i)=>{ at(300+i*220,()=>w.classList.add(c.claim[i].k?'on':'off'),tk); });
      at(300+words.length*220+500,()=>{ const p=tags[c.pick]; if(p) p.classList.add('pick'); },tk); }
    if(n===3){ el.classList.add('s-scan'); tags.forEach((g,i)=>{ if(i===c.pick) g.classList.add('on','pick'); });
      at(150,()=>zoom(c.zoom.s,c.zoom.cx,c.zoom.cy),tk);
      at(1400,()=>{ sweep.classList.add('go'); },tk);
      at(3300,()=>{ el.querySelector('.alt-found').classList.add('on'); },tk); }
    if(n===4){ el.classList.add('s-chk'); at(100,()=>zoom(c.zoom.s*.82,c.zoom.cx,c.zoom.cy),tk); el.querySelector('.alt-found').classList.add('on');
      chks.forEach((k,i)=>at(500+i*650,()=>k.classList.add('on'),tk));
      at(500+chks.length*650+250,()=>stamp.classList.add('on'),tk); }
    if(auto&&n<c.steps.length-1) at(dwell,()=>go(n+1),tk);
  }
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-alt]'); if(!b) return; const a=b.dataset.alt;
    if(a==='next'){ const n=+el.dataset.step; go(n>=c.steps.length-1?0:n+1,true); }
    else if(a==='back') go(+el.dataset.step-1,true); else if(a.startsWith('go:')) go(+a.slice(3),true); });
  at(250,()=>go(0),t);
};
window.ALT=ALT;
})();
