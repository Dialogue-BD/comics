// One smooth scroll for the whole activity: Lenis drives the page, GSAP's ticker
// drives Lenis, and ScrollTrigger hears every scroll. Units are one long page each.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
const reduce = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.15, smoothWheel: !reduce(), easing: (t) => 1 - Math.pow(1 - t, 3.2) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function headerOffset() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
  return (isFinite(v) ? v : 64) + 8;
}

export function scrollToEl(el, { immediate = false, offset } = {}) {
  if (!el) return;
  const off = offset != null ? offset : -headerOffset();
  if (lenis) lenis.scrollTo(el, { offset: off, immediate: immediate || reduce(), duration: 1.25, lock: false });
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}

export function scrollTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
  if (immediate) ScrollTrigger.refresh();
}

// Pause smooth scrolling while a dialog is open.
export function lockScroll(on) {
  if (!lenis) return;
  if (on) lenis.stop(); else lenis.start();
}

export function refreshTriggers() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export { ScrollTrigger };
