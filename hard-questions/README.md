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

## Illustrated scenes and downloadable films

The nine films use Claude’s style B illustrated backgrounds, character poses,
and word-timed labels. `illustrated/scene.mjs` builds the shared paused GSAP
scene timeline; `illustrated/voices/` defines each speaker’s scenes and effects.
`motion-player.mjs` drives those scenes from the original audio clock in both
the listening lesson and the projector theatre. Scene chapters now follow the
new illustrated cuts; transcript words, phrase cues, MP3s, and subtitles are unchanged.
Reduced motion holds a representative still within each illustrated scene.
No WebGL is required.

Daniel’s physics-lab background uses the full-resolution download supplied on
16 November 2026. Tiffany’s third scene retains Claude’s town-square substitute
for the intended string-lights gathering; Robert’s artwork is somewhat more detailed
than the other characters. These are known art differences, not missing assets.

Serve the repository locally and run `node hard-questions/tools/render-films.mjs`.
The exporter requires Playwright, Chromium, and FFmpeg. Set `PLAYWRIGHT_MODULE`,
`CHROME_EXECUTABLE`, and optionally `STUDIO_URL` (the illustrated studio page)
when using existing installations. Pass a speaker ID to render only that film,
or `--frames` to regenerate the scene stills. Films are 1280×720 at 24 fps, H.264,
with a stable caption band; existing normalized AAC packets are copied unchanged.
Original film backups stay in ignored `generated-artifacts/human-voices-original-films/`.
The exporter writes a temporary MP4 and replaces the destination only after success.

`node hard-questions/tests/illustrated-browser.test.mjs` checks image loading,
repeatable backward seeking, reduced motion, lesson playback and chapters,
phone/landscape layouts, and projector controls. It uses the Playwright/Chromium
overrides above, plus `BASE_URL` for the preview server and `PNG_MODULE` for pngjs.
`node hard-questions/tools/verify-meaning-films.mjs` checks all nine full decodes,
format, duration, and unchanged encoded AAC packets against the render backups.
Browser and media reports go into ignored `generated-artifacts/`.

The film library is `/hard-questions/films/library.html`; the live projector is
`/hard-questions/films/`. Both accept `?voice=<id>`. Complete perceptual audiovisual
review of every film has not been performed; automated checks and scene-frame
review are recorded separately in `production/manifest.json`.

Gwen’s spoken clip addresses the environment; her source job title mentions a
sexual-assault support service. Sarah discusses autism, and Kamille describes
chronic illness. Teachers can choose voices suitable for their group.

## Verification

`node hard-questions/tests/game.test.mjs` checks adaptive thresholds, score farming within a round, guess prevention, distractor exclusion, duplicate chips, and clip boundaries for all voices at all challenges. Browser QA covers playback and pause/resume, unrestricted stage navigation, catching/checking/replay, discussion, persistence, and phone/projector layouts.

`node hard-questions/tests/motion.test.mjs` verifies complete word coverage, ordered nonoverlapping timing spans, all 27 scene boundaries, phrase selection and subtitle files.
