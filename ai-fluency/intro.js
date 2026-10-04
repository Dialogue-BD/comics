/* The 4Ds — onboarding motion graphic for the projector.
 * One 1920×1080 stage, seven scenes: the two interlocking loops of the
 * AI Fluency framework (Delegation–Diligence, Description–Discernment).
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
/* geometry helpers: a stadium-shaped loop (rounded rectangle with semicircle ends) */
const stad=(x,y,w,h)=>{ if(h>w){const r=w/2;return `M${x} ${y+r} A${r} ${r} 0 0 1 ${x+w} ${y+r} V${y+h-r} A${r} ${r} 0 0 1 ${x} ${y+h-r} Z`} const r=h/2;return `M${x+r} ${y} H${x+w-r} A${r} ${r} 0 0 1 ${x+w-r} ${y+h} H${x+r} A${r} ${r} 0 0 1 ${x+r} ${y} Z`};
const arrowHead=(x,y,deg,col)=>`<path d="M0 -18 L30 0 L0 18 Z" fill="${col}" transform="translate(${x} ${y}) rotate(${deg})"/>`;
const node=(x,y,label,col,colT,t,sub)=>`<div class="node" style="left:${x-130}px;top:${y-130}px;--c:${col};--ct:${colT}" data-a="pop ${t}"><b>${label}</b>${sub?`<small>${sub}</small>`:''}</div>`;
const q=(x,y,txt,col,t,w)=>`<div class="qchip" style="left:${x}px;top:${y}px;--c:${col};${w?`width:${w}px`:''}" data-a="left ${t}">${txt}</div>`;
const pill=(x,y,txt,t,cls='')=>`<div class="arcl ${cls}" style="left:${x}px;top:${y}px" data-a="pop ${t}">${txt}</div>`;
/* the framework's cross: Delegation ⇄ Diligence vertical, Description ⇄ Discernment horizontal */
const VL=[760,120,400,720], HL=[260,310,1400,400];   // x,y,w,h
const CROSS=(opts={})=>{const V=stad(...VL), Hh=stad(...HL); const f=opts.faint?'opacity=".22"':'';
 return `<svg class="ln" viewBox="0 0 ${W} ${H}"><defs>
  <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset=".49" stop-color="${C.del}"/><stop offset=".51" stop-color="${C.dil}"/></linearGradient>
  <linearGradient id="gH" x1="0" y1="0" x2="1" y2="0"><stop offset=".49" stop-color="${C.des}"/><stop offset=".51" stop-color="${C.dis}"/></linearGradient></defs>
  <g ${f}><path d="${V}" pathLength="1" stroke="url(#gV)" stroke-width="30" fill="none" stroke-dasharray="1" data-a="draw ${opts.t1||0.4} 1.4"/>
  <g data-a="fade ${opts.t2||1.2} .2"></g>
  <path d="${Hh}" pathLength="1" stroke="url(#gH)" stroke-width="30" fill="none" stroke-dasharray="1" data-a="draw ${opts.t2||1.2} 1.4"/>
  <g data-a="fade ${(opts.t2||1.2)+1.3} .3"><path d="M1160 296 V324" stroke="#F4F1E6" stroke-width="48"/><path d="M1160 282 V338" stroke="${C.del}" stroke-width="30"/>
   <path d="M769 694 L777 726" stroke="#F4F1E6" stroke-width="48"/><path d="M765 680 L781 740" stroke="${C.dil}" stroke-width="30"/></g></g>
 </svg>`};
const DPILLS=t=>`${pill(870,92,'Delegation',t,'c-del')}${pill(890,812,'Diligence',t+.4,'c-dil')}${pill(120,482,'Description',t+.8,'c-des')}${pill(1600,482,'Discernment',t+1.2,'c-dis')}`;

/* ---------- scenes ----------
 * dur: seconds at a slow reading pace (the projector default).
 * caps: [t, English, Bangla] — the narration, word for word.
 * data-a="anim start [duration]"   data-fly="dx,dy" for fly-ins / moves
 * ring: [[t,x,y],…] the gold eye's path (centre point, stage px)
 */
const SCENES=[
{id:'fluency',dur:17,
 caps:[[0,'Many people use AI. Fewer people are fluent with it.','অনেকেই AI ব্যবহার করে। দক্ষভাবে ব্যবহার করে কম মানুষ।'],
       [5,'AI fluency means working with AI in a way that is effective, efficient, ethical and safe.','AI-তে দক্ষতা মানে AI-এর সাথে এমনভাবে কাজ করা যা কার্যকর, দ্রুত, নৈতিক আর নিরাপদ।'],
       [12,'And it always keeps you, the human, in the loop.','আর এতে সবসময় তুমি, মানুষটি, নিয়ন্ত্রণে থাকো।']],
 ring:[[12.4,1300,480],[13.6,1060,560],[14.8,1300,480],[16.4,1300,480]],
 html:`<div class="col" style="left:150px;top:200px" data-a="left .2"><div class="colh">Using AI</div></div>
 <div class="ayw" style="left:180px;top:330px;width:200px" data-a="up .5">${AYESHA}</div>
 <div class="btnx" style="left:420px;top:450px" data-a="pop 1.2">▶ Go</div>
 <div class="outfly" style="left:600px;top:440px" data-a="right 1.8">${SPARK}<span>?</span></div>
 <div class="mute" style="left:180px;top:640px;position:absolute;width:600px" data-a="fade 2.4">Ask once. Copy. Hope it’s right.</div>
 <div class="col" style="left:1000px;top:200px" data-a="right 3.2"><div class="colh" style="color:${C.forest}">AI fluency</div></div>
 <div class="ayw" style="left:1200px;top:330px;width:200px" data-a="up 3.6">${AYESHA}</div>
 <div class="you sp2b" style="left:1010px;top:500px" data-a="pop 4">${SPARK}</div>
 <div class="adjs" data-a="fade 5.2"><span data-a="pop 6">effective</span><span data-a="pop 7">efficient</span><span data-a="pop 8">ethical</span><span data-a="pop 9">safe</span></div>
 <div class="hitl" data-a="pop 13">human in the loop</div>`},

{id:'pairs',dur:15,
 caps:[[0,'AI fluency has four parts: the four Ds.','AI-তে দক্ষতার চারটা অংশ: চারটা D।'],
       [3.6,'Delegation. Description. Discernment. Diligence.','Delegation। Description। Discernment। Diligence।'],
       [8,'They work in two pairs. Each pair is a loop.','এরা দুই জোড়ায় কাজ করে। প্রতিটি জোড়া একটা চক্র।']],
 ring:[[12.2,960,480],[14.6,960,480]],
 html:`<div class="tile4 t4s" style="--c:${C.del};--ct:${C.delT};left:760px;top:150px" data-fly="-220,130" data-a="fade 3.6|move 8.2 1.4">Delegation</div>
 <div class="tile4 t4s" style="--c:${C.des};--ct:${C.desT};left:160px;top:405px" data-fly="820,-125" data-a="fade 4.3|move 8.2 1.4">Description</div>
 <div class="tile4 t4s" style="--c:${C.dis};--ct:${C.disT};left:1360px;top:405px" data-fly="-820,75" data-a="fade 5|move 8.2 1.4">Discernment</div>
 <div class="tile4 t4s" style="--c:${C.dil};--ct:${C.dilT};left:760px;top:660px" data-fly="220,-180" data-a="fade 5.6|move 8.2 1.4">Diligence</div>
 <svg class="ln" viewBox="0 0 ${W} ${H}">
  <path d="${stad(715,110,490,760)}" pathLength="1" stroke="${C.ink}" stroke-width="10" fill="none" stroke-dasharray="1" data-a="draw 9.8 1.2"/>
  <path d="${stad(110,355,1700,250)}" pathLength="1" stroke="${C.ink}" stroke-width="10" fill="none" stroke-dasharray="1" data-a="draw 10.8 1.2"/></svg>
 ${pill(1230,150,'Loop 1 ↕',11.2)}${pill(130,620,'Loop 2 ↔',12)}`},

{id:'loop1',dur:26,
 caps:[[0,'The first loop is Delegation and Diligence: the big decisions.','প্রথম চক্র: Delegation আর Diligence — বড় সিদ্ধান্তগুলো।'],
       [5,'Delegation asks: What am I trying to do? Which AI tool fits? Who does what?','Delegation জিজ্ঞেস করে: আমি কী করতে চাই? কোন AI টুল মানানসই? কে কোন কাজ করবে?'],
       [12.5,'Diligence asks: Is this safe and fair? Who needs to know AI helped? Who is responsible for the result?','Diligence জিজ্ঞেস করে: এটা কি নিরাপদ ও ন্যায্য? AI সাহায্য করেছে — কাকে জানাতে হবে? ফলাফলের দায় কার?'],
       [20.5,'Each answer changes the other.','একটার উত্তর অন্যটাকে বদলে দেয়।']],
 ring:[[20.6,960,120],[21.4,1160,320],[22,1160,640],[22.6,960,840],[23.2,760,640],[23.8,760,320],[24.4,960,120],[25.6,960,120]],
 html:`<div class="ltitle" style="--c:${C.del}" data-a="left .2">Loop 1 · <b>the big decisions</b></div>
 <svg class="ln" viewBox="0 0 ${W} ${H}">
  <path d="${stad(760,120,400,720)}" pathLength="1" stroke="${C.ink}" stroke-width="10" fill="none" stroke-dasharray="1" opacity=".85" data-a="draw .6 1.6"/>
  <g data-a="fade 20.6 .4">${arrowHead(1160,500,90,C.ink)}${arrowHead(760,460,-90,C.ink)}</g></svg>
 ${node(960,320,'Delegation',C.del,C.delT,1.4,'plan')}${node(960,640,'Diligence',C.dil,C.dilT,2.2,'responsibility')}
 ${q(1230,180,'What am I trying to do?',C.del,6)}${q(1230,290,'Which AI tool fits?',C.del,8)}${q(1230,400,'Who does what — me, AI, or both?',C.del,9.8)}
 ${q(270,500,'Is it safe and fair?',C.dil,13.5)}${q(270,610,'Who needs to know AI helped?',C.dil,15.6)}${q(270,720,'Who is responsible for the result?',C.dil,17.8)}
 ${pill(1200,560,'↓ decisions raise questions',20.8)}${pill(330,330,'answers change the plan ↑',22.4)}`},

{id:'loop2',dur:24,
 caps:[[0,'The second loop is Description and Discernment: the conversation.','দ্বিতীয় চক্র: Description আর Discernment — কথোপকথন।'],
       [5.5,'Description: say what you want, how to work, and how the AI should behave.','Description: বলো তুমি কী চাও, কীভাবে কাজ হবে, আর AI কেমন আচরণ করবে।'],
       [12.5,'Discernment: judge what comes back. Then describe again, better.','Discernment: যা ফিরে আসে তা বিচার করো। তারপর আবার, আরও ভালো করে বলো।'],
       [19,'It is a conversation, not a command.','এটা কথোপকথন, আদেশ নয়।']],
 ring:[[12.8,1660,510],[14,1460,710],[15.2,460,710],[16,260,510],[16.8,460,310],[18,1460,310],[18.8,1660,510],[20,1660,510],[23.6,1660,510]],
 html:`<div class="ltitle" style="--c:${C.des}" data-a="left .2">Loop 2 · <b>the conversation</b></div>
 <svg class="ln" viewBox="0 0 ${W} ${H}">
  <path d="${stad(260,310,1400,400)}" pathLength="1" stroke="${C.ink}" stroke-width="10" fill="none" stroke-dasharray="1" opacity=".85" data-a="draw .6 1.6"/>
  <g data-a="fade 13 .4">${arrowHead(1000,310,0,C.ink)}${arrowHead(920,710,180,C.ink)}</g></svg>
 ${node(460,510,'Description',C.des,C.desT,1.4,'say it')}${node(1460,510,'Discernment',C.dis,C.disT,2.2,'judge it')}
 ${q(615,365,'<b>Product</b> — what I want',C.des,6.2,330)}${q(615,470,'<b>Process</b> — how to work',C.des,7.6,330)}${q(615,575,'<b>Performance</b> — how to behave',C.des,9,330)}
 ${q(975,365,'Is the product good?',C.dis,13.2,330)}${q(975,470,'Was the process sound?',C.dis,14.4,330)}${q(975,575,'Did it behave well?',C.dis,15.6,330)}
 ${pill(780,275,'describe → judge',13.4)}${pill(760,675,'← describe again, better',14.6)}
 <div class="cmd" style="left:560px;top:790px" data-a="pop 19.2">command ✗</div><div class="conv" style="left:880px;top:790px" data-a="pop 20.2"><span>💬</span><span>💬</span><span>💬</span> conversation ✓</div>`},

{id:'interlock',dur:18,
 caps:[[0,'The two loops lock together.','দুটো চক্র একসাথে আটকে থাকে।'],
       [3.6,'The first loop makes the big decisions. The second loop does the work.','প্রথম চক্র বড় সিদ্ধান্ত নেয়। দ্বিতীয় চক্র কাজটা করে।'],
       [9.6,'When both loops work well, you reach the sweet spot in the middle: AI fluency.','যখন দুটো চক্রই ভালোভাবে চলে, তখন মাঝখানের সেরা জায়গায় পৌঁছাও: AI-তে দক্ষতা।']],
 ring:[[9.8,960,200],[10.6,960,510],[11.4,400,510],[12.2,960,510],[13,960,820],[13.8,960,510],[14.6,1520,510],[15.2,960,510],[15.8,960,510,2.1],[17.8,960,510,2.1]],
 html:`${CROSS()}${DPILLS(3)}
 <div class="lname" style="left:1210px;top:150px" data-a="fade 5.4">the big decisions ↕</div><div class="lname" style="left:1210px;top:760px" data-a="fade 7.4">the work ↔</div>
 <div class="sweet" data-a="pop 15.6"><b>AI fluency</b><span>the sweet spot</span></div>`},

{id:'example',dur:22,
 caps:[[0,'For example: studying for an exam.','উদাহরণ: পরীক্ষার পড়া।'],
       [3.4,'AI makes practice questions. You answer them.','AI অনুশীলনের প্রশ্ন বানায়। উত্তর দাও তুমি।'],
       [8.2,'No AI in the real exam, and you check facts in your book.','আসল পরীক্ষায় AI নয়, আর তথ্য বই দেখে যাচাই করো।'],
       [13.6,'Ask for five questions. Spot a wrong one. Ask again.','পাঁচটা প্রশ্ন চাও। ভুলটা ধরো। আবার চাও।']],
 ring:[[3.6,960,170],[8.4,960,830],[13.8,300,510],[16.4,1620,510],[18.6,300,510],[21.6,300,510]],
 html:`${CROSS({faint:1,t1:.1,t2:.2})}
 <div class="ltitle" style="--c:${C.forest}" data-a="left .2">📚 <b>Studying for an exam</b></div>
 <div class="exc" style="left:1240px;top:110px;--c:${C.del};--ct:${C.delT}" data-a="pop 3.4"><b>Delegation ↑</b>AI makes practice questions. I answer them.</div>
 <div class="exc" style="left:200px;top:720px;--c:${C.dil};--ct:${C.dilT}" data-a="pop 8.2"><b>Diligence ↓</b>No AI in the real exam. I check facts in my book.</div>
 <div class="exc" style="left:120px;top:190px;--c:${C.des};--ct:${C.desT}" data-a="pop 13.6"><b>← Description</b>“Give me 5 questions on chapter 3.”</div>
 <div class="exc" style="left:1300px;top:720px;--c:${C.dis};--ct:${C.disT}" data-a="pop 16.2"><b>Discernment →</b>Question 4 is wrong. My book says…</div>
 <div class="again" style="left:820px;top:470px" data-a="pop 18.4">↺ ask again</div>`},

{id:'recap',dur:15,
 caps:[[0,'Two loops. Four Ds.','দুটো চক্র। চারটা D।'],[4,'In the middle, where both loops work well: AI fluency.','মাঝখানে, যেখানে দুটো চক্রই ভালো চলে: AI-তে দক্ষতা।'],[9.4,'And you are the human in the loop.','আর চক্রের মানুষটি তুমি।']],
 ring:[[9.6,1690,230],[14.6,1690,230]],
 html:`${CROSS({t1:.1,t2:.6})}${DPILLS(1.4)}
 <div class="sweet" data-a="pop 4.4"><b>AI fluency</b><span>the sweet spot</span></div>
 <div class="ayw" style="left:1580px;top:110px;width:220px" data-a="up 9.4">${AYESHA}</div>`}
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
   case 'move':{const [dx,dy]=(el.dataset.fly||'0,0').split(',').map(Number);kf=[{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}];break;}
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
  path.forEach(([t,x,y,sc],i)=>kf.push({transform:`translate(${x}px,${y}px) scale(${sc||1})`,opacity:1,offset:Math.min(1,t/dur)}));
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
