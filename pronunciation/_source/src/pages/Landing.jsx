import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AppBar from '../components/AppBar';
import VoiceLine from '../components/VoiceLine';
import UnitGlyph from '../components/UnitGlyph';
import TeacherNotes from '../components/TeacherNotes';
import engine from '../lib/audio';
import { usePlayingId } from '../lib/hooks';
import { T, useSettings } from '../lib/settings';
import { scrollToEl, scrollTop, ScrollTrigger } from '../lib/scroll';
import { IPlay, IPause, IArrowR, IEar, IGame, IBook, IPrint } from '../components/Icons';
import { UNITS, UI } from '../content/units';
import SplitText from '../reactbits/SplitText';
import Threads from '../reactbits/Threads';

export default function Landing({ go, focus }) {
  const [notes, setNotes] = useState(false);
  const heroPlaying = usePlayingId('pro-sent1');
  const { bangla } = useSettings();
  const root = useRef(null);

  useEffect(() => {
    if (focus === 'units') setTimeout(() => scrollToEl(document.getElementById('units'), { immediate: true }), 60);
    else scrollTop();
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      ScrollTrigger.batch('.rv', { start: 'top 90%', once: true, onEnter: (b) => gsap.fromTo(b, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: 'power3.out', overwrite: true }) });
    }, root);
    return () => ctx.revert();
  }, [focus]);

  const heroPlay = () => (heroPlaying ? engine.stop() : engine.play('pro-sent1'));

  return (
    <div className="app landing" ref={root}>
      <AppBar go={go} />
      <main>
        <div className="home-hero-wrap">
        {/* flowing lines, like voices: they drift with the pointer */}
        <Threads className="hero-threads" lines={22} lineWidth={5} amplitude={1.1} distance={0.15} color={[0.06, 0.24, 0.13]} />
        <section className="unit-hero home">
          <div className="uh-copy">
            <p className="eyebrow">Pronunciation practice{bangla && <span className="bn" lang="bn">উচ্চারণ অনুশীলন</span>}</p>
            <SplitText as="h1" className="uh-title" text="Listen with your eyes." by="words" stagger={0.08} />
            {bangla && <p className="bn uh-bn" lang="bn">চোখ দিয়ে শুনুন।</p>}
            <T as="p" className="intro" en="See the music of spoken English: which word is strong, where the voice goes up and down, where it breathes — drawn from real recordings." bn="কথ্য ইংরেজির সুর চোখে দেখুন: কোন শব্দে জোর, কণ্ঠ কোথায় ওঠে-নামে, কোথায় থামে — আসল রেকর্ডিং থেকে আঁকা।" />
            <div className="uh-actions">
              <button className={`btn primary big ${heroPlaying ? 'is-playing' : ''}`} onClick={heroPlay}>{heroPlaying ? <IPause /> : <IPlay />} <T en="Hear the music" bn="সুরটা শুনুন" block={false} /></button>
              <button className="btn big ghost-ink" onClick={() => go(`#/u/${UNITS[0].id}/0`)}><T en="Start Unit 1" bn="ইউনিট ১ শুরু করুন" block={false} /> <IArrowR /></button>
            </div>
          </div>
          <div className="uh-visual stage-card">
            <div className="sc-top"><span>ONE SENTENCE · THREE SMALL TUNES</span><span className={`status ${heroPlaying ? 'on' : ''}`}>{heroPlaying ? 'Playing' : 'Ready'}</span></div>
            <VoiceLine id="pro-sent1" size="md" labels="words" stack="always" />
            <p className="sc-foot">Tap it. The line is the melody; the ball bounces on the beats.</p>
          </div>
        </section>
        </div>

        <blockquote className="manifesto">In Bangla, the listener helps carry the meaning. <em>In English, the voice has to carry it.</em>{bangla && <span className="bn" lang="bn">বাংলায় শ্রোতাও অর্থ বুঝে নিতে সাহায্য করেন। ইংরেজিতে কণ্ঠকেই অর্থ বহন করতে হয়।</span>}</blockquote>

        <section className="lesson home-legend">
          <div className="lesson-heading rv">
            <div><div className="section-number">READ THE MUSIC</div><T en="One visual language" bn="একটাই ছবির ভাষা" as="h2" /></div>
            <T en="Every picture is drawn from the voice itself. Tap any picture to hear it." bn="প্রতিটি ছবি কণ্ঠস্বর থেকেই আঁকা। শুনতে যেকোনো ছবিতে চাপ দিন।" as="p" className="lesson-cue" />
          </div>
          <div className="legend rv">
            <div className="legend-item">
              <svg viewBox="0 0 120 44" className="lg-stroke" aria-hidden="true"><path d="M4 34C26 33 30 6 52 12S86 40 116 10" /></svg>
              <T en="The line is the melody" bn="রেখাটাই সুর" as="strong" />
              <T en="Up and down with the voice. Thick on the big beat, thin on the small ones." bn="কণ্ঠের সাথে ওঠা-নামা। বড় তালে মোটা, ছোট তালে সরু।" as="p" />
            </div>
            <div className="legend-item">
              <span className="lg-demo"><span>pho</span><b className="lg-big">TO</b><span>graph</span><span className="lg-ball" /></span>
              <T en="The ball rides the beats" bn="বলটা তালে তালে লাফায়" as="strong" />
              <T en="It never stops: it jumps highest into the big beat." bn="এটা কখনো থামে না: বড় তালে সবচেয়ে উঁচুতে লাফায়।" as="p" />
            </div>
            <div className="legend-item">
              <span className="lg-demo"><i className="lg-small">to the</i><b>market</b><i className="lg-pause">//</i></span>
              <T en="Small words shrink · // = pause" bn="ছোট শব্দ ছোট · // = বিরতি" as="strong" />
              <T en="Grammar words rush between the beats. // is a short breath." bn="ব্যাকরণের শব্দ তালের মাঝে ছুটে যায়। // হলো ছোট্ট নিঃশ্বাস।" as="p" />
            </div>
            <div className="legend-item">
              <span className="lg-demo sig"><i className="lg-air" /><i className="lg-buzz" /></span>
              <T en="Coral = air · blue = buzz" bn="প্রবাল = বাতাস · নীল = গুঞ্জন" as="strong" />
              <T en="f is only air. v adds a buzz from your throat." bn="f শুধু বাতাস। v-তে গলা থেকে গুঞ্জন যোগ হয়।" as="p" />
            </div>
          </div>
        </section>

        <section className="units-sec" id="units" aria-labelledby="units-h">
          <div className="lesson-heading rv">
            <div><div className="section-number">ELEVEN SHORT UNITS</div><T en="Music first. Then the sounds." bn="আগে সুর। তারপর ধ্বনি।" as="h2" id="units-h" /></div>
            <p className="lesson-cue steps-line"><span><IEar /> Hear</span><span><IGame /> Play</span><T en="· about 10 minutes each" bn="· প্রতিটি প্রায় ১০ মিনিট" block={false} /></p>
          </div>
          {[['music', 'The music', 'সুর'], ['sounds', 'The sounds', 'ধ্বনি'], ['accent', 'And your accent', 'আর আপনার উচ্চারণভঙ্গি']].map(([g, en, bn]) => (
            <div key={g} className={`unit-group g-${g}`}>
              <T en={en} bn={bn} as="h3" className="ug-h rv" />
              <div className="unit-grid">
                {UNITS.filter(u => u.group === g).map(u => <UnitCard key={u.id} unit={u} go={go} />)}
              </div>
            </div>
          ))}
        </section>

        <footer className="site-foot">
          <div className="sf-actions">
            <button className="btn" onClick={() => setNotes(true)}><IBook /> {UI.forTeacher.en}</button>
            <button className="btn" onClick={() => window.print()}><IPrint /> {UI.print.en}</button>
          </div>
          <p className="muted">Dialogue English &amp; Skills Center · Rajshahi. Every line, beat and bar is measured from the recordings.</p>
        </footer>
      </main>
      {notes && <TeacherNotes onClose={() => setNotes(false)} />}
    </div>
  );
}

function UnitCard({ unit, go }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={`#/u/${unit.id}/0`} className="unit-card rv" onClick={(e) => { e.preventDefault(); go(`#/u/${unit.id}/0`); }}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <span className="uc-n">{String(unit.n).padStart(2, '0')}</span>
      <div className="uc-glyph"><UnitGlyph unit={unit} size={150} live={hover} /></div>
      <T en={unit.title.en} bn={unit.title.bn} as="h4" className="uc-t" />
      <T en={unit.tag.en} bn={unit.tag.bn} as="p" className="uc-tag" />
      <span className="uc-go" aria-hidden="true"><IArrowR /></span>
    </a>
  );
}
