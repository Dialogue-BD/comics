# Recorded audio (optional)

The page plays a real recording when one exists and falls back to the browser's
own speech engine when it does not. Nothing in the code has to change: drop a
file in with the right name and it is used on the next page load.

    audio/<scenario-id>-<n>.mp3        n = 1, 2, 3 in the order the speakers appear

If a file is missing, 404s, or fails to decode, the page speaks the script with
speechSynthesis instead — a different voice, rate and pitch per speaker. If the
device has no speech engine at all, the page opens the transcripts and says so
rather than leaving a dead play button.

The page's spoken transcript is `scenarios.js`. The original eighteen voice
prompts are in `ethnographic-interviews-voice-script.md`; the four new scenario
briefs were supplied separately. For the new takes, use Gemini 3.8 Flash TTS
in the AI Studio speech playground. If a script changes, regenerate its audio
and word timings from that exact text.

Target: 20-35 seconds each, conversational, room tone rather than studio-dry.

The original eighteen are recorded, and each has a room bed mixed under it. The clean
exports are kept in `_dry-originals/` — re-run `../ambience/run.py` from those
if a bed needs rebalancing, and never layer ambience onto a file twice.

**If you re-record anything, re-run the alignment.** `../timings.js` holds the
start and end time of every word. Whisper's local `small` model supplies
word-level start/end estimates from the dry recording; `../tools/align.py`
matches them to the exact transcript words shown by the page. This needs
`openai-whisper` and `ffmpeg`, but no API key. The first run may download the
model; later runs use the cached copy.

    python3 ../tools/align.py

It reads the clean takes in `_dry-originals/` and the transcripts in
`../scenarios.js`, so put the new dry export in place first. Review any
reported transcript/ASR differences: speech generators sometimes say a
contraction or number differently from the written script. The script is the
source of truth for what the page displays and which word gets each timestamp.


## The dinner that ends at eight  —  Time

- `audio/dinner-ends-at-eight-1.mp3` — **Dana**, 34, project manager, Chicago · suggested voice: **Aoede (Breezy)**
- `audio/dinner-ends-at-eight-2.mp3` — **Mark**, 58, high-school teacher, Columbus, Ohio · suggested voice: **Gacrux (Mature)**
- `audio/dinner-ends-at-eight-3.mp3` — **Priya**, 27, nurse, Seattle · suggested voice: **Autonoe (Bright)**

## Six friends, six payments  —  The Self

- `audio/splitting-the-bill-1.mp3` — **Trevor**, 22, engineering student, Austin · suggested voice: **Puck (Upbeat)**
- `audio/splitting-the-bill-2.mp3` — **Alicia**, 41, dental hygienist, Austin · suggested voice: **Kore (Firm)**
- `audio/splitting-the-bill-3.mp3` — **Greg**, 36, software tester, Denver · suggested voice: **Algenib (Gravelly)**

## The junior who said no  —  Truth

- `audio/disagreeing-in-the-meeting-1.mp3` — **Caleb**, 29, data analyst, Boston · suggested voice: **Iapetus (Clear)**
- `audio/disagreeing-in-the-meeting-2.mp3` — **Nadia**, 45, operations director, Boston · suggested voice: **Schedar (Even)**
- `audio/disagreeing-in-the-meeting-3.mp3` — **Wes**, 52, logistics supervisor, Pittsburgh · suggested voice: **Charon (Informative)**

## The director stacking chairs  —  Authority

- `audio/the-boss-stacks-chairs-1.mp3` — **Dave**, 49, country director, Denver · suggested voice: **Zubenelgenubi (Casual)**
- `audio/the-boss-stacks-chairs-2.mp3` — **Kim**, 24, design intern, Seattle (a different workplace from Dave and Tanvir) · suggested voice: **Leda (Youthful)**
- `audio/the-boss-stacks-chairs-3.mp3` — **Roberto**, 38, warehouse manager, Phoenix · suggested voice: **Orus (Firm)**

## “What do you think?”  —  Opinion

- `audio/what-do-you-think-1.mp3` — **Professor Hale**, 57, literature professor, Ann Arbor · suggested voice: **Sadaltager (Knowledgeable)**
- `audio/what-do-you-think-2.mp3` — **Beth**, 20, second-year student, Ann Arbor · suggested voice: **Achernar (Soft)**
- `audio/what-do-you-think-3.mp3` — **Tomás**, 31, PhD student and teaching assistant, Ann Arbor · suggested voice: **Algieba (Smooth)**

## The neighbour’s tree  —  Conflict

- `audio/the-neighbours-tree-1.mp3` — **Hank**, 61, retired electrician, Portland · suggested voice: **Umbriel (Easy-going)**
- `audio/the-neighbours-tree-2.mp3` — **Michelle**, 44, bookkeeper, Portland · suggested voice: **Despina (Smooth)**
- `audio/the-neighbours-tree-3.mp3` — **Ade**, 33, physiotherapist, Portland · suggested voice: **Callirrhoe (Easy-going)**

## Back of the line — Fairness

- `audio/back-of-the-line-1.mp3` — **Angela**, 44, pharmacist, Philadelphia · **Erinome**
- `audio/back-of-the-line-2.mp3` — **Marcus**, 31, delivery driver, Philadelphia · **Achird**
- `audio/back-of-the-line-3.mp3` — **Daniel**, 38, school counselor, Philadelphia · **Rasalgethi**, faint Korean accent

## Tell them what you did — Self-presentation

- `audio/tell-them-what-you-did-1.mp3` — **Diane**, 50, HR manager, Atlanta · **Sulafat**
- `audio/tell-them-what-you-did-2.mp3` — **Jordan**, 22, college senior, Atlanta · **Sadachbia**
- `audio/tell-them-what-you-did-3.mp3` — **Arjun**, 35, software engineer, Atlanta · **Alnilam**

## Honestly, I’m annoyed — Feelings

- `audio/honestly-im-annoyed-1.mp3` — **Hannah**, 23, engineering student, Sacramento · **Zephyr**
- `audio/honestly-im-annoyed-2.mp3` — **Ethan**, 22, computer science student, Sacramento · **Fenrir**
- `audio/honestly-im-annoyed-3.mp3` — **Kenji**, 45, restaurant manager, Sacramento · **Algieba**, slight Japanese accent

## Leave the snake alone — Nature

- `audio/leave-the-snake-alone-1.mp3` — **Kathy**, 48, garden centre owner, Asheville · **Vindemiatrix**
- `audio/leave-the-snake-alone-2.mp3` — **Ray**, 61, retired forest ranger, Asheville · **Enceladus**
- `audio/leave-the-snake-alone-3.mp3` — **Lucia**, 27, environmental science student, Asheville · **Laomedeia**
