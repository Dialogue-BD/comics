// Voice Lab content bank. English is what students hear and read; Bangla (bn)
// carries the explanation underneath when the বাংলা toggle is on.
// Bangla here should be checked by a native speaker before wide use.
//
// Each unit is one long page: a hero, then Hear → Play sections. (Students repeat after
// the recordings on their own; there is no record-yourself step.)
// Section types (see pages/Unit.jsx): lines, schwa, suffix, prefix, compound, legend,
//   rushdemo, melody, pause, links, years, phone, meaning, pairs, er, doors, bhv,
//   clusters, thgroups, identify, stress, compoundgame, bigbeat, rush,
//   pausegame, linkgame, numbergame, clustergame, accentpairs, matters, accentgame
// Every clip id refers to an mp3 in audio/ and an entry in data/clips.json; a second voice
// has the same ids in audio/<voice>/ and data/clips-<voice>.json (see lib/audio.js).

export const STEPS = {
  hear: { en: 'Hear', bn: 'শুনুন', icon: 'ear', verb: { en: 'Notice it', bn: 'লক্ষ করুন' } },
  play: { en: 'Play', bn: 'খেলুন', icon: 'game', verb: { en: 'Use it', bn: 'কাজে লাগান' } },
};

const L = (en, bn) => ({ en, bn });

// Accent pairs: the same word in each voice's own accent (Alice British, Brian American).
// parts: the spelling, with the letters that change marked ('hi') or silent ('ghost').
const ACCENT_ROWS = [
  { clip: 'acc-car', word: 'car',
    uk: { tag: L('R drops', 'r পড়ে যায়'), parts: [['ca'], ['r', 'ghost']], say: 'kah', ipa: '/kɑː/', note: L('No r after the vowel.', 'স্বরের পরে r বলা হয় না।') },
    us: { tag: L('R stays', 'r থাকে'), parts: [['ca'], ['r', 'hi']], say: 'kar', ipa: '/kɑr/', note: L('The r is clearly there.', 'r স্পষ্ট শোনা যায়।') } },
  { clip: 'acc-water', word: 'water',
    uk: { tag: L('Clear t', 'স্পষ্ট t'), parts: [['wa'], ['t', 'hi'], ['e'], ['r', 'ghost']], say: 'waw-tuh', ipa: '/ˈwɔːtə/', note: L('A clear t, and no r at the end.', 'স্পষ্ট t, আর শেষে r নেই।') },
    us: { tag: L('Flap t', 'নরম t'), parts: [['wa'], ['t', 'hi'], ['er']], say: 'wah-der', ipa: '/ˈwɑːɾɚ/', note: L('The t turns into a quick, soft d.', 't হয়ে যায় দ্রুত, নরম d-এর মতো।') } },
  { clip: 'acc-dance', word: 'dance',
    uk: { tag: L('Long ah', 'লম্বা আ'), parts: [['d'], ['a', 'hi'], ['nce']], say: 'dahns', ipa: '/dɑːns/', note: L('A long, open “ah”, as in father.', 'father-এর মতো লম্বা, খোলা “আ”।') },
    us: { tag: L('Short a', 'ছোট অ্যা'), parts: [['d'], ['a', 'hi'], ['nce']], say: 'dans', ipa: '/dæns/', note: L('The vowel from cat.', 'cat-এর স্বর।') } },
  { clip: 'acc-schedule', word: 'schedule',
    uk: { tag: L('Sh- start', 'sh দিয়ে শুরু'), parts: [['sch', 'hi'], ['edule']], say: 'shed-yool', ipa: '/ˈʃedjuːl/', note: L('Begins with sh.', 'sh দিয়ে শুরু।') },
    us: { tag: L('Sk- start', 'sk দিয়ে শুরু'), parts: [['sch', 'hi'], ['edule']], say: 'sked-jool', ipa: '/ˈskedʒuːl/', note: L('Begins with sk.', 'sk দিয়ে শুরু।') } },
  { clip: 'acc-vitamin', word: 'vitamin',
    uk: { tag: L('Short i', 'ছোট ই'), parts: [['v'], ['i', 'hi'], ['tamin']], say: 'VIT-a-min', ipa: '/ˈvɪtəmɪn/', note: L('vit-, as in sit.', 'sit-এর মতো vit-।') },
    us: { tag: L('Long i', 'আই'), parts: [['v'], ['i', 'hi'], ['tamin']], say: 'VY-ta-min', ipa: '/ˈvaɪtəmɪn/', note: L('vite-, as in bite.', 'bite-এর মতো vite-।') } },
  { clip: 'acc-tomato', word: 'tomato',
    uk: { tag: L('mah', 'মা'), parts: [['tom'], ['a', 'hi'], ['to']], say: 'tuh-MAH-toh', ipa: '/təˈmɑːtəʊ/', note: L('The middle vowel is a long ah.', 'মাঝের স্বর লম্বা “আ”।') },
    us: { tag: L('may', 'মে'), parts: [['tom'], ['a', 'hi'], ['to']], say: 'tuh-MAY-toh', ipa: '/təˈmeɪtoʊ/', note: L('The middle vowel sounds like may.', 'মাঝের স্বর “may”-এর মতো।') } },
];

export const UNITS = [
  // ───────────────────────────────────────────────────────── 1 · WORD STRESS
  {
    id: 'word-stress', n: 1, group: 'music', glyph: 'beads',
    title: L('Word Stress', 'শব্দের জোর'),
    tag: L('The beat inside a word', 'শব্দের ভেতরের তাল'),
    hero: L('One big beat.', 'একটি বড় তাল।'),
    intro: L('Every English word has one strong syllable. Make it big — louder, longer, and the voice moves — and let the others get small.', 'প্রতিটি ইংরেজি শব্দে একটি জোরালো অক্ষর থাকে। সেটাকে বড় করুন — বেশি জোরে, বেশি লম্বা, কণ্ঠ ওঠানামা করে — আর বাকিগুলোকে ছোট হতে দিন।'),
    heroClip: 'dec-photographic',
    manifesto: L('Put the beat in the right place, and <em>the word is easy to hear.</em>', 'তালটা ঠিক জায়গায় দিন, তাহলে শব্দটা সহজে বোঝা যায়।'),
    takeaway: L('One big beat. The small beats get smaller.', 'একটি বড় তাল। ছোট তালগুলো আরও ছোট হয়।'),
    preload: ['dec-photograph', 'dec-photographic', 'vow-about', 'vow-sofa', 'vow-supply'],
    steps: [
      { key: 'hear', sections: [
        { type: 'lines', id: 'big-beat', title: L('One big beat', 'একটি বড় তাল'),
          cue: L('Watch the ball. It jumps highest into the big beat, and the line swells there.', 'বলটা দেখুন। বড় তালে সেটা সবচেয়ে উঁচুতে লাফায়, আর রেখাটাও সেখানে মোটা হয়।'),
          note: L('Add -ic and the beat jumps: PHO·to·graph → pho·to·GRAPH·ic.', '-ic যোগ করলে তাল সরে যায়: PHO·to·graph → pho·to·GRAPH·ic।'),
          clips: ['dec-photograph', 'dec-photographic'], shareScale: true, autoplay: ['dec-photograph', 'dec-photographic'] },
        { type: 'schwa', id: 'small-beats', title: L('Small beats get smaller', 'ছোট তাল আরও ছোট হয়'),
          cue: L('The weak part shrinks to a tiny, lazy “uh”: ə. It is quick and quiet.', 'দুর্বল অংশটি ছোট্ট, অলস একটা “অ্যা”-তে (ə) পরিণত হয়। দ্রুত আর আস্তে।'),
          l1: L('In Bangla we say every syllable clearly. In English the weak ones go quick and quiet.', 'বাংলায় আমরা প্রতিটি অক্ষর স্পষ্ট করে বলি। ইংরেজিতে দুর্বলগুলো দ্রুত আর আস্তে বলা হয়।'),
          words: [
            { clip: 'vow-about', parts: [['a', 0], ['bout', 2]], note: L('schwa at the start', 'শুরুতে schwa') },
            { clip: 'vow-sofa', parts: [['so', 2], ['fa', 0]], note: L('schwa at the end', 'শেষে schwa') },
            { clip: 'vow-supply', parts: [['sup', 0], ['ply', 2]], note: L('schwa at the start', 'শুরুতে schwa') },
          ] },
        { type: 'suffix', id: 'endings', title: L('Endings point to the beat', 'শেষাংশ তাল দেখিয়ে দেয়'),
          cue: L('With these endings, the beat sits just before them.', 'এই শেষাংশগুলো থাকলে, তাল ঠিক তার আগের অক্ষরে পড়ে।'),
          rows: [
            { end: '-tion', clip: 'dec-information' },
            { end: '-sion', clip: 'dec-decision' },
            { end: '-ic', clip: 'dec-photographic', compare: 'dec-photograph' },
            { end: '-ity', clip: 'dec-ability' },
            { end: '-ous', clip: 'dec-famous' },
          ],
          note: L('A strong clue, not a law. Listen to check.', 'এটা শক্ত একটা সূত্র, কিন্তু সবসময় নয়। শুনে মিলিয়ে নিন।') },
        { type: 'prefix', id: 'prefixes', title: L('Some parts never move the beat', 'কিছু অংশ তাল সরায় না'),
          cue: L('Prefixes like un-, dis-, re- stay light. Endings like -ness and -ly too. The beat stays on the root word.', 'un-, dis-, re- এর মতো উপসর্গ হালকা থাকে। -ness, -ly-ও তাই। তাল মূল শব্দেই থাকে।'),
          rows: [
            { tag: 'un-', from: 'dec-happy', to: 'dec-unhappy' },
            { tag: 'dis-', from: 'dec-agree', to: 'dec-disagree' },
            { tag: 're-', to: 'dec-rewrite' },
            { tag: '-ness', from: 'dec-happy', to: 'dec-happiness' },
            { tag: '-ly', to: 'dec-quickly' },
          ] },
        { type: 'compound', id: 'compounds', title: L('One thing, or two words?', 'একটা জিনিস, নাকি দুটো শব্দ?'),
          cue: L('Two words can name one thing — then the beat goes first. Or one word can describe the other — then the beat goes second.', 'দুটো শব্দ মিলে একটা জিনিসের নাম হলে তাল প্রথমটায়। একটা শব্দ অন্যটাকে বর্ণনা করলে তাল দ্বিতীয়টায়।'),
          rows: [
            { n: 'cmp-blackboard-n', p: 'cmp-black-board-p', a: 'black', b: 'board', mn: L('the classroom object', 'ক্লাসরুমের বোর্ড'), mp: L('a board that is black', 'কালো রঙের যেকোনো বোর্ড') },
            { n: 'cmp-greenhouse-n', p: 'cmp-green-house-p', a: 'green', b: 'house', mn: L('a glass house for plants', 'গাছের জন্য কাচের ঘর'), mp: L('a house painted green', 'সবুজ রঙের বাড়ি') },
            { n: 'cmp-hotdog-n', p: 'cmp-hot-dog-p', a: 'hot', b: 'dog', mn: L('the food', 'খাবারটা'), mp: L('a warm dog!', 'গরমে কাতর কুকুর!') },
          ] },
      ] },
      { key: 'play', sections: [
        { type: 'stress', id: 'find-beat', title: L('Where is the big beat?', 'বড় তালটা কোথায়?'),
          cue: L('Say it to yourself. Tap the strong syllable. Then the recording checks you.', 'মনে মনে বলুন। জোরালো অক্ষরে চাপ দিন। তারপর রেকর্ডিং মিলিয়ে দেবে।'),
          items: ['dec-information', 'dec-decision', 'dec-ability', 'dec-photographic', 'dec-photograph', 'dec-famous', 'vow-about', 'vow-supply', 'dec-unhappy', 'dec-disagree', 'dec-interrupt', 'dec-happiness'] },
        { type: 'compoundgame', id: 'strong-beat', title: L('Follow the strong beat', 'জোরালো তালটা ধরুন'),
          cue: L('Hear one. Was it one thing (BLACKboard) or a describing word + thing (black BOARD)?', 'একটা শুনুন। এটা কি একটা জিনিস (BLACKboard), নাকি বর্ণনা + জিনিস (black BOARD)?'),
          clips: ['cmp-blackboard-n', 'cmp-black-board-p', 'cmp-greenhouse-n', 'cmp-green-house-p', 'cmp-hotdog-n', 'cmp-hot-dog-p'] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 2 · BIG WORDS, SMALL WORDS
  {
    id: 'sentence-stress', n: 2, group: 'music', glyph: 'rush',
    title: L('Big Words, Small Words', 'বড় শব্দ, ছোট শব্দ'),
    tag: L('The beat of a sentence', 'বাক্যের তাল'),
    hero: L('Make the message land.', 'বার্তাটা পৌঁছে দিন।'),
    intro: L('In a sentence the important words get the big beats. The little grammar words rush and shrink between them.', 'বাক্যে গুরুত্বপূর্ণ শব্দগুলো বড় তাল পায়। ছোট ব্যাকরণের শব্দগুলো তাদের মাঝে দ্রুত আর ছোট হয়ে যায়।'),
    heroClip: 'pro-sent1',
    manifesto: L('We’re not erasing your accent. <em>Your accent is your story.</em> We’re making sure every word lands.', 'আমরা আপনার উচ্চারণ মুছে দিচ্ছি না। আপনার উচ্চারণ আপনার গল্প। আমরা শুধু নিশ্চিত করছি প্রতিটি শব্দ পৌঁছায়।'),
    takeaway: L('Big words big. Small words rush.', 'বড় শব্দ বড়। ছোট শব্দ দ্রুত।'),
    preload: ['pro-sent1', 'pro-sent4', 'lnk-turn-off'],
    steps: [
      { key: 'hear', sections: [
        { type: 'legend', id: 'read-music', title: L('Read the music', 'সুরটা পড়ুন'),
          cue: L('Three things to watch in every picture.', 'প্রতিটি ছবিতে তিনটি জিনিস দেখুন।'), clip: 'lnk-turn-off' },
        { type: 'lines', id: 'news-word', title: L('One word carries the news', 'একটি শব্দে আসল খবর'),
          cue: L('Each thought group has one word that matters most. It gets the biggest beat and the voice moves on it.', 'প্রতিটি ভাবনার দলে একটি শব্দ সবচেয়ে গুরুত্বপূর্ণ। সেটা সবচেয়ে বড় তাল পায়, আর কণ্ঠ সেখানে ওঠানামা করে।'),
          clips: ['pro-sent1'], autoplay: ['pro-sent1'], labels: 'words' },
        { type: 'rushdemo', id: 'small-rush', title: L('Small words rush', 'ছোট শব্দ ছুটে যায়'),
          cue: L('the, a, to, for, and, my, was… They get quick, quiet and short. That makes room for the big words.', 'the, a, to, for, and, my, was… এগুলো দ্রুত, আস্তে আর ছোট হয়। তাতে বড় শব্দগুলোর জায়গা হয়।'),
          l1: L('Bangla speakers often give every word the same weight. In English that hides the message.', 'বাংলাভাষীরা প্রায়ই প্রতিটি শব্দে সমান জোর দেন। ইংরেজিতে তাতে বার্তাটা চাপা পড়ে।'),
          clip: 'pro-sent4' },
      ] },
      { key: 'play', sections: [
        { type: 'bigbeat', id: 'message-visible', title: L('Make the message visible', 'বার্তাটা চোখে দেখুন'),
          cue: L('Tap the word that should be biggest in each part. Then listen as it grows.', 'প্রতিটি অংশে যে শব্দটা সবচেয়ে বড় হওয়া উচিত তাতে চাপ দিন। তারপর শুনুন, সেটা কীভাবে বড় হয়।'),
          rounds: ['pro-sent3', 'lnk-turn-off', 'num-date-oct12', 'pro-sent1', 'pro-sent2', 'pro-sent4'] },
        { type: 'rush', id: 'catch-small', title: L('Catch the words that disappear', 'হারিয়ে যাওয়া শব্দগুলো ধরুন'),
          cue: L('Listen. Tap every word that sounded small and quick. Then reveal the rhythm.', 'শুনুন। যে শব্দগুলো ছোট আর দ্রুত শোনাল সবগুলোতে চাপ দিন। তারপর ছন্দটা দেখুন।'),
          rounds: ['pro-sent2', 'lnk-turn-off', 'pro-sent1', 'pro-sent4'] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 3 · THOUGHT GROUPS
  {
    id: 'melody', n: 3, group: 'music', glyph: 'melody',
    title: L('Thought Groups', 'ভাবনার দল'),
    tag: L('One thought, one tune', 'এক ভাবনা, এক সুর'),
    hero: L('Speak in thought groups.', 'ভাবনার দলে কথা বলুন।'),
    intro: L('A long sentence is a few small groups. Each one has its own tune, and the voice starts fresh after a short pause.', 'একটি লম্বা বাক্য কয়েকটি ছোট দলে ভাগ হয়। প্রতিটির নিজস্ব সুর, আর ছোট্ট বিরতির পর কণ্ঠ নতুন করে শুরু হয়।'),
    heroClip: 'pro-sent2',
    manifesto: L('A pause is not empty space. It tells the listener <em>which words belong together.</em>', 'বিরতি ফাঁকা জায়গা নয়। এটা শ্রোতাকে বলে কোন শব্দগুলো একসাথে।'),
    takeaway: L('Small groups. One tune each. Pause between them.', 'ছোট ছোট দল। প্রতিটির একটি সুর। মাঝে ছোট্ট বিরতি।'),
    preload: ['pro-sent1', 'pro-sent1-mono', 'pro-sent2', 'pro-sent3', 'pro-nopause'],
    steps: [
      { key: 'hear', sections: [
        { type: 'melody', id: 'melody-off', title: L('Melody on, melody off', 'সুর আছে, সুর নেই'),
          cue: L('Same voice, same words, same speed. The second one says it all on one flat note.', 'একই কণ্ঠ, একই শব্দ, একই গতি। দ্বিতীয়টায় সব একটাই সমান সুরে বলা।'),
          ask: L('Which one is easier to follow?', 'কোনটা বুঝতে সহজ?'), on: 'pro-sent1', off: 'pro-sent1-mono' },
        { type: 'lines', id: 'groups', title: L('One sentence, several small tunes', 'এক বাক্য, কয়েকটি ছোট সুর'),
          cue: L('Each group starts high enough to carry, then drifts down. // = a short breath.', 'প্রতিটি দল একটু উঁচু থেকে শুরু হয়, তারপর নেমে আসে। // = ছোট্ট নিঃশ্বাস।'),
          l1: L('In Bangla, the listener helps carry the meaning. In English, the voice carries it.', 'বাংলায় শ্রোতাও অর্থ বুঝে নিতে সাহায্য করেন। ইংরেজিতে কণ্ঠকেই অর্থ বহন করতে হয়।'),
          clips: ['pro-sent1', 'pro-sent2'], stack: 'always', labels: 'words', autoplay: ['pro-sent1'] },
        { type: 'pause', id: 'grandma', title: L('The pause is the message', 'বিরতিতেই অর্থ'),
          cue: L('One small pause changes everything.', 'একটা ছোট্ট বিরতি পুরো অর্থ বদলে দেয়।'),
          a: { clip: 'pro-sent3', text: 'Let’s eat, Grandma!', mean: L('Grandma is invited to dinner.', 'দাদি/নানিকে খেতে ডাকা হচ্ছে।') },
          b: { clip: 'pro-nopause', text: 'Let’s eat Grandma!', mean: L('Grandma IS the dinner!', 'দাদি/নানিকেই খাওয়া হবে!') } },
      ] },
      { key: 'play', sections: [
        { type: 'pausegame', id: 'detective', title: L('Pause detective', 'বিরতি গোয়েন্দা'),
          cue: L('Listen. Tap the gaps where you hear a pause.', 'শুনুন। যেখানে বিরতি শুনছেন সেই ফাঁকে চাপ দিন।'),
          rounds: [
            { clip: 'pro-sent3', parts: ['Let’s eat', 'Grandma!'], gaps: [0] },
            { clip: 'pro-nopause', parts: ['Let’s eat', 'Grandma!'], gaps: [] },
            { clip: 'pro-sent4', parts: ['The teacher', 'who helped me', 'the most', 'was my', 'English teacher', 'in high school.'], gaps: [2, 4] },
            { clip: 'pro-sent1', parts: ['After the', 'long meeting', 'I went', 'straight home', 'and slept', 'for hours.'], gaps: [1, 3] },
            { clip: 'pro-sent2', parts: ['When I finished', 'my homework', 'I called', 'my friend', 'and we played', 'football.'], gaps: [1, 3] },
          ] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 4 · LINKING
  {
    id: 'linking', n: 4, group: 'music', glyph: 'link',
    title: L('Linking', 'শব্দ জোড়া'),
    tag: L('Words don’t stand alone', 'শব্দ একা থাকে না'),
    hero: L('Words don’t stand alone.', 'শব্দ একা থাকে না।'),
    intro: L('Natural English glues words together. Hear the join, then let one phrase flow as one smooth sound.', 'স্বাভাবিক ইংরেজিতে শব্দগুলো জুড়ে যায়। জোড়াটা শুনুন, তারপর পুরো বাক্যাংশ এক টানে বলুন।'),
    heroClip: 'lnk-pick-it-up',
    manifesto: L('English does not always sound fast. <em>It often sounds connected.</em>', 'ইংরেজি সবসময় দ্রুত নয়। প্রায়ই এটা জোড়া লাগানো।'),
    takeaway: L('Don’t stop after every word. Carry the sound across.', 'প্রতিটি শব্দের পর থামবেন না। শব্দটা পরের শব্দে নিয়ে যান।'),
    preload: ['lnk-go-on', 'lnk-an-apple', 'lnk-come-in', 'lnk-pick-it-up', 'lnk-turn-off', 'lnk-whats-up'],
    steps: [
      { key: 'hear', sections: [
        { type: 'links', id: 'glue', title: L('Hear the glue', 'জোড়াটা শুনুন'),
          cue: L('When a word ends in a sound that can join the next one, there is no gap. The line keeps flowing.', 'একটি শব্দের শেষ ধ্বনি যদি পরের শব্দের সাথে জুড়তে পারে, তাহলে ফাঁক থাকে না। রেখাটা বয়ে চলে।'),
          rows: [
            { clip: 'lnk-go-on', words: ['go', 'on'], links: [0], kind: L('vowel → vowel', 'স্বর → স্বর'), like: 'go-won', how: L('A tiny w glides between the two vowels.', 'দুটি স্বরের মাঝে ছোট্ট একটা w চলে আসে।') },
            { clip: 'lnk-an-apple', words: ['an', 'apple'], links: [0], kind: L('consonant → vowel', 'ব্যঞ্জন → স্বর'), like: 'a-napple', how: L('The n carries forward into apple.', 'n-টা apple-এর দিকে চলে যায়।') },
          ],
          note: L('Do not rush. Keep the words clear and remove only the unnecessary stop.', 'তাড়াহুড়ো করবেন না। শব্দগুলো স্পষ্ট রাখুন, শুধু অপ্রয়োজনীয় থামাটা বাদ দিন।') },
        { type: 'links', id: 'three-ways', title: L('Three ways words connect', 'শব্দ জোড়ার তিন উপায়'),
          cue: L('A consonant carries forward. A chain of links. An r that joins the next vowel.', 'একটি ব্যঞ্জন সামনে চলে যায়। পরপর কয়েকটা জোড়া। একটা r পরের স্বরের সাথে জোড়ে।'),
          rows: [
            { clip: 'lnk-come-in', words: ['come', 'in'], links: [0], kind: L('consonant → vowel', 'ব্যঞ্জন → স্বর'), like: 'co-min' },
            { clip: 'lnk-pick-it-up', words: ['pick', 'it', 'up'], links: [0, 1], kind: L('a chain of two links', 'পরপর দুটি জোড়া'), like: 'pi-cki-tup' },
            { clip: 'lnk-turn-off', words: ['turn', 'off', 'the', 'light'], links: [0], kind: L('r carries across', 'r পার হয়ে যায়'), like: 'tur-noff the light' },
          ] },
      ] },
      { key: 'play', sections: [
        { type: 'linkgame', id: 'link-detective', title: L('Where do the words join?', 'শব্দগুলো কোথায় জোড়ে?'),
          cue: L('Play the phrase. Tap each space where the words join with no gap.', 'বাক্যাংশটা শুনুন। যেখানে শব্দগুলো ফাঁক ছাড়া জুড়ে যায়, সেই ফাঁকে চাপ দিন।'),
          rounds: [
            { clip: 'lnk-go-on', words: ['Go', 'on'], links: [0], like: 'go-won' },
            { clip: 'lnk-an-apple', words: ['An', 'apple'], links: [0], like: 'a-napple' },
            { clip: 'lnk-come-in', words: ['Come', 'in'], links: [0], like: 'co-min' },
            { clip: 'lnk-whats-up', words: ['What’s', 'up?'], links: [0], like: 'wha-tsup' },
            { clip: 'lnk-pick-it-up', words: ['Pick', 'it', 'up'], links: [0, 1], like: 'pi-cki-tup' },
            { clip: 'lnk-turn-off', words: ['Turn', 'off', 'the', 'light'], links: [0], like: 'tur-noff the light' },
          ] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 5 · NUMBERS & DATES
  {
    id: 'numbers', n: 5, group: 'music', glyph: 'digits',
    title: L('Numbers & Dates', 'সংখ্যা ও তারিখ'),
    tag: L('Say the number, not every digit', 'প্রতিটি অঙ্ক নয়, সংখ্যাটা বলুন'),
    hero: L('Read the number, not every digit.', 'প্রতিটি অঙ্ক নয়, সংখ্যাটা পড়ুন।'),
    intro: L('Years, phone numbers, dates, prices and times follow spoken patterns. Group them, and a long number becomes a short message.', 'সাল, ফোন নম্বর, তারিখ, দাম আর সময় বলার নির্দিষ্ট ধরন আছে। দলে ভাগ করুন, লম্বা সংখ্যাও ছোট বার্তা হয়ে যাবে।'),
    heroClip: 'num-year1994',
    manifesto: L('Numbers are not only maths. In conversation they have <em>rhythm, grouping and stress.</em>', 'সংখ্যা শুধু অঙ্ক নয়। কথায় এদেরও ছন্দ, দল আর জোর আছে।'),
    takeaway: L('Group the digits. Stress the last one in each group.', 'অঙ্কগুলো দলে ভাগ করুন। প্রতিটি দলের শেষটায় জোর দিন।'),
    preload: ['num-year1994', 'num-year2026', 'num-phone', 'num-date-oct12', 'num-price-14000', 'num-time-530'],
    steps: [
      { key: 'hear', sections: [
        { type: 'years', id: 'years', title: L('Split a year into two pairs', 'সালকে দুই জোড়ায় ভাগ করুন'),
          cue: L('Draw an invisible line down the middle. Say the first pair, then the second.', 'মাঝখানে একটা অদৃশ্য দাগ টানুন। প্রথম জোড়া বলুন, তারপর দ্বিতীয়টা।'),
          rows: [
            { clip: 'num-year1994', a: '19', b: '94', say: 'nineteen ninety-four', not: L('Not “one thousand nine hundred ninety-four”.', '“one thousand nine hundred ninety-four” নয়।') },
            { clip: 'num-year2026', a: '20', b: '26', say: 'twenty twenty-six', not: L('Two pairs, two small groups.', 'দুই জোড়া, দুটি ছোট দল।') },
          ] },
        { type: 'phone', id: 'phone', title: L('Phone numbers come in groups', 'ফোন নম্বর দলে দলে'),
          cue: L('Do not push eleven digits out in one breath. Small groups, a tiny pause, the beat on the last digit of each.', 'এগারোটা অঙ্ক এক নিঃশ্বাসে বলবেন না। ছোট দল, ছোট্ট বিরতি, প্রতিটি দলের শেষ অঙ্কে জোর।'),
          clip: 'num-phone', digits: '01712345678', groups: ['017', '12', '345', '678'] },
        { type: 'meaning', id: 'say-meaning', title: L('Say what the symbols mean', 'চিহ্নের অর্থটা বলুন'),
          cue: L('In speech the symbols disappear: 12th becomes twelfth, the comma groups the thousands, the colon is silent.', 'কথায় চিহ্নগুলো হারিয়ে যায়: 12th হয় twelfth, কমা হাজারকে আলাদা করে, কোলন চুপ থাকে।'),
          rows: [
            { clip: 'num-date-oct12', label: L('Date', 'তারিখ'), show: 'October 12th', say: 'October twelfth' },
            { clip: 'num-price-14000', label: L('Price', 'দাম'), show: '14,000 taka', say: 'fourteen thousand taka' },
            { clip: 'num-time-530', label: L('Time', 'সময়'), show: '5:30', say: 'five thirty' },
          ] },
      ] },
      { key: 'play', sections: [
        { type: 'numbergame', id: 'which-number', title: L('Which number did you hear?', 'কোন সংখ্যাটা শুনলেন?'),
          cue: L('Listen for the groups — and for the beat: fourTEEN and thirTEEN end strong; FORty and THIRty start strong.', 'দলগুলো শুনুন — আর তালটাও: fourTEEN, thirTEEN শেষে জোর; FORty, THIRty শুরুতে জোর।'),
          rounds: [
            { clip: 'num-price-14000', options: ['14,000 taka', '40,000 taka', '4,000 taka'], answer: 0, why: L('FOURteen thousand — the -teen is there and long.', 'fourteen — -teen অংশটা আছে, আর লম্বা।') },
            { clip: 'num-time-530', options: ['5:30', '5:13', '3:30'], answer: 0, why: L('THIRty: the beat is on the first part.', 'THIRty: জোর প্রথম অংশে।') },
            { clip: 'num-year1994', options: ['1994', '1984', '1904'], answer: 0, why: L('nineteen ninety-four: two pairs.', 'nineteen ninety-four: দুই জোড়া।') },
            { clip: 'num-date-oct12', options: ['October 12th', 'October 20th', 'December 12th'], answer: 0, why: L('twelfth — one strong syllable at the end.', 'twelfth — শেষে একটি জোরালো অক্ষর।') },
            { clip: 'num-year2026', options: ['2026', '2016', '2006'], answer: 0, why: L('twenty twenty-SIX.', 'twenty twenty-SIX।') },
            { clip: 'num-phone', options: ['017 12 345 678', '071 12 345 678', '017 21 345 678'], answer: 0, why: L('zero one seven · one two · three four five · six seven eight.', 'zero one seven · one two · three four five · six seven eight।') },
          ] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 6 · LONG & SHORT VOWELS
  {
    id: 'vowels', n: 6, group: 'sounds', glyph: 'bars',
    title: L('Long & Short Vowels', 'লম্বা ও ছোট স্বর'),
    tag: L('Stretch it or relax it', 'টানটান না ঢিলেঢালা'),
    hero: L('Stretch it. Relax it.', 'টানটান করুন। ঢিলে দিন।'),
    intro: L('Long vowels are tense: the muscles pull and the sound lasts. Short vowels are relaxed: the muscles let go and the sound is quick.', 'লম্বা স্বর টানটান: পেশি টানে আর শব্দ স্থায়ী হয়। ছোট স্বর ঢিলেঢালা: পেশি ছেড়ে দেয় আর শব্দ দ্রুত।'),
    heroClip: 'vow-team',
    manifesto: L('The vowel is not just a letter. It has <em>a shape, a strength and a length.</em>', 'স্বর শুধু একটা অক্ষর নয়। এর আকার, জোর আর দৈর্ঘ্য আছে।'),
    takeaway: L('Long: stretch and hold. Short: relax and let go.', 'লম্বা: টেনে ধরে রাখুন। ছোট: ঢিলে দিয়ে ছেড়ে দিন।'),
    preload: ['vow-team', 'vow-tim', 'vow-beat', 'vow-bit', 'vow-fool', 'vow-full', 'vow-pool', 'vow-pull'],
    steps: [
      { key: 'hear', sections: [
        { type: 'pairs', id: 'stretch', visual: 'vowel', title: L('Tense, then relaxed', 'টানটান, তারপর ঢিলেঢালা'),
          cue: L('Watch the cheeks. Long ee and oo: the muscles pull tight and hold. Short i and u: they let go.', 'গালের দিকে দেখুন। লম্বা ee আর oo: পেশি শক্ত করে টেনে ধরে। ছোট i আর u: পেশি ছেড়ে দেয়।'),
          l1: L('Bangla ই and ঈ sound almost the same. In English, team and Tim are two different words.', 'বাংলায় ই আর ঈ প্রায় একই রকম শোনায়। ইংরেজিতে team আর Tim দুটো আলাদা শব্দ।'),
          pairs: [
            { a: 'vow-team', b: 'vow-tim', la: 'long ee', lb: 'short i', pose: ['ee', 'ih'] },
            { a: 'vow-beat', b: 'vow-bit', la: 'long ee', lb: 'short i', pose: ['ee', 'ih'] },
            { a: 'vow-fool', b: 'vow-full', la: 'long oo', lb: 'short u', pose: ['oo', 'uu'] },
            { a: 'vow-pool', b: 'vow-pull', la: 'long oo', lb: 'short u', pose: ['oo', 'uu'] },
          ] },
        { type: 'doors', id: 'open-closed', title: L('Spelling clue: open or closed', 'বানানের সূত্র: খোলা না বন্ধ'),
          cue: L('A syllable that ends in a vowel is open: the vowel is long. A consonant closes it: the vowel is short.', 'অক্ষর স্বরে শেষ হলে সেটা খোলা: স্বর লম্বা। ব্যঞ্জনে শেষ হলে বন্ধ: স্বর ছোট।'),
          open: [{ clip: 'dec-me', show: 'me', why: 'open · long e' }, { clip: 'dec-go', show: 'go', why: 'open · long o' }, { clip: 'dec-baby', show: 'ba·by', why: 'ba is open · long a' }],
          closed: [{ clip: 'dec-cat', show: 'cat', why: 'closed · short a' }, { clip: 'dec-bed', show: 'bed', why: 'closed · short e' }, { clip: 'dec-sunset', show: 'sun·set', why: 'both closed · short' }],
          twin: { open: { clip: 'dec-hoping', show: 'ho·ping' }, closed: { clip: 'dec-hopping', show: 'hop·ping' } },
          note: L('The double p shuts the door: hop·ping.', 'দুটো p দরজা বন্ধ করে দেয়: hop·ping।'),
          ask: {
            title: L('Students always ask: desert or dessert?', 'সবাই জিজ্ঞেস করে: desert না dessert?'),
            body: L('Here the double s does not change the first vowel. The beat moves. DES·ert is the hot, sandy place. des·SERT is the sweet thing after dinner.', 'এখানে দুটো s প্রথম স্বর বদলায় না। তাল সরে যায়। DES·ert হলো গরম বালুর জায়গা। des·SERT হলো খাবারের পরের মিষ্টি।'),
            trick: L('Memory trick: dessert has two s’s, because you always want seconds of something sweet.', 'মনে রাখার কৌশল: dessert-এ দুটো s, কারণ মিষ্টি জিনিস সবাই দুবার চায়।'),
            a: { word: 'desert', parts: [['DES', 2], ['ert', 0]], clip: 'dec-desert', mean: L('sand, heat, camels', 'বালু, গরম, উট') },
            b: { word: 'dessert', parts: [['des', 0], ['SERT', 2]], clip: 'dec-dessert', mean: L('cake, ice cream, mishti', 'কেক, আইসক্রিম, মিষ্টি') },
          } },
      ] },
      { key: 'play', sections: [
        { type: 'identify', id: 'which-vowel', visual: 'vowel', title: L('Which word?', 'কোন শব্দ?'),
          cue: L('Listen first. Then tap the word you heard.', 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।'),
          pairs: [['vow-team', 'vow-tim'], ['vow-fool', 'vow-full'], ['vow-beat', 'vow-bit'], ['vow-pool', 'vow-pull']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 7 · VOICE & AIR
  {
    id: 'voice-air', n: 7, group: 'sounds', glyph: 'buzz',
    title: L('Voice & Air', 'কণ্ঠ ও বাতাস'),
    tag: L('Buzz or air?', 'গুঞ্জন না বাতাস?'),
    hero: L('Consonants are made of air and buzz.', 'ব্যঞ্জন তৈরি হয় বাতাস আর গুঞ্জনে।'),
    intro: L('One tiny change: quiet air becomes a buzz in your throat. That change separates fan from van, and price from prize.', 'একটা ছোট্ট পরিবর্তন: নিঃশব্দ বাতাস গলায় গুঞ্জন হয়ে যায়। এই পরিবর্তনেই fan আর van, price আর prize আলাদা।'),
    heroClip: 'con-van',
    manifesto: L('Your ears may hear two English sounds as one. Slow it down, <em>feel the buzz,</em> then listen again.', 'আপনার কান দুটো ইংরেজি ধ্বনিকে একটা ভাবতে পারে। ধীরে বলুন, গুঞ্জনটা অনুভব করুন, তারপর আবার শুনুন।'),
    takeaway: L('Switch the buzz on. Shape the lips. Keep “er” in the middle.', 'গুঞ্জন চালু করুন। ঠোঁটের আকার ঠিক রাখুন। “er” মুখের মাঝখানে রাখুন।'),
    preload: ['con-fan', 'con-van', 'con-sip', 'con-zip'],
    steps: [
      { key: 'hear', sections: [
        { type: 'pairs', id: 'buzz', visual: 'airvoice', title: L('Air only, or air + buzz', 'শুধু বাতাস, নাকি বাতাস + গুঞ্জন'),
          cue: L('Same mouth. f and s are only air. v and z switch on the voice box.', 'মুখের আকার একই। f আর s শুধু বাতাস। v আর z-এ কণ্ঠযন্ত্র চালু হয়।'),
          feel: L('Put two fingers on your throat. Say ffff, then vvvv.', 'গলায় দুটো আঙুল রাখুন। ffff বলুন, তারপর vvvv।'),
          pairs: [
            { a: 'con-fan', b: 'con-van', la: 'air', lb: 'air + buzz' },
            { a: 'con-sip', b: 'con-zip', la: 'air', lb: 'air + buzz' },
          ] },
        { type: 'pairs', id: 'end-vowel', visual: 'endvowel', title: L('At the end, listen to the vowel', 'শেষে, স্বরটা শুনুন'),
          cue: L('Before a final v or z, the vowel gets longer.', 'শেষে v বা z থাকলে তার আগের স্বরটা লম্বা হয়।'),
          pairs: [
            { a: 'con-safe', b: 'con-save', la: 'short', lb: 'longer' },
            { a: 'con-price', b: 'con-prize', la: 'short', lb: 'longer' },
          ] },
        { type: 'pairs', id: 'lips', visual: 'lips', title: L('Pop, hiss, or round', 'ফট, হিস্‌, নাকি গোল'),
          cue: L('p pops with both lips. f hisses: top teeth on the bottom lip. w starts round, then opens.', 'p — দুই ঠোঁট দিয়ে ফট করে। f — উপরের দাঁত নিচের ঠোঁটে, হিস্‌স্‌। w — ঠোঁট গোল, তারপর খোলে।'),
          l1: L('Bangla ফ is often p + h, and ব can cover both b and w. English keeps them apart.', 'বাংলা ‘ফ’ অনেক সময় প + হ-এর মতো, আর ‘ব’ দিয়ে b ও w দুটোই বোঝাই। ইংরেজিতে এগুলো আলাদা।'),
          pairs: [
            { a: 'con-pin', b: 'con-fin', la: 'pop', lb: 'hiss', pose: ['pb', 'fv'] },
            { a: 'con-pat', b: 'con-fat', la: 'pop', lb: 'hiss', pose: ['pb', 'fv'] },
            { a: 'con-west', b: 'con-best', la: 'round', lb: 'press', pose: ['w', 'pb'] },
            { a: 'con-wet', b: 'con-bet', la: 'round', lb: 'press', pose: ['w', 'pb'] },
          ] },
        { type: 'pairs', id: 'z-j', visual: 'airvoice', title: L('Flow or stop', 'একটানা নাকি থেমে'),
          cue: L('z keeps buzzing — you can hold it: zzzzoo. j stops first, then releases.', 'z-এর গুঞ্জন চলতেই থাকে — ধরে রাখা যায়: zzzzoo। j আগে থামে, তারপর ছাড়ে।'),
          l1: L('Bangla has no separate z, so zoo can come out as Jew. Hold the buzz.', 'বাংলায় আলাদা z নেই, তাই zoo অনেক সময় Jew হয়ে যায়। গুঞ্জনটা ধরে রাখুন।'),
          pairs: [{ a: 'con-zoo', b: 'con-jew', la: 'flow', lb: 'stop + release', pose: ['sz', 'sh'] }] },
        { type: 'er', id: 'er-sound', title: L('The “er” sound', '“er” ধ্বনি'),
          cue: L('earth, earn, herd: all one sound. Tongue bunched up in the middle, lips a little round, jaw almost closed. It is hard for Bangla speakers — go slowly.', 'earth, earn, herd: সবগুলোতে একই ধ্বনি। জিভ মাঝখানে গুটিয়ে উঁচু, ঠোঁট একটু গোল, চোয়াল প্রায় বন্ধ। বাংলাভাষীদের জন্য কঠিন — ধীরে বলুন।'),
          same: ['con-earth', 'con-earn', 'con-herd'],
          vs: { a: 'con-herd', b: 'con-hard' },
          vsCue: L('Not open “ar”: herd is not hard.', 'খোলা “ar” নয়: herd আর hard আলাদা।') },
      ] },
      { key: 'play', sections: [
        { type: 'identify', id: 'which-cons', visual: 'airvoice', title: L('Which word?', 'কোন শব্দ?'),
          cue: L('Listen first. Then tap the word you heard.', 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।'),
          pairs: [['con-fan', 'con-van'], ['con-safe', 'con-save'], ['con-sip', 'con-zip'], ['con-price', 'con-prize'], ['con-zoo', 'con-jew'], ['con-west', 'con-best'], ['con-wet', 'con-bet'], ['con-herd', 'con-hard'], ['con-pin', 'con-fin'], ['con-pat', 'con-fat']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 8 · THE PUFF
  {
    id: 'puff', n: 8, group: 'sounds', glyph: 'puff',
    title: L('The Puff', 'বাতাসের ঝাপটা'),
    tag: L('Let the air go', 'বাতাস ছেড়ে দিন'),
    hero: L('Put the air in the right place.', 'বাতাসটা ঠিক জায়গায় দিন।'),
    intro: L('Hold your hand in front of your mouth. Say pin: feel the puff. Say spin: almost none. That burst of air is part of English p, t and k.', 'মুখের সামনে হাত রাখুন। pin বলুন: ঝাপটা টের পাবেন। spin বলুন: প্রায় কিছুই না। এই বাতাসের ঝাপটা ইংরেজি p, t, k-এর অংশ।'),
    heroClip: 'asp-pin',
    manifesto: L('English and Bangla both use a puff of air — but they <em>file it in different places.</em>', 'ইংরেজি আর বাংলা দুটোই বাতাসের ঝাপটা ব্যবহার করে — কিন্তু আলাদা জায়গায়।'),
    takeaway: L('At the start: let the air go. After s: keep it quiet.', 'শুরুতে: বাতাস ছেড়ে দিন। s-এর পরে: চুপচাপ রাখুন।'),
    preload: ['asp-pin', 'asp-spin', 'asp-top', 'asp-stop', 'asp-key', 'asp-ski'],
    steps: [
      { key: 'hear', sections: [
        { type: 'pairs', id: 'puffs', visual: 'puff', title: L('Puff, then no puff', 'ঝাপটা, তারপর ঝাপটা নেই'),
          cue: L('p, t, k at the start of a word: a strong puff of air. After s: almost none.', 'শব্দের শুরুতে p, t, k: জোরে এক ঝাপটা বাতাস। s-এর পরে: প্রায় কিছুই না।'),
          feel: L('Hold your hand in front of your mouth. Say pin, then spin.', 'মুখের সামনে হাত রাখুন। pin বলুন, তারপর spin।'),
          pairs: [
            { a: 'asp-pin', b: 'asp-spin', la: 'puff', lb: 'no puff' },
            { a: 'asp-top', b: 'asp-stop', la: 'puff', lb: 'no puff' },
            { a: 'asp-key', b: 'asp-ski', la: 'puff', lb: 'no puff' },
          ] },
        { type: 'bhv', id: 'bh-v', title: L('ভ is not v', '‘ভ’ আর v এক নয়'),
          cue: L('ভ starts with closed lips, then breath. v never closes: top teeth on the bottom lip, keep buzzing.', '‘ভ’ বন্ধ ঠোঁট দিয়ে শুরু হয়, তারপর নিঃশ্বাস। v-তে ঠোঁট কখনো বন্ধ হয় না: উপরের দাঁত নিচের ঠোঁটে, গুঞ্জন চলতে থাকে।'),
          clip: 'con-van' },
      ] },
      { key: 'play', sections: [
        { type: 'identify', id: 'which-puff', visual: 'puff', title: L('Which word?', 'কোন শব্দ?'),
          cue: L('Listen to the whole word first. The puff is your second clue.', 'আগে পুরো শব্দটা শুনুন। ঝাপটাটা আপনার দ্বিতীয় সূত্র।'),
          pairs: [['asp-pin', 'asp-spin'], ['asp-top', 'asp-stop'], ['asp-key', 'asp-ski']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 9 · CLUSTERS
  {
    id: 'clusters', n: 9, group: 'sounds', glyph: 'tiles',
    title: L('Clusters', 'যুক্ত ব্যঞ্জন'),
    tag: L('Keep them together', 'একসাথে রাখুন'),
    hero: L('Keep them together.', 'একসাথে রাখুন।'),
    intro: L('English starts many words with two or three consonants in a row. Bangla adds a helper vowel: school becomes ইস্কুল. In English, start straight on the s.', 'ইংরেজিতে অনেক শব্দ পরপর দুই-তিনটি ব্যঞ্জন দিয়ে শুরু হয়। বাংলায় আমরা সাহায্যকারী স্বর যোগ করি: school হয়ে যায় ইস্কুল। ইংরেজিতে সরাসরি s দিয়ে শুরু করুন।'),
    heroClip: 'clu-school',
    manifesto: L('No gap. <em>No helper vowel.</em> One smooth start.', 'ফাঁক নেই। সাহায্যকারী স্বর নেই। এক টানে শুরু।'),
    takeaway: L('Start on the s. Keep moving. No vowel before it.', 's দিয়েই শুরু করুন। থামবেন না। আগে কোনো স্বর নয়।'),
    preload: ['clu-school', 'clu-eekul', 'clu-street', 'clu-sitreet', 'clu-splash', 'clu-spring'],
    steps: [
      { key: 'hear', sections: [
        { type: 'pairs', id: 'extra-vowel', visual: 'tiles', title: L('No extra vowel', 'বাড়তি স্বর নয়'),
          cue: L('An extra vowel adds a tile: the word gets longer — and different.', 'বাড়তি স্বর একটা টাইল যোগ করে: শব্দটা লম্বা হয় — আর আলাদা হয়ে যায়।'),
          l1: L('Bangla adds a helper vowel: school → ইস্কুল, station → ইস্টিশন.', 'বাংলায় আমরা সাহায্যকারী স্বর যোগ করি: school → ইস্কুল, station → ইস্টিশন।'),
          pairs: [
            { a: 'clu-school', b: 'clu-eekul', la: 'English', lb: 'extra vowel' },
            { a: 'clu-street', b: 'clu-sitreet', la: 'English', lb: 'extra vowel' },
          ] },
        { type: 'clusters', id: 'four', title: L('One smooth start', 'এক টানে শুরু'),
          cue: L('Two or three consonants, locked together. No gap, no helper vowel.', 'দুই বা তিনটি ব্যঞ্জন, একসাথে আটকানো। ফাঁক নেই, সাহায্যকারী স্বর নেই।'),
          words: [{ clip: 'clu-school', c: 'sk' }, { clip: 'clu-street', c: 'str' }, { clip: 'clu-splash', c: 'spl' }, { clip: 'clu-spring', c: 'spr' }] },
      ] },
      { key: 'play', sections: [
        { type: 'clustergame', id: 'catch-vowel', title: L('Catch the extra vowel', 'বাড়তি স্বরটা ধরুন'),
          cue: L('Listen. Clear English — or did a helper vowel slip in?', 'শুনুন। পরিষ্কার ইংরেজি — নাকি একটা সাহায্যকারী স্বর ঢুকে পড়েছে?'),
          rounds: [{ word: 'school', good: 'clu-school', bad: 'clu-eekul' }, { word: 'street', good: 'clu-street', bad: 'clu-sitreet' }, { word: 'school', good: 'clu-school', bad: 'clu-eekul' }, { word: 'street', good: 'clu-street', bad: 'clu-sitreet' }] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 10 · TH
  {
    id: 'th', n: 10, group: 'sounds', glyph: 'th',
    title: L('TH — Ear First', 'TH — আগে কান'),
    tag: L('Hear it. That is enough.', 'চিনতে পারলেই যথেষ্ট'),
    hero: L('Hear it. That is enough.', 'চিনতে পারলেই যথেষ্ট।'),
    intro: L('English has two TH sounds. Bangla has neither. You do not need a perfect TH to be understood — you need to recognise it.', 'ইংরেজিতে দুটো TH ধ্বনি আছে। বাংলায় একটাও নেই। বোঝাতে নিখুঁত TH লাগে না — চিনতে পারা দরকার।'),
    heroClip: 'th-think',
    manifesto: L('This is an <em>ear lesson,</em> not a tongue test.', 'এটা কানের পাঠ, জিভের পরীক্ষা নয়।'),
    takeaway: L('You do not need a perfect TH. You need a listening ear.', 'নিখুঁত TH লাগবে না। লাগবে মনোযোগী কান।'),
    preload: ['th-think', 'th-sink', 'th-three', 'th-tree', 'th-thank', 'th-sank'],
    steps: [
      { key: 'hear', sections: [
        { type: 'thgroups', id: 'two-th', title: L('Two TH sounds', 'দুটো TH ধ্বনি'),
          cue: L('Tongue tip between the teeth. think, three, thank: only air. this, that, those: air + buzz.', 'জিভের ডগা দাঁতের মাঝে। think, three, thank: শুধু বাতাস। this, that, those: বাতাস + গুঞ্জন।'),
          groups: [
            { label: 'θ', name: L('air', 'বাতাস'), clips: ['th-think', 'th-three', 'th-thank'] },
            { label: 'ð', name: L('air + buzz', 'বাতাস + গুঞ্জন'), clips: ['th-this', 'th-that', 'th-those'] },
          ] },
        { type: 'pairs', id: 'th-pairs', visual: 'th', title: L('Catch the first sound', 'প্রথম ধ্বনিটা ধরুন'),
          cue: L('TH is soft air over the tongue. s hisses behind the teeth. t stops, then pops. Let the whole word guide you.', 'TH হলো জিভের ওপর দিয়ে নরম বাতাস। s দাঁতের পেছনে হিস্‌ করে। t থামে, তারপর ফট করে। পুরো শব্দটা আপনাকে পথ দেখাবে।'),
          pairs: [
            { a: 'th-think', b: 'th-sink', la: 'th', lb: 's', pose: ['th', 'sz'] },
            { a: 'th-three', b: 'th-tree', la: 'th', lb: 't', pose: ['th', 'td'] },
            { a: 'th-thank', b: 'th-sank', la: 'th', lb: 's', pose: ['th', 'sz'] },
          ] },
      ] },
      { key: 'play', sections: [
        { type: 'identify', id: 'which-th', visual: 'airvoice', title: L('Trust your ear', 'কানের ওপর ভরসা রাখুন'),
          cue: L('Listen first. Then tap the word you heard.', 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।'),
          pairs: [['th-think', 'th-sink'], ['th-three', 'th-tree'], ['th-thank', 'th-sank']] },
      ] },
    ],
  },
  // ───────────────────────────────────────────────────────── 11 · ACCENT OR MISTAKE
  {
    id: 'accent', n: 11, group: 'accent', glyph: 'accent',
    title: L('Accent or Mistake?', 'উচ্চারণভঙ্গি, নাকি ভুল?'),
    tag: L('Clear beats copied', 'নকলের চেয়ে স্পষ্টতা'),
    hero: L('Which accent? Whichever you like.', 'কোন উচ্চারণভঙ্গি? যেটা আপনার ভালো লাগে।'),
    intro: L('British, American, Bangladeshi — or a mix. What matters is clear pronunciation: the right sounds, the beat in the right place, and no missing or extra sounds.', 'ব্রিটিশ, আমেরিকান, বাংলাদেশি — বা মিশ্র। আসল কথা স্পষ্ট উচ্চারণ: ঠিক ধ্বনি, ঠিক জায়গায় তাল, কোনো ধ্বনি বাদ বা বাড়তি নয়।'),
    heroClip: 'acc-water', heroVisual: 'accent', heroRow: ACCENT_ROWS[1],
    manifesto: L('Accent is identity. <em>Pronunciation is clarity.</em>', 'উচ্চারণভঙ্গি আপনার পরিচয়। উচ্চারণ হলো স্পষ্টতা।'),
    takeaway: L('Your accent is fine. Make your pronunciation clear.', 'আপনার উচ্চারণভঙ্গি ঠিক আছে। উচ্চারণটা স্পষ্ট করুন।'),
    preload: ['acc-car', 'acc-water', 'acc-dance', 'acc-schedule', 'acc-vitamin', 'acc-tomato'],
    steps: [
      { key: 'hear', sections: [
        { type: 'accentpairs', id: 'two-accents', title: L('Different — and both correct', 'আলাদা — আর দুটোই সঠিক'),
          cue: L('Alice speaks British English. Brian speaks American English. Tap both cards in each row. The difference is regular and familiar, so listeners understand both.', 'অ্যালিস ব্রিটিশ ইংরেজি বলেন। ব্রায়ান আমেরিকান ইংরেজি বলেন। প্রতিটি সারির দুটো কার্ডেই চাপ দিন। পার্থক্যটা নিয়মিত আর পরিচিত, তাই শ্রোতারা দুটোই বোঝেন।'),
          rows: ACCENT_ROWS },
        { type: 'matters', id: 'what-matters', title: L('What actually matters', 'আসলে কী গুরুত্বপূর্ণ'),
          cue: L('These four skills keep you clear in any accent — Bangladeshi, British, American, or in between.', 'এই চারটি দক্ষতা যেকোনো উচ্চারণভঙ্গিতে আপনাকে স্পষ্ট রাখে — বাংলাদেশি, ব্রিটিশ, আমেরিকান, বা মাঝামাঝি।'),
          cards: [
            { title: L('Keep vowels apart', 'স্বরগুলো আলাদা রাখুন'), clips: ['vow-ship', 'vow-sheep'], labels: ['ship', 'sheep'],
              body: L('The vowel is what tells these words apart — in every accent.', 'স্বরটাই শব্দ দুটোকে আলাদা করে — সব উচ্চারণভঙ্গিতে।'), unit: 'vowels' },
            { title: L('Put the beat in the right place', 'তাল ঠিক জায়গায় দিন'), clips: ['dec-photograph', 'dec-photographic'], labels: ['PHOtograph', 'photoGRAPHic'], sep: '→',
              body: L('The strong syllable helps the listener find the word fast.', 'জোরালো অক্ষরটা শ্রোতাকে দ্রুত শব্দটা চিনতে সাহায্য করে।'), unit: 'word-stress' },
            { title: L('No extra vowels', 'বাড়তি স্বর নয়'), clips: ['clu-school', 'clu-eekul'], labels: ['school', 'eeskool'], sep: 'not', bad: 1,
              body: L('Keep the first consonants together, so the word keeps its shape.', 'শুরুর ব্যঞ্জনগুলো একসাথে রাখুন, যাতে শব্দের আকার ঠিক থাকে।'), unit: 'clusters' },
            { title: L('Speak in thought groups', 'ভাবনার দলে বলুন'), clips: ['pro-sent1'], labels: ['After the long meeting // I went straight home // …'],
              body: L('Pause where the ideas divide. Let the big beat carry the news.', 'যেখানে ভাবনা ভাগ হয় সেখানে থামুন। বড় তালটাই খবরটা বহন করুক।'), unit: 'melody' },
          ] },
      ] },
      { key: 'play', sections: [
        { type: 'accentgame', id: 'accent-or-not', title: L('Accent — or a clarity problem?', 'উচ্চারণভঙ্গি — নাকি স্পষ্টতার সমস্যা?'),
          cue: L('Hear it, read about it, then choose the best label.', 'শুনুন, পড়ুন, তারপর ঠিক নামটা বেছে নিন।'),
          rounds: [
            { clip: 'acc-water', voice: 'brian', label: L('“water” with an American flap'), detail: L('The t sounds like a quick d: “wader”.', 't দ্রুত d-এর মতো শোনায়: “ওয়াডার”।'), answer: 'accent',
              why: L('American speakers soften this t every time. The word stays clear.', 'আমেরিকানরা সবসময় এই t নরম করেন। শব্দটা স্পষ্টই থাকে।') },
            { clip: 'acc-watar', voice: 'brian', label: L('“watar”: a strong vowel at the end'), detail: L('The weak “uh” at the end turns into a full, strong “ar”.', 'শেষের দুর্বল “আ” পুরো, জোরালো “আর” হয়ে যায়।'), answer: 'issue',
              why: L('The wrong vowel moves the beat and changes the word’s shape. Listeners have to work harder. That is a clarity problem.', 'ভুল স্বর তাল সরিয়ে দেয়, শব্দের আকার বদলায়। শ্রোতাকে বেশি কষ্ট করতে হয়। এটা স্পষ্টতার সমস্যা।'),
              compare: 'acc-water', compareLabel: 'water' },
            { clip: 'acc-car', voice: 'alice', label: L('“car” with no r'), detail: L('Many British accents drop the r after a vowel.', 'অনেক ব্রিটিশ উচ্চারণে স্বরের পরের r বলা হয় না।'), answer: 'accent',
              why: L('Dropping this r is a shared accent pattern. Everyone still hears car.', 'এই r বাদ দেওয়া একটা প্রচলিত উচ্চারণভঙ্গি। সবাই car-ই শোনেন।') },
            { clip: 'acc-eschool', voice: 'brian', label: L('“eschool” for school'), detail: L('An extra vowel appears before sk.', 'sk-এর আগে একটা বাড়তি স্বর আসে।'), answer: 'issue',
              why: L('The extra vowel adds a syllable and changes the word’s shape. That is a clarity problem.', 'বাড়তি স্বর একটা অক্ষর যোগ করে, শব্দের আকার বদলায়। এটা স্পষ্টতার সমস্যা।'),
              compare: 'clu-school', compareLabel: 'school' },
            { clip: 'acc-tomato', voice: 'brian', label: L('“to-MAY-to”'), detail: L('The middle vowel sounds like may, not mah.', 'মাঝের স্বর “মা” নয়, “মে”-র মতো।'), answer: 'accent',
              why: L('Both tomatoes are correct. The beat stays on the middle syllable either way.', 'দুটো tomato-ই সঠিক। তাল দুইভাবেই মাঝের অক্ষরে থাকে।') },
            { clip: 'clu-sitreet', label: L('“sitreet” for street'), detail: L('A helper vowel splits the s from tr.', 'একটা সাহায্যকারী স্বর s আর tr-কে আলাদা করে দেয়।'), answer: 'issue',
              why: L('One word becomes two syllables. That is a clarity problem, in any accent.', 'এক অক্ষরের শব্দ দুই অক্ষর হয়ে যায়। যেকোনো উচ্চারণভঙ্গিতেই এটা স্পষ্টতার সমস্যা।'),
              compare: 'clu-street', compareLabel: 'street' },
          ] },
      ] },
    ],
  },
];

// Word labels for clips (what the student sees on a button).
export const LABEL = {
  'vow-tim': 'Tim', 'con-jew': 'Jew', 'clu-eekul': 'eeskool', 'clu-sitreet': 'sitreet', 'clu-iskul': 'iskool',
  'acc-watar': 'watar', 'acc-eschool': 'eschool',
  'pro-sent1': 'After the long meeting, I went straight home, and slept for hours.',
  'pro-sent1-mono': 'After the long meeting, I went straight home, and slept for hours.',
  'pro-sent2': 'When I finished my homework, I called my friend, and we played football.',
  'pro-sent2-mono': 'When I finished my homework, I called my friend, and we played football.',
  'pro-sent3': 'Let’s eat, Grandma!', 'pro-nopause': 'Let’s eat Grandma!',
  'pro-sent4': 'The teacher who helped me the most was my English teacher in high school.',
  'cmp-blackboard-n': 'a blackboard', 'cmp-black-board-p': 'a black board', 'cmp-greenhouse-n': 'a greenhouse',
  'cmp-green-house-p': 'a green house', 'cmp-hotdog-n': 'a hot dog (food)', 'cmp-hot-dog-p': 'a hot dog (warm!)',
  'lnk-go-on': 'Go on', 'lnk-an-apple': 'an apple', 'lnk-come-in': 'Come in', 'lnk-whats-up': 'What’s up?',
  'lnk-pick-it-up': 'Pick it up', 'lnk-turn-off': 'Turn off the light',
  'num-year1994': '1994', 'num-year2026': '2026', 'num-phone': '01712 345678', 'num-date-oct12': 'October 12th',
  'num-price-14000': '14,000 taka', 'num-time-530': '5:30',
};

export const UI = {
  start: L('Start', 'শুরু'),
  next: L('Next', 'পরের'),
  back: L('Back', 'আগের'),
  listen: L('Listen', 'শুনুন'),
  again: L('Again', 'আবার'),
  both: L('Hear both', 'দুটোই শুনুন'),
  playAll: L('Play all', 'সব শুনুন'),
  allUnits: L('All units', 'সব ইউনিট'),
  nextUnit: L('Next unit', 'পরের ইউনিট'),
  unit: L('Unit', 'ইউনিট'),
  presentOnTv: L('Present on TV', 'টিভিতে দেখান'),
  autoplay: L('Play sound as I scroll', 'স্ক্রল করলে শব্দ চালান'),
  forTeacher: L('For the teacher', 'শিক্ষকের জন্য'),
  print: L('Print the cheat sheet', 'চিট শিট প্রিন্ট করুন'),
  correct: L('Yes!', 'ঠিক!'),
  notQuite: L('Not this time.', 'এবার হলো না।'),
  nextRound: L('Next', 'পরের'),
  check: L('Check', 'মিলিয়ে দেখুন'),
  tryAgain: L('Try again', 'আবার চেষ্টা'),
  playWord: L('Play the word', 'শব্দটা শুনুন'),
  stop: L('Stop', 'থামুন'),
  done: L('Unit complete', 'ইউনিট শেষ'),
  upNext: L('Up next', 'এরপর'),
};

// Sound tiles for the cluster clips, timed off the spectrograms: [label, start, end, kind]
// kind: c = consonant, v = vowel, x = the extra (helper) vowel
export const TILES = {
  'clu-school': [['s', .01, .17, 'c'], ['k', .17, .24, 'c'], ['oo', .24, .60, 'v'], ['l', .60, .67, 'c']],
  'clu-eekul': [['ee', .03, .45, 'x'], ['s', .45, .60, 'c'], ['k', .60, .65, 'c'], ['oo', .65, .98, 'v'], ['l', .98, 1.03, 'c']],
  'clu-street': [['s', .04, .22, 'c'], ['t', .22, .30, 'c'], ['r', .30, .34, 'c'], ['ee', .34, .60, 'v'], ['t', .60, .84, 'c']],
  'clu-sitreet': [['s', .09, .29, 'c'], ['i', .29, .45, 'x'], ['t', .45, .56, 'c'], ['r', .56, .61, 'c'], ['ee', .61, .79, 'v'], ['t', .79, 1.03, 'c']],
  'clu-splash': [['s', .07, .25, 'c'], ['p', .25, .32, 'c'], ['l', .32, .37, 'c'], ['a', .37, .63, 'v'], ['sh', .63, .92, 'c']],
  'clu-spring': [['s', .03, .20, 'c'], ['p', .20, .27, 'c'], ['r', .27, .34, 'c'], ['i', .34, .60, 'v'], ['ng', .60, .78, 'c']],
};
