const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const {FISHERMAN_STORY:S}=require('../story.js');
const {FISHERMAN_TIMINGS:T}=require('../story-timings.js');
const words=t=>t.match(/[A-Za-zÀ-ÖØ-öø-ÿ’'-]+/g)||[];
const script=S.lines.map(l=>l.text).join('\n');
const hash=d=>crypto.createHash('sha256').update(d).digest('hex');
assert.equal(script,T.script,'stale transcript');
assert.equal(hash(script),T.script_sha256,'stale script hash');
assert.equal(hash(fs.readFileSync(path.join(root,S.audio))),T.audio_sha256,'stale audio hash');
assert.equal(words(script).length,T.w.length,'word timing count');
let previous=0;
for(const [a,b] of T.w){assert(Number.isFinite(a)&&Number.isFinite(b)&&a>=previous-.001&&b>a&&b<=T.dur,`invalid word interval ${a},${b}`);previous=b;}
for(const page of S.frames)assert(fs.statSync(path.join(root,page.src)).size>10000,'missing art');
assert.equal(S.frames.length,8);assert.equal(S.frames.length,S.portraitPages.length);
assert.equal(S.lines.length,S.camera.length);
let last=-1;
for(const cue of S.cameraBeats){
 assert(cue.word>=0&&cue.word<words(S.lines[cue.line].text).length,'camera word offset');
 const global=S.lines.slice(0,cue.line).reduce((a,l)=>a+words(l.text).length,0)+cue.word;
 assert(global>last,'camera order');last=global;
 assert(S.frames[cue.frame-1]&&S.portraitPages[cue.page-1],'camera image');
 for(const mode of ['portrait','landscape']){
  const [x,y,w,h]=cue[mode];assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=1&&y+h<=1,'camera exceeds page');
 }
}
for(let i=0;i<S.lines.length;i++){
 assert(S.cast[S.lines[i].speaker],'unknown speaker');
 assert(S.panels.some(p=>p.id===S.lines[i].panel),'unknown panel');
 assert(S.cameraBeats.some(c=>c.line===i&&c.word===0),'missing line cue');
}
const ids=new Set();
for(const gloss of S.glossary){assert.equal(S.lines[gloss.line].text.slice(gloss.start,gloss.end),gloss.phrase,'gloss span');assert(!ids.has(gloss.id));ids.add(gloss.id);assert(gloss.meaning&&gloss.bn);}
for(const asset of Object.values(S.assets))assert(fs.existsSync(path.join(root,asset)),'missing preserved source');
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',path.join(root,S.audio)],{encoding:'utf8'}));
assert(Math.abs(duration-T.dur)<.05,'duration mismatch');
const audit=JSON.parse(fs.readFileSync(path.join(root,'production/alignment-audit.json')));
assert(audit.exact_fraction>=.97,'recording/script match below threshold');
assert.equal(audit.audio_sha256,T.audio_sha256,'audit hash');assert.equal(audit.script_sha256,T.script_sha256,'audit script hash');
const build=JSON.parse(fs.readFileSync(path.join(root,'production/audio-build.json')));
assert.equal(build.delivery_sha256,T.audio_sha256);assert.equal(hash(fs.readFileSync(path.join(root,build.source))),build.source_sha256);
assert.equal(build.source_sha256,hash(fs.readFileSync(path.join(root,'american_fisherman.mp3'))),'original recording changed');
const footer=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(footer.includes('New Headway Elementary')&&footer.includes('T6.11')&&footer.includes('2011')&&footer.includes('Visuals created independently with AI.'),'missing source credit');
assert.equal(S.attribution.edition,4);assert.equal(S.attribution.track,'T6.11');
console.log(`PASS: 8 pages, ${S.lines.length} lines, ${S.cameraBeats.length} camera cues, ${S.glossary.length} English–Bangla notes, ${T.w.length} aligned words, ${duration.toFixed(2)}s audio, ${((audit.match_fraction_including_insertions??audit.exact_fraction)*100).toFixed(2)}% ASR match including recognizer insertions.`);
