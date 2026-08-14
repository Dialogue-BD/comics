(() => {
  "use strict";

  const cards = Array.isArray(window.GUESS_WHAT_CARDS) ? window.GUESS_WHAT_CARDS : [];
  const TEAM_NAMES = ["Coral", "Sky", "Lime", "Violet"];
  const TEAM_COLORS = ["var(--team-1)", "var(--team-2)", "var(--team-3)", "var(--team-4)"];
  const DURATION_ROUNDS = {
    20: { topic: 4, words: 3, standalone: 8 },
    25: { topic: 5, words: 4, standalone: 10 },
    30: { topic: 6, words: 5, standalone: 12 }
  };

  const dom = {
    app: document.querySelector("#app"),
    setupView: document.querySelector("#setup-view"),
    gameView: document.querySelector("#game-view"),
    brandHome: document.querySelector("#brand-home"),
    soundButton: document.querySelector("#sound-button"),
    helpButton: document.querySelector("#help-button"),
    fullscreenButton: document.querySelector("#fullscreen-button"),
    helpDialog: document.querySelector("#help-dialog"),
    deckButton: document.querySelector("#deck-button"),
    deckDialog: document.querySelector("#deck-dialog"),
    deckFilter: document.querySelector("#deck-filter"),
    deckSearch: document.querySelector("#deck-search"),
    deckResults: document.querySelector("#deck-results"),
    teamCountControl: document.querySelector("#team-count-control"),
    durationControl: document.querySelector("#duration-control"),
    levelControl: document.querySelector("#level-control"),
    teamSizeMinus: document.querySelector("#team-size-minus"),
    teamSizePlus: document.querySelector("#team-size-plus"),
    teamSizeOutput: document.querySelector("#team-size-output"),
    classSummary: document.querySelector("#class-summary"),
    startSummary: document.querySelector("#start-summary"),
    roundSummary: document.querySelector("#round-summary"),
    startButton: document.querySelector("#start-button"),
    phaseLabel: document.querySelector("#phase-label"),
    roundLabel: document.querySelector("#round-label"),
    progressFill: document.querySelector("#progress-fill"),
    quitButton: document.querySelector("#quit-button"),
    speakerAvatar: document.querySelector("#speaker-avatar"),
    speakerLabel: document.querySelector("#speaker-label"),
    ageSupport: document.querySelector("#age-support"),
    levelBadge: document.querySelector("#level-badge"),
    modeBadge: document.querySelector("#mode-badge"),
    topicPrompt: document.querySelector("#topic-prompt span"),
    topicDisplay: document.querySelector("#topic-display"),
    wordGrid: document.querySelector("#word-grid"),
    timer: document.querySelector("#timer"),
    timerRing: document.querySelector("#timer-ring"),
    timerState: document.querySelector("#timer-state"),
    timerDisplay: document.querySelector("#timer-display"),
    roundValueLabel: document.querySelector("#round-value-label"),
    roundValue: document.querySelector("#round-value"),
    timerButton: document.querySelector("#timer-button"),
    actionButton: document.querySelector("#action-button"),
    answerButton: document.querySelector("#answer-button"),
    nextButton: document.querySelector("#next-button"),
    teacherTip: document.querySelector("#teacher-tip span"),
    teams: document.querySelector("#teams"),
    resetScoresButton: document.querySelector("#reset-scores-button"),
    phaseOverlay: document.querySelector("#phase-overlay"),
    phaseKicker: document.querySelector("#phase-kicker"),
    phaseTitle: document.querySelector("#phase-title"),
    phaseDescription: document.querySelector("#phase-description"),
    phaseRules: document.querySelector("#phase-rules"),
    beginPhaseButton: document.querySelector("#begin-phase-button"),
    sessionComplete: document.querySelector("#session-complete"),
    finalRanking: document.querySelector("#final-ranking"),
    playAgainButton: document.querySelector("#play-again-button"),
    newSetupButton: document.querySelector("#new-setup-button"),
    toast: document.querySelector("#toast")
  };

  const config = {
    mode: "session",
    teams: 4,
    teamSize: 5,
    duration: 25,
    level: "mixed"
  };

  const state = {
    sequence: [],
    roundIndex: -1,
    currentCard: null,
    clueOrder: [],
    revealed: 0,
    answerShown: false,
    scores: [],
    roundAwards: [],
    usedCards: new Set(),
    sound: true,
    timer: {
      limit: 15,
      remaining: 15,
      running: false,
      started: false,
      endAt: 0,
      interval: null
    }
  };

  let toastTimer = null;
  let audioContext = null;
  let deckLevel = "all";

  function secureIndex(max) {
    if (max <= 1) return 0;
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return Math.floor((values[0] / 4294967296) * max);
    }
    return Math.floor(Math.random() * max);
  }

  function shuffle(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = secureIndex(index + 1);
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function savePreferences() {
    try {
      localStorage.setItem("guess-what-class-config", JSON.stringify(config));
      localStorage.setItem("guess-what-sound", String(state.sound));
    } catch (_) {}
  }

  function loadPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem("guess-what-class-config") || "null");
      if (saved && ["session", "topic", "words"].includes(saved.mode)) config.mode = saved.mode;
      if ([2, 3, 4].includes(Number(saved?.teams))) config.teams = Number(saved.teams);
      if (Number(saved?.teamSize) >= 3 && Number(saved?.teamSize) <= 8) config.teamSize = Number(saved.teamSize);
      if ([20, 25, 30].includes(Number(saved?.duration))) config.duration = Number(saved.duration);
      if (["basic", "mixed", "challenge"].includes(saved?.level)) config.level = saved.level;
      state.sound = localStorage.getItem("guess-what-sound") !== "false";
    } catch (_) {}
  }

  function selectMode(mode) {
    config.mode = mode;
    document.querySelectorAll("[data-mode-card]").forEach(element => {
      const selected = element.dataset.modeCard === mode;
      element.classList.toggle("selected", selected);
      element.setAttribute("aria-pressed", String(selected));
    });
    updateSetupSummary();
    savePreferences();
  }

  function setSegment(control, value) {
    control.querySelectorAll("button").forEach(button => {
      button.classList.toggle("active", String(button.dataset.value) === String(value));
    });
  }

  function updateSetupSummary() {
    const plan = DURATION_ROUNDS[config.duration];
    const roundCount = config.mode === "session"
      ? 2 + plan.topic + plan.words
      : plan.standalone;
    const modeName = config.mode === "session"
      ? "guided session"
      : config.mode === "topic" ? "Guess the Topic" : "Guess the Words";

    dom.teamSizeOutput.textContent = String(config.teamSize);
    dom.classSummary.textContent = `${config.teams} teams × ${config.teamSize} speakers`;
    dom.startSummary.textContent = `${config.duration}-minute ${modeName}`;
    dom.roundSummary.textContent = `${roundCount} rounds · ${cards.length} official card sides`;
    dom.soundButton.textContent = state.sound ? "♪" : "×";
    dom.soundButton.setAttribute("aria-label", state.sound ? "Turn sound off" : "Turn sound on");

    setSegment(dom.teamCountControl, config.teams);
    setSegment(dom.durationControl, config.duration);
    setSegment(dom.levelControl, config.level);
    selectModeVisualOnly();
  }

  function selectModeVisualOnly() {
    document.querySelectorAll("[data-mode-card]").forEach(element => {
      const selected = element.dataset.modeCard === config.mode;
      element.classList.toggle("selected", selected);
      element.setAttribute("aria-pressed", String(selected));
    });
  }

  function buildSequence() {
    const plan = DURATION_ROUNDS[config.duration];
    const sequence = [];

    if (config.mode === "session") {
      sequence.push({ phaseId: "warmup", phase: "Warm-up", mode: "topic", level: "basic", practice: true, multiplier: 0 });
      for (let index = 0; index < plan.topic; index += 1) {
        sequence.push({ phaseId: "topic", phase: "Game 1", mode: "topic", level: chooseConfiguredLevel(index), practice: false, multiplier: 1 });
      }
      for (let index = 0; index < plan.words; index += 1) {
        sequence.push({ phaseId: "words", phase: "Game 2", mode: "words", level: chooseConfiguredLevel(index + plan.topic), practice: false, multiplier: 1 });
      }
      sequence.push({ phaseId: "finale", phase: "Finale", mode: "topic", level: "challenge", practice: false, multiplier: 2 });
      return sequence;
    }

    for (let index = 0; index < plan.standalone; index += 1) {
      sequence.push({
        phaseId: config.mode,
        phase: config.mode === "topic" ? "Guess the Topic" : "Guess the Words",
        mode: config.mode,
        level: chooseConfiguredLevel(index),
        practice: false,
        multiplier: 1
      });
    }
    return sequence;
  }

  function chooseConfiguredLevel(index) {
    if (config.level === "basic" || config.level === "challenge") return config.level;
    return index % 2 === 0 ? "basic" : "challenge";
  }

  function selectCard(level) {
    let pool = cards.filter(card => card.level === level && !state.usedCards.has(card.id));
    if (!pool.length) {
      cards.filter(card => card.level === level).forEach(card => state.usedCards.delete(card.id));
      pool = cards.filter(card => card.level === level);
    }
    const card = pool[secureIndex(pool.length)];
    state.usedCards.add(card.id);
    return card;
  }

  function startSession() {
    stopTimer();
    state.sequence = buildSequence();
    state.roundIndex = 0;
    state.scores = Array(config.teams).fill(0);
    state.roundAwards = Array(config.teams).fill(0);
    state.usedCards.clear();
    dom.setupView.hidden = true;
    dom.gameView.hidden = false;
    dom.sessionComplete.hidden = true;
    startRound(true);
    savePreferences();
    window.scrollTo(0, 0);
  }

  function currentStep() {
    return state.sequence[state.roundIndex];
  }

  function scoredRoundsBeforeCurrent() {
    return state.sequence.slice(0, state.roundIndex).filter(step => !step.practice).length;
  }

  function currentSpeaker() {
    if (currentStep()?.practice) return 1;
    return (scoredRoundsBeforeCurrent() % config.teamSize) + 1;
  }

  function startRound(showPhaseIfNeeded = false) {
    const step = currentStep();
    if (!step) return finishSession();

    state.currentCard = selectCard(step.level);
    state.clueOrder = shuffle(state.currentCard.words);
    state.revealed = 0;
    state.answerShown = false;
    state.roundAwards = Array(config.teams).fill(0);
    resetTimer(step.mode === "topic" ? 15 : 60);
    renderGame();

    const previous = state.sequence[state.roundIndex - 1];
    if (showPhaseIfNeeded || !previous || previous.phaseId !== step.phaseId) showPhaseIntro(step);
    else dom.phaseOverlay.hidden = true;
  }

  function showPhaseIntro(step) {
    const content = phaseContent(step);
    dom.phaseKicker.textContent = content.kicker;
    dom.phaseTitle.textContent = content.title;
    dom.phaseDescription.textContent = content.description;
    dom.phaseRules.innerHTML = content.rules.map((rule, index) => `<div class="phase-rule"><b>${index + 1}</b><span>${rule}</span></div>`).join("");
    dom.beginPhaseButton.textContent = step.practice ? "Start demonstration →" : `Begin ${content.title} →`;
    dom.phaseOverlay.hidden = false;
    dom.beginPhaseButton.focus();
  }

  function phaseContent(step) {
    if (step.phaseId === "warmup") {
      return {
        kicker: "Two-minute warm-up",
        title: "Show them how",
        description: "Do this first card together without points. Model a quiet huddle and one final answer from each team.",
        rules: ["Reveal one clue", "Teams discuss quietly", "Speaker 1 gives the team's answer"]
      };
    }
    if (step.phaseId === "topic") {
      return {
        kicker: "Phase 1",
        title: "Guess the Topic",
        description: "Reveal one word at a time. Fewer clues means more points.",
        rules: ["15-second team huddle", "One written answer per team", "Award the points shown on screen"]
      };
    }
    if (step.phaseId === "words") {
      return {
        kicker: "Phase 2",
        title: "Guess the Words",
        description: "Show the topic. Teams have one minute to predict the six hidden words.",
        rules: ["Write as many related words as possible", "Reveal the official six", "Award one point for each match"]
      };
    }
    if (step.phaseId === "finale") {
      return {
        kicker: "Final round",
        title: "Double points!",
        description: "One challenge-level mystery topic. Every point is doubled.",
        rules: ["Choose your final speaker", "Discuss before submitting", "Celebrate clever connections"]
      };
    }
    return step.mode === "topic"
      ? { kicker: "Class game", title: "Guess the Topic", description: "Reveal clues one at a time and award more points for an early answer.", rules: ["Quiet team huddle", "One answer per team", "Rotate the speaker every round"] }
      : { kicker: "Class game", title: "Guess the Words", description: "Teams predict the six words connected to the displayed topic.", rules: ["One-minute brainstorm", "Reveal and compare", "One point per match"] };
  }

  function renderGame() {
    const step = currentStep();
    if (!step || !state.currentCard) return;
    const modeName = step.mode === "topic" ? "Guess the Topic" : "Guess the Words";
    const speaker = currentSpeaker();

    dom.phaseLabel.textContent = step.phase;
    dom.roundLabel.textContent = `Round ${state.roundIndex + 1} of ${state.sequence.length}`;
    dom.progressFill.style.width = `${((state.roundIndex + 1) / state.sequence.length) * 100}%`;
    dom.speakerAvatar.textContent = String(speaker);
    dom.speakerLabel.textContent = `Speaker ${speaker} of ${config.teamSize}`;
    dom.ageSupport.textContent = step.mode === "topic"
      ? "Younger: guess a link · Older: explain why it fits"
      : "Younger: suggest a word · Older: use it in a sentence";
    dom.levelBadge.textContent = step.level === "basic" ? "Basic +" : "Challenge ++";
    dom.levelBadge.classList.toggle("challenge", step.level === "challenge");
    dom.modeBadge.textContent = step.practice ? "Practice — no points" : modeName;
    dom.topicPrompt.textContent = step.mode === "topic"
      ? "What topic connects these words?"
      : "Predict the six words on this card";
    dom.topicDisplay.textContent = step.mode === "topic" && !state.answerShown
      ? "Mystery topic"
      : state.currentCard.topic;
    dom.topicDisplay.classList.toggle("concealed", step.mode === "topic" && !state.answerShown);

    renderWords();
    renderTimer();
    renderControls();
    renderTeams();
  }

  function renderWords() {
    const step = currentStep();
    const values = step.mode === "topic" ? state.clueOrder : state.currentCard.words;
    dom.wordGrid.innerHTML = values.map((word, index) => {
      const visible = step.mode === "topic" ? index < state.revealed : state.answerShown;
      const classNames = ["word-tile"];
      if (!visible) classNames.push("hidden-word");
      if (visible) classNames.push("revealed");
      if (step.mode === "words" && visible) classNames.push("answer");
      return `<div class="${classNames.join(" ")}" style="animation-delay:${index * 35}ms">${visible ? escapeHtml(word) : ""}</div>`;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentAward() {
    const step = currentStep();
    if (!step || step.practice) return 0;
    if (step.mode === "words") return 1;
    const base = Math.max(1, 7 - Math.max(1, state.revealed));
    return base * (step.multiplier || 1);
  }

  function renderControls() {
    const step = currentStep();
    const award = currentAward();
    const readyForNext = state.answerShown;

    dom.nextButton.hidden = !readyForNext;
    dom.actionButton.hidden = readyForNext;
    dom.answerButton.hidden = readyForNext || step.mode === "words";

    if (step.mode === "topic") {
      dom.actionButton.textContent = state.revealed === 0
        ? "Reveal first clue"
        : state.revealed < 6 ? `Reveal clue ${state.revealed + 1}` : "All clues revealed";
      dom.actionButton.disabled = state.revealed >= 6;
      dom.answerButton.textContent = "Reveal topic";
      dom.timerButton.hidden = !state.timer.started;
      dom.roundValueLabel.textContent = step.practice ? "Warm-up" : step.multiplier === 2 ? "Double-point value" : "Worth now";
      dom.roundValue.textContent = step.practice ? "No points" : `${award} point${award === 1 ? "" : "s"}`;
      dom.teacherTip.textContent = state.revealed === 0
        ? "Reveal a clue, then give teams 15 seconds to write one answer."
        : state.answerShown ? "Award every team that found the topic, then continue." : "If nobody is correct, reveal the next clue. Fewer clues are worth more.";
    } else {
      dom.actionButton.disabled = false;
      dom.actionButton.textContent = state.timer.started ? "Reveal the six words" : "Start 60-second huddle";
      dom.timerButton.hidden = !state.timer.started;
      dom.roundValueLabel.textContent = "Scoring";
      dom.roundValue.textContent = "1 point per match";
      dom.teacherTip.textContent = state.answerShown
        ? "Teams compare their lists. Tap +1 once for every exact or clearly equivalent match."
        : "Teams write related words. Older learners should prepare a sentence using one word.";
    }

    dom.timerButton.textContent = state.timer.running ? "Pause timer" : state.timer.started && state.timer.remaining <= 0 ? "Restart timer" : "Start timer";
    dom.nextButton.textContent = state.roundIndex === state.sequence.length - 1 ? "See final scores →" : "Next round →";
  }

  function renderTeams() {
    const step = currentStep();
    const award = currentAward();
    dom.teams.innerHTML = state.scores.map((score, index) => {
      const roundScore = state.roundAwards[index] || 0;
      const alreadyAwarded = step.mode === "topic" && roundScore > 0;
      const disabled = step.practice
        || (step.mode === "topic" && (state.revealed === 0 || alreadyAwarded))
        || (step.mode === "words" && (!state.answerShown || roundScore >= 6));
      let awardLabel = step.practice ? "Demo" : step.mode === "topic" ? (alreadyAwarded ? `✓ +${roundScore}` : `+${award}`) : "+1";
      return `
        <div class="team-card" style="--team-color:${TEAM_COLORS[index]}">
          <span class="team-dot">${index + 1}</span>
          <span class="team-meta"><span>${TEAM_NAMES[index]} team${roundScore ? ` · +${roundScore} round` : ""}</span><strong>${score} pt${score === 1 ? "" : "s"}</strong></span>
          <span class="team-controls">
            <button class="team-minus" type="button" data-team-minus="${index}" aria-label="Remove points from ${TEAM_NAMES[index]} team">−</button>
            <button class="team-award" type="button" data-team-award="${index}" ${disabled ? "disabled" : ""} aria-label="Award ${TEAM_NAMES[index]} team">${awardLabel}</button>
          </span>
        </div>`;
    }).join("");
  }

  function revealClue() {
    const step = currentStep();
    if (!step || step.mode !== "topic" || state.answerShown || state.revealed >= 6) return;
    state.revealed += 1;
    resetTimer(15);
    startTimer();
    renderGame();
    announce(`Clue ${state.revealed}: ${state.clueOrder[state.revealed - 1]}`);
  }

  function revealAnswer() {
    if (state.answerShown) return;
    const step = currentStep();
    if (step.mode === "words" && !state.timer.started) {
      resetTimer(60);
      startTimer();
      renderGame();
      announce("One-minute team huddle started.");
      return;
    }
    stopTimer();
    state.answerShown = true;
    renderGame();
    announce(step.mode === "topic" ? `The topic is ${state.currentCard.topic}.` : "The six words are revealed. Award one point per match.");
    dom.nextButton.focus();
  }

  function nextRound() {
    if (!state.answerShown) return;
    stopTimer();
    state.roundIndex += 1;
    if (state.roundIndex >= state.sequence.length) {
      finishSession();
      return;
    }
    startRound(false);
    window.scrollTo(0, 0);
  }

  function awardTeam(index) {
    const step = currentStep();
    if (!step || step.practice || index < 0 || index >= config.teams) return;
    if (step.mode === "topic") {
      if (state.revealed === 0 || state.roundAwards[index] > 0) return;
      const points = currentAward();
      state.roundAwards[index] = points;
      state.scores[index] += points;
      announce(`${TEAM_NAMES[index]} team earns ${points} point${points === 1 ? "" : "s"}.`);
    } else {
      if (!state.answerShown) return;
      if (state.roundAwards[index] >= 6) return;
      state.roundAwards[index] += 1;
      state.scores[index] += 1;
      announce(`${TEAM_NAMES[index]} team: ${state.roundAwards[index]} match${state.roundAwards[index] === 1 ? "" : "es"} this round.`);
    }
    renderTeams();
  }

  function removeTeamPoint(index) {
    if (index < 0 || index >= config.teams) return;
    const step = currentStep();
    if (step.mode === "topic" && state.roundAwards[index] > 0) {
      state.scores[index] = Math.max(0, state.scores[index] - state.roundAwards[index]);
      state.roundAwards[index] = 0;
    } else if (step.mode === "words" && state.roundAwards[index] > 0) {
      state.roundAwards[index] -= 1;
      state.scores[index] = Math.max(0, state.scores[index] - 1);
    } else {
      state.scores[index] = Math.max(0, state.scores[index] - 1);
    }
    renderTeams();
  }

  function resetScores() {
    if (!window.confirm("Reset every team's score to zero?")) return;
    state.scores = Array(config.teams).fill(0);
    state.roundAwards = Array(config.teams).fill(0);
    renderTeams();
    announce("Scores reset.");
  }

  function resetTimer(seconds) {
    stopTimer();
    state.timer.limit = seconds;
    state.timer.remaining = seconds;
    state.timer.running = false;
    state.timer.started = false;
    renderTimer();
  }

  function startTimer() {
    if (state.timer.running) return;
    if (state.timer.remaining <= 0) state.timer.remaining = state.timer.limit;
    state.timer.started = true;
    state.timer.running = true;
    state.timer.endAt = Date.now() + state.timer.remaining * 1000;
    clearInterval(state.timer.interval);
    state.timer.interval = window.setInterval(tickTimer, 100);
    renderTimer();
    renderControls();
  }

  function pauseTimer() {
    if (!state.timer.running) return;
    state.timer.remaining = Math.max(0, (state.timer.endAt - Date.now()) / 1000);
    state.timer.running = false;
    clearInterval(state.timer.interval);
    state.timer.interval = null;
    renderTimer();
    renderControls();
  }

  function stopTimer() {
    clearInterval(state.timer.interval);
    state.timer.interval = null;
    state.timer.running = false;
  }

  function toggleTimer() {
    if (state.timer.running) pauseTimer();
    else startTimer();
  }

  function tickTimer() {
    state.timer.remaining = Math.max(0, (state.timer.endAt - Date.now()) / 1000);
    if (state.timer.remaining <= 0) {
      state.timer.remaining = 0;
      stopTimer();
      playBell();
      announce("Time! Speakers, show your team's answer.");
    }
    renderTimer();
    renderControls();
  }

  function renderTimer() {
    const remaining = Math.max(0, Math.ceil(state.timer.remaining));
    const minutes = Math.floor(remaining / 60);
    const seconds = String(remaining % 60).padStart(2, "0");
    const progress = state.timer.limit ? 1 - (state.timer.remaining / state.timer.limit) : 0;
    dom.timerDisplay.textContent = `${minutes}:${seconds}`;
    dom.timerState.textContent = state.timer.running ? "Huddle" : state.timer.started && remaining === 0 ? "Time!" : state.timer.started ? "Paused" : "Ready";
    dom.timerRing.style.setProperty("--progress", `${Math.max(0, Math.min(1, progress))}turn`);
  }

  function playBell() {
    if (!state.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      [659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now + index * .12);
        gain.gain.linearRampToValueAtTime(.15, now + index * .12 + .01);
        gain.gain.exponentialRampToValueAtTime(.001, now + index * .12 + .32);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now + index * .12);
        oscillator.stop(now + index * .12 + .34);
      });
    } catch (_) {}
  }

  function announce(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => dom.toast.classList.remove("show"), 2200);
  }

  function finishSession() {
    stopTimer();
    const ranking = state.scores.map((score, index) => ({ index, score })).sort((a, b) => b.score - a.score || a.index - b.index);
    dom.finalRanking.innerHTML = ranking.map((team, rank) => `
      <div class="rank-row"><span>${rank + 1}</span><strong>${TEAM_NAMES[team.index]} team</strong><span>${team.score} pts</span></div>
    `).join("");
    dom.sessionComplete.hidden = false;
    dom.playAgainButton.focus();
    playBell();
  }

  function showSetup(ask = false) {
    if (ask && !window.confirm("End this session and return to setup?")) return;
    stopTimer();
    dom.phaseOverlay.hidden = true;
    dom.sessionComplete.hidden = true;
    dom.gameView.hidden = true;
    dom.setupView.hidden = false;
    updateSetupSummary();
    window.scrollTo(0, 0);
    dom.startButton.focus();
  }

  function toggleSound() {
    state.sound = !state.sound;
    updateSetupSummary();
    savePreferences();
    announce(state.sound ? "Sound on." : "Sound off.");
    if (state.sound) playBell();
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }

  async function toggleFullscreen() {
    try {
      if (fullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) await exit.call(document);
      } else {
        const enter = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
        if (enter) await enter.call(document.documentElement);
      }
    } catch (_) {
      announce("Fullscreen is not available in this browser.");
    }
    updateFullscreenButton();
  }

  function updateFullscreenButton() {
    const active = Boolean(fullscreenElement());
    dom.fullscreenButton.textContent = active ? "×" : "⛶";
    dom.fullscreenButton.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
  }

  function primaryAction() {
    const step = currentStep();
    if (!step || state.answerShown) return;
    if (step.mode === "topic") revealClue();
    else revealAnswer();
  }

  function renderDeck() {
    const query = dom.deckSearch.value.trim().toLocaleLowerCase();
    const visibleCards = cards.filter(card => {
      const matchesLevel = deckLevel === "all" || card.level === deckLevel;
      const searchableText = `${card.topic} ${card.words.join(" ")}`.toLocaleLowerCase();
      return matchesLevel && (!query || searchableText.includes(query));
    });

    dom.deckResults.innerHTML = visibleCards.length
      ? visibleCards.map(card => `
          <article class="deck-card">
            <div class="deck-card-topline">
              <span class="deck-card-number">Official card</span>
              <span class="deck-card-level ${card.level === "challenge" ? "challenge" : ""}">${card.level === "challenge" ? "++" : "+"}</span>
            </div>
            <h3>${escapeHtml(card.topic)}</h3>
            <ul>${card.words.map(word => `<li>${escapeHtml(word)}</li>`).join("")}</ul>
          </article>`).join("")
      : `<div class="deck-empty"><strong>No matching cards</strong><span>Try another word or level.</span></div>`;
  }

  function openDeck() {
    renderDeck();
    dom.deckDialog.showModal();
  }

  document.querySelectorAll("[data-mode-card]").forEach(element => {
    element.addEventListener("click", () => selectMode(element.dataset.modeCard));
    if (element.getAttribute("role") === "button") {
      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectMode(element.dataset.modeCard);
        }
      });
    }
  });

  dom.teamCountControl.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    config.teams = Number(button.dataset.value);
    updateSetupSummary();
    savePreferences();
  });

  dom.durationControl.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    config.duration = Number(button.dataset.value);
    updateSetupSummary();
    savePreferences();
  });

  dom.levelControl.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    config.level = button.dataset.value;
    updateSetupSummary();
    savePreferences();
  });

  dom.teamSizeMinus.addEventListener("click", () => {
    config.teamSize = Math.max(3, config.teamSize - 1);
    updateSetupSummary();
    savePreferences();
  });
  dom.teamSizePlus.addEventListener("click", () => {
    config.teamSize = Math.min(8, config.teamSize + 1);
    updateSetupSummary();
    savePreferences();
  });

  dom.startButton.addEventListener("click", startSession);
  dom.actionButton.addEventListener("click", primaryAction);
  dom.answerButton.addEventListener("click", revealAnswer);
  dom.nextButton.addEventListener("click", nextRound);
  dom.timerButton.addEventListener("click", toggleTimer);
  dom.quitButton.addEventListener("click", () => finishSession());
  dom.resetScoresButton.addEventListener("click", resetScores);
  dom.beginPhaseButton.addEventListener("click", () => {
    dom.phaseOverlay.hidden = true;
    dom.actionButton.focus();
  });
  dom.playAgainButton.addEventListener("click", startSession);
  dom.newSetupButton.addEventListener("click", () => showSetup(false));
  dom.brandHome.addEventListener("click", () => dom.gameView.hidden ? window.scrollTo(0, 0) : showSetup(true));
  dom.helpButton.addEventListener("click", () => dom.helpDialog.showModal());
  dom.deckButton.addEventListener("click", openDeck);
  dom.deckFilter.addEventListener("click", event => {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    deckLevel = button.dataset.value;
    setSegment(dom.deckFilter, deckLevel);
    renderDeck();
  });
  dom.deckSearch.addEventListener("input", renderDeck);
  dom.deckDialog.querySelector("form").addEventListener("submit", event => {
    if (document.activeElement === dom.deckSearch) event.preventDefault();
  });
  dom.soundButton.addEventListener("click", toggleSound);
  dom.fullscreenButton.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

  dom.teams.addEventListener("click", event => {
    const award = event.target.closest("[data-team-award]");
    const minus = event.target.closest("[data-team-minus]");
    if (award) awardTeam(Number(award.dataset.teamAward));
    if (minus) removeTeamPoint(Number(minus.dataset.teamMinus));
  });

  document.addEventListener("keydown", event => {
    if (dom.helpDialog.open || dom.deckDialog.open || event.target.closest("dialog") || event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === "f") {
      event.preventDefault();
      toggleFullscreen();
    } else if (key === "m") {
      event.preventDefault();
      toggleSound();
    } else if (event.key === "?") {
      event.preventDefault();
      dom.helpDialog.showModal();
    } else if (!dom.gameView.hidden && !dom.sessionComplete.hidden) {
      return;
    } else if (!dom.gameView.hidden && !dom.phaseOverlay.hidden) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dom.phaseOverlay.hidden = true;
        dom.actionButton.focus();
      }
    } else if (!dom.gameView.hidden) {
      if (event.key === " ") {
        event.preventDefault();
        toggleTimer();
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (state.answerShown) nextRound();
        else primaryAction();
      } else if (/^[1-4]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        if (index < config.teams) awardTeam(index);
      }
    }
  });

  loadPreferences();
  updateSetupSummary();

  if (!cards.length) {
    dom.startButton.disabled = true;
    dom.startSummary.textContent = "Card data could not be loaded";
  }

  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) {
    dom.fullscreenButton.hidden = true;
  }
})();
