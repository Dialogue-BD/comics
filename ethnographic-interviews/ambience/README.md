# Ambience beds

Every interview in `audio/` has a synthesised room-tone bed mixed under the
voice. The beds are generated, not sampled: no asset downloads, no licences,
and re-running this reproduces the same result from the same seed.

    audio/_dry-originals/   the clean TTS exports, untouched
    audio/*.mp3             the files the page actually loads (voice + bed)

## Re-render

    python3 ambience/run.py \
      "audio/_dry-originals" "audio" "<comma,separated,keys>" ""

Reads from the dry originals every time, so re-running never stacks a second
bed on an already-mixed file. Needs python3 + numpy + ffmpeg, nothing else.
The last argument is a filename suffix — pass something like "-TEST" and a
different output folder to audition without touching the live files.

## How a scene is defined

`scenes.py` maps each recording to a list of `(component, dB)` pairs, where the
dB is **relative to that file's own measured speech level**, so a quiet take and
a loud take end up with the same perceived bed. Components in `amb.py`:

  air  presence  fluoro  mains  rumble  babble  fan  dish  wind  birds
  clatter  door  keys  radio

Each recipe comes straight from the Scene block in the voice script, so the
audio matches what the document says the room sounds like.

## Two rules that matter for beginner listeners

1. **Every bed is low-passed at 3.2 kHz.** Consonants live from 2-5 kHz, and
   that is where intelligibility is won or lost. Nothing in the bed is allowed
   to compete there.
2. **Speech-to-bed in the 2-5 kHz band stays above 20 dB.** Measured on every
   render and printed. The current set runs 21.8 dB (Greg, brewery) to 45 dB
   (Mark's staff room). If a change drops a file below 20, pull that component
   down rather than shipping it.

Birds and other broadband transients are the usual offender: a first pass had
Hank's porch at 15 dB and it had to come down 6 dB.

No reverb is applied. Dry TTS placed in a wet room sounds worse than dry TTS,
and it would blur the speech further.
