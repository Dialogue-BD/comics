(() => {
  "use strict";

  const S = FOREVERGREEN_STORY;
  const T = typeof FOREVERGREEN_TIMINGS !== "undefined" ? FOREVERGREEN_TIMINGS : { durations: {} };
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const STORAGE_PACING = "forevergreen-pacing-mode";
  const WORD_RE = /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]+/g;
  const PART_RE = /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]+|[^A-Za-z0-9À-ÖØ-öø-ÿ’'-]+/g;

  const els = {
    pacingBtns: $$(".pacing-btn"),
    passBtns: $$(".pass"),
    pass3Subbar: $("#pass3-subbar"),
    submodeBtns: $$(".submode-btn"),
    cinemaCard: $("#cinema-card"),
    ytMount: $("#yt-mount"),
    embedFallback: $("#embed-fallback"),
    embedFallbackReason: $("#embed-fallback-reason"),
    embedFallbackLink: $("#embed-fallback-link"),
    fallbackLocalBtn: $("#fallback-local-btn"),
    localFileInput: $("#local-file-input"),
    audioUnlockPill: $("#audio-unlock-pill"),
    actsBar: $("#acts-bar"),
    captionDrawer: $("#caption-drawer"),
    captionBadge: $("#caption-badge"),
    seekBack: $("#seek-back"),
    replayBeat: $("#replay-beat"),
    mixToggle: $("#mix-toggle"),
    mixPanel: $("#mix-panel"),
    mixFilm: $("#mix-film"),
    mixFilmOut: $("#mix-film-out"),
    mixDuck: $("#mix-duck"),
    mixDuckOut: $("#mix-duck-out"),
    mixVoice: $("#mix-voice"),
    mixVoiceOut: $("#mix-voice-out"),
    mixRate: $("#mix-rate"),
    beatLine: $("#beat-line"),
    beatHint: $("#beat-hint"),
    actReflection: $("#act-reflection"),
    actBoundaryBanner: $("#act-boundary-banner"),
    boundaryEyebrow: $("#boundary-eyebrow"),
    boundaryTitle: $("#boundary-title"),
    continueNextAct: $("#continue-next-act"),
    reflectionDetails: $("#reflection-details"),
    reflectionActName: $("#reflection-act-name"),
    actSummary: $("#act-summary"),
    discussionPrompt: $("#discussion-prompt"),
    sentenceFrames: $("#sentence-frames"),
    storyReaction: $("#story-reaction"),
    goPass2: $("#go-pass-2"),
    blindWorkspace: $("#blind-workspace"),
    memoryGrid: $("#memory-grid"),
    showVideoAgain: $("#show-video-again"),
    aiPromptBox: $("#ai-prompt-box"),
    copyAiPrompt: $("#copy-ai-prompt"),
    copyStatus: $("#copy-status"),
    fullscreenBtn: $("#fullscreen"),
    transcriptOpen: $("#transcript-open"),
    transcriptOpenInline: $("#transcript-open-inline"),
    transcriptDialog: $("#transcript-dialog"),
    transcriptClose: $("#transcript-close"),
    transcriptList: $("#transcript"),
    glossDialog: $("#gloss-dialog"),
    glossClose: $("#gloss-close"),
    glossKind: $("#gloss-kind"),
    glossTitle: $("#gloss-title"),
    glossMeaning: $("#gloss-meaning"),
    glossExample: $("#gloss-example"),
    glossBn: $("#gloss-bn"),
    glossSpeak: $("#gloss-speak"),
    voiceAudio: $("#voice-audio")
  };

  let savedPacing = "full";
  try {
    const stored = window.localStorage.getItem(STORAGE_PACING);
    if (stored === "acts" || stored === "full") savedPacing = stored;
  } catch (_) {}

  let currentPass = 1;
  let pass3Submode = "film";
  let currentActId = 1;
  let currentBeat = S.beats[0];
  let currentGlossPhrase = "";

  const player = window.ForevergreenPlayer.create({
    story: S,
    timings: T,
    mount: els.ytMount,
    audio: els.voiceAudio,
    pacingMode: savedPacing,
    voiceoverEnabled: false,
    callbacks: {
      onActChange: (act) => {
        currentActId = act.id;
        syncActPills();
        renderReflection(act);
        updateCaptionBadge();
      },
      onBeatChange: (beat) => {
        currentBeat = beat;
        renderBeatLine(beat, 0);
        syncTranscriptActive();
        updateCaptionBadge();
      },
      onBeatProgress: (beat, progress) => {
        if (currentBeat && currentBeat.id === beat.id) {
          applyWordHighlight(progress);
        }
      },
      onActBoundary: (act) => {
        showActBoundary(act);
      },
      onStoryEnd: () => {
        if (currentPass === 1) {
          els.storyReaction.hidden = false;
        }
      },
      onAudioBlocked: (blocked) => {
        els.audioUnlockPill.hidden = !blocked;
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

  function formatTime(sec) {
    const n = Math.max(0, Math.round(sec || 0));
    return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
  }

  function tokenizeWords(text, container, withPhrases, phrasesList) {
    container.innerHTML = "";
    const lower = text.toLowerCase();
    const ranges = [];

    if (withPhrases && Array.isArray(phrasesList)) {
      phrasesList.forEach((phrase) => {
        const idx = lower.indexOf(phrase.toLowerCase());
        if (idx >= 0 && S.glossary[phrase]) {
          ranges.push({ start: idx, end: idx + phrase.length, phrase });
        }
      });
      ranges.sort((a, b) => a.start - b.start);
    }

    let cursor = 0;
    let wordIdx = 0;

    function appendSegment(segmentText, targetEl) {
      const parts = segmentText.match(PART_RE) || [];
      parts.forEach((part) => {
        if (WORD_RE.test(part)) {
          WORD_RE.lastIndex = 0;
          const span = document.createElement("span");
          span.className = "word";
          span.dataset.idx = String(wordIdx++);
          span.textContent = part;
          targetEl.appendChild(span);
        } else {
          targetEl.appendChild(document.createTextNode(part));
        }
      });
    }

    ranges.forEach((range) => {
      if (range.start < cursor) return;
      if (range.start > cursor) {
        appendSegment(text.slice(cursor, range.start), container);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "phrase";
      btn.dataset.phrase = range.phrase;
      appendSegment(text.slice(range.start, range.end), btn);
      container.appendChild(btn);
      cursor = range.end;
    });

    if (cursor < text.length) {
      appendSegment(text.slice(cursor), container);
    }
  }

  function renderBeatLine(beat, progress) {
    if (!beat) return;
    const showPhrases = currentPass === 3;
    tokenizeWords(beat.text, els.beatLine, showPhrases, beat.phrases);
    applyWordHighlight(progress);
    els.beatHint.textContent = showPhrases
      ? "Tap any underlined phrase for its English and Bangla explanation."
      : "Film music lowers gently during each storyteller line.";
  }

  function applyWordHighlight(progress) {
    const words = $$(".word", els.beatLine);
    if (!words.length || progress <= 0) {
      words.forEach((w) => w.classList.remove("said", "now"));
      return;
    }
    if (progress >= 0.995) {
      words.forEach((w) => {
        w.classList.remove("now");
        w.classList.add("said");
      });
      return;
    }
    const activeIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
    words.forEach((w, idx) => {
      w.classList.toggle("said", idx < activeIdx);
      w.classList.toggle("now", idx === activeIdx);
    });
  }

  function updateCaptionBadge() {
    const act = S.acts.find((a) => a.id === currentActId) || S.acts[0];
    const timeLabel = currentBeat ? formatTime(currentBeat.start) : formatTime(act.start);
    els.captionBadge.textContent = `Storyteller · Act ${act.id} (${timeLabel})`;
  }

  function renderActsBar() {
    els.actsBar.innerHTML = "";
    S.acts.forEach((act) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "act-pill";
      btn.dataset.act = String(act.id);
      btn.innerHTML = `<span class="act-num">${act.id}</span><span>${act.title}</span>`;
      btn.addEventListener("click", () => {
        els.actBoundaryBanner.hidden = true;
        player.playAct(act.id, true);
      });
      els.actsBar.appendChild(btn);
    });
    syncActPills();
  }

  function syncActPills() {
    $$(".act-pill", els.actsBar).forEach((btn) => {
      const active = Number(btn.dataset.act) === currentActId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function renderReflection(act) {
    els.reflectionActName.textContent = `Act ${act.id}: ${act.title}`;
    els.actSummary.textContent = act.summary;
    els.discussionPrompt.textContent = act.discussionPrompt;
    els.sentenceFrames.innerHTML = "";
    act.sentenceFrames.forEach((frame) => {
      const li = document.createElement("li");
      li.textContent = frame;
      els.sentenceFrames.appendChild(li);
    });
  }

  function showActBoundary(act) {
    const nextAct = S.acts.find((a) => a.id === act.id + 1);
    els.boundaryEyebrow.textContent = `End of Act ${act.id} · ${act.title}`;
    els.boundaryTitle.textContent = act.discussionPrompt;
    if (nextAct) {
      els.continueNextAct.textContent = `Continue to Act ${nextAct.id}: ${nextAct.title} →`;
      els.continueNextAct.dataset.nextAct = String(nextAct.id);
      els.continueNextAct.dataset.action = "next-act";
    } else {
      els.continueNextAct.textContent = currentPass === 1
        ? "Move to Pass 2 · Watch with storyteller →"
        : "Move to Pass 3 · Tell it without looking →";
      els.continueNextAct.dataset.action = "advance-pass";
    }
    els.actBoundaryBanner.hidden = false;
    els.reflectionDetails.open = true;
  }

  function renderMemoryCards() {
    els.memoryGrid.innerHTML = "";
    S.acts.forEach((act) => {
      const card = document.createElement("article");
      card.className = "memory-card";

      const title = document.createElement("h3");
      title.textContent = `${act.id}. ${act.title}`;
      const bn = document.createElement("div");
      bn.className = "memory-bn";
      bn.lang = "bn";
      bn.textContent = act.titleBn;

      const summary = document.createElement("p");
      summary.textContent = act.summary;

      const chips = document.createElement("div");
      chips.className = "memory-chips";
      act.memoryPhrases.forEach((phrase) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "memory-chip";
        chip.textContent = phrase;
        chip.addEventListener("click", () => openGloss(phrase));
        chips.appendChild(chip);
      });

      card.append(title, bn, summary, chips);
      els.memoryGrid.appendChild(card);
    });
    els.aiPromptBox.textContent = S.aiNurturerPrompt;
  }

  function renderTranscript() {
    els.transcriptList.innerHTML = "";
    let lastAct = 0;
    S.beats.forEach((beat) => {
      if (beat.act !== lastAct) {
        lastAct = beat.act;
        const act = S.acts.find((a) => a.id === lastAct);
        const head = document.createElement("div");
        head.className = "transcript-act-head";
        head.textContent = `Act ${act.id}: ${act.title} (${formatTime(act.start)}–${formatTime(act.end)})`;
        els.transcriptList.appendChild(head);
      }

      const row = document.createElement("div");
      row.className = "line-row";
      row.dataset.beatId = beat.id;

      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "line-play";
      playBtn.setAttribute("aria-label", `Play line at ${formatTime(beat.start)}`);
      playBtn.textContent = "▶";
      playBtn.addEventListener("click", () => {
        player.jumpToBeat(beat.id, { standaloneIfNoVideo: true });
        syncTranscriptActive();
      });

      const textEl = document.createElement("div");
      textEl.className = "line-text";
      tokenizeWords(beat.text, textEl, true, beat.phrases);

      row.append(playBtn, textEl);
      els.transcriptList.appendChild(row);
    });
    syncTranscriptActive();
  }

  function syncTranscriptActive() {
    if (!currentBeat) return;
    $$(".line-row", els.transcriptList).forEach((row) => {
      row.classList.toggle("active", row.dataset.beatId === currentBeat.id);
    });
  }

  function openGloss(phrase) {
    const entry = S.glossary[phrase];
    if (!entry) return;
    currentGlossPhrase = phrase;
    if (player.getState().ytPlaying) {
      player.pause();
    }
    els.glossKind.textContent = entry.kind || "Phrase";
    els.glossTitle.textContent = phrase;
    els.glossMeaning.textContent = entry.meaning;
    els.glossExample.textContent = entry.example ? `“${entry.example}”` : "";
    els.glossBn.textContent = entry.bn;
    if (typeof els.glossDialog.showModal === "function") {
      els.glossDialog.showModal();
    } else {
      els.glossDialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  function applyPacingMode(mode) {
    const normalized = mode === "acts" ? "acts" : "full";
    player.setPacingMode(normalized);
    els.pacingBtns.forEach((btn) => {
      const active = btn.dataset.pacing === normalized;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    els.actBoundaryBanner.hidden = true;
    try {
      window.localStorage.setItem(STORAGE_PACING, normalized);
    } catch (_) {}
  }

  function applyPass(passNum) {
    currentPass = passNum;
    player.unlockAudio();

    els.passBtns.forEach((btn) => {
      const active = Number(btn.dataset.pass) === passNum;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const isPass1 = passNum === 1;
    const isPass3 = passNum === 3;

    els.pass3Subbar.hidden = !isPass3;
    els.storyReaction.hidden = true;
    els.actBoundaryBanner.hidden = true;

    if (isPass1) {
      player.setVoiceover(false);
      els.captionDrawer.hidden = true;
      setBlindMode(false);
    } else if (passNum === 2) {
      player.setVoiceover(true);
      els.captionDrawer.hidden = false;
      setBlindMode(false);
      renderBeatLine(currentBeat, 0);
    } else {
      player.setVoiceover(true);
      els.captionDrawer.hidden = false;
      setBlindMode(pass3Submode === "blind");
      renderBeatLine(currentBeat, 0);
    }
  }

  function setBlindMode(blind) {
    pass3Submode = blind ? "blind" : "film";
    els.submodeBtns.forEach((btn) => {
      const active = btn.dataset.submode === pass3Submode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (blind && currentPass === 3) {
      if (player.getState().ytPlaying) player.pause();
      els.cinemaCard.hidden = true;
      els.actReflection.hidden = true;
      els.blindWorkspace.hidden = false;
    } else {
      els.cinemaCard.hidden = false;
      els.actReflection.hidden = false;
      els.blindWorkspace.hidden = true;
    }
  }

  // Event wiring
  els.pacingBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyPacingMode(btn.dataset.pacing));
  });

  els.passBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyPass(Number(btn.dataset.pass)));
  });

  els.submodeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setBlindMode(btn.dataset.submode === "blind");
    });
  });

  els.showVideoAgain.addEventListener("click", () => setBlindMode(false));

  els.goPass2.addEventListener("click", () => {
    applyPass(2);
    player.playAct(1, true);
  });

  els.continueNextAct.addEventListener("click", () => {
    els.actBoundaryBanner.hidden = true;
    if (els.continueNextAct.dataset.action === "next-act") {
      const nextId = Number(els.continueNextAct.dataset.nextAct || 2);
      player.playAct(nextId, true);
    } else {
      applyPass(currentPass === 1 ? 2 : 3);
      if (currentPass === 3) setBlindMode(true);
    }
  });

  els.seekBack.addEventListener("click", () => player.seekRelative(-10));
  els.replayBeat.addEventListener("click", () => player.replayCurrentBeat());

  els.mixToggle.addEventListener("click", () => {
    const open = els.mixPanel.hidden;
    els.mixPanel.hidden = !open;
    els.mixToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  function updateMixFromInputs() {
    const filmVolume = Number(els.mixFilm.value);
    const duckVolume = Number(els.mixDuck.value);
    const voiceVolume = Number(els.mixVoice.value);
    const voiceRate = Number(els.mixRate.value);
    els.mixFilmOut.textContent = `${filmVolume}%`;
    els.mixDuckOut.textContent = `${duckVolume}%`;
    els.mixVoiceOut.textContent = `${voiceVolume}%`;
    player.setMix({ filmVolume, duckVolume, voiceVolume, voiceRate });
  }
  [els.mixFilm, els.mixDuck, els.mixVoice, els.mixRate].forEach((el) => {
    el.addEventListener("input", updateMixFromInputs);
    el.addEventListener("change", updateMixFromInputs);
  });

  els.audioUnlockPill.addEventListener("click", () => {
    player.unlockAudio();
    player.retryBlockedAudio();
  });

  els.fallbackLocalBtn.addEventListener("click", () => {
    els.localFileInput.click();
  });
  els.localFileInput.addEventListener("change", () => {
    const file = els.localFileInput.files && els.localFileInput.files[0];
    if (file) player.loadLocalFile(file);
  });

  document.addEventListener("click", (ev) => {
    const phraseBtn = ev.target.closest(".phrase");
    if (phraseBtn && phraseBtn.dataset.phrase) {
      openGloss(phraseBtn.dataset.phrase);
    }
  });

  function openTranscript() {
    syncTranscriptActive();
    if (typeof els.transcriptDialog.showModal === "function") {
      els.transcriptDialog.showModal();
    } else {
      els.transcriptDialog.setAttribute("open", "");
    }
  }
  els.transcriptOpen.addEventListener("click", openTranscript);
  els.transcriptOpenInline.addEventListener("click", openTranscript);
  els.transcriptClose.addEventListener("click", () => closeDialog(els.transcriptDialog));
  els.glossClose.addEventListener("click", () => closeDialog(els.glossDialog));

  [els.transcriptDialog, els.glossDialog].forEach((dialog) => {
    dialog.addEventListener("click", (ev) => {
      if (ev.target === dialog) closeDialog(dialog);
    });
  });

  els.glossSpeak.addEventListener("click", () => {
    if (currentGlossPhrase) player.speakPhrase(currentGlossPhrase);
  });

  els.copyAiPrompt.addEventListener("click", async () => {
    const text = S.aiNurturerPrompt;
    try {
      await navigator.clipboard.writeText(text);
      els.copyStatus.textContent = "Copied! Paste into your AI voice or chat app.";
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        els.copyStatus.textContent = "Copied!";
      } catch (__) {
        els.copyStatus.textContent = "Select the prompt text above to copy.";
      }
      ta.remove();
    }
    setTimeout(() => { els.copyStatus.textContent = ""; }, 3600);
  });

  els.fullscreenBtn.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else {
          document.body.classList.toggle("fullscreen-active");
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      document.body.classList.toggle("fullscreen-active");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const active = !!document.fullscreenElement;
    document.body.classList.toggle("fullscreen-active", active);
    els.fullscreenBtn.textContent = active ? "Exit fullscreen" : "Fullscreen";
  });

  // Initial render
  renderActsBar();
  renderReflection(S.acts[0]);
  renderMemoryCards();
  renderTranscript();
  applyPacingMode(savedPacing);
  applyPass(1);
})();
