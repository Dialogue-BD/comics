/* Tactile miniature sets. All poses are functions of audio time, including seeks.
   Three.js 0.180.0 is vendored: no CDN or network required during a lesson. */
import * as T from './vendor/three.module.js';
import {sceneAt,cueAt,followerAt,clamp} from './timing.mjs?v=1';
import {semanticTimeline,semanticAt} from './semantic-timeline.mjs?v=3';
import {createSemanticStage} from './semantic-stage.mjs?v=3';

const P={bg:'#dce5d9',ivory:'#f5eddb',paper:'#fff9e9',green:'#255347',mint:'#7eaa8d',gold:'#c49a51',oak:'#b28252',terra:'#b96f55',blue:'#7396a5',ink:'#173e34',dark:'#203c37'};
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const materials=new Map(),geometries=new Map();
const textures=new Map();
function surfaceTexture(wood=false){
 const key=wood?'wood':'clay';if(textures.has(key))return textures.get(key);
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),pixels=x.createImageData(256,256);let seed=42;
 for(let y=0;y<256;y++)for(let xx=0;xx<256;xx++){seed=(seed*1664525+1013904223)>>>0;const noise=(seed/4294967296-.5)*22;const grain=wood?Math.sin(y*.65+Math.sin(xx*.025)*3)*20+Math.sin(y*.13+xx*.004)*9:0;const v=160+noise+grain,i=(y*256+xx)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}
 x.putImageData(pixels,0,0);const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(2,2);textures.set(key,tex);return tex;
}
function mat(color,metal=0,rough=.65){const k=[color,metal,rough].join();if(!materials.has(k))materials.set(k,new T.MeshStandardMaterial({color,metalness:metal,roughness:metal?.3:rough,bumpMap:surfaceTexture(color===P.oak),bumpScale:color===P.oak?.035:.012}));return materials.get(k);}
function geom(k,fn){if(!geometries.has(k))geometries.set(k,fn());return geometries.get(k);}
function group(parent,x=0,y=0,z=0,s=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);parent?.add(g);return g;}
function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function roundedGeometry(w,h,d,r=.08){r=Math.min(r,w/2-.001,h/2-.001,d/2-.001);const k=['box',w,h,d,r].join();return geom(k,()=>{const s=new T.Shape(),x=-w/2+r,y=-h/2+r,a=w-2*r,b=h-2*r;s.moveTo(x+r,y);s.lineTo(x+a-r,y);s.quadraticCurveTo(x+a,y,x+a,y+r);s.lineTo(x+a,y+b-r);s.quadraticCurveTo(x+a,y+b,x+a-r,y+b);s.lineTo(x+r,y+b);s.quadraticCurveTo(x,y+b,x,y+b-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:5});g.translate(0,0,-d/2+r);g.computeVertexNormals();return g;});}
function box(p,x,y,z,w,h,d,color=P.ivory,r=.06,metal=0){return mesh(p,roundedGeometry(w,h,d,r),mat(color,metal),x,y,z);}
function sphere(p,x,y,z,r,color=P.mint,sx=1,sy=1,sz=1){const m=mesh(p,geom('sphere',()=>new T.SphereGeometry(1,24,16)),mat(color),x,y,z);m.scale.set(r*sx,r*sy,r*sz);return m;}
function cyl(p,x,y,z,rt,rb,h,color=P.gold,metal=0){return mesh(p,geom(['cyl',rt,rb,h].join(),()=>new T.CylinderGeometry(rt,rb,h,48)),mat(color,metal),x,y,z);}
function rod(p,a,b,r=.04,color=P.gold,metal=.5){const v=new T.Vector3(...a),u=new T.Vector3(...b),dir=u.clone().sub(v);const m=cyl(p,...v.clone().add(u).multiplyScalar(.5).toArray(),r,r,dir.length(),color,metal);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return m;}
function torus(p,x,y,z,r,tube,color=P.gold,metal=.5){return mesh(p,geom(['torus',r,tube].join(),()=>new T.TorusGeometry(r,tube,10,64)),mat(color,metal),x,y,z);}
function disc(p,x,y,z,r,color){const m=cyl(p,x,y,z,r,r,.04,color);m.rotation.x=Math.PI/2;return m;}
function labelTexture(text,color=P.ink,bg=P.paper){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,512,256);x.fillStyle=color;x.textAlign='center';x.font='600 70px Georgia';x.fillText(text,256,158);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function plaque(p,text,x,y,z,w=1,h=.5){const m=new T.MeshBasicMaterial({map:labelTexture(text)});return mesh(p,geom('plane',()=>new T.PlaneGeometry(1,1)),m,x,y,z).scale.set(w,h,1);}
function paper(p,x=0,y=0,z=0,s=1,medical=false){const g=group(p,x,y,z,s);box(g,0,0,0,1.25,1.7,.07,P.paper,.02);box(g,-.34,.55,.05,.35,.08,.025,P.gold,.01);for(let i=0;i<5;i++)box(g,-.08,-.33+i*.15,.05,.85-(i%2)*.2,.025,.018,'#9caf9b',.005);if(medical){box(g,.35,.48,.07,.26,.07,.04,P.green,.01);box(g,.35,.48,.07,.07,.26,.04,P.green,.01);}return g;}
function book(p,x,y,z,s=1,color=P.terra){const g=group(p,x,y,z,s);box(g,0,0,0,1.4,.22,1.8,P.paper,.025);box(g,0,.14,0,1.48,.06,1.86,color,.02);box(g,0,-.14,0,1.48,.06,1.86,color,.02);box(g,-.72,0,0,.06,.32,1.86,color,.02);for(let i=0;i<3;i++)box(g,0,-.06+i*.06,.905,1.3,.009,.015,'#d1c3a6',.002);return g;}
function pot(p,x,y,z,s=1){const g=group(p,x,y,z,s);cyl(g,0,.3,0,.35,.25,.6,P.terra);cyl(g,0,.59,0,.3,.3,.04,'#685742');rod(g,[0,.6,0],[0,1.8,0],.025,P.green,0);for(let i=0;i<7;i++){const a=i*2.4,yy=.75+i*.15;rod(g,[0,yy,0],[Math.cos(a)*.38,yy+.28,Math.sin(a)*.38],.016,P.green,0);const l=sphere(g,Math.cos(a)*.39,yy+.33,Math.sin(a)*.39,.22,i%2?P.green:P.mint,1,.38,1.8);l.rotation.z=.45*Math.cos(a);l.rotation.y=-a;}return g;}
function tree(p,x=0,z=0,s=1){const g=group(p,x,.15,z,s);rod(g,[0,0,0],[0,2,0],.12,P.oak,0);for(let i=0;i<7;i++){const a=i*2.4,xx=Math.cos(a)*.6,zz=Math.sin(a)*.5,yy=1.5+(i%3)*.3;rod(g,[0,1,0],[xx,yy,zz],.06,P.oak,0);sphere(g,xx,yy+.35,zz,.58,[P.green,P.mint,'#557d55'][i%3],1,1.1,.9);}return g;}
function house(p,x=0,z=0,s=1){const g=group(p,x,.15,z,s);box(g,0,.95,0,2.2,1.9,1.9,P.ivory);const sh=new T.Shape();sh.moveTo(-1.25,0);sh.lineTo(0,.95);sh.lineTo(1.25,0);sh.closePath();const roof=mesh(g,geom('roof',()=>new T.ExtrudeGeometry(sh,{depth:2.2,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:2,steps:1})),mat(P.terra),0,1.9,-1.1);
 for(let side of [-1,1])for(let i=0;i<5;i++){const rr=box(g,side*(.13+i*.24),2.79-i*.18,0,.27,.05,2.22,'#a65e48',.015);rr.rotation.z=-side*.65;}
 box(g,-.4,.54,1,.55,1.08,.08,P.green,.025);sphere(g,-.24,.57,1.07,.035,P.gold);box(g,.52,1.1,1.01,.58,.57,.05,P.blue,.02);box(g,.52,1.1,1.06,.04,.64,.04,P.ivory,.01);box(g,.52,1.1,1.06,.64,.04,.04,P.ivory,.01);box(g,0,.08,1.25,1.7,.16,.55,P.ivory);box(g,.65,2.65,-.4,.36,.65,.35,P.ivory);pot(g,.95,.1,1.1,.4);return g;}
function server(p,x=0,z=0,s=1){const g=group(p,x,.15,z,s);box(g,0,1.45,0,1.65,2.9,1.25,P.ivory,.1);box(g,0,1.45,.65,1.36,2.6,.08,P.dark,.03);for(let j=0;j<7;j++){box(g,0,.37+j*.35,.72,1.17,.25,.1,'#355950',.025);for(let i=0;i<6;i++)box(g,-.27+i*.11,.37+j*.35,.781,.035,.13,.015,'#132f29',.005);sphere(g,.44,.37+j*.35,.8,.032,j%3?P.mint:P.gold);}for(let side of [-1,1])for(let i=0;i<9;i++)box(g,side*.835,1.1+i*.13,0,.025,.045,.67,'#9eab98',.005);return g;}
function chip(p,x=0,y=0,z=0,s=1){const g=group(p,x,y,z,s);box(g,0,0,0,1.55,.28,1.55,P.green,.09);box(g,0,.18,0,1.1,.14,1.1,P.dark,.05);box(g,0,.27,0,.57,.035,.57,P.gold,.035,.65);for(let side of [-1,1])for(let i=0;i<7;i++){box(g,side*.93,-.025,-.6+i*.2,.33,.075,.08,P.gold,.02,.7);box(g,-.6+i*.2,-.025,side*.93,.08,.075,.33,P.gold,.02,.7);}return g;}
function chair(p,x=0,z=0,s=1,color=P.terra,angle=0){const g=group(p,x,.15,z,s);g.rotation.y=angle;box(g,0,.8,0,1.25,.25,1.2,color,.1);box(g,0,1.4,-.48,1.25,1.2,.25,color,.1);for(let side of [-1,1]){box(g,side*.65,1.05,0,.2,.4,1.2,color,.08);for(let zz of [-.42,.42])rod(g,[side*.46,.7,zz],[side*.54,0,zz+.07],.045,P.oak,0);}box(g,0,1.43,-.31,.88,.7,.16,color,.08);return g;}
function table(p,x=0,z=0,s=1){const g=group(p,x,.15,z,s);cyl(g,0,.86,0,1.1,1.1,.15,P.oak);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;rod(g,[Math.cos(a)*.65,.8,Math.sin(a)*.65],[Math.cos(a)*.84,0,Math.sin(a)*.84],.06,P.green,0);}return g;}
function mug(p,x,y,z,s=1,color=P.paper){const g=group(p,x,y,z,s);cyl(g,0,.16,0,.15,.13,.32,color);cyl(g,0,.326,0,.12,.12,.012,'#765b3b');const handle=torus(g,.16,.18,0,.1,.035,color,0);return g;}
function clock(p,x=0,y=0,z=0,s=1){const g=group(p,x,y,z,s);const body=cyl(g,0,0,0,1.05,1.05,.22,P.green);body.rotation.x=Math.PI/2;disc(g,0,0,.14,.96,P.paper);torus(g,0,0,.17,.99,.035,P.gold);for(let i=0;i<60;i++){const a=i*Math.PI/30,r=i%5?.87:.84;const m=box(g,Math.sin(a)*r,Math.cos(a)*r,.18,i%5?.012:.027,i%5?.06:.12,.015,P.green,.003);m.rotation.z=-a;}const hands=group(g,0,0,.21);const minute=group(hands),hour=group(hands);box(minute,0,.32,0,.035,.72,.03,P.green,.01);box(hour,.13,.16,.03,.055,.49,.03,P.gold,.01);hour.rotation.z=-.5;sphere(g,0,0,.27,.065,P.gold);g.scale.setScalar(s);return {g,minute,hour};}
function desk(p,x=0,z=0,s=1){const g=group(p,x,.15,z,s);box(g,0,1.4,0,3.5,.18,1.8,P.oak,.08);for(let xx of [-1.4,1.4])for(let zz of [-.63,.63])box(g,xx,.7,zz,.12,1.4,.12,P.green,.03);box(g,1.1,1.1,0,.9,.35,1.55,P.ivory,.05);box(g,1.1,1.1,.79,.34,.045,.05,P.gold,.01);return g;}
function lamp(p,x,y,z,s=1){const g=group(p,x,y,z,s);cyl(g,0,.04,0,.32,.36,.08,P.green);rod(g,[0,.08,0],[0,1,0],.035,P.gold);rod(g,[0,1,0],[.42,1.3,0],.035,P.gold);const shade=cyl(g,.48,1.25,0,.13,.35,.35,P.green);shade.rotation.z=.35;return g;}
function pencil(p,x,y,z,s=1){const g=group(p,x,y,z,s);cyl(g,0,.42,0,.035,.035,.84,P.gold);cyl(g,0,-.06,0,.035,0,.12,P.oak);cyl(g,0,-.13,0,.011,0,.04,P.ink);box(g,0,.87,0,.08,.12,.08,P.terra,.02);g.rotation.z=-.45;return g;}
function notebook(p,x,y,z,s=1){const g=group(p,x,y,z,s);book(g,0,0,0,1,P.green);box(g,0,.19,0,1.32,.025,1.74,P.paper,.01);for(let i=0;i<9;i++)box(g,.04,.21,-.66+i*.16,1.04,.007,.018,'#a2b1a0',.002);for(let i=0;i<7;i++){const ring=torus(g,-.73,.22,-.65+i*.22,.07,.018,P.gold);ring.rotation.y=Math.PI/2;}return g;}
function path(p,a,b,width=.85){const aa=new T.Vector3(...a),bb=new T.Vector3(...b),dir=bb.clone().sub(aa);const m=box(p,...aa.clone().add(bb).multiplyScalar(.5).toArray(),width,.08,dir.length(),P.ivory,.025);m.rotation.y=Math.atan2(dir.x,dir.z);return m;}

function buildSet(kind){
 const root=group(),actors=[],tick=[];
 const add=(object,delay=0)=>{actors.push({object,delay,pos:object.position.clone(),scale:object.scale.clone()});return object;};
 const plinth=box(root,0,-.14,0,11,.28,5.8,P.ivory,.13);plinth.receiveShadow=true;
 // Fine brass reveal along the bottom of the stone presentation slab.
 box(root,0,-.265,0,10.85,.035,5.65,P.gold,.016,.45);
 const plant=(x,z,s=1)=>add(pot(root,x,.02,z,s),.2);
 const home=(x,z,s=1)=>add(house(root,x,z,s),.1);
 const tower=(x,z,s=1)=>add(server(root,x,z,s),.1);
 const conversation=(separate=false)=>{
   const left=add(chair(root,-2.5,.1,1.25,P.terra,-.28));const right=add(chair(root,2.5,.1,1.25,P.green,.28),.15);
   const tbl=add(table(root,0,.6,1.1),.3);mug(tbl,-.35,.95,0,1.25);mug(tbl,.35,.95,.2,1.25,P.terra);book(tbl,0,.98,-.3,.35,P.blue);plant(-4,-1.5,1.2);
   if(separate){for(const x of [-1.3,1.3]){const screen=add(box(root,x,1.3,0,.07,2.6,3.4,P.blue,.03),.25);tick.push(t=>screen.position.y=1.3);}tbl.visible=false;}
   else if(kind==='connection'||kind==='empathy'){tick.push(t=>{const q=smooth(t/3);left.position.x=-3.1+.6*q;right.position.x=3.1-.6*q;left.rotation.y=-.5+.22*q;right.rotation.y=.5-.22*q;});}
 };
 const writing=(mode)=>{
   const d=add(desk(root,0,0,1.4));add(chair(root,0,1.9,1,P.green,Math.PI),.2);lamp(d,-1.2,1.5,-.5);const nb=notebook(d,-.25,1.58,.15,.85);book(d,1.1,1.61,-.35,.55,P.blue);book(d,1.1,1.83,-.35,.5,P.terra);mug(d,-1.3,1.5,.52);
   const pen=pencil(d,-.45,1.9,.1,1.15);tick.push(t=>{pen.position.x=-.6+.7*(t*.32%1);pen.position.z=-.35+Math.floor((t*.32)%4)*.17;pen.rotation.z=-.4+.08*Math.sin(t*4);});
   if(mode==='thinking'){const c=add(chip(root,3.8,.35,-.8,.75),.4);tick.push(t=>c.rotation.y=.15*smooth(t/5));plant(-4,-1.4,.8);}
   if(mode==='work'||mode==='tasks'){tower(3.6,-.7,.7);const pile=group(root,-3.8,.3,-.1);for(let i=0;i<5;i++){const p=paper(pile,0,i*.12,0,.6);p.rotation.x=-Math.PI/2;}add(pile,.4);tick.push(t=>{pile.position.x=-3.8+1.3*smooth(t/4);pile.position.y=.3+.6*Math.sin(Math.PI*smooth(t/4));});}
   if(mode==='writing')plant(-4,-1.2,1.1);
 };
 switch(kind){
 case 'diagnosis':{
   const d=add(desk(root,-.6,0,1.5));const screen=group(d,.3,2.15,-.35);box(screen,0,0,0,1.55,1.12,.15,P.green,.06);box(screen,0,0,.09,1.37,.93,.025,'#102d28',.02);rod(d,[.3,1.5,-.35],[.3,1.85,-.35],.055,P.gold);box(d,.3,1.5,-.35,.6,.06,.36,P.green);
   for(let i=0;i<15;i++){const hh=.08+Math.pow(Math.sin(i*.9),6)*.5;box(screen,-.59+i*.085,0,.12,.035,hh,.02,P.mint,.005);}
   const scan=box(screen,-.6,0,.15,.025,.83,.02,P.gold,.006);tick.push(t=>scan.position.x=-.6+1.2*((t*.23)%1));
   for(let i=0;i<3;i++){const doc=paper(d,-1.05,1.58+i*.06,.1,.65,i===2);doc.rotation.x=-Math.PI/2;doc.rotation.z=i*.06;}
   lamp(d,1.35,1.5,-.4,.65);add(chair(root,-.8,2,1.1,P.terra,Math.PI),.1);const folder=group(root,3.4,.15,-.3);box(folder,0,1.2,0,1.6,2.4,.35,P.green);paper(folder,0,1.2,.22,1.05,true);add(folder,.35);plant(-4,-1.1,1.1);break;
 }
 case 'waiting':{
   const wall=add(box(root,0,1.8,-1.8,7.7,3.6,.16,'#adc2ae',.07));const c=clock(root,0,2.55,-1.65,.78);add(c.g,.1);tick.push(t=>{c.minute.rotation.z=-t*1.2;c.hour.rotation.z=-t*.1;});for(let i=0;i<3;i++)add(chair(root,-2+i*2,.2,1,P.green),.1+i*.1);plant(4,-.8,1.2);const cal=group(root,-3.1,2.3,-1.65);box(cal,0,0,0,1.3,1.55,.1,P.paper);box(cal,0,.6,.07,1.32,.31,.05,P.terra);plaque(cal,'6',0,-.08,.08,.85,.8);add(cal,.4);break;
 }
 case 'family':case 'time':{
   const h=home(-1.8,-.7,1.05);add(tree(root,-4,-.7,.85),.2);add(table(root,1.9,.9,.85),.2);add(chair(root,3.4,.1,.8,P.green,.4),.3);add(chair(root,1,.1,.58,P.terra,-.3),.4);add(chair(root,2.8,2,.52,P.blue,Math.PI),.5);mug(root,1.7,.99,1,.8);const c=clock(root,3.3,2.65,-1.2,.7);if(kind==='time'){add(c.g,.3);tick.push(t=>c.minute.rotation.z=-t*.8);}else c.g.visible=false;tick.push(t=>{h.rotation.y=-.03+.05*smooth(t/5);});break;
 }
 case 'control':{
   const t=add(table(root,0,0,2));chip(t,0,.99,0,.75);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;add(chair(root,Math.sin(a)*3.3,Math.cos(a)*2.3,.85,[P.green,P.terra,P.blue][i%3],a+Math.PI),i*.1);}plant(-4.3,-1.6,1);break;
 }
 case 'infrastructure':case 'environment':{
   tower(-2.8,-.5,1.05);tower(-1.1,-.6,.85);home(2.8,.15,.85);add(tree(root,4,-1.4,.85),.2);for(let i=0;i<4;i++)path(root,[-.1,.08,-1.2+i*.6],[1.3,.08,-1.2+i*.6],.12);
   for(let i=0;i<4;i++){const bead=sphere(root,0,.19,-1.2+i*.6,.07,kind==='environment'?P.terra:P.gold);tick.push(t=>bead.position.x=.1+(t*.4+i*.3)%1.1);}
   if(kind==='environment'){for(let i=0;i<3;i++){const w=cyl(root,-2.8,3.3+i*.25,-.5,.5,.5,.035,P.terra);tick.push(t=>{w.position.y=3.25+i*.22+.12*Math.sin(t*1.4+i);});}}break;
 }
 case 'compass':{
   const g=add(group(root,-1,1.1,0));g.rotation.x=-.6;const casebody=cyl(g,0,0,0,1.65,1.65,.32,P.gold,.7);casebody.rotation.x=Math.PI/2;disc(g,0,0,.18,1.5,P.paper);torus(g,0,0,.23,1.52,.04,P.green);for(let i=0;i<32;i++){const a=i*Math.PI/16,m=box(g,Math.sin(a)*1.3,Math.cos(a)*1.3,.25,.025,i%4?.09:.2,.02,P.green,.005);m.rotation.z=-a;}
   const needle=group(g,0,0,.28);const shape=new T.Shape();shape.moveTo(0,1.13);shape.lineTo(.17,0);shape.lineTo(0,-1.13);shape.lineTo(-.17,0);shape.closePath();mesh(needle,new T.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:false}),mat(P.terra));sphere(g,0,0,.39,.1,P.gold);tick.push(t=>needle.rotation.z=.6*Math.exp(-t*.4)*Math.cos(t*1.5)-.35);notebook(root,2.8,.4,.2,1.2);pencil(root,3.5,.6,1.1,1.1);plant(-4,-1.6,.8);break;
 }
 case 'thinking':case 'writing':case 'work':case 'tasks':writing(kind);break;
 case 'research':{
   const g=add(group(root,-.7,.1,0));for(let i=0;i<3;i++){const a=i*2*Math.PI/3;rod(g,[0,1.6,0],[Math.cos(a)*1.2,0,Math.sin(a)*1.2],.06,P.gold);}cyl(g,0,1.45,0,.2,.2,.35,P.green);const scope=group(g,0,2,0);scope.rotation.z=-.65;const tube=cyl(scope,0,.25,0,.34,.34,2.5,P.ivory);cyl(scope,0,1.52,0,.4,.4,.18,P.green);cyl(scope,0,1.62,0,.32,.32,.025,P.blue,.4);cyl(scope,0,-1.1,0,.17,.17,.35,P.green);torus(scope,0,.3,0,.36,.04,P.gold).rotation.x=Math.PI/2;tick.push(t=>scope.rotation.z=-.65+.18*smooth(t/7));notebook(root,3,.35,1.2,.9);add(group(root),0);const orbit=torus(root,3.5,2.5,-1.7,.7,.012,P.gold);orbit.rotation.x=.65;sphere(root,3.5,2.5,-1.7,.21,P.blue);sphere(root,4.12,2.8,-1.7,.07,P.gold);plant(-4,-1.5,.8);break;
 }
 case 'growing':case 'creativity':{
   const sizes=[.68,1.02,1.3];for(let i=0;i<3;i++)home(-3.6+i*3.5,-.25,sizes[i]);
   if(kind==='creativity'){root.children.filter(m=>m.type==='Group').forEach(m=>m.visible=false);const blocks=[];for(let i=0;i<10;i++){const x=-3.3+(i%5)*1.5,y=.42+Math.floor(i/5)*.85,z=i%2?.4:-.5;const b=add(box(root,x,y,z,.95,.83,.95,[P.terra,P.green,P.blue,P.gold,P.ivory][i%5],.07),i*.07);blocks.push(b);tick.push(t=>{const q=smooth((t-i*.18)/3);b.position.x=x+(1-q)*(i%2?1:-1);b.position.y=y+(1-q)*(1.2+i*.12);b.rotation.y=(1-q)*.8;});}book(root,3.7,.35,1.1,.6,P.green);}
   else for(let i=0;i<3;i++){const tr=add(tree(root,-4+i*3.5,-1.5,.45+i*.15),.3+i*.15);tick.push(t=>tr.scale.setScalar((.45+i*.15)*(.7+.3*smooth(t/5))));}break;
 }
 case 'isolation':conversation(true);break;
 case 'empathy':case 'connection':conversation();break;
 case 'access':{
   home(2.7,-.9,1.1);const deck=box(root,2.7,.4,1.1,3.5,.8,1.3,P.ivory);const ramp=box(root,-.45,.43,1.1,3.1,.13,1.15,P.oak);ramp.rotation.z=.25;for(let zz of [.55,1.65]){rod(root,[-2,.7,zz],[1.1,1.5,zz],.035,P.gold);for(let xx of [-1.9,-.5,1])rod(root,[xx,.1,zz],[xx,1.2+xx*.25,zz],.025,P.gold);}const wheel=group(root,-3.25,.17,.6);for(let zz of [-.4,.4]){const w=torus(wheel,0,.58,zz,.55,.055,P.green);for(let i=0;i<8;i++){const a=i*Math.PI/4;rod(wheel,[0,.58,zz],[Math.cos(a)*.51,.58+Math.sin(a)*.51,zz],.012,P.gold);}}box(wheel,0,.8,0,.65,.1,.8,P.blue);box(wheel,-.3,1.1,0,.12,.7,.8,P.blue);add(wheel,.2);plant(-4,-1.5,1.1);break;
 }
 case 'balance':{
   const g=add(group(root));cyl(g,0,.18,0,.85,.95,.36,P.green);cyl(g,0,.39,0,.7,.7,.08,P.gold,.65);cyl(g,0,1.65,0,.19,.34,2.5,P.green);cyl(g,0,2.7,0,.26,.26,.1,P.gold,.7);sphere(g,0,3.35,0,.18,P.gold);const beam=group(g,0,3.05,0);box(beam,0,0,0,6.6,.15,.24,P.green,.05);box(beam,0,.09,0,6.6,.035,.27,P.gold,.016,.6);const pans=[];
   for(let side of [-1,1]){const pan=group(g,side*2.8,1,0);cyl(pan,0,0,0,1.28,1.18,.16,P.gold,.65);for(let zz of [-.85,.85])rod(pan,[-.8,.07,zz],[0,2.05,0],.015,P.gold);for(let zz of [-.85,.85])rod(pan,[.8,.07,zz],[0,2.05,0],.015,P.gold);pans.push(pan);if(side<0)server(pan,0,0,.48);else{house(pan,-.32,.1,.46);tree(pan,.65,-.35,.42);}}
   tick.push(t=>{const angle=.13*Math.cos(t*1.3)*Math.exp(-t*.32);beam.rotation.z=angle;pans.forEach((pan,i)=>{pan.position.x=(i?1:-1)*2.8*Math.cos(angle);pan.position.y=1+(i?1:-1)*2.8*Math.sin(angle);});});break;
 }
 case 'nature':{
   tower(-2.8,-.6,.9);const g=add(group(root,1.8,.15,.2));cyl(g,0,.15,0,1.65,1.65,.3,P.green);cyl(g,0,.32,0,1.48,1.48,.04,'#78613e');const tr=tree(g,0,0,1.15);tick.push(t=>tr.scale.setScalar(.55+.6*smooth(t/3)));for(let i=0;i<8;i++){const a=i*2.4;sphere(g,Math.cos(a)*1.1,.43,Math.sin(a)*1.1,.25,P.mint,1,.6,1);}path(root,[-1.7,.05,.2],[0,.05,.2],.7);break;
 }
 case 'independence':case 'path':{
   home(3,-.6,1);home(-3.6,-.9,.58);const route=[[-2.7,.1,.5],[-1.4,.1,.5],[-.4,.1,1.4],[1,.1,1.4],[1.9,.1,.65]];for(let i=0;i<route.length-1;i++)path(root,route[i],route[i+1],.65);for(let i=0;i<5;i++){const a=i/4;const step=add(box(root,-1.9+i*.7,.2,.75,.28,.12,.28,P.gold,.04),i*.1);tick.push(t=>step.scale.y=.6+.4*smooth((t-i*.4)/.6));}add(tree(root,-.2,-1.5,.9),.3);plant(4,1.8,.6);break;
 }
 case 'support':{
   writing('writing');const board=group(root,3.7,.4,-.8);box(board,0,1.3,0,1.5,2.6,.13,P.green);for(let i=0;i<3;i++){const note=paper(board,0,1.9-i*.6,.1,.3);note.rotation.z=i%2?.07:-.07;}add(board,.3);break;
 }
 default:throw new Error(`Missing Three.js set: ${kind}`);
 }
 return {root,update(t,reduced){const tt=reduced?6:Math.max(0,t);for(const a of actors){const e=reduced?1:smooth((tt-a.delay)/1.1);a.object.position.copy(a.pos);a.object.scale.copy(a.scale);a.object.position.y-=.16*(1-e);a.object.scale.multiplyScalar(.94+.06*e);}for(const fn of tick)fn(tt);}};
}

function environment(renderer){const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#e9f0e0');g.addColorStop(.5,'#a3b7a2');g.addColorStop(1,'#456556');x.fillStyle=g;x.fillRect(0,0,1024,512);x.fillStyle='#fff5df';x.fillRect(80,40,250,180);x.fillStyle='#edf8ff';x.fillRect(650,120,160,220);const tex=new T.CanvasTexture(c);tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;const pm=new T.PMREMGenerator(renderer),env=pm.fromEquirectangular(tex);tex.dispose();pm.dispose();return env;}

export function createMotionStudio(ctx){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
 const scene=new T.Scene();scene.background=new T.Color(P.bg);const env=environment(renderer);scene.environment=env.texture;scene.environmentIntensity=.6;
 scene.add(new T.HemisphereLight('#fff7df','#6a8d77',.9));const sun=new T.DirectionalLight('#fff0d6',2.6);sun.position.set(-5,10,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-9,right:9,top:7,bottom:-7,near:.5,far:30});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);const fill=new T.DirectionalLight('#d5edff',.85);fill.position.set(7,5,-6);scene.add(fill);
 const floor=mesh(scene,new T.PlaneGeometry(200,200),mat('#b0c0ac'),0,-.31,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 const camera=new T.OrthographicCamera(-8.5,8.5,3.3,-3.3,.1,100);camera.position.set(7,6.2,13);camera.lookAt(0,1.25,0);
  const sets=new Map(),semanticSets=new Map(),outgoing=document.createElement('canvas'),outgoingContext=outgoing.getContext('2d');let lost=false,renderSize='';renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;});renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;});
 function get(kind){if(!sets.has(kind)){const s=buildSet(kind);sets.set(kind,s);scene.add(s.root);}return sets.get(kind);}
  function getSemantic(data,index){const id=data.name.toLowerCase(),key=`${id}/${index}`;if(!semanticSets.has(key)){const config=semanticTimeline[id]?.[index];if(!config)throw Error(`Missing semantic scene: ${key}`);const s=createSemanticStage(data,index,config);semanticSets.set(key,s);scene.add(s.root);}return semanticSets.get(key);}
 function draw(data,time,{width=960,height=430,captions=false,reduced=false,poster=false}={}){
   if(lost)throw Error('WebGL context lost');const s=sceneAt(data,time),index=data.scenes.indexOf(s),u=Math.max(0,time-s.start);
    for(const set of sets.values())set.root.visible=false;for(const set of semanticSets.values())set.root.visible=false;
    const active=getSemantic(data,index),moment=semanticAt(data.name.toLowerCase(),index,reduced?s.start:time);active.root.visible=true;active.update(moment,poster?s.start:time,reduced);
    active.root.rotation.y=reduced?-.035:-.035+.055*smooth(u/(s.end-s.start));
   camera.position.set(7,6.2,13);camera.zoom=reduced?1.32:1.32+.04*smooth(u/(s.end-s.start));camera.updateProjectionMatrix();
   const size=`${width}/${height}/${captions}`;if(size!==renderSize){renderer.setSize(width,Math.round(width*338/960),false);outgoing.width=renderer.domElement.width;outgoing.height=renderer.domElement.height;renderSize=size;}
    const blend=index>0&&u<.6&&!reduced&&!poster;
    if(blend){active.root.visible=false;const prevScene=data.scenes[index-1],prev=getSemantic(data,index-1);prev.root.visible=true;prev.update(semanticAt(data.name.toLowerCase(),index-1,prevScene.end-.001),prevScene.end-.001,false);prev.root.rotation.y=.02;renderer.render(scene,camera);outgoingContext.drawImage(renderer.domElement,0,0);prev.root.visible=false;active.root.visible=true;}
   renderer.render(scene,camera);
   ctx.save();ctx.scale(width/960,height/(captions?540:430));ctx.fillStyle=P.bg;ctx.fillRect(0,0,960,540);if(blend){ctx.drawImage(outgoing,0,83,960,338);ctx.globalAlpha=smooth(u/.6);}ctx.drawImage(renderer.domElement,0,83,960,338);ctx.globalAlpha=1;
   // The editorial typography and captions stay fixed while the set moves.
   ctx.fillStyle=P.ink;ctx.textAlign='left';ctx.font='600 11px Arial';ctx.fillText('HEARING HUMAN VOICES  /  '+data.name.toUpperCase(),34,27);
   ctx.font='500 31px Georgia';ctx.fillText(s.title,32,65);ctx.font='600 11px Arial';ctx.textAlign='right';ctx.fillText(`${String(index+1).padStart(2,'0')} / 03`,926,28);
   ctx.strokeStyle='#a8baa5';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(34,79);ctx.lineTo(926,79);ctx.stroke();
    ctx.fillStyle='rgba(255,249,233,.96)';ctx.beginPath();ctx.roundRect(40,94,148,34,5);ctx.fill();
    ctx.fillStyle=P.ink;ctx.textAlign='center';ctx.font='700 21px Arial';ctx.fillText('PERSON',114,118);
    ctx.fillStyle='rgba(23,62,52,.96)';ctx.beginPath();ctx.roundRect(746,94,166,34,5);ctx.fill();
    ctx.fillStyle=P.paper;ctx.textAlign='center';ctx.fillText('AI  /  TOOL',829,118);
   for(let i=0;i<3;i++){ctx.fillStyle=i===index?P.green:'#b6c5b1';ctx.beginPath();ctx.roundRect(34+i*47,411,37,3,1.5);ctx.fill();}
    if(moment){
      ctx.fillStyle='rgba(23,62,52,.96)';ctx.beginPath();ctx.roundRect(34,352,892,54,5);ctx.fill();
      ctx.textAlign='left';ctx.font='700 18px Arial';ctx.fillStyle=moment.status==='question'||moment.status==='uncertain'?'#efcb83':'#a9cdb0';
      const marker=moment.status==='question'?'QUESTION':moment.status==='uncertain'?'POSSIBLE':moment.status==='hope'?'HOPE':moment.status==='concern'?'CONCERN':'';
      if(marker)ctx.fillText(marker,49,386);
      ctx.font='600 24px Arial';ctx.fillStyle=P.paper;ctx.fillText(moment.label,marker?179:49,386,730);
    }
    ctx.fillStyle='#536c58';ctx.font='10px Arial';ctx.textAlign='left';ctx.fillText('Their questions. Their hopes. An illustration.',34,423);
   if(captions)drawCaptions(ctx,data,time,reduced);
   ctx.restore();return {scene:s,index,renderer:'three',drawCalls:renderer.info.render.calls};
 }
 function dispose(){for(const set of sets.values()){set.root.traverse(o=>{if(o.material?.map){o.material.map.dispose();o.material.dispose();}});}for(const set of semanticSets.values()){set.root.traverse(o=>{if(o.material?.map){o.material.map.dispose();o.material.dispose();}});}env.dispose();floor.geometry.dispose();renderer.dispose();}
 return {draw,dispose,renderer,scene,camera};
}

function drawCaptions(c,data,time,reduced){
 c.fillStyle=P.ink;c.fillRect(0,430,960,110);const {cue}=cueAt(data,time);c.font='500 27px Arial';const rows=[[]];let size=0;
 for(let i=cue.first;i<=cue.last;i++){const w=data.words[i],sw=c.measureText(w.w+' ').width;if(size+sw>870){rows.push([]);size=0;}rows.at(-1).push({w,sw,i});size+=sw;}
 const pos=[];rows.forEach((row,r)=>{let x=(960-row.reduce((a,v)=>a+v.sw,0))/2;const y=rows.length===1?494:477+r*39;row.forEach(({w,sw,i})=>{pos.push({w,i,x,y,width:sw+1});x+=sw;});});
 const follow=followerAt(data,time),now=pos.find(w=>w.i===follow.index);let glide;
 if(now&&follow.active){const prev=pos.find(w=>w.i===follow.index-1)||now,p=reduced?1:smooth((time-now.w.s)/.18);glide={x:prev.x+(now.x-prev.x)*p,y:prev.y+(now.y-prev.y)*p,width:prev.width+(now.width-prev.width)*p};c.fillStyle='#efcb83';c.beginPath();c.roundRect(glide.x-4,glide.y-28,glide.width,35,5);c.fill();}
 c.textAlign='left';pos.forEach(({w,x,y})=>{c.fillStyle=time>=w.s?P.paper:'#b3c8b5';c.fillText(w.w,x,y);});if(glide){c.save();c.beginPath();c.roundRect(glide.x-4,glide.y-28,glide.width,35,5);c.clip();pos.forEach(({w,x,y})=>{c.fillStyle=P.ink;c.fillText(w.w,x,y);});c.restore();}
}
