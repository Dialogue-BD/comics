export default {id:'gwen',name:'Gwen',topic:'Environment',heading:'“Can AI actually help the environment?”',scenes:[
 {title:'It’s dangerous',sub:'The cost to our world',bg:'bg1-datacentre',poses:[['worried']],
  fx:[['tint','dangerous',.45,.86],['smog','dangerous',.62],['puffs','dangerous',[[742,250,120],[812,236,150],[886,252,130],[958,240,160],[1030,256,120]]],['icon','warn','dangerous',766,160]],
  tags:[['dangerous',['dangerous',1,.05],846,140,'clay'],['environment','environment',520,470,'mint']]},
 {at:2.0,title:'Who lives next door?',sub:'Residents and communities',bg:'bg2-neighbourhood',poses:[['worried']],
  fx:[['shade','marginalized']],tags:[['residents','residents',800,424],['communities','communities',930,292,'teal']]},
 {at:5.15,title:'Finding a balance',sub:'Technology and safety',bg:'bg3-balance-v2',blur:1.5,cam:[{scale:1.06},{scale:1}],poses:[['explain'],['weigh','stability',1,-.15]],
  build(S){
    const {tl,el,props,sec,at,pop,dir,t0}=S;
    const G={px:838,L:250,beamW:520,panW:200,standH:480,standBase:688,ringY:8,a:-10};G.py=G.standBase-G.standH+G.standH*.135;
    const glow=(c)=>{const g=el('div','glow',props);g.style.cssText=`width:330px;height:330px;background:radial-gradient(circle,${c},rgba(255,255,255,0) 68%)`;return g};
    const gL=glow('rgba(110,230,215,.75)'),gR=glow('rgba(255,214,130,.8)');
    const img=n=>{const i=el('img','prop',props);i.src=dir+n+'.webp';i.alt='';return i};
    const stand=img('scale-stand'),panL=img('scale-pan-tech'),panR=img('scale-pan-homes'),beam=img('scale-beam');
    const tag=(t,tone)=>el('div','tag '+tone,sec,'<i></i>'+t);
    const tBal=tag('balance','gold'),tTech=tag('technology','teal'),tSafe=tag('safety','mint'),tCom=tag('communities','clay');
    function lay(){const r=G.a*Math.PI/180,c=Math.cos(r),s=Math.sin(r),lx=G.px-G.L*c,ly=G.py-G.L*s,rx=G.px+G.L*c,ry=G.py+G.L*s;
      gsap.set(beam,{width:G.beamW,left:G.px-G.beamW/2,top:G.py-G.beamH/2,rotation:G.a,transformOrigin:'50% 50%'});
      gsap.set(panL,{width:G.panW,left:lx-G.panW/2,top:ly-G.ringY,rotation:-G.a*.25,transformOrigin:'50% 0%'});
      gsap.set(panR,{width:G.panW,left:rx-G.panW/2,top:ry-G.ringY,rotation:-G.a*.25,transformOrigin:'50% 0%'});
      gsap.set(gL,{left:lx-165,top:ly+70});gsap.set(gR,{left:rx-165,top:ry+70});
      gsap.set(tTech,{left:lx-104,top:ly+262});gsap.set(tCom,{left:rx-118,top:ry+250});gsap.set(tSafe,{left:rx-20,top:ry-84})}
    const load=()=>{G.beamH=G.beamW*(beam.naturalHeight/beam.naturalWidth||.1);const sw=G.standH*(stand.naturalWidth/stand.naturalHeight||.4);
      gsap.set(stand,{height:G.standH,left:G.px-sw/2,top:G.standBase-G.standH});gsap.set(tBal,{left:G.px-82,top:G.py-178});tBal.style.setProperty('--stem','52px');lay()};
    [stand,beam].forEach(i=>i.complete?0:i.addEventListener('load',load));load();
    const tilt=(a,t,d,ease='power2.inOut')=>tl.to(G,{a,duration:d,ease,onUpdate:lay},t);
    [stand,beam,panL,panR].forEach((n,i)=>tl.fromTo(n,{autoAlpha:0,y:-50},{autoAlpha:1,y:0,duration:.6,ease:'back.out(1.4)',immediateRender:false},t0-.2+i*.06));
    tl.set(G,{a:-10,onUpdate:lay},0);
    const bal=at('balance'),tech=at('technology'),st=at('stability'),sf=at('safety'),cm=at('communities',2);
    pop(tBal,bal,0);tilt(4,bal,.5);tilt(-3,bal+.5,.45);tilt(1,bal+.95,.4);
    tilt(-11,tech-.05,.6,'power2.out');pop(tTech,tech,0);
    tl.fromTo(gL,{autoAlpha:0,scale:.6},{autoAlpha:.9,scale:1,duration:.5,immediateRender:false},tech).to(gL,{autoAlpha:.25,duration:.8},tech+.9);
    tilt(-2,st,.7);pop(tSafe,sf,1.1);tilt(7,sf,.8);
    tl.fromTo(gR,{autoAlpha:0,scale:.6},{autoAlpha:.9,scale:1,duration:.5,immediateRender:false},sf).to(gR,{autoAlpha:.3,duration:.8},sf+1.1);
    pop(tCom,cm,0);tilt(0,cm+.1,1.25,'elastic.out(1,0.42)');
  }},
 {at:12.35,title:'Help instead of harm?',sub:'What AI could do',bg:'bg4-hope',cam:[{scale:1.1,xPercent:1.5},{scale:1,xPercent:0}],poses:[['hope']],init:[.6,.9],
  fx:[['spark',[['AI',530,210],['help',960,360]]],['tint','help',1.18,1.06,1],['sun','help'],['smog','harm',.5,.3],['smog',['harm',1,.3],.16,.7]],
  tags:[['AI',['AI',1,.15],590,176,'gold',1.2],['help','help',900,228,'mint'],['harm?','harm',610,120,'clay']]}
]};
