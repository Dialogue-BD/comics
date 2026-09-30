const fs=require('fs'), path=require('path'), root=path.resolve(__dirname,'..'), {SCENES}=require(path.join(root,'scenes.js'));
const pronunciation='Speak English naturally. Bengali names use native Bangla pronunciation: Farhana = ফারহানা (far-ha-na, even syllables, not FAR-hana); Tanvir = তানভীর (tan-veer, dental t, smooth even rhythm, not TAN-vir); Arif = আরিফ (AH-rif, open first vowel); Rajshahi = রাজশাহী (raj-sha-hee, smooth three syllables, no heavy English first stress).';
const spoken=t=>t.replace(/<[^>]+>\s*/g,'').replace(/Farhana/g,'ফারহানা').replace(/Tanvir/g,'তানভীর').replace(/Arif/g,'আরিফ').replace(/Rajshahi/g,'রাজশাহী');
const plans={};for(const [id,s] of Object.entries(SCENES)){
 const blocks=[];for(const [i,l] of s.lines.entries()){if(l.w==='N')continue;let last=blocks.at(-1);if(last&&last.w===l.w){last.text+='\n\n'+spoken(l.t);last.lines.push(i)}else blocks.push({w:l.w,name:s.cast[l.w].name,voice:s.cast[l.w].voice.prebuilt,text:spoken(l.t),lines:[i],style:s.cast[l.w].profile+' '+(s.cast[l.w].accent||'')+'. '+(l.s||'')+'. '+pronunciation});}
 plans[id]={dialogue:blocks,narration:[{name:'Narrator',voice:'Sulafat',text:s.lines.filter(l=>l.w==='N').map(l=>spoken(l.t)).join('\n\n'),style:'Warm, clear English storytelling, conversational pace for learners. '+pronunciation}]};
}
// Keep accent direction short and specific to the character being recorded.
for (const id of ['the-boss-stacks-chairs','what-do-you-think']) {
 const name=id==='the-boss-stacks-chairs'?'Tanvir':'Farhana';
 const native=id==='the-boss-stacks-chairs'?'তানভীর, tan-VEER, dental t, short ah as in father, a tapped r':'ফারহানা, far-ha-na, short open a vowels, even gentle syllables and tapped r';
 const named=`Pronounce ${name} naturally in Bangla: ${native}. Briefly code-switch to native Bangla for the name, without English vowel shifts.`;
 plans[id].narration[0].style='Bilingual Bengali narrator reading clear conversational English. '+named;
 for (const block of plans[id].dialogue) {
  if (block.name===name) block.style='Native Bangla speaker from Dhaka speaking English with a clearly audible light Bengali accent. Dental t/d, tapped r, pure vowels, even syllable rhythm. '+(name==='Farhana'?'Young adult woman, gentle but audible voice, initially unsure then steadier. First line under her breath, not spoken stage directions.':'Young adult man, respectful and slightly hesitant. In Sir... I mean Dave... sir, pronounce sir as sar and make the final sir very quiet.');
  else block.style=(name==='Farhana'?'Older American man, warm patient teacher.':'Older American man, easy friendly baritone.')+' '+named;
 }
}
fs.writeFileSync(path.join(root,'scene/review/recording-plan.json'),JSON.stringify(plans,null,2));
