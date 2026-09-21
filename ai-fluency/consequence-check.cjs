const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const data={window:{}};vm.runInNewContext(read('phone-journeys.js'),data);data.PHONE_JOURNEYS=data.window.PHONE_JOURNEYS;vm.runInNewContext(read('consequences.js'),data);
function mount(j,step,answers={},version=2){
 const nodes=new Map(),get=k=>{if(!nodes.has(k))nodes.set(k,{innerHTML:'',scrollTop:0});return nodes.get(k)};let saved,archives=0;
 const state={version,started:true,step,answers,receipts:[],visited:['Browser:'+step],played:{[step]:true}};
 const document={querySelector:get,getElementById:get,querySelectorAll(selector){const attr=selector.slice(1,-1),html=get('#app').innerHTML;return [...html.matchAll(new RegExp(attr+'="([^"]+)"','g'))].map(m=>{const node=get(attr+':'+m[1]);node.dataset={[attr.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:m[1]};return node})}};
 const ctx={window:{resolveConsequenceStep:data.window.resolveConsequenceStep},PHONE_JOURNEYS:data.PHONE_JOURNEYS,document,localStorage:{getItem:()=>JSON.stringify({[j.id]:state}),setItem(k,v){if(k.includes('archive'))archives++;else saved=JSON.parse(v)}},clearTimeout(){},setTimeout(){},matchMedia:()=>({matches:true})};vm.runInNewContext(read('android-lab.js'),ctx);ctx.window.PhoneLab.route(j.id);if(version===2)get('pl-resume').onclick();return {get,html:()=>get('#app').innerHTML,state:()=>saved[j.id],archives:()=>archives};
}
let tested=0;
for(const j of data.PHONE_JOURNEYS)for(let i=0;i<8;i++)for(let n=0;n<j.steps[i].options.length;n++){
 const s=j.steps[i],m=mount(j,i);if(s.previews){assert.ok(!m.html().includes('data-consequence'));m.get('data-preview:0').onclick();assert.ok(!m.html().includes('data-consequence'));m.get('data-preview:1').onclick()}
 m.get('data-consequence:'+n).onclick();assert.equal(m.state().answers[i].choice,n);assert.ok(m.state().answers[i].done);assert.ok(m.html().includes('pl-next'));
 if(s.kind==='trial'){m.get('data-consequence:'+s.answer).onclick();assert.equal(m.state().answers[i].first,n);assert.equal(m.state().answers[i].correct,true)}tested++;
}
const poster=data.PHONE_JOURNEYS.find(j=>j.id==='poster');
assert.ok(mount(poster,6,{0:{choice:0},4:{choice:0},5:{choice:0}}).html().includes('“When? Where?”'));
assert.ok(mount(poster,6,{0:{choice:1},4:{choice:0},5:{choice:0}}).html().includes('Goes to Room 204'));
assert.ok(mount(poster,6,{0:{choice:0},4:{choice:1},5:{choice:1}}).html().includes('Both routes carry the confirmed room'));
const migrated=mount(poster,6,{},1);assert.equal(migrated.archives(),1);assert.equal(migrated.state().version,2);assert.equal(migrated.state().step,0);
console.log(`PASS: ${tested} choice branches; privacy comparison gating; first attempts survive retries; poster missing/conflicting/repaired facts; old progress archived.`);
