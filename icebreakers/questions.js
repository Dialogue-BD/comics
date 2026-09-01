/* ══════════════════════════════════════════════════════════════════
   DISCUSSION QUESTION ICEBREAKERS — question bank
   ──────────────────────────────────────────────────────────────────
   Each entry:
     id     numbering from Tim's master list of 100
     cat    key into CATEGORIES below
     q      the question, projected large
     note   the grammar pattern (colligation) the frames are drilling
     vocab  [word, plain-English gloss, CEFR level]
     chunks phrase chunks / collocations, ready to lift into speech
     frames sentence scaffolds.  ___ renders as a blank to fill,
            «text» renders as a small grey grammar hint.
   To add more questions, copy any block and keep the same shape.
   ══════════════════════════════════════════════════════════════════ */

const CATEGORIES = {
  life:   { label:"Life, Purpose & Legacy",  short:"Life",    icon:"🌱", hue:"164 72% 56%" },
  moral:  { label:"Morality & Character",    short:"Morality",icon:"⚖️", hue:"36 94% 62%"  },
  nature: { label:"Nature, Beauty & Awe",    short:"Nature",  icon:"🌌", hue:"202 88% 64%" },
  people: { label:"Peace & Connection",      short:"People",  icon:"🤝", hue:"342 80% 68%" },
  future: { label:"The Unknown & Hope",      short:"Hope",    icon:"🕊️", hue:"266 80% 72%" }
};

const QUESTIONS = [

/* ── LIFE, PURPOSE & LEGACY ─────────────────────────────────────── */
{
  id:1, cat:"life",
  q:"What is the most important lesson your parents taught you?",
  note:"teach / tell someone <b>to</b> + base verb — <i>they taught me to listen</i>",
  vocab:[
    ["lesson","something you learn that changes how you live","B1"],
    ["value","a belief about what is right and important","B1"],
    ["upbringing","the way your parents raised you","B2"],
    ["discipline","training yourself to do the hard thing","B2"],
    ["role model","someone you copy because they live well","B1"],
    ["scold","to tell a child off angrily","B2"],
    ["instil","to slowly put a value into someone","C1"],
    ["stick with you","stay in your mind for years","B1"]
  ],
  chunks:[
    "bring someone up to + verb",
    "drum something into someone",
    "lead by example",
    "a lesson I've never forgotten",
    "at the time, I didn't understand",
    "looking back on it now",
    "it has stayed with me ever since"
  ],
  frames:[
    "The most important lesson my parents taught me was ___ «noun / that-clause»",
    "My mother always used to say, \"___\"",
    "They taught me to ___ «base verb», even when ___",
    "I didn't understand it at the time, but now I ___",
    "It's a lesson I ___ «have + past participle»",
    "Looking back, I realise that ___"
  ]
},
{
  id:4, cat:"life",
  q:"What makes a person truly successful?",
  note:"measure success <b>by</b> + noun / -ing — <i>I measure it by how they treat people</i>",
  vocab:[
    ["achievement","something you did after real effort","B1"],
    ["wealth","a large amount of money","B2"],
    ["status","your position compared with other people","B2"],
    ["content","quietly happy with what you have","B2"],
    ["measure","to judge how much of something there is","B1"],
    ["fulfilment","the feeling that your life matters","C1"],
    ["integrity","doing what is right even when it costs you","C1"],
    ["shallow","having no depth or real meaning","B2"]
  ],
  chunks:[
    "measure success by ___",
    "climb the career ladder",
    "make a difference",
    "at the expense of ___",
    "money can't buy ___",
    "a successful person, in my view",
    "have more to do with ___ than ___"
  ],
  frames:[
    "For me, a truly successful person is someone who ___ «present simple»",
    "I don't measure success by ___ ; I measure it by ___",
    "Society tells us that ___, but I believe ___",
    "You can be rich and still ___",
    "Success is less about ___ than about ___",
    "The most successful person I know has never ___"
  ]
},
{
  id:8, cat:"life",
  q:"What do you think is the difference between living and just existing?",
  note:"the difference between ___ <b>and</b> ___ — both slots take a noun or -ing form",
  vocab:[
    ["exist","simply to be alive, nothing more","B1"],
    ["routine","the same things every day","B1"],
    ["meaningful","full of purpose","B2"],
    ["passion","a strong love for something","B2"],
    ["numb","feeling nothing at all","C1"],
    ["intentional","chosen on purpose, not by accident","C1"],
    ["survive","stay alive through something hard","B1"],
    ["thrive","grow and do really well","C1"]
  ],
  chunks:[
    "day in, day out",
    "just getting by",
    "go through the motions",
    "feel truly alive",
    "make the most of ___",
    "wake up with a purpose",
    "there's more to life than ___"
  ],
  frames:[
    "To me, existing means ___ «-ing», but living means ___ «-ing»",
    "Someone who is just existing ___, while someone who is really living ___",
    "I feel most alive when ___",
    "There's a big difference between ___ and ___",
    "You're only existing if ___",
    "I'd rather ___ than ___ «base verbs»"
  ]
},
{
  id:12, cat:"life",
  q:"What is the best advice you have ever received?",
  note:"<b>advice</b> is uncountable — <i>a piece of advice</i>, never <s>an advice</s>",
  vocab:[
    ["advice","what someone tells you to do (uncountable)","A2"],
    ["tip","one small piece of practical advice","B1"],
    ["wisdom","deep understanding that comes from experience","B2"],
    ["turn to someone","go to someone for help","B2"],
    ["well-meaning","kind, but maybe wrong","C1"],
    ["hindsight","understanding something only after it is over","C1"],
    ["ignore","to hear it but not do it","B1"],
    ["live by","use something as a rule for your life","B2"]
  ],
  chunks:[
    "give someone a piece of advice",
    "take someone's advice",
    "the best advice I've ever been given",
    "it turned out to be right",
    "at the time I ignored it",
    "words I still live by",
    "pass that advice on"
  ],
  frames:[
    "The best advice I've ever received came from ___",
    "He told me ___ «(not) to + base verb»",
    "The advice was simple: ___",
    "I ignored it at first, but ___",
    "It's advice I still ___ «present simple»",
    "If I could pass on one piece of advice, it would be ___"
  ]
},
{
  id:20, cat:"life",
  q:"What is a tradition from your culture that you hope never dies?",
  note:"hope + <b>present simple</b> for the future — <i>I hope it never dies</i>, not <s>will never die</s>",
  vocab:[
    ["tradition","something a group has done for a long time","B1"],
    ["custom","the normal way of doing things in a place","B2"],
    ["generation","all the people born around the same time","B1"],
    ["gathering","an occasion when people come together","B2"],
    ["hospitality","welcoming guests warmly","B2"],
    ["pass down","give something to the next generation","B1"],
    ["die out","slowly disappear completely","B2"],
    ["heritage","what a culture hands on to its children","C1"]
  ],
  chunks:[
    "hand something down from generation to generation",
    "keep a tradition alive",
    "it dates back to ___",
    "bring the whole family together",
    "no matter how busy we are",
    "fade away / die out",
    "I'd hate to see it disappear"
  ],
  frames:[
    "One tradition I hope never dies is ___",
    "Every year, we ___ «present simple»",
    "It's been passed down ___",
    "What I love about it is ___ «that-clause / the way ___»",
    "I'm afraid it might die out because ___",
    "Even if I live abroad, I'll still ___"
  ]
},
{
  id:2, cat:"life",
  q:"If you could be remembered for just one thing, what would it be?",
  note:"be remembered <b>for</b> + noun / -ing — <i>I'd like to be remembered for helping people</i>",
  vocab:[
    ["remember","keep someone or something in your mind","A2"],
    ["legacy","what remains after your life or work ends","C1"],
    ["impact","a strong effect on someone or something","B2"],
    ["contribution","something useful you give or do","B2"],
    ["reputation","what people generally think about you","B2"],
    ["lasting","continuing for a long time","B2"],
    ["influence","the power to change how someone thinks or acts","B2"],
    ["make your mark","do something people will remember","C1"]
  ],
  chunks:[
    "be remembered for ___",
    "leave a lasting impact",
    "make a difference in someone's life",
    "live on after you",
    "more than any achievement",
    "be known as someone who ___",
    "leave the world a little better"
  ],
  frames:[
    "I'd like to be remembered for ___ «noun / -ing»",
    "I hope people will say that I ___",
    "More than anything, I want to leave behind ___",
    "It wouldn't be about ___; it would be about ___",
    "The person whose legacy I admire is ___ because ___",
    "If my life could make one difference, it would be ___"
  ]
},
{
  id:5, cat:"life",
  q:"If you had all the money in the world, what would you do with your time?",
  note:"second conditional — <b>If</b> + past simple, <b>would</b> + base verb",
  vocab:[
    ["financial freedom","having enough money to choose how you live","B2"],
    ["volunteer","work without pay to help others","B1"],
    ["pursue","keep working towards an interest or goal","C1"],
    ["leisure","time when you are free from work","B2"],
    ["meaningful","important and worth doing","B2"],
    ["indulge","let yourself enjoy something expensive or special","C1"],
    ["devote","give most of your time or energy to something","B2"],
    ["give back","help others because you have been fortunate","B2"]
  ],
  chunks:[
    "never have to work for money",
    "devote my time to ___",
    "pursue a lifelong dream",
    "give something back",
    "spend more time with ___",
    "after the excitement wore off",
    "money would give me the freedom to ___"
  ],
  frames:[
    "If I had unlimited money, I would ___",
    "I'd spend most of my time ___ «-ing»",
    "The first thing I'd do would be to ___",
    "I would still work, but I would ___",
    "Once I had travelled / rested, I'd ___",
    "Money would matter less to me than ___"
  ]
},
{
  id:9, cat:"life",
  q:"If you had to write a book about your life, what would the title be?",
  note:"call / title something + noun — <i>I'd call it Finding My Way</i>",
  vocab:[
    ["title","the name of a book, film, or story","A2"],
    ["chapter","one main part of a book","B1"],
    ["memoir","a book about the writer's own life","C1"],
    ["plot twist","an unexpected change in a story","B2"],
    ["journey","a long process of change or growth","B1"],
    ["theme","the main idea running through a story","B2"],
    ["turning point","a moment when life changes direction","B2"],
    ["work in progress","something still developing","B2"]
  ],
  chunks:[
    "write the story of my life",
    "call the book ___",
    "a story about ___",
    "the next chapter",
    "full of unexpected turns",
    "still being written",
    "sum up my life so far"
  ],
  frames:[
    "I would call my book ___",
    "The title would be ___ because ___",
    "So far, my life has been a story of ___",
    "The most important chapter would be about ___",
    "The cover would show ___",
    "I don't know the ending yet, but I hope ___"
  ]
},
{
  id:16, cat:"life",
  q:"What is a goal you have that has nothing to do with money or your career?",
  note:"a goal <b>of</b> + -ing / a goal <b>to</b> + base verb — both patterns are possible",
  vocab:[
    ["goal","something you are trying to achieve","A2"],
    ["personal growth","becoming wiser, stronger, or more capable","B2"],
    ["habit","something you do regularly","A2"],
    ["well-being","your health and happiness","B2"],
    ["master","learn to do something extremely well","B2"],
    ["milestone","an important point in your progress","C1"],
    ["fulfil","achieve something you hoped or promised to do","C1"],
    ["accountable","responsible for doing what you said","C1"]
  ],
  chunks:[
    "set myself a goal",
    "work towards ___",
    "make steady progress",
    "for my own satisfaction",
    "have nothing to do with work",
    "keep myself accountable",
    "one small step at a time"
  ],
  frames:[
    "One personal goal I have is to ___",
    "I'd like to get better at ___ «-ing»",
    "This matters to me because ___",
    "I've already started by ___ «-ing»",
    "The biggest obstacle is ___",
    "I'll know I've achieved it when ___"
  ]
},
{
  id:19, cat:"life",
  q:"How do you want your friends to describe you when you are not in the room?",
  note:"describe someone <b>as</b> + adjective / noun — <i>I hope they'd describe me as dependable</i>",
  vocab:[
    ["describe","say what someone or something is like","A2"],
    ["dependable","someone other people can rely on","C1"],
    ["genuine","honest and real, not pretending","B2"],
    ["considerate","careful not to hurt or inconvenience others","C1"],
    ["warm-hearted","kind and caring","B2"],
    ["reputation","the opinion people have of you","B2"],
    ["two-faced","friendly to someone but unkind behind their back","C1"],
    ["bring out the best in","help someone show their best qualities","C1"]
  ],
  chunks:[
    "describe me as ___",
    "say behind my back",
    "someone you can count on",
    "make people feel at ease",
    "bring out the best in people",
    "be honest about my faults",
    "the kind of friend who ___"
  ],
  frames:[
    "I hope my friends would describe me as ___",
    "I'd like them to say that I always ___",
    "I don't need them to think I'm ___, but I hope ___",
    "A good friend once told me I was ___",
    "I'm still trying to become more ___",
    "When I'm not there, I hope people feel ___"
  ]
},

/* ── MORALITY, CHARACTER & CHOICES ──────────────────────────────── */
{
  id:21, cat:"moral",
  q:"Is it ever okay to tell a lie? When?",
  note:"second conditional — <b>If</b> + past simple, <b>would</b> + base verb",
  vocab:[
    ["a white lie","a small kind lie told to protect someone","B2"],
    ["honesty","the habit of telling the truth","B1"],
    ["deceive","make someone believe something false","C1"],
    ["harm","damage or hurt done to someone","B2"],
    ["justify","give a good reason for something","B2"],
    ["spare someone's feelings","avoid hurting them","B2"],
    ["trust","believing someone will not let you down","B1"],
    ["betray","break someone's trust","B2"]
  ],
  chunks:[
    "tell a white lie",
    "spare someone's feelings",
    "there's no excuse for ___",
    "it depends on the situation",
    "do more harm than good",
    "in the long run",
    "cross a line"
  ],
  frames:[
    "In my opinion, it's ___ okay to lie «never / rarely / sometimes»",
    "It depends on ___ «noun / wh-clause»",
    "I'd lie if ___ «past simple»",
    "There's a difference between ___ and ___",
    "Even a small lie can ___",
    "I'd rather hear a hard truth than ___"
  ]
},
{
  id:26, cat:"moral",
  q:"What is the hardest part about forgiving someone?",
  note:"the hardest part is + <b>-ing</b> — <i>the hardest part is letting go</i>",
  vocab:[
    ["forgive","stop being angry with someone who hurt you","B1"],
    ["hold a grudge","stay angry with someone for a long time","B2"],
    ["apologise","say sorry properly","B1"],
    ["let go of","stop holding onto something","B2"],
    ["heal","get better after being hurt","B2"],
    ["move on","leave the past behind and continue","B1"],
    ["resentment","old anger you keep quietly inside","C1"],
    ["reconcile","become friends again after a fight","C1"]
  ],
  chunks:[
    "hold a grudge against someone",
    "let go of the anger",
    "forgive and forget",
    "it still hurts",
    "the hardest part is ___",
    "easier said than done",
    "rebuild trust"
  ],
  frames:[
    "For me, the hardest part is ___ «-ing»",
    "It's easy to say ___, but hard to actually ___",
    "I can forgive someone, but I can't ___",
    "What makes it so difficult is ___ «that-clause»",
    "Forgiving doesn't mean ___ «-ing»",
    "I found it hard to forgive ___ until ___"
  ]
},
{
  id:34, cat:"moral",
  q:"Do you think love is just a feeling, or is it a choice?",
  note:"either / or answers — <i>I think it's ___ <b>rather than</b> ___</i>",
  vocab:[
    ["emotion","a strong feeling","B1"],
    ["commitment","a promise you keep even when it's hard","B2"],
    ["fade","slowly become weaker","B2"],
    ["last","continue over a long time","B1"],
    ["butterflies","the nervous excited feeling of new love","B2"],
    ["unconditional","given with no conditions at all","C1"],
    ["infatuation","strong but short-lived attraction","C1"],
    ["stand by someone","stay loyal to them in trouble","B2"]
  ],
  chunks:[
    "fall in love with someone",
    "fall out of love",
    "stand by someone",
    "in good times and bad",
    "love is a verb, not a noun",
    "choose someone every day",
    "feelings come and go"
  ],
  frames:[
    "I believe love is ___ rather than ___",
    "Feelings ___, but a choice ___",
    "At the beginning love is ___; later it becomes ___",
    "You can't control ___, but you can control ___",
    "Real love shows itself when ___",
    "If love were only a feeling, then ___ «would + base verb»"
  ]
},
{
  id:38, cat:"moral",
  q:"What is a character trait you admire most in other people?",
  note:"admire people <b>who</b> + present simple — a defining relative clause",
  vocab:[
    ["trait","one part of someone's character","B2"],
    ["admire","respect someone for something good","B1"],
    ["loyalty","staying with people through hard times","B2"],
    ["patience","staying calm while you wait or teach","B1"],
    ["generous","happy to give time or money away","B1"],
    ["genuine","real, not pretending","B2"],
    ["humility","not thinking you are better than others","C1"],
    ["resilient","able to recover from hard things","C1"]
  ],
  chunks:[
    "look up to someone",
    "a quality I really admire",
    "stay calm under pressure",
    "treat everyone the same",
    "keep their word",
    "it rubs off on the people around them",
    "wear their heart on their sleeve"
  ],
  frames:[
    "The trait I admire most is ___",
    "I really look up to people who ___ «present simple»",
    "___ is rare these days «noun»",
    "I admire it because ___",
    "The most ___ person I know is ___",
    "It's something I'm still working on ___"
  ]
},
{
  id:40, cat:"moral",
  q:"If nobody was watching you, would you act differently?",
  note:"second conditional again — <b>If</b> + past simple, <b>would (n't)</b> + base verb",
  vocab:[
    ["behave","act in a certain way","B1"],
    ["reputation","what other people think of you","B2"],
    ["character","who you really are inside","B1"],
    ["pretend","act as if something is true when it isn't","B1"],
    ["consistent","the same in every situation","B2"],
    ["temptation","the pull to do something you shouldn't","B2"],
    ["conscience","the inner sense of right and wrong","C1"],
    ["integrity","being the same person in public and private","C1"]
  ],
  chunks:[
    "keep up appearances",
    "when no one is looking",
    "who you really are",
    "put on a show",
    "practise what you preach",
    "let your guard down",
    "it says a lot about someone"
  ],
  frames:[
    "Honestly, I ___ act differently «would / wouldn't»",
    "If nobody was watching, I'd probably ___",
    "Character is what you do when ___",
    "The person I am at home is ___ the person I am in public",
    "I try to be the same whether ___ or ___",
    "Everyone acts a little differently when ___"
  ]
},
{
  id:22, cat:"moral",
  q:"What makes someone a \"good\" person?",
  note:"what makes someone + adjective is ___ — <i>what makes someone good is how they treat others</i>",
  vocab:[
    ["goodness","the quality of being kind and morally right","B2"],
    ["intention","the reason why you plan to do something","B2"],
    ["action","something you choose to do","A2"],
    ["selfless","caring more about others than yourself","C1"],
    ["compassionate","noticing suffering and wanting to help","C1"],
    ["principle","a rule or belief that guides your behaviour","B2"],
    ["flawed","having weaknesses or faults","C1"],
    ["make amends","do something to correct the harm you caused","C1"]
  ],
  chunks:[
    "have good intentions",
    "do the right thing",
    "treat people with respect",
    "admit when you're wrong",
    "learn from your mistakes",
    "judge someone by their actions",
    "good at heart"
  ],
  frames:[
    "I think a good person is someone who ___",
    "Being good is more about ___ than ___",
    "Good intentions are not enough if ___",
    "A person can make mistakes and still ___",
    "What matters most is how you ___",
    "The best example I know is ___ because ___"
  ]
},
{
  id:29, cat:"moral",
  q:"Is there a difference between what is legal and what is right?",
  note:"legal <b>but</b> wrong / illegal <b>but</b> right — use contrast to separate law from morality",
  vocab:[
    ["legal","allowed by the law","B1"],
    ["illegal","against the law","B1"],
    ["moral","connected with what is right and wrong","B2"],
    ["lawful","permitted by law","C1"],
    ["unjust","not fair or morally right","C1"],
    ["conscience","your inner sense of right and wrong","C1"],
    ["obey","do what a law or person tells you","B1"],
    ["civil disobedience","peacefully breaking a law to oppose injustice","C1"]
  ],
  chunks:[
    "against the law",
    "the right thing to do",
    "follow your conscience",
    "obey an unjust law",
    "legal doesn't always mean moral",
    "draw the line at ___",
    "change the law through ___"
  ],
  frames:[
    "Something can be legal but still ___",
    "The law says ___, whereas my conscience says ___",
    "In most cases, people should obey the law because ___",
    "I think breaking a law is justified when ___",
    "One example of an unjust law is / was ___",
    "If law and morality conflict, I would ___"
  ]
},
{
  id:30, cat:"moral",
  q:"What is a rule you think everyone in the world should follow?",
  note:"everyone should + <b>base verb</b> — <i>everyone should treat others fairly</i>",
  vocab:[
    ["rule","an instruction about what people must or must not do","A2"],
    ["respect","treating people as valuable","B1"],
    ["fairness","the quality of treating people equally and justly","B2"],
    ["responsibility","a duty to deal with something properly","B1"],
    ["universal","true or suitable for everyone","B2"],
    ["principle","a basic belief that guides behaviour","B2"],
    ["mutual","shared equally by two or more people","C1"],
    ["consequence","a result of an action or decision","B2"]
  ],
  chunks:[
    "a rule for everyone",
    "treat others the way ___",
    "take responsibility for ___",
    "regardless of who they are",
    "do no harm",
    "apply equally to everyone",
    "the world would be better if ___"
  ],
  frames:[
    "My one rule would be: ___",
    "Everyone should ___, regardless of ___",
    "If people followed this rule, ___ would ___",
    "It sounds simple, but ___",
    "The rule should apply even when ___",
    "I chose it because the world needs more ___"
  ]
},
{
  id:35, cat:"moral",
  q:"What is the most courageous thing you have ever seen someone do?",
  note:"see someone + <b>base verb</b> — <i>I saw her stand up for a stranger</i>",
  vocab:[
    ["courage","the ability to act even though you are afraid","B2"],
    ["brave","willing to face danger or difficulty","B1"],
    ["stand up for","defend someone or something","B2"],
    ["risk","the possibility that something bad may happen","B1"],
    ["speak out","say publicly that something is wrong","B2"],
    ["fearless","showing no fear","B2"],
    ["vulnerable","open to being hurt or judged","C1"],
    ["moral courage","bravery in defending what is right","C1"]
  ],
  chunks:[
    "stand up for someone",
    "put yourself at risk",
    "speak out against ___",
    "in spite of the fear",
    "do what no one else would do",
    "have the courage to ___",
    "a quiet act of bravery"
  ],
  frames:[
    "The most courageous thing I've seen was when ___",
    "I saw someone ___ «base verb»",
    "They knew that ___, but they still ___",
    "What made it brave was ___",
    "Courage doesn't always look like ___; sometimes it is ___",
    "That moment taught me that ___"
  ]
},
{
  id:36, cat:"moral",
  q:"Why is it sometimes hard to tell the truth?",
  note:"be afraid <b>of</b> + noun / -ing, or afraid <b>that</b> + clause",
  vocab:[
    ["truth","what is real or actually happened","A2"],
    ["consequence","a result, especially an unpleasant one","B2"],
    ["admit","accept that something is true, often unwillingly","B1"],
    ["embarrassed","ashamed or uncomfortable in front of others","B1"],
    ["confess","admit that you did something wrong","B2"],
    ["vulnerable","open to being hurt or judged","C1"],
    ["backfire","produce the opposite result from what you wanted","C1"],
    ["come clean","finally tell the complete truth","C1"]
  ],
  chunks:[
    "face the consequences",
    "hurt someone's feelings",
    "admit you were wrong",
    "be afraid of being judged",
    "keep something hidden",
    "the truth comes out",
    "come clean about ___"
  ],
  frames:[
    "Sometimes people hide the truth because ___",
    "It's hardest to be honest when ___",
    "We may be afraid of ___ «noun / -ing»",
    "A lie can feel easier at first, but ___",
    "I find it difficult to admit that ___",
    "Telling the truth becomes easier if ___"
  ]
},

/* ── NATURE, BEAUTY & AWE ───────────────────────────────────────── */
{
  id:41, cat:"nature",
  q:"What is the most beautiful place in nature you have ever visited?",
  note:"the most ___ place I have <b>ever</b> + past participle — present perfect for life experience",
  vocab:[
    ["scenery","the natural view all around you","B2"],
    ["landscape","the shape and look of an area of land","B1"],
    ["breathtaking","so beautiful it shocks you","B2"],
    ["stunning","extremely beautiful","B2"],
    ["peak","the very top of a mountain","B2"],
    ["untouched","not changed or spoiled by people","B2"],
    ["vast","extremely large and open","C1"],
    ["remote","far away from any town","B2"]
  ],
  chunks:[
    "take your breath away",
    "as far as the eye can see",
    "a view over the ___",
    "surrounded by ___",
    "photos don't do it justice",
    "in the middle of nowhere",
    "I'll never forget the moment ___"
  ],
  frames:[
    "The most beautiful place I've ever been is ___",
    "I went there ___ «two years ago / when I was ___»",
    "What struck me was ___",
    "You could see ___ in every direction",
    "It's hard to describe, but ___",
    "I'd love to go back and ___"
  ]
},
{
  id:42, cat:"nature",
  q:"When you look at the stars at night, how does it make you feel?",
  note:"<b>make</b> + person + <b>base verb</b> — <i>it makes me feel small</i>, not <s>to feel</s>",
  vocab:[
    ["the night sky","everything you can see above you at night","A2"],
    ["galaxy","a huge group of stars","B2"],
    ["infinite","having no end","B2"],
    ["awe","deep wonder mixed with respect","C1"],
    ["insignificant","very small and unimportant","C1"],
    ["marvel at","look at something with amazement","C1"],
    ["light pollution","city light that hides the stars","B2"],
    ["perspective","seeing how big or small things really are","B2"]
  ],
  chunks:[
    "fill you with wonder",
    "make you feel small",
    "on a clear night",
    "millions of miles away",
    "put things in perspective",
    "lose track of time",
    "it makes me wonder whether ___"
  ],
  frames:[
    "When I look at the stars, I feel ___ «adjective»",
    "It makes me ___ «base verb: feel / think / wonder»",
    "It reminds me how ___ we are «adjective»",
    "I can't help wondering ___ «wh-clause»",
    "Compared to all that, my problems ___",
    "The last time I really looked at the stars was ___"
  ]
},
{
  id:46, cat:"nature",
  q:"Why do you think humans love music so much?",
  note:"a way <b>of</b> + -ing / a way <b>to</b> + base verb — <i>a way of expressing what we feel</i>",
  vocab:[
    ["rhythm","the regular beat of the music","B1"],
    ["melody","the tune you can sing back","B2"],
    ["lyrics","the words of a song","B2"],
    ["move someone","cause a strong emotion in them","B2"],
    ["universal","the same everywhere in the world","B2"],
    ["express","get a feeling out into the world","B1"],
    ["nostalgia","sweet sadness about the past","C1"],
    ["uplifting","making you feel hopeful and light","C1"]
  ],
  chunks:[
    "put on a song",
    "a song that takes me back",
    "speak to your emotions",
    "get stuck in your head",
    "bring people together",
    "put into words what you feel",
    "a universal language"
  ],
  frames:[
    "I think we love music because ___",
    "Music can ___ in a way that words can't",
    "A song can take me back to ___",
    "Whenever I hear ___, I ___",
    "For me, music is a way of ___ «-ing»",
    "Even people who don't share a language can ___"
  ]
},
{
  id:54, cat:"nature",
  q:"How does the changing of the seasons make you feel?",
  note:"<b>as soon as</b> / <b>when</b> + present simple for a repeated future — <i>as soon as the rain comes…</i>",
  vocab:[
    ["season","one of the parts the year is divided into","A2"],
    ["monsoon","the season of heavy rain","B1"],
    ["cycle","something that repeats in the same order","B1"],
    ["shift","a change from one state to another","B2"],
    ["fade","slowly lose colour or strength","B2"],
    ["crisp","pleasantly cold and fresh","C1"],
    ["renewal","the feeling of everything starting again","C1"],
    ["longing","a deep quiet wish for something","C1"]
  ],
  chunks:[
    "the days get shorter",
    "a fresh start",
    "mark the passing of time",
    "look forward to ___",
    "the first rain of the year",
    "the air changes",
    "make me feel nostalgic"
  ],
  frames:[
    "My favourite season is ___ because ___",
    "When ___ arrives, I always ___",
    "The change reminds me that ___",
    "I find ___ a little sad, because ___",
    "There's something about ___ that ___",
    "As soon as ___, you can feel ___"
  ]
},
{
  id:60, cat:"nature",
  q:"What is a sound in nature that instantly relaxes you?",
  note:"there's nothing like + <b>noun / -ing</b> — <i>there's nothing like hearing rain on a roof</i>",
  vocab:[
    ["soothing","gently making you calm","C1"],
    ["steady","not changing, going on evenly","B1"],
    ["rustle","the soft sound of leaves moving","C1"],
    ["patter","the light quick sound of rain","C1"],
    ["chirp","the short high sound a small bird makes","B2"],
    ["distant","far away","B2"],
    ["drown out","cover a sound so you can't hear it","B2"],
    ["stillness","complete quiet and no movement","C1"]
  ],
  chunks:[
    "the sound of rain on a tin roof",
    "waves crashing on the shore",
    "the wind in the trees",
    "put my mind at ease",
    "drift off to sleep",
    "block out the noise of the city",
    "instantly calm me down"
  ],
  frames:[
    "The sound that relaxes me most is ___",
    "There's nothing like ___ «noun / -ing»",
    "It reminds me of ___",
    "As soon as I hear it, I ___",
    "I could listen to it for ___",
    "It's the one sound that ___"
  ]
},
{
  id:43, cat:"nature",
  q:"When you look at the complex design of nature, what does it make you think about the Creator?",
  note:"make someone <b>think about</b> + noun / wh-clause — <i>it makes me think about how life began</i>",
  vocab:[
    ["complex","made of many connected parts","B2"],
    ["design","the way something is planned or arranged","B1"],
    ["Creator","the being believed to have made the universe","B2"],
    ["creation","the world and living things that were created","B2"],
    ["pattern","a regular or repeated arrangement","B1"],
    ["intricate","having many small, connected details","C1"],
    ["order","a clear and organised arrangement","B1"],
    ["wonder","a feeling of amazement and curiosity","B2"]
  ],
  chunks:[
    "the complexity of nature",
    "evidence of design",
    "fill me with wonder",
    "the order behind ___",
    "too intricate to ___",
    "point beyond itself",
    "make me think about the Creator"
  ],
  frames:[
    "When I see ___, it makes me think about ___",
    "The complexity of ___ fills me with ___",
    "For me, this pattern suggests that ___",
    "Some people explain it through ___, while others ___",
    "What amazes me most is how ___",
    "Looking at nature makes me wonder whether ___"
  ]
},
{
  id:44, cat:"nature",
  q:"What is an animal that amazes you, and why?",
  note:"be amazed <b>by</b> + noun / how-clause — <i>I'm amazed by how far birds migrate</i>",
  vocab:[
    ["amaze","surprise someone very much","B1"],
    ["species","a group of the same kind of animal or plant","B2"],
    ["adapt","change in order to survive in new conditions","B2"],
    ["instinct","behaviour an animal knows without learning","B2"],
    ["camouflage","colour or shape that helps an animal hide","C1"],
    ["migrate","travel seasonally from one region to another","B2"],
    ["intelligent","able to learn, understand, and solve problems","B1"],
    ["extraordinary","very unusual and impressive","B2"]
  ],
  chunks:[
    "adapt to its environment",
    "survive in extreme conditions",
    "find its way across ___",
    "communicate with each other",
    "an extraordinary ability",
    "what amazes me is how ___",
    "we still don't fully understand ___"
  ],
  frames:[
    "An animal that amazes me is ___",
    "I'm amazed by the way it ___",
    "It can ___, even though ___",
    "What makes it extraordinary is ___",
    "I first learned about it when ___",
    "I think humans could learn ___ from it"
  ]
},
{
  id:48, cat:"nature",
  q:"Do you feel more at peace in a busy city or in a quiet forest?",
  note:"feel more ___ <b>in</b> one place <b>than in</b> another — use a comparative structure",
  vocab:[
    ["at peace","calm, safe, and free from worry","B2"],
    ["crowded","full of too many people","A2"],
    ["lively","full of energy and activity","B1"],
    ["tranquil","very calm and quiet","C1"],
    ["solitude","the state of being alone, often peacefully","C1"],
    ["stimulating","full of things that interest and excite you","C1"],
    ["overwhelming","so intense that it is hard to manage","B2"],
    ["escape","get away from a place or situation","B1"]
  ],
  chunks:[
    "the noise and energy of the city",
    "peace and quiet",
    "get away from it all",
    "feel cut off from ___",
    "surrounded by people",
    "recharge in nature",
    "a balance between the two"
  ],
  frames:[
    "I feel more at peace in ___ because ___",
    "The city makes me feel ___, whereas the forest ___",
    "I enjoy ___, but after a while I need ___",
    "When I want to recharge, I go to ___",
    "I would find ___ too ___",
    "Ideally, I'd live ___ so that I could ___"
  ]
},
{
  id:53, cat:"nature",
  q:"What is something small in nature that you find fascinating?",
  note:"find + object + adjective — <i>I find spider webs fascinating</i>",
  vocab:[
    ["fascinating","extremely interesting","B2"],
    ["tiny","extremely small","A2"],
    ["detail","one small part of something larger","A2"],
    ["delicate","easily damaged but often beautiful","B2"],
    ["magnify","make something look larger","C1"],
    ["symmetry","a balanced shape with matching parts","C1"],
    ["overlook","fail to notice something","C1"],
    ["miniature","a very small version of something","B2"]
  ],
  chunks:[
    "easy to overlook",
    "look closely at ___",
    "the tiny details",
    "a world in miniature",
    "perfectly shaped",
    "right under our feet",
    "make me stop and look"
  ],
  frames:[
    "I find ___ fascinating because ___",
    "Most people overlook it, but ___",
    "If you look closely, you can see ___",
    "Something so small can still ___",
    "The detail that amazes me is ___",
    "It reminds me that nature ___"
  ]
},
{
  id:57, cat:"nature",
  q:"Have you ever felt connected to something much larger than yourself?",
  note:"feel connected <b>to</b> + noun — and present perfect for life experience: <i>Have you ever felt…?</i>",
  vocab:[
    ["connected","joined emotionally or spiritually to something","B2"],
    ["belong","feel that you are part of a place or group","B1"],
    ["community","people who share a place or identity","B1"],
    ["universe","all of space and everything in it","B1"],
    ["spiritual","connected with the human spirit or sacred things","B2"],
    ["transcend","go beyond ordinary limits or experience","C1"],
    ["collective","shared by a whole group","C1"],
    ["insignificant","very small or unimportant","C1"]
  ],
  chunks:[
    "part of something larger",
    "a sense of belonging",
    "lose myself in the moment",
    "connected to the people around me",
    "bigger than any one person",
    "hard to put into words",
    "feel both small and important"
  ],
  frames:[
    "I felt connected to something larger when ___",
    "It happened while I was ___ «-ing»",
    "For a moment, I felt part of ___",
    "The experience made me realise that ___",
    "It's difficult to explain, but it felt ___",
    "Since then, I have thought differently about ___"
  ]
},

/* ── PEACE, COMFORT & HUMAN CONNECTION ──────────────────────────── */
{
  id:61, cat:"people",
  q:"Who is the first person you call when you have bad news? Why?",
  note:"someone <b>who</b> + present simple, and <b>without</b> + -ing — <i>without judging me</i>",
  vocab:[
    ["rely on","trust someone to be there for you","B1"],
    ["comfort","make someone feel better when they hurt","B1"],
    ["support","help someone through a hard time","B1"],
    ["judge","decide someone is bad or wrong","B1"],
    ["calm someone down","help them stop panicking","B2"],
    ["instinct","your first automatic reaction","B2"],
    ["confide in","tell someone your private worries","C1"],
    ["level-headed","calm and sensible in a crisis","C1"]
  ],
  chunks:[
    "the first person I'd call",
    "pick up the phone",
    "know exactly what to say",
    "never judge me",
    "be there for someone",
    "talk me through it",
    "put things in perspective"
  ],
  frames:[
    "The first person I call is ___",
    "I call ___ because ___",
    "She always ___ «present simple»",
    "I know I can tell ___ anything without ___ «-ing»",
    "Even if it's late at night, ___",
    "I've relied on ___ ever since ___"
  ]
},
{
  id:64, cat:"people",
  q:"What is the kindest thing a stranger has ever done for you?",
  note:"set the scene with <b>past continuous</b>, then the event in <b>past simple</b> — <i>I was waiting… when he offered…</i>",
  vocab:[
    ["stranger","a person you have never met","B1"],
    ["kindness","the habit of being good to people","B1"],
    ["help out","give practical help","B1"],
    ["touched","emotionally moved by something good","B2"],
    ["go out of your way","make an extra effort for someone","B2"],
    ["expect nothing in return","want no reward","B2"],
    ["restore","bring something back that was lost","C1"],
    ["compassion","feeling for someone and wanting to help","C1"]
  ],
  chunks:[
    "go out of their way to help",
    "expect nothing in return",
    "it restored my faith in people",
    "a complete stranger",
    "without even asking",
    "I'll never forget it",
    "pay it forward"
  ],
  frames:[
    "Once, a stranger ___ «past simple»",
    "It happened when I was ___ «-ing»",
    "I'd never met them before, but they ___",
    "What surprised me most was ___",
    "It taught me that ___",
    "I've tried to do the same for ___ ever since"
  ]
},
{
  id:70, cat:"people",
  q:"What is the most important quality in a true friend?",
  note:"a friend <b>who</b> / someone <b>who</b> + present simple — and <i>value ___ <b>more than</b> ___</i>",
  vocab:[
    ["quality","a good part of someone's character","B1"],
    ["loyal","staying with someone through everything","B2"],
    ["reliable","always does what they promised","B2"],
    ["trustworthy","safe to tell a secret to","B2"],
    ["take for granted","stop noticing how good someone is","B2"],
    ["stick by someone","stay with them in trouble","B2"],
    ["dependable","you can count on them every time","C1"],
    ["shallow","friendly on the surface only","B2"]
  ],
  chunks:[
    "stick by you no matter what",
    "be there when it matters",
    "tell you the truth even when it hurts",
    "keep your secrets",
    "pick up where we left off",
    "never make you feel small",
    "a friend in need is a friend indeed"
  ],
  frames:[
    "The most important quality is ___",
    "A true friend is someone who ___ «present simple»",
    "Anyone can ___, but a real friend will ___",
    "I value ___ more than ___",
    "My closest friend has ___ «have + past participle»",
    "You find out who your real friends are when ___"
  ]
},
{
  id:73, cat:"people",
  q:"What is something you are deeply grateful for today?",
  note:"grateful <b>for</b> + noun / -ing, but grateful <b>that</b> + clause",
  vocab:[
    ["grateful","glad and wanting to say thank you","B1"],
    ["appreciate","notice properly how good something is","B1"],
    ["blessing","something good you were given","B2"],
    ["ordinary","normal, nothing special","B1"],
    ["take for granted","not notice how good something is","B2"],
    ["gratitude","the feeling of being thankful","C1"],
    ["privilege","an advantage not everyone has","C1"],
    ["abundance","more than enough of something","C1"]
  ],
  chunks:[
    "grateful for ___",
    "count my blessings",
    "take it for granted",
    "the little things",
    "not everyone has ___",
    "wake up healthy",
    "I don't say it often enough"
  ],
  frames:[
    "Today, I'm grateful for ___ «noun / -ing»",
    "I'm thankful that ___ «clause»",
    "It's easy to take ___ for granted",
    "Something small I appreciate is ___",
    "I don't say it enough, but ___",
    "If I lost ___, I'd realise ___"
  ]
},
{
  id:80, cat:"people",
  q:"How do you show someone that you care about them without using words?",
  note:"show / do something <b>by</b> + -ing — <i>I show it by making tea</i>",
  vocab:[
    ["gesture","a small action that carries meaning","B2"],
    ["thoughtful","thinking about what others need","B2"],
    ["effort","the work you put in for someone","B1"],
    ["show up","come and be there when needed","B2"],
    ["attentive","noticing what someone needs","C1"],
    ["presence","simply being there with someone","C1"],
    ["subtle","small and quiet, easy to miss","C1"],
    ["affection","warm caring feeling you show","B2"]
  ],
  chunks:[
    "show up for someone",
    "actions speak louder than words",
    "little gestures",
    "make time for someone",
    "remember the small details",
    "just be there",
    "go the extra mile"
  ],
  frames:[
    "I show I care by ___ «-ing»",
    "In my family, we ___ instead of saying it",
    "Actions like ___ say more than ___",
    "For me, just ___ is enough",
    "My father has never said it, but ___",
    "The best way to show someone you care is to ___"
  ]
},
{
  id:62, cat:"people",
  q:"What do you do when you need comfort?",
  note:"turn <b>to</b> someone / something <b>for</b> comfort — <i>I turn to my sister for comfort</i>",
  vocab:[
    ["comfort","a feeling of calm when you are sad or worried","B1"],
    ["soothe","gently make pain or worry less strong","C1"],
    ["cope","manage a difficult feeling or situation","B2"],
    ["routine","something you do in the same way regularly","B1"],
    ["distraction","something that takes your mind off a problem","B2"],
    ["reassurance","words or actions that make you feel less worried","C1"],
    ["withdraw","move away from other people","C1"],
    ["reach out","contact someone because you need help or connection","B2"]
  ],
  chunks:[
    "turn to someone for comfort",
    "wrap myself in a blanket",
    "take my mind off things",
    "reach out to ___",
    "need some time alone",
    "feel like myself again",
    "a familiar source of comfort"
  ],
  frames:[
    "When I need comfort, I usually ___",
    "The first person I turn to is ___",
    "Something that always soothes me is ___",
    "Sometimes I need company; other times I ___",
    "It helps when someone ___",
    "After ___, I usually feel ___"
  ]
},
{
  id:66, cat:"people",
  q:"How do you build trust with someone new?",
  note:"build trust <b>by</b> + -ing — <i>you build trust by keeping your promises</i>",
  vocab:[
    ["trust","belief that someone is honest and reliable","B1"],
    ["reliable","doing what you promised to do","B2"],
    ["open up","begin to share private thoughts and feelings","B2"],
    ["consistent","behaving in the same dependable way","B2"],
    ["boundary","a limit that protects what feels safe or acceptable","B2"],
    ["vulnerable","willing to show feelings that could be hurt","C1"],
    ["earn","gain something through your behaviour or effort","B1"],
    ["mutual","felt or done equally by both people","C1"]
  ],
  chunks:[
    "earn someone's trust",
    "keep your word",
    "open up gradually",
    "respect someone's boundaries",
    "be consistent over time",
    "give someone the benefit of the doubt",
    "trust goes both ways"
  ],
  frames:[
    "I build trust by ___ «-ing»",
    "Before I open up, I need to see that someone ___",
    "Trust grows when both people ___",
    "One small way to show reliability is to ___",
    "It takes me ___ to trust someone because ___",
    "Trust can be damaged if ___"
  ]
},
{
  id:68, cat:"people",
  q:"Why is it so important to feel listened to?",
  note:"feel + past participle — <i>feel heard / understood / respected</i>",
  vocab:[
    ["listen","pay attention to what someone is saying","A2"],
    ["heard","listened to and taken seriously","B1"],
    ["understood","known correctly at the level of thoughts or feelings","B1"],
    ["interrupt","speak before someone has finished","B1"],
    ["validate","show that someone's feelings make sense","C1"],
    ["dismiss","treat a person or idea as unimportant","C1"],
    ["empathy","the ability to understand another person's feelings","B2"],
    ["acknowledge","show that you have noticed or accepted something","C1"]
  ],
  chunks:[
    "feel heard and understood",
    "give someone your full attention",
    "listen without interrupting",
    "take someone's feelings seriously",
    "jump in with advice",
    "feel invisible",
    "show that you understand"
  ],
  frames:[
    "Feeling listened to matters because ___",
    "When someone really listens, I feel ___",
    "A good listener doesn't just ___; they also ___",
    "I feel dismissed when ___",
    "Sometimes people need empathy rather than ___",
    "One way to show you are listening is to ___"
  ]
},
{
  id:72, cat:"people",
  q:"How do you handle disappointment when things don't go your way?",
  note:"handle / deal <b>with</b> + noun — <i>I deal with disappointment by taking a break</i>",
  vocab:[
    ["disappointment","sadness because something was not as good as hoped","B1"],
    ["expectation","a belief about what should happen","B2"],
    ["setback","a problem that delays your progress","B2"],
    ["accept","recognise that something is true and cannot be changed","B1"],
    ["adapt","change your plan to suit a new situation","B2"],
    ["resilient","able to recover after something goes wrong","C1"],
    ["dwell on","keep thinking about something upsetting","C1"],
    ["perspective","a way of seeing a situation in relation to everything else","B2"]
  ],
  chunks:[
    "things don't go my way",
    "feel disappointed about ___",
    "give myself time to ___",
    "learn from the setback",
    "adjust my expectations",
    "look at the bigger picture",
    "try again with a new plan"
  ],
  frames:[
    "When things don't go my way, I first ___",
    "I let myself feel ___, but then I ___",
    "It helps me to remember that ___",
    "Instead of dwelling on it, I try to ___",
    "One disappointment that taught me something was ___",
    "Next time, I would ___ differently"
  ]
},
{
  id:76, cat:"people",
  q:"How does helping someone else make you feel inside?",
  note:"help someone + <b>base verb</b> — <i>I helped him carry the bags</i>; no <i>to</i> is needed",
  vocab:[
    ["helpful","willing or able to make things easier for someone","A2"],
    ["satisfied","pleased because you did something worthwhile","B1"],
    ["useful","able to help or achieve something","A2"],
    ["generous","willing to give time, help, or money","B1"],
    ["rewarding","giving a strong feeling of satisfaction","B2"],
    ["purpose","the feeling that your actions have meaning","B2"],
    ["uplifted","made to feel happier or more hopeful","C1"],
    ["altruistic","caring about others without seeking a reward","C1"]
  ],
  chunks:[
    "lend a helping hand",
    "make someone's day easier",
    "expect nothing in return",
    "give me a sense of purpose",
    "feel good inside",
    "a rewarding experience",
    "help in a small way"
  ],
  frames:[
    "Helping someone makes me feel ___",
    "I feel most useful when I can ___",
    "Recently, I helped someone ___ «base verb»",
    "Even a small act can ___",
    "I don't help in order to ___; I help because ___",
    "Sometimes helping others also helps me to ___"
  ]
},

/* ── THE UNKNOWN, HOPE & THE FUTURE ─────────────────────────────── */
{
  id:81, cat:"future",
  q:"What do you hope will be different about the world in 100 years?",
  note:"future perfect — <b>will have</b> + past participle: <i>by then we'll have found a cure</i>",
  vocab:[
    ["humanity","all people together as one group","B2"],
    ["progress","movement towards something better","B1"],
    ["conflict","serious disagreement or war","B2"],
    ["cure","something that ends an illness completely","B1"],
    ["divide","a gap between two groups of people","B2"],
    ["inequality","some having far more than others","C1"],
    ["sustainable","able to continue without damaging the earth","C1"],
    ["era","a long period of history","C1"]
  ],
  chunks:[
    "look back on our time",
    "find a cure for ___",
    "close the gap between ___ and ___",
    "learn from our mistakes",
    "future generations",
    "a world where ___",
    "by then, I hope ___"
  ],
  frames:[
    "I hope that in 100 years, ___ «will + base verb»",
    "I'd like to see a world where ___",
    "By then, I hope we'll have ___ «past participle»",
    "The thing I most want to change is ___",
    "I'm afraid ___ will get worse unless ___",
    "Future generations will probably ___"
  ]
},
{
  id:87, cat:"future",
  q:"What brings you hope when the world seems dark?",
  note:"<b>when</b> + present simple for a general truth — <i>when things get hard, I remind myself…</i>",
  vocab:[
    ["hope","the feeling that good things can still come","A2"],
    ["faith","trust in something you cannot prove","B2"],
    ["overwhelmed","feeling that it is all too much","B2"],
    ["headlines","the big news stories of the day","B2"],
    ["despair","the complete loss of hope","C1"],
    ["resilience","the strength to keep going after a blow","C1"],
    ["persevere","keep going even when it's hard","C1"],
    ["glimmer","a very small sign of something good","C1"]
  ],
  chunks:[
    "hold on to hope",
    "a glimmer of hope",
    "switch off the news",
    "focus on what I can control",
    "ordinary people doing good",
    "keep going",
    "this too shall pass"
  ],
  frames:[
    "What gives me hope is ___",
    "When things feel dark, I ___ «present simple»",
    "I remind myself that ___",
    "Seeing ___ makes me believe ___",
    "I take hope from the fact that ___",
    "Even in the worst times, ___"
  ]
},
{
  id:90, cat:"future",
  q:"What is a dream you have that you have never told anyone?",
  note:"dream <b>of</b> + -ing / dream <b>about</b> + -ing — <i>I've dreamed of opening a school</i>",
  vocab:[
    ["ambition","a big thing you want to achieve","B2"],
    ["admit","say something you were hiding","B1"],
    ["dare","be brave enough to do something","B2"],
    ["unrealistic","not likely to be possible","B2"],
    ["keep it to yourself","not tell anybody","B2"],
    ["long for","want something deeply for a long time","C1"],
    ["pursue","chase a goal over years","C1"],
    ["hold back","stop yourself from doing something","B2"]
  ],
  chunks:[
    "a dream I've never shared",
    "afraid people would laugh",
    "one day I'd love to ___",
    "it might sound silly, but",
    "I've never said this out loud",
    "keep it to myself",
    "take the first step"
  ],
  frames:[
    "I've never told anyone that I want to ___",
    "It might sound ___, but ___",
    "For years I've dreamed of ___ «-ing»",
    "I've never said it out loud because ___",
    "If money and time weren't a problem, I'd ___",
    "The first step would be ___"
  ]
},
{
  id:95, cat:"future",
  q:"How do you find peace when you are worried about the future?",
  note:"it helps me <b>to</b> + base verb, and focus <b>on</b> + noun / -ing",
  vocab:[
    ["anxious","worried and unable to relax","B2"],
    ["uncertainty","not knowing what will happen","B2"],
    ["cope","manage a difficult situation","B2"],
    ["overthink","think about something far too much","B2"],
    ["reassure","tell someone it will be all right","C1"],
    ["ground yourself","bring yourself back to the present","C1"],
    ["dwell on","keep thinking about something bad","C1"],
    ["at ease","relaxed and unworried","B2"]
  ],
  chunks:[
    "worry about things I can't control",
    "take it one day at a time",
    "put my mind at rest",
    "talk it through with someone",
    "focus on the present",
    "what's the worst that could happen?",
    "cross that bridge when I come to it"
  ],
  frames:[
    "When I worry about the future, I ___ «present simple»",
    "I try to focus on ___ instead of ___",
    "It helps me to ___ «base verb»",
    "I remind myself that ___",
    "Worrying doesn't ___; it only ___",
    "One thing that always calms me down is ___"
  ]
},
{
  id:99, cat:"future",
  q:"What makes you feel safe when you are afraid?",
  note:"<b>make</b> + person + <b>adjective</b> — <i>it makes me feel safe</i>; and <i>just knowing that…</i>",
  vocab:[
    ["safe","free from danger or harm","A2"],
    ["afraid","feeling fear","A2"],
    ["familiar","known well and comfortable","B2"],
    ["shelter","a place that protects you","B2"],
    ["steady","calm and not shaking","B1"],
    ["reassurance","words or acts that take fear away","C1"],
    ["presence","the fact of someone simply being there","C1"],
    ["vulnerable","open to being hurt","C1"]
  ],
  chunks:[
    "feel safe with someone",
    "a familiar voice",
    "somewhere I can breathe",
    "know I'm not alone",
    "hold my hand",
    "bring me back to myself",
    "a safe pair of hands"
  ],
  frames:[
    "What makes me feel safe is ___",
    "When I'm afraid, I ___ «present simple»",
    "Being with ___ makes me feel ___ «adjective»",
    "There's a place I go when ___",
    "Just knowing that ___ is enough",
    "I feel safest when ___"
  ]
},
{
  id:82, cat:"future",
  q:"Are you afraid of growing old? Why or why not?",
  note:"afraid <b>of</b> + -ing — <i>I'm afraid of losing my independence</i>",
  vocab:[
    ["age","grow older","A2"],
    ["elderly","old, especially over about 65","B1"],
    ["independence","the ability to live without relying on others","B2"],
    ["wisdom","good judgement gained through experience","B2"],
    ["decline","gradually become weaker or worse","B2"],
    ["mortality","the fact that every person will die","C1"],
    ["vitality","energy and strength","C1"],
    ["age gracefully","grow older with acceptance and dignity","C1"]
  ],
  chunks:[
    "grow old / get older",
    "lose my independence",
    "gain wisdom with age",
    "make peace with ___",
    "stay active and curious",
    "look forward to ___",
    "age is just a number"
  ],
  frames:[
    "I am / am not afraid of growing old because ___",
    "What worries me most is ___ «noun / -ing»",
    "On the positive side, getting older means ___",
    "I hope I will still be able to ___",
    "The older people I admire ___",
    "I think I could age well if ___"
  ]
},
{
  id:85, cat:"future",
  q:"What is one great mystery about the world or human life that you hope to understand one day?",
  note:"hope <b>to understand</b> / wonder <b>why, how, whether</b> + clause",
  vocab:[
    ["mystery","something that is difficult or impossible to explain","B1"],
    ["consciousness","the state of being aware and able to think","C1"],
    ["origin","the point or place where something begins","B2"],
    ["existence","the state of being real or alive","B2"],
    ["unexplained","not yet understood or given a reason","B2"],
    ["phenomenon","an event or fact that can be observed","C1"],
    ["unravel","gradually solve something complicated","C1"],
    ["fundamental","basic and extremely important","C1"]
  ],
  chunks:[
    "one of life's great mysteries",
    "understand how / why ___",
    "no simple answer",
    "still puzzles scientists",
    "may never be fully explained",
    "get closer to the truth",
    "change the way we see ___"
  ],
  frames:[
    "One mystery I hope to understand is ___",
    "I often wonder why / how ___",
    "We know that ___, but we still don't know ___",
    "If we solved this mystery, we might ___",
    "I think the answer could involve ___",
    "Perhaps human beings will never ___"
  ]
},
{
  id:88, cat:"future",
  q:"If you could know the exact day of your death, would you want to know?",
  note:"second conditional question — <b>If</b> you could know…, <b>would</b> you want to?",
  vocab:[
    ["exact","completely correct and specific","A2"],
    ["predict","say what will happen before it happens","B1"],
    ["uncertainty","the state of not knowing what will happen","B2"],
    ["fate","what is believed to be decided for your future","B2"],
    ["dread","strong fear about something that may happen","C1"],
    ["cherish","love and protect someone or something deeply","C1"],
    ["inevitable","certain to happen and impossible to avoid","C1"],
    ["countdown","a count of the time remaining before an event","B2"]
  ],
  chunks:[
    "know in advance",
    "live under a countdown",
    "make the most of my time",
    "put my affairs in order",
    "take each day as it comes",
    "change the way I live",
    "some things are better left unknown"
  ],
  frames:[
    "If I had the choice, I ___ want to know «would / wouldn't»",
    "Knowing the date would make me ___",
    "On one hand, I could ___; on the other hand, ___",
    "I think I would spend my remaining time ___ «-ing»",
    "Not knowing allows us to ___",
    "My answer might change if ___"
  ]
},
{
  id:96, cat:"future",
  q:"If you could travel to the future or the past, which would you choose?",
  note:"would rather + <b>base verb</b> — <i>I'd rather travel to the past than the future</i>",
  vocab:[
    ["past","the time before now","A2"],
    ["future","the time after now","A2"],
    ["era","a particular period in history","B2"],
    ["witness","see an important event happen","B2"],
    ["ancestor","a family member who lived long ago","B2"],
    ["descendant","a person from your family who will live after you","C1"],
    ["alter","change something, usually slightly","C1"],
    ["paradox","a situation that seems impossible or contradictory","C1"]
  ],
  chunks:[
    "go back in time",
    "travel far into the future",
    "witness history firsthand",
    "meet my ancestors",
    "see how the world turns out",
    "change the course of history",
    "return to the present"
  ],
  frames:[
    "I'd rather travel to the ___ than the ___",
    "I would choose the year ___ because ___",
    "The first thing I'd want to see is ___",
    "I would / wouldn't try to change ___",
    "What I'd be most afraid of is ___",
    "Before returning, I would ask / find out ___"
  ]
},
{
  id:100, cat:"future",
  q:"If you found out today was your last day on earth, who would you thank and why?",
  note:"thank someone <b>for</b> + noun / -ing — <i>I'd thank her for believing in me</i>",
  vocab:[
    ["thankful","feeling pleased and grateful","B1"],
    ["appreciate","recognise how valuable someone or something is","B1"],
    ["support","help and encouragement given to someone","B1"],
    ["sacrifice","something valuable you give up for a greater reason","B2"],
    ["influence","an effect on the way someone develops or behaves","B2"],
    ["acknowledge","show that you recognise someone's contribution","C1"],
    ["indebted","deeply grateful because of someone's help","C1"],
    ["take for granted","fail to appreciate someone because they are always there","B2"]
  ],
  chunks:[
    "thank someone for ___",
    "stand by me through ___",
    "believe in me when ___",
    "never had the chance to say",
    "owe so much to ___",
    "take someone's love for granted",
    "one final conversation"
  ],
  frames:[
    "The first person I would thank is ___",
    "I'd thank them for ___ «noun / -ing»",
    "They changed my life by ___ «-ing»",
    "I would want them to know that ___",
    "I haven't said it enough, but ___",
    "Because of them, I have become ___"
  ]
}

];
