/* The motion stage.
   One paused GSAP timeline per voice, built from that voice's beat script.
   The audio element is the clock: the activity calls stage.seek(audio.currentTime)
   every frame, so pausing, replaying a phrase, dragging the seek bar or tapping
   a word all keep the pictures exactly in step with the speaker.

   Pictures are SVG (sharp on a projector, light on a phone). The backdrop is
   the Aurora shader. Key words land as BlurText-style callouts — the same
   word the learner hears, at the moment they hear it. */

import * as K from './kit.js';
import { createAurora } from './aurora.js';

const gsap = window.gsap;
if (window.DrawSVGPlugin) gsap.registerPlugin(window.DrawSVGPlugin);
if (window.MotionPathPlugin) gsap.registerPlugin(window.MotionPathPlugin);

const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '').replace(/'/g, '');

export function createStage(host, { label = true } = {}) {
  host.classList.add('hq-stage');
  host.innerHTML = '';
  const canvas = document.createElement('canvas'); canvas.className = 'hq-aurora'; canvas.setAttribute('aria-hidden', 'true');
  const svg = K.el('svg', { class: 'hq-world', viewBox: '0 0 1600 900', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });
  const callouts = document.createElement('div'); callouts.className = 'hq-callouts'; callouts.setAttribute('aria-hidden', 'true');
  const hud = document.createElement('div'); hud.className = 'hq-hud';
  const grain = document.createElement('div'); grain.className = 'hq-grain';
  const vignette = document.createElement('div'); vignette.className = 'hq-vignette';
  host.append(canvas, svg, vignette, grain, callouts, hud);
  K.defs(svg);
  // A soft studio floor that every beat stands on.
  const floor = K.g(svg, { class: 'floor' });
  K.el('ellipse', { cx: 800, cy: 742, rx: 760, ry: 92, fill: 'url(#halo-paper)', opacity: .35 }, floor);
  K.el('ellipse', { cx: 800, cy: 736, rx: 560, ry: 40, fill: K.C.shadow, opacity: .22 }, floor);
  const world = K.g(svg, { class: 'world' });

  const aurora = createAurora(canvas);
  const nameTag = document.createElement('span'); nameTag.className = 'hq-name';
  const progress = document.createElement('div'); progress.className = 'hq-progress'; progress.innerHTML = '<i></i>';
  hud.append(nameTag, progress);
  if (!label) nameTag.hidden = true;

  let tl = null, duration = 1, keys = [0], reduced = false, built = null, loadToken = 0, lastMood = null, moods = [];

  function context(transcript) {
    const words = transcript.words.map(w => ({ ...w, n: norm(w.w) }));
    const find = (phrase, nth = 1) => {
      const parts = phrase.split(/\s+/).map(norm);
      let seen = 0;
      for (let i = 0; i <= words.length - parts.length; i++) {
        if (parts.every((p, k) => words[i + k].n === p || (k === parts.length - 1 && words[i + k].n.startsWith(p)))) { if (++seen === nth) return i; }
      }
      throw Error(`Beat anchor not found: “${phrase}” #${nth} in ${transcript.name}`);
    };
    const at = (phrase, nth = 1) => words[find(phrase, nth)].s;
    const end = (phrase, nth = 1) => { const i = find(phrase, nth), n = phrase.split(/\s+/).length; return words[i + n - 1].e; };
    const key = t => { keys.push(t); return t; };

    const beat = (t0, t1, { mood, drift = 1, lead = .2, spot = [800, 470, 340] } = {}) => {
      const holder = K.g(world, { class: 'beat' });
      if (spot) {
        // A soft focal disc and a slow dashed ring give every picture a stage.
        const [sx, sy, sr] = spot;
        const back = K.g(holder);
        K.el('circle', { cx: sx, cy: sy, r: sr, fill: 'url(#halo-paper)', opacity: .5 }, back);
        const ring = K.el('circle', { cx: sx, cy: sy, r: sr * .92, fill: 'none', stroke: '#fffdf7', 'stroke-width': 2, opacity: .12, 'stroke-dasharray': '3 14', 'stroke-linecap': 'round' }, back);
        tl.fromTo(back, { scale: .8 }, { scale: 1, duration: 1.1, ease: 'expo.out', svgOrigin: `${sx} ${sy}`, immediateRender: true }, Math.max(0, t0 - lead));
        tl.to(ring, { rotation: 40, svgOrigin: `${sx} ${sy}`, duration: Math.max(.5, t1 - t0 + .4), ease: 'none' }, Math.max(0, t0 - lead));
      }
      const b = K.g(holder);
      const start = Math.max(0, t0 - lead), last = t1 >= duration - .05;
      key(t0);
      tl.fromTo(holder, { autoAlpha: 0 }, { autoAlpha: 1, duration: .45, ease: 'power2.out', immediateRender: true }, start);
      if (!last) tl.to(holder, { autoAlpha: 0, duration: .4, ease: 'power2.in' }, t1 - .22);
      // Gentle camera push across the beat (Ken Burns), alternating drift.
      if (drift) tl.fromTo(b, { scale: 1, x: 0 }, { scale: 1.045, x: (moods.length % 2 ? -14 : 14) * drift, duration: Math.max(.5, t1 - start + .3), ease: 'none', svgOrigin: '800 520', immediateRender: true }, start);
      if (mood) moods.push([t0 - .1, mood]);
      return b;
    };

    const pop = (node, t, { d = .65, from = .35, ease = 'back.out(1.7)', y = 0, rot = 0, origin = '50% 100%' } = {}) => {
      key(t);
      tl.fromTo(node, { autoAlpha: 0, scale: from, y, rotation: rot }, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: d, ease, transformOrigin: origin, immediateRender: true }, t);
      return node;
    };
    const rise = (node, t, { d = .8, y = 60, ease = 'expo.out' } = {}) => { key(t); tl.fromTo(node, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: d, ease, immediateRender: true }, t); return node; };
    const fade = (node, t, { d = .5, to = 1 } = {}) => { key(t); tl.fromTo(node, { autoAlpha: 0 }, { autoAlpha: to, duration: d, ease: 'power1.out', immediateRender: true }, t); return node; };
    const hide = (node, t, { d = .4, scale: s = .85 } = {}) => { tl.to(node, { autoAlpha: 0, scale: s, duration: d, ease: 'power2.in', transformOrigin: '50% 50%' }, t); return node; };
    const move = (node, t, vars, d = .8, ease = 'power3.inOut') => { tl.to(node, { ...vars, duration: d, ease }, t); return node; };
    const draw = (node, t, d = .8, ease = 'power2.inOut') => { key(t); tl.fromTo(node, { drawSVG: '0%', autoAlpha: 1 }, { drawSVG: '100%', duration: d, ease, immediateRender: true }, t); return node; };
    const loop = (node, t0, t1, vars, period = 1.2, ease = 'sine.inOut') => {
      const reps = Math.max(0, Math.floor((t1 - t0) / period) - 1);
      tl.to(node, { ...vars, duration: period / 2, ease, repeat: reps * 2 + 1, yoyo: true }, t0);
      return node;
    };
    const spin = (node, t0, t1, turns = 1, origin = '50% 50%') => { tl.to(node, { rotation: `+=${360 * turns}`, duration: Math.max(.1, t1 - t0), ease: 'none', transformOrigin: origin }, t0); return node; };
    const count = (textNode, t, from, to, d = .8, fmt = v => String(Math.round(v))) => {
      key(t);
      const o = { v: from };
      textNode.textContent = fmt(from);
      tl.fromTo(o, { v: from }, { v: to, duration: d, ease: 'power1.inOut', onUpdate: () => { textNode.textContent = fmt(o.v); }, immediateRender: true }, t);
      return textNode;
    };
    const wave = (p, t, times = 2) => {
      const a = p.parts.armR;
      tl.fromTo(a, { rotation: 0 }, { rotation: -150, duration: .35, ease: 'power2.out', svgOrigin: K.armOrigin(a) }, t);
      tl.to(a, { rotation: -120, duration: .22, repeat: times * 2 - 1, yoyo: true, ease: 'sine.inOut', svgOrigin: K.armOrigin(a) }, t + .35);
      tl.to(a, { rotation: 0, duration: .4, ease: 'power2.inOut', svgOrigin: K.armOrigin(a) }, t + .35 + times * .44);
    };
    const reach = (p, side, t, angle = -70, d = .5) => { const a = side === 'l' ? p.parts.armL : p.parts.armR; tl.to(a, { rotation: angle, duration: d, ease: 'power2.out', svgOrigin: K.armOrigin(a) }, t); };
    const face = (p, t, mood) => {
      const hx = p.parts.head.querySelector('circle').getAttribute('cx') * 1, hy = -264;
      const d = { smile: `M${hx - 11} ${hy + 14} q11 10 22 0`, sad: `M${hx - 10} ${hy + 20} q10 -8 20 0`, flat: `M${hx - 9} ${hy + 16} q9 0 18 0`, worried: `M${hx - 10} ${hy + 19} q5 -5 10 0`, grin: `M${hx - 13} ${hy + 12} q13 16 26 0` }[mood];
      if (d && p.parts.mouth.getAttribute('fill') === 'none') tl.to(p.parts.mouth, { attr: { d }, duration: .3 }, t);
    };
    const callout = (word, t, { hold = 1.9, tone = 'gold', small = false } = {}) => {
      key(t);
      const box = document.createElement('div'); box.className = `hq-callout ${tone}${small ? ' small' : ''}`;
      const inner = document.createElement('span'); inner.className = 'hq-callout-word';
      [...word].forEach(ch => { const s = document.createElement('span'); s.textContent = ch === ' ' ? ' ' : ch; inner.append(s); });
      const rule = document.createElement('i');
      box.append(inner, rule); callouts.append(box);
      const letters = inner.children;
      tl.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, immediateRender: true }, t - .05);
      tl.fromTo(letters, { autoAlpha: 0, filter: 'blur(12px)', yPercent: -45 }, { autoAlpha: 1, filter: 'blur(0px)', yPercent: 0, duration: .55, stagger: .035, ease: 'power3.out', immediateRender: true }, t - .05);
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'expo.out', transformOrigin: '0% 50%', immediateRender: true }, t + .15);
      tl.to(box, { autoAlpha: 0, y: 10, filter: 'blur(6px)', duration: .45, ease: 'power2.in' }, t + hold);
      return box;
    };
    const burst = (parent, x, y, t, { n = 10, color = K.C.gold, r0 = 30, r1 = 140, size = 9 } = {}) => {
      const grp = K.g(parent); K.place(grp, x, y);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + .3;
        const dot = i % 3 ? K.el('circle', { r: size * (i % 2 ? .7 : 1), fill: color }, grp) : K.sparkle(grp, color, size * 1.8);
        tl.fromTo(dot, { x: Math.cos(a) * r0, y: Math.sin(a) * r0, autoAlpha: 0, scale: .3 }, { keyframes: [{ autoAlpha: 1, scale: 1, duration: .12 }, { x: Math.cos(a) * r1, y: Math.sin(a) * r1, autoAlpha: 0, scale: .4, duration: .75, ease: 'power3.out' }], immediateRender: true }, t);
      }
      return grp;
    };
    const flow = (parent, d, t0, t1, { color = K.C.mint, n = 4, size = 7, speed = 1.4 } = {}) => {
      const grp = K.g(parent);
      const track = K.el('path', { d, fill: 'none', stroke: color, 'stroke-width': 3, opacity: .28, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }, grp);
      draw(track, t0, .6);
      for (let i = 0; i < n; i++) {
        const dot = K.el('circle', { r: size, fill: color }, grp);
        const t = t0 + .3 + i * speed / n, reps = Math.max(0, Math.floor((t1 - t) / speed) - 1);
        tl.fromTo(dot, { autoAlpha: 0 }, { autoAlpha: 1, duration: .15, immediateRender: true }, t);
        tl.to(dot, { motionPath: { path: track, align: track, alignOrigin: [.5, .5] }, duration: speed, ease: 'none', repeat: reps }, t);
        tl.to(dot, { autoAlpha: 0, duration: .2 }, t + (reps + 1) * speed - .2);
      }
      return grp;
    };
    return { tl, svg, world, K, C: K.C, at, end, beat, pop, rise, fade, hide, move, draw, loop, spin, count, wave, reach, face, callout, burst, flow, key, get duration() { return duration; } };
  }

  async function load(voice, transcript) {
    const token = ++loadToken;
    const mod = await import(`./beats/${voice.id}.js?v=1`);
    if (token !== loadToken) return;
    if (tl) tl.kill();
    world.replaceChildren(); callouts.replaceChildren(); keys = [0]; moods = []; lastMood = null;
    duration = transcript.duration;
    tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });
    // Each tween names its own pivot; never let GSAP "smooth" between pivots,
    // or seeking backwards leaves pictures shifted from where they belong.
    const fix = v => (v && (v.transformOrigin || v.svgOrigin)) ? { ...v, smoothOrigin: false } : v;
    const _to = tl.to.bind(tl), _ft = tl.fromTo.bind(tl);
    tl.to = (n, v, p) => _to(n, fix(v), p);
    tl.fromTo = (n, a, b, p) => {
      if (b.transformOrigin && !a.transformOrigin) a = { ...a, transformOrigin: b.transformOrigin };
      if (b.svgOrigin && !a.svgOrigin) a = { ...a, svgOrigin: b.svgOrigin };
      return _ft(n, fix(a), fix(b), p);
    };
    const S = context(transcript);
    mod.default(S);
    tl.set({}, {}, duration);
    keys = [...new Set(keys.map(k => +k.toFixed(3)))].sort((a, b) => a - b);
    moods.sort((a, b) => a[0] - b[0]);
    // Record every tween's start values in time order, then rewind.
    tl.progress(1, true).progress(0, true);
    nameTag.textContent = `${voice.name} · ${voice.topic}`;
    built = voice.id;
    seek(0);
    if (moods[0]) aurora.setMood(moods[0][1], true);
  }

  function settle(t) {
    let i = 0; while (i + 1 < keys.length && keys[i + 1] <= t + 1e-3) i++;
    const next = keys[i + 1] ?? duration;
    return Math.min(keys[i] + 1.1, next - .06, duration);
  }

  function seek(t) {
    if (!tl) return;
    const tt = reduced ? settle(t) : t;
    tl.time(Math.max(0, Math.min(duration, tt)));
    let m = null; for (const [mt, name] of moods) if (mt <= t) m = name;
    if (m && m !== lastMood) { lastMood = m; aurora.setMood(m); }
    progress.firstChild.style.transform = `scaleX(${Math.max(0, Math.min(1, t / duration))})`;
  }

  return {
    load, seek,
    get built() { return built; },
    get duration() { return duration; },
    setReduced(v) { reduced = !!v; host.classList.toggle('reduced', reduced); if (reduced) aurora.stop(); },
    setPlaying(v) { if (v && !reduced) aurora.start(); else aurora.stop(); },
    host
  };
}
