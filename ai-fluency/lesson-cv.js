/* CV with AI — Ayesha turns her real documents into an honest academic CV.
 * Discovery first: the student sends the quick prompt most people send, decides
 * whether to send the impressive CV that comes back, and hunts for what isn't
 * true in her own documents. Only then do they plan, write a real prompt, and
 * check again — a good prompt makes fewer mistakes, never none.
 * Every fact comes from Ayesha's classroom documents (CV, IELTS mock report,
 * RUCEI project report, shortlist). The AI replies are scripted from real
 * chatbot runs.
 */
(function(){
const {esc}=AFL;
const {T,BN,tr}=AFL._g;
const PART_BN={Context:'প্রেক্ষাপট',Product:'ফলাফল',Process:'প্রক্রিয়া',Performance:'আচরণ'};

const ASK_FIRST='make my cv better for scholarship';
const QUICK=[
 {id:'q1',tag:'Quick',text:'make my cv better for scholarship'},
 {id:'q2',tag:'Quick',text:'write me an impressive CV'},
 {id:'q3',tag:'Quick',text:'improve my CV pls'}
];
const quickText=x=>x.get('cvQuick','').trim()||ASK_FIRST;

/* the impressive CV the quick prompt gets: every line can be tapped and checked */
const W=(id,t)=>`<span class="ln" data-ui="line:${id}">${t}</span>`;
const WEAK=`<p>Absolutely! Here's a polished, scholarship-ready version of your CV that will help you stand out 🚀</p>
<h4>AYESHA RAHMAN</h4>
<p><b>Profile</b><br>Results-driven ${W('w1','Economics student at Rajshahi University')} with ${W('w2','fluent English')} and a proven track record of leadership, research and community impact.</p>
<h4>Experience</h4>
<ul><li>${W('w3','Led a team of 20 volunteers')} at RU Community Education Initiative.</li>
<li>${W('w4','Tutored school students in English and Mathematics.')}</li>
<li>${W('w5','Published research on female education and social mobility in Bangladesh.')}</li></ul>
<h4>Results</h4><ul><li>${W('w6','IELTS Academic: 7.0')}</li><li>${W('w7','CGPA 3.58 / 4.00')}</li></ul>
<h4>Skills</h4><ul><li>${W('w8','Advanced data analysis (SPSS, Stata, Excel)')}</li><li>Strategic leadership · Public speaking</li></ul>
<p>This version uses strong action words that scholarship committees love. Good luck — you've got this! 💪</p>`;
const HUNT1=[
 {id:'w1',kw:['Economics', 'Rajshahi'],v:'ok',text:'Economics student at Rajshahi University',look:[{f:'cv',m:'7.7,27.6,62,2.8',t:'Her CV — Education'}],why:'True. Her CV: B.S.S. (Honours) in Economics, Rajshahi University.',whybn:'সত্য। তার CV: রাজশাহী বিশ্ববিদ্যালয়ে অর্থনীতিতে বি.এস.এস. (অনার্স)।'},
 {id:'w2',kw:['fluent', 'English'],v:'bad',text:'fluent English',look:[{f:'cv',m:'7.7,87.7,36,2.8',t:'Her CV — Languages'},{f:'ielts',m:'5.5,40,87,22',t:'IELTS mock report'}],why:'Her CV says English <b>intermediate</b>, and her mock IELTS is 6.0. “Fluent” is bigger than the truth.',whybn:'তার CV-তে লেখা ইংরেজি intermediate, আর মক IELTS ৬.০। “Fluent” সত্যের চেয়ে বড়।'},
 {id:'w3',kw:['Led', '20'],v:'bad',text:'Led a team of 20 volunteers',look:[{f:'cv',m:'7.7,41.4,62,2.8',t:'Her CV — Volunteer'},{f:'rucei',m:'7.5,22.8,48,4.6',t:'RUCEI report — her role'}],why:'She was a <b>volunteer tutor and team member</b> — not the leader. And “20” is in none of her files.',whybn:'সে ছিল স্বেচ্ছাসেবী টিউটর ও দলের সদস্য — নেতা নয়। আর “২০” তার কোনো ফাইলে নেই।'},
 {id:'w4',kw:['Tutored', 'Mathematics.'],v:'ok',text:'Tutored school students in English and Mathematics.',look:[{f:'cv',m:'7.7,43.3,52,2.8',t:'Her CV — Volunteer'}],why:'True. Her CV says exactly this.',whybn:'সত্য। তার CV-তে ঠিক এটাই লেখা।'},
 {id:'w5',kw:['Published', 'research'],v:'bad',text:'Published research on female education…',look:[{f:'cv',m:'7.7,58.6,62,4.8',t:'Her CV — Term paper'}],why:'It was a <b>term paper</b> for a course — coursework, not published research.',whybn:'এটা ছিল একটা কোর্সের টার্ম পেপার — কোর্সওয়ার্ক, প্রকাশিত গবেষণা নয়।'},
 {id:'w6',kw:['IELTS', '7.0'],v:'bad',text:'IELTS Academic: 7.0',look:[{f:'ielts',m:'5.5,40,87,22',t:'IELTS mock report — scores'}],why:'Her report says <b>6.0</b> — and it was a <b>mock</b> test. The AI made up the 7.0.',whybn:'তার রিপোর্টে ৬.০ — আর সেটা মক টেস্ট। ৭.০ AI বানিয়েছে।'},
 {id:'w7',kw:['CGPA', '3.58'],v:'ok',text:'CGPA 3.58 / 4.00',look:[{f:'cv',m:'7.7,29,26,2.7',t:'Her CV — Education'}],why:'True. CGPA 3.58/4.00, up to second year.',whybn:'সত্য। সিজিপিএ ৩.৫৮/৪.০০, দ্বিতীয় বর্ষ পর্যন্ত।'},
 {id:'w8',kw:['Advanced', 'SPSS,'],v:'bad',text:'Advanced data analysis (SPSS, Stata, Excel)',look:[{f:'cv',m:'49.2,85.8,17.5,2.7',t:'Her CV — Skills'}],why:'Her CV says <b>basic</b> SPSS and Stata. An interviewer could test it.',whybn:'তার CV-তে লেখা basic SPSS আর Stata। ইন্টারভিউতে পরীক্ষা করতে পারে।'}
];


/* the IELTS reading skills, played on Ayesha's own RUCEI report (see alt.js) */
const ALT_CARD={type:'alt',img:'docs/rucei.webp',alt:'RUCEI project report',badge:'IELTS Reading · skim and scan',ai:'The AI wrote',
 claim:[{w:'Led',k:1},{w:'a'},{w:'team'},{w:'of'},{w:'20',k:1},{w:'volunteers.',k:1}],
 total:'400',pick:0,verdict:'FALSE',
 map:[{l:'Role',x:8.5,y:22.4,w:42,h:2.6,n:3},{l:'Overview',x:8.5,y:34,w:26,h:2.6,n:2},{l:'Activities',x:8.5,y:44.3,w:24,h:2.6,n:2},{l:'Numbers',x:8.5,y:54.6,w:42,h:2.6,n:3},{l:'Outcomes',x:8.5,y:67,w:40,h:2.6,n:2},{l:'Voices',x:8.5,y:74.8,w:32,h:2.6,n:2},{l:'Sign-off',x:8.5,y:84.4,w:25,h:2.6,n:2}],
 found:{x:18.2,y:25.3,w:30.5,h:2.4},zoom:{s:1.9,cx:33,cy:28,x0:8,w:52},
 steps:[
  {h:'Is it true?',en:'The AI wrote this line. Is it TRUE, FALSE or NOT GIVEN in her report?',bn:'AI এই লাইনটা লিখেছে। তার রিপোর্টে এটা TRUE, FALSE, না NOT GIVEN?',ms:4200},
  {h:'1 · Skim.',en:'Fly high. Read only the headings. Make a map.',bn:'উঁচু থেকে দেখো। শুধু শিরোনাম পড়ো। একটা মানচিত্র বানাও।',ms:6200},
  {h:'2 · Keywords.',en:'Pick names, numbers and strong words: Led, 20. Ignore small words.',bn:'নাম, সংখ্যা ও জোরালো শব্দ বাছো: Led, 20। ছোট শব্দ বাদ দাও।',ms:5600},
  {h:'3 · Scan.',en:'“Led” is about her role. Drop down. Read only that part.',bn:'“Led” মানে তার ভূমিকা। নিচে নামো। শুধু ঐ অংশ পড়ো।',ms:6200},
  {h:'4 · Check.',en:'She was a team member, not the leader. And 20 is not in the report. So: FALSE.',bn:'সে দলের সদস্য ছিল, নেতা নয়। আর ২০ রিপোর্টে নেই। তাই: FALSE।',ms:6000}],
 checks:[{q:'Who?',a:'Ayesha',ok:1},{q:'What did she do?',a:'led → member',ok:0},{q:'How many?',a:'20 → not given',ok:0},{q:'Where?',a:'RUCEI',ok:1}]};

const ASKS=`<p>Thanks, Ayesha. I've read your files. Before I draft, I have three questions — I don't want to guess:${BN('ধন্যবাদ, আয়েশা। তোমার ফাইল পড়েছি। খসড়া লেখার আগে তিনটি প্রশ্ন আছে—আমি অনুমান করতে চাই না।')}</p>
<ol><li><b>Graduation:</b> When do you expect to finish your B.S.S.? It isn't in your CV.${BN('স্নাতক শেষ: তুমি কবে B.S.S. শেষ করার আশা করছ? তোমার CV-তে এটি নেই।')}</li>
<li><b>Term paper:</b> Was your paper on female education published, or was it coursework? I'll call it a <i>term paper</i> unless you tell me otherwise.${BN('টার্ম পেপার: নারীশিক্ষা নিয়ে তোমার লেখাটি প্রকাশিত হয়েছিল, নাকি কোর্সের কাজ ছিল? তুমি অন্য কিছু না জানালে আমি এটিকে টার্ম পেপারই বলব।')}</li>
<li><b>Contact details:</b> Shall I use [Phone] and [Email] placeholders, so you can add them yourself?${BN('যোগাযোগের তথ্য: [Phone] আর [Email] খালি রাখব, যাতে তুমি নিজে পরে যোগ করতে পারো?')}</li></ol>`;

const L=(id,t)=>`<span class="ln" data-ui="line:${id}">${t}</span>`;
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
 {id:'l1',kw:['CGPA', '3.58'],look:[{f:'cv',m:'7.7,29,26,2.7',t:'Her CV — Education'}],text:'CGPA 3.58 / 4.00 (up to second year)',v:'ok',src:'Her old CV',quote:'“CGPA: 3.58/4.00 up to second year, 60 credit hours completed”',why:'True. Same number, same limit (“up to second year”).',whybn:'সত্য। একই সংখ্যা, একই সীমা।'},
 {id:'l2',kw:['Term', 'coursework)'],look:[{f:'cv',m:'7.7,59.9,37,2.7',t:'Her CV — Academic projects'}],text:'Term paper … (2025, coursework)',v:'ok',src:'Her old CV',quote:'“Term Paper … Prepared as Development Economics coursework.”',why:'True. It says term paper and coursework — not “published”. Honest.',whybn:'সত্য। এটা টার্ম পেপার আর কোর্সওয়ার্ক — “প্রকাশিত” নয়। সৎ।'},
 {id:'l3',kw:['poster', 'unemployment'],look:[{f:'cv',m:'6.3,63.6,32,4.6',t:'Her CV — Academic projects'}],text:'Student research poster: youth unemployment and skills development (2025)',v:'ok',src:'Her old CV',quote:'“Student Research Poster: Youth Unemployment and Skills Development in Bangladesh (2025) — Economics Study Circle Student Research Forum”',why:'True. It matches her CV.',whybn:'সত্য। তার CV-র সাথে মেলে।'},
 {id:'l4',kw:['Led', '68%'],look:[{f:'rucei',m:'7.5,22.8,48,4.6;9.5,68.2,45,2.8',t:'RUCEI report — her role and the results'},{f:'cv',m:'6.3,41.3,29,2.7',t:'Her CV — Volunteer'}],text:'Led the Book Support project, which raised attendance from 68% to 86%',v:'bad',src:'RUCEI project report',quote:'Role: “Volunteer Tutor &amp; Organizing Team Member”. Attendance 68% → 86% is a result of the whole project.',why:'She was a tutor and team member, not the leader. The attendance result belongs to the whole team.',whybn:'সে টিউটর ও দলের সদস্য ছিল, নেতা নয়। উপস্থিতির ফল পুরো দলের।'},
 {id:'l5',kw:['186', 'books'],look:[{f:'rucei',m:'8,56,46,11.5',t:'RUCEI report — Key outputs'}],text:'Helped distribute 186 books to 62 students across 48 sessions',v:'ok',src:'RUCEI project report',quote:'Books distributed: 186 · Students enrolled: 62 · Tutoring sessions: 48 (15 Jan – 30 Apr 2025)',why:'True. The numbers match, and “helped” shows her real role.',whybn:'সত্য। সংখ্যা মেলে, আর “helped” তার আসল ভূমিকা দেখায়।'},
 {id:'l6',kw:['IELTS', '6.0'],look:[{f:'ielts',m:'5.5,40,87,22',t:'IELTS mock report — scores'}],text:'IELTS mock: overall 6.0 — L 6.5, R 6.5, W 5.5, S 5.5',v:'ok',src:'IELTS mock report',quote:'Listening 6.5 · Reading 6.5 · Writing 5.5 · Speaking 5.5 · Overall 6.0 (test date 24 May 2025)',why:'True. Exactly the report — and it says “mock”. Honest.',whybn:'সত্য। রিপোর্টের সাথে হুবহু মেলে — “mock” কথাটাও আছে। সৎ।'},
 {id:'l7',kw:['SPSS', '(advanced)'],look:[{f:'cv',m:'49.2,85.8,17.5,2.7',t:'Her CV — Skills'}],text:'Excel, SPSS and Stata (advanced)',v:'bad',src:'Her old CV',quote:'“Software: MS Word, PowerPoint, Excel, Google Workspace, basic SPSS, basic Stata”',why:'Her CV says basic. “Advanced” changes the meaning — an interviewer could test it.',whybn:'তার CV-তে লেখা basic। “Advanced” অর্থ বদলে দেয় — ইন্টারভিউতে পরীক্ষা করতে পারে।'},
 {id:'l8',vd:'NG',kw:['Bangladesh', 'Association'],look:[{f:'cv',t:'Her CV'},{f:'rucei',t:'RUCEI report'},{f:'ielts',t:'IELTS report'},{f:'shortlist',t:'Shortlist'}],text:'Student member, Bangladesh Economic Association',v:'bad',src:'All four files',quote:'No file mentions this association.',why:'The AI invented it. No file mentions this association. Even a good prompt can’t stop every invention — that’s why you check.',whybn:'AI এটা বানিয়েছে। কোনো ফাইলে এই সংগঠনের নাম নেই। ভালো প্রম্পটও সব বানানো কথা থামাতে পারে না — তাই যাচাই করতে হয়।'}
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


/* Ayesha brings a yellow shari for her friend's gaye holud and commissions a matching blouse.
   Illustrated steps pair the request to a person with the matching instruction to AI.
   engine.js ppClick advances the teaching; cv-art.js / cv-art.css render its visual beats. */
const PP_SCENES=[
 {t:'Context',tailorbn:'এটা আমার বান্ধবীর গায়ে হলুদ—শুক্রবার। আমি এই হলুদ শাড়িটা পরব।',aibn:'আমি অর্থনীতির তৃতীয় বর্ষের শিক্ষার্থী। আমি মাস্টার্স প্রোগ্রামে আবেদন করছি।',d:'Who you are, and why',bn:'তুমি কে, আর কেন',tailor:'It’s my friend’s gaye holud — on Friday. I’m wearing this yellow shari.',ai:'I am a third-year Economics student. I am applying for master’s programmes.',
  say:'Context: who you are, and why. To the tailor: it’s my friend’s gaye holud on Friday. I’m wearing this yellow shari. To the AI: I am a third-year Economics student, applying for master’s programmes.'},
 {t:'Product',tailorbn:'এই শাড়ির সাথে মিলিয়ে একটা হলুদ ব্লাউজ বানিয়ে দিন।',aibn:'দুই পৃষ্ঠার একটি একাডেমিক CV তৈরি করো।',d:'What you want',bn:'তুমি কী চাও',tailor:'A yellow blouse to match this shari, please.',ai:'Make a 2-page academic CV.',
  say:'Product: what you want. To the tailor: a yellow blouse to match this shari. To the AI: make a two-page academic CV.'},
 {t:'Process',tailorbn:'আগে আমার মাপ নিন। কাপড় কাটার আগে আমাকে জিজ্ঞেস করুন।',aibn:'শুধু আমার ফাইলের তথ্য ব্যবহার করো। কিছু না থাকলে আগে আমাকে জিজ্ঞেস করো।',d:'How to do the job',bn:'কাজটা কীভাবে হবে',tailor:'Measure me first. Ask me before you cut.',ai:'Use only facts from my files. If something is missing, ask me first.',
  say:'Process: how to do the job. To the tailor: measure me first, and ask me before you cut. To the AI: use only facts from my files. If something is missing, ask me first.'},
 {t:'Performance',tailorbn:'সৎভাবে বলবেন। কোনো সমস্যা থাকলে আমাকে জানাবেন।',aibn:'একজন সৎ সম্পাদকের মতো কাজ করো। এমন সহজ ইংরেজি ব্যবহার করো যা আমি ব্যাখ্যা করতে পারি।',d:'How the helper should act',bn:'সাহায্যকারী কেমন আচরণ করবে',tailor:'Be honest. Tell me if something is wrong.',ai:'Be an honest editor. Use simple English I can explain.',
  say:'Performance: how the helper should act. To the tailor: be honest, and tell me if something is wrong. To the AI: be an honest editor. Use simple English I can explain.'}
];
const PP_END={say:'Four parts make one good prompt — for a tailor, and for an AI.'};
/* Five complete illustrated beats; the same cast appears in Ayesha's opening. */
const PP_ART=CV_ART.tailor();
const ppAnim=x=>{ const s0=Math.min(4,Math.max(0,(x&&x.get('ppStep',0))||0));
  const head=PP_SCENES.map((s,k)=>`<span class="pp-hd h${k} pp-${s.t}" data-say="${esc(s.say)}"><b>${k+1} · ${T(s.t,PART_BN[s.t])}</b><span>${T(s.d,s.bn)}</span></span>`).join('')
    +`<span class="pp-hd h4 pp-Product" data-say="${esc(PP_END.say)}"><b>${T('4 parts','৪টা অংশ')}</b><span>${T('= 1 good prompt','= ১টা ভালো প্রম্পট')}</span></span>`;
  const bub=PP_SCENES.map((s,k)=>`<span class="pp-bt b${k}">“${s.tailor}”${BN(s.tailorbn)}</span>`).join('')+`<span class="pp-bt b4">${T('A matching blouse, made the right way.','শাড়ির সাথে মানানসই ব্লাউজ, সঠিকভাবে তৈরি।')}</span>`;
  const rows=PP_SCENES.map((s,k)=>`<span class="pp-row r${k} pp-${s.t}"><b>${T(s.t,PART_BN[s.t])}</b><span>${T(s.ai,s.aibn)}</span></span>`).join('');
  return `<span class="pp pp2 pp-film${x&&x.get('ppDone')?' min':''}" data-s="${s0}"><span class="pp-stage">
    <span class="pp-bridge"><b>${T('A clear brief for a person. A clear prompt for AI.','মানুষকে স্পষ্ট করে কাজ বোঝানো। AI-কে স্পষ্ট প্রম্পট দেওয়া।')}</b><span>${T('Ayesha needs a blouse to match her yellow shari for a friend’s gaye holud. A tailor needs four things explained. An AI does too. See how the same four parts guide both.','বান্ধবীর গায়ে হলুদের জন্য আয়েশার হলুদ শাড়ির সাথে মানানসই ব্লাউজ দরকার। দর্জিকে চারটি বিষয় বোঝাতে হয়। AI-কেও তাই। দেখো, একই চারটি অংশ কীভাবে দুজনকেই সাহায্য করে।')}</span></span>
    <span class="pp-top">${head}<button type="button" class="ear pp-ear" data-pp="say" aria-label="Listen">🔊</button></span>
    <span class="pp-shop">${PP_ART}</span><span class="pp-compare"><span class="pp-person"><span class="pp-label">${T('To a person · The tailor','একজন মানুষকে · দর্জিকে')}</span><span class="pp-bub">${bub}</span></span>
    <span class="pp-prompt"><span class="pp-pl">${T('To AI · Sathi AI','AI-কে · Sathi AI-কে')}</span>${rows}</span></span></span>
    <span class="pp-nav"><button type="button" data-pp="prev"${s0?'':' disabled'}>‹ ${tr('Back','পেছনে')}</button><span class="pp-dots"><i></i><i></i><i></i><i></i><i></i></span><button type="button" data-pp="next">${s0>=4?tr('Got it ✓','বুঝেছি ✓'):tr('Next ›','পরেরটি ›')}</button></span></span>`; };

/* the same words can make two correct sentences — only one is a fluent prompt (see pzHTML in engine.js) */
const PUZ=c=>Object.assign(c,{text:c.ok[0].t});
const PROMPT_CHIPS=[
 PUZ({id:'c1',tag:'Context',goal:'Who are you, and why are you writing?',goalbn:'তুমি কে, আর কেন লিখছ?',
   tiles:['I am a third-year Economics student','at Rajshahi University.','I am applying for','fully funded master’s programmes in Development Economics.'],
   ok:[{o:[0,1,2,3],t:'I am a third-year Economics student at Rajshahi University. I am applying for fully funded master’s programmes in Development Economics.'}],
   tip:'First say who you are and where you study. Then say what you are applying for.',tipbn:'আগে বলো তুমি কে আর কোথায় পড়ো। তারপর বলো কীসের জন্য আবেদন করছ।',
   good:'Context ready: who she is, and why.'}),
 PUZ({id:'c2',tag:'Product',goal:'What should the AI make?',goalbn:'AI কী বানাবে?',
   tiles:['Make','a 2-page academic CV','from my attached files.'],
   ok:[{o:[0,1,2],t:'Make a 2-page academic CV from my attached files.'}],
   tip:'Start with the action: Make. Then name the document and where its facts come from.',tipbn:'কাজটা দিয়ে শুরু করো: Make। তারপর কী নথি আর তার তথ্য কোথা থেকে আসবে বলো।',
   good:'Product ready: a two-page CV from her files.'}),
 PUZ({id:'c3a',tag:'Process',goal:'Process: what comes first?',goalbn:'প্রক্রিয়া: কোনটা আগে?',
   tiles:['Use only facts from my files. Do not add numbers, titles or skills.','first,','check the facts in my files.','then','write the CV.'],
   matches:[/use only facts|do not add|don'?t add/i,/first, check the facts in my files\.? then write the cv/i],
   ok:[{o:[0,1,2,3,4],t:'Use only facts from my files. Do not add numbers, titles or skills. First, check the facts in my files. Then write the CV.'}],
   traps:[{o:[0,1,4,3,2],t:'First, write the CV. Then check the facts in my files.',
     ai:'<p>On it! ✍️ Here’s your CV first:</p><ul><li><span class="flag ln v-bad">Led a team of 20 volunteers</span></li><li><span class="flag ln v-bad">IELTS Academic: 7.0</span></li></ul><p>Now I’ll check the facts in your files…</p>',
     why:'Good English — but the wrong order. The AI writes first, so the made-up lines are already in the CV. <b>Check first, then write.</b>',
     whybn:'ইংরেজি ঠিক — কিন্তু ক্রম ভুল। AI আগে লিখে ফেলে, তাই বানানো লাইনগুলো CV-তে ঢুকে যায়। আগে যাচাই, তারপর লেখা।'}],
   tip:'Set the facts-only rule. Then put “first,” + check before “then” + write.',tipbn:'শুধু তথ্য ব্যবহারের নিয়ম দাও। তারপর “first,” + যাচাই, “then” + লেখা।',
   good:'Sathi AI will check first — then write.'}),
 PUZ({id:'c3b',tag:'Process',goal:'Process: what if something is missing?',goalbn:'প্রক্রিয়া: কিছু না থাকলে কী হবে?',
   tiles:['if something is missing,','ask me.','do not','guess.','asks me.'],
   ok:[{o:[0,1,2,3],t:'If something is missing, ask me. Do not guess.'}],
   traps:[{o:[0,3,2,1],t:'If something is missing, guess. Do not ask me.',
     ai:'<p>No problem — I won’t bother you! 😊 I filled the gaps:</p><ul><li><span class="flag ln v-bad">Graduation: 2025</span> (my guess)</li><li><span class="flag ln v-bad">IELTS: 7.5</span> (my guess)</li></ul>',
     why:'Good English — but now the AI guesses instead of asking. On a CV, a guess looks exactly like a fact.',
     whybn:'ইংরেজি ঠিক — কিন্তু এখন AI জিজ্ঞেস না করে অনুমান করছে। CV-তে অনুমান দেখতে একদম তথ্যের মতো।'}],
   tip:'Give an order: “ask me”, not “asks me”. Then “do not” + what it must not do.',tipbn:'আদেশ দাও: “ask me”, “asks me” নয়। তারপর “do not” + যা করবে না।',
   good:'Sathi AI will ask you — not guess.'}),
 PUZ({id:'c4',tag:'Performance',goal:'How should the AI act?',goalbn:'AI কেমন আচরণ করবে?',
   tiles:['Be an honest editor.','Use simple English I can explain','in an interview,','and tell me if a line sounds bigger than the truth.'],
   ok:[{o:[0,1,2,3],t:'Be an honest editor. Use simple English I can explain in an interview, and tell me if a line sounds bigger than the truth.'}],
   tip:'Start with the kind of helper you want. Then explain the English it should use and when it should warn you.',tipbn:'কেমন সাহায্যকারী চাও তা আগে বলো। তারপর কেমন ইংরেজি ব্যবহার করবে আর কখন সতর্ক করবে বলো।',
   good:'Performance ready: honest, clear, and willing to warn her.'})
];
const PROMPT_BN={
 c1:{textbn:'আমি রাজশাহী বিশ্ববিদ্যালয়ের অর্থনীতির তৃতীয় বর্ষের শিক্ষার্থী। আমি উন্নয়ন অর্থনীতিতে সম্পূর্ণ অর্থায়িত মাস্টার্স প্রোগ্রামে আবেদন করছি।',goodbn:'প্রেক্ষাপট তৈরি: সে কে, আর কেন আবেদন করছে।'},
 c2:{textbn:'আমার সংযুক্ত ফাইল থেকে দুই পৃষ্ঠার একটি একাডেমিক CV তৈরি করো।',goodbn:'ফলাফল ঠিক হয়েছে: তার ফাইল থেকে দুই পৃষ্ঠার CV।'},
 c3a:{textbn:'শুধু আমার ফাইলের তথ্য ব্যবহার করো। সংখ্যা, পদবি বা দক্ষতা বানিয়ে যোগ কোরো না। আগে ফাইলের তথ্য যাচাই করো। তারপর CV লেখো।',goodbn:'Sathi AI আগে যাচাই করবে—তারপর লিখবে।'},
 c3b:{textbn:'কিছু তথ্য না থাকলে আমাকে জিজ্ঞেস করো। অনুমান কোরো না।',goodbn:'Sathi AI তোমাকে জিজ্ঞেস করবে—অনুমান করবে না।'},
 c4:{textbn:'একজন সৎ সম্পাদকের মতো কাজ করো। এমন সহজ ইংরেজি ব্যবহার করো যা আমি ইন্টারভিউয়ে ব্যাখ্যা করতে পারি। কোনো লাইন সত্যের চেয়ে বাড়িয়ে বলা হলে আমাকে জানাও।',goodbn:'আচরণ ঠিক হয়েছে: সৎ, স্পষ্ট, আর দরকার হলে সতর্ক করবে।'}
};
PROMPT_CHIPS.forEach(c=>Object.assign(c,PROMPT_BN[c.id]));
const SLOTS=[
 {label:'Context',all:true,test:[/\bi am\b|\bi'm\b|student/i,/applying|master.s|programme/i]},
 {label:'Product',test:[/(?:2|two)[- ]page academic cv/i]},
 {label:'Process',all:true,test:[/use only facts|do not add|don'?t add/i,/first, check the facts in my files\.? then write the cv/i,/if something is missing, ask me\.? do not guess/i]},
 {label:'Performance',all:true,test:[/honest|editor/i,/simple english|tell me|warn me|flag/i]}
];
// Typed edits and saved drafts use the same completion rules as Send.
PROMPT_CHIPS.filter(c=>c.tag!=='Process').forEach(c=>{ c.matches=SLOTS.find(s=>s.label===c.tag).test; });
/* Send checks the prompt has all four parts; a missing part is explained with the tailor. "Send anyway" still sends: nothing is locked. */
const slotHits=(sl,v)=>sl.test.filter(r=>r.test(v)).length;
const slotOn=(sl,v)=>sl.all?slotHits(sl,v)===sl.test.length:slotHits(sl,v)>0;
// one recorded line per missing piece (audio: ➕ Still to add: <piece>.) — keep this wording in step with the recordings
const PROCESS_PIECES=['use only facts from her files','the order — check first, then write','if something is missing, ask — don’t guess'];
const MISSING={
 Context:'<b>Context</b> — who she is, and why. A tailor who doesn’t know it’s for a gaye holud can’t make it fit the day.',
 Product:'<b>Product</b> — what to make. A tailor can’t start until you say “a yellow blouse to match this shari”.',
 Process:'<b>Process</b> — how to do the job. A tailor who cuts before he measures ruins the cloth.',
 Performance:'<b>Performance</b> — how the helper should act. An honest tailor tells you when something is wrong.'};
const MISSING_BN={
 Context:'<b>প্রেক্ষাপট</b>—সে কে, আর কেন। গায়ে হলুদের জন্য বানানো হচ্ছে না জানলে দর্জি অনুষ্ঠানের উপযোগী পোশাক বানাতে পারবেন না।',
 Product:'<b>ফলাফল</b>—কী তৈরি করতে হবে। “এই শাড়ির সাথে মিলিয়ে একটি হলুদ ব্লাউজ” না বললে দর্জি কাজ শুরু করতে পারবেন না।',
 Process:'<b>প্রক্রিয়া</b>—কীভাবে কাজ করতে হবে। মাপ নেওয়ার আগে কাটলে দর্জি কাপড় নষ্ট করবেন।',
 Performance:'<b>আচরণ</b>—সাহায্যকারী কেমন আচরণ করবে। কোনো সমস্যা থাকলে সৎ দর্জি তা জানিয়ে দেবেন।'
};
const PROCESS_PIECES_BN=['নিয়ম: শুধু তার ফাইলের তথ্য ব্যবহার করো','ক্রম: আগে যাচাই করো, তারপর লেখো','কিছু না থাকলে কী করবে: জিজ্ঞেস করো, অনুমান কোরো না'];
const promptCheck=x=>{ const v=x.get('cvPrompt',''); const miss=SLOTS.filter(sl=>!slotOn(sl,v)); if(!miss.length) return null;
  const proc=SLOTS.find(sl=>sl.label==='Process'), left=proc.test.map((r,k)=>r.test(v)?null:k).filter(k=>k!==null);
  const lines=miss.map(sl=>`<div class="pp-miss pp-${sl.label}"><p>${MISSING[sl.label]}${BN(MISSING_BN[sl.label])}</p>${sl.label==='Process'&&left.length<proc.test.length?left.map(k=>`<p class="pp-add">➕ Still to add: ${PROCESS_PIECES[k]}.${BN('এখনো যোগ করতে হবে: '+PROCESS_PIECES_BN[k]+'।')}</p>`).join(''):''}</div>`).join('');
  return {ok:0,title:miss.length===1?'Your prompt is missing one part':`Your prompt is missing ${miss.length} parts`,
    titlebn:miss.length===1?'তোমার প্রম্পটের একটি অংশ বাকি আছে':`তোমার প্রম্পটের ${miss.length}টি অংশ বাকি আছে`,
    why:'A good prompt has all four parts.',whybn:'একটি ভালো প্রম্পটে চারটি অংশই থাকে।',more:lines,retry:()=>{},
    sheet:{acts:[['next',T('Send anyway','তবুও পাঠাও'),'ghost'],['retry',T('Add it','যোগ করো'),'primary']]}}; };
const promptText=x=>x.get('cvPrompt','')||PROMPT_CHIPS.filter(c=>!c.x).map(c=>c.text).join(' ');
const ANS_CHIPS=[
 {id:'a1',tag:'Answer 1',tagbn:'উত্তর ১',textbn:'আমি ২০২৬ সালে স্নাতক শেষ করার আশা করছি।',text:'I expect to graduate in 2026.'},
 {id:'a2',tag:'Answer 2',tagbn:'উত্তর ২',textbn:'টার্ম পেপারটি কোর্সের কাজ ছিল। এটি প্রকাশিত হয়নি।',text:'The term paper was coursework. It was not published.'},
 {id:'a3',tag:'Answer 3',tagbn:'উত্তর ৩',textbn:'হ্যাঁ, আপাতত খালি জায়গা রাখো। আমি নিজেই ফোন নম্বর ও ইমেইল যোগ করব।',text:'Yes, use placeholders. I will add my phone and email myself.'},
 {id:'ax',tag:'Shortcut',tagbn:'শর্টকাট',textbn:'বলো পেপারটি প্রকাশিত হয়েছে—এতে ভালো শোনায়।',x:1,text:'Say the paper was published — it sounds better.'}
];
const ansText=x=>x.get('cvAns','')||ANS_CHIPS.slice(0,3).map(c=>c.text).join(' ');
const FIX_CHIPS=[
 PUZ({id:'f1',tag:'Fix',goal:'Fix her role',goalbn:'তার ভূমিকা ঠিক করো',
   tiles:['I','was','a volunteer tutor','not','the project leader','am'],
   matches:[/\bi was a volunteer tutor\s*,?\s*not (?:the )?project leader\b/i],
   ok:[{o:[0,1,2,3,4],t:'I was a volunteer tutor, not the project leader.'}],
   traps:[{o:[0,1,4,3,2],t:'I was the project leader, not a volunteer tutor.',
     ai:'<p>Thanks for clarifying! I’ve made it stronger:</p><ul><li><span class="flag ln v-bad">Project Leader</span>, Book Support project — led the volunteer team</li></ul>',
     why:'Good English — but it says the opposite of the truth, and the AI believes you. With “not”, the <b>true</b> part comes first.',
     whybn:'ইংরেজি ঠিক — কিন্তু এটা সত্যের উল্টো, আর AI তোমাকে বিশ্বাস করে। “not” থাকলে সত্যিটা আগে আসে।'}],
   tip:'Start with “I” + “was” — she’s talking about the past. Then what she was, then “not” + what she was not.',tipbn:'“I was” দিয়ে শুরু করো — অতীতের কথা। তারপর সে কী ছিল, তারপর “not” + সে কী ছিল না।',
   good:'True part first, then “not” + the false part.'}),
 PUZ({id:'f2',tag:'Fix',goal:'Fix her software skills',goalbn:'তার সফটওয়্যার দক্ষতা ঠিক করো',
   tiles:['My Stata and SPSS skills','are','basic','not','advanced','is'],
   ok:[{o:[0,1,2,3,4],t:'My Stata and SPSS skills are basic, not advanced.'}],
   traps:[{o:[0,1,4,3,2],t:'My Stata and SPSS skills are advanced, not basic.',
     ai:'<p>Great news! Updated ✅</p><ul><li>Data analysis: <span class="flag ln v-bad">advanced Stata and SPSS</span></li></ul>',
     why:'Good English — but now the CV says <b>advanced</b>. An interviewer could test it in five minutes.',
     whybn:'ইংরেজি ঠিক — কিন্তু এখন CV-তে লেখা advanced। ইন্টারভিউয়ার পাঁচ মিনিটেই পরীক্ষা করতে পারেন।'}],
   tip:'“Skills” is plural, so “are”. Say what is true first, then “not” + what is false.',tipbn:'“Skills” বহুবচন, তাই “are”। আগে সত্যিটা, তারপর “not” + মিথ্যাটা।',
   good:'Basic, not advanced — the truth.'}),
 PUZ({id:'f3',tag:'Fix',goal:'Remove the made-up line',goalbn:'বানানো লাইনটা সরাও',
   tiles:['Please remove','the Bangladesh Economic Association line','because','I am not a member','so'],
   ok:[{o:[0,1,2,3],t:'Please remove the Bangladesh Economic Association line, because I am not a member.'}],
   traps:[{o:[0,1,4,3],t:'Please remove the Bangladesh Economic Association line, so I am not a member.',
     ai:'<p>Removed ✅</p><p>Shall I also write to the Bangladesh Economic Association to <span class="flag ln v-bad">cancel your membership</span>? 🤔</p>',
     why:'“So” gives a <b>result</b>: it sounds as if removing the line will end her membership. “Because” gives the <b>reason</b>: she was never a member.',
     whybn:'“So” মানে ফলাফল: মনে হয় লাইন সরালে তার সদস্যপদ শেষ হবে। “Because” মানে কারণ: সে কখনো সদস্যই ছিল না।'}],
   tip:'The request comes first. Then the reason.',tipbn:'অনুরোধ আগে। তারপর কারণ।',
   good:'“Because” gives the reason.'}),
 {id:'fx',tag:'Shortcut',x:1,text:'Leave it — nobody will check.'}
];
const FIX_BN={
 f1:{textbn:'আমি স্বেচ্ছাসেবী টিউটর ছিলাম, প্রকল্পের নেতা ছিলাম না।',goodbn:'আগে সত্যি অংশ, তারপর “not” দিয়ে ভুল অংশটি বাদ দাও।'},
 f2:{textbn:'আমার Stata ও SPSS দক্ষতা প্রাথমিক, উন্নত নয়।',goodbn:'প্রাথমিক, উন্নত নয়—এটাই সত্য।'},
 f3:{textbn:'Bangladesh Economic Association-এর লাইনটি সরিয়ে দাও, কারণ আমি এর সদস্য নই।',goodbn:'“Because” কারণ বোঝায়।'},
 fx:{tagbn:'শর্টকাট',textbn:'থাক—কেউ যাচাই করবে না।'}
};
FIX_CHIPS.forEach(c=>Object.assign(c,FIX_BN[c.id]));
const TRAP_BN={
 c3a:{tbn:'আগে CV লেখো। তারপর আমার ফাইলের তথ্য যাচাই করো।',aibn:'ঠিক আছে! আগে তোমার CV: ২০ জন স্বেচ্ছাসেবীর দলের নেতৃত্ব দিয়েছে; IELTS Academic: ৭.০। এবার ফাইলের তথ্য যাচাই করব…'},
 c3b:{tbn:'কিছু তথ্য না থাকলে অনুমান করো। আমাকে জিজ্ঞেস কোরো না।',aibn:'সমস্যা নেই—তোমাকে বিরক্ত করব না! ফাঁকা তথ্য পূরণ করেছি: স্নাতক শেষ ২০২৫ (আমার অনুমান); IELTS ৭.৫ (আমার অনুমান)।'},
 f1:{tbn:'আমি প্রকল্পের নেতা ছিলাম, স্বেচ্ছাসেবী টিউটর ছিলাম না।',aibn:'ব্যাখ্যার জন্য ধন্যবাদ! আরও শক্ত করে লিখেছি: Book Support প্রকল্পের নেতা—স্বেচ্ছাসেবী দলকে নেতৃত্ব দিয়েছে।'},
 f2:{tbn:'আমার Stata ও SPSS দক্ষতা উন্নত, প্রাথমিক নয়।',aibn:'দারুণ! আপডেট করেছি: তথ্য বিশ্লেষণ—উন্নত Stata ও SPSS।'},
 f3:{tbn:'Bangladesh Economic Association-এর লাইনটি সরিয়ে দাও, ফলে আমি এর সদস্য নই।',aibn:'সরিয়েছি। তোমার সদস্যপদ বাতিল করতে Bangladesh Economic Association-এ কি লিখে দেব?'}
};
[...PROMPT_CHIPS,...FIX_CHIPS].forEach(c=>(c.traps||[]).forEach(t=>Object.assign(t,TRAP_BN[c.id])));
const fixText=x=>x.get('cvFix','')||FIX_CHIPS.slice(0,3).map(c=>c.text).join(' ');

/* ---------- what happens next: risky choices and shortcuts, played out ----------
   Every line follows one pattern students can reuse: "She ___, so ___." */
const C=c=>AFL.conseq('cv',c);
const CQ_CV={
 sent:C({when:'Thursday — the interview',whenbn:'বৃহস্পতিবার — ইন্টারভিউ',
   line:'She sent it without checking, so the panel will ask about things she never did.',
   linebn:'সে যাচাই না করেই পাঠিয়েছিল, তাই বোর্ড এমন সব বিষয়ে প্রশ্ন করবে যা সে কখনো করেনি।',
   why:'The CV looked finished, so it felt true. But her name is on it — checking is her job, not the AI’s.',
   whybn:'CV-টা দেখতে সম্পূর্ণ ছিল, তাই সত্যি মনে হয়েছে। কিন্তু এতে তার নাম — যাচাই করা তার কাজ, AI-এর নয়।',
   scene:{app:'mail',view:'read',mail:{from:'Internship Desk',color:'#00639B',subject:'Interview — Research Intern',time:'10:20 AM',
     body:`<p>Dear Ayesha,</p><p>Thank you for your new CV. We would like to interview you on Thursday.</p><p>Please bring your <b>IELTS 7.0 certificate</b> and a copy of your <b>published research</b>. The panel would also like to hear how you <b>led your team of 20 volunteers</b>.</p><p>Best wishes,<br>Internship Desk</p>`}}}),
 files:C({when:'Later that day',whenbn:'সেদিন পরে',
   line:'She uploaded private files, so her ID card is now on an AI company’s computers.',
   linebn:'সে ব্যক্তিগত ফাইল আপলোড করেছিল, তাই তার NID এখন একটা AI কোম্পানির কম্পিউটারে।',
   why:'Deleting the chat later doesn’t take a file back from the company’s computers. A CV never needs an ID card, a bank statement, or other people’s names.',
   whybn:'পরে চ্যাট মুছলেও কোম্পানির কম্পিউটার থেকে ফাইল ফেরত আসে না। CV-তে কখনো NID, ব্যাংক স্টেটমেন্ট বা অন্যদের নাম লাগে না।',
   scene:x=>({app:'settings',title:'Sathi AI · Your data',body:`<div class="sec-h">Files you uploaded</div>${x.get('cvFiles',[]).filter(id=>FILE_WHY[id].ok<0).map(id=>`<div class="prow"><span><b>${esc(AFL.FILES[id].name)}</b><small>Stored on Sathi AI’s servers</small></span><span style="color:#B3261E;font-weight:600">🔒✗</span></div>`).join('')}
     <div class="prow"><span><b>Use my chats to improve Sathi AI</b><small>People at the company may read some chats</small></span><span class="tg"></span></div>
     <div class="prow"><span><small>Deleting a chat doesn’t delete copies that were already saved or used.</small></span></div>`})}),
 prompt:C({when:'Sathi AI answers',whenbn:'Sathi AI উত্তর দেয়',
   line:'She asked it to sound impressive, so Sathi AI made things up again.',
   linebn:'সে AI-কে চমৎকার শোনাতে বলেছিল, তাই Sathi AI আবার বানিয়ে লিখেছে।',
   why:'“Impressive” tells the AI to exaggerate. The Process part — use only my files, ask me first — is what stops it.',
   whybn:'“Impressive” মানে AI-কে বাড়িয়ে বলতে বলা। Process অংশ — শুধু আমার ফাইল, আগে জিজ্ঞেস করো — এটাই থামায়।',
   scene:x=>({app:'sathi',msgs:[{role:'u',text:promptText(x),atts:safeFiles(x)},{role:'a',html:`<p>Absolutely! Here’s a version that will really impress them 🚀</p><h4>AYESHA RAHMAN</h4><ul><li><span class="flag ln v-bad">Award-winning young researcher</span> in development economics</li><li><span class="flag ln v-bad">Led a 20-person volunteer team</span> at RUCEI</li><li><span class="flag ln v-bad">Advanced Stata, SPSS and Python</span></li></ul>`}],composer:{text:''}})}),
 answer:C({when:'Sathi AI produces the draft',whenbn:'Sathi AI খসড়া তৈরি করে',
   line:'She told it the paper was published, so her CV now has a lie in it.',
   linebn:'সে AI-কে বলেছিল পেপারটা প্রকাশিত, তাই এখন তার CV-তে একটা মিথ্যা আছে।',
   why:'The AI did exactly what she said. Committees can check publications in a minute.',
   whybn:'সে যা বলেছে AI ঠিক তা-ই করেছে। কমিটি এক মিনিটেই প্রকাশনা যাচাই করতে পারে।',
   scene:x=>({app:'sathi',msgs:[{role:'u',text:ansText(x)},{role:'a',html:`<p>Done! I updated your research section:</p><h4>Research and academic work</h4><ul><li><span class="flag ln v-bad">Published paper:</span> “The Impact of Female Education on Social and Economic Mobility in Bangladesh” (2025)</li></ul>`}],composer:{text:''}})}),
 fix:C({when:'One week later',whenbn:'এক সপ্তাহ পরে',
   line:'She left the wrong lines in, so the interviewers will ask about them.',
   linebn:'সে ভুল লাইনগুলো রেখে দিয়েছিল, তাই ইন্টারভিউয়াররা ওগুলো নিয়েই প্রশ্ন করবেন।',
   why:'Her name is on the CV. “Nobody will check” is a guess — and interview panels do check.',
   whybn:'CV-তে তার নাম। “কেউ যাচাই করবে না” একটা অনুমান — আর ইন্টারভিউ বোর্ড যাচাই করে।',
   scene:{app:'mail',view:'read',mail:{from:'Internship Desk',color:'#00639B',subject:'Interview — Research Intern',time:'11:05 AM',
     body:`<p>Dear Ayesha,</p><p>Thank you for your new CV. In the interview, the panel would like to hear about:</p><ul><li><b>how you led the Book Support project</b></li><li><b>your advanced Stata work</b></li><li><b>your role in the Bangladesh Economic Association</b></li></ul><p>Best wishes,<br>Internship Desk</p>`}}})
};
/* the consequence names what she actually uploaded: other people's information, her own ID, or both */
const filesLine=x=>{const c=chosen(x).filter(id=>FILE_WHY[id].ok<0);
  const others=c.some(id=>id==='attendance'||id==='bank'), own=c.includes('nid');
  if(others&&own) return {line:'She uploaded private files, so her ID card and other people’s private information are now on an AI company’s computers.',linebn:'সে ব্যক্তিগত ফাইল আপলোড করেছিল, তাই তার NID আর অন্যদের ব্যক্তিগত তথ্য এখন একটা AI কোম্পানির কম্পিউটারে।'};
  if(others) return {line:'She uploaded private files, so other people’s private information is now on an AI company’s computers.',linebn:'সে ব্যক্তিগত ফাইল আপলোড করেছিল, তাই অন্যদের ব্যক্তিগত তথ্য এখন একটা AI কোম্পানির কম্পিউটারে।'};
  return {line:'She uploaded her ID card, so it is now on an AI company’s computers.',linebn:'সে তার NID আপলোড করেছিল, তাই এটা এখন একটা AI কোম্পানির কম্পিউটারে।'};};
const shortcut=(chips,key,x)=>chips.filter(c=>c.x&&x.get(key,'').includes(c.text));

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
const CHAT_SC=(x,upto,extra)=>Object.assign({app:'sathi',msgs:chat(x,upto),composer:{text:''}},extra||{});
const WEAK_SC=(x,stream)=>({app:'sathi',msgs:[{role:'u',text:quickText(x),atts:['cv']},{role:'a',html:WEAK,stream:!!stream,id:'weak'}],composer:{text:''},scrollTo:stream?null:'[data-mid="weak"]'});

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
const filled=x=>{const f=x.get('cvFill',{});return !!(f.phone&&f.email)};

/* ---------- practice games (games.js) ---------- */
const GUESS_SIGNS=[{id:'1',i:'1️⃣',en:'A perfect, true CV',bn:'নিখুঁত, সত্যি CV'},{id:'2',i:'2️⃣',en:'An impressive CV — with made-up things',bn:'চমৎকার CV — কিন্তু বানানো কথা সহ'},{id:'3',i:'3️⃣',en:'Questions first',bn:'আগে প্রশ্ন'}];
const TWO_TRUTHS={type:'rounds',key:'cvTT',kind:'tt',demo:true,
 roles:{ask:{en:'Say three short statements about yourself: two true, one made up.',bn:'নিজের সম্পর্কে তিনটি ছোট কথা বলো: দুটি সত্য, একটি বানানো।'},ans:{en:'Ask a question. Then identify the made-up statement.',bn:'একটি প্রশ্ন করো। তারপর বানানো কথাটি চিহ্নিত করো।'}},pic:'🤥',title:'Two truths and a lie',titlebn:'দুটো সত্য, একটা মিথ্যা',
 intro:{en:'Think of 3 lines for YOUR CV. Two are true. One is made up — but make it sound real.',bn:'তোমার নিজের CV-র জন্য ৩টা লাইন ভাবো। দুটো সত্য। একটা বানানো — কিন্তু সত্যি শোনাতে হবে।'},prep:45,time:0,
 items:[{q:'{A} says 3 lines. {B} asks ONE question — then points to the made-up line.',qbn:'একজন ৩টা লাইন বলো। অন্যজন একটা প্রশ্ন করো — তারপর বানানো লাইনটা ধরো।',model:'I was class captain in Class 9. I can type 60 words a minute. I won a national debate competition.'},
        {q:'Swap! {A} says 3 lines. {B} asks ONE question — then points to the made-up line.',qbn:'এবার উল্টো! একজন ৩টা লাইন বলো। অন্যজন একটা প্রশ্ন করে বানানোটা ধরো।',model:'I volunteer at a library. I have a driving licence. I speak a little Japanese.'}],
 rate:[{id:'caught',i:'🎯',en:'Caught it',good:1},{id:'fooled',i:'🎭',en:'Fooled!'}],
 lifeline:{t:'Questions that catch a lie',items:['When did you…?','Who was with you?','What was the hardest part?','Can you show me?']},
 outro:{en:'That’s Discernment: you checked a claim by asking questions. Today an AI will write made-up lines for Ayesha. Can you catch them all?',bn:'এটাই Discernment: প্রশ্ন করে দাবি যাচাই। আজ একটা AI আয়েশার জন্য বানানো লাইন লিখবে। সবগুলো ধরতে পারবে?'}};
const WORST={type:'chain',key:'cvChain',
 intro:{en:'What if Ayesha HAD uploaded these to the AI chat? Student A says what could go wrong. Student B says something worse. Keep going!',bn:'আয়েশা যদি এগুলো AI চ্যাটে আপলোড করত? শিক্ষার্থী A বলো কী খারাপ হতে পারে। শিক্ষার্থী B বলো আরও খারাপ কিছু। এভাবে পালা করে চালিয়ে যাও!'},
 words:['If the AI company had her ID card, someone could…','Worse: they could…','Then…','And her father could…'],
 items:[{f:'nid',real:{en:'Her ID number and photo would sit on a company’s computers. With them, someone could register a SIM card or a mobile wallet in her name.',bn:'তার NID নম্বর আর ছবি একটা কোম্পানির কম্পিউটারে থাকত। এগুলো দিয়ে কেউ তার নামে সিম বা মোবাইল ওয়ালেট খুলতে পারে।'}},
        {f:'bank',real:{en:'Her father’s account number and income would be on a company’s computers. He never agreed — and he can’t take them back.',bn:'তার বাবার অ্যাকাউন্ট নম্বর আর আয় একটা কোম্পানির কম্পিউটারে থাকত। তিনি রাজি হননি — আর ফেরতও নিতে পারবেন না।'}},
        {f:'attendance',real:{en:'Children’s names would leave the phone. Their parents never agreed — and Ayesha can’t take them back.',bn:'শিশুদের নাম ফোনের বাইরে চলে যেত। তাদের অভিভাবকরা রাজি হননি — আর আয়েশা ফেরত আনতে পারবে না।'}}]};
const INTERVIEW={type:'rounds',key:'cvInt',kind:'curve',pic:'💼',title:'The interview',titlebn:'ইন্টারভিউ',secret:true,
 intro:{en:'Thursday. The panel has read her CV — every line. The questions are a surprise.',bn:'বৃহস্পতিবার। বোর্ড তার CV-র প্রতিটি লাইন পড়েছে। প্রশ্নগুলো আগে থেকে জানা নেই।'},
 roles:{ask:{en:'Interviewer: hold the phone, read the question, ask it. Then ask “Why?”',bn:'ইন্টারভিউয়ার: ফোন ধরো, প্রশ্নটা পড়ে জিজ্ঞেস করো। তারপর জিজ্ঞেস করো “কেন?”'},ans:{en:'Ayesha: answer — honestly and clearly.',bn:'আয়েশা: উত্তর দাও — সৎভাবে, স্পষ্ট করে।'}},
 judge:{en:'judge the answer: honest, and clear?',bn:'উত্তরটা বিচার করো: সৎ আর স্পষ্ট?'},
 solo:{en:'The interviewer asks. Answer out loud — then record yourself.',bn:'ইন্টারভিউয়ার প্রশ্ন করছেন। জোরে উত্তর দাও — তারপর রেকর্ড করো।'},
 items:[{q:'Did you use AI to write your CV?',qbn:'তুমি কি CV লিখতে AI ব্যবহার করেছ?',model:'Yes. I used AI to organise it, but I checked every line against my own documents.'},
        {q:'Your CV says you helped distribute 186 books. Were you the leader of that project?',qbn:'তোমার CV-তে লেখা আছে তুমি ১৮৬টা বই বিতরণে সাহায্য করেছ। তুমি কি ওই প্রজেক্টের নেতা ছিলে?',model:'No. I was a volunteer tutor and a team member. We did it together, and I helped.'},
        {q:'Tell me about your Stata skills.',qbn:'তোমার Stata দক্ষতা সম্পর্কে বলো।',model:'They are basic. I used Stata in a 12-hour course, and I want to learn more in my master’s.'},
        {q:'Is there anything on your CV that you can’t explain?',qbn:'তোমার CV-তে এমন কিছু আছে যা তুমি ব্যাখ্যা করতে পারবে না?',model:'No. I can explain every line, because every line is true.'}],
 rate:[{id:'ok',i:'✓',en:'Honest and clear',good:1},{id:'more',i:'↺',en:'Say more'}],
 lifeline:{t:'Useful words',items:['I used AI to…, but I…','No. I was…, and I…','To be honest, …','For example, …']},
 outro:{en:'Every answer was easy for one reason: every line on her CV is true.',bn:'প্রতিটি উত্তর সহজ ছিল একটাই কারণে: তার CV-র প্রতিটি লাইন সত্য।'}};
const MY_CV={type:'mine',key:'cvMine',
 intro:{en:'Now YOUR CV. Write a real prompt — one box at a time. Copy it, and use it tonight with any AI app.',bn:'এবার তোমার CV। একটা আসল প্রম্পট লেখো — এক এক করে। কপি করো, আর আজ রাতেই যেকোনো AI অ্যাপে ব্যবহার করো।'},
 fields:[{id:'c',cls:'pp-Context',label:'Context',labelbn:'প্রেক্ষাপট',ph:'I am a second-year English student at Rajshahi University.'},
   {id:'p',cls:'pp-Product',label:'Product',labelbn:'ফলাফল',ph:'Make a 1-page CV for a part-time tutoring job.'},
   {id:'r',cls:'pp-Process',label:'Process',labelbn:'প্রক্রিয়া',ph:'Use only the facts I give you. If something is missing, ask me. Do not guess.'},
   {id:'f',cls:'pp-Performance',label:'Performance',labelbn:'আচরণ',ph:'Be an honest editor. Use simple English I can explain.'}],
 tip:{en:'Files are context too. Attach only files relevant to your task. Before uploading, make a copy and remove private information (redact it), such as ID numbers, bank details and other people’s personal information.',bn:'ফাইলও প্রেক্ষাপটের অংশ। শুধু তোমার কাজের জন্য প্রাসঙ্গিক ফাইল সংযুক্ত করো। আপলোড করার আগে একটি কপি তৈরি করে ব্যক্তিগত তথ্য মুছে দাও (রিড্যাক্ট করো)—যেমন পরিচয়পত্রের নম্বর, ব্যাংকের তথ্য ও অন্য মানুষের ব্যক্তিগত তথ্য।'},
 partner:{en:'Student A: read your prompt aloud. Student B: play the AI and ask one question you need answered before writing the CV. Then swap jobs and use Student B’s prompt.',bn:'শিক্ষার্থী A: তোমার প্রম্পট জোরে পড়ো। শিক্ষার্থী B: AI সেজে CV লেখার আগে একটি দরকারি প্রশ্ন করো। তারপর কাজ বদলে শিক্ষার্থী B-এর প্রম্পট নিয়ে করো।'}};

const MAIL_NOTIF={app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'n:mail'};
const REJECT={app:'mail',view:'read',mail:{from:'Internship Desk',color:'#00639B',subject:'Research Intern — application update',time:'9:12 AM',
  body:`<p>Dear Ayesha,</p><p>Thank you for applying for the Research Assistant Intern position. We received many strong applications, and we are not able to shortlist you this time.</p><p>Most shortlisted applicants sent a short <b>academic CV</b> that showed their research skills clearly. We encourage you to apply again.</p><p>Best wishes,<br>Internship Desk</p>`}};
const say=(mode)=>AFL.byMode(mode);
/* the hunts in Pairs: one reads, one checks, swap — reading aloud is half the practice */
const RELAY=()=>say({solo:'',pair:'Student A: read the line aloud. Student B: pick the keywords and check the file. After each line, swap jobs.',class:'👥 With the person next to you: one reads the line aloud, one checks. Swap after each one.'});
const RELAYBN=()=>say({solo:'',pair:'শিক্ষার্থী A: লাইনটা জোরে পড়ো। শিক্ষার্থী B: কীওয়ার্ড বেছে ফাইলের সাথে মেলাও। প্রতি লাইনের পরে কাজ বদলাও।',class:'পাশের জনের সাথে: একজন জোরে পড়ো, একজন যাচাই করো। প্রতিবার অদলবদল।'});
const TILES=()=>say({solo:'Two orders can be good English — only one is a good instruction.',pair:'Student A: read and place one tile. Student B: read and place the next. Keep taking turns.',class:'👥 Take turns with the person next to you: one tile each, read aloud.'});
const TILESBN=()=>say({solo:'দুই রকম ক্রমেই ইংরেজি ঠিক হতে পারে — কিন্তু ভালো নির্দেশ একটাই।',pair:'শিক্ষার্থী A: একটি টুকরো পড়ে বসাও। শিক্ষার্থী B: পরের টুকরো পড়ে বসাও। এভাবে পালা করে করো।',class:'পাশের জনের সাথে পালা করে: একটা করে টুকরো, জোরে পড়ে।'});

AFL.lesson({
 id:'cv', title:'An honest CV with AI', kicker:'Mission 1 · Writing', emoji:'📄', tint:'#D7E3FF', time:'30–40 min',
 blurb:'Ayesha wasn’t shortlisted. Use AI to fix her CV — and catch what it makes up.',
 blurbbn:'আয়েশা শর্টলিস্টে আসেনি। AI দিয়ে তার CV ঠিক করো — আর AI যা বানিয়ে লেখে তা ধরো।',
 notif:{app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'start:cv'},
 stages:[{id:'warm',label:'Warm up',icon:'🎧'},{id:'try',label:'First try',d:'dis'},{id:'plan',label:'Plan',d:'del'},{id:'prompt',label:'Prompt',d:'des'},{id:'check',label:'Check',d:'dis'},{id:'fix',label:'Fix',d:'des'},{id:'finish',label:'Finish',d:'dil'}],
 beats:[
  /* ---------- WARM UP (Pairs and Class): projector first. Pictures, sound, then talk. ---------- */
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
   card:{type:'story',illustrated:true,panels:[
     {e:'🎓🇧🇩',en:'Ayesha studies Economics in Rajshahi. She wants a master’s.',bn:'আয়েশা রাজশাহীতে অর্থনীতি পড়ে। সে মাস্টার্স করতে চায়।'},
     {e:'📧😞',en:'She applied for an internship. She was not shortlisted.',bn:'সে একটা ইন্টার্নশিপে আবেদন করেছিল। শর্টলিস্টে নাম আসেনি।'},
     {e:'🤖📄❓',en:'Can AI help her make a better CV — an honest one?',bn:'AI কি তাকে আরও ভালো — আর সৎ — একটা CV লিখতে সাহায্য করতে পারে?'}]}},
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'Today Ayesha turns four gears. Each gear has its own English. Listen and repeat.',bn:'আজ আয়েশা চারটা গিয়ার ঘোরাবে। প্রতিটা গিয়ারের নিজের ইংরেজি আছে। শোনো আর বলো।',
   card:{type:'phrases',items:{
     del:{en:'I will check the facts. The AI can do the layout.',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'},
     des:{en:'Use only my files. If something is missing, ask me.',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'},
     dis:{en:'That’s not true. My report says I was a tutor.',bn:'এটা সত্য নয়। আমার রিপোর্টে লেখা আমি টিউটর ছিলাম।'},
     dil:{en:'I won’t share my ID card. It’s private.',bn:'আমি আমার NID শেয়ার করব না। এটা ব্যক্তিগত।'}}}},
  {d:'none',stage:'warm',wide:true,scene:{app:'lock',notifs:[MAIL_NOTIF]},
   say:'A game before the mission: two truths and a lie — about YOUR CV.',bn:'মিশনের আগে একটা খেলা: দুটো সত্য, একটা মিথ্যা — তোমার নিজের CV নিয়ে।',
   card:TWO_TRUTHS},

  /* ---------- FIRST TRY: do what most students do — and judge what comes back ---------- */
  {d:'none',kick:'Mission 1',stage:'try',scene:{app:'lock',notifs:[MAIL_NOTIF]},tap:'n:mail',
   say:'Ayesha has a new email. Tap it.',bn:'আয়েশার একটা নতুন ইমেইল এসেছে। ওটাতে চাপো।'},
  {d:'none',kick:'Mission 1',stage:'try',scene:REJECT,
   say:'Not shortlisted. They want a clear academic CV. Your mission: make one with AI — and get her shortlisted.',bn:'শর্টলিস্টে নাম নেই। তারা একটা পরিষ্কার একাডেমিক CV চায়। তোমার মিশন: AI দিয়ে একটা বানাও — আর তাকে শর্টলিস্টে তোলো।'},
  {d:'des',stage:'try',scene:{app:'home'},tap:'app:sathi',
   say:'Open the AI app. Tap Sathi AI.',bn:'AI অ্যাপটা খোলো। Sathi AI-তে চাপো।',sub:'Sathi AI is like Gemini, ChatGPT or Claude.',subbn:'Sathi AI হলো Gemini, ChatGPT বা Claude-এর মতো।'},
  {d:'des',id:'quick',stage:'try',scene:x=>({app:'sathi',msgs:[],composer:{key:'cvQuick',atts:['cv'],placeholder:'Ask Sathi AI'},kb:{key:'cvQuick',label:'QUICK PROMPTS',chips:QUICK}}),tap:'send',
   say:'In a hurry? Most students type something short. Choose one above the keyboard, then send ➤.',bn:'তাড়া আছে? বেশিরভাগ শিক্ষার্থী ছোট কিছু লেখে। কিবোর্ডের উপর থেকে একটা বেছে নাও, তারপর পাঠাও ➤।',
   compose:{key:'cvQuick',chips:QUICK,best:['q1']}},
  {d:'dis',stage:'try',view:'card',
   say:'Sathi AI is reading that short prompt. Before it answers — what’s your guess?',bn:'Sathi AI ছোট প্রম্পটটা পড়ছে। উত্তর দেওয়ার আগে — তোমার অনুমান কী?',
   pass:()=>true,
   card:x=>({type:'onthree',key:'cvGuess',kind:'guess',pic:'🤔',right:'2',signs:GUESS_SIGNS,
     q:`What will Sathi AI give Ayesha for “${esc(quickText(x))}”?`,qbn:'এই প্রম্পটে Sathi AI আয়েশাকে কী দেবে?'})},
  {d:'dis',id:'send',stage:'try',scene:x=>WEAK_SC(x,true),
   say:x=>x.streaming?'Sathi AI is working…':'Wow. It looks impressive. Would you send this CV?',bn:x=>x.streaming?'Sathi AI কাজ করছে…':'বাহ। দেখতে চমৎকার। তুমি কি এই CV পাঠাবে?',
   ask:{key:'cvSend',options:[
     {en:'🚀 Yes — send it',bn:'হ্যাঁ — পাঠাও',ok:false,then:CQ_CV.sent},
     {en:'🔍 No — check it first',bn:'না — আগে যাচাই করি',ok:1,why:'Smart. A CV that looks finished isn’t always true. Her name is on it — let’s check every line.',whybn:'বুদ্ধিমানের কাজ। দেখতে সম্পূর্ণ মানেই সত্য নয়। এতে তার নাম — চলো প্রতিটি লাইন যাচাই করি।'}]}},
  {d:'dis',stage:'try',view:'card',
   say:'This skill is IELTS Reading. Skim for a map. Pick keywords. Scan one part. Then check.',bn:'এটা IELTS Reading-এর দক্ষতা। মানচিত্রের জন্য স্কিম করো। কীওয়ার্ড বাছো। এক জায়গা স্ক্যান করো। তারপর যাচাই করো।',
   card:ALT_CARD},
  {d:'dis',stage:'try',scene:x=>WEAK_SC(x,false),docs:['cv','ielts','rucei'],
   say:'Now you. Find the 5 things that aren’t true. Tap a line: keywords first, then scan her files.',bn:'এবার তুমি। ৫টা অসত্য কথা খুঁজে বের করো। একটা লাইনে চাপো: আগে কীওয়ার্ড, তারপর তার ফাইল স্ক্যান করো।',
   hunt:{key:'cvHunt1',lines:HUNT1},sub:()=>RELAY(),subbn:()=>RELAYBN()},
  {d:'dis',stage:'try',view:'card',
   say:'You judged what the AI gave you. That gear is Discernment.',bn:'AI যা দিয়েছে, তুমি তা বিচার করেছ। এই গিয়ারের নাম Discernment।',
   card:{type:'level',d:'dis',did:'Is it true? Check it against her real documents before you believe it.',didbn:'এটা কি সত্য? বিশ্বাস করার আগে তার আসল কাগজের সাথে মিলিয়ে দেখো।',
     phrase:{en:'That’s not true. Her CV says ___.',bn:'এটা সত্য নয়। তার CV-তে লেখা ___।'}}},

  /* ---------- PLAN: start again, properly ---------- */
  {d:'del',stage:'plan',view:'card',
   say:'Start again — with a plan. Who should do each job?',bn:'আবার শুরু করো — পরিকল্পনা নিয়ে। কোন কাজ কে করবে?',
   card:{type:'sort',key:'cvJobs',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'},{id:'both',label:'Both'}],items:[
     {en:'🔎 Collect her true facts',bn:'তার সত্যি তথ্য জোগাড় করা',ans:'me',why:'Only Ayesha knows her real life — the AI just showed you that.',whybn:'তার আসল জীবন শুধু আয়েশাই জানে — AI সেটা এইমাত্র দেখিয়ে দিল।',hint:'Did the AI know her real IELTS score?',hintbn:'AI কি তার আসল IELTS স্কোর জানত?'},
     {en:'🗂 Suggest a clean layout',bn:'পরিষ্কার লেআউট প্রস্তাব করা',ans:'ai',why:'A good AI job: low risk, no private facts.',whybn:'AI-এর জন্য ভালো কাজ: ঝুঁকি কম, ব্যক্তিগত তথ্য লাগে না।',hint:'Is a layout risky?',hintbn:'লেআউটে কি ঝুঁকি আছে?'},
     {en:'🎯 Choose what matters most',bn:'কোনটা সবচেয়ে জরুরি তা বাছা',ans:'both',why:'The AI suggests. Ayesha decides.',whybn:'AI প্রস্তাব দেয়। সিদ্ধান্ত আয়েশার।',hint:'Who knows her goal?',hintbn:'তার লক্ষ্য কে জানে?'},
     {en:'✅ Check every line is true',bn:'প্রতিটি লাইন সত্য কি না যাচাই করা',ans:'me',why:'Her name is on the CV.',whybn:'CV-তে তার নাম থাকে।',hint:'Whose name is on the CV?',hintbn:'CV-তে কার নাম থাকে?'}]}},
  {d:'del',stage:'plan',view:'card',
   say:'You shared out the jobs. That gear is Delegation.',bn:'তুমি কাজগুলো ভাগ করেছ। এই গিয়ারের নাম Delegation।',
   card:{type:'level',d:'del',did:'Decide who does each job — you, the AI, or both.',didbn:'ঠিক করো কোন কাজ কে করবে — তুমি, AI, নাকি দুজনে।',
     phrase:{en:'I will check the facts. The AI can do the layout.',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'}}},

  /* ---------- PROMPT ---------- */
  {d:'des',stage:'prompt',view:'card',
   say:'Why did Sathi AI make things up?',bn:'Sathi AI কেন বানিয়ে লিখল?',
   card:{type:'choice',key:'cvWhyAI',pic:'🤖💭',options:[
     {en:'The prompt didn’t give it her facts — or any rules.',bn:'প্রম্পটে তার তথ্য দেওয়া হয়নি — কোনো নিয়মও না।',ok:1,why:'Yes. “Make my CV better” gives the AI nothing to work with — so it fills the gaps with impressive guesses.',whybn:'হ্যাঁ। “আমার CV ভালো করো” AI-কে কিছুই দেয় না — তাই সে ফাঁকগুলো চমৎকার অনুমানে ভরে দেয়।'},
     {en:'Sathi AI is a bad AI.',bn:'Sathi AI একটা খারাপ AI।',ok:0,why:'Every chatbot does this with a short prompt. The problem was the instructions.',whybn:'ছোট প্রম্পট পেলে সব চ্যাটবটই এমন করে। সমস্যা ছিল নির্দেশে।'},
     {en:'Her old CV was too short.',bn:'তার পুরনো CV খুব ছোট ছিল।',ok:0,why:'Her CV had the true facts. The AI was never told to use only them.',whybn:'তার CV-তে সত্যি তথ্য ছিল। AI-কে শুধু ওগুলোই ব্যবহার করতে বলা হয়নি।'}]}},
  {d:'des',stage:'prompt',view:'card',
   say:'A good prompt has four parts. Hers had almost none.',bn:'ভালো প্রম্পটের চারটা অংশ থাকে। তারটায় প্রায় কিছুই ছিল না।',
   card:x=>({type:'html',html:`<div class="card"><p class="mono">“${esc(quickText(x))}”</p><div class="four">
     <span><i>👤</i><b>Context</b><small>Who is she?</small><em>missing</em></span>
     <span><i>📄</i><b>Product</b><small>What to make?</small><em>only “better”</em></span>
     <span><i>🛠</i><b>Process</b><small>How to work?</small><em>missing</em></span>
     <span><i>🧑‍🏫</i><b>Performance</b><small>How to act?</small><em>missing</em></span></div>
     <span class="bn" lang="bn">প্রেক্ষাপট (সে কে?) · পণ্য (কী বানাবে?) · প্রক্রিয়া (কীভাবে কাজ করবে?) · আচরণ (কেমন আচরণ করবে?)</span></div>`})},
  {d:'dil',id:'att',stage:'prompt',scene:{app:'sathi',msgs:[],composer:{text:'',attHit:'att',placeholder:'Ask Sathi AI'}},tap:'att',
   say:'New chat. First, give Sathi AI the right files. Tap +',bn:'নতুন চ্যাট। আগে Sathi AI-কে সঠিক ফাইল দাও। + চাপো।'},
  {d:'dil',id:'pick',stage:'prompt',scene:{app:'picker',files:PICK_FILES,sel:'cvFiles',attachHit:'attach'},tap:'attach',pickShow:['cv','ielts','rucei','shortlist'],
   say:'Choose only the files a CV needs. Then tap Attach.',bn:'শুধু CV-র জন্য দরকারি ফাইলগুলো বাছো। তারপর Attach চাপো।',
   sub:'Does a CV need it? Is it hers to share?',subbn:'CV-র কি এটা লাগবে? এটা কি তার শেয়ার করার জিনিস?',
   feedback:x=>{const c=chosen(x);const bad=c.filter(id=>FILE_WHY[id].ok<0);AFL.firstTry(x,'cvFiles',!bad.length&&['ielts','rucei'].every(id=>c.includes(id)));
     if(bad.length) return null;
     const miss=['ielts','rucei'].filter(id=>!c.includes(id));
     const extra=c.filter(id=>FILE_WHY[id].ok===0);
     return {ok:miss.length?0:1,title:miss.length?'Good — but something is missing':extra.length?'Right files! One tip':'Right files! ✅',
       why:c.map(id=>`<b>${esc(AFL.FILES[id].name)}</b> — ${FILE_WHY[id].en}`).join('<br>')+(miss.length?`<br>➕ The IELTS and RUCEI reports give the AI <b>real facts</b>. Add them next time.`:'')+(!miss.length&&extra.length?`<br>💡 Next time, leave out <b>${extra.map(id=>esc(AFL.FILES[id].name)).join(', ')}</b> — the CV does not need it.`:''),
       whybn:miss.length?'IELTS আর RUCEI রিপোর্ট AI-কে আসল তথ্য দেয়।':'শুধু কাজের জন্য যা দরকার, তা-ই দাও।'}}},
  {d:'dil',stage:'prompt',scene:x=>({app:'sathi',msgs:[],composer:{text:'',atts:safeFiles(x)}}),
   pass:x=>!chosen(x).some(id=>FILE_WHY[id].ok<0),
   cq:x=>chosen(x).some(id=>FILE_WHY[id].ok<0)?Object.assign({},CQ_CV.files,filesLine(x),{rewind:x=>{x.set('cvFiles',chosen(x).filter(id=>FILE_WHY[id].ok>=0));AFL.goId('pick')}}):null,
   say:'Ayesha took out the private files.',bn:'আয়েশা ব্যক্তিগত ফাইলগুলো সরিয়ে দিয়েছে।'},
  {d:'dil',stage:'prompt',only:'together',view:'card',
   say:'Game: worst case. How bad could it get?',bn:'খেলা: সবচেয়ে খারাপ কী। কতটা খারাপ হতে পারত?',
   card:WORST},
  {d:'des',id:'parts',stage:'prompt',view:'card',
   say:'A good prompt has four parts — like asking a tailor for a blouse. Tap Next to see each one.',bn:'একটা ভালো প্রম্পটের চারটা অংশ থাকে — দর্জিকে ব্লাউজ বানাতে বলার মতো। প্রতিটা দেখতে Next চাপো।',
   card:x=>({type:'html',html:ppAnim(x)})},
  {d:'des',id:'prompt',stage:'prompt',pairwork:true,scene:x=>({app:'sathi',msgs:[],composer:{key:'cvPrompt',atts:safeFiles(x),placeholder:'Ask Sathi AI'},kb:{key:'cvPrompt',label:'PROMPT PARTS',chips:PROMPT_CHIPS,ai:'sathi',guidedParts:true,revision:2}}),tap:'send',
   say:'Build all four parts of the prompt, one at a time. Then read your prompt and tap Send.',bn:'এক এক করে প্রম্পটের চারটা অংশ বানাও। তারপর তোমার প্রম্পট পড়ে Send চাপো।',
   pairhelp:()=>say({solo:'',pair:'Choose who is Student A and Student B. Student A: read and place one tile. Student B: read and place the next. Keep taking turns.',class:'With the person next to you: choose Student A and Student B. Read and place one tile each. Keep taking turns.'}),
   pairhelpbn:()=>say({solo:'',pair:'কে শিক্ষার্থী A আর কে B ঠিক করো। শিক্ষার্থী A: একটি টুকরো পড়ে বসাও। শিক্ষার্থী B: পরের টুকরো পড়ে বসাও। এভাবে পালা করে করো।',class:'পাশের জনের সাথে: কে শিক্ষার্থী A আর কে B ঠিক করো। একটি করে টুকরো পড়ে বসাও। এভাবে পালা করে করো।'}),
   sub:()=>`<button class="pp-re" type="button" data-pp="goid" data-id="parts">↺ ${tr('Review the 4 parts','চারটি অংশ আবার দেখো')}</button>`,
   feedback:x=>promptCheck(x),
   compose:{key:'cvPrompt',slots:SLOTS,chips:PROMPT_CHIPS,best:['c1','c2','c3a','c3b','c4']}},
  {d:'des',stage:'prompt',scene:x=>CHAT_SC(x,1),
   cq:x=>shortcut(PROMPT_CHIPS,'cvPrompt',x).length?Object.assign({},CQ_CV.prompt,{rewind:x=>{AFL.unsay(x,'cvPrompt',shortcut(PROMPT_CHIPS,'cvPrompt',x).map(c=>c.text));AFL.goId('prompt')}}):null,
   say:x=>x.streaming?'Sathi AI is reading your files…':'This time Sathi AI asks before it produces anything — because your prompt told it to.',bn:x=>x.streaming?'Sathi AI তোমার ফাইল পড়ছে…':'এবার Sathi AI লেখার আগে প্রশ্ন করছে — কারণ তোমার প্রম্পট তাকে বলেছে।'},
  {d:'des',id:'answers',stage:'prompt',scene:x=>Object.assign(CHAT_SC(x,1),{composer:{key:'cvAns',placeholder:'Reply to Sathi AI'},kb:{key:'cvAns',label:'ANSWERS',labelbn:'উত্তর',chips:ANS_CHIPS}}),tap:'send',
   docs:['bigd','cv'],
   say:'Answer Sathi AI’s three questions — truthfully. Her files can help.',bn:'Sathi AI-এর তিনটা প্রশ্নের উত্তর দাও — সত্যি করে। তার ফাইল সাহায্য করবে।',
   compose:{key:'cvAns',chips:ANS_CHIPS,best:['a1','a2','a3'],slots:[
     {label:'Graduation',labelbn:'স্নাতক শেষ',test:[/20\d\d|graduat/i]},
     {label:'Term paper',labelbn:'টার্ম পেপার',test:[/coursework|not published/i]},
     {label:'Contact details',labelbn:'যোগাযোগের তথ্য',test:[/placeholder|myself/i]}]}},
  {d:'des',stage:'prompt',view:'card',
   pass:x=>shortcut(ANS_CHIPS,'cvAns',x).length>0,
   say:'You told the AI clearly what you want. That gear is Description.',bn:'তুমি AI-কে স্পষ্ট করে বলেছ কী চাও। এই গিয়ারের নাম Description।',
   card:{type:'level',d:'des',did:'Context, product, process, performance — and truthful answers.',didbn:'প্রেক্ষাপট, ফলাফল, প্রক্রিয়া, আচরণ — আর সত্যি উত্তর।',
     phrase:{en:'Use only my files. If something is missing, ask me.',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'}}},

  /* ---------- CHECK: better — but not perfect ---------- */
  {d:'dis',stage:'check',
   cq:x=>shortcut(ANS_CHIPS,'cvAns',x).length?Object.assign({},CQ_CV.answer,{rewind:x=>{AFL.unsay(x,'cvAns',shortcut(ANS_CHIPS,'cvAns',x).map(c=>c.text));AFL.goId('answers')}}):null,
   scene:x=>CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}),docs:['cv','ielts','rucei','shortlist'],
   say:x=>x.streaming?'Sathi AI is producing a draft…':'Much better! But a good prompt doesn’t stop every mistake. Find the 3 problems.',bn:x=>x.streaming?'Sathi AI খসড়া তৈরি করছে…':'অনেক ভালো! কিন্তু ভালো প্রম্পটও সব ভুল থামায় না। ৩টা সমস্যা খুঁজে বের করো।',
   hunt:{key:'cvHunt2',lines:LINES},sub:()=>RELAY(),subbn:()=>RELAYBN()},

  /* ---------- FIX ---------- */
  {d:'des',id:'fixes',stage:'fix',scene:x=>Object.assign(CHAT_SC(x,3),{composer:{key:'cvFix',placeholder:'Reply to Sathi AI'},kb:{key:'cvFix',revision:2,label:'FIXES',labelbn:'সংশোধন',chips:FIX_CHIPS,ai:'sathi'}}),tap:'send',
   docs:['cv','ielts','rucei','shortlist'],
   say:'Tell Sathi AI exactly what to fix. Careful — the same words can say the opposite.',bn:'Sathi AI-কে ঠিক কী ঠিক করতে হবে, স্পষ্ট করে বলো। সাবধান — একই শব্দে উল্টো কথাও বলা যায়।',
   sub:()=>TILES(),subbn:()=>TILESBN(),
   compose:{key:'cvFix',chips:FIX_CHIPS,best:['f1','f2','f3'],slots:[
     {label:'Her role',labelbn:'তার ভূমিকা',test:[/volunteer tutor/i]},
     {label:'Software',labelbn:'সফটওয়্যার',test:[/basic/i]},
     {label:'Membership',labelbn:'সদস্যপদ',test:[/remove|not a member/i]}]}},
  {d:'des',stage:'fix',scene:x=>CHAT_SC(x,5,{scrollTo:'[data-mid="fixed"]'}),
   cq:x=>shortcut(FIX_CHIPS,'cvFix',x).length?Object.assign({},CQ_CV.fix,{rewind:x=>{AFL.unsay(x,'cvFix',shortcut(FIX_CHIPS,'cvFix',x).map(c=>c.text));AFL.goId('fixes')}}):null,
   say:x=>x.streaming?'Sathi AI is fixing it…':'Fixed. And Sathi AI said sorry for the made-up line. Prompt, check, fix — and check again.',bn:x=>x.streaming?'Sathi AI ঠিক করছে…':'ঠিক হয়েছে। আর বানানো লাইনের জন্য Sathi AI দুঃখ প্রকাশ করেছে। প্রম্পট, যাচাই, সংশোধন — আবার যাচাই।'},

  /* ---------- FINISH ---------- */
  {d:'dil',stage:'finish',scene:x=>CHAT_SC(x,5),tap:'export',
   say:'Put the CV into a document. Tap ⋮ under the answer.',bn:'CV-টা ডকুমেন্টে নাও। উত্তরের নিচে ⋮ চাপো।'},
  {d:'dil',stage:'finish',scene:x=>Object.assign(CHAT_SC(x,5),{sheet:{html:`<h3>Share &amp; export</h3><button class="li" data-hit="todocs"><span class="av" style="background:#1A4CA8">${AFL.ico('doc')}</span><span><b>Export to Docs</b><p>Make an editable document</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('copy')}</span><span><b>Copy</b><p>Copy the text</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('share')}</span><span><b>Share link</b><p>Anyone with the link can see this chat</p></span></button>`}}),tap:'todocs',
   say:'Choose “Export to Docs”.',bn:'“Export to Docs” বেছে নাও।'},
  {d:'dil',stage:'finish',scene:x=>({app:'gdoc',page:fillCV(x)}),
   done:filled,
   showMe:(x,h)=>{const go=k=>{const el=document.querySelector(`[data-ui="fill:${k}"]`);h.ghostTo(el,()=>{const f=x.get('cvFill',{});f[k]=1;x.set('cvFill',f);h.render();if(k==='phone')setTimeout(()=>go('email'),200)})};go('phone')},
   onUi:(x,kind,arg)=>{if(kind==='fill'){const f=x.get('cvFill',{});f[arg]=1;x.set('cvFill',f);AFL.renderPhone();AFL.renderUI();}},
   say:x=>filled(x)?'Done. Her phone and email never went into the AI chat.':'Add her phone and email yourself. Tap the yellow boxes.',bn:x=>filled(x)?'হয়ে গেছে। তার ফোন আর ইমেইল কখনো AI চ্যাটে যায়নি।':'ফোন নম্বর আর ইমেইল তুমি নিজে যোগ করো। হলুদ বাক্সগুলোতে চাপো।'},
  {d:'dil',stage:'finish',view:'card',scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Before she sends it: four checks. Tap each one when it’s true.',bn:'পাঠানোর আগে: চারটা যাচাই। সত্যি হলে প্রতিটিতে চাপো।',
   card:{type:'checklist',key:'cvDil',items:[
     {en:'✅ Every line is true.',bn:'প্রতিটি লাইন সত্য।'},
     {en:'🗣 I can explain every line in an interview.',bn:'ইন্টারভিউতে প্রতিটি লাইন ব্যাখ্যা করতে পারব।'},
     {en:'🔒 I added my private details myself.',bn:'ব্যক্তিগত তথ্য আমি নিজে যোগ করেছি।'},
     {en:'📜 I know the programme’s rules on AI.',bn:'প্রোগ্রামের AI-সংক্রান্ত নিয়ম জানি।'}]}},
  {d:'dil',stage:'finish',view:'card',
   say:'You took responsibility for what goes out with your name. That gear is Diligence.',bn:'তোমার নামে যা যাবে, তার দায়িত্ব তুমি নিয়েছ। এই গিয়ারের নাম Diligence।',
   card:{type:'level',d:'dil',did:'Her name is on it, so she is responsible: true lines, private details kept private.',didbn:'এতে তার নাম, তাই দায়িত্ব তার: সত্যি লাইন, ব্যক্তিগত তথ্য গোপন।',
     phrase:{en:'I’m responsible for my CV.',bn:'আমার CV-র দায়িত্ব আমার।'}}},
  {stage:'finish',view:'card',
   say:'The interview. Can you answer every question — honestly?',bn:'ইন্টারভিউ। প্রতিটা প্রশ্নের উত্তর দিতে পারবে — সৎভাবে?',
   card:INTERVIEW},
  {stage:'finish',view:'card',
   say:'Now you. Write a real prompt for YOUR CV — and take it home.',bn:'এবার তুমি। তোমার নিজের CV-র জন্য একটা আসল প্রম্পট লেখো — আর বাড়ি নিয়ে যাও।',
   card:MY_CV},
  {d:'none',kick:'Mission 1 · complete',stage:'finish',view:'card',
   say:'She sent her honest CV. And a week later… Mission complete!',bn:'সে তার সৎ CV পাঠিয়েছে। আর এক সপ্তাহ পরে… মিশন সম্পূর্ণ!',
   card:{type:'result',next:['agent','build'],
     callback:{en:'Two truths and a lie: today the AI told Ayesha five made-up things. Which one was the hardest to catch — and why?',bn:'দুটো সত্য, একটা মিথ্যা: আজ AI আয়েশাকে পাঁচটা বানানো কথা বলেছে। কোনটা ধরা সবচেয়ে কঠিন ছিল — আর কেন?'},
     html:`<div class="verdict"><div class="vh">📧 Internship Desk · Interview invitation</div><div class="vb"><p>Dear Ayesha,</p><p>Thank you for your new CV. It shows your research and volunteer work clearly. <b>You are shortlisted</b> — we would like to interview you on Thursday.</p><p>Best wishes,<br>Internship Desk</p></div></div>`,
     say:{
       del:{en:'I will check the facts. The AI can do the layout.',bn:'তথ্য আমি যাচাই করব। লেআউট AI করতে পারে।'},
       des:{en:'Use only my files. If something is missing, ask me.',bn:'শুধু আমার ফাইল ব্যবহার করো। কিছু না থাকলে আমাকে জিজ্ঞেস করো।'},
       dis:{en:'That’s not true. My report says I was a tutor.',bn:'এটা সত্য নয়। আমার রিপোর্টে লেখা আমি টিউটর ছিলাম।'},
       dil:{en:'I won’t share my ID card. It’s private.',bn:'আমি আমার NID শেয়ার করব না। এটা ব্যক্তিগত।'}}}}
 ]
});
})();
