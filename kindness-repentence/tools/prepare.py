"""Rebuild the canonical story data from the original eight wordless pages."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION = '20261007-kindness-1'
# Each rectangle is an intact original panel, in normalized page coordinates.
beats = [
 (1, "As evening fell over a bazaar in Bangladesh, vegetable sellers were finishing another long day. Behind their stalls, workers were preparing the stage for a waz mahfil, a large religious gathering.", [.008,.004,.984,.228]),
 (1, "A stocky man in a dark waistcoat moved through the market. He was a local mastan, a thug whose political connections made him feel untouchable.", [.008,.235,.984,.208]),
 (1, "He stopped beside an older vendor and held out his hand. The demand was familiar. Pay up, or there would be trouble.", [.008,.235,.984,.208]),
 (1, "The vendor handed over the money. It wasn't a payment for anything. It was extortion, and it came out of the little he had earned that day.", [.008,.446,.49,.17]),
 (1, "Other sellers watched in silence. The man slipped the notes into his pocket and walked on. Nobody dared to challenge him.", [.008,.619,.984,.186]),
 (2, "At a nearby tea stall, customers were talking over glasses of hot tea. Then the thug arrived and sat down.", [.008,.004,.984,.355]),
 (2, "The conversation faded. One customer glanced at another. People shifted along the benches, leaving an empty space around him.", [.008,.362,.984,.147]),
 (2, "The tea seller brought his drink and quickly stepped away. The man had money in his pocket, but no one wanted his company.", [.008,.513,.984,.173]),
 (2, "He sat alone while the bazaar carried on around him. People feared him. That didn't mean they respected him.", [.008,.689,.984,.306]),
 (3, "Meanwhile, a respected Islamic preacher had arrived for the mahfil. The elderly hujur had flown in from Dhaka, and the organizers were eager to escort him to the stage.", [.008,.004,.984,.328]),
 (3, "His entourage cleared a path through the crowd. This way, Hujur. Everyone's waiting for you.", [.008,.335,.984,.142]),
 (3, "But the preacher slowed down. Beyond the men surrounding him, he noticed someone sitting by himself at the tea stall.", [.008,.48,.984,.327]),
 (3, "He looked at the lonely figure, then toward the empty place beside him. Before the organizers could guide him on, he turned toward the stall.", [.008,.671,.984,.136]),
 (4, "One of them stepped forward. Hujur, please. You don't want to be seen with that man. He takes money from the poor.", [.008,.004,.984,.224]),
 (4, "Another lowered his voice. He's got political connections. If you sit with him, people will think you're on his side.", [.504,.231,.488,.179]),
 (4, "The preacher listened. He knew the risk was real. Sitting with this man could damage his reputation and leave him open to accusations of supporting the political figures behind him.", [.008,.231,.491,.179]),
 (4, "Still, he stepped past the protesting organizers. He was willing to risk his good name to reach a man everyone else avoided. Around the stall, people turned to watch.", [.008,.414,.984,.34]),
 (4, "The thug looked up. He was used to people getting out of his way. He hadn't expected this visitor to come toward him.", [.008,.758,.984,.237]),
 (5, "May I join you? the preacher asked. The man stared at him, uncertain what to say. Then he got to his feet.", [.008,.004,.984,.193]),
 (5, "The old man greeted him warmly and drew him into an embrace. The man who frightened the whole market stood speechless in his arms.", [.008,.2,.984,.178]),
 (5, "Nearby customers exchanged astonished looks. Of all the people in the bazaar, the honored guest had chosen to sit with him.", [.008,.381,.984,.168]),
 (5, "The preacher settled onto the bench beside him. A cup of tea for me too, please, he said to the seller.", [.008,.552,.984,.135]),
 (5, "The seller brought another glass. Around them, the crowd grew larger, watching a meeting no one had expected.", [.008,.69,.984,.305]),
 (6, "For a while, the two men sat together. The man hadn't apologized, repaid anyone, or promised to change. Yet the preacher had welcomed him with kindness he hadn't earned.", [.008,.004,.984,.212]),
 (6, "The thug lowered his eyes. He had made people afraid of him for so long that he hardly knew how to respond to kindness.", [.008,.219,.984,.218]),
 (6, "His hand moved toward his pocket. Inside were the notes he'd taken from people who could barely afford to lose them.", [.008,.441,.984,.176]),
 (6, "A small tear ran down his cheek. This unexpected welcome had reached him in a way that threats and arguments never had.", [.008,.621,.984,.17]),
 (6, "He looked at the preacher, then back toward the market. There was something he needed to put right, and it couldn't wait.", [.008,.795,.984,.2]),
 (7, "He rose from the bench. The preacher stayed seated and watched as the man pulled the money from his pocket.", [.008,.004,.984,.357]),
 (7, "Then he walked straight back to the vegetable stalls. The sellers saw him coming and braced themselves for another demand.", [.008,.365,.984,.175]),
 (7, "He stopped in front of the older vendor. Earlier, he'd held out an empty hand. Now he held out a stack of notes.", [.008,.543,.984,.149]),
 (7, "I took your money, he said. It was wrong. I'm returning four times what I took. The vendor looked from the money to his face.", [.008,.695,.984,.159]),
 (7, "The man waited as the seller counted it. There was no threat this time, and no favor being asked in return.", [.008,.858,.984,.137]),
 (8, "He went from stall to stall, finding each person he'd forced to pay. He returned four times the amount to every one of them.", [.008,.004,.984,.259]),
 (8, "An older woman accepted the notes with a cautious smile. Another seller held the money in both hands, hardly believing what was happening.", [.008,.004,.984,.466]),
 (8, "The man kept his eyes lowered. Paying them back wouldn't erase what he'd done, but he could begin to make amends.", [.008,.474,.49,.202]),
 (8, "The preacher watched quietly. Around him, faces that had been tense with suspicion began to soften.", [.502,.474,.49,.202]),
 (8, "At the last stall, the man placed the money in the seller's hands. People gathered close, and this time they weren't keeping their distance.", [.008,.68,.984,.315]),
 (8, "Behind them, the mahfil lights shone over the bazaar. The kindness had come first, before any apology or promise. Now the man was choosing a different way to live.", [.008,.68,.984,.315]),
 (8, "His repentance was taking shape in the money he returned and the harm he began to repair. It had started with a welcome he could never have earned.", [.008,.68,.984,.315]),
]
glosses = [
 (0,'As evening fell','phrase','as it gradually became evening','সন্ধ্যা নেমে আসার সময়'),
 (0,'waz mahfil','culture','a public gathering for Islamic preaching; the background event in this Bengali retelling','ইসলামি আলোচনা ও উপদেশের জনসমাবেশ; এই বাংলা রূপান্তরের পটভূমি'),
 (1,'mastan','culture','a local term for a thug or intimidating strongman; here, someone who forces vendors to pay','স্থানীয় গুন্ডা বা ভয় দেখিয়ে প্রভাব খাটানো ব্যক্তি; এখানে বিক্রেতাদের কাছ থেকে জোর করে টাকা নেয়'),
 (1,'political connections','phrase','relationships with influential political people that can provide power or protection','প্রভাবশালী রাজনৈতিক ব্যক্তিদের সঙ্গে সম্পর্ক'),
 (1,'untouchable','word','so powerful or protected that he thinks nobody can punish him','এত প্রভাবশালী বা সুরক্ষিত যে সে মনে করে কেউ তার শাস্তি দিতে পারবে না'),
 (2,'Pay up','phrasal verb','give the money demanded; here it is a threatening command','দাবি করা টাকা দাও; এখানে হুমকির সুরে বলা'),
 (3,'handed over','phrasal verb','gave something to another person; here, under pressure','অন্যের হাতে দিয়ে দিলেন; এখানে চাপের মুখে'),
 (3,'extortion','word','forcing someone to give money by threatening them','ভয় দেখিয়ে জোর করে টাকা আদায়; চাঁদাবাজি'),
 (3,'came out of','phrasal verb','was taken from a limited amount of money','সীমিত আয় থেকে কেটে নেওয়া হয়েছিল'),
 (4,'Nobody dared to','grammar','no one was brave enough to do it; dare is followed here by to and a verb','কেউ সাহস করল না; এখানে dare-এর পরে to ও ক্রিয়া'),
 (6,'leaving an empty space','grammar','a participle phrase describing the result of people moving away','লোকজন সরে যাওয়ার ফল বোঝানো participle phrase'),
 (8,'carried on','phrasal verb','continued as usual','স্বাভাবিকভাবে চলতে থাকল'),
 (9,'hujur','culture','a respectful local address for a Muslim religious teacher or preacher; this character is an elderly invited speaker','মুসলিম ধর্মীয় শিক্ষক বা বক্তাকে সম্মান করে সম্বোধন; এখানে প্রবীণ আমন্ত্রিত বক্তা'),
 (9,'escort him','word','accompany him and guide him to a place','সঙ্গে নিয়ে পথ দেখিয়ে পৌঁছে দেওয়া'),
 (10,'entourage','word','the group of people accompanying an important person','গুরুত্বপূর্ণ ব্যক্তির সঙ্গে থাকা লোকজন'),
 (10,'cleared a path','phrase','made space so someone could move through a crowd','ভিড়ের মধ্যে চলার পথ করে দিল'),
 (13,"be seen with that man",'grammar','be observed in his company; the passive emphasizes what others might think','ওই লোকের সঙ্গে দেখা যাওয়া; অন্যেরা কী ভাববে তা বোঝাতে passive'),
 (14,"on his side",'idiom','supporting him or agreeing with his actions','তার পক্ষে বা তার কাজের সমর্থনে'),
 (15,'leave him open to accusations','phrase','make it possible for others to accuse or criticize him; the risk is public and political','অন্যদের অভিযোগ বা সমালোচনার সুযোগ করে দেওয়া; এখানে সামাজিক ও রাজনৈতিক ঝুঁকি'),
 (16,'risk his good name','idiom','accept the possibility of damage to his reputation; he knows his compassion could cost him public respect','সুনাম ক্ষুণ্ণ হওয়ার ঝুঁকি নেওয়া; দয়া দেখালে মানুষের সম্মান হারানোর আশঙ্কা তিনি বোঝেন'),
 (16,'stepped past','phrase','walked beyond someone despite their objections','আপত্তি সত্ত্বেও পাশ কাটিয়ে এগিয়ে গেলেন'),
 (17,'was used to','grammar','was accustomed to; use a noun or an -ing form after used to in this pattern','অভ্যস্ত ছিল; এই গঠনে used to-এর পরে noun বা -ing form'),
 (18,'got to his feet','idiom','stood up from sitting','বসা থেকে উঠে দাঁড়াল'),
 (19,'speechless','word','unable to speak because of a strong emotion or surprise','আবেগ বা বিস্ময়ে কথা বলতে অক্ষম'),
 (23,"kindness he hadn't earned",'meaning','unmerited favor: kindness offered before he apologized or changed; his repentance is a response to that welcome','অপ্রাপ্য অনুগ্রহ: ক্ষমা চাওয়া বা বদলে যাওয়ার আগেই পাওয়া দয়া; অনুতাপ সেই দয়ার প্রতিক্রিয়া'),
 (25,'could barely afford','phrase','had so little money that the loss was very difficult to bear','টাকা এত কম ছিল যে এই ক্ষতি সামলানো খুব কঠিন'),
 (26,'had reached him','metaphor','had affected him deeply enough to change his feelings or thinking','তার মনে গভীরভাবে প্রভাব ফেলেছিল'),
 (27,'put right','phrase','correct something wrong or repair harm','ভুল সংশোধন বা ক্ষতির প্রতিকার করা'),
 (29,'braced themselves','phrase','prepared for something difficult or unpleasant','কঠিন বা অপ্রীতিকর কিছুর জন্য নিজেকে প্রস্তুত করলেন'),
 (31,'four times what I took','grammar','four times the original amount in total: if he took one hundred taka, he returns four hundred','নেওয়া টাকার মোট চার গুণ: একশ টাকা নিলে চারশ টাকা ফেরত দেয়'),
 (32,'in return','phrase','as repayment or in exchange for something','বিনিময়ে বা প্রতিদানে'),
 (35,"wouldn't erase",'metaphor','would not make the past harm disappear','আগের ক্ষতি মুছে ফেলবে না'),
 (35,'make amends','idiom','take action to repair harm you caused; here, by repaying the victims','নিজের করা ক্ষতির প্রতিকার করতে বাস্তব পদক্ষেপ নেওয়া'),
 (37,'keeping their distance','idiom','staying away from someone physically or socially','শারীরিক বা সামাজিকভাবে দূরে থাকা'),
 (38,'had come first','grammar','past perfect highlights the order: kindness was offered before apology, repayment or change','past perfect দিয়ে ঘটনার ক্রম বোঝানো: ক্ষমা চাওয়া, টাকা ফেরত দেওয়া বা বদলে যাওয়ার আগেই দয়া দেখানো হয়েছিল'),
 (39,'repentance was taking shape','phrase','his change of heart was becoming visible through actions that repaired harm; he was responding to kindness, not earning it','মনের পরিবর্তন ক্ষতির প্রতিকার করার কাজে প্রকাশ পাচ্ছিল; সে দয়ার প্রতিক্রিয়া দিচ্ছিল, দয়া অর্জন করছিল না'),
]
direction = 'One mature male storyteller narrating a fictional bazaar story for B2 English learners. Speak warm, clear neutral General American English at about 150 words per minute, with quiet tension, gentle surprise and restrained emotion. Subtle quoted dialogue in the same narrator voice. Pronounce the Bengali loanwords exactly as a native Bangladeshi Bengali speaker: waz mahfil (ওয়াজ মাহফিল), mahfil (মাহফিল), mastan (মাস্তান), hujur (হুজুর), Dhaka (ঢাকা). Keep the surrounding English General American. Read only the exact narration below, with no additions, spoken directions, music or sound effects.'
story = dict(id='kindness-repentance',title='Kindness & Repentance',titleBn='দয়া ও অনুতাপ',kicker='A Bengali retelling of Zacchaeus · B2 English',level='B2',version=VERSION,audio='audio/kindness-story.mp3',tts=dict(model='Gemini 2.5 Pro Preview TTS',voice='Gacrux',direction=direction))
story['cast'] = {
 'N':dict(role='storyteller; performs all quoted dialogue',voice='Gacrux',accent='neutral General American English'),
 'man':dict(role='local extortionist who chooses to make restitution',appearance='stocky middle-aged man, short black hair and beard, beige panjabi and dark brown waistcoat'),
 'preacher':dict(role='elderly invited hujur from Dhaka',appearance='white beard, white turban and panjabi, cream shawl'),
 'vendors':dict(role='poor vegetable sellers harmed by extortion',appearance='retain the original older male vendors and woman in floral pink covering'),
 'organizers':dict(role='entourage concerned about the preacher’s reputation and the man’s political ties',appearance='retain original men in blue, cream, brown and yellow')}
labels=['Extortion in a bazaar beside preparations for a religious gathering.','Customers leave a feared man sitting alone at a tea stall.','An elderly preacher arrives and notices the lonely man.','His entourage objects, but he approaches the tea stall.','The preacher greets the man warmly and shares tea.','Kindness moves the man to tears and a decision to change.','He returns to an older vendor and offers restitution.','He repays every seller four times the money he took.']
story['frames']=[dict(src=f'assets/page-{p}.webp',alt=label) for p,label in enumerate(labels,1)]
story['portraitPages']=story['frames']
story['lines']=[dict(frame=p,panel=i+1,speaker='N',text=t) for i,(p,t,r) in enumerate(beats)]
story['camera']=[dict(p=p,py=r[1]+r[3]/2,pz=1,lx=.5,ly=.5,lz=1) for p,t,r in beats]
story['cameraBeats']=[dict(line=i,word=0,page=p,frame=p,label=f'Beat {i+1}',portrait=r,landscape=r) for i,(p,t,r) in enumerate(beats)]
subcues=[
 (0,'Behind their stalls',[.008,.004,.984,.228]),
 (4,'Other sellers',[.502,.446,.49,.17]),(4,'The man slipped',[.008,.619,.984,.186]),(4,'Nobody dared',[.008,.808,.984,.187]),
 (5,'At a nearby',[.008,.004,.984,.183]),(5,'Then the thug',[.008,.19,.984,.169]),
 (8,'He sat alone',[.008,.689,.984,.138]),(8,'People feared',[.008,.831,.984,.164]),
 (9,'Meanwhile',[.008,.004,.984,.168]),(9,'The elderly',[.008,.175,.984,.157]),
 (11,'But the preacher',[.008,.48,.984,.19]),(11,'he noticed',[.008,.671,.984,.136]),
 (12,'He looked',[.008,.671,.984,.136]),(12,'Before the organizers',[.008,.812,.984,.183]),
 (16,'Still',[.008,.414,.984,.19]),(16,'Around the stall',[.008,.608,.984,.146]),
 (22,'The seller brought',[.502,.69,.49,.133]),(22,'Around them',[.008,.827,.984,.168]),
 (25,'His hand',[.008,.441,.49,.176]),(25,'Inside were',[.502,.441,.49,.176]),
 (28,'He rose',[.008,.004,.984,.18]),(28,'the man pulled',[.008,.188,.984,.173]),
 (34,'An older woman',[.008,.004,.984,.259]),(34,'Another seller',[.008,.267,.499,.203]),(34,'the money in both hands',[.512,.267,.48,.203]),
]
for line,phrase,r in subcues:
 text=beats[line][1];offset=len(re.findall(r"[A-Za-z’'-]+",text[:text.index(phrase)]));p=beats[line][0]
 if offset==0:
  cue=next(c for c in story['cameraBeats'] if c['line']==line and c['word']==0);cue.update(portrait=r,landscape=r)
 else:story['cameraBeats'].append(dict(line=line,word=offset,page=p,frame=p,label=phrase,portrait=r,landscape=r))
story['cameraBeats'].sort(key=lambda c:(c['line'],c['word']))
story['glossary']=[dict(line=l,phrase=p,kind=k,meaning=m,bn=b) for l,p,k,m,b in glosses]
story['culturalNotes']=[
 'The user’s fictional modern Bengali retelling of Zacchaeus; not a quotation from scripture or a claim about a real preacher or political party.',
 'The preacher offers dignity and compassion without endorsing extortion or political intimidation.',
 'Central connection: unmerited kindness precedes apology or restitution; repentance and repair follow as the man’s response to freely offered favor.',
 'Compassion is costly: the preacher knowingly risks his reputation and accusations of political alignment by offering a public welcome. Do not invent physical danger or a specific party.',
 'Keep the harm to poor vendors visible; emotion alone is not restitution. Fourfold repayment totals four times the amount taken.',
 'Preserve the pictured embrace before sitting for tea. Do not invent an airport or aircraft image; the flight is user-supplied backstory.',
 'Retain Bangladeshi setting and local cultural terms while teaching neutral American English pronunciation.',
 'Do not infer any person’s religion or political party solely from clothing.']
story['continuity']=['Retain all eight original pages unaltered.','Extortion, isolation, invited preacher, entourage objections, embrace and shared tea, tear, decision, fourfold restitution.']
story['assets']=dict(source='kindness_repentence.pdf',audio=story['audio'],timings='story-timings.js')
ROOT.joinpath('story.js').write_text('const KINDNESS_STORY = '+json.dumps(story,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined") module.exports={KINDNESS_STORY};\n')
ROOT.joinpath('production/manifest.json').write_text(json.dumps(story,ensure_ascii=False,indent=2)+'\n')
ROOT.joinpath('production/script.txt').write_text('\n'.join(t for p,t,r in beats)+'\n')
ROOT.joinpath('production/voice-direction.txt').write_text(direction+'\n')
print(f'Prepared {len(beats)} lines, {len(story["cameraBeats"])} camera beats and {len(glosses)} B2 notes.')
