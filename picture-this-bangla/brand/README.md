# Bhasha BhAI logo — vector rebuild

A faithful vector rebuild of the original `bhasha-vai-logo.png`, with every letter outlined (no fonts needed).

Kept from the original: two equal lime-to-green speech bubbles with a darker overlap, the ভ and the "AI" in the bubble (traced from the
original artwork, under an exact headline bar), the dark-green "AI", and the two-line italic wordmark
("Bhasha" / "BhAI") traced letter by letter from the original (custom letterforms, no font), with "AI" in bright green.

Minor improvements only:
- **Dark mode.** The original's dark-green wordmark disappears on dark backgrounds. The `On-Dark` versions
  use a near-white wordmark (`#F3F8EE`) with a brighter green "AI". The bubbles and the logomark are unchanged
  and work on both.
- **Adaptive SVGs** (`01-…-Adaptive`, `02-…-Adaptive`) switch automatically with the viewer's light/dark setting.
- One-ink black and white versions, a horizontal lockup for page headers, a favicon (the ভ bubble alone,
  for sizes under ~40 px) and an app icon (logomark on a white rounded tile).

| File | Use |
|---|---|
| `01A…On-Light` / `01B…On-Dark` | Primary logo (the original composition) |
| `01-…-Adaptive.svg` | Primary logo for web pages; follows light/dark mode |
| `01C` / `01D` | One-ink black / white |
| `02A`–`02D`, `02-…-Adaptive` | Horizontal lockup (mark + one-line wordmark) |
| `03A` / `03B` / `03C` | Logomark (two bubbles) — colour, black, white |
| `04-…-Favicon` + `icons/favicon.*` | Browser tab icon |
| `05-…-App-Icon` + `icons/app-icon-*.png` | Home-screen / apple-touch icon |
| `00M-…-Master-Sheet` | Every variant on light, dark and one-ink grounds |

Folders: `vectorcraft/` (native VectorCraft documents), `svg/`, `pdf/`, `icons/`. High-res PNGs are not kept in the repo; export them from the SVGs or VectorCraft.

On the deck page: the header uses the full stacked logo, `svg/01A-Bhasha-BhAI-Logo-On-Light.svg`, sized to fit inside the existing header bar (50px; 40–42px on phones) without making the bar taller (the page is always light, so not the adaptive file); the tab icon is `icons/favicon.svg` (with `icons/favicon.ico` as fallback) and the home-screen icon is `icons/app-icon-180.png`.

Colours: bubbles `#8AC95A → #22B26C`, overlap `#2AAA4B → #138540`, ভ and "AI" in the bubbles `#003615`,
wordmark `#033A17` (light) / `#F3F8EE` (dark), wordmark "AI" `#4ABA52 → #27A24C` (light) / `#7DD67C → #45C46A` (dark).

`source/` holds the generator (`make_logo_v2.py`, `v2_parts.py`, `master_v2.py`) and the traced outlines (`bha_traced.d`, `traced_text.json`, made by `trace_text.py`).
