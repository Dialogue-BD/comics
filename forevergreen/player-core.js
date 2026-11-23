(() => {
  "use strict";

  function createPlayer(options) {
    const story = options.story;
    const timings = options.timings || { durations: {} };
    const mount = options.mount;
    const fallbackAudio = options.audio || document.createElement("audio");
    const callbacks = options.callbacks || {};

    const AudioCtx = window.AudioContext || window.webkitAudioContext || null;

    const state = {
      sourceMode: "video",
      localFileName: "",
      dataSaver: options.dataSaver === true,
      pacingMode: options.pacingMode === "acts" ? "acts" : "full",
      voiceoverEnabled: !!options.voiceoverEnabled,
      filmVolume: Number.isFinite(options.filmVolume) ? options.filmVolume : 75,
      duckVolume: Number.isFinite(options.duckVolume) ? options.duckVolume : 20,
      voiceVolume: Number.isFinite(options.voiceVolume) ? options.voiceVolume : 100,
      voiceRate: Number.isFinite(options.voiceRate) ? options.voiceRate : 1.0,
      activeActId: 1,
      currentBeatId: null,
      ready: false,
      playing: false,
      currentTime: 0,
      audioUnlocked: false,
      audioBlocked: false,
      storyEndFired: false,
      actBoundaryFiredId: null
    };

    const spokenIds = new Set();
    const bufferCache = new Map();
    const pendingDecode = new Map();
    const phraseBufferCache = new Map();
    const pendingPhraseDecode = new Map();
    const phraseFallbackAudio = document.createElement("audio");

    let video = null;
    let localObjectUrl = "";
    let audioCtx = null;
    let voiceGain = null;
    let activeSource = null;
    let activePhraseSource = null;
    let activeBeat = null;
    let activeStartCtxTime = 0;
    let activeOffsetSec = 0;
    let activeDurationSec = 0;
    let pausedBeat = null;
    let pausedOffsetSec = 0;
    let standalonePlaying = false;
    let isBeatPlaying = false;
    let playToken = 0;
    let phrasePlayToken = 0;

    let tickTimer = 0;
    let wordRaf = 0;
    let volumeTimer = 0;
    let currentFilmVol = state.filmVolume;

    function emit(name, ...args) {
      if (typeof callbacks[name] === "function") callbacks[name](...args);
    }

    function getAct(actId) {
      return story.acts.find((a) => a.id === actId) || story.acts[0];
    }

    function getActAtTime(sec) {
      for (let i = story.acts.length - 1; i >= 0; i--) {
        if (sec >= story.acts[i].start - 0.5) return story.acts[i];
      }
      return story.acts[0];
    }

    function getBeat(beatId) {
      return story.beats.find((b) => b.id === beatId) || null;
    }

    function getBeatDuration(beat) {
      if (!beat) return 4;
      const buf = bufferCache.get(beat.id);
      if (buf && buf.duration > 0) return buf.duration;
      if (Number.isFinite(fallbackAudio.duration) && activeBeat && activeBeat.id === beat.id && fallbackAudio.duration > 0) {
        return fallbackAudio.duration;
      }
      return timings.durations[beat.id] || 4.0;
    }

    function effectiveFilmVolume() {
      return state.voiceoverEnabled ? state.filmVolume : 100;
    }

    function safeSetFilmVolume(targetVol) {
      const clamped = Math.max(0, Math.min(100, Math.round(targetVol)));
      if (!video) return;
      try {
        video.volume = clamped / 100;
      } catch (_) {}
    }

    function rampFilmVolume(targetVol, durationMs = 240) {
      clearInterval(volumeTimer);
      if (!video) {
        currentFilmVol = targetVol;
        return;
      }
      const startVol = currentFilmVol;
      if (Math.abs(startVol - targetVol) < 2) {
        currentFilmVol = targetVol;
        safeSetFilmVolume(targetVol);
        return;
      }
      const steps = Math.max(1, Math.round(durationMs / 35));
      let step = 0;
      volumeTimer = setInterval(() => {
        step++;
        const ratio = Math.min(1, step / steps);
        currentFilmVol = startVol + (targetVol - startVol) * ratio;
        safeSetFilmVolume(currentFilmVol);
        if (ratio >= 1) clearInterval(volumeTimer);
      }, 35);
    }

    function ensureAudioContext() {
      if (!AudioCtx) return null;
      if (!audioCtx) {
        audioCtx = new AudioCtx();
        voiceGain = audioCtx.createGain();
        voiceGain.gain.value = state.voiceVolume / 100;
        voiceGain.connect(audioCtx.destination);
      }
      return audioCtx;
    }

    function unlockAudio() {
      const ctx = ensureAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().then(() => {
          state.audioUnlocked = true;
          if (state.audioBlocked) {
            state.audioBlocked = false;
            emit("onAudioBlocked", false);
          }
        }).catch(() => {});
      } else if (ctx) {
        state.audioUnlocked = true;
      }
    }

    function fetchAndDecodeBeat(beat) {
      if (!beat) return Promise.resolve(null);
      if (bufferCache.has(beat.id)) return Promise.resolve(bufferCache.get(beat.id));
      if (pendingDecode.has(beat.id)) return pendingDecode.get(beat.id);

      const url = beat.audio + "?v=" + encodeURIComponent(story.version || "1");
      const job = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .then((arr) => {
          const ctx = ensureAudioContext();
          if (!ctx) return null;
          return ctx.decodeAudioData(arr);
        })
        .then((decoded) => {
          if (decoded) bufferCache.set(beat.id, decoded);
          pendingDecode.delete(beat.id);
          return decoded;
        })
        .catch(() => {
          pendingDecode.delete(beat.id);
          return null;
        });

      pendingDecode.set(beat.id, job);
      return job;
    }

    function preloadActBeats(actId) {
      const targetActId = actId || state.activeActId;
      story.beats.forEach((b) => {
        if (b.act === targetActId || b.act === targetActId + 1) {
          fetchAndDecodeBeat(b);
        }
      });
    }

    function preloadAllBeats() {
      story.beats.forEach((b) => fetchAndDecodeBeat(b));
    }

    function stopActiveSource(clearPaused = true) {
      playToken++;
      cancelAnimationFrame(wordRaf);
      wordRaf = 0;
      isBeatPlaying = false;
      standalonePlaying = false;

      if (activeSource) {
        try {
          activeSource.onended = null;
          activeSource.stop();
        } catch (_) {}
        activeSource = null;
      }
      try {
        fallbackAudio.pause();
      } catch (_) {}

      if (clearPaused) {
        pausedBeat = null;
        pausedOffsetSec = 0;
      }
    }

    function stopBeatAudio(restoreVolume = true) {
      stopActiveSource(true);
      if (restoreVolume) {
        rampFilmVolume(effectiveFilmVolume(), 260);
      }
    }

    function resetSpokenFrom(sec) {
      story.beats.forEach((b) => {
        if (b.start >= sec - 0.5) spokenIds.delete(b.id);
      });
    }

    function startWordProgressLoop(beat, durationSec, initialOffsetSec = 0) {
      cancelAnimationFrame(wordRaf);
      const startCtx = audioCtx ? audioCtx.currentTime : performance.now() / 1000;
      const run = () => {
        if (!isBeatPlaying || !activeBeat || activeBeat.id !== beat.id) return;
        const now = audioCtx ? audioCtx.currentTime : performance.now() / 1000;
        const elapsed = initialOffsetSec + Math.max(0, (now - startCtx) * state.voiceRate);
        const progress = durationSec > 0 ? Math.max(0, Math.min(1, elapsed / durationSec)) : 0;
        emit("onBeatProgress", beat, progress, true);
        if (progress < 1) {
          wordRaf = requestAnimationFrame(run);
        }
      };
      wordRaf = requestAnimationFrame(run);
    }

    function playFallbackAudioElement(beat, { standalone = false } = {}) {
      const token = ++playToken;
      activeBeat = beat;
      state.currentBeatId = beat.id;
      standalonePlaying = standalone;
      isBeatPlaying = true;
      emit("onBeatChange", beat);

      if (!standalone && state.voiceoverEnabled) {
        rampFilmVolume(state.duckVolume, 180);
      }

      fallbackAudio.src = beat.audio + "?v=" + encodeURIComponent(story.version || "1");
      fallbackAudio.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
      fallbackAudio.playbackRate = state.voiceRate;

      const p = fallbackAudio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          if (token !== playToken) return;
          state.audioUnlocked = true;
          if (state.audioBlocked) {
            state.audioBlocked = false;
            emit("onAudioBlocked", false);
          }
          startWordProgressLoop(beat, getBeatDuration(beat), 0);
        }).catch((err) => {
          if (token !== playToken) return;
          isBeatPlaying = false;
          if (err && err.name === "NotAllowedError") {
            state.audioBlocked = true;
            emit("onAudioBlocked", true, beat);
            rampFilmVolume(effectiveFilmVolume(), 220);
          }
        });
      }
    }

    fallbackAudio.addEventListener("ended", () => {
      cancelAnimationFrame(wordRaf);
      isBeatPlaying = false;
      standalonePlaying = false;
      if (activeBeat) emit("onBeatProgress", activeBeat, 1, false);
      rampFilmVolume(effectiveFilmVolume(), 320);
    });

    async function playBeatClip(beat, { standalone = false, offsetSec = 0 } = {}) {
      if (!beat) return;
      stopActiveSource(true);

      const token = ++playToken;
      activeBeat = beat;
      state.currentBeatId = beat.id;
      standalonePlaying = standalone;
      emit("onBeatChange", beat);

      const ctx = ensureAudioContext();
      if (!ctx) {
        playFallbackAudioElement(beat, { standalone });
        return;
      }

      if (!standalone && state.voiceoverEnabled) {
        rampFilmVolume(state.duckVolume, 180);
      }

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
          state.audioUnlocked = true;
          if (state.audioBlocked) {
            state.audioBlocked = false;
            emit("onAudioBlocked", false);
          }
        } catch (_) {
          if (token !== playToken) return;
          state.audioBlocked = true;
          emit("onAudioBlocked", true, beat);
          rampFilmVolume(effectiveFilmVolume(), 220);
          return;
        }
      }

      const buffer = await fetchAndDecodeBeat(beat);
      if (token !== playToken) return;
      if (!buffer) {
        playFallbackAudioElement(beat, { standalone });
        return;
      }
      if (!standalone && (!state.playing || !state.voiceoverEnabled)) {
        rampFilmVolume(effectiveFilmVolume(), 200);
        return;
      }

      const safeOffset = Math.max(0, Math.min(buffer.duration - 0.05, offsetSec));
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = state.voiceRate;
      voiceGain.gain.value = Math.max(0, Math.min(1, state.voiceVolume / 100));
      src.connect(voiceGain);

      activeSource = src;
      activeStartCtxTime = ctx.currentTime;
      activeOffsetSec = safeOffset;
      activeDurationSec = buffer.duration;
      isBeatPlaying = true;

      src.onended = () => {
        if (activeSource !== src) return;
        activeSource = null;
        isBeatPlaying = false;
        standalonePlaying = false;
        cancelAnimationFrame(wordRaf);
        emit("onBeatProgress", beat, 1, false);
        rampFilmVolume(effectiveFilmVolume(), 320);
      };

      src.start(0, safeOffset);
      startWordProgressLoop(beat, buffer.duration, safeOffset);
    }

    function pauseActiveBeat() {
      if (!isBeatPlaying || !activeBeat) return;
      const beat = activeBeat;
      const elapsed = audioCtx
        ? activeOffsetSec + Math.max(0, (audioCtx.currentTime - activeStartCtxTime) * state.voiceRate)
        : 0;
      const dur = activeDurationSec || getBeatDuration(beat);
      stopActiveSource(false);
      if (elapsed > 0.05 && elapsed < dur - 0.15) {
        pausedBeat = beat;
        pausedOffsetSec = elapsed;
      } else {
        pausedBeat = null;
        pausedOffsetSec = 0;
      }
    }

    function retryBlockedAudio() {
      state.audioBlocked = false;
      emit("onAudioBlocked", false);
      unlockAudio();
      if (activeBeat) {
        playBeatClip(activeBeat, { standalone: !state.playing });
      }
    }

    function syncCaptionToTime(sec) {
      let latest = null;
      for (let i = 0; i < story.beats.length; i++) {
        if (story.beats[i].start <= sec + 0.3) latest = story.beats[i];
      }
      if (latest && latest.id !== state.currentBeatId) {
        activeBeat = latest;
        state.currentBeatId = latest.id;
        emit("onBeatChange", latest);
        emit("onBeatProgress", latest, 0, false);
      }
    }

    function tick() {
      if (!video || !state.ready) return;
      const sec = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      state.currentTime = sec;
      emit("onTimeUpdate", sec);

      const actNow = getActAtTime(sec);
      if (state.pacingMode === "full" && actNow.id !== state.activeActId) {
        state.activeActId = actNow.id;
        preloadActBeats(actNow.id);
        emit("onActChange", actNow);
      }

      if (state.pacingMode === "acts") {
        const currentAct = getAct(state.activeActId);
        if (sec >= currentAct.end && state.actBoundaryFiredId !== currentAct.id) {
          state.actBoundaryFiredId = currentAct.id;
          try { video.pause(); } catch (_) {}
          stopBeatAudio(true);
          emit("onActBoundary", currentAct);
          return;
        }
      } else if (sec >= story.storyEndSec && !state.storyEndFired) {
        state.storyEndFired = true;
        emit("onStoryEnd");
      }

      if (state.voiceoverEnabled && state.playing && !isBeatPlaying && !pausedBeat) {
        for (let i = 0; i < story.beats.length; i++) {
          const beat = story.beats[i];
          if (sec >= beat.start && sec < beat.start + 3.0 && !spokenIds.has(beat.id)) {
            spokenIds.add(beat.id);
            playBeatClip(beat, { standalone: false });
            break;
          }
        }
      } else if (!state.voiceoverEnabled) {
        syncCaptionToTime(sec);
      }
    }

    function startTick() {
      if (tickTimer) return;
      tickTimer = setInterval(tick, 100);
    }

    function stopTick() {
      clearInterval(tickTimer);
      tickTimer = 0;
    }

    function cleanupObjectUrl() {
      if (localObjectUrl) {
        URL.revokeObjectURL(localObjectUrl);
        localObjectUrl = "";
      }
    }

    function mountVideo(src, { mode = "video", name = "Local HD Film" } = {}) {
      if (!mount) return;
      stopTick();
      stopBeatAudio(false);
      if (video) {
        try { video.pause(); } catch (_) {}
        video.removeAttribute("src");
        video = null;
      }

      state.sourceMode = mode;
      state.localFileName = name;
      state.ready = false;
      state.playing = false;
      state.currentTime = 0;
      state.storyEndFired = false;
      state.actBoundaryFiredId = null;

      mount.innerHTML = "";
      const el = document.createElement("video");
      el.id = options.videoId || "film-video";
      el.className = "film-video";
      el.src = src;
      el.controls = true;
      el.playsInline = true;
      el.preload = "metadata";
      el.volume = effectiveFilmVolume() / 100;
      currentFilmVol = effectiveFilmVolume();
      video = el;
      mount.appendChild(el);

      el.addEventListener("loadedmetadata", () => {
        state.ready = true;
        safeSetFilmVolume(effectiveFilmVolume());
        preloadActBeats(state.activeActId);
        emit("onReady");
      });

      el.addEventListener("play", () => {
        unlockAudio();
        state.playing = true;
        startTick();
        if (state.voiceoverEnabled && pausedBeat) {
          const resumeBeat = pausedBeat;
          const resumeOffset = pausedOffsetSec;
          pausedBeat = null;
          pausedOffsetSec = 0;
          playBeatClip(resumeBeat, { standalone: false, offsetSec: resumeOffset });
        } else if (!isBeatPlaying) {
          rampFilmVolume(effectiveFilmVolume(), 200);
        }
        emit("onPlayState", true);
      });

      el.addEventListener("pause", () => {
        state.playing = false;
        stopTick();
        if (!standalonePlaying) {
          pauseActiveBeat();
          rampFilmVolume(effectiveFilmVolume(), 200);
        }
        emit("onPlayState", false);
      });

      el.addEventListener("seeking", () => {
        if (!standalonePlaying) stopBeatAudio(true);
      });

      el.addEventListener("seeked", () => {
        const sec = el.currentTime || 0;
        state.currentTime = sec;
        resetSpokenFrom(sec);
        state.actBoundaryFiredId = null;
        if (sec < story.storyEndSec - 3) state.storyEndFired = false;
        syncCaptionToTime(sec);
        emit("onTimeUpdate", sec);
      });

      el.addEventListener("ended", () => {
        state.playing = false;
        stopTick();
        stopBeatAudio(true);
        emit("onPlayState", false);
        if (!state.storyEndFired) {
          state.storyEndFired = true;
          emit("onStoryEnd");
        }
      });

      emit("onSourceChange", { mode, name });
    }

    function useDefaultVideo(preservePosition = false) {
      const position = preservePosition && video ? video.currentTime : 0;
      const resume = preservePosition && video && !video.paused;
      cleanupObjectUrl();
      const file = state.dataSaver ? story.dataSaverVideoSrc : story.videoSrc;
      const src = `${file}?v=${encodeURIComponent(story.version || "1")}`;
      mountVideo(src, { mode: "video", name: "Forevergreen MP4" });
      if (position > 0) seekTo(position, false);
      if (resume) play();
    }

    function setDataSaver(enabled) {
      if (state.dataSaver === enabled) return;
      state.dataSaver = enabled;
      useDefaultVideo(true);
    }

    function loadLocalFile(file) {
      if (!file) return;
      unlockAudio();
      cleanupObjectUrl();
      localObjectUrl = URL.createObjectURL(file);
      mountVideo(localObjectUrl, { mode: "local", name: file.name || "Custom MP4" });
    }

    function play() {
      unlockAudio();
      if (video) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }

    function pause() {
      if (video) {
        try { video.pause(); } catch (_) {}
      }
      stopBeatAudio(true);
    }

    function togglePlay() {
      unlockAudio();
      if (state.playing) pause();
      else play();
    }

    function seekTo(sec, autoPlay = true) {
      unlockAudio();
      const clamped = Math.max(0, Math.min(story.duration, sec));
      stopBeatAudio(true);
      resetSpokenFrom(clamped);
      state.currentTime = clamped;
      state.actBoundaryFiredId = null;
      if (clamped < story.storyEndSec - 3) state.storyEndFired = false;
      syncCaptionToTime(clamped);

      if (video) {
        video.currentTime = clamped;
        if (autoPlay) play();
      }
      emit("onTimeUpdate", clamped);
    }

    function playAct(actId, autoPlay = true) {
      const act = getAct(actId);
      state.activeActId = act.id;
      preloadActBeats(act.id);
      emit("onActChange", act);
      seekTo(act.start, autoPlay);
    }

    function jumpToBeat(beatId, { standaloneIfPaused = true } = {}) {
      const beat = getBeat(beatId);
      if (!beat) return;
      unlockAudio();
      state.activeActId = beat.act;
      preloadActBeats(beat.act);
      emit("onActChange", getAct(beat.act));
      if (video && state.ready) {
        seekTo(beat.start, true);
      } else if (standaloneIfPaused) {
        playBeatClip(beat, { standalone: true });
      }
    }

    function replayCurrentBeat() {
      unlockAudio();
      const beat = activeBeat || getBeat(state.currentBeatId) || story.beats[0];
      if (!beat) return;
      if (video && state.ready && state.playing) {
        seekTo(beat.start, true);
      } else {
        playBeatClip(beat, { standalone: true });
      }
    }

    function seekRelative(deltaSec) {
      const base = video && Number.isFinite(video.currentTime) ? video.currentTime : state.currentTime;
      seekTo(base + deltaSec, true);
    }

    function setPacingMode(mode) {
      state.pacingMode = mode === "acts" ? "acts" : "full";
      state.actBoundaryFiredId = null;
      emit("onPacingChange", state.pacingMode);
    }

    function setVoiceover(enabled) {
      state.voiceoverEnabled = !!enabled;
      if (state.voiceoverEnabled) {
        unlockAudio();
        preloadAllBeats();
        const cur = video && Number.isFinite(video.currentTime) ? video.currentTime : state.currentTime;
        resetSpokenFrom(cur);
      } else {
        stopBeatAudio(false);
      }
      rampFilmVolume(effectiveFilmVolume(), 220);
      emit("onVoiceoverChange", state.voiceoverEnabled);
    }

    function setMix(next = {}) {
      if (Number.isFinite(next.filmVolume)) state.filmVolume = Math.max(0, Math.min(100, next.filmVolume));
      if (Number.isFinite(next.duckVolume)) state.duckVolume = Math.max(0, Math.min(100, next.duckVolume));
      if (Number.isFinite(next.voiceVolume)) {
        state.voiceVolume = Math.max(0, Math.min(100, next.voiceVolume));
        if (voiceGain) voiceGain.gain.value = state.voiceVolume / 100;
        fallbackAudio.volume = state.voiceVolume / 100;
      }
      if (Number.isFinite(next.voiceRate)) {
        state.voiceRate = Math.max(0.7, Math.min(1.25, next.voiceRate));
        if (activeSource) {
          try { activeSource.playbackRate.value = state.voiceRate; } catch (_) {}
        }
        fallbackAudio.playbackRate = state.voiceRate;
      }
      if (!isBeatPlaying) {
        rampFilmVolume(effectiveFilmVolume(), 160);
      } else if (state.voiceoverEnabled) {
        rampFilmVolume(state.duckVolume, 160);
      }
    }

    function stopPhraseAudio() {
      phrasePlayToken++;
      if (activePhraseSource) {
        try {
          activePhraseSource.onended = null;
          activePhraseSource.stop();
        } catch (_) {}
        activePhraseSource = null;
      }
      try {
        phraseFallbackAudio.pause();
        phraseFallbackAudio.currentTime = 0;
      } catch (_) {}
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
    }

    function resolvePhraseAudioUrl(phrase) {
      const clean = String(phrase || "").trim();
      const map = timings.phraseAudio || {};
      let rel = map[clean];
      if (!rel && clean) {
        const lower = clean.toLowerCase();
        const foundKey = Object.keys(map).find((k) => k.toLowerCase() === lower);
        if (foundKey) rel = map[foundKey];
      }
      return rel ? rel + "?v=" + encodeURIComponent(story.version || "1") : "";
    }

    function fetchAndDecodeUrl(url, cache, pending) {
      if (!url) return Promise.resolve(null);
      if (cache.has(url)) return Promise.resolve(cache.get(url));
      if (pending.has(url)) return pending.get(url);

      const job = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .then((arr) => {
          const ctx = ensureAudioContext();
          if (!ctx) return null;
          return ctx.decodeAudioData(arr);
        })
        .then((decoded) => {
          if (decoded) cache.set(url, decoded);
          pending.delete(url);
          return decoded;
        })
        .catch(() => {
          pending.delete(url);
          return null;
        });

      pending.set(url, job);
      return job;
    }

    function playPhraseFallback(url, phrase, token) {
      if (token !== phrasePlayToken) return;
      phraseFallbackAudio.src = url;
      phraseFallbackAudio.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
      phraseFallbackAudio.playbackRate = state.voiceRate;
      const p = phraseFallbackAudio.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          if (token === phrasePlayToken) speakText(phrase);
        });
      }
    }

    async function playAudioUrl(relPath, fallbackText) {
      const cleanRel = String(relPath || "").trim();
      const fallback = String(fallbackText || "").trim();
      if (!cleanRel) {
        if (fallback) speakText(fallback);
        return;
      }

      const url = cleanRel + "?v=" + encodeURIComponent(story.version || "1");
      stopPhraseAudio();
      const token = phrasePlayToken;
      unlockAudio();

      const ctx = ensureAudioContext();
      if (!ctx) {
        playPhraseFallback(url, fallback, token);
        return;
      }

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch (_) {
          if (token === phrasePlayToken) playPhraseFallback(url, fallback, token);
          return;
        }
      }

      const buffer = await fetchAndDecodeUrl(url, phraseBufferCache, pendingPhraseDecode);
      if (token !== phrasePlayToken) return;
      if (!buffer) {
        playPhraseFallback(url, fallback, token);
        return;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = state.voiceRate;
      voiceGain.gain.value = Math.max(0, Math.min(1, state.voiceVolume / 100));
      src.connect(voiceGain);
      activePhraseSource = src;
      src.onended = () => {
        if (activePhraseSource === src) activePhraseSource = null;
      };
      try {
        src.start(0);
      } catch (_) {
        if (activePhraseSource === src) activePhraseSource = null;
        playPhraseFallback(url, fallback, token);
      }
    }

    async function speakPhrase(phrase) {
      const clean = String(phrase || "").trim();
      if (!clean) return;
      const map = timings.phraseAudio || {};
      let rel = map[clean];
      if (!rel) {
        const lower = clean.toLowerCase();
        const foundKey = Object.keys(map).find((k) => k.toLowerCase() === lower);
        if (foundKey) rel = map[foundKey];
      }
      await playAudioUrl(rel, clean);
    }

    async function speakWord(word) {
      const clean = String(word || "").trim();
      if (!clean) return;
      const map = timings.wordAudio || {};
      const lower = clean.toLowerCase();
      const norm = lower.replace(/’/g, "'");
      const rel = map[lower] || map[norm] || map[lower.replace(/'/g, "’")] || "";
      await playAudioUrl(rel, clean);
    }

    function speakText(text) {
      const clean = String(text || "").trim();
      if (!clean) return;
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(clean);
          u.lang = "en-GB";
          u.rate = 0.92;
          u.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
          window.speechSynthesis.speak(u);
        } catch (_) {}
      }
    }

    useDefaultVideo();

    return {
      play,
      pause,
      togglePlay,
      seekTo,
      seekRelative,
      playAct,
      jumpToBeat,
      replayCurrentBeat,
      playBeatStandalone: (beatId) => playBeatClip(getBeat(beatId), { standalone: true }),
      setPacingMode,
      setDataSaver,
      setVoiceover,
      setMix,
      speakPhrase,
      speakWord,
      speakText,
      playAudioUrl,
      stopAudioOverlays: stopPhraseAudio,
      getVideoElement: () => video,
      unlockAudio,
      retryBlockedAudio,
      loadLocalFile,
      useDefaultVideo,
      getState: () => ({
        ...state,
        ytPlaying: state.playing,
        ytTime: state.currentTime
      }),
      destroy: () => {
        stopTick();
        stopBeatAudio(false);
        stopPhraseAudio();
        clearInterval(volumeTimer);
        cleanupObjectUrl();
      }
    };
  }

  window.ForevergreenPlayer = { create: createPlayer };
})();
