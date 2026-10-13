// React entry pages use the existing curriculum, navigation, and stable progress IDs.
const priorEntryMap=foundationsMap;
foundationsMap=function(){
 if(!window.DesignLanding)return priorEntryMap();
 journeyEntry=null;document.body.dataset.entryLanding=pairEntry;
 document.title=pairEntry==='visual'?'Dialogue Design Studio · Visual Communication':'The Writing Room · Dialogue';
 const first=PAIR_ORDER.find(id=>!state.journey.records['foundation-'+id]?.complete)||'line',last=journeyGet(state.journey.last);
 window.entryPageData={path:pairEntry,next:PAIRINGS[last?.t.concept]?last.t.concept:first,hasResume:!!last,level:state.languageSupport,points:foundationPoints(),explored:PAIR_ORDER.filter(id=>state.journey.records['foundation-'+id]?.complete).length,cards:PAIR_ORDER.map((id,i)=>{const r=state.journey.records['foundation-'+id];return {id,visual:DESIGN_LESSONS[id].title,twin:PAIRINGS[id].twin,category:designLessonEntry(id).t.category,number:String(i+1).padStart(2,'0'),status:r?.complete?'Explore again':r?'Continue':'Start',done:!!r?.complete,excerpt:id==='color'?DICTION_ART.bright.after:PAIRINGS[id].after[0],textSvg:literarySVG(id),svg:typographicSVG(id,'entry-card-'+id)}}),feature:Object.fromEntries(['space','contrast','typography'].map(id=>[id,typographicSVG(id,'entry-feature-'+id)]))};
 return '<div id="design-entry-root" aria-label="Design learning entry"></div>';
};
const pairedHydrate=hydrate;
hydrate=function(){const host=$('#design-entry-root');if(host&&window.DesignLanding){window.DesignLanding.mount(host,window.entryPageData);}else{window.DesignLanding?.unmount();document.body.dataset.entryLanding='lesson';pairedHydrate();window.DesignLanding?.bindChiastic();}};
const pairedRender=render;
render=function(){window.DesignLanding?.unmount();document.body.dataset.entryLanding='lesson';pairedRender();};
