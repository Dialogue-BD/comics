// Play: hear it, choose, see why. Every answer reveals the picture of the sound.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import VoiceLine from '../VoiceLine';
import RhythmLane, { isFn } from '../visuals/RhythmLane';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import SignalStrip from '../visuals/SignalStrip';
import LengthBars from '../visuals/LengthBars';
import engine, { clip as getClip } from '../../lib/audio';
import { usePlayingId, shuffle } from '../../lib/hooks';
import { T } from '../../lib/settings';
import ClickSpark from '../../reactbits/ClickSpark';
import { ClipButton, labelOf } from '../Bits';
import { IPlay, IPause, IReplay, IArrowR, ICheck } from '../Icons';
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
    if (ref.current) gsap.fromTo(ref.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }, [ok, children]);
  return <div ref={ref} className={`fb ${ok ? 'ok' : 'no'}`} role="status">{children}</div>;
}

// the dark listening panel on the left of every game
function ListenPanel({ count, total, results, idx, playing, onPlay, label, hint }) {
  return (
    <div className="gb-dark">
      <div className="gb-top"><span>{count} / {total}</span><Score results={results} total={total} idx={idx} /></div>
      <div className={`rings ${playing ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /><b /></div>
      <button className={`gold-play ${playing ? 'is-playing' : ''}`} onClick={onPlay}>
        {playing ? <IPause /> : <IPlay />} <span>{label || UI.playWord.en}</span>
      </button>
      {hint && <p className="gb-hint">{hint}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ which word?
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
  const playTarget = async () => { if (playing) { engine.stop(); return; } const res = await engine.play(r.target); if (res === 'ended') setHeard(true); };
  const choose = (id, e) => {
    if (pick) return;
    setPick(id);
    const ok = id === r.target;
    setResults(rs => { const n = rs.slice(); n[idx % rounds.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); setHeard(false); };
  const done = pick != null, ok = pick === r.target, v = scene.visual;
  const span = Math.max(...r.pair.map(id => { const c = getClip(id); return c.off - c.on + 0.1; }));
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={(idx % rounds.length) + 1} total={rounds.length} results={results} idx={idx % rounds.length} playing={!!playing} onPlay={playTarget} />
        <div className="gb-light">
          <T en="Listen before you look" bn="দেখার আগে শুনুন" className="kick" />
          <h3 className="gb-q">Did you hear <em>{labelOf(r.pair[0])}</em> or <em>{labelOf(r.pair[1])}</em>?</h3>
          <div className="choices two">
            {order.map(id => (
              <button key={id} className={`choice ${done && id === r.target ? 'right' : ''} ${done && id === pick && !ok ? 'wrong' : ''}`} onClick={(e) => choose(id, e)} disabled={done}>
                {labelOf(id)}
              </button>
            ))}
          </div>
          {!heard && !done && <T en="Play it first, or just guess." bn="আগে শুনুন, অথবা অনুমান করুন।" as="p" className="muted" />}
          {done && (
            <>
              <Feedback ok={ok}>{ok ? <><ICheck /> {UI.correct.en} You heard “{labelOf(r.target)}”.</> : <>{UI.notQuite.en} It was “{labelOf(r.target)}”. Listen to both again.</>}</Feedback>
              <div className="reveal">
                {v === 'vowel' && <LengthBars ids={[r.pair[0], r.pair[1]]} />}
                {v !== 'vowel' && r.pair.map(id => <div key={id} className="pc-strip"><span className="ps-w">{labelOf(id)}</span><SignalStrip id={id} span={span} /></div>)}
              </div>
              <div className="gb-next"><ClipButton ids={r.pair} variant="pill" label={UI.both.en} /><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ where is the beat (in a word)?
export function StressGame({ scene }) {
  const items = useMemo(() => shuffle(scene.items), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const id = items[idx % items.length];
  const syl = getClip(id).words[0].syl;
  const target = syl.findIndex(s => s.lv === 2);
  const playing = usePlayingId(id);
  const choose = (k, e) => {
    if (pick != null) return;
    setPick(k);
    const ok = k === target;
    setResults(rs => { const n = rs.slice(); n[idx % items.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
    setTimeout(() => engine.play(id), 250);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const done = pick != null;
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={(idx % items.length) + 1} total={items.length} results={results} idx={idx % items.length} playing={!!playing} onPlay={() => (playing ? engine.stop() : engine.play(id))} label={done ? UI.again.en : 'Check with the voice'} hint="First decode with your eyes. Then use your ear to check." />
        <div className="gb-light">
          <T en="Tap the strong syllable" bn="জোরালো অক্ষরে চাপ দিন" className="kick" />
          <h3 className="gb-word">{getClip(id).words[0].w}</h3>
          <div className="syl-boxes">
            {syl.map((s, k) => (
              <button key={k} className={`syl-box ${done && k === target ? 'right' : ''} ${done && k === pick && k !== target ? 'wrong' : ''} ${done ? 'lv' + s.lv : ''}`} onClick={(e) => choose(k, e)} disabled={done}>{s.t}</button>
            ))}
          </div>
          {!done && <T en="Say it to yourself. Where is the big beat?" bn="মনে মনে বলুন। বড় তালটা কোথায়?" as="p" className="muted" />}
          {done && (
            <>
              <Feedback ok={pick === target}>{pick === target ? <><ICheck /> {UI.correct.en} {syl[target].t.toUpperCase()} is the big beat.</> : <>{UI.notQuite.en} The big beat is {syl[target].t.toUpperCase()}.</>}</Feedback>
              <VoiceLine id={id} size="md" forcePlayed />
              <div className="gb-next"><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ compound or phrase?
export function CompoundGame({ scene }) {
  const order = useMemo(() => shuffle(scene.clips), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const id = order[idx % order.length];
  const kind = id.endsWith('-n') ? 'n' : 'p';
  const playing = usePlayingId(id);
  const words = getClip(id).words.filter(w => w.w !== 'a');
  const choose = (k, e) => {
    if (pick) return;
    setPick(k);
    const ok = k === kind;
    setResults(rs => { const n = rs.slice(); n[idx % order.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const shown = kind === 'n'
    ? <><span className="cw-big">{words[0].syl[0].t.toUpperCase()}</span><span className="cw-small">{words[0].syl.slice(1).map(s => s.t).join('')}</span></>
    : <><span className="cw-small">{words[0].w}</span> <span className="cw-big">{words[1].w.toUpperCase()}</span></>;
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={(idx % order.length) + 1} total={order.length} results={results} idx={idx % order.length} playing={!!playing} onPlay={() => (playing ? engine.stop() : engine.play(id))} label="Play hidden clip" hint="Listen first. The spelling is hidden until you answer." />
        <div className="gb-light">
          <T en="Ear training" bn="কানের অনুশীলন" className="kick" />
          <h3 className="gb-q">Where was the stress?</h3>
          <div className="choices two">
            <button className={`choice cmp ${pick && kind === 'n' ? 'right' : ''} ${pick === 'n' && kind !== 'n' ? 'wrong' : ''}`} onClick={(e) => choose('n', e)} disabled={!!pick}>
              <span className="cmp-word"><span className="cw-big">FIRST</span> + second</span><T en="one thing" bn="একটা জিনিস" className="cmp-mean" />
            </button>
            <button className={`choice cmp ${pick && kind === 'p' ? 'right' : ''} ${pick === 'p' && kind !== 'p' ? 'wrong' : ''}`} onClick={(e) => choose('p', e)} disabled={!!pick}>
              <span className="cmp-word">first + <span className="cw-big">SECOND</span></span><T en="describing" bn="বর্ণনা" className="cmp-mean" />
            </button>
          </div>
          {pick && (
            <>
              <Feedback ok={pick === kind}>{pick === kind ? <><ICheck /> {UI.correct.en}</> : UI.notQuite.en} It was <span className="cmp-word inline">{shown}</span>.</Feedback>
              <VoiceLine id={id} size="md" labels="syllables" forcePlayed />
              <div className="gb-next"><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ make the message visible (big beats)
export function BigBeatGame({ scene }) {
  const [ri, setRi] = useState(0);
  const id = scene.rounds[ri];
  const c = getClip(id);
  const groups = useMemo(() => {
    const g = [];
    c.words.forEach((w, i) => { const k = w.group || 0; (g[k] = g[k] || []).push(i); });
    return g;
  }, [id]);
  const [sel, setSel] = useState({});        // group -> word index
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const playing = usePlayingId(id);
  useEffect(() => { setSel({}); setChecked(false); }, [ri]);
  const tap = (i) => {
    if (checked) return;
    const g = c.words[i].group || 0;
    setSel(s => ({ ...s, [g]: s[g] === i ? undefined : i }));
  };
  const allChosen = groups.every((_, g) => sel[g] != null);
  const check = (e) => {
    setChecked(true);
    const ok = groups.every((ws, g) => c.words[sel[g]] && c.words[sel[g]].tonic);
    setResults(rs => { const n = rs.slice(); n[ri] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
    setTimeout(() => engine.play(id), 300);
  };
  const marks = {};
  c.words.forEach((w, i) => {
    const g = w.group || 0;
    if (!checked) { if (sel[g] === i) marks[i] = 'sel'; }
    else if (w.tonic) marks[i] = sel[g] === i ? 'right' : 'missed';
    else if (sel[g] === i) marks[i] = 'wrong';
  });
  const ok = checked && groups.every((ws, g) => c.words[sel[g]] && c.words[sel[g]].tonic);
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-card shadow-green">
        <div className="gc-meta">
          <span className="ctx-badge">{groups.length > 1 ? <T en={`${groups.length} parts — one big word each`} bn={`${groups.length}টি অংশ — প্রতিটিতে একটি বড় শব্দ`} block={false} /> : <T en="One big word" bn="একটি বড় শব্দ" block={false} />}</span>
          <span>{ri + 1} of {scene.rounds.length}</span>
          <Score results={results} total={scene.rounds.length} idx={ri} />
        </div>
        <div className="gc-stage">
          <RhythmLane id={id} reveal={checked} marks={marks} onWord={checked ? undefined : tap} size="xl" className="bigbeat" />
        </div>
        {!checked
          ? <T en={groups.length > 1 ? 'Which word should look biggest in each part? Tap one in each.' : 'Which word should look biggest? Tap it.'} bn={groups.length > 1 ? 'প্রতিটি অংশে কোন শব্দটা সবচেয়ে বড় হওয়া উচিত? প্রতিটিতে একটায় চাপ দিন।' : 'কোন শব্দটা সবচেয়ে বড় হওয়া উচিত? চাপ দিন।'} as="p" className="gc-feedback" />
          : <Feedback ok={ok}>{ok ? <><ICheck /> Yes — that is where the news is.</> : <>Listen: the gold words carry the news. The others make room.</>}</Feedback>}
        {checked && <VoiceLine id={id} size="md" labels="none" forcePlayed className="gc-line" />}
        <div className="gc-actions">
          {!checked && <button className="btn primary" disabled={!allChosen} onClick={check}><T en="Check — and listen" bn="মিলিয়ে দেখুন — আর শুনুন" block={false} /></button>}
          {checked && <button className="btn" onClick={() => (playing ? engine.stop() : engine.play(id))}><IReplay /> {UI.again.en}</button>}
          {checked && <button className="btn primary" onClick={() => { engine.stop(); setRi((ri + 1) % scene.rounds.length); }}>{ri < scene.rounds.length - 1 ? <>Next sentence <IArrowR /></> : <>Start again <IReplay /></>}</button>}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ catch the words that disappear
const NEUTRAL = new Set(['i', 'we', 'you', 'he', 'she', 'it', 'me', 'my', 'was', 'to', 'for', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'of', 'off', 'who', 'when', 'turn']);
export function RushGame({ scene }) {
  const [ri, setRi] = useState(0);
  const id = scene.rounds[ri];
  const c = getClip(id);
  const [sel, setSel] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [heard, setHeard] = useState(false);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const playing = usePlayingId(id);
  useEffect(() => { setSel({}); setRevealed(false); setHeard(false); }, [ri]);
  const listen = async () => { if (playing) { engine.stop(); return; } const r = await engine.play(id); if (r === 'ended') setHeard(true); };
  const tap = (i) => { if (!revealed) setSel(s => ({ ...s, [i]: !s[i] })); };
  const fnIdx = c.words.map((w, i) => (isFn(w) ? i : -1)).filter(i => i >= 0);
  const caught = fnIdx.filter(i => sel[i]).length;
  const wrong = c.words.filter((w, i) => sel[i] && !isFn(w) && !NEUTRAL.has(w.w.toLowerCase())).length;
  const reveal = (e) => {
    setRevealed(true);
    const ok = caught === fnIdx.length && wrong === 0;
    setResults(rs => { const n = rs.slice(); n[ri] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
    setTimeout(() => engine.play(id), 450);
  };
  const marks = {};
  c.words.forEach((w, i) => {
    if (!revealed) { if (sel[i]) marks[i] = 'sel'; return; }
    if (isFn(w)) marks[i] = sel[i] ? 'right' : 'missed';
    else if (sel[i] && !NEUTRAL.has(w.w.toLowerCase())) marks[i] = 'wrong';
  });
  return (
    <ClickSpark ref={spark} className="game">
      <div className="rush-card game-rush shadow-gold">
        <div className="rush-head">
          <span className="ear-mark" aria-hidden="true">EAR</span>
          <T en="Find the quiet connectors" bn="চুপচাপ জোড়ার শব্দগুলো খুঁজুন" block={false} />
          <span className="rush-prog">{ri + 1} of {scene.rounds.length}</span>
          <Score results={results} total={scene.rounds.length} idx={ri} />
        </div>
        <div className="rush-lane-wrap game">
          <span className="lane-label">LISTENING LANE</span>
          <RhythmLane id={id} reveal={revealed} marks={marks} onWord={revealed ? undefined : tap} size="lg" className="rushlane" />
        </div>
        {!revealed
          ? <T en={heard ? 'Tap every word that sounded small and quick.' : 'Listen first. Then tap every word that sounded small and quick.'} bn={heard ? 'যে শব্দগুলো ছোট আর দ্রুত শোনাল সবগুলোতে চাপ দিন।' : 'আগে শুনুন। তারপর যে শব্দগুলো ছোট আর দ্রুত শোনাল সবগুলোতে চাপ দিন।'} as="p" className="gc-feedback" />
          : <Feedback ok={caught === fnIdx.length && wrong === 0}>You caught {caught} of {fnIdx.length} small words{wrong ? `, and ${wrong} big word${wrong > 1 ? 's' : ''} by mistake` : ''}. Watch them rush past.</Feedback>}
        <div className="gc-actions">
          <button className="btn" onClick={listen}>{playing ? <IPause /> : <IPlay />} {UI.listen.en}</button>
          {!revealed && <button className="btn primary" disabled={!Object.values(sel).some(Boolean)} onClick={reveal}><T en="Reveal the rhythm" bn="ছন্দটা দেখুন" block={false} /></button>}
          {revealed && <button className="btn primary" onClick={() => { engine.stop(); setRi((ri + 1) % scene.rounds.length); }}>{ri < scene.rounds.length - 1 ? <>Next hunt <IArrowR /></> : <>Start again <IReplay /></>}</button>}
        </div>
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
    <ClickSpark ref={spark} className="game">
      <div className="game-card shadow-green">
        <div className="gc-meta">
          <span className="ctx-badge">PAUSE DETECTIVE</span>
          <div className="chips small" role="tablist">
            {scene.rounds.map((r, k) => <button key={k} role="tab" aria-selected={k === ri} className={`chip ${k === ri ? 'on' : ''}`} onClick={() => { engine.stop(); setRi(k); }}>{k + 1}</button>)}
          </div>
        </div>
        <div className="gc-play"><ClipButton ids={round.clip} variant="pill" label={UI.listen.en} /></div>
        <div className="pg-sentence">
          {round.parts.map((p, k) => (
            <React.Fragment key={k}>
              <span className="pg-part">{p}</span>
              {k < round.parts.length - 1 && (
                <button className={`pg-gap ${sel.includes(k) ? 'sel' : ''} ${checked ? (round.gaps.includes(k) ? (sel.includes(k) ? 'right' : 'missed') : (sel.includes(k) ? 'wrong' : '')) : ''}`}
                  onClick={() => toggle(k)} aria-pressed={sel.includes(k)} aria-label={`Pause after ${p}`}><span className="bar" /></button>
              )}
            </React.Fragment>
          ))}
        </div>
        {!checked ? (
          <div className="gc-actions"><button className="btn primary" onClick={check}>{UI.check.en}</button></div>
        ) : (
          <>
            <Feedback ok={exact}>{exact ? <><ICheck /> {round.gaps.length ? 'Yes — each pause closes one thought.' : 'Yes — no pause, so the words stay together.'}</> : 'Compare with the picture: // marks where the voice breaks.'}</Feedback>
            <VoiceLine id={round.clip} size="md" labels="words" stack="always" forcePlayed />
            <div className="gc-actions">
              <button className="btn" onClick={() => { setSel([]); setChecked(false); }}><IReplay /> {UI.tryAgain.en}</button>
              {ri < scene.rounds.length - 1 && <button className="btn primary" onClick={() => { engine.stop(); setRi(ri + 1); }}>{UI.nextRound.en} <IArrowR /></button>}
            </div>
          </>
        )}
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ link detective
export function LinkGame({ scene }) {
  const [ri, setRi] = useState(0);
  const r = scene.rounds[ri];
  const [sel, setSel] = useState([]);
  const [checked, setChecked] = useState(false);
  const [heard, setHeard] = useState(false);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const playing = usePlayingId(r.clip);
  useEffect(() => { setSel([]); setChecked(false); setHeard(false); }, [ri]);
  const listen = async () => { if (playing) { engine.stop(); return; } const res = await engine.play(r.clip); if (res === 'ended') setHeard(true); };
  const toggle = (g) => { if (!checked) setSel(s => s.includes(g) ? s.filter(x => x !== g) : [...s, g]); };
  const exact = sel.length === r.links.length && r.links.every(g => sel.includes(g));
  const check = (e) => {
    setChecked(true);
    setResults(rs => { const n = rs.slice(); n[ri] = exact; return n; });
    if (exact && spark.current) spark.current.burst(e.currentTarget);
    setTimeout(() => engine.play(r.clip), 300);
  };
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={ri + 1} total={scene.rounds.length} results={results} idx={ri} playing={!!playing} onPlay={listen} label="Play phrase" hint="Listen before you choose." />
        <div className="gb-light">
          <T en="Link detective" bn="জোড়া গোয়েন্দা" className="kick" />
          <h3 className="gb-q">Where do the words join?</h3>
          <div className="lk-game">
            {r.words.map((w, k) => (
              <React.Fragment key={k}>
                <span className="lk-w">{w}</span>
                {k < r.words.length - 1 && (
                  <button className={`lk-gap ${sel.includes(k) ? 'sel' : ''} ${checked ? (r.links.includes(k) ? (sel.includes(k) ? 'right' : 'missed') : (sel.includes(k) ? 'wrong' : '')) : ''}`} onClick={() => toggle(k)} aria-pressed={sel.includes(k)} aria-label={`Join ${w} and ${r.words[k + 1]}`}>
                    <svg viewBox="0 0 40 18"><path d="M3 4Q20 22 37 4" /></svg>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
          {!checked && <T en={heard ? 'Tap each join you hear.' : 'Play the phrase first.'} bn={heard ? 'যেখানে জোড়া শুনছেন সেখানে চাপ দিন।' : 'আগে বাক্যাংশটা শুনুন।'} as="p" className="muted" />}
          {checked && (
            <>
              <Feedback ok={exact}>{exact ? <><ICheck /> Yes! </> : 'Listen again: '}it sounds like “{r.like}”.</Feedback>
              <VoiceLine id={r.clip} size="md" labels="syllables" forcePlayed />
            </>
          )}
          <div className="gb-next">
            {!checked && <button className="btn primary" disabled={!sel.length && r.links.length > 0} onClick={check}>{UI.check.en}</button>}
            {checked && <button className="btn primary" onClick={() => { engine.stop(); setRi((ri + 1) % scene.rounds.length); }}>{ri < scene.rounds.length - 1 ? <>Next phrase <IArrowR /></> : <>Start again <IReplay /></>}</button>}
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ which number?
export function NumberGame({ scene }) {
  const rounds = useMemo(() => shuffle(scene.rounds).map(r => {
    const opts = r.options.map((o, i) => ({ o, ok: i === r.answer }));
    return { ...r, opts: shuffle(opts) };
  }), [scene.id]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [results, setResults] = useState([]);
  const spark = useRef(null);
  const r = rounds[idx % rounds.length];
  const playing = usePlayingId(r.clip);
  const choose = (k, e) => {
    if (pick != null) return;
    setPick(k);
    const ok = r.opts[k].ok;
    setResults(rs => { const n = rs.slice(); n[idx % rounds.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const ok = pick != null && r.opts[pick].ok;
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={(idx % rounds.length) + 1} total={rounds.length} results={results} idx={idx % rounds.length} playing={!!playing} onPlay={() => (playing ? engine.stop() : engine.play(r.clip))} label="Play the number" />
        <div className="gb-light">
          <T en="Listen for the groups and the beat" bn="দল আর তাল শুনুন" className="kick" />
          <h3 className="gb-q">Which did you hear?</h3>
          <div className="choices">
            {r.opts.map((o, k) => (
              <button key={k} className={`choice num ${pick != null && o.ok ? 'right' : ''} ${pick === k && !o.ok ? 'wrong' : ''}`} onClick={(e) => choose(k, e)} disabled={pick != null}>{o.o}</button>
            ))}
          </div>
          {pick != null && (
            <>
              <Feedback ok={ok}>{ok ? <><ICheck /> {UI.correct.en} </> : <>{UI.notQuite.en} </>}<T en={r.why.en} bn={r.why.bn} block={false} /></Feedback>
              <VoiceLine id={r.clip} size="sm" labels="words" forcePlayed />
              <div className="gb-next"><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

// ------------------------------------------------------------------ clusters: catch the extra vowel
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
    setResults(rs => { const n = rs.slice(); n[idx % rounds.length] = ok; return n; });
    if (ok && spark.current) spark.current.burst(e.currentTarget);
  };
  const next = () => { engine.stop(); setIdx(i => i + 1); setPick(null); };
  const span = tilesSpan([r.good, r.bad]);
  return (
    <ClickSpark ref={spark} className="game">
      <div className="game-board">
        <ListenPanel count={(idx % rounds.length) + 1} total={rounds.length} results={results} idx={idx % rounds.length} playing={!!playing} onPlay={() => (playing ? engine.stop() : engine.play(target))} label={r.word} />
        <div className="gb-light">
          <T en="Listen to the very beginning" bn="একেবারে শুরুটা শুনুন" className="kick" />
          <h3 className="gb-q">Is this clear English “{r.word}”?</h3>
          <div className="choices two">
            <button className={`choice ${pick && r.hidden === 'good' ? 'right' : ''} ${pick === 'good' && r.hidden !== 'good' ? 'wrong' : ''}`} disabled={!!pick} onClick={(e) => choose('good', e)}><T en="Clear English" bn="পরিষ্কার ইংরেজি" /></button>
            <button className={`choice ${pick && r.hidden === 'bad' ? 'right' : ''} ${pick === 'bad' && r.hidden !== 'bad' ? 'wrong' : ''}`} disabled={!!pick} onClick={(e) => choose('bad', e)}><T en="Extra vowel" bn="বাড়তি স্বর" /></button>
          </div>
          {pick && (
            <>
              <Feedback ok={pick === r.hidden}>{pick === r.hidden ? <><ICheck /> {r.hidden === 'good' ? 'Yes — the consonants stayed together.' : 'Yes — you caught the helper vowel.'}</> : (r.hidden === 'good' ? 'That was clear English — no extra vowel.' : 'A helper vowel slipped in. See the extra tile.')}</Feedback>
              <div className="reveal">{[r.good, r.bad].map(id => <div key={id} className={`pc-strip ${id === target ? 'target' : ''}`}><span className="ps-w">{labelOf(id)}</span><Tiles id={id} span={span} snap /></div>)}</div>
              <div className="gb-next"><button className="btn primary" onClick={next}>{UI.nextRound.en} <IArrowR /></button></div>
            </>
          )}
        </div>
      </div>
    </ClickSpark>
  );
}
