import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Scott — Family.
   "How will AI affect how my children grow up? Right now, there's a
    generation of children being born that will not know a world without AI.
    Think of my kids. How is AI going to affect their creativity? How they
    interpret the world? How they consume information? Could AI make my
    children more creative? Will AI give me more time to spend with my girls." */
export const fullBleed = true;

const SCOTT = { skin: SKIN.s1, hair: 'short', hairColor: HAIRC.blond, beard: true, top: '#8fb27f', outfit: 'sweater', bottom: '#34404a' };
const GIRL1 = { skin: SKIN.s1, hair: 'ponytail', hairColor: HAIRC.blond, top: '#d9805f', outfit: 'tee', bottom: '#3b3a4a', age: 'child', mood: 'grin' };
const GIRL2 = { skin: SKIN.s1, hair: 'bob', hairColor: HAIRC.blond, top: '#e7c178', outfit: 'tee', bottom: '#5b8fb8', age: 'toddler', mood: 'grin' };

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo, talk, motes } = helpers(S);
  const D = S.duration;
  const home = (sc, horizon = 700) => {
    Z.room(sc.back, { ...Z.PAL.home, wall: '#f3e2c9', wallDark: '#e2c9a6', trim: '#c9a57c' }, { horizon });
    const w = Z.windowFrame(sc.back, 1120, 130, 320, 330, { sky: ['#a9dcec', '#f6e9cc'] });
    Z.treeRound(w.scene, 200, 380, .7);
    return w;
  };

  /* 1 · How will AI affect how my children grow up? */
  {
    const t0 = 0, t1 = at('right');
    const sc = scene(t0, t1, { zoom: [1.04, 1], origin: '700 500' });
    home(sc);
    // A growth chart on the wall: a tall paper ruler with coloured bands.
    const chart = K.g(sc.back);
    K.el('rect', { x: 886, y: 186, width: 120, height: 520, rx: 10, fill: '#000', opacity: .1 }, chart);
    K.el('rect', { x: 880, y: 180, width: 120, height: 520, rx: 10, fill: '#fbf8f1' }, chart);
    ['#f0a3a0', '#e7c178', '#a5e3c6', '#9cc7e8', '#c9a7e0'].forEach((c, i) => K.el('rect', { x: 880, y: 180 + i * 104, width: 120, height: 104, fill: c, opacity: .35 }, chart));
    for (let i = 0; i < 13; i++) K.el('path', { d: `M880 ${690 - i * 40} h${i % 2 ? 22 : 40}`, stroke: '#5a4a3a', 'stroke-width': 3 }, chart);
    const marks = [0, 1, 2, 3, 4].map(i => K.el('path', { d: `M890 ${560 - i * 50} h100`, stroke: '#d9694a', 'stroke-width': 6, 'stroke-linecap': 'round' }, sc.back));
    marks.forEach((m, i) => draw(m, at('grow') - .1 + i * .08, .25));
    const g1 = actor(sc.mid, 560, 820, .8, GIRL1, 'cheer'), g2 = actor(sc.mid, 720, 820, .8, GIRL2, 'wave');
    life(g1, t0, t1, 1); life(g2, t0, t1, 2);
    pop(g1, .1, { y: 20 }); pop(g2, .25, { y: 20 });
    tl.to(g1.content, { scale: 1.12, duration: .9, ease: 'back.out(1.4)', transformOrigin: '50% 100%' }, at('grow') - .1);
    tl.to(g2.content, { scale: 1.15, duration: .9, ease: 'back.out(1.4)', transformOrigin: '50% 100%' }, at('grow'));
    const tab = put(sc.mid, 330, 560, 1); K.el('rect', { x: -60, y: -80, width: 120, height: 160, rx: 14, fill: '#22292e' }, tab); K.el('rect', { x: -50, y: -70, width: 100, height: 140, rx: 8, fill: '#163a4f' }, tab);
    Z.aiCore(tab, 0, 0, .22, { hud: false });
    Z.table(sc.mid, 330, 760, 200, { top: '#c9a27a', h: 120 });
    pop(tab, at('ai') - .1, { origin: '50% 50%' });
    label('children', at('children'), { x: 640, y: 92, ax: 640, ay: 380, hold: 1.0, parent: sc.front });
  }

  /* 2 · …a generation of children being born… */
  {
    const t0 = at('right'), t1 = at('world') - .45;
    const sc = scene(t0, t1, { zoom: [1, 1.08], origin: '800 520' });
    Z.room(sc.back, Z.PAL.clinic, { horizon: 690 });
    K.el('rect', { x: 140, y: 120, width: 1320, height: 400, rx: 12, fill: '#f7f3ea' }, sc.back);
    K.el('rect', { x: 160, y: 140, width: 1280, height: 360, rx: 6, fill: Z.grad(sc.back, ['#f6e3ea', '#e3eef6']) }, sc.back);
    for (const x of [260, 700, 1100]) K.el('path', { d: `M${x} 140 L${x + 120} 140 L${x - 60} 500 L${x - 180} 500Z`, fill: '#ffffff', opacity: .28 }, sc.back);
    for (let i = 0; i < 7; i++) { const st = K.g(sc.back); st.setAttribute('transform', `translate(${260 + i * 180} 210)`); K.star(st, ['#f0a3a0', '#9cc7e8', '#e7c178'][i % 3], 12); }
    const cribs = [];
    for (let i = 0; i < 7; i++) {
      const c = put(sc.mid, 260 + i * 180, 470, .95); const cr = K.cradle(c);
      K.el('path', { d: 'M-66 -40 v-20 M66 -40 v-20', stroke: '#c9b08a', 'stroke-width': 6 }, c);
      cribs.push(c);
    }
    cribs.forEach((c, i) => pop(c, t0 + .1 + i * .07, { origin: '50% 100%', y: 20 }));
    cribs.forEach((c, i) => tl.to(c, { y: -14, duration: .18, yoyo: true, repeat: 1, ease: 'power1.out' }, at('generation') - .1 + i * .11));
    const hearts = cribs.map((c, i) => { const h = put(sc.front, 260 + i * 180, 330, .3); K.heart(h, ['#f0a3a0', '#9cc7e8', '#e7c178'][i % 3]); return h; });
    hearts.forEach((h, i) => pop(h, at('born') - .1 + i * .07, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }));
    K.el('rect', { x: 140, y: 500, width: 1320, height: 30, rx: 6, fill: '#c9b08a' }, sc.mid);
    label('generation', at('generation'), { x: 800, y: 92, ax: 800, ay: 400, hold: 1.4, parent: sc.front });
  }

  /* 2b · …that will not know a world without AI. */
  {
    const t0 = at('world') - .45, t1 = at('think');
    const sc = scene(t0, t1, { enter: 'fade', zoom: [1.1, 1], origin: '800 450' });
    K.el('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: Z.grad(sc.back, ['#0b1430', '#1c2a55'], 'v') }, sc.back);
    for (let i = 0; i < 60; i++) K.el('circle', { cx: (i * 263 + (i * i * 37) % 211) % 1600, cy: (i * 151 + (i * i * 53) % 173) % 900, r: 1.2 + (i % 3), fill: '#fff', opacity: .3 + (i % 4) * .15 }, sc.back);
    const gw = put(sc.mid, 800, 470, 1.5); const gl = K.globe(gw);
    tl.to(gl.land, { x: 80, duration: 2.4, ease: 'none' }, t0);
    // AI connects the whole world.
    const nodes = [[-90, -60], [40, -90], [100, 10], [-40, 40], [60, 80], [-110, 30], [0, -10]].map(([x, y]) => [800 + x * 1.5, 470 + y * 1.5]);
    nodes.forEach(([x, y], i) => { const n = K.el('circle', { cx: x, cy: y, r: 9, fill: '#7fe0c4' }, sc.front); pop(n, at('without') - .2 + i * .05, { origin: '50% 50%', from: .1 }); });
    nodes.forEach(([x, y], i) => { const [nx, ny] = nodes[(i + 1) % nodes.length]; const l = K.el('path', { d: `M${x} ${y} Q800 470 ${nx} ${ny}`, stroke: '#7fe0c4', 'stroke-width': 3, fill: 'none', opacity: .7 }, sc.front); draw(l, at('without') + i * .05, .4); });
    const ai = put(sc.front, 800, 160, 1); Z.aiCore(ai, 0, 0, .35);
    pop(ai, at('ai', 2) - .1, { origin: '50% 50%' });
    label('world', at('world'), { x: 1180, y: 92, ax: 1000, ay: 330, tone: 'mint', hold: 1.1, parent: sc.front });
  }

  /* 3 · Think of my kids. How is AI going to affect their creativity? */
  {
    const t0 = at('think'), t1 = at('how', 4);
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 520' });
    home(sc);
    Z.sofa(sc.back, 380, 720, .9, '#5b8fb8');
    const sc0 = actor(sc.mid, 330, 860, 1.05, { ...SCOTT, mood: 'smile' }, 'present');
    life(sc0, t0, t1, 3); talk(sc0, t0, t1);
    motes(sc.back, [1100, 160, 360, 520], t0, t1, 14);
    Z.table(sc.mid, 900, 820, 460, { top: '#e9e3d4', h: 100 });
    const g1 = actor(sc.mid, 760, 900, .95, GIRL1, 'write'), g2 = actor(sc.mid, 1080, 900, 1.0, GIRL2, 'write');
    life(g1, t0, t1, 4); life(g2, t0, t1, 5);
    // A big sheet fills with colour.
    const sheet = put(sc.front, 900, 330, 1);
    K.el('rect', { x: -230, y: -150, width: 460, height: 300, rx: 10, fill: '#fbf8f1' }, sheet);
    const strokes = ['M-200 60 C-140 -60 -80 120 -20 -20 S100 -100 200 30', 'M-190 -100 q60 60 120 0 t120 0 t120 0', 'M-160 120 l60 -60 l40 40 l60 -80 l60 60 l60 -40', 'M120 -70 a40 40 0 1 0 1 0'];
    strokes.forEach((d, i) => { const p = K.el('path', { d, stroke: ['#d9694a', '#5b8fb8', '#3f8a5a', '#e2a64a'][i], 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sheet); draw(p, at('creativity') - .3 + i * .22, .6); });
    pop(sheet, at('affect', 2) - .3, { origin: '50% 50%', from: .6 });
    express(tl, sc0.f, at('kids'), 'happy');
    label('creativity', at('creativity'), { x: 900, y: 92, ax: 900, ay: 180, hold: .9, parent: sc.front });
  }

  /* 4 · How they interpret the world? How they consume information? */
  {
    const t0 = at('how', 4), t1 = at('could');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 500' });
    home(sc, 720);
    Z.sofa(sc.mid, 820, 780, 1.1, '#d9805f');
    const g1 = actor(sc.mid, 820, 820, 1.15, GIRL1, 'hold');
    life(g1, t0, t1, 6);
    const tab = put(sc.mid, 820, 560, 1); K.el('rect', { x: -70, y: -50, width: 140, height: 96, rx: 10, fill: '#22292e' }, tab); const scr = K.el('rect', { x: -60, y: -42, width: 120, height: 80, rx: 6, fill: '#5fd3ff' }, tab);
    const gw = put(sc.front, 450, 330, .75); K.globe(gw);
    pop(gw, at('interpret') - .3, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    const mg = put(sc.front, 0, 0, .9); K.magnifier(mg);
    tl.fromTo(mg, { x: 560, y: 360, autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: true }, at('interpret') - .1);
    tl.to(mg, { x: 420, y: 300, duration: .6, ease: 'sine.inOut', repeat: 1, yoyo: true }, at('interpret'));
    tl.to([gw, mg], { autoAlpha: .2, duration: .4 }, at('consume') - .3);
    // A stream of cards pours in.
    const cons = at('consume');
    const kinds = ['#d9805f', '#5b8fb8', '#e7c178', '#8fb27f', '#f0a3a0'];
    for (let i = 0; i < 10; i++) {
      const card = put(sc.front, 0, 0, 1);
      K.el('rect', { x: -50, y: -34, width: 100, height: 68, rx: 10, fill: '#fbf8f1' }, card);
      K.el('rect', { x: -40, y: -24, width: 80, height: 30, rx: 6, fill: kinds[i % 5] }, card);
      K.el('path', { d: 'M-40 18 h60', stroke: '#b7c2b2', 'stroke-width': 6, 'stroke-linecap': 'round' }, card);
      if (i % 3 === 0) K.el('path', { d: 'M-8 -18 l18 9 l-18 9z', fill: '#fff' }, card);
      tl.fromTo(card, { x: 1300 + (i % 3) * 60, y: 150 + (i % 4) * 90, autoAlpha: 0, scale: 1 }, { keyframes: [{ autoAlpha: 1, duration: .1 }, { x: 820, y: 540, scale: .2, duration: .7, ease: 'power2.in' }, { autoAlpha: 0, duration: .05 }], immediateRender: true }, cons - .3 + i * .17);
    }
    tl.to(scr, { attr: { fill: '#ffd38a' }, duration: .15, repeat: 9, yoyo: true }, cons);
    express(tl, g1.f, cons + .5, 'surprised');
    label('interpret', at('interpret'), { x: 450, y: 92, ax: 450, ay: 220, hold: .9, parent: sc.front });
    label('information', at('information'), { x: 1150, y: 92, ax: 1150, ay: 250, tone: 'mint', hold: .9, parent: sc.front });
  }

  /* 5 · Could AI make my children more creative? */
  {
    const t0 = at('could'), t1 = at('will', 3);
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 520' });
    Z.sky(sc.back, '#9fd3e6', '#fbe9c4');
    K.el('rect', { x: -200, y: 640, width: 2000, height: 400, fill: Z.grad(sc.back, ['#d8cfbf', '#bfb4a2']) }, sc.back);
    // A garden wall becomes a mural.
    K.el('rect', { x: 200, y: 260, width: 1200, height: 380, rx: 6, fill: '#efe3cf' }, sc.back);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) K.el('rect', { x: 200 + c * 120 + (r % 2) * 60, y: 260 + r * 63, width: 116, height: 59, fill: 'none', stroke: '#d8c9ae', 'stroke-width': 3 }, sc.back);
    const mural = K.g(sc.mid);
    [['M260 560 C400 300 600 300 760 560', '#d9694a'], ['M300 560 C420 360 580 360 720 560', '#e2a64a'], ['M340 560 C440 410 560 410 680 560', '#3f8a5a'], ['M380 560 C460 460 540 460 640 560', '#5b8fb8']].forEach(([d, c], i) => { const p = K.el('path', { d, stroke: c, 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round' }, mural); draw(p, at('make') + i * .12, .7); });
    const sunM = put(mural, 1150, 380, 1); K.el('circle', { r: 70, fill: '#ffd38a' }, sunM); pop(sunM, at('creative') - .2, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    for (let i = 0; i < 5; i++) { const s = put(mural, 900 + i * 90, 300 + (i % 2) * 60, 1); K.star(s, ['#e2a64a', '#f0a3a0', '#7fe0c4'][i % 3], 24); pop(s, at('creative') + i * .07, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }); }
    const g1 = actor(sc.mid, 620, 860, 1.05, GIRL1, 'pointUp'), g2 = actor(sc.mid, 900, 860, 1.1, GIRL2, 'cheer');
    life(g1, t0, t1, 7); life(g2, t0, t1, 8);
    tl.to([g1, g2], { y: -40, duration: .3, repeat: 3, yoyo: true, ease: 'power1.out' }, at('creative') - .1);
    burst(sc.front, 780, 380, at('creative'), { n: 14, r1: 300, color: '#ffd38a', size: 11 });
    label('creative', at('creative'), { x: 800, y: 92, ax: 760, ay: 300, hold: .7, parent: sc.front });
  }

  /* 6 · Will AI give me more time to spend with my girls. */
  {
    const t0 = at('will', 3), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 500' });
    Z.sky(sc.back, '#f2a77a', '#fbe0b0');
    const sunG = put(sc.back, 1200, 520, 1); Z.sunDisc(sunG, 0, 0, 110, '#ffcf7a');
    Z.hills(sc.back, ['#c9b98a', '#a6a874', '#7f9a62'], 1000);
    Z.treeRound(sc.back, 260, 700, 1.3, { leaf: '#6f9a5a' });
    const clk = put(sc.front, 1200, 250, 1); const c = Z.wallClock(clk, 0, 0, 70);
    pop(clk, t0, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    tl.to(c.minute, { rotation: -720, svgOrigin: '0 0', duration: 1.3, ease: 'power2.inOut' }, at('time') - .4);
    tl.to(c.hour, { rotation: -60, svgOrigin: '0 0', duration: 1.3, ease: 'power2.inOut' }, at('time') - .4);
    const sc0 = actor(sc.mid, 720, 860, 1.1, { ...SCOTT, mood: 'grin' }, 'idle');
    const g1 = actor(sc.mid, 520, 860, 1.0, GIRL1, 'reachR'), g2 = actor(sc.mid, 920, 860, 1.1, GIRL2, 'reachL');
    life(sc0, t0, t1, 9); life(g1, t0, t1, 10); life(g2, t0, t1, 11); talk(sc0, t0, t1);
    Z.grassTufts(sc.front, 905, '#6f8a4a');
    walkIn(g1, t0, -260, .8); walkIn(g2, t0 + .1, 260, .8);
    pose(tl, sc0.f, [52, -20, -52, 20], at('spend') - .3, .5);
    const ht = put(sc.front, 960, 300, .9); K.heart(ht, '#d9694a');
    pop(ht, at('girls') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 960, 300, at('girls'), { color: '#f0a3a0' });
    label('time', at('time'), { x: 1000, y: 92, ax: 1200, ay: 170, hold: .55, parent: sc.front });
    label('girls', at('girls'), { x: 1180, y: 92, ax: 960, ay: 600, hold: 1.0, parent: sc.front });
  }
}
