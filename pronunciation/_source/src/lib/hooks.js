import { useEffect, useRef, useState } from 'react';
import engine from './audio';

// Call fn(t, playing, ended) every frame while clip `id` plays, and once when it stops.
export function useClipFrame(ids, fn) {
  const f = useRef(fn);
  f.current = fn;
  const key = Array.isArray(ids) ? ids.join('|') : ids;
  useEffect(() => engine.subscribe(s => {
    const list = Array.isArray(ids) ? ids : [ids];
    if (!list.includes(s.id)) return;
    f.current(s.t, s.playing, s.ended, s.id);
  }), [key]);
}

// The id currently playing out of `ids` (or null).
export function usePlayingId(ids) {
  const [p, setP] = useState(null);
  const key = Array.isArray(ids) ? ids.join('|') : ids;
  useEffect(() => engine.subscribe(s => {
    const list = Array.isArray(ids) ? ids : [ids];
    const next = s.playing && list.includes(s.id) ? s.id : null;
    setP(prev => (prev === next ? prev : next));
  }), [key]);
  return p;
}

export function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export const frameClass = (clip, t) => {
  if (!clip) return 0;
  for (const [a, b] of clip.voice) if (t >= a && t <= b) return 2;
  for (const [a, b] of clip.air) if (t >= a && t <= b) return 1;
  return 0;
};
