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
 {id:'l1',text:'CGPA 3.58 / 4.00 (up to second year)',v:'ok',src:'Her old CV',quote:'“CGPA: 3.58/4.00 up to second year, 60 credit hours completed”',why:'Same number, same limit (“up to second year”).',whybn:'একই সংখ্যা, একই সীমা।'},
 {id:'l2',text:'Term paper … (2025, coursework)',v:'ok',src:'Her old CV',quote:'“Term Paper … Prepared as Development Economics coursework.”',why:'It says term paper and coursework — not “published”. Honest.',whybn:'এটা টার্ম পেপার আর কোর্সওয়ার্ক — “প্রকাশিত” নয়। সৎ।'},
 {id:'l3',text:'Student research poster … (2025)',v:'ok',src:'Her old CV',quote:'“Student Research Poster: Youth Unemployment and Skills Development in Bangladesh (2025) — Economics Study Circle Student Research Forum”',why:'Matches her CV.',whybn:'তার CV-র সাথে মেলে।'},
 {id:'l4',text:'Led the Book Support project, which raised attendance from 68% to 86%',v:'chg',src:'RUCEI project report',quote:'Role: “Volunteer Tutor &amp; Organizing Team Member”. Attendance 68% → 86% is a result of the whole project.',why:'She was a tutor and team member, not the leader. The attendance result belongs to the whole team.',whybn:'সে টিউটর ও দলের সদস্য ছিল, নেতা নয়। উপস্থিতির ফল পুরো দলের।'},
 {id:'l5',text:'Helped distribute 186 books to 62 students across 48 sessions',v:'ok',src:'RUCEI project report',quote:'Books distributed: 186 · Students enrolled: 62 · Tutoring sessions: 48 (15 Jan – 30 Apr 2025)',why:'The numbers match, and “helped” shows her real role.',whybn:'সংখ্যা মেলে, আর “helped” তার আসল ভূমিকা দেখায়।'},
 {id:'l6',text:'IELTS mock: overall 6.0 — L 6.5, R 6.5, W 5.5, S 5.5',v:'ok',src:'IELTS mock report',quote:'Listening 6.5 · Reading 6.5 · Writing 5.5 · Speaking 5.5 · Overall 6.0 (test date 24 May 2025)',why:'Exactly the report. It also says “mock” — honest.',whybn:'রিপোর্টের সাথে হুবহু মেলে। “mock” কথাটাও আছে — সৎ।'},
 {id:'l7',text:'Excel, SPSS and Stata (advanced)',v:'chg',src:'Her old CV',quote:'“Software: MS Word, PowerPoint, Excel, Google Workspace, basic SPSS, basic Stata”',why:'Her CV says basic. “Advanced” changes the meaning — an interviewer could test it.',whybn:'তার CV-তে লেখা basic। “Advanced” অর্থ বদলে দেয় — ইন্টারভিউতে পরীক্ষা করতে পারে।'},
 {id:'l8',text:'Student member, Bangladesh Economic Association',v:'none',src:'All four files',quote:'No file mentions this association.',why:'The AI invented it. Even a good prompt can’t stop every invention — that’s why you check.',whybn:'AI এটা বানিয়েছে। ভালো প্রম্পটও সব বানানো কথা থামাতে পারে না — তাই যাচাই করতে হয়।'}
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

AFL.lesson({
 id:'cv', title:'An honest CV with AI', kicker:'Workflow 1 · Writing', emoji:'📄', tint:'#D7E3FF', time:'35–40 min',
 blurb:'Turn real documents into a CV — then catch what the AI made up.',
 blurbbn:'আসল কাগজপত্র থেকে CV বানাও — তারপর AI যা বানিয়ে লিখেছে তা ধরো।',
 notif:{app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'start:cv'},
 stages:[{id:'plan',label:'Plan',d:'del'},{id:'prompt',label:'Prompt',d:'des'},{id:'check',label:'Check',d:'dis'},{id:'fix',label:'Fix',d:'des'},{id:'finish',label:'Finish',d:'dil'}],
 beats:[
  {stage:'plan',open:true,scene:{app:'lock',notifs:[{app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'n:mail'}]},
   say:'Meet Ayesha. Today you help her make an honest CV with AI.',bn:'আয়েশার সাথে পরিচয় করো। আজ তুমি AI দিয়ে তার একটা সৎ CV বানাতে সাহায্য করবে।',
   card:{type:'info',html:`<div class="who"><span class="av">A</span><div><b>Ayesha Rahman</b><span>3rd-year Economics · Rajshahi University</span></div></div><div class="facts"><span>CGPA 3.58</span><span>IELTS mock 6.0</span><span>Volunteer tutor</span></div>`,
     points:[{i:'🎯',en:'<b>Her goal:</b> a fully funded master’s in Development Economics.',bn:'তার লক্ষ্য: ডেভেলপমেন্ট ইকোনমিক্সে সম্পূর্ণ ফান্ডেড মাস্টার্স।'},{i:'📄',en:'<b>You will make:</b> a 2-page academic CV — every line true.',bn:'তুমি বানাবে: ২ পাতার একাডেমিক CV — প্রতিটি লাইন সত্য।'},{i:'🧭',en:'<b>Five steps:</b> Plan · Prompt · Check · Fix · Finish',bn:'পাঁচ ধাপ: পরিকল্পনা · প্রম্পট · যাচাই · সংশোধন · শেষ'}]}},
  {stage:'plan',scene:{app:'lock',notifs:[{app:'mail',title:'Research Intern — application update',text:'Dear Ayesha, thank you for applying. After careful review…',time:'9:12',hit:'n:mail'}]},tap:'n:mail',
   say:'Ayesha has a new email. Tap it.',bn:'আয়েশার একটা নতুন ইমেইল এসেছে। ওটাতে চাপো।'},
  {stage:'plan',scene:{app:'mail',view:'read',mail:{from:'Internship Desk',color:'#00639B',subject:'Research Intern — application update',time:'9:12 AM',
     body:`<p>Dear Ayesha,</p><p>Thank you for applying for the Research Assistant Intern position. We received many strong applications, and we are not able to shortlist you this time.</p><p>Most shortlisted applicants sent a short <b>academic CV</b> that showed their research skills clearly. We encourage you to apply again.</p><p>Best wishes,<br>Internship Desk</p>`}},
   say:'Not shortlisted. What should she do next time?',bn:'শর্টলিস্টে নাম নেই। পরের বার সে কী করবে?',
   card:{type:'choice',key:'cvWhy',options:[
     {en:'Send a clear academic CV with her real skills.',bn:'নিজের আসল দক্ষতা দিয়ে একটা পরিষ্কার একাডেমিক CV পাঠানো।',ok:1,why:'Yes — the email says shortlisted students had a clear academic CV.',whybn:'হ্যাঁ — ইমেইলে বলা আছে, শর্টলিস্টে থাকা শিক্ষার্থীদের পরিষ্কার একাডেমিক CV ছিল।'},
     {en:'Make bigger claims so she looks stronger.',bn:'বড় বড় দাবি লিখে নিজেকে শক্তিশালী দেখানো।',ok:0,why:'Claims that aren’t true fall apart in an interview — and can end an application.',whybn:'মিথ্যা দাবি ইন্টারভিউতে ধরা পড়ে — আবেদনও বাতিল হতে পারে।'},
     {en:'Stop applying for a while.',bn:'কিছুদিন আবেদন করা বন্ধ রাখা।',ok:0,why:'The email invites her to apply again. The CV is the problem to fix.',whybn:'ইমেইলে আবার আবেদন করতে বলেছে। CV-টাই ঠিক করতে হবে।'}]}},
  {stage:'plan',open:true,scene:{app:'home'},
   say:'Plan first. Who should do each job?',bn:'আগে পরিকল্পনা। কোন কাজ কে করবে?',sub:'Tap a button for each job.',subbn:'প্রতিটি কাজের জন্য একটা বোতাম চাপো।',
   card:{type:'sort',key:'cvJobs',bins:[{id:'me',label:'Ayesha'},{id:'ai',label:'AI'},{id:'both',label:'Both'}],items:[
     {en:'Collect her true facts — dates, scores, roles',bn:'তার সত্যি তথ্য জোগাড় করা — তারিখ, স্কোর, ভূমিকা',ans:'me',why:'Only Ayesha knows what really happened. The AI can’t know her life.',whybn:'আসলে কী হয়েছে তা শুধু আয়েশা জানে। AI তার জীবন জানে না।',hint:'Can the AI know her real scores and roles without her?',hintbn:'আয়েশা না বললে AI কি তার আসল স্কোর জানতে পারে?'},
     {en:'Suggest a clean layout and headings',bn:'পরিষ্কার লেআউট আর শিরোনাম প্রস্তাব করা',ans:'ai',why:'A good AI job: it has seen many CVs, and a layout is low-risk.',whybn:'AI-এর জন্য ভালো কাজ: অনেক CV দেখেছে, আর লেআউটে ঝুঁকি কম।',hint:'Is a layout risky? Does it need her private facts?',hintbn:'লেআউটে কি ঝুঁকি আছে? এতে কি তার ব্যক্তিগত তথ্য লাগে?'},
     {en:'Choose what matters most for her master’s goal',bn:'মাস্টার্সের লক্ষ্যের জন্য কোনটা সবচেয়ে জরুরি তা বাছাই করা',ans:'both',why:'The AI can suggest; Ayesha decides. It’s her goal and her story.',whybn:'AI প্রস্তাব দিতে পারে; সিদ্ধান্ত আয়েশার। লক্ষ্য আর গল্প তারই।',hint:'Who knows CVs? Who knows her goal? Maybe both.',hintbn:'CV কে চেনে? তার লক্ষ্য কে জানে? হয়তো দুজনেই।'},
     {en:'Check every line is true before she sends it',bn:'পাঠানোর আগে প্রতিটি লাইন সত্য কি না যাচাই করা',ans:'me',why:'The CV carries her name. She is responsible — not the AI.',whybn:'CV-তে তার নাম থাকে। দায়িত্ব তার — AI-এর নয়।',hint:'Whose name is on the CV?',hintbn:'CV-তে কার নাম থাকে?'}]}},
  {stage:'prompt',scene:{app:'home'},tap:'app:sathi',
   say:'Open the AI app. Tap Sathi.',bn:'AI অ্যাপটা খোলো। Sathi-তে চাপো।',sub:'Sathi works like Gemini, ChatGPT or Claude.',subbn:'Sathi চলে Gemini, ChatGPT বা Claude-এর মতো।'},
  {stage:'prompt',scene:{app:'sathi',msgs:[],composer:{text:ASK_FIRST,atts:['cv']}},tap:'send',
   say:'Most students type something short, like this. Try it — tap send.',bn:'বেশিরভাগ শিক্ষার্থী এভাবে ছোট করে লেখে। চেষ্টা করো — send চাপো।'},
  {stage:'prompt',scene:{app:'sathi',msgs:[{role:'u',text:ASK_FIRST,atts:['cv']},{role:'a',html:WEAK,stream:true,id:'weak'}],composer:{text:''}},
   afterRender:(x,scr)=>{ if(!document.querySelector('[data-stream]')) scr.querySelectorAll('.flag').forEach(f=>f.classList.add('ln','v-bad')); },
   say:x=>document.querySelector('[data-stream]')?'Sathi is answering…':'It looks impressive. But is it true?',bn:'দেখতে চমৎকার। কিন্তু এটা কি সত্য?',
   card:x=>({type:'html',html:`<div class="card"><h3>AI wrote vs. her documents${x.bn?'<span class="bn" lang="bn">AI যা লিখেছে বনাম তার কাগজপত্র</span>':''}</h3>
     <table style="width:100%;border-collapse:collapse;font-size:14px">${[['IELTS 7.0','IELTS mock: <b>6.0</b>'],['Led a team of 20 volunteers','<b>Volunteer tutor</b> in a team'],['Fluent English','English: <b>intermediate</b>'],['Published research','A <b>term paper</b> for a course']].map(r=>`<tr><td style="padding:6px;border-top:1px solid var(--rule);color:var(--clay-ink)">✗ ${r[0]}</td><td style="padding:6px;border-top:1px solid var(--rule)">${r[1]}</td></tr>`).join('')}</table>
     <div class="note">The prompt was short, so the AI filled the gaps with guesses — and made them sound good.<span class="bn" lang="bn">প্রম্পট ছোট ছিল, তাই AI ফাঁকগুলো অনুমান দিয়ে ভরেছে — আর সুন্দর করে লিখেছে।</span></div></div>`})},
  {stage:'prompt',open:true,scene:x=>({app:'sathi',msgs:[{role:'u',text:ASK_FIRST,atts:['cv']},{role:'a',html:WEAK}],composer:{text:''}}),
   say:'The short prompt left out four things.',bn:'ছোট প্রম্পটে চারটা জিনিস বাদ পড়েছে।',
   card:{type:'info',title:'A good prompt has four parts',titlebn:'ভালো প্রম্পটের চারটা অংশ',html:`<p style="font-family:var(--md-mono);background:var(--mist);padding:8px;border-radius:8px;font-size:13.5px">“make my cv better for scholarship”</p>`,
     points:[{i:'👤',en:'<b>Context</b> — who she is and her goal. <i>Missing.</i>',bn:'প্রেক্ষাপট — সে কে, তার লক্ষ্য কী। নেই।'},{i:'📄',en:'<b>Product</b> — what to make. <i>Only “better”.</i>',bn:'পণ্য — কী বানাতে হবে। শুধু “better”।'},{i:'🛠',en:'<b>Process</b> — how to work: use only her facts, ask first. <i>Missing.</i>',bn:'প্রক্রিয়া — কীভাবে কাজ করবে: শুধু তার তথ্য, আগে জিজ্ঞেস। নেই।'},{i:'🧑‍🏫',en:'<b>Performance</b> — how the AI should act: an honest editor. <i>Missing.</i>',bn:'আচরণ — AI কেমন হবে: একজন সৎ সম্পাদক। নেই।'}]}},
  {stage:'prompt',d:'dil',scene:{app:'sathi',msgs:[],composer:{text:'',attHit:'att',placeholder:'Ask Sathi'}},tap:'att',
   say:'New chat. First, give Sathi the right files. Tap +',bn:'নতুন চ্যাট। আগে Sathi-কে সঠিক ফাইল দাও। + চাপো।'},
  {stage:'prompt',d:'dil',scene:{app:'picker',files:PICK_FILES,sel:'cvFiles',attachHit:'attach'},tap:'attach',pickShow:['cv','ielts','rucei','shortlist'],
   say:'Choose only the files a CV needs.',bn:'শুধু CV-র জন্য দরকারি ফাইলগুলো বাছো।',
   sub:'Ask: Does the CV need it? Is it mine to share?',subbn:'নিজেকে জিজ্ঞেস করো: CV-র কি এটা লাগবে? এটা কি আমার শেয়ার করার জিনিস?',
   card:x=>{const c=chosen(x);if(!c.length) return {type:'html',html:`<div class="note">Tap a file to select it. Tap again to remove it. Then tap <b>Attach</b>.<span class="bn" lang="bn">ফাইল বাছতে চাপো, বাদ দিতে আবার চাপো। তারপর Attach চাপো।</span></div>`};
     return {type:'html',html:`<div class="card" style="padding:10px">${c.map(id=>{const w=FILE_WHY[id];return `<div class="${w.ok>0?'good':w.ok===0?'note':'warn'}" style="margin-top:6px"><b>${esc(AFL.FILES[id].name)}</b> — ${w.en}<span class="bn" lang="bn">${w.bn}</span></div>`}).join('')}</div>`}}},
  {stage:'prompt',d:'dil',scene:x=>({app:'sathi',msgs:[],composer:{text:'',atts:safeFiles(x)}}),
   say:x=>chosen(x).some(id=>FILE_WHY[id].ok<0)?'Ayesha took out the private files.':'Good choice of files.',bn:x=>chosen(x).some(id=>FILE_WHY[id].ok<0)?'আয়েশা ব্যক্তিগত ফাইলগুলো সরিয়ে দিয়েছে।':'ফাইল বাছাই ভালো হয়েছে।',
   card:x=>{const bad=chosen(x).filter(id=>FILE_WHY[id].ok<0);const miss=['ielts','rucei'].filter(id=>!chosen(x).includes(id));
     return {type:'info',points:[...bad.map(id=>({i:'🚫',en:`<b>${esc(AFL.FILES[id].name)}</b> — removed. ${FILE_WHY[id].en}`,bn:FILE_WHY[id].bn})),
      ...(miss.length?[{i:'➕',en:'The IELTS report and RUCEI report give the AI <b>real facts</b>. Without them it guesses.',bn:'IELTS আর RUCEI রিপোর্ট AI-কে আসল তথ্য দেয়। এগুলো ছাড়া সে অনুমান করে।'}]:[]),
      {i:'🔐',en:'<b>Rule:</b> share only what the job needs, and only what is yours to share.',bn:'নিয়ম: শুধু কাজের জন্য যা দরকার, আর যা তোমার শেয়ার করার অধিকার আছে — শুধু তা-ই দাও।'}]}}},
  {stage:'prompt',scene:x=>({app:'sathi',msgs:[],composer:{key:'cvPrompt',atts:safeFiles(x),placeholder:'Ask Sathi'},kb:{key:'cvPrompt',label:'PROMPT PARTS',chips:PROMPT_CHIPS}}),tap:'send',
   say:'Now build a better prompt. Tap the parts above the keyboard.',bn:'এবার একটা ভালো প্রম্পট বানাও। কিবোর্ডের উপরের অংশগুলো চাপো।',sub:'You can type your own words too.',subbn:'নিজের ভাষায় টাইপও করতে পারো।',
   compose:{key:'cvPrompt',title:'Prompt recipe',titlebn:'প্রম্পটের রেসিপি',slots:SLOTS,chips:PROMPT_CHIPS,best:['c1','c2','c3','c4'],ready:'All four parts are there. Tap send ➤ on the phone.',readybn:'চারটা অংশই আছে। ফোনে send ➤ চাপো।'}},
  {stage:'prompt',scene:x=>CHAT_SC(x,1),
   say:'This time Sathi asks first — because your prompt told it to.',bn:'এবার Sathi আগে প্রশ্ন করছে — কারণ তোমার প্রম্পট তাকে বলেছে।',
   card:{type:'html',html:`<div class="good">Asking before guessing is good AI behaviour. Your <b>Process</b> part (“If something is missing, ask me first”) made it happen.<span class="bn" lang="bn">অনুমান না করে প্রশ্ন করা — এটা ভালো আচরণ। তোমার Process অংশ এটা ঘটিয়েছে।</span></div>
     <div class="note">Where can you find her graduation year? Her internship form says <b>Expected graduation: 2026</b>.<span class="bn" lang="bn">তার স্নাতক শেষের বছর কোথায় পাবে? ইন্টার্নশিপ ফর্মে লেখা: ২০২৬।</span></div>`}},
  {stage:'prompt',scene:x=>Object.assign(CHAT_SC(x,1),{composer:{key:'cvAns',placeholder:'Reply to Sathi'},kb:{key:'cvAns',label:'ANSWERS',chips:ANS_CHIPS}}),tap:'send',
   say:'Answer Sathi’s three questions — truthfully.',bn:'Sathi-এর তিনটা প্রশ্নের উত্তর দাও — সত্যি করে।',
   compose:{key:'cvAns',title:'Answer all three',titlebn:'তিনটারই উত্তর দাও',chips:ANS_CHIPS,best:['a1','a2','a3'],slots:[
     {label:'1 · Graduation',frame:'<em>I expect to graduate in</em> ___.',bn:'আমি ___ সালে স্নাতক শেষ করব বলে আশা করছি।',test:[/20\d\d|graduat/i]},
     {label:'2 · Term paper',frame:'<em>It was</em> ___<em>. It was not</em> ___.',bn:'এটা ছিল ___। এটা ___ ছিল না।',test:[/coursework|not published/i]},
     {label:'3 · Contact details',frame:'<em>I will add</em> ___ <em>myself.</em>',bn:'আমি নিজে ___ যোগ করব।',test:[/placeholder|myself/i]}]}},
  {stage:'check',scene:x=>CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}),
   say:x=>document.querySelector('[data-stream]')?'Sathi is writing the draft…':'A draft! It looks good. Now check it.',bn:'একটা খসড়া! দেখতে ভালো। এবার যাচাই করো।',
   sub:'Even good prompts don’t stop every mistake.',subbn:'ভালো প্রম্পটও সব ভুল থামাতে পারে না।'},
  {stage:'check',scene:x=>{const v=x.get('cvVerd',{}),sel=x.get('cvVerd_sel');return Object.assign(CHAT_SC(x,3,{scrollTo:'[data-mid="draft"]'}),{_v:v,_s:sel})},
   afterRender:(x,scr)=>{const v=x.get('cvVerd',{}),sel=x.get('cvVerd_sel');scr.querySelectorAll('.ln[data-ui]').forEach(el=>{const id=el.dataset.ui.slice(5);const l=LINES.find(z=>z.id===id);if(v[id])el.classList.add(l.v==='ok'?'v-ok':'v-bad');if(sel===id)el.classList.add('sel')});const s=scr.querySelector('.ln.sel');if(s)s.scrollIntoView({block:'center'})},
   say:'Check each line against her files.',bn:'প্রতিটি লাইন তার ফাইলের সাথে মিলিয়ে দেখো।',
   check:{key:'cvVerd',lines:LINES,prompt:'Tap an underlined line in Sathi’s answer.',promptbn:'Sathi-এর উত্তরে দাগ দেওয়া একটা লাইনে চাপো।',done:'All 8 checked. Three lines need fixing: 4, 7 and 8.',donebn:'৮টাই যাচাই হয়েছে। ৪, ৭ আর ৮ নম্বর লাইন ঠিক করতে হবে।'}},
  {stage:'fix',scene:x=>Object.assign(CHAT_SC(x,3),{composer:{key:'cvFix',placeholder:'Reply to Sathi'},kb:{key:'cvFix',label:'FIXES',chips:FIX_CHIPS}}),tap:'send',
   say:'Tell Sathi exactly what to fix.',bn:'Sathi-কে ঠিক কী ঠিক করতে হবে, স্পষ্ট করে বলো।',
   compose:{key:'cvFix',title:'Fix three lines',titlebn:'তিনটা লাইন ঠিক করো',chips:FIX_CHIPS,best:['f1','f2','f3'],ready:'Clear and exact. Send it.',readybn:'স্পষ্ট আর সুনির্দিষ্ট। পাঠাও।',slots:[
     {label:'Line 4 · her role',frame:'<em>I was a</em> ___. <em>I did not</em> ___.',bn:'আমি ছিলাম ___। আমি ___ করিনি।',test:[/did not lead|didn'?t lead|not the leader|team member/i]},
     {label:'Line 7 · software',frame:'<em>My</em> ___ <em>is basic, not advanced.</em>',bn:'আমার ___ বেসিক, অ্যাডভান্সড নয়।',test:[/basic/i]},
     {label:'Line 8 · membership',frame:'<em>Remove the</em> ___ <em>line. I am not</em> ___.',bn:'___ লাইনটা মুছে দাও। আমি ___ নই।',test:[/remove|not a member/i]}]}},
  {stage:'fix',scene:x=>CHAT_SC(x,5,{scrollTo:'[data-mid="fixed"]'}),
   say:'Fixed. Notice: Sathi said sorry for the invented line.',bn:'ঠিক হয়েছে। খেয়াল করো: বানানো লাইনের জন্য Sathi দুঃখ প্রকাশ করেছে।',
   card:{type:'html',html:`<div class="note">This is the loop: <b>prompt → check → fix → check again.</b><span class="bn" lang="bn">এটাই চক্র: প্রম্পট → যাচাই → সংশোধন → আবার যাচাই।</span></div>`}},
  {stage:'finish',scene:x=>CHAT_SC(x,5),tap:'export',
   say:'Put the CV into a document. Tap ⋮ under the answer.',bn:'CV-টা ডকুমেন্টে নাও। উত্তরের নিচে ⋮ চাপো।'},
  {stage:'finish',scene:x=>Object.assign(CHAT_SC(x,5),{sheet:{html:`<h3>Share &amp; export</h3><button class="li" data-hit="todocs"><span class="av" style="background:#1A4CA8">${AFL.ico('doc')}</span><span><b>Export to Docs</b><p>Make an editable document</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('copy')}</span><span><b>Copy</b><p>Copy the text</p></span></button><button class="li"><span class="av" style="background:#5E5E66">${AFL.ico('share')}</span><span><b>Share link</b><p>Anyone with the link can see this chat</p></span></button>`}}),tap:'todocs',
   say:'Choose “Export to Docs”.',bn:'“Export to Docs” বেছে নাও।'},
  {stage:'finish',d:'dil',scene:x=>({app:'gdoc',page:fillCV(x)}),
   showMe:(x,h)=>{const f=x.get('cvFill',{});f.phone=1;f.email=1;x.set('cvFill',f);h.render()},
   onUi:(x,kind,arg)=>{if(kind==='fill'){const f=x.get('cvFill',{});f[arg]=1;x.set('cvFill',f);AFL.renderPhone();AFL.renderCoach();}},
   say:'Add her phone and email yourself. Tap the yellow boxes.',bn:'ফোন নম্বর আর ইমেইল তুমি নিজে যোগ করো। হলুদ বাক্সগুলোতে চাপো।',
   card:x=>{const f=x.get('cvFill',{});return {type:'html',html:f.phone&&f.email?`<div class="good">Done. Her contact details never went into the AI chat.<span class="bn" lang="bn">হয়ে গেছে। তার যোগাযোগের তথ্য কখনো AI চ্যাটে যায়নি।</span></div>`:`<div class="note">Private details go in at the end, by you — not by the AI.<span class="bn" lang="bn">ব্যক্তিগত তথ্য শেষে তুমি নিজে বসাবে — AI নয়।</span></div>`}}},
  {stage:'finish',open:true,d:'dil',scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Before she sends it: four checks.',bn:'পাঠানোর আগে: চারটা যাচাই।',sub:'Tap each one when it’s true.',subbn:'সত্যি হলে প্রতিটিতে চাপো।',
   card:{type:'checklist',key:'cvDil',items:[
     {en:'Every line is true.',sub:'I checked each one against my files.',bn:'প্রতিটি লাইন সত্য। ফাইলের সাথে মিলিয়ে দেখেছি।'},
     {en:'I can explain every line in an interview.',bn:'ইন্টারভিউতে প্রতিটি লাইন ব্যাখ্যা করতে পারব।'},
     {en:'I added my private details myself.',sub:'No ID card, no phone number in the AI chat.',bn:'ব্যক্তিগত তথ্য আমি নিজে যোগ করেছি। AI চ্যাটে NID বা ফোন নম্বর দিইনি।'},
     {en:'I know the programme’s rules on AI help.',sub:'If they ask, I will say: “I used AI to edit, and I checked every fact.”',bn:'প্রোগ্রামের AI-সংক্রান্ত নিয়ম জানি। জিজ্ঞেস করলে বলব: “AI দিয়ে সম্পাদনা করেছি, প্রতিটি তথ্য নিজে যাচাই করেছি।”'}]}},
  {stage:'finish',open:true,scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Tell your partner what you did.',bn:'তোমার সঙ্গীকে বলো তুমি কী করেছ।',
   card:{type:'say',lines:[
     {en:'I used AI to <u>organise</u> my CV, but I <u>checked</u> every line myself.',bn:'আমি CV সাজাতে AI ব্যবহার করেছি, কিন্তু প্রতিটি লাইন নিজে যাচাই করেছি।'},
     {en:'The AI wrote that I <u>led</u> the project. That <u>wasn’t true</u>, so I <u>changed</u> it.',bn:'AI লিখেছিল আমি প্রকল্পের নেতা ছিলাম। এটা সত্য ছিল না, তাই বদলেছি।'},
     {en:'I <u>didn’t share</u> my ID card, because a CV <u>doesn’t need</u> it.',bn:'আমি NID শেয়ার করিনি, কারণ CV-তে এর দরকার নেই।'}]}},
  {stage:'finish',open:true,scene:x=>({app:'gdoc',page:fillCV(x)}),
   say:'Done! You used all four Ds.',bn:'শেষ! তুমি চারটা D-ই ব্যবহার করেছ।',
   card:{type:'html',html:`<div class="big4">
     <div class="d-del"><b>Delegation</b><span>Ayesha keeps the facts. AI does the layout.</span><span class="bn" lang="bn">তথ্য আয়েশার; লেআউট AI-এর।</span></div>
     <div class="d-des"><b>Description</b><span>Context · Product · Process · Performance.</span><span class="bn" lang="bn">প্রেক্ষাপট · পণ্য · প্রক্রিয়া · আচরণ।</span></div>
     <div class="d-dis"><b>Discernment</b><span>Check every line against the source.</span><span class="bn" lang="bn">প্রতিটি লাইন উৎসের সাথে মেলাও।</span></div>
     <div class="d-dil"><b>Diligence</b><span>Share only what’s needed. Own the result.</span><span class="bn" lang="bn">শুধু দরকারি তথ্য দাও। ফলাফলের দায় নাও।</span></div></div>
     <div class="pick-cards"><button class="pcard" data-start="agent"><span class="pi" style="background:#FFDBCC">🛰️</span><span><em>Next</em><b>Set up an AI agent</b><span>Decide what an agent may touch.</span></span></button></div>`}}
 ]
});
})();
