(function () {
  if (document.querySelector('.dialogue-brandbar')) return;
  var prefix = location.pathname.split('/').filter(Boolean).length ? '../' : '';
  document.body.classList.add(prefix ? 'dialogue-activity-shell' : 'dialogue-home');
  var bar = document.createElement('a');
  bar.className = 'dialogue-brandbar';
  bar.href = prefix + 'index.html';
  bar.setAttribute('aria-label', 'Back to Dialogue activities');
  bar.innerHTML = '<img src="' + prefix + 'ai-fluency/assets/dialogue-logo.png" alt=""><span><strong>Dialogue</strong><span>Learning collection</span></span>';
  document.body.prepend(bar);
}());