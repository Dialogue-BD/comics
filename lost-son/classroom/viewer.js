(() => {
  'use strict';
  const story = CLASSROOM_STORY;
  const viewer = document.querySelector('#viewer');
  const pages = document.querySelector('#pages');
  const select = document.querySelector('#page');
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const zoomLabel = document.querySelector('#zoom');
  let current = 0;
  let width = 0;
  let fit = 'width';
  let dragging = null;
  let scrollFrame = 0;
  story.frames.forEach((frame, i) => {
    const page = document.createElement('figure');
    page.className = 'page';
    page.id = `page-${i + 1}`;
    const image = new Image();
    image.src = frame.src;
    image.alt = frame.alt;
    image.width = frame.width;
    image.height = frame.height;
    image.draggable = false;
    page.append(image);
    pages.append(page);
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i + 1}. ${story.chapters[i].title}`;
    select.append(option);
  });
  function updateControls() {
    select.value = current;
    previous.disabled = current === 0;
    next.disabled = current === story.frames.length - 1;
    zoomLabel.value = `${Math.round(width / viewer.clientWidth * 100)}%`;
    document.querySelector('#zoom-out').disabled = width <= viewer.clientWidth * .2 + 1;
    document.querySelector('#zoom-in').disabled = width >= viewer.clientWidth * 5 - 1;
  }
  function resizeTo(newWidth) {
    const oldWidth = width || viewer.clientWidth;
    const ratio = newWidth / oldWidth;
    const centerX = viewer.scrollLeft + viewer.clientWidth / 2;
    const centerY = viewer.scrollTop + viewer.clientHeight / 2;
    width = newWidth;
    pages.style.setProperty('--page-width', `${width}px`);
    const lastPage = story.frames.at(-1);
    pages.style.paddingBottom = `${Math.max(12, viewer.clientHeight - width * lastPage.height / lastPage.width + 12)}px`;
    viewer.scrollLeft = centerX * ratio - viewer.clientWidth / 2;
    viewer.scrollTop = centerY * ratio - viewer.clientHeight / 2;
    updateControls();
  }
  function fitWidth() { fit = 'width'; resizeTo(viewer.clientWidth); }
  function fitPage() {
    fit = 'page';
    const image = story.frames[current];
    resizeTo(Math.min(viewer.clientWidth, (viewer.clientHeight - 24) * image.width / image.height));
    goTo(current);
  }
  function goTo(index) {
    current = Math.max(0, Math.min(story.frames.length - 1, index));
    if (fit === 'page') {
      const image = story.frames[current];
      resizeTo(Math.min(viewer.clientWidth, (viewer.clientHeight - 24) * image.width / image.height));
    }
    viewer.scrollTop = pages.children[current].offsetTop - pages.offsetTop - 12;
    updateControls();
  }
  select.addEventListener('change', () => goTo(+select.value));
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  document.querySelector('#fit-width').addEventListener('click', fitWidth);
  document.querySelector('#fit-page').addEventListener('click', fitPage);
  function zoom(factor) {
    fit = 'manual';
    resizeTo(Math.max(viewer.clientWidth * .2, Math.min(viewer.clientWidth * 5, width * factor)));
  }
  document.querySelector('#zoom-in').addEventListener('click', () => zoom(1.25));
  document.querySelector('#zoom-out').addEventListener('click', () => zoom(.8));
  viewer.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const top = viewer.scrollTop;
      const bottom = top + viewer.clientHeight;
      let largest = -1;
      [...pages.children].forEach((page, index) => {
        const pageTop = page.offsetTop - pages.offsetTop;
        const visible = Math.max(0, Math.min(bottom, pageTop + page.clientHeight) - Math.max(top, pageTop));
        if (visible > largest) { largest = visible; current = index; }
      });
      updateControls();
    });
  });
  viewer.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragging = {x:event.clientX, y:event.clientY, left:viewer.scrollLeft, top:viewer.scrollTop};
    viewer.setPointerCapture(event.pointerId);
    viewer.classList.add('dragging');
    event.preventDefault();
  });
  viewer.addEventListener('pointermove', event => {
    if (!dragging) return;
    viewer.scrollLeft = dragging.left - event.clientX + dragging.x;
    viewer.scrollTop = dragging.top - event.clientY + dragging.y;
  });
  function stopDrag() { dragging = null; viewer.classList.remove('dragging'); }
  viewer.addEventListener('pointerup', stopDrag);
  viewer.addEventListener('pointercancel', stopDrag);
  viewer.addEventListener('lostpointercapture', stopDrag);
  viewer.addEventListener('keydown', event => {
    if (['ArrowRight','PageDown'].includes(event.key)) { event.preventDefault(); goTo(current + 1); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); goTo(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(story.frames.length - 1); }
    if (event.key === '+' || event.key === '=') zoom(1.25);
    if (event.key === '-') zoom(.8);
  });
  const fullscreen = document.querySelector('#fullscreen');
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      const status = document.querySelector('#status');
      status.textContent = 'Fullscreen isn’t available in this browser.';
      status.hidden = false;
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const active = !!document.fullscreenElement;
    fullscreen.textContent = active ? 'Exit fullscreen' : 'Fullscreen';
    fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
  });
  new ResizeObserver(() => {
    if (fit === 'width') { fitWidth(); goTo(current); }
    else if (fit === 'page') fitPage();
    else updateControls();
  }).observe(viewer);
  fitWidth();
  goTo(0);
})();
