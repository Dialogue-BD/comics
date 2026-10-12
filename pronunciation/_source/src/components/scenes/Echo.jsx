// Say: listen, then say it three to five times. Optionally record yourself:
// your own pitch line is drawn in blue over the model so you can compare the shape.
// There is no score.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Tape from '../Tape';
import PuffMeter from '../visuals/PuffMeter';
import Tiles, { tilesSpan } from '../visuals/Tiles';
import engine, { clip as getClip } from '../../lib/audio';
import { openMic, closeMic, readFrame, makeRecorder, fitTake } from '../../lib/mic';
import { usePlayingId } from '../../lib/hooks';
import { T } from '../../lib/settings';
import { ClipButton, labelOf } from '../Bits';
import { IMic, IStop, IPlay, ICheck, IHand } from '../Icons';
import { UI } from '../../content/units';

const REPS = 5;

export function EchoScene({ scene }) {
  const items = scene.items;
  const [i, setI] = useState(0);
  const item = items[i];
  const ids = Array.isArray(item) ? item : [item];
  const [count, setCount] = useState(0);
  const [take, setTake] = useState(null);       // { overlay, url }
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
    // stop automatically after a generous window
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
    const a = new Audio(take.url);
    a.play().catch(() => {});
  };

  const said = (e) => {
    setCount(c => Math.min(REPS, c + 1));
    gsap.fromTo(e.currentTarget, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  };

  const isPair = ids.length > 1;
  const c0 = getClip(ids[0]);
  const isSent = c0.words.length > 1;

  return (
    <div className={`echo mode-${scene.mode}`}>
      <div className="echo-items enter" role="tablist" aria-label="Choose">
        {items.map((it, k) => (
          <button key={k} role="tab" aria-selected={k === i} className={`chip ${k === i ? 'on' : ''}`} onClick={() => { engine.stop(); setI(k); }}>
            {Array.isArray(it) ? it.map(labelOf).join(' / ') : (getClip(it).words.length > 1 ? labelOf(it).split(' ').slice(0, 3).join(' ') + '…' : labelOf(it))}
          </button>
        ))}
      </div>

      {scene.mode === 'tune' && (
        <ol className="echo-steps enter">
          <li><span className="es-n">1</span><T en="Listen" bn="শুনুন" /></li>
          <li><span className="es-n">2</span><T en="Hum: mm-MM-mm" bn="গুনগুন করুন" /></li>
          <li><span className="es-n">3</span><T en="Say it" bn="বলুন" /></li>
        </ol>
      )}

      <div className="echo-stage card enter">
        {isPair ? (
          <div className="echo-pair">
            {ids.map(id => (
              <div key={id} className="ep-col">
                <ClipButton ids={id} variant="word" label={labelOf(id)} />
                {scene.mode === 'puff'
                  ? <Tape id={id} height={100} labels="none" pitch={false} beads={false} airVoice puff className="mini" />
                  : <Tape id={id} height={130} overlay={take && id === ids[0] ? take.overlay : null} className="mini" />}
              </div>
            ))}
            {scene.mode === 'puff' && <div className="ep-puff"><PuffMeter ids={ids} size={150} /><span className="ep-hand"><IHand /></span></div>}
          </div>
        ) : (
          <>
            <Tape id={ids[0]} height={isSent ? 230 : 210} overlay={take ? take.overlay : null} overlayLabel={take && take.overlay ? UI.you.en : null} />
            {scene.mode === 'cluster' && <div className="echo-tiles"><Tiles id={ids[0]} snap /></div>}
          </>
        )}
        {take && !take.overlay && !isPair && <p className="echo-hint muted"><T en="I couldn’t hear a clear voice. Try again, a little louder." bn="স্পষ্ট কণ্ঠ শোনা যায়নি। আবার চেষ্টা করুন, একটু জোরে।" /></p>}
      </div>

      <div className="echo-ctl enter">
        <ClipButton ids={ids} variant="pill" label={isPair ? UI.both.en : UI.listen.en} className="primary-ish" />
        {!rec ? (
          <button className="btn rec" onClick={startRec}><IMic /> {UI.record.en}</button>
        ) : (
          <button className="btn rec is-rec" onClick={() => stopRec()}><span className="rec-meter"><i ref={meterRef} /></span><IStop /> {UI.stop.en}</button>
        )}
        {take && take.url && <button className="btn" onClick={hearMe}><IPlay /> {UI.hearMe.en}</button>}
      </div>
      {micErr && <p className="echo-hint muted enter"><T en="The microphone is off — that’s fine. Just say it out loud." bn="মাইক্রোফোন বন্ধ — কোনো সমস্যা নেই। শুধু জোরে বলুন।" /></p>}

      <div className="reps enter">
        <button className="btn quiet said" onClick={said}><ICheck /> {UI.said.en}</button>
        <div className="rep-dots" aria-label={`${count} of ${REPS}`}>
          {Array.from({ length: REPS }).map((_, k) => <span key={k} className={k < count ? 'on' : ''} />)}
        </div>
      </div>
    </div>
  );
}
