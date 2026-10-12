// Voice Lab content bank. English is what students hear and read; Bangla (bn)
// carries the explanation underneath when the বাংলা toggle is on.
// Bangla here should be checked by a native speaker before wide use.
//
// Scene types: tapes, suffix, melody, pause, pairs, doors, bhv, clusters,
//              echo, identify, stress, pausegame, clustergame, done
// Every clip id refers to an mp3 in audio/ and an entry in data/clips.json.

export const STEPS = {
  hear: { en: 'Hear', bn: 'শুনুন', icon: 'ear' },
  say: { en: 'Say', bn: 'বলুন', icon: 'mouth' },
  play: { en: 'Play', bn: 'খেলুন', icon: 'game' },
};

export const UNITS = [
  // ───────────────────────────────────────────────────────── 1 · WORD STRESS
  {
    id: 'word-stress', n: 1, group: 'music', glyph: 'beads',
    title: { en: 'Word Stress', bn: 'শব্দের জোর' },
    tag: { en: 'The beat inside a word', bn: 'শব্দের ভেতরের তাল' },
    takeaway: { en: 'One big beat. The small beats get smaller.', bn: 'একটি বড় তাল। ছোট তালগুলো আরও ছোট হয়।' },
    preload: ['dec-photograph', 'dec-photographic', 'vow-about', 'vow-sofa', 'vow-supply'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'tapes', id: 'big-beat',
          title: { en: 'One big beat', bn: 'একটি বড় তাল' },
          cue: { en: 'Every English word has one big beat: louder, longer, and the voice moves.', bn: 'প্রতিটি ইংরেজি শব্দে একটি বড় তাল থাকে: বেশি জোরে, বেশি লম্বা, আর কণ্ঠের সুর বদলায়।' },
          note: { en: 'Add -ic and the beat jumps.', bn: '-ic যোগ করলে তাল সরে যায়।' },
          clips: ['dec-photograph', 'dec-photographic'], shareScale: true, autoplay: ['dec-photograph', 'dec-photographic'] },
        { type: 'tapes', id: 'small-beats',
          title: { en: 'Small beats get smaller', bn: 'ছোট তাল আরও ছোট হয়' },
          cue: { en: 'The weak part shrinks to a tiny “uh” sound: ə.', bn: 'দুর্বল অংশটি ছোট্ট একটা “অ্যা”-র মতো হালকা শব্দে (ə) পরিণত হয়।' },
          l1: { en: 'In Bangla we say every syllable clearly. In English the weak ones go quick and quiet.', bn: 'বাংলায় আমরা প্রতিটি অক্ষর স্পষ্ট করে বলি। ইংরেজিতে দুর্বল অক্ষরগুলো দ্রুত আর আস্তে বলা হয়।' },
          clips: ['vow-about', 'vow-sofa', 'vow-supply'], shareScale: true, schwa: true, autoplay: ['vow-about', 'vow-sofa', 'vow-supply'] },
        { type: 'suffix', id: 'endings',
          title: { en: 'Endings point to the beat', bn: 'শেষাংশ তাল দেখিয়ে দেয়' },
          cue: { en: 'With these endings, the beat sits just before them.', bn: 'এই শেষাংশগুলো থাকলে, তাল ঠিক তার আগের অক্ষরে পড়ে।' },
          rows: [
            { end: '-tion', clip: 'dec-information' },
            { end: '-sion', clip: 'dec-decision' },
            { end: '-ity', clip: 'dec-ability' },
            { end: '-ic', clip: 'dec-photographic' },
            { end: '-ous', clip: 'dec-famous' },
          ],
          note: { en: 'A strong clue, not a law. Listen to check.', bn: 'এটা শক্ত একটা সূত্র, কিন্তু সবসময় নয়। শুনে মিলিয়ে নিন।' } },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'echo-beat', mode: 'beat',
          title: { en: 'Echo the beat', bn: 'তালটা ফিরিয়ে বলুন' },
          cue: { en: 'Listen. Then say it five times. Make the big beat big and the small beats small.', bn: 'শুনুন। তারপর পাঁচবার বলুন। বড় তালটা বড় করে, ছোট তালগুলো ছোট করে বলুন।' },
          items: ['dec-photograph', 'dec-photographic', 'dec-information', 'dec-ability', 'vow-about', 'vow-supply'] },
      ] },
      { key: 'play', scenes: [
        { type: 'stress', id: 'find-beat',
          title: { en: 'Where is the big beat?', bn: 'বড় তালটা কোথায়?' },
          cue: { en: 'Tap the syllable you think is strong. Then listen.', bn: 'যে অক্ষরটা জোরালো মনে হয় তাতে চাপ দিন। তারপর শুনুন।' },
          items: ['dec-information', 'dec-decision', 'dec-ability', 'dec-photographic', 'dec-photograph', 'dec-famous', 'vow-about', 'vow-supply', 'vow-sofa', 'dec-sunset'] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 2 · SENTENCE MELODY
  {
    id: 'melody', n: 2, group: 'music', glyph: 'melody',
    title: { en: 'Sentence Melody', bn: 'বাক্যের সুর' },
    tag: { en: 'One thought, one tune', bn: 'এক ভাবনা, এক সুর' },
    takeaway: { en: 'Small groups. One tune each. Pause between them.', bn: 'ছোট ছোট দল। প্রতিটির একটি সুর। মাঝে ছোট্ট বিরতি।' },
    preload: ['pro-sent1', 'pro-sent1-mono', 'pro-sent2', 'pro-sent3', 'pro-nopause'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'melody', id: 'melody-off',
          title: { en: 'Melody on, melody off', bn: 'সুর আছে, সুর নেই' },
          cue: { en: 'Same words, same speed. We took the melody out.', bn: 'একই শব্দ, একই গতি। আমরা শুধু সুরটা সরিয়ে দিয়েছি।' },
          ask: { en: 'Which one is easier to follow?', bn: 'কোনটা বুঝতে সহজ?' },
          on: 'pro-sent1', off: 'pro-sent1-mono' },
        { type: 'tapes', id: 'groups',
          title: { en: 'Thought groups', bn: 'ভাবনার দল' },
          cue: { en: 'A long sentence is a few small groups. Each one has its own tune.', bn: 'একটি লম্বা বাক্য কয়েকটি ছোট দলে ভাগ হয়। প্রতিটি দলের নিজস্ব সুর আছে।' },
          note: { en: '// = a short break. Then the voice starts fresh. The big word in each group is the strongest.', bn: '// = ছোট্ট বিরতি। তারপর কণ্ঠ নতুন করে শুরু হয়। প্রতিটি দলের বড় শব্দটিতে সবচেয়ে বেশি জোর।' },
          l1: { en: 'In Bangla, the listener helps carry the meaning. In English, the voice carries it.', bn: 'বাংলায় শ্রোতাও অর্থ বুঝে নিতে সাহায্য করেন। ইংরেজিতে কণ্ঠকেই অর্থ বহন করতে হয়।' },
          clips: ['pro-sent1', 'pro-sent2'], autoplay: ['pro-sent1'] },
        { type: 'pause', id: 'grandma',
          title: { en: 'The pause is the message', bn: 'বিরতিতেই অর্থ' },
          cue: { en: 'One small pause changes everything.', bn: 'একটা ছোট্ট বিরতি পুরো অর্থ বদলে দেয়।' },
          a: { clip: 'pro-sent3', text: 'Let’s eat, Grandma!', mean: { en: 'Grandma is invited to dinner.', bn: 'দাদি/নানিকে খেতে ডাকা হচ্ছে।' } },
          b: { clip: 'pro-nopause', text: 'Let’s eat Grandma!', mean: { en: 'Grandma IS the dinner!', bn: 'দাদি/নানিকেই খাওয়া হবে!' } } },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'hum', mode: 'tune',
          title: { en: 'Hum it, then say it', bn: 'আগে গুনগুন, তারপর বলুন' },
          cue: { en: 'First hum the tune with no words: mm-MM-mm. Then add the words.', bn: 'প্রথমে শব্দ ছাড়া শুধু সুরটা গুনগুন করুন: মম-মম-মম। তারপর শব্দ যোগ করুন।' },
          items: ['pro-sent1', 'pro-sent2', 'pro-sent4', 'pro-sent3'] },
      ] },
      { key: 'play', scenes: [
        { type: 'pausegame', id: 'detective',
          title: { en: 'Pause detective', bn: 'বিরতি গোয়েন্দা' },
          cue: { en: 'Listen. Tap the gaps where you hear a pause.', bn: 'শুনুন। যেখানে বিরতি শুনছেন সেই ফাঁকে চাপ দিন।' },
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

  // ───────────────────────────────────────────────────────── 3 · LONG & SHORT VOWELS
  {
    id: 'vowels', n: 3, group: 'sounds', glyph: 'bars',
    title: { en: 'Long & Short Vowels', bn: 'লম্বা ও ছোট স্বর' },
    tag: { en: 'Stretch it or relax it', bn: 'টেনে বলুন, না ঢিলে' },
    takeaway: { en: 'Long: stretch your lips. Short: relax.', bn: 'লম্বা: ঠোঁট টানটান। ছোট: ঢিলেঢালা।' },
    preload: ['vow-team', 'vow-tim', 'vow-beat', 'vow-bit', 'vow-fool', 'vow-full', 'vow-pool', 'vow-pull'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'pairs', id: 'stretch', visual: 'vowel',
          title: { en: 'Stretch or relax', bn: 'টানটান না ঢিলেঢালা' },
          cue: { en: 'Long vowel: lips stretched, a little longer. Short vowel: relaxed, a little shorter.', bn: 'লম্বা স্বর: ঠোঁট টানটান, একটু লম্বা। ছোট স্বর: ঢিলেঢালা, একটু ছোট।' },
          l1: { en: 'Bangla ই and ঈ sound almost the same. In English, team and Tim are two different words.', bn: 'বাংলায় ই আর ঈ প্রায় একই রকম শোনায়। ইংরেজিতে team আর Tim দুটো আলাদা শব্দ।' },
          pairs: [
            { a: 'vow-team', b: 'vow-tim', la: 'long ee', lb: 'short i', mouth: ['spread', 'relaxed'] },
            { a: 'vow-beat', b: 'vow-bit', la: 'long ee', lb: 'short i', mouth: ['spread', 'relaxed'] },
            { a: 'vow-fool', b: 'vow-full', la: 'long oo', lb: 'short u', mouth: ['round', 'relaxed'] },
            { a: 'vow-pool', b: 'vow-pull', la: 'long oo', lb: 'short u', mouth: ['round', 'relaxed'] },
          ] },
        { type: 'doors', id: 'open-closed',
          title: { en: 'Spelling clue: open or closed', bn: 'বানানের সূত্র: খোলা না বন্ধ' },
          cue: { en: 'A syllable that ends in a vowel is open: the vowel is long. A consonant closes it: the vowel is short.', bn: 'অক্ষর স্বরে শেষ হলে সেটা খোলা: স্বর লম্বা। ব্যঞ্জনে শেষ হলে বন্ধ: স্বর ছোট।' },
          open: [{ clip: 'dec-me', show: 'me' }, { clip: 'dec-go', show: 'go' }, { clip: 'dec-baby', show: 'ba·by' }],
          closed: [{ clip: 'dec-cat', show: 'cat' }, { clip: 'dec-bed', show: 'bed' }, { clip: 'dec-sunset', show: 'sun·set' }],
          twin: { open: { clip: 'dec-hoping', show: 'ho·ping' }, closed: { clip: 'dec-hopping', show: 'hop·ping' } },
          note: { en: 'The double p shuts the door: hop·ping.', bn: 'দুটো p দরজা বন্ধ করে দেয়: hop·ping।' } },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'echo-vowels', mode: 'pair',
          title: { en: 'Say both', bn: 'দুটোই বলুন' },
          cue: { en: 'Say the long one, then the short one. Feel your lips change.', bn: 'আগে লম্বাটা, তারপর ছোটটা বলুন। ঠোঁটের পরিবর্তন অনুভব করুন।' },
          items: [['vow-team', 'vow-tim'], ['vow-beat', 'vow-bit'], ['vow-fool', 'vow-full'], ['vow-pool', 'vow-pull']] },
      ] },
      { key: 'play', scenes: [
        { type: 'identify', id: 'which-vowel', visual: 'vowel',
          title: { en: 'Which word?', bn: 'কোন শব্দ?' },
          cue: { en: 'Listen first. Then tap the word you heard.', bn: 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।' },
          pairs: [['vow-team', 'vow-tim'], ['vow-fool', 'vow-full'], ['vow-beat', 'vow-bit'], ['vow-pool', 'vow-pull']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 4 · VOICE & AIR
  {
    id: 'voice-air', n: 4, group: 'sounds', glyph: 'buzz',
    title: { en: 'Voice & Air', bn: 'কণ্ঠ ও বাতাস' },
    tag: { en: 'Buzz or air?', bn: 'গুঞ্জন না বাতাস?' },
    takeaway: { en: 'Switch the buzz on. Shape the lips. Keep “er” in the middle.', bn: 'গুঞ্জন চালু করুন। ঠোঁটের আকার ঠিক রাখুন। “er” মুখের মাঝখানে রাখুন।' },
    preload: ['con-fan', 'con-van', 'con-sip', 'con-zip'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'pairs', id: 'buzz', visual: 'airvoice',
          title: { en: 'Air only, or air + buzz', bn: 'শুধু বাতাস, নাকি বাতাস + গুঞ্জন' },
          cue: { en: 'Same mouth. f and s are only air. v and z add a buzz in your throat.', bn: 'মুখের আকার একই। f আর s শুধু বাতাস। v আর z-এ গলায় গুঞ্জন যোগ হয়।' },
          feel: { en: 'Put two fingers on your throat. Say ffff, then vvvv.', bn: 'গলায় দুটো আঙুল রাখুন। ffff বলুন, তারপর vvvv।' },
          pairs: [
            { a: 'con-fan', b: 'con-van', la: 'air', lb: 'air + buzz' },
            { a: 'con-sip', b: 'con-zip', la: 'air', lb: 'air + buzz' },
          ] },
        { type: 'pairs', id: 'end-vowel', visual: 'endvowel',
          title: { en: 'At the end, listen to the vowel', bn: 'শেষে, স্বরটা শুনুন' },
          cue: { en: 'Before a final v or z, the vowel gets longer.', bn: 'শেষে v বা z থাকলে তার আগের স্বরটা লম্বা হয়।' },
          pairs: [
            { a: 'con-safe', b: 'con-save', la: 'short', lb: 'longer' },
            { a: 'con-price', b: 'con-prize', la: 'short', lb: 'longer' },
          ] },
        { type: 'pairs', id: 'lips', visual: 'lips',
          title: { en: 'Pop, hiss, or round', bn: 'ফট, হিস্‌, নাকি গোল' },
          cue: { en: 'p pops with both lips. f hisses: top teeth on the bottom lip. w starts round, then opens.', bn: 'p — দুই ঠোঁট দিয়ে ফট করে। f — উপরের দাঁত নিচের ঠোঁটে, হিস্‌স্‌। w — ঠোঁট গোল, তারপর খোলে।' },
          l1: { en: 'Bangla ফ is often p + h, and ব can cover both b and w. English keeps them apart.', bn: 'বাংলা ‘ফ’ অনেক সময় প + হ-এর মতো, আর ‘ব’ দিয়ে b ও w দুটোই বোঝাই। ইংরেজিতে এগুলো আলাদা।' },
          pairs: [
            { a: 'con-pin', b: 'con-fin', la: 'pop', lb: 'hiss', lips: ['press', 'teeth'] },
            { a: 'con-pat', b: 'con-fat', la: 'pop', lb: 'hiss', lips: ['press', 'teeth'] },
            { a: 'con-west', b: 'con-best', la: 'round', lb: 'press', lips: ['round', 'press'] },
            { a: 'con-wet', b: 'con-bet', la: 'round', lb: 'press', lips: ['round', 'press'] },
          ] },
        { type: 'pairs', id: 'traps', visual: 'airvoice',
          title: { en: 'Two more traps', bn: 'আরও দুটো ফাঁদ' },
          cue: { en: 'z keeps buzzing — j stops, then releases. And keep “er” in the middle of your mouth: herd, not hard.', bn: 'z-এর গুঞ্জন চলতেই থাকে — j একবার থেমে তারপর ছাড়ে। আর “er” মুখের মাঝখানে রাখুন: herd, hard নয়।' },
          pairs: [
            { a: 'con-zoo', b: 'con-jew', la: 'flow', lb: 'stop + release' },
            { a: 'con-earth', b: 'con-earn', la: 'er', lb: 'er' },
            { a: 'con-herd', b: 'con-hard', la: 'er (middle)', lb: 'ar (open)' },
          ] },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'echo-buzz', mode: 'pair',
          title: { en: 'Feel the buzz', bn: 'গুঞ্জন অনুভব করুন' },
          cue: { en: 'Fingers on your throat. Say each pair. Buzz on, buzz off.', bn: 'গলায় আঙুল রাখুন। প্রতিটি জোড়া বলুন। গুঞ্জন চালু, গুঞ্জন বন্ধ।' },
          items: [['con-fan', 'con-van'], ['con-sip', 'con-zip'], ['con-pin', 'con-fin'], ['con-west', 'con-best'], ['con-herd', 'con-hard']] },
      ] },
      { key: 'play', scenes: [
        { type: 'identify', id: 'which-cons', visual: 'airvoice',
          title: { en: 'Which word?', bn: 'কোন শব্দ?' },
          cue: { en: 'Listen first. Then tap the word you heard.', bn: 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।' },
          pairs: [['con-fan', 'con-van'], ['con-safe', 'con-save'], ['con-sip', 'con-zip'], ['con-price', 'con-prize'], ['con-zoo', 'con-jew'], ['con-west', 'con-best'], ['con-wet', 'con-bet'], ['con-herd', 'con-hard'], ['con-pin', 'con-fin'], ['con-pat', 'con-fat']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 5 · THE PUFF
  {
    id: 'puff', n: 5, group: 'sounds', glyph: 'puff',
    title: { en: 'The Puff', bn: 'বাতাসের ঝাপটা' },
    tag: { en: 'Let the air go', bn: 'বাতাস ছেড়ে দিন' },
    takeaway: { en: 'At the start: let the air go. After s: keep it quiet.', bn: 'শুরুতে: বাতাস ছেড়ে দিন। s-এর পরে: চুপচাপ রাখুন।' },
    preload: ['asp-pin', 'asp-spin', 'asp-top', 'asp-stop', 'asp-key', 'asp-ski'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'pairs', id: 'puffs', visual: 'puff',
          title: { en: 'Puff, then no puff', bn: 'ঝাপটা, তারপর ঝাপটা নেই' },
          cue: { en: 'p, t, k at the start of a word: a strong puff of air. After s: almost none.', bn: 'শব্দের শুরুতে p, t, k: জোরে এক ঝাপটা বাতাস। s-এর পরে: প্রায় কিছুই না।' },
          feel: { en: 'Hold your hand in front of your mouth. Say pin, then spin.', bn: 'মুখের সামনে হাত রাখুন। pin বলুন, তারপর spin।' },
          pairs: [
            { a: 'asp-pin', b: 'asp-spin', la: 'puff', lb: 'no puff' },
            { a: 'asp-top', b: 'asp-stop', la: 'puff', lb: 'no puff' },
            { a: 'asp-key', b: 'asp-ski', la: 'puff', lb: 'no puff' },
          ] },
        { type: 'bhv', id: 'bh-v',
          title: { en: 'ভ is not v', bn: '‘ভ’ আর v এক নয়' },
          cue: { en: 'ভ starts with closed lips, then breath. v never closes: top teeth on the bottom lip, keep buzzing.', bn: '‘ভ’ বন্ধ ঠোঁট দিয়ে শুরু হয়, তারপর নিঃশ্বাস। v-তে ঠোঁট কখনো বন্ধ হয় না: উপরের দাঁত নিচের ঠোঁটে, গুঞ্জন চলতে থাকে।' },
          clip: 'con-van' },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'echo-puff', mode: 'puff',
          title: { en: 'Hand test', bn: 'হাতের পরীক্ষা' },
          cue: { en: 'Hand in front of your mouth. Feel the puff on the first word, not the second.', bn: 'মুখের সামনে হাত রাখুন। প্রথম শব্দে ঝাপটা টের পাবেন, দ্বিতীয়টায় নয়।' },
          items: [['asp-pin', 'asp-spin'], ['asp-top', 'asp-stop'], ['asp-key', 'asp-ski']] },
      ] },
      { key: 'play', scenes: [
        { type: 'identify', id: 'which-puff', visual: 'puff',
          title: { en: 'Which word?', bn: 'কোন শব্দ?' },
          cue: { en: 'Listen to the whole word first. The puff is your second clue.', bn: 'আগে পুরো শব্দটা শুনুন। ঝাপটাটা আপনার দ্বিতীয় সূত্র।' },
          pairs: [['asp-pin', 'asp-spin'], ['asp-top', 'asp-stop'], ['asp-key', 'asp-ski']] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 6 · CLUSTERS
  {
    id: 'clusters', n: 6, group: 'sounds', glyph: 'tiles',
    title: { en: 'Clusters', bn: 'যুক্ত ব্যঞ্জন' },
    tag: { en: 'Keep them together', bn: 'একসাথে রাখুন' },
    takeaway: { en: 'Start on the s. Keep moving. No vowel before it.', bn: 's দিয়েই শুরু করুন। থামবেন না। আগে কোনো স্বর নয়।' },
    preload: ['clu-school', 'clu-eekul', 'clu-street', 'clu-sitreet', 'clu-splash', 'clu-spring'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'pairs', id: 'extra-vowel', visual: 'tiles',
          title: { en: 'No extra vowel', bn: 'বাড়তি স্বর নয়' },
          cue: { en: 'English starts straight on the s. An extra vowel makes the word longer — and different.', bn: 'ইংরেজিতে সরাসরি s দিয়ে শুরু হয়। বাড়তি স্বর শব্দটাকে লম্বা — আর আলাদা — করে দেয়।' },
          l1: { en: 'Bangla adds a helper vowel: school → ইস্কুল, station → ইস্টিশন.', bn: 'বাংলায় আমরা সাহায্যকারী স্বর যোগ করি: school → ইস্কুল, station → ইস্টিশন।' },
          pairs: [
            { a: 'clu-school', b: 'clu-eekul', la: 'English', lb: 'extra vowel' },
            { a: 'clu-street', b: 'clu-sitreet', la: 'English', lb: 'extra vowel' },
          ] },
        { type: 'clusters', id: 'four',
          title: { en: 'One smooth start', bn: 'এক টানে শুরু' },
          cue: { en: 'Two or three consonants, locked together. No gap, no helper vowel.', bn: 'দুই বা তিনটি ব্যঞ্জন, একসাথে আটকানো। ফাঁক নেই, সাহায্যকারী স্বর নেই।' },
          words: [
            { clip: 'clu-school', n: 2 },
            { clip: 'clu-street', n: 3 },
            { clip: 'clu-splash', n: 3 },
            { clip: 'clu-spring', n: 3 },
          ] },
      ] },
      { key: 'say', scenes: [
        { type: 'echo', id: 'echo-clusters', mode: 'cluster',
          title: { en: 'Build it up', bn: 'ধাপে ধাপে বলুন' },
          cue: { en: 'Hiss the s, then slide straight in: sss… school.', bn: 's-এর হিস্‌ দিয়ে শুরু করুন, তারপর সোজা চলে যান: সসস… school।' },
          items: ['clu-school', 'clu-street', 'clu-splash', 'clu-spring'] },
      ] },
      { key: 'play', scenes: [
        { type: 'clustergame', id: 'catch-vowel',
          title: { en: 'Catch the extra vowel', bn: 'বাড়তি স্বরটা ধরুন' },
          cue: { en: 'Listen. Clear English — or did a helper vowel slip in?', bn: 'শুনুন। পরিষ্কার ইংরেজি — নাকি একটা সাহায্যকারী স্বর ঢুকে পড়েছে?' },
          rounds: [{ word: 'school', good: 'clu-school', bad: 'clu-eekul' }, { word: 'street', good: 'clu-street', bad: 'clu-sitreet' }, { word: 'school', good: 'clu-school', bad: 'clu-eekul' }, { word: 'street', good: 'clu-street', bad: 'clu-sitreet' }] },
      ] },
    ],
  },

  // ───────────────────────────────────────────────────────── 7 · TH
  {
    id: 'th', n: 7, group: 'sounds', glyph: 'th',
    title: { en: 'TH — Ear First', bn: 'TH — আগে কান' },
    tag: { en: 'Hear it. That is enough.', bn: 'চিনতে পারলেই যথেষ্ট' },
    takeaway: { en: 'You do not need a perfect TH. You need a listening ear.', bn: 'নিখুঁত TH লাগবে না। লাগবে মনোযোগী কান।' },
    preload: ['th-think', 'th-sink', 'th-three', 'th-tree', 'th-thank', 'th-sank'],
    steps: [
      { key: 'hear', scenes: [
        { type: 'pairs', id: 'two-th', visual: 'th', single: true,
          title: { en: 'Two TH sounds', bn: 'দুটো TH শব্দ' },
          cue: { en: 'think, three, thank: only air. this, that, those: air + buzz. Bangla has neither — you only need to recognise them.', bn: 'think, three, thank: শুধু বাতাস। this, that, those: বাতাস + গুঞ্জন। বাংলায় কোনোটাই নেই — শুধু চিনতে পারলেই চলবে।' },
          groups: [
            { label: 'θ', name: { en: 'air', bn: 'বাতাস' }, clips: ['th-think', 'th-three', 'th-thank'] },
            { label: 'ð', name: { en: 'air + buzz', bn: 'বাতাস + গুঞ্জন' }, clips: ['th-this', 'th-that', 'th-those'] },
          ] },
        { type: 'pairs', id: 'th-pairs', visual: 'airvoice',
          title: { en: 'Catch the first sound', bn: 'প্রথম শব্দটা ধরুন' },
          cue: { en: 'TH is soft air. s hisses. t stops, then pops. The rest of the word helps you too.', bn: 'TH নরম বাতাস। s হিস্‌ করে। t থামে, তারপর ফট করে। শব্দের বাকি অংশও সাহায্য করে।' },
          pairs: [
            { a: 'th-think', b: 'th-sink', la: 'th', lb: 's' },
            { a: 'th-three', b: 'th-tree', la: 'th', lb: 't' },
            { a: 'th-thank', b: 'th-sank', la: 'th', lb: 's' },
          ] },
      ] },
      { key: 'play', scenes: [
        { type: 'identify', id: 'which-th', visual: 'airvoice',
          title: { en: 'Trust your ear', bn: 'কানের ওপর ভরসা রাখুন' },
          cue: { en: 'Listen first. Then tap the word you heard.', bn: 'আগে শুনুন। তারপর যে শব্দটা শুনলেন তাতে চাপ দিন।' },
          pairs: [['th-think', 'th-sink'], ['th-three', 'th-tree'], ['th-thank', 'th-sank']] },
      ] },
    ],
  },
];

// Word labels for clips (what the student sees on a button).
export const LABEL = {
  'vow-tim': 'Tim', 'con-jew': 'Jew', 'clu-eekul': 'eeskool', 'clu-sitreet': 'sitreet',
  'pro-sent1': 'After the long meeting, I went straight home, and slept for hours.',
  'pro-sent1-mono': 'After the long meeting, I went straight home, and slept for hours.',
  'pro-sent2': 'When I finished my homework, I called my friend, and we played football.',
  'pro-sent3': 'Let’s eat, Grandma!', 'pro-nopause': 'Let’s eat Grandma!',
  'pro-sent4': 'The teacher who helped me the most was my English teacher in high school.',
};

export const UI = {
  start: { en: 'Start', bn: 'শুরু' },
  next: { en: 'Next', bn: 'পরের' },
  back: { en: 'Back', bn: 'আগের' },
  listen: { en: 'Listen', bn: 'শুনুন' },
  again: { en: 'Again', bn: 'আবার' },
  both: { en: 'Hear both', bn: 'দুটোই শুনুন' },
  playAll: { en: 'Play all', bn: 'সব শুনুন' },
  startsIn: { en: 'Audio starts in', bn: 'অডিও শুরু হচ্ছে' },
  tapToHear: { en: 'Tap any picture to hear it', bn: 'শুনতে যেকোনো ছবিতে চাপ দিন' },
  allUnits: { en: 'All units', bn: 'সব ইউনিট' },
  nextUnit: { en: 'Next unit', bn: 'পরের ইউনিট' },
  unit: { en: 'Unit', bn: 'ইউনিট' },
  presentOnTv: { en: 'Present on TV', bn: 'টিভিতে দেখান' },
  autoplay: { en: 'Play sound automatically', bn: 'স্বয়ংক্রিয়ভাবে শব্দ চালান' },
  forTeacher: { en: 'For the teacher', bn: 'শিক্ষকের জন্য' },
  print: { en: 'Print the cheat sheet', bn: 'চিট শিট প্রিন্ট করুন' },
  correct: { en: 'Yes!', bn: 'ঠিক!' },
  notQuite: { en: 'Not this time.', bn: 'এবার হলো না।' },
  nextRound: { en: 'Next', bn: 'পরের' },
  check: { en: 'Check', bn: 'মিলিয়ে দেখুন' },
  tryAgain: { en: 'Try again', bn: 'আবার চেষ্টা' },
  playWord: { en: 'Play the word', bn: 'শব্দটা শুনুন' },
  record: { en: 'Record me', bn: 'আমার কণ্ঠ রেকর্ড' },
  stop: { en: 'Stop', bn: 'থামুন' },
  hearMe: { en: 'Hear me', bn: 'আমারটা শুনুন' },
  model: { en: 'Model', bn: 'মডেল' },
  you: { en: 'You', bn: 'আপনি' },
  said: { en: 'Said it', bn: 'বলেছি' },
  done: { en: 'Unit complete', bn: 'ইউনিট শেষ' },
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
