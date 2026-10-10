  // One camera over the intact comic; caption length does not change zoom.
  let captionReserve = 0;
  let captionMeasureKey = "";

  function reserveCaptionSpace() {
    const shell = $(".caption-shell");
    if (pass === 1) {
      captionReserve = 0;
      captionMeasureKey = "";
      shell.style.height = "";
      return;
    }
    const key = `${pass}:${shell.clientWidth}:${getComputedStyle(currentLine).font}`;
    if (key === captionMeasureKey) return;
    const probe = shell.cloneNode(true);
    probe.hidden = false;
    probe.setAttribute("aria-hidden", "true");
    probe.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
    Object.assign(probe.style, { position: "absolute", left: "-10000px", right: "auto", top: "0", bottom: "auto", width: shell.clientWidth + "px", height: "auto", visibility: "hidden", pointerEvents: "none" });
    stage.append(probe);
    const text = $(".current-line", probe);
    let maximum = 0;
    S.lines.forEach((line, i) => {
      text.replaceChildren(pass === 3 ? annotatedLine(line.text, i, lineStarts[i]) : plainLine(line.text, lineStarts[i]));
      maximum = Math.max(maximum, probe.getBoundingClientRect().height);
    });
    probe.remove();
    captionReserve = Math.ceil(maximum) + 2;
    shell.style.height = captionReserve + "px";
    captionMeasureKey = key;
  }

  function setCamera(animate = true) {
    if (!worldItems.length) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const beat = overviewMode ? null : cameraBeatAt(audio.currentTime || 0);
    cameraKey = overviewMode ? "overview" : `${layoutMode}:${beat?.line ?? lineIndex}:${beat?.word ?? "line"}`;
    world.style.transitionDuration = !animate || reducedMotion ? "0s" : ".85s";
    let scale, tx, ty, itemIndex = 0;
    if (overviewMode) {
      scale = Math.min(sw / worldSize.width, sh / worldSize.height) * .91;
      tx = sw / 2 - worldSize.width / 2 * scale;
      ty = sh / 2 - worldSize.height / 2 * scale;
    } else {
      itemIndex = Math.max(0, (beat?.page || S.lines[lineIndex].frame) - 1);
      const item = worldItems[itemIndex] || worldItems[0];
      const focus = beat?.[layoutMode] || [0, 0, 1, 1];
      const [left, top, width, height] = focus;
      const panels = S.panels.filter(panel => panel.page === itemIndex + 1);
      const wholePanel = panels.some(panel => panel.rect.every((n, i) => Math.abs(n - focus[i]) < .000001));
      // Regular scenes on a sheet share one zoom. Only authored detail cues
      // change magnification, so the camera pans between equal-size scenes.
      const fitWidth = wholePanel ? Math.max(...panels.map(panel => panel.rect[2])) : width;
      const fitHeight = wholePanel ? Math.max(...panels.map(panel => panel.rect[3])) : height;
      const artTop = 50;
      const captionBottom = pass === 1 ? 80 : (parseFloat(getComputedStyle($(".caption-shell")).bottom) || 78) + captionReserve;
      const artBottom = Math.max(artTop + 24, sh - captionBottom - 12);
      scale = Math.min(sw * .94 / (item.width * fitWidth), (artBottom - artTop) / (item.height * fitHeight));
      const centerX = item.x + item.width * (left + width / 2);
      const centerY = item.y + item.height * (top + height / 2);
      tx = sw / 2 - centerX * scale;
      ty = (artTop + artBottom) / 2 - centerY * scale;
    }
    // Move directly from the previous target to this target. Never visit a
    // sheet-fit or overview pose between narrated cues.
    world.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${scale})`;
    stage.dataset.cameraBeat = beat?.label || "";
    $$(".world-item", world).forEach((node, i) => node.classList.toggle("current", !overviewMode && i === itemIndex));
    overviewToggle.querySelector("span").textContent = overviewMode ? "Return to story" : "Whole comic";
    overviewToggle.setAttribute("aria-label", overviewMode ? "Return to the current story scene" : "Show the whole comic");
    $("#frame-number").textContent = overviewMode ? "The complete comic" : layoutMode === "portrait" ? `Page ${itemIndex + 1} of ${S.portraitPages.length}` : `Frame ${itemIndex + 1} of ${S.frames.length}`;
  }
