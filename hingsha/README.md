# Hingsha narrated comic

`story.js` is the source of truth for the English script, visual sequence,
camera cues, language notes, and TTS direction. The player keeps the words on
the comic as synchronized captions and moves a virtual camera through the full
comic. It uses a 4 × 4 widescreen atlas in landscape and a five-page vertical
strip in portrait, so phones do not receive a cropped desktop composition.

The first pass hides captions, the second adds synchronized captions, and the
third adds clickable phrase help. `cameraBeats` maps exact transcript word
offsets to panel rectangles in both layouts. All five pages have phrase-level camera cues, including each one-versus-two
exchange, the pir's warning, the loss of sight, and the begging epilogue.
Each cue can select its own landscape frame and portrait page, independently
of transcript line boundaries. Panel
framing reserves space above captions; `overflow: clip` prevents timeline focus
from scrolling the visual stage and displacing its controls.

Production files:

- `assets/frames/01.webp`–`12.webp`: frames rendered from the existing wordless comic
- `assets/frames/13.webp`: generated non-graphic epilogue
- `assets/source/epilogue-beggar-original.png`: original generated epilogue
- `assets/mobile/01.webp`–`04.webp`: portrait pages rendered from the existing mobile comic
- `assets/mobile/05.webp`: generated portrait epilogue
- `assets/source/epilogue-beggar-portrait-original.png`: original generated portrait epilogue
- `audio/_originals/hingsha-story.wav`: untouched TTS download
- `audio/hingsha-story.mp3`: delivery audio
- `story-timings.js`: exact word intervals for the delivered audio
- `review/alignment-audit.json`: transcript/recording comparison

After changing the script or audio, regenerate `story-timings.js`; the player
will not use stale timing data. Keep the `camera` array aligned one-to-one with
the transcript lines.

```bash
/Users/timothyhall/miniforge3/bin/python3 tools/align_story.py --model small
node tools/verify_story.js
```
