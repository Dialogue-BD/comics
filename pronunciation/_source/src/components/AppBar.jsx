import React, { useEffect, useRef, useState } from 'react';
import { useSettings, T } from '../lib/settings';
import { IMenu, IClose, ITv, IPrint, IBook, STEP_ICON } from './Icons';
import { UNITS, STEPS, UI } from '../content/units';
import TeacherNotes from './TeacherNotes';

export function LangToggle() {
  const { bangla, setBangla } = useSettings();
  return (
    <div className="lang" role="group" aria-label="Language">
      <button className={!bangla ? 'on' : ''} aria-pressed={!bangla} onClick={() => setBangla(false)}>EN</button>
      <button className={bangla ? 'on' : ''} aria-pressed={bangla} onClick={() => setBangla(true)} lang="bn">বাংলা</button>
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

  useEffect(() => {
    const k = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === 'p' || e.key === 'P') setStage(s => !s);
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
            <span className="brand-t">Voice Lab</span>
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
            <LangToggle />
            <button className={`icon-btn tv ${stage ? 'on' : ''}`} onClick={() => setStage(!stage)} aria-pressed={stage} title="Present on TV (P)">
              <ITv /><span className="tv-l">TV</span>
            </button>
            <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Menu" aria-expanded={open}><IMenu /></button>
          </div>
        </div>
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
