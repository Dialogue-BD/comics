// Minimal pairs, each with the picture that makes its difference visible.
import React from 'react';
import Tape from '../Tape';
import Mouth from '../visuals/Mouth';
import VoiceMeter from '../visuals/VoiceMeter';
import PuffMeter from '../visuals/PuffMeter';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import LengthRace from '../visuals/LengthRace';
import { clip as getClip } from '../../lib/audio';
import { usePlayingId } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, Note, L1Note, Feel, labelOf } from '../Bits';
import { UI } from '../../content/units';

const LBL = {
  'long ee': { en: 'long ee', bn: 'লম্বা ঈ' }, 'short i': { en: 'short i', bn: 'ছোট ই' },
  'long oo': { en: 'long oo', bn: 'লম্বা ঊ' }, 'short u': { en: 'short u', bn: 'ছোট উ' },
  air: { en: 'air', bn: 'বাতাস' }, 'air + buzz': { en: 'air + buzz', bn: 'বাতাস + গুঞ্জন' },
  short: { en: 'short vowel', bn: 'ছোট স্বর' }, longer: { en: 'longer vowel', bn: 'লম্বা স্বর' },
  pop: { en: 'pop', bn: 'ফট' }, hiss: { en: 'hiss', bn: 'হিস্‌' }, round: { en: 'round', bn: 'গোল' }, press: { en: 'press', bn: 'চাপা' },
  flow: { en: 'flow', bn: 'একটানা' }, 'stop + release': { en: 'stop + release', bn: 'থেমে ছাড়া' },
  er: { en: 'er', bn: 'er' }, 'er (middle)': { en: 'er — middle', bn: 'er — মাঝখানে' }, 'ar (open)': { en: 'ar — open', bn: 'ar — খোলা' },
  puff: { en: 'puff', bn: 'ঝাপটা' }, 'no puff': { en: 'no puff', bn: 'ঝাপটা নেই' },
  English: { en: 'English', bn: 'ইংরেজি' }, 'extra vowel': { en: 'extra vowel', bn: 'বাড়তি স্বর' },
  th: { en: 'th', bn: 'th' }, s: { en: 's', bn: 's' }, t: { en: 't', bn: 't' },
};
const lbl = (k) => LBL[k] || { en: k };

export function PairsScene({ scene }) {
  if (scene.single) return <ThGroups scene={scene} />;
  const v = scene.visual;
  const all = scene.pairs.flatMap(p => [p.a, p.b]);
  // one shared scale per scene so widths compare honestly
  let shared = null, vmax = null;
  if (v === 'vowel' || v === 'endvowel') {
    vmax = Math.max(...all.map(id => { const c = getClip(id); return c.vowel ? c.vowel[1] - c.vowel[0] : 0.4; }));
    shared = Math.max(...all.map(id => { const c = getClip(id); return c.off - c.on + 0.2; }));
  } else if (v !== 'tiles') {
    shared = Math.max(...all.map(id => { const c = getClip(id); return c.off - c.on + 0.2; }));
  }
  const tspan = v === 'tiles' ? tilesSpan(all) : 0;
  return (
    <div className={`pairs v-${v} n-${scene.pairs.length}`}>
      {(scene.feel) && <div className="enter"><Feel text={scene.feel} icon={v === 'puff' ? 'hand' : 'throat'} /></div>}
      <div className="pair-grid">
        {scene.pairs.map((p, i) => <PairCard key={i} p={p} v={v} shared={shared} tspan={tspan} vmax={vmax} />)}
      </div>
      <div className="notes enter">
        <Note text={scene.note} />
        <L1Note text={scene.l1} />
      </div>
    </div>
  );
}

function PairCard({ p, v, shared, tspan, vmax }) {
  const ids = [p.a, p.b];
  const playing = usePlayingId(ids);
  return (
    <div className={`pair-card card enter ${playing ? 'is-playing' : ''}`}>
      {(v === 'airvoice') && <VoiceMeter ids={ids} compact />}
      {(v === 'puff') && <div className="pc-puff"><PuffMeter ids={ids} size={150} /></div>}
      <div className="pc-cols">
        {ids.map((id, k) => (
          <div key={id} className={`pc-col ${playing === id ? 'is-on' : ''}`}>
            <div className="pc-top">
              {(v === 'vowel') && <Mouth shape={p.mouth ? p.mouth[k] : 'relaxed'} active={playing === id} size={58} />}
              {(v === 'lips') && <Mouth shape={p.lips ? p.lips[k] : 'relaxed'} active={playing === id} size={58} />}
              <ClipButton ids={id} variant="word" label={labelOf(id)} />
            </div>
            <T en={lbl(k ? p.lb : p.la).en} bn={lbl(k ? p.lb : p.la).bn} className={`pc-lab ${k ? 'b' : 'a'}`} />
            <PairVisual id={id} v={v} shared={shared} tspan={tspan} />
          </div>
        ))}
      </div>
      {(v === 'vowel' || v === 'endvowel') && <LengthRace ids={ids} max={vmax} />}
      <div className="pc-foot"><ClipButton ids={ids} variant="pill" label={UI.both.en} /></div>
    </div>
  );
}

function PairVisual({ id, v, shared, tspan }) {
  const c = getClip(id);
  const h = 104;
  if (v === 'vowel') return null;
  if (v === 'endvowel') return <Tape id={id} height={84} labels="none" pitch={false} beads={false} airVoice span={shared} className="mini" />;
  if (v === 'airvoice' || v === 'lips') return <Tape id={id} height={h} labels="none" pitch={false} beads={false} airVoice span={shared} className="mini" />;
  if (v === 'puff') return <Tape id={id} height={h} labels="none" pitch={false} beads={false} airVoice puff span={shared} className="mini" />;
  if (v === 'tiles') return <div className="tiles-wrap"><Tiles id={id} span={tspan} snap /></div>;
  return <Tape id={id} height={h} labels="none" span={shared} className="mini" />;
}

function ThGroups({ scene }) {
  const all = scene.groups.flatMap(g => g.clips);
  return (
    <div className="th-groups">
      {scene.groups.map((g, i) => (
        <div key={i} className={`th-card card enter ${i ? 'voiced' : 'air'}`}>
          <div className="th-sym">{g.label}</div>
          <T en={g.name.en} bn={g.name.bn} className="th-name" />
          <ThTongue voiced={!!i} ids={g.clips} />
          <div className="th-words">{g.clips.map(id => <ClipButton key={id} ids={id} variant="chip" label={labelOf(id)} />)}</div>
          <ClipButton ids={g.clips} variant="pill" label={UI.playAll.en} />
        </div>
      ))}
      <div className="enter th-meter"><VoiceMeter ids={all} /></div>
      <div className="notes enter"><Note text={scene.note} /><L1Note text={scene.l1} /></div>
    </div>
  );
}

// Side view: tongue tip between the teeth. Voiced = the throat buzzes.
function ThTongue({ voiced, ids }) {
  const on = usePlayingId(ids);
  return (
    <svg className={`th-tongue ${on ? 'is-on' : ''} ${voiced ? 'voiced' : ''}`} viewBox="0 0 160 110" aria-hidden="true">
      <path d="M150 20c-30-8-70-8-96 2-18 7-30 20-34 36" className="tt-palate" />
      <rect x="36" y="40" width="12" height="14" rx="3" className="tt-tooth" />
      <rect x="36" y="64" width="12" height="12" rx="3" className="tt-tooth" />
      <path d="M150 92c-34 6-70 4-92-6-10-4-16-12-26-16 8-6 20-6 30-2 22 6 50 2 88 0" className="tt-tongue" />
      <g className="tt-air"><circle cx="20" cy="60" r="2.5" /><circle cx="10" cy="56" r="2" /><circle cx="6" cy="64" r="1.6" /></g>
      {voiced && <path d="M150 50q4 4 0 8t0 8 0 8" className="tt-buzz" />}
    </svg>
  );
}
