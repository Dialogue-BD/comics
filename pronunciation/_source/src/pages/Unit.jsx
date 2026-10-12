import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import AppBar from '../components/AppBar';
import engine from '../lib/audio';
import { T, useSettings } from '../lib/settings';
import { Countdown, L1Note } from '../components/Bits';
import { IArrowL, IArrowR, STEP_ICON } from '../components/Icons';
import { UNITS, STEPS, UI } from '../content/units';
import { TapesScene, SuffixScene, MelodyScene, PauseScene } from '../components/scenes/Listen';
import { PairsScene } from '../components/scenes/Pairs';
import { DoorsScene, BhvScene, ClustersScene } from '../components/scenes/Shapes';
import { EchoScene } from '../components/scenes/Echo';
import { IdentifyGame, StressGame, PauseGame, ClusterGame } from '../components/scenes/Games';
import UnitGlyph from '../components/UnitGlyph';
import ClickSpark from '../reactbits/ClickSpark';
import SplitText from '../reactbits/SplitText';

const BODY = {
  tapes: TapesScene, suffix: SuffixScene, melody: MelodyScene, pause: PauseScene,
  pairs: PairsScene, doors: DoorsScene, bhv: BhvScene, clusters: ClustersScene,
  echo: EchoScene, identify: IdentifyGame, stress: StressGame, pausegame: PauseGame, clustergame: ClusterGame,
};

// what plays by itself (after the 3-2-1) when a listening screen opens
function autoIds(sc) {
  if (sc.step !== 'hear') return null;
  if (sc.autoplay) return sc.autoplay;
  if (sc.type === 'melody') return [sc.on, sc.off];
  if (sc.type === 'pause') return [sc.a.clip, sc.b.clip];
  if (sc.type === 'pairs' && sc.pairs) return [sc.pairs[0].a, sc.pairs[0].b];
  if (sc.type === 'pairs' && sc.groups) return sc.groups[0].clips;
  if (sc.type === 'bhv') return [sc.clip];
  if (sc.type === 'clusters') return [sc.words[0].clip];
  return null;
}

export default function Unit({ unitId, idx, go }) {
  const unit = UNITS.find(u => u.id === unitId) || UNITS[0];
  const ui = UNITS.indexOf(unit);
  const scenes = useMemo(() => {
    const list = unit.steps.flatMap(s => s.scenes.map(sc => ({ ...sc, step: s.key })));
    list.push({ type: 'done', id: 'done', step: unit.steps[unit.steps.length - 1].key });
    return list;
  }, [unit]);
  const i = Math.max(0, Math.min(scenes.length - 1, idx));
  const sc = scenes[i];
  const stage = useRef(null);
  const inner = useRef(null);
  const lenis = useRef(null);
  const { bangla, stage: tv } = useSettings();

  const goto = (k) => { engine.stop(); go(`#/u/${unit.id}/${Math.max(0, Math.min(scenes.length - 1, k))}`); };
  const onStep = (key) => goto(scenes.findIndex(s => s.step === key));

  useEffect(() => { engine.preload(unit.preload); }, [unit]);

  // smooth scrolling inside the stage (long scenes on a phone)
  useEffect(() => {
    if (!stage.current) return;
    const l = new Lenis({ wrapper: stage.current, content: inner.current, duration: 1.0, smoothWheel: true });
    lenis.current = l;
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); l.destroy(); };
  }, []);

  // scene change: back to the top, then bring the new scene in
  useLayoutEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
    else if (stage.current) stage.current.scrollTop = 0;
    if (!inner.current) return;
    const head = inner.current.querySelectorAll('.scene-head > *');
    gsap.fromTo(head, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' });
    const kids = inner.current.querySelectorAll('.scene-body .enter');
    gsap.fromTo(kids, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, delay: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' });
  }, [unit.id, i]);

  // keys: → / Space next, ← back
  useEffect(() => {
    const k = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (document.querySelector('.sheet-scrim')) return;
      if (e.key === 'ArrowRight' || (e.key === ' ' && (e.target === document.body || e.target.classList.contains('stage')))) { e.preventDefault(); goto(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goto(i - 1); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [i, unit.id]);

  const Body = BODY[sc.type];
  const stepIdx = unit.steps.findIndex(s => s.key === sc.step);
  const SI = STEP_ICON[STEPS[sc.step].icon];
  const next = UNITS[ui + 1];
  const auto = autoIds(sc);

  return (
    <div className="app unit-view">
      <AppBar unit={unit} stepKey={sc.step} onStep={onStep} go={go} />
      <main className="stage" ref={stage} tabIndex={-1}>
        <div className="stage-inner" ref={inner} key={unit.id + i + (tv ? '-tv' + (bangla ? '-bn' : '') : '')}>
          {sc.type === 'done' ? (
            <DoneScene unit={unit} next={next} go={go} />
          ) : (
            <>
              <header className="scene-head">
                <p className="kicker"><SI /> <span>{STEPS[sc.step].en}</span>{bangla && <span className="bn" lang="bn">{STEPS[sc.step].bn}</span>}<span className="dot">·</span><span className="k-unit">{UI.unit.en} {unit.n} · {unit.title.en}</span></p>
                <T en={sc.title.en} bn={sc.title.bn} as="h1" className="scene-title" />
                {sc.cue && <T en={sc.cue.en} bn={sc.cue.bn} as="p" className="scene-cue" />}
              </header>
              <section className={`scene-body t-${sc.type}`}>
                {Body ? <Body scene={sc} unit={unit} /> : <p>Unknown scene {sc.type}</p>}
              </section>
            </>
          )}
        </div>
      </main>
      {auto && <Countdown ids={auto} sceneKey={unit.id + i} />}
      <footer className="actionbar">
        <button className="icon-btn round" onClick={() => goto(i - 1)} disabled={i === 0} aria-label={UI.back.en}><IArrowL /></button>
        <div className="dashes" aria-label={`${i + 1} of ${scenes.length}`}>
          {scenes.map((s, k) => (
            <button key={k} className={`dash ${k === i ? 'on' : ''} ${k < i ? 'past' : ''} step-${s.step}`} onClick={() => goto(k)} aria-label={`Screen ${k + 1}`} />
          ))}
        </div>
        {i < scenes.length - 1 ? (
          <button className="btn primary next" onClick={() => goto(i + 1)}>
            <T en={UI.next.en} bn={UI.next.bn} block={false} /> <IArrowR />
          </button>
        ) : next ? (
          <button className="btn primary next" onClick={() => { engine.stop(); go(`#/u/${next.id}/0`); }}>
            <T en={UI.nextUnit.en} bn={UI.nextUnit.bn} block={false} /> <IArrowR />
          </button>
        ) : (
          <button className="btn primary next" onClick={() => go('#/')}><T en={UI.allUnits.en} bn={UI.allUnits.bn} block={false} /></button>
        )}
      </footer>
    </div>
  );
}

function DoneScene({ unit, next, go }) {
  const spark = useRef(null);
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => spark.current && spark.current.burst(ref.current), 500);
    return () => clearTimeout(t);
  }, [unit.id]);
  return (
    <ClickSpark ref={spark} className="done">
      <header className="scene-head center">
        <p className="kicker">{UI.done.en} · {UI.unit.en} {unit.n}</p>
      </header>
      <div className="scene-body">
        <div className="done-card card enter" ref={ref}>
          <UnitGlyph unit={unit} size={140} live />
          <SplitText as="h1" className="done-t" text={unit.takeaway.en} by="words" stagger={0.06} />
          <T en="" bn={unit.takeaway.bn} as="p" className="done-bn" />
          <div className="done-actions">
            {next && <button className="btn primary" onClick={() => go(`#/u/${next.id}/0`)}>{UI.nextUnit.en}: {next.title.en} <IArrowR /></button>}
            <button className="btn" onClick={() => go('#/units')}>{UI.allUnits.en}</button>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
