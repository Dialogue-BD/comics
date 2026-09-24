#!/usr/bin/env python3
"""Render Local Problems fronts with a caption on each matching scene."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SKILL_SCRIPTS = Path.home() / ".codex/skills/generate-picture-this-cards/scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))
from build_card import make_preview, place_cutout, render_title, write_pdf  # noqa: E402
from card_common import load_tokens  # noqa: E402
from font_config import resolve_card_fonts  # noqa: E402


SOURCE_ROOT = Path(__file__).resolve().parents[1]


def render_front(source: dict, manifest_dir: Path, tokens: dict, fonts: dict) -> Image.Image:
    canvas = Image.new("RGBA", (825, 1275), "white")
    draw = ImageDraw.Draw(canvas)
    render_title(draw, source["title"], tokens, fonts["title"])

    # Keep the original trim and title. The six scenes now occupy the full
    # remaining height, including the space formerly used by the footer.
    left, right, top, bottom = 50, 775, 132, 1250
    column_gap, row_gap = 22, 14
    cell_width = (right - left - column_gap) / 2
    cell_height = (bottom - top - 2 * row_gap) / 3

    for index, item in enumerate(source["items"]):
        row, column = divmod(index, 2)
        cell_left = round(left + column * (cell_width + column_gap))
        cell_top = round(top + row * (cell_height + row_gap))
        cell_right = round(cell_left + cell_width)
        cell_bottom = round(cell_top + cell_height)
        place_cutout(
            canvas,
            manifest_dir / item["image"],
            (cell_left + 4, cell_top + 4, cell_right - 4, cell_bottom - 4),
        )

        # A near-opaque badge stays readable over detailed illustrations and
        # overlaps the scene instead of taking another section of the card.
        label = item["label"]
        max_text_width = round(cell_width - 44)
        for size in range(34, 25, -1):
            label_font = ImageFont.truetype(str(fonts["label"]), size)
            ink = draw.textbbox((0, 0), label, font=label_font)
            text_width = ink[2] - ink[0]
            if text_width <= max_text_width:
                break
        else:
            raise ValueError(f"Label too long for scene: {label}")

        badge_width = text_width + 30
        badge_height = 51
        badge_left = round((cell_left + cell_right - badge_width) / 2)
        badge_top = cell_bottom - badge_height - 11
        badge = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        badge_draw = ImageDraw.Draw(badge)
        badge_draw.rounded_rectangle(
            (badge_left, badge_top, badge_left + badge_width, badge_top + badge_height),
            radius=17,
            fill=(255, 255, 255, 241),
            outline=(25, 35, 40, 95),
            width=2,
        )
        canvas = Image.alpha_composite(canvas, badge)
        draw = ImageDraw.Draw(canvas)
        ink_top = badge_top + round((badge_height - (ink[3] - ink[1])) / 2)
        draw.text(
            ((cell_left + cell_right - text_width) / 2 - ink[0], ink_top - ink[1]),
            label,
            font=label_font,
            fill="#111111",
        )

    return canvas.convert("RGB")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=SOURCE_ROOT)
    parser.add_argument("--output-dir", type=Path, default=SOURCE_ROOT)
    args = parser.parse_args()
    source_root = args.source_dir.resolve()
    output = args.output_dir.resolve()
    tokens = load_tokens()
    fonts, _ = resolve_card_fonts(allow_fallback=False)
    paths = sorted((source_root / "work").glob("[0-9][0-9]-*/card.json"))
    if len(paths) != 25:
        raise RuntimeError(f"Expected 25 Local Problems manifests, found {len(paths)}")

    (output / "pages").mkdir(parents=True, exist_ok=True)
    (output / "pdfs").mkdir(parents=True, exist_ok=True)
    (output / "tiles").mkdir(parents=True, exist_ok=True)
    for number, path in enumerate(paths, start=1):
        source = json.loads(path.read_text())
        front_path = output / f"pages/page_{2 * number - 1:03d}.png"
        back_path = output / f"pages/page_{2 * number:03d}.png"
        if not back_path.is_file():
            raise RuntimeError(f"Missing existing question side: {back_path}")
        front = render_front(source, path.parent, tokens, fonts)
        front.save(front_path, dpi=(300, 300))
        for index in range(6):
            row, column = divmod(index, 2)
            cell_width = (775 - 50 - 22) / 2
            cell_height = (1250 - 132 - 2 * 14) / 3
            cell_left = round(50 + column * (cell_width + 22))
            cell_top = round(132 + row * (cell_height + 14))
            tile = front.crop((cell_left, cell_top, round(cell_left + cell_width), round(cell_top + cell_height)))
            tile.save(output / "tiles" / f"{source['slug']}-{index + 1}.webp", quality=86, method=6)
        pdf_path = output / f"pdfs/{number:02d}-{source['slug']}.pdf"
        write_pdf(front_path, back_path, pdf_path, tokens)
        if output == source_root:
            rendered = path.parent / "rendered"
            rendered.mkdir(exist_ok=True)
            front.save(rendered / "front.png", dpi=(300, 300))
            write_pdf(front_path, back_path, rendered / "card-pair.pdf", tokens)
            make_preview(front, Image.open(back_path), rendered / "qa/pair-preview.png")
            rendered_manifest = rendered / "card.json"
            if rendered_manifest.is_file():
                data = json.loads(rendered_manifest.read_text())
                data["label_order"] = [item["label"] for item in source["items"]]
                data["front_layout"] = "labels-on-pictures-v2"
                rendered_manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"Rendered {number:02d}: {source['title']}", flush=True)


if __name__ == "__main__":
    main()
