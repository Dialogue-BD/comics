(function () {
  var parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  var last = parts[parts.length - 1] || '';
  var isHome = Boolean(document.getElementById('grid-view') && document.getElementById('slideshow-view'));
  var route = isHome ? 'home' : (last === 'index.html' ? (parts[parts.length - 2] || 'home') : (last || 'home'));
  document.body.dataset.dialoguePage = route;
  if (document.querySelector('.dialogue-brandbar')) return;
  var prefix = isHome ? './' : '../';
  document.body.classList.add(isHome ? 'dialogue-home' : 'dialogue-activity-shell');
  var bar = document.createElement('a');
  bar.className = 'dialogue-brandbar';
  bar.href = isHome ? './' : prefix + 'index.html';
  bar.setAttribute('aria-label', 'Back to Dialogue activities');
  bar.innerHTML = '<img src="' + prefix + 'ai-fluency/assets/dialogue-logo.png" alt=""><span><strong>Dialogue</strong><span>Learning collection</span></span>';
  bar.setAttribute('title', 'Dialogue Learning collection · Back to activities');
  document.body.prepend(bar);
}());
