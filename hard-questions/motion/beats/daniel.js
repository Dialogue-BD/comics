import { pose, tilt, express, waveHand, SKIN, HAIRC } from '../cast.js';
import * as Z from '../sets.js';
import { helpers } from './_scene.js';

/* Daniel — Work.
   "Where do humans get replaced and what roles should they be replaced on?
    Where it gets personal for me is identifying what parts of what I do need
    to stay human. My daughter just finished her junior year. She wants to do
    her PhD in physics. At what point does AI get good enough to make her job
    in research obsolete? Can AI eliminate a lot of tedious jobs that nobody
    really wants to do?" */
export const fullBleed = true;

const DANIEL = { skin: SKIN.s1, hair: 'short', hairColor: HAIRC.brown, glasses: true, top: '#9cc7e8', outfit: 'shirt', bottom: '#34404a' };
const DAUGHTER = { skin: SKIN.s1, hair: 'ponytail', hairColor: HAIRC.brown, top: '#d9805f', outfit: 'sweater', bottom: '#2f3e4a', age: 'teen' };
const WORKERS = [
  { skin: SKIN.s3, hair: 'bun', hairColor: HAIRC.black, top: '#8fb27f', outfit: 'blouse' },
  { skin: SKIN.s5, hair: 'crop', hairColor: HAIRC.black, top: '#e7c178', outfit: 'shirt' },
  { skin: SKIN.s2, hair: 'long', hairColor: HAIRC.auburn, top: '#f0a3a0', outfit: 'sweater' }
];

export default function (S) {
  const { K, tl, at, end, scene, label, pop, draw, loop, spin, count, burst, flow } = S;
  const { actor, life, put, walkIn, walkTo } = helpers(S);
  const D = S.duration;
  const badge = (parent, x, y, drawIcon, r = 56) => {
    const b = put(parent, x, y, 1);
    b.glow = Z.glow(b, 0, 0, r * 2, '#ffd38a', .6); b.glow.setAttribute('opacity', 0);
    K.el('circle', { r: r + 4, cy: 6, fill: '#000', opacity: .18 }, b);
    K.el('circle', { r, fill: '#fbf8f1' }, b);
    b.ring = K.el('circle', { r, fill: 'none', stroke: '#e7c178', 'stroke-width': 5 }, b);
    const ic = K.g(b); drawIcon(ic); return b;
  };

  /* 1 · Where do humans get replaced, and what roles…? */
  {
    const t0 = 0, t1 = at('where', 2);
    const sc = scene(t0, t1, { zoom: [1.04, 1], origin: '800 500' });
    Z.room(sc.back, Z.PAL.office, { horizon: 640 });
    Z.windowFrame(sc.back, 120, 120, 260, 300, { sky: ['#a9dcec', '#f6e9cc'] });
    Z.windowFrame(sc.back, 1220, 120, 260, 300, { sky: ['#a9dcec', '#f6e9cc'] });
    const xs = [480, 800, 1120];
    xs.forEach(x => { Z.desk(sc.mid, x, 800, 260, { top: '#d8cfbf', leg: '#9aa39f' }); const m = Z.monitor(sc.mid, x + 40, 614, .45); });
    const people = xs.map((x, i) => { const a = actor(sc.mid, x - 70, 830, .82, WORKERS[i], i === 1 ? 'write' : 'idle'); life(a, t0, t1, i + 1); return a; });
    // The middle worker is swapped for AI.
    const rep = at('replaced');
    const swap = (i, t) => {
      tl.to(people[i], { autoAlpha: 0, y: 30, duration: .3, ease: 'power2.in' }, t);
      const ai = put(sc.mid, xs[i] - 70, 560, 1); Z.aiCore(ai, 0, 0, .42);
      pop(ai, t + .25, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    };
    swap(1, rep);
    const icons = [i => K.doc(i, { mark: 'chart', w: 52, h: 66, lines: 2 }), i => { const b = K.g(i); b.setAttribute('transform', 'scale(.5)'); K.book(b, '#5b8fb8'); }, i => { const b = K.g(i); b.setAttribute('transform', 'translate(0 6) scale(.55)'); K.heart(b, '#d9805f'); }];
    const cards = xs.map((x, i) => badge(sc.front, x - 70, 250, icons[i]));
    cards.forEach((c, i) => pop(c, at('roles') - .15 + i * .1, { origin: '50% 50%' }));
    tl.to(cards[0], { x: 640, duration: .6, ease: 'power3.inOut' }, at('replaced', 2) - .2);
    tl.to(cards[2], { x: -640, duration: .6, ease: 'power3.inOut' }, at('replaced', 2) - .2);
    swap(2, at('replaced', 2) + .1);
    express(tl, people[0].f, at('replaced', 2), 'worried');
    label('replaced', rep, { x: 730, y: 92, ax: 730, ay: 470, tone: 'clay', hold: 1.1, parent: sc.front });
    label('roles', at('roles'), { x: 730, y: 92, ax: 730, ay: 194, hold: .8, parent: sc.front });
    const o = Z.orb(sc.front, 1300, 470, .7); pop(o.inner, at('on') - .1, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }

  /* 2 · …identifying what parts of what I do need to stay human. */
  {
    const t0 = at('where', 2), t1 = at('my daughter');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '700 480' });
    Z.room(sc.back, { ...Z.PAL.office, wall: '#e3ddd0' }, { horizon: 680 });
    const w = Z.windowFrame(sc.back, 820, 110, 620, 380, { sky: ['#8fc1dc', '#f2e3c8'], bars: false });
    Z.skyline(w.scene, 400, { color: '#7f97ab', far: '#a9bccb' });
    Z.desk(sc.mid, 560, 820, 460, { top: '#6b4f36', leg: '#4a3a2a' });
    const d = actor(sc.mid, 330, 880, 1.08, DANIEL, 'present');
    life(d, t0, t1, 4);
    const tasks = [
      [780, 250, i => K.doc(i, { mark: 'chart', w: 56, h: 70, lines: 2 }), 'ai'],
      [980, 190, i => { K.el('rect', { x: -26, y: -34, width: 52, height: 68, rx: 8, fill: '#22292e' }, i); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) K.el('rect', { x: -18 + c * 13, y: -12 + r * 13, width: 9, height: 9, rx: 2, fill: c === 2 ? '#e7c178' : '#c9d2d6' }, i); K.el('rect', { x: -18, y: -27, width: 36, height: 10, rx: 2, fill: '#7fe0c4' }, i); }, 'ai'],
      [1180, 260, i => { const a = K.g(i); a.setAttribute('transform', 'translate(-14 48) scale(.15)'); }, 'human'],
      [880, 470, i => { const b = K.g(i); b.setAttribute('transform', 'translate(0 6) scale(.6)'); K.heart(b, '#d9805f'); }, 'human'],
      [1120, 500, i => K.doc(i, { w: 56, h: 70, lines: 3 }), 'ai']
    ];
    const cards = tasks.map(([x, y, dr]) => badge(sc.front, x, y, dr, 60));
    // A tiny handshake: Daniel and a client.
    const hs = cards[2].lastChild;
    const c1 = actor(hs, -14, 44, .14, { ...DANIEL, mood: 'grin' }, 'reachR'), c2 = actor(hs, 16, 44, .14, { skin: SKIN.s4, hair: 'bun', hairColor: HAIRC.black, top: '#e7c178', mood: 'grin' }, 'reachL');
    cards.forEach((c, i) => pop(c, at('personal') - .1 + i * .12, { origin: '50% 50%' }));
    const mg = put(sc.front, 0, 0, .9); K.magnifier(mg);
    const id0 = at('identifying');
    tl.fromTo(mg, { x: 700, y: 380, autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: true }, id0 - .1);
    tl.to(mg, { motionPath: { path: [{ x: 780, y: 250 }, { x: 980, y: 190 }, { x: 1180, y: 260 }, { x: 1120, y: 500 }, { x: 880, y: 470 }], curviness: 1.3 }, duration: 2.6, ease: 'sine.inOut' }, id0);
    tl.to(mg, { autoAlpha: 0, duration: .3 }, id0 + 2.8);
    const stay = at('stay');
    const ai = put(sc.front, 1380, 600, 1); Z.aiCore(ai, 0, 0, .35);
    pop(ai, at('need') - .1, { origin: '50% 50%' });
    tasks.forEach(([x, y, , kind], i) => {
      const c = cards[i];
      if (kind === 'human') {
        tl.to(c.glow, { attr: { opacity: 1 }, duration: .4 }, stay - .2);
        tl.to(c, { x: (i === 2 ? 560 : 500) - x, y: (i === 2 ? 260 : 400) - y, duration: .9, ease: 'expo.inOut' }, stay);
      } else {
        tl.to(c.ring, { attr: { stroke: '#7fe0c4' }, duration: .3 }, stay - .2);
        tl.to(c, { x: 1380 - x, y: 600 - y, scale: .2, autoAlpha: 0, transformOrigin: '50% 50%', duration: .8, ease: 'power3.in' }, stay + .1 + i * .05);
      }
    });
    express(tl, d.f, stay + .4, 'happy');
    pose(tl, d.f, 'heart', stay + .4, .5);
    label('personal', at('personal'), { x: 330, y: 92, ax: 330, ay: 250, hold: 1.0, parent: sc.front });
    label('identifying', id0, { x: 900, y: 92, ax: 760, ay: 360, hold: 1.4, parent: sc.front });
  }

  /* 3 · My daughter just finished her junior year. She wants to do her PhD in physics. */
  {
    const t0 = at('my daughter'), t1 = at('at what');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '800 480' });
    Z.room(sc.back, Z.PAL.school, { horizon: 690 });
    const bd = Z.board(sc.back, 620, 120, 760, 340, { color: '#2f4f45' });
    // Equations write themselves on the board.
    const eqs = ['M30 70 c20 -30 40 30 60 0 m20 -10 h40 m10 0 c10 -20 30 20 40 0', 'M30 150 h60 m10 -20 v40 m10 -20 h40 c20 -30 40 30 60 0', 'M30 230 c30 -40 60 40 90 0 m20 0 h50 m10 -15 h30 m-15 -15 v30', 'M420 80 a40 40 0 1 0 1 0 m60 0 h90', 'M420 200 c20 -40 60 40 80 0 s60 -40 80 0 m20 0 h40'];
    eqs.forEach((d, i) => { const p = K.el('path', { d, stroke: '#e9efe4', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: .9 }, bd.surface); draw(p, t0 + .2 + i * .35, .5); });
    const at0 = put(sc.back, 1250, 260, .7); const atm = K.atom(at0);
    pop(at0, at('physics') - .25, { origin: '50% 50%', from: .1, ease: 'expo.out' });
    tl.to(atm.orbits, { rotation: 300, duration: t1 - at('physics') + .5, ease: 'none', svgOrigin: '0 0' }, at('physics') - .2);
    Z.table(sc.mid, 1180, 800, 300, { top: '#c9a27a', h: 130 });
    const fl = put(sc.mid, 1180, 650, .55); K.flask(fl, '#7fe0c4');
    const dg = actor(sc.mid, 520, 880, 1.1, { ...DAUGHTER, mood: 'grin' }, 'wave');
    life(dg, t0, t1, 5); waveHand(tl, dg.f, t0 + .2, 2); pose(tl, dg.f, 'idle', t0 + 1.2, .5);
    const backpack = K.el('rect', { x: -66, y: -420, width: 42, height: 130, rx: 16, fill: '#2f7f73' }, dg.content);
    dg.content.insertBefore(backpack, dg.content.firstChild);
    // Four years of university: three are done.
    const years = [0, 1, 2, 3].map(i => { const y = put(sc.front, 300 + i * 90, 820, 1); K.el('rect', { x: -36, y: -24, width: 72, height: 48, rx: 10, fill: '#fbf8f1', stroke: '#c9b07a', 'stroke-width': 3 }, y); const t = K.el('text', { x: 0, y: 12, 'text-anchor': 'middle', 'font-family': "'Public Sans',sans-serif", 'font-weight': 800, 'font-size': 30, fill: '#22292e' }, y); t.textContent = String(i + 1); return y; });
    years.forEach((y, i) => pop(y, at('finished') - .2 + i * .08, { origin: '50% 50%' }));
    years.slice(0, 3).forEach((y, i) => { const c = K.el('rect', { x: -36, y: -24, width: 72, height: 48, rx: 10, fill: '#e7c178', opacity: 0 }, y); y.insertBefore(c, y.children[1]); tl.to(c, { attr: { opacity: 1 }, duration: .25 }, at('junior') - .1 + i * .14); });
    const cap = put(sc.front, 520, 300, .7); K.gradCap(cap);
    pop(cap, at('phd') - .2, { origin: '50% 50%', rot: -18 });
    tl.to(cap, { y: 40, duration: .5, ease: 'bounce.out' }, at('phd') + .3);
    label('daughter', at('daughter'), { x: 520, y: 92, ax: 520, ay: 230, hold: 1.0, parent: sc.front });
    label('physics', at('physics'), { x: 1100, y: 92, ax: 1250, ay: 200, tone: 'mint', hold: .75, parent: sc.front });
  }

  /* 4 · At what point does AI get good enough to make her job in research obsolete? */
  {
    const t0 = at('at what'), t1 = at('can ai');
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '700 480' });
    Z.room(sc.back, { ...Z.PAL.clinic, wall: '#dce9f4', wallDark: '#c3d6e6', trim: '#9fbcd2' }, { horizon: 680 });
    Z.shelf(sc.back, 200, 260, 240);
    Z.table(sc.mid, 560, 800, 520, { top: '#e9e3d5', h: 150 });
    [[420, '#7fe0c4'], [520, '#ffd38a'], [640, '#f0a3a0']].forEach(([x, c], i) => { const f = put(sc.mid, x, 628, .45 + i * .06); K.flask(f, c); });
    const scope = put(sc.mid, 740, 628, 1); K.el('path', { d: 'M-30 0 h60 l-6 -14 h-48z M-6 -14 l-10 -70 l26 -10 l12 74z M-20 -96 l30 -10 l8 22 l-30 10z', fill: '#4a5560' }, scope);
    const lab = K.g(sc.mid);
    const dg = actor(lab, 330, 880, 1.05, { ...DAUGHTER, coat: true, mood: 'smile' }, 'hold');
    life(dg, t0, t1, 6);
    // A gauge: how good is AI getting?
    const gauge = put(sc.mid, 1180, 0, 1);
    K.el('rect', { x: -40, y: 180, width: 80, height: 520, rx: 40, fill: '#0b2716', stroke: '#c9d6c3', 'stroke-width': 5 }, gauge);
    const fill = K.el('rect', { x: -30, y: 190, width: 60, height: 500, rx: 30, fill: Z.grad(gauge, ['#ffd38a', '#7fe0c4']) }, gauge);
    K.el('path', { d: 'M-90 300 H-46 M46 300 H90', stroke: '#e2a64a', 'stroke-width': 6, 'stroke-dasharray': '12 8' }, gauge);
    tl.fromTo(fill, { scaleY: .05 }, { scaleY: .8, svgOrigin: '0 690', duration: at('enough') - at('good') + 1.2, ease: 'power2.inOut', immediateRender: true }, at('good') - .4);
    const ai = put(sc.front, 1380, 300, 1); Z.aiCore(ai, 0, 0, .38);
    pop(ai, at('ai') - .1, { origin: '50% 50%' });
    label('enough', at('enough'), { x: 1180, y: 92, ax: 1180, ay: 300, hold: .9, size: 38, parent: sc.front });
    // Obsolete: her lab greys out and gathers dust.
    const ob = at('obsolete');
    const veil = K.el('rect', { x: 120, y: 140, width: 800, height: 760, rx: 20, fill: '#5d6660', opacity: 0 }, sc.front);
    tl.to(veil, { attr: { opacity: .55 }, duration: .7 }, ob);
    const dustG = Z.dust(sc.front, [180, 300, 700, 500], 26, '#e9e3d4');
    tl.fromTo(dustG, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 20, duration: 1.2, immediateRender: true }, ob + .2);
    express(tl, dg.f, ob, 'worried');
    label('obsolete', ob, { x: 520, y: 92, ax: 520, ay: 420, tone: 'clay', hold: 1.0, parent: sc.front });
    const o = Z.orb(sc.front, 860, 250, .75); pop(o.inner, ob + .4, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }

  /* 5 · Can AI eliminate a lot of tedious jobs that nobody really wants to do? */
  {
    const t0 = at('can ai'), t1 = D;
    const sc = scene(t0, t1, { zoom: [1, 1.05], origin: '700 500' });
    Z.room(sc.back, { ...Z.PAL.office, wall: '#cfcbbf', wallDark: '#b8b3a5' }, { horizon: 690 });
    const lightRect = K.el('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#ffe9b8', opacity: 0 }, sc.back);
    Z.cabinet(sc.back, 1420, 690);
    const clock = Z.wallClock(sc.back, 1100, 200, 46);
    Z.desk(sc.mid, 700, 820, 520, { top: '#9aa39f', leg: '#6f7a76' });
    const stack = put(sc.mid, 820, 634, 1.1); const st = K.paperStack(stack, 18);
    const w = actor(sc.mid, 420, 880, 1.05, { ...WORKERS[1], mood: 'flat' }, 'write');
    life(w, t0, t1, 7);
    const sp = put(sc.mid, 600, 600, .7); K.stamp(sp);
    tl.to(sp, { y: 40, duration: .16, repeat: 9, yoyo: true, ease: 'power2.in' }, t0 + .2);
    tl.to(w.f.parts.head, { rotation: -10, duration: .5, repeat: 3, yoyo: true, ease: 'sine.inOut', svgOrigin: '0 -470' }, at('tedious') - .4);
    express(tl, w.f, at('tedious') - .4, 'worried');
    const ai = put(sc.front, 1260, 380, 1); const core = Z.aiCore(ai, 0, 0, .5);
    const el0 = at('eliminate');
    pop(ai, el0 - .3, { origin: '50% 50%', from: .1, ease: 'back.out(2)' });
    spin(core.hud, el0, t1, .8);
    [...st.sheets].reverse().forEach((sh, i) => tl.to(sh, { x: 440 + i * 2, y: -260 - i * 6, rotation: 20, scale: .3, autoAlpha: 0, duration: .55, ease: 'power2.in', transformOrigin: '50% 50%' }, at('jobs') + i * .1));
    tl.to(sp, { autoAlpha: 0, duration: .3 }, at('jobs'));
    tl.to(lightRect, { attr: { opacity: .18 }, duration: 1 }, at('nobody'));
    express(tl, w.f, at('nobody'), 'happy');
    pose(tl, w.f, 'cheer', at('nobody') + .1, .5);
    label('eliminate', el0, { x: 1100, y: 92, ax: 1260, ay: 300, tone: 'mint', hold: 1.1, parent: sc.front });
    label('tedious', at('tedious'), { x: 700, y: 92, ax: 820, ay: 440, tone: 'clay', hold: 1.1, parent: sc.front });
    const o = Z.orb(sc.front, 1260, 170, .7); pop(o.inner, at('really') + .5, { origin: '50% 50%', from: .1, ease: 'back.out(2.4)' });
  }
}
