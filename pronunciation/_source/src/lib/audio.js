// One player for the whole activity: only one recording ever plays at a time.
// Web Audio first (sample-accurate clock for the visuals), <audio> as fallback.
//
// Voices: every clip id can exist in several voices (Alice, British; Brian, American).
// Each voice has its own recordings and its own measurements, so the pictures always
// follow the voice that is actually speaking. A pair that is compared on screen
// (team / Tim) is linked: it always plays in one voice, falling back to Alice when
// the other voice has not recorded both words.
import { gsap } from 'gsap';
import ALICE from '../data/clips.json';
import BRIAN from '../data/clips-brian.json';

const AC = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;

export const VOICES = [
  { id: 'alice', name: 'Alice', accent: 'UK', accentLong: 'British', dir: '' },
  { id: 'brian', name: 'Brian', accent: 'US', accentLong: 'American', dir: 'brian/' },
];
const DATA = { alice: ALICE, brian: BRIAN };
const DEFAULT = 'alice';
const VKEY = 'voice-lab-voice';

class Engine {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.loading = new Map();
    this.cur = null;          // { id, voice, src, startAt, token, el }
    this.token = 0;
    this.subs = new Set();
    this.voiceSubs = new Set();
    this.unlocked = false;
    this.unlockSubs = new Set();
    this.groups = new Map();  // id -> Set of ids that must share a voice
    this.shown = new Map();   // id -> voice the pictures are drawn from right now
    let saved = null;
    try { saved = localStorage.getItem(VKEY); } catch (e) {}
    this._voice = DATA[saved] ? saved : DEFAULT;
    this.el = typeof Audio !== 'undefined' ? new Audio() : null;
    if (this.el) { this.el.preload = 'auto'; this.el.setAttribute('playsinline', ''); }
    this._tick = this._tick.bind(this);
    gsap.ticker.add(this._tick);
  }

  context() {
    if (!this.ctx && AC) {
      try { this.ctx = new AC(); } catch (e) { this.ctx = null; }
    }
    return this.ctx;
  }

  // Call from any user gesture. Browsers only allow sound after one.
  unlock() {
    const c = this.context();
    if (c && c.state !== 'running') c.resume().catch(() => {});
    if (!this.unlocked) {
      this.unlocked = true;
      this.unlockSubs.forEach(f => f(true));
    }
  }
  onUnlock(fn) { this.unlockSubs.add(fn); return () => this.unlockSubs.delete(fn); }

  // ---- voices ----
  get voice() { return this._voice; }
  setVoice(v) {
    if (!DATA[v] || v === this._voice) return;
    this._voice = v;
    try { localStorage.setItem(VKEY, v); } catch (e) {}
    if (this.cur) this.stop();
    this.shown.clear();
    this._voiceEmit(null);
  }
  has(id, v) { return !!(DATA[v] && DATA[v][id]); }
  voicesOf(id) { return VOICES.filter(v => this.has(id, v.id)).map(v => v.id); }
  // Words compared side by side always speak with one voice.
  link(ids) {
    const all = new Set(ids);
    ids.forEach(i => (this.groups.get(i) || []).forEach(j => all.add(j)));
    all.forEach(i => this.groups.set(i, all));
  }
  // The voice a clip plays in when nobody asks for a particular one.
  resolve(id, want = this._voice) {
    const group = this.groups.get(id) || [id];
    if ([...group].every(i => this.has(i, want))) return want;
    if (this.has(id, DEFAULT)) return DEFAULT;
    return this.voicesOf(id)[0] || DEFAULT;
  }
  // The voice the pictures for this clip should be drawn from right now: the voice
  // speaking it, else the one that spoke it last, else the one it will play in.
  voiceOf(id) {
    if (this.cur && this.cur.id === id) return this.cur.voice;
    if (this.shown.has(id)) return this.shown.get(id);
    return this.resolve(id);
  }
  data(id, v) { return (DATA[v || this.voiceOf(id)] || {})[id] || ALICE[id] || BRIAN[id]; }
  onVoice(fn) { this.voiceSubs.add(fn); return () => this.voiceSubs.delete(fn); }
  _voiceEmit(ids) { this.voiceSubs.forEach(f => { try { f(ids); } catch (e) { console.error(e); } }); }
  _show(id, v) {
    const was = this.voiceOf(id);
    this.shown.set(id, v);
    if (was !== v) this._voiceEmit([id]);
  }

  url(id, v) { return `audio/${(VOICES.find(x => x.id === v) || VOICES[0]).dir}${id}.mp3`; }

  load(id, v = this.resolve(id)) {
    const key = `${v}:${id}`;
    if (this.buffers.has(key)) return Promise.resolve(this.buffers.get(key));
    if (this.loading.has(key)) return this.loading.get(key);
    const c = this.context();
    if (!c) return Promise.reject(new Error('no-webaudio'));
    const p = fetch(this.url(id, v))
      .then(r => { if (!r.ok) throw new Error('audio ' + r.status); return r.arrayBuffer(); })
      .then(buf => new Promise((res, rej) => c.decodeAudioData(buf, res, rej)))
      .then(b => { this.buffers.set(key, b); this.loading.delete(key); return b; })
      .catch(e => { this.loading.delete(key); throw e; });
    this.loading.set(key, p);
    return p;
  }

  preload(ids) { (ids || []).forEach(id => this.load(id).catch(() => {})); }

  stop() {
    this.token++;
    const cur = this.cur;
    this.cur = null;
    if (cur) {
      if (cur.src) { try { cur.src.onended = null; cur.src.stop(0); } catch (e) {} try { cur.src.disconnect(); } catch (e) {} }
      if (cur.el) { cur.el.pause(); cur.el.onended = null; }
      if (cur.resolve) cur.resolve('stopped');
      this._emit({ id: cur.id, voice: cur.voice, t: -1, playing: false, ended: false });
    }
  }

  // Resolves 'ended' or 'stopped'. opts: { voice, gain, quiz } — quiz plays are answers
  // in a game, so nothing on screen may name them.
  play(id, opts = {}) {
    this.unlock();
    this.stop();
    const token = ++this.token;
    const voice = opts.voice && this.has(id, opts.voice) ? opts.voice : this.resolve(id);
    const clip = this.data(id, voice) || {};
    const gain = (opts.gain != null ? opts.gain : 1) * (clip.gain || 1);
    const meta = { voice, quiz: !!opts.quiz, seq: opts.seq || null };
    this._show(id, voice);            // redraw in this voice before the sound starts
    return new Promise((resolve) => {
      const c = this.context();
      const viaElement = () => {
        if (!this.el) return resolve('error');
        const el = this.el;
        el.src = this.url(id, voice);
        el.volume = Math.min(1, gain / 2);
        el.currentTime = 0;
        this.cur = { id, el, token, resolve, startAt: performance.now() / 1000, ...meta };
        el.onended = () => this._end(token);
        el.play().catch(() => { this._end(token, 'error'); });
      };
      if (!c) return viaElement();
      const go = () => this.load(id, voice).then(buf => {
        if (token !== this.token) return resolve('stopped');
        const src = c.createBufferSource();
        src.buffer = buf;
        const g = c.createGain();
        g.gain.value = gain;
        src.connect(g); g.connect(c.destination);
        const startAt = c.currentTime + 0.03;
        this.cur = { id, src, token, resolve, startAt, dur: buf.duration, ...meta };
        src.onended = () => this._end(token);
        src.start(startAt);
      }).catch(() => { if (token === this.token) viaElement(); });
      if (c.state !== 'running') c.resume().then(go, go); else go();
    });
  }

  // Play several clips with a gap between them. Resolves when all done or interrupted.
  // Items are ids or { id, voice }.
  async sequence(items, gap = 0.35, opts = {}) {
    for (let i = 0; i < items.length; i++) {
      const it = typeof items[i] === 'string' ? { id: items[i] } : items[i];
      const r = await this.play(it.id, { ...opts, voice: it.voice || opts.voice, seq: opts.seq ? { ...opts.seq, i, n: items.length } : null });
      if (r !== 'ended') return r;
      if (i < items.length - 1) {
        const tok = this.token;
        await new Promise(res => setTimeout(res, (it.gap != null ? it.gap : gap) * 1000));
        if (tok !== this.token) return 'stopped';
      }
    }
    return 'ended';
  }

  // The same clip `times` times in each voice that recorded it, the chosen voice first.
  everyVoice(id, times = 2) {
    const vs = this.voicesOf(id).sort((a, b) => (b === this._voice) - (a === this._voice));
    const items = [];
    vs.forEach((v, vi) => { for (let k = 0; k < times; k++) items.push({ id, voice: v, gap: k === times - 1 && vi < vs.length - 1 ? 0.9 : 0.45 }); });
    return this.sequence(items, 0.45, { seq: { kind: 'every', id } });
  }

  _end(token, why = 'ended') {
    if (!this.cur || this.cur.token !== token) return;
    const cur = this.cur;
    this.cur = null;
    this._emit({ id: cur.id, voice: cur.voice, t: -1, playing: false, ended: why === 'ended', seq: cur.seq });
    if (cur.resolve) cur.resolve(why);
    // the pictures keep the voice that just spoke until the clip plays again
  }

  time() {
    const cur = this.cur;
    if (!cur) return -1;
    if (cur.src) return Math.max(0, this.ctx.currentTime - cur.startAt);
    if (cur.el) return cur.el.currentTime || 0;
    return -1;
  }

  playingId() { return this.cur ? this.cur.id : null; }
  playing() { return this.cur ? { id: this.cur.id, voice: this.cur.voice, quiz: this.cur.quiz, seq: this.cur.seq } : null; }

  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn); }
  _emit(state) { this.subs.forEach(f => { try { f(state); } catch (e) { console.error(e); } }); }
  _tick() {
    if (!this.cur) return;
    this._emit({ id: this.cur.id, voice: this.cur.voice, t: this.time(), playing: true, quiz: this.cur.quiz, seq: this.cur.seq });
  }
}

export const engine = new Engine();
// The measurements for a clip, in the voice its pictures should show right now.
export const clip = (id) => engine.data(id);
export default engine;
