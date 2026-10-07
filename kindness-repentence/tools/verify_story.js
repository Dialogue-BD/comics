const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const {KINDNESS_STORY:S}=require('../story.js');
const {KINDNESS_TIMINGS:T}=require('../story-timings.js');
const word=text=>text.match(/[A-Za-z’'-]+/g)||[];
const script=S.lines.map(l=>l.text).join('\n');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
assert.equal(script,T.script,'stale transcript');
assert.equal(hash(script),T.script_sha256,'stale script hash');
assert.equal(hash(fs.readFileSync(path.join(root,S.audio))),T.audio_sha256,'stale audio hash');
assert.equal(word(script).length,T.w.length,'word timing count');
let previous=0;
for(const [a,b] of T.w){assert(Number.isFinite(a)&&Number.isFinite(b)&&a>=previous-.001&&b>a&&b<=T.dur,`invalid word interval ${a},${b}`);previous=b;}
for(const page of S.frames)assert(fs.statSync(path.join(root,page.src)).size>10000,'missing art');
assert.equal(S.frames.length,8);
assert.equal(S.lines.length,S.camera.length);
let last=-1;
for(const cue of S.cameraBeats){
 assert(cue.word>=0&&cue.word<word(S.lines[cue.line].text).length,'camera word offset');
 const global=S.lines.slice(0,cue.line).reduce((a,l)=>a+word(l.text).length,0)+cue.word;
 assert(global>last,'camera order');last=global;
 assert(S.frames[cue.frame-1]&&S.portraitPages[cue.page-1],'camera image');
 for(const mode of ['portrait','landscape']){
  const [x,y,w,h]=cue[mode];assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=1&&y+h<=1,'camera exceeds page');
 }
}
for(let i=0;i<S.lines.length;i++)assert(S.cameraBeats.some(c=>c.line===i&&c.word===0),'missing line cue');
for(const gloss of S.glossary)assert(S.lines[gloss.line].text.toLowerCase().includes(gloss.phrase.toLowerCase()),'gloss span');
assert.equal(S.cast.N.accent,'neutral General American English');
assert.equal(S.level,'B2');
assert(!/\bmastan\b/i.test(script),'removed loanword remains');
assert(S.lines[1].text.includes('a local thug whose'),'English replacement missing');
assert(script.includes('four times what I took'),'fourfold restitution missing');
assert(script.includes("kindness he hadn't earned"),'unmerited favor missing');
assert(script.includes('risk his good name'),'costly compassion missing');
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',path.join(root,S.audio)],{encoding:'utf8'}));
assert(Math.abs(duration-T.dur)<.05,'duration mismatch');
const audit=JSON.parse(fs.readFileSync(path.join(root,'production/alignment-audit.json')));
assert(audit.exact_fraction>=.97,'recording/script match below threshold');
assert.equal(audit.audio_sha256,T.audio_sha256,'audit hash');
assert.equal(audit.script_sha256,T.script_sha256,'audit script hash');
assert(!/\bHindi\b/i.test(audit.heard),'unintended identity insertion');
const build=JSON.parse(fs.readFileSync(path.join(root,'production/audio-build.json')));
assert.equal(build.delivery_sha256,T.audio_sha256,'stale assembly build');
for(const source of build.sources)assert.equal(hash(fs.readFileSync(path.join(root,source.path))),source.sha256,'changed dry source');
console.log(`PASS: 8 original pages, ${S.lines.length} lines, ${S.cameraBeats.length} camera beats, ${S.glossary.length} English–Bangla notes, ${T.w.length} forced-aligned words, ${duration.toFixed(2)}s audio, ${(audit.exact_fraction*100).toFixed(2)}% ASR match.`);
