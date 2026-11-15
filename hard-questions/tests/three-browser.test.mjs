import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{}),args:['--enable-webgl','--ignore-gpu-blocklist']});
const base=process.env.BASE_URL||'http://127.0.0.1:8765/hard-questions/';
const evidence=new URL('../production/three-qa/',import.meta.url);await mkdir(evidence,{recursive:true});
const errors=[],failedLocal=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.stack));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))failedLocal.push(r.url());});
const report={};
try{
 await page.goto(base+'tools/studio.html');await page.waitForFunction(()=>window.ready);
 report.timeline=await page.evaluate(()=>{
   const frame=(t,id,opts)=>{window.renderAt(t,id,opts);return document.querySelector('canvas').toDataURL();};
   let scenes=0,transitions=0;const details=[];
   for(const [id,d] of Object.entries(data))for(const s of d.scenes){
     const t=s.start+(s.end-s.start)/2;
     const expected=frame(t,id);frame(.7,'sarah');frame(data[id].duration-.01,id);const actual=frame(t,id);
     if(expected!==actual)throw Error('Non-deterministic seek: '+id+' '+s.kind);
     const r1=frame(s.start+.8,id,{captions:false,reduced:true}),r2=frame(s.end-.1,id,{captions:false,reduced:true});
     if(r1!==r2)throw Error('Reduced motion still moving: '+id+' '+s.kind);
     if(s.start>0){for(const offset of [0,.1,.3,.6])frame(s.start+offset,id);transitions++;}
     details.push({id,kind:s.kind,seek:'passed',reduced:'passed'});scenes++;
   }
   const t0=performance.now();for(let i=0;i<60;i++)frame(i/24,'gwen');
   return {scenes,transitions,details,render60FramesMs:performance.now()-t0,geometries:studio.renderer.info.memory.geometries,textures:studio.renderer.info.memory.textures};
 });
 await page.goto(base);await page.waitForSelector('#voices button');await page.locator('[data-step="2"]').click();
 await page.waitForFunction(()=>document.querySelector('#scene-chapters').children.length===3);
 for(const id of ['kamille','robert','larissa','daniel','scott','tiffany','danielle','gwen','sarah']){
   await page.locator(`#voices [data-id="${id}"]`).click();assert.equal(await page.locator('#scene-chapters button').count(),3);
   assert.equal(await page.locator('[data-step]:disabled').count(),0);
 }
 await page.locator('#voices [data-id="gwen"]').click();await page.locator('#scene-chapters button').nth(1).click();
 await page.waitForFunction(()=>document.querySelector('#audio').currentTime>5.26&&!document.querySelector('#audio').paused);
 report.originalSpeed=await page.locator('#audio').evaluate(a=>a.playbackRate);assert.equal(report.originalSpeed,1);
 await page.locator('#play').click();
 await page.locator('#motion-toggle').click();assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');
 await page.locator('.motion-theatre').screenshot({path:fileURLToPath(new URL('desktop.png',evidence))});
 report.viewports=[];
 for(const size of [{width:390,height:844},{width:844,height:390}]){
   await page.setViewportSize(size);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);report.viewports.push({...size,overflow});
   await page.locator('.motion-theatre').screenshot({path:fileURLToPath(new URL(`viewport-${size.width}.png`,evidence))});
 }
 // Disable WebGL before app initialization to verify usable matching-still fallback.
 const fallback=await browser.newPage({viewport:{width:390,height:844}});
 await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});
 await fallback.goto(base);await fallback.waitForSelector('#voices button');await fallback.locator('[data-step="2"]').click();
 await fallback.waitForFunction(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('frames-three/')).length===3);
 await fallback.waitForFunction(()=>{const c=document.getElementById('motion-canvas'),x=c.getContext('2d'),p=x.getImageData(c.width/2,c.height/2,1,1).data;return p[0]!==220||p[1]!==229||p[2]!==217;});
 await fallback.locator('.motion-theatre').screenshot({path:fileURLToPath(new URL('no-webgl.png',evidence))});report.noWebGL='matching rendered scene visible';
 assert.deepEqual(errors,[]);assert.deepEqual(failedLocal,[]);report.browserErrors=errors;report.failedLocalRequests=failedLocal;
 await writeFile(new URL('report.json',evidence),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
