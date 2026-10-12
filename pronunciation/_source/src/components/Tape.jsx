// The Tape: the voice drawn in time.
//   height  = pitch (the melody line, measured from the recording)
//   size    = strength (stressed syllables get the big gold beat)
//   bars    = loudness (the waveform)
//   //      = a pause between thought groups
// A short clip is laid out whole and the playhead sweeps across it. A long one
// slides past a fixed playhead, so a sentence still fits on a phone.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import engine, { clip as getClip } from '../lib/audio';
import { useWidth } from '../lib/settings';

const ST_LO = -8, ST_HI = 10;         // one fixed pitch scale for every clip: comparisons stay honest

function uiScale() {
  if (typeof window === 'undefined') return 1;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui'));
  return isFinite(v) && v > 0 ? v : 1;
}

export default function Tape({
  id,
  height,
  labels = 'auto',          // 'syllables' | 'words' | 'none' | 'auto'
  beads = true,
  wave = true,
  pitch = true,
  airVoice = false,
  vowelBar = false,
  puff = false,
  pauses = true,
  tonic = true,
  pps: ppsIn,
  lead = 0.12,
  alignAt,                  // seconds in this clip that should line up with `alignX`
  alignX,
  span,                     // seconds of content width (to share a scale between tapes)
  fit = 'auto',
  overlay,                  // [{t, st}] e.g. the student's own pitch, drawn in blue
  overlayLabel,
  playable = true,
  ariaLabel,
  onPlay,
  className = '',
  minPps = 150,
  maxPps = 620,
  forcePlayed = false,
}) {
  const c = getClip(id);
  const wrap = useRef(null);
  const W = useWidth(wrap);
  const [played, setPlayed] = useState(forcePlayed);
  const refs = useRef({});
  const ui = uiScale();
  const isSentence = c && c.words.length > 1;
  const mode = labels === 'auto' ? (isSentence ? 'words' : 'syllables') : labels;
  const H = Math.round((height || (isSentence ? 220 : 230)) * ui);

  const L = useMemo(() => {
    if (!c || !W) return null;
    const pad = Math.round(18 * ui);
    const t0 = alignAt != null ? alignAt - (alignX != null ? alignX : 0.3) : Math.max(0, c.on - lead);
    const t1 = span != null ? t0 + span : Math.min(c.dur, c.off + lead);
    const avail = W - pad * 2;
    let pps = ppsIn || avail / (t1 - t0);
    let tape = false;
    if (!ppsIn && fit !== 'sweep' && (pps < (isSentence ? 140 : minPps) * ui || fit === 'tape')) { pps = Math.round(210 * ui); tape = true; }
    pps = Math.min(pps, maxPps * ui);
    const total = (t1 - t0) * pps;
    if (total > avail + 1) tape = true;
    const offset = tape ? pad : pad + Math.max(0, (avail - total) / 2);
    const cx = t => (t - t0) * pps;
    // vertical bands
    const top = Math.round(12 * ui);
    const pitchH = pitch ? Math.round(H * (isSentence ? 0.44 : 0.4)) : 0;
    const labelY = top + pitchH + Math.round((isSentence ? 30 : 36) * ui);
    const beadY = labelY + Math.round((isSentence ? 20 : 26) * ui);
    const waveY = H - Math.round((airVoice ? 44 : 22) * ui);
    const waveH = Math.round((isSentence ? 18 : 22) * ui);
    const avY = H - Math.round(14 * ui);
    const y = st => top + pitchH * (1 - (Math.max(ST_LO, Math.min(ST_HI, st)) - ST_LO) / (ST_HI - ST_LO));
    return { pad, offset, t0, t1, pps, tape, total, cx, y, top, pitchH, labelY, beadY, waveY, waveH, avY };
  }, [c, W, H, ppsIn, alignAt, alignX, span, fit, lead, pitch, airVoice, ui, isSentence, minPps, maxPps]);

  function fsz(lv) {
    const k = Math.min(1, H / (230 * ui));
    return [Math.round(24 * ui * Math.max(.75, k)), Math.round(32 * ui * Math.max(.7, k)), Math.round(56 * ui * Math.max(.55, k))][lv];
  }

  // ---- static geometry ----
  const geo = useMemo(() => {
    if (!L) return null;
    const { cx, y } = L;
    const pitchPaths = (c.pitch || []).map(([t0, ys]) => {
      let d = '';
      ys.forEach((v, i) => { const x = cx(t0 + i * 0.01), yy = y(v); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1); });
      return d;
    });
    let bars = '';
    if (wave) {
      c.env.forEach((e, i) => {
        const t = i * 0.02 + 0.01;
        if (t < L.t0 || t > L.t1 || e < 0.07) return;
        const h = Math.max(1, e * L.waveH);
        const x = cx(t).toFixed(1);
        bars += `M${x} ${(L.waveY - h).toFixed(1)}L${x} ${(L.waveY + h * 0.55).toFixed(1)}`;
      });
    }
    const syl = [];
    c.words.forEach((w, wi) => w.syl.forEach((s, si) => syl.push({ ...s, wi, si, word: w })));
    // label layout: keep each label near its sound, but never on top of its neighbour
    const items = [];
    if (mode === 'words') {
      c.words.forEach((w, wi) => {
        const isT = tonic && w.tonic;
        const f = Math.round((isT ? 25 : (w.syl.every(q => q.lv === 0) ? 15 : 19)) * ui);
        items.push({ key: 'w' + wi, x: cx((w.s + w.e) / 2), w: f * 0.5 * w.w.length + 6 * ui, f });
      });
    } else if (mode === 'syllables') {
      syl.forEach((q, i) => {
        const f = fsz(q.lv);
        items.push({ key: 's' + i, x: cx((q.s + q.e) / 2), w: f * 0.52 * q.t.length + 4 * ui, f });
      });
    }
    const gap = 3 * ui;
    for (let i = 1; i < items.length; i++) {
      const a = items[i - 1], b = items[i];
      const min = a.x + a.w / 2 + gap + b.w / 2;
      if (b.x < min) b.x = min;
    }
    const right = L.total;
    for (let i = items.length - 1; i >= 0; i--) {
      const b = items[i];
      const lim = i === items.length - 1 ? right - b.w / 2 : items[i + 1].x - items[i + 1].w / 2 - gap - b.w / 2;
      if (b.x > lim) b.x = lim;
    }
    const lx = {};
    items.forEach(it => { lx[it.key] = it; });
    return { pitchPaths, bars, syl, lx };
  }, [L, c, wave, mode, tonic, ui, H]);

  // pitch value at time t (for the pen)
  const stAt = (t) => {
    for (const [t0, ys] of c.pitch || []) {
      const i = Math.round((t - t0) / 0.01);
      if (i >= 0 && i < ys.length) return ys[i];
    }
    return null;
  };

  // ---- live playback: drive the DOM directly, not React, at 60fps ----
  useEffect(() => {
    if (!L || !geo) return;
    let lastHit = -1;
    const r = refs.current;
    const apply = (t, active) => {
      const cxp = L.cx(t);
      let tx = L.offset;
      if (L.tape) {
        const ph = W * 0.4;
        tx = Math.max(W - L.pad - L.total, Math.min(L.pad, ph - cxp));
      }
      if (r.content) r.content.setAttribute('transform', `translate(${tx.toFixed(1)},0)`);
      if (r.clip) r.clip.setAttribute('width', Math.max(0, active ? cxp : (played ? L.total + 40 : 0)).toFixed(1));
      if (r.head) {
        r.head.style.opacity = active ? 1 : 0;
        r.head.setAttribute('transform', `translate(${(tx + cxp).toFixed(1)},0)`);
      }
      if (r.pen) {
        const st = active ? stAt(t) : null;
        if (st == null) r.pen.style.opacity = 0;
        else { r.pen.style.opacity = 1; r.pen.setAttribute('cx', cxp.toFixed(1)); r.pen.setAttribute('cy', L.y(st).toFixed(1)); }
      }
      if (active && r.syl) {
        let hit = -1;
        geo.syl.forEach((s, i) => { if (t >= s.v - 0.02) hit = i; });
        if (hit !== lastHit) {
          if (hit > lastHit) {
            for (let i = lastHit + 1; i <= hit; i++) {
              const g = r.syl[i];
              if (!g) continue;
              g.classList.add('hit');
              const b = g.querySelector('.bead');
              const txt = g.querySelector('.syl-t');
              if (b) {
                gsap.fromTo(b, { scale: geo.syl[i].lv === 2 ? 1.9 : 1.5, transformOrigin: 'center' }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
                if (geo.syl[i].lv > 0 && r.ripples) {
                  const NS = 'http://www.w3.org/2000/svg';
                  const c0 = document.createElementNS(NS, 'circle');
                  const big = geo.syl[i].lv === 2;
                  c0.setAttribute('cx', b.getAttribute('cx')); c0.setAttribute('cy', b.getAttribute('cy'));
                  c0.setAttribute('r', b.getAttribute('r'));
                  c0.setAttribute('class', big ? 'ripple big' : 'ripple');
                  r.ripples.appendChild(c0);
                  const r0 = parseFloat(b.getAttribute('r'));
                  gsap.to(c0, { attr: { r: r0 * (big ? 4.2 : 2.4) }, opacity: 0, duration: big ? 0.9 : 0.6, ease: 'power2.out', onComplete: () => c0.remove() });
                }
              }
              if (txt && geo.syl[i].lv === 2) gsap.fromTo(txt, { y: -8 * ui, scale: 1.18, transformOrigin: '50% 100%' }, { y: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' });
            }
          }
          lastHit = hit;
        }
      }
    };
    // resting state
    apply(L.t0, false);
    if (played && r.syl) r.syl.forEach(g => g && g.classList.add('hit'));
    const off = engine.subscribe(s => {
      if (s.id !== id) return;
      if (s.playing) {
        if (lastHit === -1 && r.syl) r.syl.forEach(g => g && g.classList.remove('hit'));
        apply(s.t, true);
      } else {
        lastHit = -1;
        if (s.ended) { setPlayed(true); if (r.syl) r.syl.forEach(g => g && g.classList.add('hit')); }
        apply(L.t1, false);
      }
    });
    return off;
  }, [L, geo, played, id, W]);

  useEffect(() => { if (forcePlayed) setPlayed(true); }, [forcePlayed]);

  if (!c) return <div className="tape tape-missing">missing clip {id}</div>;

  const play = () => {
    if (!playable) return;
    if (engine.playingId() === id) { engine.stop(); return; }
    onPlay && onPlay(id);
    engine.play(id);
  };

  const words = c.words;

  return (
    <div
      ref={wrap}
      className={`tape ${L && L.tape ? 'is-tape' : 'is-sweep'} ${played ? 'is-played' : ''} ${playable ? 'is-playable' : ''} ${className}`}
      style={{ height: H }}
      role={playable ? 'button' : undefined}
      tabIndex={playable ? 0 : undefined}
      aria-label={ariaLabel || (playable ? `Play “${words.map(w => w.w).join(' ')}”` : undefined)}
      onClick={play}
      onKeyDown={e => { if (playable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); play(); } }}
    >
      {L && geo && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <clipPath id={`clip-${id}-${W}`}>
              <rect ref={el => (refs.current.clip = el)} x={-40} y={0} width={0} height={H} />
            </clipPath>
          </defs>
          <g ref={el => (refs.current.content = el)}>
            {/* vowel length bars */}
            {vowelBar && c.vowel && (
              <g className="vbar">
                <rect x={L.cx(c.vowel[0])} y={L.beadY - 10 * ui} width={L.cx(c.vowel[1]) - L.cx(c.vowel[0])} height={20 * ui} rx={10 * ui} />
              </g>
            )}
            {/* pitch */}
            {pitch && (
              <g className="pitch">
                {geo.pitchPaths.map((d, i) => <path key={'b' + i} d={d} className="pitch-base" strokeWidth={6 * ui} />)}
                <g clipPath={`url(#clip-${id}-${W})`}>
                  {geo.pitchPaths.map((d, i) => <path key={'g' + i} d={d} className="pitch-glow" strokeWidth={16 * ui} />)}
                  {geo.pitchPaths.map((d, i) => <path key={'p' + i} d={d} className="pitch-line" strokeWidth={6.5 * ui} />)}
                </g>
                {overlay && overlay.length > 1 && (
                  <path className="pitch-you" strokeWidth={4 * ui}
                    d={overlay.map((p, i) => (i && p.st != null && overlay[i - 1].st != null ? 'L' : 'M') + L.cx(p.t).toFixed(1) + ' ' + L.y(p.st == null ? 0 : p.st).toFixed(1)).join('')} />
                )}
                <circle ref={el => (refs.current.pen = el)} r={7 * ui} className="pen" style={{ opacity: 0 }} />
              </g>
            )}
            {/* pauses between thought groups */}
            {pauses && words.map((w, i) => (w.gap && words[i + 1]) ? (
              <text key={'p' + i} className="pause-mark" x={L.cx((w.e + words[i + 1].s) / 2)} y={L.beadY + 9 * ui} fontSize={24 * ui} textAnchor="middle">//</text>
            ) : null)}
            {/* syllables / words */}
            {mode !== 'none' && (
              <g className="syls">
                {(() => {
                  refs.current.syl = [];
                  let idx = -1;
                  return words.map((w, wi) => {
                    const isT = tonic && w.tonic;
                    const wordFs = Math.round((isT ? 25 : (w.syl.every(s => s.lv === 0) ? 15 : 19)) * ui);
                    return (
                      <g key={wi} className={`word ${isT ? 'tonic' : ''}`}>
                        {mode === 'words' && (
                          <text className="word-t" x={geo.lx['w' + wi] ? geo.lx['w' + wi].x : L.cx((w.s + w.e) / 2)} y={L.labelY} fontSize={wordFs} textAnchor="middle">{w.w}</text>
                        )}
                        {w.syl.map((s, si) => {
                          idx++;
                          const k = idx;
                          const r = s.lv === 2 ? (isSentence ? (isT ? 11 : 7) : 17) : s.lv === 1 ? (isSentence ? 4.5 : 8) : (isSentence ? 3 : 5.5);
                          const center = L.cx((s.s + s.e) / 2);
                          return (
                            <g key={si} ref={el => (refs.current.syl[k] = el)} className={`syl lv${s.lv} ${isT && s.lv === 2 ? 'tonic' : ''}`}>
                              {mode === 'syllables' && (
                                <text className="syl-t" x={geo.lx['s' + k] ? geo.lx['s' + k].x : center} y={L.labelY} fontSize={fsz(s.lv)} textAnchor="middle">{s.t}</text>
                              )}
                              {beads && <circle className="bead" cx={L.cx(s.v)} cy={L.beadY} r={r * ui} />}
                            </g>
                          );
                        })}
                      </g>
                    );
                  });
                })()}
              </g>
            )}
            <g ref={el => (refs.current.ripples = el)} className="ripples" />
            {/* waveform */}
            {wave && (
              <g className="wave">
                <path d={geo.bars} className="wave-base" strokeWidth={Math.max(1.5, 2.2 * ui)} />
                <path d={geo.bars} className="wave-on" strokeWidth={Math.max(1.5, 2.2 * ui)} clipPath={`url(#clip-${id}-${W})`} />
              </g>
            )}
            {/* air (noise) vs voice (buzz) */}
            {airVoice && (
              <g className="av">
                {c.air.map(([a, b], i) => <AirStrip key={'a' + i} x0={L.cx(a)} x1={L.cx(b)} y={L.avY} ui={ui} />)}
                {c.voice.map(([a, b], i) => <BuzzStrip key={'v' + i} x0={L.cx(a)} x1={L.cx(b)} y={L.avY} ui={ui} />)}
              </g>
            )}
            {puff && c.asp && (
              <g className="puff-mark">
                <rect x={L.cx(c.asp[0])} y={L.top} width={Math.max(2, L.cx(c.asp[1]) - L.cx(c.asp[0]))} height={L.waveY - L.top} rx={3} />
              </g>
            )}
          </g>
          <g ref={el => (refs.current.head = el)} className="playhead" style={{ opacity: 0 }}>
            <line x1={0} x2={0} y1={2} y2={H - 2} strokeWidth={2} />
          </g>
        </svg>
      )}
      {overlayLabel && <span className="tape-legend-you">{overlayLabel}</span>}
    </div>
  );
}

function AirStrip({ x0, x1, y, ui }) {
  const dots = [];
  const n = Math.max(2, Math.floor((x1 - x0) / (6 * ui)));
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + 0.5) * (x1 - x0) / n;
    const dy = ((i * 37) % 7 - 3) * 1.6 * ui;
    dots.push(<circle key={i} cx={x} cy={y + dy} r={1.6 * ui} />);
  }
  return <g className="air">{dots}</g>;
}

function BuzzStrip({ x0, x1, y, ui }) {
  let d = '';
  const amp = 5 * ui, wl = 7 * ui;
  for (let x = x0; x <= x1; x += 1.5) {
    const yy = y + Math.sin(((x - x0) / wl) * Math.PI * 2) * amp;
    d += (x === x0 ? 'M' : 'L') + x.toFixed(1) + ' ' + yy.toFixed(1);
  }
  return <path className="buzz" d={d} strokeWidth={2 * ui} />;
}
