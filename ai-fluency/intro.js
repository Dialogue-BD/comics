/* The 4Ds — onboarding motion graphic for the projector.
 * One 1920×1080 stage, eight scenes, told through Ayesha's CV.
 * Every movement is a Web Animation built from data-a attributes, so the
 * whole film is a pure function of (scene, t): the projector player runs it
 * live, and the video renderer seeks it frame by frame (INTRO.seek).
 * The gold ring is the mascot: the human eye. It makes every connection.
 */
(function(){
'use strict';
const W=1920,H=1080;
const C={forest:'#103D21',gold:'#B9924F',goldL:'#D2B978',goldS:'#F0E6CD',paper:'#F4F1E6',card:'#FFFDF7',ink:'#1D211C',muted:'#5F6A5C',clay:'#B0563A',ok:'#1F7A47',
 del:'#8A5610',delT:'#F6EBD7',des:'#0A6A62',desT:'#DDEFEC',dis:'#3F4FA8',disT:'#E4E7F7',dil:'#A8322A',dilT:'#F7E3E1',md:'#65558F'};

/* ---------- drawings ---------- */
const AYESHA=`<svg viewBox="0 0 200 300" class="ay"><defs><clipPath id="ayc"><rect width="200" height="300"/></clipPath></defs>
 <path d="M30 300 C34 220 60 190 100 186 C140 190 166 220 170 300Z" fill="#2F7F7A"/>
 <path d="M52 214 C80 236 120 236 148 214 L160 300 L118 300 C112 262 88 262 82 300 L40 300Z" fill="#E0A93F" opacity=".95"/>
 <rect x="88" y="160" width="24" height="34" rx="10" fill="#C98E62"/>
 <ellipse cx="100" cy="112" rx="50" ry="56" fill="#2B1D16"/>
 <ellipse cx="100" cy="124" rx="38" ry="46" fill="#D9A57A"/>
 <path d="M58 112 C62 70 138 66 144 112 C132 92 112 86 100 86 C86 86 68 92 58 112Z" fill="#2B1D16"/>
 <circle cx="100" cy="60" r="20" fill="#2B1D16"/>
 <g fill="none" stroke="#3B2A22" stroke-width="3"><circle cx="85" cy="126" r="11"/><circle cx="116" cy="126" r="11"/><path d="M96 126h9"/></g>
 <circle cx="85" cy="127" r="3" fill="#2B1D16"/><circle cx="116" cy="127" r="3" fill="#2B1D16"/>
 <path d="M90 150 Q100 157 110 150" stroke="#8E4A35" stroke-width="3" fill="none" stroke-linecap="round"/>
 <circle cx="72" cy="142" r="6" fill="#E9967A" opacity=".35"/><circle cx="128" cy="142" r="6" fill="#E9967A" opacity=".35"/></svg>`;
const SPARK=`<svg viewBox="0 0 24 24"><path d="M12 2c.4 4.9 5.1 9.6 10 10-4.9.4-9.6 5.1-10 10-.4-4.9-5.1-9.6-10-10 4.9-.4 9.6-5.1 10-10z" fill="currentColor"/></svg>`;
const PERSON=`<svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" fill="currentColor"/></svg>`;
const SHIELD=`<svg viewBox="0 0 24 24"><path d="M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5z" fill="currentColor"/></svg>`;
const LOCK=`<svg viewBox="0 0 24 24"><path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0z" fill="currentColor"/></svg>`;

const phone=(inner,x,y,a='')=>`<div class="ph" style="left:${x}px;top:${y}px" ${a}><div class="ph-sb"><span>9:41</span><span>▴ ◆ 76%</span></div><div class="ph-scr">${inner}</div><div class="ph-pill"></div></div>`;
const chip=(n,name,q,col,colT,t)=>`<div class="chip" style="--c:${col};--ct:${colT}" data-a="left ${t}"><b>${n}</b><span>${name}</span><i>${q}</i></div>`;

/* ---------- scenes ----------
 * dur: seconds at a slow reading pace (the projector default).
 * caps: [t, English, Bangla] — the narration, word for word.
 * data-a="anim start [duration]"   data-fly="dx,dy" for fly-ins
 * ring: [[t,x,y],…] the gold eye's path (centre point, stage px)
 */
const SCENES=[
{id:'hook',dur:16,
 caps:[[0,'Ayesha asked AI: “Make my CV better.”','আয়েশা AI-কে বলল: “আমার CV আরও ভালো করো।”'],
       [3.6,'In seconds, it looked amazing.','কয়েক সেকেন্ডেই দারুণ দেখাল।'],
       [6.8,'But it said her IELTS score was 7.0. Her real score is 6.0.','কিন্তু লিখল তার IELTS ৭.০। তার আসল স্কোর ৬.০।'],
       [12,'Is that AI fluency?','একে কি AI-তে দক্ষতা বলে?']],
 ring:[[6.6,1700,140],[7.6,600,348],[9.2,600,348],[10.2,1360,640],[11.6,1360,640]],
 html:`<div class="ayw" style="left:110px;top:300px" data-a="up 0">${AYESHA}</div>
 ${phone(`<div class="bub-u" data-a="pop .5">make my cv better</div>
   <div class="bub-a" data-a="up 2.2"><div class="sp">${SPARK}</div><div>
     <p class="t" data-a="fade 2.6">AYESHA RAHMAN ✨</p>
     <p data-a="fade 3.0">Fluent English</p>
     <p data-a="fade 3.3">Led a team of 20 volunteers</p>
     <p class="hi" data-a="fade 3.6">IELTS Academic: 7.0</p>
     <p data-a="fade 3.9">Published research</p>
     <p class="em" data-a="pop 4.4">You’ve got this! 🚀</p></div></div>`,370,110,'data-a="up .1"')}
 <div class="doc" style="left:1130px;top:300px;width:460px" data-a="right 5.6"><div class="doc-h">IELTS mock report</div>
   <div class="row"><span>Listening</span><b>6.5</b></div><div class="row"><span>Reading</span><b>6.5</b></div><div class="row"><span>Writing</span><b>5.5</b></div><div class="row"><span>Speaking</span><b>5.5</b></div>
   <div class="row tot"><span>Overall</span><b>6.0</b></div></div>
 <svg class="ln" viewBox="0 0 ${W} ${H}"><path d="M690 348 C900 360 1120 560 1300 640" pathLength="1" stroke="${C.gold}" stroke-width="7" fill="none" stroke-dasharray="1" data-a="draw 8.2 1.6"/></svg>
 <div class="stamp" style="left:700px;top:290px" data-a="stamp 9.6">✗</div>
 <div class="dim" data-a="fade 11.7 .5"></div><div class="bigq" data-a="pop 12">Is that AI fluency?</div>`},

{id:'two',dur:10,
 caps:[[0,'Using AI is easy.','AI ব্যবহার করা সহজ।'],[3,'Being fluent with AI takes four habits: the four Ds.','কিন্তু AI-তে দক্ষ হতে চারটা অভ্যাস লাগে: চারটা D।']],
 ring:[[6.6,1500,570],[9.6,1500,570]],
 html:`<div class="col" style="left:180px" data-a="left .2"><div class="colh">Using AI</div>
   <div class="flow"><span>type</span><i>→</i><span>copy</span><i>→</i><span>send</span></div><div class="mute">Fast. But who checked it?</div></div>
 <div class="col" style="left:1020px" data-a="right 2.6"><div class="colh" style="color:${C.forest}">Fluent with AI</div></div>
 <div class="d4" style="left:1210px;top:380px">
   <div class="dd" style="--c:${C.del};left:0;top:0" data-a="pop 4.0">Delegation</div>
   <div class="dd" style="--c:${C.des};left:310px;top:0" data-a="pop 4.5">Description</div>
   <div class="dd" style="--c:${C.dis};left:0;top:230px" data-a="pop 5.0">Discernment</div>
   <div class="dd" style="--c:${C.dil};left:310px;top:230px" data-a="pop 5.5">Diligence</div></div>
 <div class="you" style="left:1435px;top:505px" data-a="pop 6.4">${PERSON}</div>`},

{id:'delegation',dur:15,
 caps:[[0,'First, Delegation: decide who does what.','প্রথম, Delegation: কে কোন কাজ করবে ঠিক করো।'],
       [4.6,'Ayesha keeps the facts. The AI can do the layout.','তথ্য আয়েশার কাছে থাকবে। লেআউট AI করতে পারে।'],
       [10,'Some jobs, they share.','কিছু কাজ দুজনে মিলে।']],
 ring:[[3.4,960,230],[4.6,380,470],[6.4,960,230],[7.6,1540,470],[9.2,960,230],[10.4,960,470],[11.4,960,230],[12.6,380,560],[14,380,560]],
 html:`${chip('1','Delegation','Who does what?',C.del,C.delT,.2)}
 <div class="tray" style="left:160px" data-a="up .8"><div class="tray-h">${AYESHA}<b>Ayesha</b></div></div>
 <div class="tray" style="left:740px" data-a="up 1.0"><div class="tray-h"><span class="tico" style="background:${C.del}">${PERSON}</span><span class="tplus">+</span><span class="tico sp2">${SPARK}</span><b>Together</b></div></div>
 <div class="tray" style="left:1320px" data-a="up 1.2"><div class="tray-h"><span class="tico sp2">${SPARK}</span><b>AI</b></div></div>
 <div class="task" style="left:190px;top:430px" data-fly="580,-240" data-a="fly 3.6 1.1">Her true facts</div>
 <div class="task" style="left:1350px;top:430px" data-fly="-580,-240" data-a="fly 6.6 1.1">Layout &amp; headings</div>
 <div class="task" style="left:770px;top:430px" data-fly="0,-240" data-a="fly 9.4 1.1">What matters for her goal</div>
 <div class="task" style="left:190px;top:540px" data-fly="580,-350" data-a="fly 11.6 1.1">Check every line</div>`},

{id:'description',dur:15,
 caps:[[0,'Second, Description: tell the AI clearly.','দ্বিতীয়, Description: AI-কে স্পষ্ট করে বলো।'],
       [4.2,'Who you are. What you need. How to work. How to behave.','তুমি কে। তোমার কী দরকার। কীভাবে কাজ করবে। কেমন আচরণ করবে।']],
 ring:[[4,520,360],[5.6,520,360],[6.4,1400,360],[8,1400,360],[8.8,520,640],[10.4,520,640],[11.2,1400,640],[12.8,1400,640]],
 html:`${chip('2','Description','Tell it clearly',C.des,C.desT,.2)}
 <div class="prompt" data-a="pop 1.2"><div class="ph-lbl">Ayesha’s prompt</div></div>
 <div class="blk" style="left:330px;top:300px;--c:${C.des}" data-fly="-500,0" data-a="fly 4.2 .9"><b>Context</b>I am a third-year Economics student.</div>
 <div class="blk" style="left:1010px;top:300px;--c:${C.des}" data-fly="500,0" data-a="fly 6.0 .9"><b>Product</b>Make a 2-page academic CV.</div>
 <div class="blk" style="left:330px;top:580px;--c:${C.des}" data-fly="-500,0" data-a="fly 8.4 .9"><b>Process</b>Use only my files. Ask me first.</div>
 <div class="blk" style="left:1010px;top:580px;--c:${C.des}" data-fly="500,0" data-a="fly 10.8 .9"><b>Performance</b>Be an honest editor.</div>
 <div class="send" data-a="pop 13">➤</div>`},

{id:'discernment',dur:15,
 caps:[[0,'Third, Discernment: check what comes back.','তৃতীয়, Discernment: যা ফিরে আসে তা যাচাই করো।'],
       [4.4,'Line by line, against the real documents.','লাইন ধরে ধরে, আসল কাগজপত্রের সাথে মিলিয়ে।']],
 ring:[[3.6,720,330],[5,720,330],[5.6,720,450],[6.6,1390,420],[8.4,1390,420],[9.2,720,570],[10.2,720,570],[10.8,720,690],[11.8,1390,640],[13.6,1390,640]],
 html:`${chip('3','Discernment','Check what comes back',C.dis,C.disT,.2)}
 <div class="draft" data-a="left .8"><div class="dh"><span class="sp">${SPARK}</span>AI draft</div>
   <div class="dl" style="top:90px">CGPA 3.58 / 4.00<i class="ok" data-a="pop 5">✓</i></div>
   <div class="dl" style="top:210px">Led the Book Support project<i class="bad" data-a="pop 8.4">≈</i><s data-a="fade 8.6"></s></div>
   <div class="dl" style="top:330px">186 books to 62 students<i class="ok" data-a="pop 10.2">✓</i></div>
   <div class="dl" style="top:450px">SPSS and Stata (advanced)<i class="bad" data-a="pop 12.6">✗</i><s data-a="fade 12.8"></s></div></div>
 <div class="doc" style="left:1130px;top:250px;width:560px" data-a="right 2"><div class="doc-h">Her documents</div>
   <div class="ev" data-a="fade 6.4"><small>RUCEI report</small>Volunteer Tutor &amp; Team Member</div>
   <div class="ev" data-a="fade 11.6"><small>Her CV</small>basic SPSS, basic Stata</div></div>
 <svg class="ln" viewBox="0 0 ${W} ${H}"><path d="M960 460 C1080 420 1140 410 1180 420" pathLength="1" stroke="${C.gold}" stroke-width="6" fill="none" stroke-dasharray="1" data-a="draw 6 .8"/><path d="M960 700 C1080 680 1140 650 1180 640" pathLength="1" stroke="${C.gold}" stroke-width="6" fill="none" stroke-dasharray="1" data-a="draw 11.2 .8"/></svg>`},

{id:'loop',dur:11,
 caps:[[0,'Description and Discernment work as a loop:','Description আর Discernment একটা চক্রে কাজ করে:'],[4.4,'ask, check, fix — and check again.','বলো, যাচাই করো, ঠিক করো — আবার যাচাই করো।']],
 ring:[[4.4,960,200],[5.4,1640,520],[6.4,960,880],[7.4,1680,650],[10.6,1680,650]],
 html:`<div class="lp" style="left:400px;--c:${C.des};--ct:${C.desT}" data-a="left .2">Description</div>
 <div class="lp" style="left:1120px;--c:${C.dis};--ct:${C.disT}" data-a="right .6">Discernment</div>
 <svg class="ln" viewBox="0 0 ${W} ${H}"><g><path d="M760 330 C860 200 1060 200 1160 330" pathLength="1" stroke="${C.ink}" stroke-width="8" fill="none" stroke-dasharray="1" data-a="draw 1.4 1"/><path d="M1160 750 C1060 880 860 880 760 750" pathLength="1" stroke="${C.ink}" stroke-width="8" fill="none" stroke-dasharray="1" data-a="draw 2.2 1"/></g>
   <path d="M1140 300 l26 34 l-40 6z" fill="${C.ink}" data-a="fade 2.2"/><path d="M780 780 l-26 -34 l40 -6z" fill="${C.ink}" data-a="fade 3.2"/></svg>
 <div class="loopw" style="left:885px;top:170px" data-a="pop 4.6">1 · ask</div><div class="loopw" style="left:1560px;top:480px" data-a="pop 5.6">2 · check</div>
 <div class="loopw" style="left:895px;top:850px" data-a="pop 6.6">3 · fix</div><div class="loopw" style="left:1560px;top:610px" data-a="pop 7.6">4 · check again</div>`},

{id:'diligence',dur:18,
 caps:[[0,'Fourth, Diligence: you are responsible.','চতুর্থ, Diligence: দায়িত্ব তোমার।'],
       [4,'Share only what is needed. Be honest that you used AI.','শুধু দরকারি তথ্য দাও। AI ব্যবহার করেছ — সৎভাবে বলো।'],
       [10.6,'And remember: a login page means private inside.','আর মনে রাখো: লগইন পেজ মানে ভেতরে গোপন তথ্য।']],
 ring:[[3.4,560,380],[5,560,380],[6.6,960,380],[8.2,1360,380],[9.6,1360,380],[11.4,1230,700],[16,1230,700]],
 html:`${chip('4','Diligence','You are responsible',C.dil,C.dilT,.2)}
 <div class="sh" data-a="fade 1 1.2"><div>${SHIELD}</div></div>
 <div class="dg" style="left:400px" data-a="up 4.2"><span>📄🔒</span>Share only<br>what’s needed</div>
 <div class="dg" style="left:800px" data-a="up 5.8"><span class="tag">Made with AI help</span>Be honest<br>about AI</div>
 <div class="dg" style="left:1200px" data-a="up 7.4"><span>✍️</span>You own<br>the result</div>
 <div class="door" data-a="up 10.6"><div class="dpanel"><div class="dsign">${LOCK}<span>Private inside</span></div></div></div>
 <div class="agent" data-a="right 12"><span class="sp">${SPARK}</span>AI agent</div>
 <div class="nope" data-a="stamp 14">?</div>`},

{id:'recap',dur:13,
 caps:[[0,'Delegation. Description. Discernment. Diligence.','Delegation। Description। Discernment। Diligence।'],
       [5.4,'The AI does the work faster. You stay responsible.','AI কাজটা দ্রুত করে। দায়িত্ব থাকে তোমার।']],
 ring:[[6.6,1555,822],[12,1555,822]],
 html:`<div class="tiles">
   <div class="tile" style="--c:${C.del};--ct:${C.delT}" data-a="up .2"><b>Delegation</b><span>Who does what?</span></div>
   <div class="tile" style="--c:${C.des};--ct:${C.desT}" data-a="up 1.4"><b>Description</b><span>Tell it clearly</span></div>
   <div class="tile" style="--c:${C.dis};--ct:${C.disT}" data-a="up 2.6"><b>Discernment</b><span>Check what comes back</span></div>
   <div class="tile" style="--c:${C.dil};--ct:${C.dilT}" data-a="up 3.8"><b>Diligence</b><span>You are responsible</span></div></div>
 <div class="ayw" style="left:1400px;top:300px;width:320px" data-a="up 5">${AYESHA}</div>
 <div class="cvok" data-a="pop 6.4">CV ✓</div>`}
];

/* ---------- keyframes ---------- */
const E='cubic-bezier(.2,.7,.2,1)';
function anim(el,spec){
  const [name,st,du]=spec.trim().split(/\s+/); const t0=+st*1000; let d=(du?+du:.7)*1000;
  let kf;
  switch(name){
   case 'fade':kf=[{opacity:0},{opacity:1}];break;
   case 'up':kf=[{opacity:0,transform:'translateY(50px)'},{opacity:1,transform:'none'}];break;
   case 'left':kf=[{opacity:0,transform:'translateX(-90px)'},{opacity:1,transform:'none'}];break;
   case 'right':kf=[{opacity:0,transform:'translateX(90px)'},{opacity:1,transform:'none'}];break;
   case 'pop':kf=[{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'scale(1.06)',offset:.7},{opacity:1,transform:'scale(1)'}];d=(du?+du:.55)*1000;break;
   case 'stamp':kf=[{opacity:0,transform:'scale(2.4) rotate(-20deg)'},{opacity:1,transform:'scale(1) rotate(-8deg)'}];d=(du?+du:.4)*1000;break;
   case 'draw':kf=[{strokeDashoffset:1},{strokeDashoffset:0}];break;
   case 'fly':{const [dx,dy]=(el.dataset.fly||'0,0').split(',').map(Number);kf=[{opacity:0,transform:`translate(${dx}px,${dy}px) scale(.9)`},{opacity:1,transform:`translate(${dx}px,${dy}px) scale(1)`,offset:.15},{opacity:1,transform:'none'}];break;}
   case 'spin':kf=[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}];return el.animate(kf,{duration:d,delay:t0,iterations:6,easing:'linear',fill:'both'});
   default:kf=[{opacity:0},{opacity:1}];
  }
  if(name==='draw'){el.style.strokeDashoffset=1}
  return el.animate(kf,{duration:d,delay:t0,easing:E,fill:'both'});
}
function ringAnim(el,path,dur){
  if(!path||!path.length){el.style.opacity=0;return []}
  const T=dur*1000; const first=path[0];
  const kf=[{transform:`translate(${first[1]}px,${first[2]}px) scale(.4)`,opacity:0,offset:0},{transform:`translate(${first[1]}px,${first[2]}px) scale(.4)`,opacity:0,offset:Math.max(0,(first[0]-.4)/dur)}];
  path.forEach(([t,x,y],i)=>kf.push({transform:`translate(${x}px,${y}px) scale(1)`,opacity:1,offset:Math.min(1,t/dur)}));
  kf.push({transform:kf[kf.length-1].transform,opacity:1,offset:1});
  // keep offsets non-decreasing
  for(let i=1;i<kf.length;i++) if(kf[i].offset<kf[i-1].offset) kf[i].offset=kf[i-1].offset;
  return [el.animate(kf,{duration:T,easing:'linear',fill:'both'})];
}

/* ---------- player ---------- */
let master=null,root,stage,capEl,capBn,dotsEl,btnPlay,cur=-1,anims=[],t0=0,tPaused=0,playing=true,raf=0,speed=1,onExit=null,renderMode=false;
const sceneDur=i=>SCENES[i].dur;
function build(){
  if(root) return;
  root=document.createElement('div'); root.id='intro'; root.setAttribute('role','dialog'); root.setAttribute('aria-label','The four Ds');
  root.innerHTML=`<div class="i-wrap"><div class="i-stage" id="i-stage"></div></div>
   <div class="i-bar"><button data-i="prev" aria-label="Previous">◀</button><button data-i="play" aria-label="Pause">❚❚</button><button data-i="next" aria-label="Next">▶</button>
   <div class="i-dots" id="i-dots"></div><button data-i="speed" title="Speed">1×</button><button data-i="bn" title="Bangla">বাংলা</button><button data-i="exit" aria-label="Close">✕</button></div>`;
  document.body.appendChild(root);
  stage=root.querySelector('#i-stage');
  dotsEl=root.querySelector('#i-dots'); btnPlay=root.querySelector('[data-i=play]');
  dotsEl.innerHTML=SCENES.map((s,i)=>`<button data-go="${i}" aria-label="Scene ${i+1}"><i></i></button>`).join('');
  root.addEventListener('click',e=>{const b=e.target.closest('[data-i]');const g=e.target.closest('[data-go]');
    if(g){show(+g.dataset.go);return}
    if(!b) {togglePlay();return}
    const a=b.dataset.i; if(a==='prev')show(Math.max(0,cur-1)); else if(a==='next')advance(); else if(a==='play')togglePlay(); else if(a==='exit')close();
    else if(a==='speed'){speed=speed===1?.75:speed===.75?1.25:1;b.textContent=speed+'×';anims.forEach(x=>x.playbackRate=speed)}
    else if(a==='bn'){root.classList.toggle('bn')}});
  addEventListener('resize',fit); fit();
}
function fit(){ if(!root) return; const s=Math.min(innerWidth/W,(innerHeight-(renderMode?0:64))/H); stage.style.transform=`scale(${s})`; stage.parentElement.style.width=W*s+'px'; stage.parentElement.style.height=H*s+'px'; }
function sceneHTML(i){
  const sc=SCENES[i];
  return `<div class="i-bg"></div>${sc.html}<div class="ring" aria-hidden="true"></div>
   <div class="i-brand"><span>AI Fluency Lab</span> · the four Ds</div>
   <div class="i-cap"><p class="en"></p><p class="bnc" lang="bn"></p></div>`;
}
function show(i){
  cur=i; anims.forEach(a=>a.cancel()); anims=[];
  stage.innerHTML=sceneHTML(i);
  stage.querySelectorAll('[data-a]').forEach(el=>{ el.dataset.a.split('|').forEach(sp=>anims.push(anim(el,sp))) });
  anims.push(...ringAnim(stage.querySelector('.ring'),SCENES[i].ring,sceneDur(i)));
  master=stage.animate([{outlineColor:'transparent'},{outlineColor:'transparent'}],{duration:sceneDur(i)*1000+60000,fill:'both'}); anims.push(master);
  capEl=stage.querySelector('.i-cap .en'); capBn=stage.querySelector('.i-cap .bnc');
  [...dotsEl.children].forEach((d,k)=>d.className=k<i?'done':k===i?'on':'');
  t0=performance.now(); tPaused=0;
  if(renderMode||!playing) anims.forEach(a=>a.pause()); else anims.forEach(a=>{a.playbackRate=speed;a.play()});
  setCaption(0);
}
function setCaption(t){
  const caps=SCENES[cur].caps; let c=caps[0]; for(const k of caps) if(t>=k[0]) c=k;
  if(capEl.textContent!==c[1]){capEl.textContent=c[1];capBn.textContent=c[2];capEl.parentElement.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:renderMode?1:350,fill:'both'})}
}
function sceneTime(){ return master?(master.currentTime||0)/1000:0; }
function tick(){
  if(!root||root.hidden) return;
  const t=sceneTime(); setCaption(t);
  const prog=Math.min(1,t/sceneDur(cur)); const on=dotsEl.children[cur]; if(on) on.querySelector('i').style.width=(prog*100)+'%';
  if(playing&&t>=sceneDur(cur)){ if(cur<SCENES.length-1) show(cur+1); else {playing=false;btnPlay.textContent='▶';btnPlay.setAttribute('aria-label','Play');finale()} }
  raf=requestAnimationFrame(tick);
}
function finale(){
  if(root.querySelector('.i-end')) return;
  const d=document.createElement('div'); d.className='i-end';
  d.innerHTML=`<button data-i="exit">Start with Ayesha’s phone →</button><button data-replay="1">↺ Watch again</button>`;
  d.querySelector('[data-replay]').onclick=e=>{e.stopPropagation();d.remove();playing=true;btnPlay.textContent='❚❚';show(0)};
  stage.appendChild(d);
}
function advance(){ if(cur<SCENES.length-1) show(cur+1); }
function togglePlay(){ playing=!playing; btnPlay.textContent=playing?'❚❚':'▶'; btnPlay.setAttribute('aria-label',playing?'Pause':'Play'); anims.forEach(a=>playing?a.play():a.pause()); }
function open(opts={}){
  build(); root.hidden=false; onExit=opts.onExit||null; playing=!opts.paused; btnPlay.textContent=playing?'❚❚':'▶';
  if(opts.bn) root.classList.add('bn');
  show(opts.scene||0); cancelAnimationFrame(raf); raf=requestAnimationFrame(tick);
  try{ if(opts.fullscreen&&!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}) }catch(e){}
}
function close(){ if(!root) return; root.hidden=true; anims.forEach(a=>a.cancel()); anims=[]; cancelAnimationFrame(raf); if(onExit) onExit(); }
document.addEventListener('keydown',e=>{
  if(!root||root.hidden) return;
  const k=e.key; let used=true;
  if(k===' '||k==='k') togglePlay(); else if(k==='ArrowRight') advance(); else if(k==='ArrowLeft') show(Math.max(0,cur-1));
  else if(k==='Escape') close(); else if(k==='b'||k==='B') root.classList.toggle('bn'); else used=false;
  if(used){e.preventDefault();e.stopImmediatePropagation()}
},true);

/* ---------- deterministic seek, for the video renderer ---------- */
function seek(i,t){ renderMode=true; build(); root.hidden=false; root.classList.add('render'); fit(); if(i!==cur) show(i); anims.forEach(a=>{a.pause();a.currentTime=t*1000}); setCaption(t); }

window.INTRO={open,close,seek,SCENES,W,H};
})();
