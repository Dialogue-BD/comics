import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Sarah — Support.
   "My youngest has autism. He's 13, but as he becomes an adult, what kind of
    AI technology can assist him to live an independent life? What can that do
    for him so that he can be as independent as possible as he grows? So I'm
    thinking about kids with special needs. Can AI help me be a better teacher,
    better mom, better wife?"
   Her son is shown simply as himself — no symbols or stereotypes for autism. */
export const fullBleed = true;

const SARAH = { skin: SKIN.s1, hair: 'long', hairColor: HAIRC.brown, top: '#7fc8a9', outfit: 'sweater', bottom: '#3b3a4a' };
const SON = { skin: SKIN.s1, hair: 'short', hairColor: HAIRC.brown, top: '#e7c178', outfit: 'tee', bottom: '#2f3e4a' };
const HUSBAND = { skin: SKIN.s2, hair: 'short', hairColor: HAIRC.dark, top: '#5b8fb8', outfit: 'shirt', beard: true };

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo, talk, motes } = helpers(S);
  const D = S.duration;

  /* 1 · My youngest has autism. He's 13, but as he becomes an adult… */
  {
    const t0 = 0, t1 = at('what');
    const sc = scene(t0, t1, { zoom: [1.04, 1], origin: '700 500' });
    Z.room(sc.back, { ...Z.PAL.home, wall: '#e9dcc8' }, { horizon: 700 });
    const w = Z.windowFrame(sc.back, 1080, 130, 340, 340, { sky: ['#a9dcec', '#f6e9cc'] });
    Z.treeRound(w.scene, 200, 380, .7);
    Z.frame(sc.back, 260, 190, 170, 130, '#e7c178');
    Z.sofa(sc.back, 380, 720, .8, '#8fb27f');
    const sa = actor(sc.mid, 520, 870, 1.05, { ...SARAH, mood: 'smile' }, 'reachR');
    life(sa, t0, t1, 1); talk(sa, t0, t1);
    motes(sc.back, [1060, 160, 380, 520], t0, t1, 14);
    const teen = actor(sc.mid, 820, 870, 1.0, { ...SON, age: 'teen', mood: 'smile' }, 'idle');
    const adult = actor(sc.mid, 860, 870, 1.05, { ...SON, mood: 'grin' }, 'idle');
    life(teen, t0, t1, 2); life(adult, t0, t1, 3);
    S.rise(teen, at('youngest') - .2, { y: 30 });
    tl.set(adult, { autoAlpha: 0 }, 0);
    const ck = Z.cake(sc.mid, 1180, 760, .8, 0);
    const num = K.el('text', { x: 1180, y: 600, 'text-anchor': 'middle', 'font-family': "'Source Serif 4', Georgia, serif", 'font-weight': 700, 'font-size': 120, fill: '#e2a64a' }, sc.front);
    pop(num, at('13') - .4, { origin: '50% 100%' }); count(num, at('13') - .4, 1, 13, .6);
    Z.table(sc.mid, 1180, 870, 240, { top: '#c9a27a', h: 110 });
    // Growing up: the teenager becomes a young man.
    const bc = at('becomes');
    tl.to(teen, { autoAlpha: 0, scale: 1.08, transformOrigin: '50% 100%', duration: .7, ease: 'power2.inOut' }, bc);
    tl.fromTo(adult, { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, transformOrigin: '50% 100%', duration: .7, ease: 'power2.inOut', immediateRender: false }, bc);
    tl.to(num, { autoAlpha: 0, duration: .3 }, bc);
    const arrow = K.el('path', { d: 'M1000 820 V420 l-22 30 M1000 420 l22 30', stroke: '#e2a64a', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sc.front);
    draw(arrow, bc, .8, 'expo.out');
    label('autism', at('autism'), { x: 820, y: 92, ax: 820, ay: 300, tone: 'mint', hold: .8, size: 38, parent: sc.front });
    label('adult', at('adult'), { x: 860, y: 92, ax: 860, ay: 250, hold: .55, parent: sc.front });
  }

  /* 2 · …what kind of AI technology can assist him to live an independent life? */
  {
    const t0 = at('what'), t1 = at('what', 2);
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 500' });
    Z.room(sc.back, { ...Z.PAL.home, wall: '#dfe8e1', wallDark: '#c7d6cc', trim: '#a9bfb1', floor: '#c9a27a', floorDark: '#a98258' }, { horizon: 700 });
    // His own kitchen.
    K.el('rect', { x: 120, y: 460, width: 600, height: 240, rx: 6, fill: '#f7f3ea' }, sc.back);
    K.el('rect', { x: 100, y: 440, width: 640, height: 26, rx: 6, fill: '#9aa39f' }, sc.back);
    for (let i = 0; i < 4; i++) K.el('rect', { x: 140 + i * 145, y: 490, width: 130, height: 190, rx: 6, fill: '#e9e3d5', stroke: '#d4cdbb', 'stroke-width': 3 }, sc.back);
    K.el('rect', { x: 140, y: 150, width: 560, height: 160, rx: 6, fill: '#f7f3ea' }, sc.back);
    for (let i = 0; i < 4; i++) { K.el('rect', { x: 150 + i * 137, y: 160, width: 127, height: 140, rx: 4, fill: '#efe9dc', stroke: '#d4cdbb', 'stroke-width': 3 }, sc.back); K.el('rect', { x: 150 + i * 137 + (i % 2 ? 12 : 100), y: 222, width: 14, height: 16, rx: 4, fill: '#9aa39f' }, sc.back); }
    K.el('rect', { x: 140, y: 310, width: 560, height: 14, fill: '#000', opacity: .08 }, sc.back);
    const dr = Z.door(sc.back, 1280, 700, { color: '#5b8fb8', w: 190, h: 400 });
    const son = actor(sc.mid, 760, 900, .98, { ...SON, mood: 'smile' }, 'hold');
    life(son, t0, t1, 4);
    const ph = put(sc.mid, 760, 610, 1.0); K.phone(ph);
    S.fade(ph, t0 + .2);
    // Helpers on his phone: reminders, a calendar, a map.
    const tools = [
      [480, 330, i => { const c = K.g(i); c.setAttribute('transform', 'scale(.5)'); K.calendar(c, { label: '' }); }],
      [760, 170, i => { K.el('path', { d: 'M0 30 C-26 0 -26 -30 0 -30 C26 -30 26 0 0 30Z', fill: '#d9805f' }, i); K.el('circle', { cy: -10, r: 9, fill: '#fbf8f1' }, i); }],
      [1040, 330, i => { const b = K.g(i); b.setAttribute('transform', 'scale(.45)'); const sp = K.speech(b, { w: 140, h: 90 }); for (let k = 0; k < 3; k++) K.el('circle', { cx: -30 + k * 30, cy: 0, r: 9, fill: '#7fae8f' }, sp.inner); }]
    ];
    const cards = tools.map(([x, y, d]) => { const b = put(sc.front, x, y, 1); b.glow = Z.glow(b, 0, 0, 100, '#7fe0c4', .6); b.glow.setAttribute('opacity', 0); K.el('circle', { r: 52, fill: '#fbf8f1' }, b); b.ring = K.el('circle', { r: 52, fill: 'none', stroke: '#e7c178', 'stroke-width': 5 }, b); d(K.g(b)); return b; });
    cards.forEach((c, i) => pop(c, at('technology') - .2 + i * .14, { origin: '50% 50%' }));
    const ai = put(sc.front, 300, 230, 1); Z.aiCore(ai, 0, 0, .3, { hud: false });
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    const as = at('assist');
    cards.forEach((c, i) => { tl.to(c.glow, { attr: { opacity: 1 }, duration: .4 }, as + i * .1); tl.to(c.ring, { attr: { stroke: '#7fe0c4' }, duration: .4 }, as + i * .1); const l = K.el('path', { d: `M760 560 L${tools[i][0]} ${tools[i][1] + 52}`, stroke: '#7fe0c4', 'stroke-width': 3, 'stroke-dasharray': '4 8', fill: 'none' }, sc.front); sc.front.insertBefore(l, sc.front.firstChild); draw(l, as + i * .1, .4); });
    // Independent life: his own key, his own door.
    const ky = put(sc.front, 0, 0, .9); K.key(ky);
    tl.fromTo(ky, { x: 900, y: 520, autoAlpha: 0, rotation: -30 }, { autoAlpha: 1, rotation: 0, duration: .5, ease: 'back.out(2)', immediateRender: true }, at('independent') - .2);
    tl.to(ky, { x: 1240, y: 500, rotation: 90, scale: .5, duration: .7, ease: 'power2.inOut' }, at('life'));
    tl.to(dr.leaf, { scaleX: .12, svgOrigin: `${dr.leaf.dataset.ox} 0`, duration: .5, ease: 'power3.inOut' }, at('life') + .4);
    express(tl, son.f, at('life'), 'happy');
    label('assist', as, { x: 760, y: 92, ax: 760, ay: 118, tone: 'mint', hold: .9, parent: sc.front });
    label('independent', at('independent'), { x: 1100, y: 92, ax: 1280, ay: 340, hold: 1.0, parent: sc.front });
  }

  /* 3 · …as independent as possible as he grows. */
  {
    const t0 = at('what', 2), t1 = at('so i');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 520' });
    Z.street(sc.back, { curb: 740 });
    // A bus stop.
    const stop = K.g(sc.mid);
    K.el('rect', { x: 1180, y: 380, width: 12, height: 320, fill: '#5a6a6a' }, stop);
    K.el('rect', { x: 1150, y: 360, width: 80, height: 60, rx: 8, fill: '#2f7f73' }, stop);
    K.el('path', { d: 'M1170 380 h40 v24 h-40z', fill: '#fbf8f1' }, stop);
    const sa = actor(sc.mid, 380, 800, 1.0, { ...SARAH, mood: 'smile' }, 'reachR');
    const son = actor(sc.mid, 560, 800, 1.0, { ...SON, mood: 'smile' }, 'reachL');
    life(sa, t0, t1, 5); life(son, t0, t1, 6); talk(sa, t0, t1);
    // Holding hands at first… then he goes on his own.
    const ind = at('independent', 2);
    pose(tl, sa.f, 'idle', ind - .6, .4); pose(tl, son.f, 'hold', ind - .6, .4);
    const ph = put(son.content, 0, -330, .9); K.phone(ph); pop(ph, ind - .5, { origin: '50% 50%' });
    walkTo(son, ind - .3, 540, 1.6);
    const pin = put(sc.front, 1190, 290, 1); K.el('path', { d: 'M0 34 C-30 0 -30 -34 0 -34 C30 -34 30 0 0 34Z', fill: '#d9805f' }, pin); K.el('circle', { cy: -12, r: 10, fill: '#fbf8f1' }, pin);
    pop(pin, ind - .2, { origin: '50% 100%', y: -40 });
    const route = K.el('path', { d: 'M600 640 C800 600 1000 640 1180 620', stroke: '#7fe0c4', 'stroke-width': 6, 'stroke-dasharray': '6 12', fill: 'none', 'stroke-linecap': 'round' }, sc.front);
    draw(route, ind - .3, .8);
    pose(tl, sa.f, 'wave', at('possible'), .4); waveHand(tl, sa.f, at('possible') + .3, 2);
    express(tl, sa.f, at('possible'), 'happy');
    pose(tl, son.f, 'wave', at('grows') - .3, .4);
    const st = put(sc.front, 1100, 220, 1); K.star(st, '#e7c178', 40);
    pop(st, at('grows'), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    burst(sc.front, 1100, 220, at('grows') + .1, { color: '#ffd38a' });
    label('independent', ind, { x: 900, y: 92, ax: 900, ay: 330, hold: .6, parent: sc.front });
    label('possible', at('possible'), { x: 900, y: 92, ax: 1100, ay: 330, hold: .9, parent: sc.front });
  }

  /* 4 · So I'm thinking about kids with special needs. */
  {
    const t0 = at('so i'), t1 = at('can ai');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 520' });
    Z.room(sc.back, Z.PAL.school, { horizon: 700 });
    const bd = Z.board(sc.back, 520, 130, 560, 260, { color: '#2f5a46' });
    ['M30 60 h120', 'M30 110 h80 m20 0 h60', 'M300 70 a30 30 0 1 0 1 0'].forEach((d, i) => K.el('path', { d, stroke: '#e9efe4', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, bd.surface));
    const kids = [
      [380, { skin: SKIN.s4, hair: 'curly', hairColor: HAIRC.black, top: '#e7c178', outfit: 'tee', age: 'child', mood: 'grin' }],
      [600, { skin: SKIN.s1, hair: 'ponytail', hairColor: HAIRC.blond, top: '#9cc7e8', outfit: 'tee', age: 'child', mood: 'smile' }],
      [1180, { skin: SKIN.s3, hair: 'crop', hairColor: HAIRC.black, top: '#f0a3a0', outfit: 'tee', age: 'child', mood: 'grin' }]
    ];
    kids.forEach(([x, k], i) => { const a = actor(sc.mid, x, 880, 1.25, k, i === 2 ? 'cheer' : 'wave'); life(a, t0, t1, i + 7); walkIn(a, at('kids') - .3 + i * .12, i === 2 ? 200 : -200, .6); });
    // A pair of headphones for a child who likes it quiet.
    const wcG = put(sc.mid, 880, 880, 1.05); const wcc = K.g(wcG); const wch = K.wheelchair(wcc);
    actor(wcc, -4, 26, .82, { skin: SKIN.s6, hair: 'bun', hairColor: HAIRC.black, top: '#7fc8a9', outfit: 'tee', age: 'child', mood: 'grin', seated: true }, 'cheer');
    wcc.append(wch);
    S.rise(wcG, at('kids') + .1, { y: 30 });
    [[540, 290, '#d9694a'], [800, 230, '#f0a3a0'], [1060, 290, '#e2a64a']].forEach(([x, y, c], i) => { const h = put(sc.front, x, y, .55); K.heart(h, c); pop(h, at('special') + i * .12, { origin: '50% 50%', from: .1, ease: 'back.out(3)' }); });
    label('special needs', at('special'), { x: 800, y: 92, ax: 800, ay: 190, hold: 1.1, parent: sc.front });
  }

  /* 5 · Can AI help me be a better teacher, better mom, better wife? */
  {
    const t0 = at('can ai'), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.04], origin: '800 480' });
    K.el('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: Z.grad(sc.back, ['#f6ead0', '#e6cfa6']) }, sc.back);
    Z.bokeh(sc.back, 16, ['#ffffff', '#ffd38a', '#f0a3a0']);
    const ai = put(sc.front, 800, 110, 1); Z.aiCore(ai, 0, 0, .3);
    pop(ai, at('ai', 2) - .1, { origin: '50% 50%' });
    // Three windows on her life.
    const panels = [
      ['teacher', 300, (p) => { Z.room(p, Z.PAL.school, { horizon: 330 }); const b = Z.board(p, 70, 60, 200, 110, { color: '#2f5a46' }); actor(p, 90, 420, .5, { ...SARAH, mood: 'grin' }, 'pointUp'); actor(p, 230, 430, .32, { skin: SKIN.s4, hair: 'curly', hairColor: HAIRC.black, top: '#e7c178', outfit: 'tee', age: 'child', mood: 'grin' }, 'cheer'); }],
      ['mom', 800, (p) => { Z.room(p, Z.PAL.home, { horizon: 330 }); actor(p, 110, 420, .5, { ...SARAH, mood: 'grin' }, 'reachR'); actor(p, 230, 420, .5, { ...SON, mood: 'grin' }, 'reachL'); }],
      ['wife', 1300, (p) => { Z.sky(p, '#f2a77a', '#fbe0b0'); Z.hills(p, ['#c9c08e', '#a9b27c', '#86a06a'], 520); actor(p, 110, 420, .5, { ...SARAH, mood: 'grin' }, 'reachR'); actor(p, 230, 420, .52, { ...HUSBAND, mood: 'grin' }, 'reachL'); }]
    ];
    panels.forEach(([w, cx, drawP], i) => {
      const t = at(w);
      const fr = put(sc.mid, cx - 170, 250, 1);
      K.el('rect', { x: -10, y: -10, width: 360, height: 400, rx: 18, fill: '#fbf8f1' }, fr);
      const cid = K.id('pnl'); const cp = K.el('clipPath', { id: cid }, fr); K.el('rect', { x: 0, y: 0, width: 340, height: 380, rx: 12 }, cp);
      const inner = K.g(fr, { 'clip-path': `url(#${cid})` });
      drawP(inner);
      const dim = K.el('rect', { x: 0, y: 0, width: 340, height: 380, fill: '#6f6a60', opacity: .55 }, inner);
      tl.fromTo(fr, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, ease: 'expo.out', immediateRender: true }, t0 + .1 + i * .12);
      tl.to(dim, { attr: { opacity: 0 }, duration: .4 }, t - .1);
      tl.to(fr, { scale: 1.06, transformOrigin: '50% 50%', duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }, t - .1);
      const up = put(sc.front, cx + 150, 240, 1); K.el('circle', { r: 30, fill: '#e2a64a' }, up); K.el('path', { d: 'M0 14 V-14 M-12 -2 L0 -14 L12 -2', stroke: '#14261b', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, up);
      pop(up, at('better', i + 1), { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
      label(w, t, { x: cx, y: 760, hold: i === 2 ? 1 : .7, size: 40, parent: sc.front });
    });
    const o = Z.orb(sc.front, 1300, 120, .6); pop(o.inner, end('wife') - .2, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }
}
