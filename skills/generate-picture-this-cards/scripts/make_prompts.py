#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from card_common import load_json, require_valid_manifest, slugify, write_json


def build_prompt(item: dict[str, str]) -> str:
    key = item.get("chroma_key", "#00ff00").lower()
    avoided_family = (
        "green, lime, chartreuse, or neon-green hues"
        if key == "#00ff00"
        else "magenta, fuchsia, hot-pink, or purple hues"
    )
    label = item["label"].strip()
    description = item["description"].strip()
    return "\n".join([
        "Use case: scientific-educational",
        "Asset type: isolated Picture This! ESL vocabulary-card cutout",
        f"Primary request: Create this single subject, and no others: {description}.",
        f"Scene/backdrop: perfectly flat solid {key} chroma-key background for later removal.",
        f"Subject: {description}; recognizable at a glance and appropriate for the printed label ‘{label}’.",
        "Style/medium: clean educational catalog cutout; polished early-2010s classroom workbook stock-photo/clip-art register; realistic proportions; bright neutral studio lighting; natural saturated color.",
        "Composition/framing: square canvas; one centered fully visible subject; no cropping; subject fills about 70 percent of the frame; generous even padding.",
        f"Constraints: the background is one uniform {key} color with no variation; keep the subject fully separated from the background; crisp edges; exactly one subject; no text, label, logo, border, watermark, cast shadow, contact shadow, reflection, floor plane, texture, or scenery; do not use {avoided_family} anywhere in the subject.",
        "Avoid: extra objects, duplicate views, collage layout, hands holding the item, background panels, decorative symbols, captions, and isolated fragments."
    ])


def main() -> int:
    parser = argparse.ArgumentParser(description="Create one built-in ImageGen prompt per card item.")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--out", type=Path, help="Write JSON to this path; otherwise print it.")
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    data = load_json(manifest_path)
    require_valid_manifest(data, manifest_path.parent, require_images=False)

    prompts = []
    for index, item in enumerate(data["items"], start=1):
        prompts.append({
            "index": index,
            "id": slugify(item["label"]),
            "label": item["label"],
            "chroma_key": item.get("chroma_key", "#00ff00").lower(),
            "expected_alpha_path": item["image"],
            "prompt": build_prompt(item),
        })

    if args.out:
        write_json(args.out.resolve(), prompts)
        print(f"Wrote {len(prompts)} prompts to {args.out.resolve()}")
    else:
        print(json.dumps(prompts, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
