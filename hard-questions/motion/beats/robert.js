import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Robert — Trust.
   "I'm Robert. I'm retired, medical retired. I'm raising my five-year-old son.
    Who is in control? Who will be in control of it, overseeing its use and
    misuse? Should they be required to be more forthcoming about the
    infrastructure required for the data center, for local economies?" */
export const fullBleed = true;

const ROBERT = { skin: SKIN.s2, hair: 'bald', hairColor: HAIRC.grey, beard: true, glasses: true, top: '#7fa7c9', outfit: 'shirt', bottom: '#3a3f4a' };
const SON = { skin: SKIN.s2, hair: 'curly', hairColor: HAIRC.brown, top: '#e7c178', outfit: 'tee', bottom: '#2f4a3a', age: 'child', mood: 'grin' };

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, blink, talk, motes } = helpers(S);
  const D = S.duration;

  /* 1 · I'm Robert. I'm retired, medical retired. */
  {
    const t0 = 0, t1 = at("i'm", 3);
    const sc = scene(t0, t1, { zoom: [1.04, 1], origin: '700 500' });
    Z.room(sc.back, Z.PAL.home, { horizon: 680 });
    const w = Z.windowFrame(sc.back, 980, 140, 380, 330, { sky: ['#a9dcec', '#f6e9cc'] });
    Z.treeRound(w.scene, 260, 380, .8);
    Z.lightShaft(sc.back, 'M980 480 L1360 480 L1200 900 L700 900Z', '#fff3cf', .22);
    Z.frame(sc.back, 380, 200, 170, 130, '#d9805f');
    Z.shelf(sc.back, 600, 300, 200);
    Z.armchair(sc.mid, 1060, 760, .95, '#c96a4a');
    motes(sc.back, [760, 480, 560, 380], t0, t1, 16);
    Z.table(sc.mid, 1300, 760, 160, { top: '#c9a27a', h: 140 });
    const r = actor(sc.mid, 620, 820, 1.02, ROBERT, 'wave');
    life(r, 0, t1, 1); waveHand(tl, r.f, .1, 2); talk(r, t0, t1);
    pose(tl, r.f, 'idle', 1.0, .5);
    const bag = put(sc.mid, 780, 800, 1); K.briefcase(bag);
    const ret = at('retired');
    tl.to(bag, { x: -420, autoAlpha: 0, duration: .9, ease: 'power2.in' }, ret + .1);
    // Medical: a cane rests by the armchair, pills on the side table.
    const cane = put(sc.mid, 1200, 760, 1.2); K.cane(cane);
    pop(cane, at('medical') - .1, { origin: '50% 100%', rot: 12 });
    const pills = put(sc.mid, 1300, 618, .9);
    K.el('rect', { x: -22, y: -60, width: 44, height: 60, rx: 8, fill: '#f4f1e6' }, pills); K.el('rect', { x: -26, y: -74, width: 52, height: 18, rx: 6, fill: '#d9805f' }, pills); K.el('path', { d: 'M-8 -34 h16 M0 -42 v16', stroke: '#d9694a', 'stroke-width': 5, 'stroke-linecap': 'round' }, pills);
    pop(pills, at('medical'), { origin: '50% 100%' });
    express(tl, r.f, at('retired', 2), 'calm');
    label('retired', ret, { x: 620, y: 92, ax: 620, ay: 220, hold: 1.7, parent: sc.front });
  }

  /* 2 · I'm raising my five-year-old son. */
  {
    const t0 = at("i'm", 3), t1 = at('who');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 520' });
    Z.sky(sc.back, '#9fd3e6', '#f6e9cc');
    Z.cloudSoft(sc.back, 300, 160, .9);
    Z.hills(sc.back, ['#b9d9a0', '#8fc07f', '#6fa86b'], 960);
    Z.houseFront(sc.back, 1300, 640, 1.1, { wall: '#f1d8bd' });
    Z.treeRound(sc.back, 230, 650, 1.2);
    Z.stringLights(sc.back, 380, 1120, 300, 30);
    Z.table(sc.mid, 820, 800, 380, { top: '#e9e3d4', h: 150 });
    const ck = Z.cake(sc.mid, 820, 630, 1, 5);
    const r = actor(sc.mid, 520, 840, 1.0, { ...ROBERT, mood: 'grin' }, 'reachR');
    const s = actor(sc.mid, 1080, 840, 1.0, SON, 'cheer');
    life(r, t0, t1, 2); life(s, t0, t1, 3); talk(r, t0, t1);
    Z.grassTufts(sc.front, 905);
    walkIn(s, at('raising') - .3, 220, .7);
    const five = at('five');
    ck.flames.forEach((f, i) => tl.fromTo(f, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, svgOrigin: '0 0', duration: .25, ease: 'back.out(3)', immediateRender: true }, five - .2 + i * .1));
    const num = K.el('text', { x: 820, y: 470, 'text-anchor': 'middle', 'font-family': "'Source Serif 4', Georgia, serif", 'font-weight': 700, 'font-size': 130, fill: '#e2a64a' }, sc.front);
    pop(num, five - .2, { origin: '50% 100%' }); count(num, five - .2, 1, 5, .55);
    tl.to(s, { y: -40, duration: .25, repeat: 3, yoyo: true, ease: 'power1.out' }, at('son'));
    burst(sc.front, 820, 420, five + .4, { color: '#ffd38a', r1: 160 });
    label('raising', at('raising'), { x: 1080, y: 92, ax: 1080, ay: 330, hold: 1.4, parent: sc.front });
  }

  /* 3 · Who is in control? Who will be in control of it? */
  {
    const t0 = at('who'), t1 = at('overseeing');
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 480' });
    Z.room(sc.back, { wall: '#1f2b45', wallDark: '#141c30', trim: '#101728', floor: '#1d2539', floorDark: '#121828' }, { horizon: 640, wainscot: false });
    // Wall of screens.
    const wall = K.g(sc.back);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const x = 330 + i * 320, y = 110 + j * 200;
      K.el('rect', { x, y, width: 300, height: 180, rx: 10, fill: '#0d1626', stroke: '#2c3f5c', 'stroke-width': 4 }, wall);
      K.el('rect', { x: x + 12, y: y + 12, width: 276, height: 156, rx: 6, fill: Z.grad(wall, ['#163a55', '#0d2236']) }, wall);
      for (let k = 0; k < 3; k++) K.el('path', { d: `M${x + 30} ${y + 120 - k * 26} l40 -${10 + k * 6} l40 ${8} l60 -${20 + k * 4} l60 ${14}`, stroke: ['#5fd3ff', '#a5e3c6', '#ffd38a'][k], 'stroke-width': 3, fill: 'none', opacity: .7 }, wall);
    }
    const ai = Z.aiCore(sc.back, 800, 300, .55);
    pop(ai.inner, t0, { origin: '50% 50%', from: .2 }); spin(ai.hud, t0, t1, .5);
    // The console and an empty chair.
    K.el('path', { d: 'M260 640 L1340 640 L1400 760 L200 760Z', fill: '#26324a' }, sc.mid);
    K.el('rect', { x: 200, y: 756, width: 1200, height: 30, rx: 6, fill: '#1a2336' }, sc.mid);
    const btns = []; for (let i = 0; i < 18; i++) btns.push(K.el('circle', { cx: 320 + i * 54, cy: 700, r: 8, fill: ['#5fd3ff', '#ffd38a', '#df8466'][i % 3] }, sc.mid));
    blink(btns, t0, t1, .7);
    const chairG = Z.chairOffice(sc.mid, 800, 860, 1.05, '#3a4a66');
    // Who? A spotlight searches the empty seat.
    const beam = K.el('path', { d: 'M800 -40 L650 900 H950Z', fill: Z.grad(sc.mid, [['#fff3cf', .35], ['#fff3cf', .05]]) }, sc.mid);
    tl.fromTo(beam, { rotation: -22 }, { rotation: 22, svgOrigin: '800 -40', duration: 1.2, ease: 'sine.inOut', repeat: 1, yoyo: true, immediateRender: true }, t0);
    tl.to(beam, { rotation: 0, svgOrigin: '800 -40', duration: .5, ease: 'power2.out' }, t0 + 2.4);
    tl.to(chairG, { rotation: 8, svgOrigin: '800 860', duration: .8, ease: 'sine.inOut', repeat: 3, yoyo: true }, t0);
    const o1 = Z.orb(sc.front, 800, 470, .9); pop(o1.inner, at('who') + .3, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    const r = actor(sc.front, 260, 1040, 1.25, { ...ROBERT, mood: 'worried' }, 'chin');
    life(r, t0, t1, 4); tilt(tl, r.f, t0 + .3, 6); talk(r, t0, t1);
    const o2 = Z.orb(sc.front, 420, 330, .7); pop(o2.inner, at('who', 2), { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    label('control', at('control'), { x: 1000, y: 92, ax: 800, ay: 560, hold: .5, parent: sc.front });
    label('control', at('control', 2), { x: 1000, y: 92, ax: 800, ay: 560, hold: .9, parent: sc.front });
  }

  /* 4 · …overseeing its use and misuse? */
  {
    const t0 = at('overseeing'), t1 = at('should');
    const sc = scene(t0, t1, { zoom: [1, 1.04] });
    Z.street(sc.back, { skyTop: '#9fd3e6', skyBottom: '#f3e6cf', curb: 700 });
    Z.shopFront(sc.mid, 380, 660, .95, { wall: '#e8f1ee', awning: '#2f7f73', sign: 'CLINIC' });
    Z.shopFront(sc.mid, 800, 660, .95, { wall: '#f3e7c9', awning: '#e7c178', sign: 'SCHOOL' });
    Z.shopFront(sc.mid, 1220, 660, .95, { wall: '#e6e2d8', awning: '#5b8fb8', sign: 'BANK' });
    // AI helpers travel the street: mint ones help, one red one sneaks.
    [380, 800].forEach((tx, i) => { const a = put(sc.front, 0, 0, 1); Z.aiCore(a, 0, 0, .36, { hud: false }); tl.fromTo(a, { x: 100 + i * 120, y: 820 }, { x: tx, y: 470, duration: 1.1, ease: 'power2.inOut', immediateRender: true }, at('use') - .6 + i * .2); });
    [380, 800].forEach((x, i) => { const ok = put(sc.front, x, 380, .8); K.check(ok, '#7fe0c4'); pop(ok, at('use') + .5 + i * .15, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }); });
    const badG = put(sc.front, 0, 0, 1); const bad = Z.aiCore(badG, 0, 0, .36, { hud: false });
    K.el('circle', { r: 120, fill: 'none', stroke: '#df8466', 'stroke-width': 10 }, bad.inner);
    tl.fromTo(badG, { x: 1550, y: 820 }, { x: 1220, y: 470, duration: 1.0, ease: 'power2.inOut', immediateRender: true }, at('misuse') - .7);
    const no = put(sc.front, 1220, 380, .8); K.cross(no, '#df8466');
    pop(no, at('misuse') + .3, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    // The overseer's lens sweeps the street.
    const mg = put(sc.front, 0, 0, 1.4); K.magnifier(mg);
    tl.fromTo(mg, { x: 300, y: 300, autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: true }, t0 - .1);
    tl.to(mg, { motionPath: { path: [{ x: 500, y: 340 }, { x: 800, y: 330 }, { x: 1100, y: 340 }], curviness: 1.2 }, duration: t1 - t0 - .3, ease: 'sine.inOut' }, t0 + .2);
    label('overseeing', t0, { x: 800, y: 92, ax: 300, ay: 300, hold: 1.1, parent: sc.front });
    label('misuse', at('misuse'), { x: 1100, y: 92, ax: 1220, ay: 440, tone: 'clay', hold: 1.2, parent: sc.front });
  }

  /* 5 · Should they be required to be more forthcoming? */
  {
    const t0 = at('should'), t1 = at('the infrastructure') - .2;
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 500' });
    Z.sky(sc.back, '#7fb7d6', '#f1e3c8');
    Z.skyline(sc.back, 620, { color: '#8aa1b5', far: '#a9bccb' });
    K.el('rect', { x: -200, y: 700, width: 2000, height: 300, fill: Z.grad(sc.back, ['#d8cfbf', '#bfb4a2']) }, sc.back);
    const hq = Z.tower(sc.mid, 800, 720, 1, { w: 380, h: 600 });
    const req = put(sc.front, 1250, 380, 1.1); K.doc(req, { lines: 4, w: 130, h: 160 });
    const seal = put(sc.front, 1300, 450, .7); K.check(seal, '#e7c178');
    pop(req, at('required'), { origin: '50% 50%', rot: -8 }); pop(seal, at('required') + .25, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    const fc = at('forthcoming');
    tl.to(hq.doorL, { x: -54, duration: .6, ease: 'power3.inOut' }, fc - .15);
    tl.to(hq.doorR, { x: 54, duration: .6, ease: 'power3.inOut' }, fc - .15);
    const light = K.el('path', { d: 'M740 600 L540 900 H1060 L860 600Z', fill: Z.grad(sc.mid, [['#ffe9b8', .7], ['#ffe9b8', 0]]), opacity: 0 }, sc.mid);
    tl.to(light, { attr: { opacity: 1 }, duration: .5 }, fc + .1);
    for (let i = 0; i < 5; i++) {
      const p = put(sc.front, 0, 0, .55); K.doc(p, { lines: 3 });
      tl.fromTo(p, { x: 800, y: 660, autoAlpha: 0, rotation: 0 }, { x: 420 + i * 190, y: 420 - (i % 2) * 80, autoAlpha: 1, rotation: (i - 2) * 14, duration: 1, ease: 'expo.out', immediateRender: true }, fc + .25 + i * .08);
    }
    const r = actor(sc.front, 330, 900, 1.05, { ...ROBERT, mood: 'flat' }, 'point');
    life(r, t0, t1, 5); talk(r, t0, t1);
    express(tl, r.f, fc + .4, 'happy');
    pose(tl, r.f, 'hold', fc + .6, .5);
    label('forthcoming', fc, { x: 800, y: 92, ax: 800, ay: 620, hold: 1.1, parent: sc.front });
  }

  /* 6 · …the infrastructure required for the data center, for local economies? */
  {
    const t0 = at('the infrastructure') - .2, t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 520' });
    Z.sky(sc.back, '#9fc9e0', '#f2e2c6');
    Z.hills(sc.back, ['#c2d9a6', '#a6c58d', '#8db57c'], 960);
    Z.river(sc.back, 800, '#7fb9d3');
    const py = [Z.pylon(sc.mid, 260, 640, .9), Z.pylon(sc.mid, 470, 600, .7)];
    const wire = K.el('path', { d: 'M260 410 Q360 450 470 432 Q560 460 640 470', stroke: '#e7c178', 'stroke-width': 4, fill: 'none' }, sc.mid);
    const dc = Z.dataCenter(sc.mid, 780, 660, .9);
    const inf = at('infrastructure');
    py.forEach((p, i) => pop(p, inf - .1 + i * .15, { origin: '50% 100%', from: .4 }));
    draw(wire, inf + .3, .6);
    const pipe = K.el('path', { d: 'M680 830 C680 760 720 720 740 660', stroke: '#7fb9d3', 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }, sc.mid);
    draw(pipe, at('required', 2), .6);
    dc.puffs.forEach((p, i) => tl.fromTo(p, { y: 10, autoAlpha: 0 }, { y: -50, autoAlpha: 1, duration: 1.4, repeat: 2, ease: 'power1.out', immediateRender: true }, t0 + .4 + i * .2));
    dc.fans.forEach(f => spin(f, t0, t1, 6));
    label('infrastructure', inf, { x: 470, y: 92, ax: 360, ay: 420, hold: 1.2, parent: sc.front });
    label('data center', at('data'), { x: 780, y: 92, ax: 780, ay: 480, tone: 'mint', hold: .7, parent: sc.front });
    // Local economies: shops on the town's main street, and money moving.
    const loc = at('local');
    [[1170, '#f1d8bd', '#d9805f'], [1360, '#e8f1ee', '#2f7f73']].forEach(([x, wl, aw], i) => { const s = Z.shopFront(sc.mid, x, 780, .7, { wall: wl, awning: aw }); tl.fromTo(s, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, ease: 'expo.out', immediateRender: true }, loc - .3 + i * .12); });
    for (let i = 0; i < 5; i++) {
      const c = put(sc.front, 0, 0, .9); K.coin(c);
      tl.fromTo(c, { x: 1260, y: 540, autoAlpha: 0 }, { keyframes: [{ autoAlpha: 1, duration: .1 }, { motionPath: { path: [{ x: 1060, y: 420 }, { x: 880, y: 500 }], curviness: 1 }, duration: .8, ease: 'sine.inOut' }, { autoAlpha: 0, duration: .15 }], immediateRender: true }, at('economies') + i * .18);
    }
    label('economies', at('economies'), { x: 1150, y: 92, ax: 1270, ay: 490, hold: 1.0, parent: sc.front });
    const o = Z.orb(sc.front, 1000, 260, .8); pop(o.inner, at('economies') + .5, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }
}
