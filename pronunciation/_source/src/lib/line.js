// Geometry for the voice line: the measured pitch turned into one calligraphic
// brush stroke per thought group, plus the schedule for the bouncing ball.
//
//  · height  = pitch (semitones around the speaker's own middle, one fixed scale)
//  · weight  = strength: the stroke swells on the big beat and thins to a hairline
//              on small beats and through consonants, like a broad pen
//  · the stroke never breaks inside a thought group — speech flows through the
//    consonants — and lifts only at a real pause
import { clip as getClip } from './audio';

export const ST_LO = -9, ST_HI = 10;
const STEP = 0.01;
const LV_W = [0.32, 0.6, 1];

export function groupsOf(c) {
  const out = [];
  let cur = null;
  c.words.forEach((w, i) => {
    if (!cur) cur = { words: [], s: w.s, e: w.e };
    cur.words.push(i);
    cur.e = w.e;
    if (w.gap && i < c.words.length - 1) { out.push(cur); cur = null; }
  });
  if (cur) out.push(cur);
  return out;
}

export function syllablesOf(c) {
  const out = [];
  c.words.forEach((w, wi) => w.syl.forEach((s, si) => out.push({ ...s, wi, si, word: w, tonic: !!w.tonic })));
  return out;
}

function gauss(arr, sigma) {
  const r = Math.ceil(sigma * 3);
  const k = []; let sum = 0;
  for (let i = -r; i <= r; i++) { const v = Math.exp(-0.5 * (i / sigma) ** 2); k.push(v); sum += v; }
  return arr.map((_, i) => {
    let a = 0;
    for (let j = -r; j <= r; j++) { const q = Math.min(arr.length - 1, Math.max(0, i + j)); a += arr[q] * k[j + r]; }
    return a / sum;
  });
}

// pitch (semitones) on a 10 ms grid, NaN where unvoiced
function pitchGrid(c) {
  const n = Math.ceil(c.dur / STEP) + 1;
  const g = new Array(n).fill(NaN);
  (c.pitch || []).forEach(([t0, ys]) => ys.forEach((v, i) => {
    const k = Math.round(t0 / STEP) + i;
    if (k >= 0 && k < n) g[k] = v;
  }));
  return g;
}

const envAt = (c, t) => {
  const i = Math.max(0, Math.min(c.env.length - 1, Math.floor(t / 0.02)));
  return c.env[i] || 0;
};

// stress weight of the syllable sounding at t (0 between words)
function stressAt(syls, t) {
  for (const s of syls) if (t >= s.s && t < s.e) return LV_W[s.lv] * (s.tonic ? 1.1 : 1);
  return 0.22;
}

// One smooth stroke for [ta, tb]: [{t, st, w}] every 20 ms, w in 0..1.
export function stroke(id, ta, tb, opts = {}) {
  const c = getClip(id);
  if (!c) return null;
  const g = pitchGrid(c);
  const k0 = Math.max(0, Math.floor(ta / STEP)), k1 = Math.min(g.length - 1, Math.ceil(tb / STEP));
  let a = -1, b = -1;
  for (let k = k0; k <= k1; k++) if (!isNaN(g[k])) { if (a < 0) a = k; b = k; }
  if (a < 0 || b - a < 4) return null;
  // bridge the unvoiced stretches with an eased join (a hairline in the brush)
  const st = [], voiced = [];
  let last = a;
  for (let k = a; k <= b; k++) {
    if (!isNaN(g[k])) {
      if (k - last > 1) {
        const y0 = g[last], y1 = g[k];
        for (let q = last + 1; q < k; q++) {
          const u = (q - last) / (k - last);
          st[q - a] = y0 + (y1 - y0) * (0.5 - 0.5 * Math.cos(Math.PI * u));
          voiced[q - a] = 0;
        }
      }
      st[k - a] = g[k]; voiced[k - a] = 1; last = k;
    }
  }
  const sm = gauss(st, opts.smooth || 5);
  const syls = syllablesOf(c);
  let w = sm.map((_, i) => {
    const t = (a + i) * STEP;
    const sw = stressAt(syls, t);
    const e = envAt(c, t);
    return (0.18 + 0.82 * sw) * (0.42 + 0.58 * e) * (voiced[i] ? 1 : 0.3);
  });
  w = gauss(w, 4);
  const n = w.length, taper = Math.min(8, Math.floor(n / 4));
  for (let i = 0; i < taper; i++) {
    const f = Math.sin((Math.PI / 2) * ((i + 1) / (taper + 1)));
    w[i] *= f; w[n - 1 - i] *= f;
  }
  const out = [];
  for (let i = 0; i < n; i += 2) out.push({ t: (a + i) * STEP, st: sm[i], w: w[i] });
  if ((n - 1) % 2) out.push({ t: (a + n - 1) * STEP, st: sm[n - 1], w: w[n - 1] });
  return out;
}

// Catmull-Rom through points → SVG cubic path segments (no leading M)
function crSegs(p, tension = 0.5) {
  let d = '';
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const k = tension / 3;
    const c1x = p1[0] + (p2[0] - p0[0]) * k, c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k, c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function centerPath(pts, X, Y) {
  if (!pts || pts.length < 2) return '';
  const p = pts.map(q => [X(q.t), Y(q.st)]);
  return `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}` + crSegs(p);
}

// The brush: a filled outline around the centre line, width from w.
export function ribbonPath(pts, X, Y, wMin, wMax) {
  if (!pts || pts.length < 2) return '';
  const P = pts.map(q => [X(q.t), Y(q.st)]);
  const L = [], R = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    // a broad nib held at ~35°: strokes are fuller going down-right than up-right
    const nib = 0.82 + 0.18 * Math.abs(Math.sin(Math.atan2(dy, dx) - 0.6));
    const half = (wMin + (wMax - wMin) * pts[i].w) * nib / 2;
    L.push([P[i][0] - dy * half, P[i][1] + dx * half]);
    R.push([P[i][0] + dy * half, P[i][1] - dx * half]);
  }
  R.reverse();
  const head = `M${L[0][0].toFixed(1)} ${L[0][1].toFixed(1)}`;
  const end = L[L.length - 1], r0 = R[0];
  const capR = Math.max(0.6, Math.hypot(end[0] - r0[0], end[1] - r0[1]) / 2);
  const s0 = R[R.length - 1], l0 = L[0];
  const capL = Math.max(0.6, Math.hypot(s0[0] - l0[0], s0[1] - l0[1]) / 2);
  return head + crSegs(L, 0.45) + `A${capR.toFixed(1)} ${capR.toFixed(1)} 0 0 1 ${r0[0].toFixed(1)} ${r0[1].toFixed(1)}` + crSegs(R, 0.45) +
    `A${capL.toFixed(1)} ${capL.toFixed(1)} 0 0 1 ${l0[0].toFixed(1)} ${l0[1].toFixed(1)}Z`;
}

export const yScale = (top, h) => (st) => top + h * (1 - (Math.max(ST_LO, Math.min(ST_HI, st)) - ST_LO) / (ST_HI - ST_LO));

// pitch value on a stroke at time t (for the pen tip), or null
export function stAt(pts, t) {
  if (!pts || !pts.length || t < pts[0].t || t > pts[pts.length - 1].t) return null;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].t >= t) {
      const a = pts[i - 1], b = pts[i], u = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return a.st + (b.st - a.st) * u;
    }
  }
  return pts[pts.length - 1].st;
}

// ---------------------------------------------------------------- the ball
// beats: [{t, x, y, lv}] in playing order. Horizontal motion is linear in time,
// so the ball never slows down; at each landing it rebounds at once.
export function makeBall(beats, endT, opts = {}) {
  const k = opts.k || 105, maxH = opts.maxH || 46, minH = opts.minH || 5, ui = opts.ui || 1;
  const hop = (dt, lv) => Math.max(minH, Math.min(maxH, k * dt)) * ui * (lv === 2 ? 1.22 : lv === 0 ? 0.72 : 1);
  // after the last beat: two decaying bounces rolling on, then rest
  const tail = [];
  if (beats.length) {
    const L = beats[beats.length - 1];
    const prev = beats[beats.length - 2];
    const vx = prev && L.t > prev.t && prev.row === L.row ? (L.x - prev.x) / (L.t - prev.t) : 80 * ui;
    const speed = Math.max(40 * ui, Math.min(260 * ui, vx));
    const d1 = 0.26, d2 = 0.16;
    tail.push({ t0: L.t, t1: L.t + d1, x0: L.x, x1: L.x + speed * d1 * 0.7, y: L.y, h: hop(0.18, 1) * 0.6 });
    tail.push({ t0: L.t + d1, t1: L.t + d1 + d2, x0: L.x + speed * d1 * 0.7, x1: L.x + speed * (d1 * 0.7 + d2 * 0.4), y: L.y, h: hop(0.12, 0) * 0.35 });
  }
  const restX = tail.length ? tail[tail.length - 1].x1 : 0;
  return {
    beats,
    rest: beats.length ? { x: beats[0].x, y: beats[0].y } : { x: 0, y: 0 },
    end: beats.length ? { x: restX, y: beats[beats.length - 1].y } : { x: 0, y: 0 },
    // position + squash at time t
    at(t) {
      if (!beats.length) return null;
      const b0 = beats[0];
      if (t <= b0.t) {
        const u = Math.max(0, t) / Math.max(0.05, b0.t);
        const h = hop(Math.min(0.35, b0.t), b0.lv);
        return { x: b0.x, y: b0.y - h * 4 * u * (1 - u), sq: 0, land: -1 };
      }
      for (let i = 0; i < beats.length - 1; i++) {
        const a = beats[i], b = beats[i + 1];
        if (t <= b.t) {
          const u = (t - a.t) / Math.max(1e-3, b.t - a.t);
          const h = hop(b.t - a.t, b.lv) + Math.abs(a.y - b.y) * 0.5;
          const y = a.y + (b.y - a.y) * u - h * 4 * u * (1 - u);
          const since = t - a.t;
          return { x: a.x + (b.x - a.x) * u, y, sq: since < 0.08 ? (1 - since / 0.08) * (a.lv === 2 ? 1 : a.lv === 1 ? 0.55 : 0.3) : 0, land: i };
        }
      }
      for (const s of tail) {
        if (t <= s.t1) {
          const u = (t - s.t0) / (s.t1 - s.t0);
          const since = t - s.t0;
          const sq = s === tail[0] && since < 0.08 ? (1 - since / 0.08) * (beats[beats.length - 1].lv === 2 ? 1 : 0.5) : 0;
          return { x: s.x0 + (s.x1 - s.x0) * u, y: s.y - s.h * 4 * u * (1 - u), sq, land: beats.length - 1 };
        }
      }
      return { x: restX, y: beats[beats.length - 1].y, sq: 0, land: beats.length - 1, done: true };
    },
  };
}
