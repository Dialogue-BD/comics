// Air or buzz, live: while a clip plays, breath streams out as particles when the
// recording is noise (f, s, th, h) and the throat line vibrates when it is voiced.
// Driven by the measured frame classes of the clip, not by animation timing.
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import engine, { clip as getClip } from '../../lib/audio';
import { frameClass } from '../../lib/hooks';
import { T } from '../../lib/settings';

export default function VoiceMeter({ ids, compact = false }) {
  const cv = useRef(null);
  const state = useRef({ parts: [], phase: 0, cls: 0, level: 0, active: null });
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ro = new ResizeObserver(size); ro.observe(c);
    const css = getComputedStyle(document.documentElement);
    const AIR = css.getPropertyValue('--v-air').trim() || '#4E6E8E';
    const BUZZ = css.getPropertyValue('--v-buzz').trim() || '#B8741A';
    const INK = css.getPropertyValue('--tx-muted').trim() || '#5F6A5C';
    const off = engine.subscribe(s => {
      const st = state.current;
      if (!ids.includes(s.id)) return;
      st.active = s.playing ? s.id : null;
      st.cls = s.playing ? frameClass(getClip(s.id), s.t) : 0;
    });
    const draw = () => {
      const st = state.current;
      ctx.clearRect(0, 0, W, H);
      const mx = Math.max(30, W * 0.12), my = H / 2;
      // mouth (side view: a simple open arc)
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(mx - 6, my, 16, -Math.PI * 0.35, Math.PI * 0.35); ctx.stroke();
      // throat / voice line
      st.level += ((st.cls === 2 ? 1 : 0) - st.level) * 0.25;
      st.phase += 0.55;
      ctx.strokeStyle = BUZZ; ctx.globalAlpha = 0.25 + 0.75 * st.level; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = mx + 8; x < W - 8; x += 2) {
        const k = (x - mx) / (W - mx);
        const amp = st.level * (H * 0.18) * (1 - k * 0.6);
        const y = my + Math.sin(x * 0.18 - st.phase) * amp;
        x === mx + 8 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
      // air particles
      if (st.cls === 1 || st.cls === 2) {
        const n = st.cls === 1 ? 5 : 1;
        for (let i = 0; i < n; i++) st.parts.push({ x: mx + 6, y: my + (Math.random() - 0.5) * 16, vx: 3 + Math.random() * 4, vy: (Math.random() - 0.5) * 1.6, a: 1, r: 1.5 + Math.random() * 2 });
      }
      ctx.fillStyle = AIR;
      st.parts = st.parts.filter(p => p.a > 0.02 && p.x < W);
      for (const p of st.parts) {
        p.x += p.vx; p.y += p.vy; p.a *= 0.955;
        ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    gsap.ticker.add(draw);
    return () => { gsap.ticker.remove(draw); off(); ro.disconnect(); };
  }, [ids.join('|')]);
  return (
    <div className={`voice-meter ${compact ? 'compact' : ''}`}>
      <canvas ref={cv} aria-hidden="true" />
      <div className="vm-legend">
        <span className="vm-air"><i />  <T en="air" bn="বাতাস" block={false} /></span>
        <span className="vm-buzz"><i /> <T en="buzz" bn="গুঞ্জন" block={false} /></span>
      </div>
    </div>
  );
}
