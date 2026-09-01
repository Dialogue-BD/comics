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
}

];
