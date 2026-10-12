// One unit = one long page. No Next button: the student scrolls (smoothly, with
// Lenis) from the hero through Hear → Play, and on into the next unit.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AppBar from '../components/AppBar';
import engine, { clip as getClip } from '../lib/audio';
import { T, useSettings } from '../lib/settings';
import { scrollToEl, scrollTop, ScrollTrigger, getLenis } from '../lib/scroll';
import { L1Note } from '../components/Bits';
import { IArrowR, IPlay, IPause, STEP_ICON } from '../components/Icons';
import { UNITS, STEPS, UI } from '../content/units';
import { usePlayingId, useClip } from '../lib/hooks';
import VoiceLine from '../components/VoiceLine';
import MouthDiagram from '../components/mouth/MouthDiagram';
import UnitGlyph from '../components/UnitGlyph';
import SplitText from '../reactbits/SplitText';
import * as M from '../components/sections/Music';
import * as S from '../components/sections/Sounds';
import * as G from '../components/sections/Games';
import * as A from '../components/sections/Accent';

const BODY = {
  lines: M.LinesSection, schwa: M.SchwaSection, suffix: M.SuffixSection, prefix: M.PrefixSection, compound: M.CompoundSection,
  legend: M.LegendSection, rushdemo: M.RushDemoSection, melody: M.MelodySection, pause: M.PauseSection, links: M.LinksSection,
  years: M.YearsSection, phone: M.PhoneSection, meaning: M.MeaningSection,
  pairs: S.PairsSection, er: S.ErSection, doors: S.DoorsSection, bhv: S.BhvSection, clusters: S.ClustersSection, thgroups: S.ThGroupsSection,
  identify: G.IdentifyGame, stress: G.StressGame, compoundgame: G.CompoundGame, bigbeat: G.BigBeatGame, rush: G.RushGame,
  pausegame: G.PauseGame, linkgame: G.LinkGame, numbergame: G.NumberGame, clustergame: G.ClusterGame,
  accentpairs: A.AccentPairsSection, matters: A.MattersSection, accentgame: A.AccentGame,
};

export default function Unit({ unitId, idx, go }) {
  const unit = UNITS.find(u => u.id === unitId) || UNITS[0];
  const ui = UNITS.indexOf(unit);
  const next = UNITS[ui + 1];
  const { autoplay, bangla, stage } = useSettings();
  const sections = useMemo(() => {
    const out = [];
    unit.steps.forEach((s, si) => s.sections.forEach((sc, k) => out.push({ ...sc, step: s.key, stepN: si + 1, firstOfStep: k === 0 })));
    return out;
  }, [unit]);
  const secEls = useRef([]);
  const root = useRef(null);
  const [active, setActive] = useState(-1);
  const autoplayed = useRef(new Set());

  useEffect(() => { engine.preload(unit.preload); }, [unit]);

  // arrive: at the top, or at the section in the link
  useLayoutEffect(() => {
    if (idx > 0 && secEls.current[idx]) {
      // pictures above size themselves after the first paint; land again once they have
      let moved = false;
      const mark = () => { moved = true; };
      window.addEventListener('wheel', mark, { once: true, passive: true });
      window.addEventListener('touchstart', mark, { once: true, passive: true });
      const land = () => { if (!moved) scrollToEl(secEls.current[idx], { immediate: true }); };
      requestAnimationFrame(land);
      const t1 = setTimeout(land, 350), t2 = setTimeout(land, 1000);
      return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('wheel', mark); window.removeEventListener('touchstart', mark); };
    }
    scrollTop();
  }, [unit.id]);
  const firstIdx = useRef(true);
  useEffect(() => {
    if (firstIdx.current) { firstIdx.current = false; return; }
    if (idx >= 0 && secEls.current[idx] && idx !== active) scrollToEl(secEls.current[idx]);
  }, [idx]);

  // which section is in the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) setActive(+e.target.dataset.idx); });
    }, { rootMargin: '-42% 0px -52% 0px' });
    secEls.current.forEach(el => el && io.observe(el));
    // stop a recording when its section scrolls away
    const away = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) return;
        const pid = engine.playingId();
        if (pid && e.target.querySelector(`[data-clip~="${pid}"]`)) engine.stop();
      });
    }, { threshold: 0 });
    secEls.current.forEach(el => el && away.observe(el));
    return () => { io.disconnect(); away.disconnect(); };
  }, [unit.id, sections.length]);

  // keep the address current (so a link or a refresh lands here), and autoplay
  useEffect(() => {
    if (active < 0) return;
    try { history.replaceState(null, '', `#/u/${unit.id}/${active}`); } catch (e) {}
    const sc = sections[active];
    if (!autoplay || !sc || !sc.autoplay || autoplayed.current.has(sc.id)) return;
    const t = setTimeout(() => {
      if (!engine.unlocked || engine.playingId()) return;
      autoplayed.current.add(sc.id);
      engine.sequence(sc.autoplay, 0.35, { seq: { kind: 'auto' } });
    }, 900);
    return () => clearTimeout(t);
  }, [active, autoplay]);

  // scroll-in animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      ScrollTrigger.batch('.rv', {
        start: 'top 88%', once: true,
        onEnter: (b) => gsap.fromTo(b, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true }),
      });
      gsap.utils.toArray('.manifesto').forEach(el => {
        gsap.fromTo(el, { scale: 0.95, opacity: 0.75 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true } });
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [unit.id, bangla, stage]);

  // keys: → / PageDown next section, ← / PageUp back
  useEffect(() => {
    const k = (e) => {
      if (e.target && /input|textarea|select|button/i.test(e.target.tagName) && e.key === ' ') return;
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (document.querySelector('.sheet-scrim')) return;
      const cur = active;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        const n = Math.min(sections.length, cur + 1);
        if (n < sections.length) scrollToEl(secEls.current[n]); else scrollToEl(document.querySelector('.unit-end'));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        const p = cur - 1;
        if (p >= 0) scrollToEl(secEls.current[p]); else scrollTop(false);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [active, sections.length]);

  const stepKey = active >= 0 ? sections[active].step : null;
  const onStep = (key) => scrollToEl(secEls.current[sections.findIndex(s => s.step === key)]);
  const startHere = () => scrollToEl(secEls.current[0]);

  return (
    <div className="app unit-page" ref={root}>
      <AppBar unit={unit} stepKey={stepKey} onStep={onStep} go={go} />
      <main>
        <UnitHero unit={unit} onStart={startHere} />
        <blockquote className="manifesto"><span dangerouslySetInnerHTML={{ __html: unit.manifesto.en }} />{bangla && <span className="bn" lang="bn">{unit.manifesto.bn}</span>}</blockquote>
        <nav className="step-nav rv" aria-label="Steps">
          {unit.steps.map((s, i) => {
            const I = STEP_ICON[STEPS[s.key].icon];
            return (
              <button key={s.key} className={`sn-cell ${stepKey === s.key ? 'on' : ''}`} onClick={() => onStep(s.key)}>
                <b>0{i + 1}</b><span className="sn-t"><I /> <T en={STEPS[s.key].en} bn={STEPS[s.key].bn} block={false} /></span>
                <span className="sn-s">{s.sections.map(x => x.title.en).join(' · ')}</span>
              </button>
            );
          })}
        </nav>
        {sections.map((sc, i) => {
          const Body = BODY[sc.type];
          const I = STEP_ICON[STEPS[sc.step].icon];
          return (
            <React.Fragment key={sc.id}>
              {sc.firstOfStep && (
                <div className={`step-divider s-${sc.step} rv`}>
                  <span className="sd-n">0{sc.stepN}</span>
                  <span className="sd-t"><I /> <T en={STEPS[sc.step].en} bn={STEPS[sc.step].bn} block={false} /></span>
                  <span className="sd-v"><T en={STEPS[sc.step].verb.en} bn={STEPS[sc.step].verb.bn} block={false} /></span>
                </div>
              )}
              <section className={`lesson t-${sc.type} ${active === i ? 'is-active' : ''}`} data-idx={i} id={`s-${sc.id}`} ref={el => (secEls.current[i] = el)}>
                <div className="lesson-heading rv">
                  <div>
                    <div className="section-number">{String(i + 1).padStart(2, '0')} · {STEPS[sc.step].en.toUpperCase()}</div>
                    <T en={sc.title.en} bn={sc.title.bn} as="h2" />
                  </div>
                  {sc.cue && <T en={sc.cue.en} bn={sc.cue.bn} as="p" className="lesson-cue" />}
                </div>
                <div className="lesson-body rv">
                  {Body ? <Body scene={sc} unit={unit} /> : <p>Unknown section {sc.type}</p>}
                </div>
              </section>
            </React.Fragment>
          );
        })}
        <UnitEnd unit={unit} next={next} go={go} />
      </main>
    </div>
  );
}

function UnitHero({ unit, onStart }) {
  const playing = usePlayingId(unit.heroClip);
  const { bangla } = useSettings();
  const music = unit.group === 'music';
  const c = useClip(unit.heroClip);
  const accent = unit.heroVisual === 'accent';
  const play = () => (playing ? engine.stop()
    : accent ? engine.sequence([{ id: unit.heroClip, voice: 'alice' }, { id: unit.heroClip, voice: 'brian' }], 0.5)
      : engine.play(unit.heroClip));
  return (
    <section className="unit-hero">
      <div className="uh-copy">
        <p className="eyebrow">{UI.unit.en} {unit.n} · {unit.title.en}{bangla && <span className="bn" lang="bn">{unit.title.bn}</span>}</p>
        <SplitText as="h1" className="uh-title" text={unit.hero.en} by="words" stagger={0.07} />
        {bangla && <p className="bn uh-bn" lang="bn">{unit.hero.bn}</p>}
        <T en={unit.intro.en} bn={unit.intro.bn} as="p" className="intro" />
        <div className="uh-actions">
          <button className={`btn primary big ${playing ? 'is-playing' : ''}`} onClick={play}>{playing ? <IPause /> : <IPlay />} {accent ? <T en="Hear two correct answers" bn="দুটো সঠিক উত্তর শুনুন" block={false} /> : c && c.words.length <= 3 ? <>Hear “{c.words.map(w => w.w).join(' ')}”</> : <T en="Hear the example" bn="উদাহরণটা শুনুন" block={false} />}</button>
          <button className="btn big ghost-ink" onClick={onStart}><T en="Start" bn="শুরু" block={false} /> ↓</button>
        </div>
      </div>
      <div className="uh-visual stage-card">
        <div className="sc-top"><span>{unit.tag.en.toUpperCase()}</span><span className={`status ${playing ? 'on' : ''}`}>{playing ? 'Playing' : 'Ready'}</span></div>
        {accent ? <A.AccentHeroVisual unit={unit} />
          : music
            ? <VoiceLine id={unit.heroClip} size="md" labels="auto" stack="auto" />
            : <MouthDiagram ids={[unit.heroClip]} muscles={unit.id === 'vowels'} />}
        <p className="sc-foot">{accent ? '“Should I sound British or American?” Either — as long as it is clear.' : music ? 'Tap the picture to hear it. Watch the ball ride the beats.' : `Tap Hear: the mouth moves with the recording, sound by sound.`}</p>
      </div>
    </section>
  );
}

function UnitEnd({ unit, next, go }) {
  return (
    <section className="unit-end">
      <div className="finish rv">
        <div className="finish-mark"><UnitGlyph unit={unit} size={170} live /></div>
        <div className="finish-copy">
          <p className="section-number">{UI.done.en.toUpperCase()} · {UI.unit.en.toUpperCase()} {unit.n}</p>
          <T en={unit.takeaway.en} bn={unit.takeaway.bn} as="h2" />
          <button className="btn" onClick={() => go('#/units')}>{UI.allUnits.en}</button>
        </div>
      </div>
      {next && (
        <button className="next-unit rv" onClick={() => { engine.stop(); go(`#/u/${next.id}/0`); }}>
          <span className="nu-k">{UI.upNext.en.toUpperCase()} · {UI.unit.en.toUpperCase()} {next.n}</span>
          <span className="nu-t">{next.hero.en}</span>
          <span className="nu-s">{next.title.en} — {next.tag.en}</span>
          <span className="nu-go"><IArrowR /></span>
          <span className="nu-glyph"><UnitGlyph unit={next} size={140} live /></span>
        </button>
      )}
    </section>
  );
}
