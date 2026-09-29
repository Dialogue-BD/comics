/* ===========================================================================
   How Are You Feeling? — the projected lesson
   ---------------------------------------------------------------------------
   Six illustrated pictures that play in beats, built the way Culture
   Circles' lesson is: the teacher talks, → (or a tap on the picture) moves
   the picture on one beat, and only after its last beat does → turn the
   panel. ← walks back beat by beat. A is autoplay at a slow reader's pace.

   Every scene draws everything it will ever show at build time and tags
   each piece with when it matters:
     data-in="k"      hidden until beat k, then shown (.draw strokes draw)
     data-out="k"     gone from beat k onward
     data-at="k:cls"  carries cls from beat k ("k-m:cls" stops after m)
     data-now="k j"   pulses on those beats only
   so every state is a pure function of the beat, and stepping back is the
   same transitions running in reverse.

   The people, the room, the iceberg and the weather come from art.js, so
   the projector and the phones share one cast. The canvas is 1600 x 620 —
   the shape of what a 1080p projector has left once the header and caption
   have had theirs — and nothing is set smaller than 21 units.
   =========================================================================== */
'use strict';

const ZW = 1600, ZH = 620;
/* a label, with its Bangla line underneath when Bangla is on */
function T(p, x, y, en, bnText, a = {}){
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls, delay: a.delay });
  const size = a.size || 30;
  N(g, 'text', { x, y, 'font-size': size, 'font-weight': a.weight || 800, fill: a.fill || '#1D211C', 'text-anchor': a.anchor || 'middle',
    'font-style': a.italic ? 'italic' : null, 'letter-spacing': a.ls || null, text: en });
  if (bnText) N(g, 'text', { x, y: y + size * 1.05, 'font-size': Math.max(22, size * .74), fill: a.bnFill || '#5F6A5C', 'text-anchor': a.anchor || 'middle', cls: 't-bn', text: bnText });
  return g;
}
/* a pill with a lip under it, the same tactile language as the buttons */
function chip(p, x, y, text, a = {}){
  const size = a.size || 30, w = a.w || Math.max(90, text.length * size * .56 + 48), h = size * 1.8;
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls, delay: a.delay, now: a.now });
  const rx = a.rx != null ? a.rx : h / 2;
  N(g, 'rect', { x: x - w / 2, y: y - h / 2 + 5, width: w, height: h, rx, fill: '#103D21', opacity: .14 });
  N(g, 'rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx, fill: a.fill || '#fff', stroke: a.stroke === 'none' ? null : (a.stroke || 'rgba(16,61,33,.25)'), 'stroke-width': a.sw || 2 });
  N(g, 'text', { x, y: y + size * .36, 'font-size': size, 'font-weight': a.weight || 900, fill: a.ink || '#1D211C', 'text-anchor': 'middle', text });
  return g;
}
function bubble(p, x, y, w, h, tx, ty, text, a = {}){
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls });
  if (text) { const need = text.length * (a.size || 30) * .56 + 48; if (need > w) { x -= (need - w) / 2; w = need; } }
  x = Math.max(8, Math.min(ZW - 8 - w, x));
  const d = `M${x + 22} ${y}H${x + w - 22}Q${x + w} ${y} ${x + w} ${y + 22}V${y + h - 22}Q${x + w} ${y + h} ${x + w - 22} ${y + h}H${Math.min(x + w - 30, Math.max(x + 60, tx + 40))}L${tx} ${ty}L${Math.min(x + w - 60, Math.max(x + 30, tx))} ${y + h}H${x + 22}Q${x} ${y + h} ${x} ${y + h - 22}V${y + 22}Q${x} ${y} ${x + 22} ${y}Z`;
  N(g, 'path', { d, fill: a.fill || '#fff', stroke: a.stroke || '#1D211C', 'stroke-width': 3, 'stroke-linejoin': 'round', filter: ART.soft(p) });
  if (text) N(g, 'text', { x: x + w / 2, y: y + h / 2 + (a.size || 30) * .36, 'font-size': a.size || 30, 'font-weight': 900, fill: a.ink || '#1D211C', 'text-anchor': 'middle', text });
  return g;
}
/* a word tile that travels a path, forever, while its group is shown */
function flier(p, path, text, begin, dur, fill, bounce){
  const g = G(p, {});
  const w = text.length * 17 + 36;
  N(g, 'rect', { x: -w / 2, y: -21, width: w, height: 46, rx: 12, fill: '#103D21', opacity: .16 });
  N(g, 'rect', { x: -w / 2, y: -25, width: w, height: 46, rx: 12, fill, stroke: 'rgba(16,61,33,.18)', 'stroke-width': 2 });
  N(g, 'text', { x: 0, y: 6, 'font-size': 26, 'font-weight': 900, 'text-anchor': 'middle', fill: '#1D211C', text });
  N(g, 'animateMotion', { path, dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite', calcMode: 'linear' });
  N(g, 'animate', { attributeName: 'opacity', values: bounce ? '0;1;1;0;0' : '0;1;1;0', keyTimes: bounce ? '0;.08;.55;.7;1' : '0;.1;.85;1', dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite' });
  g.setAttribute('opacity', 0);
  return g;
}
/* a quiet stage for the panels that have no room behind them */
function backdrop(s){
  N(s, 'rect', { x: 0, y: 0, width: ZW, height: ZH, fill: ART.grad(s, [['#FFFEF9'], ['#F6F0E0']]) });
  N(s, 'ellipse', { cx: ZW / 2, cy: ZH + 60, rx: ZW * .62, ry: 150, fill: '#EDE3CB', opacity: .6 });
}
const FAM = { Fear: ['#c993dd', '#6B3F80'], Anger: ['#ee806b', '#9A3522'], Surprise: ['#edae53', '#87561A'], Happy: ['#e9cf5f', '#6F5B10'], Disgust: ['#73c989', '#2F6E3E'], Sad: ['#70bee0', '#22607C'] };
/* a full ring of equal sectors: [label, emoji, colour, cls, at] */
function ring(p, cx, cy, r0, r1, items, a = {}){
  const g = G(p, a), n = items.length;
  items.forEach((it, i) => {
    const s = (i / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n, e = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n;
    const P = (r, t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)];
    const [a1, b1] = P(r1, s), [a2, b2] = P(r1, e), [a3, b3] = P(r0, e), [a4, b4] = P(r0, s);
    const lg = e - s > Math.PI ? 1 : 0;
    const sg = G(g, { cls: it[3] || null, at: it[4] || null });
    N(sg, 'path', { d: `M${a1} ${b1}A${r1} ${r1} 0 ${lg} 1 ${a2} ${b2}L${a3} ${b3}A${r0} ${r0} 0 ${lg} 0 ${a4} ${b4}Z`,
      fill: ART.grad(p, [[ART.shade(it[2], .35)], [it[2]]], { radial: true, cx: '50%', cy: '50%', r: '60%' }), stroke: '#fff', 'stroke-width': 6 });
    const m = (s + e) / 2, [lx, ly] = P((r0 + r1) / 2, m);
    N(sg, 'circle', { cx: lx, cy: ly - 16, r: 30, fill: '#fff', opacity: .85 });
    N(sg, 'text', { x: lx, y: ly - 3, 'font-size': 38, 'text-anchor': 'middle', text: it[1] });
    N(sg, 'text', { x: lx, y: ly + 42, 'font-size': 26, 'font-weight': 900, 'text-anchor': 'middle', fill: '#1D211C', text: it[0] });
  });
  return g;
}
function hubDisc(p, cx, cy, r, fill){
  N(p, 'circle', { cx, cy, r, fill, stroke: '#fff', 'stroke-width': 7, filter: ART.soft(p) });
}
const orbFill = (s, a, b) => ART.grad(s, [[a], [b]], { radial: true, cx: '38%', cy: '32%', r: '70%' });
/* one of the page's stroke icons, drawn inside a scene */
function glyph(p, name, x, y, size, color){
  const g = G(p, { transform: `translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})` });
  N(g, 'path', { d: ICONS[name] || '', fill: 'none', stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  return g;
}
/* grammar bricks in a row: [[text, head|key|slot], …]; x is the left edge */
function brick(p, x, y, parts, a = {}){
  const g = G(p, { in: a.in, out: a.out, at: a.at, cls: a.cls, delay: a.delay });
  let at = x;
  parts.forEach(([t, kind], i) => {
    const w = t.length * 17 + 40, h = 58;
    const fill = kind === 'head' ? ART.grad(p, [['#8E5AA6'], ['#6B3F80']]) : kind === 'key' ? ART.grad(p, [['#F6E7C2'], ['#E9CF8E']]) : '#fff';
    const rx = i === 0 ? 14 : 4;
    N(g, 'rect', { x: at, y: y - h / 2 + 5, width: w, height: h, rx, fill: '#103D21', opacity: .14 });
    N(g, 'rect', { x: at, y: y - h / 2, width: w, height: h, rx, fill, stroke: kind === 'slot' ? 'rgba(16,61,33,.45)' : 'none', 'stroke-width': 3, 'stroke-dasharray': kind === 'slot' ? '6 6' : null });
    N(g, 'text', { x: at + w / 2, y: y + 10, 'font-size': 28, 'font-weight': 900, 'text-anchor': 'middle', fill: kind === 'head' ? '#fff' : kind === 'key' ? '#6B5116' : '#5F6A5C', 'font-style': kind === 'slot' ? 'italic' : null, text: t });
    at += w - 2;
  });
  return g;
}

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
  cam: [[1, 800, 310], [1.04, 780, 300], [1.16, 1180, 300], [1.06, 960, 300], [1.1, 860, 360], [1.04, 1060, 310], [1, 800, 310]],
  draw(s){
    ART.room(s, ZW, ZH, { floor: 548, boardX: 60, boardW: 430, window: false, plantX: 1548, clockX: 700, clockY: 70 });
    const T0 = [300, 250], L = [1150, 250];
    /* the learner's mind glows while words are getting in */
    N(s, 'circle', { cx: L[0], cy: L[1], r: 160, fill: ART.grad(s, [['#FFE7A6', 0, .95], ['#FFE7A6', .55, .45], ['#FFE7A6', 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }), in: 1, at: '2-4:dim' });
    ART.figure(s, T0[0], T0[1], 380, { who: 'teacher', face: 'smile', pose: 'present', look: 1 });
    [['smile', null, 2, null], ['worry', 2, 5, 'hug'], ['calm', 5, 6, 'heart'], ['smile', 6, null, null]].forEach(f =>
      ART.figure(s, L[0], L[1], 380, { who: 'learner', face: f[0], in: f[1], out: f[2], pose: f[3], look: -1 }));
    /* the desk she sits at */
    N(s, 'path', { d: 'M930 478H1370L1392 506H908Z', fill: ART.grad(s, [['#DDB889'], ['#C0925E']]) });
    N(s, 'rect', { x: 908, y: 506, width: 484, height: 120, fill: ART.grad(s, [['#B98452'], ['#9C6B3F']]) });
    N(s, 'path', { d: 'M908 506H1392', stroke: '#E6C79C', 'stroke-width': 3 });
    N(s, 'rect', { x: 980, y: 458, width: 130, height: 22, rx: 4, fill: '#3F7FA6' });
    N(s, 'rect', { x: 992, y: 442, width: 110, height: 18, rx: 4, fill: '#E1B84B' });
    N(s, 'rect', { x: 1250, y: 462, width: 90, height: 12, rx: 3, fill: '#fff', transform: 'rotate(-6 1295 468)' });
    /* the stream of English */
    const path = 'M390 290 Q720 10 1060 215';
    N(s, 'path', { d: path, fill: 'none', stroke: 'rgba(16,61,33,.22)', 'stroke-width': 5, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round', cls: 'flow' });
    const words = ['feel', 'happy', 'deeply', 'about', 'nervous', 'proud'], fills = ['#FBF5D6', '#E4F4E8', '#E1F1F9', '#F0E6CD', '#F4EAF9', '#FCE9E4'];
    const inG = G(s, { in: 1, at: '2-5:gone' });
    words.forEach((w, i) => flier(inG, path, w, i * .5, 3, fills[i]));
    const bounce = 'M390 290 Q720 10 850 150 Q840 250 740 330';
    const outG = G(s, { in: 3, out: 5 });
    words.forEach((w, i) => flier(outG, bounce, w, i * .5, 3, fills[i], true));
    /* a classmate laughs and points */
    ART.figure(s, 1488, 330, 262, { who: 'friend', face: 'laugh', pose: 'laugh', in: 2, out: 5, cls: 'slide-r' });
    bubble(s, 1380, 96, 190, 68, 1460, 225, 'HA HA!', { in: 2, out: 5, size: 32, fill: '#FCE9E4', stroke: '#9A3522', ink: '#9A3522', cls: 'pop' });
    ART.cloud(s, L[0], 64, 72, '#6E7F89', { in: 2, out: 5, cls: 'pop' });
    ART.bolt(s, L[0] - 8, 92, 60, { in: 2, out: 5 });
    /* the filter: a glowing screen that rises between them */
    /* the filter: a roller shutter that rolls down between them */
    const box = G(s, { in: 3, out: 6 });
    N(box, 'rect', { x: 848, y: 62, width: 128, height: 40, rx: 12, fill: ART.grad(s, [['#8E5A45'], ['#6E3F2E']]), filter: ART.soft(s) });
    N(box, 'rect', { x: 856, y: 68, width: 112, height: 8, rx: 4, fill: '#fff', opacity: .18 });
    const wall = G(s, { cls: 'blind', at: '3-5:up' });
    N(wall, 'rect', { x: 862, y: 100, width: 100, height: 372, fill: ART.grad(s, [['#E4906F'], ['#B0563A']]) });
    for (let y = 100; y < 468; y += 23) {
      N(wall, 'rect', { x: 862, y, width: 100, height: 11, fill: '#fff', opacity: .12 });
      N(wall, 'path', { d: `M862 ${y + 22}H962`, stroke: '#7E3522', 'stroke-width': 2, opacity: .45 });
    }
    N(wall, 'rect', { x: 856, y: 462, width: 112, height: 16, rx: 6, fill: '#6E3F2E' });
    N(wall, 'rect', { x: 900, y: 470, width: 24, height: 14, rx: 5, fill: '#4A2A1E' });
    const lab = G(s, { in: 4, out: 6, cls: 'pop' });
    N(lab, 'rect', { x: 520, y: 488, width: 380, height: 66, rx: 33, fill: '#fff', stroke: '#B0563A', 'stroke-width': 3, filter: ART.soft(s) });
    N(lab, 'text', { x: 710, y: 532, 'font-size': 30, 'font-weight': 800, fill: '#8E402B', 'text-anchor': 'middle', 'letter-spacing': 3, text: 'AFFECTIVE FILTER' });
    N(lab, 'path', { d: 'M900 520Q908 510 912 482', fill: 'none', stroke: '#B0563A', 'stroke-width': 3 });
    /* naming it, breathing */
    bubble(s, 1230, 30, 340, 74, 1215, 160, 'I feel embarrassed.', { in: 5, out: 6, size: 28, fill: '#F4EAF9', stroke: '#6B3F80', ink: '#6B3F80', cls: 'pop' });
    [0, 1, 2].forEach(k => N(s, 'circle', { cx: L[0], cy: L[1] + 30, r: 170 + k * 40, fill: 'none', stroke: '#1F5C7A', 'stroke-width': 4 - k, opacity: .5 - k * .12, cls: 'breathe', style: `animation-delay:${k * .4}s`, in: 5, out: 6 }));
    T(s, 700, 596, 'breathe in… breathe out', null, { in: 5, out: 6, size: 28, fill: '#1F5C7A', italic: true, weight: 700 });
    ART.spark(s, 1000, 150, 16, '#F2C443', { in: 6, cls: 'pop' });
    ART.spark(s, 1290, 110, 12, '#F2C443', { in: 6, cls: 'pop' });
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
  cam: [[1.12, 600, 300], [1.02, 900, 312], [1.05, 1000, 312], [1.08, 1040, 312], [1.02, 780, 300], [1, 800, 310]],
  draw(s){
    ART.studio(s, ZW, ZH, { tints: ['#C9D6DD', '#F3D9A4'] });
    /* the sky behind him turns from grey to warm once the storm has a name */
    N(s, 'circle', { cx: 300, cy: 240, r: 470, fill: ART.grad(s, [['#AEBEC7', 0, .8], ['#AEBEC7', .6, .35], ['#AEBEC7', 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }), out: 5 });
    N(s, 'circle', { cx: 300, cy: 240, r: 470, fill: ART.grad(s, [['#FBE3A0', 0, .8], ['#FBE3A0', .6, .35], ['#FBE3A0', 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }), in: 5 });
    N(s, 'ellipse', { cx: 300, cy: 598, rx: 260, ry: 22, fill: '#103D21', opacity: .06 });
    [['worry', null, 1, 'hug'], ['flat', 1, 4, 'chin'], ['flat', 4, 5, 'heart'], ['smile', 5, null, 'wave']].forEach(f =>
      ART.figure(s, 300, 290, 390, { who: 'boy', face: f[0], in: f[1], out: f[2], pose: f[3], look: 1 }));
    const storm = G(s, { cls: 'mover stormy', at: '5:shrink' });
    ART.cloud(storm, 300, 70, 118, '#5E6E78');
    ART.bolt(storm, 288, 104, 92);
    [230, 300, 370].forEach((x, i) => N(storm, 'path', { d: `M${x} 140l-12 34`, stroke: '#4A90B8', 'stroke-width': 6, 'stroke-linecap': 'round', cls: 'rain', style: `animation-delay:${i * .25}s`, out: 5 }));
    N(s, 'text', { x: 300, y: 88, 'font-size': 70, 'font-weight': 900, fill: '#fff', 'text-anchor': 'middle', text: '?', out: 4 });
    const sun = G(s, { in: 5, cls: 'pop' });
    N(sun, 'circle', { cx: 450, cy: 80, r: 74, fill: '#FBE3A0', opacity: .35 });
    N(sun, 'circle', { cx: 450, cy: 80, r: 46, fill: ART.grad(s, [['#FFE9A3'], ['#F2B53A']], { radial: true }) });
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(k => { const a = k * Math.PI / 4; N(sun, 'path', { d: `M${450 + 58 * Math.cos(a)} ${80 + 58 * Math.sin(a)}L${450 + 70 * Math.cos(a)} ${80 + 70 * Math.sin(a)}`, stroke: '#F2B53A', 'stroke-width': 6, 'stroke-linecap': 'round' }); });
    /* before it has a name: a tangle */
    N(s, 'path', { d: 'M880 300Q883 145 813 195Q747 229 894 260Q696 172 704 280Q687 273 851 398Q908 391 928 434Q1081 249 1061 164Q857 251 745 185Q785 224 759 324Q723 176 898 169Q879 244 949 278Q976 307 862 240Q829 371 783 322Q990 188 967 236Q825 304 849 377Q840 381 705 350Q911 320 1023 244Q1048 372 910 287Q785 366 870 349Q980 347 936 448Q772 390 837 351Q689 332 754 185Q720 294 739 224Q742 347 721 285Q808 327 1001 409Q1024 328 826 415Q728 314 757 220', fill: 'none', stroke: '#5E6E78', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .8, cls: 'draw', in: 0, out: 1 });
    const cx = 1040, cy = 312;
    const z1 = G(s, { in: 1, at: '2:gone', cls: 'pop' });
    ring(z1, cx, cy, 112, 292, EMO.wheel.map(f => [f.name, EMO.emoji[f.name], FAM[f.name][0]]));
    hubDisc(z1, cx, cy, 108, '#fff');
    N(z1, 'text', { x: cx, y: cy - 6, 'font-size': 30, 'font-weight': 700, 'text-anchor': 'middle', fill: '#5F6A5C', text: 'How do' });
    N(z1, 'text', { x: cx, y: cy + 32, 'font-size': 34, 'font-weight': 900, 'text-anchor': 'middle', fill: '#134219', text: 'you feel?' });
    const fear = EMO.wheel.find(f => f.name === 'Fear');
    const z2 = G(s, { in: 2, at: '3:gone', cls: 'pop' });
    ring(z2, cx, cy, 120, 292, fear.children.map(c => [c.name, EMO.emoji[c.name], '#E6D2EF', null, c.name === 'Anxious' ? null : '2:dim']));
    hubDisc(z2, cx, cy, 116, FAM.Fear[0]);
    N(z2, 'text', { x: cx, y: cy - 2, 'font-size': 54, 'text-anchor': 'middle', text: EMO.emoji.Fear });
    N(z2, 'text', { x: cx, y: cy + 46, 'font-size': 34, 'font-weight': 900, 'text-anchor': 'middle', fill: '#3E2150', text: 'Fear' });
    const z3 = G(s, { in: 3, cls: 'pop' });
    ring(z3, cx, cy, 120, 292, [['Overwhelmed', EMO.emoji.Overwhelmed, '#F4EAF9'], ['Worried', EMO.emoji.Worried, '#F4EAF9', null, '4:dim']]);
    hubDisc(z3, cx, cy, 116, '#D9BDE7');
    N(z3, 'text', { x: cx, y: cy - 2, 'font-size': 54, 'text-anchor': 'middle', text: EMO.emoji.Anxious });
    N(z3, 'text', { x: cx, y: cy + 46, 'font-size': 34, 'font-weight': 900, 'text-anchor': 'middle', fill: '#3E2150', text: 'Anxious' });
    chip(s, 1470, 90, 'Fear', { in: 2, fill: FAM.Fear[0], stroke: 'none', size: 28, w: 160 });
    chip(s, 1470, 176, 'Anxious', { in: 3, fill: '#D9BDE7', stroke: 'none', size: 28, w: 200 });
    chip(s, 1470, 262, 'Overwhelmed', { in: 4, fill: '#6B3F80', stroke: 'none', ink: '#fff', size: 28, w: 250 });
    N(s, 'path', { d: 'M1470 116v34', stroke: '#6B3F80', 'stroke-width': 4, 'stroke-linecap': 'round', in: 3 });
    N(s, 'path', { d: 'M1470 202v34', stroke: '#6B3F80', 'stroke-width': 4, 'stroke-linecap': 'round', in: 4 });
    bubble(s, 520, 150, 340, 76, 440, 250, 'I feel overwhelmed.', { in: 4, size: 30, fill: '#F4EAF9', stroke: '#6B3F80', ink: '#6B3F80', cls: 'pop' });
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
  cam: [[1.1, 820, 300], [1, 800, 310], [1.12, 300, 310], [1.12, 1300, 310], [1.12, 800, 310], [1.04, 800, 300]],
  draw(s){
    ART.studio(s, ZW, ZH, { tints: ['#F3D9A4', '#CFE3D6'] });
    const X = [290, 800, 1310], y = 250;
    /* three pools of light on the floor */
    [['#F2A58E', 0], ['#A9D39A', 1], ['#9CC9E0', 2]].forEach(([c, i]) => N(s, 'ellipse', { cx: X[i], cy: 585, rx: 250, ry: 46, fill: ART.grad(s, [[c, 0, .75], [c, 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }), in: 1 }));
    /* the moment, in the classroom */
    const m = G(s, { at: '1:gone' });
    ART.room(m, ZW, ZH, { floor: 560, boardX: 1080, boardW: 440, window: false, plant: false, clockX: 180, clockY: 90 });
    N(m, 'ellipse', { cx: 820, cy: 600, rx: 420, ry: 20, fill: '#103D21', opacity: .06 });
    ART.figure(m, 650, 250, 390, { who: 'learner', face: 'worry', pose: 'present', look: -1 });
    bubble(m, 390, 36, 330, 84, 590, 150, 'vege-TA-ble?', { size: 34 });
    ART.figure(m, 1020, 300, 320, { who: 'friend', face: 'laugh', pose: 'laugh', look: -1 });
    bubble(m, 1110, 70, 220, 74, 1060, 210, 'HA HA!', { size: 34, fill: '#FCE9E4', stroke: '#9A3522', ink: '#9A3522' });
    /* too close: the feeling swallows her */
    const c1 = G(s, { in: 1, at: '5:dim' });
    N(c1, 'circle', { cx: X[0], cy: y + 70, r: 225, fill: orbFill(s, '#F6B6A3', '#D9674B'), in: 2, cls: 'pop', opacity: .92 });
    [0, 1].forEach(k => N(c1, 'path', { d: `M${X[0] - 160 + k * 40} ${y + 30 + k * 60}q60 -60 120 0t120 0`, fill: 'none', stroke: '#fff', 'stroke-width': 5, opacity: .45, in: 2, 'stroke-linecap': 'round' }));
    ART.figure(c1, X[0], y, 300, { who: 'learner', face: 'worry', pose: 'hug' });
    T(c1, X[0], 574, 'Too close', 'খুব কাছে', { size: 34, fill: '#9A3522', in: 2 });
    bubble(c1, X[0] - 180, 40, 360, 70, X[0] - 20, 130, 'I’m terrible at English!', { in: 2, size: 26, fill: '#FCE9E4', stroke: '#9A3522', ink: '#9A3522', cls: 'pop' });
    /* room to choose (shown last) */
    const c2 = G(s, { in: 1 });
    [['flat', null, 4, null], ['calm', 4, 5, 'heart'], ['smile', 5, null, 'wave']].forEach(f => ART.figure(c2, X[1] - 60, y, 300, { who: 'learner', face: f[0], in: f[1], out: f[2], pose: f[3] }));
    N(c2, 'path', { d: `M${X[1] + 70} ${y + 150}H${X[1] + 108}`, stroke: '#5E8A52', 'stroke-width': 5, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round', in: 4 });
    N(c2, 'circle', { cx: X[1] + 150, cy: y + 150, r: 42, fill: orbFill(s, '#E9F4DE', '#8DBE7C'), in: 4, cls: 'pop', filter: ART.soft(s) });
    N(c2, 'path', { d: `M${X[1] + 140} ${y + 134}v32M${X[1] + 160} ${y + 134}v32`, stroke: '#103D21', 'stroke-width': 9, 'stroke-linecap': 'round', in: 4 });
    T(c2, X[1], 574, 'Room to choose', 'বেছে নেওয়ার সুযোগ', { size: 34, fill: '#2C5A24', in: 4 });
    bubble(c2, X[1] - 250, 40, 500, 76, X[1] - 60, 130, 'I’m embarrassed. Can I try again?', { in: 5, size: 26, fill: '#E3EDD9', stroke: '#2C5A24', ink: '#103D21', cls: 'pop' });
    /* too far: a wall between her and it */
    const c3 = G(s, { in: 1, at: '5:dim' });
    ART.figure(c3, X[2] - 40, y, 300, { who: 'learner', face: 'flat', pose: 'shrug' });
    const wall = G(c3, { in: 3, cls: 'rise' });
    N(wall, 'rect', { x: X[2] + 100, y: 110, width: 70, height: 360, rx: 8, fill: ART.grad(s, [['#6E9BB3'], ['#2F6A88']]) });
    for (let yy = 140; yy < 470; yy += 34) N(wall, 'path', { d: `M${X[2] + 100} ${yy}h70M${X[2] + 135 + ((yy / 34) % 2 ? 0 : -18)} ${yy - 34}v34`, stroke: '#DCEBF2', 'stroke-width': 3, opacity: .55 });
    N(c3, 'circle', { cx: X[2] + 225, cy: y + 150, r: 30, fill: orbFill(s, '#E1F1F9', '#70BEE0'), in: 3 });
    T(c3, X[2], 574, 'Too far', 'অনেক দূরে', { size: 34, fill: '#22607C', in: 3 });
    bubble(c3, X[2] - 220, 40, 280, 70, X[2] - 90, 130, 'I don’t care.', { in: 3, size: 28, fill: '#E1F1F9', stroke: '#1F5C7A', ink: '#123F57', cls: 'pop' });
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
    const WL = 232, BX = 1010;
    ART.iceberg(s, BX, WL, 250, 168, { x0: 0, x1: ZW, top: 0, bottom: ZH, sunX: 760 });
    /* the six rungs */
    const Y = [548, 456, 352, 196, 142, 88];
    const R = [['Hear it', 'শুনি', 'ear'], ['Partners', 'সঙ্গী শব্দ', 'link'], ['Pattern', 'গঠন', 'puzzle'], ['Say it', 'বলি', 'speech'], ['Idioms', 'বাগধারা', 'image'], ['Mine!', 'আমার!', 'check']];
    R.forEach((r, i) => {
      const g = G(s, { in: i + 1, cls: 'slide-l' });
      N(g, 'path', { d: `M300 ${Y[i]}H${BX - 180}`, stroke: i < 3 ? '#fff' : '#1F5C7A', 'stroke-opacity': .7, 'stroke-width': 2.5, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
      N(g, 'rect', { x: 36, y: Y[i] - 29, width: 256, height: 58, rx: 29, fill: '#fff', filter: ART.soft(s) });
      N(g, 'circle', { cx: 66, cy: Y[i], r: 21, fill: i < 3 ? '#1F5C7A' : '#134219' });
      glyph(g, r[2], 66, Y[i], 24, '#fff');
      N(g, 'text', { x: 100, y: Y[i] + 11, 'font-size': 30, 'font-weight': 800, fill: i < 3 ? '#123F57' : '#134219', text: r[0] });
      N(g, 'text', { x: 200, y: Y[i] + 10, 'font-size': 22, fill: '#5F6A5C', cls: 't-bn', text: r[1] });
    });
    /* what arrives at each rung, to the right of the ice */
    const E = G(s, {});
    [0, 1, 2].forEach(k => N(E, 'path', { d: `M${1290 + k * 26} ${548 - 30 - k * 8}q22 ${30 + k * 8} 0 ${60 + k * 16}`, fill: 'none', stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round', in: 1, out: 7, now: '1', style: `animation-delay:${k * .2}s` }));
    chip(E, 1400, 456, 'feel anxious', { in: 2, out: 7, size: 28, fill: '#fff', stroke: 'none', ink: '#6B3F80', cls: 'pop' });
    brick(E, 1270, 352, [['about', 'key'], ['+ noun', 'slot']], { in: 3, out: 7 });
    bubble(E, 1240, 128, 340, 64, 1215, 190, 'I feel anxious about my exam.', { in: 4, out: 7, size: 21, fill: '#fff', stroke: '#134219', ink: '#134219', cls: 'pop' });
    const bf = G(E, { in: 5, out: 7, cls: 'pop' });
    ART.butterfly(bf, 1222, 72, 20, '#FBE3A0', '#E9A23B', { cls: 'bob' });
    N(bf, 'text', { x: 1250, y: 80, 'font-size': 22, 'font-weight': 800, fill: '#6F5B10', text: 'butterflies in my stomach' });
    T(E, 1370, 36, '…before the speaker finishes', null, { in: 6, out: 7, size: 24, italic: true, fill: '#134219' });
    /* the word itself, climbing */
    const w = G(s, { cls: 'mover climber' });
    N(w, 'rect', { x: -100, y: -28, width: 200, height: 62, rx: 31, fill: '#3E2150', opacity: .35, transform: 'translate(0 5)' });
    N(w, 'rect', { x: -100, y: -32, width: 200, height: 62, rx: 31, fill: ART.grad(s, [['#8E5AA6'], ['#6B3F80']]) });
    N(w, 'text', { x: 0, y: 10, 'font-size': 32, 'font-weight': 900, fill: '#fff', 'text-anchor': 'middle', text: 'anxious' });
    ART.spark(w, 92, -30, 12, '#FBE3A0');
    s.CLIMB = { x: BX, y: [640, Y[0], Y[1], Y[2], Y[3], Y[4], Y[5]] };
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
  cam: [[1.5, 800, 250], [1.08, 800, 260], [1, 800, 320], [1, 800, 300], [1, 800, 310], [1, 800, 310]],
  draw(s){
    ART.studio(s, ZW, ZH, { tints: ['#E9D8F1', '#F3D9A4'] });
    N(s, 'ellipse', { cx: 800, cy: 270, rx: 520, ry: 260, fill: ART.grad(s, [['#F4EAF9', 0, 1], ['#F4EAF9', 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }) });
    /* a learner putting the pieces together */
    [['flat', null, 2, 'chin'], ['calm', 2, 4, 'present'], ['smile', 4, null, 'wave']].forEach(f =>
      ART.figure(s, 190, 300, 300, { who: 'girl', face: f[0], in: f[1] == null ? 1 : f[1], out: f[2], pose: f[3], look: 1 }));
    ART.spark(s, 290, 170, 12, '#E9B949', { in: 4, cls: 'pop' });
    const cx = 800, cy = 250;
    const L = [['feel', 520, 120], ['deeply', 450, 250], ['a bit', 520, 380]], R = [['thoughts', 1090, 140], ['moment', 1110, 300]];
    L.concat(R).forEach(([t, x, y], i) => {
      N(s, 'path', { d: `M${cx} ${cy}L${x} ${y}`, stroke: '#6B3F80', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round', in: 1, delay: i * 120, at: '3-4:dim' });
      chip(s, x, y, t, { in: 1, delay: i * 120, size: 30, fill: '#fff', stroke: 'none', ink: '#6B3F80', cls: 'pop', at: '3-4:dim' });
    });
    [['about', 560, 520], ['to', 800, 520], ['when', 1040, 520]].forEach(([t, x, y], i) => {
      N(s, 'path', { d: `M${cx} ${cy + 40}L${x} ${y - 36}`, stroke: '#B9924F', 'stroke-width': 3, in: 2, delay: i * 120, at: '3-4:dim' });
      brick(s, x - 110, y, [[t, 'key'], [['noun', 'verb', 'clause'][i], 'slot']], { in: 2, delay: i * 120, at: '3-4:dim', cls: 'rise' });
    });
    const hub = G(s, { at: '0-0:lone' });
    N(hub, 'ellipse', { cx, cy: cy + 2, rx: 190, ry: 70, fill: '#8E5AA6', opacity: .12, cls: 'breathe', out: 1 });
    N(hub, 'rect', { x: cx - 135, y: cy - 36, width: 270, height: 80, rx: 40, fill: '#3E2150', opacity: .35 });
    N(hub, 'rect', { x: cx - 135, y: cy - 42, width: 270, height: 80, rx: 40, fill: ART.grad(s, [['#8E5AA6'], ['#6B3F80']]) });
    N(hub, 'rect', { x: cx - 115, y: cy - 36, width: 230, height: 22, rx: 11, fill: '#fff', opacity: .14 });
    N(hub, 'text', { x: cx, y: cy + 12, 'font-size': 42, 'font-weight': 900, fill: '#fff', 'text-anchor': 'middle', text: 'anxious' });
    /* the sentence strip */
    const strip = G(s, { in: 3, out: 5 });
    const parts = [['I', '#fff'], ['feel', '#fff'], ['anxious', '#F4EAF9'], ['about', '#F0E6CD'], ['the exam.', '#fff']];
    let x = 360;
    parts.forEach(([t, f], i) => {
      const w = t.length * 22 + 54;
      chip(strip, x + w / 2, 64, t, { in: 3, size: 34, fill: f, stroke: 'none', rx: 14, w, cls: i % 2 ? 'slide-r' : 'slide-l', delay: i * 140 });
      x += w + 14;
    });
    /* the idiom */
    const idm = G(s, { in: 4 });
    ART.cloud(idm, 1370, 440, 150, '#fff');
    N(idm, 'text', { x: 1370, y: 442, 'font-size': 30, 'font-weight': 900, 'text-anchor': 'middle', fill: '#6F5B10', text: 'butterflies' });
    N(idm, 'text', { x: 1370, y: 480, 'font-size': 30, 'font-weight': 900, 'text-anchor': 'middle', fill: '#6F5B10', text: 'in my stomach' });
    ART.butterfly(idm, 1275, 330, 28, '#FBE3A0', '#E9A23B', { cls: 'bob' });
    ART.butterfly(idm, 1460, 318, 22, '#F4C1D9', '#C97AA9', { cls: 'bob', style: 'animation-delay:.8s' });
    N(idm, 'path', { d: 'M1225 420Q1060 390 935 290', fill: 'none', stroke: '#B9924F', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    N(s, 'rect', { x: 560, y: 170, width: 480, height: 160, rx: 80, fill: 'none', stroke: '#B9924F', 'stroke-width': 4, 'stroke-dasharray': '4 10', in: 5, cls: 'draw' });
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
    /* a morning sky over the hill */
    N(s, 'rect', { x: 0, y: 0, width: ZW, height: ZH, fill: ART.grad(s, [['#DCEBF2'], ['#F7EFD9']]) });
    N(s, 'circle', { cx: 1190, cy: 96, r: 150, fill: ART.grad(s, [['#FBE3A0', 0, .8], ['#FBE3A0', 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }) });
    N(s, 'circle', { cx: 1190, cy: 96, r: 52, fill: ART.grad(s, [['#FFEFB8'], ['#F2B53A']], { radial: true }) });
    ART.cloud(s, 1000, 70, 46, '#fff', { cls: 'drift' });
    ART.cloud(s, 1500, 250, 38, '#fff', { cls: 'drift', style: 'animation-delay:-6s' });
    ART.cloud(s, 640, 150, 30, '#fff', { cls: 'drift', style: 'animation-delay:-3s' });
    [[1400, 56], [1440, 44], [1424, 76]].forEach(([bx, by]) => N(s, 'path', { d: `M${bx - 10} ${by}q5 -6 10 0q5 -6 10 0`, fill: 'none', stroke: '#5F6A5C', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    /* a hill to climb, one station per step */
    N(s, 'path', { d: 'M0 620L0 500Q500 520 900 380T1600 150L1600 620Z', fill: ART.grad(s, [['#CFE0C2'], ['#B7CFA6']]), opacity: .6 });
    N(s, 'path', { d: 'M0 620L0 560Q400 540 800 420T1600 110L1600 620Z', fill: ART.grad(s, [['#E3EDD9'], ['#CFE0C2']]) });
    N(s, 'path', { d: 'M0 620L0 590Q500 590 900 480T1600 250L1600 620Z', fill: ART.grad(s, [['#D6E6CB'], ['#BFD5AF']]), opacity: .8 });
    [[260, 575], [700, 530], [1180, 420], [1480, 300]].forEach(([tx, ty]) => {
      N(s, 'path', { d: `M${tx} ${ty}v-26`, stroke: '#7A5A35', 'stroke-width': 6, 'stroke-linecap': 'round' });
      N(s, 'circle', { cx: tx, cy: ty - 40, r: 24, fill: ART.grad(s, [['#8FBF77'], ['#4E8A4A']]) });
    });
    const St = [['Feel', 'heart'], ['Hear', 'ear'], ['Partners', 'link'], ['Patterns', 'puzzle'], ['Say', 'speech'], ['Idioms', 'image'], ['Share', 'users']];
    const X = i => 140 + i * 205, Y = i => 520 - i * 62;
    N(s, 'path', { d: St.map((_, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(i)).join(''), fill: 'none', stroke: '#B9924F', 'stroke-width': 6, 'stroke-dasharray': '2 16', 'stroke-linecap': 'round', cls: 'draw', in: 0 });
    const hi = [1, 2, 3, 3, 4, 4, 5];
    St.forEach(([t, ic], i) => {
      const g = G(s, { in: 0, delay: 200 + i * 140, cls: 'pop', at: hi[i] + '-' + hi[i] + ':hot' });
      N(g, 'circle', { cx: X(i), cy: Y(i) + 6, r: 58, fill: '#103D21', opacity: .18 });
      N(g, 'circle', { cx: X(i), cy: Y(i), r: 58, fill: '#fff', stroke: '#134219', 'stroke-width': 5, cls: 'st-ring' });
      N(g, 'circle', { cx: X(i), cy: Y(i), r: 40, fill: ART.grad(s, [['#2E7447'], ['#103D21']]) });
      glyph(g, ic, X(i), Y(i), 40, '#fff');
      N(g, 'text', { x: X(i), y: Y(i) + 96, 'font-size': 28, 'font-weight': 900, 'text-anchor': 'middle', fill: '#134219', text: t, stroke: '#F7EFD9', 'stroke-width': 6, 'paint-order': 'stroke' });
    });
    const flag = G(s, { in: 5, cls: 'pop' });
    N(flag, 'path', { d: `M${X(6) + 40} ${Y(6) - 50}V${Y(6) - 124}`, stroke: '#6B5116', 'stroke-width': 6, 'stroke-linecap': 'round' });
    N(flag, 'path', { d: `M${X(6) + 43} ${Y(6) - 122}L${X(6) + 116} ${Y(6) - 101}L${X(6) + 43} ${Y(6) - 80}Z`, fill: ART.grad(s, [['#F2D27A'], ['#B9924F']]) });
    ART.spark(flag, X(6) + 136, Y(6) - 120, 14, '#E9B949');
    /* the pair and the phone */
    const pr = G(s, { in: 6, cls: 'pop' });
    N(pr, 'rect', { x: 130, y: 24, width: 760, height: 210, rx: 32, fill: '#FBF5E6', filter: ART.soft(s) });
    N(pr, 'rect', { x: 130, y: 24, width: 760, height: 210, rx: 32, fill: 'none', stroke: '#E4D3A8', 'stroke-width': 3 });
    ART.figure(pr, 240, 94, 150, { who: 'learner', face: 'smile', pose: 'phone', shadow: false, look: 1 });
    ART.figure(pr, 410, 94, 150, { who: 'friend', face: 'laugh', pose: 'pointL', shadow: false, look: -1 });
    const ph = G(pr, { transform: 'rotate(-8 300 160)' });
    N(ph, 'rect', { x: 278, y: 118, width: 46, height: 82, rx: 9, fill: '#1D211C' });
    N(ph, 'rect', { x: 283, y: 127, width: 36, height: 62, rx: 4, fill: ART.grad(s, [['#E1F1F9'], ['#A9D3E3']]) });
    N(ph, 'text', { x: 301, y: 166, 'font-size': 24, 'text-anchor': 'middle', text: '😊' });
    N(pr, 'text', { x: 520, y: 116, 'font-size': 34, 'font-weight': 900, fill: '#134219', text: 'dialogue-bd.com' });
    N(pr, 'text', { x: 520, y: 162, 'font-size': 34, 'font-weight': 900, fill: '#6B5116', text: '/emotions' });
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
    const cam = G(svg, { cls: 'cam' });
    P.draw(cam);
    ART.finish(svg, ZW, ZH);
    svg.onclick = () => go(1);
    card.appendChild(svg);
    const cap = el('div', 'l-cap'); cap.setAttribute('aria-live', 'polite');
    card.appendChild(cap);
    const foot = el('div', 'l-foot');
    const dots = el('div', 'beats'); P.beats.forEach(() => dots.appendChild(el('i')));
    foot.appendChild(dots);
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
    foot.appendChild(tools); card.appendChild(foot);
    const body = el('div', 'l-read'); body.hidden = !this.reading;
    body.appendChild(el('p', null, P.body)); const b = el('p', 'bn', P.bodyBn); b.lang = 'bn'; body.appendChild(b);
    read.onclick = () => { this.reading = !this.reading; body.hidden = !this.reading; };
    card.appendChild(body);
    p.appendChild(card);
    $('#wrap').appendChild(p);
    /* strokes that draw need their own length */
    svg.querySelectorAll('.draw').forEach(n => { try { n.style.setProperty('--len', Math.ceil(n.getTotalLength())); } catch (e) {} });
    this.dots = dots; this.svg = svg; this.cam = cam; this.cap = cap; this.bar = bar.firstChild; this.autoBtn = auto;
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
    if (P.onBeat) P.onBeat(k, this.cam);
    const c = (P.cam && P.cam[k]) || [1, ZW / 2, ZH / 2], z = c[0];
    const fx = Math.max(ZW / 2 / z, Math.min(ZW - ZW / 2 / z, c[1])), fy = Math.max(ZH / 2 / z, Math.min(ZH - ZH / 2 / z, c[2]));
    this.cam.style.transform = `translate(${ZW / 2}px, ${ZH / 2}px) scale(${z}) translate(${-fx}px, ${-fy}px)`;
    [...this.dots.children].forEach((d, j) => d.className = j === k ? 'on' : j < k ? 'done' : '');
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
