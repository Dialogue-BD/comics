/* Context before decisions: each lesson begins with a concrete assignment. */
window.LAB_BRIEFS = {
  voice: {
    name:'Help Rafi contact a researcher', person:'Rafi · final-year student · University of Rajshahi', icon:'✉',
    situation:'Rafi wants to ask a professor about future research opportunities. He has read a short summary of the professor’s paper. He asks AI to help with an email.',
    tension:'The email sounds impressive. But it claims Rafi knows methods he has never used. If the professor asks him to explain, what happens?',
    job:'You are Rafi’s peer adviser. Help him decide what he can honestly say and what he needs to learn or write himself.',
    path:[['Read','Compare Rafi’s notes with the AI email.'],['Decide','Keep his ideas and experience truthful. Choose useful AI support.'],['Check','Protect classmates’ information and check a misleading club poster.']],
    finish:'By the end, explain a responsible process for contacting a researcher: what Rafi writes, how AI helps, and what he checks before sending.',
    boundary:'You are reviewing fictional examples. You will not write or send an email to a real professor.',
    bn:'রাফি একজন গবেষকের সঙ্গে যোগাযোগ করতে চায়। AI-এর লেখা ইমেইল তার নিজের জ্ঞান ও অভিজ্ঞতার সঙ্গে মেলে কি না, আপনি দেখবেন।'
  },
  learn: {
    name:'Help Mitu learn, not just finish', person:'Mitu · final-year student · Varendra University', icon:'◉',
    situation:'Mitu is studying how to judge a research claim. A study club says students using an AI app improved their scores. She needs to decide what that result actually proves.',
    tension:'An AI explanation feels clear while she reads it. But can she explain a different example with the chat closed?',
    job:'You work alongside Mitu. Try the problem yourself, choose the help she needs, and keep the reasoning with the learner.',
    path:[['Try','Make your own decision about two groups of students.'],['Get help','Build a tutor request. Stop the tutor if it gives away the thinking.'],['Try again','Check its explanation against a source, then solve a different case.']],
    finish:'By the end, explain one new example independently and choose a next learning step based on what you still find difficult.',
    boundary:'No statistics course is required. The first task supplies the facts you need. An incorrect first answer is a useful starting point.',
    bn:'মিতু AI দিয়ে শুধু উত্তর পেতে নয়, নিজে শিখতে চায়। আগে নিজে চেষ্টা করবেন, প্রয়োজনমতো সহায়তা নেবেন, তারপর নতুন উদাহরণ নিজে সমাধান করবেন।'
  },
  build: {
    name:'Help two students test their app', person:'Nila and Sami · student founders · Rajshahi', icon:'⌘',
    situation:'Nila and Sami used AI to make TutorTime, an app for booking a tutor. Their demonstration looks good. They now want real customers to book and pay.',
    tension:'A good-looking demonstration does not tell them whether the app keeps its promises. Two customers might get the same appointment, or a failed load might hide an existing booking.',
    job:'You are their first testers. Act as customers, spot what goes wrong, and steer the AI towards a fix you can check.',
    path:[['Try','Use two customer phones to book one appointment.'],['Steer','Show the AI why its button fix has not solved the customer problem.'],['Check','Retest the result. Then consider privacy, errors, payments and launch claims.']],
    finish:'By the end, explain what was wrong, what you asked AI to change, and what evidence you need before calling the app ready.',
    boundary:'You do not need to write code. Focus on what happens to customers. All app actions and coding work are simulations.',
    bn:'নীলা ও সামি AI দিয়ে টিউটর বুকিং অ্যাপ বানিয়েছে। আপনি গ্রাহক হয়ে পরীক্ষা করবেন, সমস্যা দেখাবেন এবং AI-কে ঠিক করার নির্দেশ দেবেন। কোড লেখা লাগবে না।'
  }
};
window.renderLabIntro = ({session,bangla,start}) => {
  const b=window.LAB_BRIEFS[session.id];
  document.querySelector('#app').innerHTML=`<div class="toolbar"><button id="intro-home">← All lessons</button><small>Before you begin · Session ${['voice','learn','build'].indexOf(session.id)+1}</small></div><article class="lesson-brief"><div class="intro-title"><span>${b.icon}</span><div><small>Your assignment</small><h1>${b.name}</h1></div></div><p class="intro-person">${b.person}</p><div class="intro-tabs"><button data-intro-tab="0" aria-pressed="true">1 · The story</button><button data-intro-tab="1" aria-pressed="false">2 · Your task</button><button data-intro-tab="2" aria-pressed="false">3 · How to play</button></div><section data-intro-panel="0"><div class="intro-context"><h2>The situation</h2><p>${b.situation}</p><p><strong>The problem:</strong> ${b.tension}</p></div><div class="intro-job"><h2>Your role</h2><p>${b.job}</p></div>${bangla?`<p class="bn" lang="bn">${b.bn}</p>`:''}</section><section data-intro-panel="1" hidden><h2>What you will do</h2><div class="intro-path">${b.path.map((p,i)=>`<div><span>${i+1}</span><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('')}</div><div class="intro-finish"><h2>What you should leave able to do</h2><p>${b.finish}</p></div><p class="muted">${b.boundary}</p></section><section data-intro-panel="2" hidden><div class="intro-practice"><h2>How the practice works</h2><p>These are prepared stories, not a live AI chat. Tap the choices and controls inside each practice screen. Your actions reveal what happens next.</p><div class="intro-demo"><small>Quick practice · no marks</small><p><b>A task has two facts to check.</b> What should you do before trusting the answer?</p><button id="intro-try">Check the answer against the facts</button><p id="intro-response" role="status">Tap the button to see how feedback appears.</p></div><p><b>In pairs:</b> one person taps; the other explains the evidence. Swap at the next activity. At the last task, decide alone before comparing.</p><p><b>In class:</b> the teacher projects the same screens. Discuss a choice before revealing the result.</p><p class="muted">The four names you will see: Delegation = who does the work; Description = what you ask AI to do; Discernment = checking its work; Diligence = taking responsibility for what you use or share.</p></div></section><div class="nav"><button id="intro-back" hidden>← Back</button><button id="intro-next" class="primary">Your task →</button><button id="intro-start" class="primary" hidden>Begin: ${session.steps[0].title} →</button></div></article>`;
  let panel=0;
  const show=n=>{panel=n;document.querySelectorAll('[data-intro-panel]').forEach(e=>e.hidden=+e.dataset.introPanel!==n);document.querySelectorAll('[data-intro-tab]').forEach(e=>e.setAttribute('aria-pressed',+e.dataset.introTab===n));document.getElementById('intro-back').hidden=n===0;document.getElementById('intro-next').hidden=n===2;document.getElementById('intro-start').hidden=n!==2;document.getElementById('intro-next').textContent=n===0?'Your task →':'How to play →';window.scrollTo({top:0,behavior:'auto'})};
  document.querySelectorAll('[data-intro-tab]').forEach(e=>e.onclick=()=>show(+e.dataset.introTab));
  document.getElementById('intro-back').onclick=()=>show(panel-1);document.getElementById('intro-next').onclick=()=>show(panel+1);
  document.getElementById('intro-home').onclick=()=>location.hash='';
  document.getElementById('intro-start').onclick=start;
  document.getElementById('intro-try').onclick=()=>{document.getElementById('intro-response').innerHTML='✓ You chose a check. In the lesson, feedback will show the evidence and help you revise. You can try again; speed is not scored.'};
  document.querySelector('#teacher').innerHTML='<h3>Introduce the assignment first</h3><p>Use the opening station’s time to establish the situation and role. Ask pairs to say who they are helping and what that person needs. Demonstrate the practice button, then begin. Readiness check: “What is our job in this story?” Accept a short answer in English or Bangla.</p>';
};
