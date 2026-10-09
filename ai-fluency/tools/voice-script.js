#!/usr/bin/env node
/* Lists every line the AI Fluency Lab speaks, straight from the lesson files,
 * and writes the recording kit for Gemini TTS in the AI Studio playground:
 *
 *   audio/lines.json     every line: key, text, voice, workflow, take
 *   audio/takes.json     take id -> the keys it holds, in order
 *   voice-script.md      what to paste into AI Studio, take by take
 *
 * Run from the ai-fluency folder:   node tools/voice-script.js
 *
 * Nothing is retyped: change a line in a lesson file and run this again. A
 * line's key comes from its words (the same audioKey() the page uses), so
 * unchanged lines keep their recordings and only new or changed lines show
 * up as "to record".
 */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const AUD=path.join(ROOT,'audio');

/* load the page's own code with a stub browser */
let STREAM=false;
global.window=global;
global.document={querySelector:q=>STREAM&&/stream/.test(q)?{}:null,querySelectorAll:()=>[],addEventListener:()=>{}};
require(path.join(ROOT,'compass.js'));
require(path.join(ROOT,'engine.js'));
for(const f of ['lesson-cv.js','lesson-agent.js','lesson-build.js','intro.js']) require(path.join(ROOT,f));
const {audioKey,canon,LESSONS,ORDER}=AFL; const D4=global.D4;

const MAX_PER_TAKE=4;   // short takes: the model can silently drop a line from a long one
const lines=new Map();               // key -> {key,text,voice,lesson,where}
function add(text,voice,lesson,where){
  if(!text) return; const t=canon(text); if(!t) return;
  const k=audioKey(t); if(lines.has(k)) return;
  lines.set(k,{key:k,text:t,voice,lesson,where});
}

/* contexts a function-valued field may be evaluated in */
function ctxs(L,b){
  const out=[];
  for(const mode of ['pair','solo','class']) for(const stream of [false,true]) for(const rich of [false,true]){
    const ch={};
    out.push({mode,stream,x:{ch,L,beat:b,bn:false,streaming:stream,files:AFL.FILES,esc:AFL.esc,ico:AFL.ico,
      set(k,v){ch[k]=v},get(k,d){ if(k in ch) return ch[k]; if(!rich) return d; return Array.isArray(d)?['nid']:d; }}});
  }
  return out;
}
function each(L,b,v,cb){
  if(typeof v!=='function'){ cb(v); return; }
  for(const c of ctxs(L,b)){ AFL._mode(c.mode); STREAM=c.stream; let r; try{ r=v(c.x) }catch(e){ continue } cb(r); }
  AFL._mode('pair'); STREAM=false;
}

/* the start screen and the four default phrases */
add('This is Ayesha’s phone. Learn AI, and English, by doing real tasks.','coach','common','start screen');
for(const d of ['del','des','dis','dil']) D4.SAY[d].frames.forEach(f=>add(f.en,'ayesha','common',`${D4.META[d].n} phrase`));
add('That’s asking the fox to guard the henhouse.','coach','agent','idiom');
/* what happens next: the consequence lines, and the frame students answer with */
/* (their own takes, so adding them never reshuffles takes that are already recorded) */
add('What went wrong? Say it.','coach','cq','consequence question');
add('She ___, so ___.','ayesha','cq','consequence frame');
AFL.CQS.forEach(c=>add(c.line,'coach','cq',c.lesson+' · consequence · '+c.when));
/* the four Ds film: one line per caption, in the coach's voice */
/* what each D means: added later, so their own take */
INTRO.DEFS.forEach(t=>add(t,'coach','introd','four Ds film · what the D means'));
INTRO.LINES.forEach((t,i)=>add(t,'coach','intro','four Ds film · line '+(i+1)));

for(const id of ORDER){
  const L=LESSONS[id];
  L.beats.forEach((b,i)=>{
    const where=`#${id}/${i}`;
    each(L,b,b.say,t=>add(t,'coach',id,where));
    each(L,b,b.frame,f=>f&&add(f.en,'ayesha',id,where+' phrase'));
    each(L,b,b.card,c=>{
      if(!c) return;
      if(c.type==='words') c.items.forEach(w=>add(w.w+'. '+w.ex,'coach',id,where+' word'));
      if(c.type==='story') c.panels.forEach(p=>add(p.en,'coach',id,where+' story'));
      if(c.type==='phrases') Object.values(c.items).forEach(p=>add(p.en,'ayesha',id,where+' phrase'));
    });
    each(L,b,b.talk,t=>{
      if(!t) return;
      add(t.q,'coach',id,where+' question');
      (t.frames||[]).forEach(f=>add(f.en,'ayesha',id,where+' frame'));
      add(t.model,'ayesha',id,where+' example');
    });
  });
}

/* takes: per workflow and voice, in lesson order, a few lines each */
const all=[...lines.values()];
const takes={};
for(const lesson of ['common',...ORDER,'cq','intro','introd']) for(const voice of ['coach','ayesha']){
  const ls=all.filter(l=>l.lesson===lesson&&l.voice===voice);
  for(let i=0;i<ls.length;i+=MAX_PER_TAKE){
    const tid=`${lesson}-${voice}-${String(i/MAX_PER_TAKE+1).padStart(2,'0')}`;
    takes[tid]=ls.slice(i,i+MAX_PER_TAKE).map(l=>{l.take=tid;return l.key});
  }
}
fs.mkdirSync(AUD,{recursive:true});
fs.writeFileSync(path.join(AUD,'lines.json'),JSON.stringify(all,null,1));
fs.writeFileSync(path.join(AUD,'takes.json'),JSON.stringify(takes,null,1));

/* what is already recorded */
let have=new Set(); try{ have=new Set(JSON.parse(fs.readFileSync(path.join(AUD,'manifest.json'))).keys) }catch(e){}
/* the transcript is what is SAID; the key stays the words on screen */
// Ayesha is said EYE-sha: two syllables, no y slide
const spoken=t=>t.replace(/_{3}/g,'…').replace(/Ayesha/g,'Eye-sha').replace(/Chats \(WhatsApp-style\)/g,'Chats')
  // a colon makes the model pause as long as a line break, which confuses the cutter
  .replace(/:\s+/g,', ').replace(/Tap ⋮/g,'Tap the three dots').replace(/Tap \+/g,'Tap plus').replace(/■\s*/g,'')
  .replace(/৳\s?99/g,'ninety-nine taka').replace(/৳\s?2,500/g,'two thousand five hundred taka').replace(/৳\s?5,000/g,'five thousand taka')
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}]/gu,'').replace(/\s+/g,' ').trim();

const VOICES={
 coach:{name:'The coach',pick:'Extended Voice Library: filter Accent → Bangladeshi or Indian English, a warm adult teacher voice. If none fits: Sulafat (Warm) or Achird (Friendly).',
   profile:'A warm, patient teacher’s voice in the middle of its range. Unhurried and very clear, every consonant finished. Short pauses at commas; a small lift on the key word of each sentence. Never sing-song, never salesy.',
   scene:'A quiet university classroom in Rajshahi, late morning, a ceiling fan turning slowly.\nRoom tone: a soft, steady fan hum, very low.',
   context:'Short spoken instructions and questions for English learners (B1) working through a lesson on a phone. The speaker is their teacher, guiding one small step at a time and wanting every word understood the first time.',
   style:'calm, warm and encouraging, speaking slowly and clearly for English learners'},
 ayesha:{name:'Ayesha',pick:'Extended Voice Library: filter Accent → Bangladeshi or Indian English, Gender → female, a young adult voice. If none fits: Leda (Youthful) or Autonoe (Bright).',
   profile:'A young woman’s voice, bright but not high, clear and steady. Natural South Asian English rhythm. Stress lands on the content words; a short, natural pause where a gap … appears in the sentence.',
   scene:'A student common room at Rajshahi University in the afternoon.\nRoom tone: faint, distant student chatter, very low.',
   context:'Model sentences that English learners will repeat and then adapt. The speaker is Ayesha, a third-year Economics student, saying each sentence the way she would say it to a friend: plainly, confidently, and slowly enough to copy.',
   style:'friendly and confident, speaking slowly and clearly, like a student explaining something to a friend'}
};

let md=`# AI Fluency Lab — voice script

Generated by \`tools/voice-script.js\` from the lesson files. **Do not edit by hand** — change the line in the lesson and run the script again.

- **${all.length} lines** in **${Object.keys(takes).length} takes** · ${all.filter(l=>have.has(l.key)).length} already recorded
- Two voices: **the coach** (instructions, words, stories, questions) and **Ayesha** (the phrases students repeat, sentence frames, example answers).
- Model: **Gemini 3.8 Flash TTS** (\`gemini-3.8-flash-tts\`) in the **AI Studio speech playground** — no API key. Use Flash Lite only for quick drafts.
- Lines the page has no recording for are read by the phone’s built-in voice, so the lesson works before, during and after recording.

## How to record (no API)

1. Open AI Studio → **Generate speech**. Choose the model and the voice for the take (below). Audition the voice once and then keep it for every take of that speaker.
2. Paste the **Audio profile**, **Scene** and **Sample context** for the speaker once; they stay the same for every take of that voice. Put the **Style** line in the style box.
3. For each take, paste its **Transcript** block and run it. Lines are separated by \`<long pause> <long pause>\` — that long silence is how the cutting tool finds the lines, so keep it in.
4. Download the result and rename it exactly as the take heading, e.g. \`cv-coach-01.wav\`, into one folder (Downloads is fine).
5. When you have some takes, cut them into lines (needs ffmpeg):

   \`\`\`
   cd "<repo>/ai-fluency" && python3 tools/split_takes.py ~/Downloads
   \`\`\`

   It finds each take by name, cuts it at the pauses into \`audio/<key>.mp3\`, and updates \`audio/manifest.json\`. A take whose pause count doesn’t match its line count is skipped and reported — record it again.
6. If a tag is read aloud, or a word is wrong, re-run just that take.

Gaps in sentence frames are written as **…** — read them as a short natural pause, never as a word.

**Names to check in the first take** (re-run if one is wrong): Ayesha (*EYE-sha* — two syllables, no y slide; the transcripts spell it *Eye-sha* so the model can’t get it wrong), Sathi (*SHA-thee*, the AI app), Rajshahi (*RAJ-sha-hee*), bKash (*bee-cash*), RUCEI (say the letters), Riya, Mitu, Tanvir, Göttingen. The text keeps them as students see them; if the model stumbles, a spelling hint in the Style box (e.g. *“Sathi is said SHA-thee”*) usually fixes it.

## The two voices

`;
for(const [k,v] of Object.entries(VOICES)){
  md+=`### ${v.name}

**Voice** ${v.pick}

**Style** \`${v.style}\`

Audio profile
\`\`\`text
${v.profile}
\`\`\`
Scene
\`\`\`text
${v.scene}
\`\`\`
Sample context
\`\`\`text
${v.context}
\`\`\`

`;}
const TITLE={common:'Start screen and the four phrases',cv:'Workflow 1 · An honest CV with AI',agent:'Workflow 2 · Set up an AI agent',build:'Workflow 3 · Vibe-code an app',cq:'What happens next — consequences of risky choices',intro:'The four Ds — onboarding film (one line per caption)',introd:'The four Ds — what each D means (film)'};
let cur='';
for(const [tid,keys] of Object.entries(takes)){
  const L0=lines.get(keys[0]);
  if(L0.lesson!==cur){ cur=L0.lesson; md+=`## ${TITLE[cur]}\n\n`; }
  const done=keys.every(k=>have.has(k));
  md+=`### \`${tid}.wav\` — ${VOICES[L0.voice].name} · ${keys.length} lines${done?' · ✅ recorded':''}\n\n`;
  md+='```text\n'+keys.map(k=>spoken(lines.get(k).text)).join('\n<long pause> <long pause>\n')+'\n```\n\n';
}
md+=`## Checklist

| Take | Voice | Lines | Recorded | Cut |
|---|---|---|---|---|
${Object.entries(takes).map(([t,k])=>`| ${t} | ${VOICES[lines.get(k[0]).voice].name} | ${k.length} | ${k.every(z=>have.has(z))?'✅':'☐'} | ${k.every(z=>have.has(z))?'✅':'☐'} |`).join('\n')}
`;
fs.writeFileSync(path.join(ROOT,'voice-script.md'),md);
console.log(`${all.length} lines · ${Object.keys(takes).length} takes · ${all.filter(l=>have.has(l.key)).length} recorded`);
const by={};all.forEach(l=>{const z=l.lesson+'/'+l.voice;by[z]=(by[z]||0)+1});console.log(by);
