(() => {
  "use strict";

  const S = FOREVERGREEN_STORY;
  const T = typeof FOREVERGREEN_TIMINGS !== "undefined" ? FOREVERGREEN_TIMINGS : { durations: {} };
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const els = {
    projectorShell: $("#projector-shell"),
    cinemaStage: $("#cinema-stage"),
    ytMount: $("#yt-mount"),
    embedFallback: $("#embed-fallback"),
    embedFallbackReason: $("#embed-fallback-reason"),
    embedFallbackLink: $("#embed-fallback-link"),
    fallbackLocalBtn: $("#fallback-local-btn"),
    loadLocalBtn: $("#load-local-btn"),
    useYoutubeBtn: $("#use-youtube-btn"),
    localFileInput: $("#local-file-input"),
    sourceBadge: $("#source-badge"),
    audioUnlockPill: $("#audio-unlock-pill"),
    captionStrip: $("#caption-strip"),
    captionAct: $("#caption-act"),
    captionText: $("#caption-text"),
    boundaryToast: $("#boundary-toast"),
    boundaryMsg: $("#boundary-msg"),
    boundaryContinue: $("#boundary-continue"),
    nurturerDrawer: $("#nurturer-drawer"),
    drawerActLabel: $("#drawer-act-label"),
    drawerActTitle: $("#drawer-act-title"),
    drawerSummary: $("#drawer-summary"),
    drawerCues: $("#drawer-cues"),
    drawerQuestions: $("#drawer-questions"),
    drawerPhrases: $("#drawer-phrases"),
    recastLearner: $("#recast-learner"),
    recastTeacher: $("#recast-teacher"),
    closeDrawer: $("#close-drawer"),
    playPause: $("#play-pause"),
    back10: $("#back-10"),
    actPills: $("#act-pills"),
    pacingToggle: $("#pacing-toggle"),
    voiceToggle: $("#voice-toggle"),
    captionsToggle: $("#captions-toggle"),
    guideToggle: $("#guide-toggle"),
    fullscreenBtn: $("#fullscreen-btn"),
    voiceAudio: $("#voice-audio")
  };

  let currentActId = 1;
  let pacingMode = "full";
  let voiceOn = false;
  let captionsOn = false;
  let guideOpen = false;

  const player = window.ForevergreenPlayer.create({
    story: S,
    timings: T,
    mount: els.ytMount,
    audio: els.voiceAudio,
    pacingMode: "full",
    voiceoverEnabled: false,
    callbacks: {
      onPlayState: (playing) => {
        els.playPause.textContent = playing ? "⏸ Pause" : "▶ Play";
      },
      onActChange: (act) => {
        currentActId = act.id;
        syncActPills();
        renderDrawer(act);
        els.captionAct.textContent = `Act ${act.id}`;
      },
      onBeatChange: (beat) => {
        els.captionAct.textContent = `Act ${beat.act}`;
        els.captionText.textContent = beat.text;
      },
      onActBoundary: (act) => {
        const nextAct = S.acts.find((a) => a.id === act.id + 1);
        els.boundaryMsg.textContent = nextAct
          ? `Paused at end of Act ${act.id}: ${act.title}`
          : "Story complete (credits at 12:00)";
        els.boundaryContinue.textContent = nextAct ? `Continue to Act ${nextAct.id} →` : "Restart Act 1";
        els.boundaryContinue.dataset.nextAct = String(nextAct ? nextAct.id : 1);
        els.boundaryToast.hidden = false;
      },
      onAudioBlocked: (blocked) => {
        els.audioUnlockPill.hidden = !blocked;
      },
      onSourceChange: ({ mode, name }) => {
        els.sourceBadge.textContent = mode === "local" ? `Source: Local MP4 (${name})` : "Source: YouTube";
        els.useYoutubeBtn.hidden = mode !== "local";
      },
      onEmbedFallback: ({ reason, youtubeUrl }) => {
        els.embedFallbackReason.textContent = reason;
        els.embedFallbackLink.href = youtubeUrl || S.credits.youtubeUrl;
        els.embedFallback.hidden = false;
      },
      onEmbedCleared: () => {
        els.embedFallback.hidden = true;
      }
    }
  });

  function renderActPills() {
    els.actPills.innerHTML = "";
    S.acts.forEach((act) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "act-btn";
      btn.dataset.act = String(act.id);
      btn.title = `Jump to Act ${act.id}: ${act.title}`;
      btn.textContent = String(act.id);
      btn.addEventListener("click", () => {
        els.boundaryToast.hidden = true;
        player.playAct(act.id, true);
      });
      els.actPills.appendChild(btn);
    });
    syncActPills();
  }

  function syncActPills() {
    $$(".act-btn", els.actPills).forEach((btn) => {
      const active = Number(btn.dataset.act) === currentActId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderDrawer(act) {
    els.drawerActLabel.textContent = `Act ${act.id} · Teacher Nurturer Guide`;
    els.drawerActTitle.textContent = act.title;
    els.drawerSummary.textContent = act.summary;

    els.drawerCues.innerHTML = "";
    act.teacherNotes.storyCues.forEach((cue) => {
      const li = document.createElement("li");
      li.textContent = cue;
      els.drawerCues.appendChild(li);
    });

    els.drawerQuestions.innerHTML = "";
    act.teacherNotes.nurturerQuestions.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q;
      els.drawerQuestions.appendChild(li);
    });

    els.drawerPhrases.innerHTML = "";
    act.memoryPhrases.forEach((phrase) => {
      const span = document.createElement("span");
      span.className = "drawer-phrase-chip";
      span.textContent = phrase;
      els.drawerPhrases.appendChild(span);
    });

    els.recastLearner.textContent = `Learner: “${act.teacherNotes.recastExample.learner}”`;
    els.recastTeacher.textContent = `Recast: “${act.teacherNotes.recastExample.recast}”`;
  }

  function togglePacing() {
    pacingMode = pacingMode === "full" ? "acts" : "full";
    player.setPacingMode(pacingMode);
    els.boundaryToast.hidden = true;
    const isActs = pacingMode === "acts";
    els.pacingToggle.textContent = isActs ? "Pause at Act End" : "Full Film";
    els.pacingToggle.setAttribute("aria-pressed", isActs ? "true" : "false");
  }

  function toggleVoice() {
    voiceOn = !voiceOn;
    player.unlockAudio();
    player.setVoiceover(voiceOn);
    els.voiceToggle.textContent = voiceOn ? "Storyteller Voice: On" : "Storyteller Voice: Off";
    els.voiceToggle.setAttribute("aria-pressed", voiceOn ? "true" : "false");
  }

  function toggleCaptions() {
    captionsOn = !captionsOn;
    els.captionStrip.hidden = !captionsOn;
    els.captionsToggle.textContent = captionsOn ? "Captions: On" : "Captions: Off";
    els.captionsToggle.setAttribute("aria-pressed", captionsOn ? "true" : "false");
  }

  function setGuide(open) {
    guideOpen = !!open;
    els.nurturerDrawer.hidden = !guideOpen;
    els.projectorShell.classList.toggle("drawer-open", guideOpen);
    els.guideToggle.setAttribute("aria-pressed", guideOpen ? "true" : "false");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  els.playPause.addEventListener("click", () => player.togglePlay());
  els.back10.addEventListener("click", () => player.seekRelative(-10));
  els.pacingToggle.addEventListener("click", togglePacing);
  els.voiceToggle.addEventListener("click", toggleVoice);
  els.captionsToggle.addEventListener("click", toggleCaptions);
  els.guideToggle.addEventListener("click", () => setGuide(!guideOpen));
  els.closeDrawer.addEventListener("click", () => setGuide(false));
  els.fullscreenBtn.addEventListener("click", toggleFullscreen);

  els.boundaryContinue.addEventListener("click", () => {
    els.boundaryToast.hidden = true;
    player.playAct(Number(els.boundaryContinue.dataset.nextAct || 1), true);
  });

  els.audioUnlockPill.addEventListener("click", () => {
    player.unlockAudio();
    player.retryBlockedAudio();
  });

  [els.loadLocalBtn, els.fallbackLocalBtn].forEach((btn) => {
    btn.addEventListener("click", () => els.localFileInput.click());
  });
  els.localFileInput.addEventListener("change", () => {
    const file = els.localFileInput.files && els.localFileInput.files[0];
    if (file) player.loadLocalFile(file);
  });
  els.useYoutubeBtn.addEventListener("click", () => player.useYouTube());

  document.addEventListener("fullscreenchange", () => {
    els.fullscreenBtn.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
  });

  document.addEventListener("keydown", (ev) => {
    const tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ev.target && ev.target.isContentEditable)) {
      return;
    }
    const key = ev.key.toLowerCase();
    if (key === " " || key === "k") {
      ev.preventDefault();
      player.togglePlay();
    } else if (key >= "1" && key <= "5") {
      ev.preventDefault();
      els.boundaryToast.hidden = true;
      player.playAct(Number(key), true);
    } else if (key === "j") {
      ev.preventDefault();
      player.seekRelative(-10);
    } else if (key === "v") {
      ev.preventDefault();
      toggleVoice();
    } else if (key === "c") {
      ev.preventDefault();
      toggleCaptions();
    } else if (key === "g") {
      ev.preventDefault();
      setGuide(!guideOpen);
    } else if (key === "f") {
      ev.preventDefault();
      toggleFullscreen();
    }
  });

  renderActPills();
  renderDrawer(S.acts[0]);
})();
