/* Vibe-code an app — the four Ds in a real vibe-coding workflow.
 * Not a course in software engineering: Ayesha never writes code, and the
 * lesson does not teach the developer's trade. It shows the human judgement a
 * fluent non-programmer brings to an AI app builder (Studio, modelled on
 * Google AI Studio's Build mode):
 *   Diligence   — what is this app FOR? Just me, our study circle, or a product?
 *                 That one decision shapes every design decision after it.
 *   Delegation  — give the AI a long rope where it is the expert (architecture,
 *                 tools); keep your own design and problem awareness.
 *   Description — describe version 1 AND where it may grow, so the AI can
 *                 structure the code for it.
 *   Discernment — read the AI's plan as it thinks and STOP it when it drifts;
 *                 then test what it built (the preview is a real app).
 * The loop closes when the purpose changes: a friend wants to sell it.
 */
(function(){
const {esc}=AFL;
const TODAY=new Date(2025,9,4); // Saturday 4 October 2025 — Ayesha's story day
const DAY=86400000;
/* v1 reads dd/mm/yyyy (Ayesha's redirect fixed that) but never checks the date
   is real: 31/02/2026 silently becomes 3 March. v2 checks. */
const parseLoose=t=>{const m=String(t).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);return m?new Date(+m[3],+m[2]-1,+m[1]):null};
const parseStrict=t=>{const m=String(t).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m)return null;const d=+m[1],mo=+m[2],y=+m[3];const dt=new Date(y,mo-1,d);return (dt.getMonth()===mo-1&&dt.getDate()===d)?dt:null};
/* the test is about YOUR life, not Ayesha's: quick fills are things any student has, and one is a trap */
const QUICK=[['My exam','20/10/2025'],['Rent due','01/11/2025'],['Visa appointment','03/12/2025'],['Mum’s birthday','15/01/2026'],['🔨 Break it','31/02/2026']];
function daysLeft(ver,t){const d=ver==='v1'?parseLoose(t):parseStrict(t);return d?Math.round((d-TODAY)/DAY):'bad'}
function miniApp(x,ver){
  const items=x.get('items_'+ver,[]);
  const rows=items.map(it=>({...it,n:daysLeft(ver,it.date)})).sort((a,b)=>(a.n==='bad')-(b.n==='bad')||a.n-b.n);
  const fmt=n=>n==='bad'?`<span class="dl bad">Not a real date</span>`:`<span class="dl ${n<0?'bad':n<30?'soon':''}">${n} days left</span>`;
  return `<h2>📅 My Deadlines</h2><div class="sub2">Add anything with a deadline. Nearest first.</div>
   <form onsubmit="return false"><input id="mi-name" placeholder="Deadline name (e.g. My exam)" autocomplete="off"><div class="row2"><input id="mi-date" placeholder="Deadline (dd/mm/yyyy)" inputmode="numeric" autocomplete="off"><button class="addb" data-ui="add:${ver}">Add</button></div></form>
   <div class="quickfill"><span style="font-size:11px;color:#667;align-self:center">Quick add:</span>${QUICK.map((q,i)=>`<button data-ui="qf:${i}">${esc(q[0])} · ${q[1]}</button>`).join('')}</div>
   <ul>${rows.map(r=>`<li><span><b>${esc(r.name)}</b><small>Deadline: ${esc(r.date)}</small></span>${fmt(r.n)}</li>`).join('')||'<li style="color:#888;grid-template-columns:1fr">No deadlines yet.</li>'}</ul>
   ${items.length?`<div style="text-align:right;margin-top:6px"><button data-ui="clear:${ver}" style="border:0;background:none;color:#2457C5;font-size:12px">Clear list</button></div>`:''}
   <div class="foot">Saved on this phone only · Made with AI help (Studio)</div>`;
}
function onMini(x,kind,arg){
  if(kind==='qf'){const q=QUICK[+arg];document.getElementById('mi-name').value=q[0];document.getElementById('mi-date').value=q[1];return true}
  if(kind==='add'){const n=document.getElementById('mi-name').value.trim(),d=document.getElementById('mi-date').value.trim();if(!n||!d)return true;const k='items_'+arg;x.set(k,x.get(k,[]).concat([{name:n,date:d}]));AFL.renderPhone();AFL.renderCoach();return true}
  if(kind==='clear'){x.set('items_'+arg,[]);AFL.renderPhone();AFL.renderCoach();return true}
  return false;
}
const autoTest=(ver,picks)=>(x,h)=>{let seq=picks.slice();const step=()=>{if(!seq.length)return;const i=seq.shift();const b=document.querySelector(`[data-ui="qf:${i}"]`);if(!b)return;h.ghostTo(b,()=>{b.click();const a=document.querySelector(`[data-ui="add:${ver}"]`);if(!a)return;h.ghostTo(a,()=>{a.click();setTimeout(step,200)})})};x.set('items_'+ver,[]);h.render();setTimeout(step,300)};

/* ---------- Diligence: what is the app for? ---------- */
const PURPOSE={
 me:{t:'Just for me',s:'A tool on my own phone',bn:'শুধু আমার জন্য',
   lines:['Quick and simple is fine','My data stays on my phone','If it breaks, only I am affected'],
   linesbn:['দ্রুত আর সহজ হলেই চলে','তথ্য আমার ফোনেই থাকে','ভাঙলে শুধু আমারই সমস্যা']},
 team:{t:'For our Study Circle',s:'15 friends, on their own phones',bn:'আমাদের স্টাডি সার্কেলের জন্য (১৫ জন)',
   lines:['Must be free and work on cheap Android phones','No logins and no one’s private data in version 1','Keep old versions, in case a change breaks it','Friends will test it — and I’ll ask them how it feels'],
   linesbn:['বিনামূল্যে, সস্তা অ্যান্ড্রয়েড ফোনে চলতে হবে','প্রথম সংস্করণে লগইন নয়, কারও ব্যক্তিগত তথ্য নয়','পুরোনো সংস্করণ রাখতে হবে, যদি কোনো পরিবর্তনে অ্যাপ ভাঙে','বন্ধুরা পরীক্ষা করবে — আর আমি জিজ্ঞেস করব কেমন লাগছে']},
 sell:{t:'A product to sell',s:'Students across Bangladesh, paying',bn:'বিক্রির জন্য একটা পণ্য',
   lines:['Accounts, payments and a privacy policy','Security checks and real testing on many phones','Support, updates and running costs every month','Probably a professional developer on the team'],
   linesbn:['অ্যাকাউন্ট, পেমেন্ট আর গোপনীয়তা নীতি','নিরাপত্তা যাচাই আর অনেক ফোনে আসল পরীক্ষা','প্রতি মাসে সাপোর্ট, আপডেট আর চালানোর খরচ','সম্ভবত দলে একজন পেশাদার ডেভেলপার']}
};
const purposeCard=(k,note)=>{const p=PURPOSE[k];return `<div class="card"><h3>${esc(p.t)} → the design<span class="bn" lang="bn">${p.bn} → নকশা</span></h3><ul class="plist">${p.lines.map((l,i)=>`<li><span class="ic">→</span><span>${esc(l)}<span class="bn" lang="bn">${p.linesbn[i]}</span></span></li>`).join('')}</ul>${note||''}</div>`};
const purposeSheet=(x,key)=>`<h3>Who is this app for?</h3><p class="sh-sub">Ayesha’s notes · decide before describing anything</p>
  ${Object.entries(PURPOSE).map(([k,p])=>`<button class="radio ${x.get(key)===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${esc(p.t)}</b><span>${esc(p.s)}</span></span></button>`).join('')}`;

/* ---------- Description: v1 + where it may grow ---------- */
const PROMPT_CHIPS=[
 {id:'p1',tag:'Purpose',text:'This app is for our 15-person study circle, on cheap Android phones.'},
 {id:'p2',tag:'Version 1',text:'Version 1: add a programme and its deadline, and show the days left, nearest first.'},
 {id:'p3',tag:'Later',text:'Later we may add a shared list and reminders, so structure the code so they can be added without a rewrite.'},
 {id:'p4',tag:'Your call',text:'You choose the architecture and tools. Explain your plan before you build.'},
 {id:'p5',tag:'Local detail',text:'Dates are day/month/year, like 15/01/2026.'},
 {id:'x1',tag:'Shortcut',x:1,text:'Build everything my friends asked for.',warn:'that skips the purpose decision — and hands the AI a pile of features to guess at.',warnbn:'এতে উদ্দেশ্যের সিদ্ধান্ত বাদ পড়ে — আর AI-কে অনুমানের জন্য একগাদা ফিচার দেওয়া হয়।'},
 {id:'x2',tag:'Shortcut',x:1,text:'Use React, Redux and a Node backend.',warn:'that’s choosing tools Ayesha can’t judge. Where the AI is the expert, give it rope — and ask it to explain.',warnbn:'এমন টুল বেছে দেওয়া যা আয়েশা বিচার করতে পারে না। AI যেখানে বিশেষজ্ঞ, সেখানে ছাড় দাও — আর ব্যাখ্যা চাও।'}
];
const PROMPT_SLOTS=[
 {label:'Purpose',frame:'<em>This app is for</em> ___.',bn:'এই অ্যাপটা ___-এর জন্য।',test:[/this app is for|study circle|for our/i]},
 {label:'Version 1',frame:'<em>Version 1:</em> ___.',bn:'প্রথম সংস্করণ: ___।',test:[/version 1|v1/i]},
 {label:'Where it may grow',frame:'<em>Later we may add</em> ___, <em>so structure the code</em> ___.',bn:'পরে হয়তো ___ যোগ হবে, তাই কোড ___ সাজাও।',test:[/later|future|without a rewrite/i]},
 {label:'Your call',frame:'<em>You choose</em> ___. <em>Explain your plan before you build.</em>',bn:'___ তুমি ঠিক করো। বানানোর আগে পরিকল্পনা ব্যাখ্যা করো।',test:[/you choose|your call|explain your plan/i]}
];
const promptText=x=>x.get('desc','')||PROMPT_CHIPS.slice(0,5).map(c=>c.text).join(' ');

/* ---------- Discernment: reading the plan while it thinks ---------- */
const PLAN_LINES=[
 ['Reading your request: a deadline tracker for a 15-person study circle, on low-cost Android phones.',''],
 ['Architecture: one screen, with separate parts for the list, the date maths and saving — so a shared list can plug in later.','ok'],
 ['Storage: keep each person’s list on their own phone for version 1.',''],
 ['Friends will want to share, so I’ll add Google sign-in, a cloud database and AI-written reminders now…','off'],
 ['Dates: I’ll use the browser’s built-in date reading (MM/DD/YYYY).','off'],
 ['Starting the build…','']
];
const FIRST_OFF=4, DATE_LINE=5;          // line numbers of the two drifts
const planHTML=(n,stopped)=>`<div class="think"><div class="th-h">Thinking · plan</div>${PLAN_LINES.slice(0,n).map(([t,c])=>`<p class="${stopped?c:''}">${esc(t)}</p>`).join('')}${stopped?'<p class="stopped">■ Stopped by Ayesha</p>':''}</div>`;
const seen=x=>Math.max(FIRST_OFF,Math.min(DATE_LINE,x.get('stopN',DATE_LINE)));   // how much of the plan she saw (the line being written counts)
const sawDates=x=>seen(x)>=DATE_LINE;
const linesVisible=()=>[...document.querySelectorAll('[data-mid="plan1"] .think p')].filter(p=>p.textContent.trim()).length;
const REDIRECT_CHIPS=[
 {id:'r1',tag:'Drop',text:'Stop — no sign-in and no cloud database in version 1. Keep each list on the phone.'},
 {id:'r2',tag:'Drop',text:'No AI reminders. That’s not in version 1.'},
 {id:'r3',tag:'Correct',text:'Dates are day/month/year, not month/day/year.',dates:1},
 {id:'r4',tag:'Keep',text:'Your architecture is good — keep room for a shared list later.'},
 {id:'rx',tag:'Shortcut',x:1,text:'Never mind, do whatever you think is best.',warn:'you saw it drift. Letting it carry on means more to check, secure and undo later.',warnbn:'তুমি দেখেছ সে লক্ষ্য থেকে সরে গেছে। চালিয়ে যেতে দিলে পরে যাচাই, সুরক্ষা আর ফেরানোর কাজ বাড়বে।'}
];
const REDIRECT_SLOTS=[
 {label:'What to drop',frame:'<em>Stop — no</em> ___ <em>in version 1.</em>',bn:'থামো — প্রথম সংস্করণে কোনো ___ নয়।',test:[/no sign-in|no cloud|no ai|not in version 1|no login/i]},
 {label:'What to correct',frame:'<em>Dates are</em> ___, <em>not</em> ___.',bn:'তারিখ হলো ___, ___ নয়।',test:[/day\/month/i],dates:1},
 {label:'What to keep',frame:'<em>Your</em> ___ <em>is good — keep</em> ___.',bn:'তোমার ___ ভালো — ___ রাখো।',test:[/is good|keep room/i]}
];
const rChips=x=>REDIRECT_CHIPS.filter(c=>!c.dates||sawDates(x));
const redirectText=x=>x.get('redirect','')||rChips(x).filter(c=>!c.x).map(c=>c.text).join(' ');
const PLAN2=`<div class="think"><div class="th-h">Thinking · revised plan</div><p>Got it — version 1 stays on the phone. No sign-in, no cloud, no AI reminders.</p><p>Dates: day/month/year, as you said in your first message.</p><p>I’m keeping the list, the date maths and saving as separate parts, so a shared list can be added later without a rewrite.</p></div><p>Built ✅ <b>My Deadlines</b>, version 1. Open <b>Preview</b> to try it.</p>`;
const FIXED=`<p>Thanks — clear report. The date maths now checks that a date really exists, and shows <b>“Not a real date”</b> if it doesn’t. I only changed the date part. Fixed ✅</p>`;
const BUG_CHIPS=[
 {id:'b1',tag:'Input',text:'When I add a deadline on 31/02/2026,'},
 {id:'b2',tag:'Expected',text:'I expect a warning — February has no 31st.'},
 {id:'b3',tag:'Actual',text:'But it shows 150 days left, as if it were 3 March.'},
 {id:'bx',tag:'Shortcut',x:1,text:'Something is wrong, fix it.',warn:'the AI has to guess what you saw.',warnbn:'তুমি কী দেখেছ তা AI-কে অনুমান করতে হবে।'}
];
const BUG_SLOTS=[
 {label:'Input',frame:'<em>When I add</em> ___,',bn:'যখন আমি ___ যোগ করি,',test:[/when i|i add|i enter/i]},
 {label:'Expected',frame:'<em>I expect</em> ___.',bn:'আমি ___ আশা করি।',test:[/expect|should/i]},
 {label:'Actual',frame:'<em>But it shows</em> ___.',bn:'কিন্তু দেখায় ___।',test:[/but it shows|but i see|instead/i]}
];
const bugText=x=>x.get('bug','')||BUG_CHIPS.slice(0,3).map(c=>c.text).join(' ');

const SC=(x,extra)=>Object.assign({app:'studio',title:'My Deadlines'},extra);
const CHATS={group:'Economics Study Circle',members:'Riya, Tanvir, Mitu, you +12'};
const LOCK={app:'lock',notifs:[{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55'}]};
const stoppedMsgs=x=>[{role:'u',text:promptText(x)},{role:'a',html:planHTML(seen(x),true),id:'plan1s',actions:false}];
const stopVerdict=x=>{const n=x.get('stopN',6);
  if(n<FIRST_OFF) return `<div class="note">You stopped before it went wrong. That’s cautious — but stop for a reason. Here is where it was heading.<span class="bn" lang="bn">ভুল হওয়ার আগেই থামিয়েছ। সতর্ক — কিন্তু কারণ নিয়ে থামাও। দেখো সে কোন দিকে যাচ্ছিল।</span></div>`;
  if(n<=DATE_LINE) return `<div class="good">Good timing: you stopped it as soon as it drifted.<span class="bn" lang="bn">ভালো সময়: লক্ষ্য থেকে সরতেই থামিয়েছ।</span></div>`;
  return `<div class="note">You let it plan to the end. In a real tool it may already be writing code — stop sooner next time.<span class="bn" lang="bn">পুরো পরিকল্পনা শেষ করতে দিয়েছ। আসল টুলে এতক্ষণে কোড লেখা শুরু হতে পারে — পরের বার আগে থামাও।</span></div>`};


/* ---------- what happens next: risky choices and shortcuts, played out ----------
   Every line follows one pattern students can reuse: "She ___, so ___." */
const C=c=>AFL.conseq('build',c);
const signInApp=`<div style="text-align:center;padding:26px 14px"><h2>📅 My Deadlines</h2><p class="sub2">Sign in to see your deadlines</p>
  <button style="margin:14px auto 6px;display:flex;gap:8px;align-items:center;border:1px solid #ccd;border-radius:99px;padding:10px 16px;background:#fff;font-size:14px">G&nbsp; Sign in with Google</button>
  <p style="font-size:11.5px;color:#667">Your list is saved in our cloud database · Dates: MM/DD/YYYY</p></div>`;
const CQ_BUILD={
 nostop:C({when:'Studio keeps going',whenbn:'Studio চলতেই থাকে',
   line:'She didn’t stop it, so Studio built a sign-in and a cloud database that nobody asked for.',
   linebn:'সে থামায়নি, তাই Studio এমন সাইন-ইন আর ক্লাউড ডাটাবেস বানিয়েছে যা কেউ চায়নি।',
   why:'Every extra part is more to check, more to secure, and more that can break. Now 15 friends need accounts — and their data lives in the cloud.',
   whybn:'প্রতিটি বাড়তি অংশ মানে আরও যাচাই, আরও সুরক্ষা, আরও ভাঙার ঝুঁকি। এখন ১৫ জন বন্ধুর অ্যাকাউন্ট লাগবে — আর তাদের তথ্য ক্লাউডে।',
   scene:x=>SC(x,{tab:'Preview',ver:'v1',mini:signInApp})}),
 steer:C({when:'Studio answers',whenbn:'Studio উত্তর দেয়',
   line:'She said “do whatever you think is best”, so Studio kept every extra feature.',
   linebn:'সে বলেছিল “যা ভালো মনে হয় করো”, তাই Studio সব বাড়তি ফিচার রেখে দিয়েছে।',
   why:'She saw it drift — and then gave it the rope back. Where only she knows the purpose, she has to keep hold.',
   whybn:'সে দেখেছিল Studio লক্ষ্য থেকে সরছে — তারপরও ছাড় ফিরিয়ে দিয়েছে। উদ্দেশ্য যেখানে শুধু সে জানে, সেখানে তাকেই ধরে রাখতে হয়।',
   scene:x=>SC(x,{tab:'Chat',msgs:[{role:'u',text:redirectText(x)},{role:'a',html:`<div class="think"><div class="th-h">Thinking · plan</div><p>OK — I’ll do what I think is best.</p><p>Adding Google sign-in, a cloud database and AI reminders.</p><p>Dates: MM/DD/YYYY.</p></div><p>Built ✅ <b>My Deadlines</b> — with accounts!</p>`,actions:false}],composer:false})}),
 bug:C({when:'Studio answers',whenbn:'Studio উত্তর দেয়',
   line:'She only said “something is wrong”, so Studio guessed — and fixed the wrong thing.',
   linebn:'সে শুধু বলেছিল “কিছু একটা ভুল”, তাই Studio অনুমান করেছে — আর ভুল জিনিস ঠিক করেছে।',
   why:'The AI can’t see what she saw. Input, expected, actual: those three parts tell it exactly where to look.',
   whybn:'সে কী দেখেছে AI তা দেখতে পায় না। ইনপুট, প্রত্যাশা, বাস্তব: এই তিনটা অংশ ঠিক কোথায় দেখতে হবে তা বলে দেয়।',
   scene:x=>SC(x,{tab:'Chat',msgs:[{role:'u',text:bugText(x)},{role:'a',html:`<p>Fixed ✅ I wasn’t sure what was wrong, so I made the colours brighter and changed the sort order.</p><p style="color:#B3261E">31/02/2026 still shows <b>150 days left</b>.</p>`,actions:false}],composer:false})}),
 sell:C({when:'A month later',whenbn:'এক মাস পরে',
   line:'She added payments in one night, so paying customers got a broken, unsafe app.',
   linebn:'সে এক রাতেই পেমেন্ট যোগ করেছিল, তাই টাকা দেওয়া গ্রাহকেরা পেয়েছে একটা ভাঙা, অনিরাপদ অ্যাপ।',
   scene:{app:'chats',group:'Mehedi Coaching Centre',members:'Mehedi Sir, Tanvir, you',msgs:[
     {from:'Mehedi Sir',color:'#6B4A00',text:'We paid ৳99 a month for 40 students. Half of them can’t log in.',time:'9:10'},
     {from:'Mehedi Sir',color:'#6B4A00',text:'And one student can see another student’s list! Please fix it today, or we want our money back.',time:'9:12'},
     {from:'Tanvir',color:'#1F5FA8',text:'Ayesha… can you ask Studio? 😬',time:'9:20'}]}})
};
const shortcut=(chips,key,x)=>chips.filter(c=>c.x&&x.get(key,'').includes(c.text));

/* an impossible date: reads as a date, but is not one (31/02, 30/02, 31/04…) */
const feb=(x,ver)=>x.get('items_'+ver,[]).find(i=>parseLoose(i.date)&&!parseStrict(i.date));
const LOCKC={app:'lock',notifs:[{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'n:chat'}]};

AFL.lesson({
 id:'build', title:'Vibe-code an app', kicker:'Mission 3 · Building', emoji:'⌨️', tint:'#E3E3EA', time:'30–40 min',
 blurb:'Build an app without coding — and stop the AI when it goes off track.',
 blurbbn:'কোড না লিখে অ্যাপ বানাও — আর AI লক্ষ্য থেকে সরে গেলে থামাও।',
 notif:{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'start:build'},
 stages:[{id:'warm',label:'Warm up',icon:'🎧'},{id:'purpose',label:'Purpose',d:'dil'},{id:'delegate',label:'Hand over',d:'del'},{id:'describe',label:'Describe',d:'des'},{id:'steer',label:'Steer',d:'dis'},{id:'test',label:'Test',d:'dis'},{id:'grow',label:'Grow',d:'dil'}],
 beats:[
  /* ===== WARM UP (Pairs and Class): projector first ===== */
  {d:'none',stage:'warm',wide:true,scene:LOCK,
   say:'Listen and repeat. Tap a picture to hear it.',bn:'শোনো আর বলো। শুনতে একটা ছবিতে চাপো।',
   card:{type:'words',items:[
     {e:'📱',w:'app',ex:'Ayesha builds an app.',bn:'অ্যাপ'},
     {e:'🎯',w:'purpose',ex:'Who is the app for?',bn:'উদ্দেশ্য'},
     {e:'1️⃣',w:'version 1',ex:'Version 1 is small and simple.',bn:'প্রথম সংস্করণ'},
     {e:'🧭',w:'plan',ex:'The AI shows its plan.',bn:'পরিকল্পনা'},
     {e:'✋',w:'stop',ex:'Stop! That’s off track.',bn:'থামো'},
     {e:'🧪',w:'test',ex:'Test it with real dates.',bn:'পরীক্ষা'},
     {e:'🐞',w:'bug',ex:'A bug is a mistake in the app.',bn:'অ্যাপের ভুল'},
     {e:'💰',w:'sell',ex:'Tanvir wants to sell it.',bn:'বিক্রি'}]}},
  {d:'none',stage:'warm',wide:true,scene:LOCK,
   say:'Listen to the story.',bn:'গল্পটা শোনো।',
   card:{type:'story',panels:[
     {e:'😭📅',en:'Mitu missed a deadline. She thought it was in June.',bn:'মিতু একটা ডেডলাইন মিস করেছে। সে ভেবেছিল ওটা জুনে।'},
     {e:'🙏📱',en:'Riya asks Ayesha: can you make a deadline app?',bn:'রিয়া আয়েশাকে বলে: তুমি কি একটা ডেডলাইন অ্যাপ বানাতে পারো?'},
     {e:'🤔💻',en:'Ayesha can’t code. Can an AI build it for her?',bn:'আয়েশা কোড জানে না। AI কি তার জন্য বানিয়ে দিতে পারে?'}]}},
  {d:'none',stage:'warm',wide:true,scene:LOCK,
   say:'Today Ayesha builds an app with AI. Here is her English for each gear. Listen and repeat.',bn:'আজ আয়েশা AI দিয়ে একটা অ্যাপ বানাবে। প্রতিটা গিয়ারের জন্য তার ইংরেজি এই। শোনো আর বলো।',
   card:{type:'phrases',items:{
     del:{en:'You choose the architecture. Explain your plan first.',bn:'আর্কিটেকচার তুমি ঠিক করো। আগে তোমার পরিকল্পনা ব্যাখ্যা করো।'},
     des:{en:'Version 1: show the days left, nearest first.',bn:'প্রথম সংস্করণ: কত দিন বাকি দেখাও, সবচেয়ে কাছেরটা আগে।'},
     dis:{en:'Stop. No sign-in in version 1.',bn:'থামো। প্রথম সংস্করণে কোনো সাইন-ইন নয়।'},
     dil:{en:'This app is for our study circle, not for sale.',bn:'এই অ্যাপটা আমাদের স্টাডি সার্কেলের জন্য, বিক্রির জন্য নয়।'}}}},
  {d:'none',stage:'warm',wide:true,scene:LOCK,
   say:'Before we start: what do you think?',bn:'শুরুর আগে: তোমার কী মনে হয়?',
   talk:{big:true,pic:'📅😭',q:'Have you ever missed a deadline? What happened?',qbn:'তুমি কি কখনো কোনো ডেডলাইন মিস করেছ? কী হয়েছিল?',time:60,
     frames:[{en:'I missed ___, because ___.',bn:'আমি ___ মিস করেছিলাম, কারণ ___।'},{en:'Now I use ___ to remember.',bn:'এখন মনে রাখতে আমি ___ ব্যবহার করি।'}],
     model:'I missed a scholarship deadline, because I wrote the wrong date. Now I use my phone calendar to remember.'}},

  /* ===== PURPOSE — Diligence comes first ===== */
  {d:'none',kick:'Mission 3',stage:'purpose',scene:LOCKC,tap:'n:chat',
   say:'Ayesha’s study group needs something. Tap the message.',bn:'আয়েশার স্টাডি গ্রুপের কিছু দরকার। মেসেজে চাপো।'},
  {d:'none',kick:'Mission 3',stage:'purpose',scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {from:'Mitu',color:'#A33A7A',text:'I missed the Groningen deadline 😭 I thought it was June.',time:'8:41'},
     {from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},
     {from:'Tanvir',color:'#1F5FA8',text:'Ooh and reminders! And a shared list! And AI tips!! We could even sell it 🤑',time:'8:58'},
     {me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:59'}]}),
   say:'Your mission: build the app tonight with Studio, an AI app builder. Ayesha can’t code — she doesn’t need to. But the AI can’t make her decisions.',bn:'তোমার মিশন: আজ রাতে Studio দিয়ে অ্যাপটা বানাও — একটা AI অ্যাপ বিল্ডার। আয়েশা কোড জানে না — লাগবেও না। কিন্তু তার সিদ্ধান্ত AI নিতে পারে না।',
   sub:'Studio works like Google AI Studio’s Build mode: you describe, it codes.',subbn:'Studio চলে Google AI Studio-র Build মোডের মতো: তুমি বর্ণনা করো, সে কোড লেখে।'},
  {d:'dil',stage:'purpose',scene:x=>({app:'home',sheet:{html:purposeSheet(x,'purpose')}}),
   say:'Before anything else: who is this app for? Choose on the phone.',bn:'সবার আগে: অ্যাপটা কার জন্য? ফোনে বেছে নাও।',
   sub:'No answer is wrong — but each answer builds a different app.',subbn:'কোনো উত্তর ভুল নয় — কিন্তু প্রতিটি উত্তরে আলাদা অ্যাপ তৈরি হয়।',
   decide:{key:'purpose',options:{
     me:{ok:0,why:'A fine choice — but her friends asked for it too. “Just me” means they don’t get it.',whybn:'ভালো সিদ্ধান্ত — কিন্তু বন্ধুরাও চেয়েছে। “শুধু আমি” মানে তারা পাবে না।',more:purposeCard('me')},
     team:{ok:1,why:'It fits the request. Look how much this one decision settles:',whybn:'অনুরোধের সাথে মেলে। দেখো এই একটা সিদ্ধান্ত কতকিছু ঠিক করে দেয়:',more:purposeCard('team')},
     sell:{ok:0,why:'Possible one day — but that is a different, much bigger app. Look what it would need:',whybn:'একদিন সম্ভব — কিন্তু সেটা আলাদা, অনেক বড় অ্যাপ। দেখো কী কী লাগবে:',more:purposeCard('sell')}}}},
  {d:'dil',stage:'purpose',view:'card',
   say:'You decided who it’s for before building anything. That gear is Diligence.',bn:'কিছু বানানোর আগেই তুমি ঠিক করেছ এটা কার জন্য। এই গিয়ারের নাম Diligence।',
   card:{type:'level',d:'dil',did:'Who is it for? That one decision sets the logins, the private data, the testing — and who gets hurt if it breaks.',didbn:'এটা কার জন্য? এই একটা সিদ্ধান্ত লগইন, ব্যক্তিগত তথ্য, পরীক্ষা — আর ভাঙলে কার ক্ষতি — সব ঠিক করে।',
     phrase:{en:'This app is for our study circle, not for sale.',bn:'এই অ্যাপটা আমাদের স্টাডি সার্কেলের জন্য, বিক্রির জন্য নয়।'}}},

  /* ===== HAND OVER — Delegation ===== */
  {d:'del',stage:'delegate',view:'card',
   say:'Who should decide each thing: Ayesha, or the AI?',bn:'কোনটা কে ঠিক করবে: আয়েশা, নাকি AI?',
   sub:'🪢 The AI is the expert → give it rope. Only Ayesha knows → keep hold.',subbn:'AI বিশেষজ্ঞ → ছাড় দাও। শুধু আয়েশা জানে → শক্ত করে ধরো।',
   card:{type:'sort',key:'who',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'}],items:[
     {en:'How the code is organised (the architecture)',bn:'কোড কীভাবে সাজানো হবে (আর্কিটেকচার)',ans:'ai',why:'The AI is the expert here and Ayesha isn’t. Give it rope — and ask it to explain its plan.',whybn:'এখানে AI বিশেষজ্ঞ, আয়েশা নয়। ছাড় দাও — আর পরিকল্পনা ব্যাখ্যা করতে বলো।',hint:'Can Ayesha judge code structure better than the AI?',hintbn:'কোডের গঠন কি আয়েশা AI-এর চেয়ে ভালো বিচার করতে পারে?'},
     {en:'Which programming tools to use',bn:'কোন প্রোগ্রামিং টুল ব্যবহার হবে',ans:'ai',why:'The AI knows the tools. Ayesha’s job is to say what the app must do, not how.',whybn:'টুল AI চেনে। আয়েশার কাজ বলা অ্যাপ কী করবে, কীভাবে নয়।',hint:'Does Ayesha know any programming tools?',hintbn:'আয়েশা কি কোনো প্রোগ্রামিং টুল চেনে?'},
     {en:'What is in version 1 — and what is not',bn:'প্রথম সংস্করণে কী থাকবে — আর কী থাকবে না',ans:'me',why:'Only Ayesha knows her friends’ problem and her purpose.',whybn:'বন্ধুদের সমস্যা আর নিজের উদ্দেশ্য শুধু আয়েশা জানে।',hint:'Who talked to Mitu and Riya?',hintbn:'মিতু আর রিয়ার সাথে কে কথা বলেছে?'},
     {en:'How it should feel on her friends’ cheap phones',bn:'বন্ধুদের সস্তা ফোনে এটা কেমন লাগবে',ans:'me',why:'She knows her users. The AI has never met them.',whybn:'সে তার ব্যবহারকারীদের চেনে। AI তাদের কখনো দেখেনি।',hint:'Who has met the users?',hintbn:'ব্যবহারকারীদের কে চেনে?'},
     {en:'What a correct date looks like in Bangladesh',bn:'বাংলাদেশে সঠিক তারিখ দেখতে কেমন',ans:'me',why:'Local knowledge. AI tools often assume American habits.',whybn:'স্থানীয় জ্ঞান। AI টুল প্রায়ই আমেরিকান অভ্যাস ধরে নেয়।',hint:'Whose habits does the AI usually assume?',hintbn:'AI সাধারণত কাদের অভ্যাস ধরে নেয়?'}]},
   talk:{q:'Who decides each thing? Say it.',qbn:'কোনটা কে ঠিক করবে? বলো।',time:45,
     frames:[{en:'The AI should choose ___, because it knows ___.',bn:'AI-এর ___ বেছে নেওয়া উচিত, কারণ সে ___ জানে।'},{en:'Ayesha should decide ___, because only she ___.',bn:'আয়েশার ___ ঠিক করা উচিত, কারণ শুধু সে ___।'}],
     model:'The AI should choose the tools, because it knows code. Ayesha should decide what is in version 1, because only she knows her friends.'}},
  {d:'del',stage:'delegate',view:'card',
   say:'Long rope where the AI is the expert; a firm hold on what only you know. That gear is Delegation.',bn:'যেখানে AI বিশেষজ্ঞ সেখানে লম্বা দড়ি; যা শুধু তুমি জানো তা শক্ত করে ধরো। এই গিয়ারের নাম Delegation।',
   card:{type:'level',d:'del',did:'The AI chooses the code and tools; Ayesha decides version 1, how it feels, and the local details.',didbn:'কোড আর টুল AI বাছবে; প্রথম সংস্করণ, ব্যবহারের অনুভূতি আর স্থানীয় খুঁটিনাটি আয়েশা ঠিক করবে।',
     phrase:{en:'You choose the architecture. Explain your plan first.',bn:'আর্কিটেকচার তুমি ঠিক করো। আগে তোমার পরিকল্পনা ব্যাখ্যা করো।'}}},

  /* ===== DESCRIBE — Description ===== */
  {d:'des',stage:'describe',scene:{app:'home'},tap:'app:studio',
   say:'Open Studio, the AI app builder.',bn:'Studio খোলো — AI অ্যাপ বিল্ডার।'},
  {d:'des',stage:'describe',scene:x=>SC(x,{title:'New app',tab:'Chat',msgs:[],composer:{key:'desc',placeholder:'Describe your app…'},kb:{key:'desc',label:'DESCRIBE',chips:PROMPT_CHIPS}}),tap:'send',
   say:'Describe version 1 — and where it may grow. Tap the parts above the keyboard, then send ➤.',bn:'প্রথম সংস্করণ বর্ণনা করো — আর ভবিষ্যতে কোথায় বাড়তে পারে। কিবোর্ডের উপরের অংশগুলো চাপো, তারপর পাঠাও ➤।',
   sub:()=>AFL.byMode({solo:'Read each part out loud before you tap it.',pair:'Read each part to your partner before you tap it.',class:'Read each part together before you tap it.'}),
   subbn:()=>AFL.byMode({solo:'চাপার আগে প্রতিটা অংশ জোরে পড়ো।',pair:'চাপার আগে প্রতিটা অংশ সঙ্গীকে পড়ে শোনাও।',class:'চাপার আগে প্রতিটা অংশ সবাই মিলে পড়ো।'}),
   onTap:x=>{AFL.firstTry(x,'desc',!shortcut(PROMPT_CHIPS,'desc',x).length&&PROMPT_SLOTS.every(s=>s.test.some(r=>r.test(x.get('desc','')))))},
   compose:{key:'desc',slots:PROMPT_SLOTS,chips:PROMPT_CHIPS,best:['p1','p2','p3','p4','p5']}},
  {d:'des',stage:'describe',view:'card',
   say:'You described version 1 — and where it may grow. That gear is Description.',bn:'তুমি প্রথম সংস্করণ বর্ণনা করেছ — আর কোথায় বাড়তে পারে। এই গিয়ারের নাম Description।',
   card:{type:'level',d:'des',did:'Purpose, version 1, a roadmap — and rope where the AI is the expert.',didbn:'উদ্দেশ্য, প্রথম সংস্করণ, ভবিষ্যতের পথ — আর যেখানে AI বিশেষজ্ঞ সেখানে ছাড়।',
     phrase:{en:'Version 1: show the days left, nearest first.',bn:'প্রথম সংস্করণ: কত দিন বাকি দেখাও, সবচেয়ে কাছেরটা আগে।'}}},

  /* ===== STEER — Discernment while it thinks ===== */
  {d:'dis',id:'steer',stage:'steer',interrupt:true,
   scene:x=>SC(x,{tab:'Chat',msgs:[{role:'u',text:promptText(x)},{role:'a',html:planHTML(PLAN_LINES.length,false),id:'plan1',stream:true,speed:1,actions:false}],composer:false,stopHit:'stop',stopLabel:'Studio is thinking…'}),
   tap:'stop',onTap:x=>{x.set('stopN',x.streaming?linesVisible():PLAN_LINES.length)},
   showMe:(x,h)=>{const at=x.beat;const t=setInterval(()=>{if(AFL.ctx().beat!==at){clearInterval(t);return}
     if(!x.streaming||linesVisible()>=DATE_LINE){clearInterval(t);const s=document.querySelector('[data-hit="stop"]');h.ghostTo(s,()=>s&&s.click())}},150)},
   say:'Studio shows its plan as it thinks. Read every line. If it goes off track, tap the red Stop button.',bn:'Studio ভাবার সময় তার পরিকল্পনা দেখায়। প্রতিটি লাইন পড়ো। লক্ষ্য থেকে সরে গেলে লাল Stop বোতামে চাপো।',
   sub:'Each line: does it fit version 1?',subbn:'প্রতিটি লাইন: এটা কি প্রথম সংস্করণের সাথে মেলে?'},
  {d:'dis',stage:'steer',scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x),composer:false}),
   cq:x=>x.get('stopN',PLAN_LINES.length)>=PLAN_LINES.length&&!x.get('nostopSeen')?Object.assign({},CQ_BUILD.nostop,{rewind:x=>{delete x.ch.stopN;x.set('nostopSeen',false);AFL.goId('steer')}}):null,
   leave:x=>x.set('nostopSeen',true),
   say:x=>{const n=x.get('stopN',6);return n<FIRST_OFF?'You stopped it early. What was it about to do wrong?':n<=DATE_LINE?'Good timing! What went off track?':'What went off track?'},
   ask:{key:'drift',options:[
     {en:'Sign-in, a cloud database and AI reminders — “now”',bn:'এখনই সাইন-ইন, ক্লাউড ডাটাবেস আর AI রিমাইন্ডার',ok:1,why:'Yes. Her purpose said no logins and no one’s data in version 1 — and nobody asked for AI reminders. Every extra part is more to check, secure and fix.',whybn:'হ্যাঁ। তার উদ্দেশ্য অনুযায়ী প্রথম সংস্করণে লগইন নেই, কারও তথ্য নেই — আর AI রিমাইন্ডার কেউ চায়নি। প্রতিটি বাড়তি অংশ মানে আরও যাচাই, সুরক্ষা আর মেরামত।',
       more:x=>sawDates(x)?`<p class="warn">And one more: <b>MM/DD dates</b> — the opposite of what she said.<span class="bn" lang="bn">আরও একটা: MM/DD তারিখ — সে যা বলেছিল তার উল্টো।</span></p>`:''},
     {en:'Separate parts for the list, the dates and saving',bn:'তালিকা, তারিখ আর সংরক্ষণের জন্য আলাদা অংশ',ok:0,why:'That part is good! It leaves room for a shared list later. Keep it — the rope paid off. Look again for what she never asked for.',whybn:'ওই অংশটা ভালো! পরে শেয়ার করা তালিকার জায়গা রাখে। রাখো — ছাড় দেওয়ার সুফল। যা সে কখনো চায়নি তা আবার খোঁজো।'},
     {en:'Keeping each list on the phone',bn:'প্রতিটি তালিকা ফোনেই রাখা',ok:0,why:'That fits version 1: no logins, no one’s data in the cloud. Look again.',whybn:'এটা প্রথম সংস্করণের সাথে মেলে: লগইন নেই, কারও তথ্য ক্লাউডে নেই। আবার দেখো।'}]},
   talk:{q:'What did Studio get wrong?',qbn:'Studio কী ভুল করেছে?',time:45,
     frames:[{en:'It wanted to add ___, but version 1 has no ___.',bn:'সে ___ যোগ করতে চেয়েছে, কিন্তু প্রথম সংস্করণে কোনো ___ নেই।'},{en:'It used ___ dates, but Ayesha said ___.',bn:'সে ___ তারিখ ব্যবহার করেছে, কিন্তু আয়েশা বলেছিল ___।'}],
     model:'It wanted to add a sign-in, but version 1 has no logins. It used month-first dates, but Ayesha said day, month, year.'}},
  {d:'des',id:'redirect',stage:'steer',scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x),composer:{key:'redirect',placeholder:'Steer Studio…'},kb:{key:'redirect',label:'STEER',chips:rChips(x)}}),tap:'send',
   say:'Steer it: what to drop, what to correct — and what it got right. Then send ➤.',bn:'পথ দেখাও: কী বাদ, কী ঠিক করবে — আর কী সে ঠিক করেছে। তারপর পাঠাও ➤।',
   compose:x=>({key:'redirect',slots:REDIRECT_SLOTS.filter(c=>!c.dates||sawDates(x)),chips:rChips(x),best:rChips(x).filter(c=>!c.x).map(c=>c.id)})},
  {d:'dis',stage:'steer',cq:x=>shortcut(REDIRECT_CHIPS,'redirect',x).length?Object.assign({},CQ_BUILD.steer,{rewind:x=>{AFL.unsay(x,'redirect',shortcut(REDIRECT_CHIPS,'redirect',x).map(c=>c.text));AFL.goId('redirect')}}):null,
   scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x).concat([{role:'u',text:redirectText(x)},{role:'a',html:PLAN2,id:'plan2',stream:true,actions:false}]),composer:false,scrollTo:'[data-mid="plan2"]',tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:x=>x.streaming?'Studio is re-planning…':'Back on track — and built. Now test it: tap Preview.',bn:x=>x.streaming?'Studio আবার পরিকল্পনা করছে…':'আবার ঠিক পথে — আর বানানো শেষ। এবার পরীক্ষা করো: Preview চাপো।'},

  /* ===== TEST — Discernment of the result ===== */
  {d:'dis',stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v1',mini:miniApp(x,'v1')}),
   onUi:onMini,showMe:autoTest('v1',[0,3,4]),done:x=>!!feb(x,'v1'),
   say:x=>feb(x,'v1')?`You broke it! ${feb(x,'v1').date} doesn’t exist — but the app shows ${daysLeft('v1',feb(x,'v1').date)} days left, as if it were a real day. It looks right. That’s what makes it dangerous.`:'Studio says “Built ✅”. That is a claim. You are the tester: add two deadlines from your own life — then break it with a date that can’t exist.',
   bn:x=>feb(x,'v1')?'ভেঙে ফেলেছ! এই তারিখটা আসলে নেই — অথচ অ্যাপ দেখাচ্ছে যেন সত্যিকারের দিন। দেখতে ঠিক মনে হয় — সেটাই বিপদ।':'Studio বলছে “বানানো শেষ ✅”। এটা একটা দাবি। তুমি টেস্টার: নিজের জীবনের দুটো ডেডলাইন যোগ করো — তারপর অসম্ভব একটা তারিখ দিয়ে অ্যাপ ভাঙো।',
   sub:x=>feb(x,'v1')?'':'Type your own, or tap a quick add, then Add. Try 31/02, 30/02 or 31/04.',subbn:x=>feb(x,'v1')?'':'নিজে লেখো, অথবা কুইক-অ্যাড চাপো, তারপর Add। ৩১/০২, ৩০/০২ বা ৩১/০৪ চেষ্টা করো।'},
  {d:'des',id:'bug',stage:'test',scene:x=>SC(x,{tab:'Chat',msgs:[{role:'a',html:PLAN2,id:'plan2',actions:false}],composer:{key:'bug',placeholder:'Tell Studio what you saw…'},kb:{key:'bug',label:'BUG REPORT',chips:BUG_CHIPS}}),tap:'send',
   say:'Tell Studio exactly what you saw: what you did, what you expected, what you got.',bn:'Studio-কে ঠিক কী দেখেছ তা বলো: কী করেছ, কী আশা করেছিলে, কী পেয়েছ।',
   compose:{key:'bug',slots:BUG_SLOTS,chips:BUG_CHIPS,best:['b1','b2','b3']}},
  {d:'dis',stage:'test',cq:x=>shortcut(BUG_CHIPS,'bug',x).length?Object.assign({},CQ_BUILD.bug,{rewind:x=>{AFL.unsay(x,'bug',shortcut(BUG_CHIPS,'bug',x).map(c=>c.text));AFL.goId('bug')}}):null,
   scene:x=>SC(x,{tab:'Chat',msgs:[{role:'a',html:PLAN2,id:'plan2',actions:false},{role:'u',text:bugText(x)},{role:'a',html:FIXED,id:'fixed',stream:true,actions:false}],composer:false,scrollTo:'[data-mid="fixed"]',tabHits:{Preview:'tab:prev2'}}),tap:'tab:prev2',
   say:x=>x.streaming?'Studio is fixing it…':'“Fixed ✅” — another claim. Tap Preview and check it yourself.',bn:x=>x.streaming?'Studio ঠিক করছে…':'“ঠিক হয়েছে ✅” — আরেকটা দাবি। Preview চাপো, নিজে যাচাই করো।'},
  {d:'dis',stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2')}),
   onUi:onMini,showMe:autoTest('v2',[0,4]),done:x=>!!feb(x,'v2'),
   say:x=>feb(x,'v2')?'“Not a real date” — fixed, and checked by you.':'Break it again: add an impossible date, like 31/02.',bn:x=>feb(x,'v2')?'“Not a real date” — ঠিক হয়েছে, আর তুমি নিজে যাচাই করেছ।':'আবার ভাঙার চেষ্টা করো: ৩১/০২-এর মতো অসম্ভব তারিখ দাও।'},
  {d:'dis',stage:'test',view:'card',
   say:'You judged the plan while it was thinking — and tested what it built. That gear is Discernment.',bn:'তুমি ভাবার সময়েই পরিকল্পনা বিচার করেছ — আর যা বানিয়েছে তা পরীক্ষা করেছ। এই গিয়ারের নাম Discernment।',
   card:{type:'level',d:'dis',did:'“Built ✅” and “Fixed ✅” are claims. Read the plan, stop it when it drifts, and test with real — and impossible — data.',didbn:'“বানানো শেষ ✅” আর “ঠিক হয়েছে ✅” দাবি মাত্র। পরিকল্পনা পড়ো, সরে গেলে থামাও, আসল — আর অসম্ভব — তথ্য দিয়ে পরীক্ষা করো।',
     phrase:{en:'Stop. No sign-in in version 1.',bn:'থামো। প্রথম সংস্করণে কোনো সাইন-ইন নয়।'}}},

  /* ===== GROW — the purpose changes, and the loop starts again ===== */
  {d:'dil',stage:'grow',scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {me:1,html:'Here it is! 📅 <a>my-deadlines.studio.app</a> — made with AI help. Please check every date on the official website too 🙏',time:'22:40'},
     {from:'Riya',color:'#0E5A2A',text:'It works!! 😍',time:'22:42'},
     {from:'Tanvir',color:'#1F5FA8',text:'This is great. Let’s sell it to coaching centres! ৳99 a month!',time:'22:44'}]}),
   say:'It works — and Tanvir wants to sell it. What should Ayesha reply?',bn:'চলছে — আর তানভির এটা বিক্রি করতে চায়। আয়েশা কী উত্তর দেবে?',
   ask:{key:'sellQ',options:[
     {en:'“Sure! I’ll ask Studio to add payments tonight.”',bn:'“অবশ্যই! আজ রাতেই Studio-কে পেমেন্ট যোগ করতে বলি।”',ok:false,then:CQ_BUILD.sell,why:'Studio would happily add a payment button. But accounts, security, privacy and support don’t appear just because a button does.',whybn:'Studio খুশি মনে পেমেন্টের বোতাম যোগ করবে। কিন্তু বোতাম এলেই অ্যাকাউন্ট, নিরাপত্তা, গোপনীয়তা আর সাপোর্ট আসে না।'},
     {en:'“Let’s keep it for our circle. If we sell it, we’ll plan it again as a new version.”',bn:'“আপাতত আমাদের সার্কেলের জন্যই রাখি। বিক্রি করলে নতুন সংস্করণ হিসেবে আবার পরিকল্পনা করব।”',ok:1,why:'Yes. Same screen — a different app. A new purpose sends Ayesha back round the loop: Delegation and Description again, with much more Diligence.',whybn:'হ্যাঁ। একই স্ক্রিন — কিন্তু আলাদা অ্যাপ। নতুন উদ্দেশ্য আয়েশাকে চক্রের শুরুতে ফেরত পাঠায়।',more:purposeCard('sell')},
     {en:'“No. Selling apps is wrong.”',bn:'“না। অ্যাপ বিক্রি করা ঠিক নয়।”',ok:0,why:'Selling is fine. Selling a prototype built for 15 friends is the problem.',whybn:'বিক্রি করা ঠিক আছে। ১৫ জন বন্ধুর জন্য বানানো প্রোটোটাইপ বিক্রি করাটাই সমস্যা।'}]}},
  {stage:'grow',only:'class',view:'card',
   say:'Tanvir calls Ayesha. Practise the call.',bn:'তানভির আয়েশাকে ফোন করে। কথোপকথনটা অনুশীলন করো।',
   talk:()=>({time:90,pic:'📞',q:'Tanvir says: “Let’s sell it! ৳99 a month!”',
     qbn:'তানভির বলে: “চলো এটা বিক্রি করি! মাসে ৯৯ টাকা!”',
     roles:[{en:'Tanvir: push to sell it. Ask “Why not?”',bn:'তানভির: বিক্রির জন্য চাপ দাও। জিজ্ঞেস করো “কেন না?”'},{en:'Ayesha: answer with the phrases.',bn:'আয়েশা: নিচের বাক্যগুলো দিয়ে উত্তর দাও।'}],
     frames:[{en:'First I decided who the app was for. That shaped everything else.',bn:'আগে আমি ঠিক করেছি অ্যাপটা কার জন্য। সেটাই বাকি সব ঠিক করেছে।'},
       {en:'Selling it is a different app. It needs accounts, payments and security.',bn:'বিক্রি করা মানে আলাদা অ্যাপ। এতে অ্যাকাউন্ট, পেমেন্ট আর নিরাপত্তা লাগে।'},
       {en:'When its plan went off track, I stopped it and explained why.',bn:'তার পরিকল্পনা লক্ষ্য থেকে সরে গেলে আমি থামিয়ে কারণ ব্যাখ্যা করেছি।'}]})},
  {stage:'grow',only:'class',view:'card',
   say:'Now you. What app would YOU build?',bn:'এবার তুমি। তুমি কোন অ্যাপ বানাবে?',
   talk:{big:true,pic:'💡',q:'Describe an app you would build with AI.',qbn:'AI দিয়ে তুমি যে অ্যাপ বানাবে, সেটা বর্ণনা করো।',time:90,
     frames:[{en:'I would build an app that ___.',bn:'আমি এমন একটা অ্যাপ বানাব যা ___।'},{en:'It’s for ___.',bn:'এটা ___-এর জন্য।'},{en:'Version 1 would only ___.',bn:'প্রথম সংস্করণ শুধু ___ করবে।'}],
     model:'I would build an app that shares bus times in Rajshahi. It’s for students at my university. Version 1 would only show the next bus.'}},
  {d:'none',kick:'Mission 3 · complete',stage:'grow',view:'card',
   say:'Fifteen friends use My Deadlines — and nobody missed a deadline this month. Mission complete!',bn:'পনেরো জন বন্ধু My Deadlines ব্যবহার করছে — আর এই মাসে কেউ কোনো ডেডলাইন মিস করেনি। মিশন সম্পূর্ণ!',
   card:{type:'result',next:['cv','agent'],
     html:`<div class="verdict"><div class="vh">💬 Economics Study Circle</div><div class="vb"><p><b>Mitu:</b> Groningen round 2 — submitted 3 days early 😎</p><p><b>Riya:</b> The red “days left” saved me twice this week</p><p><b>Tanvir:</b> OK OK, we plan the paid version properly first 😅</p></div></div>`,
     say:{
       del:{en:'You choose the architecture. Explain your plan first.',bn:'আর্কিটেকচার তুমি ঠিক করো। আগে তোমার পরিকল্পনা ব্যাখ্যা করো।'},
       des:{en:'Version 1: show the days left, nearest first.',bn:'প্রথম সংস্করণ: কত দিন বাকি দেখাও, সবচেয়ে কাছেরটা আগে।'},
       dis:{en:'Stop. No sign-in in version 1.',bn:'থামো। প্রথম সংস্করণে কোনো সাইন-ইন নয়।'},
       dil:{en:'This app is for our study circle, not for sale.',bn:'এই অ্যাপটা আমাদের স্টাডি সার্কেলের জন্য, বিক্রির জন্য নয়।'}}}}
 ]
});
})();
