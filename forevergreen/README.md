# Forevergreen — Wordless Film Story Activity

An interactive **Shared-Story** ESL activity built around the Academy Award–nominated wordless animated short film ***Forevergreen*** (by Nathan Engelhardt & Jeremy Spears, `video/forevergreen.mp4`, 13:05, 720p H.264/AAC with zero CC subtitles).

## Pedagogical Flow (Zero-Spoiler & Uninterrupted)

Instead of pausing every few seconds and breaking emotional immersion, the activity preserves the cinema experience first and layers comprehension, vocabulary, and retelling across three passes:

1. **Pass 1 — Just watch (`শুধু দেখুন`)**: Pure local HD film with original soundtrack at 100%, captions off, voiceover off. Builds the shared story foundation.
2. **Pass 2 — Watch with storyteller (`গল্পকারের সাথে শুনুন`)**: Synchronized **Phonon TTS V1** storyteller narration (`audio/beats/b01.mp3`–`b46.mp3`) played via Web Audio API over the film with automatic volume ducking (`20%` during each beat, swelling smoothly back to `75%` between beats) and zero-spoiler timestamps placed 1–3s *after* each visual reveal appears on screen.
3. **Pass 3 — Phrases & retell (`বাক্যাংশ ও নিজের ভাষায়`)**:
   - **Explore Phrases on Film**: Every single word in the live captions and full transcript is clickable for an instant English + Bangla definition tooltip (`word-glossary.js`), while multi-word idioms also open full phrase notes (`gloss-dialog`).
   - **Build the Storyboard**: Learners put four phrase cards in order to make two sentences for each of ten film stills. The bear tells the story in the first person. The [printable two-page A4 worksheet](storyboard/forevergreen-storyboard.pdf) uses the same images with space for students to write their own version.
   - **Tell It Without Looking**: Collapses the film so learners practice blind retelling using 5 Act Memory Cards, partner speaking instructions, a copyable *Forevergreen*-grounded AI speaking partner prompt for home study, and a reflection link to `/lost-son/`.

A top segmented toggle lets teachers and students choose **Full Film First (13 min)** or **One Act at a Time (2–3 min)** (which pauses cleanly only at natural Act boundaries).

The student player has a **Data saver** toggle for the 360p edition (about 26 MB of video for a full viewing). It also starts in that mode when the browser signals a data-saving preference. The classroom player starts in 720p.

## Classroom Projector Mode (`classroom.html`)

- **Live Teacher Storytelling**: Opens with Storyteller Voice **Off** and Captions **Off** so the teacher can narrate live or lead class discussion.
- **Collapsible Teacher Story Guide Drawer** (`G` key): Shows live storytelling cues, discussion prompts, target phrases, and a gentle recast example for the active Act.
- **Local HD Film (`video/forevergreen.mp4`)**: Served cleanly with HTTP `Range` (`206 Partial Content`) support in `server.py` for instant seeking across all browsers, with an optional **Load custom MP4** override in the toolbar.

## Local Preview

Run this from the repository root and open [Forevergreen](http://127.0.0.1:8843/forevergreen/).

```sh
PORT=8843 python3 server.py --local-preview
```

This preview uses the same byte-range support as the deployed app, so the act buttons and video timeline can jump ahead before the film fully buffers. The server limits Forevergreen MP4 range responses to 8 MiB because the Replit proxy rejects responses over 32 MiB.

## Frame-Verified 5 Acts (2-Second Dense Inspection)

1. **Act 1 — Winter & Shelter** (`0:14 – 2:05`)
2. **Act 2 — Growing Up & Temptation** (`2:06 – 5:19`)
3. **Act 3 — The Canyon & The Campsite** (`5:20 – 7:15`)
4. **Act 4 — Wildfire & The Bridge** (`7:16 – 9:26`)
5. **Act 5 — Grief, New Sapling & Legacy** (`9:27 – 12:01`, credits roll at `12:02`)

## Audio Pipeline (Phonon TTS V1)

Beat clips are synthesized with **Phonon 31M EN** (`gradium/phonon-31m-en`, voice `voices/LMDIYE0Oa377Qh6Z.safetensors`) + `ffmpeg` EBU R128 loudness normalization (`loudnorm=I=-15:TP=-1.5:LRA=11`) and verified via `ffprobe` for zero timing collisions.

```sh
/Users/timothyhall/miniforge3/envs/phonon/bin/python forevergreen/tools/build_narration.py --engine phonon
```

## Verification Checks

To rebuild the storyboard stills and worksheet after editing `storyboard/scenes.json`, run `python3 forevergreen/tools/build_storyboard.py` with FFmpeg and ReportLab installed.

```sh
node --check forevergreen/story.js forevergreen/word-glossary.js forevergreen/beat-timings.js forevergreen/player-core.js forevergreen/app.js forevergreen/classroom.js
node forevergreen/tools/verify_story.js
python3 -m unittest discover -s tests -p "test_*.py"
```
