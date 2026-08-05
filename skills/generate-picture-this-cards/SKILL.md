---
name: generate-picture-this-cards
description: Create new matched front-and-back Picture This! ESL conversation cards that reproduce the original deck's fixed portrait size, six isolated image grid, shuffled comma-separated labels, four-color white-to-color footer bands, and six-question reverse. Use when Codex is asked to design, generate, extend, render, validate, or add vocabulary/category cards to the Picture This! digital or printable deck.
---

# Generate Picture This! Cards

Create a finished two-sided card pair. Generate only the six cutout illustrations with ImageGen; compose all text, layout, gradients, numbering, and exports deterministically with the bundled scripts.

## Required reading

1. Read [references/design-language.md](references/design-language.md) before authoring or rendering a card.
2. Read [references/card-spec.md](references/card-spec.md) before creating the manifest.
3. Read [references/imagegen-workflow.md](references/imagegen-workflow.md) before generating cutouts.
4. Read [references/question-writing.md](references/question-writing.md) before writing the reverse-side questions.

## Runtime preflight

Before running the scripts, load Codex's bundled workspace dependencies and use the Python executable it returns for every command below. That runtime includes Pillow, ReportLab, and pypdf, which the builder and validator require. If the bundled runtime is unavailable, verify those three imports before continuing; do not discover missing packages halfway through a build.

In the examples below, `python` means that verified executable.

The card typography requires licensed Officina font files. Before authoring or rendering, run:

```bash
python scripts/check_fonts.py
```

Prefer Officina Serif Pro Black for category titles, Officina Serif Pro Bold for front labels, and Officina Serif Pro Medium for reverse questions. When the licensed ITC Officina Serif Std family is supplied instead, use Bold for titles and labels and Book for reverse questions; report those installed weights accurately. The resolver checks `assets/fonts/private/`, the standard macOS font folders, and the `PICTURE_THIS_TITLE_FONT`, `PICTURE_THIS_LABEL_FONT`, and `PICTURE_THIS_QUESTION_FONT` environment variables. Do not extract the subsetted fonts from the source PDF or add commercial fonts to a shared repository.

Stop and ask the user for their licensed `.otf` or `.ttf` files when preflight fails. `--allow-fallback-fonts` exists only for deliberate draft renders; never use it for final cards without telling the user.

## Workflow

### 1. Author the card

Copy `assets/manifest-template.json` into a new working folder as `card.json`. Set:

- one concise category title;
- exactly six concrete, visually distinct items;
- exactly six natural discussion questions;
- a stable lowercase slug;
- `band_color` to `auto` unless the user requests a specific deck color.

Keep labels short. Treat an item description as an image prompt detail, not as the printed label.

### 2. Prepare ImageGen prompts

Run:

```bash
python scripts/make_prompts.py WORK/card.json --out WORK/image-prompts.json
```

Use built-in ImageGen once per item. Do not ask ImageGen to typeset the card or create a six-object contact sheet. Those approaches make text, spacing, scale, and transparency less reliable.

For each item:

1. Generate the single cutout on the prompt's flat chroma-key background.
2. Inspect the source.
3. Save the source in the working folder.
4. Remove the key with the installed ImageGen helper as specified in `references/imagegen-workflow.md`.
5. Inspect the alpha PNG on both dark and light backgrounds.
6. Put the final file at the corresponding `items[].image` path.

Do not silently switch to the CLI/native-transparency path. Ask first when the built-in chroma-key route cannot preserve a complex edge.

### 3. Build the pair

Run:

```bash
python scripts/build_card.py WORK/card.json --output-dir WORK/rendered
```

The builder creates:

- `front.png` and `back.png` at 825×1275 px;
- `card-pair.pdf` at the original 198×306 pt trim size;
- a self-contained normalized `card.json` plus copied cutout assets;
- `qa/pair-preview.png` for visual review.

The builder deterministically deranges the six printed labels so none remains in its image-grid position, then places exactly two labels on each of three centered footer lines. It also selects one of the four measured footer colors when `band_color` is `auto`.

### 4. Validate and inspect

Run:

```bash
python scripts/validate_card.py WORK/rendered
```

Then open `qa/pair-preview.png` and verify both sides at readable size. Validation must pass, but it does not replace visual review.

Reject or revise the pair when any of these conditions holds:

- an image contains text, a background rectangle, a key-color fringe, cropping, or multiple objects;
- image scale varies enough to make one cell feel empty or crowded;
- the title or labels feel compressed, tiny, or unbalanced;
- the footer does not contain exactly two labels on each of three centered lines;
- labels are not a true permutation of the pictured items;
- a question is ungrounded, repetitive, culturally presumptive, or too long;
- either side differs from 825×1275 px or the two PDF pages differ in trim size.

### 5. Add to the digital deck only when requested

Preview the change first:

```bash
python scripts/append_to_deck.py WORK/rendered --deck-dir PATH/TO/picture-this
```

Apply only after the preview is correct:

```bash
python scripts/append_to_deck.py WORK/rendered --deck-dir PATH/TO/picture-this --apply
```

This copies the pair into the next page numbers and updates `cards.json`, `project.json`, `annotations.json`, and the app's embedded offline card list. Do not use `--apply` merely to test the script.

## Output report

Report the category, six labels, footer color, output paths, ImageGen prompt set, ImageGen mode, and validation result. State explicitly whether the card was only rendered or also appended to a deck.
