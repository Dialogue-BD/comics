/* ---------------------------------------------------------------------------
   Culture Circles — the scene comics
   ---------------------------------------------------------------------------
   Each scenario's set-up told as a short wordless comic with a narrator and
   two voiced characters. It is the Watch step's listening exercise:

     listen 1  the comic plays itself, panel by panel, with no words on screen
     listen 2  the same, with the line being spoken shown karaoke-style
     listen 3  the whole transcript, with every glossed word tappable

   THIS FILE IS THE SOURCE OF TRUTH. The page reads it, and the asset brief
   (culture-circles-scene-assets.md) is generated from it by
   tools/gen-scene-assets.js. Change a line here and regenerate: never edit a
   transcript in the brief by hand, or the karaoke drifts from the audio.

   Per scene
     cast[]    the two characters. slug names their portrait:
               scene/cast/<slug>.jpg (384x384). tts is the browser-speech
               stand-in used until the recording exists.
     rooms{}   where the audio happens, one entry per location. The last line
               is the room tone, because the TTS API has no field for it.
     panels[]  six square pictures, scene/panels/<id>-<n>.webp (+ .jpg).
               beat = which of the three existing strip panels stands in for
               it until the new picture is drawn.
     lines[]   w: 'N' for the narrator, or 0 / 1 for cast[0] / cast[1]
               p: the panel on screen from the moment the line starts
               t: the words, exactly as spoken. <sigh>-style tags are for the
                  TTS model only; the page strips them.
               s: the delivery for this line (Gemini style), optional

   Audio: ONE FILE PER SCENE, scene/<id>.mp3, built from takes:
     - a dialogue take is a run of character lines in one room, recorded in
       one Gemini conversational-mode call so the two characters actually
       play off each other (the model takes two speakers per call);
     - a narration take is a run of narrator lines, recorded on its own —
       voice-over, dry, as in radio drama (and a call takes two speakers).
   Every voice is a prebuilt Gemini voice. A character's accent is an
   inflection note (accent) added to the style of each of their lines.
   sceneSegments() below derives the takes from the lines, so nothing is
   authored twice. tools/assemble_scenes.py levels them, adds room tone to
   the dialogue, and joins them into the scene file; tools/align_scenes.py
   then times every word, which is how the page knows when each line starts
   (to turn the panel), where to seek (to replay one line), and which word
   to light up.

   Writing rules: B1 English, short sentences, contractions, present tense for
   the narrator. The scene shows what happened; it never explains why — the
   three interviews do that. Nothing in a scene may contradict the
   observation paragraph in scenarios.js.
--------------------------------------------------------------------------- */

const SCENE_NARRATOR = {
  slug: 'narrator',
  name: 'Narrator',
  voice: { prebuilt: 'Sulafat', note: 'Warm' },
  tts: { gender: 'female', rate: 0.9, pitch: 1.0 },
  style: 'calm, warm storytelling for learners, slow and very clear, a small pause at every full stop'
};

const SCENES = {

/* ========================================================================= 1 */
'dinner-ends-at-eight': {
  rooms: {
    sofa:   'Tania\'s small apartment in Chicago on a weekday evening, sunset through the window.\nRoom tone: quiet room air, faint traffic through a closed window. Jeff\'s lines are a voice message played from her phone.',
    home:   'A warm apartment in a Chicago neighbourhood on a Saturday evening, six people around a dining table.\nRoom tone: small-room warmth, cutlery on plates, low friendly chatter of four other guests under the speakers.',
    street: 'A quiet residential street in Chicago just after eight in the evening.\nRoom tone: light traffic two streets away, a gentle breeze, one car door far off.'
  },
  cast: [
    { slug: 'tania', name: 'Tania', age: 26, gender: 'female',
      who: 'an accountant from Rajshahi, three weeks into her first job in Chicago',
      look: 'Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip)',
      voice: { prebuilt: 'Autonoe', note: 'Bright' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements',
      profile: 'Young woman in her mid-twenties, warm clear mid-range voice, careful and slightly formal English with a soft Bangladeshi accent. Polite, rises a little at the ends of questions, stresses the key word gently rather than loudly.',
      tts: { gender: 'female', rate: 0.95, pitch: 1.1 } },
    { slug: 'jeff', name: 'Jeff', age: 42, gender: 'male',
      who: 'Tania\'s colleague, the host',
      look: 'white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip)',
      voice: { prebuilt: 'Achird', note: 'Friendly' },
      profile: 'Warm, easy baritone, general American. Talks quickly and brightly, lots of energy in the first word of a sentence, relaxed and sure of himself.',
      tts: { gender: 'male', rate: 1.05, pitch: 0.9 } }
  ],
  panels: [
    { beat: 1, room: 'sofa',   see: 'Evening in a small apartment. Tania sits on her sofa, holding her phone to her ear, listening to a voice message. On the phone screen: an envelope icon and a small clock showing 6:00–8:00. She looks surprised and pleased.' },
    { beat: 2, room: 'home',   see: 'An apartment door opening. Tania on the doormat holding a wrapped box of sweets with both hands. Jeff opens the door, delighted. A wall clock just inside reads 6:00.' },
    { beat: 2, room: 'home',   see: 'Dinner table at an angle. Six people eating and laughing, plates of food, candles, glasses. Tania relaxed in the middle of it, mid-laugh.' },
    { beat: 2, room: 'home',   see: 'The wall clock reads 8:05. Jeff stands up at the table, one hand raised as if thanking everyone. Tania, still seated, is caught mid-bite, eyebrows up in surprise.' },
    { beat: 3, room: 'home',   see: 'At the front door. Guests putting on coats, smiling, waving. Jeff shakes hands warmly with a departing guest. Everyone looks happy.' },
    { beat: 3, room: 'street', see: 'Night street outside the building. The other guests walk away cheerfully. Tania stands alone under a streetlamp holding the empty sweet box, looking at her wristwatch, puzzled but half-smiling.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago.' },
    { w: 'N', p: 1, t: 'One evening, her phone buzzes. It\'s a voice message from Jeff, a colleague.' },
    { w: 1,   p: 1, t: 'Hi, Tania, it\'s Jeff! A few of us are having dinner at my place on Saturday. Want to come?', s: 'friendly and casual, a recorded voice message, a little rushed' },
    { w: 1,   p: 1, t: 'Come at six. I\'ll have to push everyone out by eight, though. I\'ve got an early start on Sunday.', s: 'cheerful and matter-of-fact, as if saying something completely normal' },
    { w: 0,   p: 1, t: 'Push everyone out by eight? Oh... okay.', s: 'surprised, quietly repeating it to herself' },
    { w: 'N', p: 2, t: 'On Saturday, Tania arrives at six o\'clock exactly. She brings a box of sweets.' },
    { w: 1,   p: 2, t: 'Tania! Come in, come in. Oh, wow, are these for us? Thank you!', s: 'delighted and welcoming' },
    { w: 'N', p: 3, t: 'The food is good. Everybody talks and laughs. Tania is having a great time.' },
    { w: 'N', p: 4, t: 'Then, at five past eight, Jeff stands up.' },
    { w: 1,   p: 4, t: 'Okay, everyone, that\'s eight o\'clock! Thank you so much for coming. This was really fun.', s: 'bright and grateful, raising his voice a little over the table' },
    { w: 0,   p: 4, t: 'Oh... is it finished already?', s: 'quiet, surprised, half to herself' },
    { w: 1,   p: 5, t: 'Tania, thanks for the sweets. See you on Monday!', s: 'warm, a friendly goodbye' },
    { w: 'N', p: 5, t: 'Everybody smiles. Everybody says goodbye. Nobody looks hurt.' },
    { w: 'N', p: 6, t: 'Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started.' },
    { w: 0,   p: 6, t: 'Eight o\'clock... and nobody was upset?', s: 'puzzled, thinking aloud, slow' }
  ]
},

/* ========================================================================= 2 */
'splitting-the-bill': {
  rooms: {
    restaurant: 'A cosy, busy restaurant in Austin, Texas, on a Friday night. Six students at a round wooden table with candles.\nRoom tone: lively restaurant hum, plates and cutlery, soft background music too low to make out.',
    street: 'The pavement outside the restaurant, warm night air.\nRoom tone: light traffic, distant music from a bar, footsteps.'
  },
  cast: [
    { slug: 'nusrat', name: 'Nusrat', age: 22, gender: 'female',
      who: 'an exchange student from Dhaka in her first term in Austin',
      look: 'Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip)',
      voice: { prebuilt: 'Leda', note: 'Youthful' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels',
      profile: 'Young woman, bright mid-range voice with a clear Bangladeshi accent. Quick and warm, laughs easily, lifts her pitch when she is being generous.',
      tts: { gender: 'female', rate: 1.0, pitch: 1.15 } },
    { slug: 'jake', name: 'Jake', age: 23, gender: 'male',
      who: 'her classmate, who chose the restaurant',
      look: 'white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip)',
      voice: { prebuilt: 'Fenrir', note: 'Excitable' },
      profile: 'Young man, bright and bouncy tenor, general American with a light Texan ease. Speaks fast, smiles through his words, drops his voice when he reassures.',
      tts: { gender: 'male', rate: 1.08, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'restaurant', see: 'A cosy restaurant. Six young friends at a round table with candles and nearly empty plates of tacos. Jake at the end gestures proudly at the food. Nusrat, beside him, gives a thumbs-up, smiling.' },
    { beat: 1, room: 'restaurant', see: 'A waiter places a single bill in a small folder in the middle of the table. Nusrat looks at Jake expectantly, eyebrows raised, half-teasing.' },
    { beat: 2, room: 'restaurant', see: 'Everyone at the table has a phone out, looking at the bill and tapping calculators. One phone screen shows 14.50.' },
    { beat: 2, room: 'restaurant', see: 'Nusrat reaches into her handbag for her purse, leaning forward to offer to pay for everyone. Jake laughs and shakes his head, one palm raised: no.' },
    { beat: 3, room: 'restaurant', see: 'A card machine passes from hand to hand around the table. Each friend taps their own card or phone. Calm and friendly.' },
    { beat: 3, room: 'street',     see: 'Outside the restaurant at night. The friends walk off chatting. Nusrat stops under a lamp and looks at her small paper receipt, amused and puzzled.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class.' },
    { w: 1,   p: 1, t: 'Didn\'t I tell you? Best tacos in Austin. I found this place last year.', s: 'proud and playful' },
    { w: 0,   p: 1, t: 'You were right, Jake. It was delicious.', s: 'happy, full, warm' },
    { w: 'N', p: 2, t: 'Then the waiter brings the bill. Just one bill, for six people.' },
    { w: 0,   p: 2, t: 'So, Jake... this was your idea. Are you paying tonight?', s: 'teasing lightly, but half serious' },
    { w: 1,   p: 2, t: '<laugh> Me? No way! We\'ll just split it. Everybody pays for what they had.', s: 'amused and relaxed' },
    { w: 'N', p: 3, t: 'Everybody takes out their phone. They look at the bill and do some math.' },
    { w: 1,   p: 3, t: 'Okay, I had the fish tacos and a soda. That\'s fourteen fifty, plus the tip.', s: 'reading numbers off his phone, easy-going' },
    { w: 0,   p: 4, t: 'Wait, wait. Please, let me pay for everyone. It\'s no problem!', s: 'generous and a little urgent' },
    { w: 1,   p: 4, t: 'That\'s really nice, Nusrat, but no. Just pay for yours. Really, it\'s fine.', s: 'gentle and friendly, completely sure' },
    { w: 'N', p: 5, t: 'One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill.' },
    { w: 'N', p: 6, t: 'Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun.' },
    { w: 0,   p: 6, t: 'Nobody even tried to pay for me...', s: 'amused and puzzled, softly' }
  ]
},

/* ========================================================================= 3 */
'disagreeing-in-the-meeting': {
  rooms: {
    meeting: 'A glass-walled meeting room in a Boston logistics office on a Monday morning. Eight people around a long table, a screen at one end.\nRoom tone: quiet air handling, a chair creaking, one person turning a page.'
  },
  cast: [
    { slug: 'richard', name: 'Richard', age: 56, gender: 'male',
      who: 'the director presenting his plan',
      look: 'white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip)',
      voice: { prebuilt: 'Alnilam', note: 'Firm' },
      profile: 'Man in his fifties, low steady baritone, general American. Measured and unhurried, slight pause before important words, sounds in charge without being cold.',
      tts: { gender: 'male', rate: 0.95, pitch: 0.82 } },
    { slug: 'ryan', name: 'Ryan', age: 26, gender: 'male',
      who: 'a junior analyst, two years in the job',
      look: 'white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip)',
      voice: { prebuilt: 'Algieba', note: 'Smooth' },
      profile: 'Young man, smooth mid-range voice, general American. Clear and polite, speaks with calm confidence, counts his points with a small lift on each number.',
      tts: { gender: 'male', rate: 1.0, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'meeting', see: 'A meeting room. Eight colleagues at a long table. Richard stands by a wall screen showing a simple bar chart, pointing at it. He looks confident.' },
    { beat: 2, room: 'meeting', see: 'Ryan, young, raises his hand halfway. Heads around the table turn to look at him; one colleague looks surprised.' },
    { beat: 2, room: 'meeting', see: 'Ryan speaks calmly, counting on three raised fingers. Richard, arms folded, listens.' },
    { beat: 3, room: 'meeting', see: 'Close on Richard: he looks down at a notebook and writes something, nodding slightly. The room is quiet.' },
    { beat: 3, room: 'meeting', see: 'Richard points his pen towards Ryan with a small appreciative smile. Ryan sits back, relaxed.' },
    { beat: 3, room: 'meeting', see: 'The meeting carries on: a different colleague is now at the screen. Richard and Ryan both take notes. Coffee cups, normal Monday atmosphere, nobody embarrassed.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'It\'s Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan.' },
    { w: 0,   p: 1, t: 'So that\'s the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts?', s: 'confident, wrapping up a presentation' },
    { w: 'N', p: 2, t: 'Ryan is twenty-six. He has worked here for two years. He puts up his hand.' },
    { w: 1,   p: 2, t: 'Honestly, I don\'t think that will work. Can I say why?', s: 'calm and polite, direct' },
    { w: 0,   p: 2, t: 'Sure. Go ahead.', s: 'neutral, genuinely open' },
    { w: 1,   p: 3, t: 'Okay. First, Tuesday is already our busiest day. Second, two of our drivers don\'t work on Tuesdays. And third, our biggest customer wants Monday deliveries.', s: 'clear and organised, counting his points' },
    { w: 'N', p: 4, t: 'The room is quiet. Richard listens. He writes something down.' },
    { w: 0,   p: 5, t: 'Hmm. The drivers... I didn\'t know that. Good point. Thanks, Ryan.', s: 'thoughtful, then appreciative' },
    { w: 1,   p: 5, t: 'Sure.', s: 'relaxed, simple' },
    { w: 'N', p: 6, t: 'And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard.' }
  ]
},

/* ========================================================================= 4 */
'the-boss-stacks-chairs': {
  rooms: {
    hall: 'A community hall in Denver just after an office event, most guests gone. Stacks of folding chairs, a few balloons.\nRoom tone: big empty-room echo, chairs clacking somewhere at the back, a door propped open.',
    lot: 'A parking lot outside the hall, late afternoon.\nRoom tone: light wind, a distant highway, a car boot opening.',
    kitchen: 'The small office kitchen at the back of the hall.\nRoom tone: a coffee maker gurgling, a fridge hum, voices of two volunteers in the next room.'
  },
  cast: [
    { slug: 'tanvir', name: 'Tanvir', age: 23, gender: 'male',
      who: 'a new intern from Chittagong, in his first week',
      look: 'Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip)',
      voice: { prebuilt: 'Umbriel', note: 'Easy-going' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w',
      profile: 'Young man, earnest light baritone with a Bangladeshi accent. Respectful, a little breathless when nervous, softens the ends of his sentences.',
      tts: { gender: 'male', rate: 1.0, pitch: 1.1 } },
    { slug: 'dave', name: 'Dave', age: 49, gender: 'male',
      who: 'the country director — the same Dave the class interviews in step 3',
      alsoIn: 'the-boss-stacks-chairs-1',
      look: 'white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg)',
      voice: { prebuilt: 'Zubenelgenubi', note: 'Casual — the voice already used for his interview, so he sounds like the same man' },
      profile: 'Man in his late forties, relaxed and casual mid-baritone, general American. Laughs easily, never sounds like a boss, a friendly lift at the end of short phrases.',
      tts: { gender: 'male', rate: 1.0, pitch: 0.9 } }
  ],
  panels: [
    { beat: 1, room: 'hall',    see: 'After the party in a hall: balloons, empty tables. Dave, sleeves rolled up, lifts a stack of folding chairs. Tanvir, holding a box, stares at him in surprise.' },
    { beat: 2, room: 'hall',    see: 'Tanvir hurries over with both hands out to take the chairs from Dave, bowing his head slightly, anxious.' },
    { beat: 2, room: 'hall',    see: 'Dave laughs, one hand on his chest, the other waving the idea away. Tanvir looks embarrassed but starts to smile.' },
    { beat: 3, room: 'lot',     see: 'Parking lot. The two of them carry cardboard boxes to an open car boot. Dave carries the bigger, heavier box.' },
    { beat: 3, room: 'kitchen', see: 'Small office kitchen. Dave pours coffee into a row of paper cups for two volunteers holding brooms.' },
    { beat: 3, room: 'kitchen', see: 'Dave hands a mug to Tanvir. Tanvir holds it with both hands, amazed, as if receiving a gift.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'The office party is over. Tanvir is a new intern. It is his first week.' },
    { w: 'N', p: 1, t: 'Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs.' },
    { w: 0,   p: 2, t: 'Sir! Sir, please, let me do that. You don\'t have to.', s: 'anxious and respectful, hurrying' },
    { w: 1,   p: 3, t: '<laugh> Sir? Please, it\'s Dave. And it\'s fine, I\'ve got these.', s: 'amused and kind, completely relaxed' },
    { w: 0,   p: 3, t: 'Okay, s... Dave.', s: 'hesitant, trying the first name for the first time' },
    { w: 1,   p: 4, t: 'Hey, can you grab that box? The car\'s just outside. I\'ll take the heavy one.', s: 'casual, practical' },
    { w: 'N', p: 4, t: 'Together they carry the boxes out to the car.' },
    { w: 'N', p: 5, t: 'Later, the cleaning is almost finished. Dave goes into the kitchen.' },
    { w: 1,   p: 5, t: 'Who wants coffee? I\'m making a pot.', s: 'calling out cheerfully to the next room' },
    { w: 1,   p: 6, t: 'Here you go, Tanvir. The milk\'s in the fridge.', s: 'friendly and offhand' },
    { w: 0,   p: 6, t: 'Thank you... Dave.', s: 'quiet, amazed, grateful' },
    { w: 'N', p: 6, t: 'Tanvir holds the cup with both hands. The boss made him coffee.' }
  ]
},

/* ========================================================================= 5 */
'what-do-you-think': {
  rooms: {
    classroom: 'A mid-sized university seminar room in Michigan, twenty students at tables, afternoon light.\nRoom tone: a quiet heating vent, a clock ticking faintly, one chair shifting.',
    corridor: 'A university corridor just after class.\nRoom tone: soft footsteps, distant voices, a door closing.'
  },
  cast: [
    { slug: 'farhana', name: 'Farhana', age: 20, gender: 'female',
      who: 'a first-year student from Khulna in her first university class in Michigan',
      look: 'Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip)',
      voice: { prebuilt: 'Achernar', note: 'Soft' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress',
      profile: 'Young woman, soft and slightly breathy voice with a Bangladeshi accent. Quiet, hesitates before she starts, grows steadier as she goes.',
      tts: { gender: 'female', rate: 0.95, pitch: 1.1 } },
    { slug: 'novak', name: 'Dr. Novak', age: 54, gender: 'male',
      who: 'the literature teacher',
      look: 'white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip)',
      voice: { prebuilt: 'Rasalgethi', note: 'Informative' },
      profile: 'Man in his fifties, warm and informative baritone, general American. Patient, lets silences sit, rises with real curiosity when a student speaks.',
      tts: { gender: 'male', rate: 0.95, pitch: 0.85 } }
  ],
  panels: [
    { beat: 1, room: 'classroom', see: 'University classroom with tables in a horseshoe. Students with books open. Dr. Novak closes his book and leans on the front desk, looking at the class with an open, expectant face.' },
    { beat: 2, room: 'classroom', see: 'Silence. The students look down at their books. Farhana, in the second row, stares at her page. A wall clock\'s second hand is near the 12.' },
    { beat: 2, room: 'classroom', see: 'Dr. Novak waits calmly, hands open, eyebrows raised, not speaking. The wall clock\'s second hand has moved to the 2: ten seconds later.' },
    { beat: 2, room: 'classroom', see: 'Close on Farhana: she half-raises her hand, uncertain, biting her lip. Dr. Novak has noticed her and gestures towards her with an open palm.' },
    { beat: 3, room: 'classroom', see: 'Farhana speaks. Dr. Novak leans forward, interested. Two classmates turn to listen to her.' },
    { beat: 3, room: 'corridor',  see: 'After class, Farhana in the corridor looks at a printed course plan with a pie chart. One slice of the chart, a fifth, is highlighted in gold and labelled 20%.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story.' },
    { w: 1,   p: 1, t: 'So... what do you think?', s: 'open and curious, relaxed' },
    { w: 'N', p: 2, t: 'Nobody speaks. Farhana looks down at her book.' },
    { w: 'N', p: 3, t: 'Dr. Novak doesn\'t say anything. He just waits. Five seconds. Ten seconds.' },
    { w: 1,   p: 3, t: 'It\'s okay. There\'s no right answer. I actually want to know your opinion.', s: 'patient and encouraging, unhurried' },
    { w: 0,   p: 4, t: '<whispers> My opinion? But he is the teacher...', s: 'whispering to herself, unsure' },
    { w: 1,   p: 4, t: 'Farhana? You look like you have an idea.', s: 'gentle, inviting' },
    { w: 0,   p: 5, t: 'Um... I think the father was wrong. He didn\'t listen to his son.', s: 'hesitant at first, then a little steadier' },
    { w: 1,   p: 5, t: 'Interesting! Why do you think that? Tell me more.', s: 'genuinely delighted and curious' },
    { w: 'N', p: 6, t: 'After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class.' },
    { w: 0,   p: 6, t: 'Twenty percent... just for talking?', s: 'surprised, thinking aloud' }
  ]
},

/* ========================================================================= 6 */
'the-neighbours-tree': {
  rooms: {
    yard: 'Two neighbouring front gardens on a quiet suburban street in Portland, a cool grey autumn morning, wet leaves everywhere.\nRoom tone: light breeze through trees, leaves rustling, a crow far off.',
    door: 'The front porch of the house next door.\nRoom tone: breeze, a wind chime once, the door swinging open.'
  },
  cast: [
    { slug: 'bill', name: 'Bill', age: 58, gender: 'male',
      who: 'the man whose roof gutter keeps filling with leaves',
      look: 'white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip)',
      voice: { prebuilt: 'Algenib', note: 'Gravelly' },
      profile: 'Man in his late fifties, gravelly low voice, general American. Plain-spoken and a bit gruff, then friendly; short phrases, a smile you can hear when he relaxes.',
      tts: { gender: 'male', rate: 0.95, pitch: 0.78 } },
    { slug: 'mike', name: 'Mike', age: 47, gender: 'male',
      who: 'the neighbour with the maple tree',
      look: 'white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip)',
      voice: { prebuilt: 'Sadachbia', note: 'Lively' },
      profile: 'Man in his forties, lively warm tenor, general American. Open and easy, quick to agree, a friendly bounce in his rhythm.',
      tts: { gender: 'male', rate: 1.02, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'yard', see: 'Autumn. Bill stands in his garden, hands on hips, frowning up at his roof gutter, which is overflowing with orange maple leaves. The neighbour\'s big maple tree leans over the fence.' },
    { beat: 2, room: 'yard', see: 'Bill walks up the path of the house next door and knocks on the front door.' },
    { beat: 2, room: 'door', see: 'Mike opens the door, surprised and friendly. Bill smiles and points back towards the tree.' },
    { beat: 2, room: 'yard', see: 'Bill and Mike stand side by side on the lawn looking up at the maple. Mike rubs his chin; Bill points at the big branches over his roof.' },
    { beat: 3, room: 'yard', see: 'The two men shake hands, both smiling.' },
    { beat: 3, room: 'yard', see: 'Next morning. Bill carries out his rubbish bin; Mike, backing out of his driveway in a car, waves through the window. Bill waves back.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'It\'s autumn in Portland. Leaves from the neighbour\'s big maple tree keep falling into Bill\'s roof gutter.' },
    { w: 0,   p: 1, t: '<groan> Again? That\'s the third time this week.', s: 'tired, grumbling to himself' },
    { w: 'N', p: 2, t: 'Bill walks next door and knocks.' },
    { w: 1,   p: 3, t: 'Oh, hey, Bill! What\'s up?', s: 'surprised and friendly' },
    { w: 0,   p: 3, t: 'Hey, Mike. So... your maple\'s filling my gutter. Can we figure something out?', s: 'friendly and direct, with a small smile' },
    { w: 1,   p: 4, t: 'Oh, man, I\'m sorry. I didn\'t know. What if I cut back those big branches over your roof?', s: 'apologetic, then helpful' },
    { w: 0,   p: 4, t: 'That\'d be great. And I\'ll clean the gutter one more time. Deal?', s: 'relieved and practical' },
    { w: 1,   p: 5, t: 'Deal.', s: 'warm, decided' },
    { w: 'N', p: 5, t: 'They talk for four minutes. They shake hands. And that\'s it.' },
    { w: 'N', p: 6, t: 'The next morning, neither man says anything about the tree. They just wave.' },
    { w: 1,   p: 6, t: 'Morning, Bill!', s: 'cheerful, calling from a car window' },
    { w: 0,   p: 6, t: 'Morning!', s: 'friendly, calling back' }
  ]
},

/* ========================================================================= 7 */
'back-of-the-line': {
  rooms: {
    pharmacy: 'A busy neighbourhood pharmacy in Philadelphia on a weekday afternoon. Eight people queue at one counter.\nRoom tone: bright shop hum, fluorescent buzz, a till beeping, the automatic door sliding.'
  },
  cast: [
    { slug: 'brad', name: 'Brad', age: 41, gender: 'male',
      who: 'a man in a hurry',
      look: 'white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip)',
      voice: { prebuilt: 'Orus', note: 'Firm' },
      profile: 'Man in his early forties, firm quick baritone, general American. Brisk and a little impatient, polite words said fast, voice drops flat when he is let down.',
      tts: { gender: 'male', rate: 1.1, pitch: 0.9 } },
    { slug: 'carla', name: 'Carla', age: 45, gender: 'female',
      who: 'the pharmacist',
      look: 'Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip)',
      voice: { prebuilt: 'Pulcherrima', note: 'Forward' },
      profile: 'Woman in her forties, clear forward alto, general American. Warm and smiling, completely steady; friendly tone, firm words, never raises her voice.',
      tts: { gender: 'female', rate: 1.0, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'pharmacy', see: 'Inside a pharmacy. Eight people wait in one straight line to the counter: an older woman, a mother with a small child, a student with headphones, others. Carla serves at the counter.' },
    { beat: 2, room: 'pharmacy', see: 'Brad, in a suit, checks his wristwatch as he walks quickly past the line, one hand raised in a small apologetic wave.' },
    { beat: 2, room: 'pharmacy', see: 'Brad at the front of the counter, leaning in, one finger raised. The people in the line look at him, calm but watching.' },
    { beat: 3, room: 'pharmacy', see: 'Carla smiles politely and points with an open hand towards the back of the line.' },
    { beat: 3, room: 'pharmacy', see: 'Brad walks back along the line towards the end, shoulders slightly dropped. Nobody in the line looks angry.' },
    { beat: 3, room: 'pharmacy', see: 'Brad stands at the very back behind the mother and child, looking at his phone. The line moves forward one step. Carla calls the next customer.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'It\'s a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line.' },
    { w: 'N', p: 2, t: 'A man in a suit walks in. He looks at his watch. He is in a hurry.' },
    { w: 0,   p: 2, t: 'Excuse me... sorry... excuse me.', s: 'rushed, polite on the surface, moving fast' },
    { w: 'N', p: 3, t: 'He walks past everyone, straight to the front.' },
    { w: 0,   p: 3, t: 'Hi. I just have one quick question. It\'ll only take ten seconds.', s: 'charming and quick, sure it will work' },
    { w: 1,   p: 4, t: 'Sure, I\'m happy to help. The line starts back there.', s: 'warm and smiling, completely firm' },
    { w: 0,   p: 4, t: 'Oh. Right. Okay.', s: 'deflated, flat' },
    { w: 'N', p: 5, t: 'He walks to the back of the line. Nobody looks angry.' },
    { w: 'N', p: 6, t: 'And nobody says, "You can go first."' },
    { w: 1,   p: 6, t: 'Next, please!', s: 'bright and friendly, calling down the line' }
  ]
},

/* ========================================================================= 8 */
'tell-them-what-you-did': {
  rooms: {
    waiting: 'A quiet corridor outside an interview room at a company in Atlanta. Two chairs against the wall.\nRoom tone: soft air conditioning, a distant phone ringing once, muffled voices behind a door.',
    interview: 'A small bright office, one interviewer behind a wooden desk.\nRoom tone: very quiet office, a pen tapping once.',
    home: 'Two different places a week later — a dorm room, a library.\nRoom tone: near silence, a laptop fan.'
  },
  cast: [
    { slug: 'arif', name: 'Arif', age: 22, gender: 'male',
      who: 'a final-year student from Rajshahi applying for a summer internship',
      look: 'Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip)',
      voice: { prebuilt: 'Iapetus', note: 'Clear' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end',
      profile: 'Young man, gentle and modest light baritone with a Bangladeshi accent. Speaks softly, lets his voice fall at the end of sentences, downplays everything.',
      tts: { gender: 'male', rate: 0.95, pitch: 1.0 } },
    { slug: 'tyler', name: 'Tyler', age: 22, gender: 'male',
      who: 'an American student applying for the same internship',
      look: 'white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip)',
      voice: { prebuilt: 'Puck', note: 'Upbeat' },
      profile: 'Young man, upbeat and bright tenor, general American. Confident and fluent, strong stress on numbers and on "I", sounds pleased with himself in a friendly way.',
      tts: { gender: 'male', rate: 1.05, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'waiting',   see: 'A corridor outside an interview room. Arif and Tyler sit on two chairs, both in formal clothes with folders. Tyler leans back, relaxed, and smiles at her. Arif sits stiffly, nervous.' },
    { beat: 2, room: 'interview', see: 'An office. Tyler sits up straight in front of the interviewer — a Black American woman in a navy blazer at a wooden desk — gesturing confidently with one hand. She smiles and takes notes.' },
    { beat: 3, room: 'interview', see: 'The same office. Arif sits in front of the same interviewer, eyes down, one hand on his chest, making a small modest gesture.' },
    { beat: 3, room: 'interview', see: 'A memory panel with a soft faded border: Arif with a clipboard directing a crowd of volunteers packing food boxes at a charity event, clearly the person in charge.' },
    { beat: 2, room: 'home',      see: 'A week later. Tyler in his room looks at his phone and punches the air, delighted. The phone screen shows a big green tick.' },
    { beat: 3, room: 'home',      see: 'Arif at a library desk reads an email on his laptop. His face falls, disappointed.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'Arif and Tyler are students in Atlanta. They are waiting for the same internship interview.' },
    { w: 1,   p: 1, t: 'Nervous? Don\'t be. Just tell them what you did.', s: 'relaxed and friendly' },
    { w: 0,   p: 1, t: 'Tell them what I did? Okay...', s: 'uncertain, quiet' },
    { w: 'N', p: 2, t: 'The interviewer asks each of them the same question: "Tell us about your biggest achievement."' },
    { w: 1,   p: 2, t: 'Sure. Last year I led a team of five, and we grew our club\'s membership by forty percent. I\'m really proud of that.', s: 'confident and bright, proud' },
    { w: 0,   p: 3, t: 'Oh... I helped a little with a charity project. But really, it was the team\'s work.', s: 'modest and soft, eyes down' },
    { w: 'N', p: 4, t: 'But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families.' },
    { w: 'N', p: 5, t: 'One week later, the email arrives.' },
    { w: 1,   p: 5, t: 'Yes! I got it!', s: 'excited, a burst of joy' },
    { w: 'N', p: 6, t: 'Arif reads his email too. It says, "Thank you for your interest."' },
    { w: 0,   p: 6, t: '<sigh> But I did so much...', s: 'quiet and disappointed' }
  ]
},

/* ========================================================================= 9 */
'honestly-im-annoyed': {
  rooms: {
    library: 'A group study room in a university library in Sacramento, morning. Four students round a table with laptops.\nRoom tone: hushed library air, a laptop fan, a book trolley rolling past outside the glass.',
    exit: 'A busy campus café.\nRoom tone: coffee machine hiss, cups on saucers, cheerful chatter.'
  },
  cast: [
    { slug: 'hannah', name: 'Hannah', age: 23, gender: 'female',
      who: 'an engineering student who stayed up to finish Ethan\'s part — the same Hannah the class interviews in step 3',
      alsoIn: 'honestly-im-annoyed-1',
      look: 'white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip)',
      voice: { prebuilt: 'Kore', note: 'Firm — use the same voice as her interview take if it was different' },
      profile: 'Young woman, firm clear alto, general American. Calm and direct even when upset, no shouting; warmth comes back fast into her voice once it is said.',
      tts: { gender: 'female', rate: 1.0, pitch: 1.05 } },
    { slug: 'ethan', name: 'Ethan', age: 22, gender: 'male',
      who: 'the classmate who forgot his part — the same Ethan the class interviews in step 3',
      alsoIn: 'honestly-im-annoyed-2',
      look: 'white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip)',
      voice: { prebuilt: 'Zephyr', note: 'Bright — use the same voice as his interview take if it was different' },
      profile: 'Young man, bright light tenor, general American. Cheerful and quick, drops into a sincere lower tone when he apologises, laughs easily.',
      tts: { gender: 'male', rate: 1.05, pitch: 1.05 } }
  ],
  panels: [
    { beat: 1, room: 'library', see: 'A library study table by a window. Mahin, a Bangladeshi student in a checked shirt, sits with Hannah, who looks exhausted, at a table of laptops and books. Ethan arrives cheerfully and sits down.' },
    { beat: 1, room: 'library', see: 'Hannah looks straight at Ethan, frowning, arms folded. Not shouting, just serious.' },
    { beat: 2, room: 'library', see: 'Ethan\'s face: surprise turning into apology, one hand on his chest. Hannah\'s face softens a little.' },
    { beat: 2, room: 'library', see: 'Mahin looks from one to the other, worried, sinking a little lower in his chair.' },
    { beat: 3, room: 'library', see: 'Ten minutes later: Hannah and Ethan lean over a laptop, both laughing. On the laptop screen, a slide with a cartoon cat.' },
    { beat: 3, room: 'exit',    see: 'A café table: Hannah and Ethan sit with takeaway coffees, laughing together. At the next table, Mahin watches, amazed.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'Mahin is from Dhaka. He is doing a group project in the library with three American classmates.' },
    { w: 'N', p: 1, t: 'Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it.' },
    { w: 1,   p: 1, t: 'Morning, guys! Oh, did anyone finish the slides?', s: 'cheerful, completely unaware' },
    { w: 0,   p: 2, t: 'Honestly, Ethan, I\'m annoyed. I did your part last night. I was up until two.', s: 'calm but clearly upset, direct' },
    { w: 1,   p: 3, t: 'Oh no. You\'re right. I totally forgot. I\'m really sorry, Hannah.', s: 'taken aback, then sincere' },
    { w: 0,   p: 3, t: 'Okay. Thank you for saying that.', s: 'softening, sincere' },
    { w: 'N', p: 4, t: 'Mahin looks down at the table. In Dhaka, a friendship could end right here.' },
    { w: 'N', p: 5, t: 'But ten minutes later...' },
    { w: 1,   p: 5, t: '<laugh> Wait, did you really put a cat on slide nine?', s: 'laughing, delighted' },
    { w: 0,   p: 5, t: 'It was two in the morning! I needed a cat.', s: 'laughing, playful' },
    { w: 1,   p: 6, t: 'Coffee? It\'s on me. I owe you.', s: 'warm and friendly' },
    { w: 0,   p: 6, t: 'You definitely owe me.', s: 'teasing, smiling' }
  ]
},

/* ======================================================================== 10 */
'leave-the-snake-alone': {
  rooms: {
    garden: 'A sunny back garden in Asheville, North Carolina, on a summer morning: vegetable beds, a wooden shed, woods behind.\nRoom tone: birdsong, insects buzzing, leaves moving in a light breeze.'
  },
  cast: [
    { slug: 'imran', name: 'Imran', age: 21, gender: 'male',
      who: 'a student from Sylhet staying with an American family for the summer',
      look: 'Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip)',
      voice: { prebuilt: 'Enceladus', note: 'Breathy' },
      accent: 'light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply',
      profile: 'Young man, energetic mid-range voice with a Bangladeshi accent. Loud and fast when alarmed, rising pitch on questions, curious and thoughtful when calm.',
      tts: { gender: 'male', rate: 1.05, pitch: 1.05 } },
    { slug: 'kathy', name: 'Kathy', age: 48, gender: 'female',
      who: 'the host mother — the same Kathy the class interviews in step 3',
      alsoIn: 'leave-the-snake-alone-1',
      look: 'white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip)',
      voice: { prebuilt: 'Aoede', note: 'Breezy — use the same voice as her interview take if it was different' },
      profile: 'Woman in her late forties, breezy warm alto with a soft Southern ease. Unhurried, amused, gently firm; fond when she talks about animals.',
      tts: { gender: 'female', rate: 0.98, pitch: 1.0 } }
  ],
  panels: [
    { beat: 1, room: 'garden', see: 'A back garden with vegetable beds. Imran, holding a watering can, jumps back: a long black snake lies near the tomato plants.' },
    { beat: 1, room: 'garden', see: 'Imran grabs a long stick from beside the shed and raises it.' },
    { beat: 2, room: 'garden', see: 'Kathy hurries out of the back door in her apron and gloves, one hand up: stop.' },
    { beat: 2, room: 'garden', see: 'Kathy and two children (a boy in a red top, a girl in purple) crouch a few steps from the snake, watching it with interest. Imran stands behind them, stick lowered, confused.' },
    { beat: 3, room: 'garden', see: 'The snake slides away under the wooden shed. Kathy waves goodbye to it.' },
    { beat: 3, room: 'garden', see: 'Later. Imran walks through the garden and notices a dead tree still standing, with a woodpecker hole, and one corner of the garden grown wild with tall grass and flowers.' }
  ],
  lines: [
    { w: 'N', p: 1, t: 'Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina.' },
    { w: 'N', p: 1, t: 'One morning, in the back garden, he sees a long black snake near the vegetables.' },
    { w: 0,   p: 2, t: 'A snake! Wait, I\'ll get a stick!', s: 'alarmed, loud and fast' },
    { w: 1,   p: 3, t: 'No, no, no! Imran, leave him. He lives here.', s: 'urgent but calm, the way you stop a child touching a hot stove' },
    { w: 0,   p: 3, t: 'He lives here? But... it\'s a snake!', s: 'confused, rising pitch' },
    { w: 1,   p: 4, t: 'He\'s a black rat snake. He\'s not dangerous, and he eats the mice. Kids! Come and see!', s: 'relaxed and fond, then calling happily to the house' },
    { w: 'N', p: 4, t: 'The children come out. They watch the snake from a few steps away.' },
    { w: 'N', p: 5, t: 'Slowly, the snake slides under the shed.' },
    { w: 1,   p: 5, t: 'Bye, buddy. See you later.', s: 'fond and amused, quietly' },
    { w: 'N', p: 6, t: 'Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild.' },
    { w: 0,   p: 6, t: 'Nobody cuts it... on purpose?', s: 'puzzled and curious, slow' }
  ]
}
};

/* ---------------------------------------------------------------------------
   Word help for the scene transcripts. glossary.js merges these in (a phrase
   or word the main bank already has keeps the main bank's entry).
--------------------------------------------------------------------------- */
const SCENE_GLOSS = {
  phrases: [
    /* dinner */
    { p: 'push everyone out', k: 'idiom',   d: 'make all the guests leave.',
      n: 'Jeff says it lightly, as a joke about himself — not as a threat.' },
    { p: 'early start',       k: 'word',    d: 'a day when you must get up very early.' },
    { p: 'come in',           k: 'phrasal', d: 'enter — what you say when you open the door to a guest.' },
    { p: 'five past eight',   k: 'grammar', d: '8:05.', n: 'Telling the time: “five past”, “quarter past”, “half past”, “quarter to”.' },
    { p: 'quarter past eight', k: 'grammar', d: '8:15.' },
    { p: 'getting started',   k: 'phrasal', d: 'beginning.' },
    /* the bill */
    { p: 'didn\'t i tell you', k: 'grammar', d: 'I told you so — I was right!',
      n: 'A negative question that expects the answer “yes”.' },
    { p: 'no way',            k: 'idiom',   d: 'certainly not.' },
    { p: 'split it',          k: 'phrasal', d: 'divide the cost, so each person pays part.' },
    { p: 'do some math',      k: 'idiom',   d: 'do a quick calculation.', n: 'American English says “math”; British English says “maths”.' },
    { p: 'the tip',           k: 'word',    d: 'extra money you give the waiter — in the US, usually 15–20% of the bill.' },
    { p: 'one by one',        k: 'idiom',   d: 'one person after another.' },
    { p: 'reaches for',       k: 'phrasal', d: 'moves a hand to take something.' },
    { p: 'half the fun',      k: 'idiom',   d: 'a big part of the enjoyment.' },
    /* the meeting */
    { p: 'any thoughts',      k: 'discourse', d: 'do you have any ideas or opinions?',
      n: 'A common way to end a presentation and invite comments.' },
    { p: 'puts up his hand',  k: 'phrasal', d: 'raises his hand to speak.' },
    { p: 'go ahead',          k: 'phrasal', d: 'please start — you have permission.' },
    { p: 'good point',        k: 'idiom',   d: 'you are right about that — a useful idea.' },
    { p: 'goes on',           k: 'phrasal', d: 'continues.' },
    /* the chairs */
    { p: 'i\'ve got these',   k: 'idiom',   d: 'I can carry these myself — no need to help.' },
    { p: 'grab that box',     k: 'phrasal', d: 'quickly pick up that box.' },
    { p: 'making a pot',      k: 'idiom',   d: 'making a full jug of coffee for several people.' },
    { p: 'here you go',       k: 'discourse', d: 'what you say when you hand something to someone.' },
    /* the classroom */
    { p: 'no right answer',   k: 'idiom',   d: 'every sensible answer is acceptable.' },
    { p: 'look like you have an idea', k: 'grammar', d: 'your face shows you are thinking of something.',
      n: '“look like” + a sentence: “You look like you’re tired.”' },
    { p: 'tell me more',      k: 'discourse', d: 'please keep talking — I am interested.' },
    { p: 'course plan',       k: 'word',    d: 'the document that lists what a course covers and how it is graded.' },
    /* the tree */
    { p: 'keep falling',      k: 'grammar', d: 'fall again and again.', n: '“keep” + -ing = something happens many times.' },
    { p: 'what\'s up',        k: 'discourse', d: 'a casual “hello — what do you want?”' },
    { p: 'figure something out', k: 'phrasal', d: 'find a solution together.' },
    { p: 'oh man',            k: 'discourse', d: 'a sound of surprise or sympathy, like “oh dear”.' },
    { p: 'cut back',          k: 'phrasal', d: 'cut some parts off a tree or plant to make it smaller.' },
    { p: 'that\'d be great',  k: 'grammar', d: 'yes please, that would help.', n: '“That’d” = that would.' },
    /* the pharmacy */
    { p: 'in a hurry',        k: 'idiom',   d: 'needing to go fast; short of time.' },
    { p: 'excuse me',         k: 'discourse', d: 'a polite way to ask people to let you pass.' },
    { p: 'straight to the front', k: 'idiom', d: 'directly to the first place in the line.' },
    { p: 'starts back there', k: 'idiom',   d: 'begins behind you — a polite way to say “wait your turn”.' },
    { p: 'go first',          k: 'phrasal', d: 'take your turn before the others.' },
    { p: 'next please',       k: 'discourse', d: 'what a shop assistant says to call the next customer.' },
    /* the interview */
    { p: 'led a team',        k: 'word',    d: 'was the leader of a group of people.', n: '“Led” is the past of “lead”.' },
    { p: 'proud of',          k: 'grammar', d: 'happy and pleased about something you did.' },
    { p: 'raised money',      k: 'phrasal', d: 'collected money for a good cause.' },
    { p: 'thank you for your interest', k: 'idiom', d: 'a polite way a company says “no, you did not get the job”.' },
    /* the library */
    { p: 'stayed up',         k: 'phrasal', d: 'did not go to bed until late.' },
    { p: 'totally forgot',    k: 'idiom',   d: 'forgot completely.' },
    { p: 'it\'s on me',       k: 'idiom',   d: 'I will pay for it.' },
    { p: 'i owe you',         k: 'idiom',   d: 'you did something for me, so I must do something for you.' },
    /* the snake */
    { p: 'leave him',         k: 'phrasal', d: 'do not touch or hurt him.' },
    { p: 'come and see',      k: 'grammar', d: 'come here and look.', n: '“come and” + verb is common in speech: “come and sit”, “come and eat”.' },
    { p: 'see you later',     k: 'discourse', d: 'goodbye.' },
    { p: 'on purpose',        k: 'idiom',   d: 'deliberately — not by accident.' },
    { p: 'growing wild',      k: 'idiom',   d: 'growing naturally with nobody cutting or tidying it.' }
  ],
  words: {
    sweets:      { k: 'word', d: 'small sweet foods, like mishti — a common gift for a host in Bangladesh.' },
    upset:       { k: 'word', d: 'unhappy or hurt.' },
    delicious:   { k: 'word', d: 'tasting very good.' },
    bill:        { k: 'word', d: 'the paper that shows how much you must pay in a restaurant.' },
    receipt:     { k: 'word', d: 'the paper you get after you pay.' },
    share:       { k: 'word', d: 'the part that belongs to one person.' },
    deliveries:  { k: 'word', d: 'times when goods are brought to customers.' },
    embarrassed: { k: 'word', d: 'feeling uncomfortable because others are watching you.' },
    intern:      { k: 'word', d: 'a student or new graduate working for a short time to learn a job.' },
    senior:      { k: 'word', d: 'high in rank; important in the organisation.' },
    stacking:    { k: 'word', d: 'putting things one on top of another.' },
    opinion:     { k: 'word', d: 'what you think about something.' },
    grade:       { k: 'word', d: 'the mark or score for a course.' },
    gutter:      { k: 'word', d: 'the open pipe along the edge of a roof that carries rain water away.' },
    maple:       { k: 'word', d: 'a large tree whose leaves turn red and orange in autumn.' },
    deal:        { k: 'word', d: 'an agreement. Said alone, “Deal!” means “I agree.”' },
    pharmacy:    { k: 'word', d: 'a shop that sells medicine.' },
    achievement: { k: 'word', d: 'something good you did with effort.' },
    internship:  { k: 'word', d: 'a short job for students, to get work experience.' },
    membership:  { k: 'word', d: 'the number of people who belong to a club.' },
    volunteers:  { k: 'word', d: 'people who work without pay to help.' },
    annoyed:     { k: 'word', d: 'a little angry.' },
    definitely:  { k: 'word', d: 'certainly; without any doubt.' },
    dangerous:   { k: 'word', d: 'able to hurt you.' },
    buddy:       { k: 'word', d: 'friend — a very casual word.' },
    shed:        { k: 'word', d: 'a small wooden building in a garden for tools.' }
  }
};

/* Room tone under the dialogue takes, per room: (component, dB relative to
   the take's own speech level), the components of ambience/amb.py. Narration
   takes get none — voice-over is dry. Used by tools/assemble_scenes.py. */
const SCENE_BEDS = {
  sofa:       [['air', -40], ['rumble', -44], ['presence', -52]],
  home:       [['air', -40], ['babble', -34], ['dish', -40]],
  street:     [['wind', -40], ['rumble', -42], ['air', -44]],
  restaurant: [['babble', -30], ['dish', -36], ['clatter', -40, 4], ['air', -42]],
  meeting:    [['air', -38], ['fluoro', -46], ['presence', -52]],
  hall:       [['air', -36], ['presence', -44], ['clatter', -44, 3]],
  lot:        [['wind', -38], ['rumble', -40]],
  kitchen:    [['air', -40], ['mains', -46], ['babble', -42]],
  classroom:  [['air', -40], ['fan', -44, 9.0], ['presence', -52]],
  corridor:   [['air', -40], ['presence', -50], ['babble', -44]],
  yard:       [['wind', -38], ['birds', -42], ['air', -44]],
  door:       [['wind', -40], ['birds', -46], ['air', -44]],
  pharmacy:   [['fluoro', -40], ['air', -40], ['babble', -38], ['door', -46]],
  waiting:    [['air', -38], ['fan', -44, 11.0], ['presence', -52]],
  interview:  [['air', -42], ['presence', -52]],
  library:    [['air', -40], ['fan', -46, 11.0], ['presence', -52]],
  exit:       [['babble', -34], ['dish', -40], ['air', -42]],
  garden:     [['birds', -36], ['wind', -40], ['air', -44]]
};

/* The takes a scene is recorded in: runs of narrator lines, and runs of
   character lines that stay in one room. Returns
   [{ key: '<id>-s01', kind: 'narration' | 'dialogue', room, lines: [i, …] }]. */
function sceneSegments(id){
  const S = SCENES[id], out = [];
  S.lines.forEach((L, i) => {
    const kind = L.w === 'N' ? 'narration' : 'dialogue';
    const room = kind === 'dialogue' ? S.panels[L.p - 1].room : null;
    const last = out[out.length - 1];
    if (last && last.kind === kind && last.room === room) last.lines.push(i);
    else out.push({ kind, room, lines: [i] });
  });
  out.forEach((g, k) => { g.key = id + '-s' + String(k + 1).padStart(2, '0'); });
  return out;
}

if (typeof module !== 'undefined') module.exports = { SCENES, SCENE_NARRATOR, SCENE_GLOSS, SCENE_BEDS, sceneSegments };
