// Adapted from React Bits — ClickSpark. A burst of sparks; fired on demand (correct answers).
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';

const ClickSpark = forwardRef(function ClickSpark({ children, color = '#B9924F', count = 12, size = 8, className = '' }, ref) {
  const box = useRef(null);
  useImperativeHandle(ref, () => ({
    burst(el) {
      const host = box.current; if (!host) return;
      const hr = host.getBoundingClientRect();
      const r = el ? el.getBoundingClientRect() : hr;
      const x = r.left + r.width / 2 - hr.left, y = r.top + r.height / 2 - hr.top;
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'spark';
        Object.assign(s.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: i % 3 ? color : '#103D21', borderRadius: i % 2 ? '50%' : '2px', pointerEvents: 'none', zIndex: 5 });
        host.appendChild(s);
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.4, d = 50 + Math.random() * 60;
        gsap.fromTo(s, { x: -size / 2, y: -size / 2, scale: 1, opacity: 1 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: 0.2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => s.remove() });
      }
    }
  }));
  return <div ref={box} className={className} style={{ position: 'relative' }}>{children}</div>;
});
export default ClickSpark;
