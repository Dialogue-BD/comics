/* CV with AI — Ayesha turns her real documents into an honest academic CV.
 * Every fact below comes from Ayesha's classroom documents (CV, IELTS mock
 * report, RUCEI project report, shortlist). The AI replies are scripted from
 * real chatbot runs: the short prompt gets the typical "impressive" rewrite,
 * the full prompt gets questions first and a draft with three slips to catch.
 */
(function(){
const {esc}=AFL;

const ASK_FIRST='make my cv better for scholarship';

const WEAK=`<p>Absolutely! Here's a polished, scholarship-ready version of your CV that will help you stand out 🚀</p>
<h4>AYESHA RAHMAN</h4>
<p><b>Profile</b><br>Results-driven and passionate Economics scholar with <span class="flag">fluent English</span> and a proven track record of leadership, research and community impact.</p>
<h4>Experience</h4>
<ul><li><span class="flag">Led a team of 20 volunteers</span> at RU Community Education Initiative, transforming the lives of 62 underprivileged children.</li>
<li>Increased student attendance from 68% to 86% through innovative teaching methods.</li>
<li><span class="flag">Published research</span> on the impact of female education on social mobility in Bangladesh.</li></ul>
<h4>Test scores</h4><ul><li><span class="flag">IELTS Academic: 7.0</span></li></ul>
<h4>Skills</h4><ul><li>Advanced data analysis (SPSS, Stata, Excel)</li><li>Strategic leadership · Public speaking · Policy design</li></ul>
<p>This version uses strong action words that scholarship committees love. Good luck — you've got this! 💪</p>`;

const ASKS=`<p>Thanks, Ayesha. I've read your files. Before I draft, I have three questions — I don't want to guess:</p>
<ol><li><b>Graduation:</b> When do you expect to finish your B.S.S.? It isn't in your CV.</li>
<li><b>Term paper:</b> Was your paper on female education published, or was it coursework? I'll call it a <i>term paper</i> unless you tell me otherwise.</li>
<li><b>Contact details:</b> Shall I use [Phone] and [Email] placeholders, so you can add them yourself?</li></ol>`;

const L=(id,t)=>`<span class="ln tap" data-ui="line:${id}">${t}</span>`;
const DRAFT=`<p>Here is a first draft. I used only your files — please check every line.</p>
<h4>AYESHA RAHMAN</h4><p>[Phone] · [Email] · Rajshahi, Bangladesh</p>
<h4>Education</h4><ul><li>B.S.S. (Honours) in Economics, Rajshahi University, 2022–2026 (expected). ${L('l1','CGPA 3.58 / 4.00 (up to second year)')}</li></ul>
<h4>Research and academic work</h4><ul><li>${L('l2','Term paper: “The Impact of Female Education on Social and Economic Mobility in Bangladesh” (2025, coursework)')}</li><li>${L('l3','Student research poster: youth unemployment and skills development, Economics Study Circle forum (2025)')}</li></ul>
<h4>Community experience</h4><ul><li>Volunteer Tutor, RU Community Education Initiative (RUCEI), March 2023–present</li><li>${L('l4','Led the Book Support project, which raised attendance from 68% to 86%')}</li><li>${L('l5','Helped distribute 186 books to 62 students across 48 tutoring sessions (Jan–Apr 2025)')}</li></ul>
<h4>English</h4><ul><li>${L('l6','IELTS Academic mock test (May 2025): overall 6.0 — Listening 6.5, Reading 6.5, Writing 5.5, Speaking 5.5')}</li></ul>
<h4>Skills and memberships</h4><ul><li>${L('l7','Data analysis: Excel, SPSS and Stata (advanced)')}</li><li>${L('l8','Student member, Bangladesh Economic Association (2024–present)')}</li></ul>
<p>Shall I put this into a document?</p>`;

const FIXED=`<p>Thanks for catching these. I've made the changes:</p>
<ul><li><span class="ln"><del>Led the Book Support project, which raised attendance from 68% to 86%</del><br><ins>Volunteer tutor and organising team member, Book Support &amp; Community Tutoring project (Jan–Apr 2025)</ins></span></li>
<li><span class="ln"><del>Excel, SPSS and Stata (advanced)</del> <ins>Excel; basic SPSS and Stata</ins></span></li>
<li><span class="ln"><del>Student member, Bangladesh Economic Association</del> <ins>removed</ins></span></li></ul>
<p>I'm sorry about the membership line — it wasn't in your files. Would you like the full CV as a document?</p>`;

const LINES=[
 {id:'l1',look:[{f:'cv',m:'7.7,29,26,2.7',t:'Her CV — Education'}],text:'CGPA 3.58 / 4.00 (up to second year)',v:'ok',src:'Her old CV',quote:'“CGPA: 3.58/4.00 up to second year, 60 credit hours completed”',why:'Same number, same limit (“up to second year”).',whybn:'একই সংখ্যা, একই সীমা।'},
 {id:'l2',look:[{f:'cv',m:'7.7,59.9,37,2.7',t:'Her CV — Academic projects'}],text:'Term paper … (2025, coursework)',v:'ok',src:'Her old CV',quote:'“Term Paper … Prepared as Development Economics coursework.”',why:'It says term paper and coursework — not “published”. Honest.',whybn:'এটা টার্ম পেপার আর কোর্সওয়ার্ক — “প্রকাশিত” নয়। সৎ।'},
 {id:'l3',look:[{f:'cv',m:'6.3,63.6,32,4.6',t:'Her CV — Academic projects'}],text:'Student research poster … (2025)',v:'ok',src:'Her old CV',quote:'“Student Research Poster: Youth Unemployment and Skills Development in Bangladesh (2025) — Economics Study Circle Student Research Forum”',why:'Matches her CV.',whybn:'তার CV-র সাথে মেলে।'},
 {id:'l4',look:[{f:'rucei',m:'7.5,22.8,48,4.6;9.5,68.2,45,2.8',t:'RUCEI report — her role and the results'},{f:'cv',m:'6.3,41.3,29,2.7',t:'Her CV — Volunteer'}],text:'Led the Book Support project, which raised attendance from 68% to 86%',v:'chg',src:'RUCEI project report',quote:'Role: “Volunteer Tutor &amp; Organizing Team Member”. Attendance 68% → 86% is a result of the whole project.',why:'She was a tutor and team member, not the leader. The attendance result belongs to the whole team.',whybn:'সে টিউটর ও দলের সদস্য ছিল, নেতা নয়। উপস্থিতির ফল পুরো দলের।'},
 {id:'l5',look:[{f:'rucei',m:'8,56,46,11.5',t:'RUCEI report — Key outputs'}],text:'Helped distribute 186 books to 62 students across 48 sessions',v:'ok',src:'RUCEI project report',quote:'Books distributed: 186 · Students enrolled: 62 · Tutoring sessions: 48 (15 Jan – 30 Apr 2025)',why:'The numbers match, and “helped” shows her real role.',whybn:'সংখ্যা মেলে, আর “helped” তার আসল ভূমিকা দেখায়।'},
 {id:'l6',look:[{f:'ielts',m:'5.5,40,87,22',t:'IELTS mock report — scores'}],text:'IELTS mock: overall 6.0 — L 6.5, R 6.5, W 5.5, S 5.5',v:'ok',src:'IELTS mock report',quote:'Listening 6.5 · Reading 6.5 · Writing 5.5 · Speaking 5.5 · Overall 6.0 (test date 24 May 2025)',why:'Exactly the report. It also says “mock” — honest.',whybn:'রিপোর্টের সাথে হুবহু মেলে। “mock” কথাটাও আছে — সৎ।'},
 {id:'l7',look:[{f:'cv',m:'49.2,85.8,17.5,2.7',t:'Her CV — Skills'}],text:'Excel, SPSS and Stata (advanced)',v:'chg',src:'Her old CV',quote:'“Software: MS Word, PowerPoint, Excel, Google Workspace, basic SPSS, basic Stata”',why:'Her CV says basic. “Advanced” changes the meaning — an interviewer could test it.',whybn:'তার CV-তে লেখা basic। “Advanced” অর্থ বদলে দেয় — ইন্টারভিউতে পরীক্ষা করতে পারে।'},
 {id:'l8',look:[{f:'cv',t:'Her CV'},{f:'rucei',t:'RUCEI report'},{f:'ielts',t:'IELTS report'},{f:'shortlist',t:'Shortlist'}],text:'Student member, Bangladesh Economic Association',v:'none',src:'All four files',quote:'No file mentions this association.',why:'The AI invented it. Even a good prompt can’t stop every invention — that’s why you check.',whybn:'AI এটা বানিয়েছে। ভালো প্রম্পটও সব বানানো কথা থামাতে পারে না — তাই যাচাই করতে হয়।'}
];

const FILE_WHY={
 cv:{ok:1,en:'Her old CV — the starting point.',bn:'তার পুরনো CV — শুরুর জায়গা।'},
 ielts:{ok:1,en:'Her real test scores. Now the AI won’t guess them.',bn:'তার আসল স্কোর। এখন AI আর অনুমান করবে না।'},
 rucei:{ok:1,en:'Proof of what she really did as a volunteer.',bn:'স্বেচ্ছাসেবক হিসেবে সে আসলে কী করেছে তার প্রমাণ।'},
 shortlist:{ok:1,en:'Her target programmes — so the CV fits her goal.',bn:'তার লক্ষ্যের প্রোগ্রামগুলো — যাতে CV লক্ষ্যের সাথে মেলে।'},
 checklist:{ok:0,en:'Planning notes. Not needed for the CV.',bn:'পরিকল্পনার নোট। CV-র জন্য দরকার নেই।'},
 bigd:{ok:0,en:'Her old form lists her referees’ emails and phone numbers — other people’s details. Leave it out.',bn:'এই ফর্মে তার রেফারিদের ইমেইল ও ফোন নম্বর আছে — অন্যদের তথ্য। বাদ দাও।'},
 attendance:{ok:-1,en:'Children’s names. This is not Ayesha’s data to share — and a CV doesn’t need it.',bn:'শিশুদের নাম। এটা আয়েশার শেয়ার করার তথ্য নয় — আর CV-র দরকারও নেই।'},
 nid:{ok:-1,en:'Her national ID. A CV never needs it. Never upload ID cards to an AI chat.',bn:'তার জাতীয় পরিচয়পত্র। CV-তে কখনো লাগে না। AI চ্যাটে কখনো NID দিও না।'},
 bank:{ok:-1,en:'Her father’s bank statement. Private, and nothing to do with a CV.',bn:'তার বাবার ব্যাংক স্টেটমেন্ট। ব্যক্তিগত, CV-র সাথে কোনো সম্পর্ক নেই।'}
};
const PICK_FILES=['cv','ielts','rucei','shortlist','checklist','attendance','nid','bank','bigd'];
const chosen=x=>x.get('cvFiles',[]);
const safeFiles=x=>{const c=chosen(x).filter(id=>FILE_WHY[id].ok>=0);return c.length?c:['cv','ielts','rucei','shortlist']};

const PROMPT_CHIPS=[
 {id:'c1',tag:'Context',text:'I am a third-year Economics student at Rajshahi University. I am applying for fully funded master’s programmes in Development Economics.'},
 {id:'c2',tag:'Product',text:'Make a 2-page academic CV from my attached files.'},
 {id:'c3',tag:'Process',text:'Use only facts from my files. Do not add numbers, titles or skills. If something is missing, ask me first.'},
 {id:'c4',tag:'Performance',text:'Be an honest editor. Use simple English I can explain in an interview, and tell me if a line sounds bigger than the truth.'},
 {id:'x1',tag:'Shortcut',x:1,text:'Make me sound as impressive as possible.',warn:'this invites the AI to exaggerate.',warnbn:'এটা AI-কে বাড়িয়ে বলতে উৎসাহ দেয়।'},
 {id:'x2',tag:'Shortcut',x:1,text:'Add skills that scholarship committees like.',warn:'the AI will add skills she doesn’t have.',warnbn:'AI এমন দক্ষতা যোগ করবে যা তার নেই।'}
];
const SLOTS=[
 {label:'Context',frame:'<em>I am a</em> ___. <em>I am applying for</em> ___.',bn:'আমি একজন ___। আমি ___-এর জন্য আবেদন করছি।',test:[/\bi am\b|\bi'm\b|student/i]},
 {label:'Product',frame:'<em>Make a</em> ___ <em>from</em> ___.',bn:'___ থেকে একটা ___ বানাও।',test:[/\bcv\b|resume|résumé/i]},
 {label:'Process',frame:'<em>Use only</em> ___. <em>If</em> ___, <em>ask me first.</em>',bn:'শুধু ___ ব্যবহার করো। যদি ___, আগে আমাকে জিজ্ঞেস করো।',test:[/use only|only (use|facts)|do not add|don'?t add|ask me/i]},
 {label:'Performance',frame:'<em>Be a</em> ___. <em>Tell me if</em> ___.',bn:'একজন ___ হও। ___ হলে আমাকে বলো।',test:[/honest|editor|tell me|warn me|flag/i]}
];
const promptText=x=>x.get('cvPrompt','')||PROMPT_CHIPS.slice(0,4).map(c=>c.text).join(' ');
const ANS_CHIPS=[
 {id:'a1',tag:'Answer 1',text:'I expect to graduate in 2026.'},
 {id:'a2',tag:'Answer 2',text:'The term paper was coursework. It was not published.'},
 {id:'a3',tag:'Answer 3',text:'Yes, use placeholders. I will add my phone and email myself.'},
 {id:'ax',tag:'Shortcut',x:1,text:'Say the paper was published — it sounds better.',warn:'that is a false claim. Committees check.',warnbn:'এটা মিথ্যা দাবি। কমিটি যাচাই করে।'}
];
const ansText=x=>x.get('cvAns','')||ANS_CHIPS.slice(0,3).map(c=>c.text).join(' ');
const FIX_CHIPS=[
 {id:'f1',tag:'Fix line 4',text:'In the Book Support line: I was a volunteer tutor and team member. I did not lead the project, so don’t give me credit for the attendance result.'},
 {id:'f2',tag:'Fix line 7',text:'My SPSS and Stata are basic, not advanced.'},
 {id:'f3',tag:'Fix line 8',text:'Remove the Bangladesh Economic Association line. I am not a member.'},
 {id:'fx',tag:'Shortcut',x:1,text:'Leave it — nobody will check.',warn:'interviewers and referees do check — and she signs the CV as true.',warnbn:'ইন্টারভিউয়ার আর রেফারিরা যাচাই করেন — আর সে CV-কে সত্য বলে সই করে।'}
];
const fixText=x=>x.get('cvFix','')||FIX_CHIPS.slice(0,3).map(c=>c.text).join(' ');

const chat=(x,upto)=>{
  const m=[];
  m.push({role:'u',text:promptText(x),atts:safeFiles(x)});
  if(upto>=1) m.push({role:'a',html:ASKS,id:'asks',stream:upto===1});
  if(upto>=2) m.push({role:'u',text:ansText(x)});
  if(upto>=3) m.push({role:'a',html:DRAFT,id:'draft',stream:upto===3});
  if(upto>=4) m.push({role:'u',text:fixText(x)});
  if(upto>=5) m.push({role:'a',html:FIXED,id:'fixed',stream:upto===5,moreHit:'export'});
  return m;
};

const fillCV=x=>{const f=x.get('cvFill',{});
  const ph=(k,v,lab)=>f[k]?`<span class="ph-chip filled">${v}</span>`:`<span class="ph-chip" data-ui="fill:${k}">${lab}</span>`;
  return `<div class="page"><h2>AYESHA RAHMAN</h2><div class="ct">${ph('phone','+880 17XX-XXX 412','[Phone]')} · ${ph('email','ayesha.rahman@example.com','[Email]')} · Rajshahi, Bangladesh</div>
  <h5>Profile</h5><p>Third-year Economics student at Rajshahi University, interested in development economics, education policy and evidence-based community work. Applying for fully funded master’s programmes in Development Economics.</p>
  <h5>Education</h5><p><b>B.S.S. (Honours) in Economics</b>, Rajshahi University, 2022–2026 (expected)<br>CGPA 3.58 / 4.00 (up to second year) · Development Economics, Econometrics (basic), Statistics</p>
  <h5>Research and academic work</h5><ul><li>Term paper: “The Impact of Female Education on Social and Economic Mobility in Bangladesh” (2025, coursework)</li><li>Student research poster: youth unemployment and skills development, Economics Study Circle forum (2025)</li><li>Co-organised and spoke at the seminar “Inclusive Growth and Public Policy in Bangladesh” (2025)</li></ul>
  <h5>Community experience</h5><ul><li><b>Volunteer Tutor</b>, RU Community Education Initiative, March 2023–present — English and Mathematics for school students</li><li>Volunteer tutor and organising team member, Book Support &amp; Community Tutoring project (Jan–Apr 2025): helped distribute 186 books to 62 students across 48 tutoring sessions</li></ul>
  <h5>Training and English</h5><ul><li>Introduction to Data Analysis for Social Research, 12 hours, Rajshahi University (May 2025)</li><li>IELTS Academic mock test (May 2025): overall 6.0 — L 6.5, R 6.5, W 5.5, S 5.5</li></ul>
  <h5>Skills</h5><p>Excel; basic SPSS and Stata; literature review; report writing · Bangla (native), English (intermediate)</p></div>`;
};

const CHAT_SC=(x,upto,extra)=>Object.assign({app:'sathi',msgs:chat(x,upto),composer:{text:''}},extra||{});

const MAIL_NOTIF={app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'n:mail'};
const say=(mode)=>AFL.byMode(mode);

AFL.lesson({
 id:'cv', title:'An honest CV with AI', kicker:'Workflow 1 · Writing', emoji:'📄', tint:'#D7E3FF', time:'40–45 min',
 blurb:'Turn real documents into a CV — then catch what the AI made up.',
 blurbbn:'আসল কাগজপত্র থেকে CV বানাও — তারপর AI যা বানিয়ে লিখেছে তা ধরো।',
 notif:{app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'start:cv'},
 stages:[{id:'warm',label:'Warm up',icon:'🎧'},{id:'plan',label:'Plan',d:'del'},{id:'prompt',label:'Prompt',d:'des'},{id:'check',label:'Check',d:'dis'},{id:'fix',label:'Fix',d:'des'},{id:'finish',label:'Finish',d:'dil'}],
 beats:[
  /* ---------- WARM UP: projector first. Pictures, sound, then talk. ---------- */
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'Listen and repeat. Tap a picture to hear it.',bn:'শোনো আর বলো। শুনতে একটা ছবিতে চাপো।',
   card:{type:'words',items:[
     {e:'📄',w:'CV',ex:'Ayesha needs a CV.',bn:'জীবনবৃত্তান্ত'},
     {e:'📋✅',w:'shortlisted',ex:'She was not shortlisted.',bn:'বাছাই তালিকায় নাম ওঠা'},
     {e:'💬',w:'prompt',ex:'A prompt tells the AI what to do.',bn:'AI-কে দেওয়া নির্দেশ'},
     {e:'🤝',w:'honest',ex:'Every line must be honest.',bn:'সৎ'},
     {e:'🪄',w:'made up',ex:'The AI made up a fact.',bn:'বানানো'},
     {e:'📎',w:'proof',ex:'Her report is the proof.',bn:'প্রমাণ'},
     {e:'🔒',w:'private',ex:'Her ID card is private.',bn:'ব্যক্তিগত'},
     {e:'✏️',w:'fix',ex:'Tell the AI what to fix.',bn:'ঠিক করা'}]}},
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'Listen to Ayesha’s story.',bn:'আয়েশার গল্প শোনো।',
   card:{type:'story',panels:[
     {e:'🎓🇧🇩',en:'Ayesha studies Economics in Rajshahi. She wants a master’s.',bn:'আয়েশা রাজশাহীতে অর্থনীতি পড়ে। সে মাস্টার্স করতে চায়।'},
     {e:'📧😞',en:'She applied for an internship. She was not shortlisted.',bn:'সে একটা ইন্টার্নশিপে আবেদন করেছিল। শর্টলিস্টে নাম আসেনি।'},
     {e:'🤖📄❓',en:'Can AI help her write a better CV — an honest one?',bn:'AI কি তাকে আরও ভালো — আর সৎ — একটা CV লিখতে সাহায্য করতে পারে?'}]}},
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'Today Ayesha turns four gears. Each gear has its own English. Listen and repeat.',bn:'আজ আয়েশা চারটা গিয়ার ঘোরাবে। প্রতিটা গিয়ারের নিজের ইংরেজি আছে। শোনো আর বলো।',
   card:{type:'phrases',items:{
     del:{en:'I will check the facts. The AI can do the layout.',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'},
     des:{en:'Use only my files. If something is missing, ask me.',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'},
     dis:{en:'That’s not true. My report says I was a tutor.',bn:'এটা সত্য নয়। আমার রিপোর্টে লেখা আমি টিউটর ছিলাম।'},
     dil:{en:'I won’t share my ID card. It’s private.',bn:'আমি আমার NID শেয়ার করব না। এটা ব্যক্তিগত।'}}}},
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'Before we start: what do you think?',bn:'শুরুর আগে: তোমার কী মনে হয়?',
   talk:{big:true,pic:'🤖📄',q:'Should students use AI to write a CV?',qbn:'শিক্ষার্থীদের কি CV লিখতে AI ব্যবহার করা উচিত?',time:60,
     frames:[{en:'Yes, because AI can ___.',bn:'হ্যাঁ, কারণ AI ___ পারে।'},{en:'No, because AI might ___.',bn:'না, কারণ AI হয়তো ___।'},{en:'Yes, but you must ___.',bn:'হ্যাঁ, তবে তোমাকে ___ করতেই হবে।'}],
     model:'Yes, but you must check every line. AI might make things up.'}},

  /* ---------- PLAN ---------- */
  {d:'none',stage:'plan',scene:{app:'lock',notifs:[MAIL_NOTIF]},tap:'n:mail',
   say:'Now the phone. Ayesha has a new email. Tap it.',bn:'এবার ফোন। আয়েশার একটা নতুন ইমেইল এসেছে। ওটাতে চাপো।'},
  {d:'dil',why:'An honest CV is Ayesha’s responsibility before any AI is involved. Big claims fall apart in an interview.',whybn:'কোনো AI আসার আগেই সৎ CV আয়েশার দায়িত্ব। বড় দাবি ইন্টারভিউতে টেকে না।',
   frame:{en:'Every line on my CV must be true.',bn:'আমার CV-র প্রতিটি লাইন সত্য হতে হবে।'},
   stage:'plan',scene:{app:'mail',view:'read',mail:{from:'Internship Desk',color:'#00639B',subject:'Research Intern — application update',time:'9:12 AM',
     body:`<p>Dear Ayesha,</p><p>Thank you for applying for the Research Assistant Intern position. We received many strong applications, and we are not able to shortlist you this time.</p><p>Most shortlisted applicants sent a short <b>academic CV</b> that showed their research skills clearly. We encourage you to apply again.</p><p>Best wishes,<br>Internship Desk</p>`}},
   say:'Not shortlisted. What should she do next time?',bn:'শর্টলিস্টে নাম নেই। পরের বার সে কী করবে?',
   card:{type:'choice',key:'cvWhy',options:[
     {en:'📄✅ Send a clear CV with her real skills.',bn:'নিজের আসল দক্ষতা দিয়ে একটা পরিষ্কার CV পাঠানো।',ok:1,why:'Yes. The email asks for a clear academic CV.',whybn:'হ্যাঁ। ইমেইলে একটা পরিষ্কার একাডেমিক CV চাওয়া হয়েছে।'},
     {en:'📢 Make bigger claims.',bn:'বড় বড় দাবি লেখা।',ok:0,why:'Big claims fall apart in an interview.',whybn:'বড় দাবি ইন্টারভিউতে টেকে না।'},
     {en:'🛑 Stop applying.',bn:'আবেদন বন্ধ করা।',ok:0,why:'The email says: apply again.',whybn:'ইমেইলে বলা আছে: আবার আবেদন করো।'}]}},
  {why:'Before she opens the AI, Ayesha decides which jobs are hers and which are the AI’s. Her facts and the final check stay with her.',whybn:'AI খোলার আগে আয়েশা ঠিক করে কোন কাজ তার, কোনটা AI-এর। তথ্য আর শেষ যাচাই তার হাতেই থাকে।',
   frame:{en:'I will check the facts. The AI can do the layout.',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'},
   stage:'plan',open:true,scene:{app:'home'},
   say:'Plan first. Who should do each job?',bn:'আগে পরিকল্পনা। কোন কাজ কে করবে?',
   card:{type:'sort',key:'cvJobs',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'},{id:'both',label:'Both'}],items:[
     {en:'🔎 Collect her true facts',bn:'তার সত্যি তথ্য জোগাড় করা',ans:'me',why:'Only Ayesha knows her real life.',whybn:'তার আসল জীবন শুধু আয়েশাই জানে।',hint:'Can the AI know her real scores?',hintbn:'AI কি তার আসল স্কোর জানে?'},
     {en:'🗂 Suggest a clean layout',bn:'পরিষ্কার লেআউট প্রস্তাব করা',ans:'ai',why:'A good AI job: low risk, no private facts.',whybn:'AI-এর জন্য ভালো কাজ: ঝুঁকি কম, ব্যক্তিগত তথ্য লাগে না।',hint:'Is a layout risky?',hintbn:'লেআউটে কি ঝুঁকি আছে?'},
     {en:'🎯 Choose what matters most',bn:'কোনটা সবচেয়ে জরুরি তা বাছা',ans:'both',why:'The AI suggests. Ayesha decides.',whybn:'AI প্রস্তাব দেয়। সিদ্ধান্ত আয়েশার।',hint:'Who knows her goal?',hintbn:'তার লক্ষ্য কে জানে?'},
     {en:'✅ Check every line is true',bn:'প্রতিটি লাইন সত্য কি না যাচাই করা',ans:'me',why:'Her name is on the CV.',whybn:'CV-তে তার নাম থাকে।',hint:'Whose name is on the CV?',hintbn:'CV-তে কার নাম থাকে?'}]},
   talk:{q:'Who does each job? Say it.',qbn:'কোন কাজ কে করবে? বলো।',time:45,
     frames:[{en:'Ayesha should ___.',bn:'আয়েশার উচিত ___।'},{en:'The AI can ___.',bn:'AI ___ পারে।'},{en:'They both ___.',bn:'দুজনে মিলে ___।'}],
     model:'Ayesha should collect her true facts. The AI can suggest a layout. They both choose what matters most.'}},

  /* ---------- PROMPT ---------- */
  {why:'Now the plan becomes words. What she types decides what comes back. First, watch what a short prompt does.',whybn:'এবার পরিকল্পনা কথায় রূপ নেয়। সে যা লেখে, তা-ই ঠিক করে কী ফিরে আসবে। আগে দেখো ছোট প্রম্পট কী করে।',
   frame:{en:'Please make my CV better.',bn:'দয়া করে আমার CV আরও ভালো করো।'},
   stage:'prompt',scene:{app:'home'},tap:'app:sathi',
   say:'Open the AI app. Tap Sathi.',bn:'AI অ্যাপটা খোলো। Sathi-তে চাপো।',sub:'Sathi is like Gemini, ChatGPT or Claude.',subbn:'Sathi হলো Gemini, ChatGPT বা Claude-এর মতো।'},
  {stage:'prompt',scene:{app:'sathi',msgs:[],composer:{text:ASK_FIRST,atts:['cv']}},tap:'send',
   say:'Many students type a short prompt, like this. Tap send.',bn:'অনেক শিক্ষার্থী এভাবে ছোট প্রম্পট লেখে। send চাপো।',
   talk:{q:'What will Sathi write? Guess first.',qbn:'Sathi কী লিখবে? আগে অনুমান করো।',frames:[{en:'I think it will ___.',bn:'আমার মনে হয় এটা ___।'}]}},
  {d:'dis',why:'The reply looks finished. Judge it against her real documents before believing a word.',whybn:'উত্তরটা দেখতে সম্পূর্ণ। একটা শব্দও বিশ্বাস করার আগে তার আসল কাগজপত্রের সাথে মিলিয়ে বিচার করো।',
   frame:{en:'That’s not true. Her report says ___.',bn:'এটা সত্য নয়। তার রিপোর্টে লেখা ___।'},
   stage:'prompt',scene:{app:'sathi',msgs:[{role:'u',text:ASK_FIRST,atts:['cv']},{role:'a',html:WEAK,stream:true,id:'weak'}],composer:{text:''}},
   afterRender:(x,scr)=>{ if(!document.querySelector('[data-stream]')) scr.querySelectorAll('.flag').forEach(f=>f.classList.add('ln','v-bad')); },
   docs:['cv','ielts','rucei'],
   say:x=>document.querySelector('[data-stream]')?'Sathi is answering…':'It looks impressive. But is it true?',bn:'দেখতে চমৎকার। কিন্তু এটা কি সত্য?',
   card:x=>({type:'html',html:`<div class="card"><table class="vs"><tr><th>🤖 AI wrote</th><th>📎 Her papers</th></tr>${[['IELTS 7.0','IELTS mock <b>6.0</b>'],['Led 20 volunteers','A <b>volunteer tutor</b>'],['Fluent English','English: <b>intermediate</b>'],['Published research','A <b>term paper</b>']].map(r=>`<tr><td>✗ ${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`}),
   talk:{q:'Find one thing that is not true.',qbn:'একটা অসত্য কথা খুঁজে বের করো।',time:45,
     frames:[{en:'It says ___, but her report says ___.',bn:'এখানে লেখা ___, কিন্তু তার রিপোর্টে লেখা ___।'}],
     model:'It says IELTS 7.0, but her report says 6.0.'}},
  {why:'The made-up lines point straight at what the prompt was missing.',whybn:'বানানো লাইনগুলোই দেখিয়ে দেয় প্রম্পটে কী বাদ ছিল।',
   stage:'prompt',open:true,scene:x=>({app:'sathi',msgs:[{role:'u',text:ASK_FIRST,atts:['cv']},{role:'a',html:WEAK}],composer:{text:''}}),
   say:'The short prompt left out four things.',bn:'ছোট প্রম্পটে চারটা জিনিস বাদ পড়েছে।',
   card:{type:'html',html:`<div class="card"><p class="mono">“make my cv better for scholarship”</p><div class="four">
     <span><i>👤</i><b>Context</b><small>Who is she?</small><em>missing</em></span>
     <span><i>📄</i><b>Product</b><small>What to make?</small><em>only “better”</em></span>
     <span><i>🛠</i><b>Process</b><small>How to work?</small><em>missing</em></span>
     <span><i>🧑‍🏫</i><b>Performance</b><small>How to act?</small><em>missing</em></span></div>
     <span class="bn" lang="bn">প্রেক্ষাপট (সে কে?) · পণ্য (কী বানাবে?) · প্রক্রিয়া (কীভাবে কাজ করবে?) · আচরণ (কেমন আচরণ করবে?)</span></div>`}},
  {why:'Before attaching anything: does a CV need this file, and is it hers to share?',whybn:'কিছু যোগ করার আগে: CV-তে কি এই ফাইল লাগে, আর এটা কি তার শেয়ার করার জিনিস?',
   frame:{en:'I won’t share ___. It’s private.',bn:'আমি ___ শেয়ার করব না। এটা ব্যক্তিগত।'},
   stage:'prompt',d:'dil',scene:{app:'sathi',msgs:[],composer:{text:'',attHit:'att',placeholder:'Ask Sathi'}},tap:'att',
   say:'New chat. First, give Sathi the right files. Tap +',bn:'নতুন চ্যাট। আগে Sathi-কে সঠিক ফাইল দাও। + চাপো।'},
  {stage:'prompt',d:'dil',scene:{app:'picker',files:PICK_FILES,sel:'cvFiles',attachHit:'attach'},tap:'attach',pickShow:['cv','ielts','rucei','shortlist'],
   say:'Choose only the files a CV needs.',bn:'শুধু CV-র জন্য দরকারি ফাইলগুলো বাছো।',
   sub:'Does the CV need it? Is it mine to share?',subbn:'CV-র কি এটা লাগবে? এটা কি আমার শেয়ার করার জিনিস?',
   card:x=>{const c=chosen(x);if(!c.length) return {type:'html',html:`<div class="note">Tap a file. Tap again to remove it. Then tap <b>Attach</b>.<span class="bn" lang="bn">ফাইল বাছতে চাপো, বাদ দিতে আবার চাপো। তারপর Attach চাপো।</span></div>`};
     return {type:'html',html:`<div class="card" style="padding:10px">${c.map(id=>{const w=FILE_WHY[id];return `<div class="${w.ok>0?'good':w.ok===0?'note':'warn'}" style="margin-top:6px"><b>${esc(AFL.FILES[id].name)}</b> — ${w.en}<span class="bn" lang="bn">${w.bn}</span></div>`}).join('')}</div>`}}},
  {stage:'prompt',d:'dil',scene:x=>({app:'sathi',msgs:[],composer:{text:'',atts:safeFiles(x)}}),
   say:x=>chosen(x).some(id=>FILE_WHY[id].ok<0)?'Ayesha took out the private files.':'Good choice of files.',bn:x=>chosen(x).some(id=>FILE_WHY[id].ok<0)?'আয়েশা ব্যক্তিগত ফাইলগুলো সরিয়ে দিয়েছে।':'ফাইল বাছাই ভালো হয়েছে।',
   card:x=>{const bad=chosen(x).filter(id=>FILE_WHY[id].ok<0);const miss=['ielts','rucei'].filter(id=>!chosen(x).includes(id));
     return {type:'info',points:[...bad.map(id=>({i:'🚫',en:`<b>${esc(AFL.FILES[id].name)}</b> — removed.`,bn:FILE_WHY[id].bn})),
      ...(miss.length?[{i:'➕',en:'The IELTS and RUCEI reports give the AI <b>real facts</b>.',bn:'IELTS আর RUCEI রিপোর্ট AI-কে আসল তথ্য দেয়।'}]:[]),
      {i:'🔐',en:'Share only what the job needs.',bn:'শুধু কাজের জন্য যা দরকার, তা-ই দাও।'}]}},
   talk:{q:'Which files did Ayesha leave out? Why?',qbn:'আয়েশা কোন ফাইলগুলো বাদ দিল? কেন?',time:45,
     frames:[{en:'She left out ___ because it’s private.',bn:'সে ___ বাদ দিয়েছে, কারণ এটা ব্যক্তিগত।'},{en:'A CV doesn’t need ___.',bn:'CV-তে ___ লাগে না।'}],
     model:'She left out her ID card because it’s private. A CV doesn’t need her father’s bank statement.'}},
  {why:'Files chosen. Now she says exactly what she wants: Context, Product, Process, Performance.',whybn:'ফাইল বাছাই শেষ। এবার সে ঠিক কী চায় তা বলে: প্রেক্ষাপট, পণ্য, প্রক্রিয়া, আচরণ।',
   frame:{en:'Use only my files. If something is missing, ask me.',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'},
   stage:'prompt',scene:x=>({app:'sathi',msgs:[],composer:{key:'cvPrompt',atts:safeFiles(x),placeholder:'Ask Sathi'},kb:{key:'cvPrompt',label:'PROMPT PARTS',chips:PROMPT_CHIPS}}),tap:'send',
   say:'Now build a better prompt. Tap the parts above the keyboard.',bn:'এবার একটা ভালো প্রম্পট বানাও। কিবোর্ডের উপরের অংশগুলো চাপো।',
   sub:()=>say({solo:'Say each part out loud before you tap it.',pair:'Say each part to your partner before you tap it.',class:'Say each part together before you tap it.'}),
   subbn:()=>say({solo:'চাপার আগে প্রতিটা অংশ জোরে বলো।',pair:'চাপার আগে প্রতিটা অংশ সঙ্গীকে বলো।',class:'চাপার আগে প্রতিটা অংশ সবাই মিলে বলো।'}),
   compose:{key:'cvPrompt',title:'Prompt recipe',titlebn:'প্রম্পটের রেসিপি',slots:SLOTS,chips:PROMPT_CHIPS,best:['c1','c2','c3','c4'],ready:'All four parts are there. Tap send ➤ on the phone.',readybn:'চারটা অংশই আছে। ফোনে send ➤ চাপো।'}},
  {stage:'prompt',scene:x=>CHAT_SC(x,1),
   say:'This time Sathi asks first — because your prompt told it to.',bn:'এবার Sathi আগে প্রশ্ন করছে — কারণ তোমার প্রম্পট তাকে বলেছে।',
   card:{type:'html',html:`<div class="good">✓ Ask before guessing. Your <b>Process</b> part did this.<span class="bn" lang="bn">অনুমানের আগে প্রশ্ন। তোমার Process অংশ এটা করেছে।</span></div>
     <div class="looks" style="margin-top:6px"><button class="look" data-view="bigd" data-mark="74,36.2,20,5">📄 Graduation year</button><button class="look" data-view="cv" data-mark="7.7,59.9,37,2.7">📄 Term paper</button></div>`}},
  {stage:'prompt',scene:x=>Object.assign(CHAT_SC(x,1),{composer:{key:'cvAns',placeholder:'Reply to Sathi'},kb:{key:'cvAns',label:'ANSWERS',chips:ANS_CHIPS}}),tap:'send',
   docs:['bigd','cv'],
   say:'Answer Sathi’s three questions — truthfully.',bn:'Sathi-এর তিনটা প্রশ্নের উত্তর দাও — সত্যি করে।',
   compose:{key:'cvAns',title:'Answer all three',titlebn:'তিনটারই উত্তর দাও',chips:ANS_CHIPS,best:['a1','a2','a3'],slots:[
     {label:'1 · Graduation',frame:'<em>I expect to graduate in</em> ___.',bn:'আমি ___ সালে স্নাতক শেষ করব বলে আশা করছি।',test:[/20\d\d|graduat/i]},
     {label:'2 · Term paper',frame:'<em>It was</em> ___<em>. It was not</em> ___.',bn:'এটা ছিল ___। এটা ___ ছিল না।',test:[/coursework|not published/i]},
     {label:'3 · Contact details',frame:'<em>I will add</em> ___ <em>myself.</em>',bn:'আমি নিজে ___ যোগ করব।',test:[/placeholder|myself/i]}]}},

  /* ---------- CHECK ---------- */
  {stage:'check',why:'Even a good prompt doesn’t stop every mistake. Only her documents can prove each line.',whybn:'ভালো প্রম্পটও সব ভুল থামাতে পারে না। প্রতিটি লাইন প্রমাণ করতে পারে শুধু তার কাগজপত্র।',
   frame:{en:'Is this true? Let me check.',bn:'এটা কি সত্য? দেখি যাচাই করে।'},
   scene:x=>CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}),
   say:x=>document.querySelector('[data-stream]')?'Sathi is writing the draft…':'A draft! It looks good. Now check it.',bn:'একটা খসড়া! দেখতে ভালো। এবার যাচাই করো।',docs:['cv','ielts','rucei','shortlist'],
   talk:{q:'Is it all true this time? Guess.',qbn:'এবার কি সব সত্য? অনুমান করো।',frames:[{en:'I think ___ lines are wrong.',bn:'আমার মনে হয় ___টা লাইন ভুল।'},{en:'I think it’s all true.',bn:'আমার মনে হয় সব সত্য।'}]}},
  {stage:'check',scene:x=>{const v=x.get('cvVerd',{}),sel=x.get('cvVerd_sel');return Object.assign(CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}),{_v:v,_s:sel})},
   afterRender:(x,scr)=>{const v=x.get('cvVerd',{}),sel=x.get('cvVerd_sel');scr.querySelectorAll('.ln[data-ui]').forEach(el=>{const id=el.dataset.ui.slice(5);const l=LINES.find(z=>z.id===id);if(v[id])el.classList.add(l.v==='ok'?'v-ok':'v-bad');if(sel===id)el.classList.add('sel')});const s=scr.querySelector('.ln.sel');if(s)s.scrollIntoView({block:'center'})},
   say:'Check each line against her files.',bn:'প্রতিটি লাইন তার ফাইলের সাথে মিলিয়ে দেখো।',
   sub:'Tap a line → open the file → decide.',subbn:'একটা লাইনে চাপো → ফাইল খোলো → সিদ্ধান্ত নাও।',docs:['cv','ielts','rucei','shortlist'],
   check:{key:'cvVerd',lines:LINES,prompt:'Tap an underlined line in Sathi’s answer.',promptbn:'Sathi-এর উত্তরে দাগ দেওয়া একটা লাইনে চাপো।',done:'All 8 checked. Lines 4, 7 and 8 need fixing.',donebn:'৮টাই যাচাই হয়েছে। ৪, ৭ আর ৮ নম্বর লাইন ঠিক করতে হবে।'}},
  {stage:'check',open:true,scene:x=>{const v=x.get('cvVerd',{});return Object.assign(CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}))},
   afterRender:(x,scr)=>{const v=x.get('cvVerd',{});scr.querySelectorAll('.ln[data-ui]').forEach(el=>{const id=el.dataset.ui.slice(5);const l=LINES.find(z=>z.id===id);el.classList.add(l.v==='ok'?'v-ok':'v-bad')})},
   say:'What did you find?',bn:'তুমি কী পেলে?',
   talk:{q:'Which line was wrong? How do you know?',qbn:'কোন লাইনটা ভুল ছিল? কীভাবে জানলে?',time:60,
     frames:[{en:'Line ___ says ___.',bn:'___ নম্বর লাইনে লেখা ___।'},{en:'That’s not true. Her ___ says ___.',bn:'এটা সত্য নয়। তার ___-এ লেখা ___।'}],
     model:'Line 4 says she led the project. That’s not true. Her RUCEI report says she was a tutor and a team member.'}},

  /* ---------- FIX ---------- */
  {why:'Every mistake she found becomes a precise instruction.',whybn:'যে ভুলগুলো পেয়েছে, প্রতিটি একটা স্পষ্ট নির্দেশ হয়ে যায়।',
   frame:{en:'Please change ___. I was not ___.',bn:'দয়া করে ___ বদলাও। আমি ___ ছিলাম না।'},
   stage:'fix',scene:x=>Object.assign(CHAT_SC(x,3),{composer:{key:'cvFix',placeholder:'Reply to Sathi'},kb:{key:'cvFix',label:'FIXES',chips:FIX_CHIPS}}),tap:'send',
   docs:['cv','ielts','rucei','shortlist'],
   say:'Tell Sathi exactly what to fix.',bn:'Sathi-কে ঠিক কী ঠিক করতে হবে, স্পষ্ট করে বলো।',
   compose:{key:'cvFix',title:'Fix three lines',titlebn:'তিনটা লাইন ঠিক করো',chips:FIX_CHIPS,best:['f1','f2','f3'],ready:'Clear and exact. Send it.',readybn:'স্পষ্ট আর সুনির্দিষ্ট। পাঠাও।',slots:[
     {label:'Line 4 · her role',frame:'<em>I was a</em> ___. <em>I did not</em> ___.',bn:'আমি ছিলাম ___। আমি ___ করিনি।',test:[/did not lead|didn'?t lead|not the leader|team member/i]},
     {label:'Line 7 · software',frame:'<em>My</em> ___ <em>is basic, not advanced.</em>',bn:'আমার ___ বেসিক, অ্যাডভান্সড নয়।',test:[/basic/i]},
     {label:'Line 8 · membership',frame:'<em>Remove the</em> ___ <em>line. I am not</em> ___.',bn:'___ লাইনটা মুছে দাও। আমি ___ নই।',test:[/remove|not a member/i]}]}},
  {stage:'fix',scene:x=>CHAT_SC(x,5,{scrollTo:'[data-mid="fixed"]'}),
   say:'Fixed. And Sathi said sorry for the made-up line.',bn:'ঠিক হয়েছে। আর বানানো লাইনের জন্য Sathi দুঃখ প্রকাশ করেছে।',
   card:{type:'html',html:`<div class="loopline"><span>💬 prompt</span>→<span>🔍 check</span>→<span>✏️ fix</span>→<span>🔍 check again</span></div><span class="bn" lang="bn">প্রম্পট → যাচাই → সংশোধন → আবার যাচাই</span>`}},

  /* ---------- FINISH ---------- */
  {why:'The CV goes out with her name on it. The last steps — her contact details and the honesty checks — are hers, not the AI’s.',whybn:'CV যাবে তার নামে। শেষ ধাপগুলো — যোগাযোগের তথ্য আর সততার যাচাই — তার, AI-এর নয়।',
   frame:{en:'I’m responsible for my CV.',bn:'আমার CV-র দায়িত্ব আমার।'},
   stage:'finish',scene:x=>CHAT_SC(x,5),tap:'export',
   say:'Put the CV into a document. Tap ⋮ under the answer.',bn:'CV-টা ডকুমেন্টে নাও। উত্তরের নিচে ⋮ চাপো।'},
  {stage:'finish',scene:x=>Object.assign(CHAT_SC(x,5),{sheet:{html:`<h3>Share &amp; export</h3><button class="li" data-hit="todocs"><span class="av" style="background:#1A4CA8">${AFL.ico('doc')}</span><span><b>Export to Docs</b><p>Make an editable document</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('copy')}</span><span><b>Copy</b><p>Copy the text</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('share')}</span><span><b>Share link</b><p>Anyone with the link can see this chat</p></span></button>`}}),tap:'todocs',
   say:'Choose “Export to Docs”.',bn:'“Export to Docs” বেছে নাও।'},
  {stage:'finish',d:'dil',scene:x=>({app:'gdoc',page:fillCV(x)}),
   showMe:(x,h)=>{const f=x.get('cvFill',{});f.phone=1;f.email=1;x.set('cvFill',f);h.render()},
   onUi:(x,kind,arg)=>{if(kind==='fill'){const f=x.get('cvFill',{});f[arg]=1;x.set('cvFill',f);AFL.renderPhone();AFL.renderCoach();}},
   say:'Add her phone and email yourself. Tap the yellow boxes.',bn:'ফোন নম্বর আর ইমেইল তুমি নিজে যোগ করো। হলুদ বাক্সগুলোতে চাপো।',
   card:x=>{const f=x.get('cvFill',{});return {type:'html',html:f.phone&&f.email?`<div class="good">🔒 Done. Her phone and email never went into the AI chat.<span class="bn" lang="bn">হয়ে গেছে। তার ফোন আর ইমেইল কখনো AI চ্যাটে যায়নি।</span></div>`:`<div class="note">🔒 Private details: you add them, at the end.<span class="bn" lang="bn">ব্যক্তিগত তথ্য: তুমি নিজে, শেষে বসাবে।</span></div>`}}},
  {stage:'finish',open:true,d:'dil',scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Before she sends it: four checks.',bn:'পাঠানোর আগে: চারটা যাচাই।',sub:'Tap each one when it’s true.',subbn:'সত্যি হলে প্রতিটিতে চাপো।',
   card:{type:'checklist',key:'cvDil',items:[
     {en:'✅ Every line is true.',bn:'প্রতিটি লাইন সত্য।'},
     {en:'🗣 I can explain every line in an interview.',bn:'ইন্টারভিউতে প্রতিটি লাইন ব্যাখ্যা করতে পারব।'},
     {en:'🔒 I added my private details myself.',bn:'ব্যক্তিগত তথ্য আমি নিজে যোগ করেছি।'},
     {en:'📜 I know the programme’s rules on AI.',bn:'প্রোগ্রামের AI-সংক্রান্ত নিয়ম জানি।'}]}},
  {stage:'finish',open:true,scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Practise for the interview.',bn:'ইন্টারভিউয়ের অনুশীলন করো।',
   talk:()=>({time:90,pic:'💼',
     q:AFL.mode()==='solo'?'The interviewer asks: “Did you use AI for your CV?” Answer.':'The interviewer asks: “Did you use AI for your CV?”',
     qbn:'ইন্টারভিউয়ার জিজ্ঞেস করেন: “তুমি কি CV-র জন্য AI ব্যবহার করেছ?”',
     roles:[{en:'Interviewer: ask the question. Then ask “Why?”',bn:'ইন্টারভিউয়ার: প্রশ্নটা করো। তারপর জিজ্ঞেস করো “কেন?”'},{en:'Ayesha: answer with the phrases.',bn:'আয়েশা: নিচের বাক্যগুলো দিয়ে উত্তর দাও।'}],
     frames:[{en:'I used AI to organise my CV, but I checked every line myself.',bn:'আমি CV সাজাতে AI ব্যবহার করেছি, কিন্তু প্রতিটি লাইন নিজে যাচাই করেছি।'},
       {en:'The AI wrote that I led the project. That wasn’t true, so I changed it.',bn:'AI লিখেছিল আমি প্রকল্পের নেতা ছিলাম। এটা সত্য ছিল না, তাই বদলেছি।'},
       {en:'I didn’t share my ID card, because a CV doesn’t need it.',bn:'আমি NID শেয়ার করিনি, কারণ CV-তে এর দরকার নেই।'}]})},
  {stage:'finish',open:true,scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Now you. What is one true line for YOUR CV?',bn:'এবার তুমি। তোমার নিজের CV-র জন্য একটা সত্যি লাইন কী?',
   talk:{big:true,pic:'📝',q:'Tell one true thing for your own CV.',qbn:'তোমার নিজের CV-র জন্য একটা সত্যি কথা বলো।',time:90,
     frames:[{en:'I am a ___ student at ___.',bn:'আমি ___-এর ___ বর্ষের শিক্ষার্থী।'},{en:'I helped ___.',bn:'আমি ___ করতে সাহায্য করেছি।'},{en:'I can use ___ (basic).',bn:'আমি ___ ব্যবহার করতে পারি (বেসিক)।'}],
     model:'I am a second-year English student at Rajshahi University. I helped organise a book fair. I can use Excel, at a basic level.'}},
  {stage:'finish',open:true,scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Done! You used all four Ds — in English.',bn:'শেষ! তুমি চারটা D-ই ব্যবহার করেছ — ইংরেজিতে।',
   card:x=>({type:'html',html:AFL.recap(x,{
     del:{en:'“I will check the facts. The AI can do the layout.”',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'},
     des:{en:'“Use only my files. If something is missing, ask me.”',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'},
     dis:{en:'“That’s not true. Her report says she was a tutor.”',bn:'এটা সত্য নয়। তার রিপোর্টে লেখা সে টিউটর ছিল।'},
     dil:{en:'“I won’t share my ID card. It’s private.”',bn:'আমি NID শেয়ার করব না। এটা ব্যক্তিগত।'}})+`
     <div class="pick-cards"><button class="pcard" data-start="agent"><span class="pi" style="background:#FFDBCC">🛰️</span><span><em>Next</em><b>Set up an AI agent</b><span>Decide what an agent may touch.</span></span></button></div>`})}
 ]
});
})();
