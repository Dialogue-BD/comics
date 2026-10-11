import { figure, pose, setPose, blinks, tilt, express, SKIN, HAIRC, shade } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Kamille — Health. Reference voice for the scene style.
   "There are a lot of specific fields that would benefit from the use of it.
    Will AI help with quicker medical diagnosis? I'm someone who was diagnosed
    with a chronic illness and it took six years for them to figure out what I
    had. I wonder how my life would have been impacted positively had I been
    able to use AI to get a quicker medical diagnosis." */

const KAMILLE = { skin: SKIN.s4, hair: 'long', hairColor: HAIRC.black, top: '#d9805f', outfit: 'blouse', bottom: '#2f3e4a', earrings: true };
const DOCTOR = { skin: SKIN.s2, hair: 'short', hairColor: HAIRC.brown, glasses: true, coat: true, top: '#9cc7e8', outfit: 'shirt', bottom: '#3a4652' };

export const fullBleed = true;

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst } = S;
  const gsap = window.gsap;
  const { talk, motes } = helpers(S);
  const D = S.duration;
  // An actor: placed at (x,y), animatable in stage units, drawn at scale s.
  const actor = (parent, x, y, s, spec, p = 'idle') => {
    const outer = K.g(parent); outer.setAttribute('transform', `translate(${x} ${y})`);
    const mover = K.g(outer); const content = K.g(mover); content.setAttribute('transform', `scale(${s})`);
    const f = figure(content, spec); setPose(gsap, f, p);
    mover.f = f; return mover;
  };
  const life = (a, t0, t1, seed = 1) => {
    blinks(tl, a.f, t0, t1, seed);
    tl.to(a.f.parts.upper, { y: -3, duration: 1.6, repeat: Math.max(1, Math.floor((t1 - t0) / 1.6)), yoyo: true, ease: 'sine.inOut' }, t0);
  };
  const put = (parent, x, y, s = 1) => { const o = K.g(parent); o.setAttribute('transform', `translate(${x} ${y}) scale(${s})`); return K.g(o); };

  /* The clinic: used for scenes 2 and 6. */
  const clinic = (sc, { blinds = true } = {}) => {
    const pal = Z.PAL.clinic;
    Z.room(sc.back, pal, { horizon: 650 });
    Z.windowFrame(sc.back, 150, 130, 300, 330, { sky: ['#a9dcec', '#f4ecd2'], blinds: blinds ? 9 : 0 });
    Z.lightShaft(sc.back, 'M150 470 L450 470 L760 900 L330 900Z', '#fff3cf', .28);
    Z.frame(sc.back, 560, 180, 150, 120, '#8fc0b0');
    const clock = Z.wallClock(sc.back, 1420, 200, 50);
    Z.cabinet(sc.back, 1450, 650);
    Z.desk(sc.mid, 980, 700, 560, { top: '#e9e3d5', leg: '#9aa39f' });
    const mon = Z.monitor(sc.mid, 980, 514, 1.15, { screen: '#0f2c3a' });
    Z.plant(sc.mid, 1330, 700, .9);
    return { mon, clock };
  };

  /* 1 · A lot of specific fields would benefit. */
  {
    const t0 = 0, t1 = at('will');
    const sc = scene(t0, t1, { zoom: [1, 1], pan: 0 });
    Z.sky(sc.back, '#9fd3e6', '#f6e9cc');
    Z.cloudSoft(sc.back, 260, 150, .9); Z.cloudSoft(sc.back, 1340, 120, .7, '#ffffff', .8);
    Z.hills(sc.back, ['#b9d9a0', '#8fc07f', '#6fa86b'], 1000);
    // The building, cut open like a doll's house.
    const bld = put(sc.mid, 0, 0);
    const X0 = 250, W = 1100, rw = W / 3, Y0 = 200, rh = 225;
    Z.contact(bld, 800, 690, 640, 26, .35);
    K.el('path', { d: `M${X0 - 30} ${Y0} L800 ${Y0 - 90} L${X0 + W + 30} ${Y0}Z`, fill: '#b0563a' }, bld);
    K.el('path', { d: `M${X0 - 30} ${Y0} L800 ${Y0 - 90} L800 ${Y0 - 60} L${X0} ${Y0}Z`, fill: '#ffffff', opacity: .12 }, bld);
    K.el('rect', { x: X0 - 16, y: Y0 - 8, width: W + 32, height: rh * 2 + 30, rx: 6, fill: '#efe3cf' }, bld);
    const rooms = [
      { wall: '#d7e8e1', draw: r => { const m = Z.monitor(r, 240, 180, .42, { screen: '#0f2c3a' }); Z.xray(m.content, 0, -182, .8); return actor(r, 100, 212, .3, DOCTOR, 'present'); } },
      { wall: '#f3e7c9', draw: r => { K.el('rect', { x: 150, y: 40, width: 170, height: 100, rx: 6, fill: '#2f5a46', stroke: '#8a6a4a', 'stroke-width': 6 }, r); for (let i = 0; i < 3; i++) K.el('path', { d: `M170 ${70 + i * 22} h${110 - i * 30}`, stroke: '#e9efe4', 'stroke-width': 4, 'stroke-linecap': 'round' }, r); return actor(r, 100, 212, .3, { skin: SKIN.s5, hair: 'bun', hairColor: HAIRC.black, top: '#2f7f73', outfit: 'cardigan' }, 'pointUp'); } },
      { wall: '#dce9f4', draw: r => { K.el('rect', { x: 150, y: 140, width: 170, height: 16, rx: 4, fill: '#9aa39f' }, r); const fl = K.g(r); fl.setAttribute('transform', 'translate(240 136) scale(.45)'); K.flask(fl, '#7fe0c4'); return actor(r, 100, 212, .3, { skin: SKIN.s1, hair: 'ponytail', hairColor: HAIRC.auburn, coat: true, top: '#e7c178' }, 'reachR'); } },
      { wall: '#e7f0d8', draw: r => { for (let i = 0; i < 4; i++) Z.plant(r, 160 + i * 46, 212, .3, { pot: '#b9875b', leaf: ['#4f9a6a', '#6fae5a', '#3f8a5a', '#5aa070'][i] }); return actor(r, 90, 212, .3, { skin: SKIN.s3, hair: 'short', hairColor: HAIRC.black, top: '#8fb27f', outfit: 'shirt', beard: true }, 'reachR'); } },
      { wall: '#f6dcc9', draw: r => { K.el('path', { d: 'M200 212 L230 90 M290 212 L260 90', stroke: '#8a6a4a', 'stroke-width': 6 }, r); K.el('rect', { x: 186, y: 50, width: 120, height: 100, rx: 4, fill: '#fbf8f1' }, r); K.el('path', { d: 'M200 120 C230 70 260 140 292 80', stroke: '#d9805f', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, r); K.el('circle', { cx: 250, cy: 80, r: 14, fill: '#e7c178' }, r); return actor(r, 100, 212, .3, { skin: SKIN.s2, hair: 'curly', hairColor: HAIRC.red, top: '#5b8fb8', outfit: 'tee' }, 'point'); } },
      { wall: '#e6e2d8', draw: r => { Z.desk(r, 240, 212, 180, { top: '#c9a27a', leg: '#8a6a4a' }); const lp = K.g(r); lp.setAttribute('transform', 'translate(240 120) scale(.5)'); K.laptop(lp); return actor(r, 100, 212, .3, { skin: SKIN.s4, hair: 'crop', hairColor: HAIRC.black, top: '#e7c178', outfit: 'shirt', glasses: true }, 'present'); } }
    ];
    const rects = [];
    rooms.forEach((rm, i) => {
      const cx = X0 + (i % 3) * rw, cy = Y0 + Math.floor(i / 3) * (rh + 14);
      const r = K.g(bld); r.setAttribute('transform', `translate(${cx + 8} ${cy + 8})`);
      const cid = K.id('room'); const cp = K.el('clipPath', { id: cid }, r); K.el('rect', { x: 0, y: 0, width: rw - 16, height: rh, rx: 4 }, cp);
      const inner = K.g(r, { 'clip-path': `url(#${cid})` });
      K.el('rect', { x: 0, y: 0, width: rw - 16, height: rh, fill: Z.grad(inner, [shade(rm.wall, .06), shade(rm.wall, -.08)]) }, inner);
      K.el('rect', { x: 0, y: rh - 22, width: rw - 16, height: 22, fill: shade(rm.wall, -.28) }, inner);
      K.el('rect', { x: 0, y: 0, width: rw - 16, height: 26, fill: '#000', opacity: .12 }, inner);
      const a = rm.draw(inner);
      const warm = K.el('rect', { x: 0, y: 0, width: rw - 16, height: rh, fill: '#ffd38a', opacity: 0 }, inner);
      rects.push({ a, warm, cx: cx + rw / 2, cy: cy + rh / 2 });
      life(a, 0, t1, i + 2);
    });
    K.el('rect', { x: X0 - 16, y: Y0 + rh + 4, width: W + 32, height: 14, fill: '#d8c9ae' }, bld);
    // Camera: start inside the clinic, pull back to reveal all the fields.
    tl.fromTo(bld, { scale: 2.5 }, { scale: 1, svgOrigin: `${rects[0].cx} ${rects[0].cy}`, duration: 1.7, ease: 'power3.inOut', immediateRender: true }, .25);
    label('fields', at('fields'), { x: 800, y: 800, hold: 1.0 });
    // Benefit: AI lights up every room.
    const ben = at('benefit');
    const ai = Z.aiCore(sc.front, 800, 64, .42);
    pop(ai.inner, ben - .2, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    spin(ai.hud, ben, t1, .3);
    rects.forEach(({ warm, cx, cy }, i) => {
      const beam = K.el('path', { d: `M800 110 Q${(800 + cx) / 2} ${Math.min(cy, 200) - 40} ${cx} ${cy - 70}`, stroke: '#a5e3c6', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', opacity: .9 }, sc.front);
      draw(beam, ben + .05 + i * .06, .45);
      tl.to(warm, { attr: { opacity: .22 }, duration: .4 }, ben + .35 + i * .06);
      burst(sc.front, cx, cy - 70, ben + .45 + i * .06, { n: 6, r0: 6, r1: 40, size: 5, color: '#ffe2a0' });
    });
    rects.forEach(({ a }, i) => pose(tl, a.f, 'cheer', ben + .6 + i * .05, .5));
    label('benefit', ben, { x: 800, y: 800, tone: 'mint', hold: 1.4 });
  }

  /* 2 · Will AI help with quicker medical diagnosis? */
  {
    const t0 = at('will'), t1 = at("i'm someone");
    const sc = scene(t0, t1, { zoom: [1.02, 1.08], origin: '900 420' });
    const { mon } = clinic(sc);
    Z.xray(mon.content, -20, -182, 1.05);
    motes(sc.back, [180, 480, 500, 380], t0, t1, 18);
    const doc = actor(sc.mid, 560, 820, .98, DOCTOR, 'idle');
    life(doc, t0, t1, 3);
    pose(tl, doc.f, 'present', t0 + .3, .6);
    // AI scans the X-ray.
    const ai = Z.aiCore(sc.front, 1260, 250, .38);
    pop(ai.inner, at('ai') - .05, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    spin(ai.hud, at('ai'), t1, .4);
    const beam = K.el('path', { d: 'M1210 280 C1170 300 1150 330 1120 360', stroke: '#a5e3c6', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '4 8' }, sc.front);
    draw(beam, at('help'), .4);
    const scan = K.el('rect', { x: -158, y: -278, width: 316, height: 10, fill: Z.grad(mon.content, [['#7fe0c4', 0], ['#7fe0c4', .9], ['#7fe0c4', 0]]) }, mon.content);
    tl.fromTo(scan, { y: 0 }, { y: 182, duration: .6, ease: 'sine.inOut', repeat: 3, yoyo: true, immediateRender: true }, at('help'));
    // Quicker: a progress bar fills fast.
    K.el('rect', { x: -130, y: -112, width: 260, height: 12, rx: 6, fill: '#ffffff', opacity: .15 }, mon.content);
    const bar = K.el('rect', { x: -130, y: -112, width: 260, height: 12, rx: 6, fill: '#7fe0c4' }, mon.content);
    const q = at('quicker');
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, svgOrigin: '-130 -106', duration: .5, ease: 'power4.out', immediateRender: true }, q - .05);
    const lines = K.g(sc.front);
    for (let i = 0; i < 3; i++) K.el('path', { d: `M${760 - i * 10} ${300 + i * 26} h${-90 + i * 20}`, stroke: '#e7c178', 'stroke-width': 7, 'stroke-linecap': 'round' }, lines);
    [...lines.children].forEach((l, i) => draw(l, q + i * .05, .3, 'power3.out'));
    tl.to(lines, { autoAlpha: 0, duration: .3 }, q + .7);
    label('quicker', q, { x: 980, y: 92, ax: 980, ay: 412, hold: .6, tone: 'mint', parent: sc.front });
    // Diagnosis: the spot is found.
    const dg = at('diagnosis');
    const ring = K.el('circle', { cx: 958, cy: 288, r: 30, fill: 'none', stroke: '#ffd38a', 'stroke-width': 5 }, sc.front);
    tl.fromTo(ring, { scale: 2.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, svgOrigin: '958 288', duration: .45, ease: 'back.out(2)', immediateRender: true }, dg - .1);
    express(tl, doc.f, dg, 'surprised');
    label('diagnosis', dg + .05, { x: 980, y: 92, ax: 958, ay: 258, hold: .85, parent: sc.front });
    const o = Z.orb(sc.front, 380, 170, .8);
    pop(o.inner, end('diagnosis') - .15, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    Z.foliage(sc.front, 60, 900, 1.6);
  }

  /* 3 · I'm someone who was diagnosed with a chronic illness. */
  {
    const t0 = at("i'm someone"), t1 = at('took');
    const sc = scene(t0, t1, { zoom: [1.06, 1.0], origin: '760 420' });
    const pal = { ...Z.PAL.home, wall: '#d9c3b0', wallDark: '#b9a08a', trim: '#9a7f69' };
    Z.room(sc.back, pal, { horizon: 690 });
    const w = Z.windowFrame(sc.back, 230, 120, 380, 400, { sky: ['#4d5f80', '#9aa3b8'] });
    // Rain on the glass.
    const rain = K.g(w.scene);
    for (let i = 0; i < 22; i++) {
      const x = (i * 71) % 380, y = (i * 113) % 400, ln = K.el('path', { d: `M${x} ${y} l-8 34`, stroke: '#dfe8f5', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: .55 }, rain);
      tl.fromTo(ln, { y: -60 }, { y: 420, duration: .9 + (i % 4) * .15, ease: 'none', repeat: 3, immediateRender: true }, t0 - .5 + (i % 5) * .12);
    }
    Z.lamp(sc.back, 1360, 700, 1.05);
    Z.shelf(sc.back, 1000, 300, 220);
    const cal = Z.wallCalendar(sc.back, 1120, 470, .95, '');
    // Chronic: the pages keep turning — it lasts and lasts.
    const pages = K.g(cal);
    for (let i = 0; i < 5; i++) {
      const pg = K.el('rect', { x: -64, y: -30, width: 128, height: 110, rx: 4, fill: '#fbf8f1', stroke: '#d8d0c0', 'stroke-width': 2 }, pages);
      tl.fromTo(pg, { scaleY: 1, y: 0, autoAlpha: 1 }, { scaleY: 0, y: -40, autoAlpha: 0, svgOrigin: '0 -30', duration: .35, ease: 'power2.in', immediateRender: true }, at('chronic') - .2 + i * .32);
    }
    const k = actor(sc.mid, 720, 1160, 1.55, { ...KAMILLE, mood: 'flat' }, 'idle');
    life(k, t0, t1, 4); talk(k, t0, t1);
    pose(tl, k.f, 'hold', at('diagnosed') - .3, .6);
    const letter = put(sc.mid, 720, 610, 1); K.doc(letter, { mark: 'cross', w: 130, h: 160 });
    tl.fromTo(letter, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, ease: 'expo.out', immediateRender: true }, at('diagnosed') - .1);
    express(tl, k.f, at('diagnosed'), 'worried');
    tilt(tl, k.f, at('chronic'), -5, .8);
    label('chronic illness', at('chronic'), { x: 1120, y: 92, ax: 1120, ay: 400, tone: 'clay', hold: 1.0, parent: sc.front });
  }

  /* 4 · It took six years for them to figure out what I had. */
  {
    const t0 = at('took'), t1 = at('i wonder');
    const sc = scene(t0, t1, { zoom: [1, 1.04], origin: '800 450' });
    Z.room(sc.back, Z.PAL.clinic, { horizon: 660 });
    const w = Z.windowFrame(sc.back, 520, 110, 520, 360, { sky: ['#9fd3e6', '#f6e9cc'] });
    const sunG = put(w.scene, 0, 0); Z.sunDisc(sunG, 0, 0, 34);
    Z.hills(w.scene, ['#b9d9a0', '#8fc07f', '#6fa86b'], 560);
    const tr = Z.treeRound(w.scene, 270, 330, .8);
    // Time-lapse: the sun races across the window again and again; the tree turns with the seasons.
    const six = at('six'), yrs = end('years');
    for (let i = 0; i < 6; i++) tl.fromTo(sunG, { x: -40, y: 200 }, { motionPath: { path: [{ x: 130, y: 60 }, { x: 260, y: 30 }, { x: 390, y: 60 }, { x: 560, y: 200 }], curviness: 1 }, duration: .3, ease: 'none', immediateRender: i === 0 }, six - .2 + i * .3);
    const seasons = ['#d9913f', '#e8e4dc', '#e9a3b8', '#5a9a5f'];
    tr.blobs.forEach(b => seasons.forEach((c, j) => tl.to(b, { attr: { fill: c }, duration: .35 }, six - .1 + j * .4)));
    const cal = Z.wallCalendar(sc.back, 330, 330, 1.25, '1');
    count(cal.label, six - .05, 1, 6, yrs - six + .35);
    const clk = Z.wallClock(sc.back, 1250, 200, 46);
    tl.to(clk.minute, { rotation: 360 * 8, svgOrigin: '0 0', duration: 2.2, ease: 'power1.inOut' }, t0);
    tl.to(clk.hour, { rotation: 360 * 2, svgOrigin: '0 0', duration: 2.2, ease: 'power1.inOut' }, t0);
    Z.waitingChairs(sc.mid, 1080, 680, 3, '#2f7f73');
    const dr = Z.door(sc.back, 1500, 660, { color: '#c9b08a' });
    const k = actor(sc.mid, 760, 790, .95, { ...KAMILLE, mood: 'flat' }, 'chin');
    life(k, t0, t1, 5); talk(k, t0, t1);
    tilt(tl, k.f, t0 + .2, -4);
    express(tl, k.f, t0 + .2, 'worried');
    label('years', at('years'), { x: 330, y: 92, ax: 330, ay: 250, hold: .7, parent: sc.front });
    // Figure out: the doctor arrives with the answer.
    const fig = at('figure');
    tl.to(dr.leaf, { scaleX: .1, svgOrigin: `${dr.leaf.dataset.ox} 0`, duration: .45, ease: 'power3.inOut' }, fig - .55);
    const doc = actor(sc.mid, 1290, 800, .9, { ...DOCTOR, mood: 'grin' }, 'hold');
    tl.fromTo(doc, { x: 200, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .7, ease: 'expo.out', immediateRender: true }, fig - .45);
    const clip = put(sc.mid, 1290, 520, 1); K.doc(clip, { lines: 3, w: 90, h: 110 });
    tl.fromTo(clip, { x: 200, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .7, ease: 'expo.out', immediateRender: true }, fig - .45);
    const piece = put(sc.front, 1150, 430, .8); K.puzzle(piece, '#e7c178');
    pop(piece, fig + .2, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 1150, 430, fig + .3, { color: '#ffd38a' });
    express(tl, k.f, fig + .3, 'surprised');
    tilt(tl, k.f, fig + .3, 4);
    label('figure out', fig, { x: 1100, y: 92, ax: 1150, ay: 395, hold: 1.0, parent: sc.front });
  }

  /* 5 · I wonder how my life would have been impacted positively… */
  {
    const t0 = at('i wonder'), t1 = at('able');
    const sc = scene(t0, t1, { zoom: [1, 1], pan: 0 });
    const pal = { ...Z.PAL.home, wall: '#c9b2c9', wallDark: '#a990ad', trim: '#8a7090' };
    Z.room(sc.back, pal, { horizon: 720 });
    Z.windowFrame(sc.back, 120, 140, 300, 380, { sky: ['#5a5f8f', '#f2a77a'] });
    Z.lamp(sc.back, 1460, 740, .9);
    const k = actor(sc.mid, 470, 1180, 1.6, { ...KAMILLE, mood: 'flat' }, 'chin');
    life(k, t0, t1, 6); talk(k, t0, at('impacted') - .3);
    tilt(tl, k.f, t0 + .2, 6);
    express(tl, k.f, t0 + .3, 'calm');
    // The daydream: a sunny day in the life she imagines.
    const dream = K.g(sc.front);
    const cid = K.id('dream'); const cp = K.el('clipPath', { id: cid }, dream);
    const cl = K.el('ellipse', { cx: 800, cy: 450, rx: 820, ry: 470 }, cp);
    const world = K.g(dream, { 'clip-path': `url(#${cid})` });
    Z.sky(world, '#8fcbe3', '#fbe9c4');
    const sunW = put(world, 1240, 210); Z.sunDisc(sunW, 0, 0, 80);
    Z.cloudSoft(world, 380, 170, 1); Z.cloudSoft(world, 980, 120, .8);
    Z.hills(world, ['#b9d9a0', '#8fc07f', '#6fa86b'], 1000);
    Z.treeRound(world, 230, 760, 1.3); Z.treeRound(world, 1420, 740, 1.1, { leaf: '#6fae5a' });
    const kid1 = actor(world, 1000, 830, .62, { skin: SKIN.s3, hair: 'curly', hairColor: HAIRC.black, top: '#e7c178', outfit: 'tee', age: 'child', mood: 'grin' }, 'cheer');
    const kid2 = actor(world, 1170, 830, .62, { skin: SKIN.s1, hair: 'ponytail', hairColor: HAIRC.blond, top: '#5b8fb8', outfit: 'tee', age: 'child', mood: 'grin' }, 'wave');
    const kd = actor(world, 760, 850, .95, { ...KAMILLE, mood: 'grin', outfit: 'tee', top: '#e7c178' }, 'cheer');
    life(kd, t0, t1, 7); life(kid1, t0, t1, 8); life(kid2, t0, t1, 9);
    const rim = K.el('ellipse', { cx: 800, cy: 450, rx: 820, ry: 470, fill: 'none', stroke: '#fbf8f1', 'stroke-width': 14 }, dream);
    // The thought bubble starts small beside her head, then grows to fill the screen.
    const wnd = at('wonder');
    tl.fromTo(dream, { scale: 0, x: 0, y: 0 }, { scale: .4, x: 590, y: 70, duration: .7, ease: 'back.out(1.5)', svgOrigin: '0 0', immediateRender: true }, wnd);
    const tails = [[740, 470, 26], [690, 540, 16]].map(([x, y, r]) => { const c = K.el('circle', { cx: x, cy: y, r, fill: '#fbf8f1' }, sc.front); pop(c, wnd - .1, { origin: '50% 50%', from: 0 }); return c; });
    const imp = at('impacted');
    tl.to(dream, { scale: 1, x: 0, y: 0, duration: 1.0, ease: 'expo.inOut', svgOrigin: '0 0' }, imp - .5);
    tl.to(cl, { attr: { rx: 1300, ry: 900 }, duration: 1.0, ease: 'expo.inOut' }, imp - .5);
    tl.to(rim, { autoAlpha: 0, duration: .4 }, imp - .1);
    tl.to(tails, { autoAlpha: 0, duration: .2 }, imp - .5);
    const pos = at('positively');
    tl.fromTo(sunW, { scale: 1 }, { scale: 1.35, svgOrigin: '0 0', duration: .8, ease: 'back.out(2)', immediateRender: true }, pos - .1);
    burst(world, 760, 330, pos, { n: 16, r0: 30, r1: 260, color: '#ffd38a', size: 10 });
    pose(tl, kd.f, 'wave', pos + .2, .4);
    label('positively', pos, { x: 800, y: 92, hold: 1.2, tone: 'gold', parent: sc.front });
  }

  /* 6 · …had I been able to use AI to get a quicker medical diagnosis. */
  {
    const t0 = at('able'), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 420' });
    const { mon } = clinic(sc, { blinds: false });
    // On screen: six years shrink to a short wait.
    const bars = K.g(mon.content);
    K.el('rect', { x: -140, y: -240, width: 280, height: 34, rx: 8, fill: '#ffffff', opacity: .08 }, bars);
    const long = K.el('rect', { x: -140, y: -240, width: 280, height: 34, rx: 8, fill: '#df8466' }, bars);
    const ticks = []; for (let i = 0; i < 6; i++) { const tx = K.el('text', { x: -117 + i * 47, y: -217, 'text-anchor': 'middle', 'font-family': "'Public Sans',sans-serif", 'font-weight': 800, 'font-size': 18, fill: '#fff' }, bars); tx.textContent = String(i + 1); ticks.push(tx); }
    const q = at('quicker', 2);
    tl.to(long, { attr: { width: 56, fill: '#7fe0c4' }, duration: .7, ease: 'expo.inOut' }, q - .1);
    tl.to(ticks.slice(1), { autoAlpha: 0, duration: .25, stagger: .04 }, q - .1);
    const ai = Z.aiCore(sc.mid, 980, 340, .32, { hud: false });
    pop(ai.inner, at('ai', 2) - .05, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    const k = actor(sc.mid, 470, 830, .98, { ...KAMILLE, mood: 'smile' }, 'idle');
    const doc = actor(sc.mid, 1250, 830, .95, { ...DOCTOR, mood: 'smile' }, 'idle');
    life(k, t0, t1, 10); life(doc, t0, t1, 11); talk(k, t0, t1);
    pose(tl, doc.f, 'pointL', t0 + .4, .6);
    const dg = at('diagnosis', 2);
    pose(tl, k.f, 'heart', dg - .2, .5);
    express(tl, k.f, dg, 'happy');
    const ok = put(sc.front, 980, 470, 1); K.check(ok, '#7fe0c4');
    pop(ok, dg, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 980, 470, dg + .1, { color: '#a5e3c6' });
    label('quicker', q, { x: 980, y: 92, ax: 900, ay: 240, hold: .9, tone: 'mint', parent: sc.front });
    const o = Z.orb(sc.front, 1130, 150, .75);
    pop(o.inner, end('diagnosis', 2) - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
    loop(o.inner, end('diagnosis', 2) + .5, t1 + 2, { y: -10 }, 1.6);
  }
}
