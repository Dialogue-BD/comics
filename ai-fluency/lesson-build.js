/* Vibe-code an app — Ayesha builds "My Deadlines" for her Study Circle.
 * Studio is an invented app modelled on Google AI Studio's Build mode.
 * The preview is a REAL working app: version 1 has the classic bug that
 * AI-written code ships with — new Date("15/10/2025") reads dates the
 * American way (month/day), so Bangladeshi dates break. Students find it,
 * report it in Input / Expected / Actual form, and retest the fix.
 */
(function(){
const {esc,ico}=AFL;
const TODAY=new Date(2025,9,4); // Saturday 4 October 2025 — Ayesha's story day
const DAY=86400000;
const parseV1=t=>new Date(t);                                  // the bug
const parseV2=t=>{const m=String(t).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m)return null;const d=+m[1],mo=+m[2],y=+m[3];const dt=new Date(y,mo-1,d);return (dt.getMonth()===mo-1&&dt.getDate()===d)?dt:null};
const QUICK=[['Oxford','15/10/2025'],['LSE','31/10/2025'],['Erasmus','01/12/2025'],['Göttingen','15/12/2025'],['Sussex','15/01/2026'],['Test: 31 Feb','31/02/2026']];

function daysLeft(ver,t){
  if(ver==='v1'){const d=parseV1(t);return Math.round((d-TODAY)/DAY)}
  const d=parseV2(t);return d?Math.round((d-TODAY)/DAY):'bad';
}
function miniApp(x,ver){
  const items=x.get('items_'+ver,[]);
  const rows=items.map(it=>({...it,n:daysLeft(ver,it.date)}));
  const sorted=ver==='v1'?rows.slice().sort((a,b)=>a.n-b.n):rows.slice().sort((a,b)=>(a.n==='bad')-(b.n==='bad')||a.n-b.n);
  const fmt=n=>n==='bad'?`<span class="dl bad">Not a real date</span>`:Number.isNaN(n)?`<span class="dl bad">NaN days left</span>`:`<span class="dl ${n<0?'bad':n<30?'soon':''}">${n} days left</span>`;
  return `<h2>📅 My Deadlines</h2><div class="sub2">Add your programmes. Nearest deadline first.</div>
   <form onsubmit="return false"><input id="mi-name" placeholder="Programme (e.g. Oxford)" autocomplete="off"><div class="row2"><input id="mi-date" placeholder="Deadline (dd/mm/yyyy)" inputmode="numeric" autocomplete="off"><button class="addb" data-ui="add:${ver}">Add</button></div></form>
   <div class="quickfill"><span style="font-size:11px;color:#667;align-self:center">From Ayesha’s checklist:</span>${QUICK.map((q,i)=>`<button data-ui="qf:${i}">${esc(q[0])} · ${q[1]}</button>`).join('')}</div>
   <ul>${sorted.map(r=>`<li><span><b>${esc(r.name)}</b><small>Deadline: ${esc(r.date)}</small></span>${fmt(r.n)}</li>`).join('')||'<li style="color:#888;grid-template-columns:1fr">No deadlines yet.</li>'}</ul>
   ${items.length?`<div style="text-align:right;margin-top:6px"><button data-ui="clear:${ver}" style="border:0;background:none;color:#2457C5;font-size:12px">Clear list</button></div>`:''}
   <div class="foot">Saved on this phone only · Made with AI help (Studio)</div>`;
}
function onMini(x,kind,arg){
  if(kind==='qf'){const q=QUICK[+arg];document.getElementById('mi-name').value=q[0];document.getElementById('mi-date').value=q[1];return true}
  if(kind==='add'){const n=document.getElementById('mi-name').value.trim(),d=document.getElementById('mi-date').value.trim();if(!n||!d)return true;const k='items_'+arg;const a=x.get(k,[]).concat([{name:n,date:d}]);x.set(k,a);AFL.renderPhone();AFL.renderCoach();return true}
  if(kind==='clear'){x.set('items_'+arg,[]);AFL.renderPhone();AFL.renderCoach();return true}
  return false;
}
const autoTest=(ver,picks)=>(x,h)=>{let seq=picks.slice();const step=()=>{if(!seq.length)return;const i=seq.shift();const b=document.querySelector(`[data-ui="qf:${i}"]`);if(!b)return;h.ghostTo(b,()=>{b.click();const a=document.querySelector(`[data-ui="add:${ver}"]`);if(!a)return;h.ghostTo(a,()=>{a.click();setTimeout(step,200)})})};x.set('items_'+ver,[]);h.render();setTimeout(step,300)};

const CODE_V1=[
 ['<span class="cm">// Add a deadline and show days left</span>'],
 ['<span class="kw">function</span> addDeadline(name, dateText) {'],
 ['  <span class="kw">const</span> due = <span class="kw">new</span> Date(dateText);','bug'],
 ['  <span class="kw">const</span> today = <span class="kw">new</span> Date();'],
 ['  <span class="kw">const</span> days = Math.round((due - today) / 86400000);'],
 ['  list.push({ name, dateText, days });'],
 ['  list.sort((a, b) =&gt; a.days - b.days);'],
 ['  localStorage.setItem(<span class="st">"deadlines"</span>, JSON.stringify(list));'],
 ['  render();'],
 ['}']];
const codeHTML=(ver)=>ver==='v1'?CODE_V1.map(l=>`<span class="cl">${l[0]}</span>`).join(''):
  CODE_V1.map(l=>l[1]==='bug'?`<span class="cl del">-${l[0].slice(1)}</span><span class="cl add">+  <span class="kw">const</span> [d, m, y] = dateText.split(<span class="st">"/"</span>).map(Number);</span><span class="cl add">+  <span class="kw">const</span> due = <span class="kw">new</span> Date(y, m - 1, d); <span class="cm">// day/month/year</span></span><span class="cl add">+  <span class="kw">if</span> (due.getDate() !== d) <span class="kw">return</span> showError(<span class="st">"Not a real date"</span>);</span>`:`<span class="cl">${l[0]}</span>`).join('');

const DESC_CHIPS=[
 {id:'s1',tag:'Product',text:'Build a simple one-page app called “My Deadlines” for students applying to master’s programmes.'},
 {id:'s2',tag:'Features',text:'I can add a programme name and a deadline. It shows how many days are left, nearest deadline first.'},
 {id:'s3',tag:'Local detail',text:'Dates are written day/month/year, like 15/01/2026, because we are in Bangladesh.'},
 {id:'s4',tag:'Data',text:'Save the list only on this phone. No login, no accounts.'},
 {id:'x1',tag:'Shortcut',x:1,text:'Make it amazing with lots of features.',warn:'more features = more bugs. Start small.',warnbn:'বেশি ফিচার = বেশি বাগ। ছোট থেকে শুরু করো।'},
 {id:'x2',tag:'Shortcut',x:1,text:'Add login with Google.',warn:'a login collects personal data. Her friends don’t need it.',warnbn:'লগইন ব্যক্তিগত তথ্য নেয়। বন্ধুদের এর দরকার নেই।'}
];
const DESC_SLOTS=[
 {label:'Product',frame:'<em>Build a</em> ___ <em>called</em> ___ <em>for</em> ___.',bn:'___-এর জন্য ___ নামে একটা ___ বানাও।',test:[/build|make|create/i]},
 {label:'Features',frame:'<em>I can</em> ___. <em>It shows</em> ___.',bn:'আমি ___ করতে পারব। এটা ___ দেখাবে।',test:[/i can|it shows|days left|add/i]},
 {label:'Local detail',frame:'<em>Dates are written</em> ___, <em>like</em> ___.',bn:'তারিখ লেখা হয় ___, যেমন ___।',test:[/day\/month|dd\/mm|day.month.year/i]},
 {label:'Data',frame:'<em>Save the list</em> ___. <em>No</em> ___.',bn:'তালিকা ___ সেভ করো। কোনো ___ নয়।',test:[/only on this phone|no login|this phone|locally|on the phone/i]}
];
const descText=x=>x.get('desc','')||DESC_CHIPS.slice(0,4).map(c=>c.text).join(' ');
const saidDMY=x=>/day\/month|dd\/mm|day.month.year/i.test(descText(x));

const BUG_CHIPS=[
 {id:'b1',tag:'Input',text:'When I add Oxford with the date 15/10/2025,'},
 {id:'b2',tag:'Expected',text:'I expect to see 11 days left.'},
 {id:'b3',tag:'Actual',text:'But I see “NaN days left”.'},
 {id:'b4',tag:'Cause?',text:'I think the app reads dates as month/day/year. Please read them as day/month/year.'},
 {id:'bx',tag:'Shortcut',x:1,text:'It doesn’t work. Fix it.',warn:'too vague — the AI has to guess what is wrong.',warnbn:'খুব অস্পষ্ট — AI-কে অনুমান করতে হবে কী ভুল।'}
];
const BUG_SLOTS=[
 {label:'Input — what I did',frame:'<em>When I add</em> ___ <em>with the date</em> ___,',bn:'যখন আমি ___ তারিখ দিয়ে ___ যোগ করি,',test:[/when i|i add|i enter|i type/i]},
 {label:'Expected — what should happen',frame:'<em>I expect to see</em> ___.',bn:'আমি ___ দেখার আশা করি।',test:[/expect|should/i]},
 {label:'Actual — what really happened',frame:'<em>But I see</em> ___.',bn:'কিন্তু আমি দেখি ___।',test:[/but i see|i see|it shows|instead/i]}
];
const bugText=x=>x.get('bug','')||BUG_CHIPS.slice(0,4).map(c=>c.text).join(' ');

const BUILT=x=>`<p>Done! I built <b>My Deadlines</b> ✨</p><div class="step-l"><div class="ok"><i>✓</i>Planned the screens</div><div class="ok"><i>✓</i>Wrote index.html (96 lines)</div><div class="ok"><i>✓</i>Added the date maths</div><div class="ok"><i>✓</i>Saved data on the device</div></div><p>I tested it and everything works ✅. Open the <b>Preview</b> tab to try it.</p>`;
const FIXED_MSG=`<p>You’re right — sorry! I used <code>new Date(dateText)</code>, which reads <b>15/10/2025</b> as month 15, day 10 — not a real date, so the maths gave NaN. Dates ≤ 12 were read as the wrong month.</p><p>I changed it to read <b>day/month/year</b>, and the app now warns you if a date doesn’t exist (like 31/02). See the change in the <b>Code</b> tab, then test again in <b>Preview</b>.</p>`;
const studioChat=(x,upto)=>{const m=[{role:'u',text:descText(x)},{role:'a',html:BUILT(x),id:'built',stream:upto===1,actions:false}];
  if(upto>=2) m.push({role:'u',text:bugText(x)});
  if(upto>=3) m.push({role:'a',html:FIXED_MSG,id:'fixed',stream:upto===3,actions:false});
  return m;};
const SC=(x,extra)=>Object.assign({app:'studio',title:'My Deadlines'},extra);
const CHATS={group:'Economics Study Circle',members:'Riya, Tanvir, Mitu, you +14'};

AFL.lesson({
 id:'build', title:'Vibe-code an app', kicker:'Workflow 3 · Building', emoji:'⌨️', tint:'#E3E3EA', time:'35–40 min',
 blurb:'Describe an app in words. Test what the AI builds. Report the bug.',
 blurbbn:'কথায় একটা অ্যাপ বর্ণনা করো। AI যা বানায় তা পরীক্ষা করো। বাগ রিপোর্ট করো।',
 notif:{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'start:build'},
 stages:[{id:'plan',label:'Plan',d:'del'},{id:'describe',label:'Describe',d:'des'},{id:'test',label:'Test',d:'dis'},{id:'fix',label:'Fix',d:'des'},{id:'share',label:'Share',d:'dil'}],
 beats:[
  {stage:'plan',scene:{app:'lock',notifs:[{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'n:chat'}]},tap:'n:chat',
   say:'Ayesha’s study group needs something. Tap the message.',bn:'আয়েশার স্টাডি গ্রুপের কিছু দরকার। মেসেজে চাপো।'},
  {stage:'plan',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {from:'Mitu',color:'#A33A7A',text:'I missed the Groningen deadline 😭 I thought it was June.',time:'8:41'},
     {from:'Tanvir',color:'#1F5FA8',text:'Same problem. Too many dates, too many websites.',time:'8:43'},
     {from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},
     {me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:57'}]}),
   say:'Vibe coding: you describe an app in words. The AI writes the code.',bn:'ভাইব কোডিং: তুমি কথায় অ্যাপ বর্ণনা করো। AI কোড লেখে।',
   card:{type:'info',points:[{i:'🗣️',en:'<b>You</b> describe what the app must do.',bn:'তুমি বলো অ্যাপটা কী করবে।'},{i:'⌨️',en:'<b>The AI</b> writes the code — in seconds.',bn:'AI কোড লেখে — কয়েক সেকেন্ডে।'},{i:'🧪',en:'<b>You</b> test it. The AI will say “it works”. Don’t believe it until you test.',bn:'তুমি পরীক্ষা করো। AI বলবে “কাজ করছে”। পরীক্ষা না করে বিশ্বাস কোরো না।'},{i:'🛠️',en:'Real tools: Google AI Studio (Build), and similar apps. Ours is called Studio.',bn:'বাস্তব টুল: Google AI Studio (Build) ইত্যাদি। আমাদেরটার নাম Studio।'}]}},
  {stage:'plan',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[{from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},{me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:57'}]}),
   say:'Keep it small. Sort the ideas.',bn:'ছোট রাখো। আইডিয়াগুলো ভাগ করো।',
   card:{type:'sort',key:'feat',bins:[{id:'must',label:'Must have'},{id:'later',label:'Later'},{id:'no',label:'Not needed'}],items:[
     {en:'Add a programme and its deadline',bn:'প্রোগ্রাম আর তার ডেডলাইন যোগ করা',ans:'must',why:'This is the whole app.',whybn:'পুরো অ্যাপটাই এটা।'},
     {en:'Show days left, nearest first',bn:'কত দিন বাকি দেখানো, সবচেয়ে কাছেরটা আগে',ans:'must',why:'This solves Mitu’s problem.',whybn:'এটাই মিতুর সমস্যার সমাধান।'},
     {en:'Dark mode',bn:'ডার্ক মোড',ans:'later',why:'Nice, but not needed for version 1.',whybn:'ভালো, কিন্তু প্রথম সংস্করণে দরকার নেই।',hint:'Is it needed to stop missed deadlines?',hintbn:'ডেডলাইন মিস থামাতে কি এটা লাগে?'},
     {en:'Login with Google',bn:'গুগল দিয়ে লগইন',ans:'no',why:'A login collects personal data and adds things to go wrong. The list can stay on each phone.',whybn:'লগইন ব্যক্তিগত তথ্য নেয় আর ঝামেলা বাড়ায়। তালিকা প্রত্যেকের ফোনেই থাকতে পারে।',hint:'Does a deadline list need to know who you are?',hintbn:'ডেডলাইনের তালিকার কি জানা দরকার তুমি কে?'}]}},
  {stage:'plan',open:true,scene:{app:'home'},
   say:'Who does what?',bn:'কে কী করবে?',
   card:{type:'sort',key:'bjobs',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'}],items:[
     {en:'Decide what the app must do',bn:'অ্যাপ কী করবে তা ঠিক করা',ans:'me',why:'She knows her friends’ problem. The AI doesn’t.',whybn:'বন্ধুদের সমস্যা সে জানে। AI জানে না।'},
     {en:'Write the code',bn:'কোড লেখা',ans:'ai',why:'The AI is fast at this. Ayesha doesn’t need to read every line.',whybn:'এতে AI দ্রুত। আয়েশাকে প্রতিটি লাইন পড়তে হবে না।'},
     {en:'Test it with real dates',bn:'আসল তারিখ দিয়ে পরীক্ষা করা',ans:'me',why:'The AI says “it works”. Only a real test shows if it does.',whybn:'AI বলে “কাজ করছে”। শুধু আসল পরীক্ষাই তা দেখায়।',hint:'Can the AI know if it really works on her friends’ phones?',hintbn:'বন্ধুদের ফোনে সত্যি কাজ করে কি না AI কি জানতে পারে?'},
     {en:'Decide when it’s ready to share',bn:'কখন শেয়ার করার মতো হয়েছে তা ঠিক করা',ans:'me',why:'Her friends will trust it because it came from her.',whybn:'বন্ধুরা এটা বিশ্বাস করবে কারণ এটা তার কাছ থেকে এসেছে।',hint:'Whose name goes with the link?',hintbn:'লিংকের সাথে কার নাম যায়?'}]}},
  {stage:'describe',scene:{app:'home'},tap:'app:studio',
   say:'Open Studio.',bn:'Studio খোলো।'},
  {stage:'describe',scene:x=>SC(x,{title:'New app',tab:'Chat',msgs:[],composer:{key:'desc',placeholder:'Describe your app…'},kb:{key:'desc',label:'DESCRIBE',chips:DESC_CHIPS}}),tap:'send',
   say:'Describe the app. Tap the parts above the keyboard.',bn:'অ্যাপটা বর্ণনা করো। কিবোর্ডের উপরের অংশগুলো চাপো।',
   sub:'Look at “Local detail”. Why does it matter here?',subbn:'“Local detail” দেখো। এখানে এটা কেন জরুরি?',
   compose:{key:'desc',title:'App description',titlebn:'অ্যাপের বর্ণনা',slots:DESC_SLOTS,chips:DESC_CHIPS,best:['s1','s2','s3','s4'],ready:'Clear and small. Send it.',readybn:'স্পষ্ট আর ছোট। পাঠাও।'}},
  {stage:'describe',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1),composer:false,tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:x=>x.streaming?'Studio is building…':'“I tested it and everything works ✅.” Did it? Open Preview.',bn:'“আমি পরীক্ষা করেছি, সব ঠিক আছে ✅।” সত্যি? Preview খোলো।'},
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v1',mini:miniApp(x,'v1')}),
   onUi:onMini,showMe:autoTest('v1',[0,2,4]),
   docs:['checklist'],
   say:'Test it like a user. Add three deadlines from Ayesha’s checklist.',bn:'ব্যবহারকারীর মতো পরীক্ষা করো। আয়েশার চেকলিস্ট থেকে তিনটা ডেডলাইন যোগ করো।',
   sub:'Tap a dashed button, then Add.',subbn:'একটা ড্যাশ-দেওয়া বোতাম চাপো, তারপর Add।',
   card:x=>{const it=x.get('items_v1',[]);const bad=it.some(i=>Number.isNaN(daysLeft('v1',i.date))||daysLeft('v1',i.date)<0);
     return {type:'html',html:`<div class="tally">${[0,1,2].map(i=>`<span class="${it[i]?'done':''}">${i+1}</span>`).join('')}</div>
      ${bad?`<div class="warn"><b>Something is wrong.</b> ${it.some(i=>Number.isNaN(daysLeft('v1',i.date)))?'“NaN” means “not a number” — the app couldn’t do the maths.':''} ${it.some(i=>daysLeft('v1',i.date)<0)?'A negative number means the deadline has passed — but it hasn’t!':''}<span class="bn" lang="bn">কিছু একটা ভুল। “NaN” মানে “সংখ্যা নয়” — অ্যাপ হিসাব করতে পারেনি। ঋণাত্মক সংখ্যা মানে ডেডলাইন পার হয়ে গেছে — কিন্তু হয়নি!</span></div>`:`<div class="note">Today is 4 October. Oxford is 15 October — so you expect <b>11 days left</b>.<span class="bn" lang="bn">আজ ৪ অক্টোবর। অক্সফোর্ড ১৫ অক্টোবর — তাই ১১ দিন বাকি দেখার কথা।</span></div>`}`}}},
  {stage:'test',open:true,scene:x=>SC(x,{tab:'Code',code:codeHTML('v1')}),
   say:x=>saidDMY(x)?'You told it “day/month/year”. It still got it wrong.':'Your description didn’t say how dates are written.',
   bn:x=>saidDMY(x)?'তুমি বলেছিলে “দিন/মাস/বছর”। তবুও ভুল করেছে।':'তোমার বর্ণনায় তারিখ কীভাবে লেখা হয় তা ছিল না।',
   card:x=>({type:'html',html:`<div class="card"><h3>Why it broke</h3><p>Bangladesh writes <b>15/10/2025</b> as day/month/year. The code used <code>new Date()</code>, which reads it the American way: month 15 — not a real month. So the app shows <b>NaN</b>. 01/12 became 12 January.</p><span class="bn" lang="bn">বাংলাদেশে ১৫/১০/২০২৫ মানে দিন/মাস/বছর। কোডটা আমেরিকান নিয়মে পড়ে: মাস ১৫ — যা হয় না। তাই NaN। ০১/১২ হয়ে গেছে ১২ জানুয়ারি।</span></div>
     <div class="${saidDMY(x)?'note':'warn'}">${saidDMY(x)?'Even clear instructions don’t guarantee correct code. <b>That’s why you test.</b>':'Local details matter. AI often assumes American defaults: dates, money, spelling.'}<span class="bn" lang="bn">${saidDMY(x)?'স্পষ্ট নির্দেশনাও সঠিক কোডের নিশ্চয়তা দেয় না। তাই পরীক্ষা করতে হয়।':'স্থানীয় খুঁটিনাটি জরুরি। AI প্রায়ই আমেরিকান নিয়ম ধরে নেয়: তারিখ, টাকা, বানান।'}</span></div>
     <p class="sub">You don’t need to read code. But you can spot the line: the red-flag line is <code>new Date(dateText)</code>.<span class="bn" lang="bn">কোড পড়তে জানতে হবে না। তবে লাইনটা চেনা যায়: new Date(dateText)।</span></p>`})},
  {stage:'fix',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1),composer:{key:'bug',placeholder:'Tell Studio what’s wrong…'},kb:{key:'bug',label:'BUG REPORT',chips:BUG_CHIPS}}),tap:'send',
   say:'Write a clear bug report: what you did, what you expected, what you saw.',bn:'স্পষ্ট বাগ রিপোর্ট লেখো: তুমি কী করেছ, কী আশা করেছ, কী দেখেছ।',
   compose:{key:'bug',title:'Input · Expected · Actual',titlebn:'ইনপুট · প্রত্যাশা · বাস্তবে যা ঘটেছে',slots:BUG_SLOTS,chips:BUG_CHIPS,best:['b1','b2','b3','b4'],ready:'A developer would love this report. Send it.',readybn:'যেকোনো ডেভেলপার এই রিপোর্ট পছন্দ করবে। পাঠাও।'}},
  {stage:'fix',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,3),composer:false,scrollTo:'[data-mid="fixed"]',tabHits:{Code:'tab:code',Preview:'tab:prev'}}),tap:'tab:code',
   say:x=>x.streaming?'Studio is fixing it…':'Studio explains the fix. Look at the change: tap Code.',bn:'Studio সংশোধন ব্যাখ্যা করছে। পরিবর্তন দেখো: Code চাপো।'},
  {stage:'fix',scene:x=>SC(x,{tab:'Code',code:codeHTML('v2'),tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:'Red = removed. Green = added. Now test again: tap Preview.',bn:'লাল = বাদ। সবুজ = যোগ। এবার আবার পরীক্ষা করো: Preview চাপো।'},
  {stage:'fix',d:'dis',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2')}),
   onUi:onMini,showMe:autoTest('v2',[0,2,4,5]),
   docs:['checklist'],
   say:'Test again — same dates. Also try the impossible date.',bn:'আবার পরীক্ষা করো — একই তারিখ। অসম্ভব তারিখটাও চেষ্টা করো।',
   card:x=>{const it=x.get('items_v2',[]);const want={Oxford:11,LSE:27,Erasmus:58,'Göttingen':72,Sussex:103};
     const rows=it.map(i=>{const n=daysLeft('v2',i.date);const w=want[i.name];return `<tr><td style="padding:4px 6px">${esc(i.name)}</td><td style="padding:4px 6px">${w!=null?w:'—'}</td><td style="padding:4px 6px">${n==='bad'?'warning':n}</td><td>${(w!=null&&w===n)||(w==null&&n==='bad')?'✅':'❌'}</td></tr>`}).join('');
     return {type:'html',html:it.length?`<div class="card" style="padding:8px"><table style="width:100%;font-size:13.5px;border-collapse:collapse"><tr style="text-align:left;color:var(--ink-muted)"><th style="padding:4px 6px">Programme</th><th>Expected</th><th>Actual</th><th></th></tr>${rows}</table></div>${it.length>=3?`<div class="good">Every result matches the paper. Now it works — because <b>you</b> tested it.<span class="bn" lang="bn">প্রতিটি ফল কাগজের সাথে মেলে। এখন কাজ করছে — কারণ তুমি পরীক্ষা করেছ।</span></div>`:''}`:`<div class="note">Write the expected days on paper first, then compare. Today is 4 October.<span class="bn" lang="bn">আগে কাগজে প্রত্যাশিত দিন লেখো, তারপর মেলাও। আজ ৪ অক্টোবর।</span></div>`}}},
  {stage:'share',open:true,scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2'),deployHit:'deploy'}),
   say:'Before you share: four checks.',bn:'শেয়ার করার আগে: চারটা যাচাই।',
   card:{type:'checklist',key:'shipChk',items:[
     {en:'No personal data inside the app.',sub:'Each friend’s list stays on their own phone.',bn:'অ্যাপের ভেতরে কোনো ব্যক্তিগত তথ্য নেই। প্রত্যেকের তালিকা তার নিজের ফোনে।'},
     {en:'No passwords or secret keys in the code.',bn:'কোডে কোনো পাসওয়ার্ড বা গোপন কী নেই।'},
     {en:'I tested it with real dates.',bn:'আসল তারিখ দিয়ে পরীক্ষা করেছি।'},
     {en:'It says “Made with AI help”.',sub:'Friends know to double-check dates on official sites.',bn:'এতে লেখা আছে “Made with AI help”। বন্ধুরা জানবে অফিসিয়াল সাইটে তারিখ মিলিয়ে নিতে হবে।'}]}},
  {stage:'share',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2'),deployHit:'deploy'}),tap:'deploy',
   say:'Publish it. Tap the share icon at the top.',bn:'প্রকাশ করো। উপরের শেয়ার আইকনে চাপো।'},
  {stage:'share',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2'),sheet:{html:`<h3>Publish “My Deadlines”</h3><p class="sh-sub">Anyone with the link can open this app.</p>
     ${[['empty','Share an empty app','Each friend adds their own deadlines'],['mine','Share it with my list inside','My 8 programmes and dates are already in it']].map(([k,t,s])=>`<button class="radio ${x.get('shareMode')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${t}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'One more choice.',bn:'আরেকটা সিদ্ধান্ত।',
   decide:{key:'shareMode',options:{empty:{ok:1,why:'Her friends get the tool, not her private plans.',whybn:'বন্ধুরা টুলটা পাবে, তার ব্যক্তিগত পরিকল্পনা নয়।'},mine:{ok:false,why:'Anyone with the link — even strangers — would see where she is applying. Her plans are hers.',whybn:'লিংক যার কাছে যাবে — অপরিচিতরাও — দেখবে সে কোথায় আবেদন করছে। তার পরিকল্পনা তার নিজের।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  {stage:'share',scene:Object.assign({app:'chats'},CHATS,{msgs:[{from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},{me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:57'},
     {me:1,html:'Here it is! 📅 <a>my-deadlines.studio.app</a><br>Made with AI help. I tested it with our dates — but please check every deadline on the official website too 🙏',time:'22:14'},
     {from:'Riya',color:'#0E5A2A',text:'Wow, it works!! Oxford says 11 days 😱',time:'22:16'},
     {from:'Mitu',color:'#A33A7A',text:'You made this?? Teach me!',time:'22:17'}]}),
   say:'Shipped. Notice how Ayesha shared it.',bn:'পাঠানো হয়েছে। খেয়াল করো আয়েশা কীভাবে শেয়ার করেছে।',
   card:{type:'html',html:`<div class="good">She said it was <b>made with AI help</b>, that she <b>tested</b> it, and asked friends to <b>check official sites</b>. Honest and useful.<span class="bn" lang="bn">সে বলেছে AI-এর সাহায্যে বানানো, সে পরীক্ষা করেছে, আর বন্ধুদের অফিসিয়াল সাইটে মিলিয়ে নিতে বলেছে। সৎ আর কাজের।</span></div>`}},
  {stage:'share',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[{me:1,html:'Here it is! 📅 <a>my-deadlines.studio.app</a><br>Made with AI help. I tested it with our dates — but please check every deadline on the official website too 🙏',time:'22:14'},{from:'Riya',color:'#0E5A2A',text:'Wow, it works!! Oxford says 11 days 😱',time:'22:16'}]}),
   say:'Tell your partner how the app was made.',bn:'তোমার সঙ্গীকে বলো অ্যাপটা কীভাবে বানানো হলো।',
   card:{type:'say',lines:[
     {en:'I <u>described</u> the app, and the AI <u>wrote</u> the code.',bn:'আমি অ্যাপটা বর্ণনা করেছি, আর AI কোড লিখেছে।'},
     {en:'When I <u>tested</u> it, I <u>found</u> a bug: it <u>read</u> dates the American way.',bn:'পরীক্ষা করার সময় একটা বাগ পেয়েছি: এটা আমেরিকান নিয়মে তারিখ পড়ছিল।'},
     {en:'I <u>expected</u> 11 days, but I <u>saw</u> “NaN”. So I <u>reported</u> it.',bn:'আমি ১১ দিন আশা করেছিলাম, কিন্তু দেখেছি “NaN”। তাই রিপোর্ট করেছি।'}]}},
  {stage:'share',open:true,scene:{app:'home'},
   say:'Done! You built and shipped an app.',bn:'শেষ! তুমি একটা অ্যাপ বানিয়ে পাঠিয়ে দিয়েছ।',
   card:{type:'html',html:`<div class="big4"><div class="d-del"><b>Delegation</b><span>Ayesha decides and tests. AI writes code.</span></div><div class="d-des"><b>Description</b><span>Product · Features · Local detail · Data. Bug: Input · Expected · Actual.</span></div><div class="d-dis"><b>Discernment</b><span>“It works ✅” is a claim. A test is proof.</span></div><div class="d-dil"><b>Diligence</b><span>No personal data. Say it’s made with AI.</span></div></div>
     <div class="pick-cards"><button class="pcard" data-start="cv"><span class="pi" style="background:#D7E3FF">📄</span><span><em>Also try</em><b>An honest CV with AI</b></span></button><button class="pcard" data-start="agent"><span class="pi" style="background:#FFDBCC">🛰️</span><span><em>Also try</em><b>Set up an AI agent</b></span></button></div>`}}
 ]
});
})();
