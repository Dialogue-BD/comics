/* ===========================================================================
   How Are You Feeling? — guided lesson and student activity
   ---------------------------------------------------------------------------
   Two ways in, as in Culture Circles:
     teacher  — an animated lesson for the projector (lesson.js), then the
                same seven steps the students do, shown large.
     student  — the seven steps on a phone, one thing at a time.

   The seven steps walk one feeling word up the Growing Participator
   Approach iceberg. A word starts deep under the water — heard, not yet
   understood — and rises each time it is heard and understood in context:

     Feel      name the feeling, measure the storm, breathe   (SEL)
     Hear      aural input flood: the word, many times        level 1
     Partners  collocations: the words it keeps company with  level 2
     Patterns  colligations: the grammar it hangs on          level 3
     ─────────────────────────── waterline ──────────────────────────
     Say       the headword in sentences, then your own       level 4
     Idioms    other ways English says the same feeling       level 5
     Share     the word is yours; tell the class              level 6

   Nothing is locked (Tim's standing rule): every step and every screen can
   be opened at any time, and nothing has to be finished first.
   =========================================================================== */
'use strict';

/* ------------------------------------------------------------ helpers */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function el(tag, cls, text){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function bn(node, text, inline){
  if (!text) return node;
  const b = el('span', 'bn' + (inline ? ' inl' : ''), text);
  b.lang = 'bn';
  node.appendChild(b);
  return node;
}
function txt(tag, cls, en, bnText){ return bn(el(tag, cls, en), bnText); }
function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
const store = {
  get(k, d){ try { const v = localStorage.getItem('hayf:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v){ try { localStorage.setItem('hayf:' + k, JSON.stringify(v)); } catch (e) {} }
};

/* one stroke-icon set for the whole page (24px grid) */
const ICONS = {
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  ear: 'M7 10a5 5 0 0 1 10 0c0 3-2.5 3.5-3 6a3 3 0 0 1-5.5 1.5M10 10a2 2 0 0 1 4 0c0 1.2-1 1.6-1.5 2.4',
  link: 'M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1',
  puzzle: 'M5 8h3a2 2 0 1 1 4 0h3v3a2 2 0 1 1 0 4v3h-3a2 2 0 1 0-4 0H5v-3a2 2 0 1 0 0-4z',
  speech: 'M4 5h16v11H9l-5 4z M8 9h8M8 12h5',
  image: 'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15 9.5a1 1 0 1 0 .01 0',
  berg: 'M3 13h18 M6 13l4-8 3 4 2-2 3 6 M5 13l2 6h10l2-6',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  stop: 'M6 6h12v12H6z',
  replay: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5',
  print: 'M7 9V3h10v6 M7 17H4v-7h16v7h-3 M7 14h10v7H7z',
  tv: 'M3 4h18v13H3z M8 21h8M12 17v4',
  phone: 'M7 2h10v20H7z M11 18h2',
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20a6 6 0 0 1 12 0 M16 11a3 3 0 1 0 0-6 M21 20a6 6 0 0 0-4-5.6',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15.5 8.5l-2 5-5 2 2-5z',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l5 5 9-10',
  flip: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  hand: 'M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.2-5.5-3.5L3.8 13a1.5 1.5 0 0 1 2.4-1.8L8 13',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
};
function icon(name, cls){
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('class', 'ico' + (cls ? ' ' + cls : ''));
  s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', ICONS[name] || '');
  if (name === 'play') { p.setAttribute('fill', 'currentColor'); p.setAttribute('stroke', 'none'); }
  s.appendChild(p);
  return s;
}

/* ------------------------------------------------------------- words */
const FAMILY = {};            /* word -> big feeling */
const PARENT = {};            /* word -> the word one ring in */
EMO.wheel.forEach(p => {
  FAMILY[p.name] = p.name;
  p.children.forEach(c => {
    FAMILY[c.name] = FAMILY[c.name] || p.name; PARENT[c.name] = PARENT[c.name] || p.name;
    c.children.forEach(t => { FAMILY[t] = FAMILY[t] || p.name; PARENT[t] = PARENT[t] || c.name; });
  });
});
const famKey = w => (FAMILY[w] || 'Happy').toLowerCase();
const lower = w => w.toLowerCase();
const emoji = w => EMO.emoji[w] || '🙂';
const bnWord = w => EMO.bn[w] || '';
const chunk = w => CHUNKS[w] || CHUNKS.Happy;
/* "~" is the word itself; {form} is another form of it */
function plain(s, w){ return s.replace(/~/g, lower(w)).replace(/[{}\[\]*]/g, ''); }
/* the same line as HTML, with the word lit up; [key] can be lit or hidden */
function marked(s, w, keyMode){
  let h = esc(s).replace(/~/g, '<span class="hw">' + esc(lower(w)) + '</span>')
                .replace(/\{([^}]+)\}/g, '<span class="hw">$1</span>')
                .replace(/\*([^*]+)\*/g, '<span class="idm">$1</span>');
  h = h.replace(/\[([^\]]+)\]/g, (m, k) => keyMode === 'gap' ? '<span class="gap" data-gap></span>'
                                          : keyMode === 'lit' ? '<span class="key">' + k + '</span>' : k);
  return h;
}
function stemRe(w){
  const x = lower(w);
  const stem = x.length <= 4 ? x : x.slice(0, Math.max(4, x.length - 3));
  return x.length <= 4 ? new RegExp('\\b' + stem + '\\b', 'i') : new RegExp('\\b' + stem + '\\w*', 'i');
}
/* the listening flood: the word, its partners, its patterns, its sentences */
function floodLines(w){
  const C = chunk(w);
  return [w + '.', w + '.']
    .concat(C.p.map(x => plain(x, w) + '.'))
    .concat(C.g.map(g => plain(g[1], w)))
    .concat((EMO.say[w] || []).slice(0, 5));
}
const BIG_BN = { Fear: 'ভয়', Anger: 'রাগ', Surprise: 'বিস্ময়', Happy: 'আনন্দ', Disgust: 'ঘৃণা', Sad: 'দুঃখ' };

/* ------------------------------------------------------------ state */
const S = {
  role: store.get('role', null),
  lang: store.get('lang', 'en'),
  tv: false,
  view: 'welcome',                 /* welcome | lesson | flow */
  lstep: 0, step: 0, sub: 0, dir: 1,
  word: store.get('word', null),
  storm0: store.get('storm0', null), storm1: store.get('storm1', null),
  level: store.get('level', 0),
  frames: store.get('frames', { because: '', stake: '', need: '' }),
  idiom: store.get('idiom', null),
  pick: { big: null, mid: null }
};
(function readURL(){
  const q = new URLSearchParams(location.search);
  const r = q.get('role'); if (r === 'student' || r === 'teacher') S.role = r;
  const w = q.get('word'); if (w && CHUNKS[w[0].toUpperCase() + w.slice(1).toLowerCase()]) S.word = w[0].toUpperCase() + w.slice(1).toLowerCase();
  if (q.get('lang') === 'bn') S.lang = 'bn';
})();
function curWord(){ return S.word || 'Anxious'; }
function save(){ ['role', 'lang', 'word', 'storm0', 'storm1', 'level', 'frames', 'idiom'].forEach(k => store.set(k, S[k])); }

/* ------------------------------------------------------------- speech
   Browser voices only (no recordings yet). Lines are spoken one at a time
   so Chrome's long-utterance cut-off never bites, and every line has a
   watchdog so a device that never fires "end" cannot freeze the page. */
const TTS = {
  ok: 'speechSynthesis' in window, voice: null, rate: store.get('rate', 0.9), run: 0,
  pick(){
    if (!this.ok) return;
    const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
    const pref = [/en-US.*(Google|Samantha|Aria|Jenny|Natural)/i, /en-GB.*(Google|Natural|Sonia|Libby)/i, /en-US/i, /en-GB/i, /en/i];
    const saved = store.get('voice', null);
    this.voice = vs.find(v => v.name === saved) || null;
    for (const re of pref) { if (this.voice) break; this.voice = vs.find(v => re.test(v.lang + ' ' + v.name)) || null; }
  },
  voices(){ return this.ok ? speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)) : []; },
  stop(){ this.run++; if (this.ok) speechSynthesis.cancel(); },
  /* speak lines in order; o.onLine(i), o.onWord(i, charIndex), o.onDone() */
  list(lines, o = {}){
    this.stop();
    const run = this.run, gap = o.gap == null ? 650 : o.gap;
    let i = o.from || 0;
    const next = () => {
      if (run !== this.run) return;
      if (i >= lines.length) { o.onDone && o.onDone(); return; }
      const k = i++, text = lines[k];
      o.onLine && o.onLine(k);
      this.say(text, {
        onWord: c => run === this.run && o.onWord && o.onWord(k, c),
        onEnd: () => { if (run === this.run) setTimeout(next, gap); }
      }, run);
    };
    next();
    return run;
  },
  say(text, o = {}, run){
    if (run == null) { this.stop(); run = this.run; }
    const est = 600 + text.length * 62 / this.rate;
    let done = false;
    const end = () => { if (done) return; done = true; clearTimeout(dog); o.onEnd && o.onEnd(); };
    const dog = setTimeout(end, est * 2 + 1500);
    if (!this.ok || !this.voices().length) {
      /* no voice: walk the words at reading pace so the highlight still moves */
      const words = [...text.matchAll(/\S+/g)];
      words.forEach((m, j) => setTimeout(() => { if (run === this.run && !done) o.onWord && o.onWord(m.index); }, j * est / Math.max(1, words.length)));
      setTimeout(end, est);
      if (!TTS.warned) { TTS.warned = true; toast('No English voice on this device — read along instead.', 'এই ডিভাইসে ইংরেজি কণ্ঠ নেই — লেখাটি পড়ে নিন।'); }
      return;
    }
    const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g, ''));
    if (this.voice) u.voice = this.voice;
    u.lang = this.voice ? this.voice.lang : 'en-US';
    u.rate = this.rate;
    u.onboundary = e => { if (e.name === 'word' || e.charIndex != null) o.onWord && o.onWord(e.charIndex); };
    u.onend = end; u.onerror = end;
    speechSynthesis.speak(u);
  }
};
if (TTS.ok) { TTS.pick(); speechSynthesis.onvoiceschanged = () => TTS.pick(); }

/* a line of text split into word spans, for karaoke */
function wordSpans(node, html){
  node.innerHTML = html;
  /* wrap each word of the text nodes, keeping the markup around them */
  const walk = n => {
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else frag.appendChild(el('span', 'w', part));
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.hasAttribute('data-gap')) walk(c);
    });
  };
  walk(node);
  /* char offsets of each word in the spoken text */
  let at = 0;
  const spans = [...node.querySelectorAll('.w')];
  const plainText = node.textContent;
  spans.forEach(s => { const k = plainText.indexOf(s.textContent, at); s.dataset.c = k; at = k + s.textContent.length; });
  return spans;
}
function lightWord(spans, c){
  let hit = null;
  spans.forEach(s => { if (+s.dataset.c <= c) hit = s; });
  spans.forEach(s => s.classList.toggle('lit', s === hit));
}

/* ------------------------------------------------------------- toast */
let toastT = 0;
function toast(en, bnText){
  const t = $('#toast');
  t.replaceChildren(el('div', null, en));
  if (bnText) bn(t, bnText);
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 3800);
}

/* -------------------------------------------------------- language, TV */
function setLang(l){
  S.lang = l;
  document.body.classList.toggle('bangla', l === 'bn');
  $$('.langsw button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
  save(); measure();
}
function setTV(on){
  S.tv = on;
  document.documentElement.dataset.theme = on ? 'stage' : 'paper';
  $('#btn-tv').setAttribute('aria-pressed', String(on));
  $('#brand-mode').hidden = !on;
  store.set('tv', on);
  measure();
}
function measure(){
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--header-h', $('#appbar').offsetHeight + 'px');
    document.documentElement.style.setProperty('--foot-h', $('#actionbar').offsetHeight + 'px');
  });
}
window.addEventListener('resize', measure);

/* ============================================================ the steps */
const STEPS = [
  { k: 'feel',     en: 'Feel',     bn: 'অনুভব',     ico: 'heart',  lv: 0 },
  { k: 'hear',     en: 'Hear',     bn: 'শুনুন',      ico: 'ear',    lv: 1 },
  { k: 'partners', en: 'Partners', bn: 'সঙ্গী শব্দ', ico: 'link',   lv: 2 },
  { k: 'patterns', en: 'Patterns', bn: 'গঠন',       ico: 'puzzle', lv: 3 },
  { k: 'say',      en: 'Say',      bn: 'বলুন',       ico: 'speech', lv: 4 },
  { k: 'idioms',   en: 'Idioms',   bn: 'বাগধারা',    ico: 'image',  lv: 5 },
  { k: 'share',    en: 'Share',    bn: 'ভাগ করুন',   ico: 'berg',   lv: 6 }
];
/* the six rungs of the iceberg, deepest first (after the GPA "language iceberg") */
const LEVELS = [
  ['I have heard it', 'শুনেছি'],
  ['I know its partners', 'সঙ্গী শব্দ চিনি'],
  ['I know its pattern', 'গঠন জানি'],
  ['I have said it', 'বলেছি'],
  ['I can say it other ways', 'অন্যভাবেও বলতে পারি'],
  ['It is mine', 'শব্দটি আমার']
];

/* ---------- small builders shared by the screens ---------- */
function task(ico, en, bnText, leadEn, leadBn){
  const t = el('div', 'task');
  const i = el('span', 'task-ico'); i.appendChild(icon(ico)); t.appendChild(i);
  const x = el('div', 'task-txt');
  x.appendChild(txt('h2', 'h-title', en, bnText));
  if (leadEn) x.appendChild(txt('p', 'lead', leadEn, leadBn));
  t.appendChild(x);
  return t;
}
function wordCard(w, opts = {}){
  const c = el('div', 'wcard');
  c.appendChild(el('div', 'emo', emoji(w)));
  c.appendChild(el('div', 'w', w));
  const ipa = EMO.pron[lower(w)];
  if (ipa) c.appendChild(el('div', 'ipa', ipa));
  const b = el('div', 'bnw', bnWord(w)); b.lang = 'bn'; c.appendChild(b);
  if (opts.meaning !== false && EMO.info[w]) {
    const m = el('p', 'mean');
    const b0 = el('b', null, w + ': '); m.appendChild(b0);
    m.appendChild(el('span', null, 'when ' + EMO.info[w][0] + '.'));
    c.appendChild(m);
  }
  const say = el('button', 'roundbtn'); say.type = 'button'; say.setAttribute('aria-label', 'Hear the word');
  say.style.cssText = 'position:absolute;right:12px;top:12px';
  say.appendChild(icon('play')); say.onclick = () => TTS.say(w);
  c.appendChild(say);
  return c;
}
function playBtn(onToggle){
  const b = el('button', 'play'); b.type = 'button'; b.setAttribute('aria-label', 'Play');
  b.appendChild(icon('play'));
  b.onclick = () => onToggle(b);
  b.setOn = on => { b.classList.toggle('is-on', on); b.replaceChildren(icon(on ? 'stop' : 'play')); b.setAttribute('aria-label', on ? 'Stop' : 'Play'); };
  return b;
}
function weather(n){
  /* 1 clear sun … 5 thunderstorm: a wordless storm-size scale */
  const s = ['<circle cx="24" cy="24" r="9" fill="#E9B949"/><g stroke="#E9B949" stroke-width="3" stroke-linecap="round"><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M11 37l3.5-3.5M33.5 14.5L37 11"/></g>',
    '<circle cx="18" cy="18" r="8" fill="#E9B949"/><path d="M14 36h20a7 7 0 0 0 0-14 9 9 0 0 0-17 3 5.5 5.5 0 0 0-3 11z" fill="#fff" stroke="#8FA3AD" stroke-width="2"/>',
    '<path d="M10 34h26a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.5 6.5 0 0 0-5 13z" fill="#D5DEE3" stroke="#6C8490" stroke-width="2"/>',
    '<path d="M10 28h26a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.5 6.5 0 0 0-5 13z" fill="#A9B8C0" stroke="#566E7A" stroke-width="2"/><g stroke="#3F7FA6" stroke-width="3" stroke-linecap="round"><path d="M15 33l-2 6M24 33l-2 6M33 33l-2 6"/></g>',
    '<path d="M10 26h26a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.5 6.5 0 0 0-5 13z" fill="#6E7F89" stroke="#3E4E57" stroke-width="2"/><path d="M25 26l-6 10h6l-3 9 10-13h-6l3-6z" fill="#F2C443" stroke="#9A7616" stroke-width="1.5" stroke-linejoin="round"/>'][n - 1];
  return '<svg viewBox="0 0 48 48" aria-hidden="true">' + s + '</svg>';
}
function stormScale(key, onPick){
  const row = el('div', 'wx'); row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'How strong is the feeling, 1 to 5');
  for (let n = 1; n <= 5; n++) {
    const b = el('button'); b.type = 'button';
    b.innerHTML = weather(n) + '<span class="n">' + n + '</span>';
    b.setAttribute('aria-pressed', String(S[key] === n));
    b.setAttribute('aria-label', 'Strength ' + n + ' of 5');
    b.onclick = () => { S[key] = n; save(); [...row.children].forEach((x, j) => x.setAttribute('aria-pressed', String(j + 1 === n))); onPick && onPick(n); };
    row.appendChild(b);
  }
  return row;
}
/* the mini iceberg in the word bar: the dot is the word */
function bergMini(level){
  const y = [27, 23.5, 19.5, 11, 7.5, 4][Math.max(0, level - 1)] ;
  return '<svg class="wb-berg" viewBox="0 0 112 30" aria-hidden="true">' +
    '<rect x="0" y="13" width="112" height="17" rx="3" fill="var(--sea-t)"/>' +
    '<path d="M0 13h112" stroke="var(--sea)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
    '<path d="M44 13l9-10 5 5 4-3 8 8z" fill="#fff" stroke="var(--sea)" stroke-width="1.2"/>' +
    '<path d="M38 13l32 0 6 8-12 8H44l-10-7z" fill="var(--ice-shade)" stroke="var(--sea)" stroke-width="1.2"/>' +
    (level ? '<circle cx="57" cy="' + y + '" r="3.6" fill="var(--fi)" stroke="#fff" stroke-width="1.5"/>' : '<circle cx="57" cy="29" r="2.6" fill="var(--fi)" opacity=".5"/>') +
    '<text x="82" y="10" font-size="8.5" font-weight="800" fill="var(--sea-deep)" font-family="Public Sans,sans-serif">' + level + '/6</text></svg>';
}
function setFamily(w){
  document.body.className = document.body.className.replace(/\bfam-\w+/g, '').trim();
  if (w) document.body.classList.add('fam-' + famKey(w));
}
function chooseWord(w){
  if (S.word !== w) { S.level = 0; S.idiom = null; }
  S.word = w; setFamily(w); save(); paintWordbar();
}
function paintWordbar(){
  const wb = $('#wordbar');
  if (S.view !== 'flow' || !S.word) { wb.hidden = true; measure(); return; }
  wb.hidden = false;
  wb.innerHTML = '';
  const chip = el('span', 'wb-chip');
  chip.appendChild(el('span', 'wb-emo', emoji(S.word)));
  chip.appendChild(el('span', null, S.word));
  wb.appendChild(chip);
  const b = el('span'); b.innerHTML = bergMini(S.level); b.title = 'How high the word has risen';
  wb.appendChild(b.firstChild);
  measure();
}

/* ============================================================ FEEL */
function feelTile(name, cls, onPick, pressed, keep){
  const b = el('button', 'ftile f-' + famKey(name) + (keep ? ' keep' : '')); b.type = 'button';
  b.setAttribute('aria-pressed', String(!!pressed));
  b.appendChild(el('span', 'emo', emoji(name)));
  b.appendChild(el('span', 'nm', keep ? 'Keep “' + name + '”' : name));
  if (!keep) { const x = el('span', 'bn', bnWord(name)); x.lang = 'bn'; b.appendChild(x); }
  b.onclick = () => { onPick(name); b.setAttribute('aria-pressed', 'true'); setTimeout(() => go(1), 420); };
  return b;
}
function scrBig(){
  const p = el('div', 'panel');
  p.appendChild(task('heart', 'How are you feeling right now?', 'এই মুহূর্তে আপনার কেমন লাগছে?', 'Start with a big feeling. There is no wrong answer.', 'একটি বড় অনুভূতি দিয়ে শুরু করুন। কোনো উত্তরই ভুল নয়।'));
  const g = el('div', 'fgrid six');
  EMO.wheel.forEach((f, i) => {
    const t = feelTile(f.name, '', n => { S.pick.big = n; chooseWord(n); }, S.word && FAMILY[S.word] === f.name);
    t.style.animationDelay = (i * 0.05) + 's';
    const x = t.querySelector('.bn'); if (x) x.textContent = BIG_BN[f.name];
    g.appendChild(t);
  });
  p.appendChild(g);
  const l = el('button', 'linkbtn'); l.type = 'button';
  l.appendChild(icon('compass')); bn(l.appendChild(el('span', null, 'Not sure? Notice the clues in your body')), 'নিশ্চিত নন? শরীরের লক্ষণ খেয়াল করুন', true);
  l.onclick = openClues;
  p.appendChild(l);
  return p;
}
function scrMid(){
  const p = el('div', 'panel');
  const big = FAMILY[S.word] || 'Happy';
  p.appendChild(task('heart', 'Can you be more exact?', 'আরও নির্দিষ্ট করে বলতে পারেন?', 'Choose the word that fits best.', 'যে শব্দটি সবচেয়ে ভালো মেলে সেটি বেছে নিন।'));
  p.appendChild(trail());
  const g = el('div', 'fgrid four');
  const fam = EMO.wheel.find(f => f.name === big);
  fam.children.forEach((c, i) => { const t = feelTile(c.name, '', n => { S.pick.mid = n; chooseWord(n); }, S.word === c.name || PARENT[S.word] === c.name); t.style.animationDelay = (i * 0.05) + 's'; g.appendChild(t); });
  p.appendChild(g);
  const keep = el('div', 'fgrid'); keep.style.gridTemplateColumns = '1fr';
  keep.appendChild(feelTile(big, '', n => chooseWord(n), false, true));
  p.appendChild(keep);
  return p;
}
function scrExact(){
  const p = el('div', 'panel');
  const big = FAMILY[S.word] || 'Happy';
  const fam = EMO.wheel.find(f => f.name === big);
  let node = fam.children.find(c => c.name === S.word) || fam.children.find(c => c.name === PARENT[S.word]);
  p.appendChild(task('heart', 'The most exact word', 'সবচেয়ে সঠিক শব্দ', 'One more step. Or keep the word you have.', 'আরও এক ধাপ — অথবা আপনার শব্দটিই রাখুন।'));
  p.appendChild(trail());
  const g = el('div', 'fgrid');
  if (!node) node = fam.children[0];
  node.children.forEach((c, i) => { const t = feelTile(c, '', n => chooseWord(n), S.word === c); t.style.animationDelay = (i * 0.06) + 's'; g.appendChild(t); });
  p.appendChild(g);
  const keep = el('div', 'fgrid'); keep.style.gridTemplateColumns = '1fr';
  keep.appendChild(feelTile(node.name, '', n => chooseWord(n), false, true));
  p.appendChild(keep);
  return p;
}
function trail(){
  const t = el('div', 'trail');
  const w = curWord(), chain = [];
  let x = w; while (x) { chain.unshift(x); x = PARENT[x]; }
  chain.forEach((c, i) => { if (i) t.appendChild(el('span', null, '›')); t.appendChild(el(i === chain.length - 1 ? 'b' : 'span', null, emoji(c) + ' ' + c)); });
  return t;
}
function scrStorm(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('wind', 'You named it.', 'আপনি নাম দিয়েছেন।', 'Now: how strong is the feeling?', 'এবার বলুন: অনুভূতিটি কতটা তীব্র?'));
  p.appendChild(wordCard(w));
  p.appendChild(stormScale('storm0'));
  return p;
}
function scrBreathe(){
  const p = el('div', 'panel');
  p.appendChild(task('wind', 'Breathe with the circle', 'বৃত্তের সঙ্গে শ্বাস নিন', 'Three slow breaths. In as it grows, out as it shrinks.', 'তিনটি ধীর শ্বাস। বড় হলে শ্বাস নিন, ছোট হলে ছাড়ুন।'));
  const box = el('div', 'breath');
  box.innerHTML = '<div class="breath-ring"><svg viewBox="0 0 220 220" aria-hidden="true">' +
    '<circle cx="110" cy="110" r="104" fill="none" stroke="var(--sea-t)" stroke-width="3"/>' +
    '<circle class="breath-core" cx="110" cy="110" r="96" fill="var(--sea-t)" stroke="var(--sea)" stroke-width="2" style="transform:scale(.45)"/>' +
    '<text x="110" y="121" text-anchor="middle" font-size="34" font-family="Public Sans,sans-serif" font-weight="800" fill="var(--sea-deep)" class="breath-n"></text></svg></div>' +
    '<div class="breath-lab" aria-live="polite"></div><div class="breath-dots"><i></i><i></i><i></i></div>';
  const start = el('button', 'btn ghost'); start.type = 'button';
  bn(start.appendChild(el('span', null, 'Start')), 'শুরু', true);
  box.appendChild(start);
  p.appendChild(box);
  p.appendChild(txt('p', 'lead', 'Name it. Breathe. Now your mind has room to learn.', 'নাম দিন। শ্বাস নিন। এখন শেখার জন্য মনে জায়গা হলো।'));
  const core = box.querySelector('.breath-core'), lab = box.querySelector('.breath-lab'), num = box.querySelector('.breath-n'), dots = box.querySelectorAll('.breath-dots i');
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  start.onclick = () => {
    clear(); start.hidden = true;
    let t = 0;
    for (let k = 0; k < 3; k++) {
      timers.push(setTimeout(() => { core.style.transitionDuration = '4s'; core.style.transform = 'scale(1)'; lab.textContent = 'Breathe in'; }, t));
      for (let s = 0; s < 4; s++) timers.push(setTimeout(() => { num.textContent = s + 1; }, t + s * 1000));
      t += 4000;
      timers.push(setTimeout(() => { core.style.transitionDuration = '6s'; core.style.transform = 'scale(.45)'; lab.textContent = 'Breathe out'; }, t));
      for (let s = 0; s < 6; s++) timers.push(setTimeout(() => { num.textContent = 6 - s; }, t + s * 1000));
      t += 6000;
      timers.push(setTimeout(() => { dots[k].classList.add('on'); }, t - 50));
    }
    timers.push(setTimeout(() => { lab.textContent = 'Well done'; num.textContent = '✓'; start.hidden = false; start.firstChild.textContent = 'Again'; }, t));
  };
  p.cleanup = clear;
  return p;
}

/* ============================================================ HEAR */
function scrListen(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('ear', 'Just listen', 'শুধু শুনুন', 'You will hear “' + lower(w) + '” many times. Don’t read. Don’t write. Just listen.', 'শব্দটি অনেকবার শুনবেন। পড়বেন না, লিখবেন না — শুধু শুনুন।'));
  p.appendChild(wordCard(w, { meaning: false }));
  const L = floodLines(w);
  const box = el('div', 'listen card');
  const meter = el('div', 'meter'); for (let i = 0; i < 7; i++) meter.appendChild(el('i'));
  const row = el('div', 'listen-row');
  const drops = el('div', 'drops'); L.forEach(() => drops.appendChild(el('i')));
  const b = playBtn(btn => {
    if (btn.classList.contains('is-on')) { TTS.stop(); btn.setOn(false); box.classList.remove('live'); return; }
    btn.setOn(true); box.classList.add('live');
    [...drops.children].forEach(d => d.classList.remove('on'));
    TTS.list(L, { onLine: i => drops.children[i].classList.add('on'), onDone: () => { btn.setOn(false); box.classList.remove('live'); } });
  });
  row.appendChild(b); row.appendChild(meter);
  box.appendChild(row); box.appendChild(drops);
  box.appendChild(txt('p', 'small', 'Each dot is one time you hear it.', 'প্রতিটি বিন্দু মানে একবার শোনা।'));
  p.appendChild(box);
  p.cleanup = () => TTS.stop();
  return p;
}
function scrCatch(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('hand', 'Catch the word', 'শব্দটি ধরুন', 'Listen again. Tap the big button every time you hear “' + lower(w) + '”.', 'আবার শুনুন। শব্দটি যতবার শুনবেন, ততবার বড় বোতামে চাপ দিন।'));
  const L = floodLines(w), re = new RegExp(stemRe(w).source, 'gi');
  const total = L.reduce((n, l) => n + ((l.match(re) || []).length), 0);
  let taps = 0;
  const box = el('div', 'listen card');
  const score = el('div', 'score');
  const setScore = done => {
    score.replaceChildren(el('span', null, done ? 'You tapped ' + taps + ' times. The word came ' + total + ' times.' : 'Taps: ' + taps));
    if (done) bn(score, 'আপনি ' + taps + ' বার চাপ দিয়েছেন। শব্দটি এসেছে ' + total + ' বার।');
  };
  const c = el('button', 'catch'); c.type = 'button';
  c.appendChild(el('span', 'emo', emoji(w))); c.appendChild(el('span', null, 'I heard it!'));
  c.onclick = () => { taps++; setScore(false); c.classList.add('hit'); setTimeout(() => c.classList.remove('hit'), 120); };
  const b = playBtn(btn => {
    if (btn.classList.contains('is-on')) { TTS.stop(); btn.setOn(false); box.classList.remove('live'); setScore(true); return; }
    taps = 0; setScore(false); btn.setOn(true); box.classList.add('live');
    TTS.list(L, { gap: 900, onDone: () => { btn.setOn(false); box.classList.remove('live'); setScore(true); } });
  });
  const row = el('div', 'listen-row'); row.appendChild(b);
  const meter = el('div', 'meter'); for (let i = 0; i < 7; i++) meter.appendChild(el('i')); row.appendChild(meter);
  box.appendChild(row); box.appendChild(c); box.appendChild(score); setScore(false);
  p.appendChild(box);
  p.cleanup = () => TTS.stop();
  return p;
}
function karaoke(lines, w, opts = {}){
  /* lines as tappable rows; returns {node, playAll(btn)} */
  const box = el('div', 'lines');
  const rows = lines.map((l, i) => {
    const r = el('button', 'line'); r.type = 'button';
    const s = el('span', 'spk'); s.appendChild(icon('play')); r.appendChild(s);
    const t = el('span', 'lt'); r.appendChild(t);
    r.spans = wordSpans(t, opts.html ? opts.html(l) : marked(l, w));
    r.onclick = () => { stopAll(); speakFrom(i, true); };
    box.appendChild(r);
    return r;
  });
  let playBtnRef = null;
  const stopAll = () => { TTS.stop(); rows.forEach(r => r.classList.remove('is-now')); if (playBtnRef) playBtnRef.setOn(false); };
  const speakFrom = (i, one) => {
    const texts = lines.map(l => plain(l, w));
    TTS.list(one ? [texts[i]] : texts, {
      from: one ? 0 : i,
      onLine: k => { const idx = one ? i : k; rows.forEach((r, j) => r.classList.toggle('is-now', j === idx)); rows[idx].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); },
      onWord: (k, c) => lightWord(rows[one ? i : k].spans, c),
      onDone: () => { rows.forEach(r => { r.classList.remove('is-now'); r.spans.forEach(s => s.classList.remove('lit')); }); if (playBtnRef) playBtnRef.setOn(false); }
    });
  };
  return {
    node: box,
    play(btn){ playBtnRef = btn; if (btn.classList.contains('is-on')) { stopAll(); return; } btn.setOn(true); speakFrom(0, false); },
    stop: stopAll
  };
}
function scrRead(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('book', 'Now read and listen', 'এবার পড়ুন ও শুনুন', 'Follow the words. Tap any line to hear it again.', 'শব্দগুলো অনুসরণ করুন। যেকোনো লাইনে চাপ দিলে আবার শুনবেন।'));
  const L = floodLines(w).slice(2);
  const src = chunk(w).p.map(x => x + '.').concat(chunk(w).g.map(g => g[1])).concat((EMO.say[w] || []).slice(0, 5));
  const k = karaoke(src.map(s => s.replace(/[\[\]]/g, '')), w, { html: l => marked(l, w) });
  const bar = el('div', 'listen-row'); bar.style.justifyContent = 'center';
  const b = playBtn(btn => k.play(btn)); b.style.width = b.style.height = 'calc(64px*var(--ui))';
  bar.appendChild(b); bar.appendChild(txt('span', 'small', 'Play all', 'সব শুনুন'));
  p.appendChild(bar);
  const c = el('div', 'card'); c.appendChild(k.node); p.appendChild(c);
  p.cleanup = () => k.stop();
  void L;
  return p;
}

/* ============================================================ PARTNERS */
function partnerOf(s){
  const m = s.match(/~|\{[^}]+\}/);
  if (!m) return { before: s, after: '', side: 'l' };
  const before = s.slice(0, m.index).trim(), after = s.slice(m.index + m[0].length).trim();
  return { before, after, form: m[0] === '~' ? null : m[0].slice(1, -1), side: before.length >= after.length ? 'l' : 'r' };
}
function partnerLabel(q){ return (q.before ? q.before + ' ' : '') + '…' + (q.after ? ' ' + q.after : ''); }
function scrWeb(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('link', 'Words have partners', 'শব্দেরও সঙ্গী থাকে', 'Listen. Each partner joins the word. Tap one to hear it again.', 'শুনুন — প্রতিটি সঙ্গী শব্দ মূল শব্দের সাথে যুক্ত হয়। আবার শুনতে যেকোনোটিতে চাপ দিন।'));
  const web = el('div', 'web');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'links'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
  web.appendChild(svg);
  const hub = el('div', 'hub', lower(w)); web.appendChild(hub);
  const Q = C.p.map(partnerOf);
  const L = Q.filter(q => q.side === 'l'), R = Q.filter(q => q.side === 'r');
  const place = (arr, side) => arr.map((q, i) => {
    const a = arr.length === 1 ? 0 : (-58 + 116 * i / (arr.length - 1)) * Math.PI / 180;
    const x = 50 + (side === 'l' ? -1 : 1) * 34 * Math.cos(a), y = 50 + 38 * Math.sin(a);
    return { q, x, y };
  });
  const sats = place(L, 'l').concat(place(R, 'r'));
  const chunkline = el('div', 'chunkline');
  const nodes = sats.map(({ q, x, y }) => {
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', 50); ln.setAttribute('y1', 50); ln.setAttribute('x2', x); ln.setAttribute('y2', y); ln.setAttribute('class', 'ln');
    svg.appendChild(ln);
    const s = el('button', 'sat', partnerLabel(q)); s.type = 'button';
    s.style.left = x + '%'; s.style.top = y + '%';
    const full = C.p[Q.indexOf(q)];
    s.onclick = () => { reveal(s, ln, full); TTS.say(plain(full, w)); };
    web.appendChild(s);
    return { s, ln, full };
  });
  const reveal = (s, ln, full) => {
    s.classList.add('on'); ln.classList.add('on');
    nodes.forEach(n => n.s.classList.toggle('is-now', n.s === s));
    chunkline.innerHTML = marked(full, w);
  };
  p.appendChild(web); p.appendChild(chunkline);
  const bar = el('div', 'listen-row'); bar.style.justifyContent = 'center';
  const b = playBtn(btn => {
    if (btn.classList.contains('is-on')) { TTS.stop(); btn.setOn(false); return; }
    btn.setOn(true);
    TTS.list(nodes.map(n => plain(n.full, w)), { gap: 900, onLine: i => reveal(nodes[i].s, nodes[i].ln, nodes[i].full), onDone: () => btn.setOn(false) });
  });
  b.style.width = b.style.height = 'calc(64px*var(--ui))';
  bar.appendChild(b); p.appendChild(bar);
  p.enter = () => setTimeout(() => { if (p.isConnected) b.click(); }, 500);
  p.cleanup = () => TTS.stop();
  return p;
}
function scrPartnerCloze(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('link', 'Find the partner', 'সঙ্গী শব্দটি খুঁজুন', 'Which word goes in the gap? The first letter helps.', 'ফাঁকা জায়গায় কোন শব্দ বসবে? প্রথম অক্ষরটি সাহায্য করবে।'));
  const Q = shuffle(C.p.map(s => ({ s, q: partnerOf(s) })));
  const card = el('div', 'card round');
  const dots = el('div', 'roundnav'); Q.forEach(() => dots.appendChild(el('i')));
  const line = el('div', 'slotline'), opts = el('div', 'opts');
  card.appendChild(dots); card.appendChild(line); card.appendChild(opts);
  const done = new Set();
  let r = 0;
  const partText = q => q.side === 'l' ? q.before : q.after;
  const allParts = C.p.map(s => partnerOf(s));
  const paint = () => {
    [...dots.children].forEach((d, i) => { d.className = done.has(i) ? 'ok' : i === r ? 'on' : ''; });
    line.innerHTML = '';
    if (r >= Q.length) {
      line.appendChild(txt('span', null, 'All five partners found!', 'পাঁচটি সঙ্গী শব্দই পাওয়া গেছে!'));
      opts.innerHTML = '';
      const again = el('button', 'btn ghost'); again.type = 'button'; again.appendChild(icon('replay')); again.appendChild(el('span', null, 'Again'));
      again.onclick = () => { done.clear(); r = 0; Q.sort(() => Math.random() - .5); paint(); };
      opts.appendChild(again);
      return;
    }
    const { s, q } = Q[r];
    const ans = partText(q);
    const gap = el('span', 'gap'); const h = el('span', 'hint1', ans[0] + ans.slice(1).replace(/[^\s]/g, '·')); gap.appendChild(h);
    const hw = el('span', 'hw', q.form || lower(w));
    const other = q.side === 'l' ? q.after : q.before;
    if (q.side === 'l') { line.appendChild(gap); line.appendChild(hw); if (other) line.appendChild(el('span', null, other)); }
    else { if (other) line.appendChild(el('span', null, other)); line.appendChild(hw); line.appendChild(gap); }
    opts.innerHTML = '';
    shuffle(allParts.map(partText)).forEach(t => {
      const o = el('button', 'opt', t); o.type = 'button';
      o.onclick = () => {
        if (t === ans) {
          o.classList.add('ok'); gap.classList.add('filled'); gap.textContent = t; done.add(r);
          TTS.say(plain(s, w));
          [...opts.children].forEach(x => x.disabled = true);
          setTimeout(() => { r++; paint(); }, 1300);
        } else { o.classList.remove('no'); void o.offsetWidth; o.classList.add('no'); }
      };
      opts.appendChild(o);
    });
  };
  paint();
  p.appendChild(card);
  p.cleanup = () => TTS.stop();
  return p;
}

/* ============================================================ PATTERNS */
const SLOTS = /^(noun|verb|clause|-ing|person|someone|place|time|group|role|area|people|yourself|noun\/-ing|person\/noun|A|B)$/;
function patternBlocks(g, w){
  const key = (g[1].match(/\[([^\]]+)\]/) || [])[1] || '';
  const re = stemRe(w);
  const box = el('div', 'pattern');
  g[0].split(' + ').forEach(tok => {
    tok.split(' ').forEach(word => {
      let cls = 'plain', small = '';
      if (SLOTS.test(word)) { cls = 'slot'; }
      else if (re.test(word)) { cls = 'head'; small = 'word'; }
      else if (key && word.toLowerCase() === key.toLowerCase()) { cls = 'key'; small = 'grammar'; }
      const b = el('span', 'pb ' + cls, word);
      if (small) b.appendChild(el('small', null, small));
      if (cls === 'plain') { b.style.background = 'var(--panel)'; b.style.color = 'var(--tx)'; }
      box.appendChild(b);
    });
  });
  return box;
}
function scrPatterns(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('puzzle', 'Words have patterns', 'শব্দের গঠন থাকে', 'See the small grammar word the feeling hangs on.', 'অনুভূতির শব্দটি কোন ছোট ব্যাকরণ-শব্দের সঙ্গে ঝুলে থাকে, দেখুন।'));
  const card = el('div', 'card'); card.style.textAlign = 'center';
  const nav = el('div', 'pcount');
  const stage = el('div'); stage.style.minHeight = 'calc(170px*var(--ui))';
  let k = 0;
  const show = i => {
    k = i;
    [...nav.children].forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    stage.innerHTML = '';
    const g = C.g[i];
    stage.appendChild(patternBlocks(g, w));
    const ex = el('p', 'example'); ex.innerHTML = marked(g[1], w, 'lit'); stage.appendChild(ex);
    TTS.say(plain(g[1], w));
  };
  C.g.forEach((g, i) => { const b = el('button', null, String(i + 1)); b.type = 'button'; b.onclick = () => show(i); nav.appendChild(b); });
  card.appendChild(stage); card.appendChild(nav);
  const nextP = el('button', 'mini gold'); nextP.type = 'button'; nextP.style.marginTop = '8px';
  nextP.appendChild(el('span', null, 'Next pattern')); nextP.appendChild(icon('arrow'));
  nextP.onclick = () => show((k + 1) % C.g.length);
  card.appendChild(nextP);
  p.appendChild(card);
  p.enter = () => show(0);
  p.cleanup = () => TTS.stop();
  return p;
}
function scrPatternGap(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('puzzle', 'Fill the grammar gap', 'ব্যাকরণের ফাঁকটি পূরণ করুন', 'Choose the small word that fits.', 'যে ছোট শব্দটি মেলে সেটি বেছে নিন।'));
  const Q = shuffle(C.g);
  const card = el('div', 'card round');
  const dots = el('div', 'roundnav'); Q.forEach(() => dots.appendChild(el('i')));
  const patt = el('div'), line = el('p', 'example'), opts = el('div', 'opts');
  line.style.fontSize = 'calc(1.35rem*var(--ui))';
  card.appendChild(dots); card.appendChild(patt); card.appendChild(line); card.appendChild(opts);
  let r = 0; const ok = new Set();
  const paint = () => {
    [...dots.children].forEach((d, i) => { d.className = ok.has(i) ? 'ok' : i === r ? 'on' : ''; });
    patt.innerHTML = ''; opts.innerHTML = '';
    if (r >= Q.length) {
      line.replaceChildren(txt('span', null, 'Five patterns — well done!', 'পাঁচটি গঠনই হয়ে গেছে — দারুণ!'));
      const again = el('button', 'btn ghost'); again.type = 'button'; again.appendChild(icon('replay')); again.appendChild(el('span', null, 'Again'));
      again.onclick = () => { ok.clear(); r = 0; paint(); };
      opts.appendChild(again); return;
    }
    const g = Q[r], key = g[1].match(/\[([^\]]+)\]/)[1];
    const pat = el('div', 'small', g[0]); pat.style.cssText = 'font-weight:800;letter-spacing:.04em;color:var(--kicker)'; patt.appendChild(pat);
    line.innerHTML = marked(g[1], w, 'gap');
    const gap = line.querySelector('.gap');
    shuffle([key].concat(g[2].split('|'))).forEach(t => {
      const o = el('button', 'opt', t); o.type = 'button';
      o.onclick = () => {
        if (t === key) {
          o.classList.add('ok'); gap.classList.add('filled'); gap.style.background = 'var(--gold-soft)'; gap.style.borderColor = 'var(--gold)'; gap.style.color = '#6B5116'; gap.textContent = key;
          ok.add(r); [...opts.children].forEach(x => x.disabled = true);
          TTS.say(plain(g[1], w));
          setTimeout(() => { r++; paint(); }, 1500);
        } else { o.classList.remove('no'); void o.offsetWidth; o.classList.add('no'); }
      };
      opts.appendChild(o);
    });
  };
  paint();
  p.appendChild(card);
  p.cleanup = () => TTS.stop();
  return p;
}

/* ============================================================ SAY */
function scrModel(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('speech', 'The word in sentences', 'বাক্যে শব্দটি', 'Listen to five sentences. Notice the partners and patterns you know now.', 'পাঁচটি বাক্য শুনুন। যে সঙ্গী শব্দ ও গঠন শিখেছেন, সেগুলো খেয়াল করুন।'));
  const S5 = (EMO.say[w] || []).slice(0, 5);
  const re = new RegExp('(' + stemRe(w).source.replace(/^\\b/, '') + ')', 'gi');
  const k = karaoke(S5, w, { html: l => esc(l).replace(re, '<span class="hw">$1</span>') });
  const bar = el('div', 'listen-row'); bar.style.justifyContent = 'center';
  const b = playBtn(btn => k.play(btn)); b.style.width = b.style.height = 'calc(64px*var(--ui))';
  bar.appendChild(b); bar.appendChild(txt('span', 'small', 'Play all', 'সব শুনুন'));
  p.appendChild(bar);
  const c = el('div', 'card'); c.appendChild(k.node); p.appendChild(c);
  p.cleanup = () => k.stop();
  return p;
}
function tilesOf(sentence){
  const words = sentence.split(/\s+/);
  const out = []; let i = 0;
  while (i < words.length) {
    const left = words.length - i;
    const n = left <= 3 ? left : left === 4 ? 2 : (words[i].length + words[i + 1].length > 11 ? 2 : 3);
    out.push(words.slice(i, i + n).join(' ')); i += n;
  }
  return out;
}
function scrBuild(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('puzzle', 'Build a sentence', 'একটি বাক্য সাজান', 'Tap the pieces in order.', 'টুকরোগুলো ক্রমানুসারে চাপ দিন।'));
  const pool = (EMO.say[w] || []).slice().sort((a, b) => a.split(' ').length - b.split(' ').length).slice(0, 3);
  let which = 0;
  const card = el('div', 'card build');
  const target = el('div', 'target'), tray = el('div', 'tray');
  card.appendChild(target); card.appendChild(tray);
  const tools = el('div', 'l-tools'); tools.style.justifyContent = 'center';
  const hear = el('button', 'mini'); hear.type = 'button'; hear.appendChild(icon('play')); hear.appendChild(el('span', null, 'Hear it'));
  const other = el('button', 'mini gold'); other.type = 'button'; other.appendChild(icon('replay')); other.appendChild(el('span', null, 'Another sentence'));
  tools.appendChild(hear); tools.appendChild(other); card.appendChild(tools);
  const re = stemRe(w);
  const paint = () => {
    const sent = pool[which % pool.length] || w + '.';
    hear.onclick = () => TTS.say(sent);
    const T = tilesOf(sent);
    let at = 0;
    target.innerHTML = ''; tray.innerHTML = ''; target.classList.remove('done');
    shuffle(T.map((t, i) => ({ t, i }))).forEach(({ t }) => {
      const b = el('button', 'tile' + (re.test(t) ? ' hw-t' : ''), t); b.type = 'button';
      b.onclick = () => {
        if (t === T[at]) {
          at++; target.appendChild(b); b.onclick = null;
          if (at === T.length) { target.classList.add('done'); TTS.say(sent); }
        } else { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); }
      };
      tray.appendChild(b);
    });
  };
  other.onclick = () => { which++; paint(); };
  paint();
  p.appendChild(card);
  p.cleanup = () => TTS.stop();
  return p;
}
function scrFrames(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('heart', 'Now say it your way', 'এবার নিজের মতো বলুন', 'Finish the three sentences. Tap an idea if you need help.', 'তিনটি বাক্য শেষ করুন। সাহায্য লাগলে একটি ধারণায় চাপ দিন।'));
  const H = EMO.hints[w] || EMO.hintsDefault;
  const box = el('div', 'frames');
  [['because', 'I feel <span class="hwl">' + esc(lower(w)) + '</span> because…', 'আমার এমন লাগছে কারণ…'],
   ['stake', 'What’s really at stake is…', 'আসলে যা ঝুঁকিতে আছে তা হলো…'],
   ['need', 'I need…', 'আমার দরকার…']].forEach(([k, lab, lb]) => {
    const f = el('div', 'frame');
    const l = el('label'); l.innerHTML = lab; bn(l, lb); l.htmlFor = 'fr-' + k;
    const i = el('input'); i.id = 'fr-' + k; i.type = 'text'; i.autocomplete = 'off'; i.value = S.frames[k] || '';
    i.placeholder = H[k][0];
    i.oninput = () => { S.frames[k] = i.value; save(); };
    const ideas = el('div', 'ideas');
    H[k].forEach(h => { const b = el('button', 'idea', h); b.type = 'button'; b.onclick = () => { i.value = h; S.frames[k] = h; save(); }; ideas.appendChild(b); });
    f.appendChild(l); f.appendChild(i); f.appendChild(ideas);
    box.appendChild(f);
  });
  p.appendChild(box);
  const pair = el('div', 'pair');
  pair.innerHTML = '<svg viewBox="0 0 44 30" aria-hidden="true"><circle cx="11" cy="9" r="5" fill="#8a6a22"/><path d="M2 29a9 9 0 0 1 18 0z" fill="#8a6a22"/><circle cx="33" cy="9" r="5" fill="#6f8f62"/><path d="M24 29a9 9 0 0 1 18 0z" fill="#6f8f62"/><path d="M17 5h9l-2 3" fill="none" stroke="#5a4413" stroke-width="1.6" stroke-linecap="round"/></svg>';
  bn(pair.appendChild(el('span', null, 'Say your three sentences to your partner. Then listen to theirs.')), 'আপনার তিনটি বাক্য সঙ্গীকে বলুন। তারপর তার কথা শুনুন।');
  p.appendChild(pair);
  const hear = el('button', 'mini'); hear.type = 'button'; hear.appendChild(icon('play')); hear.appendChild(el('span', null, 'Hear my sentences'));
  hear.onclick = () => {
    const f = S.frames, parts = [];
    parts.push('I feel ' + lower(w) + (f.because ? ' because ' + f.because : '') + '.');
    if (f.stake) parts.push('What’s really at stake is ' + f.stake + '.');
    if (f.need) parts.push('I need ' + f.need + '.');
    TTS.list(parts, { gap: 400 });
  };
  p.appendChild(hear);
  p.cleanup = () => TTS.stop();
  return p;
}

/* ============================================================ IDIOMS */
function idiomCard(I, w){
  const c = el('div', 'icard'); c.setAttribute('role', 'button'); c.tabIndex = 0;
  const inner = el('div', 'icard-in');
  const f = el('div', 'iface front'), b = el('div', 'iface back');
  f.appendChild(el('div', 'idiom', I[0]));
  const ex = el('div', 'ex'); ex.innerHTML = marked(I[2], w); f.appendChild(ex);
  const fm = el('span', 'flipmark'); fm.appendChild(icon('flip')); fm.appendChild(el('span', null, 'meaning')); f.appendChild(fm);
  b.appendChild(el('div', 'meaning', I[1]));
  b.appendChild(el('div', 'eq', '≈ I feel ' + lower(w)));
  inner.appendChild(f); inner.appendChild(b); c.appendChild(inner);
  const say = el('button', 'roundbtn say'); say.type = 'button'; say.setAttribute('aria-label', 'Hear it'); say.appendChild(icon('play'));
  say.onclick = e => { e.stopPropagation(); TTS.say(plain(I[2], w)); };
  c.appendChild(say);
  const flip = () => c.classList.toggle('flipped');
  c.onclick = flip; c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
  return c;
}
function scrIdiomCards(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('image', 'Say it in a picture', 'ছবির ভাষায় বলুন', 'Idioms describe the feeling with a picture. Tap a card to see its meaning.', 'বাগধারা ছবির মতো করে অনুভূতি বোঝায়। মানে দেখতে কার্ডে চাপ দিন।'));
  const g = el('div', 'icards');
  C.i.forEach((I, i) => { const c = idiomCard(I, w); c.style.animation = 'rise .5s var(--ease) ' + (i * .1) + 's both'; g.appendChild(c); });
  p.appendChild(g);
  /* five more natural lines, for listening only */
  const more = el('details', 'card');
  const sum = el('summary'); sum.style.cssText = 'cursor:pointer;font-weight:800;color:var(--heading)';
  sum.textContent = 'Hear five more ways people say it'; more.appendChild(sum);
  const T = (EMO.talk[w] || []).slice(0, 5);
  const k = karaoke(T, w, { html: l => esc(l) });
  const bar = el('div', 'listen-row'); bar.style.cssText = 'justify-content:center;margin:12px 0';
  const b = playBtn(btn => k.play(btn)); b.style.width = b.style.height = 'calc(56px*var(--ui))';
  bar.appendChild(b); more.appendChild(bar); more.appendChild(k.node);
  p.appendChild(more);
  p.cleanup = () => k.stop();
  return p;
}
function scrIdiomGap(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('image', 'Which idiom fits?', 'কোন বাগধারাটি মেলে?', 'Read the sentence. Choose the idiom for the gap.', 'বাক্যটি পড়ুন। ফাঁকা জায়গার জন্য বাগধারাটি বেছে নিন।'));
  const Q = shuffle(C.i);
  const card = el('div', 'card round');
  const dots = el('div', 'roundnav'); Q.forEach(() => dots.appendChild(el('i')));
  const line = el('p', 'example'), opts = el('div', 'choose'); opts.style.width = '100%';
  card.appendChild(dots); card.appendChild(line); card.appendChild(opts);
  let r = 0; const ok = new Set();
  const paint = () => {
    [...dots.children].forEach((d, i) => { d.className = ok.has(i) ? 'ok' : i === r ? 'on' : ''; });
    opts.innerHTML = '';
    if (r >= Q.length) { line.replaceChildren(txt('span', null, 'Three idioms — you can picture the feeling now.', 'তিনটি বাগধারা — এখন অনুভূতিটি ছবির মতো দেখতে পাচ্ছেন।')); return; }
    const I = Q[r];
    line.innerHTML = esc(I[2]).replace(/\*([^*]+)\*/, '<span class="gap" style="min-width:8ch">?</span>');
    const gap = line.querySelector('.gap');
    shuffle(C.i).forEach(J => {
      const o = el('button'); o.type = 'button'; o.appendChild(el('span', 'dot')); o.appendChild(el('span', null, J[0]));
      o.onclick = () => {
        if (J === I) {
          o.setAttribute('aria-pressed', 'true'); ok.add(r); gap.classList.add('filled');
          gap.textContent = I[2].match(/\*([^*]+)\*/)[1];
          TTS.say(plain(I[2], w));
          setTimeout(() => { r++; paint(); }, 1600);
        } else { o.style.borderColor = 'var(--clay)'; o.animate([{ background: '#F6E1D9' }, { background: 'var(--surface-card)' }], 600); }
      };
      opts.appendChild(o);
    });
  };
  paint();
  p.appendChild(card);
  p.cleanup = () => TTS.stop();
  return p;
}
function scrIdiomChoose(){
  const w = curWord(), p = el('div', 'panel'), C = chunk(w);
  p.appendChild(task('image', 'Which one fits your moment?', 'আপনার মুহূর্তের সঙ্গে কোনটি মেলে?', 'Choose one idiom to describe how you feel today.', 'আজ আপনার অনুভূতি বোঝাতে একটি বাগধারা বেছে নিন।'));
  const list = el('div', 'choose');
  const preview = el('div', 'card'); preview.style.textAlign = 'center';
  const paintPrev = () => {
    preview.innerHTML = '';
    const f = S.frames;
    const q = el('p', 'example');
    const idm = S.idiom != null ? C.i[S.idiom] : null;
    q.innerHTML = 'I feel <span class="hw">' + esc(lower(w)) + '</span>' + (f.because ? ' because ' + esc(f.because) : '') + '.' +
      (idm ? '<br>' + esc(idm[2]).replace(/\*([^*]+)\*/, '<span class="idm">$1</span>') : '');
    preview.appendChild(q);
  };
  C.i.forEach((I, k) => {
    const b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(S.idiom === k));
    b.appendChild(el('span', 'dot'));
    const t = el('span'); t.appendChild(el('span', null, I[0])); const m = el('span', 'small', ' — ' + I[1]); t.appendChild(m); b.appendChild(t);
    b.onclick = () => { S.idiom = k; save(); [...list.children].forEach((x, j) => x.setAttribute('aria-pressed', String(j === k))); paintPrev(); TTS.say(plain(I[2], w)); };
    list.appendChild(b);
  });
  p.appendChild(list); p.appendChild(preview); paintPrev();
  p.cleanup = () => TTS.stop();
  return p;
}

/* ============================================================ SHARE */
const BERG_Y = [360, 304, 246, 124, 86, 48];     /* level 1…6, deepest first */
function bergBig(level, w){
  const marks = LEVELS.map((L, i) => {
    const y = BERG_Y[i], on = i < level;
    return '<path d="M52 ' + y + 'H200" stroke="var(--sea)" stroke-dasharray="3 5" stroke-width="1.5" opacity="' + (on ? .9 : .4) + '"/>' +
      '<circle cx="36" cy="' + y + '" r="15" fill="' + (on ? 'var(--fi)' : '#fff') + '" stroke="var(--sea)" stroke-width="2"/>' +
      '<text x="36" y="' + (y + 6) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + (on ? '#fff' : 'var(--sea-deep)') + '">' + (i + 1) + '</text>';
  }).join('');
  return '<svg class="berg-big z" viewBox="0 0 400 400" role="img" aria-label="The word has risen to level ' + level + ' of 6">' +
    '<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE5EF"/><stop offset="1" stop-color="#7FB0C8"/></linearGradient></defs>' +
    '<rect x="0" y="150" width="400" height="250" fill="url(#sea)" rx="10"/>' +
    '<path d="M218 150L246 70l18 16 22-60 20 38 14-12 28 98z" fill="#fff" stroke="var(--sea)" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M212 150l-24 86 24 96 80 52 78-42 22-110-28-82z" fill="#E9F3F7" stroke="var(--sea)" stroke-width="2.2" stroke-linejoin="round" opacity=".92"/>' +
    '<path d="M0 150h400" stroke="var(--sea-deep)" stroke-width="2" stroke-dasharray="8 6"/>' +
    '<text x="392" y="172" text-anchor="end" font-size="13" font-weight="800" fill="var(--sea-deep)" letter-spacing="1.5">WATERLINE</text>' +
    marks +
    '<g class="berg-word" style="transform:translate(290px,392px)" data-y="' + (level ? BERG_Y[level - 1] : 392) + '">' +
    '<rect x="-66" y="-18" width="132" height="36" rx="18" fill="var(--fi)" stroke="#fff" stroke-width="2"/>' +
    '<text x="0" y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">' + esc(lower(w)) + '</text></g></svg>';
}
function bergLegend(level){
  const ol = el('ol', 'berg-legend');
  LEVELS.slice().reverse().forEach((L, j) => {
    const i = 5 - j, li = el('li', i < level ? 'on' : '');
    li.appendChild(el('span', 'bl-n', String(i + 1)));
    const t = el('span'); t.appendChild(el('span', null, L[0])); bn(t, L[1]); li.appendChild(t);
    if (i === 3) li.classList.add('wl');
    ol.appendChild(li);
  });
  return ol;
}
function scrRise(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('berg', 'Your word has risen', 'আপনার শব্দটি উপরে উঠে এসেছে', 'Every time you heard it and understood it, it rose. Now it is above the water — you can use it.', 'যতবার শুনে বুঝেছেন, ততবার এটি উপরে উঠেছে। এখন এটি পানির উপরে — আপনি এটি ব্যবহার করতে পারবেন।'));
  const c = el('div', 'card berg-card'); c.innerHTML = bergBig(S.level, w); c.appendChild(bergLegend(S.level)); p.appendChild(c);
  p.enter = () => { const g = c.querySelector('.berg-word'); requestAnimationFrame(() => requestAnimationFrame(() => { g.style.transform = 'translate(290px,' + g.dataset.y + 'px)'; })); };
  const sc = el('div', 'card');
  sc.appendChild(txt('h3', 'h-title', 'How strong is the storm now?', 'এখন ঝড়টা কতটা তীব্র?'));
  sc.firstChild.style.fontSize = 'calc(1.15rem*var(--ui))';
  const cmp = el('div', 'compare'); cmp.style.marginTop = '12px';
  const paintCmp = () => { cmp.innerHTML = S.storm0 && S.storm1 ? weather(S.storm0) + '<span class="arrow">→</span>' + weather(S.storm1) : ''; };
  const scale = stormScale('storm1', paintCmp); scale.style.marginTop = '12px';
  sc.appendChild(scale); sc.appendChild(cmp); paintCmp();
  sc.appendChild(txt('p', 'small', 'Naming a feeling often makes the storm smaller. If it didn’t today, that’s okay too.', 'অনুভূতির নাম দিলে ঝড় প্রায়ই ছোট হয়ে আসে। আজ না হলে, সেটাও ঠিক আছে।'));
  p.appendChild(sc);
  /* what the student now owns */
  const C = chunk(w), sum = el('div', 'card summary');
  const row = (ico, lab, html) => { const r = el('div', 'sum-row'); const i = el('span', 'sico'); i.appendChild(icon(ico)); r.appendChild(i); const t = el('div', 'stx'); t.innerHTML = '<small>' + lab + '</small>' + html; r.appendChild(t); sum.appendChild(r); };
  row('link', 'Partners', C.p.slice(0, 3).map(x => marked(x, w)).join(' · '));
  row('puzzle', 'Patterns', C.g.slice(0, 2).map(g => esc(g[0])).join(' · '));
  row('speech', 'My sentence', 'I feel <span class="hw">' + esc(lower(w)) + '</span>' + (S.frames.because ? ' because ' + esc(S.frames.because) : '…') + '.');
  row('image', 'My idiom', S.idiom != null ? '<span class="idm">' + esc(C.i[S.idiom][0]) + '</span>' : esc(C.i[0][0]));
  p.appendChild(sum);
  return p;
}
/* the live class board — the same hourly, anonymous board as before */
const POLL = { key: '', timer: 0 };
function dhakaHour(){
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).filter(x => x.type !== 'literal').map(x => [x.type, x.value]));
  return parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hour;
}
function pollToken(k){
  try { let t = localStorage.getItem('emotion-poll-token:' + k); if (!t) { t = (crypto.randomUUID && crypto.randomUUID()) || (Date.now() + '-' + Math.random().toString(36).slice(2)); localStorage.setItem('emotion-poll-token:' + k, t); } return t; }
  catch (e) { return Date.now() + '-' + Math.random().toString(36).slice(2); }
}
function boardNode(){
  const box = el('div', 'card poll');
  const top = el('div', 'poll-top');
  const tot = el('div'); tot.appendChild(el('span', 'poll-total', '0')); tot.appendChild(txt('span', 'small', ' responses this hour', 'এই ঘণ্টার উত্তর'));
  top.appendChild(tot); top.appendChild(el('span', 'live', 'Live')); box.appendChild(top);
  const bars = el('div', 'poll'), words = el('div', 'pwords'), reasons = el('div', 'preasons');
  box.appendChild(bars); box.appendChild(txt('p', 'kicker', 'Words people chose', 'যে শব্দগুলো বেছে নেওয়া হয়েছে')); box.appendChild(words);
  box.appendChild(txt('p', 'kicker', 'Anonymous reasons', 'নামহীন কারণ')); box.appendChild(reasons);
  box.paint = d => {
    box.querySelector('.poll-total').textContent = d.total || 0;
    const max = Math.max(1, ...Object.values(d.counts || {}));
    bars.innerHTML = '';
    EMO.wheel.forEach(f => {
      const n = (d.counts || {})[f.name] || 0;
      const r = el('div', 'prow f-' + f.name.toLowerCase());
      const l = el('span', 'pl'); l.appendChild(el('span', null, emoji(f.name))); l.appendChild(el('span', null, f.name)); r.appendChild(l);
      const t = el('div', 'pt'), fi = el('div', 'pf'); t.appendChild(fi); r.appendChild(t);
      r.appendChild(el('span', 'pc', String(n)));
      bars.appendChild(r);
      requestAnimationFrame(() => { fi.style.width = (n / max * 100) + '%'; });
    });
    words.innerHTML = '';
    (d.specificCounts || []).slice(0, 10).forEach(x => { const c = el('span', 'pword f-' + famKey(x.emotion), x.emotion + ' ×' + x.count); c.style.cssText = 'background:var(--t);color:var(--i)'; words.appendChild(c); });
    if (!words.children.length) words.appendChild(txt('span', 'small', 'No responses yet.', 'এখনও কোনো উত্তর নেই।'));
    reasons.innerHTML = '';
    (d.reasons || []).slice(0, 8).forEach(x => { const c = el('div', 'preason f-' + famKey(x.primaryEmotion)); c.style.borderLeftColor = 'var(--c)'; c.appendChild(el('b', null, x.emotion)); c.appendChild(el('span', null, x.reason)); reasons.appendChild(c); });
    if (!reasons.children.length) reasons.appendChild(txt('span', 'small', 'The first reason will appear here.', 'প্রথম কারণটি এখানে দেখা যাবে।'));
  };
  const load = async () => {
    if (!box.isConnected) { clearInterval(POLL.timer); return; }
    POLL.key = dhakaHour();
    try { const r = await fetch('/api/poll?window=' + encodeURIComponent(POLL.key), { cache: 'no-store' }); if (r.ok) box.paint(await r.json()); } catch (e) {}
  };
  box.load = load;
  box.paint({ total: 0, counts: {}, specificCounts: [], reasons: [] });
  clearInterval(POLL.timer); POLL.timer = setInterval(load, 5000); setTimeout(load, 50);
  return box;
}
function scrShare(){
  const w = curWord(), p = el('div', 'panel');
  p.appendChild(task('users', 'Share with the class', 'ক্লাসের সঙ্গে ভাগ করুন', 'No names. Only your word and, if you like, your reason.', 'কোনো নাম নয়। শুধু আপনার শব্দ, আর চাইলে কারণটি।'));
  const box = el('div', 'card share-box');
  const lab = el('label'); lab.htmlFor = 'share-r'; lab.style.cssText = 'display:block;font-weight:800;margin-bottom:8px;color:var(--heading)';
  lab.innerHTML = 'I feel <span class="hw">' + esc(lower(w)) + '</span> because…';
  const ta = el('textarea'); ta.id = 'share-r'; ta.maxLength = 220; ta.value = S.frames.because || '';
  const small = txt('p', 'small', 'Don’t write anyone’s name or phone number.', 'কারও নাম বা ফোন নম্বর লিখবেন না।');
  const send = el('button', 'btn'); send.type = 'button'; send.style.marginTop = '10px';
  bn(send.appendChild(el('span', null, 'Share anonymously')), 'নাম ছাড়া ভাগ করুন', true);
  const st = el('p', 'status'); st.setAttribute('aria-live', 'polite');
  box.appendChild(lab); box.appendChild(ta); box.appendChild(small); box.appendChild(send); box.appendChild(st);
  p.appendChild(box);
  const board = boardNode(); p.appendChild(board);
  send.onclick = async () => {
    send.disabled = true; st.textContent = 'Sharing…';
    const key = dhakaHour();
    try {
      const r = await fetch('/api/poll', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ window: key, responseToken: pollToken(key), primaryEmotion: FAMILY[w] || 'Happy', emotion: w, reason: ta.value.trim() }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Could not share.');
      st.textContent = 'Shared. You can change it again this hour.'; board.paint(d);
    } catch (e) { st.textContent = 'The class board is not reachable right now.'; }
    send.disabled = false;
  };
  const more = el('div', 'l-tools'); more.style.justifyContent = 'flex-start';
  const rtc = el('button', 'mini gold'); rtc.type = 'button'; rtc.appendChild(icon('compass')); rtc.appendChild(el('span', null, 'Going further: Room to choose'));
  rtc.onclick = openRTC;
  const again = el('button', 'mini'); again.type = 'button'; again.appendChild(icon('reset')); again.appendChild(el('span', null, 'Start again with a new feeling'));
  again.onclick = () => { S.word = null; S.level = 0; S.storm0 = S.storm1 = null; S.idiom = null; S.frames = { because: '', stake: '', need: '' }; save(); setFamily(null); goStep(0, 0); };
  more.appendChild(rtc); more.appendChild(again);
  p.appendChild(more);
  p.cleanup = () => clearInterval(POLL.timer);
  return p;
}

const SUBS = {
  feel: [scrBig, scrMid, scrExact, scrStorm, scrBreathe],
  hear: [scrListen, scrCatch, scrRead],
  partners: [scrWeb, scrPartnerCloze],
  patterns: [scrPatterns, scrPatternGap],
  say: [scrModel, scrBuild, scrFrames],
  idioms: [scrIdiomCards, scrIdiomGap, scrIdiomChoose],
  share: [scrRise, scrShare]
};

/* ============================================================ sheets */
function openSheet(build){
  const sh = $('#sheet'); sh.innerHTML = '';
  const x = el('button', 'icon-btn sheet-close'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.appendChild(icon('x')); x.onclick = closeSheet;
  sh.appendChild(x); build(sh);
  sh.classList.add('show'); $('#scrim').classList.add('show');
  setTimeout(() => x.focus(), 50);
}
function closeSheet(){ $('#sheet').classList.remove('show'); $('#scrim').classList.remove('show'); }
$('#scrim').onclick = closeSheet;

function openClues(){
  openSheet(sh => {
    sh.appendChild(txt('h2', null, 'Notice the clues', 'লক্ষণগুলো খেয়াল করুন'));
    sh.appendChild(txt('p', 'small', 'Tap 1–3 things you notice right now. They are clues, not proof.', 'এই মুহূর্তে যা খেয়াল করছেন তার ১–৩টিতে চাপ দিন। এগুলো লক্ষণ, প্রমাণ নয়।'));
    const picked = new Set();
    const res = el('div', 'card'); res.style.marginTop = '12px';
    const lists = el('div');
    [['behavior', 'What am I doing?', 'আমি কী করছি?'], ['sensation', 'What is my body doing?', 'আমার শরীরে কী হচ্ছে?']].forEach(([type, en, b]) => {
      lists.appendChild(txt('p', 'kicker', en, b)); lists.lastChild.style.margin = '14px 0 6px';
      const g = el('div', 'ideas'); g.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
      EMO.clues.filter(c => c.type === type).forEach(c => {
        const t = el('button', 'idea', c.label); t.type = 'button';
        if (EMO.clueBn[c.id]) bn(t, EMO.clueBn[c.id]);
        t.onclick = () => { picked.has(c.id) ? picked.delete(c.id) : picked.add(c.id); t.style.cssText = picked.has(c.id) ? 'border-style:solid;border-color:var(--forest);background:var(--moss-soft);color:var(--forest)' : ''; paint(); };
        g.appendChild(t);
      });
      lists.appendChild(g);
    });
    sh.appendChild(lists); sh.appendChild(res);
    const paint = () => {
      res.innerHTML = '';
      if (!picked.size) { res.appendChild(txt('p', 'small', 'Your possible match will appear here.', 'সম্ভাব্য মিলটি এখানে দেখাবে।')); return; }
      const score = {};
      EMO.clues.filter(c => picked.has(c.id)).forEach(c => Object.entries(c.scores).forEach(([k, v]) => score[k] = (score[k] || 0) + v));
      const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
      const h = el('div', 'ftile f-' + best.toLowerCase()); h.style.minHeight = '0'; h.style.flexDirection = 'row'; h.style.gap = '12px';
      h.appendChild(el('span', 'emo', emoji(best))); h.appendChild(el('span', 'nm', best));
      res.appendChild(h);
      res.appendChild(el('p', 'small', EMO.clueSummaries[best] || ''));
      const use = el('button', 'btn'); use.type = 'button'; use.style.marginTop = '8px';
      bn(use.appendChild(el('span', null, 'Start with ' + best)), best + ' দিয়ে শুরু করুন', true);
      use.onclick = () => { chooseWord(best); closeSheet(); goStep(0, 1); };
      res.appendChild(use);
    };
    paint();
  });
}

/* Room to choose: the three ways to hold a feeling, then five situations */
function rtcScene(kind){
  const person = '<g fill="none" stroke="#1D211C" stroke-width="3" stroke-linecap="round"><circle cx="40" cy="30" r="10" fill="#fff"/><path d="M40 42v30M40 50l-16 14M40 50l16 14M40 72l-12 20M40 72l12 20"/></g>';
  if (kind === 'close') return '<svg viewBox="0 0 160 100"><circle cx="52" cy="54" r="44" fill="#F3C9BD" opacity=".85"/>' + person + '<path d="M110 20l-8 14h9l-6 12" fill="none" stroke="#B0563A" stroke-width="3"/></svg>';
  if (kind === 'room') return '<svg viewBox="0 0 160 100">' + person + '<path d="M60 56h52" stroke="#6F8F62" stroke-width="3" stroke-dasharray="5 5"/><circle cx="128" cy="56" r="18" fill="#E3EAD9" stroke="#6F8F62" stroke-width="2.5"/><path d="M123 49v14M133 49v14" stroke="#103D21" stroke-width="3" stroke-linecap="round"/></svg>';
  return '<svg viewBox="0 0 160 100">' + person + '<path d="M86 12v80M94 12v80" stroke="#1F5C7A" stroke-width="4"/><circle cx="134" cy="56" r="12" fill="#DCEBF2" stroke="#1F5C7A" stroke-width="2"/></svg>';
}
function openRTC(){
  const L = () => S.lang === 'bn' ? EMO.eq.bn : EMO.eq.en;
  let q = -1, picks = [], order = [];
  openSheet(sh => {
    const body = el('div'); sh.appendChild(body);
    const paint = () => {
      const D = L(), E = EMO.eq.en;
      body.innerHTML = '';
      if (q < 0) {
        body.appendChild(el('h2', null, 'Room to choose')); body.lastChild.id = 'sheet-h';
        body.appendChild(el('p', 'small', D.scenario || E.scenario));
        const g = el('div', 'rtc'); g.style.marginTop = '12px';
        [['close', 0], ['far', 2], ['room', 1]].forEach(([k, i]) => {
          const c = el('div', 'rtc-card' + (k === 'room' ? ' green' : ''));
          c.innerHTML = rtcScene(k);
          c.appendChild(el('b', null, D.concepts[i].title));
          c.appendChild(el('span', null, D.concepts[i].thought));
          c.appendChild(el('span', null, D.concepts[i].action));
          g.appendChild(c);
        });
        body.appendChild(g);
        body.appendChild(el('p', 'small', D.honestNote));
        const go = el('button', 'btn'); go.type = 'button'; go.style.marginTop = '12px'; go.textContent = D.quizStartBtn;
        go.onclick = () => { q = 0; picks = []; order = E.questions.map(x => shuffle(x.options.map((_, i) => i))); paint(); };
        body.appendChild(go);
        return;
      }
      if (q >= E.questions.length) {
        const n = t => picks.filter(x => x === t).length;
        const tier = n('Healthy') >= 3 ? D.results.high : n('Close') >= 3 ? D.results.close : n('Far') >= 3 ? D.results.far : D.results.mid;
        body.appendChild(el('h2', null, tier.title)); body.lastChild.id = 'sheet-h';
        body.appendChild(el('p', null, tier.desc));
        body.appendChild(el('p', 'small', '💚 ' + n('Healthy') + '   🔴 ' + n('Close') + '   🔵 ' + n('Far') + '   🟡 ' + n('Mixed')));
        const again = el('button', 'btn ghost'); again.type = 'button'; again.style.marginTop = '12px'; again.textContent = D.retakeLabel;
        again.onclick = () => { q = -1; paint(); }; body.appendChild(again);
        return;
      }
      const Q = D.questions[q];
      body.appendChild(el('p', 'kicker', (q + 1) + ' / ' + E.questions.length));
      const qq = el('p', 'q', Q.text.replace(/^\d+\.\s*/, '')); qq.id = 'sheet-h'; qq.style.cssText = 'font-weight:700;line-height:1.45;margin:8px 0 12px'; body.appendChild(qq);
      const ch = el('div', 'choose');
      order[q].forEach(i => {
        const o = Q.options[i], b = el('button'); b.type = 'button'; b.appendChild(el('span', 'dot')); b.appendChild(el('span', null, o.text));
        b.onclick = () => { b.setAttribute('aria-pressed', 'true'); picks[q] = E.questions[q].options[i].type; setTimeout(() => { q++; paint(); }, 350); };
        ch.appendChild(b);
      });
      body.appendChild(ch);
    };
    paint();
    sh.repaint = paint;
  });
}

/* ============================================================ the shell */
let CUR = null;                   /* the panel on screen, for its cleanup */
function levelFor(step){ return STEPS[step].lv; }
function goStep(step, sub){
  S.dir = step > S.step || (step === S.step && sub >= S.sub) ? 1 : -1;
  S.view = 'flow'; S.step = step; S.sub = sub;
  render();
}
function go(d){
  if (S.view === 'lesson') { (d > 0 ? Lesson.next() : Lesson.back()) || (d > 0 ? startActivity() : null); return; }
  if (S.view === 'board') { S.view = 'flow'; render(); return; }
  if (S.view !== 'flow') return;
  const n = SUBS[STEPS[S.step].k].length;
  let st = S.step, sb = S.sub + d;
  if (sb >= n) { if (st < STEPS.length - 1) { st++; sb = 0; } else return; }
  if (sb < 0) {
    if (st > 0) { st--; sb = SUBS[STEPS[st].k].length - 1; }
    else if (S.role === 'teacher') { S.view = 'lesson'; Lesson.toEnd(); render(); return; }
    else return;
  }
  goStep(st, sb);
}
function startActivity(){ S.view = 'flow'; S.step = 0; S.sub = 0; S.dir = 1; render(); }

function paintRail(){
  const rail = $('#rail'); rail.innerHTML = '';
  if (S.view === 'welcome') return;
  const inner = el('div', 'rail-inner');
  const add = (label, bnLabel, ico, cls, onClick, n) => {
    const b = el('button', 'rail-step ' + (cls || '')); b.type = 'button';
    const r = el('span', 'rail-n'); if (ico) r.appendChild(icon(ico)); else r.textContent = n; b.appendChild(r);
    const l = el('span', 'rail-lab', label); b.appendChild(l);
    b.title = label; b.onclick = onClick; inner.appendChild(b);
    return b;
  };
  if (S.view === 'lesson') {
    Lesson.panels.forEach((P, i) => add(P.rail, P.railBn, null, i === Lesson.i ? 'is-active' : i < Lesson.i ? 'is-done' : '', () => { Lesson.jump(i); render(); }, i + 1));
    add('The activity', 'কাজ', 'arrow', 'rail-out', startActivity);
  } else {
    if (S.role === 'teacher') add('Lesson', 'পাঠ', 'tv', 'rail-out', () => { S.view = 'lesson'; render(); });
    STEPS.forEach((st, i) => add(st.en, st.bn, st.ico, S.view === 'flow' && i === S.step ? 'is-active' : S.word && st.lv && st.lv <= S.level ? 'is-done' : '', () => goStep(i, 0)));
  }
  rail.appendChild(inner);
  const act = inner.querySelector('.is-active'); if (act) act.scrollIntoView({ inline: 'center', block: 'nearest' });
}
function paintFoot(){
  const bar = $('#actionbar'), dashes = $('#dashes');
  bar.hidden = S.view === 'welcome';
  dashes.innerHTML = '';
  let n = 0, at = 0, en = 'Next', bnT = 'পরের ধাপ', back = true, nextOn = true;
  if (S.view === 'lesson') {
    n = Lesson.panels.length; at = Lesson.i;
    if (Lesson.atEnd()) { en = Lesson.i === n - 1 ? 'Start the activity' : 'Next'; bnT = Lesson.i === n - 1 ? 'কাজ শুরু করুন' : 'পরের ধাপ'; }
    back = !(Lesson.i === 0 && Lesson.beat === 0);
  } else if (S.view === 'flow') {
    n = SUBS[STEPS[S.step].k].length; at = S.sub;
    const last = S.sub === n - 1;
    if (last && S.step < STEPS.length - 1) { en = 'Next: ' + STEPS[S.step + 1].en; bnT = 'পরের ধাপ: ' + STEPS[S.step + 1].bn; }
    if (last && S.step === STEPS.length - 1) nextOn = false;
    back = S.step > 0 || S.sub > 0 || S.role === 'teacher';
  } else if (S.view === 'board') { en = 'Back to the activity'; bnT = 'কাজে ফিরুন'; }
  for (let i = 0; i < n; i++) dashes.appendChild(el('i', 'dash' + (i === at ? ' on' : i < at ? ' done' : '')));
  $('#next-en').textContent = en; $('#next-bn').textContent = bnT;
  $('#btn-next').hidden = !nextOn;
  $('#btn-back').disabled = !back;
}
function render(){
  if (CUR && CUR.cleanup) try { CUR.cleanup(); } catch (e) {}
  CUR = null; TTS.stop();
  const wrap = $('#wrap'); wrap.innerHTML = ''; wrap.className = 'wrap';
  if (S.view === 'welcome') CUR = welcome();
  else if (S.view === 'lesson') { wrap.classList.add('wide'); CUR = Lesson.mount(); }
  else if (S.view === 'board') { CUR = el('div', 'panel'); CUR.appendChild(task('chart', 'Our room, this hour', 'এই ঘণ্টায় আমাদের ক্লাস', 'Anonymous. It starts again every hour.', 'নামহীন। প্রতি ঘণ্টায় নতুন করে শুরু হয়।')); CUR.appendChild(boardNode()); CUR.cleanup = () => clearInterval(POLL.timer); }
  else {
    const lv = levelFor(S.step);
    if (S.word && lv > S.level) { S.level = lv; save(); }
    if (S.step > 0 && !S.word) toast('Using “' + curWord() + '” for now — choose your own feeling in Feel.', 'আপাতত “' + curWord() + '” দেখানো হচ্ছে — ‘অনুভব’ ধাপে নিজের অনুভূতি বেছে নিন।');
    setFamily(curWord());
    CUR = SUBS[STEPS[S.step].k][S.sub]();
    if (S.dir < 0) CUR.classList.add('back');
  }
  if (CUR && !CUR.isConnected) wrap.appendChild(CUR);
  if (CUR && CUR.enter) CUR.enter();
  paintRail(); paintWordbar(); paintFoot(); measure();
  $('#stage').scrollTop = 0;
  const saveView = { view: S.view, step: S.step, sub: S.sub, lesson: typeof Lesson !== 'undefined' ? Lesson.i : 0 };
  store.set('pos', saveView);
}

/* ---------- welcome ---------- */
function welcome(){
  const p = el('div', 'panel p-welcome');
  p.appendChild(el('div', 'wl-mark', '😊'));
  p.appendChild(txt('h1', 'wl-title', 'How are you feeling?', 'আপনার কেমন লাগছে?'));
  p.appendChild(txt('p', 'wl-sub', 'Name a feeling. Calm the storm. Watch one English word rise.', 'অনুভূতির নাম দিন। ঝড় শান্ত করুন। একটি ইংরেজি শব্দকে উপরে উঠতে দেখুন।'));
  const row = el('div', 'wl-cards');
  [['student', 'phone', 'I’m a student', 'আমি শিক্ষার্থী', 'Choose your feeling, then learn its word in seven small steps.', 'নিজের অনুভূতি বেছে নিন, তারপর সাতটি ছোট ধাপে শব্দটি শিখুন।', STEPS.map(s => s.en)],
   ['teacher', 'tv', 'I’m a teacher', 'আমি শিক্ষক', 'Show the lesson on the projector, then lead the class through the seven steps.', 'প্রজেক্টরে পাঠটি দেখান, তারপর পুরো ক্লাসকে সাতটি ধাপে নিয়ে যান।', ['Lesson'].concat(STEPS.map(s => s.en))]].forEach((c, k) => {
    const b = el('button', 'wl-card wl-' + c[0]); b.type = 'button'; b.style.animationDelay = (0.1 + k * 0.12) + 's';
    const i = el('span', 'wl-ico'); i.appendChild(icon(c[1])); b.appendChild(i);
    b.appendChild(txt('span', 'wl-name', c[2], c[3]));
    b.appendChild(txt('span', 'wl-desc', c[4], c[5]));
    const st = el('span', 'wl-steps'); c[6].forEach((x, j) => { if (j) st.appendChild(el('i')); st.appendChild(el('span', null, x)); }); b.appendChild(st);
    const g = el('span', 'wl-go'); g.appendChild(el('span', null, 'Start')); g.appendChild(icon('arrow')); b.appendChild(g);
    b.onclick = () => chooseRole(c[0]);
    row.appendChild(b);
  });
  p.appendChild(row);
  p.appendChild(txt('p', 'wl-foot', 'You can change this later in the menu.', 'পরে মেনু থেকে এটি বদলাতে পারবেন।'));
  return p;
}
function chooseRole(r){
  S.role = r; save();
  if (r === 'teacher') { setTV(true); S.view = 'lesson'; Lesson.jump(0); }
  else { setTV(false); S.view = 'flow'; S.step = 0; S.sub = 0; }
  render();
}

/* ---------- menu ---------- */
function openMenu(){
  openSheet(sh => {
    sh.appendChild(txt('h2', null, 'Menu', 'মেনু')); sh.lastChild.id = 'sheet-h';
    const list = el('div', 'menu-list');
    const item = (ico, en, sub, fn) => {
      const b = el('button', 'menu-item'); b.type = 'button';
      const m = el('span', 'mi'); m.appendChild(icon(ico)); b.appendChild(m);
      const t = el('span'); t.appendChild(el('span', null, en)); if (sub) t.appendChild(el('small', null, sub)); b.appendChild(t);
      b.onclick = () => { closeSheet(); fn(); };
      list.appendChild(b);
    };
    item('tv', 'The lesson for the projector', 'Seven animated panels — ← → to move, A to autoplay', () => { if (S.role !== 'teacher') { S.role = 'teacher'; save(); } setTV(true); S.view = 'lesson'; render(); });
    item('heart', 'The student activity', 'Feel · Hear · Partners · Patterns · Say · Idioms · Share', () => { S.view = 'flow'; render(); });
    item('chart', 'Class board (live)', 'This hour’s anonymous feelings — good on the projector', () => { S.view = 'board'; render(); });
    item('compass', 'Room to choose', 'Three ways to hold a feeling, and a five-question reflection', openRTC);
    list.appendChild(el('div', 'menu-sep'));
    item('print', 'Print the worksheet for “' + curWord() + '”', 'One A4 page — for students without phones', () => Print.word(curWord()));
    item('print', 'Print a blank worksheet', 'One A4 page — works with any feeling word', () => Print.blank());
    list.appendChild(el('div', 'menu-sep'));
    /* speech settings */
    const vr = el('div', 'menu-row'); vr.appendChild(el('span', null, 'Voice'));
    const vs = el('select'); vs.setAttribute('aria-label', 'Voice');
    const V = TTS.voices();
    if (!V.length) vs.appendChild(el('option', null, 'No English voice on this device'));
    V.forEach(v => { const o = el('option', null, v.name + ' (' + v.lang + ')'); o.value = v.name; o.selected = TTS.voice && TTS.voice.name === v.name; vs.appendChild(o); });
    vs.onchange = () => { TTS.voice = V.find(v => v.name === vs.value) || null; store.set('voice', vs.value); TTS.say('How are you feeling today?'); };
    vr.appendChild(vs); list.appendChild(vr);
    const rr = el('div', 'menu-row'); rr.appendChild(el('span', null, 'Speed'));
    const rs = el('select'); rs.setAttribute('aria-label', 'Speed');
    [[0.75, 'Slow'], [0.9, 'Steady'], [1, 'Natural']].forEach(([v, l]) => { const o = el('option', null, l); o.value = v; o.selected = TTS.rate === v; rs.appendChild(o); });
    rs.onchange = () => { TTS.rate = +rs.value; store.set('rate', TTS.rate); };
    rr.appendChild(rs); list.appendChild(rr);
    list.appendChild(el('div', 'menu-sep'));
    item('users', S.role === 'teacher' ? 'Switch to student view' : 'Switch to teacher view', null, () => chooseRole(S.role === 'teacher' ? 'student' : 'teacher'));
    item('reset', 'Start over', 'Clears the chosen feeling and your sentences on this device', () => { S.word = null; S.level = 0; S.storm0 = S.storm1 = null; S.idiom = null; S.frames = { because: '', stake: '', need: '' }; save(); setFamily(null); S.view = 'welcome'; render(); });
    sh.appendChild(list);
    const t = el('div', 'teach');
    t.innerHTML = '<h3>For the teacher</h3><ol>' +
      '<li><b>Lesson (10 min, projected).</b> Six panels. Talk over each picture; → moves one beat. <kbd>A</kbd> autoplays at a slow reading pace; <kbd>B</kbd> shows Bangla; <kbd>P</kbd> switches the TV look.</li>' +
      '<li><b>Demo one word together.</b> Pick a feeling on the projector and run Hear and Partners with the whole class.</li>' +
      '<li><b>Pairs on phones (25–30 min).</b> Each student chooses their own feeling and climbs the seven steps. Students without phones use the printed worksheet; you play the listening from the projector.</li>' +
      '<li><b>Share (5 min).</b> Open the Class board on the projector. Read a few anonymous reasons aloud — never ask who wrote them.</li></ol>' +
      '<p style="margin:8px 0 0">Nothing is locked — any step can be opened at any time.</p>';
    sh.appendChild(t);
  });
}

/* ---------- wiring ---------- */
$('#btn-next').onclick = () => go(1);
$('#btn-back').onclick = () => go(-1);
$('#btn-menu').onclick = openMenu;
$('#btn-tv').onclick = () => setTV(!S.tv);
$$('.langsw button').forEach(b => b.onclick = () => { setLang(b.dataset.lang); const sh = $('#sheet'); if (sh.classList.contains('show') && sh.repaint) sh.repaint(); });
document.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape') { closeSheet(); return; }
  if ($('#sheet').classList.contains('show')) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
  else if (e.key === ' ' && S.view === 'lesson') { e.preventDefault(); go(1); }
  else if (e.key === 'p' || e.key === 'P') setTV(!S.tv);
  else if (e.key === 'b' || e.key === 'B') setLang(S.lang === 'bn' ? 'en' : 'bn');
  else if ((e.key === 'a' || e.key === 'A') && S.view === 'lesson') Lesson.toggleAuto();
});
new ResizeObserver(measure).observe($('#appbar'));

function boot(){
  setLang(S.lang);
  const q = new URLSearchParams(location.search);
  setTV(q.has('tv') ? true : S.role === 'teacher' ? store.get('tv', true) : false);
  if (S.word) setFamily(S.word);
  const pos = store.get('pos', null);
  if (!S.role) S.view = 'welcome';
  else if (q.get('role')) { S.view = S.role === 'teacher' ? 'lesson' : 'flow'; }
  else if (pos && pos.view && pos.view !== 'welcome') { S.view = pos.view === 'board' ? 'flow' : pos.view; S.step = Math.min(pos.step || 0, STEPS.length - 1); S.sub = Math.min(pos.sub || 0, SUBS[STEPS[S.step].k].length - 1); if (pos.view === 'lesson') Lesson.jump(pos.lesson || 0); }
  else S.view = S.role === 'teacher' ? 'lesson' : 'flow';
  const st = q.get('step'); if (st) { const i = STEPS.findIndex(x => x.k === st); if (i >= 0) { S.view = 'flow'; S.step = i; S.sub = +(q.get('sub') || 0); } }
  render();
}
window.addEventListener('DOMContentLoaded', boot);
