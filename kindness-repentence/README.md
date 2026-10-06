# Kindness & Repentance · B2 narrated wordless comic

The existing `/kindness-repentence/` route has a narrated listening activity.
The visible title uses the corrected spelling **Repentance**; existing links
keep working. All eight original picture pages and the source PDF are retained.
`classroom.html` offers a silent teacher view with manual page selection,
pan, zoom and fullscreen.

## Story and learning contract

This is the user’s fictional modern Bengali retelling of Zacchaeus: a politically
connected thug extorts poor vegetable sellers, then sits alone at a tea stall
near a waz mahfil. An invited elderly hujur knowingly risks his reputation and
accusations of political allegiance to welcome him. The welcome is freely
offered **before** apology, repentance or restitution. The man responds by
returning four times the amount taken to each victim. Emotion leads to concrete
repair; the kindness is not a reward for improvement.

The original pictures include an embrace before sharing tea, so the narration
preserves it. The flight from Dhaka is user-supplied backstory, not an invented
airport panel. No real political party or public figure is named.

`production/manifest.json` and `story.js` store 40 exact narration lines, the
cast, 54 word-triggered camera cues, 36 English–Bangla language notes, cultural
constraints and asset version. The script targets B2 learners with natural
dialogue, past-perfect sequencing, passive forms, idioms and inference.

Three listening passes provide the same experience as Mezban: pictures and
audio alone, captions with a persistent gold word follower, then phrase help.
Replay, restart, seeking, whole-comic overview, keyboard controls and fullscreen
are available. Missing or mismatched media exposes an explicit retry state.

## Recording

Gacrux is the single mature narrator, with subtle quoted dialogue. Delivery
direction specifies neutral General American English, with native Bangladeshi
Bengali pronunciation for **ওয়াজ মাহফিল, মাহফিল, মাস্তান, হুজুর, ঢাকা**.
The directions use Bengali orthography rather than rough English phonetics.

Google AI Studio’s Gemini 2.5 Pro Preview TTS provides the downloadable take
without an API key. The newer 3.8 interface offered block previews but required
a paid key for the main downloadable run, so the production take uses the
available Pro speech model with the same Gacrux voice.

Dry audio is preserved under `audio/_originals/`; `tools/build_audio.py`
normalizes it to -16 LUFS without ambience and records media hashes and duration.
Three same-voice correction passages replace an ambiguous boundary and an
unintended word flagged in the initial take. `production/audio-edit-plan.json`
records the observed silent cut boundaries, source ranges and added pause.
The initial delivery is retained as `audio/_originals/kindness-initial.mp3`,
matching the hashes in both initial recognition audits. The canonical text
adopts the original recording’s spoken `he’d` contraction in the repayment line.
`tools/align_story.py` audits independent Whisper small recognition, then
force-aligns the delivered audio to the exact displayed script. No timing is
estimated from text length. Alignment caches depend on the audio hash.

```sh
python tools/render_pages.py  # PyMuPDF and Pillow
python tools/prepare.py
python tools/build_audio.py  # ffmpeg and ffprobe
python tools/align_story.py  # Whisper, stable-ts, torch and torchaudio
node tools/verify_story.js
```

For this computer the Python runtime is `/Users/timothyhall/miniforge3/bin/python3`
and the temporary alignment dependencies are in `/private/tmp/mezban-align-deps`.
These are production tools, not dependencies needed by a learner’s browser.

## Language review references

The contextual notes distinguish the original harm from repair. English meaning
was checked against Cambridge’s entries for [extortion](https://dictionary.cambridge.org/us/dictionary/english/extortion)
and [repentance](https://dictionary.cambridge.org/us/dictionary/english/repentance).
The religious gathering, local strongman, invited hujur and political concerns
come from the user’s scenario. The lesson’s emphasis on repentance as a response
to unmerited favor is the user’s requested interpretation.

Useful B2 discussion prompts after listening:

- What had the man done to deserve the preacher’s welcome?
- What did the preacher risk by sitting beside him? Why did he do it anyway?
- Which actions show that the man’s repentance went beyond feeling sorry?

## Production review

The final delivery is **361.52 seconds (6:02)** with **918 exact-script,
forced-aligned word intervals**. Independent Whisper small recognition matches
**98.80%** of canonical words. Every difference is reviewed in
`production/alignment-audit.json`: Roman spellings of Bengali words, hyphenation,
the American-English homophones seller/cellar, and a small-model hardly/heartily
confusion resolved by independent base-model recognition of the same dry take.
No unintended Hindi insertion remains in final recognition. Collapsed or
overlapping aligner boundaries are repaired only using independently measured
acoustic word intervals, never interpolation from text.

All **54 camera cues passed at 390×844 portrait, 1280×800 desktop and 844×390
phone landscape**, for 162 checks. Selected panel rectangles remained inside
the stage and above captions. The longer bilingual title initially pushed
phone controls below the viewport; the activity now fits the comic below the
header’s actual measured height. Evidence is in `production/browser-qa.json`
and `production/preview-phone.jpg` / `preview-desktop.jpg`.

Checked caption-free listening, actual playback and the persistent word follower,
pause, replay, restart, seeking, the key phrase explanations, fullscreen branding
with no duplicate logo, and the silent classroom viewer. All eight classroom
images loaded, navigation to page eight worked, and the teacher view has no
audio element. Script/audio hashes, all word intervals, image paths, geometry,
glossary spans, JavaScript syntax and Git whitespace checks pass.

Playback was spot-checked around the unearned-welcome
passage; that does not constitute a complete human auditory review. American
accent quality, joins between same-voice takes and especially native Bengali
pronunciation still need a human listening check. A 36-second extract of the
relevant words is preserved at `production/pronunciation-review.mp3` for that
review. No claim of external cultural-review coverage is made.
