/* ---------------------------------------------------------------------------
   Ethnographic Interviews — content bank
   ---------------------------------------------------------------------------
   Edit this file to add scenarios. index.html never needs to change.

   Themes mirror the red/blue cross-cultural cards in /cross-cultural-coms/.
   BLUE = Western pole, RED = Bengali/Eastern pole. Neither is "right": the
   whole activity depends on both poles getting a full, dignified set of rings.

   A scenario is one full pass through the method:
     OBSERVE a behaviour -> ASK a good question -> LISTEN to three people ->
     TRIANGULATE what they share -> MAP behaviour to value to belief to worldview.

   Scripts are written to be SPOKEN. Keep them 55-85 words, B1-B2, with
   contractions and false starts — they are interview answers, not essays.
   Every claim the student must find has to be audible in at least one line.
--------------------------------------------------------------------------- */

const THEMES = {
  time:    { label: 'Time',      icon: '\u{1F550}', hue: '193 86% 64%' },
  me:      { label: 'The Self',  icon: '\u{1F9CD}', hue: '32 94% 62%'  },
  truth:   { label: 'Truth',     icon: '\u{1F4AC}', hue: '265 84% 70%' },
  boss:    { label: 'Authority', icon: '\u{1FA91}', hue: '155 68% 54%' },
  opinion: { label: 'Opinion',   icon: '\u{1F64B}', hue: '340 82% 66%' },
  problem: { label: 'Conflict',  icon: '\u{1F342}', hue: '12 88% 62%'  }
};

/* Why a question fails. Shown as coaching when a student picks a bad one. */
const FLAWS = {
  closed: {
    label: 'Closed question',
    short: 'Yes / no',
    coach: 'This one can be answered with a single word — “Yes.” “Sometimes.” Then the interview ' +
           'is over and you have learned nothing. An ethnographic question has to be impossible ' +
           'to answer in one word.',
    fix: 'Trade “Do you…?” for “Tell me about a time you…” or “Walk me through…”.',
    label_bn: 'বন্ধ প্রশ্ন',
    short_bn: 'হ্যাঁ / না',
    coach_bn:
      'এই প্রশ্নের উত্তর এক কথাতেই দেওয়া যায় — “হ্যাঁ।” “মাঝে মাঝে।” তারপর কথা শেষ, আর আপনি কিছুই জানলেন না। নৃতাত্ত্বিক প্রশ্ন এমন হতে হবে যার উত্তর এক কথায় দেওয়া অসম্ভব।',
    fix_bn: '“আপনি কি…?” বাদ দিয়ে বলুন “এমন একটা সময়ের কথা বলুন যখন…” বা “শুরু থেকে শেষ পর্যন্ত বলুন…”।'
  },
  leading: {
    label: 'Leading question',
    short: 'Answer built in',
    coach: 'You have hidden your own conclusion inside the question, so the person can only agree ' +
           'with you or fight you. Either way you get your own opinion back, not theirs.',
    fix: 'Take the judgment out. Ask what happened, not whether it was bad.',
    label_bn: 'ইঙ্গিতবাহী প্রশ্ন',
    short_bn: 'উত্তর আগেই বলা',
    coach_bn:
      'আপনি নিজের সিদ্ধান্তটাই প্রশ্নের ভেতরে লুকিয়ে রেখেছেন, তাই তিনি হয় আপনার সঙ্গে একমত হবেন, নয় তর্ক করবেন। দুই ক্ষেত্রেই আপনি নিজের মতটাই ফেরত পাবেন, তাঁর মত নয়।',
    fix_bn: 'বিচারটা সরিয়ে ফেলুন। জিজ্ঞেস করুন কী ঘটেছিল, সেটা খারাপ ছিল কি না তা নয়।'
  },
  generalizing: {
    label: 'Generalizing question',
    short: 'Asks about a whole culture',
    coach: 'Nobody is an expert on 340 million people. Ask a person about a whole culture and they ' +
           'will guess, joke, or repeat a stereotype back to you.',
    fix: 'Shrink it to one person and one event: “the last time YOU…”.',
    label_bn: 'ঢালাও প্রশ্ন',
    short_bn: 'গোটা সংস্কৃতি নিয়ে',
    coach_bn:
      '৩৪ কোটি মানুষ সম্পর্কে কেউই বিশেষজ্ঞ নন। কাউকে গোটা একটা সংস্কৃতি নিয়ে জিজ্ঞেস করলে তিনি আন্দাজ করবেন, ঠাট্টা করবেন, নয়তো চেনা একটা ধারণা আপনাকে ফিরিয়ে দেবেন।',
    fix_bn: 'ছোট করে আনুন — একজন মানুষ, একটি ঘটনা: “শেষবার আপনি নিজে যখন…”।'
  },
  abstract: {
    label: 'Abstract question',
    short: 'Asks for a theory',
    coach: 'This asks for a philosophy, not an experience. People are unreliable narrators of their ' +
           'own values — but they are excellent narrators of what they actually did last Tuesday. ' +
           'Start with the behaviour; the value comes out on its own.',
    fix: 'Ask for a story first. You can ask “why” after they have told it.',
    label_bn: 'বিমূর্ত প্রশ্ন',
    short_bn: 'তত্ত্ব চায়',
    coach_bn:
      'এটি অভিজ্ঞতা নয়, দর্শন চায়। নিজের মূল্যবোধ নিয়ে মানুষ খুব নির্ভরযোগ্য বক্তা নন — কিন্তু গত মঙ্গলবার তাঁরা আসলে কী করেছিলেন, তা তাঁরা চমৎকার বলতে পারেন। আচরণ দিয়ে শুরু করুন; মূল্যবোধ নিজেই বেরিয়ে আসবে।',
    fix_bn: 'আগে ঘটনাটা শুনতে চান। “কেন” জিজ্ঞেস করবেন তিনি বলা শেষ করার পরে।'
  }
};

/* Spradley's descriptive question types — the label on a GOOD question. */
const QTYPES_BN = {'grand': 'বড় পরিসরের প্রশ্ন', 'mini': 'ছোট পরিসরের প্রশ্ন', 'example': 'উদাহরণ চাওয়া প্রশ্ন', 'experience': 'অভিজ্ঞতার প্রশ্ন', 'native': 'তাঁদের নিজস্ব শব্দের প্রশ্ন'};
const QTYPES = {
  grand:      'Grand-tour question',
  mini:       'Mini-tour question',
  example:    'Example question',
  experience: 'Experience question',
  native:     'Native-term question'
};

/* What a sentence dropped on the wrong layer actually is. */
const CHIP_FAULTS = {
  restatement: {
    label: 'That is the behaviour again',
    coach: 'You have taken the visible action and given it a new name. Nothing has been explained. ' +
           'Ask: what would a person have to CARE about for this to feel normal?',
    label_bn: 'এটি আবার সেই আচরণটিই',
    coach_bn:
      'চোখে দেখা কাজটিকেই আপনি নতুন একটা নাম দিয়েছেন। কিছুই ব্যাখ্যা হয়নি। ' +
      'জিজ্ঞেস করুন — এটি স্বাভাবিক মনে হওয়ার জন্য একজন মানুষকে কোন জিনিসটির প্রতি যত্নবান হতে হবে?'
  },
  judgment: {
    label: 'That is a judgment, not a value',
    coach: 'This tells me how you feel about them. A value statement says what THEY rank highest — ' +
           'stated so that they would nod and say “yes, that is what I was doing.”',
    label_bn: 'এটি একটি বিচার, মূল্যবোধ নয়',
    coach_bn:
      'এটি বলে দিচ্ছে তাঁদের সম্পর্কে আপনি কী ভাবেন। মূল্যবোধের বাক্য বলে, তাঁরা নিজেরা কোনটিকে সবার উপরে রাখেন — ' +
      'এমনভাবে লেখা, যা শুনে তাঁরা মাথা নেড়ে বলবেন “হ্যাঁ, আমি তো এটাই করছিলাম।”'
  },
  stereotype: {
    label: 'That is a stereotype',
    coach: 'It explains everything and predicts nothing, and you cannot check it against a single ' +
           'thing the three people said. Throw it out and go back to their words.',
    label_bn: 'এটি একটি গৎবাঁধা ধারণা',
    coach_bn:
      'এটি সব কিছু ব্যাখ্যা করে অথচ কিছুই আগে থেকে বলতে পারে না, আর তিনজনের বলা একটি কথার সঙ্গেও ' +
      'এটি মিলিয়ে দেখা যায় না। এটি বাদ দিন, তাঁদের নিজের কথায় ফিরে যান।'
  }
};

const SCENARIOS = [

/* ========================================================================= 1 */
{
  id: 'dinner-ends-at-eight',
  theme: 'time',
  title: 'The Dinner That Ends at Eight',
  setting: 'Chicago · a colleague invites you home',
  observation:
    'Your American colleague invites you to dinner. The message says: “Come at six — I’ll have to ' +
    'push everyone out by eight, I’ve got an early start.” At 8:05 he stands up, thanks everyone, ' +
    'and walks his guests to the door. Everybody smiles. Nobody looks hurt.',
  noticing:
    'In Rajshahi, telling your guest in advance when he must leave would be an insult. Here it was ' +
    'written in the invitation — and taken as a kindness.',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: 'যে নিমন্ত্রণ আটটায় শেষ হয়',
  observation_bn:
    'আপনার আমেরিকান সহকর্মী আপনাকে রাতের খাবারে ডাকলেন। বার্তায় লেখা: “ছয়টায় আসবেন — আটটার মধ্যে সবাইকে বিদায় দিতে হবে, কাল আমাকে খুব সকালে উঠতে হবে।” আটটা বেজে পাঁচ মিনিটে তিনি উঠে দাঁড়ালেন, সবাইকে ধন্যবাদ দিলেন, আর অতিথিদের দরজা পর্যন্ত এগিয়ে দিলেন। সবাই হাসছে। কেউ মনে কষ্ট পায়নি।',
  noticing_bn:
    'রাজশাহীতে অতিথিকে আগেই বলে দেওয়া যে কখন তাকে যেতে হবে — সেটি অপমান। এখানে কথাটি নিমন্ত্রণেই লেখা ছিল, আর সবাই সেটিকে ভদ্রতা হিসেবেই নিয়েছে।',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '📩', t: '“Come at six”' },
    { ico: '🕗', t: '8:05 — he stands up' },
    { ico: '🚪', t: 'Everyone smiles and goes' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'In Chicago, your time is your own property.',
  chain: [
    'One separate life each',
    'My hours belong to me',
    'Let people plan their evening',
    'Say when it will end'
  ],
  questions: [
    { q: 'Tell me about the last dinner you hosted. Walk me through it, from the invitation to the last guest.',
      ok: true, type: 'grand',
      why: 'It cannot be answered in one word, it asks for one real evening rather than a theory, and ' +
           'the end time will come up inside the story — where you can ask about it without making him defend it.' ,
      why_bn:
        'এর উত্তর এক কথায় দেওয়া যায় না, এটি তত্ত্ব নয় — একটি সত্যিকারের সন্ধ্যার কথা জানতে চায়, আর শেষ হওয়ার সময়টা গল্পের ভেতরেই চলে আসবে, যেখানে তাঁকে আত্মপক্ষ সমর্থন করতে না দিয়েই আপনি জিজ্ঞেস করতে পারবেন।' },
    { q: 'Do Americans always end their parties at a fixed time? Is that something everybody here does?', flaw: 'closed' },
    { q: 'Why do Americans care more about their schedule than about their guests? Does the clock always win?', flaw: 'leading' },
    { q: 'What does time mean in Western civilisation? How would you describe the Western idea of a day?', flaw: 'abstract' }
  ],

  speakers: [
    { name: 'Dana', age: 34, job: 'project manager', city: 'Chicago',
      voice: { rate: 1.0, pitch: 1.12, gender: 'female' },
      script:
        'Honestly? Putting the end time in the invite is the polite part. If I say six to eight, you ' +
        'know what you are agreeing to. You can say yes without wondering if you are trapped until ' +
        'midnight. My sister does open-ended parties and I love her, but I never know whether to eat ' +
        'first, or book a ride, or… yeah. Six to eight is a promise I can actually keep.',
      gist: 'An end time is a promise she can keep. You can say yes without wondering when you may leave.' },
    { name: 'Mark', age: 58, job: 'high-school teacher', city: 'Columbus, Ohio',
      voice: { rate: 0.94, pitch: 0.82, gender: 'male' },
      script:
        'I get up at five to run, so by nine I am useless. And look, if I do not say it out loud, I end ' +
        'up sitting there at eleven watching the clock, being a terrible host inside my own head. ' +
        'Better to be honest at the start. Nobody has ever taken it badly. I think people are relieved, ' +
        'actually. They get their evening back too.',
      gist: 'If he does not say it out loud he sits there at eleven, being a bad host inside his own head.' },
    { name: 'Priya', age: 27, job: 'nurse', city: 'Seattle',
      voice: { rate: 1.06, pitch: 1.22, gender: 'female' },
      script:
        'My parents are from Pune, so I grew up with the other way — people just stay, and staying is ' +
        'the whole point. It took me years here to stop feeling rude about it. But my friends plan their ' +
        'week in blocks. Giving them a start and a finish is… it is respecting that their Saturday ' +
        'belongs to them, not to me. That is how they hear it.',
      gist: 'She grew up the other way. Giving a start and a finish is respecting that their Saturday is theirs.' }
  ],

  claims: [
    { text: 'An end time lets the guest plan the rest of their own evening.', shared: true, text_bn: 'শেষ হওয়ার সময় জানা থাকলে অতিথি নিজের বাকি সন্ধ্যাটা গুছিয়ে নিতে পারেন।' },
    { text: 'Saying it out loud in advance is felt as honesty, not rejection.', shared: true, text_bn: 'আগেই মুখে বলে দেওয়াকে এখানে সততা মনে করা হয়, প্রত্যাখ্যান নয়।' },
    { text: 'Each person’s evening is treated as theirs to give — and to keep.', shared: true, text_bn: 'প্রত্যেকের সন্ধ্যা তার নিজের — সে চাইলে দেবে, না চাইলে রেখে দেবে।' },
    { text: 'They have to get up at five o’clock to go running.', shared: false, text_bn: 'তাঁদের দৌড়াতে যাওয়ার জন্য ভোর পাঁচটায় উঠতে হয়।', who: 'Mark' },
    { text: 'Their parents come from India and did it the opposite way.', shared: false, text_bn: 'তাঁদের বাবা-মা ভারত থেকে এসেছেন এবং ঠিক উল্টোটা করতেন।', who: 'Priya' },
    { text: 'Their sister hosts parties with no ending at all.', shared: false, text_bn: 'তাঁদের বোনের বাড়ির দাওয়াত কখন শেষ হয় তার ঠিক নেই।', who: 'Dana' }
  ],

  rings: {
    behavior:  'Announcing when a social evening will end — and ending it.',
    value:     'Predictability is a form of respect: people should be able to plan their own time.',
    belief:    'A person’s time belongs to that person, and an obligation you did not agree to is not a real obligation.',
    worldview: 'The individual is the basic unit of the world — a separate life, finite, and personally accountable for how it is spent.'
  },
  distractors: [
    { text: 'They prefer to go to bed early.', fault: 'restatement' },
    { text: 'Western people are cold and do not enjoy company.', fault: 'stereotype' },
    { text: 'It is rude to rush your guests out of the door.', fault: 'judgment' }
  ],

  expert:
    'Notice what the end time is doing. It is not shortening the friendship — it is making the evening ' +
    'safe to accept. All three answers treat an evening as something each person owns a share of, which ' +
    'can be offered in a measured amount and must then be handed back. Once time is private property, ' +
    'announcing the boundary is exactly as polite as knocking before you enter a room.',

  contrast: {
    behavior:  'Leaving the end of an evening unsaid — and pressing the guest to stay longer.',
    value:     'Staying is the proof. Time given without limit is the visible form of the relationship.',
    belief:    'Time belongs to the bond, not to the person; obligation grows out of the relationship itself, not out of an agreement.',
    worldview: 'A person exists inside a web of relations — the web is what is real, and the self is a place in it.',
    note:
      'Both sets of rings make sense. Both hosts are generous. The Chicago host and the Rajshahi host ' +
      'are each giving the guest the most valuable thing their world has — and they are opposite things.'
  }
},

/* ========================================================================= 2 */
{
  id: 'splitting-the-bill',
  theme: 'me',
  title: 'Six Friends, Six Payments',
  setting: 'Austin, Texas · the end of a meal',
  observation:
    'Six American friends finish dinner. One bill arrives. Every person takes out a phone, works out ' +
    'what they ate, and pays their own share — including the man who suggested the restaurant in the ' +
    'first place. There is no argument about who pays. There is no reaching for the bill at all.',
  noticing:
    'At home, the fight to pay is half the pleasure of the meal. Here nobody even reached.',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: 'ছয় বন্ধু, ছয়টি বিল',
  observation_bn:
    'ছয়জন আমেরিকান বন্ধু খাওয়া শেষ করলেন। একটি বিল এলো। প্রত্যেকে ফোন বের করে হিসাব করলেন কে কী খেয়েছেন, আর নিজের অংশটুকু দিলেন — যিনি রেস্তোরাঁটির কথা বলেছিলেন, তিনিও। কে দেবে তা নিয়ে কোনো তর্ক হলো না। বিলটি কেউ হাতে তুলেই নিলেন না।',
  noticing_bn:
    'আমাদের এখানে বিল দেওয়ার জন্য কাড়াকাড়িটাই খাওয়ার অর্ধেক আনন্দ। এখানে কেউ হাতই বাড়াল না।',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '🧾', t: 'One bill, six friends' },
    { ico: '📱', t: 'Each works out their share' },
    { ico: '🤝', t: 'Nobody reaches for it' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'An open account is a hierarchy in disguise.',
  chain: [
    'We choose our own ties',
    'A debt makes us unequal',
    'Keep the ground flat between us',
    'Everybody pays their own share'
  ],
  questions: [
    { q: 'Think about the last time you ate out with friends. Take me through what happened with the bill.',
      ok: true, type: 'experience',
      why: 'One meal, one memory, one person. He will describe the small moves — the phones, the app, ' +
           'who spoke first — and those details are the data.' ,
      why_bn:
        'একটি খাওয়া, একটি স্মৃতি, একজন মানুষ। তিনি ছোট ছোট নড়াচড়াগুলো বলবেন — ফোন, অ্যাপ, কে আগে কথা বলল — আর ওই খুঁটিনাটিই আপনার তথ্য।' },
    { q: 'Why do Americans keep money so separate from friends? Does nobody here want to owe anyone?', flaw: 'leading' },
    { q: 'Do you usually split the bill when you eat out with friends? Does everyone pay their own share?', flaw: 'closed' },
    { q: 'Why do Western people never pay for each other? What is the money rule across your culture?', flaw: 'generalizing' }
  ],

  speakers: [
    { name: 'Trevor', age: 22, job: 'engineering student', city: 'Austin',
      voice: { rate: 1.08, pitch: 0.95, gender: 'male' },
      script:
        'I mean, I am a student, so — I had the cheap pasta and a water. If we divide by six I am paying ' +
        'for someone’s steak. But it is not only money. If Josh covers me, then next time I am the guy ' +
        'who owes Josh, and I would rather just be… even. It takes two seconds on the app. Then we are ' +
        'done and nobody is keeping score.',
      gist: 'He does not want to be the one who owes Josh. Paying his own part keeps the two of them even.' },
    { name: 'Alicia', age: 41, job: 'dental hygienist', city: 'Austin',
      voice: { rate: 0.98, pitch: 1.18, gender: 'female' },
      script:
        'My uncle would fight you for that bill. He would be genuinely offended. And I love him, but ' +
        'there is a thing underneath it, right? Every time he pays, he is a little bit above you. With ' +
        'my friends I do not want anyone above or below. We are the same. Splitting it keeps us the same. ' +
        'It is not about seven dollars.',
      gist: 'Her uncle would fight for the bill — and every time he pays, he is a little bit above you.' },
    { name: 'Greg', age: 36, job: 'software tester', city: 'Denver',
      voice: { rate: 0.92, pitch: 0.78, gender: 'male' },
      script:
        'Someone paying for me makes me itchy, to be honest. I feel like I have got homework. Now I owe ' +
        'you a dinner, and I have to remember it, and if I forget I am the bad friend. Just let me pay ' +
        'my part and go home clean. If I want to give you something I will give it to you as a gift, on ' +
        'purpose, not by accident over a table.',
      gist: 'Being paid for makes him itchy, like homework. He would rather give on purpose than owe by accident.' }
  ],

  claims: [
    { text: 'Being paid for creates a debt that has to be carried and remembered.', shared: true, text_bn: 'কেউ আপনার হয়ে দিলে একটি ঋণ তৈরি হয়, যা মনে রাখতে হয় ও বয়ে বেড়াতে হয়।' },
    { text: 'Paying for someone puts you, quietly, a step above them.', shared: true, text_bn: 'কারও হয়ে টাকা দিলে আপনি নিঃশব্দে তার এক ধাপ উপরে উঠে যান।' },
    { text: 'Friends should stand level with each other, and splitting keeps them level.', shared: true, text_bn: 'বন্ধুরা সমান থাকবে — আর ভাগ করে দিলে সেই সমতাটুকু থাকে।' },
    { text: 'They are a student with very little money.', shared: false, text_bn: 'তিনি ছাত্র, হাতে টাকা খুবই কম।', who: 'Trevor' },
    { text: 'Their uncle would be insulted by a split bill.', shared: false, text_bn: 'বিল ভাগ করলে তাঁর চাচা অপমানিত বোধ করতেন।', who: 'Alicia' },
    { text: 'They would rather give a gift deliberately than by accident.', shared: false, text_bn: 'তিনি বরং ভেবেচিন্তে উপহার দেবেন, হঠাৎ করে নয়।', who: 'Greg' }
  ],

  rings: {
    behavior:  'Each person calculates and pays their own share, including the host.',
    value:     'Equality between friends — nobody should be carrying an unpaid obligation to anybody.',
    belief:    'An unreturned favour puts two people on different levels, and a friendship of unequals is already damaged.',
    worldview: 'People are separate, self-responsible agents who choose their ties freely, and a chosen tie must never harden into a debt.'
  },
  distractors: [
    { text: 'They like using payment apps on their phones.', fault: 'restatement' },
    { text: 'Americans do not really love their friends.', fault: 'stereotype' },
    { text: 'It is shameful to let a guest pay for their own food.', fault: 'judgment' }
  ],

  expert:
    'Listen to what they are protecting. Not the money — Trevor says it is not only money, Alicia says ' +
    'it is not about seven dollars, Greg calls the favour “homework”. What they are protecting is a flat ' +
    'surface between two people. In this world an open account is a hierarchy in disguise, so it gets ' +
    'closed immediately, every time, on purpose.',

  contrast: {
    behavior:  'One person takes the whole bill, and the others compete to stop him.',
    value:     'Generosity that binds. The senior, the inviter, or the one with more pays — and is honoured for it.',
    belief:    'The open account IS the relationship. A debt that is never fully settled is what keeps two people tied together.',
    worldview: 'People are born into obligation, not into independence; to owe and be owed is what it means to belong to someone.',
    note:
      'Here is the harder question. If an open debt is what holds people together, what holds people ' +
      'together in a world where every debt is closed the same night?'
  }
},

/* ========================================================================= 3 */
{
  id: 'disagreeing-in-the-meeting',
  theme: 'truth',
  title: 'The Junior Who Said No',
  setting: 'Boston · a Monday planning meeting',
  observation:
    'The director finishes presenting his plan. A twenty-six-year-old employee, two years in the job, ' +
    'says in front of eight people: “Honestly, I don’t think that will work — here’s why.” He gives ' +
    'three reasons. The director listens, writes something down, and says, “Good point. Thanks.” The ' +
    'meeting continues. Nobody looks embarrassed.',
  noticing:
    'Everything you know says that young man has just damaged himself, his boss, and the room. ' +
    'Apparently not one of them thinks so.',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: 'যে জুনিয়র “না” বলেছিল',
  observation_bn:
    'পরিচালক তাঁর পরিকল্পনা উপস্থাপন শেষ করলেন। ছাব্বিশ বছরের এক কর্মী, যিনি দু’বছর ধরে কাজ করছেন, আট জনের সামনে বললেন: “সত্যি বলতে, আমার মনে হয় না এটা কাজ করবে — কেন, বলছি।” তিনি তিনটি কারণ দিলেন। পরিচালক শুনলেন, কিছু একটা লিখে নিলেন, আর বললেন, “ভালো বলেছ। ধন্যবাদ।” সভা চলতে থাকল। কাউকে অস্বস্তিতে দেখা গেল না।',
  noticing_bn:
    'আপনার জানা সব কিছু বলছে, ওই তরুণ নিজের, তার বসের আর পুরো ঘরের ক্ষতি করে ফেলেছেন। অথচ ওখানে কেউ তা মনে করছে না।',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '📊', t: 'The director shows his plan' },
    { ico: '✋', t: 'A junior says “that won’t work”' },
    { ico: '📝', t: '“Good point. Thanks.”' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'The idea and the man holding it are two different things.',
  chain: [
    'Reality is public, and checkable',
    'A plan is not a person',
    'The best idea should win',
    'Disagree out loud, with reasons'
  ],
  questions: [
    { q: 'Tell me about a time you disagreed with your manager in front of others. What happened afterwards?',
      ok: true, type: 'experience',
      why: 'It asks for one remembered event with an ending. The “what happened afterwards” is the best ' +
           'part — consequences are where a culture shows its real rules.' ,
      why_bn:
        'এটি এমন একটি মনে থাকা ঘটনা চায় যার একটি শেষ আছে। “তারপর কী হলো” অংশটাই সবচেয়ে দামি — পরিণতির ভেতরেই একটি সংস্কৃতির আসল নিয়ম ধরা পড়ে।' },
    { q: 'Do you disagree with your boss often? Is that something people here are comfortable doing?', flaw: 'closed' },
    { q: 'Why do Americans have no respect for seniority? Is age just worth nothing in an office here?', flaw: 'leading' },
    { q: 'Is honesty more important than harmony? Which one should a good organisation choose in the end?', flaw: 'abstract' }
  ],

  speakers: [
    { name: 'Caleb', age: 29, job: 'data analyst', city: 'Boston',
      voice: { rate: 1.04, pitch: 0.9, gender: 'male' },
      script:
        'If I see the problem and I say nothing, and then it breaks in March — that is on me. Staying ' +
        'quiet is not polite, it is just… hiding. And it is not personal. I am not saying he is a bad ' +
        'director, I am saying the number on slide four is wrong. Those are two completely different ' +
        'sentences. He knows that.',
      gist: 'Seeing the problem and saying nothing is hiding. The director and the number on slide four are two different things.' },
    { name: 'Nadia', age: 45, job: 'operations director', city: 'Boston',
      voice: { rate: 0.96, pitch: 1.08, gender: 'female' },
      script:
        'From my side of the table? Silence terrifies me. If eight people nod at everything, I am flying ' +
        'blind. I need someone to hit the plan hard while it is still cheap to change. Tone matters, sure ' +
        '— do not perform, do not make a speech. But bring me the objection. The plan is not my child. ' +
        'The plan is a draft.',
      gist: 'Silence terrifies her. Hit the plan hard while it is still cheap to change — the plan is a draft, not her child.' },
    { name: 'Wes', age: 52, job: 'logistics supervisor', city: 'Pittsburgh',
      voice: { rate: 0.9, pitch: 0.76, gender: 'male' },
      script:
        'I had one boss, years ago, who could not take it. You spoke up, you paid for it later. Everyone ' +
        'learned to shut up and the place ran into the ground. So no, it is not automatic here either. ' +
        'But the way it is supposed to work is: best argument wins, and it does not matter who is holding ' +
        'it. Kid or vice-president.',
      gist: 'He had a boss who could not take it, and the place ran into the ground. Best argument wins, whoever is holding it.' }
  ],

  claims: [
    { text: 'The proposal and the person who made it are treated as two separate things.', shared: true, text_bn: 'প্রস্তাব আর প্রস্তাবদাতা — এই দুটিকে আলাদা জিনিস ধরা হয়।' },
    { text: 'Silence is read as a risk being hidden, not as respect being shown.', shared: true, text_bn: 'চুপ থাকাকে সম্মান নয়, বরং সমস্যা লুকানো হিসেবে ধরা হয়।' },
    { text: 'An idea is meant to be tested out loud, and whoever holds the best argument wins.', shared: true, text_bn: 'মতামত প্রকাশ্যে যাচাই হওয়ার কথা, আর যার যুক্তি সবচেয়ে ভালো তারই জেতার কথা।' },
    { text: 'They once worked for a boss who punished people for speaking up.', shared: false, text_bn: 'তিনি একসময় এমন বসের অধীনে কাজ করেছেন যিনি মুখ খুললে শাস্তি দিতেন।', who: 'Wes' },
    { text: 'They sit on the manager’s side of the table and have to make the decision.', shared: false, text_bn: 'তিনি টেবিলের ম্যানেজারের পাশে বসেন এবং সিদ্ধান্ত তাঁকেই নিতে হয়।', who: 'Nadia' },
    { text: 'They are worried about being blamed if the problem appears later.', shared: false, text_bn: 'পরে সমস্যা দেখা দিলে দোষ তাঁর ঘাড়ে পড়বে — এই ভয় তাঁর আছে।', who: 'Caleb' }
  ],

  rings: {
    behavior:  'Contradicting a senior person publicly, with reasons, and being thanked for it.',
    value:     'Candour — the best available idea should win, whoever is holding it.',
    belief:    'Truth is found by testing claims openly; a person and that person’s proposal are not the same object.',
    worldview: 'Reality is public and checkable by anyone, and authority is a role someone performs, not a rank they are.'
  },
  distractors: [
    { text: 'They enjoy arguing in meetings.', fault: 'restatement' },
    { text: 'Westerners are individualistic and rude to their elders.', fault: 'stereotype' },
    { text: 'A junior employee should never embarrass his director.', fault: 'judgment' }
  ],

  expert:
    'Everything rests on one sentence of Caleb’s: “I am not saying he is a bad director, I am saying the number ' +
    'on slide four is wrong — those are two completely different sentences.” A whole worldview sits in ' +
    'that split. Where the idea detaches from the person, attacking the idea costs the person nothing, so ' +
    'open challenge becomes cheap, fast, even kind. Wes is the honest exception: the rule is the ' +
    'ideal, and plenty of American offices break it.',

  contrast: {
    behavior:  'Saying nothing in the room — and raising the problem privately, afterwards.',
    value:     'Face — the dignity of every person in the room is carried by everyone in the room.',
    belief:    'A person and their proposal are joined; wound the plan in public and you have wounded the man holding it.',
    worldview: 'Truth travels through relationships. It reaches its destination by a private word, a trusted third person, ' +
               'an indirect phrase — and it arrives intact.',
    note:
      'This pair does real damage at work, in both directions. The Bengali employee is heard as having ' +
      'no opinions. The American manager is heard as having no manners. Neither is true.'
  }
},

/* ========================================================================= 4 */
{
  id: 'the-boss-stacks-chairs',
  theme: 'boss',
  title: 'The Director Stacking Chairs',
  setting: 'Denver · after an office event',
  observation:
    'The event finishes. The country director — the most senior person in the building — is stacking ' +
    'chairs beside the newest intern and carrying boxes out to a car. The intern calls him “sir”. He ' +
    'laughs and says, “It’s Dave.” Later he makes the coffee for the people cleaning up.',
  noticing:
    'Where is his distance? A man with that position should not be visible carrying anything.',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: 'পরিচালক চেয়ার গোছাচ্ছেন',
  observation_bn:
    'অনুষ্ঠান শেষ হলো। কান্ট্রি ডিরেক্টর — ভবনের সবচেয়ে বড় পদের মানুষ — সবচেয়ে নতুন ইন্টার্নের পাশে দাঁড়িয়ে চেয়ার গোছাচ্ছেন আর বাক্স বয়ে গাড়িতে তুলছেন। ইন্টার্ন তাঁকে “স্যার” ডাকলেন। তিনি হেসে বললেন, “আমি ডেভ।” পরে যাঁরা পরিষ্কার করছিলেন, তিনি তাঁদের জন্য চা বানালেন।',
  noticing_bn:
    'তাঁর দূরত্বটা কোথায়? ওই পদের একজন মানুষকে তো কিছু বয়ে নিতে দেখাই যাওয়ার কথা নয়।',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '🪑', t: 'The director stacks chairs' },
    { ico: '🙋', t: 'The intern calls him “sir”' },
    { ico: '☕', t: '“It’s Dave.” He makes the coffee' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'Rank here is rented, never owned.',
  chain: [
    'Nobody is above anyone by nature',
    'A title is a job, not a kind of person',
    'Respect is earned by doing',
    'The boss carries the chairs'
  ],
  questions: [
    { q: 'Think of a manager you really respected. Tell me about something you actually saw them do.',
      ok: true, type: 'example',
      why: 'Asking for a concrete example beats asking for a definition. “Something you saw them do” ' +
           'forces a scene, and the scene tells you what respect is made of here.' ,
      why_bn:
        'সংজ্ঞা চাওয়ার চেয়ে একটি বাস্তব উদাহরণ চাওয়া ভালো। “আপনি তাঁকে যা করতে দেখেছেন” — এটি একটি দৃশ্য টেনে আনে, আর ওই দৃশ্যই বলে দেয় এখানে সম্মান জিনিসটা কী দিয়ে তৈরি।' },
    { q: 'Do you respect your boss? Would you say the managers here are people you look up to?', flaw: 'closed' },
    { q: 'Why do Western bosses pretend to be equal to their staff? Is the whole thing a performance?', flaw: 'leading' },
    { q: 'Is hierarchy good or bad for an organisation? What is the right distance between ranks?', flaw: 'abstract' }
  ],

  speakers: [
    { name: 'Dave', age: 49, job: 'country director', city: 'Denver',
      voice: { rate: 0.95, pitch: 0.8, gender: 'male' },
      script:
        'The title is a job, not a size. I do budgets and I take the blame — that is the job. It does not ' +
        'mean my arms stopped working. And honestly, if I stand there watching a twenty-two-year-old carry ' +
        'boxes while I hold a coffee, what exactly have I taught her about this place? Whatever I do at ' +
        'six o’clock is the real policy.',
      gist: 'The title is a job, not a size. Whatever he does at six o’clock is the real policy.' },
    { name: 'Kim', age: 24, job: 'intern', city: 'Denver',
      voice: { rate: 1.05, pitch: 1.25, gender: 'female' },
      script:
        'I called him sir and he looked genuinely uncomfortable. Where I grew up you would never — but ' +
        'here, the ones who want the title are usually the ones who are bad at the job. The good ones just ' +
        'work next to you. I respect him way more for stacking chairs than I would if he had stood there ' +
        'being important.',
      gist: 'The ones who want the title are usually bad at the job. She respects him more for stacking chairs.' },
    { name: 'Roberto', age: 38, job: 'warehouse manager', city: 'Phoenix',
      voice: { rate: 0.99, pitch: 0.88, gender: 'male' },
      script:
        'I have got fourteen people under me and I still drive the forklift some days. You lose the floor ' +
        'fast if you stop touching it. Also — they will not follow you because of the badge. Not really. ' +
        'They follow you because they have seen you do the hard shift. That is where it comes from. You ' +
        'have to earn it again every year.',
      gist: 'He still drives the forklift. They follow you because they have seen you do the hard shift, not because of the badge.' }
  ],

  claims: [
    { text: 'Authority is treated as a function you perform, not a status you carry.', shared: true, text_bn: 'কর্তৃত্বকে একটি দায়িত্ব হিসেবে দেখা হয়, বহন করার মর্যাদা হিসেবে নয়।' },
    { text: 'Respect has to be earned by visible contribution, and it can be lost.', shared: true, text_bn: 'সম্মান চোখে দেখা যায় এমন কাজ দিয়ে অর্জন করতে হয়, আর তা হারানোও যায়।' },
    { text: 'Standing apart from the work is read as arrogance, not as dignity.', shared: true, text_bn: 'কাজ থেকে দূরে দাঁড়িয়ে থাকাকে মর্যাদা নয়, অহংকার হিসেবে পড়া হয়।' },
    { text: 'They still drive the forklift with their own team.', shared: false, text_bn: 'তিনি এখনো নিজের দলের সঙ্গে ফর্কলিফট চালান।', who: 'Roberto' },
    { text: 'They felt uncomfortable when someone called them “sir”.', shared: false, text_bn: 'কেউ তাঁকে “স্যার” ডাকলে তাঁর অস্বস্তি লাগে।', who: 'Dave' },
    { text: 'They come from a place where you would never use a manager’s first name.', shared: false, text_bn: 'তিনি এমন জায়গা থেকে এসেছেন যেখানে ম্যানেজারকে নাম ধরে ডাকা যায় না।', who: 'Kim' }
  ],

  rings: {
    behavior:  'The most senior person does the lowest-status work in public and refuses the honorific.',
    value:     'Earned respect — what you do outranks what you are called.',
    belief:    'A title describes a job, not a kind of person; people differ in function, never in worth.',
    worldview: 'No one stands above anyone else by nature. Rank is a temporary arrangement people agree to, and it has to keep justifying itself.'
  },
  distractors: [
    { text: 'He likes physical work and does not mind getting dirty.', fault: 'restatement' },
    { text: 'Americans have no sense of proper order or respect.', fault: 'stereotype' },
    { text: 'A director lowers himself by carrying boxes in front of juniors.', fault: 'judgment' }
  ],

  expert:
    'Three people, three positions — director, intern, middle manager — and all three describe rank as ' +
    'something rented rather than owned. Roberto puts the mechanism plainly: “you have to earn it again ' +
    'every year.” If rank is rented, displaying it without working is theft. That is why the honorific ' +
    'makes Dave uncomfortable rather than pleased.',

  contrast: {
    behavior:  'The senior person is seated, served and named by title, while junior staff carry the chairs.',
    value:     'Visible order. Everyone can see who stands where, and that clarity is itself a kindness.',
    belief:    'Honouring the senior honours the whole structure that holds the group together; his dignity is not his alone.',
    worldview: 'Society is a body with a head and hands. Position is given by age, role and relation — it is not a personal achievement to be re-earned.',
    note:
      'The Bengali ranking is not “respect for power”. It is a claim about where dignity lives. ' +
      'Dave finds it in the work. Rajshahi finds it in the structure.'
  }
},

/* ========================================================================= 5 */
{
  id: 'what-do-you-think',
  theme: 'opinion',
  title: '“What Do You Think?”',
  setting: 'A university classroom · Michigan',
  observation:
    'The teacher finishes the reading and asks, “So — what do you think?” Silence. He waits. Ten more ' +
    'seconds. He does not fill the gap. Then: “There’s no right answer, I actually want to know your ' +
    'opinion.” At the end of term, twenty per cent of the grade is participation.',
  noticing:
    'He is grading them for speaking before they have been taught the answer. What is he measuring?',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: '“তোমার কী মনে হয়?”',
  observation_bn:
    'শিক্ষক পড়া শেষ করে জিজ্ঞেস করলেন, “তো — তোমাদের কী মনে হয়?” নীরবতা। তিনি অপেক্ষা করলেন। আরও দশ সেকেন্ড। তিনি ফাঁকটা নিজে ভরলেন না। তারপর বললেন, “কোনো সঠিক উত্তর নেই, আমি সত্যিই তোমাদের মতামত জানতে চাই।” সেমিস্টারের শেষে নম্বরের বিশ শতাংশ আসে ক্লাসে কথা বলা থেকে।',
  noticing_bn:
    'উত্তর শেখানোর আগেই তিনি কথা বলার জন্য নম্বর দিচ্ছেন। তিনি আসলে কী মাপছেন?',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '❓', t: '“So — what do you think?”' },
    { ico: '🤫', t: 'Ten seconds of silence' },
    { ico: '💯', t: 'Speaking is a fifth of the grade' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'A thought becomes real the moment it is said out loud.',
  chain: [
    'Every mind is a source of meaning',
    'A thought is finished in public',
    'Think it out for yourself',
    'Speak before you are told'
  ],
  questions: [
    { q: 'When you ask a class ‘what do you think’, what are you hoping will happen in the next minute?',
      ok: true, type: 'grand',
      why: 'It asks the insider to describe his own intention in his own words — and you have not told ' +
           'him what the right answer is. Ask it, then stay quiet and let him fill the silence.' ,
      why_bn:
        'এটি ভেতরের মানুষটিকে তাঁর নিজের উদ্দেশ্য নিজের ভাষায় বলতে বলে — আর সঠিক উত্তরটা কী, তা আপনি তাঁকে বলে দেননি। প্রশ্নটি করে চুপ করে থাকুন, নীরবতাটা তাঁকেই ভরতে দিন।' },
    { q: 'Do you like it when students give their opinions? Is that a normal thing to want in a class?', flaw: 'closed' },
    { q: 'Why do Americans think their opinion matters so much? What does your culture teach about that?', flaw: 'generalizing' },
    { q: 'Is student-centred teaching better than teacher-centred teaching? Which one is truly correct?', flaw: 'abstract' }
  ],

  speakers: [
    { name: 'Professor Hale', age: 57, job: 'literature professor', city: 'Ann Arbor',
      voice: { rate: 0.93, pitch: 0.84, gender: 'male' },
      script:
        'I am not testing whether they remember me. I can read them my own notes — that helps nobody. ' +
        'When a student says something half-formed out loud, that is the first time the thought exists ' +
        'anywhere. Sometimes it is wrong. Wrong is fine. Wrong is a thing we can work on together. ' +
        'Silence I cannot work on.',
      gist: 'When a student says something half-formed out loud, that is the first time the thought exists. Silence he cannot work on.' },
    { name: 'Beth', age: 20, job: 'second-year student', city: 'Ann Arbor',
      voice: { rate: 1.07, pitch: 1.2, gender: 'female' },
      script:
        'The first week I was terrified. In high school I just wrote down whatever the teacher said. Now ' +
        'I am supposed to argue with the book? But you figure out that they are not asking if you are ' +
        'right, they are asking if you have actually been thinking. And once you say it out loud, you ' +
        'find out whether you believe it. That part is real.',
      gist: 'She used to write down whatever the teacher said. Now she finds out whether she believes it by saying it.' },
    { name: 'Tomás', age: 31, job: 'PhD student and teaching assistant', city: 'Ann Arbor',
      voice: { rate: 1.0, pitch: 0.92, gender: 'male' },
      script:
        'I came from a system where the professor spoke for ninety minutes and we copied it. I was a very ' +
        'good student. Then I got here and I could not do the one thing they wanted, which was to disagree ' +
        'with something. Now I teach it. I tell my students: your job is not to carry the knowledge. Your ' +
        'job is to test it and to own it.',
      gist: 'He was an excellent student in a system where you copied it down — and here he could not do the one thing that counted.' }
  ],

  claims: [
    { text: 'Speaking is treated as the evidence that thinking is happening.', shared: true, text_bn: 'কথা বলাকেই প্রমাণ ধরা হয় যে চিন্তা চলছে।' },
    { text: 'Being wrong out loud is treated as useful, not as a loss of face.', shared: true, text_bn: 'প্রকাশ্যে ভুল বলাকে কাজে লাগার মতো জিনিস ধরা হয়, মান হারানো নয়।' },
    { text: 'The student, not the teacher, is expected to own the knowledge.', shared: true, text_bn: 'জ্ঞানটা শিক্ষকের নয়, শিক্ষার্থীরই নিজের করে নেওয়ার কথা।' },
    { text: 'They were trained in a system where students copied the lecture.', shared: false, text_bn: 'তিনি এমন ব্যবস্থায় পড়েছেন যেখানে শিক্ষার্থীরা বক্তৃতা টুকে নিত।', who: 'Tomás' },
    { text: 'They were frightened during their first week of class.', shared: false, text_bn: 'ক্লাসের প্রথম সপ্তাহে তিনি ভয় পেয়েছিলেন।', who: 'Beth' },
    { text: 'They could simply read out their own notes instead.', shared: false, text_bn: 'তিনি বরং নিজের নোট থেকেই পড়ে শোনাতে পারতেন।', who: 'Professor Hale' }
  ],

  rings: {
    behavior:  'Asking for opinions, tolerating long silence, and grading students for speaking.',
    value:     'Independent reasoning is prized above faithful reproduction.',
    belief:    'Knowledge is built by the learner rather than handed over intact; an untested idea is not yet owned.',
    worldview: 'Every individual is a legitimate source of meaning, and the mind becomes real in public — by speaking, being corrected, and speaking again.'
  },
  distractors: [
    { text: 'He wants the class to be noisy and active.', fault: 'restatement' },
    { text: 'Western students are arrogant and think they know better than teachers.', fault: 'stereotype' },
    { text: 'A teacher who asks instead of explaining is not doing his job.', fault: 'judgment' }
  ],

  expert:
    'Hale gives you the mechanism in one line: “that is the first time the thought exists anywhere.” Not ' +
    '“the first time I hear it” — the first time it exists. Thinking, in this world, is not finished ' +
    'privately and then reported; it is performed in public and finished by other people. That is why ' +
    'silence gets graded down, and why Tomás — an excellent student by his own system’s measure — arrived ' +
    'unable to do the one thing that counted.',

  contrast: {
    behavior:  'Waiting for the teacher to give the answer, and writing it down exactly.',
    value:     'Faithful transmission. Receiving knowledge accurately is an achievement and a form of respect.',
    belief:    'The teacher holds what is known; an untrained opinion offered in public can mislead the class and expose the speaker.',
    worldview: 'Knowledge is an inheritance passed down a chain of teachers, and the chain must not be broken by a beginner guessing aloud.',
    note:
      'Ask yourself which system produced Tomás — and which one he is teaching now. Neither answer is ' +
      'a defeat. He needed the first one to have something to test.'
  }
},

/* ========================================================================= 6 */
{
  id: 'the-neighbours-tree',
  theme: 'problem',
  title: 'The Neighbour’s Tree',
  setting: 'A suburban street · Portland',
  observation:
    'Leaves from the neighbour’s maple keep blocking an American man’s roof gutter. He walks next door, ' +
    'knocks, and says with a smile: “Hey — your maple’s filling my gutter. Can we figure something out?” ' +
    'They talk for four minutes. They shake hands. Neither man mentions it again, and they wave at each ' +
    'other the next morning.',
  noticing:
    'He went straight to the man’s door. No relative, no mutual friend, no waiting. And the friendship survived.',


  /* Bangla for the parts a student has to read. The transcripts and the
     word-catch chips are never translated — that is the language being
     learned; these are the scaffolding around it. */
  title_bn: 'প্রতিবেশীর গাছ',
  observation_bn:
    'প্রতিবেশীর ম্যাপল গাছের পাতা বারবার এক আমেরিকান লোকের ছাদের নালা বন্ধ করে দিচ্ছে। তিনি পাশের বাড়িতে গিয়ে দরজায় টোকা দিলেন, আর হেসে বললেন: “শোনো — তোমার ম্যাপলের পাতায় আমার নালা ভরে যাচ্ছে। কিছু একটা করা যায়?” তাঁরা চার মিনিট কথা বললেন। হাত মেলালেন। এরপর কেউ আর কথাটা তোলেননি, আর পরদিন সকালে দু’জনেই হাত নেড়ে শুভেচ্ছা জানালেন।',
  noticing_bn:
    'তিনি সোজা লোকটির দরজায় গেলেন। কোনো আত্মীয় নয়, পরিচিত কেউ নয়, অপেক্ষাও নয়। আর বন্ধুত্বটাও টিকে গেল।',

  /* three tiles: the scene as a picture, before the paragraph */
  beats: [
    { ico: '🍁', t: 'His leaves fill the gutter' },
    { ico: '🚪', t: 'He knocks next door' },
    { ico: '👋', t: 'Four minutes, then a wave' }
  ],

  /* the mechanism in one line, and the same thing as a chain of four */
  punch: 'Four awkward minutes, or four awkward years.',
  chain: [
    'Conflict starts and then ends',
    'Naming a problem is half of solving it',
    'Say it early, to the person',
    'Knock on his own door'
  ],
  questions: [
    { q: 'Tell me about the last small problem you had with a neighbour. Walk me through what you did first.',
      ok: true, type: 'mini',
      why: 'A mini-tour question: one narrow, ordinary event rather than a life philosophy. “What did you ' +
           'do FIRST” is the whole prize — the first move is where the cultural rule lives.' ,
      why_bn:
        'ছোট পরিসরের প্রশ্ন: জীবনদর্শন নয়, একটি সরু সাধারণ ঘটনা। “আপনি প্রথমে কী করলেন” — এটাই আসল প্রাপ্তি, কারণ প্রথম পদক্ষেপের ভেতরেই সাংস্কৃতিক নিয়মটি বাস করে।' },
    { q: 'Do you talk to your neighbours much? Is knocking on someone’s door a normal thing to do here?', flaw: 'closed' },
    { q: 'Why are Americans so aggressive about tiny things? Do a few leaves really need a conversation?', flaw: 'leading' },
    { q: 'Should people avoid conflict whenever possible? What is the best way to handle disagreement?', flaw: 'abstract' }
  ],

  speakers: [
    { name: 'Hank', age: 61, job: 'retired electrician', city: 'Portland',
      voice: { rate: 0.91, pitch: 0.78, gender: 'male' },
      script:
        'Say it in week one and it is a gutter. Sit on it for a year and it is not a gutter any more, it ' +
        'is a grudge, and now you are two men not waving. I would rather have four awkward minutes than ' +
        'four awkward years. Anyway he did not know. Most of the time the guy has no idea there is a ' +
        'problem at all.',
      gist: 'Four awkward minutes instead of four awkward years. Most of the time the other man has no idea there is a problem.' },
    { name: 'Michelle', age: 44, job: 'bookkeeper', city: 'Portland',
      voice: { rate: 1.0, pitch: 1.15, gender: 'female' },
      script:
        'What I could not do is complain about him to the other neighbours first. That is behind his back ' +
        '— that is the version that actually damages people. Going to his door is the respectful one, even ' +
        'though it feels harder. You are treating him like an adult who can hear a normal sentence and fix ' +
        'a normal problem.',
      gist: 'Complaining to the other neighbours first is the version that actually damages people. The door treats him like an adult.' },
    { name: 'Ade', age: 33, job: 'physiotherapist', city: 'Portland',
      voice: { rate: 1.02, pitch: 0.94, gender: 'male' },
      script:
        'My mother is Nigerian and she would have sent food first, then mentioned it in three weeks. Both ' +
        'work, honestly. But here, if you go around the side, people get suspicious — what else is he not ' +
        'saying? Short and friendly and direct, and then it is closed. The problem was never about him. ' +
        'It was about a tree.',
      gist: 'His mother would have sent food first. Both work — but here, going around the side makes people suspicious.' }
  ],

  claims: [
    { text: 'Naming a problem early is believed to keep it small.', shared: true, text_bn: 'সমস্যা তাড়াতাড়ি বলে দিলে সেটি ছোট থাকে — এখানে এমনটাই বিশ্বাস।' },
    { text: 'Going directly is felt as respectful; going around a person is felt as damaging.', shared: true, text_bn: 'সরাসরি বলাকে সম্মানজনক ধরা হয়; ঘুরপথে গেলে সেটিকে ক্ষতিকর মনে করা হয়।' },
    { text: 'The problem is handled as a thing, separate from the relationship.', shared: true, text_bn: 'সমস্যাটিকে একটি আলাদা বিষয় হিসেবে সামলানো হয়, সম্পর্ক থেকে আলাদা করে।' },
    { text: 'Their mother would have sent food first and waited three weeks.', shared: false, text_bn: 'তাঁর মা হলে আগে খাবার পাঠাতেন আর তিন সপ্তাহ অপেক্ষা করতেন।', who: 'Ade' },
    { text: 'They refuse to discuss it with the other neighbours first.', shared: false, text_bn: 'তিনি আগে অন্য প্রতিবেশীদের সঙ্গে বিষয়টি নিয়ে কথা বলতে রাজি নন।', who: 'Michelle' },
    { text: 'They are retired and have lived on the street a long time.', shared: false, text_bn: 'তিনি অবসরপ্রাপ্ত এবং বহুদিন ধরে এই রাস্তায় থাকেন।', who: 'Hank' }
  ],

  rings: {
    behavior:  'Raising a complaint face to face, immediately, alone — and then closing it.',
    value:     'Directness — a problem should be named early, to the person concerned, and finished.',
    belief:    'Problems are technical objects that can be solved once they are named; two people can disagree about a thing without becoming enemies.',
    worldview: 'The social world is transparent and repairable. Conflict is an event that happens and ends, not a condition that settles over a relationship.'
  },
  distractors: [
    { text: 'He wanted his gutter cleaned.', fault: 'restatement' },
    { text: 'Western people have no patience and cannot control themselves.', fault: 'stereotype' },
    { text: 'You should never embarrass a neighbour by complaining to his face.', fault: 'judgment' }
  ],

  expert:
    'Hank does the maths for you: four awkward minutes against four awkward years. That trade only ' +
    'makes sense if conflict is an event with a beginning and an end. Watch Michelle invert the Bengali ' +
    'rule exactly — for her, going through other people is the aggressive act and knocking on the door is ' +
    'the polite one. And note Ade’s honesty: “both work.” He is not ranking the two systems. He is saying ' +
    'each one makes sense on its own street.',

  contrast: {
    behavior:  'Sending the message through a mutual friend, so that nobody has to be confronted.',
    value:     'Harmony, and the protection of face on both sides.',
    belief:    'A complaint delivered face to face creates a rupture; a trusted third person can carry the message so that nobody has to be confronted.',
    worldview: 'Relationships are the permanent thing and problems are temporary; the indirect route exists so that the permanent thing survives the temporary one.',
    /* The right-hand column on this one is NOT Bangladesh, and labelling it
       "Bengali" makes the scenario read as false rather than as a contrast:
       Bangladeshi students handle a neighbour's leaves about as directly as
       Americans do. The column is relabelled, and the note turns that
       recognition into the lesson instead of a confusion. */
    east_label:    'Where the relationship comes first',
    east_label_bn: 'যেখানে সম্পর্কই আগে',
    note:
      'Many students find this scenario the least strange of the six, and they are right to: going ' +
      'to the man’s own door is close to what they would do themselves. That is the lesson, not a ' +
      'failure of it. Directness in conflict is a dimension cultures sit anywhere along, and on ' +
      'this one Rajshahi and Portland sit nearer to each other than either sits to the column on ' +
      'the right — where a complaint about fallen leaves would never be worth the risk to a ' +
      'neighbour you must live beside for thirty years, so it travels through somebody else or is ' +
      'simply absorbed. Ask the class which of the three positions their own family takes, and ' +
      'whether it changes with who the neighbour is.'
  }
}

];
