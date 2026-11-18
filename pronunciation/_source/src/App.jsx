import React, { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import AmericanTrack from './pages/AmericanTrack';
import { AMERICAN_STOPS } from './content/americanTrack';
import Unit from './pages/Unit';
import PrintSheet from './components/PrintSheet';
import VoiceDock from './components/VoiceDock';
import engine from './lib/audio';
import { startScroll } from './lib/scroll';
import { linkComparisons } from './lib/links';
import { UNITS } from './content/units';

linkComparisons(UNITS);

function parse(h) {
  const american = (h || '').match(/^#\/american(?:\/([\w-]+)(?:\/(\d+))?)?$/);
  if (american) {
    const stop = AMERICAN_STOPS.find(item => item.id === american[1]);
    return stop ? { page: 'american-stop', stop, idx: Number(american[2] || 0) } : { page: 'american' };
  }
  const m = (h || '').match(/^#\/u\/([\w-]+)(?:\/(\d+))?/);
  if (m) return { page: 'unit', unit: m[1], idx: m[2] != null ? +m[2] : 0 };
  if (h === '#/units') return { page: 'landing', focus: 'units' };
  return { page: 'landing' };
}

export default function App() {
  const [route, setRoute] = useState(parse(location.hash));
  const inAmericanTrack = route.page.startsWith('american');
  useEffect(() => {
    if (!inAmericanTrack) return;
    engine.setTrackVoice('brian');
    return () => engine.setTrackVoice(null);
  }, [inAmericanTrack]);

  useEffect(() => {
    startScroll();
    const f = () => {
      engine.stop();
      setRoute(parse(location.hash));
    };
    window.addEventListener('hashchange', f);
    // the first touch anywhere unlocks sound for the session
    const un = () => engine.unlock();
    window.addEventListener('pointerdown', un, { once: true });
    window.addEventListener('keydown', un, { once: true });
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const go = (h) => {
    engine.stop();
    if (location.hash === h) setRoute(parse(h));
    else location.hash = h;
  };
  return (
    <>
      {route.page === 'american' && <AmericanTrack go={go} />}
      {route.page === 'american-stop' && <Unit key={route.stop.id} unitId={route.stop.unit} idx={route.idx} go={go} americanStop={route.stop} />}
      {route.page === 'unit' && <Unit key={route.unit} unitId={route.unit} idx={route.idx} go={go} />}
      {route.page === 'landing' && <Landing key={route.focus || 'home'} go={go} focus={route.focus} />}
      <VoiceDock />
      <PrintSheet />
    </>
  );
}
