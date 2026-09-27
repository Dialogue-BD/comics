# Culture Circles — Scene Comic Assets

**Dialogue · Professional Skills Development Center, Rajshahi**
For `dialogue-bd.com/ethnographic-interviews/` — the Watch step (step 1).

Generated from `ethnographic-interviews/scenes.js` by `tools/gen-scene-assets.js`.
**Do not edit transcripts here.** Change the line in `scenes.js` and regenerate —
the page's karaoke and word help read the same file, and a one-word drift
breaks them silently.

| | |
|---|---|
| Scenes | 10 |
| Audio | **67 takes** — 34 dialogue takes (both characters in one call) and 33 narration takes — assembled into **10 scene files**. 117 lines, 1300 words, about 10 minutes in total |
| Voices | 21, all prebuilt Gemini voices — 1 narrator (the same in every scene) + 20 characters |
| Comic panels | **60 images** — six square panels per scene |
| Portraits | **20 images** — one per character (the narrator has none) |

---

## What this is for

Each scenario opens with a short story told as a **wordless comic** with a
**narrator** and **two voiced characters**. Students hear it three times:

1. **Just listen** — the comic turns its own pages with the audio. Nothing to read; a face in the corner shows who is talking.
2. **Read along** — the same, with the line being spoken lit up word by word (karaoke).
3. **Explore the words** — the whole conversation as a chat, every glossed word tappable for its meaning, and any line playable on its own.

**The audio is one file per scene**, recorded as takes:

- **Dialogue takes** — every run of character lines in one room is **one conversational-mode call with both characters**, so they actually play off each other: the reactions, the interruptions, the timing of a reply. This is where the performance lives; never split a dialogue take into single lines.
- **Narration takes** — the narrator's lines between them, recorded on their own. The narrator is voice-over, outside the story, as in radio drama. (Conversational mode takes at most two speakers, so this split is also what the API allows.)

`tools/assemble_scenes.py` joins the takes into `scene/<id>.mp3`, and
`tools/align_scenes.py` times every word. The page reads the line boundaries
from those timings — it turns the panel as a line starts, seeks to a line when a
student replays it, and lights up each word.

The listeners are Bangladeshi B1 students. Every take must be **clear, natural
and a little slower than native speed** — acted, but never theatrical. The comic
must tell the story with the sound off.

## Filenames

```
ethnographic-interviews/scene/_dry-originals/<scenario-id>-sNN.wav   the takes, untouched (sNN = s01, s02 … — the tables below)
ethnographic-interviews/scene/<scenario-id>.mp3                      the assembled scene (written by assemble_scenes.py)
ethnographic-interviews/scene/_build/<scenario-id>.json             where each take sits in the scene (written by assemble_scenes.py)
ethnographic-interviews/scene-timings.js                            word timings (written by align_scenes.py)
ethnographic-interviews/scene/panels/<scenario-id>-<n>.webp          n = 1–6, 720x720, quality 72
ethnographic-interviews/scene/panels/<scenario-id>-<n>.jpg           the same, JPEG quality 82 (fallback)
ethnographic-interviews/scene/panels/_originals/<id>-<n>.png         full-size originals from the image model
ethnographic-interviews/scene/cast/<slug>.jpg                        384x384, JPEG quality 84
ethnographic-interviews/scene/cast/_originals/<slug>.png             full-size originals
```

The page already runs without any of these (browser speech, the old strip
pictures and initials stand in), so scenes can land one at a time.

## Order of work

1. **Draw the panels, one scene at a time** — panel 1 first, then 2–6 with panel 1 attached for continuity.
2. **Draw the portraits** from each scene's panel 1, so the face matches the comic.
3. **Record the takes**, one scene at a time. Record the dinner scene first and listen to it end to end — especially Tania's accent — before doing the rest.
4. **Assemble, then align**: `python3 tools/assemble_scenes.py` then `python3 tools/align_scenes.py`.

---

## Audio

### Model and calls

- **Model:** `gemini-3.8-flash-tts` for keeper takes; `gemini-3.8-flash-lite-tts` is fine for a first draft pass. Check the current model names and call shape before running — the TTS API has changed across model generations.
- **Dialogue takes:** one Interactions API call per take with `speech_config.mode = "conversational"` and both characters as `speakers`. Each line is its own content item carrying a `speech_metadata` annotation with its `speaker` and `style`. Configure both speakers even when only one of them talks in a take.
- **Narration takes:** one single-speaker call per take, the narrator's voice (Sulafat), the take's lines as one transcript.
- **Voices:** all prebuilt — no designed or cloned voices — so every dialogue take can be a conversational call.
- **Output:** a unary call returns a complete WAV (24 kHz mono 16-bit). Save it untouched to `scene/_dry-originals/<id>-sNN.wav`. Do not trim, level or edit the takes — the assembler does that, and the aligner needs the originals.
- **Length:** takes run from about 2 to 25 seconds; a whole scene is 45–90 seconds.

### How the fields divide

Each character has an **audio profile** (the sound of the voice only), each place
has a **scene** (the room, with its room tone on the last line), each take has a
**sample context** (what this exchange is), and each line has a **style** (the
delivery of that one line). They do different jobs — never repeat one inside
another, or the read goes flat.

- In the **AI Studio speech playground** (multi-speaker): paste the room into *Scene*, the take's sample context into *Sample context*, each character's audio profile against their speaker, and the turns into the transcript with each turn's style.
- Through the **API**: the prebuilt voice carries the profile — choose it by auditioning against the profile — and each turn's `speech_metadata.style` carries its delivery. The script below does this.

**Transcripts are verbatim.** Every word is read exactly as written. Never add
stage directions to the text; delivery goes in the style.

**Audio tags** such as `<laugh>` or `<sigh>` sit inside a few lines, in angle
brackets. They are performed, not read. If a tag is **spoken aloud**, delete it and
re-run — the words either side already carry the moment. If it makes the delivery
**too big**, cut it. The page strips tags from the transcript students see.

### The narrator — one voice for all 10 scenes

**Voice:** the prebuilt **Sulafat (Warm)** for every narration take. No character uses it.

**Audio profile**

```text
A warm, calm woman in her forties reading a picture book to adult learners of
English. Neutral general American accent. Clear, unhurried and kind; slightly
slower than normal speech, with a small natural pause at every full stop.
Friendly but never childish or sing-song. Every consonant clear.
```

**Style for every narration take:** `calm, warm storytelling for learners, slow and very clear, a small pause at every full stop`

**Sample context for every narration take:**

```text
Voice-over narration for a wordless picture-book comic, heard by Bangladeshi
students learning English at B1 level. The narrator is outside the story,
setting each picture simply and warmly. Not an advertisement, not a
documentary. Read slowly enough that a learner can follow every word.
```

Narration takes get **no room tone** — they are voice-over, dry and close.

### Accents

Six characters are Bangladeshi students or young professionals in the US:
**Tania** (The Dinner That Ends at Eight), **Nusrat** (Six Friends, Six Payments), **Tanvir** (The Director Stacking Chairs), **Farhana** (“What Do You Think?”), **Arif** (Tell Them What You Did), **Imran** (Leave the Snake Alone).
Students should hear an accent they recognise from home, speaking good, clear
English.

Each of them has a prebuilt voice and an **accent note** — a short inflection
description (a softly tapped r, dental t and d, even syllable timing, and one
habit of their own). The note is added to the style of **every** line they speak,
after that line's delivery, so it stays the same across all of their takes. The
takes below and the script already include it.

Audition the first take of each of these characters. The accent should be
**light and natural** — a real person, not an impression. If it comes out too
strong, add *"very light, subtle"* to the start of that character's note (in
`scenes.js`, then regenerate) rather than removing it. If it disappears
entirely, run the take again before changing anything — the model varies from
take to take.

### Returning characters

Four characters also appear in the scenario's interviews in step 3:
**Dave** (`audio/the-boss-stacks-chairs-1.mp3`), **Hannah** (`audio/honestly-im-annoyed-1.mp3`), **Ethan** (`audio/honestly-im-annoyed-2.mp3`), **Kathy** (`audio/leave-the-snake-alone-1.mp3`).
Use **the same voice as their interview take**, so students hear the same person.
Dave's interview used **Zubenelgenubi**. For the other three, check the voice used
for their interview recording; the voice listed here is a best guess and should be
swapped if it does not match.

### Cast

| Portrait | Character | Scene | Voice | Audio profile | Accent note |
|---|---|---|---|---|---|
| — | **Narrator** | all | Sulafat (Warm) | see above | — |
| `tania.jpg` | **Tania**, 26 | The Dinner That Ends at Eight | Autonoe (Bright) | Young woman in her mid-twenties, warm clear mid-range voice, careful and slightly formal English with a soft Bangladeshi accent. Polite, rises a little at the ends of questions, stresses the key word gently rather than loudly. | light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements |
| `jeff.jpg` | **Jeff**, 42 | The Dinner That Ends at Eight | Achird (Friendly) | Warm, easy baritone, general American. Talks quickly and brightly, lots of energy in the first word of a sentence, relaxed and sure of himself. | — |
| `nusrat.jpg` | **Nusrat**, 22 | Six Friends, Six Payments | Leda (Youthful) | Young woman, bright mid-range voice with a clear Bangladeshi accent. Quick and warm, laughs easily, lifts her pitch when she is being generous. | light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels |
| `jake.jpg` | **Jake**, 23 | Six Friends, Six Payments | Fenrir (Excitable) | Young man, bright and bouncy tenor, general American with a light Texan ease. Speaks fast, smiles through his words, drops his voice when he reassures. | — |
| `richard.jpg` | **Richard**, 56 | The Junior Who Said No | Alnilam (Firm) | Man in his fifties, low steady baritone, general American. Measured and unhurried, slight pause before important words, sounds in charge without being cold. | — |
| `ryan.jpg` | **Ryan**, 26 | The Junior Who Said No | Algieba (Smooth) | Young man, smooth mid-range voice, general American. Clear and polite, speaks with calm confidence, counts his points with a small lift on each number. | — |
| `tanvir.jpg` | **Tanvir**, 23 | The Director Stacking Chairs | Umbriel (Easy-going) | Young man, earnest light baritone with a Bangladeshi accent. Respectful, a little breathless when nervous, softens the ends of his sentences. | light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w |
| `dave.jpg` | **Dave**, 49 | The Director Stacking Chairs | Zubenelgenubi (Casual) | Man in his late forties, relaxed and casual mid-baritone, general American. Laughs easily, never sounds like a boss, a friendly lift at the end of short phrases. | — |
| `farhana.jpg` | **Farhana**, 20 | “What Do You Think?” | Achernar (Soft) | Young woman, soft and slightly breathy voice with a Bangladeshi accent. Quiet, hesitates before she starts, grows steadier as she goes. | light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress |
| `novak.jpg` | **Dr. Novak**, 54 | “What Do You Think?” | Rasalgethi (Informative) | Man in his fifties, warm and informative baritone, general American. Patient, lets silences sit, rises with real curiosity when a student speaks. | — |
| `bill.jpg` | **Bill**, 58 | The Neighbour’s Tree | Algenib (Gravelly) | Man in his late fifties, gravelly low voice, general American. Plain-spoken and a bit gruff, then friendly; short phrases, a smile you can hear when he relaxes. | — |
| `mike.jpg` | **Mike**, 47 | The Neighbour’s Tree | Sadachbia (Lively) | Man in his forties, lively warm tenor, general American. Open and easy, quick to agree, a friendly bounce in his rhythm. | — |
| `brad.jpg` | **Brad**, 41 | Back of the Line | Orus (Firm) | Man in his early forties, firm quick baritone, general American. Brisk and a little impatient, polite words said fast, voice drops flat when he is let down. | — |
| `carla.jpg` | **Carla**, 45 | Back of the Line | Pulcherrima (Forward) | Woman in her forties, clear forward alto, general American. Warm and smiling, completely steady; friendly tone, firm words, never raises her voice. | — |
| `arif.jpg` | **Arif**, 22 | Tell Them What You Did | Iapetus (Clear) | Young man, gentle and modest light baritone with a Bangladeshi accent. Speaks softly, lets his voice fall at the end of sentences, downplays everything. | light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end |
| `tyler.jpg` | **Tyler**, 22 | Tell Them What You Did | Puck (Upbeat) | Young man, upbeat and bright tenor, general American. Confident and fluent, strong stress on numbers and on "I", sounds pleased with himself in a friendly way. | — |
| `hannah.jpg` | **Hannah**, 23 | Honestly, I’m Annoyed | Kore (Firm) | Young woman, firm clear alto, general American. Calm and direct even when upset, no shouting; warmth comes back fast into her voice once it is said. | — |
| `ethan.jpg` | **Ethan**, 22 | Honestly, I’m Annoyed | Zephyr (Bright) | Young man, bright light tenor, general American. Cheerful and quick, drops into a sincere lower tone when he apologises, laughs easily. | — |
| `imran.jpg` | **Imran**, 21 | Leave the Snake Alone | Enceladus (Breathy) | Young man, energetic mid-range voice with a Bangladeshi accent. Loud and fast when alarmed, rising pitch on questions, curious and thoughtful when calm. | light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply |
| `kathy.jpg` | **Kathy**, 48 | Leave the Snake Alone | Aoede (Breezy) | Woman in her late forties, breezy warm alto with a soft Southern ease. Unhurried, amused, gently firm; fond when she talks about animals. | — |

---

## Pictures

### The style block

**Paste this at the top of every panel prompt and every portrait prompt, unchanged.**
It is the style of the existing three-panel strips on the page, and the casts
below follow the people already drawn in those strips, so old and new pictures
sit together.

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.
```

### Rules

- **No words anywhere.** Not in signs, screens, papers or speech balloons. Digits on real objects (a clock, a phone screen, a receipt, a chart label like 20%) are fine — models draw digits well and they read the same in Bangla.
- **Square, at least 1024×1024.** Save the original PNG to `_originals/`, then export:
  ```
  magick <id>-<n>.png -resize 720x720 -quality 72 <id>-<n>.webp
  magick <id>-<n>.png -resize 720x720 -quality 82 <id>-<n>.jpg
  ```
- **Continuity is everything.** Draw panel 1 first — attach the scenario's existing strip panel `strip/<id>-1.png` (or `strip/_originals/`) as a reference for the people, setting and style. For panels 2–6, attach panel 1 and begin the prompt with: *"Same characters, same clothing, same art style and palette as the attached image. Continue the sequence."* If a face or an outfit drifts, regenerate that panel. A student tracking "the same man" across six pictures is doing half the comprehension work.
- **Returning characters** (Dave, Hannah, Ethan, Kathy): also attach their existing portrait from `portraits/` so they look like the person in the interview.
- **Readable at 300px.** One clear action per panel, the speaker's face visible, nothing important in the bottom-left corner (the page puts the speaker's face there).

### Portraits

Draw each portrait **after** its scene's panels, attaching panel 1 so the face,
hair and clothes match. One prompt per character, in each scene section below.
Crop to a square with the face about 60% of the height, resize to 384×384, JPEG
quality 84.

---

## 1 · The Dinner That Ends at Eight  —  Time

**Setting:** Chicago · a colleague invites you home

**What happens (the scenario, as the page tells it):** Your American colleague invites you to dinner. The message says: “Come at six — I’ll have to push everyone out by eight, I’ve got an early start.” At 8:05 he stands up, thanks everyone, and walks his guests to the door. Everybody smiles. Nobody looks hurt.

**Cast:** **Tania**, 26, an accountant from Rajshahi, three weeks into her first job in Chicago; **Jeff**, 42, Tania's colleague, the host.

### Rooms (the *Scene* field)

**sofa** — panels 1

```text
Tania's small apartment in Chicago on a weekday evening, sunset through the window.
Room tone: quiet room air, faint traffic through a closed window. Jeff's lines are a voice message played from her phone.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `rumble -44 dB` · `presence -52 dB`

**home** — panels 2, 3, 4, 5

```text
A warm apartment in a Chicago neighbourhood on a Saturday evening, six people around a dining table.
Room tone: small-room warmth, cutlery on plates, low friendly chatter of four other guests under the speakers.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `babble -34 dB` · `dish -40 dB`

**street** — panels 6

```text
A quiet residential street in Chicago just after eight in the evening.
Room tone: light traffic two streets away, a gentle breeze, one car door far off.
```

Room tone the assembler lays under dialogue in this room: `wind -40 dB` · `rumble -42 dB` · `air -44 dB`

### Tania — speaker `Tania` · `scene/cast/tania.jpg`

**Voice** Autonoe (Bright)

**Accent note** (added to the style of every Tania line): `light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements`

**Audio profile**

```text
Young woman in her mid-twenties, warm clear mid-range voice, careful and slightly formal English with a soft Bangladeshi accent. Polite, rises a little at the ends of questions, stresses the key word gently rather than loudly.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Tania is an accountant from Rajshahi, three weeks into her first job in Chicago. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Jeff — speaker `Jeff` · `scene/cast/jeff.jpg`

**Voice** Achird (Friendly)

**Audio profile**

```text
Warm, easy baritone, general American. Talks quickly and brightly, lots of energy in the first word of a sentence, relaxed and sure of himself.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip). Jeff is Tania's colleague, the host. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).

**Panel 1** — `scene/panels/dinner-ends-at-eight-1.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-1`

*Heard over this panel:* Narrator: “This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago.” / Narrator: “One evening, her phone buzzes. It's a voice message from Jeff, a colleague.” / Jeff: “Hi, Tania, it's Jeff! A few of us are having dinner at my place on Saturday. Want to come?” / Jeff: “Come at six. I'll have to push everyone out by eight, though. I've got an early start on Sunday.” / Tania: “Push everyone out by eight? Oh... okay.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
Evening in a small apartment. Tania sits on her sofa, holding her phone to her ear, listening to a voice message. On the phone screen: an envelope icon and a small clock showing 6:00–8:00. She looks surprised and pleased.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/dinner-ends-at-eight-2.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-2`

*Heard over this panel:* Narrator: “On Saturday, Tania arrives at six o'clock exactly. She brings a box of sweets.” / Jeff: “Tania! Come in, come in. Oh, wow, are these for us? Thank you!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
An apartment door opening. Tania on the doormat holding a wrapped box of sweets with both hands. Jeff opens the door, delighted. A wall clock just inside reads 6:00.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/dinner-ends-at-eight-3.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-2`

*Heard over this panel:* Narrator: “The food is good. Everybody talks and laughs. Tania is having a great time.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
Dinner table at an angle. Six people eating and laughing, plates of food, candles, glasses. Tania relaxed in the middle of it, mid-laugh.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/dinner-ends-at-eight-4.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-2`

*Heard over this panel:* Narrator: “Then, at five past eight, Jeff stands up.” / Jeff: “Okay, everyone, that's eight o'clock! Thank you so much for coming. This was really fun.” / Tania: “Oh... is it finished already?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
The wall clock reads 8:05. Jeff stands up at the table, one hand raised as if thanking everyone. Tania, still seated, is caught mid-bite, eyebrows up in surprise.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/dinner-ends-at-eight-5.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-3`

*Heard over this panel:* Jeff: “Tania, thanks for the sweets. See you on Monday!” / Narrator: “Everybody smiles. Everybody says goodbye. Nobody looks hurt.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
At the front door. Guests putting on coats, smiling, waving. Jeff shakes hands warmly with a departing guest. Everyone looks happy.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/dinner-ends-at-eight-6.webp` · stand-in until drawn: `strip/dinner-ends-at-eight-3`

*Heard over this panel:* Narrator: “Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started.” / Tania: “Eight o'clock... and nobody was upset?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Tania: Bangladeshi woman, 26, shoulder-length dark wavy hair, small gold hoop earrings, forest-green sweater (as in the existing strip). Jeff: white American man, 42, curly brown hair, short beard, forest-green crew-neck sweater, dark trousers (as in the existing strip).
Night street outside the building. The other guests walk away cheerfully. Tania stands alone under a streetlamp holding the empty sweet box, looking at her wristwatch, puzzled but half-smiling.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Tania` (Autonoe) and `Jeff` (Achird).

**`dinner-ends-at-eight-s01`** · narration · panel 1 · Sulafat

```text
This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago. One evening, her phone buzzes. It's a voice message from Jeff, a colleague.
```

**`dinner-ends-at-eight-s02`** · dialogue · room **sofa** · panel 1

*Sample context:* A short, natural exchange between Tania and Jeff. Tania is an accountant from Rajshahi, three weeks into her first job in Chicago; Jeff is Tania's colleague, the host. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Jeff | friendly and casual, a recorded voice message, a little rushed | Hi, Tania, it's Jeff! A few of us are having dinner at my place on Saturday. Want to come? |
| Jeff | cheerful and matter-of-fact, as if saying something completely normal | Come at six. I'll have to push everyone out by eight, though. I've got an early start on Sunday. |
| Tania | surprised, quietly repeating it to herself; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements | Push everyone out by eight? Oh... okay. |

**`dinner-ends-at-eight-s03`** · narration · panel 2 · Sulafat

```text
On Saturday, Tania arrives at six o'clock exactly. She brings a box of sweets.
```

**`dinner-ends-at-eight-s04`** · dialogue · room **home** · panel 2

*Sample context:* Jeff speaking to Tania. Tania is an accountant from Rajshahi, three weeks into her first job in Chicago; Jeff is Tania's colleague, the host. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Jeff | delighted and welcoming | Tania! Come in, come in. Oh, wow, are these for us? Thank you! |

**`dinner-ends-at-eight-s05`** · narration · panels 3, 4 · Sulafat

```text
The food is good. Everybody talks and laughs. Tania is having a great time. Then, at five past eight, Jeff stands up.
```

**`dinner-ends-at-eight-s06`** · dialogue · room **home** · panels 4, 5

*Sample context:* A short, natural exchange between Tania and Jeff. Tania is an accountant from Rajshahi, three weeks into her first job in Chicago; Jeff is Tania's colleague, the host. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Jeff | bright and grateful, raising his voice a little over the table | Okay, everyone, that's eight o'clock! Thank you so much for coming. This was really fun. |
| Tania | quiet, surprised, half to herself; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements | Oh... is it finished already? |
| Jeff | warm, a friendly goodbye | Tania, thanks for the sweets. See you on Monday! |

**`dinner-ends-at-eight-s07`** · narration · panels 5, 6 · Sulafat

```text
Everybody smiles. Everybody says goodbye. Nobody looks hurt. Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started.
```

**`dinner-ends-at-eight-s08`** · dialogue · room **street** · panel 6

*Sample context:* Tania speaking to Jeff. Tania is an accountant from Rajshahi, three weeks into her first job in Chicago; Jeff is Tania's colleague, the host. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Tania | puzzled, thinking aloud, slow; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements | Eight o'clock... and nobody was upset? |

---

## 2 · Six Friends, Six Payments  —  The Self

**Setting:** Austin, Texas · the end of a meal

**What happens (the scenario, as the page tells it):** Six American friends finish dinner. One bill arrives. Every person takes out a phone, works out what they ate, and pays their own share — including the man who suggested the restaurant in the first place. There is no argument about who pays. There is no reaching for the bill at all.

**Cast:** **Nusrat**, 22, an exchange student from Dhaka in her first term in Austin; **Jake**, 23, her classmate, who chose the restaurant.

### Rooms (the *Scene* field)

**restaurant** — panels 1, 2, 3, 4, 5

```text
A cosy, busy restaurant in Austin, Texas, on a Friday night. Six students at a round wooden table with candles.
Room tone: lively restaurant hum, plates and cutlery, soft background music too low to make out.
```

Room tone the assembler lays under dialogue in this room: `babble -30 dB` · `dish -36 dB` · `clatter -40 dB` · `air -42 dB`

**street** — panels 6

```text
The pavement outside the restaurant, warm night air.
Room tone: light traffic, distant music from a bar, footsteps.
```

Room tone the assembler lays under dialogue in this room: `wind -40 dB` · `rumble -42 dB` · `air -44 dB`

### Nusrat — speaker `Nusrat` · `scene/cast/nusrat.jpg`

**Voice** Leda (Youthful)

**Accent note** (added to the style of every Nusrat line): `light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels`

**Audio profile**

```text
Young woman, bright mid-range voice with a clear Bangladeshi accent. Quick and warm, laughs easily, lifts her pitch when she is being generous.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Nusrat is an exchange student from Dhaka in her first term in Austin. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Jake — speaker `Jake` · `scene/cast/jake.jpg`

**Voice** Fenrir (Excitable)

**Audio profile**

```text
Young man, bright and bouncy tenor, general American with a light Texan ease. Speaks fast, smiles through his words, drops his voice when he reassures.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip). Jake is her classmate, who chose the restaurant. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).

**Panel 1** — `scene/panels/splitting-the-bill-1.webp` · stand-in until drawn: `strip/splitting-the-bill-1`

*Heard over this panel:* Narrator: “Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class.” / Jake: “Didn't I tell you? Best tacos in Austin. I found this place last year.” / Nusrat: “You were right, Jake. It was delicious.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
A cosy restaurant. Six young friends at a round table with candles and nearly empty plates of tacos. Jake at the end gestures proudly at the food. Nusrat, beside him, gives a thumbs-up, smiling.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/splitting-the-bill-2.webp` · stand-in until drawn: `strip/splitting-the-bill-1`

*Heard over this panel:* Narrator: “Then the waiter brings the bill. Just one bill, for six people.” / Nusrat: “So, Jake... this was your idea. Are you paying tonight?” / Jake: “Me? No way! We'll just split it. Everybody pays for what they had.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
A waiter places a single bill in a small folder in the middle of the table. Nusrat looks at Jake expectantly, eyebrows raised, half-teasing.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/splitting-the-bill-3.webp` · stand-in until drawn: `strip/splitting-the-bill-2`

*Heard over this panel:* Narrator: “Everybody takes out their phone. They look at the bill and do some math.” / Jake: “Okay, I had the fish tacos and a soda. That's fourteen fifty, plus the tip.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
Everyone at the table has a phone out, looking at the bill and tapping calculators. One phone screen shows 14.50.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/splitting-the-bill-4.webp` · stand-in until drawn: `strip/splitting-the-bill-2`

*Heard over this panel:* Nusrat: “Wait, wait. Please, let me pay for everyone. It's no problem!” / Jake: “That's really nice, Nusrat, but no. Just pay for yours. Really, it's fine.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
Nusrat reaches into her handbag for her purse, leaning forward to offer to pay for everyone. Jake laughs and shakes his head, one palm raised: no.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/splitting-the-bill-5.webp` · stand-in until drawn: `strip/splitting-the-bill-3`

*Heard over this panel:* Narrator: “One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
A card machine passes from hand to hand around the table. Each friend taps their own card or phone. Calm and friendly.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/splitting-the-bill-6.webp` · stand-in until drawn: `strip/splitting-the-bill-3`

*Heard over this panel:* Narrator: “Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun.” / Nusrat: “Nobody even tried to pay for me...”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Nusrat: Bangladeshi woman, 22, long dark wavy hair, maroon top, small gold earrings (as in the existing strip). Jake: white American man, 23, curly brown hair, easy grin, forest-green sweater (as in the existing strip).
Outside the restaurant at night. The friends walk off chatting. Nusrat stops under a lamp and looks at her small paper receipt, amused and puzzled.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Nusrat` (Leda) and `Jake` (Fenrir).

**`splitting-the-bill-s01`** · narration · panel 1 · Sulafat

```text
Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class.
```

**`splitting-the-bill-s02`** · dialogue · room **restaurant** · panel 1

*Sample context:* A short, natural exchange between Nusrat and Jake. Nusrat is an exchange student from Dhaka in her first term in Austin; Jake is her classmate, who chose the restaurant. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Jake | proud and playful | Didn't I tell you? Best tacos in Austin. I found this place last year. |
| Nusrat | happy, full, warm; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels | You were right, Jake. It was delicious. |

**`splitting-the-bill-s03`** · narration · panel 2 · Sulafat

```text
Then the waiter brings the bill. Just one bill, for six people.
```

**`splitting-the-bill-s04`** · dialogue · room **restaurant** · panel 2

*Sample context:* A short, natural exchange between Nusrat and Jake. Nusrat is an exchange student from Dhaka in her first term in Austin; Jake is her classmate, who chose the restaurant. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Nusrat | teasing lightly, but half serious; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels | So, Jake... this was your idea. Are you paying tonight? |
| Jake | amused and relaxed | &lt;laugh&gt; Me? No way! We'll just split it. Everybody pays for what they had. |

**`splitting-the-bill-s05`** · narration · panel 3 · Sulafat

```text
Everybody takes out their phone. They look at the bill and do some math.
```

**`splitting-the-bill-s06`** · dialogue · room **restaurant** · panels 3, 4

*Sample context:* A short, natural exchange between Nusrat and Jake. Nusrat is an exchange student from Dhaka in her first term in Austin; Jake is her classmate, who chose the restaurant. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Jake | reading numbers off his phone, easy-going | Okay, I had the fish tacos and a soda. That's fourteen fifty, plus the tip. |
| Nusrat | generous and a little urgent; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels | Wait, wait. Please, let me pay for everyone. It's no problem! |
| Jake | gentle and friendly, completely sure | That's really nice, Nusrat, but no. Just pay for yours. Really, it's fine. |

**`splitting-the-bill-s07`** · narration · panels 5, 6 · Sulafat

```text
One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill. Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun.
```

**`splitting-the-bill-s08`** · dialogue · room **street** · panel 6

*Sample context:* Nusrat speaking to Jake. Nusrat is an exchange student from Dhaka in her first term in Austin; Jake is her classmate, who chose the restaurant. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Nusrat | amused and puzzled, softly; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels | Nobody even tried to pay for me... |

---

## 3 · The Junior Who Said No  —  Truth

**Setting:** Boston · a Monday planning meeting

**What happens (the scenario, as the page tells it):** The director finishes presenting his plan. A twenty-six-year-old employee, two years in the job, says in front of eight people: “Honestly, I don’t think that will work — here’s why.” He gives three reasons. The director listens, writes something down, and says, “Good point. Thanks.” The meeting continues. Nobody looks embarrassed.

**Cast:** **Richard**, 56, the director presenting his plan; **Ryan**, 26, a junior analyst, two years in the job.

### Rooms (the *Scene* field)

**meeting** — panels 1, 2, 3, 4, 5, 6

```text
A glass-walled meeting room in a Boston logistics office on a Monday morning. Eight people around a long table, a screen at one end.
Room tone: quiet air handling, a chair creaking, one person turning a page.
```

Room tone the assembler lays under dialogue in this room: `air -38 dB` · `fluoro -46 dB` · `presence -52 dB`

### Richard — speaker `Richard` · `scene/cast/richard.jpg`

**Voice** Alnilam (Firm)

**Audio profile**

```text
Man in his fifties, low steady baritone, general American. Measured and unhurried, slight pause before important words, sounds in charge without being cold.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Richard is the director presenting his plan. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Ryan — speaker `Ryan` · `scene/cast/ryan.jpg`

**Voice** Algieba (Smooth)

**Audio profile**

```text
Young man, smooth mid-range voice, general American. Clear and polite, speaks with calm confidence, counts his points with a small lift on each number.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip). Ryan is a junior analyst, two years in the job. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).

**Panel 1** — `scene/panels/disagreeing-in-the-meeting-1.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-1`

*Heard over this panel:* Narrator: “It's Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan.” / Richard: “So that's the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
A meeting room. Eight colleagues at a long table. Richard stands by a wall screen showing a simple bar chart, pointing at it. He looks confident.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/disagreeing-in-the-meeting-2.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-2`

*Heard over this panel:* Narrator: “Ryan is twenty-six. He has worked here for two years. He puts up his hand.” / Ryan: “Honestly, I don't think that will work. Can I say why?” / Richard: “Sure. Go ahead.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
Ryan, young, raises his hand halfway. Heads around the table turn to look at him; one colleague looks surprised.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/disagreeing-in-the-meeting-3.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-2`

*Heard over this panel:* Ryan: “Okay. First, Tuesday is already our busiest day. Second, two of our drivers don't work on Tuesdays. And third, our biggest customer wants Monday deliveries.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
Ryan speaks calmly, counting on three raised fingers. Richard, arms folded, listens.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/disagreeing-in-the-meeting-4.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-3`

*Heard over this panel:* Narrator: “The room is quiet. Richard listens. He writes something down.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
Close on Richard: he looks down at a notebook and writes something, nodding slightly. The room is quiet.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/disagreeing-in-the-meeting-5.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-3`

*Heard over this panel:* Richard: “Hmm. The drivers... I didn't know that. Good point. Thanks, Ryan.” / Ryan: “Sure.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
Richard points his pen towards Ryan with a small appreciative smile. Ryan sits back, relaxed.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/disagreeing-in-the-meeting-6.webp` · stand-in until drawn: `strip/disagreeing-in-the-meeting-3`

*Heard over this panel:* Narrator: “And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Richard: white American man, 56, swept-back grey hair, open-collared white shirt, dark trousers (as in the existing strip). Ryan: white American man, 26, wavy brown hair, forest-green sweater (as in the existing strip).
The meeting carries on: a different colleague is now at the screen. Richard and Ryan both take notes. Coffee cups, normal Monday atmosphere, nobody embarrassed.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Richard` (Alnilam) and `Ryan` (Algieba).

**`disagreeing-in-the-meeting-s01`** · narration · panel 1 · Sulafat

```text
It's Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan.
```

**`disagreeing-in-the-meeting-s02`** · dialogue · room **meeting** · panel 1

*Sample context:* Richard speaking to Ryan. Richard is the director presenting his plan; Ryan is a junior analyst, two years in the job. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Richard | confident, wrapping up a presentation | So that's the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts? |

**`disagreeing-in-the-meeting-s03`** · narration · panel 2 · Sulafat

```text
Ryan is twenty-six. He has worked here for two years. He puts up his hand.
```

**`disagreeing-in-the-meeting-s04`** · dialogue · room **meeting** · panels 2, 3

*Sample context:* A short, natural exchange between Richard and Ryan. Richard is the director presenting his plan; Ryan is a junior analyst, two years in the job. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Ryan | calm and polite, direct | Honestly, I don't think that will work. Can I say why? |
| Richard | neutral, genuinely open | Sure. Go ahead. |
| Ryan | clear and organised, counting his points | Okay. First, Tuesday is already our busiest day. Second, two of our drivers don't work on Tuesdays. And third, our biggest customer wants Monday deliveries. |

**`disagreeing-in-the-meeting-s05`** · narration · panel 4 · Sulafat

```text
The room is quiet. Richard listens. He writes something down.
```

**`disagreeing-in-the-meeting-s06`** · dialogue · room **meeting** · panel 5

*Sample context:* A short, natural exchange between Richard and Ryan. Richard is the director presenting his plan; Ryan is a junior analyst, two years in the job. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Richard | thoughtful, then appreciative | Hmm. The drivers... I didn't know that. Good point. Thanks, Ryan. |
| Ryan | relaxed, simple | Sure. |

**`disagreeing-in-the-meeting-s07`** · narration · panel 6 · Sulafat

```text
And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard.
```

---

## 4 · The Director Stacking Chairs  —  Authority

**Setting:** Denver · after an office event

**What happens (the scenario, as the page tells it):** The event finishes. The country director — the most senior person in the building — is stacking chairs beside the newest intern and carrying boxes out to a car. The intern calls him “sir”. He laughs and says, “It’s Dave.” Later he makes the coffee for the people cleaning up.

**Cast:** **Tanvir**, 23, a new intern from Chittagong, in his first week; **Dave**, 49, the country director — the same Dave the class interviews in step 3.

### Rooms (the *Scene* field)

**hall** — panels 1, 2, 3

```text
A community hall in Denver just after an office event, most guests gone. Stacks of folding chairs, a few balloons.
Room tone: big empty-room echo, chairs clacking somewhere at the back, a door propped open.
```

Room tone the assembler lays under dialogue in this room: `air -36 dB` · `presence -44 dB` · `clatter -44 dB`

**lot** — panels 4

```text
A parking lot outside the hall, late afternoon.
Room tone: light wind, a distant highway, a car boot opening.
```

Room tone the assembler lays under dialogue in this room: `wind -38 dB` · `rumble -40 dB`

**kitchen** — panels 5, 6

```text
The small office kitchen at the back of the hall.
Room tone: a coffee maker gurgling, a fridge hum, voices of two volunteers in the next room.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `mains -46 dB` · `babble -42 dB`

### Tanvir — speaker `Tanvir` · `scene/cast/tanvir.jpg`

**Voice** Umbriel (Easy-going)

**Accent note** (added to the style of every Tanvir line): `light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w`

**Audio profile**

```text
Young man, earnest light baritone with a Bangladeshi accent. Respectful, a little breathless when nervous, softens the ends of his sentences.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Tanvir is a new intern from Chittagong, in his first week. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Dave — speaker `Dave` · `scene/cast/dave.jpg`

**Voice** Zubenelgenubi (Casual) · **same voice as** `audio/the-boss-stacks-chairs-1.mp3`

**Audio profile**

```text
Man in his late forties, relaxed and casual mid-baritone, general American. Laughs easily, never sounds like a boss, a friendly lift at the end of short phrases.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg) (match the face in the attached portrait from portraits/the-boss-stacks-chairs-1.jpg). Dave is the country director — the same Dave the class interviews in step 3. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).

**Panel 1** — `scene/panels/the-boss-stacks-chairs-1.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-1`

*Heard over this panel:* Narrator: “The office party is over. Tanvir is a new intern. It is his first week.” / Narrator: “Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
After the party in a hall: balloons, empty tables. Dave, sleeves rolled up, lifts a stack of folding chairs. Tanvir, holding a box, stares at him in surprise.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/the-boss-stacks-chairs-2.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-2`

*Heard over this panel:* Tanvir: “Sir! Sir, please, let me do that. You don't have to.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
Tanvir hurries over with both hands out to take the chairs from Dave, bowing his head slightly, anxious.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/the-boss-stacks-chairs-3.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-2`

*Heard over this panel:* Dave: “Sir? Please, it's Dave. And it's fine, I've got these.” / Tanvir: “Okay, s... Dave.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
Dave laughs, one hand on his chest, the other waving the idea away. Tanvir looks embarrassed but starts to smile.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/the-boss-stacks-chairs-4.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-3`

*Heard over this panel:* Dave: “Hey, can you grab that box? The car's just outside. I'll take the heavy one.” / Narrator: “Together they carry the boxes out to the car.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
Parking lot. The two of them carry cardboard boxes to an open car boot. Dave carries the bigger, heavier box.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/the-boss-stacks-chairs-5.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-3`

*Heard over this panel:* Narrator: “Later, the cleaning is almost finished. Dave goes into the kitchen.” / Dave: “Who wants coffee? I'm making a pot.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
Small office kitchen. Dave pours coffee into a row of paper cups for two volunteers holding brooms.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/the-boss-stacks-chairs-6.webp` · stand-in until drawn: `strip/the-boss-stacks-chairs-3`

*Heard over this panel:* Dave: “Here you go, Tanvir. The milk's in the fridge.” / Tanvir: “Thank you... Dave.” / Narrator: “Tanvir holds the cup with both hands. The boss made him coffee.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Tanvir: Bangladeshi man, 23, thick dark hair, navy blazer over a white T-shirt, khaki trousers (as in the existing strip). Dave: white American man, 49, short grey hair, white shirt with sleeves rolled up, dark green trousers (as in the existing strip; face as in portraits/the-boss-stacks-chairs-1.jpg).
Dave hands a mug to Tanvir. Tanvir holds it with both hands, amazed, as if receiving a gift.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Tanvir` (Umbriel) and `Dave` (Zubenelgenubi).

**`the-boss-stacks-chairs-s01`** · narration · panel 1 · Sulafat

```text
The office party is over. Tanvir is a new intern. It is his first week. Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs.
```

**`the-boss-stacks-chairs-s02`** · dialogue · room **hall** · panels 2, 3

*Sample context:* A short, natural exchange between Tanvir and Dave. Tanvir is a new intern from Chittagong, in his first week; Dave is the country director — the same Dave the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Tanvir | anxious and respectful, hurrying; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w | Sir! Sir, please, let me do that. You don't have to. |
| Dave | amused and kind, completely relaxed | &lt;laugh&gt; Sir? Please, it's Dave. And it's fine, I've got these. |
| Tanvir | hesitant, trying the first name for the first time; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w | Okay, s... Dave. |

**`the-boss-stacks-chairs-s03`** · dialogue · room **lot** · panel 4

*Sample context:* Dave speaking to Tanvir. Tanvir is a new intern from Chittagong, in his first week; Dave is the country director — the same Dave the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Dave | casual, practical | Hey, can you grab that box? The car's just outside. I'll take the heavy one. |

**`the-boss-stacks-chairs-s04`** · narration · panels 4, 5 · Sulafat

```text
Together they carry the boxes out to the car. Later, the cleaning is almost finished. Dave goes into the kitchen.
```

**`the-boss-stacks-chairs-s05`** · dialogue · room **kitchen** · panels 5, 6

*Sample context:* A short, natural exchange between Tanvir and Dave. Tanvir is a new intern from Chittagong, in his first week; Dave is the country director — the same Dave the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Dave | calling out cheerfully to the next room | Who wants coffee? I'm making a pot. |
| Dave | friendly and offhand | Here you go, Tanvir. The milk's in the fridge. |
| Tanvir | quiet, amazed, grateful; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w | Thank you... Dave. |

**`the-boss-stacks-chairs-s06`** · narration · panel 6 · Sulafat

```text
Tanvir holds the cup with both hands. The boss made him coffee.
```

---

## 5 · “What Do You Think?”  —  Opinion

**Setting:** A university classroom · Michigan

**What happens (the scenario, as the page tells it):** The teacher finishes the reading and asks, “So — what do you think?” Silence. He waits. Ten more seconds. He does not fill the gap. Then: “There’s no right answer, I actually want to know your opinion.” At the end of term, twenty per cent of the grade is participation.

**Cast:** **Farhana**, 20, a first-year student from Khulna in her first university class in Michigan; **Dr. Novak**, 54, the literature teacher.

### Rooms (the *Scene* field)

**classroom** — panels 1, 2, 3, 4, 5

```text
A mid-sized university seminar room in Michigan, twenty students at tables, afternoon light.
Room tone: a quiet heating vent, a clock ticking faintly, one chair shifting.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `fan -44 dB` · `presence -52 dB`

**corridor** — panels 6

```text
A university corridor just after class.
Room tone: soft footsteps, distant voices, a door closing.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `presence -50 dB` · `babble -44 dB`

### Farhana — speaker `Farhana` · `scene/cast/farhana.jpg`

**Voice** Achernar (Soft)

**Accent note** (added to the style of every Farhana line): `light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress`

**Audio profile**

```text
Young woman, soft and slightly breathy voice with a Bangladeshi accent. Quiet, hesitates before she starts, grows steadier as she goes.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Farhana is a first-year student from Khulna in her first university class in Michigan. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Dr. Novak — speaker `Novak` · `scene/cast/novak.jpg`

**Voice** Rasalgethi (Informative)

**Audio profile**

```text
Man in his fifties, warm and informative baritone, general American. Patient, lets silences sit, rises with real curiosity when a student speaks.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip). Dr. Novak is the literature teacher. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).

**Panel 1** — `scene/panels/what-do-you-think-1.webp` · stand-in until drawn: `strip/what-do-you-think-1`

*Heard over this panel:* Narrator: “Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story.” / Dr. Novak: “So... what do you think?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
University classroom with tables in a horseshoe. Students with books open. Dr. Novak closes his book and leans on the front desk, looking at the class with an open, expectant face.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/what-do-you-think-2.webp` · stand-in until drawn: `strip/what-do-you-think-2`

*Heard over this panel:* Narrator: “Nobody speaks. Farhana looks down at her book.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
Silence. The students look down at their books. Farhana, in the second row, stares at her page. A wall clock's second hand is near the 12.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/what-do-you-think-3.webp` · stand-in until drawn: `strip/what-do-you-think-2`

*Heard over this panel:* Narrator: “Dr. Novak doesn't say anything. He just waits. Five seconds. Ten seconds.” / Dr. Novak: “It's okay. There's no right answer. I actually want to know your opinion.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
Dr. Novak waits calmly, hands open, eyebrows raised, not speaking. The wall clock's second hand has moved to the 2: ten seconds later.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/what-do-you-think-4.webp` · stand-in until drawn: `strip/what-do-you-think-2`

*Heard over this panel:* Farhana: “My opinion? But he is the teacher...” / Dr. Novak: “Farhana? You look like you have an idea.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
Close on Farhana: she half-raises her hand, uncertain, biting her lip. Dr. Novak has noticed her and gestures towards her with an open palm.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/what-do-you-think-5.webp` · stand-in until drawn: `strip/what-do-you-think-3`

*Heard over this panel:* Farhana: “Um... I think the father was wrong. He didn't listen to his son.” / Dr. Novak: “Interesting! Why do you think that? Tell me more.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
Farhana speaks. Dr. Novak leans forward, interested. Two classmates turn to listen to her.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/what-do-you-think-6.webp` · stand-in until drawn: `strip/what-do-you-think-3`

*Heard over this panel:* Narrator: “After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class.” / Farhana: “Twenty percent... just for talking?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Farhana: Bangladeshi woman, 20, deep-red hijab, cream sweater, holding a paperback book (as in the existing strip). Dr. Novak: white American man, 54, curly grey hair, short grey beard, olive tweed jacket, khaki trousers (as in the existing strip).
After class, Farhana in the corridor looks at a printed course plan with a pie chart. One slice of the chart, a fifth, is highlighted in gold and labelled 20%.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Farhana` (Achernar) and `Novak` (Rasalgethi).

**`what-do-you-think-s01`** · narration · panel 1 · Sulafat

```text
Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story.
```

**`what-do-you-think-s02`** · dialogue · room **classroom** · panel 1

*Sample context:* Dr. Novak speaking to Farhana. Farhana is a first-year student from Khulna in her first university class in Michigan; Dr. Novak is the literature teacher. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Novak | open and curious, relaxed | So... what do you think? |

**`what-do-you-think-s03`** · narration · panels 2, 3 · Sulafat

```text
Nobody speaks. Farhana looks down at her book. Dr. Novak doesn't say anything. He just waits. Five seconds. Ten seconds.
```

**`what-do-you-think-s04`** · dialogue · room **classroom** · panels 3, 4, 5

*Sample context:* A short, natural exchange between Farhana and Dr. Novak. Farhana is a first-year student from Khulna in her first university class in Michigan; Dr. Novak is the literature teacher. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Novak | patient and encouraging, unhurried | It's okay. There's no right answer. I actually want to know your opinion. |
| Farhana | whispering to herself, unsure; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress | &lt;whispers&gt; My opinion? But he is the teacher... |
| Novak | gentle, inviting | Farhana? You look like you have an idea. |
| Farhana | hesitant at first, then a little steadier; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress | Um... I think the father was wrong. He didn't listen to his son. |
| Novak | genuinely delighted and curious | Interesting! Why do you think that? Tell me more. |

**`what-do-you-think-s05`** · narration · panel 6 · Sulafat

```text
After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class.
```

**`what-do-you-think-s06`** · dialogue · room **corridor** · panel 6

*Sample context:* Farhana speaking to Dr. Novak. Farhana is a first-year student from Khulna in her first university class in Michigan; Dr. Novak is the literature teacher. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Farhana | surprised, thinking aloud; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress | Twenty percent... just for talking? |

---

## 6 · The Neighbour’s Tree  —  Conflict

**Setting:** A suburban street · Portland

**What happens (the scenario, as the page tells it):** Leaves from the neighbour’s maple keep blocking an American man’s roof gutter. He walks next door, knocks, and says with a smile: “Hey — your maple’s filling my gutter. Can we figure something out?” They talk for four minutes. They shake hands. Neither man mentions it again, and they wave at each other the next morning.

**Cast:** **Bill**, 58, the man whose roof gutter keeps filling with leaves; **Mike**, 47, the neighbour with the maple tree.

### Rooms (the *Scene* field)

**yard** — panels 1, 2, 4, 5, 6

```text
Two neighbouring front gardens on a quiet suburban street in Portland, a cool grey autumn morning, wet leaves everywhere.
Room tone: light breeze through trees, leaves rustling, a crow far off.
```

Room tone the assembler lays under dialogue in this room: `wind -38 dB` · `birds -42 dB` · `air -44 dB`

**door** — panels 3

```text
The front porch of the house next door.
Room tone: breeze, a wind chime once, the door swinging open.
```

Room tone the assembler lays under dialogue in this room: `wind -40 dB` · `birds -46 dB` · `air -44 dB`

### Bill — speaker `Bill` · `scene/cast/bill.jpg`

**Voice** Algenib (Gravelly)

**Audio profile**

```text
Man in his late fifties, gravelly low voice, general American. Plain-spoken and a bit gruff, then friendly; short phrases, a smile you can hear when he relaxes.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Bill is the man whose roof gutter keeps filling with leaves. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Mike — speaker `Mike` · `scene/cast/mike.jpg`

**Voice** Sadachbia (Lively)

**Audio profile**

```text
Man in his forties, lively warm tenor, general American. Open and easy, quick to agree, a friendly bounce in his rhythm.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip). Mike is the neighbour with the maple tree. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).

**Panel 1** — `scene/panels/the-neighbours-tree-1.webp` · stand-in until drawn: `strip/the-neighbours-tree-1`

*Heard over this panel:* Narrator: “It's autumn in Portland. Leaves from the neighbour's big maple tree keep falling into Bill's roof gutter.” / Bill: “Again? That's the third time this week.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
Autumn. Bill stands in his garden, hands on hips, frowning up at his roof gutter, which is overflowing with orange maple leaves. The neighbour's big maple tree leans over the fence.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/the-neighbours-tree-2.webp` · stand-in until drawn: `strip/the-neighbours-tree-2`

*Heard over this panel:* Narrator: “Bill walks next door and knocks.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
Bill walks up the path of the house next door and knocks on the front door.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/the-neighbours-tree-3.webp` · stand-in until drawn: `strip/the-neighbours-tree-2`

*Heard over this panel:* Mike: “Oh, hey, Bill! What's up?” / Bill: “Hey, Mike. So... your maple's filling my gutter. Can we figure something out?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
Mike opens the door, surprised and friendly. Bill smiles and points back towards the tree.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/the-neighbours-tree-4.webp` · stand-in until drawn: `strip/the-neighbours-tree-2`

*Heard over this panel:* Mike: “Oh, man, I'm sorry. I didn't know. What if I cut back those big branches over your roof?” / Bill: “That'd be great. And I'll clean the gutter one more time. Deal?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
Bill and Mike stand side by side on the lawn looking up at the maple. Mike rubs his chin; Bill points at the big branches over his roof.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/the-neighbours-tree-5.webp` · stand-in until drawn: `strip/the-neighbours-tree-3`

*Heard over this panel:* Mike: “Deal.” / Narrator: “They talk for four minutes. They shake hands. And that's it.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
The two men shake hands, both smiling.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/the-neighbours-tree-6.webp` · stand-in until drawn: `strip/the-neighbours-tree-3`

*Heard over this panel:* Narrator: “The next morning, neither man says anything about the tree. They just wave.” / Mike: “Morning, Bill!” / Bill: “Morning!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Bill: white American man, 58, grey hair and grey beard, forest-green fleece jacket, khaki trousers (as in the existing strip). Mike: white American man, 47, dark greying hair, navy puffer vest over a plaid shirt, jeans (as in the existing strip).
Next morning. Bill carries out his rubbish bin; Mike, backing out of his driveway in a car, waves through the window. Bill waves back.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Bill` (Algenib) and `Mike` (Sadachbia).

**`the-neighbours-tree-s01`** · narration · panel 1 · Sulafat

```text
It's autumn in Portland. Leaves from the neighbour's big maple tree keep falling into Bill's roof gutter.
```

**`the-neighbours-tree-s02`** · dialogue · room **yard** · panel 1

*Sample context:* Bill speaking to Mike. Bill is the man whose roof gutter keeps filling with leaves; Mike is the neighbour with the maple tree. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Bill | tired, grumbling to himself | &lt;groan&gt; Again? That's the third time this week. |

**`the-neighbours-tree-s03`** · narration · panel 2 · Sulafat

```text
Bill walks next door and knocks.
```

**`the-neighbours-tree-s04`** · dialogue · room **door** · panel 3

*Sample context:* A short, natural exchange between Bill and Mike. Bill is the man whose roof gutter keeps filling with leaves; Mike is the neighbour with the maple tree. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Mike | surprised and friendly | Oh, hey, Bill! What's up? |
| Bill | friendly and direct, with a small smile | Hey, Mike. So... your maple's filling my gutter. Can we figure something out? |

**`the-neighbours-tree-s05`** · dialogue · room **yard** · panels 4, 5

*Sample context:* A short, natural exchange between Bill and Mike. Bill is the man whose roof gutter keeps filling with leaves; Mike is the neighbour with the maple tree. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Mike | apologetic, then helpful | Oh, man, I'm sorry. I didn't know. What if I cut back those big branches over your roof? |
| Bill | relieved and practical | That'd be great. And I'll clean the gutter one more time. Deal? |
| Mike | warm, decided | Deal. |

**`the-neighbours-tree-s06`** · narration · panels 5, 6 · Sulafat

```text
They talk for four minutes. They shake hands. And that's it. The next morning, neither man says anything about the tree. They just wave.
```

**`the-neighbours-tree-s07`** · dialogue · room **yard** · panel 6

*Sample context:* A short, natural exchange between Bill and Mike. Bill is the man whose roof gutter keeps filling with leaves; Mike is the neighbour with the maple tree. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Mike | cheerful, calling from a car window | Morning, Bill! |
| Bill | friendly, calling back | Morning! |

---

## 7 · Back of the Line  —  Fairness

**Setting:** A pharmacy · Philadelphia

**What happens (the scenario, as the page tells it):** At a busy pharmacy, eight people wait in one straight line for the counter. A well-dressed man in a hurry walks past them to the front and says, “I just have one quick question.” The pharmacist smiles and says, “Sure — the line starts back there.” He walks to the back. Nobody in the line looks angry, and nobody offers to let him go first.

**Cast:** **Brad**, 41, a man in a hurry; **Carla**, 45, the pharmacist.

### Rooms (the *Scene* field)

**pharmacy** — panels 1, 2, 3, 4, 5, 6

```text
A busy neighbourhood pharmacy in Philadelphia on a weekday afternoon. Eight people queue at one counter.
Room tone: bright shop hum, fluorescent buzz, a till beeping, the automatic door sliding.
```

Room tone the assembler lays under dialogue in this room: `fluoro -40 dB` · `air -40 dB` · `babble -38 dB` · `door -46 dB`

### Brad — speaker `Brad` · `scene/cast/brad.jpg`

**Voice** Orus (Firm)

**Audio profile**

```text
Man in his early forties, firm quick baritone, general American. Brisk and a little impatient, polite words said fast, voice drops flat when he is let down.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Brad is a man in a hurry. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Carla — speaker `Carla` · `scene/cast/carla.jpg`

**Voice** Pulcherrima (Forward)

**Audio profile**

```text
Woman in her forties, clear forward alto, general American. Warm and smiling, completely steady; friendly tone, firm words, never raises her voice.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip). Carla is the pharmacist. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).

**Panel 1** — `scene/panels/back-of-the-line-1.webp` · stand-in until drawn: `strip/back-of-the-line-1`

*Heard over this panel:* Narrator: “It's a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Inside a pharmacy. Eight people wait in one straight line to the counter: an older woman, a mother with a small child, a student with headphones, others. Carla serves at the counter.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/back-of-the-line-2.webp` · stand-in until drawn: `strip/back-of-the-line-2`

*Heard over this panel:* Narrator: “A man in a suit walks in. He looks at his watch. He is in a hurry.” / Brad: “Excuse me... sorry... excuse me.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Brad, in a suit, checks his wristwatch as he walks quickly past the line, one hand raised in a small apologetic wave.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/back-of-the-line-3.webp` · stand-in until drawn: `strip/back-of-the-line-2`

*Heard over this panel:* Narrator: “He walks past everyone, straight to the front.” / Brad: “Hi. I just have one quick question. It'll only take ten seconds.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Brad at the front of the counter, leaning in, one finger raised. The people in the line look at him, calm but watching.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/back-of-the-line-4.webp` · stand-in until drawn: `strip/back-of-the-line-3`

*Heard over this panel:* Carla: “Sure, I'm happy to help. The line starts back there.” / Brad: “Oh. Right. Okay.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Carla smiles politely and points with an open hand towards the back of the line.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/back-of-the-line-5.webp` · stand-in until drawn: `strip/back-of-the-line-3`

*Heard over this panel:* Narrator: “He walks to the back of the line. Nobody looks angry.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Brad walks back along the line towards the end, shoulders slightly dropped. Nobody in the line looks angry.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/back-of-the-line-6.webp` · stand-in until drawn: `strip/back-of-the-line-3`

*Heard over this panel:* Narrator: “And nobody says, "You can go first."” / Carla: “Next, please!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Brad: white American man, 41, brown hair, navy suit, phone in hand (as in the existing strip). Carla: Black American woman, 45, hair pulled back in a neat bun, white pharmacist coat (as in the existing strip).
Brad stands at the very back behind the mother and child, looking at his phone. The line moves forward one step. Carla calls the next customer.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Brad` (Orus) and `Carla` (Pulcherrima).

**`back-of-the-line-s01`** · narration · panels 1, 2 · Sulafat

```text
It's a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line. A man in a suit walks in. He looks at his watch. He is in a hurry.
```

**`back-of-the-line-s02`** · dialogue · room **pharmacy** · panel 2

*Sample context:* Brad speaking to Carla. Brad is a man in a hurry; Carla is the pharmacist. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Brad | rushed, polite on the surface, moving fast | Excuse me... sorry... excuse me. |

**`back-of-the-line-s03`** · narration · panel 3 · Sulafat

```text
He walks past everyone, straight to the front.
```

**`back-of-the-line-s04`** · dialogue · room **pharmacy** · panels 3, 4

*Sample context:* A short, natural exchange between Brad and Carla. Brad is a man in a hurry; Carla is the pharmacist. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Brad | charming and quick, sure it will work | Hi. I just have one quick question. It'll only take ten seconds. |
| Carla | warm and smiling, completely firm | Sure, I'm happy to help. The line starts back there. |
| Brad | deflated, flat | Oh. Right. Okay. |

**`back-of-the-line-s05`** · narration · panels 5, 6 · Sulafat

```text
He walks to the back of the line. Nobody looks angry. And nobody says, "You can go first."
```

**`back-of-the-line-s06`** · dialogue · room **pharmacy** · panel 6

*Sample context:* Carla speaking to Brad. Brad is a man in a hurry; Carla is the pharmacist. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Carla | bright and friendly, calling down the line | Next, please! |

---

## 8 · Tell Them What You Did  —  Self-Presentation

**Setting:** An internship interview · Atlanta

**What happens (the scenario, as the page tells it):** Two students interview for the same summer internship and are asked the same question: “Tell us about your biggest achievement.” The American student says, “I led a team of five, and we grew our club’s membership by forty percent. I’m proud of that.” The Bangladeshi student, who in fact organised a whole charity project, says, “I helped a little. It was really the team’s work.” The American student gets the internship.

**Cast:** **Arif**, 22, a final-year student from Rajshahi applying for a summer internship; **Tyler**, 22, an American student applying for the same internship.

### Rooms (the *Scene* field)

**waiting** — panels 1

```text
A quiet corridor outside an interview room at a company in Atlanta. Two chairs against the wall.
Room tone: soft air conditioning, a distant phone ringing once, muffled voices behind a door.
```

Room tone the assembler lays under dialogue in this room: `air -38 dB` · `fan -44 dB` · `presence -52 dB`

**interview** — panels 2, 3, 4

```text
A small bright office, one interviewer behind a wooden desk.
Room tone: very quiet office, a pen tapping once.
```

Room tone the assembler lays under dialogue in this room: `air -42 dB` · `presence -52 dB`

**home** — panels 5, 6

```text
Two different places a week later — a dorm room, a library.
Room tone: near silence, a laptop fan.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `babble -34 dB` · `dish -40 dB`

### Arif — speaker `Arif` · `scene/cast/arif.jpg`

**Voice** Iapetus (Clear)

**Accent note** (added to the style of every Arif line): `light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end`

**Audio profile**

```text
Young man, gentle and modest light baritone with a Bangladeshi accent. Speaks softly, lets his voice fall at the end of sentences, downplays everything.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Arif is a final-year student from Rajshahi applying for a summer internship. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Tyler — speaker `Tyler` · `scene/cast/tyler.jpg`

**Voice** Puck (Upbeat)

**Audio profile**

```text
Young man, upbeat and bright tenor, general American. Confident and fluent, strong stress on numbers and on "I", sounds pleased with himself in a friendly way.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip). Tyler is an American student applying for the same internship. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).

**Panel 1** — `scene/panels/tell-them-what-you-did-1.webp` · stand-in until drawn: `strip/tell-them-what-you-did-1`

*Heard over this panel:* Narrator: “Arif and Tyler are students in Atlanta. They are waiting for the same internship interview.” / Tyler: “Nervous? Don't be. Just tell them what you did.” / Arif: “Tell them what I did? Okay...”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
A corridor outside an interview room. Arif and Tyler sit on two chairs, both in formal clothes with folders. Tyler leans back, relaxed, and smiles at her. Arif sits stiffly, nervous.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/tell-them-what-you-did-2.webp` · stand-in until drawn: `strip/tell-them-what-you-did-2`

*Heard over this panel:* Narrator: “The interviewer asks each of them the same question: "Tell us about your biggest achievement."” / Tyler: “Sure. Last year I led a team of five, and we grew our club's membership by forty percent. I'm really proud of that.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
An office. Tyler sits up straight in front of the interviewer — a Black American woman in a navy blazer at a wooden desk — gesturing confidently with one hand. She smiles and takes notes.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/tell-them-what-you-did-3.webp` · stand-in until drawn: `strip/tell-them-what-you-did-3`

*Heard over this panel:* Arif: “Oh... I helped a little with a charity project. But really, it was the team's work.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
The same office. Arif sits in front of the same interviewer, eyes down, one hand on his chest, making a small modest gesture.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/tell-them-what-you-did-4.webp` · stand-in until drawn: `strip/tell-them-what-you-did-3`

*Heard over this panel:* Narrator: “But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
A memory panel with a soft faded border: Arif with a clipboard directing a crowd of volunteers packing food boxes at a charity event, clearly the person in charge.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/tell-them-what-you-did-5.webp` · stand-in until drawn: `strip/tell-them-what-you-did-2`

*Heard over this panel:* Narrator: “One week later, the email arrives.” / Tyler: “Yes! I got it!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
A week later. Tyler in his room looks at his phone and punches the air, delighted. The phone screen shows a big green tick.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/tell-them-what-you-did-6.webp` · stand-in until drawn: `strip/tell-them-what-you-did-3`

*Heard over this panel:* Narrator: “Arif reads his email too. It says, "Thank you for your interest."” / Arif: “But I did so much...”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Arif: Bangladeshi man, 22, thick black hair, green button-down shirt (as in the existing strip). Tyler: white American man, 22, short brown hair, light-blue button-down shirt, confident posture (as in the existing strip).
Arif at a library desk reads an email on his laptop. His face falls, disappointed.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Arif` (Iapetus) and `Tyler` (Puck).

**`tell-them-what-you-did-s01`** · narration · panel 1 · Sulafat

```text
Arif and Tyler are students in Atlanta. They are waiting for the same internship interview.
```

**`tell-them-what-you-did-s02`** · dialogue · room **waiting** · panel 1

*Sample context:* A short, natural exchange between Arif and Tyler. Arif is a final-year student from Rajshahi applying for a summer internship; Tyler is an American student applying for the same internship. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Tyler | relaxed and friendly | Nervous? Don't be. Just tell them what you did. |
| Arif | uncertain, quiet; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end | Tell them what I did? Okay... |

**`tell-them-what-you-did-s03`** · narration · panel 2 · Sulafat

```text
The interviewer asks each of them the same question: "Tell us about your biggest achievement."
```

**`tell-them-what-you-did-s04`** · dialogue · room **interview** · panels 2, 3

*Sample context:* A short, natural exchange between Arif and Tyler. Arif is a final-year student from Rajshahi applying for a summer internship; Tyler is an American student applying for the same internship. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Tyler | confident and bright, proud | Sure. Last year I led a team of five, and we grew our club's membership by forty percent. I'm really proud of that. |
| Arif | modest and soft, eyes down; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end | Oh... I helped a little with a charity project. But really, it was the team's work. |

**`tell-them-what-you-did-s05`** · narration · panels 4, 5 · Sulafat

```text
But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families. One week later, the email arrives.
```

**`tell-them-what-you-did-s06`** · dialogue · room **home** · panel 5

*Sample context:* Tyler speaking to Arif. Arif is a final-year student from Rajshahi applying for a summer internship; Tyler is an American student applying for the same internship. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Tyler | excited, a burst of joy | Yes! I got it! |

**`tell-them-what-you-did-s07`** · narration · panel 6 · Sulafat

```text
Arif reads his email too. It says, "Thank you for your interest."
```

**`tell-them-what-you-did-s08`** · dialogue · room **home** · panel 6

*Sample context:* Arif speaking to Tyler. Arif is a final-year student from Rajshahi applying for a summer internship; Tyler is an American student applying for the same internship. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Arif | quiet and disappointed; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end | &lt;sigh&gt; But I did so much... |

---

## 9 · Honestly, I’m Annoyed  —  Feelings

**Setting:** A university library · Sacramento

**What happens (the scenario, as the page tells it):** A Bangladeshi student is doing a group project with three American classmates. One of the American classmates, Ethan, forgot to finish his part, so Hannah stayed up until 2 a.m. to do it. The next day she looks straight at him, frowns and says, “Honestly, I’m annoyed. I did your part last night.” Ethan says, “You’re right — I’m sorry.” Ten minutes later the two of them are laughing, and they go for coffee together.

**Cast:** **Hannah**, 23, an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3; **Ethan**, 22, the classmate who forgot his part — the same Ethan the class interviews in step 3.

### Rooms (the *Scene* field)

**library** — panels 1, 2, 3, 4, 5

```text
A group study room in a university library in Sacramento, morning. Four students round a table with laptops.
Room tone: hushed library air, a laptop fan, a book trolley rolling past outside the glass.
```

Room tone the assembler lays under dialogue in this room: `air -40 dB` · `fan -46 dB` · `presence -52 dB`

**exit** — panels 6

```text
A busy campus café.
Room tone: coffee machine hiss, cups on saucers, cheerful chatter.
```

Room tone the assembler lays under dialogue in this room: `babble -34 dB` · `dish -40 dB` · `air -42 dB`

### Hannah — speaker `Hannah` · `scene/cast/hannah.jpg`

**Voice** Kore (Firm) · **same voice as** `audio/honestly-im-annoyed-1.mp3`

**Audio profile**

```text
Young woman, firm clear alto, general American. Calm and direct even when upset, no shouting; warmth comes back fast into her voice once it is said.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip) (match the face in the attached portrait from portraits/honestly-im-annoyed-1.jpg). Hannah is an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Ethan — speaker `Ethan` · `scene/cast/ethan.jpg`

**Voice** Zephyr (Bright) · **same voice as** `audio/honestly-im-annoyed-2.mp3`

**Audio profile**

```text
Young man, bright light tenor, general American. Cheerful and quick, drops into a sincere lower tone when he apologises, laughs easily.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip) (match the face in the attached portrait from portraits/honestly-im-annoyed-2.jpg). Ethan is the classmate who forgot his part — the same Ethan the class interviews in step 3. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).

**Panel 1** — `scene/panels/honestly-im-annoyed-1.webp` · stand-in until drawn: `strip/honestly-im-annoyed-1`

*Heard over this panel:* Narrator: “Mahin is from Dhaka. He is doing a group project in the library with three American classmates.” / Narrator: “Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it.” / Ethan: “Morning, guys! Oh, did anyone finish the slides?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
A library study table by a window. Mahin, a Bangladeshi student in a checked shirt, sits with Hannah, who looks exhausted, at a table of laptops and books. Ethan arrives cheerfully and sits down.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/honestly-im-annoyed-2.webp` · stand-in until drawn: `strip/honestly-im-annoyed-1`

*Heard over this panel:* Hannah: “Honestly, Ethan, I'm annoyed. I did your part last night. I was up until two.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
Hannah looks straight at Ethan, frowning, arms folded. Not shouting, just serious.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/honestly-im-annoyed-3.webp` · stand-in until drawn: `strip/honestly-im-annoyed-2`

*Heard over this panel:* Ethan: “Oh no. You're right. I totally forgot. I'm really sorry, Hannah.” / Hannah: “Okay. Thank you for saying that.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
Ethan's face: surprise turning into apology, one hand on his chest. Hannah's face softens a little.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/honestly-im-annoyed-4.webp` · stand-in until drawn: `strip/honestly-im-annoyed-2`

*Heard over this panel:* Narrator: “Mahin looks down at the table. In Dhaka, a friendship could end right here.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
Mahin looks from one to the other, worried, sinking a little lower in his chair.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/honestly-im-annoyed-5.webp` · stand-in until drawn: `strip/honestly-im-annoyed-3`

*Heard over this panel:* Narrator: “But ten minutes later...” / Ethan: “Wait, did you really put a cat on slide nine?” / Hannah: “It was two in the morning! I needed a cat.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
Ten minutes later: Hannah and Ethan lean over a laptop, both laughing. On the laptop screen, a slide with a cartoon cat.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/honestly-im-annoyed-6.webp` · stand-in until drawn: `strip/honestly-im-annoyed-3`

*Heard over this panel:* Ethan: “Coffee? It's on me. I owe you.” / Hannah: “You definitely owe me.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Hannah: white American woman, 23, light-brown hair in a messy bun, forest-green sweater, tired eyes (as in the existing strip). Ethan: white American man, 22, shaggy blond hair, navy hoodie (as in the existing strip).
A café table: Hannah and Ethan sit with takeaway coffees, laughing together. At the next table, Mahin watches, amazed.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Hannah` (Kore) and `Ethan` (Zephyr).

**`honestly-im-annoyed-s01`** · narration · panel 1 · Sulafat

```text
Mahin is from Dhaka. He is doing a group project in the library with three American classmates. Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it.
```

**`honestly-im-annoyed-s02`** · dialogue · room **library** · panels 1, 2, 3

*Sample context:* A short, natural exchange between Hannah and Ethan. Hannah is an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3; Ethan is the classmate who forgot his part — the same Ethan the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Ethan | cheerful, completely unaware | Morning, guys! Oh, did anyone finish the slides? |
| Hannah | calm but clearly upset, direct | Honestly, Ethan, I'm annoyed. I did your part last night. I was up until two. |
| Ethan | taken aback, then sincere | Oh no. You're right. I totally forgot. I'm really sorry, Hannah. |
| Hannah | softening, sincere | Okay. Thank you for saying that. |

**`honestly-im-annoyed-s03`** · narration · panels 4, 5 · Sulafat

```text
Mahin looks down at the table. In Dhaka, a friendship could end right here. But ten minutes later...
```

**`honestly-im-annoyed-s04`** · dialogue · room **library** · panel 5

*Sample context:* A short, natural exchange between Hannah and Ethan. Hannah is an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3; Ethan is the classmate who forgot his part — the same Ethan the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Ethan | laughing, delighted | &lt;laugh&gt; Wait, did you really put a cat on slide nine? |
| Hannah | laughing, playful | It was two in the morning! I needed a cat. |

**`honestly-im-annoyed-s05`** · dialogue · room **exit** · panel 6

*Sample context:* A short, natural exchange between Hannah and Ethan. Hannah is an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3; Ethan is the classmate who forgot his part — the same Ethan the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Ethan | warm and friendly | Coffee? It's on me. I owe you. |
| Hannah | teasing, smiling | You definitely owe me. |

---

## 10 · Leave the Snake Alone  —  Nature

**Setting:** A back garden · Asheville, North Carolina

**What happens (the scenario, as the page tells it):** A Bangladeshi student is staying with an American family. In the back garden he sees a long black snake near the vegetable beds and runs for a stick. Kathy, the mother, stops him: “No, no — leave him. He lives here.” She calls the children to watch it from a few steps away. The snake slides under the shed. Later the student notices that the family also leaves a dead tree standing and lets one corner of the garden grow wild.

**Cast:** **Imran**, 21, a student from Sylhet staying with an American family for the summer; **Kathy**, 48, the host mother — the same Kathy the class interviews in step 3.

### Rooms (the *Scene* field)

**garden** — panels 1, 2, 3, 4, 5, 6

```text
A sunny back garden in Asheville, North Carolina, on a summer morning: vegetable beds, a wooden shed, woods behind.
Room tone: birdsong, insects buzzing, leaves moving in a light breeze.
```

Room tone the assembler lays under dialogue in this room: `birds -36 dB` · `wind -40 dB` · `air -44 dB`

### Imran — speaker `Imran` · `scene/cast/imran.jpg`

**Voice** Enceladus (Breathy)

**Accent note** (added to the style of every Imran line): `light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply`

**Audio profile**

```text
Young man, energetic mid-range voice with a Bangladeshi accent. Loud and fast when alarmed, rising pitch on questions, curious and thoughtful when calm.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Imran is a student from Sylhet staying with an American family for the summer. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Kathy — speaker `Kathy` · `scene/cast/kathy.jpg`

**Voice** Aoede (Breezy) · **same voice as** `audio/leave-the-snake-alone-1.mp3`

**Audio profile**

```text
Woman in her late forties, breezy warm alto with a soft Southern ease. Unhurried, amused, gently firm; fond when she talks about animals.
```

**Portrait prompt**

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Head-and-shoulders character portrait for a profile picture. white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip) (match the face in the attached portrait from portraits/leave-the-snake-alone-1.jpg). Kathy is the host mother — the same Kathy the class interviews in step 3. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
```

### Panels

Characters in this scene — keep them identical in every panel: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).

**Panel 1** — `scene/panels/leave-the-snake-alone-1.webp` · stand-in until drawn: `strip/leave-the-snake-alone-1`

*Heard over this panel:* Narrator: “Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina.” / Narrator: “One morning, in the back garden, he sees a long black snake near the vegetables.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
A back garden with vegetable beds. Imran, holding a watering can, jumps back: a long black snake lies near the tomato plants.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 2** — `scene/panels/leave-the-snake-alone-2.webp` · stand-in until drawn: `strip/leave-the-snake-alone-1`

*Heard over this panel:* Imran: “A snake! Wait, I'll get a stick!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 2 of 6.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
Imran grabs a long stick from beside the shed and raises it.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 3** — `scene/panels/leave-the-snake-alone-3.webp` · stand-in until drawn: `strip/leave-the-snake-alone-2`

*Heard over this panel:* Kathy: “No, no, no! Imran, leave him. He lives here.” / Imran: “He lives here? But... it's a snake!”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 3 of 6.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
Kathy hurries out of the back door in her apron and gloves, one hand up: stop.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 4** — `scene/panels/leave-the-snake-alone-4.webp` · stand-in until drawn: `strip/leave-the-snake-alone-2`

*Heard over this panel:* Kathy: “He's a black rat snake. He's not dangerous, and he eats the mice. Kids! Come and see!” / Narrator: “The children come out. They watch the snake from a few steps away.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 4 of 6.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
Kathy and two children (a boy in a red top, a girl in purple) crouch a few steps from the snake, watching it with interest. Imran stands behind them, stick lowered, confused.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 5** — `scene/panels/leave-the-snake-alone-5.webp` · stand-in until drawn: `strip/leave-the-snake-alone-3`

*Heard over this panel:* Narrator: “Slowly, the snake slides under the shed.” / Kathy: “Bye, buddy. See you later.”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 5 of 6.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
The snake slides away under the wooden shed. Kathy waves goodbye to it.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

**Panel 6** — `scene/panels/leave-the-snake-alone-6.webp` · stand-in until drawn: `strip/leave-the-snake-alone-3`

*Heard over this panel:* Narrator: “Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild.” / Imran: “Nobody cuts it... on purpose?”

```text
Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.

Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel 6 of 6.
Characters: Imran: Bangladeshi man, 21, short black hair, light stubble, navy hoodie, jeans (as in the existing strip). Kathy: white American woman, 48, brown hair tied back, tan gardening apron over an olive shirt, gardening gloves, jeans (as in the existing strip).
Later. Imran walks through the garden and notices a dead tree still standing, with a woodpecker hole, and one corner of the garden grown wild with tall grass and flowers.
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
```

### Takes

In order. Dialogue takes are one conversational call with both speakers —
`Imran` (Enceladus) and `Kathy` (Aoede).

**`leave-the-snake-alone-s01`** · narration · panel 1 · Sulafat

```text
Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina. One morning, in the back garden, he sees a long black snake near the vegetables.
```

**`leave-the-snake-alone-s02`** · dialogue · room **garden** · panels 2, 3, 4

*Sample context:* A short, natural exchange between Imran and Kathy. Imran is a student from Sylhet staying with an American family for the summer; Kathy is the host mother — the same Kathy the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Imran | alarmed, loud and fast; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply | A snake! Wait, I'll get a stick! |
| Kathy | urgent but calm, the way you stop a child touching a hot stove | No, no, no! Imran, leave him. He lives here. |
| Imran | confused, rising pitch; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply | He lives here? But... it's a snake! |
| Kathy | relaxed and fond, then calling happily to the house | He's a black rat snake. He's not dangerous, and he eats the mice. Kids! Come and see! |

**`leave-the-snake-alone-s03`** · narration · panels 4, 5 · Sulafat

```text
The children come out. They watch the snake from a few steps away. Slowly, the snake slides under the shed.
```

**`leave-the-snake-alone-s04`** · dialogue · room **garden** · panel 5

*Sample context:* Kathy speaking to Imran. Imran is a student from Sylhet staying with an American family for the summer; Kathy is the host mother — the same Kathy the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Kathy | fond and amused, quietly | Bye, buddy. See you later. |

**`leave-the-snake-alone-s05`** · narration · panel 6 · Sulafat

```text
Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild.
```

**`leave-the-snake-alone-s06`** · dialogue · room **garden** · panel 6

*Sample context:* Imran speaking to Kathy. Imran is a student from Sylhet staying with an American family for the summer; Kathy is the host mother — the same Kathy the class interviews in step 3. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
| Imran | puzzled and curious, slow; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply | Nobody cuts it... on purpose? |

---

## Generation script

Everything comes from `scenes.js` — voices, styles (accent notes included) and
transcripts. The script skips any take whose dry file already exists, so to redo
a take, delete its file and run again.

```python
# pip install google-genai
import base64, json, os, pathlib
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.8-flash-tts"          # or gemini-3.8-flash-lite-tts for a draft pass
DRY = pathlib.Path("ethnographic-interviews/scene/_dry-originals")
DRY.mkdir(parents=True, exist_ok=True)

TAKES = json.loads(r'''
[{"key":"dinner-ends-at-eight-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago. One evening, her phone buzzes. It's a voice message from Jeff, a colleague."},
{"key":"dinner-ends-at-eight-s02","kind":"dialogue","speakers":[{"speaker":"Tania","voice":"Autonoe"},{"speaker":"Jeff","voice":"Achird"}],"turns":[{"speaker":"Jeff","style":"friendly and casual, a recorded voice message, a little rushed","text":"Hi, Tania, it's Jeff! A few of us are having dinner at my place on Saturday. Want to come?"},{"speaker":"Jeff","style":"cheerful and matter-of-fact, as if saying something completely normal","text":"Come at six. I'll have to push everyone out by eight, though. I've got an early start on Sunday."},{"speaker":"Tania","style":"surprised, quietly repeating it to herself; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements","text":"Push everyone out by eight? Oh... okay."}]},
{"key":"dinner-ends-at-eight-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"On Saturday, Tania arrives at six o'clock exactly. She brings a box of sweets."},
{"key":"dinner-ends-at-eight-s04","kind":"dialogue","speakers":[{"speaker":"Tania","voice":"Autonoe"},{"speaker":"Jeff","voice":"Achird"}],"turns":[{"speaker":"Jeff","style":"delighted and welcoming","text":"Tania! Come in, come in. Oh, wow, are these for us? Thank you!"}]},
{"key":"dinner-ends-at-eight-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The food is good. Everybody talks and laughs. Tania is having a great time. Then, at five past eight, Jeff stands up."},
{"key":"dinner-ends-at-eight-s06","kind":"dialogue","speakers":[{"speaker":"Tania","voice":"Autonoe"},{"speaker":"Jeff","voice":"Achird"}],"turns":[{"speaker":"Jeff","style":"bright and grateful, raising his voice a little over the table","text":"Okay, everyone, that's eight o'clock! Thank you so much for coming. This was really fun."},{"speaker":"Tania","style":"quiet, surprised, half to herself; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements","text":"Oh... is it finished already?"},{"speaker":"Jeff","style":"warm, a friendly goodbye","text":"Tania, thanks for the sweets. See you on Monday!"}]},
{"key":"dinner-ends-at-eight-s07","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Everybody smiles. Everybody says goodbye. Nobody looks hurt. Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started."},
{"key":"dinner-ends-at-eight-s08","kind":"dialogue","speakers":[{"speaker":"Tania","voice":"Autonoe"},{"speaker":"Jeff","voice":"Achird"}],"turns":[{"speaker":"Tania","style":"puzzled, thinking aloud, slow; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, a gentle rise at the end of statements","text":"Eight o'clock... and nobody was upset?"}]},
{"key":"splitting-the-bill-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class."},
{"key":"splitting-the-bill-s02","kind":"dialogue","speakers":[{"speaker":"Nusrat","voice":"Leda"},{"speaker":"Jake","voice":"Fenrir"}],"turns":[{"speaker":"Jake","style":"proud and playful","text":"Didn't I tell you? Best tacos in Austin. I found this place last year."},{"speaker":"Nusrat","style":"happy, full, warm; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels","text":"You were right, Jake. It was delicious."}]},
{"key":"splitting-the-bill-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Then the waiter brings the bill. Just one bill, for six people."},
{"key":"splitting-the-bill-s04","kind":"dialogue","speakers":[{"speaker":"Nusrat","voice":"Leda"},{"speaker":"Jake","voice":"Fenrir"}],"turns":[{"speaker":"Nusrat","style":"teasing lightly, but half serious; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels","text":"So, Jake... this was your idea. Are you paying tonight?"},{"speaker":"Jake","style":"amused and relaxed","text":"<laugh> Me? No way! We'll just split it. Everybody pays for what they had."}]},
{"key":"splitting-the-bill-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Everybody takes out their phone. They look at the bill and do some math."},
{"key":"splitting-the-bill-s06","kind":"dialogue","speakers":[{"speaker":"Nusrat","voice":"Leda"},{"speaker":"Jake","voice":"Fenrir"}],"turns":[{"speaker":"Jake","style":"reading numbers off his phone, easy-going","text":"Okay, I had the fish tacos and a soda. That's fourteen fifty, plus the tip."},{"speaker":"Nusrat","style":"generous and a little urgent; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels","text":"Wait, wait. Please, let me pay for everyone. It's no problem!"},{"speaker":"Jake","style":"gentle and friendly, completely sure","text":"That's really nice, Nusrat, but no. Just pay for yours. Really, it's fine."}]},
{"key":"splitting-the-bill-s07","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill. Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun."},
{"key":"splitting-the-bill-s08","kind":"dialogue","speakers":[{"speaker":"Nusrat","voice":"Leda"},{"speaker":"Jake","voice":"Fenrir"}],"turns":[{"speaker":"Nusrat","style":"amused and puzzled, softly; light Bangladeshi accent: soft tapped r, dental t and d, quick even rhythm, warm open vowels","text":"Nobody even tried to pay for me..."}]},
{"key":"disagreeing-in-the-meeting-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan."},
{"key":"disagreeing-in-the-meeting-s02","kind":"dialogue","speakers":[{"speaker":"Richard","voice":"Alnilam"},{"speaker":"Ryan","voice":"Algieba"}],"turns":[{"speaker":"Richard","style":"confident, wrapping up a presentation","text":"So that's the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts?"}]},
{"key":"disagreeing-in-the-meeting-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Ryan is twenty-six. He has worked here for two years. He puts up his hand."},
{"key":"disagreeing-in-the-meeting-s04","kind":"dialogue","speakers":[{"speaker":"Richard","voice":"Alnilam"},{"speaker":"Ryan","voice":"Algieba"}],"turns":[{"speaker":"Ryan","style":"calm and polite, direct","text":"Honestly, I don't think that will work. Can I say why?"},{"speaker":"Richard","style":"neutral, genuinely open","text":"Sure. Go ahead."},{"speaker":"Ryan","style":"clear and organised, counting his points","text":"Okay. First, Tuesday is already our busiest day. Second, two of our drivers don't work on Tuesdays. And third, our biggest customer wants Monday deliveries."}]},
{"key":"disagreeing-in-the-meeting-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The room is quiet. Richard listens. He writes something down."},
{"key":"disagreeing-in-the-meeting-s06","kind":"dialogue","speakers":[{"speaker":"Richard","voice":"Alnilam"},{"speaker":"Ryan","voice":"Algieba"}],"turns":[{"speaker":"Richard","style":"thoughtful, then appreciative","text":"Hmm. The drivers... I didn't know that. Good point. Thanks, Ryan."},{"speaker":"Ryan","style":"relaxed, simple","text":"Sure."}]},
{"key":"disagreeing-in-the-meeting-s07","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard."},
{"key":"the-boss-stacks-chairs-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The office party is over. Tanvir is a new intern. It is his first week. Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs."},
{"key":"the-boss-stacks-chairs-s02","kind":"dialogue","speakers":[{"speaker":"Tanvir","voice":"Umbriel"},{"speaker":"Dave","voice":"Zubenelgenubi"}],"turns":[{"speaker":"Tanvir","style":"anxious and respectful, hurrying; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w","text":"Sir! Sir, please, let me do that. You don't have to."},{"speaker":"Dave","style":"amused and kind, completely relaxed","text":"<laugh> Sir? Please, it's Dave. And it's fine, I've got these."},{"speaker":"Tanvir","style":"hesitant, trying the first name for the first time; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w","text":"Okay, s... Dave."}]},
{"key":"the-boss-stacks-chairs-s03","kind":"dialogue","speakers":[{"speaker":"Tanvir","voice":"Umbriel"},{"speaker":"Dave","voice":"Zubenelgenubi"}],"turns":[{"speaker":"Dave","style":"casual, practical","text":"Hey, can you grab that box? The car's just outside. I'll take the heavy one."}]},
{"key":"the-boss-stacks-chairs-s04","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Together they carry the boxes out to the car. Later, the cleaning is almost finished. Dave goes into the kitchen."},
{"key":"the-boss-stacks-chairs-s05","kind":"dialogue","speakers":[{"speaker":"Tanvir","voice":"Umbriel"},{"speaker":"Dave","voice":"Zubenelgenubi"}],"turns":[{"speaker":"Dave","style":"calling out cheerfully to the next room","text":"Who wants coffee? I'm making a pot."},{"speaker":"Dave","style":"friendly and offhand","text":"Here you go, Tanvir. The milk's in the fridge."},{"speaker":"Tanvir","style":"quiet, amazed, grateful; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, v sounds close to b-w","text":"Thank you... Dave."}]},
{"key":"the-boss-stacks-chairs-s06","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Tanvir holds the cup with both hands. The boss made him coffee."},
{"key":"what-do-you-think-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story."},
{"key":"what-do-you-think-s02","kind":"dialogue","speakers":[{"speaker":"Farhana","voice":"Achernar"},{"speaker":"Novak","voice":"Rasalgethi"}],"turns":[{"speaker":"Novak","style":"open and curious, relaxed","text":"So... what do you think?"}]},
{"key":"what-do-you-think-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Nobody speaks. Farhana looks down at her book. Dr. Novak doesn't say anything. He just waits. Five seconds. Ten seconds."},
{"key":"what-do-you-think-s04","kind":"dialogue","speakers":[{"speaker":"Farhana","voice":"Achernar"},{"speaker":"Novak","voice":"Rasalgethi"}],"turns":[{"speaker":"Novak","style":"patient and encouraging, unhurried","text":"It's okay. There's no right answer. I actually want to know your opinion."},{"speaker":"Farhana","style":"whispering to herself, unsure; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress","text":"<whispers> My opinion? But he is the teacher..."},{"speaker":"Novak","style":"gentle, inviting","text":"Farhana? You look like you have an idea."},{"speaker":"Farhana","style":"hesitant at first, then a little steadier; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress","text":"Um... I think the father was wrong. He didn't listen to his son."},{"speaker":"Novak","style":"genuinely delighted and curious","text":"Interesting! Why do you think that? Tell me more."}]},
{"key":"what-do-you-think-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class."},
{"key":"what-do-you-think-s06","kind":"dialogue","speakers":[{"speaker":"Farhana","voice":"Achernar"},{"speaker":"Novak","voice":"Rasalgethi"}],"turns":[{"speaker":"Farhana","style":"surprised, thinking aloud; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, very gentle stress","text":"Twenty percent... just for talking?"}]},
{"key":"the-neighbours-tree-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's autumn in Portland. Leaves from the neighbour's big maple tree keep falling into Bill's roof gutter."},
{"key":"the-neighbours-tree-s02","kind":"dialogue","speakers":[{"speaker":"Bill","voice":"Algenib"},{"speaker":"Mike","voice":"Sadachbia"}],"turns":[{"speaker":"Bill","style":"tired, grumbling to himself","text":"<groan> Again? That's the third time this week."}]},
{"key":"the-neighbours-tree-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Bill walks next door and knocks."},
{"key":"the-neighbours-tree-s04","kind":"dialogue","speakers":[{"speaker":"Bill","voice":"Algenib"},{"speaker":"Mike","voice":"Sadachbia"}],"turns":[{"speaker":"Mike","style":"surprised and friendly","text":"Oh, hey, Bill! What's up?"},{"speaker":"Bill","style":"friendly and direct, with a small smile","text":"Hey, Mike. So... your maple's filling my gutter. Can we figure something out?"}]},
{"key":"the-neighbours-tree-s05","kind":"dialogue","speakers":[{"speaker":"Bill","voice":"Algenib"},{"speaker":"Mike","voice":"Sadachbia"}],"turns":[{"speaker":"Mike","style":"apologetic, then helpful","text":"Oh, man, I'm sorry. I didn't know. What if I cut back those big branches over your roof?"},{"speaker":"Bill","style":"relieved and practical","text":"That'd be great. And I'll clean the gutter one more time. Deal?"},{"speaker":"Mike","style":"warm, decided","text":"Deal."}]},
{"key":"the-neighbours-tree-s06","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"They talk for four minutes. They shake hands. And that's it. The next morning, neither man says anything about the tree. They just wave."},
{"key":"the-neighbours-tree-s07","kind":"dialogue","speakers":[{"speaker":"Bill","voice":"Algenib"},{"speaker":"Mike","voice":"Sadachbia"}],"turns":[{"speaker":"Mike","style":"cheerful, calling from a car window","text":"Morning, Bill!"},{"speaker":"Bill","style":"friendly, calling back","text":"Morning!"}]},
{"key":"back-of-the-line-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line. A man in a suit walks in. He looks at his watch. He is in a hurry."},
{"key":"back-of-the-line-s02","kind":"dialogue","speakers":[{"speaker":"Brad","voice":"Orus"},{"speaker":"Carla","voice":"Pulcherrima"}],"turns":[{"speaker":"Brad","style":"rushed, polite on the surface, moving fast","text":"Excuse me... sorry... excuse me."}]},
{"key":"back-of-the-line-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"He walks past everyone, straight to the front."},
{"key":"back-of-the-line-s04","kind":"dialogue","speakers":[{"speaker":"Brad","voice":"Orus"},{"speaker":"Carla","voice":"Pulcherrima"}],"turns":[{"speaker":"Brad","style":"charming and quick, sure it will work","text":"Hi. I just have one quick question. It'll only take ten seconds."},{"speaker":"Carla","style":"warm and smiling, completely firm","text":"Sure, I'm happy to help. The line starts back there."},{"speaker":"Brad","style":"deflated, flat","text":"Oh. Right. Okay."}]},
{"key":"back-of-the-line-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"He walks to the back of the line. Nobody looks angry. And nobody says, \"You can go first.\""},
{"key":"back-of-the-line-s06","kind":"dialogue","speakers":[{"speaker":"Brad","voice":"Orus"},{"speaker":"Carla","voice":"Pulcherrima"}],"turns":[{"speaker":"Carla","style":"bright and friendly, calling down the line","text":"Next, please!"}]},
{"key":"tell-them-what-you-did-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Arif and Tyler are students in Atlanta. They are waiting for the same internship interview."},
{"key":"tell-them-what-you-did-s02","kind":"dialogue","speakers":[{"speaker":"Arif","voice":"Iapetus"},{"speaker":"Tyler","voice":"Puck"}],"turns":[{"speaker":"Tyler","style":"relaxed and friendly","text":"Nervous? Don't be. Just tell them what you did."},{"speaker":"Arif","style":"uncertain, quiet; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end","text":"Tell them what I did? Okay..."}]},
{"key":"tell-them-what-you-did-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The interviewer asks each of them the same question: \"Tell us about your biggest achievement.\""},
{"key":"tell-them-what-you-did-s04","kind":"dialogue","speakers":[{"speaker":"Arif","voice":"Iapetus"},{"speaker":"Tyler","voice":"Puck"}],"turns":[{"speaker":"Tyler","style":"confident and bright, proud","text":"Sure. Last year I led a team of five, and we grew our club's membership by forty percent. I'm really proud of that."},{"speaker":"Arif","style":"modest and soft, eyes down; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end","text":"Oh... I helped a little with a charity project. But really, it was the team's work."}]},
{"key":"tell-them-what-you-did-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families. One week later, the email arrives."},
{"key":"tell-them-what-you-did-s06","kind":"dialogue","speakers":[{"speaker":"Arif","voice":"Iapetus"},{"speaker":"Tyler","voice":"Puck"}],"turns":[{"speaker":"Tyler","style":"excited, a burst of joy","text":"Yes! I got it!"}]},
{"key":"tell-them-what-you-did-s07","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Arif reads his email too. It says, \"Thank you for your interest.\""},
{"key":"tell-them-what-you-did-s08","kind":"dialogue","speakers":[{"speaker":"Arif","voice":"Iapetus"},{"speaker":"Tyler","voice":"Puck"}],"turns":[{"speaker":"Arif","style":"quiet and disappointed; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, sentences that fall softly at the end","text":"<sigh> But I did so much..."}]},
{"key":"honestly-im-annoyed-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Mahin is from Dhaka. He is doing a group project in the library with three American classmates. Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it."},
{"key":"honestly-im-annoyed-s02","kind":"dialogue","speakers":[{"speaker":"Hannah","voice":"Kore"},{"speaker":"Ethan","voice":"Zephyr"}],"turns":[{"speaker":"Ethan","style":"cheerful, completely unaware","text":"Morning, guys! Oh, did anyone finish the slides?"},{"speaker":"Hannah","style":"calm but clearly upset, direct","text":"Honestly, Ethan, I'm annoyed. I did your part last night. I was up until two."},{"speaker":"Ethan","style":"taken aback, then sincere","text":"Oh no. You're right. I totally forgot. I'm really sorry, Hannah."},{"speaker":"Hannah","style":"softening, sincere","text":"Okay. Thank you for saying that."}]},
{"key":"honestly-im-annoyed-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Mahin looks down at the table. In Dhaka, a friendship could end right here. But ten minutes later..."},
{"key":"honestly-im-annoyed-s04","kind":"dialogue","speakers":[{"speaker":"Hannah","voice":"Kore"},{"speaker":"Ethan","voice":"Zephyr"}],"turns":[{"speaker":"Ethan","style":"laughing, delighted","text":"<laugh> Wait, did you really put a cat on slide nine?"},{"speaker":"Hannah","style":"laughing, playful","text":"It was two in the morning! I needed a cat."}]},
{"key":"honestly-im-annoyed-s05","kind":"dialogue","speakers":[{"speaker":"Hannah","voice":"Kore"},{"speaker":"Ethan","voice":"Zephyr"}],"turns":[{"speaker":"Ethan","style":"warm and friendly","text":"Coffee? It's on me. I owe you."},{"speaker":"Hannah","style":"teasing, smiling","text":"You definitely owe me."}]},
{"key":"leave-the-snake-alone-s01","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina. One morning, in the back garden, he sees a long black snake near the vegetables."},
{"key":"leave-the-snake-alone-s02","kind":"dialogue","speakers":[{"speaker":"Imran","voice":"Enceladus"},{"speaker":"Kathy","voice":"Aoede"}],"turns":[{"speaker":"Imran","style":"alarmed, loud and fast; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply","text":"A snake! Wait, I'll get a stick!"},{"speaker":"Kathy","style":"urgent but calm, the way you stop a child touching a hot stove","text":"No, no, no! Imran, leave him. He lives here."},{"speaker":"Imran","style":"confused, rising pitch; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply","text":"He lives here? But... it's a snake!"},{"speaker":"Kathy","style":"relaxed and fond, then calling happily to the house","text":"He's a black rat snake. He's not dangerous, and he eats the mice. Kids! Come and see!"}]},
{"key":"leave-the-snake-alone-s03","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The children come out. They watch the snake from a few steps away. Slowly, the snake slides under the shed."},
{"key":"leave-the-snake-alone-s04","kind":"dialogue","speakers":[{"speaker":"Imran","voice":"Enceladus"},{"speaker":"Kathy","voice":"Aoede"}],"turns":[{"speaker":"Kathy","style":"fond and amused, quietly","text":"Bye, buddy. See you later."}]},
{"key":"leave-the-snake-alone-s05","kind":"narration","voice":"Sulafat","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild."},
{"key":"leave-the-snake-alone-s06","kind":"dialogue","speakers":[{"speaker":"Imran","voice":"Enceladus"},{"speaker":"Kathy","voice":"Aoede"}],"turns":[{"speaker":"Imran","style":"puzzled and curious, slow; light Bangladeshi accent: soft tapped r, dental t and d, even syllable timing, questions that rise sharply","text":"Nobody cuts it... on purpose?"}]}]
''')

def dialogue(t):
    return client.interactions.create(
        model=MODEL,
        input=[{"type": "user_input", "content": [
            {"type": "text", "text": turn["text"],               # verbatim, tags and all
             "annotations": [{"type": "speech_metadata",
                              "speaker": turn["speaker"], "style": turn["style"]}]}
            for turn in t["turns"]]}],
        response_format={"type": "audio"},
        generation_config={"speech_config": {
            "mode": "conversational",
            "speakers": [{"speaker": s["speaker"], "voice": s["voice"]} for s in t["speakers"]],
        }},
    )

def narration(t):
    return client.interactions.create(
        model=MODEL,
        input=[{"type": "user_input", "content": [
            {"type": "text", "text": t["text"],
             "annotations": [{"type": "speech_metadata", "style": t["style"]}]}]}],
        response_format={"type": "audio"},
        generation_config={"speech_config": [{"voice": t["voice"]}]},
    )

for t in TAKES:
    out = DRY / (t["key"] + ".wav")
    if out.exists():
        continue
    reply = dialogue(t) if t["kind"] == "dialogue" else narration(t)
    out.write_bytes(base64.b64decode(reply.output_audio.data))
    print("wrote", out)
```

Check the SDK's current call shape before running — these fields have moved
before. Record one scene, listen to every take, then run the rest.

## After recording

**1 · Audition each take.** Listen for: a tag read aloud; a reply that does not
land on the line before it (re-run the take — do not split it); a character who
sounds like someone else; a Bangladeshi accent that is too strong, or gone; a
word that is not in the transcript (the aligner will flag it too).

**2 · Assemble.** `python3 ethnographic-interviews/tools/assemble_scenes.py` —
or name one scene. It trims each take, levels them all to the same speech
loudness, lays the room's tone under dialogue takes (low-passed at 3.2 kHz, seeded
per room so a room sounds continuous across takes; narration stays dry), joins them
with pauses (longer where the panel changes), peak-limits, and writes
`scene/<id>.mp3` plus `scene/_build/<id>.json`. It prints the 2–5 kHz
speech-to-bed ratio of every dialogue take — **keep it above 20 dB**; if one
falls below, lower that room's recipe in `SCENE_BEDS` in `scenes.js` and
re-run. It never touches the dry takes.

**3 · Align.** `python3 ethnographic-interviews/tools/align_scenes.py` (needs
`openai-whisper`). It times every word of every take against the lines in
`scenes.js` and writes `scene-timings.js`. **Re-run it whenever a take is
re-recorded or re-assembled** — without it the page only estimates where each line
starts, and the panels and highlighting drift.

**4 · Listen through on the page**, all three listens, on a phone and on the projector.

---

## Checklists

### Takes — 67

| Take | Kind | Speakers | Tags | Recorded | Auditioned |
|---|---|---|---|:-:|:-:|
| `dinner-ends-at-eight-s01` | narration | Narrator |  | ☐ | ☐ |
| `dinner-ends-at-eight-s02` | dialogue | Jeff + Tania |  | ☐ | ☐ |
| `dinner-ends-at-eight-s03` | narration | Narrator |  | ☐ | ☐ |
| `dinner-ends-at-eight-s04` | dialogue | Jeff |  | ☐ | ☐ |
| `dinner-ends-at-eight-s05` | narration | Narrator |  | ☐ | ☐ |
| `dinner-ends-at-eight-s06` | dialogue | Jeff + Tania |  | ☐ | ☐ |
| `dinner-ends-at-eight-s07` | narration | Narrator |  | ☐ | ☐ |
| `dinner-ends-at-eight-s08` | dialogue | Tania |  | ☐ | ☐ |
| `splitting-the-bill-s01` | narration | Narrator |  | ☐ | ☐ |
| `splitting-the-bill-s02` | dialogue | Jake + Nusrat |  | ☐ | ☐ |
| `splitting-the-bill-s03` | narration | Narrator |  | ☐ | ☐ |
| `splitting-the-bill-s04` | dialogue | Nusrat + Jake | `&lt;laugh&gt;` | ☐ | ☐ |
| `splitting-the-bill-s05` | narration | Narrator |  | ☐ | ☐ |
| `splitting-the-bill-s06` | dialogue | Jake + Nusrat |  | ☐ | ☐ |
| `splitting-the-bill-s07` | narration | Narrator |  | ☐ | ☐ |
| `splitting-the-bill-s08` | dialogue | Nusrat |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s01` | narration | Narrator |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s02` | dialogue | Richard |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s03` | narration | Narrator |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s04` | dialogue | Ryan + Richard |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s05` | narration | Narrator |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s06` | dialogue | Richard + Ryan |  | ☐ | ☐ |
| `disagreeing-in-the-meeting-s07` | narration | Narrator |  | ☐ | ☐ |
| `the-boss-stacks-chairs-s01` | narration | Narrator |  | ☐ | ☐ |
| `the-boss-stacks-chairs-s02` | dialogue | Tanvir + Dave | `&lt;laugh&gt;` | ☐ | ☐ |
| `the-boss-stacks-chairs-s03` | dialogue | Dave |  | ☐ | ☐ |
| `the-boss-stacks-chairs-s04` | narration | Narrator |  | ☐ | ☐ |
| `the-boss-stacks-chairs-s05` | dialogue | Dave + Tanvir |  | ☐ | ☐ |
| `the-boss-stacks-chairs-s06` | narration | Narrator |  | ☐ | ☐ |
| `what-do-you-think-s01` | narration | Narrator |  | ☐ | ☐ |
| `what-do-you-think-s02` | dialogue | Dr. Novak |  | ☐ | ☐ |
| `what-do-you-think-s03` | narration | Narrator |  | ☐ | ☐ |
| `what-do-you-think-s04` | dialogue | Dr. Novak + Farhana | `&lt;whispers&gt;` | ☐ | ☐ |
| `what-do-you-think-s05` | narration | Narrator |  | ☐ | ☐ |
| `what-do-you-think-s06` | dialogue | Farhana |  | ☐ | ☐ |
| `the-neighbours-tree-s01` | narration | Narrator |  | ☐ | ☐ |
| `the-neighbours-tree-s02` | dialogue | Bill | `&lt;groan&gt;` | ☐ | ☐ |
| `the-neighbours-tree-s03` | narration | Narrator |  | ☐ | ☐ |
| `the-neighbours-tree-s04` | dialogue | Mike + Bill |  | ☐ | ☐ |
| `the-neighbours-tree-s05` | dialogue | Mike + Bill |  | ☐ | ☐ |
| `the-neighbours-tree-s06` | narration | Narrator |  | ☐ | ☐ |
| `the-neighbours-tree-s07` | dialogue | Mike + Bill |  | ☐ | ☐ |
| `back-of-the-line-s01` | narration | Narrator |  | ☐ | ☐ |
| `back-of-the-line-s02` | dialogue | Brad |  | ☐ | ☐ |
| `back-of-the-line-s03` | narration | Narrator |  | ☐ | ☐ |
| `back-of-the-line-s04` | dialogue | Brad + Carla |  | ☐ | ☐ |
| `back-of-the-line-s05` | narration | Narrator |  | ☐ | ☐ |
| `back-of-the-line-s06` | dialogue | Carla |  | ☐ | ☐ |
| `tell-them-what-you-did-s01` | narration | Narrator |  | ☐ | ☐ |
| `tell-them-what-you-did-s02` | dialogue | Tyler + Arif |  | ☐ | ☐ |
| `tell-them-what-you-did-s03` | narration | Narrator |  | ☐ | ☐ |
| `tell-them-what-you-did-s04` | dialogue | Tyler + Arif |  | ☐ | ☐ |
| `tell-them-what-you-did-s05` | narration | Narrator |  | ☐ | ☐ |
| `tell-them-what-you-did-s06` | dialogue | Tyler |  | ☐ | ☐ |
| `tell-them-what-you-did-s07` | narration | Narrator |  | ☐ | ☐ |
| `tell-them-what-you-did-s08` | dialogue | Arif | `&lt;sigh&gt;` | ☐ | ☐ |
| `honestly-im-annoyed-s01` | narration | Narrator |  | ☐ | ☐ |
| `honestly-im-annoyed-s02` | dialogue | Ethan + Hannah |  | ☐ | ☐ |
| `honestly-im-annoyed-s03` | narration | Narrator |  | ☐ | ☐ |
| `honestly-im-annoyed-s04` | dialogue | Ethan + Hannah | `&lt;laugh&gt;` | ☐ | ☐ |
| `honestly-im-annoyed-s05` | dialogue | Ethan + Hannah |  | ☐ | ☐ |
| `leave-the-snake-alone-s01` | narration | Narrator |  | ☐ | ☐ |
| `leave-the-snake-alone-s02` | dialogue | Imran + Kathy |  | ☐ | ☐ |
| `leave-the-snake-alone-s03` | narration | Narrator |  | ☐ | ☐ |
| `leave-the-snake-alone-s04` | dialogue | Kathy |  | ☐ | ☐ |
| `leave-the-snake-alone-s05` | narration | Narrator |  | ☐ | ☐ |
| `leave-the-snake-alone-s06` | dialogue | Imran |  | ☐ | ☐ |

### Scenes — 10

| Scene file | Takes | Assembled (SNR ≥ 20 dB) | Aligned | Checked on the page |
|---|---|:-:|:-:|:-:|
| `scene/dinner-ends-at-eight.mp3` | 8 | ☐ | ☐ | ☐ |
| `scene/splitting-the-bill.mp3` | 8 | ☐ | ☐ | ☐ |
| `scene/disagreeing-in-the-meeting.mp3` | 7 | ☐ | ☐ | ☐ |
| `scene/the-boss-stacks-chairs.mp3` | 6 | ☐ | ☐ | ☐ |
| `scene/what-do-you-think.mp3` | 6 | ☐ | ☐ | ☐ |
| `scene/the-neighbours-tree.mp3` | 7 | ☐ | ☐ | ☐ |
| `scene/back-of-the-line.mp3` | 6 | ☐ | ☐ | ☐ |
| `scene/tell-them-what-you-did.mp3` | 8 | ☐ | ☐ | ☐ |
| `scene/honestly-im-annoyed.mp3` | 5 | ☐ | ☐ | ☐ |
| `scene/leave-the-snake-alone.mp3` | 6 | ☐ | ☐ | ☐ |

### Panels — 60 images

| File | Scene | Generated | Continuity checked | webp + jpg | Placed |
|---|---|:-:|:-:|:-:|:-:|
| `panels/dinner-ends-at-eight-1` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/dinner-ends-at-eight-2` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/dinner-ends-at-eight-3` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/dinner-ends-at-eight-4` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/dinner-ends-at-eight-5` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/dinner-ends-at-eight-6` | The Dinner That Ends at Eight | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-1` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-2` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-3` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-4` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-5` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/splitting-the-bill-6` | Six Friends, Six Payments | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-1` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-2` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-3` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-4` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-5` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/disagreeing-in-the-meeting-6` | The Junior Who Said No | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-1` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-2` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-3` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-4` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-5` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/the-boss-stacks-chairs-6` | The Director Stacking Chairs | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-1` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-2` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-3` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-4` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-5` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/what-do-you-think-6` | “What Do You Think?” | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-1` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-2` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-3` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-4` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-5` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/the-neighbours-tree-6` | The Neighbour’s Tree | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-1` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-2` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-3` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-4` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-5` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/back-of-the-line-6` | Back of the Line | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-1` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-2` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-3` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-4` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-5` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/tell-them-what-you-did-6` | Tell Them What You Did | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-1` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-2` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-3` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-4` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-5` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/honestly-im-annoyed-6` | Honestly, I’m Annoyed | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-1` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-2` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-3` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-4` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-5` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |
| `panels/leave-the-snake-alone-6` | Leave the Snake Alone | ☐ | ☐ | ☐ | ☐ |

### Portraits — 20 images

| File | Character | Scene | Generated | Cropped | Placed |
|---|---|---|:-:|:-:|:-:|
| `cast/tania.jpg` | Tania | The Dinner That Ends at Eight | ☐ | ☐ | ☐ |
| `cast/jeff.jpg` | Jeff | The Dinner That Ends at Eight | ☐ | ☐ | ☐ |
| `cast/nusrat.jpg` | Nusrat | Six Friends, Six Payments | ☐ | ☐ | ☐ |
| `cast/jake.jpg` | Jake | Six Friends, Six Payments | ☐ | ☐ | ☐ |
| `cast/richard.jpg` | Richard | The Junior Who Said No | ☐ | ☐ | ☐ |
| `cast/ryan.jpg` | Ryan | The Junior Who Said No | ☐ | ☐ | ☐ |
| `cast/tanvir.jpg` | Tanvir | The Director Stacking Chairs | ☐ | ☐ | ☐ |
| `cast/dave.jpg` | Dave | The Director Stacking Chairs | ☐ | ☐ | ☐ |
| `cast/farhana.jpg` | Farhana | “What Do You Think?” | ☐ | ☐ | ☐ |
| `cast/novak.jpg` | Dr. Novak | “What Do You Think?” | ☐ | ☐ | ☐ |
| `cast/bill.jpg` | Bill | The Neighbour’s Tree | ☐ | ☐ | ☐ |
| `cast/mike.jpg` | Mike | The Neighbour’s Tree | ☐ | ☐ | ☐ |
| `cast/brad.jpg` | Brad | Back of the Line | ☐ | ☐ | ☐ |
| `cast/carla.jpg` | Carla | Back of the Line | ☐ | ☐ | ☐ |
| `cast/arif.jpg` | Arif | Tell Them What You Did | ☐ | ☐ | ☐ |
| `cast/tyler.jpg` | Tyler | Tell Them What You Did | ☐ | ☐ | ☐ |
| `cast/hannah.jpg` | Hannah | Honestly, I’m Annoyed | ☐ | ☐ | ☐ |
| `cast/ethan.jpg` | Ethan | Honestly, I’m Annoyed | ☐ | ☐ | ☐ |
| `cast/imran.jpg` | Imran | Leave the Snake Alone | ☐ | ☐ | ☐ |
| `cast/kathy.jpg` | Kathy | Leave the Snake Alone | ☐ | ☐ | ☐ |

---

Sources for the API limits above: [Gemini API — Text-to-speech generation](https://ai.google.dev/gemini-api/docs/speech-generation).
