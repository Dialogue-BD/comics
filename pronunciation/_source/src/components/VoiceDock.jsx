// After any recording plays, a small dock offers it again in every voice: tap a voice
// to hear just that one, or "Both voices" to hear each voice say it twice. The picture
// on the page follows whoever is speaking. The dock stays out of the way: it never
// appears for a game's hidden answer, and it slips away when you scroll on or wait.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import engine, { VOICES } from '../lib/audio';
import { labelOf } from './Bits';
import { getLenis } from '../lib/scroll';
import { IClose, IReplay } from './Icons';
import { useSettings } from '../lib/settings';

const TIMES = 2;
const IDLE = 12000;

export default function VoiceDock() {
  const { bangla } = useSettings();
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(null);        // { voice, i, n } while the dock is speaking
  const [running, setRunning] = useState(false);
  const box = useRef(null);
  const st = useRef({ last: '', hold: false, timer: null, y: 0, running: false });

  const hideLater = () => {
    const S = st.current;
    clearTimeout(S.timer);
    S.timer = setTimeout(() => { if (!S.hold && !S.running && !engine.playingId()) setOpen(false); }, IDLE);
  };

  // follow what plays
  useEffect(() => engine.subscribe(s => {
    const S = st.current;
    if (s.playing) {
      if (s.quiz) { if (!S.running) setOpen(false); return; }
      const mine = s.seq && (s.seq.kind === 'every' || s.seq.kind === 'dock');
      if (!mine && engine.voicesOf(s.id).length > 1) {
        if (S.last !== s.id) { S.last = s.id; setId(s.id); }
        S.y = window.scrollY;
        setOpen(true);
      }
      const k = `${s.id}:${s.voice}:${s.seq ? s.seq.i : -1}`;
      if (k !== S.nowKey) { S.nowKey = k; setNow({ voice: s.voice, i: s.seq && s.seq.kind === 'every' ? s.seq.i : null, n: s.seq ? s.seq.n : null }); }
      clearTimeout(S.timer);
    } else {
      if (!S.running) { S.nowKey = ''; setNow(null); }
      hideLater();
    }
  }), []);

  // scrolling well past where it was heard puts the dock away
  useEffect(() => {
    const f = () => {
      const S = st.current;
      if (S.running || S.hold) return;
      if (Math.abs(window.scrollY - S.y) > window.innerHeight * 0.75) setOpen(false);
    };
    const l = getLenis();
    if (l) l.on('scroll', f); else window.addEventListener('scroll', f, { passive: true });
    return () => { if (l) l.off('scroll', f); else window.removeEventListener('scroll', f); };
  }, []);

  // slide in / out
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open) gsap.fromTo(el, { y: reduce ? 0 : 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }, [open, id]);

  // stop everything when the page changes
  useEffect(() => {
    const f = () => { setOpen(false); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  if (!open || !id) return null;
  const voices = VOICES.filter(v => engine.has(id, v.id));
  const order = voices.map(v => v.id).sort((a, b) => (b === engine.voice) - (a === engine.voice));
  const label = labelOf(id);

  const every = async () => {
    const S = st.current;
    if (S.running) { engine.stop(); return; }
    S.running = true; setRunning(true);
    await engine.everyVoice(id, TIMES);
    S.running = false; setRunning(false); S.nowKey = ''; setNow(null);
    hideLater();
  };
  const one = (v) => {
    const S = st.current;
    if (S.running) { engine.stop(); }
    engine.play(id, { voice: v, seq: { kind: 'dock' } });
  };
  const close = () => { engine.stop(); setOpen(false); };
  const speaking = now && now.voice;
  const steps = order.flatMap(v => Array.from({ length: TIMES }, () => v));

  return (
    <div className={`vdock ${running ? 'is-running' : ''}`} ref={box} role="region" aria-label="Hear it in every voice"
      onPointerEnter={() => { st.current.hold = true; }} onPointerLeave={() => { st.current.hold = false; hideLater(); }}
      onFocus={() => { st.current.hold = true; }} onBlur={() => { st.current.hold = false; hideLater(); }}>
      <div className="vd-head">
        <span className="vd-kick">{bangla ? <span lang="bn">আরেক কণ্ঠে শুনুন</span> : 'Hear it again'}</span>
        <span className="vd-word" title={label}>{label}</span>
      </div>
      <div className="vd-voices">
        {voices.map(v => (
          <button key={v.id} className={`vd-v ${speaking === v.id ? 'speaking' : ''}`} onClick={() => one(v.id)} aria-label={`${v.name}, ${v.accentLong} English`}>
            <span className="vd-av" aria-hidden="true">{v.name[0]}<i className="vd-eq"><b /><b /><b /></i></span>
            <span className="vd-name">{v.name}<small>{v.accent}</small></span>
          </button>
        ))}
      </div>
      <button className={`vd-all ${running ? 'on' : ''}`} onClick={every}>
        <IReplay />
        <span>{running ? 'Stop' : `Both voices ×${TIMES}`}</span>
        <span className="vd-steps" aria-hidden="true">
          {steps.map((v, k) => <i key={k} className={`${now && now.i != null && k < now.i ? 'done' : ''} ${now && now.i === k ? 'cur' : ''}`}>{v[0].toUpperCase()}</i>)}
        </span>
      </button>
      <button className="vd-x" onClick={close} aria-label="Close"><IClose /></button>
      <span className="sr-only" aria-live="polite">{speaking ? `${VOICES.find(v => v.id === speaking).name} speaking` : ''}</span>
    </div>
  );
}
