// Mouth shapes for the 3D articulator. Each shape sets a few plain controls:
//   open   lips apart (0 shut … 1 wide)      jaw    lower jaw drop
//   spread lips pulled wide (smile)          round  lips pushed forward into an o
//   press  lips pressed together (p b m)     tuck   bottom lip under the top teeth (f v)
//   tipZ / tipY  where the tongue tip is     front / mid / back  how high the tongue is
//   tension  how hard the lip and cheek muscles work (long vowels: high; short: low)
// Phones are the MBROLA/SAMPA symbols in clips.json (`ph`).

export const REST = { open: 0.1, jaw: 0.12, spread: 0.3, round: 0, press: 0, tuck: 0, tipZ: -0.35, tipY: -0.75, front: -0.5, mid: -0.45, back: -0.45, tension: 0.25 };

const V = (o) => ({ ...REST, ...o });

export const SHAPES = {
  rest: REST,
  // vowels
  ee: V({ open: 0.26, jaw: 0.12, spread: 1, front: 0.95, mid: 0.45, back: -0.3, tipY: -0.55, tipZ: -0.22, tension: 1 }),
  ih: V({ open: 0.4, jaw: 0.3, spread: 0.45, front: 0.45, mid: 0.2, back: -0.4, tipY: -0.68, tension: 0.05 }),
  eh: V({ open: 0.52, jaw: 0.42, spread: 0.55, front: 0.25, mid: 0.05, tipY: -0.7, tension: 0.3 }),
  ae: V({ open: 0.72, jaw: 0.62, spread: 0.72, front: -0.15, mid: -0.2, tipY: -0.78, tension: 0.4 }),
  ah: V({ open: 1, jaw: 0.95, spread: 0.42, front: -0.75, mid: -0.7, back: -0.35, tipY: -0.92, tension: 0.3 }),
  uh: V({ open: 0.5, jaw: 0.45, spread: 0.38, front: -0.25, mid: -0.05, back: -0.1, tension: 0.15 }),
  schwa: V({ open: 0.32, jaw: 0.28, spread: 0.32, front: -0.15, mid: -0.15, back: -0.2, tension: 0 }),
  oo: V({ open: 0.2, jaw: 0.14, spread: 0, round: 1, front: -0.55, mid: 0.25, back: 0.95, tension: 1 }),
  uu: V({ open: 0.36, jaw: 0.3, spread: 0.18, round: 0.42, front: -0.35, mid: 0.05, back: 0.5, tension: 0.05 }),
  aw: V({ open: 0.75, jaw: 0.72, spread: 0.1, round: 0.6, front: -0.6, back: 0.15, tension: 0.4 }),
  er: V({ open: 0.3, jaw: 0.26, spread: 0.18, round: 0.38, front: -0.1, mid: 0.85, back: 0.35, tipY: 0.05, tipZ: -0.42, tension: 0.45 }),
  // consonants
  pb: V({ press: 1, open: 0, jaw: 0.08, spread: 0.35, tension: 0.45 }),
  fv: V({ tuck: 1, open: 0.16, jaw: 0.14, spread: 0.5, tension: 0.45 }),
  w: V({ round: 1, open: 0.1, jaw: 0.12, spread: 0, back: 0.6, tension: 0.7 }),
  th: V({ open: 0.36, jaw: 0.26, spread: 0.45, tipZ: 0.5, tipY: -0.12, front: 0.1, mid: -0.1, tension: 0.2 }),
  sz: V({ open: 0.14, jaw: 0.06, spread: 0.58, tipY: 0.24, tipZ: -0.3, front: 0.55, mid: 0.1, tension: 0.4 }),
  sh: V({ open: 0.2, jaw: 0.1, round: 0.55, spread: 0.1, tipY: 0.2, tipZ: -0.5, front: 0.65, mid: 0.35, tension: 0.5 }),
  td: V({ open: 0.24, jaw: 0.18, spread: 0.4, tipY: 0.42, tipZ: -0.34, front: 0.45, mid: 0.05, tension: 0.3 }),
  kg: V({ open: 0.3, jaw: 0.24, spread: 0.35, back: 1, mid: 0.4, front: -0.5, tension: 0.3 }),
  h: V({ open: 0.4, jaw: 0.32, spread: 0.35, tension: 0.1 }),
  r: V({ open: 0.22, jaw: 0.18, round: 0.5, spread: 0.1, mid: 0.8, back: 0.3, tipY: 0.08, tipZ: -0.42, tension: 0.4 }),
};

// SAMPA phone → shape (diphthongs glide from the first shape to the second)
const MAP = {
  i: 'ee', I: 'ih', E: 'eh', '{': 'ae', A: 'ah', Q: 'ah', V: 'uh', U: 'uu', u: 'oo', '@': 'schwa', O: 'aw', o: 'aw', e: 'eh', a: 'ah',
  'r=': 'er', '3': 'er', '3`': 'er', '@`': 'er',
  aI: ['ah', 'ee'], AI: ['ah', 'ee'], eI: ['eh', 'ee'], EI: ['eh', 'ee'], OI: ['aw', 'ee'], aU: ['ah', 'oo'], '@U': ['schwa', 'oo'], oU: ['schwa', 'oo'],
  p: 'pb', b: 'pb', m: 'pb', f: 'fv', v: 'fv', T: 'th', D: 'th', s: 'sz', z: 'sz', S: 'sh', Z: 'sh', tS: 'sh', dZ: 'sh',
  t: 'td', d: 'td', n: 'td', l: 'td', k: 'kg', g: 'kg', N: 'kg', w: 'w', j: 'ee', h: 'h', r: 'r',
};

export const TENSE_VOWELS = new Set(['i', 'u']);
export const LAX_VOWELS = new Set(['I', 'U', '@']);

// keyframes [{t, shape}] for a clip's phones; the tongue/lip springs do the blending
export function track(ph) {
  const out = [];
  (ph || []).forEach(([p, a, b]) => {
    const m = MAP[p] || 'schwa';
    if (Array.isArray(m)) {
      out.push({ t: a, shape: m[0] });
      out.push({ t: a + (b - a) * 0.5, shape: m[1] });
    } else out.push({ t: a, shape: m });
  });
  return out;
}

export function shapeAt(keys, t, endT) {
  if (!keys.length || t < keys[0].t - 0.06) return null;
  if (t > endT + 0.04) return null;
  let s = keys[0].shape;
  for (const k of keys) { if (t >= k.t - 0.035) s = k.shape; else break; }   // look ahead a little: lips move before the sound
  return s;
}

// which shape best shows a clip at rest (its main vowel, or a named focus)
export function focusShape(ph, focus) {
  if (focus && SHAPES[focus]) return focus;
  if (!ph || !ph.length) return 'rest';
  const vowels = ph.filter(([p]) => /[iIE{AQVUu@O3aeo]/.test(p[0]) || p === 'r=');
  const v = (vowels.length ? vowels : ph).reduce((a, b) => (b[2] - b[1] > a[2] - a[1] ? b : a));
  const m = MAP[v[0]] || 'rest';
  return Array.isArray(m) ? m[0] : m;
}
