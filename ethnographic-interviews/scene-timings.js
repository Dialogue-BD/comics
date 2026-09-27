/* Word timings for the scene comics: every transcript word of each scene
   file, in line order, [start, end] in seconds.
   Written by tools/align_scenes.py -- do not hand-edit. Empty until the
   scenes are recorded; the page spreads lines over the file by length until
   a scene is here. */
const SCENE_TIMINGS = {};
if (typeof module !== 'undefined') module.exports = { SCENE_TIMINGS };
