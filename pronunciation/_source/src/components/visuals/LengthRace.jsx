// Two vowels, one ruler. Each bar is the measured length of the vowel in the
// recording, and it fills in time with the voice as the word plays.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import engine, { clip as getClip } from '../../lib/audio';
import { labelOf } from '../Bits';

export default function LengthRace({ ids, max, labels }) {
  const bars = useRef({});
  const [seen, setSeen] = useState({});
  useEffect(() => engine.subscribe(s => {
    if (!ids.includes(s.id)) return;
    const c = getClip(s.id);
    const el = bars.current[s.id];
    if (!c || !c.vowel || !el) return;
    if (s.playing) {
      const k = Math.max(0, Math.min(1, (s.t - c.vowel[0]) / (c.vowel[1] - c.vowel[0])));
      el.style.transform = `scaleX(${k})`;
      if (k > 0) el.parentNode.classList.add('live');
    } else {
      el.parentNode.classList.remove('live');
      if (s.ended) { el.style.transform = 'scaleX(1)'; setSeen(v => ({ ...v, [s.id]: true })); }
    }
  }), [ids.join('|')]);
  const m = max || Math.max(...ids.map(id => { const c = getClip(id); return c.vowel ? c.vowel[1] - c.vowel[0] : 0.2; }));
  return (
    <div className="race">
      {ids.map((id, k) => {
        const c = getClip(id);
        const len = c.vowel ? c.vowel[1] - c.vowel[0] : 0.2;
        return (
          <div key={id} className={`race-row r${k}`}>
            <span className="race-w">{labelOf(id)}</span>
            <span className="race-track" style={{ width: `${(len / m) * 100}%` }}>
              <span className="race-ghost" />
              <span className="race-fill" ref={el => (bars.current[id] = el)} style={{ transform: seen[id] ? 'scaleX(1)' : 'scaleX(0)' }} />
            </span>
            {labels && <span className="race-l">{labels[k]}</span>}
          </div>
        );
      })}
    </div>
  );
}
