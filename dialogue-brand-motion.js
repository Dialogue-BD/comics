(function () {
  'use strict';

  if (window.__dialogueBrandMotionInstalled) return;
  window.__dialogueBrandMotionInstalled = true;

  var MOTION_URL = '/brand/dialogue-logo-motion.json';
  var RUNTIME_URL = '/brand/lottie-light.min.js';
  var logoSelector = 'img[src], img[srcset]';
  var hoverMedia = window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)')
    : null;
  var reducedMedia = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  var printMedia = window.matchMedia ? window.matchMedia('print') : null;
  var recordsByImage = new WeakMap();
  var records = new Set();
  var runtimePromise = null;
  var dataPromise = null;
  var overlay = null;
  var viewport = null;
  var scene = null;
  var animation = null;
  var activeRecord = null;

  function allowsMotion() {
    return Boolean(hoverMedia && hoverMedia.matches) &&
      !(reducedMedia && reducedMedia.matches) &&
      !(printMedia && printMedia.matches) &&
      !(window.matchMedia && window.matchMedia('(forced-colors: active)').matches) &&
      !window.__dialoguePrintMode;
  }

  function isOfficialLockup(image) {
    var candidates = [image.getAttribute('src') || '', image.getAttribute('srcset') || ''];
    for (var i = 0; i < candidates.length; i += 1) {
      var entries = candidates[i].split(',');
      for (var j = 0; j < entries.length; j += 1) {
        var url = entries[j].trim().split(/\s+/)[0];
        if (!url) continue;
        try {
          var pathname = new URL(url, document.baseURI).pathname;
          if (/\/brand\/dialogue-logo\.(?:png|svg)$/i.test(pathname)) return true;
        } catch (_) {
          // Invalid URLs are not candidates for branded motion.
        }
      }
    }
    return false;
  }

  function scriptOnce() {
    if (window.lottie && typeof window.lottie.loadAnimation === 'function') {
      return Promise.resolve(window.lottie);
    }
    if (runtimePromise) return runtimePromise;
    runtimePromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = RUNTIME_URL;
      script.async = true;
      script.onload = function () {
        if (window.lottie && typeof window.lottie.loadAnimation === 'function') {
          resolve(window.lottie);
        } else {
          reject(new Error('Dialogue motion runtime did not initialize.'));
        }
      };
      script.onerror = function () { reject(new Error('Dialogue motion runtime unavailable.')); };
      (document.head || document.documentElement).appendChild(script);
    });
    return runtimePromise;
  }

  function motionDataOnce() {
    if (dataPromise) return dataPromise;
    dataPromise = fetch(MOTION_URL, { credentials: 'same-origin', cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Dialogue logo motion data unavailable.');
        return response.json();
      });
    return dataPromise;
  }

  function loadMotion() {
    return Promise.all([scriptOnce(), motionDataOnce()]).then(function (results) {
      return { lottie: results[0], data: results[1] };
    });
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'dialogue-logo-motion-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    viewport = document.createElement('div');
    viewport.className = 'dialogue-logo-motion-viewport';
    scene = document.createElement('div');
    scene.className = 'dialogue-logo-motion-scene';
    viewport.appendChild(scene);
    overlay.appendChild(viewport);
    (document.body || document.documentElement).appendChild(overlay);
    return overlay;
  }

  function boxNumber(value, scale) {
    return (parseFloat(value) || 0) * scale;
  }

  function positionFraction(token, axis) {
    var value = (token || '').toLowerCase();
    if (value === 'center') return 0.5;
    if (value === 'right' || value === 'bottom') return 1;
    if (value === 'left' || value === 'top') return 0;
    if (/%$/.test(value)) return (parseFloat(value) || 0) / 100;
    return null;
  }

  function objectPosition(style) {
    var tokens = (style.objectPosition || '50% 50%').trim().split(/\s+/);
    var x = '50%';
    var y = '50%';
    if (tokens.length === 1) {
      if (tokens[0] === 'top' || tokens[0] === 'bottom') y = tokens[0];
      else x = tokens[0];
    } else {
      x = tokens[0];
      y = tokens[1];
      if ((x === 'top' || x === 'bottom') && (y === 'left' || y === 'right')) {
        var swap = x;
        x = y;
        y = swap;
      }
    }
    return [x, y];
  }

  function objectOffset(containerSize, objectSize, token, axis) {
    var fraction = positionFraction(token, axis);
    if (fraction !== null) return (containerSize - objectSize) * fraction;
    var value = parseFloat(token);
    return Number.isFinite(value) ? value : (containerSize - objectSize) * 0.5;
  }

  function visibleImageBounds(image) {
    var rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    var style = window.getComputedStyle(image);
    var scaleX = rect.width / (image.offsetWidth || rect.width);
    var scaleY = rect.height / (image.offsetHeight || rect.height);
    var borderX = boxNumber(style.borderLeftWidth, scaleX) + boxNumber(style.borderRightWidth, scaleX);
    var borderY = boxNumber(style.borderTopWidth, scaleY) + boxNumber(style.borderBottomWidth, scaleY);
    var paddingX = boxNumber(style.paddingLeft, scaleX) + boxNumber(style.paddingRight, scaleX);
    var paddingY = boxNumber(style.paddingTop, scaleY) + boxNumber(style.paddingBottom, scaleY);
    var left = rect.left + boxNumber(style.borderLeftWidth, scaleX) + boxNumber(style.paddingLeft, scaleX);
    var top = rect.top + boxNumber(style.borderTopWidth, scaleY) + boxNumber(style.paddingTop, scaleY);
    var contentWidth = Math.max(0, rect.width - borderX - paddingX);
    var contentHeight = Math.max(0, rect.height - borderY - paddingY);
    if (!contentWidth || !contentHeight) return null;

    var naturalWidth = image.naturalWidth || 1020;
    var naturalHeight = image.naturalHeight || 610;
    var fit = style.objectFit || 'fill';
    var drawWidth = contentWidth;
    var drawHeight = contentHeight;
    if (fit !== 'fill') {
      var containScale = Math.min(contentWidth / naturalWidth, contentHeight / naturalHeight);
      var scale = containScale;
      if (fit === 'cover') scale = Math.max(contentWidth / naturalWidth, contentHeight / naturalHeight);
      else if (fit === 'none') scale = 1;
      else if (fit === 'scale-down') scale = Math.min(1, containScale);
      drawWidth = naturalWidth * scale;
      drawHeight = naturalHeight * scale;
    }

    var positions = objectPosition(style);
    var offsetX = objectOffset(contentWidth, drawWidth, positions[0], 'x');
    var offsetY = objectOffset(contentHeight, drawHeight, positions[1], 'y');
    var visibleLeft = left + Math.max(0, offsetX);
    var visibleTop = top + Math.max(0, offsetY);
    var visibleRight = left + Math.min(contentWidth, offsetX + drawWidth);
    var visibleBottom = top + Math.min(contentHeight, offsetY + drawHeight);
    var width = visibleRight - visibleLeft;
    var height = visibleBottom - visibleTop;
    if (width <= 0 || height <= 0) return null;

    // The official static lockup has a 1020 × 610 aspect. Keep the moving
    // lockup at that ratio inside the actual object-fit rendered image bounds.
    var ratio = naturalWidth / naturalHeight;
    if (fit === 'cover' && (drawWidth > contentWidth || drawHeight > contentHeight)) {
      // A cover-cropped source cannot be fully reproduced without cropping
      // part of the animated logo too; use the visible image window.
      ratio = width / height;
    }
    if (width / height > ratio) {
      var fittedWidth = height * ratio;
      visibleLeft += (width - fittedWidth) / 2;
      width = fittedWidth;
    } else {
      var fittedHeight = width / ratio;
      visibleTop += (height - fittedHeight) / 2;
      height = fittedHeight;
    }
    return { left: visibleLeft, top: visibleTop, width: width, height: height };
  }

  function positionOverlay(record) {
    if (!overlay || !record.image.isConnected) return false;
    var bounds = visibleImageBounds(record.image);
    if (!bounds) return false;
    overlay.style.left = bounds.left + 'px';
    overlay.style.top = bounds.top + 'px';
    overlay.style.width = bounds.width + 'px';
    overlay.style.height = bounds.height + 'px';
    return true;
  }

  function hideOverlay() {
    if (activeRecord) activeRecord.image.classList.remove('dialogue-logo-motion-playing');
    if (overlay) {
      overlay.hidden = true;
      overlay.classList.remove('is-ready');
      overlay.style.left = '';
      overlay.style.top = '';
      overlay.style.width = '';
      overlay.style.height = '';
    }
    if (animation) {
      try {
        animation.stop();
        animation.goToAndStop(0, true);
      } catch (_) {
        // The static logo remains in place when the motion renderer fails.
      }
    }
    if (activeRecord) activeRecord.playing = false;
    activeRecord = null;
  }

  function failRecord(record) {
    record.failed = true;
    record.wantsMotion = false;
    record.playing = false;
    record.image.classList.remove('dialogue-logo-motion-playing');
    if (activeRecord === record) hideOverlay();
  }

  function activate(record) {
    if (!record.eligible || !allowsMotion() || record.failed || record.playing || record.playedInSession) return;
    record.playedInSession = true;
    record.wantsMotion = true;
    record.intentId += 1;
    var intentId = record.intentId;
    loadMotion().then(function (assets) {
      if (record.intentId !== intentId || !record.wantsMotion || !record.eligible ||
          !allowsMotion() || !record.image.isConnected) return;
      ensureOverlay();
      if (!animation) {
        animation = assets.lottie.loadAnimation({
          container: scene,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: assets.data,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true }
        });
        animation.addEventListener('complete', function () {
          if (!activeRecord) return;
          activeRecord.image.classList.remove('dialogue-logo-motion-playing');
          activeRecord.playing = false;
          overlay.hidden = true;
          overlay.classList.remove('is-ready');
        });
      }
      if (activeRecord && activeRecord !== record) hideOverlay();
      if (!positionOverlay(record)) return;
      activeRecord = record;
      record.playing = true;
      overlay.hidden = false;
      overlay.classList.add('is-ready');
      record.image.classList.add('dialogue-logo-motion-playing');
      animation.goToAndPlay(0, true);
    }).catch(function () {
      failRecord(record);
    });
  }

  function deactivate(record) {
    record.wantsMotion = false;
    record.playedInSession = false;
    record.intentId += 1;
    if (activeRecord === record) hideOverlay();
    else {
      record.playing = false;
      record.image.classList.remove('dialogue-logo-motion-playing');
    }
  }

  function getRecord(image) {
    var record = recordsByImage.get(image);
    if (record) {
      record.eligible = isOfficialLockup(image);
      return record;
    }
    if (!isOfficialLockup(image)) return null;
    record = {
      image: image,
      eligible: true,
      failed: false,
      playing: false,
      wantsMotion: false,
      playedInSession: false,
      pointerActive: false,
      focusActive: false,
      intentId: 0
    };
    recordsByImage.set(image, record);
    records.add(record);
    var owner = image.closest('a, button, [tabindex]') || image;
    owner.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'touch') {
        record.pointerActive = true;
        activate(record);
      }
    });
    owner.addEventListener('pointerleave', function () {
      record.pointerActive = false;
      if (!record.focusActive) deactivate(record);
    });
    owner.addEventListener('focusin', function () {
      record.focusActive = true;
      activate(record);
    });
    owner.addEventListener('focusout', function (event) {
      if (!owner.contains(event.relatedTarget)) {
        record.focusActive = false;
        if (!record.pointerActive) deactivate(record);
      }
    });
    if (window.ResizeObserver) {
      record.resizeObserver = new ResizeObserver(function () {
        if (activeRecord === record) onViewportChange();
      });
      record.resizeObserver.observe(image);
    }
    return record;
  }

  function scan(node) {
    if (!node) return;
    if (node.nodeType === 1 && node.matches && node.matches(logoSelector)) getRecord(node);
    if (node.querySelectorAll) {
      Array.prototype.forEach.call(node.querySelectorAll(logoSelector), getRecord);
    }
  }

  function stopAll() {
    records.forEach(function (record) { deactivate(record); });
    hideOverlay();
  }

  function onViewportChange() {
    // Never let a fixed overlay drift away from a logo while the page moves.
    stopAll();
  }

  function start() {
    scan(document);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          Array.prototype.forEach.call(mutation.addedNodes, scan);
          records.forEach(function (record) {
            if (!record.image.isConnected) {
              deactivate(record);
              if (record.resizeObserver) record.resizeObserver.disconnect();
              records.delete(record);
              recordsByImage.delete(record.image);
            }
          });
          return;
        }
        if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
          var image = mutation.target;
          var record = recordsByImage.get(image);
          if (record) {
            record.eligible = isOfficialLockup(image);
            if (!record.eligible) deactivate(record);
          } else if (isOfficialLockup(image)) {
            getRecord(image);
          }
        }
      });
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
    if (hoverMedia && hoverMedia.addEventListener) hoverMedia.addEventListener('change', onViewportChange);
    if (reducedMedia && reducedMedia.addEventListener) reducedMedia.addEventListener('change', onViewportChange);
    if (printMedia && printMedia.addEventListener) printMedia.addEventListener('change', onViewportChange);
    window.addEventListener('beforeprint', stopAll);
    window.addEventListener('scroll', onViewportChange, { passive: true, capture: true });
    window.addEventListener('resize', onViewportChange, { passive: true });
    window.addEventListener('orientationchange', onViewportChange, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}());
