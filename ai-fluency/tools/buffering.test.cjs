const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

// Drive the real film transport with a controllable download and media clock.
function player({local=false,paused=false}={}){
  const animation=()=>({currentTime:0,pause(){},cancel(){}});
  const classes={add(){},remove(){},toggle(){}};
  const node=()=>({textContent:'',hidden:false,style:{},dataset:{},classList:classes,
    setAttribute(){},appendChild(){},animate:animation,querySelectorAll:()=>[]});
  const en=node(),bn=node(),status=node(),button=node(),generic=node(),end=node();
  en.parentElement=node();bn.parentElement=node();status.hidden=true;
  end.querySelector=()=>node();
  const dots={children:[0,1].map(()=>({querySelector:()=>node()}))};
  const stage=node();
  stage.querySelector=selector=>selector==='.i-cap .en'?en:selector==='.i-cap .bnc'?bn:selector==='.i-end'?null:generic;
  const root=node();root.querySelector=selector=>selector==='.i-load'?status:null;
  const audios=[],downloads=[];
  let release;
  class Audio{
    constructor(){this.currentTime=0;this.paused=true;this.playCalls=0;audios.push(this);}
    set src(value){this.url=value;queueMicrotask(()=>this.onloadedmetadata?.());}
    play(){this.playCalls++;this.paused=false;return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});}
    pause(){this.paused=true;}
  }
  const context={
    window:{AFL:{audioKey:t=>t},INTRO_AUDIO:{src:'audio/film.mp3?v=1',dur:{first:2,second:2}}},
    AFL:{audioKey:t=>t},Audio,performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},
    document:{addEventListener(){},createElement:()=>end,documentElement:{classList:classes}},
    setTimeout,clearTimeout,location:{protocol:local?'file:':'https:'},
    URL:{createObjectURL:body=>'blob:'+body,revokeObjectURL(){}},
    fetch:async src=>{downloads.push(src);return {ok:true,blob:()=>new Promise(resolve=>{release=resolve;})};}
  };
  const source=fs.readFileSync(path.join(__dirname,'../intro.js'),'utf8').replace('const total=()=>',`window.testPlayer={
    init(o){root=o.root;stage=o.stage;capEn=o.en;capBn=o.bn;dotsEl=o.dots;btnPlay=btnSnd=o.button;
      SCENES=[0,1].map((_,index)=>({lines:[['first',''],['second','']],_start:index*6.6,
        _t:[.8,3.4],_dur:6.6,_cam0:[960,470,1],html:()=>'',scr:()=>''}));
      cur=0;master=o.master;anims=[master];shouldAutoplay=!o.paused;btnPlay.disabled=true;},
    tick,togglePlay,toggleSound,jump,close,prepareFilmAudio,
    get state(){return {time:sceneTime(),cur,playing,ready:!btnPlay.disabled};}
  };const total=()=>`);
  vm.runInNewContext(source,context);
  const api=context.window.testPlayer;
  api.init({root,stage,en,bn,dots,button,paused,master:animation()});
  return {api,audios,status,context,root,downloads,release:()=>release('complete-track')};
}

const flush=()=>new Promise(setImmediate);

test('hosted playback waits for the last byte and keeps the same audio across scenes',async()=>{
  const {api,audios,downloads,release}=player();
  const loading=api.prepareFilmAudio(0);
  await flush();
  assert.deepEqual(downloads,['audio/film.mp3?v=1']);
  assert.equal(audios.length,0);
  api.togglePlay();api.tick();
  assert(!api.state.ready);assert(!api.state.playing);
  release();await loading;
  const track=audios[0];
  assert.equal(track.url,'blob:complete-track');
  assert.equal(track.playCalls,1);
  track.currentTime=4;api.tick();
  assert.equal(api.state.cur,0);assert.equal(api.state.time,4);
  track.currentTime=7.6;api.tick();
  assert.equal(api.state.cur,1);assert.equal(api.state.time,1);
  assert.equal(audios.length,1);assert.equal(track.playCalls,1);
  assert.equal(downloads.length,1);
  api.close();
});

test('the local preview plays the complete local track without fetch',async()=>{
  const {api,audios,downloads}=player({local:true,paused:true});
  await api.prepareFilmAudio(0);
  assert.equal(audios[0].url,'audio/film.mp3');
  assert.deepEqual(downloads,[]);
  assert(!api.state.playing);
  api.togglePlay();
  assert.equal(audios[0].playCalls,1);
  api.close();
});

test('pausing, muting and jumping keep the same player and reject stale play callbacks',async()=>{
  const {api,audios,status}=player({local:true});
  await api.prepareFilmAudio(0);
  const track=audios[0];
  track.currentTime=2;api.tick();
  api.togglePlay();
  track.reject(new Error('interrupted by pause'));await flush();
  assert(track.paused);assert(!api.state.playing);assert(status.hidden);
  api.toggleSound();assert(track.muted);
  api.jump(1);
  assert.equal(track.currentTime,6.6);
  assert.equal(api.state.cur,1);assert.equal(api.state.time,0);
  api.togglePlay();assert(!track.paused);
  assert.equal(audios.length,1);
  api.close();assert(track.paused);
});

test('short waits stay invisible and sustained waits hold the media-clock frame',async()=>{
  const {api,audios,status,context}=player({local:true});
  const pending=new Map();
  let clock=0,id=0;
  context.setTimeout=(fn,delay)=>{pending.set(++id,{fn,at:clock+delay});return id;};
  context.clearTimeout=key=>pending.delete(key);
  function advance(ms){
    clock+=ms;
    for(const [key,timer] of pending)if(timer.at<=clock){pending.delete(key);timer.fn();}
  }
  await api.prepareFilmAudio(0);
  const track=audios[0];
  track.onplaying();track.currentTime=3;api.tick();
  track.onwaiting();advance(100);track.onplaying();advance(1000);
  assert(status.hidden);
  track.onwaiting();advance(800);api.tick();
  assert.equal(status.textContent,'Buffering narration…');assert.equal(api.state.time,3);
  track.onplaying();assert(status.hidden);
  api.close();
});

test('closing while the download is pending prevents it from starting playback',async()=>{
  const {api,audios,release}=player();
  const loading=api.prepareFilmAudio(0);
  await flush();api.close();release();await loading;
  assert.equal(audios.length,0);assert(!api.state.playing);
});

test('a browser autoplay refusal leaves the loaded track ready for Play',async()=>{
  const {api,audios,status}=player({local:true});
  await api.prepareFilmAudio(0);
  const track=audios[0];
  track.reject({name:'NotAllowedError'});await flush();
  assert(api.state.ready);assert(!api.state.playing);
  assert.match(status.textContent,/Press Play/);
  api.togglePlay();track.resolve();await flush();
  assert(api.state.playing);assert(status.hidden);
  api.close();
});

function readingDemo(voiced=true){
  let clock=0,id=0;const pending=new Map(),done=[];
  const node=()=>({dataset:{},style:{},textContent:'',classList:{add(){},remove(){},toggle(){}},querySelectorAll:()=>[]});
  const el=node();el.isConnected=true;el.querySelector=()=>node();el.addEventListener=(event,fn)=>{el.click=fn;};
  const root={querySelector:()=>el};
  const card={steps:[{h:'First',en:'Read',ms:1000},{h:'Second',en:'Check',ms:1000}],map:[],claim:[],checks:[],found:{},zoom:{}};
  const context={window:{},setTimeout:(fn,ms)=>{pending.set(++id,{at:clock+ms,fn});return id;},clearTimeout:n=>pending.delete(n)};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../alt.js'),'utf8'),context);
  context.window.ALT.play(root,{card,voice:()=>voiced,speak:(text,end)=>done.push(end)});
  function advance(ms){const end=clock+ms;for(;;){const next=[...pending].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;pending.delete(next[0]);clock=next[1].at;next[1].fn();}clock=end;}
  return {el,done,advance};
}

test('reading demo waits for delayed narration even after its visual timer expires',()=>{
  const {el,done,advance}=readingDemo();advance(30000);assert.equal(el.dataset.step,0);
  done[0]();assert.equal(el.dataset.step,1);
});

test('reading demo waits for its visuals when audio completes quickly; silent mode still advances',()=>{
  const a=readingDemo();a.advance(250);a.done[0]();a.advance(500);assert.equal(a.el.dataset.step,0);
  a.advance(500);assert.equal(a.el.dataset.step,1);
  const b=readingDemo(false);b.advance(1250);assert.equal(b.el.dataset.step,1);
});

test('late narration cannot advance a reading demo after manual navigation or removal',()=>{
  const {el,done,advance}=readingDemo();advance(250);
  el.click({target:{closest:()=>({dataset:{alt:'next'}})}});advance(30000);done[0]();assert.equal(el.dataset.step,1);
  const b=readingDemo();b.advance(30000);b.el.isConnected=false;b.done[0]();assert.equal(b.el.dataset.step,0);
});
