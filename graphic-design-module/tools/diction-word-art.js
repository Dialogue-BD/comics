const DICTION_ART={
 bright:{plain:'bright',rich:'radiant',meaning:'Radiant suggests light spreading outward.',before:'The bright sun warmed her face.',after:'The radiant sun warmed her face.'},
 small:{plain:'small',rich:'tiny',meaning:'Tiny means very small: a more precise sense of scale.',before:'A small bird landed on the branch.',after:'A tiny bird landed on the branch.'},
 empty:{plain:'empty',rich:'deserted',meaning:'Here, deserted stresses that people have left.',before:'The room was empty after the meeting.',after:'The room was deserted after the meeting.'}
};
function dictionWordSVG(key='bright',prefix='diction-map'){
 if(!DICTION_ART[key])key='bright';
 const a=DICTION_ART[key],ns=prefix+'-'+key,ink='#244331';
 const word=(s,x,y,size,fill,cls='',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" class="${cls}" ${extra}>${esc(s)}</text>`;
 let plain='',rich='';
 if(key==='bright'){
  plain=word('bright',300,180,100,'#ab8b3c','dict-bright-plain','text-anchor="middle"')+`<path d="M160 207H440" stroke="#bea35e" stroke-width="2"/>`;
  const rays=Array.from({length:24},(_,i)=>{const angle=i*Math.PI/12,x=300+Math.cos(angle)*[177,193,184][i%3],y=151+Math.sin(angle)*[67,73,62][i%3],x2=300+Math.cos(angle)*[245,233,252][i%3],y2=151+Math.sin(angle)*[118,115,110][i%3];return `<path d="M${x} ${y}L${x2} ${y2}" class="dict-ray" style="--dict-i:${i}" stroke="${i%2?'#b7643e':'#c5a246'}" stroke-width="${i%3?2:3}"/>`}).join('');
  rich=`<ellipse cx="300" cy="153" rx="230" ry="78" fill="url(#${ns}-aura)"/>${rays}<g class="dict-radiant-paper">${word('radiant',304,178,96,'#79603a','dict-word-shadow','text-anchor="middle"')}${word('radiant',301,175,96,'#ecce80','','text-anchor="middle" stroke="#6c583c" stroke-width=".9"')}${word('radiant',300,173,96,'url(#'+ns+'-ink)','','text-anchor="middle" stroke="#795b3c" stroke-width=".5"')}</g><path class="dict-glint" d="M499 78v20m-10-10h20M88 186v14m-7-7h14" stroke="#b77c3f" stroke-width="2"/>`;
 }
 if(key==='small'){
  plain=`<path d="M170 78H430V215H170Z" class="dict-small-frame"/>`+word('small',300,179,88,ink,'','text-anchor="middle"');
  rich=`<g class="dict-tiny-world"><path d="M248 105L353 102L358 201L245 204Z" fill="#e6ce8e" stroke="#bea66b" stroke-width="1"/><path d="M266 125H335M263 178H338" stroke="#ae985c" stroke-width="1"/>${word('tiny',300,165,44,ink,'','text-anchor="middle"')}<path d="M227 151h-13m13-4v8m145-4h13m-13-4v8M300 83V72m-4 11h8M300 224v11m-4-11h8" stroke="#a36549" stroke-width="1.3"/></g>`;
 }
 if(key==='empty'){
  plain=`<path d="M70 75H530V217H70Z" fill="none" stroke="#8c9c7d" stroke-width="1.5"/>`+word('empty',300,180,91,ink,'dict-hollow-word','text-anchor="middle"');
  rich=`<g class="dict-deserted-letters">${[...'deserted'].map((c,i)=>word(c,57+i*62,173+[0,-7,2,-3,4,-1,7,-4][i],77,i%3?'#805f44':'#41573c','dict-abandoned-letter',`style="--dict-i:${i};--dict-turn:${[0,-3,2,-1,3,0,-2,2][i]}deg"`)).join('')}</g><g class="dict-offcuts"><path d="M92 216l16 3-9 7Z" fill="#b79459"/><path d="M358 215l10 5-14 2Z" fill="#718466"/><path d="M471 65l14-4-4 12Z" fill="#c1a873"/></g><path d="M45 230L559 227" stroke="#bcaa88" stroke-width="1"/>`;
 }
 return `<svg class="literary-svg lit-color diction-word-art dict-${key}" data-literary-concept="color" data-diction-key="${key}" viewBox="0 0 600 300" role="img" aria-label="${esc(a.plain+' transforms into '+a.rich+'. '+a.meaning)}"><title>${esc(a.plain+' → '+a.rich+': '+a.meaning)}</title><defs><radialGradient id="${ns}-aura"><stop stop-color="#ebc76d" stop-opacity=".56"/><stop offset="1" stop-color="#e5bd65" stop-opacity="0"/></radialGradient><linearGradient id="${ns}-ink" x2="0" y2="1"><stop stop-color="#f1d38a"/><stop offset=".48" stop-color="#d6974c"/><stop offset="1" stop-color="#b96840"/></linearGradient></defs><g class="dict-plain">${plain}</g><g class="dict-rich">${rich}</g><text class="dict-art-caption" x="300" y="277" text-anchor="middle" font-size="21" fill="#796749">${esc(a.plain+' → '+a.rich)}</text></svg>`;
}
function dictionExample(key){const a=DICTION_ART[key]||DICTION_ART.bright;return `<p class="diction-meaning">${esc(a.meaning)}</p><div class="diction-sentences"><p>${esc(a.before)}</p><p>${esc(a.after).replace(a.rich,`<b>${a.rich}</b>`)}</p></div>`}
function dictionMotion(){const key=pairRecord('color').dictionArt||'bright';return `<div class="writing-motion writing-color"><div data-diction-display>${dictionWordSVG(key,'diction-lesson')}</div><div class="diction-art-controls" aria-label="Choose a word transformation">${Object.entries(DICTION_ART).map(([k,a])=>`<button class="btn" data-diction-art="${k}" aria-pressed="${k===key}">${esc(a.plain+' → '+a.rich)}</button>`).join('')}</div><div data-diction-example>${dictionExample(key)}</div></div>`}
document.addEventListener('click',event=>{const btn=event.target.closest('[data-diction-art]');if(!btn)return;const key=btn.dataset.dictionArt;if(!DICTION_ART[key])return;const root=btn.closest('.writing-motion');pairRecord('color').dictionArt=key;save();root.querySelector('[data-diction-display]').innerHTML=dictionWordSVG(key,'diction-lesson');root.querySelector('[data-diction-example]').innerHTML=dictionExample(key);root.querySelectorAll('[data-diction-art]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));});
