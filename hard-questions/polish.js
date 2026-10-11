/* AI: Hearing Human Voices on Hard Questions — interface polish.
   Smooth scrolling (Lenis), entrance and step transitions (GSAP), and three
   small effects ported from React Bits (reactbits.dev, MIT + Commons Clause)
   to vanilla JS so the page stays build-free: BlurText for the title,
   SpotlightCard for the speaker cards and ClickSpark for answer taps.
   Nothing here gates progress — every effect is decoration on top of app.js,
   and all of it switches off for people who ask for reduced motion. */

const gsap = window.gsap;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);

/* ---------- Lenis smooth scroll ---------- */
if (!reduce && window.Lenis) {
  const lenis = new window.Lenis({ lerp: .11, smoothWheel: true, prevent: node => !!node.closest?.('dialog, #karaoke-line, #full-transcript') });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  // Dialogs own their own scrolling.
  const guide = $('guide-dialog');
  if (guide) { new MutationObserver(() => guide.open ? lenis.stop() : lenis.start()).observe(guide, { attributes: true, attributeFilter: ['open'] }); }
  window.dialogueLenis = lenis;
}

/* ---------- BlurText title + intro ---------- */
if (gsap && !reduce) {
  const title = $('title');
  const chars = [];
  const splitNode = node => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const word of child.textContent.split(/(\s+)/)) {
          if (!word) continue;
          if (/^\s+$/.test(word)) { frag.append(word); continue; }
          const w = document.createElement('span'); w.className = 'bt-word';
          for (const ch of word) { const c = document.createElement('span'); c.className = 'bt-char'; c.textContent = ch; w.append(c); chars.push(c); }
          frag.append(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') splitNode(child);
    }
  };
  if (title) {
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
    splitNode(title);
    title.querySelectorAll('.bt-word').forEach(w => w.setAttribute('aria-hidden', 'true'));
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(chars, { autoAlpha: 0, filter: 'blur(12px)', yPercent: -40, duration: .9, stagger: .035 })
      .from('.intro .eyebrow, .intro .lead', { autoAlpha: 0, y: 18, duration: .8, stagger: .1 }, .25)
      .from('.session-card', { autoAlpha: 0, y: 24, scale: .97, duration: .9 }, .35)
      .from('.section-line', { autoAlpha: 0, y: 14, duration: .7 }, .45);
  }
  // Speaker cards deal in once app.js has drawn them.
  const grid = $('voices');
  if (grid) {
    let dealt = false;
    const deal = () => {
      if (dealt || !grid.children.length) return; dealt = true;
      gsap.from(grid.children, { autoAlpha: 0, y: 26, rotateX: -18, transformPerspective: 600, duration: .8, stagger: .05, ease: 'expo.out', delay: .35, clearProps: 'transform,opacity,visibility' });
    };
    new MutationObserver(deal).observe(grid, { childList: true });
    deal();
  }
}

/* ---------- SpotlightCard on the speaker cards ---------- */
document.addEventListener('pointermove', e => {
  const card = e.target.closest?.('.voice, .scene-chapter, .discussion-card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

/* ---------- Step changes slide in rather than snap ---------- */
if (gsap && !reduce) {
  for (const id of ['hear-panel', 'catch-panel', 'watch-panel', 'talk-panel']) {
    const panel = $(id); if (!panel) continue;
    new MutationObserver(() => {
      if (panel.hidden) return;
      gsap.fromTo(panel, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .55, ease: 'expo.out', clearProps: 'transform' });
      gsap.fromTo(['#task-title', '#task-detail'], { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .5, stagger: .06, ease: 'power3.out' });
    }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
  // A new speaker: the portrait wipes in.
  const portrait = $('portrait');
  if (portrait) new MutationObserver(() => {
    gsap.fromTo(portrait, { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: .9, ease: 'expo.out' });
    gsap.fromTo('.portrait-caption > *', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out', delay: .15 });
  }).observe(portrait, { attributes: true, attributeFilter: ['src'] });
  // Word chips: celebrate hits, nudge misses.
  const chips = $('chips');
  if (chips) new MutationObserver(list => {
    for (const m of list) {
      const el = m.target; if (m.type !== 'attributes' || !el.classList) continue;
      const was = m.oldValue || '';
      if (el.classList.contains('hit') && !was.includes('hit')) gsap.fromTo(el, { scale: .9 }, { scale: 1, duration: .6, ease: 'elastic.out(1, .45)' });
      if ((el.classList.contains('false') && !was.includes('false')) || (el.classList.contains('miss') && !was.includes('miss'))) gsap.fromTo(el, { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1.2, .3)' });
    }
  }).observe(chips, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  // Chips deal in for each new clip.
  if (chips) new MutationObserver(() => { if (chips.children.length) gsap.from(chips.children, { autoAlpha: 0, y: 12, scale: .94, duration: .45, stagger: .035, ease: 'back.out(1.6)', clearProps: 'all' }); }).observe(chips, { childList: true });
}

/* ---------- ClickSpark ---------- */
if (!reduce) {
  const canvas = document.createElement('canvas');
  canvas.className = 'click-spark'; canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  let sparks = [], running = false;
  const size = () => { const d = Math.min(2, devicePixelRatio || 1); canvas.width = innerWidth * d; canvas.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);
  const draw = now => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(s => now - s.t < 420);
    for (const s of sparks) {
      const p = (now - s.t) / 420, e = p * (2 - p), d = e * 26, len = 10 * (1 - e);
      ctx.strokeStyle = s.c; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
      ctx.lineTo(s.x + Math.cos(s.a) * (d + len), s.y + Math.sin(s.a) * (d + len));
      ctx.stroke();
    }
    if (sparks.length) requestAnimationFrame(draw); else running = false;
  };
  document.addEventListener('pointerdown', e => {
    const t = e.target.closest?.('.chip, .answers button, button.primary, .scene-chapter, #karaoke-line button');
    if (!t || t.disabled) return;
    const now = performance.now(), c = getComputedStyle(document.documentElement).getPropertyValue('--spark').trim() || '#b9924f';
    for (let i = 0; i < 8; i++) sparks.push({ x: e.clientX, y: e.clientY, a: i / 8 * Math.PI * 2, t: now, c });
    if (!running) { running = true; requestAnimationFrame(draw); }
  });
}
