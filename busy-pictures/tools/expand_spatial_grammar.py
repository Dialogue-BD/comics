#!/usr/bin/env python3
"""Expand picture-locked spatial grammar without changing any annotations.

Sources of truth, in descending priority:

1. A spatial relation explicitly recorded in the visually authored label.
2. Semantic containment inside a clearly named vehicle, animal pen, pond,
   or sandpit.
3. Very close, non-overlapping, similarly sized boxes for ``next to``.

The script is intentionally conservative about depth. It never infers
``behind`` or ``in front of`` from coordinates alone.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
JSON_PATH = ROOT / "spatial_index.json"
GRAMMAR_TOOL = Path(__file__).with_name("expand_inferred_grammar.py")

spec = importlib.util.spec_from_file_location("grammar_expansion", GRAMMAR_TOOL)
grammar = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(grammar)

PAGES = grammar.PAGES
SPATIAL_FIELDS = {
    "preposition_in": "in",
    "preposition_on": "on",
    "preposition_under": "under",
    "preposition_next_to": "next to",
    "preposition_behind": "behind",
    "preposition_in_front_of": "in front of",
}

# "In" is often used for clothing in the labels. Only complements containing
# one of these visibly locative heads are accepted.
IN_LOCATION_TERMS = {
    "air", "alcove", "arms", "attic", "back seat", "balcony box", "barn",
    "basket", "bathroom", "beach chair", "bedroom", "border", "bottom bunk",
    "box", "building", "bus", "cab", "cafe", "cage", "car", "clearing",
    "classroom window", "corner", "corral", "cot", "daycare doorway",
    "deckchair", "depot", "digger", "distance", "downstairs classroom",
    "enclosure", "field", "fountain", "front seat", "gable", "garden",
    "glass", "gorge", "grass", "ground", "ground floor flat", "hand",
    "harbour", "hedge", "herd", "high chair", "house", "kitchen", "loft",
    "living room", "meadow", "middle", "office window", "park", "pen",
    "playground", "police window", "pond", "porch doorway", "pot",
    "pickup-truck bed", "red roof", "rodeo ring", "roof", "room", "sand",
    "sandpit", "school", "shade", "shallow water", "shed", "sky",
    "sleeping bag", "station", "stream", "stroller", "tent", "theatre",
    "tower window", "train", "truck", "truck bed", "valley", "water",
    "wheelchair", "window", "wood", "yard",
}

# These were checked against the ten source pages. They are the few ultra-tight
# geometry matches whose apparent adjacency is misleading because of depth,
# containment, or a large composite label.
NEXT_TO_EXCLUDE = {
    "p1_obj_39", "p1_obj_54", "p1_obj_84", "p1_obj_102",
    "p2_obj_172", "p2_obj_228",
    "p6_obj_137", "p7_obj_136",
}


def relation_matches(name: str, relation: str) -> list[re.Match[str]]:
    # Do not mistake the second half of compounds such as "ride-on car" for
    # a spatial preposition.
    return list(re.finditer(
        rf"(?<!-)\b{re.escape(relation)}\b(?!-)", name, re.I
    ))


def subject_phrase(label: str) -> str:
    label = label.strip()
    if not label:
        raise ValueError("Empty subject label")
    first = label.split()[0]
    if label.lower().startswith(("the ", "a ", "an ")) or first.endswith("'s"):
        return label[:1].upper() + label[1:]
    return "The " + grammar.lower_initial(label)


def clause_from_label(obj: dict, relation: str) -> str | None:
    """Turn a visually authored relation label into a natural full sentence."""
    name = obj["name"].strip()
    matches = relation_matches(name, relation)
    if not matches:
        return None
    match = matches[-1]
    left = name[:match.start()].strip()
    complement = name[match.end():].strip()
    if not left or not complement:
        return None

    # Preserve a visible action when the label already gives one:
    # "Man resting under a tree" -> "The man is resting under a tree."
    gerunds = list(re.finditer(r"\b[a-z]+ing\b", left, re.I))
    gerund = next((item for item in gerunds if item.start() > 0), None)
    plural = grammar.is_plural(obj)
    be = "are" if plural else "is"
    if gerund:
        actor = left[:gerund.start()].strip()
        predicate = name[gerund.start():].strip()
        return f"{subject_phrase(actor)} {be} {grammar.lower_initial(predicate)}."
    return (
        f"{subject_phrase(left)} {be} {relation} "
        f"{grammar.lower_initial(complement)}."
    )


def is_locative_in_label(name: str) -> bool:
    matches = relation_matches(name, "in")
    if not matches:
        return False
    complement = name[matches[-1].end():].strip().lower()
    if complement.startswith("front of "):
        return False
    # Requiring an article or possessive rejects "in blue" and similar
    # clothing/color descriptions while retaining "in the stream".
    if not re.match(r"^(?:the|a|an|his|her)\b", complement):
        return False
    return any(
        re.search(rf"\b{re.escape(term)}\b", complement)
        for term in IN_LOCATION_TERMS
    )


def area(obj: dict) -> float:
    y1, x1, y2, x2 = obj["box"]
    return (y2 - y1) * (x2 - x1)


def fully_inside(inner: dict, outer: dict) -> bool:
    y1, x1, y2, x2 = inner["box"]
    Y1, X1, Y2, X2 = outer["box"]
    return y1 >= Y1 and y2 <= Y2 and x1 >= X1 and x2 <= X2


def containment_kind(container: dict) -> str | None:
    name = container["name"].lower()
    if "sheep pen fence" in name:
        return "sheep_pen"
    if "pig pen fence" in name:
        return "pig_pen"
    if "corral fence" in name:
        return "corral"
    if "pond" in name:
        return "pond"
    if "sandpit" in name:
        return "sandpit"
    if grammar.words(name) & {
        "train", "car", "truck", "van", "bus", "camper",
    }:
        return "vehicle"
    return None


def valid_containment(target: dict, kind: str) -> bool:
    words = grammar.words(target["name"])
    if kind == "sheep_pen":
        return bool(words & {"sheep", "lamb"})
    if kind == "pig_pen":
        return bool(words & {"pig", "pigs", "piglet", "piglets"})
    if kind == "corral":
        return bool(words & {"horse", "horses", "pony", "ponies", "mare"})
    if kind == "pond":
        return bool(words & {
            "duck", "ducks", "goose", "geese", "frog", "frogs", "reeds",
            "lily", "lilies", "fish",
        })
    if kind == "sandpit":
        return bool(
            grammar.is_person(target)
            or words & {"spade", "moulds", "watering", "sandal", "sand"}
        )
    if kind == "vehicle":
        return bool(
            grammar.is_person(target)
            and words & {
                "driver", "passenger", "child", "children", "boy", "girl",
                "man", "woman",
            }
            or words & {"suitcase", "luggage", "boxes"}
        ) and not bool(words & {
            "loading", "washing", "roof", "door", "wheel", "toolbox",
        })
    return False


def container_reference(container: dict, kind: str) -> str:
    if kind == "sheep_pen":
        return "the sheep pen"
    if kind == "pig_pen":
        return "the pig pen"
    if kind == "corral":
        return "the corral"
    if kind == "pond":
        return "the pond"
    if kind == "sandpit":
        return "the sandpit"
    name = container["name"].lower()
    for adjective in (
        "blue and white ", "blue and yellow ", "red family ", "blue family ",
        "green garbage ", "green pick-up ", "white camper ", "yellow ",
        "red ", "blue ",
    ):
        if name.startswith(adjective):
            return "the " + name
    return grammar.lower_initial(grammar.specific_subject(container))


def containment_candidate(target: dict, page_objects: list[dict]) -> tuple[dict, str] | None:
    candidates = []
    for container in page_objects:
        if container["id"] == target["id"]:
            continue
        kind = containment_kind(container)
        if not kind or not valid_containment(target, kind):
            continue
        if area(container) < 1.8 * area(target) or not fully_inside(target, container):
            continue
        candidates.append((area(container), container, kind))
    if not candidates:
        return None
    _, container, kind = min(candidates, key=lambda item: item[0])
    return container, kind


def next_to_candidate(target: dict, page_objects: list[dict]) -> dict | None:
    if target["id"] in NEXT_TO_EXCLUDE:
        return None
    y1, x1, y2, x2 = target["box"]
    height, width = y2 - y1, x2 - x1
    target_area = height * width
    candidates = []
    for other in page_objects:
        if other["id"] == target["id"] or other["id"] in NEXT_TO_EXCLUDE:
            continue
        Y1, X1, Y2, X2 = other["box"]
        other_height, other_width = Y2 - Y1, X2 - X1
        other_area = other_height * other_width
        if max(target_area, other_area) / max(.01, min(target_area, other_area)) > 3:
            continue
        vertical_overlap = max(0, min(y2, Y2) - max(y1, Y1))
        horizontal_overlap = max(0, min(x2, X2) - max(x1, X1))
        horizontal_gap = max(X1 - x2, x1 - X2, 0)
        if horizontal_overlap > 0 or horizontal_gap > .4:
            continue
        if vertical_overlap / min(height, other_height) < .5:
            continue
        vertical_offset = abs((y1 + y2 - Y1 - Y2) / 2)
        candidates.append((horizontal_gap + .1 * vertical_offset, other))
    return min(candidates, default=(None, None), key=lambda item: item[0])[1]


def exact_target(field: str, sentence: str) -> bool:
    relation = SPATIAL_FIELDS[field]
    return bool(relation_matches(sentence, relation))


def validate(index: dict, before_identity: dict) -> None:
    assert grammar.identity_snapshot(index) == before_identity
    ids = []
    for page in PAGES:
        for obj in index[page]:
            ids.append(obj["id"])
            data = obj["grammar_data"]
            for field in SPATIAL_FIELDS:
                if field in data:
                    sentence = data[field]
                    assert exact_target(field, sentence), (
                        obj["id"], field, sentence
                    )
                    assert sentence[0].isupper() and sentence[-1] in ".?!"
    assert len(ids) == len(set(ids))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    html = HTML_PATH.read_text(encoding="utf-8")
    index_match = grammar.INDEX_RE.search(html)
    if not index_match:
        raise SystemExit("Could not locate embedded spatial index")
    index = json.loads(index_match.group(1))
    json_index = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    before_identity = grammar.identity_snapshot(index)
    if before_identity != grammar.identity_snapshot(json_index):
        raise SystemExit("HTML and JSON identity/box data differ")

    before_counts = Counter()
    after_counts = Counter()
    sources = Counter()
    added: dict[str, dict[str, str]] = {}
    repaired: dict[str, dict[str, tuple[str, str]]] = {}

    for page in PAGES:
        page_objects = index[page]
        for obj in page_objects:
            data = obj["grammar_data"]
            for field in SPATIAL_FIELDS:
                if field in data:
                    before_counts[field] += 1

            # Mechanical repairs: the curriculum requires the named form,
            # not only a synonym such as "beneath" or "beside".
            repair_pairs = {
                "preposition_under": r"\b(?:below|beneath)\b",
                "preposition_next_to": r"\bbeside\b",
            }
            replacements = {
                "preposition_under": "under",
                "preposition_next_to": "next to",
            }
            for field, pattern in repair_pairs.items():
                sentence = data.get(field)
                if sentence and not exact_target(field, sentence):
                    updated = re.sub(
                        pattern, replacements[field], sentence,
                        count=1, flags=re.I,
                    )
                    if exact_target(field, updated):
                        data[field] = updated
                        repaired.setdefault(obj["id"], {})[field] = (
                            sentence, updated
                        )

            direct_relations = (
                ("preposition_in_front_of", "in front of"),
                ("preposition_next_to", "next to"),
                ("preposition_behind", "behind"),
                ("preposition_under", "under"),
                ("preposition_on", "on"),
            )
            for field, relation in direct_relations:
                if field in data:
                    continue
                sentence = clause_from_label(obj, relation)
                if sentence:
                    data[field] = sentence
                    added.setdefault(obj["id"], {})[field] = sentence
                    sources["visual_label"] += 1

            if "preposition_in" not in data and is_locative_in_label(obj["name"]):
                sentence = clause_from_label(obj, "in")
                if sentence:
                    data["preposition_in"] = sentence
                    added.setdefault(obj["id"], {})["preposition_in"] = sentence
                    sources["visual_label"] += 1

            if "preposition_in" not in data:
                candidate = containment_candidate(obj, page_objects)
                if candidate:
                    container, kind = candidate
                    be = "are" if grammar.is_plural(obj) else "is"
                    sentence = (
                        f"{grammar.specific_subject(obj)} {be} in "
                        f"{container_reference(container, kind)}."
                    )
                    data["preposition_in"] = sentence
                    added.setdefault(obj["id"], {})["preposition_in"] = sentence
                    sources["semantic_containment"] += 1

            if "preposition_next_to" not in data:
                neighbour = next_to_candidate(obj, page_objects)
                if neighbour:
                    be = "are" if grammar.is_plural(obj) else "is"
                    sentence = (
                        f"{grammar.specific_subject(obj)} {be} next to "
                        f"{grammar.lower_initial(grammar.specific_subject(neighbour))}."
                    )
                    data["preposition_next_to"] = sentence
                    added.setdefault(obj["id"], {})[
                        "preposition_next_to"
                    ] = sentence
                    sources["tight_box_adjacency"] += 1

            for field in SPATIAL_FIELDS:
                if field in data:
                    after_counts[field] += 1

    validate(index, before_identity)
    for page in PAGES:
        json_index[page] = index[page]
    validate(json_index, before_identity)

    new_sentences = [
        sentence for fields in added.values() for sentence in fields.values()
    ]
    duplicate_count = sum(
        count - 1 for count in Counter(new_sentences).values() if count > 1
    )
    print(f"New spatial sentences: {len(new_sentences)}")
    print(f"Repaired exact-target spatial sentences: "
          f"{sum(len(v) for v in repaired.values())}")
    print("Sources: " + ", ".join(
        f"{source}={count}" for source, count in sources.items()
    ))
    print(f"Exact duplicate new spatial sentences: {duplicate_count}")
    for field in SPATIAL_FIELDS:
        print(f"{field}: {before_counts[field]} -> {after_counts[field]} "
              f"(+{after_counts[field] - before_counts[field]})")
    total_objects = sum(len(index[page]) for page in PAGES)
    before_total = sum(before_counts.values())
    after_total = sum(after_counts.values())
    print(f"Spatial coverage: {before_total}/{total_objects * 6} "
          f"({before_total/(total_objects*6):.1%}) -> "
          f"{after_total}/{total_objects * 6} "
          f"({after_total/(total_objects*6):.1%})")

    if not args.apply:
        print("Dry run only. Re-run with --apply to write files.")
        return

    encoded = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    new_html = html[:index_match.start(1)] + encoded + html[index_match.end(1):]
    HTML_PATH.write_text(new_html, encoding="utf-8")
    JSON_PATH.write_text(
        json.dumps(json_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {HTML_PATH}")
    print(f"Wrote {JSON_PATH}")


if __name__ == "__main__":
    main()
