import { badge, who, breathe, ask } from './_shared.js';

/* Kamille — Health.
   "There are a lot of specific fields that would benefit from the use of it.
    Will AI help with quicker medical diagnosis? I'm someone who was diagnosed
    with a chronic illness and it took six years for them to figure out what I
    had. I wonder how my life would have been impacted positively had I been
    able to use AI to get a quicker medical diagnosis." */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, tl } = S;
  const D = S.duration;
  const KAMILLE = { tone: K.SKIN[2], hair: 'long', hairColor: K.HAIR.black, top: C.clay, bottom: '#2f3e4a' };

  /* 1 · Many specific fields could benefit. */
  {
    const t0 = 0, t1 = at('will');
    const b = beat(t0, t1, { mood: 'calm' });
    const ring = [
      [520, 330, i => K.doc(i, { mark: 'cross', w: 70, h: 90, lines: 3 })],
      [800, 250, i => K.place(K.book(i), 0, 0, .8)],
      [1080, 330, i => K.place(K.leafShape(i), 0, 34, 1)],
      [1080, 560, i => K.place(K.gear(i, { r: 34 }), 0, 0)],
      [800, 640, i => K.doc(i, { mark: 'chart', w: 70, h: 90, lines: 2 })],
      [520, 560, i => K.place(K.flask(i), 0, 14, .5)]
    ].map(([x, y, d]) => badge(S, b, x, y, d, { r: 64 }));
    const lot = at('lot'), fields = at('fields');
    ring.forEach((r, i) => pop(r, lot + i * ((fields - lot + .3) / 6), { origin: '50% 50%' }));
    callout('fields', fields, { hold: 1.0 });
    const benefit = at('benefit');
    const c = K.wrap(b, 800, 445, .9); K.chip(c);
    pop(c, benefit - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.2)' });
    ring.forEach((r, i) => {
      const [x, y] = [[520, 330], [800, 250], [1080, 330], [1080, 560], [800, 640], [520, 560]][i];
      const line = K.el('path', { d: `M800 445 L${x} ${y}`, stroke: C.mint, 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, b);
      b.insertBefore(line, b.firstChild);
      draw(line, benefit + .15 + i * .07, .5);
      tl.to(r.glow, { attr: { opacity: 1 }, duration: .4 }, benefit + .5 + i * .07);
      tl.to(r.ring, { attr: { stroke: C.mint }, duration: .4 }, benefit + .5 + i * .07);
    });
    callout('benefit', benefit, { tone: 'mint', hold: 1.5 });
    spin(c.querySelector('.chip').pins, benefit, t1, .05);
  }

  /* 2 · Will AI help with quicker medical diagnosis? */
  {
    const t0 = at('will'), t1 = at("i'm someone");
    const b = beat(t0, t1, { mood: 'wonder' });
    const doctor = who(S, b, 470, 720, { coat: true, tone: K.SKIN[1], hair: 'short', hairColor: K.HAIR.brown, top: C.sky, glasses: true });
    rise(doctor, t0, { y: 40 });
    breathe(S, doctor, t0, t1);
    const scan = K.wrap(b, 800, 440, 1.6); K.doc(scan, { mark: 'cross', lines: 5 });
    pop(scan, t0 + .15, { origin: '50% 50%' });
    const ai = K.wrap(b, 1140, 440, .8); K.chip(ai);
    pop(ai, at('ai') , { origin: '50% 50%', from: .1 });
    flow(b, 'M1060 440 C1000 380 960 380 900 420', at('help'), t1, { color: C.mint, n: 3, speed: .9 });
    const mag = K.wrap(b, 700, 380, .9); K.magnifier(mag);
    pop(mag, at('help'), { origin: '50% 50%' });
    tl.to(mag, { x: 200, duration: .45, ease: 'sine.inOut', repeat: 3, yoyo: true }, at('quicker'));
    tl.to(mag, { y: 120, duration: 1.8, ease: 'sine.inOut' }, at('quicker'));
    // Speed lines say "quicker".
    const speed = K.g(b);
    for (let i = 0; i < 3; i++) K.el('path', { d: `M${960 + i * 6} ${300 + i * 34} h${110 - i * 26}`, stroke: C.gold, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, speed);
    [...speed.children].forEach((l, i) => draw(l, at('quicker') + i * .06, .35, 'power3.out'));
    callout('quicker', at('quicker'), { hold: .55, small: true });
    const ok = K.wrap(b, 880, 540, 1); K.check(ok);
    pop(ok, at('diagnosis'), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    callout('diagnosis', at('diagnosis') + .05, { hold: .9 });
    ask(S, b, 800, 230, end('diagnosis') - .1, t1);
  }

  /* 3 · I was diagnosed with a chronic illness. */
  {
    const t0 = at("i'm someone"), t1 = at('took');
    const b = beat(t0, t1, { mood: 'worry' });
    const kh = K.wrap(b, 800, 452); const aura = K.halo(kh, 260, 'clay'); aura.setAttribute('opacity', 0);
    const k = who(S, b, 800, 720, { ...KAMILLE, mood: 'flat' }, 1.15);
    rise(k, t0, { y: 30 });
    breathe(S, k, t0, t1, 3);
    const clip = K.wrap(b, 1050, 420, 1); K.doc(clip, { mark: 'cross', w: 110, h: 140 });
    rise(clip, at('diagnosed'), { y: 40 });
    // "Chronic": a loop that keeps going round and round.
    const orbit = K.wrap(b, 800, 452);
    const ringPath = K.el('ellipse', { rx: 250, ry: 300, fill: 'none', stroke: C.clay, 'stroke-width': 7, 'stroke-dasharray': '30 22', 'stroke-linecap': 'round', opacity: .9 }, orbit);
    draw(ringPath, at('chronic') - .1, .7);
    tl.to(ringPath, { rotation: 140, svgOrigin: '0 0', duration: t1 - at('chronic') + .3, ease: 'none' }, at('chronic'));
    tl.to(aura, { attr: { opacity: 1 }, duration: .6 }, at('chronic'));
    loop(aura, at('chronic') + .6, t1, { scale: 1.12, transformOrigin: '50% 50%' }, 1.1);
    face(k.p, at('illness'), 'worried');
    callout('chronic illness', at('chronic'), { tone: 'clay', hold: 1.0 });
  }

  /* 4 · It took six years to figure out. */
  {
    const t0 = at('took'), t1 = at('i wonder');
    const b = beat(t0, t1, { mood: 'worry' });
    const six = at('six'), yrs = end('years');
    const cals = [];
    for (let i = 0; i < 6; i++) {
      const c = K.wrap(b, 360 + i * 176, 610 - Math.sin(i / 5 * Math.PI) * 50, .82);
      const cal = K.calendar(c, { label: String(i + 1) });
      cals.push(c);
      pop(c, six - .15 + i * ((yrs - six + .35) / 6), { origin: '50% 100%', y: 30 });
    }
    const big = K.text(b, '1', 800, 380, 170, C.gold, { 'font-family': "'Source Serif 4', Georgia, serif", 'font-weight': 700 });
    const lbl = K.text(b, 'years', 800, 440, 48, C.paper, { 'font-weight': 600, opacity: .9 });
    pop(big, six, { origin: '50% 100%' }); pop(lbl, six + .1, { origin: '50% 50%' });
    count(big, six, 1, 6, yrs - six + .25);
    const glass = K.wrap(b, 1330, 420, .6); K.hourglass(glass);
    pop(glass, t0, { origin: '50% 50%' });
    tl.to(glass, { rotation: 180, duration: .8, ease: 'power3.inOut', transformOrigin: '50% 50%' }, yrs);
    // "Figure out": the missing piece is found.
    const fig = at('figure');
    const piece = K.wrap(b, 330, 330); K.puzzle(piece, C.gold);
    const mag = K.wrap(b, 470, 300, .9); K.magnifier(mag);
    pop(mag, fig - .2, { origin: '50% 50%' });
    tl.to(mag, { x: -110, y: 10, duration: .5, ease: 'power2.inOut' }, fig);
    pop(piece, fig + .35, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 330, 330, fig + .45, { color: C.gold });
    callout('figure out', fig, { hold: .9 });
  }

  /* 5 · I wonder how my life would have been impacted positively. */
  {
    const t0 = at('i wonder'), t1 = at('able');
    const b = beat(t0, t1, { mood: 'hope' });
    const k = who(S, b, 470, 720, { ...KAMILLE, mood: 'flat' }, 1.05);
    rise(k, t0, { y: 30 });
    breathe(S, k, t0, t1, 3);
    S.reach(k.p, 'r', t0 + .3, -60);
    const bub = K.wrap(b, 960, 360); const th = K.thought(bub, { w: 560, h: 340 });
    pop(bub, at('wonder') + .1, { origin: '20% 90%', from: .2, ease: 'back.out(1.6)' });
    // Inside the thought: a brighter life — a sunrise over home.
    const inner = th.inner;
    const clip = K.el('clipPath', { id: K.id('thought') }, inner); K.el('ellipse', { rx: 270, ry: 160 }, clip);
    const scene = K.g(inner, { 'clip-path': `url(#${clip.id})` });
    K.el('rect', { x: -280, y: -170, width: 560, height: 340, fill: '#dbe9d6' }, scene);
    const sunG = K.wrap(scene, 0, 120, .9); K.sun(sunG);
    K.el('path', { d: 'M-290 120 q140 -70 290 -30 q150 40 290 -10 v120 h-580z', fill: C.moss }, scene);
    const h = K.wrap(scene, -120, 120, .62); K.house(h, { color: C.clay });
    const mini = K.wrap(scene, 110, 124, .44); K.person(mini, { ...KAMILLE, mood: 'grin' });
    tl.fromTo(sunG, { y: 120 }, { y: -10, duration: 1.6, ease: 'power2.out', immediateRender: true }, at('impacted'));
    spin(sunG.querySelector('.sun').rays, at('impacted'), t1, .15);
    const plus = K.wrap(b, 1300, 200);
    K.el('circle', { r: 46, fill: C.gold }, plus); K.el('path', { d: 'M-20 0 H20 M0 -20 V20', stroke: C.deep, 'stroke-width': 10, 'stroke-linecap': 'round' }, plus);
    pop(plus, at('positively'), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 1300, 200, at('positively') + .1);
    face(k.p, at('positively'), 'smile');
    callout('positively', at('positively'), { hold: 1.3 });
  }

  /* 6 · …able to use AI to get a quicker medical diagnosis. */
  {
    const t0 = at('able'), t1 = D;
    const b = beat(t0, t1, { mood: 'hope' });
    const road = K.g(b);
    const cals = [];
    for (let i = 0; i < 6; i++) { const c = K.wrap(road, 330 + i * 120, 600, .55); K.calendar(c, { label: String(i + 1) }); cals.push(c); }
    cals.forEach((c, i) => pop(c, t0 + i * .05, { origin: '50% 100%' }));
    const ai = K.wrap(b, 800, 330, .95); K.chip(ai);
    pop(ai, at('ai', 2) - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    const q = at('quicker', 2);
    // Six years fold into one.
    cals.forEach((c, i) => { tl.to(c, { x: -i * 120 / .55, duration: .6, ease: 'expo.inOut' }, q); if (i > 0) tl.to(c, { autoAlpha: 0, duration: .3 }, q + .35); });
    const speed = K.g(b);
    for (let i = 0; i < 4; i++) K.el('path', { d: `M${470 + i * 30} ${560 + i * 22} h${150 - i * 22}`, stroke: C.gold, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, speed);
    [...speed.children].forEach((l, i) => draw(l, q + .05 + i * .05, .3, 'power3.out'));
    tl.to(speed, { autoAlpha: 0, duration: .4 }, q + .7);
    callout('quicker', q, { hold: .8 });
    const ok = K.wrap(b, 1010, 520, 1.1); K.check(ok);
    pop(ok, at('diagnosis', 2), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 1010, 520, at('diagnosis', 2) + .1, { color: C.mint });
    const k = who(S, b, 1240, 720, { ...KAMILLE, mood: 'smile' }, .9);
    rise(k, t0 + .2, { y: 30 });
    breathe(S, k, t0, t1, 3);
    ask(S, b, 1240, 250, end('diagnosis', 2) - .2, t1 + 2, { r: 36 });
  }
}
