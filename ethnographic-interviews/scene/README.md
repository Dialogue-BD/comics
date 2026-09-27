# Scene comics — assets

The Watch step tells each scenario's set-up as a wordless comic with a
narrator and two voiced characters, heard three times (just listen → read
along → explore the words). The content is `../scenes.js`; the full asset
brief with every prompt is `culture-circles-scene-assets.md`, generated from
it by `../tools/gen-scene-assets.js`.

## Asset progress

`dinner-ends-at-eight` has its six finished panels, matching Tania and Jeff
portraits, eight dry Gemini 3.8 takes, an assembled 92-second scene file, and
Whisper word timings. The other nine scenes still use picture and portrait
stand-ins and the browser-speech fallback.

Each scene is recorded as takes — dialogue takes, where both characters play a
whole exchange in one Gemini conversational call, and narration takes between
them — and assembled into one file per scene.

    scene/_dry-originals/<id>-sNN.wav     the takes, untouched (the brief lists them)
    scene/<id>.mp3                        the assembled scene       ← tools/assemble_scenes.py
    scene/_build/<id>.json                where each take sits      ← tools/assemble_scenes.py
    ../scene-timings.js                   every word, timed         ← tools/align_scenes.py
    scene/panels/<id>-<n>.webp / .jpg     six square panels, n = 1–6, 720px
    scene/panels/_originals/              full-size PNGs from the image model
    scene/cast/<slug>.jpg                 character portraits, 384x384, JPEG q84

After recording:

    python3 ../tools/assemble_scenes.py     trim, level, room tone, join
    python3 ../tools/align_scenes.py        word timings (needs openai-whisper)

The page reads line boundaries from the timings: it turns the panel as a line
starts, seeks to a line when a student replays it, and lights each word. Re-run
both after re-recording any take. Without timings the page spreads the lines
over the file by length, which is only roughly right.

Until an asset exists the page stands in for it: with no scene file each line
is spoken by the browser's speech engine (and with no voices at all the comic
still moves on at reading pace); a missing panel shows the nearest of the
three existing strip pictures; a missing portrait shows the character's
initial.

The page fetches each scene file whole, into memory, because server.py does
not answer byte-range requests and a browser cannot reliably seek in audio
streamed without them.
