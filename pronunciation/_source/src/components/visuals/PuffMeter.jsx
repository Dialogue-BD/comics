// The hand test, drawn: a paper strip in front of the mouth. At the release of
// p / t / k the measured burst of air (release → voicing) blows it back; after s
// it barely moves. Strength comes from each clip's measured aspiration time.
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import engine, { clip as getClip } from '../../lib/audio';

export default function PuffMeter({ ids, size = 180 }) {
  const strip = useRef(null);
  const puffs = useRef(null);
  useEffect(() => {
    let fired = null;
    return engine.subscribe(s => {
      if (!ids.includes(s.id)) return;
      if (!s.playing) { fired = null; return; }
      const c = getClip(s.id);
      if (!c || !c.asp || fired === s.id) return;
      if (s.t >= c.asp[0] - 0.01) {
        fired = s.id;
        const vot = Math.max(0, c.asp[1] - c.asp[0]);
        const k = Math.min(1, vot / 0.11);               // ~110 ms = a full puff
        const ang = 6 + k * 52;
        gsap.timeline()
          .to(strip.current, { rotation: ang, duration: 0.09 + k * 0.06, ease: 'power2.out', transformOrigin: '50% 0%' })
          .to(strip.current, { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.28)' });
        // breath particles
        const host = puffs.current;
        const n = Math.round(3 + k * 16);
        for (let i = 0; i < n; i++) {
          const d = document.createElement('i');
          host.appendChild(d);
          gsap.fromTo(d, { x: 0, y: (Math.random() - 0.5) * 8, opacity: 0.9, scale: 0.6 + Math.random() * 0.6 },
            { x: 40 + k * 70 + Math.random() * 30, y: (Math.random() - 0.5) * (14 + k * 30), opacity: 0, duration: 0.45 + Math.random() * 0.35, ease: 'power2.out', onComplete: () => d.remove() });
        }
      }
    });
  }, [ids.join('|')]);
  return (
    <div className="puff-meter" style={{ width: size, height: size * 0.75 }} aria-hidden="true">
      <svg viewBox="0 0 100 120" className="pm-face">
        {/* side view, facing right: forehead, nose, lips, chin */}
        <path d="M30 8c24 0 40 14 42 34l9 14c2 3 0 5-3 5h-6c1 4 1 7-1 9l3 3-3 3c2 3 2 7-2 9-6 3-14 3-20 4-6 1-8 8-8 18" className="pm-head" />
        <path d="M69 68c4 0 7 1 9 3M69 76c4 0 7 0 9-2" className="pm-lip" />
      </svg>
      <div className="pm-puffs" ref={puffs} />
      <span className="pm-hand" aria-hidden="true">✋</span>
      <div className="pm-strip-wrap"><div className="pm-strip" ref={strip} /></div>
    </div>
  );
}
