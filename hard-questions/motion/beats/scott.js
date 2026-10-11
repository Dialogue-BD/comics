import { badge, who, breathe, ask, free, whoFree } from './_shared.js';

/* Scott — Family.
   "How will AI affect how my children grow up? Right now, there's a
    generation of children being born that will not know a world without AI.
    Think of my kids. How is AI going to affect their creativity? How they
    interpret the world? How they consume information? Could AI make my
    children more creative? Will AI give me more time to spend with my girls." */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const SCOTT = { tone: K.SKIN[0], hair: 'short', hairColor: K.HAIR.blond, beard: true, top: C.moss, bottom: '#34404a' };
  const GIRL1 = { tone: K.SKIN[0], hair: 'ponytail', hairColor: K.HAIR.blond, top: C.clay, bottom: '#3b3a4a', age: 'child', mood: 'grin' };
  const GIRL2 = { tone: K.SKIN[0], hair: 'long', hairColor: K.HAIR.blond, top: C.gold, bottom: '#2f3e4a', age: 'toddler', mood: 'grin' };

  /* 1 · How will AI affect how my children grow up? */
  {
    const t0 = 0, t1 = at('right');
    const b = beat(t0, t1, { mood: 'wonder' });
    // A growth chart on the wall.
    const chart = K.g(b);
    K.el('rect', { x: 1010, y: 200, width: 70, height: 520, rx: 10, fill: C.cream, opacity: .92 }, chart);
    for (let i = 0; i < 10; i++) K.el('path', { d: `M1010 ${700 - i * 50} h${i % 2 ? 22 : 38}`, stroke: C.mossDeep, 'stroke-width': 4 }, chart);
    rise(chart, 0, { y: 30 });
    const g1 = who(S, b, 640, 720, GIRL1, .8), g2 = who(S, b, 860, 720, GIRL2, .8);
    pop(g1, at('children') - .2, { y: 20 }); pop(g2, at('children'), { y: 20 });
    tl.to(g1, { scale: 1.35, duration: .9, ease: 'back.out(1.4)', transformOrigin: '50% 100%' }, at('grow') - .1);
    tl.to(g2, { scale: 1.45, duration: .9, ease: 'back.out(1.4)', transformOrigin: '50% 100%' }, at('grow'));
    const ai = K.wrap(b, 750, 220, .55); K.chip(ai);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    const arrow = K.el('path', { d: 'M1140 640 V300 l-22 30 M1140 300 l22 30', stroke: C.gold, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    draw(arrow, at('grow'), .8, 'expo.out');
    callout('children', at('children'), { hold: 1.0 });
  }

  /* 2 · …a generation of children being born that will not know a world without AI. */
  {
    const t0 = at('right'), t1 = at('think');
    const b = beat(t0, t1, { mood: 'wonder' });
    const babies = [];
    for (let i = 0; i < 7; i++) { const c = K.wrap(b, 330 + i * 157, 660 - Math.sin(i / 6 * Math.PI) * 60, .95); K.cradle(c); babies.push(c); }
    babies.forEach((c, i) => pop(c, at('generation') - .1 + i * .13, { origin: '50% 100%', y: 20 }));
    const w0 = at('world');
    babies.forEach((c, i) => tl.to(c, { y: 120, autoAlpha: 0, duration: .5, ease: 'power2.in' }, w0 - .5 + i * .03));
    const gw = K.wrap(b, 800, 470, 1.25); const gl = K.globe(gw);
    tl.fromTo(gw, { y: 300, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', immediateRender: true }, w0 - .3);
    tl.to(gl.land, { x: 60, duration: 2, ease: 'none' }, w0);
    // Chips everywhere around the world.
    const orbit = K.wrap(b, 800, 470);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const c = K.wrap(orbit, Math.cos(a) * 250, Math.sin(a) * 200, .3); K.chip(c, { glow: false }); pop(c, at('without') + i * .06, { origin: '50% 50%', from: .1 }); }
    tl.to(orbit, { rotation: 50, duration: t1 - at('without') + .4, ease: 'none', svgOrigin: '0 0' }, at('without'));
    callout('generation', at('generation'), { hold: 1.4 });
    callout('world', w0, { hold: 1.1, tone: 'mint' });
  }

  /* 3 · Think of my kids. How is AI going to affect their creativity? */
  {
    const t0 = at('think'), t1 = at('how', 4);
    const b = beat(t0, t1, { mood: 'hope' });
    const sc = who(S, b, 420, 720, { ...SCOTT, mood: 'smile' }, 1.1);
    const g1 = who(S, b, 590, 720, GIRL1, 1.05), g2 = who(S, b, 700, 720, GIRL2, 1.1);
    rise(sc, t0, { y: 30 }); rise(g1, t0 + .1, { y: 30 }); rise(g2, t0 + .2, { y: 30 });
    reach(sc.p, 'r', at('kids') - .2, -45);
    breathe(S, sc, t0, t1);
    const easel = K.g(b);
    K.el('path', { d: 'M1000 720 L1060 330 M1300 720 L1240 330 M1150 720 V330', stroke: '#7b5636', 'stroke-width': 12, 'stroke-linecap': 'round' }, easel);
    K.el('rect', { x: 960, y: 250, width: 380, height: 300, rx: 10, fill: C.cream }, easel);
    rise(easel, at('affect', 2) - .4, { y: 40 });
    const strokes = ['M1000 470 C1060 360 1120 520 1180 400 S1280 330 1300 420', 'M1010 320 q60 60 120 0 t120 0', 'M1030 520 l60 -60 l40 40 l60 -80 l60 60', 'M1210 300 a36 36 0 1 0 1 0'];
    const cols = [C.clay, C.sky, C.mossDeep, C.gold];
    strokes.forEach((d, i) => { const p = K.el('path', { d, stroke: cols[i], 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b); draw(p, at('creativity') - .2 + i * .22, .6); });
    [C.clay, C.sky, C.gold].forEach((c, i) => { const cr = K.wrap(b, 880 + i * 40, 650, .7); K.crayon(cr, c); pop(cr, at('creativity') - .3 + i * .1, { rot: -20 + i * 15 }); });
    callout('creativity', at('creativity'), { hold: .9 });
  }

  /* 4 · How they interpret the world? How they consume information? */
  {
    const t0 = at('how', 4), t1 = at('could');
    const b = beat(t0, t1, { mood: 'wonder' });
    const gw = K.wrap(b, 560, 400, .8); K.globe(gw);
    pop(gw, t0 + .1, { origin: '50% 50%', from: .4, ease: 'expo.out' });
    const g1 = who(S, b, 760, 720, GIRL1, 1.2);
    rise(g1, t0, { y: 30 }); breathe(S, g1, t0, t1);
    const mg = K.wrap(b, 640, 380, 1); K.magnifier(mg);
    pop(mg, at('interpret') - .1, { origin: '50% 50%' });
    tl.to(mg, { x: -110, y: -30, duration: .7, ease: 'sine.inOut', repeat: 1, yoyo: true }, at('interpret'));
    tl.to([gw, mg], { autoAlpha: .25, duration: .4 }, at('consume') - .3);
    const ph = K.wrap(b, 1150, 420, 1.4); K.phone(ph);
    pop(ph, at('consume') - .3, { origin: '50% 50%' });
    // Information streams from the phone into her head.
    const cons = at('consume');
    for (let i = 0; i < 7; i++) {
      const card = free(S, b, 1); K.doc(card.content, { lines: 3, accent: [C.clay, C.gold, C.mint][i % 3] });
      tl.fromTo(card, { x: 1150, y: 400, autoAlpha: 0, scale: .2 }, { keyframes: [{ autoAlpha: 1, scale: .3, duration: .12 }, { motionPath: { path: [{ x: 1000, y: 260 }, { x: 790, y: 330 }], curviness: 1 }, scale: .12, duration: .75, ease: 'power1.in' }, { autoAlpha: 0, duration: .1 }], immediateRender: true }, cons + i * .2);
    }
    face(g1.p, cons + .6, 'open');
    callout('interpret', at('interpret'), { hold: .9 });
    callout('information', at('information'), { hold: .9, tone: 'mint' });
  }

  /* 5 · Could AI make my children more creative? */
  {
    const t0 = at('could'), t1 = at('will', 3);
    const b = beat(t0, t1, { mood: 'warm' });
    const g1 = who(S, b, 680, 720, GIRL1, 1.2), g2 = who(S, b, 880, 720, GIRL2, 1.3);
    rise(g1, t0, { y: 30 }); rise(g2, t0 + .1, { y: 30 });
    tl.to([g1, g2], { y: -40, duration: .3, repeat: 3, yoyo: true, ease: 'power1.out' }, at('creative') - .1);
    const arc = K.g(b);
    [C.clay, C.gold, C.moss, C.sky].forEach((c, i) => { const p = K.el('path', { d: `M${420 + i * 26} 620 A${380 - i * 26} ${380 - i * 26} 0 0 1 ${1180 - i * 26} 620`, stroke: c, 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round' }, arc); draw(p, at('make') + i * .1, .9); });
    b.insertBefore(arc, b.firstChild);
    burst(b, 780, 300, at('creative'), { n: 14, r1: 300, color: C.gold, size: 11 });
    for (let i = 0; i < 6; i++) { const s = K.wrap(b, 400 + i * 160, 200 + (i % 2) * 80); K.star(s, [C.gold, C.rose, C.mint][i % 3], 22); pop(s, at('creative') + i * .07, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }); }
    callout('creative', at('creative'), { hold: .7 });
  }

  /* 6 · Will AI give me more time to spend with my girls. */
  {
    const t0 = at('will', 3), t1 = D;
    const b = beat(t0, t1, { mood: 'warm' });
    const ck = K.wrap(b, 1180, 330, .95); const cl = K.clock(ck);
    pop(ck, t0, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    tl.to(cl.minute.parentNode, { rotation: -720, duration: 1.3, ease: 'power2.inOut', svgOrigin: '0 0' }, at('time') - .4);
    tl.to(cl.hour.parentNode, { rotation: -60, duration: 1.3, ease: 'power2.inOut', svgOrigin: '0 0' }, at('time') - .4);
    const sc = who(S, b, 640, 720, { ...SCOTT, mood: 'grin' }, 1.15);
    const g1 = who(S, b, 470, 720, GIRL1, 1.1), g2 = who(S, b, 810, 720, GIRL2, 1.2);
    rise(sc, t0, { y: 30 }); rise(g1, t0 + .1, { y: 30 }); rise(g2, t0 + .15, { y: 30 });
    reach(sc.p, 'l', at('spend') - .3, 40); reach(sc.p, 'r', at('spend') - .3, -40);
    const ht = K.wrap(b, 640, 300, .9); K.heart(ht, C.clay);
    pop(ht, at('girls') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 640, 300, at('girls'), { color: C.rose });
    callout('time', at('time'), { hold: .55 });
    callout('girls', at('girls'), { hold: 1, small: true });
  }
}
