import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Danielle — Connection.
   "It's like we don't want humans to lose the beautiful parts of life, the
    things that are really hard to put into words, like what's going to be the
    impact on human empathy? Because I think empathy is something that a
    machine cannot have, at least so far. I wanna know if AI will improve the
    lives of my loved ones and the generations to come. Will the AI help humans
    to live fulfilled and happy lives? I feel like AI could be a catalyst to
    making humans be more empathetic towards one another." */
export const fullBleed = true;

const DANIELLE = { skin: SKIN.s2, hair: 'long', hairColor: HAIRC.auburn, top: '#8fb27f', outfit: 'cardigan', accent: '#f4f1e6', bottom: '#3b3a4a' };
const FRIEND = { skin: SKIN.s4, hair: 'crop', hairColor: HAIRC.black, top: '#9cc7e8', outfit: 'sweater', bottom: '#2f3e4a' };
const FAMILY = [
  { skin: SKIN.s2, hair: 'short', hairColor: HAIRC.brown, top: '#5b8fb8', outfit: 'shirt' },
  DANIELLE,
  { skin: SKIN.s2, hair: 'ponytail', hairColor: HAIRC.auburn, top: '#e7c178', outfit: 'tee', age: 'child' },
  { skin: SKIN.s2, hair: 'bob', hairColor: HAIRC.white, top: '#d9805f', outfit: 'cardigan', age: 'elder' }
];

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo, drainTo } = helpers(S);
  const D = S.duration;
  const park = (sc, { top = '#f2a77a', bottom = '#fbe0b0', sun = true } = {}) => {
    Z.sky(sc.back, top, bottom);
    if (sun) { const s = put(sc.back, 1240, 470, 1); Z.sunDisc(s, 0, 0, 100, '#ffcf7a'); }
    Z.hills(sc.back, ['#c9c08e', '#a9b27c', '#86a06a'], 1000);
    Z.treeRound(sc.back, 200, 700, 1.3, { leaf: '#6f9a5a' }); Z.treeRound(sc.back, 1450, 690, 1.1, { leaf: '#7fa865' });
  };

  /* 1 · We don't want humans to lose the beautiful parts of life. */
  {
    const t0 = 0, t1 = at('the things');
    const sc = scene(t0, t1, { zoom: [1.05, 1], origin: '800 520' });
    park(sc);
    Z.stringLights(sc.back, 300, 1300, 260, 40).bulbs.forEach((b, i) => tl.to(b, { attr: { opacity: 1 }, duration: .3 }, at('beautiful') + i * .04));
    // A picnic: friends, music, flowers.
    K.el('ellipse', { cx: 800, cy: 820, rx: 420, ry: 60, fill: '#d9694a', opacity: .85 }, sc.mid);
    for (let i = 0; i < 6; i++) K.el('path', { d: `M${420 + i * 130} 790 l60 60`, stroke: '#fbf8f1', 'stroke-width': 10, opacity: .6 }, sc.mid);
    const a = actor(sc.mid, 560, 840, .95, { ...DANIELLE, mood: 'grin' }, 'wave'), b = actor(sc.mid, 820, 840, .95, { ...FRIEND, mood: 'grin' }, 'hold'), c = actor(sc.mid, 1060, 840, .9, { skin: SKIN.s5, hair: 'curly', hairColor: HAIRC.black, top: '#e7c178', outfit: 'tee', mood: 'grin' }, 'cheer');
    [a, b, c].forEach((p, i) => life(p, t0, t1, i + 1));
    const notes = [0, 1, 2].map(i => { const n = put(sc.front, 860 + i * 70, 300 - i * 40, 1); K.musicNote(n, '#e2a64a'); return n; });
    notes.forEach((n, i) => { S.fade(n, .3 + i * .3); loop(n, .5 + i * .3, t1, { y: -18, rotation: 8 }, 1.2); });
    [[380, 860], [1240, 860], [480, 880]].forEach(([x, y], i) => { const f = put(sc.front, x, y, 1); K.flower(f, ['#f0a3a0', '#e7c178', '#9cc7e8'][i]); });
    // "Lose": the colour drains; "beautiful": it all comes back.
    const drain = Z.drain(sc.front, '#7f8580', .55);
    drainTo(drain, at('lose') + .1, true, .4); drainTo(drain, at('beautiful') - .1, false, .5);
    express(tl, a.f, at('lose') + .1, 'worried');
    express(tl, a.f, at('beautiful'), 'happy');
    burst(sc.front, 800, 400, at('beautiful') + .1, { n: 14, r1: 380, color: '#ffd38a' });
    label('beautiful', at('beautiful'), { x: 800, y: 92, ax: 560, ay: 300, hold: 1.4, parent: sc.front });
  }

  /* 2 · …things hard to put into words… the impact on human empathy? */
  {
    const t0 = at('the things'), t1 = at('because');
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 500' });
    park(sc, { top: '#9fb9cf', bottom: '#e9e3d4', sun: false });
    // A park bench.
    K.el('rect', { x: 460, y: 700, width: 680, height: 26, rx: 8, fill: '#8a6a4a' }, sc.mid);
    K.el('rect', { x: 460, y: 620, width: 680, height: 22, rx: 8, fill: '#9a7a5a' }, sc.mid);
    K.el('rect', { x: 500, y: 726, width: 18, height: 100, rx: 4, fill: '#3a3a3a' }, sc.mid); K.el('rect', { x: 1080, y: 726, width: 18, height: 100, rx: 4, fill: '#3a3a3a' }, sc.mid);
    const fr = actor(sc.mid, 920, 860, 1.05, { ...FRIEND, mood: 'sad' }, 'handsDown');
    const dn = actor(sc.mid, 600, 860, 1.05, { ...DANIELLE, mood: 'flat' }, 'idle');
    life(fr, t0, t1, 3); life(dn, t0, t1, 4);
    tilt(tl, fr.f, t0, -8);
    const sp = put(sc.front, 920, 230, 1); const bub = K.speech(sp, { w: 300, h: 150 });
    const letters = ['a', 'b', '?', 'w', '…'].map((ch, i) => K.text(bub.inner, ch, -100 + i * 50, 18, 54, '#22292e', { 'font-family': "'Source Serif 4', Georgia, serif" }));
    pop(sp, t0 + .1, { origin: '50% 100%' });
    letters.forEach((l, i) => tl.to(l, { y: i % 2 ? -14 : 14, rotation: i % 2 ? 18 : -18, duration: .14, repeat: 9, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' }, at('hard') + i * .03));
    tl.to(sp, { autoAlpha: 0, scale: .7, transformOrigin: '50% 100%', duration: .35 }, at('like', 2) - .1);
    const cl = put(sc.front, 930, 220, 1); K.cloud(cl, '#7d8a83');
    pop(cl, at('like', 2) + .1, { origin: '50% 50%' });
    [-30, 0, 30].forEach((x, i) => { const d = K.el('path', { d: `M${x} 40 l-5 14 a6 6 0 0 0 10 0z`, fill: '#9cc7e8' }, cl); tl.fromTo(d, { y: 0, autoAlpha: 1 }, { y: 60, autoAlpha: 0, duration: .6, repeat: 3, ease: 'power1.in', immediateRender: true }, at('like', 2) + .3 + i * .2); });
    const em = at('empathy');
    walkTo(dn, at('impact') - .2, 150, .6);
    pose(tl, dn.f, [9, -8, -60, -30], at('impact') + .3, .5);
    tl.to(cl, { autoAlpha: 0, y: -40, duration: .5 }, em + .2);
    express(tl, fr.f, em + .3, 'calm'); tilt(tl, fr.f, em + .3, 0); express(tl, dn.f, em + .2, 'happy');
    const ht = put(sc.front, 830, 330, .7); K.heart(ht, '#d9694a');
    pop(ht, em, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    Z.glow(sc.back, 830, 500, 360, '#ffd38a', .0);
    label('empathy', em, { x: 800, y: 92, ax: 830, ay: 280, hold: 1.0, parent: sc.front });
  }

  /* 3 · Empathy is something a machine cannot have, at least so far. */
  {
    const t0 = at('because'), t1 = at('i wanna');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '900 480' });
    Z.room(sc.back, Z.PAL.office, { horizon: 700 });
    K.el('rect', { x: 760, y: 160, width: 600, height: 300, rx: 12, fill: '#22292e' }, sc.back);
    K.el('rect', { x: 774, y: 174, width: 572, height: 272, rx: 6, fill: Z.grad(sc.back, ['#173a4f', '#0d2233']) }, sc.back);
    const dn = actor(sc.mid, 420, 880, 1.08, { ...DANIELLE, mood: 'smile' }, 'heart');
    life(dn, t0, t1, 5);
    const hh = put(sc.front, 470, 330, .8); K.heart(hh, '#d9694a');
    pop(hh, at('empathy', 2) - .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    loop(hh, at('empathy', 2) + .5, t1, { scale: 1.1, transformOrigin: '50% 50%' }, .8);
    const rb = Z.bot(sc.mid, 1060, 860, 1.05);
    pop(rb.inner, at('machine') - .3, { origin: '50% 100%', from: .5 });
    const ho = put(sc.front, 1060, 300, 1); const hol = K.heartOutline(ho, '#7fe0c4');
    pop(ho, at('cannot') - .15, { origin: '50% 50%' });
    const no = put(sc.front, 1140, 240, .7); K.cross(no, '#df8466');
    pop(no, at('cannot') + .1, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    tl.to(rb.eyes, { scaleY: .3, svgOrigin: '0 -340', duration: .3 }, at('cannot') + .2);
    // At least so far… the outline flickers, maybe one day.
    tl.to(no, { autoAlpha: .25, duration: .4 }, at('least'));
    tl.to(hol.shape, { attr: { 'stroke-dashoffset': -52 }, duration: 1.2, ease: 'none' }, at('least'));
    const fill = put(sc.front, 1060, 300, 1); K.heart(fill, '#7fe0c4'); fill.setAttribute('opacity', 0);
    tl.to(fill, { attr: { opacity: .4 }, duration: .25, repeat: 3, yoyo: true }, at('so far'));
    tl.to(rb.eyes, { scaleY: 1, svgOrigin: '0 -340', duration: .3 }, at('so far'));
    label('machine', at('machine'), { x: 1060, y: 92, ax: 1060, ay: 420, tone: 'mint', hold: 1.0, parent: sc.front });
    const o = Z.orb(sc.front, 1300, 400, .65); pop(o.inner, at('so far'), { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }

  /* 4 · …improve the lives of my loved ones and the generations to come. */
  {
    const t0 = at('i wanna'), t1 = at('will the');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '700 520' });
    Z.sky(sc.back, '#f6c08a', '#fbe9c4');
    const sunG = put(sc.back, 640, 640, 1); Z.sunDisc(sunG, 0, 0, 130, '#ffcf7a');
    tl.fromTo(sunG, { y: 220 }, { y: 0, duration: 1.8, ease: 'power2.out', immediateRender: true }, at('improve') - .3);
    Z.hills(sc.back, ['#c9c08e', '#a9b27c', '#86a06a'], 1000);
    const xs = [400, 560, 700, 840];
    const fam = FAMILY.map((f, i) => { const a = actor(sc.mid, xs[i], 860, .95, { ...f, mood: 'grin' }, i === 1 ? 'reachR' : 'idle'); life(a, t0, t1, i + 6); return a; });
    fam.forEach((a, i) => S.rise(a, t0 + .1 + i * .1, { y: 30 }));
    fam.forEach((a, i) => express(tl, a.f, at('loved') + i * .08, 'happy'));
    const ai = put(sc.front, 640, 200, 1); Z.aiCore(ai, 0, 0, .32);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    // Generations to come, stretching into the distance.
    const g0 = at('generations');
    for (let i = 0; i < 5; i++) {
      const s = .7 - i * .11, x = 1020 + i * 110 - i * i * 6, y = 860 - i * 50;
      const a = actor(sc.mid, x, y, s, { skin: [SKIN.s1, SKIN.s3, SKIN.s5, SKIN.s2, SKIN.s4][i], hair: ['short', 'long', 'curly', 'bun', 'ponytail'][i], top: ['#e7c178', '#9cc7e8', '#f0a3a0', '#a5e3c6', '#d9805f'][i], mood: 'smile' }, 'idle');
      tl.fromTo(a, { autoAlpha: 0, x: -40 }, { autoAlpha: 1 - i * .12, x: 0, duration: .6, ease: 'expo.out', immediateRender: true }, g0 + i * .12);
    }
    const path = K.el('path', { d: 'M930 860 C1100 820 1300 720 1520 640', stroke: '#fbf8f1', 'stroke-width': 5, 'stroke-dasharray': '4 14', fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, sc.back);
    draw(path, g0 - .1, .8);
    label('improve', at('improve'), { x: 640, y: 92, ax: 640, ay: 160, hold: .9, parent: sc.front });
    label('loved ones', at('loved'), { x: 620, y: 92, ax: 620, ay: 380, hold: .6, size: 38, parent: sc.front });
    label('generations', g0, { x: 1150, y: 92, ax: 1200, ay: 520, hold: 1.1, parent: sc.front });
  }

  /* 5 · Will the AI help humans to live fulfilled and happy lives? */
  {
    const t0 = at('will the'), t1 = at('i feel');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 500' });
    Z.room(sc.back, { ...Z.PAL.home, wall: '#f3dcc0', wallDark: '#e1c29c', trim: '#c49a6c' }, { horizon: 700 });
    Z.shelf(sc.back, 300, 260, 220); Z.frame(sc.back, 1140, 180, 180, 140, '#e7c178');
    Z.lamp(sc.back, 1430, 700, .9);
    Z.table(sc.mid, 800, 820, 620, { top: '#b98a5e', h: 140 });
    const people = [[480, FRIEND], [800, DANIELLE], [1120, FAMILY[0]]].map(([x, f], i) => { const a = actor(sc.mid, x, 900, .95, { ...f, mood: 'smile' }, 'hold'); life(a, t0, t1, i + 12); return a; });
    // Cups fill up — fulfilled.
    [480, 800, 1120].forEach((x, i) => {
      const cup = put(sc.mid, x, 660, 1);
      K.el('path', { d: 'M-40 -80 h80 l-8 80 h-64z', fill: '#fbf8f1', opacity: .5, stroke: '#fbf8f1', 'stroke-width': 4 }, cup);
      const liquid = K.el('path', { d: 'M-38 -76 h76 l-8 74 h-60z', fill: ['#e2a64a', '#d9694a', '#7fae6b'][i] }, cup);
      tl.fromTo(liquid, { scaleY: 0 }, { scaleY: 1, svgOrigin: '0 0', duration: 1.0, ease: 'power2.inOut', immediateRender: true }, at('fulfilled') - .3 + i * .12);
      K.el('path', { d: 'M40 -60 c24 0 24 40 0 40', stroke: '#fbf8f1', 'stroke-width': 6, fill: 'none', opacity: .7 }, cup);
    });
    people.forEach((p, i) => { express(tl, p.f, at('happy') + i * .1, 'happy'); pose(tl, p.f, i === 1 ? 'cheer' : 'hold', at('happy') + .1 + i * .08, .4); });
    label('fulfilled', at('fulfilled'), { x: 800, y: 92, ax: 800, ay: 600, hold: .65, parent: sc.front });
    label('happy', at('happy'), { x: 800, y: 92, ax: 800, ay: 260, hold: 1.0, parent: sc.front });
    const o = Z.orb(sc.front, 1300, 300, .7); pop(o.inner, at('lives', 2) + .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }

  /* 6 · AI could be a catalyst to making humans more empathetic towards one another. */
  {
    const t0 = at('i feel'), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 520' });
    Z.sky(sc.back, '#2c3a6a', '#c97a6a');
    Z.skyline(sc.back, 640, { color: '#3a3a5a', far: '#5a4a6a', lit: '#ffd38a' });
    K.el('rect', { x: -200, y: 700, width: 2000, height: 300, fill: Z.grad(sc.back, ['#6a5a5a', '#4a3e44']) }, sc.back);
    const lights = Z.stringLights(sc.back, 160, 1440, 200, 50);
    const n = 6, R = 290, ring = [];
    for (let i = 0; i < n; i++) {
      const a = Math.PI + i / (n - 1) * Math.PI;
      const x = 800 + Math.cos(a) * 560, y = 860 + Math.sin(a) * -40 - (i % 2) * 10;
      const p = actor(sc.mid, x, y, .82, { skin: [SKIN.s1, SKIN.s3, SKIN.s5, SKIN.s2, SKIN.s4, SKIN.s6][i], hair: ['short', 'long', 'curly', 'bun', 'ponytail', 'hijab'][i], hairColor: [HAIRC.brown, HAIRC.auburn, HAIRC.black, HAIRC.dark, HAIRC.blond, '#5b8fb8'][i], top: ['#e7c178', '#9cc7e8', '#f0a3a0', '#a5e3c6', '#d9805f', '#8fb27f'][i], mood: 'flat' }, 'idle');
      life(p, t0, t1, i + 20); ring.push([p, x]);
    }
    const cat = at('catalyst');
    const ai = put(sc.front, 800, 420, 1); Z.aiCore(ai, 0, 0, .45);
    pop(ai, cat - .4, { origin: '50% 50%', from: .1 });
    const spark = put(sc.front, 800, 420, 1); K.sparkle(spark, '#ffd38a', 80);
    pop(spark, cat, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 800, 420, cat + .1, { n: 18, r1: 360, color: '#ffd38a', size: 10 });
    lights.bulbs.forEach((b, i) => tl.to(b, { attr: { opacity: 1 }, duration: .25 }, cat + .2 + i * .05));
    // Hearts travel from person to person.
    const mk = at('making');
    ring.forEach(([p, x], i) => {
      const h = put(sc.front, x, 380, .5); K.heart(h, '#d9694a');
      pop(h, mk + i * .22, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
      express(tl, p.f, mk + i * .22, 'happy');
      pose(tl, p.f, i < n / 2 ? 'present' : [58, 38, -9, 8], mk + i * .22, .4);
      if (i < n - 1) { const nx = ring[i + 1][1]; const l = K.el('path', { d: `M${x} 380 Q${(x + nx) / 2} 300 ${nx} 380`, stroke: '#f0a3a0', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': '4 10' }, sc.front); draw(l, at('empathetic') - .3 + i * .1, .5); }
    });
    label('catalyst', cat, { x: 800, y: 92, ax: 800, ay: 330, hold: 1.1, parent: sc.front });
    label('empathetic', at('empathetic'), { x: 800, y: 92, ax: 800, ay: 300, hold: 1.3, parent: sc.front });
  }
}
