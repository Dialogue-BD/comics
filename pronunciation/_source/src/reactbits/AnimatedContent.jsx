// Adapted from React Bits — AnimatedContent. Slides in once when scrolled into view.
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function AnimatedContent({ children, distance = 60, delay = 0, duration = 0.9, scale = 1, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    gsap.set(el, { y: distance, scale, opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { y: 0, scale: 1, opacity: 1, duration, delay, ease: 'power3.out' })
    });
    return () => st.kill();
  }, []);
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
