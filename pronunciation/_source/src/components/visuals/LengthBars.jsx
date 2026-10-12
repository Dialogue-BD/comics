// Vowel length as two bars on one ruler: the long (tense) vowel in coral, the short
// (relaxed) one in blue. Each bar is the measured vowel in the recording and fills in
// time with the voice.
import React, { useEffect, useRef, useState } from 'react';
import engine, { clip as getClip } from '../../lib/audio';
import { labelOf } from '../Bits';
import { useVoiceKey } from '../../lib/hooks';

export const vowelSpan = (id) => {
  const c = getClip(id);
  if (!c) return [0, 0.2];
  if (c.vowel) return c.vowel;
  const syl = c.words.flatMap(w => w.syl);
  const s = syl.find(q => q.lv === 2) || syl[0];
  return s.core || [s.v, s.e];
};

export default function LengthBars({ ids, kinds = ['long', 'short'], max }) {
  const fills = useRef({});
  const [seen, setSeen] = useState({});
  useVoiceKey(ids);                     // bar lengths are this voice's vowels
  useEffect(() => engine.subscribe(s => {
    if (!ids.includes(s.id)) return;
    const [a, b] = vowelSpan(s.id);
    const el = fills.current[s.id];
    if (!el) return;
    if (s.playing) {
      const k = Math.max(0, Math.min(1, (s.t - a) / (b - a)));
      el.style.transform = `scaleX(${k})`;
      el.parentNode.classList.toggle('live', k > 0 && k < 1);
    } else {
      el.parentNode.classList.remove('live');
      if (s.ended) { el.style.transform = 'scaleX(1)'; setSeen(v => ({ ...v, [s.id]: true })); }
    }
  }), [ids.join('|')]);
  const m = max || Math.max(...ids.map(id => { const [a, b] = vowelSpan(id); return b - a; }));
  return (
    <div className="lbars">
      {ids.map((id, k) => {
        const [a, b] = vowelSpan(id);
        return (
          <div key={id} className={`lb-row k-${kinds[k] || 'short'}`}>
            <span className="lb-w">{labelOf(id)}</span>
            <span className="lb-track" style={{ width: `${((b - a) / m) * 100}%` }}>
              <span className="lb-fill" ref={el => (fills.current[id] = el)} style={{ transform: seen[id] ? 'scaleX(1)' : 'scaleX(0)' }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
