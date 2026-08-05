#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from card_common import (
    SKILL_DIR,
    CardSpecError,
    hex_to_rgb,
    load_json,
    load_tokens,
    require_valid_manifest,
    resolve_color,
    slugify,
    stable_derangement,
    stable_seed,
    write_json,
)
from font_config import font_report, resolve_card_fonts


PREVIEW_FONT = SKILL_DIR / "assets" / "fonts" / "DejaVuSansCondensed-Bold.ttf"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    if not path.is_file():
        raise CardSpecError(f"Bundled font is missing: {path}")
    return ImageFont.truetype(str(path), size=size)


def text_width(draw: ImageDraw.ImageDraw, value: str, chosen_font: ImageFont.FreeTypeFont) -> int:
    box = draw.textbbox((0, 0), value, font=chosen_font)
    return box[2] - box[0]


def draw_centered_ink_top(
    draw: ImageDraw.ImageDraw,
    value: str,
    chosen_font: ImageFont.FreeTypeFont,
    center_x: float,
    ink_top: int,
    fill: str = "#111111",
) -> None:
    box = draw.textbbox((0, 0), value, font=chosen_font)
    width = box[2] - box[0]
    draw.text((center_x - width / 2 - box[0], ink_top - box[1]), value, font=chosen_font, fill=fill)


def fit_single_line(
    draw: ImageDraw.ImageDraw,
    value: str,
    path: Path,
    max_width: int,
    start_size: int,
    min_size: int,
) -> ImageFont.FreeTypeFont:
    for size in range(start_size, min_size - 1, -1):
        candidate = font(path, size)
        if text_width(draw, value, candidate) <= max_width:
            return candidate
    raise CardSpecError(f"Text cannot fit without becoming too small: {value}")


def wrap_tokens(
    draw: ImageDraw.ImageDraw,
    tokens: list[str],
    chosen_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    lines: list[str] = []
    current = ""
    for token in tokens:
        candidate = token if not current else f"{current} {token}"
        if current and text_width(draw, candidate, chosen_font) > max_width:
            lines.append(current)
            current = token
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def wrap_words(
    draw: ImageDraw.ImageDraw,
    value: str,
    chosen_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    return wrap_tokens(draw, value.split(), chosen_font, max_width)


def render_gradient(canvas: Image.Image, top: int, color: tuple[int, int, int]) -> None:
    height = canvas.height - top
    gradient = Image.new("RGB", (1, height))
    pixels = gradient.load()
    for y in range(height):
        amount = y / max(1, height - 1)
        pixels[0, y] = tuple(round(255 + (channel - 255) * amount) for channel in color)
    canvas.paste(gradient.resize((canvas.width, height)), (0, top))


def place_cutout(canvas: Image.Image, path: Path, box: tuple[int, int, int, int]) -> None:
    cutout = Image.open(path).convert("RGBA")
    alpha_box = cutout.getchannel("A").getbbox()
    if not alpha_box:
        raise CardSpecError(f"Image contains no visible pixels: {path}")
    cutout = cutout.crop(alpha_box)
    left, top, right, bottom = box
    max_width = right - left
    max_height = bottom - top
    scale = min(max_width / cutout.width, max_height / cutout.height)
    size = (max(1, round(cutout.width * scale)), max(1, round(cutout.height * scale)))
    cutout = cutout.resize(size, Image.Resampling.LANCZOS)
    x = round((left + right - cutout.width) / 2)
    y = round((top + bottom - cutout.height) / 2)
    canvas.alpha_composite(cutout, (x, y))


def render_title(draw: ImageDraw.ImageDraw, title: str, tokens: dict[str, Any], title_font_path: Path) -> None:
    spec = tokens["title"]
    title_font = fit_single_line(
        draw,
        title,
        title_font_path,
        spec["max_width"],
        spec["start_size"],
        spec["min_size"],
    )
    draw_centered_ink_top(draw, title, title_font, 825 / 2, spec["ink_top"])


def render_front(
    data: dict[str, Any],
    manifest_dir: Path,
    tokens: dict[str, Any],
    fonts: dict[str, Path],
) -> Image.Image:
    width = tokens["canvas"]["width"]
    height = tokens["canvas"]["height"]
    canvas = Image.new("RGBA", (width, height), "white")
    draw = ImageDraw.Draw(canvas)
    color_name = data["band_color"]
    render_gradient(canvas, tokens["footer"]["gradient_top"], hex_to_rgb(tokens["palette"][color_name]))
    draw = ImageDraw.Draw(canvas)
    render_title(draw, data["title"], tokens, fonts["title"])

    grid = tokens["grid"]
    total_width = grid["right"] - grid["left"] - grid["column_gap"]
    total_height = grid["bottom"] - grid["top"] - 2 * grid["row_gap"]
    cell_width = total_width / 2
    cell_height = total_height / 3
    padding = grid["cell_padding"]
    for index, item in enumerate(data["items"]):
        row, column = divmod(index, 2)
        left = round(grid["left"] + column * (cell_width + grid["column_gap"]) + padding)
        top = round(grid["top"] + row * (cell_height + grid["row_gap"]) + padding)
        right = round(left + cell_width - 2 * padding)
        bottom = round(top + cell_height - 2 * padding)
        place_cutout(canvas, manifest_dir / item["image"], (left, top, right, bottom))

    footer = tokens["footer"]
    ordered_labels = data["label_order"]
    labels_per_line = footer["labels_per_line"]
    label_lines = []
    for start in range(0, len(ordered_labels), labels_per_line):
        end = start + labels_per_line
        line = ", ".join(ordered_labels[start:end])
        if end < len(ordered_labels):
            line += ","
        label_lines.append(line)
    if len(label_lines) != footer["line_count"]:
        raise CardSpecError(
            f"Expected {footer['line_count']} footer lines with "
            f"{labels_per_line} labels each."
        )

    chosen_font: ImageFont.FreeTypeFont | None = None
    for size in range(footer["start_size"], footer["min_size"] - 1, -1):
        candidate_font = font(fonts["label"], size)
        if all(
            text_width(draw, line, candidate_font) <= footer["max_width"]
            for line in label_lines
        ):
            chosen_font = candidate_font
            break
    if chosen_font is None:
        raise CardSpecError("A two-label footer line cannot fit at the minimum font size.")

    line_box = draw.textbbox((0, 0), "Ag", font=chosen_font)
    line_height = round((line_box[3] - line_box[1]) * 1.16)
    total_text_height = line_height * len(label_lines)
    y = round((footer["label_top"] + footer["label_bottom"] - total_text_height) / 2)
    for line in label_lines:
        draw_centered_ink_top(draw, line, chosen_font, width / 2, y)
        y += line_height
    return canvas


def question_layout(
    draw: ImageDraw.ImageDraw,
    questions: list[str],
    spec: dict[str, Any],
    question_font_path: Path,
) -> tuple[ImageFont.FreeTypeFont, list[list[str]], int, int]:
    max_width = spec["right"] - spec["text_x"]
    available = spec["bottom"] - spec["top"]
    for size in range(spec["start_size"], spec["min_size"] - 1, -1):
        chosen = font(question_font_path, size)
        wrapped = [wrap_words(draw, question, chosen, max_width) for question in questions]
        line_height = round(size * spec["line_height_ratio"])
        gap = round(size * spec["block_gap_ratio"])
        total = sum(len(lines) * line_height for lines in wrapped) + gap * (len(wrapped) - 1)
        if total <= available:
            return chosen, wrapped, line_height, gap
    raise CardSpecError("The six questions cannot fit at the minimum body font size.")


def render_back(data: dict[str, Any], tokens: dict[str, Any], fonts: dict[str, Path]) -> Image.Image:
    width = tokens["canvas"]["width"]
    height = tokens["canvas"]["height"]
    canvas = Image.new("RGBA", (width, height), "white")
    draw = ImageDraw.Draw(canvas)
    render_title(draw, data["title"], tokens, fonts["title"])
    spec = tokens["questions"]
    chosen_font, wrapped, line_height, gap = question_layout(
        draw, data["questions"], spec, fonts["question"]
    )
    y = spec["top"]
    for index, lines in enumerate(wrapped, start=1):
        draw.text((spec["number_x"], y), f"{index}.", font=chosen_font, fill="#111111")
        for line_index, line in enumerate(lines):
            draw.text((spec["text_x"], y + line_index * line_height), line, font=chosen_font, fill="#111111")
        y += len(lines) * line_height + gap
    return canvas


def write_pdf(front_path: Path, back_path: Path, output_path: Path, tokens: dict[str, Any]) -> None:
    try:
        from reportlab.lib.utils import ImageReader
        from reportlab.pdfgen.canvas import Canvas
    except ImportError as exc:
        raise CardSpecError("reportlab is required to create card-pair.pdf.") from exc

    width = tokens["canvas"]["page_width_pt"]
    height = tokens["canvas"]["page_height_pt"]
    pdf = Canvas(str(output_path), pagesize=(width, height), pageCompression=1)
    for page in (front_path, back_path):
        pdf.drawImage(ImageReader(str(page)), 0, 0, width=width, height=height)
        pdf.showPage()
    pdf.save()


def make_preview(front: Image.Image, back: Image.Image, output_path: Path) -> None:
    margin = 42
    heading = 54
    gap = 36
    preview = Image.new("RGB", (front.width * 2 + gap + margin * 2, front.height + margin * 2 + heading), "#181A20")
    draw = ImageDraw.Draw(preview)
    heading_font = font(PREVIEW_FONT, 28)
    front_x = margin
    back_x = margin + front.width + gap
    draw.text((front_x, margin), "FRONT", font=heading_font, fill="#F3F3EF")
    draw.text((back_x, margin), "BACK", font=heading_font, fill="#F3F3EF")
    preview.paste(front.convert("RGB"), (front_x, margin + heading))
    preview.paste(back.convert("RGB"), (back_x, margin + heading))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(output_path, quality=94)


def normalized_manifest(source: dict[str, Any], source_dir: Path, output_dir: Path) -> dict[str, Any]:
    result = dict(source)
    result["band_color"] = resolve_color(source)
    permutation = stable_derangement(6, stable_seed(source))
    labels = [item["label"].strip() for item in source["items"]]
    result["label_order"] = [labels[index] for index in permutation]
    result["items"] = []
    asset_dir = output_dir / "assets"
    asset_dir.mkdir(parents=True, exist_ok=True)
    for index, item in enumerate(source["items"], start=1):
        suffix = Path(item["image"]).suffix.lower() or ".png"
        filename = f"{index:02d}-{slugify(item['label'])}{suffix}"
        target = asset_dir / filename
        shutil.copy2(source_dir / item["image"], target)
        normalized_item = dict(item)
        normalized_item["image"] = f"assets/{filename}"
        result["items"].append(normalized_item)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Render a matched Picture This! card pair.")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--force", action="store_true", help="Overwrite expected files in a non-empty output folder.")
    parser.add_argument("--no-pdf", action="store_true")
    parser.add_argument(
        "--allow-fallback-fonts",
        action="store_true",
        help="Use bundled substitutes when licensed Officina fonts are unavailable.",
    )
    args = parser.parse_args()

    manifest_path = args.manifest.resolve()
    output_dir = args.output_dir.resolve()
    source = load_json(manifest_path)
    require_valid_manifest(source, manifest_path.parent, require_images=True)

    if output_dir.exists() and any(output_dir.iterdir()) and not args.force:
        raise CardSpecError(f"Output folder is not empty: {output_dir}. Use --force to overwrite expected files.")
    output_dir.mkdir(parents=True, exist_ok=True)
    tokens = load_tokens()
    fonts, fallbacks = resolve_card_fonts(allow_fallback=args.allow_fallback_fonts)
    data = normalized_manifest(source, manifest_path.parent, output_dir)
    write_json(output_dir / "card.json", data)

    front = render_front(data, output_dir, tokens, fonts)
    back = render_back(data, tokens, fonts)
    front_path = output_dir / "front.png"
    back_path = output_dir / "back.png"
    front.convert("RGB").save(front_path, dpi=(tokens["canvas"]["dpi"], tokens["canvas"]["dpi"]))
    back.convert("RGB").save(back_path, dpi=(tokens["canvas"]["dpi"], tokens["canvas"]["dpi"]))
    make_preview(front, back, output_dir / "qa" / "pair-preview.png")
    if not args.no_pdf:
        write_pdf(front_path, back_path, output_dir / "card-pair.pdf", tokens)

    print(f"Built: {data['title']}")
    print(f"Footer: {data['band_color']}")
    print("Fonts:")
    print(font_report(fonts, fallbacks))
    print(f"Front: {front_path}")
    print(f"Back: {back_path}")
    print(f"Preview: {output_dir / 'qa' / 'pair-preview.png'}")
    if not args.no_pdf:
        print(f"PDF: {output_dir / 'card-pair.pdf'}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except CardSpecError as error:
        raise SystemExit(f"ERROR:\n{error}")
