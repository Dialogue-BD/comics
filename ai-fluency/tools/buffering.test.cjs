const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

// Run the real player with a controllable media clock and requestAnimationFrame.
// A download can take arbitrarily long without advancing the media clock.
function player(){
  const animation=()=>({currentTime:0,pause(){},cancel(){}});
  const classes={add(){},remove(){},toggle(){}};
  const node=()=>({textContent:'',hidden:false,style:{},dataset:{},classList:classes,setAttribute(){},appendChild(){},animate:animation,querySelectorAll:()=>[]});
  const en=node(),bn=node(),status=node(),button=node(),generic=node();en.parentElement=node();bn.parentElement=node();
  const dots={children:[0,1].map(()=>({querySelector:()=>node()}))};
  const stage=node();stage.querySelector=selector=>selector==='.i-cap .en'?en:selector==='.i-cap .bnc'?bn:generic;
  const root=node();root.querySelector=selector=>selector==='.i-load'?status:null;
  const audios=[];
  class Audio{
    constructor(src){this.src=src;this.currentTime=0;this.paused=true;audios.push(this);}
    play(){this.paused=false;return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});}
    pause(){this.paused=true;}
  }
  const context={window:{AFL:{audioKey:t=>t}},AFL:{audioKey:t=>t},Audio,performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},
    speechSynthesis:{cancel(){},pause(){},resume(){},speak(u){context.utterance=u;}},SpeechSynthesisUtterance:function(text){this.text=text;},
    document:{addEventListener(){},createElement:node,documentElement:{classList:classes}},fetch:async()=>({ok:true,json:async()=>({dur:{first:2,second:2}})})};
  context.window.window=context.window;
  const source=fs.readFileSync(path.join(__dirname,'../intro.js'),'utf8').replace('const total=()=>',`window.testPlayer={
    init(o){root=o.root;stage=o.stage;capEn=o.en;capBn=o.bn;dotsEl=o.dots;btnPlay=btnSnd=o.button;
      SCENES=[0,1].map(i=>({lines:[['first',''],['second','']],_t:[.8,3.4],_d:[2,2],_dur:6.6,_cam0:[960,470,1],html:()=>'',scr:()=>''}));
      cur=0;DUR={first:2,second:2};played=[false,false];fired=[];master=o.master;anims=[master];},
    tick,togglePlay,retryNarration,toggleSound,show,close,open,
    get state(){return {time:sceneTime(),cur,playing,narration,played:[...played]};}
  };const total=()=>`);
  vm.runInNewContext(source,context);
  const api=context.window.testPlayer;api.init({root,stage,en,bn,dots,button,master:animation()});
  return {api,audios,status,context,root};
}

test('a 30-second download and mid-line buffering freeze every animation without skipping narration',()=>{
  const {api,audios}=player();api.tick(0);api.tick(1000);
  assert.equal(audios.length,1);assert.equal(api.state.time,.8);
  api.tick(31000);assert.equal(api.state.time,.8);assert.equal(api.state.cur,0);
  audios[0].currentTime=1;api.tick(32000);assert.equal(api.state.time,1.8);
  audios[0].onwaiting();api.tick(62000);assert.equal(api.state.time,1.8);
  assert.equal(audios.length,1);assert.deepEqual(Array.from(api.state.played),[true,false]);
  audios[0].onended();api.tick(63000);api.tick(64000);
  assert.equal(audios.length,2);assert.equal(api.state.time,3.4);
});

test('a very late animation frame still starts the next unheard line in order',()=>{
  const {api,audios}=player();api.tick(0);api.tick(60000);
  assert.equal(audios.length,1);assert.equal(audios[0].src,'audio/first.mp3');
  assert.equal(api.state.time,.8);assert.equal(api.state.cur,0);
});

test('the final line cannot advance the scene until its actual ended event',()=>{
  const {api,audios}=player();api.tick(0);api.tick(1000);audios[0].onended();api.tick(2000);api.tick(3000);
  audios[1].currentTime=10;api.tick(60000);assert.equal(api.state.cur,0);assert.equal(api.state.time,5.4);
  api.tick(120000);assert.equal(api.state.cur,0);
  audios[1].onended();api.tick(121000);api.tick(123000);assert.equal(api.state.cur,1);
});

test('pause while play is pending survives the eventual promise resolution',async()=>{
  const {api,audios}=player();api.tick(0);api.tick(1000);api.togglePlay();
  audios[0].resolve();await Promise.resolve();assert(audios[0].paused);assert(!api.state.playing);
  api.tick(60000);assert.equal(api.state.time,.8);
  api.togglePlay();audios[0].currentTime=.5;api.tick(61000);assert.equal(api.state.time,1.3);
});

test('audio failure holds the line for retry, and stale completion cannot move the retry',()=>{
  const {api,audios,status}=player();api.tick(0);api.tick(1000);const stale=audios[0].onended;
  audios[0].onerror();assert(!api.state.playing);assert.match(status.textContent,/Retry/);
  api.tick(60000);assert.equal(api.state.time,.8);api.retryNarration();assert.equal(audios.length,2);
  stale();assert(api.state.narration);audios[1].currentTime=1;api.tick(61000);assert.equal(api.state.time,1.8);
});

test('navigation and close invalidate late audio callbacks and pause abandoned downloads',async()=>{
  const {api,audios,root}=player();api.tick(0);api.tick(1000);const stale=audios[0].onended;
  api.show(1);stale();assert.equal(api.state.cur,1);assert.equal(api.state.time,0);
  audios[0].resolve();await Promise.resolve();assert(audios[0].paused);
  api.tick(2000);api.tick(3000);const current=audios[1],end=current.onended;
  api.close();end();assert(root.hidden);assert(current.paused);assert.equal(api.state.narration,null);
});

test('muting releases a buffering hold and silent playback continues',()=>{
  const {api,audios}=player();api.tick(0);api.tick(1000);api.toggleSound();
  assert.equal(api.state.narration,null);assert(audios[0].paused);
  api.tick(2000);api.tick(3000);assert.equal(api.state.time,1.8);
});

test('speech synthesis fallback also waits for completion before the next line',()=>{
  const {api,context}=player();context.AFL.audioKey=()=>null;
  api.tick(0);api.tick(1000);assert(context.utterance);api.tick(60000);assert.equal(api.state.time,.8);
  context.utterance.onstart();api.tick(61000);api.tick(120000);assert.equal(api.state.time,2.8);
  assert.equal(api.state.narration.index,0);context.utterance.onend();api.tick(121000);api.tick(122000);
  assert.equal(api.state.narration.index,1);
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

test('closing while the narration manifest loads prevents a late open from rebuilding the film',async()=>{
  const {api,root}=player();api.open();api.close();await new Promise(setImmediate);
  assert(root.hidden);assert.equal(api.state.time,0);assert.equal(api.state.narration,null);
});

test('a rejected resume after the user pauses again does not turn pause into an audio error',async()=>{
  const {api,audios,status}=player();api.tick(0);api.tick(1000);api.togglePlay();api.togglePlay();api.togglePlay();
  audios[0].reject(new Error('interrupted by pause'));await Promise.resolve();
  assert(!api.state.playing);assert(!api.state.narration.failed);assert(!status.textContent.includes('Retry'));
});
