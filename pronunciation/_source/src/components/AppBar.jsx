import React, { useEffect, useRef, useState } from 'react';
import { useSettings, T } from '../lib/settings';
import { IMenu, IClose, ITv, IPrint, IBook, STEP_ICON } from './Icons';
import { UNITS, STEPS, UI } from '../content/units';
import TeacherNotes from './TeacherNotes';
import { getLenis, lockScroll } from '../lib/scroll';
import engine, { VOICES } from '../lib/audio';
import { useVoice } from '../lib/hooks';

export function LangToggle() {
  const { bangla, setBangla } = useSettings();
  return (
    <div className="lang" role="group" aria-label="Language">
      <button className={!bangla ? 'on' : ''} aria-pressed={!bangla} onClick={() => setBangla(false)}>EN</button>
      <button className={bangla ? 'on' : ''} aria-pressed={bangla} onClick={() => setBangla(true)} lang="bn">বাংলা</button>
    </div>
  );
}

// Who speaks: Alice (British) or Brian (American). Pairs Brian has not recorded stay
// with Alice, so a comparison is never split between two voices.
export function VoiceToggle({ big = false }) {
  const [voice, setVoice] = useVoice();
  return (
    <div className={`voice-tg ${big ? 'big' : ''}`} role="group" aria-label="Voice">
      {VOICES.map(v => (
        <button key={v.id} className={voice === v.id ? 'on' : ''} aria-pressed={voice === v.id} onClick={() => setVoice(v.id)}
          title={`${v.name} · ${v.accentLong} English (V to switch)`}>
          <span className="vt-av" aria-hidden="true">{v.name[0]}</span>
          <span className="vt-n">{v.name}</span><span className="vt-a">{v.accent}</span>
        </button>
      ))}
    </div>
  );
}

export default function AppBar({ unit, stepKey, onStep, go }) {
  const { stage, setStage, autoplay, setAutoplay, bangla } = useSettings();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(false);
  const ref = useRef(null);

  // measure the real bar height for the layout below it
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-h', ref.current.offsetHeight + 'px');
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // how far down the page we are: a thin gold line under the bar
  const prog = useRef(null);
  useEffect(() => {
    const set = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      if (prog.current) prog.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    set();
    const l = getLenis();
    if (l) l.on('scroll', set); else window.addEventListener('scroll', set, { passive: true });
    return () => { if (l) l.off('scroll', set); else window.removeEventListener('scroll', set); };
  }, []);
  useEffect(() => { lockScroll(open || notes); }, [open, notes]);

  useEffect(() => {
    const k = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === 'p' || e.key === 'P') setStage(s => !s);
      if ((e.key === 'v' || e.key === 'V') && !e.metaKey && !e.ctrlKey) {
        const i = VOICES.findIndex(v => v.id === engine.voice);
        engine.setVoice(VOICES[(i + 1) % VOICES.length].id);
      }
      if (e.key === 'Escape') { setOpen(false); setNotes(false); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [setStage]);

  return (
    <>
      <header className="appbar" ref={ref}>
        <div className="topbar">
          <a className="logo-chip" href="../" aria-label="Dialogue — all activities" title="All Dialogue activities">
            <img src="../brand/dialogue-logo.png" alt="Dialogue English & Skills Center" />
          </a>
          <a className="brand-name" href="#/" onClick={(e) => { e.preventDefault(); go('#/'); }}>
            <span className="brand-g" aria-hidden="true">🎵</span>
            <span className="brand-t">Voice Lab{unit && <span className="brand-u"> · {unit.n} {unit.title.en}</span>}</span>
            {stage && <span className="on-tv">ON TV</span>}
          </a>
          {unit && (
            <nav className="steps-ctl is-wide" aria-label="Steps">
              {unit.steps.map((s, i) => {
                const I = STEP_ICON[STEPS[s.key].icon];
                return (
                  <button key={s.key} className={stepKey === s.key ? 'on' : ''} aria-current={stepKey === s.key ? 'step' : undefined} onClick={() => onStep(s.key)}>
                    <span className="n">{i + 1}</span><span className="lbl">{STEPS[s.key].en}</span>
                    {bangla && <span className="bn-inl" lang="bn">{STEPS[s.key].bn}</span>}
                  </button>
                );
              })}
            </nav>
          )}
          <div className="bar-end">
            <VoiceToggle />
            <LangToggle />
            <button className={`icon-btn tv ${stage ? 'on' : ''}`} onClick={() => setStage(!stage)} aria-pressed={stage} title="Present on TV (P)">
              <ITv /><span className="tv-l">TV</span>
            </button>
            <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Menu" aria-expanded={open}><IMenu /></button>
          </div>
        </div>
        <span className="bar-progress" aria-hidden="true"><i ref={prog} /></span>
        {unit && (
          <nav className="steps-ctl is-narrow" aria-label="Steps">
            {unit.steps.map((s, i) => (
              <button key={s.key} className={stepKey === s.key ? 'on' : ''} aria-current={stepKey === s.key ? 'step' : undefined} onClick={() => onStep(s.key)}>
                <span className="n">{i + 1}</span><span className="lbl">{STEPS[s.key].en}</span>
                {bangla && <span className="bn-inl" lang="bn">{STEPS[s.key].bn}</span>}
              </button>
            ))}
          </nav>
        )}
      </header>

      {open && (
        <div className="sheet-scrim" onClick={() => setOpen(false)}>
          <aside className="sheet" role="dialog" aria-modal="true" aria-label="Menu" onClick={e => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="kicker">Voice Lab</span>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu"><IClose /></button>
            </div>
            <div className="sheet-units">
              {UNITS.map(u => (
                <a key={u.id} href={`#/u/${u.id}/0`} className={`sheet-unit ${unit && unit.id === u.id ? 'on' : ''}`}
                  onClick={(e) => { e.preventDefault(); setOpen(false); go(`#/u/${u.id}/0`); }}>
                  <span className="sn">{u.n}</span>
                  <T en={u.title.en} bn={u.title.bn} className="st" />
                </a>
              ))}
            </div>
            <div className="sheet-sec sheet-voice">
              <T en="Voice" bn="কণ্ঠ" as="strong" className="sv-h" />
              <VoiceToggle big />
              <T as="p" className="sv-note" en="Alice speaks British English, Brian American. Both are correct. After any sound, “Both voices” plays it twice in each." bn="অ্যালিস ব্রিটিশ ইংরেজি বলেন, ব্রায়ান আমেরিকান। দুটোই সঠিক। যেকোনো শব্দের পরে “Both voices” চাপলে দুজনেই দুবার করে বলবেন।" />
            </div>
            <div className="sheet-sec">
              <label className="switch"><input type="checkbox" checked={stage} onChange={e => setStage(e.target.checked)} /><span className="track" /><T en={UI.presentOnTv.en + ' (P)'} bn={UI.presentOnTv.bn} /></label>
              <label className="switch"><input type="checkbox" checked={autoplay} onChange={e => setAutoplay(e.target.checked)} /><span className="track" /><T en={UI.autoplay.en} bn={UI.autoplay.bn} /></label>
            </div>
            <div className="sheet-sec">
              <button className="btn quiet" onClick={() => { setOpen(false); setNotes(true); }}><IBook /> {UI.forTeacher.en}</button>
              <button className="btn quiet" onClick={() => { setOpen(false); setTimeout(() => window.print(), 60); }}><IPrint /> {UI.print.en}</button>
            </div>
          </aside>
        </div>
      )}
      {notes && <TeacherNotes onClose={() => setNotes(false)} />}
    </>
  );
}
