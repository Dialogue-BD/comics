// Play: hear it, choose. Every answer reveals the picture of the sound.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Tape from '../Tape';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import VoiceMeter from '../visuals/VoiceMeter';
import LengthRace from '../visuals/LengthRace';
import engine, { clip as getClip } from '../../lib/audio';
import { usePlayingId, shuffle } from '../../lib/hooks';
import { T, useSettings } from '../../lib/settings';
import ClickSpark from '../../reactbits/ClickSpark';
import { ClipButton, EarDisc, labelOf } from '../Bits';
import { IPlay, IReplay, IArrowR, ICheck } from '../Icons';
import { UI } from '../../content/units';

function Score({ results, total, idx }) {
  return (
    <div className="score" aria-label={`${results.filter(Boolean).length} correct`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`sd ${results[i] === true ? 'good' : results[i] === false ? 'miss' : i === idx ? 'cur' : ''}`} />
      ))}
    </div>
  );
}

function Feedback({ ok, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (ok) gsap.fromTo(ref.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    else gsap.fromTo(ref.current, { backgroundColor: 'rgba(176,86,58,.18)' }, { backgroundColor: 'rgba(176,86,58,0)', duration: 0.9 });
  }, [ok, children]);
  return <div ref={ref} className={`fb ${ok ? 'ok' : 'no'}`} role="status">{children}</div>;
}

// ------------------------------------------------------------------ identify
export function IdentifyGame({ scene }) {
  const rounds = useMemo(() => shuffle(scene.pairs).map(p => ({ pair: p, target: p[Math.random() < 0.5 ? 0 : 1] })), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [heard, setHeard] = useState(false);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const r = rounds[idx % rounds.length];
  const playing = usePlayingId(r.target);
  const order = useMemo(() => (Math.random() < 0.5 ? r.pair : [r.pair[1], r.pair[0]]), [idx]);

  const playTarget = async () => { const res = await engine.play(r.target); if (res === 'ended') setHeard(true); };
  const choose = (id, e) => {
    if (pick) return;
    setPick(id);
    const ok = id === r.target;
    setResults(rs => { const n = rs.slice(); n[idx] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); setHeard(false); };
  const done = pick != null;
  const ok = pick === r.target;
  const v = scene.visual;
  const span = Math.max(...r.pair.map(id => { const c = getClip(id); return v === 'vowel' ? (c.vowel ? c.vowel[1] - c.vowel[0] + 0.32 : 0.7) : c.off - c.on + 0.2; }));

  return (
    <ClickSpark ref={spark} className="game identify">
      <div className="g-board card enter">
        <div className="g-left">
          <div className="g-count">{(idx % rounds.length) + 1} / {rounds.length}</div>
          <button className={`g-play ${playing ? 'is-playing' : ''}`} onClick={playTarget} aria-label={UI.playWord.en}>
            <EarDisc active={!!playing} />
            <span className="g-play-l">{playing ? '…' : <><IPlay /> <T en={UI.playWord.en} bn={UI.playWord.bn} block={false} /></>}</span>
          </button>
          <Score results={results} total={rounds.length} idx={idx % rounds.length} />
        </div>
        <div className="g-right">
          <T en="Did you hear…" bn="আপনি কোনটা শুনলেন…" as="p" className="g-q" />
          <div className="g-choices">
            {order.map(id => (
              <button key={id} className={`g-choice ${done && id === r.target ? 'right' : ''} ${done && id === pick && !ok ? 'wrong' : ''}`}
                onClick={(e) => choose(id, e)} disabled={done} aria-label={labelOf(id)}>
                {labelOf(id)}
              </button>
            ))}
          </div>
          {!heard && !done && <T en="Play it first, or just guess." bn="আগে শুনুন, অথবা অনুমান করুন।" as="p" className="g-hint muted" />}
          {done && (
            <Feedback ok={ok}>
              {ok ? <><ICheck /> <T en={`${UI.correct.en} You heard “${labelOf(r.target)}”.`} bn={UI.correct.bn} block={false} /></>
                : <T en={`${UI.notQuite.en} It was “${labelOf(r.target)}”. Listen to both again.`} bn={`${UI.notQuite.bn} শব্দটা ছিল “${labelOf(r.target)}”। দুটোই আবার শুনুন।`} />}
            </Feedback>
          )}
        </div>
      </div>
      {done && (
        <div className="g-reveal enter">
          {v === 'vowel' && <div className="gr-race card"><LengthRace ids={r.pair} /></div>}
          {v !== 'vowel' && r.pair.map(id => (
            <div key={id} className={`gr-col card ${id === r.target ? 'is-target' : ''}`}>
              <ClipButton ids={id} variant="word" label={labelOf(id)} />
              {v === 'vowel'
                ? <Tape id={id} height={100} labels="none" pitch={false} beads={false} vowelBar alignAt={getClip(id).vowel ? getClip(id).vowel[0] : getClip(id).on} alignX={0.16} span={span} className="mini" />
                : <Tape id={id} height={100} labels="none" pitch={false} beads={false} airVoice puff={v === 'puff'} span={span} className="mini" />}
            </div>
          ))}
          <div className="gr-next">{v === 'vowel' && <ClipButton ids={r.pair} variant="pill" label={UI.both.en} />}<button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
        </div>
      )}
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ stress
export function StressGame({ scene }) {
  const items = useMemo(() => shuffle(scene.items), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const id = items[idx % items.length];
  const c = getClip(id);
  const syl = c.words[0].syl;
  const target = syl.findIndex(s => s.lv === 2);
  const choose = (k, e) => {
    if (pick != null) return;
    setPick(k);
    const ok = k === target;
    setResults(rs => { const n = rs.slice(); n[idx] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
    setTimeout(() => engine.play(id), 250);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const done = pick != null;
  return (
    <ClickSpark ref={spark} className="game stress">
      <div className="g-board card enter">
        <div className="sg-top">
          <span className="g-count">{(idx % items.length) + 1} / {items.length}</span>
          <Score results={results} total={items.length} idx={idx % items.length} />
        </div>
        <div className="sg-word" role="group" aria-label="Syllables">
          {syl.map((s, k) => (
            <button key={k} className={`sg-syl ${done && k === target ? 'right' : ''} ${done && k === pick && k !== target ? 'wrong' : ''} ${done ? 'lv' + s.lv : ''}`}
              onClick={(e) => choose(k, e)} disabled={done}>
              {s.t}
              {done && <span className="sg-bead" aria-hidden="true" />}
            </button>
          ))}
        </div>
        {!done && <T en="Say it to yourself first. Where is the big beat?" bn="আগে মনে মনে বলুন। বড় তালটা কোথায়?" as="p" className="g-hint muted" />}
        {done && (
          <>
            <Feedback ok={pick === target}>
              {pick === target ? <><ICheck /> <T en={`${UI.correct.en} ${syl[target].t.toUpperCase()} is the big beat.`} bn={`${UI.correct.bn} বড় তাল ${syl[target].t}-তে।`} block={false} /></>
                : <T en={`${UI.notQuite.en} The big beat is ${syl[target].t.toUpperCase()}.`} bn={`${UI.notQuite.bn} বড় তাল ${syl[target].t}-তে।`} />}
            </Feedback>
            <Tape id={id} height={180} forcePlayed />
            <div className="gr-next">
              <ClipButton ids={id} variant="pill" label={UI.again.en} />
              <button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button>
            </div>
          </>
        )}
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ pause detective
export function PauseGame({ scene }) {
  const [ri, setRi] = useState(0);
  const round = scene.rounds[ri];
  const [sel, setSel] = useState([]);
  const [checked, setChecked] = useState(false);
  const spark = useRef(null);
  useEffect(() => { setSel([]); setChecked(false); }, [ri]);
  const toggle = (g) => { if (checked) return; setSel(s => s.includes(g) ? s.filter(x => x !== g) : [...s, g]); };
  const exact = sel.length === round.gaps.length && round.gaps.every(g => sel.includes(g));
  const check = (e) => { setChecked(true); if (exact && spark.current) spark.current.burst(e.currentTarget); };
  return (
    <ClickSpark ref={spark} className="game pausegame">
      <div className="pg-tabs enter" role="tablist">
        {scene.rounds.map((r, k) => (
          <button key={k} role="tab" aria-selected={k === ri} className={`chip ${k === ri ? 'on' : ''}`} onClick={() => { engine.stop(); setRi(k); }}>{k + 1}</button>
        ))}
      </div>
      <div className="g-board card enter">
        <div className="pg-play"><ClipButton ids={round.clip} variant="pill" label={UI.listen.en} /></div>
        <div className="pg-sentence">
          {round.parts.map((p, k) => (
            <React.Fragment key={k}>
              <span className="pg-part">{p}</span>
              {k < round.parts.length - 1 && (
                <button className={`pg-gap ${sel.includes(k) ? 'sel' : ''} ${checked ? (round.gaps.includes(k) ? (sel.includes(k) ? 'right' : 'missed') : (sel.includes(k) ? 'wrong' : '')) : ''}`}
                  onClick={() => toggle(k)} aria-pressed={sel.includes(k)} aria-label={`Pause after ${p}`}>
                  <span className="bar" />
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        {!checked ? (
          <div className="gr-next"><button className="btn primary" onClick={check}>{UI.check.en}</button></div>
        ) : (
          <>
            <Feedback ok={exact}>
              {exact ? <><ICheck /> <T en={round.gaps.length ? 'Yes — each pause closes one thought.' : 'Yes — no pause, so the words stay together.'} bn={round.gaps.length ? 'ঠিক — প্রতিটি বিরতি একটি ভাবনা শেষ করে।' : 'ঠিক — বিরতি নেই, তাই শব্দগুলো একসাথে থাকে।'} block={false} /></>
                : <T en="Compare with the picture: the // marks where the voice breaks." bn="ছবির সাথে মিলিয়ে দেখুন: // যেখানে কণ্ঠ থামে।" />}
            </Feedback>
            <Tape id={round.clip} height={200} forcePlayed />
            <div className="gr-next">
              <button className="btn" onClick={() => { setSel([]); setChecked(false); }}><IReplay /> {UI.tryAgain.en}</button>
              {ri < scene.rounds.length - 1 && <button className="btn primary" onClick={() => { engine.stop(); setRi(ri + 1); }}>{UI.nextRound.en} <IArrowR /></button>}
            </div>
          </>
        )}
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ cluster game
export function ClusterGame({ scene }) {
  const rounds = useMemo(() => scene.rounds.map(r => ({ ...r, hidden: Math.random() < 0.5 ? 'good' : 'bad' })), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const r = rounds[idx % rounds.length];
  const target = r.hidden === 'good' ? r.good : r.bad;
  const playing = usePlayingId(target);
  const choose = (k, e) => {
    if (pick) return;
    setPick(k);
    const ok = k === r.hidden;
    setResults(rs => { const n = rs.slice(); n[idx] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const span = tilesSpan([r.good, r.bad]);
  return (
    <ClickSpark ref={spark} className="game clustergame">
      <div className="g-board card enter">
        <div className="g-left">
          <div className="g-count">{(idx % rounds.length) + 1} / {rounds.length}</div>
          <button className={`g-play ${playing ? 'is-playing' : ''}`} onClick={() => engine.play(target)} aria-label={UI.playWord.en}>
            <EarDisc active={!!playing} />
            <span className="g-play-l"><IPlay /> {r.word}</span>
          </button>
          <Score results={results} total={rounds.length} idx={idx % rounds.length} />
        </div>
        <div className="g-right">
          <T en={`Is this clear English “${r.word}”?`} bn={`এটা কি পরিষ্কার ইংরেজি “${r.word}”?`} as="p" className="g-q" />
          <div className="g-choices">
            <button className={`g-choice small ${pick && r.hidden === 'good' ? 'right' : ''} ${pick === 'good' && r.hidden !== 'good' ? 'wrong' : ''}`} disabled={!!pick} onClick={(e) => choose('good', e)}>
              <T en="Clear English" bn="পরিষ্কার ইংরেজি" />
            </button>
            <button className={`g-choice small ${pick && r.hidden === 'bad' ? 'right' : ''} ${pick === 'bad' && r.hidden !== 'bad' ? 'wrong' : ''}`} disabled={!!pick} onClick={(e) => choose('bad', e)}>
              <T en="Extra vowel" bn="বাড়তি স্বর" />
            </button>
          </div>
          {pick && (
            <Feedback ok={pick === r.hidden}>
              {pick === r.hidden ? <><ICheck /> <T en={r.hidden === 'good' ? 'Yes — the consonants stayed together.' : 'Yes — you caught the helper vowel.'} bn={r.hidden === 'good' ? 'ঠিক — ব্যঞ্জনগুলো একসাথে ছিল।' : 'ঠিক — আপনি বাড়তি স্বরটা ধরেছেন।'} block={false} /></>
                : <T en={r.hidden === 'good' ? 'That was clear English — no extra vowel.' : 'A helper vowel slipped in. See the extra tile below.'} bn={r.hidden === 'good' ? 'ওটা পরিষ্কার ইংরেজি ছিল — বাড়তি স্বর নেই।' : 'একটা সাহায্যকারী স্বর ঢুকে পড়েছিল। নিচে বাড়তি টাইলটা দেখুন।'} />}
            </Feedback>
          )}
        </div>
      </div>
      {pick && (
        <div className="g-reveal tiles-reveal enter">
          {[r.good, r.bad].map(id => (
            <div key={id} className={`gr-col card ${id === target ? 'is-target' : ''}`}>
              <ClipButton ids={id} variant="word" label={labelOf(id)} />
              <Tiles id={id} span={span} snap />
            </div>
          ))}
          <div className="gr-next"><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
        </div>
      )}
    </ClickSpark>
  );
}
