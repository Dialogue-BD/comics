# The Lost Son

A narrated listening activity at `/lost-son/`, with its own card in the main
QR hub. The three passes are Just listen, Follow the words, and Explore
phrases. `classroom.html` is a silent teacher-led view with manual navigation,
pan, zoom, and whole-page fitting.

The original seven-page graphic novel is a contemporary Bengali retelling of
Luke 15:11–32. The footer links the exact passage in **MBCL on YouVersion**:
https://www.bible.com/bible/95/LUK.15.11-32.MBCL . The English narration is an
original retelling of the supplied visual adaptation, not a Bible translation.
The fish-market hardship sequence follows the supplied Bengali artwork.

## Artwork and story

Six original pages are retained, including the entire moving reunion on
page 6. Its original extraction checksum is recorded and checked. Page 3 uses
a conservative built-in imagegen repair: numeric labels and the phone logo
were removed, restaurant clothing received modest ornas, and all ten scenes
and their composition were kept. Original PDF, extracted pages, repaired PNG,
and complete generation prompt are preserved.

The father runs to the younger son and embraces him before an explanation.
He later goes outside to invite the older son. The ending preserves the
father’s open invitation; it does not invent the older son’s acceptance.

The manifest has 63 caption lines, 84 camera cues, 37 English–Bangla phrase
notes, stable cast metadata, and intact panel rectangles. One Gacrux narrator
performs all narration and quoted dialogue. Other sheets are hidden during
focused listening and revealed in whole-comic view.

## Recording, assembly, and alignment

Gemini 2.5 Pro Preview TTS was operated through the signed-in Google AI Studio
browser without an API key. Direction requests a warm mature male narrator
and neutral General American English. Untouched dry recordings are retained:

- Full take: `audio/_originals/lost-son-narration.wav`.
- Father-reaction correction: `audio/_originals/lost-son-father-reaction.wav`.
- Closing correction: `audio/_originals/lost-son-closing.wav`.

The first correction describes the father’s lowered eyes, matching the panel.
The second restores the exact closing wording **Your brother**, which the
long take had changed to My son. Both corrections use the same model, voice,
and delivery direction. The displayed transcript adopts benign spoken
variations elsewhere; submitted text and independent recognition are kept.

Assembly uses observed acoustic pauses, levels dry takes, and adds no ambience.
The opening through line 30 is retained. Lines 31–59 are replaced with five
short recordings: return, running, embrace, celebration, and older brother.
The previously corrected closing is retained. All dry takes and exact short
scripts are preserved in `audio/_originals/` and `production/`.

The first programmatic repair reduced measured high-frequency whistles, but
the user still found the speech grating. That EQ attempt and its original
alignment audit are archived under `production/history/`. The final build
uses fresh short takes with restrained pitch variation instead of adding
more treble reduction. No spectral filtering is applied to those takes.
The narrated-comics skill now says listener feedback takes precedence over
spectral improvement or accurate recognition, and recommends shorter takes
when a conservative cleanup is still uncomfortable.

The final delivery is **416.11 seconds / 6:56**, with **1,023** positive,
ordered word intervals and **99.51%** independent recognition agreement.
The final assembled recording is independently recognized and then aligned
against the exact transcript. Audio changes invalidate the old timing cache.
Collapsed boundaries may be repaired only from independently observed word
intervals, never estimated from text. The final duration, hashes, source
placements, recognition differences, and timing evidence are recorded in
`production/audio-build.json` and `production/alignment-audit.json`.

## Rebuild and checks

```sh
/Users/timothyhall/miniforge3/bin/python3 tools/prepare.py
/Users/timothyhall/miniforge3/bin/python3 tools/build_audio.py
/Users/timothyhall/miniforge3/bin/python3 tools/review_audio.py
node tools/verify_story.js
```

For transcript or timing changes, align the final delivery with stable-ts,
Whisper small, torch and torchaudio (local dependencies are currently under
`/private/tmp/mezban-align-deps`). Audio-hash changes invalidate recognition
caches. The player hashes the complete recording and uses a seekable Blob;
missing or mismatched media provides an explicit retry state.

Automated contracts check script and delivery hashes, duration, source assets,
reunion preservation, speakers, panel references, word intervals, camera cue
order/bounds, exact glossary spans, title, and the MBCL link. Syntax and Git
whitespace checks pass.

All 84 camera cues passed at 390×844 phone portrait, 1280×800 desktop, and
844×390 phone landscape: **252 checks**. Every intended rectangle stayed
above captions, with the correct sheet and exact cue label selected. The final audio is checked again against those camera cues.

Browser checks also cover actual playback and smooth word following,
transcript/current-line replay, pause, seeking, phrase help, fullscreen logo
placement without a duplicate, and restart. Full uninterrupted human listening
and external cultural review remain outstanding. The available before/after
clips and listening page support the user’s auditory review.
