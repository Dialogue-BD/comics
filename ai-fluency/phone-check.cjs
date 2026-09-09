const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const data={window:{}};vm.runInNewContext(source('phone-journeys.js'),data);
const journeys=data.window.PHONE_JOURNEYS;assert.equal(journeys.length,3);
let count=0;
for(const j of journeys){assert.equal(j.steps.length,8);assert.equal(j.steps.reduce((n,s)=>n+s.minutes,3),45);for(const d of ['Delegation','Description','Discernment','Diligence'])assert.ok(j.steps.some(s=>s.d===d));
for(let n=0;n<8;n++){
 const step=j.steps[n];if(step.answer!==undefined)assert.ok(step.options[step.answer]);for(const g of step.groups||[])assert.ok(g.options[g.answer]);if(step.source)assert.ok(j.sources[step.source]);
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',scrollTop:0});return nodes.get(id)};
 const state={started:true,step:n,answers:{},receipts:[],visited:['Browser:'+n,'Notes:'+n],played:{[n]:true}};
 const ctx={window:{},PHONE_JOURNEYS:journeys,localStorage:{getItem:()=>JSON.stringify({[j.id]:state}),setItem(){}},document:{querySelector:el,getElementById:el,querySelectorAll:()=>[]},clearTimeout(){},setTimeout(){},matchMedia:()=>({matches:true}),console};
 vm.runInNewContext(source('android-lab.js'),ctx);ctx.window.PhoneLab.route(j.id);el('pl-resume').onclick();const html=el('#app').innerHTML;assert.ok(html.includes(step.title),j.id+'/'+n);assert.ok(!html.includes('undefined'),j.id+'/'+n);count++;
}}
console.log('PASS: three 45-minute journeys; all four Ds in each; valid sources/answers; '+count+' phone decision screens.');
