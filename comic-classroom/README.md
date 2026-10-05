# Silent classroom comic viewer

Ecclesiastes and Hingsha each offer a **Tell it live** link to
`classroom.html`. These pages share `viewer.js` and `viewer.css`.

The teacher tells the story while scrolling or dragging through intact
comic pages. Page selection, previous/next, zoom, fit width, whole-page fit,
and fullscreen remain manual. No audio element, recording fetch, caption,
or automatic camera is used. Student listening returns to the recorded
activity for independent practice.

Each page defines `CLASSROOM_STORY` before loading the shared script:

- `frames`: complete page assets with `src`, `alt`, `width`, and `height`;
- `chapters`: one `title` per page, in matching order.

Ecclesiastes reuses its ten delivered pages. Hingsha uses its five full
portrait comic pages, including the epilogue, rather than its thirteen
landscape scene crops. Both keep the reviewed art from the listening version.

Keyboard shortcuts work when the comic viewer has focus: Page Up/Down or
left/right arrows change pages, Home/End go to the first/last, and +/- zoom.
Mouse dragging pans; phones use native touch scrolling and pinch zoom.

## Review · 5 October 2026

- Desktop page selection, previous/next, fit width, whole-page fitting, and
  zoom checked in the browser. Zooming to 125% allows horizontal panning.
- Hingsha keyboard Page Down and fullscreen checked; Dialogue branding stays
  visible in the toolbar.
- Phone portrait (390 × 844) and landscape (844 × 390) checked. Controls fit
  without page-level horizontal overflow.
- Final-page jumps checked for both stories. Full pages fit above the controls,
  their selectors remain correct, and Next is disabled at the end.
- Return links to listening and Tell it live links checked for both stories.
- All artwork loads; classroom pages contain zero audio elements. Browser
  warning/error log was empty during the final check.
- Shared JavaScript syntax and the existing story contract checks pass.

Touch scrolling and pinch behavior use native browser gestures; no physical
phone gesture review was performed in this desktop session. These checks
cover the local preview, not a deployed build.
