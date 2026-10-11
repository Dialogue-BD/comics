export const LEVELS = {
  1: {name:'More support', seconds:11, targets:2, choices:4},
  2: {name:'Balanced', seconds:11, targets:4, choices:6},
  3: {name:'Stretch', seconds:11, targets:6, choices:9}
};
export function scoreRound(targets, selected) {
  const wanted=new Set(targets), picked=new Set(selected);
  const hits=[...picked].filter(w=>wanted.has(w)).length;
  const falseAlarms=picked.size-hits;
  const recall=wanted.size?hits/wanted.size:0;
  const precision=picked.size?hits/picked.size:0;
  const accuracy=(recall+precision)?2*recall*precision/(recall+precision):0;
  return {hits,total:wanted.size,falseAlarms,accuracy};
}
export function passAccuracy({hits,total,falseAlarms=0}) {
  return total+hits+falseAlarms?2*hits/(total+hits+falseAlarms):0;
}
export function adapt(state, accuracy) {
  const level=Math.max(1,Math.min(3,state.level));
  if(accuracy<.55) return {level:Math.max(1,level-1),strong:0};
  if(accuracy>=.85) {
    const strong=state.strong+1;
    return strong>=2?{level:Math.min(3,level+1),strong:0}:{level,strong};
  }
  return {level,strong:0};
}
export function shuffle(items, random=Math.random) {
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
// Prefer a nearby breath. Never cut through a known word or target phrase.
export function nextRound(voice, start, level, pool) {
  const config=LEVELS[level];
  let end=Math.min(voice.duration,start+config.seconds);
  if(voice.duration-end<2.5) end=voice.duration;
  if(end<voice.duration){
    const gaps=voice.boundaries.filter(t=>t>=start+3&&Math.abs(t-end)<1.8);
    if(gaps.length) end=gaps.sort((a,b)=>Math.abs(a-end)-Math.abs(b-end))[0];
    for(const k of voice.keywords) if(k.start<end&&k.end>end) end=k.end+.25;
    end=Math.min(voice.duration,end);
  }
  const available=voice.keywords.filter(w=>w.start>=start-.04&&w.end<=end+.04);
  if(!available.length&&end<voice.duration){
    const next=voice.keywords.find(w=>w.start>=start);
    if(next) end=Math.min(voice.duration,Math.max(end,next.end+.6));
  }
  const candidates=voice.keywords.filter(w=>w.start>=start-.04&&w.end<=end+.04);
  const unique=[...new Map(candidates.map(w=>[w.word,w])).values()];
  const targets=shuffle(unique).slice(0,config.targets);
  // Decoys are absent from the ENTIRE recording, so unselected real words
  // and words heard on an earlier replay are never labelled incorrect.
  const present=new Set(voice.spokenVocabulary);
  const decoys=shuffle(pool.filter(w=>!present.has(w.toLowerCase()))).slice(0,config.choices-targets.length);
  return {start,end,targets,choices:shuffle([...targets.map(w=>w.word),...decoys]),level};
}
