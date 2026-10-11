import { badge, who, breathe, ask, free, whoFree } from './_shared.js';

/* Tiffany — Fairness.
   "I am hesitant about the technology. We don't want society to become so
    secluded and isolated that we forget that this is my fellow brother and
    sister of humanity. What's being done to ensure an equal footing to all
    individuals, someone with a disability, the elderly, the underserved?" */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const TIFFANY = { tone: K.SKIN[4], hair: 'curly', hairColor: K.HAIR.black, top: C.rose, bottom: '#3b3a4a' };
  const CROWD = [
    { tone: K.SKIN[1], hair: 'short', hairColor: K.HAIR.brown, top: C.sky },
    { tone: K.SKIN[3], hair: 'scarf', hairColor: C.clay, top: C.gold },
    { tone: K.SKIN[4], hair: 'curly', hairColor: K.HAIR.black, top: C.rose },
    { tone: K.SKIN[0], hair: 'long', hairColor: K.HAIR.blond, top: C.moss },
    { tone: K.SKIN[2], hair: 'short', hairColor: K.HAIR.black, top: C.mint }
  ];

  /* 1 · I am hesitant about the technology. */
  {
    const t0 = 0, t1 = at('we');
    const b = beat(t0, t1, { mood: 'calm' });
    const tf = who(S, b, 560, 720, { ...TIFFANY, mood: 'flat' }, 1.15);
    rise(tf, 0, { y: 30 }); breathe(S, tf, 0, t1);
    const h = at('hesitant');
    tl.to(tf, { x: -60, rotation: -4, duration: .7, ease: 'power2.out', transformOrigin: '50% 100%' }, h);
    reach(tf.p, 'r', h, -110, .4);
    face(tf.p, h + .1, 'worried');
    const tech = K.g(b);
    const ph = K.wrap(tech, 960, 380, 1.2); K.phone(ph);
    const lp = K.wrap(tech, 1180, 560, .9); K.laptop(lp);
    const ai = K.wrap(tech, 1200, 270, .6); K.chip(ai);
    [ph, lp, ai].forEach((n, i) => pop(n, at('technology') - .4 + i * .14, { origin: '50% 50%' }));
    loop(ph, at('technology'), t1, { y: -12 }, 1.2);
    callout('hesitant', h, { hold: 1.4 });
    callout('technology', at('technology'), { hold: .8, small: true, tone: 'mint' });
  }

  /* 2 · …society secluded and isolated, so that we forget… */
  {
    const t0 = at('we'), t1 = at('this is') - .3;
    const b = beat(t0, t1, { mood: 'worry' });
    const spots = [[520, 520], [800, 460], [1080, 520], [660, 700], [940, 700]];
    const lines = K.g(b);
    const links = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [1, 4], [1, 3]].map(([a, c]) => K.el('path', { d: `M${spots[a][0]} ${spots[a][1] - 120} L${spots[c][0]} ${spots[c][1] - 120}`, stroke: C.gold, 'stroke-width': 4, fill: 'none', opacity: .8 }, lines));
    const people = spots.map(([x, y], i) => { const w = who(S, b, x, y, { ...CROWD[i], mood: 'smile' }, .65); pop(w, at('society') - .3 + i * .08, { y: 20 }); return w; });
    links.forEach((l, i) => draw(l, at('society') + i * .05, .4));
    const sec = at('secluded');
    const bubbles = spots.map(([x, y], i) => { const bw = K.wrap(b, x, y - 100); K.bubble(bw, { r: 118, color: C.sky }); pop(bw, sec - .1 + i * .07, { origin: '50% 50%', from: .3, ease: 'back.out(1.5)' }); return bw; });
    const iso = at('isolated');
    const out = [[-140, -40], [0, -120], [140, -40], [-170, 60], [170, 60]];
    people.forEach((n, i) => tl.to(n, { x: out[i][0] / .65, y: out[i][1] / .65, duration: 1.2, ease: 'power2.inOut' }, iso - .2));
    bubbles.forEach((n, i) => tl.to(n, { x: out[i][0], y: out[i][1], duration: 1.2, ease: 'power2.inOut' }, iso - .2));
    tl.to(lines, { autoAlpha: 0, duration: .5 }, iso - .2);
    people.forEach((p, i) => {
      const ph = K.wrap(p, 30, -150, .6); K.phone(ph, { glow: true }); pop(ph, iso + i * .05, { origin: '50% 50%' });
      face(p.p, at('forget'), 'flat');
    });
    callout('society', at('society'), { hold: 1.2 });
    callout('isolated', iso, { tone: 'clay', hold: .9 });
    callout('forget', at('forget'), { tone: 'clay', hold: .7, small: true });
  }

  /* 3 · …my fellow brother and sister of humanity. */
  {
    const t0 = at('this is') - .3, t1 = at("what's");
    const b = beat(t0, t1, { mood: 'warm' });
    const gw = K.wrap(b, 800, 380, 1.3); K.globe(gw); gw.setAttribute('opacity', .55);
    S.fade(gw, t0, { to: .55 });
    const row = [380, 590, 800, 1010, 1220];
    const people = row.map((x, i) => { const w = who(S, b, x, 720, { ...CROWD[i], mood: 'grin' }, .92); return w; });
    people.forEach((p, i) => tl.fromTo(p, { x: (i - 2) * 140, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', immediateRender: true }, at('fellow') - .5 + Math.abs(i - 2) * .1));
    people.forEach((p, i) => { if (i > 0) S.reach(p.p, 'l', at('brother'), 55); if (i < 4) S.reach(p.p, 'r', at('brother'), -55); });
    const ht = K.wrap(b, 800, 220, 1); K.heart(ht, C.clay);
    pop(ht, at('humanity') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(b, 800, 220, at('humanity'), { color: C.rose, n: 12, r1: 220 });
    loop(ht, at('humanity') + .6, t1, { scale: 1.1, transformOrigin: '50% 50%' }, .8);
    callout('humanity', at('humanity'), { hold: 1.0 });
  }

  /* 4 · What's being done to ensure an equal footing to all individuals…? */
  {
    const t0 = at("what's"), t1 = D;
    const b = beat(t0, t1, { mood: 'wonder', spot: [800, 520, 380] });
    // Uneven blocks level out into one shared floor.
    const heights = [60, 200, 120, 260, 40];
    const blocks = heights.map((h, i) => { const bl = K.el('rect', { x: 330 + i * 190, y: 600, width: 180, height: 120, rx: 10, fill: '#2b5a3f', stroke: '#4f8a64', 'stroke-width': 3 }, b); return bl; });
    blocks.forEach((bl, i) => tl.fromTo(bl, { attr: { y: 720, height: 0 } }, { attr: { y: 720 - heights[i], height: heights[i] }, duration: .6, ease: 'expo.out', immediateRender: true }, t0 + .1 + i * .08));
    const eq = at('equal');
    blocks.forEach(bl => tl.to(bl, { attr: { y: 640, height: 80 }, duration: .8, ease: 'elastic.out(1, .6)' }, eq));
    const top = K.el('rect', { x: 330, y: 632, width: 940, height: 12, rx: 6, fill: C.gold }, b);
    tl.fromTo(top, { scaleX: 0 }, { scaleX: 1, svgOrigin: '800 638', duration: .6, ease: 'expo.out', immediateRender: true }, eq + .5);
    const people = [0, 1].map(i => { const w = who(S, b, 560 + i * 160, 640, CROWD[i], .62); pop(w, at('individuals') - .1 + i * .12, { y: 20 }); return w; });
    // Someone with a disability arrives by ramp.
    const ramp = K.el('path', { d: 'M1270 640 L1420 720 H1270Z', fill: C.mossDeep }, b);
    rise(ramp, at('disability') - .4, { y: 20 });
    const wc = free(S, b, .55); K.wheelchair(wc.content);
    const rider = K.wrap(wc.content, -4, 26, .82); K.person(rider, { tone: K.SKIN[2], top: C.sky, hair: 'short', mood: 'grin', seated: true });
    wc.content.append(wc.content.querySelector('.wheelchair'));
    tl.fromTo(wc, { x: 1460, y: 720, autoAlpha: 0 }, { keyframes: [{ autoAlpha: 1, duration: .1 }, { x: 1300, y: 640, duration: .6, ease: 'none' }, { x: 1060, y: 640, duration: .5, ease: 'power2.out' }], immediateRender: true }, at('disability') - .3);
    // The elderly.
    const el = K.wrap(b, 880, 640, .62); K.person(el, { tone: K.SKIN[1], hair: 'bald', hairColor: K.HAIR.white, top: C.clay, age: 'elder', mood: 'smile' });
    const cn = K.wrap(el, 70, 0); K.cane(cn);
    rise(el, at('elderly') - .15, { y: 20 });
    // The underserved step out of the shadow and into the light.
    const us = K.wrap(b, 400, 640, .62); const usp = K.person(us, { tone: K.SKIN[4], hair: 'scarf', hairColor: C.mossDeep, top: C.gold, mood: 'grin' });
    tl.fromTo(us, { autoAlpha: 0, x: -200 }, { autoAlpha: 1, x: 0, duration: .8, ease: 'expo.out', immediateRender: true }, at('underserved') - .2);
    const sh = K.wrap(b, 400, 560); const shh = K.halo(sh, 160, 'gold');
    S.fade(sh, at('underserved') + .2);
    callout('equal footing', eq, { hold: 1.4 });
    callout('disability', at('disability'), { small: true, hold: .7, tone: 'mint' });
    callout('elderly', at('elderly'), { small: true, hold: .7, tone: 'mint' });
    callout('underserved', at('underserved'), { small: true, hold: 1.0, tone: 'mint' });
    ask(S, b, 800, 250, at('done'), at('equal') - .2, { r: 36 });
  }
}
