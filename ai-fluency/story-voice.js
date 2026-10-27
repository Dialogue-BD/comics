/* Read-along for Ayesha's existing recordings. The audio clock, exact script,
   file hash and forced word intervals form one contract; never estimate pace. */
(function(){
const pattern=()=>/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g;
const words=text=>[...text.matchAll(pattern())].map(m=>m[0]);
const cache=new Map();
let current=null;

function validate(entry,text,duration){
  if(!entry||entry.text!==text) return false;
  const tokens=words(text);
  if(!Array.isArray(entry.w)||!Array.isArray(entry.words)||entry.w.length!==tokens.length||entry.words.length!==tokens.length||entry.words.some((w,i)=>w!==tokens[i])) return false;
  if(!Number.isFinite(entry.dur)||entry.dur<=0||!entry.audio_sha256) return false;
  if(Number.isFinite(duration)&&Math.abs(duration-entry.dur)>.12) return false;
  let end=0;
  return entry.w.every(pair=>{
    if(!Array.isArray(pair)||pair.length!==2) return false;
    const [a,b]=pair, ok=Number.isFinite(a)&&Number.isFinite(b)&&a>=end&&b>a&&b<=entry.dur+.025;
    end=b; return ok;
  });
}

function wordState(entry,t){
  let i=-1;
  for(let n=0;n<entry.w.length&&entry.w[n][0]<=t;n++) i=n;
  if(i<0) return {index:-1,active:false};
  const end=entry.w[i][1], next=entry.w[i+1]?.[0]??Infinity;
  // As in Culture Circles: hold the follower through ordinary word gaps.
  return {index:i,active:t<=end+.22||(next-end<=.72&&t<next)};
}

function caption(text,esc){
  let html='',at=0,i=0;
  for(const m of text.matchAll(pattern())){
    html+=esc(text.slice(at,m.index))+`<span class="cv-word" data-word="${i++}">${esc(m[0])}</span>`;
    at=m.index+m[0].length;
  }
  return `<span class="cv-karaoke">${html+esc(text.slice(at))}<span class="cv-word-glide" aria-hidden="true"></span></span>`;
}

function unavailable(panel,kind='timing-unavailable'){
  panel.dataset.karaoke=kind;
  const status=panel.querySelector('.cv-karaoke-status');
  if(status) status.textContent=kind==='audio-error'?'Recording could not play. Tap this scene to retry.':'Word highlighting is unavailable. Reload to try again.';
}

async function prepare(panel,key,text,src){
  const entry=typeof CV_STORY_TIMINGS!=='undefined'?CV_STORY_TIMINGS[key]:null;
  panel.dataset.karaoke='loading';
  if(!validate(entry,text)||!window.crypto?.subtle){ unavailable(panel); return null; }
  const id=entry.audio_sha256+':'+src;
  if(!cache.has(id)) cache.set(id,(async()=>{
    const response=await fetch(src); if(!response.ok) throw new Error('Missing recording');
    const digest=await crypto.subtle.digest('SHA-256',await response.arrayBuffer());
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')===entry.audio_sha256;
  })().catch(()=>false));
  if(!await cache.get(id)){ unavailable(panel); return null; }
  return entry;
}

function clearFollower(panel){
  panel.querySelectorAll('.cv-word.is-now').forEach(w=>w.classList.remove('is-now'));
  panel.querySelector('.cv-word-glide')?.classList.remove('on');
}

function stop(){
  if(!current) return;
  const c=current; current=null;
  cancelAnimationFrame(c.raf);
  c.listeners.forEach(([name,fn])=>c.player.removeEventListener(name,fn));
  clearFollower(c.panel);
  c.panel.removeAttribute('data-word-index');
}

function paint(c){
  if(current!==c) return;
  if(!c.panel.isConnected){stop();return;}
  const t=c.player.currentTime;
  c.panel.dataset.audioTime=t.toFixed(3);
  if(!validate(c.entry,c.text,c.player.duration)){
    unavailable(c.panel); clearFollower(c.panel); return;
  }
  c.panel.dataset.karaoke='aligned';
  const state=wordState(c.entry,t), i=state.index;
  c.panel.dataset.wordIndex=state.active?String(i):'';
  c.words.forEach((w,n)=>{
    w.classList.toggle('is-said',n<i||(n===i&&!state.active));
    w.classList.toggle('is-now',state.active&&n===i);
  });
  const glide=c.box.querySelector('.cv-word-glide'), now=c.words[i];
  if(!state.active||!now){glide.classList.remove('on');return;}
  const b=now.getBoundingClientRect(), parent=c.box.getBoundingClientRect();
  if(!b.width||!parent.width){glide.classList.remove('on');return;}
  glide.style.width=b.width+'px'; glide.style.height=b.height+'px';
  glide.style.transform=`translate3d(${b.left-parent.left}px,${b.top-parent.top}px,0)`;
  glide.classList.add('on');
}

function attach(player,panel,text,entry){
  stop();
  if(!entry) return; // Keep the exact transcript, with a visible timing notice.
  const box=panel.querySelector('.cv-karaoke'); if(!box) return;
  const c={player,panel,text,entry,box,words:[...box.querySelectorAll('.cv-word')],raf:0,listeners:[]};
  current=c;
  const tick=()=>{paint(c);if(current===c&&!player.paused&&!player.ended)c.raf=requestAnimationFrame(tick);};
  const run=()=>{cancelAnimationFrame(c.raf);tick();};
  const pause=()=>{cancelAnimationFrame(c.raf);paint(c);};
  const end=()=>{paint(c); c.words.forEach(w=>w.classList.add('is-said')); stop();};
  [['playing',run],['pause',pause],['timeupdate',()=>paint(c)],['seeked',()=>paint(c)],
   ['loadedmetadata',()=>paint(c)],['ratechange',()=>paint(c)],['ended',end]].forEach(([name,fn])=>{
    player.addEventListener(name,fn);c.listeners.push([name,fn]);
  });
  paint(c);
}

const api={words,validate,wordState,caption,prepare,attach,stop,unavailable,refresh:()=>current&&paint(current)};
if(typeof window!=='undefined'){
  window.CV_STORY_VOICE=api;
  window.addEventListener?.('resize',api.refresh);
}
if(typeof module!=='undefined') module.exports=api;
})();
