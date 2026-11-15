import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {semanticTimeline} from '../semantic-timeline.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({
  headless:true,
  ...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{}),
  args:['--enable-webgl','--ignore-gpu-blocklist']
});
const base=process.env.BASE_URL||'http://127.0.0.1:5000/hard-questions/';
const errors=[];
try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);
  await page.waitForSelector('#voices button');
  await page.locator('[data-step="2"]').click();
  let checked=0;
  for(const [id,scenes] of Object.entries(semanticTimeline)){
    await page.locator(`#voices [data-id="${id}"]`).click();
    for(const scene of scenes)for(const [time,label] of scene.moments){
      await page.locator('#watch-seek').evaluate((input,t)=>{
        input.step='any';
        input.value=t;
        input.dispatchEvent(new Event('input',{bubbles:true}));
      },time+.001);
      assert.equal(await page.locator('#scene-meaning').textContent(),label,`${id}@${time}`);
      assert.equal(await page.locator('#motion-stage').getAttribute('aria-label'),`Animated picture: ${label}`);
      assert.ok(await page.locator('#karaoke-words button').count()>0);
      checked++;
    }
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#motion-toggle').click();
  const id='sarah',scene=semanticTimeline[id][2];
  await page.locator('#watch-seek').evaluate((input,t)=>{
    input.value=t;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  },18);
  assert.equal(await page.locator('#scene-meaning').textContent(),scene.moments[0][1]);
  const output=resolve('generated-artifacts/human-voices-verification');
  await mkdir(output,{recursive:true});
  await page.locator('.motion-theatre').screenshot({path:resolve(output,'phone-listening.png')});
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${checked} picture explanations and accessible descriptions follow seeking across all nine voices; phone layout, captions and reduced motion passed.`);
}finally{await browser.close();}
