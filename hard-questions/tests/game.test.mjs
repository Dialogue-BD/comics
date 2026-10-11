import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scoreRound,passAccuracy,adapt,nextRound,LEVELS} from '../game.mjs';
const voices=JSON.parse(readFileSync(new URL('../voices.json',import.meta.url)));
assert.equal(scoreRound(['health','hope'],['health','hope']).accuracy,1);
assert.equal(scoreRound(['health','hope'],[]).accuracy,0);
assert.equal(scoreRound(['health','hope'],['health','health']).hits,1);
assert.ok(scoreRound(['health','hope'],['health','hope','extra','another']).accuracy<.85,'Selecting every chip must prevent advancement');
assert.equal(passAccuracy({hits:4,total:4,falseAlarms:4}),2/3,'False guesses must lower the session score');
assert.equal(passAccuracy({hits:4,total:4,falseAlarms:0}),1);
assert.deepEqual(adapt({level:1,strong:0},1),{level:1,strong:1});
assert.deepEqual(adapt({level:1,strong:1},1),{level:2,strong:0});
assert.deepEqual(adapt({level:3,strong:1},.4),{level:2,strong:0});
assert.deepEqual(adapt({level:1,strong:0},0),{level:1,strong:0});
assert.deepEqual(adapt({level:3,strong:1},1),{level:3,strong:0});
assert.deepEqual([1,2,3].map(l=>LEVELS[l].seconds),[11,11,11],'Difficulty must not shorten the recording sections');
assert.deepEqual([1,2,3].map(l=>LEVELS[l].targets),[2,4,6],'Higher challenge must ask for more words');
for(const voice of voices){
  const initial=[1,2,3].map(level=>nextRound(voice,0,level,[]));
  assert.equal(initial[0].end,initial[1].end,'Balanced must keep the same audio section');
  assert.equal(initial[1].end,initial[2].end,'Stretch must keep the same audio section');
  assert.ok(initial[0].targets.length<initial[2].targets.length,`${voice.id}: Stretch must ask for more words`);
  for(const level of [1,2,3]){
    let start=0,rounds=0;
    while(start<voice.duration&&voice.keywords.some(k=>k.start>=start-.04)){
      const round=nextRound(voice,start,level,['holiday','sunshine','bicycle','pencil','pizza','garden','volcano','cooking','airport','swimming']);
      assert.ok(round.end>start,'Clip must advance');
      assert.ok(round.end<=voice.duration,'Clip must end within recording');
      assert.ok(round.targets.length>0,`${voice.id} level ${level}: avoid empty clips`);
      assert.equal(new Set(round.choices).size,round.choices.length,'No duplicate chips');
      assert.ok(round.targets.length<=LEVELS[level].targets);
      for(const target of round.targets){assert.ok(target.start>=start-.04);assert.ok(target.end<=round.end+.04);}
      for(const choice of round.choices.filter(c=>!round.targets.some(t=>t.word===c)))assert.ok(!voice.spokenVocabulary.includes(choice.toLowerCase()),'A spoken word cannot be a decoy');
      for(const keyword of voice.keywords)assert.ok(!(keyword.start<round.end&&keyword.end>round.end),'Do not split a target phrase');
      start=round.end;assert.ok(++rounds<20);
    }
  }
}
console.log('PASS: scoring, guess prevention, adaptive thresholds, all nine voices at all three challenges.');
