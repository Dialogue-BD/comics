import { badge, who, breathe, ask } from './_shared.js';

/* Daniel — Work.
   "Where do humans get replaced and what roles should they be replaced on?
    Where it gets personal for me is identifying what parts of what I do need
    to stay human. My daughter just finished her junior year. She wants to do
    her PhD in physics. At what point does AI get good enough to make her job
    in research obsolete? Can AI eliminate a lot of tedious jobs that nobody
    really wants to do?" */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const DANIEL = { tone: K.SKIN[0], hair: 'short', hairColor: K.HAIR.brown, glasses: true, top: C.sky, bottom: '#34404a' };
  const DAUGHTER = { tone: K.SKIN[0], hair: 'ponytail', hairColor: K.HAIR.brown, top: C.clay, bottom: '#2f3e4a', age: 'teen' };
  const WORKERS = [
    { tone: K.SKIN[2], hair: 'bun', hairColor: K.HAIR.black, top: C.moss },
    { tone: K.SKIN[4], hair: 'short', hairColor: K.HAIR.black, top: C.gold },
    { tone: K.SKIN[1], hair: 'long', hairColor: K.HAIR.auburn, top: C.rose }
  ];

  /* 1 · Where do humans get replaced, and what roles…? */
  {
    const t0 = 0, t1 = at('where', 2);
    const b = beat(t0, t1, { mood: 'worry' });
    const xs = [480, 800, 1120];
    const people = xs.map((x, i) => { const w = who(S, b, x, 720, WORKERS[i], 1); rise(w, at('humans') - .2 + i * .12, { y: 30 }); breathe(S, w, t0, t1, 3, 2 + i * .3); return w; });
    // The middle worker turns into a chip: "replaced".
    const swap = K.wrap(b, 800, 560, .9); K.chip(swap);
    const rep = at('replaced');
    tl.to(people[1], { scaleX: 0, duration: .25, ease: 'power2.in', transformOrigin: '50% 100%' }, rep);
    tl.fromTo(swap, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: .35, ease: 'back.out(2)', transformOrigin: '50% 50%', immediateRender: true }, rep + .25);
    // Roles float above heads as cards, and get shuffled.
    const icons = [i => K.place(K.doc(i, { mark: 'chart', w: 54, h: 70, lines: 2 }), 0, 0), i => K.place(K.book(i, C.sky), 0, 0, .55), i => K.place(K.heart(i, C.clay), 0, 6, .6)];
    const cards = xs.map((x, i) => badge(S, b, x, 270, icons[i], { r: 54 }));
    cards.forEach((c, i) => pop(c, at('roles') - .15 + i * .1, { origin: '50% 50%' }));
    tl.to(cards[0], { x: 640, duration: .6, ease: 'power3.inOut' }, at('replaced', 2) - .1);
    tl.to(cards[2], { x: -640, duration: .6, ease: 'power3.inOut' }, at('replaced', 2) - .1);
    tl.to(people[2], { scaleX: 0, duration: .25, ease: 'power2.in', transformOrigin: '50% 100%' }, at('replaced', 2) + .2);
    const swap2 = K.wrap(b, 1120, 560, .9); K.chip(swap2);
    tl.fromTo(swap2, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: .35, ease: 'back.out(2)', transformOrigin: '50% 50%', immediateRender: true }, at('replaced', 2) + .45);
    callout('replaced', rep, { tone: 'clay', hold: 1.1 });
    callout('roles', at('roles'), { hold: .8 });
    ask(S, b, 800, 150, at('on') - .1, t1, { r: 34 });
  }

  /* 2 · …identifying what parts of what I do need to stay human. */
  {
    const t0 = at('where', 2), t1 = at('my daughter');
    const b = beat(t0, t1, { mood: 'calm' });
    const d = who(S, b, 430, 720, DANIEL, 1.1);
    rise(d, t0, { y: 30 }); breathe(S, d, t0, t1);
    const tasks = [
      [780, 280, i => K.place(K.doc(i, { mark: 'chart', w: 60, h: 76, lines: 2 }), 0, 0), 'ai'],
      [1000, 220, i => { K.el('rect', { x: -28, y: -36, width: 56, height: 72, rx: 8, fill: C.ink }, i); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) K.el('rect', { x: -20 + c * 15, y: -12 + r * 15, width: 10, height: 10, rx: 2, fill: c === 2 ? C.gold : C.mist }, i); K.el('rect', { x: -20, y: -28, width: 40, height: 12, rx: 2, fill: C.mint }, i); }, 'ai'],
      [1220, 300, i => { K.place(K.person(i, { tone: K.SKIN[3], top: C.gold, mood: 'smile' }), -14, 54, .28); K.place(K.person(i, { tone: K.SKIN[0], top: C.sky, hair: 'short', glasses: true, mood: 'smile' }), 16, 54, .28); }, 'human'],
      [880, 520, i => K.place(K.heart(i, C.clay), 0, 6, .62), 'human'],
      [1140, 560, i => K.place(K.doc(i, { w: 60, h: 76, lines: 3 }), 0, 0), 'ai']
    ];
    const cards = tasks.map(([x, y, draw]) => badge(S, b, x, y, draw, { r: 64 }));
    cards.forEach((c, i) => pop(c, at('personal') - .1 + i * .12, { origin: '50% 50%' }));
    const mg = K.wrap(b, 700, 420, .9); K.magnifier(mg);
    const id0 = at('identifying');
    pop(mg, id0 - .1, { origin: '50% 50%' });
    tl.to(mg, { motionPath: { path: [{ x: 80, y: -130 }, { x: 300, y: -200 }, { x: 520, y: -110 }, { x: 440, y: 140 }, { x: 180, y: 100 }], curviness: 1.4 }, duration: 2.6, ease: 'sine.inOut' }, id0);
    tl.to(mg, { autoAlpha: 0, duration: .3 }, id0 + 2.8);
    // Human parts glow gold and come to Daniel; the rest go to a chip.
    const stay = at('stay');
    const ai = K.wrap(b, 1330, 560, .7); K.chip(ai);
    pop(ai, at('need') - .1, { origin: '50% 50%' });
    tasks.forEach(([x, y, , kind], i) => {
      const c = cards[i];
      if (kind === 'human') {
        tl.to(c.glow, { attr: { opacity: 1 }, duration: .4 }, stay - .2);
        tl.to(c, { x: 650 - x + (i === 2 ? -40 : 60), y: 330 - y + (i === 2 ? -120 : 30), scale: .85, duration: .9, ease: 'expo.inOut' }, stay);
      } else {
        tl.to(c.ring, { attr: { stroke: C.mint }, duration: .3 }, stay - .2);
        tl.to(c, { x: 1330 - x, y: 560 - y, scale: .2, autoAlpha: 0, duration: .8, ease: 'power3.in' }, stay + .1 + i * .05);
      }
    });
    face(d.p, stay + .4, 'grin');
    callout('personal', at('personal'), { hold: 1.0 });
    callout('identifying', id0, { hold: 1.4 });
    callout('human', at('human', 2), { hold: 1.0, tone: 'gold', small: true });
  }

  /* 3 · My daughter just finished her junior year. She wants to do her PhD in physics. */
  {
    const t0 = at('my daughter'), t1 = at('at what');
    const b = beat(t0, t1, { mood: 'hope' });
    const dg = who(S, b, 470, 720, DAUGHTER, 1.15);
    rise(dg, t0, { y: 30 }); breathe(S, dg, t0, t1); wave(dg.p, t0 + .3, 1);
    // Four years of university; three are done.
    const steps = [0, 1, 2, 3].map(i => { const s = K.wrap(b, 720 + i * 120, 690 - i * 50); K.el('rect', { x: -52, y: -20, width: 104, height: 40 + i * 50, rx: 10, fill: '#2b5a3f', stroke: '#4f8a64', 'stroke-width': 3 }, s); return s; });
    steps.forEach((s, i) => rise(s, at('finished') - .2 + i * .08, { y: 30 }));
    const lights = [0, 1, 2].map(i => { const l = K.wrap(b, 720 + i * 120, 690 - i * 50); K.el('rect', { x: -52, y: -20, width: 104, height: 12, rx: 6, fill: C.gold }, l); return l; });
    lights.forEach((l, i) => pop(l, at('junior') - .1 + i * .14, { origin: '50% 50%', from: .1 }));
    const yr = K.text(b, '3', 960, 540, 64, C.gold, { 'font-family': "'Source Serif 4', Georgia, serif" });
    pop(yr, at('year'), { origin: '50% 100%' });
    const cap = K.wrap(b, 1080, 390, .8); K.gradCap(cap);
    pop(cap, at('phd') - .1, { origin: '50% 50%', rot: -18 });
    const at0 = K.wrap(b, 1220, 300, .95); const atm = K.atom(at0);
    pop(at0, at('physics') - .25, { origin: '50% 50%', from: .1, ease: 'expo.out' });
    tl.to(atm.orbits, { rotation: 300, duration: t1 - at('physics') + .5, ease: 'none', svgOrigin: '0 0' }, at('physics') - .2);
    callout('daughter', at('daughter'), { hold: 1.0 });
    callout('physics', at('physics'), { hold: .75, tone: 'mint' });
  }

  /* 4 · At what point does AI get good enough to make her job in research obsolete? */
  {
    const t0 = at('at what'), t1 = at('can ai');
    const b = beat(t0, t1, { mood: 'wonder' });
    const lab = K.g(b);
    const dg = who(S, lab, 430, 720, DAUGHTER, 1.05);
    const fl = K.wrap(lab, 640, 610, .8); K.flask(fl, C.mint);
    const ao = K.wrap(lab, 640, 330, .62); const atm = K.atom(ao);
    rise(dg, t0, { y: 30 }); pop(fl, t0 + .1); pop(ao, t0 + .2, { origin: '50% 50%' });
    tl.to(atm.orbits, { rotation: 200, duration: t1 - t0, ease: 'none', svgOrigin: '0 0' }, t0);
    // A gauge: how good is AI getting?
    const gauge = K.g(b);
    K.el('rect', { x: 1040, y: 200, width: 60, height: 500, rx: 30, fill: '#0b2716', stroke: C.mist, 'stroke-width': 4, opacity: .9 }, gauge);
    const fill = K.el('rect', { x: 1048, y: 208, width: 44, height: 484, rx: 22, fill: C.mint }, gauge);
    const line = K.el('path', { d: 'M990 330 H1030 M1110 330 H1150', stroke: C.gold, 'stroke-width': 5, 'stroke-dasharray': '10 10', fill: 'none' }, gauge);
    K.text(gauge, 'enough', 1150, 312, 30, C.gold, { 'text-anchor': 'end', 'font-weight': 600 });
    rise(gauge, t0 + .1, { y: 30 });
    tl.fromTo(fill, { scaleY: .05 }, { scaleY: .78, svgOrigin: '1070 692', duration: at('enough') - at('good') + 1.2, ease: 'power2.inOut', immediateRender: true }, at('good') - .4);
    const ai = K.wrap(b, 1260, 450, .75); K.chip(ai);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    // Obsolete: her research goes grey and dusty.
    const ob = at('obsolete');
    const veil = K.el('rect', { x: 300, y: 200, width: 460, height: 540, rx: 40, fill: '#3f4a43', opacity: 0 }, b);
    tl.to(veil, { attr: { opacity: .62 }, duration: .7 }, ob);
    face(dg.p, ob, 'worried');
    callout('obsolete', ob, { tone: 'clay', hold: 1.0 });
    callout('research', at('research'), { small: true, hold: .4 });
    ask(S, b, 640, 170, ob + .4, t1, { r: 36 });
  }

  /* 5 · Can AI eliminate a lot of tedious jobs that nobody really wants to do? */
  {
    const t0 = at('can ai'), t1 = D;
    const b = beat(t0, t1, { mood: 'hope' });
    const stack = K.wrap(b, 760, 690, 1.25); const st = K.paperStack(stack, 14);
    rise(stack, t0, { y: 30 });
    const w = who(S, b, 450, 720, { ...WORKERS[1], mood: 'flat' }, 1.05);
    rise(w, t0, { y: 30 });
    const sp = K.wrap(b, 600, 420, .8); K.stamp(sp);
    pop(sp, t0 + .2);
    tl.to(sp, { y: 40, duration: .16, repeat: 9, yoyo: true, ease: 'power2.in' }, t0 + .5);
    tl.to(w.p.parts.head, { rotation: -10, duration: .5, repeat: 3, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%' }, at('tedious') - .3);
    const ai = K.wrap(b, 1210, 380, .95); K.chip(ai);
    const el0 = at('eliminate');
    pop(ai, el0 - .3, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    // The pile flies into the chip, sheet by sheet.
    [...st.sheets].reverse().forEach((sh, i) => {
      tl.to(sh, { x: 360 + i * 2, y: -240 - i * 6, rotation: 18, scale: .4, autoAlpha: 0, duration: .55, ease: 'power2.in', transformOrigin: '50% 50%' }, at('jobs') + i * .12);
    });
    tl.to(sp, { autoAlpha: 0, duration: .3 }, at('jobs'));
    face(w.p, at('nobody'), 'grin');
    wave(w.p, at('nobody') + .2, 2);
    callout('eliminate', el0, { hold: 1.1 });
    callout('tedious', at('tedious'), { tone: 'clay', hold: 1.1 });
    ask(S, b, 1210, 190, at('really') + .5, t1 + 1, { r: 34 });
  }
}
