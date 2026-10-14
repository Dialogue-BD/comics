// Every renderer demonstrates a specific literary operation using the authored example.
function efMark(text,features=[]){let source=esc(text);if(!features.length)return source;const pattern=new RegExp(features.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).sort((a,b)=>b.length-a.length).join('|'),'g');return source.replace(pattern,m=>`<mark>${m}</mark>`)}
function efSlip(text,i=0,cls='',features=[]){return `<div class="ef-slip ${cls}" style="--ef-i:${i}">${efMark(text,features)}</div>`}
function efStrips(lines,cls='',features=[]){return `<div class="ef-strips ${cls}">${lines.map((s,i)=>efSlip(s,i,'',features)).join('')}</div>`}
function efBeam(parts,mark=':'){const clean=parts.map(s=>s.replace(/[;:]$/,''));return `<div class="ef-sentence-beam"><div class="ef-beam-arms">${clean.map((s,i)=>`<div class="ef-beam-clause">${esc(s)}</div>`).join('')}</div><div class="ef-beam-rule"></div><span class="ef-fulcrum">${esc(mark)}</span></div>`}
function efPaperSequence(lines,mode='sequence',roles=[]){return `<div class="ef-paper-sequence ef-${mode}">${lines.map((s,i)=>`<div class="ef-sequence-item" style="--ef-i:${i}">${roles[i]?`<small>${esc(roles[i])}</small>`:''}${efSlip(s,i)}</div>`).join('')}</div>`}
function efChiasmSentence(s,i){const text=esc(s);if(i===2)return `<mark class="chiastic-echo echo-x">${text}</mark>`;return text.replace(i===0||i===4?/\bafraid\b/g:/\b(helped|help)\b/g,m=>`<mark class="chiastic-echo echo-${i===0||i===4?'a':'b'}">${m}</mark>`)}
function efWriterGraphic(e,features=false){const g=e.graphic,a=e.example;let art='';
 if(g==='document')return efDocument(e.form,features);
 if(g==='snowball')return efSnowball(features);
 if(g==='chiasm')art=`<div class="chiastic-prose ef-chiasm ${features?'ef-chiasm-noticed':''}">${a.map((s,i)=>`<span class="chiastic-sentence" style="--chiastic-step:${[0,1,2,1,0][i]}" data-chiasm-part="${['A','B','X','B′','A′'][i]}">${efChiasmSentence(s,i)}</span>`).join('')}</div>`;
 else if(g==='story-arc'||g==='turning-point')art=`<div class="ef-story-structure ef-${g}">${a.map((s,i)=>`<section style="--ef-i:${i};--ef-arc:${g==='story-arc'?[0,1,2,1,0][i]:[0,2,0][i]}"><small>${esc(e.roles[i])}</small>${efSlip(s,i,i===(g==='story-arc'?2:1)?'ef-turning-event':'')}</section>`).join('')}</div>`;
 else if(g==='frame-story')art=`<div class="ef-story-frame">${efSlip(a[0])}<div class="ef-inner-story"><small>Story being told</small>${efStrips(a.slice(1,-1))}</div>${efSlip(a[a.length-1],3)}</div>`;
 else if(g==='flashback')art=`<div class="ef-time-structure">${a.map((s,i)=>`<section class="${i===1?'ef-past-time':'ef-present-time'}"><small>${esc(e.roles[i])}</small>${efSlip(s,i)}</section>`).join('')}</div>`;
 else if(g==='story-strands')art=`<div class="ef-strand-structure">${a.map((s,i)=>`<section class="ef-strand-${e.groups[i]}"><small>${esc(e.roles[i])}</small>${efSlip(s,i)}</section>`).join('')}</div>`;
 else if(g==='word-pair'){const [plain,rich]=a;art=`<div class="ef-word-pair ef-word-${e.pair}"><span class="ef-plain-word">${esc(plain)}</span><span class="ef-word-arrow">→</span><span class="ef-rich-word">${e.pair==='empty'?[...rich].map((c,i)=>`<i style="--ef-i:${i}">${esc(c)}</i>`).join(''):esc(rich)}</span></div>`;}
 else if(g==='heavy-word'||g==='whisper-word')art=`<div class="ef-word-pair ef-${g}"><span class="ef-plain-word">${esc(a[0])}</span><span class="ef-word-arrow">→</span><span class="ef-rich-word">${esc(a[1])}</span></div>`;
 else if(g==='register')art=`<div class="ef-register-pair">${a.map((s,i)=>efSlip(s,i,i?'ef-formal':'ef-conversation')).join('')}</div>`;
 else if(['stops','fragment','end-stop'].includes(g))art=efStrips(a,'ef-stops',e.features);
 else if(['cumulative','periodic','coordination','subordinate','background','end-weight'].includes(g)){const main=g==='periodic'?a.length-1:g==='subordinate'||g==='background'?1:0;art=`<div class="ef-clause-route ef-${g}">${a.map((s,i)=>efSlip(s,i,i===main?'ef-main-clause':'ef-support-clause')).join('')}<span class="ef-route-line" aria-hidden="true"></span></div>`;}
 else if(g==='question')art=`<div class="ef-question">${efSlip(a[0])}<span class="ef-question-echo" aria-hidden="true">?</span></div>`;
 else if(['sound','rough-sound','smooth-sound','cadence'].includes(g)){let lines=a;if(g==='sound'&&e.sound==='s')art='<div class="ef-strips ef-sound">'+lines.map((line,i)=>'<div class="ef-slip" style="--ef-i:'+i+'">'+esc(line).replace(/\b([sS])/g,'<mark>$1</mark>')+'</div>').join('')+'</div>';else art=efStrips(lines,'ef-'+g,e.features);art+=`<div class="ef-score" aria-hidden="true"><div class="ef-staff"></div>${Array.from({length:6},(_,i)=>`<span class="ef-note" style="--ef-i:${i}">♪</span>`).join('')}</div>${e.sound&&features?`<p class="ef-phoneme">Returning sound /${esc(e.sound)}/</p>`:''}`;}
 else if(g==='sound-words')art=efStrips(a,'ef-sound-words');
 else if(g==='ghost')art=`<div class="ef-between-lines">${efSlip(a[0])}<div class="ef-ghosts">${(e.ghosts||[]).map((s,i)=>`<p style="--ef-i:${i}">${esc(s)}</p>`).join('')}</div>${efSlip(a[1]||'',1)}</div>`;
 else if(g==='understatement')art=`<div class="ef-understatement">${efSlip(a[0],0,'ef-large-context')}${efSlip(a[1],1,'ef-small-claim')}</div>`;
 else if(g==='knowledge')art=`<div class="ef-knowledge"><section><small>Reader knows</small>${efSlip(a[0])}</section><section><small>Character believes</small>${efSlip(a[1])}</section></div>`;
 else if(g==='ellipsis'){const t=a[0],index=t.indexOf('…');art=`<div class="ef-ellipsis">${esc(t.slice(0,index))}<span class="ef-dots">${[0,1,2].map(i=>`<i style="--ef-i:${i}">.</i>`).join('')}</span>${esc(t.slice(index+1))}<span class="ef-unsaid" aria-hidden="true"></span></div>`;}
 else if(g==='interruption')art=`<div class="ef-interruption">${efSlip(a[0],0,'ef-interrupted')}${efSlip(a[1],1,'ef-interrupting')}</div>`;
 else if(['paragraph-gap','scene-break','omission'].includes(g))art=`<div class="ef-gaps">${efSlip(a[0])}<div class="ef-reading-gap ${g==='scene-break'?'ef-scene-gap':''}">${g==='scene-break'?'<span aria-hidden="true">⁂</span>':g==='omission'?'<span class="ef-silence-label">reply left unsaid</span>':'<span class="ef-gap-bracket" aria-hidden="true"></span>'}</div>${efSlip(a[1],1,'ef-after-gap')}</div>`;
 else if(g==='enjambment')art=`<div class="ef-enjambment">${efSlip(a[0])}<span class="ef-continuation" aria-hidden="true">↳</span>${efSlip(a[1],1)}</div>`;
 else if(['parenthesis','brackets','apposition'].includes(g)){const marks=g==='parenthesis'?['(',')']:g==='brackets'?['[',']']:['',''];art=`<div class="ef-host-sentence">${efSlip(a[0],0,'ef-host')}<div class="ef-aside"><b class="ef-aside-mark">${marks[0]}</b>${efSlip(a[1],1,'ef-aside-copy')}<b class="ef-aside-mark">${marks[1]}</b></div>${efSlip(a[2],2,'ef-host')}</div>`;}
 else if(g==='stress')art=efStrips(a,'ef-stress',e.features);
 else if(g==='inner-thought')art=`<div class="ef-inner-thought">${efSlip(a[0])}${efSlip(a[1],1,'ef-thought')}</div>`;
 else if(g==='voices')art=efStrips(a,'ef-voices');
 else if(g==='quotation'||g==='quote-comment')art=`<div class="ef-quote-frame">${a.map((s,i)=>efSlip(s,i,s.includes('“')?'ef-quoted':'ef-comment')).join('')}</div>`;
 else if(g==='heading')art=`<div class="ef-prose-section"><h3>${esc(a[0])}</h3>${efDocParagraph(a[1])}<div class="ef-heading-guide" aria-hidden="true"></div></div>`;
 else if(g==='antithesis'||g==='balanced-clauses'||g==='semicolon')art=efBeam(a,';').replace(/empty|full/g,m=>`<mark>${m}</mark>`);
 else if(g==='colon')art=efBeam(a,':');
 else if(g==='dash-reveal')art=efBeam(a,'—');
 else if(['juxtaposition','long-short','turn','reversal','reflection'].includes(g))art=efStrips(a,'ef-'+g,e.features);
 else if(g==='argument')art=efPaperSequence(a,'argument',e.roles||[]);
 else if(g==='theme-chain'||g==='reference')art=efStrips(a,'ef-link-chain',e.features)+`<div class="ef-link-rail" aria-hidden="true">↳</div>`;
 else if(g==='parallel'||g==='semantic-pair')art=`<div class="ef-aligned-series"><span class="ef-alignment-guide" aria-hidden="true"></span>${efStrips(a,'ef-parallel-lines',e.features)}</div>`;
 else if(g==='stanza')art=`<div class="ef-stanza-correspondence">${[a.slice(0,4),a.slice(4)].map((group,n)=>`<section><small>${n?'Returning questions':'Descriptions'}</small>${group.map((s,i)=>`<div class="ef-stanza-line" style="--ef-i:${i}"><span class="ef-stanza-key">${i+1}</span>${esc(s)}</div>`).join('')}</section>`).join('')}</div>`;
 else if(g==='groups')art=`<div class="ef-prose-groups">${e.names.map((n,i)=>`<section><small>${esc(n)}</small>${a.filter((_,j)=>e.groups[j]===i).map((s,j)=>efSlip(s,j)).join('')}</section>`).join('')}</div>`;
 else if(g==='footnote')art=`<div class="ef-footnote">${efSlip(a[0]).replace('¹','<sup>1</sup>')}<div class="ef-footnote-rule"></div><p><b>1</b> ${esc(a[1].replace(/^1\. /,''))}</p></div>`;
 else if(['anaphora','epistrophe','refrain','bookends','motif-text','conjunctions'].includes(g))art=efStrips(a,'ef-'+g,e.features);
 else if(g==='cut')art=`<div class="ef-cut-sentence">${a.map((s,i)=>efSlip(s,i,e.remove.includes(i)?'ef-removable':'ef-retained')).join('')}</div><p class="ef-cut-result">${esc(a.filter((_,i)=>!e.remove.includes(i)).join(' '))}</p>`;
 else if(g==='replace')art=`<div class="ef-edit-pair">${efSlip(a[0],0,'ef-edit-start')}${efSlip(a[1],1,'ef-edit-finish')}</div>`;
 else if(g==='omitted-verb')art=`<div class="ef-omitted-verb">${efSlip(a[0])}${efSlip(a[1],1)}<p class="ef-recovered-word">carried <small>understood from the first clause</small></p></div>`;
 else if(g==='keep-purpose')art=efStrips(a,'ef-keep-purpose');
 else if(g==='lipogram')art=`<div class="ef-letter-rule"><span class="ef-excluded-letter" aria-hidden="true">${esc(e.exclude)}</span><div>${efSlip(a[0])}<p class="ef-letter-count">${features?'No '+esc(e.exclude)+' · '+(a.join(' ').toLowerCase().split(e.exclude).length-1)+' occurrences':'A chosen letter is absent.'}</p></div></div>`;
 else if(g==='sequence'||g==='instructions')art=efPaperSequence(a,g,g==='instructions'?a.map((_,i)=>String(i+1)):[]);
 else if(g==='cause')art=`<div class="ef-cause">${efSlip(a[0])}<span class="ef-cause-arrow" aria-hidden="true">→</span>${efSlip(a[1],1)}</div>`;
 else if(g==='description')art=`<div class="ef-description">${efSlip(a[0],0,'',e.features)}<div class="ef-cup" aria-hidden="true"><span></span></div></div>`;
 else throw Error('No literary effect renderer: '+g);
 return `<div class="ef-literary-stage ef-graphic-${g}" data-effect-graphic="${g}" role="img" aria-label="${esc(e.label+': '+a.join(' '))}">${art}</div>`;
}
