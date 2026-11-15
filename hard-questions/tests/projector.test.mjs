import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{}),args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.BASE_URL||'http://127.0.0.1:8788/hard-questions/';
try{
 await page.goto(base+'films/#gwen');await page.waitForFunction(()=>document.querySelector('#stage').dataset.renderer==='three'&&!document.querySelector('#play').disabled);
 assert.equal(await page.locator('#voices [aria-pressed="true"]').getAttribute('data-id'),'gwen');
 await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('#audio').currentTime>.1);await page.locator('#play').click();
 await page.keyboard.press('ArrowRight');assert.ok(await page.locator('#audio').evaluate(a=>a.currentTime>3));
 await page.locator('#motion').click();assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'true');
 await page.locator('#full').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 await page.keyboard.press('n');await page.waitForFunction(()=>document.querySelector('#voices [aria-pressed="true"]').dataset.id==='sarah'&&!document.querySelector('#play').disabled);
 await page.screenshot({path:fileURLToPath(new URL('../production/three-qa/projector.png',import.meta.url)),fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);await writeFile(new URL('../production/three-qa/projector.json',import.meta.url),JSON.stringify({renderer:'three',playback:'passed',keyboardSeek:'passed',nextVoice:'passed',fullScreen:'passed',reducedMotion:'passed',phoneOverflow:false,errors},null,2));console.log('PASS: projector playback, keyboard seek/next, full screen, reduced motion and mobile layout.');
}finally{await browser.close();}
