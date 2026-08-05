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
| 1–15 | 151–246 | Done, verified |
| 16 | 175 | Done, verified, boxes align (`tools/page16_data.py`) |
| 17 | 181 | Done, verified, boxes align (`tools/page17_data.py`) |
| 18 | 223 | Done, verified, boxes align (`tools/page18_data.py`) |
| 19–20 | 198, 174 | Done |
| 21 | 238 | Done, verified, boxes align (`tools/page21_data.py`) |
| 22–25 | 50, 50, 50, 47 | **Original data — boxes drift. This is the remaining work.** |

Four pages (16, 17, 18, 21) were done in one session using the tile method
below — faster than the "one page per session" estimate, because the pipeline
was already built. Their `pageNN_data.py` files are kept in `tools/` so a box
can be corrected and the page re-merged without re-reading tiles.

**Update this table after every page.**

## Grammar: all 25 pages now carry the 7 `main_*` tenses — DONE

### Label correction batch — 2026-08-05

`tools/apply_label_updates.py` applied the 233 exported suggestions as 227
distinct object updates across pages 10–22 (the newest entry wins when an
object was submitted twice). Each corrected object has a hand-authored
subject/action frame and all seven live `main_*` tense sentences were rebuilt.
The script writes both `spatial_index.json` and the inline `spatialIndex` in
`index.html`; it is safe to rerun with the same export.

The viewer's prompt list maps all 7 grammar points to `main_simple_present`,
`main_present_continuous`, `main_simple_past`, `main_past_continuous`,
`main_present_perfect`, `main_future_going_to`, `main_future_will`.

- Pages 1–10 already had them (hand-authored, richest on page 1).
- Pages 11–25 were generated: **2,344 objects**, 16,408 sentences.
- Whole book: **4,524 objects × 7 = 31,668 sentences**, none missing.
- `var images` now lists all 25 pages, so 11–25 are reachable in the app.

### How the generation works

`tools/main_tenses.py` — the engine. Input is the same 4-tuple the box pipeline
uses: `(subject, bare verb, rest, plural)`. Nothing new had to be authored,
because the legacy 42-field data is fully reversible: `future_will` is always
`"will <bare verb> <rest>"`, so `recover()` reads the verb straight back out.

Each tense gets its own rotating time marker, keyed off a stable hash of the
object id — so output is **deterministic**; re-running changes nothing.

Two things that matter and are easy to regress:

- **Stative verbs get a different marker bank.** "The pitch stretched behind the
  fence a few minutes ago" implies it has since moved. Scenery draws from
  continuity markers instead ("still stretches", "has stretched for years").
  See `STATIVE` and the `STAT_*` lists.
- **Plurality is re-derived from the subject, not trusted from legacy data.**
  Pages 22–25 carry wrong plural flags ("The cows … has to"). `is_plural()`
  reads the subject noun phrase, and deliberately treats "the group of children"
  as singular — "the group … is enjoying" is correct.

`tools/apply_main_tenses.py` — writes it in. Also repairs regularised
participles book-wide (340 fixed: `has rised` → `has risen`, `has showed` →
`has shown`, …) and rewrites 24 legacy compound verb phrases where only the head
verb could inflect ("builds or repair a wooden item"). Verbs whose regular
participle is also correct are left alone via `KEEP_REGULAR` — "has proved" is
standard English and was not churned.

Re-run any time with `python3 tools/apply_main_tenses.py` (`--dry-run` to
preview). It is idempotent.

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
