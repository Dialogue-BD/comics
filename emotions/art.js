/* ===========================================================================
   How Are You Feeling? — the illustration kit
   ---------------------------------------------------------------------------
   Every picture on the page is drawn from here, so the lesson on the
   projector and the steps on a phone share one cast and one world:

     ART.figure()    a person from the chest up, with a face that can feel
     ART.room()      the classroom behind the lesson's first panel
     ART.iceberg()   the GPA word iceberg, faceted, in lit water
     ART.cloud(), ART.bolt(), ART.butterfly(), ART.spark()
     ART.weather(n)  the 1–5 storm scale, as a string of SVG

   Gradients are made on demand and named per <svg>, so two pictures on one
   page can never borrow each other's paint (a gradient that lives in a
   hidden SVG does not render in Chrome).
   =========================================================================== */
'use strict';
const NS = 'http://www.w3.org/2000/svg';
function N(p, tag, a = {}){
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(a)) {
    if (v == null) continue;
    if (k === 'in') n.dataset.in = v;
    else if (k === 'out') n.dataset.out = v;
    else if (k === 'at') n.dataset.at = v;
    else if (k === 'now') n.dataset.now = v;
    else if (k === 'cls') n.setAttribute('class', v);
    else if (k === 'delay') n.style.transitionDelay = v + 'ms';
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  p.appendChild(n);
  return n;
}
const G = (p, a) => N(p, 'g', a);

const ART = (() => {
  let uid = 0;
  const svgOf = n => n.ownerSVGElement || (n.tagName === 'svg' ? n : null) || n.closest('svg');
  function defsOf(svg){
    if (!svg.__defs) { svg.__uid = ++uid; svg.__defs = N(svg, 'defs'); svg.insertBefore(svg.__defs, svg.firstChild); svg.__cache = {}; }
    return svg.__defs;
  }
  /* shade a hex colour: amt < 0 darker, > 0 lighter */
  function shade(hex, amt){
    const h = hex.replace('#', ''), n = parseInt(h.length === 3 ? h.replace(/./g, c => c + c) : h, 16);
    let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, f = Math.abs(amt);
    r = Math.round(r + (t - r) * f); g = Math.round(g + (t - g) * f); b = Math.round(b + (t - b) * f);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  /* a gradient for this picture; returns url(#…) */
  function grad(p, stops, o = {}){
    const svg = svgOf(p) || p, d = defsOf(svg);
    const key = JSON.stringify([stops, o]);
    if (svg.__cache[key]) return svg.__cache[key];
    const id = 'g' + svg.__uid + '-' + Object.keys(svg.__cache).length;
    const g = N(d, o.radial ? 'radialGradient' : 'linearGradient', o.radial
      ? { id, cx: o.cx || '38%', cy: o.cy || '32%', r: o.r || '75%' }
      : { id, x1: o.x1 || 0, y1: o.y1 || 0, x2: o.x2 != null ? o.x2 : 0, y2: o.y2 != null ? o.y2 : 1 });
    stops.forEach((s, i) => N(g, 'stop', { offset: s[1] != null ? s[1] : i / (stops.length - 1), 'stop-color': s[0], 'stop-opacity': s[2] != null ? s[2] : 1 }));
    return (svg.__cache[key] = 'url(#' + id + ')');
  }
  function soft(p){
    const svg = svgOf(p) || p, d = defsOf(svg), id = 'f' + svg.__uid + '-soft';
    if (!svg.__cache[id]) {
      const f = N(d, 'filter', { id, x: '-20%', y: '-20%', width: '140%', height: '160%' });
      N(f, 'feDropShadow', { dx: 0, dy: 6, stdDeviation: 7, 'flood-color': '#103D21', 'flood-opacity': .18 });
      svg.__cache[id] = 'url(#' + id + ')';
    }
    return svg.__cache[id];
  }

  /* ------------------------------------------------------------- people */
  const SKIN = { a: '#C98E63', b: '#A86E4A', c: '#86553A', d: '#DDAA82' };
  const CAST = {
    teacher: { skin: SKIN.a, hair: 'short', hairC: '#2B2020', grey: true, shirt: '#1F5C4A', collar: '#F4F1E6', glasses: true },
    learner: { skin: SKIN.b, hair: 'hijab', hairC: '#7C4A8E', shirt: '#E7A96B' },
    friend:  { skin: SKIN.a, hair: 'short', hairC: '#1E1612', shirt: '#E1B84B', collar: '#FFF8E6' },
    boy:     { skin: SKIN.a, hair: 'short', hairC: '#1E1612', shirt: '#3F7FA6', collar: '#EAF3F7' },
    girl:    { skin: SKIN.d, hair: 'long', hairC: '#2A1C16', shirt: '#C9625A', orna: '#F5EBD4' }
  };
  /* (x, y) is the centre of the face; s is the height of the whole bust */
  function figure(p, x, y, s, o = {}){
    const c = Object.assign({}, CAST[o.who || 'learner'], o);
    const r = .2 * s, face = o.face || 'smile';
    const outer = G(p, { in: o.in, out: o.out, at: o.at, cls: o.cls, delay: o.delay });
    const g = G(outer, { cls: o.still ? null : 'idle', style: 'animation-delay:-' + (Math.random() * 4).toFixed(2) + 's' });
    const skin = c.skin, skinD = shade(skin, -.22), skinL = shade(skin, .18);
    const hair = c.hairC, hairD = shade(hair, -.25), hairL = shade(hair, .25);
    if (o.shadow !== false) N(g, 'ellipse', { cx: x, cy: y + 3.95 * r, rx: 2.2 * r, ry: .22 * r, fill: '#103D21', opacity: .10 });
    /* behind the head */
    if (c.hair === 'long') N(g, 'path', { d: `M${x - 1.05 * r} ${y - .3 * r}Q${x - 1.3 * r} ${y + 1.5 * r} ${x - 1.1 * r} ${y + 2.4 * r}L${x + 1.1 * r} ${y + 2.4 * r}Q${x + 1.3 * r} ${y + 1.5 * r} ${x + 1.05 * r} ${y - .3 * r}Z`, fill: grad(g, [[hairL], [hairD]]) });
    if (c.hair === 'hijab') N(g, 'path', { d: `M${x - 1.2 * r} ${y + .1 * r}C${x - 1.3 * r} ${y - 1.45 * r} ${x + 1.3 * r} ${y - 1.45 * r} ${x + 1.2 * r} ${y + .1 * r}C${x + 1.22 * r} ${y + 1.05 * r} ${x + 1.35 * r} ${y + 1.7 * r} ${x + 1.9 * r} ${y + 2.3 * r}L${x - 1.9 * r} ${y + 2.3 * r}C${x - 1.35 * r} ${y + 1.7 * r} ${x - 1.22 * r} ${y + 1.05 * r} ${x - 1.2 * r} ${y + .1 * r}Z`, fill: grad(g, [[shade(hair, .12)], [shade(hair, -.2)]]) });
    /* neck, body */
    if (c.hair !== 'hijab') N(g, 'path', { d: `M${x - .36 * r} ${y + .55 * r}V${y + 1.85 * r}H${x + .36 * r}V${y + .55 * r}Z`, fill: skinD });
    const body = `M${x - 2.15 * r} ${y + 3.95 * r}C${x - 2.2 * r} ${y + 2.35 * r} ${x - 1.5 * r} ${y + 1.6 * r} ${x} ${y + 1.55 * r}C${x + 1.5 * r} ${y + 1.6 * r} ${x + 2.2 * r} ${y + 2.35 * r} ${x + 2.15 * r} ${y + 3.95 * r}Z`;
    N(g, 'path', { d: body, fill: grad(g, [[shade(c.shirt, .12)], [shade(c.shirt, -.16)]]) });
    N(g, 'path', { d: `M${x - 1.55 * r} ${y + 2.2 * r}Q${x - 1.2 * r} ${y + 1.8 * r} ${x - .6 * r} ${y + 1.7 * r}`, fill: 'none', stroke: '#fff', 'stroke-opacity': .22, 'stroke-width': .12 * r, 'stroke-linecap': 'round' });
    if (c.orna) {
      N(g, 'path', { d: `M${x - 1.45 * r} ${y + 1.6 * r}Q${x - .5 * r} ${y + 2.55 * r} ${x + 1.35 * r} ${y + 1.75 * r}L${x + 1.85 * r} ${y + 3.95 * r}H${x - 1.7 * r}Z`, fill: grad(g, [[shade(c.orna, .06)], [shade(c.orna, -.1)]]) });
      N(g, 'path', { d: `M${x - 1.35 * r} ${y + 1.76 * r}Q${x - .2 * r} ${y + 2.78 * r} ${x + 1.34 * r} ${y + 1.9 * r}`, fill: 'none', stroke: '#C99278', 'stroke-width': .045 * r, opacity: .75 });
    }
    if (c.hair !== 'hijab') {
      N(g, 'path', { d: `M${x - .5 * r} ${y + 1.58 * r}L${x} ${y + 2.25 * r}L${x + .5 * r} ${y + 1.58 * r}Z`, fill: skinD });
      if (c.collar) {
        N(g, 'path', { d: `M${x - .55 * r} ${y + 1.55 * r}L${x - .05 * r} ${y + 2.3 * r}L${x - .78 * r} ${y + 2.05 * r}Z`, fill: c.collar });
        N(g, 'path', { d: `M${x + .55 * r} ${y + 1.55 * r}L${x + .05 * r} ${y + 2.3 * r}L${x + .78 * r} ${y + 2.05 * r}Z`, fill: c.collar });
      }
    } else {
      /* the scarf wraps under the chin and falls over the shoulders */
      N(g, 'path', { d: `M${x - 1.22 * r} ${y + .35 * r}Q${x} ${y + 1.75 * r} ${x + 1.22 * r} ${y + .35 * r}L${x + 2.02 * r} ${y + 2.55 * r}Q${x} ${y + 3.25 * r} ${x - 2.02 * r} ${y + 2.55 * r}Z`, fill: grad(g, [[shade(hair, .1)], [shade(hair, -.18)]]) });
      N(g, 'path', { d: `M${x - .95 * r} ${y + 1.35 * r}Q${x} ${y + 2.1 * r} ${x + .95 * r} ${y + 1.35 * r}`, fill: 'none', stroke: shade(hair, -.3), 'stroke-width': .07 * r, opacity: .45 });
      N(g, 'path', { d: `M${x - 1.5 * r} ${y + 1.9 * r}Q${x - .6 * r} ${y + 2.5 * r} ${x - .1 * r} ${y + 2.45 * r}`, fill: 'none', stroke: '#fff', 'stroke-opacity': .18, 'stroke-width': .1 * r, 'stroke-linecap': 'round' });
    }
    /* ears */
    if (c.hair !== 'hijab') [-1, 1].forEach(k => {
      N(g, 'ellipse', { cx: x + k * .93 * r, cy: y + .08 * r, rx: .19 * r, ry: .27 * r, fill: skinD });
      N(g, 'ellipse', { cx: x + k * .95 * r, cy: y + .08 * r, rx: .09 * r, ry: .15 * r, fill: shade(skin, -.35), opacity: .35 });
    });
    /* face */
    N(g, 'ellipse', { cx: x, cy: y, rx: .92 * r, ry: 1.02 * r, fill: grad(g, [[skinL], [skin, .55], [skinD]], { radial: true, cx: '40%', cy: '30%', r: '80%' }) });
    /* hair on top */
    if (c.hair === 'short' || c.hair === 'curly' || c.hair === 'long' || c.hair === 'bun') {
      if (c.hair === 'curly') {
        [[-.8, -.45, .32], [-.5, -.8, .36], [-.1, -.98, .38], [.32, -.9, .36], [.7, -.6, .33], [.9, -.2, .24], [-.92, -.12, .24]]
          .forEach(q => N(g, 'circle', { cx: x + q[0] * r, cy: y + q[1] * r, r: q[2] * r, fill: grad(g, [[hairL], [hairD]]) }));
      } else {
        N(g, 'path', { d: `M${x - .98 * r} ${y + .12 * r}C${x - 1.18 * r} ${y - 1.3 * r} ${x + 1.12 * r} ${y - 1.5 * r} ${x + 1.0 * r} ${y + .1 * r}C${x + .9 * r} ${y - .38 * r} ${x + .62 * r} ${y - .5 * r} ${x + .3 * r} ${y - .46 * r}C${x - .05 * r} ${y - .6 * r} ${x - .45 * r} ${y - .38 * r} ${x - .62 * r} ${y - .5 * r}C${x - .78 * r} ${y - .3 * r} ${x - .9 * r} ${y - .1 * r} ${x - .98 * r} ${y + .12 * r}Z`, fill: grad(g, [[hairL], [hairD]]) });
        N(g, 'path', { d: `M${x - .4 * r} ${y - .95 * r}Q${x + .1 * r} ${y - 1.12 * r} ${x + .5 * r} ${y - .9 * r}`, fill: 'none', stroke: '#fff', 'stroke-opacity': .18, 'stroke-width': .1 * r, 'stroke-linecap': 'round' });
        if (c.hair === 'bun') N(g, 'circle', { cx: x + .1 * r, cy: y - 1.18 * r, r: .38 * r, fill: hairD });
      }
    }
    if (c.hair === 'hijab') {
      N(g, 'path', { d: `M${x - .98 * r} ${y + .05 * r}C${x - 1.05 * r} ${y - 1.3 * r} ${x + 1.05 * r} ${y - 1.3 * r} ${x + .98 * r} ${y + .05 * r}C${x + .9 * r} ${y - .62 * r} ${x - .9 * r} ${y - .62 * r} ${x - .98 * r} ${y + .05 * r}Z`, fill: grad(g, [[shade(hair, .18)], [shade(hair, -.05)]]) });
      N(g, 'path', { d: `M${x - .92 * r} ${y - .1 * r}C${x - .85 * r} ${y - .6 * r} ${x + .85 * r} ${y - .6 * r} ${x + .92 * r} ${y - .1 * r}`, fill: 'none', stroke: shade(hair, -.25), 'stroke-width': .08 * r, opacity: .5 });
    }
    /* brows, eyes, nose, mouth */
    const ey = y + .06 * r, ex = .36 * r;
    const blinkDelay = (Math.random() * 5).toFixed(2);
    const brow = { smile: [0, -.03], laugh: [.04, -.08], worry: [-.14, .02], flat: [0, 0], sad: [-.12, .02], angry: [.12, -.02], calm: [0, -.03], wow: [-.06, -.14] }[face] || [0, 0];
    [-1, 1].forEach(k => {
      const ox = x + k * ex;
      N(g, 'path', { d: `M${ox - k * .2 * r} ${y - .3 * r + brow[1] * r}Q${ox} ${y - .4 * r + brow[1] * r} ${ox + k * .2 * r} ${y - .32 * r + (brow[1] + brow[0]) * r}`,
        fill: 'none', stroke: c.hair === 'hijab' ? '#2A1C16' : hairD, 'stroke-width': .09 * r, 'stroke-linecap': 'round' });
      if (face === 'laugh' || face === 'calm') {
        N(g, 'path', { d: `M${ox - .15 * r} ${ey + .02 * r}Q${ox} ${ey - .16 * r} ${ox + .15 * r} ${ey + .02 * r}`, fill: 'none', stroke: '#2B1D14', 'stroke-width': .08 * r, 'stroke-linecap': 'round' });
      } else {
        const eg = G(g, { cls: 'blink', style: 'animation-delay:' + blinkDelay + 's' });
        N(eg, 'ellipse', { cx: ox, cy: ey, rx: .16 * r, ry: face === 'wow' ? .21 * r : .18 * r, fill: '#fff' });
        N(eg, 'circle', { cx: ox + (face === 'worry' || face === 'sad' ? 0 : .02 * r) + (c.look || 0) * .05 * r, cy: ey + (face === 'sad' ? .04 * r : .02 * r), r: .11 * r, fill: '#2B1D14' });
        N(eg, 'circle', { cx: ox + .05 * r + (c.look || 0) * .05 * r, cy: ey - .03 * r, r: .035 * r, fill: '#fff' });
      }
    });
    if (c.glasses) {
      [-1, 1].forEach(k => N(g, 'circle', { cx: x + k * ex, cy: ey, r: .25 * r, fill: 'rgba(255,255,255,.12)', stroke: '#2B2020', 'stroke-width': .06 * r }));
      N(g, 'path', { d: `M${x - ex + .25 * r} ${ey}Q${x} ${ey - .08 * r} ${x + ex - .25 * r} ${ey}`, fill: 'none', stroke: '#2B2020', 'stroke-width': .06 * r });
    }
    N(g, 'path', { d: `M${x - .02 * r} ${y + .18 * r}Q${x + .12 * r} ${y + .38 * r} ${x - .06 * r} ${y + .43 * r}`, fill: 'none', stroke: shade(skin, -.35), 'stroke-width': .06 * r, 'stroke-linecap': 'round' });
    if (face !== 'angry') [-1, 1].forEach(k => N(g, 'ellipse', { cx: x + k * .56 * r, cy: y + .42 * r, rx: .16 * r, ry: .09 * r, fill: '#E07A6E', opacity: face === 'worry' || face === 'sad' ? .15 : .32 }));
    const my = y + .64 * r, lip = '#7A3326';
    const mouth = {
      smile: () => N(g, 'path', { d: `M${x - .3 * r} ${my - .04 * r}Q${x} ${my + .26 * r} ${x + .3 * r} ${my - .04 * r}`, fill: 'none', stroke: lip, 'stroke-width': .08 * r, 'stroke-linecap': 'round' }),
      calm: () => N(g, 'path', { d: `M${x - .24 * r} ${my}Q${x} ${my + .16 * r} ${x + .24 * r} ${my}`, fill: 'none', stroke: lip, 'stroke-width': .08 * r, 'stroke-linecap': 'round' }),
      laugh: () => { N(g, 'path', { d: `M${x - .34 * r} ${my - .06 * r}Q${x} ${my - .02 * r} ${x + .34 * r} ${my - .06 * r}Q${x + .28 * r} ${my + .42 * r} ${x} ${my + .44 * r}Q${x - .28 * r} ${my + .42 * r} ${x - .34 * r} ${my - .06 * r}Z`, fill: '#5A1E16' });
        N(g, 'path', { d: `M${x - .18 * r} ${my + .32 * r}Q${x} ${my + .18 * r} ${x + .18 * r} ${my + .32 * r}Q${x} ${my + .46 * r} ${x - .18 * r} ${my + .32 * r}Z`, fill: '#E0766B' });
        N(g, 'path', { d: `M${x - .28 * r} ${my - .04 * r}H${x + .28 * r}`, stroke: '#fff', 'stroke-width': .08 * r }); },
      worry: () => N(g, 'path', { d: `M${x - .28 * r} ${my + .1 * r}Q${x - .14 * r} ${my - .04 * r} ${x} ${my + .06 * r}Q${x + .14 * r} ${my + .16 * r} ${x + .28 * r} ${my + .02 * r}`, fill: 'none', stroke: lip, 'stroke-width': .08 * r, 'stroke-linecap': 'round' }),
      sad: () => N(g, 'path', { d: `M${x - .26 * r} ${my + .14 * r}Q${x} ${my - .1 * r} ${x + .26 * r} ${my + .14 * r}`, fill: 'none', stroke: lip, 'stroke-width': .08 * r, 'stroke-linecap': 'round' }),
      flat: () => N(g, 'path', { d: `M${x - .22 * r} ${my + .06 * r}H${x + .22 * r}`, stroke: lip, 'stroke-width': .08 * r, 'stroke-linecap': 'round' }),
      angry: () => N(g, 'path', { d: `M${x - .26 * r} ${my + .12 * r}Q${x} ${my - .02 * r} ${x + .26 * r} ${my + .12 * r}`, fill: 'none', stroke: lip, 'stroke-width': .09 * r, 'stroke-linecap': 'round' }),
      wow: () => N(g, 'ellipse', { cx: x, cy: my + .08 * r, rx: .13 * r, ry: .17 * r, fill: '#5A1E16' })
    };
    (mouth[face] || mouth.smile)();
    if (c.pose) arms(g, x, y, r, c, POSES[c.pose] || []);
    return outer;
  }

  /* arms, in r units from the centre of the face: shoulder, elbow, wrist
     and the shape of the hand. Long sleeves in the shirt colour, then a
     hand in the skin colour — enough to point, wave, explain, hug, shrug. */
  const POSES = {
    point:   [{ S: [1.75, 2.45], E: [2.7, 2.55], W: [3.6, 2.1], h: 'point' }],
    pointL:  [{ S: [-1.75, 2.45], E: [-2.7, 2.55], W: [-3.6, 2.1], h: 'point' }],
    present: [{ S: [1.75, 2.45], E: [2.6, 3.2], W: [3.35, 2.55], h: 'palm' }],
    wave:    [{ S: [1.75, 2.45], E: [2.65, 1.8], W: [2.8, .55], h: 'palm' }],
    heart:   [{ S: [-1.75, 2.45], E: [-1.3, 3.4], W: [-.35, 2.75], h: 'palm' }],
    chin:    [{ S: [1.75, 2.45], E: [1.7, 3.35], W: [.55, 1.35], h: 'fist' }],
    laugh:   [{ S: [-1.75, 2.45], E: [-2.7, 2.55], W: [-3.55, 2.05], h: 'point' }, { S: [1.75, 2.45], E: [2.05, 3.4], W: [.75, 3.4], h: 'fist' }],
    desk:    [{ S: [-1.75, 2.45], E: [-2.05, 3.45], W: [-.6, 3.6], h: 'fist' }, { S: [1.75, 2.45], E: [2.05, 3.45], W: [.6, 3.6], h: 'fist' }],
    shrug:   [{ S: [-1.75, 2.45], E: [-2.75, 3.0], W: [-3.1, 2.1], h: 'palm' }, { S: [1.75, 2.45], E: [2.75, 3.0], W: [3.1, 2.1], h: 'palm' }],
    hug:     [{ S: [-1.75, 2.45], E: [-1.45, 3.5], W: [.75, 2.75], h: 'fist' }, { S: [1.75, 2.45], E: [1.45, 3.5], W: [-.75, 2.75], h: 'fist' }],
    phone:   [{ S: [1.75, 2.45], E: [2.2, 3.5], W: [1.0, 2.9], h: 'fist' }]
  };
  function arms(g, x, y, r, c, list){
    const skin = c.skin, skinD = shade(skin, -.22), sleeve = shade(c.shirt, -.06), sleeveD = shade(c.shirt, -.22);
    const P = q => [x + q[0] * r, y + q[1] * r];
    list.forEach(a => {
      const [sx, sy] = P(a.S), [ex, ey] = P(a.E), [wx, wy] = P(a.W);
      const d = `M${sx} ${sy}L${ex} ${ey}L${wx} ${wy}`;
      N(g, 'path', { d, fill: 'none', stroke: sleeveD, 'stroke-width': .84 * r, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      N(g, 'path', { d, fill: 'none', stroke: sleeve, 'stroke-width': .7 * r, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      N(g, 'path', { d: `M${sx} ${sy - .12 * r}L${ex} ${ey - .12 * r}`, fill: 'none', stroke: '#fff', 'stroke-opacity': .16, 'stroke-width': .14 * r, 'stroke-linecap': 'round' });
      const ang = Math.atan2(wy - ey, wx - ex), ca = Math.cos(ang), sa = Math.sin(ang);
      const hx = wx + ca * .22 * r, hy = wy + sa * .22 * r;
      if (a.h === 'point') {
        N(g, 'path', { d: `M${hx} ${hy}L${hx + ca * .62 * r} ${hy + sa * .62 * r}`, stroke: skinD, 'stroke-width': .2 * r, 'stroke-linecap': 'round' });
        N(g, 'path', { d: `M${hx} ${hy}L${hx + ca * .6 * r} ${hy + sa * .6 * r}`, stroke: skin, 'stroke-width': .15 * r, 'stroke-linecap': 'round' });
      }
      N(g, 'ellipse', { cx: hx, cy: hy, rx: (a.h === 'palm' ? .34 : .3) * r, ry: (a.h === 'palm' ? .4 : .3) * r, fill: grad(g, [[shade(skin, .12)], [skinD]]), stroke: shade(skin, -.3), 'stroke-width': .04 * r,
        transform: `rotate(${ang * 180 / Math.PI + 90} ${hx} ${hy})` });
      if (a.h === 'palm') [-1, 0, 1].forEach(k => N(g, 'path', { d: `M${hx + k * .12 * r} ${hy - .1 * r}v${-.18 * r}`, stroke: shade(skin, -.3), 'stroke-width': .03 * r, opacity: .5, transform: `rotate(${ang * 180 / Math.PI + 90} ${hx} ${hy})` }));
      N(g, 'path', { d: `M${wx - sa * .3 * r} ${wy + ca * .3 * r}L${wx + sa * .3 * r} ${wy - ca * .3 * r}`, stroke: shade(c.shirt, .2), 'stroke-width': .14 * r, 'stroke-linecap': 'round' });
    });
  }

  /* ------------------------------------------------------------- the room */
  function room(p, W, H, o = {}){
    const g = G(p, { cls: 'room' });
    N(g, 'rect', { x: 0, y: 0, width: W, height: H, fill: grad(g, [['#FBF7EC'], ['#F3EBD6']]) });
    const fy = o.floor || H * .86;
    N(g, 'rect', { x: 0, y: fy, width: W, height: H - fy, fill: grad(g, [['#E9DEC4'], ['#E1D3B4']]) });
    N(g, 'path', { d: `M0 ${fy}H${W}`, stroke: '#D5C6A3', 'stroke-width': 3 });
    if (o.board !== false) {
      const bx = o.boardX != null ? o.boardX : 90, bw = o.boardW || 470;
      N(g, 'rect', { x: bx - 12, y: 42, width: bw + 24, height: 300, rx: 16, fill: '#C8B48C' });
      N(g, 'rect', { x: bx, y: 54, width: bw, height: 276, rx: 10, fill: grad(g, [['#2E5E45'], ['#23503A']]) });
      [[.08, .78, 100], [.08, .6, 160], [.08, .7, 220]].forEach(l => N(g, 'path', { d: `M${bx + bw * l[0]} ${54 + l[2]}H${bx + bw * l[1]}`, stroke: '#fff', 'stroke-opacity': .22, 'stroke-width': 7, 'stroke-linecap': 'round' }));
      N(g, 'text', { x: bx + bw * .08, y: 124, 'font-size': 44, fill: '#fff', 'fill-opacity': .5, 'font-family': 'Spectral,Georgia,serif', 'font-style': 'italic', text: 'Hello!' });
      N(g, 'rect', { x: bx + 30, y: 332, width: bw - 60, height: 12, rx: 6, fill: '#B39D72' });
    }
    if (o.window !== false) {
      const wx = o.windowX || W - 330, ww = 240;
      N(g, 'rect', { x: wx - 10, y: 50, width: ww + 20, height: 230, rx: 14, fill: '#E4D7B8' });
      N(g, 'rect', { x: wx, y: 60, width: ww, height: 210, rx: 8, fill: grad(g, [['#CFE7F2'], ['#EAF5F9']]) });
      N(g, 'circle', { cx: wx + 170, cy: 110, r: 26, fill: '#F6D77A', opacity: .9 });
      cloud(g, wx + 80, 150, 34, '#fff', { stroke: false });
      N(g, 'path', { d: `M${wx + ww / 2} 60V270M${wx} 165H${wx + ww}`, stroke: '#E4D7B8', 'stroke-width': 10 });
    }
    /* the lower wall panel, and a few things every classroom has */
    N(g, 'rect', { x: 0, y: fy - 120, width: W, height: 120, fill: '#EFE4C9', opacity: .7 });
    N(g, 'path', { d: `M0 ${fy - 120}H${W}`, stroke: '#DCCBA3', 'stroke-width': 4 });
    if (o.clockX) {
      const cx = o.clockX, cy = o.clockY || 76;
      N(g, 'circle', { cx, cy: cy + 4, r: 38, fill: '#103D21', opacity: .08 });
      N(g, 'circle', { cx, cy, r: 38, fill: '#fff', stroke: '#B39D72', 'stroke-width': 6 });
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; N(g, 'path', { d: `M${cx + 28 * Math.cos(a)} ${cy + 28 * Math.sin(a)}L${cx + 32 * Math.cos(a)} ${cy + 32 * Math.sin(a)}`, stroke: '#5F6A5C', 'stroke-width': 3, 'stroke-linecap': 'round' }); }
      N(g, 'path', { d: `M${cx} ${cy}L${cx} ${cy - 22}M${cx} ${cy}L${cx + 15} ${cy + 8}`, stroke: '#1D211C', 'stroke-width': 4, 'stroke-linecap': 'round' });
    }
    if (o.pinX) {
      const bx = o.pinX, by = o.pinY || 60, bw = o.pinW || 250, bh = 170;
      N(g, 'rect', { x: bx, y: by, width: bw, height: bh, rx: 10, fill: '#C9A677' });
      N(g, 'rect', { x: bx + 10, y: by + 10, width: bw - 20, height: bh - 20, rx: 6, fill: '#D9BA8C' });
      [['#FBF5D6', 20, 20, -4], ['#E1F1F9', 110, 26, 3], ['#FCE9E4', 40, 90, 2], ['#E4F4E8', 140, 92, -3]].forEach(c2 => {
        const px = bx + c2[1], py = by + c2[2];
        N(g, 'rect', { x: px, y: py, width: 80, height: 56, fill: c2[0], transform: `rotate(${c2[3]} ${px + 40} ${py + 28})` });
        N(g, 'path', { d: `M${px + 12} ${py + 22}h50M${px + 12} ${py + 34}h36`, stroke: '#8B9487', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: .6, transform: `rotate(${c2[3]} ${px + 40} ${py + 28})` });
        N(g, 'circle', { cx: px + 40, cy: py + 4, r: 5, fill: '#B0563A' });
      });
    }
    if (o.plant !== false) {
      const px = o.plantX || W - 90;
      [[-40, -120, -8], [-10, -150, 0], [26, -118, 10], [-30, -80, -14], [20, -86, 12]].forEach(l =>
        N(g, 'path', { d: `M${px} ${fy - 60}Q${px + l[0] * .3} ${fy - 60 + l[1] * .5} ${px + l[0]} ${fy - 60 + l[1]}Q${px + l[0] * .8 + l[2]} ${fy - 60 + l[1] * .55} ${px} ${fy - 60}Z`, fill: grad(g, [['#7FB069'], ['#3F7A43']]) }));
      N(g, 'path', { d: `M${px - 38} ${fy - 64}H${px + 38}L${px + 28} ${fy + 4}H${px - 28}Z`, fill: grad(g, [['#D08C5E'], ['#A86440']]) });
    }
    return g;
  }

  /* a soft studio: warm paper, two big colour washes, a floor to stand on */
  function studio(p, W, H, o = {}){
    const g = G(p, { cls: 'studio' });
    N(g, 'rect', { x: 0, y: 0, width: W, height: H, fill: grad(g, [['#FFFDF6'], ['#F5EEDB']]) });
    const tints = o.tints || ['#F3D9A4', '#CFE3D6'];
    N(g, 'circle', { cx: W * .12, cy: H * .1, r: H * .75, fill: grad(g, [[tints[0], 0, .55], [tints[0], 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }) });
    N(g, 'circle', { cx: W * .9, cy: H * .85, r: H * .85, fill: grad(g, [[tints[1], 0, .6], [tints[1], 1, 0]], { radial: true, cx: '50%', cy: '50%', r: '50%' }) });
    for (let i = 0; i < 40; i++) {
      const x = (i * 197) % W, y = (i * 113) % (H * .7);
      N(g, 'circle', { cx: x, cy: y, r: 2.2, fill: '#B9924F', opacity: .12 });
    }
    N(g, 'ellipse', { cx: W / 2, cy: H + 70, rx: W * .62, ry: 150, fill: '#E9DDBF', opacity: .75 });
    return g;
  }
  /* the frame over every picture: a whisper of grain and a soft vignette,
     so flat shapes read as one lit, printed page */
  function finish(svg, W, H){
    const d = defsOf(svg), id = 'n' + svg.__uid;
    const f = N(d, 'filter', { id, x: 0, y: 0, width: '100%', height: '100%' });
    N(f, 'feTurbulence', { type: 'fractalNoise', baseFrequency: .85, numOctaves: 2, stitchTiles: 'stitch', result: 't' });
    N(f, 'feColorMatrix', { type: 'matrix', values: '0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .12  0 0 0 .07 0' });
    const g = G(svg, { cls: 'finish', 'pointer-events': 'none' });
    N(g, 'rect', { x: 0, y: 0, width: W, height: H, filter: `url(#${id})` });
    N(g, 'rect', { x: 0, y: 0, width: W, height: H, fill: grad(svg, [['#000', 0, 0], ['#000', .72, 0], ['#3A2A10', 1, .16]], { radial: true, cx: '50%', cy: '48%', r: '72%' }) });
    return g;
  }

  /* ------------------------------------------------------------- weather bits */
  function cloud(p, x, y, s, fill, o = {}){
    const g = G(p, { in: o.in, out: o.out, at: o.at, cls: o.cls, style: o.style });
    const d = `M${x - 1.05 * s} ${y + .45 * s}H${x + 1.05 * s}A${.45 * s} ${.45 * s} 0 0 0 ${x + 1 * s} ${y - .38 * s}A${.62 * s} ${.62 * s} 0 0 0 ${x - .12 * s} ${y - .58 * s}A${.5 * s} ${.5 * s} 0 0 0 ${x - .92 * s} ${y - .12 * s}A${.3 * s} ${.3 * s} 0 0 0 ${x - 1.05 * s} ${y + .45 * s}Z`;
    const dark = fill !== '#fff' && shade(fill, -.25);
    N(g, 'path', { d, fill: fill === '#fff' ? '#fff' : grad(g, [[shade(fill, .22)], [fill, .6], [dark]]), stroke: o.stroke === false ? 'none' : 'rgba(16,40,60,.12)', 'stroke-width': 2 });
    N(g, 'path', { d: `M${x - .7 * s} ${y - .1 * s}A${.45 * s} ${.45 * s} 0 0 1 ${x - .1 * s} ${y - .45 * s}`, fill: 'none', stroke: '#fff', 'stroke-opacity': .45, 'stroke-width': .08 * s, 'stroke-linecap': 'round' });
    return g;
  }
  function bolt(p, x, y, s, o = {}){
    return N(p, 'path', { d: `M${x + .1 * s} ${y}L${x - .35 * s} ${y + .75 * s}H${x}L${x - .2 * s} ${y + 1.4 * s}L${x + .45 * s} ${y + .5 * s}H${x + .08 * s}L${x + .3 * s} ${y}Z`,
      fill: grad(p, [['#FFE58A'], ['#F2B72F']]), stroke: '#B8860B', 'stroke-width': 2, 'stroke-linejoin': 'round', in: o.in, out: o.out, cls: o.cls });
  }
  function butterfly(p, x, y, s, c1, c2, o = {}){
    const g = G(p, { cls: o.cls, style: o.style });
    const wing = (k) => {
      N(g, 'path', { d: `M${x} ${y}C${x + k * .3 * s} ${y - 1.1 * s} ${x + k * 1.25 * s} ${y - .9 * s} ${x + k * 1.05 * s} ${y - .1 * s}C${x + k * .95 * s} ${y + .15 * s} ${x + k * .4 * s} ${y + .1 * s} ${x} ${y}Z`, fill: grad(g, [[c1], [c2]], { radial: true }) });
      N(g, 'path', { d: `M${x} ${y + .05 * s}C${x + k * .6 * s} ${y + .1 * s} ${x + k * .85 * s} ${y + .7 * s} ${x + k * .4 * s} ${y + .75 * s}C${x + k * .15 * s} ${y + .7 * s} ${x + k * .05 * s} ${y + .35 * s} ${x} ${y + .05 * s}Z`, fill: grad(g, [[c2], [c1]]) });
      N(g, 'circle', { cx: x + k * .7 * s, cy: y - .45 * s, r: .13 * s, fill: '#fff', opacity: .6 });
    };
    wing(-1); wing(1);
    N(g, 'rect', { x: x - .07 * s, y: y - .45 * s, width: .14 * s, height: 1.1 * s, rx: .07 * s, fill: '#3B2A22' });
    N(g, 'path', { d: `M${x} ${y - .42 * s}Q${x - .2 * s} ${y - .8 * s} ${x - .32 * s} ${y - .85 * s}M${x} ${y - .42 * s}Q${x + .2 * s} ${y - .8 * s} ${x + .32 * s} ${y - .85 * s}`, fill: 'none', stroke: '#3B2A22', 'stroke-width': .05 * s, 'stroke-linecap': 'round' });
    return g;
  }
  function spark(p, x, y, s, fill, o = {}){
    return N(p, 'path', { d: `M${x} ${y - s}Q${x + .15 * s} ${y - .15 * s} ${x + s} ${y}Q${x + .15 * s} ${y + .15 * s} ${x} ${y + s}Q${x - .15 * s} ${y + .15 * s} ${x - s} ${y}Q${x - .15 * s} ${y - .15 * s} ${x} ${y - s}Z`, fill, in: o.in, out: o.out, cls: o.cls });
  }

  /* ------------------------------------------------------------- the iceberg
     Unit shape: the waterline is v = 0, the tip rises to v = -1 and the
     body sinks to v = 2.1; W and H turn units into canvas pixels. */
  function iceberg(p, cx, wl, W, H, o = {}){
    const g = G(p, { cls: 'berg' });
    const P = pts => pts.map(q => (cx + q[0] * W) + ' ' + (wl + q[1] * H)).join(' L');
    const X0 = o.x0 != null ? o.x0 : 0, X1 = o.x1 != null ? o.x1 : cx * 2, Y1 = o.bottom || wl + 2.4 * H;
    if (o.sky !== false) {
      N(g, 'rect', { x: X0, y: o.top || wl - 1.3 * H, width: X1 - X0, height: wl - (o.top || wl - 1.3 * H), fill: grad(g, [['#F6FBFD'], ['#E1F0F6']]) });
      N(g, 'circle', { cx: o.sunX || X1 - W * .5, cy: (o.top || wl - 1.3 * H) + H * .38, r: H * .16, fill: '#FBE3A0' });
      N(g, 'circle', { cx: o.sunX || X1 - W * .5, cy: (o.top || wl - 1.3 * H) + H * .38, r: H * .26, fill: '#FBE3A0', opacity: .3 });
      if (o.clouds !== false) { cloud(g, X0 + W * .45, wl - H * .95, H * .16, '#fff', { stroke: false }); cloud(g, X1 - W * .9, wl - H * .7, H * .11, '#fff', { stroke: false }); }
      [[X0 + W * .9, wl - H * .75], [X0 + W * 1.05, wl - H * .62]].forEach(b => N(g, 'path', { d: `M${b[0] - H * .06} ${b[1]}q${H * .03} ${-H * .04} ${H * .06} 0q${H * .03} ${-H * .04} ${H * .06} 0`, fill: 'none', stroke: '#5E7C8A', 'stroke-width': Math.max(1.5, H * .012), 'stroke-linecap': 'round' }));
    }
    /* water */
    N(g, 'rect', { x: X0, y: wl, width: X1 - X0, height: Y1 - wl, fill: grad(g, [['#A9D3E3'], ['#5E9DBA', .55], ['#2E6A88']]) });
    /* light shafts */
    [[-.9, .25], [.4, .18], [1.2, .22]].forEach(sh => N(g, 'path', { d: `M${cx + sh[0] * W} ${wl}L${cx + (sh[0] + sh[1]) * W} ${wl}L${cx + (sh[0] + sh[1] - .5) * W} ${Y1}L${cx + (sh[0] - .7) * W} ${Y1}Z`, fill: '#fff', opacity: .08 }));
    /* the body under the water */
    const under = [[-.62, 0], [-.86, .72], [-.7, 1.55], [-.12, 2.08], [.56, 1.82], [.92, .98], [.68, 0]];
    N(g, 'path', { d: 'M' + P(under) + 'Z', fill: grad(g, [['#E4F3F8', 0, .95], ['#A9D3E3', 1, .9]]), stroke: '#EAF6FA', 'stroke-width': Math.max(1.5, H * .01), 'stroke-opacity': .8 });
    N(g, 'path', { d: 'M' + P([[.05, 0], [.68, 0], [.92, .98], [.56, 1.82], [-.12, 2.08], [.2, 1.1]]) + 'Z', fill: '#6FA7C0', opacity: .35 });
    N(g, 'path', { d: 'M' + P([[-.62, 0], [-.86, .72], [-.45, .55], [-.2, 0]]) + 'Z', fill: '#fff', opacity: .35 });
    N(g, 'path', { d: 'M' + P([[-.45, .55], [-.7, 1.55], [-.12, 2.08], [.2, 1.1]]) + 'Z', fill: '#fff', opacity: .12 });
    /* bubbles */
    if (o.bubbles !== false) [[-.2, 1.4, .03], [-.12, 1.2, .02], [.3, .7, .025], [1.1, 1.6, .03], [-1.1, 1.1, .02]].forEach(b =>
      N(g, 'circle', { cx: cx + b[0] * W, cy: wl + b[1] * H, r: b[2] * H, fill: 'none', stroke: '#fff', 'stroke-opacity': .6, 'stroke-width': Math.max(1, H * .008), cls: 'bubble' }));
    /* the tip above the water: three facets */
    N(g, 'path', { d: 'M' + P([[-.56, 0], [-.33, -.56], [-.18, -.42], [-.04, 0]]) + 'Z', fill: '#F2F9FB' });
    N(g, 'path', { d: 'M' + P([[-.18, -.42], [.02, -1], [.1, 0], [-.04, 0]]) + 'Z', fill: '#fff' });
    N(g, 'path', { d: 'M' + P([[.02, -1], [.2, -.63], [.34, -.76], [.62, 0], [.1, 0]]) + 'Z', fill: grad(g, [['#D6EBF2'], ['#B7D8E5']]) });
    N(g, 'path', { d: 'M' + P([[-.56, 0], [-.33, -.56], [-.18, -.42], [.02, -1], [.2, -.63], [.34, -.76], [.62, 0]]), fill: 'none', stroke: '#8FBCCF', 'stroke-width': Math.max(1.5, H * .012), 'stroke-linejoin': 'round' });
    /* the waterline, with a glint */
    const wv = []; for (let i = 0; i <= 24; i++) { const xx = X0 + (X1 - X0) * i / 24; wv.push((i ? 'Q' : 'M') + (i ? (xx - (X1 - X0) / 48) + ' ' + (wl + (i % 2 ? -1 : 1) * H * .025) + ' ' : '') + xx + ' ' + wl); }
    N(g, 'path', { d: wv.join(' '), fill: 'none', stroke: '#fff', 'stroke-width': Math.max(2, H * .018), 'stroke-opacity': .85, 'stroke-linecap': 'round' });
    return g;
  }

  /* ------------------------------------------------------------- weather scale */
  let wuid = 0;
  function weather(n){
    const u = 'w' + (++wuid);
    const defs = `<defs><radialGradient id="${u}s" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFE9A3"/><stop offset="1" stop-color="#F2B53A"/></radialGradient>
      <linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#DCE6EB"/></linearGradient>
      <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9C7CF"/><stop offset="1" stop-color="#7F939E"/></linearGradient>
      <linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8395A0"/><stop offset="1" stop-color="#4B5C66"/></linearGradient>
      <linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE58A"/><stop offset="1" stop-color="#F2B72F"/></linearGradient></defs>`;
    const cl = (fill, dy = 0, stroke = 'rgba(40,60,70,.25)') => `<path d="M9 ${36 + dy}h30a8 8 0 0 0 .5-16 11 11 0 0 0-21-2.5A8 8 0 0 0 9 ${36 + dy}z" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/><path d="M15 ${24 + dy}a8 8 0 0 1 8-6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>`;
    const sun = (cx, cy, r) => `<g><circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="#FBE3A0" opacity=".45"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}s)"/><circle cx="${cx - r * .35}" cy="${cy - r * .35}" r="${r * .25}" fill="#fff" opacity=".6"/></g>`;
    const body = [
      sun(24, 24, 11) + '<g stroke="#F2B53A" stroke-width="3" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const t = a * Math.PI / 180; return `<path d="M${24 + 16 * Math.cos(t)} ${24 + 16 * Math.sin(t)}L${24 + 21 * Math.cos(t)} ${24 + 21 * Math.sin(t)}"/>`; }).join('') + '</g>',
      sun(17, 17, 9) + cl(`url(#${u}c)`, 2),
      cl(`url(#${u}c)`, -2) + `<path d="M4 38h40" stroke="#C5D3DA" stroke-width="2" stroke-linecap="round" opacity=".6"/>`,
      cl(`url(#${u}g)`, -6) + '<g stroke="#4A90B8" stroke-width="3" stroke-linecap="round"><path d="M15 35l-2 6M24 35l-2 6M33 35l-2 6"/></g>',
      cl(`url(#${u}d)`, -8) + `<path d="M26 27l-7 11h6l-3 9 11-13h-6l3-7z" fill="url(#${u}b)" stroke="#A7780E" stroke-width="1.2" stroke-linejoin="round"/><g stroke="#4A90B8" stroke-width="2.5" stroke-linecap="round"><path d="M13 34l-2 5M38 34l-2 5"/></g>`
    ][n - 1];
    return `<svg viewBox="0 0 48 48" aria-hidden="true">${defs}${body}</svg>`;
  }

  /* ------------------------------------------------------------- filter scale
     The affective filter as a window shutter: 1 is shut tight, 5 is wide
     open with the sun coming in. It asks how much room there is for
     English right now, which — unlike "how strong is the feeling" — means
     the same thing for "worried" as for "terrified". */
  let suid = 0;
  function shutter(n){
    const u = 's' + (++suid), h = 28 * (5 - n) / 4;
    let slats = '';
    for (let y = 13; y < 10 + h - 1; y += 4) slats += `<path d="M10 ${y}h28" stroke="#F8DCCF" stroke-width="1.2" opacity=".7"/>`;
    return `<svg viewBox="0 0 48 48" aria-hidden="true"><defs>
      <linearGradient id="${u}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7F2"/><stop offset="1" stop-color="#FFF6D8"/></linearGradient>
      <linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9795C"/><stop offset="1" stop-color="#A94E33"/></linearGradient></defs>
      <rect x="4" y="5" width="40" height="38" rx="7" fill="#E9DCBF"/>
      <rect x="9" y="10" width="30" height="28" rx="3" fill="url(#${u}k)"/>
      <circle cx="30" cy="30" r="${3 + n}" fill="#F6C94E" opacity="${.35 + n * .13}"/>
      <path d="M12 36q6-6 12 0t12 0" fill="none" stroke="#8FBF7C" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      ${h > 0 ? `<rect x="9" y="10" width="30" height="${h}" rx="2" fill="url(#${u}c)"/>${slats}<rect x="20" y="${10 + h - 3}" width="8" height="3" rx="1.5" fill="#7A3622"/>` : ''}
      <rect x="9" y="10" width="30" height="28" rx="3" fill="none" stroke="#B89F6E" stroke-width="1.5"/></svg>`;
  }

  return { figure, room, studio, finish, cloud, bolt, butterfly, spark, iceberg, weather, shutter, grad, shade, soft, CAST, POSES };
})();
