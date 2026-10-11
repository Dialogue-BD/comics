/* Helpers shared by the scene-style beat scripts. */
import { figure, setPose, blinks } from '../cast.js';

export function helpers(S) {
  const { K, tl } = S;
  const gsap = window.gsap;
  /* An actor: placed at (x,y), animatable in stage units, drawn at scale s. */
  const actor = (parent, x, y, s, spec, p = 'idle') => {
    const outer = K.g(parent); outer.setAttribute('transform', `translate(${x} ${y})`);
    const mover = K.g(outer); const content = K.g(mover); content.setAttribute('transform', `scale(${s})`);
    const f = figure(content, spec); setPose(gsap, f, p);
    mover.f = f; mover.content = content; return mover;
  };
  /* Blinks and breathing so nobody stands frozen. */
  const life = (a, t0, t1, seed = 1) => {
    blinks(tl, a.f, t0, t1, seed);
    tl.to(a.f.parts.upper, { y: -3, duration: 1.6, repeat: Math.max(1, Math.floor((t1 - t0) / 1.6)), yoyo: true, ease: 'sine.inOut' }, t0);
  };
  const put = (parent, x, y, s = 1) => { const o = K.g(parent); o.setAttribute('transform', `translate(${x} ${y}) scale(${s})`); return K.g(o); };
  /* Walk: a bob and a slide from dx to 0. */
  const walkIn = (a, t, dx, d = 1) => {
    tl.fromTo(a, { x: dx, autoAlpha: 1 }, { x: 0, duration: d, ease: 'power2.out', immediateRender: true }, t);
    tl.to(a.f.parts.body, { y: -10, duration: d / 6, repeat: 5, yoyo: true, ease: 'sine.inOut' }, t);
  };
  const walkTo = (a, t, x, d = 1, y = 0) => {
    tl.to(a, { x, y, duration: d, ease: 'power1.inOut' }, t);
    tl.to(a.f.parts.body, { y: -10, duration: d / 6, repeat: 5, yoyo: true, ease: 'sine.inOut' }, t);
  };
  /* Wash a scene grey (loss) or bring it back. */
  const drainTo = (rect, t, on = true, d = .6) => tl.to(rect, { attr: { opacity: on ? +rect.getAttribute('data-o') : 0 }, duration: d, ease: 'power2.inOut' }, t);
  const blink = (nodes, t0, t1, period = .5) => nodes.forEach((n, i) => tl.to(n, { autoAlpha: .2, duration: period / 2, repeat: Math.max(1, Math.floor((t1 - t0) / period) * 2 - 1), yoyo: true, ease: 'steps(1)' }, t0 + (i % 5) * .07));
  return { actor, life, put, walkIn, walkTo, drainTo, blink };
}
