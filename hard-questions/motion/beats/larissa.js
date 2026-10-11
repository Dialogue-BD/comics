import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Larissa — Creativity.
   "My question for AI companies would be, what's your mission? What's your
    driving force? I'm wondering if AI will rob my son of the opportunity to
    develop his critical thinking skills, his mental muscle, his ability to
    analyze and criticize as he goes through his college education. Will AI's
    capabilities lead me to losing my job as a writer? Can AI be my thought
    partner in writing instead of replacing me as a writer? Can I use AI to help
    generate ideas, stimulating my thinking in a new way?" */
export const fullBleed = true;

const LARISSA = { skin: SKIN.s4, hair: 'bun', hairColor: HAIRC.black, top: '#e7c178', outfit: 'cardigan', accent: '#f4f1e6', bottom: '#3b3a4a', earrings: true };
const SON = { skin: SKIN.s4, hair: 'crop', hairColor: HAIRC.black, top: '#5b8fb8', outfit: 'tee', bottom: '#2f3e4a', age: 'teen' };

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo } = helpers(S);
  const D = S.duration;

  /* Larissa's writing room, used for scenes 6 and 7. */
  const study = (sc) => {
    Z.room(sc.back, { ...Z.PAL.home, wall: '#e9dcc8', wallDark: '#d4c2a8', trim: '#b49c7c' }, { horizon: 690 });
    const w = Z.windowFrame(sc.back, 1080, 130, 320, 340, { sky: ['#a9dcec', '#f6e9cc'] });
    Z.treeRound(w.scene, 200, 380, .7);
    Z.shelf(sc.back, 200, 260, 260); Z.shelf(sc.back, 200, 400, 260);
    Z.frame(sc.back, 560, 170, 150, 120, '#5b8fb8');
    Z.plant(sc.back, 1460, 690, .9);
    Z.desk(sc.mid, 760, 790, 520, { top: '#b98a5e', leg: '#7a5a3c' });
    const lp = put(sc.mid, 700, 604, .95); const laptop = K.laptop(lp);
    return { lp, laptop };
  };

  /* 1 · My question for AI companies would be… */
  {
    const t0 = 0, t1 = at("what's");
    const sc = scene(t0, t1, { zoom: [1.05, 1], origin: '800 500' });
    Z.sky(sc.back, '#8fc1dc', '#f2e3c8');
    Z.skyline(sc.back, 640, { color: '#94a9bb', far: '#b2c2d0' });
    K.el('rect', { x: -200, y: 700, width: 2000, height: 300, fill: Z.grad(sc.back, ['#e0d7c7', '#c6bba8']) }, sc.back);
    const towers = [[860, 300, 560], [1110, 260, 640], [1350, 240, 520]].map(([x, w, h], i) => { const t = Z.tower(sc.mid, x, 720, 1, { w, h, glass: [['#a9cde0', '#5f8fae'], ['#b9d6e6', '#6f9cb8'], ['#a0c4d8', '#57849f']][i] }); return t; });
    towers.forEach((t, i) => tl.fromTo(t, { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, ease: 'expo.out', immediateRender: true }, at('companies') - .4 + i * .12));
    const l = actor(sc.front, 380, 900, 1.08, { ...LARISSA, mood: 'smile' }, 'present');
    life(l, t0, t1, 1);
    const sp = put(sc.front, 520, 300, 1); const bub = K.speech(sp, { w: 150, h: 110 });
    const o = Z.orb(bub.inner, 0, 0, .65);
    pop(sp, at('question'), { origin: '0% 100%', from: .2 });
  }

  /* 2 · What's your mission? What's your driving force? */
  {
    const t0 = at("what's"), t1 = at("i'm");
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 420' });
    Z.room(sc.back, Z.PAL.office, { horizon: 650 });
    // Boardroom screen.
    K.el('rect', { x: 340, y: 100, width: 920, height: 420, rx: 16, fill: '#20262c' }, sc.back);
    K.el('rect', { x: 356, y: 116, width: 888, height: 388, rx: 10, fill: Z.grad(sc.back, ['#173a4f', '#0d2233']) }, sc.back);
    const cg = put(sc.back, 640, 310, 1.2); const cp = K.compass(cg);
    pop(cg, t0, { origin: '50% 50%', from: .4, ease: 'expo.out' });
    tl.fromTo(cp.needle, { rotation: -160 }, { rotation: 25, duration: 1.4, ease: 'elastic.out(1, .4)', svgOrigin: '0 0', immediateRender: true }, at('mission') - .3);
    const g1 = put(sc.back, 960, 290, 1); K.gear(g1, { r: 74, teeth: 12, color: '#e7c178' });
    const g2 = put(sc.back, 1092, 410, 1); K.gear(g2, { r: 52, teeth: 9, color: '#8fb27f' });
    pop(g1, at('driving') - .1, { origin: '50% 50%' }); pop(g2, at('driving'), { origin: '50% 50%' });
    tl.to(g1, { rotation: 200, duration: t1 - at('driving') + .3, ease: 'none', transformOrigin: '50% 50%' }, at('driving'));
    tl.to(g2, { rotation: -285, duration: t1 - at('driving') + .3, ease: 'none', transformOrigin: '50% 50%' }, at('driving'));
    // Long table in perspective.
    K.el('path', { d: 'M480 690 L1120 690 L1340 900 L260 900Z', fill: Z.grad(sc.mid, ['#8a6a4a', '#6b4f36']) }, sc.mid);
    K.el('path', { d: 'M480 690 L1120 690 L1126 700 L474 700Z', fill: '#b08a62' }, sc.mid);
    const l = actor(sc.front, 300, 980, 1.2, { ...LARISSA, mood: 'flat' }, 'pointUp');
    life(l, t0, t1, 2); express(tl, l.f, at('mission'), 'focused');
    label('mission', at('mission'), { x: 640, y: 92, ax: 640, ay: 200, hold: .75, parent: sc.front });
    label('driving force', at('driving'), { x: 1000, y: 92, ax: 1000, ay: 230, hold: 1.2, parent: sc.front });
  }

  /* 3 · …if AI will rob my son of the opportunity… */
  {
    const t0 = at("i'm"), t1 = at('develop');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '900 480' });
    Z.room(sc.back, { ...Z.PAL.home, wall: '#d9cbb8', wallDark: '#bfae96', trim: '#9e8a70' }, { horizon: 700 });
    const dr = Z.door(sc.back, 1100, 700, { color: '#c9b08a', w: 200, h: 420 });
    tl.set(dr.leaf, { scaleX: .12, svgOrigin: `${dr.leaf.dataset.ox} 0` }, 0);
    // Through the open door: a bright future.
    const beyond = K.g(sc.back); beyond.setAttribute('transform', 'translate(1000 280)');
    K.el('rect', { x: 0, y: 0, width: 200, height: 420, fill: Z.grad(beyond, ['#ffe9b8', '#fff7e2']) }, beyond);
    sc.back.insertBefore(beyond, dr);
    const sunlight = K.el('path', { d: 'M1000 700 L760 900 H1360 L1200 700Z', fill: Z.grad(sc.back, [['#ffe9b8', .55], ['#ffe9b8', 0]]) }, sc.back);
    const s = actor(sc.mid, 620, 860, 1.05, { ...SON, mood: 'smile' }, 'reachR');
    life(s, t0, t1, 3);
    walkTo(s, at('son') - .2, 200, 1.2);
    const l = actor(sc.mid, 300, 860, .95, { ...LARISSA, mood: 'flat' }, 'chin');
    life(l, t0, t1, 4);
    const hand = put(sc.front, 1700, 520, 1.3); K.robotHand(hand);
    tl.fromTo(hand, { x: 0 }, { x: -440, duration: .8, ease: 'power3.out', immediateRender: true }, at('rob') - .2);
    tl.to(dr.leaf, { scaleX: 1, duration: .5, ease: 'power3.in', svgOrigin: `${dr.leaf.dataset.ox} 0` }, at('opportunity') - .25);
    tl.to([beyond, sunlight], { autoAlpha: 0, duration: .4 }, at('opportunity') + .05);
    tl.to(hand, { x: 0, duration: .7, ease: 'power2.in' }, at('opportunity') + .4);
    express(tl, s.f, at('opportunity') + .1, 'sad'); express(tl, l.f, at('rob'), 'worried');
    const o = Z.orb(sc.front, 300, 230, .75); pop(o.inner, at('wondering'), { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    label('opportunity', at('opportunity'), { x: 1100, y: 92, ax: 1100, ay: 380, tone: 'clay', hold: 1.0, parent: sc.front });
  }

  /* 4 · …to develop his critical thinking skills, his mental muscle… */
  {
    const t0 = at('develop'), t1 = at('his ability');
    const sc = scene(t0, t1, { zoom: [1, 1.06], origin: '800 400' });
    Z.room(sc.back, { ...Z.PAL.night, wall: '#2c3a5a', wallDark: '#1f2a44', trim: '#18213a', floor: '#3a3048', floorDark: '#2a2236' }, { horizon: 720, wainscot: false });
    Z.windowFrame(sc.back, 1180, 140, 260, 300, { sky: ['#1a2440', '#3a4a70'] });
    Z.lamp(sc.mid, 1080, 720, .9);
    Z.desk(sc.mid, 760, 800, 560, { top: '#8a6a4a', leg: '#5a4a3a' });
    for (let i = 0; i < 3; i++) { const b = put(sc.mid, 560 + i * 34, 600, .6); K.book(b, ['#d9805f', '#5b8fb8', '#8fb27f'][i]); }
    const s = actor(sc.mid, 760, 980, 1.25, { ...SON, mood: 'flat' }, 'write');
    life(s, t0, t1, 5); express(tl, s.f, at('critical'), 'focused');
    // His thinking, drawn as a glowing brain above him.
    const bg = put(sc.front, 760, 230, 1.15); const br = K.brain(bg, { color: '#f0a3a0' });
    pop(bg, t0 + .1, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    [...br.lines.children].forEach((l, i) => { l.setAttribute('stroke', '#ffd38a'); draw(l, at('critical') + i * .08, .5); });
    const gA = put(sc.front, 700, 210, .4); K.gear(gA, { r: 44, color: '#ffd38a' }); const gB = put(sc.front, 820, 260, .32); K.gear(gB, { r: 44, color: '#a5e3c6' });
    pop(gA, at('thinking'), { origin: '50% 50%' }); pop(gB, at('thinking') + .1, { origin: '50% 50%' });
    tl.to(gA, { rotation: 240, duration: t1 - at('thinking'), ease: 'none', transformOrigin: '50% 50%' }, at('thinking'));
    tl.to(gB, { rotation: -300, duration: t1 - at('thinking'), ease: 'none', transformOrigin: '50% 50%' }, at('thinking'));
    const m = put(sc.front, 930, 270, 1); K.muscle(m);
    pop(m, at('mental') - .1, { origin: '0% 100%' });
    tl.to(m, { scale: 1.18, duration: .22, repeat: 3, yoyo: true, ease: 'power2.inOut', transformOrigin: '0% 100%' }, at('muscle'));
    tl.to(bg, { scale: 1.1, duration: .3, repeat: 1, yoyo: true, ease: 'power2.inOut', transformOrigin: '50% 50%' }, at('muscle'));
    label('critical thinking', at('critical'), { x: 1150, y: 92, ax: 880, ay: 180, hold: 1.4, parent: sc.front });
  }

  /* 5 · …his ability to analyze and criticize as he goes through his college education. */
  {
    const t0 = at('his ability'), t1 = at('will', 2);
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '1000 520' });
    Z.sky(sc.back, '#9fd3e6', '#f6e9cc');
    Z.cloudSoft(sc.back, 1300, 130, .8);
    K.el('rect', { x: -200, y: 690, width: 2000, height: 300, fill: Z.grad(sc.back, ['#a6c58d', '#7fae6b']) }, sc.back);
    Z.campus(sc.back, 1040, 700, 1);
    Z.treeRound(sc.back, 560, 700, 1.1); Z.treeRound(sc.back, 1480, 700, 1);
    K.el('path', { d: 'M440 900 C700 820 900 760 1040 700', stroke: '#e9e3d4', 'stroke-width': 70, fill: 'none', 'stroke-linecap': 'round', opacity: .9 }, sc.back);
    // Analyze and criticize: an essay, a lens, red marks.
    const pg = put(sc.front, 330, 380, 1.3); K.doc(pg, { lines: 5 });
    rise(pg, t0);
    function rise(n, t) { S.rise(n, t, { y: 40 }); }
    const mg = put(sc.front, 0, 0, .8); K.magnifier(mg);
    tl.fromTo(mg, { x: 280, y: 330, autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: true }, at('analyze') - .2);
    tl.to(mg, { x: 380, y: 400, duration: .5, ease: 'sine.inOut', repeat: 1, yoyo: true }, at('analyze'));
    const marks = ['M370 340 l10 10 l20 -22', 'M280 416 q30 -12 60 0', 'M382 420 l18 18 M400 420 l-18 18'].map((d, i) => K.el('path', { d, stroke: i ? '#d9694a' : '#2f9e72', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, sc.front));
    marks.forEach((mk, i) => draw(mk, at('criticize') - .1 + i * .18, .3));
    const s = actor(sc.mid, 520, 900, .9, { ...SON, mood: 'smile' }, 'idle');
    life(s, t0, t1, 6);
    const backpack = K.el('rect', { x: -60, y: -420, width: 40, height: 120, rx: 14, fill: '#2f7f73' }, s.content);
    s.content.insertBefore(backpack, s.content.firstChild);
    tl.to(s, { x: 470, y: -170, scale: .7, transformOrigin: '50% 100%', duration: t1 - at('goes'), ease: 'power1.inOut' }, at('goes'));
    tl.to(s.f.parts.body, { y: -10, duration: .2, repeat: Math.floor((t1 - at('goes')) / .2), yoyo: true, ease: 'sine.inOut' }, at('goes'));
    const cap = put(sc.front, 1040, 200, .8); K.gradCap(cap);
    pop(cap, at('education') - .1, { origin: '50% 50%', rot: -15 });
    burst(sc.front, 1040, 200, at('education') + .1, { color: '#ffd38a' });
    label('analyze', at('analyze'), { x: 420, y: 92, ax: 360, ay: 300, hold: .75, parent: sc.front });
    label('education', at('education'), { x: 1040, y: 92, ax: 1040, ay: 260, hold: 1.1, parent: sc.front });
  }

  /* 6 · Will AI's capabilities lead me to losing my job as a writer? */
  {
    const t0 = at('will', 2), t1 = at('can');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '760 480' });
    const { lp, laptop } = study(sc);
    laptop.lines.forEach((ln, i) => draw(ln, t0 + .3 + i * .15, .3));
    const l = actor(sc.mid, 470, 900, 1.05, { ...LARISSA, mood: 'smile' }, 'write');
    life(l, t0, t1, 7);
    const ai = put(sc.front, 1150, 330, 1); const core = Z.aiCore(ai, 0, 0, .4);
    pop(ai, at("ai's") - .1, { origin: '50% 50%', from: .1 });
    const cap = at('capabilities');
    tl.to(ai, { scale: 1.9, duration: 1.0, ease: 'expo.out', transformOrigin: '50% 50%' }, cap);
    spin(core.hud, cap, t1, .6);
    burst(sc.front, 1150, 330, cap + .1, { color: '#a5e3c6', r1: 260, n: 14 });
    const los = at('losing');
    tl.to(lp, { x: 400, y: -240, scale: .4, autoAlpha: 0, duration: .9, ease: 'power3.in' }, los);
    express(tl, l.f, los, 'worried');
    pose(tl, l.f, 'shrug', los + .1, .5);
    label('capabilities', cap, { x: 1150, y: 92, ax: 1150, ay: 210, tone: 'mint', hold: 1.0, parent: sc.front });
    label('writer', at('writer'), { x: 470, y: 92, ax: 470, ay: 260, tone: 'clay', hold: .7, parent: sc.front });
  }

  /* 7 · Can AI be my thought partner in writing instead of replacing me as a writer? */
  {
    const t0 = at('can'), t1 = at('can', 2);
    const sc = scene(t0, t1, { enter: 'fade', zoom: [1.05, 1], origin: '760 480' });
    const { laptop } = study(sc);
    laptop.lines.forEach((ln, i) => { ln.setAttribute('stroke', i % 2 ? '#7fe0c4' : '#ffd38a'); draw(ln, at('writing') - .2 + i * .14, .3); });
    const l = actor(sc.mid, 470, 900, 1.05, { ...LARISSA, mood: 'grin' }, 'write');
    life(l, t0, t1, 8);
    const ai = put(sc.mid, 1040, 560, 1); Z.aiCore(ai, 0, 0, .45, { face: true, hud: false });
    pop(ai, t0 + .1, { origin: '50% 50%', from: .2 });
    loop(ai, t0 + .7, t1, { y: -12 }, 1.4);
    const link = K.el('path', { d: 'M560 380 Q800 240 1020 460', stroke: '#e7c178', 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '6 10', 'stroke-linecap': 'round' }, sc.front);
    draw(link, at('partner'), .6);
    const ht = put(sc.front, 800, 300, .55); K.heart(ht, '#e7a94e');
    pop(ht, at('partner') + .4, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    // Instead of replacing: the swap is crossed out.
    const sw = put(sc.front, 1300, 300, 1);
    K.el('circle', { r: 64, fill: '#fbf8f1' }, sw);
    K.el('path', { d: 'M-30 -12 h50 l-14 -12 M30 12 h-50 l14 12', stroke: '#22292e', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sw);
    const x = K.el('path', { d: 'M-44 -44 L44 44', stroke: '#d9694a', 'stroke-width': 11, 'stroke-linecap': 'round' }, sw);
    pop(sw, at('replacing') - .1, { origin: '50% 50%' });
    draw(x, at('replacing') + .35, .3);
    label('thought partner', at('thought'), { x: 800, y: 92, ax: 800, ay: 260, hold: 1.3, parent: sc.front });
    label('replacing', at('replacing'), { x: 1180, y: 92, ax: 1300, ay: 236, tone: 'clay', hold: .8, parent: sc.front });
  }

  /* 8 · Can I use AI to help generate ideas, stimulating my thinking in a new way? */
  {
    const t0 = at('can', 2), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.08], origin: '520 420' });
    K.el('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: Z.grad(sc.back, ['#2c4a6a', '#5a4a7a', '#c97a6a']) }, sc.back);
    Z.bokeh(sc.back, 18);
    const l = actor(sc.mid, 470, 1300, 1.7, { ...LARISSA, mood: 'smile' }, 'chin');
    life(l, t0, t1, 9);
    const ai = put(sc.mid, 1260, 470, 1); Z.aiCore(ai, 0, 0, .55, { face: true });
    pop(ai, at('use ai') + .1, { origin: '50% 50%', from: .2 });
    const gen = at('generate');
    [[760, 300], [920, 470], [1020, 250], [840, 620], [1100, 640]].forEach(([x, y], i) => {
      const bw = put(sc.front, 0, 0, .6 + (i % 2) * .15); K.bulb(bw);
      tl.fromTo(bw, { x: 1260, y: 470, autoAlpha: 0, scale: .2 }, { x, y, autoAlpha: 1, scale: 1, duration: .8, ease: 'back.out(1.6)', immediateRender: true }, gen + i * .18);
      loop(bw, gen + 1 + i * .2, t1 + 1, { y: '-=10' }, 1.4 + i * .2);
    });
    const st = at('stimulating');
    ['M380 300 C300 230 330 140 420 130', 'M560 300 C640 220 620 140 540 120', 'M470 260 C470 190 520 110 600 90', 'M330 360 C250 350 220 290 240 230'].forEach((d, i) => { const p = K.el('path', { d, stroke: ['#a5e3c6', '#ffd38a', '#9cc7e8', '#f0a3a0'][i], 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, sc.front); draw(p, st + i * .12, .6, 'expo.out'); });
    burst(sc.front, 470, 240, st + .3, { color: '#ffd38a', n: 14, r1: 240 });
    express(tl, l.f, st, 'happy');
    label('ideas', at('ideas'), { x: 920, y: 92, ax: 920, ay: 400, hold: .9, parent: sc.front });
    label('stimulating', st, { x: 520, y: 92, ax: 470, ay: 130, tone: 'mint', hold: 1.3, parent: sc.front });
  }
}
