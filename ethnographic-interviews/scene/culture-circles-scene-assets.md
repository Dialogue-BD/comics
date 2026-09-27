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
| Audio | **117 recordings** — one per line (1300 words, about 10 minutes in total) |
| Voices | 1 narrator (the same in every scene) + 20 characters |
| Comic panels | **60 images** — six square panels per scene |
| Portraits | **20 images** — one per character (the narrator has none) |

---

## What this is for

Each scenario opens with a short story told as a **wordless comic** with a
**narrator** and **two voiced characters**. Students hear it three times:

1. **Just listen** — the comic turns its own pages with the audio. Nothing to read; a face in the corner shows who is talking.
2. **Read along** — the same, with the line being spoken lit up word by word (karaoke).
3. **Explore the words** — the whole conversation as a chat, every glossed word tappable for its meaning, and any line playable on its own.

The page changes panel **exactly when a line starts**, which is why the audio is
one file per line. It also lets a student replay one line, and lets you fix one
line without re-recording a scene.

The listeners are Bangladeshi B1 students. Every recording must be **clear,
natural and a little slower than native speed** — acted, but never theatrical.
The comic must tell the story with the sound off.

## Filenames

```
ethnographic-interviews/scene/<scenario-id>-<nn>.mp3          nn = 01, 02 … in line order (the tables below)
ethnographic-interviews/scene/_dry-originals/<id>-<nn>.wav    clean TTS exports — keep, never mix into these
ethnographic-interviews/scene/panels/<scenario-id>-<n>.webp   n = 1–6, 720x720, quality 72
ethnographic-interviews/scene/panels/<scenario-id>-<n>.jpg    the same, JPEG quality 82 (fallback)
ethnographic-interviews/scene/panels/_originals/<id>-<n>.png  full-size originals from the image model
ethnographic-interviews/scene/cast/<slug>.jpg                 384x384, JPEG quality 84
ethnographic-interviews/scene/cast/_originals/<slug>.png      full-size originals
```

The page already runs without any of these (browser speech, the old strip
pictures and initials stand in), so assets can land in any order and in batches.

## Order of work

1. **Design the narrator voice once** (below) and save its `voice_…` ID.
2. **Pick the six Bangladeshi voices** from the Extended Voice Library (below). Audition them side by side — they must sound like six different people.
3. **Draw the panels, one scene at a time** — panel 1 first, then 2–6 with panel 1 attached for continuity.
4. **Draw the portraits** from each scene's panel 1, so the face matches the comic.
5. **Record the lines** (the generation script at the end does all 117).
6. **Convert, level, add room tone, align** — the steps after the script.

---

## Audio

### Model and format

- **Model:** `gemini-3.8-flash-tts` for keeper takes; `gemini-3.8-flash-lite-tts` is fine for a first draft pass. Check the current model names before running — the TTS API has changed shape across model generations.
- **Call:** the Interactions API, one call per line, single speaker. Style goes in a `speech_metadata` annotation on the transcript item; the voice goes in `generation_config.speech_config`.
- **Output:** a unary call returns a complete WAV (24 kHz mono 16-bit). Save it untouched to `scene/_dry-originals/<id>-<nn>.wav`.
- **Length:** most lines are 2–8 seconds. The whole of one scene is 45–90 seconds.

### How the fields divide

Each character has an **audio profile** (the sound of the voice only), each place
has a **scene** (the room, with the room tone on its last line), and each line
has a **style** (the delivery of that one line). They do different jobs — never
repeat one inside another, or the read goes flat.

- In the **AI Studio speech playground**: paste the character's audio profile into *Audio profile*, the room into *Scene*, the line's sample context into *Sample context*, and the line into the transcript. Put the line's style in the style field.
- Through the **API**: the voice carries the profile (a designed voice, or a prebuilt voice chosen to match it), and `speech_metadata.style` carries the line's style. The script below does this.

**Transcripts are verbatim.** The text is read exactly as written. Do not add
stage directions to it.

**Audio tags** such as `<laugh>` or `<sigh>` are written inside a few lines,
in angle brackets. They are performed, not read. If a tag is **spoken aloud**,
delete it and re-run — the words either side already carry the moment. If it
makes the delivery **too big**, cut it. The page strips tags from the transcript
students see.

### The narrator — one voice for all 10 scenes

**Designed voice** (AI Studio → Voice design, or `POST /v1beta/voices` with `type="prompted"`). Create it once, keep the `voice_…` ID, use it for every `N` line.

```text
A warm, calm female storyteller in her forties reading a picture book to adult
learners of English. Neutral general American accent. Clear, unhurried and kind;
slightly slower than normal speech, with a small natural pause at every full
stop. Friendly but never childish or sing-song. Every consonant clear, no
vocal fry, no breathiness.
```

If voice design is unavailable, use the prebuilt **Sulafat (Warm)**.

**Style for every narrator line:** `calm, warm storytelling for learners, slow and very clear, a small pause at every full stop`

**Sample context for every narrator line:**

```text
Voice-over narration for one panel of a wordless picture-book comic, heard by
Bangladeshi students learning English at B1 level. The narrator is outside the
story, setting the scene simply and warmly. Not an advertisement, not a
documentary. Read slowly enough that a learner can follow every word.
```

Narrator lines get **no room tone** — they are voice-over, dry and close.

### The six Bangladeshi voices

Six characters are Bangladeshi students or young professionals in the US:
**Tania** (The Dinner That Ends at Eight), **Nusrat** (Six Friends, Six Payments), **Tanvir** (The Director Stacking Chairs), **Farhana** (“What Do You Think?”), **Arif** (Tell Them What You Did), **Imran** (Leave the Snake Alone).
Students should hear an accent they recognise from home, speaking good, clear
English. Search the **Extended Voice Library** in the AI Studio picker
(Language: English → Accent: Bangladeshi, or South Asian / Indian if there is no
Bangladeshi entry), or:

```python
for v in client.voices.list(language_code="en", search="Bangladesh"):
    print(v.name, v.accent, v.gender, v.persona)
# if nothing: region_code="IN", or search="South Asian"
```

Pick three male and three female voices that are **clearly different from one
another**, and write the chosen voice names into the cast table below before
recording. If the library has no South Asian English voices at all, use the
fallback prebuilt voice listed for each character and describe the accent in the
style — but check it survives; the lines still have to work read in a neutral
accent.

### Returning characters

Four characters also appear in the scenario's interviews in step 3:
**Dave** (`audio/the-boss-stacks-chairs-1.mp3`), **Hannah** (`audio/honestly-im-annoyed-1.mp3`), **Ethan** (`audio/honestly-im-annoyed-2.mp3`), **Kathy** (`audio/leave-the-snake-alone-1.mp3`).
Use **the same voice as their interview take**, so students hear the same person.
Dave's interview used **Zubenelgenubi**. For the other three, check the voice
used for their interview recording; the voice listed here is a best guess and
should be swapped if it does not match.

### Cast

| Portrait | Character | Scene | Voice | Audio profile |
|---|---|---|---|---|
| — | **Narrator** | all | designed voice · fallback Sulafat | see above |
| `tania.jpg` | **Tania**, 26 | The Dinner That Ends at Eight | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, warm · fallback Autonoe | Young woman in her mid-twenties, warm clear mid-range voice, careful and slightly formal English with a soft Bangladeshi accent. Polite, rises a little at the ends of questions, stresses the key word gently rather than loudly. |
| `jeff.jpg` | **Jeff**, 42 | The Dinner That Ends at Eight | Achird (Friendly) | Warm, easy baritone, general American. Talks quickly and brightly, lots of energy in the first word of a sentence, relaxed and sure of himself. |
| `nusrat.jpg` | **Nusrat**, 22 | Six Friends, Six Payments | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, lively · fallback Leda | Young woman, bright mid-range voice with a clear Bangladeshi accent. Quick and warm, laughs easily, lifts her pitch when she is being generous. |
| `jake.jpg` | **Jake**, 23 | Six Friends, Six Payments | Fenrir (Excitable) | Young man, bright and bouncy tenor, general American with a light Texan ease. Speaks fast, smiles through his words, drops his voice when he reassures. |
| `richard.jpg` | **Richard**, 56 | The Junior Who Said No | Alnilam (Firm) | Man in his fifties, low steady baritone, general American. Measured and unhurried, slight pause before important words, sounds in charge without being cold. |
| `ryan.jpg` | **Ryan**, 26 | The Junior Who Said No | Algieba (Smooth) | Young man, smooth mid-range voice, general American. Clear and polite, speaks with calm confidence, counts his points with a small lift on each number. |
| `tanvir.jpg` | **Tanvir**, 23 | The Director Stacking Chairs | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, earnest · fallback Umbriel | Young man, earnest light baritone with a Bangladeshi accent. Respectful, a little breathless when nervous, softens the ends of his sentences. |
| `dave.jpg` | **Dave**, 49 | The Director Stacking Chairs | Zubenelgenubi (Casual) | Man in his late forties, relaxed and casual mid-baritone, general American. Laughs easily, never sounds like a boss, a friendly lift at the end of short phrases. |
| `farhana.jpg` | **Farhana**, 20 | “What Do You Think?” | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, soft · fallback Achernar | Young woman, soft and slightly breathy voice with a Bangladeshi accent. Quiet, hesitates before she starts, grows steadier as she goes. |
| `novak.jpg` | **Dr. Novak**, 54 | “What Do You Think?” | Rasalgethi (Informative) | Man in his fifties, warm and informative baritone, general American. Patient, lets silences sit, rises with real curiosity when a student speaks. |
| `bill.jpg` | **Bill**, 58 | The Neighbour’s Tree | Algenib (Gravelly) | Man in his late fifties, gravelly low voice, general American. Plain-spoken and a bit gruff, then friendly; short phrases, a smile you can hear when he relaxes. |
| `mike.jpg` | **Mike**, 47 | The Neighbour’s Tree | Sadachbia (Lively) | Man in his forties, lively warm tenor, general American. Open and easy, quick to agree, a friendly bounce in his rhythm. |
| `brad.jpg` | **Brad**, 41 | Back of the Line | Orus (Firm) | Man in his early forties, firm quick baritone, general American. Brisk and a little impatient, polite words said fast, voice drops flat when he is let down. |
| `carla.jpg` | **Carla**, 45 | Back of the Line | Pulcherrima (Forward) | Woman in her forties, clear forward alto, general American. Warm and smiling, completely steady; friendly tone, firm words, never raises her voice. |
| `arif.jpg` | **Arif**, 22 | Tell Them What You Did | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, gentle · fallback Iapetus | Young man, gentle and modest light baritone with a Bangladeshi accent. Speaks softly, lets his voice fall at the end of sentences, downplays everything. |
| `tyler.jpg` | **Tyler**, 22 | Tell Them What You Did | Puck (Upbeat) | Young man, upbeat and bright tenor, general American. Confident and fluent, strong stress on numbers and on "I", sounds pleased with himself in a friendly way. |
| `hannah.jpg` | **Hannah**, 23 | Honestly, I’m Annoyed | Kore (Firm) | Young woman, firm clear alto, general American. Calm and direct even when upset, no shouting; warmth comes back fast into her voice once it is said. |
| `ethan.jpg` | **Ethan**, 22 | Honestly, I’m Annoyed | Zephyr (Bright) | Young man, bright light tenor, general American. Cheerful and quick, drops into a sincere lower tone when he apologises, laughs easily. |
| `imran.jpg` | **Imran**, 21 | Leave the Snake Alone | Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, energetic · fallback Enceladus | Young man, energetic mid-range voice with a Bangladeshi accent. Loud and fast when alarmed, rising pitch on questions, curious and thoughtful when calm. |
| `kathy.jpg` | **Kathy**, 48 | Leave the Snake Alone | Aoede (Breezy) | Woman in her late forties, breezy warm alto with a soft Southern ease. Unhurried, amused, gently firm; fond when she talks about animals. |

---

## Pictures

### The style block

**Paste this at the top of every panel prompt and every portrait prompt, unchanged.**
It is the style of the existing three-panel strips on the page, so old and new
pictures sit together.

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
- **Continuity is everything.** Draw panel 1 first — attach the scenario's existing strip panel `strip/<id>-1.png` (or `strip/_originals/`) as a reference for the setting and style. For panels 2–6, attach panel 1 and begin the prompt with: *"Same characters, same clothing, same art style and palette as the attached image. Continue the sequence."* If a face or an outfit drifts, regenerate that panel. A student tracking "the same man" across six pictures is doing half the comprehension work.
- **Returning characters** (Dave, Hannah, Ethan, Kathy): also attach their existing portrait from `portraits/` so they look like the person in the interview.
- **Readable at 300px.** One clear action per panel, the speaker's face visible, nothing important in the bottom-left corner (the page puts the speaker's face there).

### Portraits

Draw each portrait **after** its scene's panels, attaching panel 1 so the
face, hair and clothes match. One prompt per character, in each scene section
below. Crop to a square with the face about 60% of the height, resize to
384×384, JPEG quality 84.

---

## 1 · The Dinner That Ends at Eight  —  Time

**Setting:** Chicago · a colleague invites you home

**What happens (the scenario, as the page tells it):** Your American colleague invites you to dinner. The message says: “Come at six — I’ll have to push everyone out by eight, I’ve got an early start.” At 8:05 he stands up, thanks everyone, and walks his guests to the door. Everybody smiles. Nobody looks hurt.

**Cast:** **Tania**, 26, an accountant from Rajshahi, three weeks into her first job in Chicago; **Jeff**, 42, Tania's colleague, the host.

### Rooms (the *Scene* field)

**sofa** — used by panels 1

```text
Tania's small apartment in Chicago on a weekday evening, sunset through the window.
Room tone: quiet room air, faint traffic through a closed window. Jeff's lines are a voice message played from her phone.
```

Room-tone bed: —

**home** — used by panels 2, 3, 4, 5

```text
A warm apartment in a Chicago neighbourhood on a Saturday evening, six people around a dining table.
Room tone: small-room warmth, cutlery on plates, low friendly chatter of four other guests under the speakers.
```

Room-tone bed: `air -40 dB` · `babble -34 dB` · `dish -40 dB`

**street** — used by panels 6

```text
A quiet residential street in Chicago just after eight in the evening.
Room tone: light traffic two streets away, a gentle breeze, one car door far off.
```

Room-tone bed: `wind -40 dB` · `rumble -42 dB` · `air -44 dB`

### Tania — `scene/cast/tania.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, warm · fallback Autonoe

**Audio profile**

```text
Young woman in her mid-twenties, warm clear mid-range voice, careful and slightly formal English with a soft Bangladeshi accent. Polite, rises a little at the ends of questions, stresses the key word gently rather than loudly.
```

**Sample context (for every Tania line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Tania is an accountant from Rajshahi, three weeks into her first job in Chicago. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Jeff — `scene/cast/jeff.jpg`

**Voice** Achird (Friendly)

**Audio profile**

```text
Warm, easy baritone, general American. Talks quickly and brightly, lots of energy in the first word of a sentence, relaxed and sure of himself.
```

**Sample context (for every Jeff line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Jeff is Tania's colleague, the host. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `dinner-ends-at-eight-01.mp3` | Narrator | narrator | narrator style | This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago. |
| `dinner-ends-at-eight-02.mp3` | Narrator | narrator | narrator style | One evening, her phone buzzes. It's a voice message from Jeff, a colleague. |
| `dinner-ends-at-eight-03.mp3` | Jeff | Achird | friendly and casual, a recorded voice message, a little rushed | Hi, Tania, it's Jeff! A few of us are having dinner at my place on Saturday. Want to come? |
| `dinner-ends-at-eight-04.mp3` | Jeff | Achird | cheerful and matter-of-fact, as if saying something completely normal | Come at six. I'll have to push everyone out by eight, though. I've got an early start on Sunday. |
| `dinner-ends-at-eight-05.mp3` | Tania | EVL · Autonoe | surprised, quietly repeating it to herself | Push everyone out by eight? Oh... okay. |
| `dinner-ends-at-eight-06.mp3` | Narrator | narrator | narrator style | On Saturday, Tania arrives at six o'clock exactly. She brings a box of sweets. |
| `dinner-ends-at-eight-07.mp3` | Jeff | Achird | delighted and welcoming | Tania! Come in, come in. Oh, wow, are these for us? Thank you! |
| `dinner-ends-at-eight-08.mp3` | Narrator | narrator | narrator style | The food is good. Everybody talks and laughs. Tania is having a great time. |
| `dinner-ends-at-eight-09.mp3` | Narrator | narrator | narrator style | Then, at five past eight, Jeff stands up. |
| `dinner-ends-at-eight-10.mp3` | Jeff | Achird | bright and grateful, raising his voice a little over the table | Okay, everyone, that's eight o'clock! Thank you so much for coming. This was really fun. |
| `dinner-ends-at-eight-11.mp3` | Tania | EVL · Autonoe | quiet, surprised, half to herself | Oh... is it finished already? |
| `dinner-ends-at-eight-12.mp3` | Jeff | Achird | warm, a friendly goodbye | Tania, thanks for the sweets. See you on Monday! |
| `dinner-ends-at-eight-13.mp3` | Narrator | narrator | narrator style | Everybody smiles. Everybody says goodbye. Nobody looks hurt. |
| `dinner-ends-at-eight-14.mp3` | Narrator | narrator | narrator style | Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started. |
| `dinner-ends-at-eight-15.mp3` | Tania | EVL · Autonoe | puzzled, thinking aloud, slow | Eight o'clock... and nobody was upset? |

---

## 2 · Six Friends, Six Payments  —  The Self

**Setting:** Austin, Texas · the end of a meal

**What happens (the scenario, as the page tells it):** Six American friends finish dinner. One bill arrives. Every person takes out a phone, works out what they ate, and pays their own share — including the man who suggested the restaurant in the first place. There is no argument about who pays. There is no reaching for the bill at all.

**Cast:** **Nusrat**, 22, an exchange student from Dhaka in her first term in Austin; **Jake**, 23, her classmate, who chose the restaurant.

### Rooms (the *Scene* field)

**restaurant** — used by panels 1, 2, 3, 4, 5

```text
A cosy, busy restaurant in Austin, Texas, on a Friday night. Six students at a round wooden table with candles.
Room tone: lively restaurant hum, plates and cutlery, soft background music too low to make out.
```

Room-tone bed: `babble -30 dB` · `dish -36 dB` · `clatter -40 dB` · `air -42 dB`

**street** — used by panels 6

```text
The pavement outside the restaurant, warm night air.
Room tone: light traffic, distant music from a bar, footsteps.
```

Room-tone bed: `wind -40 dB` · `rumble -42 dB` · `air -44 dB`

### Nusrat — `scene/cast/nusrat.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, lively · fallback Leda

**Audio profile**

```text
Young woman, bright mid-range voice with a clear Bangladeshi accent. Quick and warm, laughs easily, lifts her pitch when she is being generous.
```

**Sample context (for every Nusrat line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Nusrat is an exchange student from Dhaka in her first term in Austin. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Jake — `scene/cast/jake.jpg`

**Voice** Fenrir (Excitable)

**Audio profile**

```text
Young man, bright and bouncy tenor, general American with a light Texan ease. Speaks fast, smiles through his words, drops his voice when he reassures.
```

**Sample context (for every Jake line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Jake is her classmate, who chose the restaurant. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `splitting-the-bill-01.mp3` | Narrator | narrator | narrator style | Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class. |
| `splitting-the-bill-02.mp3` | Jake | Fenrir | proud and playful | Didn't I tell you? Best tacos in Austin. I found this place last year. |
| `splitting-the-bill-03.mp3` | Nusrat | EVL · Leda | happy, full, warm | You were right, Jake. It was delicious. |
| `splitting-the-bill-04.mp3` | Narrator | narrator | narrator style | Then the waiter brings the bill. Just one bill, for six people. |
| `splitting-the-bill-05.mp3` | Nusrat | EVL · Leda | teasing lightly, but half serious | So, Jake... this was your idea. Are you paying tonight? |
| `splitting-the-bill-06.mp3` | Jake | Fenrir | amused and relaxed | &lt;laugh&gt; Me? No way! We'll just split it. Everybody pays for what they had. |
| `splitting-the-bill-07.mp3` | Narrator | narrator | narrator style | Everybody takes out their phone. They look at the bill and do some math. |
| `splitting-the-bill-08.mp3` | Jake | Fenrir | reading numbers off his phone, easy-going | Okay, I had the fish tacos and a soda. That's fourteen fifty, plus the tip. |
| `splitting-the-bill-09.mp3` | Nusrat | EVL · Leda | generous and a little urgent | Wait, wait. Please, let me pay for everyone. It's no problem! |
| `splitting-the-bill-10.mp3` | Jake | Fenrir | gentle and friendly, completely sure | That's really nice, Nusrat, but no. Just pay for yours. Really, it's fine. |
| `splitting-the-bill-11.mp3` | Narrator | narrator | narrator style | One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill. |
| `splitting-the-bill-12.mp3` | Narrator | narrator | narrator style | Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun. |
| `splitting-the-bill-13.mp3` | Nusrat | EVL · Leda | amused and puzzled, softly | Nobody even tried to pay for me... |

---

## 3 · The Junior Who Said No  —  Truth

**Setting:** Boston · a Monday planning meeting

**What happens (the scenario, as the page tells it):** The director finishes presenting his plan. A twenty-six-year-old employee, two years in the job, says in front of eight people: “Honestly, I don’t think that will work — here’s why.” He gives three reasons. The director listens, writes something down, and says, “Good point. Thanks.” The meeting continues. Nobody looks embarrassed.

**Cast:** **Richard**, 56, the director presenting his plan; **Ryan**, 26, a junior analyst, two years in the job.

### Rooms (the *Scene* field)

**meeting** — used by panels 1, 2, 3, 4, 5, 6

```text
A glass-walled meeting room in a Boston logistics office on a Monday morning. Eight people around a long table, a screen at one end.
Room tone: quiet air handling, a chair creaking, one person turning a page.
```

Room-tone bed: `air -38 dB` · `fluoro -46 dB` · `presence -42 dB`

### Richard — `scene/cast/richard.jpg`

**Voice** Alnilam (Firm)

**Audio profile**

```text
Man in his fifties, low steady baritone, general American. Measured and unhurried, slight pause before important words, sounds in charge without being cold.
```

**Sample context (for every Richard line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Richard is the director presenting his plan. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Ryan — `scene/cast/ryan.jpg`

**Voice** Algieba (Smooth)

**Audio profile**

```text
Young man, smooth mid-range voice, general American. Clear and polite, speaks with calm confidence, counts his points with a small lift on each number.
```

**Sample context (for every Ryan line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Ryan is a junior analyst, two years in the job. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `disagreeing-in-the-meeting-01.mp3` | Narrator | narrator | narrator style | It's Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan. |
| `disagreeing-in-the-meeting-02.mp3` | Richard | Alnilam | confident, wrapping up a presentation | So that's the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts? |
| `disagreeing-in-the-meeting-03.mp3` | Narrator | narrator | narrator style | Ryan is twenty-six. He has worked here for two years. He puts up his hand. |
| `disagreeing-in-the-meeting-04.mp3` | Ryan | Algieba | calm and polite, direct | Honestly, I don't think that will work. Can I say why? |
| `disagreeing-in-the-meeting-05.mp3` | Richard | Alnilam | neutral, genuinely open | Sure. Go ahead. |
| `disagreeing-in-the-meeting-06.mp3` | Ryan | Algieba | clear and organised, counting his points | Okay. First, Tuesday is already our busiest day. Second, two of our drivers don't work on Tuesdays. And third, our biggest customer wants Monday deliveries. |
| `disagreeing-in-the-meeting-07.mp3` | Narrator | narrator | narrator style | The room is quiet. Richard listens. He writes something down. |
| `disagreeing-in-the-meeting-08.mp3` | Richard | Alnilam | thoughtful, then appreciative | Hmm. The drivers... I didn't know that. Good point. Thanks, Ryan. |
| `disagreeing-in-the-meeting-09.mp3` | Ryan | Algieba | relaxed, simple | Sure. |
| `disagreeing-in-the-meeting-10.mp3` | Narrator | narrator | narrator style | And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard. |

---

## 4 · The Director Stacking Chairs  —  Authority

**Setting:** Denver · after an office event

**What happens (the scenario, as the page tells it):** The event finishes. The country director — the most senior person in the building — is stacking chairs beside the newest intern and carrying boxes out to a car. The intern calls him “sir”. He laughs and says, “It’s Dave.” Later he makes the coffee for the people cleaning up.

**Cast:** **Tanvir**, 23, a new intern from Chittagong, in his first week; **Dave**, 49, the country director — the same Dave the class interviews in step 3.

### Rooms (the *Scene* field)

**hall** — used by panels 1, 2, 3

```text
A community hall in Denver just after an office event, most guests gone. Stacks of folding chairs, a few balloons.
Room tone: big empty-room echo, chairs clacking somewhere at the back, a door propped open.
```

Room-tone bed: `air -36 dB` · `presence -34 dB` · `clatter -44 dB`

**lot** — used by panels 4

```text
A parking lot outside the hall, late afternoon.
Room tone: light wind, a distant highway, a car boot opening.
```

Room-tone bed: `wind -38 dB` · `rumble -40 dB`

**kitchen** — used by panels 5, 6

```text
The small office kitchen at the back of the hall.
Room tone: a coffee maker gurgling, a fridge hum, voices of two volunteers in the next room.
```

Room-tone bed: `air -40 dB` · `mains -46 dB` · `babble -42 dB`

### Tanvir — `scene/cast/tanvir.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, earnest · fallback Umbriel

**Audio profile**

```text
Young man, earnest light baritone with a Bangladeshi accent. Respectful, a little breathless when nervous, softens the ends of his sentences.
```

**Sample context (for every Tanvir line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Tanvir is a new intern from Chittagong, in his first week. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Dave — `scene/cast/dave.jpg`

**Voice** Zubenelgenubi (Casual) · **same voice as** `audio/the-boss-stacks-chairs-1.mp3`

**Audio profile**

```text
Man in his late forties, relaxed and casual mid-baritone, general American. Laughs easily, never sounds like a boss, a friendly lift at the end of short phrases.
```

**Sample context (for every Dave line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Dave is the country director — the same Dave the class interviews in step 3. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `the-boss-stacks-chairs-01.mp3` | Narrator | narrator | narrator style | The office party is over. Tanvir is a new intern. It is his first week. |
| `the-boss-stacks-chairs-02.mp3` | Narrator | narrator | narrator style | Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs. |
| `the-boss-stacks-chairs-03.mp3` | Tanvir | EVL · Umbriel | anxious and respectful, hurrying | Sir! Sir, please, let me do that. You don't have to. |
| `the-boss-stacks-chairs-04.mp3` | Dave | Zubenelgenubi | amused and kind, completely relaxed | &lt;laugh&gt; Sir? Please, it's Dave. And it's fine, I've got these. |
| `the-boss-stacks-chairs-05.mp3` | Tanvir | EVL · Umbriel | hesitant, trying the first name for the first time | Okay, s... Dave. |
| `the-boss-stacks-chairs-06.mp3` | Dave | Zubenelgenubi | casual, practical | Hey, can you grab that box? The car's just outside. I'll take the heavy one. |
| `the-boss-stacks-chairs-07.mp3` | Narrator | narrator | narrator style | Together they carry the boxes out to the car. |
| `the-boss-stacks-chairs-08.mp3` | Narrator | narrator | narrator style | Later, the cleaning is almost finished. Dave goes into the kitchen. |
| `the-boss-stacks-chairs-09.mp3` | Dave | Zubenelgenubi | calling out cheerfully to the next room | Who wants coffee? I'm making a pot. |
| `the-boss-stacks-chairs-10.mp3` | Dave | Zubenelgenubi | friendly and offhand | Here you go, Tanvir. The milk's in the fridge. |
| `the-boss-stacks-chairs-11.mp3` | Tanvir | EVL · Umbriel | quiet, amazed, grateful | Thank you... Dave. |
| `the-boss-stacks-chairs-12.mp3` | Narrator | narrator | narrator style | Tanvir holds the cup with both hands. The boss made him coffee. |

---

## 5 · “What Do You Think?”  —  Opinion

**Setting:** A university classroom · Michigan

**What happens (the scenario, as the page tells it):** The teacher finishes the reading and asks, “So — what do you think?” Silence. He waits. Ten more seconds. He does not fill the gap. Then: “There’s no right answer, I actually want to know your opinion.” At the end of term, twenty per cent of the grade is participation.

**Cast:** **Farhana**, 20, a first-year student from Khulna in her first university class in Michigan; **Dr. Novak**, 54, the literature teacher.

### Rooms (the *Scene* field)

**classroom** — used by panels 1, 2, 3, 4, 5

```text
A mid-sized university seminar room in Michigan, twenty students at tables, afternoon light.
Room tone: a quiet heating vent, a clock ticking faintly, one chair shifting.
```

Room-tone bed: `air -40 dB` · `fan -44 dB` · `presence -42 dB`

**corridor** — used by panels 6

```text
A university corridor just after class.
Room tone: soft footsteps, distant voices, a door closing.
```

Room-tone bed: `air -40 dB` · `presence -40 dB` · `babble -44 dB`

### Farhana — `scene/cast/farhana.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, female, young adult, soft · fallback Achernar

**Audio profile**

```text
Young woman, soft and slightly breathy voice with a Bangladeshi accent. Quiet, hesitates before she starts, grows steadier as she goes.
```

**Sample context (for every Farhana line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Farhana is a first-year student from Khulna in her first university class in Michigan. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Dr. Novak — `scene/cast/novak.jpg`

**Voice** Rasalgethi (Informative)

**Audio profile**

```text
Man in his fifties, warm and informative baritone, general American. Patient, lets silences sit, rises with real curiosity when a student speaks.
```

**Sample context (for every Dr. Novak line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Dr. Novak is the literature teacher. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `what-do-you-think-01.mp3` | Narrator | narrator | narrator style | Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story. |
| `what-do-you-think-02.mp3` | Dr. Novak | Rasalgethi | open and curious, relaxed | So... what do you think? |
| `what-do-you-think-03.mp3` | Narrator | narrator | narrator style | Nobody speaks. Farhana looks down at her book. |
| `what-do-you-think-04.mp3` | Narrator | narrator | narrator style | Dr. Novak doesn't say anything. He just waits. Five seconds. Ten seconds. |
| `what-do-you-think-05.mp3` | Dr. Novak | Rasalgethi | patient and encouraging, unhurried | It's okay. There's no right answer. I actually want to know your opinion. |
| `what-do-you-think-06.mp3` | Farhana | EVL · Achernar | whispering to herself, unsure | &lt;whispers&gt; My opinion? But he is the teacher... |
| `what-do-you-think-07.mp3` | Dr. Novak | Rasalgethi | gentle, inviting | Farhana? You look like you have an idea. |
| `what-do-you-think-08.mp3` | Farhana | EVL · Achernar | hesitant at first, then a little steadier | Um... I think the father was wrong. He didn't listen to his son. |
| `what-do-you-think-09.mp3` | Dr. Novak | Rasalgethi | genuinely delighted and curious | Interesting! Why do you think that? Tell me more. |
| `what-do-you-think-10.mp3` | Narrator | narrator | narrator style | After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class. |
| `what-do-you-think-11.mp3` | Farhana | EVL · Achernar | surprised, thinking aloud | Twenty percent... just for talking? |

---

## 6 · The Neighbour’s Tree  —  Conflict

**Setting:** A suburban street · Portland

**What happens (the scenario, as the page tells it):** Leaves from the neighbour’s maple keep blocking an American man’s roof gutter. He walks next door, knocks, and says with a smile: “Hey — your maple’s filling my gutter. Can we figure something out?” They talk for four minutes. They shake hands. Neither man mentions it again, and they wave at each other the next morning.

**Cast:** **Bill**, 58, the man whose roof gutter keeps filling with leaves; **Mike**, 47, the neighbour with the maple tree.

### Rooms (the *Scene* field)

**yard** — used by panels 1, 2, 4, 5, 6

```text
Two neighbouring front gardens on a quiet suburban street in Portland, a cool grey autumn morning, wet leaves everywhere.
Room tone: light breeze through trees, leaves rustling, a crow far off.
```

Room-tone bed: `wind -38 dB` · `birds -42 dB` · `air -44 dB`

**door** — used by panels 3

```text
The front porch of the house next door.
Room tone: breeze, a wind chime once, the door swinging open.
```

Room-tone bed: `wind -40 dB` · `birds -46 dB` · `air -44 dB`

### Bill — `scene/cast/bill.jpg`

**Voice** Algenib (Gravelly)

**Audio profile**

```text
Man in his late fifties, gravelly low voice, general American. Plain-spoken and a bit gruff, then friendly; short phrases, a smile you can hear when he relaxes.
```

**Sample context (for every Bill line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Bill is the man whose roof gutter keeps filling with leaves. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Mike — `scene/cast/mike.jpg`

**Voice** Sadachbia (Lively)

**Audio profile**

```text
Man in his forties, lively warm tenor, general American. Open and easy, quick to agree, a friendly bounce in his rhythm.
```

**Sample context (for every Mike line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Mike is the neighbour with the maple tree. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `the-neighbours-tree-01.mp3` | Narrator | narrator | narrator style | It's autumn in Portland. Leaves from the neighbour's big maple tree keep falling into Bill's roof gutter. |
| `the-neighbours-tree-02.mp3` | Bill | Algenib | tired, grumbling to himself | &lt;groan&gt; Again? That's the third time this week. |
| `the-neighbours-tree-03.mp3` | Narrator | narrator | narrator style | Bill walks next door and knocks. |
| `the-neighbours-tree-04.mp3` | Mike | Sadachbia | surprised and friendly | Oh, hey, Bill! What's up? |
| `the-neighbours-tree-05.mp3` | Bill | Algenib | friendly and direct, with a small smile | Hey, Mike. So... your maple's filling my gutter. Can we figure something out? |
| `the-neighbours-tree-06.mp3` | Mike | Sadachbia | apologetic, then helpful | Oh, man, I'm sorry. I didn't know. What if I cut back those big branches over your roof? |
| `the-neighbours-tree-07.mp3` | Bill | Algenib | relieved and practical | That'd be great. And I'll clean the gutter one more time. Deal? |
| `the-neighbours-tree-08.mp3` | Mike | Sadachbia | warm, decided | Deal. |
| `the-neighbours-tree-09.mp3` | Narrator | narrator | narrator style | They talk for four minutes. They shake hands. And that's it. |
| `the-neighbours-tree-10.mp3` | Narrator | narrator | narrator style | The next morning, neither man says anything about the tree. They just wave. |
| `the-neighbours-tree-11.mp3` | Mike | Sadachbia | cheerful, calling from a car window | Morning, Bill! |
| `the-neighbours-tree-12.mp3` | Bill | Algenib | friendly, calling back | Morning! |

---

## 7 · Back of the Line  —  Fairness

**Setting:** A pharmacy · Philadelphia

**What happens (the scenario, as the page tells it):** At a busy pharmacy, eight people wait in one straight line for the counter. A well-dressed man in a hurry walks past them to the front and says, “I just have one quick question.” The pharmacist smiles and says, “Sure — the line starts back there.” He walks to the back. Nobody in the line looks angry, and nobody offers to let him go first.

**Cast:** **Brad**, 41, a man in a hurry; **Carla**, 45, the pharmacist.

### Rooms (the *Scene* field)

**pharmacy** — used by panels 1, 2, 3, 4, 5, 6

```text
A busy neighbourhood pharmacy in Philadelphia on a weekday afternoon. Eight people queue at one counter.
Room tone: bright shop hum, fluorescent buzz, a till beeping, the automatic door sliding.
```

Room-tone bed: `fluoro -40 dB` · `air -40 dB` · `babble -38 dB` · `door -46 dB`

### Brad — `scene/cast/brad.jpg`

**Voice** Orus (Firm)

**Audio profile**

```text
Man in his early forties, firm quick baritone, general American. Brisk and a little impatient, polite words said fast, voice drops flat when he is let down.
```

**Sample context (for every Brad line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Brad is a man in a hurry. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Carla — `scene/cast/carla.jpg`

**Voice** Pulcherrima (Forward)

**Audio profile**

```text
Woman in her forties, clear forward alto, general American. Warm and smiling, completely steady; friendly tone, firm words, never raises her voice.
```

**Sample context (for every Carla line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Carla is the pharmacist. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `back-of-the-line-01.mp3` | Narrator | narrator | narrator style | It's a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line. |
| `back-of-the-line-02.mp3` | Narrator | narrator | narrator style | A man in a suit walks in. He looks at his watch. He is in a hurry. |
| `back-of-the-line-03.mp3` | Brad | Orus | rushed, polite on the surface, moving fast | Excuse me... sorry... excuse me. |
| `back-of-the-line-04.mp3` | Narrator | narrator | narrator style | He walks past everyone, straight to the front. |
| `back-of-the-line-05.mp3` | Brad | Orus | charming and quick, sure it will work | Hi. I just have one quick question. It'll only take ten seconds. |
| `back-of-the-line-06.mp3` | Carla | Pulcherrima | warm and smiling, completely firm | Sure, I'm happy to help. The line starts back there. |
| `back-of-the-line-07.mp3` | Brad | Orus | deflated, flat | Oh. Right. Okay. |
| `back-of-the-line-08.mp3` | Narrator | narrator | narrator style | He walks to the back of the line. Nobody looks angry. |
| `back-of-the-line-09.mp3` | Narrator | narrator | narrator style | And nobody says, "You can go first." |
| `back-of-the-line-10.mp3` | Carla | Pulcherrima | bright and friendly, calling down the line | Next, please! |

---

## 8 · Tell Them What You Did  —  Self-Presentation

**Setting:** An internship interview · Atlanta

**What happens (the scenario, as the page tells it):** Two students interview for the same summer internship and are asked the same question: “Tell us about your biggest achievement.” The American student says, “I led a team of five, and we grew our club’s membership by forty percent. I’m proud of that.” The Bangladeshi student, who in fact organised a whole charity project, says, “I helped a little. It was really the team’s work.” The American student gets the internship.

**Cast:** **Arif**, 22, a final-year student from Rajshahi applying for a summer internship; **Tyler**, 22, an American student applying for the same internship.

### Rooms (the *Scene* field)

**waiting** — used by panels 1

```text
A quiet corridor outside an interview room at a company in Atlanta. Two chairs against the wall.
Room tone: soft air conditioning, a distant phone ringing once, muffled voices behind a door.
```

Room-tone bed: `air -38 dB` · `fan -44 dB` · `presence -44 dB`

**interview** — used by panels 2, 3, 4

```text
A small bright office, one interviewer behind a wooden desk.
Room tone: very quiet office, a pen tapping once.
```

Room-tone bed: `air -42 dB` · `presence -44 dB`

**home** — used by panels 5, 6

```text
Two different places a week later — a dorm room, a library.
Room tone: near silence, a laptop fan.
```

Room-tone bed: `air -40 dB` · `babble -34 dB` · `dish -40 dB`

### Arif — `scene/cast/arif.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, gentle · fallback Iapetus

**Audio profile**

```text
Young man, gentle and modest light baritone with a Bangladeshi accent. Speaks softly, lets his voice fall at the end of sentences, downplays everything.
```

**Sample context (for every Arif line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Arif is a final-year student from Rajshahi applying for a summer internship. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Tyler — `scene/cast/tyler.jpg`

**Voice** Puck (Upbeat)

**Audio profile**

```text
Young man, upbeat and bright tenor, general American. Confident and fluent, strong stress on numbers and on "I", sounds pleased with himself in a friendly way.
```

**Sample context (for every Tyler line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Tyler is an American student applying for the same internship. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `tell-them-what-you-did-01.mp3` | Narrator | narrator | narrator style | Arif and Tyler are students in Atlanta. They are waiting for the same internship interview. |
| `tell-them-what-you-did-02.mp3` | Tyler | Puck | relaxed and friendly | Nervous? Don't be. Just tell them what you did. |
| `tell-them-what-you-did-03.mp3` | Arif | EVL · Iapetus | uncertain, quiet | Tell them what I did? Okay... |
| `tell-them-what-you-did-04.mp3` | Narrator | narrator | narrator style | The interviewer asks each of them the same question: "Tell us about your biggest achievement." |
| `tell-them-what-you-did-05.mp3` | Tyler | Puck | confident and bright, proud | Sure. Last year I led a team of five, and we grew our club's membership by forty percent. I'm really proud of that. |
| `tell-them-what-you-did-06.mp3` | Arif | EVL · Iapetus | modest and soft, eyes down | Oh... I helped a little with a charity project. But really, it was the team's work. |
| `tell-them-what-you-did-07.mp3` | Narrator | narrator | narrator style | But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families. |
| `tell-them-what-you-did-08.mp3` | Narrator | narrator | narrator style | One week later, the email arrives. |
| `tell-them-what-you-did-09.mp3` | Tyler | Puck | excited, a burst of joy | Yes! I got it! |
| `tell-them-what-you-did-10.mp3` | Narrator | narrator | narrator style | Arif reads his email too. It says, "Thank you for your interest." |
| `tell-them-what-you-did-11.mp3` | Arif | EVL · Iapetus | quiet and disappointed | &lt;sigh&gt; But I did so much... |

---

## 9 · Honestly, I’m Annoyed  —  Feelings

**Setting:** A university library · Sacramento

**What happens (the scenario, as the page tells it):** A Bangladeshi student is doing a group project with three American classmates. One of the American classmates, Ethan, forgot to finish his part, so Hannah stayed up until 2 a.m. to do it. The next day she looks straight at him, frowns and says, “Honestly, I’m annoyed. I did your part last night.” Ethan says, “You’re right — I’m sorry.” Ten minutes later the two of them are laughing, and they go for coffee together.

**Cast:** **Hannah**, 23, an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3; **Ethan**, 22, the classmate who forgot his part — the same Ethan the class interviews in step 3.

### Rooms (the *Scene* field)

**library** — used by panels 1, 2, 3, 4, 5

```text
A group study room in a university library in Sacramento, morning. Four students round a table with laptops.
Room tone: hushed library air, a laptop fan, a book trolley rolling past outside the glass.
```

Room-tone bed: `air -40 dB` · `fan -46 dB` · `presence -44 dB`

**exit** — used by panels 6

```text
A busy campus café.
Room tone: coffee machine hiss, cups on saucers, cheerful chatter.
```

Room-tone bed: `air -38 dB` · `babble -38 dB` · `door -44 dB`

### Hannah — `scene/cast/hannah.jpg`

**Voice** Kore (Firm) · **same voice as** `audio/honestly-im-annoyed-1.mp3`

**Audio profile**

```text
Young woman, firm clear alto, general American. Calm and direct even when upset, no shouting; warmth comes back fast into her voice once it is said.
```

**Sample context (for every Hannah line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Hannah is an engineering student who stayed up to finish Ethan's part — the same Hannah the class interviews in step 3. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Ethan — `scene/cast/ethan.jpg`

**Voice** Zephyr (Bright) · **same voice as** `audio/honestly-im-annoyed-2.mp3`

**Audio profile**

```text
Young man, bright light tenor, general American. Cheerful and quick, drops into a sincere lower tone when he apologises, laughs easily.
```

**Sample context (for every Ethan line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Ethan is the classmate who forgot his part — the same Ethan the class interviews in step 3. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `honestly-im-annoyed-01.mp3` | Narrator | narrator | narrator style | Mahin is from Dhaka. He is doing a group project in the library with three American classmates. |
| `honestly-im-annoyed-02.mp3` | Narrator | narrator | narrator style | Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it. |
| `honestly-im-annoyed-03.mp3` | Ethan | Zephyr | cheerful, completely unaware | Morning, guys! Oh, did anyone finish the slides? |
| `honestly-im-annoyed-04.mp3` | Hannah | Kore | calm but clearly upset, direct | Honestly, Ethan, I'm annoyed. I did your part last night. I was up until two. |
| `honestly-im-annoyed-05.mp3` | Ethan | Zephyr | taken aback, then sincere | Oh no. You're right. I totally forgot. I'm really sorry, Hannah. |
| `honestly-im-annoyed-06.mp3` | Hannah | Kore | softening, sincere | Okay. Thank you for saying that. |
| `honestly-im-annoyed-07.mp3` | Narrator | narrator | narrator style | Mahin looks down at the table. In Dhaka, a friendship could end right here. |
| `honestly-im-annoyed-08.mp3` | Narrator | narrator | narrator style | But ten minutes later... |
| `honestly-im-annoyed-09.mp3` | Ethan | Zephyr | laughing, delighted | &lt;laugh&gt; Wait, did you really put a cat on slide nine? |
| `honestly-im-annoyed-10.mp3` | Hannah | Kore | laughing, playful | It was two in the morning! I needed a cat. |
| `honestly-im-annoyed-11.mp3` | Ethan | Zephyr | warm and friendly | Coffee? It's on me. I owe you. |
| `honestly-im-annoyed-12.mp3` | Hannah | Kore | teasing, smiling | You definitely owe me. |

---

## 10 · Leave the Snake Alone  —  Nature

**Setting:** A back garden · Asheville, North Carolina

**What happens (the scenario, as the page tells it):** A Bangladeshi student is staying with an American family. In the back garden he sees a long black snake near the vegetable beds and runs for a stick. Kathy, the mother, stops him: “No, no — leave him. He lives here.” She calls the children to watch it from a few steps away. The snake slides under the shed. Later the student notices that the family also leaves a dead tree standing and lets one corner of the garden grow wild.

**Cast:** **Imran**, 21, a student from Sylhet staying with an American family for the summer; **Kathy**, 48, the host mother — the same Kathy the class interviews in step 3.

### Rooms (the *Scene* field)

**garden** — used by panels 1, 2, 3, 4, 5, 6

```text
A sunny back garden in Asheville, North Carolina, on a summer morning: vegetable beds, a wooden shed, woods behind.
Room tone: birdsong, insects buzzing, leaves moving in a light breeze.
```

Room-tone bed: `birds -36 dB` · `wind -40 dB` · `air -44 dB`

### Imran — `scene/cast/imran.jpg`

**Voice** Extended Voice Library — English, South Asian (Bangladeshi or Indian) accent, male, young adult, energetic · fallback Enceladus

**Audio profile**

```text
Young man, energetic mid-range voice with a Bangladeshi accent. Loud and fast when alarmed, rising pitch on questions, curious and thoughtful when calm.
```

**Sample context (for every Imran line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Imran is a student from Sylhet staying with an American family for the summer. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

### Kathy — `scene/cast/kathy.jpg`

**Voice** Aoede (Breezy) · **same voice as** `audio/leave-the-snake-alone-1.mp3`

**Audio profile**

```text
Woman in her late forties, breezy warm alto with a soft Southern ease. Unhurried, amused, gently firm; fond when she talks about animals.
```

**Sample context (for every Kathy line)**

```text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. Kathy is the host mother — the same Kathy the class interviews in step 3. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
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

Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.
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

### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
| `leave-the-snake-alone-01.mp3` | Narrator | narrator | narrator style | Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina. |
| `leave-the-snake-alone-02.mp3` | Narrator | narrator | narrator style | One morning, in the back garden, he sees a long black snake near the vegetables. |
| `leave-the-snake-alone-03.mp3` | Imran | EVL · Enceladus | alarmed, loud and fast | A snake! Wait, I'll get a stick! |
| `leave-the-snake-alone-04.mp3` | Kathy | Aoede | urgent but calm, the way you stop a child touching a hot stove | No, no, no! Imran, leave him. He lives here. |
| `leave-the-snake-alone-05.mp3` | Imran | EVL · Enceladus | confused, rising pitch | He lives here? But... it's a snake! |
| `leave-the-snake-alone-06.mp3` | Kathy | Aoede | relaxed and fond, then calling happily to the house | He's a black rat snake. He's not dangerous, and he eats the mice. Kids! Come and see! |
| `leave-the-snake-alone-07.mp3` | Narrator | narrator | narrator style | The children come out. They watch the snake from a few steps away. |
| `leave-the-snake-alone-08.mp3` | Narrator | narrator | narrator style | Slowly, the snake slides under the shed. |
| `leave-the-snake-alone-09.mp3` | Kathy | Aoede | fond and amused, quietly | Bye, buddy. See you later. |
| `leave-the-snake-alone-10.mp3` | Narrator | narrator | narrator style | Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild. |
| `leave-the-snake-alone-11.mp3` | Imran | EVL · Enceladus | puzzled and curious, slow | Nobody cuts it... on purpose? |

---

## Generation script

Fill in `VOICES` first: the narrator's designed `voice_…` ID and the six
Extended Voice Library names you picked. Everything else comes from
`scenes.js`. It skips any line whose dry take already exists, so it can be
re-run after fixing a few lines (delete those takes first).

```python
# pip install google-genai
import base64, json, os, pathlib
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.8-flash-tts"          # or gemini-3.8-flash-lite-tts for a draft pass
DRY = pathlib.Path("ethnographic-interviews/scene/_dry-originals")
DRY.mkdir(parents=True, exist_ok=True)

VOICES = {
    "NARRATOR":   "voice_...",            # the designed narrator voice (fallback: "Sulafat")
    "EVL:tania": "Autonoe",   # Tania — replace with the chosen Extended Voice Library voice
    "EVL:nusrat": "Leda",   # Nusrat — replace with the chosen Extended Voice Library voice
    "EVL:tanvir": "Umbriel",   # Tanvir — replace with the chosen Extended Voice Library voice
    "EVL:farhana": "Achernar",   # Farhana — replace with the chosen Extended Voice Library voice
    "EVL:arif": "Iapetus",   # Arif — replace with the chosen Extended Voice Library voice
    "EVL:imran": "Enceladus",   # Imran — replace with the chosen Extended Voice Library voice
}

LINES = json.loads(r'''
[{"key":"dinner-ends-at-eight-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"This is Tania. She is from Rajshahi. Three weeks ago, she started a new job in Chicago.","room":null},
{"key":"dinner-ends-at-eight-02","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"One evening, her phone buzzes. It's a voice message from Jeff, a colleague.","room":null},
{"key":"dinner-ends-at-eight-03","who":"jeff","voice":"Achird","style":"friendly and casual, a recorded voice message, a little rushed","text":"Hi, Tania, it's Jeff! A few of us are having dinner at my place on Saturday. Want to come?","room":"sofa"},
{"key":"dinner-ends-at-eight-04","who":"jeff","voice":"Achird","style":"cheerful and matter-of-fact, as if saying something completely normal","text":"Come at six. I'll have to push everyone out by eight, though. I've got an early start on Sunday.","room":"sofa"},
{"key":"dinner-ends-at-eight-05","who":"tania","voice":"EVL:tania","style":"surprised, quietly repeating it to herself","text":"Push everyone out by eight? Oh... okay.","room":"sofa"},
{"key":"dinner-ends-at-eight-06","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"On Saturday, Tania arrives at six o'clock exactly. She brings a box of sweets.","room":null},
{"key":"dinner-ends-at-eight-07","who":"jeff","voice":"Achird","style":"delighted and welcoming","text":"Tania! Come in, come in. Oh, wow, are these for us? Thank you!","room":"home"},
{"key":"dinner-ends-at-eight-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The food is good. Everybody talks and laughs. Tania is having a great time.","room":null},
{"key":"dinner-ends-at-eight-09","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Then, at five past eight, Jeff stands up.","room":null},
{"key":"dinner-ends-at-eight-10","who":"jeff","voice":"Achird","style":"bright and grateful, raising his voice a little over the table","text":"Okay, everyone, that's eight o'clock! Thank you so much for coming. This was really fun.","room":"home"},
{"key":"dinner-ends-at-eight-11","who":"tania","voice":"EVL:tania","style":"quiet, surprised, half to herself","text":"Oh... is it finished already?","room":"home"},
{"key":"dinner-ends-at-eight-12","who":"jeff","voice":"Achird","style":"warm, a friendly goodbye","text":"Tania, thanks for the sweets. See you on Monday!","room":"home"},
{"key":"dinner-ends-at-eight-13","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Everybody smiles. Everybody says goodbye. Nobody looks hurt.","room":null},
{"key":"dinner-ends-at-eight-14","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Tania stands in the street. It is only a quarter past eight. In Rajshahi, a dinner party is just getting started.","room":null},
{"key":"dinner-ends-at-eight-15","who":"tania","voice":"EVL:tania","style":"puzzled, thinking aloud, slow","text":"Eight o'clock... and nobody was upset?","room":"street"},
{"key":"splitting-the-bill-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Nusrat is a student in Austin, Texas. Tonight she is having dinner with five friends from her class.","room":null},
{"key":"splitting-the-bill-02","who":"jake","voice":"Fenrir","style":"proud and playful","text":"Didn't I tell you? Best tacos in Austin. I found this place last year.","room":"restaurant"},
{"key":"splitting-the-bill-03","who":"nusrat","voice":"EVL:nusrat","style":"happy, full, warm","text":"You were right, Jake. It was delicious.","room":"restaurant"},
{"key":"splitting-the-bill-04","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Then the waiter brings the bill. Just one bill, for six people.","room":null},
{"key":"splitting-the-bill-05","who":"nusrat","voice":"EVL:nusrat","style":"teasing lightly, but half serious","text":"So, Jake... this was your idea. Are you paying tonight?","room":"restaurant"},
{"key":"splitting-the-bill-06","who":"jake","voice":"Fenrir","style":"amused and relaxed","text":"<laugh> Me? No way! We'll just split it. Everybody pays for what they had.","room":"restaurant"},
{"key":"splitting-the-bill-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Everybody takes out their phone. They look at the bill and do some math.","room":null},
{"key":"splitting-the-bill-08","who":"jake","voice":"Fenrir","style":"reading numbers off his phone, easy-going","text":"Okay, I had the fish tacos and a soda. That's fourteen fifty, plus the tip.","room":"restaurant"},
{"key":"splitting-the-bill-09","who":"nusrat","voice":"EVL:nusrat","style":"generous and a little urgent","text":"Wait, wait. Please, let me pay for everyone. It's no problem!","room":"restaurant"},
{"key":"splitting-the-bill-10","who":"jake","voice":"Fenrir","style":"gentle and friendly, completely sure","text":"That's really nice, Nusrat, but no. Just pay for yours. Really, it's fine.","room":"restaurant"},
{"key":"splitting-the-bill-11","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"One by one, everybody pays their own share. Nobody argues. Nobody reaches for the whole bill.","room":null},
{"key":"splitting-the-bill-12","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Outside, Nusrat looks at her receipt. At home, the fight to pay is half the fun.","room":null},
{"key":"splitting-the-bill-13","who":"nusrat","voice":"EVL:nusrat","style":"amused and puzzled, softly","text":"Nobody even tried to pay for me...","room":"street"},
{"key":"disagreeing-in-the-meeting-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's Monday morning in Boston. Eight people are in a planning meeting. Richard, the director, is showing his new plan.","room":null},
{"key":"disagreeing-in-the-meeting-02","who":"richard","voice":"Alnilam","style":"confident, wrapping up a presentation","text":"So that's the plan. We move all our deliveries to Tuesday, starting next month. Any thoughts?","room":"meeting"},
{"key":"disagreeing-in-the-meeting-03","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Ryan is twenty-six. He has worked here for two years. He puts up his hand.","room":null},
{"key":"disagreeing-in-the-meeting-04","who":"ryan","voice":"Algieba","style":"calm and polite, direct","text":"Honestly, I don't think that will work. Can I say why?","room":"meeting"},
{"key":"disagreeing-in-the-meeting-05","who":"richard","voice":"Alnilam","style":"neutral, genuinely open","text":"Sure. Go ahead.","room":"meeting"},
{"key":"disagreeing-in-the-meeting-06","who":"ryan","voice":"Algieba","style":"clear and organised, counting his points","text":"Okay. First, Tuesday is already our busiest day. Second, two of our drivers don't work on Tuesdays. And third, our biggest customer wants Monday deliveries.","room":"meeting"},
{"key":"disagreeing-in-the-meeting-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The room is quiet. Richard listens. He writes something down.","room":null},
{"key":"disagreeing-in-the-meeting-08","who":"richard","voice":"Alnilam","style":"thoughtful, then appreciative","text":"Hmm. The drivers... I didn't know that. Good point. Thanks, Ryan.","room":"meeting"},
{"key":"disagreeing-in-the-meeting-09","who":"ryan","voice":"Algieba","style":"relaxed, simple","text":"Sure.","room":"meeting"},
{"key":"disagreeing-in-the-meeting-10","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"And the meeting goes on. Nobody looks embarrassed. Not Ryan, and not Richard.","room":null},
{"key":"the-boss-stacks-chairs-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The office party is over. Tanvir is a new intern. It is his first week.","room":null},
{"key":"the-boss-stacks-chairs-02","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Then he sees Dave, the country director, the most senior person in the building. Dave is stacking chairs.","room":null},
{"key":"the-boss-stacks-chairs-03","who":"tanvir","voice":"EVL:tanvir","style":"anxious and respectful, hurrying","text":"Sir! Sir, please, let me do that. You don't have to.","room":"hall"},
{"key":"the-boss-stacks-chairs-04","who":"dave","voice":"Zubenelgenubi","style":"amused and kind, completely relaxed","text":"<laugh> Sir? Please, it's Dave. And it's fine, I've got these.","room":"hall"},
{"key":"the-boss-stacks-chairs-05","who":"tanvir","voice":"EVL:tanvir","style":"hesitant, trying the first name for the first time","text":"Okay, s... Dave.","room":"hall"},
{"key":"the-boss-stacks-chairs-06","who":"dave","voice":"Zubenelgenubi","style":"casual, practical","text":"Hey, can you grab that box? The car's just outside. I'll take the heavy one.","room":"lot"},
{"key":"the-boss-stacks-chairs-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Together they carry the boxes out to the car.","room":null},
{"key":"the-boss-stacks-chairs-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Later, the cleaning is almost finished. Dave goes into the kitchen.","room":null},
{"key":"the-boss-stacks-chairs-09","who":"dave","voice":"Zubenelgenubi","style":"calling out cheerfully to the next room","text":"Who wants coffee? I'm making a pot.","room":"kitchen"},
{"key":"the-boss-stacks-chairs-10","who":"dave","voice":"Zubenelgenubi","style":"friendly and offhand","text":"Here you go, Tanvir. The milk's in the fridge.","room":"kitchen"},
{"key":"the-boss-stacks-chairs-11","who":"tanvir","voice":"EVL:tanvir","style":"quiet, amazed, grateful","text":"Thank you... Dave.","room":"kitchen"},
{"key":"the-boss-stacks-chairs-12","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Tanvir holds the cup with both hands. The boss made him coffee.","room":null},
{"key":"what-do-you-think-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Farhana is in her first class at a university in Michigan. The teacher, Dr. Novak, finishes reading a short story.","room":null},
{"key":"what-do-you-think-02","who":"novak","voice":"Rasalgethi","style":"open and curious, relaxed","text":"So... what do you think?","room":"classroom"},
{"key":"what-do-you-think-03","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Nobody speaks. Farhana looks down at her book.","room":null},
{"key":"what-do-you-think-04","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Dr. Novak doesn't say anything. He just waits. Five seconds. Ten seconds.","room":null},
{"key":"what-do-you-think-05","who":"novak","voice":"Rasalgethi","style":"patient and encouraging, unhurried","text":"It's okay. There's no right answer. I actually want to know your opinion.","room":"classroom"},
{"key":"what-do-you-think-06","who":"farhana","voice":"EVL:farhana","style":"whispering to herself, unsure","text":"<whispers> My opinion? But he is the teacher...","room":"classroom"},
{"key":"what-do-you-think-07","who":"novak","voice":"Rasalgethi","style":"gentle, inviting","text":"Farhana? You look like you have an idea.","room":"classroom"},
{"key":"what-do-you-think-08","who":"farhana","voice":"EVL:farhana","style":"hesitant at first, then a little steadier","text":"Um... I think the father was wrong. He didn't listen to his son.","room":"classroom"},
{"key":"what-do-you-think-09","who":"novak","voice":"Rasalgethi","style":"genuinely delighted and curious","text":"Interesting! Why do you think that? Tell me more.","room":"classroom"},
{"key":"what-do-you-think-10","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"After class, Farhana reads the course plan. Twenty percent of the grade is for speaking in class.","room":null},
{"key":"what-do-you-think-11","who":"farhana","voice":"EVL:farhana","style":"surprised, thinking aloud","text":"Twenty percent... just for talking?","room":"corridor"},
{"key":"the-neighbours-tree-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's autumn in Portland. Leaves from the neighbour's big maple tree keep falling into Bill's roof gutter.","room":null},
{"key":"the-neighbours-tree-02","who":"bill","voice":"Algenib","style":"tired, grumbling to himself","text":"<groan> Again? That's the third time this week.","room":"yard"},
{"key":"the-neighbours-tree-03","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Bill walks next door and knocks.","room":null},
{"key":"the-neighbours-tree-04","who":"mike","voice":"Sadachbia","style":"surprised and friendly","text":"Oh, hey, Bill! What's up?","room":"door"},
{"key":"the-neighbours-tree-05","who":"bill","voice":"Algenib","style":"friendly and direct, with a small smile","text":"Hey, Mike. So... your maple's filling my gutter. Can we figure something out?","room":"door"},
{"key":"the-neighbours-tree-06","who":"mike","voice":"Sadachbia","style":"apologetic, then helpful","text":"Oh, man, I'm sorry. I didn't know. What if I cut back those big branches over your roof?","room":"yard"},
{"key":"the-neighbours-tree-07","who":"bill","voice":"Algenib","style":"relieved and practical","text":"That'd be great. And I'll clean the gutter one more time. Deal?","room":"yard"},
{"key":"the-neighbours-tree-08","who":"mike","voice":"Sadachbia","style":"warm, decided","text":"Deal.","room":"yard"},
{"key":"the-neighbours-tree-09","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"They talk for four minutes. They shake hands. And that's it.","room":null},
{"key":"the-neighbours-tree-10","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The next morning, neither man says anything about the tree. They just wave.","room":null},
{"key":"the-neighbours-tree-11","who":"mike","voice":"Sadachbia","style":"cheerful, calling from a car window","text":"Morning, Bill!","room":"yard"},
{"key":"the-neighbours-tree-12","who":"bill","voice":"Algenib","style":"friendly, calling back","text":"Morning!","room":"yard"},
{"key":"back-of-the-line-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"It's a busy afternoon at a pharmacy in Philadelphia. Eight people are waiting in one straight line.","room":null},
{"key":"back-of-the-line-02","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"A man in a suit walks in. He looks at his watch. He is in a hurry.","room":null},
{"key":"back-of-the-line-03","who":"brad","voice":"Orus","style":"rushed, polite on the surface, moving fast","text":"Excuse me... sorry... excuse me.","room":"pharmacy"},
{"key":"back-of-the-line-04","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"He walks past everyone, straight to the front.","room":null},
{"key":"back-of-the-line-05","who":"brad","voice":"Orus","style":"charming and quick, sure it will work","text":"Hi. I just have one quick question. It'll only take ten seconds.","room":"pharmacy"},
{"key":"back-of-the-line-06","who":"carla","voice":"Pulcherrima","style":"warm and smiling, completely firm","text":"Sure, I'm happy to help. The line starts back there.","room":"pharmacy"},
{"key":"back-of-the-line-07","who":"brad","voice":"Orus","style":"deflated, flat","text":"Oh. Right. Okay.","room":"pharmacy"},
{"key":"back-of-the-line-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"He walks to the back of the line. Nobody looks angry.","room":null},
{"key":"back-of-the-line-09","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"And nobody says, \"You can go first.\"","room":null},
{"key":"back-of-the-line-10","who":"carla","voice":"Pulcherrima","style":"bright and friendly, calling down the line","text":"Next, please!","room":"pharmacy"},
{"key":"tell-them-what-you-did-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Arif and Tyler are students in Atlanta. They are waiting for the same internship interview.","room":null},
{"key":"tell-them-what-you-did-02","who":"tyler","voice":"Puck","style":"relaxed and friendly","text":"Nervous? Don't be. Just tell them what you did.","room":"waiting"},
{"key":"tell-them-what-you-did-03","who":"arif","voice":"EVL:arif","style":"uncertain, quiet","text":"Tell them what I did? Okay...","room":"waiting"},
{"key":"tell-them-what-you-did-04","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The interviewer asks each of them the same question: \"Tell us about your biggest achievement.\"","room":null},
{"key":"tell-them-what-you-did-05","who":"tyler","voice":"Puck","style":"confident and bright, proud","text":"Sure. Last year I led a team of five, and we grew our club's membership by forty percent. I'm really proud of that.","room":"interview"},
{"key":"tell-them-what-you-did-06","who":"arif","voice":"EVL:arif","style":"modest and soft, eyes down","text":"Oh... I helped a little with a charity project. But really, it was the team's work.","room":"interview"},
{"key":"tell-them-what-you-did-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"But Arif did much more than help. He planned the whole project. He found thirty volunteers and raised money for two hundred families.","room":null},
{"key":"tell-them-what-you-did-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"One week later, the email arrives.","room":null},
{"key":"tell-them-what-you-did-09","who":"tyler","voice":"Puck","style":"excited, a burst of joy","text":"Yes! I got it!","room":"home"},
{"key":"tell-them-what-you-did-10","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Arif reads his email too. It says, \"Thank you for your interest.\"","room":null},
{"key":"tell-them-what-you-did-11","who":"arif","voice":"EVL:arif","style":"quiet and disappointed","text":"<sigh> But I did so much...","room":"home"},
{"key":"honestly-im-annoyed-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Mahin is from Dhaka. He is doing a group project in the library with three American classmates.","room":null},
{"key":"honestly-im-annoyed-02","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Last night, Ethan forgot to finish his part. So Hannah stayed up until two in the morning to do it.","room":null},
{"key":"honestly-im-annoyed-03","who":"ethan","voice":"Zephyr","style":"cheerful, completely unaware","text":"Morning, guys! Oh, did anyone finish the slides?","room":"library"},
{"key":"honestly-im-annoyed-04","who":"hannah","voice":"Kore","style":"calm but clearly upset, direct","text":"Honestly, Ethan, I'm annoyed. I did your part last night. I was up until two.","room":"library"},
{"key":"honestly-im-annoyed-05","who":"ethan","voice":"Zephyr","style":"taken aback, then sincere","text":"Oh no. You're right. I totally forgot. I'm really sorry, Hannah.","room":"library"},
{"key":"honestly-im-annoyed-06","who":"hannah","voice":"Kore","style":"softening, sincere","text":"Okay. Thank you for saying that.","room":"library"},
{"key":"honestly-im-annoyed-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Mahin looks down at the table. In Dhaka, a friendship could end right here.","room":null},
{"key":"honestly-im-annoyed-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"But ten minutes later...","room":null},
{"key":"honestly-im-annoyed-09","who":"ethan","voice":"Zephyr","style":"laughing, delighted","text":"<laugh> Wait, did you really put a cat on slide nine?","room":"library"},
{"key":"honestly-im-annoyed-10","who":"hannah","voice":"Kore","style":"laughing, playful","text":"It was two in the morning! I needed a cat.","room":"library"},
{"key":"honestly-im-annoyed-11","who":"ethan","voice":"Zephyr","style":"warm and friendly","text":"Coffee? It's on me. I owe you.","room":"exit"},
{"key":"honestly-im-annoyed-12","who":"hannah","voice":"Kore","style":"teasing, smiling","text":"You definitely owe me.","room":"exit"},
{"key":"leave-the-snake-alone-01","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Imran is a student from Sylhet. This summer, he is staying with an American family in North Carolina.","room":null},
{"key":"leave-the-snake-alone-02","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"One morning, in the back garden, he sees a long black snake near the vegetables.","room":null},
{"key":"leave-the-snake-alone-03","who":"imran","voice":"EVL:imran","style":"alarmed, loud and fast","text":"A snake! Wait, I'll get a stick!","room":"garden"},
{"key":"leave-the-snake-alone-04","who":"kathy","voice":"Aoede","style":"urgent but calm, the way you stop a child touching a hot stove","text":"No, no, no! Imran, leave him. He lives here.","room":"garden"},
{"key":"leave-the-snake-alone-05","who":"imran","voice":"EVL:imran","style":"confused, rising pitch","text":"He lives here? But... it's a snake!","room":"garden"},
{"key":"leave-the-snake-alone-06","who":"kathy","voice":"Aoede","style":"relaxed and fond, then calling happily to the house","text":"He's a black rat snake. He's not dangerous, and he eats the mice. Kids! Come and see!","room":"garden"},
{"key":"leave-the-snake-alone-07","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"The children come out. They watch the snake from a few steps away.","room":null},
{"key":"leave-the-snake-alone-08","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Slowly, the snake slides under the shed.","room":null},
{"key":"leave-the-snake-alone-09","who":"kathy","voice":"Aoede","style":"fond and amused, quietly","text":"Bye, buddy. See you later.","room":"garden"},
{"key":"leave-the-snake-alone-10","who":"narrator","voice":"NARRATOR","style":"calm, warm storytelling for learners, slow and very clear, a small pause at every full stop","text":"Later, Imran notices other things. A dead tree is still standing. And one corner of the garden is growing wild.","room":null},
{"key":"leave-the-snake-alone-11","who":"imran","voice":"EVL:imran","style":"puzzled and curious, slow","text":"Nobody cuts it... on purpose?","room":"garden"}]
''')

def voice_for(v):
    return VOICES.get(v, v)

def make(line):
    out = DRY / (line["key"] + ".wav")
    if out.exists():
        return
    interaction = client.interactions.create(
        model=MODEL,
        input=[{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": line["text"],                     # verbatim, tags and all
                "annotations": [{"type": "speech_metadata", "style": line["style"]}],
            }],
        }],
        response_format={"type": "audio"},
        generation_config={"speech_config": [{"voice": voice_for(line["voice"])}]},
    )
    out.write_bytes(base64.b64decode(interaction.output_audio.data))
    print("wrote", out)

for line in LINES:
    make(line)
```

Check the SDK's current call shape before running — these fields have moved
before. Listen to the first scene end to end before running the rest.

## After recording

**1 · Audition.** Play each scene straight through in order. Listen for: a tag
read aloud, a character who sounds like someone else, a line much louder or
quieter than its neighbours, a Bangladeshi voice that drifts into another accent.

**2 · Level and convert.** Per-line takes must sit at the same loudness or the
scene jumps in volume between speakers:

```
ffmpeg -i _dry-originals/<key>.wav -af loudnorm=I=-18:TP=-1.5:LRA=11 -ar 24000 -ac 1 -codec:a libmp3lame -b:a 96k <key>.mp3
```

**3 · Room tone** (character lines only — narrator lines stay dry). Use the
same pipeline as the interviews (`ambience/amb.py`): render every bed **from
the dry original**, never from a mixed file; the recipes are listed under each
scene's rooms, in dB relative to the take's own speech level. Low-pass every bed
at about 3.2 kHz, keep speech-to-bed above 20 dB in the 2–5 kHz band, fade the
bed in and out over 0.3 s (these takes are short), and peak-limit to about 0.97.
Because the lines are separate files, keep each room's bed **seeded by room, not
by line**, so consecutive lines in one room sound like one continuous place.

**4 · Align.** Run `python3 ethnographic-interviews/tools/align_scenes.py`. It
matches Whisper word times to the lines in `scenes.js` and writes
`scene-timings.js`, which makes the karaoke exact. **Re-run it whenever a line
is re-recorded** — otherwise the highlighting goes wrong silently.

---

## Checklists

### Audio — 117 lines

| File | Speaker | Voice | Tags | Generated | Auditioned | Levelled + mp3 | Bed | Aligned |
|---|---|---|---|:-:|:-:|:-:|:-:|:-:|
| `dinner-ends-at-eight-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-02` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-03` | Jeff | Achird |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-04` | Jeff | Achird |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-05` | Tania | EVL · Autonoe |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-06` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-07` | Jeff | Achird |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-09` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-10` | Jeff | Achird |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-11` | Tania | EVL · Autonoe |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-12` | Jeff | Achird |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `dinner-ends-at-eight-13` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-14` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `dinner-ends-at-eight-15` | Tania | EVL · Autonoe |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `splitting-the-bill-02` | Jake | Fenrir |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-03` | Nusrat | EVL · Leda |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-04` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `splitting-the-bill-05` | Nusrat | EVL · Leda |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-06` | Jake | Fenrir | `&lt;laugh&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `splitting-the-bill-08` | Jake | Fenrir |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-09` | Nusrat | EVL · Leda |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-10` | Jake | Fenrir |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `splitting-the-bill-11` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `splitting-the-bill-12` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `splitting-the-bill-13` | Nusrat | EVL · Leda |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `disagreeing-in-the-meeting-02` | Richard | Alnilam |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-03` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `disagreeing-in-the-meeting-04` | Ryan | Algieba |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-05` | Richard | Alnilam |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-06` | Ryan | Algieba |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `disagreeing-in-the-meeting-08` | Richard | Alnilam |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-09` | Ryan | Algieba |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `disagreeing-in-the-meeting-10` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-boss-stacks-chairs-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-boss-stacks-chairs-02` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-boss-stacks-chairs-03` | Tanvir | EVL · Umbriel |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-04` | Dave | Zubenelgenubi | `&lt;laugh&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-05` | Tanvir | EVL · Umbriel |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-06` | Dave | Zubenelgenubi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-boss-stacks-chairs-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-boss-stacks-chairs-09` | Dave | Zubenelgenubi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-10` | Dave | Zubenelgenubi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-11` | Tanvir | EVL · Umbriel |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-boss-stacks-chairs-12` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `what-do-you-think-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `what-do-you-think-02` | Dr. Novak | Rasalgethi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-03` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `what-do-you-think-04` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `what-do-you-think-05` | Dr. Novak | Rasalgethi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-06` | Farhana | EVL · Achernar | `&lt;whispers&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-07` | Dr. Novak | Rasalgethi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-08` | Farhana | EVL · Achernar |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-09` | Dr. Novak | Rasalgethi |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `what-do-you-think-10` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `what-do-you-think-11` | Farhana | EVL · Achernar |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-neighbours-tree-02` | Bill | Algenib | `&lt;groan&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-03` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-neighbours-tree-04` | Mike | Sadachbia |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-05` | Bill | Algenib |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-06` | Mike | Sadachbia |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-07` | Bill | Algenib |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-08` | Mike | Sadachbia |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-09` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-neighbours-tree-10` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `the-neighbours-tree-11` | Mike | Sadachbia |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `the-neighbours-tree-12` | Bill | Algenib |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `back-of-the-line-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `back-of-the-line-02` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `back-of-the-line-03` | Brad | Orus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `back-of-the-line-04` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `back-of-the-line-05` | Brad | Orus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `back-of-the-line-06` | Carla | Pulcherrima |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `back-of-the-line-07` | Brad | Orus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `back-of-the-line-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `back-of-the-line-09` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `back-of-the-line-10` | Carla | Pulcherrima |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `tell-them-what-you-did-02` | Tyler | Puck |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-03` | Arif | EVL · Iapetus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-04` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `tell-them-what-you-did-05` | Tyler | Puck |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-06` | Arif | EVL · Iapetus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `tell-them-what-you-did-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `tell-them-what-you-did-09` | Tyler | Puck |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `tell-them-what-you-did-10` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `tell-them-what-you-did-11` | Arif | EVL · Iapetus | `&lt;sigh&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `honestly-im-annoyed-02` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `honestly-im-annoyed-03` | Ethan | Zephyr |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-04` | Hannah | Kore |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-05` | Ethan | Zephyr |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-06` | Hannah | Kore |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `honestly-im-annoyed-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `honestly-im-annoyed-09` | Ethan | Zephyr | `&lt;laugh&gt;` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-10` | Hannah | Kore |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-11` | Ethan | Zephyr |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `honestly-im-annoyed-12` | Hannah | Kore |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-01` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `leave-the-snake-alone-02` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `leave-the-snake-alone-03` | Imran | EVL · Enceladus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-04` | Kathy | Aoede |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-05` | Imran | EVL · Enceladus |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-06` | Kathy | Aoede |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-07` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `leave-the-snake-alone-08` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `leave-the-snake-alone-09` | Kathy | Aoede |  | ☐ | ☐ | ☐ | ☐ | ☐ |
| `leave-the-snake-alone-10` | Narrator | narrator |  | ☐ | ☐ | ☐ | — | ☐ |
| `leave-the-snake-alone-11` | Imran | EVL · Enceladus |  | ☐ | ☐ | ☐ | ☐ | ☐ |

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
