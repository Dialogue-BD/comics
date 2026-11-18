/* AI Tools: Stories & Songs
 * 1. The four D gears (same machined 12-tooth gear as the 4Ds film, ai-fluency/intro.js)
 * 2. Animated Gemini walk-throughs — a mock of the real screens, driven by a
 *    step script. Every step can be replayed, skipped or jumped to (no locks).
 * 3. Karaoke song player with the gears turning in on cue
 * 4. Storybook reader with read-aloud and word highlighting
 * 5. "Your turn" prompt builder
 */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* 1. GEARS                                                            */
/* ------------------------------------------------------------------ */
const R = 36, A = 5.5, RR = R + A, NT = 12, TD = 360 / NT, DIST = 36 * Math.SQRT2;
const COL = { del: ['#8A5610', '#D29A45', '#4E2F06'], des: ['#0A6A62', '#38B2A3', '#043B36'],
  dis: ['#3F4FA8', '#8395E2', '#222B68'], dil: ['#A8322A', '#E2706A', '#621510'] };
const NAME = { del: ['Delegation', 'Plan'], des: ['Description', 'Say it'], dis: ['Discernment', 'Judge it'], dil: ['Diligence', 'Be responsible'] };
const MEANS = { del: 'What task for the tool, what work for you?', des: 'Tell the machine exactly what to do.',
  dis: 'Is it wrong or right? Use your own mind.', dil: 'Act with ethics, open and fair.' };
const ICON = {
  del: 'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',
  des: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  dis: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  dil: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' };
const svgI = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[d]}" fill="currentColor"/></svg>`;

(function gearMask() {
  const rad = a => a * Math.PI / 180, pt = (r, a) => `${(RR + r * Math.cos(rad(a))).toFixed(2)} ${(RR + r * Math.sin(rad(a))).toFixed(2)}`;
  const p = [];
  for (let k = 0; k < NT; k++) { const c = k * TD;
    p.push(`${k ? 'L' : 'M'}${pt(R - A, c - .30 * TD)}`, `L${pt(R + A, c - .14 * TD)}`, `A${R + A} ${R + A} 0 0 1 ${pt(R + A, c + .14 * TD)}`,
      `L${pt(R - A, c + .30 * TD)}`, `A${R - A} ${R - A} 0 0 1 ${pt(R - A, c + .70 * TD)}`); }
  let d = p.join('') + 'Z';
  for (let k = 0; k < 6; k++) { const a = k * 60 + 30, r = R * .135, cx = RR + R * .575 * Math.cos(rad(a)), cy = RR + R * .575 * Math.sin(rad(a));
    d += `M${(cx - r).toFixed(2)} ${cy.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0Z`; }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2 * RR} ${2 * RR}"><path fill-rule="evenodd" fill="#000" d="${d}"/></svg>`;
  document.documentElement.style.setProperty('--gm', `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`);
})();
const gearHTML = (d, extra = '') => `<div class="gear g-${d} ${extra}" data-d="${d}" style="--c:${COL[d][0]};--cl:${COL[d][1]};--cd:${COL[d][2]}">
  <div class="gsh"></div><div class="grot"><div class="gbody"></div></div><div class="gsheen"></div><div class="ghub">${svgI(d)}</div></div>`;

/* small static gears used as icons around the page */
$$('.gi').forEach(el => { const d = (el.className.match(/gi-(\w+)/) || [])[1]; if (d) el.innerHTML = gearHTML(d, 'mini'); });
$$('.mini-gears i').forEach(el => { const d = el.className.replace('md-', ''); el.innerHTML = gearHTML(d, 'mini'); });

/* ------------------------------------------------------------------ */
/* 2. GEMINI WALK-THROUGH                                              */
/* ------------------------------------------------------------------ */
const SOURCES = ['1.2_AI_Fluency_Summary.pdf', 'AI_Fluency__Key_Terminology_Cheat_Sheet.pdf', 'AIF4S_TRANSCRIPT_02_FRAMEWORK.txt',
  'AIF4S_TRANSCRIPT_03_LEARNING.txt', 'AIF4S_TRANSCRIPT_04_CAREER.txt', 'AIF4S_TRANSCRIPT_05_HITL.txt', 'Delegation_assessment_matrix.pdf',
  'Description_assessment_matrix.pdf', 'Diligence_assessment_matrix.pdf', 'Discernment_assessment_matrix.pdf', 'Framework_for_AI_Fluency_V_1.5.pdf',
  'TAIF_TRANSCRIPT_01_WELCOME.txt', 'TAIF_TRANSCRIPT_02_DEL_DIL.txt', 'TAIF_TRANSCRIPT_03_DES_DIS.txt', 'TAIF_TRANSCRIPT_04_ASSESS.txt', 'TAIF_TRANSCRIPT_06_IMPACT.txt'];
const NB_TITLE = 'AI Fluency Framework- Pedagogy and Approaches';
const CARDS = [['Hometown tribute', '🐎', 'c1'], ['Streaming', '🎧', 'c2'], ['Say it with a track', '🕊️', 'c3'], ['Intro music', '💿', 'c4'],
  ['Montage', '🎞️', 'c5'], ['Memorize something', '🧠', 'c6 card-memo'], ['Comedy', '😄', 'c7'], ['Soundscape', '🪷', 'c8']];
const SPARK = '<svg viewBox="0 0 24 24" class="spark"><defs><linearGradient id="spg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f86f7"/><stop offset=".55" stop-color="#9b72f2"/><stop offset="1" stop-color="#e86a8a"/></linearGradient></defs><path fill="url(#spg)" d="M12 2c.5 5 4.9 9.5 10 10-5.1.5-9.5 5-10 10-.5-5-4.9-9.5-10-10 5.1-.5 9.5-5 10-10z"/></svg>';
const NBI = '<svg viewBox="0 0 24 24" class="nbi"><path d="M5 20a8 8 0 0 1 14 0" fill="none" stroke="#4f86f7" stroke-width="2.4" stroke-linecap="round"/><path d="M8 20a4.5 4.5 0 0 1 8 0" fill="none" stroke="#9b72f2" stroke-width="2.4" stroke-linecap="round"/></svg>';
const POINTER = '<svg viewBox="0 0 24 24"><path d="M5 2.5v17.2l4.3-4.1 2.9 6.6 2.9-1.3-2.9-6.5h6z" fill="#fff" stroke="#1d211c" stroke-width="1.4" stroke-linejoin="round"/></svg>';

const REPLY = {
  song: 'I have generated an original Bengali folk-style song for you titled <b>“The Boatman’s Four Steps”</b> to help you memorize the 4Ds of the AI Fluency Framework (Delegation, Description, Discernment, and Diligence) along with their meanings.',
  story: 'I’ve written a story for 9-year-olds about a young inventor named <mark class="chk">Leo</mark> who learns how to work with his AI companion by practicing Delegation, Description, Discernment, and Diligence so he can always stay firmly in the lead as the human in the loop. Please note that the story may not be 100% faithful to any uploaded files or images.' };
const PROMPT = { song: 'I want to memorize the 4Ds and remember what they mean. Bengali folk style', story: 'make a storybook about how to use ai well' };

function mockHTML(track) {
  const src = SOURCES.map((s, i) => `<li class="src" data-n="${i}"><i class="ft ${/\.pdf$/.test(s) ? 'pdf' : 'txt'}">${/\.pdf$/.test(s) ? 'PDF' : 'TXT'}</i><span>${s}</span><b class="tick">✓</b></li>`).join('');
  const cards = CARDS.map(([t, e, c]) => `<div class="mcard ${c}"><span class="me">${e}</span><span class="mt">${t}</span><span class="mp">▶</span></div>`).join('');
  return `
<div class="win">
  <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url"><span class="u"></span></span></div>
  <div class="screen">
    <div class="v-nb">
      <div class="nb-head">${NBI}<b>${NB_TITLE}</b><span class="nb-share">Share</span></div>
      <div class="nb-tabs"><span class="on">Sources</span><span>Chat</span><span>Studio</span></div>
      <div class="nb-cols">
        <div class="nb-src">
          <div class="nb-src-h">Sources <span class="nb-count">0 sources</span></div>
          <div class="nb-btns"><span class="nb-add">＋ Sources</span><span class="nb-note">＋ Note</span></div>
          <ul class="nb-list">${src}</ul>
        </div>
        <div class="nb-chat">
          <div class="nbc-empty">${NBI}<b>${NB_TITLE}</b><span class="nbc-n">0 sources</span><i></i><i></i><i class="s"></i></div>
          <div class="nbc-in">Ask a question or create something</div>
        </div>
        <div class="nb-studio"><b>Studio</b>
          <span>🎧 Audio Overview</span><span>🎬 Video Overview</span><span>🗺 Mind Map</span><span>🃏 Flashcards</span><span>❓ Quiz</span><span>📊 Infographic</span></div>
      </div>
    </div>

    <div class="v-gem">
      <aside class="g-side">
        <div class="gs-logo">${SPARK}<b>Gemini</b></div>
        <span class="gs-i">✎ New chat</span><span class="gs-i">▦ Library</span><span class="gs-i">🖼 Images</span>
        <span class="gs-h">Notebooks</span><span class="gs-i">＋ New notebook</span>
        <span class="gs-i nbk">${NBI}${NB_TITLE}</span><span class="gs-i nbk">${NBI}English with Beth</span>
      </aside>
      <div class="g-main">
        <div class="g-top">${SPARK}<b>Gemini</b></div>
        <div class="g-home"><h4>Where should we start?</h4></div>
        <div class="g-gallery"><div class="gg-tabs"><span class="on">All</span><span>Celebration</span><span>Creators</span></div><div class="gg-grid">${cards}</div></div>
        <div class="g-thread">
          <div class="u-att"></div>
          <div class="u-msg"></div>
          <div class="g-think">${SPARK}<i></i><i></i><i></i></div>
          <div class="g-reply">
            <div class="rp-label">Storybook <span>Experiment</span></div>
            <p class="rp-text">${REPLY[track]}</p>
            <div class="songcard"><img src="song/cover.jpg" alt=""><span class="sc-play">▶</span>
              <div class="sc-meta"><b>The Boatman’s Four Steps</b><span class="sc-wave">${'<i></i>'.repeat(18)}</span></div></div>
            <div class="check-bubble"></div>
          </div>
        </div>
        <div class="g-comp">
          <div class="c-att"><span class="att att-memo"><i>🧠</i>Memorize something</span><span class="att att-nb">${NBI}<span>${NB_TITLE}</span></span></div>
          <div class="c-in"><span class="c-text"></span><i class="caret"></i><span class="c-ph"></span></div>
          <div class="c-row"><span class="c-plus" aria-hidden="true">＋</span><span class="c-tool"></span><span class="c-sp"></span><span class="c-mic">🎙</span><span class="c-send">↑</span></div>
          <div class="c-music"><span>◷ Length ▾</span><span>👤 Vocals ▾</span><span>♪ Genre ▾</span></div>
        <div class="g-menu">
            <span class="mi">📎 Upload files</span><span class="mi">△ Add from Drive</span><span class="mi has" data-i="up">··· More uploads <em>›</em></span>
            <hr><span class="mi">🖼 Create image</span><span class="mi">🎬 Create video</span><span class="mi" data-i="music">♫ Create music <em class="ck">✓</em></span>
            <span class="mi has" data-i="tools">··· More tools <em>›</em></span>
          </div>
          <div class="g-sub sub-up"><span class="mi">✿ Google Photos</span><span class="mi">☺ Avatar</span><span class="mi" data-i="nbs">${NBI} Notebooks</span><span class="mi">&lt;&gt; Import code</span></div>
          <div class="g-sub sub-tools"><span class="mi" data-i="canvas">⧉ Canvas</span><span class="mi">◎ Deep research</span><span class="mi">📖 Guided learning</span></div>
        </div>
        <div class="g-dialog"><div class="dl-box">
          <div class="dl-h">${NBI}<b>Add notebook</b><span class="dl-x">✕</span></div>
          <span class="dl-sub">Recent</span>
          <div class="dl-row r0"><i>▤</i><div><b>${NB_TITLE}</b><small>21 sources · Created February 15, 2026</small></div></div>
          <div class="dl-row"><i>▤</i><div><b>SIL GPA Curriculum Devo</b><small>57 sources · Created January 29, 2026</small></div></div>
          <div class="dl-row"><i>▤</i><div><b>English with Beth Comprehensible Input</b><small>37 sources · Created April 18, 2026</small></div></div>
          <div class="dl-row"><i>▤</i><div><b>Beginning English Curriculums</b><small>179 sources · Created April 18, 2026</small></div></div>
          <span class="dl-add">Add</span>
        </div></div>
      </div>
      <div class="g-book">
        <div class="bk-bar"><b>The Capta…</b><span class="bk-nav">‹ <span class="bk-n">1</span> / 10 ›</span><span class="bk-sp"></span><span class="bk-listen">🔊 Listen</span><span class="bk-x">✕</span></div>
        <div class="bk-spread"><div class="bk-pic"></div><div class="bk-txt"><p></p></div></div>
      </div>
    </div>

    <div class="win-cursor">${POINTER}<i class="ripple"></i></div>
    <button class="win-start" type="button"><span>▶</span> Watch how</button>
  </div>
</div>
<div class="cap">
  <div class="cap-dots"></div>
  <div class="cap-line"><span class="cap-n">1</span><p class="cap-t"></p><span class="cap-d"></span></div>
  <div class="cap-ctl">
    <button type="button" class="cb cb-prev" aria-label="Previous step">‹</button>
    <button type="button" class="cb cb-play" aria-label="Pause"><span class="ip">▶</span><span class="ipa">❚❚</span></button>
    <button type="button" class="cb cb-next" aria-label="Next step">›</button>
  </div>
</div>
<a class="demo-cta" href="${track === 'song' ? '#sing' : '#read'}">${track === 'song' ? '♫ Now sing along ↓' : '📖 Now read the book ↓'}</a>`;
}

const BOOK = window.SS_STORY || [];

function Demo(root) {
  const track = root.dataset.track;
  root.innerHTML = mockHTML(track);
  const win = $('.win', root), screen = $('.screen', root), cursor = $('.win-cursor', root);
  const capT = $('.cap-t', root), capN = $('.cap-n', root), capD = $('.cap-d', root), dotsEl = $('.cap-dots', root);
  const thread = $('.g-thread', root);
  let S, token = 0, idx = 0, playing = false, fast = false, started = false;

  const init = () => ({ view: 'nb', mode: 'home', nb: 0, tool: null, chips: [], text: '', typing: false, menu: false, sub: null,
    dialog: false, pick: false, chat: -1, sent: null, book: null, listen: false, check: false, songOn: false });

  function render() {
    win.dataset.view = S.view;
    $('.u', root).textContent = S.view === 'nb' ? 'notebook.google.com' : 'gemini.google.com';
    $$('.src', root).forEach((li, i) => li.classList.toggle('in', i < S.nb));
    const n = S.nb >= SOURCES.length ? 21 : S.nb;
    $('.nb-count', root).textContent = n + ' sources'; $('.nbc-n', root).textContent = n + ' sources';
    const main = $('.g-main', root); main.dataset.mode = S.mode;
    const ct = $('.c-tool', root); ct.textContent = S.tool === 'music' ? '♫ Music' : S.tool === 'canvas' ? '⧉ Canvas' : '';
    ct.classList.toggle('on', !!S.tool);
    $('.c-music', root).classList.toggle('on', S.tool === 'music' && S.mode !== 'chat');
    $('.att-memo', root).classList.toggle('on', S.chips.includes('memo'));
    $('.att-nb', root).classList.toggle('on', S.chips.includes('nb'));
    $('.c-text', root).textContent = S.text;
    $('.c-ph', root).textContent = S.text ? '' : (S.tool === 'music' ? 'Describe your track' : 'Ask Gemini');
    $('.c-in', root).classList.toggle('typing', S.typing);
    $('.c-send', root).classList.toggle('on', !!S.text);
    $('.g-menu', root).classList.toggle('open', S.menu);
    $('[data-i="music"]', root).classList.toggle('chk', S.tool === 'music');
    $('.sub-up', root).classList.toggle('open', S.sub === 'up');
    $('.sub-tools', root).classList.toggle('open', S.sub === 'tools');
    $('.g-dialog', root).classList.toggle('open', S.dialog);
    $('.dl-row.r0', root).classList.toggle('sel', S.pick);
    $('.dl-add', root).classList.toggle('on', S.pick);
    // thread
    const sent = S.sent || { chips: [], text: '' };
    $('.u-att', root).innerHTML = sent.chips.map(c => c === 'memo'
      ? '<span class="ua ua-memo"><i>🧠</i>Memorize something</span>' : `<span class="ua ua-nb">${NBI}<span>AI Fluency Framework- Pedagogy a…</span></span>`).join('');
    $('.u-msg', root).textContent = sent.text;
    thread.dataset.stage = S.chat;
    thread.dataset.kind = track;
    $('.songcard', root).classList.toggle('playing', S.songOn);
    $('.check-bubble', root).classList.toggle('on', S.check);
    $('.check-bubble', root).innerHTML = track === 'song'
      ? '<b>✓ Check it</b> All four Ds are in the song, with their meanings. ✓ “Product, process, performance” — that is Description in our notebook.'
      : '<b>? Check it</b> Gemini says Leo is the hero. Is he? Read the book and see.';
    $('.g-reply', root).classList.toggle('checking', S.check);
    // book
    const bk = $('.g-book', root); bk.classList.toggle('open', S.book !== null);
    main.classList.toggle('with-book', S.book !== null);
    $('.v-gem', root).classList.toggle('book', S.book !== null);
    if (S.book !== null) {
      const p = BOOK[S.book] || {};
      $('.bk-n', root).textContent = S.book + 1;
      $('.bk-pic', root).style.backgroundImage = p.img ? `url("${p.img}")` : 'none';
      $('.bk-pic', root).classList.toggle('blank', !p.img);
      $('.bk-txt p', root).textContent = p.title ? 'The Captain of the Loop — By Tim Hall' : p.text;
    }
    $('.bk-listen', root).classList.toggle('on', S.listen);
    if (S.mode === 'chat') thread.scrollTop = thread.scrollHeight;
  }

  /* timing helpers — every wait checks the run token so a jump cancels cleanly */
  const CANCEL = {};
  const live = t => { if (t !== token) throw CANCEL; };
  const wait = (ms, t) => new Promise((res, rej) => {
    if (fast) return t === token ? res() : rej(CANCEL);
    setTimeout(() => (t === token ? res() : rej(CANCEL)), reduced ? ms * .6 : ms);
  });
  function pos(sel) {
    const el = typeof sel === 'string' ? $(sel, root) : sel; if (!el) return null;
    const a = el.getBoundingClientRect(), b = screen.getBoundingClientRect();
    return { x: a.left - b.left + Math.min(a.width * .55, a.width - 8), y: a.top - b.top + a.height * .6, el };
  }
  async function point(sel, t) {
    $$('.hint', root).forEach(e => e.classList.remove('hint'));
    const p = pos(sel); if (!p) return;
    cursor.classList.add('on');
    cursor.style.transition = fast ? 'none' : '';
    cursor.style.transform = `translate(${p.x}px,${p.y}px)`;
    p.el.classList.add('hint');
    await wait(720, t);
  }
  async function tap(sel, t) {
    await point(sel, t);
    if (!fast) { cursor.classList.remove('tap'); void cursor.offsetWidth; cursor.classList.add('tap'); }
    await wait(260, t);
    $$('.hint', root).forEach(e => e.classList.remove('hint'));
  }
  async function type(text, t) {
    S.typing = true;
    if (fast) { S.text = text; render(); return; }
    for (let i = 1; i <= text.length; i++) { S.text = text.slice(0, i); render(); await wait(text[i - 1] === ' ' ? 70 : 38, t); }
    await wait(300, t);
  }

  /* shared step pieces */
  const notebookStep = { cap: 'Make a notebook. Add what you are learning.', d: 'del', run: async t => {
    S.view = 'nb'; render(); await wait(500, t);
    await tap('.nb-add', t);
    for (let i = 0; i < SOURCES.length; i++) { S.nb = i + 1; render(); await wait(130, t); }
    await point('.nb-list', t); await wait(900, t);
  } };
  const addNotebookSteps = [
    { cap: 'Add your notebook: ＋ → More uploads → Notebooks.', run: async t => {
      await tap('.c-plus', t); S.menu = true; render(); await wait(550, t);
      await point('[data-i="up"]', t); S.sub = 'up'; render(); await wait(450, t);
      await tap('[data-i="nbs"]', t); S.menu = false; S.sub = null; S.dialog = true; render(); await wait(700, t);
    } },
    { cap: 'Choose your notebook. Tap Add.', d: 'del', run: async t => {
      await tap('.dl-row.r0', t); S.pick = true; render(); await wait(450, t);
      await tap('.dl-add', t); S.dialog = false; S.pick = false; S.chips = S.chips.concat('nb'); render(); await wait(900, t);
    } } ];
  const send = async t => {
    await tap('.c-send', t);
    S.sent = { chips: S.chips.slice(), text: S.text }; S.chips = []; S.text = ''; S.typing = false;
    S.mode = 'chat'; S.chat = 0; render(); await wait(600, t);
    S.chat = 1; render(); await wait(1500, t);
    S.chat = 2; render(); await wait(1100, t);
  };

  const STEPS = track === 'song' ? [
    notebookStep,
    { cap: 'Open Gemini. Tap ＋.', run: async t => {
      S.view = 'gem'; S.mode = 'home'; render(); await wait(600, t);
      await tap('.c-plus', t); S.menu = true; render(); await wait(800, t);
    } },
    { cap: 'Tap Create music.', run: async t => {
      await tap('[data-i="music"]', t); S.menu = false; S.tool = 'music'; S.mode = 'gallery'; render(); await wait(1000, t);
    } },
    { cap: 'Pick a card: Memorize something.', run: async t => {
      await tap('.card-memo', t); S.chips = ['memo']; render(); await wait(900, t);
    } },
    ...addNotebookSteps,
    { cap: 'Say what to remember — and the music style.', d: 'des', run: async t => {
      await tap('.c-in', t); await type(PROMPT.song, t);
    } },
    { cap: 'Send. Gemini writes the words and sings the song.', run: async t => {
      await send(t); S.chat = 3; render(); await wait(700, t);
      await tap('.sc-play', t); S.songOn = true; render(); await wait(2600, t);
    } },
    { cap: 'Check it! Does the song match your notes?', d: 'dis', run: async t => {
      S.check = true; render(); await point('.check-bubble', t); await wait(3200, t);
    } }
  ] : [
    notebookStep,
    { cap: 'Open Gemini. Tap ＋ → More tools → Canvas.', run: async t => {
      S.view = 'gem'; S.mode = 'home'; render(); await wait(600, t);
      await tap('.c-plus', t); S.menu = true; render(); await wait(550, t);
      await point('[data-i="tools"]', t); S.sub = 'tools'; render(); await wait(450, t);
      await tap('[data-i="canvas"]', t); S.menu = false; S.sub = null; S.tool = 'canvas'; render(); await wait(800, t);
    } },
    ...addNotebookSteps,
    { cap: 'Ask for a storybook about your topic.', d: 'des', run: async t => {
      await tap('.c-in', t); await type(PROMPT.story, t);
    } },
    { cap: 'Send. Gemini writes and draws a 10-page book.', run: async t => {
      await send(t);
      S.book = 0; render(); await wait(1600, t);
      for (const p of [1, 2, 3]) { await tap('.bk-nav', t); S.book = p; render(); await wait(1500, t); }
    } },
    { cap: 'Tap Listen. Gemini reads the book to you.', run: async t => {
      await tap('.bk-listen', t); S.listen = true; render(); await wait(2600, t);
    } },
    { cap: 'Check it! Gemini says Leo is the hero. Is he?', d: 'dis', run: async t => {
      S.listen = false; S.book = null; S.check = true; render(); await point('.chk', t); await wait(3400, t);
    } }
  ];

  dotsEl.innerHTML = STEPS.map((s, i) => `<button type="button" class="dot" data-i="${i}" aria-label="Step ${i + 1}"></button>`).join('');

  function caption(i) {
    const s = STEPS[i];
    capN.textContent = i + 1; capT.textContent = s.cap;
    capD.innerHTML = s.d ? `<span class="dbadge" style="--cl:${COL[s.d][1]}">${svgI(s.d)}${NAME[s.d][0]}</span>` : '';
    $$('.dot', root).forEach((d, k) => { d.classList.toggle('done', k < i); d.classList.toggle('now', k === i); });
  }
  function setPlaying(p) { playing = p; root.classList.toggle('playing', p); $('.cb-play', root).setAttribute('aria-label', p ? 'Pause' : 'Play'); }

  async function go(i, autoplay = true) {
    const t = ++token; idx = i;
    root.classList.remove('ended'); started = true; root.classList.add('started');
    win.classList.add('instant'); S = init(); fast = true;
    try { for (let k = 0; k < i; k++) { render(); await STEPS[k].run(t); } } catch (e) { if (e !== CANCEL) throw e; return; }
    fast = false; render(); void win.offsetWidth; win.classList.remove('instant');
    caption(i);
    if (!autoplay) { setPlaying(false); return; }
    setPlaying(true);
    try {
      for (let k = i; k < STEPS.length; k++) {
        idx = k; caption(k); live(t);
        await STEPS[k].run(t);
        await wait(500, t);
        if (!playing) return;
      }
      setPlaying(false); root.classList.add('ended'); $$('.dot', root).forEach(d => d.classList.add('done'));
    } catch (e) { if (e !== CANCEL) throw e; }
  }
  /* pausing = finish nothing more: freeze at the start of the current step */
  function pause() { token++; setPlaying(false); go(idx, false); }

  $('.win-start', root).addEventListener('click', () => go(0));
  $('.cb-play', root).addEventListener('click', () => {
    if (!started || root.classList.contains('ended')) return go(0);
    playing ? pause() : go(idx);
  });
  $('.cb-prev', root).addEventListener('click', () => go(Math.max(0, idx - (started ? 1 : 0))));
  $('.cb-next', root).addEventListener('click', () => go(Math.min(STEPS.length - 1, started ? idx + 1 : 0)));
  dotsEl.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) go(+b.dataset.i); });

  S = init(); render(); caption(0);
}
$$('.demo').forEach(el => Demo(el));

/* ------------------------------------------------------------------ */
/* 3. KARAOKE + GEARS                                                  */
/* ------------------------------------------------------------------ */
(function karaoke() {
  const SONG = window.SS_SONG; if (!SONG) return;
  const audio = $('#sg-audio'), kline = $('#kline'), knext = $('#knext'), list = $('#lyric-list'), bar = $('#sg-bar');
  const cluster = $('#cluster'), plate = $('#dplate'), stage = $('#stage');
  const DKEY = w => { const k = w.toLowerCase().replace(/[^a-z]/g, '');
    return k === 'delegation' ? 'del' : k === 'description' ? 'des' : k === 'discernment' ? 'dis' : k === 'diligence' ? 'dil' : k === 'dees' ? 'all' : null; };

  cluster.innerHTML = ['del', 'dis', 'dil', 'des'].map(d => gearHTML(d, 'cg')).join('') + '<i class="sweet"></i>';
  const gears = {}; $$('.gear', cluster).forEach(g => gears[g.dataset.d] = g);
  const PH = { del: 0, dis: TD / 2, dil: 0, des: TD / 2 }, SPIN = { del: 1, dil: 1, dis: -1, des: -1 };

  /* cues: the moment each D is sung, and every "Four Dees" */
  const cues = [];
  SONG.forEach(l => l.w.forEach(w => { const d = DKEY(w[0]); if (d) cues.push({ t: w[1], d }); }));
  const first = {}; cues.forEach(c => { if (c.d !== 'all' && first[c.d] == null) first[c.d] = c.t; });

  list.innerHTML = SONG.map((l, i) => `<li data-i="${i}"><button type="button">${esc(l.t)}</button></li>`).join('');
  /* The site's static server has no byte-range support, so a streamed mp3 can't
     seek. On first play the song is also fetched whole and swapped in as a blob,
     which seeks anywhere; until then, a seek is remembered and applied on swap. */
  let blobReady = false, fetching = false, pendingSeek = null;
  function ensureBlob() {
    if (blobReady || fetching) return; fetching = true;
    fetch(audio.currentSrc || audio.src).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => {
      const t = pendingSeek != null ? pendingSeek : audio.currentTime, was = !audio.paused || pendingPlay;
      audio.src = URL.createObjectURL(b); blobReady = true;
      audio.addEventListener('loadedmetadata', () => { audio.currentTime = t; pendingSeek = null; pendingPlay = false; if (was) audio.play().catch(() => {}); kick(); }, { once: true });
    }).catch(() => { fetching = false; });
  }
  let pendingPlay = false;
  function seekTo(t, play) {
    if (blobReady) { audio.currentTime = t; if (play && audio.paused) audio.play(); }
    else { pendingSeek = t; pendingPlay = pendingPlay || !!play; try { audio.currentTime = t; } catch (e) {} if (play && audio.paused) audio.play().catch(() => {}); ensureBlob(); }
    cur = -2; kick();
  }
  list.addEventListener('click', e => { const li = e.target.closest('li'); if (!li) return; seekTo(SONG[+li.dataset.i].s + .05, true); });

  let cur = -2, rot = 0, speed = 0, last = performance.now(), wasOn = {};
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function lineAt(t) {
    for (let i = 0; i < SONG.length; i++) if (t >= SONG[i].s && t < SONG[i].e) return i;
    return -1;
  }
  function paintLine(i) {
    if (i < 0) {
      const nx = SONG.findIndex(l => l.s > audio.currentTime);
      kline.innerHTML = `<span class="kidle">♪ ${audio.currentTime > 1 && nx > 0 ? '…' : 'The Boatman’s Four Steps'} ♪</span>`;
      knext.textContent = nx >= 0 && audio.currentTime > 1 ? SONG[nx].t : '';
    } else {
      kline.innerHTML = SONG[i].w.map((w, k) => { const d = DKEY(w[0]);
        return `<span class="kw${d ? ' kd kd-' + d : ''}" data-k="${k}">${esc(w[0])}</span>`; }).join(' ');
      knext.textContent = SONG[i + 1] ? SONG[i + 1].t : '';
    }
    $$('li', list).forEach((li, k) => li.classList.toggle('now', k === i));
    if (i >= 0) { const li = list.children[i], box = list;
      const want = li.offsetTop - box.clientHeight / 2 + li.clientHeight / 2;
      box.scrollTo({ top: want, behavior: reduced ? 'auto' : 'smooth' }); }
  }
  function frame(now) {
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    const t = pendingSeek != null ? pendingSeek : audio.currentTime;
    const i = lineAt(t);
    if (i !== cur) { cur = i; paintLine(i); }
    if (i >= 0) $$('.kw', kline).forEach((sp, k) => { const w = SONG[i].w[k];
      sp.classList.toggle('on', t >= w[1] && t < w[2]); sp.classList.toggle('sung', t >= w[2]); });
    // gears
    const recent = cues.filter(c => c.t <= t).pop();
    const flashAll = cues.some(c => c.d === 'all' && t >= c.t && t < c.t + 2.4);
    for (const d in gears) {
      const on = (first[d] != null && t >= first[d]) || flashAll || t > 160;
      if (on && !wasOn[d] && !audio.paused) { gears[d].classList.remove('pop'); void gears[d].offsetWidth; gears[d].classList.add('pop'); }
      wasOn[d] = on; gears[d].classList.toggle('on', on);
      gears[d].classList.toggle('focus', !!recent && recent.d === d && t - recent.t < 7);
    }
    const hot = recent && t - recent.t < 2.6;
    const target = audio.paused ? 0 : hot ? (reduced ? 30 : 110) : 10;
    speed += (target - speed) * Math.min(1, dt * 3);
    rot += speed * dt;
    for (const d in gears) $('.grot', gears[d]).style.transform = `rotate(${(PH[d] + SPIN[d] * rot).toFixed(2)}deg)`;
    cluster.classList.toggle('all', flashAll);
    // plate
    const showD = recent && t - recent.t < 9 ? recent.d : null;
    const key = showD || (t > 1 ? 'idle' : 'start');
    if (plate.dataset.k !== key) {
      plate.dataset.k = key;
      if (showD && showD !== 'all') { plate.style.setProperty('--cl', COL[showD][1]);
        plate.innerHTML = `<b>${svgI(showD)}${NAME[showD][0]}<em>${NAME[showD][1]}</em></b><span>${MEANS[showD]}</span>`; }
      else if (showD === 'all') { plate.style.setProperty('--cl', '#F2D68C'); plate.innerHTML = '<b>The Four Dees</b><span>Four keys that work together.</span>'; }
      else { plate.style.setProperty('--cl', 'rgba(242,214,140,.5)'); plate.innerHTML = `<b>The 4Ds</b><span>${key === 'start' ? 'Press play. Watch each gear turn in.' : 'Listen for each D.'}</span>`; }
    }
    // progress
    if (!bar.matches(':active')) bar.value = t;
    $('#sg-cur').textContent = fmt(t);
    if (!audio.paused || speed > .5) requestAnimationFrame(frame); else looping = false;
  }
  let looping = false;
  const kick = () => { if (!looping) { looping = true; last = performance.now(); requestAnimationFrame(frame); } };

  const toggle = () => (audio.paused ? audio.play() : audio.pause());
  $('#sg-play').addEventListener('click', toggle);
  $('#sg-cover').addEventListener('click', toggle);
  audio.addEventListener('play', () => { stage.classList.add('playing'); ensureBlob(); kick(); });
  audio.addEventListener('pause', () => { stage.classList.remove('playing'); kick(); });
  audio.addEventListener('ended', () => stage.classList.remove('playing'));
  audio.addEventListener('seeked', kick);
  audio.addEventListener('loadedmetadata', () => { bar.max = audio.duration; $('#sg-dur').textContent = fmt(audio.duration); });
  bar.addEventListener('input', () => seekTo(+bar.value, false));
  window.SS_seek = seekTo;
  const rates = [1, .85, .7]; let ri = 0;
  $('#sg-rate').addEventListener('click', e => { ri = (ri + 1) % rates.length; audio.playbackRate = rates[ri];
    e.currentTarget.textContent = rates[ri] + '×'; e.currentTarget.classList.toggle('slow', ri > 0); });
  kick();
})();

/* ------------------------------------------------------------------ */
/* 4. STORYBOOK READER                                                 */
/* ------------------------------------------------------------------ */
(function reader() {
  if (!BOOK.length) return;
  const pic = $('#rd-pic'), txt = $('#rd-text'), num = $('#rd-num'), count = $('#rd-count'), btn = $('#rd-listen'), auto = $('#rd-auto');
  const synth = window.speechSynthesis;
  let page = 0, speaking = false, voice = null;

  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices().filter(v => /^en(-|_|$)/i.test(v.lang));
    voice = vs.find(v => v.default) || vs.find(v => /google/i.test(v.name) && /US|GB/i.test(v.lang))
      || vs.find(v => /en.US/i.test(v.lang)) || vs[0] || null;
  }
  if (synth) { pickVoice(); synth.addEventListener && synth.addEventListener('voiceschanged', pickVoice); }
  else btn.hidden = true;

  const words = s => { const out = []; const re = /\S+/g; let m; while ((m = re.exec(s))) out.push([m[0], m.index]); return out; };
  function show(i) {
    page = Math.max(0, Math.min(BOOK.length - 1, i));
    const p = BOOK[page];
    pic.innerHTML = p.img ? `<img src="${p.img}" alt="Storybook picture, page ${page}">` : '<div class="blank-pic"><span>✦</span><small>(picture missing in the download)</small></div>';
    if (p.title) {
      txt.className = 'title-page'; txt.innerHTML = '<span class="tp-t">The Captain of the Loop</span><span class="tp-b">By Tim Hall</span>';
      num.textContent = '';
    } else {
      txt.className = ''; txt.innerHTML = words(p.text).map(([w, at]) => `<span data-at="${at}">${esc(w)}</span>`).join(' ');
      num.textContent = page;
    }
    $('#reader').dataset.d = p.d || '';
    count.textContent = `${page + 1} / ${BOOK.length}`;
    $('#rd-prev').disabled = page === 0; $('#rd-next').disabled = page === BOOK.length - 1;
  }
  function stop() { speaking = false; if (synth) synth.cancel(); btn.classList.remove('on'); $('.lbl', btn).textContent = 'Listen'; $$('#rd-text span').forEach(s => s.classList.remove('on')); }
  function speak() {
    if (!synth) return;
    synth.cancel();
    const p = BOOK[page], text = p.title ? 'The Captain of the Loop. By Tim Hall.' : p.text;
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice; u.lang = voice ? voice.lang : 'en-US'; u.rate = .92;
    const spans = $$('#rd-text span[data-at]');
    u.onboundary = e => { if (e.name && e.name !== 'word') return;
      spans.forEach(s => s.classList.toggle('on', +s.dataset.at === e.charIndex || (+s.dataset.at <= e.charIndex && e.charIndex < +s.dataset.at + s.textContent.length))); };
    u.onend = () => { if (!speaking) return; spans.forEach(s => s.classList.remove('on'));
      if (auto.checked && page < BOOK.length - 1) { show(page + 1); setTimeout(() => speaking && speak(), 700); } else stop(); };
    speaking = true; btn.classList.add('on'); $('.lbl', btn).textContent = 'Stop';
    synth.speak(u);
  }
  btn.addEventListener('click', () => (speaking ? stop() : speak()));
  $('#rd-prev').addEventListener('click', () => { const was = speaking; stop(); show(page - 1); if (was) speak(); });
  $('#rd-next').addEventListener('click', () => { const was = speaking; stop(); show(page + 1); if (was) speak(); });
  let sx = null;
  pic.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  pic.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) $(dx < 0 ? '#rd-next' : '#rd-prev').click(); });
  show(0);
})();

/* ------------------------------------------------------------------ */
/* 5. YOUR TURN                                                        */
/* ------------------------------------------------------------------ */
(function builder() {
  const topic = $('#b-topic'), style = $('#b-style'), forWho = $('#b-for');
  function upd() {
    const tp = topic.value.trim() || '______';
    $('#p-song').textContent = `I want to memorize ${tp} and remember what it means. ${style.value} style.`;
    $('#p-story').textContent = `Make a storybook about ${tp} for ${forWho.value}. Use simple, clear English.`;
  }
  [topic, style, forWho].forEach(el => el.addEventListener('input', upd)); upd();
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    const text = $('#' + b.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    b.textContent = 'Copied ✓'; setTimeout(() => (b.textContent = 'Copy'), 1600);
  }));
})();
})();
