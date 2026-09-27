# Scene comics — assets

The Watch step tells each scenario's set-up as a wordless comic with a
narrator and two voiced characters, heard three times (just listen → read
along → explore the words). The content is `../scenes.js`; the full asset
brief with every prompt is `culture-circles-scene-assets.md`, generated from
it by `../tools/gen-scene-assets.js`.

Drop files in with these names and the page uses them on the next load —
nothing in the code changes.

    scene/<scenario-id>-<nn>.mp3          one recording per line, nn = 01, 02 … in line order
    scene/_dry-originals/<id>-<nn>.wav    the clean TTS exports (never mixed)
    scene/panels/<scenario-id>-<n>.webp   six square panels, n = 1–6, 720px, quality 72
    scene/panels/<scenario-id>-<n>.jpg    the same, JPEG fallback
    scene/panels/_originals/              full-size PNGs from the image model
    scene/cast/<slug>.jpg                 character portraits, 384x384, JPEG q84

Until an asset exists the page stands in for it: a missing line is spoken by
the browser's speech engine (and with no voices at all the comic still moves
on at reading pace); a missing panel shows the nearest of the three existing
strip pictures; a missing portrait shows the character's initial.

**After recording anything, re-run the alignment** so the karaoke is exact:

    python3 ../tools/align_scenes.py

It reads `_dry-originals/`, matches the words to `../scenes.js` and writes
`../scene-timings.js`. Lines without a take are skipped, so it can run after
each batch.
