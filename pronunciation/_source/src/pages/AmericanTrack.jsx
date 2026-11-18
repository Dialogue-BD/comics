import React, { useLayoutEffect } from 'react';
import AppBar from '../components/AppBar';
import AmericanFlag from '../components/AmericanFlag';
import { IArrowR } from '../components/Icons';
import { AccentHeroVisual } from '../components/sections/Accent';
import { T } from '../lib/settings';
import { scrollTop } from '../lib/scroll';
import { UNITS } from '../content/units';
import { AMERICAN_STOPS, AMERICAN_TRACK_TITLE, americanStopUrl } from '../content/americanTrack';

export default function AmericanTrack({ go }) {
  useLayoutEffect(() => scrollTop(), []);
  const accent = UNITS.find(unit => unit.id === 'accent');
  const start = americanStopUrl(AMERICAN_STOPS[0].id);

  return (
    <div className="app american-track">
      <AppBar go={go} american />
      <main>
        <section className="unit-hero american-hero">
          <div className="uh-copy">
            <p className="eyebrow american-kicker"><AmericanFlag /> Voice Lab · Classroom track</p>
            <T as="h1" className="uh-title" en={AMERICAN_TRACK_TITLE} bn="আমেরিকান ইংরেজি" />
            <T as="p" className="intro"
              en="Practice with Brian’s American English and hear the same words in Alice’s British English. Listen for what changes and what both speakers do alike."
              bn="ব্রায়ানের আমেরিকান ইংরেজির সঙ্গে অনুশীলন করুন এবং একই শব্দ অ্যালিসের ব্রিটিশ ইংরেজিতে শুনুন। কোথায় মিল আর কোথায় পার্থক্য, খেয়াল করুন।" />
            <div className="uh-actions">
              <a className="btn primary big" href={start} onClick={event => { event.preventDefault(); go(start); }}>
                <T en="Start the track" bn="অনুশীলন শুরু করুন" block={false} /> <IArrowR />
              </a>
              <a className="btn big ghost-ink" href="#/" onClick={event => { event.preventDefault(); go('#/'); }}>
                <T en="Voice Lab home" bn="ভয়েস ল্যাবের মূল পাতা" block={false} />
              </a>
            </div>
          </div>
          <div className="uh-visual stage-card">
            <div className="sc-top"><span>SAME WORD · TWO ACCENTS</span></div>
            <AccentHeroVisual unit={accent} americanFirst />
          </div>
        </section>
        <section className="lesson american-outline" aria-labelledby="american-outline-title">
          <div className="lesson-heading">
            <T as="h2" id="american-outline-title" en="Classroom plan" bn="ক্লাসের পরিকল্পনা" />
            <T as="p" className="lesson-cue" en="12 stops across all 11 Voice Lab modules" bn="ভয়েস ল্যাবের ১১টি ইউনিটে ১২টি ধাপ" />
          </div>
          <ol>
            {AMERICAN_STOPS.map(stop => {
              const href = americanStopUrl(stop.id);
              return <li key={stop.id}>
                <a href={href} onClick={event => { event.preventDefault(); go(href); }}>
                  <T en={stop.title} bn={stop.bn} /> <IArrowR />
                </a>
              </li>;
            })}
          </ol>
          <T as="p" className="intro"
            en="Which accent should I practice? If you often speak with Americans or listen to US media, Brian is a useful model. Keep listening to other accents too, and judge your progress by how easily people understand you."
            bn="কোন উচ্চারণ অনুশীলন করব? আমেরিকানদের সঙ্গে প্রায়ই কথা বললে বা মার্কিন মিডিয়া শুনলে ব্রায়ান ভালো মডেল। অন্য উচ্চারণও শুনুন। মানুষ কত সহজে আপনাকে বুঝতে পারে, তা দিয়ে অগ্রগতি মাপুন।" />
        </section>
      </main>
    </div>
  );
}
