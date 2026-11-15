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

## Three.js scenes and downloadable films

`motion-3d.mjs` stages all 27 scenes in Three.js 0.180.0. Sage backgrounds, ivory plinths, porcelain, brass, wood grain, terracotta and studio shadows replace the original flat illustrations. The shared sets include a medical desk, waiting room, family garden, public meeting table, server cabinets, compass, writing desk, telescope, construction toys, conversation chairs, access ramp and physical balance scale. Deterministic actions include scanning, writing, task transfer, compass settling, telescope aiming, blocks assembling, chairs drawing together, tree growth and balancing. A 0.6-second dissolve connects different sets; type stays still. ImageGen supplied the art-direction reference, not the animated frames. Its exact prompt and original image are in `production/art-direction/`.

The renderer follows the original audio clock, including seeking and replay. One WebGL context is reused across voices. The library is vendored under `vendor/` with its MIT licence, so no CDN is needed. When WebGL cannot start or its context is lost, the live lesson uses matching rendered scene stills with the original interactive captions. Reduced motion holds completed object poses and a stationary camera. The existing solid gold word follower, timing data, audio, language help and unrestricted lesson navigation remain intact.

The teacher library at `/hard-questions/films/library.html` plays all nine newly rendered captioned MP4s and includes transcripts, timed storyboards and production notes. Films remain 1280 × 720 at 24 fps, H.264/yuv420p/limited-range BT.709. The existing normalized AAC track is copied into each new film without another audio encode. The live activity continues to use the unchanged source MP3s at 1×. SRT/VTT captions are unchanged.

Regenerate captions/storyboards with `python3 hard-questions/tools/build-transcripts.py`. Start a static server at the repository root, then render with `node hard-questions/tools/render-films.mjs`. This now invokes the deterministic Three.js browser renderer; it requires Playwright, Chromium and FFmpeg. Set `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE` for existing installations; `STUDIO_URL` overrides the default local render page. `--frames` writes all 27 representative frames to `production/frames-three/`; a speaker argument, e.g. `gwen`, renders only that film. The encoder writes a temporary MP4 and replaces the destination only after success. Previous 2D films are preserved locally in the ignored `production/previous-2d-films/` directory.

`node hard-questions/tests/three-browser.test.mjs` checks repeatable seeks in all 27 scenes, stationary reduced-motion poses, all 18 scene transitions, unrestricted navigation, original playback speed, phone/landscape layouts and the no-WebGL fallback. It uses the same Playwright environment overrides. Screenshots and the actual browser report are in `production/three-qa/`. The production manifest distinguishes automated checks, sampled visual review and complete perceptual playback review.

The existing projector theatre at `/hard-questions/films/` keeps full screen, keyboard shortcuts, speaker selection and reduced motion. `motion-player.mjs` adapts the Three.js renderer to the existing lesson and theatre controls. The existing page polish and branded title are preserved.

Gwen’s spoken clip addresses the environment; her source job title mentions a sexual-assault support service. Sarah discusses autism, and Kamille describes chronic illness. Teachers can choose the voices suitable for their group.

## Verification

`node hard-questions/tests/game.test.mjs` checks adaptive thresholds, score farming within a round, guess prevention, distractor exclusion, duplicate chips, and clip boundaries for all voices at all challenges. Browser QA covers playback and pause/resume, unrestricted stage navigation, catching/checking/replay, discussion, persistence, and phone/projector layouts.

`node hard-questions/tests/motion.test.mjs` verifies complete word coverage, ordered nonoverlapping timing spans, all 27 scene boundaries, phrase selection and subtitle files.
