# The American & The Fisherman

The existing `/american-fisherman/` route now offers Just listen, Follow the
words, and Explore phrases, matching the narrated Hingsha and Ecclesiastes
activities. `classroom.html` offers a silent teacher-led version with eight
complete pages, page selection, drag, zoom, and fullscreen.

## Source credit

The original recording announces tapescript 6.11. It matches “The businessman
and the fisherman” in **New Headway Elementary**, fourth edition, Liz and John
Soars, Oxford University Press, 2011, Unit 6, Student’s Book pp. 50–51,
track **T6.11**. The publisher’s tapescript also confirms speaker assignments
at the interrupted “But … then” exchanges and the word “studied.”

Verified on 9 October 2026 against:

- [Publisher tapescript hosted by East Kazakhstan Technical University](https://ektu.kz/files/DistanceEducation/Work/214581/hw_elem_trd_sb_tapescripts.pdf)
- [Student’s Book pages 50–51](https://library.bsma.edu.ge/BOOKS/New_Headway_Elementary_Student_39_s_Book_2014.pdf)
- [Bibliographic record](https://books.google.com/books?id=1g1czgAACAAJ)

The small footer credits the curriculum/audio and separately identifies the
visuals as independently AI-created. The user supplied the existing comic.
The source PDF and MP3 remain intact.

## Artwork

Eight portrait comic sheets are rendered to optimized WebP delivery files.
All original sheets were inspected in full. Page 7 had a continuity error:
the American appeared in the retirement the dialogue imagines for the
fisherman. The repaired page preserves the panel layout and shows an aged
version of the same fisherman with his wife, grandchildren, football,
guitar, and village friends. The original page is retained separately.

The built-in imagegen tool produced
`assets/source/page-7-retirement-repaired.png`. References were original pages
7 (edit target), 6 (aged fisherman), and 3 (wife/family). The complete prompt
and review are preserved in `production/artwork-review.json`.

## Audio and alignment

The delivery recording retains the original businessman, fisherman, and
children. No new TTS was generated and no voice was substituted. The original
MP3 is preserved in `audio/_originals/`. A reproducible FFmpeg build trims
only the first seven seconds containing the track announcement, normalizes
loudness, and encodes the result: **155.69 seconds**. No new ambience is added.

The canonical manifest contains 41 short caption lines, 62 phrase-level camera
cues, and 33 English–Bangla explanations. Separate portrait and landscape
rectangles fit complete panels into the actual space above the captions.
The media clock drives both focus and the persistent word follower.

All **350** caption words have positive, monotonic intervals within the
recording. Exact-script stable-ts / Whisper small forced alignment is retained.
Collapsed and overlapping boundaries were repaired from independently
recognized acoustic word intervals, never character counts or interpolation.
The normalized recognition matched all canonical words and inserted one extra
“How” at a segment split. The original small/base and delivered base passes
recognize only one “how”; raw outputs and the review are preserved. Match is
**99.72% when that recognizer insertion is included**.

The player verifies the complete recording’s SHA-256 hash before loading a
seekable Blob. Script edits invalidate timing data; missing, stale, or
undecodable media provides an explicit retry state.

## Rebuild

```sh
/Users/timothyhall/miniforge3/bin/python3 tools/prepare.py
/Users/timothyhall/miniforge3/bin/python3 tools/build_audio.py
PYTHONPATH=/private/tmp/mezban-align-deps /Users/timothyhall/miniforge3/bin/python3 tools/align_story.py
node tools/verify_story.js
```

Temporary local alignment dependencies are stable-ts 2.19.1, torchaudio,
Whisper, and torch. Existing cached small/base models were used. They are
production tools, not website dependencies.

## Verification on 9 October 2026

Contract checks pass script/audio hashes, word count, duration, positive ordered
intervals, speakers, panels, preserved original assets, camera geometry/order,
and exact glossary spans. JavaScript syntax and Git whitespace checks pass.

All 62 camera cues passed at 390×844 phone portrait, 1280×800 desktop, and
844×390 phone landscape: **186 cue checks**. Targets stayed inside the stage
above captions, with the correct image loaded. Header, control, and footer
space are reserved when sizing the player.

Browser checks covered caption-free first listening, actual playback and
advancing highlight, transcript/current-line replay, pause, seeking, restart,
41 transcript speaker labels, 33 phrase buttons, and the English–Bangla fleet
explanation. Fullscreen entered with one Dialogue home link; uninterrupted
fullscreen playback was not reviewed. The silent classroom loaded all eight
images, navigated to the last page, fitted the whole page, and loaded no audio.

This is a **local preview**. Full uninterrupted human listening review of
voice identity and pronunciation, external cultural review, and deployment
verification remain outstanding. Browser geometry and acoustic recognition
are not substitutes for those reviews.
