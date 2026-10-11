import { badge, who, breathe, ask } from './_shared.js';

/* Larissa — Creativity.
   "My question for AI companies would be, what's your mission? What's your
    driving force? I'm wondering if AI will rob my son of the opportunity to
    develop his critical thinking skills, his mental muscle, his ability to
    analyze and criticize as he goes through his college education. Will AI's
    capabilities lead me to losing my job as a writer? Can AI be my thought
    partner in writing instead of replacing me as a writer? Can I use AI to help
    generate ideas, stimulating my thinking in a new way?" */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const LARISSA = { tone: K.SKIN[3], hair: 'bun', hairColor: K.HAIR.black, top: C.gold, bottom: '#3b3a4a' };
  const SON = { tone: K.SKIN[3], hair: 'short', hairColor: K.HAIR.black, top: C.sky, bottom: '#2f3e4a', age: 'teen' };

  /* 1 · My question for AI companies… */
  {
    const t0 = 0, t1 = at("what's");
    const b = beat(t0, t1, { mood: 'calm' });
    const l = who(S, b, 420, 720, LARISSA, 1.1);
    rise(l, 0, { y: 30 }); breathe(S, l, 0, t1); reach(l.p, 'r', .4, -40);
    const sp = K.wrap(b, 620, 330); const bub = K.speech(sp, { w: 150, h: 110 });
    K.place(K.question(bub.inner, { r: 34 }), 0, 0);
    pop(sp, at('question'), { origin: '0% 100%', from: .2 });
    [900, 1100, 1300].forEach((x, i) => { const h = K.wrap(b, x, 720, .82 + (i === 1 ? .12 : 0)); K.building(h, { w: 170, h: 330 + i * 30 }); rise(h, at('companies') - .1 + i * .12, { y: 80 }); });
  }

  /* 2 · What's your mission? What's your driving force? */
  {
    const t0 = at("what's"), t1 = at("i'm");
    const b = beat(t0, t1, { mood: 'wonder' });
    const cg = K.wrap(b, 690, 450, 1.15); const cp = K.compass(cg);
    pop(cg, t0, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    tl.fromTo(cp.needle, { rotation: -160 }, { rotation: 25, duration: 1.4, ease: 'elastic.out(1, .4)', svgOrigin: '0 0', immediateRender: true }, at('mission') - .3);
    const g1 = K.wrap(b, 1040, 400); K.gear(g1, { r: 74, teeth: 12, color: C.gold });
    const g2 = K.wrap(b, 1172, 520); K.gear(g2, { r: 52, teeth: 9, color: C.moss });
    pop(g1, at('driving') - .1, { origin: '50% 50%' }); pop(g2, at('driving'), { origin: '50% 50%' });
    tl.to(g1, { rotation: 200, duration: t1 - at('driving') + .3, ease: 'none', transformOrigin: '50% 50%' }, at('driving'));
    tl.to(g2, { rotation: -285, duration: t1 - at('driving') + .3, ease: 'none', transformOrigin: '50% 50%' }, at('driving'));
    const arrow = K.el('path', { d: 'M1000 640 H1250 l-30 -26 M1250 640 l-30 26', stroke: C.gold, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    draw(arrow, at('force') - .1, .6, 'expo.out');
    callout('mission', at('mission'), { hold: .75 });
    callout('driving force', at('driving'), { hold: 1.2 });
  }

  /* 3 · …if AI will rob my son of the opportunity… */
  {
    const t0 = at("i'm"), t1 = at('develop');
    const b = beat(t0, t1, { mood: 'worry' });
    const dg = K.wrap(b, 1030, 720, 1.1); const dr = K.door(dg);
    const glow = K.el('path', { d: 'M974 489 L860 740 H1210 L1086 489Z', fill: C.gold, opacity: .18 }, b);
    b.insertBefore(glow, b.firstChild);
    tl.set(dr.leaf, { scaleX: .15, svgOrigin: '-56 0' }, 0);
    const shine = K.wrap(b, 1030, 600); K.halo(shine, 170, 'gold');
    rise(dg, t0, { y: 40 }); S.fade(shine, t0 + .2);
    const s = who(S, b, 640, 720, { ...SON, mood: 'smile' }, 1.1);
    rise(s, t0 + .15, { y: 30 }); breathe(S, s, t0, t1);
    tl.to(s, { x: 120, duration: 1.4, ease: 'power1.inOut' }, at('son') - .2);
    const hand = K.wrap(b, 1600, 560, 1.1); const rh = K.robotHand(hand);
    tl.fromTo(hand, { x: 300 }, { x: -380, duration: .9, ease: 'power3.out', immediateRender: true }, at('rob') - .2);
    // The robot hand swings the door shut.
    tl.to(dr.leaf, { scaleX: 1, duration: .5, ease: 'power3.in', svgOrigin: '-56 0' }, at('opportunity') - .2);
    tl.to([glow, shine], { autoAlpha: 0, duration: .4 }, at('opportunity') + .1);
    tl.to(hand, { x: 200, duration: .7, ease: 'power2.in' }, at('opportunity') + .4);
    face(s.p, at('opportunity') + .1, 'sad');
    callout('opportunity', at('opportunity'), { tone: 'clay', hold: 1.0 });
    ask(S, b, 470, 300, at('wondering'), t1, { r: 36 });
  }

  /* 4 · …to develop his critical thinking skills, his mental muscle… */
  {
    const t0 = at('develop'), t1 = at('his ability');
    const b = beat(t0, t1, { mood: 'wonder' });
    const bg = K.wrap(b, 760, 430, 1.55); const br = K.brain(bg);
    pop(bg, t0, { origin: '50% 50%', from: .5, ease: 'expo.out' });
    [...br.lines.children].forEach((l, i) => { l.setAttribute('stroke', C.gold); draw(l, at('critical') + i * .08, .5); });
    const gA = K.wrap(b, 700, 400, .55); K.gear(gA, { r: 44, color: C.gold }); const gB = K.wrap(b, 820, 470, .45); K.gear(gB, { r: 44, color: C.mint });
    pop(gA, at('thinking'), { origin: '50% 50%' }); pop(gB, at('thinking') + .1, { origin: '50% 50%' });
    tl.to(gA, { rotation: 240, duration: t1 - at('thinking'), ease: 'none', transformOrigin: '50% 50%' }, at('thinking'));
    tl.to(gB, { rotation: -300, duration: t1 - at('thinking'), ease: 'none', transformOrigin: '50% 50%' }, at('thinking'));
    // "Mental muscle": the brain flexes.
    const m = K.wrap(b, 1090, 470, 1.1); K.muscle(m);
    pop(m, at('mental') - .1, { origin: '0% 100%' });
    tl.to(m, { scale: 1.18, duration: .22, repeat: 3, yoyo: true, ease: 'power2.inOut', transformOrigin: '0% 100%' }, at('muscle'));
    tl.to(bg, { scale: 1.1, duration: .3, repeat: 1, yoyo: true, ease: 'power2.inOut', transformOrigin: '50% 50%' }, at('muscle'));
    callout('critical thinking', at('critical'), { hold: 1.4 });
  }

  /* 5 · …his ability to analyze and criticize as he goes through his college education. */
  {
    const t0 = at('his ability'), t1 = at('will', 2);
    const b = beat(t0, t1, { mood: 'calm' });
    const pg = K.wrap(b, 520, 420, 1.35); const d = K.doc(pg, { lines: 5 });
    rise(pg, t0, { y: 40 });
    const mg = K.wrap(b, 470, 380, .8); K.magnifier(mg);
    pop(mg, at('analyze') - .1, { origin: '50% 50%' });
    tl.to(mg, { x: 90, y: 60, duration: .5, ease: 'sine.inOut', repeat: 1, yoyo: true }, at('analyze'));
    const marks = [K.el('path', { d: 'M560 380 l10 10 l20 -22', stroke: C.mintDeep, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, b), K.el('path', { d: 'M470 456 q30 -12 60 0', stroke: C.clay, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, b), K.el('path', { d: 'M572 460 l18 18 M590 460 l-18 18', stroke: C.clay, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, b)];
    marks.forEach((mk, i) => draw(mk, at('criticize') - .1 + i * .18, .3));
    const redPen = K.wrap(b, 650, 470, .7); K.pen(redPen, C.clay);
    pop(redPen, at('criticize') - .2, { origin: '50% 100%', rot: 20 });
    // The road through college.
    const road = K.el('path', { d: 'M760 690 C900 690 980 600 1120 600 S1300 560 1360 520', stroke: C.mist, 'stroke-width': 10, fill: 'none', 'stroke-dasharray': '2 22', 'stroke-linecap': 'round', opacity: .7 }, b);
    draw(road, at('goes') - .2, .8);
    const col = K.wrap(b, 1300, 560, .7); K.building(col, { w: 230, h: 260, logo: false });
    const cap = K.wrap(b, 1300, 240, .8); K.gradCap(cap);
    rise(col, at('college') - .2, { y: 40 }); pop(cap, at('education'), { origin: '50% 50%', rot: -15 });
    const s = who(S, b, 760, 720, SON, .9);
    rise(s, at('goes') - .3, { y: 20 });
    tl.to(s, { motionPath: { path: [{ x: 0, y: 0 }, { x: 220, y: -70 }, { x: 400, y: -140 }], curviness: 1 }, scale: .8, duration: t1 - at('goes'), ease: 'power1.inOut' }, at('goes'));
    callout('analyze', at('analyze'), { hold: .75 });
    callout('education', at('education'), { hold: 1.1 });
  }

  /* 6 · Will AI's capabilities lead me to losing my job as a writer? */
  {
    const t0 = at('will', 2), t1 = at('can');
    const b = beat(t0, t1, { mood: 'worry' });
    const desk = K.g(b);
    K.el('rect', { x: 430, y: 560, width: 380, height: 22, rx: 8, fill: '#7b5636' }, desk);
    K.el('rect', { x: 460, y: 580, width: 18, height: 140, rx: 6, fill: '#5d3f27' }, desk); K.el('rect', { x: 762, y: 580, width: 18, height: 140, rx: 6, fill: '#5d3f27' }, desk);
    rise(desk, t0, { y: 30 });
    const l = who(S, b, 400, 720, LARISSA, 1.05);
    rise(l, t0, { y: 30 }); breathe(S, l, t0, t1); reach(l.p, 'r', t0 + .3, -55);
    const lap = K.wrap(b, 650, 560, .95); const lp = K.laptop(lap);
    rise(lap, t0 + .1, { y: 20 });
    lp.lines.forEach((ln, i) => draw(ln, t0 + .4 + i * .15, .3));
    const ai = K.wrap(b, 1140, 440, .7); K.chip(ai);
    pop(ai, at("ai's") - .1, { origin: '50% 50%' });
    tl.to(ai, { scale: 1.5 / .7, duration: 1.0, ease: 'expo.out', transformOrigin: '50% 50%' }, at('capabilities'));
    burst(b, 1140, 440, at('capabilities') + .1, { color: C.mint, r1: 230, n: 12 });
    // Losing the job: the laptop slides away to the chip.
    tl.to(lap, { x: 330, y: -40, scale: .7, autoAlpha: .0, duration: .9, ease: 'power3.in' }, at('losing'));
    face(l.p, at('losing'), 'worried');
    tl.to(l.p.parts.armR, { rotation: 0, duration: .4, svgOrigin: K.armOrigin(l.p.parts.armR) }, at('losing'));
    callout('capabilities', at('capabilities'), { hold: 1.0 });
    callout('writer', at('writer'), { tone: 'clay', hold: .7 });
  }

  /* 7 · Can AI be my thought partner in writing instead of replacing me as a writer? */
  {
    const t0 = at('can'), t1 = at('can', 2);
    const b = beat(t0, t1, { mood: 'hope' });
    const l = who(S, b, 520, 720, { ...LARISSA, mood: 'smile' }, 1.05);
    rise(l, t0, { y: 30 }); breathe(S, l, t0, t1); reach(l.p, 'r', t0 + .2, -50);
    const ai = K.wrap(b, 1080, 470, .9); K.chip(ai, { face: true });
    pop(ai, t0 + .15, { origin: '50% 50%' });
    loop(ai, t0 + .8, t1, { y: -12 }, 1.4);
    const pg = K.wrap(b, 800, 420, 1.45); const d = K.doc(pg, { lines: 5, accent: C.mint });
    pop(pg, at('partner') - .2, { origin: '50% 50%' });
    d.lines.forEach((ln, i) => { ln.setAttribute('stroke', i % 2 ? C.mintDeep : C.goldDeep); draw(ln, at('writing') - .2 + i * .14, .3); });
    const link = K.el('path', { d: 'M650 330 Q800 220 960 330', stroke: C.gold, 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '6 10', 'stroke-linecap': 'round' }, b);
    draw(link, at('partner'), .6);
    const ht = K.wrap(b, 800, 240, .55); K.heart(ht, C.gold);
    pop(ht, at('partner') + .4, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    // "Instead of replacing me" — the swap is crossed out.
    const sw = K.wrap(b, 1300, 260); K.el('circle', { r: 58, fill: C.cream }, sw);
    K.el('path', { d: 'M-30 -12 h50 l-14 -12 M30 12 h-50 l14 12', stroke: C.ink, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sw);
    const x = K.el('path', { d: 'M-40 -40 L40 40', stroke: C.clay, 'stroke-width': 10, 'stroke-linecap': 'round' }, sw);
    pop(sw, at('replacing') - .1, { origin: '50% 50%' });
    draw(x, at('replacing') + .35, .3);
    callout('thought partner', at('thought'), { hold: 1.3 });
    callout('replacing', at('replacing'), { tone: 'clay', hold: .8 });
  }

  /* 8 · Can I use AI to help generate ideas, stimulating my thinking in a new way? */
  {
    const t0 = at('can', 2), t1 = D;
    const b = beat(t0, t1, { mood: 'hope' });
    const l = who(S, b, 470, 1040, { ...LARISSA, mood: 'smile' }, 2.1);
    rise(l, t0, { y: 60 });
    const ai = K.wrap(b, 1220, 470, .85); K.chip(ai, { face: true });
    pop(ai, at('use ai') + .1, { origin: '50% 50%' });
    const gen = at('generate');
    const spots = [[760, 300], [900, 460], [1000, 260], [820, 600]];
    spots.forEach(([x, y], i) => {
      const bw = K.wrap(b, x, y, .62 + (i % 2) * .12); K.bulb(bw);
      const sc = .62 + (i % 2) * .12;
      tl.fromTo(bw, { autoAlpha: 0, scale: .2, x: (1220 - x) / sc, y: (470 - y) / sc }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: .8, ease: 'back.out(1.6)', transformOrigin: '50% 50%', immediateRender: true }, gen + i * .2);
      loop(bw, gen + 1 + i * .2, t1, { y: -10 }, 1.4 + i * .2);
    });
    // New pathways light up around her head.
    const st = at('stimulating');
    const paths = ['M380 270 C300 200 330 120 420 110', 'M560 270 C640 190 620 120 540 100', 'M470 230 C470 160 520 90 600 70', 'M330 330 C250 320 220 260 240 200'];
    paths.forEach((d, i) => { const p = K.el('path', { d, stroke: [C.mint, C.gold, C.sky, C.rose][i], 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, b); draw(p, st + i * .12, .6, 'expo.out'); });
    burst(b, 470, 220, st + .3, { color: C.gold, n: 12, r1: 220 });
    callout('ideas', at('ideas'), { hold: .9 });
    callout('stimulating', st, { hold: 1.3, tone: 'mint' });
  }
}
