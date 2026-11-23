(() => {
  "use strict";

  function createFrameInspector(options) {
    const story = options.story;
    const scenes = Array.isArray(options.scenes) ? options.scenes : [];
    const rawEntities = Array.isArray(options.entities)
      ? options.entities
      : (typeof FOREVERGREEN_ENTITIES !== "undefined" && Array.isArray(FOREVERGREEN_ENTITIES) ? FOREVERGREEN_ENTITIES : []);
    const player = options.player;
    const stageEl = options.stageEl;
    const cardMountEl = options.cardMountEl;
    const toggleBtnEl = options.toggleBtnEl || null;
    const theme = options.theme === "dark" ? "dark" : "light";
    const idleToggleLabel = options.idleToggleLabel || "🔍 Tap Any Item";
    const activeToggleLabel = options.activeToggleLabel || "✓ Tap Items: On";

    const CATEGORY_LABELS = {
      character: "Character",
      prop: "Prop",
      set_piece: "Set Piece",
      part: "Part",
      expression: "Expression"
    };

    const sceneById = Object.fromEntries(scenes.map((sc) => [sc.id, sc]));
    const entityIndex = new Map();
    rawEntities.forEach((ent) => {
      const occs = [];
      (ent.appearances || []).forEach((app) => {
        const sc = sceneById[app.sceneId];
        if (!sc) return;
        const scItem = (sc.items || []).find((it) => it.entityId === ent.id || it.name === ent.name);
        if (scItem) {
          occs.push({ scene: sc, item: scItem, time: Number.isFinite(app.time) ? app.time : sc.frameSec });
        }
      });
      entityIndex.set(ent.id, { ...ent, occurrences: occs });
    });
    if (!entityIndex.size) {
      scenes.forEach((sc) => {
        (sc.items || []).forEach((it) => {
          const eid = it.entityId || it.name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
          if (!entityIndex.has(eid)) {
            entityIndex.set(eid, {
              id: eid,
              name: it.name,
              bn: it.bn,
              category: it.category || "prop",
              occurrences: []
            });
          }
          entityIndex.get(eid).occurrences.push({ scene: sc, item: it, time: sc.frameSec });
        });
      });
    }

    let active = options.defaultActive !== undefined ? !!options.defaultActive : true;
    let showPins = false;
    let currentScene = null;
    let currentItem = null;
    let currentTab = "story";
    let currentTimeSec = 0;
    let clickNorm = null;
    let watchVideo = null;
    let internalSeekUntil = 0;

    // 1. Stage overlays (leave bottom 48px clear so native video controls stay unobstructed)
    const overlay = document.createElement("div");
    overlay.className = "inspect-overlay";
    overlay.hidden = !active;
    overlay.setAttribute("role", "button");
    overlay.setAttribute("tabindex", "0");
    overlay.setAttribute("aria-label", "Click or tap any item in this frame while playing or paused");

    const modeBanner = document.createElement("div");
    modeBanner.className = "inspect-mode-banner";
    modeBanner.hidden = true;
    const bannerLabel = document.createElement("span");
    bannerLabel.textContent = "🔍 Tap any item · Click works while playing";
    const bannerDone = document.createElement("button");
    bannerDone.type = "button";
    bannerDone.className = "inspect-done-btn";
    bannerDone.textContent = "Turn off";
    bannerDone.addEventListener("click", (ev) => {
      ev.stopPropagation();
      setActive(false);
    });
    modeBanner.append(bannerLabel, bannerDone);

    const pinsLayer = document.createElement("div");
    pinsLayer.className = "inspect-pins-layer";
    pinsLayer.hidden = true;

    const targetRing = document.createElement("div");
    targetRing.className = "inspect-target-ring";
    targetRing.hidden = true;

    const boxEl = document.createElement("div");
    boxEl.className = "inspect-box";
    boxEl.hidden = true;
    const boxLabel = document.createElement("span");
    boxLabel.className = "inspect-box-label";
    boxEl.appendChild(boxLabel);

    const hoverBoxEl = document.createElement("div");
    hoverBoxEl.className = "inspect-hover-box";
    hoverBoxEl.hidden = true;
    const hoverBoxLabel = document.createElement("span");
    hoverBoxLabel.className = "inspect-hover-label";
    hoverBoxEl.appendChild(hoverBoxLabel);

    stageEl.append(overlay, modeBanner, pinsLayer, hoverBoxEl, targetRing, boxEl);

    // 2. Identification card mount
    const card = document.createElement("article");
    card.className = `inspect-card theme-${theme}`;
    card.hidden = true;
    card.setAttribute("aria-live", "polite");
    cardMountEl.innerHTML = "";
    cardMountEl.appendChild(card);

    function formatTime(sec) {
      const n = Math.max(0, Math.round(sec || 0));
      return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
    }

    function getVideoContentRect() {
      const video = player.getVideoElement ? player.getVideoElement() : stageEl.querySelector("video");
      const stageRect = stageEl.getBoundingClientRect();
      if (!video || !stageRect.width || !stageRect.height) return null;
      const vidRect = video.getBoundingClientRect();
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      const boxW = vidRect.width || stageRect.width;
      const boxH = vidRect.height || stageRect.height;
      const scale = Math.min(boxW / vw, boxH / vh);
      const drawW = vw * scale;
      const drawH = vh * scale;
      const offsetX = (vidRect.left - stageRect.left) + (boxW - drawW) / 2;
      const offsetY = (vidRect.top - stageRect.top) + (boxH - drawH) / 2;
      return { video, stageRect, offsetX, offsetY, drawW, drawH };
    }

    function findSceneAtTime(sec) {
      if (!scenes.length) return null;
      const t = Math.max(0, Number(sec) || 0);
      const lastEnd = scenes[scenes.length - 1].end;
      if (t > lastEnd + 0.2) return null;
      for (let i = 0; i < scenes.length; i++) {
        const s = scenes[i];
        const isLast = i === scenes.length - 1;
        if (t >= s.start && (isLast ? t <= s.end + 0.2 : t < s.end)) return s;
      }
      return scenes[0];
    }

    function getCurrentTimeSec() {
      const video = player.getVideoElement ? player.getVideoElement() : stageEl.querySelector("video");
      return video && Number.isFinite(video.currentTime) ? video.currentTime : 0;
    }

    function getItemBoxAtTime(item, timeSec) {
      if (!item) return null;
      const tr = item.track;
      if (!Array.isArray(tr) || !tr.length) return item.box;
      const t = Number.isFinite(timeSec) ? timeSec : getCurrentTimeSec();
      if (t <= tr[0][0]) {
        return tr[0][1] === null ? null : tr[0].slice(1);
      }
      const last = tr[tr.length - 1];
      if (t >= last[0]) {
        return last[1] === null ? null : last.slice(1);
      }
      for (let i = 0; i < tr.length - 1; i++) {
        const a = tr[i];
        const b = tr[i + 1];
        if (t >= a[0] && t <= b[0]) {
          if (a[1] === null && b[1] === null) return null;
          if (a[1] === null) return b[0] - t <= 0.12 ? b.slice(1) : null;
          if (b[1] === null) return t - a[0] <= 0.12 ? a.slice(1) : null;
          const u = (t - a[0]) / Math.max(0.001, b[0] - a[0]);
          return [
            Math.round(a[1] + u * (b[1] - a[1])),
            Math.round(a[2] + u * (b[2] - a[2])),
            Math.round(a[3] + u * (b[3] - a[3])),
            Math.round(a[4] + u * (b[4] - a[4]))
          ];
        }
      }
      return item.box;
    }

    function pickHitItem(scene, normX, normY, timeSec = getCurrentTimeSec()) {
      if (!scene || !Array.isArray(scene.items) || !scene.items.length) return null;
      const hits = [];
      scene.items.forEach((item) => {
        const box = getItemBoxAtTime(item, timeSec);
        if (!box) return;
        const [ymin, xmin, ymax, xmax] = box;
        if (normX >= xmin && normX <= xmax && normY >= ymin && normY <= ymax) {
          hits.push({ item, area: (ymax - ymin) * (xmax - xmin) });
        }
      });
      if (!hits.length) return null;
      hits.sort((a, b) => a.area - b.area);
      return hits[0].item;
    }

    function distToBox(normX, normY, box) {
      const [ymin, xmin, ymax, xmax] = box;
      const dx = normX < xmin ? xmin - normX : (normX > xmax ? normX - xmax : 0);
      const dy = normY < ymin ? ymin - normY : (normY > ymax ? normY - ymax : 0);
      return Math.hypot(dx, dy);
    }

    function pickBestItem(scene, normX, normY, timeSec = getCurrentTimeSec()) {
      const hit = pickHitItem(scene, normX, normY, timeSec);
      if (hit) return hit;
      if (!scene || !Array.isArray(scene.items) || !scene.items.length) return null;
      // Only snap to a nearby visible item (<= 75 norm units); never grab distant/off-screen items
      let best = null;
      let bestDist = Infinity;
      scene.items.forEach((item) => {
        const box = getItemBoxAtTime(item, timeSec);
        if (!box) return;
        const dist = distToBox(normX, normY, box);
        if (dist < bestDist) {
          bestDist = dist;
          best = item;
        }
      });
      return bestDist <= 75 ? best : null;
    }

    function hideHoverPreview() {
      hoverBoxEl.hidden = true;
      overlay.classList.remove("hotspot-hover");
    }

    function positionHoverBox(box, labelText) {
      const geom = getVideoContentRect();
      if (!geom || !Array.isArray(box) || box.length !== 4) {
        hideHoverPreview();
        return;
      }
      const [ymin, xmin, ymax, xmax] = box;
      const left = geom.offsetX + (xmin / 1000) * geom.drawW;
      const top = geom.offsetY + (ymin / 1000) * geom.drawH;
      const width = Math.max(20, ((xmax - xmin) / 1000) * geom.drawW);
      const height = Math.max(20, ((ymax - ymin) / 1000) * geom.drawH);
      hoverBoxEl.style.left = `${Math.round(left)}px`;
      hoverBoxEl.style.top = `${Math.round(top)}px`;
      hoverBoxEl.style.width = `${Math.round(width)}px`;
      hoverBoxEl.style.height = `${Math.round(height)}px`;
      hoverBoxLabel.textContent = labelText || "";
      hoverBoxEl.classList.toggle("label-below", top < 40);
      hoverBoxEl.hidden = false;
      overlay.classList.add("hotspot-hover");
    }

    function positionTargetRing(normX, normY) {
      const geom = getVideoContentRect();
      if (!geom) return;
      const px = geom.offsetX + (normX / 1000) * geom.drawW;
      const py = geom.offsetY + (normY / 1000) * geom.drawH;
      targetRing.style.left = `${Math.round(px)}px`;
      targetRing.style.top = `${Math.round(py)}px`;
      targetRing.hidden = false;
    }

    function positionBoundingBox(box, labelText) {
      const geom = getVideoContentRect();
      if (!geom || !Array.isArray(box) || box.length !== 4) return;
      const [ymin, xmin, ymax, xmax] = box;
      const left = geom.offsetX + (xmin / 1000) * geom.drawW;
      const top = geom.offsetY + (ymin / 1000) * geom.drawH;
      const width = Math.max(24, ((xmax - xmin) / 1000) * geom.drawW);
      const height = Math.max(24, ((ymax - ymin) / 1000) * geom.drawH);
      boxEl.style.left = `${Math.round(left)}px`;
      boxEl.style.top = `${Math.round(top)}px`;
      boxEl.style.width = `${Math.round(width)}px`;
      boxEl.style.height = `${Math.round(height)}px`;
      boxLabel.textContent = labelText || "";
      boxEl.classList.toggle("label-below", top < 40);
      boxEl.hidden = false;
    }

    function renderPins(scene, timeSec = getCurrentTimeSec()) {
      pinsLayer.innerHTML = "";
      if (!showPins || !scene) {
        pinsLayer.hidden = true;
        return;
      }
      const geom = getVideoContentRect();
      if (!geom) return;
      scene.items.forEach((item, idx) => {
        const box = getItemBoxAtTime(item, timeSec);
        if (!box) return;
        const cy = (box[0] + box[2]) / 2;
        const cx = (box[1] + box[3]) / 2;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "inspect-pin" + (currentItem && currentItem.id === item.id ? " active" : "");
        btn.style.left = `${Math.round(geom.offsetX + (cx / 1000) * geom.drawW)}px`;
        btn.style.top = `${Math.round(geom.offsetY + (cy / 1000) * geom.drawH)}px`;
        btn.title = item.name;
        btn.setAttribute("aria-label", `Inspect ${item.name}`);
        btn.textContent = String(idx + 1);
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          selectItem(scene, item, { x: cx, y: cy, playAudio: true, timeSec: getCurrentTimeSec() });
        });
        pinsLayer.appendChild(btn);
      });
      pinsLayer.hidden = false;
    }

    function clearVisuals() {
      targetRing.hidden = true;
      boxEl.hidden = true;
      pinsLayer.hidden = true;
      hideHoverPreview();
      clickNorm = null;
    }

    function clear() {
      if (typeof player.stopAudioOverlays === "function") {
        player.stopAudioOverlays();
      }
      currentScene = null;
      currentItem = null;
      clearVisuals();
      card.hidden = true;
      card.innerHTML = "";
      syncBannerState();
    }

    const FORM_AUDIO_SLUGS = {
      presentContinuous: "now",
      simplePast: "past",
      simplePresent: "present",
      question: "ask"
    };

    function getActiveBeat(item, timeSec = currentTimeSec || getCurrentTimeSec()) {
      if (!item) return null;
      const beats = item.beats;
      if (!Array.isArray(beats) || !beats.length) return item;
      const t = Number.isFinite(timeSec) ? timeSec : getCurrentTimeSec();
      const inside = beats.find((b) => t >= b.start - 0.15 && t <= b.end + 0.15);
      if (inside) return inside;
      let best = beats[0];
      let bestDist = Infinity;
      beats.forEach((b) => {
        const d = Math.abs((b.frameSec || b.start) - t);
        if (d < bestDist) {
          bestDist = d;
          best = b;
        }
      });
      return best;
    }

    function getFormAudioUrl(item, tabKey, timeSec = currentTimeSec) {
      if (!item) return "";
      const beat = getActiveBeat(item, timeSec);
      if (tabKey === "story") return (beat && beat.audio) || item.audio || "";
      if (beat && beat.grammarAudio && beat.grammarAudio[tabKey]) {
        return beat.grammarAudio[tabKey];
      }
      if (item.grammarAudio && item.grammarAudio[tabKey]) {
        return item.grammarAudio[tabKey];
      }
      const slug = FORM_AUDIO_SLUGS[tabKey];
      return slug ? `audio/items/forms/${item.id}__${slug}.mp3` : "";
    }

    function playItemThreePart(item, timeSec = currentTimeSec) {
      if (!item) return;
      const beat = getActiveBeat(item, timeSec);
      const audioRel = (beat && beat.audio) || item.audio;
      const sent = (beat && beat.sentence) || item.sentence;
      if (typeof player.playAudioUrl === "function" && audioRel) {
        player.playAudioUrl(audioRel, `${item.name}. ${sent} ${item.name}.`);
      } else if (typeof player.speakText === "function") {
        player.speakText(`${item.name}. ${sent} ${item.name}.`);
      }
    }

    function playFormAudio(item, tabKey, timeSec = currentTimeSec) {
      if (!item) return;
      if (tabKey === "story") {
        playItemThreePart(item, timeSec);
        return;
      }
      const text = getActiveSentence(item, tabKey, timeSec);
      const relUrl = getFormAudioUrl(item, tabKey, timeSec);
      if (typeof player.playAudioUrl === "function" && relUrl) {
        player.playAudioUrl(relUrl, text);
      } else if (typeof player.speakText === "function" && text) {
        player.speakText(text);
      }
    }

    function getActiveSentence(item, tabKey, timeSec = currentTimeSec) {
      if (!item) return "";
      const beat = getActiveBeat(item, timeSec);
      const sent = (beat && beat.sentence) || item.sentence;
      const gram = (beat && beat.grammar) || item.grammar;
      if (tabKey === "story") return sent;
      return (gram && gram[tabKey]) || sent;
    }

    function selectItem(scene, item, { x, y, playAudio = true, timeSec } = {}) {
      if (!scene || !item) return;
      const t = timeSec !== undefined ? timeSec : getCurrentTimeSec();
      const activeBox = getItemBoxAtTime(item, t);
      currentScene = scene;
      currentItem = item;
      currentTab = "story";
      currentTimeSec = t;
      if (activeBox) {
        const cx = x !== undefined ? x : Math.round((activeBox[1] + activeBox[3]) / 2);
        const cy = y !== undefined ? y : Math.round((activeBox[0] + activeBox[2]) / 2);
        clickNorm = { x: cx, y: cy };
        positionTargetRing(cx, cy);
        positionBoundingBox(activeBox, item.name);
      } else {
        clickNorm = null;
        targetRing.hidden = true;
        boxEl.hidden = true;
      }
      renderPins(scene, t);
      renderCard(scene, item, t);

      if (playAudio) {
        playItemThreePart(item, t);
      }
    }

    function jumpToAppearance(occ) {
      if (!occ || !occ.scene || !occ.item) return;
      player.pause();
      const targetTime = Number.isFinite(occ.time) ? occ.time : occ.scene.frameSec;
      if (typeof player.seekTo === "function") {
        internalSeekUntil = performance.now() + 450;
        player.seekTo(targetTime, false);
      }
      setTimeout(() => {
        selectItem(occ.scene, occ.item, { playAudio: true, timeSec: targetTime });
      }, 90);
    }

    function jumpToScene(scene, itemIndex = 0) {
      if (!scene) return;
      player.pause();
      if (typeof player.seekTo === "function") {
        internalSeekUntil = performance.now() + 450;
        player.seekTo(scene.frameSec, false);
      }
      const item = scene.items[itemIndex] || scene.items[0];
      setTimeout(() => {
        selectItem(scene, item, { playAudio: true, timeSec: scene.frameSec });
      }, 90);
    }

    function renderCard(scene, item, timeSec = currentTimeSec || getCurrentTimeSec()) {
      const sceneIndex = scenes.findIndex((s) => s.id === scene.id);
      const act = story.acts.find((a) => a.id === scene.act) || story.acts[0];
      const beat = getActiveBeat(item, timeSec) || item;
      const visibleItems = scene.items.filter((scItem) => getItemBoxAtTime(scItem, timeSec) !== null);
      const pillItems = visibleItems.length ? visibleItems : scene.items;
      const entMeta = item.entityId ? entityIndex.get(item.entityId) : null;
      const occurrences = entMeta && Array.isArray(entMeta.occurrences) ? entMeta.occurrences : [];
      const cat = item.category || (entMeta && entMeta.category) || "prop";

      card.hidden = false;
      card.innerHTML = "";

      const head = document.createElement("div");
      head.className = "inspect-card-head";

      const titleWrap = document.createElement("div");
      titleWrap.className = "inspect-title-wrap";
      const eyebrow = document.createElement("span");
      eyebrow.className = "inspect-eyebrow";
      eyebrow.textContent = `Busy Picture · Shot ${sceneIndex + 1}/${scenes.length} · ${pillItems.length} in frame · ${formatTime(timeSec)} · Act ${act.id}`;

      const titleRow = document.createElement("div");
      titleRow.className = "inspect-title-row";
      const h3 = document.createElement("h3");
      h3.textContent = item.name;
      const catBadge = document.createElement("span");
      catBadge.className = `inspect-category-pill cat-${cat}`;
      catBadge.textContent = CATEGORY_LABELS[cat] || "Item";
      const bn = document.createElement("span");
      bn.className = "inspect-bn";
      bn.lang = "bn";
      bn.textContent = item.bn;
      titleRow.append(h3, catBadge, bn);
      titleWrap.append(eyebrow, titleRow);

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "inspect-close";
      closeBtn.setAttribute("aria-label", "Close identification card");
      closeBtn.textContent = "×";
      closeBtn.addEventListener("click", clear);
      head.append(titleWrap, closeBtn);

      const noteBox = document.createElement("div");
      noteBox.className = "inspect-story-note";
      const noteEn = document.createElement("p");
      noteEn.textContent = beat.sentence || item.sentence;
      const noteBn = document.createElement("p");
      noteBn.className = "inspect-note-bn";
      noteBn.lang = "bn";
      noteBn.textContent = beat.sentenceBn || item.sentenceBn;
      noteBox.append(noteEn, noteBn);

      const tabs = document.createElement("div");
      tabs.className = "inspect-tenses";
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "Story and grammar sentence forms");

      const tabDefs = [
        { key: "story", label: "Story (3-part)" },
        { key: "presentContinuous", label: "Now (-ing)" },
        { key: "simplePast", label: "Past" },
        { key: "simplePresent", label: "Present" },
        { key: "question", label: "Ask (?)" }
      ];

      const sentenceEl = document.createElement("p");
      sentenceEl.className = "inspect-sentence";
      sentenceEl.textContent = getActiveSentence(item, currentTab, timeSec);

      tabDefs.forEach((t) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "inspect-tense-btn" + (t.key === currentTab ? " active" : "");
        btn.textContent = t.label;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", t.key === currentTab ? "true" : "false");
        btn.addEventListener("click", () => {
          currentTab = t.key;
          tabs.querySelectorAll(".inspect-tense-btn").forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          sentenceEl.textContent = getActiveSentence(item, currentTab, timeSec);
          playFormAudio(item, currentTab, timeSec);
        });
        tabs.appendChild(btn);
      });

      const actions = document.createElement("div");
      actions.className = "inspect-actions";

      const replayBtn = document.createElement("button");
      replayBtn.type = "button";
      replayBtn.className = "inspect-action-btn";
      replayBtn.textContent = "🔊 Item · Sentence · Item";
      replayBtn.addEventListener("click", () => playItemThreePart(item, timeSec));

      const hearTabBtn = document.createElement("button");
      hearTabBtn.type = "button";
      hearTabBtn.className = "inspect-action-btn";
      hearTabBtn.textContent = "🔊 Hear this form";
      hearTabBtn.addEventListener("click", () => {
        playFormAudio(item, currentTab, timeSec);
      });

      const pinsBtn = document.createElement("button");
      pinsBtn.type = "button";
      pinsBtn.className = "inspect-action-btn" + (showPins ? " is-on" : "");
      pinsBtn.textContent = showPins ? "📍 Hide pins" : "📍 Show all items";
      pinsBtn.addEventListener("click", () => {
        showPins = !showPins;
        pinsBtn.classList.toggle("is-on", showPins);
        pinsBtn.textContent = showPins ? "📍 Hide pins" : "📍 Show all items";
        renderPins(scene, timeSec);
      });

      const resumeBtn = document.createElement("button");
      resumeBtn.type = "button";
      resumeBtn.className = "inspect-action-btn primary";
      resumeBtn.textContent = "▶ Resume film";
      resumeBtn.addEventListener("click", () => {
        clearVisuals();
        if (typeof player.stopAudioOverlays === "function") player.stopAudioOverlays();
        player.play();
      });

      actions.append(replayBtn, hearTabBtn, pinsBtn, resumeBtn);

      // Quick scene explorer: jump to other items visible in this frame or step across entity occurrences
      const sceneFooter = document.createElement("div");
      sceneFooter.className = "inspect-scene-footer";

      if (occurrences.length > 1) {
        const occIdx = Math.max(0, occurrences.findIndex((o) => o.scene.id === scene.id));
        const entityBar = document.createElement("div");
        entityBar.className = "inspect-entity-bar";

        const prevOccBtn = document.createElement("button");
        prevOccBtn.type = "button";
        prevOccBtn.className = "inspect-nav-btn";
        prevOccBtn.textContent = `← Prev ${item.name}`;
        prevOccBtn.addEventListener("click", () => {
          const targetIdx = (occIdx - 1 + occurrences.length) % occurrences.length;
          jumpToAppearance(occurrences[targetIdx]);
        });

        const occCount = document.createElement("span");
        occCount.className = "inspect-entity-count";
        occCount.textContent = `Seen in ${occurrences.length} shots (${occIdx + 1}/${occurrences.length})`;

        const nextOccBtn = document.createElement("button");
        nextOccBtn.type = "button";
        nextOccBtn.className = "inspect-nav-btn";
        nextOccBtn.textContent = `Next ${item.name} →`;
        nextOccBtn.addEventListener("click", () => {
          const targetIdx = (occIdx + 1) % occurrences.length;
          jumpToAppearance(occurrences[targetIdx]);
        });

        entityBar.append(prevOccBtn, occCount, nextOccBtn);
        sceneFooter.appendChild(entityBar);
      }

      const sceneNav = document.createElement("div");
      sceneNav.className = "inspect-scene-nav";
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "inspect-nav-btn";
      prevBtn.textContent = "← Prev shot";
      prevBtn.disabled = sceneIndex <= 0;
      prevBtn.addEventListener("click", () => {
        if (sceneIndex > 0) jumpToScene(scenes[sceneIndex - 1], 0);
      });

      const sceneLabel = document.createElement("span");
      sceneLabel.className = "inspect-scene-title";
      sceneLabel.textContent = scene.title;

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "inspect-nav-btn";
      nextBtn.textContent = "Next shot →";
      nextBtn.disabled = sceneIndex >= scenes.length - 1;
      nextBtn.addEventListener("click", () => {
        if (sceneIndex < scenes.length - 1) jumpToScene(scenes[sceneIndex + 1], 0);
      });
      sceneNav.append(prevBtn, sceneLabel, nextBtn);

      const pillsRow = document.createElement("div");
      pillsRow.className = "inspect-scene-pills";
      pillItems.forEach((scItem) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "inspect-item-pill" + (scItem.id === item.id ? " active" : "");
        pill.textContent = scItem.name;
        pill.addEventListener("click", () => {
          selectItem(scene, scItem, { playAudio: true, timeSec });
        });
        pillsRow.appendChild(pill);
      });

      sceneFooter.append(sceneNav, pillsRow);
      card.append(head, noteBox, tabs, sentenceEl, actions, sceneFooter);
      syncBannerState();
    }

    function syncVideoListeners() {
      const video = player.getVideoElement ? player.getVideoElement() : stageEl.querySelector("video");
      if (video && video !== watchVideo) {
        watchVideo = video;
        video.addEventListener("play", () => {
          clearVisuals();
          if (typeof player.stopAudioOverlays === "function") player.stopAudioOverlays();
          syncBannerState();
        });
        video.addEventListener("pause", syncBannerState);
        video.addEventListener("seeked", () => {
          if (performance.now() < internalSeekUntil) return;
          const t = Number.isFinite(video.currentTime) ? video.currentTime : 0;
          const atScene = findSceneAtTime(t);
          if (!atScene || !currentScene || atScene.id !== currentScene.id) {
            clearVisuals();
            currentScene = null;
            currentItem = null;
            card.hidden = true;
            card.innerHTML = "";
            syncBannerState();
          }
        });
      }
    }

    function syncBannerState() {
      const video = player.getVideoElement ? player.getVideoElement() : stageEl.querySelector("video");
      const isPlaying = video ? !video.paused : false;
      modeBanner.hidden = !active || isPlaying || !card.hidden;
    }

    function syncToggleUi() {
      overlay.hidden = !active;
      stageEl.classList.toggle("inspect-active", active);
      if (toggleBtnEl) {
        toggleBtnEl.classList.toggle("active", active);
        toggleBtnEl.setAttribute("aria-pressed", active ? "true" : "false");
        toggleBtnEl.textContent = active ? activeToggleLabel : idleToggleLabel;
      }
      syncVideoListeners();
      syncBannerState();
    }

    function setActive(next) {
      active = !!next;
      if (!active) clearVisuals();
      syncToggleUi();
    }

    function handleFrameTap(clientX, clientY) {
      const geom = getVideoContentRect();
      if (!geom) return;

      const relX = (clientX - (geom.stageRect.left + geom.offsetX)) / geom.drawW;
      const relY = (clientY - (geom.stageRect.top + geom.offsetY)) / geom.drawH;
      if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return;

      const normX = Math.max(0, Math.min(1000, Math.round(relX * 1000)));
      const normY = Math.max(0, Math.min(1000, Math.round(relY * 1000)));
      const timeSec = Number.isFinite(geom.video.currentTime) ? geom.video.currentTime : 0;
      const scene = findSceneAtTime(timeSec);

      // Freeze immediately even if clicked mid-playback!
      if (!geom.video.paused) {
        player.pause();
      }

      if (!scene) return;
      const item = pickBestItem(scene, normX, normY, timeSec);
      if (item) {
        selectItem(scene, item, { x: normX, y: normY, playAudio: true, timeSec });
        return;
      }

      // Empty space clicked: pause cleanly and show scene card without drawing a false box
      const fallbackItem =
        scene.items.find((it) => getItemBoxAtTime(it, timeSec) !== null) || scene.items[0];
      if (!fallbackItem) return;
      currentScene = scene;
      currentItem = fallbackItem;
      currentTab = "story";
      currentTimeSec = timeSec;
      clearVisuals();
      renderPins(scene, timeSec);
      renderCard(scene, fallbackItem, timeSec);
    }

    overlay.addEventListener("mousemove", (ev) => {
      if (!active) return;
      const geom = getVideoContentRect();
      if (!geom || !geom.video.paused) {
        hideHoverPreview();
        return;
      }
      const relX = (ev.clientX - (geom.stageRect.left + geom.offsetX)) / geom.drawW;
      const relY = (ev.clientY - (geom.stageRect.top + geom.offsetY)) / geom.drawH;
      if (relX < 0 || relX > 1 || relY < 0 || relY > 1) {
        hideHoverPreview();
        return;
      }
      const normX = Math.max(0, Math.min(1000, Math.round(relX * 1000)));
      const normY = Math.max(0, Math.min(1000, Math.round(relY * 1000)));
      const timeSec = Number.isFinite(geom.video.currentTime) ? geom.video.currentTime : 0;
      const scene = findSceneAtTime(timeSec);
      if (!scene) {
        hideHoverPreview();
        return;
      }
      const hovered = pickHitItem(scene, normX, normY, timeSec);
      if (!hovered || (currentItem && !boxEl.hidden && hovered.id === currentItem.id)) {
        hideHoverPreview();
        return;
      }
      const hoverBox = getItemBoxAtTime(hovered, timeSec);
      if (!hoverBox) {
        hideHoverPreview();
        return;
      }
      positionHoverBox(hoverBox, hovered.name);
    });

    overlay.addEventListener("mouseleave", hideHoverPreview);

    overlay.addEventListener("click", (ev) => {
      ev.stopPropagation();
      hideHoverPreview();
      handleFrameTap(ev.clientX, ev.clientY);
    });

    if (toggleBtnEl) {
      toggleBtnEl.addEventListener("click", () => {
        setActive(!active);
      });
    }

    const onViewportChange = () => {
      const t = getCurrentTimeSec();
      if (clickNorm && !targetRing.hidden) positionTargetRing(clickNorm.x, clickNorm.y);
      if (currentItem && !boxEl.hidden) {
        const activeBox = getItemBoxAtTime(currentItem, t);
        if (activeBox) positionBoundingBox(activeBox, currentItem.name);
      }
      if (showPins && currentScene && !pinsLayer.hidden) renderPins(currentScene, t);
    };
    window.addEventListener("resize", onViewportChange);
    document.addEventListener("fullscreenchange", onViewportChange);

    const pollTimer = setInterval(() => {
      const video = player.getVideoElement ? player.getVideoElement() : stageEl.querySelector("video");
      if (video) {
        syncVideoListeners();
        syncBannerState();
        clearInterval(pollTimer);
      }
    }, 250);

    syncToggleUi();

    return {
      setActive,
      isActive: () => active,
      clear,
      destroy: () => {
        clearInterval(pollTimer);
        window.removeEventListener("resize", onViewportChange);
        document.removeEventListener("fullscreenchange", onViewportChange);
        clear();
        overlay.remove();
        modeBanner.remove();
        pinsLayer.remove();
        hoverBoxEl.remove();
        targetRing.remove();
        boxEl.remove();
        card.remove();
      }
    };
  }

  window.ForevergreenInspector = { create: createFrameInspector };
})();
