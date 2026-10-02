(function () {
  'use strict';
  var reading = /ielts-reading/.test(location.pathname);
  var ids = reading
    ? ['crisis', 'altitude', 'method', 'mapping', 'keywords', 'scanning', 'traps', 'fullrun', 'scorecard', 'worksheets']
    : ['diagnostic', 'paper', 'method', 'precision', 'section1', 'section2', 'section3', 'section4', 'fullrun', 'scorecard'];
  var labels = reading ? {
    crisis: ['Measure your pace', 'See the time cost'], altitude: ['Read at ground level', 'Watch three altitudes', 'Choose the right altitude'],
    method: ['Watch the six moves', 'Try the moves yourself'], mapping: ['Skim the source', 'Build a paragraph map', 'Locate without rereading'],
    keywords: ['Choose search words', 'Recognise paraphrases', 'Build speed'], scanning: ['Watch a scan', 'Find facts together', 'Match features', 'Complete a summary'],
    traps: ['Learn the check', 'Spot the trap', 'Separate false from missing', 'Try a scored round'], fullrun: ['Put it together'],
    scorecard: ['Read your diagnosis', 'Recall the method'], worksheets: ['Keep the method', 'Print skill practice', 'Teacher route']
  } : {
    diagnostic: ['Name your listening problem', 'Check your sound'], paper: ['Explore the four parts', 'Predict answer types'],
    method: ['Learn the six moves', 'Try a preview', 'Hear the correction'], precision: ['Catch names and dates'],
    section1: ['Practise Part 1'], section2: ['Practise Part 2'], section3: ['Try the speaker lab', 'Practise Part 3'],
    section4: ['Practise Part 4'], fullrun: ['Put it together'], scorecard: ['Read your diagnosis', 'Recall the method', 'Teacher and print resources']
  };
  var descriptions = reading ? {
    crisis: ['Read once at your natural pace and check what you understood.', 'Predict your time cost, then reveal the calculation.'],
    altitude: ['Notice what happens when you read every word.', 'Compare three ways of moving through the same text.', 'Choose the altitude for each reading job.'],
    method: ['Follow the eyes through one complete question.', 'Make each decision yourself before you see the answer.'],
    mapping: ['Read only enough to know what each paragraph is about.', 'Give each paragraph a short heading.', 'Use your map to find the right paragraph quickly.'],
    keywords: ['Mark words you can actually search for.', 'Find the passage wording behind a question.', 'Make meaning matches faster under the clock.'],
    scanning: ['See how a targeted scan works.', 'Race to the relevant line, then check it.', 'Match each detail to the right feature.', 'Find the section before filling gaps.'],
    traps: ['Run the same four checks on every claim.', 'Watch how small wording changes reverse an answer.', 'Decide whether the text contradicts or omits a claim.', 'Apply the check without hints.'],
    fullrun: ['Use the whole method on a timed paper.'], scorecard: ['Find your strongest skill and the one to practise next.', 'Close the other activities and retrieve the method.'],
    worksheets: ['Save or print the six-step method.', 'Choose a practice sheet for your next attempt.', 'Plan the classroom route.']
  } : {
    diagnostic: ['Choose what makes listening difficult for you.', 'Test both voices before beginning the lesson.'],
    paper: ['Discover how each part changes your listening job.', 'Use the question to predict the answer shape.'],
    method: ['Move through the listening loop one action at a time.', 'Predict the answer type before pressing Play.', 'Watch how a first answer can be corrected.'],
    precision: ['Preview, play, then check the exact details.'],
    section1: ['Choose one conversation and follow the form in order.'], section2: ['Choose one monologue and follow its signposts.'],
    section3: ['Identify who holds each opinion.', 'Choose one longer conversation to practise.'],
    section4: ['Choose one lecture and track its structure.'], fullrun: ['Apply the method in a four-part run.'],
    scorecard: ['Find the skill to work on next.', 'Recall the six moves without looking.', 'Open the teacher and print resources when needed.']
  };
  var bnLabels = reading ? {
    crisis: ['নিজের গতি মাপুন', 'সময়ের হিসাব দেখুন'], altitude: ['ধীরে পড়ে দেখুন', 'তিন ধরনের পড়া দেখুন', 'সঠিক পদ্ধতি বাছুন'],
    method: ['ছয় ধাপ দেখুন', 'নিজে ছয় ধাপ চেষ্টা করুন'], mapping: ['প্যাসেজের ধারণা নিন', 'অনুচ্ছেদের মানচিত্র বানান', 'আবার না পড়ে খুঁজুন'],
    keywords: ['খোঁজার শব্দ বাছুন', 'সমার্থক ভাষা চিনুন', 'গতি বাড়ান'], scanning: ['স্ক্যান করা দেখুন', 'একসাথে তথ্য খুঁজুন', 'বৈশিষ্ট্য মেলান', 'সারাংশ পূরণ করুন'],
    traps: ['যাচাইয়ের নিয়ম শিখুন', 'ফাঁদটি চিনুন', 'ভুল আর অনুল্লেখ আলাদা করুন', 'নম্বরের অনুশীলন করুন'], fullrun: ['সব কৌশল একসাথে প্রয়োগ করুন'],
    scorecard: ['নিজের ফল বুঝুন', 'পদ্ধতিটি মনে করুন'], worksheets: ['পদ্ধতিটি সঙ্গে রাখুন', 'অনুশীলন প্রিন্ট করুন', 'শিক্ষকের পরিকল্পনা']
  } : {
    diagnostic: ['শোনার সমস্যা চিহ্নিত করুন', 'শব্দ পরীক্ষা করুন'], paper: ['চারটি অংশ জানুন', 'উত্তরের ধরন অনুমান করুন'],
    method: ['ছয়টি কৌশল শিখুন', 'আগে দেখে অনুমান করুন', 'সংশোধনটি শুনুন'], precision: ['নাম ও তারিখ ধরুন'],
    section1: ['পার্ট ১ অনুশীলন করুন'], section2: ['পার্ট ২ অনুশীলন করুন'], section3: ['বক্তাকে চিনুন', 'পার্ট ৩ অনুশীলন করুন'],
    section4: ['পার্ট ৪ অনুশীলন করুন'], fullrun: ['সব কৌশল একসাথে প্রয়োগ করুন'], scorecard: ['নিজের ফল বুঝুন', 'পদ্ধতিটি মনে করুন', 'শিক্ষক ও প্রিন্টের উপকরণ']
  };
  var bnDescriptions = reading ? {
    crisis: ['স্বাভাবিক গতিতে একবার পড়ুন, তারপর কতটা বুঝেছেন দেখুন।', 'কত সময় লাগবে অনুমান করুন, তারপর হিসাব দেখুন।'],
    altitude: ['প্রতিটি শব্দ পড়লে কী হয় লক্ষ্য করুন।', 'একই লেখায় তিনভাবে চোখ চালানো দেখুন।', 'প্রতিটি কাজের জন্য সঠিক পড়ার পদ্ধতি বাছুন।'],
    method: ['একটি প্রশ্নে চোখ কীভাবে চলে অনুসরণ করুন।', 'উত্তর দেখার আগে প্রতিটি সিদ্ধান্ত নিজে নিন।'],
    mapping: ['প্রতিটি অনুচ্ছেদের বিষয় বোঝার জন্য যতটুকু দরকার পড়ুন।', 'প্রতিটি অনুচ্ছেদের একটি সংক্ষিপ্ত শিরোনাম দিন।', 'মানচিত্র দিয়ে দ্রুত সঠিক অনুচ্ছেদ খুঁজুন।'],
    keywords: ['যে শব্দ সত্যিই খুঁজে পাওয়া যায় সেগুলো চিহ্নিত করুন।', 'প্রশ্নের কথাটি প্যাসেজে কীভাবে বলা হয়েছে খুঁজুন।', 'সময় ধরে সমার্থক শব্দ আরও দ্রুত চিনুন।'],
    scanning: ['লক্ষ্য ঠিক করে স্ক্যান করা দেখুন।', 'সঠিক লাইন খুঁজে তারপর যাচাই করুন।', 'প্রতিটি তথ্য সঠিক বৈশিষ্ট্যের সাথে মেলান।', 'শূন্যস্থান পূরণের আগে সঠিক অংশ খুঁজুন।'],
    traps: ['প্রতিটি দাবিতে একই চারটি যাচাই করুন।', 'ছোট শব্দ বদলে উত্তর কীভাবে পাল্টায় দেখুন।', 'লেখাটি বিরোধিতা করছে, নাকি কিছু বলেনি, তা ঠিক করুন।', 'ইঙ্গিত ছাড়া নিজে যাচাই করুন।'],
    fullrun: ['সময় ধরে একটি পেপারে পুরো পদ্ধতি ব্যবহার করুন।'], scorecard: ['আপনার শক্তি ও পরের অনুশীলনের বিষয় খুঁজুন।', 'অন্য কাজ বন্ধ রেখে পদ্ধতিটি মনে করুন।'],
    worksheets: ['ছয় ধাপের পদ্ধতিটি সংরক্ষণ বা প্রিন্ট করুন।', 'পরের অনুশীলনের জন্য একটি শিট বাছুন।', 'ক্লাসের পথ ঠিক করুন।']
  } : {
    diagnostic: ['শোনার সময় আপনার কোন সমস্যা হয় তা বাছুন।', 'পাঠ শুরুর আগে দুই কণ্ঠই শুনতে পাচ্ছেন কি না দেখুন।'],
    paper: ['প্রতিটি অংশে শোনার কাজ কীভাবে বদলায় জানুন।', 'প্রশ্ন দেখে উত্তরের ধরন অনুমান করুন।'],
    method: ['একবারে একটি করে শোনার কৌশল শিখুন।', 'প্লে করার আগে উত্তরের ধরন অনুমান করুন।', 'প্রথম উত্তরটি কীভাবে সংশোধিত হয় লক্ষ্য করুন।'],
    precision: ['আগে প্রশ্ন দেখুন, শুনুন, তারপর সঠিক তথ্য যাচাই করুন।'],
    section1: ['একটি কথোপকথন বেছে ফর্মের ক্রম অনুসরণ করুন।'], section2: ['একটি বক্তৃতা বেছে পথচিহ্ন অনুসরণ করুন।'],
    section3: ['কার মত কী, তা শনাক্ত করুন।', 'অনুশীলনের জন্য একটি বড় কথোপকথন বাছুন।'],
    section4: ['একটি লেকচার বেছে তার কাঠামো অনুসরণ করুন।'], fullrun: ['চার অংশের পরীক্ষায় পুরো পদ্ধতি ব্যবহার করুন।'],
    scorecard: ['পরেরবার কোন দক্ষতা অনুশীলন করবেন খুঁজুন।', 'না দেখে ছয়টি কৌশল মনে করুন।', 'প্রয়োজনে শিক্ষকের ও প্রিন্টের উপকরণ খুলুন।']
  };
  var copy = {
    en: { kicker: 'Your learning path', title: 'One clear task at a time.', sub: 'Work through the lesson in small moves. Your answers stay in place when you go back or jump to another station.', start: 'Start lesson →', resume: 'Continue lesson →', station: 'Station', step: 'Step', of: 'of', back: '← Back', next: 'Next step →', nextStation: 'Next station →', finish: 'Finish lesson →', done: 'You finished this guided path.', doneSub: 'Use your scorecard to choose the next skill to practise.', reference: 'Open “Reading the Ice” passage' },
    bn: { kicker: 'আপনার শেখার পথ', title: 'একবারে একটি কাজ।', sub: 'ছোট ছোট ধাপে পাঠটি করুন। পেছনে গেলে বা অন্য স্টেশনে গেলেও আপনার উত্তরগুলো থাকবে।', start: 'পাঠ শুরু করুন →', resume: 'পাঠ চালিয়ে যান →', station: 'স্টেশন', step: 'ধাপ', of: '/', back: '← পেছনে', next: 'পরের ধাপ →', nextStation: 'পরের স্টেশন →', finish: 'পাঠ শেষ করুন →', done: 'আপনি এই পাঠের সব ধাপ শেষ করেছেন।', doneSub: 'পরের অনুশীলনের জন্য আপনার স্কোরকার্ড দেখুন।', reference: '“Reading the Ice” প্যাসেজ খুলুন' }
  };
  var storageKey = 'ielts-guide-' + (reading ? 'reading' : 'listening') + '-v1';
  var saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (e) { saved = null; }
  var state = { station: 0, step: 0, complete: false };
  if (saved && ids[saved.station] && Number.isInteger(saved.step) && saved.step >= 0) state = saved;
  var sections = ids.map(function (id) { return document.getElementById(id); });
  if (sections.some(function (section) { return !section; })) return;
  var stages = [];
  sections.forEach(function (section, stationIndex) {
    var wrap = section.querySelector(':scope > .wrap');
    var children = Array.from(wrap.children).filter(function (child) {
      return !child.classList.contains('station-head') && !child.classList.contains('tnote') && !child.classList.contains('teacher-note');
    });
    var groups = [];
    children.forEach(function (child) {
      if (child.classList.contains('tab-panel') || child.classList.contains('paper-note')) {
        if (groups.length) groups[groups.length - 1].push(child);
      } else if (child.classList.contains('set-tabs')) {
        groups.push([child]);
      } else if (!reading && section.id === 'scorecard' && child.classList.contains('teacher-card')) {
        if (groups.length > 2) groups[groups.length - 1].push(child);
        else groups.push([child]);
      } else {
        groups.push([child]);
      }
    });
    if (!reading && section.id === 'scorecard' && groups.length > 3) {
      groups[2] = groups.slice(2).flat(); groups.length = 3;
    }
    stages.push(groups);
    groups.forEach(function (group, i) { group.forEach(function (element) { element.dataset.guideStep = String(i); }); });
    var head = wrap.querySelector('.station-head');
    var progress = document.createElement('div');
    progress.className = 'guide-progress no-print';
    progress.innerHTML = '<div class="guide-progress-top"><strong></strong><span></span></div><div class="guide-meter"><span class="guide-meter-fill"></span></div><div class="guide-now"><span class="guide-now-num"></span><div><h3 tabindex="-1"></h3><p></p></div></div>';
    head.insertAdjacentElement('afterend', progress);
    var actions = document.createElement('div');
    actions.className = 'guide-actions no-print';
    actions.innerHTML = '<button class="guide-back" type="button"></button><button class="guide-next" type="button"></button>';
    wrap.appendChild(actions);
    actions.querySelector('.guide-back').addEventListener('click', function () { move(-1); });
    actions.querySelector('.guide-next').addEventListener('click', function () { move(1); });
    if (reading && (section.id === 'mapping' || section.id === 'keywords')) {
      groups.forEach(function (group, i) {
        if (section.id === 'mapping' && i === 0) return;
        var source = document.getElementById('icePassage');
        if (!source || !group[0]) return;
        var details = document.createElement('details');
        details.className = 'guide-reference no-print';
        details.dataset.guideStep = String(i);
        var summary = document.createElement('summary');
        summary.textContent = copy.en.reference;
        var box = document.createElement('div');
        box.className = 'passage-box';
        var cloned = source.cloneNode(true);
        cloned.removeAttribute('id');
        box.appendChild(cloned);
        details.append(summary, box);
        group[0].insertAdjacentElement('beforebegin', details);
        group.unshift(details);
      });
    }
  });
  var hero = document.querySelector('.hero');
  var overview = document.createElement('div');
  overview.className = 'guide-overview no-print';
  overview.innerHTML = '<div class="guide-overview-inner"><div><p class="guide-kicker"></p><h2></h2><p class="guide-overview-sub"></p></div><button class="guide-start" type="button"></button></div>';
  hero.insertAdjacentElement('afterend', overview);
  overview.querySelector('button').addEventListener('click', function () { sections[state.station].scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  function lang() { return document.body.dataset.lang === 'bn' ? 'bn' : 'en'; }
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) {} }
  function locationForHash() {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var station = target && (target.classList.contains('station') ? target : target.closest('.station'));
    return station ? ids.indexOf(station.id) : -1;
  }
  function render() {
    var c = copy[lang()];
    overview.querySelector('.guide-kicker').textContent = c.kicker;
    overview.querySelector('h2').textContent = c.title;
    overview.querySelector('.guide-overview-sub').textContent = c.sub;
    overview.querySelector('button').textContent = state.station || state.step ? c.resume : c.start;
    sections.forEach(function (section, i) {
      section.classList.toggle('guide-active', i === state.station);
      section.querySelectorAll(':scope > .wrap > [data-guide-step]').forEach(function (element) {
        element.classList.toggle('guide-step-active', i === state.station && Number(element.dataset.guideStep) === state.step);
      });
      if (i !== state.station) return;
      var total = stages.reduce(function (sum, group) { return sum + group.length; }, 0);
      var before = stages.slice(0, i).reduce(function (sum, group) { return sum + group.length; }, 0);
      var pos = before + state.step + 1;
      var progress = section.querySelector('.guide-progress');
      progress.querySelector('strong').textContent = c.station + ' ' + i + ' · ' + (i + 1) + ' ' + c.of + ' ' + ids.length;
      progress.querySelector('span').textContent = c.step + ' ' + (state.step + 1) + ' ' + c.of + ' ' + stages[i].length;
      progress.querySelector('.guide-meter-fill').style.width = Math.round(pos / total * 100) + '%';
      progress.querySelector('.guide-now-num').textContent = String(state.step + 1).padStart(2, '0');
      var stepLabels = lang() === 'bn' ? bnLabels : labels;
      var stepDescriptions = lang() === 'bn' ? bnDescriptions : descriptions;
      progress.querySelector('h3').textContent = (stepLabels[ids[i]] || [])[state.step] || c.step + ' ' + (state.step + 1);
      progress.querySelector('p').textContent = (stepDescriptions[ids[i]] || [])[state.step] || '';
      var actions = section.querySelector('.guide-actions');
      var back = actions.querySelector('.guide-back');
      back.hidden = i === 0 && state.step === 0;
      back.textContent = c.back;
      actions.querySelector('.guide-next').textContent = i === ids.length - 1 && state.step === stages[i].length - 1 ? c.finish : state.step === stages[i].length - 1 ? c.nextStation : c.next;
    });
    document.querySelectorAll('.guide-reference summary').forEach(function (node) { node.textContent = c.reference; });
  }
  function show(station, step, scroll) {
    state.station = Math.max(0, Math.min(ids.length - 1, station));
    state.step = Math.max(0, Math.min(stages[state.station].length - 1, step));
    state.complete = false;
    var completeCard = document.querySelector('.guide-complete');
    if (completeCard) completeCard.remove();
    persist(); render();
    if (scroll) {
      if (location.hash !== '#' + ids[state.station]) history.replaceState(null, '', '#' + ids[state.station]);
      sections[state.station].querySelector('.guide-now h3').focus({ preventScroll: true });
      sections[state.station].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  function move(direction) {
    var station = state.station, step = state.step + direction;
    if (step >= stages[station].length) { station++; step = 0; }
    if (step < 0) { station--; step = station >= 0 ? stages[station].length - 1 : 0; }
    if (station >= ids.length) {
      state.complete = true; persist();
      var card = document.querySelector('.guide-complete');
      if (!card) {
        card = document.createElement('div'); card.className = 'guide-complete no-print';
        card.setAttribute('role', 'status'); card.tabIndex = -1;
        sections[ids.length - 1].querySelector('.guide-actions').insertAdjacentElement('beforebegin', card);
      }
      var c = copy[lang()]; card.innerHTML = '<strong>' + c.done + '</strong><p>' + c.doneSub + '</p>';
      card.focus({ preventScroll: true });
      card.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    if (station < 0) return;
    show(station, step, true);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      var section = target && (target.classList.contains('station') ? target : target.closest('.station'));
      if (section) {
        var stepElement = target.closest('[data-guide-step]');
        show(ids.indexOf(section.id), stepElement ? Number(stepElement.dataset.guideStep) : 0, false);
      }
    });
  });
  window.addEventListener('hashchange', function () {
    var index = locationForHash();
    if (index >= 0) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var stepElement = target && target.closest('[data-guide-step]');
      var step = stepElement ? Number(stepElement.dataset.guideStep) : 0;
      if (index !== state.station || step !== state.step) show(index, step, false);
    }
  });
  var hashIndex = locationForHash();
  if (hashIndex >= 0) {
    state.station = hashIndex;
    var initialTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var initialStep = initialTarget && initialTarget.closest('[data-guide-step]');
    state.step = initialStep ? Number(initialStep.dataset.guideStep) :
      (saved && saved.station === hashIndex && Number.isInteger(saved.step) && saved.step >= 0
        ? Math.min(saved.step, stages[hashIndex].length - 1) : 0);
  }
  else if (saved && ids[saved.station]) state.step = Math.min(state.step, stages[state.station].length - 1);
  var reset = document.getElementById(reading ? 'btnResetAll' : 'resetBtn');
  if (reset) reset.addEventListener('click', function () { show(0, 0, false); });
  var languageButton = document.getElementById(reading ? 'btnLang' : 'langBtn');
  if (languageButton) languageButton.addEventListener('click', function () { setTimeout(render, 0); });
  document.body.dataset.guideLesson = reading ? 'reading' : 'listening';
  document.body.classList.add('guide-ready');
  render();
})();
