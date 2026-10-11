# AI: Hearing Human Voices on Hard Questions

An exercise in AI fluency, listening comprehension and critical thinking.

An independent, mixed-level English listening activity based on the nine public recordings at [Anthropic’s Hard Questions](https://claude.com/hard-questions).

Run the repository server and visit `/hard-questions/`. A static server works too: `python3 -m http.server 8765`, then open `http://localhost:8765/hard-questions/`.

## Suggested classroom flow

All four steps are available immediately for every voice. Students can start with the word game, animated transcript or discussion and move freely between them. Main-idea choices, word choices, checking, word meanings and next-clip navigation are available from the start. Correct answers and completed rounds are recorded for feedback, never required to access another part.

1. Optionally preview three words, then hear a whole original recording and choose the main idea.
2. Listen to consecutive sections and select words heard among distractors. Check after playback, then continue to the next section. Replay and word review are optional.
3. Watch live motion graphics that move with the speaker’s words and follow a word-by-word karaoke transcript of the full recording. Tap words, phrases, vocabulary or scene chapters to replay at original speed. A plain-English picture idea connects the illustration with the spoken language.
4. Discuss a simplified question using optional speaking frames. Save a personal note if useful.

Students swap listener/operator roles for the next voice. Three voices suit a short activity; all nine can span several sessions. Projector view supports whole-group discussion. The guide is built into the page.

## Adaptive practice

All audio plays at **1×**, with **no playback-speed control**. Every challenge uses the same sections of about 11 seconds. More support asks for up to two targets among four choices, Balanced up to four among six choices, and Stretch up to six among nine choices. Boundaries move to nearby word gaps and never split a target phrase. The main player button changes from Listen to Check my words and then Next clip (or Watch the meaning for the last section). Replay and pauses are unrestricted. Changing challenge after a section starts applies to the next section, so it does not restart the current audio.

Each round is checked once. Its F1 score balances recognition of target words with avoidance of false guesses. Two consecutive rounds at or above 0.85 add one challenge; a round below 0.55 adds support. Other rounds reset the strong-round streak. Manual challenge selection overrides adaptation. Replay and reaction time are not inputs. These thresholds guide practice, **not** CEFR assessment.

The session summary combines the best completed pass per person and includes false guesses in its accuracy, so replaying cannot endlessly farm points. Progress, selected challenge, and optional notes use localStorage on this device. No classroom server, accounts, leaderboard, or analytics are required. Clearing a session removes that browser’s progress and notes.

## Source and content

Recordings and portraits are unchanged originals from the public source, retrieved 11 October 2026. The exercise credits and links Anthropic; no endorsement is implied. `audio/` and `assets/` keep those resources available without relying on hotlinks. The files are not generative recreations of these people. Source media remains subject to its owners’ rights; this repository does not assert a new licence for it.

`sources.json` records each original URL. `voices.json` contains teaching prompts, glossary definitions, selected word/phrase timings, and a vocabulary set for excluding spoken words from distractors. `transcripts.json` adds all 588 timed transcript words, phrase cues and 27 illustration scenes. Timing came from local faster-whisper small.en recognition and was checked against audio duration and published quotations; recogniser-derived timing can still have small errors. Round scoring has no reaction-time requirement.

## Live motion graphics (no videos)

The Watch step and the projector theatre (`/hard-questions/films/`) play **live illustrated scenes in the browser**, not video files. Each voice has a scene script in `motion/beats/<id>.js` that builds one paused GSAP timeline; the activity seeks it to `audio.currentTime` every frame, so pausing, replaying a phrase, tapping a word or dragging the seek bar keeps the pictures exactly in step with the speaker.

Every idea happens somewhere: a clinic, a waiting room where the sun races past the window for “six years”, a control room with an empty chair, a campus, a street of people in phone bubbles who later join hands. Scenes are full-bleed pictures in three parallax layers (back, mid, front) that slide in like a camera pan. Beats are anchored to the spoken words, not to typed seconds — `at('six years')` returns the moment Kamille says “six” — so a picture arrives as its word is heard. Key glossary words appear on annotation labels with a leader line to the thing they name. When the speaker is on screen her lips move with her own recorded words.

- `motion/stage.js` — the stage: `scene()` (layers, push/fade transitions, camera drift, colour grade), `label()`, timeline helpers, reduced-motion snapping. Placed drawings are lifted before they animate, so tweens are always relative to where a thing was drawn.
- `motion/cast.js` — the cast: shaded, posable characters with bending arms, poses, blinking, brows and lip movement. Preview at `motion/cast.html`.
- `motion/sets.js` — places and props: rooms, windows, light shafts, furniture, streets, towers, data centre, campus, landscapes, the AI core and the question orb.
- `motion/beats/_scene.js` — shared helpers for the scene scripts (`actor`, `life`, `talk`, `walkIn`, `motes`…).
- `motion/aurora.js` — WebGL backdrop (a vanilla port of React Bits’ Aurora), now only used behind non-scene voices.
- `motion/vendor/` — GSAP 3.13 (with DrawSVG and MotionPath) and Lenis, vendored so the page works without a CDN.
- `polish.js` / `polish.css` — Lenis smooth scrolling, step transitions, and ports of React Bits’ BlurText, SpotlightCard and ClickSpark. Decoration only; nothing gates progress.

On phones the stage is 4:3 and crops the sides, so important things stay between x = 220 and 1380 of the 1600 × 900 scene. Reduced motion (device setting or the button) shows each picture complete and still, changing only when the next idea arrives. Pictures illustrate each speaker’s questions and hopes, not predictions about AI. Audio always plays at 1×, from the original MP3 bytes in a seekable local buffer.

To change a scene, edit that voice’s script and preview it with `motion/dev.html?voice=<id>` (call `stage.seek(seconds)` in the console). Regenerate captions with `python3 hard-questions/tools/build-transcripts.py`.

Gwen’s spoken clip addresses the environment; her source job title mentions a sexual-assault support service. Sarah discusses autism, and Kamille describes chronic illness. Teachers can choose the voices suitable for their group.

## Verification

`node hard-questions/tests/game.test.mjs` checks adaptive thresholds, score farming within a round, guess prevention, distractor exclusion, duplicate chips, and clip boundaries for all voices at all challenges. Browser QA covers playback and pause/resume, unrestricted stage navigation, catching/checking/replay, discussion, persistence, and phone/projector layouts.

`node hard-questions/tests/motion.test.mjs` verifies complete word coverage, ordered nonoverlapping timing spans, all 27 scene boundaries, phrase selection and subtitle files.
