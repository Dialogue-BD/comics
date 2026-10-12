// Each unit's signature picture, drawn from its own recordings where it can be.
import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { clip as getClip } from '../lib/audio';

function contourPath(id, w, h, pad = 6) {
  const c = getClip(id);
  const t0 = c.on, t1 = c.off;
  let d = '';
  c.pitch.forEach(([s, ys]) => {
    ys.forEach((v, i) => {
      if (i % 3 && i !== ys.length - 1) return;
      const x = pad + ((s + i * 0.01 - t0) / (t1 - t0)) * (w - pad * 2);
      const y = h / 2 - (v / 14) * (h / 2 - pad);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    });
  });
  return d;
}

export default function UnitGlyph({ unit, size = 120, live = false }) {
  const ref = useRef(null);
  const W = 160, H = 100;
  const melody = useMemo(() => unit.glyph === 'melody' ? contourPath('pro-sent1', W, H) : '', [unit.glyph]);
  useEffect(() => {
    if (!live || !ref.current) return;
    const el = ref.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    const q = (s) => el.querySelectorAll(s);
    switch (unit.glyph) {
      case 'beads':
        tl.fromTo(q('.gb'), { scale: 0.4, transformOrigin: 'center' }, { scale: 1, duration: 0.35, stagger: 0.22, ease: 'back.out(3)' }).to({}, { duration: 0.8 });
        break;
      case 'melody': {
        const p = el.querySelector('.gm');
        const L = p.getTotalLength ? p.getTotalLength() : 400;
        tl.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2.2, ease: 'none' }).to({}, { duration: 0.8 });
        break;
      }
      case 'bars':
        tl.fromTo(q('.gv'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: (i) => (i ? 0.45 : 0.8), stagger: 0.9, ease: 'power1.out' }).to({}, { duration: 0.6 });
        break;
      case 'buzz':
        tl.fromTo(q('.gz'), { x: -6 }, { x: 6, duration: 0.08, repeat: 12, yoyo: true, ease: 'none' })
          .fromTo(q('.ga'), { x: 0, opacity: 1 }, { x: 40, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power1.out' }, 0);
        break;
      case 'puff':
        tl.fromTo(q('.gp'), { x: 0, opacity: 1, scale: 0.6 }, { x: (i) => 50 + (i % 4) * 14, y: (i) => ((i * 13) % 30) - 15, opacity: 0, scale: 1.2, duration: 0.8, stagger: 0.015, ease: 'power2.out' })
          .fromTo(q('.gs'), { rotation: 0, transformOrigin: '50% 0%' }, { rotation: 40, duration: 0.12, ease: 'power2.out' }, 0.05)
          .to(q('.gs'), { rotation: 0, duration: 1.1, ease: 'elastic.out(1,.3)' });
        break;
      case 'tiles':
        tl.fromTo(q('.gt'), { x: (i) => i * 10, opacity: 0.3 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2.5)' }).to({}, { duration: 1 });
        break;
      case 'th':
        tl.fromTo(q('.gth'), { opacity: 0.35 }, { opacity: 1, duration: 0.5, stagger: 0.6, yoyo: true, repeat: 1 });
        break;
      case 'rush':
        tl.fromTo(q('.gr-big'), { scale: 0.7, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.45, stagger: 0.5, ease: 'back.out(2.5)' }, 0)
          .fromTo(q('.gr-small'), { x: -8, skewX: 0 }, { x: 0, skewX: -12, duration: 0.3, stagger: 0.5, ease: 'power2.out' }, 0.25).to({}, { duration: 0.6 });
        break;
      case 'link': {
        const p = el.querySelector('.gk');
        tl.fromTo(p, { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }).to({}, { duration: 1 });
        break;
      }
      case 'accent':
        tl.fromTo(q('.gac'), { scale: 0.6, opacity: 0.3, transformOrigin: '50% 60%' }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.5, ease: 'back.out(2.5)' })
          .fromTo(q('.gchk'), { strokeDasharray: 40, strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }).to({}, { duration: 1 });
        break;
      case 'digits':
        tl.fromTo(q('.gd'), { opacity: 0.3, y: 6 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.35, ease: 'power2.out' }).to({}, { duration: 0.8 });
        break;
      default:
    }
    return () => tl.kill();
  }, [live, unit.glyph]);

  return (
    <svg ref={ref} className={`unit-glyph g-${unit.glyph}`} viewBox={`0 0 ${W} ${H}`} width={size} height={size * H / W} aria-hidden="true">
      {unit.glyph === 'beads' && (
        <g>
          {['pho', 'to', 'GRAPH', 'ic'].map((t, i) => {
            const lv = [1, 0, 2, 0][i];
            const r = [7, 4, 14, 4][i];
            const x = 22 + i * 38;
            return (
              <g key={i}>
                <text x={x} y={40} textAnchor="middle" className={`gbt lv${lv}`}>{t.toLowerCase()}</text>
                <circle className={`gb lv${lv}`} cx={x} cy={70} r={r} />
              </g>
            );
          })}
        </g>
      )}
      {unit.glyph === 'melody' && <path d={melody} className="gm" />}
      {unit.glyph === 'bars' && (
        <g>
          <text x={8} y={36} className="gl">team</text><rect className="gv long" x={56} y={24} width={92} height={16} rx={8} />
          <text x={8} y={72} className="gl">Tim</text><rect className="gv short" x={56} y={60} width={56} height={16} rx={8} />
        </g>
      )}
      {unit.glyph === 'buzz' && (
        <g>
          <path className="gz" d="M20 34q8-12 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0" />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} className="ga" cx={24 + (i % 6) * 8} cy={66 + ((i * 7) % 5) * 3 - 6} r={2.2} />)}
          <text x={146} y={38} className="gl" textAnchor="end">v</text><text x={146} y={74} className="gl" textAnchor="end">f</text>
        </g>
      )}
      {unit.glyph === 'puff' && (
        <g>
          <text x={14} y={58} className="gl big">p</text>
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} className="gp" cx={42} cy={50} r={2.4} />)}
          <rect className="gs" x={128} y={18} width={10} height={64} rx={2} />
        </g>
      )}
      {unit.glyph === 'tiles' && (
        <g>
          {['s', 'k', 'oo', 'l'].map((t, i) => (
            <g key={i} className="gt">
              <rect x={14 + [0, 30, 60, 108][i]} y={34} width={[28, 28, 46, 28][i]} height={34} rx={6} className={i === 2 ? 'v' : 'c'} />
              <text x={14 + [0, 30, 60, 108][i] + [14, 14, 23, 14][i]} y={57} textAnchor="middle" className="gtt">{t}</text>
            </g>
          ))}
        </g>
      )}
      {unit.glyph === 'rush' && (
        <g>
          <text x={10} y={64} className="gr-big gl">big</text>
          <text x={62} y={64} className="gr-small gs-t">the</text>
          <text x={92} y={64} className="gr-big gl">word</text>
          <path d="M8 76H152" className="gbase" />
        </g>
      )}
      {unit.glyph === 'link' && (
        <g>
          <text x={14} y={58} className="gl">go</text><text x={92} y={58} className="gl">on</text>
          <path d="M58 64Q74 86 90 64" className="gk" strokeDasharray="60" />
        </g>
      )}
      {unit.glyph === 'digits' && (
        <g>
          <text x={12} y={64} className="gd gl big">19</text><text x={72} y={64} className="gd gslash gl big">/</text><text x={92} y={64} className="gd gl big coral">94</text>
        </g>
      )}
      {unit.glyph === 'accent' && (
        <g>
          <g className="gac">
            <path d="M14 22h52a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H34l-12 10v-10h-8a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" className="gbub" />
            <text x={40} y={49} textAnchor="middle" className="gl mid">UK</text>
          </g>
          <g className="gac">
            <path d="M146 22H94a8 8 0 0 0-8 8v22a8 8 0 0 0 8 8h32l12 10v-10h8a8 8 0 0 0 8-8V30a8 8 0 0 0-8-8z" className="gbub alt" />
            <text x={120} y={49} textAnchor="middle" className="gl mid">US</text>
          </g>
          <path d="M70 84l7 7 14-15" className="gchk" />
        </g>
      )}
      {unit.glyph === 'th' && (
        <g>
          <text x={50} y={66} textAnchor="middle" className="gth gl huge">θ</text>
          <text x={112} y={66} textAnchor="middle" className="gth gl huge">ð</text>
        </g>
      )}
    </svg>
  );
}
