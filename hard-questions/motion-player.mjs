/* Shared illustrated scenes, driven by the original audio clock. */
import {buildScene} from './illustrated/scene.mjs?v=illustrated1';
const stylesheet=new URL('./illustrated/scene.css?v=illustrated1',import.meta.url).href;
if(!document.querySelector(`link[href="${stylesheet}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=stylesheet;document.head.append(link)}
export function createStage(host){
 host.classList.add('hq-illustrated');
 let renderer=null,reduced=false,time=0,loadId=0;
 const stage={built:null,scenes:[],
  async load(voice,transcript){
   const id=++loadId;stage.built=null;stage.scenes=[];renderer?.dispose();renderer=null;host.replaceChildren();time=0;
   const {default:V}=await import(`./illustrated/voices/${voice.id}.js?v=illustrated1`);
   if(id!==loadId)return;
   const next=buildScene(host,V,transcript);renderer=next;stage.scenes=next.scenes;
   next.setReduced(reduced);await next.ready;
   if(id!==loadId)return;
   stage.built=voice.id;host.dataset.renderer='illustrated';stage.seek(time);
  },
  seek(t){time=t;renderer?.seek(t);const s=stage.scenes.findLast(s=>s.start<=t);if(s)host.setAttribute('aria-label',s.meaning)},
  setReduced(v){reduced=v;renderer?.setReduced(v)},setPlaying(){},
  dispose(){loadId++;renderer?.dispose()}
 };return stage;
}
