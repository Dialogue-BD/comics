import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Gwen — Environment.
   "I think it's dangerous for the environment. It's concerning for residents
    who are in marginalized communities. Can we balance the goals of technology
    with the stability and safety of our communities? Can AI actually help the
    environment instead of harm it?" */
export const fullBleed = true;

const GWEN = { skin: SKIN.s2, hair: 'bob', hairColor: '#6b5a4a', glasses: true, top: '#5b8fb8', outfit: 'blouse', bottom: '#2f3e4a' };

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo, drainTo, talk } = helpers(S);
  const D = S.duration;

  /* 1 · It's dangerous for the environment. */
  {
    const t0 = 0, t1 = at("it's", 2);
    const sc = scene(t0, t1, { zoom: [1.06, 1], origin: '900 520' });
    const skyG = Z.sky(sc.back, '#9fc9e0', '#f2e2c6');
    const smog = K.el('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#8a8a7a', opacity: 0 }, sc.back);
    Z.hills(sc.back, ['#c2d9a6', '#a6c58d', '#8db57c'], 960);
    const rv = Z.river(sc.back, 800, '#7fb9d3');
    const dc = Z.dataCenter(sc.mid, 1000, 680, 1.05);
    const trees = [260, 440, 600].map((x, i) => Z.treeRound(sc.mid, x, 720, 1 - i * .1, { leaf: '#5a9a5f' }));
    dc.fans.forEach(f => spin(f, t0, t1, 4));
    const dg = at('dangerous');
    dc.puffs.forEach((p, i) => tl.fromTo(p, { y: 10, autoAlpha: 0, scale: .8 }, { y: -90, autoAlpha: 1, scale: 1.6, transformOrigin: '50% 100%', duration: 1.4, repeat: 1, ease: 'power1.out', immediateRender: true }, .2 + i * .15));
    tl.to(smog, { attr: { opacity: .35 }, duration: 1 }, dg);
    tl.to(rv.water, { attr: { fill: '#6f7f6a' }, duration: 1 }, dg + .2);
    trees.forEach((t, i) => { t.blobs.forEach(b => tl.to(b, { attr: { fill: '#9a9a5a' }, duration: .8 }, dg + .2 + i * .1)); tl.to(t, { rotation: -5 + i * 2, scaleY: .94, transformOrigin: '50% 100%', duration: .8 }, dg + .2 + i * .1); });
    const warn = put(sc.front, 620, 300, 1.1); K.warning(warn);
    pop(warn, dg, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    loop(warn, dg + .6, t1, { scale: 1.08, transformOrigin: '50% 50%' }, .6);
    label('dangerous', dg, { x: 620, y: 92, ax: 620, ay: 240, tone: 'clay', hold: .6, parent: sc.front });
    label('environment', at('environment'), { x: 1150, y: 92, ax: 1150, ay: 830, tone: 'mint', hold: .55, size: 38, parent: sc.front });
  }

  /* 2 · It's concerning for residents in marginalized communities. */
  {
    const t0 = at("it's", 2), t1 = at('can');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '600 520' });
    Z.sky(sc.back, '#a9a99a', '#d9cdb4');
    Z.hills(sc.back, ['#b5b88f', '#9aa47c', '#87926c'], 980);
    const dc = Z.dataCenter(sc.back, 1220, 640, 1.3);
    dc.puffs.forEach((p, i) => tl.fromTo(p, { y: 10, autoAlpha: 0, scale: .9 }, { y: -80, autoAlpha: 1, scale: 1.5, transformOrigin: '50% 100%', duration: 1.4, repeat: 1, ease: 'power1.out', immediateRender: true }, t0 + i * .15));
    // A fence, and the neighbourhood right behind it.
    const fence = K.g(sc.mid); for (let i = 0; i < 18; i++) K.el('rect', { x: 840 + i * 22, y: 600, width: 10, height: 120, fill: '#7f8d93' }, fence); K.el('path', { d: 'M830 620 H1240 M830 680 H1240', stroke: '#7f8d93', 'stroke-width': 5 }, fence);
    const homes = [[260, '#f1d8bd', '#b0563a'], [520, '#dfe8e1', '#5b8fb8'], [760, '#f3e7c9', '#8fb27f']].map(([x, w, r]) => Z.houseFront(sc.mid, x, 740, .78, { wall: w, roof: r }));
    homes.forEach((h, i) => S.rise(h, at('residents') - .3 + i * .1, { y: 40 }));
    const ppl = [[380, { skin: SKIN.s5, hair: 'curly', hairColor: HAIRC.black, top: '#d9805f', outfit: 'tee' }], [640, { skin: SKIN.s3, hair: 'hijab', hairColor: '#e7c178', top: '#9cc7e8', outfit: 'sweater' }]].map(([x, f], i) => { const a = actor(sc.mid, x, 840, .75, { ...f, mood: 'worried' }, 'chin'); life(a, t0, t1, i + 1); return a; });
    ppl.forEach((p, i) => walkIn(p, at('residents') + i * .15, -200, .7));
    // Marginalized: at the edge, under the smoke's shadow.
    const mg = at('marginalized');
    const shadow = K.el('path', { d: 'M1240 300 C900 280 500 330 -200 380 V900 H-200 L-200 380', fill: '#2a2f2a', opacity: 0 }, sc.front);
    tl.to(shadow, { attr: { opacity: .3 }, duration: .8 }, mg - .2);
    const edge = K.el('path', { d: 'M110 160 V860', stroke: '#df8466', 'stroke-width': 5, 'stroke-dasharray': '12 12', fill: 'none' }, sc.front);
    draw(edge, mg, .6);
    [...homes, ...ppl].forEach((n, i) => tl.to(n, { x: -60, duration: 1, ease: 'power3.inOut' }, mg - .1));
    label('concerning', at('concerning'), { x: 900, y: 92, tone: 'clay', hold: .55, size: 38, parent: sc.front });
    label('residents', at('residents'), { x: 520, y: 92, ax: 520, ay: 470, hold: .9, size: 38, parent: sc.front });
    label('marginalized', mg, { x: 560, y: 92, ax: 140, ay: 420, tone: 'clay', hold: 1.2, parent: sc.front });
  }

  /* 3 · Can we balance the goals of technology with the stability and safety of our communities? */
  {
    const t0 = at('can'), t1 = at('can ai');
    const sc = scene(t0, t1, { zoom: [1, 1.04], origin: '800 500' });
    Z.sky(sc.back, '#9fc9e0', '#f2e2c6');
    Z.skyline(sc.back, 640, { color: '#94a9bb', far: '#b2c2d0' });
    K.el('rect', { x: -200, y: 700, width: 2000, height: 300, fill: Z.grad(sc.back, ['#d8cfbf', '#bfb4a2']) }, sc.back);
    const sw = put(sc.mid, 800, 800, 1.2); const scl = K.scale(sw);
    S.rise(sw, t0, { y: 60 });
    const left = K.g(scl.panL), right = K.g(scl.panR);
    const ai = put(left, -230, -150, .4); Z.aiCore(ai, 0, -110, 1, { hud: false });
    const sv = put(left, -160, -150, .42); K.server(sv, { h: 3 });
    const tech = at('technology');
    pop(ai, at('goals') - .1, { origin: '50% 100%', y: -120 }); pop(sv, tech - .2, { origin: '50% 100%', y: -120 });
    const h1 = put(right, 175, -150, .4); K.house(h1, { color: '#d9805f' });
    const h2 = put(right, 255, -150, .36); K.house(h2, { color: '#e7c178' });
    const sh = put(right, 210, -290, .55); K.shield(sh, '#7fe0c4');
    pop(h1, at('stability') - .2, { origin: '50% 100%', y: -120 }); pop(h2, at('stability'), { origin: '50% 100%', y: -120 });
    pop(sh, at('safety') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.6)' });
    const tip = (deg, t, d, ease) => {
      tl.to(scl.beam, { rotation: deg, duration: d, ease, svgOrigin: '0 -256' }, t);
      tl.to(scl.panL, { rotation: -deg, duration: d, ease, svgOrigin: '-210 -255' }, t);
      tl.to(scl.panR, { rotation: -deg, duration: d, ease, svgOrigin: '210 -255' }, t);
    };
    tip(-9, tech, .7, 'back.out(2)');
    tip(5, at('safety'), .6, 'back.out(2)');
    tip(0, at('communities', 2) - .2, 1.1, 'elastic.out(1, .4)');
    burst(sc.front, 800, 470, at('communities', 2) + .3, { color: '#ffd38a', n: 12, r1: 220 });
    const gw = actor(sc.front, 260, 900, .95, { ...GWEN, mood: 'flat' }, 'chin');
    life(gw, t0, t1, 3); talk(gw, t0, t1);
    express(tl, gw.f, at('communities', 2), 'happy');
    label('balance', at('balance'), { x: 800, y: 92, ax: 800, ay: 470, hold: 1.1, parent: sc.front });
    label('goals', at('goals'), { x: 560, y: 92, ax: 520, ay: 420, hold: .5, size: 38, parent: sc.front });
    label('safety', at('safety'), { x: 1080, y: 92, ax: 1050, ay: 330, tone: 'mint', hold: .7, parent: sc.front });
  }

  /* 4 · Can AI actually help the environment instead of harm it? */
  {
    const t0 = at('can ai'), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 520' });
    Z.sky(sc.back, '#8fcbe3', '#fbe9c4');
    const sunG = put(sc.back, 1260, 520, 1); Z.sunDisc(sunG, 0, 0, 90);
    const help = at('help');
    tl.fromTo(sunG, { y: 200 }, { y: 0, duration: 1.6, ease: 'power2.out', immediateRender: true }, help);
    Z.hills(sc.back, ['#b9d9a0', '#8fc07f', '#6fa86b'], 980);
    const rv = Z.river(sc.back, 820, '#6f7f6a');
    tl.to(rv.water, { attr: { fill: '#6fb3cf' }, duration: 1 }, at('environment', 2));
    const turbines = [1040, 1220, 1400].map((x, i) => Z.turbine(sc.back, x, 640, .8 - i * .1));
    turbines.forEach((t, i) => { S.rise(t, help + .3 + i * .12, { y: 80 }); spin(t.blades, help + .3, t1 + 1, 2); });
    const panels = [380, 560].map(x => Z.solar(sc.mid, x, 790, .9));
    panels.forEach((p, i) => S.rise(p, at('environment', 2) + i * .12, { y: 40 }));
    const tr = Z.treeRound(sc.mid, 760, 760, 1.3, { leaf: '#9a9a5a' });
    tl.set(tr, { rotation: -6, transformOrigin: '50% 100%' }, 0);
    tr.blobs.forEach((b, i) => tl.to(b, { attr: { fill: '#5a9a5f' }, duration: .8 }, help + .3 + i * .08));
    tl.to(tr, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .5)', transformOrigin: '50% 100%' }, help + .3);
    const ai = put(sc.front, 1000, 300, 1); Z.aiCore(ai, 0, 0, .45);
    pop(ai, t0 + .1, { origin: '50% 50%' });
    flow(sc.front, 'M960 340 Q860 360 800 440', help - .1, t1, { color: '#7fe0c4', n: 4, speed: .8 });
    // Harm, crossed out: the smokestack fades.
    const stack = put(sc.mid, 200, 760, 1);
    K.el('rect', { x: -30, y: -260, width: 60, height: 260, fill: '#7f8d93' }, stack);
    const sm = put(stack, 0, -270, 1); const smoke = K.factorySmoke(sm);
    const no = K.el('path', { d: 'M100 300 L320 520', stroke: '#df8466', 'stroke-width': 16, 'stroke-linecap': 'round' }, sc.front);
    draw(no, at('harm') + .1, .3);
    tl.to([stack], { autoAlpha: .2, duration: .6 }, at('harm') + .5);
    const gw = actor(sc.front, 560, 960, .95, { ...GWEN, mood: 'smile' }, 'present');
    life(gw, t0, t1, 4); talk(gw, t0, t1);
    Z.grassTufts(sc.front, 905);
    express(tl, gw.f, at('environment', 2), 'happy');
    label('environment', at('environment', 2), { x: 900, y: 92, ax: 760, ay: 460, tone: 'mint', hold: .9, parent: sc.front });
    label('harm', at('harm'), { x: 600, y: 92, ax: 230, ay: 420, tone: 'clay', hold: .8, parent: sc.front });
    const o = Z.orb(sc.front, 1200, 250, .7); pop(o.inner, end('harm') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }
}
