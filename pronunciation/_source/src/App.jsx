import React, { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Unit from './pages/Unit';
import PrintSheet from './components/PrintSheet';
import engine from './lib/audio';
import { useSettings } from './lib/settings';

function parse(h) {
  const m = (h || '').match(/^#\/u\/([\w-]+)\/(\d+)/);
  if (m) return { page: 'unit', unit: m[1], idx: +m[2] };
  if (h === '#/units') return { page: 'landing', focus: 'units' };
  return { page: 'landing' };
}

export default function App() {
  const [route, setRoute] = useState(parse(location.hash));
  const { stage } = useSettings();
  useEffect(() => {
    const f = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', f);
    // the first touch anywhere unlocks sound for the session
    const un = () => engine.unlock();
    window.addEventListener('pointerdown', un, { once: true });
    window.addEventListener('keydown', un, { once: true });
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const go = (h) => {
    if (location.hash === h) setRoute(parse(h));
    else location.hash = h;
    window.scrollTo(0, 0);
  };
  return (
    <>
      {route.page === 'unit'
        ? <Unit key={route.unit} unitId={route.unit} idx={route.idx} go={go} />
        : <Landing key={(route.focus || 'home') + (stage ? '-tv' : '')} go={go} focus={route.focus} />}
      <PrintSheet />
    </>
  );
}
