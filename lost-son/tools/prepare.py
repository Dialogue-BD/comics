"""Build The Lost Son from the user's seven-page Bengali graphic novel."""
import json,re,shutil,hashlib
from pathlib import Path
from PIL import Image
R=Path(__file__).resolve().parent.parent
VERSION='20261010-lost-son-4-art-continuity'
# Complete source-panel rectangles, measured in the original landscape sheets.
P={}
for page in (1,5):
 P[page]={n+1:[(n%3)/3+.003,(n//3)/3+.003,1/3-.006,1/3-.006] for n in range(9)}
for page in (2,4):
 P[page]={n+1:[(n%4)/4+.007,(n//4)/3+.014,.24,.31] for n in range(12)}
P[3]={1:[.03,.02,.314,.31],2:[.352,.02,.3,.31],3:[.66,.02,.311,.31],4:[.03,.345,.314,.307],5:[.352,.345,.3,.307],6:[.66,.345,.311,.307],7:[.03,.669,.274,.312],8:[.314,.669,.18,.312],9:[.502,.669,.223,.312],10:[.733,.669,.238,.312]}
P[6]={n+1:[.043+(n%3)*.309,.047+(n//3)*.308,.299,.289] for n in range(9)}
P[7]={1:[.033,.047,.184,.29],2:[.225,.047,.179,.29],3:[.412,.047,.178,.29],4:[.598,.047,.183,.29],5:[.789,.047,.186,.29],6:[.033,.349,.231,.303],7:[.272,.349,.225,.303],8:[.505,.349,.228,.303],9:[.741,.349,.234,.303],10:[.033,.669,.307,.294],11:[.348,.669,.299,.294],12:[.655,.669,.32,.294]}
# Accepted replacement art uses measured native panel gutters.
geometry=R/'production/art-v2/panel-geometry.json'
if geometry.exists():
 P={int(page):{int(n):rect for n,rect in panels.items()} for page,panels in json.loads(geometry.read_text()).items()}
# Each line is displayed and recorded verbatim. Quoted dialogue is performed
# by the same narrator; the character who owns a quotation is recorded too.
D=[
(1,1,'A father lived in a village with his two sons. The older son worked beside him. The younger son wanted a different life.'),
(1,2,'One day, the younger son approached his father. He was tired of waiting for his future to begin.'),
(1,3,'Father, he said, give me my share of the family property. I want to leave.'),
(1,4,'His brother heard him. The father looked at the young man, then quietly agreed to divide what he owned between his sons.'),
(1,5,'His father lowered his eyes. It hurt to let him go, but he didn’t force his son to stay.'),
(1,6,'The father opened his cupboard. There were papers to sign and money to hand over.'),
(1,7,'He signed the papers, then placed the money in his son’s hands.'),
(1,9,'The young man held it close, smiling. Now, he thought, I can live exactly as I please.'),
(2,1,'He packed his suitcase and left the family home.'),
(2,2,'With his money and his plans, he walked away from the village where he had grown up.'),
(2,3,'He climbed onto a bus. The green fields slipped past the window.'),
(2,5,'At the station, he bought a ticket for a train. Soon he was far from home.'),
(2,8,'The city was crowded, noisy, and full of possibilities.'),
(2,10,'He found a room in a comfortable hotel and looked out over the bright lights. Everything seemed to be waiting for him.'),
(3,1,'He bought new clothes and an expensive phone. For the first time, he could buy whatever caught his eye.'),
(3,4,'He made new friends. They ate in expensive restaurants, laughed together, and stayed out late.'),
(3,5,'There was always another meal to order, another bill to pay, another reason to spend.'),
(3,6,'Don’t worry, he told them. It’s on me. His friends smiled and raised their glasses.'),
(3,7,'For a while, it felt like freedom. Nobody told him when to come home or how to use his money.'),
(3,8,'But the money kept leaving his wallet. He spent it as if it would never run out.'),
(3,9,'Then the meals became quieter. He counted what was left, and his friends stopped coming around.'),
(3,10,'At last, he opened his wallet and found almost nothing inside.'),
(4,1,'Hard times came to the city. Food cost more, and work was difficult to find. He could no longer pay for his room.'),
(4,2,'His new phone was damaged. The people he had called his friends were nowhere to be found.'),
(4,3,'He stood beside a food stall, showing his empty pockets. The seller sent him away.'),
(4,4,'At the river, he watched men carrying heavy loads. He needed work. Any work.'),
(4,5,'Please, he said to a man at the fish market. I’ll do whatever you need.'),
(4,7,'The man gave him a job cleaning fish. He worked among the baskets and the mud, for very little money.'),
(4,9,'Day after day, he grew weaker. He had left home with so much. Now he couldn’t even feed himself.'),
(4,10,'Dogs ate the scraps beside the market. He watched them, holding his empty stomach.'),
(4,12,'At night, he pulled a sheet of plastic around himself and tried to sleep.'),
(5,1,'One morning, he finally came to his senses. He thought about his father’s house.'),
(5,2,'Even the people who work for my father have more than enough to eat, he thought. And here I am, starving.'),
(5,3,'He washed his face at a hand pump. He could no longer pretend that everything was fine.'),
(5,4,'I’ll go home, he decided. I’ll tell my father I’ve sinned against God and against him.'),
(5,4,'I’m no longer worthy to be called his son anymore. Perhaps he’ll let me work for him instead.'),
(5,5,'He set off with very little. Along the way, he took odd jobs in the fields.'),
(5,6,'Sometimes a truck gave him a ride. Often, he walked barefoot, carrying his shoes.'),
(5,8,'At last, the familiar fields came into view. Then he saw his father’s house.'),
(6,1,'His father was standing on the veranda, looking down the road.'),
(6,2,'Far away, a figure was coming toward the house. The father looked again.'),
(6,3,'The clothes were dirty. The shoulders were bent. But he knew that walk. It was his son.'),
(6,4,'He put down his cup without thinking about the spilled tea.'),
(6,5,'He gathered up his clothes and began to run.'),
(6,6,'He didn’t wait for his son to reach the gate. He ran out to meet him.'),
(6,7,'The young man dropped to his knees. His hands were empty. He had nothing to offer.'),
(6,8,'Before he could explain, his father reached him and wrapped both arms around him.'),
(6,9,'The father held his son’s head against his face. For a moment, neither of them said anything.'),
(6,9,'Then the son began. Father, I have sinned against God and against you. I am no longer worthy to be called your son anymore.'),
(7,1,'But his father was already calling to the people in the house. Help him wash. Bring him our best clothes.'),
(7,2,'The father helped him dress. He wasn’t being received as a stranger or a worker. He was being welcomed as a son.'),
(7,3,'Prepare a feast, the father said. We’re going to celebrate.'),
(7,4,'Soon, food was cooking in great pots. The courtyard filled with music and laughter.'),
(7,5,'My son was lost. Now he’s found. I thought I’d lost him forever, but he’s home.'),
(7,6,'Meanwhile, the older brother was coming back from the fields. He heard the music before he reached the house.'),
(7,7,'A boy ran out of the courtyard. Your brother’s home, he said. Your father’s having a feast because he’s come back safe.'),
(7,8,'The older brother’s face changed. A feast? For him? After everything he’s done?'),
(7,10,'He was angry and refused to go inside. So his father came out to speak with him.'),
(7,11,'All these years I’ve worked for you, the older son said. I’ve done everything you asked.'),
(7,11,'You never gave me a feast with my friends. But this son of yours wastes your money, comes home, and gets a celebration.'),
(7,12,'The father listened. My son, he said, you’re always with me. Everything I have is yours.'),
(7,12,'But we had to celebrate. Your brother was lost, and now he’s found. He was gone from us, and now he’s home.'),
(7,12,'Come in, my son. Come and be glad with us.')]
Q={2:'younger',7:'younger',17:'younger',32:'younger',34:'younger',35:'younger',48:'younger',49:'father',51:'father',53:'father',55:'boy',56:'older',58:'older',59:'older',60:'father',61:'father',62:'father'}
lines=[dict(frame=p,panel=f'{p}-{n}',speaker='N',quotedSpeaker=Q.get(i),text=t) for i,(p,n,t) in enumerate(D)]
beats=[dict(line=i,word=0,page=p,frame=p,portrait=P[p][n],landscape=P[p][n],label=f'{i+1}: panel {p}-{n}') for i,(p,n,t) in enumerate(D)]
WORD=re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ’'-]+")
def cue(line,phrase,page,panel,label,rect=None):
 offset=len(WORD.findall(D[line][2][:D[line][2].index(phrase)]));r=rect or P[page][panel]
 if offset==0:
  b=next(b for b in beats if b['line']==line and b['word']==0);b.update(page=page,frame=page,portrait=r,landscape=r,label=label)
 else:beats.append(dict(line=line,word=offset,page=page,frame=page,portrait=r,landscape=r,label=label))
cue(0,'The older',1,1,'The father and older son',[.010,.100,.207,.229])
cue(0,'The younger',1,1,'The younger son',[.219,.105,.112,.224])
cue(3,'The father',1,5,'The father’s response')
cue(6,'then',1,8,'Money changes hands')
cue(9,'the village',2,2,'Leaving home')
cue(10,'The green',2,4,'The fields through the window')
cue(11,'bought a ticket',2,6,'Buying the train ticket')
cue(11,'Soon',2,7,'The long train journey')
cue(12,'full of',2,9,'City streets')
cue(13,'looked out',2,12,'The bright city lights')
cue(14,'an expensive',3,3,'The expensive phone')
cue(14,'buy whatever',3,2,'Money spent')
cue(19,'run out',3,10,'The almost empty wallet')
cue(27,'He worked',4,8,'Cleaning fish for little money')
cue(29,'holding',4,11,'His empty stomach')
cue(37,'Often',5,7,'Walking barefoot')
cue(38,'Then',5,9,'The house comes into view')
cue(49,'Bring',7,2,'The best clothes')
cue(52,'The courtyard',7,5,'Music in the courtyard')
cue(55,'Your brother',7,7,'News of the return')
cue(57,'his father',7,9,'The father comes outside too')
beats.sort(key=lambda b:(b['line'],b['word']))
G=[
(2,'my share of the family property','Vocabulary','The part of the family’s money, land, or possessions that he expects to receive.','পারিবারিক সম্পত্তির যে অংশ সে পাওয়ার আশা করছে।'),
(3,'divide what he owned','Grammar','Split his property between the two sons. What he owned means the things that belonged to him.','তাঁর মালিকানাধীন সম্পত্তি দুই ছেলের মধ্যে ভাগ করা। what he owned মানে তাঁর যা ছিল।'),
(6,'placed the money in his son’s hands','Phrase','Gave the money to his son directly.','সরাসরি ছেলের হাতে টাকা তুলে দিলেন।'),
(7,'as I please','Phrase','In whatever way I want. It expresses a wish to choose freely.','নিজের ইচ্ছেমতো।'),
(9,'grown up','Phrasal verb','Spent his childhood and become an adult.','শৈশব কাটিয়ে বড় হয়েছে।'),
(11,'far from home','Phrase','A long distance away from the place and family he knows.','বাড়ি ও পরিচিত পরিবার থেকে অনেক দূরে।'),
(14,'caught his eye','Idiom','Attracted his attention and made him want it.','তার নজর কেড়েছিল বা তার ভালো লেগেছিল।'),
(15,'stayed out late','Phrasal verb','Remained away from home until late at night.','রাত পর্যন্ত বাড়ির বাইরে থাকত।'),
(17,'It’s on me','Idiom','I will pay for everyone. This is a common informal offer.','বিলটা আমি দেব—সবার খরচ দেওয়ার অনানুষ্ঠানিক প্রস্তাব।'),
(19,'as if it would never run out','Grammar','He acted like his money could never be used up, although it could. As if introduces an imagined situation.','টাকা যেন কখনো শেষ হবে না, এমনভাবে সে খরচ করত। as if কল্পিত অবস্থা বোঝায়।'),
(20,'stopped coming around','Phrasal verb','No longer visited or spent time with him.','তার কাছে আসা বা তার সঙ্গে সময় কাটানো বন্ধ করে দিল।'),
(22,'Hard times','Phrase','A period when money, food, or work is difficult to get.','অভাব বা কষ্টের সময়।'),
(23,'nowhere to be found','Idiom','Could not be found anywhere, even when he needed them.','কোথাও খুঁজে পাওয়া যাচ্ছিল না।'),
(24,'sent him away','Phrasal verb','Told him to leave.','তাকে চলে যেতে বলল বা ফিরিয়ে দিল।'),
(26,'whatever you need','Grammar','Anything you need me to do; he is ready to accept any work.','আপনার যে কাজই দরকার হোক, সে করতে রাজি।'),
(28,'Day after day','Phrase','Repeatedly, for many days.','দিনের পর দিন।'),
(28,'couldn’t even feed himself','Grammar','He could not manage the basic need of getting food. Even emphasizes how bad things had become.','নিজের খাবারও জোগাড় করতে পারছিল না। even অবস্থা কত খারাপ হয়েছে তা জোর দিয়ে বোঝায়।'),
(29,'scraps','Vocabulary','Small pieces left over from food or preparing it.','খাবারের বা খাবার তৈরির উচ্ছিষ্ট ছোট টুকরো।'),
(31,'came to his senses','Idiom','Recognized the truth and began thinking clearly about what to do.','বাস্তবতা বুঝে তার হুঁশ ফিরল, কী করা উচিত তা ভাবতে শুরু করল।'),
(32,'more than enough','Phrase','More than the amount needed. He remembers how different life at home was.','প্রয়োজনের চেয়েও বেশি; বাড়ির জীবন কত আলাদা ছিল তা তার মনে পড়ে।'),
(34,'sinned against God and against him','Faith language','Done wrong before God and hurt his father. He accepts responsibility for his choices.','ঈশ্বরের কাছে অন্যায় করেছে এবং বাবাকে কষ্ট দিয়েছে; সে নিজের দায় স্বীকার করছে।'),
(35,'worthy to be called his son','Grammar','Deserving the place or status of a son. To be called is a passive infinitive.','তাঁর ছেলে বলে পরিচিত হওয়ার যোগ্য। to be called কর্মবাচ্যের infinitive।'),
(36,'set off','Phrasal verb','Started a journey.','যাত্রা শুরু করল।'),
(36,'odd jobs','Phrase','Small temporary jobs rather than one steady job.','ছোটখাটো অস্থায়ী কাজ।'),
(37,'gave him a ride','Phrase','Let him travel in the vehicle.','গাড়িতে করে কিছু দূর নিয়ে গেল।'),
(38,'came into view','Phrase','Became visible as he came closer.','কাছে আসার সঙ্গে সঙ্গে চোখে পড়ল।'),
(39,'veranda','Vocabulary','A covered space outside a house where people can sit or stand.','বাড়ির বাইরের ছাউনিযুক্ত বারান্দা।'),
(43,'gathered up his clothes','Phrase','Lifted the loose cloth so he could run.','দৌড়াতে সুবিধা হওয়ার জন্য ঢিলা কাপড় গুটিয়ে ধরলেন।'),
(45,'had nothing to offer','Phrase','Could not bring money, gifts, or anything that might repay his father.','বাবাকে ফেরত দেওয়ার মতো টাকা বা উপহার কিছুই তার ছিল না।'),
(46,'Before he could explain','Grammar','The welcome came first, before an explanation or apology. Before shows the order of events.','সে কিছু ব্যাখ্যা করার আগেই বাবা তাকে জড়িয়ে ধরেন। before ঘটনার ক্রম বোঝায়।'),
(50,'being welcomed as a son','Grammar','Received with the place and dignity of a son; passive continuous form.','ছেলে হিসেবে সম্মান ও আপনত্ব দিয়ে গ্রহণ করা হচ্ছিল; চলমান কর্মবাচ্য।'),
(54,'Meanwhile','Discourse','At the same time, the story turns to another person or place.','এদিকে—একই সময়ে অন্য ব্যক্তি বা জায়গার ঘটনা শুরু হচ্ছে।'),
(57,'refused to go inside','Grammar','Would not enter, even though he was invited. Refuse is followed by to + verb.','আমন্ত্রণ থাকলেও ভেতরে যেতে রাজি হলো না। refuse-এর পরে to + verb বসে।'),
(59,'this son of yours','Discourse','He avoids saying my brother. The wording shows his anger and distance from his brother.','আমার ভাই না বলে আপনার এই ছেলে বলছে; তার রাগ ও দূরত্ব বোঝা যায়।'),
(60,'Everything I have is yours','Grammar','The father reassures him that he already belongs and shares in the household.','বাবা তাকে আশ্বস্ত করেন—সে এই পরিবারের আপনজন, সবকিছুতেই তার অংশ আছে।'),
(61,'Your brother','Discourse','The father restores the family connection that the older son’s words denied.','বাবা তোমার ভাই বলে আবার ভাইয়ের সম্পর্কটি মনে করিয়ে দেন।'),
(62,'be glad with us','Phrase','Join the family’s happiness and celebration.','পরিবারের আনন্দ ও উদ্‌যাপনে যোগ দাও।')]
gloss=[]
for i,(line,phrase,kind,meaning,bn) in enumerate(G):
 text=lines[line]['text'];start=text.index(phrase)
 gloss.append(dict(id=f'phrase-{i+1}',line=line,phrase=phrase,start=start,end=start+len(phrase),kind=kind,meaning=meaning,bn=bn))
labels=['The father divides his property, and the younger son prepares to leave.','The younger son travels from the village to a distant city.','He spends his money on clothes, a phone, meals, and nights out.','Without money or friends, he works at a fish market and goes hungry.','He remembers home and begins the long journey back.','The father recognizes him, runs to him, and holds him close.','The household celebrates, but the older brother stays outside.']
frames=[]
for i,t in enumerate(labels,1):
 native=Image.open(R/f'assets/art-v2/page-{i}.png')
 frames.append(dict(src=f'assets/art-v2/page-{i}.webp',width=native.width,height=native.height,alt=t))
direction='Warm, mature male storyteller, neutral General American English, around 145 words per minute. Conversational and clear for intermediate English learners. One consistent narrator with subtle quoted dialogue, never exaggerated character voices. Begin with gentle tension, keep city excitement light, speak the hardship quietly, and give the father’s running and embrace genuine tenderness without melodrama. Leave natural short pauses at paragraph boundaries and a calm longer breath at the silent embrace. End with the father’s open invitation, warm and unhurried. Pronounce veranda as vuh-RAN-duh. Read only the exact text. Do not speak directions, speaker names, headings, or paragraph numbers. No additions, music, or effects.'
S=dict(id='lost-son',title='The Lost Son',titleBn='হারানো ছেলে',kicker='A Bengali retelling of a father and his two sons',version=VERSION,audio='audio/lost-son-story.mp3',mediaAspect=9/16,tts=dict(model='Gemini 2.5 Pro Preview TTS',voice='Gacrux',direction=direction),cast=dict(N=dict(name='The storyteller',role='One narrator; all quoted dialogue performed subtly in the same voice',voice='Gacrux',accent='neutral General American English'),father=dict(name='The father',role='father of both sons',appearance='older Bengali man with white hair and beard, white panjabi and loose lower garment; cap worn in some scenes',voice='quoted by narrator'),younger=dict(name='The younger son',role='leaves, spends inheritance, returns',appearance='young Bengali man, short black hair, stubble; muted olive/brown clothes, patterned city shirts, then torn dirty clothes and restored white panjabi with dark waistcoat',voice='quoted by narrator'),older=dict(name='The older son',role='works in fields, refuses the feast',appearance='Bengali man with full black beard, white cap, brown panjabi, farm tool',voice='quoted by narrator'),boy=dict(name='The boy',role='brings news from courtyard; employment not inferred',appearance='boy in brown shirt and green shorts',voice='quoted by narrator')),frames=frames,portraitPages=frames,lines=lines,camera=[dict(p=p,py=P[p][n][1]+P[p][n][3]/2,pz=1,lx=.5,ly=.5,lz=1) for p,n,t in D],cameraBeats=beats,panels=[dict(id=f'{p}-{n}',page=p,rect=rect) for p,items in P.items() for n,rect in items.items()],glossary=gloss,culturalNotes=['Contemporary Bengali adaptation of Luke 15:11–32; original narration, not a Bible translation.','Fish-market hardship follows the supplied Bengali visuals, replacing the ancient pig-feeding setting.','Do not infer religious identity or employment status solely from clothing or age.','The father welcomes the younger son before he can explain; forgiveness is not purchased by repayment.','The father also goes outside to invite the older son. Do not invent his acceptance of the invitation.'],continuity=['Preserve original reunion page 6 pixel-for-pixel in the extraction source.','Keep father, both sons, clothing phases, village geography, and open ending consistent.','Keep original PDF and original image extractions unchanged; use sibling files for repairs.'],assets=dict(originalComic='assets/source/prodigal-son-original.pdf',timings='story-timings.js',repair='assets/source/page-3-cleaned.png'),attribution=dict(source='Luke 15:11–32',url='https://www.bible.com/bible/95/LUK.15.11-32.MBCL',narration='Original English retelling for this activity',visuals='AI-created by the user; targeted wordless-page cleanup in this conversion'))
plan=json.loads((R/'production/art-v2/continuity-plan.json').read_text())
for actor in ('father','younger','older'):
 S['cast'][actor]['appearance']=plan['cast'][actor]
S['continuity'] += [plan['house'],'Father approaches kneeling younger son from ahead, through the same narrow single gate.','Older brother remains outside at the open invitation; no substitution with younger son.']
S['attribution']['visuals']='AI-created original by the user; reference-guided reconstruction with continuity and anatomy repairs.'
S['artwork']=dict(version='art-v2',reference='assets/art-v2/cast-and-home-reference.png',review='production/art-v2/review.json',nativeResolution=True,delivery=[])
for i in range(1,8):
 src=R/f'assets/art-v2/page-{i}.png';target=R/f'assets/art-v2/page-{i}.webp'
 im=Image.open(src).convert('RGB');im.save(target,quality=95,method=6)
 S['artwork']['delivery'].append(dict(page=i,source=str(src.relative_to(R)),source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),path=str(target.relative_to(R)),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),width=im.width,height=im.height))
S['assets']['reunion_source_sha256']=hashlib.sha256((R/'assets/source/page-6.jpg').read_bytes()).hexdigest()
(R/'production/manifest.json').write_text(json.dumps(S,ensure_ascii=False,indent=2)+'\n')
(R/'story.js').write_text('const LOST_SON_STORY = '+json.dumps(S,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined") module.exports={LOST_SON_STORY};\n')
script='\n'.join(l['text'] for l in lines)
(R/'production/script.txt').write_text(script+'\n')
(R/'production/voice-direction.txt').write_text(direction+'\n')
if not (R/'production/recording-plan.json').exists():
 (R/'production/recording-plan.json').write_text(json.dumps(dict(model=S['tts']['model'],voice='Gacrux',direction=direction,exactScript='production/script.txt',sourceTake='audio/_originals/lost-son-narration.wav'),indent=2)+'\n')
BASE=R.parent/'american-fisherman'
player=(BASE/'app.js').read_text().replace('FISHERMAN_STORY','LOST_SON_STORY').replace('FISHERMAN_TIMINGS','LOST_SON_TIMINGS')
# Reveal the current visual evidence without showing future adjacent panels.
old_focus='    $$(".world-item", world).forEach((node, i) => node.classList.toggle("current", !overviewMode && i === itemIndex));'
new_focus='''    const activeFocus = !overviewMode ? beat?.[layoutMode] : null;
    $$(".world-item", world).forEach((node, i) => {
      const current = !overviewMode && i === itemIndex;
      node.classList.toggle("current", current);
      node.style.clipPath = current && activeFocus
        ? `inset(${activeFocus[1] * 100}% ${(1 - activeFocus[0] - activeFocus[2]) * 100}% ${(1 - activeFocus[1] - activeFocus[3]) * 100}% ${activeFocus[0] * 100}%)`
        : "";
    });'''
assert old_focus in player, 'Camera template changed; review scene masking before rebuilding.'
player=player.replace(old_focus,new_focus)
(R/'app.js').write_text(player)
html=(BASE/'index.html').read_text().replace('The American &amp; The Fisherman','The Lost Son').replace('20261009-fisherman-1',VERSION)
a=html.index('<footer class="source-credit"');b=html.index('</footer>',a)+len('</footer>')
html=html[:a]+'<footer class="source-credit" aria-label="Source credit"><small>A contemporary Bengali retelling of <a href="https://www.bible.com/bible/95/LUK.15.11-32.MBCL" target="_blank" rel="noopener">Luke 15:11–32</a>. Original English narration for this activity. Visuals created with AI.</small></footer>'+html[b:]
(R/'index.html').write_text(html)
classroom=(BASE/'classroom.html').read_text().replace('The American &amp; The Fisherman','The Lost Son').replace('FISHERMAN_STORY','LOST_SON_STORY').replace('20261009-fisherman-1',VERSION).replace('height: 1920','height: 1125').replace('width: 1080','width: 2000').replace("['The catch', 'Enough', 'A full day', 'The advice', 'The business plan', 'Twenty years', 'Retirement', 'Home']","['The request', 'Leaving home', 'Spending', 'Hardship', 'The journey back', 'The reunion', 'The invitation']")
a=classroom.index('<footer class="classroom-credit"');b=classroom.index('</footer>',a)+len('</footer>')
classroom=classroom[:a]+'<footer class="classroom-credit"><small>The Lost Son · Contemporary Bengali retelling of <a href="https://www.bible.com/bible/95/LUK.15.11-32.MBCL" target="_blank" rel="noopener">Luke 15:11–32</a>. Visuals created with AI.</small></footer>'+classroom[b:]
classroom=classroom.replace('page, width: 2000, height: 1125','page')
(R/'classroom.html').write_text(classroom)
for name in ('styles.css','classroom/viewer.js','classroom/viewer.css'):
 (R/name).parent.mkdir(exist_ok=True);shutil.copyfile(BASE/name,R/name)
with (R/'styles.css').open('a') as css:css.write('\n.comic-world:has(.world-item.current) .world-item:not(.current){visibility:hidden}\n')
with (R/'classroom/viewer.css').open('a') as css:css.write('\n.classroom-credit a{color:#efbc42;text-underline-offset:2px}\n')
# Page-local data is self-contained; static runtime requires no build or API key.
print(f'Locked {len(lines)} lines, {len(WORD.findall(script))} words, {len(beats)} cues, {len(gloss)} phrase notes.')
