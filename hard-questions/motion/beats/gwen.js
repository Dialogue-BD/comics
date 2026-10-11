import { badge, who, breathe, ask } from './_shared.js';

/* Gwen — Environment.
   "I think it's dangerous for the environment. It's concerning for residents
    who are in marginalized communities. Can we balance the goals of technology
    with the stability and safety of our communities? Can AI actually help the
    environment instead of harm it?" */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;

  /* 1 · It's dangerous for the environment. */
  {
    const t0 = 0, t1 = at("it's", 2);
    const b = beat(t0, t1, { mood: 'worry' });
    const dc = [0, 1, 2].map(i => { const r = K.wrap(b, 880 + i * 140, 700, .85); K.server(r, { h: 4 }); return r; });
    dc.forEach((r, i) => rise(r, i * .1, { y: 60 }));
    const smokes = [0, 1, 2].map(i => { const sm = K.wrap(b, 870 + i * 140, 470); const s = K.factorySmoke(sm); return [sm, s]; });
    smokes.forEach(([sm, s], i) => s.puffs.forEach((p, k) => tl.fromTo(p, { scale: .3, autoAlpha: 0, y: 0 }, { scale: 1.2, autoAlpha: .7, y: -60, duration: 1.6, repeat: 1, ease: 'power1.out', transformOrigin: '50% 50%', immediateRender: true }, .3 + i * .15 + k * .25)));
    const trees = [380, 540, 700].map((x, i) => { const w = K.wrap(b, x, 710, .9 - i * .05); const tr = K.tree(w, { leaf: C.moss }); return [w, tr]; });
    trees.forEach(([w], i) => pop(w, .1 + i * .1));
    const dg = at('dangerous');
    trees.forEach(([w, tr], i) => {
      [...tr.crown.children].forEach(c => tl.to(c, { attr: { fill: '#8c8a5a' }, duration: .8 }, dg + .2 + i * .1));
      tl.to(w, { rotation: -6 + i * 2, scaleY: .92, duration: .8, ease: 'power2.out', transformOrigin: '50% 100%' }, dg + .2 + i * .1);
    });
    const warn = K.wrap(b, 800, 260, 1.1); K.warning(warn);
    pop(warn, dg, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    loop(warn, dg + .6, t1, { scale: 1.08, transformOrigin: '50% 50%' }, .6);
    callout('dangerous', dg, { tone: 'clay', hold: .6 });
    callout('environment', at('environment'), { hold: .55, small: true, tone: 'mint' });
  }

  /* 2 · It's concerning for residents in marginalized communities. */
  {
    const t0 = at("it's", 2), t1 = at('can');
    const b = beat(t0, t1, { mood: 'worry' });
    const dc = K.wrap(b, 860, 700, 1.25); K.server(dc, { h: 5 });
    rise(dc, t0, { y: 60 });
    const shadowWedge = K.el('path', { d: 'M780 720 L300 740 L300 760 L800 740Z', fill: C.shadow, opacity: 0 }, b);
    const homes = [430, 590, 740].map((x, i) => { const h = K.wrap(b, x, 712, .75); K.house(h, { color: [C.clay, C.gold, C.rose][i] }); return h; });
    homes.forEach((h, i) => pop(h, at('residents') - .2 + i * .12, { y: 20 }));
    const people = [500, 660].map((x, i) => { const w = who(S, b, x, 724, { tone: K.SKIN[2 + i * 2], hair: i ? 'scarf' : 'curly', hairColor: i ? C.gold : K.HAIR.black, top: i ? C.sky : C.rose, mood: 'worried' }, .55); pop(w, at('residents') + .1 + i * .12, { y: 10 }); return w; });
    // Marginalized: pushed to the edge of the picture.
    const mg = at('marginalized');
    homes.forEach((n, i) => tl.to(n, { x: (-110 - i * 14) / .75, duration: 1, ease: 'power3.inOut' }, mg - .2));
    people.forEach((n, i) => tl.to(n, { x: (-110 - i * 14) / .55, duration: 1, ease: 'power3.inOut' }, mg - .2));
    const edge = K.el('path', { d: 'M262 200 V740', stroke: C.clay, 'stroke-width': 4, 'stroke-dasharray': '10 12', opacity: .8 }, b);
    draw(edge, mg, .6);
    tl.to(shadowWedge, { attr: { opacity: .45 }, duration: .7 }, mg);
    const shadowOver = K.el('ellipse', { cx: 420, cy: 600, rx: 260, ry: 170, fill: C.shadow, opacity: 0 }, b);
    tl.to(shadowOver, { attr: { opacity: .32 }, duration: .7 }, mg + .2);
    callout('concerning', at('concerning'), { tone: 'clay', hold: .55, small: true });
    callout('residents', at('residents'), { hold: .9, small: true });
    callout('marginalized', mg, { tone: 'clay', hold: 1.2 });
  }

  /* 3 · Can we balance the goals of technology with the stability and safety of our communities? */
  {
    const t0 = at('can'), t1 = at('can ai');
    const b = beat(t0, t1, { mood: 'wonder' });
    const sw = K.wrap(b, 800, 760, 1.05); const sc = K.scale(sw);
    rise(sw, t0, { y: 50 });
    tl.set(sc.beam, { rotation: 0, svgOrigin: '0 -256' }, 0);
    // Technology lands on the left pan.
    const left = K.g(sc.panL);
    const ai = K.wrap(left, -210, -150, .5); K.chip(ai, { glow: false });
    const sv = K.wrap(left, -150, -150, .45); K.server(sv, { h: 3 });
    const tech = at('technology');
    pop(ai, at('goals') - .1, { origin: '50% 100%', y: -120 }); pop(sv, tech - .2, { origin: '50% 100%', y: -120 });
    tl.to(sc.beam, { rotation: -9, duration: .7, ease: 'back.out(2)', svgOrigin: '0 -256' }, tech);
    // Communities land on the right.
    const right = K.g(sc.panR);
    const h1 = K.wrap(right, 170, -150, .42); K.house(h1, { color: C.clay });
    const h2 = K.wrap(right, 250, -150, .38); K.house(h2, { color: C.gold });
    const sh = K.wrap(right, 210, -280, .55); K.shield(sh, C.mint);
    pop(h1, at('stability') - .2, { origin: '50% 100%', y: -120 }); pop(h2, at('stability'), { origin: '50% 100%', y: -120 });
    pop(sh, at('safety') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.6)' });
    tl.to(sc.beam, { rotation: 5, duration: .6, ease: 'back.out(2)', svgOrigin: '0 -256' }, at('safety'));
    tl.to(sc.beam, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .4)', svgOrigin: '0 -256' }, at('communities', 2) - .2);
    // Keep the pans hanging straight while the beam tips.
    for (const p of [sc.panL, sc.panR]) tl.set(p, { rotation: 0 }, 0);
    tl.to(sc.panL, { rotation: 9, duration: .7, ease: 'back.out(2)', svgOrigin: '-210 -255' }, tech);
    tl.to(sc.panL, { rotation: -5, duration: .6, ease: 'back.out(2)', svgOrigin: '-210 -255' }, at('safety'));
    tl.to(sc.panL, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .4)', svgOrigin: '-210 -255' }, at('communities', 2) - .2);
    tl.to(sc.panR, { rotation: 9, duration: .7, ease: 'back.out(2)', svgOrigin: '210 -255' }, tech);
    tl.to(sc.panR, { rotation: -5, duration: .6, ease: 'back.out(2)', svgOrigin: '210 -255' }, at('safety'));
    tl.to(sc.panR, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .4)', svgOrigin: '210 -255' }, at('communities', 2) - .2);
    burst(b, 800, 500, at('communities', 2) + .3, { color: C.gold, n: 10, r1: 200 });
    callout('balance', at('balance'), { hold: 1.1 });
    callout('goals', at('goals'), { hold: .5, small: true });
    callout('safety', at('safety'), { tone: 'mint', hold: .7 });
  }

  /* 4 · Can AI actually help the environment instead of harm it? */
  {
    const t0 = at('can ai'), t1 = D;
    const b = beat(t0, t1, { mood: 'hope' });
    const sunw = K.wrap(b, 1220, 250, .8); K.sun(sunw);
    const tw = K.wrap(b, 700, 720, 1.5); const tr = K.tree(tw, { wilt: true });
    rise(tw, t0, { y: 30 });
    tl.set(tw, { rotation: -6, transformOrigin: '50% 100%' }, 0);
    const ai = K.wrap(b, 1050, 430, .85); K.chip(ai);
    pop(ai, t0 + .1, { origin: '50% 50%' });
    const help = at('help');
    flow(b, 'M980 440 Q860 380 770 420', help - .1, t1, { color: C.mint, n: 4, speed: .8 });
    [...tr.crown.children].forEach((c, i) => tl.to(c, { attr: { fill: i === 4 ? '#ffffff' : C.moss }, duration: .8 }, help + .3 + i * .08));
    tl.to(tw, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .5)', transformOrigin: '50% 100%' }, help + .3);
    const leaves = [[-90, -260], [80, -300], [-30, -340], [110, -200]].map(([x, y], i) => { const l = K.wrap(b, 700 + x * 1.5, 720 + y * 1.5, .5); K.leafShape(l, C.mint); return l; });
    leaves.forEach((l, i) => pop(l, at('environment', 2) + i * .12, { origin: '50% 100%', from: .1, ease: 'back.out(2.4)' }));
    tl.fromTo(sunw, { y: 200, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power2.out', immediateRender: true }, help);
    // Harm, crossed out.
    const sm = K.wrap(b, 420, 420, .9); const s = K.factorySmoke(sm);
    pop(sm, t0 + .2, { origin: '50% 100%' });
    const no = K.el('path', { d: 'M330 300 L520 480', stroke: C.clay, 'stroke-width': 14, 'stroke-linecap': 'round' }, b);
    draw(no, at('harm') + .1, .3);
    tl.to(sm, { autoAlpha: 0, scale: .6, duration: .5, transformOrigin: '50% 100%' }, at('harm') + .5);
    callout('environment', at('environment', 2), { tone: 'mint', hold: .9 });
    callout('harm', at('harm'), { tone: 'clay', hold: .8 });
    ask(S, b, 1050, 220, end('harm') - .1, t1 + 1, { r: 34 });
  }
}
