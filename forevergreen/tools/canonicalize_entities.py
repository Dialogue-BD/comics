#!/usr/bin/env python3
"""Canonicalize Forevergreen Busy-Picture annotations into an entity-first 150-shot catalog.

Reads:
  - forevergreen/production/entities.json
  - forevergreen/production/exact-shot-plan.json
  - forevergreen/production/exact-pose-plan.json
  - forevergreen/production/scenes_act1..5.json, scenes_missing_b1..5.json, scenes_pose_pb1..6.json

Writes:
  - forevergreen/production/canonical-shots.json
"""

from __future__ import annotations

import glob
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROD = ROOT / "production"
AUDIO_ITEMS_DIR = ROOT / "audio" / "items"
AUDIO_FORMS_DIR = AUDIO_ITEMS_DIR / "forms"

ENTITIES_PATH = PROD / "entities.json"
SHOT_PLAN_PATH = PROD / "exact-shot-plan.json"
POSE_PLAN_PATH = PROD / "exact-pose-plan.json"
OUT_PATH = PROD / "canonical-shots.json"

DROP_LABELS = {
    "Ash",
    "Bible quote",
    "Black screen",
    "Blackout",
    "Blue sky",
    "Canyon floor",
    "Canyon shadow",
    "Canyon wall",
    "Clouds",
    "Darkness",
    "Dawn glow",
    "Deep shadow",
    "Dust motes",
    "Evening sky",
    "Firelight",
    "Fog",
    "Foggy sky",
    "Forest",
    "Forest floor",
    "Forest ridge",
    "Gap",
    "Grass",
    "Head tuft",
    "Hill",
    "Hills",
    "Hillside",
    "Hilltop",
    "Horizon",
    "John 15:13",
    "Leaf",
    "Letter F",
    "Mist",
    "Moon",
    "Crescent moon",
    "Mountain",
    "Night",
    "Night sky",
    "Opening screen",
    "Peak",
    "Pink sky",
    "Raindrops",
    "Ridge",
    "Shadow",
    "Shadows",
    "Sky",
    "Slope",
    "Snow cap",
    "Snow ridges",
    "Snowdrifts",
    "Snowy cliff",
    "Snowy cliffs",
    "Sun",
    "Sunbeam",
    "Sunbeams",
    "Sunlight",
    "Sunlit patch",
    "Sunrise",
    "Sunset",
    "Sunset glow",
    "Tail",
    "Title",
    "Violet sky",
    "Word GREEN",
    "Meadow",
    "Branch shadow",
    "Chasm",
    "Snow chunks",
    "Water spray",
    "Water ripples",
    "Splash",
    "Claw marks",
}

RAW_TO_ENTITY = {
    # Bear (character)
    "Bear": "bear",
    "Young bear": "bear",
    "Bear cub": "bear",
    "Grown bear": "bear",
    "Bears": "bear",
    "Bear head": "bear",
    "Cub head": "bear",
    "Head": "bear",
    "Bear back": "bear",
    "Cub back": "bear",
    "Back fur": "bear",
    "Shoulder": "bear",
    "Shoulders": "bear",
    "Belly": "bear",
    "Bear leg": "bear",
    "Bear legs": "bear",
    "Cub legs": "bear",
    "Bear arm": "bear",
    "Bear fur": "bear",
    "Fur": "bear",
    "Head fur": "bear",
    "Chest fur": "bear",
    "Cheek fur": "bear",
    "Fur ruff": "bear",
    "Fur tuft": "bear",

    # Bear parts
    "Bear face": "bear_face",
    "Cub face": "bear_face",
    "Mouth": "bear_face",
    "Bear mouth": "bear_face",
    "Cheeks": "bear_face",
    "Bear eyes": "bear_eyes",
    "Snout": "snout",
    "Bear snout": "snout",
    "Nose": "snout",
    "Bear ear": "bear_ear",
    "Bear ears": "bear_ear",
    "Ear": "bear_ear",
    "Ears": "bear_ear",
    "Paw": "paw",
    "Paws": "paw",
    "Bear paw": "paw",
    "Cub paws": "paw",
    "Cub foot": "paw",
    "Left paw": "paw",
    "Right paw": "paw",
    "Lower paw": "paw",
    "Hind paws": "paw",
    "Hind feet": "paw",

    # Evergreen (character) + Evergreen face parts
    "Evergreen": "evergreen",
    "Tree trunk": "evergreen",
    "Pine trunk": "evergreen",
    "Tree head": "evergreen",
    "Tree bark": "evergreen",
    "Bark": "evergreen",
    "Charred bark": "evergreen",
    "Tree arms": "evergreen",
    "Tree hand": "evergreen",
    "Foreground tree": "evergreen",
    "Tree face": "tree_face",
    "Tree smile": "warm_smile",
    "Smile": "warm_smile",
    "Tree eyes": "tree_eyes",
    "Tree eye": "tree_eyes",
    "Tree nose": "tree_nose",

    # Other characters
    "Crow": "crow",
    "Crows": "crow",
    "Perched crow": "crow",
    "Flapping crow": "crow",
    "Roosting crow": "crow",
    "Branch crow": "crow",
    "Flying crow": "crow",
    "Hedgehog": "hedgehog",
    "Mother hedgehog": "hedgehog",
    "First hedgehog": "hedgehog",
    "Second hedgehog": "hedgehog",
    "Third hedgehog": "hedgehog",
    "Hedgehog spines": "hedgehog",
    "Bird": "bird",
    "Birds": "bird",
    "Songbird": "bird",
    "Bee": "bird",
    "Butterfly": "bird",

    # Tree/foliage parts
    "Branch": "branch",
    "Branches": "branch",
    "Left branch": "branch",
    "Left branches": "branch",
    "Right branch": "branch",
    "Right branches": "branch",
    "Lower branch": "branch",
    "Upper branch": "branch",
    "Side branch": "branch",
    "Outer branch": "branch",
    "Pine branch": "branch",
    "Pine branches": "branch",
    "Tree branch": "branch",
    "Branch base": "branch",
    "Branch tip": "branch",
    "Twig": "branch",
    "Twigs": "branch",
    "Pine twig": "branch",
    "Burnt twig": "branch",
    "Dead branch": "branch",
    "Dead branches": "branch",
    "Berry twig": "branch",

    "Pine needles": "pine_needles",
    "Pine sprig": "pine_needles",
    "Canopy": "pine_needles",
    "Treetop": "pine_needles",
    "Needle crown": "pine_needles",
    "Pine crown": "pine_needles",
    "Pine canopy": "pine_needles",
    "Green canopy": "pine_needles",
    "Pine tuft": "pine_needles",
    "Pine foliage": "pine_needles",
    "Roots": "roots",
    "Tree roots": "roots",
    "Root": "roots",

    # Props
    "Play doll": "play_doll",
    "Doll ears": "play_doll",
    "Doll arms": "play_doll",
    "Chip bag": "chip_bag",
    "Bag label": "chip_bag",
    "Foil rim": "chip_bag",
    "Potato chips": "chip_bag",
    "Snack pouch": "chip_bag",
    "Snack wrapper": "chip_bag",
    "Wrapper": "chip_bag",
    "Pinecone": "pinecone",
    "Pinecones": "pinecone",
    "Cone scales": "pinecone",
    "Cone tip": "pinecone",
    "Pine seeds": "pinecone",
    "Sapling": "sapling",
    "Saplings": "sapling",
    "Green shoot": "sapling",
    "Sprout": "sapling",
    "Young pine": "sapling",
    "Stem": "sapling",
    "Tin can": "tin_can",
    "Tin cans": "tin_can",
    "Metal can": "tin_can",
    "Metal cans": "tin_can",
    "Yellow can": "tin_can",
    "Can": "tin_can",
    "Metal lid": "tin_can",
    "Container": "tin_can",
    "Mug": "tin_can",
    "Cup": "tin_can",
    "Rim": "tin_can",
    "Trash bin": "trash_bin",
    "Fallen bin": "trash_bin",
    "Bin lid": "trash_bin",
    "Garbage bag": "trash_bag",
    "Trash bags": "trash_bag",
    "Trash": "trash",
    "Trash pile": "trash",
    "Food scraps": "trash",
    "Snacks": "trash",
    "Snack box": "trash",
    "Carton": "trash",
    "Corn cob": "trash",
    "Bottle": "bottle",
    "Ketchup bottle": "bottle",
    "Plastic bottle": "bottle",
    "Tent": "tent",
    "Hammock": "hammock",
    "Picnic table": "picnic_table",
    "Bench": "picnic_table",
    "Fishing rod": "fishing_rod",
    "Fish lure": "fishing_rod",
    "Wooden sign": "wooden_sign",
    "Fire pit": "fire_pit",
    "Ember bucket": "fire_pit",
    "Stone ring": "fire_pit",
    "Wildflower": "wildflower",
    "Wildflowers": "wildflower",
    "Blossoms": "wildflower",
    "Daisies": "wildflower",
    "Spring flowers": "wildflower",
    "Yellow flower": "wildflower",
    "White flowers": "wildflower",
    "Berries": "wildflower",
    "Shrub": "wildflower",
    "Bushes": "wildflower",
    "Stick": "stick",
    "Sticks": "stick",
    "Wood chips": "stick",
    "Fallen log": "fallen_log",
    "Mossy log": "fallen_log",
    "River log": "fallen_log",
    "Tree stump": "tree_stump",
    "Stump": "tree_stump",
    "Stump rings": "tree_stump",
    "Stump rim": "tree_stump",

    # Set pieces
    "Waterfall": "waterfall",
    "Trunk bridge": "trunk_bridge",
    "Wildfire": "wildfire",
    "Flames": "wildfire",
    "Fire": "wildfire",
    "Embers": "wildfire",
    "Sparks": "wildfire",
    "Flame trail": "wildfire",
    "Smoke": "smoke",
    "River": "river",
    "Water reeds": "river",
    "Cliff": "cliff",
    "Cliffs": "cliff",
    "Rock ledge": "cliff",
    "Cliff ledge": "cliff",
    "Cliff wall": "cliff",
    "Rock wall": "cliff",
    "Rock step": "cliff",
    "Cliff rocks": "cliff",
    "Rocky ridge": "cliff",
    "Rock ridge": "cliff",
    "Mossy ledge": "cliff",
    "Canyon cliff": "cliff",
    "Boulder": "boulder",
    "Rock": "boulder",
    "Rocks": "boulder",
    "River rock": "boulder",
    "River rocks": "boulder",
    "Canyon": "canyon",
    "Trail": "trail",
    "Dirt path": "trail",
    "Snow": "snow",
    "Snow ledge": "snow",
    "Snow mound": "snow",
    "Snow mounds": "snow",
    "Snow slope": "snow",
    "Snow ridge": "snow",
    "Snowbank": "snow",
    "Snowdrift": "snow",
    "Snow overhang": "snow",
    "Icicles": "snow",
    "Pine trees": "pine_trees",
    "Pine tree": "pine_trees",
    "Trees": "pine_trees",
    "Tree trunks": "pine_trees",
    "Pine trunks": "pine_trees",
    "Evergreens": "pine_trees",
    "Valley pines": "pine_trees",
    "Forest pines": "pine_trees",
    "Autumn pines": "pine_trees",
    "Pine ridge": "pine_trees",
    "Forest trees": "pine_trees",
    "Charred trees": "pine_trees",
    "Charred wood": "pine_trees",
    "Burnt trees": "pine_trees",
    "Ash ridge": "canyon",
    "Soil mound": "soil_mound",
    "Soil": "soil_mound",
    "Dirt mound": "soil_mound",
    "Soil hollow": "soil_mound",
    "Forest hollow": "soil_mound",
    "Mossy hill": "soil_mound",
    "Grassy hill": "soil_mound",
    "Grassy slope": "soil_mound",
}

# Lower score = higher priority when deduplicating within the same keyframe
RAW_NAME_PRIORITY = {
    "Bear": 0,
    "Young bear": 1,
    "Bear cub": 1,
    "Grown bear": 1,
    "Bears": 2,
    "Evergreen": 0,
    "Tree trunk": 1,
    "Play doll": 0,
    "Doll ears": 3,
    "Doll arms": 3,
    "Chip bag": 0,
    "Sapling": 0,
    "Green shoot": 1,
    "Wildfire": 0,
    "Flames": 1,
    "Fire": 1,
    "Bear face": 0,
    "Cub face": 1,
    "Tree face": 0,
    "Tree eyes": 0,
    "Bear eyes": 0,
    "Snout": 0,
    "Paw": 0,
    "Paws": 1,
    "Branch": 0,
    "Branches": 1,
    "Pine needles": 0,
    "Trash bin": 0,
    "Trash": 0,
    "Tin can": 0,
    "Hedgehog": 0,
    "Crow": 0,
}


def resolve_entity_id(item: dict) -> str | None:
    raw_name = item["name"].strip()
    if raw_name in DROP_LABELS:
        return None

    sent = (item.get("sentence") or "").lower()

    # Disambiguate generic Eyes / Eye by context
    if raw_name in ("Eyes", "Eye"):
        if any(w in sent for w in ("tree", "evergreen", "trunk", "bark", "wooden", "knothole")):
            return "tree_eyes"
        return "bear_eyes"

    ent_id = RAW_TO_ENTITY.get(raw_name)
    if ent_id is None:
        raise ValueError(f"Unmapped raw item label: {raw_name!r}")

    # Promote emotional close-up faces into canonical expression entities
    if ent_id in ("bear_face", "tree_face"):
        if re.search(r"\b(shock|shocked|stunned|alarmed|widens?|wide[- ]eyed|gasps?|horrified|terrified)\b", sent):
            return "shocked_look"
        if re.search(r"\b(worried|anxious|nervous|uneasy|hesitat|uncertain|concerned|frown)\b", sent):
            return "worried_look"
        if re.search(r"\b(sad|grief|sorrow|guilt|guilty|regret|tears?|weep|mourn|brokenhearted|sorry)\b", sent):
            return "sad_look"
        if re.search(r"\b(angry|anger|furious|snarl|glare|glaring|scowl|cold and proud|fierce)\b", sent):
            return "angry_look"
        if re.search(r"\b(smil|warm|gentle|tender|kind|proud|happy|joy|beams?)\b", sent):
            return "warm_smile"

    return ent_id


def compute_grammar_audio(item: dict) -> dict:
    existing_ga = item.get("grammarAudio")
    if isinstance(existing_ga, dict) and existing_ga:
        return existing_ga
    audio_path = item.get("audio", "")
    stem = Path(audio_path).stem or item["id"]
    return {
        "presentContinuous": f"audio/items/forms/{stem}__now.mp3",
        "simplePast": f"audio/items/forms/{stem}__past.mp3",
        "simplePresent": f"audio/items/forms/{stem}__present.mp3",
        "question": f"audio/items/forms/{stem}__ask.mp3",
    }


def main() -> int:
    entities_list = json.loads(ENTITIES_PATH.read_text(encoding="utf-8"))
    entity_map = {e["id"]: e for e in entities_list}

    shot_plan = json.loads(SHOT_PLAN_PATH.read_text(encoding="utf-8"))
    pose_plan = json.loads(POSE_PLAN_PATH.read_text(encoding="utf-8"))

    # Load all raw annotated keyframes keyed by scene/pose id
    raw_keyframes = {}
    for p in sorted(glob.glob(str(PROD / "scenes_*.json"))):
        for sc in json.loads(Path(p).read_text(encoding="utf-8")):
            raw_keyframes[sc["id"]] = sc

    # Build base 150 real shots map
    # Note: clampedExisting has clamped ranges AFTER missingShots insertion, BEFORE pose splits
    base_shots = {}
    for sid, bounds in shot_plan["clampedExisting"].items():
        sc = raw_keyframes[sid]
        base_shots[sid] = {
            "id": sid,
            "act": sc["act"],
            "start": float(bounds["start"]),
            "end": float(bounds["end"]),
            "frameSec": float(bounds["frameSec"]),
            "title": sc["title"],
            "keyframes": [],
        }
    for m in shot_plan["missingShots"]:
        sid = m["id"]
        sc = raw_keyframes[sid]
        base_shots[sid] = {
            "id": sid,
            "act": m["act"],
            "start": float(m["start"]),
            "end": float(m["end"]),
            "frameSec": float(m["frameSec"]),
            "title": sc["title"],
            "keyframes": [],
        }

    # Attach clamped sub-window for every base scene and pose child
    clamped_all = pose_plan["clampedAll"]
    for sid, shot in base_shots.items():
        b = clamped_all.get(sid, {"start": shot["start"], "end": shot["end"], "frameSec": shot["frameSec"]})
        shot["keyframes"].append({
            "keyframeId": sid,
            "isPrimary": True,
            "start": float(b["start"]),
            "end": float(b["end"]),
            "frameSec": float(b["frameSec"]),
            "items": raw_keyframes[sid]["items"],
        })

    for ps in pose_plan["poseShots"]:
        parent_id = ps["parentSceneId"]
        pid = ps["id"]
        shot = base_shots[parent_id]
        shot["keyframes"].append({
            "keyframeId": pid,
            "isPrimary": False,
            "start": float(ps["start"]),
            "end": float(ps["end"]),
            "frameSec": float(ps["frameSec"]),
            "items": raw_keyframes[pid]["items"],
        })

    # Order 150 real shots chronologically by start
    ordered_shots = sorted(base_shots.values(), key=lambda s: (s["start"], s["id"]))

    dropped_counts = Counter()
    entity_counts = Counter()
    reused_audio = 0
    regen_audio = 0
    empty_shots = []
    out_shots = []

    for shot in ordered_shots:
        shot["keyframes"].sort(key=lambda kf: kf["frameSec"])
        kf_secs = [round(kf["frameSec"], 2) for kf in shot["keyframes"]]

        # Collect per-entity occurrences across keyframes in this shot
        per_entity_kfs: dict[str, list[tuple[dict, dict]]] = defaultdict(list)
        for kf in shot["keyframes"]:
            # Deduplicate within the same keyframe by priority score + box area
            picked: dict[str, tuple[tuple[int, float], dict]] = {}
            for it in kf["items"]:
                ent_id = resolve_entity_id(it)
                if ent_id is None:
                    dropped_counts[it["name"]] += 1
                    continue
                if ent_id not in entity_map:
                    raise ValueError(f"Resolved entity {ent_id!r} missing from entities.json")
                prio = RAW_NAME_PRIORITY.get(it["name"], 5)
                ymin, xmin, ymax, xmax = it["box"]
                area = max(1, (ymax - ymin) * (xmax - xmin))
                rank = (prio, -area)  # lower prio wins, tie-break larger box
                if ent_id not in picked or rank < picked[ent_id][0]:
                    picked[ent_id] = (rank, it)
            for ent_id, (_rank, best_it) in picked.items():
                per_entity_kfs[ent_id].append((kf, best_it))

        if not per_entity_kfs:
            empty_shots.append(shot["id"])

        entities_in_shot = []
        # Preserve consistent display order: primary keyframe order first, then chronological
        def entity_sort_key(item_pair):
            eid, entries = item_pair
            has_primary = any(kf["isPrimary"] for kf, _ in entries)
            first_t = entries[0][0]["frameSec"]
            return (0 if has_primary else 1, first_t, eid)

        for eid, entries in sorted(per_entity_kfs.items(), key=entity_sort_key):
            ent_def = entity_map[eid]
            entity_counts[eid] += 1

            # Primary seed box comes from the primary keyframe if present, else earliest seed
            primary_entry = next(((kf, it) for kf, it in entries if kf["isPrimary"]), entries[0])
            seeds = []
            present_kf_ids = set()
            beats = []

            for kf, it in entries:
                present_kf_ids.add(kf["keyframeId"])
                seeds.append({
                    "keyframeId": kf["keyframeId"],
                    "frameSec": round(kf["frameSec"], 2),
                    "box": it["box"],
                })
                orig_name = it["name"].strip()
                if orig_name == ent_def["name"] and it.get("audio") and (ROOT / it["audio"]).exists():
                    audio_rel = it["audio"]
                    needs_regen = False
                    reused_audio += 1
                else:
                    audio_rel = f"audio/items/ent_{kf['keyframeId']}_{eid}.mp3"
                    if (ROOT / audio_rel).exists():
                        needs_regen = False
                    else:
                        needs_regen = True
                    regen_audio += 1

                beats.append({
                    "keyframeId": kf["keyframeId"],
                    "start": round(kf["start"], 2),
                    "end": round(kf["end"], 2),
                    "frameSec": round(kf["frameSec"], 2),
                    "sentence": it["sentence"],
                    "sentenceBn": it["sentenceBn"],
                    "grammar": it["grammar"],
                    "audio": audio_rel,
                    "grammarAudio": compute_grammar_audio(it),
                    "needsAudioRegen": needs_regen,
                })

            absent_secs = [
                round(kf["frameSec"], 2)
                for kf in shot["keyframes"]
                if kf["keyframeId"] not in present_kf_ids
            ]

            entities_in_shot.append({
                "id": f"{shot['id']}_{eid}",
                "entityId": eid,
                "name": ent_def["name"],
                "bn": ent_def["bn"],
                "category": ent_def["category"],
                "box": primary_entry[1]["box"],
                "seeds": seeds,
                "absentFrameSecs": absent_secs,
                "beats": beats,
            })

        out_shots.append({
            "id": shot["id"],
            "act": shot["act"],
            "start": round(shot["start"], 2),
            "end": round(shot["end"], 2),
            "frameSec": round(shot["frameSec"], 2),
            "title": shot["title"],
            "keyframeSecs": kf_secs,
            "entities": entities_in_shot,
        })

    # Verify contiguity
    assert len(out_shots) == 150, f"Expected 150 real shots, got {len(out_shots)}"
    for i in range(len(out_shots) - 1):
        assert abs(out_shots[i]["end"] - out_shots[i + 1]["start"]) < 0.05, (
            f"Gap between {out_shots[i]['id']} ({out_shots[i]['end']}) and {out_shots[i+1]['id']} ({out_shots[i+1]['start']})"
        )

    OUT_PATH.write_text(json.dumps(out_shots, ensure_ascii=False, indent=2), encoding="utf-8")
    total_tracks = sum(len(s["entities"]) for s in out_shots)
    total_beats = sum(len(e["beats"]) for s in out_shots for e in s["entities"])
    print(f"Wrote {len(out_shots)} canonical shots ({total_tracks} entity-shot tracks, {total_beats} beat windows) -> {OUT_PATH.relative_to(ROOT.parent)}")
    print(f"Used {len(entity_counts)}/{len(entities_list)} canonical entities. Empty shots: {empty_shots}")
    print(f"Audio: {reused_audio} reused verbatim, {regen_audio} canonicalized-title entries.")
    print("Top 15 entities by shot count:", entity_counts.most_common(15))
    unused = [e["id"] for e in entities_list if entity_counts[e["id"]] == 0]
    if unused:
        print("Unused entities:", unused)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
