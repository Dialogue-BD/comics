// Adapted from React Bits — SplitText. Letters (or words) rise in, once.
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

export default function SplitText({ text, as: Tag = 'span', className = '', by = 'chars', stagger = 0.035, delay = 0, duration = 0.7, y = '105%' }) {
  const ref = useRef(null);
  useGSAP(() => {
    const els = ref.current.querySelectorAll('.st-u > span');
    gsap.from(els, { yPercent: 0, y, opacity: 0, duration, stagger, delay, ease: 'power3.out' });
  }, { scope: ref, dependencies: [text] });
  // words never break apart: each word is a nowrap group of letters
  const words = text.split(/(\s+)/);
  const unit = (u, k) => (
    <span key={k} className="st-u" aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
      <span style={{ display: 'inline-block' }}>{u}</span>
    </span>
  );
  return (
    <Tag ref={ref} className={`split-text ${className}`} aria-label={text}>
      {words.map((w, i) => /^\s+$/.test(w) ? ' ' : (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {by === 'words' ? unit(w, 0) : w.split('').map((ch, j) => unit(ch, j))}
        </span>
      ))}
    </Tag>
  );
}
