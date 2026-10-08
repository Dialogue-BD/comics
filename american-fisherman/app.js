(() => {
  "use strict";

  const S = FISHERMAN_STORY;
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ’'-]+/g;
  const PART_RE = /[A-Za-zÀ-ÖØ-öø-ÿ’'-]+|[^A-Za-zÀ-ÖØ-öø-ÿ’'-]+/g;
  const wordCount = text => (text.match(WORD_RE) || []).length;
  const lineStarts = [];
  let totalWords = 0;
  S.lines.forEach(line => { lineStarts.push(totalWords); totalWords += wordCount(line.text); });
  const script = S.lines.map(line => line.text).join("\n");
  const T = typeof FISHERMAN_TIMINGS !== "undefined" ? FISHERMAN_TIMINGS : null;
  const aligned = !!(T && Number.isFinite(T.dur) && T.script === script && Array.isArray(T.w) && T.w.length === totalWords);

  const audio = $("#audio");
  const play = $("#play");
  const timeline = $("#timeline");
  const stage = $("#cinema-stage");
  const world = $("#comic-world");
  const currentLine = $("#current-line");
  const transcript = $("#transcript");
  const audioStatus = $("#audio-status");
  const nextPass = $("#next-pass");
  const overviewToggle = $("#overview-toggle");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pass = 1;
  let lineIndex = 0;
  let wordIndex = -1;
  let raf = 0;
  let layoutMode = "";
  let worldItems = [];
  let worldSize = { width: 1, height: 1 };
  let overviewMode = true;
  let resizeTimer = 0;
  let cameraKey = "";

  const cameraBeats = (S.cameraBeats || []).map(beat => ({ ...beat,
    time: aligned ? T.w[lineStarts[beat.line] + beat.word][0] : Infinity }));

  function cameraBeatAt(time) {
    // Begin the short pan just before the spoken clause so the panel arrives
    // as its quantity is named. Seeking uses the same audio-clock mapping.
    return cameraBeats.filter(beat => beat.line === lineIndex && beat.time - .3 <= time).at(-1) || null;
  }

  $("#title").textContent = S.title;
  $("#title-bn").textContent = S.titleBn;
  $("#kicker").textContent = S.kicker;
  let recordingURL = "";
  const retry = $("#retry-audio");
  async function loadRecording() {
    play.disabled = true;
    retry.hidden = true;
    audioStatus.textContent = "Loading the storyteller…";
    try {
      if (!aligned) throw new Error("Exact word timing is missing or out of date.");
      const response = await fetch(S.audio + "?v=" + S.version);
      if (!response.ok) throw new Error("The recording couldn't be loaded.");
      const bytes = await response.arrayBuffer();
      const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(n => n.toString(16).padStart(2, "0")).join("");
      if (digest !== T.audio_sha256) throw new Error("The recording and word timing don't match. Refresh to load the current story.");
      if (recordingURL) URL.revokeObjectURL(recordingURL);
      recordingURL = URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
      audio.src = recordingURL;
      play.disabled = false;
      audioStatus.textContent = "";
    } catch (error) {
      audioStatus.textContent = error.message;
      retry.hidden = false;
    }
  }
  retry.addEventListener("click", loadRecording);

  const fmt = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    const n = Math.max(0, Math.round(seconds));
    return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
  };

  function parts(text) {
    const out = [];
    let word = -1;
    for (const match of text.matchAll(PART_RE)) {
      const isWord = /[A-Za-z]/.test(match[0]);
      if (isWord) word++;
      out.push({ value: match[0], start: match.index, end: match.index + match[0].length, word: isWord ? word : -1, isWord });
    }
    return out;
  }

  function plainLine(text, globalStart) {
    const box = document.createElement("span");
    parts(text).forEach(part => {
      if (!part.isWord) return box.append(document.createTextNode(part.value));
      const span = document.createElement("span");
      span.className = "word";
      span.dataset.local = part.word;
      span.dataset.global = globalStart + part.word;
      span.textContent = part.value;
      box.append(span);
    });
    return box;
  }

  function annotatedLine(text, line, globalStart) {
    const box = document.createElement("span");
    const ranges = [];
    S.glossary.filter(item => item.line === line).sort((a, b) => b.phrase.length - a.phrase.length).forEach(item => {
      const start = text.toLocaleLowerCase().indexOf(item.phrase.toLocaleLowerCase());
      if (start < 0) return;
      const end = start + item.phrase.length;
      if (!ranges.some(range => start < range.end && end > range.start)) ranges.push({ start, end, item });
    });
    ranges.sort((a, b) => a.start - b.start);
    let rangeAt = null;
    let parent = box;
    parts(text).forEach(part => {
      const range = ranges.find(r => part.start >= r.start && part.end <= r.end) || null;
      if (range !== rangeAt) {
        rangeAt = range;
        parent = box;
        if (range) {
          parent = document.createElement("button");
          parent.type = "button";
          parent.className = "phrase";
          parent.addEventListener("click", () => openGloss(range.item));
          box.append(parent);
        }
      }
      if (!part.isWord) return parent.append(document.createTextNode(part.value));
      const span = document.createElement("span");
      span.className = "word";
      span.dataset.local = part.word;
      span.dataset.global = globalStart + part.word;
      span.textContent = part.value;
      parent.append(span);
    });
    return box;
  }

  function renderTranscript() {
    transcript.replaceChildren();
    S.lines.forEach((line, i) => {
      const row = document.createElement("article");
      row.className = "line-row";
      row.dataset.line = i;
      const replay = document.createElement("button");
      replay.type = "button";
      replay.className = "line-play";
      replay.setAttribute("aria-label", "Play this line");
      replay.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      replay.addEventListener("click", () => seekLine(i, true));
      const text = document.createElement("div");
      text.className = "line-text";
      const speaker = document.createElement("b"); speaker.className = "speaker-name"; speaker.textContent = S.cast[line.speaker].name + ": "; text.append(speaker, annotatedLine(line.text, i, lineStarts[i]));
      row.append(replay, text);
      transcript.append(row);
    });
  }

  function chooseLayout() {
    return stage.clientHeight > stage.clientWidth * 1.15 ? "portrait" : "landscape";
  }

  function fitStage() {
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const credit = document.querySelector('.source-credit');
    const notes = document.querySelector('.stage-notes');
    const noteHeight = notes ? notes.getBoundingClientRect().height : 0;
    const reserved = !document.fullscreenElement && credit ? credit.getBoundingClientRect().height + noteHeight + 20 : noteHeight;
    const height = Math.max(220, window.innerHeight - top - reserved - 12);
    document.documentElement.style.setProperty('--story-stage-height', height + 'px');
  }

  function buildWorld(force = false) {
    fitStage();
    const nextMode = chooseLayout();
    if (!force && nextMode === layoutMode && world.children.length) return;
    layoutMode = nextMode;
    world.replaceChildren();
    worldItems = [];
    const portrait = layoutMode === "portrait";
    const items = portrait ? S.portraitPages : S.frames;
    const itemWidth = 1080;
    const itemHeight = 1080 * S.mediaAspect;
    const gap = portrait ? 90 : 70;
    const cols = portrait ? 1 : 4;
    const rows = Math.ceil(items.length / cols);
    worldSize = { width: cols * itemWidth + (cols - 1) * gap, height: rows * itemHeight + (rows - 1) * gap };
    world.style.width = worldSize.width + "px";
    world.style.height = worldSize.height + "px";

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rect = { x: col * (itemWidth + gap), y: row * (itemHeight + gap), width: itemWidth, height: itemHeight };
      worldItems.push(rect);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "world-item";
      button.style.left = rect.x + "px";
      button.style.top = rect.y + "px";
      button.style.width = rect.width + "px";
      button.style.height = rect.height + "px";
      button.setAttribute("aria-label", (portrait ? "Go to comic page " : "Go to story frame ") + (i + 1));
      const image = new Image();
      image.src = item.src;
      image.alt = item.alt;
      image.draggable = false;
      image.addEventListener("error", () => { audioStatus.textContent = `Comic page ${i + 1} couldn't load. Refresh to retry.`; });
      button.append(image);
      button.addEventListener("click", () => {
        const target = portrait ? S.camera.findIndex(camera => camera.p === i + 1) : S.lines.findIndex(line => line.frame === i + 1);
        if (target >= 0) seekLine(target, false);
      });
      world.append(button);
    });
    requestAnimationFrame(() => setCamera(false));
  }

  function setCamera(animate = true) {
    if (!worldItems.length) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const beat = overviewMode ? null : cameraBeatAt(audio.currentTime || 0);
    cameraKey = overviewMode ? "overview" : `${layoutMode}:${lineIndex}:${beat?.word ?? "line"}`;
    world.style.transitionDuration = !animate || reducedMotion ? "0s" : beat ? ".55s" : "1.05s";
    let scale;
    let centerX;
    let centerY;
    let itemIndex = 0;
    if (overviewMode) {
      scale = Math.min(sw / worldSize.width, sh / worldSize.height) * .91;
      centerX = worldSize.width / 2;
      centerY = worldSize.height / 2;
    } else {
      const camera = S.camera[lineIndex] || {};
      itemIndex = layoutMode === "portrait" ? Math.max(0, (beat?.page || camera.p || 1) - 1) : (beat?.frame || S.lines[lineIndex].frame) - 1;
      const item = worldItems[itemIndex] || worldItems[0];
      const focus = beat?.[layoutMode];
      const x = layoutMode === "portrait" ? .5 : (camera.lx ?? .5);
      const y = layoutMode === "portrait" ? (camera.py ?? .5) : (camera.ly ?? .5);
      const zoom = layoutMode === "portrait" ? (camera.pz ?? 1) : (camera.lz ?? 1);
      scale = Math.min(sw / item.width, sh / item.height) * zoom;
      const halfVisibleWidth = sw / scale / 2;
      const halfVisibleHeight = sh / scale / 2;
      const wantedX = item.x + item.width * x;
      const wantedY = item.y + item.height * y;
      centerX = Math.max(item.x + halfVisibleWidth, Math.min(item.x + item.width - halfVisibleWidth, wantedX));
      centerY = Math.max(item.y + halfVisibleHeight, Math.min(item.y + item.height - halfVisibleHeight, wantedY));
      if (focus) {
        const [left, top, width, height] = focus;
        // Fit the complete target panel into the space ABOVE the captions.
        const captionTop = pass === 1 ? sh - 80 : $(".caption-shell").getBoundingClientRect().top - stage.getBoundingClientRect().top;
        const artTop = 50;
        const artBottom = Math.max(artTop + 24, captionTop - 12);
        scale = Math.min(sw * .94 / (item.width * width), (artBottom - artTop) / (item.height * height));
        centerX = item.x + item.width * (left + width / 2);
        centerY = item.y + item.height * (top + height / 2);
        const targetY = (artTop + artBottom) / 2;
        world.style.transform = `translate3d(${sw / 2 - centerX * scale}px,${targetY - centerY * scale}px,0) scale(${scale})`;
      }
    }
    const tx = sw / 2 - centerX * scale;
    const ty = sh / 2 - centerY * scale;
    if (!beat) world.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${scale})`;
    stage.dataset.cameraBeat = beat?.label || "";
    $$(".world-item", world).forEach((node, i) => node.classList.toggle("current", !overviewMode && i === itemIndex));
    overviewToggle.querySelector("span").textContent = overviewMode ? "Return to story" : "Whole comic";
    overviewToggle.setAttribute("aria-label", overviewMode ? "Return to the current story scene" : "Show the whole comic");
    const camera = S.camera[lineIndex] || {};
    $("#frame-number").textContent = overviewMode ? "The complete comic" : layoutMode === "portrait" ? `Page ${itemIndex + 1} of ${S.portraitPages.length}` : `Frame ${itemIndex + 1} of ${S.frames.length}`;
  }

  function buildCurrentLine(i) {
    $("#speaker-name").textContent = S.cast[S.lines[i].speaker].name;
    currentLine.replaceChildren();
    currentLine.append(pass === 3 ? annotatedLine(S.lines[i].text, i, lineStarts[i]) : plainLine(S.lines[i].text, lineStarts[i]));
    const glide = document.createElement("span");
    glide.className = "word-glide";
    glide.setAttribute("aria-hidden", "true");
    currentLine.append(glide);
  }

  function lineForWord(globalWord) {
    let i = lineStarts.length - 1;
    while (i > 0 && globalWord < lineStarts[i]) i--;
    return i;
  }

  function wordAt(time) {
    if (!aligned || !T.w.length) return -1;
    let lo = 0;
    let hi = T.w.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (T.w[mid][0] <= time) lo = mid; else hi = mid - 1;
    }
    return time >= T.w[lo][0] - .025 ? lo : -1;
  }

  function wordIsActive(global, time) {
    if (!aligned || global < 0) return false;
    const end = T.w[global][1];
    const next = global + 1 < T.w.length ? T.w[global + 1][0] : Infinity;
    return time <= end + .22 || (next - end <= .72 && time < next);
  }

  function paintWords(global, active) {
    const local = global - lineStarts[lineIndex];
    const words = $$(".word", currentLine);
    words.forEach(node => {
      const n = +node.dataset.local;
      node.classList.toggle("said", n < local);
      node.classList.toggle("now", active && n === local);
    });
    const now = words.find(node => active && +node.dataset.local === local);
    const glide = $(".word-glide", currentLine);
    if (!now || !glide) {
      if (glide) glide.classList.remove("on");
    } else {
      const a = now.getBoundingClientRect();
      const b = currentLine.getBoundingClientRect();
      glide.style.width = a.width + "px";
      glide.style.height = a.height + "px";
      glide.style.transform = `translate3d(${a.left - b.left}px,${a.top - b.top}px,0)`;
      glide.classList.add("on");
    }
    $$(".word", transcript).forEach(node => {
      const n = +node.dataset.global;
      node.classList.toggle("said", n < global);
      node.classList.toggle("now", active && n === global);
    });
  }

  function updateFromAudio() {
    const time = audio.currentTime || 0;
    const duration = audio.duration || (aligned ? T.dur : 0);
    timeline.value = duration ? Math.round(time / duration * 1000) : 0;
    $("#elapsed").textContent = fmt(time);
    $("#duration").textContent = fmt(duration);
    if (aligned) {
      const nextWord = wordAt(time);
      const nextLine = nextWord >= 0 ? lineForWord(nextWord) : 0;
      if (nextLine !== lineIndex) {
        lineIndex = nextLine;
        buildCurrentLine(lineIndex);
        $$(".line-row").forEach((row, i) => row.classList.toggle("active", i === lineIndex));
        if ($("#transcript-dialog").open) $(".line-row.active")?.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      }
      wordIndex = nextWord;
      paintWords(wordIndex, wordIsActive(wordIndex, time));
      const beat = cameraBeatAt(time);
      const key = `${layoutMode}:${lineIndex}:${beat?.word ?? "line"}`;
      if (!overviewMode && key !== cameraKey) setCamera(!audio.paused);
    }
    if (!audio.paused) raf = requestAnimationFrame(updateFromAudio);
  }

  function setPass(next) {
    pass = next;
    $(".caption-shell").hidden = pass === 1;
    $$(".pass").forEach(button => button.classList.toggle("active", +button.dataset.pass === pass));
    const label = pass === 1 ? "Watch & listen" : pass === 2 ? "Follow the words" : "Explore phrases";
    $("#mode-label").textContent = label;
    $("#listen-cue").textContent = pass === 3 ? "Tap an underlined phrase for English and Bangla help." : "The gold highlight follows the storyteller.";
    nextPass.hidden = true;
    fitStage();
    buildCurrentLine(lineIndex);
    updateFromAudio();
    setCamera(false);
  }

  function seekLine(i, shouldPlay) {
    if (!aligned) return;
    audio.currentTime = T.w[lineStarts[i]][0];
    lineIndex = i;
    overviewMode = false;
    buildCurrentLine(i);
    $$(".line-row").forEach((row, index) => row.classList.toggle("active", index === i));
    setCamera(true);
    if (shouldPlay) audio.play().catch(() => { audioStatus.textContent = "Tap play to start the recording."; }); else updateFromAudio();
  }

  function openGloss(item) {
    audio.pause();
    $("#gloss-kind").textContent = item.kind;
    $("#gloss-title").textContent = item.phrase;
    $("#gloss-meaning").textContent = item.meaning;
    $("#gloss-bn").textContent = item.bn;
    $("#gloss-dialog").showModal();
  }

  play.addEventListener("click", async () => {
    if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - .05)) audio.currentTime = 0;
    if (audio.paused) {
      overviewMode = false;
      setCamera(true);
      try { await audio.play(); } catch (error) { audioStatus.textContent = "The recording couldn't start. Tap play again."; }
    } else audio.pause();
  });
  $("#restart").addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    lineIndex = 0;
    wordIndex = -1;
    overviewMode = false;
    buildCurrentLine(0);
    setCamera(true);
    updateFromAudio();
  });
  $("#replay-line").addEventListener("click", () => seekLine(lineIndex, true));
  document.addEventListener("keydown", event => {
    if (event.target.closest("input,button,select,a,dialog") || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.code === "Space") { event.preventDefault(); play.click(); }
    if (event.key === "ArrowRight") { event.preventDefault(); seekLine(Math.min(S.lines.length - 1,lineIndex + 1),false); }
    if (event.key === "ArrowLeft") { event.preventDefault(); seekLine(Math.max(0,lineIndex - 1),false); }
  });
  $("#fullscreen").addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { audioStatus.textContent = "Use your browser's fullscreen control."; }
  });
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("fullscreen-active",!!document.fullscreenElement);
    $("#fullscreen").textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
    $("#fullscreen").setAttribute("aria-label",document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen");
    buildWorld(true);
  });
  timeline.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = +timeline.value / 1000 * audio.duration;
    overviewMode = false;
    updateFromAudio();
    setCamera(false);
  });
  overviewToggle.addEventListener("click", () => { overviewMode = !overviewMode; setCamera(true); });
  audio.addEventListener("play", () => {
    play.classList.add("playing");
    play.setAttribute("aria-label", "Pause story");
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateFromAudio);
  });
  audio.addEventListener("pause", () => {
    play.classList.remove("playing");
    play.setAttribute("aria-label", "Play story");
    cancelAnimationFrame(raf);
    updateFromAudio();
  });
  audio.addEventListener("loadedmetadata", () => { $("#duration").textContent = fmt(audio.duration); audioStatus.textContent = aligned ? "" : "The audio loaded, but exact word timing still needs to be generated."; });
  audio.addEventListener("error", () => { audioStatus.textContent = "The story recording couldn't be decoded. Try loading it again."; play.disabled = true; retry.hidden = false; });
  audio.addEventListener("ended", () => {
    play.classList.remove("playing");
    cancelAnimationFrame(raf);
    if (pass < 3) {
      nextPass.hidden = false;
      nextPass.textContent = pass === 1 ? "Follow the words →" : "Explore the phrases →";
      fitStage();
      setCamera(false);
    }
  });
  nextPass.addEventListener("click", () => { audio.currentTime = 0; setPass(Math.min(3, pass + 1)); });
  $$(".pass").forEach(button => button.addEventListener("click", () => setPass(+button.dataset.pass)));

  const transcriptDialog = $("#transcript-dialog");
  [$("#transcript-open"), $("#transcript-open-stage")].forEach(button => button.addEventListener("click", () => transcriptDialog.showModal()));
  $("#transcript-close").addEventListener("click", () => transcriptDialog.close());
  $(".gloss-close").addEventListener("click", () => $("#gloss-dialog").close());
  [transcriptDialog, $("#gloss-dialog")].forEach(dialog => dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }));

  window.addEventListener('resize', () => { fitStage(); buildWorld(); setCamera(false); });
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const changed = chooseLayout() !== layoutMode;
      buildWorld(changed);
      if (!changed) setCamera(false);
    }, 90);
  }).observe(stage);

  renderTranscript();
  buildCurrentLine(0);
  buildWorld(true);
  setPass(1);
  loadRecording();
})();
