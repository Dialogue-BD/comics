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
page keeps each sheet intact and pans to a complete panel; Whole comic shows the entire sheet. Audio and timing progress is
tracked by the presence of `scene/<id>.mp3` and the scene entry in
`../scene-timings.js`.

Each scene is assembled from alternating narration and dialogue takes. For
all scenes, the narration and dialogue are each recorded as one grouped
Gemini 3.8 Flash TTS take in AI Studio's browser playground, without an API
key. Local Whisper locates the words and splits those recordings into the
alternating takes expected by the assembler.

    scene/_group-originals/<id>-narration.wav  the original narrator recording
    scene/_group-originals/<id>-dialogue.wav   the original two-voice recording
    scene/_dry-originals/<id>-sNN.wav          the split dry takes
    scene/<id>.mp3                        the assembled scene       ← tools/assemble_scenes.py
    scene/_build/<id>.json                where each take sits      ← tools/assemble_scenes.py
    ../scene-timings.js                   every word, timed         ← tools/force_align_scenes.py
    scene/panels/<id>-sheet.webp          six panels, 2 columns × 3 rows
    scene/cast/<id>-pair.webp             two portraits, left/right
    scene/{panels,cast}/_originals/       full-size generated PNGs

After recording:

    python3 ../tools/split_grouped_scene_takes.py <id> --model small
    python3 ../tools/assemble_scenes.py <id>
    python3 ../tools/force_align_scenes.py --model small
    node ../tools/verify_scenes.js

The page reads line boundaries from the timings: it turns the panel as a line
starts, seeks to a line when a student replays it, and lights each word. Re-run
the build commands after re-recording a grouped take. Stable-ts aligns the exact
script to the final MP3 within known take boundaries, then refines word endpoints.
The cache in `_alignment/` is keyed by audio, script and model. Install `stable-ts`
in the Python environment used for alignment; the existing local Whisper model is reused.

Timing data carries the exact script and audio duration. If these do not match,
the player asks for a reload; it never estimates word pacing. Highlights end at
the actual word endpoint, including pauses. Failed recordings show a retry
message instead of switching to arbitrary browser voices. Asset URLs have a
shared build version, which must change after regenerating recordings or timings.

`tools/recording_plan.js` generates browser speech blocks. Consecutive lines from
the same character are merged so the playground’s alternating speaker UI cannot
swap their voices. Style directions belong in the Style field, not spoken text.
The raw ASR audit (`review/alignment-audit.json`) records insertions as well as
word matches: a high percentage alone does not catch spoken stage directions.

The page fetches each scene file whole, into memory, because server.py does
not answer byte-range requests and a browser cannot reliably seek in audio
streamed without them.
