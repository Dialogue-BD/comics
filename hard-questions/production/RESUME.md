# Resume · Three.js visual revision

Latest request: improve the amateur-looking graphics in Hearing Human Voices on AI; use Three.js and optionally the ImageGen skill. User asked to continue through completion.

Completed locally on 15 November 2026: all 27 scenes rebuilt as lit Three.js miniature sets, integrated into the existing activity, and all nine captioned MP4s regenerated. Source MP3s, voice timings, SRT/VTT files, speech speed and lesson navigation are preserved. New MP4 audio packets match the previous normalized AAC streams exactly. Previous films are saved locally in the ignored `production/previous-2d-films/` directory.

Source: `motion-3d.mjs`. Vendored library: Three.js 0.180.0 in `vendor/`, with MIT license. ImageGen art-direction reference and exact prompt: `production/art-direction/`. The concept image sets palette/material direction; animated frames use actual Three.js models. Export tool: `tools/render-three-films.mjs`, also called by the existing `tools/render-films.mjs` entry point. Local render page: `tools/studio.html`. Library: `films/library.html` (accepts `?voice=gwen`). Existing live projector theatre stays at `films/index.html`, using `motion-player.mjs`. Current app/film cache revision: `three1`; renderer/still revision: `1`.

Verified: all 27 scene seek/reduced-motion contracts; all 18 transition boundaries; unchanged timing/game tests; original-speed live playback and chapter replay; 390×844 and 844×390 layouts without overflow; matching scene-still fallback with WebGL disabled. All nine new MP4s pass full decode, frame count, dimensions, color format, stereo, loudness and true-peak checks. All original MP3 hashes match. All nine extracted AAC hashes match prior films. Encoded keyframe contact sheet and phone/desktop/fallback screenshots reviewed. Browser video loading, playback and seeking passed for all nine new exports (`three-qa/film-library.json`). Reports live in `production/three-qa/` and `production/*-media-check.json`; manifest records current film hashes.

Limits: complete perceptual audiovisual playback of all nine films has not been evaluated. Do not describe sampled-frame and automated review as that review.

Release integration: prepared on current main in an isolated checkout. Existing branded lesson UI, polish and projector controls preserved through `motion-player.mjs`. All nine MP4s are available separately in `films/library.html`.
