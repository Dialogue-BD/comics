const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/timothyhall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const tasks=JSON.parse(fs.readFileSync('graphic-design-module/tools/language-curriculum.json')).foundations;
const defs=JSON.parse(fs.readFileSync('graphic-design-module/tools/definition-audio-manifest.json'));
assert.equal(defs.length,16);
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:1000}});const page=await context.newPage();const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!/^(data:|blob:|http:\/\/127\.0\.0\.1:8766\/)/.test(r.url()))external.push(r.url())});
 await page.goto('http://127.0.0.1:8766/graphic-design-module.html#library/foundations');
 async function picker(){const d=page.locator('.practice-round-picker');if(await d.getAttribute('open')===null)await d.locator('summary').click()}
 async function foundation(group,i){await picker();await page.locator(`[data-foundation-group="${group}"]`).click();await picker();await page.locator(`[data-lang-round="${i}"]`).first().click()}
 for(let i=0;i<tasks.length;i++){
  const task=tasks[i];await foundation(task.category,i);
  await page.locator('[data-foundation-action="compare"]').first().click();
  const reveal=page.locator('[data-foundation-action="name"]');await (await reveal.count()?reveal:page.locator('[data-foundation-action="name-audio"]').first()).click();
  const audio=page.locator('audio[data-typographic-definition]');await page.waitForFunction(()=>{const a=document.querySelector('audio[data-typographic-definition]');return a&&!a.paused&&a.currentTime>.1});
  assert.equal(await audio.getAttribute('data-recording'),'definition-'+task.concept);assert.ok(defs[i].turns[0].text.endsWith(await page.locator('.type-definition').innerText()));
  assert.ok(Math.abs(await audio.evaluate(a=>a.duration)-defs[i].duration)<.15);
  assert.equal(await page.locator('.type-svg').getAttribute('role'),'img');assert.ok(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).length)>0);
  await audio.evaluate(a=>a.pause());const before=await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).map(a=>a.currentTime));await page.waitForTimeout(150);assert.deepEqual(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).map(a=>a.currentTime)),before);
  await audio.evaluate(a=>{a.currentTime=Math.min(5.9,a.duration-.1)});await page.waitForTimeout(100);
  assert.ok(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).every(a=>Math.abs(a.currentTime-r.querySelector('audio').currentTime*1000)<10)));
  await audio.evaluate(a=>{a.currentTime=a.duration-.02});await page.waitForTimeout(70);assert.ok(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).every(a=>a.currentTime>=a.effect.getComputedTiming().endTime)),task.concept+' finishes before audio ends');
  await page.locator('.type-stage').screenshot({path:`graphic-design-module/qa/word-${task.concept}.png`});
 }
 await foundation('principles',11);await page.locator('[data-foundation-action="name-audio"]').first().click();
 const oldAudio=await page.locator('audio[data-typographic-definition]').elementHandle();await page.locator('[data-foundation-action="compare"]').first().click();assert.equal(await oldAudio.evaluate(a=>a.paused),true);await page.locator('[data-foundation-action="name-audio"]').first().click();
 const audio=page.locator('audio[data-typographic-definition]');await page.waitForTimeout(200);assert.equal(await page.locator('.type-reveal audio[controls],.type-reveal [data-audio-speed]').count(),0);
 await page.waitForTimeout(150);assert.ok(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).every(a=>Math.abs(a.currentTime-r.querySelector('audio').currentTime*1000)<90)));
 await page.locator('[data-foundation-action="name-audio"]').first().click();assert.ok(await audio.evaluate(a=>a.currentTime)<.5);
 await audio.evaluate(a=>{a.pause();a.currentTime=5});await page.waitForTimeout(100);await page.locator('.fo-definition').screenshot({path:'graphic-design-module/qa/typographic-balance-desktop.png'});
 await context.setOffline(true);await page.locator('[data-foundation-action="name-audio"]').first().click();await page.waitForFunction(()=>document.querySelector('audio[data-typographic-definition]').currentTime>.2);await context.setOffline(false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-foundation-action="name-audio"]').first().click();assert.equal(await page.locator('.type-reveal').evaluate(r=>r.getAnimations({subtree:true}).filter(a=>!a.effect.target.closest('.type-intro-loop')).length),0);assert.equal(await audio.evaluate(a=>a.paused),false);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});
 for(let i=1;i<tasks.length;i++){await foundation(tasks[i].category,i);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const box=await page.locator('.type-svg').boundingBox();assert.ok(box.width>230&&box.width<390, tasks[i].concept+' ' +JSON.stringify(box))}
 await picker();await page.locator('[data-lang-round="11"]').first().click();await page.locator('.fo-definition').screenshot({path:'graphic-design-module/qa/typographic-balance-mobile.png'});
 await page.reload();assert.equal(await page.locator('[data-foundation-action="name"]').count(),0);assert.equal(await page.locator('audio[data-typographic-definition]').evaluate(a=>a.paused),true);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await browser.close();console.log('PASS: 16 recorded semantic word reveals, first-reveal playback, replay reset, audio/animation pause and seek synchronization, compact hidden audio, offline playback, reduced motion, persistent names, and phone layouts.');
})().catch(e=>{console.error(e);process.exit(1)});
