# Mezban narrated English-learning comic

The existing `/mezban/` route now provides the same three listening passes as
the newer Hingsha activity: Just listen, Follow the words, and Explore phrases.
`classroom.html` preserves a silent teacher-led view with eight complete pages,
manual page selection, pan, zoom, and fullscreen.

The story follows the supplied Bengali banquet adaptation: the son returns
from abroad; rich and important invitees decline; the host welcomes rickshaw
drivers, street children, people who beg, and hijra guests; the family serves
and shares the feast. The closing narration explicitly includes men and women,
rich and poor, and people from Muslim and Hindu backgrounds at one table.

All eight original picture pages are retained. No new artwork was generated.
`story.js` and `production/manifest.json` contain the cast, transcript, visual
sequence, 51 camera beats, 22 English–Bangla notes, cultural constraints, and
asset version. `tools/prepare.py` recreates the data and WebP deliveries from
the extracted JPEGs; it preserves already-existing interface files.

## Recording and alignment

- Gemini 3.8 Flash TTS, Gacrux, generated through the signed-in AI Studio UI.
- Neutral General American English direction, as requested by the user.
- `rickshaw driver` is the narration term; the phrase note explains the
  alternatives `rickshaw puller` and `rickshaw wallah`.
- Untouched download: `audio/_originals/mezban-american.wav`.
- Normalized delivery: `audio/mezban-story.mp3`, 223.52 seconds, no ambience.
- `tools/build_audio.py` records the filters, duration, and source/delivery
  hashes in `production/audio-build.json`.
- 629 word intervals use exact-script stable-ts / Whisper small forced
  alignment. Seven collapsed boundaries were recovered from independent
  acoustic ASR intervals, and one adjacent interval was also recovered. No
  intervals were estimated from text length.
- Independent small-model recognition matched 99.36% of canonical words.
  A separate base-model pass was used to examine disputed wording. Both
  recognized `daughter` singular, so the displayed wording adopts it.
- Remaining recognizer differences and their review are recorded in
  `production/alignment-audit.json`; raw recognition and forced alignment are
  preserved. Local-word pronunciation needs human review.

The browser hashes the complete audio before using it and loads a seekable
Blob. Missing or stale media displays an explicit retry state. Transcript
edits invalidate the timing contract.

```sh
/Users/timothyhall/miniforge3/bin/python3 tools/build_audio.py
PYTHONPATH=/private/tmp/mezban-align-deps /Users/timothyhall/miniforge3/bin/python3 tools/align_story.py
node tools/verify_story.js
```

The temporary alignment dependencies are stable-ts 2.19.1 and torchaudio 2.9.1;
they are not website dependencies. The existing local Whisper small model is
used without an API key.

## Review on 7 October 2026

`node tools/verify_story.js` passes script/audio hashes, word counts, monotonic
positive intervals, recording duration, camera geometry/order, original image
paths, glossary spans, and American-accent/driver wording contracts.

Browser checks passed all 51 camera cues at each of 390×844 portrait, 1280×800
desktop landscape, and 844×390 phone landscape: 153 total. Every selected
visual rectangle remained inside the stage and above the captions. The phone
landscape test exposed a caption overlap; the art-fit calculation was repaired
and all 51 cues passed again. The desktop fullscreen view retains the Dialogue
logo and controls.

Checked caption-free first listening, phrase dialog content, transcript replay,
current-line replay, seeking, play/pause, persistent highlighting, restart,
fullscreen, and the eight-page silent classroom view. Actual playback was
spot-checked around the gate invitation and rickshaw-driver passage. All eight
classroom images loaded and that page has no audio element. JavaScript syntax
and Git whitespace checks passed.

This is a local preview, not a published deployment. Browser and acoustic
checks do not constitute a complete human listening review: the final voice,
American accent, and the pronunciation of `mezban` and especially `hijra` still
need a human listen before classroom release. No claim of full auditory or
external cultural-review coverage is made.
