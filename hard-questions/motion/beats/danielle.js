import { badge, who, breathe, ask } from './_shared.js';

/* Danielle — Connection.
   "It's like we don't want humans to lose the beautiful parts of life, the
    things that are really hard to put into words, like what's going to be the
    impact on human empathy? Because I think empathy is something that a
    machine cannot have, at least so far. I wanna know if AI will improve the
    lives of my loved ones and the generations to come. Will the AI help humans
    to live fulfilled and happy lives? I feel like AI could be a catalyst to
    making humans be more empathetic towards one another." */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const DANIELLE = { tone: K.SKIN[1], hair: 'long', hairColor: K.HAIR.auburn, top: C.moss, bottom: '#3b3a4a' };
  const FRIEND = { tone: K.SKIN[3], hair: 'short', hairColor: K.HAIR.black, top: C.sky, bottom: '#2f3e4a' };
  const FAMILY = [
    { tone: K.SKIN[1], hair: 'short', hairColor: K.HAIR.brown, top: C.sky },
    DANIELLE,
    { tone: K.SKIN[1], hair: 'ponytail', hairColor: K.HAIR.auburn, top: C.gold, age: 'child' },
    { tone: K.SKIN[1], hair: 'bald', hairColor: K.HAIR.white, top: C.clay, age: 'elder' }
  ];

  /* 1 · …lose the beautiful parts of life. */
  {
    const t0 = 0, t1 = at('the things');
    const b = beat(t0, t1, { mood: 'warm' });
    const items = [
      [520, 330, n => K.place(K.sun(n), 0, 0, .7)],
      [800, 260, n => { K.place(K.person(n, { ...DANIELLE, mood: 'grin' }), -30, 110, .35); K.place(K.person(n, { ...FRIEND, mood: 'grin' }), 30, 110, .35); }],
      [1080, 330, n => K.place(K.musicNote(n), 0, 0, 1.3)],
      [600, 560, n => K.place(K.flower(n), 0, 50, 1.1)],
      [1000, 560, n => K.place(K.heart(n, C.clay), 0, 8, .9)],
      [800, 500, n => K.place(K.star(n, C.gold, 40), 0, 0)]
    ];
    const tiles = items.map(([x, y, d], i) => { const w = K.wrap(b, x, y); const fr = K.el('circle', { r: 92, fill: C.cream, opacity: .12 }, w); d(w); return w; });
    tiles.forEach((t, i) => pop(t, .15 + i * .3, { origin: '50% 50%', from: .2, ease: 'back.out(1.8)' }));
    tiles.forEach((t, i) => loop(t, at('humans') + 1 + i * .1, t1, { y: -10 }, 1.6 + i * .15));
    // "Lose": everything dims for a moment, then the beautiful parts glow.
    tl.to(tiles, { autoAlpha: .35, duration: .35, stagger: .03 }, at('lose') + .4);
    tl.to(tiles, { autoAlpha: 1, duration: .4, stagger: .04 }, at('beautiful'));
    burst(b, 800, 420, at('beautiful') + .1, { n: 14, r1: 380, color: C.gold });
    callout('beautiful', at('beautiful'), { hold: 1.4 });
  }

  /* 2 · …things hard to put into words… the impact on human empathy? */
  {
    const t0 = at('the things'), t1 = at('because');
    const b = beat(t0, t1, { mood: 'calm' });
    const sp = K.wrap(b, 800, 380, 1.2); const bub = K.speech(sp, { w: 320, h: 170 });
    pop(sp, t0, { origin: '50% 100%' });
    const letters = ['a', 'b', '?', 'w', '…'].map((ch, i) => K.text(bub.inner, ch, -110 + i * 55, 18, 54, C.ink, { 'font-family': "'Source Serif 4', Georgia, serif" }));
    letters.forEach((l, i) => tl.to(l, { y: i % 2 ? -14 : 14, rotation: i % 2 ? 18 : -18, duration: .14, repeat: 9, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' }, at('hard') + i * .03));
    tl.to(sp, { autoAlpha: 0, scale: .7, duration: .35, transformOrigin: '50% 100%' }, at('like', 2) - .1);
    // Empathy: one person comforts another.
    const sad = who(S, b, 920, 720, { ...FRIEND, mood: 'sad' }, 1.1);
    const dn = who(S, b, 680, 720, { ...DANIELLE, mood: 'flat' }, 1.1);
    rise(sad, at('like', 2), { y: 30 }); rise(dn, at('like', 2) + .1, { y: 30 });
    const cl = K.wrap(b, 940, 290, .9); K.cloud(cl, '#7d8a83');
    pop(cl, at('like', 2) + .2, { origin: '50% 50%' });
    const drops = K.g(cl); [-30, 0, 30].forEach((x, i) => { const d = K.el('path', { d: `M${x} 40 l-5 14 a6 6 0 0 0 10 0z`, fill: C.sky }, drops); tl.fromTo(d, { y: 0, autoAlpha: 1 }, { y: 60, autoAlpha: 0, duration: .6, repeat: 4, ease: 'power1.in', immediateRender: true }, at('like', 2) + .4 + i * .2); });
    const em = at('empathy');
    reach(dn.p, 'r', at('impact'), -55);
    tl.to(dn, { x: 70, duration: .6, ease: 'power2.out' }, at('impact'));
    tl.to(cl, { autoAlpha: 0, y: -40, duration: .5 }, em + .2);
    face(sad.p, em + .3, 'smile'); face(dn.p, em + .2, 'smile');
    const ht = K.wrap(b, 830, 330, .8); K.heart(ht, C.clay);
    pop(ht, em, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    callout('empathy', em, { hold: 1.0 });
  }

  /* 3 · Empathy is something that a machine cannot have, at least so far. */
  {
    const t0 = at('because'), t1 = at('i wanna');
    const b = beat(t0, t1, { mood: 'wonder' });
    const hu = who(S, b, 470, 720, { ...DANIELLE, mood: 'smile' }, 1.05);
    rise(hu, t0, { y: 30 }); breathe(S, hu, t0, t1);
    const hh = K.wrap(b, 470, 300, .8); K.heart(hh, C.clay);
    pop(hh, at('empathy', 2) - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    loop(hh, at('empathy', 2) + .5, t1, { scale: 1.1, transformOrigin: '50% 50%' }, .8);
    const ai = K.wrap(b, 1100, 470, 1.05); K.chip(ai, { face: true });
    pop(ai, at('machine') - .2, { origin: '50% 50%' });
    const ho = K.wrap(b, 1100, 260, 1); const hol = K.heartOutline(ho, C.mint);
    pop(ho, at('cannot') - .15, { origin: '50% 50%' });
    const no = K.wrap(b, 1180, 200, .7); K.cross(no);
    pop(no, at('cannot') + .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    // "At least so far": the outline flickers… maybe one day?
    tl.to(no, { autoAlpha: .25, duration: .4 }, at('least'));
    tl.to(hol.shape, { attr: { 'stroke-dashoffset': -52 }, duration: 1.2, ease: 'none' }, at('least'));
    const fill = K.wrap(b, 1100, 260, 1); K.heart(fill, C.mint); fill.setAttribute('opacity', 0);
    tl.to(fill, { attr: { opacity: .35 }, duration: .25, repeat: 3, yoyo: true }, at('so far'));
    callout('machine', at('machine'), { hold: 1.0, tone: 'mint' });
    ask(S, b, 1300, 380, at('so far'), t1, { r: 32 });
  }

  /* 4 · …improve the lives of my loved ones and the generations to come. */
  {
    const t0 = at('i wanna'), t1 = at('will the');
    const b = beat(t0, t1, { mood: 'hope', spot: [700, 480, 340] });
    const sunw = K.wrap(b, 700, 500, 1.1); K.sun(sunw);
    tl.fromTo(sunw, { y: 220, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.6, ease: 'power2.out', immediateRender: true }, at('improve') - .2);
    b.insertBefore(sunw.parentNode, b.firstChild);
    const xs = [470, 620, 760, 880];
    const fam = FAMILY.map((f, i) => { const w = who(S, b, xs[i], 720, { ...f, mood: 'grin' }, 1); rise(w, at('loved') - .4 + i * .1, { y: 30 }); return w; });
    const ai = K.wrap(b, 700, 230, .5); K.chip(ai);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    // Generations to come, stretching away into the future.
    const g0 = at('generations');
    for (let i = 0; i < 5; i++) {
      const w = K.wrap(b, 1030 + i * 90 - i * i * 6, 700 - i * 34, .62 - i * .09);
      K.person(w, { tone: K.SKIN[(i + 1) % 5], hair: ['short', 'long', 'curly', 'bun', 'ponytail'][i], top: [C.gold, C.sky, C.rose, C.mint, C.clay][i], mood: 'smile' });
      tl.fromTo(w, { autoAlpha: 0, x: -40 }, { autoAlpha: 1 - i * .12, x: 0, duration: .6, ease: 'expo.out', immediateRender: true }, g0 + i * .12);
    }
    callout('improve', at('improve'), { hold: .9 });
    callout('loved ones', at('loved'), { hold: .6, small: true });
    callout('generations', g0, { hold: 1.1 });
  }

  /* 5 · Will the AI help humans to live fulfilled and happy lives? */
  {
    const t0 = at('will the'), t1 = at('i feel');
    const b = beat(t0, t1, { mood: 'warm' });
    const jars = [560, 800, 1040].map((x, i) => {
      const w = K.wrap(b, x, 640);
      K.el('path', { d: 'M-70 -180 h140 v160 q0 30 -30 30 h-80 q-30 0 -30 -30z', fill: C.cream, opacity: .22, stroke: C.cream, 'stroke-width': 5 }, w);
      const liquid = K.el('rect', { x: -64, y: -170, width: 128, height: 172, rx: 22, fill: [C.gold, C.clay, C.moss][i] }, w);
      tl.fromTo(liquid, { scaleY: 0 }, { scaleY: 1, svgOrigin: '0 2', duration: 1.1, ease: 'power2.inOut', immediateRender: true }, at('fulfilled') - .3 + i * .12);
      rise(w, t0 + i * .1, { y: 30 });
      const f = K.wrap(w, 0, -60, .5); const fc = K.g(f);
      K.el('circle', { r: 50, fill: C.cream }, fc);
      K.el('circle', { cx: -16, cy: -8, r: 6, fill: C.ink }, fc); K.el('circle', { cx: 16, cy: -8, r: 6, fill: C.ink }, fc);
      const m = K.el('path', { d: 'M-18 16 q18 0 36 0', stroke: C.ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, fc);
      pop(f, at('happy') - .1 + i * .1, { origin: '50% 50%' });
      tl.to(m, { attr: { d: 'M-20 10 q20 24 40 0' }, duration: .35 }, at('happy') + .1 + i * .1);
      return w;
    });
    callout('fulfilled', at('fulfilled'), { hold: .65 });
    callout('happy', at('happy'), { hold: 1.0 });
    ask(S, b, 1240, 330, at('lives', 2) + .1, t1, { r: 34 });
  }

  /* 6 · AI could be a catalyst to making humans more empathetic towards one another. */
  {
    const t0 = at('i feel'), t1 = D;
    const b = beat(t0, t1, { mood: 'warm', spot: [800, 470, 360] });
    const n = 6, R = 290;
    const ring = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i / n * Math.PI * 2;
      const w = who(S, b, 800 + Math.cos(a) * R * 1.2, 520 + Math.sin(a) * R * .62 + 110, { tone: K.SKIN[i % 5], hair: ['short', 'long', 'curly', 'bun', 'ponytail', 'scarf'][i], hairColor: [K.HAIR.black, K.HAIR.auburn, K.HAIR.black, K.HAIR.brown, K.HAIR.blond, C.sky][i], top: [C.gold, C.sky, C.rose, C.mint, C.clay, C.moss][i], mood: 'flat' }, .62);
      rise(w, t0 + i * .06, { y: 20 }); ring.push([w, a]);
    }
    const ai = K.wrap(b, 800, 470, .6); K.chip(ai);
    const cat = at('catalyst');
    pop(ai, cat - .4, { origin: '50% 50%', from: .1 });
    const spark = K.wrap(b, 800, 470); K.sparkle(spark, C.gold, 60);
    pop(spark, cat, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 800, 470, cat + .1, { n: 16, r1: 330, color: C.gold });
    // Hearts travel from person to person — a chain reaction.
    const emp = at('empathetic');
    ring.forEach(([w, a], i) => {
      const [x, y] = [800 + Math.cos(a) * R * 1.2, 520 + Math.sin(a) * R * .62 - 115];
      const h = K.wrap(b, x, y, .42); K.heart(h, C.clay);
      pop(h, at('making') + i * .22, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
      face(w.p, at('making') + i * .22, 'grin');
      const [nx, ny] = [800 + Math.cos(a + Math.PI * 2 / n) * R * 1.2, 520 + Math.sin(a + Math.PI * 2 / n) * R * .62 - 70];
      const link = K.el('path', { d: `M${x} ${y} Q800 470 ${nx} ${ny}`, stroke: C.rose, 'stroke-width': 4, fill: 'none', opacity: .6, 'stroke-dasharray': '4 10', 'stroke-linecap': 'round' }, b);
      draw(link, emp - .3 + i * .08, .6);
    });
    callout('catalyst', cat, { hold: 1.1 });
    callout('empathetic', emp, { hold: 1.3 });
  }
}
