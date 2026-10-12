// Front view of the lips. Shapes: spread (long ee), round (long oo), relaxed (short),
// press (p/b), teeth (f/v: top teeth on the bottom lip).
import React from 'react';

const SHAPES = {
  spread: { w: 74, h: 16, r: 8 },
  round: { w: 34, h: 30, r: 16 },
  relaxed: { w: 52, h: 22, r: 11 },
  press: { w: 60, h: 3, r: 2 },
  teeth: { w: 60, h: 12, r: 6 },
};

export default function Mouth({ shape = 'relaxed', active = false, size = 92, label }) {
  const s = SHAPES[shape] || SHAPES.relaxed;
  const cx = 50, cy = 50;
  return (
    <figure className={`mouth ${active ? 'is-active' : ''} m-${shape}`} style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <circle cx="50" cy="50" r="46" className="m-face" />
        <g className="m-lips" style={{ transformOrigin: '50px 50px' }}>
          <rect x={cx - s.w / 2 - 7} y={cy - s.h / 2 - 7} width={s.w + 14} height={s.h + 14} rx={s.r + 7} className="m-lip" />
          <rect x={cx - s.w / 2} y={cy - s.h / 2} width={s.w} height={Math.max(2, s.h)} rx={s.r} className="m-gap" />
          {shape === 'teeth' && <rect x={cx - 18} y={cy - s.h / 2 - 1} width={36} height={8} rx={2} className="m-teeth" />}
          {(shape === 'spread' || shape === 'relaxed') && <rect x={cx - s.w / 2 + 6} y={cy - s.h / 2} width={s.w - 12} height={Math.min(6, s.h / 2.5)} rx={2} className="m-teeth soft" />}
        </g>
      </svg>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}
