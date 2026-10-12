// Words that are compared on screen must speak with one voice: team / Tim in Brian's
// voice, or both in Alice's — never one of each. The pairs are read straight from the
// unit content: [a, b] lists, {a, b}, {n, p}, {good, bad}, {from, to}, {open, closed}
// and `same` groups.
import engine from './audio';

const isClip = (x) => typeof x === 'string' && (engine.has(x, 'alice') || engine.has(x, 'brian'));
const idOf = (x) => (isClip(x) ? x : x && typeof x === 'object' && isClip(x.clip) ? x.clip : null);
const KEYS = [['a', 'b'], ['n', 'p'], ['good', 'bad'], ['from', 'to'], ['open', 'closed']];

export function linkComparisons(units) {
  const walk = (o) => {
    if (Array.isArray(o)) {
      if (o.length >= 2 && o.length <= 3 && o.every(isClip)) engine.link(o);
      o.forEach(walk);
      return;
    }
    if (!o || typeof o !== 'object') return;
    KEYS.forEach(([x, y]) => {
      const a = idOf(o[x]), b = idOf(o[y]);
      if (a && b) engine.link([a, b]);
    });
    if (Array.isArray(o.same)) engine.link(o.same.filter(isClip));
    Object.values(o).forEach(walk);
  };
  units.forEach(u => (u.steps || []).forEach(st => (st.sections || []).forEach(walk)));
}
