// Sound tiles laid out in time: each tile's width is how long that sound lasts in
// the recording. The helper vowel shows up as its own tile and pushes the word
// longer. Tiles light up as the voice reaches them; the consonants snap together.
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import engine from '../../lib/audio';
import { useWidth } from '../../lib/settings';
import { TILES } from '../../content/units';

export default function Tiles({ id, span, height = 54, snap = false }) {
  const tiles = TILES[id] || [];
  const box = useRef(null);
  const W = useWidth(box);
  useEffect(() => {
    const els = box.current ? [...box.current.querySelectorAll('.tile')] : [];
    let last = -1;
    return engine.subscribe(s => {
      if (s.id !== id) return;
      if (!s.playing) { last = -1; els.forEach(e => e.classList.remove('on')); return; }
      let k = -1;
      tiles.forEach((t, i) => { if (s.t >= t[1]) k = i; });
      if (k !== last) {
        els.forEach((e, i) => e.classList.toggle('on', i === k));
        if (k >= 0 && els[k]) gsap.fromTo(els[k], { y: -6 }, { y: 0, duration: 0.3, ease: 'power3.out' });
        if (snap && k >= 0 && tiles[k][3] === 'c' && tiles[k + 1] && tiles[k + 1][3] === 'c') {
          gsap.fromTo(els[k + 1], { x: 10 }, { x: 0, duration: 0.25, ease: 'back.out(3)' });
        }
        last = k;
      }
    });
  }, [id]);
  if (!tiles.length) return null;
  const t0 = tiles[0][1];
  const own = tiles[tiles.length - 1][2] - t0;
  const width = W || 300;
  const px = width / Math.max(own, span || own);   // px per second, shared when `span` is given
  // place by time, but never let a short sound's tile sit on top of the next one
  const minW = 20;
  let pos = tiles.map(t => ({ l: (t[1] - t0) * px, w: Math.max(minW, (t[2] - t[1]) * px - 3) }));
  for (let i = 1; i < pos.length; i++) pos[i].l = Math.max(pos[i].l, pos[i - 1].l + pos[i - 1].w + 3);
  const end = pos[pos.length - 1].l + pos[pos.length - 1].w;
  if (end > width) { const k = width / end; pos = pos.map(p => ({ l: p.l * k, w: Math.max(16, p.w * k) })); }
  return (
    <div className="tiles" ref={box} style={{ height }} aria-label={tiles.map(t => t[0]).join(' ')}>
      {tiles.map((t, i) => (
        <span key={i} className={`tile k-${t[3]}`} style={{ left: pos[i].l, width: pos[i].w }}>
          {t[0]}
        </span>
      ))}
    </div>
  );
}

export function tilesSpan(ids) {
  let m = 0;
  ids.forEach(id => { const t = TILES[id]; if (t) m = Math.max(m, t[t.length - 1][2] - t[0][1]); });
  return m;
}
