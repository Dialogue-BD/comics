# Handoff for Codex: Hint-mode word highlight ("label boxes")

**From:** Tim (with Claude), 28 Nov 2026
**Applies to:** the `generate-picture-this-cards` skill, both decks (`/picture-this/` English and `/picture-this-bangla/`), and every new card from now on.

## 1. The feature

On a card front in **Hint** mode, each picture has a 🔊 button. While that word's audio plays, the matching word in the printed list at the bottom of the card glows gold. The printed list is deliberately in a different, shuffled order (`label_order`, a full derangement), so the page has to know **where each word is printed** on each card.

It is already built and working for all existing cards:

- `picture-this/index.html` and `picture-this-bangla/index.html` load `label-boxes.js` (cache-busted like the other data files) and draw the highlight. **No page changes are needed for new cards.**
- `picture-this/label-boxes.js` (175 cards) and `picture-this-bangla/label-boxes.js` (300 cards) hold the positions. For these existing cards they were measured from the card images by OCR (`picture-this-bangla/scripts/label_boxes.py`).
- The code arrived in commit `8ceeada` on branch `picture-this/coach-me`. Once Tim publishes it, it will be on `main`.

**What's missing:** new cards get no highlight until someone reruns the OCR script. Your card skill already knows exactly where it draws every label, so it should **record the boxes at render time**, the same way it already records `question_endpoints`. Then OCR is never needed again.

## 2. Data contract (do not change it, because the pages rely on it)

```js
// label-boxes.js
window.PT_LABEL_BOXES = {
  "<card id>": [[left, top, width, height], ... six boxes ...],
  ...
};
```

- **Units:** percentages of the full front image (0–100). Divide by the canvas width for x and width, and by the canvas height for y and height. This keeps them independent of resolution.
- **Order:** the canonical **`items` order** (image-grid order, the same index the hint buttons and games use). This is **not** the `label_order`. Box `i` is where `items[i].label` is printed.
- **Box:** the ink box of that label's text on its footer line, padded by about 0.5% of the width on each side (roughly 4 px on an 825 px-wide page). Including the label's trailing comma is fine; the existing boxes do.
- **Card id:** for English, the id used in `cards.json`, `game-data.js` and `question-data.js`. For Bangla, the card's `slug` as used in `deck-data.js`.
- A card with no entry simply shows no highlight. That is safe, but every new card should have one.

## 3. Changes to make in the skill

### 3a. `scripts/build_card.py` → `render_front()`: record the boxes while drawing the footer

The footer loop already builds each line as `", ".join(labels) + ","` and draws it with `draw_centered_ink_top(draw, line, chosen_font, width / 2, y)`. Measure each label inside that same line, **using the same font and the same text-measuring path that draws it**. For Bangla, that means the Pango/`bangla_type` shaping path, not plain Pillow metrics. Sketch:

```python
label_boxes = [None] * 6
labels = [item["label"] for item in data["items"]]
for line_labels, line in zip(lines_as_label_lists, label_lines):
    line_bbox = draw.textbbox((0, 0), line, font=chosen_font)
    line_left = width / 2 - (line_bbox[2] - line_bbox[0]) / 2 - line_bbox[0]   # the x used by draw_centered_ink_top
    origin_y = y - line_bbox[1]
    cursor_text = ""
    for k, label in enumerate(line_labels):
        prefix = cursor_text
        piece = label + ("," if (k < len(line_labels) - 1 or line.endswith(",")) else "")
        x0 = line_left + draw.textlength(prefix, font=chosen_font)
        b = draw.textbbox((x0, origin_y), piece, font=chosen_font)
        pad = width * 0.005
        label_boxes[labels.index(label)] = [
            round((b[0] - pad) / width * 100, 2), round((b[1] - pad) / height * 100, 2),
            round((b[2] - b[0] + 2 * pad) / width * 100, 2), round((b[3] - b[1] + 2 * pad) / height * 100, 2),
        ]
        cursor_text += piece + " "
    y += line_height
```

Return the boxes along with the canvas, as `render_back()` does with its endpoints, and store them:

```python
data["label_boxes"] = label_boxes      # next to question_positions / question_endpoints
```

This needs labels to be unique within a card, which they already must be.

### 3b. `scripts/validate_card.py`: validate them like `question_endpoints`

- `label_boxes` must be a list of 6 lists of 4 finite numbers from 0 to 100.
- Every box must lie inside the footer band: top at or below roughly `footer.label_top` as a percentage, minus 1, and bottom at most 100.
- Boxes must not overlap by more than 30% of the smaller box.
- Recommended: also write a QA overlay `qa/label-boxes.png` with each box outlined and numbered by item index, and look at it as part of the existing pair-preview check.

### 3c. English deck: `scripts/append_to_deck.py`

When appending a card, add or replace its entry in `picture-this/label-boxes.js`, the same way you already update `question-data.js`. Read the existing object, set `records[card_id] = manifest["label_boxes"]`, and write it back with the same three-line header comment. **Never drop existing entries.** Old cards keep their OCR boxes until they are re-rendered.

### 3d. Bangla deck: `picture-this-bangla/source/build.py` and `scripts/build_web.py`

- `source/build.py` → `render_pair()` already calls `build_card.render_front(...)`. Store the returned boxes in `card["label_boxes"]` before `card_common.write_json(...)`.
- `scripts/build_web.py` already writes `question-data.js` from each `cards/*/card.json`. It should also write `label-boxes.js`:
  - For each card, use `card.json`'s `label_boxes` when present.
  - Otherwise keep the card's existing entry from the current `label-boxes.js`, which holds the OCR values.
  - Keep the header comment, sort keys by card order, and use the format `window.PT_LABEL_BOXES = {...};`.
- `--audio-only` runs need not touch `label-boxes.js`.

### 3e. Docs in the skill

Add a short note to `references/game-compatibility.md`. `label_boxes` exposes the printed-footer geometry **in canonical item order**, for the Hint highlight only. Games must still never map pictures to labels through `label_order`.

## 4. Fallback: the OCR script (already in the repo)

`picture-this-bangla/scripts/label_boxes.py` regenerates a whole `label-boxes.js` from the card images:

```
python3 label_boxes.py bn picture-this-bangla   # uses cards/*/card.json label_order
python3 label_boxes.py en picture-this          # uses game-data.js labels
```

It needs Tesseract with the `eng` and `ben` models, plus pytesseract, numpy and Pillow. It reports any card it could not place. Use it only for cards that were rendered before 3a existed, or if render-time boxes are ever lost.

## 5. Acceptance check for every new card

1. `card.json` has `label_boxes` (6 boxes), and `validate_card.py` passes.
2. `label-boxes.js` in the target deck contains the new card id, and no other card's entry changed unexpectedly.
3. `qa/label-boxes.png` shows each box on the right word, using item index → label from `items`.
4. In the browser: open the card, turn on **Hint**, and tap each 🔊. The matching printed word glows while it plays, and the glow clears when the audio ends. Check the single-card view and Side by Side.
