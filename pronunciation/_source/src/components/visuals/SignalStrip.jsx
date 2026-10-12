// Air or buzz, as one bold strip in time: coral stripes that flow where the sound is
// only air (f, s, th, the puff), a blue wave that vibrates where the voice is on.
// Measured from the recording; it lights up as the voice reaches it.
import React, { useEffect, useMemo, useRef } from 'react';
import engine, { clip as getClip } from '../../lib/audio';
import { useWidth } from '../../lib/settings';

export default function SignalStrip({ id, span, height = 34, showPuff = true }) {
  const c = getClip(id);
  const box = useRef(null);
  const W = useWidth(box);
  const R = useRef({});
  const uid = useMemo(() => 'ss' + Math.random().toString(36).slice(2, 8), []);
  const L = useMemo(() => {
    if (!c || !W) return null;
    const pad = 6, t0 = c.on - 0.04;
    const sp = span || (c.off - c.on + 0.08);
    const pps = (W - pad * 2) / sp;
    const X = (t) => pad + (t - t0) * pps;
    const mid = height / 2;
    const waves = (c.voice || []).map(([a, b]) => ({ a, b, x0: X(a), x1: X(b) }));
    const airs = (c.air || []).map(([a, b]) => ({ a, b, x0: X(a), x1: Math.max(X(a) + 3, X(b)) }));
    return { X, mid, waves, airs, pad };
  }, [c, W, span, height]);

  const wavePath = (x0, x1, mid, amp, ph) => {
    let d = '';
    for (let x = x0; x <= x1; x += 1.5) {
      const env = Math.min(1, (x - x0) / 6, (x1 - x) / 6);
      const y = mid + Math.sin((x - x0) / 4.2 + ph) * amp * Math.max(0, env);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(2);
    }
    return d;
  };

  useEffect(() => {
    if (!L) return;
    const r = R.current;
    let ph = 0;
    const set = (t, on) => {
      const x = on ? L.X(t) : -1;
      if (r.lit) r.lit.setAttribute('width', Math.max(0, x).toFixed(1));
      const inV = on && L.waves.some(w => t >= w.a && t <= w.b);
      const inA = on && L.airs.some(w => t >= w.a && t <= w.b);
      ph += 0.9;
      L.waves.forEach((w, i) => { const el = r['w' + i]; if (el) el.setAttribute('d', wavePath(w.x0, w.x1, L.mid, 7.5, inV ? ph : 0)); });
      if (r.pat) r.pat.setAttribute('patternTransform', `translate(${inA ? (ph * 2.2) % 12 : 0},0) rotate(-35)`);
      if (box.current) { box.current.classList.toggle('buzzing', inV); box.current.classList.toggle('blowing', inA); }
    };
    set(0, false);
    return engine.subscribe(s => {
      if (s.id !== id) return;
      if (s.playing) set(s.t, true);
      else { set(0, false); if (s.ended && r.lit) r.lit.setAttribute('width', W); }
    });
  }, [L, id, W]);

  if (!c) return null;
  return (
    <div className="sigstrip" ref={box} style={{ height }}>
      {L && (
        <svg width={W} height={height} aria-hidden="true">
          <defs>
            <pattern id={`${uid}-p`} ref={el => (R.current.pat = el)} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
              <rect width="12" height="12" className="ss-air-bg" /><rect width="5" height="12" className="ss-air-fg" />
            </pattern>
            <clipPath id={`${uid}-c`}><rect ref={el => (R.current.lit = el)} x="0" y="0" width="0" height={height} /></clipPath>
          </defs>
          <line x1={L.pad} x2={W - L.pad} y1={L.mid} y2={L.mid} className="ss-base" />
          {[false, true].map(lit => (
            <g key={String(lit)} className={lit ? 'ss-lit' : 'ss-dim'} clipPath={lit ? `url(#${uid}-c)` : undefined}>
              {L.airs.map((w, i) => <rect key={'a' + i} x={w.x0} y={L.mid - 7} width={w.x1 - w.x0} height={14} rx={7} fill={`url(#${uid}-p)`} className="ss-air" />)}
              {L.waves.map((w, i) => <path key={'v' + i} ref={lit ? (el => (R.current['w' + i] = el)) : undefined} d={wavePath(w.x0, w.x1, L.mid, 7.5, 0)} className="ss-buzz" />)}
              {showPuff && c.asp && c.asp[1] - c.asp[0] > 0.03 && (
                <g transform={`translate(${L.X(c.asp[0]).toFixed(1)},${L.mid})`} className="ss-puff">
                  {[-50, -25, 0, 25, 50].map(a => <line key={a} x1="2" y1="0" x2={(8 + 6 * Math.min(1, (c.asp[1] - c.asp[0]) / 0.1)) * Math.cos(a * Math.PI / 180)} y2={-14 * Math.sin(a * Math.PI / 180)} />)}
                </g>
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
