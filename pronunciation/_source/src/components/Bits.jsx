import React from 'react';
import engine, { clip as getClip } from '../lib/audio';
import { usePlayingId } from '../lib/hooks';
import { T } from '../lib/settings';
import { IPlay, IPause, IHand, IThroat, IEar } from './Icons';
import { LABEL } from '../content/units';

export const labelOf = (id) => LABEL[id] || (getClip(id) ? getClip(id).words.map(w => w.w).join(' ') : id.split('-').slice(1).join('-'));

// Play one clip, or several in a row.
export function ClipButton({ ids, label, sub, className = '', variant = 'word', children, onPlayed, disabled }) {
  const list = Array.isArray(ids) ? ids : [ids];
  const playing = usePlayingId(list);
  const click = async (e) => {
    e.stopPropagation();
    if (playing) { engine.stop(); return; }
    const r = list.length > 1 ? await engine.sequence(list) : await engine.play(list[0]);
    if (r === 'ended' && onPlayed) onPlayed();
  };
  return (
    <button type="button" data-clip={list.join(' ')} className={`clip-btn v-${variant} ${playing ? 'is-playing' : ''} ${className}`} onClick={click} disabled={disabled}
      aria-label={`${playing ? 'Stop' : 'Play'} ${label || list.map(labelOf).join(', ')}`}>
      <span className="cb-ico">{playing ? <IPause /> : <IPlay />}</span>
      {children || (
        <span className="cb-txt">
          <span className="cb-label">{label || labelOf(list[0])}</span>
          {sub && <span className="cb-sub">{sub}</span>}
        </span>
      )}
    </button>
  );
}

export function L1Note({ text }) {
  if (!text) return null;
  return (
    <aside className="l1-note">
      <span className="l1-tag" aria-hidden="true"><b lang="bn">বাংলা</b><i>↔</i><b>English</b></span>
      <T en={text.en} bn={text.bn} as="p" />
    </aside>
  );
}

export function Feel({ text, icon = 'hand' }) {
  if (!text) return null;
  const I = icon === 'throat' ? IThroat : IHand;
  return (
    <aside className="feel-note">
      <span className="feel-ico" aria-hidden="true"><I /></span>
      <T en={text.en} bn={text.bn} as="p" />
    </aside>
  );
}

export function Note({ text }) {
  if (!text) return null;
  return <T en={text.en} bn={text.bn} as="p" className="rule-note" />;
}

export function EarDisc({ active }) {
  return (
    <div className={`ear-disc ${active ? 'is-on' : ''}`} aria-hidden="true">
      <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
      <span className="ear-core"><IEar /></span>
    </div>
  );
}

// a syllable string with the stressed part big: [['pho',1],['to',0],['GRAPH',2]]
export function Beats({ parts, className = '' }) {
  return (
    <span className={`beats ${className}`}>
      {parts.map(([t, lv], i) => (
        <React.Fragment key={i}>
          <span className={`bt lv${lv}`}>{t}</span>
          {i < parts.length - 1 && <span className="bt-dot" aria-hidden="true">·</span>}
        </React.Fragment>
      ))}
    </span>
  );
}

export const partsOf = (id) => {
  const c = getClip(id);
  if (!c) return [];
  return c.words.flatMap(w => w.syl.map(s => [s.lv === 2 ? s.t.toUpperCase() : s.t, s.lv]));
};
