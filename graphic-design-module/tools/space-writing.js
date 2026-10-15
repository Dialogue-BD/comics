// Space studies share one paper material. Miniatures show the operation instead of shrinking prose.
const SP_GHOST_STYLE={'space-w-8':'between','space-w-9':'gesture','space-w-10':'request','space-w-11':'irony'};
const spMiniLine=(x,y,w,colour='#244331',width=4)=>`<path d="M${x} ${y}h${w}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`;
const spMiniText=(x,y,t,size=28,extra='')=>`<text x="${x}" y="${y}" font-family="Georgia,serif" font-size="${size}" ${extra.includes('fill=')?'':'fill="#244331"'} ${extra}>${esc(t)}</text>`;
function spMiniStrip(x,y,w,h,content){return `<g><path d="M${x} ${y}l${w} -1 1 ${h} -${w} 1Z" fill="#fff9e9" stroke="#c3b38e" stroke-width=".7"/>${content}</g>`}
function spMiniWater(y=116){return [0,15,30].map(n=>`<path d="M25 ${y+n}q12 -8 24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0" fill="none" stroke="#618b8b" stroke-width="3"/>`).join('')}
function spMiniWindow(){return '<g fill="none" stroke="#244331" stroke-width="3" stroke-linejoin="round"><path d="M127 35h64v88h-64ZM127 35l-28 13v90l28 -15ZM159 35v88M127 79h64"/><path d="M83 91q-15 -25 0 -43m-6 9 6 -9 7 8" stroke="#b48a40"/></g>'}
function spMiniKey(x=70,y=50){return `<g transform="translate(${x} ${y})" fill="none" stroke="#b48a40" stroke-width="5" stroke-linecap="round"><circle r="13"/><path d="M13 0h59m-13 0v12m-14 -12v9"/></g>`}
function spSpaceMini(e){const g=e.graphic,v=SP_GHOST_STYLE[e.id];let art='';
 if(g==='ellipsis')art=spMiniLine(30,81,60)+[120,153,186].map((x,i)=>`<circle cx="${x}" cy="85" r="${7-i}" fill="#b48a40" opacity="${1-i*.18}"/>`).join('')+'<path d="M37 122h151" stroke="#b9ac8c" stroke-width="2" stroke-dasharray="4 7"/>';
 else if(g==='interruption')art=spMiniStrip(22,36,190,49,spMiniLine(35,61,95)+spMiniText(156,73,'—',48))+spMiniStrip(49,107,164,49,spMiniLine(63,132,121))+ '<path d="M208 100l-9 -10 -9 10" fill="none" stroke="#b48a40" stroke-width="3"/>';
 else if(g==='paragraph-gap')art=[47,61,75].map((y,i)=>spMiniLine(31,y,[163,149,103][i])).join('')+spMiniLine(31,145,118)+'<path d="M205 82h-8v48h8" fill="none" stroke="#b48a40" stroke-width="2" stroke-dasharray="2 3"/>';
 else if(g==='scene-break')art=[42,55,68].map((y,i)=>spMiniLine(32,y,[174,149,107][i])).join('')+spMiniText(120,116,'⁂',40,'text-anchor="middle" fill="#b48a40"')+[146,159].map((y,i)=>spMiniLine(32,y,174-i*39)).join('');
 else if(g==='end-stop')art=[61,124].map(y=>spMiniLine(30,y,151)+`<circle cx="199" cy="${y}" r="6"/>`).join('')+'<path d="M219 43v33m0 31v33" stroke="#b48a40" stroke-width="2"/>';
 else if(g==='enjambment')art=spMiniLine(26,57,153)+spMiniLine(51,134,150)+'<path d="M189 57q31 0 30 34t-31 26H41m10 -8 -11 8 11 8" fill="none" stroke="#b48a40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
 else if(g==='omission')art=spMiniLine(30,39,108)+spMiniText(168,51,'?',37)+'<path d="M45 73h150v47H88l-17 15v-15H45Z" fill="none" stroke="#9eac99" stroke-width="2.5" stroke-dasharray="5 6"/>'+spMiniLine(31,157,134);
 else if(g==='parenthesis')art=spMiniLine(30,41,113)+spMiniText(25,112,'(',71)+spMiniText(195,112,')',71)+spMiniStrip(62,71,119,42,spMiniLine(77,93,89,'#70866b',3))+spMiniLine(70,150,141);
 else if(g==='ghost'&&v==='between')art=spMiniLine(29,39,174)+spMiniLine(29,149,174)+spMiniText(120,104,'stay?',40,'class="sp-mini-ghost" text-anchor="middle"')+spMiniLine(57,76,110,'#97a58b',2)+spMiniLine(67,121,109,'#97a58b',2);
 else if(g==='ghost'&&v==='gesture')art=spMiniText(120,49,'“fine”',34,'text-anchor="middle"')+'<g transform="rotate(-9 118 115)"><path d="M64 81h114v72H64ZM64 81l57 43 57 -43M64 153l43 -41m71 41 -43 -40" fill="none" stroke="#9d8055" stroke-width="2.5"/><path d="M120 84v67" stroke="#bda77b" stroke-dasharray="3 4"/></g>';
 else if(g==='ghost'&&v==='request')art=spMiniWindow()+spMiniText(60,150,'cold…',33,'class="sp-mini-ghost" text-anchor="middle"');
 else if(g==='ghost'&&v==='irony')art=spMiniText(120,46,'Wonderful',30,'text-anchor="middle"')+spMiniWater(120)+'<path d="M41 76l-6 15m34 -18 -6 15m35 -11 -6 15m35 -19 -6 15m35 -13 -6 15m35 -20 -6 15m35 -12 -6 15" stroke="#618b8b" stroke-width="2.4" stroke-linecap="round"/>';
 else if(g==='understatement')art=spMiniWater(69)+spMiniWater(113)+spMiniStrip(93,29,112,34,spMiniText(149,53,'“a little”',22,'text-anchor="middle"'));
 else if(g==='knowledge')art=spMiniKey(71,55)+spMiniStrip(38,87,165,68,spMiniText(120,130,'“gone”',35,'text-anchor="middle"'))+'<path d="M29 44q13 -18 26 0 -13 18 -26 0Z" fill="none" stroke="#70866b" stroke-width="2"/><circle cx="42" cy="44" r="4" fill="#70866b"/>';
 else throw Error('Missing Space miniature: '+e.id);
 return `<span class="vf-thumbnail sp-thumbnail" aria-hidden="true"><span class="sp-mini-sheet"><svg class="sp-mini-svg" viewBox="0 0 240 180" fill="#244331" data-space-mini="${e.id}" data-space-cue="${v||g}">${art}</svg></span></span>`;
}
const spBaseThumbnail=vfThumbnail;
vfThumbnail=function(id,e,medium){return id==='space'&&medium==='written'?spSpaceMini(e):spBaseThumbnail(id,e,medium)};
function spInk(text,cls=''){return `<p class="sp-ink ${cls}">${esc(text)}</p>`}
function spGhosts(e){const n=(e.ghosts||[]).length;return `<div class="ef-ghosts sp-ghost-count-${n}" style="--sp-cycle:${n*6}s">${(e.ghosts||[]).map((t,i)=>`<p style="--ef-i:${i}">${esc(t)}</p>`).join('')}</div>`}
function spContextArt(kind){let art='';if(kind==='request')art=spMiniWindow();if(kind==='gesture')art='<path d="M60 51h121v79H60ZM60 51l61 44 60 -44M60 130l43 -40m78 40 -43 -40M121 52v77" fill="none" stroke="#9d8055" stroke-width="3"/>';if(kind==='irony')art=spMiniWater(70)+'<path d="M50 32l-7 17m39 -15 -7 17m42 -21 -7 17m43 -14 -7 17m41 -21 -7 17" stroke="#618b8b" stroke-width="2.5"/>';if(kind==='understatement')art=spMiniWater(60)+spMiniWater(104);if(kind==='knowledge')art=spMiniKey(78,79);return `<svg class="sp-context-art sp-context-${kind}" viewBox="0 0 240 180" aria-hidden="true">${art}</svg>`}
function spSpaceGraphic(e,features=false){const a=e.example,g=e.graphic,v=SP_GHOST_STYLE[e.id];let body='';
 if(g==='ellipsis'){const n=a[0].indexOf('…');body=`<div class="sp-ellipsis-line">${esc(a[0].slice(0,n))}<span class="sp-dots">${[0,1,2].map(i=>`<i style="--sp-i:${i}">.</i>`).join('')}</span>${esc(a[0].slice(n+1))}</div><div class="sp-unwritten" aria-hidden="true"></div>`;}
 else if(g==='interruption'){const n=a[0].indexOf('—');body=`<div class="sp-cut-off">${spInk(a[0].slice(0,n))}<b class="sp-dash">—</b><span>${esc(a[0].slice(n+1))}</span></div><div class="sp-interrupting">${spInk(a[1])}</div>`;}
 else if(g==='paragraph-gap'||g==='scene-break'||g==='omission')body=`${spInk(a[0])}<div class="sp-interval sp-interval-${g}">${g==='scene-break'?'<span aria-hidden="true">⁂</span>':g==='omission'?'<span class="sp-empty-reply" aria-hidden="true"></span>':'<span class="sp-gap-measure" aria-hidden="true"></span>'}</div>${spInk(a[1],'sp-after-gap')}`;
 else if(g==='end-stop')body=`<div class="sp-end-lines">${a.map(t=>`<p class="sp-ink">${esc(t.replace(/\.$/,''))}<b class="sp-period">.</b></p>`).join('')}</div>`;
 else if(g==='enjambment')body=`<div class="sp-enjamb-lines">${spInk(a[0])}<svg viewBox="0 0 320 60" class="sp-run-on" aria-hidden="true"><path d="M272 5q25 0 25 22t-25 22H21m12 -10 -12 10 12 10" fill="none" stroke="#b48a40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>${spInk(a[1])}</div>`;
 else if(g==='parenthesis')body=`${spInk(a[0])}<div class="sp-lifted-aside"><b aria-hidden="true">(</b><div>${spInk(a[1])}</div><b aria-hidden="true">)</b></div>${spInk(a[2])}`;
 else if(g==='ghost')body=`${spContextArt(v==='between'?'':v)}${spInk(a[0],'sp-spoken-line')}${spGhosts(e)}${spInk(a[1],'sp-spoken-line')}`;
 else if(g==='understatement')body=`${spInk(a[0],'sp-large-context')}${spContextArt('understatement')}<div class="sp-small-claim">${spInk(a[1])}</div>`;
 else if(g==='knowledge')body=`<div class="sp-reader-layer">${features?'<small>Reader knows</small>':''}${spInk(a[0])}${spContextArt('knowledge')}</div><div class="sp-character-layer">${features?'<small>Character believes</small>':''}${spInk(a[1])}</div>`;
 else throw Error('Missing Space paper graphic: '+e.id);
 return `<div class="ef-literary-stage sp-scene sp-scene-${v||g}" data-effect-graphic="${g}" data-space-effect="${e.id}" role="img" aria-label="${esc(e.label+': '+a.join(' '))}"><div class="sp-sheet">${body}</div></div>`;
}
const spBaseWriterGraphic=efWriterGraphic;
efWriterGraphic=function(e,features=false){return e.id?.startsWith('space-w-')?spSpaceGraphic(e,features):spBaseWriterGraphic(e,features)};
