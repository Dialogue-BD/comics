/* ===========================================================================
   How Are You Feeling? — the paper version
   ---------------------------------------------------------------------------
   For students with no phone or no data. One A4 side each, never two (Tim's
   rule for every printable on the site), laid out to the Brand Book's
   document anatomy: running header, forest rule, gold square bullets.
     Print.word(w)  the worksheet for one feeling, filled with its chunks
     Print.blank()  the same page with the content left for the student
   The listening in step 1 is played from the projector while students tally.
   =========================================================================== */
'use strict';
const Print = (() => {
  const css = `
  #print-root .ws{font-family:'Public Sans',Arial,sans-serif;color:#1D211C;font-size:10pt;line-height:1.36;width:190mm;height:276mm;display:flex;flex-direction:column;gap:3mm;overflow:hidden}
  #print-root .ws *{box-sizing:border-box}
  #print-root .ws-head{display:flex;align-items:center;gap:4mm;padding-bottom:2.5mm;border-bottom:1.2mm solid #134219}
  #print-root .ws-head img{width:27mm;height:auto}
  #print-root .ws-t{flex:1}
  #print-root .ws-t h1{font-family:Spectral,Georgia,serif;font-weight:600;font-size:17pt;margin:0;color:#134219;line-height:1.1}
  #print-root .ws-t p{margin:1mm 0 0;font-size:8.6pt;color:#5F6A5C}
  #print-root .ws-word{display:flex;align-items:center;gap:3mm;padding:2mm 4mm;border-radius:3mm;border:.4mm solid #134219;min-width:56mm}
  #print-root .ws-word .e{font-size:20pt}
  #print-root .ws-word b{display:block;font-family:Spectral,Georgia,serif;font-size:17pt;color:#134219;line-height:1}
  #print-root .ws-word span{display:block;font-size:8.5pt;color:#5F6A5C}
  #print-root .ws-name{display:flex;gap:6mm;font-size:8.6pt;color:#5F6A5C}
  #print-root .ws-name i{flex:1;border-bottom:.3mm solid #999;font-style:normal}
  #print-root .ws-body{display:grid;grid-template-columns:47mm 1fr;gap:4mm;flex:1;min-height:0}
  #print-root .ws-side{display:flex;flex-direction:column;gap:3mm}
  #print-root .ws-side svg{width:100%;height:auto}
  #print-root .ws-box{border:.3mm solid #C9C3B0;border-radius:2mm;padding:2.2mm 2.6mm}
  #print-root .ws-box h3{font-size:8pt;letter-spacing:.12em;text-transform:uppercase;color:#795E20;margin:0 0 1.2mm;font-weight:800}
  #print-root .ws-storm{display:grid;grid-template-columns:repeat(5,1fr);gap:1mm;text-align:center;font-weight:800}
  #print-root .ws-storm svg{width:8mm;height:8mm}
  #print-root .ws-main{display:flex;flex-direction:column;gap:3.2mm}
  #print-root .ws-grid .ws-line{justify-content:flex-start}
  #print-root .ws-grid .ws-line i{flex:0 0 30mm}
  #print-root .ws-sec{display:grid;grid-template-columns:7mm 1fr;gap:2mm;padding-bottom:3mm;border-bottom:.25mm solid #E1DCCB}
  #print-root .ws-sec:last-child{border-bottom:0}
  #print-root .ws-n{width:7mm;height:7mm;border-radius:50%;background:#134219;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:9pt}
  #print-root .ws-sec h2{font-size:10.5pt;margin:0 0 .6mm;color:#134219}
  #print-root .ws-sec .how{margin:0 0 1.2mm;color:#5F6A5C;font-size:8.6pt}
  #print-root .ws-tally{height:12mm;border:.3mm dashed #999;border-radius:1.5mm;display:flex;align-items:center;justify-content:flex-end;padding-right:3mm;color:#5F6A5C;font-size:8.5pt}
  #print-root .ws-grid{display:grid;grid-template-columns:1fr 1fr;gap:1mm 5mm}
  #print-root .ws-line{display:flex;align-items:flex-end;gap:1.5mm;min-height:7mm}
  #print-root .ws-line i{flex:1;border-bottom:.3mm solid #999;min-width:18mm;font-style:normal;color:#999;font-size:8pt;padding-left:1mm}
  #print-root .ws-bank{margin-top:1.2mm;padding:1.2mm 2mm;background:#F4F1E6;border-radius:1.5mm;font-size:8.6pt}
  #print-root .ws-bank b{color:#795E20;margin-right:2mm}
  #print-root .hw{font-weight:800}
  #print-root .ws-opts{white-space:nowrap;font-weight:700;color:#5F6A5C}
  #print-root ol{margin:0;padding-left:4.5mm}
  #print-root li{margin:1.1mm 0}
  #print-root .ws-idm{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm}
  #print-root .ws-idm div{border:.3mm solid #C9C3B0;border-radius:1.5mm;padding:1.5mm 2mm}
  #print-root .ws-idm b{display:block;font-family:Spectral,Georgia,serif;font-size:10pt;color:#134219;line-height:1.15}
  #print-root .ws-idm span{font-size:8pt;color:#5F6A5C}
  #print-root .ws-foot{display:flex;justify-content:space-between;font-size:7.8pt;color:#5F6A5C;border-top:.3mm solid #C9C3B0;padding-top:1.5mm}
  #print-root .sq{display:inline-block;width:2mm;height:2mm;background:#B9924F;margin-right:1.6mm;vertical-align:middle}
  `;
  const LV = ['I have heard it', 'I know its partners', 'I know its pattern', 'I have said it', 'I can say it other ways', 'It is mine'];
  function berg(){
    const y = [192, 164, 136, 76, 54, 32];
    return '<svg viewBox="0 0 170 210"><rect x="0" y="92" width="170" height="118" fill="#EAF3F7"/>' +
      '<path d="M116 92l10-28 6 6 9-22 7 14 6-5 10 35z" fill="#fff" stroke="#1F5C7A" stroke-width="1.4"/>' +
      '<path d="M112 92l-8 50 10 46 30 12 20-24 4-48-10-36z" fill="#F6FAFC" stroke="#1F5C7A" stroke-width="1.4"/>' +
      '<path d="M0 92h170" stroke="#123F57" stroke-dasharray="4 3" stroke-width="1.2"/>' +
      '<text x="168" y="89" text-anchor="end" font-size="6.5" font-weight="800" fill="#123F57">WATERLINE</text>' +
      LV.map((l, i) => '<circle cx="7" cy="' + y[i] + '" r="4.2" fill="#fff" stroke="#1F5C7A" stroke-width="1.2"/>' +
        '<text x="14" y="' + (y[i] + 2.4) + '" font-size="6.8" font-weight="700" fill="#1D211C">' + l + '</text>').join('') +
      '<text x="85" y="206" text-anchor="middle" font-size="6.8" fill="#5F6A5C">Colour a circle each time your word rises.</text></svg>';
  }
  function storm(label){
    return '<div class="ws-box"><h3>' + label + '</h3><div class="ws-storm">' + [1, 2, 3, 4, 5].map(n => '<div>' + weather(n) + '<div>' + n + '</div></div>').join('') + '</div></div>';
  }
  function head(w){
    return '<div class="ws-head"><img src="../brand/dialogue-logo.png" alt=""><div class="ws-t"><h1>How Are You Feeling?</h1><p>The word iceberg · name a feeling, then take its word from “heard it” to “it is mine”.</p></div>' +
      (w ? '<div class="ws-word"><span class="e">' + emoji(w) + '</span><div><b>' + esc(w) + '</b><span>' + esc(EMO.pron[lower(w)] || '') + ' ' + esc(bnWord(w)) + '</span></div></div>'
         : '<div class="ws-word"><span class="e">🙂</span><div><b>&nbsp;</b><span>My word: ____________________</span></div></div>') + '</div>' +
      '<div class="ws-name"><span>Name</span><i></i><span>Date</span><i style="flex:.5"></i></div>';
  }
  function foot(){ return '<div class="ws-foot"><span>dialogue-bd.com/emotions</span><span>Dialogue English &amp; Skills Center · English Club</span></div>'; }
  function sec(n, title, how, inner){ return '<div class="ws-sec"><div class="ws-n">' + n + '</div><div><h2>' + title + '</h2>' + (how ? '<p class="how">' + how + '</p>' : '') + inner + '</div></div>'; }
  function side(){
    return '<div class="ws-side"><div class="ws-box"><h3>My word rises</h3>' + berg() + '</div>' +
      storm('Storm before') + storm('Storm after') +
      '<div class="ws-box"><h3>Breathe</h3><p style="margin:0;font-size:8.4pt">In for 4 · out for 6.<br>Three times.</p></div></div>';
  }

  function wordSheet(w){
    const C = chunk(w);
    const partners = C.p.map(s => {
      const q = partnerOf(s), part = q.side === 'l' ? q.before : q.after, gap = '<i>' + part[0] + '</i>', hw = '<span class="hw">' + esc(q.form || lower(w)) + '</span>';
      const other = q.side === 'l' ? q.after : q.before;
      return '<div class="ws-line">' + (q.side === 'l' ? gap + ' ' + hw + (other ? ' ' + esc(other) : '') : (other ? esc(other) + ' ' : '') + hw + ' ' + gap) + '</div>';
    }).join('');
    const bank = shuffle(C.p.map(s => { const q = partnerOf(s); return q.side === 'l' ? q.before : q.after; })).join(' · ');
    const pats2 = C.g.map(g => {
      const key = g[1].match(/\[([^\]]+)\]/)[1];
      const opts = shuffle([key].concat(g[2].split('|'))).join(' / ');
      const h = marked(g[1].replace(/\[[^\]]+\]/, '§'), w).replace('§', '______');
      return '<li>' + h + ' <span class="ws-opts">(' + esc(opts) + ')</span></li>';
    }).join('');
    const idm = C.i.map(I => '<div><b>' + esc(I[0]) + '</b><span>' + esc(I[1]) + '</span></div>').join('');
    return '<div class="ws">' + head(w) + '<div class="ws-body">' + side() + '<div class="ws-main">' +
      sec(1, 'Hear it', 'Listen to the projector. Make a mark every time you hear <b>' + esc(lower(w)) + '</b>.', '<div class="ws-tally">I heard it ______ times</div>') +
      sec(2, 'Partners <span style="font-weight:500;color:#5F6A5C">· collocations</span>', 'Write the partner. The first letter is there to help.', '<div class="ws-grid">' + partners + '</div><div class="ws-bank"><b>Word bank</b>' + esc(bank) + '</div>') +
      sec(3, 'Patterns <span style="font-weight:500;color:#5F6A5C">· colligations</span>', 'Circle the small grammar word that fits, then write it in.', '<ol>' + pats2 + '</ol>') +
      sec(4, 'Say it your way', null,
        '<div class="ws-line">I feel <span class="hw">&nbsp;' + esc(lower(w)) + '&nbsp;</span> because <i></i></div>' +
        '<div class="ws-line">What’s really at stake is <i></i></div><div class="ws-line">I need <i></i></div>' +
        '<p class="how" style="margin-top:1mm"><span class="sq"></span>Say your three sentences to your partner. Then listen to theirs.</p>') +
      sec(5, 'Idioms', 'Circle the one that fits your moment. Then use it.', '<div class="ws-idm">' + idm + '</div><div class="ws-line" style="margin-top:1.4mm">My sentence: <i></i></div>') +
      sec(6, 'Share', null, '<p class="how" style="margin:0"><span class="sq"></span>Tell the class your word — no names needed. Then colour the top of your iceberg.</p>') +
      '</div></div>' + foot() + '</div>';
  }
  function blankSheet(){
    const lines = n => Array.from({ length: n }, () => '<div class="ws-line"><i style="flex:1"></i></div>').join('');
    return '<div class="ws">' + head(null) + '<div class="ws-body">' + side() + '<div class="ws-main">' +
      sec(1, 'Hear it', 'Listen to the projector. Make a mark every time you hear your word.', '<div class="ws-tally">I heard it ______ times</div>') +
      sec(2, 'Partners <span style="font-weight:500;color:#5F6A5C">· collocations</span>', 'Words that often go with my word (feel ___, deeply ___, ___ about my exam).', '<div class="ws-grid">' + lines(6) + '</div>') +
      sec(3, 'Patterns <span style="font-weight:500;color:#5F6A5C">· colligations</span>', 'My word + a small grammar word + a slot. Example: anxious <b>about</b> + noun · too anxious <b>to</b> + verb.', '<div class="ws-grid">' + lines(4) + '</div>') +
      sec(4, 'Say it your way', null,
        '<div class="ws-line">I feel <i style="flex:.5"></i> because <i></i></div><div class="ws-line">What’s really at stake is <i></i></div><div class="ws-line">I need <i></i></div>' +
        '<p class="how" style="margin-top:1mm"><span class="sq"></span>Say your three sentences to your partner. Then listen to theirs.</p>') +
      sec(5, 'Idioms', 'Other ways English says my feeling — and what they mean.', lines(3) + '<div class="ws-line" style="margin-top:1mm">My sentence: <i></i></div>') +
      sec(6, 'Share', null, '<p class="how" style="margin:0"><span class="sq"></span>Tell the class your word — no names needed. Then colour the top of your iceberg.</p>') +
      '</div></div>' + foot() + '</div>';
  }
  function out(html){
    const root = $('#print-root');
    root.innerHTML = '<style>' + css + '</style>' + html;
    const img = root.querySelector('img');
    const go = () => setTimeout(() => window.print(), 60);
    if (img && !img.complete) { img.onload = go; img.onerror = go; } else go();
  }
  return { word: w => out(wordSheet(w)), blank: () => out(blankSheet()), wordSheet, blankSheet, css };
})();
