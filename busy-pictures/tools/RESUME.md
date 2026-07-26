# Busy Pictures — annotation campaign: state and method

Read this first. It is written for a session starting cold with no memory of
previous work.

## Goal

Re-annotate all 25 wimmelbook pages so that tapping any object in the viewer
highlights it accurately and speaks a correct sentence in the currently
selected grammar structure. Target **150–250 objects per page** (Tim's spec;
denser pictures take more).

## Progress

| Page | Objects | Status |
|-----:|--------:|--------|
| 1 | 210 | Done, verified, boxes align |
| 2 | 87 so far | **IN PROGRESS — tiles r0c0 and r0c1 done. CONTINUE, do not restart.** |
| 3–25 | ~50–100 each | **Original data — boxes drift. This is the work.** |

Grammar is already correct for **all 25 pages** (42 fields per object). Only the
boxes and object coverage need redoing on pages 2–25.

**Update this table after every page.**

### Resuming page 2

`tools/page_data_2.py` already holds 87 objects from the first two tiles, each
block headed by a `# TILE rXcY` comment. **Append** the remaining tiles to it —
do not start the file again. Tiles still to do, in order:

    r0c2  r0c3  r1c0  r1c1  r1c2  r1c3  r2c0  r2c1  r2c2  r2c3

Page 2 is a shopping mall atrium: carousel in the middle, snack bar and toy shop
upstairs, a car on display, buskers and shoppers on the ground floor. It is
dense, so aim towards the upper end of the 150–250 range.

Regenerate the tiles with:

    python3 busy-pictures/tools/tiler.py busy-pictures/wimmelbook_2.jpg /tmp/tiles p2

## The one thing that will waste your time if you miss it

`spatial_index.json` is **not loaded by the viewer**. There is no `fetch` in
index.html. The index is embedded inline as `var spatialIndex = {...}`.
Updating only the JSON changes nothing on the live site — this cost a full
round of "it's fixed" / "no it isn't". `merge_page.py` writes **both**. Use it.

## Repo

- GitHub: `github.com/Dialogue-BD/comics` — site at `/comics/busy-pictures/`
- Tim's clone: `~/Downloads/Intl Student Problems Wordless Action Picture`
- **Do not run git against that folder.** The sandbox mount allows creating and
  overwriting files but not deleting them. Git cannot replace `.git/index`
  without deleting its lock, so `git add` silently stages nothing and strands a
  `.git/index.lock` that blocks Tim until it's removed via Finder. Verified by
  experiment, twice. Either clone fresh into the sandbox with a token, or leave
  files in place for Tim to push.

## Method that produced page 1

Estimating coordinates from the full page is what caused the original drift.
The fix is to read them off a grid, per tile.

1. `python3 tools/tiler.py wimmelbook_N.jpg <outdir> pN`
   Cuts the page into 12 overlapping tiles (4×3, 3% overlap, 3× upscale) with a
   grid labelled in **page-percent** coordinates.
2. View each tile. **Read box values straight off the grid labels.** No mental
   arithmetic, no estimating from the whole page.
3. Record each object as a 6-tuple in a `page_data.py`:
   ```python
   P = [
     ("Yellow rescue helicopter", [3.0, 12.5, 11.5, 22.0],
      "The yellow rescue helicopter", "fly", "over the snowy mountains", False),
   ]
   ```
   - box is `[ymin, xmin, ymax, xmax]`, percentages 0–100
   - verb is a **bare infinitive** ("fly", not "flying" or "flies")
   - rest is the remainder ("over the snowy mountains"). Starting it with a
     preposition makes several grammar points read better.
   - last field is `plural`
4. `python3 tools/merge_page.py N page_data.py`
   Generates all 42 grammar fields, drops tile-seam duplicates (IoU > 0.55),
   renumbers ids, writes index.html **and** spatial_index.json, and renders
   `tools/check_pageN.png`.
5. **Look at `check_pageN.png`.** This catches drift nothing else catches.
   Do not commit a page without viewing it.

Tiles overlap, so objects near seams get recorded twice; step 4 removes them.
Page 1 had 10 such pairs out of 220.

## Alternative: Tim draws the boxes

`annotate.html` (in the repo, live at `/comics/busy-pictures/annotate.html`)
lets Tim drag boxes directly on a page and export `boxes_pageN.json`. If he has
produced one, that is far more accurate than eyeballing tiles — crop each box,
name it from the crop, and fill in subject/verb/rest. Labels he typed are hints;
blank ones are yours to name.

## Verification before committing

- View `check_pageN.png` — boxes must sit on their objects.
- Sanity-check a few sentences:
  ```
  node -e "…extract prompts + spatialIndex + buildGrammarSentence…"
  ```
  All 40 prompts should return non-null and be well formed for a sample object.
- Object count in range 150–250.

## Pace

Page 1 took most of a long session: 12 tile reads plus ~200 authored objects.
Budget roughly one page per session. Do not half-finish a page and commit it —
save the `page_data.py` and note progress here instead.

## Fixed along the way (do not regress these)

- Grammar generation: 1727 fields had `-ing` where a bare infinitive belongs
  ("can flying" → "can fly").
- All 40 prompts now map to an explicit `field`; the old substring matcher
  silently fell back to present continuous for 24 of them.
- Present Continuous produced a fragment (no auxiliary); use
  `present_progressive`, which is a full sentence.
- Tap targeting prefers the smallest containing box, gated on rendered size
  (≥40px, geometric mean) with `visualViewport.scale` folded in.
- Highlight overlays live inside `#img-wrap` and are positioned in image
  percentages. They must **not** go back to `position: fixed` with
  `getBoundingClientRect` maths — that is what made boxes drift on Android
  while looking correct on desktop.
