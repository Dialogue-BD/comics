// Listening scenes: tapes, suffix, melody, pause.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Tape from '../Tape';
import engine, { clip as getClip } from '../../lib/audio';
import { usePlayingId } from '../../lib/hooks';
import { T, useSettings } from '../../lib/settings';
import { ClipButton, Note, L1Note, labelOf } from '../Bits';
import { IPlay, IPause } from '../Icons';
import { UI } from '../../content/units';

const spanOf = (ids, lead = 0.12) => Math.max(...ids.map(id => { const c = getClip(id); return c.off - c.on + lead * 2; }));

const uiNow = () => { const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui')); return isFinite(v) && v > 0 ? v : 1; };

export function TapesScene({ scene }) {
  const shared = scene.shareScale ? spanOf(scene.clips) : null;
  const isSent = getClip(scene.clips[0]).words.length > 1;
  const h = isSent && scene.clips.length > 1 ? 185 : undefined;
  return (
    <div className={`tapes ${isSent ? 'is-sentences' : 'is-words'} n-${scene.clips.length}`}>
      {scene.clips.map(id => (
        <div className="tape-row card enter" key={id}>
          <div className="tr-head">
            <ClipButton ids={id} variant={isSent ? 'sentence' : 'word'} label={isSent ? labelOf(id) : getClip(id).words[0].syl.map(s => s.t).join('·')} />
          </div>
          <Tape id={id} span={shared ? shared : undefined} height={h} />
          {scene.schwa && <SchwaKey id={id} />}
        </div>
      ))}
      {scene.clips.length > 1 && (
        <div className="row-actions enter"><ClipButton ids={scene.clips} variant="pill" label={UI.playAll.en} /></div>
      )}
      <div className="notes enter">
        <Note text={scene.note} />
        <L1Note text={scene.l1} />
      </div>
    </div>
  );
}

function SchwaKey({ id }) {
  const w = getClip(id).words[0];
  return (
    <div className="schwa-key" aria-hidden="true">
      {w.syl.map((s, i) => <span key={i} className={`sk lv${s.lv}`}>{s.lv === 0 ? 'ə' : s.t}</span>)}
    </div>
  );
}

export function SuffixScene({ scene }) {
  const span = spanOf(scene.rows.map(r => r.clip));
  return (
    <div className="suffix">
      {scene.rows.map(r => <SuffixRow key={r.clip} row={r} span={span} />)}
      <div className="notes enter"><Note text={scene.note} /></div>
    </div>
  );
}

function SuffixRow({ row, span }) {
  const c = getClip(row.clip);
  const syl = c.words[0].syl;
  const si = syl.findIndex(s => s.lv === 2);
  const ref = useRef(null);
  const playing = usePlayingId(row.clip);
  useEffect(() => {
    if (!playing || !ref.current) return;
    const arrow = ref.current.querySelector('.hop');
    if (arrow) gsap.fromTo(arrow, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' });
  }, [playing]);
  return (
    <div className={`suffix-row card enter ${playing ? 'is-playing' : ''}`} ref={ref}>
      <div className="sx-end"><span className="sx-tile">{row.end}</span></div>
      <button className="sx-word" onClick={() => engine.play(row.clip)} aria-label={`Play ${c.words[0].w}`}>
        {syl.map((s, i) => (
          <span key={i} className={`sx-s lv${s.lv} ${i === si ? 'beat' : ''} ${i === syl.length - 1 ? 'tail' : ''}`}>
            {s.t}{i === si && <span className="hop" aria-hidden="true">↶</span>}
          </span>
        ))}
      </button>
      <div className="sx-tape"><Tape id={row.clip} span={span} labels="none" height={110} /></div>
    </div>
  );
}

export function MelodyScene({ scene }) {
  const [which, setWhich] = useState('on');
  const playing = usePlayingId([scene.on, scene.off]);
  const play = (w) => { setWhich(w); engine.play(w === 'on' ? scene.on : scene.off); };
  return (
    <div className="melody">
      <div className="melody-switch enter" role="group" aria-label="Melody">
        <button className={`ms ${which === 'on' ? 'sel' : ''} ${playing === scene.on ? 'is-playing' : ''}`} onClick={() => play('on')}>
          {playing === scene.on ? <IPause /> : <IPlay />} <T en="Melody on" bn="সুর আছে" />
        </button>
        <button className={`ms off ${which === 'off' ? 'sel' : ''} ${playing === scene.off ? 'is-playing' : ''}`} onClick={() => play('off')}>
          {playing === scene.off ? <IPause /> : <IPlay />} <T en="Melody off" bn="সুর নেই" />
        </button>
      </div>
      <div className="melody-tapes">
        <div className={`mt card enter ${which === 'on' ? 'front' : ''}`}>
          <span className="mt-tag on"><T en="Melody on" bn="সুর আছে" block={false} /></span>
          <Tape id={scene.on} height={180} />
        </div>
        <div className={`mt card enter ${which === 'off' ? 'front' : ''}`}>
          <span className="mt-tag off"><T en="Melody off" bn="সুর নেই" block={false} /></span>
          <Tape id={scene.off} height={180} />
        </div>
      </div>
      <T en={scene.ask.en} bn={scene.ask.bn} as="p" className="ask enter" />
    </div>
  );
}

export function PauseScene({ scene }) {
  return (
    <div className="pause-scene">
      {[scene.a, scene.b].map((x, i) => (
        <div key={x.clip} className={`ps-card card enter ${i === 0 ? 'good' : 'bad'}`}>
          <Grandma variant={i === 0 ? 'invited' : 'dinner'} />
          <div className="ps-body">
            <ClipButton ids={x.clip} variant="sentence" label={x.text} />
            <Tape id={x.clip} height={150} />
            <T en={x.mean.en} bn={x.mean.bn} as="p" className="ps-mean" />
          </div>
        </div>
      ))}
    </div>
  );
}

// A small original illustration: Grandma at the table, or Grandma on the plate.
function Grandma({ variant }) {
  const dinner = variant === 'dinner';
  return (
    <svg className={`grandma ${variant}`} viewBox="0 0 220 150" aria-hidden="true">
      <rect x="10" y="112" width="200" height="10" rx="5" className="g-table" />
      {dinner ? (
        <>
          <ellipse cx="110" cy="110" rx="70" ry="12" className="g-plate" />
          <g transform="translate(110 84) scale(.82)">
            <circle cx="0" cy="-20" r="18" className="g-skin" />
            <path d="M-17 -28c4-14 30-14 34 0" className="g-hair" />
            <circle cx="0" cy="-42" r="8" className="g-hair-bun" />
            <circle cx="-6" cy="-21" r="2" className="g-eye" /><circle cx="6" cy="-21" r="2" className="g-eye" />
            <ellipse cx="0" cy="-12" rx="4" ry="5" className="g-mouth-o" />
            <path d="M-22 2h44l-6 22h-32z" className="g-dress" />
          </g>
          <path d="M44 60l10 50M40 60v14M48 60v14M44 60v14" className="g-fork" />
          <path d="M178 58c8 0 8 14 0 18v34" className="g-knife" />
        </>
      ) : (
        <>
          <ellipse cx="150" cy="110" rx="34" ry="8" className="g-plate" />
          <path d="M140 102c4-10 16-10 20 0" className="g-food" />
          <g transform="translate(62 70)">
            <circle cx="0" cy="-20" r="18" className="g-skin" />
            <path d="M-17 -28c4-14 30-14 34 0" className="g-hair" />
            <circle cx="0" cy="-42" r="8" className="g-hair-bun" />
            <path d="M-8 -21q2 -3 4 0M4 -21q2 -3 4 0" className="g-eye-smile" />
            <path d="M-6 -12q6 6 12 0" className="g-smile" />
            <path d="M-24 2h48l-4 40h-40z" className="g-dress" />
            <path d="M24 10l24 18" className="g-arm" />
          </g>
          <g transform="translate(150 50)"><text className="g-heart" textAnchor="middle">♥</text></g>
        </>
      )}
    </svg>
  );
}
