// Say: listen, then say it three to five times. Optionally record yourself: your own
// pitch line is drawn over the model so you can compare the shape. There is no score.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import VoiceLine from '../VoiceLine';
import Tiles from '../visuals/Tiles';
import MouthDiagram from '../mouth/MouthDiagram';
import { focusShape } from '../mouth/visemes';
import engine, { clip as getClip } from '../../lib/audio';
import { openMic, closeMic, readFrame, makeRecorder, fitTake } from '../../lib/mic';
import { usePlayingId } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, labelOf } from '../Bits';
import { IMic, IStop, IPlay, ICheck, IArrowR, IArrowL } from '../Icons';
import { UI } from '../../content/units';

const REPS = 5;

export function EchoSection({ scene }) {
  const items = scene.items;
  const [i, setI] = useState(0);
  const item = items[i];
  const ids = Array.isArray(item) ? item : [item];
  const [count, setCount] = useState(0);
  const [take, setTake] = useState(null);
  const [rec, setRec] = useState(false);
  const [micErr, setMicErr] = useState(null);
  const recRef = useRef(null);
  const meterRef = useRef(null);

  useEffect(() => { setCount(0); setTake(null); }, [i]);
  useEffect(() => () => { stopRec(true); closeMic(); }, []);

  const startRec = async () => {
    engine.stop();
    setMicErr(null);
    let m;
    try { m = await openMic(); } catch (e) { setMicErr(true); return; }
    const frames = [];
    const t0 = performance.now();
    const recorder = makeRecorder(m.stream);
    recorder && recorder.start();
    let on = true, tick = 0, raf = 0;
    const loop = () => {
      if (!on) return;
      tick++;
      if (tick % 2 === 0) {
        const f = readFrame(m);
        frames.push({ t: (performance.now() - t0) / 1000, f0: f.f0, rms: f.rms });
        if (meterRef.current) meterRef.current.style.transform = `scaleY(${Math.min(1, f.rms * 9).toFixed(3)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    recRef.current = { stop: async () => { on = false; cancelAnimationFrame(raf); const blob = recorder ? await recorder.stop() : null; return { frames, blob }; } };
    raf = requestAnimationFrame(loop);
    setRec(true);
    const max = Math.min(9, Math.max(3, getClip(ids[0]).dur * ids.length * 2 + 1.5));
    recRef.current.auto = setTimeout(() => stopRec(), max * 1000);
  };

  const stopRec = async (silent) => {
    const r = recRef.current;
    if (!r) return;
    clearTimeout(r.auto);
    recRef.current = null;
    const { frames, blob } = await r.stop();
    if (silent) return;
    setRec(false);
    const overlay = fitTake(frames, getClip(ids[0]));
    const url = blob ? URL.createObjectURL(blob) : null;
    setTake({ overlay, url });
    setCount(c => Math.min(REPS, c + 1));
  };

  const hearMe = () => {
    if (!take || !take.url) return;
    engine.stop();
    new Audio(take.url).play().catch(() => {});
  };

  const said = (e) => {
    setCount(c => Math.min(REPS, c + 1));
    gsap.fromTo(e.currentTarget, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  };

  const isPair = ids.length > 1;
  const isSent = getClip(ids[0]).words.length > 1;
  const showMouth = scene.mode === 'pair' || scene.mode === 'puff';

  return (
    <div className={`echo mode-${scene.mode}`}>
      <div className="chips" role="tablist" aria-label="Choose">
        {items.map((it, k) => (
          <button key={k} role="tab" aria-selected={k === i} className={`chip ${k === i ? 'on' : ''}`} onClick={() => { engine.stop(); setI(k); }}>
            {Array.isArray(it) ? it.map(labelOf).join(' / ') : (getClip(it).words.length > 3 ? labelOf(it).split(' ').slice(0, 3).join(' ') + '…' : labelOf(it))}
          </button>
        ))}
      </div>

      {scene.mode === 'tune' && (
        <ol className="steps3">
          <li><span>1</span><T en="Listen" bn="শুনুন" /></li>
          <li><span>2</span><T en="Hum the tune: mm-MM-mm" bn="সুরটা গুনগুন করুন" /></li>
          <li><span>3</span><T en="Say it" bn="বলুন" /></li>
        </ol>
      )}

      <div className={`echo-stage board shadow-gold ${showMouth ? 'with-mouth' : ''}`}>
        {showMouth && <div className="echo-mouth"><MouthDiagram key={ids.join()} ids={ids} pose={focusShape((getClip(ids[0]) || {}).ph)} muscles={scene.mode === 'pair' && /vow-/.test(ids[0])} small /></div>}
        <div className="echo-lines">
          {ids.map(id => (
            <div key={id} className="echo-line">
              {isPair && <ClipButton ids={id} variant="word" label={labelOf(id)} />}
              <VoiceLine id={id} size={isPair ? 'md' : 'lg'} overlay={take && id === ids[0] ? take.overlay : null} labels={isSent ? 'words' : 'auto'} />
            </div>
          ))}
          {scene.mode === 'cluster' && <Tiles id={ids[0]} snap />}
          {take && take.overlay && <span className="you-key"><i /> <T en="your voice" bn="আপনার কণ্ঠ" block={false} /></span>}
          {take && !take.overlay && <T en="I couldn’t hear a clear voice. Try again, a little louder." bn="স্পষ্ট কণ্ঠ শোনা যায়নি। আবার চেষ্টা করুন, একটু জোরে।" as="p" className="muted" />}
        </div>
      </div>

      <div className="echo-ctl">
        <ClipButton ids={ids} variant="pill" label={isPair ? UI.both.en : UI.listen.en} className="primary-ish" />
        {!rec ? (
          <button className="btn rec" onClick={startRec}><IMic /> {UI.record.en}</button>
        ) : (
          <button className="btn rec is-rec" onClick={() => stopRec()}><span className="rec-meter"><i ref={meterRef} /></span><IStop /> {UI.stop.en}</button>
        )}
        {take && take.url && <button className="btn" onClick={hearMe}><IPlay /> {UI.hearMe.en}</button>}
      </div>
      {micErr && <T en="The microphone is off — that’s fine. Just say it out loud." bn="মাইক্রোফোন বন্ধ — কোনো সমস্যা নেই। শুধু জোরে বলুন।" as="p" className="muted" />}

      <div className="reps">
        <button className="btn quiet said" onClick={said}><ICheck /> {UI.said.en}</button>
        <div className="rep-dots" aria-label={`${count} of ${REPS}`}>
          {Array.from({ length: REPS }).map((_, k) => <span key={k} className={k < count ? 'on' : ''} />)}
        </div>
        {i < items.length - 1 && <button className="btn small" onClick={() => { engine.stop(); setI(i + 1); }}>{UI.next.en} <IArrowR /></button>}
      </div>
    </div>
  );
}

// numbers: say it first, then check against the model
export function NumberSaySection({ scene }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const it = scene.items[i];
  const playing = usePlayingId(it.clip);
  const go = (k) => { engine.stop(); setShown(false); setI((k + scene.items.length) % scene.items.length); };
  return (
    <div className="split-board numsay">
      <div className="sb-dark">
        <span className="kick light">PROMPT {i + 1} OF {scene.items.length}</span>
        <div className={`rings ${playing ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /></div>
        <T en="First let your ear build the pattern. Then copy the grouping and the beat." bn="আগে কানকে ধরনটা ধরতে দিন। তারপর দল আর তালটা নকল করুন।" as="p" />
      </div>
      <div className="sb-light">
        <T en="How would you say it?" bn="আপনি কীভাবে বলবেন?" className="kick coral" />
        <div className="ns-show">{it.show}</div>
        <div className={`ns-say ${shown ? 'on' : ''}`}>{shown ? it.say : '· · ·'}</div>
        <div className="ns-btns">
          <button className="btn primary" onClick={() => { setShown(true); engine.play(it.clip); }}><IPlay /> <T en="I said it — check" bn="বলেছি — মিলিয়ে দেখি" block={false} /></button>
          <button className="btn" onClick={() => go(i - 1)} aria-label="Previous"><IArrowL /></button>
          <button className="btn" onClick={() => go(i + 1)}>{UI.next.en} <IArrowR /></button>
        </div>
        {shown && <VoiceLine id={it.clip} size="sm" labels="words" />}
      </div>
    </div>
  );
}
