import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Tiffany — Fairness.
   "I am hesitant about the technology. We don't want society to become so
    secluded and isolated that we forget that this is my fellow brother and
    sister of humanity. What's being done to ensure an equal footing to all
    individuals, someone with a disability, the elderly, the underserved?" */
export const fullBleed = true;

const TIFFANY = { skin: SKIN.s5, hair: 'curly', hairColor: HAIRC.black, top: '#f0a3a0', outfit: 'blouse', bottom: '#3b3a4a', earrings: true };
const CROWD = [
  { skin: SKIN.s2, hair: 'short', hairColor: HAIRC.brown, top: '#5b8fb8', outfit: 'shirt' },
  { skin: SKIN.s3, hair: 'hijab', hairColor: '#2f7f73', top: '#e7c178', outfit: 'sweater' },
  { skin: SKIN.s5, hair: 'crop', hairColor: HAIRC.black, top: '#d9805f', outfit: 'tee' },
  { skin: SKIN.s1, hair: 'long', hairColor: HAIRC.blond, top: '#8fb27f', outfit: 'blouse' },
  { skin: SKIN.s4, hair: 'bun', hairColor: HAIRC.dark, top: '#9cc7e8', outfit: 'cardigan' }
];

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo, drainTo } = helpers(S);
  const D = S.duration;

  /* 1 · I am hesitant about the technology. */
  {
    const t0 = 0, t1 = at('we');
    const sc = scene(t0, t1, { zoom: [1.04, 1], origin: '700 500' });
    Z.room(sc.back, { ...Z.PAL.home, wall: '#e7d3c3', wallDark: '#d1b9a4', trim: '#b39780' }, { horizon: 700 });
    Z.frame(sc.back, 240, 200, 160, 130, '#8fb27f');
    Z.plant(sc.back, 200, 700, 1);
    const tf = actor(sc.mid, 560, 870, 1.12, { ...TIFFANY, mood: 'flat' }, 'idle');
    life(tf, 0, t1, 1);
    const h = at('hesitant');
    tl.to(tf, { x: -60, duration: .7, ease: 'power2.out' }, h);
    tilt(tl, tf.f, h, -6);
    pose(tl, tf.f, [9, -8, -100, -60], h, .45);
    express(tl, tf.f, h + .1, 'worried');
    // Devices crowd in, glowing.
    const tech = at('technology');
    const devs = [];
    const tv = put(sc.back, 1160, 360, 1); K.el('rect', { x: -230, y: -140, width: 460, height: 270, rx: 12, fill: '#20262c' }, tv); K.el('rect', { x: -214, y: -124, width: 428, height: 238, rx: 6, fill: Z.grad(tv, ['#2f6a8a', '#163a4f']) }, tv); devs.push(tv);
    const spk = put(sc.mid, 1300, 700, 1); K.el('rect', { x: -40, y: -130, width: 80, height: 130, rx: 30, fill: '#3a4652' }, spk); K.el('ellipse', { cx: 0, cy: -130, rx: 40, ry: 10, fill: '#7fe0c4' }, spk); devs.push(spk);
    Z.table(sc.mid, 1300, 860, 220, { top: '#c9a27a', h: 160 });
    const ph = put(sc.front, 880, 420, 1.3); K.phone(ph); devs.push(ph);
    const ai = put(sc.front, 1160, 360, 1); Z.aiCore(ai, 0, 0, .4); devs.push(ai);
    devs.forEach((d, i) => pop(d, tech - .5 + i * .12, { origin: '50% 50%', from: .4 }));
    loop(ph, tech, t1, { y: -14 }, 1.1);
    label('hesitant', h, { x: 560, y: 92, ax: 560, ay: 230, hold: 1.4, parent: sc.front });
    label('technology', tech, { x: 1100, y: 92, ax: 1160, ay: 200, tone: 'mint', hold: .8, size: 38, parent: sc.front });
  }

  /* 2 · …society secluded and isolated, so that we forget… */
  {
    const t0 = at('we'), t1 = at('this is') - .3;
    const sc = scene(t0, t1, { zoom: [1, 1.04], origin: '800 500' });
    Z.street(sc.back, { skyTop: '#a9c9dc', skyBottom: '#efe3cc', curb: 760 });
    const spots = [[300, 800], [560, 780], [800, 800], [1040, 780], [1290, 800]];
    const people = spots.map(([x, y], i) => { const a = actor(sc.mid, x, y, .82, { ...CROWD[i], mood: 'smile' }, i % 2 ? 'wave' : 'reachR'); life(a, t0, t1, i + 2); return a; });
    // Together at first: lines between them.
    const links = K.g(sc.mid);
    for (let i = 0; i < 4; i++) { const l = K.el('path', { d: `M${spots[i][0]} 420 Q${(spots[i][0] + spots[i + 1][0]) / 2} 360 ${spots[i + 1][0]} 420`, stroke: '#e2a64a', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, links); draw(l, at('society') + i * .08, .4); }
    const sec = at('secluded');
    const phones = people.map((p, i) => { pose(tl, p.f, 'hold', sec - .3 + i * .05, .4); const ph = put(p.content, 0, -330, .9); K.phone(ph); pop(ph, sec - .2 + i * .05, { origin: '50% 50%' }); return ph; });
    people.forEach((p, i) => tilt(tl, p.f, sec + i * .05, 12));
    const bubbles = spots.map(([x, y], i) => { const b = put(sc.front, x, y - 250, 1); K.bubble(b, { r: 190, color: '#9cc7e8' }); pop(b, sec + i * .08, { origin: '50% 50%', from: .3, ease: 'back.out(1.5)' }); return b; });
    tl.to(links, { autoAlpha: 0, duration: .4 }, sec);
    const iso = at('isolated');
    const out = [[-80, 0], [-30, 0], [0, 0], [30, 0], [80, 0]];
    [people, bubbles].forEach(set => set.forEach((n, i) => tl.to(n, { x: out[i][0], scale: .9, transformOrigin: '50% 100%', duration: 1.2, ease: 'power2.inOut' }, iso - .2)));
    const drain = Z.drain(sc.front, '#7f8a85', .45);
    sc.front.insertBefore(drain, sc.front.firstChild);
    drainTo(drain, at('forget'), true, .6);
    people.forEach(p => express(tl, p.f, at('forget'), 'calm'));
    label('society', at('society'), { x: 800, y: 92, ax: 800, ay: 380, hold: 1.2, parent: sc.front });
    label('isolated', iso, { x: 800, y: 92, ax: 560, ay: 380, tone: 'clay', hold: .9, parent: sc.front });
    label('forget', at('forget'), { x: 800, y: 92, tone: 'clay', hold: .7, parent: sc.front });
  }

  /* 3 · …my fellow brother and sister of humanity. */
  {
    const t0 = at('this is') - .3, t1 = at("what's");
    const sc = scene(t0, t1, { enter: 'fade', zoom: [1.06, 1], origin: '800 500' });
    Z.sky(sc.back, '#f2a77a', '#fbe0b0');
    const sunG = put(sc.back, 800, 640, 1); Z.sunDisc(sunG, 0, 0, 150, '#ffcf7a');
    tl.fromTo(sunG, { y: 120 }, { y: 0, duration: 3, ease: 'power2.out', immediateRender: true }, t0);
    Z.skyline(sc.back, 690, { color: '#8a6a6a', far: '#b08a7a', lit: '#ffe2ad' });
    K.el('rect', { x: -200, y: 740, width: 2000, height: 300, fill: Z.grad(sc.back, ['#c9a98a', '#a8876a']) }, sc.back);
    const xs = [330, 560, 800, 1040, 1270];
    const people = xs.map((x, i) => { const a = actor(sc.mid, x, 860, .95, { ...CROWD[i], mood: 'grin' }, 'idle'); life(a, t0, t1, i + 8); return a; });
    people.forEach((p, i) => walkIn(p, at('fellow') - .6 + Math.abs(i - 2) * .1, (i - 2) * 120, .8));
    people.forEach((p, i) => pose(tl, p.f, [i > 0 ? 36 : 9, i > 0 ? -6 : -8, i < 4 ? -36 : -9, i < 4 ? 6 : 8], at('brother'), .5));
    const ht = put(sc.front, 800, 230, 1.1); K.heart(ht, '#d9694a');
    pop(ht, at('humanity') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 800, 230, at('humanity'), { color: '#ffd38a', n: 14, r1: 260 });
    loop(ht, at('humanity') + .6, t1, { scale: 1.1, transformOrigin: '50% 50%' }, .8);
    label('humanity', at('humanity'), { x: 800, y: 92, ax: 800, ay: 180, hold: 1.0, parent: sc.front });
  }

  /* 4 · What's being done to ensure an equal footing to all individuals…? */
  {
    const t0 = at("what's"), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.04], origin: '800 520' });
    Z.sky(sc.back, '#9fd3e6', '#f6e9cc');
    Z.cloudSoft(sc.back, 300, 150, .8);
    // A public building with steps up to the door.
    const bld = K.g(sc.back);
    K.el('rect', { x: 340, y: 160, width: 920, height: 460, rx: 6, fill: Z.grad(bld, ['#efe6d4', '#d9ccb4']) }, bld);
    K.el('path', { d: 'M300 170 L800 60 L1300 170Z', fill: '#d8cbb2' }, bld);
    for (let i = 0; i < 6; i++) K.el('rect', { x: 400 + i * 160, y: 200, width: 40, height: 400, rx: 6, fill: '#f7f3ea' }, bld);
    K.el('rect', { x: 720, y: 400, width: 160, height: 220, rx: 4, fill: '#5a4a3a' }, bld);
    K.el('rect', { x: -200, y: 760, width: 2000, height: 300, fill: Z.grad(bld, ['#d8cfbf', '#bfb4a2']) }, bld);
    // Uneven steps…
    const steps = K.g(sc.mid);
    const stepRects = [0, 1, 2, 3].map(i => K.el('rect', { x: 560 - i * 40, y: 620 + i * 36, width: 480 + i * 80, height: 40, rx: 4, fill: i % 2 ? '#d8cbb2' : '#e6dcc8' }, steps));
    // …and the ramp that gives everyone an equal footing.
    const ramp = K.el('path', { d: 'M1040 620 L1440 760 L1040 760Z', fill: '#c9d6c3', stroke: '#8fa58a', 'stroke-width': 4 }, sc.mid);
    const rail = K.el('path', { d: 'M1040 560 L1440 700', stroke: '#5a6a5a', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, sc.mid);
    const eq = at('equal');
    tl.fromTo(ramp, { scaleX: 0 }, { scaleX: 1, svgOrigin: '1040 700', duration: .7, ease: 'expo.out', immediateRender: true }, eq - .1);
    draw(rail, eq + .3, .5);
    const o = Z.orb(sc.front, 800, 300, .8); pop(o.inner, at('done'), { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    tl.to(o, { autoAlpha: 0, duration: .3 }, eq);
    // People arrive.
    const ind = at('individuals');
    [0, 3].forEach((k, i) => { const a = actor(sc.mid, 650 + i * 260, 620, .62, { ...CROWD[k], mood: 'grin' }, 'idle'); walkIn(a, ind - .2 + i * .15, i ? 200 : -200, .7); });
    const wc = put(sc.front, 0, 0, 1); const wcc = K.g(wc); wcc.setAttribute('transform', 'scale(.6)'); const wch = K.wheelchair(wcc);
    const rider = actor(wcc, -4, 26, .82, { skin: SKIN.s3, hair: 'short', hairColor: HAIRC.black, top: '#9cc7e8', outfit: 'shirt', mood: 'grin', seated: true });
    wcc.append(wch);
    tl.fromTo(wc, { x: 1560, y: 760, autoAlpha: 0 }, { keyframes: [{ autoAlpha: 1, duration: .1 }, { x: 1440, y: 760, duration: .3, ease: 'none' }, { x: 1060, y: 622, duration: .8, ease: 'power1.inOut' }, { x: 960, y: 622, duration: .3, ease: 'power2.out' }], immediateRender: true }, at('disability') - .4);
    const el = actor(sc.mid, 760, 620, .6, { skin: SKIN.s2, hair: 'bald', hairColor: HAIRC.white, top: '#d9805f', outfit: 'cardigan', age: 'elder', mood: 'smile' }, [9, -8, -24, -10]);
    const cn = put(el.content, 110, 0, 1); K.cane(cn);
    walkIn(el, at('elderly') - .3, -260, .8);
    // The underserved step out of the shadow, into the light.
    const shade = K.el('rect', { x: -200, y: -200, width: 700, height: 1200, fill: Z.grad(sc.mid, [['#1a1f2a', .75], ['#1a1f2a', .55, .6], ['#1a1f2a', 0]], 'h') }, sc.mid);
    const us = actor(sc.mid, 240, 860, .9, { skin: SKIN.s4, hair: 'hijab', hairColor: '#b0563a', top: '#e7c178', outfit: 'sweater', mood: 'flat' }, 'idle');
    life(us, t0, t1, 14);
    const us0 = at('underserved');
    tl.to(shade, { autoAlpha: 0, duration: .6 }, us0);
    walkTo(us, us0, 180, .8, -60);
    express(tl, us.f, us0 + .3, 'happy');
    const glowU = put(sc.front, 420, 560, 1); Z.glow(glowU, 0, 0, 200, '#ffd38a', .5);
    S.fade(glowU, us0 + .2);
    label('equal footing', eq, { x: 1180, y: 92, ax: 1180, ay: 640, hold: 1.4, parent: sc.front });
    label('disability', at('disability'), { x: 1100, y: 92, ax: 1060, ay: 520, tone: 'mint', hold: .7, size: 38, parent: sc.front });
    label('elderly', at('elderly'), { x: 760, y: 92, ax: 760, ay: 360, tone: 'mint', hold: .7, size: 38, parent: sc.front });
    label('underserved', us0, { x: 520, y: 92, ax: 430, ay: 330, tone: 'mint', hold: 1.0, size: 38, parent: sc.front });
  }
}
