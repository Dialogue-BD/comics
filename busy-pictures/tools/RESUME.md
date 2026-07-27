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
| 2 | 246 | Done, verified, boxes align |
| 3 | 173 | Done, verified, boxes align |
| 4 | 209 | Done, verified, boxes align |
| 5 | 213 | Done, verified, boxes align |
| 6 | 239 | Done, verified, boxes align |
| 7 | 246 | Done, verified, boxes align |
| 8 | 245 | Done, verified, boxes align |
| 9 | 206 | Done, verified, boxes align |
| 10 | 193 | Done, verified, boxes align |
| 11 | 217 | Done, verified, boxes align |
| 12–13 | ~50–100 each | **NEXT — original data, boxes drift. This is the work.** |
| 14 | 165 | Done, verified, boxes align |
| 15 | 151 | Done, verified, boxes align |
| 16–25 | ~50–100 each | **Original data — boxes drift. This is the work.** |

Grammar is already correct for **all 25 pages** (42 fields per object). Only the
boxes and object coverage need redoing on pages 2–25.

**Update this table after every page.**

### Starting page 11

Page 10 is finished; nothing to resume. Begin page 11 from scratch with the
tile method below, writing `tools/page_data_11.py` as you go so a later run
can pick it up mid-page.

Page 10 was the city park — the cafe terrace, the fountain, the kite meadow,
the puppet theatre, the ice cream kiosk, the sandpit and the playground. It
came in at 193 objects from twelve tiles at 12–21 objects each. The sparser
tiles (the lawn corners) only carry a dozen worth naming, and that is fine;
padding them with grass tufts and background hedges would not help a learner.

An `md5sum` across all 25 pages shows pages 6 and 7 are still the only
duplicate pair, so pages 10–25 each have to be read on their own. Run that
check anyway at the start of a page — it costs one command and would save a
whole session.

Two pages fit comfortably in one run at this pace. Page 8 (a cutaway block of
flats) came in at 245 and page 9 (the Wimmeltown high street, with the
building site, the shops, the school, the daycare and the police station) at
206, both in the same session. The limiting factor is reading the twelve
tiles, not authoring the sentences, so do not slow down over wording.

Two runs overlapped on page 7 and both worked on it at once. One had pushed a
partial 90-object file covering the top row of tiles when the other finished
the whole page at 246; the complete file replaced the partial one and
`merge_page.py` was re-run on top of the newer commit so the index stayed
consistent. If a page is already marked IN PROGRESS with a recent commit
behind it, check `git log` before starting — the work may already be moving.

**wimmelbook_6.jpg and wimmelbook_7.jpg are the same artwork.** A pixel
comparison lines up at zero offset; only scan and JPEG noise differ. Page 7's
boxes were read independently from its own tiles and then checked against the
verified page 6 set, and the two agreed to within about half a percent, which
is a useful confirmation that the tile arithmetic below is sound.

Things pages 2–9 taught, worth carrying forward:

- A shape glimpsed at the very edge of a tile is the commonest source of a
  wrong name. On page 9 a white panel at the right edge of one tile was
  recorded as a parked van; the check render showed it was the bonnet of the
  police car, already recorded from the tile next door. If an object is cut by
  the tile edge, look at the neighbouring tile before naming it.

- On a cutaway building page the same object often appears in two tiles with
  two different apparent widths, because one tile cuts it at its edge. The red
  sofa, the dark chest and the desert picture on page 8 each read narrower from
  the tile that clipped them. When a name repeats across neighbouring tiles,
  take the union of the two reads rather than either one, and record it once.
- `/tmp` is still poisoned by earlier sandboxes. On this run `rm -rf /tmp/cw`
  failed on every file, the clone went into it anyway, and git then refused
  with "dubious ownership". Cloning to `$HOME/repo/c` worked first time. Go
  straight there.
- On the page 10 run the leftover `/tmp/cw` did the same thing again, and the
  redirect into the existing `/tmp/clone.log` was refused too, so the log
  being tailed was a previous session's — it read as a clean successful clone
  when nothing had happened. Cloning to a name nothing else had used
  (`/tmp/cwA`, logging to `/tmp/cloneA.log`) worked, but `$HOME` is still the
  right answer. If a clone looks suspiciously instant, check the log's owner
  and mtime before trusting it.
- The Read tool cannot see the sandbox filesystem, so it cannot open the
  clone, and the Write tool cannot write into it either — every `page_data`
  file has to be created from bash with a heredoc. Only the tiles and the
  check render, copied into the outputs mount, are visible to Read.

- Twelve tiles at ~20 objects each overshoots the 250 ceiling. Aim for about
  14 per tile and check the count before committing; trimming afterwards is
  easy but re-reading tiles is not. Page 5 came in at 213 from roughly 17–18
  per tile, which is a comfortable working rate.
- Large background shapes (cliffs, walls, hedges, water) pad the count without
  giving a learner anything to name. Keep a few for variety, then cut the rest
  when trimming to the ceiling.
- `$HOME` itself is the safe place to clone, not `$HOME/work` and definitely
  not `/tmp`. On the page 6 run `/tmp/cw` was still sitting there owned by
  `nobody` from an earlier sandbox, so `rm -rf` failed on every file, `git
  clone` went ahead into it anyway, and the resulting checkout could not be
  written to — plus the redirect into `/tmp/clone.log` was refused. Clone to
  `$HOME/repo`, log to `$HOME/clone.log`, done.
- A `--sparse` clone checks out only the root by default. After it finishes you
  still need `git sparse-checkout add busy-pictures`, and the first attempt
  fails with "dubious ownership" if the directory is not yours — another reason
  to clone somewhere you own.
- Git refuses to run in a clone it thinks belongs to someone else. If you do
  hit that, `git config --global --add safe.directory <path>` clears it, but
  the real fix is to clone into a directory you own in the first place.
- Work in a clone you own, and clone into `$HOME` — **not** `/tmp`.
  `/tmp` is shared with other sandboxes and the leftovers there belong to a
  different uid, so `rm -rf /tmp/cw` fails, the clone lands somewhere else, and
  a redirect into an existing `/tmp/*.log` dies with "Permission denied" —
  which can leave you tailing another session's log and believing your clone
  ran. This happened again on the page 5 run despite the warning; go straight
  to `$HOME`.
- Background `git clone` dies when the bash call returns. Launch it with
  `setsid nohup ... & disown` and then poll the log, or it never finishes.
- Do the arithmetic from the tile's own span rather than the printed labels:
  `x_pct = x0 + px / (tile_width_px / tile_span)`. Confirm it against two
  labels before recording anything. On pages 3 and 5 that gave ~32.4 px per x
  unit and ~21.5 px per y unit, and every box landed first time.
- Verbs ending in "ing" that are genuinely bare infinitives ("swing", "ring")
  will trip a naive regex check for `-ing` after a modal. They are fine.
- Tiles overlap by 3%, so anything in the shared strip gets written twice with
  slightly different boxes and the IoU filter does not always catch it. Easier
  to claim the strip for one tile while reading: record an object only from the
  tile whose interior it sits in — for a 4x3 grid that means column interiors
  at 0–25 / 25–50 / 50–75 / 75–100 and row interiors at 0–33.3 / 33.3–66.7 /
  66.7–100. Pages 4 and 5 both came out with zero seam duplicates that way.
- Objects that straddle a seam (a long lorry, a car, an excavator) are best
  recorded once, from the tile holding most of them, with a box that runs past
  the tile edge to the object's true extent. Splitting them into two half-boxes
  makes two clumsy tap targets.
- Two boxes over the same thing under different names is the one mistake the
  check render catches late. Page 6 had a "living room window" that turned out
  to be the front door already recorded from a neighbouring tile; the IoU
  filter did not catch it because the boxes only partly overlapped. When two
  names sound like they could describe the same object, look before committing.
- Reading twelve tiles at 15–25 objects each landed page 6 on 239 without any
  trimming, which is a comfortable rate for a page this dense.
- Names must be unique within a page. Where a picture has five bushes, give
  each one a place ("Bush by the steps", "Bush by the pavement") rather than
  numbering them.
- The Read tool sees the host filesystem, not the sandbox, so tiles have to be
  written into the outputs mount to be viewable. `tiler.py <page> <outputs
  dir> pN` and then read them from there; copy `check_pageN.png` over too, and
  crop a couple of quadrants from it at full size — drift shows up in a crop
  that is invisible in the whole-page view.

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
