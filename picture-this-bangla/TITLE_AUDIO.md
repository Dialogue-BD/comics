# Card-title audio (Picture This Bangla)

Every card has a speaker just right of its printed title, on the front and the back.
Coach Me! plays the title first, then the first prompt.

- `title-audio/<card-id>.mp3` — Gemini recording of the card title, in the same voice as the card's words.
  `title-audio/sources.json` records the voice. Recorded by Claude (Gemini TTS), like the other Gemini audio.
- `title-boxes.js` — where the title is printed on each image (% of the image), for placing the speaker.
  Regenerate after adding or changing cards: `python3 scripts/title_boxes.py`.
- `audio-index.js` lists recorded titles under `titles.ids`; `python3 scripts/build_web.py --audio-only` rebuilds it.

For new cards (Codex): run `scripts/title_boxes.py` with the build. A card without a title recording simply
shows no title speaker, and Coach Me! starts straight with the first prompt, until Claude records it.
A card missing from `title-boxes.js` puts the speaker in the top-right corner.
