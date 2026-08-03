const wheelData = [
  { name: "Fear", color: "#c993dd", start: -150, children: [
    { name: "Insecure", children: ["Inadequate", "Inferior"] },
    { name: "Rejected", children: ["Alienated", "Disrespected"] },
    { name: "Anxious", children: ["Overwhelmed", "Worried"] },
    { name: "Scared", children: ["Terrified", "Frightened"] }
  ]},
  { name: "Anger", color: "#ee806b", start: -90, children: [
    { name: "Mad", children: ["Enraged", "Furious"] },
    { name: "Hurt", children: ["Devastated", "Embarrassed"] },
    { name: "Threatened", children: ["Insecure", "Jealous"] },
    { name: "Distant", children: ["Suspicious", "Withdrawn"] }
  ]},
  { name: "Surprise", color: "#edae53", start: -30, children: [
    { name: "Confused", children: ["Disillusioned", "Perplexed"] },
    { name: "Startled", children: ["Shocked", "Dismayed"] },
    { name: "Amazed", children: ["Astonished", "Awe"] },
    { name: "Excited", children: ["Eager", "Energetic"] }
  ]},
  { name: "Happy", color: "#e9cf5f", start: 30, children: [
    { name: "Joyful", children: ["Liberated", "Ecstatic"] },
    { name: "Proud", children: ["Confident", "Important"] },
    { name: "Optimistic", children: ["Open", "Inspired"] },
    { name: "Peaceful", children: ["Hopeful", "Loving"] }
  ]},
  { name: "Disgust", color: "#73c989", start: 90, children: [
    { name: "Avoidance", children: ["Hesitant", "Aversion"] },
    { name: "Disapproval", children: ["Judgmental", "Loathing"] },
    { name: "Awful", children: ["Revulsion", "Detestable"] },
    { name: "Disappointed", children: ["Revolted", "Repugnant"] }
  ]},
  { name: "Sad", color: "#70bee0", start: 150, children: [
    { name: "Bored", children: ["Indifferent", "Apathetic"] },
    { name: "Lonely", children: ["Isolated", "Abandoned"] },
    { name: "Despair", children: ["Vulnerable", "Powerless"] },
    { name: "Guilty", children: ["Ashamed", "Remorseful"] }
  ]}
];

const primaryBangla = {
  Fear: { word: "ভয়", definition: "বিপদ বা ক্ষতির আশঙ্কার অনুভূতি।" },
  Anger: { word: "রাগ", definition: "অন্যায় বা বাধায় তীব্র বিরক্তির অনুভূতি।" },
  Surprise: { word: "বিস্ময়", definition: "অপ্রত্যাশিত কিছু ঘটলে যে অনুভূতি হয়।" },
  Happy: { word: "আনন্দ", definition: "ভালো লাগা, তৃপ্তি বা খুশির অনুভূতি।" },
  Disgust: { word: "ঘৃণা", definition: "খুব অপছন্দ হলে দূরে সরে যেতে চাওয়ার অনুভূতি।" },
  Sad: { word: "দুঃখ", definition: "ক্ষতি, কষ্ট বা হতাশায় মন খারাপের অনুভূতি।" }
};

const emotionBanglaTerms = {
  Fear: "ভয়", Insecure: "অনিরাপত্তা", Inadequate: "নিজেকে যথেষ্ট মনে না হওয়া", Inferior: "হীন মনে হওয়া",
  Rejected: "প্রত্যাখ্যাত", Alienated: "বিচ্ছিন্ন", Disrespected: "অসম্মানিত", Anxious: "উদ্বিগ্ন",
  Overwhelmed: "চাপে দিশেহারা", Worried: "চিন্তিত", Scared: "ভীত", Terrified: "আতঙ্কিত", Frightened: "ভয় পাওয়া",
  Anger: "রাগ", Mad: "রাগান্বিত", Enraged: "প্রচণ্ড ক্ষুব্ধ", Furious: "প্রচণ্ড রাগান্বিত", Hurt: "কষ্ট পাওয়া",
  Devastated: "বিধ্বস্ত", Embarrassed: "বিব্রত", Threatened: "হুমকির মুখে", Jealous: "ঈর্ষান্বিত",
  Distant: "মানসিকভাবে দূরে", Suspicious: "সন্দেহপ্রবণ", Withdrawn: "নিজেকে গুটিয়ে নেওয়া",
  Surprise: "বিস্ময়", Confused: "বিভ্রান্ত", Disillusioned: "মোহভঙ্গ", Perplexed: "কিংকর্তব্যবিমূঢ়",
  Startled: "চমকে ওঠা", Shocked: "হতবাক", Dismayed: "হতাশ ও বিচলিত", Amazed: "বিস্মিত",
  Astonished: "অত্যন্ত বিস্মিত", Awe: "সম্ভ্রমমিশ্রিত বিস্ময়", Excited: "উত্তেজিত", Eager: "আগ্রহী", Energetic: "উদ্যমী",
  Happy: "সুখী", Joyful: "আনন্দিত", Liberated: "মুক্ত", Ecstatic: "আনন্দে আত্মহারা", Proud: "গর্বিত",
  Confident: "আত্মবিশ্বাসী", Important: "গুরুত্বপূর্ণ মনে হওয়া", Optimistic: "আশাবাদী", Open: "খোলামেলা",
  Inspired: "অনুপ্রাণিত", Peaceful: "শান্ত", Hopeful: "আশাবাদী", Loving: "স্নেহময়",
  Disgust: "ঘৃণা", Avoidance: "এড়িয়ে চলা", Hesitant: "দ্বিধাগ্রস্ত", Aversion: "প্রবল অনীহা",
  Disapproval: "অসম্মতি", Judgmental: "অন্যকে বিচার করার মনোভাব", Loathing: "তীব্র ঘৃণা", Awful: "ভীষণ খারাপ লাগা",
  Revulsion: "তীব্র বিতৃষ্ণা", Detestable: "ঘৃণ্য", Disappointed: "হতাশ", Revolted: "অত্যন্ত বিতৃষ্ণ",
  Repugnant: "জঘন্য", Sad: "দুঃখিত", Bored: "একঘেয়ে ও বিরক্ত", Indifferent: "উদাসীন", Apathetic: "নিরুৎসাহী ও উদাসীন",
  Lonely: "একাকী", Isolated: "বিচ্ছিন্ন", Abandoned: "পরিত্যক্ত", Despair: "নিরাশা", Vulnerable: "অরক্ষিত ও স্পর্শকাতর",
  Powerless: "ক্ষমতাহীন", Guilty: "অপরাধবোধ", Ashamed: "লজ্জিত", Remorseful: "অনুতপ্ত"
};

const emotionEmojis = {
  Fear: "😨", Insecure: "😟", Inadequate: "😞", Inferior: "😔", Rejected: "😢", Alienated: "👽",
  Disrespected: "😠", Anxious: "😰", Overwhelmed: "🤯", Worried: "😟", Scared: "😱", Terrified: "😱", Frightened: "😨",
  Anger: "😠", Mad: "😡", Enraged: "🤬", Furious: "🤬", Hurt: "💔", Devastated: "😭", Embarrassed: "😳",
  Threatened: "😤", Jealous: "😒", Distant: "😶", Suspicious: "🤨", Withdrawn: "🫥",
  Surprise: "😮", Confused: "😕", Disillusioned: "😔", Perplexed: "🤔", Startled: "😲", Shocked: "😲",
  Dismayed: "😧", Amazed: "🤩", Astonished: "😮", Awe: "🤩", Excited: "🤗", Eager: "😃", Energetic: "⚡",
  Happy: "😊", Joyful: "😄", Liberated: "🕊️", Ecstatic: "🤩", Proud: "😌", Confident: "😎", Important: "🌟",
  Optimistic: "🌅", Open: "🤗", Inspired: "💡", Peaceful: "😌", Hopeful: "🌱", Loving: "🥰",
  Disgust: "🤢", Avoidance: "🙈", Hesitant: "😬", Aversion: "🙅", Disapproval: "👎", Judgmental: "🧐",
  Loathing: "🤮", Awful: "😖", Revulsion: "🤢", Detestable: "👿", Disappointed: "😞", Revolted: "🤮", Repugnant: "🤢",
  Sad: "😢", Bored: "😐", Indifferent: "😑", Apathetic: "🫤", Lonely: "🥺", Isolated: "🏝️", Abandoned: "😭",
  Despair: "😫", Vulnerable: "🫣", Powerless: "😔", Guilty: "😓", Ashamed: "😳", Remorseful: "😔"
};

const banglaCategoryGuides = {
  Fear: {
    situation: "অনিরাপত্তা, অনিশ্চয়তা বা বিপদের আশঙ্কা হলে এমন অনুভূতি হতে পারে।",
    body: "হৃদস্পন্দন বেড়ে যাওয়া, শরীর শক্ত হওয়া বা সরে যেতে ইচ্ছে করার মতো লক্ষণ দেখা দিতে পারে।"
  },
  Anger: {
    situation: "কিছু অন্যায়, কষ্টদায়ক বা বাধা সৃষ্টি করছে মনে হলে এমন অনুভূতি হতে পারে।",
    body: "শরীর গরম হওয়া, পেশি শক্ত হওয়া বা জোরে কথা বলতে ইচ্ছে করার মতো লক্ষণ দেখা দিতে পারে।"
  },
  Surprise: {
    situation: "হঠাৎ বা অপ্রত্যাশিত কিছু ঘটলে এমন অনুভূতি হতে পারে।",
    body: "চমকে ওঠা, চোখ বড় হওয়া বা মুহূর্তের জন্য শ্বাস আটকে যাওয়ার মতো লক্ষণ দেখা দিতে পারে।"
  },
  Happy: {
    situation: "নিরাপত্তা, সাফল্য, ভালোবাসা বা মানুষের সঙ্গে সংযোগ অনুভব করলে এমন অনুভূতি হতে পারে।",
    body: "শরীর হালকা, শান্ত, উষ্ণ বা উদ্যমী লাগার মতো লক্ষণ দেখা দিতে পারে।"
  },
  Disgust: {
    situation: "কিছু খুব অপছন্দনীয়, অস্বস্তিকর বা ভুল মনে হলে এমন অনুভূতি হতে পারে।",
    body: "বমি বমি লাগা, মুখ কুঁচকে যাওয়া বা দূরে সরে যেতে ইচ্ছে করার মতো লক্ষণ দেখা দিতে পারে।"
  },
  Sad: {
    situation: "ক্ষতি, কষ্ট, হতাশা বা একাকিত্বের অভিজ্ঞতায় এমন অনুভূতি হতে পারে।",
    body: "শরীর ভারী লাগা, শক্তি কমে যাওয়া বা কাঁদতে ইচ্ছে করার মতো লক্ষণ দেখা দিতে পারে।"
  }
};

const banglaStrength = {
  gentle: "মৃদু", medium: "মাঝারি", strong: "তীব্র", "very strong": "খুব তীব্র"
};

const clueData = [
  { id: "b-avoid", type: "behavior", label: "Avoiding or getting away", scores: { Fear: 3, Disgust: 1 } },
  { id: "b-fidget", type: "behavior", label: "Fidgeting or acting out", scores: { Fear: 3, Anger: 1 } },
  { id: "b-fit-in", type: "behavior", label: "Trying hard to fit in", scores: { Fear: 3, Sad: 1 } },
  { id: "b-isolate", type: "behavior", label: "Isolating or covering it up", scores: { Fear: 2, Sad: 2 } },
  { id: "b-defensive", type: "behavior", label: "Getting defensive", scores: { Anger: 3, Fear: 1 } },
  { id: "b-yelling", type: "behavior", label: "Yelling or storming off", scores: { Anger: 3 } },
  { id: "b-fight", type: "behavior", label: "Arguing or picking a fight", scores: { Anger: 3 } },
  { id: "b-ignore", type: "behavior", label: "Not listening or ignoring", scores: { Anger: 2, Disgust: 1 } },
  { id: "b-silent", type: "behavior", label: "Going silent, then reacting", scores: { Surprise: 3, Fear: 1 } },
  { id: "b-questions", type: "behavior", label: "Asking many questions", scores: { Surprise: 3 } },
  { id: "b-watch", type: "behavior", label: "Becoming still and watching", scores: { Surprise: 2, Fear: 1 } },
  { id: "b-fast", type: "behavior", label: "Talking fast and smiling", scores: { Surprise: 2, Happy: 2 } },
  { id: "b-cheerful", type: "behavior", label: "Acting cheerful", scores: { Happy: 3 } },
  { id: "b-help", type: "behavior", label: "Listening or helping", scores: { Happy: 3 } },
  { id: "b-affection", type: "behavior", label: "Admiring or sharing affection", scores: { Happy: 3 } },
  { id: "b-wrong", type: "behavior", label: "Telling someone they are wrong", scores: { Disgust: 3, Anger: 1 } },
  { id: "b-trust", type: "behavior", label: "Withdrawing trust or turning away", scores: { Disgust: 3, Sad: 1 } },
  { id: "b-leave", type: "behavior", label: "Showing disgust or leaving", scores: { Disgust: 3 } },
  { id: "b-give-up", type: "behavior", label: "Giving up or not caring", scores: { Sad: 3, Disgust: 1 } },
  { id: "b-shut-down", type: "behavior", label: "Shutting down", scores: { Sad: 3, Fear: 1 } },
  { id: "b-hide", type: "behavior", label: "Hiding or blaming", scores: { Sad: 2, Fear: 1, Anger: 1 } },
  { id: "s-heart", type: "sensation", label: "Racing heart", scores: { Fear: 3, Anger: 1, Surprise: 1 } },
  { id: "s-tremble", type: "sensation", label: "Trembling or numb hands", scores: { Fear: 3 } },
  { id: "s-frozen", type: "sensation", label: "Tense, frozen, or cold", scores: { Fear: 3 } },
  { id: "s-blush", type: "sensation", label: "Blushing or feeling tender", scores: { Fear: 2 } },
  { id: "s-hot", type: "sensation", label: "Feeling hot or flushed", scores: { Anger: 3 } },
  { id: "s-clench", type: "sensation", label: "Clenched jaw or fists", scores: { Anger: 3 } },
  { id: "s-pressure", type: "sensation", label: "Head pressure or tight muscles", scores: { Anger: 3, Fear: 1 } },
  { id: "s-gut", type: "sensation", label: "Headache or gut turning", scores: { Anger: 2, Disgust: 1 } },
  { id: "s-breathless", type: "sensation", label: "Breathless or speechless", scores: { Surprise: 3, Fear: 1 } },
  { id: "s-jaw-drop", type: "sensation", label: "Jaw drops or eyebrows rise", scores: { Surprise: 3 } },
  { id: "s-sweaty", type: "sensation", label: "Sweaty palms or startled", scores: { Surprise: 2, Fear: 2 } },
  { id: "s-jumpy", type: "sensation", label: "Electrified or jumpy", scores: { Surprise: 3, Happy: 1 } },
  { id: "s-warm", type: "sensation", label: "Warm, light, or buzzing", scores: { Happy: 3 } },
  { id: "s-awake", type: "sensation", label: "Open, energetic, or awake", scores: { Happy: 3 } },
  { id: "s-calm", type: "sensation", label: "Relaxed, soft, or calm", scores: { Happy: 3 } },
  { id: "s-tall", type: "sensation", label: "Tall, steady, or confident", scores: { Happy: 2 } },
  { id: "s-nausea", type: "sensation", label: "Nausea or queasiness", scores: { Disgust: 3 } },
  { id: "s-face", type: "sensation", label: "Scrunched face or curled lip", scores: { Disgust: 3, Anger: 1 } },
  { id: "s-shudder", type: "sensation", label: "Shuddering or needing to move", scores: { Disgust: 3 } },
  { id: "s-throat", type: "sensation", label: "Lump in throat or turning away", scores: { Disgust: 2, Sad: 1 } },
  { id: "s-heavy", type: "sensation", label: "Heavy or weak", scores: { Sad: 3 } },
  { id: "s-tired", type: "sensation", label: "Tired or low energy", scores: { Sad: 3 } },
  { id: "s-empty", type: "sensation", label: "Hollow or empty", scores: { Sad: 3 } },
  { id: "s-crying", type: "sensation", label: "Crying, aching, or slouching", scores: { Sad: 3 } }
];

const clueBangla = {
  "b-avoid": "এড়িয়ে যাচ্ছি বা দূরে সরে যাচ্ছি",
  "b-fidget": "ছটফট করছি বা অস্থির আচরণ করছি",
  "b-fit-in": "দলে মানিয়ে নিতে খুব চেষ্টা করছি",
  "b-isolate": "নিজেকে আলাদা করছি বা লুকাচ্ছি",
  "b-defensive": "আত্মরক্ষামূলক আচরণ করছি",
  "b-yelling": "চিৎকার করছি বা রেগে চলে যাচ্ছি",
  "b-fight": "তর্ক করছি বা ঝগড়া বাধাচ্ছি",
  "b-ignore": "শুনছি না বা উপেক্ষা করছি",
  "b-silent": "প্রথমে চুপ হচ্ছি, পরে প্রতিক্রিয়া দিচ্ছি",
  "b-questions": "অনেক প্রশ্ন করছি",
  "b-watch": "স্থির হয়ে তাকিয়ে দেখছি",
  "b-fast": "দ্রুত কথা বলছি ও হাসছি",
  "b-cheerful": "হাসিখুশি আচরণ করছি",
  "b-help": "মন দিয়ে শুনছি বা সাহায্য করছি",
  "b-affection": "প্রশংসা করছি বা ভালোবাসা দেখাচ্ছি",
  "b-wrong": "অন্যকে বলছি যে সে ভুল",
  "b-trust": "বিশ্বাস সরিয়ে নিচ্ছি বা মুখ ফিরিয়ে নিচ্ছি",
  "b-leave": "বিরক্তি দেখাচ্ছি বা চলে যাচ্ছি",
  "b-give-up": "হাল ছেড়ে দিচ্ছি বা কিছুই পরোয়া করছি না",
  "b-shut-down": "চুপ হয়ে নিজেকে গুটিয়ে নিচ্ছি",
  "b-hide": "লুকাচ্ছি বা অন্যকে দোষ দিচ্ছি",
  "s-heart": "হৃদস্পন্দন দ্রুত হচ্ছে",
  "s-tremble": "হাত কাঁপছে বা অবশ লাগছে",
  "s-frozen": "শরীর টানটান, জমে গেছে বা ঠান্ডা লাগছে",
  "s-blush": "লজ্জায় লাল হচ্ছি বা স্পর্শকাতর লাগছে",
  "s-hot": "শরীর গরম বা মুখ লাল লাগছে",
  "s-clench": "চোয়াল বা মুঠি শক্ত হয়ে আছে",
  "s-pressure": "মাথায় চাপ বা পেশি শক্ত লাগছে",
  "s-gut": "মাথাব্যথা বা পেট মোচড়াচ্ছে",
  "s-breathless": "শ্বাস আটকে যাচ্ছে বা কথা বের হচ্ছে না",
  "s-jaw-drop": "মুখ হাঁ হয়ে যাচ্ছে বা ভ্রু উঠছে",
  "s-sweaty": "হাতের তালু ঘামছে বা চমকে উঠছি",
  "s-jumpy": "শরীরে বিদ্যুতের মতো বা ছটফটে লাগছে",
  "s-warm": "উষ্ণ, হালকা বা ঝিরঝির লাগছে",
  "s-awake": "খোলা, শক্তিশালী বা জেগে আছি",
  "s-calm": "শরীর শান্ত, নরম বা আরাম লাগছে",
  "s-tall": "সোজা, স্থির বা আত্মবিশ্বাসী লাগছে",
  "s-nausea": "বমি বমি বা অস্বস্তি লাগছে",
  "s-face": "মুখ কুঁচকে যাচ্ছে বা ঠোঁট বাঁকছে",
  "s-shudder": "শরীর শিউরে উঠছে বা নড়তে ইচ্ছে করছে",
  "s-throat": "গলায় দলা লাগছে বা মুখ ফিরিয়ে নিতে ইচ্ছে করছে",
  "s-heavy": "শরীর ভারী বা দুর্বল লাগছে",
  "s-tired": "ক্লান্ত বা শক্তি কম লাগছে",
  "s-empty": "ভেতরে ফাঁকা বা শূন্য লাগছে",
  "s-crying": "কাঁদছি, শরীর ব্যথা বা কুঁজো হয়ে আছি"
};

const clueLanguageText = {
  en: {
    intro: "Choose 1–3 clues that fit best. You can add more if you need to.",
    behavior: "What am I doing?",
    sensation: "What is my body doing?",
    showAll: count => `Show all ${count} clues`,
    showLess: "Show fewer clues"
  },
  bn: {
    intro: "যে ১–৩টি লক্ষণ সবচেয়ে বেশি মেলে সেগুলো বেছে নিন। প্রয়োজন হলে আরও যোগ করুন।",
    behavior: "আমি কী করছি?",
    sensation: "আমার শরীরে কী হচ্ছে?",
    showAll: count => `সব ${count}টি লক্ষণ দেখুন`,
    showLess: "কম লক্ষণ দেখুন"
  }
};

const featuredClues = {
  behavior: ["b-avoid", "b-defensive", "b-questions", "b-cheerful", "b-trust", "b-shut-down", "b-fidget", "b-fast", "b-give-up"],
  sensation: ["s-heart", "s-hot", "s-jaw-drop", "s-warm", "s-nausea", "s-heavy", "s-frozen", "s-calm", "s-tired"]
};

const clueSummaries = {
  Fear: "Your system may be trying to protect you from danger, uncertainty, or rejection.",
  Anger: "Your energy may be pushing against something that feels wrong, unfair, or blocked.",
  Surprise: "Your mind and body may be reacting to something sudden or unexpected.",
  Happy: "Your clues suggest safety, connection, energy, or something going well.",
  Disgust: "Your system may be trying to reject or move away from something unpleasant or wrong.",
  Sad: "Your clues may reflect loss, low energy, disconnection, or emotional pain."
};

// meaning, strength, situation, body sign, contrast word, distinction, example
const emotionInfo = {
  Fear: ["you sense danger or possible harm", "strong", "something feels unsafe", "become alert and ready to move", "surprise", "fear expects danger; surprise only means something was unexpected", "I feel fear when I walk alone in a dark place"],
  Insecure: ["you are not sure that you are safe, accepted, or good enough", "medium", "you compare yourself with other people", "feel small or tense", "shy", "insecurity is self-doubt; shyness is discomfort around people", "I feel insecure when I speak in front of fluent speakers"],
  Inadequate: ["you believe you are not good enough for a task", "strong", "a job feels bigger than your ability", "lose energy or want to stop", "unprepared", "inadequate describes how you judge yourself; unprepared means you need more time or practice", "I feel inadequate when I cannot understand the instructions"],
  Inferior: ["you believe you are less valuable or capable than another person", "strong", "you compare your ability or status with someone else's", "look down or make yourself smaller", "humble", "feeling inferior lowers your value; being humble means you do not boast", "I feel inferior when everyone else seems more experienced"],
  Rejected: ["you feel that someone does not want or accept you", "strong", "you are left out of a group or relationship", "feel a heavy chest and want to leave", "lonely", "rejection comes from not being accepted; loneliness can happen even without rejection", "I feel rejected when my friends do not invite me"],
  Alienated: ["you feel separated from a group and unable to connect", "strong", "the people around you seem very different from you", "feel distant and quiet", "isolated", "alienated means you do not feel that you belong; isolated means you have little contact", "I feel alienated when nobody understands my culture"],
  Disrespected: ["you feel that someone treated you as unimportant or without dignity", "strong", "someone ignores your rights, words, or boundaries", "become hot, tense, or ready to argue", "criticized", "disrespect attacks your worth; criticism can be useful feedback", "I feel disrespected when someone laughs at my accent"],
  Anxious: ["you feel nervous about something that may happen", "medium", "the future is uncertain", "breathe quickly or find it hard to sit still", "scared", "anxiety often worries about the future; being scared often responds to danger now", "I feel anxious before an important exam"],
  Overwhelmed: ["you have more feelings or tasks than you can manage", "strong", "many problems arrive at the same time", "freeze, forget things, or want to escape", "busy", "busy means you have much to do; overwhelmed means it feels like too much", "I feel overwhelmed when three assignments are due together"],
  Worried: ["you keep thinking that something may go wrong", "medium", "you do not know if a person or plan will be okay", "frown, feel tight, or repeat the same thoughts", "careful", "worry repeats a possible problem; care helps you take sensible action", "I feel worried when my family does not answer the phone"],
  Scared: ["you feel afraid because danger seems near", "strong", "you hear, see, or imagine a threat", "shake, hide, or move away", "anxious", "scared usually feels immediate; anxious can last while you wait", "I feel scared when a large dog runs toward me"],
  Terrified: ["you feel extremely scared", "very strong", "you believe serious danger is close", "freeze, shake, scream, or run", "nervous", "terror is intense fear; nervousness is much milder", "I feel terrified during a violent storm"],
  Frightened: ["something has made you suddenly or clearly afraid", "strong", "a sound, person, or event seems dangerous", "jump, stare, or pull away", "startled", "frightened includes fear; startled only means a sudden reaction", "I feel frightened when I hear footsteps behind me at night"],

  Anger: ["you feel that something is wrong, unfair, or blocking you", "strong", "someone breaks a rule or hurts you", "become hot, tense, or loud", "hurt", "anger pushes against a problem; hurt focuses on the pain it caused", "I feel anger when someone treats my friend unfairly"],
  Mad: ["you feel angry about something", "strong", "a person annoys you or a plan goes wrong", "tighten your jaw or speak sharply", "upset", "mad clearly means angry; upset can include sadness, worry, or anger", "I feel mad when someone takes my things without asking"],
  Enraged: ["you feel extremely angry and almost out of control", "very strong", "you see serious cruelty or unfairness", "shake, shout, or feel ready to act", "annoyed", "rage is extreme anger; annoyance is a small irritation", "I feel enraged when a powerful person hurts someone weak"],
  Furious: ["you feel extremely angry", "very strong", "someone seriously betrays or mistreats you", "feel heat in your face and strong energy", "frustrated", "fury is intense anger; frustration comes from being blocked", "I feel furious when someone lies to me again and again"],
  Hurt: ["another person's words or actions cause emotional pain", "medium", "someone is unkind, unfair, or forgets you", "feel a heavy chest or want to cry", "angry", "hurt is the pain underneath; anger is the energy that may cover it", "I feel hurt when my friend makes a joke about me"],
  Devastated: ["you feel deeply shocked and emotionally broken by a loss", "very strong", "something precious ends or is destroyed", "cry, feel weak, or cannot think clearly", "disappointed", "devastated is overwhelming loss; disappointed is a smaller unmet hope", "I feel devastated when someone I love dies"],
  Embarrassed: ["you feel uncomfortable because others may notice your mistake or weakness", "medium", "you make a mistake in public", "blush, look away, or want to hide", "ashamed", "embarrassment is usually brief and about a situation; shame attacks your whole self", "I feel embarrassed when I say the wrong word in class"],
  Threatened: ["you believe someone or something may harm you, your place, or your values", "strong", "a person challenges your safety or position", "become defensive and watch closely", "scared", "a threat is the danger you notice; scared is the feeling it creates", "I feel threatened when someone comes too close and shouts"],
  Jealous: ["you fear losing attention, love, or a valued relationship to someone else", "medium", "a person you care about gives attention to another person", "feel tight, watchful, or possessive", "envious", "jealousy fears losing what you have; envy wants what another person has", "I feel jealous when my best friend spends all day with someone new"],
  Distant: ["you feel emotionally far away from other people", "medium", "you do not trust the situation or do not want to connect", "speak less and avoid eye contact", "lonely", "being distant means you pull away; loneliness means you want more connection", "I feel distant after an argument with my friend"],
  Suspicious: ["you think someone may be dishonest or harmful", "medium", "a story does not seem true", "watch carefully and ask many questions", "curious", "suspicion expects a hidden problem; curiosity simply wants to know more", "I feel suspicious when the explanation keeps changing"],
  Withdrawn: ["you pull away and avoid talking or joining in", "medium", "you feel hurt, tired, or unsafe with people", "become quiet and keep to yourself", "calm", "withdrawn means disconnected; calm means peaceful and steady", "I feel withdrawn after people ignore my ideas"],

  Surprise: ["something happens that you did not expect", "medium", "an event is new or sudden", "open your eyes, stop, or react quickly", "fear", "surprise can be good or bad; fear expects danger", "I feel surprise when my friends bring me a cake"],
  Confused: ["you do not understand what something means or what to do", "medium", "information is unclear or does not match", "pause, frown, or ask questions", "uncertain", "confused means the information is hard to understand; uncertain means you are not sure which answer is right", "I feel confused when the directions use unfamiliar words"],
  Disillusioned: ["you are disappointed after learning that something is not as good or true as you believed", "strong", "a person or idea fails to match your hopes", "feel flat and lose trust", "disappointed", "disillusionment changes a belief; disappointment only means a hope was not met", "I feel disillusioned when a leader does not follow their own rules"],
  Perplexed: ["you are very confused by a difficult problem", "medium", "the facts do not seem to fit together", "think hard and look puzzled", "curious", "perplexed means unable to understand; curious means interested in finding out", "I feel perplexed when both answers seem correct"],
  Startled: ["you react suddenly because something unexpected happens", "medium", "you hear a sudden noise or someone appears", "jump, blink, or take a quick breath", "frightened", "startled describes the sudden reaction; frightened means you also feel fear", "I feel startled when a door slams behind me"],
  Shocked: ["you feel a strong surprise that is hard to accept", "strong", "you hear very unexpected news", "freeze or become speechless", "startled", "shock lasts while your mind processes the news; a startle is a quick body reaction", "I feel shocked when I hear that the school is closing"],
  Dismayed: ["you feel worried and disappointed by an unpleasant surprise", "strong", "a plan suddenly develops a serious problem", "lose energy or stare in disbelief", "shocked", "dismay includes worry and disappointment; shock can happen before you know how you feel", "I feel dismayed when I see the damage after the storm"],
  Amazed: ["you feel great surprise and wonder", "strong", "you see something unusually skillful or beautiful", "open your eyes and pay full attention", "surprised", "amazed is a strong, usually positive surprise; surprised is more general", "I feel amazed when I see the view from a mountain"],
  Astonished: ["you feel extremely surprised", "very strong", "something seems almost impossible", "stop, stare, or become speechless", "amazed", "astonished emphasizes how unexpected it is; amazed often also includes admiration", "I feel astonished when a beginner plays the song perfectly"],
  Awe: ["you feel wonder and respect for something great or powerful", "strong", "you experience great beauty, skill, or power", "become quiet and pay close attention", "amazed", "awe includes deep respect; amazement mainly describes strong surprise", "I feel awe when I see the stars far from the city"],
  Excited: ["you feel happy energy about something that is happening or coming", "strong", "you expect a good event", "smile, talk quickly, or find it hard to sit still", "nervous", "excitement expects something good; nervousness worries something may go wrong", "I feel excited before a club trip"],
  Eager: ["you strongly want to do or receive something soon", "medium", "you are ready for an opportunity", "lean forward and pay attention", "impatient", "eager means happily ready; impatient means upset about waiting", "I feel eager to meet my new classmates"],
  Energetic: ["you feel full of strength and ready to act", "medium", "you have rested or something motivates you", "move quickly and want to do things", "excited", "energetic describes your level of power; excited describes your emotional anticipation", "I feel energetic after a good night's sleep"],

  Happy: ["you feel pleased, comfortable, or glad", "medium", "something good happens or life feels right", "smile and feel light", "excited", "happiness can be calm; excitement has more energy and anticipation", "I feel happy when I spend time with friends"],
  Joyful: ["you feel deep, bright happiness", "strong", "you experience something meaningful and good", "smile freely and want to share the feeling", "happy", "joy is deeper and brighter; happy is the broader everyday word", "I feel joyful when my family celebrates together"],
  Liberated: ["you feel free after a limit, fear, or burden is removed", "strong", "you finish a difficult duty or escape a restriction", "breathe deeply and move easily", "relieved", "liberated means newly free; relieved means a worry has ended", "I feel liberated after I finish my final exam"],
  Ecstatic: ["you feel extremely joyful and excited", "very strong", "wonderful news exceeds your hopes", "laugh, cry, jump, or celebrate", "pleased", "ecstatic is the highest joy; pleased is quiet and mild", "I feel ecstatic when I learn that I won the scholarship"],
  Proud: ["you feel pleased about an achievement, quality, or person you value", "medium", "you or someone close works hard and succeeds", "stand taller and smile", "arrogant", "healthy pride values an achievement; arrogance says you are better than others", "I feel proud when I complete a difficult project"],
  Confident: ["you trust your ability to handle a situation", "medium", "you have prepared and know what to do", "stand steadily and speak clearly", "certain", "confidence trusts your ability; certainty means you believe a fact is true", "I feel confident after I practice my presentation"],
  Important: ["you feel valued and able to make a difference", "medium", "people listen to you or depend on your contribution", "sit taller and feel connected", "superior", "feeling important means you matter; feeling superior means you think others matter less", "I feel important when my team asks for my help"],
  Optimistic: ["you expect that the future can go well", "medium", "you see a real reason for hope", "feel lighter and look for possibilities", "hopeful", "optimism is a general positive outlook; hope often focuses on one desired result", "I feel optimistic because our plan is improving"],
  Open: ["you are willing to receive new ideas, people, or experiences", "gentle", "you feel safe enough to listen and explore", "relax your face and pay attention", "agreeable", "being open means willing to consider; agreeing means you already accept the idea", "I feel open to trying a different way"],
  Inspired: ["you feel moved by an idea or example and want to create or act", "strong", "you see courage, beauty, or meaningful work", "feel bright energy and many ideas", "motivated", "inspiration gives you a new vision; motivation gives you a reason to act", "I feel inspired after hearing her story"],
  Peaceful: ["you feel calm, safe, and free from conflict", "gentle", "your surroundings and thoughts are quiet", "breathe slowly and relax your muscles", "bored", "peace feels comfortably still; boredom wants more interest", "I feel peaceful while sitting beside the river"],
  Hopeful: ["you believe a good result is possible", "medium", "a difficult situation shows a path forward", "breathe more easily and keep trying", "optimistic", "hope often holds one desired possibility; optimism expects good things more generally", "I feel hopeful when I see small improvements"],
  Loving: ["you feel warm care, affection, and connection", "strong", "you think about someone or something precious", "feel warm, gentle, and ready to help", "liking", "love is deeper care and commitment; liking is lighter enjoyment", "I feel loving when I care for my little brother"],

  Disgust: ["you strongly dislike something and want it away from you", "strong", "something seems dirty, harmful, or morally wrong", "pull back, frown, or feel sick", "anger", "disgust pushes something away; anger pushes against a wrong", "I feel disgust when I smell rotten food"],
  Avoidance: ["you want to stay away from a person, thing, or situation", "medium", "something feels unpleasant, risky, or painful", "turn away or delay", "fear", "avoidance is the action or urge to stay away; fear is one feeling that may cause it", "I feel avoidance when I think about a difficult conversation"],
  Hesitant: ["you pause because you are not sure whether to act", "gentle", "a choice has possible risks", "stop, speak slowly, or move back", "unwilling", "hesitant means not sure yet; unwilling means you do not want to do it", "I feel hesitant before answering a personal question"],
  Aversion: ["you have a strong wish to avoid something unpleasant", "strong", "a taste, habit, or idea feels deeply wrong to you", "pull away or feel tense", "dislike", "aversion is a strong, lasting dislike that makes you avoid; dislike can be mild", "I have an aversion to the smell of smoke"],
  Disapproval: ["you believe an action or idea is wrong or not acceptable", "medium", "someone breaks an important standard", "frown or speak firmly", "disgust", "disapproval is a judgment about right and wrong; disgust is a stronger body feeling", "I feel disapproval when someone cheats"],
  Judgmental: ["you form harsh opinions about people, often without enough understanding", "strong", "you focus on another person's faults", "close your expression and speak critically", "discerning", "judgmental thinking condemns a person; discernment carefully evaluates a choice", "I become judgmental when I assume I know someone's reasons"],
  Loathing: ["you feel an extremely strong and lasting dislike", "very strong", "you think something is deeply harmful or hateful", "feel sick, cold, or ready to turn away", "dislike", "loathing is intense hatred; dislike is much milder", "I feel loathing toward deliberate cruelty"],
  Awful: ["you feel that something is very bad, unpleasant, or distressing", "strong", "an experience causes pain or disgust", "grimace or feel heavy", "uncomfortable", "awful is strongly bad; uncomfortable is only mildly unpleasant", "I feel awful when I realize that I hurt someone"],
  Revulsion: ["you feel a sudden, powerful disgust that makes you pull away", "very strong", "you see or imagine something deeply repulsive", "recoil or feel sick", "aversion", "revulsion is an intense immediate reaction; aversion can be a lasting preference to avoid", "I feel revulsion when I see food covered with mold"],
  Detestable: ["you believe something deserves intense dislike", "very strong", "an action seems cruel or morally hateful", "speak with strong rejection", "annoying", "detestable means worthy of hatred; annoying only causes irritation", "I find bullying detestable"],
  Disappointed: ["you feel sad because reality did not meet your hope", "medium", "a plan, person, or result is less good than expected", "sigh and lose some energy", "devastated", "disappointment is an unmet hope; devastation is overwhelming loss", "I feel disappointed when the event is canceled"],
  Revolted: ["you feel extremely disgusted and offended", "very strong", "something seems physically or morally horrible", "pull away and strongly object", "shocked", "revolted means strong disgust; shocked means strong surprise", "I feel revolted by people who enjoy hurting animals"],
  Repugnant: ["you find something extremely unpleasant or unacceptable", "very strong", "an idea or behavior strongly violates your values", "reject it immediately", "unpleasant", "repugnant is intensely offensive; unpleasant is a much weaker word", "I find racist jokes repugnant"],

  Sad: ["you feel unhappy because of loss, pain, or disappointment", "medium", "something important is missing or has gone wrong", "feel heavy, quiet, or tearful", "tired", "sadness is emotional pain; tiredness is low physical or mental energy", "I feel sad when a friend moves away"],
  Bored: ["you do not feel interested and want something more engaging", "gentle", "an activity is repetitive or has no meaning for you", "lose focus, yawn, or check the time", "peaceful", "boredom wants stimulation; peace is comfortable with stillness", "I feel bored during a very long, repetitive task"],
  Indifferent: ["you do not care strongly one way or the other", "gentle", "a choice or result does not matter much to you", "show little reaction", "undecided", "indifferent means you do not care; undecided means you care but have not chosen", "I feel indifferent about which color we use"],
  Apathetic: ["you have little interest, feeling, or motivation", "medium", "you feel disconnected or emotionally exhausted", "move slowly and stop trying", "bored", "apathy is a broad lack of care; boredom still wants something interesting", "I feel apathetic when I have been stressed for too long"],
  Lonely: ["you want meaningful connection but feel alone", "strong", "you have nobody with whom you can truly share", "feel empty and reach for contact", "alone", "lonely is an unwanted feeling; being alone can be peaceful and chosen", "I feel lonely when I have no one to talk to"],
  Isolated: ["you are separated from other people or support", "strong", "distance, language, or circumstances keep you apart", "become quiet and disconnected", "lonely", "isolated describes separation; lonely describes how separation may feel", "I feel isolated when everyone speaks a language I do not understand"],
  Abandoned: ["you feel that someone you depended on has left you without care", "very strong", "support disappears when you need it", "feel empty, panicked, or helpless", "alone", "abandoned includes being left by someone; alone only describes having no company", "I feel abandoned when a trusted person leaves during a crisis"],
  Despair: ["you feel that there is no hope and nothing will improve", "very strong", "a painful problem continues for a long time", "feel heavy and stop imagining solutions", "sad", "despair is sadness without hope; ordinary sadness can still expect change", "I feel despair when every possible solution seems closed"],
  Vulnerable: ["you feel open to being hurt emotionally or physically", "medium", "you reveal a need, weakness, or personal truth", "feel exposed and watch others closely", "weak", "vulnerable means open to harm; weak means lacking strength", "I feel vulnerable when I share a painful memory"],
  Powerless: ["you feel unable to control or change what is happening", "strong", "other people or rules control an important outcome", "freeze, give up, or feel very small", "helpless", "powerless means you lack control; helpless means you also cannot get the help you need", "I feel powerless when decisions about me are made without me"],
  Guilty: ["you feel bad because you believe you did something wrong", "medium", "your action hurts someone or breaks your values", "feel heavy and want to repair the harm", "ashamed", "guilt says I did something bad; shame says I am bad", "I feel guilty when I break a promise"],
  Ashamed: ["you feel that others may see you as bad or unworthy", "strong", "a failure feels like it says something terrible about you", "hide your face or want to disappear", "embarrassed", "shame attacks your identity; embarrassment is usually about one awkward moment", "I feel ashamed when I believe my mistake makes me a bad person"],
  Remorseful: ["you feel deep regret for harm you caused and want to make it right", "strong", "you understand how your action hurt someone", "feel heavy but ready to apologize", "guilty", "remorse includes sincere sorrow and a wish to repair; guilt may stop at feeling bad", "I feel remorseful after I understand how my words hurt her"]
};

const pronunciation = {
  anxious: "/ˈæŋk.ʃəs/", overwhelmed: "/ˌoʊ.vɚˈwelmd/", worried: "/ˈwɝː.id/", terrified: "/ˈter.ə.faɪd/", frightened: "/ˈfraɪ.tənd/",
  enraged: "/ɪnˈreɪdʒd/", furious: "/ˈfjʊr.i.əs/", devastated: "/ˈdev.ə.steɪ.tɪd/", embarrassed: "/ɪmˈber.əst/", threatened: "/ˈθret.ənd/",
  jealous: "/ˈdʒel.əs/", suspicious: "/səˈspɪʃ.əs/", withdrawn: "/wɪðˈdrɔːn/", confused: "/kənˈfjuːzd/", disillusioned: "/ˌdɪs.ɪˈluː.ʒənd/",
  perplexed: "/pɚˈplekst/", startled: "/ˈstɑːr.təld/", astonished: "/əˈstɑː.nɪʃt/", energetic: "/ˌen.ɚˈdʒet̬.ɪk/", joyful: "/ˈdʒɔɪ.fəl/",
  liberated: "/ˈlɪb.ə.reɪ.tɪd/", ecstatic: "/ɪkˈstæt̬.ɪk/", confident: "/ˈkɑːn.fə.dənt/", optimistic: "/ˌɑːp.təˈmɪs.tɪk/", peaceful: "/ˈpiːs.fəl/",
  disgust: "/dɪsˈɡʌst/", avoidance: "/əˈvɔɪ.dəns/", hesitant: "/ˈhez.ə.tənt/", aversion: "/əˈvɝː.ʒən/", disapproval: "/ˌdɪs.əˈpruː.vəl/",
  judgmental: "/dʒʌdʒˈmen.təl/", loathing: "/ˈloʊ.ðɪŋ/", revulsion: "/rɪˈvʌl.ʃən/", detestable: "/dɪˈtes.tə.bəl/", disappointed: "/ˌdɪs.əˈpɔɪn.tɪd/",
  repugnant: "/rɪˈpʌɡ.nənt/", indifferent: "/ɪnˈdɪf.ɚ.ənt/", apathetic: "/ˌæp.əˈθet̬.ɪk/", isolated: "/ˈaɪ.sə.leɪ.tɪd/", abandoned: "/əˈbæn.dənd/",
  despair: "/dɪˈsper/", vulnerable: "/ˈvʌl.nɚ.ə.bəl/", powerless: "/ˈpaʊ.ɚ.ləs/", guilty: "/ˈɡɪl.ti/", remorseful: "/rɪˈmɔːrs.fəl/"
};

let savedCefr = "A2";
let savedAutoPlay = false;
let savedEmojiOnly = false;
try {
  const storedCefr = localStorage.getItem("english-club-cefr");
  if (["A1", "A2", "B1", "B2", "C1", "C2"].includes(storedCefr)) savedCefr = storedCefr;
  savedAutoPlay = localStorage.getItem("english-club-autoplay") === "true";
  savedEmojiOnly = localStorage.getItem("english-club-emoji-only") === "true";
} catch (_) {}

const state = { primary: null, secondary: null, selected: null, speaking: false, autoPlay: savedAutoPlay, emojiOnly: savedEmojiOnly, rotation: 0, cefr: savedCefr, trail: [], color: "#e65f42" };
const wheel = document.querySelector("#emotion-wheel");
const playButton = document.querySelector("#play-all");
const globalAudioToggle = document.querySelector("#global-audio-toggle");
const emojiModeButton = document.querySelector("#emoji-mode");
const transcriptCard = document.querySelector("#transcript-card");
const liveTranscript = document.querySelector("#live-transcript");
const transcriptStatus = document.querySelector("#transcript-status");
let transcriptRows = [];
let wordHighlightTimer = null;
let timedHighlightRow = -1;
let timedHighlightCursor = 0;

document.querySelector("#today").textContent = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

function point(radius, degrees) {
  const angle = degrees * Math.PI / 180;
  return [50 + radius * Math.cos(angle), 50 + radius * Math.sin(angle)];
}

function ringPolygon(inner, outer, start, end) {
  const points = [];
  const steps = Math.max(3, Math.ceil(Math.abs(end - start) / 7.5));
  for (let i = 0; i <= steps; i++) points.push(point(outer, start + (end - start) * i / steps));
  if (inner === 0) points.push([50, 50]);
  else for (let i = steps; i >= 0; i--) points.push(point(inner, start + (end - start) * i / steps));
  return `polygon(${points.map(([x,y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(",")})`;
}

function mixHex(base, target, amount) {
  const from = base.replace("#", "");
  const to = target.replace("#", "");
  const channels = [0, 2, 4].map(index => {
    const start = parseInt(from.slice(index, index + 2), 16);
    const end = parseInt(to.slice(index, index + 2), 16);
    return Math.round(start + (end - start) * amount).toString(16).padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

function primaryFill(color) {
  return mixHex(color, "#ffffff", 0.16);
}

function secondaryFill(color, branchIndex) {
  return mixHex(color, "#ffffff", [0.12, 0.30, 0.48, 0.66][branchIndex]);
}

function tertiaryFill(parentShade, siblingIndex) {
  return mixHex(parentShade, "#ffffff", siblingIndex === 0 ? 0.10 : 0.21);
}

function makeSector({ name, translation = "", color, start, end, inner, outer, level, selected, muted, delay = 0 }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `sector sector--${level} is-new${selected ? " is-selected" : ""}${muted ? " is-muted" : ""}`;
  button.style.setProperty("--sector-color", color);
  const labelRadius = level === "primary" ? 11.85 : (inner + outer) / 2;
  const middleAngle = (start + end) / 2;
  const [labelX, labelY] = point(labelRadius, middleAngle);
  let textRotation = ((middleAngle + 180) % 360 + 360) % 360 - 180;
  if (textRotation > 90) textRotation -= 180;
  if (textRotation < -90) textRotation += 180;
  button.style.setProperty("--label-x", `${labelX}%`);
  button.style.setProperty("--label-y", `${labelY}%`);
  button.style.setProperty("--text-rotation", `${textRotation}deg`);
  button.style.clipPath = ringPolygon(inner, outer, start, end);
  button.style.animationDelay = `${delay}ms`;
  button.setAttribute("aria-label", `${name}${translation ? `, ${translation}` : ""}. Select to hear this emotion.`);
  button.innerHTML = `<span class="sector__label"><span class="sector__main"><span class="sector__emoji" aria-hidden="true">${emotionEmojis[name] || "🙂"}</span><span class="sector__word">${name}</span></span>${translation ? `<span class="sector__bangla" lang="bn">${translation}</span>` : ""}</span>`;
  return button;
}

function renderWheel() {
  wheel.replaceChildren();
  wheel.classList.toggle("is-emoji-only", state.emojiOnly);
  const fragment = document.createDocumentFragment();

  wheelData.forEach((primary, pIndex) => {
    const primarySelected = state.primary === pIndex;
    const mainColor = primaryFill(primary.color);
    const button = makeSector({
      name: primary.name, translation: primaryBangla[primary.name].word, color: mainColor, start: primary.start, end: primary.start + 60,
      inner: 0, outer: 17.2, level: "primary", selected: primarySelected, muted: state.primary !== null && !primarySelected
    });
    button.addEventListener("click", () => selectPrimary(pIndex));
    fragment.append(button);

    if (primarySelected) {
      primary.children.forEach((secondary, sIndex) => {
        const start = primary.start + sIndex * 15;
        const secondarySelected = state.secondary === sIndex;
        const branchColor = secondaryFill(primary.color, sIndex);
        const secondButton = makeSector({
          name: secondary.name, color: branchColor, start, end: start + 15,
          inner: 17.6, outer: 31.2, level: "secondary", selected: secondarySelected,
          muted: state.secondary !== null && !secondarySelected, delay: sIndex * 35
        });
        secondButton.addEventListener("click", () => selectSecondary(pIndex, sIndex));
        fragment.append(secondButton);
      });

      if (state.secondary !== null) {
        primary.children.forEach((secondary, sIndex) => {
          const branchColor = secondaryFill(primary.color, sIndex);
          secondary.children.forEach((name, tIndex) => {
            const start = primary.start + sIndex * 15 + tIndex * 7.5;
            const selected = state.selected === name;
            const thirdButton = makeSector({
              name, color: tertiaryFill(branchColor, tIndex), start, end: start + 7.5, inner: 31.6, outer: 48,
              level: "tertiary", selected, muted: state.secondary !== sIndex, delay: (sIndex * 2 + tIndex) * 28
            });
            thirdButton.addEventListener("click", () => selectTertiary(pIndex, sIndex, name));
            fragment.append(thirdButton);
          });
        });
      }
    }
  });

  wheel.append(fragment);
  renderMobileChoices();
}

function selectPrimary(index) {
  stopSpeech();
  state.primary = index;
  state.secondary = null;
  state.selected = wheelData[index].name;
  updateLesson(wheelData[index].name, [wheelData[index].name], wheelData[index].color);
  renderWheel();
  setStep(2, "Now choose a more specific feeling");
  if (state.autoPlay) speakLesson();
}

function selectSecondary(primaryIndex, secondaryIndex) {
  stopSpeech();
  state.primary = primaryIndex;
  state.secondary = secondaryIndex;
  const primary = wheelData[primaryIndex];
  const secondary = primary.children[secondaryIndex];
  state.selected = secondary.name;
  updateLesson(secondary.name, [primary.name, secondary.name], primary.color);
  renderWheel();
  setStep(3, "Choose the most exact word — or keep this one");
  if (state.autoPlay) speakLesson();
}

function selectTertiary(primaryIndex, secondaryIndex, name) {
  stopSpeech();
  state.primary = primaryIndex;
  state.secondary = secondaryIndex;
  state.selected = name;
  const primary = wheelData[primaryIndex];
  const secondary = primary.children[secondaryIndex];
  updateLesson(name, [primary.name, secondary.name, name], primary.color);
  renderWheel();
  setStep(3, "You found a precise feeling word");
  if (state.autoPlay) speakLesson();
}

function setStep(step, instruction) {
  document.querySelectorAll(".step").forEach(el => el.classList.toggle("is-active", Number(el.dataset.step) <= step));
  document.querySelector("#wheel-instruction").textContent = instruction;
}

const emotionFloodingData = {
  Fear: {
    collocations: ["feel fear", "deep fear", "overcome fear", "fear of failure", "constant fear"],
    colligations: ["fear of doing something", "in fear for someone", "fear that something will happen", "driven by fear to act", "no fear about the future"],
    distinctions: [
      "Fear isn't just being anxious, it's reacting to immediate danger right in front of you.",
      "Feeling fear is more urgent and immediate than feeling nervous.",
      "Fear is less about future uncertainty and more about real-time threat.",
      "Being afraid isn't being weak, it's your body's natural survival signal.",
      "Fear is more acute and physical than general concern."
    ],
    dialogue: [
      "“I won't lie, my heart was in my throat the entire time I was up on that stage.”",
      "“She was paralyzed with fear when the storm knocked the power out.”",
      "“You've got to face your fears head-on if you want to get past this block.”",
      "“I had a moment of pure panic, but I forced myself to take a deep breath.”",
      "“There's no sense in living in fear of things you can't control anyway.”"
    ]
  },
  Anxious: {
    collocations: ["feel anxious", "socially anxious", "anxious thought", "anxious energy", "deeply anxious"],
    colligations: ["anxious about the exam", "anxious to succeed", "feel anxious when speaking", "become anxious if ignored", "too anxious to sleep"],
    distinctions: [
      "Being anxious isn't just being scared, it's feeling like something bad might happen later.",
      "Feeling anxious is more persistent than a quick moment of nervousness.",
      "Anxiety is less about immediate danger and more about future uncertainty.",
      "Being anxious isn't a sudden action, it's a long-lasting internal tension.",
      "Feeling anxious is more intense than just worrying about a problem."
    ],
    dialogue: [
      "“I've been on pins and needles all morning waiting for the test results.”",
      "“To be honest, having all eyes on me gives me serious butterflies.”",
      "“She's running on pure nervous energy ahead of the big presentation tomorrow.”",
      "“I was sweating bullets until I finally got the confirmation email.”",
      "“Take a breath—there's no need to work yourself up into a lather over it.”"
    ]
  },
  Insecure: {
    collocations: ["feel insecure", "deeply insecure", "insecure feeling", "emotionally insecure", "socially insecure"],
    colligations: ["insecure about my skills", "feel insecure around experts", "become insecure when criticized", "too insecure to share", "insecure in a relationship"],
    distinctions: [
      "Being insecure isn't just being shy, it's doubting your own worth and abilities.",
      "Feeling insecure is more self-focused than being generally worried.",
      "Insecurity is less about external danger and more about internal self-doubt.",
      "Being insecure isn't permanent, it changes with support and practice.",
      "Feeling insecure is more subtle than feeling inferior."
    ],
    dialogue: [
      "“I always feel like I'm swimming in deep water when I sit in on those high-level meetings.”",
      "“She's second-guessing every decision she makes lately.”",
      "“Imposter syndrome really got the better of me during my first week on the job.”",
      "“Don't sell yourself short—you earned your spot at this table.”",
      "“He puts on a tough front, but underneath it all he's deeply insecure.”"
    ]
  },
  Overwhelmed: {
    collocations: ["feel overwhelmed", "completely overwhelmed", "overwhelmed by work", "overwhelmed by choices", "emotionally overwhelmed"],
    colligations: ["overwhelmed with tasks", "feel overwhelmed when busy", "become overwhelmed easily", "too overwhelmed to speak", "overwhelmed by the response"],
    distinctions: [
      "Being overwhelmed isn't just being busy, it's feeling like demands exceed your capacity.",
      "Feeling overwhelmed is more paralyzing than just working hard.",
      "Being overwhelmed is less about fear and more about mental cognitive overload.",
      "Feeling overwhelmed isn't failure, it's a signal to step back and prioritize.",
      "Overwhelmed is more intense than feeling slightly stressed."
    ],
    dialogue: [
      "“I'm completely snowed under with deadlines this week.”",
      "“My brain feels like it has fifty open tabs right now.”",
      "“She's reaching her breaking point with everything on her plate.”",
      "“I just need to take a step back and catch my breath before I drown in this.”",
      "“It was just the straw that broke the camel's back after an exhausting month.”"
    ]
  },
  Scared: {
    collocations: ["feel scared", "scared of heights", "scared of darkness", "deeply scared", "scared to death"],
    colligations: ["scared of making mistakes", "feel scared when alone", "become scared suddenly", "too scared to move", "scared for the future"],
    distinctions: [
      "Being scared isn't just feeling uneasy, it's a strong instinctual reaction to perceived danger.",
      "Feeling scared is more immediate than feeling anxious.",
      "Being scared is less about ongoing stress and more about a sudden threat.",
      "Scared is less overwhelming than being terrified.",
      "Being scared focuses your attention instantly on safety."
    ],
    dialogue: [
      "“I was scared out of my wits when the door suddenly slammed shut.”",
      "“He shook like a leaf during his entire driving test.”",
      "“Don't let fear keep you in your comfort zone forever.”",
      "“She was scared half to death by the sudden thunderclap.”",
      "“I had cold feet right before walking out on stage.”"
    ]
  },
  Terrified: {
    collocations: ["terrified of snakes", "completely terrified", "terrified look", "terrified voice", "deeply terrified"],
    colligations: ["terrified to go inside", "feel terrified when trapped", "become terrified instantly", "too terrified to scream", "terrified of losing someone"],
    distinctions: [
      "Being terrified isn't just being scared, it's extreme, overwhelming dread.",
      "Feeling terrified is more severe and paralyzing than being nervous.",
      "Terrified is less controllable than mild fear.",
      "Being terrified freezes your ability to think logically.",
      "Terrified is the highest intensity of fear before panic."
    ],
    dialogue: [
      "“I was scared stiff when I looked down over the cliff edge.”",
      "“She froze in her tracks, completely petrified by the sudden noise.”",
      "“My blood ran cold when I heard the alarm go off in the middle of the night.”",
      "“He was trembling like a leaf after the near-miss on the highway.”",
      "“It scared the living daylights out of me when the lights cut out.”"
    ]
  },
  Worried: {
    collocations: ["feel worried", "deeply worried", "worried look", "constantly worried", "worried parent"],
    colligations: ["worried about money", "worried that something happened", "feel worried when late", "too worried to sleep", "worried for your safety"],
    distinctions: [
      "Being worried isn't immediate physical danger, it's mental tension about a possible outcome.",
      "Feeling worried is more cognitive than feeling panicked.",
      "Worry is less about present harm and more about future uncertainty.",
      "Being worried isn't permanent, it resolves when you get clarity.",
      "Worry is more specific than general background anxiety."
    ],
    dialogue: [
      "“I'm worried sick about how he's going to handle the news.”",
      "“She's been pacing the floor all evening waiting for a call.”",
      "“Don't lose any sleep over it—things usually sort themselves out.”",
      "“It's been weighing heavily on my mind ever since yesterday.”",
      "“He was beside himself with worry until they finally got home safely.”"
    ]
  },
  Happy: {
    collocations: ["feel happy", "genuinely happy", "happy memory", "happy moment", "extremely happy"],
    colligations: ["happy about the news", "happy to help", "feel happy when together", "make someone happy", "so happy that I smiled"],
    distinctions: [
      "Being happy isn't just feeling excited, it's a calm feeling of well-being and satisfaction.",
      "Feeling happy is more steady and lasting than a quick thrill.",
      "Happiness is less about big achievements and more about everyday comfort.",
      "Being happy isn't having zero problems, it's feeling good in the present moment.",
      "Feeling happy is more calm and grounded than being ecstatic."
    ],
    dialogue: [
      "“I'm over the moon about getting accepted into the exchange program!”",
      "“He was walking on air for days after he got the good news.”",
      "“Honestly, seeing everyone come together like this just warms my heart.”",
      "“We had an absolute blast at the reunion last night.”",
      "“I couldn't be happier with how everything turned out in the end.”"
    ]
  },
  Confident: {
    collocations: ["feel confident", "highly confident", "confident voice", "confident smile", "deeply confident"],
    colligations: ["confident in my skills", "confident about the test", "feel confident when prepared", "become confident with practice", "confident to speak up"],
    distinctions: [
      "Being confident isn't being arrogant, it's trusting your own abilities and judgment.",
      "Feeling confident is more grounded and calm than boasting.",
      "Confidence is less about perfection and more about self-assurance.",
      "Being confident helps you handle mistakes gracefully.",
      "Confidence is quieter than loud pride."
    ],
    dialogue: [
      "“She carried herself with quiet poise throughout the tough interview.”",
      "“He was in his element presenting the project to the board.”",
      "“I feel like I really hit my stride after the first few months on the job.”",
      "“Walk in there with your head held high—you know your stuff.”",
      "“She didn't bat an eye when asked the most difficult question.”"
    ]
  },
  Excited: {
    collocations: ["feel excited", "super excited", "excited voice", "excited about the trip", "deeply excited"],
    colligations: ["excited to meet you", "excited for the weekend", "feel excited when planning", "become excited easily", "too excited to sleep"],
    distinctions: [
      "Being excited isn't quiet contentment, it's high-energy eagerness about something positive.",
      "Feeling excited is more energetic than just feeling peaceful.",
      "Excitement is less about looking back and more about forward anticipation.",
      "Being excited lights up your motivation and focus.",
      "Excitement is more active than gentle happiness."
    ],
    dialogue: [
      "“I'm bouncing off the walls waiting for the concert tonight!”",
      "“She was beside herself with excitement when she opened the gift.”",
      "“We're all hyped up for the championship game this weekend.”",
      "“He was like a kid in a candy store when he walked into the tech expo.”",
      "“I can barely contain my enthusiasm for this new project.”"
    ]
  },
  Joyful: {
    collocations: ["feel joyful", "joyful heart", "joyful occasion", "deeply joyful", "purely joyful"],
    colligations: ["joyful about life", "joyful to give", "feel joyful in nature", "make someone joyful", "joyful celebration"],
    distinctions: [
      "Being joyful isn't dependent on circumstances, it's a deep, radiant inner warmth.",
      "Feeling joyful is more profound than surface-level happiness.",
      "Joy is less fleeting than a temporary pleasure.",
      "Being joyful lifts your spirit and connects you with others.",
      "Joy is deeper and richer than simple satisfaction."
    ],
    dialogue: [
      "“Her face lit up with pure joy when she saw her old friend.”",
      "“There was an infectious sense of joy spreading through the crowd.”",
      "“It brought immense joy to my heart to see them reconciled.”",
      "“We were singing at the top of our lungs out of sheer delight.”",
      "“She has a buoyant spirit that brightens up any room she walks into.”"
    ]
  },
  Optimistic: {
    collocations: ["feel optimistic", "optimistic outlook", "cautiously optimistic", "deeply optimistic", "always optimistic"],
    colligations: ["optimistic about the future", "optimistic for success", "feel optimistic when trying", "remain optimistic under stress", "optimistic frame of mind"],
    distinctions: [
      "Being optimistic isn't ignoring reality, it's expecting good possibilities through action.",
      "Feeling optimistic is more forward-looking than enjoying the present.",
      "Optimism is less about current comfort and more about hope for tomorrow.",
      "Being optimistic helps you stay resilient during setbacks.",
      "Optimism is more active than passive hope."
    ],
    dialogue: [
      "“I'm looking on the bright side despite the rainy forecast.”",
      "“Every cloud has a silver lining if you look hard enough.”",
      "“She always sees the glass as half full, no matter what happens.”",
      "“I'm keeping my fingers crossed for a smooth outcome.”",
      "“He maintains a sunny disposition even during tough times.”"
    ]
  },
  Peaceful: {
    collocations: ["feel peaceful", "peaceful mind", "peaceful place", "deeply peaceful", "truly peaceful"],
    colligations: ["peaceful after work", "peaceful in nature", "feel peaceful when resting", "become peaceful with music", "peaceful environment"],
    distinctions: [
      "Being peaceful isn't just silence, it's freedom from inner turmoil and conflict.",
      "Feeling peaceful is more calm than feeling excited.",
      "Peace is less about outer control and more about inner harmony.",
      "Being peaceful helps you make clear, thoughtful choices.",
      "Peace is more steady than intense joy."
    ],
    dialogue: [
      "“I felt at total peace sitting by the quiet lake at sunrise.”",
      "“She has a serene presence that puts everyone at ease.”",
      "“After all the drama settled down, a sense of calm washed over the house.”",
      "“My mind was completely at rest for the first time in weeks.”",
      "“It was a smooth sailing afternoon with zero stress.”"
    ]
  },
  Proud: {
    collocations: ["feel proud", "proud moment", "deeply proud", "proud parent", "immensely proud"],
    colligations: ["proud of your work", "proud to serve", "feel proud when succeeding", "make your family proud", "proud achievement"],
    distinctions: [
      "Being proud isn't arrogance, it's feeling healthy satisfaction in effort and growth.",
      "Feeling proud is more reflective than simple joy.",
      "Pride is less about comparing and more about honoring real effort.",
      "Being proud boosts your self-esteem and motivation.",
      "Healthy pride recognizes effort, not just luck."
    ],
    dialogue: [
      "“I'm bursting with pride seeing how far you've come!”",
      "“She stood tall and took a well-deserved bow after the performance.”",
      "“He wore his hard-earned medal like a badge of honor.”",
      "“You should hold your head high after everything you accomplished.”",
      "“That was a feather in her cap that nobody can take away.”"
    ]
  },
  Anger: {
    collocations: ["feel anger", "blind anger", "suppress anger", "express anger", "righteous anger"],
    colligations: ["anger at someone", "anger over the decision", "feel anger when cheated", "channel anger into action", "filled with anger"],
    distinctions: [
      "Anger isn't just being annoyed, it's a strong emotional push against something unfair.",
      "Feeling angry is more active and forward-moving than feeling hurt inside.",
      "Anger is less about feeling bad and more about wanting to fix a wrong.",
      "Being mad isn't losing control, it's standing up when a boundary is broken.",
      "Fury is much more explosive and intense than everyday anger."
    ],
    dialogue: [
      "“I was seeing red when I saw how unfairly they treated her.”",
      "“Don't blow your top over a minor miscommunication.”",
      "“He really hit a nerve when he criticized my work in front of everyone.”",
      "“I had to bite my tongue so I wouldn't snap at him right then and there.”",
      "“She was steaming mad after waiting two hours for nothing.”"
    ]
  },
  Sad: {
    collocations: ["feel sad", "deeply sad", "sad story", "sad truth", "heartbreakingly sad"],
    colligations: ["sad about the loss", "sad to leave", "feel sad when alone", "make someone sad", "too sad to speak"],
    distinctions: [
      "Sadness isn't just being tired, it's an emotional reaction to loss or pain.",
      "Feeling sad is more about internal pain, whereas feeling lonely is wanting connection.",
      "Sadness is less about immediate anger and more about quiet emotional processing.",
      "Being sad isn't giving up, it's letting yourself feel what you lost.",
      "Feeling down is less intense than deep grief."
    ],
    dialogue: [
      "“I've been feeling down in the dumps ever since my roommate moved out.”",
      "“It really broke my heart to see him pack up his things.”",
      "“She's had a heavy heart all week after hearing the news.”",
      "“I'm just going through a rough patch right now, but I'll pull through.”",
      "“It brought a tear to my eye seeing how much they missed each other.”"
    ]
  },
  Surprise: {
    collocations: ["total surprise", "pleasant surprise", "caught by surprise", "look of surprise", "gasp in surprise"],
    colligations: ["surprised by the news", "surprised to hear", "feel surprised when", "taken by surprise", "much to my surprise"],
    distinctions: [
      "Surprise isn't always scary, it's just your mind reacting to the unexpected.",
      "Being surprised is more short-lived than being confused.",
      "Surprise is less about danger and more about sudden new information.",
      "Being shocked is much more jarring than simply being surprised.",
      "Surprise happens in a second, whereas curiosity lasts longer."
    ],
    dialogue: [
      "“Out of the blue, she called me up after five years!”",
      "“That caught me completely off guard—I didn't see it coming at all.”",
      "“My jaw dropped when I saw the final test scores.”",
      "“I had to do a double take when he walked into the room.”",
      "“Well, knock me down with a feather—I never expected that!”"
    ]
  },
  Disgust: {
    collocations: ["deep disgust", "feel disgust", "look of disgust", "moral disgust", "utter disgust"],
    colligations: ["disgust at the behavior", "disgusted by the smell", "turn away in disgust", "filled with disgust", "express disgust towards"],
    distinctions: [
      "Disgust isn't just disliking something, it's a strong physical urge to recoil.",
      "Feeling disgust is more physical and visceral than just being angry.",
      "Disgust is less about fighting back and more about keeping away from harm.",
      "Being revolted is much stronger than just feeling uncomfortable.",
      "Disgust is more about physical repulsion than moral disagreement."
    ],
    dialogue: [
      "“Ugh, that smells so foul it turned my stomach immediately.”",
      "“I was completely grossed out by how messy the kitchen was left.”",
      "“His dishonest behavior left a really bad taste in my mouth.”",
      "“She recoiled in disgust the moment she saw what was inside.”",
      "“I couldn't even look at it—it was absolutely revolting.”"
    ]
  }
};

function getFloodingData(name) {
  if (emotionFloodingData[name]) return emotionFloodingData[name];
  const info = emotionInfo[name] || [`you feel ${name.toLowerCase()}`, "medium", "something happens", "notice a change", "happy", "the two emotions describe different experiences", `I feel ${name.toLowerCase()} right now`];
  const word = name.toLowerCase();
  const contrast = info[4].toLowerCase();

  return {
    collocations: [
      `feel ${word}`,
      `deeply ${word}`,
      `increasingly ${word}`,
      `${word} feeling`,
      `genuinely ${word}`
    ],
    colligations: [
      `${word} about the situation`,
      `${word} to respond`,
      `feel ${word} when facing changes`,
      `become ${word} under pressure`,
      `so ${word} that it shows`
    ],
    distinctions: [
      `${name} isn't just ${contrast}, it's ${info[0]}.`,
      `Feeling ${word} is more ${info[1]} than simply feeling ${contrast}.`,
      `Being ${word} is less about immediate danger and more about when ${info[2]}.`,
      `You feel ${word} when your body starts to ${info[3]}.`,
      `${name} is more focused on internal experience than ${contrast}.`
    ],
    dialogue: [
      `“To be honest, I'm feeling quite ${word} about how things are going.”`,
      `“Whenever that happens, it always makes me feel a bit ${word} inside.”`,
      `“She tried to hide it, but you could tell she was deeply ${word}.”`,
      `“I get completely ${word} when I don't know what to expect next.”`,
      `“It's totally normal to feel ${word} in a situation like this.”`
    ]
  };
}

function sentencesFor(name) {
  const flooding = getFloodingData(name);

  const collocationsAndColligations = [
    ...flooding.collocations,
    ...flooding.colligations
  ];

  const lessons = {
    A1: collocationsAndColligations,
    A2: collocationsAndColligations,
    B1: flooding.distinctions.slice(0, 5),
    B2: flooding.distinctions,
    C1: flooding.dialogue.slice(0, 5),
    C2: flooding.dialogue
  };

  return lessons[state.cefr] || lessons.A2;
}

function banglaTermFor(name) {
  const key = Object.keys(emotionBanglaTerms).find(item => item.toLowerCase() === String(name).toLowerCase());
  return key ? emotionBanglaTerms[key] : name;
}

function banglaSentencesFor(name) {
  const info = emotionInfo[name] || ["you are experiencing this feeling", "medium", "something affects you", "notice a change in your body", "happy"];
  const primaryName = state.trail[0] || wheelData.find(category =>
    category.name === name || category.children.some(child => child.name === name || child.children.includes(name))
  )?.name || "Happy";
  const primary = primaryBangla[primaryName];
  const guide = banglaCategoryGuides[primaryName];
  const term = banglaTermFor(name);
  const contrastName = info[4];
  const contrastLabel = contrastName.charAt(0).toUpperCase() + contrastName.slice(1);
  const contrastTerm = banglaTermFor(contrastName);

  const levelActivities = {
    A1: [
      `শব্দ ও অর্থ: “${name}” মানে “${term}” (মূল অনুভূতি: ${primary.word})।`,
      `শ্রবণ অনুশীলন (A1-A2): নিচে ৫টি সাধারণ Collocation (শব্দগুচ্ছ) এবং ৫টি Colligation (ব্যাকরণগত প্রয়োগ) শুনুন।`,
      `পরামর্শ: শব্দটির সাথে অন্য শব্দ কীভাবে যুক্ত হয় তা বার বার শুনে অভ্যস্ত হন।`
    ],
    A2: [
      `শব্দ ও অর্থ: “${name}” এর সহজ বাংলা “${term}” (মূল অনুভূতি: ${primary.word})।`,
      `শ্রবণ অনুশীলন (A2): ৫টি কলকেশন ও ৫টি কলিগেশন পর পর উচ্চারণ করা হচ্ছে।`,
      `পরামর্শ: প্রতিটি শব্দগুচ্ছের সাবলীল ব্যবহার ও উচ্চারণ অনুকরণ করুন।`
    ],
    B1: [
      `শব্দ ও অর্থ: “${name}” (বাংলা: “${term}”)—কাছাকাছি অনুভূতি: “${contrastLabel}” (${contrastTerm})।`,
      `শ্রবণ অনুশীলন (B1): সূক্ষ্ম পার্থক্য ও বৈসাদৃশ্যের (Distinction & Contrast) বাক্যসমূহ শুনুন।`,
      `পরামর্শ: সমার্থক বা কাছাকাছি অনুভূতিগুলোর মধ্যে সূক্ষ্ম পার্থক্য বুঝতে এটি সাহায্য করবে।`
    ],
    B2: [
      `শব্দ ও অর্থ: “${name}” (বাংলা: “${term}”)—অর্থগত সীমা ও সূক্ষ্ম পার্থক্য।`,
      `শ্রবণ অনুশীলন (B2): শব্দটির সেমান্টিক ওয়েব (Semantic Web) এবং বৈসাদৃশ্যমূলক বাক্য শুনুন।`,
      `পরামর্শ: সমার্থক শব্দের চেয়ে ঠিক কোন জায়গায় শব্দটির প্রয়োগ আলাদা তা খেয়াল করুন।`
    ],
    C1: [
      `শব্দ ও অর্থ: “${name}” (বাংলা: “${term}”)—স্বাভাবিক নেটিভ ব্যবহার।`,
      `শ্রবণ অনুশীলন (C1): ইংরেজিতে প্রাত্যহিক কথোপকথন (Colloquial & Idiomatic Dialogue) শুনুন।`,
      `পরামর্শ: সাধারণ আলাপে নেটিভ স্পিকাররা কীভাবে প্রবাদ বা বাকধারা ব্যবহার করেন তা লক্ষ্য করুন।`
    ],
    C2: [
      `শব্দ ও অর্থ: “${name}” (বাংলা: “${term}”)—উচ্চমানের সাবলীলতা ও বাকধারা।`,
      `শ্রবণ অনুশীলন (C2): নেটিভ কথোপকথনের বাস্তব উদাহরণ ও ভাবপ্রকাশের বাক্য শুনুন।`,
      `পরামর্শ: অনুভূতি প্রকাশের প্রাতিষ্ঠানিক ও ঘরোয়া রূপের প্রয়োগ আয়ত্ত করুন।`
    ]
  };

  return [
    ...(levelActivities[state.cefr] || levelActivities.A2),
    guide.situation,
    guide.body
  ];
}

function renderBanglaTranscript(name) {
  const container = document.querySelector("#bangla-transcript");
  document.querySelector("#bangla-transcript-level").textContent = state.cefr;
  container.replaceChildren();
  banglaSentencesFor(name).forEach(text => {
    const line = document.createElement("p");
    line.textContent = text;
    container.append(line);
  });
}

function updateLesson(name, trail, color) {
  state.trail = [...trail];
  state.color = color;
  transcriptCard.style.setProperty("--lesson-color", color);
  document.querySelector("#selected-emoji").textContent = emotionEmojis[name] || "🙂";
  document.querySelector("#selected-word").textContent = name;
  document.querySelector("#pronunciation").textContent = pronunciation[name.toLowerCase()] || "Tap Listen to hear the pronunciation";
  document.querySelector("#breadcrumb").textContent = trail.join("  ›  ");
  const primaryDefinition = primaryBangla[trail[0]];
  document.querySelector("#bangla-definition").textContent = `${trail[0]} · ${primaryDefinition.word} — ${primaryDefinition.definition}`;
  document.querySelector("#prompt-word").textContent = name.toLowerCase();
  document.querySelector("#reason").value = "";
  document.querySelector("#reason").placeholder = `I feel ${name.toLowerCase()} because…`;

  renderTranscript(name);
  renderDefinitionSection(name);
}

function renderDefinitionSection(name) {
  const definitionCard = document.querySelector("#definition-card");
  const definitionBody = document.querySelector("#definition-body");
  if (!definitionCard || !definitionBody) return;
  definitionCard.hidden = false;
  definitionCard.style.setProperty("--lesson-color", state.color);

  const info = emotionInfo[name] || [`you feel ${name.toLowerCase()}`, "medium", "something happens", "notice a change", "happy", "the two emotions describe different experiences", `I feel ${name.toLowerCase()} right now`];
  const word = name.toLowerCase();
  const contrastName = info[4].charAt(0).toUpperCase() + info[4].slice(1);
  const contrastTerm = banglaTermFor(info[4]);

  document.querySelector("#definition-heading").textContent = `${name} — Meaning & Reference`;

  definitionBody.replaceChildren();

  const blocks = [
    { title: "Core Meaning", text: `<strong>${name}</strong> means ${info[0]}. It is typically a <em>${info[1]}</em> feeling.` },
    { title: "When You Feel It & Body Signals", text: `You may feel <strong>${word}</strong> when ${info[2]}. Physically, your body may ${info[3]}.` },
    { title: "Distinction vs. Neighboring Feeling", text: `Do not confuse <strong>${word}</strong> with <strong>${contrastName}</strong> (${contrastTerm}). ${info[5]}.` },
    { title: "Example Sentence", text: `“${info[6]}.”`, isExample: true }
  ];

  blocks.forEach(block => {
    const card = document.createElement("div");
    card.className = `def-block${block.isExample ? " def-block--example" : ""}`;
    card.innerHTML = `<h4>${block.title}</h4><p>${block.text}</p>`;
    definitionBody.append(card);
  });
}

function renderTranscript(name) {
  transcriptCard.hidden = false;
  liveTranscript.replaceChildren();
  transcriptRows = [name, ...sentencesFor(name)].map((text, rowIndex) => {
    const row = document.createElement("span");
    row.className = "transcript-line";
    row.dataset.row = rowIndex;
    const tokens = [];
    [...text.matchAll(/\S+/g)].forEach((match, tokenIndex, matches) => {
      const token = document.createElement("span");
      token.className = "transcript-token";
      token.textContent = match[0];
      row.append(token);
      row.append(document.createTextNode(" "));
      tokens.push({ element: token, start: match.index, end: match.index + match[0].length });
    });
    liveTranscript.append(row);
    return { element: row, tokens, text };
  });
  renderBanglaTranscript(name);
  resetTranscript();
}

function resetTranscript(message = `${state.cefr} · Ready to listen`) {
  transcriptRows.forEach(row => row.tokens.forEach(token => token.element.classList.remove("is-current", "is-spoken")));
  transcriptStatus.textContent = message;
  transcriptStatus.classList.remove("is-speaking");
}

function highlightTranscriptToken(rowIndex, tokenIndex, includeEarlierRows = true) {
  const row = transcriptRows[rowIndex];
  if (!row) return;
  transcriptRows.forEach((item, index) => item.tokens.forEach(token => {
    token.element.classList.remove("is-current");
    if (includeEarlierRows && index < rowIndex) token.element.classList.add("is-spoken");
  }));
  const active = row.tokens[tokenIndex] || row.tokens[0];
  row.tokens.forEach((token, index) => {
    if (index < tokenIndex) token.element.classList.add("is-spoken");
  });
  active?.element.classList.remove("is-spoken");
  active?.element.classList.add("is-current");
  transcriptStatus.textContent = `${state.cefr} · Listening to ${state.selected}`;
  transcriptStatus.classList.add("is-speaking");
}

function markTranscriptWord(rowIndex, charIndex = 0, includeEarlierRows = true) {
  const row = transcriptRows[rowIndex];
  if (!row) return;
  const tokenIndex = Math.max(0, row.tokens.findIndex(token => charIndex >= token.start && charIndex < token.end));
  if (timedHighlightRow === rowIndex) timedHighlightCursor = Math.max(timedHighlightCursor, tokenIndex + 1);
  highlightTranscriptToken(rowIndex, tokenIndex, includeEarlierRows);
}

function clearTimedHighlight() {
  if (wordHighlightTimer !== null) window.clearTimeout(wordHighlightTimer);
  wordHighlightTimer = null;
  timedHighlightRow = -1;
  timedHighlightCursor = 0;
}

function tokenHighlightDelay(token) {
  const text = token?.element.textContent || "";
  const letters = text.replace(/[^A-Za-z0-9]/g, "").length;
  const punctuationPause = /[.!?,;:]$/.test(text) ? 120 : 0;
  return Math.min(650, 205 + letters * 28 + punctuationPause);
}

function startTimedHighlight(rowIndex) {
  clearTimedHighlight();
  timedHighlightRow = rowIndex;
  timedHighlightCursor = 0;

  const advance = () => {
    if (!state.speaking || timedHighlightRow !== rowIndex) return;
    const row = transcriptRows[rowIndex];
    if (!row || timedHighlightCursor >= row.tokens.length) return;
    const tokenIndex = timedHighlightCursor++;
    highlightTranscriptToken(rowIndex, tokenIndex);
    wordHighlightTimer = window.setTimeout(advance, tokenHighlightDelay(row.tokens[tokenIndex]));
  };

  advance();
}

function completeTranscriptRow(rowIndex, includeEarlierRows = true) {
  const row = transcriptRows[rowIndex];
  if (!row) return;
  row.tokens.forEach(token => {
    token.element.classList.remove("is-current");
    token.element.classList.add("is-spoken");
  });
  if (includeEarlierRows) {
    transcriptRows.slice(0, rowIndex).forEach(item => item.tokens.forEach(token => token.element.classList.add("is-spoken")));
  }
}

function renderMobileChoices() {
  const container = document.querySelector("#mobile-choices");
  container.replaceChildren();
  let choices = wheelData.map((p, i) => ({ name: p.name, color: p.color, action: () => selectPrimary(i) }));
  if (state.primary !== null && state.secondary === null) {
    const primary = wheelData[state.primary];
    choices = primary.children.map((s, i) => ({ name: s.name, color: primary.color, action: () => selectSecondary(state.primary, i) }));
  } else if (state.primary !== null && state.secondary !== null) {
    const primary = wheelData[state.primary];
    choices = primary.children.flatMap((s, sIndex) => s.children.map(name => ({ name, color: primary.color, action: () => selectTertiary(state.primary, sIndex, name) })));
  }
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-chip${state.selected === choice.name ? " is-selected" : ""}${state.emojiOnly ? " is-emoji-only" : ""}`;
    button.style.setProperty("--chip-color", choice.color);
    button.textContent = state.emojiOnly ? (emotionEmojis[choice.name] || "🙂") : `${emotionEmojis[choice.name] || "🙂"} ${choice.name}`;
    button.setAttribute("aria-label", `Select ${choice.name}`);
    button.addEventListener("click", choice.action);
    container.append(button);
  });
}

function chooseVoice() {
  const voices = window.speechSynthesis?.getVoices() || [];
  return voices.find(v => /^en-(US|CA)/.test(v.lang) && /Samantha|Ava|Google|Natural|Premium/i.test(v.name))
    || voices.find(v => /^en-(US|CA)/.test(v.lang))
    || voices.find(v => /^en/.test(v.lang))
    || null;
}

function updateGlobalAudioButton() {
  const icon = globalAudioToggle.querySelector(".header-audio-button__icon");
  globalAudioToggle.setAttribute("aria-pressed", String(state.autoPlay));
  globalAudioToggle.setAttribute("aria-label", state.autoPlay ? "Turn automatic speech off" : "Turn automatic speech on");
  icon.textContent = state.autoPlay ? "🔊" : "🔇";
}

function utter(text, onStart, onEnd, emphasis = false, onBoundary = null) {
  const cleanText = String(text || "").trim();
  const formatted = /[.!?]$/.test(cleanText) ? cleanText : `${cleanText}.`;
  const item = new SpeechSynthesisUtterance(formatted);
  item.lang = "en-US";
  item.rate = 0.92;
  item.pitch = emphasis ? 1.04 : 1;
  const voice = chooseVoice();
  if (voice) item.voice = voice;
  item.onstart = onStart || null;
  item.onend = onEnd || null;
  item.onerror = onEnd || null;
  item.onboundary = onBoundary;
  return item;
}

function speakLesson() {
  if (!state.selected || !("speechSynthesis" in window)) return;
  stopSpeech();
  resetTranscript();
  state.speaking = true;
  updateGlobalAudioButton();
  playButton.classList.add("is-playing");
  playButton.querySelector(".sound-orb__icon").textContent = "■";
  playButton.querySelector(".sound-orb__label").textContent = "Stop";

  speechSynthesis.speak(utter(state.selected,
    () => startTimedHighlight(0),
    () => {
      clearTimedHighlight();
      completeTranscriptRow(0);
    },
    true,
    event => markTranscriptWord(0, event.charIndex)
  ));
  const lines = sentencesFor(state.selected);
  lines.forEach((text, index) => {
    speechSynthesis.speak(utter(text,
      () => startTimedHighlight(index + 1),
      () => {
      clearTimedHighlight();
      completeTranscriptRow(index + 1);
      if (index === lines.length - 1) finishSpeech();
    }, false, event => markTranscriptWord(index + 1, event.charIndex)));
  });
}

function finishSpeech() {
  clearTimedHighlight();
  state.speaking = false;
  playButton.classList.remove("is-playing");
  playButton.querySelector(".sound-orb__icon").textContent = "▶";
  playButton.querySelector(".sound-orb__label").textContent = "Listen";
  transcriptStatus.textContent = state.selected ? `${state.cefr} · Finished` : `${state.cefr} · Ready to listen`;
  transcriptStatus.classList.remove("is-speaking");
  updateGlobalAudioButton();
}

function stopSpeech() {
  clearTimedHighlight();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  transcriptRows.forEach(row => row.tokens.forEach(token => token.element.classList.remove("is-current")));
  finishSpeech();
}

function setWheelRotation(degrees) {
  state.rotation = ((degrees % 360) + 360) % 360;
  wheel.style.setProperty("--wheel-rotation", `${state.rotation}deg`);
}

document.querySelector("#rotate-left").addEventListener("click", () => setWheelRotation(state.rotation - 15));
document.querySelector("#rotate-right").addEventListener("click", () => setWheelRotation(state.rotation + 15));
document.querySelector("#reset-rotation").addEventListener("click", () => setWheelRotation(0));

const drag = { active: false, startAngle: 0, startRotation: 0, moved: false, blockClick: false };

function pointerAngle(event) {
  const rect = wheel.getBoundingClientRect();
  return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
}

wheel.addEventListener("pointerdown", event => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  drag.active = true;
  drag.moved = false;
  drag.blockClick = false;
  drag.startAngle = pointerAngle(event);
  drag.startRotation = state.rotation;
});

wheel.addEventListener("pointermove", event => {
  if (!drag.active) return;
  let delta = pointerAngle(event) - drag.startAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  if (Math.abs(delta) > 3 && !drag.moved) {
    drag.moved = true;
    wheel.classList.add("is-dragging");
    wheel.setPointerCapture(event.pointerId);
  }
  if (!drag.moved) return;
  setWheelRotation(drag.startRotation + delta);
});

function endWheelDrag(event) {
  if (!drag.active) return;
  drag.active = false;
  drag.blockClick = drag.moved;
  wheel.classList.remove("is-dragging");
  if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
}

wheel.addEventListener("pointerup", endWheelDrag);
wheel.addEventListener("pointercancel", endWheelDrag);
wheel.addEventListener("click", event => {
  if (!drag.blockClick) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  drag.blockClick = false;
}, true);

let savedClueLanguage = "en";
try {
  const storedClueLanguage = localStorage.getItem("english-club-clue-language");
  if (["en", "bn"].includes(storedClueLanguage)) savedClueLanguage = storedClueLanguage;
} catch (_) {}

const clueState = { mode: "behavior", language: savedClueLanguage, expanded: false, selected: new Set(), match: null };
const clueOptions = document.querySelector("#clue-options");
const clueResultContent = document.querySelector("#clue-result-content");
const clueBars = document.querySelector("#clue-bars");
const exploreMatch = document.querySelector("#explore-match");
const clearClues = document.querySelector("#clear-clues");
const showMoreClues = document.querySelector("#show-more-clues");

function emotionColor(name) {
  const category = wheelData.find(item => item.name === name);
  return primaryFill(category?.color || "#91a59b");
}

function clueMainEmotion(clue) {
  return Object.entries(clue.scores).sort((a, b) => b[1] - a[1])[0][0];
}

function updateClueCounts() {
  const countFor = type => clueData.filter(clue => clue.type === type && clueState.selected.has(clue.id)).length;
  document.querySelector("#behavior-count").textContent = countFor("behavior");
  document.querySelector("#sensation-count").textContent = countFor("sensation");
}

function renderClueOptions() {
  clueOptions.replaceChildren();
  clueOptions.setAttribute("aria-labelledby", `${clueState.mode}-tab`);
  const allClues = clueData.filter(clue => clue.type === clueState.mode);
  const visibleClues = clueState.expanded
    ? allClues
    : allClues.filter(clue => featuredClues[clueState.mode].includes(clue.id) || clueState.selected.has(clue.id));
  visibleClues.forEach(clue => {
    const button = document.createElement("button");
    const mainEmotion = clueMainEmotion(clue);
    button.type = "button";
    button.className = "clue-chip";
    button.textContent = clueState.language === "bn" ? clueBangla[clue.id] : clue.label;
    button.lang = clueState.language;
    button.style.setProperty("--clue-color", emotionColor(mainEmotion));
    button.setAttribute("aria-pressed", String(clueState.selected.has(clue.id)));
    button.addEventListener("click", () => {
      if (clueState.selected.has(clue.id)) clueState.selected.delete(clue.id);
      else clueState.selected.add(clue.id);
      button.setAttribute("aria-pressed", String(clueState.selected.has(clue.id)));
      updateClueCounts();
      updateClueResult();
    });
    clueOptions.append(button);
  });
  const languageText = clueLanguageText[clueState.language];
  showMoreClues.hidden = allClues.length <= 9;
  showMoreClues.setAttribute("aria-expanded", String(clueState.expanded));
  showMoreClues.textContent = clueState.expanded ? languageText.showLess : languageText.showAll(allClues.length);
  showMoreClues.lang = clueState.language;
  updateClueCounts();
}

function updateClueLanguage() {
  const languageText = clueLanguageText[clueState.language];
  document.querySelector("#clues-intro").textContent = languageText.intro;
  document.querySelector("#clues-intro").lang = clueState.language;
  document.querySelector("#behavior-tab-label").textContent = languageText.behavior;
  document.querySelector("#behavior-tab-label").lang = clueState.language;
  document.querySelector("#sensation-tab-label").textContent = languageText.sensation;
  document.querySelector("#sensation-tab-label").lang = clueState.language;
  document.querySelectorAll("[data-clue-language]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.clueLanguage === clueState.language));
  });
  renderClueOptions();
}

function updateClueResult() {
  const selectedClues = clueData.filter(clue => clueState.selected.has(clue.id));
  clearClues.disabled = selectedClues.length === 0;
  clueBars.replaceChildren();

  if (!selectedClues.length) {
    clueState.match = null;
    clueResultContent.innerHTML = "<h3>Start with one clue.</h3><p>Think about what you are doing or what you notice in your body right now.</p>";
    exploreMatch.hidden = true;
    return;
  }

  const scores = Object.fromEntries(wheelData.map(category => [category.name, 0]));
  selectedClues.forEach(clue => Object.entries(clue.scores).forEach(([emotion, points]) => { scores[emotion] += points; }));
  const ranked = Object.entries(scores).filter(([, score]) => score > 0).sort((a, b) => b[1] - a[1]);
  const topScore = ranked[0][1];
  const leaders = ranked.filter(([, score]) => score === topScore).map(([name]) => name);
  const top = leaders[0];
  clueState.match = top;
  const title = leaders.length > 1 ? leaders.slice(0, 2).join(" or ") : top;
  const summary = leaders.slice(0, 2).map(name => clueSummaries[name]).join(" ");
  const matchColor = emotionColor(top);

  clueResultContent.innerHTML = `<h3>Your clues point toward <span class="clue-result-content__name">${title}</span>.</h3><p>${summary}</p>`;
  clueResultContent.style.setProperty("--match-color", matchColor);

  ranked.slice(0, 3).forEach(([name, score]) => {
    const row = document.createElement("div");
    row.className = "clue-bar";
    row.innerHTML = `<div class="clue-bar__top"><span>${name}</span><span>${Math.round(score / topScore * 100)}%</span></div><div class="clue-bar__track"><div class="clue-bar__fill"></div></div>`;
    row.querySelector(".clue-bar__fill").style.setProperty("--bar-width", `${score / topScore * 100}%`);
    row.querySelector(".clue-bar__fill").style.setProperty("--bar-color", emotionColor(name));
    clueBars.append(row);
  });

  exploreMatch.hidden = false;
  exploreMatch.textContent = `Explore ${top} on the wheel ↑`;
}

document.querySelectorAll("[data-clue-mode]").forEach(tab => tab.addEventListener("click", () => {
  clueState.mode = tab.dataset.clueMode;
  clueState.expanded = false;
  document.querySelectorAll("[data-clue-mode]").forEach(item => item.setAttribute("aria-selected", String(item === tab)));
  renderClueOptions();
}));

document.querySelectorAll("[data-clue-language]").forEach(button => button.addEventListener("click", () => {
  clueState.language = button.dataset.clueLanguage;
  try { localStorage.setItem("english-club-clue-language", clueState.language); } catch (_) {}
  updateClueLanguage();
}));

showMoreClues.addEventListener("click", () => {
  clueState.expanded = !clueState.expanded;
  renderClueOptions();
});

clearClues.addEventListener("click", () => {
  clueState.selected.clear();
  renderClueOptions();
  updateClueResult();
});

exploreMatch.addEventListener("click", () => {
  if (!clueState.match) return;
  const index = wheelData.findIndex(category => category.name === clueState.match);
  selectPrimary(index);
  document.querySelector(".experience").scrollIntoView({ behavior: "smooth", block: "start" });
});

const pollApiOrigin = location.hostname === "dialogue-bd.github.io"
  ? "https://english-club-emotions.halcyondays.chatgpt.site"
  : "";
const pollState = { windowKey: "", loading: false };
const pollTotal = document.querySelector("#poll-total");
const pollUpdated = document.querySelector("#poll-updated");
const pollChart = document.querySelector("#poll-chart");
const popularWords = document.querySelector("#popular-words");
const pollReasons = document.querySelector("#poll-reasons");
const pollDate = document.querySelector("#poll-date");
const submitPoll = document.querySelector("#submit-poll");
const pollSubmitStatus = document.querySelector("#poll-submit-status");

function dhakaHour() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23", weekday: "long"
  }).formatToParts(new Date()).filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  const key = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}`;
  const nextHour = String((Number(parts.hour) + 1) % 24).padStart(2, "0");
  return { key, label: `${parts.hour}:00–${nextHour}:00 · ${parts.weekday}, ${parts.day}/${parts.month}/${parts.year} · Dhaka` };
}

function getResponseToken(windowKey) {
  const storageKey = `emotion-poll-token:${windowKey}`;
  try {
    let token = localStorage.getItem(storageKey);
    if (!token) {
      token = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(storageKey, token);
    }
    return token;
  } catch (_) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function setPollWindow() {
  const current = dhakaHour();
  if (pollState.windowKey && pollState.windowKey !== current.key) {
    pollSubmitStatus.textContent = "A new hourly check-in has started.";
  }
  pollState.windowKey = current.key;
  pollDate.textContent = current.label;
}

function renderPoll(data) {
  pollTotal.textContent = data.total;
  pollUpdated.textContent = data.total ? "Updated just now" : "Waiting for the first response…";
  pollChart.replaceChildren();
  const largest = Math.max(1, ...Object.values(data.counts));

  wheelData.forEach(category => {
    const count = data.counts[category.name] || 0;
    const row = document.createElement("div");
    row.className = "poll-row";
    row.innerHTML = `<span class="poll-row__label">${category.name}</span><div class="poll-row__track"><div class="poll-row__fill"></div></div><span class="poll-row__count">${count}</span>`;
    const fill = row.querySelector(".poll-row__fill");
    fill.style.setProperty("--poll-width", `${count / largest * 100}%`);
    fill.style.setProperty("--poll-min", count ? "4px" : "0");
    fill.style.setProperty("--poll-color", primaryFill(category.color));
    pollChart.append(row);
  });

  popularWords.replaceChildren();
  if (!data.specificCounts.length) {
    const empty = document.createElement("span");
    empty.className = "poll-empty";
    empty.textContent = "No responses yet.";
    popularWords.append(empty);
  } else {
    data.specificCounts.slice(0, 8).forEach(item => {
      const chip = document.createElement("span");
      chip.className = "popular-word";
      chip.textContent = item.emotion;
      const count = document.createElement("b");
      count.textContent = `×${item.count}`;
      chip.append(count);
      popularWords.append(chip);
    });
  }

  pollReasons.replaceChildren();
  if (!data.reasonsVisible) {
    const message = document.createElement("p");
    message.className = "poll-empty";
    message.textContent = "The first written reason will appear here.";
    pollReasons.append(message);
  } else if (!data.reasons.length) {
    const message = document.createElement("p");
    message.className = "poll-empty";
    message.textContent = "No one has added a reason yet.";
    pollReasons.append(message);
  } else {
    data.reasons.forEach(item => {
      const card = document.createElement("article");
      card.className = "reason-card";
      card.style.setProperty("--reason-color", emotionColor(item.primaryEmotion));
      const label = document.createElement("span");
      label.textContent = item.emotion;
      const reason = document.createElement("p");
      reason.textContent = item.reason;
      card.append(label, reason);
      pollReasons.append(card);
    });
  }
}

async function loadPoll() {
  if (pollState.loading || document.hidden) return;
  setPollWindow();
  pollState.loading = true;
  try {
    const response = await fetch(`${pollApiOrigin}/api/poll?window=${encodeURIComponent(pollState.windowKey)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Poll unavailable");
    renderPoll(await response.json());
  } catch (_) {
    pollUpdated.textContent = "Live poll is reconnecting…";
  } finally {
    pollState.loading = false;
  }
}

submitPoll.addEventListener("click", async () => {
  if (state.primary === null || !state.selected) return;
  setPollWindow();
  const reason = document.querySelector("#reason").value.trim();
  const primaryEmotion = wheelData[state.primary].name;
  submitPoll.disabled = true;
  pollSubmitStatus.textContent = "Sharing without your name…";
  try {
    const response = await fetch(`${pollApiOrigin}/api/poll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        window: pollState.windowKey,
        responseToken: getResponseToken(pollState.windowKey),
        primaryEmotion,
        emotion: state.selected,
        reason
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not share this response.");
    pollSubmitStatus.textContent = "Shared anonymously. You can update it again during this hour.";
    submitPoll.textContent = "Update my anonymous response";
    await loadPoll();
    document.querySelector("#daily-poll").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    pollSubmitStatus.textContent = error instanceof Error ? error.message : "Could not connect to the live poll.";
  } finally {
    submitPoll.disabled = false;
  }
});

setInterval(loadPoll, 5000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) loadPoll(); });

playButton.addEventListener("click", () => {
  if (state.speaking) return stopSpeech();
  speakLesson();
});
document.querySelector("#stop-audio").addEventListener("click", stopSpeech);
globalAudioToggle.addEventListener("click", () => {
  state.autoPlay = !state.autoPlay;
  try { localStorage.setItem("english-club-autoplay", String(state.autoPlay)); } catch (_) {}
  if (!state.autoPlay && state.speaking) stopSpeech();
  updateGlobalAudioButton();
});

function updateEmojiModeButton() {
  emojiModeButton.setAttribute("aria-pressed", String(state.emojiOnly));
  emojiModeButton.setAttribute("aria-label", state.emojiOnly ? "Show words and emojis on the emotions wheel" : "Show only emojis on the emotions wheel");
}

emojiModeButton.addEventListener("click", () => {
  state.emojiOnly = !state.emojiOnly;
  try { localStorage.setItem("english-club-emoji-only", String(state.emojiOnly)); } catch (_) {}
  updateEmojiModeButton();
  renderWheel();
});
const cefrButtons = [...document.querySelectorAll("#cefr-selector button")];

function updateCefrButtons() {
  cefrButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.level === state.cefr)));
}

cefrButtons.forEach(button => button.addEventListener("click", () => {
  const level = button.dataset.level;
  if (level === state.cefr) return;
  stopSpeech();
  state.cefr = level;
  try { localStorage.setItem("english-club-cefr", level); } catch (_) {}
  updateCefrButtons();
  if (state.selected) {
    const reason = document.querySelector("#reason").value;
    updateLesson(state.selected, state.trail, state.color);
    document.querySelector("#reason").value = reason;
    if (state.autoPlay) speakLesson();
  }
}));

document.querySelector("#start-over").addEventListener("click", () => {
  stopSpeech();
  state.primary = null;
  state.secondary = null;
  state.selected = null;
  transcriptCard.hidden = true;
  const definitionCard = document.querySelector("#definition-card");
  if (definitionCard) definitionCard.hidden = true;
  liveTranscript.replaceChildren();
  transcriptRows = [];
  setWheelRotation(0);
  setStep(1, "Choose one from the center");
  renderWheel();
});

window.addEventListener("beforeunload", stopSpeech);
if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = chooseVoice;
updateCefrButtons();
updateGlobalAudioButton();
updateEmojiModeButton();
renderWheel();
updateClueLanguage();
updateClueResult();
setPollWindow();
loadPoll();
