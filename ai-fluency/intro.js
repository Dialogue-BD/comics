/* The four Ds — the onboarding film, built from the app's own gears.
 *
 * One 1920×1080 stage. The four D gears are the same 12-tooth gears as the
 * coach's compass (compass.js), machined large, on a dark green stage lit like
 * a watch movement. A camera moves over one continuous mechanism, so the film
 * reads as one take: a lone AI gear that moves nothing → four gears seat →
 * loop 1 (the big decisions) → loop 2 (the conversation) → the gears mesh and
 * turn → the sweet spot, with you at the centre → an example → the close.
 *
 * Timing follows the narration. Every caption is one recorded line
 * (audio/<key>.mp3, cut by tools/split_takes.py, durations in the manifest);
 * every movement is written against a line: "@2+.4" = 0.4 s after line 2
 * starts, "@end-1" = 1 s before the scene ends. So re-recording a line
 * re-times the film by itself. Before a line is recorded, its length is
 * estimated from its words and the browser voice reads it.
 *
 * Every animation is a Web Animation, so the film is a pure function of
 * (scene, t): the player runs it live, and INTRO.seek(i,t) renders any frame.
 */
(function(){
'use strict';
const W=1920,H=1080, CX=960, CY=470, K=4.4;
const R=36*K, A=5.5*K, RR=R+A, DIST=36*Math.SQRT2*K, NT=12, TD=360/NT, PAD=34;
const POS={del:[CX,CY-DIST],dis:[CX+DIST,CY],dil:[CX,CY+DIST],des:[CX-DIST,CY]};
const PH={del:0,dis:TD/2,dil:0,des:TD/2}, SPIN={del:1,dil:1,dis:-1,des:-1};
const COL={del:['#8A5610','#D29A45','#4E2F06'],des:['#0A6A62','#38B2A3','#043B36'],dis:['#3F4FA8','#8395E2','#222B68'],dil:['#A8322A','#E2706A','#621510']};
const NAME={del:['Delegation','Plan'],des:['Description','Say it'],dis:['Discernment','Judge it'],dil:['Diligence','Be responsible']};
const ICON={
 del:'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',
 des:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
 dis:'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
 dil:'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
 ai:'M12 2c.4 4.9 5.1 9.6 10 10-4.9.4-9.6 5.1-10 10-.4-4.9-5.1-9.6-10-10 4.9-.4 9.6-5.1 10-10z',
 you:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z'};
const svgI=(d,col)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[d]}" fill="${col||'currentColor'}"/></svg>`;

/* ---------- the gear, machined: teeth + six lightening holes, as a mask ---------- */
const GEAR_MASK=(()=>{
  const rad=a=>a*Math.PI/180, pt=(r,a)=>`${(RR+r*Math.cos(rad(a))).toFixed(1)} ${(RR+r*Math.sin(rad(a))).toFixed(1)}`;
  const p=[]; for(let k=0;k<NT;k++){const c=k*TD;
    p.push(`${k?'L':'M'}${pt(R-A,c-.36*TD)}`,`L${pt(R+A,c-.17*TD)}`,`A${R+A} ${R+A} 0 0 1 ${pt(R+A,c+.17*TD)}`,`L${pt(R-A,c+.36*TD)}`,`A${R-A} ${R-A} 0 0 1 ${pt(R-A,c+.64*TD)}`)}
  let d=p.join('')+'Z';
  for(let k=0;k<6;k++){const a=k*60+30, r=R*.135, cx=RR+R*.575*Math.cos(rad(a)), cy=RR+R*.575*Math.sin(rad(a));
    d+=`M${(cx-r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2*r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2*r).toFixed(1)} 0Z`}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${2*RR} ${2*RR}"><path fill-rule="evenodd" fill="#000" d="${d}"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
})();

/* ---------- scene pieces (world coordinates) ---------- */
const gear=(d,a='')=>{const [x,y]=d==='ai'?[CX,CY]:POS[d]; const c=COL[d]||[];
  return `<div class="gear g-${d}" id="g-${d}" style="left:${x-RR}px;top:${y-RR}px;--c:${c[0]};--cl:${c[1]};--cd:${c[2]}" ${a}>
   <div class="gsh"></div><div class="grot" data-rot="${d}"><div class="gbody"></div></div><div class="gsheen"></div>
   <div class="ghub">${svgI(d)}</div></div>`};
const plateXY={del:[CX-RR-40,CY-DIST-70,'r'],dis:[CX+RR+40,CY-DIST-70,'l'],des:[CX-RR-40,CY+DIST+10,'r'],dil:[CX+RR+40,CY+DIST+10,'l']};
const plate=(d,a='')=>{const [x,y,al]=plateXY[d];
  return `<div class="plate pl-${al}" style="${al==='r'?`right:${W-x}px`:`left:${x}px`};top:${y}px;--c:${COL[d][1]}" ${a}><b>${NAME[d][0]}</b><span>${NAME[d][1]}</span></div>`};
/* a gear with its name plate, wrapped so both dim together */
const unit=(d,ga='',pa='',wa='')=>`<div class="unit u-${d}" ${wa}>${gear(d,ga)}${pa===null?'':plate(d,pa)}</div>`;
const sockets=a=>`<div class="sockets" ${a}>${['del','dis','dil','des'].map(d=>`<i style="left:${POS[d][0]-RR}px;top:${POS[d][1]-RR}px"></i>`).join('')}</div>`;
const stad=(x,y,w,h)=>{ if(h>w){const r=w/2;return `M${x} ${y+r} A${r} ${r} 0 0 1 ${x+w} ${y+r} V${y+h-r} A${r} ${r} 0 0 1 ${x} ${y+h-r} Z`} const r=h/2;return `M${x+r} ${y} H${x+w-r} A${r} ${r} 0 0 1 ${x+w-r} ${y+h} H${x+r} A${r} ${r} 0 0 1 ${x+r} ${y} Z`};
const TV=stad(CX-RR-PAD,CY-DIST-RR-PAD,2*(RR+PAD),2*(DIST+RR+PAD)), TH=stad(CX-DIST-RR-PAD,CY-RR-PAD,2*(DIST+RR+PAD),2*(RR+PAD));
/* the two loops as tracks: a soft glow, a coloured rail, and light flowing round it */
const tracks=(av,ah)=>`<svg class="trk" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
  <linearGradient id="tgV" x1="0" y1="${CY-DIST-RR}" x2="0" y2="${CY+DIST+RR}" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-color="${COL.del[1]}"/><stop offset=".8" stop-color="${COL.dil[1]}"/></linearGradient>
  <linearGradient id="tgH" x1="${CX-DIST-RR}" y1="0" x2="${CX+DIST+RR}" y2="0" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-color="${COL.des[1]}"/><stop offset=".8" stop-color="${COL.dis[1]}"/></linearGradient>
  <filter id="tglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <g class="tv" ${av||''}><path d="${TV}" pathLength="1" class="tg" stroke="url(#tgV)" filter="url(#tglow)" data-draw/><path d="${TV}" pathLength="1" class="tr" stroke="url(#tgV)" data-draw/><path d="${TV}" pathLength="1" class="tf" data-flow/></g>
  <g class="th" ${ah||''}><path d="${TH}" pathLength="1" class="tg" stroke="url(#tgH)" filter="url(#tglow)" data-draw/><path d="${TH}" pathLength="1" class="tr" stroke="url(#tgH)" data-draw/><path d="${TH}" pathLength="1" class="tf" data-flow/></g></svg>`;
/* screen-space pieces */
const title=(kick,big,a,col,right)=>`<div class="ttl${right?' ttl-r':''}" style="--c:${col||'#D2B978'}" ${a}><small>${kick}</small><b>${big}</b></div>`;
const card=(d,x,y,head,body,a,w)=>`<div class="icard" style="left:${x}px;top:${y}px;--c:${COL[d][1]};${w?`width:${w}px`:''}" ${a}>${head?`<b><i>${svgI(d)}</i>${head}</b>`:''}<span>${body}</span></div>`;
const wire=(pts,col,a)=>`<svg class="wire" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${pts.map(p=>p.join(' ')).join(' L')}" pathLength="1" stroke="${col}" ${a}/><circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="7" fill="${col}" ${a}/></svg>`;
/* where a world point lands on screen for a camera [x,y,s] */
const scr=(p,cam)=>[Math.round(CX+cam[2]*(p[0]-cam[0])),Math.round(CY+cam[2]*(p[1]-cam[1]))];

/* ---------- the film ----------
 * lines: [en, bn] — one recorded line each (the coach's voice)
 * cam:   [[at, dur, x, y, s]] — moves; the camera looks at (x,y) at scale s
 * spin:  [[at, deg/s]] — the four gears' speed, linear between points
 * tick:  [[at, deg, dur]] — the gears click forward
 * sfx:   [[at, 'seat'|'tick'|'clunk']]
 */
const CAM_LOOP1=[1150,CY,.9], CAM_FULL=[CX,CY,.92], CAM_EX=[CX,CY,.8], CAM_END=[1340,CY,.62];
const SCENES=[
{id:'alone', lead:1.2, tail:.8,
 lines:[['Many people use AI.','অনেকেই AI ব্যবহার করে।'],
        ['Fewer people use it well.','ভালোভাবে ব্যবহার করে কম মানুষ।'],
        ['Using AI on its own is like one gear: it spins fast, but it moves nothing.','শুধু AI চালানো একটা একা গিয়ারের মতো: জোরে ঘোরে, কিন্তু কিছুই নড়ায় না।',.9]],
 cam0:[CX,CY,1.32], cam:[['@2+.2',4.2,CX,CY,1]],
 ai:[[0,0],[1.4,170]],
 html:()=>`${sockets('data-a="fade @2+1.4 1.6"')}
  ${gear('ai','data-a="emerge .3 1.6"')}
  <div class="i-spark" style="left:${CX}px;top:${CY}px" data-a="burst .6 1.4"></div>`,
 scr:()=>``},

{id:'four', lead:.6, tail:1.2,
 lines:[['AI fluency has four gears: the four Ds.','AI-তে দক্ষতার চারটা গিয়ার: চারটা D।',.8],
        ['Delegation.','Delegation — দায়িত্ব ভাগ।',.55],['Description.','Description — বর্ণনা।',.55],['Discernment.','Discernment — যাচাই।',.55],['Diligence.','Diligence — সতর্কতা।']],
 cam0:[CX,CY,1], ai:[[0,170]], sfx:[['@1+.6','seat'],['@2+.6','seat'],['@3+.6','seat'],['@4+.6','seat']],
 html:()=>`${sockets('data-a="fadeout @4+1 1"')}${gear('ai','data-a="exit @0+.8 1.8"')}
  ${unit('del','data-a="seat @1 .8"','data-a="plate @1+.5"')}${unit('des','data-a="seat @2 .8"','data-a="plate @2+.5"')}
  ${unit('dis','data-a="seat @3 .8"','data-a="plate @3+.5"')}${unit('dil','data-a="seat @4 .8"','data-a="plate @4+.5"')}
  ${['del','des','dis','dil'].map((d,i)=>`<div class="ripple" style="left:${POS[d][0]}px;top:${POS[d][1]}px;--c:${COL[d][1]}" data-a="ripple @${i+1}+.6 1.1"></div>`).join('')}`,
 scr:()=>``},

{id:'loop1', lead:.8, tail:1.4,
 lines:[['Delegation and Diligence make the first loop: the big decisions.','Delegation আর Diligence মিলে প্রথম চক্র: বড় সিদ্ধান্তগুলো।',.8],
        ['Delegation asks: what is the job, and who does it — me, the AI, or both?','Delegation জিজ্ঞেস করে: কাজটা কী, আর কে করবে — আমি, AI, নাকি দুজনে?',.8],
        ['Diligence asks: is it safe and honest, and who is responsible for the result?','Diligence জিজ্ঞেস করে: এটা কি নিরাপদ আর সৎ, আর ফলাফলের দায় কার?']],
 cam0:[CX,CY,1], cam:[[.2,1.8,...CAM_LOOP1]],
 html:()=>`${tracks('data-a="track .9 1.8"','style="opacity:0"')}
  ${unit('del','','','data-a="flash @1 1.2"')}${unit('dil','','','data-a="flash @2 1.2"')}
  ${unit('des','','','data-a="dim .4 1|undim @end-1.2 1"')}${unit('dis','','','data-a="dim .4 1|undim @end-1.2 1"')}`,
 scr:()=>{const c=CAM_LOOP1, gd=scr(POS.del,c), gl=scr(POS.dil,c), ex=Math.round(RR*c[2]);
  return `${title('Loop 1','The big decisions','data-a="rise .8 .9|fadeout @end-.9 .7"',COL.del[1],1)}
  ${wire([[gd[0]+ex+12,gd[1]],[1250,gd[1]-12]],COL.del[1],'data-a="wire @1+.2 .7|fadeout @end-.9 .7"')}
  ${card('del',1260,gd[1]-62,'Delegation','What is the job?','data-a="slide @1+.5 .8|fadeout @end-.9 .7"',560)}
  ${card('del',1260,gd[1]+56,'','Who does it — me, the AI, or both?','data-a="slide @1+1.9 .8|fadeout @end-.9 .7"',560)}
  ${wire([[gl[0]+ex+12,gl[1]],[1250,gl[1]]],COL.dil[1],'data-a="wire @2+.2 .7|fadeout @end-.9 .7"')}
  ${card('dil',1260,gl[1]-118,'Diligence','Is it safe and honest?','data-a="slide @2+.5 .8|fadeout @end-.9 .7"',560)}
  ${card('dil',1260,gl[1]+6,'','Who is responsible for the result?','data-a="slide @2+2 .8|fadeout @end-.9 .7"',560)}`}},

{id:'loop2', lead:.8, tail:1.4,
 lines:[['Description and Discernment make the second loop: the conversation.','Description আর Discernment মিলে দ্বিতীয় চক্র: কথোপকথন।',.8],
        ['Description: say clearly what you want.','Description: তুমি কী চাও তা স্পষ্ট করে বলো।',.7],
        ['Discernment: judge what comes back.','Discernment: যা ফিরে আসে তা বিচার করো।',.7],
        ['Then say it again, better.','তারপর আবার বলো, আরও ভালো করে।']],
 cam0:CAM_LOOP1, cam:[[.2,1.8,...CAM_FULL]],
 html:()=>{const ty=CY-RR-PAD, by=CY+RR+PAD, x0=CX-DIST, x1=CX+DIST;
  return `${tracks('data-a="tfade .3 1.2 .3"','data-a="track .9 1.8|tfade @end-1.2 1 .3"')}
  ${unit('des','','','data-a="flash @1 1.2"')}${unit('dis','','','data-a="flash @2 1.2"')}
  ${unit('del','','','data-a="dim .4 1|undim @end-1.2 1"')}${unit('dil','','','data-a="dim .4 1|undim @end-1.2 1"')}
  <div class="tok tk-des" style="left:${x0}px;top:${ty}px" data-path="0,0 ${x1-x0},0" data-a="travel @1+.3 2.6|fadeout @2+.2 .5">“Make five questions on chapter three.”</div>
  <div class="tok tk-dis" style="left:${x1}px;top:${by}px" data-path="0,0 ${x0-x1},0" data-a="travel @2+.4 2.6|fadeout @3+.3 .5"><s>Q4</s> wrong — my book says something else</div>
  <div class="tok tk-des tk-ok" style="left:${x0}px;top:${ty}px" data-path="0,0 ${x1-x0},0" data-a="travel @3+.4 2.6|fadeout @end-.7 .5">“Check every answer with my book.” ✓</div>`},
 scr:()=>`${title('Loop 2','The conversation','data-a="rise .8 .9|fadeout @end-.9 .7"',COL.des[1])}`},

{id:'mesh', lead:.6, tail:1.4,
 lines:[['Now look. The gears touch.','এবার দেখো। গিয়ারগুলো একটা আরেকটাকে ছুঁয়ে আছে।',.7],
        ['When one gear turns, all four turn.','একটা গিয়ার ঘুরলে চারটাই ঘোরে।',.9],
        ['The big decisions shape the conversation, and the conversation changes the decisions.','বড় সিদ্ধান্তগুলো কথোপকথনকে গড়ে, আর কথোপকথন সিদ্ধান্তগুলোকে বদলায়।']],
 cam0:CAM_FULL, cam:[['@1',4,CX,CY,1.0]],
 spin:[[0,0],['@1+.25',0],['@1+1.6',34]], sfx:[['@1+.2','clunk']],
 html:()=>`${tracks('style="opacity:.3" data-a="tfade @2 .8 .95|tfade @end-1.2 1 0"','style="opacity:.3" data-a="tfade @2+1.8 .8 .95|tfade @end-1.2 1 0"')}
  ${['del','des','dis','dil'].map(d=>unit(d)).join('')}
  <div class="mesh" style="left:${CX}px;top:${CY}px" data-a="fade @0+.4 .8|fadeout @1+1.4 .8">${['del','dis','dil','des'].map((d,i)=>{const a=45+90*i;return `<i style="transform:rotate(${a}deg) translateX(${DIST/Math.SQRT2}px)"></i>`}).join('')}</div>
  <div class="push" style="left:${POS.des[0]}px;top:${POS.des[1]}px" data-a="push @1-.1 1.2"></div>
  ${['del','des','dis','dil'].map(d=>`<div class="turn t-${d}" style="left:${POS[d][0]}px;top:${POS[d][1]}px;--c:${COL[d][1]};transform:translate(-50%,-50%) rotate(${{del:0,dis:90,dil:180,des:270}[d]}deg)" data-a="fade @1+1.6 .8|fadeout @end-.8 .6"><svg viewBox="-100 -100 200 200"><path d="M${SPIN[d]>0?'-70 -70 A99 99 0 0 1 70 -70':'70 -70 A99 99 0 0 0 -70 -70'}" /><path d="M${SPIN[d]>0?'70 -70 l-26 -4 l10 24':'-70 -70 l26 -4 l-10 24'}" class="hd"/></svg></div>`).join('')}`,
 scr:()=>``},

{id:'sweet', lead:.6, tail:1.6,
 lines:[['Where the four gears meet is the sweet spot: AI fluency.','যেখানে চারটা গিয়ার মেলে, সেটাই সেরা জায়গা: AI-তে দক্ষতা।',.8],
        ['Working with AI in a way that is effective, efficient, ethical and safe.','AI-এর সাথে এমনভাবে কাজ করা যা কার্যকর, দ্রুত, নৈতিক আর নিরাপদ।',.9],
        ['And in the middle is you: the human in the loop.','আর মাঝখানে তুমি: চক্রের মানুষটি।']],
 cam0:[CX,CY,1.0], cam:[[.3,2.4,CX,CY,2.3]],
 spin:[[0,34],[3,10]],
 html:()=>`${['del','des','dis','dil'].map(d=>unit(d,'','data-a="fadeout .2 .8"','data-a="dimmer @0+1.8 1.2"')).join('')}
  <div class="halo" style="left:${CX}px;top:${CY}px" data-a="bloom @0+1.6 2"></div>
  <svg class="ringtxt" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><path id="rpt" d="M${CX-118} ${CY} A118 118 0 0 1 ${CX+118} ${CY}"/><path id="rpb" d="M${CX-137} ${CY} A137 137 0 0 0 ${CX+137} ${CY}"/></defs>
   <circle cx="${CX}" cy="${CY}" r="96" class="rline" pathLength="1" data-a="draw @1 1.6"/><circle cx="${CX}" cy="${CY}" r="160" class="rline" pathLength="1" data-a="draw @1+.3 1.6"/>
   ${[['effective','rpt',27],['efficient','rpt',73],['ethical','rpb',73],['safe','rpb',27]].map(([w,id,o],i)=>`<text data-a="fade @1+${(.7+i*.85).toFixed(2)} .7"><textPath href="#${id}" startOffset="${o}%" text-anchor="middle">${w}</textPath></text>`).join('')}</svg>
  <div class="medal" style="left:${CX}px;top:${CY}px" data-a="pop @0+1.4 1"><span class="m-ai" data-a="fadeout @2 .6">AI<br>fluency</span><span class="m-you" data-a="popin @2+.2 .9">${svgI('you')}</span></div>`,
 scr:()=>`${title('The sweet spot','AI fluency','data-a="rise @0+1.6 .9|fadeout @2 .7"','#D2B978')}
  ${title('At the centre','You, the human in the loop','data-a="rise @2+.8 .9|fadeout @end-.6 .5"','#D2B978')}`},

{id:'example', lead:.8, tail:1.6,
 lines:[['For example: studying for an exam.','উদাহরণ: পরীক্ষার পড়া।',.7],
        ['Delegation: the AI makes practice questions. You answer them.','Delegation: AI অনুশীলনের প্রশ্ন বানায়। উত্তর দাও তুমি।',.7],
        ['Description: “Give me five questions on chapter three.”','Description: “আমাকে তৃতীয় অধ্যায় থেকে পাঁচটা প্রশ্ন দাও।”',.7],
        ['Discernment: question four is wrong. My book says something different.','Discernment: চার নম্বর প্রশ্নটা ভুল। আমার বইতে অন্য কথা লেখা।',.7],
        ['Diligence: no AI in the real exam.','Diligence: আসল পরীক্ষায় কোনো AI নয়।']],
 cam0:[CX,CY,2.3], cam:[[0,2.2,...CAM_EX]],
 spin:[[0,10],[1.5,4]], tick:[['@1',30,.5],['@2',30,.5],['@3',30,.5],['@4',30,.5]], sfx:[['@1','tick'],['@2','tick'],['@3','tick'],['@4','tick']],
 html:()=>`${tracks('style="opacity:0" data-a="tfade 1.4 1 .22"','style="opacity:0" data-a="tfade 1.4 1 .22"')}
  ${['del','des','dis','dil'].map((d,i)=>unit(d,'',null,`data-a="undim 0 1.6|flash @${i+1} 1.2"`)).join('')}`,
 scr:()=>{const c=CAM_EX, ex=Math.round(RR*c[2]), g={};['del','des','dis','dil'].forEach(d=>g[d]=scr(POS[d],c));
  const L=70, Rx=1330, w=520;
  return `${title('For example','Studying for an exam','data-a="rise @0 .9|fadeout @end-.9 .7"','#D2B978')}
  ${wire([[g.del[0]-ex*.72,g.del[1]-ex*.72],[L+w+14,300]],COL.del[1],'data-a="wire @1+.1 .6|fadeout @end-.9 .7"')}${card('del',L,240,'Delegation','The AI makes practice questions. I answer them.','data-a="slide @1+.2 .8|fadeout @end-.9 .7"',w)}
  ${wire([[g.des[0]-ex-12,g.des[1]+30],[L+w+14,g.des[1]+100]],COL.des[1],'data-a="wire @2+.1 .6|fadeout @end-.9 .7"')}${card('des',L,g.des[1]+50,'Description','“Give me five questions on chapter three.”','data-a="slide @2+.2 .8|fadeout @end-.9 .7"',w)}
  ${wire([[g.dis[0]+ex*.72,g.dis[1]-ex*.72],[Rx-14,300]],COL.dis[1],'data-a="wire @3+.1 .6|fadeout @end-.9 .7"')}${card('dis',Rx,240,'Discernment','Question 4 is wrong. My book says something different.','data-a="slideR @3+.2 .8|fadeout @end-.9 .7"',w)}
  ${wire([[g.dil[0]+ex*.72,g.dil[1]+ex*.72],[Rx-14,g.des[1]+100]],COL.dil[1],'data-a="wire @4+.1 .6|fadeout @end-.9 .7"')}${card('dil',Rx,g.des[1]+50,'Diligence','No AI in the real exam.','data-a="slideR @4+.2 .8|fadeout @end-.9 .7"',w)}`}},

{id:'close', lead:.6, tail:3.2,
 lines:[['Four gears. Two loops. One sweet spot.','চারটা গিয়ার। দুটো চক্র। একটা সেরা জায়গা।',.9],
        ['Now let’s watch the gears turn on Ayesha’s phone.','চলো, এবার আয়েশার ফোনে গিয়ারগুলো ঘুরতে দেখি।']],
 cam0:CAM_EX, cam:[[.2,2.4,...CAM_END]],
 spin:[[0,4],[2,14]],
 html:()=>`${tracks('style="opacity:.22" data-a="tfade @0+.6 1.6 .5"','style="opacity:.22" data-a="tfade @0+.6 1.6 .5"')}
  ${['del','des','dis','dil'].map(d=>unit(d,'',null)).join('')}
  <div class="medal sm" style="left:${CX}px;top:${CY}px" data-a="pop @0+.4 .9"><span class="m-you">${svgI('you')}</span></div>`,
 scr:()=>`<div class="i-lock" data-a="rise .8 1.1"><small>AI Fluency Lab</small><b>The four Ds</b>
   <ul><li data-a="rise @0+.1 .7">Four gears.</li><li data-a="rise @0+1.1 .7">Two loops.</li><li data-a="rise @0+2.1 .7">One sweet spot.</li></ul></div>`}
];
const LINES=SCENES.flatMap(s=>s.lines.map(l=>l[0]));

/* ---------- timing: from the recordings, or estimated ---------- */
let DUR={};          // audio key -> seconds, from audio/manifest.json
const keyOf=t=>window.AFL&&AFL.audioKey?AFL.audioKey(t):null;
const lineDur=t=>{const k=keyOf(t); if(k&&DUR[k]) return DUR[k]; return .35+t.replace(/[“”".,:;—-]/g,' ').split(/\s+/).filter(Boolean).length/2.35;};
const has=t=>{const k=keyOf(t); return !!(k&&DUR[k]);};
function plan(){
  let ang=0, ai=0, cam=SCENES[0].cam0;
  SCENES.forEach((sc,si)=>{
    sc._t=[]; let t=sc.lead||.8;
    sc.lines.forEach((l,i)=>{ sc._t[i]=t; sc._d=sc._d||[]; sc._d[i]=lineDur(l[0]); t+=sc._d[i]+(l[2]!=null?l[2]:.6); });
    sc._dur=+(t-(sc.lines[sc.lines.length-1][2]!=null?sc.lines[sc.lines.length-1][2]:.6)+(sc.tail||1.2)).toFixed(2);
    sc._cam0=sc.cam0||cam; cam=(sc.cam&&sc.cam.length)?sc.cam[sc.cam.length-1].slice(2):sc._cam0;
    sc._ang0=ang; const tab=angleTable(sc,sc.spin,sc.tick,ang); sc._ang=tab; ang=tab[tab.length-1];
    sc._ai0=ai; if(sc.ai){const t2=angleTable(sc,sc.ai,null,ai); sc._aiang=t2; ai=t2[t2.length-1];}
  });
}
/* "@2+.4" → seconds into the scene */
function T(sc,v){ if(typeof v==='number') return v; v=String(v).trim(); if(!v.startsWith('@')) return +v;
  const m=v.match(/^@(end|\d+)([+-][\d.]+)?$/); if(!m) return 0; const base=m[1]==='end'?sc._dur:sc._t[+m[1]]; return Math.max(0,base+(m[2]?+m[2]:0)); }
const STEP=.05;
function angleTable(sc,spin,tick,a0){
  const n=Math.ceil(sc._dur/STEP)+1, out=new Float64Array(n); const sp=(spin||[[0,0]]).map(([t,v])=>[T(sc,t),v]);
  const speed=t=>{ if(t<=sp[0][0]) return sp[0][1]; for(let i=1;i<sp.length;i++){ if(t<=sp[i][0]){const [t0,v0]=sp[i-1],[t1,v1]=sp[i]; return t1===t0?v1:v0+(v1-v0)*(t-t0)/(t1-t0);} } return sp[sp.length-1][1]; };
  const tk=(tick||[]).map(([t,d,du])=>[T(sc,t),d,du]); const ease=x=>x<=0?0:x>=1?1:1-Math.pow(1-x,3);
  let a=a0; for(let i=0;i<n;i++){ const t=i*STEP; if(i) a+=speed(t-STEP/2)*STEP; let r=0; tk.forEach(([t0,d,du])=>{r+=d*Math.min(1,Math.max(0,ease((t-t0)/du)))}); out[i]=a+r; }
  // ticks stay added after they finish: fold the total into the last value so the next scene starts there
  return out;
}

/* ---------- motion ---------- */
const E='cubic-bezier(.22,.8,.18,1)', EIO='cubic-bezier(.65,0,.25,1)';
function anim(el,spec,sc,first=true){ const FILL=first?'both':'forwards';
  const parts=spec.trim().split(/\s+/); const name=parts[0]; const t0=T(sc,parts[1]||0)*1000; let d=(parts[2]?+parts[2]:.7)*1000; let kf, ease=E;
  switch(name){
   case 'fade':kf=[{opacity:0},{opacity:1}];break;
   case 'fadeout':kf=[{opacity:1},{opacity:0}];break;
   case 'rise':kf=[{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'none'}];break;
   case 'slide':kf=[{opacity:0,transform:'translateX(-60px)'},{opacity:1,transform:'none'}];break;
   case 'slideR':kf=[{opacity:0,transform:'translateX(60px)'},{opacity:1,transform:'none'}];break;
   case 'pop':kf=[{opacity:0,transform:'translate(-50%,-50%) scale(.4)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.08)',offset:.65},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}];break;
   case 'popin':kf=[{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'scale(1.1)',offset:.65},{opacity:1,transform:'scale(1)'}];break;
   case 'emerge':kf=[{opacity:0,transform:'scale(.55)',filter:'blur(14px)'},{opacity:1,transform:'scale(1)',filter:'blur(0)'}];break;
   case 'exit':kf=[{opacity:1,transform:'none'},{opacity:0,transform:'translate(-760px,120px) scale(.45)'}];ease=EIO;break;
   case 'seat':kf=[{opacity:0,transform:'translateY(-300px) scale(1.12)'},{opacity:1,transform:'translateY(10px) scale(1)',offset:.72},{opacity:1,transform:'translateY(-3px)',offset:.86},{opacity:1,transform:'none'}];ease='cubic-bezier(.5,0,.75,0)';
     return el.animate(kf,{duration:d,delay:t0,easing:'linear',fill:FILL});
   case 'plate':kf=[{opacity:0,transform:'translateY(14px)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'blur(0)'}];break;
   case 'ripple':kf=[{opacity:0,transform:'translate(-50%,-50%) scale(.85)'},{opacity:.9,transform:'translate(-50%,-50%) scale(.95)',offset:.1},{opacity:0,transform:'translate(-50%,-50%) scale(1.45)'}];ease='cubic-bezier(.1,.6,.3,1)';break;
   case 'burst':kf=[{opacity:0,transform:'translate(-50%,-50%) scale(.2)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.25},{opacity:0,transform:'translate(-50%,-50%) scale(1.9)'}];ease='ease-out';break;
   case 'dim':kf=[{opacity:1,filter:'saturate(1) brightness(1)'},{opacity:.28,filter:'saturate(.35) brightness(.8)'}];break;
   case 'undim':kf=[{opacity:.28,filter:'saturate(.35) brightness(.8)'},{opacity:1,filter:'saturate(1) brightness(1)'}];break;
   case 'dimmer':kf=[{opacity:1,filter:'brightness(1)'},{opacity:.3,filter:'brightness(.7)'}];break;
   case 'flash':kf=[{filter:'brightness(1) drop-shadow(0 0 0 rgba(242,214,140,0))'},{filter:'brightness(1.35) drop-shadow(0 0 40px rgba(242,214,140,.55))',offset:.3},{filter:'brightness(1) drop-shadow(0 0 0 rgba(242,214,140,0))'}];ease='ease-out';break;
   case 'bloom':kf=[{opacity:0,transform:'translate(-50%,-50%) scale(.3)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}];break;
   case 'push':kf=[{opacity:0,transform:'translate(-50%,-50%) scale(1.6)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.35},{opacity:0,transform:'translate(-50%,-50%) scale(.9)'}];ease='ease-out';break;
   case 'wire':kf=[{strokeDashoffset:1,opacity:1},{strokeDashoffset:0,opacity:1}];el.style.strokeDasharray=1;break;
   case 'draw':kf=[{strokeDashoffset:1},{strokeDashoffset:0}];el.style.strokeDasharray=1;break;
   case 'track':{ const out=[]; el.querySelectorAll('[data-draw]').forEach(p=>{p.style.strokeDasharray=1; out.push(p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:d,delay:t0,easing:EIO,fill:'both'}))});
     el.querySelectorAll('[data-flow]').forEach(p=>out.push(p.animate([{opacity:0},{opacity:1}],{duration:600,delay:t0+d,fill:'both'})));
     return out; }
   case 'tfade':{ const to=+(parts[3]||.3); kf=[{opacity:+(getComputedStyle(el).opacity||1)},{opacity:to}]; break; }
   case 'travel':{ const p=(el.dataset.path||'0,0').split(/\s+/).map(s=>s.split(',').map(Number)); kf=p.map((q,i)=>({transform:`translate(${q[0]}px,${q[1]}px) translate(-50%,-50%)`,opacity:i===0?0:1})); kf.splice(1,0,{transform:`translate(${p[0][0]}px,${p[0][1]}px) translate(-50%,-50%)`,opacity:1,offset:.12}); ease=EIO; break; }
   default:kf=[{opacity:0},{opacity:1}];
  }
  return el.animate(kf,{duration:d,delay:t0,easing:ease,fill:FILL});
}
const camT=c=>`translate(${(CX-c[2]*c[0]).toFixed(1)}px,${(CY-c[2]*c[1]).toFixed(1)}px) scale(${c[2]})`;
function camAnim(el,sc){
  const D=sc._dur; let cur=sc._cam0; const kf=[{transform:camT(cur),offset:0}];
  (sc.cam||[]).forEach(([at,du,x,y,s])=>{ const a=T(sc,at)/D, b=Math.min(1,(T(sc,at)+du)/D); kf.push({transform:camT(cur),offset:Math.min(1,a),easing:EIO}); cur=[x,y,s]; kf.push({transform:camT(cur),offset:b}); });
  kf.push({transform:camT(cur),offset:1});
  for(let i=1;i<kf.length;i++) if(kf[i].offset<kf[i-1].offset) kf[i].offset=kf[i-1].offset;
  return el.animate(kf,{duration:D*1000,fill:'both'});
}
function rotAnims(stage,sc){
  const out=[]; const D=sc._dur*1000;
  const mk=(el,tab,dir,ph)=>{ const n=tab.length, kf=[]; for(let i=0;i<n;i+=2) kf.push({transform:`rotate(${(dir*tab[i]+ph).toFixed(2)}deg)`,offset:Math.min(1,i*STEP*1000/D)});
    kf.push({transform:`rotate(${(dir*tab[n-1]+ph).toFixed(2)}deg)`,offset:1}); for(let i=1;i<kf.length;i++) if(kf[i].offset<kf[i-1].offset) kf[i].offset=kf[i-1].offset;
    out.push(el.animate(kf,{duration:D,fill:'both',easing:'linear'})); };
  stage.querySelectorAll('[data-rot]').forEach(el=>{ const d=el.dataset.rot;
    if(d==='ai'){ if(sc._aiang) mk(el,sc._aiang,1,0); return; }
    mk(el,sc._ang,SPIN[d],PH[d]); });
  return out;
}

/* ---------- a soft mechanical click, made on the fly ---------- */
let AC=null;
function sfx(kind){
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const t=AC.currentTime;
    const n=AC.createBufferSource(), b=AC.createBuffer(1,AC.sampleRate*.12,AC.sampleRate), ch=b.getChannelData(0);
    for(let i=0;i<ch.length;i++) ch[i]=(Math.random()*2-1)*Math.pow(1-i/ch.length,kind==='clunk'?2:5);
    n.buffer=b; const f=AC.createBiquadFilter(); f.type='bandpass'; f.frequency.value=kind==='clunk'?900:kind==='seat'?1400:2600; f.Q.value=kind==='clunk'?1.2:3;
    const g=AC.createGain(); g.gain.value=kind==='clunk'?.5:kind==='seat'?.35:.22; n.connect(f); f.connect(g); g.connect(AC.destination); n.start(t);
    const o=AC.createOscillator(), og=AC.createGain(); o.frequency.setValueAtTime(kind==='clunk'?95:140,t); o.frequency.exponentialRampToValueAtTime(50,t+.15);
    og.gain.setValueAtTime(kind==='tick'?.08:.22,t); og.gain.exponentialRampToValueAtTime(.0001,t+.18); o.connect(og); og.connect(AC.destination); o.start(t); o.stop(t+.2);
  }catch(e){}
}

/* ---------- textures, made once ---------- */
function textures(){
  // the engraved rosette behind the mechanism (a watch dial's guilloché)
  let s=''; for(let i=0;i<72;i++) s+=`<ellipse cx="0" cy="0" rx="560" ry="250" transform="rotate(${i*2.5})"/>`;
  for(let r=640;r<1100;r+=26) s+=`<circle r="${r}"/>`;
  const g=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1100 -1100 2200 2200"><g fill="none" stroke="#E2C98E" stroke-width="1.2">${s}</g></svg>`;
  const guil=`url("data:image/svg+xml;utf8,${encodeURIComponent(g)}")`;
  let grain='none';
  try{ const c=document.createElement('canvas'); c.width=c.height=220; const x=c.getContext('2d'); const im=x.createImageData(220,220);
    for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255; im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255;} x.putImageData(im,0,0); grain=`url(${c.toDataURL()})`; }catch(e){}
  return {guil,grain};
}

/* ---------- player ---------- */
let root,stage,capEn,capBn,dotsEl,btnPlay,btnSnd,cur=-1,anims=[],master=null,playing=true,raf=0,onExit=null,renderMode=false,sound=true,played=[],fired=[],clip=null,ready=null;
function loadDur(){ if(ready) return ready;
  ready=fetch('audio/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(m=>{DUR=(m&&m.dur)||{}}).catch(()=>{}).then(plan);
  return ready; }
function build(){
  if(root) return;
  const tx=textures();
  root=document.createElement('div'); root.id='intro'; root.setAttribute('role','dialog'); root.setAttribute('aria-label','The four Ds');
  root.style.setProperty('--gm',GEAR_MASK); root.style.setProperty('--guil',tx.guil); root.style.setProperty('--grain',tx.grain);
  root.innerHTML=`<div class="i-wrap"><div class="i-stage" id="i-stage"></div></div><div class="i-subs" aria-live="polite"><p class="en"></p><p class="bnc" lang="bn"></p></div><div class="i-turn">↻ Turn your phone sideways for the full picture</div>
   <div class="i-bar"><button data-i="prev" aria-label="Previous scene">◀</button><button data-i="play" aria-label="Pause">❚❚</button><button data-i="next" aria-label="Next scene">▶</button>
   <div class="i-dots" id="i-dots"></div><button data-i="snd" aria-label="Sound" title="Sound">🔊</button><button data-i="bn" title="বাংলা subtitles">বাংলা</button><button data-i="exit" aria-label="Close">✕</button></div>`;
  document.body.appendChild(root);
  stage=root.querySelector('#i-stage'); dotsEl=root.querySelector('#i-dots'); btnPlay=root.querySelector('[data-i=play]'); btnSnd=root.querySelector('[data-i=snd]');
  dotsEl.innerHTML=SCENES.map((s,i)=>`<button data-go="${i}" aria-label="Scene ${i+1}"><i></i></button>`).join('');
  root.addEventListener('click',e=>{const b=e.target.closest('[data-i]');const g=e.target.closest('[data-go]');
    if(g){show(+g.dataset.go);return}
    if(!b){ if(e.target.closest('.i-end')) return; togglePlay();return}
    const a=b.dataset.i; if(a==='prev')show(Math.max(0,cur-1)); else if(a==='next')advance(); else if(a==='play')togglePlay(); else if(a==='exit')close();
    else if(a==='snd'){sound=!sound;btnSnd.textContent=sound?'🔊':'🔇'; if(!sound) stopClip();}
    else if(a==='bn'){root.classList.toggle('bn')}});
  addEventListener('resize',fit); fit();
}
function fit(){ if(!root) return; const narrow=innerWidth<900&&!renderMode; root.classList.toggle('narrow',narrow); const s=Math.min(innerWidth/W,(innerHeight-(renderMode?0:narrow?200:64))/H); stage.style.transform=`scale(${s})`; stage.parentElement.style.width=W*s+'px'; stage.parentElement.style.height=H*s+'px'; }
function show(i){
  cur=i; anims.forEach(a=>a.cancel()); anims=[]; stopClip();
  const sc=SCENES[i];
  stage.innerHTML=`<div class="i-bg"></div><div class="i-guil"></div>
   <div class="world" id="world">${sc.html()}</div><div class="scr">${sc.scr()}</div>
   <div class="i-vig"></div><div class="i-grain"></div>
   <div class="i-cap"><p class="en"></p><p class="bnc" lang="bn"></p></div>`;
  const world=stage.querySelector('#world');
  anims.push(camAnim(world,sc));
  anims.push(...rotAnims(stage,sc));
  stage.querySelectorAll('[data-a]').forEach(el=>el.dataset.a.split('|').forEach((sp,k)=>{const r=anim(el,sp,sc,k===0); [].concat(r).forEach(x=>anims.push(x))}));
  stage.querySelectorAll('[data-flow]').forEach(p=>anims.push(p.animate([{strokeDashoffset:0},{strokeDashoffset:-.2}],{duration:3200,iterations:Infinity})));
  const gu=stage.querySelector('.i-guil'); const g0=i*14; anims.push(gu.animate([{transform:`translate(-50%,-50%) rotate(${g0}deg)`},{transform:`translate(-50%,-50%) rotate(${g0+sc._dur*.5}deg)`}],{duration:sc._dur*1000,fill:'both'}));
  master=stage.animate([{opacity:1},{opacity:1}],{duration:sc._dur*1000+60000,fill:'both'}); anims.push(master);
  capEn=stage.querySelector('.i-cap .en'); capBn=stage.querySelector('.i-cap .bnc');
  [...dotsEl.children].forEach((d,k)=>d.className=k<i?'done':k===i?'on':'');
  played=sc.lines.map(()=>false); fired=(sc.sfx||[]).map(()=>false);
  if(renderMode||!playing) anims.forEach(a=>a.pause()); else anims.forEach(a=>a.play());
  setCaption(0);
}
function capIdx(t){ const sc=SCENES[cur]; let k=0; sc._t.forEach((t0,i)=>{ if(t>=t0-.15) k=i; }); return k; }
let capShown=-1;
function setCaption(t){
  const k=capIdx(t); if(k===capShown&&capEn.textContent) return; capShown=k;
  const l=SCENES[cur].lines[k]; capEn.textContent=l[0]; capBn.textContent=l[1];
  const sub=root.querySelector('.i-subs'); if(sub){ sub.querySelector('.en').textContent=l[0]; sub.querySelector('.bnc').textContent=l[1]; }
  if(!renderMode) capEn.parentElement.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:320,easing:E,fill:'both'});
}
function stopClip(){ if(clip){ try{clip.pause()}catch(e){} clip=null; } try{ speechSynthesis.cancel() }catch(e){} }
function say(text){
  stopClip(); if(!sound) return;
  const k=keyOf(text);
  if(k&&DUR[k]){ clip=new Audio(`audio/${k}.mp3`); clip.play().catch(()=>{}); return; }
  try{ const u=new SpeechSynthesisUtterance(text.replace(/Ayesha/g,'Eye-sha')); u.rate=.9; u.lang='en-GB'; speechSynthesis.speak(u); }catch(e){}
}
function sceneTime(){ return master?(master.currentTime||0)/1000:0; }
function tick(){
  if(!root||root.hidden) return;
  const sc=SCENES[cur], t=sceneTime(); capShown=capShown; setCaption(t);
  if(playing){
    sc._t.forEach((t0,i)=>{ if(!played[i]&&t>=t0){ played[i]=true; if(t-t0<.6) say(sc.lines[i][0]); } });
    (sc.sfx||[]).forEach(([at,kind],i)=>{ if(!fired[i]&&t>=T(sc,at)){ fired[i]=true; if(sound&&t-T(sc,at)<.3) sfx(kind); } });
  }
  const prog=Math.min(1,t/sc._dur); const on=dotsEl.children[cur]; if(on) on.querySelector('i').style.width=(prog*100)+'%';
  if(playing&&t>=sc._dur){ if(cur<SCENES.length-1) show(cur+1); else { playing=false; btnPlay.textContent='▶'; btnPlay.setAttribute('aria-label','Play'); anims.forEach(a=>a.pause()); finale(); } }
  raf=requestAnimationFrame(tick);
}
function finale(){
  if(stage.querySelector('.i-end')) return;
  const d=document.createElement('div'); d.className='i-end';
  d.innerHTML=`<button data-i="exit">Start with Ayesha’s phone</button><button data-replay="1">Watch again</button>`;
  d.querySelector('[data-replay]').onclick=e=>{e.stopPropagation();d.remove();playing=true;btnPlay.textContent='❚❚';show(0)};
  stage.appendChild(d);
}
function advance(){ if(cur<SCENES.length-1) show(cur+1); }
function togglePlay(){ playing=!playing; btnPlay.textContent=playing?'❚❚':'▶'; btnPlay.setAttribute('aria-label',playing?'Pause':'Play');
  anims.forEach(a=>playing?a.play():a.pause()); if(!playing){ if(clip) clip.pause(); try{speechSynthesis.pause()}catch(e){} } else { if(clip) clip.play().catch(()=>{}); try{speechSynthesis.resume()}catch(e){} } }
function open(opts={}){
  build(); root.hidden=false; onExit=opts.onExit||null; playing=!opts.paused; btnPlay.textContent=playing?'❚❚':'▶';
  root.classList.toggle('bn',!!opts.bn); if(opts.sound===false){sound=false;btnSnd.textContent='🔇'}
  try{ if(opts.fullscreen&&!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}) }catch(e){}
  loadDur().then(()=>{ show(opts.scene||0); cancelAnimationFrame(raf); raf=requestAnimationFrame(tick); });
}
function close(){ if(!root) return; root.hidden=true; anims.forEach(a=>a.cancel()); anims=[]; stopClip(); cancelAnimationFrame(raf); if(onExit) onExit(); }
if(typeof document!=='undefined'&&document.addEventListener) document.addEventListener('keydown',e=>{
  if(!root||root.hidden) return;
  const k=e.key; let used=true;
  if(k===' '||k==='k') togglePlay(); else if(k==='ArrowRight') advance(); else if(k==='ArrowLeft') show(Math.max(0,cur-1));
  else if(k==='Escape') close(); else if(k==='b'||k==='B') root.classList.toggle('bn'); else if(k==='m'||k==='M'){sound=!sound;btnSnd.textContent=sound?'🔊':'🔇';if(!sound)stopClip();} else used=false;
  if(used){e.preventDefault();e.stopImmediatePropagation()}
},true);

/* ---------- deterministic seek, for the video renderer ---------- */
async function seek(i,t){ renderMode=true; await loadDur(); build(); root.hidden=false; root.classList.add('render'); fit(); if(i!==cur) show(i); anims.forEach(a=>{a.pause();a.currentTime=t*1000}); setCaption(t); }
const total=()=>SCENES.reduce((s,sc)=>s+(sc._dur||0),0);

if(typeof window!=='undefined') window.INTRO={open,close,seek,SCENES,LINES,W,H,plan,total,ready:loadDur};
})();
