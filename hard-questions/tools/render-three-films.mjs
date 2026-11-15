/* Deterministic WebGL-to-H.264 export. Requires Playwright and FFmpeg.
   PLAYWRIGHT_MODULE and CHROME_EXECUTABLE can select existing installations. */
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,copyFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'transcripts.json'),'utf8'));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{}),args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});const errors=[];page.on('pageerror',e=>errors.push(e.stack));
const base=process.env.STUDIO_URL||'http://127.0.0.1:8765/hard-questions/tools/studio.html';
await page.goto(base);await page.waitForFunction(()=>window.ready,{},{timeout:60000});
const frames=resolve(root,'production/frames-three');await mkdir(frames,{recursive:true});
try{
 if(process.argv.includes('--frames')){
   for(const [id,d] of Object.entries(data))for(let i=0;i<d.scenes.length;i++){
     const s=d.scenes[i],t=Math.min(s.end-.1,s.start+2);
     const bytes=await page.evaluate(({id,t})=>{window.renderAt(t,id);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},{id,t});
     await writeFile(resolve(frames,`${id}-${i+1}.png`),Buffer.from(bytes,'base64'));
   }
   console.log('Rendered 27 Three.js scene frames.');
 }else{
   const backup=resolve(root,'production/previous-2d-films');await mkdir(backup,{recursive:true});
   const only=process.argv.slice(2).find(a=>!a.startsWith('--'));
   const fps=24;
   for(const [id,d] of Object.entries(data)){
     if(only&&id!==only)continue;
     const destination=resolve(root,`films/${id}.mp4`),temporary=resolve(root,`films/${id}.rendering.mp4`);
     try{await copyFile(destination,resolve(backup,`${id}.mp4`),1);}catch(e){if(e.code!=='EEXIST')throw e;}
     // Keep the already-normalized original AAC audio without another lossy encode.
     const args=['-y','-v','error','-f','image2pipe','-vcodec','mjpeg','-r',String(fps),'-i','pipe:0','-i',resolve(backup,`${id}.mp4`),'-map','0:v:0','-map','1:a:0','-t',String(d.duration),'-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','20','-preset','fast','-c:a','copy','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',temporary];
     const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']}),finished=once(ff,'close');ff.stdin.on('error',()=>{});
     const start=Date.now(),total=Math.ceil(d.duration*fps);
     for(let frame=0;frame<total;frame++){
       const bytes=await page.evaluate(({id,t})=>{window.renderAt(t,id);return document.querySelector('canvas').toDataURL('image/jpeg',.95).split(',')[1];},{id,t:frame/fps});
       if(!ff.stdin.write(Buffer.from(bytes,'base64')))await once(ff.stdin,'drain');
       if(frame%120===0)console.log(`${id}: ${frame}/${total} frames · ${((Date.now()-start)/1000).toFixed(1)}s elapsed`);
     }
     ff.stdin.end();const [code]=await finished;if(code!==0)throw Error(`Encoder failed: ${id} ${code}`);
     if(errors.length)throw Error(errors.join('\n'));await rename(temporary,destination);
     console.log(`DONE ${id}: ${total} frames, ${d.duration.toFixed(2)}s, ${((Date.now()-start)/1000).toFixed(1)}s to render`);
   }
 }
 if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
