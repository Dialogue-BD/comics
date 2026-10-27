# Activity 1 illustrated sequences

`ayesha-story.webp` is the intact four-panel source sheet: reference portrait,
studying, reading the rejection email, and trying AI with her own documents.
The player uses the last three panels. `tailor.webp` is the intact six-panel
sheet: occasion, requested blouse, measure before cutting, flag a fabric flaw,
check the finished blouse, and a still life. The player uses the first five.

Ayesha brings her yellow shari to a tailor and requests a matching yellow
blouse for her friend's gaye holud. She wears the same teal kurta and terracotta
orna in both sequences; the yellow clothing is the work being commissioned.
The garment, occasion, visual evidence, displayed examples and recording script
must change together.

The study room is a fictional illustration informed by real RU departmental
library photos, not a documentary reconstruction of the Economics department:

- [University of Rajshahi Law department library photo](https://www.ru.ac.bd/law/wp-content/uploads/sites/55/2025/09/2.jpg), from the [department's website](https://www.ru.ac.bd/law/).
- [Ali Areefur Rehman Seminar Library, Department of English, University of Rajshahi](https://commons.wikimedia.org/wiki/File:Ali_Areefur_Rehman_Seminar_Library_for_the_Department_of_English_University_of_Rajshahi.jpg), Arif Hossain / Keygen80, 2016, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Used as a furnishings reference; transformed into a new illustrated scene with fictional characters. The resulting story artwork is distributed under CC BY-SA 4.0.

Original generated PNGs are preserved locally in `_originals/`. The delivery
WebPs use `cwebp -q 88`. Panel bounds exclude the generated divider lines and
are recorded in `cv-art.js`; no destructive panel crops are used. Device backs
remain plain in the artwork; email and AI content are separate HTML/SVG
callouts. They never appear on the outside of a phone or laptop lid.

`cv-art.js` renders the artwork; `cv-art.css` supplies crossfades, brief camera
settles and the process-order emphasis. Reduced-motion preferences remove
animation. Existing audio completion callbacks select the next story panel.
When Show the words is selected, `story-voice.js` uses the recording's actual
audio clock and `audio/story-timings.js` to move one persistent gold follower
through its words. Short pauses hold the follower; longer pauses let it rest.
The exact script, duration, word count and SHA-256 of the playing audio must
match before highlighting is enabled. No timing is inferred from text length.
Story captions use the existing exact narration and remain optional. Each scene has a native
keyboard-accessible replay button, and the complete story can be shown at once.

Full prompts and reference provenance: `../../production/visual-polish/prompts.json`.

After changing a story recording or its transcript, regenerate the timings:

```sh
python3 tools/align-cv-story.py --model /path/to/cached/whisper/small.pt
node --test tools/story-voice.test.cjs
```

Requires local `stable-ts`, `openai-whisper`, PyTorch and ffmpeg. The tool uses
exact-text forced alignment and endpoint refinement, and retains a separate
recognition audit under `production/visual-polish/story-alignment/`. Punctuation
such as the unspoken em dash gets no word interval. Bump the timing-script URL
version in `index.html` after rebuilding it. All three existing recordings are
reused without editing or regeneration.
