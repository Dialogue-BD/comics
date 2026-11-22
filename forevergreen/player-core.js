(() => {
  "use strict";

  let ytApiPromise = null;

  function loadYouTubeApi() {
    if (window.YT && typeof window.YT.Player === "function") {
      return Promise.resolve(window.YT);
    }
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve) => {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === "function") {
          try { prevReady(); } catch (_) {}
        }
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onerror = () => resolve(null);
      document.head.appendChild(tag);
    });
    return ytApiPromise;
  }

  function createPlayer(options) {
    const story = options.story;
    const timings = options.timings || { durations: {} };
    const mount = options.mount;
    const audio = options.audio || document.createElement("audio");
    const callbacks = options.callbacks || {};

    const state = {
      sourceMode: "youtube",
      localFileName: "",
      pacingMode: options.pacingMode === "acts" ? "acts" : "full",
      voiceoverEnabled: !!options.voiceoverEnabled,
      filmVolume: Number.isFinite(options.filmVolume) ? options.filmVolume : 75,
      duckVolume: Number.isFinite(options.duckVolume) ? options.duckVolume : 20,
      voiceVolume: Number.isFinite(options.voiceVolume) ? options.voiceVolume : 100,
      voiceRate: Number.isFinite(options.voiceRate) ? options.voiceRate : 1.0,
      activeActId: 1,
      currentBeatId: null,
      ytReady: false,
      ytPlaying: false,
      ytTime: 0,
      embedFailed: false,
      audioUnlocked: false,
      audioBlocked: false,
      storyEndFired: false,
      actBoundaryFiredId: null
    };

    const spokenIds = new Set();
    let ytPlayer = null;
    let localVideo = null;
    let localObjectUrl = "";
    let tickTimer = 0;
    let wordRaf = 0;
    let volumeTimer = 0;
    let currentFilmVol = state.filmVolume;
    let lastFilmTime = 0;
    let activeBeat = null;
    let speechUtterance = null;
    let standalonePlaying = false;
    let phraseAudio = null;

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
      if (Number.isFinite(audio.duration) && activeBeat && activeBeat.id === beat.id && audio.duration > 0) {
        return audio.duration;
      }
      return timings.durations[beat.id] || 4.5;
    }

    function isMediaReady() {
      return state.sourceMode === "local" ? !!localVideo : (!!ytPlayer && state.ytReady);
    }

    function safeSetFilmVolume(targetVol) {
      const clamped = Math.max(0, Math.min(100, Math.round(targetVol)));
      if (state.sourceMode === "local" && localVideo) {
        try {
          localVideo.volume = clamped / 100;
        } catch (_) {}
        return;
      }
      if (!ytPlayer || !state.ytReady || typeof ytPlayer.setVolume !== "function") return;
      try {
        ytPlayer.setVolume(clamped);
      } catch (_) {}
    }

    function rampFilmVolume(targetVol, durationMs = 280) {
      clearInterval(volumeTimer);
      if (!isMediaReady()) {
        currentFilmVol = targetVol;
        return;
      }
      const startVol = currentFilmVol;
      if (Math.abs(startVol - targetVol) < 2) {
        currentFilmVol = targetVol;
        safeSetFilmVolume(targetVol);
        return;
      }
      const steps = Math.max(1, Math.round(durationMs / 40));
      let step = 0;
      volumeTimer = setInterval(() => {
        step++;
        const ratio = Math.min(1, step / steps);
        currentFilmVol = startVol + (targetVol - startVol) * ratio;
        safeSetFilmVolume(currentFilmVol);
        if (ratio >= 1) clearInterval(volumeTimer);
      }, 40);
    }

    function effectiveFilmVolume() {
      return state.voiceoverEnabled ? state.filmVolume : 100;
    }

    function stopSpeechFallback() {
      if ("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      speechUtterance = null;
    }

    function stopBeatAudio(restoreVolume = true) {
      cancelAnimationFrame(wordRaf);
      wordRaf = 0;
      standalonePlaying = false;
      try {
        audio.pause();
      } catch (_) {}
      stopSpeechFallback();
      if (restoreVolume) {
        rampFilmVolume(effectiveFilmVolume(), 320);
      }
    }

    function resetSpokenFrom(sec) {
      story.beats.forEach((b) => {
        if (b.start >= sec - 0.5) spokenIds.delete(b.id);
      });
    }

    function updateBeatProgressLoop() {
      cancelAnimationFrame(wordRaf);
      if (!activeBeat) return;
      const run = () => {
        if (!activeBeat) return;
        const dur = getBeatDuration(activeBeat);
        const elapsed = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const progress = dur > 0 ? Math.max(0, Math.min(1, elapsed / dur)) : 0;
        emit("onBeatProgress", activeBeat, progress, !audio.paused);
        if (!audio.paused && !audio.ended) {
          wordRaf = requestAnimationFrame(run);
        }
      };
      wordRaf = requestAnimationFrame(run);
    }

    function fallbackSpeakBeat(beat) {
      if (!("speechSynthesis" in window)) return;
      stopSpeechFallback();
      const u = new SpeechSynthesisUtterance(beat.text);
      u.lang = "en-GB";
      u.rate = state.voiceRate;
      u.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
      u.onend = () => {
        speechUtterance = null;
        if (state.voiceoverEnabled) rampFilmVolume(effectiveFilmVolume(), 340);
        emit("onBeatProgress", beat, 1, false);
      };
      speechUtterance = u;
      rampFilmVolume(state.duckVolume, 220);
      window.speechSynthesis.speak(u);
      emit("onBeatChange", beat);
      emit("onBeatProgress", beat, 0.25, true);
    }

    function playBeatClip(beat, { standalone = false } = {}) {
      if (!beat) return;
      activeBeat = beat;
      state.currentBeatId = beat.id;
      standalonePlaying = standalone;
      stopSpeechFallback();
      emit("onBeatChange", beat);

      if (!standalone && state.voiceoverEnabled) {
        rampFilmVolume(state.duckVolume, 220);
      }

      audio.src = beat.audio + "?v=" + encodeURIComponent(story.version || "1");
      audio.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
      audio.playbackRate = state.voiceRate;
      audio.currentTime = 0;

      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          state.audioUnlocked = true;
          if (state.audioBlocked) {
            state.audioBlocked = false;
            emit("onAudioBlocked", false);
          }
          updateBeatProgressLoop();
        }).catch((err) => {
          if (err && err.name === "NotAllowedError") {
            state.audioBlocked = true;
            emit("onAudioBlocked", true, beat);
            rampFilmVolume(effectiveFilmVolume(), 240);
          } else {
            fallbackSpeakBeat(beat);
          }
        });
      } else {
        updateBeatProgressLoop();
      }
    }

    audio.addEventListener("ended", () => {
      cancelAnimationFrame(wordRaf);
      if (activeBeat) emit("onBeatProgress", activeBeat, 1, false);
      standalonePlaying = false;
      rampFilmVolume(effectiveFilmVolume(), 360);
    });

    audio.addEventListener("error", () => {
      if (activeBeat && (state.voiceoverEnabled || standalonePlaying)) {
        fallbackSpeakBeat(activeBeat);
      }
    });

    function unlockAudio() {
      if (state.audioUnlocked) return;
      state.audioUnlocked = true;
      try {
        audio.muted = true;
        const p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            audio.pause();
            audio.muted = false;
          }).catch(() => {
            audio.muted = false;
          });
        } else {
          audio.muted = false;
        }
      } catch (_) {
        audio.muted = false;
      }
    }

    function retryBlockedAudio() {
      state.audioBlocked = false;
      emit("onAudioBlocked", false);
      if (activeBeat) {
        playBeatClip(activeBeat, { standalone: !state.ytPlaying });
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

    function getCurrentFilmTime() {
      if (state.sourceMode === "local") {
        return localVideo ? localVideo.currentTime : 0;
      }
      if (ytPlayer && state.ytReady && typeof ytPlayer.getCurrentTime === "function") {
        return ytPlayer.getCurrentTime();
      }
      return 0;
    }

    function pauseFilm() {
      if (state.sourceMode === "local") {
        if (localVideo) {
          try { localVideo.pause(); } catch (_) {}
        }
        return;
      }
      if (ytPlayer && state.ytReady && typeof ytPlayer.pauseVideo === "function") {
        try { ytPlayer.pauseVideo(); } catch (_) {}
      }
    }

    function playFilm() {
      if (state.sourceMode === "local") {
        if (localVideo) {
          const p = localVideo.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        }
        return;
      }
      if (ytPlayer && state.ytReady && typeof ytPlayer.playVideo === "function") {
        try { ytPlayer.playVideo(); } catch (_) {}
      }
    }

    function tick() {
      if (!isMediaReady()) return;
      let sec = 0;
      try {
        sec = getCurrentFilmTime();
      } catch (_) {
        return;
      }
      if (!Number.isFinite(sec)) return;
      state.ytTime = sec;

      const jumped = Math.abs(sec - lastFilmTime) > 2.2;
      if (jumped) {
        stopBeatAudio(true);
        resetSpokenFrom(sec);
        state.actBoundaryFiredId = null;
        if (sec < story.storyEndSec - 3) state.storyEndFired = false;
        syncCaptionToTime(sec);
      }
      lastFilmTime = sec;

      emit("onTimeUpdate", sec);

      const actNow = getActAtTime(sec);
      if (state.pacingMode === "full" && actNow.id !== state.activeActId) {
        state.activeActId = actNow.id;
        emit("onActChange", actNow);
      }

      if (state.pacingMode === "acts") {
        const currentAct = getAct(state.activeActId);
        if (sec >= currentAct.end && state.actBoundaryFiredId !== currentAct.id) {
          state.actBoundaryFiredId = currentAct.id;
          pauseFilm();
          stopBeatAudio(true);
          emit("onActBoundary", currentAct);
          return;
        }
      } else if (sec >= story.storyEndSec && !state.storyEndFired) {
        state.storyEndFired = true;
        emit("onStoryEnd");
      }

      if (state.voiceoverEnabled && state.ytPlaying) {
        for (let i = 0; i < story.beats.length; i++) {
          const beat = story.beats[i];
          if (sec >= beat.start && sec <= beat.start + 2.5 && !spokenIds.has(beat.id)) {
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
      tickTimer = setInterval(tick, 120);
    }

    function stopTick() {
      clearInterval(tickTimer);
      tickTimer = 0;
    }

    function cleanupLocalVideo() {
      if (localVideo) {
        try { localVideo.pause(); } catch (_) {}
        localVideo.removeAttribute("src");
        localVideo = null;
      }
      if (localObjectUrl) {
        URL.revokeObjectURL(localObjectUrl);
        localObjectUrl = "";
      }
    }

    function buildEmbed() {
      if (!mount) return;
      cleanupLocalVideo();
      stopTick();
      stopBeatAudio(false);
      state.sourceMode = "youtube";
      state.localFileName = "";
      state.ytReady = false;
      state.ytPlaying = false;
      state.embedFailed = false;
      emit("onSourceChange", { mode: "youtube", name: "YouTube" });

      if (window.location.protocol === "file:") {
        state.embedFailed = true;
        emit("onEmbedFallback", {
          reason: "Open this activity from http://localhost:5000 or dialogue-bd.com so YouTube can verify the page origin, or load your downloaded MP4 file.",
          youtubeUrl: story.credits.youtubeUrl
        });
        return;
      }

      const params = new URLSearchParams({
        enablejsapi: "1",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        iv_load_policy: "3"
      });
      if (/^https?:$/.test(window.location.protocol) && window.location.origin) {
        params.set("origin", window.location.origin);
      }

      mount.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.id = options.iframeId || "yt-player";
      iframe.title = story.title + " — YouTube film player";
      iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(story.youtubeId)}?${params.toString()}`;
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.allowFullscreen = true;
      mount.appendChild(iframe);

      loadYouTubeApi().then((YT) => {
        if (state.sourceMode !== "youtube") return;
        if (!YT || typeof YT.Player !== "function") {
          state.embedFailed = true;
          emit("onEmbedFallback", {
            reason: "YouTube player API did not load. You can still watch on YouTube, load a local MP4, or explore all audio beats below.",
            youtubeUrl: story.credits.youtubeUrl
          });
          return;
        }
        ytPlayer = new YT.Player(iframe.id, {
          events: {
            onReady: () => {
              if (state.sourceMode !== "youtube") return;
              state.ytReady = true;
              safeSetFilmVolume(effectiveFilmVolume());
              currentFilmVol = effectiveFilmVolume();
              emit("onReady");
            },
            onStateChange: (ev) => {
              if (state.sourceMode !== "youtube") return;
              const YTS = YT.PlayerState || { PLAYING: 1, PAUSED: 2, ENDED: 0, BUFFERING: 3 };
              if (ev.data === YTS.PLAYING) {
                state.ytPlaying = true;
                startTick();
                if (!activeBeat || audio.paused) {
                  rampFilmVolume(effectiveFilmVolume(), 240);
                }
                emit("onPlayState", true);
              } else if (ev.data === YTS.PAUSED) {
                state.ytPlaying = false;
                stopTick();
                if (!standalonePlaying) {
                  try { audio.pause(); } catch (_) {}
                  stopSpeechFallback();
                }
                emit("onPlayState", false);
              } else if (ev.data === YTS.ENDED) {
                state.ytPlaying = false;
                stopTick();
                stopBeatAudio(true);
                emit("onPlayState", false);
                if (!state.storyEndFired) {
                  state.storyEndFired = true;
                  emit("onStoryEnd");
                }
              }
            },
            onError: (ev) => {
              if (state.sourceMode !== "youtube") return;
              state.embedFailed = true;
              emit("onEmbedFallback", {
                reason: `YouTube could not play the embedded video here (code ${ev && ev.data ? ev.data : "unknown"}).`,
                youtubeUrl: story.credits.youtubeUrl
              });
            }
          }
        });
      });
    }

    function loadLocalFile(file) {
      if (!file || !mount) return;
      unlockAudio();
      stopTick();
      stopBeatAudio(false);
      if (ytPlayer && typeof ytPlayer.destroy === "function") {
        try { ytPlayer.destroy(); } catch (_) {}
      }
      ytPlayer = null;
      cleanupLocalVideo();

      state.sourceMode = "local";
      state.localFileName = file.name || "Local MP4";
      state.embedFailed = false;
      state.ytReady = false;
      state.ytPlaying = false;
      lastFilmTime = 0;
      state.ytTime = 0;
      state.storyEndFired = false;
      state.actBoundaryFiredId = null;

      localObjectUrl = URL.createObjectURL(file);
      mount.innerHTML = "";
      const video = document.createElement("video");
      video.className = "local-video";
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = localObjectUrl;
      video.volume = effectiveFilmVolume() / 100;
      currentFilmVol = effectiveFilmVolume();
      localVideo = video;
      mount.appendChild(video);

      video.addEventListener("loadedmetadata", () => {
        state.ytReady = true;
        safeSetFilmVolume(effectiveFilmVolume());
        emit("onReady");
      });
      video.addEventListener("play", () => {
        state.ytPlaying = true;
        startTick();
        if (!activeBeat || audio.paused) {
          rampFilmVolume(effectiveFilmVolume(), 240);
        }
        emit("onPlayState", true);
      });
      video.addEventListener("pause", () => {
        state.ytPlaying = false;
        stopTick();
        if (!standalonePlaying) {
          try { audio.pause(); } catch (_) {}
          stopSpeechFallback();
        }
        emit("onPlayState", false);
      });
      video.addEventListener("ended", () => {
        state.ytPlaying = false;
        stopTick();
        stopBeatAudio(true);
        emit("onPlayState", false);
        if (!state.storyEndFired) {
          state.storyEndFired = true;
          emit("onStoryEnd");
        }
      });
      video.addEventListener("seeked", () => {
        const sec = video.currentTime || 0;
        state.ytTime = sec;
        lastFilmTime = sec;
        stopBeatAudio(true);
        resetSpokenFrom(sec);
        state.actBoundaryFiredId = null;
        if (sec < story.storyEndSec - 3) state.storyEndFired = false;
        syncCaptionToTime(sec);
        emit("onTimeUpdate", sec);
      });

      emit("onEmbedCleared");
      emit("onSourceChange", { mode: "local", name: state.localFileName });
    }

    function play() {
      unlockAudio();
      playFilm();
    }

    function pause() {
      pauseFilm();
      stopBeatAudio(true);
    }

    function togglePlay() {
      unlockAudio();
      if (state.ytPlaying) pause();
      else play();
    }

    function seekTo(sec, autoPlay = true) {
      unlockAudio();
      const clamped = Math.max(0, Math.min(story.duration, sec));
      stopBeatAudio(true);
      resetSpokenFrom(clamped);
      lastFilmTime = clamped;
      state.ytTime = clamped;
      state.actBoundaryFiredId = null;
      if (clamped < story.storyEndSec - 3) state.storyEndFired = false;
      syncCaptionToTime(clamped);

      if (state.sourceMode === "local" && localVideo) {
        localVideo.currentTime = clamped;
        if (autoPlay) playFilm();
      } else if (ytPlayer && state.ytReady && typeof ytPlayer.seekTo === "function") {
        ytPlayer.seekTo(clamped, true);
        if (autoPlay) playFilm();
      }
      emit("onTimeUpdate", clamped);
    }

    function playAct(actId, autoPlay = true) {
      const act = getAct(actId);
      state.activeActId = act.id;
      emit("onActChange", act);
      seekTo(act.start, autoPlay);
    }

    function jumpToBeat(beatId, { standaloneIfNoVideo = true } = {}) {
      const beat = getBeat(beatId);
      if (!beat) return;
      unlockAudio();
      state.activeActId = beat.act;
      emit("onActChange", getAct(beat.act));
      if (isMediaReady() && !state.embedFailed) {
        seekTo(beat.start, true);
      } else if (standaloneIfNoVideo) {
        playBeatClip(beat, { standalone: true });
      }
    }

    function replayCurrentBeat() {
      unlockAudio();
      const beat = activeBeat || getBeat(state.currentBeatId) || story.beats[0];
      if (!beat) return;
      if (isMediaReady() && !state.embedFailed && state.ytPlaying) {
        seekTo(beat.start, true);
      } else {
        playBeatClip(beat, { standalone: true });
      }
    }

    function seekRelative(deltaSec) {
      const base = Number.isFinite(state.ytTime) ? state.ytTime : 0;
      seekTo(base + deltaSec, true);
    }

    function setPacingMode(mode) {
      state.pacingMode = mode === "acts" ? "acts" : "full";
      state.actBoundaryFiredId = null;
      emit("onPacingChange", state.pacingMode);
    }

    function setVoiceover(enabled) {
      state.voiceoverEnabled = !!enabled;
      if (!state.voiceoverEnabled) {
        stopBeatAudio(false);
      }
      rampFilmVolume(effectiveFilmVolume(), 240);
      emit("onVoiceoverChange", state.voiceoverEnabled);
    }

    function setMix(next = {}) {
      if (Number.isFinite(next.filmVolume)) state.filmVolume = Math.max(0, Math.min(100, next.filmVolume));
      if (Number.isFinite(next.duckVolume)) state.duckVolume = Math.max(0, Math.min(100, next.duckVolume));
      if (Number.isFinite(next.voiceVolume)) {
        state.voiceVolume = Math.max(0, Math.min(100, next.voiceVolume));
        audio.volume = state.voiceVolume / 100;
      }
      if (Number.isFinite(next.voiceRate)) {
        state.voiceRate = Math.max(0.7, Math.min(1.25, next.voiceRate));
        audio.playbackRate = state.voiceRate;
      }
      if (audio.paused) {
        rampFilmVolume(effectiveFilmVolume(), 180);
      } else if (state.voiceoverEnabled) {
        rampFilmVolume(state.duckVolume, 180);
      }
    }

    function speakPhrase(phraseText) {
      unlockAudio();
      const needle = String(phraseText || "").trim().toLowerCase();
      if (!needle) return;

      if ("speechSynthesis" in window) {
        stopSpeechFallback();
        const u = new SpeechSynthesisUtterance(phraseText);
        u.lang = "en-GB";
        u.rate = 0.92;
        u.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
        window.speechSynthesis.speak(u);
        return;
      }

      const matchBeat = story.beats.find((b) => b.text.toLowerCase().includes(needle));
      if (matchBeat) {
        if (!phraseAudio) phraseAudio = new Audio();
        phraseAudio.src = matchBeat.audio + "?v=" + encodeURIComponent(story.version || "1");
        phraseAudio.volume = Math.max(0, Math.min(1, state.voiceVolume / 100));
        phraseAudio.play().catch(() => {});
      }
    }

    buildEmbed();

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
      setVoiceover,
      setMix,
      speakPhrase,
      unlockAudio,
      retryBlockedAudio,
      loadLocalFile,
      useYouTube: buildEmbed,
      getState: () => ({ ...state }),
      destroy: () => {
        stopTick();
        stopBeatAudio(false);
        clearInterval(volumeTimer);
        cleanupLocalVideo();
      }
    };
  }

  window.ForevergreenPlayer = { create: createPlayer };
})();
