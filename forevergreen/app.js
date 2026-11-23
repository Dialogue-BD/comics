(() => {
  "use strict";

  const S = FOREVERGREEN_STORY;
  const WG = typeof FOREVERGREEN_WORD_GLOSSARY !== "undefined" ? FOREVERGREEN_WORD_GLOSSARY : {};
  const T = typeof FOREVERGREEN_TIMINGS !== "undefined" ? FOREVERGREEN_TIMINGS : { durations: {} };
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const STORAGE_PACING = "forevergreen-pacing-mode";
  const WORD_RE = /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]+/;
  const PART_RE = /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]+|[^A-Za-z0-9À-ÖØ-öø-ÿ’'-]+/g;

  const els = {
    pacingBtns: $$(".pacing-btn"),
    passBtns: $$(".pass"),
    pass3Subbar: $("#pass3-subbar"),
    submodeBtns: $$(".submode-btn"),
    cinemaCard: $("#cinema-card"),
    videoMount: $("#video-mount"),
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
    transcriptTooltip: $("#transcript-tooltip"),
    stageTooltip: $("#stage-tooltip"),
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
  let activeTooltipTarget = null;
  let activeTooltipEl = null;

  const player = window.ForevergreenPlayer.create({
    story: S,
    timings: T,
    mount: els.videoMount,
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
        hideTooltip();
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
      }
    }
  });

  function formatTime(sec) {
    const n = Math.max(0, Math.round(sec || 0));
    return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
  }

  function getPhraseRanges(text, phrasesList) {
    const lower = text.toLowerCase();
    const ranges = [];
    if (Array.isArray(phrasesList)) {
      phrasesList.forEach((phrase) => {
        const idx = lower.indexOf(phrase.toLowerCase());
        if (idx >= 0 && S.glossary[phrase]) {
          ranges.push({ start: idx, end: idx + phrase.length, phrase });
        }
      });
      ranges.sort((a, b) => a.start - b.start);
    }
    return ranges;
  }

  function phraseAtOffset(ranges, pos) {
    for (let i = 0; i < ranges.length; i++) {
      if (pos >= ranges[i].start && pos < ranges[i].end) return ranges[i].phrase;
    }
    return "";
  }

  function renderClickableWords(text, container, { markPhrases = true, phrasesList = [] } = {}) {
    container.innerHTML = "";
    const ranges = markPhrases ? getPhraseRanges(text, phrasesList) : [];
    let wordIdx = 0;
    let match;
    PART_RE.lastIndex = 0;
    while ((match = PART_RE.exec(text)) !== null) {
      const part = match[0];
      if (WORD_RE.test(part)) {
        const key = part.toLowerCase();
        const phrase = phraseAtOffset(ranges, match.index);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "word-btn" + (phrase ? " phrase-word" : "");
        btn.dataset.idx = String(wordIdx++);
        btn.dataset.word = part;
        btn.dataset.wordKey = key;
        if (phrase) btn.dataset.phrase = phrase;
        btn.textContent = part;
        container.appendChild(btn);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    }
  }

  function renderBeatLine(beat, progress) {
    if (!beat) return;
    renderClickableWords(beat.text, els.beatLine, {
      markPhrases: currentPass === 3,
      phrasesList: beat.phrases
    });
    applyWordHighlight(progress);
    els.beatHint.textContent = currentPass === 3
      ? "Tap any word for a quick definition, or an underlined phrase for full idiom notes."
      : "Film audio lowers gently during each Phonon storyteller line. Tap any word for a quick definition.";
  }

  function applyWordHighlight(progress) {
    const words = $$(".word-btn", els.beatLine);
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

  function hideTooltip() {
    if (activeTooltipTarget) {
      activeTooltipTarget.classList.remove("tooltip-active");
      activeTooltipTarget = null;
    }
    if (activeTooltipEl) {
      activeTooltipEl.hidden = true;
      activeTooltipEl = null;
    }
  }

  function showWordTooltip(wordBtn) {
    if (!wordBtn) return;
    if (activeTooltipTarget === wordBtn && activeTooltipEl && !activeTooltipEl.hidden) {
      hideTooltip();
      return;
    }
    hideTooltip();

    const insideDialog = !!wordBtn.closest("#transcript-dialog");
    const tip = insideDialog ? els.transcriptTooltip : els.stageTooltip;
    const rawWord = wordBtn.dataset.word || wordBtn.textContent.trim();
    const key = (wordBtn.dataset.wordKey || rawWord).toLowerCase();
    const phrase = wordBtn.dataset.phrase || "";
    const entry = WG[key] || {
      pos: "word",
      def: `Key word from the story: "${rawWord}"`,
      bn: "গল্পের একটি শব্দ।"
    };

    tip.innerHTML = "";
    const head = document.createElement("div");
    head.className = "tooltip-head";

    const title = document.createElement("span");
    title.className = "tooltip-word";
    title.textContent = rawWord;

    const pos = document.createElement("span");
    pos.className = "tooltip-pos";
    pos.textContent = entry.pos || "word";

    const actions = document.createElement("div");
    actions.className = "tooltip-actions-inline";

    const speakBtn = document.createElement("button");
    speakBtn.type = "button";
    speakBtn.className = "tooltip-speak";
    speakBtn.setAttribute("aria-label", `Pronounce ${rawWord}`);
    speakBtn.textContent = "🔊";
    speakBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      player.speakWord(rawWord);
    });

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "tooltip-close";
    closeBtn.setAttribute("aria-label", "Close definition");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      hideTooltip();
    });

    actions.append(speakBtn, closeBtn);
    head.append(title, pos, actions);

    const def = document.createElement("p");
    def.className = "tooltip-def";
    def.textContent = entry.def;

    const bn = document.createElement("p");
    bn.className = "tooltip-bn";
    bn.lang = "bn";
    bn.textContent = entry.bn;

    tip.append(head, def, bn);

    if (phrase && S.glossary[phrase]) {
      const phraseBtn = document.createElement("button");
      phraseBtn.type = "button";
      phraseBtn.className = "tooltip-phrase-btn";
      phraseBtn.textContent = `Full phrase note: “${phrase}” →`;
      phraseBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        hideTooltip();
        openGloss(phrase);
      });
      tip.appendChild(phraseBtn);
    }

    tip.hidden = false;
    wordBtn.classList.add("tooltip-active");
    activeTooltipTarget = wordBtn;
    activeTooltipEl = tip;

    // Position fixed tooltip cleanly inside viewport bounds
    const rect = wordBtn.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const pad = 12;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(pad, Math.min(window.innerWidth - tipRect.width - pad, left));
    let top = rect.top - tipRect.height - 8;
    if (top < pad) {
      top = Math.min(window.innerHeight - tipRect.height - pad, rect.bottom + 8);
    }
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
    player.speakWord(rawWord);
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
        const group = document.createElement("span");
        group.className = "memory-chip-group";

        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "memory-chip";
        chip.textContent = phrase;
        chip.addEventListener("click", () => openGloss(phrase));

        const speakBtn = document.createElement("button");
        speakBtn.type = "button";
        speakBtn.className = "memory-chip-speak";
        speakBtn.setAttribute("aria-label", `Hear ${phrase}`);
        speakBtn.title = `Hear "${phrase}"`;
        speakBtn.textContent = "🔊";
        speakBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          player.speakPhrase(phrase);
        });

        group.append(chip, speakBtn);
        chips.appendChild(group);
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
        hideTooltip();
        player.jumpToBeat(beat.id, { standaloneIfPaused: true });
        syncTranscriptActive();
      });

      const textEl = document.createElement("div");
      textEl.className = "line-text";
      renderClickableWords(beat.text, textEl, {
        markPhrases: true,
        phrasesList: beat.phrases
      });

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
    if (player.getState().playing) {
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
    hideTooltip();
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
    hideTooltip();
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
    hideTooltip();
    els.submodeBtns.forEach((btn) => {
      const active = btn.dataset.submode === pass3Submode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (blind && currentPass === 3) {
      if (player.getState().playing) player.pause();
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

  // Word-level tooltip clicks + outside dismissal
  document.addEventListener("click", (ev) => {
    const wordBtn = ev.target.closest(".word-btn");
    if (wordBtn) {
      ev.stopPropagation();
      showWordTooltip(wordBtn);
      return;
    }
    if (activeTooltipEl && !ev.target.closest(".word-tooltip")) {
      hideTooltip();
    }
  });

  els.transcriptList.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && activeTooltipEl && !activeTooltipEl.hidden) {
      ev.stopPropagation();
      hideTooltip();
    }
  });

  function openTranscript() {
    hideTooltip();
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

  // Frame inspector (static pre-identified Busy-Picture catalog; works while playing)
  if (window.ForevergreenInspector && $("#cinema-stage") && $("#inspect-card-mount")) {
    window.ForevergreenInspector.create({
      story: S,
      entities: typeof FOREVERGREEN_ENTITIES !== "undefined" ? FOREVERGREEN_ENTITIES : [],
      scenes: typeof FOREVERGREEN_SCENES !== "undefined" ? FOREVERGREEN_SCENES : [],
      player,
      stageEl: $("#cinema-stage"),
      cardMountEl: $("#inspect-card-mount"),
      toggleBtnEl: $("#inspect-toggle"),
      defaultActive: true,
      theme: "light",
      idleToggleLabel: "🔍 Tap Items: Off",
      activeToggleLabel: "✓ Tap Items: On"
    });
  }

  // Initial render
  renderActsBar();
  renderReflection(S.acts[0]);
  renderMemoryCards();
  renderTranscript();
  applyPacingMode(savedPacing);
  applyPass(1);
})();
