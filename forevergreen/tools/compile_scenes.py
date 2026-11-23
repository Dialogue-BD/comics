#!/usr/bin/env python3
"""Compile entity-first canonical shots + SAM 2 tracks into forevergreen/scene-items.js."""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROD = ROOT / "production"
ENTITIES_PATH = PROD / "entities.json"
CANONICAL_SHOTS_PATH = PROD / "canonical-shots.json"
SAM2_TRACKS_PATH = PROD / "sam2-tracks.json"
OUT_JS = ROOT / "scene-items.js"

CATEGORY_ORDER = {
    "character": 0,
    "prop": 1,
    "set_piece": 2,
    "part": 3,
    "expression": 4,
}


def strip_beat_internal_fields(beat: dict) -> dict:
    return {
        "start": beat["start"],
        "end": beat["end"],
        "frameSec": beat["frameSec"],
        "sentence": beat["sentence"],
        "sentenceBn": beat["sentenceBn"],
        "grammar": beat["grammar"],
        "audio": beat["audio"],
        "grammarAudio": beat["grammarAudio"],
    }


def main() -> int:
    entities_def = json.loads(ENTITIES_PATH.read_text(encoding="utf-8"))
    shots = json.loads(CANONICAL_SHOTS_PATH.read_text(encoding="utf-8"))
    tracks = json.loads(SAM2_TRACKS_PATH.read_text(encoding="utf-8")) if SAM2_TRACKS_PATH.exists() else {}

    appearances_by_ent: dict[str, list[dict]] = defaultdict(list)
    compiled_scenes: list[dict] = []
    missing_audio = 0
    total_tracks = 0

    for sh in shots:
        compiled_items: list[dict] = []
        for ent in sh["entities"]:
            tr = tracks.get(ent["id"])
            beats_raw = ent["beats"]
            # Pick representative beat matching the shot's primary frameSec (or earliest beat)
            rep = min(beats_raw, key=lambda b: abs(float(b["frameSec"]) - float(sh["frameSec"])))
            beats_clean = [strip_beat_internal_fields(b) for b in beats_raw]

            for b in beats_clean:
                if not (ROOT / b["audio"]).exists():
                    missing_audio += 1

            # Determine earliest visible time for jump navigation
            appear_t = float(sh["frameSec"])
            if tr:
                first_vis = next((row[0] for row in tr if row[1] is not None), None)
                if first_vis is not None:
                    appear_t = float(first_vis)

            appearances_by_ent[ent["entityId"]].append({
                "sceneId": sh["id"],
                "time": round(appear_t, 2),
                "act": sh["act"],
                "title": sh["title"],
            })

            item_obj = {
                "id": ent["id"],
                "entityId": ent["entityId"],
                "category": ent["category"],
                "name": ent["name"],
                "bn": ent["bn"],
                "box": ent["box"],
                "sentence": rep["sentence"],
                "sentenceBn": rep["sentenceBn"],
                "grammar": rep["grammar"],
                "audio": rep["audio"],
                "grammarAudio": rep["grammarAudio"],
            }
            if tr is not None:
                item_obj["track"] = tr
                total_tracks += 1
            if len(beats_clean) > 1:
                item_obj["beats"] = beats_clean

            compiled_items.append(item_obj)

        compiled_scenes.append({
            "id": sh["id"],
            "act": sh["act"],
            "start": sh["start"],
            "end": sh["end"],
            "frameSec": sh["frameSec"],
            "title": sh["title"],
            "items": compiled_items,
        })

    compiled_entities: list[dict] = []
    for edef in entities_def:
        apps = appearances_by_ent.get(edef["id"], [])
        if not apps:
            continue
        compiled_entities.append({
            "id": edef["id"],
            "name": edef["name"],
            "bn": edef["bn"],
            "category": edef["category"],
            "appearanceCount": len(apps),
            "appearances": apps,
        })

    compiled_entities.sort(
        key=lambda e: (CATEGORY_ORDER.get(e["category"], 99), -e["appearanceCount"], e["name"])
    )

    pretty = (
        "const FOREVERGREEN_ENTITIES = "
        + json.dumps(compiled_entities, ensure_ascii=False, indent=2)
        + ";\n\nconst FOREVERGREEN_SCENES = "
        + json.dumps(compiled_scenes, ensure_ascii=False, indent=2)
        + ';\n\nif (typeof module !== "undefined") module.exports = { FOREVERGREEN_ENTITIES, FOREVERGREEN_SCENES };\n'
    )
    if len(pretty.encode("utf-8")) > 3.5 * 1024 * 1024:
        content = (
            "const FOREVERGREEN_ENTITIES = "
            + json.dumps(compiled_entities, ensure_ascii=False, separators=(",", ":"))
            + ";\n\nconst FOREVERGREEN_SCENES = "
            + json.dumps(compiled_scenes, ensure_ascii=False, separators=(",", ":"))
            + ';\n\nif (typeof module !== "undefined") module.exports = { FOREVERGREEN_ENTITIES, FOREVERGREEN_SCENES };\n'
        )
    else:
        content = pretty

    OUT_JS.write_text(content, encoding="utf-8")
    total_items = sum(len(sc["items"]) for sc in compiled_scenes)
    size_mb = len(content.encode("utf-8")) / (1024 * 1024)
    print(
        f"Compiled {len(compiled_entities)} entities, {len(compiled_scenes)} shots "
        f"({total_items} items, {total_tracks} SAM 2 tracked, {missing_audio} missing audio clips) "
        f"-> {OUT_JS.relative_to(ROOT.parent)} ({size_mb:.2f} MB)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
