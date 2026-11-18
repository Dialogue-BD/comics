import React from 'react';
import { BothVoices } from './sections/Accent';
import { labelOf } from './Bits';
import { IPause, IPlay } from './Icons';
import engine from '../lib/audio';
import { usePlayingVoice } from '../lib/hooks';
import { T } from '../lib/settings';

const SPEAKERS = [
  { id: 'brian', label: 'American · Brian' },
  { id: 'alice', label: 'British · Alice' },
];

function ComparisonRow({ id }) {
  const playing = usePlayingVoice(id);
  const sample = labelOf(id);
  return (
    <li className="track-compare-row">
      <strong>{sample}</strong>
      <div className="track-compare-players">
        {SPEAKERS.map(({ id: voice, label }) => {
          const active = playing === voice;
          return (
            <button key={voice} type="button" className={`btn small track-compare-voice ${active ? 'is-playing' : ''}`}
              aria-label={`${active ? 'Stop' : 'Play'} ${sample} · ${label}`}
              onClick={() => active ? engine.stop() : engine.play(id, { voice })}>
              {active ? <IPause /> : <IPlay />} {label}
            </button>
          );
        })}
        <BothVoices id={id} americanFirst label="Play both" />
      </div>
    </li>
  );
}

export default function TrackComparison({ examples, sectionRef }) {
  return (
    <section className="track-compare" ref={sectionRef} aria-labelledby="track-compare-title" tabIndex={-1}>
      <T as="h2" id="track-compare-title" en="Compare American and British English" bn="আমেরিকান ও ব্রিটিশ ইংরেজি তুলনা করুন" />
      <ul>{examples.map(id => <ComparisonRow key={id} id={id} />)}</ul>
    </section>
  );
}
