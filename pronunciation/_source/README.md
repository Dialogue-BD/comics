# Voice Lab — source

The page at `/pronunciation/` is built from this folder. It is a React + Vite app
using GSAP (motion and scroll), Lenis (smooth scrolling) and a few components
adapted from React Bits (see `src/reactbits/README.md`).

```
pronunciation/
  index.html, assets/   ← the built page (do not edit by hand)
  audio/                ← the recordings, one mp3 per clip id
  _source/              ← this folder
```

## Change something

```
cd pronunciation/_source
npm install          # once
npm run publish      # builds and copies the page up into pronunciation/
npm run serve        # then open http://localhost:8765/pronunciation/
```

- **Words, Bangla, scenes:** `src/content/units.js`. English and Bangla sit side by
  side. Scene types are listed at the top of the file.
- **Measured data:** `src/data/clips.json` (see `analysis/README.md`). Add a clip by
  putting its mp3 in `../audio/<id>.mp3` and re-running the analysis.
- **Colours and type:** `src/styles/brand.css` follows the Dialogue Brand Book
  (Paper by day, "Present on TV" on the projector).
- **The Tape** (pitch line, beats, waveform, playhead): `src/components/Tape.jsx`.

Keys on the projector: `P` toggles TV mode, `→`/`Space` next, `←` back.
