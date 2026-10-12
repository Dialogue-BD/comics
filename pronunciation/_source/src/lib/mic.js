// The student's own voice: live pitch (autocorrelation) and a recording to play back.
// Nothing is uploaded; the take lives only in this page.
import engine from './audio';

let shared = null;

export async function openMic() {
  if (shared) return shared;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('no-mic');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true } });
  const ctx = engine.context();
  if (ctx.state !== 'running') await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser();
  an.fftSize = 2048;
  src.connect(an);
  shared = { stream, ctx, an, buf: new Float32Array(an.fftSize) };
  return shared;
}

export function closeMic() {
  if (!shared) return;
  shared.stream.getTracks().forEach(t => t.stop());
  shared = null;
}

// One analysis frame: { f0 (Hz or 0), rms }
export function readFrame(m) {
  const { an, buf, ctx } = m;
  an.getFloatTimeDomainData(buf);
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.012) return { f0: 0, rms };
  // decimate by 2 — plenty for speech pitch, a quarter of the work
  const half = buf.length >> 1;
  const d = m.dec || (m.dec = new Float32Array(half));
  for (let i = 0; i < half; i++) d[i] = (buf[2 * i] + buf[2 * i + 1]) * 0.5;
  const sr = ctx.sampleRate / 2;
  const minLag = Math.floor(sr / 500), maxLag = Math.floor(sr / 75);
  const n = half - maxLag;
  let best = -1;
  const rs = m.rs || (m.rs = new Float32Array(maxLag + 2));
  // normalised autocorrelation
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0, e1 = 0, e2 = 0;
    for (let i = 0; i < n; i++) { const a = d[i], b = d[i + lag]; s += a * b; e1 += a * a; e2 += b * b; }
    const r = s / Math.sqrt(e1 * e2 + 1e-12);
    rs[lag] = r;
    if (r > best) best = r;
  }
  if (best < 0.6) return { f0: 0, rms };
  // the shortest lag that is nearly as good: avoids dropping an octave
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (rs[lag] >= best * 0.9 && rs[lag] >= rs[lag - 1] && rs[lag] >= rs[lag + 1]) return { f0: sr / lag, rms };
  }
  return { f0: 0, rms };
}

export function makeRecorder(stream) {
  if (typeof MediaRecorder === 'undefined') return null;
  try {
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = e => e.data && e.data.size && chunks.push(e.data);
    return {
      start: () => rec.start(),
      stop: () => new Promise(res => { rec.onstop = () => res(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); rec.stop(); })
    };
  } catch (e) { return null; }
}

// Fit a take's pitch track onto a model clip's time axis and semitone scale.
export function fitTake(frames0, model) {
  // clean the track: fold octave slips toward the median, drop lone frames
  const hz0 = frames0.filter(f => f.f0 > 0).map(f => f.f0).sort((a, b) => a - b);
  if (hz0.length < 4) return null;
  const m0 = hz0[Math.floor(hz0.length / 2)];
  const frames = frames0.map(f => {
    if (!(f.f0 > 0)) return f;
    let v = f.f0;
    while (v / m0 > 1.75) v /= 2;
    while (m0 / v > 1.75) v *= 2;
    return { ...f, f0: Math.abs(12 * Math.log2(v / m0)) > 8 ? 0 : v };
  }).map((f, i, a) => (f.f0 > 0 && !(a[i - 1] && a[i - 1].f0 > 0) && !(a[i + 1] && a[i + 1].f0 > 0)) ? { ...f, f0: 0 } : f);
  const v = frames.filter(f => f.f0 > 0);
  if (v.length < 6) return null;
  const hz = v.map(f => f.f0).sort((a, b) => a - b);
  const med = hz[Math.floor(hz.length / 2)];
  const on = v[0].t, off = v[v.length - 1].t;
  const mOn = model.pitch.length ? model.pitch[0][0] : model.on;
  const last = model.pitch[model.pitch.length - 1];
  const mOff = last ? last[0] + last[1].length * 0.01 : model.off;
  const k = (mOff - mOn) / Math.max(0.2, off - on);
  // smooth a little, keep gaps
  const out = [];
  frames.forEach((f, i) => {
    if (f.t < on - 0.05 || f.t > off + 0.05) return;
    const st = f.f0 > 0 ? 12 * Math.log2(f.f0 / med) : null;
    out.push({ t: mOn + (f.t - on) * k, st });
  });
  for (let i = 1; i < out.length - 1; i++) {
    if (out[i].st != null && out[i - 1].st != null && out[i + 1].st != null) out[i].st = (out[i - 1].st + out[i].st * 2 + out[i + 1].st) / 4;
  }
  return out;
}
