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
try {
  const storedCefr = localStorage.getItem("english-club-cefr");
  if (["A1", "A2", "B1", "B2", "C1", "C2"].includes(storedCefr)) savedCefr = storedCefr;
  savedAutoPlay = localStorage.getItem("english-club-autoplay") === "true";
} catch (_) {}

const state = { primary: null, secondary: null, selected: null, speaking: false, autoPlay: savedAutoPlay, rotation: 0, cefr: savedCefr, trail: [], color: "#e65f42" };
const wheel = document.querySelector("#emotion-wheel");
const playButton = document.querySelector("#play-all");
const globalAudioToggle = document.querySelector("#global-audio-toggle");
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
  button.innerHTML = `<span class="sector__label"><span>${name}</span>${translation ? `<span class="sector__bangla" lang="bn">${translation}</span>` : ""}</span>`;
  return button;
}

function renderWheel() {
  wheel.replaceChildren();
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

function sentencesFor(name) {
  const info = emotionInfo[name] || [`you are experiencing ${name.toLowerCase()}`, "medium", "something affects you", "notice a change in your body", "happy", "the two words describe different experiences", `I feel ${name.toLowerCase()} today`];
  const word = name.toLowerCase();
  const contrast = info[4].toLowerCase();
  const lessons = {
    A1: [
      `${name} is a feeling.`,
      `It means ${info[0]}.`,
      `You may feel ${word} when ${info[2]}.`,
      `This can be a ${info[1]} feeling.`,
      `Your body may ${info[3]}.`,
      `${name} and ${contrast} are different feelings.`,
      `Example: “${info[6]}.”`
    ],
    A2: [
      `${name} means ${info[0]}.`,
      `It is usually a ${info[1]} feeling.`,
      `You may feel ${word} when ${info[2]}.`,
      `Your body may ${info[3]}.`,
      `Do not confuse ${word} with ${contrast}.`,
      `Here is the difference: ${info[5]}.`,
      `For example: “${info[6]}.”`
    ],
    B1: [
      `${name} describes a feeling in which ${info[0]}.`,
      `It often happens when ${info[2]}.`,
      `The feeling is generally ${info[1]} in strength.`,
      `You might notice that your body starts to ${info[3]}.`,
      `${name} can seem similar to ${contrast}, but they are not identical.`,
      `The main difference is that ${info[5]}.`,
      `A natural example is: “${info[6]}.”`
    ],
    B2: [
      `${name} describes an emotional response in which ${info[0]}.`,
      `It commonly appears in situations where ${info[2]}.`,
      `Its intensity is generally ${info[1]}, although the experience can vary.`,
      `Physically, you may ${info[3]}.`,
      `Although ${word} may resemble ${contrast}, the two words are not interchangeable.`,
      `The useful distinction is this: ${info[5]}.`,
      `In everyday speech, you might say: “${info[6]}.”`
    ],
    C1: [
      `The term ${word} denotes an emotional state in which ${info[0]}.`,
      `It tends to arise in circumstances where ${info[2]}.`,
      `Its emotional force is typically ${info[1]}, though context can alter its intensity.`,
      `The feeling may be physically expressed when you ${info[3]}.`,
      `${name} overlaps in meaning with ${contrast}, but each word frames the experience differently.`,
      `Semantically, the distinction is that ${info[5]}.`,
      `The word is used naturally in the sentence: “${info[6]}.”`
    ],
    C2: [
      `At its most precise, ${word} captures an emotional state in which ${info[0]}.`,
      `It commonly emerges in contexts where ${info[2]}, although its triggers can be highly individual.`,
      `Its characteristically ${info[1]} force helps convey the scale of the emotional response.`,
      `Somatically, the experience may reveal itself when you ${info[3]}.`,
      `The term occupies nearby semantic territory to ${contrast}, yet substituting one for the other can erase an important nuance.`,
      `The crucial distinction is this: ${info[5]}.`,
      `An idiomatic illustration would be: “${info[6]}.”`
    ]
  };
  return lessons[state.cefr];
}

function updateLesson(name, trail, color) {
  state.trail = [...trail];
  state.color = color;
  transcriptCard.style.setProperty("--lesson-color", color);
  document.querySelector("#selected-word").textContent = name;
  document.querySelector("#pronunciation").textContent = pronunciation[name.toLowerCase()] || "Tap Listen to hear the pronunciation";
  document.querySelector("#breadcrumb").textContent = trail.join("  ›  ");
  const primaryDefinition = primaryBangla[trail[0]];
  document.querySelector("#bangla-definition").textContent = `${trail[0]} · ${primaryDefinition.word} — ${primaryDefinition.definition}`;
  document.querySelector("#prompt-word").textContent = name.toLowerCase();
  document.querySelector("#reason").value = "";
  document.querySelector("#reason").placeholder = `I feel ${name.toLowerCase()} because…`;

  renderTranscript(name);
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
    button.className = `choice-chip${state.selected === choice.name ? " is-selected" : ""}`;
    button.style.setProperty("--chip-color", choice.color);
    button.textContent = choice.name;
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
  const item = new SpeechSynthesisUtterance(text);
  item.lang = "en-US";
  item.rate = 0.95;
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
  sentencesFor(state.selected).forEach((text, index) => {
    speechSynthesis.speak(utter(text,
      () => startTimedHighlight(index + 1),
      () => {
      clearTimedHighlight();
      completeTranscriptRow(index + 1);
      if (index === 6) finishSpeech();
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
renderWheel();
updateClueLanguage();
updateClueResult();
setPollWindow();
loadPoll();
