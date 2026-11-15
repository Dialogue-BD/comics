/* Adapter for the existing lesson and projector controls. One WebGL context,
   original audio clock, matching rendered stills if WebGL is unavailable. */
import {sceneAt} from './timing.mjs?v=1';
export function createStage(host){
 const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=574;
 canvas.id=host.id==='motion-stage'?'motion-canvas':'projector-canvas';
 canvas.style.cssText='display:block;width:100%;height:auto;aspect-ratio:960/430';
 host.replaceChildren(canvas);const ctx=canvas.getContext('2d');
 let studio=null,data=null,frames=[],reduced=false,playing=false,time=0,loadId=0;
 const ready=import('./motion-3d.mjs?v=3').then(m=>{studio=m.createMotionStudio(ctx);}).catch(()=>{});
 const stage={built:null,
   async load(voice,transcript){
     const id=++loadId;data=transcript;time=0;stage.built=voice.id;
     frames=transcript.scenes.map((_,i)=>{const img=new Image();img.src=new URL(`production/frames-three/${voice.id}-${i+1}.png?v=meaning2`,import.meta.url);img.onload=()=>{if(id===loadId&&!studio)stage.seek(time);};return img;});
     stage.seek(0);await ready;if(id===loadId)stage.seek(time);
   },
   seek(seconds){
     if(!data)return;time=seconds;const s=sceneAt(data,time),si=data.scenes.indexOf(s);
     host.setAttribute('aria-label',s.meaning);
     if(studio)try{studio.draw(data,time,{width:canvas.width,height:canvas.height,reduced,poster:time===0&&!playing});host.dataset.renderer='three';return;}catch{}
     host.dataset.renderer='still';ctx.fillStyle='#dce5d9';ctx.fillRect(0,0,canvas.width,canvas.height);
     const img=frames[si];if(img?.complete&&img.naturalWidth)ctx.drawImage(img,0,0,1280,720*430/540,0,0,canvas.width,canvas.height);
     else{ctx.fillStyle='#173e34';ctx.font='32px Georgia';ctx.fillText(s.title,36,70);}
   },
   setReduced(value){reduced=value;stage.seek(time);},
   setPlaying(value){playing=value;},
   dispose(){loadId++;studio?.dispose();}
 };return stage;
}
