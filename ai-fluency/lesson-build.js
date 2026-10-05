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
const QUICK=[['Oxford','15/10/2025'],['LSE','31/10/2025'],['Erasmus','01/12/2025'],['Göttingen','15/12/2025'],['Sussex','15/01/2026'],['Test: 31 Feb','31/02/2026']];
function daysLeft(ver,t){const d=ver==='v1'?parseLoose(t):parseStrict(t);return d?Math.round((d-TODAY)/DAY):'bad'}
function miniApp(x,ver){
  const items=x.get('items_'+ver,[]);
  const rows=items.map(it=>({...it,n:daysLeft(ver,it.date)})).sort((a,b)=>(a.n==='bad')-(b.n==='bad')||a.n-b.n);
  const fmt=n=>n==='bad'?`<span class="dl bad">Not a real date</span>`:`<span class="dl ${n<0?'bad':n<30?'soon':''}">${n} days left</span>`;
  return `<h2>📅 My Deadlines</h2><div class="sub2">Add your programmes. Nearest deadline first.</div>
   <form onsubmit="return false"><input id="mi-name" placeholder="Programme (e.g. Oxford)" autocomplete="off"><div class="row2"><input id="mi-date" placeholder="Deadline (dd/mm/yyyy)" inputmode="numeric" autocomplete="off"><button class="addb" data-ui="add:${ver}">Add</button></div></form>
   <div class="quickfill"><span style="font-size:11px;color:#667;align-self:center">From Ayesha’s checklist:</span>${QUICK.map((q,i)=>`<button data-ui="qf:${i}">${esc(q[0])} · ${q[1]}</button>`).join('')}</div>
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
const stoppedMsgs=x=>[{role:'u',text:promptText(x)},{role:'a',html:planHTML(seen(x),true),id:'plan1s',actions:false}];
const stopVerdict=x=>{const n=x.get('stopN',6);
  if(n<FIRST_OFF) return `<div class="note">You stopped before it went wrong. That’s cautious — but stop for a reason. Here is where it was heading.<span class="bn" lang="bn">ভুল হওয়ার আগেই থামিয়েছ। সতর্ক — কিন্তু কারণ নিয়ে থামাও। দেখো সে কোন দিকে যাচ্ছিল।</span></div>`;
  if(n<=DATE_LINE) return `<div class="good">Good timing: you stopped it as soon as it drifted.<span class="bn" lang="bn">ভালো সময়: লক্ষ্য থেকে সরতেই থামিয়েছ।</span></div>`;
  return `<div class="note">You let it plan to the end. In a real tool it may already be writing code — stop sooner next time.<span class="bn" lang="bn">পুরো পরিকল্পনা শেষ করতে দিয়েছ। আসল টুলে এতক্ষণে কোড লেখা শুরু হতে পারে — পরের বার আগে থামাও।</span></div>`};

AFL.lesson({
 id:'build', title:'Vibe-code an app', kicker:'Workflow 3 · Building', emoji:'⌨️', tint:'#E3E3EA', time:'30 min',
 blurb:'Build an app without coding — and see how the four Ds decide what you get.',
 blurbbn:'কোড না লিখে অ্যাপ বানাও — আর দেখো চারটা D কীভাবে ফলাফল ঠিক করে।',
 notif:{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'start:build'},
 stages:[{id:'purpose',label:'Purpose',d:'dil'},{id:'delegate',label:'Hand over',d:'del'},{id:'describe',label:'Describe',d:'des'},{id:'steer',label:'Steer',d:'dis'},{id:'test',label:'Test',d:'dis'},{id:'grow',label:'Grow',d:'dil'}],
 beats:[
  /* ===== PURPOSE — Diligence comes first ===== */
  {d:'none',stage:'purpose',scene:{app:'lock',notifs:[{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'n:chat'}]},tap:'n:chat',
   say:'Ayesha’s study group needs something. Tap the message.',bn:'আয়েশার স্টাডি গ্রুপের কিছু দরকার। মেসেজে চাপো।'},
  {d:'none',stage:'purpose',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {from:'Mitu',color:'#A33A7A',text:'I missed the Groningen deadline 😭 I thought it was June.',time:'8:41'},
     {from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},
     {from:'Tanvir',color:'#1F5FA8',text:'Ooh and reminders! And a shared list! And AI tips!! We could even sell it 🤑',time:'8:58'},
     {me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:59'}]}),
   say:'Ayesha can’t code. With an AI app builder, she doesn’t need to. But the AI can’t make her decisions.',bn:'আয়েশা কোড জানে না। AI অ্যাপ বিল্ডার থাকলে লাগেও না। কিন্তু তার সিদ্ধান্ত AI নিতে পারে না।',
   card:{type:'info',points:[
     {i:'🧭',en:'This is not a coding lesson. Watch <b>where the four Ds decide</b> how the app turns out.',bn:'এটা কোডিংয়ের পাঠ নয়। খেয়াল করো চারটা D কোথায় অ্যাপের ফলাফল ঠিক করে।'},
     {i:'🛠️',en:'Real tools work like this — Google AI Studio’s Build mode, for example. Ours is called Studio.',bn:'বাস্তব টুল এভাবেই কাজ করে — যেমন Google AI Studio-র Build মোড। আমাদেরটার নাম Studio।'}]}},
  {why:'Before describing anything, Ayesha decides who the app is for. That one decision shapes every other.',whybn:'কিছু বর্ণনা করার আগে আয়েশা ঠিক করে অ্যাপটা কার জন্য। এই একটা সিদ্ধান্তই বাকি সব ঠিক করে।',stage:'purpose',scene:x=>({app:'home',sheet:{html:purposeSheet(x,'purpose')}}),
   say:'Before anything else: who is this app for?',bn:'সবার আগে: অ্যাপটা কার জন্য?',
   sub:'No answer is wrong — but each answer builds a different app.',subbn:'কোনো উত্তর ভুল নয় — কিন্তু প্রতিটি উত্তরে আলাদা অ্যাপ তৈরি হয়।',
   decide:{key:'purpose',options:{
     me:{ok:0,why:'A fine choice — but her friends asked for it too. “Just me” means they don’t get it.',whybn:'ভালো সিদ্ধান্ত — কিন্তু বন্ধুরাও চেয়েছে। “শুধু আমি” মানে তারা পাবে না।'},
     team:{ok:1,why:'It fits the request. Look how much it decides for her:',whybn:'অনুরোধের সাথে মেলে। দেখো এটা তার জন্য কতকিছু ঠিক করে দেয়:'},
     sell:{ok:0,why:'Possible one day — but that is a different, much bigger app. Look what it would need:',whybn:'একদিন সম্ভব — কিন্তু সেটা আলাদা, অনেক বড় অ্যাপ। দেখো কী কী লাগবে:'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'},
   card:x=>{const k=x.get('purpose');return {type:'html',html:k?purposeCard(k)+(k!=='team'?`<div class="note">For tonight, Ayesha chooses <b>our Study Circle</b>.<span class="bn" lang="bn">আজ রাতের জন্য আয়েশা বেছে নিল আমাদের স্টাডি সার্কেল।</span></div>`:''):''}}},
  {stage:'purpose',open:true,scene:{app:'home'},
   say:'One decision — and the design follows.',bn:'একটা সিদ্ধান্ত — আর নকশা তার পেছনে চলে।',
   card:{type:'html',html:`<div class="card"><table class="ptab"><tr><th></th><th>Just me<span class="bn" lang="bn">শুধু আমি</span></th><th class="on">Study Circle<span class="bn" lang="bn">স্টাডি সার্কেল</span></th><th>Product<span class="bn" lang="bn">পণ্য</span></th></tr>
     <tr><td>Logins<span class="bn" lang="bn">লগইন</span></td><td>No</td><td class="on">Not yet</td><td>Yes</td></tr>
     <tr><td>Private data<span class="bn" lang="bn">ব্যক্তিগত তথ্য</span></td><td>Mine</td><td class="on">None</td><td>Many people’s</td></tr>
     <tr><td>Testing<span class="bn" lang="bn">পরীক্ষা</span></td><td>Me</td><td class="on">15 friends</td><td>Many phones</td></tr>
     <tr><td>If it breaks<span class="bn" lang="bn">ভাঙলে</span></td><td>My problem</td><td class="on">Undo it</td><td>Customers lose</td></tr></table></div>
     <div class="good">This is <b>Diligence</b> at the start, not the end: who it’s for decides how safe, tested and careful it must be.<span class="bn" lang="bn">এটা শুরুতেই Diligence, শেষে নয়: কার জন্য — সেটাই ঠিক করে কতটা নিরাপদ, পরীক্ষিত আর সতর্ক হতে হবে।</span></div>`}},
  /* ===== HAND OVER — Delegation ===== */
  {why:'Purpose set. Now she plans the hand-over: a long rope where the AI is the expert; she keeps what only she knows.',whybn:'উদ্দেশ্য ঠিক হলো। এবার হাতবদলের পরিকল্পনা: যেখানে AI বিশেষজ্ঞ সেখানে লম্বা দড়ি; যা শুধু সে জানে তা তার হাতে।',stage:'delegate',open:true,scene:{app:'home'},
   say:'Who should decide each thing: Ayesha, or the AI?',bn:'কোনটা কে ঠিক করবে: আয়েশা, নাকি AI?',
   sub:'Where the AI is the expert, give it a long rope. Where only Ayesha knows, keep hold.',subbn:'যেখানে AI বিশেষজ্ঞ, সেখানে লম্বা দড়ি দাও। যেখানে শুধু আয়েশা জানে, শক্ত করে ধরো।',
   card:{type:'sort',key:'who',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'}],items:[
     {en:'How the code is organised (the architecture)',bn:'কোড কীভাবে সাজানো হবে (আর্কিটেকচার)',ans:'ai',why:'The AI is the expert here and Ayesha isn’t. Give it rope — and ask it to explain its plan.',whybn:'এখানে AI বিশেষজ্ঞ, আয়েশা নয়। ছাড় দাও — আর পরিকল্পনা ব্যাখ্যা করতে বলো।',hint:'Can Ayesha judge code structure better than the AI?',hintbn:'কোডের গঠন কি আয়েশা AI-এর চেয়ে ভালো বিচার করতে পারে?'},
     {en:'Which programming tools to use',bn:'কোন প্রোগ্রামিং টুল ব্যবহার হবে',ans:'ai',why:'The AI knows the tools. Ayesha’s job is to say what the app must do, not how.',whybn:'টুল AI চেনে। আয়েশার কাজ বলা অ্যাপ কী করবে, কীভাবে নয়।',hint:'Does Ayesha know any programming tools?',hintbn:'আয়েশা কি কোনো প্রোগ্রামিং টুল চেনে?'},
     {en:'What is in version 1 — and what is not',bn:'প্রথম সংস্করণে কী থাকবে — আর কী থাকবে না',ans:'me',why:'Only Ayesha knows her friends’ problem and her purpose. That is problem awareness.',whybn:'বন্ধুদের সমস্যা আর নিজের উদ্দেশ্য শুধু আয়েশা জানে। এটাই সমস্যা-সচেতনতা।',hint:'Who talked to Mitu and Riya?',hintbn:'মিতু আর রিয়ার সাথে কে কথা বলেছে?'},
     {en:'How it should feel on her friends’ cheap phones',bn:'বন্ধুদের সস্তা ফোনে এটা কেমন লাগবে',ans:'me',why:'Design awareness: she knows her users. The AI has never met them.',whybn:'নকশা-সচেতনতা: সে তার ব্যবহারকারীদের চেনে। AI তাদের কখনো দেখেনি।',hint:'Who has met the users?',hintbn:'ব্যবহারকারীদের কে চেনে?'},
     {en:'What a correct date looks like in Bangladesh',bn:'বাংলাদেশে সঠিক তারিখ দেখতে কেমন',ans:'me',why:'Local knowledge. AI tools often assume American habits.',whybn:'স্থানীয় জ্ঞান। AI টুল প্রায়ই আমেরিকান অভ্যাস ধরে নেয়।',hint:'Whose habits does the AI usually assume?',hintbn:'AI সাধারণত কাদের অভ্যাস ধরে নেয়?'}]}},
  /* ===== DESCRIBE — Description ===== */
  {why:'Now her decisions become words: version 1, and where it may grow.',whybn:'এবার তার সিদ্ধান্তগুলো কথায় রূপ নেয়: প্রথম সংস্করণ, আর ভবিষ্যতে কোথায় বাড়তে পারে।',stage:'describe',scene:{app:'home'},tap:'app:studio',
   say:'Open Studio.',bn:'Studio খোলো।'},
  {stage:'describe',scene:x=>SC(x,{title:'New app',tab:'Chat',msgs:[],composer:{key:'desc',placeholder:'Describe your app…'},kb:{key:'desc',label:'DESCRIBE',chips:PROMPT_CHIPS}}),tap:'send',
   say:'Describe version 1 — and where it may grow.',bn:'প্রথম সংস্করণ বর্ণনা করো — আর ভবিষ্যতে কোথায় বাড়তে পারে।',
   sub:'Knowing what may come later helps the AI organise the code now.',subbn:'পরে কী আসতে পারে জানলে AI এখনই কোড ভালোভাবে সাজাতে পারে।',
   compose:{key:'desc',title:'Describe the app',titlebn:'অ্যাপটা বর্ণনা করো',slots:PROMPT_SLOTS,chips:PROMPT_CHIPS,best:['p1','p2','p3','p4','p5'],ready:'Purpose, version 1, a roadmap — and rope where the AI is the expert. Send it.',readybn:'উদ্দেশ্য, প্রথম সংস্করণ, ভবিষ্যতের পথ — আর যেখানে AI বিশেষজ্ঞ সেখানে ছাড়। পাঠাও।'}},
  /* ===== STEER — Discernment while it thinks ===== */
  {why:'Judging doesn’t wait for the finished app. She reads the plan while the AI is still thinking.',whybn:'বিচার শেষ অ্যাপের জন্য অপেক্ষা করে না। AI ভাবতে ভাবতেই সে পরিকল্পনা পড়ে।',stage:'steer',interrupt:true,
   scene:x=>SC(x,{tab:'Chat',msgs:[{role:'u',text:promptText(x)},{role:'a',html:planHTML(PLAN_LINES.length,false),id:'plan1',stream:true,speed:1,actions:false}],composer:false,stopHit:'stop',stopLabel:'Studio is thinking…'}),
   tap:'stop',onTap:x=>{x.set('stopN',x.streaming?linesVisible():PLAN_LINES.length)},
   showMe:(x,h)=>{const at=x.beat;const t=setInterval(()=>{if(AFL.ctx().beat!==at){clearInterval(t);return}
     if(!x.streaming||linesVisible()>=DATE_LINE){clearInterval(t);const s=document.querySelector('[data-hit="stop"]');h.ghostTo(s,()=>s&&s.click())}},150)},
   say:'Studio shows its plan as it thinks. Read along. If it goes off track, tap ■ Stop.',bn:'Studio ভাবার সময় তার পরিকল্পনা দেখায়। সাথে সাথে পড়ো। লক্ষ্য থেকে সরে গেলে ■ Stop চাপো।',
   sub:'Ask of each line: does this fit Ayesha’s purpose and version 1?',subbn:'প্রতিটি লাইনে জিজ্ঞেস করো: এটা কি আয়েশার উদ্দেশ্য আর প্রথম সংস্করণের সাথে মেলে?'},
  {stage:'steer',open:true,scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x),composer:false}),
   say:'Stopped. What did you catch?',bn:'থামানো হয়েছে। কী ধরলে?',
   card:x=>({type:'html',html:stopVerdict(x)+`<div class="card"><ul class="plist">
     <li><span class="ic" style="background:#DDF2E3">✓</span><span><b>Keep:</b> its architecture — separate parts, with room for a shared list. The rope paid off.<span class="bn" lang="bn">রাখো: তার আর্কিটেকচার — আলাদা অংশ, শেয়ার করা তালিকার জায়গাসহ। ছাড় দেওয়ার সুফল।</span></span></li>
     <li><span class="ic" style="background:#F7E3E1">✗</span><span><b>Off track:</b> sign-in and a cloud database “now” — her purpose said no logins in version 1.<span class="bn" lang="bn">লক্ষ্যচ্যুত: “এখনই” সাইন-ইন আর ক্লাউড ডাটাবেস — অথচ উদ্দেশ্য অনুযায়ী প্রথম সংস্করণে লগইন নেই।</span></span></li>
     <li><span class="ic" style="background:#F7E3E1">✗</span><span><b>Off track:</b> AI reminders nobody asked for — more to check, more to secure.<span class="bn" lang="bn">লক্ষ্যচ্যুত: কেউ চায়নি এমন AI রিমাইন্ডার — যাচাই আর সুরক্ষার কাজ বাড়ে।</span></span></li>
     ${sawDates(x)?`<li><span class="ic" style="background:#F7E3E1">✗</span><span><b>Wrong:</b> MM/DD dates — the opposite of what she said.<span class="bn" lang="bn">ভুল: MM/DD তারিখ — সে যা বলেছিল তার উল্টো।</span></span></li>`:''}</ul></div>
     <div class="good">This is <b>Discernment</b> in action — while the AI is still thinking, not after it has built the wrong thing.<span class="bn" lang="bn">এটাই কাজের মধ্যে Discernment — AI ভাবতে ভাবতেই, ভুল জিনিস বানিয়ে ফেলার পরে নয়।</span></div>`})},
  {why:'She tells Studio exactly what to drop, what to correct — and what it got right.',whybn:'সে Studio-কে ঠিক বলে দেয় কী বাদ দিতে হবে, কী ঠিক করতে হবে — আর কী সে ঠিক করেছে।',stage:'steer',d:'des',scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x),composer:{key:'redirect',placeholder:'Steer Studio…'},kb:{key:'redirect',label:'STEER',chips:rChips(x)}}),tap:'send',
   say:'Steer it: what to drop, what to correct, what to keep.',bn:'পথ দেখাও: কী বাদ, কী ঠিক করবে, কী রাখবে।',
   compose:x=>({key:'redirect',title:'Steer the AI',titlebn:'AI-কে পথ দেখাও',slots:REDIRECT_SLOTS.filter(c=>!c.dates||sawDates(x)),chips:rChips(x),best:rChips(x).filter(c=>!c.x).map(c=>c.id),ready:'Clear and fair — including what it got right. Send it.',readybn:'স্পষ্ট আর ন্যায্য — সে যা ঠিক করেছে তাও বলেছ। পাঠাও।'})},
  {why:'She steered it. Did it listen? Read the new plan, then try the app.',whybn:'সে পথ দেখিয়েছে। Studio কি শুনেছে? নতুন পরিকল্পনা পড়ো, তারপর অ্যাপটা চালিয়ে দেখো।',stage:'steer',scene:x=>SC(x,{tab:'Chat',msgs:stoppedMsgs(x).concat([{role:'u',text:redirectText(x)},{role:'a',html:PLAN2,id:'plan2',stream:true,actions:false}]),composer:false,scrollTo:'[data-mid="plan2"]',tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:x=>x.streaming?'Studio is re-planning…':'Back on track — and built. Now test it: tap Preview.',bn:x=>x.streaming?'Studio আবার পরিকল্পনা করছে…':'আবার ঠিক পথে — আর বানানো শেষ। এবার পরীক্ষা করো: Preview চাপো।'},
  /* ===== TEST — Discernment of the result ===== */
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v1',mini:miniApp(x,'v1')}),
   onUi:onMini,showMe:autoTest('v1',[0,2,5]),docs:['checklist'],
   say:'“Built ✅” is a claim. Test it like a user — real dates, and one impossible date.',bn:'“বানানো শেষ ✅” একটা দাবি মাত্র। ব্যবহারকারীর মতো পরীক্ষা করো — আসল তারিখ, আর একটা অসম্ভব তারিখ।',
   sub:'Tap a dashed button, then Add. Today is 4 October.',subbn:'একটা ড্যাশ-দেওয়া বোতাম চাপো, তারপর Add। আজ ৪ অক্টোবর।',
   card:x=>{const it=x.get('items_v1',[]);const feb=it.find(i=>i.date==='31/02/2026');
     return {type:'html',html:`<div class="tally">${[0,1,2].map(i=>`<span class="${it[i]?'done':''}">${i+1}</span>`).join('')}</div>
      ${feb?`<div class="warn"><b>Caught it.</b> 31 February doesn’t exist — but the app shows ${daysLeft('v1',feb.date)} days left, as if it were 3 March. It <i>looks</i> right. That is what makes it dangerous.<span class="bn" lang="bn">ধরেছ। ৩১ ফেব্রুয়ারি বলে কিছু নেই — অথচ অ্যাপ দেখাচ্ছে ১৫০ দিন বাকি, যেন ৩ মার্চ। দেখতে ঠিক মনে হয় — সেটাই বিপদ।</span></div>`:it.length?`<div class="note">Oxford: 11 days ✓ — the dates read correctly. Now try the impossible one: <b>Test: 31 Feb</b>.<span class="bn" lang="bn">অক্সফোর্ড: ১১ দিন ✓ — তারিখ ঠিকভাবে পড়ছে। এবার অসম্ভবটা চেষ্টা করো: Test: 31 Feb।</span></div>`:`<div class="note">Work out one answer first: Oxford is 15 October, so <b>11 days left</b>.<span class="bn" lang="bn">আগে একটা উত্তর বের করো: অক্সফোর্ড ১৫ অক্টোবর, তাই ১১ দিন বাকি।</span></div>`}`}}},
  {why:'A bug report is Description too: what I did, what I expected, what I got.',whybn:'বাগ রিপোর্টও Description: আমি কী করেছি, কী আশা করেছি, কী পেয়েছি।',stage:'test',d:'des',scene:x=>SC(x,{tab:'Chat',msgs:[{role:'a',html:PLAN2,id:'plan2',actions:false}],composer:{key:'bug',placeholder:'Tell Studio what you saw…'},kb:{key:'bug',label:'BUG REPORT',chips:BUG_CHIPS}}),tap:'send',
   say:'Tell Studio exactly what you saw.',bn:'Studio-কে ঠিক কী দেখেছ তা বলো।',
   compose:{key:'bug',title:'Input · Expected · Actual',titlebn:'ইনপুট · প্রত্যাশা · বাস্তবে যা ঘটেছে',slots:BUG_SLOTS,chips:BUG_CHIPS,best:['b1','b2','b3'],ready:'Clear. Send it.',readybn:'স্পষ্ট। পাঠাও।'}},
  {why:'“Fixed ✅” is another claim. Judge it the same way as the first one.',whybn:'“ঠিক হয়েছে ✅” আরেকটা দাবি। প্রথমটার মতোই এটাও বিচার করো।',stage:'test',scene:x=>SC(x,{tab:'Chat',msgs:[{role:'a',html:PLAN2,id:'plan2',actions:false},{role:'u',text:bugText(x)},{role:'a',html:FIXED,id:'fixed',stream:true,actions:false}],composer:false,scrollTo:'[data-mid="fixed"]',tabHits:{Preview:'tab:prev2'}}),tap:'tab:prev2',
   say:x=>x.streaming?'Studio is fixing it…':'“Fixed ✅” — another claim. Tap Preview.',bn:x=>x.streaming?'Studio ঠিক করছে…':'“ঠিক হয়েছে ✅” — আরেকটা দাবি। Preview চাপো।'},
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2')}),
   onUi:onMini,showMe:autoTest('v2',[0,5]),
   say:'Check it again yourself.',bn:'নিজে আবার যাচাই করো।',
   card:x=>{const ok=x.get('items_v2',[]).some(i=>i.date==='31/02/2026');return {type:'html',html:ok?`<div class="good">“Not a real date” — fixed, and checked by you.<span class="bn" lang="bn">“Not a real date” — ঠিক হয়েছে, আর তুমি নিজে যাচাই করেছ।</span></div>`:`<div class="note">Add <b>Test: 31 Feb</b> again.<span class="bn" lang="bn">আবার Test: 31 Feb যোগ করো।</span></div>`}}},
  /* ===== GROW — the purpose changes, and the loop starts again ===== */
  {why:'A new purpose is a responsibility question — and it starts the loop again.',whybn:'নতুন উদ্দেশ্য মানে দায়িত্বের নতুন প্রশ্ন — আর চক্র আবার শুরু হয়।',stage:'grow',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {me:1,html:'Here it is! 📅 <a>my-deadlines.studio.app</a> — made with AI help. Please check every date on the official website too 🙏',time:'22:40'},
     {from:'Riya',color:'#0E5A2A',text:'It works!! 😍',time:'22:42'},
     {from:'Tanvir',color:'#1F5FA8',text:'This is great. Let’s sell it to coaching centres! ৳99 a month!',time:'22:44'}]}),
   say:'Tanvir wants to sell it. Is it the same app?',bn:'তানভির এটা বিক্রি করতে চায়। এটা কি একই অ্যাপ?',
   card:{type:'html',html:purposeCard('sell',`<div class="note">Same screen — a different app. A new purpose sends Ayesha back round the loop: <b>Delegation</b> and <b>Description</b> again, with much more <b>Diligence</b>.<span class="bn" lang="bn">একই স্ক্রিন — কিন্তু আলাদা অ্যাপ। নতুন উদ্দেশ্য আয়েশাকে চক্রের শুরুতে ফেরত পাঠায়: আবার Delegation আর Description, অনেক বেশি Diligence নিয়ে।</span></div>`)}},
  {stage:'grow',scene:Object.assign({app:'chats'},CHATS,{msgs:[{from:'Tanvir',color:'#1F5FA8',text:'This is great. Let’s sell it to coaching centres! ৳99 a month!',time:'22:44'}]}),
   say:'What should Ayesha reply?',bn:'আয়েশা কী উত্তর দেবে?',
   card:{type:'choice',key:'sellQ',options:[
     {en:'“Sure! I’ll ask Studio to add payments tonight.”',bn:'“অবশ্যই! আজ রাতেই Studio-কে পেমেন্ট যোগ করতে বলি।”',ok:0,why:'Studio would happily add a payment button. But accounts, security, privacy and support don’t appear just because a button does.',whybn:'Studio খুশি মনে পেমেন্টের বোতাম যোগ করবে। কিন্তু বোতাম এলেই অ্যাকাউন্ট, নিরাপত্তা, গোপনীয়তা আর সাপোর্ট আসে না।'},
     {en:'“Let’s keep it for our circle for now. If we want to sell it, we’ll plan it again as a new version.”',bn:'“আপাতত আমাদের সার্কেলের জন্যই রাখি। বিক্রি করতে চাইলে নতুন সংস্করণ হিসেবে আবার পরিকল্পনা করব।”',ok:1,why:'Yes. The purpose is a decision — and changing it means planning again, not just adding a price.',whybn:'হ্যাঁ। উদ্দেশ্য একটা সিদ্ধান্ত — আর তা বদলানো মানে আবার পরিকল্পনা, শুধু দাম বসানো নয়।'},
     {en:'“No. Selling apps is wrong.”',bn:'“না। অ্যাপ বিক্রি করা ঠিক নয়।”',ok:0,why:'Selling is fine. Selling a prototype built for 15 friends is the problem.',whybn:'বিক্রি করা ঠিক আছে। ১৫ জন বন্ধুর জন্য বানানো প্রোটোটাইপ বিক্রি করাটাই সমস্যা।'}]}},
  {stage:'grow',open:true,scene:{app:'home'},
   say:'Tell your partner how Ayesha worked with the AI.',bn:'তোমার সঙ্গীকে বলো আয়েশা কীভাবে AI-এর সাথে কাজ করেছে।',
   card:{type:'say',lines:[
     {en:'First I <u>decided</u> who the app was <u>for</u>. That <u>shaped</u> everything else.',bn:'আগে আমি ঠিক করেছি অ্যাপটা কার জন্য। সেটাই বাকি সব ঠিক করেছে।'},
     {en:'I <u>let</u> the AI <u>choose</u> the architecture, because it <u>knows</u> code and I don’t.',bn:'আর্কিটেকচার AI-কে বেছে নিতে দিয়েছি, কারণ সে কোড জানে, আমি জানি না।'},
     {en:'When its plan <u>went</u> off track, I <u>stopped</u> it and <u>explained</u> why.',bn:'তার পরিকল্পনা লক্ষ্য থেকে সরে গেলে আমি থামিয়ে কারণ ব্যাখ্যা করেছি।'}]}},
  {stage:'grow',open:true,scene:{app:'home'},
   say:'Done! The four Ds in a real vibe-coding workflow.',bn:'শেষ! একটা আসল ভাইব-কোডিং কাজে চারটা D।',
   card:x=>({type:'html',html:AFL.recap(x,{
     del:{en:'Give the AI rope where it’s the expert. Keep your problem and design awareness.',bn:'যেখানে AI বিশেষজ্ঞ, সেখানে ছাড় দাও। সমস্যা আর নকশার বোধ নিজের কাছে রাখো।'},
     des:{en:'Describe version 1 and where it may grow, so the AI builds for the future.',bn:'প্রথম সংস্করণ আর ভবিষ্যতের পথ বলো, যাতে AI সামনের কথা ভেবে বানায়।'},
     dis:{en:'Read the plan and stop it when it drifts. Test what it built — “✅” is a claim.',bn:'পরিকল্পনা পড়ো, লক্ষ্য থেকে সরলে থামাও। যা বানিয়েছে পরীক্ষা করো — “✅” একটা দাবি মাত্র।'},
     dil:{en:'Decide who the app is for. It sets every design decision.',bn:'অ্যাপটা কার জন্য ঠিক করো। এটাই সব নকশার সিদ্ধান্ত ঠিক করে।'}})+`
     <div class="pick-cards"><button class="pcard" data-start="cv"><span class="pi" style="background:#D7E3FF">📄</span><span><em>Also try</em><b>An honest CV with AI</b></span></button><button class="pcard" data-start="agent"><span class="pi" style="background:#FFDBCC">🛰️</span><span><em>Also try</em><b>Set up an AI agent</b></span></button></div>`})}
 ]
});
})();
