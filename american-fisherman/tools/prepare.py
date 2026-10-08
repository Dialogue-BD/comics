"""Rebuild the canonical activity data and optimized art from preserved sources."""
import json,re
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
VERSION='20261009-fisherman-1'
# Rectangles retain complete panels in the original 9:16 sheets.
P={
1:{1:[.01,.005,.98,.244],2:[.01,.254,.98,.242],3:[.01,.501,.471,.241],4:[.488,.501,.502,.241],5:[.01,.747,.98,.244]},
2:{1:[.01,.005,.98,.213],2:[.01,.222,.487,.17],3:[.503,.222,.487,.17],4:[.01,.397,.98,.184],5:[.01,.586,.487,.184],6:[.503,.586,.487,.184],7:[.01,.775,.98,.219]},
3:{1:[.006,.003,.988,.179],2:[.006,.187,.49,.174],3:[.502,.187,.492,.174],4:[.006,.365,.988,.163],5:[.006,.533,.988,.154],6:[.006,.692,.327,.135],7:[.339,.692,.284,.135],8:[.629,.692,.365,.135],9:[.006,.831,.988,.165]},
4:{1:[.006,.003,.988,.243],2:[.006,.25,.452,.177],3:[.465,.25,.529,.177],4:[.006,.431,.988,.19],5:[.006,.626,.365,.156],6:[.377,.626,.617,.156],7:[.006,.787,.988,.209]},
5:{1:[.006,.003,.49,.165],2:[.502,.003,.492,.165],3:[.006,.171,.317,.146],4:[.329,.171,.331,.146],5:[.666,.171,.328,.146],6:[.006,.321,.347,.153],7:[.359,.321,.316,.153],8:[.681,.321,.313,.153],9:[.006,.478,.311,.153],10:[.323,.478,.302,.153],11:[.631,.478,.363,.153],12:[.006,.637,.405,.144],13:[.418,.637,.256,.144],14:[.681,.637,.313,.144],15:[.006,.785,.988,.209]},
6:{1:[.01,.006,.98,.24],2:[.01,.251,.297,.196],3:[.314,.251,.332,.196],4:[.652,.251,.338,.196],5:[.01,.452,.242,.164],6:[.258,.452,.231,.164],7:[.495,.452,.234,.164],8:[.735,.452,.255,.164],9:[.01,.621,.98,.172],10:[.01,.798,.476,.196],11:[.492,.798,.498,.196]},
7:{1:[.008,.004,.517,.184],2:[.531,.004,.461,.184],3:[.008,.193,.332,.17],4:[.346,.193,.292,.17],5:[.644,.193,.348,.17],6:[.008,.369,.481,.135],7:[.495,.369,.497,.135],8:[.008,.51,.332,.152],9:[.346,.51,.292,.152],10:[.644,.51,.348,.152],11:[.008,.667,.469,.151],12:[.483,.667,.509,.151],13:[.008,.823,.655,.173],14:[.67,.823,.322,.173]},
8:{1:[.01,.004,.98,.241],2:[.01,.25,.472,.214],3:[.488,.25,.502,.214],4:[.01,.469,.487,.195],5:[.503,.469,.487,.195],6:[.01,.669,.98,.16],7:[.01,.834,.98,.161]}}
# Text is the spoken dialogue. Delivery notes and speaker metadata never enter it.
D=[
('A',1,1,'Good morning. What beautiful tuna!'),
('A',1,3,'How long did it take to catch them?'),
('F',1,5,'Oh, about two hours.'),
('A',1,3,'Only two hours? Amazing!'),
('A',2,1,"Why didn't you fish for longer and catch more?"),
('F',2,4,"I didn't want to fish for longer."),
('F',2,6,'With this, I have enough fish for my family.'),
('A',2,7,'But what do you do with the rest of your day?'),
('A',2,1,"Aren't you bored?"),
('F',2,5,"I'm never bored."),
('F',3,1,'I get up late, play with my children, watch football, and take a siesta with my wife.'),
('F',3,6,'Sometimes in the evenings I walk to the village to see my friends,'),
('F',3,9,'play the guitar, and sing some songs.'),
('A',4,1,"Really? That's all you do?"),
('A',4,2,'Look, I am a very successful businessman.'),
('A',4,2,'I went to Harvard University and I studied business.'),
('A',4,1,'I can help you.'),
('A',4,3,'Fish for four hours every day and sell the extra fish you catch.'),
('F',4,6,'But...'),
('A',5,2,'Then you can buy a bigger boat, catch more and earn more money.'),
('F',4,6,'But...'),
('A',5,3,'Then buy a second boat, a third, and so on, until you have a big fleet of fishing boats.'),
('F',4,6,'But...'),
('A',5,12,'And you can export the fish and leave this village'),
('A',5,15,'and move to Mexico City, or LA, or New York, and open a fishing business.'),
('F',6,1,'Okay, okay, okay. But how long will all this take?'),
('A',6,2,'Ah, let me think. Um, probably about fifteen to twenty years.'),
('F',6,11,'Fifteen to twenty years? And then what, señor?'),
('A',6,10,"Why, that's the exciting part!"),
('A',7,1,'You can sell your business and become very rich. A millionaire.'),
('F',7,14,'A millionaire? Really? But what do I do with all the money?'),
('A',7,6,'Well, let me think. I know!'),
('A',7,7,'You can stop work and move to a lovely old fishing village'),
('A',7,8,'where you can sleep late, play with your grandchildren, watch football,'),
('A',7,11,'take a siesta with your wife, and walk to the village in the evenings'),
('A',7,12,'where you can play the guitar and sing with your friends all you want.'),
('F',7,14,'Well...'),
('C',8,1,'Papa! Papa! Did you catch many fish?'),
('F',8,2,'I caught enough for us today and tomorrow and also some for this gentleman.'),
('F',8,3,'Please, señor, have some of my beautiful fish.'),
('F',8,6,"Goodbye, señor. Come on, children. Let's go home.")]
WORD=re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ’'-]+")
lines=[dict(speaker=s,frame=p,panel=f'{p}-{n}',text=t) for s,p,n,t in D]
camera=[dict(p=p,py=P[p][n][1]+P[p][n][3]/2,pz=1,lx=.5,ly=.5,lz=1) for s,p,n,t in D]
beats=[]
def beat(line,phrase,page,panel,label,rect=None):
 text=D[line][3];offset=text.index(phrase) if phrase else 0
 word=len(WORD.findall(text[:offset]));r=rect or P[page][panel]
 beats.append(dict(line=line,word=word,page=page,frame=page,portrait=r,landscape=r,label=label))
for i,(s,p,n,t) in enumerate(D):beat(i,'',p,n,f'{i+1}: {s} · panel {p}-{n}')
beat(0,'What',1,2,'The beautiful tuna')
beat(4,'longer',2,2,'A longer day of fishing')
beat(4,'catch more',2,3,'A larger catch')
beat(10,'play',3,2,'Play with the children')
beat(10,'watch',3,4,'Watch football')
beat(10,'take',3,5,'A siesta with his wife')
beat(11,'see',3,7,'Meet village friends',rect=[.339,.692,.655,.135])
beat(17,'sell',4,4,'Selling extra fish')
beat(19,'earn',4,5,'Earn more money')
beat(21,'a third',5,4,'A third boat')
beat(21,'until',5,5,'A whole fleet')
beat(23,'leave',5,15,'Leaving for the city')
beat(26,'probably',6,5,'Years passing',rect=[.01,.452,.98,.341])
beat(29,'become',7,2,'The imagined wealthy life')
beat(29,'A millionaire',7,4,'A millionaire')
beat(33,'play',7,9,'Play with grandchildren')
beat(33,'watch',7,10,'Watch football in retirement')
beat(34,'walk',7,12,'Evenings in the fishing village')
beat(35,'sing',7,13,'Sing with friends')
beat(38,'and also',8,3,'Enough fish to share')
beat(39,'have some',8,5,'The gift of fish')
beats.sort(key=lambda b:(b['line'],b['word']))
G=[
(0,'What beautiful tuna','Grammar','What + adjective + noun expresses admiration or surprise. Tuna is a kind of large sea fish.','কী সুন্দর টুনা মাছ! What + বিশেষণ + বিশেষ্য দিয়ে মুগ্ধতা প্রকাশ করা হয়।'),
(1,'How long did it take','Grammar','Ask about the time needed to finish something. Past question: did + subject + take.','কত সময় লেগেছিল? কোনো কাজ করতে কত সময় লাগে তা জানতে এই প্রশ্ন করা হয়।'),
(4,'fish for longer','Grammar','Fish is a verb here: catch fish. Longer compares the length of time.','এখানে fish মানে মাছ ধরা। for longer মানে আরও বেশি সময় ধরে।'),
(6,'enough fish for my family','Grammar','Enough comes before a noun: the amount needed, with no more necessary.','আমার পরিবারের জন্য যথেষ্ট মাছ। enough + বিশেষ্য = প্রয়োজন মেটানোর মতো পরিমাণ।'),
(7,'the rest of your day','Phrase','The time left after you finish fishing.','দিনের বাকি সময়।'),
(8,"Aren't you bored",'Grammar','A negative question can show surprise: the speaker expects you might feel bored.','তোমার কি একঘেয়ে লাগে না? নেতিবাচক প্রশ্নটি এখানে বিস্ময় প্রকাশ করে।'),
(10,'get up late','Phrasal verb','Get out of bed late in the morning.','সকালে দেরিতে বিছানা থেকে ওঠা।'),
(10,'take a siesta','Culture & phrase','Have a short afternoon rest or nap. Siesta is a Spanish word used in English too.','দুপুরে অল্প সময় বিশ্রাম নেওয়া বা ঘুমানো। siesta স্প্যানিশ শব্দ, ইংরেজিতেও ব্যবহৃত হয়।'),
(11,'in the evenings','Grammar','A repeated routine, rather than one particular evening.','সন্ধ্যাগুলোতে—নিয়মিত অভ্যাস বোঝায়।'),
(12,'play the guitar','Grammar','English usually uses the before musical instruments: play the guitar.','গিটার বাজানো। বাদ্যযন্ত্রের নামের আগে সাধারণত the বসে।'),
(13,"That's all you do",'Discourse','A surprised question: is that the whole of your routine? His tone suggests he thinks it is too little.','এইটুকুই করো? প্রশ্নের সুরে বোঝা যায়, ব্যবসায়ীর কাছে কাজগুলো যথেষ্ট মনে হচ্ছে না।'),
(15,'Harvard University','Name','A university in the United States. He mentions his education to give authority to his advice.','যুক্তরাষ্ট্রের একটি বিশ্ববিদ্যালয়। নিজের পরামর্শকে গুরুত্ব দিতে তিনি শিক্ষাগত পরিচয় বলছেন।'),
(17,'the extra fish','Vocabulary','Fish beyond what the family needs, which could be sold.','পরিবারের প্রয়োজনের বাইরে অতিরিক্ত মাছ, যা বিক্রি করা যায়।'),
(18,'But','Discourse','He starts an objection. The businessman interrupts him and continues the plan with then.','সে আপত্তি জানাতে শুরু করে। ব্যবসায়ী তার কথা থামিয়ে তারপর বলে পরিকল্পনা চালিয়ে যায়।'),
(19,'a bigger boat','Grammar','Bigger is the comparative of big: a boat larger than the one he has now.','আরও বড় নৌকা। big-এর তুলনামূলক রূপ bigger।'),
(19,'earn more money','Phrase','Receive more money from work or business.','কাজ বা ব্যবসা করে আরও বেশি টাকা উপার্জন করা।'),
(21,'and so on','Phrase','Continue the same pattern: a second boat, a third, a fourth, and more.','এইভাবে আরও—দ্বিতীয় নৌকা, তৃতীয় নৌকা, চতুর্থ নৌকা ইত্যাদি।'),
(21,'a big fleet of fishing boats','Vocabulary','A large group of fishing boats owned or operated together.','একসঙ্গে পরিচালিত অনেক মাছ ধরার নৌকার বহর।'),
(23,'export the fish','Vocabulary','Send the fish to another country to sell it.','বিক্রির জন্য অন্য দেশে মাছ পাঠানো বা রপ্তানি করা।'),
(24,'move to','Phrase','Go to live in a new place, not just visit it.','নতুন জায়গায় বসবাস করতে চলে যাওয়া।'),
(24,'LA','Name','The spoken initials stand for Los Angeles, a city in the United States. The city pictures illustrate a future business life.','L.A. হলো যুক্তরাষ্ট্রের Los Angeles শহরের সংক্ষিপ্ত নাম। ছবিতে ভবিষ্যৎ শহুরে ব্যবসায়ী জীবন দেখানো হয়েছে।'),
(25,'how long will all this take','Grammar','Ask about a future duration: will + subject + take. Compare the past question at the start.','এসব করতে কত সময় লাগবে? ভবিষ্যৎ সময় জানতে will + কর্তা + take ব্যবহার করা হয়।'),
(26,'let me think','Discourse','A natural way to ask for a moment before giving an answer.','একটু ভাবতে দিন—উত্তর দেওয়ার আগে সময় নেওয়ার স্বাভাবিক উপায়।'),
(27,'señor','Culture & pronunciation','Spanish for sir or Mr.; a polite form of address. Say roughly sen-YOR.','স্প্যানিশ ভাষায় জনাব বা স্যার; সম্মান করে সম্বোধন। উচ্চারণ আনুমানিক সেন-ইয়োর।'),
(29,'sell your business','Phrase','Transfer ownership of the company in return for money.','টাকার বিনিময়ে ব্যবসার মালিকানা অন্যের কাছে হস্তান্তর করা।'),
(29,'A millionaire','Vocabulary','Someone with at least a million units of money. Here it represents becoming very wealthy.','দশ লক্ষ বা তার বেশি অর্থসম্পদের অধিকারী; এখানে খুব ধনী হওয়ার ধারণা।'),
(32,'stop work','Phrase','Finish working for a living and retire. The advice promises time to enjoy life later.','জীবিকা উপার্জনের কাজ বন্ধ করে অবসর নেওয়া।'),
(33,'grandchildren','Vocabulary','The children of your children; the plan takes many years.','নাতি-নাতনি; পরিকল্পনাটি সম্পূর্ণ হতে অনেক বছর লাগে।'),
(35,'all you want','Phrase','As much as you would like, without having to stop for work.','যত ইচ্ছে, কাজের জন্য থামতে হবে না।'),
(37,'Papa','Family word','A familiar word for father or dad.','বাবাকে ডাকতে ব্যবহৃত পরিচিত শব্দ।'),
(38,'enough for us','Story connection','He repeats enough: the family has what it needs, and he can still share with his visitor.','আমাদের জন্য যথেষ্ট। পরিবারের প্রয়োজন মিটিয়েও অতিথিকে দিতে পারছে।'),
(38,'this gentleman','Polite expression','A respectful way to refer to the man nearby.','পাশের ব্যক্তিকে সম্মান করে এই ভদ্রলোক বলা।'),
(40,'Come on','Discourse','Here it encourages the children to come along and go home.','এখানে বাচ্চাদের সঙ্গে নিয়ে বাড়ি যাওয়ার আহ্বান: চলো।')]
gloss=[dict(id=f'phrase-{i+1}',line=l,phrase=p,kind=k,meaning=m,bn=b) for i,(l,p,k,m,b) in enumerate(G)]
for g in gloss:
 g['start']=lines[g['line']]['text'].index(g['phrase']);g['end']=g['start']+len(g['phrase'])
alt=['The American admires the fisherman’s tuna and asks about his short working day.','The fisherman explains that his family already has enough.','The fisherman’s daily life: children, football, a siesta, guitar, and friends.','The American proposes more fishing, selling fish, and a bigger boat.','The imagined business grows into a fleet, exports, and a city company.','They consider fifteen to twenty years of work and the fisherman’s aging.','The imagined wealthy fisherman retires to the same pleasures he enjoys today.','His children arrive. He shares fish with the visitor and takes his family home.']
frames=[dict(src=f'assets/page-{i+1}.webp',alt=a,width=1080,height=1920) for i,a in enumerate(alt)]
S=dict(id='american-fisherman',title='The American & The Fisherman',titleBn='আমেরিকান ও জেলে',kicker='A story about ambition, time, and enough',version=VERSION,audio='audio/fisherman-story.mp3',mediaAspect=16/9,
 cast=dict(A=dict(name='The American',role='visiting businessman',appearance='older white man, gray curly hair, sunglasses, green floral shirt, beige shorts',voice='original businessman actor; recording identity retained',accent='source-recording English; not newly generated'),F=dict(name='The fisherman',role='Mexican fisherman and father',appearance='tan skin, short curly black hair, rust-red shirt, gray shorts; ages in imagined future',voice='original fisherman actor; recording identity retained',accent='source-recording English with Spanish address señor'),C=dict(name='The children',role='fisherman’s children',appearance='boy and girl from the final page',voice='original child voice(s); recording identity retained'),wife=dict(role='fisherman’s wife',appearance='same woman in floral dress, aged in retirement; silent')),
 recording=dict(route='Reuse existing project MP3',model='Publisher recording from New Headway; no new TTS generation',source='american_fisherman.mp3',trimStart=7,deliveryNotes='Preserve all original voices, interruption, pauses, and conversational intonation.'),frames=frames,portraitPages=frames,lines=lines,camera=camera,cameraBeats=beats,glossary=gloss,
 panels=[dict(id=f'{p}-{n}',page=p,rect=r) for p,panels in P.items() for n,r in panels.items()],
 culturalNotes=['Mexico setting follows the existing dialogue, including señor and siesta.','The two characters represent contrasting choices in this parable, not every American or Mexican.','The retirement is imagined for the fisherman; repair page 7 to preserve that identity.','Home, family, and friendship remain valued; do not add a moral speech to the recording.'],continuity=['American stays on the quay; fisherman stays beside his boat in present-time conversation.','Growth and retirement are imagined possibilities, not events that have already happened.','Return to the original younger fisherman and his children at the end.'],assets=dict(originalComic='american_fisherman.pdf',originalAudio='audio/_originals/american-fisherman-source.mp3',artRepair='assets/source/page-7-retirement-repaired.png'))
for i in range(1,9):
 src=ROOT/f'assets/source/page-{i}.jpg'
 if i==7:src=ROOT/'assets/source/page-7-retirement-repaired.png'
 im=Image.open(src).convert('RGB');im.resize((1080,1920)).save(ROOT/f'assets/page-{i}.webp',quality=91,method=6)
S['attribution']=dict(audioTitle='The businessman and the fisherman',book='New Headway Elementary',edition=4,authors=['Liz Soars','John Soars'],publisher='Oxford University Press',copyrightYear=2011,unit=6,studentBookPages='50–51',track='T6.11',visuals='Independently created with AI by the user; page 7 identity repair during this conversion',evidence=['https://ektu.kz/files/DistanceEducation/Work/214581/hw_elem_trd_sb_tapescripts.pdf','https://library.bsma.edu.ge/BOOKS/New_Headway_Elementary_Student_39_s_Book_2014.pdf','https://books.google.com/books?id=1g1czgAACAAJ'],verifiedOn='2026-10-09')
(ROOT/'production/manifest.json').write_text(json.dumps(S,ensure_ascii=False,indent=2)+'\n')
(ROOT/'production/script.txt').write_text('\n'.join(l['text'] for l in lines)+'\n')
(ROOT/'story.js').write_text('const FISHERMAN_STORY = '+json.dumps(S,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined") module.exports={FISHERMAN_STORY};\n')
# Copy the existing three-pass player, changing only this story's configuration.
player=(ROOT.parent/'mezban/app.js').read_text().replace('MEZBAN_STORY','FISHERMAN_STORY').replace('MEZBAN_TIMINGS','FISHERMAN_TIMINGS').replace("A-Za-z’'-","A-Za-zÀ-ÖØ-öø-ÿ’'-").replace('1080 * 1672 / 941','1080 * S.mediaAspect')
player=player.replace('$("#mode-label").textContent = label;','$("#mode-label").textContent = label;')
player=player.replace('currentLine.replaceChildren();','$("#speaker-name").textContent = S.cast[S.lines[i].speaker].name;\n    currentLine.replaceChildren();')
player=player.replace('text.append(annotatedLine(line.text, i, lineStarts[i]));','const speaker = document.createElement("b"); speaker.className = "speaker-name"; speaker.textContent = S.cast[line.speaker].name + ": "; text.append(speaker, annotatedLine(line.text, i, lineStarts[i]));')
player=player.replace('nextWord >= 0 ? lineForWord(nextWord) : lineIndex','nextWord >= 0 ? lineForWord(nextWord) : 0')
player=player.replace('function openGloss(item) {','function openGloss(item) {\n    audio.pause();')
player=player.replace('function buildWorld(force = false) {', '''function fitStage() {
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const credit = document.querySelector('.source-credit');
    const notes = document.querySelector('.stage-notes');
    const noteHeight = notes ? notes.getBoundingClientRect().height : 0;
    const reserved = !document.fullscreenElement && credit ? credit.getBoundingClientRect().height + noteHeight + 20 : noteHeight;
    const height = Math.max(220, window.innerHeight - top - reserved - 12);
    document.documentElement.style.setProperty('--story-stage-height', height + 'px');
  }

  function buildWorld(force = false) {
    fitStage();''')
player=player.replace('new ResizeObserver(() => {', '''window.addEventListener('resize', () => { fitStage(); buildWorld(); setCamera(false); });
  new ResizeObserver(() => {''')
player=player.replace('nextPass.hidden = true;\n    buildCurrentLine(lineIndex);', 'nextPass.hidden = true;\n    fitStage();\n    buildCurrentLine(lineIndex);')
player=player.replace('nextPass.textContent = pass === 1 ? "Follow the words →" : "Explore the phrases →";', 'nextPass.textContent = pass === 1 ? "Follow the words →" : "Explore the phrases →";\n      fitStage();\n      setCamera(false);')
(ROOT/'app.js').write_text(player)
html=(ROOT.parent/'mezban/index.html').read_text().replace('Mezban','The American &amp; The Fisherman').replace('20261007-mezban-1',VERSION).replace('<span id="mode-label">','<span id="speaker-name"></span><span id="mode-label">')
credit='<footer class="source-credit" aria-label="Source credit"><small>Audio: <cite><a href="https://books.google.com/books?id=1g1czgAACAAJ" target="_blank" rel="noopener">New Headway Elementary</a></cite>, 4th ed., Liz &amp; John Soars (Oxford University Press, 2011), Unit 6, pp. 50–51; <a href="https://ektu.kz/files/DistanceEducation/Work/214581/hw_elem_trd_sb_tapescripts.pdf" target="_blank" rel="noopener">T6.11</a>, “The businessman and the fisherman.” <span>Visuals created independently with AI.</span></small></footer>'
html=html.replace('  </main>', '    '+credit+'\n  </main>')
(ROOT/'index.html').write_text(html)
classroom=(ROOT.parent/'mezban/classroom.html').read_text().replace('Mezban','The American &amp; The Fisherman').replace('MEZBAN_STORY','FISHERMAN_STORY').replace('20261007-mezban-1',VERSION).replace('1080 * 1672 / 941','1920').replace("['Homecoming', 'Excuses', 'Empty chairs', 'Outside the gate', 'The invitation', 'Welcome', 'Serving', 'One table']","['The catch', 'Enough', 'A full day', 'The advice', 'The business plan', 'Twenty years', 'Retirement', 'Home']")
classroom=classroom.replace('  <p id="status"', '  <footer class="classroom-credit"><small>Story: <cite>New Headway Elementary</cite>, 4th ed., Liz &amp; John Soars, Oxford University Press (2011), Unit 6, pp. 50–51. Visuals created independently with AI.</small></footer>\n  <p id="status"')
(ROOT/'classroom.html').write_text(classroom)
print(f'{len(lines)} lines, {len(beats)} camera cues, {len(gloss)} notes.')
