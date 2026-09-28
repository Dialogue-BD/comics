# Scene comics — assets

The Watch step tells each scenario's set-up as a wordless comic with a
narrator and two voiced characters, heard three times (just listen → read
along → explore the words). The content is `../scenes.js`; the full asset
brief with every prompt is `culture-circles-scene-assets.md`, generated from
it by `../tools/gen-scene-assets.js`.

## Asset progress

All ten scenes have finished wordless comics and matching portraits. The first
scene uses six individual square panel files and two individual portraits.
Scenes 2–10 use one six-panel sheet and one two-portrait sheet per scene; the
page displays the appropriate cell of each sheet. Audio and timing progress is
tracked by the presence of `scene/<id>.mp3` and the scene entry in
`../scene-timings.js`.

Each scene is assembled from alternating narration and dialogue takes. For
scenes 2–10, the narration and dialogue are each recorded as one grouped
Gemini 3.8 Flash TTS take in AI Studio's browser playground, without an API
key. Local Whisper locates the words and splits those recordings into the
alternating takes expected by the assembler.

    scene/_group-originals/<id>-narration.wav  the original narrator recording
    scene/_group-originals/<id>-dialogue.wav   the original two-voice recording
    scene/_dry-originals/<id>-sNN.wav          the split dry takes
    scene/<id>.mp3                        the assembled scene       ← tools/assemble_scenes.py
    scene/_build/<id>.json                where each take sits      ← tools/assemble_scenes.py
    ../scene-timings.js                   every word, timed         ← tools/align_scenes.py
    scene/panels/<id>-sheet.webp          six panels, 2 columns × 3 rows
    scene/cast/<id>-pair.webp             two portraits, left/right
    scene/{panels,cast}/_originals/       full-size generated PNGs

After recording:

    python3 ../tools/split_grouped_scene_takes.py <id> --model small
    python3 ../tools/assemble_scenes.py <id>
    python3 ../tools/align_scenes.py --model small

The page reads line boundaries from the timings: it turns the panel as a line
starts, seeks to a line when a student replays it, and lights each word. Re-run
all three commands after re-recording a grouped take. Without timings the page spreads the lines
over the file by length, which is only roughly right.

Until an asset exists the page stands in for it: with no scene file each line
is spoken by the browser's speech engine (and with no voices at all the comic
still moves on at reading pace); a missing panel shows the nearest of the
three existing strip pictures; a missing portrait shows the character's
initial.

The page fetches each scene file whole, into memory, because server.py does
not answer byte-range requests and a browser cannot reliably seek in audio
streamed without them.
