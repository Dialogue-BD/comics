#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image

from card_common import CardSpecError, load_json, load_tokens


START_MARKER = "    // PICTURE_THIS_CARDS_START\n"
END_MARKER = "    // PICTURE_THIS_CARDS_END"


def staged_json(path: Path, value: Any) -> Path:
    handle = tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, prefix=f".{path.name}.", delete=False)
    try:
        with handle:
            json.dump(value, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
        return Path(handle.name)
    except Exception:
        Path(handle.name).unlink(missing_ok=True)
        raise


def embedded_cards_html(html: str, cards: list[dict[str, Any]]) -> str:
    if START_MARKER not in html or END_MARKER not in html:
        raise CardSpecError("Deck index.html is missing the offline card-list markers required by this skill.")
    prefix, remainder = html.split(START_MARKER, 1)
    _, suffix = remainder.split(END_MARKER, 1)
    serialized = json.dumps(cards, ensure_ascii=False, indent=2)
    payload = f"    const cards = {serialized};\n"
    return prefix + START_MARKER + payload + END_MARKER + suffix


def main() -> int:
    parser = argparse.ArgumentParser(description="Preview or append a rendered pair to the Picture This! web deck.")
    parser.add_argument("project", type=Path)
    parser.add_argument("--deck-dir", type=Path, required=True)
    parser.add_argument("--apply", action="store_true", help="Apply the previously previewed deck mutation.")
    args = parser.parse_args()

    project_dir = args.project.resolve()
    deck_dir = args.deck_dir.resolve()
    manifest = load_json(project_dir / "card.json")
    cards_path = deck_dir / "cards.json"
    project_path = deck_dir / "project.json"
    annotations_path = deck_dir / "annotations.json"
    index_path = deck_dir / "index.html"
    required = [cards_path, project_path, annotations_path, index_path, project_dir / "front.png", project_dir / "back.png"]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise CardSpecError("Missing required files:\n" + "\n".join(f"- {path}" for path in missing))

    tokens = load_tokens()
    expected_size = (tokens["canvas"]["width"], tokens["canvas"]["height"])
    for path in (project_dir / "front.png", project_dir / "back.png"):
        with Image.open(path) as image:
            if image.size != expected_size:
                raise CardSpecError(f"{path.name} has size {image.size}, expected {expected_size}.")

    cards = load_json(cards_path)
    deck_project = load_json(project_path)
    annotations = load_json(annotations_path)
    if not isinstance(cards, list) or not isinstance(deck_project.get("pages"), list) or not isinstance(annotations, dict):
        raise CardSpecError("Deck JSON structure is not compatible with this skill.")
    if any(card.get("id") == manifest["slug"] for card in cards if isinstance(card, dict)):
        raise CardSpecError(f"A card with id '{manifest['slug']}' already exists.")

    next_number = len(deck_project["pages"]) + 1
    if next_number % 2 == 0:
        raise CardSpecError("The next deck page is even; the existing deck does not end on a complete pair.")
    front_name = f"page_{next_number:03d}.png"
    back_name = f"page_{next_number + 1:03d}.png"
    front_target = deck_dir / "pages" / front_name
    back_target = deck_dir / "pages" / back_name
    if front_target.exists() or back_target.exists():
        raise CardSpecError("The target page filenames already exist; refusing to overwrite them.")

    card_record = {
        "id": manifest["slug"],
        "title": manifest["title"],
        "front": f"pages/{front_name}",
        "back": f"pages/{back_name}",
    }
    updated_cards = [*cards, card_record]
    updated_project = dict(deck_project)
    updated_project["pages"] = [
        *deck_project["pages"],
        {"id": f"page_{next_number:03d}", "image": f"pages/{front_name}", "width": expected_size[0], "height": expected_size[1]},
        {"id": f"page_{next_number + 1:03d}", "image": f"pages/{back_name}", "width": expected_size[0], "height": expected_size[1]},
    ]
    updated_project["card_count"] = len(updated_cards)
    generated = list(updated_project.get("generated_cards", []))
    generated.append({"id": manifest["slug"], "title": manifest["title"], "band_color": manifest.get("band_color")})
    updated_project["generated_cards"] = generated
    updated_annotations = dict(annotations)
    updated_annotations[f"page_{next_number:03d}"] = []
    updated_annotations[f"page_{next_number + 1:03d}"] = []
    updated_html = embedded_cards_html(index_path.read_text(encoding="utf-8"), updated_cards)

    print(f"Card: {manifest['title']} ({manifest['slug']})")
    print(f"Pages: {front_name}, {back_name}")
    print(f"Deck count: {len(cards)} -> {len(updated_cards)}")
    print("Files: cards.json, project.json, annotations.json, index.html, and two page PNGs")
    if not args.apply:
        print("PREVIEW ONLY: rerun with --apply to make these changes.")
        return 0

    pages_dir = deck_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    staged: list[tuple[Path, Path]] = []
    try:
        staged.append((staged_json(cards_path, updated_cards), cards_path))
        staged.append((staged_json(project_path, updated_project), project_path))
        staged.append((staged_json(annotations_path, updated_annotations), annotations_path))
        html_temp = tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=index_path.parent, prefix=".index.html.", delete=False)
        with html_temp:
            html_temp.write(updated_html)
        staged.append((Path(html_temp.name), index_path))

        front_temp = pages_dir / f".{front_name}.tmp"
        back_temp = pages_dir / f".{back_name}.tmp"
        shutil.copy2(project_dir / "front.png", front_temp)
        shutil.copy2(project_dir / "back.png", back_temp)
        staged.extend([(front_temp, front_target), (back_temp, back_target)])
        for temporary, destination in staged:
            os.replace(temporary, destination)
    finally:
        for temporary, _ in staged:
            temporary.unlink(missing_ok=True)

    print("APPLIED: card appended to the digital deck.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except CardSpecError as error:
        raise SystemExit(f"ERROR:\n{error}")
