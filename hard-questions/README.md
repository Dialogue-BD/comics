# AI Dreams & Dictation

An independent, mixed-level English listening activity based on the nine public recordings at [Anthropic’s Hard Questions](https://claude.com/hard-questions).

Run the repository server and visit `/hard-questions/`. A static server works too: `python3 -m http.server 8765`, then open `http://localhost:8765/hard-questions/`.

## Classroom flow

1. Optionally preview three words, then hear a whole original recording and choose the main idea.
2. Listen to consecutive sections and select words heard among distractors. Check after playback, then continue to the next section. Replay and word review are optional.
3. Watch three animated scenes and follow a word-by-word karaoke transcript of the full recording. This step unlocks after the complete word challenge. Tap words, phrases, vocabulary or scene chapters to replay at original speed. A plain-English picture idea connects the illustration with the spoken language.
4. Discuss a simplified question using optional speaking frames. Save a personal note if useful.

Students swap listener/operator roles for the next voice. Three voices suit a short activity; all nine can span several sessions. Projector view supports whole-group discussion. The guide is built into the page.

## Adaptive practice

All audio plays at **1×**, with **no playback-speed control**. Every challenge uses the same sections of about 11 seconds. More support asks for up to two targets among four choices, Balanced up to four among six choices, and Stretch up to six among nine choices. Boundaries move to nearby word gaps and never split a target phrase. The main player button changes from Listen to Check my words and then Next clip (or Watch the meaning for the last section). Replay and pauses are unrestricted. Changing challenge after a section starts applies to the next section, so it does not restart the current audio.

Each round is checked once. Its F1 score balances recognition of target words with avoidance of false guesses. Two consecutive rounds at or above 0.85 add one challenge; a round below 0.55 adds support. Other rounds reset the strong-round streak. Manual challenge selection overrides adaptation. Replay and reaction time are not inputs. These thresholds guide practice, **not** CEFR assessment.

The session summary combines the best completed pass per person and includes false guesses in its accuracy, so replaying cannot endlessly farm points. Progress, selected challenge, and optional notes use localStorage on this device. No classroom server, accounts, leaderboard, or analytics are required. Clearing a session removes that browser’s progress and notes.

## Source and content

Recordings and portraits are unchanged originals from the public source, retrieved 11 October 2026. The exercise credits and links Anthropic; no endorsement is implied. `audio/` and `assets/` keep those resources available without relying on hotlinks. The files are not generative recreations of these people. Source media remains subject to its owners’ rights; this repository does not assert a new licence for it.

`sources.json` records each original URL. `voices.json` contains teaching prompts, glossary definitions, selected word/phrase timings, and a vocabulary set for excluding spoken words from distractors. `transcripts.json` adds all 588 timed transcript words, phrase cues and 27 illustration scenes. Timing came from local faster-whisper small.en recognition and was checked against audio duration and published quotations; recogniser-derived timing can still have small errors. Round scoring has no reaction-time requirement.

## Animated input and offline films

`motion.mjs` draws the same deterministic scene timeline in the activity and exported films. The green motion studio uses shared abstract people, records, homes, a chip and a plant. Actions include scanning, writing, connecting, assembling, balancing and growing; scene transitions follow spoken phrases. Illustrations express the speaker's hopes/questions, not factual predictions about AI. Captions stay still while objects move. The read-along uses one persistent solid gold highlight, gliding between words in 180 ms and holding across ordinary pauses. Completed words stay stable. Reduced-motion mode keeps complete illustrations and timed captions, and honors the device preference.

The teacher film library at `/hard-questions/films/` plays all nine captioned MP4s and includes each transcript, timed storyboard, visual system and production notes. The activity offers MP4 and SRT downloads once the transcript is unlocked. Films are 1280 × 720 at 24 fps, H.264/yuv420p/BT.709 with AAC stereo and normalized audio. The live activity loads the original MP3 bytes into a seekable local buffer so phrase replay works on static hosts without byte-range support; no speech is slowed or rewritten, and no music is added.

Regenerate captions/storyboards with `python3 hard-questions/tools/build-transcripts.py`. Render films with `node hard-questions/tools/render-films.mjs` (requires FFmpeg and `@napi-rs/canvas`; `CANVAS_MODULE` can point to a discovered installation). `--frames` exports all representative frames. Cached recognition input and final media measurements live in `production/`. This renderer uses raw deterministic frames, not an interactive screen recording.

Gwen’s spoken clip addresses the environment; her source job title mentions a sexual-assault support service. Sarah discusses autism, and Kamille describes chronic illness. Teachers can choose the voices suitable for their group.

## Verification

`node hard-questions/tests/game.test.mjs` checks adaptive thresholds, score farming within a round, guess prevention, distractor exclusion, duplicate chips, and clip boundaries for all voices at all challenges. Browser QA covers playback and pause/resume, the main-idea gate, catching/checking/replay, discussion, persistence, and phone/projector layouts.

`node hard-questions/tests/motion.test.mjs` verifies complete word coverage, ordered nonoverlapping timing spans, all 27 scene boundaries, phrase selection and subtitle files. `production/manifest.json` records measured file checks and the limits of perceptual review.
