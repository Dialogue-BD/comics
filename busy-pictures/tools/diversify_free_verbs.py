#!/usr/bin/env python3
"""Diversify lexical verbs where the grammar target leaves the verb open.

Only sentences that exactly match one of the deterministic generators are
eligible. Bespoke sentences, visual-action sentences, spatial facts, object
identity, and box geometry are left untouched.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from collections import Counter, defaultdict
from contextlib import contextmanager
from dataclasses import dataclass, replace
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
JSON_PATH = ROOT / "spatial_index.json"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    assert spec.loader
    spec.loader.exec_module(module)
    return module


grammar = load_module(
    "free_verb_grammar",
    Path(__file__).with_name("expand_inferred_grammar.py"),
)
diverse = load_module(
    "free_verb_frames",
    Path(__file__).with_name("diversify_grammar_frames.py"),
)

PAGES = grammar.PAGES

# These targets prescribe a structure but leave its principal lexical action
# open. Visual-progressive and spatial fields are deliberately excluded
# because their verbs encode what is visibly happening.
FREE_VERB_FIELDS = {
    "demonstrative_this", "demonstrative_these",
    "pronoun_he", "pronoun_she", "pronoun_they",
    "pronoun_him", "pronoun_her", "pronoun_them",
    "possessive_his", "possessive_her", "possessive_their",
    "possessive_noun",
    "ability_can", "ability_cannot",
    "frequency_always", "frequency_usually", "frequency_often",
    "frequency_sometimes", "frequency_never",
    "imperative_negative",
    "past_irregular",
    "obligation_has_to", "obligation_have_to", "obligation_must",
    "future_going_is", "future_going_are", "future_will",
    "adverbs_manner", "infinitive_purpose",
    "quantifier_too_many", "quantifier_too_much",
    "quantifier_enough", "quantifier_not_enough",
    "conjunction_and", "conjunction_because", "conjunction_so",
    "used_to",
    "present_perfect_has", "present_perfect_have",
    "first_conditional", "second_conditional",
    "relative_defining_who", "relative_defining_that",
    "gerund_complement", "infinitive_complement",
    "deduction_present_cannot",
    "third_conditional_alternate", "deduction_past_might",
    "reported_told", "reported_asked",
    "relative_nondefining_who", "relative_nondefining_which",
    "wish", "if_only", "third_conditional_regret",
}


@dataclass(frozen=True)
class Action:
    base: str
    resource: str
    adverb: str
    reason: str


def actions_for(ctx, object_kind_override: str | None = None) -> list[Action]:
    words = grammar.words(ctx.obj["name"])
    if ctx.person:
        if words & {
            "worker", "builder", "carpenter", "painter", "plasterer",
            "electrician", "mechanic", "gardener", "nurse", "waiter",
            "chef", "plumber", "bricklayer", "surveyor", "roofer",
        }:
            return [
                Action("inspect the equipment", "time", "carefully",
                       "the equipment needs a careful inspection"),
                Action("prepare the materials", "supplies", "methodically",
                       "the materials are ready for use"),
                Action("complete the assigned task", "time", "efficiently",
                       "the next stage depends on this task"),
                Action("coordinate the work", "information", "professionally",
                       "several people need to work together"),
                Action("resolve a practical problem", "experience", "calmly",
                       "an unexpected problem needs attention"),
                Action("follow the safety plan", "guidance", "responsibly",
                       "the work requires careful preparation"),
            ]
        if words & {
            "driver", "rider", "cyclist", "pilot", "skier", "snowboarder",
            "parachutist", "swimmer", "sailor",
        }:
            return [
                Action("follow the planned route", "information", "carefully",
                       "the route has already been checked"),
                Action("avoid a difficult obstacle", "space", "skillfully",
                       "the way ahead requires close attention"),
                Action("check the next stage", "time", "methodically",
                       "conditions can change without warning"),
                Action("complete the journey", "energy", "steadily",
                       "the destination is still some distance away"),
                Action("transport useful supplies", "capacity", "efficiently",
                       "other people are waiting for the supplies"),
                Action("respond to changing conditions", "experience", "calmly",
                       "the surroundings can change quickly"),
            ]
        if words & {
            "musician", "guitarist", "accordion", "horn", "singer",
            "drummer",
        }:
            return [
                Action("rehearse a new piece", "time", "patiently",
                       "the performance is approaching"),
                Action("follow the rhythm", "concentration", "confidently",
                       "the other performers are keeping time"),
                Action("entertain the crowd", "energy", "enthusiastically",
                       "the audience is paying attention"),
                Action("adjust the performance", "feedback", "carefully",
                       "the sound has changed slightly"),
                Action("practise a difficult passage", "time", "methodically",
                       "one section still needs attention"),
                Action("respond to the audience", "confidence", "warmly",
                       "the listeners are showing their interest"),
            ]
        if words & {
            "child", "children", "boy", "boys", "girl", "girls", "toddler",
        }:
            return [
                Action("explore a new activity", "time", "eagerly",
                       "something unfamiliar has attracted attention"),
                Action("notice an unusual detail", "attention", "quickly",
                       "one part of the scene looks different"),
                Action("practise a new skill", "time", "patiently",
                       "the skill becomes easier with practice"),
                Action("ask a useful question", "confidence", "politely",
                       "some information is still missing"),
                Action("join the group", "space", "cheerfully",
                       "the activity is open to everyone"),
                Action("help a friend", "energy", "kindly",
                       "someone nearby needs assistance"),
            ]
        return [
            Action("coordinate the next step", "information", "carefully",
                   "several details need to be considered"),
            Action("assist someone nearby", "time", "helpfully",
                   "another person needs support"),
            Action("review the plan", "information", "thoughtfully",
                   "the situation may have changed"),
            Action("resolve a small problem", "experience", "calmly",
                   "one detail still needs attention"),
            Action("explain the situation", "time", "clearly",
                   "other people need accurate information"),
            Action("prepare for the next task", "energy", "methodically",
                   "another task will begin soon"),
        ]

    if ctx.animal:
        return [
            Action("explore the area", "energy", "cautiously",
                   "a new part of the area is open"),
            Action("search for food", "energy", "patiently",
                   "food may be available nearby"),
            Action("follow a scent", "attention", "carefully",
                   "an unfamiliar scent is in the air"),
            Action("investigate a sound", "confidence", "quietly",
                   "a new sound has come from nearby"),
            Action("approach the group", "space", "slowly",
                   "the other animals appear calm"),
            Action("rest in a safe place", "time", "peacefully",
                   "the surroundings offer some protection"),
        ]

    kind = object_kind_override or object_kind(ctx.obj["name"])
    profiles = {
        "vehicle": [
            Action("transport passengers", "fuel", "safely",
                   "people need to reach their destination"),
            Action("deliver useful supplies", "fuel", "efficiently",
                   "the supplies are needed elsewhere"),
            Action("follow the planned route", "information", "steadily",
                   "the route has already been checked"),
            Action("complete the journey", "fuel", "reliably",
                   "the destination is still ahead"),
            Action("handle difficult conditions", "power", "smoothly",
                   "the route includes a demanding section"),
            Action("support the day's work", "capacity", "dependably",
                   "several tasks rely on this transport"),
        ],
        "structure": [
            Action("shelter local people", "space", "reliably",
                   "people need protection from the weather"),
            Action("provide useful space", "room", "efficiently",
                   "the interior is available for daily use"),
            Action("protect the interior", "strength", "securely",
                   "the weather can damage exposed areas"),
            Action("support daily activity", "space", "dependably",
                   "people use this place throughout the day"),
            Action("mark an important location", "visibility", "clearly",
                   "visitors need to recognize the place"),
            Action("serve a practical purpose", "strength", "reliably",
                   "the surrounding area depends on this feature"),
        ],
        "window": [
            Action("admit natural light", "daylight", "clearly",
                   "the glass is clean and unobstructed"),
            Action("provide a clear view", "visibility", "effectively",
                   "people need to see the area outside"),
            Action("protect the interior", "strength", "securely",
                   "wind and rain can reach the building"),
            Action("help the driver see the route", "visibility", "clearly",
                   "the way ahead requires close attention"),
            Action("keep bad weather outside", "strength", "reliably",
                   "the surrounding weather can change quickly"),
            Action("allow fresh air inside", "space", "easily",
                   "the room needs better ventilation"),
        ],
        "transport_path": [
            Action("guide the vehicle", "strength", "safely",
                   "the vehicle must follow a stable route"),
            Action("connect two locations", "space", "reliably",
                   "people need a clear way through the area"),
            Action("support a heavy load", "strength", "securely",
                   "vehicles travel over it throughout the day"),
            Action("carry traffic through the area", "capacity", "efficiently",
                   "the surrounding routes need this connection"),
            Action("mark the planned route", "visibility", "clearly",
                   "travellers need to recognize the way ahead"),
            Action("handle regular traffic", "strength", "dependably",
                   "many journeys rely on this route"),
        ],
        "shade": [
            Action("provide welcome shade", "space", "effectively",
                   "people need protection from the sun"),
            Action("block the midday sunlight", "coverage", "successfully",
                   "the light is especially strong"),
            Action("protect people from rain", "coverage", "reliably",
                   "the weather can change quickly"),
            Action("cover a resting area", "space", "neatly",
                   "people are using the area below"),
            Action("reduce the heat below", "coverage", "effectively",
                   "direct sunlight is warming the area"),
            Action("shelter nearby visitors", "space", "dependably",
                   "the visitors need a protected place"),
        ],
        "nest": [
            Action("protect the eggs", "shelter", "securely",
                   "the eggs need protection from the weather"),
            Action("support the nesting bird", "strength", "reliably",
                   "the bird returns to this place regularly"),
            Action("hold nesting material", "space", "securely",
                   "the loose material must remain together"),
            Action("shelter young birds", "coverage", "effectively",
                   "the young birds need a protected place"),
            Action("endure strong weather", "strength", "reliably",
                   "wind and rain can reach the nest"),
            Action("provide a safe place", "space", "quietly",
                   "the bird needs somewhere to raise its young"),
        ],
        "sail": [
            Action("catch the wind", "wind", "efficiently",
                   "a steady breeze is crossing the water"),
            Action("guide the windsurfer", "wind", "smoothly",
                   "the rider needs to control the direction"),
            Action("provide forward power", "wind", "effectively",
                   "the board depends on the moving air"),
            Action("adjust the course", "space", "quickly",
                   "the wind direction can change"),
            Action("support the journey", "wind", "reliably",
                   "the rider still has some distance to travel"),
            Action("respond to the breeze", "wind", "smoothly",
                   "the air is moving across the water"),
        ],
        "nature": [
            Action("shape the landscape", "space", "dramatically",
                   "natural forces have formed the area"),
            Action("attract local wildlife", "shelter", "naturally",
                   "the surroundings provide suitable habitat"),
            Action("provide natural shelter", "space", "quietly",
                   "small animals need protection"),
            Action("guide visitors through the area", "visibility", "clearly",
                   "the feature can be recognized from a distance"),
            Action("support plant life", "water", "naturally",
                   "the local environment supports growth"),
            Action("change with the seasons", "time", "gradually",
                   "weather conditions vary during the year"),
        ],
        "container": [
            Action("protect its contents", "strength", "securely",
                   "the contents need protection"),
            Action("hold essential supplies", "room", "safely",
                   "the supplies must remain together"),
            Action("carry useful items", "capacity", "carefully",
                   "the items are needed somewhere else"),
            Action("support safe storage", "space", "reliably",
                   "the contents should remain organized"),
            Action("organize small objects", "room", "neatly",
                   "several items need to stay together"),
            Action("serve a practical purpose", "strength", "dependably",
                   "someone needs the contents during the day"),
        ],
        "food": [
            Action("feed a hungry visitor", "food", "generously",
                   "someone nearby needs a meal"),
            Action("provide quick energy", "food", "effectively",
                   "the day still requires plenty of effort"),
            Action("complete the meal", "food", "satisfyingly",
                   "the other dishes are already prepared"),
            Action("attract new customers", "freshness", "successfully",
                   "the food has been prepared for sale"),
            Action("satisfy a customer", "food", "fully",
                   "the customer has chosen something to eat"),
            Action("support a busy worker", "energy", "usefully",
                   "the worker needs energy for the next task"),
        ],
        "display": [
            Action("attract attention", "visibility", "clearly",
                   "the design stands out from its surroundings"),
            Action("provide useful information", "space", "clearly",
                   "visitors need to understand the message"),
            Action("guide visitors", "visibility", "effectively",
                   "people need help finding the right direction"),
            Action("mark the location", "visibility", "clearly",
                   "the place should be easy to recognize"),
            Action("identify the area", "information", "accurately",
                   "the name of the place matters"),
            Action("communicate a warning", "space", "directly",
                   "people need to notice a possible danger"),
        ],
        "furniture": [
            Action("support its user", "strength", "securely",
                   "someone needs a stable surface"),
            Action("provide a resting place", "space", "comfortably",
                   "someone may need to sit down"),
            Action("hold useful items", "room", "neatly",
                   "several items need a firm surface"),
            Action("organize the room", "space", "practically",
                   "the available area must be used well"),
            Action("create extra space", "room", "efficiently",
                   "the room has several different uses"),
            Action("serve a practical purpose", "strength", "reliably",
                   "people use it during ordinary activities"),
        ],
        "instrument": [
            Action("create a clear rhythm", "volume", "rhythmically",
                   "the performers are following the same beat"),
            Action("accompany the performer", "volume", "smoothly",
                   "the performance needs musical support"),
            Action("entertain the audience", "sound", "successfully",
                   "the listeners are paying attention"),
            Action("produce a bright sound", "volume", "clearly",
                   "the instrument has been adjusted"),
            Action("support the melody", "sound", "gently",
                   "another instrument is carrying the main tune"),
            Action("fill the area with music", "volume", "powerfully",
                   "the performance has already begun"),
        ],
        "tool": [
            Action("complete a practical task", "power", "efficiently",
                   "a worker needs to finish the job"),
            Action("help a worker", "strength", "reliably",
                   "the task requires suitable equipment"),
            Action("handle regular use", "strength", "dependably",
                   "the equipment is needed throughout the day"),
            Action("provide useful support", "power", "steadily",
                   "another part of the job depends on it"),
            Action("improve the work process", "power", "effectively",
                   "the task can be completed more efficiently"),
            Action("save time during the job", "power", "usefully",
                   "the worker has several tasks to complete"),
        ],
        "clothing": [
            Action("protect the wearer", "coverage", "effectively",
                   "the wearer needs protection from the weather"),
            Action("keep the wearer comfortable", "material", "reliably",
                   "conditions can change during the day"),
            Action("identify the wearer's role", "visibility", "clearly",
                   "other people need to recognize the wearer"),
            Action("carry a few small items", "room", "securely",
                   "the wearer needs the items close at hand"),
            Action("complete the outfit", "material", "neatly",
                   "the clothing has been chosen for the activity"),
            Action("improve the wearer's visibility", "color", "effectively",
                   "the wearer should be easy to notice"),
        ],
        "object": [
            Action("support a daily task", "strength", "reliably",
                   "someone needs it during the day"),
            Action("provide a useful function", "capacity", "effectively",
                   "it was designed for a practical purpose"),
            Action("help with regular work", "strength", "dependably",
                   "the task requires suitable equipment"),
            Action("remain ready for use", "time", "reliably",
                   "someone may need it without warning"),
            Action("improve the arrangement", "space", "usefully",
                   "the surrounding area has limited room"),
            Action("serve a practical purpose", "strength", "efficiently",
                   "people rely on it during ordinary activities"),
        ],
    }
    return profiles[kind]


def object_kind(name: str) -> str:
    words = grammar.words(name)
    head = re.split(
        r"\s+(?:with|on|in|by|under|over|at|behind|beside|near|above|"
        r"below|of|next to)\s+",
        name.lower(),
        maxsplit=1,
    )[0]
    head_words = grammar.words(head)
    if "window" in head_words:
        return "window"
    if head_words & {
        "train", "car", "truck", "van", "bus", "boat", "ship", "bicycle",
        "bike", "scooter", "plane", "helicopter", "engine", "tractor",
        "wagon", "coach", "motorcycle", "jeep", "digger", "excavator",
        "crane", "kayak", "locomotive", "carriage", "boxcar", "trolley",
        "pushchair", "aeroplane",
    }:
        return "vehicle"
    if head_words & {
        "house", "building", "station", "shop", "cafe", "hotel", "barn",
        "tower", "garage", "bridge", "roof", "wall", "fence", "door",
        "chimney", "porch", "post", "railing", "balcony", "staircase",
        "farmhouse", "chalet", "cottage", "store", "market", "school",
        "motel", "hall", "portal", "doorway", "window",
    }:
        return "structure"
    if head_words & {
        "track", "tracks", "road", "path", "route", "rail", "rails",
        "crossing", "platform",
    }:
        return "transport_path"
    if head_words & {
        "parasol", "umbrella", "awning", "canopy", "tent",
    }:
        return "shade"
    if "nest" in head_words:
        return "nest"
    if "sail" in head_words:
        return "sail"
    if head_words & {
        "tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
        "forest", "spruce", "pine", "cactus", "meadow", "mountain", "peak",
        "hill", "cliff", "rock", "rocks", "valley", "pond", "river",
        "stream", "waterfall", "grass", "sand", "cloud", "molehill",
        "bushes", "reeds", "bulrushes", "saguaro", "butte", "palm",
        "pear", "hills",
    }:
        return "nature"
    if head_words & {
        "box", "bag", "case", "basket", "bottle", "cup", "glass", "plate",
        "tray", "bucket", "bin", "suitcase", "parcel", "barrel", "jar",
        "toolbox", "crate", "chest", "can",
    }:
        return "container"
    if head_words & {
        "sign", "board", "poster", "photograph", "photo", "picture", "flag",
        "banner", "display", "painting", "graffiti", "notice",
        "nameplate",
    }:
        return "display"
    if head_words & {
        "cake", "bread", "food", "fruit", "apple", "drink", "juice",
        "hotdog", "meal", "ice", "sandwich", "sausage", "biscuit",
        "cream", "cone",
    }:
        return "food"
    if head_words & {
        "chair", "bench", "table", "desk", "bed", "sofa", "shelf",
        "cupboard", "cabinet", "drawer", "counter", "swing", "stool",
        "armchair", "seesaw",
    }:
        return "furniture"
    if head_words & {
        "drum", "guitar", "accordion", "horn", "trumpet", "instrument",
    }:
        return "instrument"
    if head_words & {
        "tool", "drill", "hammer", "broom", "hose", "ladder", "camera",
        "tripod", "machine", "turbine", "panel", "wheel", "wheels",
        "girder", "girders", "dam", "stepladder", "pipe", "panels",
    }:
        return "tool"
    if head_words & {
        "hat", "cap", "coat", "jacket", "shirt", "dress", "skirt",
        "trousers", "pants", "boot", "boots", "shoe", "shoes", "scarf",
        "glove", "gloves", "uniform", "apron", "helmet", "clothes",
    }:
        return "clothing"
    return "object"


def corrected_context(obj: dict):
    ctx = diverse.make_context(obj)
    if not re.match(r"^[^ ]+(?:'s|s')\s", obj["name"], re.I):
        return ctx
    # The possessor is not the selected object: a driver's cab window is a
    # window, and a bird's nest is a nest.
    original_person = grammar.is_person
    original_animal = grammar.is_animal
    try:
        grammar.is_person = lambda candidate: (
            False if candidate["id"] == obj["id"] else original_person(candidate)
        )
        grammar.is_animal = lambda candidate: (
            False if candidate["id"] == obj["id"] else original_animal(candidate)
        )
        base_rule = grammar.rule_for(obj)
    finally:
        grammar.is_person = original_person
        grammar.is_animal = original_animal
    return replace(
        ctx,
        person=False,
        animal=False,
        kind=object_kind(obj["name"]),
        rule=base_rule,
        pronoun="it",
        pronoun_object="it",
        owner="its",
    )


def legacy_object_kind(name: str) -> str:
    """Classifier used by the first free-verb draft, for safe migration."""
    words = grammar.words(name)
    if words & {
        "train", "car", "truck", "van", "bus", "boat", "ship", "bicycle",
        "bike", "scooter", "plane", "helicopter", "engine", "tractor",
        "wagon", "coach", "motorcycle", "jeep", "digger", "excavator",
        "crane", "kayak",
    }:
        return "vehicle"
    if words & {
        "house", "building", "station", "shop", "cafe", "hotel", "barn",
        "tower", "garage", "bridge", "roof", "wall", "fence", "door",
        "chimney", "porch", "post", "railing", "balcony", "staircase",
    }:
        return "structure"
    if words & {
        "tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
        "forest", "spruce", "pine", "cactus", "meadow", "mountain", "peak",
        "hill", "cliff", "rock", "rocks", "valley", "pond", "river",
        "stream", "waterfall", "grass", "sand", "cloud", "molehill",
    }:
        return "nature"
    if words & {
        "box", "bag", "case", "basket", "bottle", "cup", "glass", "plate",
        "tray", "bucket", "bin", "suitcase", "parcel", "barrel", "jar",
    }:
        return "container"
    if words & {
        "cake", "bread", "food", "fruit", "apple", "drink", "juice",
        "hotdog", "meal", "ice", "sandwich", "sausage", "biscuit",
    }:
        return "food"
    if words & {
        "sign", "board", "poster", "photograph", "photo", "picture", "flag",
        "banner", "display", "painting", "graffiti", "notice",
    }:
        return "display"
    if words & {
        "chair", "bench", "table", "desk", "bed", "sofa", "shelf",
        "cupboard", "cabinet", "drawer", "counter", "swing", "stool",
    }:
        return "furniture"
    if words & {
        "drum", "guitar", "accordion", "horn", "trumpet", "instrument",
    }:
        return "instrument"
    if words & {
        "tool", "drill", "hammer", "broom", "hose", "ladder", "camera",
        "tripod", "machine", "turbine", "panel", "wheel", "wheels",
        "track", "tracks", "girder", "girders", "dam",
    }:
        return "tool"
    return "object"


def rule_for_action(
    ctx, action: Action, legacy_morphology: bool = False
) -> dict[str, str]:
    rule = dict(ctx.rule)
    first = action.base.split()[0]
    irregular = {
        "feed": ("feeds", "feeding", "fed", "fed"),
        "keep": ("keeps", "keeping", "kept", "kept"),
    }
    if first in irregular and not legacy_morphology:
        tail = action.base[len(first):]
        third, ing, past, pp = (
            form + tail for form in irregular[first]
        )
    else:
        third = grammar.inflect_first(action.base, "third", False)
        ing = grammar.inflect_first(action.base, "ing", False)
        past = grammar.inflect_first(action.base, "past", False)
        pp = grammar.inflect_first(action.base, "pp", False)
    rule.update({
        "base": action.base,
        "third": third,
        "ing": ing,
        "past": past,
        "pp": pp,
        "resource": action.resource,
        "adverb": action.adverb,
        "reason": action.reason,
    })
    return rule


@contextmanager
def injected_rule(
    obj: dict,
    rule: dict[str, str],
    person_override: bool | None = None,
    animal_override: bool | None = None,
):
    original_rule_for = grammar.rule_for
    original_personalize = grammar.personalize_rule
    original_person = grammar.is_person
    original_animal = grammar.is_animal
    varied_grammar = diverse.grammar
    varied_rule_for = varied_grammar.rule_for
    varied_personalize = varied_grammar.personalize_rule
    varied_person = varied_grammar.is_person
    varied_animal = varied_grammar.is_animal

    def patched_rule_for(candidate: dict) -> dict[str, str]:
        if candidate["id"] == obj["id"]:
            return rule
        return original_rule_for(candidate)

    def patched_personalize(
        candidate: dict, candidate_rule: dict[str, str], plural: bool
    ) -> dict[str, str]:
        if candidate["id"] == obj["id"]:
            return candidate_rule
        return original_personalize(candidate, candidate_rule, plural)

    grammar.rule_for = patched_rule_for
    grammar.personalize_rule = patched_personalize
    if person_override is not None:
        grammar.is_person = lambda candidate: (
            person_override
            if candidate["id"] == obj["id"]
            else original_person(candidate)
        )
        varied_grammar.is_person = lambda candidate: (
            person_override
            if candidate["id"] == obj["id"]
            else varied_person(candidate)
        )
    if animal_override is not None:
        grammar.is_animal = lambda candidate: (
            animal_override
            if candidate["id"] == obj["id"]
            else original_animal(candidate)
        )
        varied_grammar.is_animal = lambda candidate: (
            animal_override
            if candidate["id"] == obj["id"]
            else varied_animal(candidate)
        )
    varied_grammar.rule_for = (
        lambda candidate: rule
        if candidate["id"] == obj["id"]
        else varied_rule_for(candidate)
    )
    varied_grammar.personalize_rule = (
        lambda candidate, candidate_rule, plural: candidate_rule
        if candidate["id"] == obj["id"]
        else varied_personalize(candidate, candidate_rule, plural)
    )
    try:
        yield
    finally:
        grammar.rule_for = original_rule_for
        grammar.personalize_rule = original_personalize
        grammar.is_person = original_person
        grammar.is_animal = original_animal
        varied_grammar.rule_for = varied_rule_for
        varied_grammar.personalize_rule = varied_personalize
        varied_grammar.is_person = varied_person
        varied_grammar.is_animal = varied_animal


def generated_banks(
    obj: dict,
    page_objects: list[dict],
    rule: dict[str, str],
    person_override: bool | None = None,
    animal_override: bool | None = None,
) -> tuple[dict[str, str], dict[str, str]]:
    with injected_rule(obj, rule, person_override, animal_override):
        ordinary = grammar.allowed_fields(
            obj, grammar.sentence_bank(obj, page_objects)
        )
        varied = diverse.diverse_bank(obj)
    return ordinary, varied


def action_root(action: Action) -> str:
    return action.base.split()[0].lower()


def report_agent(ctx) -> str:
    return {
        "vehicle": "A mechanic",
        "structure": "A caretaker",
        "window": "A caretaker",
        "transport_path": "An engineer",
        "shade": "The owner",
        "nest": "A wildlife expert",
        "sail": "An instructor",
        "nature": "A local guide",
        "container": "The owner",
        "food": "A member of staff",
        "display": "A staff member",
        "furniture": "The owner",
        "instrument": "A musician",
        "tool": "A worker",
        "clothing": "The wearer",
        "object": "A local specialist",
    }.get(ctx.kind, "A local specialist")


def specialized_sentence(
    field: str, ctx, action: Action, rule: dict[str, str], default: str
) -> str:
    if field == "reported_told" and not (ctx.person or ctx.animal):
        return (
            f"{report_agent(ctx)} told a colleague that {ctx.obj_phrase} "
            f"had {rule['pp']} earlier."
        )
    if field == "reported_asked" and not (ctx.person or ctx.animal):
        return (
            f"{report_agent(ctx)} asked whether {ctx.obj_phrase} had "
            f"{rule['pp']} before noon."
        )
    if field == "third_conditional_regret" and not (ctx.person or ctx.animal):
        return (
            f"If {ctx.obj_phrase} had been prepared earlier, it would have "
            f"{rule['pp']} more effectively."
        )
    return default


def concentration(values: dict[str, list[str]]) -> dict[str, float]:
    result = {}
    for field, roots in values.items():
        counts = Counter(roots)
        result[field] = counts.most_common(1)[0][1] / len(roots)
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    html = HTML_PATH.read_text(encoding="utf-8")
    match = grammar.INDEX_RE.search(html)
    if not match:
        raise SystemExit("Could not locate embedded spatial index")
    index = json.loads(match.group(1))
    json_index = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    identity = grammar.identity_snapshot(index)
    if identity != grammar.identity_snapshot(json_index):
        raise SystemExit("HTML and JSON identity/box data differ")

    counts = Counter()
    changes: dict[str, dict[str, tuple[str, str]]] = {}
    roots_before: dict[str, list[str]] = defaultdict(list)
    roots_after: dict[str, list[str]] = defaultdict(list)

    for page in PAGES:
        page_objects = index[page]
        for obj in page_objects:
            legacy_ctx = diverse.make_context(obj)
            ctx = corrected_context(obj)
            corrected_classification = (
                ctx.person != legacy_ctx.person or ctx.animal != legacy_ctx.animal
            )
            legacy_ordinary = grammar.allowed_fields(
                obj, grammar.sentence_bank(obj, page_objects)
            )
            legacy_varied = diverse.diverse_bank(obj)
            actions = actions_for(ctx)
            prior_actions = actions_for(
                legacy_ctx, legacy_object_kind(ctx.obj["name"])
            )
            generated = {}
            for action in actions:
                generated[action] = generated_banks(
                    obj,
                    page_objects,
                    rule_for_action(ctx, action),
                    ctx.person if corrected_classification else None,
                    ctx.animal if corrected_classification else None,
                )
            prior_generated = {}
            for action in prior_actions:
                prior_generated[action] = generated_banks(
                    obj,
                    page_objects,
                    rule_for_action(
                        legacy_ctx, action, legacy_morphology=True
                    ),
                )
            transition_actions = (
                actions_for(ctx, "structure")
                if ctx.kind == "window"
                else []
            )
            transition_generated = {}
            for action in transition_actions:
                transition_generated[action] = generated_banks(
                    obj,
                    page_objects,
                    rule_for_action(ctx, action),
                    ctx.person if corrected_classification else None,
                    ctx.animal if corrected_classification else None,
                )

            current = obj["grammar_data"]
            for field in FREE_VERB_FIELDS:
                old_sentence = current.get(field)
                if not old_sentence:
                    continue
                source = None
                if old_sentence == legacy_varied.get(field):
                    source = 1
                elif old_sentence == legacy_ordinary.get(field):
                    source = 0
                prior_selected = grammar.choose(
                    obj["id"] + field + "free-verb", prior_actions
                )
                if source is None:
                    if old_sentence == prior_generated[prior_selected][1].get(field):
                        source = 1
                    elif old_sentence == prior_generated[prior_selected][0].get(field):
                        source = 0
                if source is None and transition_actions:
                    transition_selected = grammar.choose(
                        obj["id"] + field + "free-verb",
                        transition_actions,
                    )
                    if old_sentence == transition_generated[transition_selected][1].get(field):
                        source = 1
                    elif old_sentence == transition_generated[transition_selected][0].get(field):
                        source = 0

                selected = grammar.choose(
                    obj["id"] + field + "free-verb", actions
                )
                if source is None:
                    if old_sentence == generated[selected][1].get(field):
                        source = 1
                    elif old_sentence == generated[selected][0].get(field):
                        source = 0
                if (
                    source is None
                    and re.match(r"^[^ ]+(?:'s|s')\s", obj["name"], re.I)
                ):
                    original_rule = grammar.rule_for(obj)
                    forms = {
                        original_rule["base"], original_rule["third"],
                        original_rule["ing"], original_rule["past"],
                        original_rule["pp"],
                    }
                    if any(form in old_sentence for form in forms):
                        source = (
                            1 if field in diverse.TARGET_FIELDS else 0
                        )
                    elif (
                        field == "third_conditional_regret"
                        and "had prepared earlier" in old_sentence
                    ):
                        source = 0
                if source is None:
                    continue

                selected_rule = rule_for_action(ctx, selected)
                new_sentence = generated[selected][source].get(field)
                if not new_sentence or new_sentence == old_sentence:
                    new_sentence = specialized_sentence(
                        field, ctx, selected, selected_rule, new_sentence or ""
                    )
                    if not new_sentence or new_sentence == old_sentence:
                        continue
                else:
                    new_sentence = specialized_sentence(
                        field, ctx, selected, selected_rule, new_sentence
                    )
                new_sentence = re.sub(r"\s+", " ", new_sentence).strip()
                assert new_sentence[0].isupper()
                assert new_sentence[-1] in ".?!"
                if field in diverse.TARGET_FIELDS:
                    assert diverse.target_present(field, new_sentence), (
                        obj["id"], field, new_sentence
                    )
                current[field] = new_sentence
                counts[field] += 1
                changes.setdefault(obj["id"], {})[field] = (
                    old_sentence, new_sentence
                )
                roots_before[field].append(ctx.rule["base"].split()[0].lower())
                roots_after[field].append(action_root(selected))

            # Correct two known naive past-tense forms wherever earlier
            # deterministic generation left them behind.
            for field, sentence in list(current.items()):
                if field == "subject":
                    continue
                repaired = re.sub(r"\bfeeded\b", "fed", sentence, flags=re.I)
                repaired = re.sub(r"\bkeeped\b", "kept", repaired, flags=re.I)
                repaired = re.sub(
                    r"\b(has|have) to use enough ([^.?!]+?) to ",
                    r"\1 to have enough \2 available to ",
                    repaired,
                    flags=re.I,
                )
                if (
                    obj["name"] == "Children's wardrobe"
                    and field == "reported_told"
                    and sentence.startswith("The baby in the cot told")
                ):
                    repaired = (
                        "The owner told a friend that the children's wardrobe "
                        "had held the little clothes earlier."
                    )
                if (
                    obj["name"] == "Children's wardrobe"
                    and field == "reported_asked"
                    and sentence.startswith("The baby in the cot asked")
                ):
                    repaired = (
                        "The owner asked whether the children's wardrobe had "
                        "held the little clothes before noon."
                    )
                if repaired != sentence:
                    current[field] = repaired

    assert grammar.identity_snapshot(index) == identity
    for page in PAGES:
        json_index[page] = index[page]
    assert grammar.identity_snapshot(json_index) == identity

    for page in PAGES:
        for obj in index[page]:
            for field, sentence in obj["grammar_data"].items():
                if field == "subject":
                    continue
                assert sentence and sentence[0].isupper()
                assert sentence[-1] in ".?!"

    before = concentration(roots_before)
    after = concentration(roots_after)
    print(f"Generated sentences given a different lexical action: {sum(counts.values())}")
    print(f"Objects changed: {len(changes)}")
    print(f"Grammar fields changed: {len(counts)}")
    print("Largest changes by field:")
    for field, count in counts.most_common(20):
        print(
            f"  {field}: {count}; dominant source/action verb "
            f"{before.get(field, 0):.1%} -> {after.get(field, 0):.1%}"
        )

    if not args.apply:
        print("Dry run only. Re-run with --apply to write files.")
        return

    encoded = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    new_html = html[:match.start(1)] + encoded + html[match.end(1):]
    HTML_PATH.write_text(new_html, encoding="utf-8")
    JSON_PATH.write_text(
        json.dumps(json_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {HTML_PATH}")
    print(f"Wrote {JSON_PATH}")


if __name__ == "__main__":
    main()
