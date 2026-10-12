// Adapted from React Bits — SpotlightCard. A soft light follows the pointer.
import React, { useRef } from 'react';
export default function SpotlightCard({ children, className = '', color = 'rgba(210,185,120,.28)', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--sx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref} onPointerMove={move} className={`spotlight ${className}`} style={{ '--spot': color }} {...rest}>
      {children}
    </Tag>
  );
}
