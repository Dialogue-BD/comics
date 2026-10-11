import { badge, who, breathe, ask, free, whoFree } from './_shared.js';

/* Robert — Trust.
   "I'm Robert. I'm retired, medical retired. I'm raising my five-year-old son.
    Who is in control? Who will be in control of it, overseeing its use and
    misuse? Should they be required to be more forthcoming about the
    infrastructure required for the data center, for local economies?" */
export default function (S) {
  const { K, C, at, end, beat, pop, rise, draw, move, loop, spin, count, callout, burst, flow, hide, face, wave, reach, tl } = S;
  const D = S.duration;
  const ROBERT = { tone: K.SKIN[1], hair: 'bald', hairColor: K.HAIR.grey, beard: true, top: C.sky, bottom: '#3a3f4a', glasses: true };
  const SON = { tone: K.SKIN[1], hair: 'curly', hairColor: K.HAIR.brown, top: C.gold, bottom: '#2f4a3a', age: 'child', mood: 'grin' };

  /* 1 · I'm Robert. I'm retired, medical retired. */
  {
    const t0 = 0, t1 = at("i'm", 3);
    const b = beat(t0, t1, { mood: 'calm' });
    const r = who(S, b, 640, 720, ROBERT, 1.1);
    rise(r, 0, { y: 30 }); wave(r.p, .25, 2); breathe(S, r, 0, t1);
    const bag = K.wrap(b, 960, 712); K.briefcase(bag);
    pop(bag, .5);
    const ret = at('retired');
    tl.to(bag, { x: 260, autoAlpha: 0, rotation: 8, duration: .9, ease: 'power2.in' }, ret + .1);
    const ch = K.wrap(b, 980, 716); K.chair(ch);
    pop(ch, ret + .7);
    const med = K.wrap(b, 1110, 470, .9);
    K.el('circle', { r: 46, fill: C.cream }, med); K.el('path', { d: 'M-8 -26 h16 v18 h18 v16 h-18 v18 h-16 v-18 h-18 v-16 h18z', fill: C.clay }, med);
    pop(med, at('medical') - .05, { origin: '50% 50%', from: .1, ease: 'back.out(2.6)' });
    callout('retired', ret, { hold: 1.8 });
  }

  /* 2 · I'm raising my five-year-old son. */
  {
    const t0 = at("i'm", 3), t1 = at('who');
    const b = beat(t0, t1, { mood: 'hope' });
    const r = who(S, b, 660, 720, ROBERT, 1.1);
    rise(r, t0, { y: 30 }); breathe(S, r, t0, t1);
    reach(r.p, 'r', t0 + .4, -28);
    const s = who(S, b, 860, 720, SON, 1.05);
    pop(s, at('raising'), { y: 20 });
    loop(s, at('son') + .1, t1, { y: -26 }, .5, 'power1.out');
    const bal = K.wrap(b, 980, 360); const bl = K.balloon(bal, '0', C.clay);
    pop(bal, at('five') - .2, { origin: '50% 100%', y: 60 });
    count(bl.label, at('five') - .1, 0, 5, .55);
    loop(bal, at('five') + .5, t1, { y: -14, rotation: 4 }, 1.4);
    burst(b, 980, 360, at('five') + .45, { color: C.gold });
    callout('raising', at('raising'), { hold: 1.4 });
  }

  /* 3 · Who is in control? Who will be in control of it? */
  {
    const t0 = at('who'), t1 = at('overseeing');
    const b = beat(t0, t1, { mood: 'wonder' });
    const ai = K.wrap(b, 800, 380, 1.15); K.chip(ai);
    pop(ai, t0, { origin: '50% 50%', from: .2 });
    // Strings rise from the chip to an empty "control bar" — who holds it?
    const bar = K.g(b);
    K.el('rect', { x: 640, y: 175, width: 320, height: 18, rx: 9, fill: C.goldDeep }, bar);
    pop(bar, t0 + .3, { origin: '50% 50%' });
    for (const x of [-120, 0, 120]) { const st = K.el('path', { d: `M${800 + x} 193 L${800 + x * .4} 300`, stroke: C.mist, 'stroke-width': 3, fill: 'none', opacity: .7 }, b); draw(st, t0 + .5, .5); }
    const shadows = [430, 1170, 800].map((x, i) => {
      const sh = K.wrap(b, x, i === 2 ? 740 : 720, i === 2 ? .7 : .95);
      K.person(sh, { tone: '#40594a', hairColor: '#2a3d31', top: '#33503f', bottom: '#2a3d31', mood: 'flat', hair: ['short', 'bun', 'curly'][i] });
      return sh;
    });
    shadows.forEach((sh, i) => rise(sh, t0 + .15 + i * .15, { y: 40 }));
    ask(S, b, 430, 360, at('who') + .2, t1);
    ask(S, b, 1170, 360, at('who', 2) + .1, t1);
    // A searching spotlight sweeps across.
    const beam = K.el('path', { d: 'M800 -40 L700 760 H900 Z', fill: C.gold, opacity: .1 }, b);
    b.insertBefore(beam, b.firstChild);
    tl.fromTo(beam, { rotation: 28 }, { rotation: -28, svgOrigin: '800 -40', duration: 1.4, ease: 'sine.inOut', repeat: 1, yoyo: true, immediateRender: true }, at('control') - .2);
    callout('control', at('control'), { hold: .5 });
    callout('control', at('control', 2), { hold: .9 });
  }

  /* 4 · …overseeing its use and misuse? */
  {
    const t0 = at('overseeing'), t1 = at('should');
    const b = beat(t0, t1, { mood: 'wonder' });
    const e = K.wrap(b, 800, 260, .95); const eye = K.eye(e);
    pop(e, t0 - .05, { origin: '50% 50%', from: .3, ease: 'expo.out' });
    tl.fromTo(eye.iris, { x: -50 }, { x: 50, duration: .8, ease: 'sine.inOut', repeat: 3, yoyo: true, immediateRender: true }, t0 + .3);
    const ai = K.wrap(b, 800, 520, .75); K.chip(ai);
    pop(ai, t0 + .2, { origin: '50% 50%' });
    const left = K.el('path', { d: 'M730 560 Q600 640 500 600', stroke: C.mint, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, b);
    const right = K.el('path', { d: 'M870 560 Q1000 640 1100 600', stroke: C.clay, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, b);
    draw(left, at('use') - .1, .5); draw(right, at('misuse') - .2, .5);
    const ok = K.wrap(b, 470, 600, 1.15); K.check(ok);
    const no = K.wrap(b, 1130, 600, 1.15); K.cross(no);
    pop(ok, at('use') + .25, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    pop(no, at('misuse') + .2, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    tl.to(eye.iris, { x: -60, duration: .3 }, at('use') + .3);
    tl.to(eye.iris, { x: 60, duration: .3 }, at('misuse') + .2);
    callout('overseeing', t0, { hold: 1.0 });
    callout('misuse', at('misuse'), { tone: 'clay', hold: 1.2 });
  }

  /* 5 · Should they be required to be more forthcoming? */
  {
    const t0 = at('should'), t1 = at('the infrastructure') - .2;
    const b = beat(t0, t1, { mood: 'calm' });
    const hq = K.wrap(b, 820, 730, 1.15); K.building(hq, { w: 260, h: 420 });
    rise(hq, t0, { y: 50 });
    const d = K.wrap(b, 820, 730, 1.15); const dr = K.door(d);
    rise(d, t0, { y: 50 });
    const req = K.wrap(b, 1180, 420, .9); K.doc(req, { lines: 4 });
    const tick = K.wrap(b, 1220, 470, .7); K.check(tick, C.gold);
    pop(req, at('required'), { origin: '50% 50%' }); pop(tick, at('required') + .25, { origin: '50% 50%', from: .1, ease: 'back.out(3)' });
    const fc = at('forthcoming');
    tl.to(dr.leaf, { scaleX: .12, duration: .6, ease: 'power3.inOut', svgOrigin: '-56 0' }, fc - .1);
    const lightRay = K.el('path', { d: 'M752 485 L620 760 H1020 L888 485Z', fill: C.gold, opacity: 0 }, b);
    b.insertBefore(lightRay, b.firstChild);
    tl.to(lightRay, { attr: { opacity: .22 }, duration: .5 }, fc + .1);
    for (let i = 0; i < 4; i++) {
      const p = free(S, b, .6); K.doc(p.content, { lines: 3 });
      tl.fromTo(p, { autoAlpha: 0, x: 820, y: 640, rotation: 0 }, { autoAlpha: 1, x: 820 + (i - 1.5) * 190 - 120, y: 420 - (i % 2) * 90, rotation: (i - 1.5) * 12, duration: 1, ease: 'expo.out', immediateRender: true }, fc + .25 + i * .1);
    }
    const r = who(S, b, 380, 720, ROBERT, .9);
    rise(r, t0 + .2, { y: 30 }); breathe(S, r, t0, t1);
    callout('forthcoming', fc, { hold: 1.1 });
  }

  /* 6 · …the infrastructure required for the data center, for local economies? */
  {
    const t0 = at('the infrastructure') - .2, t1 = D;
    const b = beat(t0, t1, { mood: 'wonder' });
    const racks = [];
    for (let i = 0; i < 4; i++) { const r = K.wrap(b, 330 + i * 140, 700, .8); const sv = K.server(r, { h: 4 }); racks.push([r, sv]); }
    racks.forEach(([r], i) => rise(r, at('infrastructure') + i * .14, { y: 80 }));
    // Power and water are part of the infrastructure.
    const pylon = K.g(b);
    K.el('path', { d: 'M215 700 L250 380 L285 700 M228 560 H272 M236 470 H264 M222 410 H278', stroke: C.mist, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, pylon);
    rise(pylon, at('required', 2) - .3, { y: 50 });
    const wire = K.el('path', { d: 'M250 400 Q290 470 330 430', stroke: C.gold, 'stroke-width': 4, fill: 'none' }, b);
    draw(wire, at('required', 2), .6);
    const drop = K.wrap(b, 520, 300); K.el('path', { d: 'M0 -46 C26 -10 34 8 34 22 a34 34 0 0 1 -68 0 c0 -14 8 -32 34 -68z', fill: C.sky }, drop);
    pop(drop, at('required', 2) + .2, { origin: '50% 100%' });
    flow(b, 'M520 340 Q520 400 560 470', at('required', 2) + .4, t1, { color: C.sky, n: 2, speed: .9, size: 6 });
    racks.forEach(([, sv]) => sv.lights.forEach((l, k) => tl.to(l, { attr: { opacity: .25 }, duration: .18, repeat: 7, yoyo: true, ease: 'steps(1)' }, at('data') + k * .1)));
    callout('infrastructure', at('infrastructure'), { hold: 1.2 });
    callout('data center', at('data'), { tone: 'mint', small: true, hold: .7 });
    // Local economies: the town next door, and money moving between them.
    const town = [1040, 1200, 1350].map((x, i) => { const h = K.wrap(b, x, 712, .8 - i * .05); K.house(h, { color: [C.clay, C.gold, C.moss][i] }); return h; });
    town.forEach((h, i) => pop(h, at('local') - .15 + i * .1, { y: 30 }));
    for (let i = 0; i < 4; i++) {
      const c = free(S, b, .8); K.coin(c.content);
      tl.fromTo(c, { x: 1060, y: 520, autoAlpha: 0 }, { keyframes: [{ autoAlpha: 1, duration: .1 }, { x: 760, y: 470, duration: .7, ease: 'sine.inOut' }, { autoAlpha: 0, duration: .15 }], immediateRender: true }, at('economies') + i * .22);
    }
    callout('economies', at('economies'), { hold: 1.0 });
    ask(S, b, 1200, 300, at('economies') + .5, t1 + 1, { r: 38 });
  }
}
