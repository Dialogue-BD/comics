/* Vibe-code an app — the app developer's trade, without the programming.
 * Ayesha builds "My Deadlines" for her Study Circle in Studio (an invented
 * app modelled on Google AI Studio's Build mode, which syncs to GitHub).
 *
 * The four Ds as a builder meets them:
 *   Delegation  — scope and feature creep, the spec, architecture (modules),
 *                 code hygiene, screen design: decisions the AI must not make.
 *   Description — building from the spec; bug reports; scoped change requests.
 *   Discernment — testing what was built (the preview is a REAL app: v1 reads
 *                 15/10/2025 the American way and shows NaN).
 *   Diligence   — save points in Git, secret keys, Firestore security rules,
 *                 and the long road from a good-looking prototype to launch.
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
/* v1: the date bug · bad: the AI's "rewrite" (dates fixed, sorted by NAME, old list lost) · v2: the scoped fix */
function miniApp(x,ver){
  const items=x.get('items_'+ver,[]);
  const rows=items.map(it=>({...it,n:daysLeft(ver,it.date)}));
  const sorted=ver==='v1'?rows.slice().sort((a,b)=>a.n-b.n):ver==='bad'?rows.slice().sort((a,b)=>a.name.localeCompare(b.name)):rows.slice().sort((a,b)=>(a.n==='bad')-(b.n==='bad')||a.n-b.n);
  const fmt=n=>n==='bad'?`<span class="dl bad">Not a real date</span>`:Number.isNaN(n)?`<span class="dl bad">NaN days left</span>`:`<span class="dl ${n<0?'bad':n<30?'soon':''}">${n} days left</span>`;
  const head=ver==='bad'?`<h2>✨ My Deadlines 2.0</h2><div class="sub2">Fresh new look! Your programmes, A to Z.</div>`:`<h2>📅 My Deadlines</h2><div class="sub2">Add your programmes. Nearest deadline first.</div>`;
  return `${head}
   <form onsubmit="return false"><input id="mi-name" placeholder="Programme (e.g. Oxford)" autocomplete="off"><div class="row2"><input id="mi-date" placeholder="Deadline (dd/mm/yyyy)" inputmode="numeric" autocomplete="off"><button class="addb" data-ui="add:${ver}">Add</button></div></form>
   <div class="quickfill"><span style="font-size:11px;color:#667;align-self:center">From Ayesha’s checklist:</span>${QUICK.map((q,i)=>`<button data-ui="qf:${i}">${esc(q[0])} · ${q[1]}</button>`).join('')}</div>
   <ul>${sorted.map(r=>`<li><span><b>${esc(r.name)}</b><small>Deadline: ${esc(r.date)}</small></span>${fmt(r.n)}</li>`).join('')||`<li style="color:#888;grid-template-columns:1fr">${ver==='bad'?'No deadlines yet. (Where did your list go?)':'No deadlines yet.'}</li>`}</ul>
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

/* ---------- code shown in the Code tab ---------- */
const FILES4=['screen.html','list.js','dates.js','storage.js'];
const kw=s=>`<span class="kw">${s}</span>`, st=s=>`<span class="st">${s}</span>`, cm=s=>`<span class="cm">${s}</span>`;
const L=(t,c='')=>`<span class="cl ${c}">${t}</span>`;
const DATES_V1=[L(cm('// dates.js — turn a deadline into "days left"')),L(`${kw('export function')} daysLeft(dateText) {`),L(`  ${kw('const')} due = ${kw('new')} Date(dateText);`,'bugline'),L(`  ${kw('const')} today = ${kw('new')} Date();`),L(`  ${kw('return')} Math.round((due - today) / 86400000);`),L('}')].join('');
const DATES_V2=[L(cm('// dates.js — turn a deadline into "days left"')),L(`${kw('export function')} daysLeft(dateText) {`),L(`-  ${kw('const')} due = ${kw('new')} Date(dateText);`,'del'),L(`+  ${kw('const')} [d, m, y] = dateText.split(${st('"/"')}).map(Number); ${cm('// day/month/year')}`,'add'),L(`+  ${kw('const')} due = ${kw('new')} Date(y, m - 1, d);`,'add'),L(`+  ${kw('if')} (due.getDate() !== d) ${kw('return')} ${st('"Not a real date"')};`,'add'),L(`  ${kw('const')} today = ${kw('new')} Date();`),L(`  ${kw('return')} Math.round((due - today) / 86400000);`),L('}')].join('');
const RULES_BAD=[L(cm('// firestore.rules — who may read and write the shared list')),L(`rules_version = ${st("'2'")};`),L(`service cloud.firestore {`),L(`  match /databases/{db}/documents {`),L(`    match /{document=**} {`),L(`      allow read, write: ${kw('if true')};  ${cm('// test mode')}`,'bugline'),L('    }'),L('  }'),L('}')].join('');
const RULES_GOOD=[L(cm('// firestore.rules — members read; you edit only your own')),L(`match /deadlines/{id} {`),L(`  allow read: ${kw('if')} request.auth != ${kw('null')};`,'add'),L(`  allow create: ${kw('if')} request.resource.data.owner == request.auth.uid;`,'add'),L(`  allow update, delete: ${kw('if')} resource.data.owner == request.auth.uid;`,'add'),L('}')].join('');
const KEY_BAD=[L(cm('// reminders.js — NEW: AI-written reminder messages ✨')),L(`${kw('const')} GEMINI_API_KEY = ${st('"AIzaSyB-7xQ2…kd4fQ"')};`,'bugline'),L(`${kw('export async function')} writeReminder(item) {`),L(`  ${kw('const')} res = ${kw('await')} fetch(${st('"https://generativelanguage…?key="')} + GEMINI_API_KEY, …);`),L('  …'),L('}')].join('');

/* ---------- the spec sheet ---------- */
const SPEC=[
 {label:'Goal and users',bn:'লক্ষ্য ও ব্যবহারকারী',options:[
   {en:'Help Study Circle members stop missing master’s deadlines.',ok:1,why:'One clear problem, for real people. Every later decision can be checked against it.',whybn:'একটা স্পষ্ট সমস্যা, বাস্তব মানুষের জন্য। পরের সব সিদ্ধান্ত এর সাথে মিলিয়ে দেখা যায়।'},
   {en:'An app for everyone, for everything about studying abroad.',ok:false,why:'Too big. “Everyone, everything” is how feature creep starts.',whybn:'অনেক বড়। “সবার জন্য, সবকিছু” — এভাবেই ফিচার বাড়তে বাড়তে নিয়ন্ত্রণ হারায়।'}]},
 {label:'Version 1 does',bn:'প্রথম সংস্করণ যা করবে',options:[
   {en:'Add a programme and its deadline. Show days left, nearest first.',ok:1,why:'The smallest app that solves the problem.',whybn:'সমস্যা সমাধানের সবচেয়ে ছোট অ্যাপ।'},
   {en:'Deadlines, reminders, sharing, chat, AI advice and dark mode.',ok:false,why:'Six features means six times the bugs and risks — before anyone has used version 1.',whybn:'ছয়টা ফিচার মানে ছয় গুণ বাগ ও ঝুঁকি — কেউ প্রথম সংস্করণ ব্যবহারের আগেই।'}]},
 {label:'Not in version 1',bn:'প্রথম সংস্করণে নয়',options:[
   {en:'No login, no sharing, no AI features — maybe later.',ok:1,why:'Writing down what you will NOT build protects you from feature creep — yours and the AI’s.',whybn:'কী বানাবে না তা লিখে রাখলে ফিচার বাড়ার ফাঁদ থেকে বাঁচো — তোমার নিজের আর AI-এরও।'},
   {en:'(leave it empty)',ok:false,why:'Then anything can sneak in. AI tools love adding “helpful” extras.',whybn:'তাহলে যেকোনো কিছু ঢুকে পড়তে পারে। AI টুল “কাজের” বাড়তি জিনিস যোগ করতে ভালোবাসে।'}]},
 {label:'Data and privacy',bn:'তথ্য ও গোপনীয়তা',options:[
   {en:'Each person’s list is saved only on their own phone.',ok:1,why:'No server, no accounts, nothing to leak.',whybn:'কোনো সার্ভার নেই, অ্যাকাউন্ট নেই, ফাঁস হওয়ার কিছু নেই।'},
   {en:'Save everyone’s lists on one online database.',ok:false,why:'That needs accounts, security rules and a privacy note. Not for version 1.',whybn:'এর জন্য অ্যাকাউন্ট, নিরাপত্তা নিয়ম আর গোপনীয়তা নোট লাগবে। প্রথম সংস্করণে নয়।'}]},
 {label:'Rules and edge cases',bn:'নিয়ম ও ব্যতিক্রম',options:[
   {en:'Dates are dd/mm/yyyy. Impossible dates (31/02) show a warning. Past deadlines show “closed”.',ok:1,why:'Edge cases are where apps break. Writing them down tells the AI and your tester what “correct” means.',whybn:'ব্যতিক্রমী ক্ষেত্রেই অ্যাপ ভাঙে। লিখে রাখলে AI আর পরীক্ষক জানে “সঠিক” মানে কী।'},
   {en:'Dates in any format — the AI will work it out.',ok:false,why:'It won’t. AI often assumes American dates. Say it.',whybn:'পারবে না। AI প্রায়ই আমেরিকান তারিখ ধরে নেয়। বলে দাও।'}]},
 {label:'Screen design',bn:'স্ক্রিনের নকশা',options:[
   {en:'One screen: form on top, list below. Big text and buttons for small Android phones.',ok:1,why:'Design for the real phones your users have.',whybn:'ব্যবহারকারীদের আসল ফোনের জন্য নকশা করো।'},
   {en:'Many pages, animations and a splash screen.',ok:false,why:'Looks impressive, loads slowly on mobile data, and adds code to maintain.',whybn:'দেখতে চমৎকার, কিন্তু মোবাইল ডেটায় ধীরে খোলে আর রক্ষণাবেক্ষণের কোড বাড়ায়।'}]},
 {label:'Code rules',bn:'কোডের নিয়ম',options:[
   {en:'Small files with clear names. A comment at the top of each. Don’t add anything that isn’t in this spec.',ok:1,why:'This is code hygiene. Clean, small, labelled files are easy to check, fix and grow.',whybn:'এটাই কোডের পরিচ্ছন্নতা। ছোট, নাম দেওয়া, পরিষ্কার ফাইল যাচাই, সংশোধন আর বড় করা সহজ।'},
   {en:'Whatever is fastest.',ok:false,why:'Fast today, a mess next month. Nobody — not even the AI — can safely change a tangled file.',whybn:'আজ দ্রুত, পরের মাসে জট। জট পাকানো ফাইল কেউ নিরাপদে বদলাতে পারে না — AI-ও না।'}]}
];
const specDoc=x=>{const a=x.get('spec',{});const mods=x.get('modQ')!=null;
  return `<div class="page specdoc"><h2 style="font-size:16px">My Deadlines — spec</h2><div class="ct">Version 1 · Ayesha Rahman · 4 October</div>
   ${SPEC.map((s,i)=>`<h6>${esc(s.label)}</h6><p class="${a[i]!=null?'fresh':'gap'}">${a[i]!=null?s.options[a[i]].en:'_____________________'}</p>`).join('')}
   <h6>Modules</h6><p class="${mods?'fresh':'gap'}">${mods?'screen.html (what you see) · list.js (the list) · dates.js (date maths) · storage.js (saving on the phone)':'_____________________'}</p></div>`};

/* ---------- prompts ---------- */
const BUILD_CHIPS=[
 {id:'s1',tag:'Spec',text:'Build version 1 of “My Deadlines” from my attached spec.'},
 {id:'s2',tag:'Modules',text:'Use four files: screen.html, list.js, dates.js and storage.js.'},
 {id:'s3',tag:'Scope',text:'Follow the code rules in the spec. Don’t add features that are not in the spec.'},
 {id:'s4',tag:'Local detail',text:'Dates are day/month/year, like 15/01/2026.'},
 {id:'x1',tag:'Shortcut',x:1,text:'Add any cool features you think of.',warn:'that invites feature creep — the AI will add things you must then check and secure.',warnbn:'এতে ফিচার বাড়ার পথ খোলে — AI এমন জিনিস যোগ করবে যা তোমাকে যাচাই আর সুরক্ষিত করতে হবে।'},
 {id:'x2',tag:'Shortcut',x:1,text:'Put everything in one file.',warn:'one big file is hard to check and easy to break.',warnbn:'একটা বড় ফাইল যাচাই করা কঠিন, ভাঙা সহজ।'}
];
const BUILD_SLOTS=[
 {label:'Spec',frame:'<em>Build</em> ___ <em>from my attached spec.</em>',bn:'আমার সংযুক্ত স্পেক থেকে ___ বানাও।',test:[/spec/i]},
 {label:'Modules',frame:'<em>Use</em> ___ <em>files:</em> ___.',bn:'___টা ফাইল ব্যবহার করো: ___।',test:[/files?|modules?|dates\.js/i]},
 {label:'Scope',frame:'<em>Don’t add</em> ___.',bn:'___ যোগ কোরো না।',test:[/don'?t add|do not add|only what/i]},
 {label:'Local detail',frame:'<em>Dates are</em> ___, <em>like</em> ___.',bn:'তারিখ হলো ___, যেমন ___।',test:[/day\/month|dd\/mm|day.month.year/i]}
];
const buildText=x=>x.get('desc','')||BUILD_CHIPS.slice(0,4).map(c=>c.text).join(' ');

const BUG_CHIPS=[
 {id:'b1',tag:'Input',text:'When I add Oxford with the date 15/10/2025,'},
 {id:'b2',tag:'Expected',text:'I expect to see 11 days left.'},
 {id:'b3',tag:'Actual',text:'But I see “NaN days left”.'},
 {id:'b4',tag:'Cause?',text:'I think dates.js reads dates as month/day/year.'},
 {id:'bx',tag:'Shortcut',x:1,text:'It doesn’t work. Fix it.',warn:'too vague — the AI has to guess what is wrong.',warnbn:'খুব অস্পষ্ট — AI-কে অনুমান করতে হবে কী ভুল।'}
];
const BUG_SLOTS=[
 {label:'Input — what I did',frame:'<em>When I add</em> ___ <em>with the date</em> ___,',bn:'যখন আমি ___ তারিখ দিয়ে ___ যোগ করি,',test:[/when i|i add|i enter|i type/i]},
 {label:'Expected — what should happen',frame:'<em>I expect to see</em> ___.',bn:'আমি ___ দেখার আশা করি।',test:[/expect|should/i]},
 {label:'Actual — what really happened',frame:'<em>But I see</em> ___.',bn:'কিন্তু আমি দেখি ___।',test:[/but i see|i see|it shows|instead/i]}
];
const bugText=x=>x.get('bug','')||BUG_CHIPS.slice(0,4).map(c=>c.text).join(' ');
const SCOPE_CHIPS=[
 {id:'c1',tag:'Scope',text:'Only change dates.js.'},
 {id:'c2',tag:'Rule',text:'Read dates as day/month/year, like 15/10/2025.'},
 {id:'c3',tag:'Edge case',text:'If a date doesn’t exist, like 31/02, return “Not a real date”.'},
 {id:'c4',tag:'Guard',text:'Don’t change any other file.'},
 {id:'cx',tag:'Shortcut',x:1,text:'Fix everything and improve the design.',warn:'that’s exactly how the last fix broke the app.',warnbn:'ঠিক এভাবেই আগের সংশোধন অ্যাপটা ভেঙেছিল।'}
];
const SCOPE_SLOTS=[
 {label:'Scope',frame:'<em>Only change</em> ___.',bn:'শুধু ___ বদলাও।',test:[/only change|only edit|just change/i]},
 {label:'Rule',frame:'<em>Read dates as</em> ___.',bn:'তারিখ ___ হিসেবে পড়ো।',test:[/day\/month|dd\/mm/i]},
 {label:'Edge case',frame:'<em>If a date doesn’t exist,</em> ___.',bn:'তারিখ না থাকলে ___।',test:[/doesn'?t exist|not a real date|31\/02/i]},
 {label:'Guard',frame:'<em>Don’t change</em> ___.',bn:'___ বদলিও না।',test:[/don'?t change|no other file|nothing else/i]}
];
const scopeText=x=>x.get('scope','')||SCOPE_CHIPS.slice(0,4).map(c=>c.text).join(' ');

/* ---------- Studio's replies ---------- */
const BUILT=`<p>Done! I built <b>My Deadlines</b> version 1 from your spec ✨</p><div class="step-l"><div class="ok"><i>✓</i>screen.html — form on top, list below</div><div class="ok"><i>✓</i>list.js — nearest deadline first</div><div class="ok"><i>✓</i>dates.js — days left</div><div class="ok"><i>✓</i>storage.js — saved on this phone</div></div><p>I tested it and everything works ✅. Open <b>Preview</b> to try it.</p>`;
const REWRITE=`<p>Fixed! ✅ To make the dates work properly I rewrote the app with a cleaner structure.</p><div class="step-l"><div class="ok"><i>✓</i>New date engine</div><div class="ok"><i>✓</i>Fresh new design ✨</div><div class="ok"><i>✓</i>Sorted programmes A–Z so they’re easier to find</div><div class="ok"><i>✓</i>Faster new storage format</div></div><p>4 files changed · +120 −92. Try it in <b>Preview</b>!</p>`;
const SCOPED=`<p>Done. I changed <b>1 file: dates.js</b> (+4 −1). Nothing else was touched.</p><p>Dates are now read as day/month/year, and impossible dates return “Not a real date”. See the change in <b>Code</b>.</p>`;
const V3=`<p>Added a <b>shared list</b> with Firebase so the whole Study Circle can see everyone’s deadlines ✅</p><div class="step-l"><div class="ok"><i>✓</i>Firestore database + firestore.rules</div><div class="ok"><i>✓</i>Sign in with Google</div><div class="ok"><i>✓</i><b>Bonus:</b> AI-written reminder messages with Gemini 🎉</div></div><p>Your friends will love it! Everything works ✅</p>`;

const studioChat=(x,upto)=>{const m=[{role:'u',text:buildText(x),atts:['spec']},{role:'a',html:BUILT,id:'built',stream:upto===1,actions:false}];
  if(upto>=2) m.push({role:'u',text:bugText(x)});
  if(upto>=3) m.push({role:'a',html:REWRITE,id:'rewrite',stream:upto===3,actions:false});
  if(upto>=4) m.push({role:'u',text:scopeText(x)});
  if(upto>=5) m.push({role:'a',html:SCOPED,id:'scoped',stream:upto===5,actions:false});
  if(upto>=6) m.push({role:'u',text:'Add a shared list so the Study Circle can see each other’s deadlines. Follow the spec’s code rules.'});
  if(upto>=7) m.push({role:'a',html:V3,id:'v3',stream:upto===7,actions:false});
  return m;};
const SC=(x,extra)=>Object.assign({app:'studio',title:'My Deadlines',gitHit:''},extra);
const CHATS={group:'Economics Study Circle',members:'Riya, Tanvir, Mitu, you +14'};

/* ---------- GitHub tab ---------- */
const commit=(msg,who,when,files,cls='')=>`<div class="ghc ${cls}"><div class="gh-h"><span class="gh-dot"></span><span><b>${esc(msg)}</b><small>${esc(who)} · ${esc(when)}</small></span></div>${files?`<div class="gh-files">${files}</div>`:''}</div>`;
const v1msg=x=>({good:'v1: form, list and days left (from spec)',ai:'Update app',bad:'asdf'})[x.get('c1','good')]||'v1: form, list and days left (from spec)';
const v2msg=x=>({good:'v2: read dates as dd/mm/yyyy; warn on impossible dates',ai:'Update dates.js',bad:'fixed stuff'})[x.get('c2','good')]||'v2: read dates as dd/mm/yyyy; warn on impossible dates';
const gitRepo=x=>`<div class="ghsec">github.com/ayesha-r/my-deadlines · ${x.get('repo','private')==='public'?'Public':'Private 🔒'}</div>`;

AFL.lesson({
 id:'build', title:'Vibe-code an app', kicker:'Workflow 3 · Building', emoji:'⌨️', tint:'#E3E3EA', time:'45–50 min',
 blurb:'Plan it, spec it, build it, test it, secure it — and learn why a prototype isn’t a launch.',
 blurbbn:'পরিকল্পনা, স্পেক, বানানো, পরীক্ষা, নিরাপত্তা — আর জানো কেন প্রোটোটাইপ মানেই লঞ্চ নয়।',
 notif:{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'start:build'},
 stages:[{id:'plan',label:'Plan',d:'del'},{id:'spec',label:'Spec',d:'del'},{id:'build',label:'Build',d:'des'},{id:'test',label:'Test',d:'dis'},{id:'secure',label:'Secure',d:'dil'},{id:'launch',label:'Launch',d:'dil'}],
 beats:[
  /* ================= PLAN ================= */
  {stage:'plan',scene:{app:'lock',notifs:[{app:'chats',title:'Economics Study Circle',text:'Riya: Ayesha, can you make that deadline app you talked about? 🙏',time:'8:55',hit:'n:chat'}]},tap:'n:chat',
   say:'Ayesha’s study group needs something. Tap the message.',bn:'আয়েশার স্টাডি গ্রুপের কিছু দরকার। মেসেজে চাপো।'},
  {stage:'plan',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {from:'Mitu',color:'#A33A7A',text:'I missed the Groningen deadline 😭 I thought it was June.',time:'8:41'},
     {from:'Tanvir',color:'#1F5FA8',text:'Same problem. Too many dates, too many websites.',time:'8:43'},
     {from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},
     {me:1,text:'I’ve never coded… but I’ll try with Studio tonight!',time:'8:57'}]}),
   say:'Vibe coding: you describe the app, the AI writes the code. But you are still the builder.',bn:'ভাইব কোডিং: তুমি অ্যাপ বর্ণনা করো, AI কোড লেখে। কিন্তু নির্মাতা তুমিই।',
   card:{type:'info',points:[
     {i:'⌨️',en:'<b>The AI</b> writes the code — in seconds.',bn:'AI কোড লেখে — কয়েক সেকেন্ডে।'},
     {i:'🧭',en:'<b>You</b> make the builder’s decisions: what to build, how it’s organised, what it stores, when it’s safe.',bn:'নির্মাতার সিদ্ধান্ত তোমার: কী বানাবে, কীভাবে সাজাবে, কী জমা রাখবে, কখন নিরাপদ।'},
     {i:'🧪',en:'The AI will say “it works ✅”. Looking good is not the same as ready.',bn:'AI বলবে “কাজ করছে ✅”। দেখতে ভালো মানেই প্রস্তুত নয়।'},
     {i:'🛠️',en:'Real tools: Google AI Studio (Build), and similar apps. Ours is called Studio.',bn:'বাস্তব টুল: Google AI Studio (Build) ইত্যাদি। আমাদেরটার নাম Studio।'}]}},
  {stage:'plan',open:true,scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {from:'Riya',color:'#0E5A2A',text:'Ayesha, can you make that deadline app you talked about? Something simple on our phones 🙏',time:'8:55'},
     {from:'Tanvir',color:'#1F5FA8',text:'Ooh and reminders! And a shared list! And AI tips for each university!! 🤩',time:'8:58'},
     {from:'Mitu',color:'#A33A7A',text:'Dark mode pls 😎',time:'8:59'}]}),
   say:'Everyone wants more. Sort the ideas: what goes in version 1?',bn:'সবাই আরও চায়। আইডিয়াগুলো ভাগ করো: প্রথম সংস্করণে কী যাবে?',
   sub:'Every feature adds code, bugs and risks. This trap is called <b>feature creep</b>.',subbn:'প্রতিটি ফিচার কোড, বাগ আর ঝুঁকি বাড়ায়। এই ফাঁদের নাম <b>ফিচার ক্রিপ</b>।',
   card:{type:'sort',key:'feat',bins:[{id:'must',label:'Version 1'},{id:'later',label:'Later'},{id:'no',label:'Not needed'}],items:[
     {en:'Add a programme and its deadline',bn:'প্রোগ্রাম আর তার ডেডলাইন যোগ করা',ans:'must',why:'This is the whole app.',whybn:'পুরো অ্যাপটাই এটা।'},
     {en:'Show days left, nearest first',bn:'কত দিন বাকি দেখানো, কাছেরটা আগে',ans:'must',why:'This solves Mitu’s problem.',whybn:'এটাই মিতুর সমস্যার সমাধান।'},
     {en:'A shared list everyone can see',bn:'সবার দেখার মতো একটা শেয়ার করা তালিকা',ans:'later',why:'Useful — but it needs a database, sign-in and security rules. Not for version 1.',whybn:'কাজের — কিন্তু এর জন্য ডাটাবেস, সাইন-ইন আর নিরাপত্তা নিয়ম লাগে। প্রথম সংস্করণে নয়।',hint:'What does sharing need behind the scenes?',hintbn:'শেয়ার করতে পেছনে কী কী লাগে?'},
     {en:'AI tips for each university',bn:'প্রতিটি বিশ্ববিদ্যালয়ের জন্য AI-এর পরামর্শ',ans:'no',why:'It needs a paid API key, and AI tips can be wrong about real admissions. A link to the official website does the job.',whybn:'এর জন্য টাকা লাগা API কী দরকার, আর AI-এর পরামর্শ ভর্তির ব্যাপারে ভুল হতে পারে। অফিসিয়াল ওয়েবসাইটের লিংকই যথেষ্ট।',hint:'What could go wrong if the AI’s advice is wrong?',hintbn:'AI-এর পরামর্শ ভুল হলে কী হতে পারে?'},
     {en:'Dark mode',bn:'ডার্ক মোড',ans:'later',why:'Nice, but nobody misses a deadline because of light mode.',whybn:'ভালো, কিন্তু লাইট মোডের জন্য কেউ ডেডলাইন মিস করে না।'}]}},
  /* ================= SPEC ================= */
  {stage:'spec',open:true,scene:x=>({app:'gdoc',title:'My Deadlines — spec',page:specDoc(x)}),
   say:'Builders write a spec before they build. Choose each line of Ayesha’s spec.',bn:'নির্মাতারা বানানোর আগে স্পেক লেখে। আয়েশার স্পেকের প্রতিটি লাইন বেছে নাও।',
   sub:'A spec is a one-page plan: what the app does — and what it doesn’t.',subbn:'স্পেক হলো এক পাতার পরিকল্পনা: অ্যাপ কী করবে — আর কী করবে না।',
   card:{type:'pickeach',key:'spec',d:'del',items:SPEC}},
  {stage:'spec',open:true,scene:x=>({app:'gdoc',title:'My Deadlines — spec',page:specDoc(x)}),
   say:'Architecture: build the app in separate boxes, like a tiffin carrier.',bn:'আর্কিটেকচার: অ্যাপটা আলাদা আলাদা বাক্সে বানাও, টিফিন ক্যারিয়ারের মতো।',
   card:x=>({type:'html',html:`<div class="card"><div style="display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center">
     <svg viewBox="0 0 90 150" style="width:90px"><rect x="35" y="2" width="20" height="14" rx="4" fill="none" stroke="#5F6A5C" stroke-width="4"/><rect x="40" y="10" width="10" height="130" fill="#9AA39A"/>
     ${['#0A6A62','#3F4FA8','#8A5610','#A8322A'].map((c,i)=>`<rect x="8" y="${20+i*31}" width="74" height="27" rx="7" fill="${c}"/><rect x="8" y="${20+i*31}" width="74" height="6" rx="3" fill="#fff" opacity=".25"/>`).join('')}</svg>
     <ul class="plist" style="margin:0">
      <li><span class="ic" style="background:#DDEFEC">🖥</span><span><b>screen.html</b> — what you see</span></li>
      <li><span class="ic" style="background:#E4E7F7">📋</span><span><b>list.js</b> — the list and its order</span></li>
      <li><span class="ic" style="background:#F6EBD7">📅</span><span><b>dates.js</b> — date maths</span></li>
      <li><span class="ic" style="background:#F7E3E1">💾</span><span><b>storage.js</b> — saving on the phone</span></li></ul></div>
     <p style="margin-top:10px">One box spills? The others stay clean. You can fix or replace one box without touching the rest — and the app can grow box by box.<span class="bn" lang="bn">একটা বাক্স উপচে পড়লে বাকিগুলো পরিষ্কার থাকে। একটা বাক্স ঠিক বা বদলাতে বাকিগুলো ছুঁতে হয় না — আর অ্যাপটা বাক্স ধরে ধরে বড় হতে পারে।</span></p></div>`}),
   },
  {stage:'spec',open:true,scene:x=>({app:'gdoc',title:'My Deadlines — spec',page:specDoc(x)}),
   say:'Later, the dates are wrong. Which box do you open?',bn:'পরে দেখা গেল তারিখ ভুল। কোন বাক্সটা খুলবে?',
   card:{type:'choice',key:'modQ',options:[
     {en:'dates.js — only the date maths',bn:'dates.js — শুধু তারিখের হিসাব',ok:1,why:'Yes. One small file to check and fix. This will matter soon.',whybn:'হ্যাঁ। যাচাই আর ঠিক করার জন্য একটা ছোট ফাইল। একটু পরেই এটা কাজে লাগবে।'},
     {en:'All of them — rewrite the app',bn:'সবগুলো — পুরো অ্যাপ নতুন করে লেখা',ok:0,why:'Rewriting everything to fix one thing is how new bugs are born.',whybn:'একটা জিনিস ঠিক করতে সব নতুন করে লেখা — এভাবেই নতুন বাগ জন্মায়।'},
     {en:'screen.html — make the numbers look right',bn:'screen.html — সংখ্যাগুলো ঠিক দেখানো',ok:0,why:'That hides the problem instead of fixing it.',whybn:'এতে সমস্যা লুকানো হয়, ঠিক হয় না।'}]}},
  /* ================= BUILD ================= */
  {stage:'build',scene:{app:'home'},tap:'app:studio',
   say:'Open Studio.',bn:'Studio খোলো।'},
  {stage:'build',scene:x=>SC(x,{title:'New app',tab:'Chat',msgs:[],composer:{key:'desc',atts:['spec'],placeholder:'Describe your app…'},kb:{key:'desc',label:'BUILD PROMPT',chips:BUILD_CHIPS}}),tap:'send',
   say:'Give Studio the spec and a short, clear prompt.',bn:'Studio-কে স্পেক আর একটা ছোট, স্পষ্ট প্রম্পট দাও।',
   compose:{key:'desc',title:'Build prompt',titlebn:'বানানোর প্রম্পট',slots:BUILD_SLOTS,chips:BUILD_CHIPS,best:['s1','s2','s3','s4'],ready:'Clear and scoped. Send it.',readybn:'স্পষ্ট আর সীমিত। পাঠাও।'}},
  {stage:'build',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1),composer:false,gitHit:'git'}),tap:'git',
   say:x=>x.streaming?'Studio is building…':'Before you touch anything, make a save point. Tap the GitHub icon.',bn:'কিছু ছোঁয়ার আগে একটা সেভ পয়েন্ট বানাও। GitHub আইকনে চাপো।',
   sub:'Git keeps every version of your app. If the AI breaks something, you can go back.',subbn:'Git তোমার অ্যাপের প্রতিটি সংস্করণ রাখে। AI কিছু ভাঙলে আগের সংস্করণে ফিরে যেতে পারো।'},
  {stage:'build',d:'dil',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1),composer:false,gitHit:'git',sheet:{html:`<h3>${ico('git')} Sync with GitHub</h3><p class="sh-sub">Create a new repository for My Deadlines.</p>
     ${[['private','Private','Only you (and people you invite) can see the code'],['public','Public','Anyone on the internet can see the code']].map(([k,t,s])=>`<button class="radio ${x.get('repo')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${t}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'Create the repository. Private or public?',bn:'রিপোজিটরি বানাও। প্রাইভেট না পাবলিক?',
   decide:{key:'repo',options:{private:{ok:1,why:'Start private. You can open it later, after you check there are no secrets in it.',whybn:'প্রাইভেট দিয়ে শুরু করো। ভেতরে কোনো গোপন কিছু নেই নিশ্চিত হলে পরে খুলতে পারো।'},public:{ok:0,why:'Fine for open-source — but anything in a public repo, including a secret key by mistake, is visible to the whole internet.',whybn:'ওপেন-সোর্সের জন্য ঠিক আছে — কিন্তু পাবলিক রিপোতে যা থাকে, ভুল করে রাখা গোপন কী-সহ, পুরো ইন্টারনেট দেখতে পায়।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  {stage:'build',d:'dil',scene:x=>SC(x,{tab:'GitHub',git:`${gitRepo(x)}<div class="ghsec">Ready to save · 4 files</div>${commit('Commit message (AI suggestion): “Update app”','Studio','now','<i>+ screen.html</i><br><i>+ list.js</i><br><i>+ dates.js</i><br><i>+ storage.js</i>','unc')}`,sheet:{html:`<h3>Commit message</h3><p class="sh-sub">A commit is a save point. Its message tells future-you what changed.</p>
     ${[['ai','Update app','Studio’s suggestion'],['good','v1: form, list and days left (from spec)','Says what this version is'],['bad','asdf','Quick!']].map(([k,t,s])=>`<button class="radio ${x.get('c1')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${esc(t)}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'Save version 1. Choose a commit message.',bn:'প্রথম সংস্করণ সেভ করো। একটা কমিট মেসেজ বেছে নাও।',
   decide:{key:'c1',options:{good:{ok:1,why:'Clear. In two weeks you’ll know exactly which save point to go back to.',whybn:'স্পষ্ট। দুই সপ্তাহ পরেও জানবে ঠিক কোন সেভ পয়েন্টে ফিরতে হবে।'},ai:{ok:0,why:'Every save would say “Update app”. AI-written messages are a start — improve them.',whybn:'প্রতিটি সেভ বলবে “Update app”। AI-এর লেখা মেসেজ শুরু মাত্র — ভালো করে নাও।'},bad:{ok:false,why:'A save point you can’t recognise later is almost no save point.',whybn:'পরে চেনা যায় না এমন সেভ পয়েন্ট প্রায় না থাকারই মতো।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  /* ================= TEST ================= */
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v1',mini:miniApp(x,'v1')}),
   onUi:onMini,showMe:autoTest('v1',[0,2,4]),docs:['checklist'],
   say:'“Everything works ✅.” Test it. Add three deadlines from Ayesha’s checklist.',bn:'“সব ঠিক আছে ✅।” পরীক্ষা করো। আয়েশার চেকলিস্ট থেকে তিনটা ডেডলাইন যোগ করো।',
   sub:'Tap a dashed button, then Add.',subbn:'একটা ড্যাশ-দেওয়া বোতাম চাপো, তারপর Add।',
   card:x=>{const it=x.get('items_v1',[]);const bad=it.some(i=>Number.isNaN(daysLeft('v1',i.date))||daysLeft('v1',i.date)<0);
     return {type:'html',html:`<div class="tally">${[0,1,2].map(i=>`<span class="${it[i]?'done':''}">${i+1}</span>`).join('')}</div>
      ${bad?`<div class="warn"><b>Something is wrong.</b> “NaN” means “not a number” — the app couldn’t do the maths. A negative number means the deadline has passed — but it hasn’t!<span class="bn" lang="bn">কিছু একটা ভুল। “NaN” মানে “সংখ্যা নয়” — অ্যাপ হিসাব করতে পারেনি। ঋণাত্মক সংখ্যা মানে ডেডলাইন পার হয়ে গেছে — কিন্তু হয়নি!</span></div>`:`<div class="note">Today is 4 October. Oxford is 15 October — so you expect <b>11 days left</b>.<span class="bn" lang="bn">আজ ৪ অক্টোবর। অক্সফোর্ড ১৫ অক্টোবর — তাই ১১ দিন বাকি দেখার কথা।</span></div>`}`}}},
  {stage:'test',open:true,scene:x=>SC(x,{tab:'Code',files:FILES4,fileOn:'dates.js',code:DATES_V1}),
   say:'The bug lives in one box: dates.js.',bn:'বাগটা একটা বাক্সেই আছে: dates.js।',
   card:{type:'html',html:`<div class="card"><h3>Why it broke</h3><p>Bangladesh writes <b>15/10/2025</b> as day/month/year. <code>new Date()</code> reads it the American way: month 15 — not a real month. So the app shows <b>NaN</b>, and 01/12 becomes 12 January.</p><span class="bn" lang="bn">বাংলাদেশে ১৫/১০/২০২৫ মানে দিন/মাস/বছর। new Date() আমেরিকান নিয়মে পড়ে: মাস ১৫ — যা হয় না। তাই NaN, আর ০১/১২ হয়ে যায় ১২ জানুয়ারি।</span></div>
     <div class="note">Your spec said dd/mm/yyyy, and the AI still got it wrong. Clear instructions help — <b>testing</b> is what catches it.<span class="bn" lang="bn">তোমার স্পেকে dd/mm/yyyy লেখা ছিল, তবুও AI ভুল করেছে। স্পষ্ট নির্দেশনা সাহায্য করে — কিন্তু ভুল ধরে পরীক্ষা।</span></div>`}},
  {stage:'test',d:'des',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1),composer:{key:'bug',placeholder:'Tell Studio what’s wrong…'},kb:{key:'bug',label:'BUG REPORT',chips:BUG_CHIPS}}),tap:'send',
   say:'Write a clear bug report: what you did, what you expected, what you saw.',bn:'স্পষ্ট বাগ রিপোর্ট লেখো: তুমি কী করেছ, কী আশা করেছ, কী দেখেছ।',
   compose:{key:'bug',title:'Input · Expected · Actual',titlebn:'ইনপুট · প্রত্যাশা · বাস্তবে যা ঘটেছে',slots:BUG_SLOTS,chips:BUG_CHIPS,best:['b1','b2','b3','b4'],ready:'A developer would love this report. Send it.',readybn:'যেকোনো ডেভেলপার এই রিপোর্ট পছন্দ করবে। পাঠাও।'}},
  {stage:'test',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,3),composer:false,scrollTo:'[data-mid="rewrite"]',tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:x=>x.streaming?'Studio is fixing it…':'“4 files changed” — to fix one date bug? Test it: tap Preview.',bn:'“৪টা ফাইল বদলেছে” — একটা তারিখের বাগ ঠিক করতে? পরীক্ষা করো: Preview চাপো।'},
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'2.0 (AI rewrite)',mini:miniApp(x,'bad'),gitHit:'git'}),
   onUi:onMini,showMe:autoTest('bad',[0,1,3]),
   say:'The dates work now. What else changed? Add three deadlines.',bn:'তারিখ এখন ঠিক। আর কী বদলেছে? তিনটা ডেডলাইন যোগ করো।',
   card:x=>{const it=x.get('items_bad',[]);return {type:'html',html:`<div class="tally">${[0,1,2].map(i=>`<span class="${it[i]?'done':''}">${i+1}</span>`).join('')}</div>${it.length>=2?`<div class="warn"><b>Two new bugs.</b> The list is sorted A–Z, not nearest first — Oxford (11 days) is at the bottom. And the 3 deadlines you saved in version 1 are gone.<span class="bn" lang="bn">দুটো নতুন বাগ। তালিকা A–Z সাজানো, কাছেরটা আগে নয় — অক্সফোর্ড (১১ দিন) সবার নিচে। আর প্রথম সংস্করণে সেভ করা ৩টা ডেডলাইন উধাও।</span></div><p class="sub">The AI fixed one bug and made two. It also ignored your spec (“don’t add anything”).<span class="bn" lang="bn">AI একটা বাগ ঠিক করে দুটো বানিয়েছে। স্পেকও মানেনি (“কিছু যোগ কোরো না”)।</span></p>`:`<div class="note">Compare with your spec: “Show days left, nearest first.”<span class="bn" lang="bn">স্পেকের সাথে মেলাও: “কত দিন বাকি, কাছেরটা আগে।”</span></div>`}`}}},
  {stage:'test',d:'dil',scene:x=>SC(x,{tab:'GitHub',git:`${gitRepo(x)}<div class="ghsec">Not saved yet</div>
     <div class="ghc unc"><div class="gh-h"><span class="gh-dot"></span><span><b>AI rewrite — 4 files changed (+120 −92)</b><small>Studio · just now · not committed</small></span></div><div class="gh-files"><u>~ screen.html</u> · <u>~ list.js</u> · <u>~ dates.js</u> · <u>~ storage.js</u></div>
      <div class="acts"><button class="mdbtn" style="background:#A8C7FA;color:#062E6F" data-ui="opt:restore">Discard and restore v1</button><button class="mdbtn tonal" data-ui="opt:commit">Commit these changes</button><button class="mdbtn out" style="color:#A8C7FA" data-ui="opt:patch">Keep it, ask AI to fix the new bugs</button></div></div>
     <div class="ghsec">History</div>${commit(v1msg(x),'Ayesha','21:10')}`}),
   say:'This is why you made a save point. What now?',bn:'এজন্যই সেভ পয়েন্ট বানিয়েছিলে। এখন কী?',
   decide:{key:'restore',options:{restore:{ok:1,why:'Back to version 1 in one tap: sorting works, the list is safe. Now ask for a smaller change.',whybn:'এক চাপে প্রথম সংস্করণে ফিরে যাও: সাজানো ঠিক, তালিকা নিরাপদ। এবার ছোট একটা পরিবর্তন চাও।'},
     commit:{ok:false,why:'That saves the broken version as your new save point — and the lost data with it.',whybn:'এতে ভাঙা সংস্করণটাই নতুন সেভ পয়েন্ট হয়ে যায় — হারানো তথ্যসহ।'},
     patch:{ok:0,why:'Possible, but now you are fixing the AI’s fix of the AI’s fix. Small, checked steps are faster in the end.',whybn:'সম্ভব, কিন্তু তখন AI-এর সংশোধনের সংশোধন ঠিক করতে হবে। ছোট, যাচাই করা ধাপই শেষে দ্রুত।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  {stage:'test',d:'des',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,1).concat([{role:'u',text:bugText(x)}]),composer:{key:'scope',placeholder:'Ask for a small change…'},kb:{key:'scope',label:'SCOPED REQUEST',chips:SCOPE_CHIPS}}),tap:'send',
   say:'Restored. Now ask for one small change, in one box.',bn:'ফিরে আসা হয়েছে। এবার একটা বাক্সে একটা ছোট পরিবর্তন চাও।',
   compose:{key:'scope',title:'Scope the change',titlebn:'পরিবর্তনের সীমা ঠিক করো',slots:SCOPE_SLOTS,chips:SCOPE_CHIPS,best:['c1','c2','c3','c4'],ready:'Small and safe. Send it.',readybn:'ছোট আর নিরাপদ। পাঠাও।'}},
  {stage:'test',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,5),composer:false,scrollTo:'[data-mid="scoped"]',tabHits:{Code:'tab:code'}}),tap:'tab:code',
   say:x=>x.streaming?'Studio is changing one file…':'“1 file changed.” Check it yourself: tap Code.',bn:'“১টা ফাইল বদলেছে।” নিজে যাচাই করো: Code চাপো।'},
  {stage:'test',scene:x=>SC(x,{tab:'Code',files:FILES4,fileOn:'dates.js',code:DATES_V2,tabHits:{Preview:'tab:prev'}}),tap:'tab:prev',
   say:'1 file changed, 4 lines. Red = removed, green = added. Now test again: tap Preview.',bn:'১টা ফাইল, ৪টা লাইন বদলেছে। লাল = বাদ, সবুজ = যোগ। এবার আবার পরীক্ষা: Preview চাপো।'},
  {stage:'test',scene:x=>SC(x,{tab:'Preview',ver:'v2',mini:miniApp(x,'v2')}),
   onUi:onMini,showMe:autoTest('v2',[0,2,4,5]),docs:['checklist'],
   say:'Test again — same dates. Also try the impossible date.',bn:'আবার পরীক্ষা করো — একই তারিখ। অসম্ভব তারিখটাও চেষ্টা করো।',
   card:x=>{const it=x.get('items_v2',[]);const want={Oxford:11,LSE:27,Erasmus:58,'Göttingen':72,Sussex:103};
     const rows=it.map(i=>{const n=daysLeft('v2',i.date);const w=want[i.name];return `<tr><td style="padding:4px 6px">${esc(i.name)}</td><td style="padding:4px 6px">${w!=null?w:'warning'}</td><td style="padding:4px 6px">${n==='bad'?'warning':n}</td><td>${(w!=null&&w===n)||(w==null&&n==='bad')?'✅':'❌'}</td></tr>`}).join('');
     return {type:'html',html:it.length?`<div class="card" style="padding:8px"><table style="width:100%;font-size:13.5px;border-collapse:collapse"><tr style="text-align:left;color:var(--ink-muted)"><th style="padding:4px 6px">Programme</th><th>Expected</th><th>Actual</th><th></th></tr>${rows}</table></div>${it.length>=3?`<div class="good">Every result matches — and the list is nearest first again.<span class="bn" lang="bn">প্রতিটি ফল মেলে — আর তালিকা আবার কাছেরটা আগে।</span></div>`:''}`:`<div class="note">Write the expected days on paper first, then compare. Today is 4 October.<span class="bn" lang="bn">আগে কাগজে প্রত্যাশিত দিন লেখো, তারপর মেলাও। আজ ৪ অক্টোবর।</span></div>`}}},
  {stage:'test',d:'dil',scene:x=>SC(x,{tab:'GitHub',git:`${gitRepo(x)}<div class="ghsec">Ready to save · 1 file</div>${commit('Commit message (AI suggestion): “Update dates.js”','Studio','now','<i>~ dates.js</i> (+4 −1)','unc')}<div class="ghsec">History</div>${commit(v1msg(x),'Ayesha','21:10')}`,
     sheet:{html:`<h3>Commit message</h3><p class="sh-sub">Save the tested fix.</p>${[['ai','Update dates.js','Studio’s suggestion'],['good','v2: read dates as dd/mm/yyyy; warn on impossible dates','What changed, and why'],['bad','fixed stuff','Quick!']].map(([k,t,s])=>`<button class="radio ${x.get('c2')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${esc(t)}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'Tested and working. Save version 2.',bn:'পরীক্ষিত, কাজ করছে। দ্বিতীয় সংস্করণ সেভ করো।',
   decide:{key:'c2',options:{good:{ok:1,why:'Now your history tells a story: v1 built, v2 dates fixed. Commit after testing, not before.',whybn:'এখন তোমার ইতিহাস একটা গল্প বলে: v1 বানানো, v2 তারিখ ঠিক। পরীক্ষার পরে কমিট করো, আগে নয়।'},ai:{ok:0,why:'Better than nothing, but it doesn’t say what was wrong.',whybn:'কিছু না থাকার চেয়ে ভালো, কিন্তু কী ভুল ছিল তা বলে না।'},bad:{ok:false,why:'Future-you will not thank you.',whybn:'ভবিষ্যতের তুমি এজন্য ধন্যবাদ দেবে না।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  /* ================= SECURE ================= */
  {stage:'secure',d:'del',scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {me:1,html:'Version 2 works! 📅 Dates checked against my list.',time:'22:40'},
     {from:'Riya',color:'#0E5A2A',text:'Amazing!! Can we all see each other’s deadlines in one shared list? Then we can remind each other 🙏',time:'22:42'},
     {from:'Tanvir',color:'#1F5FA8',text:'Yes yes. Shared list = must have',time:'22:43'}]}),
   say:'The group wants the shared list now. Ayesha decides to build it as version 3.',bn:'গ্রুপ এখনই শেয়ার করা তালিকা চায়। আয়েশা তৃতীয় সংস্করণে এটা বানানোর সিদ্ধান্ত নিল।',
   card:{type:'info',points:[
     {i:'🗄️',en:'Sharing means the data leaves the phone: a <b>database</b> online (Studio uses Firebase Firestore).',bn:'শেয়ার মানে তথ্য ফোনের বাইরে যায়: অনলাইনে একটা ডাটাবেস (Studio ব্যবহার করে Firebase Firestore)।'},
     {i:'🔑',en:'A database needs <b>sign-in</b> and <b>security rules</b>: who may read, who may change.',bn:'ডাটাবেসের জন্য সাইন-ইন আর নিরাপত্তা নিয়ম লাগে: কে পড়তে পারবে, কে বদলাতে পারবে।'},
     {i:'⚠️',en:'One “small” feature just tripled the risk. That is the price of feature creep.',bn:'একটা “ছোট” ফিচার ঝুঁকি তিন গুণ বাড়িয়ে দিল। এটাই ফিচার ক্রিপের দাম।'}]}},
  {stage:'secure',scene:x=>SC(x,{tab:'Chat',msgs:studioChat(x,7).slice(-2),composer:false,scrollTo:'[data-mid="v3"]',tabHits:{Code:'tab:code'}}),tap:'tab:code',
   say:x=>x.streaming?'Studio is building version 3…':'“Bonus: AI-written reminders 🎉” — did anyone ask for that? Open Code.',bn:'“বোনাস: AI-এর লেখা রিমাইন্ডার 🎉” — কেউ কি এটা চেয়েছিল? Code খোলো।'},
  {stage:'secure',scene:x=>({...SC(x,{tab:'Code',files:['screen.html','list.js','dates.js','storage.js','firestore.rules','reminders.js'],fileOn:'firestore.rules',code:x.get('rules')==='members'?RULES_GOOD:RULES_BAD}),sheet:x.get('rulesOpen',1)?{html:`<h3>Firestore security rules</h3><p class="sh-sub">Who may read and change the shared list?</p>
     ${[['test','Keep test mode','allow read, write: if true'],['members','Members only','Signed-in members can read. Each person can edit only their own deadlines.'],['none','Lock everything','Nobody can read or write']].map(([k,t,s])=>`<button class="radio ${x.get('rules')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${t}</b><span>${s}</span></span></button>`).join('')}`}:null}),
   say:'Look at the highlighted rule: <code>allow read, write: if true</code>.',bn:'চিহ্নিত নিয়মটা দেখো: allow read, write: if true।',
   decide:{key:'rules',think:[{i:'🌍',en:'<b>if true</b> means: always. Anyone on the internet with the link.',bn:'if true মানে: সবসময়। লিংক থাকলে ইন্টারনেটের যে কেউ।'},{i:'✏️',en:'<b>write</b> means change — or delete everything.',bn:'write মানে বদলানো — বা সব মুছে ফেলা।'}],
     options:{test:{ok:false,why:'“Test mode” lets anyone read every member’s list, change dates, or delete it all. AI tools often leave it on. It is for a few minutes on your own laptop — never for real users.',whybn:'“টেস্ট মোড”-এ যে কেউ সবার তালিকা পড়তে, তারিখ বদলাতে বা সব মুছতে পারে। AI টুল প্রায়ই এটা চালু রেখে দেয়। এটা নিজের ল্যাপটপে কয়েক মিনিটের জন্য — আসল ব্যবহারকারীর জন্য কখনো নয়।'},
      members:{ok:1,why:'Least access again: members can read; you can change only your own deadlines. The rule in the code turns green.',whybn:'আবারও সবচেয়ে কম অ্যাক্সেস: সদস্যরা পড়তে পারবে; শুধু নিজের ডেডলাইন বদলাতে পারবে। কোডের নিয়ম সবুজ হয়ে গেল।'},
      none:{ok:0,why:'Safe — but the app stops working. Security rules should fit the job, not just say no.',whybn:'নিরাপদ — কিন্তু অ্যাপ কাজ করবে না। নিয়ম কাজের মাপে হওয়া উচিত, শুধু “না” বলা নয়।'}},prompt:'Choose a rule on the phone.',promptbn:'ফোনে একটা নিয়ম বেছে নাও।'}},
  {stage:'secure',scene:x=>({...SC(x,{tab:'Code',files:['screen.html','list.js','dates.js','storage.js','firestore.rules','reminders.js'],fileOn:'reminders.js',code:KEY_BAD}),sheet:{html:`<h3>reminders.js — a file you didn’t ask for</h3><p class="sh-sub">Line 2 holds a <b>Gemini API key</b>. The code is already pushed to GitHub.</p>
     ${[['leave','Leave it — the reminders are nice','The key stays in the code'],['hide','Just delete the key line','Remove it from the file'],['revoke','Remove the feature, and revoke the key','Delete reminders.js · cancel the key in Google AI Studio · make a new one only if needed, kept on a server']].map(([k,t,s])=>`<button class="radio ${x.get('key')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${t}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'Now open reminders.js. Look at line 2.',bn:'এবার reminders.js খোলো। দ্বিতীয় লাইনটা দেখো।',
   decide:{key:'key',think:[{i:'🔑',en:'An API key is like a <b>bank card number</b> for an AI service. Whoever has it can spend your quota or money.',bn:'API কী হলো AI সেবার ব্যাংক কার্ড নম্বরের মতো। যার কাছে থাকে সে তোমার কোটা বা টাকা খরচ করতে পারে।'},{i:'👀',en:'Code that runs in the browser can be <b>read by anyone</b> who opens the app.',bn:'ব্রাউজারে চলা কোড অ্যাপ খোলা যে কেউ পড়তে পারে।'},{i:'🕰️',en:'Git keeps <b>every</b> old version — including the one with the key.',bn:'Git প্রতিটি পুরনো সংস্করণ রাখে — কী-সহটাও।'}],
     options:{leave:{ok:false,why:'Anyone can open the app, read the key, and use it. Bots search GitHub for keys like this all day.',whybn:'যে কেউ অ্যাপ খুলে কী পড়ে ব্যবহার করতে পারে। বট সারাদিন GitHub-এ এমন কী খোঁজে।'},
      hide:{ok:0,why:'Not enough. The key is still in your Git history. Once a secret is pushed, treat it as stolen: revoke it.',whybn:'যথেষ্ট নয়। কী এখনও Git-এর ইতিহাসে আছে। গোপন জিনিস একবার পুশ হলে চুরি হয়েছে ধরে নাও: বাতিল করো।'},
      revoke:{ok:1,why:'Right on both counts. The feature wasn’t in the spec (feature creep), and a leaked key must be cancelled, not just hidden. Secret keys belong on a server, never in app code.',whybn:'দুদিকেই ঠিক। ফিচারটা স্পেকে ছিল না (ফিচার ক্রিপ), আর ফাঁস হওয়া কী লুকালে হবে না, বাতিল করতে হবে। গোপন কী থাকবে সার্ভারে, অ্যাপের কোডে কখনো নয়।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  /* ================= LAUNCH ================= */
  {stage:'launch',open:true,scene:x=>SC(x,{tab:'Preview',ver:'v3',mini:miniApp(x,'v2')}),
   say:'It works and it looks good. Is it ready to launch?',bn:'কাজ করছে, দেখতেও ভালো। লঞ্চের জন্য কি প্রস্তুত?',
   sub:'Sort the road from prototype to launch: done, or not yet?',subbn:'প্রোটোটাইপ থেকে লঞ্চের পথ ভাগ করো: হয়ে গেছে, নাকি এখনো না?',
   card:{type:'sort',key:'road',bins:[{id:'done',label:'Done ✓'},{id:'not',label:'Not yet'}],items:[
     {en:'Works on Ayesha’s own phone',bn:'আয়েশার নিজের ফোনে চলে',ans:'done',why:'Yes — that’s a prototype. The start of the road, not the end.',whybn:'হ্যাঁ — এটা প্রোটোটাইপ। পথের শুরু, শেষ নয়।'},
     {en:'Tested on other phones, including an old Android and slow mobile data',bn:'অন্য ফোনে পরীক্ষা, পুরনো অ্যান্ড্রয়েড আর ধীর মোবাইল ডেটাসহ',ans:'not',why:'Her friends’ phones are older and slower. Many apps fail here.',whybn:'বন্ধুদের ফোন পুরনো, ধীর। অনেক অ্যাপ এখানেই ব্যর্থ হয়।'},
     {en:'Edge cases: empty list, 100 deadlines, past dates, wrong input',bn:'ব্যতিক্রম: খালি তালিকা, ১০০টা ডেডলাইন, পুরনো তারিখ, ভুল ইনপুট',ans:'not',why:'She tested a few dates. Real users will try everything.',whybn:'সে কয়েকটা তারিখ পরীক্ষা করেছে। আসল ব্যবহারকারী সব চেষ্টা করবে।'},
     {en:'Security rules set, no secret keys in the code',bn:'নিরাপত্তা নিয়ম ঠিক, কোডে কোনো গোপন কী নেই',ans:'done',why:'Yes — you just did this.',whybn:'হ্যাঁ — এইমাত্র করলে।'},
     {en:'Every version saved in Git',bn:'প্রতিটি সংস্করণ Git-এ সেভ',ans:'done',why:'Yes — v1, v2 and now v3.',whybn:'হ্যাঁ — v1, v2 আর এখন v3।'},
     {en:'A privacy note: what the app stores, and why',bn:'গোপনীয়তা নোট: অ্যাপ কী জমা রাখে, কেন',ans:'not',why:'The shared list stores names and plans. Users have a right to know.',whybn:'শেয়ার করা তালিকায় নাম আর পরিকল্পনা থাকে। ব্যবহারকারীর জানার অধিকার আছে।'},
     {en:'Five real users try it and give feedback',bn:'পাঁচজন আসল ব্যবহারকারী চালিয়ে মতামত দেয়',ans:'not',why:'A beta test. They will find bugs you never imagined.',whybn:'বেটা টেস্ট। তারা এমন বাগ খুঁজে পাবে যা তুমি কল্পনাও করোনি।'},
     {en:'A plan for who fixes bugs after launch',bn:'লঞ্চের পরে বাগ কে ঠিক করবে তার পরিকল্পনা',ans:'not',why:'Launch is the start of maintenance, not the end of work.',whybn:'লঞ্চ মানে রক্ষণাবেক্ষণের শুরু, কাজের শেষ নয়।'}]}},
  {stage:'launch',scene:x=>SC(x,{tab:'Preview',ver:'v3',mini:miniApp(x,'v2'),sheet:{html:`<h3>Share “My Deadlines”</h3><p class="sh-sub">How should Ayesha share version 3?</p>
     ${[['beta','Beta test with 5 friends','Labelled “test version”, with a feedback form'],['all','Post it to the whole university Facebook group','Thousands of students'],['wait','Wait until it is perfect','Don’t share yet']].map(([k,t,s])=>`<button class="radio ${x.get('shareMode')===k?'on pick':''}" data-ui="opt:${k}"><i></i><span><b>${t}</b><span>${s}</span></span></button>`).join('')}`}}),
   say:'So how should she share it?',bn:'তাহলে কীভাবে শেয়ার করবে?',
   decide:{key:'shareMode',options:{beta:{ok:1,why:'Small, honest and useful: real users, clearly told it’s a test, with a way to report problems.',whybn:'ছোট, সৎ আর কাজের: আসল ব্যবহারকারী, স্পষ্ট জানানো যে এটা পরীক্ষা, আর সমস্যা জানানোর উপায়।'},all:{ok:false,why:'Thousands of users on an untested prototype: bugs, lost data, and her name on it.',whybn:'অপরীক্ষিত প্রোটোটাইপে হাজার হাজার ব্যবহারকারী: বাগ, হারানো তথ্য, আর তার নাম জড়িত।'},wait:{ok:0,why:'“Perfect” never comes. A small beta is how apps get better.',whybn:'“নিখুঁত” কখনো আসে না। ছোট বেটা দিয়েই অ্যাপ ভালো হয়।'}},prompt:'Choose on the phone.',promptbn:'ফোনে বেছে নাও।'}},
  {stage:'launch',scene:Object.assign({app:'chats'},CHATS,{msgs:[
     {me:1,html:'🧪 <b>Beta test — 5 volunteers please!</b><br>My Deadlines v3 · <a>my-deadlines.studio.app</a><br>Made with AI help. It’s a test version: check every date on the official website, and tell me what breaks 🙏',time:'23:05'},
     {from:'Riya',color:'#0E5A2A',text:'Me! Found one already: it crashes when I add 40 programmes 😅',time:'23:12'},
     {from:'Mitu',color:'#A33A7A',text:'On my old phone the Add button is under the keyboard',time:'23:15'}]}),
   say:'Two bugs in ten minutes. That’s the beta working.',bn:'দশ মিনিটে দুটো বাগ। এটাই বেটার কাজ।',
   card:{type:'html',html:`<div class="good">She said it was a <b>test</b>, <b>made with AI help</b>, and asked friends to <b>check official dates</b> and <b>report bugs</b>. Each bug goes back into the loop: report → small fix → test → commit.<span class="bn" lang="bn">সে বলেছে এটা পরীক্ষা, AI-এর সাহায্যে বানানো, আর বন্ধুদের অফিসিয়াল তারিখ মিলিয়ে বাগ জানাতে বলেছে। প্রতিটি বাগ আবার চক্রে ফেরে: রিপোর্ট → ছোট সংশোধন → পরীক্ষা → কমিট।</span></div>`}},
  {stage:'launch',open:true,scene:{app:'home'},
   say:'Tell your partner what a builder does.',bn:'তোমার সঙ্গীকে বলো একজন নির্মাতা কী করে।',
   card:{type:'say',lines:[
     {en:'I <u>wrote a spec</u> first, so the AI <u>built</u> only what we needed.',bn:'আমি আগে স্পেক লিখেছি, তাই AI শুধু দরকারি জিনিসই বানিয়েছে।'},
     {en:'When the AI’s fix <u>broke</u> the app, I <u>restored</u> my last save point.',bn:'AI-এর সংশোধন অ্যাপ ভেঙে দিলে আমি শেষ সেভ পয়েন্টে ফিরে গেছি।'},
     {en:'It <u>looked</u> finished, but it <u>wasn’t</u> ready, so I <u>shared</u> it as a beta.',bn:'দেখতে শেষ মনে হলেও প্রস্তুত ছিল না, তাই বেটা হিসেবে শেয়ার করেছি।'}]}},
  {stage:'launch',open:true,scene:{app:'home'},
   say:'Done! You did the builder’s job — without writing code.',bn:'শেষ! কোড না লিখেই তুমি নির্মাতার কাজ করেছ।',
   card:{type:'html',html:`<div class="big4"><div class="d-del"><b>Delegation</b><span>Scope, spec, modules, code rules, screen design. The AI writes; you decide.</span></div><div class="d-des"><b>Description</b><span>Build from the spec. Bug reports. One small change, in one file.</span></div><div class="d-dis"><b>Discernment</b><span>“It works ✅” is a claim. Your test is the proof.</span></div><div class="d-dil"><b>Diligence</b><span>Save points, security rules, no secret keys — and a long road from prototype to launch.</span></div></div>
     <div class="pick-cards"><button class="pcard" data-start="cv"><span class="pi" style="background:#D7E3FF">📄</span><span><em>Also try</em><b>An honest CV with AI</b></span></button><button class="pcard" data-start="agent"><span class="pi" style="background:#FFDBCC">🛰️</span><span><em>Also try</em><b>Set up an AI agent</b></span></button></div>`}}
 ]
});
})();
