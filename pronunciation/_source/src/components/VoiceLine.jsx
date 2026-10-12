// The voice line: what students see for every recording.
//   · a calligraphic brush stroke = the melody (height = pitch, weight = strength)
//   · the words underneath, sized by stress: big beat big, small words small
//   · a ball that bounces from beat to beat with the voice — it never stops to
//     wait; it rebounds the moment it lands, so the rhythm keeps its momentum
// A long sentence that will not fit on a phone stacks one thought group per row,
// the way a reader breathes.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import engine from '../lib/audio';
import { useClip } from '../lib/hooks';
import { useWidth } from '../lib/settings';
import { groupsOf, stroke, ribbonPath, centerPath, yScale, makeBall } from '../lib/line';

function uiScale() {
  if (typeof window === 'undefined') return 1;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui'));
  return isFinite(v) && v > 0 ? v : 1;
}

const isFunctionWord = (w) => w.syl.every(s => s.lv === 0);

export default function VoiceLine({
  id,
  labels = 'auto',        // 'auto' | 'words' | 'syllables' | 'none'
  line = true,
  ball = true,
  size = 'md',            // 'sm' | 'md' | 'lg'
  span,                   // seconds across the width (to compare clips on one scale)
  stack = 'auto',         // 'auto' | 'never' | 'always'
  tone = 'ink',           // 'ink' | 'flat' | 'quiet'
  playable = true,
  forcePlayed = false,
  showPauses = true,
  highlight,              // optional set of word indexes to mark (games)
  className = '',
  ariaLabel,
  onPlay,
}) {
  const c = useClip(id);              // follows the voice that is speaking
  const wrap = useRef(null);
  const W = useWidth(wrap);
  const [played, setPlayed] = useState(forcePlayed);
  const refs = useRef({ rows: [], syl: [], ball: null });
  const ui = uiScale();
  const K = size === 'lg' ? 1.18 : size === 'sm' ? 0.78 : 1;
  const multi = c && c.words.length > 1;
  const mode = labels === 'auto' ? (c && c.words.length > 3 ? 'words' : 'syllables') : labels;

  const L = useMemo(() => {
    if (!c || !W) return null;
    const pad = Math.round(14 * ui);
    const lead = 0.08;
    const groups = groupsOf(c);
    const avail = W - pad * 2;
    const minPps = (multi ? 150 : 220) * ui * K;
    const maxPps = (multi ? 560 : 640) * ui * K;
    const whole = (span != null ? span : (c.off - c.on) + lead * 2);
    let pps = Math.min(maxPps, avail / whole);
    let rows;
    const canStack = groups.length > 1 && stack !== 'never';
    if (stack === 'always' && canStack || (canStack && (pps < minPps || c.words.length > 7))) {
      const rowSpan = Math.max(...groups.map(g => g.e - g.s)) + lead * 2;
      pps = Math.min(maxPps, avail / rowSpan);
      rows = groups.map(g => ({ t0: g.s - lead, t1: g.e + lead, groups: [g] }));
    } else {
      const t0 = span != null ? (c.on + c.off) / 2 - span / 2 : c.on - lead;
      rows = [{ t0, t1: t0 + whole, groups }];
    }
    // vertical bands
    // a sentence broken into rows: each row is one short tune, so it needs less height
    const lineH = line ? Math.round((multi ? (rows.length > 1 ? 70 : 92) : 104) * ui * K) : 0;
    const wf = Math.max(0.62, Math.min(1, W / 640));     // narrower screens: smaller labels
    const fs = (s, w) => {
      if (mode === 'words') {
        if (w.tonic) return 31 * ui * K * wf;
        if (isFunctionWord(w)) return 15 * ui * K * Math.max(0.8, wf);
        return (w.syl.some(q => q.lv === 2) ? 21 : 18) * ui * K * wf;
      }
      return [21, 28, multi ? 40 : 50][s.lv] * ui * K * wf * (multi && w.tonic && s.lv === 2 ? 1.12 : 1);
    };
    const maxF = Math.max(...c.words.flatMap(w => w.syl.map(s => fs(s, w))));
    const ballR = Math.round((multi ? 7 : 9) * ui * K);
    const labelsH = mode === 'none' ? (ball ? ballR * 2 + 10 * ui : 0) : maxF * 1.05;
    const gapLB = (line ? (multi ? 20 : 26) * ui * K : 0) + (ball ? 16 * ui : 0);
    const rowH = Math.round(8 * ui + lineH + gapLB + labelsH + 10 * ui);
    const yOf = yScale(8 * ui, Math.max(10, lineH - 4 * ui));
    rows.forEach((r, ri) => {
      r.y = ri * rowH;
      r.x0 = rows.length > 1 ? pad : pad + Math.max(0, (avail - (r.t1 - r.t0) * pps) / 2);
      r.X = (t) => r.x0 + (t - r.t0) * pps;
      r.base = Math.round(8 * ui + lineH + gapLB + maxF * 0.9);
      r.strokes = line ? r.groups.map(g => stroke(id, g.s - 0.03, g.e + 0.03)).filter(Boolean) : [];
    });
    return { rows, pps, rowH, H: rowH * rows.length, yOf, fs, ballR, lineH, pad };
  }, [c, W, ui, K, span, stack, line, ball, mode, multi, id]);

  // static geometry: brush outlines, labels laid out without overlaps, beats
  const geo = useMemo(() => {
    if (!L) return null;
    const wMin = 1.8 * ui * K, wMax = (multi ? 17 : 23) * ui * K;
    const rows = L.rows.map(r => ({
      ribbons: r.strokes.map(p => ribbonPath(p, r.X, L.yOf, wMin, wMax)),
      centers: r.strokes.map(p => centerPath(p, r.X, L.yOf)),
    }));
    // labels
    const items = [];
    c.words.forEach((w, wi) => {
      const ri = L.rows.findIndex(r => r.groups.some(g => g.words.includes(wi)));
      const r = L.rows[ri];
      if (mode === 'words') {
        const f = L.fs(w.syl[0], w);
        items.push({ key: 'w' + wi, wi, ri, x: r.X((w.s + w.e) / 2), f, text: w.w, w: f * 0.5 * w.w.length + 6 * ui, lv: w.tonic ? 3 : Math.max(...w.syl.map(s => s.lv)), fn: isFunctionWord(w), tonic: !!w.tonic });
      } else if (mode === 'syllables') {
        w.syl.forEach((s, si) => {
          const f = L.fs(s, w);
          const t = s.t + (si < w.syl.length - 1 ? '·' : '');
          items.push({ key: `s${wi}-${si}`, wi, si, ri, x: r.X((s.s + s.e) / 2), f, text: t, w: f * 0.5 * t.length + 4 * ui, lv: s.lv, fn: isFunctionWord(w), tonic: !!w.tonic });
        });
      }
    });
    // keep each label near its sound, never on top of its neighbour (per row)
    L.rows.forEach((r, ri) => {
      const it = items.filter(q => q.ri === ri);
      const gap = 4 * ui;
      for (let i = 1; i < it.length; i++) {
        const a = it[i - 1], b = it[i];
        const extra = mode === 'syllables' && a.wi !== b.wi ? 6 * ui : 0;
        const min = a.x + a.w / 2 + gap + extra + b.w / 2;
        if (b.x < min) b.x = min;
      }
      const right = W - L.pad;
      for (let i = it.length - 1; i >= 0; i--) {
        const b = it[i];
        const lim = i === it.length - 1 ? right - b.w / 2 : it[i + 1].x - it[i + 1].w / 2 - gap - b.w / 2;
        if (b.x > lim) b.x = lim;
      }
      // and never off the left edge: if squeezed, share the room evenly
      if (it.length && it[0].x - it[0].w / 2 < L.pad) {
        const total = it.reduce((a, q) => a + q.w + gap, -gap);
        let x = L.pad + Math.max(0, (W - 2 * L.pad - total) / 2);
        it.forEach(q => { q.x = x + q.w / 2; x += q.w + gap; });
      }
    });
    // beats for the ball: every syllable's vowel onset, landing on its label
    const beats = [];
    c.words.forEach((w, wi) => w.syl.forEach((s, si) => {
      const ri = L.rows.findIndex(r => r.groups.some(g => g.words.includes(wi)));
      const r = L.rows[ri];
      const lab = mode === 'words' ? items.find(q => q.wi === wi) : items.find(q => q.wi === wi && q.si === si);
      const f = lab ? lab.f : 20 * ui;
      const x = mode === 'words' && w.syl.length > 1 ? r.X(s.v) : (lab ? lab.x : r.X(s.v));
      const top = mode === 'none' ? r.base - 4 * ui : r.base - f * (s.lv === 0 && mode === 'syllables' ? 0.62 : 0.74);
      beats.push({ t: s.v, x: mode === 'words' ? Math.max(lab.x - lab.w / 2 + L.ballR, Math.min(lab.x + lab.w / 2 - L.ballR, x)) : x, y: r.y + top - L.ballR - 2 * ui, lv: s.lv, row: ri, wi, si });
    }));
    beats.sort((a, b) => a.t - b.t);
    const bl = makeBall(beats, c.off, { ui: ui * K, k: multi ? 95 : 120, maxH: multi ? 40 : 56 });
    return { rows, items, ball: bl };
  }, [L, c, mode, ui, K, W, multi]);

  // ---- live playback: drive the DOM directly at 60 fps ----
  useEffect(() => {
    if (!L || !geo) return;
    const r = refs.current;
    let lastLand = -2, settle = null;
    const putBall = (p) => {
      if (!r.ball || !p) return;
      const sq = p.sq || 0;
      r.ball.setAttribute('transform', `translate(${p.x.toFixed(1)},${(p.y + sq * L.ballR * 0.35).toFixed(1)}) scale(${(1 + sq * 0.32).toFixed(3)},${(1 - sq * 0.3).toFixed(3)})`);
    };
    const reveal = (t, on) => {
      L.rows.forEach((row, ri) => {
        const el = r.rows[ri];
        if (!el) return;
        let w;
        if (!on) w = played ? W : 0;
        else if (t >= row.t1) w = W;
        else if (t <= row.t0) w = 0;
        else w = row.X(t);
        el.setAttribute('width', Math.max(0, w).toFixed(1));
      });
    };
    const hitLabels = (upTo) => {
      geo.items.forEach((it, k) => {
        const el = r.syl[k];
        if (!el) return;
        const b = geo.ball.beats.findIndex(q => q.wi === it.wi && (mode === 'words' || q.si === it.si));
        el.classList.toggle('hit', b >= 0 && b <= upTo);
      });
    };
    const land = (i) => {
      const b = geo.ball.beats[i];
      if (!b) return;
      const k = geo.items.findIndex(it => it.wi === b.wi && (mode === 'words' || it.si === b.si));
      const el = r.syl[k];
      if (!el) return;
      el.classList.add('hit');
      const it = geo.items[k];
      if (mode === 'words' && b.si > 0) return;      // one pop per word
      if (it.fn) gsap.fromTo(el, { x: -6 * ui, skewX: -14 }, { x: 0, skewX: 0, duration: 0.32, ease: 'power2.out' });
      else if (b.lv === 2) gsap.fromTo(el, { scale: 1.28, y: -5 * ui }, { scale: 1, y: 0, duration: 0.55, ease: 'back.out(2.6)', transformOrigin: '50% 100%' });
      else gsap.fromTo(el, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: 'power2.out', transformOrigin: '50% 100%' });
    };
    // resting state: the ball waits on the first beat — it does not fly in
    reveal(0, false);
    putBall(played ? geo.ball.rest : geo.ball.rest);
    if (played) hitLabels(1e9);
    const off = engine.subscribe(s => {
      if (s.id !== id) return;
      if (settle) { settle.kill(); settle = null; }
      if (s.playing) {
        if (lastLand === -2) { hitLabels(-1); lastLand = -1; if (wrap.current) wrap.current.classList.add('is-live'); }
        reveal(s.t, true);
        const p = geo.ball.at(s.t);
        putBall(p);
        if (p && p.land > lastLand) { for (let i = lastLand + 1; i <= p.land; i++) land(i); lastLand = p.land; }
      } else {
        lastLand = -2;
        if (wrap.current) wrap.current.classList.remove('is-live');
        if (s.ended) {
          setPlayed(true);
          hitLabels(1e9);
          reveal(1e9, true);
          // let the ball finish its roll, then glide home to the first beat
          const end = geo.ball.at(1e9);
          putBall(end);
          const o = { x: end.x, y: end.y };
          settle = gsap.to(o, { x: geo.ball.rest.x, y: geo.ball.rest.y, duration: 0.9, delay: 0.7, ease: 'power2.inOut', onUpdate: () => putBall({ x: o.x, y: o.y - Math.sin(Math.PI * (Math.abs(o.x - end.x) / Math.max(1, Math.abs(geo.ball.rest.x - end.x)))) * 10 * ui, sq: 0 }) });
        } else {
          reveal(0, false);
          putBall(geo.ball.rest);
          hitLabels(played ? 1e9 : -1);
        }
      }
    });
    return () => { off(); if (settle) settle.kill(); };
  }, [L, geo, played, id, W, mode, ui]);

  useEffect(() => { if (forcePlayed) setPlayed(true); }, [forcePlayed]);

  // the ghost stroke draws itself in when it first scrolls into view
  useEffect(() => {
    const el = wrap.current;
    if (!el || !L || !line) return;
    const paths = el.querySelectorAll('.vl-guide');
    if (!paths.length) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    paths.forEach(p => { const len = p.getTotalLength ? p.getTotalLength() : 600; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    const io = new IntersectionObserver((es) => {
      if (es.some(e => e.isIntersecting)) {
        paths.forEach((p, i) => gsap.to(p, { strokeDashoffset: 0, duration: 1.1, delay: 0.1 + i * 0.25, ease: 'power2.inOut' }));
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [L && L.H, line, id]);

  if (!c) return <div className="vline vl-missing">missing clip {id}</div>;

  const play = () => {
    if (!playable) return;
    if (engine.playingId() === id) { engine.stop(); return; }
    onPlay && onPlay(id);
    engine.play(id);
  };

  const clipId = (ri) => `vlc-${id}-${ri}-${W}`;
  return (
    <div
      ref={wrap}
      data-clip={id}
      className={`vline tone-${tone} size-${size} ${played ? 'is-played' : ''} ${playable ? 'is-playable' : ''} ${multi ? 'is-multi' : 'is-word'} ${className}`}
      style={{ height: L ? L.H : undefined }}
      role={playable ? 'button' : undefined}
      tabIndex={playable ? 0 : undefined}
      aria-label={ariaLabel || (playable ? `Play “${c.words.map(w => w.w).join(' ')}”` : undefined)}
      onClick={play}
      onKeyDown={e => { if (playable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); play(); } }}
    >
      {L && geo && (
        <svg width={W} height={L.H} viewBox={`0 0 ${W} ${L.H}`} aria-hidden="true">
          <defs>
            {L.rows.map((row, ri) => (
              <clipPath key={ri} id={clipId(ri)}>
                <rect ref={el => (refs.current.rows[ri] = el)} x={0} y={row.y - 20} width={0} height={L.rowH + 20} />
              </clipPath>
            ))}
          </defs>
          {L.rows.map((row, ri) => (
            <g key={ri}>
              {line && geo.rows[ri].ribbons.map((d, k) => (
                <g key={k} transform={`translate(0,${row.y})`}>
                  <path d={geo.rows[ri].centers[k]} className="vl-guide" />
                  <path d={d} className="vl-ghost" />
                </g>
              ))}
              {line && (
                <g clipPath={`url(#${clipId(ri)})`}>
                  {geo.rows[ri].ribbons.map((d, k) => <path key={k} d={d} className="vl-ink" transform={`translate(0,${row.y})`} />)}
                </g>
              )}
              {showPauses && L.rows.length === 1 && row.groups.length > 1 && row.groups.slice(0, -1).map((g, gi) => {
                const nx = row.groups[gi + 1];
                return <text key={'p' + gi} className="vl-pause" x={row.X((g.e + nx.s) / 2)} y={row.y + row.base} fontSize={22 * ui * K} textAnchor="middle">//</text>;
              })}
              {showPauses && L.rows.length > 1 && ri < L.rows.length - 1 && (
                <text className="vl-pause" x={Math.min(W - L.pad - 8 * ui, row.X(row.t1) + 10 * ui)} y={row.y + row.base} fontSize={22 * ui * K} textAnchor="middle">//</text>
              )}
            </g>
          ))}
          {mode !== 'none' && (
            <g className="vl-labels">
              {(() => { refs.current.syl = []; return null; })()}
              {geo.items.map((it, k) => {
                const row = L.rows[it.ri];
                const cls = `vl-l lv${it.lv} ${it.fn ? 'fn' : ''} ${it.tonic ? 'tonic' : ''} ${highlight && highlight.has(it.wi) ? 'mark' : ''}`;
                return (
                  <text key={it.key} ref={el => (refs.current.syl[k] = el)} className={cls} x={it.x} y={row.y + row.base} fontSize={it.f} textAnchor="middle">{it.text}</text>
                );
              })}
            </g>
          )}
          {ball && (
            <g ref={el => (refs.current.ball = el)} className="vl-ball">
              <circle r={L.ballR} />
              <circle r={L.ballR * 0.36} cx={-L.ballR * 0.32} cy={-L.ballR * 0.34} className="vl-ball-shine" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
