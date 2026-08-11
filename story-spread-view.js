(function () {
  "use strict";

  var container = document.getElementById("pdf-container") || document.getElementById("pages-container");
  if (!container) return;

  var STORAGE_KEY = "dialogue-story-spread-view";
  var MIN_SPREAD_WIDTH = 900;
  var prefersSpread = false;

  try {
    prefersSpread = window.localStorage.getItem(STORAGE_KEY) === "spread";
  } catch (error) {
    prefersSpread = false;
  }

  var style = document.createElement("style");
  style.textContent = [
    ".story-spread-toggle {",
    "  position: fixed;",
    "  top: 24px;",
    "  left: 24px;",
    "  min-height: 48px;",
    "  padding: 0 18px;",
    "  border-radius: 999px;",
    "  border: 1px solid rgba(255, 255, 255, 0.35);",
    "  background: rgba(0, 0, 0, 0.76);",
    "  color: #fff;",
    "  display: inline-flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  gap: 9px;",
    "  font: 700 15px/1 sans-serif;",
    "  letter-spacing: 0.01em;",
    "  cursor: pointer;",
    "  z-index: 10001;",
    "  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);",
    "  -webkit-tap-highlight-color: transparent;",
    "}",
    ".story-spread-toggle:hover { background: rgba(20, 20, 20, 0.94); }",
    ".story-spread-toggle:focus-visible { outline: 3px solid #68c4ff; outline-offset: 3px; }",
    ".story-spread-toggle[aria-pressed='true'] {",
    "  background: #0c79d8;",
    "  border-color: #68c4ff;",
    "}",
    "body.story-spread-mode #pdf-container,",
    "body.story-spread-mode #pages-container {",
    "  display: grid;",
    "  grid-template-columns: repeat(2, minmax(0, 1fr));",
    "  align-items: start;",
    "  gap: 8px;",
    "}",
    "body.story-spread-mode #pdf-container > canvas {",
    "  width: 100% !important;",
    "  height: auto !important;",
    "  max-width: none;",
    "  margin: 0;",
    "}",
    "body.story-spread-mode #pages-container > .page-wrapper {",
    "  width: 100%;",
    "  max-width: none;",
    "  margin: 0;",
    "}",
    "@media (max-width: 899px) {",
    "  .story-spread-toggle { display: none; }",
    "}"
  ].join("\n");
  document.head.appendChild(style);

  var button = document.createElement("button");
  button.id = "story-spread-toggle";
  button.className = "story-spread-toggle";
  button.type = "button";
  button.title = "Switch between single-page and two-page presentation (2)";
  button.setAttribute("aria-label", "Show two pages side by side");
  document.body.appendChild(button);

  function resetViewerPosition() {
    if (typeof window.scale === "number") window.scale = 1;
    if (typeof window.posX === "number") window.posX = 0;
    if (typeof window.posY === "number") window.posY = 0;

    window.requestAnimationFrame(function () {
      if (typeof window.contentHeight === "number") {
        window.contentHeight = container.offsetHeight;
      }
      if (typeof window.centerContent === "function") {
        window.centerContent();
      }
    });
  }

  function syncLayout() {
    var active = prefersSpread && window.innerWidth >= MIN_SPREAD_WIDTH;
    document.body.classList.toggle("story-spread-mode", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.setAttribute("aria-label", active ? "Show one page at a time" : "Show two pages side by side");
    button.textContent = active ? "Single page" : "Two pages";
    resetViewerPosition();
  }

  function setPreference(nextPreference) {
    prefersSpread = nextPreference;
    try {
      window.localStorage.setItem(STORAGE_KEY, prefersSpread ? "spread" : "single");
    } catch (error) {
      // The view still works when storage is disabled.
    }
    syncLayout();
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    setPreference(!document.body.classList.contains("story-spread-mode"));
  });
  button.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
  button.addEventListener("touchstart", function (event) {
    event.stopPropagation();
  }, { passive: true });
  button.addEventListener("touchend", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("keydown", function (event) {
    var target = event.target;
    var isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (!isTyping && event.key === "2" && window.innerWidth >= MIN_SPREAD_WIDTH) {
      event.preventDefault();
      setPreference(!document.body.classList.contains("story-spread-mode"));
    }
  });

  window.addEventListener("resize", syncLayout);
  syncLayout();
}());
