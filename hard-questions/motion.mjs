/* One deterministic motion system for the live lesson and the exported films.
   Illustrations represent each speaker's questions, not claims about AI's effects. */
export const COLORS={bg:'#082f2e',panel:'#164342',ink:'#f4f0df',mint:'#8ee1c2',gold:'#f4c878',rose:'#f3a89b',blue:'#9bbdf4'};
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>1-Math.pow(1-clamp(v),3);
export function sceneAt(data,t){return data.scenes.find(s=>t>=s.start&&t<s.end)||data.scenes[t<data.scenes[0].start?0:data.scenes.length-1];}
export function cueAt(data,t){let i=0;while(i+1<data.cues.length&&data.cues[i+1].start<=t)i++;return {cue:data.cues[i],index:i};}
export function wordAt(data,t){return data.words.findIndex(w=>t>=w.s&&t<w.e);}
export function followerAt(data,t){
 let i=0;while(i+1<data.words.length&&data.words[i+1].s<=t)i++;
 const w=data.words[i],next=data.words[i+1];
 return {index:i,active:t>=w.s&&(t<=w.e+.22||!next||next.s-w.e<=.72)};
}

function box(c,x,y,w,h,r=16,fill=COLORS.panel,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function circle(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill();}
function line(c,points,color=COLORS.mint,width=3){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function text(c,str,x,y,size=18,color=COLORS.ink,align='center',weight=500){c.font=`${weight} ${size}px Arial, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(str,x,y);}
function tag(c,str,x,y,color=COLORS.mint){c.font='600 16px Arial';const w=c.measureText(str).width+32;box(c,x-w/2,y-22,w,36,18,'#234d49');text(c,str,x,y,16,color);}
function heart(c,x,y,s,color=COLORS.rose){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,8);c.bezierCurveTo(-40,-15,-25,-45,0,-20);c.bezierCurveTo(25,-45,40,-15,0,8);c.fillStyle=color;c.fill();c.restore();}
function person(c,x,y,s=1,color=COLORS.gold,pose=0){c.save();c.translate(x,y);c.scale(s,s);circle(c,0,-61,17,color);box(c,-22,-38,44,58,18,color);line(c,[[-12,15],[-18,52]],color,11);line(c,[[12,15],[18,52]],color,11);line(c,[[-19,-23],[-36,-8+pose]],color,9);line(c,[[19,-23],[36,-8-pose]],color,9);c.restore();}
function chip(c,x,y,s=1,label='AI'){c.save();c.translate(x,y);c.scale(s,s);for(let a=-1;a<=1;a++){
 line(c,[[a*18,-47],[a*18,-32]],COLORS.mint,3);line(c,[[a*18,32],[a*18,47]],COLORS.mint,3);line(c,[[-47,a*18],[-32,a*18]],COLORS.mint,3);line(c,[[32,a*18],[47,a*18]],COLORS.mint,3);
}box(c,-32,-32,64,64,12,'#284e49',COLORS.mint);text(c,label,0,8,22,COLORS.mint,'center',700);c.restore();}
function page(c,x,y,s=1,mark='lines',color=COLORS.gold){c.save();c.translate(x,y);c.scale(s,s);box(c,-43,-58,86,116,8,'#f3efdf');box(c,-31,-43,27,9,3,color);for(let i=0;i<4;i++)line(c,[[-30,-15+i*15],[25-(i%2)*15,-15+i*15]],'#8caaa1',3);if(mark==='cross'){box(c,11,14,26,7,1,'#31997d');box(c,21,4,7,26,1,'#31997d');}c.restore();}
function home(c,x,y,s=1,color=COLORS.gold){c.save();c.translate(x,y);c.scale(s,s);line(c,[[-46,-21],[0,-59],[46,-21]],color,7);box(c,-37,-20,74,67,5,'#28524b',color);box(c,-10,12,20,35,2,color);box(c,15,-8,13,14,2,COLORS.mint);c.restore();}
function leaf(c,x,y,s=1,color=COLORS.mint){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,25);c.bezierCurveTo(-53,14,-45,-37,16,-45);c.bezierCurveTo(45,-3,20,23,0,25);c.fillStyle=color;c.fill();line(c,[[-5,35],[10,-28]],'#2c6b51',3);c.restore();}
function server(c,x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);box(c,-43,-67,86,137,14,'#2a5450',COLORS.blue);for(let i=0;i<3;i++){box(c,-32,-52+i*40,64,29,5,'#102f32');circle(c,-19,-37+i*40,4,COLORS.mint);line(c,[[-3,-37+i*40],[21,-37+i*40]],COLORS.blue,3);}c.restore();}
function clock(c,x,y,s=1,p=0){c.save();c.translate(x,y);c.scale(s,s);circle(c,0,0,53,'#244f47');c.strokeStyle=COLORS.gold;c.lineWidth=4;c.stroke();line(c,[[0,-31],[0,0],[Math.sin(p)*26,-Math.cos(p)*26]],COLORS.gold,4);circle(c,0,0,5,COLORS.gold);c.restore();}
function flow(c,from,to,t,color=COLORS.mint,n=3){line(c,[from,to],'#3c6259',2);for(let i=0;i<n;i++){const a=((t*.22+i/n)%1+1)%1;circle(c,from[0]+(to[0]-from[0])*a,from[1]+(to[1]-from[1])*a,3.5,color);}}
function star(c,x,y,r,color=COLORS.gold){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5;const d=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d);}c.closePath();c.fillStyle=color;c.fill();}
function enter(c,x,y,elapsed,delay,draw){const p=ease((elapsed-delay)/1.15);c.save();c.globalAlpha*=p;c.translate(x,y+35*(1-p));c.scale(.88+.12*p,.88+.12*p);draw();c.restore();}

function composition(c,kind,u,p,t){
 const C=COLORS;
 const E=(x,y,d,fn)=>enter(c,x,y,u,d,fn);
 switch(kind){
 case 'diagnosis':
  E(275,222,0,()=>{page(c,-15,0,1.2,'cross');page(c,-37,-8,.9);});
  E(480,216,.25,()=>{chip(c,0,0,1.15);const scan=(u%3)/3;box(c,-62,-68+scan*132,124,4,2,C.mint);});
  flow(c,[340,220],[426,220],u);flow(c,[535,220],[632,220],u+.4);
  E(693,222,.6,()=>{page(c,0,0,1.3,'cross');circle(c,43,-52,20,C.mint);text(c,'?',43,-45,26,C.bg,'center',700);});
  tag(c,'medical records',275,340);tag(c,'AI + a doctor?',690,340);break;
 case 'waiting':
  line(c,[[210,265],[750,265]],'#527567',4);
  for(let i=0;i<6;i++)E(210+i*108,265,i*.13,()=>{circle(c,0,0,10,u>i*.5?C.gold:'#386352');text(c,`${i+1}`,0,35,17,C.ink);});
  E(475,185,.2,()=>clock(c,0,0,1.1,u*.9));
  text(c,'years to find an answer',480,345,22,C.gold);break;
 case 'family':
  E(475,230,0,()=>home(c,0,0,2.05));
  E(377,258,.2,()=>person(c,0,0,1.25,C.gold,Math.sin(u)*2));
  E(567,287,.4,()=>person(c,0,0,.8,C.mint,-Math.sin(u)*2));
  E(470,150,.7,()=>heart(c,0,0,1.1));tag(c,'the next generation',480,367);break;
 case 'control':
  E(480,221,0,()=>{chip(c,0,0,1.4);text(c,'?',0,-84,32,C.gold);});
  [[264,213],[703,213],[480,342]].forEach(([x,y],i)=>{flow(c,[480,220],[x,y],u+i,C.gold);E(x,y,.35+i*.15,()=>person(c,0,0,.85,i%2?C.blue:C.gold));});
  tag(c,'public',264,305);tag(c,'oversight',703,305);break;
 case 'infrastructure':
  E(473,211,0,()=>server(c,0,0,1.55));
  E(248,260,.2,()=>home(c,0,0,1.25));E(706,260,.4,()=>home(c,0,0,1.25));
  flow(c,[410,248],[306,262],u,C.blue);flow(c,[534,248],[650,262],u,C.gold);
  E(720,142,.6,()=>{circle(c,0,0,30,C.gold);text(c,'$',0,9,29,C.bg);});
  tag(c,'data center',480,354);tag(c,'local community',246,354);break;
 case 'compass':
  E(480,225,0,()=>{circle(c,0,0,104,'#214e44');c.strokeStyle=C.gold;c.lineWidth=3;c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;line(c,[[Math.cos(a)*82,Math.sin(a)*82],[Math.cos(a)*94,Math.sin(a)*94]],C.gold,2);}c.rotate(-.5+.7*ease(u/4));c.beginPath();c.moveTo(0,-72);c.lineTo(20,20);c.lineTo(0,9);c.lineTo(-20,20);c.closePath();c.fillStyle=C.mint;c.fill();});
  tag(c,'purpose',480,365);text(c,'?',680,237,74,C.gold);break;
 case 'thinking':
  E(310,257,0,()=>person(c,0,0,1.6,C.gold));
  E(500,233,.2,()=>{chip(c,0,0,.9,'?');});
  for(let i=0;i<5;i++){const a=(i-2)*.54;const x=660+Math.cos(a)*85,y=224+Math.sin(a)*108;
   c.save();c.globalAlpha=ease((u-.4-i*.22)/1.1);flow(c,[545,230],[x,y],u+i,C.mint,1);circle(c,x,y,19,[C.mint,C.gold,C.blue][i%3]);c.restore();
  }tag(c,'notice · question · think',600,370);break;
 case 'writing':
  E(292,238,0,()=>page(c,0,0,1.5));E(496,232,.15,()=>chip(c,0,0,.9));
  E(705,238,.45,()=>{page(c,0,0,1.5);const write=ease(u/5);for(let j=0;j<3;j++)line(c,[[-41,25+j*14],[-41+68*clamp(write*3-j),25+j*14]],'#397f69',4);c.save();c.translate(-32+74*write,25+Math.floor(write*2.9)*14);c.rotate(.5);box(c,-5,-70,12,78,3,C.gold);c.beginPath();c.moveTo(-5,8);c.lineTo(7,8);c.lineTo(1,19);c.closePath();c.fillStyle=C.ink;c.fill();c.restore();});
  flow(c,[351,228],[450,228],u,C.gold);flow(c,[540,228],[645,228],u,C.mint);
  for(let i=0;i<3;i++)E(410+i*80,129,.4+i*.3,()=>star(c,0,0,12,C.gold));
  tag(c,'the writer',293,365);tag(c,'ideas together?',700,365);break;
 case 'work':
  E(280,257,0,()=>person(c,0,0,1.5,C.gold));E(677,237,.3,()=>chip(c,0,0,1.7));
  for(let i=0;i<3;i++){E(439+i*28,178+i*46,.5+i*.15,()=>{page(c,0,0,.55);});}
  tag(c,'human',280,365);tag(c,'which tasks?',679,365);break;
 case 'research':
  E(320,257,0,()=>person(c,0,0,1.4,C.gold));
  E(558,222,.25,()=>{c.save();c.rotate(-.35);box(c,-70,-22,140,44,9,C.blue);box(c,60,-30,22,60,8,C.gold);c.restore();line(c,[[0,25],[-45,91]],C.blue,6);line(c,[[0,25],[45,91]],C.blue,6);});
  E(729,123,.7,()=>{star(c,0,0,28,C.gold);});
  c.save();c.globalAlpha=.4+.3*Math.sin(u);circle(c,731,123,45,'#305450');c.restore();star(c,731,123,20,C.gold);
  tag(c,'physics',570,359);tag(c,'future research?',307,359);break;
 case 'tasks':
  E(290,218,0,()=>chip(c,0,0,1.5));
  E(530,225,.2,()=>{page(c,0,0,1.5);for(let i=0;i<3;i++){const a=clamp((u-i*.7)/.5);if(a>0){c.save();c.globalAlpha=a;line(c,[[28,-21+i*21],[35,-14+i*21],[48,-30+i*21]],'#27856b',4);c.restore();}}});
  flow(c,[350,225],[465,225],u);E(740,255,.65,()=>person(c,0,0,1.2,C.gold));
  tag(c,'repetitive tasks',476,367);tag(c,'time back?',743,367);break;
 case 'growing':
  line(c,[[190,323],[764,323]],'#3b6759',3);
  [0,1,2].forEach(i=>E(275+i*206,274,i*.3,()=>{person(c,0,0,.72+i*.2,[C.gold,C.mint,C.blue][i]);}));
  E(481,125,.6,()=>chip(c,0,0,.65));tag(c,'a world with AI',480,381);break;
 case 'creativity':
  E(270,268,0,()=>person(c,0,0,1.1,C.gold));
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const spread=1-ease(u/4);const x=577+Math.cos(a)*(95+spread*70),y=214+Math.sin(a)*(71+spread*25);
   E(x,y,i*.11,()=>{c.rotate(a*.2*(1-spread));if(i%2)star(c,0,0,30,[C.gold,C.blue,C.mint][i%3]);else box(c,-24,-24,48,48,8,[C.mint,C.rose,C.gold][i%3]);});
  }E(576,215,.6,()=>star(c,0,0,47,C.gold));tag(c,'imagine · create',578,365);break;
 case 'time':
  E(288,220,0,()=>clock(c,0,0,1.6,u*.55));
  E(548,258,.4,()=>person(c,0,0,1.25,C.gold));E(680,290,.6,()=>person(c,0,0,.8,C.mint));E(760,290,.7,()=>person(c,0,0,.8,C.blue));
  flow(c,[375,220],[482,239],u,C.gold);E(672,147,.9,()=>heart(c,0,0,.8));tag(c,'time together',661,367);break;
 case 'isolation':
  [275,480,685].forEach((x,i)=>E(x,237,i*.16,()=>{circle(c,0,-15,73,'#204948');person(c,0,0,.8,[C.gold,C.mint,C.blue][i]);c.strokeStyle='#668276';c.lineWidth=2;c.beginPath();c.arc(0,-15,87,0,Math.PI*2);c.stroke();}));
  tag(c,'separate lives',480,365);break;
 case 'empathy':
 case 'connection':{
  const gap=kind==='connection'?110+80*(1-ease(u/4)):150;
  E(480-gap,267,0,()=>person(c,0,0,1.4,C.gold,8*ease(u/3)));
  E(480+gap,267,.2,()=>person(c,0,0,1.4,C.mint,-8*ease(u/3)));
  c.save();c.globalAlpha=ease((u-.5)/1.5);flow(c,[480-gap+52,212],[480+gap-52,212],u,C.rose,2);heart(c,480,208,1.3+.06*Math.sin(u*2));c.restore();
  tag(c,kind==='connection'?'closer to one another':'understanding each other',480,370);break;
 }
 case 'access':
  line(c,[[185,310],[775,310]],C.mint,5);
  [280,480,680].forEach((x,i)=>E(x,256,i*.25,()=>{person(c,0,0,1.0,[C.gold,C.mint,C.blue][i]);if(i===0){c.strokeStyle=C.gold;c.lineWidth=4;c.beginPath();c.arc(-7,34,25,0,Math.PI*2);c.stroke();}if(i===2)line(c,[[38,-6],[40,54]],C.blue,4);}));
  E(480,114,.7,()=>{chip(c,0,0,.5);});tag(c,'equal access',480,375);break;
 case 'environment':
  E(305,224,0,()=>server(c,0,0,1.5));E(700,260,.35,()=>home(c,0,0,1.4));
  for(let i=0;i<3;i++)E(448+i*47,185+i*26,.4+i*.12,()=>{circle(c,0,0,16,C.rose);text(c,'!',0,6,20,C.bg);});
  flow(c,[365,251],[634,268],u,C.rose,2);tag(c,'environmental impact',480,365);break;
 case 'balance':{
  const tilt=.13*Math.sin(u*.8)*(1-ease(u/7));
  E(480,240,0,()=>{line(c,[[0,-45],[0,97],[-65,97],[65,97]],C.gold,6);c.rotate(tilt);line(c,[[-193,-40],[193,-40]],C.gold,6);line(c,[[-150,-40],[-150,31]],C.gold,2);line(c,[[150,-40],[150,31]],C.gold,2);box(c,-203,31,106,12,5,C.gold);box(c,97,31,106,12,5,C.gold);chip(c,-150,-17,.65);home(c,150,-10,.7);});
  tag(c,'technology + community',480,388);break;
 }
 case 'nature':
  E(370,243,0,()=>server(c,0,0,1.4));
  E(590,250,.2,()=>{line(c,[[0,69],[0,-66]],C.mint,6);for(let i=0;i<4;i++){const s=ease((u-.7-i*.4)/1.3);c.save();c.translate(i%2?23:-23,28-i*27);c.rotate(i%2?.45:-.7);leaf(c,0,0,.6*s);c.restore();}});
  E(699,157,.7,()=>text(c,'?',0,0,57,C.gold));tag(c,'help instead of harm?',480,377);break;
 case 'independence':
  E(275,279,0,()=>person(c,0,0,.9,C.gold));E(484,250,.4,()=>person(c,0,0,1.4,C.gold));
  flow(c,[321,247],[426,247],u,C.gold);E(716,227,.7,()=>home(c,0,0,1.6));
  flow(c,[545,242],[639,242],u,C.mint);tag(c,'growing up',280,375);tag(c,'independent life?',716,375);break;
 case 'path':
  E(250,273,0,()=>person(c,0,0,1.2,C.gold));
  line(c,[[306,260],[430,260],[512,207],[638,207]],'#55796b',7);
  for(let i=0;i<3;i++)flow(c,[[320,260],[435,256],[519,207]][i],[[428,260],[510,209],[638,207]][i],u+i,C.mint,1);
  E(729,233,.4,()=>home(c,0,0,1.35));E(486,315,.65,()=>chip(c,0,0,.55));
  tag(c,'support along the way',480,393);break;
 case 'support':
  E(480,229,0,()=>person(c,0,0,1.45,C.gold));
  [[264,206],[688,206],[480,119]].forEach(([x,y],i)=>{flow(c,[480,235],[x,y],u+i,C.mint,1);E(x,y,.3+i*.2,()=>i===0?page(c,0,0,.8):i===1?home(c,0,0,.85):heart(c,0,0,.7));});
  tag(c,'teacher',261,335);tag(c,'parent',689,335);tag(c,'everyday support?',480,387);break;
 }
}

export function drawMotion(c,data,time,{width=960,height=430,reduced=false,captions=false,poster=false}={}){
 const scene=sceneAt(data,time),index=data.scenes.indexOf(scene),u=Math.max(0,time-scene.start);
 c.save();c.scale(width/960,height/(captions?540:430));
 const g=c.createLinearGradient(0,0,960,430);g.addColorStop(0,'#082d30');g.addColorStop(1,'#174638');c.fillStyle=g;c.fillRect(0,0,960,540);
 // Stable studio space and a restrained depth field; text never drifts.
 const glow=c.createRadialGradient(480,220,20,480,220,400);glow.addColorStop(0,'#39766545');glow.addColorStop(1,'#39766500');c.fillStyle=glow;c.fillRect(0,0,960,430);
 for(let i=0;i<26;i++){const x=64+(i*137)%840,y=96+(i*79)%283;c.globalAlpha=.12;circle(c,x,y,1.2,COLORS.mint);}c.globalAlpha=1;
 text(c,`${data.name.toUpperCase()} / A QUESTION ABOUT AI`,38,35,12,'#b4cec0','left',600);
 text(c,scene.title,38,75,29,COLORS.ink,'left',600);
 text(c,`${String(index+1).padStart(2,'0')} / ${String(data.scenes.length).padStart(2,'0')}`,920,37,13,COLORS.gold,'right');
 c.save();c.beginPath();c.rect(0,88,960,328);c.clip();
 // A grounded stage and a gentle camera approach give the objects depth.
 c.fillStyle='#011f252b';c.beginPath();c.ellipse(480,329,314,25,0,0,Math.PI*2);c.fill();
 c.strokeStyle='#70af9120';c.lineWidth=1;c.beginPath();c.ellipse(480,330,359,41,0,0,Math.PI*2);c.stroke();
 const zoom=reduced?1:1+.055*ease(u/(scene.end-scene.start));c.translate(480,240);c.scale(zoom,zoom);c.translate(-480,-240);
 // Genuine composition transitions: outgoing objects fade as the incoming world assembles.
 if(index>0&&u<.55&&!reduced){c.save();c.globalAlpha=(1-u/.55)*.5;composition(c,data.scenes[index-1].kind,10,1,time);c.restore();}
 composition(c,scene.kind,reduced?6:poster?2.5:u,clamp(u/(scene.end-scene.start)),reduced?0:time);c.restore();
 for(let i=0;i<data.scenes.length;i++)box(c,38+i*66,410,54,3,1,i<=index?COLORS.mint:'#456b5a');
 text(c,'Illustrating their question',922,414,11,'#a3bfb0','right');
 if(captions){
  c.fillStyle='#062725';c.fillRect(0,430,960,110);
  const {cue}=cueAt(data,time);c.font='600 28px Arial';
  const rows=[[]];let size=0;
  for(let i=cue.first;i<=cue.last;i++){const w=data.words[i],sw=c.measureText(w.w+' ').width;if(size+sw>870){rows.push([]);size=0;}rows.at(-1).push({w,sw,i});size+=sw;}
  const positions=[];
  rows.forEach((row,r)=>{let x=(960-row.reduce((a,v)=>a+v.sw,0))/2;const y=rows.length===1?494:477+r*39;
   row.forEach(({w,sw,i})=>{positions.push({w,i,x,y,width:sw+1});x+=sw;});
  });
  const follow=followerAt(data,time),now=positions.find(w=>w.i===follow.index);
  let glide;
  if(now&&follow.active){
   const previous=positions.find(w=>w.i===follow.index-1)||now;
   const p=ease((time-now.w.s)/.18);
   glide={x:previous.x+(now.x-previous.x)*p,y:previous.y+(now.y-previous.y)*p,width:previous.width+(now.width-previous.width)*p};
   box(c,glide.x-4,glide.y-29,glide.width,36,6,COLORS.gold);
  }
  positions.forEach(({w,i,x,y})=>{c.textAlign='left';c.fillStyle=time>=w.s?COLORS.ink:'#a6c3b5';c.fillText(w.w,x,y);});
  // Clip a dark copy of the letters to the single moving highlight.
  if(glide){c.save();c.beginPath();c.roundRect(glide.x-4,glide.y-29,glide.width,36,6);c.clip();positions.forEach(({w,x,y})=>{c.fillStyle=COLORS.bg;c.fillText(w.w,x,y);});c.restore();}
 }
 c.restore();return {scene,index,cue:cueAt(data,time),word:wordAt(data,time)};
}
