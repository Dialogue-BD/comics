// Adapted from React Bits — Magnet. The child leans toward the pointer.
import React, { useRef, useState } from 'react';
export default function Magnet({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const move = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    setP({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
  };
  return (
    <div ref={ref} className={className} onPointerMove={move} onPointerLeave={() => setP({ x: 0, y: 0 })}
      style={{ display: 'inline-block', transform: `translate(${p.x}px, ${p.y}px)`, transition: p.x === 0 && p.y === 0 ? 'transform .5s cubic-bezier(.33,1,.68,1)' : 'transform .1s ease-out' }}>
      {children}
    </div>
  );
}
