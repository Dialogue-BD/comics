import { badge, who, breathe, ask, free, whoFree } from './_shared.js';

/* Sarah — Support.
   "My youngest has autism. He's 13, but as he becomes an adult, what kind of
    AI technology can assist him to live an independent life? What can that do
    for him so that he can be as independent as possible as he grows? So I'm
    thinking about kids with special needs. Can AI help me be a better teacher,
    better mom, better wife?"
   Her son is shown simply as himself — no symbols or stereotypes for autism. */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const SARAH = { tone: K.SKIN[1], hair: 'long', hairColor: K.HAIR.brown, top: C.mint, bottom: '#3b3a4a' };
  const SON = { tone: K.SKIN[1], hair: 'short', hairColor: K.HAIR.brown, top: C.gold, bottom: '#2f3e4a', mood: 'smile' };

  /* 1 · My youngest has autism. He's 13, but as he becomes an adult… */
  {
    const t0 = 0, t1 = at('what');
    const b = beat(t0, t1, { mood: 'calm' });
    const sa = who(S, b, 520, 720, { ...SARAH, mood: 'smile' }, 1.1);
    rise(sa, 0, { y: 30 }); breathe(S, sa, 0, t1);
    reach(sa.p, 'r', .3, -40);
    const son = who(S, b, 760, 720, { ...SON, age: 'teen' }, 1);
    rise(son, at('youngest') - .1, { y: 30 });
    const bal = K.wrap(b, 920, 330); const bl = K.balloon(bal, '1', C.sky);
    pop(bal, at('13') - .5, { origin: '50% 100%', y: 60 });
    count(bl.label, at('13') - .4, 1, 13, .6);
    loop(bal, at('13') + .4, t1, { y: -12, rotation: 4 }, 1.4);
    // Growing up: from teenager to adult.
    tl.to(son, { scale: 1.2, duration: 1.0, ease: 'power2.inOut', transformOrigin: '50% 100%' }, at('becomes') - .1);
    tl.to(son, { x: 140, duration: 1.0, ease: 'power2.inOut' }, at('becomes') - .1);
    tl.to(bal, { autoAlpha: 0, duration: .4 }, at('becomes'));
    const arrow = K.el('path', { d: 'M1110 690 V360 l-22 30 M1110 360 l22 30', stroke: C.gold, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    draw(arrow, at('becomes'), .8, 'expo.out');
    callout('autism', at('autism'), { hold: .8, small: true, tone: 'mint' });
    callout('adult', at('adult'), { hold: .55 });
  }

  /* 2 · …what kind of AI technology can assist him to live an independent life? */
  {
    const t0 = at('what'), t1 = at('what', 2);
    const b = beat(t0, t1, { mood: 'wonder' });
    const son = who(S, b, 560, 720, SON, 1.2);
    rise(son, t0, { y: 30 }); breathe(S, son, t0, t1);
    const tools = [
      [400, 300, i => K.place(K.phone(i, { glow: false }), 0, 0, .7)],
      [560, 220, i => K.place(K.calendar(i, { label: '' }), 0, 0, .55)],
      [720, 300, i => { K.el('path', { d: 'M0 34 C-30 0 -30 -34 0 -34 C30 -34 30 0 0 34Z', fill: C.clay }, i); K.el('circle', { cy: -12, r: 10, fill: C.cream }, i); }]
    ];
    const cards = tools.map(([x, y, d]) => badge(S, b, x, y, d, { r: 52 }));
    cards.forEach((c, i) => pop(c, at('technology') - .2 + i * .14, { origin: '50% 50%' }));
    const ai = K.wrap(b, 560, 110, .45); K.chip(ai);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    const as = at('assist');
    cards.forEach((c, i) => { tl.to(c.glow, { attr: { opacity: 1 }, duration: .4 }, as + i * .1); tl.to(c.ring, { attr: { stroke: C.mint }, duration: .4 }, as + i * .1); });
    // An independent life: his own home, his own key.
    const hm = K.wrap(b, 1080, 712, 1.25); const h = K.house(hm, { color: C.gold });
    rise(hm, at('live') - .3, { y: 40 });
    const ky = K.wrap(b, 880, 470, .8); K.key(ky);
    pop(ky, at('independent') - .2, { origin: '50% 50%', rot: -30 });
    tl.to(ky, { x: 160, y: 160, rotation: 90, scale: .5, autoAlpha: 0, duration: .7, ease: 'power3.in' }, at('life') - .1);
    tl.to(son, { x: 420, duration: 1.0, ease: 'power2.inOut' }, at('life'));
    burst(b, 1080, 560, at('life') + .5, { color: C.gold });
    callout('assist', as, { hold: .9 });
    callout('independent', at('independent'), { hold: 1.0 });
  }

  /* 3 · …as independent as possible as he grows. */
  {
    const t0 = at('what', 2), t1 = at('so i');
    const b = beat(t0, t1, { mood: 'hope' });
    const stairs = [0, 1, 2, 3].map(i => { const s = K.el('rect', { x: 420 + i * 200, y: 720 - (i + 1) * 70, width: 200, height: (i + 1) * 70, rx: 8, fill: '#2b5a3f', stroke: '#4f8a64', 'stroke-width': 3 }, b); return s; });
    stairs.forEach((s, i) => rise(s, t0 + i * .08, { y: 30 }));
    const rail = K.el('path', { d: 'M440 560 L640 490 L840 420 L1040 350 L1180 300', stroke: C.mint, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, b);
    draw(rail, t0 + .4, .8);
    const posts = [440, 640, 840, 1040].map((x, i) => K.el('path', { d: `M${x + 20} ${650 - i * 70} V${560 - i * 70}`, stroke: C.mint, 'stroke-width': 6 }, b));
    posts.forEach((p, i) => draw(p, t0 + .3 + i * .08, .3));
    const son = whoFree(S, b, SON, .85);
    const stepT = [at('do'), at('him', 2), at('independent', 2) - .4, at('possible') - .2];
    tl.set(son, { x: 520, y: 650 }, 0);
    stepT.forEach((t, i) => tl.to(son, { x: 520 + i * 200, y: 650 - i * 70, duration: .5, ease: 'power2.out' }, t));
    // Supports fall away: he stands on his own.
    tl.to([rail, ...posts], { autoAlpha: 0, y: 40, duration: .6, stagger: .05 }, at('possible') + .1);
    face(son.p, at('grows') - .2, 'grin');
    const st = K.wrap(b, 1120, 280); K.star(st, C.gold, 40);
    pop(st, at('grows'), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 1120, 280, at('grows') + .1, { color: C.gold });
    callout('independent', at('independent', 2), { hold: .6 });
    callout('possible', at('possible'), { hold: .9 });
  }

  /* 4 · So I'm thinking about kids with special needs. */
  {
    const t0 = at('so i'), t1 = at('can ai');
    const b = beat(t0, t1, { mood: 'warm' });
    const kids = [
      { tone: K.SKIN[3], hair: 'curly', hairColor: K.HAIR.black, top: C.gold, age: 'child', mood: 'grin' },
      { tone: K.SKIN[0], hair: 'ponytail', hairColor: K.HAIR.blond, top: C.sky, age: 'child', mood: 'smile' },
      { tone: K.SKIN[2], hair: 'short', hairColor: K.HAIR.black, top: C.rose, age: 'child', mood: 'grin' }
    ];
    const xs = [520, 700, 1060];
    kids.forEach((k, i) => { const w = who(S, b, xs[i], 720, k, 1.15); rise(w, at('kids') - .3 + i * .12, { y: 30 }); breathe(S, w, t0, t1, 3, 1.8 + i * .2); });
    const wc = K.wrap(b, 880, 720, .8); K.wheelchair(wc);
    const rider = K.wrap(wc, -4, 26, .72); K.person(rider, { tone: K.SKIN[4], top: C.mint, hair: 'bun', hairColor: K.HAIR.black, age: 'adult', mood: 'grin', seated: true });
    wc.append(wc.querySelector('.wheelchair'));
    rise(wc, at('kids') + .1, { y: 30 });
    const hearts = [[600, 300], [800, 240], [1000, 300]].map(([x, y], i) => { const h = K.wrap(b, x, y, .5); K.heart(h, [C.clay, C.rose, C.gold][i]); pop(h, at('special') + i * .12, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }); return h; });
    callout('special needs', at('special'), { hold: 1.1 });
  }

  /* 5 · Can AI help me be a better teacher, better mom, better wife? */
  {
    const t0 = at('can ai'), t1 = D;
    const b = beat(t0, t1, { mood: 'warm' });
    const sa = who(S, b, 420, 720, { ...SARAH, mood: 'smile' }, 1.15);
    rise(sa, t0, { y: 30 }); breathe(S, sa, t0, t1);
    const ai = K.wrap(b, 420, 240, .5); K.chip(ai);
    pop(ai, at('ai', 2) - .1, { origin: '50% 50%' });
    const roles = [
      ['teacher', 720, i => { K.el('rect', { x: -44, y: -34, width: 88, height: 60, rx: 6, fill: C.mossDeep }, i); K.el('path', { d: 'M-30 -14 h40 M-30 4 h56', stroke: C.cream, 'stroke-width': 5, 'stroke-linecap': 'round' }, i); }],
      ['mom', 960, i => { K.place(K.person(i, { ...SARAH, mood: 'grin' }), -16, 58, .3); K.place(K.person(i, { ...SON, age: 'child', mood: 'grin' }), 24, 58, .3); }],
      ['wife', 1200, i => { K.el('circle', { cx: -14, cy: 0, r: 24, fill: 'none', stroke: C.goldDeep, 'stroke-width': 9 }, i); K.el('circle', { cx: 14, cy: 0, r: 24, fill: 'none', stroke: C.gold, 'stroke-width': 9 }, i); }]
    ];
    roles.forEach(([w, x, d], i) => {
      const t = at(w);
      const bd = badge(S, b, x, 430, d, { r: 82 });
      pop(bd, t - .3, { origin: '50% 50%', from: .2, ease: 'back.out(2)' });
      tl.to(bd.glow, { attr: { opacity: 1 }, duration: .4 }, t);
      const up = K.wrap(b, x + 70, 340); K.el('circle', { r: 26, fill: C.gold }, up); K.el('path', { d: 'M0 12 V-12 M-10 -2 L0 -12 L10 -2', stroke: C.deep, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, up);
      pop(up, at('better', i + 1), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
      callout(w, t, { hold: i === 2 ? 1 : .6, small: true });
    });
    face(sa.p, at('wife'), 'grin');
    ask(S, b, 960, 220, end('wife') - .2, t1 + 1, { r: 32 });
  }
}
