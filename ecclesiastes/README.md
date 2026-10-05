# Ecclesiastes narrated comic

Ten chapters from the original illustrated story, presented as a continuous
13 minute 48 second listening exercise. The ten existing English recordings
and original JPG pages are retained. No API key or new TTS generation is used.

The listening passes match Hingsha:

1. Just listen: sound and camera focus, with captions hidden.
2. Follow the words: captions over the comic with a persistent word follower.
3. Explore phrases: the same captions with English and Bangla explanations.

**Tell it live** opens `classroom.html`, a separate, silent classroom viewer.
The teacher can scroll or drag through the complete comic, select a page,
zoom, fit its width or show the whole page, and enter fullscreen. No recording
is loaded. Arrow keys and Page Up/Down on the comic navigate pages; +/- zoom.
The Student listening link returns to the three recorded listening passes
for independent smartphone practice. Both views share the reviewed artwork.

The complete current page remains available through Whole page. A chapter
selector provides direct access to all ten pages. Portrait and landscape use
camera rectangles in the complete page's own coordinate system. The original
panels remain intact; the camera never treats a vertically stacked page as a
single landscape image. The stage reserves space above captions and controls
for the current visual target.

## Source and build

- `source.js`: canonical recorded text, chapter descriptions, and phrase anchors
  for the camera. Preserve the recorded words when editing captions.
- `glossary-source.js`: exact phrase spans, explanations, and Bangla meanings.
- `page_*.jpg`, `audio_*.mp3`: untouched source artwork and audio.
- `assets/source/page-*-edited.png`: imagegen repairs of pages 3–5, replacing
  wine with water or tea. Page 3 adds the tie described in the office narration;
  page 5 also has modest party clothing with ornas.
- `assets/pages/*.webp`: optimized full-page delivery artwork.
- `story.js`, `story-timings.js`: generated player data.
- `audio/ecclesiastes-story.mp3`: assembled recording, with 450ms between pages.
- `review/alignment-audit.json`: source hashes, offsets, expected/heard text,
  word match fractions, and all reconciled ASR differences.
- `review/transcription-review.json`: second ASR pass over ambiguous phrases.

Build using the existing local Python environment with Whisper, Pillow, and
ffmpeg:

```sh
/Users/timothyhall/miniforge3/bin/python3 tools/transcribe_sources.py
/Users/timothyhall/miniforge3/bin/python3 tools/review_transcription.py
/Users/timothyhall/miniforge3/bin/python3 tools/build_story.py
node tools/verify_story.js
```

The build checks cached source audio hashes and aligns the approved text to
actual word intervals. It emits 181 captions, 247 camera targets, 75 bilingual
explanations, and 1,641 word intervals. Match fractions range from 98.57% to
100%; the retained audit lists the corrections, including tea stall, held,
ladder, mourning, and nails, plus recognizer insertions.

The combined WAV and full ASR cache are reproducible local outputs and are
ignored by Git. The ten original MP3 sources remain the preserved recordings.

## Browser behavior

The player fetches the full recording and verifies its SHA-256 against the
timing manifest before enabling playback. A Blob URL makes seeking reliable
even on a static server without HTTP byte-range support. A failed fetch or
version mismatch has a retry state. Production hosting can stream the same
asset, but the complete download is intentionally required here for stable
chapter and sentence replay.

Check desktop, narrow portrait, phone landscape, fullscreen, seeking between
all chapters, caption mode changes, phrase dialogs, and reduced motion after
changes. Bump the HTML asset version and story version when publishing changed
media or scripts. Local verification does not confirm a Replit deployment.
