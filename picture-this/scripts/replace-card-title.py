#!/usr/bin/env python3
"""Replace only the printed title on an existing Picture This card pair."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


CANVAS = (825, 1275)
INK_TOP = 23
MAX_WIDTH = 720
START_SIZE = 64
MIN_SIZE = 48
CLEAR_BOTTOM = 121


def fit_font(draw: ImageDraw.ImageDraw, title: str, font_path: Path) -> ImageFont.FreeTypeFont:
    for size in range(START_SIZE, MIN_SIZE - 1, -1):
        candidate = ImageFont.truetype(str(font_path), size=size)
        box = draw.textbbox((0, 0), title, font=candidate)
        if box[2] - box[0] <= MAX_WIDTH:
            return candidate
    raise ValueError(f"Title cannot fit within {MAX_WIDTH}px: {title}")


def replace_title(path: Path, title: str, font_path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    if image.size != CANVAS:
        raise ValueError(f"Expected {CANVAS[0]}x{CANVAS[1]} image: {path}")
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, CANVAS[0], CLEAR_BOTTOM), fill="white")
    chosen = fit_font(draw, title, font_path)
    box = draw.textbbox((0, 0), title, font=chosen)
    width = box[2] - box[0]
    draw.text(
        (CANVAS[0] / 2 - width / 2 - box[0], INK_TOP - box[1]),
        title,
        font=chosen,
        fill="#111111",
    )
    image.save(path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--front", type=Path, required=True)
    parser.add_argument("--back", type=Path, required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--font", type=Path, required=True)
    args = parser.parse_args()
    if not args.font.is_file():
        raise SystemExit(f"Title font not found: {args.font}")
    replace_title(args.front, args.title, args.font)
    replace_title(args.back, args.title, args.font)
    print(f"Updated title on {args.front.name} and {args.back.name}: {args.title}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
