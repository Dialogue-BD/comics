const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const V=require('../story-voice.js');
const timings=require('../audio/story-timings.js');

test('all three exact scripts have valid intervals for every word and match delivered audio',()=>{
  assert.equal(Object.keys(timings).length,3);
  for(const [key,t] of Object.entries(timings)){
    assert(V.validate(t,t.text,t.dur));
    const bytes=fs.readFileSync(path.join(__dirname,'../audio',key+'.mp3'));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),t.audio_sha256);
    t.w.forEach(([start,end],i)=>assert.deepEqual(V.wordState(t,(start+end)/2),{index:i,active:true}));
    assert.equal(V.wordState(t,t.dur+1).active,false);
  }
});

test('the caption preserves punctuation and gives the unspoken dash no word interval',()=>{
  const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  for(const t of Object.values(timings)){
    const html=V.caption(t.text,esc);
    assert.equal((html.match(/data-word=/g)||[]).length,t.words.length);
    assert.equal(html.replace(/<[^>]+>/g,''),t.text);
  }
  assert.deepEqual(V.words('CV — an honest one?'),['CV','an','honest','one']);
  assert.deepEqual(V.words('a master’s.'),['a','master’s']);
});

test('short pauses hold one follower; long pauses and leading silence rest',()=>{
  const t={w:[[.2,.4],[.7,1],[2,2.3]]};
  assert.deepEqual(V.wordState(t,.1),{index:-1,active:false});
  assert.deepEqual(V.wordState(t,.65),{index:0,active:true});
  assert.deepEqual(V.wordState(t,1.5),{index:1,active:false});
  assert.deepEqual(V.wordState(t,2.6),{index:2,active:false});
});

test('script edits, stale duration and invalid intervals cannot produce karaoke',()=>{
  const t=Object.values(timings)[0];
  assert.equal(V.validate(t,t.text+' changed',t.dur),false);
  assert.equal(V.validate(t,t.text,t.dur+1),false);
  assert.equal(V.validate({...t,w:t.w.slice(1)},t.text,t.dur),false);
  assert.equal(V.validate({...t,words:t.words.slice(1)},t.text,t.dur),false);
  assert.equal(V.validate({...t,w:[[.2,.1],...t.w.slice(1)]},t.text,t.dur),false);
});

test('a changed recording is rejected by content hash, even when its script is unchanged',async()=>{
  global.window={crypto:crypto.webcrypto};
  global.CV_STORY_TIMINGS=timings;
  const realFetch=global.fetch;
  const key=Object.keys(timings)[0], t=timings[key];
  const status={textContent:''},panel={dataset:{},querySelector:()=>status};
  const bytes=fs.readFileSync(path.join(__dirname,'../audio',key+'.mp3'));
  global.fetch=async src=>new Response(src==='valid'?bytes:Buffer.from('different audio'));
  try{
    assert.equal(await V.prepare(panel,key,t.text,'valid'),t);
    assert.equal(await V.prepare(panel,key,t.text,'changed'),null);
    assert.equal(panel.dataset.karaoke,'timing-unavailable');
    assert(status.textContent.includes('Reload'));
  }finally{global.fetch=realFetch;delete global.window;delete global.CV_STORY_TIMINGS;}
});
