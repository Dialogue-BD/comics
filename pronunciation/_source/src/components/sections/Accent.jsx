// Accent or pronunciation? Two correct accents side by side (Alice, British; Brian,
// American), then the listener's test: is a difference a shared accent pattern, or a
// clarity problem? Then the four skills that keep any accent clear.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import engine, { VOICES } from '../../lib/audio';
import { usePlayingVoice } from '../../lib/hooks';
import { T, useSettings } from '../../lib/settings';
import ClickSpark from '../../reactbits/ClickSpark';
import { ClipButton, TabBar, SwipeHint } from '../Bits';
import { IPlay, IPause, IArrowR, ICheck } from '../Icons';
import { UNITS, UI } from '../../content/units';

const V = Object.fromEntries(VOICES.map(v => [v.id, v]));

// the spelled word with the letters that change picked out
function Word({ parts, big = false }) {
  return (
    <span className={`ac-word ${big ? 'big' : ''}`}>
      {parts.map(([t, k], i) => <span key={i} className={k ? `k-${k}` : ''}>{t}</span>)}
    </span>
  );
}

function VoiceCard({ id, side, voice }) {
  const speaking = usePlayingVoice(id) === voice;
  const v = V[voice];
  const play = () => (speaking ? engine.stop() : engine.play(id, { voice }));
  return (
    <button type="button" className={`ac-card v-${voice} ${speaking ? 'is-playing' : ''}`} onClick={play} data-clip={id}
      aria-label={`${speaking ? 'Stop' : 'Play'} ${v.name}, ${v.accentLong}`}>
      <span className="ac-who"><span className="ac-av" aria-hidden="true">{v.name[0]}</span>{v.accentLong.toUpperCase()} · {v.name.toUpperCase()}</span>
      <span className="ac-tag">{side.tag.en}</span>
      <Word parts={side.parts} />
      <span className="ac-say">“{side.say}” <i>{side.ipa}</i></span>
      <T en={side.note.en} bn={side.note.bn} as="span" className="ac-note" />
      <span className="ac-play" aria-hidden="true">{speaking ? <IPause /> : <IPlay />}</span>
    </button>
  );
}

// Alice, then Brian, the same word
export function BothVoices({ id, label = 'Alice, then Brian' }) {
  const speaking = usePlayingVoice(id);
  const [on, setOn] = useState(false);
  const click = async () => {
    if (on) { engine.stop(); return; }
    setOn(true);
    await engine.sequence([{ id, voice: 'alice' }, { id, voice: 'brian' }], 0.5);
    setOn(false);
  };
  return (
    <button type="button" className={`clip-btn v-pill ac-hear-both ${on ? 'is-playing' : ''}`} onClick={click} data-clip={id}>
      <span className="cb-ico">{on ? <IPause /> : <IPlay />}</span>
      <span className="cb-txt"><span className="cb-label">{on && speaking ? V[speaking].name : label}</span></span>
    </button>
  );
}

// ------------------------------------------------------------------ hero picture
export function AccentHeroVisual({ unit }) {
  const row = unit.heroRow;
  return (
    <div className="ac-hero">
      <Word parts={row.uk.parts.map(([t]) => [t])} big />
      <div className="ac-hero-pair">
        <VoiceCard id={row.clip} side={row.uk} voice="alice" />
        <span className="ac-both"><ICheck /> both correct</span>
        <VoiceCard id={row.clip} side={row.us} voice="brian" />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ same word, two accents
export function AccentPairsSection({ scene }) {
  // one word at a time: both accents side by side on one screen
  const [k, setK] = useState(0);
  const r = scene.rows[k];
  return (
    <div className="ac-stage">
      <TabBar items={scene.rows.map(x => x.word)} k={k} onPick={setK} label="Words" next="Next word" />
      <div className="ac-row" key={r.clip}>
        <div className="ac-n"><b>{String(k + 1).padStart(2, '0')}</b><span>{r.word}</span>
          <BothVoices id={r.clip} />
        </div>
        <VoiceCard id={r.clip} side={r.uk} voice="alice" />
        <span className="ac-both"><ICheck /> <span>both<br />correct</span></span>
        <VoiceCard id={r.clip} side={r.us} voice="brian" />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ the listener's test
export function AccentGame({ scene }) {
  const rounds = scene.rounds;
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const r = rounds[idx % rounds.length];
  const speaking = usePlayingVoice(r.clip);
  const voice = r.voice || engine.resolve(r.clip);
  const listen = () => (speaking ? engine.stop() : engine.play(r.clip, { voice }));
  const choose = (k, e) => {
    if (pick) return;
    setPick(k);
    const ok = k === r.answer;
    setResults(rs => { const n = rs.slice(); n[idx % rounds.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const done = pick != null, ok = pick === r.answer;
  const CH = [
    { k: 'accent', en: 'Accent', bn: 'উচ্চারণভঙ্গি', sub: 'different, shared, clear', sbn: 'আলাদা, প্রচলিত, স্পষ্ট' },
    { k: 'issue', en: 'Clarity problem', bn: 'স্পষ্টতার সমস্যা', sub: 'the word gets harder to recognise', sbn: 'শব্দটা চেনা কঠিন হয়' },
  ];
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <div className="gb-dark">
          <div className="gb-top"><span>{(idx % rounds.length) + 1} / {rounds.length}</span>
            <div className="score">{rounds.map((_, i) => <span key={i} className={`sd ${results[i] === true ? 'good' : results[i] === false ? 'miss' : i === idx % rounds.length ? 'cur' : ''}`} />)}</div>
          </div>
          <div className={`rings ${speaking ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /><b /></div>
          <button className={`gold-play ${speaking ? 'is-playing' : ''}`} onClick={listen}>
            {speaking ? <IPause /> : <IPlay />} <span>Hear {V[voice].name}</span>
          </button>
          <p className="gb-hint">{V[voice].name} · {V[voice].accentLong} voice</p>
        </div>
        <div className="gb-light">
          <T en="Not “does it sound British?” — can the listener recognise the word?" bn="“ব্রিটিশ শোনায় কি?” নয় — শ্রোতা কি শব্দটা চিনতে পারেন?" className="kick" />
          <h3 className="gb-q">{r.label.en}</h3>
          <T en={r.detail.en} bn={r.detail.bn} as="p" className="ag-detail" />
          <div className="choices two">
            {CH.map(c => (
              <button key={c.k} className={`choice ag-choice ${done && c.k === r.answer ? 'right' : ''} ${done && c.k === pick && !ok ? 'wrong' : ''}`} onClick={(e) => choose(c.k, e)} disabled={done}>
                <T en={c.en} bn={c.bn} as="b" /><T en={c.sub} bn={c.sbn} as="small" />
              </button>
            ))}
          </div>
          {done && (
            <>
              <div className={`fb ${ok ? 'ok' : 'no'}`} role="status">{ok ? <><ICheck /> Exactly. </> : <>{UI.notQuite.en} </>}<T en={r.why.en} bn={r.why.bn} block={false} /></div>
              <div className="gb-next">
                {r.compare && <ClipButton ids={r.compare} voice={voice} variant="pill" label={`Compare: ${r.compareLabel}`} />}
                <button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ what actually matters
export function MattersSection({ scene }) {
  return (
    <>
    <div className="matters swipe">
      {scene.cards.map((c, k) => {
        const u = UNITS.find(x => x.id === c.unit);
        return (
          <article key={k} className="matter rv">
            <span className="mt-n">{String(k + 1).padStart(2, '0')}</span>
            <T en={c.title.en} bn={c.title.bn} as="h3" />
            <div className="mt-ex">
              {c.clips.map((id, i) => (
                <React.Fragment key={id}>
                  {i > 0 && <span className="mt-sep">{c.sep || '≠'}</span>}
                  <ClipButton ids={id} variant="pill" label={c.labels[i]} className={c.bad === i ? 'is-bad' : ''} />
                </React.Fragment>
              ))}
            </div>
            <T en={c.body.en} bn={c.body.bn} as="p" />
            {u && <a className="mt-go" href={`#/u/${u.id}/0`}>Practise: Unit {u.n} · {u.title.en} <IArrowR /></a>}
          </article>
        );
      })}
    </div>
    <SwipeHint />
    </>
  );
}
