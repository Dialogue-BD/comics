/* AI Fluency Lab — engine
 * One screen at a time:
 *   PHONE  — a simulated Android phone (Material 3). Every screen is a pure
 *            function of a "scene" object, so any beat can be opened directly.
 *   PLAY   — Cog, the coach, says one thing; the stage shows the phone OR a card;
 *            one button goes on; feedback slides up. Nothing is ever locked.
 * Lessons (lesson-*.js) are plain data + a few hooks; they call AFL.lesson().
 */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fn=(v,ctx)=>typeof v==='function'?v(ctx):v;

/* ------------------------------------------------------------------ icons */
const P={
 back:'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
 menu:'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
 more:'M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
 search:'M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
 plus:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z',
 send:'M3.4 20.4 20.9 12 3.4 3.6 3.4 10l12.5 2-12.5 2z',
 mic:'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9z',
 close:'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z',
 check:'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
 mail:'M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z',
 cal:'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14zM7 12h5v5H7z',
 folder:'M10 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z',
 file:'M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z',
 gear:'M19.1 12.9a7 7 0 0 0 0-1.8l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.6-.9L14.8 3h-4l-.4 2.6a7 7 0 0 0-1.6.9l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 1.8l-2 1.6 2 3.4 2.4-1c.5.4 1 .7 1.6.9l.4 2.6h4l.4-2.6c.6-.2 1.1-.5 1.6-.9l2.4 1 2-3.4zM12.8 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z',
 phone:'M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.3 1z',
 chat:'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z',
 camera:'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 2 7.2 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.2L15 2z',
 image:'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5z',
 globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.4 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.6 15.6 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.9 5.5 8.4 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.4-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z',
 wallet:'M21 7.3V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2.3A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.7zM20 9v6h-7V9zM5 19V5h14v2h-6a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h6v2zm11-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
 shield:'M12 1 3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5zm-2 16-4-4 1.4-1.4 2.6 2.6 6.6-6.6L18 9z',
 lock:'M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0z',
 warn:'M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z',
 spark:'M12 2c.4 4.9 5.1 9.6 10 10-4.9.4-9.6 5.1-10 10-.4-4.9-5.1-9.6-10-10 4.9-.4 9.6-5.1 10-10z',
 code:'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z',
 play:'M8 5v14l11-7z',
 share:'M18 16a3 3 0 0 0-2 .8l-7.1-4.2a3 3 0 0 0 0-1.2L16 7.2A3 3 0 1 0 15 5l.1.6L8 9.8a3 3 0 1 0 0 4.4l7.1 4.2-.1.6a3 3 0 1 0 3-3z',
 edit:'M3 17.2V21h3.8L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z',
 copy:'M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z',
 thumb:'M2 21h4V9H2zm20-11a2 2 0 0 0-2-2h-6.3l1-4.6V3l-1-1-6.6 6.6c-.4.3-.6.8-.6 1.4v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1.1-.7z',
 redo:'M17.6 6.4A8 8 0 1 0 19.7 14h-2.1a6 6 0 1 1-1.4-6.2L13 11h7V4z',
 orbit:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm9.4-2.6c-1-1.7-4.6-1.2-8.6 1.1-4 2.3-6.2 5.1-5.2 6.8 1 1.7 4.6 1.2 8.6-1.1 4-2.3 6.2-5.1 5.2-6.8zM12 2a10 10 0 0 1 8.5 4.7l-1.7 1A8 8 0 0 0 5.2 7.8l-1.7-1A10 10 0 0 1 12 2zm0 20a10 10 0 0 1-8.5-4.7l1.7-1a8 8 0 0 0 13.6-.1l1.7 1A10 10 0 0 1 12 22z',
 person:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z',
 key:'M12.7 10A6 6 0 1 0 7 18a6 6 0 0 0 5.7-4H17v4h4v-4h2v-4zM7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
 trash:'M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z',
 history:'M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 2.1 5L6.7 18.4A9 9 0 1 0 13 3zm-1 5v5l4.3 2.5.7-1.2-3.5-2.1V8z',
 info:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z',
 down:'M7 10l5 5 5-5z',
 msg:'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 9h12v2H6zm8 5H6v-2h8zm4-6H6V6h12z',
 drive:'M7.7 3h8.6l5.7 10-4.3 7.5H6.3L2 13zm1.2 2L5 12h3.8l3.9-7zm6.4 0-3.9 7h7.6zM6.6 14l-1.4 2.5 1.6 2.5h10.6L19 14z',
 doc:'M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zM8 12h8v2H8zm0 4h8v2H8zm5-7V3.5L18.5 9z',
 apps:'M4 8h4V4H4zm6 12h4v-4h-4zm-6 0h4v-4H4zm0-6h4v-4H4zm6 0h4v-4h-4zm6-10v4h4V4zm-6 4h4V4h-4zm6 6h4v-4h-4zm0 6h4v-4h-4z',
 bolt:'M7 2v11h3v9l7-12h-4l4-8z',
 eye:'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
 git:'M21.6 11.1 12.9 2.4a1.4 1.4 0 0 0-2 0L9.1 4.2l2.3 2.3a1.6 1.6 0 0 1 2.1 2.1l2.2 2.2a1.6 1.6 0 1 1-1 1l-2.1-2.1v5.4a1.6 1.6 0 1 1-1.3-.1V9.5a1.6 1.6 0 0 1-.9-2.2L8.2 5 2.4 10.9a1.4 1.4 0 0 0 0 2l8.7 8.7a1.4 1.4 0 0 0 2 0l8.5-8.5a1.4 1.4 0 0 0 0-2z',
 tune:'M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z'
};
/* Orbit's logo: a warm planet circled by a ring, with one bright satellite — the agent that keeps going around while you're away */
const ORBIT_LOGO=`<svg viewBox="0 0 24 24" class="orbit-logo" aria-hidden="true"><defs><linearGradient id="og-bg" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#FF9A55"/><stop offset=".55" stop-color="#E5532B"/><stop offset="1" stop-color="#992A14"/></linearGradient><radialGradient id="og-pl" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#FFE7D2"/><stop offset="1" stop-color="#FFBE94"/></radialGradient></defs><rect width="24" height="24" rx="7" fill="url(#og-bg)"/><path d="M2.6 14.2A9.6 3.6 0 0 1 21.4 9.8" transform="rotate(-24 12 12)" fill="none" stroke="#FFF4E8" stroke-opacity=".5" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="12" r="4.5" fill="url(#og-pl)"/><path d="M21.4 9.8A9.6 3.6 0 0 1 2.6 14.2" transform="rotate(-24 12 12)" fill="none" stroke="#FFF4E8" stroke-width="1.4" stroke-linecap="round"/><path d="M19.6 4.3l.62 1.55 1.55.62-1.55.62-.62 1.55-.62-1.55-1.55-.62 1.55-.62z" fill="#FFE27A"/><circle cx="4.3" cy="19" r=".7" fill="#FFE9D2" opacity=".8"/></svg>`;
const ico=(n,cls='')=>n==='orbit'?ORBIT_LOGO:`<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${P[n]||P.info}" fill="currentColor"/></svg>`;

/* ------------------------------------------------------------- the phone's files */
const FILES={
 spec:{name:'My_Deadlines_spec.md',ph:'doc',meta:'Doc · today'},
 cv:{name:'Ayesha_CV_2025.pdf',img:'docs/cv.webp',t:'docs/cv-t.webp',meta:'PDF · 71 KB · May'},
 ielts:{name:'IELTS_Mock_Report.pdf',img:'docs/ielts.webp',t:'docs/ielts-t.webp',meta:'PDF · 2 MB · May'},
 rucei:{name:'RUCEI_Project_Report.pdf',img:'docs/rucei.webp',t:'docs/rucei-t.webp',meta:'PDF · 260 KB · May'},
 shortlist:{name:'Masters_Shortlist.jpg',img:'docs/shortlist.webp',t:'docs/shortlist-t.webp',meta:'Photo · May'},
 checklist:{name:'Application_Checklist.jpg',img:'docs/checklist.webp',t:'docs/checklist-t.webp',meta:'Photo · May'},
 attendance:{name:'RUCEI_Attendance_22Apr.jpg',img:'docs/attendance.webp',t:'docs/attendance-t.webp',meta:'Photo · Apr'},
 bigd:{name:'Internship_Form_June.jpg',img:'docs/bigd.webp',t:'docs/bigd-t.webp',meta:'Photo · Jun'},
 nid:{name:'NID_card_front.jpg',ph:'nid',meta:'Photo · Jan'},
 bank:{name:'Bank_Statement_Abbu.pdf',ph:'bank',meta:'PDF · Mar'}
};
function fileThumb(id,cls=''){
  const f=FILES[id]; if(!f) return '';
  if(f.t) return `<img class="${cls}" src="${f.t}" alt="" loading="lazy">`;
  if(f.ph==='nid') return `<svg class="${cls} ph" viewBox="0 0 60 80" style="background:#E8F1EA"><rect x="6" y="22" width="48" height="32" rx="4" fill="#fff" stroke="#3E7A4F" stroke-width="1.5"/><rect x="10" y="28" width="12" height="15" rx="2" fill="#B9C9BD"/><rect x="25" y="29" width="24" height="3" fill="#3E7A4F"/><rect x="25" y="35" width="20" height="2.5" fill="#9AB0A0"/><rect x="25" y="40" width="16" height="2.5" fill="#9AB0A0"/><rect x="10" y="47" width="40" height="3" fill="#C24B3E"/></svg>`;
  return `<svg class="${cls} ph" viewBox="0 0 60 80" style="background:#fff"><rect x="8" y="8" width="26" height="4" fill="#1B3A6B"/><rect x="8" y="16" width="44" height="2" fill="#bbb"/>${[24,30,36,42,48,54,60].map(y=>`<rect x="8" y="${y}" width="44" height="2" fill="#ddd"/><rect x="40" y="${y}" width="12" height="2" fill="#999"/>`).join('')}</svg>`;
}

/* ------------------------------------------------------------- state */
const KEY='afl2-state';
const S={lesson:null,beat:0,bn:false,ch:{},stage:false,mode:'pair',voice:true};
/* How the class is working: alone (at home), pairs (one phone, two students) or
   class (teacher up front on the projector). Kept per device, like a remembered tab. */
const MODES={
 solo:{i:'👤',n:'Alone',bn:'একা',d:'At home, on your own phone',dbn:'বাড়িতে, নিজের ফোনে'},
 pair:{i:'👥',n:'Pairs',bn:'জোড়ায়',d:'Two students, one phone',dbn:'দুজন শিক্ষার্থী, একটা ফোন'},
 class:{i:'🙋',n:'Class',bn:'পুরো ক্লাস',d:'Teacher up front, on the projector',dbn:'শিক্ষক সামনে, প্রজেক্টরে'}
};
function loadPrefs(){try{const v=JSON.parse(localStorage.getItem('afl-prefs')||'null');if(v){if(MODES[v.mode])S.mode=v.mode;if(typeof v.voice==='boolean')S.voice=v.voice}}catch(e){}}
function savePrefs(){try{localStorage.setItem('afl-prefs',JSON.stringify({mode:S.mode,voice:S.voice}))}catch(e){}}
const byMode=o=>o[S.mode]!==undefined?o[S.mode]:o.pair;
const LESSONS={}; const ORDER=[];
let prevScene=null, streamTimer=null, ghostBusy=false, renderedAt='';
function save(){try{sessionStorage.setItem(KEY,JSON.stringify({lesson:S.lesson,beat:S.beat,bn:S.bn,ch:S.ch}))}catch(e){}}
function load(){try{const v=JSON.parse(sessionStorage.getItem(KEY)||'null');if(v){Object.assign(S,v)}}catch(e){}}
function ctx(){
  const L=LESSONS[S.lesson]; const ch=S.ch[S.lesson]||(S.ch[S.lesson]={});
  return {ch,L,beat:L&&L.beats[S.beat],get streaming(){return S.streaming},set(k,v){ch[k]=v;save()},get(k,d){return k in ch?ch[k]:d},bn:S.bn,files:FILES,esc,ico};
}

/* ------------------------------------------------------------- clock */
const now=()=>{const d=new Date();let h=d.getHours()%12||12;return h+':'+String(d.getMinutes()).padStart(2,'0')};
const STORY_DATE='Saturday, 4 October';

/* ------------------------------------------------------------- APP RENDERERS */
const APPS={};
const appBar=(title,{left='back',right='',hitBack='',cls=''}={})=>`<div class="tab ${cls}">${left?`<button class="mi" ${hitBack?`data-hit="${hitBack}"`:'data-sys="back"'} aria-label="Back">${ico(left)}</button>`:''}<h1>${title}</h1>${right}</div>`;

APPS.lock=sc=>`<div class="view lock" data-theme="lock">
  <div class="clk"><div class="t">${now()}</div><div class="d">${STORY_DATE} · 31°C</div></div>
  <div class="notifs">${(sc.notifs||[]).map(n=>notif(n)).join('')}</div>
  <div class="hint">${sc.hint||'Tap a notification to open it'}</div></div>`;
const APPINFO={
 sathi:{n:'Sathi AI',i:'spark',b:'linear-gradient(135deg,#4F6BED,#B24FC8,#E06A8C)',c:'#fff'},
 orbit:{n:'Orbit',i:'orbit',b:'transparent',c:'#8A2E0B'},
 studio:{n:'Studio',i:'code',b:'#0B57D0',c:'#fff'},
 mail:{n:'Mail',i:'mail',b:'#FFDAD6',c:'#8C1D18'},
 cal:{n:'Calendar',i:'cal',b:'#D7E3FF',c:'#1B3A6B'},
 files:{n:'Files',i:'folder',b:'#D2E8D4',c:'#1F5130'},
 drive:{n:'Drive',i:'drive',b:'#FFF0C2',c:'#6B4A00'},
 docs:{n:'Docs',i:'doc',b:'#D7E3FF',c:'#1A4CA8'},
 settings:{n:'Settings',i:'gear',b:'#E1E2EC',c:'#3C4252'},
 wallet:{n:'Wallet',i:'wallet',b:'#FFD8E4',c:'#7D1946'},
 chats:{n:'Chats',i:'chat',b:'#CFF5D9',c:'#0E5A2A'},
 phone:{n:'Phone',i:'phone',b:'#D7E3FF',c:'#1B3A6B'},
 msgs:{n:'Messages',i:'msg',b:'#D7E3FF',c:'#1B3A6B'},
 browser:{n:'Browser',i:'globe',b:'#E1E2EC',c:'#3C4252'},
 camera:{n:'Camera',i:'camera',b:'#E1E2EC',c:'#3C4252'},
 photos:{n:'Photos',i:'image',b:'#FFDBCC',c:'#8A2E0B'},
 system:{n:'Android System',i:'shield',b:'#E1E2EC',c:'#3C4252'}
};
function notif(n){const a=APPINFO[n.app]||APPINFO.system;return `<button class="notif ${n.cls||''}" ${n.hit?`data-hit="${n.hit}"`:''}><span class="ap" style="background:${a.b};color:${a.c}">${ico(a.i)}</span><span><span class="meta">${esc(a.n)} · ${esc(n.time||'now')}</span><b>${esc(n.title)}</b><p>${esc(n.text)}</p></span></button>`}
function appIcon(id,hit){const a=APPINFO[id];return `<button class="app" data-hit="${hit||'app:'+id}"><span class="ai" style="--ib:${a.b};--ic:${a.c};background:${a.b};color:${a.c}">${ico(a.i)}</span>${esc(a.n)}</button>`}
APPS.home=sc=>`<div class="view home" data-theme="home">
  <div class="glance"><div class="d">Sat, 4 Oct</div><div class="w">☀ 31°C · Rajshahi</div></div>
  <div class="grid">${['sathi','orbit','studio','docs','mail','cal','files','settings'].map(id=>appIcon(id)).join('')}</div>
  <div class="search">${ico('search')}<span>Search</span></div>
  <div class="dock">${['phone','msgs','browser','camera'].map(id=>appIcon(id)).join('')}</div></div>`;

APPS.mail=sc=>{
  if(sc.view==='read'){const m=sc.mail;return `<div class="view">${appBar('',{right:`<button class="mi">${ico('trash')}</button><button class="mi">${ico('mail')}</button><button class="mi">${ico('more')}</button>`})}
   <div class="scroll"><div class="mailbody"><h2>${esc(m.subject)}</h2>
   <div class="sender"><span class="av" style="background:${m.color||'#7D5260'}">${esc(m.from[0])}</span><span><b>${esc(m.from)}</b><span>${m.to?'to '+esc(m.to):'to me'} · ${esc(m.time||'9:12 AM')}</span></span></div>
   ${m.body}${m.atts?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">${m.atts.map(a=>`<span class="chipm">${ico('file')} ${esc(a)}</span>`).join('')}</div>`:''}
   </div></div></div>`;}
  return `<div class="view">${appBar('Inbox',{left:'menu'})}<div class="scroll">${(sc.mails||[]).map(m=>`<button class="li ${m.unread?'unread':''}" ${m.hit?`data-hit="${m.hit}"`:''}><span class="av" style="background:${m.color}">${esc(m.from[0])}</span><span><b>${esc(m.from)}</b><p>${esc(m.subject)}</p></span><small>${esc(m.time)}</small></button>`).join('')}</div></div>`;
};

/* --- Sathi AI: a chat assistant, in the shape every AI chat app shares --- */
function composer(sc,dark){
  const c=sc.composer||{}; const x=ctx(); const val=c.key?(x.get(c.key,c.prefill||'')):(c.text||'');
  const atts=(c.atts||[]).map(id=>`<span class="att" data-view="${id}">${fileThumb(id)}<span>${esc(FILES[id].name)}</span></span>`).join('');
  const hl=hlHTML(val,(sc.kb&&sc.kb.chips)||[]);
  return `<div class="composer" ${c.hit?'':''}>${atts?`<div class="pend">${atts}</div>`:''}
   <div class="row"><button class="mi" ${c.attHit?`data-hit="${c.attHit}"`:''} aria-label="Add files">${ico('plus')}</button>
   <div class="cmpw">${hl?`<div class="cmp-hl" aria-hidden="true">${hl}&#8203;</div>`:''}<textarea id="cmp" class="${hl?'hl-on':''}" rows="1" inputmode="none" placeholder="${esc(c.placeholder||'Ask Sathi AI')}" ${c.key?`data-key="${c.key}"`:'readonly'}>${esc(val)}</textarea></div>
   ${val.trim()||atts?`<button class="send" data-hit="${c.sendHit||'send'}" aria-label="Send">${ico('send')}</button>`:`<button class="mi" aria-label="Voice">${ico('mic')}</button>`}</div></div>`;
}
function aiMsg(m,dark){
  return `<div class="msg-a" data-mid="${m.id||''}"><span class="spark">${ico('spark')}</span><div class="tx" ${m.stream?'data-stream="1"':''} ${m.speed?`data-speed="${m.speed}"`:''}>${m.html}</div></div>${m.actions!==false&&!m.thinking?`<div class="actions-row"><button class="mi">${ico('thumb')}</button><button class="mi">${ico('copy')}</button><button class="mi">${ico('share')}</button><button class="mi" ${m.moreHit?`data-hit="${m.moreHit}"`:''} aria-label="More">${ico('more')}</button></div>`:''}`;
}
function uMsg(m){
  const atts=(m.atts||[]).length?`<div class="att-row">${m.atts.map(id=>`<span class="att" data-view="${id}" role="button" title="Open">${fileThumb(id)}<span>${esc(FILES[id].name)}</span></span>`).join('')}</div>`:'';
  return `${atts}<div class="msg-u">${esc(m.text)}</div>`;
}
APPS.sathi=sc=>{
  const msgs=sc.msgs||[];
  const body=msgs.length?msgs.map(m=>m.role==='u'?uMsg(m):aiMsg(m)).join(''):`<div class="hello">Hello, Ayesha</div><p>How can I help today?</p>`;
  return `<div class="view sathi">${appBar('Sathi AI',{left:'menu',right:`<button class="mi" aria-label="New chat">${ico('edit')}</button><span class="mi"><span style="width:30px;height:30px;border-radius:99px;background:#C98E62;color:#fff;display:grid;place-items:center;font-weight:600;font-size:14px">A</span></span>`})}
   <div class="scroll" id="chatscroll">${body}</div>${sc.composer===false?'':composer(sc)}<div class="disclaim">Sathi AI can make mistakes, so double-check it</div></div>`;
};

APPS.picker=sc=>{
  const x=ctx(); const sel=x.get(sc.sel,[]);
  return `<div class="view picker"><div class="tab"><button class="mi" data-sys="back">${ico('close')}</button><h1>${sel.length?sel.length+' selected':'Choose files'}</h1><button class="mdbtn" style="margin-right:8px" data-hit="${sc.attachHit||'attach'}" ${sel.length?'':'disabled style="opacity:.4;margin-right:8px"'}>Attach</button></div>
  <div class="seglist"><span class="on">Recent</span><span>Downloads</span><span>Drive</span></div>
  <div class="scroll"><div class="fgrid">${sc.files.map(id=>`<button class="fcard ${sel.includes(id)?'on':''}" data-ui="pick:${id}"><span class="ck">${ico('check')}</span>${fileThumb(id)}<span>${esc(FILES[id].name)}</span><small>${esc(FILES[id].meta)}</small></button>`).join('')}</div></div></div>`;
};

APPS.doc=sc=>{const f=FILES[sc.file];const m=sc.mark;return `<div class="view docv" data-theme="dark">${appBar(esc(f.name),{right:`<button class="mi">${ico('share')}</button><button class="mi">${ico('more')}</button>`,hitBack:sc.backHit||''})}
  <div class="scroll"><div class="zoombox"><img src="${f.img}" alt="${esc(f.name)}">${m?`<div class="mark" style="left:${m[0]}%;top:${m[1]}%;width:${m[2]}%;height:${m[3]}%"></div>`:''}</div></div></div>`;};

APPS.gdoc=sc=>`<div class="view gdoc">${appBar(esc(sc.title||'Ayesha Rahman — Academic CV'),{right:`<button class="mi">${ico('edit')}</button><button class="mi" ${sc.shareHit?`data-hit="${sc.shareHit}"`:''}>${ico('share')}</button><button class="mi">${ico('more')}</button>`})}<div class="scroll">${sc.page}</div></div>`;

APPS.cal=sc=>`<div class="view cal">${appBar('October',{left:'menu',right:`<button class="mi">${ico('search')}</button><button class="mi">${ico('cal')}</button>`})}<div class="scroll">${sc.body}</div></div>`;

APPS.settings=sc=>`<div class="view settings">${appBar(esc(sc.title||'App info'))}<div class="scroll">${sc.body}</div></div>`;

APPS.orbit=sc=>`<div class="view orbit">${sc.bar!==false?appBar(sc.title||'Orbit',{left:sc.left===undefined?'back':sc.left,right:sc.right||`<button class="mi">${ico('history')}</button><button class="mi">${ico('more')}</button>`}):''}<div class="scroll">${sc.body}</div>${sc.composer?composer(sc):''}${sc.foot||''}</div>`;

APPS.studio=sc=>{
  const tabs=['Chat','Code','Preview'].concat(sc.git?['GitHub']:[]);
  return `<div class="view studio">${appBar(esc(sc.title||'My Deadlines'),{left:'back',right:`${sc.gitHit!==undefined||sc.git?`<button class="mi" ${sc.gitHit?`data-hit="${sc.gitHit}"`:''} aria-label="GitHub">${ico('git')}</button>`:''}<button class="mi" ${sc.deployHit?`data-hit="${sc.deployHit}"`:''} aria-label="Deploy">${ico('share')}</button><button class="mi">${ico('more')}</button>`})}
  <div class="stabs">${tabs.map(t=>`<button class="${(sc.tab||'Chat')===t?'on':''}" ${sc.tabHits&&sc.tabHits[t]?`data-hit="${sc.tabHits[t]}"`:''}>${t}</button>`).join('')}</div>
  ${sc.tab==='Preview'?`<div class="preview"><div class="pbar2"><span class="dot"></span> Preview · ${esc(sc.ver||'v1')}</div><div class="mini" id="mini">${sc.mini||''}</div></div>`:
    sc.tab==='Code'?`<div class="scroll">${sc.files?`<div class="ftree">${sc.files.map(f=>`<span class="${f===sc.fileOn?'on':''}">${esc(f)}</span>`).join('')}</div>`:''}<div class="code">${sc.code||''}</div></div>`:
    sc.tab==='GitHub'?`<div class="scroll">${sc.git||''}</div>`:
    `<div class="scroll" id="chatscroll">${(sc.msgs||[]).map(m=>m.role==='u'?uMsg(m):aiMsg(m)).join('')}</div>${sc.stopHit?`<div class="stopbar"><span class="orb"></span><span>${esc(sc.stopLabel||'Studio is thinking…')}</span><button data-hit="${sc.stopHit}">■ Stop</button></div>`:''}${sc.composer===false?'':composer(sc,true)}<div class="disclaim">Studio can make mistakes. Test your app.</div>`}
  </div>`;
};

APPS.chats=sc=>`<div class="view chats">${appBar(`<span style="display:flex;align-items:center;gap:10px"><span style="width:34px;height:34px;border-radius:99px;background:#0E5A2A;color:#fff;display:grid;place-items:center;font-size:15px">${esc(sc.group[0])}</span><span style="font-size:17px;line-height:1.1">${esc(sc.group)}<small style="display:block;font-size:12px;color:var(--md-on-surface-var);font-weight:400">${esc(sc.members||'')}</small></span></span>`,{right:`<button class="mi">${ico('phone')}</button><button class="mi">${ico('more')}</button>`})}
  <div class="scroll" id="chatscroll" style="padding:8px 10px;background:#EFEAE2">${sc.msgs.map(m=>`<div class="cb ${m.me?'me':''}">${m.me?'':`<b style="color:${m.color||'#0E5A2A'}">${esc(m.from)}</b>`}${m.html||esc(m.text)}<small>${esc(m.time||'')}${m.me?' ✓✓':''}</small></div>`).join('')}</div>
  <div class="composer" style="background:#fff;margin:6px 8px 8px"><div class="row"><button class="mi">${ico('plus')}</button><textarea rows="1" readonly placeholder="Message"></textarea><button class="mi">${ico('mic')}</button></div></div></div>`;
APPS.blank=sc=>`<div class="view">${sc.body||''}</div>`;

/* ------------------------------------------------------------- overlays */
function overlays(sc){
  let h='';
  if(sc.headsUp) h+=`<div class="headsup">${notif(sc.headsUp)}</div>`;
  if(sc.dialog){const d=sc.dialog;h+=`<div class="scrim"><div class="dlg">${d.icon?`<span class="di">${ico(d.icon)}</span>`:''}<h3>${d.title}</h3>${d.text?`<p>${d.text}</p>`:''}<div class="stack">${d.buttons.map(b=>`<button class="mdbtn ${b.cls||'tonal'} ${b.on?'':''}" ${b.ui?`data-ui="${b.ui}"`:''} ${b.hit?`data-hit="${b.hit}"`:''}>${b.label}</button>`).join('')}</div></div></div>`;}
  if(sc.sheet){const s=sc.sheet;h+=`<div class="scrim" style="align-items:flex-end;padding:0;background:rgba(0,0,0,.28)"></div><div class="sheet"><div class="handle"></div>${s.html}</div>`;}
  if(sc.skip) h+=`<div class="skipper"><div>${sc.skip.big==='⏪'?'<i class="rw">⏪</i>':clockHTML(sc.skip.big)}<b>${sc.skip.big==='⏪'?'':sc.skip.big}</b><span>${sc.skip.small||''}</span></div></div>`;
  return h;
}

/* a clock for “three hours later”: the hands tick like a clock, then spin */
function clockHTML(label){
  const w={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,a:1,an:1}; const m=String(label).toLowerCase().match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s+(minute|hour|day|week|month)/);
  const n=m?(w[m[1]]||+m[1]||1):0, unit=m?m[2]:''; const hrs=unit==='minute'?0.2:unit==='hour'?n:unit==='day'?n*6:unit==='week'?36:unit==='month'?60:5;
  const tk=Array.from({length:12},(_,i)=>`<i style="--r:${i*30}deg" class="${i%3?'':'q'}"></i>`).join('');
  return `<span class="clk" style="--hh:${Math.round(hrs*30+720)}deg"><span class="face">${tk}<b class="hh"></b><b class="mh"></b><u></u></span></span>`;
}

/* ------------------------------------------------------------- keyboard */
const ROWS=['qwertyuiop','asdfghjkl','zxcvbnm'];

/* colour-code the four parts of a prompt (Context, Product, Process, Performance) so students can see how it is built */
const PPPP=['Context','Product','Process','Performance'];
function hlHTML(val,chips){
  const segs=[]; chips.filter(c=>PPPP.includes(c.tag)).forEach(c=>{const i=val.indexOf(c.text); if(i>=0) segs.push({i,e:i+c.text.length,t:c.tag})});
  if(!segs.length) return ''; segs.sort((a,b)=>a.i-b.i); let o='',p=0;
  segs.forEach(g=>{ if(g.i<p) return; o+=esc(val.slice(p,g.i))+`<mark class="pp-${g.t}">${esc(val.slice(g.i,g.e))}</mark>`; p=g.e });
  return o+esc(val.slice(p));
}
/* sentence builder: ESL word-order practice. Tiles are chunks, tap or drag them into order. */
const bldItems=kb=>(kb.chips||[]).filter(c=>c.parts);
const bldCur=(kb,val)=>bldItems(kb).find(c=>!val.includes(c.text));
function bldTiles(c){
  const h=s=>{let n=7;for(const ch of s)n=(n*31+ch.charCodeAt(0))>>>0;return n};
  const all=c.parts.concat(c.extra||[]).map((t,i)=>({t,i})); all.sort((a,b)=>h(c.id+a.t)-h(c.id+b.t));
  if(all.slice(0,c.parts.length).every(z=>z.i<c.parts.length)&&all.every((z,k)=>z.i===k)) all.push(all.shift());
  return all;
}
function bldHTML(kb,val){
  const x=ctx(), items=bldItems(kb), cur=bldCur(kb,val);
  if(!cur) return `<div class="bld done">✓ ${tr('All sentences built. Now send ➤','সব বাক্য তৈরি হয়েছে। এবার পাঠাও ➤')}</div>`;
  const all=bldTiles(cur), pl=x.get('bld:'+kb.key,[]), bad=x.get('bld:'+kb.key+'!',0), n=items.indexOf(cur)+1;
  const txt=id=>(cur.parts.concat(cur.extra||[]))[id];
  return `<div class="bld ${bad?'bad':''}"><div class="bld-h"><b>${esc(cur.goal||'Build the sentence')}</b><span>${n}/${items.length}</span></div>
   <div class="bld-line" id="bldline">${pl.length?pl.map((id,k)=>`<button class="tile on" data-ui="untile:${k}">${esc(txt(id))}</button>`).join(''):`<em>${tr('Tap or drag the pieces here, in order','টুকরোগুলো ক্রমে এখানে চাপো বা টেনে আনো')}</em>`}</div>
   ${bad?`<div class="bld-tip">${esc(cur.tip||'Not quite. Check the order.')}</div>`:''}
   <div class="bld-pool">${all.filter(z=>!pl.includes(z.i)).map(z=>`<button class="tile" data-tile="${z.i}" data-ui="tile:${z.i}">${esc(z.t)}</button>`).join('')}</div></div>`;
}
function bldTap(kind,arg,x,at){
  const kb=activeKB(x), key='bld:'+kb.key; if(x.get(key+'!',0)) return;
  const cur=bldCur(kb,x.get(kb.key,'')); if(!cur) return; let pl=x.get(key,[]).slice();
  if(kind==='tile'){ const id=+arg; if(pl.includes(id)) return; if(at==null) pl.push(id); else pl.splice(at,0,id); }
  else pl.splice(+arg,1);
  try{FX.sfx('tick')}catch(e){}
  x.set(key,pl);
  if(pl.length===cur.parts.length){
    if(pl.every((v,k)=>v===k)){ x.set(key,[]); try{FX.sfx('ok')}catch(e){}; toggleChip(cur.id,x); return; }
    x.set(key+'!',1); try{FX.sfx('no')}catch(e){}
    setTimeout(()=>{ x.set(key,[]); x.set(key+'!',0); renderPhoneKeepFocus(); renderFoot(); },1500);
  }
  renderPhoneKeepFocus(); renderFoot();
}
/* drag a tile into the line (pointer events, so it works on touch too) */
(function(){ let d=null,dragged=false;
  document.addEventListener('pointerdown',e=>{ const t=e.target.closest&&e.target.closest('.tile[data-tile]'); if(!t) return; d={t,x:e.clientX,y:e.clientY,g:null}; });
  document.addEventListener('pointermove',e=>{ if(!d) return; if(!d.g){ if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<9) return; d.g=d.t.cloneNode(true); d.g.className='tile drag'; d.g.style.cssText='position:fixed;z-index:200;pointer-events:none;margin:0'; document.body.appendChild(d.g); d.t.style.opacity='.35'; }
    d.g.style.left=(e.clientX-d.g.offsetWidth/2)+'px'; d.g.style.top=(e.clientY-d.g.offsetHeight/2)+'px';
    const l=document.getElementById('bldline'); if(l){ const r=l.getBoundingClientRect(); l.classList.toggle('over',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top-14&&e.clientY<r.bottom+14); } });
  const end=e=>{ if(!d) return; const o=d; d=null; if(!o.g) return; o.g.remove(); o.t.style.opacity=''; dragged=true; setTimeout(()=>dragged=false,60);
    const l=document.getElementById('bldline'); if(!l) return; l.classList.remove('over'); const r=l.getBoundingClientRect();
    if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top-14&&e.clientY<r.bottom+14){ const ts=[...l.querySelectorAll('.tile')]; let at=ts.findIndex(z=>{const b=z.getBoundingClientRect();return e.clientX<b.left+b.width/2&&e.clientY<b.bottom}); if(at<0) at=null; bldTap('tile',o.t.dataset.tile,ctx(),at); } };
  document.addEventListener('pointerup',end); document.addEventListener('pointercancel',end);
  document.addEventListener('click',e=>{ if(dragged&&e.target.closest&&e.target.closest('.tile')){ e.stopPropagation(); e.preventDefault(); } },true);
})();
function keyboard(kb){
  const x=ctx(); const val=(kb&&kb.key)?x.get(kb.key,''):'';
  const bld=bldItems(kb).length;
  const chips=(kb.chips||[]).filter(c=>!(bld&&c.parts)).map(c=>{const used=val.includes(c.text);return `<button class="kchip ${used?'used':''} ${c.x?'x':''} t-${esc(c.tag||'')}" data-ui="chip:${c.id}"><span class="tg">${esc(c.tag||'')}</span>${esc(c.text)}</button>`}).join('');
  return (bld?bldHTML(kb,val):'')+`<div class="strip">${kb.label?`<span class="lbl">${esc(kb.label)}</span>`:''}${chips}${innerWidth<900?`<button class="kbt" data-ui="kbtoggle:1">${S.keys?'Hide keys':'⌨ Type'}</button>`:''}</div>
  <div class="rows">${ROWS.map((r,i)=>`<div class="kr">${i===2?`<button class="k w" data-ui="key:shift">⇧</button>`:''}${[...r].map(k=>`<button class="k" data-ui="key:${k}">${k}</button>`).join('')}${i===2?`<button class="k w" data-ui="key:bs">⌫</button>`:''}</div>`).join('')}
  <div class="kr"><button class="k w" data-ui="key:123">?123</button><button class="k w" data-ui="key:,">,</button><button class="k sp" data-ui="key: ">English</button><button class="k w" data-ui="key:.">.</button><button class="k go" data-ui="key:nl">↵</button></div></div>`;
}

/* ------------------------------------------------------------- render phone */
function renderPhone(anim){
  if(!S.lesson||!LESSONS[S.lesson]) return;
  const x=ctx(); const b=x.beat; if(!b) return; let sc=fn(b.scene,x)||{app:'home'};
  if(REW) sc=Object.assign({},prevScene||sc,{skip:{big:'⏪',small:S.bn?'আবার বেছে নাও':'Rewind'}});
  else if(cqOn()){ sc=Object.assign({},fn(CQ.then.scene,x)); if(CQ.phase==='jump') sc.skip={big:CQ.then.when,small:CQ.then.whensub||''}; }
  const dev=$('#device'); const scr=$('#screen');
  const theme=sc.theme||(sc.app==='lock'?'lock':sc.app==='home'?'home':(sc.app==='doc')?'dark':sc.app==='orbit'?'orbit':'light');
  const bgs={lock:'radial-gradient(130% 80% at 20% 0%,#C9B8F2 0,#8C77C9 40%,#3C2E6B 100%)',home:'radial-gradient(90% 60% at 80% 10%,#F2D6E6 0,transparent 60%),radial-gradient(100% 70% at 0% 100%,#BFD6F3 0,transparent 60%),linear-gradient(160deg,#E9DDFF,#D9E5FF)',dark:'#2b2b2f',orbit:'#FFF8F5',light:sc.app==='gdoc'?'#F0F0F4':sc.app==='studio'?'#F8FAFD':'var(--md-surface)'};
  dev.style.background=bgs[theme];
  const darkUI=theme==='lock'||theme==='dark';
  $('#sb').className='sb'+(darkUI?' dark':''); $('#navbar').className='navbar'+(darkUI?' dark':'');
  const r=APPS[sc.app]||APPS.blank;
  let html=r(sc,x);
  const key=sc.app+'|'+(sc.view||sc.tab||'');
  const prevKey=prevScene&&(prevScene.app+'|'+(prevScene.view||prevScene.tab||''));
  const keep=!anim&&prevKey===key&&renderedAt===S.lesson+'/'+S.beat?$$('.scroll',scr).map(e=>e.scrollTop):null;
  scr.innerHTML=html+overlays(sc); renderedAt=S.lesson+'/'+S.beat;
  if(sc.skip&&sc.skip.big!=='⏪'&&anim!==false) try{ FX.clock(scr); }catch(e){}
  const v=$('.view',scr);
  if(v){v.style.background='transparent';if(anim&&prevKey!==key){v.classList.add(prevScene&&prevScene.app===sc.app?'slide':'enter')}}
  const kb=$('#kb'); if(sc.kb){kb.hidden=false;kb.innerHTML=keyboard(sc.kb);kb.className='kb'+(innerWidth<900?' compact':'')+(S.keys?' keys':'')}else{kb.hidden=true;kb.innerHTML=''}
  prevScene=sc;
  // spotlight
  const tgt=fn(b.tap,x); const tgts=[].concat(tgt||[]).concat(fn(b.glow,x)||[]);
  tgts.forEach(t=>{const el=scr.querySelector(`[data-hit="${t}"]`)||$('#device').querySelector(`[data-hit="${t}"]`);if(el){el.classList.add('hl');if(getComputedStyle(el).borderRadius.startsWith('999')||el.classList.contains('app')||el.classList.contains('send')||el.classList.contains('mi'))el.classList.add('round')}});
  // chat scroll to end / to anchor
  const cs=$('#chatscroll',scr); if(cs){ if(sc.scrollTo){const a=cs.querySelector(sc.scrollTo);if(a)cs.scrollTop=a.offsetTop-12;} else cs.scrollTop=cs.scrollHeight; }
  if(keep) $$('.scroll',scr).forEach((e,i)=>{ if(keep[i]!=null) e.scrollTop=keep[i]; });
  // streaming AI messages
  const st=$('[data-stream]',scr);
  if(st){ const mid=st.closest('[data-mid]'); const id=S.lesson+':'+((mid&&mid.dataset.mid)||S.beat); const seen=x.get('_streamed',{}); if(!seen[id]){ streamIn(st,cs,()=>{seen[id]=1;x.set('_streamed',seen);onStreamDone()}) } else st.removeAttribute('data-stream'); }
  // composer: keep in sync with chips/keys
  const ta=$('#cmp',scr);
  if(ta){ autoGrow(ta); ta.scrollTop=ta.scrollHeight; const hlb=ta.parentNode.querySelector('.cmp-hl'); const syncHl=()=>{ if(hlb) hlb.scrollTop=ta.scrollTop; }; syncHl(); ta.addEventListener('scroll',syncHl,{passive:true}); ta.addEventListener('input',()=>{ if(ta.dataset.key){x.set(ta.dataset.key,ta.value);composeChanged()} autoGrow(ta)}); }
  if(b.hunt) huntMark(x,b,scr);
  if(b.afterRender) b.afterRender(x,scr);
}
function autoGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight,112)+'px'}

/* type an AI answer out, text node by text node — feels like a live reply */
function streamIn(el,scroller,done){
  clearInterval(streamTimer);
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); const nodes=[]; let n;
  while(n=walker.nextNode()) nodes.push([n,n.nodeValue]);
  nodes.forEach(([t])=>t.nodeValue='');
  const blocks=$$(':scope > *',el); blocks.forEach(b=>b.style.visibility='hidden');
  const dots=document.createElement('div');dots.className='typing';dots.innerHTML='<i></i><i></i><i></i>';el.prepend(dots);
  let i=0,pos=0; S.streaming=true;
  const finish=()=>{clearInterval(streamTimer);nodes.forEach(([t,v])=>t.nodeValue=v);blocks.forEach(b=>b.style.visibility='');dots.remove();el.removeAttribute('data-stream');S.streaming=false;S.finishStream=null;done&&done()};
  S.finishStream=finish;
  setTimeout(()=>{ if(!S.streaming) return; dots.remove();
    streamTimer=setInterval(()=>{
      let budget=+(el.dataset.speed||7);
      while(budget>0&&i<nodes.length){const [t,v]=nodes[i];const step=Math.min(budget,v.length-pos);t.nodeValue=v.slice(0,pos+step);pos+=step;budget-=step;
        let p=t.parentElement;while(p&&p!==el){if(p.parentElement===el)p.style.visibility='';p=p.parentElement}
        if(pos>=v.length){i++;pos=0}}
      if(scroller) scroller.scrollTop=scroller.scrollHeight;
      if(i>=nodes.length) finish();
    },16);
  },650);
}
function onStreamDone(){ if(!S.lesson) return; const cs=$('#chatscroll'); const top=cs?cs.scrollTop:0; renderPhone(false); const c2=$('#chatscroll'); if(c2) c2.scrollTop=top; renderUI(); }


/* ============================================================= PLAY
 * One screen at a time — the shape students already know from Duolingo:
 *   top    ✕ back to the lock screen · progress through the stages · ★ · বাংলা · ⋯
 *   Cog    the coach: one line, read aloud, 🔊 to hear it again
 *   stage  EITHER Ayesha's phone (where she acts) OR a card (a question, a sort,
 *          a gear earned). Never both, so there is always one place to look.
 *   footer the one next thing: Continue — with Show me, her files or a hint
 *   sheet  feedback slides up from the bottom: green, amber or red
 * On a laptop the phone sits on the left and Cog, the sheet and the footer
 * stand beside it. */
const T=(en,bn)=>`${en}${bn?`<span class="bn" lang="bn">${bn}</span>`:''}`;
const BN=t=>t?`<span class="bn" lang="bn">${t}</span>`:'';
const tr=(en,bn)=>S.bn&&bn?`${en} <span class="bn-in" lang="bn">· ${bn}</span>`:en;
const IC={
 x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 dots:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.2" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><circle cx="19" cy="12" r="2.2" fill="currentColor"/></svg>',
 back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3L2.9 9.4l6.4-.7z" fill="currentColor"/></svg>'
};
/* Cog — a gear of the four Ds with the film's gold hub for a face. It takes the
   colour of the D in use, turns while it talks, and frowns when a choice goes wrong. */
const COG=(()=>{ const N=12,TT=360/N,R=42,A=6,rad=a=>a*Math.PI/180,pt=(r,a)=>`${(r*Math.cos(rad(a))).toFixed(2)} ${(r*Math.sin(rad(a))).toFixed(2)}`, p=[];
  for(let k=0;k<N;k++){const c=k*TT; p.push(`${k?'L':'M'}${pt(R-A,c-.33*TT)}`,`L${pt(R+A,c-.21*TT)}`,`A${R+A} ${R+A} 0 0 1 ${pt(R+A,c+.21*TT)}`,`L${pt(R-A,c+.33*TT)}`,`A${R-A} ${R-A} 0 0 1 ${pt(R-A,c+.67*TT)}`)}
  const G=p.join('')+'Z', H=Array.from({length:6},(_,i)=>{const a=(i*60+30)*Math.PI/180;return `<circle cx="${(30.5*Math.cos(a)).toFixed(1)}" cy="${(30.5*Math.sin(a)).toFixed(1)}" r="3.6"/>`}).join('');
  return `<svg class="cog" viewBox="-50 -50 100 100" aria-hidden="true"><defs>
  <radialGradient id="cogHi" cx="34%" cy="26%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  <radialGradient id="cogHub" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="#FFF8DE"/><stop offset=".45" stop-color="#EBCB82"/><stop offset="1" stop-color="#A27830"/></radialGradient></defs>
  <g class="g-teeth"><path d="${G}" class="g-body"/><path d="${G}" fill="url(#cogHi)"/><g class="g-holes">${H}</g><circle r="24.5" class="g-ring"/></g>
  <circle r="22.5" class="g-face" fill="url(#cogHub)"/>
  <g class="g-eyes"><rect x="-10" y="-9" width="6" height="9.5" rx="3"/><rect x="4" y="-9" width="6" height="9.5" rx="3"/></g>
  <g class="g-glint"><circle cx="-7.6" cy="-6.6" r="1.4"/><circle cx="6.4" cy="-6.6" r="1.4"/></g>
  <path class="g-brow" d="M-13 -14 L-4 -17 M13 -14 L4 -17"/>
  <path class="g-smile" d="M-6 5.5 Q0 10.5 6 5.5"/><path class="g-frown" d="M-5 9 Q0 5.5 5 9"/><ellipse class="g-mouth" cx="0" cy="7.5" rx="4" ry="3"/></svg>`; })();

let UI={sheet:null,sub:null};

/* ---- which beats this way of working shows: Alone skips the projector warm-up and partner talk ---- */
function shown(L,i){ const b=L&&L.beats[i]; if(!b) return false;
  if(S.mode==='solo'&&(b.stage==='warm'||b.only==='class')) return false;
  if(b.only==='solo'&&S.mode!=='solo') return false; return true; }
function seek(L,i,dir){ for(let j=i;j>=0&&j<L.beats.length;j+=dir) if(shown(L,j)) return j; return -1; }

/* ---- stars: one for each good call made first time ---- */
function firstTry(x,key,ok){ const a=x.get('_aw',{}); if(key in a) return; a[key]=ok?1:0; x.set('_aw',a); if(ok){ x.set('_score',x.get('_score',0)+1); paintScore(true); } }
function paintScore(pop){ const s=$('#p-score'); if(!s||!S.lesson) return; $('b',s).textContent=ctx().get('_score',0); if(pop){ s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); } }

/* ---- the 4D gear of a beat ---- */
function beatD(L,i){ const b=L.beats[i]; if(!b) return null; if(b.d==='none') return null; const st=L.stages.find(s=>s.id===b.stage)||{}; return b.d||st.d||null; }
function usedDs(L,upto){ const u={}; for(let j=0;j<=upto;j++){const d=beatD(L,j); if(d) u[d]=1;} return u; }

/* ---------------------------------------------------------------- top bar */
function renderTop(){
  const top=$('#ptop'); const inL=!!S.lesson; document.body.classList.toggle('inlesson',inL);
  const right=`<button class="p-ic p-bn" data-p="bn" lang="bn" aria-pressed="${S.bn}" title="বাংলা">বাংলা</button><button class="p-ic" data-p="menu" aria-label="Menu">${IC.dots}</button>`;
  if(!inL){ top.innerHTML=`<a class="p-logo" href="../" title="All activities"><img src="../brand/dialogue-logo.png" alt="Dialogue"></a><div class="p-title"><b>AI Fluency Lab</b><small>Ayesha’s phone</small></div>${right}`; return; }
  const L=LESSONS[S.lesson], x=ctx();
  const segs=L.stages.map(st=>({st,idx:L.beats.map((b,i)=>i).filter(i=>L.beats[i].stage===st.id&&shown(L,i))})).filter(s=>s.idx.length);
  const cur=L.stages.find(s=>s.id===L.beats[S.beat].stage)||{};
  top.innerHTML=`<button class="p-ic" data-p="exit" aria-label="Back to Ayesha’s lock screen" title="Lock screen">${IC.x}</button>
   <div class="p-mid"><div class="p-prog" role="group" aria-label="${esc(L.title)}: ${esc(cur.label||'')}. Tap a section to jump to it.">${segs.map(s=>{const done=s.idx.filter(i=>i<S.beat).length+(s.idx.includes(S.beat)?.6:0);
     return `<button type="button" class="psegb" data-p="seg" data-i="${s.idx[0]}" style="flex:${s.idx.length}" title="Go to: ${esc(s.st.label)}" aria-label="Go to ${esc(s.st.label)}"><span class="pseg ${s.st.d?'d-'+s.st.d:'warm'} ${s.st.id===cur.id?'on':''}"><i style="width:${(100*done/s.idx.length).toFixed(1)}%"></i></span></button>`}).join('')}</div>
     <small class="p-stage">${esc(L.title)} · <b>${esc(cur.label||'')}</b></small></div>
   <span class="p-score" id="p-score" title="Stars: good calls, first time">${IC.star}<b>${x.get('_score',0)}</b></span>${right}`;
}

/* ---------------------------------------------------------------- Cog's line */
const HUB={en:'This is Ayesha’s phone. Today, you are Ayesha. Choose a mission: tap a notification.',bn:'এটা আয়েশার ফোন। আজ তুমিই আয়েশা। একটা মিশন বেছে নাও: একটা নোটিফিকেশনে চাপো।'};
function coachText(){
  if(!S.lesson) return {en:HUB.en,bn:HUB.bn,kick:'Cog · your coach'};
  const x=ctx(), b=x.beat, L=x.L, d=beatD(L,S.beat);
  if(cqOn()){ const t=CQ.then; return {en:CQ.phase==='jump'?'…':t.line,bn:CQ.phase==='jump'?'':t.linebn,kick:`⏩ ${t.when}`,cq:1}; }
  if(UI.sub==='talk'){ const tk=fn(b.talk,x)||{}, hd=TALK_HEAD[S.mode]; return {en:tk.q||hd.en,bn:tk.qbn||'',kick:`${hd.i} ${hd.en}`}; }
  const m=d&&D4.META[d];
  return {en:fn(b.say,x)||'',bn:fn(b.bn,x)||'',sub:fn(b.sub,x)||'',subbn:fn(b.subbn,x)||'',kick:m?`${m.n} · ${m.v}`:(b.kick||'')};
}
function renderCoachLine(){
  const c=coachText(), box=$('#pcoach');
  const d=S.lesson?beatD(LESSONS[S.lesson],S.beat):null;
  box.style.setProperty('--gc',d?`var(--d-${d})`:'#B9924F'); box.classList.toggle('cq',!!c.cq);
  $('#p-say').innerHTML=`${c.kick?`<small class="k">${esc(c.kick)}</small>`:''}<p class="say">${c.en}</p>${BN(c.bn)}${c.sub?`<p class="sub">${c.sub}${BN(c.subbn)}</p>`:''}`;
  const ear=$('#p-ear'); ear.dataset.speak=canon(c.en); ear.hidden=!c.en||c.en==='…';
}

/* ---------------------------------------------------------------- the stage: phone or card */
function stageKind(){ if(!S.lesson||cqOn()||REW) return 'phone'; const b=ctx().beat; if(UI.sub) return 'card'; return (b.view==='card'||b.wide)?'card':'phone'; }
function renderStage(){
  const k=stageKind(), was=document.body.classList.contains('show-card')?'card':'phone';
  document.body.classList.toggle('show-card',k==='card'); document.body.classList.toggle('show-phone',k!=='card');
  const pc=$('#pcard');
  if(k==='card'){ const keep=was==='card'&&pc.dataset.at===S.lesson+'/'+S.beat+(UI.sub||'')?pc.scrollTop:0; const fresh=pc.dataset.at!==S.lesson+'/'+S.beat+(UI.sub||''); const abc=!UI.sub&&fn(ctx().beat.card,ctx()); if(!fresh&&abc&&abc.type==='alt'){ fitDevice(); return; } pc.innerHTML=cardScreen(); pc.dataset.at=S.lesson+'/'+S.beat+(UI.sub||'');
    if(fresh&&!UI.sub){ const bc=fn(ctx().beat.card,ctx()); if(bc&&bc.type==='level') setTimeout(()=>FX.gearTurned(pc,bc.d),60); else if(bc&&bc.type==='result') setTimeout(()=>FX.missionDone(pc),60); else if(bc&&bc.type==='alt') setTimeout(()=>ALT.play(pc,{card:bc,bn:S.bn,speak:t=>speak(t),voice:()=>S.voice}),60); } pc.scrollTop=keep; if(was!=='card'||!keep) pc.firstElementChild&&pc.firstElementChild.classList.add('enter'); }
  else { pc.innerHTML=''; pc.dataset.at=''; }
  fitDevice();
}
function cardScreen(){
  const x=ctx(), b=x.beat;
  if(UI.sub==='talk') return `<div class="pc-in">${talkCard(x,b)}</div>`;
  const c=fn(b.card,x); let h=c?cardHTML(c,x):'';
  if(!c&&b.talk) h=talkCard(x,b);
  return `<div class="pc-in ${c?'t-'+c.type:'t-talk'}">${h}</div>`;
}

/* ---------------------------------------------------------------- what this step still needs */
function stepState(x,b){
  if(UI.sub==='talk') return {read:1};
  const c=fn(b.card,x);
  if(b.view==='card'||b.wide){
    if(!c) return {read:1};
    if(c.type==='choice') return {act:x.get(c.key)==null,card:1};
    if(c.type==='sort'){ const a=x.get(c.key,{}); return {act:c.items.some((it,i)=>a[i]!==it.ans),card:1,show:1}; }
    if(c.type==='pickeach'){ const a=x.get(c.key,{}); return {act:c.items.some((it,i)=>a[i]==null),card:1,show:1}; }
    if(c.type==='checklist'){ const a=x.get(c.key,{}); return {act:c.items.some((it,i)=>!a[i]),card:1}; }
    return {read:1};
  }
  if(S.streaming) return {stream:1};
  const st={docs:fn(b.docs,x)||[],hint:fn(b.hint,x)};
  if(b.ask) return Object.assign(st,{ask:x.get(b.ask.key)==null});
  if(b.hunt){ const h=huntState(x,b); return Object.assign(st,{hunt:h,act:h.found<h.need,show:1}); }
  if(b.decide){ const d=fn(b.decide,x); return Object.assign(st,{act:x.get(d.key)==null,show:1}); }
  if(b.tap||b.compose||b.pickShow) return Object.assign(st,{act:!(b.done&&b.done(x)),show:1,meter:b.compose?meterHTML(x,b):''});
  if(b.showMe) return Object.assign(st,{act:!(b.done&&b.done(x)),show:1});
  return Object.assign(st,{read:1});
}

/* ---------------------------------------------------------------- footer */
function renderFoot(){
  const f=$('#pfoot');
  if(!S.lesson){ f.innerHTML=hubFoot(); return; }
  const x=ctx(), b=x.beat;
  if(cqOn()){ f.innerHTML=''; return; }
  const st=stepState(x,b), last=seek(x.L,S.beat+1,1)<0;
  const tools=[];
  if(st.show&&!UI.sub) tools.push(`<button class="pb tool" data-c="show" title="Show me (S)"><span aria-hidden="true">👆</span><span class="tl">${tr('Show me','দেখাও')}</span></button>`);
  if(st.docs&&st.docs.length) tools.push(`<button class="pb tool" data-c="files"><span aria-hidden="true">📁</span><span class="tl">${tr('Her files','তার ফাইল')}</span></button>`);
  if(st.hint) tools.push(`<button class="pb tool" data-c="hint"><span aria-hidden="true">💡</span><span class="tl">${tr('Think','ভাবো')}</span></button>`);
  if(st.ask){ f.innerHTML=`<div class="askcol">${b.ask.options.map((o,i)=>`<button class="pb ask" data-ask="${i}">${o.en}${S.bn&&o.bn?` <span class="bn-in" lang="bn">· ${o.bn}</span>`:''}</button>`).join('')}</div>`; f.classList.remove('acting'); return; }
  let main;
  const label=fn(b.next,x);
  if(st.stream&&b.interrupt) main=`<button class="pb quiet" data-c="next">${tr('Let it finish','শেষ করতে দাও')}</button><button class="pb stop" data-c="stop"><span aria-hidden="true">■</span> ${tr('Stop','থামাও')}</button>`;
  else if(st.stream) main=`<button class="pb quiet" data-c="next">${tr('Skip','বাদ দাও')+' ▸▸'}</button>`;
  else if(st.act) main=`<button class="pb quiet" data-c="${st.hunt?'huntdone':'next'}">${st.hunt?tr('I’m done','শেষ'):tr('Skip','বাদ দাও')}</button>`;
  else main=`<button class="pb primary" data-c="next">${label||(last?tr('Finish','শেষ'):tr('Continue','এগিয়ে যাও'))}</button>`;
  const back=`<button class="pb tool back" data-c="back" aria-label="Back" title="Back">${IC.back}</button>`;
  f.innerHTML=`${st.meter||''}${st.hunt?`<div class="hcount">${huntDots(st.hunt)}</div>`:''}<div class="frow">${back}${tools.join('')}<span class="grow"></span>${main}</div>`;
  f.classList.toggle('acting',!!st.act&&!st.card);
}
function hubFoot(){
  return `<div class="frow hub"><button class="pb ghost film" data-c="intro"><span aria-hidden="true">▶</span> ${tr('Watch: the four Ds','দেখো: চারটা D')} <small>3 min</small></button></div>
   <div class="modeseg" role="group" aria-label="How are you working?">${Object.keys(MODES).map(k=>`<button class="${S.mode===k?'on':''}" data-mode="${k}" aria-pressed="${S.mode===k}"><span aria-hidden="true">${MODES[k].i}</span> ${MODES[k].n}</button>`).join('')}</div>`;
}
/* the prompt recipe as a row of pills that light up as the parts go in */
function meterHTML(x,b){
  const c=fn(b.compose,x); if(!c||!c.slots) return ''; const val=x.get(c.key,c.prefill||'');
  return `<div class="meter">${c.slots.map(s=>{const on=s.test.some(r=>r.test(val));return `<span class="${on?'on':''} pp-${esc(s.label)}">${on?'✓':'○'} ${esc(s.label)}</span>`}).join('')}</div>`;
}

/* ---------------------------------------------------------------- feedback sheet */
const TONE={ok:['Yes!','হ্যাঁ!'],think:['Think again','আবার ভাবো'],bad:['Risky','ঝুঁকিপূর্ণ'],info:['','']};
function fbSheet(o,retry){
  const tone=o.ok?'ok':o.ok===0?'think':'bad';
  const acts=tone==='ok'?[['next',tr('Continue','এগিয়ে যাও'),'primary']]:[['retry',tr('Try again','আবার চেষ্টা করো'),'ghost'],['next',tr('Continue','এগিয়ে যাও'),'primary']];
  const more=typeof o.more==='function'?o.more(ctx()):(o.more||'');
  return {tone,title:o.title||TONE[tone][0],titlebn:TONE[tone][1],html:`<p>${o.why||''}${BN(o.whybn)}</p>${more}`,acts:retry?acts:[['next',tr('Continue','এগিয়ে যাও'),'primary']],retry};
}
function renderSheet(){
  const sh=$('#psheet'); const s=UI.sheet;
  if(!s&&!(cqOn()&&CQ.phase==='show')){ sh.hidden=true; sh.innerHTML=''; document.body.classList.remove('sheet-on'); return; }
  let o=s;
  if(!o){ const t=CQ.then, hd=TALK_HEAD[S.mode];
    o={tone:'bad',title:t.when,cq:1,html:`<p class="cq-line">${esc(t.line)}${BN(t.linebn)}</p>${t.why?`<p>${t.why}${BN(t.whybn)}</p>`:''}
      ${S.mode!=='solo'?`<div class="cq-talk"><b>${hd.i} ${CQ_ASK.en}</b>${BN(CQ_ASK.bn)}<div class="fr" data-say="${esc(CQ_FRAME.en)}"><span>${gapped(CQ_FRAME.en)}${BN(CQ_FRAME.bn)}</span>${sayBtn(CQ_FRAME.en)}</div></div>`:''}`,
      acts:[['rewind',`↩ ${tr('Choose again','আবার বেছে নাও')}`,'ghost'],['next',tr('Continue','এগিয়ে যাও'),'primary']]}; }
  sh.hidden=false; document.body.classList.add('sheet-on');
  sh.className='psheet t-'+o.tone;
  const fresh=sh.dataset.k!==String(o.title)+'|'+String((o.html||'').length)+'|'+o.tone;
  sh.innerHTML=`<div class="sh-in">${o.title?`<h3>${o.tone==='ok'?'✓ ':o.tone==='bad'?(o.cq?'⏩ ':'⚠ '):o.tone==='think'?'↺ ':''}${esc(o.title)}${o.titlebn&&S.bn?` <span class="bn-in" lang="bn">· ${o.titlebn}</span>`:''}</h3>`:''}<div class="sh-body">${o.html||''}</div>
   <div class="frow">${(o.acts||[]).map(([a,l,c])=>`<button class="pb ${c}" data-s="${a}">${l}</button>`).join('')}</div></div>`;
  const p=$('.pb.primary',sh); if(p&&!matchMedia('(pointer:coarse)').matches) p.focus({preventScroll:true});
  sh.dataset.k=String(o.title)+'|'+String((o.html||'').length)+'|'+o.tone;
  // every explanation can be heard — and plays by itself when an answer needs another look
  const say=o.tone==='info'?'':sheetSpeech(sh);
  if(say){ const h3=$('h3',sh); const ear=document.createElement('button'); ear.className='ear sh-ear'; ear.dataset.speak=canon(say); ear.setAttribute('aria-label','Listen'); ear.textContent='🔊'; (h3||$('.sh-in',sh)).appendChild(ear); }
  if(fresh&&!o.cq){ try{ if(o.tone==='ok') FX.sfx('ok'); else if(o.tone==='think'||o.tone==='bad') FX.sfx('no'); }catch(e){}
    if(say&&S.voice&&(o.tone==='think'||o.tone==='bad'||o.tone==='ok')) setTimeout(()=>{ if(UI.sheet===s&&sh.dataset.k===String(o.title)+'|'+String((o.html||'').length)+'|'+o.tone) speak(say); },o.tone==='ok'?500:350); }
}
function sheetSpeech(sh){
  const body=$('.sh-body',sh); if(!body) return ''; const b=body.cloneNode(true);
  b.querySelectorAll('.bn,.bn-in,.looks,.verd2,.quote,.cq-talk,.fgrid2,button,svg,.ear,.miss .claim').forEach(e=>e.remove());
  const h=$('h3',sh); let title=''; if(h){ const c=h.cloneNode(true); c.querySelectorAll('.bn-in,.ear').forEach(e=>e.remove()); title=c.textContent.replace(/^[✓⚠↺⏩\s]+/,'').trim(); if(title&&!/[.!?…]$/.test(title)) title+='.'; }
  const t=plain(b.textContent).replace(/Eye-sha/g,'Ayesha'); return ((title?title+' ':'')+t).trim();
}
function closeSheet(){ UI.sheet=null; renderSheet(); renderFoot(); }
function ppClick(e){
  const ppb=e.target.closest('[data-pp]'); if(!ppb) return false;
  if(ppb.dataset.pp==='goid'){ goId(ppb.dataset.id); return true; }
  const pp=ppb.closest('.pp'), a=ppb.dataset.pp; let n=+pp.dataset.s||0;
  if(a==='re'){ pp.classList.remove('min'); n=0; } else if(a==='next'){ if(n>=4){ if(pp.closest('#pcard')) next(true); else { pp.classList.add('min'); ctx().set('ppDone',1); } return true; } n++; } else if(a==='prev') n=Math.max(0,n-1);
  pp.dataset.s=n; ctx().set('ppStep',n); const nx=pp.querySelector('[data-pp=next]'), pv=pp.querySelector('[data-pp=prev]'); if(nx) nx.textContent=n>=4?'Got it ✓':'Next ›'; if(pv) pv.disabled=n===0; return true;
}
function onSheetClick(e){
  const dv=e.target.closest('[data-view]'); if(dv){ openView(dv.dataset.view,dv.dataset.mark); return; }
  if(ppClick(e)) return;
  const kwb=e.target.closest('[data-kw]'); if(kwb){ kwPick(+kwb.dataset.kw); return; }
  const hv=e.target.closest('[data-hv]'); if(hv){ huntVerdict(hv.dataset.hv); return; }
  const sp=e.target.closest('[data-speak]'); if(sp){ speak(sp.dataset.speak); sp.classList.add('speaking'); return; }
  const sy=e.target.closest('[data-say]'); if(sy){ speak(sy.dataset.say); sy.classList.add('speaking'); return; }
  const s=e.target.closest('[data-s]'); if(!s) return; const a=s.dataset.s, o=UI.sheet;
  if(a==='close'){ closeSheet(); return; }
  if(a==='rewind'){ rewindCQ(); return; }
  if(a==='retry'){ const r=o&&o.retry; UI.sheet=null; if(typeof r==='function') r(ctx()); renderUI(); return; }
  if(a==='next'){ const after=o&&o.after; UI.sheet=null; if(after){ after(ctx()); return; }
    // a consequence on a step that still has its own task (a hunt, a question): back to the task
    if(!o&&cqOn()){ const bb=ctx().beat; if(bb.hunt||bb.ask){ CQ=null; document.body.classList.remove('cq-on'); hush(); renderPhone(true); renderUI(); if(S.voice) speak(coachText().en); return; } }
    next(true); return; }
  if(a==='huntnext'){ UI.sheet=null; renderUI(); return; }
}

/* ---------------------------------------------------------------- her files */
function filesSheet(ids){
  UI.sheet={tone:'info',title:S.bn?'আয়েশার ফাইল':'Ayesha’s files',html:`<p class="sub" style="margin:0 0 8px">${S.bn?'খুলতে চাপো।':'Tap a file to open it.'}</p><div class="fgrid2">${ids.map(d=>{const id=d.f||d;return `<button data-view="${id}" ${d.m?`data-mark="${d.m}"`:''}>${fileThumb(id)}<span>${esc(d.t||FILES[id].name.replace(/_/g,' ').replace(/\.(pdf|jpg)$/,''))}</span></button>`}).join('')}</div>`,acts:[['close',tr('Close','বন্ধ করো'),'ghost']]};
  renderSheet();
}
function hintSheet(h){
  UI.sheet={tone:'info',title:S.bn?'আগে ভাবো':'Think first',html:`<ul class="plist">${h.map(t=>`<li><span class="ic">${t.i||'•'}</span><span>${t.en}${BN(t.bn)}</span></li>`).join('')}</ul>`,acts:[['close',tr('Got it','বুঝেছি'),'primary']]};
  renderSheet();
}

/* ---------------------------------------------------------------- spot what isn't true */
function huntState(x,b){ const h=fn(b.hunt,x), a=x.get(h.key,{}); const bad=h.lines.filter(l=>l.v!=='ok');
  return {h,a,need:bad.length,found:bad.filter(l=>a[l.id]==='bad').length,cleared:h.lines.filter(l=>l.v==='ok'&&a[l.id]==='ok').length}; }
function huntDots(s){ return `<span class="hd-l">🔍 ${S.bn?'পাওয়া গেছে':'Found'}</span>${s.h.lines.filter(l=>l.v!=='ok').map(l=>`<i class="${s.a[l.id]==='bad'?'on':''}"></i>`).join('')}<b>${s.found}/${s.need}</b>`; }
function huntMark(x,b,scr){
  const s=huntState(x,b);
  scr.querySelectorAll('.ln[data-ui^="line:"]').forEach(el=>{ const id=el.dataset.ui.slice(5); const ans=s.a[id];
    el.classList.toggle('hunt',!ans); el.classList.toggle('v-bad',ans==='bad'); el.classList.toggle('v-ok',ans==='ok'); });
}
const kwNorm=t=>String(t).toLowerCase().replace(/[^\p{L}\p{N}.%\/]+/gu,'').replace(/\.$/,'');
const claimToks=l=>String(l.text).split(/\s+/).filter(w=>kwNorm(w));
const lookHTML=l=>l.look&&l.look.length?`<div class="looks"><span>${S.bn?'২ · স্ক্যান: ফাইলটা খোলো। শুধু মানচিত্রে যেখানে বলেছে সেখানে দেখো।':'2 · Scan: open the file. Read only where your map points.'}</span>${l.look.map(k=>`<button class="look" data-view="${k.f}" ${k.m?`data-mark="${k.m}"`:''}>📄 ${esc(k.t||FILES[k.f].name)}</button>`).join('')}</div>`:'';
const verdHTML=id=>`<div class="verd3"><button data-hv="${id}|ok"><i>✓</i>TRUE<small>${S.bn?'ফাইল একই বলে':'the file says the same'}</small></button><button data-hv="${id}|bad"><i>✗</i>FALSE<small>${S.bn?'ফাইল উল্টো বলে':'the file says the opposite'}</small></button><button data-hv="${id}|ng"><i>?</i>NOT GIVEN<small>${S.bn?'ফাইলে কিছুই নেই':'the file says nothing'}</small></button></div>`;
const kwDone=l=>!l.kw||(UI.hs&&UI.hs.id===l.id&&UI.hs.pick.length>=Math.min(2,l.kw.length));
function kwPick(i){
  const x=ctx(), b=x.beat; if(!b.hunt||!UI.hs) return; const l=fn(b.hunt,x).lines.find(z=>z.id===UI.hs.id); if(!l) return;
  const w=claimToks(l)[i]; if(w==null) return; const n=kwNorm(w);
  if(UI.hs.pick.includes(i)) return;
  if(l.kw.map(kwNorm).includes(n)){ UI.hs.pick.push(i); UI.hs.tip=''; try{FX.sfx('ok')}catch(e){} }
  else { UI.hs.tip=n.length<=3||['and','the','with','for','from'].includes(n)?(S.bn?`“${w}” একটা ছোট শব্দ। নাম, সংখ্যা বা জোরালো শব্দ খোঁজো।`:`“${w}” is a small word. Scan for a name, a number or a strong word.`):(S.bn?'ওটা নয়। কোন শব্দটা ফাইলে খুঁজলে উত্তর পাবে?':'Not that one. Which word will lead you to the answer in the file?'); UI.hs.miss=i; try{FX.sfx('no')}catch(e){} }
  openLine(l.id);
}
function openLine(id){
  const x=ctx(), b=x.beat, s=huntState(x,b), l=s.h.lines.find(z=>z.id===id); if(!l) return;
  const ans=s.a[id];
  if(ans){ UI.sheet={tone:ans==='bad'?'bad':'ok',title:ans==='bad'?(l.vd==='NG'?'NOT GIVEN':(S.bn?'সত্য নয়':'FALSE')):(S.bn?'সত্য':'TRUE'),html:`<p class="claim">“${l.text}”</p><p>${l.why}${BN(l.whybn)}</p>`,acts:[['close',tr('OK','ঠিক আছে'),'primary']]}; renderSheet(); return; }
  if(l.kw&&(!UI.hs||UI.hs.id!==id)) UI.hs={id,pick:[],tip:''};
  if(!kwDone(l)){
    const toks=claimToks(l);
    UI.sheet={tone:'info',title:S.bn?'এটা কি সত্য?':'Is this true?',html:`<p class="kwq">${S.bn?'১ · কীওয়ার্ড: ফাইলে কোন ২টা শব্দ খুঁজবে? নাম, সংখ্যা বা জোরালো শব্দে চাপো।':'1 · Keywords: which 2 words will you scan for? Tap names, numbers or strong words.'}</p>
      <div class="kws">${toks.map((w,i)=>`<button data-kw="${i}" ${l.kw.map(kwNorm).includes(kwNorm(w))?'data-ok="1"':''} class="${UI.hs.pick.includes(i)?'hit':UI.hs.miss===i&&UI.hs.tip?'miss':''}">${esc(w)}</button>`).join('')}</div><div class="kwhint">${UI.hs.tip||''}</div>`,acts:[['close',tr('Not now','এখন না'),'ghost']]};
    renderSheet(); return;
  }
  const toks=claimToks(l);
  UI.sheet={tone:'info',title:S.bn?'এটা কি সত্য?':'Is this true?',html:`<p class="claim">“${l.kw?toks.map(w=>l.kw.map(kwNorm).includes(kwNorm(w))?`<mark class="kwm">${esc(w)}</mark>`:esc(w)).join(' '):l.text}”</p>
    ${lookHTML(l)}<p class="kwq" style="margin-top:8px">${S.bn?'৩ · যাচাই: একই কথা বলছে কি?':'3 · Check: same person, same action, same size?'}</p>${verdHTML(id)}`,acts:[['close',tr('Not now','এখন না'),'ghost']]};
  renderSheet();
}
function huntVerdict(arg){
  const [id,v]=arg.split('|'); const x=ctx(), b=x.beat, h=fn(b.hunt,x), l=h.lines.find(z=>z.id===id); const want=l.v==='ok'?'ok':(l.vd==='NG'?'ng':'bad');
  firstTry(x,h.key+':'+id,v===want);
  if(v===want){ const a=x.get(h.key,{}); a[id]=v==='ok'?'ok':'bad'; x.set(h.key,a);
    const s=huntState(x,b); const all=s.found===s.need;
    UI.sheet={tone:'ok',title:v==='bad'?(S.bn?'ধরেছ! FALSE — ফাইল উল্টো বলে।':'Caught it! FALSE — the file says the opposite.'):v==='ng'?(S.bn?'ধরেছ! NOT GIVEN — ফাইলে কিছুই নেই।':'Caught it! NOT GIVEN — her files say nothing.'):(S.bn?'হ্যাঁ, TRUE।':'Yes — TRUE. It matches.'),
      html:`<p class="claim">“${l.text}”</p><p>${l.why}${BN(l.whybn)}</p>${l.src?`<div class="quote"><small>${esc(l.src)}</small>${l.quote||''}</div>`:''}${all?`<div class="good">🎉 ${S.bn?`${s.need}টাই পেয়েছ!`:`All ${s.need} found!`}</div>`:''}`,
      acts:[[all?'next':'huntnext',all?tr('Continue','এগিয়ে যাও'):tr('Find the next one','পরেরটা খোঁজো'),'primary']]};
    UI.hs=null;
  } else {
    const gen=want==='bad'&&v==='ng'?(S.bn?'NOT GIVEN মানে ফাইলে কিছুই নেই। এখানে ফাইল অন্য কথা বলছে — সেটা FALSE।':'NOT GIVEN means the file says nothing. Here the file says something different — that is FALSE.')
      :want==='ng'&&v==='bad'?(S.bn?'FALSE মানে ফাইল উল্টো বলে। এখানে ফাইলে এটার কথাই নেই — NOT GIVEN।':'FALSE means the file says the opposite. Here the file never mentions it — that is NOT GIVEN.')
      :(l.hint||(want==='ok'?(S.bn?'ফাইলের সাথে মিলিয়ে দেখো — মেলে কি?':'Open her file and compare. Does it match?'):(S.bn?'ফাইলে ঠিক এটাই লেখা আছে কি?':'Does her file say exactly this?')));
    UI.sheet={tone:'think',title:S.bn?'আবার দেখো':'Look again',html:`<p class="claim">“${l.text}”</p><p>${gen}${BN(l.hintbn)}</p>${lookHTML(l)}${verdHTML(id)}`,acts:[]};
  }
  renderPhone(false); renderSheet(); renderFoot(); renderTop();
}
function askPick(i){
  const x=ctx(), b=x.beat, o=b.ask.options[i]; if(!o) return; x.set(b.ask.key,i); firstTry(x,b.ask.key,!!o.ok);
  const undo=x2=>{ delete x2.ch[b.ask.key]; save(); };
  if(o.then){ startCQ(Object.assign({why:o.why,whybn:o.whybn},o.then),undo); return; }
  UI.sheet=fbSheet(o,undo); renderUI();
}
function huntDone(){
  const x=ctx(), b=x.beat, s=huntState(x,b); const left=s.h.lines.filter(l=>l.v!=='ok'&&s.a[l.id]!=='bad');
  if(!left.length){ next(true); return; }
  UI.sheet={tone:'think',title:S.bn?`তুমি ${s.found}টা পেয়েছ, মোট ${s.need}টার মধ্যে`:`You found ${s.found} of ${s.need}`,html:`<p>${S.bn?'বাকিগুলো:':'Here are the others:'}</p>${left.map(l=>`<div class="miss"><p class="claim">“${l.text}”</p><p>${l.why}${BN(l.whybn)}</p></div>`).join('')}`,
    acts:[['huntnext',tr('Keep looking','খুঁজতে থাকো'),'ghost'],['next',tr('Continue','এগিয়ে যাও'),'primary']]};
  renderSheet();
}

/* ---------------------------------------------------------------- render everything */
function renderUI(){ renderTop(); renderCoachLine(); renderStage(); renderFoot(); renderSheet(); }
function renderCoach(){ renderUI(); }

/* --- cards --- */
function cardHTML(c,x){
  if(!c) return '';
  const head=c.title?`<h2 class="ct">${c.title}${BN(c.titlebn)}</h2>`:'';
  if(c.type==='html') return head+c.html;
  if(c.type==='words') return head+wordsCard(c);
  if(c.type==='story') return head+storyCard(c);
  if(c.type==='phrases') return head+phrasesCard(c);
  if(c.type==='alt') return head+ALT.html(c,S.bn);
  if(c.type==='level') return levelCard(c,x);
  if(c.type==='result') return resultCard(c,x);
  if(c.type==='info') return `<div class="card">${head}${c.html||''}${c.points?`<ul class="plist">${c.points.map(p=>`<li><span class="ic">${p.i||'•'}</span><span>${p.en}${BN(p.bn)}</span></li>`).join('')}</ul>`:''}</div>`;
  if(c.type==='sort'){
    const ans=x.get(c.key,{});
    return head+`<div class="sort">${c.items.map((it,i)=>{const a=ans[i];const right=a===it.ans;return `<div class="srow ${a!=null?(right?'right':'wrong'):''}"><div class="it">${it.en}${BN(it.bn)}</div>
     <div class="seg">${c.bins.map(bn=>`<button class="${a===bn.id?'pick':''}" data-sort="${c.key}|${i}|${bn.id}">${bn.label}</button>`).join('')}</div>
     ${a!=null?`<div class="why ${right?'':'no'}"><b>${right?'✓':'↺'}</b> ${right?it.why:(it.hint||it.why)}${S.bn?BN(right?it.whybn:(it.hintbn||it.whybn)):''}</div>`:''}</div>`}).join('')}</div>`;
  }
  if(c.type==='choice'){
    CHOICES[c.key]=c.options; const a=x.get(c.key);
    return head+`${c.pic?`<div class="cpic">${c.pic}</div>`:''}<div class="opts ${c.cls||''}">${c.options.map((o,i)=>`<button class="opt ${a===i?'pick '+(o.ok?'right':'wrong'):''}" data-choice="${c.key}|${i}">${o.en}${BN(o.bn)}</button>`).join('')}</div>`;
  }
  if(c.type==='checklist'){
    const on=x.get(c.key,{});
    return head+`<div class="chk">${c.items.map((it,i)=>`<button class="${on[i]?'on':''}" data-tick="${c.key}|${i}"><i>${on[i]?'✓':''}</i><span><b>${it.en}</b>${it.sub?`<small>${it.sub}</small>`:''}${BN(it.bn)}</span></button>`).join('')}</div>`;
  }
  if(c.type==='pickeach'){
    const ans=x.get(c.key,{});
    return head+`<div class="sort">${c.items.map((it,i)=>{const a=ans[i];const o=a!=null?it.options[a]:null;return `<div class="srow"><div class="it lab">${it.label}${BN(it.bn)}</div>
     <div class="opts">${it.options.map((op,j)=>`<button class="opt ${a===j?'pick '+(op.ok?'right':'wrong'):''}" data-pe="${c.key}|${i}|${j}">${op.en}</button>`).join('')}</div>
     ${o?`<div class="why ${o.ok?'':'no'}">${o.why}${BN(o.whybn)}</div>`:''}</div>`}).join('')}</div>`;
  }
  return '';
}
/* a gear earned: the D lights up in the set, with its English */
function levelCard(c,x){
  const L=x.L, m=D4.META[c.d], used={};
  L.beats.slice(0,S.beat+1).forEach(bb=>{ const cc=bb.card&&typeof bb.card!=='function'?bb.card:null; if(cc&&cc.type==='level') used[cc.d]=1; });
  const fr=c.phrase||D4.SAY[c.d].frames[0];
  return `<div class="lvl d-${c.d}"><div class="lvl-gear">${D4.svg({on:c.d,used,loops:true,cls:'big'})}</div>
   <small class="lvl-k">${S.bn?'গিয়ার ঘুরেছে':'Gear turned'} · ${Object.keys(used).length}/4</small>
   <h2>${m.n}${BN(m.nbn)}</h2><p class="lvl-v"><b>${m.v}.</b> ${c.did||m.q}${BN(c.didbn||m.qbn)}</p>
   <div class="lvl-say" data-say="${esc(fr.en)}"><span>“${gapped(fr.en)}”${BN(fr.bn)}</span>${sayBtn(fr.en)}</div>
   <small class="lvl-tip">${S.bn?'জোরে বলো।':'Say it out loud.'}</small></div>`;
}
/* the end of a mission: what happened, the stars, the four gears */
function resultCard(c,x){
  const sc=x.get('_score',0), aw=x.get('_aw',{}), max=Object.keys(aw).length;
  x.set('_finished',true);
  return `<div class="res">${c.html||''}
   <div class="res-stars">${IC.star}<b data-to="${sc}">${sc}</b><span>${S.bn?'প্রথমবারেই সঠিক সিদ্ধান্ত':'good calls, first time'}</span></div>
   <div class="res-gears">${D4.svg({on:'all',loops:true,sweet:true,cls:'all'})}<p>${S.bn?'চারটা গিয়ারই ঘুরেছে। যেখানে মেলে, সেটাই AI fluency।':'All four gears turned. Where they meet is AI fluency.'}</p></div>
   ${c.say?`<div class="card"><h3>${S.bn?'তোমার ইংরেজি':'Your English today'}</h3><div class="dphr">${['del','des','dis','dil'].filter(d=>c.say[d]).map(d=>`<div class="dph d-${d}" data-say="${esc(c.say[d].en)}">${D4.badge(d,30)}<span><small>${D4.META[d].n}</small><span class="pq">${c.say[d].en}</span>${BN(c.say[d].bn)}</span>${sayBtn(c.say[d].en)}</div>`).join('')}</div></div>`:''}
   ${c.next?`<div class="pick-cards">${c.next.map(id=>{const L2=LESSONS[id];return L2?`<button class="pcard" data-start="${id}"><span class="pi" style="background:${L2.tint}">${L2.emoji}</span><span><em>${S.bn?'পরের মিশন':'Next mission'}</em><b>${esc(L2.title)}</b><span>${esc(L2.blurb)}</span></span></button>`:''}).join('')}</div>`:''}</div>`;
}
/* ---- listening & speaking cards ---- */
const gapped=t=>esc(t).replace(/___/g,'<i class="gap"></i>');
function wordsCard(c){
  return `<div class="words"><div class="wgrid">${c.items.map((w,i)=>`<button class="wtile" data-word="${i}" data-say="${esc(w.w+'. '+w.ex)}"><span class="we" aria-hidden="true">${w.e}</span><b>${esc(w.w)}</b><span class="wex">${esc(w.ex)}</span>${BN(w.bn)}</button>`).join('')}</div></div>`;
}
function storyCard(c){
  return `<div class="tale" id="story"><div class="tpanels" style="--n:${c.panels.length}">${c.panels.map((p,i)=>`<figure class="tpanel" data-pi="${i}" data-say="${esc(p.en)}"><div class="pe" aria-hidden="true">${p.e}</div><figcaption>${esc(p.en)}${BN(p.bn)}</figcaption><span class="pn">${i+1}</span></figure>`).join('')}</div>
   <div class="row"><button class="btn gold" data-story="play">▶ ${S.bn?'শোনো':'Listen'}</button><button class="btn quiet" data-story="words">${S.bn?'শব্দগুলো দেখাও':'Show the words'}</button></div></div>`;
}
function phrasesCard(c){
  return `<div class="phrases"><div class="dphr">${['del','des','dis','dil'].filter(d=>c.items[d]).map(d=>{const it=c.items[d],m=D4.META[d];return `<div class="dph d-${d}" data-say="${esc(it.en)}">${D4.badge(d,34)}<span><small>${m.n} · ${m.v}</small><span class="pq">${gapped(it.en)}</span>${BN(it.bn)}</span>${sayBtn(it.en)}</div>`}).join('')}</div>
   <div class="row"><button class="btn gold" data-phrases="all">▶ ${S.bn?'সবগুলো শোনো, তারপর বলো':'Hear all four, then repeat'}</button></div></div>`;
}
let seqId=0;
function playSeq(els,cls,done){
  hush(); let i=0; const my=++seqId;
  const step=()=>{ if(my!==seqId) return; els.forEach(e=>e.classList.remove(cls)); if(i>=els.length){done&&done();return}
    const el=els[i++]; el.classList.add(cls); el.scrollIntoView({block:'nearest',behavior:'smooth'});
    speak(el.dataset.say,()=>setTimeout(step,S.mode==='class'?1100:700)); };
  step();
}

/* the talk moment: Pairs and Class only — the same question, set up for how the class is working */
const TALK_HEAD={
 solo:{i:'🗣',en:'Say it out loud',bn:'জোরে জোরে বলো'},
 pair:{i:'👥',en:'Talk to your partner',bn:'সঙ্গীর সাথে কথা বলো'},
 class:{i:'🙋',en:'Talk to the person next to you',bn:'পাশের জনের সাথে কথা বলো'}
};
let TIMER={left:0,total:0,id:null};
let REC={mr:null,chunks:[],url:null,on:false};
function resetTalk(){ clearInterval(TIMER.id); TIMER={left:0,total:0,id:null}; if(REC.mr&&REC.on){try{REC.mr.stop()}catch(e){}} if(REC.url) URL.revokeObjectURL(REC.url); REC={mr:null,chunks:[],url:null,on:false}; }
function talkCard(x,b){
  const t=fn(b.talk,x); if(!t) return ''; const hd=TALK_HEAD[S.mode];
  const roles=t.roles&&S.mode!=='solo'?`<div class="roles">${t.roles.map((r,i)=>`<span><b>${'AB'[i]}</b>${esc(r.en)}${BN(r.bn)}</span>`).join('')}</div>`:'';
  const solo=S.mode==='solo'?`<div class="rec">${REC.url?`<audio controls src="${REC.url}"></audio>`:''}<button class="btn ${REC.on?'':'quiet'}" data-rec="${REC.on?'stop':'start'}">${REC.on?'■ Stop':'● '+(REC.url?'Record again':'Record yourself')}</button></div>`:'';
  const timer=t.time&&S.mode!=='solo'?`<button class="ttimer" data-tt="${t.time}" aria-label="Timer"><span class="ttbar"></span><span class="tt">⏱ ${Math.floor(t.time/60)}:${String(t.time%60).padStart(2,'0')}</span></button>`:'';
  return `<div class="card talk ${t.big?'big':''}"><div class="talk-h"><span class="ti" aria-hidden="true">${hd.i}</span><b>${hd.en}${BN(hd.bn)}</b>${timer}</div>
   ${t.q?`<p class="tq">${t.pic?`<span class="tpic" aria-hidden="true">${t.pic}</span>`:''}<span>${esc(t.q)}${BN(t.qbn)}</span>${sayBtn(t.q)}</p>`:''}
   ${roles}
   <div class="frames">${(t.frames||[]).map(f=>`<div class="fr" data-say="${esc(f.en)}"><span>${gapped(f.en)}${BN(f.bn)}</span>${sayBtn(f.en)}</div>`).join('')}</div>
   ${t.model?`<button class="model" data-speak="${esc(t.model)}">🎧 ${S.bn?'একটা উদাহরণ শোনো':'Hear an example'}</button><p class="model-t" hidden>${esc(t.model)}</p>`:''}
   ${solo}</div>`;
}
function paintTimer(){
  const el=$('#pcard .ttimer'); if(!el||!TIMER.total) return;
  const l=Math.max(0,TIMER.left); $('.tt',el).textContent=(l?'⏱ ':'✓ ')+Math.floor(l/60)+':'+String(l%60).padStart(2,'0');
  $('.ttbar',el).style.width=(100*(TIMER.total-l)/TIMER.total)+'%'; el.classList.toggle('run',!!TIMER.id); el.classList.toggle('end',l===0);
}
function chime(){ try{ const a=new (window.AudioContext||window.webkitAudioContext)(); [660,880].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=f;o.connect(g);g.connect(a.destination);const t0=a.currentTime+i*.22;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.25,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+.5);o.start(t0);o.stop(t0+.55)}); }catch(e){} }
function toggleTimer(sec){
  if(TIMER.id){ clearInterval(TIMER.id); TIMER.id=null; paintTimer(); return; }
  if(!TIMER.total||TIMER.left<=0) TIMER={left:sec,total:sec,id:null};
  hush(); TIMER.id=setInterval(()=>{ TIMER.left--; if(TIMER.left<=0){ clearInterval(TIMER.id); TIMER.id=null; chime(); } paintTimer(); },1000); paintTimer();
}
async function recToggle(kind){
  if(kind==='stop'){ if(REC.mr) REC.mr.stop(); return; }
  try{
    hush(); const st=await navigator.mediaDevices.getUserMedia({audio:true});
    REC.chunks=[]; REC.mr=new MediaRecorder(st); REC.on=true;
    REC.mr.ondataavailable=e=>REC.chunks.push(e.data);
    REC.mr.onstop=()=>{ st.getTracks().forEach(t=>t.stop()); REC.on=false; if(REC.url) URL.revokeObjectURL(REC.url); REC.url=URL.createObjectURL(new Blob(REC.chunks,{type:REC.mr.mimeType||'audio/webm'})); renderStage(); };
    REC.mr.start(); renderStage();
  }catch(e){ REC.on=false; const r=$('#pcard .rec'); if(r) r.innerHTML=`<small>${S.bn?'মাইক্রোফোন পাওয়া যায়নি। জোরে বলো — নিজের কানে শোনো।':'No microphone here. Say it out loud anyway — listen to yourself.'}</small>`; }
}

/* ---- document viewer: opens over everything, so her files are never hidden behind a tab ---- */
let VIEW=null;
function openView(id,mark){
  const f=FILES[id]; if(!f||!f.img) return;
  const marks=(mark||'').split(';').filter(Boolean).map(m=>m.split(',').map(Number));
  VIEW={id,marks,zoom:1};
  if(marks.length){ const w=Math.max(...marks.map(m=>m[0]+m[2]))-Math.min(...marks.map(m=>m[0])); VIEW.zoom=Math.min(3,Math.max(1.6,92/w)); }
  const v=$('#viewer'); v.hidden=false;
  v.innerHTML=`<div class="vbox"><div class="tab"><button class="mi" data-vclose="1" aria-label="Close">${ico('back')}</button><h1>${esc(f.name)}</h1><button class="mi" data-vzoom="-1" aria-label="Zoom out">−</button><button class="mi" data-vzoom="1" aria-label="Zoom in">+</button></div>
   <div class="vscroll"><div class="vpage"><img src="${f.img}" alt="${esc(f.name)}">${marks.map(m=>`<i class="vmark" style="left:${m[0]}%;top:${m[1]}%;width:${m[2]}%;height:${m[3]}%"></i>`).join('')}</div></div>
   <div class="vhint">${marks.length?(S.bn?'সোনালি দাগের জায়গাটা পড়ো · টেনে সরাও':'Read the part inside the gold box · drag to move'):(S.bn?'দুই আঙুলে বড় করো · টেনে সরাও':'Pinch or + to zoom · drag to move')}</div>
   <button class="vdone" data-vclose="1">${S.bn?'ফিরে যাও':'Back'}</button></div>`;
  applyZoom(true); bindViewerGestures($('.vscroll',v));
}
function zoomAt(z,cx,cy){
  const sc=$('#viewer .vscroll'); const pg=$('#viewer .vpage'); if(!sc||!pg) return;
  z=Math.max(1,Math.min(4,z)); const r=sc.getBoundingClientRect(); const k=(r.width/sc.offsetWidth)||1;
  const px=(cx-r.left)/k, py=(cy-r.top)/k;
  const fx=(sc.scrollLeft+px)/pg.offsetWidth, fy=(sc.scrollTop+py)/pg.offsetHeight;
  VIEW.zoom=z; pg.style.transition='none'; pg.style.width=(z*100)+'%';
  sc.scrollLeft=fx*pg.offsetWidth-px; sc.scrollTop=fy*pg.offsetHeight-py;
  requestAnimationFrame(()=>pg.style.transition='');
}
function bindViewerGestures(sc){
  let drag=null, pinch=null;
  sc.addEventListener('pointerdown',e=>{ if(e.pointerType==='touch') return; drag={x:e.clientX,y:e.clientY,l:sc.scrollLeft,t:sc.scrollTop,moved:0}; sc.setPointerCapture(e.pointerId); sc.classList.add('grabbing'); });
  sc.addEventListener('pointermove',e=>{ if(!drag) return; const k=(sc.getBoundingClientRect().width/sc.offsetWidth)||1; const dx=(e.clientX-drag.x)/k, dy=(e.clientY-drag.y)/k; drag.moved=Math.max(drag.moved,Math.abs(dx)+Math.abs(dy)); sc.scrollLeft=drag.l-dx; sc.scrollTop=drag.t-dy; });
  const end=()=>{ drag=null; sc.classList.remove('grabbing'); };
  sc.addEventListener('pointerup',end); sc.addEventListener('pointercancel',end);
  sc.addEventListener('dblclick',e=>{ zoomAt(VIEW.zoom<2?2.5:1,e.clientX,e.clientY); });
  sc.addEventListener('wheel',e=>{ if(!e.ctrlKey) return; e.preventDefault(); zoomAt(VIEW.zoom*Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*0.006),e.clientX,e.clientY); },{passive:false});
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  sc.addEventListener('touchstart',e=>{ if(e.touches.length===2){ pinch={d:dist(e.touches),z:VIEW.zoom}; e.preventDefault(); } },{passive:false});
  sc.addEventListener('touchmove',e=>{ if(pinch&&e.touches.length===2){ e.preventDefault(); const cx=(e.touches[0].clientX+e.touches[1].clientX)/2, cy=(e.touches[0].clientY+e.touches[1].clientY)/2; zoomAt(pinch.z*dist(e.touches)/pinch.d,cx,cy); } },{passive:false});
  sc.addEventListener('touchend',e=>{ if(e.touches.length<2) pinch=null; });
}
function applyZoom(center){
  const v=$('#viewer'); const pg=$('.vpage',v); const sc=$('.vscroll',v); pg.style.width=(VIEW.zoom*100)+'%';
  if(!center||!VIEW.marks.length) return;
  const go=()=>{const m=VIEW.marks[0]; const x=Math.min(...VIEW.marks.map(z=>z[0])); sc.scrollLeft=pg.offsetWidth*x/100-12; sc.scrollTop=pg.offsetHeight*m[1]/100-sc.clientHeight*0.3;};
  const img=$('img',pg); if(img.complete) go(); else img.addEventListener('load',go,{once:true});
}
function closeView(){ VIEW=null; const v=$('#viewer'); if(v){v.hidden=true;v.innerHTML='';} }
function onViewerClick(e){
  if(e.target.closest('[data-vclose]')||e.target.id==='viewer'){ closeView(); return; }
  const vz=e.target.closest('[data-vzoom]'); if(vz){const r=$('#viewer .vscroll').getBoundingClientRect(); zoomAt(VIEW.zoom+(+vz.dataset.vzoom)*0.5,r.left+r.width/2,r.top+r.height/2);}
}

const CHOICES={};
const choiceOpt=(x,k,i)=>{ const o=(CHOICES[k]||[])[i]; return o&&o.then?Object.assign({},o,{then:Object.assign({why:o.why,whybn:o.whybn},o.then)}):o; };
/* ---- what happens next: a risky choice plays out on the phone. Show, don't
   tell: the student sees the result (a sent email, a paid scam, an upset
   parent), then rewinds and chooses again — or keeps going (nothing is locked). ---- */
const CQS=[]; let CQ=null, REW=false;
const CQ_ASK={en:'What went wrong? Say it.',bn:'কী ভুল হলো? বলো।'};
const CQ_FRAME={en:'She ___, so ___.',bn:'সে ___, তাই ___।'};
function conseq(lesson,c){ c.lesson=lesson; CQS.push(c); return c; }
const cqOn=()=>!!(CQ&&S.lesson&&CQ.bk===S.lesson+'/'+S.beat);
function startCQ(then,rewind){
  const bk=S.lesson+'/'+S.beat; CQ={bk,then,rewind,phase:'jump'}; UI.sheet=null; UI.sub=null;
  hush(); document.body.classList.add('cq-on'); renderPhone(true); renderUI();
  setTimeout(()=>{ if(!cqOn()||CQ.phase!=='jump') return; CQ.phase='show'; renderPhone(true); renderUI(); if(S.voice){ const t=CQ.then; speak(t.line,()=>{ if(cqOn()&&CQ.phase==='show'&&t.why) setTimeout(()=>{ if(cqOn()&&CQ.phase==='show') speak(plain(t.why).replace(/Eye-sha/g,'Ayesha')); },350); }); } },1700);
}
function rewindCQ(){
  if(!CQ) return; const r=CQ.rewind, at=S.lesson+'/'+S.beat; CQ=null; hush(); document.body.classList.remove('cq-on');
  REW=true; renderPhone(false); renderUI();
  setTimeout(()=>{ REW=false; const x=ctx(); if(r) r(x); if(S.lesson+'/'+S.beat===at){ renderPhone(true); renderUI(); } },800);
}
function goId(id){ const L=LESSONS[S.lesson]; const i=L?L.beats.findIndex(b=>b.id===id):-1; if(i>=0) go(i); }
/* take a shortcut chip's words back out of what the student wrote */
function unsay(x,key,texts){ let v=x.get(key,''); [].concat(texts).forEach(t=>{v=v.replace(t,'')}); x.set(key,v.replace(/\s{2,}/g,' ').trim()); }

/* ------------------------------------------------------------- navigation */
function go(i,anim=true,dir=1){
  const L=LESSONS[S.lesson]; if(!L) return;
  i=Math.max(0,Math.min(L.beats.length-1,i|0));
  if(!shown(L,i)){ const j=seek(L,i,dir); i=j<0?seek(L,i,-dir):j; if(i<0) i=Math.max(0,seek(L,0,1)); }
  for(let k=0;k<40;k++){ const bb=L.beats[i]; let p=false; try{ p=!!(bb&&bb.pass&&bb.pass(ctx())); }catch(e){} if(!p) break; const j=seek(L,i+dir,dir); if(j<0) break; i=j; }
  if(S.finishStream) S.finishStream();
  if(VIEW) closeView();
  CQ=null; UI={sheet:null,sub:null}; document.body.classList.remove('cq-on');
  const moved=S.beat!==i||anim; S.beat=Math.max(0,Math.min(L.beats.length-1,i)); save();
  resetTalk(); hush();
  setAddr(S.lesson+'/'+S.beat);
  const x=ctx(); if(x.beat.enter) x.beat.enter(x);
  document.body.classList.toggle('wide',!!x.beat.wide);
  renderPhone(anim); renderUI();
  const cq=x.beat.cq&&fn(x.beat.cq,x); if(cq){ startCQ(cq,cq.rewind); return; }
  if(S.voice&&moved) autoVoice(x);
  prefetchAround();
  if(x.beat.auto){ const at=S.beat; setTimeout(()=>{ if(S.beat===at&&S.lesson===L.id) next(true) },x.beat.auto) }
}
function next(force){
  const x=ctx(); if(!force&&S.streaming&&S.finishStream){S.finishStream();return}
  if(S.streaming&&S.finishStream&&force) S.finishStream();
  const b=x.beat;
  // Pairs and Class: a talk moment follows the step, on its own card
  const talkCardItself=(b.view==='card'||b.wide)&&!b.card;
  if(!UI.sub&&b.talk&&!talkCardItself&&S.mode!=='solo'&&fn(b.talk,x)){ UI.sub='talk'; UI.sheet=null; hush(); renderUI(); if(S.voice){ const tk=fn(b.talk,x); setTimeout(()=>speak(tk.q),300); } return; }
  if(b.leave) b.leave(x);
  const j=seek(x.L,S.beat+1,1);
  if(j<0){ x.set('_finished',true); hub(); return }
  go(j);
}
function back(){ if(UI.sub){ UI.sub=null; renderUI(); return; } const L=LESSONS[S.lesson]; const j=seek(L,S.beat-1,-1); if(j<0){hub();return} go(j,true,-1) }
/* The address follows the student: #cv/4 inside a workflow, nothing on the lock screen.
   Starting a workflow adds one history step, so the phone's Back button (or the
   browser's) returns to Ayesha's lock screen instead of leaving the activity. */
function setAddr(h,push){ try{ const url=location.pathname+location.search+(h?'#'+h:''); if(location.pathname+location.search+location.hash===url) return; history[push?'pushState':'replaceState'](null,'',url); }catch(e){} }
function start(id){ closeMenu(); S.lesson=id; S.beat=0; prevScene=null; const c=S.ch[id]; if(c){ delete c._score; delete c._aw; } maybeFullscreen(); setAddr(id+'/0',true); go(seek(LESSONS[id],0,1)); }
function hub(){ S.lesson=null; S.beat=0; save(); prevScene=null; CQ=null; UI={sheet:null,sub:null}; document.body.classList.remove('cq-on','wide'); resetTalk(); hush(); setAddr(''); renderHubPhone(); renderUI(); }
/* Cog reads each new step aloud; a story or a phrase set then plays itself */
function autoVoice(x){
  const at=S.beat, L=S.lesson; const b=x.beat; const c=fn(b.card,x)||{};
  setTimeout(()=>{ if(S.beat!==at||S.lesson!==L) return;
    const t=coachText().en;
    const then=()=>{ if(S.beat!==at||S.lesson!==L) return;
      if(c.type==='story') playSeq($$('#story .tpanel'),'lit');
      else if(!c.type&&b.talk&&S.mode!=='solo'){ const tk=fn(b.talk,x); if(tk&&tk.q&&tk.q!==t) speak(tk.q); } };
    if(t&&t!=='…') speak(t,()=>setTimeout(then,450)); else then();
  },250);
}
function renderHubPhone(){
  const scr=$('#screen'); $('#kb').hidden=true; const dev=$('#device');
  dev.style.background='radial-gradient(130% 80% at 20% 0%,#C9B8F2 0,#8C77C9 40%,#3C2E6B 100%)';
  $('#sb').className='sb dark'; $('#navbar').className='navbar dark';
  const done=id=>S.ch[id]&&S.ch[id]._finished; const nextId=ORDER.find(id=>!done(id))||ORDER[0];
  scr.innerHTML=APPS.lock({notifs:ORDER.map(id=>Object.assign({},LESSONS[id].notif,{cls:(id===nextId?'hl ':'')+(done(id)?'done':''),title:(done(id)?'✓ ':'')+LESSONS[id].notif.title})),hint:'Tap a notification to start'});
  $('.view',scr).style.background='transparent';
  fitDevice();
}

/* ------------------------------------------------------------- input on the phone */
function onPhoneClick(e){
  const dv=e.target.closest('[data-view]'); if(dv){openView(dv.dataset.view,dv.dataset.mark);return}
  const x=S.lesson?ctx():null;
  const sys=e.target.closest('[data-sys]');
  const ui=e.target.closest('[data-ui]');
  const hit=e.target.closest('[data-hit]');
  if(!S.lesson){ if(hit){const id=(hit.dataset.hit.match(/^start:(.+)/)||[])[1]; if(id){start(id);return}} pulseCoach(); return; }
  const b=x.beat;
  if(cqOn()||REW){ if(ui||hit||sys) pulseCoach(); return; }
  if(ui){ handleUI(ui.dataset.ui,ui,x); return; }
  if(hit){
    const want=[].concat(fn(b.tap,x)||[]);
    if(want.includes(hit.dataset.hit)){
      if(b.onTap){ const r=b.onTap(x,hit.dataset.hit); if(r===false) return; }
      if(hit.dataset.hit==='send'||hit.dataset.hit.startsWith('send')){ if(b.compose){const v=x.get(fn(b.compose,x).key,'');if(!v.trim()){pulseCoach();return}} }
      if(b.feedback){ const o=b.feedback(x,hit.dataset.hit); if(o){ UI.sheet=Object.assign(fbSheet(o,o.retry),o.sheet||{}); renderUI(); return; } }
      next(!!b.interrupt); return;
    }
    if(b.onHit&&b.onHit(x,hit.dataset.hit,hit)!==false){return}
    wrongTap(hit); return;
  }
  if(sys){ wrongTap(sys); return; }
}
function wrongTap(el){ const want=$('#screen .hl')||$('#device .hl'); if(want){want.classList.remove('nudge');void want.offsetWidth;want.classList.add('nudge')} pulseCoach(); }
function pulseCoach(){ const s=$('#pcoach'); if(s){s.classList.remove('nudge');void s.offsetWidth;s.classList.add('nudge')} }
function handleUI(id,el,x){
  const b=x.beat; const [kind,arg]=[id.split(':')[0],id.slice(id.indexOf(':')+1)];
  if(kind==='key'){ typeKey(arg,x); return; }
  if(kind==='kbtoggle'){ S.keys=!S.keys; renderPhoneKeepFocus(); return; }
  if(kind==='chip'){ toggleChip(arg,x); return; }
  if(kind==='tile'||kind==='untile'){ bldTap(kind,arg,x); return; }
  if(kind==='pick'){ const sc=fn(b.scene,x); const sel=x.get(sc.sel,[]).slice(); const k=sel.indexOf(arg); if(k>=0)sel.splice(k,1); else sel.push(arg); x.set(sc.sel,sel); renderPhone(false); renderFoot(); return; }
  if(kind==='opt'&&b.decide){ const d=fn(b.decide,x); x.set(d.key,arg); if(d.onPick) d.onPick(x,arg);
    const o=d.options[arg]; firstTry(x,d.key,!!(o&&o.ok));
    if(o&&o.then){ startCQ(Object.assign({why:o.why,whybn:o.whybn},o.then),x2=>{delete x2.ch[d.key]; save()}); return; }
    renderPhone(false); UI.sheet=fbSheet(o||{},x2=>{delete x2.ch[d.key]; save(); renderPhone(false);}); renderUI(); return; }
  if(kind==='line'&&b.hunt){ openLine(arg); return; }
  if(b.onUi&&b.onUi(x,kind,arg,el)!==false) return;
  if(x.L.onUi) x.L.onUi(x,kind,arg,el);
}
function activeKB(x){ const sc=fn(x.beat.scene,x); return sc&&sc.kb; }
function typeKey(k,x){
  const kb=activeKB(x); if(!kb||!kb.key) return; let v=x.get(kb.key,'');
  if(k==='bs') v=v.slice(0,-1); else if(k==='nl') v+='\n'; else if(k==='shift'||k==='123') return; else v+=k;
  x.set(kb.key,v); renderPhoneKeepFocus(); renderFoot();
}
function toggleChip(id,x){
  const kb=activeKB(x); const c=(kb.chips||[]).find(z=>z.id===id); if(!c) return;
  let v=x.get(kb.key,'');
  if(v.includes(c.text)) v=v.replace(c.text,'').replace(/ {2,}/g,' ').replace(/^\s+/,'');
  else v=(v&&!/\s$/.test(v)?v+' ':v)+c.text;
  x.set(kb.key,v); if(kb.key==='cvPrompt'&&!x.get('ppDone')&&x.get('ppStep',0)>=4){ x.set('ppDone',1); renderCoachLine(); } renderPhoneKeepFocus(); renderFoot();
}
function composeChanged(){ renderFoot(); }
function renderPhoneKeepFocus(){ const ta=$('#cmp'); const pos=ta?ta.selectionStart:null; const had=document.activeElement===ta; renderPhone(false); const t2=$('#cmp'); if(t2&&had){t2.focus(); if(pos!=null) t2.setSelectionRange(t2.value.length,t2.value.length)} }

/* ------------------------------------------------------------- clicks on cards, footer and top bar */
function onUIClick(e){
  if(ppClick(e)) return;
  const dv=e.target.closest('[data-view]'); if(dv){openView(dv.dataset.view,dv.dataset.mark);return}
  const md=e.target.closest('[data-mode]'); if(md){ setMode(md.dataset.mode); return; }
  const st=e.target.closest('[data-start]'); if(st){ start(st.dataset.start); return; }
  const p=e.target.closest('[data-p]'); if(p){ const a=p.dataset.p; if(a==='bn') setBn(!S.bn); else if(a==='menu') openMenu(); else if(a==='exit') hub(); else if(a==='seg'){ const i=+p.dataset.i; if(!(S.beat===i)) go(i,true,i>S.beat?1:-1); } return; }
  const ak=e.target.closest('[data-ask]'); if(ak){ askPick(+ak.dataset.ask); return; }
  const c=e.target.closest('[data-c]');
  if(c){ const a=c.dataset.c; const x=S.lesson?ctx():null;
    if(a==='next') next(true); else if(a==='back') back(); else if(a==='show') showMe(); else if(a==='intro') openIntro(); else if(a==='rewind') rewindCQ();
    else if(a==='files'){ const ids=fn(x.beat.docs,x)||[]; filesSheet(ids); }
    else if(a==='hint'){ hintSheet(fn(x.beat.hint,x)); }
    else if(a==='huntdone') huntDone();
    else if(a==='stop'){ const bb=x.beat; if(bb.onTap) bb.onTap(x,'stop'); next(true); }
    return; }
  /* listening works everywhere, the lock screen included */
  const sp=e.target.closest('[data-speak]'); if(sp){ speak(sp.dataset.speak); sp.classList.add('speaking'); if(sp.classList.contains('model')){const t=sp.nextElementSibling; if(t) t.hidden=false;} return; }
  const wd=e.target.closest('[data-word]'); if(wd){ wd.classList.add('open'); speak(wd.dataset.say); wd.classList.add('speaking'); return; }
  if(!S.lesson){ const d0=e.target.closest('[data-say]'); if(d0){ speak(d0.dataset.say); d0.classList.add('speaking'); } return; }
  const x=ctx();
  const so=e.target.closest('[data-sort]'); if(so){ const [k,i,v]=so.dataset.sort.split('|'); const a=x.get(k,{}); a[i]=v; x.set(k,a); const c2=fn(x.beat.card,x); const it=c2&&c2.items&&c2.items[+i]; if(it) firstTry(x,k+':'+i,it.ans===v); renderStage(); renderFoot(); return; }
  const pe=e.target.closest('[data-pe]'); if(pe){ const [k,i,j]=pe.dataset.pe.split('|'); const a=x.get(k,{}); a[i]=+j; x.set(k,a); const c2=fn(x.beat.card,x); const op=c2&&c2.items[+i].options[+j]; if(op) firstTry(x,k+':'+i,!!op.ok); renderStage(); renderFoot(); return; }
  const ch=e.target.closest('[data-choice]'); if(ch){ const [k,i]=ch.dataset.choice.split('|'); x.set(k,+i); const o=choiceOpt(x,k,+i); firstTry(x,k,!!(o&&o.ok));
    if(o&&o.then){ startCQ(o.then,x2=>{delete x2.ch[k]; save()}); return; }
    UI.sheet=fbSheet(o||{},x2=>{delete x2.ch[k]; save();}); renderUI(); return; }
  const tk=e.target.closest('[data-tick]'); if(tk){ const [k,i]=tk.dataset.tick.split('|'); const a=x.get(k,{}); a[i]=!a[i]; x.set(k,a); renderStage(); renderFoot(); return; }
  const sy=e.target.closest('[data-story]'); if(sy){ const card=$('#story'); if(sy.dataset.story==='words'){ card.classList.toggle('words-on'); } else playSeq($$('.tpanel',card),'lit'); return; }
  const pa=e.target.closest('[data-phrases]'); if(pa){ playSeq($$('#pcard .dph'),'lit'); return; }
  const tt=e.target.closest('[data-tt]'); if(tt){ toggleTimer(+tt.dataset.tt); return; }
  const rc=e.target.closest('[data-rec]'); if(rc){ recToggle(rc.dataset.rec); return; }
  const ds=e.target.closest('[data-say]'); if(ds){ speak(ds.dataset.say); ds.classList.add('speaking'); return; }
}

/* ---- listening: everything Cog says can be heard. Recorded voices first (one
   player, unlocked by the first tap, so every later line can start by itself);
   the browser's voice, sentence by sentence, for lines not yet recorded. ---- */
let voiceEN=null, speakId=0;
const ANDROID=typeof navigator!=='undefined'&&/Android/i.test(navigator.userAgent||'');
function pickVoice(){ if(ANDROID){ voiceEN=null; return; } try{ const vs=speechSynthesis.getVoices(); voiceEN=vs.find(v=>/en[-_]IN/i.test(v.lang))||vs.find(v=>/en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null; }catch(e){} }
const plain=t=>String(t||'').replace(/Ayesha/g,'Eye-sha').replace(/<span class="bn"[^>]*>.*?<\/span>/g,' ').replace(/<[^>]+>/g,' ').replace(/___/g,' blank ').replace(/&amp;/g,'&').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
/* Recorded voices. Every spoken line has a key made from its words, so a
   recording is found by what it says: change a line and the old file simply
   stops matching (the browser voice reads the new one until it is recorded).
   tools/voice-script.js lists every line; tools/split_takes.py cuts the
   AI Studio takes into audio/<key>.mp3 and writes audio/manifest.json. */
const canon=t=>String(t||'').replace(/<span class="bn"[^>]*>.*?<\/span>/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&[a-z]+;/g,' ').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const audioKey=t=>{ let h=0x811c9dc5; const c=canon(t).toLowerCase(); for(let i=0;i<c.length;i++){ h^=c.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } return h.toString(36).padStart(7,'0'); };
let AUDIO=new Set(), AUDIO_V='';
const PLAYER=typeof Audio!=='undefined'?new Audio():null; if(PLAYER) PLAYER.preload='auto';
const CLIP={};   // key → blob URL (or a promise while it loads)
function loadAudio(){ try{ fetch('audio/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(m=>{ if(m&&m.keys){ AUDIO=new Set(m.keys); AUDIO_V=m.v||''; prefetchAround(); } }).catch(()=>{}); }catch(e){} }
function prefetch(t){ if(!t) return; const k=audioKey(t); if(!AUDIO.has(k)||CLIP[k]) return;
  CLIP[k]=fetch('audio/'+k+'.mp3'+(AUDIO_V?'?v='+AUDIO_V:'')).then(r=>r.ok?r.blob():Promise.reject()).then(b=>{ CLIP[k]=URL.createObjectURL(b); return CLIP[k]; }).catch(()=>{ delete CLIP[k]; }); }
/* the lines likely to be needed next: this step, the next one, a consequence */
function prefetchAround(){
  if(!S.lesson){ prefetch(HUB.en); return; }
  const L=LESSONS[S.lesson], x=ctx();
  [S.beat,seek(L,S.beat+1,1),seek(L,S.beat+2,1)].filter(i=>i>=0).forEach(i=>{ const b=L.beats[i]; try{ prefetch(fn(b.say,x)); const tk=fn(b.talk,x); if(tk&&S.mode!=='solo') prefetch(tk.q); const cq=b.cq&&fn(b.cq,x); if(cq) prefetch(cq.line); }catch(e){} });
}
let unlocked=false;
function unlockAudio(){ try{ FX.unlock(); }catch(e){} if(unlocked||!PLAYER) return; unlocked=true;
  try{ const n=160,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
    w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,16000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
    if(!PLAYER.src||PLAYER.paused){ PLAYER.src=URL.createObjectURL(new Blob([buf],{type:'audio/wav'})); PLAYER.play().catch(()=>{}); } }catch(e){}
  try{ const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u); }catch(e){} }
function talking(on){ document.body.classList.toggle('g-talk',!!on); }
function stopClip(){ if(PLAYER){ try{PLAYER.pause()}catch(e){} PLAYER.onended=PLAYER.onerror=null; } talking(false); }
function speak(t,onEnd){
  const k=audioKey(t);
  if(PLAYER&&AUDIO.has(k)){
    try{ speechSynthesis.cancel() }catch(e){} stopClip(); const my=++speakId; $$('.speaking').forEach(e=>e.classList.remove('speaking'));
    const done=()=>{ if(my!==speakId) return; talking(false); $$('.speaking').forEach(e=>e.classList.remove('speaking')); onEnd&&onEnd(); };
    const play=src=>{ if(my!==speakId) return; PLAYER.src=src; PLAYER.playbackRate=S.mode==='class'?.94:1; PLAYER.onended=done;
      PLAYER.onerror=()=>{ if(my!==speakId) return; AUDIO.delete(k); ttsSpeak(t,onEnd); };
      talking(true); PLAYER.play().catch(err=>{ if(my!==speakId) return; talking(false);
        // blocked before the first tap: wait — 🔊 plays it. Any other failure: the browser voice reads it.
        if(err&&err.name==='NotAllowedError'){ const ear=$('#p-ear'); if(ear) ear.classList.add('nudge'); } else ttsSpeak(t,onEnd); }); };
    const c=CLIP[k];
    if(typeof c==='string') play(c); else if(c&&c.then) c.then(u=>play(u||'audio/'+k+'.mp3')); else { prefetch(t); play('audio/'+k+'.mp3'+(AUDIO_V?'?v='+AUDIO_V:'')); }
    return;
  }
  ttsSpeak(t,onEnd);
}
function ttsSpeak(t,onEnd){
  try{
    speechSynthesis.cancel(); stopClip(); const my=++speakId; $$('.speaking').forEach(e=>e.classList.remove('speaking'));
    const parts=plain(t).match(/[^.!?…]+[.!?…]*/g)||[]; if(!parts.length){onEnd&&onEnd();return}
    if(!voiceEN) pickVoice(); talking(true);
    parts.forEach((p,i)=>{ const u=new SpeechSynthesisUtterance(p.trim()); u.lang=voiceEN?voiceEN.lang:(ANDROID?'en-US':'en-GB'); if(voiceEN)u.voice=voiceEN; u.rate=ANDROID?(S.mode==='class'?.9:1):(S.mode==='class'?.82:.88);
      if(i===parts.length-1) u.onend=()=>{ if(my===speakId){ talking(false); $$('.speaking').forEach(e=>e.classList.remove('speaking')); onEnd&&onEnd(); } };
      speechSynthesis.speak(u); });
  }catch(e){ talking(false); onEnd&&onEnd(); }
}
function hush(){ speakId++; seqId++; stopClip(); try{speechSynthesis.cancel()}catch(e){} $$('.speaking').forEach(e=>e.classList.remove('speaking')); }
const sayBtn=(text,label)=>`<button class="ear" data-speak="${esc(canon(text))}" aria-label="${label||'Listen'}">🔊</button>`;

/* ------------------------------------------------------------- Show me (ghost finger) */
function ghostTo(el,cb){
  const g=$('#ghost'),dev=$('#device'); if(!el||!dev.contains(el)){cb&&cb();return}
  el.scrollIntoView({block:'nearest'});
  const dr=dev.getBoundingClientRect(),er=el.getBoundingClientRect(); const sc=dr.width/dev.offsetWidth||1;
  g.style.opacity=1; g.style.left=((er.left+er.width/2-dr.left)/sc)+'px'; g.style.top=((er.top+er.height/2-dr.top)/sc)+'px';
  ghostBusy=true;
  setTimeout(()=>{g.classList.add('tap');setTimeout(()=>{g.classList.remove('tap');ghostBusy=false;cb&&cb();setTimeout(()=>g.style.opacity=0,350)},180)},620);
}
let showing=0;
function showMe(){
  const x=ctx(), b=x.beat;
  if(S.streaming&&S.finishStream&&!b.interrupt){S.finishStream();return}
  if(showing&&Date.now()-showing<9000) return; showing=Date.now(); const at=S.lesson+'/'+S.beat;
  const clear=()=>{ if(S.lesson+'/'+S.beat!==at||!S.lesson) showing=0; else setTimeout(clear,300); }; setTimeout(clear,300);
  if(b.showMe){ b.showMe(x,{ghostTo,click:el=>el&&el.click(),render:()=>{renderPhone(false);renderUI()}}); return; }
  const cd=fn(b.card,x); if(cd&&cd.type==='pickeach'){ const a={}; cd.items.forEach((it,i)=>a[i]=it.options.findIndex(o=>o.ok)); x.set(cd.key,a); renderUI(); return; }
  if(cd&&cd.type==='sort'&&!b.tap&&!b.compose){ const a={}; cd.items.forEach((it,i)=>a[i]=it.ans); x.set(cd.key,a); renderUI(); return; }
  if(cd&&cd.type==='choice'){ const i=cd.options.findIndex(o=>o.ok); const el=$(`#pcard [data-choice="${cd.key}|${i}"]`); if(el) el.click(); return; }
  if(b.hunt){ const s=huntState(x,b); const l=s.h.lines.find(z=>z.v!=='ok'&&s.a[z.id]!=='bad'); if(!l) return; const el=$(`#screen [data-ui="line:${l.id}"]`); const want=l.vd==='NG'?'ng':'bad'; ghostTo(el,()=>{ openLine(l.id); const n=$$('#psheet [data-kw][data-ok]').length; for(let i=0;i<Math.min(2,n);i++) setTimeout(()=>{ const k=$('#psheet [data-kw][data-ok]:not(.hit)'); if(k) k.click(); },450+i*500); setTimeout(()=>{ const v=$(`#psheet [data-hv$="|${want}"]`); if(v) v.click(); },450+Math.min(2,n)*500+500); }); return; }
  if(b.compose){
    const c=fn(b.compose,x); const best=c.best;
    x.set(c.key,''); renderPhoneKeepFocus();
    const seq=best.slice(); const step=()=>{ if(!seq.length){ renderFoot(); const s=$('#screen [data-hit="'+(fn(b.tap,x)||'send')+'"]'); ghostTo(s,()=>{ showing=0; if(s) s.click(); }); return; }
      const id=seq.shift(); const el=$(`#kb [data-ui="chip:${id}"]`)||$('#kb .bld-line'); ghostTo(el,()=>{ x.set('bld:'+c.key,[]); toggleChip(id,x); setTimeout(step,260); }); };
    step(); return;
  }
  if(b.pickShow){ const sc=fn(b.scene,x); x.set(sc.sel,[]); renderPhone(false); const seq=b.pickShow.slice();
    const step=()=>{ if(!seq.length){ const a=$(`#screen [data-hit="${fn(b.tap,x)}"]`); ghostTo(a,()=>{ showing=0; a&&a.click(); }); return; }
      const id=seq.shift(); ghostTo($(`#screen [data-ui="pick:${id}"]`),()=>{ const sel=x.get(sc.sel,[]); sel.push(id); x.set(sc.sel,sel); renderPhone(false); renderFoot(); setTimeout(step,120) }) }; step(); return; }
  if(b.decide){ const d=fn(b.decide,x); const best=Object.keys(d.options).find(k=>d.options[k].ok); const el=$(`#screen [data-ui="opt:${best}"]`); ghostTo(el,()=>{ if(el) el.click(); }); return; }
  if(b.tap){ const t=[].concat(fn(b.tap,x))[0]; const el=$(`#screen [data-hit="${t}"]`)||$(`#device [data-hit="${t}"]`); ghostTo(el,()=>{ if(el) el.click(); }); }
}

/* ------------------------------------------------------------- menu */
function openMenu(){
  const m=$('#menu'); m.hidden=false;
  m.innerHTML=`<div class="panel" role="dialog" aria-label="Menu"><div class="mh"><h2>AI Fluency Lab</h2><button class="p-ic" data-m="close" aria-label="Close">${IC.x}</button></div>
   <h3>Missions</h3><div class="pick-cards">${ORDER.map(id=>{const L=LESSONS[id];return `<button class="pcard" data-m="start:${id}"><span class="pi" style="background:${L.tint}">${L.emoji}</span><span><em>${esc(L.kicker)}</em><b>${esc(L.title)}</b><span>${esc(L.time||'')}</span></span>${S.ch[id]&&S.ch[id]._finished?'<span class="done">✓</span>':''}</button>`}).join('')}</div>
   <h3>How are you working?</h3>${modeButtons()}
   <div class="mrow"><button class="btn quiet" data-m="voice">${S.voice?'🔊 Cog reads aloud — turn off':'🔇 Cog is silent — read aloud'}</button><button class="btn quiet" data-m="tour">❓ How this works</button><button class="btn gold" data-m="intro">▶ The four Ds (film)</button><button class="btn quiet" data-m="legend">⚙ The four Ds (gears)</button><button class="btn quiet" data-m="hub">📱 Ayesha’s lock screen</button><button class="btn quiet" data-m="stage">${S.stage?'Leave':'Present on'} projector (P)</button><button class="btn quiet" data-m="fs">Full screen</button><button class="btn quiet" data-m="print">Paper version</button><button class="btn quiet" data-m="reset">Start over</button></div>
   <h3>For the teacher</h3>
   <p><b>One screen at a time.</b> Cog (top) says what to do and reads it aloud. The middle is either Ayesha’s phone — where students act — or a card: a question, a sort, a gear earned. The button at the bottom is always the next thing. Feedback slides up from the bottom: green, amber or red. Stars count good calls made first time.</p>
   <p><b>Students find the problems themselves.</b> The AI’s mistakes are never pointed out in advance: students send the quick prompt, judge what comes back, spot what isn’t true in her documents, and see risky choices play out (⏩) before they rewind and choose again.</p>
   <ul class="tlist"><li><b>👤 Alone</b> — homework. No warm-up and no partner talk: the English is in the action — the sentences they choose to send, and the phrase at each gear.</li>
   <li><b>👥 Pairs</b> — one phone, two students. Each workflow opens with a warm-up (picture words, a story, the four phrases), and talk moments follow the key steps with a one-minute timer (T).</li>
   <li><b>🙋 Class</b> — you drive on the projector (large type). Same warm-up and talk moments; neighbours talk while the timer runs.</li></ul>
   <p><b>The four Ds are also four jobs for English</b>: Delegation = planning and sharing jobs (<i>I will… The AI can…</i>); Description = clear instructions (<i>Use only… If…, ask me first</i>); Discernment = judging and disagreeing politely (<i>That’s not true. Her report says…</i>); Diligence = limits and responsibility (<i>I won’t share… It’s private</i>). Each gear turned ends with its phrase to say aloud.</p>
   <p>Nothing is locked: Skip and Show me (S) are always there. Cog reads aloud (V turns it off). The AI replies are scripted from real assistants, mistakes included. No data leaves the phone. Students without a phone: the Paper version (one A4 page per workflow).</p>
   <h3>Keys</h3><p>→ next · ← back · S show me · T talk timer · V read aloud · P projector · B Bangla</p>
   <h3>Credits</h3><p class="cred">Framework: AI Fluency by Rick Dakan, Joseph Feller and Anthropic (CC BY-NC-SA 4.0). Ayesha Rahman and all her documents are fictional classroom materials. Orbit, Sathi AI and Studio are invented apps modelled on real ones (Meta Muse and Grok Bot; Gemini, ChatGPT and Claude; Google AI Studio). No affiliation is implied.</p></div>`;
}
function openLegend(){
  const m=$('#menu'); m.hidden=false; const L=S.lesson&&LESSONS[S.lesson]; const d=L?beatD(L,S.beat):null;
  m.innerHTML=`<div class="panel" role="dialog" aria-label="The four Ds"><div class="mh"><h2>The four Ds</h2><button class="p-ic" data-m="close" aria-label="Close">${IC.x}</button></div>
   <p class="sub" style="margin-top:0">Four gears, two loops. The lit gear is the D Ayesha is using now.${BN('চারটা গিয়ার, দুটো চক্র। উজ্জ্বল গিয়ারটা সেই D, যা আয়েশা এখন ব্যবহার করছে।')}</p>
   ${D4.legend({on:d,used:L?usedDs(L,S.beat):null})}${D4.loopsNote()}</div>`;
}
/* end-of-workflow recap (kept for the paper version and older lessons) */
function recap(x,texts){ return resultCard({say:texts},x); }
function onMenuClick(e){
  const md=e.target.closest('[data-mode]'); if(md){ setMode(md.dataset.mode); closeMenu(); return; }
  const sp=e.target.closest('[data-speak]'); if(sp){ speak(sp.dataset.speak); return; }
  const t=e.target.closest('[data-m]'); if(!t){ if(e.target.id==='menu') closeMenu(); return }
  const a=t.dataset.m; if(a==='voice'){ setVoice(!S.voice); openMenu(); return; } closeMenu(); if(a==='legend'){ openLegend(); return; }
  if(a.startsWith('start:')) start(a.slice(6)); else if(a==='hub') hub(); else if(a==='stage') toggleStage(); else if(a==='fs') toggleFS(); else if(a==='print') location.href='print.html'; else if(a==='intro') openIntro(); else if(a==='tour') tour(true);
  else if(a==='reset'){ S.ch={}; save(); hub(); }
}
let introPushed=false;
function openIntro(){ if(!window.INTRO) return;
  // the film gets its own history step, so Back closes it rather than leaving the activity
  if(location.hash!=='#intro'){ try{ history.pushState(null,'',location.pathname+location.search+'#intro'); introPushed=true; }catch(e){} }
  const leave=()=>{ if(location.hash!=='#intro') return; if(introPushed){ introPushed=false; history.back(); } else history.replaceState(null,'',location.pathname+location.search); };
  hush(); INTRO.open({bn:S.bn,fullscreen:matchMedia('(min-width:900px)').matches,
   onExit:leave,
   /* "Start with Ayesha's phone": her lock screen, where the three missions wait */
   onStart:()=>{ closeMenu(); hub(); }}); }
function closeMenu(){ const m=$('#menu'); if(m) m.hidden=true; }
function modeButtons(){ return `<div class="modes" role="group" aria-label="How are you working?">${Object.keys(MODES).map(k=>{const m=MODES[k];return `<button class="mode ${S.mode===k?'on':''}" data-mode="${k}" aria-pressed="${S.mode===k}"><span class="mi2" aria-hidden="true">${m.i}</span><b>${m.n}${BN(m.bn)}</b><small>${m.d}${BN(m.dbn)}</small></button>`}).join('')}</div>`; }
let stageByMode=false;
function setMode(k){
  if(!MODES[k]) return; S.mode=k; savePrefs();
  ['solo','pair','class'].forEach(z=>document.body.classList.toggle('mode-'+z,z===k));
  if(k==='class'&&!S.stage){ stageByMode=true; toggleStage(); }
  else if(k!=='class'&&S.stage&&stageByMode){ stageByMode=false; toggleStage(); }
  resetTalk(); UI.sub=null;
  if(S.lesson&&!shown(LESSONS[S.lesson],S.beat)) go(S.beat,false); else renderUI();
}
function setVoice(on){ S.voice=on; savePrefs(); if(!on) hush(); }
function toggleStage(){ S.stage=!S.stage; document.body.classList.toggle('stage',S.stage); fitDevice(); }
function toggleFS(){ try{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen({navigationUI:'hide'}) }catch(e){} }
function maybeFullscreen(){ try{ if(matchMedia('(pointer:coarse)').matches&&innerWidth<900&&document.documentElement.requestFullscreen&&!document.fullscreenElement) document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{}) }catch(e){} }

/* ------------------------------------------------------------- how this works: a short tour, once */
const TOUR=[
 {sel:'#pcoach',en:'This is Cog, your coach. Cog tells you what to do — and reads it aloud. Tap 🔊 to hear it again.',bn:'এ হলো Cog, তোমার কোচ। Cog বলে দেয় কী করতে হবে — আর জোরে পড়ে শোনায়। আবার শুনতে 🔊 চাপো।'},
 {sel:'#device',en:'This is Ayesha’s phone. You are Ayesha. Tap it like a real phone. A gold ring shows where.',bn:'এটা আয়েশার ফোন। তুমিই আয়েশা। আসল ফোনের মতো চাপো। সোনালি বৃত্ত দেখায় কোথায়।'},
 {sel:'#pfoot',en:'Your next step is always down here: Continue — or Show me if you’re stuck. Nothing is locked.',bn:'পরের ধাপ সবসময় এখানে: Continue — আটকে গেলে Show me। কিছুই আটকানো নয়।'},
 {sel:'#screen .notif.hl',en:'Ready? Tap the gold notification to start your first mission.',bn:'তৈরি? প্রথম মিশন শুরু করতে সোনালি নোটিফিকেশনে চাপো।'}
];
let tourAt=-1;
function tour(force){
  if(!force){ try{ if(localStorage.getItem('afl-toured')) return; }catch(e){ return; } }
  if(S.lesson) hub();
  tourAt=0; showTour();
}
function showTour(){
  const m=$('#pmark'); const s=TOUR[tourAt]; const el=s&&$(s.sel);
  if(!s||!el){ m.hidden=true; m.innerHTML=''; tourAt=-1; try{localStorage.setItem('afl-toured','1')}catch(e){} return; }
  const r=el.getBoundingClientRect(), pad=6;
  const below=r.top+r.height/2<innerHeight/2;
  m.hidden=false;
  m.innerHTML=`<div class="tm-hole" style="left:${r.left-pad}px;top:${r.top-pad}px;width:${r.width+2*pad}px;height:${r.height+2*pad}px"></div>
   <div class="tm-tip ${below?'below':'above'}" style="${below?`top:${Math.min(innerHeight-200,r.bottom+pad+12)}px`:`bottom:${Math.min(innerHeight-200,innerHeight-r.top+pad+12)}px`}">
    <small>${tourAt+1} / ${TOUR.length}</small><p>${s.en}</p>${BN(s.bn)}<div class="frow"><button class="pb ghost" data-t="skip">${S.bn?'বাদ দাও':'Skip'}</button><span class="grow"></span><button class="pb primary" data-t="next">${tourAt<TOUR.length-1?(S.bn?'পরেরটা':'Next'):(S.bn?'শুরু করো':'Got it')}</button></div></div>`;
  speak(s.en);
}
function onTourClick(e){ const t=e.target.closest('[data-t]'); if(!t) return; if(t.dataset.t==='skip'){ tourAt=TOUR.length; } else tourAt++; hush(); showTour(); }

/* ------------------------------------------------------------- language */
function setBn(on){ S.bn=on; document.body.classList.toggle('bangla',on); save(); if(S.lesson) renderPhone(false); renderUI(); }

/* ------------------------------------------------------------- fit the phone to the stage */
function fitDevice(){
  const w=$('#stagewrap'), dev=$('#device'); if(!w||!dev) return;
  const aw=w.clientWidth, ah=w.clientHeight; if(!aw||!ah) return;
  if(innerWidth<700){ // a phone: a handset the shape of the space, shown at 90% so it reads as a phone in a frame
    const Z=.9, px=16, py=12; dev.style.width=Math.round((aw-2*px)/Z)+'px'; dev.style.height=Math.round((ah-2*py)/Z)+'px'; dev.style.transform=`scale(${Z})`;
  } else { // a laptop or projector: a real phone's proportions, as large as fits
    dev.style.width='412px'; dev.style.height='892px'; const s=Math.min((ah-28)/892,(aw-28)/412,S.stage?1.4:1.15); dev.style.transform=`scale(${s.toFixed(3)})`;
  }
}

/* ------------------------------------------------------------- status bar clock */
function tickClock(){ $('#sb').innerHTML=`<span>${now()}</span><span class="ico"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 22h20V2z" opacity=".95"/></svg><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 0 8.5A17 17 0 0 1 24 8.5z"/></svg><svg viewBox="0 0 24 24" style="width:22px"><rect x="2" y="7" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor"/><rect x="21" y="10" width="1.8" height="4" rx=".8" fill="currentColor"/></svg>76%</span>`; const lt=$('.lock .t'); if(lt) lt.textContent=now(); }

/* ------------------------------------------------------------- boot */
function boot(){
  load(); loadPrefs(); loadAudio(); FX.on=()=>S.voice;
  ['solo','pair','class'].forEach(z=>document.body.classList.toggle('mode-'+z,z===S.mode));
  if(S.mode==='class'){ stageByMode=true; S.stage=true; document.body.classList.add('stage'); }
  if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
  document.body.classList.toggle('bangla',S.bn);
  $('#p-cog').innerHTML=COG;
  tickClock(); setInterval(tickClock,15000);
  document.addEventListener('pointerdown',unlockAudio,{capture:true});
  document.addEventListener('keydown',unlockAudio,{capture:true,once:true});
  $('#device').addEventListener('click',onPhoneClick);
  ['#ptop','#pcoach','#pcard','#pfoot'].forEach(s=>$(s).addEventListener('click',onUIClick));
  $('#psheet').addEventListener('click',onSheetClick);
  $('#viewer').addEventListener('click',onViewerClick);
  $('#menu').addEventListener('click',onMenuClick);
  $('#pmark').addEventListener('click',onTourClick);
  addEventListener('resize',()=>{ fitDevice(); if(tourAt>=0) showTour(); });
  if(window.ResizeObserver) new ResizeObserver(()=>fitDevice()).observe($('#stagewrap'));
  addEventListener('keydown',e=>{
    if(e.target.matches('textarea,input')) return;
    if(e.key==='Escape'){ if(VIEW){closeView();return} if(!$('#menu').hidden){closeMenu();return} if(UI.sheet){closeSheet();return} }
    if(e.key==='ArrowRight'&&S.lesson) next(true); else if(e.key==='ArrowLeft'&&S.lesson) back();
    else if(e.key==='s'||e.key==='S'){ if(S.lesson) showMe(); } else if(e.key==='p'||e.key==='P') toggleStage(); else if(e.key==='b'||e.key==='B') setBn(!S.bn); else if(e.key==='v'||e.key==='V') setVoice(!S.voice); else if(e.key==='t'||e.key==='T'){ const tt=$('#pcard .ttimer'); if(tt) toggleTimer(+tt.dataset.tt); }
  });
  const fromHash=()=>{ if(location.hash==='#intro'){ openIntro(); return true }const h=(location.hash||'').slice(1); const m=h.match(/^(\w+)(?:\/(\d+))?$/); if(m&&LESSONS[m[1]]){ S.lesson=m[1]; prevScene=null; go(m[2]?+m[2]:0,false); return true } return false};
  addEventListener('hashchange',()=>{ if(location.hash!=='#intro'&&window.INTRO){ introPushed=false; INTRO.close(); } if(!fromHash()&&S.lesson&&!location.hash) hub(); });
  // opening straight into a workflow (a saved place, or a #cv/3 link): put the lock screen
  // underneath it in history, so Back lands there rather than outside the activity
  const h0=(location.hash||'').match(/^#(\w+)(?:\/(\d+))?$/), into=h0&&LESSONS[h0[1]]?h0[1]+'/'+(h0[2]||0):(!location.hash&&S.lesson&&LESSONS[S.lesson]?S.lesson+'/'+S.beat:null);
  if(into){ setAddr(''); setAddr(into,true); }
  // opening straight into the film (#intro): draw the phone underneath first, so closing it lands somewhere
  if(location.hash==='#intro'){ if(S.lesson&&LESSONS[S.lesson]) go(S.beat,false); else hub(); openIntro(); }
  else if(!fromHash()){ if(S.lesson&&LESSONS[S.lesson]) go(S.beat,false); else { hub(); setTimeout(()=>tour(false),700); } }
}

function sheetFrom(o){ UI.sheet=Object.assign(fbSheet(o,o.retry?()=>{}:null),o.sheet||{}); renderUI(); }
window.AFL={fb:sheetFrom,HUB,TOUR,_mode:k=>{S.mode=k},audioKey,canon,LESSONS,ORDER,cardHTML,sayBtn,byMode,mode:()=>S.mode,speak,recap,openLegend,boot,openView,closeView,lesson(L){LESSONS[L.id]=L;ORDER.push(L.id)},esc,ico,FILES,fileThumb,go,goId,next,ctx,conseq,CQS,unsay,renderPhone:()=>renderPhone(false),renderCoach:renderUI,renderUI,start,hub,STORY_DATE,firstTry,huntMark,shown};
})();
