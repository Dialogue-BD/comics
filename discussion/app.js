(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const topicById = (id) => FGD_TOPICS.find((topic) => topic.id === Number(id));
  const phaseById = (id) => FGD_PHASES.find((phase) => phase.id === id) || FGD_PHASES[0];
  const activePhaseIds = FGD_PHASES.map((phase) => phase.id);
  const observationLabels = {
    language: "English range & clarity",
    interaction: "Active listening & interaction",
    perspective: "Evidence & perspective-taking",
    teamwork: "Equitable teamwork & decisions"
  };

  const state = {
    mode: "landing",
    code: "",
    session: null,
    teacherToken: "",
    participantToken: "",
    selectedRoom: null,
    promptIndex: 0,
    perspectiveIndex: 0,
    lastTopicId: null,
    lastSupportLevel: null,
    lastPhaseId: null,
    clockOffsetMs: 0,
    pollTimer: null,
    clockTimer: null,
    toastTimer: null
  };

  const paceDurations = {
    25: { understand: 120, "first-voices": 240, explore: 300, challenge: 180, decide: 180, report: 120, reflect: 60 },
    35: { understand: 180, "first-voices": 300, explore: 420, challenge: 300, decide: 240, report: 120, reflect: 90 },
    45: { understand: 240, "first-voices": 360, explore: 600, challenge: 420, decide: 360, report: 180, reflect: 120 }
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) { /* handled below */ }
    if (!response.ok) {
      const error = new Error(payload.error || "The classroom server did not respond.");
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function showView(id) {
    $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === id));
    window.scrollTo({ top: 0 });
  }

  function updateUrl(params = {}) {
    const url = new URL(window.location.href);
    url.search = "";
    Object.entries(params).forEach(([key, value]) => value && url.searchParams.set(key, value));
    history.replaceState({}, "", url);
  }

  function makeTeacherControlUrl() {
    const url = new URL("./", window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("teacher", state.code);
    url.hash = new URLSearchParams({ control: state.teacherToken }).toString();
    return url.toString();
  }

  function setTeacherControlUrl() {
    history.replaceState({}, "", makeTeacherControlUrl());
  }

  function participantStorageKey(code) { return `fgd-participant:${code}`; }
  function teacherStorageKey(code) { return `fgd-teacher:${code}`; }

  function shuffled(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function setClock(session) {
    if (session?.serverTime) state.clockOffsetMs = (session.serverTime * 1000) - Date.now();
  }

  function currentRoom() {
    const roomNumber = state.session?.participant?.roomNumber;
    return state.session?.rooms?.find((room) => room.number === roomNumber);
  }

  function selectedOption(value, expected) {
    return value === expected ? "selected" : "";
  }

  function formatTime(totalSeconds, overtime = false) {
    const safe = Math.max(0, Math.abs(Math.floor(totalSeconds)));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${overtime ? "+" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function phaseTime() {
    const session = state.session;
    if (!session || !session.phaseStartedAt || !session.phaseDurations?.[session.status]) return null;
    const now = Date.now() + state.clockOffsetMs;
    const elapsed = Math.floor((now - session.phaseStartedAt * 1000) / 1000);
    return session.phaseDurations[session.status] - elapsed;
  }

  function updateClocks() {
    const remaining = phaseTime();
    const displays = [$("#teacher-timer"), $("#student-timer")].filter(Boolean);
    displays.forEach((display) => {
      if (remaining === null) {
        display.textContent = "—:—";
        display.classList.remove("is-overtime");
      } else {
        display.textContent = formatTime(remaining, remaining < 0);
        display.classList.toggle("is-overtime", remaining < 0);
      }
    });
  }

  function startClock() {
    clearInterval(state.clockTimer);
    updateClocks();
    state.clockTimer = setInterval(updateClocks, 1000);
  }

  function startPolling() {
    clearInterval(state.pollTimer);
    state.pollTimer = setInterval(refreshSession, state.mode === "teacher" ? 2500 : 4000);
  }

  async function refreshSession() {
    if (!state.code || !["teacher", "student", "picker"].includes(state.mode)) return;
    const params = new URLSearchParams({ code: state.code });
    if (state.mode === "teacher") params.set("teacherToken", state.teacherToken);
    if (state.mode === "student") params.set("participantToken", state.participantToken);
    try {
      const session = await api(`../api/fgd/session?${params}`);
      state.session = session;
      setClock(session);
      if (state.mode === "teacher") renderTeacher();
      if (state.mode === "student") renderStudent();
      if (state.mode === "picker") renderRoomPicker();
    } catch (error) {
      if ([403, 404].includes(error.status) && state.mode === "teacher") {
        localStorage.removeItem(teacherStorageKey(state.code));
        clearInterval(state.pollTimer);
        state.mode = "landing";
        updateUrl();
        showView("landing-view");
      } else if ([403, 404].includes(error.status) && state.mode === "student") {
        const roomCode = state.code;
        localStorage.removeItem(participantStorageKey(state.code));
        clearInterval(state.pollTimer);
        state.mode = "landing";
        updateUrl({ code: roomCode });
        showView("landing-view");
        if (error.status === 403) {
          try {
            await lookupSession(roomCode);
            showToast("Choose your room and enter the same name to rejoin.");
            return;
          } catch (_) { /* show the original actionable error below */ }
        }
      }
      if (state.mode !== "picker") showToast(error.message);
    }
  }

  async function lookupSession(code) {
    const normalized = String(code || "").replace(/\s+/g, "").toUpperCase().slice(0, 5);
    if (normalized.length !== 5) throw new Error("Enter the five-character session code.");
    const session = await api(`../api/fgd/session?code=${encodeURIComponent(normalized)}`);
    if (session.status === "ended") throw new Error("This discussion has finished. Ask your teacher for the current code.");
    state.code = normalized;
    state.session = session;
    state.mode = "picker";
    state.selectedRoom = null;
    setClock(session);
    $("#picker-code").textContent = normalized;
    renderRoomPicker();
    showView("picker-view");
    updateUrl({ code: normalized });
    startPolling();
  }

  function seatDots(room) {
    return Array.from({ length: room.capacity }, (_, index) => `<i class="${index < room.participantCount ? "is-filled" : ""}"></i>`).join("");
  }

  function renderRoomPicker() {
    if (!state.session) return;
    const grid = $("#room-picker-grid");
    grid.innerHTML = state.session.rooms.map((room) => {
      const full = room.participantCount >= room.capacity;
      const selected = state.selectedRoom === room.number;
      return `<button class="room-choice ${selected ? "is-selected" : ""} ${full ? "is-full" : ""}" type="button" data-room="${room.number}" aria-pressed="${selected}">
        <span class="room-choice-top"><strong>Room ${room.number}</strong><small>${full ? "Full · rejoin only" : `${room.participantCount} phone${room.participantCount === 1 ? "" : "s"}`}</small></span>
        <span class="seat-dots" aria-label="${room.participantCount} phones connected; up to ${room.capacity}">${seatDots(room)}</span>
      </button>`;
    }).join("");
    $$(".room-choice", grid).forEach((button) => button.addEventListener("click", () => selectRoom(Number(button.dataset.room))));
    if (state.session.supportLevel !== "student-choice") {
      $("#student-level").value = state.session.supportLevel;
      $("#student-level").disabled = true;
    } else {
      $("#student-level").disabled = false;
    }
  }

  function selectRoom(roomNumber) {
    state.selectedRoom = roomNumber;
    $("#selected-room").value = roomNumber;
    $("#selected-room-label").textContent = `Room ${roomNumber}`;
    $("#join-room-button").disabled = false;
    renderRoomPicker();
  }

  async function createSession(event) {
    event.preventDefault();
    const button = $("button[type='submit']", event.currentTarget);
    button.disabled = true;
    button.firstElementChild.textContent = "Opening rooms…";
    const roomCount = Number($("#room-count").value);
    const roomCapacity = Number($("#room-capacity").value);
    const supportLevel = $("#support-level").value;
    const pace = Number($("input[name='duration']:checked").value);
    const topicIds = shuffled(FGD_TOPICS.map((topic) => topic.id)).slice(0, roomCount);
    try {
      const result = await api("../api/fgd/sessions", {
        method: "POST",
        body: JSON.stringify({ roomCount, roomCapacity, supportLevel, topicIds, phaseDurations: paceDurations[pace] })
      });
      state.code = result.code;
      state.teacherToken = result.teacherToken;
      state.session = result.session;
      state.mode = "teacher";
      localStorage.setItem(teacherStorageKey(state.code), state.teacherToken);
      setClock(state.session);
      setTeacherControlUrl();
      renderTeacher(true);
      showView("teacher-view");
      startPolling();
      startClock();
    } catch (error) {
      showToast(error.message);
    } finally {
      button.disabled = false;
      button.firstElementChild.textContent = "Create rooms";
    }
  }

  async function joinRoom(event) {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const level = $("#student-level").value;
    if (!name || !state.selectedRoom) return showToast("Enter your name and choose a room.");
    const button = $("#join-room-button");
    button.disabled = true;
    button.textContent = "Joining…";
    try {
      const result = await api("../api/fgd/join", {
        method: "POST",
        body: JSON.stringify({ code: state.code, name, level, roomNumber: state.selectedRoom })
      });
      state.participantToken = result.participantToken;
      state.session = result.session;
      state.mode = "student";
      localStorage.setItem(participantStorageKey(state.code), state.participantToken);
      setClock(state.session);
      updateUrl({ code: state.code });
      renderStudent(true);
      showView("student-view");
      startPolling();
      startClock();
      if (result.rejoined) showToast("Welcome back—your room has been restored");
    } catch (error) {
      showToast(error.message);
      await refreshSession();
    } finally {
      button.disabled = false;
      button.textContent = "Join room →";
    }
  }

  function makeJoinUrl() {
    const url = new URL("./", window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("code", state.code);
    return url.toString();
  }

  function renderQr() {
    const target = $("#session-qr");
    if (!target || target.dataset.code === state.code) return;
    target.innerHTML = "";
    target.dataset.code = state.code;
    new QRCode(target, { text: makeJoinUrl(), width: 180, height: 180, colorDark: "#17332f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  }

  function renderPhaseTrack() {
    const currentIndex = activePhaseIds.indexOf(state.session.status);
    const track = $("#teacher-phase-track");
    track.innerHTML = FGD_PHASES.filter((phase) => phase.id !== "ended").map((phase) => {
      const index = activePhaseIds.indexOf(phase.id);
      const cls = index === currentIndex ? "is-current" : index < currentIndex ? "is-past" : "";
      return `<button type="button" class="${cls}" data-phase="${phase.id}">${escapeHtml(phase.icon)} ${escapeHtml(phase.label)}</button>`;
    }).join("");
    $$("button", track).forEach((button) => button.addEventListener("click", () => setTeacherPhase(button.dataset.phase)));
  }

  function observationMarkup(room) {
    const observation = room.observation || {};
    const fields = Object.entries(observationLabels).map(([dimension, label]) => `<label>${escapeHtml(label)}
      <select data-observation-field="${dimension}">
        <option value="" ${selectedOption(observation[dimension], "")}>Not observed</option>
        <option value="emerging" ${selectedOption(observation[dimension], "emerging")}>Emerging</option>
        <option value="developing" ${selectedOption(observation[dimension], "developing")}>Developing</option>
        <option value="strong" ${selectedOption(observation[dimension], "strong")}>Strong evidence</option>
      </select></label>`).join("");
    return `<details class="observation-panel" data-observation-room="${room.number}">
      <summary>Teacher formative observation</summary>
      <div class="observation-grid">${fields}
        <label class="observation-note">Evidence note<textarea data-observation-field="note" maxlength="300" placeholder="What did students actually say or do?">${escapeHtml(observation.note || "")}</textarea></label>
        <button class="secondary-button wide" type="button" data-save-observation="${room.number}">Save observation</button>
      </div>
    </details>`;
  }

  function renderTeacher(initial = false) {
    const session = state.session;
    if (!session) return;
    $("#teacher-code").textContent = session.code;
    $("#projector-code").textContent = session.code;
    renderQr();
    const phase = phaseById(session.status);
    const lobby = session.status === "lobby";
    $("#phase-status-dot").classList.toggle("is-live", !lobby && session.status !== "ended");
    $("#teacher-phase-kicker").textContent = lobby ? "Lobby open" : session.status === "ended" ? "Session ended" : `${phase.label} · live now`;
    $("#teacher-phase-title").textContent = lobby ? "Students are choosing rooms" : phase.short;
    $("#teacher-phase-prompt").textContent = phase.prompt;
    const index = activePhaseIds.indexOf(session.status);
    $("#previous-phase").disabled = index <= 0 || session.status === "ended";
    $("#extend-phase").hidden = lobby || session.status === "ended";
    const nextButton = $("#next-phase");
    nextButton.hidden = session.status === "ended";
    nextButton.textContent = lobby ? "Reveal topics →" : session.status === "reflect" ? "Finish session →" : `Next: ${phaseById(activePhaseIds[index + 1]).label} →`;
    renderPhaseTrack();

    const totalDevices = session.rooms.reduce((sum, room) => sum + room.participantCount, 0);
    $("#class-count").textContent = `${totalDevices} connected phone${totalDevices === 1 ? "" : "s"} · ${session.roomCount} rooms`;
    $("#teacher-room-grid").innerHTML = session.rooms.map((room) => {
      const topic = topicById(room.topicId);
      const participantHtml = room.participants?.length
        ? room.participants.map((person) => `<span class="participant-chip"><b>${escapeHtml(person.name)}</b></span>`).join("")
        : `<span class="participant-chip">Waiting for a phone to connect</span>`;
      const report = room.report || {};
      const reportHtml = report.strongestInsight || report.recommendation
        ? `<div class="report-preview"><strong>${escapeHtml(report.position || "Room report")}</strong>${escapeHtml(report.strongestInsight || report.recommendation)}</div>`
        : "";
      return `<article class="teacher-room-card ${room.helpRequested ? "needs-help" : ""}">
        <div class="room-card-head"><span class="room-number-badge"><i></i> Room ${room.number}</span><span class="occupancy">${room.participantCount} phone${room.participantCount === 1 ? "" : "s"}</span></div>
        <h3 class="${lobby ? "topic-secret" : ""}">${lobby ? "Topic waiting under wraps" : escapeHtml(topic?.title || "Discussion topic")}</h3>
        <div class="participant-chips">${participantHtml}</div>
        ${room.helpRequested ? `<div class="help-banner"><span>Room ${room.number} is asking for help</span><button type="button" data-clear-help="${room.number}">Clear</button></div>` : ""}
        ${reportHtml}
        ${observationMarkup(room)}
      </article>`;
    }).join("");
    $$('[data-clear-help]').forEach((button) => button.addEventListener("click", () => teacherAction("clearHelp", { roomNumber: Number(button.dataset.clearHelp) })));
    $$('[data-save-observation]').forEach((button) => button.addEventListener("click", () => saveObservation(Number(button.dataset.saveObservation))));
    if (initial) startClock();
    updateClocks();
  }

  function saveObservation(roomNumber) {
    const panel = $(`[data-observation-room="${roomNumber}"]`);
    const observation = {};
    $$('[data-observation-field]', panel).forEach((field) => { observation[field.dataset.observationField] = field.value; });
    teacherAction("observe", { roomNumber, observation });
  }

  async function teacherAction(action, extra = {}) {
    try {
      state.session = await api("../api/fgd/teacher", {
        method: "POST",
        body: JSON.stringify({ code: state.code, teacherToken: state.teacherToken, action, ...extra })
      });
      setClock(state.session);
      renderTeacher();
    } catch (error) { showToast(error.message); }
  }

  function setTeacherPhase(phase) {
    if (!activePhaseIds.includes(phase) || phase === state.session.status) return;
    teacherAction("setPhase", { phase });
  }

  function nextTeacherPhase() {
    const index = activePhaseIds.indexOf(state.session.status);
    const next = activePhaseIds[Math.min(index + 1, activePhaseIds.length - 1)];
    setTeacherPhase(next);
  }

  function previousTeacherPhase() {
    const index = activePhaseIds.indexOf(state.session.status);
    const previous = activePhaseIds[Math.max(0, index - 1)];
    setTeacherPhase(previous);
  }

  function sharedCardContent(topic) {
    const room = currentRoom();
    const phase = state.session.status;
    if (phase === "understand") return {
      label: "Clarify the question together",
      text: "What does the question mean, and which words or assumptions need clarification?",
      detail: "Open the English support only if someone needs it. The goal is shared understanding, not completing an app task."
    };
    if (phase === "first-voices") return {
      label: "One uninterrupted first turn each",
      text: topic.question,
      detail: "Give your initial view and one reason. Listen for differences; do not debate until everyone has been invited."
    };
    if (phase === "explore") return {
      label: `Shared question ${(room.promptIndex % topic.questions.length) + 1}`,
      text: topic.questions[room.promptIndex % topic.questions.length],
      detail: "Listen → link → ask. Stay with this question until the group has examined a reason, example, or consequence."
    };
    if (phase === "challenge") {
      const perspective = topic.perspectives[room.perspectiveIndex % topic.perspectives.length];
      return {
        label: `Perspective ${(room.perspectiveIndex % topic.perspectives.length) + 1}`,
        text: `Imagine you are ${perspective.toLowerCase()}.`,
        detail: "What would this person need, fear, value, or question? Paraphrase the lens before responding from your own position."
      };
    }
    if (phase === "decide") return {
      label: "Group synthesis",
      text: topic.finalTask,
      detail: "Name shared ground, a realistic recommendation, and one concern the group could not resolve."
    };
    if (phase === "report") return {
      label: "Draft → review → revise",
      text: "Draft the room summary together on any available phone, then read it aloud and revise it.",
      detail: "A fair report preserves both the strongest agreement and an unresolved or minority view."
    };
    if (phase === "reflect" || phase === "ended") return {
      label: "Optional closing reflection",
      text: "What changed or strengthened because different people contributed?",
      detail: "Reflect if it is useful. No individual tracking is required."
    };
    return { label: "Room task", text: phaseById(phase).prompt, detail: "" };
  }

  function renderCompass(topic) {
    const content = sharedCardContent(topic);
    $("#now-card-label").textContent = content.label;
    $("#now-card-text").textContent = content.text;
    $("#now-card-detail").textContent = content.detail;
    $("#next-room-card").hidden = !["explore", "challenge"].includes(state.session.status);
    const protocol = FGD_TEAMWORK_PROTOCOLS[state.session.status] || FGD_TEAMWORK_PROTOCOLS.reflect;
    $("#protocol-name").textContent = protocol.name;
    $("#protocol-text").textContent = protocol.text;
  }

  function renderScaffolds(topic, level) {
    $("#phrase-list").innerHTML = FGD_PHRASE_BANK[level].map((item) => `<button class="phrase-item" type="button" data-copy="${escapeHtml(item.phrase)}"><span>${escapeHtml(item.intent)}</span><p>${escapeHtml(item.phrase)}</p></button>`).join("");
    $$('[data-copy]', $("#phrase-list")).forEach((button) => button.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(button.dataset.copy); showToast("Phrase copied"); } catch (_) { showToast("Say it aloud, then adapt it."); }
    }));
    $("#topic-chunks").innerHTML = `<h3>Topic language</h3><div class="chip-wrap">${topic.topicChunks.map((chunk) => `<span class="language-chip">${escapeHtml(chunk)}</span>`).join("")}</div>`;
    $("#vocab-list").innerHTML = topic.vocabulary.map(([word, bn, meaning, example]) => `<details class="vocab-item"><summary><strong>${escapeHtml(word)}</strong><span lang="bn">${escapeHtml(bn)}</span></summary><div class="vocab-body"><button class="speak-word" type="button" data-speak="${escapeHtml(word)}" aria-label="Hear ${escapeHtml(word)}">🔊</button>${escapeHtml(meaning)}<em>“${escapeHtml(example)}”</em></div></details>`).join("");
    $$('[data-speak]').forEach((button) => button.addEventListener("click", () => speak(button.dataset.speak)));
    $("#collocation-list").innerHTML = `<h3>Words that travel together</h3><div class="chip-wrap">${topic.collocations.map((item) => `<span class="language-chip">${escapeHtml(item)}</span>`).join("")}</div>`;
    $("#grammar-list").innerHTML = topic.grammar.map(([name, pattern, example]) => `<article class="grammar-item"><h3>${escapeHtml(name)}</h3><code>${escapeHtml(pattern)}</code><p>${escapeHtml(example)}</p></article>`).join("");
    renderPrompt(topic);
    $("#socratic-bank").innerHTML = `<h3>Socratic questions for the group</h3><div>${FGD_SOCRATIC_QUESTIONS.map((item) => `<article><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.question)}</p></article>`).join("")}</div>`;
    $("#perspective-box").innerHTML = `<h3>Change the lens</h3><ol>${topic.perspectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><p><strong>Final group task:</strong> ${escapeHtml(topic.finalTask)}</p>`;
  }

  function renderPrompt(topic) {
    const room = currentRoom();
    const challenge = state.session?.status === "challenge";
    const prompt = challenge
      ? `Imagine you are ${topic.perspectives[room.perspectiveIndex % topic.perspectives.length].toLowerCase()}. How might your view be different?`
      : topic.questions[room.promptIndex % topic.questions.length];
    $("#live-prompt-card").textContent = prompt;
    $("#next-prompt").hidden = !["explore", "challenge"].includes(state.session.status);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return showToast("Speech is not available on this device.");
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = .82;
    speechSynthesis.speak(utterance);
  }

  function renderStudent(initial = false) {
    const session = state.session;
    const participant = session?.participant;
    if (!session || !participant) return;
    $("#student-room-number").textContent = `Room ${participant.roomNumber}`;
    $("#student-session-code").textContent = `Session ${session.code}`;
    $("#student-name-label").textContent = participant.name;
    $("#student-level-label").textContent = `${participant.level} support`;
    const room = currentRoom();
    $("#help-button").classList.toggle("is-active", Boolean(room?.helpRequested));
    $("#help-button strong").textContent = room?.helpRequested ? "Teacher notified" : "Ask the teacher";

    const lobby = session.status === "lobby";
    $("#waiting-card").hidden = !lobby;
    $("#active-room-content").hidden = lobby;
    if (lobby) return;

    const topic = topicById(room?.topicId);
    if (!topic) return;
    const phase = phaseById(session.status);
    $("#student-phase-icon").textContent = phase.icon;
    $("#student-phase-label").textContent = phase.label;
    $("#student-phase-short").textContent = phase.short;
    if (state.lastPhaseId !== session.status) {
      $("#phase-compass").open = ["report", "reflect", "ended"].includes(session.status);
      state.lastPhaseId = session.status;
    }
    $("#student-topic-category").textContent = topic.category;
    $("#student-topic-title").textContent = topic.question;
    $("#student-topic-bangla").textContent = topic.bn;
    $("#student-topic-context").textContent = topic.context;
    if (state.lastTopicId !== topic.id || state.lastSupportLevel !== participant.level) {
      renderScaffolds(topic, participant.level);
      state.lastTopicId = topic.id;
      state.lastSupportLevel = participant.level;
    }
    renderPrompt(topic);
    renderCompass(topic);

    const reportVisible = session.status === "report";
    $("#group-report").hidden = !reportVisible;
    $("#reflection-card").hidden = !["reflect", "ended"].includes(session.status);
    if (reportVisible) {
      hydrateReport(room.report || {});
      $$("input, select, textarea, button[type='submit']", $("#report-form")).forEach((field) => { field.disabled = false; });
      $("#report-status").textContent = room.report?.updatedBy
        ? `Last saved by ${room.report.updatedBy}`
        : "Draft together, read the summary aloud, and revise anything the group says is missing.";
    }
    if ((participant.exit?.teammateIdea || participant.exit?.teamworkMoment || participant.exit?.confidence) && !$("#reflection-teammate").value) {
      $("#reflection-phrase").value = participant.exit.phrase || "";
      $("#reflection-teammate").value = participant.exit.teammateIdea || "";
      $("#reflection-teamwork").value = participant.exit.teamworkMoment || "";
      $("#reflection-next").value = participant.exit.nextStep || "";
      $("#reflection-status").textContent = "✓ Reflection saved";
    }
    if (session.status === "ended") showToast("This discussion is complete. Thank you for contributing.");
    if (initial) startClock();
    updateClocks();
  }

  function hydrateReport(report) {
    const form = $("#report-form");
    if (form.contains(document.activeElement)) return;
    if (report.position) $("#report-position").value = report.position;
    if (report.strongestInsight && !$("#report-insight").value) $("#report-insight").value = report.strongestInsight;
    if (report.agreement && !$("#report-agreement").value) $("#report-agreement").value = report.agreement;
    if (report.unresolved && !$("#report-unresolved").value) $("#report-unresolved").value = report.unresolved;
    if (report.recommendation && !$("#report-recommendation").value) $("#report-recommendation").value = report.recommendation;
    if (report.updatedBy) $("#report-status").textContent = `Last saved by ${report.updatedBy}`;
  }

  async function participantAction(action, extra = {}) {
    try {
      state.session = await api("../api/fgd/action", {
        method: "POST",
        body: JSON.stringify({ code: state.code, participantToken: state.participantToken, action, ...extra })
      });
      setClock(state.session);
      renderStudent();
      return true;
    } catch (error) {
      showToast(error.message);
      return false;
    }
  }

  async function submitReport(event) {
    event.preventDefault();
    const report = {
      position: $("#report-position").value,
      strongestInsight: $("#report-insight").value,
      agreement: $("#report-agreement").value,
      unresolved: $("#report-unresolved").value,
      recommendation: $("#report-recommendation").value
    };
    const saved = await participantAction("report", { report });
    if (saved) $("#report-status").textContent = "✓ Room report saved";
  }

  async function submitReflection(event) {
    event.preventDefault();
    const confidence = 3;
    const phrase = $("#reflection-phrase").value.trim();
    const teammateIdea = $("#reflection-teammate").value.trim();
    const teamworkMoment = $("#reflection-teamwork").value.trim();
    const nextStep = $("#reflection-next").value.trim();
    const saved = await participantAction("exit", { exit: { phrase, confidence, teammateIdea, teamworkMoment, nextStep } });
    if (saved) $("#reflection-status").textContent = "✓ Reflection saved";
  }

  async function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const privateParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const teacherCode = (params.get("teacher") || "").toUpperCase();
    const joinCode = (params.get("code") || "").toUpperCase();
    if (teacherCode) {
      const token = privateParams.get("control") || localStorage.getItem(teacherStorageKey(teacherCode));
      if (token) {
        state.code = teacherCode;
        state.teacherToken = token;
        state.mode = "teacher";
        try {
          state.session = await api(`../api/fgd/session?code=${encodeURIComponent(teacherCode)}&teacherToken=${encodeURIComponent(token)}`);
          setClock(state.session);
          renderTeacher(true);
          showView("teacher-view");
          startPolling();
          startClock();
          localStorage.setItem(teacherStorageKey(teacherCode), token);
          setTeacherControlUrl();
          return;
        } catch (error) {
          localStorage.removeItem(teacherStorageKey(teacherCode));
          state.mode = "landing";
          showToast(error.message);
        }
      } else {
        showToast("Open the private teacher control link, or create a new session.");
      }
    }
    if (joinCode) {
      const token = localStorage.getItem(participantStorageKey(joinCode));
      if (token) {
        try {
          const session = await api(`../api/fgd/session?code=${encodeURIComponent(joinCode)}&participantToken=${encodeURIComponent(token)}`);
          if (session.participant) {
            state.code = joinCode;
            state.participantToken = token;
            state.session = session;
            state.mode = "student";
            setClock(session);
            renderStudent(true);
            showView("student-view");
            startPolling();
            startClock();
            return;
          }
        } catch (_) { localStorage.removeItem(participantStorageKey(joinCode)); }
      }
      try { await lookupSession(joinCode); } catch (error) { showToast(error.message); }
    }
  }

  function bindEvents() {
    $("#create-session-form").addEventListener("submit", createSession);
    $("#join-session-form").addEventListener("submit", joinRoom);
    $("#copy-join-link").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(makeJoinUrl()); showToast("Join link copied"); } catch (_) { showToast(makeJoinUrl()); }
    });
    $("#copy-control-link").addEventListener("click", async () => {
      const controlUrl = makeTeacherControlUrl();
      try { await navigator.clipboard.writeText(controlUrl); showToast("Private teacher link copied—keep it private"); } catch (_) { showToast("Copy the private URL from your browser address bar."); }
    });
    $("#next-phase").addEventListener("click", nextTeacherPhase);
    $("#previous-phase").addEventListener("click", previousTeacherPhase);
    $("#extend-phase").addEventListener("click", () => teacherAction("extendPhase", { seconds: 120 }));
    $("#end-session").addEventListener("click", () => {
      if (window.confirm("End this discussion session for every room?")) setTeacherPhase("ended");
    });
    $("#help-button").addEventListener("click", () => participantAction("help", { requested: !currentRoom()?.helpRequested }));
    $("#toggle-bangla").addEventListener("click", (event) => {
      const pressed = event.currentTarget.getAttribute("aria-pressed") === "true";
      event.currentTarget.setAttribute("aria-pressed", String(!pressed));
      $("#student-topic-bangla").hidden = pressed;
    });
    $$("#scaffold-tabs button").forEach((button) => button.addEventListener("click", () => {
      $$("#scaffold-tabs button").forEach((item) => item.classList.toggle("is-active", item === button));
      $$(".scaffold-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `panel-${button.dataset.panel}`));
    }));
    $("#next-prompt").addEventListener("click", () => participantAction("advanceCard"));
    $("#next-room-card").addEventListener("click", () => participantAction("advanceCard"));
    $("#report-form").addEventListener("submit", submitReport);
    $("#reflection-form").addEventListener("submit", submitReflection);
    const dialog = $("#about-dialog");
    $("#install-help").addEventListener("click", () => dialog.showModal());
    $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    restoreFromUrl();
  });
})();
