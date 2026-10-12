// doors (open / closed syllables), bhv (ভ is not v), clusters (four smooth starts)
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Tape from '../Tape';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import VoiceMeter from '../visuals/VoiceMeter';
import engine from '../../lib/audio';
import { usePlayingId } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, Note, L1Note } from '../Bits';
import { UI } from '../../content/units';

// A syllable is a little room. Open: the vowel can stretch out of the door.
// Closed: a consonant shuts the door and the vowel stays short.
function Word({ item, kind }) {
  const playing = usePlayingId(item.clip);
  const ref = useRef(null);
  useEffect(() => {
    if (!playing || !ref.current) return;
    const v = ref.current.querySelectorAll('.d-stretch');
    gsap.fromTo(v, { scaleX: 0.2 }, { scaleX: 1, duration: kind === 'open' ? 0.6 : 0.22, ease: 'power2.out', transformOrigin: '0% 50%' });
    const door = ref.current.querySelector('.d-door');
    if (door) gsap.fromTo(door, { rotateY: kind === 'open' ? 0 : -70 }, { rotateY: kind === 'open' ? -70 : 0, duration: 0.5, ease: 'power3.out' });
  }, [playing]);
  const parts = item.show.split('·');
  return (
    <button ref={ref} className={`d-word k-${kind} ${playing ? 'is-playing' : ''}`} onClick={() => engine.play(item.clip)} aria-label={`Play ${item.show.replace('·', '')}`}>
      <span className="d-room">
        <span className="d-txt">{parts[0]}{parts.length > 1 && <span className="d-rest">·{parts.slice(1).join('·')}</span>}</span>
        <span className="d-door" aria-hidden="true" />
      </span>
      <span className="d-stretch" aria-hidden="true" />
    </button>
  );
}

export function DoorsScene({ scene }) {
  return (
    <div className="doors">
      <div className="d-col card enter open">
        <div className="d-head"><span className="d-ico open" aria-hidden="true" /><T en="Open — long vowel" bn="খোলা — লম্বা স্বর" /></div>
        <div className="d-list">{scene.open.map(it => <Word key={it.clip} item={it} kind="open" />)}</div>
      </div>
      <div className="d-col card enter closed">
        <div className="d-head"><span className="d-ico closed" aria-hidden="true" /><T en="Closed — short vowel" bn="বন্ধ — ছোট স্বর" /></div>
        <div className="d-list">{scene.closed.map(it => <Word key={it.clip} item={it} kind="closed" />)}</div>
      </div>
      <div className="d-twin card enter">
        <Word item={scene.twin.open} kind="open" />
        <span className="d-vs">vs</span>
        <Word item={scene.twin.closed} kind="closed" />
        <ClipButton ids={[scene.twin.open.clip, scene.twin.closed.clip]} variant="pill" label={UI.both.en} />
      </div>
      <div className="notes enter"><Note text={scene.note} /></div>
    </div>
  );
}

export function BhvScene({ scene }) {
  const playing = usePlayingId(scene.clip);
  return (
    <div className="bhv">
      <div className="bhv-card card enter">
        <div className="bhv-sym bn-sym" lang="bn">ভ</div>
        <T en="Lips close… then open with a breath" bn="ঠোঁট বন্ধ… তারপর নিঃশ্বাসসহ খোলে" className="bhv-l" />
        <svg viewBox="0 0 200 90" className="bhv-anim bh" aria-hidden="true">
          <rect x="40" y="26" width="120" height="14" rx="7" className="lip top" />
          <rect x="40" y="50" width="120" height="14" rx="7" className="lip bot" />
          <g className="breath"><circle cx="170" cy="45" r="3" /><circle cx="182" cy="40" r="2" /><circle cx="186" cy="52" r="2.4" /></g>
        </svg>
      </div>
      <div className="bhv-neq enter" aria-hidden="true">≠</div>
      <div className={`bhv-card card enter ${playing ? 'is-playing' : ''}`}>
        <div className="bhv-sym">v</div>
        <T en="Top teeth on the bottom lip — keep buzzing" bn="উপরের দাঁত নিচের ঠোঁটে — গুঞ্জন চলতে থাকে" className="bhv-l" />
        <svg viewBox="0 0 200 90" className="bhv-anim v" aria-hidden="true">
          <rect x="70" y="22" width="60" height="16" rx="4" className="teeth" />
          <rect x="40" y="40" width="120" height="16" rx="8" className="lip bot" />
          <path d="M20 70q10-8 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0" className="buzz-l" />
        </svg>
        <ClipButton ids={scene.clip} variant="word" label="van" />
        <Tape id={scene.clip} height={96} labels="none" pitch={false} beads={false} airVoice className="mini" />
        <VoiceMeter ids={[scene.clip]} compact />
      </div>
    </div>
  );
}

export function ClustersScene({ scene }) {
  const span = tilesSpan(scene.words.map(w => w.clip));
  return (
    <div className="clusters">
      {scene.words.map(w => (
        <div key={w.clip} className="cl-row card enter">
          <ClipButton ids={w.clip} variant="word" label={w.clip.replace('clu-', '')} />
          <div className="cl-tiles"><Tiles id={w.clip} span={span} snap /></div>
          <span className="cl-n">{w.n === 2 ? 'sk' : w.clip === 'clu-street' ? 'str' : w.clip === 'clu-splash' ? 'spl' : 'spr'}</span>
        </div>
      ))}
      <div className="row-actions enter"><ClipButton ids={scene.words.map(w => w.clip)} variant="pill" label={UI.playAll.en} /></div>
    </div>
  );
}
