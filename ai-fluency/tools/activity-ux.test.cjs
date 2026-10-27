const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
global.window=global;
global.document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};
for(const file of ['compass','engine','story-voice','cv-art','lesson-cv','lesson-agent','lesson-build','intro'])require('../'+file+'.js');
const L=AFL.LESSONS.cv,x={ch:{},files:AFL.FILES,get:(k,d)=>d};
const norm=t=>t.toLowerCase().replace(/[^\p{L}\p{N}.%\/]+/gu,'').replace(/\.$/,'');

test('the mission recap revisits Description in the requested route and gives every decision bilingual context',()=>{
 const route=L.beats.find(b=>b.card&&b.card.type==='result').card.workflow;
 assert.deepEqual(route.map(s=>s.d),['des','del','des','dis','des','dil']);
 assert.equal(new Set(route.filter(s=>s.d==='des').map(s=>s.en)).size,3);
 for(const step of route)for(const field of ['en','bn','detail','detailbn'])assert(step[field]);
 const labelled=D4.svg({on:'all',labels:true});
 for(const d of D4.ORDER)assert(labelled.includes('>'+D4.META[d].n+'</text>'));
 assert(!D4.svg().includes('gear-name'));
});

test('every requested CV keyword is present in the selectable claim',()=>{
 for(const b of L.beats.filter(b=>b.hunt))for(const l of b.hunt.lines){
  const tokens=l.text.split(/\s+/).map(norm);
  for(const word of l.kw||[])assert(tokens.includes(norm(word)),`${l.id}: missing ${word}`);
 }
});
test('the volunteer sentence accepts its correct tiles and typed punctuation variants, but rejects the reversed claim',()=>{
 const c=L.beats.find(b=>b.id==='fixes').scene(x).kb.chips.find(c=>c.id==='f1');
 const assembled=c.ok[0].o.map(i=>c.tiles[i]).join(' ');
 assert(AFL._t.pzDone(c,assembled));
 assert(AFL._t.pzDone(c,'I was a volunteer tutor, not the project leader.'));
 assert(!AFL._t.pzDone(c,'I was the project leader, not a volunteer tutor.'));
 assert(!AFL._t.pzDone(c,'I am a volunteer tutor, not the project leader.'));
});
test('a claim with two evidence files stays locked until both are opened, and another claim cannot reuse that record',()=>{
 const l={id:'sample',look:[{f:'cv'},{f:'rucei'}]};
 AFL._t.UI={hs:{id:'sample',pick:[],views:[]}};assert(!AFL._t.evidenceDone(l));
 AFL._t.UI.hs.views.push('cv');assert(!AFL._t.evidenceDone(l));
 AFL._t.UI.hs.views.push('rucei');assert(AFL._t.evidenceDone(l));
 assert(!AFL._t.evidenceDone({...l,id:'other'}));
});
test('missions 2 and 3 unlock only after mission 1 is finished',()=>{
 const old=AFL._t.S.ch;AFL._t.S.ch={};
 assert(!AFL._t.missionLocked('cv'));assert(AFL._t.missionLocked('agent'));assert(AFL._t.missionLocked('build'));
 AFL._t.S.ch.cv={_finished:true};assert(!AFL._t.missionLocked('agent'));assert(!AFL._t.missionLocked('build'));
 AFL._t.S.ch=old;
});
test('phone dates are formatted at access time and change across midnight',()=>{
 const before=AFL.dateLabel(false,new Date(2026,9,27,23,59));
 const after=AFL.dateLabel(false,new Date(2026,9,28,0,1));
 assert.match(before,/27 October/);assert.match(after,/28 October/);assert.notEqual(before,after);
});
test('part 2 speaks all four recorded gear names, followed by Delegation at the start of part 3',()=>{
 const names=['Delegation.','Description.','Discernment.','Diligence.'];
 assert.deepEqual(INTRO.SCENES[1].lines.slice(1).map(l=>l[0]),names);
 assert.equal(INTRO.SCENES[2].lines[0][0],'Delegation.');
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../audio/manifest.json')));
 for(const name of names){const k=AFL.audioKey(name);assert(manifest.keys.includes(k),name);assert(fs.existsSync(path.join(__dirname,'../audio',k+'.mp3')),name);}
});
