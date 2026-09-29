/* ===========================================================================
   How Are You Feeling? — the projected lesson
   ---------------------------------------------------------------------------
   Six pictures that play in beats, built the way Culture Circles' lesson is:
   the teacher talks, → (or a tap on the picture) moves the picture on one
   beat, and only after its last beat does → turn the panel. ← walks back
   beat by beat. A is autoplay at a slow reader's pace.

   Every scene draws everything it will ever show at build time and tags
   each piece with when it matters:
     data-in="k"      hidden until beat k, then shown (.draw strokes draw)
     data-out="k"     gone from beat k onward
     data-at="k:cls"  carries cls from beat k ("k-m:cls" stops after m)
     data-now="k j"   pulses on those beats only
   so every state is a pure function of the beat, and stepping back is the
   same CSS transitions running in reverse.

   The canvas is 1600 x 620 — the shape of what a 1080p projector has left
   once the header and caption have had theirs — so one unit is about one
   pixel at the front of the room. Nothing is set smaller than 26 units.
   Motion follows the Brand Book: nothing bounces or decorates; things move
   only when the movement is the idea (words flowing in, a filter rising,
   a word climbing the iceberg).
   =========================================================================== */
'use strict';

const NS = 'http://www.w3.org/2000/svg';
const ZW = 1600, ZH = 620;
function N(p, tag, a = {}){
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(a)) {
    if (v == null) continue;
    if (k === 'in') n.dataset.in = v;
    else if (k === 'out') n.dataset.out = v;
    else if (k === 'at') n.dataset.at = v;
    else if (k === 'now') n.dataset.now = v;
    else if (k === 'cls') n.setAttribute('class', v);
    else if (k === 'delay') n.style.transitionDelay = v + 'ms';
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  p.appendChild(n);
  return n;
}
const G = (p, a) => N(p, 'g', a);
/* a label, with its Bangla line underneath when Bangla is on */
function T(p, x, y, en, bnText, a = {}){
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls, delay: a.delay });
  const size = a.size || 30;
  N(g, 'text', { x, y, 'font-size': size, 'font-weight': a.weight || 700, fill: a.fill || '#1D211C', 'text-anchor': a.anchor || 'middle',
    cls: a.disp ? 't-disp' : null, 'font-style': a.italic ? 'italic' : null, 'letter-spacing': a.ls || null, text: en });
  if (bnText) N(g, 'text', { x, y: y + size * 1.05, 'font-size': Math.max(24, size * .78), fill: a.bnFill || '#5F6A5C', 'text-anchor': a.anchor || 'middle', cls: 't-bn', text: bnText });
  return g;
}
/* a person as a bust; (x, y) is the centre of the head */
function person(p, x, y, s, fill, face, a = {}){
  const g = G(p, a);
  N(g, 'path', { d: `M${x - .42 * s} ${y + .78 * s}Q${x - .44 * s} ${y + .3 * s} ${x} ${y + .3 * s}Q${x + .44 * s} ${y + .3 * s} ${x + .42 * s} ${y + .78 * s}Z`, fill });
  N(g, 'circle', { cx: x, cy: y, r: .2 * s, fill, stroke: '#fff', 'stroke-width': 4 });
  if (face) {
    const e = .065 * s, ey = y - .03 * s;
    N(g, 'circle', { cx: x - e, cy: ey, r: .018 * s + 1, fill: '#1D211C' });
    N(g, 'circle', { cx: x + e, cy: ey, r: .018 * s + 1, fill: '#1D211C' });
    const my = y + .08 * s, mw = .075 * s;
    const d = face === 'smile' ? `M${x - mw} ${my}Q${x} ${my + .06 * s} ${x + mw} ${my}`
            : face === 'worry' ? `M${x - mw} ${my + .04 * s}Q${x} ${my - .03 * s} ${x + mw} ${my + .04 * s}`
            : face === 'laugh' ? `M${x - mw} ${my - .01 * s}Q${x} ${my + .1 * s} ${x + mw} ${my - .01 * s}Z`
            : `M${x - mw} ${my + .01 * s}H${x + mw}`;
    N(g, 'path', { d, fill: face === 'laugh' ? '#1D211C' : 'none', stroke: '#1D211C', 'stroke-width': .02 * s + 1, 'stroke-linecap': 'round' });
  }
  return g;
}
function chip(p, x, y, text, a = {}){
  const size = a.size || 30, w = a.w || Math.max(90, text.length * size * .56 + 44), h = size * 1.7;
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls, delay: a.delay, now: a.now });
  N(g, 'rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: a.rx != null ? a.rx : h / 2, fill: a.fill || '#fff', stroke: a.stroke || 'rgba(16,61,33,.3)', 'stroke-width': a.sw || 2, 'stroke-dasharray': a.dash || null });
  N(g, 'text', { x, y: y + size * .35, 'font-size': size, 'font-weight': a.weight || 800, fill: a.ink || '#1D211C', 'text-anchor': 'middle', text });
  g.w = w;
  return g;
}
function bubble(p, x, y, w, h, tx, ty, text, a = {}){
  const g = G(p, a);
  if (text) { const need = text.length * (a.size || 30) * .56 + 44; if (need > w) { x -= (need - w) / 2; w = need; } }
  N(g, 'path', { d: `M${x + 20} ${y}H${x + w - 20}Q${x + w} ${y} ${x + w} ${y + 20}V${y + h - 20}Q${x + w} ${y + h} ${x + w - 20} ${y + h}H${Math.min(x + w - 30, Math.max(x + 60, tx + 40))}L${tx} ${ty}L${Math.min(x + w - 60, Math.max(x + 30, tx))} ${y + h}H${x + 20}Q${x} ${y + h} ${x} ${y + h - 20}V${y + 20}Q${x} ${y} ${x + 20} ${y}Z`,
    fill: a.fill || '#fff', stroke: a.stroke || '#1D211C', 'stroke-width': 3, 'stroke-linejoin': 'round' });
  if (text) N(g, 'text', { x: x + w / 2, y: y + h / 2 + (a.size || 30) * .36, 'font-size': a.size || 30, 'font-weight': 800, fill: a.ink || '#1D211C', 'text-anchor': 'middle', text });
  return g;
}
function cloud(p, x, y, s, fill, a = {}){
  const g = G(p, a);
  N(g, 'path', { d: `M${x - 1 * s} ${y + .45 * s}H${x + 1 * s}A${.45 * s} ${.45 * s} 0 0 0 ${x + .95 * s} ${y - .35 * s}A${.62 * s} ${.62 * s} 0 0 0 ${x - .15 * s} ${y - .55 * s}A${.5 * s} ${.5 * s} 0 0 0 ${x - .9 * s} ${y - .1 * s}A${.3 * s} ${.3 * s} 0 0 0 ${x - 1 * s} ${y + .45 * s}Z`,
    fill, stroke: 'rgba(0,0,0,.25)', 'stroke-width': 3 });
  return g;
}
/* a word tile that travels along a path, forever, while its group is shown */
function flier(p, path, text, begin, dur, fill, bounce){
  const g = G(p, {});
  const w = text.length * 17 + 30;
  N(g, 'rect', { x: -w / 2, y: -22, width: w, height: 44, rx: 10, fill, stroke: 'rgba(0,0,0,.2)', 'stroke-width': 2 });
  N(g, 'text', { x: 0, y: 9, 'font-size': 26, 'font-weight': 800, 'text-anchor': 'middle', fill: '#1D211C', text });
  N(g, 'animateMotion', { path, dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite', calcMode: 'linear' });
  N(g, 'animate', { attributeName: 'opacity', values: bounce ? '0;1;1;0;0' : '0;1;1;0', keyTimes: bounce ? '0;.08;.55;.7;1' : '0;.1;.85;1', dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite' });
  g.setAttribute('opacity', 0);
  return g;
}
const FAM = { Fear: ['#c993dd', '#6B3F80'], Anger: ['#ee806b', '#9A3522'], Surprise: ['#edae53', '#87561A'], Happy: ['#e9cf5f', '#6F5B10'], Disgust: ['#73c989', '#2F6E3E'], Sad: ['#70bee0', '#22607C'] };
function ring(p, cx, cy, r0, r1, items, a = {}){
  /* items: [label, emoji, colour]; drawn as a full ring of equal sectors */
  const g = G(p, a), n = items.length;
  items.forEach((it, i) => {
    const s = (i / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n, e = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n;
    const P = (r, t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)];
    const [a1, b1] = P(r1, s), [a2, b2] = P(r1, e), [a3, b3] = P(r0, e), [a4, b4] = P(r0, s);
    const lg = e - s > Math.PI ? 1 : 0;
    const sg = G(g, { cls: it[3] || null, at: it[4] || null });
    N(sg, 'path', { d: `M${a1} ${b1}A${r1} ${r1} 0 ${lg} 1 ${a2} ${b2}L${a3} ${b3}A${r0} ${r0} 0 ${lg} 0 ${a4} ${b4}Z`, fill: it[2], stroke: '#fff', 'stroke-width': 5 });
    const m = (s + e) / 2, [lx, ly] = P((r0 + r1) / 2, m);
    N(sg, 'text', { x: lx, y: ly - 4, 'font-size': 40, 'text-anchor': 'middle', text: it[1] });
    N(sg, 'text', { x: lx, y: ly + 34, 'font-size': 26, 'font-weight': 800, 'text-anchor': 'middle', fill: '#1D211C', text: it[0] });
  });
  return g;
}

/* ============================================================ the panels */
const LESSON = [
/* 1 · the affective filter ------------------------------------------------ */
{ rail: 'Filter', railBn: 'ছাঁকনি', kicker: 'Why feelings matter', kickerBn: 'অনুভূতি কেন গুরুত্বপূর্ণ',
  title: 'Feelings come to class, too', titleBn: 'অনুভূতিও ক্লাসে আসে',
  body: 'When we feel safe, the English we hear gets in and stays. When we feel afraid or embarrassed, something like a filter goes up and blocks it. Stephen Krashen called this the affective filter. Naming the feeling and breathing can bring the filter down.',
  bodyBn: 'নিরাপদ বোধ করলে যে ইংরেজি শুনি তা মনে ঢোকে ও থেকে যায়। ভয় বা লজ্জা পেলে যেন একটা ছাঁকনি উঠে যায় আর শব্দগুলো আটকে দেয়। স্টিফেন ক্র্যাশেন এর নাম দিয়েছেন ‘অ্যাফেক্টিভ ফিল্টার’। অনুভূতির নাম দেওয়া আর শ্বাস নেওয়া ছাঁকনিটিকে নামিয়ে আনতে পারে।',
  beats: [
    ['Every class, English flows towards us.', 'প্রতিটি ক্লাসে ইংরেজি আমাদের দিকে বয়ে আসে।'],
    ['When we feel safe, the words get in.', 'নিরাপদ বোধ করলে শব্দগুলো মনের ভেতরে ঢোকে।'],
    ['Then someone laughs at a mistake…', 'তারপর ভুল করলে কেউ হেসে ফেলল…'],
    ['…and a filter goes up. The words bounce off.', '…তখন একটা ছাঁকনি উঠে যায়। শব্দগুলো ফিরে যায়।'],
    ['Stephen Krashen called it the affective filter.', 'স্টিফেন ক্র্যাশেন এর নাম দিয়েছেন ‘অ্যাফেক্টিভ ফিল্টার’।'],
    ['Name the feeling. Breathe.', 'অনুভূতির নাম দিন। শ্বাস নিন।'],
    ['The filter comes down. The words get in again.', 'ছাঁকনি নেমে যায়। শব্দগুলো আবার ঢোকে।']
  ],
  draw(s){
    const T0 = [320, 262], L = [1180, 262];
    /* the learner's mind: it glows while words are getting in */
    N(s, 'circle', { cx: L[0], cy: L[1], r: 104, fill: '#F0E6CD', in: 1, at: '2-4:dim' });
    N(s, 'circle', { cx: L[0], cy: L[1] + 150, r: 190, fill: 'none', stroke: '#1F5C7A', 'stroke-width': 4, cls: 'breathe', in: 5, out: 6 });
    person(s, T0[0], T0[1], 330, '#5F6A5C', 'smile');
    person(s, L[0], L[1], 330, '#6F8F62', 'smile', { out: 2 });
    person(s, L[0], L[1], 330, '#6F8F62', 'worry', { in: 2, out: 5 });
    person(s, L[0], L[1], 330, '#6F8F62', 'flat', { in: 5, out: 6 });
    person(s, L[0], L[1], 330, '#6F8F62', 'smile', { in: 6 });
    /* the stream */
    const path = 'M410 250 Q740 60 1085 250';
    N(s, 'path', { d: path, fill: 'none', stroke: 'rgba(16,61,33,.25)', 'stroke-width': 4, 'stroke-dasharray': '10 12', cls: 'flow' });
    const words = ['feel', 'happy', 'deeply', 'about', 'nervous', 'proud'], fills = ['#FAF3D2', '#E2F3E6', '#DFF0F8', '#F0E6CD', '#F3E8F8', '#FCE7E2'];
    const inG = G(s, { in: 1, at: '2-5:gone' });
    words.forEach((w, i) => flier(inG, path, w, i * .5, 3, fills[i]));
    const bounce = 'M410 250 Q740 60 960 180 Q930 260 820 330';
    const outG = G(s, { in: 3, out: 5 });
    words.forEach((w, i) => flier(outG, bounce, w, i * .5, 3, fills[i], true));
    /* someone laughs */
    person(s, 1480, 330, 210, '#8A6A3A', 'laugh', { in: 2, out: 5, cls: 'slide-r' });
    bubble(s, 1390, 120, 190, 66, 1470, 255, 'HA HA!', { in: 2, out: 5, size: 30, fill: '#FCE7E2', stroke: '#9A3522', ink: '#9A3522' });
    cloud(s, L[0], 64, 76, '#6E7F89', { in: 2, out: 5, cls: 'pop' });
    N(s, 'path', { d: `M${L[0] + 10} 100l-18 32h20l-12 28`, fill: 'none', stroke: '#F2C443', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', in: 2, out: 5 });
    /* the filter */
    const wall = G(s, { cls: 'wall', at: '3-5:up' });
    N(wall, 'rect', { x: 965, y: 110, width: 44, height: 360, rx: 14, fill: '#B0563A', opacity: .92 });
    for (let y = 140; y < 460; y += 36) N(wall, 'path', { d: `M973 ${y}h28`, stroke: '#FCE7E2', 'stroke-width': 5, 'stroke-linecap': 'round' });
    const lab = G(s, { in: 4, out: 6 });
    N(lab, 'rect', { x: 540, y: 540, width: 470, height: 64, rx: 32, fill: '#fff', stroke: '#B0563A', 'stroke-width': 3 });
    N(lab, 'text', { x: 775, y: 583, 'font-size': 32, 'font-weight': 800, fill: '#8E402B', 'text-anchor': 'middle', 'letter-spacing': 3, text: 'AFFECTIVE FILTER' });
    N(lab, 'path', { d: 'M987 540V472', stroke: '#B0563A', 'stroke-width': 3 });
    /* naming it */
    bubble(s, 1230, 40, 340, 74, 1230, 168, 'I feel embarrassed.', { in: 5, out: 6, size: 28, fill: '#F3E8F8', stroke: '#6B3F80', ink: '#6B3F80' });
    T(s, L[0], 606, 'breathe in… breathe out', null, { in: 5, out: 6, size: 28, fill: '#1F5C7A', italic: true, weight: 600 });
  } },

/* 2 · name it to tame it --------------------------------------------------- */
{ rail: 'Name it', railBn: 'নাম দিন', kicker: 'The feelings wheel', kickerBn: 'অনুভূতির চাকা',
  title: 'Name it to tame it', titleBn: 'নাম দিন, বশে আনুন',
  body: 'A big feeling with no name feels like a storm. Start in the middle of the wheel with a big feeling, then move outwards to a more exact word. The more exactly we can name a feeling, the smaller the storm often feels.',
  bodyBn: 'নামহীন বড় অনুভূতি ঝড়ের মতো লাগে। চাকার মাঝখানে একটি বড় অনুভূতি দিয়ে শুরু করুন, তারপর বাইরের দিকে আরও নির্দিষ্ট শব্দে যান। অনুভূতির নাম যত সঠিক হয়, ঝড়টা প্রায়ই তত ছোট মনে হয়।',
  beats: [
    ['A big feeling with no name feels like a storm.', 'নামহীন বড় অনুভূতি ঝড়ের মতো লাগে।'],
    ['Start in the middle: six big feelings.', 'মাঝখান থেকে শুরু করুন: ছয়টি বড় অনুভূতি।'],
    ['Then move out to a more exact word.', 'তারপর বাইরের দিকে আরও নির্দিষ্ট শব্দে যান।'],
    ['And out again — the most exact word.', 'আবার বাইরে — সবচেয়ে সঠিক শব্দ।'],
    ['“I feel overwhelmed.” Now the storm has a name.', '“আমি দিশেহারা বোধ করছি।” এখন ঝড়ের একটা নাম আছে।'],
    ['Named, the storm often gets smaller.', 'নাম দিলে ঝড়টা প্রায়ই ছোট হয়ে আসে।']
  ],
  draw(s){
    const P = [300, 300];
    person(s, P[0], P[1], 330, '#6F8F62', 'worry', { out: 4 });
    person(s, P[0], P[1], 330, '#6F8F62', 'flat', { in: 4, out: 5 });
    person(s, P[0], P[1], 330, '#6F8F62', 'smile', { in: 5 });
    const storm = G(s, { cls: 'mover', at: '5:shrink' });
    cloud(storm, 300, 80, 120, '#5E6E78');
    N(storm, 'path', { d: 'M300 120l-22 42h26l-16 38', fill: 'none', stroke: '#F2C443', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    N(s, 'text', { x: 300, y: 92, 'font-size': 64, 'font-weight': 800, fill: '#fff', 'text-anchor': 'middle', text: '?', out: 4 });
    const cx = 1060, cy = 312;
    /* zoom 1: six big feelings */
    const z1 = G(s, { in: 1, at: '2:gone', cls: 'pop' });
    N(z1, 'circle', { cx, cy, r: 110, fill: '#fff', stroke: 'rgba(16,61,33,.25)', 'stroke-width': 3 });
    ring(z1, cx, cy, 112, 290, EMO.wheel.map(f => [f.name, EMO.emoji[f.name], FAM[f.name][0]]));
    N(z1, 'text', { x: cx, y: cy - 6, 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: '#5F6A5C', text: 'How do' });
    N(z1, 'text', { x: cx, y: cy + 32, 'font-size': 34, 'font-weight': 800, 'text-anchor': 'middle', fill: '#134219', text: 'you feel?' });
    /* zoom 2: Fear opens */
    const fear = EMO.wheel.find(f => f.name === 'Fear');
    const z2 = G(s, { in: 2, at: '3:gone', cls: 'pop' });
    N(z2, 'circle', { cx, cy, r: 118, fill: FAM.Fear[0], stroke: '#fff', 'stroke-width': 6 });
    N(z2, 'text', { x: cx, y: cy - 4, 'font-size': 52, 'text-anchor': 'middle', text: EMO.emoji.Fear });
    N(z2, 'text', { x: cx, y: cy + 44, 'font-size': 34, 'font-weight': 800, 'text-anchor': 'middle', text: 'Fear' });
    ring(z2, cx, cy, 120, 290, fear.children.map(c => [c.name, EMO.emoji[c.name], '#EBD9F2', null, c.name === 'Anxious' ? null : '2:dim']));
    /* zoom 3: Anxious opens */
    const z3 = G(s, { in: 3, cls: 'pop' });
    N(z3, 'circle', { cx, cy, r: 118, fill: '#DCC2EA', stroke: '#fff', 'stroke-width': 6 });
    N(z3, 'text', { x: cx, y: cy - 4, 'font-size': 52, 'text-anchor': 'middle', text: EMO.emoji.Anxious });
    N(z3, 'text', { x: cx, y: cy + 44, 'font-size': 34, 'font-weight': 800, 'text-anchor': 'middle', text: 'Anxious' });
    ring(z3, cx, cy, 120, 290, [['Overwhelmed', EMO.emoji.Overwhelmed, '#F3E8F8'], ['Worried', EMO.emoji.Worried, '#F3E8F8', null, '4:dim']]);
    /* the trail across the top right */
    chip(s, 1470, 90, 'Fear', { in: 2, fill: FAM.Fear[0], stroke: '#fff', size: 28, w: 150 });
    chip(s, 1470, 170, 'Anxious', { in: 3, fill: '#DCC2EA', stroke: '#fff', size: 28, w: 190 });
    chip(s, 1470, 250, 'Overwhelmed', { in: 4, fill: '#F3E8F8', stroke: FAM.Fear[1], ink: FAM.Fear[1], size: 28, w: 240, sw: 3 });
    N(s, 'path', { d: 'M1470 112v34', stroke: '#6B3F80', 'stroke-width': 3, in: 3 });
    N(s, 'path', { d: 'M1470 192v34', stroke: '#6B3F80', 'stroke-width': 3, in: 4 });
    bubble(s, 470, 70, 330, 76, 420, 200, 'I feel overwhelmed.', { in: 4, size: 30, fill: '#F3E8F8', stroke: '#6B3F80', ink: '#6B3F80' });
    /* the storm scale: 5 → 2 */
    const sc = G(s, { in: 5 });
    N(sc, 'rect', { x: 1310, y: 440, width: 280, height: 150, rx: 18, fill: '#fff', stroke: 'rgba(16,61,33,.25)', 'stroke-width': 2 });
    N(sc, 'text', { x: 1380, y: 540, 'font-size': 86, 'font-weight': 800, 'text-anchor': 'middle', fill: '#5E6E78', text: '5' });
    N(sc, 'text', { x: 1450, y: 530, 'font-size': 48, 'text-anchor': 'middle', fill: '#5F6A5C', text: '→' });
    N(sc, 'text', { x: 1520, y: 540, 'font-size': 86, 'font-weight': 800, 'text-anchor': 'middle', fill: '#1F5C7A', text: '2' });
  } },

/* 3 · room to choose ------------------------------------------------------- */
{ rail: 'Choose', railBn: 'বেছে নিন', kicker: 'Three ways to hold a feeling', kickerBn: 'অনুভূতি ধরে রাখার তিনটি উপায়',
  title: 'Room to choose', titleBn: 'বেছে নেওয়ার সুযোগ',
  body: 'Imagine someone laughs when you mispronounce a word. If the feeling is too close, it takes over and you stop trying. If it is too far, you push it away and pretend you do not care. In the middle there is room to choose: notice the feeling, pause, and choose what to do next.',
  bodyBn: 'ধরুন একটি শব্দ ভুল উচ্চারণ করলে কেউ হেসে উঠল। অনুভূতি খুব কাছে থাকলে সেটি আপনাকে চালায়, আপনি চেষ্টা থামিয়ে দেন। খুব দূরে ঠেলে দিলে ভান করেন আপনার কিছু যায় আসে না। মাঝখানে আছে বেছে নেওয়ার সুযোগ: অনুভূতি খেয়াল করুন, একটু থামুন, তারপর কী করবেন বেছে নিন।',
  beats: [
    ['You say a word wrong. Someone laughs.', 'আপনি একটি শব্দ ভুল বললেন। কেউ হেসে উঠল।'],
    ['There are three ways to hold that feeling.', 'সেই অনুভূতি ধরে রাখার তিনটি উপায় আছে।'],
    ['Too close: the feeling takes over. I stop trying.', 'খুব কাছে: অনুভূতি আমাকে চালায়। আমি চেষ্টা থামিয়ে দিই।'],
    ['Too far: I push it away. “I don’t care.”', 'অনেক দূরে: অনুভূতি ঠেলে সরাই। “আমার কিছু যায় আসে না।”'],
    ['Room to choose: notice… pause… choose.', 'বেছে নেওয়ার সুযোগ: খেয়াল করি… থামি… বেছে নিই।'],
    ['“I’m embarrassed. Can I try again?”', '“আমার লজ্জা লাগছে। আবার চেষ্টা করতে পারি?”']
  ],
  draw(s){
    /* the moment */
    const m = G(s, { at: '1:gone' });
    person(m, 640, 250, 330, '#6F8F62', 'worry');
    bubble(m, 380, 40, 320, 80, 560, 170, 'vege-TA-ble?', { size: 32 });
    person(m, 1000, 290, 260, '#8A6A3A', 'laugh');
    bubble(m, 1080, 60, 220, 72, 1030, 205, 'HA HA!', { size: 32, fill: '#FCE7E2', stroke: '#9A3522', ink: '#9A3522' });
    const X = [290, 800, 1310], y = 250;
    const col = (i, a) => G(s, a);
    /* too close */
    const c1 = col(0, { in: 1, at: '5:dim' });
    N(c1, 'circle', { cx: X[0], cy: y + 60, r: 205, fill: '#F3C9BD', opacity: .9, in: 2, cls: 'pop' });
    person(c1, X[0], y, 300, '#6F8F62', 'worry');
    T(c1, X[0], 590, 'Too close', 'খুব কাছে', { size: 34, fill: '#9A3522', in: 2 });
    bubble(c1, X[0] - 170, 20, 340, 70, X[0] - 20, 150, 'I’m terrible at English!', { in: 2, size: 26, fill: '#FCE7E2', stroke: '#9A3522', ink: '#9A3522' });
    /* room to choose (the middle column is shown last) */
    const c2 = col(1, { in: 1 });
    person(c2, X[1] - 60, y, 300, '#6F8F62', 'flat', { out: 5 });
    person(c2, X[1] - 60, y, 300, '#6F8F62', 'smile', { in: 5 });
    N(c2, 'path', { d: `M${X[1] + 40} ${y + 130}H${X[1] + 120}`, stroke: '#6F8F62', 'stroke-width': 5, 'stroke-dasharray': '10 10', in: 4 });
    N(c2, 'circle', { cx: X[1] + 160, cy: y + 130, r: 44, fill: '#E3EAD9', stroke: '#6F8F62', 'stroke-width': 4, in: 4, cls: 'pop' });
    N(c2, 'path', { d: `M${X[1] + 148} ${y + 110}v40M${X[1] + 172} ${y + 110}v40`, stroke: '#103D21', 'stroke-width': 8, 'stroke-linecap': 'round', in: 4 });
    T(c2, X[1], 590, 'Room to choose', 'বেছে নেওয়ার সুযোগ', { size: 34, fill: '#2F6E3E', in: 4 });
    bubble(c2, X[1] - 240, 10, 480, 76, X[1] - 60, 150, 'I’m embarrassed. Can I try again?', { in: 5, size: 26, fill: '#E3EAD9', stroke: '#2F6E3E', ink: '#103D21' });
    /* too far */
    const c3 = col(2, { in: 1, at: '5:dim' });
    person(c3, X[2] - 70, y, 300, '#6F8F62', 'flat');
    N(c3, 'rect', { x: X[2] + 40, y: 80, width: 30, height: 390, rx: 8, fill: '#1F5C7A', in: 3, cls: 'rise' });
    N(c3, 'circle', { cx: X[2] + 150, cy: y + 130, r: 34, fill: '#DCEBF2', stroke: '#1F5C7A', 'stroke-width': 4, in: 3 });
    T(c3, X[2], 590, 'Too far', 'অনেক দূরে', { size: 34, fill: '#22607C', in: 3 });
    bubble(c3, X[2] - 200, 20, 260, 70, X[2] - 90, 150, 'I don’t care.', { in: 3, size: 28, fill: '#DCEBF2', stroke: '#1F5C7A', ink: '#123F57' });
  } },

/* 4 · the iceberg ------------------------------------------------------------ */
{ rail: 'Iceberg', railBn: 'হিমশৈল', kicker: 'How a word grows', kickerBn: 'একটি শব্দ কীভাবে বেড়ে ওঠে',
  title: 'Every word climbs an iceberg', titleBn: 'প্রতিটি শব্দ একটি হিমশৈল বেয়ে ওঠে',
  body: 'The Growing Participator Approach pictures what we know of a language as an iceberg. Most of it is under the water: words we have heard and half understand. Words rise each time we hear them and understand them in context — first the word, then its partners, then its patterns. Above the water are the words we can say, and at the very tip are the words we understand before the speaker has finished.',
  bodyBn: 'গ্রোয়িং পার্টিসিপেটর অ্যাপ্রোচ ভাষাজ্ঞানকে একটি হিমশৈলের মতো দেখে। এর বেশিরভাগই পানির নিচে: যে শব্দ শুনেছি, আধা বুঝি। প্রতিবার প্রসঙ্গে শুনে বুঝলে শব্দটি একটু উপরে ওঠে — প্রথমে শব্দ, তারপর তার সঙ্গী শব্দ, তারপর তার গঠন। পানির উপরে থাকে যে শব্দগুলো আমরা বলতে পারি, আর একেবারে চূড়ায় থাকে যে শব্দ বক্তা শেষ করার আগেই বুঝে ফেলি।',
  beats: [
    ['Most of what we know is under the water.', 'আমরা যা জানি তার বেশিরভাগই পানির নিচে।'],
    ['First we hear a word — many, many times.', 'প্রথমে একটি শব্দ শুনি — অনেক, অনেকবার।'],
    ['Then we hear its partners: feel anxious, deeply anxious.', 'তারপর তার সঙ্গী শব্দ শুনি: feel anxious, deeply anxious।'],
    ['We notice its pattern: anxious about + something.', 'তার গঠন খেয়াল করি: anxious about + কিছু।'],
    ['We say it in our own sentence. Now it is above the water.', 'নিজের বাক্যে বলি। এখন শব্দটি পানির উপরে।'],
    ['We learn other ways to say it: butterflies in my stomach.', 'একই কথা অন্যভাবে বলা শিখি: butterflies in my stomach।'],
    ['At the top, we understand it before the speaker finishes.', 'চূড়ায় পৌঁছালে বক্তা শেষ করার আগেই বুঝে ফেলি।'],
    ['Words rise when we hear them and understand them — again and again.', 'বারবার শুনে বুঝলেই শব্দ উপরে ওঠে।']
  ],
  draw(s){
    const WL = 196, BX = 1010;
    N(s, 'rect', { x: 0, y: WL, width: ZW, height: ZH - WL, fill: '#DCEBF2' });
    N(s, 'rect', { x: 0, y: WL + 200, width: ZW, height: ZH - WL - 200, fill: '#C3DCE8' });
    N(s, 'path', { d: `M${BX - 140} ${WL}L${BX - 60} 70l40 30 46-82 40 56 30-24 58 150z`, fill: '#fff', stroke: '#1F5C7A', 'stroke-width': 4, 'stroke-linejoin': 'round' });
    N(s, 'path', { d: `M${BX - 150} ${WL}l-70 180 60 170 170 60 160-70 50-190-60-150z`, fill: '#EEF6F9', stroke: '#1F5C7A', 'stroke-width': 4, 'stroke-linejoin': 'round' });
    N(s, 'path', { d: `M0 ${WL}H${ZW}`, stroke: '#123F57', 'stroke-width': 4, 'stroke-dasharray': '16 12' });
    T(s, 1580, WL - 14, 'WATERLINE', null, { size: 26, anchor: 'end', fill: '#123F57', ls: 3, weight: 800 });
    /* the six rungs, with a picture for each */
    const Y = [548, 458, 350, 168, 118, 64];
    const R = [['Hear it', 'শুনি', '👂'], ['Partners', 'সঙ্গী শব্দ', '🔗'], ['Pattern', 'গঠন', '🧩'], ['Say it', 'বলি', '💬'], ['Idioms', 'বাগধারা', '🖼️'], ['Mine!', 'আমার!', '⭐']];
    R.forEach((r, i) => {
      const g = G(s, { in: i + 1, cls: 'slide-l' });
      N(g, 'path', { d: `M330 ${Y[i]}H${BX - 170}`, stroke: '#1F5C7A', 'stroke-width': 2, 'stroke-dasharray': '4 8' });
      N(g, 'text', { x: 50, y: Y[i] + 13, 'font-size': 38, text: r[2] });
      N(g, 'text', { x: 104, y: Y[i] + 11, 'font-size': 32, 'font-weight': 800, fill: i < 3 ? '#123F57' : '#134219', text: r[0] });
      N(g, 'text', { x: 104, y: Y[i] + 42, 'font-size': 24, fill: '#5F6A5C', cls: 't-bn', text: r[1] });
    });
    /* what arrives at each rung, to the right of the ice */
    const E = G(s, {});
    [0, 1, 2].forEach(k => N(E, 'path', { d: `M1250 ${540 - k * 22}q20 -22 0 -44`, fill: 'none', stroke: '#1F5C7A', 'stroke-width': 5, 'stroke-linecap': 'round', in: 1, now: '1', transform: `translate(${k * 26} ${k * 22})` }));
    chip(E, 1380, 458, 'deeply anxious', { in: 2, size: 28, fill: '#fff', stroke: '#6B3F80', ink: '#6B3F80', out: 7 });
    chip(E, 1380, 350, 'anxious about + ___', { in: 3, size: 28, fill: '#F0E6CD', stroke: '#B9924F', ink: '#6B5116', out: 7 });
    bubble(E, 1230, 124, 350, 64, 1200, 170, 'I feel anxious about my exam.', { in: 4, out: 7, size: 22, fill: '#fff', stroke: '#134219', ink: '#134219' });
    chip(E, 1370, 86, 'butterflies in my stomach', { in: 5, out: 7, size: 24, fill: '#FAF3D2', stroke: '#B9924F', ink: '#6F5B10' });
    T(E, 1380, 40, '…before the speaker finishes', null, { in: 6, out: 7, size: 26, italic: true, fill: '#134219' });
    /* the word itself, climbing */
    const w = G(s, { cls: 'mover climber', at: '0:lv0 1:lv1 2:lv2 3:lv3 4:lv4 5:lv5 6:lv6' });
    N(w, 'rect', { x: -95, y: -30, width: 190, height: 60, rx: 30, fill: '#6B3F80' });
    N(w, 'text', { x: 0, y: 11, 'font-size': 32, 'font-weight': 800, fill: '#fff', 'text-anchor': 'middle', text: 'anxious' });
    s.CLIMB = { x: BX, y: [604, Y[0], Y[1], Y[2], Y[3], Y[4], Y[5]] };
  },
  onBeat(k, s){
    const c = s.querySelector('.climber');
    const lv = Math.min(k, 6);
    c.style.transform = `translate(${s.CLIMB.x}px, ${s.CLIMB.y[lv]}px)`;
    c.style.opacity = k === 0 ? 0 : 1;
  } },

/* 5 · chunks ------------------------------------------------------------------ */
{ rail: 'Chunks', railBn: 'শব্দগুচ্ছ', kicker: 'Learn the company a word keeps', kickerBn: 'শব্দটি কাদের সঙ্গে থাকে, তা শিখুন',
  title: 'A word never walks alone', titleBn: 'শব্দ কখনো একা চলে না',
  body: 'Knowing “anxious” is a start. Its partners (collocations) like “feel anxious” and “deeply anxious”, and its grammar patterns (colligations) like “anxious about + noun” and “anxious to + verb”, let you build real sentences quickly. Idioms such as “butterflies in my stomach” say the same feeling with a picture.',
  bodyBn: '“anxious” জানা একটা শুরু। এর সঙ্গী শব্দ (কলোকেশন) যেমন “feel anxious”, “deeply anxious”, আর এর ব্যাকরণগত গঠন (কলিগেশন) যেমন “anxious about + noun”, “anxious to + verb” দিয়ে দ্রুত আসল বাক্য বানানো যায়। “butterflies in my stomach”-এর মতো বাগধারা একই অনুভূতি ছবির মতো করে বলে।',
  beats: [
    ['One word alone is hard to use.', 'একা একটি শব্দ ব্যবহার করা কঠিন।'],
    ['Words have partners. We call them collocations.', 'শব্দের সঙ্গী থাকে। এদের বলে কলোকেশন।'],
    ['Words hang on small grammar words: colligations.', 'শব্দ ছোট ব্যাকরণ-শব্দে ঝুলে থাকে: কলিগেশন।'],
    ['Put them together, and you have a sentence.', 'একসাথে জুড়লেই একটি বাক্য।'],
    ['An idiom says the same feeling with a picture.', 'বাগধারা একই অনুভূতি ছবির মতো করে বলে।'],
    ['Learn the chunk, not just the word.', 'শুধু শব্দ নয়, পুরো শব্দগুচ্ছ শিখুন।']
  ],
  draw(s){
    const cx = 800, cy = 250;
    const links = G(s, {});
    const L = [['feel', 520, 130], ['deeply', 460, 250], ['a bit', 520, 370]], R = [['thoughts', 1080, 150], ['moment', 1100, 300]];
    L.concat(R).forEach(([t, x, y], i) => {
      N(links, 'path', { d: `M${cx} ${cy}L${x} ${y}`, stroke: '#6B3F80', 'stroke-width': 3, 'stroke-dasharray': '6 8', in: 1, delay: i * 120, at: '3-4:dim' });
      chip(s, x, y, t, { in: 1, delay: i * 120, size: 30, fill: '#fff', stroke: '#6B3F80', ink: '#6B3F80', cls: 'pop', at: '3-4:dim' });
    });
    /* grammar hooks */
    [['about + noun', 560, 520], ['to + verb', 800, 520], ['when + …', 1030, 520]].forEach(([t, x, y], i) => {
      N(s, 'path', { d: `M${cx} ${cy + 40}L${x} ${y - 30}`, stroke: '#B9924F', 'stroke-width': 3, in: 2, delay: i * 120, at: '3-4:dim' });
      chip(s, x, y, t, { in: 2, delay: i * 120, size: 30, fill: '#F0E6CD', stroke: '#B9924F', ink: '#6B5116', rx: 10, cls: 'rise', at: '3-4:dim' });
    });
    chip(s, cx, cy, 'anxious', { size: 40, fill: '#6B3F80', stroke: '#fff', ink: '#fff', w: 250, at: '0:lone 1:hub' });
    /* the sentence strip */
    const strip = G(s, { in: 3, out: 5 });
    const parts = [['I', '#fff'], ['feel', '#fff'], ['anxious', '#F3E8F8'], ['about', '#F0E6CD'], ['the exam.', '#fff']];
    let x = 360;
    parts.forEach(([t, f], i) => {
      const w = t.length * 22 + 50;
      chip(strip, x + w / 2, 60, t, { size: 34, fill: f, stroke: 'rgba(0,0,0,.25)', rx: 10, w, cls: i % 2 ? 'slide-r' : 'slide-l', delay: i * 140 });
      x += w + 14;
    });
    /* the idiom */
    const idm = G(s, { in: 4 });
    cloud(idm, 1370, 440, 150, '#FAF3D2');
    N(idm, 'text', { x: 1370, y: 440, 'font-size': 30, 'font-weight': 800, 'text-anchor': 'middle', fill: '#6F5B10', text: 'butterflies' });
    N(idm, 'text', { x: 1370, y: 478, 'font-size': 30, 'font-weight': 800, 'text-anchor': 'middle', fill: '#6F5B10', text: 'in my stomach' });
    N(idm, 'text', { x: 1290, y: 360, 'font-size': 44, text: '🦋', cls: 'bob' });
    N(idm, 'text', { x: 1440, y: 350, 'font-size': 36, text: '🦋', cls: 'bob', style: 'animation-delay:.8s' });
    N(idm, 'path', { d: 'M1225 430Q1060 400 930 290', fill: 'none', stroke: '#B9924F', 'stroke-width': 3, 'stroke-dasharray': '6 8' });
    N(s, 'rect', { x: 560, y: 175, width: 480, height: 150, rx: 75, fill: 'none', stroke: '#B9924F', 'stroke-width': 4, 'stroke-dasharray': '4 10', in: 5, cls: 'draw' });
  } },

/* 6 · your turn ------------------------------------------------------------ */
{ rail: 'Your turn', railBn: 'আপনার পালা', kicker: 'Today’s activity', kickerBn: 'আজকের কাজ',
  title: 'Seven small steps, one word', titleBn: 'সাতটি ছোট ধাপ, একটি শব্দ',
  body: 'Work in pairs. Each of you chooses your own feeling, then takes its word up the iceberg: Feel, Hear, Partners, Patterns, Say, Idioms, Share. Nothing is locked — go back to any step whenever you like. No phone? Use the printed worksheet; the listening plays on the projector.',
  bodyBn: 'জোড়ায় কাজ করুন। প্রত্যেকে নিজের অনুভূতি বেছে নিন, তারপর সেই শব্দটিকে হিমশৈলের উপরে নিয়ে যান: অনুভব, শুনুন, সঙ্গী শব্দ, গঠন, বলুন, বাগধারা, ভাগ করুন। কিছুই আটকানো নেই — যেকোনো ধাপে ফিরে যেতে পারেন। ফোন নেই? ছাপানো ওয়ার্কশিট ব্যবহার করুন; শোনার অংশ প্রজেক্টরে বাজবে।',
  beats: [
    ['Seven small steps. One word rises.', 'সাতটি ছোট ধাপ। একটি শব্দ উপরে ওঠে।'],
    ['Feel: name your feeling. Breathe.', 'অনুভব: অনুভূতির নাম দিন। শ্বাস নিন।'],
    ['Hear: listen to your word many times.', 'শুনুন: শব্দটি অনেকবার শুনুন।'],
    ['Partners and patterns: learn its chunks.', 'সঙ্গী শব্দ ও গঠন: শব্দগুচ্ছ শিখুন।'],
    ['Say it — then say it another way.', 'বলুন — তারপর অন্যভাবেও বলুন।'],
    ['Share it with the class. No names.', 'ক্লাসের সঙ্গে ভাগ করুন। কোনো নাম নয়।'],
    ['Work in pairs: dialogue-bd.com/emotions', 'জোড়ায় কাজ করুন: dialogue-bd.com/emotions']
  ],
  draw(s){
    const St = [['Feel', '❤️'], ['Hear', '👂'], ['Partners', '🔗'], ['Patterns', '🧩'], ['Say', '💬'], ['Idioms', '🖼️'], ['Share', '⭐']];
    const X = i => 140 + i * 196, Y = i => 520 - i * 64;
    N(s, 'path', { d: St.map((_, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(i)).join(''), fill: 'none', stroke: '#B9924F', 'stroke-width': 5, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round', cls: 'draw', in: 0 });
    const hi = ['1:hot', '2:hot', '3:hot', '3:hot', '4:hot', '4:hot', '5:hot'];
    St.forEach(([t, e], i) => {
      const g = G(s, { in: 0, delay: 200 + i * 140, cls: 'pop', at: hi[i].replace(':', '-' + hi[i][0] + ':') });
      N(g, 'circle', { cx: X(i), cy: Y(i), r: 58, fill: '#fff', stroke: '#134219', 'stroke-width': 4, cls: 'st-ring' });
      N(g, 'text', { x: X(i), y: Y(i) + 16, 'font-size': 46, 'text-anchor': 'middle', text: e });
      N(g, 'text', { x: X(i), y: Y(i) + 98, 'font-size': 28, 'font-weight': 800, 'text-anchor': 'middle', fill: '#134219', text: t });
    });
    /* the pair and the phone */
    const pr = G(s, { in: 6 });
    N(pr, 'rect', { x: 150, y: 40, width: 700, height: 150, rx: 24, fill: '#F0E6CD' });
    person(pr, 250, 90, 150, '#8A6A3A', 'smile');
    person(pr, 400, 90, 150, '#6F8F62', 'smile');
    N(pr, 'rect', { x: 300, y: 115, width: 50, height: 80, rx: 8, fill: '#1D211C' });
    N(pr, 'rect', { x: 306, y: 123, width: 38, height: 60, rx: 4, fill: '#DCEBF2' });
    N(pr, 'text', { x: 490, y: 108, 'font-size': 32, 'font-weight': 800, fill: '#134219', text: 'dialogue-bd.com' });
    N(pr, 'text', { x: 490, y: 152, 'font-size': 32, 'font-weight': 800, fill: '#6B5116', text: '/emotions' });
  } }
];

/* ============================================================ the engine */
const Lesson = {
  panels: LESSON, i: 0, beat: 0, auto: false, timer: 0, svg: null, reading: false,
  jump(i){ this.i = Math.max(0, Math.min(LESSON.length - 1, i)); this.beat = 0; },
  toEnd(){ this.i = LESSON.length - 1; this.beat = LESSON[this.i].beats.length - 1; },
  atEnd(){ return this.beat >= LESSON[this.i].beats.length - 1; },
  mount(){
    const P = LESSON[this.i];
    const p = el('div', 'panel');
    const head = el('div', 'l-head');
    const k = el('p', 'kicker', P.kicker); bn(k, P.kickerBn, true); head.appendChild(k);
    head.appendChild(txt('h2', 'h-title', P.title, P.titleBn));
    p.appendChild(head);
    const card = el('div', 'l-card');
    const bar = el('div', 'autobar'); bar.appendChild(el('i')); card.appendChild(bar);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${ZW} ${ZH}`); svg.setAttribute('class', 'l-svg z instant');
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', P.title);
    P.draw(svg);
    svg.onclick = () => go(1);
    card.appendChild(svg);
    const cap = el('div', 'l-cap'); cap.setAttribute('aria-live', 'polite');
    card.appendChild(cap);
    const tools = el('div', 'l-tools');
    const auto = el('button', 'mini'); auto.type = 'button'; auto.setAttribute('aria-pressed', String(this.auto));
    auto.appendChild(icon(this.auto ? 'pause' : 'play')); auto.appendChild(el('span', null, this.auto ? 'Pause' : 'Autoplay'));
    auto.onclick = () => this.toggleAuto();
    const again = el('button', 'mini'); again.type = 'button'; again.appendChild(icon('replay')); again.appendChild(el('span', null, 'Play again'));
    again.onclick = () => { this.beat = 0; this.paint(true); paintFoot(); };
    const read = el('button', 'mini'); read.type = 'button'; read.appendChild(icon('book')); read.appendChild(el('span', null, 'Read it'));
    const skip = el('button', 'mini gold'); skip.type = 'button'; skip.appendChild(icon('arrow')); skip.appendChild(el('span', null, 'Skip to the activity'));
    skip.onclick = () => startActivity();
    tools.appendChild(auto); tools.appendChild(again); tools.appendChild(read); tools.appendChild(skip);
    card.appendChild(tools);
    const body = el('div', 'l-read'); body.hidden = !this.reading;
    body.appendChild(el('p', null, P.body)); const b = el('p', 'bn', P.bodyBn); b.lang = 'bn'; body.appendChild(b);
    read.onclick = () => { this.reading = !this.reading; body.hidden = !this.reading; };
    card.appendChild(body);
    p.appendChild(card);
    $('#wrap').appendChild(p);
    /* strokes that draw need their own length */
    svg.querySelectorAll('.draw').forEach(n => { try { n.style.setProperty('--len', Math.ceil(n.getTotalLength())); } catch (e) {} });
    this.svg = svg; this.cap = cap; this.bar = bar.firstChild; this.autoBtn = auto;
    this.paint(true);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('instant')));
    p.cleanup = () => { clearTimeout(this.timer); this.svg = null; };
    if (this.auto) this.schedule();
    return p;
  },
  paint(instant){
    const s = this.svg; if (!s) return;
    const P = LESSON[this.i], k = this.beat;
    if (instant) s.classList.add('instant');
    s.querySelectorAll('[data-in]').forEach(n => n.classList.toggle('on', k >= +n.dataset.in));
    s.querySelectorAll('[data-out]').forEach(n => n.classList.toggle('gone', k >= +n.dataset.out));
    s.querySelectorAll('[data-now]').forEach(n => n.classList.toggle('now', n.dataset.now.split(' ').map(Number).includes(k)));
    s.querySelectorAll('[data-at]').forEach(n => {
      const specs = n.dataset.at.split(' ');
      const all = new Set(specs.map(x => x.split(':')[1]));
      all.forEach(c => n.classList.remove(c));
      specs.forEach(sp => {
        const [range, cls] = sp.split(':'), [a, b] = range.split('-').map(Number);
        if (k >= a && (isNaN(b) || k <= b)) n.classList.add(cls);
      });
    });
    if (P.onBeat) P.onBeat(k, s);
    const [en, bnT] = P.beats[k];
    this.cap.innerHTML = '';
    this.cap.appendChild(el('div', 'l-cap-en', en));
    const b = el('div', 'l-cap-bn', bnT); b.lang = 'bn'; this.cap.appendChild(b);
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove('instant')));
  },
  next(){
    clearTimeout(this.timer);
    if (!this.atEnd()) { this.beat++; this.paint(); paintFoot(); if (this.auto) this.schedule(); return true; }
    if (this.i < LESSON.length - 1) { this.i++; this.beat = 0; render(); return true; }
    this.setAuto(false);
    return false;
  },
  back(){
    clearTimeout(this.timer);
    if (this.beat > 0) { this.beat--; this.paint(); paintFoot(); return true; }
    if (this.i > 0) { this.i--; this.beat = LESSON[this.i].beats.length - 1; render(); return true; }
    return false;
  },
  /* a slow reader's pace: a base, plus time per English and Bangla word */
  dur(){
    const [en, b] = LESSON[this.i].beats[this.beat];
    return 3200 + en.split(' ').length * 420 + (S.lang === 'bn' ? b.split(' ').length * 320 : 0);
  },
  schedule(){
    clearTimeout(this.timer);
    if (!this.auto || !this.svg) return;
    if (this.i === LESSON.length - 1 && this.atEnd()) { this.setAuto(false); return; }
    const d = this.dur(), bar = this.bar;
    bar.style.transition = 'none'; bar.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `width ${d}ms linear`; bar.style.width = '100%'; }));
    this.timer = setTimeout(() => this.next(), d);
  },
  setAuto(on){
    this.auto = on;
    if (this.autoBtn) { this.autoBtn.setAttribute('aria-pressed', String(on)); this.autoBtn.replaceChildren(icon(on ? 'pause' : 'play'), el('span', null, on ? 'Pause' : 'Autoplay')); }
    if (!on) { clearTimeout(this.timer); if (this.bar) { this.bar.style.transition = 'none'; this.bar.style.width = '0'; } }
    else this.schedule();
  },
  toggleAuto(){ this.setAuto(!this.auto); }
};
