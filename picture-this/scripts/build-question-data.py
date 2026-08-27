#!/usr/bin/env python3
"""Build browser-ready question text and button positions for Picture This cards."""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import subprocess
from pathlib import Path


NUMBERED_LINE = re.compile(r"^([1-6])[.,)]\s*(.*)$")
NUMBER_TOKEN = re.compile(r"^([1-6])[.,)]$")
OCR_FIXES = {
    " they Look ": " they look ",
    " ata ": " at a ",
    " putin ": " put in ",
    "toolis": "tool is",
    " ona ": " on a ",
    " onthe ": " on the ",
    "Howare": "How are",
    " sellin ": " sell in ",
}


def manifest_questions(deck_dir: Path, card_id: str, extra_roots: list[Path]) -> list[str] | None:
    candidates = [
        deck_dir / "generated" / card_id / "card.json",
        deck_dir / "generated" / card_id / "rendered" / "card.json",
    ]
    for root in extra_roots:
        candidates.extend((root / card_id / "card.json", root / card_id / "rendered" / "card.json"))
    for candidate in candidates:
        if not candidate.is_file():
            continue
        data = json.loads(candidate.read_text(encoding="utf-8"))
        questions = data.get("questions")
        if isinstance(questions, list) and len(questions) == 6 and all(isinstance(q, str) and q.strip() for q in questions):
            return [q.strip() for q in questions]
    return None


def run_tesseract(image: Path, output_format: str) -> str:
    command = ["tesseract", str(image), "stdout", "--psm", "6"]
    if output_format == "tsv":
        command.append("tsv")
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    return result.stdout


def join_wrapped_lines(lines: list[str]) -> str:
    value = ""
    for line in lines:
        line = " ".join(line.split())
        if not line:
            continue
        if value.endswith("-") and line[:1].islower():
            value = value[:-1] + line
        else:
            value = f"{value} {line}".strip()
    padded = f" {value} "
    for source, replacement in OCR_FIXES.items():
        padded = padded.replace(source, replacement)
    return padded.strip()


def ocr_questions(image: Path) -> list[str]:
    blocks: dict[int, list[str]] = {}
    current: int | None = None
    for raw_line in run_tesseract(image, "text").splitlines():
        line = raw_line.strip()
        match = NUMBERED_LINE.match(line)
        if match:
            current = int(match.group(1))
            blocks[current] = [match.group(2)]
        elif current is not None and line:
            blocks[current].append(line)
    questions = [join_wrapped_lines(blocks.get(number, [])) for number in range(1, 7)]
    if any(not question for question in questions):
        raise RuntimeError(f"Could not identify all six questions in {image}")
    return questions


def question_geometry(image: Path) -> tuple[list[float], list[dict[str, float]]]:
    rows = list(csv.DictReader(io.StringIO(run_tesseract(image, "tsv")), delimiter="\t"))
    page = next((row for row in rows if row.get("level") == "1"), None)
    if page is None:
        raise RuntimeError(f"Could not read page geometry from {image}")
    page_width = int(page["width"])
    page_height = int(page["height"])
    positions: dict[int, float] = {}
    endpoints: dict[int, dict[str, float]] = {}
    current: int | None = None
    for row in rows:
        text = row.get("text", "").strip()
        match = NUMBER_TOKEN.match(text)
        if not match:
            if current is None or row.get("level") != "5" or not text:
                continue
            left = int(row["left"])
            top = int(row["top"])
            width = int(row["width"])
            height = int(row["height"])
            # Place the glyph just after the final printed word. Clamp the x
            # coordinate so the button's invisible touch target remains inside
            # the card even when a line runs almost to the right margin.
            endpoints[current] = {
                "x": round(min(((left + width + 7) / page_width) * 100, 93.5), 2),
                "y": round(((top + height / 2) / page_height) * 100, 2),
            }
            continue
        number = int(match.group(1))
        current = number
        top = int(row["top"])
        height = int(row["height"])
        positions.setdefault(number, round(((top + height / 2) / page_height) * 100, 2))
    if len(positions) != 6 or len(endpoints) != 6:
        raise RuntimeError(
            f"Could not locate all six question bounds in {image}: "
            f"numbers={positions}, endpoints={endpoints}"
        )
    return (
        [positions[number] for number in range(1, 7)],
        [endpoints[number] for number in range(1, 7)],
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--deck-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--extra-manifest-root", action="append", type=Path, default=[])
    args = parser.parse_args()

    deck_dir = args.deck_dir.resolve()
    output = (args.output or deck_dir / "question-data.js").resolve()
    cards = json.loads((deck_dir / "cards.json").read_text(encoding="utf-8"))
    records: dict[str, dict[str, object]] = {}
    source_counts = {"manifest": 0, "ocr": 0}

    for card in cards:
        card_id = card["id"]
        back = deck_dir / card["back"]
        questions = manifest_questions(deck_dir, card_id, args.extra_manifest_root)
        source = "manifest" if questions is not None else "ocr"
        if questions is None:
            questions = ocr_questions(back)
        positions, endpoints = question_geometry(back)
        records[card_id] = {
            "questions": questions,
            "positions": positions,
            "endpoints": endpoints,
        }
        source_counts[source] += 1

    payload = json.dumps(records, ensure_ascii=False, indent=2)
    output.write_text(
        "// Discussion-question text and inline-speaker positions for card-back TTS controls.\n"
        "// Generated by scripts/build-question-data.py; do not hand-edit.\n"
        f"window.PICTURE_THIS_QUESTION_DATA = {payload};\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(records)} cards to {output}")
    print(f"Question sources: {source_counts['manifest']} manifests, {source_counts['ocr']} OCR")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
