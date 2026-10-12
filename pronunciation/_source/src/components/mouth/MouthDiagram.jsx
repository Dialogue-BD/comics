// The mouth, drawn flat and clear: a front view (lip shape, teeth, tongue tip, and
// for long/short vowels the muscles that pull the lips) and a side cutaway (where
// the tongue sits, the voice box, the air). Both move with the recording, sound by
// sound, from the phone timings measured in clips.json.
import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import engine, { clip as getClip } from '../../lib/audio';
import { useVoiceKey } from '../../lib/hooks';
import { SHAPES, REST, track, shapeAt, focusShape } from './visemes';
import { T } from '../../lib/settings';

const KEYS = Object.keys(REST);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const f = (n) => n.toFixed(1);
const mix = (c1, c2, t) => {
  const p = (c) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
};

// closed / open smooth path through points (Catmull-Rom → cubic)
function smoothPath(pts, closed) {
  const n = pts.length;
  const P = (i) => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}

// ------------------------------------------------------------------ front view
// viewBox 0 0 240 190, mouth centre (120, 104)
function front(P, t) {
  const cx = 120, cy = 104;
  const hw = Math.max(16, 33 + 21 * P.spread - 19 * P.round + 2 * P.press);
  const gap = (2 + 34 * P.open * (1 - P.press)) * (1 - 0.75 * P.tuck);
  const gT = gap * 0.42 + 10 * P.tuck, gB = gap * 0.58 + 0.5;
  const n = lerp(2.5, 2.0, P.round) + 0.5 * P.press;
  const N = 28;
  const edge = (top) => {
    const out = [];
    for (let i = 0; i <= N; i++) {
      const th = (top ? 1 : -1) * Math.PI * (i / N);
      const c = Math.cos(th), s = Math.sin(th);
      const x = cx + hw * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
      const y = cy - (top ? gT : -gB) * Math.pow(Math.abs(s), 2 / n);
      out.push([x, y]);
    }
    return out;               // right corner → left corner (top) / right → left (bottom)
  };
  const top = edge(true), bot = edge(false);
  const opening = smoothPath([...top, ...bot.slice(1, -1).reverse()], true);
  // lips: outer edge from the inner edge, thickest in the middle, nothing at the corners
  const thin = 1 - 0.3 * P.spread * (0.4 + 0.6 * P.tension);
  const tU = (10 + 4 * P.round + 2 * P.press) * thin, tL = (13 + 5 * P.round + 2 * P.press + 2 * P.tuck) * thin;
  const outer = (pts, k, up) => pts.map(([x, y], i) => {
    const u = Math.abs((x - cx) / (hw + 0.01));
    const bow = up ? (1 - 0.32 * Math.exp(-(((x - cx) / 7) ** 2)) + 0.12 * Math.exp(-(((Math.abs(x - cx) - hw * 0.34) / 8) ** 2))) : 1;
    const th = k * Math.pow(Math.max(0, 1 - u * u), 0.55) * bow;
    return [x + (x - cx) * 0.04 * (1 - u), y + (up ? -th : th)];
  });
  const upOut = outer(top, tU, true), loOut = outer(bot, tL, false);
  const cornerR = [cx + hw + 2.5, cy + 0.5], cornerL = [cx - hw - 2.5, cy + 0.5];
  const upper = smoothPath([cornerR, ...upOut.slice(1, -1), cornerL, ...top.slice(1, -1).reverse()], true);
  const lower = smoothPath([cornerR, ...loOut.slice(1, -1), cornerL, ...bot.slice(1, -1).reverse()], true);
  // teeth: the top row is fixed to the skull, the bottom row rides on the jaw
  const tw = Math.min(54, hw * 1.25);
  const lt = cy + 1.5 + P.jaw * 26;
  const teethUp = `M${f(cx - tw)} ${cy - 22}H${f(cx + tw)}V${cy - 1}Q${f(cx + tw)} ${cy + 1} ${f(cx + tw - 3)} ${cy + 1}H${f(cx - tw + 3)}Q${f(cx - tw)} ${cy + 1} ${f(cx - tw)} ${cy - 1}Z`;
  const teethLo = `M${f(cx - tw * 0.9)} ${f(lt + 20)}H${f(cx + tw * 0.9)}V${f(lt + 2)}Q${f(cx + tw * 0.9)} ${f(lt)} ${f(cx + tw * 0.9 - 3)} ${f(lt)}H${f(cx - tw * 0.9 + 3)}Q${f(cx - tw * 0.9)} ${f(lt)} ${f(cx - tw * 0.9)} ${f(lt + 2)}Z`;
  const gapsUp = [-0.5, 0, 0.5].map(k => `M${f(cx + k * tw)} ${cy - 12}V${cy + 1}`).join('') + [-0.82, 0.82].map(k => `M${f(cx + k * tw)} ${cy - 10}V${cy}`).join('');
  const gapsLo = [-0.42, 0, 0.42].map(k => `M${f(cx + k * tw)} ${f(lt)}V${f(lt + 9)}`).join('');
  // tongue inside; its tip comes out between the teeth for TH
  const tTop = lt + 9 - 10 * Math.max(0, P.front) + 6 * Math.max(0, -P.front);
  const tongue = `M${f(cx - 38)} ${f(cy + 60)}Q${f(cx - 36)} ${f(tTop)} ${cx} ${f(tTop)}Q${f(cx + 36)} ${f(tTop)} ${f(cx + 38)} ${f(cy + 60)}Z`;
  const tipOut = sm(0.05, 0.4, P.tipZ);
  const tip = tipOut > 0.01 ? `M${f(cx - 17)} ${f(cy + 5)}Q${cx} ${f(cy - 4 + 6 * (1 - tipOut))} ${f(cx + 17)} ${f(cy + 5)}Q${cx} ${f(cy + 5 + 10 * tipOut)} ${f(cx - 17)} ${f(cy + 5)}Z` : '';
  // the muscles that pull the lip corners: tight and straight when tense, slack when relaxed
  const tens = P.tension;
  const quiver = tens > 0.6 ? Math.sin(t * 62) * 1.3 * (tens - 0.6) / 0.4 : 0;
  const muscles = [-1, 1].flatMap(sd => {
    const c0 = [cx + sd * (hw + 2), cy];
    const ends = [[cx + sd * 92, cy - 62], [cx + sd * 104, cy - 2]];
    return ends.map(([ex, ey], k) => {
      const mx = (c0[0] + ex) / 2, my = (c0[1] + ey) / 2 + (1 - tens) * (k ? 15 : 20) + quiver * (k ? 1 : -1);
      return `M${f(c0[0])} ${f(c0[1])}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
    });
  });
  const muscleColor = mix('#3D8FBF', '#E8553C', sm(0.2, 0.85, tens));
  return { opening, upper, lower, teethUp, teethLo, gapsUp, gapsLo, tongue, tip, muscles, muscleColor, tens };
}

// ------------------------------------------------------------------ side cutaway
// viewBox 0 0 240 190, facing right. Lip line at y = 100.
const PIV = [70, 70];
function rot(p, a) {
  const c = Math.cos(a), s = Math.sin(a), x = p[0] - PIV[0], y = p[1] - PIV[1];
  return [PIV[0] + x * c - y * s, PIV[1] + x * s + y * c];
}
function side(P) {
  const ja = P.jaw * 0.1;                        // jaw rotation (radians)
  const J = (p) => rot([p[0], p[1] + P.jaw * 3], ja);
  const pr = 7 * P.round - 2.5 * P.spread;       // lips push forward / pull back
  const gap = (1 + 13 * P.open * (1 - P.press)) * (1 - 0.8 * P.tuck);
  // upper face: forehead and nose (an outline), then the upper lip (filled)
  const face = smoothPath([[170, 4], [182, 26], [181, 40], [196, 56], [211, 68], [204, 74], [192, 76], [188, 82]], false);
  const upperLip = smoothPath([[188, 82], [195 + pr, 88.5], [196 + pr, 95], [191.5 + pr, 100 - gap / 2], [183, 99.5 - gap / 2 - 2 * P.tuck], [180.5, 91]], true);
  // lower lip (filled) and the chin line, both riding on the jaw
  const tuckY = P.tuck * 9;
  const ll = [[182, 101 + gap / 2 - tuckY], [190.5 + pr - 3 * P.tuck, 101 + gap / 2 - tuckY * 0.9], [194.5 + pr - 4 * P.tuck, 108 - tuckY * 0.5], [189, 116.5], [180.5, 112]];
  const lowerLip = smoothPath(ll.map(J), true);
  const chin = [[189, 116.5], [186, 124], [191, 134], [190, 147], [176, 157], [150, 162], [128, 163]];
  const chinLine = smoothPath(chin.map(J), false);
  const jawEnd = J([128, 163]);
  const neck = smoothPath([jawEnd, [116, 170], [110, 190]], false);
  // palate: alveolar ridge → hard palate → soft palate
  const palate = smoothPath([[176, 84], [168, 81], [150, 74], [124, 72], [104, 76], [92, 86], [88, 94]], false);
  const throatBack = smoothPath([[66, 78], [74, 96], [76, 130], [78, 190]], false);
  const nasal = smoothPath([[92, 86], [96, 66], [140, 62], [186, 66]], false);
  // teeth
  const toothUp = 'M171 78Q178 79 179.5 88L180 100Q177 102 174 99L172 90Z';
  const tl = [[174, 103], [180.5, 102], [180, 112], [173, 118], [171, 108]].map(J);
  const toothLo = smoothPath(tl, true);
  // tongue: root → back → middle → front → tip, back along the floor. The root stays
  // put in the throat; the front rides on the jaw.
  const yb = 104 - 16 * P.back, ym = 98 - 14 * P.mid, yf = 101 - 13 * P.front;
  const tx = 172 + 22 * P.tipZ, ty = 96 - 17 * P.tipY;
  const Jw = (p) => { const q = J(p); const w = clamp((p[0] - 92) / 60, 0, 1); return [lerp(p[0], q[0], w), lerp(p[1], q[1], w)]; };
  const tonguePts = [[88, 158], [86, 138], [91, yb + 9], [104, yb], [128, ym], [151, yf], [tx - 4, ty - 2], [tx + 1.5, ty + 1.5], [tx - 5, ty + 6], [150, 118], [127, 126], [104, 136], [92, 150]];
  const tongue = smoothPath(tonguePts.map(Jw), true);
  // constriction point (where the air hisses) and the lip opening
  const lipX = 194 + pr;
  let air = [lipX - 2, 100];
  if (P.tuck > 0.5) air = [181, 101];
  else if (P.tipZ > 0.2) air = [tx, ty - 3];
  else if (P.tipY > 0.15) air = [J([tx + 2, ty])[0], 92];
  return { face, upperLip, lowerLip, chinLine, neck, palate, throatBack, nasal, toothUp, toothLo, tongue, air, lipX, box: [92, 176] };
}

// ------------------------------------------------------------------ component
export default function MouthDiagram({ ids = [], pose, poseFor, muscles = false, views = ['front', 'side'], className = '', caption, small = false }) {
  const root = useRef(null);
  const els = useRef({});
  const key = ids.join('|');
  const vk = useVoiceKey(ids);            // each voice moves its mouth on its own timings
  const tracks = useMemo(() => Object.fromEntries(ids.map(id => [id, track((getClip(id) || {}).ph)])), [key, vk]);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;          // the frame loop always reads the latest voice's track
  const restPose = pose || (ids[0] ? focusShape((getClip(ids[0]) || {}).ph) : 'rest');
  const st = useRef(null);
  if (!st.current) {
    const start = { ...(SHAPES[restPose] || REST) };
    st.current = { cur: start, vel: Object.fromEntries(KEYS.map(k => [k, 0])), pose: restPose, muscles, play: null, voice: 0, air: 0, parts: [], visible: true, puffDone: false, lastRing: 0, rings: [], running: false };
  }

  useEffect(() => {
    const S = st.current;
    S.pose = restPose; S.muscles = muscles;
    wake();
  }, [restPose, muscles]);

  function draw(t) {
    const S = st.current, E = els.current, P = S.cur;
    if (E.front) {
      const g = front(P, t);
      E.opening.setAttribute('d', g.opening);
      E.clip.setAttribute('d', g.opening);
      E.upper.setAttribute('d', g.upper); E.lower.setAttribute('d', g.lower);
      E.teethUp.setAttribute('d', g.teethUp); E.teethLo.setAttribute('d', g.teethLo);
      E.gapsUp.setAttribute('d', g.gapsUp); E.gapsLo.setAttribute('d', g.gapsLo);
      E.tongueF.setAttribute('d', g.tongue);
      E.tip.setAttribute('d', g.tip || 'M0 0');
      const mv = S.musVis || 0;
      E.muscles.forEach((m, i) => { m.setAttribute('d', g.muscles[i]); m.style.stroke = g.muscleColor; m.style.strokeWidth = 5 + 3.5 * g.tens; });
      E.musG.style.opacity = mv;
      E.musG.classList.toggle('tense', g.tens > 0.6);
    }
    if (E.side) {
      const s = side(P);
      E.face.setAttribute('d', s.face); E.upperLip.setAttribute('d', s.upperLip); E.lowerLip.setAttribute('d', s.lowerLip); E.chin.setAttribute('d', s.chinLine);
      E.neck.setAttribute('d', s.neck); E.palate.setAttribute('d', s.palate); E.throat.setAttribute('d', s.throatBack); E.nasal.setAttribute('d', s.nasal);
      E.toothLo.setAttribute('d', s.toothLo); E.tongueS.setAttribute('d', s.tongue);
      const v = S.voice;
      E.box.style.fill = mix('#E3EAD9', '#1E7FA3', v);
      E.folds.setAttribute('transform', `translate(${(Math.sin(t * 2 * Math.PI * 22) * 1.4 * v).toFixed(2)},0)`);
      S.airAt = s.air; S.lipX = s.lipX;
    }
  }

  function step(dt, t) {
    const S = st.current;
    let target = SHAPES[S.pose] || REST;
    let pt = -1;
    if (S.play) {
      pt = engine.time();
      const tr = tracksRef.current[S.play.id] || [];
      const sh = shapeAt(tr, pt, S.play.end);
      target = SHAPES[sh || (pt < (tr[0] || { t: 0 }).t ? 'rest' : S.pose)] || REST;
    }
    const nSub = Math.ceil(dt / 0.006), h = dt / nSub;
    let moving = false;
    KEYS.forEach(k => {
      const w = (k === 'press' || k === 'tuck') ? 44 : (k === 'tension' ? 13 : 28);
      for (let q = 0; q < nSub; q++) {
        const a = w * w * (target[k] - S.cur[k]) - 1.84 * w * S.vel[k];
        S.vel[k] += a * h; S.cur[k] += S.vel[k] * h;
      }
      if (!isFinite(S.cur[k])) { S.cur[k] = target[k]; S.vel[k] = 0; }
      if (Math.abs(target[k] - S.cur[k]) > 0.002 || Math.abs(S.vel[k]) > 0.01) moving = true;
    });
    // voice / air from the measured recording
    let vT = 0, aT = 0;
    if (S.play) {
      const c = S.play.clip;
      if ((c.voice || []).some(([a, b]) => pt >= a && pt <= b)) vT = 1;
      if ((c.air || []).some(([a, b]) => pt >= a && pt <= b)) aT = 1;
      if (c.asp && !S.puffDone && pt >= c.asp[0] - 0.005) { S.puffDone = true; burst(clamp((c.asp[1] - c.asp[0]) / 0.1, 0.1, 1.2)); }
    }
    S.voice += (vT - S.voice) * Math.min(1, dt * 20);
    S.air += (aT - S.air) * Math.min(1, dt * 24);
    S.musVis = (S.musVis || 0) + ((S.muscles ? 1 : 0) - (S.musVis || 0)) * Math.min(1, dt * 6);
    if (S.air > 0.1 || (S.voice > 0.4 && S.play)) emit(dt, S.air > 0.1 ? 1 : 0.2);
    if (S.voice > 0.5 && t - S.lastRing > 0.12) { S.lastRing = t; ring(); }
    const alive = stepParts(dt);
    draw(t);
    const tenseQuiver = S.musVis > 0.1 && S.cur.tension > 0.6;
    return moving || alive || !!S.play || Math.abs(S.musVis - (S.muscles ? 1 : 0)) > 0.01 || tenseQuiver;
  }

  // particles: air (coral dots) and voice rings (blue arcs up the throat)
  function emit(dt, k) {
    const S = st.current;
    S.acc = (S.acc || 0) + dt * 70 * k;
    while (S.acc > 1) { S.acc -= 1; spawn(S.airAt || [194, 100], 70 + Math.random() * 50, 18, 0.55); }
  }
  function burst(k) {
    const S = st.current;
    const n = Math.round(6 + 26 * k);
    for (let i = 0; i < n; i++) spawn([(S.lipX || 194) - 1, 100], 110 + 160 * k * Math.random(), 30 + 30 * k, 0.45 + 0.3 * k, true);
  }
  function spawn(at, speed, spread, life, big) {
    const S = st.current, E = els.current;
    const el = (E.parts || []).find(q => !q._on);
    if (!el) return;
    el._on = true;
    el._p = { x: at[0], y: at[1] + (Math.random() - 0.5) * 3, vx: speed, vy: (Math.random() - 0.5) * spread, life, max: life, r: big ? 2.6 : 1.8 };
  }
  function ring() {
    const E = els.current;
    const el = (E.rings || []).find(q => !q._on);
    if (!el) return;
    el._on = true; el._life = 0;
  }
  function stepParts(dt) {
    const E = els.current;
    let alive = false;
    (E.parts || []).forEach(el => {
      if (!el._on) return;
      const p = el._p;
      p.life -= dt;
      if (p.life <= 0) { el._on = false; el.setAttribute('opacity', 0); return; }
      alive = true;
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.97; p.vy *= 0.97;
      const u = p.life / p.max;
      el.setAttribute('cx', p.x.toFixed(1)); el.setAttribute('cy', p.y.toFixed(1));
      el.setAttribute('r', (p.r * (1.5 - 0.5 * u)).toFixed(2));
      el.setAttribute('opacity', Math.min(1, u * 1.8).toFixed(2));
    });
    (E.rings || []).forEach(el => {
      if (!el._on) return;
      el._life += dt;
      const u = el._life / 0.7;
      if (u >= 1) { el._on = false; el.setAttribute('opacity', 0); return; }
      alive = true;
      el.setAttribute('transform', `translate(${(84 - 2 * u).toFixed(1)},${(158 - 56 * u).toFixed(1)}) scale(${(1 + 0.5 * u).toFixed(2)})`);
      el.setAttribute('opacity', (0.9 * (1 - u)).toFixed(2));
    });
    return alive;
  }

  // one loop per diagram, asleep when nothing moves
  const loop = useRef(null);
  function wake() {
    const S = st.current;
    if (S.running || !S.visible) return;
    S.running = true;
    let last = performance.now();
    const fn = () => {
      const now = performance.now();
      const dt = Math.min(1 / 24, Math.max(0.001, (now - last) / 1000)); last = now;
      const busy = step(dt, now / 1000);
      if (!busy || !S.visible) { gsap.ticker.remove(fn); S.running = false; loop.current = null; }
    };
    loop.current = fn;
    gsap.ticker.add(fn);
  }

  useEffect(() => {
    draw(0);
    const S = st.current;
    const io = new IntersectionObserver(es => { S.visible = es[0].isIntersecting; if (S.visible) wake(); }, { rootMargin: '80px' });
    if (root.current) io.observe(root.current);
    const off = engine.subscribe(s => {
      if (!ids.includes(s.id)) { if (s.playing && S.play) { S.play = null; wake(); } return; }
      if (s.playing) {
        if (!S.play || S.play.id !== s.id) {
          const c = getClip(s.id);
          S.play = { id: s.id, clip: c, end: c.ph && c.ph.length ? c.ph[c.ph.length - 1][2] : c.off };
          S.puffDone = false;
          if (poseFor) S.pose = poseFor(s.id);
          wake();
        }
      } else if (S.play) { S.play = null; wake(); }
    });
    wake();
    return () => { off(); io.disconnect(); if (loop.current) gsap.ticker.remove(loop.current); };
  }, [key]);

  const reg = (k) => (el) => { els.current[k] = el; };
  const regList = (k, i) => (el) => { (els.current[k] = els.current[k] || [])[i] = el; };
  const uid = useMemo(() => 'md' + Math.random().toString(36).slice(2, 8), []);

  return (
    <figure ref={root} className={`mouthdia ${small ? 'small' : ''} ${className}`}>
      <div className="md-panels">
        {views.includes('front') && (
          <div className="md-panel">
            <svg viewBox="12 30 216 166" ref={reg('front')} aria-hidden="true">
              <defs>
                <clipPath id={`${uid}-c`}><path ref={reg('clip')} /></clipPath>
                <filter id={`${uid}-g`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <ellipse cx="120" cy="108" rx="112" ry="92" className="md-skin" />
              <path d="M98 40q22 12 44 0" className="md-nose" />
              <path d="M84 176q36 16 72 0" className="md-chin" />
              <g ref={reg('musG')} className="md-muscles" filter={`url(#${uid}-g)`} style={{ opacity: 0 }}>
                {[0, 1, 2, 3].map(i => <path key={i} ref={regList('muscles', i)} className="md-muscle" />)}
              </g>
              <path ref={reg('opening')} className="md-cavity" />
              <g clipPath={`url(#${uid}-c)`}>
                <path ref={reg('tongueF')} className="md-tongue" />
                <path ref={reg('teethLo')} className="md-teeth" />
                <path ref={reg('gapsLo')} className="md-tgap" />
                <path ref={reg('teethUp')} className="md-teeth" />
                <path ref={reg('gapsUp')} className="md-tgap" />
              </g>
              <path ref={reg('lower')} className="md-lip" />
              <path ref={reg('tip')} className="md-tongue tip" />
              <path ref={reg('upper')} className="md-lip" />
            </svg>
            <span className="md-tag"><T en="front" bn="সামনে" block={false} /></span>
          </div>
        )}
        {views.includes('side') && (
          <div className="md-panel">
            <svg viewBox="58 36 184 142" ref={reg('side')} aria-hidden="true">
              <path ref={reg('nasal')} className="md-faint" />
              <path ref={reg('throat')} className="md-line" />
              <path ref={reg('palate')} className="md-palate" />
              <path ref={reg('tongueS')} className="md-tongue" />
              <path d="M171 78Q178 79 179.5 88L180 100Q177 102 174 99L172 90Z" className="md-teeth" />
              <path ref={reg('toothLo')} className="md-teeth" />
              <path ref={reg('face')} className="md-line" />
              <path ref={reg('upperLip')} className="md-lip-side" />
              <path ref={reg('lowerLip')} className="md-lip-side" />
              <path ref={reg('chin')} className="md-line" />
              <path ref={reg('neck')} className="md-line" />
              <g className="md-voice">
                <rect ref={reg('box')} x="77" y="160" width="24" height="15" rx="5" className="md-box" />
                <g ref={reg('folds')}><path d="M82 167.5q7-4 7 0q0 4-7 0M96 167.5q-7-4-7 0q0 4 7 0" className="md-folds" /></g>
              </g>
              {Array.from({ length: 5 }).map((_, i) => <path key={'r' + i} ref={regList('rings', i)} d="M-9 0a9 5 0 0 1 18 0" className="md-ring" opacity="0" />)}
              {Array.from({ length: 46 }).map((_, i) => <circle key={'p' + i} ref={regList('parts', i)} r="2" className="md-air" opacity="0" />)}
            </svg>
            <span className="md-tag"><T en="side" bn="পাশ" block={false} /></span>
          </div>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
