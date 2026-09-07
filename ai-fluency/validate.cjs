/* Non-browser integration harness: executes the real event handlers and inspects
 * rendered HTML and saved state. It does not claim visual/browser QA. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('./core.js');
const base=__dirname,handlers={},nodes=new Map(),storage=new Map(),classes=new Set();
const node=(id='')=>{
 if(nodes.has(id))return nodes.get(id);
 const n={id,dataset:{},innerHTML:'',textContent:'',value:'',checked:false,disabled:false,open:false,
 setAttribute(k,v){this[k]=v;},focus(){},scrollIntoView(){},showModal(){this.open=true;},close(){this.open=false;},appendChild(){},remove(){},click(){},closest(){return this;}};
 nodes.set(id,n);return n;
};
const document={getElementById:node,querySelector:s=>node(`selector:${s}`),createElement:t=>node(`created:${t}`),
 body:{classList:{toggle(c,on){if(on)classes.add(c);else classes.delete(c);}},appendChild(){}},documentElement:{},
 addEventListener(t,fn){(handlers[t]??=[]).push(fn);}};
const location={hash:''};
const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const context={window:{addEventListener(){},print(){}},document,location,history:{replaceState(a,b,v){location.hash=v;}},sessionStorage,console,
 setInterval(){return 1;},clearInterval(){},setTimeout(){},Blob,URL:{createObjectURL(){return 'blob:mock';},revokeObjectURL(){}},Date};
vm.createContext(context);
for(const f of ['content.js','workflows.js','core.js','app.js'])vm.runInContext(fs.readFileSync(path.join(base,f),'utf8'),context,{filename:f});
const state=()=>JSON.parse(storage.get('dialogue-fluency-v1'));
const lesson=()=>state().lessons[state().workflow];
const fire=(type,target)=>{for(const fn of handlers[type]||[])fn({target,defaultPrevented:false});};
const click=dataset=>fire('click',{dataset,closest(){return this;}});
const input=(id,value)=>fire('input',{dataset:{text:id},value});
const choose=(group,i,value)=>fire('change',{dataset:{answer:`${group}-${i}`,group},value:String(value)});
const html=()=>node('stage').innerHTML;
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++;};
const workflows=context.window.WORKFLOWS;
ok(workflows.length===6,'six workflows');
ok(context.window.FLUENCY.stages.reduce((n,s)=>n+s.mins,0)===45,'45-minute timing');
const ids=new Set();
for(const w of workflows){
 ok(!ids.has(w.id),'unique workflow id');ids.add(w.id);
 for(const key of ['intro','roleA','roleB','goal','prompt','clarification','humanReply','draft','repair','improved','evidence','transfer','transferModel','disclosure'])ok(typeof w[key]==='string'&&w[key].length>20,`${w.id} ${key}`);
 ok(w.facts.length>=5&&w.words.length===4&&w.frames.length===3,'ESL source scaffolds');
 ok(w.delegation.length===3&&w.audits.length===3&&w.release.length===4,'complete D decision points');
 for(const q of [...w.delegation,...w.audits,w.exit])ok(q[1].length===3&&q[2]>=0&&q[2]<3&&q[3].length>30,'question and explanation');
 node('workflow').onchange({target:{value:w.id}});
 for(let i=0;i<8;i++){
  click({go:String(i)});
  ok(html().includes('stage-title')&&!html().includes('undefined'),'every stage renders concrete content');
  const found=[...html().matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  ok(new Set(found).size===found.length,`${w.id} station ${i+1}: unique element ids`);
 }
 click({go:'0'});click({reveal:'roleA'});click({reveal:'roleB'});
 ok(lesson().reveals.roleB&&!lesson().reveals.roleA,'one role card at a time');
 click({go:'1'});click({check:'delegate'});
 ok(!lesson().checked.delegate,'incomplete answers cannot score');
 w.delegation.forEach((q,i)=>choose('delegate',i,q[2]));click({check:'delegate'});
 ok(html().includes('3 / 3 supported decisions'),'correct decisions scored');
 choose('delegate',0,(w.delegation[0][2]+1)%3);
 ok(!lesson().checked.delegate,'changing an answer invalidates old feedback');
 choose('delegate',0,w.delegation[0][2]);click({check:'delegate'});
 click({go:'2'});input('prompt','Use only my facts. <script>alert(1)</script>');
 for(const provider of ['ChatGPT','Claude','Gemini'])click({provider});
 ok(Object.keys(lesson().seen).length===3,'all interfaces explored');
 ok(html().includes('&lt;script&gt;')&&!html().includes('<script>alert'),'learner text escaped');
 click({send:'prompt'});ok(lesson().checks['saved-prompt'],'practice draft saved');
 click({go:'3'});w.audits.forEach((q,i)=>choose('audit',i,q[2]));click({check:'audit'});
 ok(lesson().checked.audit,'audit graded');
 if(w.id==='code'){click({calculate:'flawed'});ok(node('calc-result').textContent.includes('680'),'flawed demo exposes intended bug');}
 if(w.id==='image')ok(html().includes('Guaranteed overseas jobs'),'image critique contains flawed claim');
 click({go:'4'});input('repair','Preserve meaning and fix the unsupported claim.');click({reveal:'improved'});
 if(w.id==='code'){click({calculate:'fixed'});ok(node('calc-result').textContent.includes('BDT 200 per attendee'),'repaired demo works');}
 click({go:'5'});
 ok(html().includes('data-release disabled'),'readiness requires discussion checks');
 w.release.forEach((_,i)=>fire('change',{dataset:{tick:`release-${i}`},checked:true}));click({release:''});
 ok(lesson().reveals.readiness,'readiness explanation');
 if(w.id==='document')ok(html().includes('Not ready to circulate'),'document preserves unresolved details');
 click({go:'6'});input('transfer-description','A new message for the changed audience.');
 click({go:'7'});choose('exit',0,w.exit[2]);click({check:'exit'});
 ok(html().includes('7 / 7'),'whole-workflow checked score');
 node('mode').onchange({target:{value:'class'}});ok(classes.has('classroom'),'classroom mode');
 node('bangla').onclick();ok(classes.has('bangla'),'Bangla support');node('bangla').onclick();
 ok(lesson().text.prompt.includes('<script>')&&lesson().text.repair&&lesson().text['transfer-description'],'writing survives station and mode changes');
 node('mode').onchange({target:{value:'pair'}});
}
for(const w of workflows)ok(state().lessons[w.id].text.repair,'all workflows retain separate work');
click({reset:''});click({confirmReset:''});ok(!lesson().text.prompt&&lesson().stage===0,'reset only selected workflow');
ok(state().lessons.cv.text.prompt,'reset preserves other workflow');
for(const [a,b,c,expected] of [['600','400','5',200],['600','400','3',334],['0','0','1',0],['0.1','0.2','1',1]]){assert.equal(C.calculate(a,b,c).each,expected);checks++;}
for(const args of [['600','400','0'],['','400','5'],['-1','0','1'],['0','0','2.5'],['x','2','2'],['Infinity','0','1'],['1e309','0','1']])ok(C.calculate(...args).error,'invalid input rejected');
assert.equal(C.calculate('600','400','3').surplus,2);checks++;
ok(C.escapeHTML('<img src=x onerror=alert(1)>').includes('&lt;img'),'HTML escaping');
const guide=fs.readFileSync(path.join(base,'teacher-guide.txt'),'utf8');
for(const w of workflows)ok(guide.includes(w.title.toUpperCase())&&guide.includes(w.repair)&&guide.includes(w.language.model),'guide contains complete worked case');
const index=fs.readFileSync(path.join(base,'index.html'),'utf8');
for(const m of index.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!m[1].includes('://')&&!m[1].startsWith('../'))ok(fs.existsSync(path.join(base,m[1])),'local asset exists');}
ok(fs.existsSync(path.join(base,'assets/workshop-illustration.png')),'project image exists');
console.log(`Passed ${checks} checks: all 48 stages, interaction/state transitions, escaped writing, decision scoring, guide coverage, and calculator edge cases. No browser visual QA performed.`);
