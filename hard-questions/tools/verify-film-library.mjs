import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{}),args:['--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.BASE_URL||'http://127.0.0.1:8765/hard-questions/';const report=[];
try{
 await page.goto(base+'films/library.html?voice=gwen');await page.waitForFunction(()=>document.querySelector('#film').readyState>=2);
 assert.equal(await page.locator('#name').textContent(),'Gwen');
 for(const id of ['kamille','robert','larissa','daniel','scott','tiffany','danielle','gwen','sarah']){
   const old=await page.locator('#film').getAttribute('src');await page.locator(`#choices [data-id="${id}"]`).click();
   await page.waitForFunction(old=>{const v=document.querySelector('#film');return v.getAttribute('src')!==old&&v.readyState>=2;},old);
   const item=await page.locator('#film').evaluate(async(v)=>{const info={duration:v.duration,width:v.videoWidth,height:v.videoHeight};await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=v.duration*.55;});await v.play();await new Promise(r=>v.requestVideoFrameCallback(r));v.pause();return {...info,currentTime:v.currentTime,speed:v.playbackRate,seekable:v.seekable.end(0),error:v.error};});
   assert.equal(item.width,1280);assert.equal(item.height,720);assert.equal(item.speed,1);assert.equal(item.error,null);assert.ok(item.currentTime>1);report.push({id,...item});console.log(id+': playback and seek passed');
 }
 const previous=await page.locator('#film').getAttribute('src');await page.locator('#choices [data-id="gwen"]').click();await page.waitForFunction(previous=>{const v=document.querySelector('#film');return v.getAttribute('src')!==previous&&v.readyState>=2;},previous);
 await page.locator('#film').evaluate(v=>new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=8;}));
 await page.screenshot({path:fileURLToPath(new URL('../production/three-qa/film-library.png',import.meta.url)),fullPage:true});
 assert.deepEqual(errors,[]);await writeFile(new URL('../production/three-qa/film-library.json',import.meta.url),JSON.stringify(report,null,2));console.log('PASS: all nine browser video decodes, metadata, playback and seeks.');
}finally{await browser.close();}
