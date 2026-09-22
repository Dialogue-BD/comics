# Ethnographic Interviews — Voice Production Script

**Dialogue · English & Skills Center, Rajshahi**
18 interview recordings for `dialogue-bd.com/ethnographic-interviews/`

---

## How to run these

Google AI Studio's speech playground gives you **Audio profile**, **Scene**, a
**Director's note** of three dropdowns (Style, Pace, Accent), **Sample
context**, and the **transcript** under the speaker.

Each interview below gives you the exact dropdown picks plus one block of text
per field.

The three text fields do different jobs, so nothing is duplicated between them:

- **Audio profile** is the sound of the voice and nothing else — register,
  timbre, dynamic range, articulation, and where the stress and the pauses
  fall.
- **Scene** is the place: where the interview is happening, plus the room tone
  on the last line (Google's "audio context" has no field of its own).
- **Sample context** is what the recording is — a spontaneous answer to one
  question, who the speaker is in relation to the topic, and the intent behind
  the words.

Style, Pace and Accent are closed lists, so where a dropdown cannot carry the
nuance it is written into Audio profile, which is free text.

Two accents have no option that fits: Tomás is a fluent Spanish speaker and Ade
has a faint Nigerian-family inflection. Both are set to American (Gen), with the
colouring described in the Audio profile — listen for whether it survives, and
if it does not, the line still works read straight.

**Model.** `gemini-2.5-pro-preview-tts` for the takes you keep;
`gemini-2.5-flash-preview-tts` for quick drafts. `gemini-3.1-flash-tts-preview`
is the newest and the one that supports streaming — worth auditioning, but
check it against Pro on one or two of these before committing to all eighteen.

**Voices.** All eighteen speakers are given a different one of the 30 prebuilt
voices, so nobody sounds like anybody else — including across scenarios, where a
student may hear six people in one lesson. Audition each in the voice library
before a batch run: the voices are not labelled by gender, and if one reads the
wrong way for a character, swap it and note the change here.

**Output.** The playground hands back WAV; the API returns 16-bit PCM at 24 kHz,
mono. The page wants MP3:

    ffmpeg -i take.wav -codec:a libmp3lame -b:a 96k <filename>.mp3
    ffmpeg -f s16le -ar 24000 -ac 1 -i take.pcm -codec:a libmp3lame -b:a 96k <filename>.mp3

Drop the finished file into `ethnographic-interviews/audio/` under exactly the
filename given in each block. The page checks for it on load and only falls back
to the browser's own speech engine if it is missing — no code change needed.

**Target length.** 20–35 seconds each. These are answers to a question, not
narration: room tone, not studio silence.

### Notes on the audio tags

The bracketed tags are Gemini's own inline delivery markers, used sparingly here —
one or two per interview, only where a real vocal event happens. Everything else
is steered by the direction in the Audio profile and by the punctuation of the
transcript itself.

Two things to watch:

- If a tag is ever **spoken aloud** instead of performed, delete that tag and
  re-run; the words either side are already written to carry the moment.
- If a tag makes the delivery **too big** — a laugh that turns into a performance —
  cut it rather than trying to talk the model down. These people are answering a
  question, not entertaining anybody.

Everything in the transcripts is word-for-word what the page shows as the
transcript, so a student reading along hears exactly what is written. **Do not
rewrite the transcript lines.** If a line needs changing, change it in
`scenarios.js` and regenerate this script so the two cannot drift apart.

---


---

## 1 · Dana — `dinner-ends-at-eight-1.mp3`

**Voice** Aoede (Breezy) · **Style** `Vocal Smile` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[laughs]`

Scenario: The dinner that ends at eight (Time). Answering “Tell me about the last dinner you hosted. Walk me through it, from the invitation to the moment the last person left.”

### Audio profile — the sound of the voice

```text
Female, mid-thirties. Middle pitch, bright and forward, an audible smile in the tone. Conversational level, narrow dynamic range, no projection at all. Relaxed consonants. Light stress on “polite” and on “promise”. One genuine stall mid-answer where she loses the thread and picks it up again.
```

### Scene

```text
Late Tuesday afternoon in a small open-plan office kitchen in the Loop. The kettle has just stopped; her laptop is shut. She has ten minutes before a call and is happy to fill them. The recorder sits on the table between you.
Close mic, small hard-surfaced room, a faint hum of an office beyond the door. No music.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Dana is explaining an everyday courtesy she has never once had to defend, and finds the question slightly funny because the answer has always been obvious to her. Explaining, never pitching. One continuous take, 20-35 seconds.
```

### Transcript

```text
Honestly? Putting the end time in the invite is the polite part. If I say six to eight, you know what you are agreeing to. You can say yes without wondering if you are trapped until midnight. My sister does open-ended parties and I love her, but I never know whether to eat first, or book a ride, or… [laughs] yeah. Six to eight is a promise I can actually keep.
```

### Portrait — `portraits/dinner-ends-at-eight-1.jpg`

```text
Candid documentary portrait photograph of a 34-year-old white American woman with shoulder-length dark blonde hair pushed behind one ear, light freckles, minimal makeup, wearing a plain merino crew-neck sweater with a work lanyard tucked into the collar. She is sitting at a small table in an open-plan office kitchen in downtown Chicago: pale cabinets, an electric kettle just off the boil, and a window behind her showing out-of-focus high-rise glass. Caught mid-conversation, half-smiling as though the question amused her. Late-afternoon daylight from the window, soft and slightly cool. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 2 · Mark — `dinner-ends-at-eight-2.mp3`

**Voice** Gacrux (Mature) · **Style** `Deadpan` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[sighs]` `[laughs]`

Scenario: The dinner that ends at eight (Time). Same question as Dana: “Tell me about the last dinner you hosted. Walk me through it, from the invitation to the moment the last person left.”

### Audio profile — the sound of the voice

```text
Male, late fifties. Lower middle pitch, dry and a little worn. Even and low throughout; he never lifts his voice. Every sentence finishes cleanly — a teacher’s habit. Warmth arrives only on “relieved”. A true pause before “Better to be honest at the start.”
```

### Scene

```text
A high-school staff room at four in the afternoon, emptied out. He is half marking papers and talking over the top of them, in no hurry at all.
Medium room, a little air in it. Distant hallway sounds, a door on a spring closing once.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Mark worked this out years ago and has made his peace with it. The joke is pointed at himself, never at his guests. He is not defending anything, only reporting what he settled on. One continuous take, 20-35 seconds.
```

### Transcript

```text
I get up at five to run, so by nine I am useless. [sighs] And look, if I do not say it out loud, I end up sitting there at eleven watching the clock, being a terrible host inside my own head. Better to be honest at the start. Nobody has ever taken it badly. [laughs] I think people are relieved, actually. They get their evening back too.
```

### Portrait — `portraits/dinner-ends-at-eight-2.jpg`

```text
Candid documentary portrait photograph of a 58-year-old white American man, grey hair cut short and receding, deep laugh lines, reading glasses pushed up onto his forehead, wearing a plaid button-down shirt with the sleeves rolled to the elbow. He is in a high-school staff room late in the afternoon: a laminate table, a stack of marked papers at his elbow, a corkboard of notices blurred behind him. Dry and faintly amused, caught mid-sentence. Overhead fluorescent light mixed with weak daylight from a side window. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 3 · Priya — `dinner-ends-at-eight-3.mp3`

**Voice** Autonoe (Bright) · **Style** `Empathetic` · **Pace** `Rapid Fire` · **Accent** `American (Gen)` · **Tags** `[sighs]`

Scenario: The dinner that ends at eight (Time). Same question as Dana: “Tell me about the last dinner you hosted. Walk me through it, from the invitation to the moment the last person left.”

### Audio profile — the sound of the voice

```text
Female, late twenties. Bright, middle-to-higher pitch, quick and light. Mid level. Softens right down on “It took me years here to stop feeling rude about it.” A real hesitation at the ellipsis while she hunts for the right word. No Indian accent at all.
```

### Scene

```text
A hospital break room between shifts. She is still in scrubs, sitting sideways on a plastic chair, working the idea out as she says it.
Small reflective room, fluorescent hum, a vending machine cycling somewhere behind her.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Priya is second-generation American, describing the moment she realised she was carrying two rulebooks. Real affection when Pune comes up. She is working the idea out as she speaks, not delivering a conclusion. One continuous take, 20-35 seconds.
```

### Transcript

```text
My parents are from Pune, so I grew up with the other way — people just stay, and staying is the whole point. It took me years here to stop feeling rude about it. [sighs] But my friends plan their week in blocks. Giving them a start and a finish is… it is respecting that their Saturday belongs to them, not to me. That is how they hear it.
```

### Portrait — `portraits/dinner-ends-at-eight-3.jpg`

```text
Candid documentary portrait photograph of a 27-year-old Indian-American woman, medium-brown skin, thick dark hair in a low bun with a few strands escaping, small gold stud earrings, wearing teal hospital scrubs with a photo ID badge clipped at the chest. She is in a hospital staff break room between shifts, sitting sideways on a moulded plastic chair; a vending machine and a noticeboard are out of focus behind her. Thinking mid-answer, looking slightly past the camera as she searches for the word. Flat overhead fluorescent light with a faint green cast. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 4 · Trevor — `splitting-the-bill-1.mp3`

**Voice** Puck (Upbeat) · **Style** `Vocal Smile` · **Pace** `Rapid Fire` · **Accent** `American (South)` · **Tags** `[laughs]` `[very slow]`

Scenario: Six friends, six payments (The Self). Answering “Think about the last time you ate out with friends. Take me through what happened when the bill came.”

### Audio profile — the sound of the voice

```text
Male, early twenties. Middle pitch, energetic, range moving around a lot. Drops to almost nothing on “even”, with one deliberate stall before it. Words tumble; consonants soften slightly at speed.
```

### Scene

```text
A campus courtyard in the late afternoon. He is eating while he talks and not entirely comfortable being asked about money.
Outdoors, open air, skateboards and voices crossing behind him. Slight wind on the mic.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Trevor is faintly embarrassed to be asked about money and gets firm the moment he reaches the real reason. He starts out talking about seven dollars and ends up talking about not owing anybody. One continuous take, 20-35 seconds.
```

### Transcript

```text
I mean, I am a student, so — I had the cheap pasta and a water. [laughs] If we divide by six I am paying for someone’s steak. But it is not only money. If Josh covers me, then next time I am the guy who owes Josh, and I would rather just be… [very slow] even. It takes two seconds on the app. Then we are done and nobody is keeping score.
```

### Portrait — `portraits/splitting-the-bill-1.jpg`

```text
Candid documentary portrait photograph of a 22-year-old white American man, tousled light-brown hair, patchy stubble, wearing a university hoodie over a t-shirt with a backpack strap over one shoulder. He is sitting on a low limestone wall in a university courtyard in Austin, Texas: live oaks and blurred students crossing behind him, a takeaway container beside him on the wall. Caught mid-sentence, a little sheepish, half-laughing. Warm late-afternoon Texas sun, slightly hazy. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 5 · Alicia — `splitting-the-bill-2.mp3`

**Voice** Kore (Firm) · **Style** `Empathetic` · **Pace** `Natural` · **Accent** `American (South)` · **Tags** `[laughs]` `[serious]`

Scenario: Six friends, six payments (The Self). Same question as Trevor: “Think about the last time you ate out with friends. Take me through what happened when the bill came.”

### Audio profile — the sound of the voice

```text
Female, early forties. Lower middle pitch, warm and steady. Real weight on “above or below” and on “the same”. A clear beat after “right?” No irritation anywhere in the tone.
```

### Scene

```text
Her own kitchen table in the early evening, a dishwasher running behind her. She is fond of her uncle and is about to disagree with him anyway.
Domestic room tone, soft. Dishwasher low in the background, one cupboard closing.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Alicia is fond of her uncle and disagrees with him anyway. She is explaining a principle she has already thought through, naming the thing underneath a small everyday transaction. One continuous take, 20-35 seconds.
```

### Transcript

```text
[laughs] My uncle would fight you for that bill. He would be genuinely offended. And I love him, but there is a thing underneath it, right? Every time he pays, he is a little bit above you. [serious] With my friends I do not want anyone above or below. We are the same. Splitting it keeps us the same. It is not about seven dollars.
```

### Portrait — `portraits/splitting-the-bill-2.jpg`

```text
Candid documentary portrait photograph of a 41-year-old Mexican-American woman, warm brown skin, dark wavy hair to her shoulders, small gold hoop earrings, wearing a soft cardigan over pale scrubs. She is sitting at her own kitchen table in the early evening: cabinets and a running dishwasher softly out of focus behind her, a glass of water near her hand. Warm but completely unbudging, looking directly at the camera as she makes her point. Kitchen downlight mixed with low blue window light. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 6 · Greg — `splitting-the-bill-3.mp3`

**Voice** Algenib (Gravelly) · **Style** `Deadpan` · **Pace** `The Drift` · **Accent** `American (Gen)` · **Tags** `[laughs]` `[serious]`

Scenario: Six friends, six payments (The Self). Same question as Trevor: “Think about the last time you ate out with friends. Take me through what happened when the bill came.”

### Audio profile — the sound of the voice

```text
Male, mid-thirties. Low pitch, gravelly, narrow range. No lift at the ends of sentences. Flat affect, minimal pitch variation, completely unhurried. The dryness is in the flatness, not in any emphasis.
```

### Scene

```text
A quiet corner of a brewery on a weekday afternoon. He means every word and is not performing any of it.
Larger room, low murmur, a glass set down once on wood.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Greg means every word and is performing none of it. For him an unreturned favour is an item on a list he has to carry. He is not joking, even where it is funny. One continuous take, 20-35 seconds.
```

### Transcript

```text
Someone paying for me makes me itchy, to be honest. [laughs] I feel like I have got homework. Now I owe you a dinner, and I have to remember it, and if I forget I am the bad friend. [serious] Just let me pay my part and go home clean. If I want to give you something I will give it to you as a gift, on purpose, not by accident over a table.
```

### Portrait — `portraits/splitting-the-bill-3.jpg`

```text
Candid documentary portrait photograph of a 36-year-old white American man, close-cropped receding hair, heavy stubble, plain dark t-shirt, a slightly weary set to the face. He is in a quiet corner of a brewery taproom on a weekday afternoon: a reclaimed-wood table, a half-finished glass of beer, warm blurred taproom and taps behind him. Completely deadpan, not smiling at all, looking straight into the lens. Low warm pendant light over the table. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 7 · Caleb — `disagreeing-in-the-meeting-1.mp3`

**Voice** Iapetus (Clear) · **Style** `Newscaster` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[serious]`

Scenario: The junior who said no (Truth). Answering “Tell me about a time you disagreed with your manager in front of other people. What happened afterwards?”

### Audio profile — the sound of the voice

```text
Male, late twenties. Clear middle pitch, clean articulation, even level. Crisp separation across the last two sentences. A short pause before “And it is not personal.” Mild Boston colouring — do not play the stereotype.
```

### Scene

```text
A glass meeting room ten minutes after the meeting broke up. He is explaining something he considers procedural, not brave.
Small glassy room, slightly live. Muffled office noise through the door.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Caleb treats raising an objection as part of the job description, not an act of courage. He is explaining something procedural to someone who found it surprising. One continuous take, 20-35 seconds.
```

### Transcript

```text
If I see the problem and I say nothing, and then it breaks in March — that is on me. Staying quiet is not polite, it is just… hiding. And it is not personal. I am not saying he is a bad director, I am saying the number on slide four is wrong. [serious] Those are two completely different sentences. He knows that.
```

### Portrait — `portraits/disagreeing-in-the-meeting-1.jpg`

```text
Candid documentary portrait photograph of a 29-year-old Black American man, short faded haircut, neat beard, dark-framed glasses, wearing a quarter-zip over a collared shirt. He is in a glass-walled meeting room in a Boston office ten minutes after the meeting broke up: a whiteboard with half-erased marks, a closed laptop on the table, open-plan desks blurred through the glass wall behind him. Direct and composed, mid-explanation, entirely unbothered. Cool even office lighting with daylight from a window on one side. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 8 · Nadia — `disagreeing-in-the-meeting-2.mp3`

**Voice** Schedar (Even) · **Style** `Newscaster` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[serious]`

Scenario: The junior who said no (Truth). Same question as Caleb: “Tell me about a time you disagreed with your manager in front of other people. What happened afterwards?”

### Audio profile — the sound of the voice

```text
Female, mid-forties. Even middle pitch, controlled, unhurried. Firms up on “The plan is a draft.” A beat after “flying blind”. Authoritative without pushing; no drama on any line.
```

### Scene

```text
Her own office with the door open, between meetings. She is the person who has to make the decision and she wants the objection.
Medium office, carpet. A keyboard somewhere outside, a phone ringing once and stopping.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Nadia is the person who has to make the decision, explaining why she pays people to argue with her. “Silence terrifies me” is a plain operational fact, not a confession. One continuous take, 20-35 seconds.
```

### Transcript

```text
From my side of the table? Silence terrifies me. If eight people nod at everything, I am flying blind. I need someone to hit the plan hard while it is still cheap to change. Tone matters, sure — do not perform, do not make a speech. [serious] But bring me the objection. The plan is not my child. The plan is a draft.
```

### Portrait — `portraits/disagreeing-in-the-meeting-2.jpg`

```text
Candid documentary portrait photograph of a 45-year-old Lebanese-American woman, olive skin, dark hair cut to the jaw with a few greys left visible, simple silver earrings, wearing a well-cut blazer over a plain top. She is in her own office with the door open, between meetings: a bookshelf and a framed print out of focus behind her, an open notebook in front of her. Calm, level and unhurried, looking straight at the camera. Warm desk lamp mixed with cool daylight from a window. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 9 · Wes — `disagreeing-in-the-meeting-3.mp3`

**Voice** Charon (Informative) · **Style** `Empathetic` · **Pace** `The Drift` · **Accent** `American (Gen)` · **Tags** `[sighs]` `[serious]`

Scenario: The junior who said no (Truth). Same question as Caleb: “Tell me about a time you disagreed with your manager in front of other people. What happened afterwards?”

### Audio profile — the sound of the voice

```text
Male, early fifties. Low pitch with gravel at the bottom of the range. Slow, with long pauses and a real one after “ran into the ground.” Sadness through the middle; warms noticeably on the last two sentences.
```

### Scene

```text
A loading-dock office at the end of a shift. He has seen the rule work and seen it fail.
Small room with a hard door, a radio low in the next room, occasional distant clatter.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Wes has seen the rule work and seen it fail. He gives the honest footnote rather than the ideal — first the workplace that broke it, then the way it is supposed to go. One continuous take, 20-35 seconds.
```

### Transcript

```text
I had one boss, years ago, who could not take it. You spoke up, you paid for it later. Everyone learned to shut up and the place ran into the ground. [sighs] So no, it is not automatic here either. But the way it is supposed to work is: best argument wins, and it does not matter who is holding it. [serious] Kid or vice-president.
```

### Portrait — `portraits/disagreeing-in-the-meeting-3.jpg`

```text
Candid documentary portrait photograph of a 52-year-old white American man with a weathered face, grey stubble and thinning hair, holding a plain cap in one hand, wearing a hi-vis vest over a flannel shirt. He is in a loading-dock office at the end of a shift: a battered metal desk, clipboards hanging on a hook, a roller door and stacked pallets blurred beyond the doorway. Tired but warm, remembering something that still bothers him. Late-day light through a dusty window plus a bare overhead bulb. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 10 · Dave — `the-boss-stacks-chairs-1.mp3`

**Voice** Zubenelgenubi (Casual) · **Style** `Vocal Smile` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[laughs]`

Scenario: The director stacking chairs (Authority). Answering “Think of a manager you genuinely respected. Tell me about something you actually saw them do.”

### Audio profile — the sound of the voice

```text
Male, late forties. Easy middle pitch, no projection whatsoever, faintly amused. The first line is thrown away rather than announced. A flash of amusement in the middle.
```

### Scene

```text
The office car park after the event, boxes going into the boot of a car, evening air.
Outdoors, open and quiet. A car door, a box set down on gravel.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Dave finds the question mildly funny because the answer is just the job. If any line sounds like a motto, it is wrong. One continuous take, 20-35 seconds.
```

### Transcript

```text
The title is a job, not a size. I do budgets and I take the blame — that is the job. [laughs] It does not mean my arms stopped working. And honestly, if I stand there watching a twenty-two-year-old carry boxes while I hold a coffee, what exactly have I taught her about this place? Whatever I do at six o’clock is the real policy.
```

### Portrait — `portraits/the-boss-stacks-chairs-1.jpg`

```text
Candid documentary portrait photograph of a 49-year-old white American man, greying sandy hair, a few days of stubble, wearing a shirt with the sleeves rolled up and no tie. He is standing in an office car park in the evening beside an open car boot loaded with folded chairs and cardboard boxes. Relaxed and faintly amused, caught mid-answer, plainly in the middle of carrying something. Low golden evening light from behind and to one side. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 11 · Kim — `the-boss-stacks-chairs-2.mp3`

**Voice** Leda (Youthful) · **Style** `Vocal Smile` · **Pace** `Rapid Fire` · **Accent** `American (Gen)` · **Tags** `[laughs]`

Scenario: The director stacking chairs (Authority). Same question as Dave: “Think of a manager you genuinely respected. Tell me about something you actually saw them do.”

### Audio profile — the sound of the voice

```text
Female, early twenties. Higher pitch, lively, wider range than the others. Fast and certain. Warm rather than sarcastic on the last sentence.
```

### Scene

```text
A coffee shop near the office the next morning. She is still slightly amazed by what she saw.
Busy café: espresso machine, cups, layered conversation. Keep her clear over the top of it.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Kim is still slightly amazed by what she saw, describing the exact moment her idea of respect got rearranged. One continuous take, 20-35 seconds.
```

### Transcript

```text
[laughs] I called him sir and he looked genuinely uncomfortable. Where I grew up you would never — but here, the ones who want the title are usually the ones who are bad at the job. The good ones just work next to you. I respect him way more for stacking chairs than I would if he had stood there being important.
```

### Portrait — `portraits/the-boss-stacks-chairs-2.jpg`

```text
Candid documentary portrait photograph of a 24-year-old Korean-American woman, straight black hair to her shoulders with a blunt fringe, light makeup, wearing a knitted jumper over a collared shirt. She is in a busy coffee shop the morning after an office event: an espresso machine and blurred customers behind her, a cup on the table in front of her. Bright and slightly incredulous, caught mid-sentence, half-laughing. Window daylight mixed with warm cafe lamps. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 12 · Roberto — `the-boss-stacks-chairs-3.mp3`

**Voice** Orus (Firm) · **Style** `Deadpan` · **Pace** `Staccato` · **Accent** `American (Gen)` · **Tags** `[serious]`

Scenario: The director stacking chairs (Authority). Same question as Dave: “Think of a manager you genuinely respected. Tell me about something you actually saw them do.”

### Audio profile — the sound of the voice

```text
Male, late thirties. Firm middle pitch, flat and steady. Short sentences with real full stops and genuine gaps between them. Light Mexican-American colouring, kept subtle.
```

### Scene

```text
The warehouse floor office with a fan running. He is describing how it actually works, not how it should work.
Industrial room tone, fan close by, a forklift reversing twice a long way off.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Roberto is describing how it actually works rather than how it should, stating the mechanism plainly: rank is rented, not owned. One continuous take, 20-35 seconds.
```

### Transcript

```text
I have got fourteen people under me and I still drive the forklift some days. You lose the floor fast if you stop touching it. Also — they will not follow you because of the badge. Not really. They follow you because they have seen you do the hard shift. That is where it comes from. [serious] You have to earn it again every year.
```

### Portrait — `portraits/the-boss-stacks-chairs-3.jpg`

```text
Candid documentary portrait photograph of a 38-year-old Mexican-American man, short dark hair, trimmed moustache, sun-weathered forearms, wearing a company polo shirt with an open hi-vis vest over it. He is in a warehouse floor office: a desk fan turning beside him, steel racking and a forklift blurred through the internal window behind him. Steady and matter-of-fact, no smile, looking directly at the camera. Harsh overhead warehouse light softened by dusty daylight from the window. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 13 · Professor Hale — `what-do-you-think-1.mp3`

**Voice** Sadaltager (Knowledgeable) · **Style** `Empathetic` · **Pace** `The Drift` · **Accent** `American (Gen)` · **Tags** `[very slow]`

Scenario: “What do you think?” (Opinion). Answering “When you ask a class “what do you think”, what are you hoping will happen in the next minute?”

### Audio profile — the sound of the voice

```text
Male, late fifties. Low-middle pitch, warm, unhurried, comfortable with silence. No emphasis hunting anywhere. A genuine pause before the final sentence.
```

### Scene

```text
His book-lined office in the late afternoon, a radiator ticking. He is entirely comfortable with silence and expects you to be too.
Soft furnished room, low reverb, radiator tick, a page turning once.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Hale is explaining why he grades students for speaking before they know the answer — thinking aloud at half speed for the interviewer’s benefit, not lecturing. One continuous take, 20-35 seconds.
```

### Transcript

```text
I am not testing whether they remember me. I can read them my own notes — that helps nobody. When a student says something half-formed out loud, that is the first time the thought exists anywhere. Sometimes it is wrong. Wrong is fine. Wrong is a thing we can work on together. [very slow] Silence I cannot work on.
```

### Portrait — `portraits/what-do-you-think-1.jpg`

```text
Candid documentary portrait photograph of a 57-year-old white American man, grey hair worn a little long, wire-rimmed glasses, wearing a corduroy jacket over a soft collared shirt. He is in a book-lined university office in the late afternoon: floor-to-ceiling shelves, a cast-iron radiator, loose papers on the desk in front of him. Thoughtful and mid-pause, entirely comfortable with the silence, looking slightly away from the camera. Warm low window light raking across the spines of the books. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 14 · Beth — `what-do-you-think-2.mp3`

**Voice** Achernar (Soft) · **Style** `Empathetic` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[laughs]` `[very slow]`

Scenario: “What do you think?” (Opinion). Same question as Professor Hale: “When you ask a class “what do you think”, what are you hoping will happen in the next minute?”

### Audio profile — the sound of the voice

```text
Female, twenty. Higher pitch, soft, close to the mic. Light and quick at the top, settling lower and closer by the end. Fast at first, slowing all the way through.
```

### Scene

```text
A library study room, very quiet. She is remembering being frightened and is slightly embarrassed about it.
Very quiet small room, almost dead. One chair creak.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Beth is remembering being frightened and is slightly embarrassed about it, describing the point at which a rule she had never questioned stopped applying. One continuous take, 20-35 seconds.
```

### Transcript

```text
The first week I was terrified. In high school I just wrote down whatever the teacher said. [laughs] Now I am supposed to argue with the book? But you figure out that they are not asking if you are right, they are asking if you have actually been thinking. And once you say it out loud, you find out whether you believe it. [very slow] That part is real.
```

### Portrait — `portraits/what-do-you-think-2.jpg`

```text
Candid documentary portrait photograph of a 20-year-old white American woman, light-brown hair in a messy half-up knot, no makeup, wearing an oversized university sweatshirt. She is in a small quiet library study room: a glass partition behind her, a laptop and a heavily highlighted book on the table. Quiet and sincere, a little self-conscious, looking just off camera. Even soft light from a window mixed with library fluorescents. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 15 · Tomás — `what-do-you-think-3.mp3`

**Voice** Algieba (Smooth) · **Style** `Empathetic` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[serious]`

Scenario: “What do you think?” (Opinion). Same question as Professor Hale: “When you ask a class “what do you think”, what are you hoping will happen in the next minute?”

### Audio profile — the sound of the voice

```text
Male, early thirties. Smooth lower-middle pitch, even and warm. Deliberate throughout; weight lands on the final sentence. Spanish colouring in the rhythm more than the vowels — fluent and light, never exaggerated.
```

### Scene

```text
An empty seminar room after class, chairs being stacked somewhere down the corridor. He is describing his own re-education without any bitterness.
Larger room, a little echo, distant stacking and a door.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Tomás was an excellent student of one system and arrived inside another having to learn to disagree. He describes his own re-education without any bitterness. One continuous take, 20-35 seconds.
```

### Transcript

```text
I came from a system where the professor spoke for ninety minutes and we copied it. I was a very good student. Then I got here and I could not do the one thing they wanted, which was to disagree with something. Now I teach it. I tell my students: your job is not to carry the knowledge. [serious] Your job is to test it and to own it.
```

### Portrait — `portraits/what-do-you-think-3.jpg`

```text
Candid documentary portrait photograph of a 31-year-old Colombian man, warm mid-brown skin, dark curly hair, close-trimmed beard, wearing a button-down shirt with the sleeves rolled and a canvas satchel strap across his chest. He is in an empty university seminar room after class: stacked chairs along one wall, a whiteboard with faint half-erased marks, tall windows along the side. Reflective and warm, caught mid-thought. Cool afternoon daylight through the tall windows. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 16 · Hank — `the-neighbours-tree-1.mp3`

**Voice** Umbriel (Easy-going) · **Style** `Vocal Smile` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[laughs]`

Scenario: The neighbour’s tree (Conflict). Answering “Tell me about the last small problem you had with a neighbour. What did you do first?”

### Audio profile — the sound of the voice

```text
Male, sixty-one. Relaxed and gravelly, lower-middle pitch. Storytelling rhythm, a gentle rise into the punchline and a clear beat before “four awkward years”.
```

### Scene

```text
His front porch, mid-morning. He has told this story before and enjoys telling it.
Outdoors under cover, birds, a lawnmower a few gardens away, a porch chair creaking.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Hank has told this story before and enjoys telling it. The arithmetic of it is the punchline and he knows it. One continuous take, 20-35 seconds.
```

### Transcript

```text
Say it in week one and it is a gutter. Sit on it for a year and it is not a gutter any more, it is a grudge, and now you are two men not waving. [laughs] I would rather have four awkward minutes than four awkward years. Anyway he did not know. Most of the time the guy has no idea there is a problem at all.
```

### Portrait — `portraits/the-neighbours-tree-1.jpg`

```text
Candid documentary portrait photograph of a 61-year-old white American man with a weather-lined face, white stubble and thick grey hair, wearing a fleece over a worn t-shirt. He is sitting in a chair on his own front porch mid-morning: a painted porch rail, a garden and a maple tree out of focus behind him, a mug resting on the arm of the chair. Amused and mid-story, on the edge of a laugh. Soft overcast Pacific Northwest morning light. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 17 · Michelle — `the-neighbours-tree-2.mp3`

**Voice** Despina (Smooth) · **Style** `Newscaster` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[serious]`

Scenario: The neighbour’s tree (Conflict). Same question as Hank: “Tell me about the last small problem you had with a neighbour. What did you do first?”

### Audio profile — the sound of the voice

```text
Female, mid-forties. Smooth middle pitch, level throughout, very clear. One small emphasis on “behind his back”. No heat at any point.
```

### Scene

```text
A home office in the middle of the afternoon, very quiet. She is correcting a misunderstanding, not defending herself.
Small carpeted room, soft and close. Almost no background.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Michelle is correcting a misunderstanding rather than defending herself, and inverting the rule: going round someone is the aggressive move, knocking is the polite one. One continuous take, 20-35 seconds.
```

### Transcript

```text
What I could not do is complain about him to the other neighbours first. [serious] That is behind his back — that is the version that actually damages people. Going to his door is the respectful one, even though it feels harder. You are treating him like an adult who can hear a normal sentence and fix a normal problem.
```

### Portrait — `portraits/the-neighbours-tree-2.jpg`

```text
Candid documentary portrait photograph of a 44-year-old white American woman, straight dark hair to her shoulders, understated glasses, wearing a plain jumper. She is in a small carpeted home office in the middle of the afternoon: a tidy desk, a filing shelf and a houseplant blurred behind her. Even, reasonable and quietly firm, looking directly at the camera with no heat in the expression at all. Soft north-facing window light. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## 18 · Ade — `the-neighbours-tree-3.mp3`

**Voice** Callirrhoe (Easy-going) · **Style** `Empathetic` · **Pace** `Natural` · **Accent** `American (Gen)` · **Tags** `[laughs]` `[serious]`

Scenario: The neighbour’s tree (Conflict). Same question as Hank: “Tell me about the last small problem you had with a neighbour. What did you do first?”

### Audio profile — the sound of the voice

```text
Male, early thirties. Warm middle pitch, open and unforced, steady. A small smile audible on the first sentence. Faint Nigerian-family inflection, very light — he grew up in the US.
```

### Scene

```text
A clinic treatment room between patients. He can see both systems from the inside and is not ranking them.
Small clinical room, paper on a treatment bed, a door closing softly down the hall.
```

### Sample context — what this recording is

```text
A spontaneous answer to a single question from an interviewer, recorded on the spot. Not narration, not an advertisement. Ade can see both systems from the inside and refuses to rank them. “Both work, honestly” must carry zero judgment — that line is the whole point of the interview. One continuous take, 20-35 seconds.
```

### Transcript

```text
[laughs] My mother is Nigerian and she would have sent food first, then mentioned it in three weeks. Both work, honestly. But here, if you go around the side, people get suspicious — what else is he not saying? Short and friendly and direct, and then it is closed. The problem was never about him. [serious] It was about a tree.
```

### Portrait — `portraits/the-neighbours-tree-3.jpg`

```text
Candid documentary portrait photograph of a 33-year-old Nigerian-American man, dark brown skin, short-cropped hair, neat beard, wearing a physiotherapist's polo shirt with a lanyard. He is in a small clinic treatment room between patients: a treatment bed with a paper cover, an anatomical poster out of focus on the wall behind him. Warm and open, with a small smile, entirely at ease. Clean clinical daylight from a side window. 50mm lens, f/2, shallow depth of field. Square 1:1 crop, head and shoulders, face centred and slightly above centre. Photorealistic, natural skin texture, unretouched. No text, no logos, no watermarks.
```


---

## Checklist

### Audio — done

All 18 recordings are generated, ambience-layered and live in `audio/`. The clean
exports are kept in `audio/_dry-originals/` — re-run `ambience/run.py` from those if a
bed ever needs re-balancing; never layer ambience onto a file twice.

- [x] `audio/dinner-ends-at-eight-1.mp3` — Dana (Aoede)
- [x] `audio/dinner-ends-at-eight-2.mp3` — Mark (Gacrux)
- [x] `audio/dinner-ends-at-eight-3.mp3` — Priya (Autonoe)
- [x] `audio/splitting-the-bill-1.mp3` — Trevor (Puck)
- [x] `audio/splitting-the-bill-2.mp3` — Alicia (Kore)
- [x] `audio/splitting-the-bill-3.mp3` — Greg (Algenib)
- [x] `audio/disagreeing-in-the-meeting-1.mp3` — Caleb (Iapetus)
- [x] `audio/disagreeing-in-the-meeting-2.mp3` — Nadia (Schedar)
- [x] `audio/disagreeing-in-the-meeting-3.mp3` — Wes (Charon)
- [x] `audio/the-boss-stacks-chairs-1.mp3` — Dave (Zubenelgenubi)
- [x] `audio/the-boss-stacks-chairs-2.mp3` — Kim (Leda)
- [x] `audio/the-boss-stacks-chairs-3.mp3` — Roberto (Orus)
- [x] `audio/what-do-you-think-1.mp3` — Professor Hale (Sadaltager)
- [x] `audio/what-do-you-think-2.mp3` — Beth (Achernar)
- [x] `audio/what-do-you-think-3.mp3` — Tomás (Algieba)
- [x] `audio/the-neighbours-tree-1.mp3` — Hank (Umbriel)
- [x] `audio/the-neighbours-tree-2.mp3` — Michelle (Despina)
- [x] `audio/the-neighbours-tree-3.mp3` — Ade (Callirrhoe)

### Portraits — done

All eighteen are generated and cropped into `portraits/`. `portraits/README.md` has the
crop recipe if any of them is ever regenerated.

- [x] `portraits/dinner-ends-at-eight-1.jpg` — Dana (Aoede)
- [x] `portraits/dinner-ends-at-eight-2.jpg` — Mark (Gacrux)
- [x] `portraits/dinner-ends-at-eight-3.jpg` — Priya (Autonoe)
- [x] `portraits/splitting-the-bill-1.jpg` — Trevor (Puck)
- [x] `portraits/splitting-the-bill-2.jpg` — Alicia (Kore)
- [x] `portraits/splitting-the-bill-3.jpg` — Greg (Algenib)
- [x] `portraits/disagreeing-in-the-meeting-1.jpg` — Caleb (Iapetus)
- [x] `portraits/disagreeing-in-the-meeting-2.jpg` — Nadia (Schedar)
- [x] `portraits/disagreeing-in-the-meeting-3.jpg` — Wes (Charon)
- [x] `portraits/the-boss-stacks-chairs-1.jpg` — Dave (Zubenelgenubi)
- [x] `portraits/the-boss-stacks-chairs-2.jpg` — Kim (Leda)
- [x] `portraits/the-boss-stacks-chairs-3.jpg` — Roberto (Orus)
- [x] `portraits/what-do-you-think-1.jpg` — Professor Hale (Sadaltager)
- [x] `portraits/what-do-you-think-2.jpg` — Beth (Achernar)
- [x] `portraits/what-do-you-think-3.jpg` — Tomás (Algieba)
- [x] `portraits/the-neighbours-tree-1.jpg` — Hank (Umbriel)
- [x] `portraits/the-neighbours-tree-2.jpg` — Michelle (Despina)
- [x] `portraits/the-neighbours-tree-3.jpg` — Ade (Callirrhoe)
