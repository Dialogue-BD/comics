// Adapted from React Bits — ScrollReveal. Words sharpen and darken as you scroll.
import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, className = '', baseOpacity = 0.12, blur = 4, start = 'top 85%', end = 'top 35%' }) {
  const ref = useRef(null);
  const words = useMemo(() => String(children).split(/(\s+)/).map((w, i) => /^\s+$/.test(w) ? w : <span className="sr-w" key={i}>{w}</span>), [children]);
  useEffect(() => {
    const el = ref.current;
    const ws = el.querySelectorAll('.sr-w');
    const tw = gsap.fromTo(ws, { opacity: baseOpacity, filter: `blur(${blur}px)` }, {
      opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: el, start, end, scrub: true }
    });
    return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  }, [children]);
  return <p ref={ref} className={`scroll-reveal ${className}`}>{words}</p>;
}
