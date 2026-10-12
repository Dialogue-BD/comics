import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import AppBar from '../components/AppBar';
import Tape from '../components/Tape';
import UnitGlyph from '../components/UnitGlyph';
import TeacherNotes from '../components/TeacherNotes';
import engine, { clip as getClip } from '../lib/audio';
import { usePlayingId } from '../lib/hooks';
import { T, useSettings } from '../lib/settings';
import { ClipButton } from '../components/Bits';
import { IPlay, IPause, IArrowR, IEar, IMouth, IGame, IBook, IPrint } from '../components/Icons';
import { UNITS, UI } from '../content/units';
import SplitText from '../reactbits/SplitText';
import ScrollReveal from '../reactbits/ScrollReveal';
import AnimatedContent from '../reactbits/AnimatedContent';
import Magnet from '../reactbits/Magnet';
import SpotlightCard from '../reactbits/SpotlightCard';
import Threads from '../reactbits/Threads';

gsap.registerPlugin(ScrollTrigger);

export default function Landing({ go, focus }) {
  const [notes, setNotes] = useState(false);
  const heroPlaying = usePlayingId('pro-sent1');
  const { bangla } = useSettings();

  // smooth page scroll, wired into ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (focus === 'units') setTimeout(() => lenis.scrollTo('#units', { offset: -80, immediate: true }), 50);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, [focus]);

  const heroPlay = () => {
    if (heroPlaying) { engine.stop(); return; }
    engine.play('pro-sent1');
  };

  return (
    <div className="app landing">
      <AppBar go={go} />
      <section className="hero">
        <Threads className="hero-threads" lines={22} lineWidth={5} amplitude={1.1} distance={0.15} color={[0.06, 0.24, 0.13]} />
        <div className="hero-inner">
          <p className="kicker hero-k"><span className="sq" />Pronunciation practice{bangla && <span className="bn" lang="bn">উচ্চারণ অনুশীলন</span>}</p>
          <SplitText as="h1" className="hero-title" text="Voice Lab" stagger={0.06} />
          <p className="hero-tag"><em>See the music of spoken English.</em>{bangla && <span className="bn" lang="bn">কথ্য ইংরেজির সুর চোখে দেখুন।</span>}</p>
          <div className="hero-actions">
            <Magnet strength={0.22}>
              <button className={`btn primary hero-play ${heroPlaying ? 'is-playing' : ''}`} onClick={heroPlay}>
                {heroPlaying ? <IPause /> : <IPlay />} <T en="Hear the music" bn="সুরটা শুনুন" block={false} />
              </button>
            </Magnet>
            <button className="btn hero-start" onClick={() => go(`#/u/${UNITS[0].id}/0`)}>
              <T en="Start Unit 1" bn="ইউনিট ১ শুরু করুন" block={false} /> <IArrowR />
            </button>
          </div>
        </div>
        <div className="hero-tape card">
          <Tape id="pro-sent1" height={250} />
          <div className="hero-legend" aria-hidden="true">
            <span><i className="lg-line" /> <T en="pitch" bn="সুর" block={false} /></span>
            <span><i className="lg-beat" /> <T en="big beat" bn="বড় তাল" block={false} /></span>
            <span><i className="lg-bars" /> <T en="loudness" bn="জোর" block={false} /></span>
            <span><b className="lg-pause">//</b> <T en="pause" bn="বিরতি" block={false} /></span>
          </div>
        </div>
        <button className="scroll-cue" onClick={() => document.getElementById('read').scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll down">
          <span>Scroll</span><span className="sc-line" />
        </button>
      </section>

      <section className="manifesto" aria-label="Why the music matters">
        <ScrollReveal className="mf-line">In Bangla, the listener helps carry the meaning.</ScrollReveal>
        <AnimatedContent distance={20}><T en="" bn="বাংলায় শ্রোতাও অর্থ বুঝে নিতে সাহায্য করেন।" as="p" className="mf-bn" /></AnimatedContent>
        <ScrollReveal className="mf-line strong">In English, the voice has to carry it.</ScrollReveal>
        <AnimatedContent distance={20}><T en="" bn="ইংরেজিতে কণ্ঠকেই অর্থ বহন করতে হয়।" as="p" className="mf-bn" /></AnimatedContent>
        <AnimatedContent distance={30}>
          <T as="p" className="mf-small" en="You learned the grammar. Now hear the tune: which word is strong, where the voice goes up and down, where it breathes." bn="ব্যাকরণ আপনি শিখেছেন। এবার সুরটা শুনুন: কোন শব্দে জোর, কণ্ঠ কোথায় ওঠে-নামে, কোথায় থামে।" />
        </AnimatedContent>
      </section>

      <section className="read" id="read" aria-labelledby="read-h">
        <div className="sec-head">
          <p className="kicker"><span className="sq" />How to read the pictures{bangla && <span className="bn" lang="bn">ছবিগুলো কীভাবে পড়বেন</span>}</p>
          <T en="Every picture is drawn from the voice itself." bn="প্রতিটি ছবি কণ্ঠস্বর থেকেই আঁকা।" as="h2" />
          <T en="Tap a picture to hear it." bn="শুনতে ছবিতে চাপ দিন।" as="p" className="muted" />
        </div>
        <div className="legend-grid">
          <LegendCard sym="↗" t={{ en: 'Height = pitch', bn: 'উচ্চতা = সুর' }} d={{ en: 'The line rises and falls with the voice.', bn: 'কণ্ঠ উঠলে-নামলে রেখাটাও ওঠে-নামে।' }}>
            <Tape id="pro-nopause" height={150} labels="words" beads={false} wave={false} pauses={false} />
          </LegendCard>
          <LegendCard sym="●" t={{ en: 'Size = strength', bn: 'আকার = জোর' }} d={{ en: 'The big gold circle is the big beat. Small circles are weak.', bn: 'বড় সোনালি বৃত্তটি বড় তাল। ছোট বৃত্তগুলো দুর্বল।' }} delay={0.08}>
            <Tape id="dec-photograph" height={150} pitch={false} />
          </LegendCard>
          <LegendCard sym="▬" t={{ en: 'Width = time', bn: 'প্রস্থ = সময়' }} d={{ en: 'A longer bar is a longer sound: team is longer than Tim.', bn: 'বার যত লম্বা, শব্দও তত লম্বা: team, Tim-এর চেয়ে লম্বা।' }} delay={0.16}>
            <div className="lg-pair">
              {['vow-team', 'vow-tim'].map(id => (
                <div key={id} className="lg-pair-row"><span className="lg-w">{id === 'vow-tim' ? 'Tim' : 'team'}</span>
                  <Tape id={id} height={64} labels="none" pitch={false} beads={false} wave={false} vowelBar alignAt={getClip(id).vowel[0]} alignX={0.06} span={0.36} /></div>
              ))}
            </div>
          </LegendCard>
          <LegendCard sym="//" t={{ en: 'Gap = pause', bn: 'ফাঁক = বিরতি' }} d={{ en: 'A short break between two thoughts.', bn: 'দুটি ভাবনার মাঝে ছোট্ট বিরতি।' }} delay={0.24}>
            <Tape id="pro-sent3" height={150} beads={false} />
          </LegendCard>
          <LegendCard sym="∿" t={{ en: 'Wave = buzz · dots = air', bn: 'ঢেউ = গুঞ্জন · বিন্দু = বাতাস' }} d={{ en: 'f is only air. v adds a buzz from your throat.', bn: 'f শুধু বাতাস। v-তে গলা থেকে গুঞ্জন যোগ হয়।' }} delay={0.32} wide>
            <div className="lg-pair">
              {['con-fan', 'con-van'].map(id => (
                <div key={id} className="lg-pair-row"><span className="lg-w">{id.slice(4)}</span>
                  <Tape id={id} height={70} labels="none" pitch={false} beads={false} wave={false} airVoice span={0.8} /></div>
              ))}
            </div>
          </LegendCard>
        </div>
      </section>

      <section className="units" id="units" aria-labelledby="units-h">
        <div className="sec-head">
          <p className="kicker"><span className="sq" />Seven short units{bangla && <span className="bn" lang="bn">সাতটি ছোট ইউনিট</span>}</p>
          <T en="Start with the music. Then the sounds." bn="আগে সুর। তারপর শব্দ।" as="h2" id="units-h" />
          <p className="steps-line"><span><IEar /> Hear</span><span><IMouth /> Say</span><span><IGame /> Play</span><span className="muted"><T en="· about 10 minutes each" bn="· প্রতিটি প্রায় ১০ মিনিট" block={false} /></span></p>
        </div>
        {['music', 'sounds'].map(g => (
          <div key={g} className={`unit-group g-${g}`}>
            <T en={g === 'music' ? 'The music' : 'The sounds'} bn={g === 'music' ? 'সুর' : 'শব্দ'} as="h3" className="ug-h" />
            <div className="unit-grid">
              {UNITS.filter(u => u.group === g).map((u, i) => (
                <AnimatedContent key={u.id} delay={i * 0.06} distance={40}>
                  <UnitCard unit={u} go={go} />
                </AnimatedContent>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="site-foot">
        <div className="sf-actions">
          <button className="btn quiet" onClick={() => setNotes(true)}><IBook /> {UI.forTeacher.en}</button>
          <button className="btn quiet" onClick={() => window.print()}><IPrint /> {UI.print.en}</button>
        </div>
        <p className="muted">Dialogue English &amp; Skills Center · Rajshahi. Every pitch line, beat and timing bar is measured from the recordings.</p>
      </footer>
      {notes && <TeacherNotes onClose={() => setNotes(false)} />}
    </div>
  );
}

function LegendCard({ sym, t, d, children, delay = 0, wide }) {
  return (
    <AnimatedContent delay={delay} distance={50} className={`legend-card card ${wide ? 'wide' : ''}`}>
      <div className="lc-head">
        <span className="lc-sym" aria-hidden="true">{sym}</span>
        <div><T en={t.en} bn={t.bn} as="h3" /><T en={d.en} bn={d.bn} as="p" className="muted" /></div>
      </div>
      <div className="lc-demo">{children}</div>
    </AnimatedContent>
  );
}

function UnitCard({ unit, go }) {
  const [hover, setHover] = useState(false);
  return (
    <SpotlightCard as="a" href={`#/u/${unit.id}/0`} className="unit-card card"
      onClick={(e) => { e.preventDefault(); go(`#/u/${unit.id}/0`); }}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <span className="uc-n">{unit.n}</span>
      <div className="uc-glyph"><UnitGlyph unit={unit} size={150} live={hover} /></div>
      <T en={unit.title.en} bn={unit.title.bn} as="h4" className="uc-t" />
      <T en={unit.tag.en} bn={unit.tag.bn} as="p" className="uc-tag" />
      <span className="uc-go" aria-hidden="true"><IArrowR /></span>
    </SpotlightCard>
  );
}
