/* Transcript timing helpers shared by the activity and its tests. */
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function sceneAt(data,t){return data.scenes.find(s=>t>=s.start&&t<s.end)||data.scenes[t<data.scenes[0].start?0:data.scenes.length-1];}
export function cueAt(data,t){let i=0;while(i+1<data.cues.length&&data.cues[i+1].start<=t)i++;return {cue:data.cues[i],index:i};}
export function wordAt(data,t){return data.words.findIndex(w=>t>=w.s&&t<w.e);}
export function followerAt(data,t){
 let i=0;while(i+1<data.words.length&&data.words[i+1].s<=t)i++;
 const w=data.words[i],next=data.words[i+1];
 return {index:i,active:t>=w.s&&(t<=w.e+.22||!next||next.s-w.e<=.72)};
}

