import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sceneAt,cueAt,wordAt,followerAt} from '../motion.mjs';
const data=JSON.parse(await readFile(new URL('../transcripts.json',import.meta.url)));
assert.equal(Object.keys(data).length,9);
for(const [id,d] of Object.entries(data)){
 assert.equal(d.scenes.length,3,id);
 assert.equal(d.scenes[0].start,0,id);
 assert.equal(d.scenes.at(-1).end,d.duration,id);
 let cursor=0,lastEnd=0;
 for(const cue of d.cues){
  assert.equal(cue.first,cursor,id+' missing transcript words');cursor=cue.last+1;
  assert.ok(cue.end>cue.start,id+' zero length cue');
  assert.ok(cue.start>=lastEnd,id+' overlapping cues');lastEnd=cue.end;
  assert.equal(cue.text,d.words.slice(cue.first,cue.last+1).map(w=>w.w).join(' '));
 }
 assert.equal(cursor,d.words.length);
 for(let i=0;i<d.words.length;i++){
  const w=d.words[i];assert.ok(w.e>w.s,id+' invisible word '+w.w);
  assert.ok(w.s>=0&&w.e<=d.duration);
  assert.equal(wordAt(d,(w.s+w.e)/2),i,id+' wrong active word');
  assert.equal(followerAt(d,(w.s+w.e)/2).index,i);
  assert.ok(followerAt(d,(w.s+w.e)/2).active);
  const next=d.words[i+1];
  if(next&&next.s>w.e&&next.s-w.e<.72){
   const gapTime=(w.e+next.s)/2;
   assert.equal(followerAt(d,gapTime).index,i,id+' follower moved too early');
   assert.ok(followerAt(d,gapTime).active,id+' follower blinked in ordinary gap');
  }
 }
 for(let i=0;i<3;i++){
  const s=d.scenes[i];assert.ok(s.end>s.start);
  assert.equal(sceneAt(d,(s.start+s.end)/2),s);
  if(i)assert.equal(d.scenes[i-1].end,s.start);
 }
 assert.equal(sceneAt(d,d.duration),d.scenes[2]);
 assert.equal(cueAt(d,d.duration).cue,d.cues.at(-1));
 for(let i=0;i<d.cues.length-1;i++){
  const c=d.cues[i],n=d.cues[i+1];
  if(n.start>c.end)assert.equal(cueAt(d,(c.end+n.start)/2).index,i,id+' phrase changed during silence');
 }
 const srt=await readFile(new URL(`../subtitles/${id}.srt`,import.meta.url),'utf8');
 assert.equal(srt.split('-->').length-1,d.cues.length);
}
console.log('PASS: all nine complete transcripts, 588 audible word spans, 27 scene boundaries, phrase cues and subtitle files.');
