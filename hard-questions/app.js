import {LEVELS,scoreRound,passAccuracy,adapt,nextRound,shuffle} from './game.mjs?v=2';
import {sceneAt,cueAt,followerAt} from './timing.mjs?v=1';
import {createStage} from './motion/stage.js?v=1';

const $=id=>document.getElementById(id);
const STORAGE='dialogue-hard-questions-v1';
const empty=()=>({adaptive:{level:1,strong:0},support:'auto',voices:{}});
let saved=empty();
try{const v=JSON.parse(localStorage.getItem(STORAGE));if(v?.voices&&v?.adaptive&&[1,2,3].includes(v.adaptive.level))saved={...empty(),...v};}catch{}
let voices=[],voice,step=0,round=null,cursor=0,passScore={hits:0,total:0,falseAlarms:0},checked=false,selection=new Set(),heardClip=false,roundStarted=false,playback=null,raf=0;
const audio=$('audio');
let audioReady=Promise.resolve(false),audioUrl=null,audioLoadId=0;
let transcripts={},transcript=null,watchCue=-1,watchScene=-1;
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion=motionPreference.matches;
const motionHost=$('motion-stage'),stage=createStage(motionHost);stage.setReduced(reducedMotion);
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
  $('play').textContent=step===2?'▶ Watch & listen':step===1&&checked?$('next-round').textContent:step===1&&heardClip?'Check my words':'▶ Listen';
}
function stop(){cancelAnimationFrame(raf);audio.pause();playback=null;updatePlayLabel();$('player-status').textContent='Original voice · natural speed';}
function choose(v){
  stop();voice=v;transcript=transcripts[v.id];round=null;cursor=0;passScore={hits:0,total:0,falseAlarms:0};
  $('portrait').src=v.portrait;$('portrait').alt=`Portrait of ${v.name}, from Anthropic’s Hard Questions`;
  $('speaker-title').textContent=v.name;$('speaker-role').textContent=v.role;$('speaker-topic').textContent=v.topic;$('duration').textContent=`${Math.round(v.duration)} seconds · original interview`;
  stage.load(v,transcript).then(()=>{if(voice===v&&step===2)renderWatch(Number($('watch-seek').value));}).catch(()=>{});
  $('support').value=saved.support;$('audio-error').hidden=true;$('complete-feedback').textContent='';drawVoices();drawStep();
  const loadId=++audioLoadId;
  $('play').disabled=true;$('replay').disabled=true;$('player-status').textContent='Loading the original recording…';
  // Blob playback seeks reliably even on static hosts without byte-range support.
  audioReady=(async()=>{
    const response=await fetch(v.audio);if(!response.ok)throw Error('audio');
    const blob=await response.blob();if(loadId!==audioLoadId)return false;
    if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);
    await new Promise((resolve,reject)=>{
      const cleanup=()=>{audio.removeEventListener('loadedmetadata',loaded);audio.removeEventListener('error',failed);};
      const loaded=()=>{cleanup();resolve();},failed=()=>{cleanup();reject(Error('audio decode'));};
      audio.addEventListener('loadedmetadata',loaded);audio.addEventListener('error',failed);audio.src=audioUrl;audio.load();
    });
    if(loadId!==audioLoadId)return false;
    $('play').disabled=false;$('replay').disabled=false;$('player-status').textContent='Original voice · natural speed';return true;
  })().catch(()=>{if(loadId===audioLoadId){$('audio-error').hidden=false;$('player-status').textContent='Recording unavailable · refresh to retry';}return false;});
}
function focusTask(){ $('task-title').tabIndex=-1;$('task-title').focus({preventScroll:true}); }
function drawStep(){
  stop();$('audio-progress').value=0;
  document.querySelectorAll('[data-step]').forEach(b=>{const s=Number(b.dataset.step);b.disabled=false;if(s===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('hear-panel').hidden=step!==0;$('catch-panel').hidden=step!==1;$('watch-panel').hidden=step!==2;$('talk-panel').hidden=step!==3;
  $('activity').classList.toggle('watching',step===2);
  $('play').hidden=step===3;$('replay').hidden=step===3;$('audio-progress').hidden=step>=2;$('player-status').hidden=step===3;$('support').disabled=step!==1;
  document.querySelector('.support-label').hidden=step!==1;document.querySelector('.player').hidden=step===3;
  if(step===0){
    $('step-label').textContent='Listen for the main idea';$('task-title').textContent='What matters to this person?';$('task-detail').textContent='Listen and choose the main idea. You can visit any step whenever you like.';
    $('gist-question').textContent=voice.gist.question;$('gist-options').replaceChildren();$('gist-feedback').textContent=record().gist?'Main idea found. Replay or move to the word challenge.':'Choose the idea you hear. Replay whenever you like.';
    const opts=shuffle(voice.gist.options.map((text,i)=>({text,correct:i===0})));
    $('warmup-words').replaceChildren(...[...new Map(voice.keywords.map(t=>[t.word,t])).values()].slice(0,3).map(t=>{const d=node('div',undefined,'definition');d.append(node('b',t.word),node('p',t.meaning));return d;}));
    opts.forEach(opt=>{
      const b=node('button',opt.text);
      b.onclick=()=>{
        if(opt.correct){b.classList.add('correct');record().gist=true;save();$('gist-feedback').textContent=voice.gist.feedback;$('to-catch').hidden=false;}
        else{b.classList.add('wrong');b.textContent=`${opt.text} · Try another idea`;$('gist-feedback').textContent='Listen again if you need to. What is their main concern?';}
      };$('gist-options').append(b);
    });$('to-catch').hidden=false;
  }else if(step===1){
    $('step-label').textContent='Listen for the language';$('task-title').textContent='Tap the words you hear.';$('task-detail').textContent='Listen and tap, check your words, then continue to the next section. Replay is there whenever you need it.';
    if(!round)prepareRound();
  }else if(step===2){
    $('step-label').textContent='Connect sound, words and meaning';$('task-title').textContent='See the idea. Hear every word.';
    $('task-detail').textContent='Follow the highlighted words and animated ideas. Tap a word or phrase to hear it again.';
    prepareWatch();
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
    const b=node('button',word,'chip');b.dataset.word=word;b.setAttribute('aria-pressed','false');
    b.onclick=()=>{if(checked)return;if(selection.has(word))selection.delete(word);else selection.add(word);b.setAttribute('aria-pressed',String(selection.has(word)));};$('chips').append(b);
  });
  $('check').disabled=false;$('check').hidden=false;$('next-round').hidden=false;$('round-help').hidden=false;$('round-help').open=false;$('catch-feedback').textContent='Press Listen to start this clip.';
  $('next-round').textContent=voice.keywords.some(w=>w.start>=round.end-.04)?'Next clip →':'Watch the meaning →';
  drawRoundWords();updatePlayLabel();
}
function drawRoundWords(){
  $('definitions').replaceChildren(...round.targets.map(t=>{const d=node('div',undefined,'definition');d.dataset.start=t.start;d.dataset.end=t.end;d.append(node('b',t.word),node('p',t.meaning));return d;}));
}
function tick(){
  if(!playback||audio.paused)return;
  if(playback.mode==='watch')renderWatch(audio.currentTime);
  $('audio-progress').value=Math.max(0,Math.min(1,(audio.currentTime-playback.start)/(playback.end-playback.start)));
  if(playback.mode==='help')document.querySelectorAll('.definition').forEach(b=>b.classList.toggle('active',audio.currentTime>=Number(b.dataset.start)&&audio.currentTime<=Number(b.dataset.end)+.25));
  if(audio.currentTime>=playback.end-.035){finishAudio();return;}
  raf=requestAnimationFrame(tick);
}
function finishAudio(){
  if(!playback)return;const mode=playback.mode;stop();$('audio-progress').value=1;$('player-status').textContent='Finished · replay any time';
  if(mode==='watch')renderWatch(voice.duration);
  if(mode==='whole'){
    if(!record().gist){document.querySelectorAll('#gist-options button').forEach(b=>b.disabled=false);$('gist-feedback').textContent='What idea did you hear? Choose below.';}
  }else if(mode==='catch'){heardClip=true;$('check').disabled=false;$('catch-feedback').textContent='Choose only the words you heard, then check. You can replay first.';}
  updatePlayLabel();
  document.querySelectorAll('.definition.active').forEach(b=>b.classList.remove('active'));
}
async function play(mode,start=0){
  const chosen=voice;if(!await audioReady||chosen!==voice)return;
  stop();$('audio-error').hidden=true;
  const span=mode==='whole'?{start:0,end:voice.duration}:mode==='watch'?{start,end:voice.duration}:round;
  if(!span)return;
  playback={start:span.start,end:span.end,mode};
  const token=playback;
  try{
    audio.currentTime=span.start;audio.playbackRate=1;await audio.play();if(playback!==token)return;
    $('play').textContent='Ⅱ Pause';$('player-status').textContent=mode==='watch'?'Watching & listening · natural speed':mode==='whole'?'Listening · natural speed':'Listening to this clip · natural speed';
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
  else play(step===0?'whole':step===2?'watch':'catch');
};
$('replay').onclick=()=>play(step===0?'whole':step===2?'watch':checked?'help':'catch');
audio.addEventListener('play',()=>stage.setPlaying(step===2));audio.addEventListener('pause',()=>stage.setPlaying(false));
audio.onended=finishAudio;audio.onerror=()=>{stop();$('audio-error').hidden=false;};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playback&&!audio.paused){audio.pause();cancelAnimationFrame(raf);$('play').textContent='▶ Resume';$('player-status').textContent='Paused';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('guide-dialog').open)stop();});
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);drawStep();focusTask();});
$('to-catch').onclick=()=>{step=1;drawStep();focusTask();};
$('check').onclick=()=>{
  if(checked||!round||step!==1)return;stop();checked=true;
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
  drawRoundWords();$('round-help').open=true;
  $('round-help').hidden=false;$('check').hidden=true;$('next-round').hidden=false;
  const more=voice.keywords.some(w=>w.start>=round.end-.04);
  $('next-round').textContent=more?'Next clip →':'Watch the meaning →';updatePlayLabel();save();
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
function prepareWatch(){
  watchCue=-1;watchScene=-1;$('watch-seek').max=voice.duration;$('watch-seek').value=0;
  $('transcript-details').open=false;$('word-note').textContent='Tap a word for its meaning and hear it in context.';
  $('scene-chapters').replaceChildren(...transcript.scenes.map((scene,i)=>{
    const b=node('button',undefined,'scene-chapter');b.append(node('small',`0${i+1}`),node('span',scene.title));b.onclick=()=>play('watch',scene.start);return b;
  }));
  $('full-transcript').replaceChildren(...transcript.cues.map(c=>{
    const b=node('button',c.text);b.setAttribute('aria-label',`Listen from ${timeLabel(c.start)}: ${c.text}`);b.onclick=()=>play('watch',c.start);return b;
  }));
  $('watch-words').replaceChildren(...[...new Map(voice.keywords.map(t=>[t.word,t])).values()].map(t=>{
    const b=node('button',t.word);b.onclick=()=>{$('word-note').textContent=`${t.word}: ${t.meaning}`;const cue=transcript.cues.find(c=>t.start>=c.start&&t.start<=c.end)||transcript.cues.find(c=>c.start>=t.start);play('watch',cue?.start??t.start);};return b;
  }));
  $('download-srt').href=`subtitles/${voice.id}.srt`;
  $('motion-toggle').setAttribute('aria-pressed',String(reducedMotion));renderWatch(0);
}
function timeLabel(seconds){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function renderWatch(t){
  if(!transcript)return;
  if(stage.built===voice.id)stage.seek(t);
  const {cue,index}=cueAt(transcript,t),scene=sceneAt(transcript,t),si=transcript.scenes.indexOf(scene);
  if(index!==watchCue){
    watchCue=index;$('karaoke-words').replaceChildren();
    for(let i=cue.first;i<=cue.last;i++){
      const w=transcript.words[i],b=node('button',w.w);b.dataset.index=i;b.setAttribute('aria-label',`Hear “${w.w}” in this phrase`);b.onclick=()=>play('watch',Math.max(cue.start,w.s-.18));$('karaoke-words').append(b);
    }
    [...$('full-transcript').children].forEach((b,i)=>{b.classList.toggle('current',i===index);if(i===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  }
  const follower=followerAt(transcript,t);
  let activeWord;
  $('karaoke-line').querySelectorAll('button').forEach(b=>{
    const wi=Number(b.dataset.index),w=transcript.words[wi],active=follower.active&&wi===follower.index;
    b.classList.toggle('spoken',t>=w.s);b.classList.toggle('current',active);
    if(active)activeWord=b;
    if(active)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');
  });
  const glide=$('word-glide');
  if(activeWord){const a=activeWord.getBoundingClientRect(),b=$('karaoke-line').getBoundingClientRect();
    glide.style.width=`${a.width}px`;glide.style.height=`${a.height}px`;glide.style.transform=`translate3d(${a.left-b.left}px,${a.top-b.top}px,0)`;
  }
  glide.classList.toggle('on',!!activeWord);$('karaoke-line').classList.toggle('motion-reduced',reducedMotion);
  if(si!==watchScene){watchScene=si;$('scene-meaning').textContent=scene.meaning;motionHost.setAttribute('aria-label',`Animated picture: ${scene.meaning}`);
    [...$('scene-chapters').children].forEach((b,i)=>{b.classList.toggle('current',i===si);if(i===si)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  }
  $('watch-seek').value=t;$('watch-seek').setAttribute('aria-valuetext',`${timeLabel(t)} of ${timeLabel(voice.duration)}`);$('watch-time').textContent=`${timeLabel(t)} / ${timeLabel(voice.duration)}`;
}
$('watch-seek').oninput=()=>{if(playback){audio.pause();cancelAnimationFrame(raf);}renderWatch(Number($('watch-seek').value));};
$('watch-seek').onchange=()=>play('watch',Math.min(voice.duration-.05,Number($('watch-seek').value)));
$('motion-toggle').onclick=()=>{reducedMotion=!reducedMotion;stage.setReduced(reducedMotion);$('motion-toggle').setAttribute('aria-pressed',String(reducedMotion));renderWatch(Number($('watch-seek').value));};
motionPreference.addEventListener('change',e=>{reducedMotion=e.matches;stage.setReduced(reducedMotion);$('motion-toggle').setAttribute('aria-pressed',String(reducedMotion));if(step===2)renderWatch(Number($('watch-seek').value));});
new ResizeObserver(()=>{if(step===2)renderWatch(Number($('watch-seek').value));}).observe($('karaoke-line'));
$('to-talk').onclick=()=>{step=3;drawStep();focusTask();};
$('reset').onclick=()=>{if(!confirm('Clear listening progress and notes on this device?'))return;stop();saved=empty();save();choose(voices[0]);};
try{
  const [response,textResponse]=await Promise.all([fetch('voices.json'),fetch('transcripts.json')]);if(!response.ok||!textResponse.ok)throw Error('voices');
  voices=await response.json();transcripts=await textResponse.json();await document.fonts.ready;choose(voices[0]);
}catch{$('task-title').textContent='The activity couldn’t load.';$('task-detail').textContent='Open this page through the activity website or local preview server, then refresh.';$('play').disabled=true;$('replay').disabled=true;}
