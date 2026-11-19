(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ------------------------------------------------------------------ */
  /* 1. GUIDED SHELL METADATA & AUDIO ENGINE (v6 · 123 CLIPS)           */
  /* ------------------------------------------------------------------ */
  const SCREEN_META = [
    { clip: 'step-0', ico: '🎬', en: 'Tap Start to learn how GitHub protects your AI projects.', bn: 'কোডিং ছাড়াই GitHub-এ এআই অ্যাপ নিরাপদ রাখা শিখতে Start চাপুন।' },
    { clip: 'step-1', ico: '🎬', en: 'Tap ▶ to watch Prompt #15 crash — then try 🛡️ GitHub.', bn: 'Prompt #15-এ অ্যাপ কীভাবে ভাঙে দেখুন — তারপর 🛡️ GitHub চাপুন।' },
    { clip: 'step-2', ico: '🎬', en: 'Diff X-Ray: tap the red (−) and green (+) lines.', bn: 'লাল (−) আর সবুজ (+) লাইনে ট্যাপ করে দেখুন AI কী বদলেছে।' },
    { clip: 'step-vl', ico: '🎨', en: 'Say short Git /ɪ/, not long geet /iː/ — relax cheeks like Tim.', bn: 'বাংলায় এই ছোট /ɪ/ ধ্বনি নেই — গাল ঢিলে দিয়ে ছোট্ট করে Git বলুন (Tim-এর মতো, team-এর মতো নয়)।' },
    { clip: 'step-3', ico: '🎨', en: 'Watch and hear 6 core words. Tap ▶ or any card.', bn: 'মূল ৬টি শব্দের অ্যানিমেশন দেখুন ও শুনুন। যেকোনো কার্ডে ট্যাপ করুন।' },
    { clip: 'step-4', ico: '🎨', en: 'Hear and Point: listen and tap the matching animation.', bn: 'মন দিয়ে শব্দ শুনে সঠিক অ্যানিমেশনে ট্যাপ করুন।' },
    { clip: 'step-5', ico: '🎨', en: 'Watch 5 track words: main, HEAD, branch, merge, revert.', bn: 'নিরাপত্তা ও ট্র্যাকের ৫টি শব্দ দেখুন: main, HEAD, branch, merge, revert।' },
    { clip: 'step-6', ico: '🎨', en: 'Hear and Point: find the 5 track and rescue animations.', bn: 'শুনে সঠিক ট্র্যাক ও উদ্ধার অ্যানিমেশনে ট্যাপ করুন।' },
    { clip: 'step-7', ico: '🎨', en: 'Watch 5 GitHub words: conflict, clone, fork, diff, pull request (PR).', bn: 'টিম ও গিটহাবের ৫টি শব্দ দেখুন: conflict, clone, fork, diff, pull request (PR)।' },
    { clip: 'step-pro-game', ico: '🎨', en: 'Hear and Point: find the 5 team and GitHub animations.', bn: 'শুনে সঠিক টিম ও গিটহাব অ্যানিমেশনে ট্যাপ করুন।' },
    { clip: 'step-8', ico: '🚂', en: 'Tap stations ①–⑤ to ride the Git railway tracks.', bn: '① থেকে ⑤ বাটনে ট্যাপ করে গিট রেললাইন দেখুন।' },
    { clip: 'step-9', ico: '🚂', en: 'Compare Commit (local), Push (up), Pull (down), and Clone.', bn: 'Commit, Push, Pull ও Clone-এর পার্থক্য অ্যানিমেশনে দেখুন।' },
    { clip: 'step-where', ico: '🚂', en: 'Where do you build? Start in the Browser — move to a Laptop IDE anytime.', bn: 'কোথায় অ্যাপ বানাবেন? ব্রাউজার (AI Studio) সবচেয়ে সহজ, পরে ল্যাপটপ IDE নিতে পারেন।' },
    { clip: 'step-tools', ico: '🚂', en: 'Two ways to use Git & code: visual IDE buttons or terminal CLI commands.', bn: 'Git ও কোড চালানোর ২ উপায়: IDE (বাটন ক্লিক) অথবা CLI (টার্মিনাল কমান্ড)।' },
    { clip: 'step-10', ico: '🚂', en: 'Press ▶ to watch Google AI Studio save to GitHub.', bn: '▶ চেপে দেখুন Google AI Studio থেকে কীভাবে GitHub-এ সেভ হয়।' },
    { clip: 'step-11', ico: '🚂', en: 'Press ▶ to watch Diff, Commit, Branch, and Discard inside an IDE.', bn: '▶ চেপে IDE-তে Diff, Commit, Branch ও Discard দেখুন।' },
    { clip: 'step-12', ico: '🚂', en: 'Tap the 4 glowing buttons inside the IDE to inspect them.', bn: 'IDE-র ৪টি হাইলাইট করা বাটনে ট্যাপ করে কাজগুলো জানুন।' },
    { clip: 'step-13', ico: '🛡️', en: 'Test Secret Shield (.env + .gitignore), then preview free Pages.', bn: 'API Key নিরাপত্তা (.env + .gitignore) ও ফ্রি Pages পাবলিশিং দেখুন।' },
    { clip: 'step-14', ico: '🛡️', en: 'Copy exact English prompts for AI, or hear client phrases.', bn: 'AI-কে দেওয়ার সহজ ইংরেজি প্রম্পট ও ক্লায়েন্টের বাক্য অনুশীলন করুন।' },
    { clip: 'step-15', ico: '🛡️', en: 'You are ready! Review your 5 golden habits or open the toolkit.', bn: 'অভিনন্দন! ৫টি সোনার নিয়ম শুনে নিন বা মোবাইল গাইড খুলুন।' }
  ];

  const CHAPTERS = [
    { ico: '🎬', steps: [1, 2] },
    { ico: '🎨', steps: [3, 4, 5, 6, 7, 8, 9] },
    { ico: '🚂', steps: [10, 11, 12, 13, 14, 15, 16] },
    { ico: '🛡️', steps: [17, 18, 19] }
  ];

  let soundOn = true;
  try { soundOn = localStorage.getItem('ghv-sound') !== '0'; } catch (_) {}
  let userInteracted = false;
  let audioCtx = null;
  let audioManifest = null;
  let audioVersion = 13;
  const clipBlobCache = new Map();
  const clipFetchInFlight = new Map();
  const voicePlayer = new Audio();
  let voiceSeqId = 0;
  let activeVoiceResolve = null;

  function clipUrl(clipId) {
    const rel = (audioManifest && audioManifest.clips && audioManifest.clips[clipId]) || `audio/${clipId}.mp3`;
    return `${rel}?v=${audioVersion}`;
  }

  function prefetchClip(clipId) {
    if (!clipId || clipBlobCache.has(clipId) || clipFetchInFlight.has(clipId)) return;
    const url = clipUrl(clipId);
    const p = fetch(url)
      .then(res => (res.ok ? res.blob() : null))
      .then(blob => {
        if (!blob) return;
        clipBlobCache.set(clipId, URL.createObjectURL(blob));
      })
      .catch(() => {})
      .finally(() => clipFetchInFlight.delete(clipId));
    clipFetchInFlight.set(clipId, p);
  }

  fetch(`audio/manifest.json?v=${audioVersion}`)
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (!data || !data.clips) return;
      audioManifest = data;
      if (data.version) audioVersion = data.version;
      ['step-0', 'step-1', 'step-vl', 'vl-geet', 'vl-git', 'vocab-vibecoding'].forEach(prefetchClip);
    })
    .catch(() => {});

  function stopVoice() {
    voiceSeqId++;
    try { voicePlayer.pause(); } catch (_) {}
    voicePlayer.onended = null;
    voicePlayer.onerror = null;
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    $$('.speaking').forEach(el => el.classList.remove('speaking'));
    if (activeVoiceResolve) {
      const done = activeVoiceResolve;
      activeVoiceResolve = null;
      done();
    }
  }

  function playChime(ok) {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const notes = ok ? [523.25, 659.25] : [220, 185];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = ok ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.085);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.085);
        gain.gain.exponentialRampToValueAtTime(0.11, now + idx * 0.085 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.085 + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.085);
        osc.stop(now + idx * 0.085 + 0.24);
      });
    } catch (_) {}
  }

  function speakFallback(text, slow, seq, finish) {
    if (!text || !('speechSynthesis' in window)) { finish(); return; }
    try {
      const clean = String(text).replace(/\bvibecoding\b/gi, 'Vibe coding').replace(/\bgeet\b/gi, 'Geat');
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      const voices = window.speechSynthesis.getVoices();
      const pick = voices.find(v => /^en[-_]US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
      if (pick) u.voice = pick;
      u.lang = 'en-US';
      u.rate = slow ? 0.78 : 0.96;
      u.onend = () => { if (seq === voiceSeqId) finish(); };
      u.onerror = () => { if (seq === voiceSeqId) finish(); };
      window.speechSynthesis.speak(u);
    } catch (_) {
      finish();
    }
  }

  function speakClip(clipId, fallbackText, opts = {}) {
    stopVoice();
    if (!soundOn && !opts.force) return Promise.resolve();
    const seq = voiceSeqId;
    const targetEl = opts.el && opts.el.isConnected ? opts.el : null;
    if (targetEl) targetEl.classList.add('speaking');

    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (targetEl) targetEl.classList.remove('speaking');
        if (activeVoiceResolve === finish) activeVoiceResolve = null;
        resolve();
      };
      activeVoiceResolve = finish;

      if (!clipId) { speakFallback(fallbackText, !!opts.slow, seq, finish); return; }
      if (!clipBlobCache.has(clipId)) prefetchClip(clipId);
      const url = clipBlobCache.get(clipId) || clipUrl(clipId);

      try {
        voicePlayer.pause();
        voicePlayer.src = url;
        const rate = opts.slow ? 0.78 : 1.0;
        voicePlayer.playbackRate = rate;
        voicePlayer.defaultPlaybackRate = rate;
        voicePlayer.onended = () => { if (seq === voiceSeqId) finish(); };
        voicePlayer.onerror = () => {
          if (seq !== voiceSeqId) return;
          if (url.startsWith('blob:')) clipBlobCache.delete(clipId);
          speakFallback(fallbackText, !!opts.slow, seq, finish);
        };
        const p = voicePlayer.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            if (seq !== voiceSeqId) return;
            speakFallback(fallbackText, !!opts.slow, seq, finish);
          });
        }
      } catch (_) {
        speakFallback(fallbackText, !!opts.slow, seq, finish);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. GUIDED STEP ROUTER, RAIL, COACH BAR, BANGLA & STAGE CONTROLS    */
  /* ------------------------------------------------------------------ */
  const TOTAL_STEPS = SCREEN_META.length - 1; // 0..16 -> chip displays 0 / 16 .. 16 / 16
  let currentStep = 0;
  const screenEls = $$('.step-screen');
  const railEl = $('#prog-rail');
  const coachBar = $('#coachbar');
  const coachEar = $('#coach-ear');
  const coachEn = $('#coach-en');
  const coachBn = $('#coach-bn');
  const stepChip = $('#step-chip');
  const chapterIco = $('#chapter-ico');
  const prevBtn = $('#nav-prev');
  const nextBtn = $('#nav-next');

  function buildRail() {
    if (!railEl) return;
    railEl.innerHTML = CHAPTERS.map(ch => `
      <div class="pr-chap" data-steps="${ch.steps.join(',')}">
        <span class="pr-ico" aria-hidden="true">${ch.ico}</span>
        <div class="pr-dots">
          ${ch.steps.map(s => `<button type="button" class="pr-dot" data-go="${s}" aria-label="Step ${s}"></button>`).join('')}
        </div>
      </div>
    `).join('');
    railEl.addEventListener('click', e => {
      const b = e.target.closest('.pr-dot[data-go]');
      if (!b) return;
      userInteracted = true;
      go(+b.dataset.go, true);
    });
  }

  const demoPausedHooks = [];
  const stepEnterHooks = [];

  function pulseNext(on) {
    if (nextBtn) nextBtn.classList.toggle('ready-pulse', !!on && currentStep < TOTAL_STEPS);
  }

  function updateShellChrome(step, autoSpeak) {
    const meta = SCREEN_META[step] || SCREEN_META[0];
    if (coachBar) coachBar.hidden = (step === 0);
    if (coachEn) coachEn.textContent = meta.en;
    if (coachBn) coachBn.textContent = meta.bn;
    if (stepChip) stepChip.textContent = `${step} / ${TOTAL_STEPS}`;
    if (chapterIco) chapterIco.textContent = meta.ico;
    if (prevBtn) prevBtn.disabled = step <= 0;
    if (nextBtn) nextBtn.disabled = step >= TOTAL_STEPS;
    pulseNext(false);

    if (railEl) {
      $$('.pr-chap', railEl).forEach(ch => {
        const list = ch.dataset.steps.split(',').map(Number);
        ch.classList.toggle('active', list.includes(step));
      });
      $$('.pr-dot', railEl).forEach(dot => {
        const s = +dot.dataset.go;
        dot.classList.toggle('now', s === step);
        dot.classList.toggle('done', s < step);
      });
    }

    prefetchClip(meta.clip);
    if (SCREEN_META[step + 1]) prefetchClip(SCREEN_META[step + 1].clip);

    if (autoSpeak && soundOn && userInteracted) {
      speakClip(meta.clip, meta.en, { el: coachEar });
    }
  }

  function go(idx, autoSpeak = false) {
    const target = clamp(idx, 0, TOTAL_STEPS);
    if (target !== currentStep) stopVoice();
    demoPausedHooks.forEach(fn => fn());

    currentStep = target;
    screenEls.forEach(sec => {
      const match = Number(sec.dataset.idx) === currentStep;
      sec.classList.toggle('on', match);
      sec.hidden = !match;
    });

    const mainEl = $('#stage-main');
    if (mainEl) mainEl.scrollTop = 0;

    updateShellChrome(currentStep, autoSpeak);
    stepEnterHooks.forEach(fn => fn(currentStep));

    try { history.replaceState(null, '', `#s${currentStep}`); } catch (_) {}
    requestAnimationFrame(() => fitDemos());
  }

  buildRail();

  if (prevBtn) prevBtn.addEventListener('click', () => { userInteracted = true; go(currentStep - 1, true); });
  if (nextBtn) nextBtn.addEventListener('click', () => { userInteracted = true; go(currentStep + 1, true); });
  if (coachEar) {
    coachEar.addEventListener('click', () => {
      userInteracted = true;
      const m = SCREEN_META[currentStep] || SCREEN_META[0];
      speakClip(m.clip, m.en, { el: coachEar, force: true });
    });
  }

  // Global top-bar buttons: Sound, Bangla, Stage Mode
  const soundBtn = $('#sound-btn');
  function paintSoundBtn() {
    if (!soundBtn) return;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
  }
  paintSoundBtn();
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      userInteracted = true;
      soundOn = !soundOn;
      if (!soundOn) stopVoice();
      try { localStorage.setItem('ghv-sound', soundOn ? '1' : '0'); } catch (_) {}
      paintSoundBtn();
    });
  }

  const langBtn = $('#lang-btn');
  let startBn = true;
  try { startBn = localStorage.getItem('ghv-bn') !== '0'; } catch (_) {}
  document.body.classList.toggle('show-bn', startBn);
  if (langBtn) {
    langBtn.setAttribute('aria-pressed', String(startBn));
    langBtn.addEventListener('click', () => {
      const on = document.body.classList.toggle('show-bn');
      langBtn.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('ghv-bn', on ? '1' : '0'); } catch (_) {}
      requestAnimationFrame(() => fitDemos());
    });
  }

  const stageBtn = $('#stage-btn');
  function setStageMode(on, save) {
    if (on) document.documentElement.dataset.theme = 'stage';
    else delete document.documentElement.dataset.theme;
    if (stageBtn) stageBtn.setAttribute('aria-pressed', String(on));
    if (save) { try { localStorage.setItem('ghv-stage', on ? '1' : '0'); } catch (_) {} }
    requestAnimationFrame(() => fitDemos());
  }
  let initStage = false;
  try { initStage = localStorage.getItem('ghv-stage') === '1'; } catch (_) {}
  setStageMode(initStage, false);
  if (stageBtn) {
    stageBtn.addEventListener('click', () => {
      const on = document.documentElement.dataset.theme !== 'stage';
      setStageMode(on, true);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. SCREEN 0 WELCOME + SCREEN 1 CRASH SIM + SCREEN 2 DIFF X-RAY     */
  /* ------------------------------------------------------------------ */
  const welcomeVibeBtn = $('#welcome-vibe-btn');
  if (welcomeVibeBtn) {
    welcomeVibeBtn.addEventListener('click', () => {
      userInteracted = true;
      speakClip('vocab-vibecoding', 'Vibe coding: Building software by describing what you want to AI in plain language.', { el: welcomeVibeBtn, force: true });
    });
  }
  const welcomeStartBtn = $('#welcome-start');
  if (welcomeStartBtn) {
    welcomeStartBtn.addEventListener('click', () => {
      userInteracted = true;
      go(1, true);
    });
  }
  const welcomePrintBtn = $('#welcome-print');
  if (welcomePrintBtn) welcomePrintBtn.addEventListener('click', () => window.print());

  (function initCrashSim() {
    const sim = $('#nightmare-sim');
    if (!sim) return;
    let mode = 'zip';
    let step = 0;
    let restored = false;
    let timer = null;

    const PROMPTS = [
      {
        who: 'Prompt #1',
        text: '“Build a Rajshahi Fazli Mango crate order app in Taka (৳).”',
        textBn: '“টাকায় (৳) রাজশাহীর ফজলি আমের ক্যারেট অর্ডার করার অ্যাপ বানাও।”',
        zipName: 'mango_v1.zip',
        commitHash: 'c1',
        commitMsg: 'Working mango price table'
      },
      {
        who: 'Prompt #5',
        text: '“Add automatic 1.85% bKash cash-out fee calculation.”',
        textBn: '“স্বয়ংক্রিয় ১.৮৫% bKash ক্যাশ-আউট ফি হিসাব যোগ করো।”',
        zipName: 'mango_v2_bkash.zip',
        commitHash: 'c2',
        commitMsg: 'Add 1.85% bKash fee'
      },
      {
        who: 'Prompt #12',
        text: '“Add Dhaka courier delivery charge (৳250) and gold button.”',
        textBn: '“ঢাকা কুরিয়ার ডেলিভারি চার্জ (৳২৫০) আর সোনালি বাটন যোগ করো।”',
        zipName: 'mango_final_FINAL.zip',
        commitHash: 'c3',
        commitMsg: 'Add courier + gold CTA'
      },
      {
        who: 'Prompt #15 💥',
        text: '“Make the cards super fancy with animations and shadows!”',
        textBn: '“কার্ডগুলো অ্যানিমেশন আর শ্যাডো দিয়ে অনেক বেশি সুন্দর করো!”',
        zipName: 'mango_REAL_v9_BROKEN.zip',
        commitHash: 'c4',
        commitMsg: 'Fancy FX (BROKEN bKash!)'
      }
    ];

    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
      const ab = $('#nm-auto');
      if (ab) { ab.classList.remove('playing'); ab.textContent = '🎬 Auto'; }
    }
    stepEnterHooks.push(s => { if (s !== 1) stopAuto(); });

    function render() {
      const p = PROMPTS[step];
      const crashed = step === 3 && !restored;
      const effectiveStep = restored ? 2 : step;

      $$('.nm-mode', sim).forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
      $('#nm-step-badge').textContent = restored ? '⏪ c3!' : `${step + 1} / 4`;
      $('#nm-prompt-box').classList.toggle('crash', crashed);
      $('#nm-who').textContent = restored ? '⏪ Restored Commit #3 (c3)' : p.who;
      $('#nm-prompt-text').textContent = restored ? PROMPTS[2].text : p.text;
      const bnEl = $('#nm-prompt-bn');
      if (bnEl) bnEl.textContent = restored ? PROMPTS[2].textBn : p.textBn;

      const storageEl = $('#nm-storage');
      if (mode === 'zip') {
        storageEl.innerHTML = PROMPTS.slice(0, step + 1).map((item, idx) =>
          `<div class="zip-item ${idx === 3 ? 'bad' : ''}"><span>🗜️</span><b>${item.zipName}</b><small>${idx === 3 ? 'Lost good math!' : 'Folder'}</small></div>`
        ).join('');
      } else {
        storageEl.innerHTML = PROMPTS.slice(0, step + 1).map((item, idx) => {
          const isAct = idx === effectiveStep;
          const isBad = idx === 3 && !restored;
          return `<div class="commit-item ${isAct ? 'active' : ''} ${isBad ? 'broken' : ''}">
            <span class="commit-hash">${item.commitHash}</span>
            <span>${esc(item.commitMsg)}</span>
            ${isAct ? '<small style="margin-left:auto">HEAD</small>' : ''}
          </div>`;
        }).join('');
      }

      $('#ma-bkash-row').hidden = effectiveStep < 1;
      $('#ma-deliv-row').hidden = effectiveStep < 2;
      $('#ma-btn').classList.toggle('gold', effectiveStep >= 2);
      const totals = ['৳ 3,000', '৳ 3,056', '৳ 3,306', '❌ Error'];
      $('#ma-total').textContent = totals[crashed ? 3 : effectiveStep];
      $('#mango-app').classList.toggle('crashed', crashed);
      $('#ma-crash').hidden = !crashed;
      $('#nm-health').className = 'nm-health ' + (crashed ? 'bad' : 'ok');
      $('#nm-health').textContent = crashed ? '● CRASH' : '● OK';

      $('#nm-restore').hidden = !(mode === 'git' && step === 3 && !restored);
      $('#nm-prev').disabled = step === 0 && !restored;
      $('#nm-next').disabled = step === 3;
    }

    $$('.nm-mode', sim).forEach(b => b.addEventListener('click', () => {
      userInteracted = true;
      mode = b.dataset.mode;
      restored = false;
      render();
    }));
    $('#nm-prev').addEventListener('click', () => {
      stopAuto();
      if (restored) restored = false;
      else if (step > 0) step--;
      render();
    });
    $('#nm-next').addEventListener('click', () => {
      stopAuto();
      restored = false;
      if (step < 3) step++;
      if (step === 3) playChime(false);
      render();
    });
    $('#nm-restore').addEventListener('click', () => {
      stopAuto();
      restored = true;
      playChime(true);
      render();
      pulseNext(true);
    });
    $('#nm-auto').addEventListener('click', () => {
      userInteracted = true;
      if (timer) { stopAuto(); return; }
      mode = 'git'; step = 0; restored = false; render();
      $('#nm-auto').classList.add('playing');
      $('#nm-auto').textContent = '⏸';
      timer = setInterval(() => {
        if (step < 3) { step++; if (step === 3) playChime(false); render(); }
        else if (!restored) { restored = true; playChime(true); render(); pulseNext(true); }
        else stopAuto();
      }, 1900);
    });
    render();
  })();

  (function initDiffLens() {
    const diff = $('#diff-lens');
    if (!diff) return;
    $$('.dl-btn', diff).forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        $$('.dl-btn', diff).forEach(b => b.classList.toggle('active', b === btn));
        $('#dl-pane-zip').hidden = view !== 'zip';
        $('#dl-pane-diff').hidden = view !== 'diff';
      });
    });

    const site = $('#dl-site');
    const statusEl = $('#dlp-status');
    const baseRow = $('#dlp-base');
    const feeRow = $('#dlp-fee');
    const feeVal = $('#dlp-fee-val');
    const totalRow = $('#dlp-total');
    const totalVal = $('#dlp-total-val');
    const orderBtn = $('#dlp-btn');
    const fxEl = $('#dlp-fx');
    let activePart = 'idle';

    const clearSpots = () => {
      [baseRow, feeRow, totalRow, orderBtn].forEach(el => {
        if (el) el.classList.remove('is-spot-ok', 'is-spot-del', 'is-spot-bad', 'is-spot-gold');
      });
    };

    function applyDiffPart(part, speakNow) {
      activePart = part;
      const line = $(`.dw-line[data-part="${part}"]`, diff);
      $$('.dw-line', diff).forEach(l => l.classList.toggle('selected', l === line));

      const box = $('#dl-explain-box');
      if (box && line) {
        box.innerHTML = `<strong>${esc(line.dataset.note || '')}</strong><span class="bn" lang="bn">${esc(line.dataset.noteBn || '')}</span>`;
      }

      clearSpots();
      if (site) site.dataset.part = part;
      if (orderBtn) orderBtn.classList.remove('gold');

      if (part === 'base') {
        if (statusEl) { statusEl.className = 'dlp-status ok'; statusEl.textContent = 'Line 14 · Math'; }
        if (baseRow) baseRow.classList.add('is-spot-ok');
        if (feeVal) feeVal.textContent = '৳ 56';
        if (totalVal) totalVal.textContent = '৳ 3,306';
        if (fxEl) fxEl.textContent = '2 crates × ৳1,500 = ৳3,000';
      } else if (part === 'fee-ok') {
        if (statusEl) { statusEl.className = 'dlp-status del'; statusEl.textContent = '−15 Deleted'; }
        if (feeRow) feeRow.classList.add('is-spot-del');
        if (feeVal) feeVal.textContent = '৳ 56 (deleted!)';
        if (totalVal) totalVal.textContent = '৳ 3,306 ✓';
        if (fxEl) fxEl.textContent = 'Worked before: ৳3,000 × 0.0185 = ৳56';
      } else if (part === 'fee-bad') {
        if (statusEl) { statusEl.className = 'dlp-status bad'; statusEl.textContent = '💥 +15 Crash'; }
        if (feeRow) feeRow.classList.add('is-spot-bad');
        if (totalRow) totalRow.classList.add('is-spot-bad');
        if (feeVal) feeVal.textContent = '❌ ???';
        if (totalVal) totalVal.textContent = '💥 ❌ Error';
        if (fxEl) fxEl.textContent = 'Website does not know ??? → Total breaks!';
        if (speakNow) playChime(false);
      } else if (part === 'btn') {
        if (statusEl) { statusEl.className = 'dlp-status gold'; statusEl.textContent = '🎨 +16 Style'; }
        if (feeVal) feeVal.textContent = '৳ 56';
        if (totalVal) totalVal.textContent = '৳ 3,306';
        if (orderBtn) orderBtn.classList.add('gold', 'is-spot-gold');
        if (fxEl) fxEl.textContent = 'Button color → Gold (#b9924f)';
        if (speakNow) playChime(true);
      }

      if (speakNow && line) {
        speakClip(line.dataset.audio, line.dataset.note || '', { el: line });
      }
    }

    const rawToggle = $('#dl-raw-toggle');
    if (rawToggle) {
      let showRaw = false;
      rawToggle.addEventListener('click', () => {
        showRaw = !showRaw;
        rawToggle.setAttribute('aria-pressed', String(showRaw));
        $$('.dw-line', diff).forEach(line => {
          const codeEl = $('code', line);
          if (codeEl) codeEl.textContent = showRaw ? (line.dataset.raw || '') : (line.dataset.plain || '');
        });
      });
    }

    $$('.dw-line', diff).forEach(line => {
      line.addEventListener('click', () => {
        userInteracted = true;
        applyDiffPart(line.dataset.part || 'base', true);
      });
    });

    if (site) {
      site.addEventListener('click', e => {
        const trg = e.target.closest('[data-link-part]');
        if (!trg) return;
        userInteracted = true;
        let targetPart = trg.dataset.linkPart;
        if ((trg === feeRow || trg === totalRow) && activePart === 'fee-bad') {
          targetPart = 'fee-ok';
        }
        applyDiffPart(targetPart, true);
      });
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 4. SCREEN 3 VOICE LAB MINI (GEET /i:/ vs GIT /I/ · MOUTH + QUIZ)    */
  /* ------------------------------------------------------------------ */
  (function initVoiceLab() {
    const stage = $('#vl-stage');
    if (!stage) return;

    const frontSvg = $('#vl-svg-front');
    const sideSvg = $('#vl-svg-side');
    if (!frontSvg || !sideSvg) return;

    // Exact Voice Lab viseme geometry & spring constants from MouthDiagram.jsx + visemes.js
    const REST = { open: 0.1, jaw: 0.12, spread: 0.3, round: 0, press: 0, tuck: 0, tipZ: -0.35, tipY: -0.75, front: -0.5, mid: -0.45, back: -0.45, tension: 0.25 };
    const V = o => ({ ...REST, ...o });
    const SHAPES = {
      rest: REST,
      ee: V({ open: 0.26, jaw: 0.12, spread: 1, front: 0.95, mid: 0.45, back: -0.3, tipY: -0.55, tipZ: -0.22, tension: 1 }),
      ih: V({ open: 0.4, jaw: 0.3, spread: 0.45, front: 0.45, mid: 0.2, back: -0.4, tipY: -0.68, tension: 0.05 }),
      pb: V({ press: 1, open: 0, jaw: 0.08, spread: 0.35, tension: 0.45 }),
      td: V({ open: 0.24, jaw: 0.18, spread: 0.4, tipY: 0.42, tipZ: -0.34, front: 0.45, mid: 0.05, tension: 0.3 }),
      kg: V({ open: 0.3, jaw: 0.24, spread: 0.35, back: 1, mid: 0.4, front: -0.5, tension: 0.3 })
    };
    const KEYS = Object.keys(REST);

    const PAIRS = {
      git: {
        long: { word: 'geet', clip: 'vl-geet', fallback: 'Geat.', sub: '😬 cheeks tight', pct: 100, tag: 'tense', pose: 'ee', seq: ['kg', 'ee', 'td'], status: 'geet · /iː/ · cheeks pulled tight' },
        short: { word: 'Git', clip: 'vl-git', fallback: 'Git.', sub: '😌 jaw relaxed', pct: 58, tag: 'short', pose: 'ih', seq: ['kg', 'ih', 'td'], status: 'Git · /ɪ/ · cheeks relaxed' },
        bn: '<b>বাংলায় ই আর ঈ প্রায় একই</b> — ইংরেজি <b>Git (/ɪ/)</b> বলতে গাল ঢিলে দিন, টেনে বলবেন না!'
      },
      tim: {
        long: { word: 'team', clip: 'vl-team', fallback: 'Team.', sub: '😬 cheeks tight', pct: 100, tag: 'tense', pose: 'ee', seq: ['td', 'ee', 'pb'], status: 'team · /iː/ · cheeks pulled tight' },
        short: { word: 'Tim', clip: 'vl-tim', fallback: 'Tim.', sub: '😌 jaw relaxed', pct: 64, tag: 'short', pose: 'ih', seq: ['td', 'ih', 'pb'], status: 'Tim · /ɪ/ · cheeks relaxed' },
        bn: '<b>বাংলায় ই আর ঈ প্রায় একই</b> — ইংরেজিতে <b>team</b> (টানটান) আর <b>Tim</b> (ঢিলেঢালা) দুটো আলাদা শব্দ!'
      }
    };

    // Populate authentic Voice Lab Front & Side SVGs
    frontSvg.innerHTML = `
      <defs>
        <clipPath id="vl-md-clip"><path id="vl-f-clip"/></clipPath>
        <filter id="vl-md-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="120" cy="108" rx="112" ry="92" class="md-skin"/>
      <path d="M98 40q22 12 44 0" class="md-nose"/>
      <path d="M84 176q36 16 72 0" class="md-chin"/>
      <g id="vl-f-musG" class="md-muscles" filter="url(#vl-md-glow)" style="opacity:1">
        <path class="md-muscle"/><path class="md-muscle"/><path class="md-muscle"/><path class="md-muscle"/>
      </g>
      <path id="vl-f-opening" class="md-cavity"/>
      <g clip-path="url(#vl-md-clip)">
        <path id="vl-f-tongue" class="md-tongue"/>
        <path id="vl-f-teethLo" class="md-teeth"/>
        <path id="vl-f-gapsLo" class="md-tgap"/>
        <path id="vl-f-teethUp" class="md-teeth"/>
        <path id="vl-f-gapsUp" class="md-tgap"/>
      </g>
      <path id="vl-f-lower" class="md-lip"/>
      <path id="vl-f-tip" class="md-tongue"/>
      <path id="vl-f-upper" class="md-lip"/>`;

    sideSvg.innerHTML = `
      <path id="vl-s-nasal" class="md-faint"/>
      <path id="vl-s-throat" class="md-line"/>
      <path id="vl-s-palate" class="md-palate"/>
      <path id="vl-s-tongue" class="md-tongue"/>
      <path d="M171 78Q178 79 179.5 88L180 100Q177 102 174 99L172 90Z" class="md-teeth"/>
      <path id="vl-s-toothLo" class="md-teeth"/>
      <path id="vl-s-face" class="md-line"/>
      <path id="vl-s-upperLip" class="md-lip-side"/>
      <path id="vl-s-lowerLip" class="md-lip-side"/>
      <path id="vl-s-chin" class="md-line"/>
      <path id="vl-s-neck" class="md-line"/>
      <g class="md-voice">
        <rect id="vl-s-box" x="77" y="160" width="24" height="15" rx="5" class="md-box" style="fill:#E3EAD9"/>
        <g id="vl-s-folds"><path d="M82 167.5q7-4 7 0q0 4-7 0M96 167.5q-7-4-7 0q0 4 7 0" class="md-folds"/></g>
      </g>
      ${Array.from({ length: 5 }, () => '<path d="M-9 0a9 5 0 0 1 18 0" class="md-ring" opacity="0"/>').join('')}
      ${Array.from({ length: 24 }, () => '<circle r="2" class="md-air" opacity="0"/>').join('')}`;

    const E = {
      clip: $('#vl-f-clip', frontSvg),
      musG: $('#vl-f-musG', frontSvg),
      muscles: $$('.md-muscle', frontSvg),
      opening: $('#vl-f-opening', frontSvg),
      tongueF: $('#vl-f-tongue', frontSvg),
      teethLo: $('#vl-f-teethLo', frontSvg),
      gapsLo: $('#vl-f-gapsLo', frontSvg),
      teethUp: $('#vl-f-teethUp', frontSvg),
      gapsUp: $('#vl-f-gapsUp', frontSvg),
      lower: $('#vl-f-lower', frontSvg),
      tip: $('#vl-f-tip', frontSvg),
      upper: $('#vl-f-upper', frontSvg),
      nasal: $('#vl-s-nasal', sideSvg),
      throat: $('#vl-s-throat', sideSvg),
      palate: $('#vl-s-palate', sideSvg),
      tongueS: $('#vl-s-tongue', sideSvg),
      toothLo: $('#vl-s-toothLo', sideSvg),
      face: $('#vl-s-face', sideSvg),
      upperLip: $('#vl-s-upperLip', sideSvg),
      lowerLip: $('#vl-s-lowerLip', sideSvg),
      chin: $('#vl-s-chin', sideSvg),
      neck: $('#vl-s-neck', sideSvg),
      box: $('#vl-s-box', sideSvg),
      folds: $('#vl-s-folds', sideSvg),
      rings: $$('.md-ring', sideSvg),
      parts: $$('.md-air', sideSvg)
    };

    const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const f = n => n.toFixed(1);
    const mix = (c1, c2, t) => {
      const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
      const a = p(c1), b = p(c2);
      return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
    };
    function smoothPath(pts, closed) {
      const n = pts.length;
      const P = i => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
      let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
      const last = closed ? n : n - 1;
      for (let i = 0; i < last; i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      }
      return d + (closed ? 'Z' : '');
    }

    function computeFront(P, t) {
      const cx = 120, cy = 104;
      const hw = Math.max(16, 33 + 21 * P.spread - 19 * P.round + 2 * P.press);
      const gap = (2 + 34 * P.open * (1 - P.press)) * (1 - 0.75 * P.tuck);
      const gT = gap * 0.42 + 10 * P.tuck, gB = gap * 0.58 + 0.5;
      const n = lerp(2.5, 2.0, P.round) + 0.5 * P.press;
      const N = 28;
      const edge = top => {
        const out = [];
        for (let i = 0; i <= N; i++) {
          const th = (top ? 1 : -1) * Math.PI * (i / N);
          const c = Math.cos(th), s = Math.sin(th);
          out.push([cx + hw * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), cy - (top ? gT : -gB) * Math.pow(Math.abs(s), 2 / n)]);
        }
        return out;
      };
      const top = edge(true), bot = edge(false);
      const opening = smoothPath([...top, ...bot.slice(1, -1).reverse()], true);
      const thin = 1 - 0.3 * P.spread * (0.4 + 0.6 * P.tension);
      const tU = (10 + 4 * P.round + 2 * P.press) * thin, tL = (13 + 5 * P.round + 2 * P.press + 2 * P.tuck) * thin;
      const outer = (pts, k, up) => pts.map(([x, y]) => {
        const u = Math.abs((x - cx) / (hw + 0.01));
        const bow = up ? (1 - 0.32 * Math.exp(-(((x - cx) / 7) ** 2)) + 0.12 * Math.exp(-(((Math.abs(x - cx) - hw * 0.34) / 8) ** 2))) : 1;
        const th = k * Math.pow(Math.max(0, 1 - u * u), 0.55) * bow;
        return [x + (x - cx) * 0.04 * (1 - u), y + (up ? -th : th)];
      });
      const upOut = outer(top, tU, true), loOut = outer(bot, tL, false);
      const cornerR = [cx + hw + 2.5, cy + 0.5], cornerL = [cx - hw - 2.5, cy + 0.5];
      const upper = smoothPath([cornerR, ...upOut.slice(1, -1), cornerL, ...top.slice(1, -1).reverse()], true);
      const lower = smoothPath([cornerR, ...loOut.slice(1, -1), cornerL, ...bot.slice(1, -1).reverse()], true);
      const tw = Math.min(54, hw * 1.25);
      const lt = cy + 1.5 + P.jaw * 26;
      const teethUp = `M${f(cx - tw)} ${cy - 22}H${f(cx + tw)}V${cy - 1}Q${f(cx + tw)} ${cy + 1} ${f(cx + tw - 3)} ${cy + 1}H${f(cx - tw + 3)}Q${f(cx - tw)} ${cy + 1} ${f(cx - tw)} ${cy - 1}Z`;
      const teethLo = `M${f(cx - tw * 0.9)} ${f(lt + 20)}H${f(cx + tw * 0.9)}V${f(lt + 2)}Q${f(cx + tw * 0.9)} ${f(lt)} ${f(cx + tw * 0.9 - 3)} ${f(lt)}H${f(cx - tw * 0.9 + 3)}Q${f(cx - tw * 0.9)} ${f(lt)} ${f(cx - tw * 0.9)} ${f(lt + 2)}Z`;
      const gapsUp = [-0.5, 0, 0.5].map(k => `M${f(cx + k * tw)} ${cy - 12}V${cy + 1}`).join('') + [-0.82, 0.82].map(k => `M${f(cx + k * tw)} ${cy - 10}V${cy}`).join('');
      const gapsLo = [-0.42, 0, 0.42].map(k => `M${f(cx + k * tw)} ${f(lt)}V${f(lt + 9)}`).join('');
      const tTop = lt + 9 - 10 * Math.max(0, P.front) + 6 * Math.max(0, -P.front);
      const tongue = `M${f(cx - 38)} ${f(cy + 60)}Q${f(cx - 36)} ${f(tTop)} ${cx} ${f(tTop)}Q${f(cx + 36)} ${f(tTop)} ${f(cx + 38)} ${f(cy + 60)}Z`;
      const tipOut = sm(0.05, 0.4, P.tipZ);
      const tip = tipOut > 0.01 ? `M${f(cx - 17)} ${f(cy + 5)}Q${cx} ${f(cy - 4 + 6 * (1 - tipOut))} ${f(cx + 17)} ${f(cy + 5)}Q${cx} ${f(cy + 5 + 10 * tipOut)} ${f(cx - 17)} ${f(cy + 5)}Z` : 'M0 0';
      const tens = P.tension;
      const quiver = !reduced && tens > 0.6 ? Math.sin(t * 62) * 1.3 * (tens - 0.6) / 0.4 : 0;
      const muscles = [-1, 1].flatMap(sd => {
        const c0 = [cx + sd * (hw + 2), cy];
        const ends = [[cx + sd * 92, cy - 62], [cx + sd * 104, cy - 2]];
        return ends.map(([ex, ey], k) => {
          const mx = (c0[0] + ex) / 2, my = (c0[1] + ey) / 2 + (1 - tens) * (k ? 15 : 20) + quiver * (k ? 1 : -1);
          return `M${f(c0[0])} ${f(c0[1])}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
        });
      });
      const muscleColor = mix('#3D8FBF', '#E8553C', sm(0.2, 0.85, tens));
      return { opening, upper, lower, teethUp, teethLo, gapsUp, gapsLo, tongue, tip, muscles, muscleColor, tens };
    }

    const PIV = [70, 70];
    function rot(p, a) {
      const c = Math.cos(a), s = Math.sin(a), x = p[0] - PIV[0], y = p[1] - PIV[1];
      return [PIV[0] + x * c - y * s, PIV[1] + x * s + y * c];
    }
    function computeSide(P) {
      const ja = P.jaw * 0.1;
      const J = p => rot([p[0], p[1] + P.jaw * 3], ja);
      const pr = 7 * P.round - 2.5 * P.spread;
      const gap = (1 + 13 * P.open * (1 - P.press)) * (1 - 0.8 * P.tuck);
      const face = smoothPath([[170, 4], [182, 26], [181, 40], [196, 56], [211, 68], [204, 74], [192, 76], [188, 82]], false);
      const upperLip = smoothPath([[188, 82], [195 + pr, 88.5], [196 + pr, 95], [191.5 + pr, 100 - gap / 2], [183, 99.5 - gap / 2 - 2 * P.tuck], [180.5, 91]], true);
      const tuckY = P.tuck * 9;
      const ll = [[182, 101 + gap / 2 - tuckY], [190.5 + pr - 3 * P.tuck, 101 + gap / 2 - tuckY * 0.9], [194.5 + pr - 4 * P.tuck, 108 - tuckY * 0.5], [189, 116.5], [180.5, 112]];
      const lowerLip = smoothPath(ll.map(J), true);
      const chin = [[189, 116.5], [186, 124], [191, 134], [190, 147], [176, 157], [150, 162], [128, 163]];
      const chinLine = smoothPath(chin.map(J), false);
      const neck = smoothPath([J([128, 163]), [116, 170], [110, 190]], false);
      const palate = smoothPath([[176, 84], [168, 81], [150, 74], [124, 72], [104, 76], [92, 86], [88, 94]], false);
      const throatBack = smoothPath([[66, 78], [74, 96], [76, 130], [78, 190]], false);
      const nasal = smoothPath([[92, 86], [96, 66], [140, 62], [186, 66]], false);
      const toothLo = smoothPath([[174, 103], [180.5, 102], [180, 112], [173, 118], [171, 108]].map(J), true);
      const yb = 104 - 16 * P.back, ym = 98 - 14 * P.mid, yf = 101 - 13 * P.front;
      const tx = 172 + 22 * P.tipZ, ty = 96 - 17 * P.tipY;
      const Jw = p => { const q = J(p); const w = clamp((p[0] - 92) / 60, 0, 1); return [lerp(p[0], q[0], w), lerp(p[1], q[1], w)]; };
      const tonguePts = [[88, 158], [86, 138], [91, yb + 9], [104, yb], [128, ym], [151, yf], [tx - 4, ty - 2], [tx + 1.5, ty + 1.5], [tx - 5, ty + 6], [150, 118], [127, 126], [104, 136], [92, 150]];
      const tongue = smoothPath(tonguePts.map(Jw), true);
      const lipX = 194 + pr;
      return { face, upperLip, lowerLip, chinLine, neck, palate, throatBack, nasal, toothLo, tongue, air: [lipX - 2, 100] };
    }

    const M = {
      cur: { ...SHAPES.ih },
      vel: Object.fromEntries(KEYS.map(k => [k, 0])),
      pose: 'ih',
      playSeq: null,
      playStart: 0,
      playDur: 0.4,
      voice: 0,
      lastRing: 0,
      rafId: null,
      visible: false
    };

    function spawnRing() {
      const el = E.rings.find(r => !r._on);
      if (!el) return;
      el._on = true;
      el._life = 0;
    }

    function stepParticles(dt) {
      let alive = false;
      E.rings.forEach(el => {
        if (!el._on) return;
        el._life += dt;
        const u = el._life / 0.65;
        if (u >= 1) { el._on = false; el.setAttribute('opacity', '0'); return; }
        alive = true;
        el.setAttribute('transform', `translate(${(84 - 2 * u).toFixed(1)},${(158 - 54 * u).toFixed(1)}) scale(${(1 + 0.48 * u).toFixed(2)})`);
        el.setAttribute('opacity', (0.85 * (1 - u)).toFixed(2));
      });
      return alive;
    }

    function drawMouth(t) {
      const P = M.cur;
      const g = computeFront(P, t);
      E.opening.setAttribute('d', g.opening);
      E.clip.setAttribute('d', g.opening);
      E.upper.setAttribute('d', g.upper);
      E.lower.setAttribute('d', g.lower);
      E.teethUp.setAttribute('d', g.teethUp);
      E.teethLo.setAttribute('d', g.teethLo);
      E.gapsUp.setAttribute('d', g.gapsUp);
      E.gapsLo.setAttribute('d', g.gapsLo);
      E.tongueF.setAttribute('d', g.tongue);
      E.tip.setAttribute('d', g.tip);
      E.muscles.forEach((m, i) => {
        m.setAttribute('d', g.muscles[i]);
        m.style.stroke = g.muscleColor;
        m.style.strokeWidth = (5 + 3.5 * g.tens).toFixed(2);
      });

      const s = computeSide(P);
      E.face.setAttribute('d', s.face);
      E.upperLip.setAttribute('d', s.upperLip);
      E.lowerLip.setAttribute('d', s.lowerLip);
      E.chin.setAttribute('d', s.chinLine);
      E.neck.setAttribute('d', s.neck);
      E.palate.setAttribute('d', s.palate);
      E.throat.setAttribute('d', s.throatBack);
      E.nasal.setAttribute('d', s.nasal);
      E.toothLo.setAttribute('d', s.toothLo);
      E.tongueS.setAttribute('d', s.tongue);

      const v = M.voice;
      E.box.style.fill = mix('#E3EAD9', '#1E7FA3', v);
      E.folds.setAttribute('transform', `translate(${(Math.sin(t * 2 * Math.PI * 22) * 1.4 * v).toFixed(2)},0)`);
    }

    let lastTs = performance.now();
    function tick(now) {
      M.rafId = null;
      if (!M.visible) return;
      const dt = Math.min(1 / 24, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      const tSec = now / 1000;

      let target = SHAPES[M.pose] || SHAPES.rest;
      let vT = 0;
      if (M.playSeq) {
        const elapsed = tSec - M.playStart;
        const frac = elapsed / M.playDur;
        if (frac >= 1) {
          M.playSeq = null;
        } else {
          const sh = frac < 0.16 ? M.playSeq[0] : (frac < 0.82 ? M.playSeq[1] : M.playSeq[2]);
          target = SHAPES[sh] || target;
          if (frac >= 0.14 && frac <= 0.85) vT = 1;
        }
      }

      const nSub = Math.ceil(dt / 0.006), h = dt / nSub;
      let moving = false;
      KEYS.forEach(k => {
        const w = (k === 'press' || k === 'tuck') ? 44 : (k === 'tension' ? 13 : 28);
        for (let q = 0; q < nSub; q++) {
          const a = w * w * (target[k] - M.cur[k]) - 1.84 * w * M.vel[k];
          M.vel[k] += a * h;
          M.cur[k] += M.vel[k] * h;
        }
        if (Math.abs(target[k] - M.cur[k]) > 0.002 || Math.abs(M.vel[k]) > 0.01) moving = true;
      });

      M.voice += (vT - M.voice) * Math.min(1, dt * 18);
      if (M.voice > 0.5 && tSec - M.lastRing > 0.12) { M.lastRing = tSec; spawnRing(); }
      const alive = stepParticles(dt);
      drawMouth(tSec);

      const tenseQuiver = !reduced && M.cur.tension > 0.6;
      if (moving || alive || M.playSeq || M.voice > 0.02 || tenseQuiver) {
        M.rafId = requestAnimationFrame(tick);
      }
    }

    function wakeMouth() {
      if (!M.visible || M.rafId) return;
      lastTs = performance.now();
      M.rafId = requestAnimationFrame(tick);
    }

    let pairKey = 'git';
    let activeSide = 'short';
    let quizOn = false;
    let quizQueue = [];
    let quizIdx = 0;
    let quizDone = false;

    const tileLong = $('#vl-tile-long');
    const tileShort = $('#vl-tile-short');
    const statusPill = $('#vl-mouth-status');
    const statusText = $('#vl-status-text');
    const quizToggleBtn = $('#vl-quiz-toggle');
    const quizBar = $('#vl-quiz-bar');
    const quizPlayBtn = $('#vl-quiz-play');
    const quizScoreEl = $('#vl-quiz-score');

    function setMouthSide(side, animateWord) {
      activeSide = side;
      const item = PAIRS[pairKey][side];
      M.pose = item.pose;
      if (animateWord) {
        M.playSeq = item.seq;
        M.playStart = performance.now() / 1000;
        M.playDur = side === 'long' ? 0.52 : 0.34;
      }
      if (tileLong && tileShort) {
        tileLong.classList.toggle('is-active', !quizOn && side === 'long');
        tileShort.classList.toggle('is-active', !quizOn && side === 'short');
      }
      if (statusPill && statusText) {
        statusPill.className = 'mouth-status ' + (side === 'long' ? 'tense' : 'relaxed');
        statusText.textContent = item.status;
      }
      wakeMouth();
    }

    function renderPair() {
      const p = PAIRS[pairKey];
      $$('.vl-pair-btn', stage).forEach(b => {
        const on = b.dataset.vlPair === pairKey;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
      });
      $('#vl-word-long').textContent = p.long.word;
      $('#vl-sub-long').textContent = p.long.sub;
      $('#vl-word-short').textContent = p.short.word;
      $('#vl-sub-short').textContent = p.short.sub;
      $('#vl-lbl-long').textContent = p.long.word;
      $('#vl-lbl-short').textContent = p.short.word;
      $('#vl-bar-long').style.width = `${p.long.pct}%`;
      $('#vl-bar-short').style.width = `${p.short.pct}%`;
      $('#vl-ms-long').textContent = p.long.tag;
      $('#vl-ms-short').textContent = p.short.tag;
      $('#vl-l1-note').innerHTML = `<span class="vl-l1-ico">💬</span><span>${p.bn}</span>`;
      prefetchClip(p.long.clip);
      prefetchClip(p.short.clip);
      setMouthSide(activeSide, false);
    }

    function speakSide(side) {
      const item = PAIRS[pairKey][side];
      const tile = side === 'long' ? tileLong : tileShort;
      if (tile) tile.classList.add('is-speaking');
      setMouthSide(side, true);
      return speakClip(item.clip, item.fallback, { force: true }).finally(() => {
        if (tile) tile.classList.remove('is-speaking');
      });
    }

    function buildQuizRound() {
      const base = ['short', 'long', 'short'];
      for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
      }
      quizQueue = base;
      quizIdx = 0;
      quizDone = false;
      if (quizScoreEl) quizScoreEl.textContent = '0 / 3';
      [tileLong, tileShort].forEach(t => t && t.classList.remove('is-right', 'is-wrong', 'is-active'));
    }

    function playQuizTarget(force) {
      if (!quizOn || quizDone) return;
      const side = quizQueue[quizIdx];
      const item = PAIRS[pairKey][side];
      setMouthSide(side, true);
      speakClip(item.clip, item.fallback, { force: !!force });
    }

    function setQuizMode(on) {
      quizOn = on;
      if (quizToggleBtn) quizToggleBtn.setAttribute('aria-pressed', String(on));
      if (quizBar) quizBar.hidden = !on;
      [tileLong, tileShort].forEach(t => t && t.classList.remove('is-right', 'is-wrong'));
      if (on) {
        buildQuizRound();
        if (soundOn && userInteracted) playQuizTarget(false);
      } else {
        setMouthSide(activeSide, false);
      }
    }

    $$('.vl-pair-btn', stage).forEach(btn => {
      btn.addEventListener('click', () => {
        userInteracted = true;
        pairKey = btn.dataset.vlPair;
        renderPair();
        if (quizOn) {
          buildQuizRound();
          playQuizTarget(true);
        }
      });
    });

    [tileLong, tileShort].forEach(tile => {
      if (!tile) return;
      tile.addEventListener('click', () => {
        userInteracted = true;
        const side = tile.dataset.vlSide;
        if (!quizOn) {
          speakSide(side);
          return;
        }
        if (quizDone) {
          buildQuizRound();
          playQuizTarget(true);
          return;
        }
        const expected = quizQueue[quizIdx];
        if (side === expected) {
          playChime(true);
          tile.classList.add('is-right');
          quizIdx++;
          if (quizScoreEl) quizScoreEl.textContent = `${quizIdx} / 3`;
          if (quizIdx >= 3) {
            quizDone = true;
            if (quizScoreEl) quizScoreEl.textContent = '🎉 3 / 3';
            pulseNext(true);
          } else {
            setTimeout(() => {
              tile.classList.remove('is-right');
              if (quizOn && currentStep === 3) playQuizTarget(false);
            }, 720);
          }
        } else {
          playChime(false);
          tile.classList.remove('is-wrong');
          void tile.offsetWidth;
          tile.classList.add('is-wrong');
          playQuizTarget(true);
        }
      });
    });

    const bothBtn = $('#vl-both-btn');
    if (bothBtn) {
      bothBtn.addEventListener('click', async () => {
        userInteracted = true;
        if (quizOn) setQuizMode(false);
        await speakSide('long');
        if (currentStep === 3) {
          await new Promise(r => setTimeout(r, 180));
          await speakSide('short');
        }
      });
    }

    if (quizToggleBtn) {
      quizToggleBtn.addEventListener('click', () => {
        userInteracted = true;
        setQuizMode(!quizOn);
      });
    }
    if (quizPlayBtn) {
      quizPlayBtn.addEventListener('click', () => {
        userInteracted = true;
        if (quizDone) buildQuizRound();
        playQuizTarget(true);
      });
    }

    stepEnterHooks.push(s => {
      M.visible = (s === 3);
      if (M.visible) wakeMouth();
      else if (M.rafId) { cancelAnimationFrame(M.rafId); M.rafId = null; }
    });

    drawMouth(0);
    renderPair();
  })();

  /* ------------------------------------------------------------------ */
  /* 5. GPA WORDLESS LABS (SCREENS 4, 6, 8) + RANDOM HEAR & POINT (5,7) */
  /* ------------------------------------------------------------------ */
  const VOCAB = Array.isArray(window.GPA_VOCAB_WORDS) ? window.GPA_VOCAB_WORDS : [];
  if (window.GPA_SHARED_DEFS_SVG && !$('#gpa-defs-host')) {
    const host = document.createElement('div');
    host.id = 'gpa-defs-host';
    host.innerHTML = window.GPA_SHARED_DEFS_SVG;
    document.body.prepend(host.firstElementChild);
  }

  function renderGpaCard(w, numLabel, revealOn) {
    return `
      <button type="button" class="gpa-card" data-id="${w.id}" aria-label="Word ${numLabel}">
        <span class="gpa-num">${numLabel}</span>
        <div class="gpa-anim-box">
          <svg viewBox="0 0 240 160" aria-hidden="true">${w.svg}</svg>
        </div>
        <div class="gpa-reveal" ${revealOn ? '' : 'hidden'}>
          <div class="gpa-word-row">
            <b>${esc(w.word)}</b>
            <span class="gpa-phonetic">${esc(w.phonetic || w.word.toUpperCase())}</span>
          </div>
          <span class="gpa-analogy">${esc(w.analogy)}</span>
          <span class="bn gpa-bn" lang="bn">${esc(w.bn)}</span>
        </div>
      </button>`;
  }

  function shuffleIds(list) {
    const out = list.map(w => w.id);
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function initGpaWatch(shellSel, startIdx, count, setClipId) {
    const shell = $(shellSel);
    if (!shell) return;
    const slice = VOCAB.slice(startIdx, startIdx + count);
    const grid = $('.js-gpa-grid', shell);
    const playBtn = $('.js-gpa-play', shell);
    const slowBtn = $('.js-gpa-slow', shell);
    const revBtn = $('.js-gpa-rev', shell);

    let revealed = false;
    let slow = false;
    let playingAll = false;
    let playToken = 0;

    grid.innerHTML = slice.map((w, i) => renderGpaCard(w, startIdx + i + 1, revealed)).join('');
    slice.forEach(w => prefetchClip(`gpa-say-${w.id}`));
    if (setClipId) prefetchClip(setClipId);

    function syncReveal() {
      $$('.gpa-reveal', grid).forEach(el => { el.hidden = !revealed; });
      if (revBtn) revBtn.setAttribute('aria-pressed', String(revealed));
    }

    function stopPlayAll() {
      playToken++;
      playingAll = false;
      if (playBtn) playBtn.textContent = '▶';
    }

    grid.addEventListener('click', e => {
      const card = e.target.closest('.gpa-card');
      if (!card) return;
      userInteracted = true;
      const id = card.dataset.id;
      const w = slice.find(x => x.id === id);
      if (!w) return;

      stopPlayAll();
      $$('.gpa-card', grid).forEach(c => c.classList.toggle('pointed', c === card));
      speakClip(`gpa-say-${w.id}`, w.say, { slow, el: card, force: true });
    });

    if (playBtn) {
      playBtn.addEventListener('click', async () => {
        userInteracted = true;
        if (playingAll) { stopPlayAll(); stopVoice(); return; }
        const tok = ++playToken;
        playingAll = true;
        playBtn.textContent = '❚❚';
        for (const w of slice) {
          if (tok !== playToken) break;
          const card = $(`.gpa-card[data-id="${w.id}"]`, grid);
          $$('.gpa-card', grid).forEach(c => c.classList.toggle('pointed', c === card));
          await speakClip(`gpa-say-${w.id}`, w.say, { slow, el: card, force: true });
          if (tok !== playToken) break;
          await new Promise(r => setTimeout(r, 220));
        }
        if (tok === playToken) {
          playingAll = false;
          playBtn.textContent = '▶';
          $$('.gpa-card', grid).forEach(c => c.classList.remove('pointed'));
        }
      });
    }

    if (slowBtn) {
      slowBtn.addEventListener('click', () => {
        slow = !slow;
        slowBtn.setAttribute('aria-pressed', String(slow));
      });
    }

    if (revBtn) {
      revBtn.addEventListener('click', () => {
        revealed = !revealed;
        syncReveal();
      });
    }

    stepEnterHooks.push(() => { stopPlayAll(); });
  }

  function initGpaGame(shellSel, screenIdx, startIdx, count) {
    const shell = $(shellSel);
    if (!shell) return;
    const slice = VOCAB.slice(startIdx, startIdx + count);
    const grid = $('.js-game-grid', shell);
    const dotsEl = $('.js-game-dots', shell);
    const cueEl = $('.js-game-cue', shell);
    const replayBtn = $('.js-game-replay', shell);
    const slowBtn = $('.js-game-slow', shell);
    const peekBtn = $('.js-game-peek', shell);
    const resetBtn = $('.js-game-reset', shell);

    let slow = false;
    let peek = false;
    let order = [];
    let pos = 0;
    let finished = false;
    let advanceTimer = null;

    slice.forEach(w => prefetchClip(`gpa-pt-${w.id}`));

    function paintDots() {
      dotsEl.innerHTML = order.map((_, i) =>
        `<span class="game-dot ${i < pos ? 'done' : (i === pos && !finished ? 'now' : '')}"></span>`
      ).join('');
    }

    function speakTarget(force) {
      if (finished || pos >= order.length) return;
      const w = slice.find(x => x.id === order[pos]);
      if (!w) return;
      if (cueEl) {
        cueEl.textContent = `🔊 ${pos + 1} / ${order.length}`;
        cueEl.classList.add('listening');
      }
      speakClip(`gpa-pt-${w.id}`, `Point to: ${w.spokenWord || w.word}.`, { slow, force: !!force }).finally(() => {
        if (cueEl) cueEl.classList.remove('listening');
      });
    }

    function startRound(autoSpeak) {
      clearTimeout(advanceTimer);
      order = shuffleIds(slice);
      pos = 0;
      finished = false;
      grid.innerHTML = slice.map((w, i) => renderGpaCard(w, startIdx + i + 1, peek)).join('');
      paintDots();
      if (autoSpeak) speakTarget(false);
    }

    grid.addEventListener('click', e => {
      const card = e.target.closest('.gpa-card');
      if (!card) return;
      userInteracted = true;
      if (finished) { startRound(true); return; }
      const expectedId = order[pos];
      if (card.dataset.id === expectedId) {
        playChime(true);
        card.classList.add('found');
        pos++;
        paintDots();
        if (pos >= order.length) {
          finished = true;
          if (cueEl) cueEl.textContent = `🎉 ${order.length} / ${order.length}!`;
          pulseNext(true);
        } else {
          if (cueEl) cueEl.textContent = '✓';
          clearTimeout(advanceTimer);
          advanceTimer = setTimeout(() => {
            if (currentStep === screenIdx && !finished) speakTarget(false);
          }, 850);
        }
      } else {
        playChime(false);
        card.classList.remove('wiggle');
        void card.offsetWidth;
        card.classList.add('wiggle');
        if (cueEl) cueEl.textContent = '↺ Listen again';
        speakTarget(true);
      }
    });

    if (replayBtn) replayBtn.addEventListener('click', () => { userInteracted = true; if (finished) startRound(true); else speakTarget(true); });
    if (slowBtn) slowBtn.addEventListener('click', () => { slow = !slow; slowBtn.setAttribute('aria-pressed', String(slow)); });
    if (peekBtn) {
      peekBtn.addEventListener('click', () => {
        peek = !peek;
        peekBtn.setAttribute('aria-pressed', String(peek));
        $$('.gpa-reveal', grid).forEach(el => { el.hidden = !peek; });
      });
    }
    if (resetBtn) resetBtn.addEventListener('click', () => { userInteracted = true; startRound(true); });

    stepEnterHooks.push(s => {
      if (s === screenIdx) startRound(soundOn && userInteracted);
      else clearTimeout(advanceTimer);
    });
    startRound(false);
  }

  initGpaWatch('#gpa-watch-core', 0, 6, 'gpa-set-a');
  initGpaGame('#gpa-game-core', 5, 0, 6);
  initGpaWatch('#gpa-watch-safety', 6, 5, 'gpa-set-b');
  initGpaGame('#gpa-game-safety', 7, 6, 5);
  initGpaWatch('#gpa-watch-pro', 11, 5, 'gpa-set-c');
  initGpaGame('#gpa-game-pro', 9, 11, 5);

  /* ------------------------------------------------------------------ */
  /* 6. SCREEN 9 GIT RAILWAY + SCREEN 10 CLOUD SYNC FLOW                 */
  /* ------------------------------------------------------------------ */
  (function initRailwayAndSync() {
    const treeStage = $('#git-tree-stage');
    if (treeStage) {
      const SCENES = {
        repo: {
          clip: 'tree-repo',
          app: '📦 Vault · main → c1',
          bn: 'গিটহাবে প্রজেক্টের মূল ভল্ট ফোল্ডার তৈরি',
          say: 'Repository, also called a repo. The master garage holding your whole project and every version.',
          head: 'translate(170, 72)'
        },
        commit: {
          clip: 'tree-commit',
          app: '✅ Safe checkpoint · main → c3',
          bn: 'প্রতিটি কমিট হলো কাজ করা অবস্থায় নিরাপদ সেভ-পয়েন্ট',
          say: 'Commit. A green working checkpoint you can always come back to.',
          head: 'translate(390, 72)'
        },
        branch: {
          clip: 'tree-branch',
          app: '🔀 Safe sandbox branch → b1 (main untouched)',
          bn: 'মূল অ্যাপ main নিরাপদ রেখে আলাদা Branch-এ পরীক্ষা',
          say: 'Branch. A safe side track where you can test bold new changes safely.',
          head: 'translate(485, 176)'
        },
        discard: {
          clip: 'tree-discard',
          app: '💥 Broken b2 discarded · YOU return to main (c3)',
          bn: 'ভাঙা Branch ফেলে দিলে কোনো ক্ষতি ছাড়াই c3-তে ফিরে আসবেন',
          say: 'Discard. Throw away the broken branch. Your main app is still green.',
          head: 'translate(390, 72)'
        },
        merge: {
          clip: 'tree-merge',
          app: '✨ Tested branch merged cleanly → c4!',
          bn: 'নতুন ফিচার পরীক্ষা সফল হলে main-এ Merge করে c4 তৈরি হয়',
          say: 'Merge. Join your tested new feature cleanly back into main.',
          head: 'translate(670, 72)'
        }
      };

      const show = (id, on) => { const el = $(id); if (el) el.style.opacity = on ? '1' : '0.12'; };
      let tourTimer = null;

      function setScene(key, speakNow) {
        const s = SCENES[key] || SCENES.repo;
        $$('.tc-btn[data-scene]', treeStage).forEach(b => b.classList.toggle('active', b.dataset.scene === key));
        $('#tic-app-state').textContent = s.app;
        $('#tic-bn').textContent = s.bn;

        const isCommitPlus = ['commit', 'branch', 'discard', 'merge'].includes(key);
        const isBranchPlus = ['branch', 'discard', 'merge'].includes(key);
        const isMerge = key === 'merge';
        const isDiscard = key === 'discard';

        show('#node-c1', true);
        show('#node-c2', isCommitPlus);
        show('#node-c3', isCommitPlus);
        show('#track-branch', isBranchPlus);
        show('#g-branch-label', isBranchPlus);
        show('#node-b1', isBranchPlus);
        show('#node-b2', isDiscard || isMerge);
        show('#track-merge-back', isMerge);
        show('#track-main-merge', isMerge);
        show('#node-c4', isMerge);

        const headPill = $('#svg-head-pill');
        if (headPill) headPill.setAttribute('transform', s.head);

        const setDraw = (id, on) => { const el = $(id); if (el) el.style.strokeDashoffset = on ? '0' : '280'; };
        setDraw('#track-branch', isBranchPlus);
        setDraw('#track-merge-back', isMerge);
        setDraw('#track-main-merge', isMerge);

        $('#b2-txt').textContent = isMerge ? '✨' : '💥';
        $('#node-b2 circle').setAttribute('fill', isMerge ? '#1f7a47' : '#b0563a');
        if (isDiscard) {
          $('#track-branch').style.opacity = '0.32';
          $('#node-b1').style.opacity = '0.32';
        }
        if (speakNow) speakClip(s.clip, s.say);
      }

      $$('.tc-btn[data-scene]', treeStage).forEach(b => {
        b.addEventListener('click', () => {
          userInteracted = true;
          clearInterval(tourTimer); tourTimer = null;
          $('#tc-auto').textContent = '▶ Tour';
          setScene(b.dataset.scene, true);
        });
      });

      const ORDER = ['repo', 'commit', 'branch', 'discard', 'merge'];
      $('#tc-auto').addEventListener('click', () => {
        userInteracted = true;
        if (tourTimer) { clearInterval(tourTimer); tourTimer = null; $('#tc-auto').textContent = '▶ Tour'; return; }
        let i = 0;
        setScene(ORDER[0], true);
        $('#tc-auto').textContent = '⏸ Stop';
        tourTimer = setInterval(() => {
          i = (i + 1) % ORDER.length;
          setScene(ORDER[i], false);
        }, 2200);
      });
      stepEnterHooks.push(s => { if (s !== 10 && tourTimer) { clearInterval(tourTimer); tourTimer = null; $('#tc-auto').textContent = '▶ Tour'; } });
      setScene('repo', false);
    }

    const syncStage = $('#sync-stage');
    const syncDiagram = $('#sync-diagram');
    if (syncStage && syncDiagram) {
      const SYNC_INFO = {
        commit: {
          clip: 'tree-commit',
          local: '📸 c4 saved locally',
          cloud: 'Waiting for Push… (c3)',
          live: 'v1.0 Online',
          p1: 'Local only',
          p2: 'Not pushed',
          cap: '<b>📸 Commit saves on your laptop · not in cloud yet</b>',
          bn: 'কমিট নিজের ডিভাইসে সেভ করে; ক্লাউডে পাঠাতে Push করুন'
        },
        push: {
          clip: 'sync-push',
          local: '✅ Synced with GitHub',
          cloud: '⬆️ Received c4 safely!',
          live: '🚀 Auto-updated to c4!',
          p1: 'Uploading ⬆️',
          p2: 'Deploying 🚀',
          cap: '<b>⬆️ Push uploads commits to GitHub &amp; updates your live site</b>',
          bn: 'Push করলে কোড গিটহাব ক্লাউডে উঠে যায় এবং লাইভ সাইট আপডেট হয়'
        },
        pull: {
          clip: 'sync-pull',
          local: '⬇️ Updated with cloud',
          cloud: 'Latest commits on main',
          live: 'v1.1 Online',
          p1: 'Downloading ⬇️',
          p2: 'Synced',
          cap: '<b>⬇️ Pull downloads newer commits from GitHub to your laptop</b>',
          bn: 'Pull গিটহাব ক্লাউড থেকে নতুন আপডেট আপনার ল্যাপটপে নামিয়ে আনে'
        },
        clone: {
          clip: 'sync-clone',
          local: '🧬 Full repo copied locally',
          cloud: 'GitHub Repository',
          live: 'Ready in IDE',
          p1: 'Cloning repo ⬇️',
          p2: 'Full copy',
          cap: '<b>🧬 Clone downloads a full repo copy so you can open it in an IDE</b>',
          bn: 'Clone পুরো রিপো কপি করে আপনার AI IDE-তে ওপেন করার ব্যবস্থা করে'
        }
      };

      $$('.sy-btn', syncStage).forEach(btn => {
        btn.addEventListener('click', () => {
          userInteracted = true;
          const act = btn.dataset.act;
          const d = SYNC_INFO[act];
          $$('.sy-btn', syncStage).forEach(b => b.classList.toggle('active', b === btn));
          syncDiagram.dataset.act = act;
          $('#sy-local-badge').textContent = d.local;
          $('#sy-cloud-badge').textContent = d.cloud;
          $('#sy-live-badge').textContent = d.live;
          $('#sy-pipe-1-lbl').textContent = d.p1;
          $('#sy-pipe-2-lbl').textContent = d.p2;
          $('#sync-caption').innerHTML = `${d.cap}<span class="bn" lang="bn">${d.bn}</span>`;
          speakClip(d.clip, d.cap.replace(/<[^>]+>/g, ''), { el: btn });
        });
      });
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 6A. SCREEN 11: WHERE DO YOU BUILD? BRIDGE                          */
  /* ------------------------------------------------------------------ */
  (function initWhereBuild() {
    const root = $('#where-build');
    if (!root) return;
    const cards = $$('.wb-card', root);
    const clips = {
      browser: { clip: 'where-browser', say: 'Browser mode with Google AI Studio is the easiest first step. Nothing to install, just describe your idea and save to GitHub.' },
      laptop: { clip: 'where-laptop', say: 'Laptop mode with an AI IDE or CLI is an optional pro step when your project grows bigger.' }
    };

    function pick(mode, speakNow) {
      cards.forEach(c => c.classList.toggle('active', c.dataset.wb === mode));
      const d = clips[mode] || clips.browser;
      if (speakNow) {
        const hearBtn = $(`#wb-hear-${mode}`, root);
        speakClip(d.clip, d.say, { el: hearBtn, force: true });
      }
    }

    cards.forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.tk-mini-btn')) return;
        userInteracted = true;
        pick(card.dataset.wb, true);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          userInteracted = true;
          pick(card.dataset.wb, true);
        }
      });
    });

    const hb = $('#wb-hear-browser');
    if (hb) hb.addEventListener('click', e => { e.stopPropagation(); userInteracted = true; pick('browser', true); });
    const hl = $('#wb-hear-laptop');
    if (hl) hl.addEventListener('click', e => { e.stopPropagation(); userInteracted = true; pick('laptop', true); });
  })();

  /* ------------------------------------------------------------------ */
  /* 6B. SCREEN 12: VISUAL IDE vs TERMINAL CLI COMPARISON               */
  /* ------------------------------------------------------------------ */
  (function initToolsCompare() {
    const root = $('#tools-compare');
    if (!root) return;

    const ACTIONS = {
      commit: {
        ide: '<div class="tc-ide-bar"><span>📄 index.html</span><span>SOURCE CONTROL</span></div><div class="tc-ide-body"><div class="tc-ide-in">Add bKash fee</div><span class="tc-ide-btn is-glow">✓ Commit</span></div>',
        ai: '🤖 Ask AI: “Save a checkpoint for bKash fee”',
        cmd: 'git commit -m "Add bKash fee"',
        out: '[main 309c] Add bKash fee ✓',
        clip: 'gpa-say-commit',
        say: 'Commit. Save a named checkpoint.'
      },
      push: {
        ide: '<div class="tc-ide-bar"><span>☁️ 1 commit ready</span><span>GitHub</span></div><div class="tc-ide-body"><div class="tc-ide-in">1↑ Upload c4</div><span class="tc-ide-btn good is-glow">☁️ Sync / Push ↑</span></div>',
        ai: '🤖 Ask AI: “Upload my commits to GitHub”',
        cmd: 'git push origin main',
        out: '✓ Pushed main → github.com',
        clip: 'sync-push',
        say: 'Push sends your saved commits up to the GitHub cloud.'
      },
      branch: {
        ide: '<div class="tc-ide-bar"><span>Bottom-left bar</span><span>Branches</span></div><div class="tc-ide-body"><div class="tc-ide-in">🔀 main → Branch</div><span class="tc-ide-btn gold is-glow">+ new-design</span></div>',
        ai: '🤖 Ask AI: “Open a safe new-design branch”',
        cmd: 'git checkout -b new-design',
        out: 'Switched to branch "new-design" ✓',
        clip: 'tree-branch',
        say: 'Branch. A safe side track where you can test bold new changes safely.'
      }
    };

    const ideMock = $('#tc-ide-mock');
    const cliMock = $('#tc-cli-mock');
    const cliAi = $('#tc-cli-ai');
    const cliCmd = $('#tc-cli-cmd');
    const cliOut = $('#tc-cli-out');

    function setAction(key, speakNow) {
      const a = ACTIONS[key] || ACTIONS.commit;
      $$('.tool-act-btn', root).forEach(b => b.classList.toggle('active', b.dataset.toolAct === key));
      if (ideMock) {
        ideMock.innerHTML = a.ide;
        ideMock.classList.remove('tc-pulse');
        void ideMock.offsetWidth;
        ideMock.classList.add('tc-pulse');
      }
      if (cliAi) cliAi.textContent = a.ai;
      if (cliCmd) cliCmd.textContent = a.cmd;
      if (cliOut) cliOut.textContent = a.out;
      if (cliMock) {
        cliMock.classList.remove('tc-pulse');
        void cliMock.offsetWidth;
        cliMock.classList.add('tc-pulse');
      }
      if (speakNow) speakClip(a.clip, a.say);
    }

    $$('.tool-act-btn', root).forEach(btn => {
      btn.addEventListener('click', () => {
        userInteracted = true;
        setAction(btn.dataset.toolAct, true);
      });
    });

    const hearIde = $('#tc-hear-ide');
    if (hearIde) {
      hearIde.addEventListener('click', () => {
        userInteracted = true;
        speakClip('tools-ide', 'Visual IDE. Click buttons, inspect files, and see live previews in tools like Antigravity, Cursor, and VS Code.', { el: hearIde, force: true });
      });
    }
    const hearCli = $('#tc-hear-cli');
    if (hearCli) {
      hearCli.addEventListener('click', () => {
        userInteracted = true;
        speakClip('tools-cli', 'Terminal C L I. Type Git commands directly, or let terminal agents like Claude Code and Codex run commands for you.', { el: hearCli, force: true });
      });
    }

    setAction('commit', false);
  })();

  /* ------------------------------------------------------------------ */
  /* 7. SCREENS 11, 12, 14B: LIVE UI DEMOS + 2-PASS STAGE FITTING       */
  /* ------------------------------------------------------------------ */
  const POINTER = '<svg viewBox="0 0 24 24"><path d="M5 2.5v17.2l4.3-4.1 2.9 6.6 2.9-1.3-2.9-6.5h6z" fill="#fff" stroke="#1d211c" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const IDE_ICO_FILES = '<svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  const IDE_ICO_SEARCH = '<svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  const IDE_ICO_BRANCH = '<svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>';

  function buildDemoHTML(track) {
    if (track === 'aistudio') {
      return `
      <div class="win-fit"><div class="win" data-view="ais">
        <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url"><span class="u">aistudio.google.com/apps</span></span></div>
        <div class="screen">
          <div class="v-ais">
            <div class="ais-top">
              <span class="ais-brand"><span class="ais-spark">✦</span> Google AI Studio · Build</span>
              <span class="ais-proj">rajshahi-mango-orders</span>
              <div class="ais-actions"><span class="ais-gh-btn">🐙 Save to GitHub</span></div>
            </div>
            <div class="ais-body">
              <div class="ais-chat">
                <div class="ais-msgs">
                  <div class="ais-u u1">Build a Rajshahi Mango order calculator with bKash fee.</div>
                  <div class="ais-a a1">✓ Created <code>index.html</code> &amp; <code>app.js</code>. Preview ready!</div>
                  <div class="ais-u u2">Add a WhatsApp order summary button at the bottom.</div>
                  <div class="ais-a a2">✓ Added WhatsApp button! Click <b>Save to GitHub</b>.</div>
                </div>
                <div class="ais-composer">
                  <div class="ais-in"><span class="c-text"></span><i class="caret"></i><span class="c-ph">Describe what to build…</span></div>
                  <span class="ais-send">↑</span>
                </div>
              </div>
              <div class="ais-preview">
                <div class="ais-pv-head"><b>Live Preview</b><span>localhost:preview</span></div>
                <div class="ais-file-tabs"><span class="on">index.html</span><span>app.js</span><span>style.css</span></div>
                <div class="ais-app-card empty">Waiting for prompt…</div>
              </div>
            </div>
            <div class="ais-modal">
              <div class="ais-dialog">
                <div class="ais-d-h"><span class="ais-m-title">🐙 Push to GitHub</span><span>✕</span></div>
                <label style="font-size:11.5px;font-weight:700;color:#475569"><span class="ais-m-lbl">Repository name</span>
                  <div class="ais-d-field"><span class="m-text"></span><i class="caret"></i></div>
                </label>
                <div class="ais-d-vis"><span>🌐 Public</span><span class="sel">🔒 Private ✓</span></div>
                <span class="ais-d-push">Create &amp; Push</span>
              </div>
            </div>
          </div>
          <div class="v-gh">
            <div class="gh-nav"><span>🐙 GitHub</span><span class="gh-repo-name">rafi-rajshahi / rajshahi-mango-orders</span><span class="gh-vis-pill">Private</span></div>
            <div class="gh-tabs"><span class="gh-tab on">&lt;&gt; Code</span><span class="gh-tab">Issues</span><span class="gh-tab">⚙ Settings</span></div>
            <div class="gh-body">
              <div class="gh-commit-bar"><span><b>rafi-rajshahi</b> · Add WhatsApp order summary button</span><span class="gh-clock-pill">🕒 2 commits</span></div>
              <div class="gh-file-list">
                <div class="gh-file-row"><span>📄 index.html</span><small>just now</small></div>
                <div class="gh-file-row"><span>📄 app.js</span><small>2 mins ago</small></div>
              </div>
            </div>
          </div>
          <div class="win-cursor">${POINTER}<span class="cursor-tag"></span><i class="ripple"></i></div>
          <button class="win-start" type="button"><span>▶</span><b class="ws-l">AI Studio → GitHub</b></button>
        </div>
      </div></div>`;
    }

    if (track === 'ide') {
      return `
      <div class="win-fit"><div class="win" data-view="ide">
        <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url"><span class="u">AI IDE · rajshahi-mango-orders</span></span></div>
        <div class="screen">
          <div class="v-ide">
            <div class="ide-main">
              <div class="ide-actbar">
                <span class="ide-ab-ico">${IDE_ICO_FILES}</span>
                <span class="ide-ab-ico">${IDE_ICO_SEARCH}</span>
                <span class="ide-ab-ico sc-icon">${IDE_ICO_BRANCH}<em class="ide-ab-badge">2</em></span>
              </div>
              <div class="ide-sidebar">
                <div class="ide-sb-h">SOURCE CONTROL</div>
                <div class="ide-commit-in"><span class="ide-c-text"></span><i class="caret"></i><span class="ide-c-ph" style="color:#888">Commit message…</span></div>
                <span class="ide-commit-btn">✓ Commit</span>
                <span class="ide-sync-btn">☁️ Sync Changes (1↑)</span>
                <div class="ide-changes"></div>
              </div>
              <div class="ide-center">
                <div class="ide-tabs"><span class="ide-tab tab-prev on">🌐 Preview</span><span class="ide-tab tab-diff">🔍 Diff</span></div>
                <div class="ide-view-body"></div>
              </div>
              <div class="ide-agent">
                <div style="font-weight:700;font-size:11px;color:#fff;margin-bottom:6px">✨ AI Agent</div>
                <div class="ide-ag-msgs"></div>
                <div class="ide-ag-in"><span class="ide-ag-text"></span><i class="caret"></i><span class="ide-ag-ph" style="color:#888">Ask AI…</span></div>
              </div>
            </div>
            <div class="ide-statusbar">
              <span class="ide-branch-pill">🔀 main</span>
              <span class="ide-sb-status">Synced</span>
            </div>
            <div class="ide-palette">
              <div class="ide-pal-in"><span class="pal-text"></span><i class="caret"></i></div>
              <div class="ide-pal-opt opt-new">+ Create new branch…</div>
              <div class="ide-pal-opt opt-main">🔀 main</div>
            </div>
          </div>
          <div class="win-cursor">${POINTER}<span class="cursor-tag"></span><i class="ripple"></i></div>
          <button class="win-start" type="button"><span>▶</span><b class="ws-l">Visual Git in IDE</b></button>
        </div>
      </div></div>`;
    }

    return `
      <div class="win-fit"><div class="win" data-view="gh">
        <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url"><span class="u">github.com/rafi-rajshahi/rajshahi-mango-orders</span></span></div>
        <div class="screen">
          <div class="v-gh">
            <div class="gh-nav"><span>🐙 GitHub</span><span class="gh-repo-name">rafi-rajshahi / rajshahi-mango-orders</span><span class="gh-vis-pill">Public</span></div>
            <div class="gh-tabs">
              <span class="gh-tab tab-code on">&lt;&gt; Code</span>
              <span class="gh-tab">Issues</span>
              <span class="gh-tab tab-set">⚙ Settings</span>
            </div>
            <div class="gh-body pages-body"></div>
          </div>
          <div class="win-cursor">${POINTER}<span class="cursor-tag"></span><i class="ripple"></i></div>
          <button class="win-start" type="button"><span>▶</span><b class="ws-l">GitHub Pages Live URL</b></button>
        </div>
      </div></div>`;
  }

  function Demo(root) {
    const track = root.dataset.track;
    root.innerHTML = buildDemoHTML(track) + `
      <div class="cap">
        <div class="cap-dots"></div>
        <div class="cap-line">
          <span class="cap-n">1</span>
          <div class="cap-body"><p class="cap-t"></p><p class="bn cap-bn" lang="bn"></p></div>
        </div>
        <div class="cap-ctl">
          <button type="button" class="cb cb-prev" aria-label="Previous step">‹</button>
          <button type="button" class="cb cb-play" aria-label="Play"><span class="ip">▶</span><span class="ipa">❚❚</span></button>
          <button type="button" class="cb cb-next" aria-label="Next step">›</button>
        </div>
      </div>`;

    const win = $('.win', root);
    const screen = $('.screen', root);
    const cursor = $('.win-cursor', root);
    const cursorTag = $('.cursor-tag', root);
    const capT = $('.cap-t', root);
    const capBn = $('.cap-bn', root);
    const capN = $('.cap-n', root);
    const dotsEl = $('.cap-dots', root);

    let S, token = 0, idx = 0, playing = false, fast = false, started = false;
    const CANCEL = {};
    const live = t => { if (t !== token) throw CANCEL; };
    const wait = (ms, t) => new Promise((res, rej) => {
      if (fast) return t === token ? res() : rej(CANCEL);
      setTimeout(() => (t === token ? res() : rej(CANCEL)), reduced ? ms * 0.55 : ms);
    });

    function pos(sel) {
      const el = typeof sel === 'string' ? $(sel, root) : sel;
      if (!el) return null;
      const a = el.getBoundingClientRect();
      const b = screen.getBoundingClientRect();
      const k = b.width / (screen.offsetWidth || b.width) || 1;
      return {
        x: (a.left - b.left + Math.min(a.width * 0.52, a.width - 8)) / k,
        y: (a.top - b.top + a.height * 0.55) / k,
        el
      };
    }

    async function point(sel, t, label = '') {
      $$('.hint', root).forEach(e => e.classList.remove('hint'));
      const p = pos(sel);
      if (!p) return;
      cursor.classList.add('on');
      if (cursorTag) cursorTag.textContent = label || '';
      cursor.style.transition = fast ? 'none' : '';
      cursor.style.transform = `translate(${p.x}px,${p.y}px)`;
      p.el.classList.add('hint');
      await wait(600, t);
    }

    async function tap(sel, t, label = '') {
      await point(sel, t, label);
      if (!fast) {
        cursor.classList.remove('tap');
        void cursor.offsetWidth;
        cursor.classList.add('tap');
      }
      await wait(220, t);
      $$('.hint', root).forEach(e => e.classList.remove('hint'));
    }

    async function typeInto(key, text, t) {
      S.typing = key;
      if (fast) { S[key] = text; render(); return; }
      for (let i = 1; i <= text.length; i++) {
        S[key] = text.slice(0, i);
        render();
        await wait(text[i - 1] === ' ' ? 42 : 24, t);
      }
      S.typing = null;
      render();
      await wait(220, t);
    }

    const init = () => {
      if (track === 'aistudio') return { view: 'ais', prompt: '', modalText: '', typing: null, msgs: 0, built: false, crates: 2, wa: false, modal: null, synced: false };
      if (track === 'ide') {
        return {
          agText: '', cText: '', palText: '', typing: null,
          agMsgs: 0, changes: 0, scOpen: false, diffOpen: false, diffSel: false,
          committed: false, synced: false, branch: 'main', palOpen: false, palMode: 'menu',
          coupon: false, crashed: false
        };
      }
      return { pageTab: 'code', setItem: 'general', branchSel: false, saved: false };
    };

    function render() {
      if (track === 'aistudio') {
        win.dataset.view = S.view;
        $('.u', root).textContent = S.view === 'gh' ? 'github.com/rafi-rajshahi/rajshahi-mango-orders' : 'aistudio.google.com/apps';
        $('.c-text', root).textContent = S.prompt;
        $('.c-ph', root).textContent = S.prompt ? '' : 'Describe what to build…';
        $('.ais-in', root).classList.toggle('typing', S.typing === 'prompt');
        $('.ais-send', root).classList.toggle('on', !!S.prompt);
        $('.u1', root).classList.toggle('on', S.msgs >= 1);
        $('.a1', root).classList.toggle('on', S.msgs >= 2);
        $('.u2', root).classList.toggle('on', S.msgs >= 3);
        $('.a2', root).classList.toggle('on', S.msgs >= 4);

        const pv = $('.ais-app-card', root);
        if (!S.built) {
          pv.className = 'ais-app-card empty';
          pv.innerHTML = 'Waiting for prompt…';
        } else {
          pv.className = 'ais-app-card';
          const price = S.crates * 1500;
          pv.innerHTML = `
            <div class="ais-app-title">🥭 Rajshahi Mango Direct</div>
            <div class="ais-qty-bar"><span>Fazli Crates: <b>${S.crates}</b></span><span class="ais-plus-btn">+</span></div>
            <div style="display:flex;justify-content:space-between"><span>Total (incl. delivery)</span><b>৳ ${(price + 250).toLocaleString()}</b></div>
            <div class="ais-wa-btn ${S.wa ? 'on' : ''}">💬 Send Order via WhatsApp</div>`;
        }

        const ghBtn = $('.ais-gh-btn', root);
        ghBtn.classList.toggle('synced', S.synced);
        ghBtn.textContent = S.synced ? '✓ Saved on GitHub' : '🐙 Save to GitHub';

        const modal = $('.ais-modal', root);
        modal.classList.toggle('open', !!S.modal);
        if (S.modal) {
          $('.ais-m-title', root).textContent = S.modal === 'create' ? '🐙 Connect & Push to GitHub' : '🐙 Commit Update to GitHub';
          $('.ais-m-lbl', root).textContent = S.modal === 'create' ? 'Repository name' : 'Commit message';
          $('.ais-d-vis', root).style.display = S.modal === 'create' ? 'flex' : 'none';
          $('.ais-d-push', root).textContent = S.modal === 'create' ? 'Create & Push' : 'Commit & Push';
          $('.ais-d-push', root).classList.toggle('on', !!S.modalText);
          $('.m-text', root).textContent = S.modalText;
          $('.ais-d-field', root).classList.toggle('typing', S.typing === 'modalText');
        }
        return;
      }

      if (track === 'ide') {
        $('.ide-ag-text', root).textContent = S.agText;
        $('.ide-ag-ph', root).textContent = S.agText ? '' : 'Ask AI…';
        $('.ide-ag-in', root).classList.toggle('typing', S.typing === 'agText');
        $('.ide-c-text', root).textContent = S.cText;
        $('.ide-c-ph', root).style.display = S.cText ? 'none' : 'inline';
        $('.ide-commit-in', root).classList.toggle('typing', S.typing === 'cText');
        $('.ide-commit-btn', root).classList.toggle('on', !!S.cText && S.changes > 0);
        $('.ide-sync-btn', root).classList.toggle('on', S.committed && !S.synced);

        const badge = $('.ide-ab-badge', root);
        badge.textContent = String(S.changes);
        badge.classList.toggle('on', S.changes > 0);
        $('.sc-icon', root).classList.toggle('on', S.scOpen);

        const agMsgs = $('.ide-ag-msgs', root);
        const list = [];
        if (S.agMsgs >= 1) list.push('<div class="ide-ag-u">Add coupon code RAJSHAHI10.</div>');
        if (S.agMsgs >= 2) list.push('<div class="ide-ag-a">✓ Updated index.html &amp; app.js.</div>');
        if (S.agMsgs >= 3) list.push('<div class="ide-ag-u">Rewrite into 3D WebGL canvas!</div>');
        if (S.agMsgs >= 4) list.push('<div class="ide-ag-a" style="background:#5c1d18">⚠️ TypeError in app.js!</div>');
        agMsgs.innerHTML = list.join('');

        const chg = $('.ide-changes', root);
        if (S.changes === 0) {
          chg.innerHTML = '<small style="color:#777">No pending changes</small>';
        } else {
          chg.innerHTML = `
            <small style="color:#aaa;font-size:10px">CHANGES (${S.changes})</small>
            <div class="ide-chg-row ${S.diffSel ? 'sel' : ''} row-app"><span>M app.js</span><span class="ide-discard-btn" title="Discard">↶</span></div>
            <div class="ide-chg-row"><span>M index.html</span><span style="color:#e2c08d">M</span></div>`;
        }

        $('.tab-prev', root).classList.toggle('on', !S.diffOpen);
        $('.tab-diff', root).classList.toggle('on', S.diffOpen);
        const body = $('.ide-view-body', root);
        if (S.diffOpen) {
          body.innerHTML = `
            <div class="ide-diff-box">
              <div style="color:#969696;margin-bottom:4px">app.js · Working Tree ↔ Last Commit</div>
              <div class="idl del"><span>14</span><span>- const discount = 0;</span></div>
              <div class="idl add"><span>14</span><span>+ const discount = code === "RAJSHAHI10" ? 0.10 : 0;</span></div>
            </div>`;
        } else if (S.crashed) {
          body.innerHTML = `<div class="ide-mini-app crashed"><strong>💥 ReferenceError</strong><p style="margin:4px 0 0">Mango calculator disappeared!</p></div>`;
        } else {
          body.innerHTML = `
            <div class="ide-mini-app">
              <b style="color:#103d21">🥭 Rajshahi Mango Direct</b>
              <div>2 Crates Fazli · ৳ 3,000</div>
              ${S.coupon ? '<div style="color:#16a34a;font-weight:700">✓ RAJSHAHI10 (-10%)</div>' : ''}
              <div style="font-weight:800;color:#103d21">Total: ${S.coupon ? '৳ 2,950' : '৳ 3,250'}</div>
            </div>`;
        }

        $('.ide-statusbar', root).classList.toggle('branch-mode', S.branch !== 'main');
        $('.ide-branch-pill', root).textContent = `🔀 ${S.branch}`;
        $('.ide-sb-status', root).textContent = S.synced ? '✓ Synced' : (S.committed ? '1↑ ready' : 'Ready');

        $('.ide-palette', root).classList.toggle('open', S.palOpen);
        $('.pal-text', root).textContent = S.palText || (S.palMode === 'create' ? 'Type branch name…' : 'Switch or create branch…');
        $('.ide-pal-in', root).classList.toggle('typing', S.typing === 'palText');
        $('.opt-new', root).style.display = S.palMode === 'create' ? 'none' : 'block';
        $('.opt-main', root).style.display = S.palMode === 'create' ? 'none' : 'block';
        return;
      }

      $('.tab-code', root).classList.toggle('on', S.pageTab === 'code');
      $('.tab-set', root).classList.toggle('on', S.pageTab === 'settings');
      const pb = $('.pages-body', root);
      if (S.pageTab === 'code') {
        pb.innerHTML = `
          <div class="gh-commit-bar"><span><b>rafi-rajshahi</b> · Working mango app</span><span>🕒 4 commits</span></div>
          <div class="gh-file-list">
            <div class="gh-file-row"><span>📄 index.html</span><small>1 min ago</small></div>
            <div class="gh-file-row"><span>📄 app.js</span><small>1 min ago</small></div>
          </div>`;
      } else {
        pb.innerHTML = `
          <div class="gh-pages-grid">
            <div class="gh-set-side">
              <div class="gh-set-item ${S.setItem === 'general' ? 'on' : ''}">⚙ General</div>
              <div class="gh-set-item ${S.setItem === 'pages' ? 'on' : ''} gh-nav-pages">🌐 Pages</div>
              <div class="gh-set-item">🔑 Secrets</div>
            </div>
            <div class="gh-set-main">
              <b>GitHub Pages</b>
              <div class="gh-live-banner ${S.saved ? 'on' : ''}">
                ✅ <b>Live:</b> <code>https://rafi-rajshahi.github.io/rajshahi-mango-orders/</code>
              </div>
              <div>Branch: <div class="gh-select-row" style="margin-top:6px">
                <span class="gh-select gh-branch-sel">${S.branchSel ? 'main ▾' : 'None ▾'}</span>
                <span class="gh-select">/ (root)</span>
                <span class="gh-save-btn">Save</span>
              </div></div>
            </div>
          </div>`;
      }
    }

    const STEPS = track === 'aistudio' ? [
      { cap: 'Type your app idea and press Send.', bn: 'আপনার অ্যাপের আইডিয়া লিখে পাঠান।', run: async t => {
        await tap('.ais-in', t, 'Prompt');
        await typeInto('prompt', 'Build a Rajshahi Mango calculator', t);
        await tap('.ais-send', t, 'Send');
        S.prompt = ''; S.msgs = 2; S.built = true; render(); await wait(800, t);
      } },
      { cap: 'Test the live preview before saving.', bn: 'সেভ করার আগে ডানপাশে প্রিভিউ টেস্ট করুন।', run: async t => {
        await tap('.ais-plus-btn', t, 'Test +'); S.crates = 3; render(); await wait(650, t);
        await tap('.ais-plus-btn', t, 'Check ৳'); S.crates = 4; render(); await wait(800, t);
      } },
      { cap: 'Click “Save to GitHub”.', bn: 'উপরে “Save to GitHub” বাটনে ক্লিক করুন।', run: async t => {
        await tap('.ais-gh-btn', t, 'Save to GitHub'); S.modal = 'create'; render(); await wait(650, t);
      } },
      { cap: 'Name repo, keep Private, click Create & Push.', bn: 'নাম দিয়ে Private রেখে Create & Push চাপুন।', run: async t => {
        await tap('.ais-d-field', t, 'Repo Name');
        await typeInto('modalText', 'rajshahi-mango-orders', t);
        await tap('.ais-d-push', t, 'Create & Push');
        S.modal = null; S.modalText = ''; S.synced = true; render(); await wait(800, t);
      } },
      { cap: 'Ask AI for feature #2: WhatsApp button.', bn: '২য় ফিচার: WhatsApp বাটন যোগ করতে বলুন।', run: async t => {
        S.synced = false; render();
        await tap('.ais-in', t, 'Next Feature');
        await typeInto('prompt', 'Add a WhatsApp order summary button', t);
        await tap('.ais-send', t, 'Send');
        S.prompt = ''; S.msgs = 4; S.wa = true; render(); await wait(800, t);
      } },
      { cap: 'Save Commit #2 with a clear label.', bn: 'স্পষ্ট নাম লিখে Commit #2 সেভ করুন।', run: async t => {
        await tap('.ais-gh-btn', t, 'Save Checkpoint'); S.modal = 'commit'; render(); await wait(450, t);
        await tap('.ais-d-field', t, 'Label Commit');
        await typeInto('modalText', 'Add WhatsApp order summary button', t);
        await tap('.ais-d-push', t, 'Commit & Push');
        S.modal = null; S.modalText = ''; S.synced = true; render(); await wait(750, t);
      } },
      { cap: 'Check GitHub.com — both commits are safe!', bn: 'GitHub.com-এ ২টি সেভ-পয়েন্টই নিরাপদ জমা আছে!', run: async t => {
        S.view = 'gh'; render(); await wait(450, t);
        await point('.gh-clock-pill', t, '2 Safe Commits!'); await wait(1300, t);
      } }
    ] : track === 'ide' ? [
      { cap: 'Ask the AI Agent to add a 10% coupon.', bn: 'এআই চ্যাটে ১০% কুপন যোগ করতে বলুন।', run: async t => {
        await tap('.ide-ag-in', t, 'Ask AI');
        await typeInto('agText', 'Add RAJSHAHI10 10% coupon', t);
        S.agText = ''; S.agMsgs = 2; S.changes = 2; S.coupon = true; render(); await wait(800, t);
      } },
      { cap: 'Click Source Control (2) in the left bar.', bn: 'বামের Source Control (2) আইকনে ক্লিক করুন।', run: async t => {
        await tap('.sc-icon', t, 'Source Control'); S.scOpen = true; render(); await wait(700, t);
      } },
      { cap: 'Click app.js to check Red/Green Diff.', bn: 'app.js-এ ক্লিক করে লাল/সবুজ Diff দেখে নিন।', run: async t => {
        await tap('.row-app', t, 'Inspect Diff'); S.diffSel = true; S.diffOpen = true; render(); await wait(1200, t);
      } },
      { cap: 'Write commit message and click ✓ Commit.', bn: 'কমিট মেসেজ লিখে ✓ Commit চাপুন।', run: async t => {
        await tap('.ide-commit-in', t, 'Commit Label');
        await typeInto('cText', 'Add RAJSHAHI10 coupon', t);
        await tap('.ide-commit-btn', t, 'Commit ✓');
        S.cText = ''; S.changes = 0; S.diffOpen = false; S.diffSel = false; S.committed = true; render(); await wait(750, t);
      } },
      { cap: 'Click ☁️ Sync Changes to upload to GitHub.', bn: 'গিটহাবে পাঠাতে ☁️ Sync Changes চাপুন।', run: async t => {
        await tap('.ide-sync-btn', t, 'Sync ↑'); S.synced = true; render(); await wait(900, t);
      } },
      { cap: 'Click 🔀 main (bottom-left) → new branch.', bn: 'নিচে বামের 🔀 main থেকে নতুন ব্রাঞ্চ খুলুন।', run: async t => {
        await tap('.ide-branch-pill', t, 'Branch Picker'); S.palOpen = true; S.palMode = 'menu'; render(); await wait(500, t);
        await tap('.opt-new', t, 'New Branch'); S.palMode = 'create'; render(); await wait(350, t);
        await tap('.ide-pal-in', t, 'Name Branch');
        await typeInto('palText', 'try-3d-redesign', t);
        S.palOpen = false; S.palText = ''; S.branch = 'try-3d-redesign'; render(); await wait(700, t);
      } },
      { cap: 'AI tries a 3D rewrite on the branch — CRASH!', bn: 'নতুন ব্রাঞ্চে AI পুরো কোড ভেঙে ফেলল!', run: async t => {
        await tap('.ide-ag-in', t, 'Risky Prompt');
        await typeInto('agText', 'Rewrite into 3D WebGL canvas', t);
        S.agText = ''; S.agMsgs = 4; S.crashed = true; S.changes = 2; S.synced = false; render(); await wait(1000, t);
      } },
      { cap: 'Click Discard (↶) and switch back to main!', bn: 'Discard (↶) চেপে নিরাপদ main ব্রাঞ্চে ফিরুন।', run: async t => {
        await tap('.ide-discard-btn', t, 'Discard ↶'); S.crashed = false; S.changes = 0; render(); await wait(550, t);
        await tap('.ide-branch-pill', t, 'Back to main'); S.palOpen = true; S.palMode = 'menu'; render(); await wait(450, t);
        await tap('.opt-main', t, 'Safe main'); S.palOpen = false; S.branch = 'main'; S.synced = true; render(); await wait(1100, t);
      } }
    ] : [
      { cap: 'Open your repo → click ⚙ Settings.', bn: 'গিটহাবে রিপো খুলে ⚙ Settings-এ ক্লিক করুন।', run: async t => {
        await tap('.tab-set', t, 'Settings'); S.pageTab = 'settings'; render(); await wait(700, t);
      } },
      { cap: 'Click Pages in the left menu.', bn: 'বামপাশের মেনু থেকে Pages বেছে নিন।', run: async t => {
        await tap('.gh-nav-pages', t, 'Pages'); S.setItem = 'pages'; render(); await wait(700, t);
      } },
      { cap: 'Set Branch to main and click Save.', bn: 'Branch-এ main দিয়ে Save চাপুন।', run: async t => {
        await tap('.gh-branch-sel', t, 'Choose main'); S.branchSel = true; render(); await wait(650, t);
        await tap('.gh-save-btn', t, 'Save'); S.saved = true; render(); await wait(800, t);
      } },
      { cap: 'Done! Free live URL ready to share.', bn: 'ফ্রি লাইভ লিংক তৈরি — ক্লায়েন্টকে শেয়ার করুন!', run: async t => {
        await point('.gh-live-banner', t, 'Live URL!'); await wait(1300, t);
      } }
    ];

    dotsEl.innerHTML = STEPS.map((_, i) => `<button type="button" class="dot" data-i="${i}" aria-label="Step ${i + 1}"></button>`).join('');

    function caption(i) {
      const s = STEPS[i];
      capN.textContent = i + 1;
      capT.textContent = s.cap;
      capBn.textContent = s.bn;
      $$('.dot', root).forEach((d, k) => { d.classList.toggle('done', k < i); d.classList.toggle('now', k === i); });
    }

    function setPlaying(p) {
      playing = p;
      root.classList.toggle('playing', p);
      $('.cb-play', root).setAttribute('aria-label', p ? 'Pause' : 'Play');
    }

    async function goStep(i, autoplay = true) {
      const t = ++token;
      idx = i;
      started = true;
      root.classList.add('started');
      if (cursorTag) cursorTag.textContent = '';
      win.classList.add('instant');
      S = init();
      fast = true;
      try {
        for (let k = 0; k < i; k++) { render(); await STEPS[k].run(t); }
      } catch (e) { if (e !== CANCEL) throw e; return; }
      fast = false;
      render();
      void win.offsetWidth;
      win.classList.remove('instant');
      caption(i);
      fitDemos();
      if (!autoplay) { setPlaying(false); return; }
      setPlaying(true);
      try {
        for (let k = i; k < STEPS.length; k++) {
          idx = k;
          caption(k);
          live(t);
          await STEPS[k].run(t);
          await wait(380, t);
          if (!playing) return;
        }
        setPlaying(false);
        if (cursorTag) cursorTag.textContent = '';
        $$('.dot', root).forEach(d => d.classList.add('done'));
      } catch (e) { if (e !== CANCEL) throw e; }
    }

    function pause() { token++; setPlaying(false); if (started) goStep(idx, false); }
    demoPausedHooks.push(() => { if (playing) pause(); });

    $('.win-start', root).addEventListener('click', () => goStep(0));
    $('.cb-play', root).addEventListener('click', () => {
      if (!started || idx === STEPS.length - 1) return goStep(0);
      playing ? pause() : goStep(idx);
    });
    $('.cb-prev', root).addEventListener('click', () => goStep(Math.max(0, idx - (started ? 1 : 0))));
    $('.cb-next', root).addEventListener('click', () => goStep(Math.min(STEPS.length - 1, started ? idx + 1 : 0)));
    dotsEl.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) goStep(+b.dataset.i); });

    S = init();
    render();
    caption(0);
  }

  $$('.demo').forEach(el => Demo(el));

  function fitDemos() {
    const stageEl = $('#stage-main');
    const footEl = $('#footbar');
    const stageTop = stageEl ? stageEl.getBoundingClientRect().top + 14 : 120;
    const footH = footEl ? footEl.offsetHeight : 64;
    const DW = 980, DH = 532;

    $$('.demo').forEach(d => {
      const sec = d.closest('.step-screen');
      if (sec && sec.hidden) return;
      const subPane = d.closest('.submode-pane');
      if (subPane && subPane.hidden) return;

      const wf = $('.win-fit', d), win = $('.win', d), cap = $('.cap', d);
      if (!wf || !win || !cap) return;

      if (innerWidth < 760) {
        d.classList.remove('fitted');
        d.style.removeProperty('--capw');
        wf.style.width = '';
        wf.style.height = '';
        win.style.transform = '';
        return;
      }

      d.classList.add('fitted');
      const wrap = d.closest('.step-wrap');
      const availW = d.clientWidth || (wrap ? wrap.clientWidth : 920);
      if (availW < 40) return;

      const sibH = subPane ? (($('.shield-tabs')?.offsetHeight || 0) + 12) : 0;
      const maxTotalH = Math.max(220, innerHeight - stageTop - footH - 20 - sibH);

      let capH = cap.offsetHeight + 10;
      let k = clamp(Math.min(availW / DW, (maxTotalH - capH) / DH), 0.34, 1.08);
      d.style.setProperty('--capw', Math.max(320, Math.round(DW * k)) + 'px');
      capH = cap.offsetHeight + 10;
      k = clamp(Math.min(availW / DW, (maxTotalH - capH) / DH), 0.34, 1.08);
      d.style.setProperty('--capw', Math.max(320, Math.round(DW * k)) + 'px');
      wf.style.width = Math.round(DW * k) + 'px';
      wf.style.height = Math.round(DH * k) + 'px';
      win.style.transform = `scale(${k.toFixed(4)})`;
    });
  }
  addEventListener('resize', () => requestAnimationFrame(fitDemos), { passive: true });

  /* ------------------------------------------------------------------ */
  /* 8. SCREENS 13, 14, 15, 16: HOTSPOTS · SHIELD · PROMPTS · FINISH    */
  /* ------------------------------------------------------------------ */
  (function initHotspots() {
    const hsStage = $('#ide-hotspot-map');
    if (!hsStage) return;
    const SPOTS = {
      sc: {
        num: 'Button 1 of 4',
        title: 'Source Control (🔀)',
        when: 'After every working AI prompt.',
        bn: 'প্রতিটি কার্যকর AI প্রম্পটের পরেই এখানে কতটি ফাইল বদলেছে তা দেখবেন।',
        clip: 'gloss-diff'
      },
      commit: {
        num: 'Button 2 of 4',
        title: 'Commit Box + ✓ Commit',
        when: 'After testing preview — lock checkpoint locally.',
        bn: 'প্রিভিউ কাজ করছে নিশ্চিত করে ছোট মেসেজ লিখে Commit চাপুন।',
        clip: 'gpa-say-commit'
      },
      sync: {
        num: 'Button 3 of 4',
        title: '☁️ Sync Changes',
        when: 'Upload saved commits up to GitHub cloud.',
        bn: 'লোকাল সেভ-পয়েন্টগুলো গিটহাব ক্লাউডে পাঠানোর বাটন।',
        clip: 'sync-push'
      },
      branch: {
        num: 'Button 4 of 4',
        title: 'Branch Picker (🔀 main)',
        when: 'Before risky AI redesigns — open a safe track.',
        bn: 'বড় পরিবর্তনের আগে নতুন নিরাপদ ব্রাঞ্চ খোলার বাটন।',
        clip: 'tree-branch'
      }
    };
    let activeKey = 'sc';
    function selectSpot(key, speakNow) {
      activeKey = key;
      const d = SPOTS[key] || SPOTS.sc;
      $$('.hs-spot', hsStage).forEach(b => b.classList.toggle('active', b.dataset.spot === key));
      $('#hs-num').textContent = d.num;
      $('#hs-title').textContent = d.title;
      $('#hs-when').innerHTML = `<b>When:</b> ${esc(d.when)}`;
      $('#hs-bn').textContent = d.bn;
      if (speakNow) speakClip(d.clip, `${d.title}. ${d.when}`);
    }
    $$('.hs-spot', hsStage).forEach(btn => {
      btn.addEventListener('click', () => { userInteracted = true; selectSpot(btn.dataset.spot, true); });
    });
    const hearBtn = $('#hs-hear-btn');
    if (hearBtn) {
      hearBtn.addEventListener('click', () => {
        userInteracted = true;
        const d = SPOTS[activeKey] || SPOTS.sc;
        speakClip(d.clip, `${d.title}. ${d.when}`, { el: hearBtn, force: true });
      });
    }
    selectSpot('sc', false);
  })();

  (function initShieldAndPages() {
    const subTabs = $$('.sm-tab');
    subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const sub = tab.dataset.sub;
        subTabs.forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', String(on));
        });
        $('#sub-keys').hidden = sub !== 'keys';
        $('#sub-pages').hidden = sub !== 'pages';
        requestAnimationFrame(fitDemos);
      });
    });

    const arena = $('#sh-arena');
    if (!arena) return;
    const botAlert = $('#sh-bot-alert');
    $('#sh-test-leak').addEventListener('click', () => {
      userInteracted = true;
      $('#sh-test-leak').classList.add('active');
      $('#sh-test-safe').classList.remove('active');
      arena.dataset.state = 'leak';
      $('#sh-appjs').classList.add('danger');
      $('#sh-appjs').innerHTML = '📄 app.js <code>PIN="AIza…"</code>';
      $('#sh-gate-msg').innerHTML = '⚠️ Bypassed! PIN was inside app.js<span class="bn" lang="bn">সতর্কতা! গোপন পিন app.js-এ থাকায় নোটিশবোর্ডে চলে গেছে!</span>';
      $('#sh-cloud-msg').innerHTML = '🚨 PIN leaked on Campus Noticeboard!<span class="bn" lang="bn">🚨 বিপদ! নোটিশবোর্ডে সবার সামনে পিন প্রকাশ পেয়েছে!</span>';
      if (botAlert) botAlert.hidden = false;
      playChime(false);
      speakClip('shield-leak', 'Danger! An API key is like your bKash PIN. Never put it inside app.js.');
    });
    $('#sh-test-safe').addEventListener('click', () => {
      userInteracted = true;
      $('#sh-test-safe').classList.add('active');
      $('#sh-test-leak').classList.remove('active');
      arena.dataset.state = 'safe';
      $('#sh-appjs').classList.remove('danger');
      $('#sh-appjs').innerHTML = '📄 app.js <span>Reads .env</span>';
      $('#sh-gate-msg').innerHTML = 'Blocks <code>.env</code> pocket!<span class="bn" lang="bn">তালাবদ্ধ .env পকেট আটকে দেয়!</span>';
      $('#sh-cloud-msg').innerHTML = '✅ Safe! PIN stayed in your locked pocket<span class="bn" lang="bn">নিরাপদ! গোপন পিন আপনার পকেটেই আছে</span>';
      if (botAlert) botAlert.hidden = true;
      playChime(true);
      speakClip('shield-safe', 'Safe! Keep your secret API key PIN inside your locked pocket .env.');
    });
  })();

  const CLIENT_PHRASES = [
    { id: '1', label: 'Preview link', phrase: 'Hi! Here is the live GitHub Pages preview link for today’s version. Please test the button and share your feedback.', bn: 'লাইভ প্রিভিউ লিংক পাঠাতে' },
    { id: '2', label: 'Safe checkpoint', phrase: 'I have pushed a clean working commit to main on GitHub before starting the homepage redesign on a separate branch.', bn: 'নিরাপদ ব্যাকআপ রাখা হয়েছে জানাতে' },
    { id: '3', label: 'Clean rollback', phrase: 'The experimental layout caused a display issue on mobile, so I reverted cleanly to our previous working commit with zero downtime.', bn: 'আগের সুস্থ ভার্সনে ফেরার বার্তা' },
    { id: '4', label: 'Pull first', phrase: 'I just pushed the updated checkout calculator to main. Please pull the latest commit before editing the CSS file.', bn: 'সহকর্মীকে Pull করতে বলতে' },
    { id: '5', label: 'Private repo', phrase: 'I created a Private GitHub repository first while we build, and we can publish the static preview when ready.', bn: 'প্রাইভেট রিপো আশ্বাস দিতে' },
    { id: '6', label: 'Secret key safety', phrase: 'All API credentials are stored locally in environment variables and excluded via .gitignore so no keys are ever exposed.', bn: 'API নিরাপত্তা জানাতে' }
  ];

  (function initEnglishPrompts() {
    const tabs = $$('.en-tab');
    const panes = { ai: $('#en-pane-ai'), client: $('#en-pane-client'), commits: $('#en-pane-commits') };
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.en;
        tabs.forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', String(on));
        });
        Object.entries(panes).forEach(([k, el]) => { if (el) el.hidden = k !== key; });
      });
    });

    const PROMPTS = {
      fix: {
        clip: 'prompt-fix',
        en: 'Stop. Do not rewrite everything. Revert back to our last working commit, then fix only the bKash fee calculation.',
        bn: 'থামো! সব কোড নতুন করে লিখবে না। শেষ সুস্থ সেভ-পয়েন্টে ফিরে গিয়ে শুধু bKash হিসাবটি ঠিক করো।'
      },
      branch: {
        clip: 'prompt-branch',
        en: 'I want to try a bold homepage redesign. First confirm I am on a new branch, not main, so the working app stays safe.',
        bn: 'আমি হোমপেজের নতুন ডিজাইন চেষ্টা করতে চাই। আগে নিশ্চিত হও আমি নতুন branch-এ আছি, main-এ নয়।'
      },
      key: {
        clip: 'prompt-key',
        en: 'Move all API keys out of frontend files into .env, read them securely, and make sure .env is listed in .gitignore.',
        bn: 'সব API Key ফ্রন্টএন্ড ফাইল থেকে সরিয়ে .env ফাইলে রাখো এবং .gitignore দিয়ে লুকিয়ে রাখো।'
      },
      live: {
        clip: 'prompt-live',
        en: 'Everything works on localhost now. Help me save this commit cleanly to GitHub on main so our live GitHub Pages site updates.',
        bn: 'সব ঠিকঠাক কাজ করছে! এখন এটি GitHub-এর main ব্রাঞ্চে সেভ করো যেন লাইভ পেজ আপডেট হয়।'
      }
    };

    let curKey = 'fix';
    const promptText = $('#esl-prompt-text');
    const promptBn = $('#esl-prompt-bn');
    const hearBtn = $('#esl-prompt-hear');
    const copyBtn = $('#esl-prompt-copy');

    function setPrompt(k, speakNow) {
      curKey = k;
      const d = PROMPTS[k] || PROMPTS.fix;
      $$('.pr-btn').forEach(b => b.classList.toggle('active', b.dataset.key === k));
      if (promptText) promptText.textContent = d.en;
      if (promptBn) promptBn.textContent = d.bn;
      if (speakNow) speakClip(d.clip, d.en, { el: hearBtn });
    }
    $$('.pr-btn').forEach(b => b.addEventListener('click', () => { userInteracted = true; setPrompt(b.dataset.key, true); }));
    if (hearBtn) hearBtn.addEventListener('click', () => { userInteracted = true; setPrompt(curKey, true); });
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const d = PROMPTS[curKey] || PROMPTS.fix;
        try { await navigator.clipboard.writeText(d.en); copyBtn.textContent = '✓ Copied'; }
        catch (_) { copyBtn.textContent = 'Copy'; }
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 1400);
      });
    }
    setPrompt('fix', false);

    // Client English Cards in Screen 15
    const clientList = $('#client-quick-list');
    if (clientList) {
      clientList.innerHTML = CLIENT_PHRASES.map(c => `
        <div class="cl-card">
          <div>
            <p>“${esc(c.phrase)}”</p>
            <span class="bn" lang="bn">${esc(c.bn)}</span>
          </div>
          <div class="cl-acts">
            <button type="button" class="tk-mini-btn" data-audio="client-${c.id}" data-say="${esc(c.phrase)}">🔊 Hear</button>
            <button type="button" class="tk-mini-btn" data-copy="${esc(c.phrase)}">Copy</button>
          </div>
        </div>
      `).join('');
      clientList.addEventListener('click', async e => {
        const hear = e.target.closest('[data-audio]');
        if (hear) { userInteracted = true; speakClip(hear.dataset.audio, hear.dataset.say, { el: hear, force: true }); return; }
        const cp = e.target.closest('[data-copy]');
        if (cp) {
          try { await navigator.clipboard.writeText(cp.dataset.copy); cp.textContent = '✓'; }
          catch (_) {}
          setTimeout(() => { cp.textContent = 'Copy'; }, 1300);
        }
      });
    }

    // Commit Spotter in Screen 15
    const spotter = $('#commit-spotter');
    if (spotter) {
      let style = 'messy', rescued = false, pickedIdx = null;
      const LISTS = {
        messy: [
          { hash: 'a19f', msg: 'update', time: '2:15 PM', bad: true },
          { hash: 'b82c', msg: 'fix', time: '4:40 PM', bad: true },
          { hash: 'c40e', msg: 'final2', time: '8:10 PM', bad: true, guess: true },
          { hash: 'd99x', msg: 'new changes', time: '11:55 PM · 💥', bad: true }
        ],
        clean: [
          { hash: '101a', msg: 'Working mango price table', time: '2:15 PM' },
          { hash: '204b', msg: 'Add 1.85% bKash fee', time: '4:40 PM' },
          { hash: '309c', msg: 'Add WhatsApp order summary button', time: '8:10 PM', winner: true },
          { hash: '412d', msg: 'Try 3D animation (BROKEN)', time: '11:55 PM · 💥', bad: true }
        ]
      };
      function renderSpotter() {
        $$('.sp-tab', spotter).forEach(b => b.classList.toggle('active', b.dataset.style === style));
        $('#sp-list').innerHTML = LISTS[style].map((r, i) => {
          const isPicked = pickedIdx === i;
          const isWin = (rescued && r.winner) || (style === 'clean' && isPicked && r.winner);
          const isGuess = (rescued && r.guess) || (isPicked && !r.winner);
          return `<button type="button" class="sp-row ${r.bad ? 'bad' : ''} ${isWin ? 'winner' : ''} ${isGuess ? 'guess' : ''}" data-idx="${i}">
            <span><code>${r.hash}</code> <b>${esc(r.msg)}</b></span><small>${r.time}</small>
          </button>`;
        }).join('');
        const fb = $('#sp-feedback');
        if (pickedIdx !== null && !rescued) {
          const r = LISTS[style][pickedIdx];
          fb.innerHTML = style === 'messy'
            ? `😵 <b>${esc(r.msg)}</b> hides which version worked! Try <b>Pro Labels</b>.`
            : (r.winner ? '🎯 <b>309c:</b> clear name saves you in 1 second!' : '👆 Find the commit that added the <b>WhatsApp</b> button.');
        } else if (!rescued) {
          fb.innerHTML = style === 'messy' ? '👆 Find the working WhatsApp commit in vague labels!' : '👆 Tap the working WhatsApp commit!';
        } else {
          fb.innerHTML = style === 'messy' ? '😵 Forced to guess <code>final2</code>!' : '🎯 Instant rescue via <code>309c</code>!';
        }
      }
      $$('.sp-tab', spotter).forEach(b => b.addEventListener('click', () => { style = b.dataset.style; rescued = false; pickedIdx = null; renderSpotter(); }));
      $('#sp-list').addEventListener('click', e => {
        const row = e.target.closest('.sp-row');
        if (!row) return;
        rescued = false; pickedIdx = Number(row.dataset.idx);
        playChime(style === 'clean' && !!LISTS[style][pickedIdx].winner);
        renderSpotter();
      });
      $('#sp-rescue-btn').addEventListener('click', () => { rescued = true; pickedIdx = null; playChime(style === 'clean'); renderSpotter(); });
      renderSpotter();
    }
  })();

  // Screen 16 Finish
  $$('#habits-list .hb-tile').forEach(btn => {
    btn.addEventListener('click', () => {
      userInteracted = true;
      speakClip(btn.dataset.audio, btn.textContent, { el: btn, force: true });
    });
  });
  const finPrint = $('#fin-print');
  if (finPrint) finPrint.addEventListener('click', () => window.print());
  const finRestart = $('#fin-restart');
  if (finRestart) finRestart.addEventListener('click', () => { userInteracted = true; go(0, false); });

  /* ------------------------------------------------------------------ */
  /* 9. TOOLKIT DIALOG (QR + 16-WORD GLOSSARY + PHRASES + SETUP)        */
  /* ------------------------------------------------------------------ */
  const toolkitController = (function initToolkitDialog() {
    const dialog = $('#toolkit-dialog');
    if (!dialog) return null;

    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const inside = rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;
        if (!inside) dialog.close();
      }
    });

    const shareUrl = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname) || location.protocol === 'file:'
      ? 'https://dialogue-bd.com/github-vibecoding/'
      : location.href.split('#')[0];

    let qrRendered = false;
    function ensureQR() {
      const target = $('#tk-qr-target');
      const urlOut = $('#tk-url-text');
      if (urlOut) urlOut.textContent = shareUrl;
      if (qrRendered || !target) return;
      target.innerHTML = '';
      if (typeof window.QRCode === 'function') {
        new window.QRCode(target, { text: shareUrl, width: 170, height: 170, colorDark: '#103d21', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
        qrRendered = true;
      } else {
        target.textContent = shareUrl;
      }
    }

    const GLOSSARY = [
      { id: 'vibecoding', term: 'Vibecoding (VIBE-co-ding)', def: 'Build apps by telling AI what you want in plain language.', bn: 'কোড না লিখে এআই-কে বলে অ্যাপ তৈরি করা' },
      { id: 'apikey', term: 'API Key (A-P-I KEY)', def: 'Secret digital PIN letting your app talk to AI — keep private!', bn: 'গোপন পাসওয়ার্ড বা পিন যা দিয়ে অ্যাপ এআই-এর সাথে কথা বলে' },
      { id: 'ide', term: 'IDE (Visual Editor)', def: 'Visual code app with buttons & previews like Antigravity, Cursor, or VS Code.', bn: 'বাটন ও প্রিভিউসহ অ্যাপ বানানোর সফটওয়্যার (যেমন Cursor, Antigravity)' },
      { id: 'cli', term: 'CLI (Terminal)', def: 'Text terminal where you or AI agents like Claude Code & Codex run commands.', bn: 'টার্মিনাল — যেখানে লিখে বা AI এজেন্ট দিয়ে কমান্ড চালানো হয়' },
      { id: 'repo', term: 'Repository (re-POS-i-to-ry · Repo)', def: 'Also called a Repo (RE-po) — master vault folder holding project files and history.', bn: 'প্রজেক্টের মূল ফোল্ডার ও ব্যাকআপ ভল্ট (সংক্ষেপে রিপো / Repo)' },
      { id: 'commit', term: 'Commit', def: 'Numbered working save point stored on your device.', bn: 'নিরাপদ কাজের সেভ-পয়েন্ট' },
      { id: 'push', term: 'Push', def: 'Upload local commits up to GitHub.com cloud.', bn: 'গিটহাব ক্লাউডে আপলোড করা' },
      { id: 'pull', term: 'Pull', def: 'Download newer commits from GitHub down to your laptop.', bn: 'গিটহাব থেকে আপডেট নামিয়ে আনা' },
      { id: 'main', term: 'main', def: 'The official live working highway track of your project.', bn: 'আপনার মূল সুস্থ চালু লাইন' },
      { id: 'head', term: 'HEAD', def: 'Marker pin showing which save point you stand on now.', bn: 'আপনি এখন কোন সেভ-পয়েন্টে আছেন তা দেখায়' },
      { id: 'branch', term: 'Branch', def: 'Safe parallel sandbox track so main stays unbroken.', bn: 'পরীক্ষার জন্য আলাদা নিরাপদ রাস্তা' },
      { id: 'merge', term: 'Merge', def: 'Combine tested branch changes back into main.', bn: 'ভালো কাজ মূল অ্যাপে যুক্ত করা' },
      { id: 'conflict', term: 'Conflict', def: 'Clash when two edits change the exact same line differently.', bn: 'একই লাইনে দুই বিপরীত পরিবর্তনের দ্বন্দ্ব' },
      { id: 'revert', term: 'Revert', def: 'Rewind safely from a broken change back to a green commit.', bn: 'আগের সুস্থ সেভ-পয়েন্টে ফিরে যাওয়া' },
      { id: 'clone', term: 'Clone', def: 'Copy a full GitHub repo onto your laptop for an IDE.', bn: 'পুরো রিপো কম্পিউটারে কপি করে আনা' },
      { id: 'fork', term: 'Fork', def: 'Make your own copy of another repo on GitHub.', bn: 'অন্যের প্রজেক্টের নিজস্ব কপি নেওয়া' },
      { id: 'diff', term: 'Diff', def: 'Red/green comparison showing exactly what AI altered.', bn: 'কী কী বদলেছে তার লাল-সবুজ তুলনা' },
      { id: 'pr', term: 'Pull Request (PR)', def: 'Often called a PR — review proposal asking to merge your branch into main.', bn: 'মূল অ্যাপে (main) যুক্ত করার রিভিউ অনুরোধ (সংক্ষেপে PR)' },
      { id: 'gitignore', term: '.gitignore / .env', def: 'Secret locker + gatekeeper blocking API keys from upload.', bn: 'গোপন API Key লুকিয়ে রাখার নিয়ম' }
    ];

    $('#tk-glossary-list').innerHTML = GLOSSARY.map(g => `
      <div class="tk-card">
        <div>
          <b>${esc(g.term)}</b>
          <p>${esc(g.def)}</p>
          <span class="bn" lang="bn">${esc(g.bn)}</span>
        </div>
        <div class="tk-card-btns">
          <button type="button" class="tk-mini-btn" data-audio="gloss-${g.id}" data-say="${esc(g.term + '. ' + g.def)}">🔊 Hear</button>
        </div>
      </div>
    `).join('');

    $('#tk-english-list').innerHTML = CLIENT_PHRASES.map(c => `
      <div class="tk-card">
        <div>
          <b>${esc(c.label)}</b>
          <p>“${esc(c.phrase)}”</p>
          <span class="bn" lang="bn">${esc(c.bn)}</span>
        </div>
        <div class="tk-card-btns">
          <button type="button" class="tk-mini-btn" data-audio="client-${c.id}" data-say="${esc(c.phrase)}">🔊 Hear</button>
          <button type="button" class="tk-mini-btn" data-copy-phrase="${esc(c.phrase)}">Copy</button>
        </div>
      </div>
    `).join('');

    const SETUP_STEPS = [
      { id: 's1', title: '1. Create free github.com account', note: 'Use Gmail/university email — no credit card required.', bn: '১. github.com-এ ফ্রি অ্যাকাউন্ট খুলুন।' },
      { id: 's2', title: '2. Turn on 2FA protection', note: 'Protect your account with phone or authenticator verification.', bn: '২. ২-ধাপের নিরাপত্তা (2FA) চালু করুন।' },
      { id: 's3', title: '3. Test Save to GitHub in AI Studio', note: 'Build a tiny demo and save 1 Private repo.', bn: '৩. Google AI Studio থেকে Private রিপো সেভ করুন।' },
      { id: 's4', title: '4. Sign into GitHub inside your IDE', note: 'Click Accounts → Sign in to unlock Commit & Sync.', bn: '৪. আপনার AI IDE-তে GitHub সাইন-ইন করুন।' },
      { id: 's5', title: '5. Publish via GitHub Pages', note: 'Settings → Pages → Branch: main → Save!', bn: '৫. Settings → Pages দিয়ে ফ্রি লাইভ লিংক বানান!' }
    ];
    let savedSetup = {};
    try { savedSetup = JSON.parse(localStorage.getItem('ghv-setup') || '{}'); } catch (_) {}
    function renderSetup() {
      $('#tk-setup-list').innerHTML = SETUP_STEPS.map(st => `
        <label class="tk-step-item ${savedSetup[st.id] ? 'done' : ''}">
          <input type="checkbox" data-step-id="${st.id}" ${savedSetup[st.id] ? 'checked' : ''}>
          <div>
            <b>${esc(st.title)}</b>
            <small>${esc(st.note)}</small>
            <span class="bn" lang="bn">${esc(st.bn)}</span>
          </div>
        </label>`).join('');
    }
    renderSetup();

    dialog.addEventListener('change', e => {
      const cb = e.target.closest('input[data-step-id]');
      if (!cb) return;
      savedSetup[cb.dataset.stepId] = cb.checked;
      try { localStorage.setItem('ghv-setup', JSON.stringify(savedSetup)); } catch (_) {}
      renderSetup();
    });

    dialog.addEventListener('click', async e => {
      const tab = e.target.closest('.tk-tab');
      if (tab) {
        const key = tab.dataset.tk;
        $$('.tk-tab', dialog).forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', String(on));
        });
        ['qr', 'glossary', 'english', 'setup'].forEach(k => {
          const p = $(`#tk-pane-${k}`, dialog);
          if (p) p.hidden = k !== key;
        });
        if (key === 'qr') ensureQR();
        return;
      }
      const hear = e.target.closest('[data-audio]');
      if (hear) { userInteracted = true; speakClip(hear.dataset.audio, hear.dataset.say, { el: hear, force: true }); return; }
      const cp = e.target.closest('[data-copy-phrase]');
      if (cp) {
        try { await navigator.clipboard.writeText(cp.dataset.copyPhrase); cp.textContent = '✓'; }
        catch (_) {}
        setTimeout(() => { cp.textContent = 'Copy'; }, 1300);
      }
    });

    const copyUrlBtn = $('#tk-copy-url');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(shareUrl); copyUrlBtn.textContent = '✓ Copied'; }
        catch (_) {}
        setTimeout(() => { copyUrlBtn.textContent = 'Copy Link'; }, 1400);
      });
    }

    function open(tabKey = 'qr') {
      const t = $(`.tk-tab[data-tk="${tabKey}"]`, dialog);
      if (t) t.click();
      if (typeof dialog.showModal === 'function') { if (!dialog.open) dialog.showModal(); }
      else dialog.setAttribute('open', '');
      if (tabKey === 'qr') ensureQR();
    }
    return { open };
  })();

  if (toolkitController) {
    [['#toolkit-btn', 'qr'], ['#welcome-qr', 'qr'], ['#fin-qr', 'qr'], ['#fin-glossary', 'glossary']].forEach(([sel, tab]) => {
      const b = $(sel);
      if (b) b.addEventListener('click', () => toolkitController.open(tab));
    });
  }

  /* ------------------------------------------------------------------ */
  /* 10. KEYBOARD NAVIGATION + HASH ROUTING (#s0 .. #s16)               */
  /* ------------------------------------------------------------------ */
  document.addEventListener('keydown', e => {
    const dlg = $('#toolkit-dialog');
    if (dlg && dlg.open) return;
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    if (e.key === 'ArrowRight') {
      userInteracted = true;
      go(currentStep + 1, true);
    } else if (e.key === 'ArrowLeft') {
      userInteracted = true;
      go(currentStep - 1, true);
    }
  });

  function initialStepFromHash() {
    const m = /^#s(\d+)$/.exec(location.hash);
    return m ? clamp(+m[1], 0, TOTAL_STEPS) : 0;
  }
  addEventListener('hashchange', () => go(initialStepFromHash(), false));
  go(initialStepFromHash(), false);
})();
