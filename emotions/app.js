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
    collocations: ["feel fear", "deep fear", "overcome fear", "fear of failure", "fear of heights"],
    colligations: ["in fear for", "driven by fear", "fear that happens", "fear about future", "no fear left"],
    distinctions: [
      "Fear is danger, not worry.",
      "Fear is urgent, not mild.",
      "Fear is threat, not doubt.",
      "Fear is survival, not weakness.",
      "Fear is physical, not emotional.",
      "Fear is alarm, not sadness.",
      "Fear is now, not later.",
      "Fear is acute, not dull.",
      "Fear is action, not thought.",
      "Fear is intense, not calm."
    ],
    dialogueC1: [
      "“My biggest fear is letting down the people who depend on me.”",
      "“He conquered his fear of public speaking by practicing every day.”",
      "“There was a moment of sheer fear when the brakes stopped responding.”",
      "“She tried to hide her fear, but her voice was trembling.”",
      "“You can't let fear paralyze you when opportunity knocks.”"
    ],
    dialogueC2: [
      "“My heart was in my throat the entire time I was up on stage.”",
      "“She froze in her tracks when the thunder cracked.”",
      "“My blood ran cold when I heard footsteps behind me.”",
      "“I was shaking like a leaf right before walking out.”",
      "“It scared the living daylights out of everyone present.”"
    ]
  },
  Anxious: {
    collocations: ["feel anxious", "socially anxious", "anxious thought", "anxious energy", "deeply anxious"],
    colligations: ["anxious about exams", "anxious to succeed", "feel anxious when", "too anxious to", "anxious waiting period"],
    distinctions: [
      "Anxious is doubt, not danger.",
      "Anxious is future, not present.",
      "Anxious is tension, not panic.",
      "Anxious is mind, not body.",
      "Anxious is waiting, not acting.",
      "Anxious is restless, not calm.",
      "Anxious is ongoing, not sudden.",
      "Anxious is uneasy, not safe.",
      "Anxious is concern, not fury.",
      "Anxious is hesitant, not steady."
    ],
    dialogueC1: [
      "“I always get anxious right before giving a big presentation.”",
      "“She was so anxious about the test results that she couldn't sleep.”",
      "“He looked anxious while waiting for the doctor to call his name.”",
      "“Sitting in traffic when you're late makes anyone feel anxious.”",
      "“Try to stay calm and don't get anxious over small delays.”"
    ],
    dialogueC2: [
      "“I've been on pins and needles all morning waiting for news.”",
      "“Having all eyes on me gives me serious butterflies in my stomach.”",
      "“She's running on pure nervous energy ahead of the meeting.”",
      "“I was sweating bullets until I finally got the confirmation.”",
      "“Don't work yourself up into a lather over a small detail.”"
    ]
  },
  Insecure: {
    collocations: ["feel insecure", "deeply insecure", "insecure feeling", "socially insecure", "emotionally insecure"],
    colligations: ["insecure about skills", "feel insecure around", "become insecure when", "too insecure to", "insecure in relationships"],
    distinctions: [
      "Insecure is doubt, not shyness.",
      "Insecure is self, not others.",
      "Insecure is worth, not safety.",
      "Insecure is unsteady, not calm.",
      "Insecure is quiet, not loud.",
      "Insecure is fragile, not strong.",
      "Insecure is inner, not outer.",
      "Insecure is fear, not anger.",
      "Insecure is hesitant, not bold.",
      "Insecure is low, not high."
    ],
    dialogueC1: [
      "“He felt insecure about his accent when he first moved here.”",
      "“Comparing yourself to people on social media will make you insecure.”",
      "“She was insecure about leading the team without prior experience.”",
      "“It's natural to feel insecure when starting out in a new field.”",
      "“His defensive attitude comes from feeling insecure about his role.”"
    ],
    dialogueC2: [
      "“I always feel like I'm swimming in deep water around experts.”",
      "“She's second-guessing every single decision she makes lately.”",
      "“Imposter syndrome really got the better of me on day one.”",
      "“He puts on a tough front, but he's deeply fragile inside.”",
      "“Don't sell yourself short—you earned your spot here.”"
    ]
  },
  Overwhelmed: {
    collocations: ["feel overwhelmed", "completely overwhelmed", "overwhelmed by work", "emotionally overwhelmed", "overwhelmed with tasks"],
    colligations: ["feel overwhelmed when", "become overwhelmed easily", "too overwhelmed to", "overwhelmed by choices", "deeply overwhelmed state"],
    distinctions: [
      "Overwhelmed is overload, not laziness.",
      "Overwhelmed is stuck, not busy.",
      "Overwhelmed is capacity, not fear.",
      "Overwhelmed is limit, not failure.",
      "Overwhelmed is heavy, not light.",
      "Overwhelmed is flooded, not clear.",
      "Overwhelmed is noise, not peace.",
      "Overwhelmed is chaos, not order.",
      "Overwhelmed is excess, not lack.",
      "Overwhelmed is stop, not go."
    ],
    dialogueC1: [
      "“I am completely overwhelmed by the sheer volume of emails today.”",
      "“She felt overwhelmed trying to balance work, family, and studies.”",
      "“Don't get overwhelmed—just take the project one step at a time.”",
      "“He was so overwhelmed by the support that he broke down in tears.”",
      "“The new manager looked overwhelmed during his first week on the floor.”"
    ],
    dialogueC2: [
      "“I'm completely snowed under with deadlines this week.”",
      "“My brain feels like it has fifty open tabs right now.”",
      "“She's reaching her breaking point with everything on her plate.”",
      "“I just need to take a step back before I drown in this.”",
      "“That final email was the straw that broke the camel's back.”"
    ]
  },
  Scared: {
    collocations: ["feel scared", "scared of heights", "deeply scared", "scared to death", "scared of failure"],
    colligations: ["feel scared when", "become scared suddenly", "too scared to", "scared of dark", "scared for future"],
    distinctions: [
      "Scared is threat, not stress.",
      "Scared is sudden, not slow.",
      "Scared is alarm, not worry.",
      "Scared is recoil, not advance.",
      "Scared is real, not fake.",
      "Scared is wild, not tame.",
      "Scared is reflex, not plan.",
      "Scared is shock, not calm.",
      "Scared is sharp, not soft.",
      "Scared is safety, not risk."
    ],
    dialogueC1: [
      "“I was scared to death when the thunderstorm knocked out the lights.”",
      "“She's scared of making mistakes in front of her supervisor.”",
      "“Don't be scared to ask questions if you don't understand the task.”",
      "“He got scared when he realized he had lost his way in the city.”",
      "“My dog gets scared every time there are loud fireworks outside.”"
    ],
    dialogueC2: [
      "“I was scared out of my wits when the door slammed shut.”",
      "“He was shaking like a leaf during his entire presentation.”",
      "“Don't let cold feet stop you right at the finish line.”",
      "“She was scared half to death by the loud bang outside.”",
      "“My heart skipped a beat when I stepped off the curb.”"
    ]
  },
  Terrified: {
    collocations: ["terrified of snakes", "completely terrified", "terrified look", "terrified voice", "deeply terrified"],
    colligations: ["terrified to enter", "feel terrified when", "become terrified instantly", "too terrified to", "terrified of loss"],
    distinctions: [
      "Terrified is dread, not worry.",
      "Terrified is frozen, not nervous.",
      "Terrified is extreme, not mild.",
      "Terrified is helpless, not steady.",
      "Terrified is panic, not concern.",
      "Terrified is severe, not light.",
      "Terrified is silent, not loud.",
      "Terrified is shock, not doubt.",
      "Terrified is cold, not warm.",
      "Terrified is trapped, not free."
    ],
    dialogueC1: [
      "“She was terrified of heights, so climbing the tower was huge.”",
      "“I was terrified that we wouldn't reach the hospital in time.”",
      "“He looked terrified as the severe turbulence shook the plane.”",
      "“The child was terrified of being left alone in the dark room.”",
      "“I get terrified just thinking about swimming in open ocean water.”"
    ],
    dialogueC2: [
      "“I was scared stiff when I looked down over the cliff.”",
      "“She froze in her tracks, completely petrified by the noise.”",
      "“My blood ran cold when I heard the alarm go off.”",
      "“He was trembling like a leaf after the near-miss.”",
      "“It scared the living daylights out of me when lights cut out.”"
    ]
  },
  Worried: {
    collocations: ["feel worried", "deeply worried", "worried look", "constantly worried", "worried parent"],
    colligations: ["worried about money", "worried that happens", "feel worried when", "too worried to", "worried for safety"],
    distinctions: [
      "Worried is mind, not body.",
      "Worried is future, not now.",
      "Worried is tension, not pain.",
      "Worried is outcome, not threat.",
      "Worried is restless, not calm.",
      "Worried is thought, not deed.",
      "Worried is uneasy, not angry.",
      "Worried is slow, not fast.",
      "Worried is doubt, not faith.",
      "Worried is care, not hate."
    ],
    dialogueC1: [
      "“My parents were worried sick when I didn't call after landing.”",
      "“She's worried that her application won't arrive before the deadline.”",
      "“He looked worried while reading through the contract terms.”",
      "“There's no point getting worried about things you cannot change.”",
      "“I'm worried about how the team will handle the sudden workload.”"
    ],
    dialogueC2: [
      "“I'm worried sick about how he's going to handle the news.”",
      "“She's been pacing the floor all evening waiting for a call.”",
      "“Don't lose any sleep over it—things usually sort themselves out.”",
      "“It's been weighing heavily on my mind ever since yesterday.”",
      "“He was beside himself with worry until they got home.”"
    ]
  },
  Happy: {
    collocations: ["feel happy", "genuinely happy", "happy memory", "happy moment", "extremely happy"],
    colligations: ["happy about news", "happy to help", "feel happy when", "make someone happy", "happy with results"],
    distinctions: [
      "Happy is calm, not thrill.",
      "Happy is warm, not cold.",
      "Happy is present, not past.",
      "Happy is light, not heavy.",
      "Happy is content, not greedy.",
      "Happy is quiet, not wild.",
      "Happy is safe, not scared.",
      "Happy is good, not bad.",
      "Happy is easy, not hard.",
      "Happy is smile, not frown."
    ],
    dialogueC1: [
      "“Seeing my family together after so long makes me truly happy.”",
      "“She was happy to hear that her best friend got the job offer.”",
      "“He gave a happy laugh when his daughter took her first steps.”",
      "“I'm just happy that everything worked out without any trouble.”",
      "“They built a simple, happy life in a quiet coastal town.”"
    ],
    dialogueC2: [
      "“I'm over the moon about getting into the program!”",
      "“He was walking on air for days after the proposal was accepted.”",
      "“Honestly, seeing everyone come together warms my heart.”",
      "“We had an absolute blast at the celebration last night.”",
      "“I couldn't be more pleased with how things turned out.”"
    ]
  },
  Confident: {
    collocations: ["feel confident", "highly confident", "confident voice", "confident smile", "deeply confident"],
    colligations: ["confident in skills", "confident about test", "feel confident when", "become confident with", "confident to speak"],
    distinctions: [
      "Confident is trust, not pride.",
      "Confident is quiet, not loud.",
      "Confident is steady, not rash.",
      "Confident is ready, not shy.",
      "Confident is sure, not boastful.",
      "Confident is calm, not angry.",
      "Confident is strong, not weak.",
      "Confident is poise, not fear.",
      "Confident is clear, not lost.",
      "Confident is firm, not soft."
    ],
    dialogueC1: [
      "“She walked into the interview room feeling calm and confident.”",
      "“He was confident that his team had prepared thoroughly.”",
      "“Speaking clearly helps you sound more confident during presentations.”",
      "“I feel confident about our chances of winning the contract.”",
      "“Practice builds skill, and skill makes you truly confident.”"
    ],
    dialogueC2: [
      "“She carried herself with quiet poise throughout the tough interview.”",
      "“He was in his element presenting the project to the board.”",
      "“I feel like I really hit my stride after the first few months.”",
      "“Walk in there with your head held high—you know your stuff.”",
      "“She didn't bat an eye when asked the most difficult question.”"
    ]
  },
  Excited: {
    collocations: ["feel excited", "super excited", "excited voice", "excited about trip", "deeply excited"],
    colligations: ["excited to meet", "excited for weekend", "feel excited when", "become excited easily", "too excited to"],
    distinctions: [
      "Excited is eager, not calm.",
      "Excited is high, not low.",
      "Excited is future, not present.",
      "Excited is fast, not slow.",
      "Excited is spark, not shade.",
      "Excited is active, not passive.",
      "Excited is thrill, not fear.",
      "Excited is wild, not quiet.",
      "Excited is glad, not sad.",
      "Excited is jump, not sit."
    ],
    dialogueC1: [
      "“The kids are so excited about going to the amusement park tomorrow.”",
      "“I'm really excited to collaborate on this new project with you.”",
      "“She sounded excited when describing her upcoming trip to Asia.”",
      "“He was too excited to sleep the night before the championship.”",
      "“We are excited to share our latest product updates with everyone.”"
    ],
    dialogueC2: [
      "“I'm bouncing off the walls waiting for the concert tonight!”",
      "“She was beside herself with excitement when she opened the gift.”",
      "“We're all hyped up for the championship game this weekend.”",
      "“He was like a kid in a candy store when he walked into the expo.”",
      "“I can barely contain my enthusiasm for this new project.”"
    ]
  },
  Joyful: {
    collocations: ["feel joyful", "joyful heart", "joyful occasion", "deeply joyful", "purely joyful"],
    colligations: ["joyful about life", "joyful to give", "feel joyful in", "make someone joyful", "joyful celebration"],
    distinctions: [
      "Joyful is deep, not surface.",
      "Joyful is inner, not outer.",
      "Joyful is lasting, not quick.",
      "Joyful is radiant, not loud.",
      "Joyful is spirit, not mind.",
      "Joyful is warm, not cold.",
      "Joyful is light, not dark.",
      "Joyful is gift, not trade.",
      "Joyful is rich, not poor.",
      "Joyful is life, not death."
    ],
    dialogueC1: [
      "“The wedding celebration was a deeply joyful occasion for everyone.”",
      "“She burst into joyful laughter when she opened the surprise package.”",
      "“There was a joyful energy in the air during the holiday festival.”",
      "“Helping others brings a quiet, joyful satisfaction to his heart.”",
      "“They shared a joyful moment when the final goal was scored.”"
    ],
    dialogueC2: [
      "“Her face lit up with pure joy when she saw her old friend.”",
      "“There was an infectious sense of joy spreading through the crowd.”",
      "“It brought immense joy to my heart to see them reconciled.”",
      "“We were singing at the top of our lungs out of sheer delight.”",
      "“She has a buoyant spirit that brightens up any room.”"
    ]
  },
  Optimistic: {
    collocations: ["feel optimistic", "optimistic outlook", "cautiously optimistic", "deeply optimistic", "always optimistic"],
    colligations: ["optimistic about future", "optimistic for success", "feel optimistic when", "remain optimistic under", "optimistic frame of mind"],
    distinctions: [
      "Optimistic is hope, not blind.",
      "Optimistic is future, not past.",
      "Optimistic is forward, not back.",
      "Optimistic is bright, not dark.",
      "Optimistic is open, not closed.",
      "Optimistic is can, not cannot.",
      "Optimistic is light, not heavy.",
      "Optimistic is active, not passive.",
      "Optimistic is faith, not fear.",
      "Optimistic is growth, not loss."
    ],
    dialogueC1: [
      "“Despite the tough market conditions, she remains optimistic.”",
      "“He takes an optimistic approach to solving complex problems.”",
      "“I am cautiously optimistic about our quarterly performance targets.”",
      "“Her optimistic attitude keeps the entire team motivated.”",
      "“It's good to stay optimistic even when facing temporary setbacks.”"
    ],
    dialogueC2: [
      "“I'm looking on the bright side despite the rainy forecast.”",
      "“Every cloud has a silver lining if you look hard enough.”",
      "“She always sees the glass as half full, no matter what happens.”",
      "“I'm keeping my fingers crossed for a smooth outcome.”",
      "“He maintains a sunny disposition even during tough times.”"
    ]
  },
  Peaceful: {
    collocations: ["feel peaceful", "peaceful mind", "peaceful place", "deeply peaceful", "truly peaceful"],
    colligations: ["peaceful after work", "peaceful in nature", "feel peaceful when", "become peaceful with", "peaceful environment"],
    distinctions: [
      "Peaceful is calm, not noisy.",
      "Peaceful is still, not wild.",
      "Peaceful is rest, not rush.",
      "Peaceful is smooth, not rough.",
      "Peaceful is soft, not hard.",
      "Peaceful is light, not dark.",
      "Peaceful is free, not bound.",
      "Peaceful is deep, not shallow.",
      "Peaceful is safe, not scared.",
      "Peaceful is silent, not loud."
    ],
    dialogueC1: [
      "“Sitting by the lake at sunrise gives me a peaceful feeling.”",
      "“She enjoyed a peaceful afternoon reading in the quiet garden.”",
      "“After a long busy week, I just need a peaceful weekend at home.”",
      "“His gentle voice created a peaceful atmosphere in the room.”",
      "“The mountain village offered a peaceful escape from city noise.”"
    ],
    dialogueC2: [
      "“I felt at total peace sitting by the quiet lake at sunrise.”",
      "“She has a serene presence that puts everyone at ease.”",
      "“After all the drama settled down, a sense of calm washed over the house.”",
      "“My mind was completely at rest for the first time in weeks.”",
      "“It was a smooth sailing afternoon with zero stress.”"
    ]
  },
  Proud: {
    collocations: ["feel proud", "proud moment", "deeply proud", "proud parent", "immensely proud"],
    colligations: ["proud of work", "proud to serve", "feel proud when", "make someone proud", "proud achievement"],
    distinctions: [
      "Proud is honor, not boast.",
      "Proud is effort, not luck.",
      "Proud is tall, not low.",
      "Proud is inner, not outer.",
      "Proud is growth, not greed.",
      "Proud is work, not rest.",
      "Proud is glad, not mean.",
      "Proud is earned, not given.",
      "Proud is firm, not weak.",
      "Proud is warm, not cold."
    ],
    dialogueC1: [
      "“Her parents were immensely proud when she graduated with honors.”",
      "“He felt proud of the house he had built with his own hands.”",
      "“You should be proud of how hard you worked to get here.”",
      "“She took a proud stance as she received the community award.”",
      "“Our team is proud to contribute to such a meaningful cause.”"
    ],
    dialogueC2: [
      "“I'm bursting with pride seeing how far you've come!”",
      "“She stood tall and took a well-deserved bow after the performance.”",
      "“He wore his hard-earned medal like a badge of honor.”",
      "“You should hold your head high after everything you accomplished.”",
      "“That was a feather in her cap that nobody can take away.”"
    ]
  },
  Anger: {
    collocations: ["feel anger", "blind anger", "suppress anger", "express anger", "righteous anger"],
    colligations: ["anger at someone", "anger over decision", "feel anger when", "channel anger into", "filled with anger"],
    distinctions: [
      "Anger is protest, not hurt.",
      "Anger is fire, not ice.",
      "Anger is push, not pull.",
      "Anger is loud, not quiet.",
      "Anger is boundaries, not hatred.",
      "Anger is action, not grief.",
      "Anger is hot, not cold.",
      "Anger is fight, not flight.",
      "Anger is now, not later.",
      "Anger is force, not weakness."
    ],
    dialogueC1: [
      "“He struggled to contain his anger after the unfair treatment.”",
      "“Her eyes flashed with anger when she heard the dishonest claim.”",
      "“Miscommunication can easily lead to unnecessary anger between friends.”",
      "“Channel your anger into constructive action rather than yelling.”",
      "“You could hear the rising anger in his voice during the debate.”"
    ],
    dialogueC2: [
      "“I was seeing red when I saw how unfairly she was treated.”",
      "“Don't blow your top over a minor miscommunication.”",
      "“He really hit a raw nerve with that comment.”",
      "“I had to bite my tongue so I wouldn't snap at him.”",
      "“She was steaming mad after waiting two hours for nothing.”"
    ]
  },
  Sad: {
    collocations: ["feel sad", "deeply sad", "sad story", "sad truth", "heartbreakingly sad"],
    colligations: ["sad about loss", "sad to leave", "feel sad when", "make someone sad", "too sad to"],
    distinctions: [
      "Sad is loss, not tired.",
      "Sad is heavy, not light.",
      "Sad is quiet, not angry.",
      "Sad is tears, not fire.",
      "Sad is grief, not fear.",
      "Sad is hurt, not mean.",
      "Sad is down, not up.",
      "Sad is processing, not fighting.",
      "Sad is soft, not sharp.",
      "Sad is slow, not fast."
    ],
    dialogueC1: [
      "“It made me sad to say goodbye to my colleagues after five years.”",
      "“She felt sad watching her old childhood neighborhood change.”",
      "“He looked sad as he read the final chapter of the story.”",
      "“It's completely normal to feel sad when missing loved ones.”",
      "“The sad news brought a quiet hush over the entire office.”"
    ],
    dialogueC2: [
      "“I've been feeling down in the dumps ever since.”",
      "“It really broke my heart to see him pack his things.”",
      "“She's had a heavy heart all week after hearing the news.”",
      "“I'm just going through a rough patch right now.”",
      "“It brought a tear to my eye seeing them say goodbye.”"
    ]
  },
  Disgust: {
    collocations: ["deep disgust", "feel disgust", "look of disgust", "moral disgust", "utter disgust"],
    colligations: ["disgust at behavior", "disgusted by smell", "turn in disgust", "filled with disgust", "express disgust towards"],
    distinctions: [
      "Disgust is recoil, not dislike.",
      "Disgust is stomach, not head.",
      "Disgust is away, not near.",
      "Disgust is foul, not sweet.",
      "Disgust is physical, not moral.",
      "Disgust is turn, not fight.",
      "Disgust is sick, not mad.",
      "Disgust is sharp, not dull.",
      "Disgust is push, not hold.",
      "Disgust is gross, not fine."
    ],
    dialogueC1: [
      "“She pulled her hand back in disgust after touching the slime.”",
      "“He expressed disgust at how much food was wasted at the party.”",
      "“A look of disgust crossed his face when he smelled the spoiled milk.”",
      "“The dishonest corruption scandal caused widespread public disgust.”",
      "“I turned away in disgust when I saw the filthy alleyway.”"
    ],
    dialogueC2: [
      "“Ugh, that smells so foul it turned my stomach immediately.”",
      "“I was completely grossed out by the dirty counter.”",
      "“His dishonest behavior left a really bad taste in my mouth.”",
      "“She recoiled the moment she opened the container.”",
      "“I couldn't even look at it—it was revolting.”"
    ]
  },
  Surprise: {
    collocations: ["total surprise", "pleasant surprise", "caught by surprise", "look of surprise", "gasp in surprise"],
    colligations: ["surprised by news", "surprised to hear", "feel surprised when", "taken by surprise", "much to surprise"],
    distinctions: [
      "Surprise is sudden, not slow.",
      "Surprise is shock, not fear.",
      "Surprise is new, not old.",
      "Surprise is gasp, not sigh.",
      "Surprise is open, not closed.",
      "Surprise is quick, not long.",
      "Surprise is now, not next.",
      "Surprise is shift, not stay.",
      "Surprise is flash, not shadow.",
      "Surprise is fresh, not stale."
    ],
    dialogueC1: [
      "“His unexpected visit was a wonderful surprise for the whole family.”",
      "“She gasped in surprise when she saw the birthday decorations.”",
      "“To my great surprise, the complex problem turned out to be easy.”",
      "“He couldn't hide his surprise when his name was called first.”",
      "“Life is full of surprise twists that change our direction.”"
    ],
    dialogueC2: [
      "“Out of the blue, she called me up after five years!”",
      "“That caught me completely off guard—I didn't see it coming.”",
      "“My jaw dropped when I saw the final test scores.”",
      "“I had to do a double take when he walked in.”",
      "“Well, knock me down with a feather—I never expected that!”"
    ]
  }
};

const customC2Data = {
  Frightened: [
    `"I jumped clean out of my skin when the door slammed."`,
    `"She went white as a sheet the moment she saw the shadow."`,
    `"He bolted out of there like a bat out of hell."`,
    `"My heart was hammering so hard I thought it would come through my chest."`,
    `"I was so frightened I practically flew to the other side of the room."`
  ],
  Mad: [
    `"I completely lost my cool when I heard what had happened."`,
    `"That was the last straw—I finally blew my top."`,
    `"He flew off the handle over the tiniest little thing."`,
    `"I had to walk away before I said something I'd seriously regret."`,
    `"She was absolutely hopping mad and not hiding it one bit."`
  ],
  Enraged: [
    `"He went absolutely ballistic when he found out."`,
    `"I hit the roof when I saw what they'd done behind our backs."`,
    `"She was fit to be tied by the end of that meeting."`,
    `"He was absolutely livid and not even trying to hide it."`,
    `"I was so enraged I could barely see straight."`
  ],
  Furious: [
    `"I was absolutely seething when I finally got off that call."`,
    `"She was spitting feathers by the time he showed up."`,
    `"I was so furious I had to leave before I completely lost it."`,
    `"He was steaming—you could practically see smoke coming out his ears."`,
    `"They were up in arms the moment the decision came down."`
  ],
  Hurt: [
    `"That really cut me to the quick, I won't lie."`,
    `"What she said knocked the wind right out of me."`,
    `"It stings more because it came from someone I actually trusted."`,
    `"That hit me right where it hurts."`,
    `"I'm still licking my wounds over that one."`
  ],
  Devastated: [
    `"When I heard, my whole world just came crashing down."`,
    `"She was completely gutted—it took weeks for her to come around."`,
    `"He fell apart at the seams after the separation."`,
    `"I was absolutely floored—I couldn't even form a sentence."`,
    `"It pulled the rug completely out from under everything we'd built."`
  ],
  Embarrassed: [
    `"I wanted the ground to open up and swallow me whole."`,
    `"My face went bright red—I must have looked absolutely ridiculous."`,
    `"I could have died on the spot, honestly."`,
    `"I was absolutely mortified the moment the words left my mouth."`,
    `"I'm still cringing about it weeks later."`
  ],
  Threatened: [
    `"My hackles went up the moment he walked into the room."`,
    `"Every alarm bell in my head started going off at once."`,
    `"I felt like I was being backed into a corner with nowhere to go."`,
    `"Something about the whole setup put me immediately on edge."`,
    `"I kept my guard up all evening—something felt very off."`
  ],
  Jealous: [
    `"The green-eyed monster really got the better of me that night."`,
    `"I couldn't help feeling a pang every time they were together."`,
    `"My nose was well out of joint when she got the role I wanted."`,
    `"I hate to admit it, but I was absolutely green with envy."`,
    `"I kept comparing myself and it was eating me alive."`
  ],
  Distant: [
    `"I was there in body but not in spirit the whole evening."`,
    `"I just wasn't present—I had one foot out the door mentally."`,
    `"I phoned it in all week without really knowing why."`,
    `"She drifted off somewhere in her own world and we couldn't reach her."`,
    `"He was miles away every time we tried to talk to him."`
  ],
  Suspicious: [
    `"I smelled a rat the moment she changed her story."`,
    `"Something about the whole thing just didn't add up."`,
    `"My gut was screaming that something wasn't right."`,
    `"I had a sneaking suspicion something was going on behind the scenes."`,
    `"He kept giving me the runaround, which only made things worse."`
  ],
  Withdrawn: [
    `"She retreated into her shell and wouldn't let anyone in."`,
    `"He went completely quiet and put up walls around himself."`,
    `"I pulled back from everyone for a while—I just needed the space."`,
    `"She shut down the moment things got too intense."`,
    `"He was present physically but completely closed off inside."`
  ],
  Inadequate: [
    `"I feel like I'm totally out of my depth in these meetings."`,
    `"It's like I'm always punching above my weight and barely keeping up."`,
    `"I was in way over my head and everyone seemed to know it."`,
    `"I felt like a complete fraud sitting at that table."`,
    `"No matter how hard I tried, I just couldn't measure up."`
  ],
  Inferior: [
    `"I always feel like the odd one out when everyone else just gets it."`,
    `"I spent the whole evening feeling like second fiddle to everyone there."`,
    `"It's like I don't belong in the room—they're just on a different level."`,
    `"I constantly felt like I had to prove myself just to be taken seriously."`,
    `"Next to her, I felt completely small and invisible."`
  ],
  Rejected: [
    `"I got the cold shoulder from the whole group without any explanation."`,
    `"Being left out in the cold like that really knocks you sideways."`,
    `"I felt like an outsider looking in through the window."`,
    `"The door was shut in my face before I even got a chance to speak."`,
    `"You don't forget the feeling of being shown the door like that."`
  ],
  Alienated: [
    `"I felt like a fish out of water the entire time I was there."`,
    `"I couldn't relate to a single person in the room—it was completely isolating."`,
    `"It was like being a stranger in a strange land, even among people I knew."`,
    `"No matter what I said, I just couldn't find a way in."`,
    `"I was on the outside looking in, and nobody was holding the door open."`
  ],
  Disrespected: [
    `"She talked down to me like I had absolutely no idea what I was doing."`,
    `"They walked all over my input like it didn't count for anything."`,
    `"I was treated like I was nobody—like my presence didn't even register."`,
    `"He cut me off mid-sentence without a second thought."`,
    `"Being talked over in every single meeting really takes its toll on you."`
  ],
  Confused: [
    `"I couldn't make head or tail of what was going on."`,
    `"My head was completely spinning by the time they finished explaining."`,
    `"It went clean over my head the first three times."`,
    `"I'd lost the thread entirely by the halfway point."`,
    `"None of it was computing—I just stared and nodded."`
  ],
  Disillusioned: [
    `"Once the scales fell from my eyes, I couldn't unsee any of it."`,
    `"The magic was completely gone after I found out the truth."`,
    `"You build something up so much, and then reality just shatters it."`,
    `"I felt like I'd been sold a dream that turned out to be smoke and mirrors."`,
    `"The whole thing left a really bitter taste in my mouth."`
  ],
  Perplexed: [
    `"I couldn't wrap my head around it no matter how many times I read it."`,
    `"It just didn't compute—the pieces weren't fitting together."`,
    `"I didn't know which way was up by the time she'd finished talking."`,
    `"The more I thought about it, the less sense it made."`,
    `"It's still a complete puzzle to me, if I'm being honest."`
  ],
  Startled: [
    `"I jumped clean out of my skin when the alarm went off."`,
    `"That nearly gave me a heart attack—I didn't hear them come in."`,
    `"She practically hit the ceiling when the door banged."`,
    `"He shot up out of his chair like he'd been given an electric shock."`,
    `"Don't creep up on me like that—my heart's still racing."`
  ],
  Shocked: [
    `"I was absolutely floored when the announcement came through."`,
    `"It knocked me for six—I just sat there in complete silence."`,
    `"I couldn't believe my ears when she told me what had happened."`,
    `"The news stopped me dead in my tracks."`,
    `"My mind went completely blank—I couldn't form a single word."`
  ],
  Dismayed: [
    `"My heart sank the moment I heard how bad it had gotten."`,
    `"The bottom fell completely out of my plans when I heard the news."`,
    `"I couldn't believe it had come to this—we'd worked so hard."`,
    `"It was a real gut punch watching it all fall apart like that."`,
    `"I just stood there shaking my head—it was hard to take in."`
  ],
  Amazed: [
    `"I was absolutely blown away by the whole performance."`,
    `"I couldn't believe my eyes—it was beyond anything I'd imagined."`,
    `"She left us completely gobsmacked from start to finish."`,
    `"My jaw literally dropped when I saw what they'd built."`,
    `"It just took my breath away—I had absolutely nothing to say."`
  ],
  Astonished: [
    `"My jaw hit the floor when he walked through the door."`,
    `"I was completely gobsmacked—I had no words for it whatsoever."`,
    `"It was beyond belief—I had to ask twice if it was actually real."`,
    `"She stopped dead in her tracks when she saw the results."`,
    `"Nobody saw that coming—we were all absolutely floored."`
  ],
  Awe: [
    `"It stopped me dead in my tracks—I just stood there taking it all in."`,
    `"You feel very small standing there, in the best possible way."`,
    `"It was one of those moments that take your breath clean away."`,
    `"Words honestly don't do it justice—you just have to be there."`,
    `"Something about it made the whole world go quiet for a second."`
  ],
  Eager: [
    `"I was raring to go from the moment I heard about it."`,
    `"I'm chomping at the bit to get started on this one."`,
    `"She was itching to dive in the second they gave the green light."`,
    `"I couldn't wait to sink my teeth into the project."`,
    `"He was first in line before we'd even confirmed the details."`
  ],
  Energetic: [
    `"I was firing on all cylinders from the moment I woke up."`,
    `"She was in full swing before everyone else had finished their coffee."`,
    `"I was buzzing all morning—couldn't sit still if I tried."`,
    `"He hit the ground running on day one and never looked back."`,
    `"I had so much fuel in the tank I didn't know what to do with it."`
  ],
  Liberated: [
    `"It felt like a weight had lifted straight off my shoulders."`,
    `"I could finally breathe again—properly breathe."`,
    `"It gave me a whole new lease on life after everything I'd been through."`,
    `"Handing in that resignation felt like walking out of a cage."`,
    `"I felt completely unchained for the first time in years."`
  ],
  Ecstatic: [
    `"I was on cloud nine for the rest of the week."`,
    `"She was absolutely beside herself with joy when she found out."`,
    `"I could have floated home—I was that happy."`,
    `"Honestly, I'm still pinching myself."`,
    `"We were over the moon—it was the best news we'd ever had."`
  ],
  Important: [
    `"For the first time, I actually felt like I had a voice in the room."`,
    `"It meant everything to know my input was genuinely valued."`,
    `"People were leaning in when I spoke—that doesn't happen often."`,
    `"I finally felt like I was part of something, not just along for the ride."`,
    `"She made me feel like what I had to say actually mattered."`
  ],
  Open: [
    `"I went in with a completely clean slate and a fresh pair of eyes."`,
    `"I'm all ears—throw it at me and let's see where it lands."`,
    `"I was willing to throw out the rulebook if it meant something better."`,
    `"Come to me with anything—I won't shoot it down before I've heard you out."`,
    `"I went in without a fixed position and it was surprisingly refreshing."`
  ],
  Inspired: [
    `"Ideas were flying around my head so fast I couldn't write quick enough."`,
    `"She fired me up in a way I hadn't felt in a long time."`,
    `"I was on fire after that talk—I couldn't wait to get to work."`,
    `"Something clicked and suddenly everything felt possible."`,
    `"It lit a spark in me that I thought had been well and truly out."`
  ],
  Hopeful: [
    `"There's finally a light at the end of the tunnel."`,
    `"I think we're really starting to turn a corner."`,
    `"Things are finally starting to look up—I can feel it."`,
    `"It's not much, but it's enough to keep me going for now."`,
    `"For the first time in a while, I woke up thinking things might be okay."`
  ],
  Loving: [
    `"I'd move mountains for that person without a second thought."`,
    `"My heart was completely full just watching them from across the room."`,
    `"I honestly couldn't picture my life without them in it."`,
    `"The love I have for them is just bone deep—it never goes away."`,
    `"I'd do anything for them, and I mean that without any reservation."`
  ],
  Avoidance: [
    `"I just couldn't bring myself to face it, so I kept putting it off."`,
    `"I gave it a wide berth for as long as I possibly could."`,
    `"Every time it came up, I found a reason to be somewhere else."`,
    `"I danced around it for months before finally sitting down with it."`,
    `"I kept finding excuses—anything not to have to deal with it."`
  ],
  Hesitant: [
    `"I dragged my feet on the decision a lot longer than I should have."`,
    `"I sat on the fence for way too long and nearly missed my chance."`,
    `"I couldn't quite pull the trigger—something kept holding me back."`,
    `"I kept second-guessing myself right up to the last minute."`,
    `"I was in two minds about it the whole way through."`
  ],
  Aversion: [
    `"My skin crawls just thinking about it—I honestly can't help it."`,
    `"It turns my stomach—I have a really visceral reaction to it."`,
    `"I just can't stomach it no matter how hard I try."`,
    `"Even the idea of it makes me want to look the other way."`,
    `"I've always had a strong aversion to it—it's not rational, it just is."`
  ],
  Disapproval: [
    `"I raised an eyebrow at that—it didn't sit well with me at all."`,
    `"She wasn't impressed one bit, and she didn't hold back saying so."`,
    `"I shook my head when I heard—it wasn't the right call."`,
    `"That's not something I can get behind, and I was very clear about that."`,
    `"He made his feelings known without raising his voice—very pointed."`
  ],
  Judgmental: [
    `"I'll hold my hand up—I wrote her off before I'd even spoken to her."`,
    `"I pointed the finger too fast without knowing the full story."`,
    `"I jumped to conclusions and made a complete fool of myself."`,
    `"I had him pegged as trouble from day one—unfairly, as it turned out."`,
    `"I need to stop making snap judgments—it doesn't serve anyone."`
  ],
  Loathing: [
    `"I can't stand the sight of him—it goes back years."`,
    `"The very thought of it makes my blood boil."`,
    `"I have a deep-rooted contempt for that kind of behavior."`,
    `"Every time his name comes up, my stomach turns."`,
    `"It's not something I can explain rationally—I just despise it entirely."`
  ],
  Awful: [
    `"I felt absolutely terrible about it—truly one of my worst moments."`,
    `"That was a real low point for all of us, no question."`,
    `"It hit rock bottom before we even knew what was happening."`,
    `"I've felt rough before, but nothing quite like that."`,
    `"I walked away from it feeling completely hollowed out."`
  ],
  Revulsion: [
    `"It made my stomach turn the second I saw it."`,
    `"I practically gagged—I couldn't even look at it properly."`,
    `"I still can't get the image out of my head, weeks later."`,
    `"My whole body recoiled before my brain had even processed it."`,
    `"I've never had such a gut reaction to anything in my life."`
  ],
  Detestable: [
    `"That kind of behavior is completely beyond the pale."`,
    `"I have absolutely no stomach for that sort of thing."`,
    `"It crosses every line I have—there's no coming back from it."`,
    `"Some things are just indefensible, and that's one of them."`,
    `"I find it morally reprehensible, and I'm not going to pretend otherwise."`
  ],
  Disappointed: [
    `"It really took the shine off everything we'd been working toward."`,
    `"It fell well short of what we'd been promised—a real letdown."`,
    `"I was let down pretty badly, and it was hard not to take personally."`,
    `"I had high hopes going in, and it just didn't deliver."`,
    `"After all that build-up, it was a proper anticlimax."`
  ],
  Revolted: [
    `"It nearly made me sick to my stomach on the spot."`,
    `"I couldn't look at it twice—it crossed a line I can't forgive."`,
    `"My whole body recoiled the moment I realized what it was."`,
    `"It was deeply offensive—I had to leave the room."`,
    `"I can't even talk about it without feeling physically ill."`
  ],
  Repugnant: [
    `"It goes against every grain of my being—I won't even entertain it."`,
    `"That crosses every line imaginable and then some."`,
    `"I find it completely beyond the pale on every level."`,
    `"It's morally offensive in a way I don't have words for."`,
    `"The very idea of it is abhorrent to me—I won't soften that."`
  ],
  Bored: [
    `"I was climbing the walls by the second hour."`,
    `"It was like watching paint dry—absolutely no end in sight."`,
    `"I was counting ceiling tiles by the time lunch finally came."`,
    `"I've been going through the motions all week with nothing to show for it."`,
    `"I was so bored I started making up games just to stay awake."`
  ],
  Indifferent: [
    `"I genuinely couldn't care less either way—it's all the same to me."`,
    `"Six of one, half a dozen of the other—I'm not fussed."`,
    `"Makes absolutely no odds to me—you decide."`,
    `"I've got no horse in this race, so do what you like."`,
    `"I've got no strong feelings about it at all, if I'm being honest."`
  ],
  Apathetic: [
    `"I've just been going through the motions for months now."`,
    `"I couldn't be bothered to lift a finger about it either way."`,
    `"I'm doing just enough to get by and that's about it."`,
    `"Nothing really lands anymore—I just let it wash over me."`,
    `"I used to care deeply about this, but the spark's just gone."`
  ],
  Lonely: [
    `"You can go a whole day without a single real conversation, and it hollows you out."`,
    `"I'm just rattling around in an empty house with nobody to talk to."`,
    `"It's the kind of lonely you feel even in a crowded room."`,
    `"I've got people all around me and still feel completely alone."`,
    `"You can only fill the silence for so long before it really gets to you."`
  ],
  Isolated: [
    `"I felt completely off the map out there—cut off from everything familiar."`,
    `"It was like I'd fallen off the face of the earth for a while."`,
    `"I was so far removed from everything that it started to mess with my head."`,
    `"There was nobody around who remotely understood what I was going through."`,
    `"You can handle a lot, but complete isolation really wears you down."`
  ],
  Abandoned: [
    `"I was left to fend for myself when I needed support the most."`,
    `"They hung me out to dry without a second thought."`,
    `"It felt like being thrown to the wolves after everything I'd done."`,
    `"I was out on my own with absolutely no one in my corner."`,
    `"The person I counted on most just disappeared when things got hard."`
  ],
  Despair: [
    `"I was completely at the end of my rope—there was nothing left."`,
    `"I couldn't see a single way out, no matter which direction I looked."`,
    `"I'd hit rock bottom and didn't have the strength to start climbing."`,
    `"I was running on empty and I just stopped caring."`,
    `"For a while, I genuinely stopped believing things could ever get better."`
  ],
  Vulnerable: [
    `"I went in with my heart on my sleeve and left myself wide open."`,
    `"I felt completely exposed out there with nothing to fall back on."`,
    `"I dropped my guard and let people see the parts I usually keep hidden."`,
    `"There was no armor left—I was completely raw."`,
    `"Putting yourself out there like that takes everything you've got."`
  ],
  Powerless: [
    `"My hands were completely tied—there was nothing I could do."`,
    `"I was fighting with one arm behind my back the entire time."`,
    `"I watched it happen and couldn't do a single thing to stop it."`,
    `"The decision was out of my hands and I just had to live with it."`,
    `"It's an awful feeling, watching something unfold with zero control."`
  ],
  Guilty: [
    `"It's been eating me up inside ever since it happened."`,
    `"I tossed and turned over it for weeks—I couldn't let it go."`,
    `"I couldn't live with myself knowing what I'd done."`,
    `"It's been sitting on my chest like a stone I can't shift."`,
    `"I owe an apology that I still haven't found the courage to give."`
  ],
  Ashamed: [
    `"I couldn't look anyone in the eye for days afterward."`,
    `"I wanted the ground to swallow me up—I truly did."`,
    `"I didn't want to show my face after what happened."`,
    `"It's not something I'm proud of, and I won't pretend it didn't happen."`,
    `"I felt like I'd let myself down in the worst possible way."`
  ],
  Remorseful: [
    `"I'd give anything to go back and undo what I did."`,
    `"It's something I still haven't forgiven myself for, honestly."`,
    `"The regret is bone deep—I think about it more than I should."`,
    `"I can't undo what happened, and that's something I have to live with."`,
    `"I kept saying sorry because I meant it—truly meant every word of it."`
  ]
};

function getFloodingData(name) {
  if (emotionFloodingData[name]) return emotionFloodingData[name];
  const info = emotionInfo[name] || [`you feel ${name.toLowerCase()}`, "moderate", "facing unexpected situations", "notice a change in your body", "calm", "the two emotions express different internal states", `I feel ${name.toLowerCase()} in this moment`];
  const rawWord = name.toLowerCase();
  const contrast = info[4].toLowerCase();

  // Grammatical noun vs adjective detection & word family inflection
  const isNoun = ["awe", "grief", "panic", "rage", "resentment", "jealousy", "envy", "shame", "guilt", "fear", "anger", "disgust", "surprise"].includes(rawWord);
  const adjWord = isNoun ? (rawWord === "awe" ? "awesome" : rawWord === "grief" ? "grieved" : rawWord === "panic" ? "panicked" : rawWord === "rage" ? "enraged" : rawWord === "resentment" ? "resentful" : rawWord === "jealousy" ? "jealous" : rawWord === "envy" ? "envious" : rawWord === "shame" ? "ashamed" : rawWord === "guilt" ? "guilty" : `${rawWord}ful`) : rawWord;
  const nounWord = isNoun ? rawWord : (rawWord === "scared" ? "fear" : rawWord === "anxious" ? "anxiety" : rawWord === "insecure" ? "insecurity" : rawWord === "overwhelmed" ? "overload" : rawWord === "terrified" ? "terror" : rawWord === "worried" ? "worry" : rawWord === "happy" ? "happiness" : rawWord === "confident" ? "confidence" : rawWord === "excited" ? "excitement" : rawWord === "joyful" ? "joy" : rawWord === "optimistic" ? "optimism" : rawWord === "peaceful" ? "peace" : rawWord === "proud" ? "pride" : rawWord === "sad" ? "sadness" : rawWord);

  return {
    collocations: [
      isNoun ? `filled with ${nounWord}` : `feel ${adjWord}`,
      isNoun ? `deep ${nounWord}` : `deeply ${adjWord}`,
      isNoun ? `sense of ${nounWord}` : `${adjWord} state`,
      isNoun ? `express ${nounWord}` : `genuinely ${adjWord}`,
      isNoun ? `overcome ${nounWord}` : `become ${adjWord}`
    ],
    colligations: [
      isNoun ? `in ${nounWord} of` : `${adjWord} about things`,
      isNoun ? `driven by ${nounWord}` : `too ${adjWord} to focus`,
      isNoun ? `feel ${nounWord} when` : `feel ${adjWord} when facing change`,
      isNoun ? `with pure ${nounWord}` : `become ${adjWord} under pressure`,
      isNoun ? `no ${nounWord} left` : `so ${adjWord} that it shows`
    ],
    distinctions: [
      `${name} is ${info[1]}, not ${contrast}.`,
      `${name} is inner, not outer.`,
      `${name} is now, not later.`,
      `${name} is mind, not body.`,
      `${name} is deep, not surface.`,
      `${name} is state, not action.`,
      `${name} is present, not past.`,
      `${name} is real, not fake.`,
      `${name} is clear, not vague.`,
      `${name} is quiet, not loud.`
    ],
    dialogueC1: [
      isNoun ? `“He felt a sudden surge of ${nounWord} during the meeting.”` : `“I felt quite ${adjWord} right before the presentation.”`,
      isNoun ? `“She tried to hide her ${nounWord}, but her voice trembled.”` : `“She looked ${adjWord} when she heard the unexpected news.”`,
      isNoun ? `“There was a deep sense of ${nounWord} throughout the room.”` : `“He gets ${adjWord} whenever plans change suddenly.”`,
      isNoun ? `“You shouldn't let ${nounWord} control your key decisions.”` : `“It is completely natural to feel ${adjWord} in this situation.”`,
      isNoun ? `“It takes courage to face your ${nounWord} head-on.”` : `“Don't let feeling ${adjWord} stop you from applying.”`
    ],
    dialogueC2: customC2Data[name] || [
      `"I've been feeling completely out of sorts all afternoon."`,
      `"That sudden change really threw me for a loop."`,
      `"She was caught completely off guard by the update."`,
      `"He's been pacing the floor trying to process it all."`,
      `"It's been weighing heavily on my mind all day long."`
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
    C1: flooding.dialogueC1 || flooding.dialogue,
    C2: flooding.dialogueC2 || flooding.dialogue
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
  showReflectionCard(name);
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
  if (!globalAudioToggle) return;
  const icon = globalAudioToggle.querySelector(".header-audio-button__icon");
  const label = globalAudioToggle.querySelector(".header-audio-button__label");
  globalAudioToggle.setAttribute("aria-pressed", String(state.autoPlay));
  globalAudioToggle.setAttribute("aria-label", state.autoPlay ? "Turn automatic speech off" : "Turn automatic speech on");
  if (icon) icon.textContent = state.autoPlay ? "🔊" : "🔇";
  if (label) label.textContent = state.autoPlay ? "Auto-play ON" : "Auto-play OFF";
}

function utter(text, onStart, onEnd, emphasis = false, onBoundary = null) {
  const cleanText = String(text || "").trim();
  const formatted = /[.!?]$/.test(cleanText) ? cleanText : `${cleanText}.`;
  const item = new SpeechSynthesisUtterance(formatted);
  item.lang = "en-US";
  item.rate = state.speechRate || 0.9;
  item.pitch = emphasis ? 1.04 : 1;
  const voices = ("speechSynthesis" in window) ? speechSynthesis.getVoices() : [];
  const voice = voices.find(v => v.voiceURI === state.voiceURI) || chooseVoice();
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
  const reflectionCard = document.querySelector("#reflection-card");
  if (reflectionCard) reflectionCard.hidden = true;
  clearReflectionCycles();
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


function populateVoiceSelect() {
  const voiceSelect = document.querySelector("#voice-select");
  if (!voiceSelect || !("speechSynthesis" in window)) return;
  const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
  voiceSelect.replaceChildren();
  voices.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
  if (state.voiceURI) voiceSelect.value = state.voiceURI;
}

document.querySelector("#voice-select")?.addEventListener("change", e => {
  state.voiceURI = e.target.value;
});

document.querySelector("#rate-select")?.addEventListener("change", e => {
  state.speechRate = parseFloat(e.target.value) || 0.9;
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    chooseVoice();
    populateVoiceSelect();
  };
  populateVoiceSelect();
}

// ── Self-Reflection Card ──────────────────────────────────────────────────

const reflectionHints = {
  // Primary emotions
  Fear: {
    because: ["something I care about feels threatened", "I can't see how this ends", "I'm in unfamiliar territory and have no map"],
    stake: ["whether I'm actually safe", "something I can't afford to lose", "my ability to trust my own judgment here"],
    need: ["more information before I can move", "someone to stand beside me", "to name exactly what I'm afraid of"]
  },
  Anger: {
    because: ["something unjust happened and no one seems to care", "my boundary was crossed and I wasn't heard", "I was let down by someone who knew better"],
    stake: ["my sense of what's fair in this relationship", "whether I can trust this person going forward", "my own integrity if I stay silent"],
    need: ["to say what happened out loud", "to be heard before I can move on", "to figure out what I actually want to change"]
  },
  Surprise: {
    because: ["something happened that I had no framework for", "reality just shifted and I'm still catching up", "I was expecting one thing and got something completely different"],
    stake: ["my sense of how predictable the world is", "the plan I had that now needs to change", "my ability to adapt when things don't go as expected"],
    need: ["a moment to absorb it before I react", "to figure out if this is good or bad news", "to update my picture of what's actually happening"]
  },
  Happy: {
    because: ["things aligned in a way they don't always", "the people I care about showed up for me", "I was doing exactly what I'm supposed to be doing"],
    stake: ["my ability to notice and keep this feeling instead of rushing past it", "the relationships that made it possible", "my sense of what a good day actually looks like"],
    need: ["to slow down enough to feel it fully", "to say thank you to someone who made it happen", "to carry some of this into what comes next"]
  },
  Disgust: {
    because: ["something violated my sense of what's acceptable", "I was exposed to something I can't un-see", "my values were pushed up against something that doesn't share them"],
    stake: ["my sense of what I'm willing to participate in", "a relationship or environment that may not be good for me", "where I choose to spend my energy going forward"],
    need: ["some distance before I decide anything", "to name exactly what was violated", "a space that reflects my values"]
  },
  Sad: {
    because: ["something I cared about is gone or changed beyond recognition", "I can feel the weight of time and loss together", "everything just feels heavier than it should"],
    stake: ["my ability to grieve honestly without collapsing", "the relationships that need me present even when I'm not okay", "my own health if I push through without feeling this"],
    need: ["to let myself be sad for a while without fixing it", "one person to be with who won't try to cheer me up", "permission to feel what this actually is"]
  },

  // Fear branch
  Insecure: {
    because: ["I keep comparing where I am to where I thought I'd be", "I can't tell if I actually belong here", "I can't tell if people are being genuine with me"],
    stake: ["whether I actually measure up", "my sense of who I am in this group", "whether I'm welcome here at all"],
    need: ["one honest conversation", "to stop measuring myself against the wrong ruler", "a reminder of something I've done well"]
  },
  Inadequate: {
    because: ["everyone else seems to already know what I don't", "I keep trying and it keeps not being enough", "I made a mistake I should have avoided"],
    stake: ["my belief that I'm capable of this", "whether I stay or give up", "how I see myself going forward"],
    need: ["to hear that learning takes time", "one small win to build on", "permission to not know everything yet"]
  },
  Inferior: {
    because: ["they have something I feel like I'll never have", "I was treated like my opinion didn't count", "I looked around the room and felt out of place"],
    stake: ["my sense of dignity in this space", "whether I keep showing up", "whether I trust my own voice"],
    need: ["to be seen as an equal", "space to prove something to myself", "to stop explaining myself to people who aren't listening"]
  },
  Rejected: {
    because: ["I reached out and got nothing back", "I was left out when I expected to be included", "I said something real and it landed badly"],
    stake: ["my willingness to try again", "whether I belong in this group", "trust that openness is worth the risk"],
    need: ["to know it wasn't about me", "a reason to believe this isn't the pattern", "time before I try again"]
  },
  Alienated: {
    because: ["I can't find the conversation I actually want to be in", "I look around and no one seems to see what I see", "something changed and I don't know how to close the gap"],
    stake: ["whether I stay connected or start pulling away", "my sense of shared purpose with these people", "whether I'm able to belong somewhere"],
    need: ["one person who speaks my language", "to find what I still have in common here", "a bridge, not a wall"]
  },
  Disrespected: {
    because: ["what I said was dismissed without a real response", "they spoke to me like I didn't know my own experience", "my time and effort were treated as unimportant"],
    stake: ["whether I keep putting in the same effort here", "my self-respect in this relationship", "whether I can trust this space to be fair"],
    need: ["an acknowledgment that it happened", "to decide what I'll accept going forward", "to say clearly what I expect"]
  },
  Anxious: {
    because: ["there's too much uncertain and not enough I can control", "I keep running through the worst versions of how this goes", "I haven't been able to stop thinking about it since yesterday"],
    stake: ["my ability to keep functioning under pressure", "whether I trust myself to handle what's coming", "something I've been building that could fall apart"],
    need: ["one thing I can actually do right now", "to put the spiral on pause for an hour", "someone to think this through with me"]
  },
  Overwhelmed: {
    because: ["I keep adding to the list and nothing gets taken off", "every direction I look, something needs my attention", "I said yes too many times and now I can't keep up"],
    stake: ["my ability to do any of it well", "my health if I don't slow down soon", "the things that matter getting buried under the urgent ones"],
    need: ["permission to drop one thing", "someone to help me sort what's actually essential", "a clear end to today's list"]
  },
  Worried: {
    because: ["I haven't heard anything and my mind is filling in the gaps", "something I care about is out of my hands", "the last time this happened it didn't go well"],
    stake: ["someone I love or something I've worked for", "my trust that things tend to work out", "my ability to be present while I wait"],
    need: ["actual information instead of guessing", "something to do with my hands while I wait", "to hear that worrying about it makes sense"]
  },
  Scared: {
    because: ["I don't know what happens if I get this wrong", "the thing I'm facing feels bigger than me", "I keep imagining the moment things go badly"],
    stake: ["my sense of safety or control", "something I'm not ready to lose", "whether I go forward or find a way around"],
    need: ["to break it into smaller pieces", "to know someone's done this and come out okay", "to stop imagining the ending before it happens"]
  },
  Terrified: {
    because: ["I've never faced something like this before", "the risk feels real and very close", "I've lost the ability to tell myself it'll be fine"],
    stake: ["everything I've worked to keep stable", "my confidence that I can survive hard things", "someone I need to protect"],
    need: ["to get through the next ten minutes, not the whole thing", "to not be alone in this", "one steady thing to hold onto"]
  },
  Frightened: {
    because: ["something I didn't expect made the danger feel real", "I can feel my body reacting before my mind catches up", "the thing I've been trying not to think about just got closer"],
    stake: ["my sense of control in a situation that matters", "how I'll act when it counts", "whether I can think clearly under this much pressure"],
    need: ["to slow my breathing first", "a plan that gives me something to do", "to talk it through with someone calm"]
  },

  // Anger branch
  Mad: {
    because: ["it keeps happening and nothing changes", "I feel like my feelings were dismissed", "I was blamed for something that wasn't my fault"],
    stake: ["whether I stay or walk away", "the respect I should be getting but am not", "a relationship that matters but is breaking"],
    need: ["some space before I say what I'm thinking", "someone to actually listen without defending", "to see something change, even something small"]
  },
  Enraged: {
    because: ["this has been building for a long time and today broke something open", "the injustice is too obvious and too ignored", "I feel like I'm not being treated as a person"],
    stake: ["my ability to act clearly instead of just react", "the relationship I'm about to say something permanent to", "something I've been holding in for too long"],
    need: ["an outlet before I say something I can't take back", "someone who won't tell me to calm down", "to be taken seriously for once"]
  },
  Furious: {
    because: ["what happened was a betrayal, not just a mistake", "I've been patient for too long and it's run out", "the thing that mattered most to me was treated like nothing"],
    stake: ["my trust in this person or institution", "what I'm willing to put up with going forward", "my own self-respect in deciding what I do next"],
    need: ["to decide what I'm going to do before I do anything", "to name what specifically was violated", "to feel like I have some power here"]
  },
  Hurt: {
    because: ["someone I trusted said or did something that cut deep", "I expected care and got carelessness instead", "what happened made me feel like I don't matter to them"],
    stake: ["the closeness I thought existed in this relationship", "my willingness to be open with this person again", "whether I say what actually happened or just bury it"],
    need: ["to know the hurt was seen and acknowledged", "to understand what the other person was thinking", "time to figure out if this is fixable"]
  },
  Devastated: {
    because: ["something I built or hoped for fell apart completely", "the loss is real and I can't pretend it isn't", "I can't see a version of things that gets better from here"],
    stake: ["my belief that things I care about can last", "my energy to start over", "a future I was counting on"],
    need: ["to sit with this for a moment without having to fix it", "someone who doesn't try to silver-line it", "one small concrete reason to keep going"]
  },
  Embarrassed: {
    because: ["I did or said something in front of people and I can't stop replaying it", "I thought no one was watching and they were", "I showed a part of myself I wasn't ready to share"],
    stake: ["how I'm perceived by people I respect", "my confidence in that setting going forward", "my ability to show my face and try again"],
    need: ["to know people have already forgotten it", "to laugh at it before the shame hardens", "permission to be imperfect in public"]
  },
  Threatened: {
    because: ["someone is getting what I was counting on having", "the thing I've built feels like it could be taken", "I feel like I'm being pushed out of a space that was mine"],
    stake: ["my position, my sense of safety, or my belonging", "whether I act from strength or from fear", "a relationship that's getting complicated by something neither of us is naming"],
    need: ["to understand if the threat is real or imagined", "to stop making decisions in reaction", "a direct conversation instead of a silent competition"]
  },
  Jealous: {
    because: ["they have what I want, and I can't pretend I don't want it", "I care about this person more than they seem to care about me", "I'm watching someone get something I've been working toward"],
    stake: ["the relationship — if I let this eat at me, I'll damage it", "my own self-image when I feel like this", "whether I turn this into drive or let it become resentment"],
    need: ["to admit it instead of dressing it up as something else", "to focus on my own path for a while", "a real conversation if someone's closeness is what I'm worried about"]
  },
  Distant: {
    because: ["I've been burned before and I'm not ready to risk it again", "something happened that I haven't processed and I'm closing off instead", "I can feel myself pulling back but I don't know how to stop"],
    stake: ["a relationship that needs more than I'm giving right now", "my own need for connection underneath the wall I'm building", "whether I address what caused this or let it compound"],
    need: ["space to figure out what made me shut down", "a low-pressure way back into contact", "to stop pretending everything's fine"]
  },
  Suspicious: {
    because: ["something doesn't add up and I can't let it go", "I've been misled before in a similar situation", "their words and their actions don't match and I keep noticing it"],
    stake: ["whether I can trust my own read of people", "a relationship that might be fine — or might not be", "my willingness to be open if the suspicion hardens into certainty"],
    need: ["more information before I decide what to believe", "to ask the direct question I've been avoiding", "to know if my gut is pattern-matching or just afraid"]
  },
  Withdrawn: {
    because: ["I don't have the energy to be around people right now", "I said something that didn't land and I'd rather disappear than try again", "the world outside feels like more than I can take today"],
    stake: ["my relationships if I stay closed too long", "my own mental health if this becomes the default", "the version of me that used to be able to show up"],
    need: ["permission to rest without guilt", "one person to check in without expecting much back", "a reason to come back out when I'm ready"]
  },

  // Surprise branch
  Confused: {
    because: ["I keep getting different answers and I don't know which one to trust", "I thought I understood and then realized I didn't", "the rules keep changing and I can't find the stable ground"],
    stake: ["my ability to make a good decision with the information I have", "my trust in the people giving me conflicting signals", "my time — I can't afford to keep going in the wrong direction"],
    need: ["one clear answer from one reliable source", "permission to say I don't understand instead of pretending I do", "to slow down enough to sort out what I actually know"]
  },
  Disillusioned: {
    because: ["I believed in something that turned out to be different than I thought", "the gap between what was promised and what happened is too wide to ignore", "I trusted a person or idea and they didn't hold up"],
    stake: ["my optimism — it's getting harder to extend it again", "my ability to invest in the next thing wholeheartedly", "a belief that shaped how I saw myself"],
    need: ["to grieve the version I thought was true", "time before I'm expected to commit to something new", "one thing that still deserves my faith"]
  },
  Perplexed: {
    because: ["I keep trying to find the logic and there isn't any", "someone's behavior makes no sense to me no matter how I look at it", "I understand all the pieces but not how they fit together"],
    stake: ["my ability to respond well in a confusing situation", "a relationship where I've lost the thread of what's happening", "my confidence in my own ability to figure things out"],
    need: ["more context, not more opinions", "to talk it through out loud with someone patient", "to accept that some things won't resolve neatly"]
  },
  Startled: {
    because: ["something hit me without warning and I'm still recovering from the jolt", "I wasn't ready and it showed", "my body reacted before I had a chance to think"],
    stake: ["my composure in a situation where I need to stay clear-headed", "my sense of safety in this environment", "the impression I gave in a moment I'd rather have back"],
    need: ["a minute to settle before I do anything", "to laugh at it if it's laughable", "to check that I'm actually okay"]
  },
  Shocked: {
    because: ["what just happened doesn't fit with what I thought I knew", "someone I trusted did something I would have said was impossible for them", "the news arrived too fast for me to have any defense against it"],
    stake: ["my picture of who this person is or how this situation works", "the trust and certainty I was building on", "my ability to absorb bad surprises without shutting down"],
    need: ["to sit still for a moment before I do anything", "to say it out loud to make it real", "to understand what comes next, even if I can't change what happened"]
  },
  Dismayed: {
    because: ["the thing I was hoping for didn't come through", "I watched something avoidable happen anyway", "I expected better and got something I wasn't prepared for"],
    stake: ["my belief that effort and care translate to good outcomes", "my energy for trying again", "a relationship where the disappointment is between two people"],
    need: ["to be honest about how let-down I actually feel", "to understand if this is fixable or something I need to accept", "time to decide what I want to do with what's left"]
  },
  Amazed: {
    because: ["what just happened is more than I expected was possible", "someone showed me something I didn't know could exist", "the world just got larger in my imagination"],
    stake: ["how I see what's possible from here", "the energy and direction this feeling could give me", "my sense of connection to something larger than my daily routine"],
    need: ["to hold this feeling a little longer before it fades", "to tell someone so it becomes more real", "to let it change something small about how I move today"]
  },
  Astonished: {
    because: ["this was so far outside anything I predicted, I don't have a response yet", "the scale of what happened is still landing", "I've never seen anything like it"],
    stake: ["my sense of how the world works", "a moment that could reshape something important", "the story I tell myself about what's possible"],
    need: ["time to translate this into something I can actually use", "to tell someone who will understand why it matters", "to let the surprise become something more lasting"]
  },
  Awe: {
    because: ["I came into contact with something much bigger than me and I wasn't prepared", "beauty or scale or complexity stopped me completely", "for a moment I forgot about myself"],
    stake: ["my sense of proportion — this puts things in a different perspective", "a connection to something that feels meaningful beyond my daily life", "my gratitude, which I forget to exercise"],
    need: ["to stay here a little longer", "to remember this feeling when things feel small and grinding", "to share it with someone"]
  },
  Excited: {
    because: ["something I've been waiting for is finally about to happen", "a door just opened that I didn't expect", "I can see clearly how good this could be"],
    stake: ["my ability to channel this into something real rather than just feeling it", "the opportunity — it's real and it won't wait forever", "my relationships with the people this excitement involves"],
    need: ["to do something concrete while the energy is here", "to share it with someone who'll match my enthusiasm", "to make sure my excitement doesn't run ahead of my preparation"]
  },
  Eager: {
    because: ["I can already picture how well this goes", "I've been waiting for an opening and this is it", "every part of me is pointing in the same direction"],
    stake: ["the window — it won't stay open forever", "my follow-through, which has to match my enthusiasm", "the impression I give when I arrive with this much energy"],
    need: ["to channel this before it turns into restlessness", "a clear first step to move on right now", "someone to be excited with"]
  },
  Energetic: {
    because: ["something clicked and I feel like I could take on twice as much", "I slept well, the news was good, and everything feels possible", "I can feel momentum building and it's rare — I want to use it"],
    stake: ["the work I could actually get done while this lasts", "a chance to move something forward that's been stuck", "my own sense of capability when I feel this way"],
    need: ["to point this at something that actually matters", "to not waste it on busy work", "to remember this feeling when the low days come"]
  },

  // Happy branch
  Joyful: {
    because: ["something happened that reminded me why everything is worth it", "I felt fully present for the first time in a while", "there was nothing I needed to fix or worry about, just this"],
    stake: ["my ability to access this when things are harder", "a moment with someone I love that I want to remember", "my gratitude, which this moment is demanding"],
    need: ["to be fully here and not think about what's next", "to mark this moment in some way", "to tell someone how good this feels"]
  },
  Liberated: {
    because: ["I finally let go of something that had been weighing on me for too long", "I stopped waiting for permission and just did it", "the thing I was afraid of happened and I survived it"],
    stake: ["what I do with the freedom now that I have it", "the patterns I can finally break without the old weight", "my sense of what I'm actually capable of"],
    need: ["to use this feeling before it fades back into habit", "to decide what I want to build in the space I just cleared", "to celebrate this — actually celebrate it"]
  },
  Ecstatic: {
    because: ["everything I hoped for came together at once", "the feeling is too big to hold quietly", "something happened that I didn't think was possible for me"],
    stake: ["turning this peak into something that lasts beyond the moment", "sharing it with people who will understand", "my ability to commit when the high settles down"],
    need: ["to share it loudly and immediately", "to write it down so future-me can find it", "to let it change my idea of what I'm capable of"]
  },
  Proud: {
    because: ["I did something hard and I did it well", "I kept going when it would have been easier to stop", "someone I care about saw me clearly and reflected something good"],
    stake: ["my belief in my own capabilities when things get difficult again", "the story I carry about who I am", "my relationship with the person whose opinion made this land"],
    need: ["to let myself feel this instead of moving straight to the next challenge", "to acknowledge the effort, not just the result", "to share it with one person who will understand why it matters"]
  },
  Confident: {
    because: ["I've done this before and I remember how it went", "the preparation I put in is finally showing", "I can see exactly what I need to do and I trust my ability to do it"],
    stake: ["acting from this place instead of second-guessing it away", "the decision or moment this feeling is preparing me for", "my ability to hold this when things get harder"],
    need: ["to move while I feel this, not wait", "to stop adding qualifications to my own ability", "to remember this specific feeling for the next time I doubt myself"]
  },
  Important: {
    because: ["what I did made a real difference to someone", "I was included and asked for my perspective in a way that felt genuine", "for once, the work I put in was visible to the people who matter"],
    stake: ["my continued investment in this role or relationship", "my sense of purpose — which depends on mattering to something larger than myself", "the energy I'll bring to the next hard thing"],
    need: ["to let this land instead of deflecting it", "to understand exactly what created it so I can seek it again", "to tell someone it happened"]
  },
  Optimistic: {
    because: ["the thing I was worried about looks more manageable from here", "I can see a path even if it's not perfectly clear", "something shifted and the future feels real again"],
    stake: ["the plans and decisions this feeling could help me make well", "my relationship with hope, which I sometimes abandon too early", "my ability to invite others into this view"],
    need: ["to act on this before doubt creeps back in", "to make one concrete decision that reflects this feeling", "to share the view with someone who's been struggling to see it"]
  },
  Open: {
    because: ["the conversation went somewhere I didn't expect and I liked it", "I let my guard down and nothing bad happened", "I'm curious about something new and it doesn't feel threatening"],
    stake: ["a relationship that gets deeper if I stay in this mode", "an idea that only becomes useful if I follow it honestly", "my own growth, which depends on staying teachable"],
    need: ["to stay in this mode long enough to see what it produces", "to have the conversation I've been avoiding", "to follow the curiosity without needing to know where it leads"]
  },
  Inspired: {
    because: ["I encountered something that made me see what was possible", "someone showed me who they are and I want to be like that", "something unlocked in me that had been stuck"],
    stake: ["doing something with this before it evaporates", "a new direction I could take my work or my attention", "the belief that I have something worth creating"],
    need: ["to act on this within the next hour, not the next month", "to protect this feeling from the first person who might dismiss it", "to write something down before the feeling outpaces the idea"]
  },
  Peaceful: {
    because: ["for the moment, there's nothing that needs my urgent attention", "something resolved that had been pulling at me", "I'm exactly where I want to be, with exactly who I want to be with"],
    stake: ["my ability to rest without guilt", "the relationships that created this — they need tending", "my sense of what I'm working toward when things aren't peaceful"],
    need: ["to be fully here instead of waiting for the peace to end", "to express gratitude for this, even quietly", "to remember what created this and try to build more of it"]
  },
  Hopeful: {
    because: ["something gave me reason to believe this could still go well", "I can see evidence that things are moving in the right direction", "I let myself imagine the good version and it felt possible, not naive"],
    stake: ["my willingness to keep investing in what I'm hoping for", "the energy I need to push through the uncertain middle part", "the people I hope are hoping too"],
    need: ["to hold this without squeezing it too tight", "to take one step that reflects the hope instead of waiting for certainty", "to share it with someone who could use it"]
  },
  Loving: {
    because: ["I feel close to someone in a way that doesn't need words to explain", "I'm grateful for this person in a way that's hard to hold quietly", "I looked at someone and everything complicated fell away"],
    stake: ["saying something before the moment passes", "the relationship itself, which grows or shrinks based on whether I tend it", "my ability to receive love as well as give it"],
    need: ["to say something out loud, not just feel it", "to do one small thing that shows it", "to be fully present with this person right now"]
  },

  // Disgust branch
  Avoidance: {
    because: ["getting closer to this feels like a risk I'm not ready to take", "I've been in this situation before and the ending wasn't good", "every time I try to approach it, something in me pulls back"],
    stake: ["whether I'm protecting myself wisely or just hiding", "an opportunity or relationship that requires me to get closer", "my own pattern — if I avoid too many things, the world gets smaller"],
    need: ["to understand what specifically I'm afraid of about this", "one small step toward it, not the whole thing", "to decide consciously instead of just drifting away"]
  },
  Hesitant: {
    because: ["I can see two ways forward and they both have real costs", "I'm waiting for more certainty that probably won't come", "my gut and my logic are saying different things"],
    stake: ["the decision that's waiting for me while I hesitate", "my relationship with the person or process waiting on me", "my own confidence if I let hesitation become a habit"],
    need: ["a deadline — mine or someone else's", "to separate the real reasons from the comfortable excuses", "to commit to something even if I'm not sure, and see what happens"]
  },
  Aversion: {
    because: ["everything about this situation activates my defenses", "it goes against something I hold as a core value", "I've been in contact with it and I can feel the wrongness of it"],
    stake: ["how long I remain in proximity to this", "my integrity if I stay without saying something", "my health — some things are worth strongly avoiding"],
    need: ["to trust this reaction instead of talking myself out of it", "clear distance between me and the thing", "to say what I observe without needing to convince everyone"]
  },
  Disapproval: {
    because: ["what I watched happen crossed a clear line for me", "I expected better from the person or system involved", "the gap between what was said and what was done is too wide"],
    stake: ["whether I say something or stay silent and what that says about me", "a relationship where honesty is the only path forward", "my own standards — I can't claim them if I don't hold others to them"],
    need: ["to be clear and direct without making it a lecture", "to focus on the behavior, not the whole person", "to decide what I want from this: change or just acknowledgment"]
  },
  Judgmental: {
    because: ["I'm looking at someone and I can't stop cataloguing what's wrong", "I feel like my standards are being violated and the feeling won't quiet down", "something about them is triggering something in me I haven't examined"],
    stake: ["the relationship — judgment without compassion poisons things quietly", "something about me that this reaction might be pointing toward", "my ability to stay curious instead of closing down"],
    need: ["to ask what's underneath the judgment", "to get curious about their situation before I decide what I see", "to notice if I'm judging something in them that I'm afraid of in myself"]
  },
  Loathing: {
    because: ["this goes so far against my values that proximity feels like a kind of harm", "the feeling has been building for a long time and it's settled into something solid", "I've tried to be fair about it and the conclusion keeps being the same"],
    stake: ["my well-being if I stay in contact with this", "a decision about whether to remove myself or say something permanent", "my integrity in a situation where what I do reflects who I am"],
    need: ["significant distance before I make any decisions", "to check whether this is about one thing or has become total", "to decide if I want to change anything or just protect myself"]
  },
  Awful: {
    because: ["what happened sits wrong in every way I can examine it", "I feel it in my body as much as my head", "there's no reframing that makes this okay"],
    stake: ["my trust in this situation or person going forward", "my sense of what I deserve in the spaces I occupy", "the decision I'll need to make about staying or leaving"],
    need: ["to be honest that it was bad, not soften it for anyone", "time before I'm expected to be okay", "to name it clearly, even just to myself"]
  },
  Revulsion: {
    because: ["I was exposed to something that hit something deep and instinctive", "the wrongness of it won't reduce no matter how I think about it", "it violated something about dignity I didn't know I held so strongly"],
    stake: ["my sense of safety in this environment", "whether I can be present in this space again without residue", "what I decide to do with what I witnessed"],
    need: ["to get out and get some air, space, different company", "to talk to someone whose values I trust", "to take some action, however small, in the opposite direction"]
  },
  Detestable: {
    because: ["it represents everything I've worked to move away from", "looking at it clearly, there's nothing I can find that's redeemable", "it's been wrong for so long I can't separate it from the harm it's caused"],
    stake: ["where I put my energy — do I fight this or move away from it", "my integrity in staying silent in a space that tolerates it", "my own moral clarity about what I stand for"],
    need: ["to remove myself if I can't change it", "to decide what kind of opposition is worth it", "to not carry this alone"]
  },
  Disappointed: {
    because: ["I expected more from someone I trusted", "I put real hope into this and it came back empty", "the outcome doesn't match the effort I put in"],
    stake: ["my willingness to invest next time", "the relationship if the disappointment is between us", "my belief that things I care about can turn out well"],
    need: ["to say I'm disappointed out loud, not just absorb it", "to understand if this was a failure of expectation or a failure of commitment", "to decide what, if anything, I want to ask for"]
  },
  Revolted: {
    because: ["what I witnessed contradicts something basic about how people should be treated", "I had no way to prepare for what I saw or heard", "the feeling came fully formed — there was no gradual buildup"],
    stake: ["my sense of safety in this context", "my trust in the people around me who didn't react", "what I'm willing to be a silent witness to"],
    need: ["to voice it — even writing it down helps", "to be around people with the same baseline as mine", "to do something, even one small thing, that points the other way"]
  },
  Repugnant: {
    because: ["something I've encountered violates my sense of what's decent", "I can't find any angle that makes it acceptable", "it confirms a fear I had and hoped wasn't true"],
    stake: ["how I respond without making things worse", "my mental health if I dwell on it too long", "what this means for the larger situation I'm in"],
    need: ["to give myself permission to walk away from this", "to voice it to someone who won't minimize it", "to focus on something that restores my sense of what's good"]
  },

  // Sad branch
  Bored: {
    because: ["nothing in reach feels like it deserves my attention", "I'm going through the motions without any of it meaning anything", "the same day is repeating and I can't find the variation"],
    stake: ["my time — boredom that stays becomes drift", "something I used to care about that I'm slowly disconnecting from", "my need for growth, which isn't being met here"],
    need: ["one new thing to be curious about", "to change one part of the routine", "to ask honestly whether this place or role still fits me"]
  },
  Indifferent: {
    because: ["I've been disappointed here enough times that I stopped feeling it", "I used to care about this and somewhere along the way the caring stopped", "I can see reasons why this should matter to me but I can't feel them"],
    stake: ["a relationship or role I'm quietly exiting without deciding to", "my own engagement with my life if this becomes my default mode", "whether someone notices and says something before the distance becomes permanent"],
    need: ["to understand what caused the shutdown", "one small thing that's genuinely interesting, not just required", "to check whether I'm protecting myself or just disappearing"]
  },
  Apathetic: {
    because: ["even the things I chose are starting to feel like obligations", "I've lost the thread of why any of this matters", "something drained the energy that used to make this feel worth it"],
    stake: ["my sense of meaning, which has gone quiet", "my relationships if I stay in this fog too long", "my health — this kind of flatness can signal something that needs attention"],
    need: ["to find out if this is tiredness, grief, or something else", "permission to want less for a while, not more", "one small thing that produces actual feeling, positive or negative"]
  },
  Lonely: {
    because: ["I'm surrounded by people and still can't find the connection I'm looking for", "the people I want to be with aren't reachable right now", "I've been keeping my real thoughts to myself for too long"],
    stake: ["my mental health if isolation becomes the pattern", "a friendship that's quietly going cold because I keep not reaching out", "my ability to trust people enough to let them in"],
    need: ["to reach out to one person, even a short message", "to find one space where being known is possible", "to say something real to someone instead of staying at the surface"]
  },
  Isolated: {
    because: ["the distance between me and other people feels physical even when they're close", "I've been withdrawing step by step and now I'm far from where I was", "the community I thought I had turned out to be less solid than I thought"],
    stake: ["my wellbeing over the long term — isolation compounds", "a relationship that I could still repair if I moved now", "my belief that belonging is possible for me"],
    need: ["a small, low-commitment way back into contact", "one person who already knows me well enough that I don't have to start from scratch", "to be honest that I've been absent and not pretend it was fine"]
  },
  Abandoned: {
    because: ["someone I counted on left without explanation", "I reached out repeatedly and got silence", "I was there for them and when I needed them, they weren't there"],
    stake: ["my trust in people going forward — this is the kind of wound that changes how you open up", "my sense of whether I'm worth staying for", "a grief that's real and deserves real acknowledgment"],
    need: ["to hear that what happened was real and not in my head", "to grieve this fully before I decide what it means about people", "time before I'm expected to be okay with it"]
  },
  Despair: {
    because: ["I've been trying for long enough that I don't know if I have more tries in me", "the gap between where I am and where I need to be feels uncrossable", "something happened that I can't see past right now"],
    stake: ["my will to keep going — this needs attention, not patience", "the people who depend on me and need me to stay present", "my own life, which is worth fighting for even when it doesn't feel that way"],
    need: ["to talk to someone — not text, actually talk", "to focus on today, just today, not the whole picture", "professional support if this feeling has been here for more than a few days"]
  },
  Vulnerable: {
    because: ["I let someone see me honestly and now I'm waiting to see how they treat that", "something stripped away my usual defenses and I'm exposed", "I'm in a situation where I have less control than I need"],
    stake: ["my trust in this person and whether openness was the right call", "my future willingness to be honest — this will either affirm or close that down", "something raw and true about me that I'm not sure I wanted visible"],
    need: ["gentleness, especially from myself", "to know the person I opened to can be trusted with it", "to not regret having been real"]
  },
  Powerless: {
    because: ["the outcome depends entirely on decisions I have no influence over", "I've tried every approach I have and none of them moved it", "something is happening to me that I cannot stop"],
    stake: ["my sense of agency — this is a hard feeling to carry for long", "a situation that may require me to ask for help I haven't asked for yet", "my mental health if helplessness becomes the story I tell myself"],
    need: ["to find one thing, however small, that I can actually affect", "to ask for help without framing it as failure", "to separate what's truly fixed from what still has some give"]
  },
  Guilty: {
    because: ["I did something I knew wasn't right and I can't stop thinking about it", "I let someone down who was counting on me", "I took the easier path instead of the honest one"],
    stake: ["my integrity — this keeps its grip until I address it", "the relationship with the person I harmed or failed", "my ability to forgive myself, which depends on facing this honestly"],
    need: ["to make it right if making it right is still possible", "to apologize — directly, specifically, without hedging", "to decide what I want to do differently and mean it"]
  },
  Ashamed: {
    because: ["I acted in a way that contradicts who I want to be", "people saw something about me that I'm not ready to claim", "I feel the gap between my values and my behavior and it's wider than I can explain"],
    stake: ["my sense of who I am — shame speaks directly to identity", "whether I address this or let it shape me from the inside silently", "a relationship where trust was damaged"],
    need: ["to distinguish between guilt (I did something bad) and shame (I am bad)", "to talk to someone I respect about what happened", "to take one step toward the person I want to be"]
  },
  Remorseful: {
    because: ["I caused harm I didn't intend and the intention doesn't make the harm smaller", "I had a chance to do the right thing and chose the wrong one", "I've been carrying this and the weight isn't getting lighter on its own"],
    stake: ["the relationship I damaged and whether it can be restored", "my integrity if I acknowledge this only privately and never to the person who deserves to hear it", "my ability to move forward — remorse without action becomes a trap"],
    need: ["to say what happened clearly to the person affected", "to ask what repair looks like, not assume I already know", "to forgive myself after I've made it right, not before"]
  }
};

const _defaultReflectionHints = {
  because: ["something that matters to me is involved", "it caught me off guard", "I wasn't expecting to feel this way"],
  stake: ["something I care about", "my sense of what's important right now", "a relationship or situation that needs attention"],
  need: ["time to sit with this", "to talk it through with someone", "to understand what's driving the feeling"]
};

let _reflectionCycles = [];

function clearReflectionCycles() {
  _reflectionCycles.forEach(clearInterval);
  _reflectionCycles = [];
}

function _cyclePlaceholder(input, hints) {
  if (!hints || hints.length === 0) return;
  let i = 0;
  input.placeholder = hints[0];
  const id = setInterval(() => {
    if (!input.value) {
      i = (i + 1) % hints.length;
      input.placeholder = hints[i];
    }
  }, 3600);
  _reflectionCycles.push(id);
}

function showReflectionCard(name) {
  const card = document.querySelector("#reflection-card");
  if (!card) return;

  clearReflectionCycles();

  const emotionEl = document.querySelector("#reflection-emotion");
  if (emotionEl) emotionEl.textContent = name.toLowerCase();

  const becauseInput = document.querySelector("#reflection-because");
  const stakeInput  = document.querySelector("#reflection-stake");
  const needInput   = document.querySelector("#reflection-need");
  if (becauseInput) becauseInput.value = "";
  if (stakeInput)   stakeInput.value   = "";
  if (needInput)    needInput.value    = "";

  const hints = reflectionHints[name] || _defaultReflectionHints;
  if (becauseInput) _cyclePlaceholder(becauseInput, hints.because);
  if (stakeInput)   _cyclePlaceholder(stakeInput,   hints.stake);
  if (needInput)    _cyclePlaceholder(needInput,     hints.need);

  card.style.setProperty("--lesson-color", state.color || "#e65f42");
  card.hidden = false;
}
