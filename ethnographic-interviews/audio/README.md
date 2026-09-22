# Recorded audio (optional)

The page plays a real recording when one exists and falls back to the browser's
own speech engine when it does not. Nothing in the code has to change: drop a
file in with the right name and it is used on the next page load.

    audio/<scenario-id>-<n>.mp3        n = 1, 2, 3 in the order the speakers appear

If a file is missing, 404s, or fails to decode, the page speaks the script with
speechSynthesis instead — a different voice, rate and pitch per speaker. If the
device has no speech engine at all, the page opens the transcripts and says so
rather than leaving a dead play button.

**The scripts, scenes, suggested voices, director's notes and audio tags all
live in `ethnographic-interviews-voice-script.md`** — a set of ready-to-paste
Gemini TTS prompts. That file is the single source of truth for how these
should sound; this one is only the filename map. Both are generated from
`scenarios.js`, so change a line there and regenerate rather than editing a
transcript by hand.

Target: 20-35 seconds each, conversational, room tone rather than studio-dry.

All eighteen are recorded, and each has a room bed mixed under it. The clean
exports are kept in `_dry-originals/` — re-run `../ambience/run.py` from those
if a bed needs rebalancing, and never layer ambience onto a file twice.

**If you re-record anything, re-run the alignment.** `../timings.js` holds the
start and end time of every word, and the page leans on it twice: the transcript
highlights word by word during playback, and the word-catch field turns over on
real sentence boundaries. Both go wrong silently against a new take.

    python3 ../tools/align.py      # needs pocketsphinx and ffmpeg

It reads the clean takes in `_dry-originals/` and the transcripts in
`../scenarios.js`, so put the new dry export in place first. The script is the
source of truth throughout: the page's transcript, the glossary coverage, the
game's answers and the alignment all come from it.


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
- `audio/the-boss-stacks-chairs-2.mp3` — **Kim**, 24, intern, Denver · suggested voice: **Leda (Youthful)**
- `audio/the-boss-stacks-chairs-3.mp3` — **Roberto**, 38, warehouse manager, Phoenix · suggested voice: **Orus (Firm)**

## “What do you think?”  —  Opinion

- `audio/what-do-you-think-1.mp3` — **Professor Hale**, 57, literature professor, Ann Arbor · suggested voice: **Sadaltager (Knowledgeable)**
- `audio/what-do-you-think-2.mp3` — **Beth**, 20, second-year student, Ann Arbor · suggested voice: **Achernar (Soft)**
- `audio/what-do-you-think-3.mp3` — **Tomás**, 31, PhD student and teaching assistant, Ann Arbor · suggested voice: **Algieba (Smooth)**

## The neighbour’s tree  —  Conflict

- `audio/the-neighbours-tree-1.mp3` — **Hank**, 61, retired electrician, Portland · suggested voice: **Umbriel (Easy-going)**
- `audio/the-neighbours-tree-2.mp3` — **Michelle**, 44, bookkeeper, Portland · suggested voice: **Despina (Smooth)**
- `audio/the-neighbours-tree-3.mp3` — **Ade**, 33, physiotherapist, Portland · suggested voice: **Callirrhoe (Easy-going)**
