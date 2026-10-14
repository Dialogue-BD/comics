// Adapted from the supplied prototype's scales game, using the shared lesson state and coach.
const pbBaseRecord=mcRecord;
mcRecord=function(id){
 const r=pbBaseRecord(id);
 if(id==='balance'&&!r.punctuationBalanceVersion){
  const old=r.states.manipulate;
  if(old&&old.id!==MERGED.balance.challenges.manipulate.id){
   r.previous=r.previous||[];r.previous.push({...old,practised:!!r.done.manipulate});
   delete r.states.manipulate;delete r.done.manipulate;
  }
  r.punctuationBalanceVersion=1;
 }
 return r;
};
const pbBaseReady=mcReady,pbBaseCorrect=mcCorrect,pbBaseModel=mcModel,pbBaseGameText=mcGameText;
mcReady=function(g,r){return g.kind==='punctuation'?Number.isInteger(r.choice)&&g.marks[r.choice]!==undefined:pbBaseReady(g,r)};
mcCorrect=function(g,r){return g.kind==='punctuation'?r.choice===g.answer:pbBaseCorrect(g,r)};
function pbSentence(g,n){return g.clauses[0]+g.marks[n]+' '+g.clauses[1]+'.'}
mcModel=function(g){return g.kind==='punctuation'?pbSentence(g,g.answer):pbBaseModel(g)};
mcGameText=function(g,r){return g.kind==='punctuation'?(mcReady(g,r)?[pbSentence(g,r.choice)]:[]):pbBaseGameText(g,r)};
function pbEffect(n){return ['drop','level','tilt'][n]||'waiting'}
function pbNote(n){return [
 'Two complete ideas. A comma alone cannot join them.',
 'Both ideas stand on their own. A semicolon links them.',
 'This also works. The dash adds a stronger pause.'
 ][n]||'Choose a mark. Watch the balance.'}
function pbLabel(g,n){return mcReady(g,{choice:n})?pbSentence(g,n)+' '+pbNote(n):g.clauses[0]+'. '+g.clauses[1][0].toUpperCase()+g.clauses[1].slice(1)+'. Choose punctuation to connect these complete ideas.'}
const pbBaseInteraction=mcInteraction;
mcInteraction=function(id,key){
 const g=MERGED[id].challenges[key],r=mcState(id,key);
 if(g.kind!=='punctuation')return pbBaseInteraction(id,key);
 return `<div class="pb-game" data-pb-effect="${pbEffect(r.choice)}">
  <div class="pb-stage" role="img" aria-label="${esc(pbLabel(g,r.choice))}" data-pb-drop>
   <div class="pb-beam"><span class="pb-clause">${esc(g.clauses[0])}</span><b class="pb-joint">${r.choice===null?'?':esc(g.marks[r.choice])}</b><span class="pb-clause">${esc(g.clauses[1])}.</span></div>
   <span class="pb-fulcrum" aria-hidden="true"></span><span class="pb-base" aria-hidden="true"></span><span class="pb-ground" aria-hidden="true"></span>
  </div>
  <div class="pb-marks" role="group" aria-label="Choose punctuation. You can tap a mark or drag it onto the beam.">${g.marks.map((mark,n)=>`<button type="button" class="mc-chip pb-mark" draggable="true" data-pb-pick="${n}" aria-pressed="${r.choice===n}" aria-label="${esc(g.tiles[n])}"><b aria-hidden="true">${esc(mark)}</b><span>${esc(g.tiles[n])}</span></button>`).join('')}</div>
  <p class="pb-note" role="status" aria-live="polite">${esc(pbNote(r.choice))}</p>
 </div>`;
};
const pbBasePreview=mcPreview;
mcPreview=function(id,key){return MERGED[id].challenges[key].kind==='punctuation'?'':pbBasePreview(id,key)};
// Put the game first, while keeping the colon/explanation comparison available below it.
const pbBaseChange=pairChange;
pairChange=function(id){return id==='balance'?mcChallenge(id,'manipulate')+mcLab(id):pbBaseChange(id)};
const pbBaseCheck=mcCheck;
mcCheck=function(id,key){
 const g=MERGED[id].challenges[key];if(g.kind!=='punctuation')return pbBaseCheck(id,key);
 const r=mcState(id,key);
 if(!mcReady(g,r)){coachFeedback(false,'Choose a mark.','Tap a punctuation piece or drag it onto the beam.');return;}
 const ok=mcCorrect(g,r);
 if(ok)mcRecord(id).done[key]=true;
 const fresh=ok&&practiceAward('foundation-'+id,'merged:'+g.id,g.title,5);save();
 const done=document.querySelector('#mc-'+id+'-'+key+' .mc-done');if(done)done.textContent=mcRecord(id).done[key]?'✓ Practised':'';
 coachFeedback(ok,ok?'A steady connection.':r.choice===2?'A different effect.':'This comma needs help.',g.optionFeedback[r.choice],fresh?5:0);
};
function pbPick(root,n){
 const id=root.dataset.mcUnit,key=root.dataset.mcKey,g=MERGED[id].challenges[key];
 if(g.kind!=='punctuation'||!g.marks[n])return;
 const r=mcState(id,key);r.choice=n;save();
 root.querySelector('.pb-game').dataset.pbEffect=pbEffect(n);
 root.querySelector('.pb-joint').textContent=g.marks[n];
 root.querySelector('.pb-stage').setAttribute('aria-label',pbLabel(g,n));
 root.querySelector('.pb-note').textContent=pbNote(n);
 root.querySelectorAll('[data-pb-pick]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.pbPick===n)));
 root.querySelector('.vf-model-answer').hidden=true;
 const show=root.querySelector('[data-vf-show-model]');show.setAttribute('aria-expanded','false');show.textContent='Show Me';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button'),root=b?.closest('.mc-challenge');
 if(!root||MERGED[root.dataset.mcUnit]?.challenges[root.dataset.mcKey].kind!=='punctuation')return;
 if(b.hasAttribute('data-pb-pick'))pbPick(root,+b.dataset.pbPick);
});
let pbDragging=null;
document.addEventListener('dragstart',e=>{const b=e.target.closest('[data-pb-pick]');if(!b)return;pbDragging=+b.dataset.pbPick;e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/plain',String(pbDragging));});
document.addEventListener('dragover',e=>{const stage=e.target.closest('[data-pb-drop]');if(stage&&pbDragging!==null){e.preventDefault();e.dataTransfer.dropEffect='copy';stage.classList.add('pb-drop-ready');}});
document.addEventListener('dragleave',e=>{const stage=e.target.closest('[data-pb-drop]');if(stage&&!stage.contains(e.relatedTarget))stage.classList.remove('pb-drop-ready');});
document.addEventListener('drop',e=>{const stage=e.target.closest('[data-pb-drop]');if(!stage||pbDragging===null)return;e.preventDefault();const n=pbDragging;pbDragging=null;stage.classList.remove('pb-drop-ready');pbPick(stage.closest('.mc-challenge'),n);stage.closest('.mc-challenge').querySelector('[data-pb-pick="'+n+'"]').focus({preventScroll:true});});
document.addEventListener('dragend',()=>{pbDragging=null;document.querySelectorAll('.pb-drop-ready').forEach(e=>e.classList.remove('pb-drop-ready'));});
