/* Dependency-free content and renderer smoke checks. Run: node ai-fluency/check.cjs */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');const root=__dirname;
const data={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'cases.js'),'utf8'),data);
const sessions=data.window.LAB_SESSIONS;
assert.equal(sessions.length,3);
let checks=0;
for(const session of sessions){assert.equal(session.steps.length,8);assert.equal(session.steps.reduce((n,s)=>n+s.minutes,0),45);
for(const [index,step] of session.steps.entries()){
assert.ok(step.instruction&&step.bn&&step.frame&&step.teacher);
for(const item of [step,...(step.rounds||[]),...(step.groups||[]),...(step.recovery?[step.recovery]:[])])if(item.options)assert.ok(Number.isInteger(item.answer)&&item.options[item.answer]);
if(step.kind==='chain'){assert.ok(step.steps.some(s=>!s.stop));assert.ok(step.steps.at(-1).stop)}
for(const populated of [false,true]){
const elements=new Map();const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',classList:{toggle(){}},setAttribute(){}});return elements.get(id)};
let state={};if(populated){state={done:true,reveal:10,answer:step.answer,round:0,chain:step.steps?step.steps.length-1:0,stopped:true,chainFeedback:'Stopped',repair:step.recovery?.answer,sent:true,checked:true,test:'atomic',removed:(step.fields||[]).flatMap((f,i)=>f.remove?[i]:[]),picks:{}};(step.groups||[]).forEach((g,i)=>state.picks[i]=g.answer);(step.rounds||[]).forEach((r,i)=>state['round'+i]=r.answer);(step.items||[]).forEach((r,i)=>state['sort'+i]=r.answer)}
const context={LAB_SESSIONS:sessions,location:{hash:'#'+session.id+'/'+(index+1)},localStorage:{getItem:()=>JSON.stringify({[session.id+'/'+index]:state}),setItem(){}},document:{querySelector:element,getElementById:element,querySelectorAll:()=>[]},window:{addEventListener(){}},console};
vm.runInNewContext(fs.readFileSync(path.join(root,'booking-story.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(root,'codex-workflow.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(root,'lab.js'),'utf8'),context);
assert.ok((element('#screen').innerHTML+element('#app').innerHTML).length>100,session.id+'/'+index);
assert.ok(!element('#screen').innerHTML.includes('undefined'),session.id+'/'+index+' undefined');checks++;
}
}}
console.log(`PASS: 3 × 45 minutes, 24 stages, ${checks} initial/completed renderer states, answer keys, and stop/continue cases.`);
