# The four Ds — narration

The film's narration is recorded **one line per caption**, in the coach's voice, with the rest of the lab's lines. The lines come straight from `intro.js` (`SCENES[].lines`), so they are listed in **`voice-script.md`** under *The four Ds — onboarding film* (takes `intro-coach-01` … `intro-coach-07`).

Record those takes in the AI Studio speech playground like any other take, then cut them with `tools/split_takes.py`. The cutter writes each clip's length into `audio/manifest.json`, and the film times every movement and caption to those lengths: re-record a line and the film re-times itself.

Until a line is recorded, the film estimates its length from the words and the browser's own voice reads it.
