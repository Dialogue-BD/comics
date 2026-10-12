# Voice Lab — source

The page at `/pronunciation/` is built from this folder. It is a React + Vite app
using GSAP (motion, ScrollTrigger), Lenis (smooth scrolling) and three small components
adapted from React Bits (see `src/reactbits/README.md`).

```
pronunciation/
  index.html, assets/   ← the built page (do not edit by hand)
  audio/                ← the recordings, one mp3 per clip id (Alice, British)
  audio/brian/          ← the same clip ids in Brian's voice (American)
  _source/              ← this folder
```

## Change something

```
cd pronunciation/_source
npm install          # once
npm run publish      # builds and copies the page up into pronunciation/
npm run serve        # then open http://localhost:8765/pronunciation/
```

- **Words, Bangla, sections:** `src/content/units.js`. Eleven units; each is one long page
  (hero → Hear → Say → Play). Section types are listed at the top of the file and
  mapped to components in `src/pages/Unit.jsx`.
- **Measured data:** `src/data/clips.json` (see `analysis/README.md`). Add a clip by
  putting its mp3 in `../audio/<id>.mp3`, adding it to `analysis/spec.py` and re-running
  the analysis for just that clip.
- **Voices:** `src/lib/audio.js`. Each voice has its own recordings and its own measured
  data (`src/data/clips-<voice>.json`), so every picture follows the voice speaking.
  Pairs compared on screen are read from the unit content (`src/lib/links.js`) and always
  play in one voice. The "hear it again" bar is `src/components/VoiceDock.jsx`. To bring in
  a new or corrected export: `analysis/import_voice.py` (see `analysis/README.md`).
- **Colours and type:** `src/styles/brand.css` (tokens) and `src/styles/app.css`.
  One job per colour: ink = the voice line, gold = the beat / the ball, coral = air,
  tense, long; blue = buzz, relaxed, short.
- **The voice line** (calligraphic pitch stroke, words sized by stress, the bouncing
  ball): `src/components/VoiceLine.jsx`, geometry in `src/lib/line.js`.
- **The mouth** (front view + side cutaway, moving with each recording):
  `src/components/mouth/MouthDiagram.jsx`; shapes per sound in `mouth/visemes.js`,
  driven by the phone timings (`ph`) in `clips.json` (`analysis/phones.py`).
- **Scrolling:** `src/lib/scroll.js`. Lenis drives the window; ScrollTrigger reveals.

Keys on the projector: `P` toggles TV mode, `V` switches the voice, `→`/`Space` next
section, `←` back.
