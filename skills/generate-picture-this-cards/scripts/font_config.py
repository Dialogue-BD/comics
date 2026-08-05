#!/usr/bin/env python3
from __future__ import annotations

import os
import re
from pathlib import Path

from card_common import SKILL_DIR, CardSpecError


FONT_DIR = SKILL_DIR / "assets" / "fonts"
PRIVATE_FONT_DIR = FONT_DIR / "private"

FONT_ROLES = {
    "title": {
        "display_name": "Officina Serif Pro Black (or installed ITC Officina Serif Bold)",
        "env": "PICTURE_THIS_TITLE_FONT",
        "aliases": (
            "OfficinaSerifPro-Black",
            "OfficinaSerifProBlack",
            "OfficinaSerif-Black",
            "OfficinaSerifBlack",
            "OfficinaSerITC-Black",
            "OfficinaSerITCBlack",
            "ITCOfficinaSerifW04Black",
            "ITCOfficinaSerifBold",
            "ITCOfficinaSerifStdBold",
        ),
        "fallback": FONT_DIR / "DejaVuSerifCondensed-Bold.ttf",
    },
    "label": {
        "display_name": "Officina Serif Pro Bold",
        "env": "PICTURE_THIS_LABEL_FONT",
        "aliases": (
            "OfficinaSerifPro-Bold",
            "OfficinaSerifProBold",
            "OfficinaSerif-Bold",
            "OfficinaSerifBold",
            "OfficinaSerITC-Bold",
            "OfficinaSerITCBold",
            "ITCOfficinaSerifBold",
            "ITCOfficinaSerifStdBold",
        ),
        "fallback": FONT_DIR / "DejaVuSerifCondensed-Bold.ttf",
    },
    "question": {
        "display_name": "Officina Serif Pro Medium (or installed ITC Officina Serif Std Book)",
        "env": "PICTURE_THIS_QUESTION_FONT",
        "aliases": (
            "OfficinaSerifPro-Medium",
            "OfficinaSerifProMedium",
            "OfficinaSerif-Medium",
            "OfficinaSerifMedium",
            "OfficinaSerITC-Medium",
            "OfficinaSerITCMedium",
            "ITCOfficinaSerifStdBook",
        ),
        "fallback": FONT_DIR / "DejaVuSansCondensed.ttf",
    },
}

SYSTEM_FONT_DIRS = (
    Path.home() / "Library" / "Fonts",
    Path("/Library/Fonts"),
    Path("/System/Library/Fonts"),
)
FONT_SUFFIXES = {".otf", ".ttf", ".ttc"}


def normalized_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def candidate_files() -> list[Path]:
    results: list[Path] = []
    for root in (PRIVATE_FONT_DIR, *SYSTEM_FONT_DIRS):
        if not root.is_dir():
            continue
        try:
            results.extend(
                path
                for path in root.rglob("*")
                if path.is_file() and path.suffix.lower() in FONT_SUFFIXES
            )
        except PermissionError:
            continue
    return results


def resolve_card_fonts(allow_fallback: bool = False) -> tuple[dict[str, Path], list[str]]:
    available = candidate_files()
    resolved: dict[str, Path] = {}
    fallbacks: list[str] = []
    missing: list[str] = []

    for role, spec in FONT_ROLES.items():
        override = os.environ.get(str(spec["env"]))
        if override:
            chosen = Path(override).expanduser().resolve()
            if not chosen.is_file():
                raise CardSpecError(f"{spec['env']} does not point to a font file: {chosen}")
            resolved[role] = chosen
            continue

        chosen = None
        for alias in spec["aliases"]:
            normalized_alias = normalized_name(str(alias))
            matches = [
                path
                for path in available
                if normalized_alias in normalized_name(path.stem)
            ]
            if matches:
                chosen = min(
                    matches,
                    key=lambda path: (
                        "italic" in normalized_name(path.stem),
                        len(normalized_name(path.stem)),
                        str(path),
                    ),
                )
                break
        if chosen:
            resolved[role] = chosen
        elif allow_fallback:
            fallback = Path(spec["fallback"])
            if not fallback.is_file():
                raise CardSpecError(f"Fallback font is missing: {fallback}")
            resolved[role] = fallback
            fallbacks.append(role)
        else:
            missing.append(f"- {role}: {spec['display_name']} ({spec['env']})")

    if missing:
        details = "\n".join(missing)
        raise CardSpecError(
            "Licensed Officina font files are required:\n"
            f"{details}\n"
            f"Install them in ~/Library/Fonts, place them in {PRIVATE_FONT_DIR}, "
            "or set the listed environment variables to their .otf/.ttf paths. "
            "The skill does not bundle or extract commercial font files."
        )
    return resolved, fallbacks


def font_report(fonts: dict[str, Path], fallbacks: list[str]) -> str:
    lines = []
    for role in ("title", "label", "question"):
        suffix = " (fallback)" if role in fallbacks else ""
        lines.append(f"{role}: {fonts[role]}{suffix}")
    return "\n".join(lines)
