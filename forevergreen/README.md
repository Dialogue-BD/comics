# Forevergreen — GPA Phase 3 Wordless Film Activity

An interactive **Growing Participator Approach (GPA) Phase 3 ("Shared-Story / Stuff-We-Both-Know")** ESL activity built around the Academy Award–nominated wordless animated short film ***Forevergreen*** (by Nathan Engelhardt & Jeremy Spears, YouTube ID `B4EPW7JUMTM`, 13:05).

## Pedagogical Flow (No Mid-Scene Interruption)

Instead of pausing every few seconds and breaking emotional immersion, the activity preserves the cinema experience first and layers comprehension, vocabulary, and retelling across three passes:

1. **Pass 1 — Just watch (`শুধু দেখুন`)**: Pure film with original soundtrack at 100%, captions off, voiceover off. Builds the shared story foundation.
2. **Pass 2 — Watch with storyteller (`গল্পকারের সাথে শুনুন`)**: Synchronized Option B storyteller voiceover (`audio/beats/b01.mp3`–`b35.mp3`) layered over the film with automatic volume ducking (20% during each beat, smoothly swelling back to 75% between beats) plus Film/Voice mix controls.
3. **Pass 3 — Phrases & retell (`বাক্যাংশ ও নিজের ভাষায়`)**:
   - **Explore Phrases on Film**: Tappable English–Bangla phrase glosses inside captions and the full transcript.
   - **Tell It Without Looking (GPA Phase 3)**: Collapses the film so learners practice classic GPA Phase 3 blind retelling using 5 Act Memory Cards, partner Nurturer instructions, a copyable *Forevergreen*-grounded AI Nurturer prompt for home study, and a reflection link to `/lost-son/`.

A top segmented toggle lets teachers and students choose **Full Film First (13 min)** or **One Act at a Time (2–3 min)** (which pauses cleanly only at natural Act boundaries and shows a non-blocking discussion card beneath the player).

## Classroom Projector Mode (`classroom.html`)

- **Live Teacher Storytelling**: Opens with Storyteller Voice **Off** and Captions **Off** so the teacher can narrate live or lead class discussion.
- **Collapsible Teacher GPA Nurturer Drawer** (`G` key): Shows live storytelling cues, Phase 3 discussion prompts, target phrases, and a gentle recast example for the active Act.
- **Optional Local MP4 Playback**: Both `classroom.html` ("Load local MP4" in the toolbar) and `index.html` (fallback picker) can play a teacher's local MP4 file directly in-browser via `URL.createObjectURL` for ad-free, offline-proof projection while driving the exact same 5-Act boundaries and voiceover cues. The MP4 itself is never committed to the repository.

## Frame-Verified 5 Acts

1. **Act 1 — Winter & Shelter** (`0:14 – 2:18`)
2. **Act 2 — Growing Up & Temptation** (`2:19 – 4:59`)
3. **Act 3 — The Canyon & Campsite 316** (`5:00 – 7:24`)
4. **Act 4 — Wildfire & The Bridge** (`7:25 – 9:22`)
5. **Act 5 — Grief, New Sapling & Legacy** (`9:23 – 11:58`, credits roll at `12:00`)

## Narration (Phonon V1)

All speech is **Phonon TTS, voice V1** (`gradium/phonon-31m-en`, Apache 2.0), the same
model, voice and `phonon` conda env as Busy Pictures. It runs on the Mac: no key, no cost.
It makes the 35 storyteller beats plus every glossary phrase as **phrase · example ·
phrase** (`audio/phrases/`, played by the 🔊 in the phrase card), runs each clip through
the same EBU R128 loudnorm, rewrites `beat-timings.js` (durations + phrase map), and
checks for timing collisions.

```sh
conda activate phonon
python3 forevergreen/tools/build_narration.py                 # Phonon V1 (default)
python3 forevergreen/tools/build_narration.py --engine say    # macOS say (Daniel), the old voice
python3 forevergreen/tools/build_narration.py --script-only   # export narration-script.txt
```

## The downloaded film

If `forevergreen/forevergreen.mp4` sits next to the page (the classroom laptop), the
player uses it in place of YouTube automatically; the file is gitignored and never
committed, so the live site keeps the YouTube embed. Serve locally with
`python3 forevergreen/tools/serve.py` (byte-range support: the browser cannot seek in an
MP4 through python's plain http.server or `server.py`, so act jumps would restart at 0:00).

## Verification Checks

```sh
node --check forevergreen/story.js forevergreen/beat-timings.js forevergreen/player-core.js forevergreen/app.js forevergreen/classroom.js
node forevergreen/tools/verify_story.js
node --test tests/brand-refresh.test.mjs
```
