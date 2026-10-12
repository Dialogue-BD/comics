# How `src/data/clips.json` was made

Every picture in Voice Lab is drawn from the recordings themselves. These scripts
measured them (October 2026). You only need them again if a recording changes.

Requirements: Python 3, `praat-parselmouth`, `librosa`, `numpy`, `scipy`, `espeak-ng`
with the MBROLA voice `mb-us1`, and ffmpeg (to turn each mp3 into a 22 kHz mono wav
in `wav/`).

1. `spec.py` — what each clip says: syllables, stress level per syllable
   (2 = big beat, 1 = full but unstressed, 0 = reduced, the schwa), thought groups
   (`|`) and the tonic word of each group (`*`).
2. `analyse.py` — pitch (Praat, octave-cleaned), loudness, air/voice frames, a playback
   gain so every clip plays at a similar level, and word / syllable timings by aligning
   each recording against espeak-ng + MBROLA synthesis (DTW on MFCCs).
3. `finalize.py` — merges in the hand-checked timings (syllables of the multi-syllable
   words, vowel lengths, aspiration release → voicing), smooths the pitch line into
   semitones, and writes `clips.json`.

Hand-checked values were read off spectrograms; they live in `MANUAL`, `VOWEL` and
`ASP` in `finalize.py`, and the cluster tiles live in `TILES` in `src/content/units.js`.

`pro-sent1-mono` and `pro-sent2-mono` (the "melody off" sentences) are made from the
natural ones by `monotone.py`: the slow melody is squashed to about a tenth while the
voice's small natural wobble and a gentle downward drift are kept, then Praat (PSOLA)
resynthesises it — a person speaking in a monotone, not a robot. The prototype's "flat"
recording (`flat1`) turned out to have as much melody as the natural one, so it is not
used.

`phones.py` adds phone timings (`ph`) to the single-word clips for the moving mouth.

The scripts read and write in `$VOICELAB_WORK` (`wav/`, `ana/out/`). To add clips without
touching the others: `python3 analyse.py <id-or-prefix> …` then `python3 finalize.py --merge`.
