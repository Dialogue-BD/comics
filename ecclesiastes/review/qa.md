# Ecclesiastes production review · 5 October 2026

## Automated contracts

`node tools/verify_story.js` passes: ten chapters, 181 short captions,
247 camera beats, 75 English–Bangla explanations, 1,641 timed words,
and 828.24 seconds of audio. It checks the delivered audio hash and duration,
monotonic word intervals, transcript coverage, image dimensions, bounded
camera rectangles, and exact glossary spans. JavaScript syntax and Git
whitespace checks also pass.

## Browser review

- Checked every camera beat at its word trigger using the native seek control:
  247 checks at 390 × 844 portrait and 247 at 1280 × 800 landscape.
  All 494 checks passed. Targets stayed inside the stage above the captions,
  with the correct page loaded and matching media time.
- Spot checked phone landscape at 844 × 390 and desktop fullscreen.
  Fullscreen fills the available screen width with the Dialogue logo at the
  upper left; playback, chapter selection, and caption passes remain usable.
- Verified caption-free first listening, synchronized CC, chapter seeking,
  whole-page overview, and a clickable English–Bangla phrase dialog.
- Fixed seeking on the preview server, whose ordinary MP3 URL exposed no
  seekable range. The verified complete Blob recording is seekable end to end.
- Browser warning/error log was empty during final review.

These are cue geometry and interaction checks, with playback spot checks;
they are not a complete human listening review of the 13:48 recording.

## Sources and artwork

Original recordings are reused. Local Whisper word timing and a second ASR
pass reconcile uncertain phrases. Weighted word match is approximately
99.57%; recognizer differences and corrections are retained in the alignment
audit. The final captions preserve the spoken wording.

All ten original comic pages and the three final imagegen repairs were
visually inspected. Pages 3–5 replace wine with water or tea. Page 3 adds the
tie named in the narration. Page 5 has modest party clothing with ornas.

## Release scope

The existing `/ecclesiastes/` route and homepage card point to the new activity
in this checkout. This review covers the local preview; it does not confirm
a deployed Replit build.
