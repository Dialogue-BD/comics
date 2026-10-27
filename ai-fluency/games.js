/* AI Fluency Lab — practice games.
 * Partner work on ONE shared phone, so nothing here depends on a secret screen
 * (except "press and hold", where one partner holds the phone and the other only
 * listens). Every game also works Alone, with the phone as the partner.
 *
 *   onthree  "On 3": everyone decides in their head, counts 1·2·3 and shows a hand
 *            at the same moment, so nobody copies. Disagreement becomes the talk.
 *            kind 'opinion' (argue / devil's advocate) or 'guess' (a prediction, paid off later).
 *   rounds   turn-taking speaking rounds: the interview, the friend, Tanvir,
 *            Orbit's sales pitch, Two truths and a lie. A asks, B answers, A judges,
 *            then swap. Alone: the phone asks aloud, you record and compare.
 *   chain    Worst case: A says what could go wrong, B says something worse… then
 *            the real worst case. Conditionals with stakes.
 *   flags    tap the red flags on a scam page, and say why each one is a flag.
 *   mine     the take-home: write YOUR real prompt, part by part, and copy it.
 * Cards keep their state in the lesson context, so a re-render never loses it.
 */
(function(){
'use strict';
const g=()=>AFL._g;
const $=(s,r=document)=>r.querySelector(s);
const AB=['Student A','Student B'];
const student=k=>`<b class="student-label student-${k?'b':'a'}">${AB[k]}</b>`;
const mode=()=>g().S.mode;
const bnOn=()=>g().S.bn;
const esc=t=>g().esc(t);
const BN=t=>g().BN(t);
const tr=(en,bn)=>g().tr(en,bn);
const st=(x,c,d)=>Object.assign({},d,x.get(c.key,{}));
const save=(x,c,v)=>x.set(c.key,v);
const redraw=()=>{ g().renderStage(); g().renderFoot(); g().renderTop(); try{ g().paintTimer(); }catch(e){} };
const WIN=/^(ok|caught|next)$/;
const timer=(sec)=>`<button class="ttimer" data-tt="${sec}" aria-label="Timer"><span class="ttbar"></span><span class="tt">⏱ ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</span></button>`;
const sfx=n=>{ try{ FX.sfx(n); }catch(e){} };
const who=()=>mode()==='class'?'the person next to you':'your partner';
const SIGN={me:'🙋',ai:'📱',both:'🙌'};

/* the count: 1 · 2 · 3 — show! (ticks you can hear, so a whole class can do it together) */
function countdown(btn,done){
  if(!btn||btn.classList.contains('counting')) return;
  btn.classList.add('counting'); const lab=btn.querySelector('.o3n')||btn; const was=lab.innerHTML; let n=0;
  const step=()=>{ n++; if(n<=3){ lab.textContent=n; sfx('tick'); btn.classList.remove('beat'); void btn.offsetWidth; btn.classList.add('beat'); setTimeout(step,720); }
    else { lab.textContent=bnOn()?'দেখাও!':'Show!'; sfx('ping'); setTimeout(()=>{ btn.classList.remove('counting','beat'); if(done) done(); else lab.innerHTML=was; },700); } };
  step();
}

const GAMES={};

/* ============================================================ On 3 */
GAMES.onthree={
  html(c,x){
    const s=st(x,c,{ph:0}), solo=mode()==='solo', cls=mode()==='class';
    const sign=id=>c.signs.find(z=>z.id===id)||{};
    const signs=`<div class="o3-signs">${c.signs.map(z=>`<span class="o3-sign"><i aria-hidden="true">${z.i}</i><b>${z.en}</b>${BN(z.bn)}</span>`).join('')}</div>`;
    let body='';
    if(s.ph===0&&!solo) body=`<button class="o3-go" data-g="o3|go"><span class="o3n">✋ ${tr('On 3 — show!','৩ গুনে — দেখাও!')}</span><small>1 · 2 · 3</small></button>
      <p class="o3-how">${c.kind==='guess'?tr('Choose in your head. Count together — then show your fingers.','মনে মনে বাছো। একসাথে গোনো — তারপর আঙুল দেখাও।'):tr('Choose in your head. Count together — then show your hand.','মনে মনে বাছো। একসাথে গোনো — তারপর হাত দেখাও।')}</p>`;
    else if(s.ph===0||(solo&&s.ph<2)) body=`<p class="o3-how">${tr('Tap your answer:','তোমার উত্তরে চাপো:')}</p><div class="o3-pick">${c.signs.map(z=>`<button data-g="o3|pick|a|${z.id}"><i>${z.i}</i>${z.en}</button>`).join('')}</div>`;
    else if(s.ph===1&&cls) body=`<p class="o3-how">${tr('Look around the room.','চারপাশে তাকাও।')}</p><div class="o3-pick two"><button data-g="o3|cls|same">🤝 ${tr('Mostly the same','প্রায় সবাই একই')}</button><button data-g="o3|cls|split">⚡ ${tr('Split','ভাগ হয়ে গেছে')}</button></div>`;
    else if(s.ph===1) body=`<p class="o3-how">${tr('What did you show?','কে কী দেখালে?')}</p>${[0,1].map(k=>`<div class="o3-row">${student(k)}${c.signs.map(z=>`<button class="${s[k?'b':'a']===z.id?'on':''}" data-g="o3|pick|${k?'b':'a'}|${z.id}" aria-label="${AB[k]} ${esc(z.en)}">${z.i}</button>`).join('')}</div>`).join('')}`;
    else body=verdict(c,s,sign);
    return `<div class="o3 o3-${c.kind||'opinion'}">${c.q?`<p class="tq">${c.pic?`<span class="tpic" aria-hidden="true">${c.pic}</span>`:''}<span>${c.q}${BN(c.qbn)}</span>${g().sayBtn(c.q)}</p>`:''}${signs}${body}</div>`;
  },
  state(c,x){ const s=st(x,c,{ph:0}); return {act:s.ph<2}; },
  click(c,x,a,arg,arg2,el){
    const s=st(x,c,{ph:0});
    if(a==='go'){ countdown(el,()=>{ save(x,c,Object.assign(s,{ph:1})); redraw(); }); return; }
    if(a==='reset'){ save(x,c,{ph:0}); g().resetTalk(); redraw(); return; }
    if(a==='cls'){ save(x,c,Object.assign(s,{ph:2,cls:arg})); redraw(); return; }
    if(a==='pick'){ s[arg]=arg2; sfx('tick');
      if(mode()==='solo'||(s.a&&s.b)){ s.ph=2;
        /* a guess earns its star at for the check — no spoilers */ }
      save(x,c,s); redraw(); return; }
  }
};
function verdict(c,s,sign){
  const solo=mode()==='solo';
  const picks=solo?`<div class="o3-res one"><span>${sign(s.a).i} ${sign(s.a).en}</span></div>`:s.cls?'':`<div class="o3-res"><span>${student(0)} ${sign(s.a).i}</span><span>${student(1)} ${sign(s.b).i}</span></div>`;
  const same=s.cls?s.cls==='same':s.a===s.b;
  if(c.kind==='guess') return `${picks}<div class="o3-v guess"><b>🔒 ${tr('Guesses locked in!','অনুমান ঠিক করা হলো!')}</b><p>${solo?tr('You’ll find out after you check it.','যাচাই করার পর জানতে পারবে।'):tr('Each of you: say why, in one sentence.','দুজনেই এক বাক্যে বলো কেন।')+` <i>“I think it will … because …”</i>`}</p>${solo?'':`<small>${tr('You’ll find out after you check it.','যাচাই করার পর জানতে পারবে।')}</small>`}</div>`;
  const words=c.words?`<details class="o3-words"><summary>💡 ${tr('Words to argue','তর্কের শব্দ')}</summary>${c.words.map(w=>`<span data-say="${esc(w)}">${esc(w)}</span>`).join('')}</details>`:'';
  const model=c.model?`<button class="model" data-speak="${esc(c.model)}">🎧 ${tr('Hear an example','একটা উদাহরণ শোনো')}</button><p class="model-t" hidden>${esc(c.model)}</p>`:'';
  const msg=same
    ?(s.cls?tr('Most people agree. Who disagrees? One person argues the OTHER side.','বেশিরভাগ একমত। কে একমত নয়? একজন উল্টো দিকের পক্ষে বলো।'):tr('Same answer! Now one of you argues the OTHER side. Can you change your partner’s mind?','একই উত্তর! এবার একজন উল্টো দিকের পক্ষে বলো। সঙ্গীর মত বদলাতে পারো?'))
    :(s.cls?tr('Split! Find someone who showed something different — and convince them.','মত ভাগ! এমন কাউকে খোঁজো যে আলাদা দেখিয়েছে — আর তাকে বোঝাও।'):tr('You disagree — good! Each give one reason. Then try to move your partner one step.','তোমরা একমত নও — ভালো! দুজনেই একটা কারণ বলো। তারপর সঙ্গীকে এক ধাপ সরাতে চেষ্টা করো।'));
  return `${picks}<div class="o3-v ${same?'same':'split'}"><b>${same?'🤝':'⚡'} ${msg}</b><div class="o3-tools">${timer(60)}${words}</div>${model}</div><button class="o3-again" data-g="o3|reset">↺ ${tr('Again','আবার')}</button>`;
}
/* the On 3 bar on a sort card: point at who should do the job, then argue */
GAMES.sign=id=>SIGN[id]||'';
GAMES.o3bar=bins=>`<div class="o3bar"><button class="o3-go small" data-g="o3s|go"><span class="o3n">✋ 1·2·3</span></button><span>${tr('For each job: on 3, point','প্রতিটা কাজে: ৩ গুনে দেখাও')} — ${bins.map(b=>`${SIGN[b.id]||'•'} ${esc(b.label)}`).join(' · ')}. ${tr('Disagree? Argue first. Then tap.','একমত নও? আগে তর্ক করো। তারপর চাপো।')}</span></div>`;
/* the guess paid off, on the gear card that follows the check */
GAMES.guessLine=(gs,x)=>{
  const s=x.get(gs.key); if(!s||s.ph<2) return '';
  const picks=s.cls?[]:mode()==='solo'||!s.b?[s.a]:[s.a,s.b]; if(picks.length) g().firstTry(x,gs.key,picks.every(p=>p===gs.right));
  const signs=gs.signs||GAMES._signs[gs.key]||[]; const sg=id=>signs.find(z=>z.id===id)||{i:'?'};
  const right=signs.find(z=>z.id===gs.right)||{};
  const one=(k,id)=>`<span class="${id===gs.right?'win':'lose'}">${k?`<b>${k}</b> `:''}${sg(id).i} ${id===gs.right?'✓':'✗'}</span>`;
  return `<div class="lvl-guess"><small>🤔 ${mode()==='solo'?tr('Your guess','তোমার অনুমান'):tr('Your guesses','তোমাদের অনুমান')}</small><div>${mode()==='solo'?one('',s.a):s.a?one(AB[0],s.a)+one(AB[1],s.b):''}</div><p>${right.i||''} ${right.en||''}${gs.note?` — ${gs.note}`:''}</p></div>`;
};
GAMES._signs={};
/* the end of a mission comes back to how it began */
GAMES.callback=(cb,x)=>`<div class="card cbk"><b>🔁 ${cb.en}</b>${BN(cb.bn)}${cb.signs?`<div class="o3-signs small">${cb.signs.map(z=>`<span class="o3-sign"><i>${z.i}</i><b>${z.en}</b></span>`).join('')}</div>`:''}${cb.go?`<button class="o3-go small" data-g="o3s|go"><span class="o3n">✋ 1·2·3</span></button>`:''}</div>`;

/* ============================================================ speaking rounds */
GAMES.rounds={
  html(c,x){
    const s=st(x,c,{i:0,res:[]}), n=c.items.length, solo=mode()==='solo', pair=mode()==='pair';
    const dots=`<span class="rd-dots">${c.items.map((it,k)=>`<i class="${k<s.i?(WIN.test(s.res[k]||'')?'done':'more'):k===s.i?'now':''}"></i>`).join('')}</span>`;
    const head=`<div class="rd-h">${c.pic?`<span class="tpic" aria-hidden="true">${c.pic}</span>`:''}<b>${c.title}${BN(c.titlebn)}</b>${dots}</div>`;
    const intro=c.intro&&s.i===0&&!s.res.length?`<p class="rd-intro">${c.intro.en}${BN(c.intro.bn)}</p>${c.prep&&!solo?`<div class="rd-prep">${timer(c.prep)}<span>${tr('Think time first','আগে ভাবার সময়')}</span></div>`:''}`:'';
    if(s.i>=n) return `<div class="rd rd-${c.kind}">${head}<div class="rd-end"><div class="rd-sum">${s.res.map(r=>`<span class="${WIN.test(r)?'win':'lose'}">${((c.rate||[]).find(z=>z.id===r)||{}).i||(r==='next'?'✓':'•')}</span>`).join('')}</div>
      ${c.outro?`<p>${c.outro.en}${BN(c.outro.bn)}</p>`:''}<button class="btn quiet" data-g="rd|reset">↺ ${tr('Play again','আবার খেলো')}</button></div></div>`;
    const it=c.items[s.i], ask=s.i%2;      // who asks this round: A, then B, then A…
    const roles=c.roles&&!solo?`<div class="rd-roles"><span>${student(ask)}<span>${c.roles.ask.en}${BN(c.roles.ask.bn)}</span></span><span>${student(1-ask)}<span>${c.roles.ans.en}${BN(c.roles.ans.bn)}</span></span></div>`:'';
    const q=it.q.replace(/\{A\}/g,AB[ask]).replace(/\{B\}/g,AB[1-ask]);
    const qbox=c.secret&&pair
      ?`<button class="rd-peek" data-peek="1" aria-label="Press and hold to read"><span class="rd-cover">👁 ${AB[ask]} ${tr('press and hold to read','চেপে ধরে পড়ো')}<small>${AB[1-ask]}: ${tr('don’t look — just listen!','দেখো না — শুধু শোনো!')}</small></span><span class="rd-q">“${esc(q)}”${BN(it.qbn)}</span></button>`
      :`<p class="rd-q open">${c.kind==='tt'?'':'“'}${esc(q)}${c.kind==='tt'?'':'”'}${BN(it.qbn)}${c.kind==='tt'?'':g().sayBtn(q)}</p>`;
    const life=c.lifeline?`<details class="o3-words"><summary>💡 ${c.lifeline.t}</summary>${c.lifeline.items.map(w=>`<span data-say="${esc(w)}">${esc(w)}</span>`).join('')}</details>`:'';
    const model=it.model?`<button class="model" data-g="rd|model">🎧 ${c.kind==='tt'?tr('Hear an example','একটা উদাহরণ শোনো'):tr('Hear a strong answer','একটা ভালো উত্তর শোনো')}</button>${s.peekModel===s.i?`<p class="model-t">${esc(it.model)}</p>`:''}`:'';
    if(solo){
      const R=g().rec();
      const rec=`<div class="rec">${R.url?`<audio controls src="${R.url}"></audio>`:''}<button class="btn ${R.on?'':'gold'}" data-rec="${R.on?'stop':'start'}">${R.on?'■ '+tr('Stop','থামো'):'● '+(R.url?tr('Record again','আবার রেকর্ড করো'):tr('Record your answer','তোমার উত্তর রেকর্ড করো'))}</button></div>`;
      return `<div class="rd rd-${c.kind}">${head}${intro}<p class="rd-who">${c.solo?c.solo.en:tr('Listen. Then answer out loud.','শোনো। তারপর জোরে উত্তর দাও।')}</p>${qbox}${rec}<div class="rd-tools">${life}</div>${model}
        <div class="rd-rate"><button class="pb primary" data-g="rd|rate|next">${s.i<n-1?tr('Next question','পরের প্রশ্ন'):tr('Finish','শেষ')} ›</button></div></div>`;
    }
    return `<div class="rd rd-${c.kind}">${head}${intro}<p class="rd-who">${tr('This round','এই পালায়')}</p>${roles}${qbox}<div class="rd-tools">${c.time===0?'':timer(c.time||45)}${life}</div>${model}
      <div class="rd-rate">${(c.rate||[{id:'ok',i:'✓',en:'Done'}]).map(r=>`<button class="pb ${r.good?'primary':'ghost'}" data-g="rd|rate|${r.id}">${r.i?r.i+' ':''}${r.en}</button>`).join('')}</div>
      ${s.i<n-1?`<p class="rd-swap">↔ ${tr(`After this round, swap jobs. ${AB[1-ask]} goes first next.`,`এই পালা শেষে কাজ বদলাও। পরের পালায় শিক্ষার্থী ${1-ask?'B':'A'} আগে শুরু করবে।`)}</p>`:''}
      ${c.judge&&c.roles?`<small class="rd-judge">${AB[ask]}: ${c.judge.en}${BN(c.judge.bn)}</small>`:''}</div>`;
  },
  state(c,x){ const s=st(x,c,{i:0}); return {act:s.i<c.items.length}; },
  click(c,x,a,arg){
    const s=st(x,c,{i:0,res:[]});
    if(a==='model'){ const it=c.items[s.i]; if(it){ g().speak(it.model); save(x,c,Object.assign(s,{peekModel:s.i})); redraw(); } return; }
    if(a==='reset'){ g().resetTalk(); save(x,c,{i:0,res:[]}); redraw(); this.voice(c,x); return; }
    if(a==='rate'){ g().hush(); g().resetTalk(); s.res=s.res.concat([arg]); s.i++; delete s.peekModel; save(x,c,s); sfx(WIN.test(arg)?'ok':'tick'); redraw(); this.voice(c,x); return; }
  },
  /* Alone: the phone is the partner — it asks the question out loud */
  voice(c,x){ if(mode()!=='solo') return; const s=st(x,c,{i:0}); const it=c.items[s.i]; if(it) setTimeout(()=>g().speak(it.q),250); }
};

/* ============================================================ worst case */
GAMES.chain={
  html(c,x){
    const s=st(x,c,{i:0,links:0,rev:false}), it=c.items[s.i], f=g().FILES[it.f], n=c.items.length;
    const turn=s.links%2;
    const top=`<p class="ch-intro">${c.intro.en}${BN(c.intro.bn)}</p><div class="ch-item">${g().fileThumb(it.f,'ch-th')}<span><b>${esc(f?f.name:it.label)}</b><small>${tr('…uploaded to an AI chat','…একটা AI চ্যাটে আপলোড করা')}</small></span><em>${s.i+1}/${n}</em></div>`;
    if(!s.rev) return `<div class="ch">${top}
      <div class="ch-turn">${mode()==='solo'?`<b>${tr('Your turn','তোমার পালা')}</b>`:student(turn)}<span>${s.links===0?tr('What could go wrong?','কী খারাপ হতে পারে?'):tr('Worse! What could happen next?','আরও খারাপ! তারপর কী হতে পারে?')}</span></div>
      <div class="ch-links" aria-label="${s.links} links">${s.links?'🔗'.repeat(Math.min(s.links,12)):''}<b>${s.links}</b></div>
      <div class="ch-bar"><i></i></div>
      <div class="ch-acts"><button class="pb primary" data-g="ch|link">✓ ${tr(mode()==='solo'?'Said it':'Said it — next student',mode()==='solo'?'বলেছি':'বলেছি — এবার অন্যজন')}</button><button class="pb ghost" data-g="ch|stop">✋ ${tr('Out of ideas','আর মাথায় আসছে না')}</button></div>
      <details class="o3-words"><summary>💡 ${tr('Need a start?','শুরু করতে পারছ না?')}</summary>${c.words.map(w=>`<span data-say="${esc(w)}">${esc(w)}</span>`).join('')}</details></div>`;
    return `<div class="ch">${top}<div class="ch-real"><small>${tr('The real risk','আসল ঝুঁকি')}</small><p>${it.real.en}${BN(it.real.bn)}</p>${g().sayBtn(it.real.en)}</div>
      <p class="ch-score">🔗 ${tr('Your chain','তোমাদের শিকল')}: <b>${s.links}</b> ${s.links===1?'link':'links'}${s.links>=6?' 🔥':''}</p>
      ${s.i<n-1?`<button class="pb primary" data-g="ch|next">${tr('Next file','পরের ফাইল')} ›</button>`:`<p class="good">${tr('Three files a CV never needs. Whose data is it? Does the job need it?','তিনটা ফাইল যা CV-তে কখনো লাগে না। কার তথ্য? কাজের কি দরকার?')}</p>`}</div>`;
  },
  state(c,x){ const s=st(x,c,{i:0,rev:false}); return {act:!(s.i>=c.items.length-1&&s.rev)}; },
  click(c,x,a){
    const s=st(x,c,{i:0,links:0,rev:false});
    if(a==='link'){ s.links++; sfx('tick'); }
    else if(a==='stop'){ s.rev=true; sfx('ping'); const it=c.items[s.i]; setTimeout(()=>g().speak(it.real.en),300); }
    else if(a==='next'){ g().hush(); s.i=Math.min(c.items.length-1,s.i+1); s.links=0; s.rev=false; }
    save(x,c,s); redraw();
  }
};

/* ============================================================ red flags */
GAMES.flags={
  html(c,x){
    const s=st(x,c,{found:[],miss:0,last:''}), need=Object.keys(c.flags).length;
    let page=c.page.replace(/data-flag="([\w:]+)"/g,(m,id)=>`data-g="fl|${id}" role="button" tabindex="0" class="fl ${s.found.includes(id)?'hit':''} ${s.last===id&&!c.flags[id]?'miss':''}"`);
    return `<div class="flg"><p class="ch-intro">${c.intro.en}${BN(c.intro.bn)}</p>
      ${mode()!=='solo'?`<p class="rd-who">👥 ${tr('Take turns: tap one flag — and say why it’s a flag.','পালা করে: একটা পতাকায় চাপো — আর বলো কেন এটা বিপদের সংকেত।')}</p>`:''}
      <div class="fl-page">${page}</div>
      <div class="fl-count">🚩 <b>${s.found.length}/${need}</b>${s.miss?`<span>${s.miss} ✗</span>`:''}</div>
      ${s.last&&s.last.startsWith('x:')&&c.nos[s.last.slice(2)]?`<p class="fl-no">${c.nos[s.last.slice(2)].en}${BN(c.nos[s.last.slice(2)].bn)}</p>`:''}
      <div class="fl-list">${s.found.map(id=>`<div><b>🚩 ${c.flags[id].en}</b><span>${c.flags[id].why}</span>${BN(c.flags[id].bn)}</div>`).join('')}</div>
      ${s.found.length>=need?`<p class="good">🎉 ${tr('All five. A careful person sees them. An agent might not.','পাঁচটাই। সতর্ক মানুষ এগুলো দেখে। এজেন্ট হয়তো দেখে না।')}</p>`:''}</div>`;
  },
  state(c,x){ const s=st(x,c,{found:[]}); return {act:s.found.length<Object.keys(c.flags).length,show:1}; },
  click(c,x,a){
    const s=st(x,c,{found:[],miss:0,last:''}), id=a.replace(/^x:/,'');
    if(c.flags[a]){ if(!s.found.includes(a)){ s.found=s.found.concat([a]); sfx('ok'); } s.last=a;
      if(s.found.length===Object.keys(c.flags).length) g().firstTry(x,c.key,s.miss<=1); }
    else { s.miss++; s.last='x:'+id; sfx('no'); }
    save(x,c,s); redraw();
  },
  show(c,x){ const s=st(x,c,{found:[],miss:0}); const left=Object.keys(c.flags).filter(k=>!s.found.includes(k)); let k=0;
    const step=()=>{ if(k>=left.length) return; const el=$(`#pcard [data-g="fl|${left[k++]}"]`); if(el){ el.scrollIntoView({block:'center'}); el.click(); } setTimeout(step,500); }; step(); }
};

/* ============================================================ your real prompt */
GAMES.mine={
  html(c,x){
    const v=x.get(c.key,{});
    const filled=c.fields.filter(f=>(v[f.id]||'').trim()).length;
    return `<div class="mine"><p class="ch-intro">${c.intro.en}${BN(c.intro.bn)}</p>
      ${c.fields.map(f=>`<label class="mn-f ${f.cls||''}"><span class="mn-l">${f.label}${f.labelbn&&bnOn()?` <span class="bn-in" lang="bn">· ${f.labelbn}</span>`:''}</span><textarea rows="2" data-mine="${c.key}|${f.id}" placeholder="${esc(f.ph)}">${esc(v[f.id]||'')}</textarea></label>`).join('')}
      <div class="mn-acts"><button class="pb ${filled?'primary':'ghost'}" data-g="mine|copy">📋 ${tr('Copy my prompt','আমার প্রম্পট কপি করো')}</button><span class="mn-ok" ${v._copied?'':'hidden'}>✓ ${tr('Copied — paste it into any AI app.','কপি হয়েছে — যেকোনো AI অ্যাপে পেস্ট করো।')}</span></div>
      ${c.tip?`<aside class="mn-tip"><b>${tr('Before you attach files','ফাইল সংযুক্ত করার আগে')}</b><p>${c.tip.en}${BN(c.tip.bn)}</p></aside>`:''}
      ${mode()!=='solo'&&c.partner?`<div class="mn-p"><b>👥 ${c.partner.en}</b>${BN(c.partner.bn)}</div>`:''}
      ${c.note?`<p class="note">${c.note.en}${BN(c.note.bn)}</p>`:''}</div>`;
  },
  state(){ return {read:1}; },
  click(c,x,a){
    if(a!=='copy') return; const v=x.get(c.key,{});
    const text=c.fields.map(f=>(v[f.id]||'').trim()||f.ph).join(' ');
    const done=()=>{ v._copied=1; x.set(c.key,v); const ok=$('#pcard .mn-ok'); if(ok) ok.hidden=false; sfx('ok'); };
    try{ navigator.clipboard.writeText(text).then(done,()=>{ fallbackCopy(text); done(); }); }catch(e){ fallbackCopy(text); done(); }
  }
};
function fallbackCopy(t){ try{ const a=document.createElement('textarea'); a.value=t; a.style.cssText='position:fixed;opacity:0'; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }catch(e){} }

/* ============================================================ wiring */
GAMES.click=(el,e)=>{
  const [kind,a,arg,arg2]=el.dataset.g.split('|');
  if(kind==='o3s'){ countdown(el); return; }
  const x=g().ctx(); const c=g().fn(x.beat.card,x); if(!c) return;
  const map={o3:'onthree',rd:'rounds',ch:'chain',fl:'flags',mine:'mine'};
  const G=GAMES[map[kind]]; if(G&&G.click) G.click(c,x,a,arg,arg2,el);
};
/* remember the signs of a guess, so the gear card can pay it off */
const _html=GAMES.onthree.html;
GAMES.onthree.html=function(c,x){ GAMES._signs[c.key]=c.signs; return _html.call(this,c,x); };

/* press and hold: only the partner holding the phone reads the question */
document.addEventListener('pointerdown',e=>{ const p=e.target.closest&&e.target.closest('[data-peek]'); if(p){ p.classList.add('peek'); } });
const unpeek=()=>document.querySelectorAll('[data-peek].peek').forEach(p=>p.classList.remove('peek'));
['pointerup','pointercancel','pointerleave'].forEach(t=>document.addEventListener(t,unpeek));
document.addEventListener('contextmenu',e=>{ if(e.target.closest&&e.target.closest('[data-peek]')) e.preventDefault(); });
document.addEventListener('keydown',e=>{ const p=document.activeElement; if(p&&p.dataset&&p.dataset.peek&&(e.key===' '||e.key==='Enter')){ p.classList.add('peek'); e.preventDefault(); } });
document.addEventListener('keyup',unpeek);
/* typing your own prompt: saved as you type, without redrawing the card */
document.addEventListener('input',e=>{ const t=e.target; if(!t.dataset||!t.dataset.mine) return; const [k,id]=t.dataset.mine.split('|'); const x=g().ctx(); const v=x.get(k,{}); v[id]=t.value; delete v._copied; x.set(k,v); });
/* flags can be reached with the keyboard too */
document.addEventListener('keydown',e=>{ const t=document.activeElement; if(t&&t.classList&&t.classList.contains('fl')&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); t.click(); } });

window.GAMES=GAMES;
})();
