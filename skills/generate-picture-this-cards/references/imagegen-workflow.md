# ImageGen cutout workflow

Use built-in ImageGen by default. Generate one item per call so failures can be regenerated without disturbing the other five.

## Prompt contract

Run `scripts/make_prompts.py` and use each returned prompt verbatim unless the user asked for a specific rendering style. Each prompt requests:

- one fully visible subject;
- a clean educational catalog-cutout style;
- neutral lighting and natural color;
- a flat chroma-key background;
- no floor, cast shadow, reflection, text, label, logo, border, or watermark.

Do not generate the full card with ImageGen. The compositor is the source of truth for text and geometry.

## Remove the chroma key

After saving a generated source into the working folder, run the installed helper:

```bash
python "${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py" \
  --input WORK/source.png \
  --out WORK/assets/item.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 12 \
  --opaque-threshold 220 \
  --despill
```

If a thin fringe remains, retry once with `--edge-contract 1`. Use `--edge-feather 0.25` only for visibly stair-stepped opaque edges.

## Alpha QA

Inspect the final PNG over white and over charcoal. Require:

- alpha channel present;
- transparent corners;
- one connected, readable subject silhouette;
- no bright green/magenta halo;
- no background panel or floor plane;
- no text or watermark;
- no cropping;
- adequate transparent padding.

If hair, fur, feathers, smoke, glass, liquids, translucency, or reflective edges cannot survive local removal, explain the limitation and ask before using the CLI true-transparency fallback. Never switch models or paths silently.
