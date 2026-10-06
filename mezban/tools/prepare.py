"""Prepare the existing Mezban art and canonical narration; no generated artwork."""
import json, shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT.parent / 'hingsha'
VERSION = '20261007-mezban-1'
# Page, exact transcript, intact panel rectangle in the original page.
beats = [
(1, "After years abroad, a young man finally came home to Bangladesh. His father had been waiting for this day.", [.006,.003,.39,.29]),
(1, "He held his son close. His wife and daughter stood beside them, smiling. Their family was together again.", [.402,.003,.592,.29]),
(1, "The father was a wealthy man, and he wanted to share his joy. He decided to hold a mezban, a great feast.", [.006,.297,.988,.27]),
(1, "Cooks stirred enormous pots of rice. The family prepared beautiful invitations and sent them to rich neighbors and important people.", [.006,.57,.988,.187]),
(1, "Under a white canopy, the tables were laid and the chairs were ready. There was room for hundreds of guests.", [.006,.76,.988,.237]),
(2, "But the people who received the invitations had other plans. One man waved the messengers away at his gate.", [.006,.003,.486,.203]),
(2, "An important official barely looked up from his desk. He said he couldn't come.", [.498,.003,.496,.203]),
(2, "A businessman was busy with his phone. A wealthy couple said they had no time. Each had an excuse.", [.006,.21,.988,.386]),
(2, "The messengers returned with their invitations still in their hands. Almost nobody had agreed to come.", [.006,.6,.988,.397]),
(3, "The father and his family waited by the gate. They watched the road, hoping the guests would arrive.", [.006,.003,.988,.297]),
(3, "The rice was ready. Steam rose from the pots, and the plates gleamed on the tables. But the chairs were empty.", [.006,.304,.988,.446]),
(3, "Time passed. The feast was ready for everyone, but the invited guests couldn't be bothered to come.", [.006,.754,.988,.243]),
(4, "The messengers explained what had happened. The father listened, then looked across his empty courtyard.", [.006,.003,.988,.304]),
(4, "For a moment, his face fell. All this food, and nobody to share it with.", [.006,.312,.387,.227]),
(4, "Then he looked beyond the gate. A tired rickshaw driver sat beside the road. Children searched for something they could eat.", [.006,.545,.988,.22]),
(4, "Nearby stood a group of hijra. They weren't on anyone's guest list. The father looked at them, and his expression changed.", [.006,.77,.988,.227]),
(5, "He opened the gate wide and spread his arms. Come in, he called. My son's home, and we're having a feast. Come and celebrate with us.", [.006,.003,.988,.245]),
(5, "The people outside stared at him. They were used to being turned away from houses like this.", [.006,.252,.988,.244]),
(5, "Do you mean us? someone asked. All of you, the father said. There's a place for you here.", [.006,.501,.604,.242]),
(5, "His son smiled. The family stepped forward to welcome their new guests. Slowly, the people began to come through the gate.", [.006,.748,.988,.249]),
(6, "Rickshaw drivers came in with children who lived on the streets. The hijra came too, still wondering if they were really welcome.", [.006,.003,.988,.385]),
(6, "The father greeted them himself. His son offered water, and the children washed their hands.", [.006,.392,.988,.185]),
(6, "Please, sit down, they said. The guests took their places. The family stayed beside them, talking and smiling.", [.006,.583,.988,.414]),
(7, "Then the father picked up a serving spoon. He filled a plate for his son and another for an older guest.", [.006,.003,.988,.514]),
(7, "He served a child, then his wife. His son took a spoon too and began to serve the guests.", [.006,.524,.988,.223]),
(7, "There was plenty to go around. Plates passed from hand to hand. Nobody was sent away, and nobody had to eat outside.", [.006,.752,.988,.245]),
(8, "Soon the courtyard was full of laughter. The father offered more rice, and his guests smiled back at him.", [.006,.003,.414,.26]),
(8, "He stood with the hijra guests, laughing and talking. They were part of the celebration, just like everyone else.", [.426,.003,.568,.26]),
(8, "The father and son sat down among the people they had welcomed. They shared the food and listened to each other's stories.", [.006,.269,.988,.228]),
(8, "Women and men, young and old, rich and poor, people from Muslim backgrounds and Hindu backgrounds, all had a place at the feast.", [.006,.501,.988,.195]),
(8, "At one table sat the family, rickshaw drivers, people who begged for a living, and hijra guests. They ate together, passing food and sharing their joy.", [.006,.702,.988,.295]),
(8, "The father looked around the table. His son was home. His house was full. And the feast was finally what he had hoped it would be.", [.006,.702,.988,.295]),
]
glosses = [
(0,'abroad','word','in another country','বিদেশে'),
(1,'held his son close','phrase','hugged his son warmly','ছেলেকে বুকে জড়িয়ে ধরলেন'),
(2,'hold a mezban','culture','host a large communal feast; mezban is associated especially with Chattogram. This story widens the invitation to everyone.','মেজবান আয়োজন করা; বিশেষত চট্টগ্রামের বড় সামাজিক ভোজ। এই গল্পে সবাই আমন্ত্রিত।'),
(4,'the tables were laid','grammar','the tables had been prepared with plates and everything needed for the meal; a passive construction','খাবার টেবিল সাজানো হয়েছিল; এটি passive বা কর্মবাচ্যের উদাহরণ'),
(5,'waved the messengers away','phrasal verb','used a hand gesture to tell the people carrying the invitation to leave','হাত নেড়ে আমন্ত্রণ নিয়ে আসা লোকদের চলে যেতে বললেন'),
(7,'an excuse','word','a reason given for not doing something','অজুহাত'),
(10,'Steam rose','phrase','hot water vapor moved upward from the food','খাবার থেকে গরম ভাপ উঠল'),
(11,"couldn't be bothered",'idiom',"didn't care enough to make the effort",'আসার জন্য কষ্ট করতে বা সময় দিতে রাজি ছিল না'),
(13,'his face fell','idiom','his expression suddenly showed disappointment','হতাশায় তাঁর মুখ মলিন হয়ে গেল'),
(14,'rickshaw driver','phrase','a person who earns a living by driving or pedaling a rickshaw. Rickshaw puller is also used in Bangladesh; rickshaw wallah is a regional term.','রিকশাচালক'),
(15,'hijra','culture','a South Asian gender-diverse community with its own identities and social traditions. The guests are welcomed as people, not as entertainment.','দক্ষিণ এশিয়ার একটি লিঙ্গবৈচিত্র্যময় সম্প্রদায়, যার নিজস্ব পরিচয় ও সামাজিক রীতি আছে। এখানে তাঁরা সম্মানিত অতিথি।'),
(15,'guest list','phrase','the list of people invited to an event','আমন্ত্রিত অতিথিদের তালিকা'),
(17,'being turned away','phrasal verb','being refused entry or welcome','প্রবেশ করতে না দিয়ে ফিরিয়ে দেওয়া'),
(18,"There's a place for you here",'discourse','a warm invitation that says you belong and are welcome','এখানে তোমাদেরও জায়গা আছে; তোমরাও আপনজন'),
(19,'stepped forward','phrasal verb','moved toward someone to offer help or a welcome','এগিয়ে এলেন'),
(22,'took their places','phrase','sat in the seats prepared for them','নিজ নিজ আসনে বসলেন'),
(25,'plenty to go around','idiom','enough for everyone to have some','সবার জন্য যথেষ্ট আছে'),
(25,'from hand to hand','phrase','from one person to the next','একজনের হাত থেকে আরেকজনের হাতে'),
(27,'just like everyone else','phrase','with the same welcome and belonging as the other guests','অন্য সবার মতোই'),
(28,"each other's stories",'grammar','each person tells a story and listens to the other person; a reciprocal expression','একে অন্যের গল্প; পারস্পরিক সম্পর্ক বোঝায়'),
(29,'Muslim backgrounds and Hindu backgrounds','culture',"people with different religious family or community histories; clothing alone doesn't tell us a person's religion",'মুসলিম ও হিন্দু পারিবারিক বা সামাজিক পটভূমির মানুষ; শুধু পোশাক দেখে ধর্ম নির্ধারণ করা যায় না'),
(30,'begged for a living','phrase','depended on asking others for food or money to survive','বেঁচে থাকার জন্য ভিক্ষার ওপর নির্ভর করতেন'),
]
direction = 'Neutral General American English accent. Mature male narrator, warm and clear for English learners, natural connected speech at 145 words per minute. Gentle disappointment, then joyful welcome. One narrator with subtle quoted voices. Local words only: mezban = MEJ-baan; hijra = HIJ-raa. Keep all other English distinctly American. Read the exact text with no additions, music, or sound effects.'
story = dict(id='mezban',title='Mezban',titleBn='মেজবান',kicker='A Bengali retelling of the banquet parable',version=VERSION,audio='audio/mezban-story.mp3',tts=dict(model='Gemini 3.8 Flash TTS',voice='Gacrux',direction=direction))
story['cast'] = {
 'N':dict(role='storyteller; all quoted dialogue is performed by the narrator',voice='Gacrux',accent='neutral General American English'),
 'father':dict(role='wealthy host',appearance='middle-aged, salt-and-pepper beard, white panjabi, no cap'),
 'son':dict(role='returned from abroad',appearance='young adult, short dark hair, beige shirt, dark trousers'),
 'family':dict(role='wife and daughters',appearance='mother in light green, daughters in cream'),
 'guests':dict(role='rickshaw drivers, street children, people who beg, hijra guests; Muslim and Hindu backgrounds',appearance='retain people from original pages; no identities inferred solely from clothing')}
story['frames'] = [dict(src=f'assets/page-{p}.webp',alt=label) for p,label in enumerate(['A son returns and his family prepares a banquet.','Rich and important invitees refuse the invitations.','The family waits beside the empty feast.','The father notices people outside the gate.','He opens the gate and invites everyone in.','The family welcomes the guests and offers water and seats.','Father and son serve the food themselves.','The family and guests share food and laughter at one table.'],1)]
story['portraitPages'] = story['frames']
story['lines'] = [dict(frame=p,panel=i+1,speaker='N',text=t) for i,(p,t,r) in enumerate(beats)]
story['camera'] = [dict(p=p,py=r[1]+r[3]/2,pz=1,lx=.5,ly=.5,lz=1) for p,t,r in beats]
story['cameraBeats'] = [dict(line=i,word=0,page=p,frame=p,label=f'Beat {i+1}: '+t.split('.')[0],portrait=r,landscape=r) for i,(p,t,r) in enumerate(beats)]
# Sub-line focus follows the named action, keeping every selected panel intact.
subcues = [
 (3,'Cooks',[.006,.297,.988,.27]),(3,'The family',[.006,.57,.448,.187]),(3,'sent them',[.46,.57,.534,.187]),
 (7,'A businessman',[.006,.21,.988,.19]),(7,'A wealthy couple',[.006,.406,.988,.19]),
 (10,'The rice',[.006,.304,.988,.256]),(10,'the plates',[.006,.566,.448,.184]),(10,'But the chairs',[.006,.754,.988,.243]),
 (14,'Then he',[.006,.545,.459,.22]),(14,'A tired',[.47,.545,.261,.22]),(14,'Children',[.737,.545,.257,.22]),
 (15,'Nearby',[.006,.77,.522,.227]),(15,'The father',[.534,.77,.46,.227]),
 (19,'His son',[.617,.501,.377,.242]),(19,'The family',[.006,.748,.988,.249]),
 (20,'Rickshaw drivers',[.006,.003,.41,.194]),(20,'children',[.424,.003,.57,.194]),(20,'The hijra',[.006,.201,.486,.184]),
 (21,'The father',[.498,.201,.496,.184]),(21,'His son',[.006,.392,.486,.185]),(21,'the children',[.498,.392,.496,.185]),
 (22,'Please',[.006,.583,.988,.175]),(22,'The family stayed',[.006,.764,.988,.233]),
 (23,'Then',[.006,.003,.988,.287]),(23,'another',[.006,.295,.486,.222]),
 (24,'He served',[.498,.295,.496,.222]),(24,'his wife',[.006,.524,.486,.223]),(24,'His son',[.498,.524,.496,.223]),
 (29,'Women and men',[.006,.501,.475,.195]),(29,'young and old',[.488,.501,.506,.195]),(29,'rich and poor',[.006,.702,.988,.295]),
]
import re
for line,phrase,rect in subcues:
 text=beats[line][1]; start=text.index(phrase); offset=len(re.findall(r"[A-Za-z’'-]+",text[:start]))
 if offset==0:
  cue=next(c for c in story['cameraBeats'] if c['line']==line and c['word']==0);cue.update(portrait=rect,landscape=rect)
 else:
  p=beats[line][0];story['cameraBeats'].append(dict(line=line,word=offset,page=p,frame=p,label=phrase,portrait=rect,landscape=rect))
story['cameraBeats'].sort(key=lambda c:(c['line'],c['word']))
story['glossary'] = [dict(line=l,phrase=p,kind=k,meaning=m,bn=b) for l,p,k,m,b in glosses]
story['culturalNotes'] = ['This is the user’s Bengali adaptation, not a word-for-word biblical quotation.','Hijra guests are treated with dignity and agency, never as a comic spectacle.','The final shared table includes men and women, rich and poor, and people of Muslim and Hindu backgrounds.','Do not identify religious backgrounds from clothes or require conversion for welcome.','Do not label the pictured food as beef; the inclusive feast is not narrowed to one dietary practice.']
story['continuity'] = ['Retain all eight original pages, unaltered.','Son returns from abroad, rich invitees refuse, host invites people outside, family serves, all share the feast.']
story['assets'] = dict(source='mezban.pdf',audio=story['audio'],timings='story-timings.js')
ROOT.joinpath('story.js').write_text('const MEZBAN_STORY = '+json.dumps(story,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined") module.exports={MEZBAN_STORY};\n')
ROOT.joinpath('production/manifest.json').write_text(json.dumps(story,ensure_ascii=False,indent=2)+'\n')
ROOT.joinpath('production/script.txt').write_text('\n'.join(t for p,t,r in beats)+'\n')
ROOT.joinpath('production/voice-direction.txt').write_text(direction+'\n')
for p in range(1,9):
 Image.open(ROOT/f'assets/page-{p}.jpg').save(ROOT/f'assets/page-{p}.webp',quality=90,method=6)
for name in ['index.html','styles.css','app.js','classroom.html']:
 if ROOT.joinpath(name).exists(): continue
 text=BASE.joinpath(name).read_text().replace('HINGSHA','MEZBAN').replace('Hingsha','Mezban').replace('hingsha','mezban')
 import re
 text=re.sub(r'20261005[a-z]*(-audio-cleaned)?',VERSION,text)
 if name=='app.js':
  text=text.replace('const itemWidth = portrait ? 1080 : 1600;','const itemWidth = 1080;').replace('const itemHeight = portrait ? 1525 : 900;','const itemHeight = 1080 * 1672 / 941;')
 if name=='classroom.html':
  text=text.replace('height: 1525','height: 1080 * 1672 / 941')
  text=text.replace("['The promise', 'One for him, two for his neighbor', 'Wealth and envy', 'The final wish', 'The aftermath']","['Homecoming', 'Excuses', 'Empty chairs', 'Outside the gate', 'The invitation', 'Welcome', 'Serving', 'One table']")
  text=text.replace('../comic-classroom/','classroom/')
 if not ROOT.joinpath(name).exists(): ROOT.joinpath(name).write_text(text)
ROOT.joinpath('classroom').mkdir(exist_ok=True)
for name in ['viewer.js','viewer.css']:
 if not ROOT.joinpath('classroom',name).exists():
  shutil.copyfile(ROOT.parent/'comic-classroom'/name,ROOT/'classroom'/name)
print(f'Prepared {len(beats)} lines, 8 pages, {len(glosses)} phrase explanations.')
