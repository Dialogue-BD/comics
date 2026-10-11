import {LEVELS,scoreRound,passAccuracy,adapt,nextRound,shuffle} from './game.mjs?v=2';

const $=id=>document.getElementById(id);
const STORAGE='dialogue-hard-questions-v1';
const empty=()=>({adaptive:{level:1,strong:0},support:'auto',voices:{}});
let saved=empty();
try{const v=JSON.parse(localStorage.getItem(STORAGE));if(v?.voices&&v?.adaptive&&[1,2,3].includes(v.adaptive.level))saved={...empty(),...v};}catch{}
let voices=[],voice,step=0,round=null,cursor=0,passScore={hits:0,total:0,falseAlarms:0},checked=false,selection=new Set(),heardClip=false,roundStarted=false,playback=null,raf=0;
const audio=$('audio');
const pool=['tomorrow','computer','money','school','doctor','hospital','family','children','teacher','writing','robot','traffic','weather','birthday','travel','dinner','salary','business','creative','patient','energy','friend','garden','music','job','human','environment','education','control','empathy','replace','trust','internet','healthy','future','quicker','illness','research','company','machine','building','decisions','safety','questions','happy','equal','lives','planet','ideas','parents','holidays','art','science','alone','expensive'];
function record(){return saved.voices[voice.id] ||= {gist:false,catchDone:false,done:false,reflection:'',score:null};}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{}}
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function updateJourney(){
  const done=voices.filter(v=>saved.voices[v.id]?.done).length;
  const scores=Object.values(saved.voices).map(v=>v.score).filter(Boolean);
  $('journey').textContent=`${done} of ${voices.length} voices explored`;
  $('journey-fill').style.width=`${done/voices.length*100}%`;
  const combined=scores.reduce((a,s)=>({hits:a.hits+s.hits,total:a.total+s.total,falseAlarms:a.falseAlarms+(s.falseAlarms||0)}),{hits:0,total:0,falseAlarms:0});
  $('journey-detail').textContent=scores.length?`${Math.round(passAccuracy(combined)*100)}% listening accuracy · best completed passes`:'Choose a voice to begin.';
  document.querySelectorAll('.voice').forEach(b=>b.classList.toggle('done',!!saved.voices[b.dataset.id]?.done));
}
function drawVoices(){
  $('voices').replaceChildren();
  voices.forEach(v=>{
    const b=node('button',undefined,'voice');b.dataset.id=v.id;b.setAttribute('aria-pressed',String(v.id===voice?.id));b.setAttribute('aria-label',`${v.name} · ${v.topic}`);
    const img=node('img');img.src=v.portrait;img.alt='';img.loading='lazy';
    const caption=node('span',v.name);caption.append(node('small',v.topic));b.append(img,caption);b.onclick=()=>choose(v);$('voices').append(b);
  });updateJourney();
}
function updatePlayLabel(){
  $('play').textContent=step===1&&checked?$('next-round').textContent:step===1&&heardClip?'Check my words':'▶ Listen';
}
function stop(){cancelAnimationFrame(raf);audio.pause();playback=null;updatePlayLabel();$('player-status').textContent='Original voice · natural speed';}
function choose(v){
  stop();voice=v;round=null;cursor=0;passScore={hits:0,total:0,falseAlarms:0};step=0;audio.src=v.audio;audio.load();
  $('portrait').src=v.portrait;$('portrait').alt=`Portrait of ${v.name}, from Anthropic’s Hard Questions`;
  $('speaker-title').textContent=v.name;$('speaker-role').textContent=v.role;$('speaker-topic').textContent=v.topic;$('duration').textContent=`${Math.round(v.duration)} seconds · original interview`;
  $('support').value=saved.support;$('audio-error').hidden=true;$('complete-feedback').textContent='';drawVoices();drawStep();
}
function focusTask(){ $('task-title').tabIndex=-1;$('task-title').focus({preventScroll:true}); }
function drawStep(){
  stop();$('audio-progress').value=0;
  document.querySelectorAll('[data-step]').forEach(b=>{const s=Number(b.dataset.step);b.disabled=s===1&&!record().gist||s===2&&!record().catchDone;if(s===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('hear-panel').hidden=step!==0;$('catch-panel').hidden=step!==1;$('talk-panel').hidden=step!==2;
  $('play').hidden=step===2;$('replay').hidden=step===2;$('audio-progress').hidden=step===2;$('player-status').hidden=step===2;$('support').disabled=step!==1;
  document.querySelector('.support-label').hidden=step!==1;document.querySelector('.player').hidden=step===2;
  if(step===0){
    $('step-label').textContent='Listen for the main idea';$('task-title').textContent='What matters to this person?';$('task-detail').textContent='Hear the whole recording first. Then choose the idea you heard.';
    $('gist-question').textContent=voice.gist.question;$('gist-options').replaceChildren();$('gist-feedback').textContent=record().gist?'Main idea found. Replay or move to the word challenge.':'The choices unlock after you listen.';
    const opts=shuffle(voice.gist.options.map((text,i)=>({text,correct:i===0})));
    $('warmup-words').replaceChildren(...[...new Map(voice.keywords.map(t=>[t.word,t])).values()].slice(0,3).map(t=>{const d=node('div',undefined,'definition');d.append(node('b',t.word),node('p',t.meaning));return d;}));
    opts.forEach(opt=>{
      const b=node('button',opt.text);b.disabled=!record().gist;
      b.onclick=()=>{
        if(opt.correct){b.classList.add('correct');record().gist=true;save();$('gist-feedback').textContent=voice.gist.feedback;$('to-catch').hidden=false;document.querySelector('[data-step="1"]').disabled=false;document.querySelectorAll('#gist-options button').forEach(x=>x.disabled=true);}
        else{b.classList.add('wrong');b.textContent=`${opt.text} · Try another idea`;$('gist-feedback').textContent='Listen again if you need to. What is their main concern?';b.disabled=true;}
      };$('gist-options').append(b);
    });$('to-catch').hidden=!record().gist;
  }else if(step===1){
    $('step-label').textContent='Listen for the language';$('task-title').textContent='Tap the words you hear.';$('task-detail').textContent='Listen and tap, check your words, then continue to the next section. Replay is there whenever you need it.';
    if(!round)prepareRound();
  }else{
    $('step-label').textContent='From listening to speaking';$('task-title').textContent='Their question. Your perspective.';$('task-detail').textContent='Take turns. Share an idea, give a reason, and ask a follow-up question.';
    $('talk-question').textContent=voice.discussion.question;$('talk-context').textContent=voice.discussion.context;
    $('talk-prompts').replaceChildren(...voice.discussion.prompts.map((t,i)=>node('p',`${i+1}. ${t}`)));
    $('sentence-frames').replaceChildren(...voice.discussion.frames.map(t=>node('p',t)));
    $('reflection').value=record().reflection;$('complete').textContent=record().done?'✓ Voice explored · choose another above':'We’ve shared our ideas ✓';
    $('complete-feedback').textContent=record().done?'Try another voice and compare their view.':'';
  }
}
function currentLevel(){return saved.support==='auto'?saved.adaptive.level:Number(saved.support);}
function prepareRound(){
  checked=false;heardClip=false;roundStarted=false;selection=new Set();
  round=nextRound(voice,cursor,currentLevel(),pool);
  // If there is only a breath after the final target, finish that silence
  // without presenting a wordless scored challenge.
  if(!round.targets.length){finishCatch();return;}
  $('round-label').textContent=`Clip ${Number(round.start.toFixed(1))}–${Number(round.end.toFixed(1))}s · find ${round.targets.length} word${round.targets.length===1?'':'s'}`;
  $('challenge-label').textContent=LEVELS[round.level].name+(saved.support==='auto'?' · adaptive':'');
  $('chips').replaceChildren();
  round.choices.forEach(word=>{
    const b=node('button',word,'chip');b.dataset.word=word;b.setAttribute('aria-pressed','false');b.disabled=true;
    b.onclick=()=>{if(checked)return;if(selection.has(word))selection.delete(word);else selection.add(word);b.setAttribute('aria-pressed',String(selection.has(word)));};$('chips').append(b);
  });
  $('check').disabled=true;$('check').hidden=false;$('next-round').hidden=true;$('round-help').hidden=true;$('catch-feedback').textContent='Press Listen to start this clip.';
  updatePlayLabel();
}
function tick(){
  if(!playback||audio.paused)return;
  $('audio-progress').value=Math.max(0,Math.min(1,(audio.currentTime-playback.start)/(playback.end-playback.start)));
  if(playback.mode==='help')document.querySelectorAll('.definition').forEach(b=>b.classList.toggle('active',audio.currentTime>=Number(b.dataset.start)&&audio.currentTime<=Number(b.dataset.end)+.25));
  if(audio.currentTime>=playback.end-.035){finishAudio();return;}
  raf=requestAnimationFrame(tick);
}
function finishAudio(){
  if(!playback)return;const mode=playback.mode;stop();$('audio-progress').value=1;$('player-status').textContent='Finished · replay any time';
  if(mode==='whole'){
    if(!record().gist){document.querySelectorAll('#gist-options button').forEach(b=>b.disabled=false);$('gist-feedback').textContent='What idea did you hear? Choose below.';}
  }else if(mode==='catch'){heardClip=true;$('check').disabled=false;$('catch-feedback').textContent='Choose only the words you heard, then check. You can replay first.';}
  updatePlayLabel();
  document.querySelectorAll('.definition.active').forEach(b=>b.classList.remove('active'));
}
async function play(mode){
  stop();$('audio-error').hidden=true;
  const span=mode==='whole'?{start:0,end:voice.duration}:round;
  if(!span)return;
  playback={start:span.start,end:span.end,mode};
  const token=playback;
  try{
    audio.currentTime=span.start;audio.playbackRate=1;await audio.play();if(playback!==token)return;
    $('play').textContent='Ⅱ Pause';$('player-status').textContent=mode==='whole'?'Listening · natural speed':'Listening to this clip · natural speed';
    if(mode==='catch'){roundStarted=true;document.querySelectorAll('.chip').forEach(b=>b.disabled=false);}
    tick();
  }catch{if(playback===token){stop();$('audio-error').hidden=false;}}
}
function finishCatch(){
  record().catchDone=true;
  if(passScore.total&&(!record().score||passAccuracy(passScore)>passAccuracy(record().score)))record().score={...passScore};
  save();updateJourney();step=2;drawStep();focusTask();
}
$('play').onclick=async()=>{
  if(playback&&!audio.paused){audio.pause();cancelAnimationFrame(raf);$('play').textContent='▶ Resume';$('player-status').textContent='Paused';}
  else if(playback){try{await audio.play();$('play').textContent='Ⅱ Pause';tick();}catch{stop();$('audio-error').hidden=false;}}
  else if(step===1&&checked)$('next-round').click();
  else if(step===1&&heardClip)$('check').click();
  else play(step===0?'whole':'catch');
};
$('replay').onclick=()=>play(step===0?'whole':checked?'help':'catch');
audio.onended=finishAudio;audio.onerror=()=>{stop();$('audio-error').hidden=false;};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playback&&!audio.paused){audio.pause();cancelAnimationFrame(raf);$('play').textContent='▶ Resume';$('player-status').textContent='Paused';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('guide-dialog').open)stop();});
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);drawStep();focusTask();});
$('to-catch').onclick=()=>{step=1;drawStep();focusTask();};
$('check').onclick=()=>{
  if(checked||!heardClip)return;stop();checked=true;
  const result=scoreRound(round.targets.map(t=>t.word),[...selection]);
  passScore.hits+=result.hits;passScore.total+=result.total;passScore.falseAlarms+=result.falseAlarms;
  const before=saved.adaptive.level;
  if(saved.support==='auto')saved.adaptive=adapt(saved.adaptive,result.accuracy);
  let feedback=`${result.hits} of ${result.total} caught. ${result.falseAlarms?`${result.falseAlarms} choice${result.falseAlarms===1?' wasn’t':'s weren’t'} heard.`:'No extra guesses.'}`;
  if(saved.support==='auto'&&before!==saved.adaptive.level)feedback+=saved.adaptive.level>before?' Ready for a little more challenge on the next clip.':'The next clip will give you more support.';
  else feedback+=' Continue to the next section, or replay if you want to review.';
  $('catch-feedback').textContent=feedback;
  const correct=new Set(round.targets.map(t=>t.word));
  document.querySelectorAll('.chip').forEach(b=>{b.disabled=true;const w=b.dataset.word;let label='';if(correct.has(w)){b.classList.add(selection.has(w)?'hit':'miss');label=selection.has(w)?'✓ Caught':'○ Listen for this';}else if(selection.has(w)){b.classList.add('false');label='× Not heard';}else label='Not heard';b.append(node('small',label));});
  $('definitions').replaceChildren(...round.targets.map(t=>{const d=node('div',undefined,'definition');d.dataset.start=t.start;d.dataset.end=t.end;d.append(node('b',t.word),node('p',t.meaning));return d;}));
  $('round-help').hidden=false;$('check').hidden=true;$('next-round').hidden=false;
  const more=voice.keywords.some(w=>w.start>=round.end-.04);
  $('next-round').textContent=more?'Next clip →':'Think together →';updatePlayLabel();save();
};
$('help-play').onclick=()=>play('help');
$('next-round').onclick=()=>{stop();cursor=round.end;if(!voice.keywords.some(w=>w.start>=cursor-.04)){finishCatch();return;}round=null;prepareRound();$('play').focus();};
$('support').onchange=()=>{
  saved.support=$('support').value;save();
  if(step===1&&!checked&&!roundStarted){stop();round=null;prepareRound();$('catch-feedback').textContent='Challenge changed. Press Listen to try this clip.';}
  else if(step===1&&round){$('challenge-label').textContent=LEVELS[round.level].name+' · next: '+LEVELS[currentLevel()].name;}
};
$('reflection').oninput=()=>{record().reflection=$('reflection').value;save();};
$('complete').onclick=()=>{record().done=true;save();updateJourney();$('complete-feedback').textContent=voices.every(v=>saved.voices[v.id]?.done)?'All nine voices explored. Which question will you keep talking about?':'Voice explored. Choose another person above and swap roles.';$('complete').textContent='✓ Voice explored · choose another above';};
$('projector').onclick=()=>{const enabled=document.body.classList.toggle('projector');$('projector').setAttribute('aria-pressed',String(enabled));};
$('guide').onclick=()=>{if(playback&&!audio.paused){audio.pause();cancelAnimationFrame(raf);$('play').textContent='▶ Resume';}$('guide-dialog').showModal();};
document.querySelectorAll('.close,.close-guide').forEach(b=>b.onclick=()=>$('guide-dialog').close());
$('reset').onclick=()=>{if(!confirm('Clear listening progress and notes on this device?'))return;stop();saved=empty();save();choose(voices[0]);};
try{
  const response=await fetch('voices.json');if(!response.ok)throw Error('voices');voices=await response.json();choose(voices[0]);
}catch{$('task-title').textContent='The activity couldn’t load.';$('task-detail').textContent='Open this page through the activity website or local preview server, then refresh.';$('play').disabled=true;$('replay').disabled=true;}
