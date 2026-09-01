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
{
  id:3, cat:"life",
  q:"How do you find peace or meaning when something completely unexpected happens in your life?",
  note:"find meaning <b>in</b> + noun / -ing — <i>I try to find meaning in what happened</i>",
  vocab:[
    ["unexpected","not planned or thought likely to happen","B1"],
    ["cope","manage a difficult situation","B2"],
    ["meaning","a reason or importance behind something","B1"],
    ["acceptance","recognising reality without fighting it","B2"],
    ["perspective","a particular way of seeing a situation","B2"],
    ["uncertainty","the state of not knowing what will happen","B2"],
    ["ground yourself","bring your attention back to the present","C1"],
    ["make sense of","understand something confusing or painful","B2"]
  ],
  chunks:[
    "come out of nowhere",
    "make sense of what happened",
    "take things one day at a time",
    "focus on what I can control",
    "find meaning in ___",
    "lean on my faith / family",
    "eventually come to accept ___"
  ],
  frames:[
    "When something unexpected happens, I first ___",
    "I find peace by ___ «-ing»",
    "It helps me to focus on ___",
    "At first I may feel ___, but later ___",
    "I try to make sense of it by ___",
    "One unexpected event that changed me was ___"
  ]
},
{
  id:6, cat:"life",
  q:"What is something you believe is true, even if you cannot prove it?",
  note:"believe <b>that</b> + clause — <i>I believe that kindness comes back to us</i>",
  vocab:[
    ["believe","accept that something is true","A2"],
    ["prove","show with evidence that something is true","B1"],
    ["evidence","facts or signs that support an idea","B1"],
    ["intuition","a feeling of knowing without conscious reasoning","C1"],
    ["faith","strong trust without complete proof","B2"],
    ["conviction","a firmly held belief","C1"],
    ["assumption","something accepted as true without proof","B2"],
    ["doubt","a feeling that something may not be true","B1"]
  ],
  chunks:[
    "believe deep down",
    "can't prove it scientifically",
    "have faith that ___",
    "based on personal experience",
    "trust my intuition",
    "leave room for doubt",
    "feel true to me"
  ],
  frames:[
    "I believe that ___, even though I can't prove it",
    "My belief comes from ___",
    "There is no clear evidence, but ___",
    "Some people might disagree because ___",
    "I would change my mind if ___",
    "For me, faith begins where ___"
  ]
},
{
  id:7, cat:"life",
  q:"Who is the wisest person you know, and why?",
  note:"the wisest person <b>I know</b> — the relative pronoun can be omitted after a superlative noun phrase",
  vocab:[
    ["wise","able to make good decisions from experience","B1"],
    ["wisdom","deep practical understanding of life","B2"],
    ["experienced","having learned through doing something","B1"],
    ["judgement","the ability to make sensible decisions","B2"],
    ["patient","able to wait or listen calmly","A2"],
    ["insight","a clear and deep understanding","C1"],
    ["humble","not believing you are better than others","B2"],
    ["level-headed","calm and sensible in difficult situations","C1"]
  ],
  chunks:[
    "give thoughtful advice",
    "learn from experience",
    "see both sides",
    "think before speaking",
    "never rush to judge",
    "words of wisdom",
    "look up to someone"
  ],
  frames:[
    "The wisest person I know is ___",
    "I consider them wise because ___",
    "Whenever I need advice, they ___",
    "They taught me that ___",
    "Unlike many people, they never ___",
    "One wise thing they once said was ___"
  ]
},
{
  id:10, cat:"life",
  q:"What brings you the most true joy?",
  note:"bring someone joy — <i>spending time with family brings me joy</i>",
  vocab:[
    ["joy","a strong feeling of deep happiness","B1"],
    ["pleasure","enjoyment or satisfaction","B1"],
    ["contentment","quiet happiness with what you have","C1"],
    ["fulfilment","happiness from doing something meaningful","C1"],
    ["delight","great pleasure or happiness","B2"],
    ["fleeting","lasting only a short time","C1"],
    ["savour","slow down and fully enjoy a moment","C1"],
    ["uplift","make someone feel happier and more hopeful","B2"]
  ],
  chunks:[
    "bring me real joy",
    "the simple pleasure of ___",
    "light up my day",
    "lose track of time",
    "feel deeply content",
    "money can't replace ___",
    "savour the moment"
  ],
  frames:[
    "What brings me the most joy is ___",
    "I feel happiest when ___",
    "It may sound simple, but ___",
    "The difference between pleasure and joy is ___",
    "A recent moment of true joy was ___",
    "I make more room for joy by ___ «-ing»"
  ]
},
{
  id:11, cat:"life",
  q:"Do you think people are born with a specific purpose?",
  note:"be born <b>with</b> + noun / be meant <b>to</b> + base verb",
  vocab:[
    ["purpose","the reason why someone exists or does something","B1"],
    ["destiny","events believed to be decided in advance","B2"],
    ["calling","a strong feeling that a certain life or job is right for you","C1"],
    ["talent","a natural ability to do something well","B1"],
    ["discover","find something for the first time","A2"],
    ["shape","influence how something develops","B2"],
    ["predetermined","decided before it happens","C1"],
    ["evolve","develop gradually over time","C1"]
  ],
  chunks:[
    "be born with a purpose",
    "find your calling",
    "be meant to ___",
    "discover along the way",
    "use your gifts to ___",
    "create your own meaning",
    "change over a lifetime"
  ],
  frames:[
    "I think people are / aren't born with ___",
    "Perhaps we are meant to ___",
    "Our purpose may come from ___",
    "Some people discover their purpose when ___",
    "My sense of purpose has changed because ___",
    "Even without one specific purpose, we can ___"
  ]
},
{
  id:13, cat:"life",
  q:"If you had only one year left to live, how would you change your life today?",
  note:"second conditional — <b>If</b> + past simple, <b>would</b> + base verb",
  vocab:[
    ["priority","something more important than other things","B1"],
    ["regret","sadness about something you did or did not do","B2"],
    ["postpone","delay something until later","B1"],
    ["cherish","love and value someone or something deeply","C1"],
    ["urgent","needing immediate attention","B1"],
    ["reconcile","repair a broken relationship","C1"],
    ["bucket list","experiences you want to have during your life","B2"],
    ["make the most of","use something as fully as possible","B2"]
  ],
  chunks:[
    "have one year left",
    "change my priorities",
    "stop putting off ___",
    "spend quality time with ___",
    "make peace with someone",
    "live without regret",
    "make every day count"
  ],
  frames:[
    "If I had one year left, I would ___",
    "I would stop ___ «-ing» and start ___ «-ing»",
    "The person I'd spend more time with is ___",
    "One thing I would finally do is ___",
    "I would want to make peace with ___",
    "Thinking about this makes me want to ___ today"
  ]
},
{
  id:14, cat:"life",
  q:"What do you think makes a human life valuable?",
  note:"make + object + adjective — <i>relationships make life valuable</i>",
  vocab:[
    ["valuable","important and deserving care or respect","B1"],
    ["dignity","the value and respect every person deserves","C1"],
    ["inherent","existing as a natural and permanent quality","C1"],
    ["contribution","something useful that you give or do","B2"],
    ["potential","the ability to develop or achieve something","B2"],
    ["worth","the value or importance of someone or something","B2"],
    ["compassion","concern for someone who is suffering","C1"],
    ["unique","unlike anyone or anything else","B1"]
  ],
  chunks:[
    "have value simply because ___",
    "contribute to society",
    "treat every person with dignity",
    "measure someone's worth by ___",
    "reach their full potential",
    "touch other people's lives",
    "no life is worth more than another"
  ],
  frames:[
    "I believe every human life is valuable because ___",
    "A person's worth should not depend on ___",
    "What gives life meaning is ___",
    "Even someone who cannot ___ can still ___",
    "Society sometimes values people by ___, but ___",
    "To respect human life, we should ___"
  ]
},
{
  id:15, cat:"life",
  q:"How do you decide what is most important in your life?",
  note:"decide <b>what to</b> + base verb — <i>I decide what to prioritise by asking…</i>",
  vocab:[
    ["priority","something that matters more than other things","B1"],
    ["value","a belief that guides your choices","B1"],
    ["balance","a healthy amount of different activities","B1"],
    ["evaluate","judge the importance or quality of something","B2"],
    ["trade-off","a choice where gaining one thing means losing another","C1"],
    ["align","bring things into agreement with each other","C1"],
    ["essential","completely necessary or extremely important","B2"],
    ["reflect","think carefully and deeply","B2"]
  ],
  chunks:[
    "set my priorities",
    "make time for what matters",
    "weigh one thing against another",
    "say no to ___",
    "align my choices with my values",
    "look at the long term",
    "ask myself whether ___"
  ],
  frames:[
    "I decide what matters by ___ «-ing»",
    "My top priority is ___ because ___",
    "When two important things conflict, I ___",
    "I know something is important if ___",
    "I sometimes have to say no to ___ in order to ___",
    "My priorities have changed since ___"
  ]
},
{
  id:17, cat:"life",
  q:"Do you think it is harder to be a good person today than in the past?",
  note:"comparative + <b>than</b> — <i>it is harder today than it was in the past</i>",
  vocab:[
    ["temptation","a strong desire to do something you should not","B2"],
    ["pressure","a strong influence that pushes you to act","B1"],
    ["standard","an expected level of behaviour","B1"],
    ["community","people who live together or share something","B1"],
    ["accountability","being responsible for your choices","C1"],
    ["self-interest","concern mainly for your own advantage","C1"],
    ["compassion","care for people who are suffering","C1"],
    ["generation","people born during the same period","B1"]
  ],
  chunks:[
    "harder than it used to be",
    "face new kinds of pressure",
    "people haven't really changed",
    "be held accountable",
    "look out for yourself",
    "a stronger sense of community",
    "every generation faces ___"
  ],
  frames:[
    "I think being good is ___ today than in the past",
    "People today face ___, whereas people before ___",
    "On the other hand, we now have more ___",
    "Human nature hasn't changed because ___",
    "It may seem harder when ___",
    "In any period, being good requires ___"
  ]
},
{
  id:18, cat:"life",
  q:"What is something you used to care a lot about, but don't anymore?",
  note:"used <b>to</b> + base verb for a past state that is no longer true",
  vocab:[
    ["care about","consider something important","A2"],
    ["outgrow","stop enjoying or needing something as you mature","C1"],
    ["approval","the feeling that others accept or like something","B2"],
    ["trend","a style or behaviour popular for a period","B1"],
    ["perspective","a way of understanding a situation","B2"],
    ["mature","develop emotionally and mentally","B2"],
    ["obsess over","think about something far too much","C1"],
    ["let go of","stop being attached to something","B2"]
  ],
  chunks:[
    "used to care deeply about ___",
    "worry about what people thought",
    "grow out of ___",
    "doesn't matter to me anymore",
    "put things in perspective",
    "let go of the need to ___",
    "my priorities changed"
  ],
  frames:[
    "I used to care a lot about ___",
    "At the time, I thought ___ was extremely important",
    "I stopped caring when ___",
    "Now I realise that ___",
    "Instead, I care more about ___",
    "Letting go of it has made me ___"
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
{
  id:23, cat:"moral",
  q:"Have you ever done the right thing, even when it was very difficult?",
  note:"present perfect for experience, then past simple for details — <i>I've done it once. It happened when…</i>",
  vocab:[
    ["right","morally good or correct","A2"],
    ["difficult","needing effort, courage, or skill","A2"],
    ["principle","a belief that guides how you behave","B2"],
    ["pressure","influence that tries to make you act a certain way","B1"],
    ["consequence","a result of an action or decision","B2"],
    ["integrity","doing what is right even when it costs you","C1"],
    ["stand your ground","refuse to change a decision you believe is right","C1"],
    ["compromise","accept less than you wanted to reach agreement","B2"]
  ],
  chunks:[
    "do the right thing",
    "stand up for what I believed",
    "go against the group",
    "pay a price for ___",
    "stay true to my principles",
    "be tempted to stay silent",
    "look back without regret"
  ],
  frames:[
    "Yes, once I had to ___ even though ___",
    "The situation began when ___",
    "I knew the right thing was to ___",
    "It was difficult because ___",
    "In the end, I decided to ___",
    "Looking back, I feel ___ about my choice"
  ]
},
{
  id:24, cat:"moral",
  q:"Who taught you the difference between right and wrong?",
  note:"teach someone <b>the difference between</b> A <b>and</b> B",
  vocab:[
    ["right and wrong","morally good and morally bad behaviour","A2"],
    ["upbringing","the way a child is raised","B2"],
    ["discipline","training that teaches rules and self-control","B2"],
    ["example","a person or action that shows what to do","A2"],
    ["conscience","your inner sense of right and wrong","C1"],
    ["influence","the power to shape someone's ideas or actions","B2"],
    ["instil","gradually put a belief or value into someone","C1"],
    ["role model","someone whose behaviour you try to copy","B1"]
  ],
  chunks:[
    "teach right from wrong",
    "lead by example",
    "set clear boundaries",
    "explain the reason behind a rule",
    "learn through consequences",
    "shape my conscience",
    "values passed down to me"
  ],
  frames:[
    "___ taught me most about right and wrong",
    "They taught me by ___ «-ing»",
    "One rule they always emphasised was ___",
    "I learned from their example that ___",
    "As I grew older, I began to question ___",
    "Today, my sense of right and wrong comes from ___"
  ]
},
{
  id:25, cat:"moral",
  q:"Do you think human beings are naturally good or naturally bad?",
  note:"be born + adjective / learn <b>to</b> + base verb — <i>we are born selfish but learn to share</i>",
  vocab:[
    ["naturally","in a way that comes from birth rather than learning","B1"],
    ["human nature","the basic qualities shared by people","B2"],
    ["selfish","caring mainly about yourself","B1"],
    ["compassionate","wanting to help those who suffer","C1"],
    ["instinct","a natural way of behaving without learning","B2"],
    ["environment","the conditions and people around someone","B1"],
    ["nurture","the care and influence given while someone grows","C1"],
    ["capacity","the ability or potential to do something","B2"]
  ],
  chunks:[
    "good by nature",
    "born with the capacity for both",
    "shaped by our environment",
    "act out of self-interest",
    "show natural compassion",
    "learn right from wrong",
    "bring out the best / worst in us"
  ],
  frames:[
    "I think human beings are naturally ___",
    "We may be born with ___, but we learn ___",
    "Children show that people ___",
    "Our environment shapes us by ___ «-ing»",
    "The same person can be ___ when ___ and ___ when ___",
    "Perhaps human nature contains both ___ and ___"
  ]
},
{
  id:27, cat:"moral",
  q:"Have you ever forgiven someone who did not apologize?",
  note:"forgive someone <b>for</b> + noun / -ing — <i>I forgave him for hurting me</i>",
  vocab:[
    ["forgive","stop holding anger against someone","B1"],
    ["apologize","say that you are sorry for doing wrong","B1"],
    ["closure","a feeling that a painful experience is finally finished","C1"],
    ["resentment","lasting anger about unfair treatment","C1"],
    ["release","allow a feeling or person to become free","B2"],
    ["acknowledge","accept that something happened or was wrong","C1"],
    ["accountability","responsibility for the results of your actions","C1"],
    ["reconcile","restore a relationship after conflict","C1"]
  ],
  chunks:[
    "forgive without an apology",
    "wait for someone to say sorry",
    "let go for my own peace",
    "take responsibility for ___",
    "move on without closure",
    "rebuild the relationship",
    "forgiveness doesn't excuse ___"
  ],
  frames:[
    "I have / haven't forgiven someone who ___",
    "They never apologised for ___ «-ing»",
    "I chose to forgive because ___",
    "Forgiving them did not mean that ___",
    "I could move on, but I couldn't ___",
    "An apology would have helped by ___ «-ing»"
  ]
},
{
  id:28, cat:"moral",
  q:"What does it mean to be truly free?",
  note:"be free <b>to</b> + base verb / free <b>from</b> + noun",
  vocab:[
    ["freedom","the ability to choose how you live and act","B1"],
    ["choice","the act or possibility of deciding","A2"],
    ["responsibility","a duty to deal with the results of your actions","B1"],
    ["restriction","a rule or limit on what you can do","B2"],
    ["oppression","cruel control that denies people freedom","C1"],
    ["autonomy","the ability to make your own decisions","C1"],
    ["liberation","the process of becoming free","C1"],
    ["self-control","the ability to manage your own behaviour","B2"]
  ],
  chunks:[
    "free to make my own choices",
    "free from fear",
    "come with responsibility",
    "do whatever you want",
    "respect other people's freedom",
    "control your own life",
    "inner freedom"
  ],
  frames:[
    "To be truly free means being able to ___",
    "Freedom is not simply ___; it also requires ___",
    "A person can be physically free but still ___",
    "My freedom should end when ___",
    "I feel most free when ___",
    "Without responsibility, freedom can become ___"
  ]
},
{
  id:31, cat:"moral",
  q:"How do you feel when you see someone helping a stranger?",
  note:"see someone + <b>-ing</b> focuses on an action in progress — <i>I saw her helping a stranger</i>",
  vocab:[
    ["stranger","someone you do not know","A2"],
    ["kindness","friendly and helpful behaviour","B1"],
    ["generous","willing to give time, money, or help","B1"],
    ["inspired","made to want to do something positive","B1"],
    ["uplifted","made happier and more hopeful","C1"],
    ["compassion","care for someone who is suffering","C1"],
    ["selfless","putting another person's needs before your own","C1"],
    ["restore","bring back a feeling or condition that was lost","C1"]
  ],
  chunks:[
    "lend a hand to a stranger",
    "expect nothing in return",
    "restore my faith in people",
    "make me want to help too",
    "a small act of kindness",
    "brighten someone's day",
    "pass the kindness on"
  ],
  frames:[
    "When I see someone helping a stranger, I feel ___",
    "It reminds me that people can ___",
    "Even a small act like ___ can ___",
    "I once saw someone ___ «-ing»",
    "That moment inspired me to ___",
    "I think kindness spreads when ___"
  ]
},
{
  id:32, cat:"moral",
  q:"Have you ever felt guilty about something? How did you fix it?",
  note:"feel guilty <b>about</b> + noun / -ing; make up <b>for</b> + noun / -ing",
  vocab:[
    ["guilty","feeling bad because you did something wrong","B1"],
    ["regret","feel sorry about a past action","B1"],
    ["admit","say that you did something wrong","B1"],
    ["apologize","tell someone you are sorry","B1"],
    ["repair","fix damage or harm","B1"],
    ["make amends","do something to correct a wrong","C1"],
    ["conscience","your inner sense of right and wrong","C1"],
    ["take responsibility","accept that an outcome was your fault","B2"]
  ],
  chunks:[
    "feel guilty about ___",
    "own up to what I did",
    "offer a sincere apology",
    "make up for ___",
    "put things right",
    "learn from the mistake",
    "clear my conscience"
  ],
  frames:[
    "I once felt guilty because I ___",
    "At first, I tried to ___, but then ___",
    "I admitted that ___",
    "To make amends, I ___",
    "The other person responded by ___ «-ing»",
    "That experience taught me to ___"
  ]
},
{
  id:33, cat:"moral",
  q:"Why do you think there is so much suffering in the world?",
  note:"suffer <b>from</b> + illness/problem; suffer <b>because of</b> + cause",
  vocab:[
    ["suffering","physical or emotional pain","B2"],
    ["injustice","a situation that is unfair or morally wrong","B2"],
    ["poverty","the condition of having very little money","B1"],
    ["conflict","serious disagreement or fighting","B2"],
    ["greed","a selfish desire for more than you need","C1"],
    ["inequality","an unfair difference between groups","C1"],
    ["free will","the ability to choose your own actions","C1"],
    ["alleviate","make pain or a problem less severe","C1"]
  ],
  chunks:[
    "suffer because of ___",
    "beyond anyone's control",
    "caused by human choices",
    "an unfair distribution of ___",
    "look away from suffering",
    "ease someone else's pain",
    "do what is within our power"
  ],
  frames:[
    "I think much suffering comes from ___",
    "Some suffering is caused by ___, while some ___",
    "It is difficult to understand why ___",
    "We may not be able to prevent ___, but we can ___",
    "People respond to suffering by ___ «-ing»",
    "The question makes me think about ___"
  ]
},
{
  id:37, cat:"moral",
  q:"Do you believe justice always wins in the end?",
  note:"believe <b>that</b> + clause / believe <b>in</b> + noun — <i>I believe in justice</i>",
  vocab:[
    ["justice","fair treatment according to what is right","B1"],
    ["fairness","the quality of treating people equally","B1"],
    ["accountability","being held responsible for your actions","C1"],
    ["corruption","dishonest use of power for personal gain","B2"],
    ["consequence","a result of an action","B2"],
    ["prevail","succeed after a struggle","C1"],
    ["impunity","freedom from punishment for wrongdoing","C1"],
    ["restore","bring back something that was lost","C1"]
  ],
  chunks:[
    "justice wins in the end",
    "get away with wrongdoing",
    "be held accountable",
    "the truth eventually comes out",
    "a fair outcome",
    "fight for justice",
    "lose faith in the system"
  ],
  frames:[
    "I do / don't believe justice always wins because ___",
    "In the short term, ___ may ___, but eventually ___",
    "One example that gives me hope is ___",
    "Sometimes people get away with ___",
    "Justice is more likely to prevail when ___",
    "Even when justice fails, we should ___"
  ]
},
{
  id:39, cat:"moral",
  q:"How do you know inside when you have made the right decision?",
  note:"know <b>that</b> + clause / feel + adjective — <i>I feel certain that I chose well</i>",
  vocab:[
    ["decision","a choice made after thinking","A2"],
    ["instinct","an immediate feeling that guides you","B2"],
    ["conscience","your inner sense of right and wrong","C1"],
    ["relief","the feeling when worry or difficulty ends","B1"],
    ["certainty","the state of being completely sure","B2"],
    ["uneasy","slightly worried because something feels wrong","B2"],
    ["align","match or agree with something","C1"],
    ["second-guess","doubt a decision after making it","C1"]
  ],
  chunks:[
    "feel right inside",
    "listen to my conscience",
    "sleep well at night",
    "match my values",
    "have no guarantee",
    "second-guess my choice",
    "accept the consequences"
  ],
  frames:[
    "I know a decision is right when ___",
    "Usually I feel ___ after choosing well",
    "I ask myself whether the choice ___",
    "Even a right decision can feel difficult because ___",
    "If my conscience feels uneasy, I ___",
    "Sometimes I only know it was right after ___"
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
{
  id:45, cat:"nature",
  q:"Have you ever seen something in nature that left you speechless?",
  note:"leave someone + adjective — <i>the view left me speechless</i>",
  vocab:[
    ["speechless","so surprised or moved that you cannot speak","B2"],
    ["awe","deep wonder mixed with respect","C1"],
    ["spectacular","extremely impressive to look at","B2"],
    ["witness","see an important or unusual event happen","B2"],
    ["overwhelming","so powerful that it is difficult to process","B2"],
    ["majestic","beautiful, powerful, and impressive","C1"],
    ["glimpse","a brief look at something","C1"],
    ["take in","fully notice and understand what you see","B2"]
  ],
  chunks:[
    "leave me completely speechless",
    "take my breath away",
    "stand there in silence",
    "a once-in-a-lifetime sight",
    "struggle to take it all in",
    "photos couldn't capture it",
    "stay with me forever"
  ],
  frames:[
    "I was left speechless when I saw ___",
    "It happened while I was ___ «-ing»",
    "At first, I couldn't believe ___",
    "The sight was so ___ that ___",
    "No photograph could show ___",
    "That moment made me feel ___"
  ]
},
{
  id:47, cat:"nature",
  q:"What is your favorite time of day, and what do you like about it?",
  note:"what I like <b>about</b> it is + noun / that-clause",
  vocab:[
    ["dawn","the time when daylight first appears","B2"],
    ["sunrise","the time when the sun comes up","A2"],
    ["dusk","the fading light just after sunset","C1"],
    ["atmosphere","the feeling or mood of a place or time","B2"],
    ["peaceful","quiet and calm","A2"],
    ["unwind","relax after work or effort","B2"],
    ["productive","able to complete a lot of useful work","B1"],
    ["stillness","complete calm with little movement or sound","C1"]
  ],
  chunks:[
    "first thing in the morning",
    "just before sunset",
    "the world feels quiet",
    "have the day ahead of me",
    "wind down after ___",
    "the golden light",
    "my favourite part of the day"
  ],
  frames:[
    "My favourite time of day is ___",
    "What I like about it is ___",
    "At that time, the light / air feels ___",
    "I usually spend it ___ «-ing»",
    "It gives me a chance to ___",
    "If I miss that time, I feel ___"
  ]
},
{
  id:49, cat:"nature",
  q:"How do you explain the beauty of a sunset? Is it just science?",
  note:"explain something <b>as</b> / explain something <b>through</b> — <i>science explains it through light</i>",
  vocab:[
    ["sunset","the time when the sun disappears below the horizon","A2"],
    ["horizon","the line where land or sea appears to meet the sky","B1"],
    ["wavelength","the distance between waves of light or sound","C1"],
    ["scatter","send light in many different directions","C1"],
    ["beauty","the quality of giving pleasure to the senses or mind","A2"],
    ["explanation","a reason that makes something understandable","B1"],
    ["wonder","a feeling of amazement and curiosity","B2"],
    ["reduce","make something seem smaller or less important","B2"]
  ],
  chunks:[
    "light scattering through the atmosphere",
    "paint the sky with colour",
    "explain how but not why",
    "more than a scientific process",
    "fill us with wonder",
    "see beauty in ___",
    "two explanations can both be true"
  ],
  frames:[
    "Science explains a sunset by ___ «-ing»",
    "That explanation does / doesn't reduce its beauty because ___",
    "Knowing how it works makes me ___",
    "A sunset is more than ___; it is also ___",
    "Beauty may come from the way we ___",
    "For me, science and wonder ___"
  ]
},
{
  id:50, cat:"nature",
  q:"Have you ever experienced a miracle or something you couldn't explain?",
  note:"something <b>that</b> I couldn't explain — a defining relative clause",
  vocab:[
    ["miracle","an extraordinary event believed to have divine cause","B2"],
    ["explain","give a reason for how or why something happened","A2"],
    ["coincidence","two surprising events happening together by chance","B2"],
    ["unlikely","not expected to happen","B1"],
    ["mysterious","difficult or impossible to understand","B2"],
    ["divine","connected with God or a god","C1"],
    ["intervention","action taken to change what is happening","C1"],
    ["skeptical","not easily convinced that something is true","C1"]
  ],
  chunks:[
    "against all the odds",
    "have no explanation for ___",
    "more than a coincidence",
    "happen at exactly the right moment",
    "change what I believed",
    "remain skeptical about ___",
    "leave the question open"
  ],
  frames:[
    "I once experienced something that ___",
    "It seemed impossible because ___",
    "Some people would call it ___, but I ___",
    "I couldn't explain how ___",
    "The experience made me believe / wonder that ___",
    "Even now, I still don't know whether ___"
  ]
},
{
  id:51, cat:"nature",
  q:"Why do you think people are naturally drawn to the ocean?",
  note:"be drawn <b>to</b> + noun — <i>people are drawn to the sound of waves</i>",
  vocab:[
    ["ocean","the enormous body of salt water covering much of Earth","A2"],
    ["shore","the land along the edge of the sea","B1"],
    ["tide","the regular rise and fall of the sea","B2"],
    ["vast","extremely large and open","C1"],
    ["horizon","the distant line where sea and sky seem to meet","B1"],
    ["rhythmic","having a regular repeated pattern or sound","C1"],
    ["drawn to","strongly attracted or interested in","B2"],
    ["primordial","existing from the earliest time","C1"]
  ],
  chunks:[
    "be drawn to the ocean",
    "waves rolling onto the shore",
    "as far as the eye can see",
    "feel small beside it",
    "a sense of freedom",
    "the rhythm of the waves",
    "both calming and frightening"
  ],
  frames:[
    "I think people are drawn to the ocean because ___",
    "The sound of the waves makes us ___",
    "Standing beside something so vast can ___",
    "For me, the ocean represents ___",
    "It is calming, but it can also ___",
    "My strongest memory of the ocean is ___"
  ]
},
{
  id:52, cat:"nature",
  q:"Do you think art and beauty are important for human survival?",
  note:"important <b>for</b> + noun / important <b>to</b> + person — <i>art is important for well-being</i>",
  vocab:[
    ["survival","the state of continuing to live or exist","B1"],
    ["beauty","a quality that brings pleasure or wonder","A2"],
    ["art","creative work such as painting, music, or poetry","A2"],
    ["essential","completely necessary","B2"],
    ["well-being","physical and emotional health","B2"],
    ["expression","the act of showing a thought or feeling","B2"],
    ["resilience","the ability to recover from difficulty","C1"],
    ["nourish","support the growth or health of body or mind","C1"]
  ],
  chunks:[
    "more than a luxury",
    "meet a basic human need",
    "help people survive hardship",
    "express what words cannot",
    "nourish the human spirit",
    "a world without art",
    "survive physically but not emotionally"
  ],
  frames:[
    "I think art is / isn't essential because ___",
    "Humans can survive without ___, but they may not ___",
    "During difficult times, art helps people ___",
    "Beauty contributes to our well-being by ___ «-ing»",
    "A world without art would feel ___",
    "For me, the strongest example is ___"
  ]
},
{
  id:55, cat:"nature",
  q:"Do you think animals have souls?",
  note:"think <b>that</b> + clause / believe <b>in</b> + noun — <i>I believe that animals have inner lives</i>",
  vocab:[
    ["soul","the spiritual part of a living being","B2"],
    ["consciousness","awareness of yourself and the world","C1"],
    ["emotion","a feeling such as joy, fear, or love","B1"],
    ["instinct","natural behaviour that is not learned","B2"],
    ["bond","a strong emotional connection","B2"],
    ["sentient","able to experience feelings and sensations","C1"],
    ["spiritual","connected with the soul or sacred things","B2"],
    ["afterlife","a life believed to continue after death","B2"]
  ],
  chunks:[
    "have an inner life",
    "form deep bonds",
    "show love and grief",
    "act on instinct",
    "be aware of themselves",
    "deserve moral consideration",
    "continue after death"
  ],
  frames:[
    "I do / don't think animals have souls because ___",
    "When animals ___, it suggests that they ___",
    "A soul might mean ___",
    "Humans and animals are similar in that both ___",
    "We may never be able to prove ___",
    "Whatever we believe, animals should ___"
  ]
},
{
  id:56, cat:"nature",
  q:"What does the word \"peace\" feel like to you?",
  note:"feel <b>like</b> + noun / -ing — <i>peace feels like breathing freely</i>",
  vocab:[
    ["peace","calm without conflict, fear, or worry","A2"],
    ["calm","a quiet and relaxed state","A2"],
    ["stillness","complete quiet and lack of movement","C1"],
    ["relief","the feeling when worry or pain ends","B1"],
    ["security","the feeling of being safe and protected","B2"],
    ["harmony","a peaceful and balanced relationship","B2"],
    ["serenity","a deeply calm and untroubled state","C1"],
    ["tension","a feeling of worry or tightness","B2"]
  ],
  chunks:[
    "feel at peace",
    "breathe without fear",
    "quiet inside my mind",
    "let go of tension",
    "be safe with the people I love",
    "a moment of complete stillness",
    "peace within / peace around us"
  ],
  frames:[
    "To me, peace feels like ___",
    "If peace had a sound, it would be ___",
    "I feel at peace when ___",
    "Peace is not only the absence of ___; it is also ___",
    "The place where I feel most peaceful is ___",
    "I create peace in my daily life by ___ «-ing»"
  ]
},
{
  id:58, cat:"nature",
  q:"If you could perfectly paint one memory, what would it be?",
  note:"second conditional — <b>If</b> you could…, what <b>would</b> it be?",
  vocab:[
    ["memory","something you remember from the past","A2"],
    ["capture","record or express a moment successfully","B2"],
    ["detail","a small part of a scene or experience","A2"],
    ["vivid","clear, bright, and detailed in the mind","C1"],
    ["nostalgic","feeling warm sadness about the past","C1"],
    ["scene","a view or moment that could be pictured","B1"],
    ["preserve","keep something safe and unchanged","B2"],
    ["palette","the range of colours used by an artist","C1"]
  ],
  chunks:[
    "capture a memory on canvas",
    "remember every detail",
    "bring the moment back to life",
    "use warm / bright colours",
    "freeze one moment in time",
    "show the feeling of ___",
    "keep the memory alive"
  ],
  frames:[
    "If I could paint one memory, it would be ___",
    "The scene would show ___",
    "I would use ___ colours to express ___",
    "The most important detail would be ___",
    "I chose this memory because ___",
    "Looking at the painting would make me feel ___"
  ]
},
{
  id:59, cat:"nature",
  q:"Why do you think flowers make people happy?",
  note:"make + person + adjective — <i>flowers make a room feel cheerful</i>",
  vocab:[
    ["flower","the colourful part of a plant","A1"],
    ["bloom","open into a flower","B2"],
    ["fragrance","a pleasant smell","B2"],
    ["colourful","having many bright colours","A2"],
    ["cheerful","noticeably happy and positive","B1"],
    ["symbolise","represent an idea or feeling","C1"],
    ["gesture","a small action that expresses a feeling","B2"],
    ["brighten","make a place or person feel happier","B2"]
  ],
  chunks:[
    "brighten up a room",
    "give someone flowers",
    "a sign of love / care",
    "fresh colours and scents",
    "mark a special occasion",
    "remind us of new life",
    "lift someone's mood"
  ],
  frames:[
    "I think flowers make people happy because ___",
    "Their colours / fragrance can ___",
    "Giving flowers is a way of ___ «-ing»",
    "Flowers often symbolise ___",
    "The flower I like most is ___ because ___",
    "A room feels different when ___"
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
{
  id:63, cat:"people",
  q:"Have you ever felt completely alone, even in a crowded room?",
  note:"feel alone <b>even when</b> + clause — <i>I felt alone even when people surrounded me</i>",
  vocab:[
    ["alone","without connection or support from others","A2"],
    ["lonely","sad because you feel disconnected from people","A2"],
    ["crowded","full of many people","A2"],
    ["isolated","separated from other people","B2"],
    ["belong","feel accepted as part of a group","B1"],
    ["disconnected","not feeling emotionally linked to others","B2"],
    ["invisible","feeling unnoticed or unimportant","B2"],
    ["alienated","made to feel that you do not belong","C1"]
  ],
  chunks:[
    "feel alone in a crowd",
    "have no one to talk to",
    "feel like an outsider",
    "be surrounded by people",
    "hide how I really feel",
    "reach out to someone",
    "find a sense of belonging"
  ],
  frames:[
    "I felt completely alone when ___",
    "Even though I was surrounded by ___, I ___",
    "What made me feel disconnected was ___",
    "I wished someone would ___",
    "The feeling began to change when ___",
    "Now, when someone seems alone, I ___"
  ]
},
{
  id:65, cat:"people",
  q:"Do you think we need other people to be truly happy?",
  note:"need someone <b>to</b> + base verb / need + noun — <i>we need people to support us</i>",
  vocab:[
    ["happiness","the state of feeling happy and satisfied","A2"],
    ["companionship","a friendly relationship that prevents loneliness","C1"],
    ["independent","able to live without relying heavily on others","B1"],
    ["connection","a close relationship or shared feeling","B1"],
    ["belonging","the feeling of being accepted in a group","B2"],
    ["solitude","time spent alone, often peacefully","C1"],
    ["depend on","need someone or something for support","B1"],
    ["self-sufficient","able to provide what you need by yourself","C1"]
  ],
  chunks:[
    "need other people around us",
    "be happy on my own",
    "share life with someone",
    "a sense of belonging",
    "depend too much on others",
    "enjoy my own company",
    "balance connection and solitude"
  ],
  frames:[
    "I think we do / don't need others to be happy because ___",
    "People give us ___ that we cannot give ourselves",
    "I can enjoy being alone, but ___",
    "Too much dependence on others can ___",
    "The relationship that adds most to my happiness is ___",
    "True happiness may require both ___ and ___"
  ]
},
{
  id:67, cat:"people",
  q:"Have you ever sacrificed something important for another person?",
  note:"sacrifice something <b>for</b> someone / give up something <b>to</b> + base verb",
  vocab:[
    ["sacrifice","give up something valuable for a greater reason","B2"],
    ["give up","stop having or doing something","B1"],
    ["selfless","putting another person's needs before your own","C1"],
    ["commitment","a promise or duty that you continue to honour","B2"],
    ["compromise","accept less in order to reach agreement","B2"],
    ["resent","feel angry about something unfair","C1"],
    ["worthwhile","valuable enough to justify the effort or cost","B2"],
    ["put first","treat someone or something as the top priority","B1"]
  ],
  chunks:[
    "give up ___ for someone",
    "put their needs first",
    "make a difficult sacrifice",
    "be worth the cost",
    "have mixed feelings about ___",
    "do it without expecting repayment",
    "look back with no regret"
  ],
  frames:[
    "I once sacrificed ___ for ___",
    "I gave it up so that they could ___",
    "The decision was difficult because ___",
    "At the time, I felt ___",
    "It was / wasn't worth it because ___",
    "The experience changed our relationship by ___ «-ing»"
  ]
},
{
  id:69, cat:"people",
  q:"Do you think true, unconditional love exists?",
  note:"love someone <b>despite</b> + noun / -ing — <i>love them despite their faults</i>",
  vocab:[
    ["unconditional","given without limits or requirements","C1"],
    ["condition","something that must happen before another thing can happen","B1"],
    ["acceptance","welcoming someone as they are","B2"],
    ["devotion","deep love and loyalty","C1"],
    ["boundary","a limit that protects safety and respect","B2"],
    ["flaw","a weakness or fault in someone's character","B2"],
    ["endure","continue through a difficult period","C1"],
    ["reciprocal","given and received by both sides","C1"]
  ],
  chunks:[
    "love someone no matter what",
    "accept someone as they are",
    "love without conditions",
    "set healthy boundaries",
    "stand by someone through ___",
    "expect love in return",
    "separate love from approval"
  ],
  frames:[
    "I believe unconditional love does / doesn't exist because ___",
    "To love someone unconditionally means ___",
    "You can love someone and still ___",
    "Healthy love needs boundaries when ___",
    "The closest example I know is ___",
    "Perhaps all human love has the condition that ___"
  ]
},
{
  id:71, cat:"people",
  q:"Have you ever felt completely misunderstood by the people around you?",
  note:"be misunderstood <b>by</b> someone — passive voice focuses on the person affected",
  vocab:[
    ["misunderstood","not understood correctly by others","B2"],
    ["assumption","a belief formed without enough evidence","B2"],
    ["explain","make an idea clear to someone","A2"],
    ["express","communicate a thought or feeling","B1"],
    ["frustrated","annoyed because you cannot change or explain something","B1"],
    ["misinterpret","understand something in the wrong way","C1"],
    ["clarify","make something easier to understand","B2"],
    ["validate","show that someone's feelings make sense","C1"]
  ],
  chunks:[
    "feel completely misunderstood",
    "jump to the wrong conclusion",
    "put my feelings into words",
    "see things from my point of view",
    "explain myself clearly",
    "feel heard at last",
    "clear up the misunderstanding"
  ],
  frames:[
    "I felt misunderstood when ___",
    "The people around me thought ___, but actually ___",
    "I tried to explain that ___",
    "What I needed them to understand was ___",
    "The misunderstanding was resolved when ___",
    "That experience taught me to ___"
  ]
},
{
  id:74, cat:"people",
  q:"When was the last time someone showed you mercy (did not punish you when you deserved it)?",
  note:"show someone mercy / have mercy <b>on</b> someone",
  vocab:[
    ["mercy","kind treatment instead of deserved punishment","B2"],
    ["punish","make someone suffer a consequence for wrongdoing","B1"],
    ["deserve","be worthy of a result because of your actions","B1"],
    ["lenient","less strict than expected","C1"],
    ["compassion","kind concern for someone in difficulty","C1"],
    ["consequence","a result of an action","B2"],
    ["spare","choose not to cause someone pain or punishment","C1"],
    ["second chance","an opportunity to try again after failure","B1"]
  ],
  chunks:[
    "show mercy to someone",
    "deserve a punishment",
    "let me off with a warning",
    "give me a second chance",
    "learn without being punished",
    "be grateful for their kindness",
    "show the same mercy to others"
  ],
  frames:[
    "Someone showed me mercy when I ___",
    "I expected them to ___, but instead they ___",
    "I probably deserved ___ because ___",
    "Their mercy made me feel ___",
    "I responded by ___ «-ing»",
    "Since then, I have tried to ___"
  ]
},
{
  id:75, cat:"people",
  q:"Do you think it is possible to love your enemies?",
  note:"possible <b>to</b> + base verb / treat someone <b>with</b> + noun",
  vocab:[
    ["enemy","someone who opposes or wants to harm you","B1"],
    ["love","deep care for another person's good","A2"],
    ["forgive","stop holding anger against someone","B1"],
    ["compassion","care for another person's suffering","C1"],
    ["reconcile","restore a friendly relationship after conflict","C1"],
    ["resentment","lasting anger caused by unfair treatment","C1"],
    ["humanise","see someone as a full human being","C1"],
    ["boundary","a limit that protects safety and respect","B2"]
  ],
  chunks:[
    "love your enemies",
    "wish someone well",
    "refuse to seek revenge",
    "see their humanity",
    "protect yourself with boundaries",
    "forgive without trusting again",
    "break the cycle of hatred"
  ],
  frames:[
    "I think loving an enemy means ___",
    "It may be possible to ___ without ___ «-ing»",
    "Forgiving someone doesn't require ___",
    "The hardest part would be ___",
    "Love could begin by ___ «-ing»",
    "If more people chose this, ___ might ___"
  ]
},
{
  id:77, cat:"people",
  q:"What do you think happens when a community stops caring for each other?",
  note:"stop <b>caring</b> — <i>stop + -ing</i> means an activity ends",
  vocab:[
    ["community","people connected by a place or shared identity","B1"],
    ["care","give attention and help to someone","A2"],
    ["trust","belief that people will act honestly and reliably","B1"],
    ["cooperation","working together toward a shared result","B2"],
    ["isolation","separation from other people","B2"],
    ["neglect","failure to give needed care or attention","C1"],
    ["fragment","break into separate disconnected parts","C1"],
    ["solidarity","unity and support within a group","C1"]
  ],
  chunks:[
    "look out for one another",
    "lose trust in each other",
    "fall through the cracks",
    "become isolated from ___",
    "a breakdown in community",
    "share responsibility for ___",
    "rebuild a sense of belonging"
  ],
  frames:[
    "When a community stops caring, ___ begins to ___",
    "People may feel ___ because ___",
    "The first thing that disappears is ___",
    "Those most affected are ___",
    "A caring community should ___",
    "We can rebuild connection by ___ «-ing»"
  ]
},
{
  id:78, cat:"people",
  q:"Who has been the greatest source of strength in your life?",
  note:"a source <b>of</b> + noun — <i>my family has been a source of strength</i>",
  vocab:[
    ["strength","the ability to face difficulty","B1"],
    ["support","help and encouragement","B1"],
    ["encourage","give someone confidence or hope","B1"],
    ["rely on","trust someone to help when needed","B1"],
    ["resilient","able to recover after hardship","C1"],
    ["steadfast","loyal and dependable through difficulty","C1"],
    ["mentor","an experienced person who guides someone","B2"],
    ["inspiration","someone or something that gives you ideas and courage","B2"]
  ],
  chunks:[
    "a source of strength",
    "stand by me through ___",
    "believe in me when ___",
    "keep me going",
    "lend me their strength",
    "teach me to be resilient",
    "know I can rely on ___"
  ],
  frames:[
    "My greatest source of strength has been ___",
    "They supported me when ___",
    "What makes them strong is ___",
    "Whenever I wanted to give up, they ___",
    "Because of them, I learned to ___",
    "I try to pass that strength on by ___ «-ing»"
  ]
},
{
  id:79, cat:"people",
  q:"If you could heal one broken relationship in the world, what would it be?",
  note:"relationship <b>between</b> A <b>and</b> B — use parallel nouns on both sides",
  vocab:[
    ["relationship","the connection between people or groups","A2"],
    ["broken","badly damaged and no longer working well","A2"],
    ["heal","become healthy or peaceful again","B2"],
    ["reconcile","restore a relationship after conflict","C1"],
    ["division","serious disagreement between groups","B2"],
    ["hostility","strong unfriendliness or opposition","C1"],
    ["dialogue","serious conversation aimed at understanding","B2"],
    ["common ground","beliefs or interests shared by opposing sides","B2"]
  ],
  chunks:[
    "heal the relationship between ___ and ___",
    "end years of hostility",
    "open an honest dialogue",
    "listen to each other's pain",
    "find common ground",
    "rebuild trust slowly",
    "create peace for future generations"
  ],
  frames:[
    "I would heal the relationship between ___ and ___",
    "It became broken because ___",
    "Both sides have suffered from ___",
    "Healing would need to begin with ___",
    "The greatest obstacle is ___",
    "If they reconciled, the world would ___"
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
},
{
  id:83, cat:"future",
  q:"Do you believe in things you cannot see? (For example: wind, love, gravity?)",
  note:"believe <b>in</b> + noun means accept that it exists or has value",
  vocab:[
    ["invisible","unable to be seen","B1"],
    ["evidence","facts or signs showing that something is true","B1"],
    ["effect","a change caused by something else","B1"],
    ["gravity","the force that pulls objects toward Earth","B1"],
    ["faith","trust in something not fully seen or proved","B2"],
    ["detect","discover something that is difficult to notice","B2"],
    ["abstract","existing as an idea rather than a physical object","C1"],
    ["tangible","clear or real enough to touch or notice","C1"]
  ],
  chunks:[
    "believe in something unseen",
    "see its effects",
    "feel it even if ___",
    "evidence of its existence",
    "not visible to the eye",
    "measure it scientifically",
    "know something through experience"
  ],
  frames:[
    "I believe in ___ even though I can't see it",
    "I know it exists because ___",
    "We cannot see ___, but we can observe ___",
    "For me, experience is / isn't enough evidence because ___",
    "Some invisible things can be measured, while ___",
    "Not seeing something doesn't necessarily mean ___"
  ]
},
{
  id:84, cat:"future",
  q:"What is your greatest hope for your children or future children?",
  note:"hope <b>that</b> + clause / hope <b>for</b> + noun — <i>I hope that they find meaningful work</i>",
  vocab:[
    ["future","the time that has not happened yet","A2"],
    ["hope","something good you want to happen","A2"],
    ["opportunity","a chance to do or achieve something","B1"],
    ["secure","safe and protected from danger or worry","B1"],
    ["fulfilment","the feeling that your life is meaningful","C1"],
    ["resilient","able to recover from difficulty","C1"],
    ["compassionate","kind and concerned about others","C1"],
    ["flourish","grow and live successfully","C1"]
  ],
  chunks:[
    "my greatest hope for them",
    "grow up to be ___",
    "have opportunities I didn't have",
    "find their own path",
    "feel safe and loved",
    "make a positive difference",
    "live a meaningful life"
  ],
  frames:[
    "My greatest hope is that they ___",
    "More than success, I want them to ___",
    "I hope they have the courage to ___",
    "Even when life is difficult, I hope ___",
    "I would try to give them ___",
    "Ultimately, their life should be ___"
  ]
},
{
  id:86, cat:"future",
  q:"How does your belief in eternity change the way you make decisions in your daily life?",
  note:"change the way + clause — <i>it changes the way I use my time</i>",
  vocab:[
    ["eternity","time without beginning or end","B2"],
    ["belief","an idea accepted as true","B1"],
    ["temporary","lasting for only a limited time","B1"],
    ["consequence","a result of a choice or action","B2"],
    ["perspective","a way of understanding what matters","B2"],
    ["accountable","responsible for your actions","C1"],
    ["lasting","continuing for a long time","B2"],
    ["eternal","existing forever","B2"]
  ],
  chunks:[
    "believe in eternity",
    "see life from a longer perspective",
    "focus on what lasts",
    "think about the consequences",
    "hold temporary things lightly",
    "be accountable for my choices",
    "change how I treat people"
  ],
  frames:[
    "Believing in eternity changes the way I ___",
    "It reminds me that ___ is temporary",
    "Before making a decision, I consider ___",
    "I try to invest more in ___ than in ___",
    "Without this belief, I might ___",
    "In daily life, this means ___ «-ing»"
  ]
},
{
  id:89, cat:"future",
  q:"What is something amazing in the world that you think science will never be able to fully explain?",
  note:"be able <b>to</b> + base verb — future: <i>science will be able to explain…</i>",
  vocab:[
    ["science","the study of the world through observation and testing","A2"],
    ["explain","make clear how or why something happens","A2"],
    ["mystery","something difficult or impossible to understand","B1"],
    ["consciousness","awareness of yourself and the world","C1"],
    ["limit","the point beyond which something cannot go","B1"],
    ["subjective","based on personal feelings or experience","C1"],
    ["phenomenon","an event or fact that can be observed","C1"],
    ["comprehend","understand something fully","C1"]
  ],
  chunks:[
    "fully explain how ___",
    "remain a mystery",
    "reach the limits of science",
    "measure the physical process",
    "capture the human experience",
    "discover more in the future",
    "explain how but not what it means"
  ],
  frames:[
    "I don't think science will ever fully explain ___",
    "Scientists may understand how ___, but not why ___",
    "The difficult part to measure is ___",
    "Perhaps future discoveries will ___",
    "I could change my mind if ___",
    "For me, the mystery makes ___ more amazing"
  ]
},
{
  id:91, cat:"future",
  q:"Do you think humanity is moving toward something better?",
  note:"move <b>toward</b> + noun / -ing — <i>we are moving toward greater equality</i>",
  vocab:[
    ["humanity","all human beings considered together","B2"],
    ["progress","change toward a better condition","B1"],
    ["decline","a gradual movement toward something worse","B2"],
    ["advance","a development or improvement","B2"],
    ["inequality","unfair differences between people or groups","C1"],
    ["cooperate","work together toward a shared goal","B1"],
    ["optimistic","expecting the future to be good","B2"],
    ["trajectory","the direction in which something develops","C1"]
  ],
  chunks:[
    "move toward a better future",
    "make progress in ___",
    "repeat the same mistakes",
    "take one step forward and two back",
    "solve problems together",
    "judge by the long-term trend",
    "have reason for hope"
  ],
  frames:[
    "I think humanity is moving toward ___",
    "We have made progress in ___, but ___",
    "Compared with the past, people today ___",
    "The greatest threat to progress is ___",
    "I feel optimistic / pessimistic because ___",
    "A better future depends on our ability to ___"
  ]
},
{
  id:92, cat:"future",
  q:"Have you ever had a dream (while sleeping) that felt like a message?",
  note:"a dream <b>that</b> felt like ___ — a defining relative clause",
  vocab:[
    ["dream","images and events experienced while sleeping","A2"],
    ["message","an idea communicated to someone","A2"],
    ["vivid","extremely clear and detailed","C1"],
    ["symbol","an object or image representing an idea","B1"],
    ["subconscious","the part of the mind outside conscious awareness","C1"],
    ["interpret","decide what something means","B2"],
    ["premonition","a feeling that something will happen in the future","C1"],
    ["linger","remain in your mind for a long time","C1"]
  ],
  chunks:[
    "have a vivid dream",
    "feel like a message",
    "wake up with a strong feeling",
    "try to interpret the symbols",
    "stay with me all day",
    "come true later",
    "my subconscious processing ___"
  ],
  frames:[
    "I once had a dream in which ___",
    "It felt like a message because ___",
    "When I woke up, I felt ___",
    "I interpreted the dream as ___",
    "It may simply have been my mind ___ «-ing»",
    "The dream still stays with me because ___"
  ]
},
{
  id:93, cat:"future",
  q:"What does the word \"eternity\" make you think of?",
  note:"make someone <b>think of</b> + noun / -ing — <i>it makes me think of endless time</i>",
  vocab:[
    ["eternity","time that never ends","B2"],
    ["infinite","having no end or limit","B2"],
    ["timeless","not affected by the passage of time","C1"],
    ["forever","for all future time","A2"],
    ["afterlife","life believed to continue after death","B2"],
    ["endless","continuing without stopping","B1"],
    ["comprehend","understand something fully","C1"],
    ["vastness","the quality of being extremely large","C1"]
  ],
  chunks:[
    "time without end",
    "go on forever",
    "beyond human understanding",
    "the vastness of the universe",
    "life after death",
    "both comforting and frightening",
    "difficult to imagine"
  ],
  frames:[
    "The word eternity makes me think of ___",
    "I imagine it as ___",
    "The idea feels ___ because ___",
    "It is difficult for the human mind to ___",
    "If time never ended, ___",
    "For me, eternity is connected with ___"
  ]
},
{
  id:94, cat:"future",
  q:"How does thinking about the next life bring you comfort in difficult times?",
  note:"bring someone comfort <b>by</b> + -ing — <i>it comforts me by giving suffering a limit</i>",
  vocab:[
    ["next life","an existence believed to follow this life","B2"],
    ["comfort","a feeling of calm during sadness or pain","B1"],
    ["eternal","lasting forever","B2"],
    ["reunion","meeting loved ones again after separation","B2"],
    ["temporary","lasting only for a limited time","B1"],
    ["suffering","physical or emotional pain","B2"],
    ["assurance","a confident promise or sense of certainty","C1"],
    ["perspective","a way of understanding what matters","B2"]
  ],
  chunks:[
    "believe in the next life",
    "know that suffering is temporary",
    "hope to be reunited with ___",
    "put present pain in perspective",
    "look beyond this life",
    "hold on during hard times",
    "find comfort in the promise of ___"
  ],
  frames:[
    "Thinking about the next life comforts me because ___",
    "It reminds me that ___ is temporary",
    "I find hope in the idea that ___",
    "When I lose someone, I ___",
    "This belief helps me face ___",
    "Even when I have questions, I hold on to ___"
  ]
},
{
  id:97, cat:"future",
  q:"What is a story from your childhood that taught you about hope?",
  note:"teach someone <b>about</b> + noun / teach someone <b>to</b> + base verb",
  vocab:[
    ["childhood","the period when you were a child","A2"],
    ["story","a description of real or imaginary events","A1"],
    ["hope","belief that something good may happen","A2"],
    ["lesson","something useful learned through a story or experience","B1"],
    ["character","a person in a story","A2"],
    ["overcome","succeed in dealing with a problem","B2"],
    ["persevere","continue despite difficulty","C1"],
    ["inspire","give someone hope or motivation","B1"]
  ],
  chunks:[
    "a story I heard as a child",
    "face an impossible situation",
    "refuse to give up",
    "hope against the odds",
    "stay with me as I grew up",
    "teach me that ___",
    "remember it when life is hard"
  ],
  frames:[
    "A childhood story that taught me hope was ___",
    "It was about someone who ___",
    "At first, the character ___, but then ___",
    "The hopeful part was when ___",
    "It taught me that ___",
    "I still remember this story whenever ___"
  ]
},
{
  id:98, cat:"future",
  q:"Do you think perfect justice is possible in this world?",
  note:"possible <b>to</b> + base verb / possible <b>for</b> + person + to + base verb",
  vocab:[
    ["justice","fair treatment based on what is right","B1"],
    ["perfect","completely correct and without fault","A2"],
    ["fair","treating people equally and reasonably","A2"],
    ["bias","an unfair preference for or against someone","B2"],
    ["evidence","facts used to decide what is true","B1"],
    ["impartial","not favouring either side","C1"],
    ["accountability","responsibility for actions and consequences","C1"],
    ["ideal","a perfect standard that may be difficult to achieve","B2"]
  ],
  chunks:[
    "achieve perfect justice",
    "treat every case fairly",
    "remove all bias",
    "know the complete truth",
    "hold powerful people accountable",
    "work toward an ideal",
    "better than accepting injustice"
  ],
  frames:[
    "I think perfect justice is / isn't possible because ___",
    "A perfectly just system would need to ___",
    "Human judgement is limited by ___",
    "Even when we cannot reach perfection, we should ___",
    "Justice improves when ___",
    "For me, the most important part of justice is ___"
  ]
}

];
