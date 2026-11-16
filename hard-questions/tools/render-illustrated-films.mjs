/* Shared DOM/GSAP scene export. Serve the repository locally; requires Playwright and FFmpeg. */
import {createRequire} from 'node:module';
import {readFile,mkdir,copyFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(await readFile(resolve(root,'transcripts.json')));
const backup=resolve(root,'../generated-artifacts/human-voices-original-films');await mkdir(backup,{recursive:true});
const frames=resolve(root,'production/frames-illustrated');await mkdir(frames,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const base=process.env.STUDIO_URL||'http://127.0.0.1:8765/hard-questions/tools/illustrated-studio.html';
const only=process.argv.slice(2).find(a=>!a.startsWith('--')),fps=24;
try{for(const [id,d]of Object.entries(data)){
 if(only&&only!==id)continue;
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}?voice=${id}`);await page.waitForFunction(()=>window.ready,{},{timeout:60000});
 const scenes=await page.evaluate(()=>studio.scenes);
 for(let i=0;i<scenes.length;i++){
  await page.evaluate(t=>renderAt(t),Math.min(scenes[i].end-.1,scenes[i].start+1));
  await page.screenshot({path:resolve(frames,`${id}-${i+1}.png`)});
 }
 if(process.argv.includes('--frames')){await page.close();continue}
 const dest=resolve(root,`films/${id}.mp4`),tmp=resolve(root,`films/${id}.rendering.mp4`);
 try{await copyFile(dest,resolve(backup,`${id}.mp4`),1)}catch(e){if(e.code!=='EEXIST')throw e}
 const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-vcodec','mjpeg','-r',String(fps),'-i','pipe:0','-i',resolve(backup,`${id}.mp4`),'-map','0:v:0','-map','1:a:0','-t',String(d.duration),'-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','20','-preset','fast','-c:a','copy','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',tmp],{stdio:['pipe','inherit','inherit']});
 const finished=once(ff,'close');ff.stdin.on('error',()=>{});
 // CDP screenshots avoid Playwright's extra rendering waits on every frame.
 const cdp=await page.context().newCDPSession(page);
 for(let n=0,total=Math.ceil(d.duration*fps);n<total;n++){
  await page.evaluate(t=>renderAt(t),n/fps);
  const {data:jpg}=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:94,optimizeForSpeed:true});
  if(!ff.stdin.write(Buffer.from(jpg,'base64')))await once(ff.stdin,'drain');
  if(n%240===0)console.log(`${id}: ${n}/${total}`);
 }
 ff.stdin.end();const [code]=await finished;if(code!==0||errors.length)throw Error(`${id}: ${code} ${errors.join('; ')}`);
 await rename(tmp,dest);await page.close();console.log(`DONE ${id}`);
}}finally{await browser.close()}
