#!/usr/bin/env node
/* List every line the feedback sheets of a lesson can speak, by driving the real page in a headless
 * browser (Playwright) through every answer, file choice, verdict, puzzle trap and consequence.
 *   node tools/sheet-lines.cjs http://localhost:8130/ai-fluency/index.html cv > audio/sheet-lines.json
 * The page logs each sheet it renders (window.__sheetLog); sheets speak line by line (engine.js sheetParts). */
const {chromium}=require('playwright');
const [url,lesson='cv']=process.argv.slice(2);
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1366,height:768}});
  p.on('pageerror',e=>console.error('page error:',e.message));
  await p.addInitScript(()=>{ window.__sheetLog=[]; });
  await p.goto(url+'#'+lesson+'/0'); await p.waitForTimeout(1200);
  const n=await p.evaluate(l=>AFL.LESSONS[l].beats.length,lesson);
  for(const mode of ['solo','pair','class']) for(let i=0;i<n;i++){
    await p.evaluate(([l,i])=>{ location.hash='#'+l+'/'+i; },[lesson,i]); await p.waitForTimeout(250);
    const err=await p.evaluate(async ([l,i,mode])=>{
      const T=AFL._t, x0=T.ctx(), b=AFL.LESSONS[l].beats[i]; T.S.voice=false; AFL._mode(mode);
      const fn=(v,x)=>typeof v==='function'?v(x):v;
      const show=o=>{ T.UI.sheet=o; T.renderSheet(); T.UI.sheet=null; };
      const E=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const BN=t=>t?`<span class="bn" lang="bn">${t}</span>`:'';
      const cq=t=>show({tone:'bad',title:t.when,cq:1,html:`<p class="cq-line">${E(t.line)}${BN(t.linebn)}</p>${t.why?`<p>${t.why}${BN(t.whybn)}</p>`:''}`,acts:[]});
      const opt=o=>{ if(!o) return; if(o.then) cq(Object.assign({why:o.why,whybn:o.whybn},o.then)); else show(T.fbSheet(o,()=>{})); };
      const subsets=a=>{ const out=[]; for(let m=0;m<(1<<a.length);m++) out.push(a.filter((_,k)=>m>>k&1)); return out; };
      try{
        const x=T.ctx(); const keep=JSON.stringify(x.ch);
        const reset=()=>{ for(const k of Object.keys(x.ch)) delete x.ch[k]; Object.assign(x.ch,JSON.parse(keep)); };
        const sc=fn(b.scene,x)||{};
        /* file pickers: every combination */
        const files=(sc.files||[]).map(f=>f.id||f);
        const fileSets=sc.sel&&files.length?subsets(files):[null];
        for(const set of fileSets){ if(set) x.set(sc.sel,set);
          if(b.feedback){ const o=b.feedback(x,'attach'); if(o) show(Object.assign(T.fbSheet(o,o.retry),o.sheet||{})); }
          if(b.cq){ const c=b.cq(x); if(c) cq(c); } }
        reset();
        /* composer shortcuts that lead to consequences: each chip alone, and each chip with the best ones */
        const comp=fn(b.compose,x);
        if(comp&&b.cq){ const ids=(comp.chips||[]).map(c=>c.id); for(const id of ids){ for(const set of [[id],[...(comp.best||[]),id]]){ x.set(comp.key,set); const c=b.cq(x); if(c) cq(c); } } reset(); }
        /* prompt puzzles: every trap */
        if(comp) for(const c of comp.chips||[]) for(const t of c.traps||[]){ T.pzTrap(x,sc.kb||{},c,t); T.renderSheet(); T.UI.sheet=null; }
        /* questions, decisions, choice cards */
        const ask=fn(b.ask,x); if(ask&&ask.options) ask.options.forEach(opt);
        const dec=fn(b.decide,x); if(dec&&dec.options) Object.values(dec.options).forEach(opt);
        const card=fn(b.card,x); if(card&&card.type==='choice') (card.options||[]).forEach(opt);
        /* spot what isn't true: every verdict, right and wrong, and every "you found k of n" */
        const h=fn(b.hunt,x);
        if(h){ const bad=h.lines.filter(z=>z.v!=='ok');
          for(const z of h.lines){ const want=z.v==='ok'?'ok':(z.vd==='NG'?'ng':'bad');
            for(const v of ['ok','bad','ng']){ x.set(h.key,{}); T.huntVerdict(z.id+'|'+v); T.UI.sheet=null; }
            const a={}; bad.forEach(y=>{ if(y.id!==z.id) a[y.id]='bad'; }); x.set(h.key,a); T.huntVerdict(z.id+'|'+want); T.UI.sheet=null;
            const a2={}; a2[z.id]=want==='ok'?'ok':'bad'; x.set(h.key,a2); T.openLine(z.id); T.UI.sheet=null; }
          for(let k=0;k<bad.length;k++){ const a={}; bad.slice(0,k).forEach(y=>a[y.id]='bad'); x.set(h.key,a); T.huntDone(); T.UI.sheet=null; }
          x.set(h.key,{}); }
        reset(); T.UI.sheet=null; T.UI.hs=null;
      }catch(e){ return 'beat '+i+': '+e.message; }
      return '';
    },[lesson,i,mode]);
    if(err) console.error(err);
  }
  const log=await p.evaluate(()=>window.__sheetLog);
  const seen=new Map();
  for(const s of log) for(const t of s.parts){ const k=await p.evaluate(t=>AFL.audioKey(t),t); if(!seen.has(k)) seen.set(k,{key:k,text:t}); }
  const wholes=new Set(log.map(s=>s.say));
  process.stdout.write(JSON.stringify({sheets:wholes.size,lines:[...seen.values()]},null,1)+'\n');
  await b.close();
})();
