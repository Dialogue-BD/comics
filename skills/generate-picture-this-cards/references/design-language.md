# Picture This! design language

## Contents

- Source geometry
- Front side
- Reverse side
- Typography
- Visual invariants

## Source geometry

Measurements come from the 48-page source deck, rendered at 300 dpi.

- Trim: 198×306 pt (2.75×4.25 in), portrait.
- Raster output: 825×1275 px at 300 dpi.
- Aspect ratio: 0.6470588.
- Background: pure white with no border, crop marks, logo, or page number.
- Every category occupies exactly two pages: picture side first, question side second.

## Front side

- Center one category title near the top. Keep it on one line whenever possible.
- Place exactly six isolated, transparent-background cutouts in a 2-column × 3-row grid.
- Use one object/action per cell. Preserve the full silhouette and generous whitespace.
- Normalize perceived size rather than forcing identical pixel bounds. A long object may be wider; a tall object may be taller.
- Do not place captions below individual images.
- Print all six labels together at the bottom, separated by commas. Arrange exactly two labels on each of three centered lines and use one shared font size across the three lines.
- Derange the label order: no printed label may occupy the same ordinal position as its image-grid item.
- Put the labels over a vertical gradient that is white at y≈1045 px and reaches its solid tint at the bottom edge.

Measured footer palette:

| Name | Bottom RGB | Hex |
|---|---:|---:|
| blue | 219, 239, 250 | `#DBEFFA` |
| green | 228, 243, 188 | `#E4F3BC` |
| orange | 253, 225, 177 | `#FDE1B1` |
| red | 221, 161, 179 | `#DDA1B3` |

The original deck cycles blue → green → orange → red. The skill's `auto` setting chooses deterministically from the title and seed, which keeps regeneration stable while distributing new cards across the same four colors.

## Reverse side

- Repeat the exact category title and title position.
- Use a plain white background; do not repeat the footer gradient or images.
- Set exactly six numbered questions.
- Put numbers in a narrow left column and align wrapped question lines to a common text indent.
- Preserve visible space between question blocks.
- Keep all content within the card; do not shrink below the builder's minimum body size.

Measured source anchors at 300 dpi:

- title ink top: about 23 px;
- title ink bottom: about 108 px;
- question number x: about 56 px;
- wrapped-question x: about 112 px;
- question right edge: about 760 px;
- first question top: about 140 px.

## Typography

Use the Officina Serif family throughout the card:

- category titles: Officina Serif Pro Black;
- front labels: Officina Serif Pro Bold;
- reverse numbers and questions: Officina Serif Pro Medium.

If the user's licensed installation is the older ITC Officina Serif Std family, use Bold for both titles and labels and Book for questions. These are explicit family-weight substitutions, not bundled fallback fonts.

The source PDF embeds subsetted Officina fonts, but those subsets must not be extracted or redistributed. The skill discovers licensed font files supplied by the user and fails clearly when they are missing. Bundled DejaVu fonts are allowed only for an explicitly disclosed draft render with `--allow-fallback-fonts`; they are not acceptable for final cards.

Use black text. Never ask ImageGen to draw any title, label, number, or question.

## Visual invariants

- Maintain the exact output size and front/back ordering.
- Keep every image isolated, readable, and free of text or watermarks.
- Keep a consistent catalog-cutout visual register across all six assets.
- Use only the four measured footer tints.
- Keep all six labels present exactly once.
- Keep the footer at exactly two labels per centered line across three lines.
- Keep all six questions present exactly once.
- Prefer simple vocabulary-card clarity over decorative novelty.
