// One player for the whole activity: only one recording ever plays at a time.
// Web Audio first (sample-accurate clock for the visuals), <audio> as fallback.
import { gsap } from 'gsap';
import CLIPS from '../data/clips.json';

const AC = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;

class Engine {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.loading = new Map();
    this.cur = null;          // { id, src, startAt, token, el }
    this.token = 0;
    this.subs = new Set();
    this.unlocked = false;
    this.unlockSubs = new Set();
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

  url(id) { return `audio/${id}.mp3`; }

  load(id) {
    if (this.buffers.has(id)) return Promise.resolve(this.buffers.get(id));
    if (this.loading.has(id)) return this.loading.get(id);
    const c = this.context();
    if (!c) return Promise.reject(new Error('no-webaudio'));
    const p = fetch(this.url(id))
      .then(r => { if (!r.ok) throw new Error('audio ' + r.status); return r.arrayBuffer(); })
      .then(buf => new Promise((res, rej) => c.decodeAudioData(buf, res, rej)))
      .then(b => { this.buffers.set(id, b); this.loading.delete(id); return b; })
      .catch(e => { this.loading.delete(id); throw e; });
    this.loading.set(id, p);
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
      this._emit({ id: cur.id, t: -1, playing: false, ended: false });
    }
  }

  // Resolves 'ended' or 'stopped'.
  play(id, opts = {}) {
    this.unlock();
    this.stop();
    const token = ++this.token;
    const clip = CLIPS[id] || {};
    const gain = (opts.gain != null ? opts.gain : 1) * (clip.gain || 1);
    return new Promise((resolve) => {
      const c = this.context();
      const viaElement = () => {
        if (!this.el) return resolve('error');
        const el = this.el;
        el.src = this.url(id);
        el.volume = Math.min(1, gain / 2);
        el.currentTime = 0;
        this.cur = { id, el, token, resolve, startAt: performance.now() / 1000 };
        el.onended = () => this._end(token);
        el.play().catch(() => { this._end(token, 'error'); });
      };
      if (!c) return viaElement();
      const go = () => this.load(id).then(buf => {
        if (token !== this.token) return resolve('stopped');
        const src = c.createBufferSource();
        src.buffer = buf;
        const g = c.createGain();
        g.gain.value = gain;
        src.connect(g); g.connect(c.destination);
        const startAt = c.currentTime + 0.03;
        this.cur = { id, src, token, resolve, startAt, dur: buf.duration };
        src.onended = () => this._end(token);
        src.start(startAt);
      }).catch(() => { if (token === this.token) viaElement(); });
      if (c.state !== 'running') c.resume().then(go, go); else go();
    });
  }

  // Play several clips with a gap between them. Resolves when all done or interrupted.
  async sequence(ids, gap = 0.35) {
    const myToken = this.token + 1;
    for (let i = 0; i < ids.length; i++) {
      const r = await this.play(ids[i]);
      if (r !== 'ended') return r;
      if (i < ids.length - 1) {
        const tok = this.token;
        await new Promise(res => setTimeout(res, gap * 1000));
        if (tok !== this.token) return 'stopped';
      }
    }
    return 'ended';
  }

  _end(token, why = 'ended') {
    if (!this.cur || this.cur.token !== token) return;
    const cur = this.cur;
    this.cur = null;
    this._emit({ id: cur.id, t: -1, playing: false, ended: why === 'ended' });
    if (cur.resolve) cur.resolve(why);
  }

  time() {
    const cur = this.cur;
    if (!cur) return -1;
    if (cur.src) return Math.max(0, this.ctx.currentTime - cur.startAt);
    if (cur.el) return cur.el.currentTime || 0;
    return -1;
  }

  playingId() { return this.cur ? this.cur.id : null; }

  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn); }
  _emit(state) { this.subs.forEach(f => { try { f(state); } catch (e) { console.error(e); } }); }
  _tick() {
    if (!this.cur) return;
    this._emit({ id: this.cur.id, t: this.time(), playing: true });
  }
}

export const engine = new Engine();
export const clip = (id) => CLIPS[id];
export default engine;
