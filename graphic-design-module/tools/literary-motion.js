// Each motion is a diagram of a literary operation, rather than decoration on its name.
const LITERARY_MOTION={
 line:['Sentence','A longer sentence carries the scene forward. A short ending lands with more force.'],
 color:['Diction','Meaning-led word art transforms a plain word into a more vivid or precise choice.'],
 shape:['Text shapes','A–B–X–B′–A′: afraid and help return around a friend’s arrival.'],
 texture:['Sound & rhythm','Repeated s sounds resonate like returning notes; phrasing gives the prose a cadence.'],
 form:['Subtext','Read between the lines: three ghost thoughts offer possible interpretations. Use context to judge them.'],
 space:['Silence','The blank interval gives the final sentence room to linger.'],
 typography:['Emphasis & voice','Stress HIM: the contrast is with another person, rather than with seeing or leaving.'],
 contrast:['Antithesis & juxtaposition','Parallel positions bring opposing experiences into direct comparison.'],
 hierarchy:['Information architecture','Give the main point a home first; explanation and example support it.'],
 alignment:['Parallelism','Descriptions return as questions: sea, Jordan, mountains, and hills correspond across two stanzas.'],
 balance:['Punctuation & sentence architecture','A prominent colon supports a balancing beam: the second clause explains the first.'],
 proximity:['Paragraphing & cohesion','Gather the river details together and the boat details together. Each paragraph has a focus.'],
 repetition:['Anaphora','A returning opening connects three different memories and builds a rhythm.'],
 simplicity:['Concision','Remove in order: to keeps the purpose while using fewer words.'],
 function:['Genre & purpose','A narrative sequences events; an explanation connects a cause; an argument supports a claim.']
};
function literarySVG(id){
 if(id==='color')return dictionWordSVG('bright','diction-map');
 const ink='#244331',rust='#a36549',gold='#b08d4d',paper='#fbf4df',sage='#d9e0ca';
 const t=(x,y,s,cls='',size=27,fill=ink)=>`<text x="${x}" y="${y}" class="${cls}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;
 const rect=(x,y,w,h,fill=paper,cls='')=>{if(h<20)return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" class="${cls}"/>`;const points=[];for(let i=0;i<=16;i++)points.push([x+w*i/16,y+(i%3)*.7]);for(let i=1;i<=4;i++)points.push([x+w-(i%2)*.8,y+h*i/4]);for(let i=16;i>=0;i--)points.push([x+w*i/16,y+h-(i%3)*.7]);for(let i=3;i>0;i--)points.push([x+(i%2)*.8,y+h*i/4]);return `<path d="M${points.map(p=>p.join(' ')).join('L')}Z" fill="${fill}" class="lit-paper-piece ${cls}" filter="url(#lit-paper-${id})"/>`};
 const slip=(x,y,w,h,s,cls='',fill=paper,size=25)=>`<g class="lit-slip ${cls}">${rect(x,y,w,h,fill)}${t(x+15,y+h/2+9,s,'',size)}</g>`;
 const line=(x,y,x2,y2,cls='')=>`<path d="M${x} ${y}L${x2} ${y2}" class="lit-rule ${cls}"/>`;
 let art='';
 if(id==='line')art=t(32,64,'Rain darkened the path')+t(32,104,'as we walked toward the river.')+rect(32,125,520,4,sage)+rect(32,125,520,4,gold,'lit-travel')+`<g class="lit-landing">${slip(32,170,315,63,'Then the wind rose.','',ink).replace('fill="'+ink+'">Then','fill="'+paper+'">Then')}</g>`;

 if(id==='shape')art=['Ben was afraid.','He called for help.','His friend came.','His friend helped him.','Ben was not afraid.'].map((s,i)=>{const step=[0,1,2,1,0][i],x=25+step*43;return `<g class="lit-chiasm-row" style="--lit-indent:${step*43}px">${slip(x,25+i*51,550-step*43,42,s,'',step===2?'#e2c18b':step===1?sage:paper,27)}${t(x+4,52+i*51,['A','B','X','B′','A′'][i],'lit-chiasm-letter',12,rust)}</g>`}).join('');
 if(id==='texture')art=t(32,34,'SOUND AS A SCORE','',17,rust)+Array.from({length:5},(_,i)=>`<path d="M22 ${128+i*17}H578" stroke="#b6aa8b" stroke-width="1"/>`).join('')+['The stream','slipped','softly','over','smooth','stones.'].map((s,i)=>{const x=[16,144,243,330,403,501][i],nx=[68,178,270,350,440,535][i],ny=[162,179,162,145,162,179][i];return `<g class="lit-resonant-word" style="--lit-i:${i}">${t(x,91,s,'',21,i===3?'#8c8a73':ink)}<g class="lit-note"><ellipse cx="${nx}" cy="${ny}" rx="11" ry="7" transform="rotate(-15 ${nx} ${ny})" fill="${ink}"/><path d="M${nx+9} ${ny}V${ny-41}" stroke="${ink}" stroke-width="2.5"/></g>${i!==3?`<circle class="lit-resonance-ring" cx="${nx}" cy="${ny}" r="21" fill="none" stroke="${gold}" stroke-width="2"/>`:''}</g>`}).join('')+`<path class="lit-resonance-wave" d="M25 235Q65 213 105 235T185 235T265 235T345 235T425 235T505 235T575 235" fill="none" stroke="#668768" stroke-width="1.8"/>`+t(32,282,'Hear the returning /s/: stress · cadence · echo','',21);
 if(id==='form')art=line(32,96,568,96)+line(32,201,568,201)+t(32,65,'Mina glances at the coat.','',27)+t(32,231,'“You’re leaving already?”','',30)+['I hoped you’d stay.','I thought we had more time.','Have I upset you?'].map((s,i)=>`<g class="lit-ghost lit-ghost-${i}">${t(47,150,s,'',29,'#6c826b')}</g>`).join('')+t(32,279,'reading between the lines','',18,rust);
 if(id==='space')art=t(32,62,'He heard a voice inside.','',29)+t(32,102,'His hand fell.','',29)+`<g class="lit-wait">${t(32,230,'He waited.','',36)}${line(32,248,180,248)}</g>`+`<path class="lit-gap" d="M540 115V200M528 115H552M528 200H552"/>`;
 if(id==='typography')art=t(32,79,'She said she had seen','',31)+`<g class="lit-stress">${rect(28,101,135,73,'#dfbea3')}${t(40,151,'HIM','',45)}</g>`+t(180,151,'leave.','',36)+t(32,245,'that person, rather than someone else','',23);
 if(id==='contrast')art=slip(25,45,550,88,'Outside, the street roared.','lit-roar',ink,32).replace('fill="'+ink+'">Outside','fill="'+paper+'">Outside')+slip(25,159,550,88,'Inside, the house whispered.','lit-whisper',paper,29)+line(25,146,575,146)+t(435,146,'↕','',25,rust);
 if(id==='hierarchy')art=[['A library is useful for study.',35,32,530,65,'lit-main-point'],['A quiet desk helps you focus.',65,120,470,55,'lit-support'],['For example, read a chapter there.',95,197,410,50,'lit-example']].map(([s,x,y,w,h,c],i)=>slip(x,y,w,h,s,c,i===0?sage:paper,i===2?22:27)).join('')+line(45,110,45,250);
 if(id==='alignment')art=t(30,31,'DESCRIPTION','',16)+t(322,31,'QUESTIONS','',16)+['Sea retreats.','Jordan turns back.','Mountains / rams','Hills / lambs'].map((s,i)=>`<g class="lit-poetry-pair" style="--lit-i:${i}">${slip(25,51+i*57,263,48,s,'',i<2?sage:paper,23)}<g class="lit-poetry-question">${slip(312,51+i*57,263,48,['Why, sea?','Why, Jordan?','Why, mountains?','Why, hills?'][i],'',i<2?sage:paper,23)}</g></g>`).join('');
 if(id==='balance')art=`<g class="lit-colon-beam">${rect(20,68,244,86,paper)}${rect(336,68,244,86,paper)}${t(38,102,'The room','',30)}${t(38,138,'grew quiet','',30)}${t(355,102,'everyone','',30)}${t(355,138,'had left.','',30)}<path d="M25 174H575" stroke="${ink}" stroke-width="3"/></g><g class="lit-colon-mark" data-colon-fulcrum="true"><circle cx="300" cy="189" r="15" fill="${gold}" stroke="${ink}" stroke-width="2"/><circle cx="300" cy="231" r="15" fill="${gold}" stroke="${ink}" stroke-width="2"/></g>${t(59,284,'statement','',20)}${t(426,284,'explanation','',20)}`;
 if(id==='proximity')art=rect(20,28,270,232,sage)+rect(310,28,270,232,'#e7d6b8')+t(35,58,'RIVER','',16)+t(325,58,'BOAT','',16)+slip(32,79,246,65,'Lina reached the river.','lit-river-one',paper,21)+slip(32,168,246,65,'Mist covered the water.','lit-river-two',paper,21)+slip(322,79,246,65,'Blue paint was peeling.','lit-boat-one',paper,21)+slip(322,168,246,65,'A rope lay by the oar.','lit-boat-two',paper,21);
 if(id==='repetition')art=['the narrow path.','the empty bench.','the quiet house.'].map((s,i)=>`<g>${rect(25,40+i*75,550,58,paper)}<g class="lit-return" style="--lit-i:${i}">${rect(25,40+i*75,230,58,sage)}${t(40,78+i*75,'She remembered','',27)}</g>${t(270,78+i*75,s,'',27)}</g>`).join('');
 if(id==='simplicity')art=t(30,58,'He took a deep breath','',30)+`<g class="lit-trim">${slip(30,85,200,58,'in order','',paper,29)}${line(45,115,210,115)}</g>`+t(245,124,'to calm himself.','',29)+`<g class="lit-concise">${slip(30,185,540,63,'He took a deep breath to calm himself.','',sage,25)}</g>`;
 if(id==='function')art=[['NARRATIVE','Then Mina lit a candle.','→ → →'],['EXPLANATION','A lamp needs electricity.','cause → effect'],['ARGUMENT','Keep candles for power cuts.','claim + reason']].map(([name,s,mark],i)=>`<g class="lit-purpose lit-step-${i}">${rect(25,25+i*83,550,72,i===1?sage:paper)}${t(40,48+i*83,name,'',15,rust)}${t(40,80+i*83,s,'',25)}${t(402,48+i*83,mark,'',15)}</g>`).join('');
 const [name,meaning]=LITERARY_MOTION[id];return `<svg class="literary-svg lit-${id}" data-literary-concept="${id}" viewBox="0 0 600 300" role="img" aria-label="${esc(name+'. '+meaning)}"><title>${esc(name+': '+meaning)}</title><defs><filter id="lit-paper-${id}" x="-2%" y="-4%" width="104%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="7" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>${art}</svg>`;
}
// Pause diagrams outside the viewport; reconnect after either renderer replaces the page.
let literaryVisibility=null,literaryFrame=0;
function syncLiteraryVisibility(){
 literaryVisibility?.disconnect();
 literaryVisibility=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('lit-offscreen',!e.isIntersecting)),{rootMargin:'80px'});
 document.querySelectorAll('.literary-svg').forEach(el=>literaryVisibility.observe(el));
}
new MutationObserver(()=>{cancelAnimationFrame(literaryFrame);literaryFrame=requestAnimationFrame(syncLiteraryVisibility)}).observe(document.getElementById('main'),{childList:true,subtree:true});
