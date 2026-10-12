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

// The voice a clip's pictures are drawn in; re-renders when it changes (voice switch,
// or the clip speaking in another voice). Use the result as a memo dependency.
export function useVoiceKey(ids) {
  const list = Array.isArray(ids) ? ids : [ids];
  const key = list.join('|');
  const get = () => list.map(i => engine.voiceOf(i)).join(',');
  const [k, setK] = useState(get);
  useEffect(() => {
    setK(get());
    return engine.onVoice(changed => {
      if (changed && !changed.some(i => list.includes(i))) return;
      setK(get());
    });
  }, [key]);
  return k;
}

// The clip's measurements in the voice its pictures show now.
export function useClip(id) {
  useVoiceKey(id);
  return engine.data(id);
}

// The chosen voice, and a setter.
export function useVoice() {
  const [v, setV] = useState(engine.voice);
  useEffect(() => engine.onVoice(changed => { if (!changed) setV(engine.voice); }), []);
  return [v, (x) => engine.setVoice(x)];
}

// Which voice is speaking clip `id` right now (or null).
export function usePlayingVoice(id) {
  const [v, setV] = useState(null);
  useEffect(() => engine.subscribe(s => {
    const next = s.playing && s.id === id ? s.voice : null;
    setV(prev => (prev === next ? prev : next));
  }), [id]);
  return v;
}
