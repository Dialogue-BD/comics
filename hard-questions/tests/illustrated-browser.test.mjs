import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,'../generated-artifacts/illustrated-qa');await mkdir(out,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'transcripts.json'))),base=process.env.BASE_URL||'http://127.0.0.1:8765';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push(`${r.status()} ${r.url()}`)});
const report=[];
const {PNG}=require(process.env.PNG_MODULE||'pngjs');
const pixels=bytes=>PNG.sync.read(bytes).data;
function same(a,b,label){const x=pixels(a),y=pixels(b);let delta=0,count=0;for(let i=0;i<x.length;i++){const d=Math.abs(x[i]-y[i]);delta=Math.max(delta,d);if(d>2)count++}assert.ok(count===0,`${label}: ${count} channels differ; max ${delta}`)}
try{
 for(const id of Object.keys(data)){
  await page.goto(`${base}/hard-questions/tools/illustrated-studio.html?voice=${id}`);await page.waitForFunction(()=>window.ready);
  assert.ok(await page.evaluate(()=>[...document.images].every(im=>im.complete&&im.naturalWidth)),`${id} assets`);
  const scenes=await page.evaluate(()=>studio.scenes);
  for(let i=0;i<scenes.length;i++){
   const t=Math.min(scenes[i].end-.2,scenes[i].start+1);
   await page.evaluate(t=>renderAt(t),t);const first=await page.locator('#stage').screenshot();
   await page.evaluate(t=>renderAt(t),data[id].duration-.1);await page.evaluate(t=>renderAt(t),0);await page.evaluate(t=>renderAt(t),t);
   same(await page.locator('#stage').screenshot(),first,`${id} scene ${i+1} deterministic backward seek`);
   await page.evaluate(t=>{studio.setReduced(true);renderAt(t)},t);const still=await page.locator('#stage').screenshot();
   await page.evaluate(t=>renderAt(t),scenes[i].end-.3);same(await page.locator('#stage').screenshot(),still,`${id} reduced scene ${i+1}`);
   await page.evaluate(()=>studio.setReduced(false));
  }
  report.push({id,scenes:scenes.length,assets:true,deterministicSeek:true,reducedMotion:true});console.log(`PASS ${id}: ${scenes.length} scenes, assets, seeking, reduced motion`);
 }
 await page.goto(`${base}/hard-questions/`);await page.waitForFunction(()=>!document.getElementById('play').disabled);
 for(const id of Object.keys(data)){
  await page.locator(`.voice[data-id="${id}"]`).click();await page.waitForFunction(()=>!document.getElementById('play').disabled);
  await page.locator('[data-step="2"]').click();await page.waitForFunction(()=>document.querySelector('#motion-stage[data-renderer="illustrated"] img')?.naturalWidth>0);
  await page.waitForFunction(id=>document.querySelector('#motion-stage .speaker-chip')?.textContent.toLowerCase().startsWith(id),id);
  assert.ok(await page.locator('#scene-chapters button').count()>=3);
  await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('#audio').currentTime>.3&&!document.querySelector('#audio').paused);
  assert.equal(await page.locator('#audio').evaluate(a=>a.playbackRate),1);await page.locator('#play').click();
  await page.locator('#scene-chapters button').last().click();await page.waitForFunction(()=>document.querySelector('#audio').currentTime>10);await page.locator('#play').click();
  await page.locator('[data-step="1"]').click();assert.ok(await page.locator('#chips button').count());await page.locator('[data-step="3"]').click();
 }
 for(const viewport of [{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(viewport);await page.locator('[data-step="2"]').click();await page.locator('#motion-stage').scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`lesson overflow ${viewport.width}`);
  await page.screenshot({path:resolve(out,`lesson-${viewport.width}.png`)});
 }
 await page.setViewportSize({width:1280,height:900});await page.goto(`${base}/hard-questions/films/?voice=daniel`);await page.waitForFunction(()=>!document.querySelector('#play').disabled);
 assert.ok(await page.locator('#stage .speaker-chip').textContent().then(s=>s.startsWith('DANIEL')));
 await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('audio').currentTime>.4);await page.locator('#play').click();
 await page.keyboard.press('ArrowRight');assert.ok(await page.locator('audio').evaluate(a=>a.currentTime>3));
 await page.locator('#motion').click();assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'true');
 await page.locator('#full').click();assert.ok(await page.evaluate(()=>!!document.fullscreenElement));await page.evaluate(()=>document.exitFullscreen());
 await page.keyboard.press('n');await page.waitForFunction(()=>!document.querySelector('#play').disabled);
 await page.screenshot({path:resolve(out,'projector.png')});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'projector overflow');
 await page.goto(`${base}/hard-questions/films/library.html`);
 for(const id of Object.keys(data)){
  await page.locator(`#choices button[data-id="${id}"]`).click();
  await page.waitForFunction(id=>document.getElementById('name').textContent.toLowerCase()===id&&document.getElementById('film').readyState>=2,id);
  await page.locator('#film').evaluate(v=>{v.currentTime=v.duration*.55});
  await page.waitForFunction(()=>!document.getElementById('film').seeking);
  await page.locator('#film').evaluate(v=>v.play());
  await page.waitForFunction(()=>document.getElementById('film').currentTime>document.getElementById('film').duration*.55+.15);
  assert.deepEqual(await page.locator('#film').evaluate(v=>[v.videoWidth,v.videoHeight,v.playbackRate]),[1280,720,1]);
  await page.locator('#film').evaluate(v=>v.pause());
  assert.equal(await page.locator('#storyboard .scene').count(),report.find(v=>v.id===id).scenes);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);await writeFile(resolve(out,'browser.json'),JSON.stringify({voices:report,lesson:true,projector:true,phone:true,allNineExportPlayback:true,errors,bad},null,2));
 console.log('PASS lesson playback, chapters, word game, discussion, original speed, phone/landscape, projector controls; all nine MP4s play and seek; no console or HTTP errors');
}finally{await browser.close()}
