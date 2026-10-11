/* The cast — shaded, posable characters for the motion scenes.
   Front-facing, Headspace / Kurzgesagt-inspired: soft organic shapes, a key
   light from the upper left (shadow on the figure's left side = screen right),
   rim highlights, expressive brows, blinking eyes and two-segment arms that
   bend at the elbow. Feet stand on (0,0); an adult is ~610 units tall. */

import { el, g, id } from './kit.js';

/* ---------- colour helpers ---------- */
const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
export function shade(hex, amt) { // amt < 0 darker, > 0 lighter (−1…1)
  const n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  const f = c => amt < 0 ? c * (1 + amt) : c + (255 - c) * amt;
  return '#' + [r, gg, b].map(c => clamp(f(c)).toString(16).padStart(2, '0')).join('');
}
export function mix(a, b, t) {
  const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => clamp(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

export const SKIN = { s1: '#f6d3b8', s2: '#e8b48f', s3: '#c98c63', s4: '#9a6343', s5: '#6b4330', s6: '#4a2e22' };
export const HAIRC = { black: '#211915', dark: '#3a271c', brown: '#5b3a24', auburn: '#8a4228', blond: '#d9ab5f', grey: '#b9b4ac', white: '#e9e5dc', red: '#a8482a' };

const P = (parent, d, fill, extra = {}) => el('path', { d, fill, ...extra }, parent);
const S = (parent, d, stroke, w, extra = {}) => el('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, parent);

/* Fill a shape, then lay a clipped shadow and a highlight inside it. */
function lit(parent, d, base, { shadow = true, light = true, sx = 26, rim = true } = {}) {
  const grp = g(parent);
  const cid = id('clip');
  const cp = el('clipPath', { id: cid }, grp); P(cp, d);
  P(grp, d, base);
  const inner = g(grp, { 'clip-path': `url(#${cid})` });
  if (shadow) el('rect', { x: sx, y: -2000, width: 4000, height: 4000, fill: shade(base, -.22), transform: 'rotate(8)' }, inner);
  if (light) el('rect', { x: -4000 - 10, y: -2000, width: 4000 - 30, height: 4000, fill: shade(base, .12), opacity: .55, transform: 'rotate(8)' }, inner);
  if (rim) P(grp, d, 'none', { stroke: shade(base, -.35), 'stroke-width': 0, opacity: 0 });
  grp.inner = inner;
  return grp;
}

/* ---------- arm (upper arm → elbow → forearm → hand) ---------- */
function arm(parent, side, { sleeve, skin, short = false, coat = false, w = 1 }) {
  const sx = side * 74;
  const upper = g(parent, { class: side < 0 ? 'arm-l' : 'arm-r' });
  upper.setAttribute('data-ox', sx); upper.setAttribute('data-oy', -422);
  const U = g(upper); U.setAttribute('transform', `translate(${sx} -422)`);
  // Upper arm
  const ua = 'M-21 0 C-23 -14 23 -14 21 0 L18 120 C18 132 -18 132 -18 120 Z';
  lit(U, ua, sleeve, { sx: side < 0 ? -6 : 4, light: false });
  // Forearm group pivots at the elbow (0,122)
  const fore = g(U, { class: 'fore' });
  fore.setAttribute('data-ox', 0); fore.setAttribute('data-oy', 122);
  const F = g(fore); F.setAttribute('transform', 'translate(0 122)');
  const fa = 'M-18 -6 L-15 104 C-15 112 15 112 15 104 L18 -6 C18 -16 -18 -16 -18 -6Z';
  lit(F, fa, short ? skin : sleeve, { sx: side < 0 ? -5 : 3, light: false });
  if (!short) P(F, 'M-17 92 h34 v12 c0 6 -34 6 -34 0z', shade(sleeve, -.15));
  // Hand: a soft mitten with a thumb
  const hand = g(F, { class: 'hand' });
  hand.setAttribute('transform', 'translate(0 108)');
  P(hand, `M-15 0 C-19 18 -14 34 0 35 C14 34 19 18 15 0 Z`, skin);
  P(hand, side < 0 ? 'M14 6 C24 10 26 22 18 26 C14 22 12 16 12 10Z' : 'M-14 6 C-24 10 -26 22 -18 26 C-14 22 -12 16 -12 10Z', shade(skin, -.08));
  P(hand, `M4 4 C10 14 10 30 2 40 C12 38 16 24 15 2Z`, shade(skin, -.18), { opacity: .6 });
  upper.fore = fore; upper.hand = hand;
  return upper;
}

/* ---------- hair ---------- */
function hairBack(parent, style, c) {
  if (style === 'long') P(parent, 'M-64 -556 C-70 -640 70 -640 64 -556 L70 -440 C72 -418 46 -412 34 -428 L-34 -428 C-46 -412 -72 -418 -70 -440Z', shade(c, -.12));
  if (style === 'bob') P(parent, 'M-62 -556 C-66 -640 66 -640 62 -556 L66 -488 C66 -470 44 -470 36 -482 L-36 -482 C-44 -470 -66 -470 -66 -488Z', shade(c, -.12));
  if (style === 'curly') {
    const pts = [[-58, -560, 34], [-48, -600, 34], [-22, -624, 34], [10, -628, 34], [40, -612, 34], [60, -580, 32], [64, -544, 28], [-64, -526, 26], [62, -510, 22], [-60, -500, 22]];
    for (const [x, y, r] of pts) el('circle', { cx: x, cy: y, r, fill: shade(c, -.08) }, parent);
  }
  if (style === 'ponytail') P(parent, 'M40 -590 C88 -586 98 -520 86 -470 C80 -446 64 -450 66 -474 C72 -520 66 -560 40 -566Z', shade(c, -.12));
  if (style === 'bun') el('circle', { cx: 0, cy: -628, r: 26, fill: shade(c, -.05) }, parent);
  if (style === 'hijab') P(parent, 'M-70 -548 C-74 -646 74 -646 70 -548 L84 -430 C60 -404 -60 -404 -84 -430Z', shade(c, -.12));
}
function hairFront(parent, style, c) {
  const hi = shade(c, .28);
  const cap = (d) => { P(parent, d, c); };
  if (style === 'short') { cap('M-50 -540 C-56 -596 -30 -620 4 -618 C38 -616 58 -592 50 -540 C46 -566 34 -580 16 -582 C2 -572 -22 -574 -36 -580 C-44 -572 -48 -558 -50 -540Z'); S(parent, 'M-20 -604 C-6 -610 12 -610 26 -602', hi, 4, { opacity: .7 }); }
  if (style === 'crop') { cap('M-49 -548 C-52 -600 -24 -616 2 -616 C28 -616 52 -600 49 -548 C40 -584 -40 -584 -49 -548Z'); }
  if (style === 'long' || style === 'bob') { cap('M-52 -536 C-58 -604 -26 -624 4 -622 C40 -620 60 -596 52 -536 C46 -560 30 -584 6 -590 C-6 -572 -30 -560 -52 -536Z'); S(parent, 'M-26 -606 C-10 -614 14 -614 30 -604', hi, 4, { opacity: .7 }); }
  if (style === 'ponytail' || style === 'bun') { cap('M-50 -540 C-54 -604 -24 -622 4 -620 C36 -618 56 -598 50 -540 C40 -572 24 -588 0 -590 C-24 -588 -42 -572 -50 -540Z'); S(parent, 'M-22 -608 C-6 -614 14 -614 28 -606', hi, 4, { opacity: .7 }); }
  if (style === 'curly') { for (const [x, y, r] of [[-38, -588, 22], [-14, -604, 22], [12, -606, 22], [36, -592, 22], [-50, -560, 16], [50, -562, 16]]) el('circle', { cx: x, cy: y, r, fill: c }, parent); for (const [x, y] of [[-18, -612], [16, -614]]) el('circle', { cx: x, cy: y, r: 6, fill: hi, opacity: .45 }, parent); }
  if (style === 'bald') { P(parent, 'M-50 -536 C-52 -556 -46 -566 -40 -568 L-38 -540Z', c); P(parent, 'M50 -536 C52 -556 46 -566 40 -568 L38 -540Z', c); }
  if (style === 'hijab') { P(parent, 'M-56 -540 C-62 -626 62 -626 56 -540 C56 -500 46 -474 36 -466 C50 -500 52 -530 48 -548 C30 -586 -30 -586 -48 -548 C-52 -530 -50 -500 -36 -466 C-46 -474 -56 -500 -56 -540Z', c); S(parent, 'M-30 -604 C-10 -612 14 -612 32 -602', hi, 4, { opacity: .55 }); }
}

/* ---------- the figure ---------- */
export function figure(parent, o = {}) {
  const {
    skin = SKIN.s3, hair = 'short', hairColor = HAIRC.dark, top = '#e7c178', bottom = '#2f3e4a', shoes = '#2a2420',
    outfit = 'sweater', age = 'adult', mood = 'smile', beard = false, glasses = false, seated = false, coat = false,
    skirt = false, earrings = false, accent
  } = o;
  const root = g(parent, { class: 'figure' });
  const sc = { adult: 1, teen: .86, child: .62, toddler: .5, elder: .97 }[age] ?? 1;
  const headBoost = { adult: 1.12, teen: 1.16, child: 1.3, toddler: 1.36, elder: 1.1 }[age] ?? 1.12;
  // Contact shadow
  el('ellipse', { cx: 0, cy: 0, rx: 92 * sc, ry: 13 * sc, fill: '#000', opacity: .22 }, root);
  const body = g(root, { class: 'body' });
  body.setAttribute('transform', `scale(${sc})`);
  const drop = seated ? 120 : 0;
  const up = g(body); up.setAttribute('transform', `translate(0 ${drop})`);
  const upper = g(up, { class: 'upper' });

  // Legs
  const legs = g(body, { class: 'legs' });
  if (seated) {
    lit(legs, 'M-60 -170 C-62 -196 -10 -196 -6 -170 L-10 -112 C-12 -96 -56 -96 -58 -112Z', bottom, { sx: -30 });
    lit(legs, 'M6 -170 C10 -196 62 -196 60 -170 L58 -112 C56 -96 12 -96 10 -112Z', bottom, { sx: 34 });
    lit(legs, 'M-54 -116 L-50 -20 L-16 -20 L-14 -116Z', bottom, { sx: -28 });
    lit(legs, 'M14 -116 L16 -20 L50 -20 L54 -116Z', bottom, { sx: 36 });
  } else if (skirt) {
    lit(legs, 'M-40 -150 L-36 -20 L-14 -20 L-12 -150Z', shade(skin, -.05), { sx: -24 });
    lit(legs, 'M12 -150 L14 -20 L36 -20 L40 -150Z', shade(skin, -.05), { sx: 28 });
  } else {
    lit(legs, 'M-62 -250 L-4 -250 L-10 -24 C-10 -16 -50 -16 -52 -24Z', bottom, { sx: -30 });
    lit(legs, 'M4 -250 L62 -250 L52 -24 C50 -16 10 -16 10 -24Z', bottom, { sx: 30 });
    S(legs, 'M-40 -150 C-36 -140 -30 -138 -26 -140 M38 -120 C34 -110 28 -108 24 -110', shade(bottom, -.3), 3, { opacity: .5 });
  }
  // Shoes
  for (const s of [-1, 1]) {
    const x = s * 32;
    P(legs, `M${x - 30} -6 C${x - 30} -26 ${x + 30} -30 ${x + 32} -10 C${x + 34} 0 ${x - 30} 4 ${x - 30} -6Z`, shoes);
    P(legs, `M${x - 22} -22 C${x - 8} -28 ${x + 12} -28 ${x + 22} -20`, 'none', { stroke: shade(shoes, .3), 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .6 });
  }

  // Back hair, then torso
  const backHair = g(upper); hairBack(backHair, hair, hairColor);
  // Neck
  lit(upper, 'M-17 -480 L17 -480 L19 -432 L-19 -432Z', skin, { sx: 2 });
  P(upper, 'M-17 -470 C-8 -458 8 -458 17 -470 L17 -480 L-17 -480Z', shade(skin, -.25), { opacity: .7 });
  // Torso / clothing
  const torsoD = 'M-62 -446 C-82 -446 -94 -434 -94 -412 L-86 -334 C-84 -304 -76 -284 -73 -264 C-71 -248 -63 -240 -50 -240 L50 -240 C63 -240 71 -248 73 -264 C76 -284 84 -304 86 -334 L94 -412 C94 -434 82 -446 62 -446 Z';
  if (skirt && !seated) lit(upper, 'M-66 -262 L66 -262 L92 -140 C70 -126 -70 -126 -92 -140Z', bottom, { sx: 30 });
  const torso = lit(upper, torsoD, top, { sx: 30 });
  const ink = shade(top, -.32);
  if (outfit === 'sweater' || outfit === 'tee') {
    P(upper, 'M-26 -442 C-18 -420 18 -420 26 -442Z', skin);
    S(upper, 'M-28 -442 C-18 -416 18 -416 28 -442', ink, 5);
    if (outfit === 'sweater') P(upper, 'M-82 -256 L82 -256 L81 -246 C80 -240 72 -238 62 -238 L-62 -238 C-72 -238 -80 -240 -81 -246Z', ink, { opacity: .5 });
  }
  if (outfit === 'shirt') {
    P(upper, 'M-24 -442 L0 -404 L24 -442Z', skin);
    P(upper, 'M-30 -444 L0 -404 L-6 -390 L-38 -432Z', shade(top, .2)); P(upper, 'M30 -444 L0 -404 L6 -390 L38 -432Z', shade(top, .08));
    S(upper, 'M0 -400 V-244', ink, 3, { opacity: .55 });
    for (const y of [-372, -332, -292]) el('circle', { cx: 0, cy: y, r: 4, fill: ink, opacity: .7 }, upper);
  }
  if (outfit === 'cardigan') {
    P(upper, 'M-24 -442 C-14 -418 14 -418 24 -442Z', skin);
    P(upper, 'M-22 -440 L-6 -238 L6 -238 L22 -440 C14 -424 -14 -424 -22 -440Z', accent || '#f4f1e6');
    S(upper, 'M-22 -440 L-6 -238 M22 -440 L6 -238', ink, 4, { opacity: .6 });
  }
  if (outfit === 'blouse') {
    P(upper, 'M-30 -442 C-20 -404 20 -404 30 -442Z', skin);
    S(upper, 'M-32 -442 C-20 -400 20 -400 32 -442', ink, 4, { opacity: .5 });
  }
  if (coat) {
    lit(upper, 'M-74 -444 C-90 -444 -96 -432 -96 -414 L-92 -150 L-8 -150 L-4 -420 Z', '#f7f5ef', { sx: 300 });
    lit(upper, 'M74 -444 C90 -444 96 -432 96 -414 L92 -150 L8 -150 L4 -420 Z', '#f7f5ef', { sx: 10 });
    P(upper, 'M-28 -444 L-4 -380 L-30 -350 L-46 -436Z', '#e6e2d6'); P(upper, 'M28 -444 L4 -380 L30 -350 L46 -436Z', '#d9d4c6');
    el('rect', { x: 38, y: -360, width: 34, height: 6, rx: 3, fill: '#c9c3b4' }, upper);
    // Stethoscope
    S(upper, 'M-26 -436 C-40 -380 -30 -330 -2 -326 C26 -330 40 -380 26 -436', '#3d4a54', 5);
    el('circle', { cx: -2, cy: -322, r: 11, fill: '#8fa3ad', stroke: '#3d4a54', 'stroke-width': 4 }, upper);
  }

  // Arms
  const sleeve = coat ? '#f7f5ef' : top;
  const armL = arm(upper, -1, { sleeve, skin, short: outfit === 'tee' });
  const armR = arm(upper, 1, { sleeve, skin, short: outfit === 'tee' });

  // Head (pivots at the neck)
  const head = g(upper, { class: 'head' });
  head.setAttribute('data-ox', 0); head.setAttribute('data-oy', -470);
  const H = g(head); H.setAttribute('transform', `translate(0 -470) scale(${headBoost}) translate(0 470)`);
  for (const s of [-1, 1]) { el('ellipse', { cx: s * 49, cy: -536, rx: 10, ry: 15, fill: shade(skin, s > 0 ? -.12 : 0) }, H); el('ellipse', { cx: s * 50, cy: -536, rx: 4, ry: 7, fill: shade(skin, -.2), opacity: .6 }, H); }
  if (earrings) for (const s of [-1, 1]) el('circle', { cx: s * 50, cy: -516, r: 5, fill: '#e7c178' }, H);
  const faceD = 'M-49 -548 C-49 -592 -25 -606 0 -606 C25 -606 49 -592 49 -548 C49 -506 33 -478 0 -474 C-33 -478 -49 -506 -49 -548Z';
  const face = lit(H, faceD, skin, { sx: 22, light: true });
  if (beard) P(H, 'M-46 -534 C-44 -490 -24 -470 0 -468 C24 -470 44 -490 46 -534 C38 -508 22 -500 0 -500 C-22 -500 -38 -508 -46 -534Z', hairColor);
  const faceG = g(H, { class: 'face' });
  // Cheeks
  for (const s of [-1, 1]) el('ellipse', { cx: s * 28, cy: -516, rx: 10, ry: 6.5, fill: '#e8806c', opacity: .28 }, faceG);
  // Eyes
  const eyes = g(faceG, { class: 'eyes' });
  eyes.setAttribute('data-ox', 0); eyes.setAttribute('data-oy', -542);
  for (const s of [-1, 1]) { el('ellipse', { cx: s * 18, cy: -542, rx: 6, ry: 7.6, fill: '#231a16' }, eyes); el('circle', { cx: s * 18 + 2, cy: -545, r: 2, fill: '#fff', opacity: .9 }, eyes); }
  // Brows
  const brows = g(faceG, { class: 'brows' });
  const bc = shade(hairColor === HAIRC.white || hairColor === HAIRC.grey ? '#8a8279' : hairColor, -.1);
  const browL = S(brows, 'M-28 -561 C-22 -566 -14 -566 -8 -562', bc, 5.5);
  const browR = S(brows, 'M8 -562 C14 -566 22 -566 28 -561', bc, 5.5);
  // Nose
  S(faceG, 'M2 -536 C6 -526 6 -520 -2 -518', shade(skin, -.28), 3.6);
  // Mouth
  const mouths = {
    smile: ['M-13 -500 C-6 -492 6 -492 13 -500', 'stroke'],
    grin: ['M-16 -502 C-10 -484 10 -484 16 -502 Z', 'fill'],
    open: ['M-8 -500 C-8 -488 8 -488 8 -500 C8 -506 -8 -506 -8 -500Z', 'fill'],
    flat: ['M-10 -497 C-4 -496 4 -496 10 -497', 'stroke'],
    sad: ['M-11 -492 C-5 -499 5 -499 11 -492', 'stroke'],
    worried: ['M-12 -495 C-6 -500 6 -498 12 -494', 'stroke']
  };
  const [md, mk] = mouths[mood] || mouths.smile;
  const mouth = mk === 'fill' ? P(faceG, md, '#6e2b22') : S(faceG, md, '#6e2b22', 4.2);
  if (mk === 'fill') P(faceG, 'M-8 -490 C-3 -486 3 -486 8 -490 C4 -494 -4 -494 -8 -490Z', '#e07a6a');
  if (mood === 'worried' || mood === 'sad') { browL.setAttribute('d', 'M-28 -558 C-22 -562 -14 -566 -8 -568'); browR.setAttribute('d', 'M8 -568 C14 -566 22 -562 28 -558'); }
  if (glasses) { const gl = g(faceG); for (const s of [-1, 1]) el('rect', { x: s * 18 - 15, y: -554, width: 30, height: 24, rx: 9, fill: '#ffffff', 'fill-opacity': .12, stroke: '#2b2622', 'stroke-width': 3.5 }, gl); S(gl, 'M-3 -544 C-1 -548 1 -548 3 -544', '#2b2622', 3.5); }
  const front = g(H); hairFront(front, hair, hairColor);

  root.parts = { body, upper, head, armL, armR, eyes, brows, browL, browR, mouth, mouthKind: mk, faceG, scale: sc, seated };
  return root;
}

/* ---------- poses ---------- */
export const POSES = {
  idle: [9, -8, -9, 8],
  relaxed: [6, -14, -6, 14],
  wave: [9, -8, -150, -24],
  point: [9, -8, -84, -6],
  pointUp: [9, -8, -132, -14],
  pointL: [84, 6, -9, 8],
  think: [9, -8, 26, 158],
  heart: [9, -8, 30, 128],
  hold: [10, -108, -10, 108],
  present: [9, -8, -58, -38],
  presentBoth: [58, 38, -58, -38],
  cheer: [152, 14, -152, -14],
  shrug: [42, -96, -42, 96],
  hips: [36, -132, -36, 132],
  reachR: [9, -8, -64, -10],
  reachL: [64, 10, -9, 8],
  handsDown: [4, -4, -4, 4],
  write: [10, -100, -14, 96],
  chin: [9, -8, 22, 164]
};
/* Tween a figure's arms into a pose (degrees for upperL, foreL, upperR, foreR). */
export function pose(tl, f, name, t, d = .55, ease = 'power3.inOut') {
  const [uL, fL, uR, fR] = Array.isArray(name) ? name : POSES[name];
  const { armL, armR } = f.parts;
  const o = n => `${n.dataset.ox} ${n.dataset.oy}`;
  tl.to(armL, { rotation: uL, svgOrigin: o(armL), duration: d, ease }, t);
  tl.to(armL.fore, { rotation: fL, svgOrigin: o(armL.fore), duration: d, ease }, t);
  tl.to(armR, { rotation: uR, svgOrigin: o(armR), duration: d, ease }, t);
  tl.to(armR.fore, { rotation: fR, svgOrigin: o(armR.fore), duration: d, ease }, t);
}
export function setPose(gsap, f, name) {
  const [uL, fL, uR, fR] = POSES[name];
  const { armL, armR } = f.parts;
  const o = n => `${n.dataset.ox} ${n.dataset.oy}`;
  gsap.set(armL, { rotation: uL, svgOrigin: o(armL), smoothOrigin: false });
  gsap.set(armL.fore, { rotation: fL, svgOrigin: o(armL.fore), smoothOrigin: false });
  gsap.set(armR, { rotation: uR, svgOrigin: o(armR), smoothOrigin: false });
  gsap.set(armR.fore, { rotation: fR, svgOrigin: o(armR.fore), smoothOrigin: false });
}
export function waveHand(tl, f, t, times = 2, side = 'R') {
  const fore = f.parts['arm' + side].fore, o = `${fore.dataset.ox} ${fore.dataset.oy}`;
  const base = POSES.wave[3];
  tl.to(fore, { rotation: base - 30, svgOrigin: o, duration: .2, repeat: times * 2 - 1, yoyo: true, ease: 'sine.inOut' }, t);
}
/* Blinks scheduled across a span — deterministic, so seeking shows the same face. */
export function blinks(tl, f, t0, t1, seed = 1) {
  const e = f.parts.eyes, o = `${e.dataset.ox} ${e.dataset.oy}`;
  let t = t0 + .6 + (seed % 7) * .23;
  while (t < t1 - .3) {
    tl.to(e, { scaleY: .08, svgOrigin: o, duration: .06, ease: 'power1.in', yoyo: true, repeat: 1 }, t);
    t += 2.4 + ((seed * 13 + Math.floor(t * 10)) % 17) / 10;
  }
}
export function tilt(tl, f, t, deg = 6, d = .6) {
  const h = f.parts.head;
  tl.to(h, { rotation: deg, svgOrigin: `${h.dataset.ox} ${h.dataset.oy}`, duration: d, ease: 'power2.inOut' }, t);
}
export function express(tl, f, t, mood) {
  const { browL, browR, mouth, mouthKind } = f.parts;
  const brow = {
    happy: ['M-28 -563 C-22 -569 -14 -569 -8 -564', 'M8 -564 C14 -569 22 -569 28 -563'],
    calm: ['M-28 -561 C-22 -566 -14 -566 -8 -562', 'M8 -562 C14 -566 22 -566 28 -561'],
    worried: ['M-28 -558 C-22 -562 -14 -566 -8 -568', 'M8 -568 C14 -566 22 -562 28 -558'],
    surprised: ['M-28 -568 C-22 -575 -14 -575 -8 -570', 'M8 -570 C14 -575 22 -575 28 -568'],
    focused: ['M-28 -564 C-22 -562 -14 -560 -8 -558', 'M8 -558 C14 -560 22 -562 28 -564']
  }[mood];
  if (brow) { tl.to(browL, { attr: { d: brow[0] }, duration: .3 }, t); tl.to(browR, { attr: { d: brow[1] }, duration: .3 }, t); }
  if (mouthKind === 'stroke') {
    const m = { happy: 'M-14 -501 C-6 -490 6 -490 14 -501', calm: 'M-13 -500 C-6 -494 6 -494 13 -500', worried: 'M-12 -495 C-6 -500 6 -498 12 -494', sad: 'M-11 -492 C-5 -499 5 -499 11 -492', surprised: 'M-6 -498 C-6 -490 6 -490 6 -498', focused: 'M-9 -497 C-3 -496 3 -496 9 -497' }[mood];
    if (m) tl.to(mouth, { attr: { d: m }, duration: .3 }, t);
  }
}
