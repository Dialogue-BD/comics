// A sentence as rhythm: the news word huge, content words strong, the small grammar
// words tiny and leaning forward as they rush past. Before the reveal every word is
// the same size (for the games). Words light up in time with the voice.
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import engine from '../../lib/audio';
import { useClip } from '../../lib/hooks';

export const isFn = (w) => w.syl.every(s => s.lv === 0);

export default function RhythmLane({ id, reveal = true, marks = {}, onWord, pauses = true, className = '', size = 'md' }) {
  const c = useClip(id);
  const refs = useRef([]);
  useEffect(() => {
    if (!c) return;
    let cur = -1;
    return engine.subscribe(s => {
      if (s.id !== id) return;
      const els = refs.current;
      if (!s.playing) { els.forEach(e => e && e.classList.remove('now')); cur = -1; return; }
      let k = -1;
      c.words.forEach((w, i) => { if (s.t >= w.s - 0.02) k = i; });
      if (k !== cur) {
        els.forEach((e, i) => e && e.classList.toggle('now', i === k));
        const el = els[k];
        if (el && reveal) {
          if (isFn(c.words[k])) gsap.fromTo(el, { x: -10, skewX: 0 }, { x: 0, skewX: -10, duration: 0.3, ease: 'power2.out', clearProps: 'transform' });
          else if (c.words[k].tonic) gsap.fromTo(el, { scale: 1.18 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)', clearProps: 'transform' });
        }
        cur = k;
      }
    });
  }, [id, reveal, c]);
  if (!c) return null;
  const Tag = onWord ? 'button' : 'span';
  return (
    <div className={`lane size-${size} ${reveal ? 'revealed' : 'plain'} ${className}`}>
      {c.words.map((w, i) => {
        const cls = `lw ${isFn(w) ? 'fn' : 'content'} ${w.tonic ? 'tonic' : ''} ${marks[i] || ''}`;
        return (
          <React.Fragment key={i}>
            <Tag ref={el => (refs.current[i] = el)} className={cls} type={onWord ? 'button' : undefined}
              onClick={onWord ? (e) => onWord(i, e) : undefined} aria-pressed={onWord ? !!marks[i] : undefined}>{w.w}</Tag>
            {pauses && w.gap && i < c.words.length - 1 && <span className="lw-pause" aria-hidden="true">//</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
