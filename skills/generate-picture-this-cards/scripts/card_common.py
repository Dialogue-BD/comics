#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import random
import re
from pathlib import Path
from typing import Any


SKILL_DIR = Path(__file__).resolve().parent.parent
TOKENS_PATH = SKILL_DIR / "assets" / "design-tokens.json"
PALETTE_ORDER = ("blue", "green", "orange", "red")
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class CardSpecError(ValueError):
    pass


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def load_tokens() -> dict[str, Any]:
    return load_json(TOKENS_PATH)


def validate_manifest(data: Any, base_dir: Path, require_images: bool = False) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["The manifest root must be a JSON object."]

    title = data.get("title")
    if not isinstance(title, str) or not 2 <= len(title.strip()) <= 32:
        errors.append("title must contain 2-32 visible characters.")

    slug = data.get("slug")
    if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
        errors.append("slug must contain lowercase letters, digits, and single hyphens only.")

    tokens = load_tokens()
    allowed_colors = {"auto", *tokens["palette"].keys()}
    if data.get("band_color", "auto") not in allowed_colors:
        errors.append(f"band_color must be one of {sorted(allowed_colors)}.")

    items = data.get("items")
    if not isinstance(items, list) or len(items) != 6:
        errors.append("items must contain exactly six entries.")
        items = []

    labels: list[str] = []
    images: list[str] = []
    for index, item in enumerate(items, start=1):
        prefix = f"items[{index - 1}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object.")
            continue
        label = item.get("label")
        if not isinstance(label, str) or not label.strip() or len(label.strip()) > 32:
            errors.append(f"{prefix}.label must contain 1-32 visible characters.")
        else:
            labels.append(label.strip())
        description = item.get("description")
        if not isinstance(description, str) or not description.strip():
            errors.append(f"{prefix}.description must be a non-empty string.")
        image = item.get("image")
        if not isinstance(image, str) or not image.strip():
            errors.append(f"{prefix}.image must be a relative path.")
        else:
            candidate = Path(image)
            images.append(image)
            if candidate.is_absolute() or ".." in candidate.parts:
                errors.append(f"{prefix}.image must stay inside the card working folder.")
            elif require_images and not (base_dir / candidate).is_file():
                errors.append(f"{prefix}.image does not exist: {image}")
        key = str(item.get("chroma_key", "#00ff00")).lower()
        if key not in {"#00ff00", "#ff00ff"}:
            errors.append(f"{prefix}.chroma_key must be #00ff00 or #ff00ff.")

    if len(labels) != len(set(labels)):
        errors.append("All six item labels must be unique.")
    if len(images) != len(set(images)):
        errors.append("All six item image paths must be unique.")

    questions = data.get("questions")
    if not isinstance(questions, list) or len(questions) != 6:
        errors.append("questions must contain exactly six strings.")
        questions = []
    for index, question in enumerate(questions, start=1):
        if not isinstance(question, str) or not question.strip():
            errors.append(f"questions[{index - 1}] must be a non-empty string.")
            continue
        if len(question.strip()) > 180:
            errors.append(f"questions[{index - 1}] exceeds 180 characters.")
        if not question.rstrip().endswith("?"):
            errors.append(f"questions[{index - 1}] must end with a question mark.")

    return errors


def require_valid_manifest(data: Any, base_dir: Path, require_images: bool = False) -> None:
    errors = validate_manifest(data, base_dir, require_images=require_images)
    if errors:
        raise CardSpecError("\n".join(f"- {error}" for error in errors))


def stable_seed(data: dict[str, Any]) -> str:
    return str(data.get("seed") or data.get("slug") or data.get("title") or "picture-this")


def stable_derangement(length: int, seed: str) -> list[int]:
    if length < 2:
        raise CardSpecError("A derangement requires at least two items.")
    number = int.from_bytes(hashlib.sha256(seed.encode("utf-8")).digest()[:8], "big")
    rng = random.Random(number)
    values = list(range(length))
    for _ in range(1000):
        rng.shuffle(values)
        if all(index != value for index, value in enumerate(values)):
            return list(values)
    return list(range(1, length)) + [0]


def resolve_color(data: dict[str, Any]) -> str:
    requested = data.get("band_color", "auto")
    if requested != "auto":
        return str(requested)
    digest = hashlib.sha256(stable_seed(data).encode("utf-8")).digest()
    return PALETTE_ORDER[digest[0] % len(PALETTE_ORDER)]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    if len(value) != 6:
        raise CardSpecError(f"Invalid RGB hex color: {value}")
    return tuple(int(value[index:index + 2], 16) for index in (0, 2, 4))
