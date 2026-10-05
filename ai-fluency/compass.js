/* The 4D gears — one picture of the AI Fluency framework, reused everywhere.
 *
 *                    Delegation (plan)                ↕ loop 1: the big decisions
 *   Description (say it)   ⚙ AI fluency ⚙   Discernment (judge it)   ↔ loop 2: the conversation
 *                    Diligence (be responsible)
 *
 * Four gears in a ring. Every gear meshes with its two neighbours, so when one
 * turns they ALL turn: the vertical loop (N, S) spins one way, the horizontal
 * loop (W, E) the other. That is the framework's point — the two loops drive
 * each other — and the gold spot where all four meet is AI fluency.
 */
(function(){
const D4={};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- the four Ds ---- */
const META={
 del:{n:'Delegation',nbn:'দায়িত্ব ভাগ',v:'Plan',vbn:'পরিকল্পনা',loop:'v',
      q:'Who does what — me, the AI, or both?',qbn:'কে কী করবে — আমি, AI, নাকি দুজনে?'},
 des:{n:'Description',nbn:'বর্ণনা',v:'Say it',vbn:'বলো',loop:'h',
      q:'Tell the AI clearly what you want — and how.',qbn:'AI-কে স্পষ্ট করে বলো তুমি কী চাও — আর কীভাবে।'},
 dis:{n:'Discernment',nbn:'যাচাই',v:'Judge it',vbn:'বিচার করো',loop:'h',
      q:'Is what came back true, right and good enough?',qbn:'যা ফিরে এলো তা কি সত্য, সঠিক আর যথেষ্ট ভালো?'},
 dil:{n:'Diligence',nbn:'সতর্কতা',v:'Be responsible',vbn:'দায়িত্ব নাও',loop:'v',
      q:'Is it safe, honest and fair? Who is responsible?',qbn:'এটা কি নিরাপদ, সৎ আর ন্যায্য? দায় কার?'}
};
const LOOP={v:{n:'the big decisions',bn:'বড় সিদ্ধান্ত'},h:{n:'the conversation',bn:'কথোপকথন'}};
D4.META=META; D4.LOOP=LOOP; D4.ORDER=['del','des','dis','dil'];

/* ---- symbols (Material icons, 24-unit box) ---- */
const ICON={
 del:'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',                                    // hand over ⇄
 des:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z', // say it 💬
 dis:'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z', // judge it 👁
 dil:'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' // responsibility 🛡
};
D4.ICON=ICON;
D4.icon=(d,size=16,color='currentColor')=>`<svg class="d4i" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path d="${ICON[d]}" fill="${color}"/></svg>`;

/* ---- gear geometry: 12 teeth, pitch radius 36, in a 200×200 box ---- */
const N_T=12, T=360/N_T, R=36, A=5.5, DIST=R*Math.SQRT2;
const POS={del:[100,100-DIST],dis:[100+DIST,100],dil:[100,100+DIST],des:[100-DIST,100]};
/* phase offsets so the teeth interlock around the ring, and spin direction */
const PH={del:0,dis:T/2,dil:0,des:T/2}, SPIN={del:1,dil:1,dis:-1,des:-1};
const GEAR=(()=>{const p=[],rad=a=>a*Math.PI/180,pt=(r,a)=>`${(r*Math.cos(rad(a))).toFixed(2)} ${(r*Math.sin(rad(a))).toFixed(2)}`;
  for(let k=0;k<N_T;k++){const c=k*T;
    p.push(`${k?'L':'M'}${pt(R-A,c-.36*T)}`,`L${pt(R+A,c-.17*T)}`,`A${R+A} ${R+A} 0 0 1 ${pt(R+A,c+.17*T)}`,`L${pt(R-A,c+.36*T)}`,`A${R-A} ${R-A} 0 0 1 ${pt(R-A,c+.64*T)}`)}
  return p.join('')+'Z';})();

/* the gears SVG. o: {on:'dis', used:{del:1,…}, angle:deg, cls:'', title:''} */
D4.svg=(o={})=>{
  const on=o.on, ang=o.angle||0;
  const gear=d=>{const [x,y]=POS[d];const lit=on==='all'||d===on, used=o.used&&o.used[d];
    return `<g class="gear g-${d}${lit?' on':''}${used?' used':''}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">
      ${lit&&on!=='all'?`<circle class="halo" r="${R+A+5}"/>`:''}
      <g class="rot" style="--o:${PH[d]}deg;--s:${SPIN[d]}"><path class="teeth" d="${GEAR}"/><circle class="axle" r="${R-A-3}"/></g>
      <path class="sym" d="${ICON[d]}" transform="translate(-18 -18) scale(1.5)"/></g>`};
  return `<svg class="compass${o.cls?' '+o.cls:''}" viewBox="0 0 200 200" style="--ga:${ang}deg" role="img" aria-label="${esc(o.title||'The four Ds as gears')}">
    ${o.loops?`<rect class="loop lv" x="${100-R-14}" y="4" width="${2*R+28}" height="192" rx="${R+14}"/><rect class="loop lh" x="4" y="${100-R-14}" width="192" height="${2*R+28}" rx="${R+14}"/>`:''}
    ${['del','dis','dil','des'].map(gear).join('')}
    <circle class="sweet${o.sweet?' lit':''}" cx="100" cy="100" r="${o.sweet?9:6.5}"/></svg>`;
};

/* a single small gear badge for inline use (rail, shift card, path) */
D4.badge=(d,size=26,lit=true)=>`<span class="d4b d-${d}${lit?' lit':''}" style="--sz:${size}px" title="${META[d].n}"><svg viewBox="-44 -44 88 88" aria-hidden="true"><path class="teeth" d="${GEAR}"/><path class="sym" d="${ICON[d]}" transform="translate(-18 -18) scale(1.5)"/></svg></span>`;

/* how one D hands over to the next. Same loop, or the loops crossing. */
const LINK={
 'des>dis':['You said it. Now judge what comes back.','বলেছ। এবার যা ফিরে আসে তা বিচার করো।'],
 'dis>des':['What you noticed becomes your next instruction.','যা চোখে পড়েছে, সেটাই তোমার পরের নির্দেশ।'],
 'del>dil':['Every plan raises a question of responsibility.','প্রতিটি পরিকল্পনা দায়িত্বের প্রশ্ন তোলে।'],
 'dil>del':['Your responsibilities change the plan.','তোমার দায়িত্ব পরিকল্পনা বদলে দেয়।'],
 'del>des':['The plan turns into words for the AI.','পরিকল্পনা এবার AI-এর জন্য কথায় রূপ নেয়।'],
 'des>del':['Saying it shows what still needs deciding.','বলতে গিয়ে বোঝা যায় কী এখনো ঠিক করা বাকি।'],
 'del>dis':['Check the job you handed over.','যে কাজ হাতে দিয়েছ, তা যাচাই করো।'],
 'dis>del':['What you saw changes what you hand over.','যা দেখেছ, তা বদলে দেয় তুমি কী হাতে দেবে।'],
 'dil>des':['Your limits go into the prompt.','তোমার সীমাগুলো প্রম্পটে ঢোকে।'],
 'des>dil':['Before it goes out: is it safe and honest?','পাঠানোর আগে: এটা কি নিরাপদ আর সৎ?'],
 'dis>dil':['What you found raises a responsibility question.','যা পেয়েছ, তা দায়িত্বের প্রশ্ন তোলে।'],
 'dil>dis':['Your standards tell you what to check.','তোমার মানদণ্ড বলে দেয় কী যাচাই করতে হবে।']
};
D4.link=(a,b)=>{ if(!a) return {en:`First gear: ${META[b].n}.`,bn:`প্রথম গিয়ার: ${META[b].n}।`,kind:'start'};
  const same=META[a].loop===META[b].loop, l=LINK[a+'>'+b]||['',''];
  return {en:l[0],bn:l[1],kind:same?'same':'cross',loop:same?LOOP[META[b].loop]:null}; };

/* the legend: the gears in the middle, one D on each side */
D4.legend=(o={})=>{
  const cell=d=>{const m=META[d];return `<div class="lg-pt lg-${d} d-${d}"><b>${D4.icon(d,15)}${m.n}</b><span class="lg-v">${m.v}</span><span class="lg-q">${m.q}</span><span class="bn" lang="bn">${m.nbn} · ${m.vbn} — ${m.qbn}</span>${o.extra&&o.extra[d]?`<span class="lg-x">${o.extra[d]}</span>`:''}</div>`};
  return `<div class="d4legend${o.compact?' compact':''}">${cell('del')}${cell('des')}<div class="lg-c">${D4.svg({loops:true,sweet:true,on:o.on,used:o.used,cls:o.on==='all'?'all':''})}</div>${cell('dis')}${cell('dil')}</div>`;
};
D4.loopsNote=()=>`<div class="d4loops">
  <div><span class="lv">↕</span><p><b>Delegation ⇄ Diligence · Loop 1: the big decisions.</b> Plan before you start; take responsibility for the result.<span class="bn" lang="bn">Delegation ⇄ Diligence · প্রথম চক্র: বড় সিদ্ধান্ত। শুরুর আগে পরিকল্পনা; ফলাফলের দায়িত্ব।</span></p></div>
  <div><span class="lh">↔</span><p><b>Description ⇄ Discernment · Loop 2: the conversation.</b> Say it, judge what comes back, say it better.<span class="bn" lang="bn">Description ⇄ Discernment · দ্বিতীয় চক্র: কথোপকথন। বলো, যা ফেরে তা বিচার করো, আরও ভালো করে বলো।</span></p></div>
  <div><span class="lc">⚙</span><p><b>The gears touch.</b> When one turns, all four turn. Where they meet is AI fluency.<span class="bn" lang="bn">গিয়ারগুলো একটা আরেকটাকে ছুঁয়ে আছে। একটা ঘুরলে চারটাই ঘোরে। যেখানে চারটা মেলে, সেটাই AI fluency।</span></p></div></div>`;

window.D4=D4;
})();
