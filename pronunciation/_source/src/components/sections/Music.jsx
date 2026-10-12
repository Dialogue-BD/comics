// Listening sections for the music units: word stress, big/small words, thought
// groups, linking, numbers.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import VoiceLine from '../VoiceLine';
import RhythmLane from '../visuals/RhythmLane';
import engine, { clip as getClip } from '../../lib/audio';
import { usePlayingId, useClipFrame } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, Note, L1Note, Beats, partsOf, labelOf, TabBar, NarrowSwitch, SwipeHint } from '../Bits';
import { IPlay, IPause } from '../Icons';
import { UI } from '../../content/units';

const spanOf = (ids, lead = 0.08) => Math.max(...ids.map(id => { const c = getClip(id); return c.off - c.on + lead * 2; }));

// ---------------------------------------------------------------- voice lines
export function LinesSection({ scene }) {
  const shared = scene.shareScale ? spanOf(scene.clips) : undefined;
  // several sentences: one at a time with tabs, so a stacked sentence fits one screen;
  // words (photograph / photographic) stay together on one shared scale
  const sentences = scene.clips.length > 1 && scene.clips.every(id => getClip(id).words.length > 3);
  const [k, setK] = useState(0);
  const shown = sentences ? [scene.clips[k]] : scene.clips;
  return (
    <>
      {sentences && <TabBar items={scene.clips.map(id => labelOf(id).split(' ').slice(0, 4).join(' ') + '…')} k={k} onPick={setK} label="Sentences" next="Next sentence" />}
      <div className={`board shadow-blue ${!sentences && shown.length === 2 ? 'cols-2' : ''}`}>
        {shown.map(id => {
          const multi = getClip(id).words.length > 1;
          return (
            <div className="board-row line-row" key={id}>
              <ClipButton ids={id} variant={multi ? 'sentence' : 'word'} label={multi ? labelOf(id) : getClip(id).words[0].syl.map(s => s.t).join('·')} />
              <VoiceLine id={id} span={shared} size={multi ? 'md' : 'lg'} stack={scene.stack || 'auto'} labels={scene.labels || 'auto'} />
            </div>
          );
        })}
      </div>
      {scene.clips.length > 1 && !sentences && <div className="row-actions"><ClipButton ids={scene.clips} variant="pill" label={UI.playAll.en} /></div>}
      <Note text={scene.note} />
      <L1Note text={scene.l1} />
    </>
  );
}

// ---------------------------------------------------------------- schwa
export function SchwaSection({ scene }) {
  return (
    <>
      <div className="board cols-3 shadow-gold swipe">
        {scene.words.map(w => <SchwaCard key={w.clip} w={w} />)}
      </div>
      <SwipeHint />
      <L1Note text={scene.l1} />
    </>
  );
}
function SchwaCard({ w }) {
  const playing = usePlayingId(w.clip);
  return (
    <div className={`board-cell schwa-card ${playing ? 'is-playing' : ''}`}>
      <T en={w.note.en} bn={w.note.bn} className="kick coral" />
      <button className="schwa-word" onClick={() => engine.play(w.clip)} aria-label={`Play ${w.parts.map(p => p[0]).join('')}`}>
        {w.parts.map(([t, lv], i) => <span key={i} className={lv === 2 ? 'sw-big' : 'sw-small'}>{lv === 0 ? t : t}</span>)}
      </button>
      <VoiceLine id={w.clip} size="sm" labels="syllables" />
      <ClipButton ids={w.clip} variant="pill" label={`Hear ${w.parts.map(p => p[0]).join('')}`} />
    </div>
  );
}

// ---------------------------------------------------------------- suffixes
export function SuffixSection({ scene }) {
  return (
    <>
      <div className="table-board">
        {scene.rows.map(r => <SuffixRow key={r.clip} row={r} />)}
      </div>
      <Note text={scene.note} />
    </>
  );
}
function SuffixRow({ row }) {
  const ids = row.compare ? [row.clip, row.compare] : [row.clip];
  const playing = usePlayingId(ids);
  const shown = playing || row.clip;
  return (
    <div className={`tb-row ${row.compare ? 'tinted' : ''} ${playing ? 'is-playing' : ''}`}>
      <span className="tb-tag">{row.end}</span>
      <div className="tb-main">
        <Beats parts={partsOf(shown)} className="big" />
        <T en={row.compare ? 'Compare PHO·to·graph: the beat moves when -ic arrives.' : `Stress the syllable before ${row.end}.`} bn={row.compare ? 'PHO·to·graph-এর সাথে তুলনা করুন: -ic এলে তাল সরে যায়।' : `${row.end}-এর ঠিক আগের অক্ষরে জোর দিন।`} as="p" className="tb-sub" />
        {playing && <VoiceLine id={playing} size="sm" labels="none" ball={false} className="tb-line" />}
      </div>
      <div className="tb-btns">
        {ids.map(id => <ClipButton key={id} ids={id} variant="small" label={labelOf(id).replace(/·/g, '')} />)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- prefixes / neutral endings
export function PrefixSection({ scene }) {
  return (
    <div className="table-board">
      {scene.rows.map((r, i) => {
        const ids = [r.from, r.to].filter(Boolean);
        return (
          <div className="tb-row" key={i}>
            <span className="tb-tag">{r.tag}</span>
            <div className="tb-main">
              <span className="tb-flow">
                {r.from && <><Beats parts={partsOf(r.from)} className="big" /><span className="arrow" aria-hidden="true">→</span></>}
                <Beats parts={partsOf(r.to)} className="big" />
              </span>
              <T en="The beat stays on the root." bn="তাল মূল শব্দেই থাকে।" as="p" className="tb-sub" />
            </div>
            <div className="tb-btns">{ids.map(id => <ClipButton key={id} ids={id} variant="small" label={labelOf(id)} />)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- compound nouns
export function CompoundSection({ scene }) {
  return (
    <div className="board compound-board shadow-gold">
      <div className="cb-head"><T en="One thing: FIRST beat" bn="একটা জিনিস: প্রথমে তাল" className="kick" /><T en="Describing: SECOND beat" bn="বর্ণনা: দ্বিতীয়তে তাল" className="kick" /></div>
      {scene.rows.map((r, i) => (
        <div className="cmp-row" key={i}>
          <span className="cmp-n">0{i + 1}</span>
          <CmpCell id={r.n} big={r.a} small={r.b} joined mean={r.mn} />
          <CmpCell id={r.p} big={r.b} small={r.a} mean={r.mp} second />
        </div>
      ))}
    </div>
  );
}
function CmpCell({ id, big, small, joined, second, mean }) {
  const playing = usePlayingId(id);
  return (
    <button className={`cmp-cell ${playing ? 'is-playing' : ''}`} onClick={() => (playing ? engine.stop() : engine.play(id))}>
      <span className={`cmp-word ${joined ? 'joined' : ''}`}>
        {second ? <><span className="cw-small">{small}</span>{' '}<span className="cw-big">{big.toUpperCase()}</span></> : <><span className="cw-big">{big.toUpperCase()}</span><span className="cw-small">{small}</span></>}
      </span>
      <T en={mean.en} bn={mean.bn} className="cmp-mean" />
      <span className="cmp-play">{playing ? <IPause /> : <IPlay />} <T en="play" bn="শুনুন" block={false} /></span>
    </button>
  );
}

// ---------------------------------------------------------------- how to read the pictures
export function LegendSection({ scene }) {
  return (
    <>
      <div className="legend">
        <div className="legend-item">
          <svg viewBox="0 0 120 44" className="lg-stroke" aria-hidden="true"><path d="M4 34C26 33 30 6 52 12S86 40 116 10" /></svg>
          <T en="The line is the melody" bn="রেখাটাই সুর" as="strong" />
          <T en="It rises and falls with the voice, and swells on the big beat." bn="কণ্ঠের সাথে ওঠে-নামে, আর বড় তালে মোটা হয়।" as="p" />
        </div>
        <div className="legend-item">
          <span className="lg-demo"><span>we</span><b className="lg-big">NEED</b><span>three</span></span>
          <T en="Big words are big" bn="বড় শব্দ বড়" as="strong" />
          <T en="Louder, longer, higher. The ball jumps highest into them." bn="বেশি জোরে, বেশি লম্বা, উঁচুতে। বলটা সেখানে সবচেয়ে উঁচুতে লাফায়।" as="p" />
        </div>
        <div className="legend-item">
          <span className="lg-demo"><i className="lg-small">to the</i><b>market</b></span>
          <T en="Small words shrink" bn="ছোট শব্দ ছোট হয়" as="strong" />
          <T en="They rush quietly between the beats." bn="তালের মাঝে চুপচাপ দ্রুত চলে যায়।" as="p" />
        </div>
      </div>
      <div className="board shadow-green">
        <div className="board-row line-row">
          <ClipButton ids={scene.clip} variant="sentence" label={labelOf(scene.clip)} />
          <VoiceLine id={scene.clip} size="lg" labels="words" />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- small words rush
export function RushDemoSection({ scene }) {
  const playing = usePlayingId(scene.clip);
  return (
    <>
      <div className={`rush-card ${playing ? 'is-playing' : ''}`}>
        <div className="rush-head"><span className="ear-mark" aria-hidden="true">EAR</span><T en="Listening lane" bn="শোনার পথ" block={false} /></div>
        <div className="rush-lane-wrap" onClick={() => (playing ? engine.stop() : engine.play(scene.clip))} role="button" tabIndex={0}>
          <RhythmLane id={scene.clip} reveal size="lg" />
        </div>
        <div className="rush-foot"><ClipButton ids={scene.clip} variant="pill" label={UI.listen.en} /></div>
      </div>
      <L1Note text={scene.l1} />
    </>
  );
}

// ---------------------------------------------------------------- melody on / off
export function MelodySection({ scene }) {
  const playing = usePlayingId([scene.on, scene.off]);
  const [pick, setPick] = useState(0);
  return (
    <>
      <NarrowSwitch items={['Melody on', 'Melody off']} k={pick} onPick={setPick} label="Melody" />
      <div className={`melody-grid pick-${pick}`}>
        {[['on', scene.on], ['off', scene.off]].map(([k, id], i) => (
          <div key={k} className={`melody-card ${k} nz-${i} ${playing === id ? 'is-playing' : ''}`}>
            <span className="kick coral">{k === 'on' ? 'NATURAL · MELODY ON' : 'MONOTONE · MELODY OFF'}</span>
            <T en={k === 'on' ? 'Small tunes that rise and fall' : 'One flat line'} bn={k === 'on' ? 'ওঠা-নামা করা ছোট ছোট সুর' : 'একটাই সমান রেখা'} as="h3" />
            <ClipButton ids={id} variant="pill" label={k === 'on' ? 'Melody on' : 'Melody off'} />
            <VoiceLine id={id} size="md" tone={k === 'off' ? 'flat' : 'ink'} labels="words" stack="always" />
          </div>
        ))}
      </div>
      <T en={scene.ask.en} bn={scene.ask.bn} as="p" className="ask" />
    </>
  );
}

// ---------------------------------------------------------------- the pause
export function PauseSection({ scene }) {
  return (
    <div className="meaning-board">
      {[scene.a, scene.b].map((x, i) => <PauseCard key={x.clip} x={x} good={i === 0} />)}
    </div>
  );
}
function PauseCard({ x, good }) {
  const playing = usePlayingId(x.clip);
  return (
    <div className={`pause-card ${good ? 'good' : 'bad'} ${playing ? 'is-playing' : ''}`}>
      <Grandma variant={good ? 'invited' : 'dinner'} />
      <strong className="pc-text">{good ? <>Let’s eat<span className="comma">,</span> Grandma!</> : <>Let’s eat Grandma!</>}</strong>
      <T en={x.mean.en} bn={x.mean.bn} as="p" className="pc-mean" />
      <ClipButton ids={x.clip} variant="pill" label={good ? 'With the pause' : 'No pause'} />
      <VoiceLine id={x.clip} size="sm" labels="words" />
    </div>
  );
}

function Grandma({ variant }) {
  const dinner = variant === 'dinner';
  return (
    <svg className={`grandma ${variant}`} viewBox="0 0 220 130" aria-hidden="true">
      <rect x="10" y="104" width="200" height="9" rx="4" className="g-table" />
      {dinner ? (
        <>
          <ellipse cx="110" cy="102" rx="66" ry="11" className="g-plate" />
          <g transform="translate(110 80) scale(.8)">
            <circle cx="0" cy="-20" r="18" className="g-skin" />
            <path d="M-17 -28c4-14 30-14 34 0" className="g-hair" />
            <circle cx="0" cy="-42" r="8" className="g-hair" />
            <circle cx="-6" cy="-21" r="2.2" className="g-eye" /><circle cx="6" cy="-21" r="2.2" className="g-eye" />
            <ellipse cx="0" cy="-11" rx="4" ry="5" className="g-eye" />
            <path d="M-22 2h44l-6 20h-32z" className="g-dress" />
          </g>
          <path d="M40 52l10 50M36 52v14M44 52v14M40 52v14" className="g-fork" />
          <path d="M180 50c8 0 8 14 0 18v34" className="g-fork" />
        </>
      ) : (
        <>
          <ellipse cx="152" cy="102" rx="34" ry="7" className="g-plate" />
          <path d="M142 95c4-10 16-10 20 0" className="g-food" />
          <g transform="translate(64 64)">
            <circle cx="0" cy="-20" r="18" className="g-skin" />
            <path d="M-17 -28c4-14 30-14 34 0" className="g-hair" />
            <circle cx="0" cy="-42" r="8" className="g-hair" />
            <path d="M-8 -21q2 -3 4 0M4 -21q2 -3 4 0" className="g-line" />
            <path d="M-6 -12q6 6 12 0" className="g-line" />
            <path d="M-24 2h48l-4 38h-40z" className="g-dress" />
          </g>
          <text x="150" y="58" className="g-heart" textAnchor="middle">♥</text>
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- linking
export function LinksSection({ scene }) {
  return (
    <>
      <div className="table-board links-board">
        {scene.rows.map((r, i) => <LinkRow key={r.clip} r={r} n={i + 1} />)}
      </div>
      <Note text={scene.note} />
    </>
  );
}
function LinkRow({ r, n }) {
  const playing = usePlayingId(r.clip);
  const c = getClip(r.clip);
  const box = useRef(null);
  useClipFrame(r.clip, (t, on) => {
    if (!box.current) return;
    box.current.querySelectorAll('.lk-arc').forEach((el) => {
      const k = +el.dataset.k;
      const w = c.words[k + 1];
      const hit = on && w && t >= w.s - 0.06;
      if (hit && !el.classList.contains('hit')) { el.classList.add('hit'); gsap.fromTo(el.querySelector('path'), { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }); }
      if (!on) el.classList.remove('hit');
    });
  });
  return (
    <div className={`tb-row link-row ${playing ? 'is-playing' : ''}`} ref={box}>
      <span className="tb-n">0{n}</span>
      <div className="tb-main">
        <T en={r.kind.en} bn={r.kind.bn} className="kick coral" />
        <span className="lk-phrase" onClick={() => engine.play(r.clip)}>
          {r.words.map((w, i) => (
            <React.Fragment key={i}>
              <span className="lk-w">{w}</span>
              {i < r.words.length - 1 && (r.links.includes(i)
                ? <span className="lk-arc" data-k={i} aria-label="joined"><svg viewBox="0 0 40 18"><path d="M3 4Q20 22 37 4" pathLength="40" strokeDasharray="40" /></svg></span>
                : <span className="lk-space"> </span>)}
            </React.Fragment>
          ))}
        </span>
        <p className="tb-sub">sounds like “{r.like}”{r.how && <> — <T en={r.how.en} bn={r.how.bn} block={false} /></>}</p>
        <VoiceLine id={r.clip} size="sm" labels="words" className="tb-line" />
      </div>
      <div className="tb-btns"><ClipButton ids={r.clip} variant="small" label="Play" /></div>
    </div>
  );
}

// ---------------------------------------------------------------- numbers
function useWordNow(id) {
  const [k, setK] = useState(-1);
  const c = getClip(id);
  useClipFrame(id, (t, on) => {
    if (!on) { setK(-1); return; }
    let i = -1;
    c.words.forEach((w, j) => { if (t >= w.s - 0.02) i = j; });
    setK(p => (p === i ? p : i));
  });
  return k;
}

export function YearsSection({ scene }) {
  return (
    <div className="board cols-2 shadow-blue">
      {scene.rows.map(r => <YearCard key={r.clip} r={r} />)}
    </div>
  );
}
function YearCard({ r }) {
  const k = useWordNow(r.clip);
  const playing = usePlayingId(r.clip);
  return (
    <div className={`board-cell year-card ${playing ? 'is-playing' : ''}`}>
      <span className="kick">{r.a} + {r.b}</span>
      <button className="year-big" onClick={() => engine.play(r.clip)} aria-label={`Play ${r.a}${r.b}`}>
        <span className={`yb a ${k === 0 ? 'now' : ''}`}>{r.a}</span><span className="yb-slash">/</span><span className={`yb b ${k >= 1 ? 'now' : ''}`}>{r.b}</span>
      </button>
      <strong className="year-say">{r.say}</strong>
      <T en={r.not.en} bn={r.not.bn} as="p" className="muted" />
      <ClipButton ids={r.clip} variant="pill" label="Play" />
    </div>
  );
}

export function PhoneSection({ scene }) {
  const c = getClip(scene.clip);
  const playing = usePlayingId(scene.clip);
  const [g, setG] = useState(-1);
  useClipFrame(scene.clip, (t, on) => {
    if (!on) { setG(-1); return; }
    let gi = -1;
    c.words.forEach(w => { if (t >= w.s - 0.02) gi = w.group; });
    setG(p => (p === gi ? p : gi));
  });
  const groupWords = scene.groups.map((_, gi) => c.words.filter(w => w.group === gi));
  return (
    <div className={`split-board ${playing ? 'is-playing' : ''}`}>
      <div className="sb-dark">
        <span className="kick light">CHUNKING IN ACTION</span>
        <div className={`rings ${playing ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /></div>
        <T en="The number stays the same. Only the delivery changes: four small sound groups." bn="সংখ্যা একই থাকে। শুধু বলার ধরন বদলায়: চারটি ছোট দল।" as="p" />
      </div>
      <div className="sb-light">
        <span className="kick coral">LISTEN FOR THE SMALL PAUSES</span>
        <div className="phone-digits">{scene.digits}</div>
        <div className="chunks">
          {scene.groups.map((gr, i) => <span key={i} className={`chunk c${i} ${g === i ? 'now' : ''} ${g > i ? 'past' : ''}`}>{gr}</span>)}
        </div>
        <p className="chunk-say">{groupWords.map((ws, i) => <span key={i} className={g === i ? 'now' : ''}>{ws.map(w => w.tonic ? <b key={w.s}>{w.w} </b> : <React.Fragment key={w.s}>{w.w} </React.Fragment>)}{i < groupWords.length - 1 ? '· ' : ''}</span>)}</p>
        <ClipButton ids={scene.clip} variant="pill" label="Hear the chunks" />
      </div>
    </div>
  );
}

export function MeaningSection({ scene }) {
  return (
    <div className="table-board">
      {scene.rows.map((r, i) => <MeaningRow key={r.clip} r={r} n={i + 1} />)}
    </div>
  );
}
function MeaningRow({ r, n }) {
  const k = useWordNow(r.clip);
  const c = getClip(r.clip);
  const playing = usePlayingId(r.clip);
  return (
    <div className={`tb-row meaning-row ${playing ? 'is-playing' : ''}`}>
      <span className="tb-n">0{n}</span>
      <div className="tb-label"><T en={r.label.en} bn={r.label.bn} as="strong" /></div>
      <div className="tb-main">
        <span className="mr-show">{r.show}</span>
        <span className="mr-say">{c.words.map((w, i) => <span key={i} className={`${i === k ? 'now' : ''} ${w.tonic ? 'tonic' : ''}`}>{w.w} </span>)}</span>
      </div>
      <div className="tb-btns"><ClipButton ids={r.clip} variant="small" label="Play" /></div>
    </div>
  );
}
