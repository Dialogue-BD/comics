/* Art geometry is shared by the scene, its navigation and the whole-story view.
   Each viewport shows one COMPLETE 3:2 panel from an intact illustration sheet. */
(function(){
const story=[
 {x:100,y:0,sx:1536/766*100,sy:1024/511*100,title:'A goal',alt:'Ayesha studies Economics in a university reading room in Rajshahi.'},
 {x:0,y:100,sx:1536/767*100,sy:1024/510*100,title:'A setback',alt:'At her desk, Ayesha looks disappointed as she reads an email on her phone.'},
 {x:100,y:100,sx:1536/766*100,sy:1024/510*100,title:'A new approach',alt:'Ayesha works with her own documents beside her laptop. The plain back of its lid faces us.'}
];
const tailor=[
 {x:0,y:0,w:624,h:406,alt:'Ayesha brings a yellow shari and a gaye holud invitation to the tailor.'},
 {x:100,y:0,w:625,h:406,alt:'Ayesha asks for a yellow blouse to match the shari she has brought.'},
 {x:0,y:409/855*100,w:624,h:399,alt:'The tailor measures a blouse pattern on yellow fabric, with the scissors resting aside.'},
 {x:100,y:409/855*100,w:625,h:399,alt:'The tailor points out a snag in the yellow blouse fabric before cutting.'},
 {x:0,y:100,w:624,h:443,alt:'Ayesha checks the finished yellow blouse against her yellow shari.'}
];
// Measured bounds exclude the 4px dividers; keep the source sheet intact.
const art=(p,sheet)=>`<span class="cv-art ${sheet}" role="img" aria-label="${p.alt}" style="--ax:${p.x}%;--ay:${p.y}%;--asize:${p.sx||1254/p.w*100}% ${p.sy||1254/p.h*100}%;"></span>`;
/* These are explanatory callouts OUTSIDE the illustrated devices. Device backs
   stay plain; no invented screen is painted onto a lid or a phone camera side. */
const screenNote=(i,isBn)=>i===0?'':`<span class="cv-screen-note ${i===1?'mail-note':'ai-note'}" aria-hidden="true">
 <span class="cv-note-icon">${i===1?'<svg viewBox="0 0 64 44" fill="none"><rect x="3" y="3" width="46" height="32" rx="4" stroke="currentColor" stroke-width="2"/><path d="m5 6 21 15L47 6" stroke="currentColor" stroke-width="2"/><circle cx="49" cy="33" r="10" fill="#B0563A"/><path d="m45 29 8 8m0-8-8 8" stroke="white" stroke-width="2"/></svg>':'<svg viewBox="0 0 64 44" fill="none"><path d="M20 3c0 12-5 17-17 17 12 0 17 5 17 17 0-12 5-17 17-17C25 20 20 15 20 3Z" fill="#65558F"/><rect x="42" y="9" width="18" height="29" rx="2" stroke="#65558F" stroke-width="2"/><path d="M46 17h10m-10 6h10m-10 6h7" stroke="#65558F" stroke-width="2"/></svg>'}</span>
 <span class="cv-note-name">${i===1?'Internship Desk':'Sathi AI'}</span><span class="cv-note-copy">${i===1?(isBn?'এবার শর্টলিস্টে আসেনি।':'Not shortlisted this time.'):(isBn?'আমার CV-তে সাহায্য করবে?':'Can you help with my CV?')}</span>
 </span>`;
window.CV_ART={
 language(root,isBn){
  const labels={play:'▶ '+(isBn?'শোনো':'Listen'),stop:'■ '+(isBn?'থামো':'Stop'),words:isBn?'শব্দগুলো দেখাও':'Show the words',overview:isBn?'পুরো গল্প':'Whole story'};
  root.querySelectorAll('[data-story]').forEach(b=>{b.textContent=labels[b.dataset.story]});
  const mail=root.querySelector('.mail-note .cv-note-copy'),ai=root.querySelector('.ai-note .cv-note-copy');
  if(mail) mail.textContent=isBn?'এবার শর্টলিস্টে আসেনি।':'Not shortlisted this time.';
  if(ai) ai.textContent=isBn?'আমার CV-তে সাহায্য করবে?':'Can you help with my CV?';
 },
 story(c,esc,BN,isBn){return `<div class="tale cv-story" id="story">
  <div class="cv-story-top"><span>Ayesha’s story</span><span class="cv-count" aria-live="polite">1 / 3</span></div>
  <div class="tpanels">${c.panels.map((p,i)=>`<figure class="tpanel${i===0?' lit':''}" data-pi="${i}" data-say="${esc(p.en)}">${art(story[i],'cv-story-art')}${screenNote(i,isBn)}<figcaption>${CV_STORY_VOICE.caption(p.en,esc)}${BN(p.bn)}</figcaption><span class="cv-karaoke-status" role="status"></span></figure>`).join('')}</div>
  <div class="cv-story-nav" aria-label="Story scenes">${story.map((p,i)=>`<button type="button" data-story-panel="${i}" aria-label="Replay scene ${i+1}: ${p.title}" aria-pressed="${i===0}">${art(p,'cv-story-art')}<span><i>0${i+1}</i>${p.title}</span></button>`).join('')}</div>
  <div class="row cv-story-controls"><button class="btn gold" data-story="play">▶ ${isBn?'শোনো':'Listen'}</button><button class="btn quiet" data-story="stop">■ ${isBn?'থামো':'Stop'}</button><button class="btn quiet" data-story="words" aria-pressed="false">${isBn?'শব্দগুলো দেখাও':'Show the words'}</button><button class="btn quiet" data-story="overview" aria-pressed="false">${isBn?'পুরো গল্প':'Whole story'}</button></div>
 </div>`;},
 tailor(){return `<span class="cv-tailor-stage">${tailor.map((p,i)=>`<span class="cv-tailor-frame f${i}">${art(p,'cv-tailor-art')}</span>`).join('')}<span class="cv-process" aria-hidden="true"><span>1 · Measure<span class="bn" lang="bn">মাপ নাও</span></span><b>→</b><span>2 · Ask<span class="bn" lang="bn">জিজ্ঞেস করো</span></span><b>→</b><span>3 · Cut<span class="bn" lang="bn">কাটো</span></span></span></span>`;}
};
})();
