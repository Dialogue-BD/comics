/* AI Fluency Lab — engine
 * Two layers on one screen:
 *   PHONE  — a simulated Android phone (Material 3). Every screen is a pure
 *            function of a "scene" object, so any beat can be opened directly.
 *   COACH  — the Dialogue-branded teacher that sits above the phone, one
 *            instruction at a time, and never locks the student in.
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
 tune:'M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z'
};
const ico=(n,cls='')=>`<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><path d="${P[n]||P.info}" fill="currentColor"/></svg>`;

/* ------------------------------------------------------------- the phone's files */
const FILES={
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
const S={lesson:null,beat:0,bn:false,ch:{},stage:false};
const LESSONS={}; const ORDER=[];
let prevScene=null, streamTimer=null, ghostBusy=false;
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
 orbit:{n:'Orbit',i:'orbit',b:'#FFDBCC',c:'#8A2E0B'},
 studio:{n:'Studio',i:'code',b:'#1F1F23',c:'#A8C7FA'},
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
   <div class="sender"><span class="av" style="background:${m.color||'#7D5260'}">${esc(m.from[0])}</span><span><b>${esc(m.from)}</b><span>to me · ${esc(m.time||'9:12 AM')}</span></span></div>
   ${m.body}${m.atts?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">${m.atts.map(a=>`<span class="chipm">${ico('file')} ${esc(a)}</span>`).join('')}</div>`:''}
   </div></div></div>`;}
  return `<div class="view">${appBar('Inbox',{left:'menu'})}<div class="scroll">${(sc.mails||[]).map(m=>`<button class="li ${m.unread?'unread':''}" ${m.hit?`data-hit="${m.hit}"`:''}><span class="av" style="background:${m.color}">${esc(m.from[0])}</span><span><b>${esc(m.from)}</b><p>${esc(m.subject)}</p></span><small>${esc(m.time)}</small></button>`).join('')}</div></div>`;
};

/* --- Sathi: a chat assistant, in the shape every AI chat app shares --- */
function composer(sc,dark){
  const c=sc.composer||{}; const x=ctx(); const val=c.key?(x.get(c.key,c.prefill||'')):(c.text||'');
  const atts=(c.atts||[]).map(id=>`<span class="att" data-view="${id}">${fileThumb(id)}<span>${esc(FILES[id].name)}</span></span>`).join('');
  return `<div class="composer" ${c.hit?'':''}>${atts?`<div class="pend">${atts}</div>`:''}
   <div class="row"><button class="mi" ${c.attHit?`data-hit="${c.attHit}"`:''} aria-label="Add files">${ico('plus')}</button>
   <textarea id="cmp" rows="1" inputmode="none" placeholder="${esc(c.placeholder||'Ask Sathi')}" ${c.key?`data-key="${c.key}"`:'readonly'}>${esc(val)}</textarea>
   ${val.trim()||atts?`<button class="send" data-hit="${c.sendHit||'send'}" aria-label="Send">${ico('send')}</button>`:`<button class="mi" aria-label="Voice">${ico('mic')}</button>`}</div></div>`;
}
function aiMsg(m,dark){
  return `<div class="msg-a" data-mid="${m.id||''}"><span class="spark">${ico('spark')}</span><div class="tx" ${m.stream?'data-stream="1"':''}>${m.html}</div></div>${m.actions!==false&&!m.thinking?`<div class="actions-row"><button class="mi">${ico('thumb')}</button><button class="mi">${ico('copy')}</button><button class="mi">${ico('share')}</button><button class="mi" ${m.moreHit?`data-hit="${m.moreHit}"`:''} aria-label="More">${ico('more')}</button></div>`:''}`;
}
function uMsg(m){
  const atts=(m.atts||[]).length?`<div class="att-row">${m.atts.map(id=>`<span class="att" data-view="${id}" role="button" title="Open">${fileThumb(id)}<span>${esc(FILES[id].name)}</span></span>`).join('')}</div>`:'';
  return `${atts}<div class="msg-u">${esc(m.text)}</div>`;
}
APPS.sathi=sc=>{
  const msgs=sc.msgs||[];
  const body=msgs.length?msgs.map(m=>m.role==='u'?uMsg(m):aiMsg(m)).join(''):`<div class="hello">Hello, Ayesha</div><p>How can I help today?</p>`;
  return `<div class="view sathi">${appBar('Sathi',{left:'menu',right:`<button class="mi" aria-label="New chat">${ico('edit')}</button><span class="mi"><span style="width:30px;height:30px;border-radius:99px;background:#C98E62;color:#fff;display:grid;place-items:center;font-weight:600;font-size:14px">A</span></span>`})}
   <div class="scroll" id="chatscroll">${body}</div>${sc.composer===false?'':composer(sc)}<div class="disclaim">Sathi can make mistakes, so double-check it</div></div>`;
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
  const tabs=['Chat','Code','Preview'];
  return `<div class="view studio" data-theme="dark">${appBar(esc(sc.title||'My Deadlines'),{left:'back',right:`<button class="mi" ${sc.deployHit?`data-hit="${sc.deployHit}"`:''} aria-label="Deploy">${ico('share')}</button><button class="mi">${ico('more')}</button>`})}
  <div class="stabs">${tabs.map(t=>`<button class="${(sc.tab||'Chat')===t?'on':''}" ${sc.tabHits&&sc.tabHits[t]?`data-hit="${sc.tabHits[t]}"`:''}>${t}</button>`).join('')}</div>
  ${sc.tab==='Preview'?`<div class="preview"><div class="pbar2"><span class="dot"></span> Preview · ${esc(sc.ver||'v1')}</div><div class="mini" id="mini">${sc.mini||''}</div></div>`:
    sc.tab==='Code'?`<div class="scroll"><div class="code">${sc.code||''}</div></div>`:
    `<div class="scroll" id="chatscroll">${(sc.msgs||[]).map(m=>m.role==='u'?uMsg(m):aiMsg(m)).join('')}</div>${sc.composer===false?'':composer(sc,true)}<div class="disclaim">Studio can make mistakes. Test your app.</div>`}
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
  if(sc.skip) h+=`<div class="skipper"><div><b>${sc.skip.big}</b><span>${sc.skip.small||''}</span></div></div>`;
  return h;
}

/* ------------------------------------------------------------- keyboard */
const ROWS=['qwertyuiop','asdfghjkl','zxcvbnm'];
function keyboard(kb){
  const x=ctx(); const val=(kb&&kb.key)?x.get(kb.key,''):'';
  const chips=(kb.chips||[]).map(c=>{const used=val.includes(c.text);return `<button class="kchip ${used?'used':''} ${c.x?'x':''}" data-ui="chip:${c.id}"><span class="tg">${esc(c.tag||'')}</span>${esc(c.text)}</button>`}).join('');
  return `<div class="strip">${kb.label?`<span class="lbl">${esc(kb.label)}</span>`:''}${chips}${innerWidth<900?`<button class="kbt" data-ui="kbtoggle:1">${S.keys?'Hide keys':'⌨ Type'}</button>`:''}</div>
  <div class="rows">${ROWS.map((r,i)=>`<div class="kr">${i===2?`<button class="k w" data-ui="key:shift">⇧</button>`:''}${[...r].map(k=>`<button class="k" data-ui="key:${k}">${k}</button>`).join('')}${i===2?`<button class="k w" data-ui="key:bs">⌫</button>`:''}</div>`).join('')}
  <div class="kr"><button class="k w" data-ui="key:123">?123</button><button class="k w" data-ui="key:,">,</button><button class="k sp" data-ui="key: ">English</button><button class="k w" data-ui="key:.">.</button><button class="k go" data-ui="key:nl">↵</button></div></div>`;
}

/* ------------------------------------------------------------- render phone */
function renderPhone(anim){
  const x=ctx(); const b=x.beat; const sc=fn(b.scene,x)||{app:'home'};
  const dev=$('#device'); const scr=$('#screen');
  const theme=sc.theme||(sc.app==='lock'?'lock':sc.app==='home'?'home':(sc.app==='studio'||sc.app==='doc')?'dark':sc.app==='orbit'?'orbit':'light');
  const bgs={lock:'radial-gradient(130% 80% at 20% 0%,#C9B8F2 0,#8C77C9 40%,#3C2E6B 100%)',home:'radial-gradient(90% 60% at 80% 10%,#F2D6E6 0,transparent 60%),radial-gradient(100% 70% at 0% 100%,#BFD6F3 0,transparent 60%),linear-gradient(160deg,#E9DDFF,#D9E5FF)',dark:sc.app==='doc'?'#2b2b2f':'#131314',orbit:'#FFF8F5',light:sc.app==='gdoc'?'#F0F0F4':'var(--md-surface)'};
  dev.style.background=bgs[theme];
  const darkUI=theme==='lock'||theme==='dark';
  $('#sb').className='sb'+(darkUI?' dark':''); $('#navbar').className='navbar'+(darkUI?' dark':'');
  const r=APPS[sc.app]||APPS.blank;
  let html=r(sc,x);
  const key=sc.app+'|'+(sc.view||sc.tab||'');
  const prevKey=prevScene&&(prevScene.app+'|'+(prevScene.view||prevScene.tab||''));
  scr.innerHTML=html+overlays(sc);
  const v=$('.view',scr);
  if(v){v.style.background='transparent';if(anim&&prevKey!==key){v.classList.add(prevScene&&prevScene.app===sc.app?'slide':'enter')}}
  const kb=$('#kb'); if(sc.kb){kb.hidden=false;kb.innerHTML=keyboard(sc.kb);kb.className='kb'+(innerWidth<900?' compact':'')+(S.keys?' keys':'')}else{kb.hidden=true;kb.innerHTML=''}
  prevScene=sc;
  // spotlight
  const tgt=fn(b.tap,x); const tgts=[].concat(tgt||[]).concat(fn(b.glow,x)||[]);
  tgts.forEach(t=>{const el=scr.querySelector(`[data-hit="${t}"]`)||$('#device').querySelector(`[data-hit="${t}"]`);if(el){el.classList.add('hl');if(getComputedStyle(el).borderRadius.startsWith('999')||el.classList.contains('app')||el.classList.contains('send')||el.classList.contains('mi'))el.classList.add('round')}});
  // chat scroll to end / to anchor
  const cs=$('#chatscroll',scr); if(cs){ if(sc.scrollTo){const a=cs.querySelector(sc.scrollTo);if(a)cs.scrollTop=a.offsetTop-12;} else cs.scrollTop=cs.scrollHeight; }
  // streaming AI messages
  const st=$('[data-stream]',scr);
  if(st){ const mid=st.closest('[data-mid]'); const id=S.lesson+':'+((mid&&mid.dataset.mid)||S.beat); const seen=x.get('_streamed',{}); if(!seen[id]){ streamIn(st,cs,()=>{seen[id]=1;x.set('_streamed',seen);onStreamDone()}) } else st.removeAttribute('data-stream'); }
  // composer: keep in sync with chips/keys
  const ta=$('#cmp',scr);
  if(ta){ autoGrow(ta); ta.addEventListener('input',()=>{ if(ta.dataset.key){x.set(ta.dataset.key,ta.value);composeChanged()} autoGrow(ta)}); }
  if(b.afterRender) b.afterRender(x,scr);
}
function autoGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight,132)+'px'}

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
      let budget=7;
      while(budget>0&&i<nodes.length){const [t,v]=nodes[i];const step=Math.min(budget,v.length-pos);t.nodeValue=v.slice(0,pos+step);pos+=step;budget-=step;
        let p=t.parentElement;while(p&&p!==el){if(p.parentElement===el)p.style.visibility='';p=p.parentElement}
        if(pos>=v.length){i++;pos=0}}
      if(scroller) scroller.scrollTop=scroller.scrollHeight;
      if(i>=nodes.length) finish();
    },16);
  },650);
}
function onStreamDone(){ const cs=$('#chatscroll'); const top=cs?cs.scrollTop:0; renderPhone(false); const c2=$('#chatscroll'); if(c2) c2.scrollTop=top; renderCoach(); }

/* ------------------------------------------------------------- COACH */
const D={del:{n:'Delegation',bn:'দায়িত্ব ভাগ'},des:{n:'Description',bn:'বর্ণনা'},dis:{n:'Discernment',bn:'যাচাই'},dil:{n:'Diligence',bn:'সতর্কতা'}};
const T=(en,bn)=>`${en}${bn?`<span class="bn" lang="bn">${bn}</span>`:''}`;
function renderRail(){
  const rail=$('#rail');
  if(!S.lesson){rail.innerHTML='';rail.hidden=true;return}
  rail.hidden=false; const L=LESSONS[S.lesson]; const cur=L.beats[S.beat].stage;
  const idx=L.stages.findIndex(s=>s.id===cur);
  rail.innerHTML=L.stages.map((s,i)=>`<button class="${i===idx?'on':i<idx?'done':''}" style="--dc:var(--d-${s.d})" data-stage="${s.id}"><i>${i+1}</i><span>${esc(s.label)}</span></button>`).join('');
  const on=$('.on',rail); if(on) on.scrollIntoView({inline:'nearest',block:'nearest'});
}
function renderCoach(){
  const body=$('#cbody'), act=$('#cact'); const coach=$('#coach');
  renderRail();
  if(!S.lesson){ hubCoach(); return; }
  const x=ctx(), b=x.beat, L=x.L; const st=L.stages.find(s=>s.id===b.stage)||L.stages[0];
  const d=b.d||st.d;
  let h=`<div class="kick"><span>${esc(st.label)}</span>${d?`<span class="dtag d-${d}">${D[d].n}</span>`:''}</div>`;
  h+=`<p class="say">${fn(b.say,x)||''}</p>${fn(b.bn,x)?`<span class="bn" lang="bn">${fn(b.bn,x)}</span>`:''}`;
  if(b.sub) h+=`<p class="sub">${fn(b.sub,x)}${fn(b.subbn,x)?`<span class="bn" lang="bn">${fn(b.subbn,x)}</span>`:''}</p>`;
  if(b.compose) h+=composeCard(x,b);
  if(b.check) h+=checkCard(x,b);
  if(b.decide) h+=decideCard(x,b);
  if(b.card) h+=cardHTML(fn(b.card,x),x);
  const docs=fn(b.docs,x); if(docs&&docs.length) h+=docStrip(docs);
  body.innerHTML=h; body.scrollTop=0;
  // open as an overlay sheet on phones when the beat is a "think" moment
  coach.classList.toggle('open',!!b.open);
  // actions
  const stIdx=L.stages.findIndex(s=>s.id===b.stage);
  const inStage=L.beats.map((bb,i)=>[bb,i]).filter(([bb])=>bb.stage===b.stage);
  const pos=inStage.findIndex(([,i])=>i===S.beat);
  const canShow=!!(b.tap||b.compose||b.pickShow||b.decide||b.check||b.showMe);
  const last=S.beat===L.beats.length-1;
  act.innerHTML=`<button class="btn quiet" data-c="back" aria-label="Back" ${S.beat===0?'':''}>${ico('back')}</button>
   ${canShow?`<button class="btn gold" data-c="show">${ico('play')}<span>${S.bn?'দেখাও':'Show me'}</span></button>`:''}
   ${inStage.length>6?`<span class="count" aria-label="Step ${pos+1} of ${inStage.length}">${pos+1}/${inStage.length}</span>`:`<span class="dots" aria-label="Step ${pos+1} of ${inStage.length}">${inStage.map((_,i)=>`<b class="${i===pos?'on':i<pos?'done':''}"></b>`).join('')}</span>`}
   <button class="btn next" data-c="next">${last?'Finish':(fn(b.next,x)||(b.tap&&!b.card?'Skip':'Next'))} ${ico('back').replace('<svg','<svg style="transform:scaleX(-1)"')}</button>`;
  $('#c-head').textContent=L.title;
}
function hubCoach(){
  const body=$('#cbody'),act=$('#cact'); $('#coach').classList.remove('open'); $('#c-head').textContent="Ayesha's Phone";
  const done=k=>{const c=S.ch[k];return c&&c._finished};
  body.innerHTML=`<div class="kick"><span>Start here</span></div>
   <p class="say">This is Ayesha's phone. Learn AI by doing real tasks on it.</p><span class="bn" lang="bn">এটা আয়েশার ফোন। বাস্তব কাজ করে করে AI ব্যবহার শেখো।</span>
   <div class="card"><div class="who"><span class="av">A</span><div><b>Ayesha Rahman</b><span>3rd-year Economics · Rajshahi University</span></div></div>
   <div class="facts"><span>CGPA 3.58</span><span>IELTS mock 6.0</span><span>RUCEI volunteer tutor</span><span>Goal: fully funded master's</span></div></div>
   <p class="sub">Pick one message on her phone — or here.${S.bn?'':''}<span class="bn" lang="bn">ফোনে একটা মেসেজ বেছে নাও — অথবা এখানে।</span></p>
   <div class="pick-cards">${ORDER.map(id=>{const L=LESSONS[id];return `<button class="pcard" data-start="${id}"><span class="pi" style="background:${L.tint}">${L.emoji}</span><span><em>${esc(L.kicker)}</em><b>${esc(L.title)}</b><span>${esc(L.blurb)}</span>${L.blurbbn?`<span class="bn" lang="bn">${L.blurbbn}</span>`:''}</span>${done(id)?'<span class="done">✓ Done</span>':''}</button>`}).join('')}</div>
   <div class="card"><h3>Two layers</h3><ul class="plist">
     <li><span class="ic">📱</span><span><b>Below:</b> the phone. It works like a real Android phone.<span class="bn" lang="bn">নিচে: ফোন। এটা আসল অ্যান্ড্রয়েড ফোনের মতো কাজ করে।</span></span></li>
     <li><span class="ic">🧭</span><span><b>Above:</b> your coach. One step at a time. The gold ring shows where to tap.<span class="bn" lang="bn">উপরে: তোমার কোচ। এক ধাপ করে। সোনালি বৃত্ত দেখায় কোথায় চাপতে হবে।</span></span></li>
     <li><span class="ic">▶</span><span><b>Stuck?</b> Tap “Show me”. You can always go Next.<span class="bn" lang="bn">আটকে গেলে “Show me” চাপো। যেকোনো সময় Next চাপতে পারো।</span></span></li></ul></div>`;
  act.innerHTML=`<span class="grow"></span><button class="btn quiet" data-c="menu">For the teacher</button>`;
}

/* --- coach cards --- */
function cardHTML(c,x){
  if(!c) return '';
  if(c.type==='html') return c.html;
  if(c.type==='info') return `<div class="card">${c.title?`<h3>${c.title}${c.titlebn?`<span class="bn" lang="bn">${c.titlebn}</span>`:''}</h3>`:''}${c.html||''}${c.points?`<ul class="plist">${c.points.map(p=>`<li><span class="ic">${p.i||'•'}</span><span>${p.en}${p.bn?`<span class="bn" lang="bn">${p.bn}</span>`:''}</span></li>`).join('')}</ul>`:''}</div>`;
  if(c.type==='sort'){
    const ans=x.get(c.key,{});
    return `<div class="sort">${c.items.map((it,i)=>{const a=ans[i];const right=a===it.ans;return `<div class="srow"><div class="it">${it.en}${it.bn?`<span class="bn" lang="bn">${it.bn}</span>`:''}</div>
     <div class="seg">${c.bins.map(bn=>`<button class="${a===bn.id?'pick'+(right?'':' wrong'):''}" data-sort="${c.key}|${i}|${bn.id}">${bn.label}</button>`).join('')}</div>
     ${a!=null?`<div class="why ${right?'':'no'}"><b>${right?'Yes.':'Think again.'}</b> ${right?it.why:(it.hint||it.why)}${S.bn&&(right?it.whybn:(it.hintbn||it.whybn))?`<span class="bn" lang="bn" style="display:block">${right?it.whybn:(it.hintbn||it.whybn)}</span>`:''}</div>`:''}</div>`}).join('')}</div>`;
  }
  if(c.type==='choice'){
    const a=x.get(c.key);
    return `<div class="opts">${c.options.map((o,i)=>`<button class="opt ${a===i?'pick'+(o.ok?'':' wrong'):''}" data-choice="${c.key}|${i}">${o.en}${o.bn?`<span class="bn" lang="bn">${o.bn}</span>`:''}</button>${a===i?`<div class="why ${o.ok?'':'no'}">${o.why}${o.whybn?`<span class="bn" lang="bn">${o.whybn}</span>`:''}</div>`:''}`).join('')}</div>`;
  }
  if(c.type==='checklist'){
    const on=x.get(c.key,{});
    return `<div class="chk">${c.items.map((it,i)=>`<button class="${on[i]?'on':''}" data-tick="${c.key}|${i}"><i>${on[i]?'✓':''}</i><span><b>${it.en}</b>${it.sub?`<span style="color:var(--ink-muted);font-size:13px">${it.sub}</span>`:''}${it.bn?`<span class="bn" lang="bn">${it.bn}</span>`:''}</span></button>`).join('')}</div>`;
  }
  if(c.type==='say'){
    return `<div class="card"><h3>${c.title||'Say it to your partner'}${c.titlebn?`<span class="bn" lang="bn">${c.titlebn}</span>`:''}</h3><div class="saylines">${c.lines.map(l=>`<div>${l.en}${l.bn?`<span class="bn" lang="bn">${l.bn}</span>`:''}</div>`).join('')}</div>
      <button class="listen" data-speak="${esc(c.lines.map(l=>l.en.replace(/<[^>]+>/g,'')).join(' '))}">🔊 Listen</button></div>`;
  }
  return '';
}
function composeCard(x,b){
  const c=b.compose; const val=x.get(c.key,c.prefill||'');
  const has=s=>s.test.some(r=>r.test(val));
  const used=c.chips.filter(ch=>ch.x&&val.includes(ch.text));
  const warns=used.map(u=>`<div class="warn">⚠ “${esc(u.text)}” — ${u.warn}${u.warnbn?`<span class="bn" lang="bn">${u.warnbn}</span>`:''}</div>`).join('');
  const ok=c.slots.every(has)&&!used.length?`<div class="good">${c.ready||'Your prompt is ready. Tap send ➤ on the phone.'}${c.readybn?`<span class="bn" lang="bn">${c.readybn}</span>`:''}</div>`:'';
  return `${warns}${ok}<div class="card" style="padding:10px"><h3 style="font-size:15px;margin-bottom:2px">${c.title||'Prompt recipe'}${c.titlebn?`<span class="bn" lang="bn">${c.titlebn}</span>`:''}</h3>
   <div class="recipe">${c.slots.map(s=>`<div class="slot ${has(s)?'on':''}"><span class="tick">${has(s)?'✓':''}</span><span><b>${s.label}</b><span>${s.frame}${s.bn?`<span class="bn" lang="bn">${s.bn}</span>`:''}</span></span></div>`).join('')}</div></div>`;
}
function composeChanged(){ const x=ctx(); if(x.beat&&x.beat.compose){ const keep=$('#cbody').scrollTop; renderCoach(); $('#cbody').scrollTop=keep; refreshSend(); refreshChips(); } }
function refreshSend(){ const x=ctx(); const b=x.beat; if(!b.compose) return; renderPhoneKeepFocus(); }
function renderPhoneKeepFocus(){ const ta=$('#cmp'); const pos=ta?ta.selectionStart:null; const had=document.activeElement===ta; renderPhone(false); const t2=$('#cmp'); if(t2&&had){t2.focus(); if(pos!=null) t2.setSelectionRange(t2.value.length,t2.value.length)} }
function refreshChips(){}
function lookButtons(l){
  if(!l.look) return '';
  return `<div class="looks"><span>${S.bn?'কোথায় দেখবে:':'Where to look:'}</span>${l.look.map(k=>`<button class="look" data-view="${k.f}" ${k.m?`data-mark="${k.m}"`:''}>📄 ${esc(k.t||FILES[k.f].name)}</button>`).join('')}</div>`;
}
function docStrip(ids){
  return `<div class="docstrip"><b>📁 ${S.bn?'আয়েশার কাগজপত্র — খুলতে চাপো':'Ayesha’s documents — tap to open'}</b><div>${ids.map(id=>`<button data-view="${id}">${fileThumb(id)}<span>${esc(FILES[id].name.replace(/_/g,' ').replace(/\.(pdf|jpg)$/,''))}</span></button>`).join('')}</div></div>`;
}
/* ---- document viewer: opens over whatever the phone shows, like tapping an attachment ---- */
let VIEW=null;
function openView(id,mark){
  const f=FILES[id]; if(!f||!f.img) return;
  const marks=(mark||'').split(';').filter(Boolean).map(m=>m.split(',').map(Number));
  VIEW={id,marks,zoom:1};
  if(marks.length){ const w=Math.max(...marks.map(m=>m[0]+m[2]))-Math.min(...marks.map(m=>m[0])); VIEW.zoom=Math.min(3,Math.max(1.6,92/w)); }
  const v=$('#viewer'); v.hidden=false;
  v.innerHTML=`<div class="tab"><button class="mi" data-vclose="1" aria-label="Close">${ico('back')}</button><h1>${esc(f.name)}</h1><button class="mi" data-vzoom="-1" aria-label="Zoom out">−</button><button class="mi" data-vzoom="1" aria-label="Zoom in">+</button></div>
   <div class="vscroll"><div class="vpage"><img src="${f.img}" alt="${esc(f.name)}">${marks.map(m=>`<i class="vmark" style="left:${m[0]}%;top:${m[1]}%;width:${m[2]}%;height:${m[3]}%"></i>`).join('')}</div></div>
   <div class="vhint">${marks.length?(S.bn?'সোনালি দাগের জায়গাটা পড়ো':'Read the part inside the gold box'):(S.bn?'বড় করতে + চাপো':'Tap + to zoom in')}</div>`;
  applyZoom(true);
  if(innerWidth<900) $('#coach').classList.remove('open');
}
function applyZoom(center){
  const v=$('#viewer'); const pg=$('.vpage',v); const sc=$('.vscroll',v); pg.style.width=(VIEW.zoom*100)+'%';
  if(!center||!VIEW.marks.length) return;
  const go=()=>{const m=VIEW.marks[0]; const x=Math.min(...VIEW.marks.map(z=>z[0])); sc.scrollLeft=pg.offsetWidth*x/100-12; sc.scrollTop=pg.offsetHeight*m[1]/100-sc.clientHeight*0.3;};
  const img=$('img',pg); if(img.complete) go(); else img.addEventListener('load',go,{once:true});
}
function closeView(){ VIEW=null; const v=$('#viewer'); if(v){v.hidden=true;v.innerHTML='';} if(S.lesson){const b=LESSONS[S.lesson].beats[S.beat]; if(b&&b.open&&innerWidth<900) $('#coach').classList.add('open');} }
function checkCard(x,b){
  const c=b.check; const v=x.get(c.key,{}); const sel=x.get(c.key+'_sel');
  const L=c.lines; const doneN=Object.keys(v).length;
  let h=`<div class="tally">${L.map((l,i)=>`<span class="${v[l.id]?'done':''}">${i+1}</span>`).join('')}</div>`;
  if(sel){ const l=L.find(z=>z.id===sel); const mine=v[sel];
    h+=`<div class="card" style="padding:10px"><p style="font-weight:700;margin:0 0 4px">“${l.text}”</p>${lookButtons(l)}
     <div class="verd">${[['ok','✓','True to her documents','তথ্যের সাথে মেলে'],['chg','≈','Changed the meaning','অর্থ বদলে গেছে'],['none','✗','No evidence','কোনো প্রমাণ নেই']].map(([k,i,t,tb])=>`<button class="${mine===k?'pick'+(k===l.v?'':' wrong'):''}" data-verd="${c.key}|${sel}|${k}"><i>${i}</i>${t}${S.bn?`<span class="bn" lang="bn" style="font-size:11px">${tb}</span>`:''}</button>`).join('')}</div>
     ${mine?`<div class="why ${mine===l.v?'':'no'}"><b>${mine===l.v?'Yes.':'Look again.'}</b> ${l.why}${l.whybn?`<span class="bn" lang="bn">${l.whybn}</span>`:''}</div><div class="quote"><small>${esc(l.src)}</small>${l.quote}</div>`:''}</div>`;
  } else h+=`<div class="note">${c.prompt||'Tap a highlighted line in the AI answer.'}${c.promptbn?`<span class="bn" lang="bn">${c.promptbn}</span>`:''}</div>`;
  if(doneN===L.length) h+=`<div class="good">${c.done||'All lines checked.'}${c.donebn?`<span class="bn" lang="bn">${c.donebn}</span>`:''}</div>`;
  return h;
}
function decideCard(x,b){
  const d=fn(b.decide,x); const a=x.get(d.key);
  let h='';
  if(d.think) h+=`<div class="card" style="padding:10px"><h3 style="font-size:15px">Think first${S.bn?'<span class="bn" lang="bn">আগে ভাবো</span>':''}</h3><ul class="plist">${d.think.map(t=>`<li><span class="ic">${t.i}</span><span>${t.en}${t.bn?`<span class="bn" lang="bn">${t.bn}</span>`:''}</span></li>`).join('')}</ul></div>`;
  if(a!=null){const o=d.options[a]; if(o) h+=`<div class="${o.ok?'good':o.ok===0?'note':'warn'}"><b>${o.ok?'Good choice.':o.ok===0?'Possible — but think.':'Risky.'}</b> ${o.why}${o.whybn?`<span class="bn" lang="bn">${o.whybn}</span>`:''}</div>`;}
  else h+=`<div class="note">${d.prompt||'Choose on the phone.'}${d.promptbn?`<span class="bn" lang="bn">${d.promptbn}</span>`:''}</div>`;
  return h;
}

/* ------------------------------------------------------------- navigation */
function go(i,anim=true){
  const L=LESSONS[S.lesson]; if(!L) return;
  if(S.finishStream) S.finishStream();
  if(VIEW) closeView();
  S.beat=Math.max(0,Math.min(L.beats.length-1,i)); save();
  const x=ctx(); if(x.beat.enter) x.beat.enter(x);
  renderPhone(anim); renderCoach();
  if(x.beat.auto){ const at=S.beat; setTimeout(()=>{ if(S.beat===at&&S.lesson===L.id) go(S.beat+1) },x.beat.auto) }
}
function next(){ const x=ctx(); if(S.streaming&&S.finishStream){S.finishStream();return} if(x.beat.leave) x.beat.leave(x); if(S.beat>=x.L.beats.length-1){ x.set('_finished',true); hub(); return } go(S.beat+1) }
function back(){ if(S.beat===0){hub();return} go(S.beat-1) }
function start(id){ S.lesson=id; S.beat=0; prevScene=null; maybeFullscreen(); go(0); }
function hub(){ S.lesson=null; S.beat=0; save(); prevScene=null; renderHubPhone(); renderCoach(); }
function renderHubPhone(){
  const scr=$('#screen'); $('#kb').hidden=true; const dev=$('#device');
  dev.style.background='radial-gradient(130% 80% at 20% 0%,#C9B8F2 0,#8C77C9 40%,#3C2E6B 100%)';
  $('#sb').className='sb dark'; $('#navbar').className='navbar dark';
  scr.innerHTML=APPS.lock({notifs:ORDER.map(id=>LESSONS[id].notif),hint:'Tap a notification to start'});
  $('.view',scr).style.background='transparent';
}

/* ------------------------------------------------------------- input on the phone */
function onPhoneClick(e){
  const vc=e.target.closest('[data-vclose]'); if(vc){closeView();return}
  const vz=e.target.closest('[data-vzoom]'); if(vz){VIEW.zoom=Math.max(1,Math.min(4,VIEW.zoom+(+vz.dataset.vzoom)*0.5));applyZoom(false);return}
  if(e.target.closest('#viewer')) return;
  const dv=e.target.closest('[data-view]'); if(dv){openView(dv.dataset.view,dv.dataset.mark);return}
  const x=S.lesson?ctx():null;
  const sys=e.target.closest('[data-sys]');
  const ui=e.target.closest('[data-ui]');
  const hit=e.target.closest('[data-hit]');
  if(!S.lesson){ if(hit){const id=(hit.dataset.hit.match(/^start:(.+)/)||[])[1]; if(id){start(id);return}} pulseCoach(); return; }
  const b=x.beat;
  if(ui){ handleUI(ui.dataset.ui,ui,x); return; }
  if(hit){
    const want=[].concat(fn(b.tap,x)||[]);
    if(want.includes(hit.dataset.hit)){
      if(b.onTap){ const r=b.onTap(x,hit.dataset.hit); if(r===false) return; }
      if(hit.dataset.hit==='send'||hit.dataset.hit.startsWith('send')){ if(b.compose){const v=x.get(b.compose.key,'');if(!v.trim()){pulseCoach();return}} }
      next(); return;
    }
    if(b.onHit&&b.onHit(x,hit.dataset.hit,hit)!==false){return}
    wrongTap(hit); return;
  }
  if(sys){ wrongTap(sys); return; }
}
function wrongTap(el){ const want=$('#screen .hl')||$('#device .hl'); if(want){want.classList.remove('nudge');void want.offsetWidth;want.classList.add('nudge')} pulseCoach(); }
function pulseCoach(){ const s=$('.say'); if(s){s.classList.remove('nudge');void s.offsetWidth;s.classList.add('nudge')} }
function handleUI(id,el,x){
  const b=x.beat; const [kind,arg]=[id.split(':')[0],id.slice(id.indexOf(':')+1)];
  if(kind==='key'){ typeKey(arg,x); return; }
  if(kind==='kbtoggle'){ S.keys=!S.keys; renderPhoneKeepFocus(); return; }
  if(kind==='chip'){ toggleChip(arg,x); return; }
  if(kind==='pick'){ const sc=fn(b.scene,x); const sel=x.get(sc.sel,[]).slice(); const k=sel.indexOf(arg); if(k>=0)sel.splice(k,1); else sel.push(arg); x.set(sc.sel,sel); renderPhone(false); renderCoach(); return; }
  if(kind==='opt'&&b.decide){ const d=fn(b.decide,x); x.set(d.key,arg); if(d.onPick) d.onPick(x,arg); renderPhone(false); renderCoach(); if(innerWidth<900) $('#cbody').scrollTop=$('#cbody').scrollHeight; return; }
  if(kind==='line'&&b.check){ x.set(b.check.key+'_sel',arg); renderPhone(false); renderCoach(); const lk=$('#cbody .looks'); if(lk&&innerWidth<900){const cb=$('#cbody'); cb.scrollTop=lk.offsetTop-cb.offsetTop-70;} return; }
  if(b.onUi&&b.onUi(x,kind,arg,el)!==false) return;
  if(x.L.onUi) x.L.onUi(x,kind,arg,el);
}
function activeKB(x){ const sc=fn(x.beat.scene,x); return sc&&sc.kb; }
function typeKey(k,x){
  const kb=activeKB(x); if(!kb||!kb.key) return; let v=x.get(kb.key,'');
  if(k==='bs') v=v.slice(0,-1); else if(k==='nl') v+='\n'; else if(k==='shift'||k==='123') return; else v+=k;
  x.set(kb.key,v); renderPhoneKeepFocus(); renderCoachKeep();
}
function toggleChip(id,x){
  const kb=activeKB(x); const c=(kb.chips||[]).find(z=>z.id===id); if(!c) return;
  let v=x.get(kb.key,'');
  if(v.includes(c.text)) v=v.replace(c.text,'').replace(/ {2,}/g,' ').replace(/^\s+/,'');
  else v=(v&&!/\s$/.test(v)?v+' ':v)+c.text;
  x.set(kb.key,v); renderPhoneKeepFocus(); renderCoachKeep();
}
function renderCoachKeep(){ const k=$('#cbody').scrollTop; renderCoach(); $('#cbody').scrollTop=k; }

/* ------------------------------------------------------------- coach clicks */
function onCoachClick(e){
  const dv=e.target.closest('[data-view]'); if(dv){openView(dv.dataset.view,dv.dataset.mark);return}
  const c=e.target.closest('[data-c]'); const st=e.target.closest('[data-start]');
  if(st){ start(st.dataset.start); return; }
  if(c){ const a=c.dataset.c; if(a==='next')next(); else if(a==='back')back(); else if(a==='show')showMe(); else if(a==='menu')openMenu(); return; }
  const stg=e.target.closest('[data-stage]'); if(stg&&S.lesson){ const i=LESSONS[S.lesson].beats.findIndex(b=>b.stage===stg.dataset.stage); if(i>=0) go(i); return; }
  if(!S.lesson) return; const x=ctx();
  const so=e.target.closest('[data-sort]'); if(so){ const [k,i,v]=so.dataset.sort.split('|'); const a=x.get(k,{}); a[i]=v; x.set(k,a); renderCoachKeep(); return; }
  const ch=e.target.closest('[data-choice]'); if(ch){ const [k,i]=ch.dataset.choice.split('|'); x.set(k,+i); renderCoachKeep(); return; }
  const tk=e.target.closest('[data-tick]'); if(tk){ const [k,i]=tk.dataset.tick.split('|'); const a=x.get(k,{}); a[i]=!a[i]; x.set(k,a); renderCoachKeep(); return; }
  const vd=e.target.closest('[data-verd]'); if(vd){ const [k,id,v]=vd.dataset.verd.split('|'); const a=x.get(k,{}); a[id]=v; x.set(k,a); renderPhone(false); renderCoachKeep(); if(innerWidth<900){const cb=$('#cbody'); cb.scrollTo({top:cb.scrollHeight,behavior:'smooth'})} return; }
  const sp=e.target.closest('[data-speak]'); if(sp){ speak(sp.dataset.speak); return; }
}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='en-GB'; u.rate=.9; speechSynthesis.speak(u);}catch(e){} }

/* ------------------------------------------------------------- Show me (ghost finger) */
function ghostTo(el,cb){
  const g=$('#ghost'),dev=$('#device'); if(!el){cb&&cb();return}
  el.scrollIntoView({block:'nearest'});
  const dr=dev.getBoundingClientRect(),er=el.getBoundingClientRect(); const sc=dr.width/dev.offsetWidth||1;
  g.style.opacity=1; g.style.left=((er.left+er.width/2-dr.left)/sc)+'px'; g.style.top=((er.top+er.height/2-dr.top)/sc)+'px';
  ghostBusy=true;
  setTimeout(()=>{g.classList.add('tap');setTimeout(()=>{g.classList.remove('tap');ghostBusy=false;cb&&cb();setTimeout(()=>g.style.opacity=0,350)},180)},620);
}
function showMe(){
  const x=ctx(), b=x.beat;
  if(S.streaming&&S.finishStream){S.finishStream();return}
  if(b.showMe){ b.showMe(x,{ghostTo,click:el=>el&&el.click(),render:()=>{renderPhone(false);renderCoach()}}); return; }
  if(b.compose){
    const c=b.compose; const kb=activeKB(x); const best=c.best; let v='';
    x.set(c.key,''); renderPhoneKeepFocus();
    const seq=best.slice(); const step=()=>{ if(!seq.length){ renderCoach(); const s=$('#screen [data-hit="'+(fn(b.tap,x)||'send')+'"]'); ghostTo(s,()=>{ if(s) s.click(); }); return; }
      const id=seq.shift(); const el=$(`#kb [data-ui="chip:${id}"]`); ghostTo(el,()=>{ toggleChip(id,x); setTimeout(step,120); }); };
    step(); return;
  }
  if(b.pickShow){ const sc=fn(b.scene,x); x.set(sc.sel,[]); renderPhone(false); const seq=b.pickShow.slice();
    const step=()=>{ if(!seq.length){ const a=$(`#screen [data-hit="${fn(b.tap,x)}"]`); ghostTo(a,()=>a&&a.click()); return; }
      const id=seq.shift(); ghostTo($(`#screen [data-ui="pick:${id}"]`),()=>{ const sel=x.get(sc.sel,[]); sel.push(id); x.set(sc.sel,sel); renderPhone(false); renderCoach(); setTimeout(step,120) }) }; step(); return; }
  if(b.decide){ const d=fn(b.decide,x); const best=Object.keys(d.options).find(k=>d.options[k].ok); const el=$(`#screen [data-ui="opt:${best}"]`); ghostTo(el,()=>{ if(el) el.click(); }); return; }
  if(b.check){ const v=x.get(b.check.key,{}); const l=b.check.lines.find(l=>!v[l.id]); if(!l) return; const el=$(`#screen [data-ui="line:${l.id}"]`); ghostTo(el,()=>{ x.set(b.check.key+'_sel',l.id); v[l.id]=l.v; x.set(b.check.key,v); renderPhone(false); renderCoach(); }); return; }
  if(b.tap){ const t=[].concat(fn(b.tap,x))[0]; const el=$(`#screen [data-hit="${t}"]`)||$(`#device [data-hit="${t}"]`); ghostTo(el,()=>{ if(el) el.click(); }); }
}

/* ------------------------------------------------------------- menu */
function openMenu(){
  const m=$('#menu'); m.hidden=false;
  m.innerHTML=`<div class="panel" role="dialog" aria-label="Menu"><div style="display:flex;justify-content:space-between;align-items:center"><h2>AI Fluency Lab</h2><button class="iconbtn" data-m="close" aria-label="Close">${ico('close')}</button></div>
   <h3>Workflows</h3><div class="pick-cards">${ORDER.map(id=>{const L=LESSONS[id];return `<button class="pcard" data-m="start:${id}"><span class="pi" style="background:${L.tint}">${L.emoji}</span><span><em>${esc(L.kicker)}</em><b>${esc(L.title)}</b><span>${esc(L.time||'')}</span></span></button>`}).join('')}</div>
   <div class="row" style="margin-top:12px"><button class="btn quiet" data-m="hub">Ayesha's lock screen</button><button class="btn quiet" data-m="stage">${S.stage?'Leave':'Present on'} projector (P)</button><button class="btn quiet" data-m="fs">Full screen</button><button class="btn quiet" data-m="print">Paper version</button><button class="btn quiet" data-m="reset">Start over</button></div>
   <h3>For the teacher</h3>
   <p>Each workflow is one class period (35–45 min). Students work in pairs on one phone: one taps, one reads the coach aloud. Swap at every stage.</p>
   <p>The four Ds (Delegation, Description, Discernment, Diligence) come from the AI Fluency framework by Rick Dakan, Joseph Feller and Anthropic. Each stage is coloured by the D it practises.</p>
   <p>Nothing is locked. “Show me” plays any step, so you can demonstrate on the projector, then let pairs repeat it.</p>
   <p>The AI replies are scripted. They copy what real AI assistants do with prompts like these — including the mistakes students must learn to catch. No data leaves the phone and no account is needed.</p>
   <p>Students without a phone: use the Paper version (one A4 page per workflow).</p>
   <h3>Keys</h3><p>→ next · ← back · S show me · P projector · B Bangla</p>
   <h3>Credits</h3><p style="font-size:12.5px;color:var(--ink-muted)">Framework: AI Fluency by Rick Dakan, Joseph Feller and Anthropic (CC BY-NC-SA 4.0). Ayesha Rahman and all her documents are fictional classroom materials. Orbit, Sathi and Studio are invented apps modelled on real ones (Meta Muse and Grok Bot; Gemini, ChatGPT and Claude; Google AI Studio). No affiliation is implied.</p></div>`;
}
function onMenuClick(e){
  const t=e.target.closest('[data-m]'); if(!t){ if(e.target.id==='menu') closeMenu(); return }
  const a=t.dataset.m; closeMenu();
  if(a.startsWith('start:')) start(a.slice(6)); else if(a==='hub') hub(); else if(a==='stage') toggleStage(); else if(a==='fs') toggleFS(); else if(a==='print') location.href='print.html';
  else if(a==='reset'){ S.ch={}; save(); hub(); }
}
function closeMenu(){ $('#menu').hidden=true; }
function toggleStage(){ S.stage=!S.stage; document.body.classList.toggle('stage',S.stage); fit(); }
function toggleFS(){ try{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen({navigationUI:'hide'}) }catch(e){} }
function maybeFullscreen(){ try{ if(matchMedia('(pointer:coarse)').matches&&innerWidth<900&&document.documentElement.requestFullscreen&&!document.fullscreenElement) document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{}) }catch(e){} }

/* ------------------------------------------------------------- language */
function setBn(on){ S.bn=on; document.body.classList.toggle('bangla',on); $('#lang-en').setAttribute('aria-pressed',!on); $('#lang-bn').setAttribute('aria-pressed',on); save(); renderCoachKeep(); }

/* ------------------------------------------------------------- fit the phone on big screens */
function fit(){
  const dev=$('#device'); if(innerWidth<900){dev.style.transform='';return}
  const w=$('#stagewrap'); const s=Math.min((w.clientHeight-48)/916,(w.clientWidth-60)/436,S.stage?1.4:1.18);
  dev.style.transform=`scale(${s})`;
}

/* ------------------------------------------------------------- status bar clock */
function tickClock(){ $('#sb').innerHTML=`<span>${now()}</span><span class="ico"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 22h20V2z" opacity=".95"/></svg><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 0 8.5A17 17 0 0 1 24 8.5z"/></svg><svg viewBox="0 0 24 24" style="width:22px"><rect x="2" y="7" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor"/><rect x="21" y="10" width="1.8" height="4" rx=".8" fill="currentColor"/></svg>76%</span>`; const lt=$('.lock .t'); if(lt) lt.textContent=now(); }

/* ------------------------------------------------------------- boot */
function boot(){
  load();
  document.body.classList.toggle('bangla',S.bn); $('#lang-en').setAttribute('aria-pressed',!S.bn); $('#lang-bn').setAttribute('aria-pressed',S.bn);
  tickClock(); setInterval(tickClock,15000);
  $('#device').addEventListener('click',onPhoneClick);
  $('#coach').addEventListener('click',onCoachClick);
  $('#menu').addEventListener('click',onMenuClick);
  $('#btn-menu').addEventListener('click',openMenu);
  $('#lang-en').addEventListener('click',()=>setBn(false));
  $('#lang-bn').addEventListener('click',()=>setBn(true));
  addEventListener('resize',fit); fit();
  addEventListener('keydown',e=>{
    if(e.target.matches('textarea,input')) return;
    if(e.key==='ArrowRight'&&S.lesson) next(); else if(e.key==='ArrowLeft'&&S.lesson) back();
    else if(e.key==='s'||e.key==='S'){ if(S.lesson) showMe(); } else if(e.key==='p'||e.key==='P') toggleStage(); else if(e.key==='b'||e.key==='B') setBn(!S.bn);
    else if(e.key==='Escape') closeMenu();
  });
  const fromHash=()=>{const h=(location.hash||'').slice(1); const m=h.match(/^(\w+)(?:\/(\d+))?$/); if(m&&LESSONS[m[1]]){ S.lesson=m[1]; prevScene=null; go(m[2]?+m[2]:0,false); return true } return false};
  addEventListener('hashchange',fromHash);
  if(!fromHash()){ if(S.lesson&&LESSONS[S.lesson]) go(S.beat,false); else hub(); }
}

window.AFL={boot,openView,closeView,lesson(L){LESSONS[L.id]=L;ORDER.push(L.id)},esc,ico,FILES,fileThumb,go,next,ctx,renderPhone:()=>renderPhone(false),renderCoach,start,hub,STORY_DATE};
})();
