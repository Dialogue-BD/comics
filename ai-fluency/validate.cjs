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
 body:{classList:{add(c){classes.add(c);},toggle(c,on){if(on)classes.add(c);else classes.delete(c);}},appendChild(){}},documentElement:{},
 addEventListener(t,fn){(handlers[t]??=[]).push(fn);}};
const location={hash:''};
const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const context={window:{addEventListener(){},print(){}},document,location,history:{replaceState(a,b,v){location.hash=v;}},sessionStorage,console,
 setInterval(){return 1;},clearInterval(){},setTimeout(){return 1;},clearTimeout(){},Blob,URL:{createObjectURL(){return 'blob:mock';},revokeObjectURL(){}},Date};
vm.createContext(context);
for(const f of ['content.js','workflows.js','core.js','visual-data.js','visual-lessons.js','app.js'])vm.runInContext(fs.readFileSync(path.join(base,f),'utf8'),context,{filename:f});
const state=()=>JSON.parse(storage.get('dialogue-fluency-v1'));
const lesson=()=>state().lessons[state().workflow];
const fire=(type,target)=>{for(const fn of handlers[type]||[])fn({target,defaultPrevented:false});};
const click=dataset=>fire('click',{dataset,closest(){return this;}});
const action=(v,more={})=>click({v,...more});
const html=()=>node('stage').innerHTML;
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++;};
const workflows=context.window.WORKFLOWS,cases=context.window.VISUAL_CASES;
ok(workflows.length===6,'six workflows');
ok(context.window.FLUENCY.stages.reduce((n,s)=>n+s.mins,0)+5===45,'5 + 40 minute lesson');
for(const w of workflows){
 const d=cases[w.id];ok(d&&d.compare.length===3,'visual case and evidence triplet');
 node('workflow').onchange({target:{value:w.id}});
 for(let j=0;j<6;j++){ok(html().includes('v-deck'),'onboarding renders');if(j<5)action('deck-next');}
 action('start');
 for(let i=0;i<8;i++){
  click({go:String(i)});
  ok(html().includes('v-studio')&&!html().includes('undefined'),'every activity renders');
  const found=[...html().matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  ok(new Set(found).size===found.length,`${w.id} station ${i+1}: unique ids`);
  if(i<6)ok(!html().includes('<textarea'),'early stages have no open-ended writing');
 }
 click({go:'0'});action('goal-pick',{choice:'0'});
 ok(!lesson().visual.stamps.goal,'wrong target cannot earn stamp');
 action('goal-pick',{choice:'1'});action('quality',{choice:'0'});
 ok(lesson().visual.quality===0,'wrong criterion requires retry');
 for(let j=0;j<3;j++)action('quality',{choice:'1'});
 ok(lesson().visual.stamps.goal,'target built');
 click({go:'1'});action('sort',{choice:'2'});ok(lesson().visual.sorted.length===0,'wrong job placement rejected');
 for(let j=0;j<3;j++)action('sort',{choice:String(j)});
 ok(lesson().visual.stamps.sort,'three jobs placed');
 click({go:'2'});for(const p of ['ChatGPT','Claude','Gemini'])click({provider:p});
 for(const c of ['1','0','1'])action('part',{choice:c});
 ok(lesson().visual.stamps.brief,'three-P message built');
 ok(html().includes('Product')&&html().includes('How to behave'),'Ps defined visibly');
 ok(Object.keys(lesson().seen).length===3,'three interfaces retained');
 click({go:'3'});
 for(let j=0;j<3;j++){
  action('audit-card',{choice:String(j)});action('phase',{choice:'2'});
  const c=d.compare[j],selected=j===1?2:c.target;
  action('word',{choice:String(selected)});action('verdict',{verdict:'invalid'});
  ok(!lesson().visual.audited[j],'incorrect verdict does not award');
  action('verdict',{verdict:c.verdict});
  ok(lesson().visual.audited[j],'correct comparison awarded');
  ok(html().includes('v-contrast-result'),'visual evidence feedback');
 }
 ok(lesson().visual.stamps.audit,'three evidence checks');
 // The same-meaning card accepts any matching chunk, not one arbitrary word.
 ok(lesson().visual.audited[1].word===2,'valid alternative anchor accepted');
 if(w.id==='code'){click({calculate:'flawed'});ok(node('calc-result').textContent.includes('680'),'intended flawed result');}
 click({go:'4'});action('repair-pick',{choice:'1'});
 action('tile',{choice:'2'});ok(!lesson().visual.tiles.length,'out-of-order chunk gets retry');
 for(let j=0;j<4;j++)action('tile',{choice:String(j)});
 ok(lesson().visual.stamps.repair,'repair and sentence built');
 if(w.id==='code'){click({calculate:'fixed'});ok(node('calc-result').textContent.includes('BDT 200'),'corrected calculator');}
 click({go:'5'});for(let j=0;j<3;j++)action('gate',{choice:'1'});
 ok(lesson().visual.stamps.release,'diligence decisions');
 if(w.id==='document')ok(html().includes('HOLD'),'unconfirmed document stays on hold');
 click({go:'6'});for(const c of ['1','0','1'])action('transfer',{choice:c});
 ok(lesson().visual.stamps.transfer,'guided transfer completed');
 fire('input',{dataset:{text:'extension'},value:'My version <script>alert(1)</script>'});
 click({go:'7'});click({go:'6'});
 ok(html().includes('&lt;script&gt;')&&!html().includes('<script>alert'),'optional writing escaped');
 click({go:'7'});action('said',{id:'exit'});ok(lesson().visual.said.exit,'speech explicitly self-recorded');
 ok(Object.keys(lesson().visual.stamps).length===7,'seven activity results');
 node('mode').onchange({target:{value:'class'}});ok(classes.has('classroom'),'projector mode');
 node('bangla').onclick();ok(classes.has('bangla'),'Bangla support');node('bangla').onclick();node('mode').onchange({target:{value:'pair'}});
 // Reopening teaching slides does not destroy completed tasks.
 action('intro');action('deck-next');ok(lesson().visual.stamps.audit,'progress survives onboarding revisit');
}
for(const w of workflows)ok(state().lessons[w.id].visual.stamps.transfer,'independent workflow progress');
click({reset:''});click({confirmReset:''});ok(!lesson().visual.stamps.goal,'restart resets selected workflow');
ok(state().lessons.cv.visual.stamps.goal,'restart preserves other workflow');
for(const [a,b,c,result] of [['600','400','5',200],['600','400','3',334],['0','0','1',0],['0.1','0.2','1',1]]){assert.equal(C.calculate(a,b,c).each,result);checks++;}
for(const args of [['600','400','0'],['','400','5'],['-1','0','1'],['0','0','2.5'],['x','2','2'],['Infinity','0','1']])ok(C.calculate(...args).error,'invalid inputs rejected');
ok(C.escapeHTML('<img src=x onerror=alert(1)>').includes('&lt;img'),'HTML escaping');
const index=fs.readFileSync(path.join(base,'index.html'),'utf8');
for(const m of index.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!m[1].includes('://')&&!m[1].startsWith('../'))ok(fs.existsSync(path.join(base,m[1])),'local asset exists');}
ok(fs.existsSync(path.join(base,'assets/workshop-illustration.png')),'project image exists');
console.log(`Passed ${checks} non-browser checks: 36 teaching slides, 48 activity views, guided decisions, evidence matches, sentence construction, progress isolation, and calculator cases.`);
