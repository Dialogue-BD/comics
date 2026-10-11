/* Small compositions reused across voices. */

/* A round "badge" holding an icon — used for fields, roles and tasks. */
export function badge(S, parent, x, y, draw, { r = 70, ring = S.C.gold, fill = S.C.cream } = {}) {
  const { K } = S;
  const b = K.wrap(parent, x, y);
  b.glow = K.halo(b, r * 1.9, 'gold'); b.glow.setAttribute('opacity', 0);
  K.el('circle', { r: r + 6, fill: S.C.shadow, opacity: .25, cy: 8 }, b);
  K.el('circle', { r, fill }, b);
  b.ring = K.el('circle', { r, fill: 'none', stroke: ring, 'stroke-width': 6 }, b);
  const icon = K.g(b);
  draw(icon);
  b.icon = icon;
  return b;
}

/* A person wrapped so it can be placed, then animated freely. */
export function who(S, parent, x, y, opts = {}, s = 1) {
  const holder = S.K.wrap(parent, x, y, s);
  const p = S.K.person(holder, opts);
  holder.p = p;
  return holder;
}

/* Idle life: a soft breathing bob so nobody stands frozen. */
export function breathe(S, node, t0, t1, amp = 4, period = 2.4) {
  S.loop(node, t0, t1, { y: -amp }, period);
}

/* The gold question orb that marks "this is a question / I wonder". */
export function ask(S, parent, x, y, t, t1, { r = 44 } = {}) {
  const q = S.K.wrap(parent, x, y);
  S.K.question(q, { r });
  S.pop(q, t, { origin: '50% 50%', from: .2, ease: 'back.out(2.4)' });
  S.loop(q, t + .6, t1, { y: -10, rotation: 6 }, 1.6);
  return q;
}

/* A node that tweens in stage coordinates (x/y are absolute pixels) while its
   drawing stays scaled. Use it for anything that travels across the picture. */
export function free(S, parent, s = 1) {
  const mover = S.K.g(parent);
  const content = S.K.g(mover, { transform: `scale(${s})` });
  mover.content = content;
  return mover;
}
export function whoFree(S, parent, opts = {}, s = 1) {
  const m = free(S, parent, s);
  m.p = S.K.person(m.content, opts);
  return m;
}
