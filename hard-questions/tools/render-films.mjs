/* Offline, deterministic export. Uses the same renderer as the activity.
   CANVAS_MODULE may point to a discovered installation of @napi-rs/canvas. */
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {drawMotion} from '../motion.mjs';
const require=createRequire(import.meta.url);
const {createCanvas}=require(process.env.CANVAS_MODULE||'@napi-rs/canvas');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'transcripts.json'),'utf8'));
const output=resolve(root,'films');await mkdir(output,{recursive:true});
const fps=24,width=1280,height=720;
const canvas=createCanvas(width,height),ctx=canvas.getContext('2d');
if(process.argv.includes('--frames')){
 const dir=resolve(root,'production/frames');await mkdir(dir,{recursive:true});
 for(const [id,d] of Object.entries(data))for(let i=0;i<d.scenes.length;i++){
  const s=d.scenes[i],t=Math.min(s.end-.1,s.start+2);
  drawMotion(ctx,d,t,{width,height,captions:true});await writeFile(resolve(dir,`${id}-${i+1}.png`),canvas.toBuffer('image/png'));
 }
 console.log('Rendered all 27 representative scenes.');process.exit(0);
}
for(const [id,d] of Object.entries(data)){
 if(process.argv[2]&&!id.includes(process.argv[2]))continue;
 const args=['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s',`${width}x${height}`,'-r',String(fps),'-i','pipe:0','-i',resolve(root,`audio/hq-${id}.mp3`),'-map','0:v','-map','1:a','-t',String(d.duration),'-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','24','-preset','fast','-c:a','aac','-b:a','128k','-ac','2','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',resolve(output,`${id}.mp4`)];
 const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
 const finished=once(ff,'close');
 for(let frame=0;frame<Math.ceil(d.duration*fps);frame++){
  drawMotion(ctx,d,frame/fps,{width,height,captions:true});
  const pixels=ctx.getImageData(0,0,width,height).data;
  if(!ff.stdin.write(pixels))await once(ff.stdin,'drain');
 }
 ff.stdin.end();const [code]=await finished;if(code!==0)throw Error(`Encoder failed: ${id} ${code}`);
 console.log(`${id}: ${d.duration.toFixed(2)}s, ${Math.ceil(d.duration*fps)} frames at ${fps} fps`);
}
