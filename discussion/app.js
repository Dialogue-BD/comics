(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const topicById = (id) => FGD_TOPICS.find((topic) => topic.id === Number(id));
  const phaseById = (id) => FGD_PHASES.find((phase) => phase.id === id) || FGD_PHASES[0];
  const activePhaseIds = FGD_PHASES.map((phase) => phase.id);

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
    if (!response.ok) throw new Error(payload.error || "The classroom server did not respond.");
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
      if (state.mode !== "picker") showToast(error.message);
    }
  }

  async function lookupSession(code) {
    const normalized = String(code || "").replace(/\s+/g, "").toUpperCase().slice(0, 5);
    if (normalized.length !== 5) throw new Error("Enter the five-character session code.");
    const session = await api(`../api/fgd/session?code=${encodeURIComponent(normalized)}`);
    if (session.status !== "lobby") throw new Error("This session has already started. Ask your teacher for help.");
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
    if (state.session.status !== "lobby") {
      showToast("The teacher has started. Ask for help if you have not joined.");
      return;
    }
    const grid = $("#room-picker-grid");
    grid.innerHTML = state.session.rooms.map((room) => {
      const full = room.participantCount >= room.capacity;
      const selected = state.selectedRoom === room.number;
      return `<button class="room-choice ${selected ? "is-selected" : ""}" type="button" data-room="${room.number}" aria-pressed="${selected}" ${full ? "disabled" : ""}>
        <span class="room-choice-top"><strong>Room ${room.number}</strong><small>${full ? "Full" : `${room.capacity - room.participantCount} seats`}</small></span>
        <span class="seat-dots" aria-label="${room.participantCount} of ${room.capacity} seats filled">${seatDots(room)}</span>
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
      updateUrl({ teacher: state.code });
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

    const totalStudents = session.rooms.reduce((sum, room) => sum + room.participantCount, 0);
    $("#class-count").textContent = `${totalStudents} student${totalStudents === 1 ? "" : "s"} joined · ${session.roomCount} rooms`;
    $("#teacher-room-grid").innerHTML = session.rooms.map((room) => {
      const topic = topicById(room.topicId);
      const participantHtml = room.participants?.length
        ? room.participants.map((person) => `<span class="participant-chip"><b>${escapeHtml(person.name)}</b> · ${escapeHtml(person.role)} · ${person.contributions} turn${person.contributions === 1 ? "" : "s"}</span>`).join("")
        : `<span class="participant-chip">Waiting for students</span>`;
      const report = room.report || {};
      const reportHtml = report.strongestInsight || report.recommendation
        ? `<div class="report-preview"><strong>${escapeHtml(report.position || "Room report")}</strong>${escapeHtml(report.strongestInsight || report.recommendation)}</div>`
        : "";
      return `<article class="teacher-room-card ${room.helpRequested ? "needs-help" : ""}">
        <div class="room-card-head"><span class="room-number-badge"><i></i> Room ${room.number}</span><span class="occupancy">${room.participantCount}/${room.capacity}</span></div>
        <h3 class="${lobby ? "topic-secret" : ""}">${lobby ? "Topic waiting under wraps" : escapeHtml(topic?.title || "Discussion topic")}</h3>
        <div class="participant-chips">${participantHtml}</div>
        <div class="room-stats"><span>✓ ${room.contributionCount || 0} contributions</span><span>🌱 ${room.exitCount || 0} reflections</span></div>
        ${room.helpRequested ? `<div class="help-banner"><span>Room ${room.number} is asking for help</span><button type="button" data-clear-help="${room.number}">Clear</button></div>` : ""}
        ${reportHtml}
      </article>`;
    }).join("");
    $$('[data-clear-help]').forEach((button) => button.addEventListener("click", () => teacherAction("clearHelp", { roomNumber: Number(button.dataset.clearHelp) })));
    if (initial) startClock();
    updateClocks();
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

  function renderRole(target, compact = false) {
    const roleName = state.session?.participant?.role;
    const role = FGD_ROLES[roleName];
    if (!target || !role) return;
    target.innerHTML = compact
      ? `<span style="font-size:1.5rem">${role.icon}</span><p style="margin:0 0 0 10px"><small style="color:var(--ink-soft)">Your discussion role</small><strong style="display:block">${escapeHtml(roleName)}</strong></p>`
      : `<span class="role-icon">${role.icon}</span><p class="eyebrow" style="color:#9fd1c8;margin-top:10px">Your discussion role</p><h2>${escapeHtml(roleName)}</h2><p>${escapeHtml(role.job)}</p><ul>${role.phrases.map((phrase) => `<li>${escapeHtml(phrase)}</li>`).join("")}</ul>`;
    if (compact) target.style.display = "flex";
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
    state.promptIndex = Math.min(state.promptIndex, topic.questions.length - 1);
    renderPrompt(topic);
    $("#perspective-box").innerHTML = `<h3>Change the lens</h3><ol>${topic.perspectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><p><strong>Final group task:</strong> ${escapeHtml(topic.finalTask)}</p>`;
    renderRole($("#student-role-card"));
  }

  function renderPrompt(topic) {
    const challenge = state.session?.status === "challenge";
    const prompt = challenge
      ? `Imagine you are ${topic.perspectives[state.perspectiveIndex % topic.perspectives.length].toLowerCase()}. How might your view be different?`
      : topic.questions[state.promptIndex % topic.questions.length];
    $("#live-prompt-card").textContent = prompt;
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
    $("#contribution-label").textContent = participant.contributions ? `${participant.contributions} contribution${participant.contributions === 1 ? "" : "s"} marked` : "Tap after you speak";
    const room = currentRoom();
    $("#help-button").classList.toggle("is-active", Boolean(room?.helpRequested));
    $("#help-button strong").textContent = room?.helpRequested ? "Teacher notified" : "Ask the teacher";

    const lobby = session.status === "lobby";
    $("#waiting-card").hidden = !lobby;
    $("#active-room-content").hidden = lobby;
    if (lobby) {
      renderRole($("#waiting-role"), true);
      return;
    }

    const topic = topicById(room?.topicId);
    if (!topic) return;
    const phase = phaseById(session.status);
    $("#student-phase-icon").textContent = phase.icon;
    $("#student-phase-label").textContent = phase.label;
    $("#student-phase-short").textContent = phase.short;
    $("#student-phase-prompt").textContent = session.status === "decide" ? topic.finalTask : phase.prompt;
    $("#student-topic-category").textContent = topic.category;
    $("#student-topic-title").textContent = topic.question;
    $("#student-topic-bangla").textContent = topic.bn;
    $("#student-topic-context").textContent = topic.context;
    if (state.lastTopicId !== topic.id || state.lastSupportLevel !== participant.level) {
      renderScaffolds(topic, participant.level);
      state.lastTopicId = topic.id;
      state.lastSupportLevel = participant.level;
    } else if (session.status === "challenge") {
      renderPrompt(topic);
    }

    const reportVisible = ["report", "reflect", "ended"].includes(session.status);
    $("#group-report").hidden = !reportVisible;
    $("#reflection-card").hidden = !["reflect", "ended"].includes(session.status);
    if (reportVisible) hydrateReport(room.report || {});
    if (participant.exit?.phrase && !$("#reflection-phrase").value) {
      $("#reflection-phrase").value = participant.exit.phrase;
      const input = $(`#confidence-${participant.exit.confidence}`);
      if (input) input.checked = true;
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

  function buildConfidenceScale() {
    const emoji = ["😟", "😕", "😐", "🙂", "🌟"];
    $("#confidence-scale").innerHTML = emoji.map((face, index) => `<label><input id="confidence-${index + 1}" type="radio" name="confidence" value="${index + 1}" ${index === 2 ? "checked" : ""}><span title="${index + 1} out of 5">${face}</span></label>`).join("");
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
    const confidence = Number($("input[name='confidence']:checked").value);
    const phrase = $("#reflection-phrase").value.trim();
    const saved = await participantAction("exit", { exit: { phrase, confidence } });
    if (saved) $("#reflection-status").textContent = "✓ Reflection saved";
  }

  async function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    const teacherCode = (params.get("teacher") || "").toUpperCase();
    const joinCode = (params.get("code") || "").toUpperCase();
    if (teacherCode) {
      const token = localStorage.getItem(teacherStorageKey(teacherCode));
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
          return;
        } catch (error) { showToast(error.message); }
      }
    }
    if (joinCode) {
      $("#join-code").value = joinCode;
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
    $("#join-code").addEventListener("input", (event) => { event.target.value = event.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5); });
    $("#join-lookup-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      try { await lookupSession($("#join-code").value); } catch (error) { showToast(error.message); }
    });
    $("#create-session-form").addEventListener("submit", createSession);
    $("#join-session-form").addEventListener("submit", joinRoom);
    $("#picker-back").addEventListener("click", () => { state.mode = "landing"; clearInterval(state.pollTimer); updateUrl(); showView("landing-view"); });
    $("#copy-join-link").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(makeJoinUrl()); showToast("Join link copied"); } catch (_) { showToast(makeJoinUrl()); }
    });
    $("#next-phase").addEventListener("click", nextTeacherPhase);
    $("#previous-phase").addEventListener("click", previousTeacherPhase);
    $("#extend-phase").addEventListener("click", () => teacherAction("extendPhase", { seconds: 120 }));
    $("#end-session").addEventListener("click", () => {
      if (window.confirm("End this discussion session for every room?")) setTeacherPhase("ended");
    });
    $("#contributed-button").addEventListener("click", async () => {
      const saved = await participantAction("contribute");
      if (saved) showToast("Contribution marked — keep the talk moving!");
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
    $("#next-prompt").addEventListener("click", () => {
      const topic = topicById(currentRoom()?.topicId);
      if (!topic) return;
      if (state.session.status === "challenge") state.perspectiveIndex = (state.perspectiveIndex + 1) % topic.perspectives.length;
      else state.promptIndex = (state.promptIndex + 1) % topic.questions.length;
      renderPrompt(topic);
    });
    $("#report-form").addEventListener("submit", submitReport);
    $("#reflection-form").addEventListener("submit", submitReflection);
    const dialog = $("#about-dialog");
    $("#install-help").addEventListener("click", () => dialog.showModal());
    $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    buildConfidenceScale();
    restoreFromUrl();
  });
})();
