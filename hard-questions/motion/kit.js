/* AI Dreams & Dictation — illustration kit.
   Every picture in the motion graphics is built from these SVG pieces, so the
   nine voices share one visual language: the same people, the same AI chip,
   the same homes, papers, hearts and question marks. Learners decode a picture
   once and recognise it again in the next voice.

   Coordinates: each piece is drawn around (0,0) and placed with place().
   People stand with their feet on (0,0). Stage viewBox is 1600 × 900. */

export const NS = 'http://www.w3.org/2000/svg';

export const C = {
  night: '#06180e', deep: '#0b2716', forest: '#103d21', pine: '#1b5232', leafy: '#2c6a43',
  paper: '#f4f1e6', cream: '#fffdf7', mist: '#c9d6c3',
  gold: '#e7c178', goldDeep: '#b9924f', amber: '#f2a65a',
  moss: '#8fb27f', mossDeep: '#557a4c', mint: '#a5e3c6', mintDeep: '#4fae88',
  clay: '#df8466', clayDeep: '#b0563a', rose: '#f0a3a0', sky: '#9cc7e8', skyDeep: '#5b8fb8',
  ink: '#16201a', shadow: '#020a05'
};

export const SKIN = ['#f3cfb0', '#e3b08a', '#c68b62', '#9c6440', '#6e4630'];
export const HAIR = { black: '#1e1712', brown: '#4a2f1d', auburn: '#7b3b22', blond: '#d6a756', grey: '#c9c4bb', white: '#ece8df' };

let uid = 0;
export const id = p => `${p}-${++uid}`;

export function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
}
export const g = (parent, attrs = {}) => el('g', attrs, parent);
export function place(node, x = 0, y = 0, s = 1, r = 0) {
  node.setAttribute('transform', `translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}${r ? ` rotate(${r})` : ''}`);
  return node;
}
/* GSAP owns transforms once a node animates. place() writes the starting
   transform; wrap() puts the animatable node inside a positioned holder so
   tweens on the inner node never fight the layout transform. */
export function wrap(parent, x, y, s = 1) {
  const holder = g(parent);
  place(holder, x, y, s);
  const inner = g(holder);
  return inner;
}
const rr = (p, x, y, w, h, r, fill, extra = {}) => el('rect', { x, y, width: w, height: h, rx: r, fill, ...extra }, p);
const circ = (p, cx, cy, r, fill, extra = {}) => el('circle', { cx, cy, r, fill, ...extra }, p);
const path = (p, d, fill, extra = {}) => el('path', { d, fill, ...extra }, p);
const stroke = (p, d, color, w, extra = {}) => el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, p);
export const text = (p, str, x, y, size, fill = C.paper, extra = {}) => {
  const t = el('text', { x, y, 'font-size': size, fill, 'text-anchor': 'middle', 'font-family': "'Public Sans', system-ui, sans-serif", 'font-weight': 700, ...extra }, p);
  t.textContent = str;
  return t;
};
export const shadow = (p, rx = 60, ry = 11, y = 4, o = .32) => el('ellipse', { cx: 0, cy: y, rx, ry, fill: C.shadow, opacity: o }, p);

/* Shared defs: soft halos (cheaper than SVG blur filters on phones). */
export function defs(svg) {
  const d = el('defs', {}, svg);
  const halo = (name, color) => {
    const rg = el('radialGradient', { id: name }, d);
    el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': .55 }, rg);
    el('stop', { offset: '.45', 'stop-color': color, 'stop-opacity': .18 }, rg);
    el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, rg);
  };
  halo('halo-gold', C.gold); halo('halo-mint', C.mint); halo('halo-clay', C.clay); halo('halo-paper', C.paper); halo('halo-sky', C.sky);
  const lg = (name, a, b) => { const l = el('linearGradient', { id: name, x1: 0, y1: 0, x2: 0, y2: 1 }, d); el('stop', { offset: 0, 'stop-color': a }, l); el('stop', { offset: 1, 'stop-color': b }, l); };
  lg('grad-chip', '#2d7a58', '#174a33');
  lg('grad-building', '#2a5e41', '#173a27');
  lg('grad-server', '#24463a', '#13291f');
  lg('grad-sun', '#ffe1a0', '#f2a65a');
  lg('grad-floor', '#2a6a45', '#103d21');
  return d;
}
export const halo = (p, r = 120, color = 'gold', x = 0, y = 0) => circ(p, x, y, r, `url(#halo-${color})`);

/* ---------- People ---------- */
const AGE = { adult: 1, teen: .86, child: .64, toddler: .5, baby: .36, elder: .96 };
export function person(parent, o = {}) {
  const { tone = SKIN[2], hair = 'short', hairColor = HAIR.black, top = C.gold, bottom = '#2f4a3a', age = 'adult', mood = 'smile', coat = false, cap = false, beard = false, glasses = false, seated = false } = o;
  const root = g(parent, { class: 'person' });
  if (!seated) shadow(root, 52, 10, 2, .35);
  const body = g(root, { class: 'body' });
  const s = AGE[age] ?? 1;
  body.setAttribute('transform', `scale(${s})`);
  const stoop = age === 'elder' ? 6 : 0;
  // Back hair (long styles fall behind the shoulders).
  if (hair === 'long') rr(body, -44 + stoop, -296, 88, 108, 38, hairColor);
  if (hair === 'ponytail') { path(body, `M${30 + stoop} -280 q38 6 30 62 q-10 22 -22 4 q10 -30 -14 -50z`, hairColor); }
  // Legs and shoes.
  if (seated) { rr(body, -34, -124, 96, 30, 14, bottom); rr(body, 36, -124, 26, 80, 12, bottom); el('ellipse', { cx: 54, cy: -44, rx: 20, ry: 9, fill: C.ink }, body); }
  else { rr(body, -30, -112, 26, 112, 12, bottom); rr(body, 4, -112, 26, 112, 12, bottom);
  el('ellipse', { cx: -18, cy: -3, rx: 20, ry: 9, fill: C.ink }, body); el('ellipse', { cx: 18, cy: -3, rx: 20, ry: 9, fill: C.ink }, body); }
  // Torso.
  path(body, `M${-46 + stoop} -206 q0 -16 18 -16 h56 q18 0 18 16 l-6 106 q0 12 -12 12 h-56 q-12 0 -12 -12z`, top);
  path(body, `M${-46 + stoop} -206 q0 -16 18 -16 h56 q18 0 18 16 l-1 18 h-91z`, '#ffffff', { opacity: .12 });
  if (coat) {
    path(body, `M${-48 + stoop} -206 q0 -16 18 -16 h60 q18 0 18 16 l-4 150 h-96z`, C.cream);
    stroke(body, `M${stoop} -218 v158`, '#d8d3c2', 3);
    rr(body, 12 + stoop, -178, 22, 22, 4, C.clay); rr(body, 19 + stoop, -185, 8, 36, 2, C.cream); rr(body, 5 + stoop, -171, 36, 8, 2, C.cream);
  }
  // Arms: groups that rotate from the shoulder.
  const arm = (side) => {
    const a = g(body, { class: side < 0 ? 'arm-l' : 'arm-r' });
    const sx = side * 44 + stoop;
    stroke(a, `M${sx} -204 L${sx + side * 10} -122`, coat ? C.cream : top, 21);
    circ(a, sx + side * 10, -116, 12, tone);
    a.dataset.ox = sx; a.dataset.oy = -204;
    return a;
  };
  const armL = arm(-1), armR = arm(1);
  // Neck, head, hair, face.
  rr(body, -10 + stoop, -236, 20, 20, 6, tone);
  const head = g(body, { class: 'head' });
  const hx = stoop, hy = -264;
  circ(head, hx, hy, 37, tone);
  circ(head, hx - 37, hy + 2, 7, tone); circ(head, hx + 37, hy + 2, 7, tone);
  const H = (d) => path(head, d, hairColor);
  if (hair === 'short' || hair === 'long' || hair === 'ponytail') H(`M${hx - 39} ${hy - 2} q-2 -40 39 -42 q41 2 39 42 q-12 -22 -39 -24 q-26 2 -39 24z`);
  if (hair === 'bun') { H(`M${hx - 39} ${hy - 2} q-2 -40 39 -42 q41 2 39 42 q-12 -22 -39 -24 q-26 2 -39 24z`); circ(head, hx, hy - 46, 17, hairColor); }
  if (hair === 'curly') for (const [dx, dy, r] of [[-30, -16, 14], [-18, -32, 15], [0, -38, 16], [18, -32, 15], [30, -16, 14], [-36, 2, 10], [36, 2, 10]]) circ(head, hx + dx, hy + dy, r, hairColor);
  if (hair === 'bald') { H(`M${hx - 38} ${hy + 4} q-4 -18 6 -26 l4 20z`); H(`M${hx + 38} ${hy + 4} q4 -18 -6 -26 l-4 20z`); }
  if (hair === 'scarf') { path(head, `M${hx - 44} ${hy + 10} q-4 -58 44 -58 q48 0 44 58 q-10 -30 -44 -32 q-34 2 -44 32z`, hairColor); path(head, `M${hx - 44} ${hy + 8} q2 40 18 50 h52 q16 -10 18 -50 q-6 30 -44 32 q-38 -2 -44 -32z`, hairColor, { opacity: .95 }); }
  if (cap) { path(head, `M${hx - 40} ${hy - 12} q0 -36 40 -36 q40 0 40 36z`, cap); rr(head, hx - 4, hy - 16, 62, 9, 4, cap); }
  if (beard) path(head, `M${hx - 30} ${hy + 8} q30 46 60 0 q-6 30 -30 30 q-24 0 -30 -30z`, hairColor);
  const eyes = g(head, { class: 'eyes' });
  circ(eyes, hx - 13, hy - 2, 4.2, C.ink); circ(eyes, hx + 13, hy - 2, 4.2, C.ink);
  if (glasses) { circ(head, hx - 13, hy - 2, 11, 'none', { stroke: C.ink, 'stroke-width': 3 }); circ(head, hx + 13, hy - 2, 11, 'none', { stroke: C.ink, 'stroke-width': 3 }); stroke(head, `M${hx - 2} ${hy - 2} h4`, C.ink, 3); }
  const mouths = { smile: `M${hx - 11} ${hy + 14} q11 10 22 0`, grin: `M${hx - 13} ${hy + 12} q13 16 26 0z`, sad: `M${hx - 10} ${hy + 20} q10 -8 20 0`, flat: `M${hx - 9} ${hy + 16} h18`, open: `M${hx - 7} ${hy + 14} q7 14 14 0z`, worried: `M${hx - 10} ${hy + 19} q5 -5 10 0 q5 5 10 0` };
  const mouth = mood === 'grin' || mood === 'open' ? path(head, mouths[mood], C.ink) : stroke(head, mouths[mood] || mouths.smile, C.ink, 3.6);
  if (mood === 'smile' || mood === 'grin') { circ(head, hx - 22, hy + 10, 6, C.clay, { opacity: .35 }); circ(head, hx + 22, hy + 10, 6, C.clay, { opacity: .35 }); }
  root.parts = { body, armL, armR, head, mouth, eyes, scale: s };
  return root;
}
/* Rotate an arm from its shoulder (for waves, reaches, holding hands). */
export const armOrigin = a => `${a.dataset.ox} ${a.dataset.oy}`;

/* ---------- The AI chip: the one recurring symbol for AI ---------- */
export function chip(parent, o = {}) {
  const { label = 'AI', size = 1, glow = true, face = false } = o;
  const root = g(parent, { class: 'chip' });
  root.setAttribute('transform', `scale(${size})`);
  if (glow) root.halo = halo(root, 150, 'mint');
  const pins = g(root);
  for (let i = -1; i <= 1; i++) {
    for (const [x1, y1, x2, y2] of [[i * 26, -66, i * 26, -86], [i * 26, 66, i * 26, 86], [-66, i * 26, -86, i * 26], [66, i * 26, 86, i * 26]]) {
      stroke(pins, `M${x1} ${y1} L${x2} ${y2}`, C.mint, 7);
      circ(pins, x2, y2, 5.5, C.mint);
    }
  }
  rr(root, -68, -68, 136, 136, 26, 'url(#grad-chip)', { stroke: C.mint, 'stroke-width': 5 });
  rr(root, -50, -50, 100, 100, 16, 'none', { stroke: C.mint, 'stroke-width': 2, opacity: .45 });
  if (face) {
    circ(root, -18, -6, 7, C.mint); circ(root, 18, -6, 7, C.mint); stroke(root, 'M-14 20 q14 12 28 0', C.mint, 5);
  } else text(root, label, 0, 15, 44, C.mint, { 'font-weight': 800, 'letter-spacing': 1 });
  root.pins = pins;
  return root;
}

/* ---------- Objects ---------- */
export function doc(parent, o = {}) {
  const { w = 110, h = 140, lines = 5, accent = C.gold, mark } = o;
  const r = g(parent, { class: 'doc' });
  rr(r, -w / 2 + 6, -h / 2 + 8, w, h, 10, C.shadow, { opacity: .25 });
  rr(r, -w / 2, -h / 2, w, h, 10, C.cream);
  rr(r, -w / 2 + 14, -h / 2 + 16, w * .38, 10, 4, accent);
  r.lines = [];
  for (let i = 0; i < lines; i++) r.lines.push(stroke(r, `M${-w / 2 + 14} ${-h / 2 + 46 + i * 18} H${w / 2 - 14 - (i % 2) * 22}`, '#b7c2b2', 6));
  if (mark === 'cross') { rr(r, w / 2 - 40, h / 2 - 44, 26, 8, 2, C.clay); rr(r, w / 2 - 31, h / 2 - 53, 8, 26, 2, C.clay); }
  if (mark === 'chart') { stroke(r, `M${-w / 2 + 16} ${h / 2 - 18} l22 -20 l18 10 l26 -30`, C.mintDeep, 5); }
  return r;
}
export function magnifier(parent, o = {}) {
  const r = g(parent, { class: 'magnifier' });
  stroke(r, 'M40 40 L88 88', C.goldDeep, 18);
  circ(r, 0, 0, 52, C.paper, { opacity: .18 });
  circ(r, 0, 0, 52, 'none', { stroke: C.gold, 'stroke-width': 12 });
  path(r, 'M-30 -16 q8 -20 28 -26', 'none', { stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .6 });
  return r;
}
export function clock(parent) {
  const r = g(parent, { class: 'clock' });
  circ(r, 0, 0, 84, C.cream); circ(r, 0, 0, 84, 'none', { stroke: C.gold, 'stroke-width': 10 });
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; stroke(r, `M${Math.sin(a) * 64} ${-Math.cos(a) * 64} L${Math.sin(a) * 72} ${-Math.cos(a) * 72}`, C.mossDeep, i % 3 ? 3 : 6); }
  r.hour = stroke(g(r), 'M0 0 V-40', C.ink, 9); r.minute = stroke(g(r), 'M0 0 V-60', C.goldDeep, 6);
  circ(r, 0, 0, 8, C.ink);
  return r;
}
export function calendar(parent, o = {}) {
  const { label = '' } = o;
  const r = g(parent, { class: 'calendar' });
  rr(r, -66, -62, 132, 136, 14, C.cream);
  rr(r, -66, -62, 132, 38, 14, C.clay); rr(r, -66, -36, 132, 12, 0, C.clay);
  stroke(r, 'M-34 -74 v22 M34 -74 v22', C.ink, 9);
  for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) rr(r, -50 + x * 27, -12 + y * 25, 18, 16, 4, '#d9ddd2');
  r.label = text(r, label, 0, 40, 46, C.ink, { 'font-weight': 800 });
  return r;
}
export function house(parent, o = {}) {
  const { color = C.gold, wall = C.cream, w = 1, lit = true } = o;
  const r = g(parent, { class: 'house' });
  shadow(r, 92, 12, 4, .3);
  rr(r, -72, -112, 144, 112, 6, wall);
  path(r, 'M-92 -104 L0 -186 L92 -104 Z', color);
  rr(r, -18, -64, 36, 64, 6, C.mossDeep);
  r.windowL = rr(r, -56, -88, 28, 28, 5, lit ? C.amber : '#4b5c52');
  r.windowR = rr(r, 28, -88, 28, 28, 5, lit ? C.amber : '#4b5c52');
  return r;
}
export function building(parent, o = {}) {
  const { w = 170, h = 300, logo = true } = o;
  const r = g(parent, { class: 'building' });
  shadow(r, w * .62, 12, 4, .3);
  rr(r, -w / 2, -h, w, h, 8, 'url(#grad-building)', { stroke: '#3b7a55', 'stroke-width': 2 });
  r.windows = [];
  for (let y = 0; y < Math.floor((h - 90) / 42); y++) for (let x = 0; x < 3; x++) r.windows.push(rr(r, -w / 2 + 22 + x * ((w - 44) / 3), -h + 80 + y * 42, (w - 44) / 3 - 12, 22, 4, (x + y) % 3 ? '#4f8f6a' : C.gold, { opacity: .85 }));
  if (logo) { const c = g(r); place(c, 0, -h + 42, .34); chip(c, { glow: false }); }
  return r;
}
export function server(parent, o = {}) {
  const { h = 3 } = o;
  const r = g(parent, { class: 'server' });
  shadow(r, 78, 11, 4, .32);
  rr(r, -62, -h * 52 - 14, 124, h * 52 + 14, 12, 'url(#grad-server)', { stroke: C.sky, 'stroke-width': 3 });
  r.lights = [];
  for (let i = 0; i < h; i++) {
    rr(r, -50, -h * 52 + i * 52, 100, 38, 6, '#0b1a14');
    r.lights.push(circ(r, -34, -h * 52 + 19 + i * 52, 6, i % 2 ? C.gold : C.mint));
    stroke(r, `M-18 ${-h * 52 + 19 + i * 52} H34`, C.skyDeep, 5);
  }
  return r;
}
export function tree(parent, o = {}) {
  const { leaf = C.moss, s = 1, wilt = false } = o;
  const r = g(parent, { class: 'tree' });
  shadow(r, 60, 10);
  rr(r, -10, -110, 20, 110, 8, '#6a4a2e');
  r.crown = g(r);
  for (const [x, y, rad] of [[0, -170, 62], [-48, -132, 44], [48, -132, 44], [0, -118, 50]]) circ(r.crown, x, y, rad, wilt ? '#8c8a5a' : leaf);
  circ(r.crown, -18, -190, 20, '#ffffff', { opacity: .12 });
  return r;
}
export function leafShape(parent, color = C.moss) {
  const r = g(parent);
  path(r, 'M0 0 C-30 -12 -32 -52 0 -70 C32 -52 30 -12 0 0Z', color);
  stroke(r, 'M0 -4 V-58', C.mossDeep, 3);
  return r;
}
export function sun(parent) {
  const r = g(parent, { class: 'sun' });
  halo(r, 180, 'gold');
  r.rays = g(r);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; stroke(r.rays, `M${Math.cos(a) * 74} ${Math.sin(a) * 74} L${Math.cos(a) * 100} ${Math.sin(a) * 100}`, C.gold, 9); }
  circ(r, 0, 0, 58, 'url(#grad-sun)');
  return r;
}
export function cloud(parent, color = C.mist) {
  const r = g(parent, { class: 'cloud' });
  for (const [x, y, rad] of [[-40, 0, 34], [0, -18, 44], [42, 0, 32], [0, 10, 36]]) circ(r, x, y, rad, color);
  return r;
}
export function heart(parent, color = C.clay, s = 1) {
  const r = g(parent, { class: 'heart' });
  const h = path(r, 'M0 30 C-60 -6 -46 -64 0 -34 C46 -64 60 -6 0 30Z', color);
  path(r, 'M-26 -30 q-10 6 -8 20', 'none', { stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .45 });
  r.setAttribute('transform', `scale(${s})`);
  r.shape = h;
  return r;
}
export function heartOutline(parent, color = C.mint) {
  const r = g(parent);
  r.shape = path(r, 'M0 30 C-60 -6 -46 -64 0 -34 C46 -64 60 -6 0 30Z', 'none', { stroke: color, 'stroke-width': 7, 'stroke-dasharray': '14 12', 'stroke-linejoin': 'round' });
  return r;
}
export function star(parent, color = C.gold, rad = 30) {
  const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? rad * .45 : rad; pts.push(`${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}`); }
  return el('polygon', { points: pts.join(' '), fill: color }, parent);
}
export function sparkle(parent, color = C.gold, rad = 26) {
  return path(parent, `M0 ${-rad} Q${rad * .18} ${-rad * .18} ${rad} 0 Q${rad * .18} ${rad * .18} 0 ${rad} Q${-rad * .18} ${rad * .18} ${-rad} 0 Q${-rad * .18} ${-rad * .18} 0 ${-rad}Z`, color);
}
export function bulb(parent, o = {}) {
  const { lit = true } = o;
  const r = g(parent, { class: 'bulb' });
  if (lit) r.halo = halo(r, 120, 'gold', 0, -20);
  path(r, 'M-40 -24 a40 40 0 1 1 80 0 c0 22 -16 30 -18 48 h-44 c-2 -18 -18 -26 -18 -48z', lit ? C.gold : C.mist);
  rr(r, -22, 28, 44, 10, 4, C.mist); rr(r, -20, 40, 40, 10, 4, C.mist); rr(r, -12, 52, 24, 8, 4, C.mossDeep);
  stroke(r, 'M-10 18 l-6 -26 l16 8 l16 -8 l-6 26', C.goldDeep, 4);
  return r;
}
export function brain(parent, o = {}) {
  const { color = C.rose } = o;
  const r = g(parent, { class: 'brain' });
  path(r, 'M-6 -78 c-30 -10 -60 6 -62 34 c-24 8 -30 46 -10 62 c-6 30 24 50 50 38 c10 12 22 12 28 4 z', color);
  path(r, 'M6 -78 c30 -10 60 6 62 34 c24 8 30 46 10 62 c6 30 -24 50 -50 38 c-10 12 -22 12 -28 4 z', color);
  const lines = g(r);
  for (const d of ['M-44 -40 q14 4 18 20', 'M-52 8 q20 -6 30 8', 'M-30 44 q4 -16 20 -18', 'M44 -40 q-14 4 -18 20', 'M52 8 q-20 -6 -30 8', 'M30 44 q-4 -16 -20 -18', 'M0 -74 V70']) stroke(lines, d, '#b86f6c', 5);
  r.lines = lines;
  return r;
}
export function gear(parent, o = {}) {
  const { r: rad = 50, teeth = 10, color = C.gold } = o;
  const r = g(parent, { class: 'gear' });
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, a1 = a0 + Math.PI / teeth * .5, a2 = a0 + Math.PI / teeth, a3 = a0 + Math.PI / teeth * 1.5;
    const o1 = rad + rad * .22;
    d += `${i ? 'L' : 'M'}${Math.cos(a0) * rad} ${Math.sin(a0) * rad} L${Math.cos(a1) * o1} ${Math.sin(a1) * o1} L${Math.cos(a2) * o1} ${Math.sin(a2) * o1} L${Math.cos(a3) * rad} ${Math.sin(a3) * rad} `;
  }
  path(r, d + 'Z', color);
  circ(r, 0, 0, rad * .36, C.deep);
  return r;
}
export function compass(parent) {
  const r = g(parent, { class: 'compass' });
  circ(r, 0, 0, 110, C.cream); circ(r, 0, 0, 110, 'none', { stroke: C.goldDeep, 'stroke-width': 12 });
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; stroke(r, `M${Math.cos(a) * 84} ${Math.sin(a) * 84} L${Math.cos(a) * (i % 4 ? 92 : 98)} ${Math.sin(a) * (i % 4 ? 92 : 98)}`, C.mossDeep, i % 4 ? 3 : 6); }
  r.needle = g(r);
  path(r.needle, 'M0 -78 L18 0 L-18 0Z', C.clay); path(r.needle, 'M0 78 L18 0 L-18 0Z', C.mist);
  circ(r, 0, 0, 10, C.ink);
  return r;
}
export function scale(parent) {
  const r = g(parent, { class: 'scale' });
  shadow(r, 110, 12, 4);
  path(r, 'M-70 0 h140 l-20 -24 h-100z', C.goldDeep);
  rr(r, -8, -250, 16, 230, 6, C.goldDeep);
  circ(r, 0, -256, 16, C.gold);
  r.beam = g(r);
  rr(r.beam, -230, -262, 460, 14, 7, C.gold);
  r.panL = g(r.beam); r.panR = g(r.beam);
  for (const [p, x] of [[r.panL, -210], [r.panR, 210]]) {
    stroke(p, `M${x} -255 L${x - 60} -150 M${x} -255 L${x + 60} -150`, C.goldDeep, 3);
    path(p, `M${x - 80} -150 h160 q-10 34 -80 34 q-70 0 -80 -34z`, C.gold);
    p.dataset.x = x;
  }
  return r;
}
export function globe(parent) {
  const r = g(parent, { class: 'globe' });
  halo(r, 220, 'sky');
  circ(r, 0, 0, 140, '#3c78a6');
  r.land = g(r);
  for (const d of ['M-90 -70 q30 -30 70 -14 q20 20 -10 40 q-30 10 -36 40 q-26 4 -34 -24 q-6 -24 10 -42z', 'M30 -40 q40 -20 70 10 q14 30 -10 50 q-20 40 -50 30 q-20 -30 -10 -60z', 'M-40 60 q30 -10 50 20 q-10 30 -40 30 q-20 -20 -10 -50z']) path(r.land, d, C.moss);
  circ(r, 0, 0, 140, 'none', { stroke: '#ffffff', 'stroke-width': 3, opacity: .25 });
  path(r, 'M-90 -90 q30 -40 90 -46', 'none', { stroke: '#ffffff', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: .25 });
  return r;
}
export function eye(parent) {
  const r = g(parent, { class: 'eye' });
  path(r, 'M-120 0 Q0 -90 120 0 Q0 90 -120 0Z', C.cream);
  r.iris = g(r);
  circ(r.iris, 0, 0, 44, C.mintDeep); circ(r.iris, 0, 0, 20, C.ink); circ(r.iris, 12, -12, 8, '#fff');
  path(r, 'M-120 0 Q0 -90 120 0', 'none', { stroke: C.ink, 'stroke-width': 6 });
  return r;
}
export function coin(parent) {
  const r = g(parent, { class: 'coin' });
  circ(r, 0, 0, 30, C.gold); circ(r, 0, 0, 22, 'none', { stroke: C.goldDeep, 'stroke-width': 4 });
  text(r, '$', 0, 11, 30, C.goldDeep, { 'font-weight': 800 });
  return r;
}
export function shield(parent, color = C.mint) {
  const r = g(parent, { class: 'shield' });
  path(r, 'M0 -80 L66 -54 Q66 40 0 80 Q-66 40 -66 -54Z', color);
  stroke(r, 'M-26 0 l18 20 l36 -40', C.deep, 12);
  return r;
}
export function check(parent, color = C.mint) { const r = g(parent); circ(r, 0, 0, 36, color); stroke(r, 'M-16 0 l11 12 l22 -24', C.deep, 9); return r; }
export function cross(parent, color = C.clay) { const r = g(parent); circ(r, 0, 0, 36, color); stroke(r, 'M-13 -13 l26 26 M13 -13 l-26 26', C.deep, 9); return r; }
export function question(parent, o = {}) {
  const { r: rad = 46, color = C.gold } = o;
  const r = g(parent, { class: 'question' });
  halo(r, rad * 2.6, 'gold');
  circ(r, 0, 0, rad, color);
  text(r, '?', 0, rad * .42, rad * 1.25, C.deep, { 'font-weight': 800, 'font-family': "'Source Serif 4', Georgia, serif" });
  return r;
}
export function phone(parent, o = {}) {
  const { glow = true } = o;
  const r = g(parent, { class: 'phone' });
  if (glow) halo(r, 90, 'sky');
  rr(r, -34, -62, 68, 124, 12, C.ink);
  r.screen = rr(r, -28, -52, 56, 100, 6, C.sky);
  return r;
}
export function laptop(parent) {
  const r = g(parent, { class: 'laptop' });
  rr(r, -92, -122, 184, 118, 10, C.ink);
  r.screen = rr(r, -82, -112, 164, 98, 6, '#24493a');
  path(r, 'M-120 0 h240 l-14 -10 h-212z', C.mist);
  r.lines = [];
  for (let i = 0; i < 4; i++) r.lines.push(stroke(r, `M-66 ${-92 + i * 20} H${50 - (i % 2) * 30}`, C.mint, 6));
  return r;
}
export function book(parent, color = C.clay) {
  const r = g(parent, { class: 'book' });
  rr(r, -46, -60, 92, 120, 8, color); rr(r, -38, -60, 6, 120, 2, '#000', { opacity: .2 });
  rr(r, -24, -36, 54, 10, 4, C.cream, { opacity: .8 });
  return r;
}
export function gradCap(parent) {
  const r = g(parent, { class: 'gradcap' });
  path(r, 'M0 -50 L110 -10 L0 30 L-110 -10Z', C.ink);
  path(r, 'M-60 8 v40 q60 30 120 0 v-40 l-60 22z', '#26332b');
  stroke(r, 'M80 -2 v58', C.gold, 5); circ(r, 80, 60, 9, C.gold);
  return r;
}
export function atom(parent) {
  const r = g(parent, { class: 'atom' });
  r.orbits = g(r);
  for (const a of [0, 60, 120]) el('ellipse', { cx: 0, cy: 0, rx: 110, ry: 38, fill: 'none', stroke: C.sky, 'stroke-width': 6, transform: `rotate(${a})` }, r.orbits);
  r.electrons = [0, 60, 120].map(a => { const e = g(r.orbits, { transform: `rotate(${a})` }); return circ(e, 110, 0, 11, C.gold); });
  circ(r, 0, 0, 22, C.clay);
  return r;
}
export function flask(parent, color = C.mint) {
  const r = g(parent, { class: 'flask' });
  path(r, 'M-22 -90 h44 v52 l52 92 q8 18 -12 18 h-124 q-20 0 -12 -18 l52 -92z', C.cream, { opacity: .9 });
  r.liquid = path(r, 'M-58 20 h116 l18 34 q8 18 -12 18 h-128 q-20 0 -12 -18z', color);
  rr(r, -30, -100, 60, 14, 6, C.mist);
  return r;
}
export function pen(parent, color = C.gold) {
  const r = g(parent, { class: 'pen' });
  rr(r, -9, -120, 18, 100, 6, color);
  path(r, 'M-9 -20 h18 l-9 26z', C.cream); path(r, 'M-3 -2 h6 l-3 8z', C.ink);
  return r;
}
export function wheelchair(parent) {
  const r = g(parent, { class: 'wheelchair' });
  r.wheel = g(r);
  circ(r.wheel, 0, -56, 56, 'none', { stroke: C.sky, 'stroke-width': 9 });
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; stroke(r.wheel, `M${Math.cos(a) * 50} ${-56 + Math.sin(a) * 50} L${-Math.cos(a) * 50} ${-56 - Math.sin(a) * 50}`, C.sky, 3); }
  circ(r, 60, -12, 12, C.sky);
  stroke(r, 'M-10 -150 V-80 H50 L62 -20', C.mist, 9);
  return r;
}
export function cane(parent) { return stroke(parent, 'M0 0 V-120 q0 -20 18 -20 q16 0 16 14', '#8a6a46', 8); }
export function bubble(parent, o = {}) {
  const { r: rad = 120, color = C.sky } = o;
  const r = g(parent, { class: 'bubble' });
  circ(r, 0, 0, rad, color, { opacity: .12 });
  circ(r, 0, 0, rad, 'none', { stroke: color, 'stroke-width': 4, opacity: .7 });
  path(r, `M${-rad * .6} ${-rad * .4} q${rad * .2} ${-rad * .35} ${rad * .55} ${-rad * .45}`, 'none', { stroke: '#fff', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .45 });
  return r;
}
export function thought(parent, o = {}) {
  const { w = 300, h = 190 } = o;
  const r = g(parent, { class: 'thought' });
  el('ellipse', { cx: 0, cy: 0, rx: w / 2, ry: h / 2, fill: C.cream }, r);
  circ(r, -w * .28, h * .62, 18, C.cream); circ(r, -w * .38, h * .86, 10, C.cream);
  r.inner = g(r);
  return r;
}
export function speech(parent, o = {}) {
  const { w = 240, h = 120, flip = false } = o;
  const r = g(parent, { class: 'speech' });
  rr(r, -w / 2, -h / 2, w, h, 30, C.cream);
  path(r, flip ? `M${w * .2} ${h / 2 - 2} l20 34 l6 -36z` : `M${-w * .2} ${h / 2 - 2} l-20 34 l-6 -36z`, C.cream);
  r.inner = g(r);
  return r;
}
export function key(parent) {
  const r = g(parent, { class: 'key' });
  circ(r, -46, 0, 28, 'none', { stroke: C.gold, 'stroke-width': 14 });
  stroke(r, 'M-18 0 H66 M44 0 v20 M60 0 v14', C.gold, 14);
  return r;
}
export function briefcase(parent) {
  const r = g(parent, { class: 'briefcase' });
  rr(r, -60, -80, 120, 84, 10, '#7b5636'); rr(r, -22, -98, 44, 22, 6, 'none', { stroke: '#7b5636', 'stroke-width': 8 });
  rr(r, -60, -50, 120, 8, 0, '#5d3f27');
  return r;
}
export function chair(parent) {
  const r = g(parent, { class: 'chair' });
  rr(r, -70, -150, 26, 150, 10, C.clayDeep); rr(r, -70, -62, 140, 30, 10, C.clay); rr(r, 44, -62, 26, 62, 8, C.clayDeep);
  path(r, 'M-80 0 q80 26 160 0', 'none', { stroke: C.clayDeep, 'stroke-width': 9, 'stroke-linecap': 'round' });
  return r;
}
export function balloon(parent, label = '', color = C.clay) {
  const r = g(parent, { class: 'balloon' });
  stroke(r, 'M0 50 q-12 40 6 90', C.mist, 3);
  el('ellipse', { cx: 0, cy: 0, rx: 44, ry: 52, fill: color }, r);
  path(r, 'M-6 50 h12 l-6 10z', color);
  path(r, 'M-22 -24 q6 -14 18 -18', 'none', { stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .5 });
  r.label = text(r, label, 0, 16, 46, C.cream, { 'font-weight': 800 });
  return r;
}
export function hourglass(parent) {
  const r = g(parent, { class: 'hourglass' });
  rr(r, -60, -110, 120, 14, 6, C.goldDeep); rr(r, -60, 96, 120, 14, 6, C.goldDeep);
  path(r, 'M-46 -96 h92 q0 60 -40 90 q40 30 40 92 h-92 q0 -62 40 -92 q-40 -30 -40 -90z', C.cream, { opacity: .35 });
  r.top = path(r, 'M-36 -80 h72 q-4 40 -36 70 q-32 -30 -36 -70z', C.gold);
  r.bottom = path(r, 'M-38 92 q38 -50 76 0z', C.gold);
  return r;
}
export function door(parent, o = {}) {
  const { color = C.mossDeep } = o;
  const r = g(parent, { class: 'door' });
  rr(r, -56, -210, 112, 210, 8, '#0b1f14');
  r.leaf = g(r);
  rr(r.leaf, -56, -210, 112, 210, 8, color); circ(r.leaf, 34, -104, 7, C.gold);
  return r;
}
export function stamp(parent) {
  const r = g(parent, { class: 'stamp' });
  rr(r, -14, -90, 28, 60, 10, '#7b5636'); circ(r, 0, -96, 22, '#7b5636'); rr(r, -42, -34, 84, 30, 6, C.clay);
  return r;
}
export function paperStack(parent, n = 7) {
  const r = g(parent, { class: 'stack' });
  r.sheets = [];
  for (let i = 0; i < n; i++) r.sheets.push(rr(r, -70 + (i % 2) * 6, -20 - i * 16, 140, 14, 3, i % 2 ? C.cream : '#e9e3d1'));
  return r;
}
export function cradle(parent) {
  const r = g(parent, { class: 'cradle' });
  path(r, 'M-60 -40 h120 q0 50 -60 50 q-60 0 -60 -50z', C.cream);
  circ(r, -20, -54, 22, SKIN[1]); rr(r, -6, -66, 52, 30, 14, C.sky);
  return r;
}
export function crayon(parent, color) {
  const r = g(parent);
  rr(r, -10, -60, 20, 90, 4, color); path(r, 'M-10 -60 l10 -24 l10 24z', color); rr(r, -10, -30, 20, 8, 0, '#000', { opacity: .2 });
  return r;
}
export function musicNote(parent, color = C.gold) {
  const r = g(parent);
  el('ellipse', { cx: -10, cy: 22, rx: 16, ry: 12, fill: color, transform: 'rotate(-20 -10 22)' }, r);
  stroke(r, 'M4 18 V-40 l26 10', color, 7);
  return r;
}
export function flower(parent, color = C.rose) {
  const r = g(parent);
  stroke(r, 'M0 0 V-70', C.mossDeep, 6);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; circ(r, Math.cos(a) * 18, -80 + Math.sin(a) * 18, 14, color); }
  circ(r, 0, -80, 12, C.gold);
  return r;
}
export function factorySmoke(parent) {
  const r = g(parent, { class: 'smoke' });
  r.puffs = [0, 1, 2, 3].map(i => circ(r, i * 18, -i * 50, 26 + i * 8, '#58615a', { opacity: .55 }));
  return r;
}
export function warning(parent) {
  const r = g(parent, { class: 'warning' });
  path(r, 'M0 -60 L56 44 H-56Z', C.clay, { 'stroke-linejoin': 'round' });
  rr(r, -6, -24, 12, 40, 5, C.deep); circ(r, 0, 30, 7, C.deep);
  return r;
}
export function ramp(parent, w = 300, h = 80) { return path(parent, `M0 0 L${w} ${-h} V0Z`, C.mossDeep); }
export function puzzle(parent, color = C.gold) {
  return path(parent, 'M-40 -40 h28 a12 12 0 1 1 24 0 h28 v28 a12 12 0 1 0 0 24 v28 h-28 a12 12 0 1 1 -24 0 h-28z', color);
}
export function robotHand(parent) {
  const r = g(parent, { class: 'robot-hand' });
  rr(r, -170, -16, 150, 32, 14, '#4f8a72');
  rr(r, -30, -34, 60, 68, 16, '#5fa286', { stroke: C.mint, 'stroke-width': 4 });
  r.fingers = g(r);
  stroke(r.fingers, 'M30 -22 l34 -10 M30 0 l40 0 M30 22 l34 10', '#5fa286', 14);
  circ(r, 0, 0, 7, C.mint);
  return r;
}
export function muscle(parent) {
  const r = g(parent, { class: 'muscle' });
  path(r, 'M-70 40 q-10 -60 30 -80 q26 -50 64 -40 q-10 30 -38 32 q40 -6 60 40 q20 50 -40 60 z', C.rose);
  return r;
}
export function steeringWheel(parent) {
  const r = g(parent, { class: 'wheel' });
  circ(r, 0, 0, 80, 'none', { stroke: C.gold, 'stroke-width': 16 });
  stroke(r, 'M-74 0 H74 M0 0 V74', C.gold, 12);
  circ(r, 0, 0, 20, C.goldDeep);
  return r;
}
export function powerLine(parent, x1, y1, x2, y2) {
  return stroke(parent, `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 40} ${x2} ${y2}`, C.mist, 4, { opacity: .7 });
}
export function arrowPath(parent, d, color = C.gold, w = 8) {
  const r = g(parent);
  r.line = stroke(r, d, color, w, { 'stroke-dasharray': '1 0' });
  return r;
}
