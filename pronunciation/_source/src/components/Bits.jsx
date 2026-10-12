import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import engine from '../lib/audio';
import { usePlayingId } from '../lib/hooks';
import { T, useSettings } from '../lib/settings';
import { IPlay, IPause, IHand, IThroat, IEar } from './Icons';
import { LABEL, UI } from '../content/units';

export const labelOf = (id) => LABEL[id] || (id.split('-').slice(1).join('-'));

// Play one clip, or several in a row.
export function ClipButton({ ids, label, sub, className = '', variant = 'word', children, onPlayed, disabled }) {
  const list = Array.isArray(ids) ? ids : [ids];
  const playing = usePlayingId(list);
  const click = async (e) => {
    e.stopPropagation();
    if (playing) { engine.stop(); return; }
    const r = list.length > 1 ? await engine.sequence(list) : await engine.play(list[0]);
    if (r === 'ended' && onPlayed) onPlayed();
  };
  return (
    <button type="button" className={`clip-btn v-${variant} ${playing ? 'is-playing' : ''} ${className}`} onClick={click} disabled={disabled}
      aria-label={`${playing ? 'Stop' : 'Play'} ${label || list.map(labelOf).join(', ')}`}>
      <span className="cb-ico">{playing ? <IPause /> : <IPlay />}</span>
      {children || (
        <span className="cb-txt">
          <span className="cb-label">{label || labelOf(list[0])}</span>
          {sub && <span className="cb-sub">{sub}</span>}
        </span>
      )}
    </button>
  );
}

export function L1Note({ text }) {
  if (!text) return null;
  return (
    <aside className="l1-note">
      <span className="l1-tag" aria-hidden="true"><b>বাংলা</b><i>↔</i><b>English</b></span>
      <T en={text.en} bn={text.bn} as="p" />
    </aside>
  );
}

export function Feel({ text, icon = 'hand' }) {
  if (!text) return null;
  const I = icon === 'throat' ? IThroat : IHand;
  return (
    <aside className="feel-note">
      <span className="feel-ico" aria-hidden="true"><I /></span>
      <T en={text.en} bn={text.bn} as="p" />
    </aside>
  );
}

export function Note({ text }) {
  if (!text) return null;
  return <T en={text.en} bn={text.bn} as="p" className="scene-note" />;
}

// "Audio starts in 3" — only after the student has touched the page once, and only
// when automatic sound is on. Tapping it plays now; the × cancels.
export function Countdown({ ids, sceneKey }) {
  const { autoplay } = useSettings();
  const [n, setN] = useState(null);
  const timer = useRef(null);
  useEffect(() => {
    if (!autoplay || !ids || !ids.length) return;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      let k = 3; setN(k);
      timer.current = setInterval(() => {
        k -= 1;
        if (k <= 0) { clearInterval(timer.current); setN(null); if (!cancelled) engine.sequence(ids); }
        else setN(k);
      }, 900);
    };
    const delay = setTimeout(() => { if (engine.unlocked && !engine.playingId()) start(); }, 700);
    // any sound the student starts themselves cancels the countdown
    const off = engine.subscribe(s => { if (s.playing && timer.current) { clearInterval(timer.current); timer.current = null; setN(null); } });
    return () => { cancelled = true; clearTimeout(delay); clearInterval(timer.current); timer.current = null; off(); setN(null); };
  }, [sceneKey, autoplay]);
  if (n == null) return null;
  return (
    <div className="countdown" role="status">
      <button className="cd-main" onClick={() => { clearInterval(timer.current); setN(null); engine.sequence(ids); }}>
        <span className="cd-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle cx="18" cy="18" r="15" className="cd-arc" style={{ strokeDashoffset: (n / 3) * 94 }} /></svg><b>{n}</b></span>
        <T en={UI.startsIn.en} bn={UI.startsIn.bn} className="cd-l" />
      </button>
      <button className="cd-x" aria-label="Cancel" onClick={() => { clearInterval(timer.current); setN(null); }}>×</button>
    </div>
  );
}

export function useEnter(dep) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const kids = ref.current.querySelectorAll(':scope > .enter, :scope .enter');
    gsap.fromTo(kids, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' });
  }, [dep]);
  return ref;
}

export function EarDisc({ active }) {
  return (
    <div className={`ear-disc ${active ? 'is-on' : ''}`} aria-hidden="true">
      <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
      <span className="ear-core"><IEar /></span>
    </div>
  );
}
