/* Sets, props and light for the motion scenes.
   Every scene is a full-bleed 1600 × 900 picture built in three depth layers
   (back, mid, front) so the camera can drift with parallax. Light comes from
   the upper left; surfaces carry a soft gradient, a contact shadow, and a
   highlight edge. Palettes are per location, like a film's colour script. */

import { el, g, id, place } from './kit.js';
import { shade, mix } from './cast.js';

const P = (p, d, fill, extra = {}) => el('path', { d, fill, ...extra }, p);
const R = (p, x, y, w, h, r, fill, extra = {}) => el('rect', { x, y, width: w, height: h, rx: r, fill, ...extra }, p);
const Cc = (p, cx, cy, r, fill, extra = {}) => el('circle', { cx, cy, r, fill, ...extra }, p);
const L = (p, d, stroke, w, extra = {}) => el('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, p);

export const defsOf = n => (n.ownerSVGElement || n).querySelector('defs');
/* A gradient on demand. dir: 'v' (top→bottom), 'h', 'd' (diagonal), or 'r' (radial). */
export function grad(node, stops, dir = 'v', extra = {}) {
  const d = defsOf(node), gid = id('g');
  const tag = dir === 'r' ? 'radialGradient' : 'linearGradient';
  const coords = { v: { x1: 0, y1: 0, x2: 0, y2: 1 }, h: { x1: 0, y1: 0, x2: 1, y2: 0 }, d: { x1: 0, y1: 0, x2: 1, y2: 1 }, r: {} }[dir];
  const gr = el(tag, { id: gid, ...coords, ...extra }, d);
  stops.forEach((s, i) => { const [c, o = 1, off] = Array.isArray(s) ? s : [s]; el('stop', { offset: off ?? i / (stops.length - 1), 'stop-color': c, 'stop-opacity': o }, gr); });
  return `url(#${gid})`;
}
export const glow = (p, x, y, r, color, o = .6) => Cc(p, x, y, r, grad(p, [[color, o], [color, o * .35, .45], [color, 0]], 'r'));
export const contact = (p, x, y, rx, ry = rx * .14, o = .28) => el('ellipse', { cx: x, cy: y, rx, ry, fill: grad(p, [['#000', o], ['#000', 0]], 'r') }, p);

/* ---------- palettes ---------- */
export const PAL = {
  clinic: { wall: '#d7e8e1', wallDark: '#b9d4ca', trim: '#9cc3b6', floor: '#efe6d6', floorDark: '#d8ccb6', accent: '#2f7f73', warm: '#ffd9a0' },
  home: { wall: '#f1d8bd', wallDark: '#dcb995', trim: '#c79a72', floor: '#b98a5e', floorDark: '#94693f', accent: '#d9805f', warm: '#ffcf8a' },
  dusk: { wall: '#7e6f8f', wallDark: '#5f526f', trim: '#4c4160', floor: '#8a6a5a', floorDark: '#6b4f43', accent: '#f2a65a', warm: '#ffc27a' },
  office: { wall: '#e9e4d8', wallDark: '#d4cdbb', trim: '#bfb59f', floor: '#9fa7a0', floorDark: '#7f8780', accent: '#103d21', warm: '#ffe2ad' },
  night: { wall: '#22304f', wallDark: '#18223a', trim: '#121a2d', floor: '#2b3550', floorDark: '#1d2539', accent: '#7fd6c2', warm: '#ffc27a' },
  school: { wall: '#f3e7c9', wallDark: '#e3d2a6', trim: '#c9b07a', floor: '#c99a6b', floorDark: '#a77a4f', accent: '#2f7f73', warm: '#ffe2ad' }
};

/* ---------- interiors ---------- */
/* A room: back wall with wainscot, skirting, floor in perspective. */
export function room(layer, pal, { horizon = 640, wainscot = true } = {}) {
  const r = g(layer, { class: 'room' });
  R(r, -200, -200, 2000, horizon + 200, 0, grad(r, [shade(pal.wall, .06), pal.wall, pal.wallDark]));
  if (wainscot) {
    R(r, -200, horizon - 170, 2000, 170, 0, grad(r, [pal.trim, shade(pal.trim, -.12)]));
    R(r, -200, horizon - 176, 2000, 10, 0, shade(pal.trim, .2));
  }
  R(r, -200, horizon - 18, 2000, 18, 0, shade(pal.trim, -.25));
  // Floor with perspective planks
  P(r, `M-200 ${horizon} H1800 V1100 H-200Z`, grad(r, [pal.floor, pal.floorDark]));
  for (let i = -8; i <= 8; i++) L(r, `M${800 + i * 110} ${horizon} L${800 + i * 330} 1100`, shade(pal.floorDark, -.12), 2, { opacity: .35 });
  R(r, -200, horizon, 2000, 60, 0, grad(r, [['#000', .18], ['#000', 0]]));
  return r;
}
/* Window with sky, frame and optional blinds; returns .sky and .scene for outside life. */
export function windowFrame(layer, x, y, w, h, { sky = ['#bfe3ef', '#f3e6c6'], blinds = 0, frame = '#f7f3ea', bars = true } = {}) {
  const wnd = g(layer, { class: 'window' });
  place(wnd, x, y);
  const cid = id('win');
  const cp = el('clipPath', { id: cid }, wnd); R(cp, 0, 0, w, h, 6);
  const inner = g(wnd, { 'clip-path': `url(#${cid})` });
  wnd.skyRect = R(inner, 0, 0, w, h, 0, grad(inner, sky));
  wnd.scene = g(inner);
  wnd.glass = g(inner);
  P(wnd.glass, `M${w * .12} 0 L${w * .42} 0 L${w * .1} ${h} L${-w * .2} ${h}Z`, '#ffffff', { opacity: .12 });
  P(wnd.glass, `M${w * .55} 0 L${w * .65} 0 L${w * .35} ${h} L${w * .25} ${h}Z`, '#ffffff', { opacity: .08 });
  if (blinds) { wnd.blinds = g(inner); for (let i = 0; i < blinds; i++) R(wnd.blinds, 0, i * (h / blinds), w, h / blinds * .62, 0, '#f4efe2', { opacity: .92 }); }
  R(wnd, -14, -14, w + 28, h + 28, 10, 'none', { stroke: frame, 'stroke-width': 18 });
  if (bars) { L(wnd, `M${w / 2} 0 V${h}`, frame, 10); L(wnd, `M0 ${h * .45} H${w}`, frame, 8); }
  R(wnd, -26, h + 8, w + 52, 18, 6, shade(frame, -.08));
  R(wnd, -26, h + 24, w + 52, 10, 4, '#000', { opacity: .12 });
  return wnd;
}
/* A shaft of window light falling across the room. */
export function lightShaft(layer, pts, color = '#fff6dc', o = .22) {
  return P(layer, pts, grad(layer, [[color, o], [color, 0]], 'd'));
}
export function plant(layer, x, y, s = 1, { pot = '#d9805f', leaf = '#4f9a6a' } = {}) {
  const p = g(layer, { class: 'plant' }); place(p, x, y, s);
  contact(p, 0, 2, 70);
  p.leaves = g(p);
  const leaves = [[-6, -120, -40], [8, -150, 10], [0, -110, 40], [-10, -170, -15], [14, -130, 60], [-14, -100, -70], [4, -175, 30]];
  for (const [dx, len, a] of leaves) {
    const lf = g(p.leaves); lf.setAttribute('transform', `translate(${dx} -96) rotate(${a})`);
    P(lf, `M0 0 C-26 ${-len * .35} -24 ${-len * .8} 0 ${-len} C24 ${-len * .8} 26 ${-len * .35} 0 0Z`, grad(lf, [shade(leaf, .25), leaf, shade(leaf, -.25)], 'h'));
    L(lf, `M0 0 L0 ${-len * .92}`, shade(leaf, -.35), 2.5, { opacity: .6 });
  }
  P(p, 'M-52 -100 L52 -100 L42 0 L-42 0Z', grad(p, [shade(pot, .1), shade(pot, -.15)], 'h'));
  R(p, -58, -112, 116, 20, 6, shade(pot, .12));
  return p;
}
export function desk(layer, x, y, w = 420, { top = '#c9a27a', leg = '#8a6a4a' } = {}) {
  const d = g(layer, { class: 'desk' }); place(d, x, y);
  contact(d, 0, 4, w * .62);
  R(d, -w / 2 + 20, -160, 16, 160, 4, leg); R(d, w / 2 - 36, -160, 16, 160, 4, leg);
  R(d, -w / 2 + 30, -150, w - 60, 80, 6, shade(top, -.25));
  R(d, -w / 2, -186, w, 30, 8, grad(d, [shade(top, .15), top]));
  R(d, -w / 2, -162, w, 8, 4, shade(top, -.3));
  return d;
}
export function monitor(layer, x, y, s = 1, { screen = '#163a4a' } = {}) {
  const m = g(layer, { class: 'monitor' }); place(m, x, y, s);
  R(m, -16, -80, 32, 70, 4, '#4a5560'); R(m, -60, -14, 120, 14, 6, '#3a444d');
  R(m, -170, -290, 340, 216, 16, '#20262c');
  m.screen = R(m, -158, -278, 316, 192, 8, screen);
  m.content = g(m);
  const cid = id('scr'); const cp = el('clipPath', { id: cid }, m); R(cp, -158, -278, 316, 192, 8);
  m.content.setAttribute('clip-path', `url(#${cid})`);
  P(m, 'M-158 -278 L-40 -278 L-120 -86 L-158 -86Z', '#ffffff', { opacity: .06 });
  return m;
}
/* A glowing X-ray of the chest on a screen — the "scan" AI might read. */
export function xray(layer, x, y, s = 1) {
  const r = g(layer, { class: 'xray' }); place(r, x, y, s);
  P(r, 'M-70 -80 C-40 -100 40 -100 70 -80 L80 60 C40 80 -40 80 -80 60Z', '#0d2633', { opacity: .9 });
  L(r, 'M0 -90 V70', '#9ecbd8', 6, { opacity: .8 });
  for (let i = 0; i < 6; i++) { const yy = -64 + i * 22; L(r, `M-6 ${yy} C-30 ${yy - 6} -56 ${yy + 6} -66 ${yy + 22}`, '#b8e0ea', 5, { opacity: .75 }); L(r, `M6 ${yy} C30 ${yy - 6} 56 ${yy + 6} 66 ${yy + 22}`, '#b8e0ea', 5, { opacity: .75 }); }
  P(r, 'M-58 -50 C-30 -60 -14 -20 -18 30 C-30 50 -56 40 -62 20Z', '#5a8fa3', { opacity: .35 });
  P(r, 'M58 -50 C30 -60 14 -20 18 30 C30 50 56 40 62 20Z', '#5a8fa3', { opacity: .35 });
  return r;
}
export function cabinet(layer, x, y, { color = '#e7e1d2' } = {}) {
  const c = g(layer); place(c, x, y);
  contact(c, 0, 2, 120);
  R(c, -110, -260, 220, 260, 8, grad(c, [shade(color, .05), shade(color, -.1)], 'h'));
  for (let i = 0; i < 3; i++) { R(c, -96, -246 + i * 82, 192, 70, 6, shade(color, .05)); R(c, -24, -216 + i * 82, 48, 8, 4, shade(color, -.35)); }
  return c;
}
export function wallClock(layer, x, y, r = 54) {
  const c = g(layer, { class: 'wallclock' }); place(c, x, y);
  Cc(c, 4, 6, r + 6, '#000', { opacity: .12 });
  Cc(c, 0, 0, r + 6, '#3b4a52'); Cc(c, 0, 0, r, '#fbf8f1');
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; L(c, `M${Math.sin(a) * r * .78} ${-Math.cos(a) * r * .78} L${Math.sin(a) * r * .9} ${-Math.cos(a) * r * .9}`, '#3b4a52', i % 3 ? 2.5 : 5); }
  c.hour = g(c); L(c.hour, `M0 0 V${-r * .5}`, '#22292e', 6);
  c.minute = g(c); L(c.minute, `M0 0 V${-r * .75}`, '#22292e', 4);
  Cc(c, 0, 0, 5, '#d9805f');
  return c;
}
export function wallCalendar(layer, x, y, s = 1, label = '') {
  const c = g(layer, { class: 'wallcal' }); place(c, x, y, s);
  R(c, -64, -70, 128, 150, 10, '#000', { opacity: .12, transform: 'translate(5 6)' });
  R(c, -64, -70, 128, 150, 10, '#fbf8f1');
  R(c, -64, -70, 128, 40, 10, '#d9805f'); R(c, -64, -44, 128, 14, 0, '#d9805f');
  L(c, 'M-34 -80 v20 M34 -80 v20', '#3b4a52', 8);
  c.label = el('text', { x: 0, y: 52, 'text-anchor': 'middle', 'font-family': "'Source Serif 4', Georgia, serif", 'font-weight': 700, 'font-size': 72, fill: '#22292e' }, c);
  c.label.textContent = label;
  return c;
}
export function lamp(layer, x, y, s = 1, { on = true, shade: sh = '#f4e3c3' } = {}) {
  const l = g(layer, { class: 'lamp' }); place(l, x, y, s);
  if (on) { l.light = glow(l, 0, -250, 260, '#ffd38a', .5); P(l, 'M-60 -230 L-200 0 H200 L60 -230Z', grad(l, [['#ffe2a8', .28], ['#ffe2a8', 0]])); }
  contact(l, 0, 2, 60);
  R(l, -6, -240, 12, 240, 4, '#5a4a3a'); P(l, 'M-46 0 h92 l-10 -16 h-72z', '#5a4a3a');
  P(l, 'M-70 -230 L-44 -320 H44 L70 -230Z', sh);
  P(l, 'M-70 -230 L-44 -320 H-20 L-36 -230Z', '#ffffff', { opacity: .3 });
  return l;
}
export function frame(layer, x, y, w, h, art = '#8fb27f') {
  const f = g(layer); place(f, x, y);
  R(f, 6, 8, w, h, 4, '#000', { opacity: .12 });
  R(f, 0, 0, w, h, 4, '#5a4a3a'); R(f, 10, 10, w - 20, h - 20, 2, '#fbf8f1');
  P(f, `M18 ${h - 18} L${w * .4} ${h * .45} L${w * .62} ${h * .7} L${w * .78} ${h * .5} L${w - 18} ${h - 18}Z`, art);
  Cc(f, w * .72, h * .3, Math.min(w, h) * .1, '#e7c178');
  return f;
}
export function shelf(layer, x, y, w = 260) {
  const s = g(layer); place(s, x, y);
  R(s, 0, 0, w, 12, 3, '#8a6a4a'); R(s, 0, 12, w, 6, 2, '#000', { opacity: .15 });
  const cols = ['#d9805f', '#2f7f73', '#e7c178', '#5b8fb8', '#8fb27f', '#b0563a'];
  let xx = 10; for (let i = 0; i < 9; i++) { const bw = 16 + (i * 7) % 12, bh = 58 + (i * 13) % 30; R(s, xx, -bh, bw, bh, 2, cols[i % cols.length]); xx += bw + 3; }
  return s;
}
export function chairOffice(layer, x, y, s = 1, color = '#2f3e4a') {
  const c = g(layer); place(c, x, y, s);
  contact(c, 0, 2, 90);
  L(c, 'M0 -150 V-20 M-60 0 L0 -20 L60 0', '#3a3a3a', 10);
  R(c, -80, -190, 160, 40, 16, color); R(c, -70, -380, 140, 190, 30, grad(c, [shade(color, .12), color], 'h'));
  return c;
}
export function waitingChairs(layer, x, y, n = 3, color = '#2f7f73') {
  const c = g(layer); place(c, x, y);
  contact(c, n * 70, 2, n * 90);
  for (let i = 0; i < n; i++) { const cx = i * 140; R(c, cx - 8, -120, 136, 26, 10, color); R(c, cx, -260, 120, 150, 24, grad(c, [shade(color, .14), color], 'h')); R(c, cx + 50, -94, 10, 94, 3, '#5f6a6a'); }
  R(c, -20, -12, n * 140 + 20, 12, 4, '#5f6a6a');
  return c;
}
export function door(layer, x, y, { color = '#c9a27a', w = 170, h = 380 } = {}) {
  const d = g(layer, { class: 'door' }); place(d, x, y);
  R(d, -w / 2 - 14, -h - 14, w + 28, h + 14, 4, '#f7f3ea');
  d.gap = R(d, -w / 2, -h, w, h, 2, '#2a2f2a');
  d.leaf = g(d); R(d.leaf, -w / 2, -h, w, h, 2, grad(d, [shade(color, .08), shade(color, -.1)], 'h'));
  R(d.leaf, -w / 2 + 20, -h + 24, w - 40, h * .38, 4, 'none', { stroke: shade(color, -.18), 'stroke-width': 3 });
  R(d.leaf, -w / 2 + 20, -h * .52, w - 40, h * .42, 4, 'none', { stroke: shade(color, -.18), 'stroke-width': 3 });
  Cc(d.leaf, w / 2 - 26, -h * .5, 8, '#e7c178');
  d.leaf.dataset.ox = -w / 2; d.leaf.dataset.oy = 0;
  return d;
}

/* ---------- exteriors ---------- */
export function sky(layer, top = '#8fcbe3', bottom = '#f6e6c8') {
  const s = g(layer, { class: 'sky' });
  s.rect = R(s, -200, -200, 2000, 1300, 0, grad(s, [top, bottom]));
  return s;
}
export function sunDisc(layer, x, y, r = 70, color = '#ffd27a') {
  const s = g(layer, { class: 'sun' }); place(s, x, y);
  glow(s, 0, 0, r * 4, color, .55);
  Cc(s, 0, 0, r, grad(s, ['#fff2c6', color]));
  return s;
}
export function cloudSoft(layer, x, y, s = 1, color = '#ffffff', o = .9) {
  const c = g(layer); place(c, x, y, s);
  P(c, 'M-120 30 C-150 30 -150 -10 -118 -12 C-116 -50 -62 -64 -40 -34 C-28 -76 40 -80 52 -30 C84 -50 128 -26 116 8 C150 10 150 30 120 30Z', color, { opacity: o });
  P(c, 'M-120 30 H120 C130 30 126 20 116 18 C60 24 -60 24 -118 18 C-126 20 -130 30 -120 30Z', '#000', { opacity: .05 });
  return c;
}
export function hills(layer, colors = ['#9cc78a', '#6fa86b', '#4f8a5a'], base = 900) {
  const h = g(layer, { class: 'hills' });
  P(h, `M-200 ${base - 330} C200 ${base - 420} 500 ${base - 300} 800 ${base - 360} C1100 ${base - 420} 1400 ${base - 300} 1800 ${base - 370} V1100 H-200Z`, colors[0]);
  P(h, `M-200 ${base - 230} C150 ${base - 300} 520 ${base - 200} 860 ${base - 260} C1200 ${base - 320} 1500 ${base - 220} 1800 ${base - 250} V1100 H-200Z`, colors[1]);
  P(h, `M-200 ${base - 140} C300 ${base - 180} 700 ${base - 110} 1000 ${base - 150} C1300 ${base - 190} 1600 ${base - 120} 1800 ${base - 140} V1100 H-200Z`, colors[2]);
  return h;
}
export function treeRound(layer, x, y, s = 1, { leaf = '#5a9a5f', trunk = '#7a5a3c' } = {}) {
  const t = g(layer, { class: 'tree' }); place(t, x, y, s);
  contact(t, 0, 2, 90);
  P(t, 'M-12 0 L-8 -140 C-8 -150 8 -150 8 -140 L12 0Z', trunk);
  L(t, 'M0 -100 L-34 -150 M2 -120 L30 -160', trunk, 8);
  t.crown = g(t);
  t.blobs = [[0, -220, 92], [-66, -170, 64], [66, -170, 64], [-30, -270, 60], [38, -264, 58]].map(([cx, cy, r]) => Cc(t.crown, cx, cy, r, leaf));
  t.shadeBlob = P(t.crown, 'M20 -310 C110 -280 140 -170 70 -110 C20 -90 -40 -100 -70 -120 C40 -140 60 -230 20 -310Z', '#000', { opacity: .14 });
  Cc(t.crown, -30, -250, 34, '#ffffff', { opacity: .12 });
  return t;
}
export function skyline(layer, base = 640, { color = '#2c4058', lit = '#ffd38a', far = '#3e5470' } = {}) {
  const s = g(layer, { class: 'skyline' });
  const far_ = g(s), near = g(s);
  const blocks = (grp, col, seed, hMin, hMax, w0, litO) => {
    let x = -200, i = 0;
    while (x < 1800) {
      const w = w0 + ((seed * (i + 3) * 37) % 60), h = hMin + ((seed * (i + 7) * 53) % (hMax - hMin));
      R(grp, x, base - h, w, h + 400, 2, col);
      for (let yy = base - h + 22; yy < base - 20; yy += 34) for (let xx = x + 12; xx < x + w - 16; xx += 26) if (((xx + yy + seed) * 7) % 5 < 2) R(grp, xx, yy, 12, 16, 2, lit, { opacity: litO });
      x += w + 8; i++;
    }
  };
  blocks(far_, far, 3, 160, 340, 70, .35);
  blocks(near, color, 7, 90, 250, 90, .8);
  s.far = far_; s.near = near;
  return s;
}

/* ---------- the AI symbol, premium ---------- */
export function aiCore(layer, x, y, s = 1, { label = 'AI', hud = true, face = false } = {}) {
  const a = g(layer, { class: 'ai-core' }); place(a, x, y, s);
  const inner = g(a); a.inner = inner;
  a.glow = glow(inner, 0, 0, 220, '#7fe0c4', .55);
  if (hud) {
    a.hud = g(inner);
    Cc(a.hud, 0, 0, 150, 'none', { stroke: '#a5e3c6', 'stroke-width': 2, opacity: .45, 'stroke-dasharray': '2 10' });
    Cc(a.hud, 0, 0, 128, 'none', { stroke: '#e7c178', 'stroke-width': 4, opacity: .7, 'stroke-dasharray': '60 40 10 40', 'stroke-linecap': 'round' });
  }
  const metal = grad(inner, ['#eef5f1', '#9db4a8']);
  for (let i = -1; i <= 1; i++) for (const [px, py, w, h] of [[i * 30 - 6, -112, 12, 26], [i * 30 - 6, 86, 12, 26], [-112, i * 30 - 6, 26, 12], [86, i * 30 - 6, 26, 12]]) R(inner, px, py, w, h, 5, metal);
  R(inner, -92, -84, 184, 184, 34, '#000', { opacity: .3 });
  R(inner, -92, -92, 184, 184, 34, grad(inner, ['#1f5a46', '#0b2a1f'], 'd'), { stroke: grad(inner, ['#bff0dc', '#e7c178'], 'd'), 'stroke-width': 6 });
  R(inner, -66, -66, 132, 132, 22, grad(inner, [['#7fe0c4', .55], ['#2c8a6c', .25], ['#0b2a1f', 0]], 'r'));
  P(inner, 'M-84 -60 C-84 -78 -78 -84 -60 -84 L40 -84 C10 -60 -40 -30 -84 10Z', '#ffffff', { opacity: .1 });
  if (face) {
    Cc(inner, -26, -10, 11, '#d6fff0'); Cc(inner, 26, -10, 11, '#d6fff0');
    L(inner, 'M-22 26 C-8 40 8 40 22 26', '#d6fff0', 7);
  } else {
    const t = el('text', { x: 0, y: 22, 'text-anchor': 'middle', 'font-family': "'Public Sans', system-ui, sans-serif", 'font-weight': 800, 'font-size': 62, 'letter-spacing': 2, fill: grad(inner, ['#ffffff', '#a5e3c6']) }, inner);
    t.textContent = label;
  }
  return a;
}
/* The glass question orb — "this is a question / I wonder". */
export function orb(layer, x, y, s = 1) {
  const o = g(layer, { class: 'orb' }); place(o, x, y, s);
  const i = g(o); o.inner = i;
  glow(i, 0, 0, 120, '#ffd38a', .5);
  Cc(i, 0, 0, 46, grad(i, ['#ffe9b8', '#e7a94e'], 'd'));
  Cc(i, 0, 0, 46, 'none', { stroke: '#fff3d6', 'stroke-width': 3, opacity: .7 });
  el('ellipse', { cx: -14, cy: -20, rx: 16, ry: 9, fill: '#fff', opacity: .55, transform: 'rotate(-30 -14 -20)' }, i);
  const t = el('text', { x: 0, y: 18, 'text-anchor': 'middle', 'font-family': "'Source Serif 4', Georgia, serif", 'font-weight': 700, 'font-size': 54, fill: '#5a3a12' }, i);
  t.textContent = '?';
  return o;
}
/* Floating dust motes in a light beam. */
export function dust(layer, box, n = 18, color = '#fff4d6') {
  const d = g(layer, { class: 'dust' });
  const [x, y, w, h] = box;
  d.motes = [];
  for (let k = 0; k < n; k++) d.motes.push(Cc(d, x + ((k * 97) % w), y + ((k * 53) % h), 1.6 + (k % 3), color, { opacity: .35 + (k % 4) * .1 }));
  return d;
}

/* Out-of-focus leaves in the extreme foreground, for depth. */
export function foliage(layer, x, y, s = 1, color = '#1f4a34') {
  const f = g(layer, { class: 'foliage' }); place(f, x, y, s);
  const leaves = [[-40, -10, -30, 210], [30, 0, 10, 240], [100, 20, 40, 190], [-90, 30, -60, 170], [160, 40, 70, 150]];
  for (const [dx, dy, a, len] of leaves) {
    const lf = g(f); lf.setAttribute('transform', `translate(${dx} ${dy}) rotate(${a})`);
    P(lf, `M0 0 C-50 ${-len * .35} -44 ${-len * .8} 0 ${-len} C44 ${-len * .8} 50 ${-len * .35} 0 0Z`, color, { opacity: .96 });
    L(lf, `M0 0 L0 ${-len * .9}`, shade(color, -.3), 4, { opacity: .5 });
  }
  return f;
}

/* ---------- more places ---------- */
export function street(layer, { skyTop = '#9fd3e6', skyBottom = '#f6e9cc', far = '#9fb4c4', near = '#7f97ab', lit = '#ffe2ad', curb = 720 } = {}) {
  const s = g(layer, { class: 'street' });
  sky(s, skyTop, skyBottom);
  skyline(s, curb - 120, { color: near, far, lit });
  R(s, -200, curb - 40, 2000, 50, 0, '#cfc6b6'); R(s, -200, curb - 40, 2000, 6, 0, '#e6dfd2');
  R(s, -200, curb + 10, 2000, 400, 0, grad(s, ['#5d6670', '#3f474f']));
  for (let x = -160; x < 1800; x += 220) R(s, x, curb + 90, 110, 10, 4, '#e9e3d4', { opacity: .7 });
  return s;
}
export function houseFront(layer, x, y, s = 1, { wall = '#f1d8bd', roof = '#b0563a', door = '#2f7f73', lit = false } = {}) {
  const h = g(layer, { class: 'housefront' }); place(h, x, y, s);
  contact(h, 0, 2, 190);
  R(h, 70, -330, 34, 80, 3, shade(wall, -.25));
  R(h, -150, -230, 300, 230, 4, grad(h, [shade(wall, .06), shade(wall, -.1)], 'h'));
  P(h, 'M-178 -222 L0 -350 L178 -222 Z', roof); P(h, 'M-178 -222 L0 -350 L0 -330 L-150 -222Z', shade(roof, .15));
  R(h, -178, -228, 356, 14, 4, shade(roof, -.2));
  h.windows = [];
  for (const wx of [-110, 50]) { R(h, wx - 6, -194, 72, 82, 4, '#f7f3ea'); h.windows.push(R(h, wx, -188, 60, 70, 2, lit ? '#ffd38a' : grad(h, ['#bfe3ef', '#e9f3f3']))); L(h, `M${wx + 30} -188 V-118 M${wx} -153 H${wx + 60}`, '#f7f3ea', 5); }
  R(h, -30, -96, 60, 96, 4, door); Cc(h, 18, -48, 4, '#e7c178');
  R(h, -44, -4, 88, 8, 2, shade(wall, -.3));
  return h;
}
export function shopFront(layer, x, y, s = 1, { wall = '#e9d9c0', awning = '#d9805f', sign = '' } = {}) {
  const h = g(layer, { class: 'shop' }); place(h, x, y, s);
  contact(h, 0, 2, 170);
  R(h, -150, -320, 300, 320, 4, grad(h, [shade(wall, .05), shade(wall, -.12)], 'h'));
  R(h, -150, -330, 300, 18, 3, shade(wall, -.3));
  R(h, -120, -300, 240, 50, 6, '#2f3e4a');
  if (sign) { const t = el('text', { x: 0, y: -266, 'text-anchor': 'middle', 'font-family': "'Public Sans',sans-serif", 'font-weight': 800, 'font-size': 26, 'letter-spacing': 3, fill: '#f4f1e6' }, h); t.textContent = sign; }
  for (let i = 0; i < 6; i++) P(h, `M${-150 + i * 50} -236 h50 l-4 40 c-10 10 -32 10 -42 0z`, i % 2 ? '#fbf8f1' : awning);
  R(h, -130, -180, 150, 130, 4, grad(h, ['#cfe8ee', '#9fc6d0']));
  P(h, 'M-110 -180 L-60 -180 L-120 -50 L-130 -50 L-130 -160Z', '#fff', { opacity: .25 });
  R(h, 40, -180, 80, 180, 4, '#5a4a3a'); Cc(h, 104, -90, 4, '#e7c178');
  return h;
}
export function tower(layer, x, y, s = 1, { w = 300, h = 640, glass = ['#9fc6dc', '#4f7f9c'], logo = true } = {}) {
  const t = g(layer, { class: 'tower' }); place(t, x, y, s);
  contact(t, 0, 2, w * .7);
  R(t, -w / 2, -h, w, h, 6, grad(t, glass, 'h'));
  for (let yy = -h + 40; yy < -20; yy += 44) L(t, `M${-w / 2} ${yy} H${w / 2}`, '#ffffff', 2, { opacity: .25 });
  for (let xx = -w / 2 + w / 5; xx < w / 2; xx += w / 5) L(t, `M${xx} ${-h} V0`, '#ffffff', 2, { opacity: .18 });
  P(t, `M${-w / 2} ${-h} L${-w / 2 + w * .45} ${-h} L${-w / 2} ${-h + h * .5}Z`, '#ffffff', { opacity: .14 });
  R(t, -w / 2 - 10, -h - 16, w + 20, 18, 4, shade(glass[1], -.3));
  t.doors = g(t); R(t.doors, -60, -120, 120, 120, 4, '#1d2a33');
  t.doorL = R(t.doors, -58, -118, 58, 118, 2, grad(t, ['#cfe8ee', '#8fb6c4']));
  t.doorR = R(t.doors, 0, -118, 58, 118, 2, grad(t, ['#cfe8ee', '#8fb6c4']));
  if (logo) t.logo = aiCore(t, 0, -h + 90, .32, { hud: false });
  return t;
}
export function serverAisle(layer, { tint = '#5fd3ff' } = {}) {
  const a = g(layer, { class: 'aisle' });
  R(a, -200, -200, 2000, 1300, 0, grad(a, ['#0b1622', '#142638']));
  P(a, 'M-200 900 L640 520 L960 520 L1800 900Z', grad(a, ['#1a2c3e', '#0d1824']));
  for (let i = 0; i < 6; i++) L(a, `M${640 + i * 64} 520 L${-200 + i * 400} 900`, '#2a425a', 2, { opacity: .6 });
  a.leds = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const k = 1 - i * .17, xIn = 800 + side * (160 + 70 * k * 0), xo = 800 + side * (170 + 560 * k), top = 520 - 380 * k, bot = 520 + 330 * k * .55;
      const x1 = 800 + side * (170 + 560 * (1 - (i + 1) * .17));
      P(a, `M${xo} ${top} L${x1} ${520 - 380 * (1 - (i + 1) * .17)} L${x1} ${520 + 330 * (1 - (i + 1) * .17) * .55} L${xo} ${bot}Z`, side < 0 ? '#1d3247' : '#18293a', { stroke: '#2c4760', 'stroke-width': 2 });
      for (let r = 0; r < 6; r++) { const yy = top + (bot - top) * (r + .5) / 6; const led = Cc(a, (xo * .7 + x1 * .3), yy, 3.4 * k + 1, r % 3 ? tint : '#ffd38a', { opacity: .9 }); a.leds.push(led); }
    }
  }
  for (let i = 0; i < 4; i++) R(a, 620 - i * 60, 80 + i * 70, 360 + i * 120, 10, 5, '#cfe9ff', { opacity: .5 - i * .08 });
  glow(a, 800, 520, 420, tint, .25);
  return a;
}
export function dataCenter(layer, x, y, s = 1) {
  const d = g(layer, { class: 'datacenter' }); place(d, x, y, s);
  contact(d, 0, 4, 420);
  R(d, -360, -200, 720, 200, 6, grad(d, ['#c9d2d6', '#9aa6ab']));
  for (let i = 0; i < 9; i++) R(d, -330 + i * 74, -150, 50, 90, 3, '#6f7f87');
  d.fans = [];
  for (let i = 0; i < 5; i++) { R(d, -300 + i * 130, -246, 100, 46, 6, '#7f8d93'); const f = g(d); place(f, -250 + i * 130, -222); Cc(f, 0, 0, 18, '#3a464c'); L(f, 'M-16 0 H16 M0 -16 V16', '#9aa6ab', 4); d.fans.push(f); }
  d.puffs = [];
  for (let i = 0; i < 5; i++) { const p = g(d); place(p, -250 + i * 130, -260); for (let k = 0; k < 3; k++) Cc(p, k * 10 - 10, -k * 34, 22 + k * 8, '#e9eef0', { opacity: .55 }); d.puffs.push(p); }
  R(d, -80, -70, 160, 70, 4, '#3a464c'); R(d, -76, -66, 72, 66, 2, '#5fd3ff', { opacity: .35 });
  return d;
}
export function pylon(layer, x, y, s = 1) {
  const p = g(layer, { class: 'pylon' }); place(p, x, y, s);
  L(p, 'M-50 0 L0 -320 L50 0 M-36 -90 H36 M-24 -170 H24 M-14 -240 H14 M-70 -250 H70 M-56 -200 H56 M-30 -90 L20 -170 M30 -90 L-20 -170', '#7f8d93', 6);
  return p;
}
export function campus(layer, x, y, s = 1, { stone = '#efe6d4' } = {}) {
  const c = g(layer, { class: 'campus' }); place(c, x, y, s);
  contact(c, 0, 2, 380);
  for (let i = 0; i < 3; i++) R(c, -330 + i * 14, -30 + i * 10 - 30, 660 - i * 28, 20, 2, shade(stone, -.1 - i * .04));
  R(c, -300, -330, 600, 260, 4, grad(c, [shade(stone, .04), shade(stone, -.08)]));
  P(c, 'M-330 -330 L0 -450 L330 -330Z', shade(stone, .06)); P(c, 'M-300 -342 L0 -432 L300 -342Z', shade(stone, -.06));
  for (let i = 0; i < 6; i++) { const cx = -250 + i * 100; R(c, cx - 18, -320, 36, 250, 6, grad(c, ['#ffffff', shade(stone, -.15)], 'h')); }
  R(c, -50, -170, 100, 100, 50, '#5a4a3a');
  return c;
}
export function board(layer, x, y, w = 420, h = 240, { color = '#2f5a46', frame = '#8a6a4a' } = {}) {
  const b = g(layer, { class: 'board' }); place(b, x, y);
  R(b, 6, 8, w, h, 8, '#000', { opacity: .14 });
  R(b, 0, 0, w, h, 8, frame); R(b, 12, 12, w - 24, h - 24, 4, color);
  b.surface = g(b); place(b.surface, 12, 12);
  R(b, 20, h - 6, w - 40, 12, 4, shade(frame, -.15));
  return b;
}
export function sofa(layer, x, y, s = 1, color = '#5b8fb8') {
  const f = g(layer, { class: 'sofa' }); place(f, x, y, s);
  contact(f, 0, 4, 260);
  R(f, -230, -250, 460, 150, 40, grad(f, [shade(color, .1), color]));
  R(f, -250, -170, 70, 150, 30, shade(color, -.1)); R(f, 180, -170, 70, 150, 30, shade(color, -.1));
  R(f, -190, -140, 380, 90, 24, shade(color, .05));
  R(f, -200, -54, 400, 36, 16, shade(color, -.18));
  R(f, -200, -18, 16, 18, 3, '#5a4a3a'); R(f, 184, -18, 16, 18, 3, '#5a4a3a');
  return f;
}
export function table(layer, x, y, w = 360, { top = '#c9a27a', h = 120 } = {}) {
  const t = g(layer, { class: 'table' }); place(t, x, y);
  contact(t, 0, 4, w * .6);
  R(t, -w / 2 + 20, -h, 14, h, 4, shade(top, -.35)); R(t, w / 2 - 34, -h, 14, h, 4, shade(top, -.35));
  R(t, -w / 2, -h - 22, w, 26, 8, grad(t, [shade(top, .15), top]));
  return t;
}
export function cake(layer, x, y, s = 1, n = 5) {
  const c = g(layer, { class: 'cake' }); place(c, x, y, s);
  R(c, -90, -20, 180, 20, 8, '#e9e3d4');
  R(c, -70, -110, 140, 92, 14, '#f0a3a0'); P(c, 'M-70 -96 C-50 -80 -30 -100 -10 -84 C10 -100 30 -80 50 -96 C60 -86 70 -92 70 -100 V-110 H-70Z', '#fbf8f1');
  c.flames = [];
  for (let i = 0; i < n; i++) { const cx = -48 + i * (96 / Math.max(1, n - 1)); R(c, cx - 4, -150, 8, 40, 3, ['#5b8fb8', '#e7c178', '#8fb27f', '#d9805f', '#a5e3c6'][i % 5]); const f = g(c); place(f, cx, -160); glow(f, 0, 0, 22, '#ffd38a', .7); P(f, 'M0 -14 C8 -4 6 6 0 8 C-6 6 -8 -4 0 -14Z', '#ffb84d'); c.flames.push(f); }
  return c;
}
export function bot(layer, x, y, s = 1) {
  const b = g(layer, { class: 'bot' }); place(b, x, y, s);
  contact(b, 0, 2, 90);
  b.inner = g(b);
  const i = b.inner;
  R(i, -60, -240, 120, 150, 40, grad(i, ['#eef3f2', '#b9c6c4'], 'h'));
  R(i, -30, -90, 22, 80, 10, '#9aa8a6'); R(i, 8, -90, 22, 80, 10, '#9aa8a6');
  R(i, -72, -400, 144, 130, 40, grad(i, ['#f7faf9', '#c3cfcd'], 'h'));
  R(i, -56, -380, 112, 86, 26, '#123a2e');
  b.eyes = g(i); Cc(b.eyes, -24, -340, 11, '#7fe0c4'); Cc(b.eyes, 24, -340, 11, '#7fe0c4');
  b.mouth = L(i, 'M-18 -312 C-6 -304 6 -304 18 -312', '#7fe0c4', 5);
  L(i, 'M0 -400 V-430', '#9aa8a6', 6); Cc(i, 0, -436, 10, '#e7c178');
  b.armL = g(i); R(b.armL, -96, -230, 26, 110, 13, '#c3cfcd'); b.armR = g(i); R(b.armR, 70, -230, 26, 110, 13, '#c3cfcd');
  return b;
}
export function drain(layer, color = '#7f8a85', o = .6) {
  return R(layer, -200, -200, 2000, 1300, 0, color, { opacity: 0, 'data-o': o, class: 'drain' });
}
export function bokeh(layer, n = 14, colors = ['#ffd38a', '#a5e3c6', '#f0a3a0']) {
  const b = g(layer, { class: 'bokeh' });
  b.dots = [];
  for (let i = 0; i < n; i++) b.dots.push(Cc(b, (i * 233) % 1600, 80 + (i * 137) % 700, 14 + (i * 7) % 30, colors[i % colors.length], { opacity: .18 + (i % 3) * .06 }));
  return b;
}
export function river(layer, y = 760, color = '#6fb3cf') {
  const r = g(layer, { class: 'river' });
  r.water = P(r, `M-200 ${y} C300 ${y - 40} 700 ${y + 30} 1000 ${y - 10} C1300 ${y - 40} 1500 ${y + 20} 1800 ${y} V${y + 90} C1400 ${y + 110} 900 ${y + 60} 500 ${y + 100} C200 ${y + 120} 0 ${y + 90} -200 ${y + 100}Z`, color);
  for (let i = 0; i < 6; i++) L(r, `M${100 + i * 260} ${y + 40} h70`, '#ffffff', 4, { opacity: .5 });
  return r;
}
export function turbine(layer, x, y, s = 1) {
  const t = g(layer, { class: 'turbine' }); place(t, x, y, s);
  P(t, 'M-6 0 L-3 -300 H3 L6 0Z', '#f4f6f6');
  t.blades = g(t); place(t.blades, 0, -300);
  for (let i = 0; i < 3; i++) P(t.blades, 'M-5 0 C-8 -60 -4 -120 0 -150 C4 -120 8 -60 5 0Z', '#ffffff', { transform: `rotate(${i * 120})` });
  Cc(t.blades, 0, 0, 9, '#d9dedd');
  return t;
}
export function solar(layer, x, y, s = 1) {
  const p = g(layer, { class: 'solar' }); place(p, x, y, s);
  L(p, 'M0 0 V-60', '#9aa6ab', 6);
  P(p, 'M-90 -60 L90 -60 L70 -130 L-70 -130Z', '#2c4a7a');
  for (let i = 1; i < 4; i++) L(p, `M${-90 + i * 45} -60 L${-70 + i * 35} -130`, '#8fb6e6', 2, { opacity: .7 });
  L(p, 'M-80 -95 H80', '#8fb6e6', 2, { opacity: .7 });
  P(p, 'M-70 -130 L-20 -130 L-50 -60 L-90 -60Z', '#ffffff', { opacity: .15 });
  return p;
}
export function stringLights(layer, x1, x2, y, sag = 40) {
  const s = g(layer, { class: 'lights' });
  L(s, `M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`, '#3a3a3a', 2);
  s.bulbs = [];
  for (let i = 1; i < 14; i++) { const t = i / 14, bx = x1 + (x2 - x1) * t, by = y + sag * 4 * t * (1 - t); const b = g(s); place(b, bx, by + 8); const gl = glow(b, 0, 0, 24, '#ffd38a', .7); Cc(b, 0, 0, 6, '#ffe2a8'); b.setAttribute('opacity', .25); s.bulbs.push(b); }
  return s;
}
