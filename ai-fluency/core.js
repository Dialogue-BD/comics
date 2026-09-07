(function(root){
'use strict';
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function calculate(room,materials,people){
 if([room,materials,people].some(v=>String(v).trim()===''))return {error:'Complete all three fields.'};
 const r=Number(room),m=Number(materials),n=Number(people);
 if(![r,m,n].every(Number.isFinite))return {error:'Use valid numbers in all three fields.'};
 if(r<0||m<0)return {error:'Costs cannot be negative.'};
 if(n<1)return {error:'Enter at least 1 attendee.'};
 if(!Number.isInteger(n))return {error:'Enter a whole number of attendees.'};
 const total=r+m,each=Math.ceil(total/n);
 if(!Number.isSafeInteger(each)||!Number.isSafeInteger(n)||!Number.isFinite(total))return {error:'Use smaller numbers for this classroom calculator.'};
 return {each,total,surplus:Number((each*n-total).toFixed(2))};
}
const api={escapeHTML,calculate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FluencyCore=api;
})(typeof window==='undefined'?globalThis:window);
