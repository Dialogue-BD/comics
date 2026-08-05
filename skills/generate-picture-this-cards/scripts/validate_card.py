#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

from PIL import Image

from card_common import load_json, load_tokens, validate_manifest, write_json


def inspect_alpha(path: Path) -> tuple[list[str], list[str], dict[str, Any]]:
    errors: list[str] = []
    warnings: list[str] = []
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    width, height = image.size
    if bbox is None:
        errors.append(f"{path.name}: alpha image contains no visible subject.")
        coverage = 0.0
    else:
        coverage = ((bbox[2] - bbox[0]) * (bbox[3] - bbox[1])) / (width * height)
        if coverage < 0.04:
            warnings.append(f"{path.name}: subject bounding box is unusually small ({coverage:.1%}).")
        if coverage > 0.88:
            warnings.append(f"{path.name}: subject has little transparent padding ({coverage:.1%}).")

    corner = max(3, min(width, height) // 40)
    corner_boxes = [
        (0, 0, corner, corner),
        (width - corner, 0, width, corner),
        (0, height - corner, corner, height),
        (width - corner, height - corner, width, height),
    ]
    if any(alpha.crop(box).getextrema()[1] > 8 for box in corner_boxes):
        errors.append(f"{path.name}: one or more corners are not transparent.")

    visible = 0
    key_like = 0
    pixel_data = image.get_flattened_data()
    for red, green, blue, opacity in pixel_data:
        if opacity <= 12:
            continue
        visible += 1
        green_key = green > 220 and red < 60 and blue < 60
        magenta_key = red > 220 and blue > 220 and green < 60
        if green_key or magenta_key:
            key_like += 1
    key_ratio = key_like / max(1, visible)
    if key_ratio > 0.004:
        warnings.append(f"{path.name}: possible chroma-key fringe ({key_ratio:.2%} of visible pixels).")

    return errors, warnings, {
        "path": path.name,
        "size": [width, height],
        "bbox_coverage": round(coverage, 4),
        "possible_key_ratio": round(key_ratio, 5),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a rendered Picture This! card project.")
    parser.add_argument("project", type=Path)
    args = parser.parse_args()
    project = args.project.resolve()
    manifest_path = project / "card.json"
    errors: list[str] = []
    warnings: list[str] = []
    report: dict[str, Any] = {"project": str(project), "cutouts": []}

    if not manifest_path.is_file():
        errors.append("card.json is missing.")
        data: dict[str, Any] = {}
    else:
        data = load_json(manifest_path)
        errors.extend(validate_manifest(data, project, require_images=True))

    tokens = load_tokens()
    expected_size = (tokens["canvas"]["width"], tokens["canvas"]["height"])
    for name in ("front.png", "back.png"):
        path = project / name
        if not path.is_file():
            errors.append(f"{name} is missing.")
            continue
        with Image.open(path) as page:
            if page.size != expected_size:
                errors.append(f"{name} is {page.size[0]}×{page.size[1]}, expected {expected_size[0]}×{expected_size[1]}.")
            report[name] = {"size": list(page.size), "mode": page.mode}

    labels = [item.get("label") for item in data.get("items", []) if isinstance(item, dict)]
    label_order = data.get("label_order")
    if not isinstance(label_order, list) or sorted(label_order) != sorted(labels):
        errors.append("label_order must be a permutation of the six item labels.")
    elif any(label_order[index] == labels[index] for index in range(min(len(labels), len(label_order)))):
        errors.append("label_order is not a full derangement; a label remains in its image position.")

    for item in data.get("items", []):
        if not isinstance(item, dict) or not isinstance(item.get("image"), str):
            continue
        path = project / item["image"]
        if not path.is_file():
            continue
        item_errors, item_warnings, item_report = inspect_alpha(path)
        errors.extend(item_errors)
        warnings.extend(item_warnings)
        report["cutouts"].append(item_report)

    preview = project / "qa" / "pair-preview.png"
    if not preview.is_file():
        errors.append("qa/pair-preview.png is missing.")

    pdf_path = project / "card-pair.pdf"
    if pdf_path.is_file():
        try:
            from pypdf import PdfReader

            reader = PdfReader(str(pdf_path))
            if len(reader.pages) != 2:
                errors.append(f"card-pair.pdf has {len(reader.pages)} pages; expected 2.")
            else:
                expected_points = (tokens["canvas"]["page_width_pt"], tokens["canvas"]["page_height_pt"])
                for index, page in enumerate(reader.pages, start=1):
                    size = (round(float(page.mediabox.width)), round(float(page.mediabox.height)))
                    if size != expected_points:
                        errors.append(f"card-pair.pdf page {index} is {size}, expected {expected_points} pt.")
        except ImportError:
            warnings.append("pypdf is unavailable; PDF page count and trim were not checked.")

    report["errors"] = errors
    report["warnings"] = warnings
    report["passed"] = not errors
    write_json(project / "qa" / "validation.json", report)

    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"FAIL: {len(errors)} error(s), {len(warnings)} warning(s)")
        return 1
    print(f"PASS: card structure and assets validated ({len(warnings)} warning(s))")
    print("Manual visual review of qa/pair-preview.png is still required.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
