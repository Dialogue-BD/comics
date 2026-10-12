import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const KEY = 'voice-lab-settings';
function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
}
function write(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
}

const Ctx = createContext(null);

export function SettingsProvider({ children }) {
  const saved = read();
  const [bangla, setBangla] = useState(!!saved.bangla);
  const [stage, setStageRaw] = useState(false);       // projector mode is per session
  const stageRef = React.useRef(false);
  // set the theme attribute before React re-renders, so measurements read the new scale
  const setStage = useCallback((v) => {
    const nv = typeof v === 'function' ? v(stageRef.current) : v;
    stageRef.current = nv;
    document.documentElement.setAttribute('data-theme', nv ? 'stage' : 'paper');
    setStageRaw(nv);
  }, []);
  const [autoplay, setAutoplay] = useState(saved.autoplay !== false);

  useEffect(() => { write({ bangla, autoplay }); }, [bangla, autoplay]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', stage ? 'stage' : 'paper');
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', stage ? '#E6E0CB' : '#FAF5E8');
  }, [stage]);
  useEffect(() => {
    document.body.classList.toggle('bangla', bangla);
  }, [bangla]);

  const value = useMemo(() => ({ bangla, setBangla, stage, setStage, autoplay, setAutoplay }),
    [bangla, stage, autoplay, setStage]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);

// Bilingual text: English always; Bangla underneath when the toggle is on.
export function T({ en, bn, as: Tag = 'span', className = '', bnClass = '', block = true, ...rest }) {
  const { bangla } = useSettings();
  if (!bn || !bangla) return <Tag className={className} {...rest}>{en}</Tag>;
  return (
    <Tag className={`${className} has-bn`} {...rest}>
      <span className="en">{en}</span>
      {block ? <span className={`bn ${bnClass}`} lang="bn">{bn}</span> : <> <span className={`bn ${bnClass}`} lang="bn">{bn}</span></>}
    </Tag>
  );
}

// Just the Bangla line (for places where the English is drawn elsewhere).
export function Bn({ children, className = '' }) {
  const { bangla } = useSettings();
  if (!bangla || !children) return null;
  return <span className={`bn ${className}`} lang="bn">{children}</span>;
}

export function useReducedMotion() {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(m.matches);
    m.addEventListener ? m.addEventListener('change', f) : m.addListener(f);
    return () => { m.removeEventListener ? m.removeEventListener('change', f) : m.removeListener(f); };
  }, []);
  return r;
}

export function useWidth(ref) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(es => { for (const e of es) setW(Math.round(e.contentRect.width)); });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export function useAudioState(engine, ids) {
  // { playingId, t } updated every frame while one of `ids` (or any, if null) plays
  const [st, setSt] = useState({ id: null, t: -1 });
  const key = ids ? ids.join('|') : '*';
  useEffect(() => engine.subscribe(s => {
    if (ids && !ids.includes(s.id)) { setSt(p => (p.id ? { id: null, t: -1 } : p)); return; }
    setSt(s.playing ? { id: s.id, t: s.t } : { id: null, t: -1, ended: s.ended, last: s.id });
  }), [key]);
  return st;
}

export const usePlaying = (engine, ids) => {
  const [id, setId] = useState(null);
  const key = ids ? ids.join('|') : '*';
  useEffect(() => engine.subscribe(s => {
    const mine = !ids || ids.includes(s.id);
    setId(prev => {
      const next = s.playing && mine ? s.id : null;
      return prev === next ? prev : next;
    });
  }), [key]);
  return id;
};

export const useToggle = (init = false) => {
  const [v, setV] = useState(init);
  return [v, useCallback(() => setV(x => !x), [])];
};
