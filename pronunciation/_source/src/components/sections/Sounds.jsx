// Listening sections for the sound units: pairs with the mouth, the "er" sound,
// open/closed syllables, ভ vs v, clusters, TH.
import React, { useEffect, useState } from 'react';
import MouthDiagram from '../mouth/MouthDiagram';
import { focusShape } from '../mouth/visemes';
import VoiceLine from '../VoiceLine';
import SignalStrip from '../visuals/SignalStrip';
import LengthBars from '../visuals/LengthBars';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import PuffMeter from '../visuals/PuffMeter';
import engine, { clip as getClip } from '../../lib/audio';
import { usePlayingId, useClipFrame } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, Note, L1Note, Feel, Beats, labelOf, TabBar, NarrowSwitch, SwipeHint } from '../Bits';
import { IPlay, IPause, IArrowR } from '../Icons';
import { UI, TILES } from '../../content/units';

export const LBL = {
  'long ee': { en: 'long ee · tense', bn: 'লম্বা ঈ · টানটান' }, 'short i': { en: 'short i · relaxed', bn: 'ছোট ই · ঢিলেঢালা' },
  'long oo': { en: 'long oo · tense', bn: 'লম্বা ঊ · টানটান' }, 'short u': { en: 'short u · relaxed', bn: 'ছোট উ · ঢিলেঢালা' },
  air: { en: 'air only', bn: 'শুধু বাতাস' }, 'air + buzz': { en: 'air + buzz', bn: 'বাতাস + গুঞ্জন' },
  short: { en: 'short vowel', bn: 'ছোট স্বর' }, longer: { en: 'longer vowel', bn: 'লম্বা স্বর' },
  pop: { en: 'pop', bn: 'ফট' }, hiss: { en: 'hiss', bn: 'হিস্‌' }, round: { en: 'round', bn: 'গোল' }, press: { en: 'press', bn: 'চাপা' },
  flow: { en: 'flow', bn: 'একটানা' }, 'stop + release': { en: 'stop + release', bn: 'থেমে ছাড়া' },
  puff: { en: 'puff', bn: 'ঝাপটা' }, 'no puff': { en: 'no puff', bn: 'ঝাপটা নেই' },
  English: { en: 'English', bn: 'ইংরেজি' }, 'extra vowel': { en: 'extra vowel', bn: 'বাড়তি স্বর' },
  th: { en: 'th', bn: 'th' }, s: { en: 's', bn: 's' }, t: { en: 't', bn: 't' },
};
const lbl = (k) => LBL[k] || { en: k, bn: k };
const TENSE = { 'long ee': 1, 'long oo': 1 };

// the clip that is playing now, or the last one that played
function useLastPlayed(ids, first) {
  const [last, setLast] = useState(first);
  useEffect(() => engine.subscribe(s => { if (s.playing && ids.includes(s.id)) setLast(p => (p === s.id ? p : s.id)); }), [ids.join('|')]);
  return last;
}

// ---------------------------------------------------------------- pairs
// One pair at a time: tabs to pick the pair, then the two words, their picture and the
// mouth (front and side, side by side) all on one screen, so the mouth moves right
// next to the word being spoken. No scrolling between a word and its mouth.
export function PairsSection({ scene }) {
  const v = scene.visual;
  const [k, setK] = useState(0);
  const all = scene.pairs.flatMap(p => [p.a, p.b]);
  // one scale for every pair, so switching pairs compares like with like
  const shared = Math.max(...all.map(id => { const c = getClip(id); return c.off - c.on + 0.1; }));
  const tspan = v === 'tiles' ? tilesSpan(all) : 0;
  const vmax = Math.max(...all.map(id => { const c = getClip(id); const s = c.vowel || [0, 0.3]; return s[1] - s[0]; }));
  const go = (i) => { engine.stop(); setK((i + scene.pairs.length) % scene.pairs.length); };
  const many = scene.pairs.length > 1;
  return (
    <>
      {scene.feel && <Feel text={scene.feel} icon={v === 'puff' ? 'hand' : 'throat'} />}
      <div className="pair-stage">
        {many && (
          <div className="ps-tabs" role="tablist" aria-label="Pairs">
            {scene.pairs.map((q, i) => (
              <button key={i} role="tab" aria-selected={i === k} className={`ps-tab ${i === k ? 'on' : ''}`} onClick={() => go(i)}>
                {labelOf(q.a)}<i>/</i>{labelOf(q.b)}
              </button>
            ))}
            <button className="ps-next" onClick={() => go(k + 1)} aria-label="Next pair">Next pair <IArrowR /></button>
          </div>
        )}
        <PairStage key={k} p={scene.pairs[k]} v={v} shared={shared} tspan={tspan} vmax={vmax} />
      </div>
      <Note text={scene.note} />
      <L1Note text={scene.l1} />
    </>
  );
}

function PairStage({ p, v, shared, tspan, vmax }) {
  const ids = [p.a, p.b];
  const last = useLastPlayed(ids, ids[0]);
  const withMouth = v !== 'tiles' && v !== 'endvowel';
  const poseOf = (id) => (p.pose ? p.pose[id === p.a ? 0 : 1] : focusShape((getClip(id) || {}).ph));
  const lab = last === p.b ? p.lb : p.la;
  const status = lbl(lab);
  return (
    <div className={`ps-main ${withMouth ? 'with-mouth' : ''}`}>
      {withMouth && (
        <div className="ps-mouth">
          <MouthDiagram ids={ids} pose={poseOf(last)} poseFor={poseOf} muscles={v === 'vowel'} />
          <div className={`mouth-status ${v === 'vowel' ? (TENSE[lab] ? 'tense' : 'relaxed') : ''}`}>
            <b>{labelOf(last)}</b> <T en={status.en} bn={status.bn} block={false} />
            {v === 'puff' && <PuffMeter ids={ids} size={96} />}
          </div>
        </div>
      )}
      <div className="ps-stack"><PairCard p={p} v={v} shared={shared} tspan={tspan} vmax={vmax} /></div>
    </div>
  );
}

function PairCard({ p, v, shared, tspan, vmax }) {
  const ids = [p.a, p.b];
  const playing = usePlayingId(ids);
  return (
    <div className={`pair-card ${playing ? 'is-playing' : ''}`}>
      <div className="pc-words">
        {ids.map((id, k) => (
          <button key={id} className={`word-tile k${k} ${playing === id ? 'is-on' : ''}`} onClick={() => (playing === id ? engine.stop() : engine.play(id))}>
            <span className="wt-word">{labelOf(id)}</span>
            <span className="wt-meta">{playing === id ? <IPause /> : <IPlay />} <T en={lbl(k ? p.lb : p.la).en} bn={lbl(k ? p.lb : p.la).bn} block={false} /></span>
          </button>
        ))}
      </div>
      {(v === 'vowel' || v === 'endvowel') && <LengthBars ids={ids} kinds={v === 'vowel' ? ['long', 'short'] : ['short', 'long']} max={vmax} />}
      {(v === 'airvoice' || v === 'puff' || v === 'endvowel' || v === 'th') && (
        <div className="pc-strips">
          {ids.map(id => <div key={id} className="pc-strip"><span className="ps-w">{labelOf(id)}</span><SignalStrip id={id} span={shared} /></div>)}
        </div>
      )}
      {v === 'tiles' && <div className="pc-tiles">{ids.map(id => <div key={id} className="pc-strip"><span className="ps-w">{labelOf(id)}</span><Tiles id={id} span={tspan} snap /></div>)}</div>}
      <div className="pc-foot"><ClipButton ids={ids} variant="pill" label={UI.both.en} /></div>
    </div>
  );
}

// ---------------------------------------------------------------- the "er" sound
export function ErSection({ scene }) {
  const all = [...scene.same, scene.vs.b];
  const last = useLastPlayed(all, scene.same[0]);
  const er = (w) => {
    const m = w.match(/(ear|er|ar)/);
    if (!m) return w;
    const i = m.index;
    return <>{w.slice(0, i)}<span className="er-hi">{m[0]}</span>{w.slice(i + m[0].length)}</>;
  };
  return (
    <div className="ps-main with-mouth">
      <div className="ps-mouth">
        <MouthDiagram ids={all} pose={last === scene.vs.b ? 'ah' : 'er'} poseFor={(id) => (id === scene.vs.b ? 'ah' : 'er')} />
        <div className="mouth-status"><b>{labelOf(last)}</b> {last === scene.vs.b ? <T en="open “ar”: jaw down" bn="খোলা “ar”: চোয়াল নিচে" block={false} /> : <T en="“er”: tongue bunched in the middle" bn="“er”: জিভ মাঝখানে গুটানো" block={false} />}</div>
      </div>
      <div className="ps-stack">
        <div className="pair-card">
          <T en="Same sound in all three" bn="তিনটিতেই একই ধ্বনি" className="kick coral" />
          <div className="er-words">
            {scene.same.map(id => (
              <button key={id} className="word-tile k0" onClick={() => engine.play(id)}>
                <span className="wt-word">{er(labelOf(id))}</span>
                <span className="wt-meta"><IPlay /> er</span>
              </button>
            ))}
          </div>
          <div className="pc-foot"><ClipButton ids={scene.same} variant="pill" label="Hear all three" /></div>
        </div>
        <div className="pair-card">
          <T en={scene.vsCue.en} bn={scene.vsCue.bn} className="kick coral" />
          <div className="pc-words">
            {[scene.vs.a, scene.vs.b].map((id, k) => (
              <button key={id} className={`word-tile k${k}`} onClick={() => engine.play(id)}>
                <span className="wt-word">{er(labelOf(id))}</span>
                <span className="wt-meta"><IPlay /> {k ? 'ar — open' : 'er — middle'}</span>
              </button>
            ))}
          </div>
          <div className="pc-foot"><ClipButton ids={[scene.vs.a, scene.vs.b]} variant="pill" label={UI.both.en} /></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- open / closed
export function DoorsSection({ scene }) {
  // three ideas, one at a time: the rule, the double-letter twin, the desert/dessert question
  const parts = ['Open or closed?', scene.twin.open.show.replace('·', '') + ' / ' + scene.twin.closed.show.replace('·', '')];
  if (scene.ask) parts.push('desert / dessert');
  const [k, setK] = useState(0);
  return (
    <>
      <TabBar items={parts} k={k} onPick={setK} label="Parts" next="Next" />
      {k === 0 && <div className="board cols-2 doors-board">
        {[['open', scene.open], ['closed', scene.closed]].map(([k, list]) => (
          <div key={k} className={`board-cell door-col ${k}`}>
            <span className="kick">{k === 'open' ? 'OPEN · ENDS IN A VOWEL' : 'CLOSED · ENDS IN A CONSONANT'}</span>
            <T en={k === 'open' ? 'The vowel stays open — long' : 'The consonant closes it — short'} bn={k === 'open' ? 'স্বর খোলা থাকে — লম্বা' : 'ব্যঞ্জন বন্ধ করে — ছোট'} as="h3" />
            <div className="door-list">
              {list.map(it => <DoorRow key={it.clip} it={it} />)}
            </div>
          </div>
        ))}
      </div>}
      {k === 1 && <><div className="twin">
        {[['open', scene.twin.open], ['closed', scene.twin.closed]].map(([k, it]) => {
          const [a, b] = it.show.split('·');
          return (
            <div key={k} className={`twin-cell ${k}`}>
              <span className="kick">{k === 'open' ? 'ONE P · OPEN' : 'DOUBLE P · CLOSED'}</span>
              <button className="twin-word" onClick={() => engine.play(it.clip)}>
                {k === 'open' ? <>{a}<i className="twin-dot">·</i>{b}</> : <>{a.slice(0, -1)}<span className="coral">{a.slice(-1)}</span><i className="twin-dot">·</i>{b}</>}
              </button>
              <ClipButton ids={it.clip} variant="pill" label={`Hear ${it.show.replace('·', '')}`} />
            </div>
          );
        })}
      </div>
      <Note text={scene.note} /></>}
      {k === 2 && scene.ask && <AskCard ask={scene.ask} />}
    </>
  );
}
function DoorRow({ it }) {
  const playing = usePlayingId(it.clip);
  return (
    <button className={`door-row ${playing ? 'is-playing' : ''}`} onClick={() => (playing ? engine.stop() : engine.play(it.clip))}>
      <span className="dr-word">{it.show}</span>
      <span className="dr-why">{it.why}</span>
      <span className="dr-play">{playing ? <IPause /> : <IPlay />}</span>
    </button>
  );
}

function AskCard({ ask }) {
  const has = (x) => !!getClip(x.clip);
  return (
    <div className="ask-card">
      <div className="ask-head">
        <span className="ask-q" aria-hidden="true">?</span>
        <T en={ask.title.en} bn={ask.title.bn} as="h3" />
      </div>
      <div className="ask-pair">
        {[ask.a, ask.b].map((x, k) => (
          <div key={x.word} className={`ask-cell k${k}`}>
            {k === 0 ? <DesertIcon /> : <DessertIcon />}
            <Beats parts={x.parts} className="big" />
            <span className="ask-word">{x.word}</span>
            <T en={x.mean.en} bn={x.mean.bn} className="muted" />
            {has(x) && <ClipButton ids={x.clip} variant="small" label={x.word} />}
          </div>
        ))}
      </div>
      <T en={ask.body.en} bn={ask.body.bn} as="p" />
      <T en={ask.trick.en} bn={ask.trick.bn} as="p" className="ask-trick" />
      {!has(ask.a) && <T en="Say both aloud: DES-ert… des-SERT. Feel the beat move." bn="দুটোই জোরে বলুন: DES-ert… des-SERT। তালটা সরে যাওয়া অনুভব করুন।" as="p" className="muted" />}
    </div>
  );
}
const DesertIcon = () => (
  <svg viewBox="0 0 80 56" className="ask-ico" aria-hidden="true"><circle cx="58" cy="16" r="9" className="i-sun" /><path d="M2 48Q22 26 42 44T78 40V54H2Z" className="i-sand" /><path d="M20 38v-14m0 6h-5v-5m5 9h5v-6" className="i-cactus" /></svg>
);
const DessertIcon = () => (
  <svg viewBox="0 0 80 56" className="ask-ico" aria-hidden="true"><path d="M14 30h52l-6 22H20Z" className="i-cup" /><path d="M14 30q4-14 26-16 22 2 26 16" className="i-cream" /><circle cx="40" cy="11" r="5" className="i-cherry" /></svg>
);

// ---------------------------------------------------------------- ভ is not v
export function BhvSection({ scene }) {
  const [pick, setPick] = useState(0);
  return (
    <>
    <NarrowSwitch items={[<span lang="bn" key="b">ভ</span>, 'v']} k={pick} onPick={setPick} label="Compare" />
    <div className={`board cols-2 shadow-coral pick-${pick}`}>
      <div className="board-cell bhv-cell nz-0">
        <span className="bhv-sym" lang="bn">ভ</span>
        <MouthDiagram pose="pb" views={['front', 'side']} small />
        <T en="Lips close… then open with a breath." bn="ঠোঁট বন্ধ… তারপর নিঃশ্বাসসহ খোলে।" as="p" />
      </div>
      <div className="board-cell bhv-cell nz-1">
        <span className="bhv-sym">v</span>
        <MouthDiagram ids={[scene.clip]} pose="fv" poseFor={() => 'fv'} views={['front', 'side']} small />
        <T en="Top teeth on the bottom lip. Lips never close. Keep buzzing." bn="উপরের দাঁত নিচের ঠোঁটে। ঠোঁট কখনো বন্ধ হয় না। গুঞ্জন চলতে থাকে।" as="p" />
        <SignalStrip id={scene.clip} />
        <ClipButton ids={scene.clip} variant="pill" label="van" />
      </div>
    </div>
    </>
  );
}

// ---------------------------------------------------------------- clusters
export function ClustersSection({ scene }) {
  return (
    <>
      <div className="board cols-2 cols-4-wide shadow-blue swipe">
        {scene.words.map(w => <ClusterCard key={w.clip} w={w} />)}
      </div>
      <SwipeHint />
      <div className="row-actions"><ClipButton ids={scene.words.map(w => w.clip)} variant="pill" label={UI.playAll.en} /></div>
    </>
  );
}
function ClusterCard({ w }) {
  const playing = usePlayingId(w.clip);
  const tiles = TILES[w.clip] || [];
  const cons = tiles.slice(0, w.c.length);
  const [k, setK] = useState(-1);
  useClipFrame(w.clip, (t, on) => {
    if (!on) { setK(-1); return; }
    let i = -1; cons.forEach((q, j) => { if (t >= q[1]) i = j; });
    setK(p => (p === i ? p : i));
  });
  return (
    <div className={`board-cell cluster-card ${playing ? 'is-playing' : ''}`}>
      <div className="cl-top"><span className="cl-ipa">/{w.c}/</span><span className="kick">{w.c.length === 2 ? 'TWO SOUNDS, ONE START' : 'THREE SOUNDS, ONE START'}</span></div>
      <button className="cl-word" onClick={() => engine.play(w.clip)}>{labelOf(w.clip)}</button>
      <div className="cl-chain" aria-hidden="true">
        {cons.map((q, i) => <React.Fragment key={i}><span className={`cl-dot ${i <= k ? 'on' : ''}`}>{q[0]}</span>{i < cons.length - 1 && <span className={`cl-link ${i < k ? 'on' : ''}`} />}</React.Fragment>)}
      </div>
      <Tiles id={w.clip} snap />
      <ClipButton ids={w.clip} variant="pill" label={`Hear ${labelOf(w.clip)}`} />
    </div>
  );
}

// ---------------------------------------------------------------- TH
export function ThGroupsSection({ scene }) {
  const all = scene.groups.flatMap(g => g.clips);
  const last = useLastPlayed(all, all[0]);
  const voiced = scene.groups[1].clips.includes(last);
  return (
    <div className="ps-main with-mouth">
      <div className="ps-mouth">
        <MouthDiagram ids={all} pose="th" poseFor={() => 'th'} />
        <div className="mouth-status"><b>{labelOf(last)}</b> {voiced ? <T en="air + buzz" bn="বাতাস + গুঞ্জন" block={false} /> : <T en="air only" bn="শুধু বাতাস" block={false} />}</div>
      </div>
      <div className="ps-stack">
        {scene.groups.map((g, i) => (
          <div key={i} className={`pair-card th-card ${i ? 'voiced' : 'air'}`}>
            <div className="th-top"><span className="th-sym">{g.label}</span><T en={g.name.en} bn={g.name.bn} className="kick" /></div>
            <div className="th-words">{g.clips.map(id => <ClipButton key={id} ids={id} variant="chip" label={labelOf(id)} />)}</div>
            <SignalStrip id={last && g.clips.includes(last) ? last : g.clips[0]} />
            <div className="pc-foot"><ClipButton ids={g.clips} variant="pill" label={UI.playAll.en} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
