#!/usr/bin/env python3
"""Replace recognized generator scaffolds with varied, semantic sentences.

The tool protects bespoke work by rewriting a field only when its current
sentence exactly matches the deterministic output of
``expand_inferred_grammar.py``. A second run is therefore a no-op.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
JSON_PATH = ROOT / "spatial_index.json"
BASE_TOOL = Path(__file__).with_name("expand_inferred_grammar.py")

spec = importlib.util.spec_from_file_location("grammar_expansion", BASE_TOOL)
grammar = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(grammar)

PAGES = grammar.PAGES
TARGET_FIELDS = {
    "causative_get", "causative_have", "comparative_more",
    "frequency_often", "frequency_sometimes", "frequency_usually",
    "gerund_complement", "imperative_negative", "obligation_has_to",
    "obligation_have_to", "passive_simple_was", "passive_simple_were",
    "past_continuous_visual", "past_regular", "perception_see",
    "perception_watch", "possessive_her", "possessive_his",
    "possessive_their", "pronoun_them", "pronoun_they",
    "quantifier_enough", "quantifier_not_enough", "quantifier_too_many",
    "quantifier_too_much", "superlative_est", "superlative_most",
}

PERSON_CLASSIFIER_ADDITIONS = {
    "chef", "drummer", "workman", "plumber", "bricklayer", "surveyor",
    "birdwatcher", "parent", "binman", "roofer", "vendor", "clerk",
}
ANIMAL_CLASSIFIER_ADDITIONS = {
    "dachshund", "dove", "vulture", "roadrunner", "rattlesnake", "crow",
    "mare", "osprey", "raccoon", "boar", "hare", "woodpecker", "hedgehog",
    "marten", "puppy", "labrador", "retriever", "poodle", "beagle",
    "turtle", "duckling", "lizard", "dane", "doves", "vultures", "crows",
    "raccoons", "boars", "hares", "woodpeckers", "hedgehogs", "martens",
    "puppies", "retrievers", "poodles", "beagles", "turtles", "ducklings",
    "lizards",
}

MULTISYLLABIC_ADJECTIVES = {
    "adaptable", "adventurous", "attentive", "considerate", "convenient",
    "cooperative", "dependable", "determined", "distinctive", "durable",
    "economical", "efficient", "energetic", "enthusiastic", "experienced",
    "imaginative", "impressive", "independent", "inquisitive", "methodical",
    "noticeable", "observant", "practical", "professional", "protective",
    "recognizable", "reliable", "resourceful", "responsible", "responsive",
    "sociable", "spectacular", "substantial", "suitable", "valuable",
    "versatile", "purposeful", "popular", "excited", "curious", "colourful",
    "colorful", "traditional", "consulted", "distracted", "organised",
    "organized", "numerous", "expensive", "photographed", "visible",
    "chaotic", "powerful", "dramatic",
}

SPELLING_REPAIRS = {
    "spoting": "spotting", "spoted": "spotted",
    "fiting": "fitting", "fited": "fitted",
    "pating": "patting", "pated": "patted",
    "rubing": "rubbing", "rubed": "rubbed",
    "diging": "digging", "diged": "dug",
    "geting": "getting", "geted": "got",
    "steping": "stepping", "steped": "stepped",
    "skiping": "skipping", "skiped": "skipped",
    "huging": "hugging", "huged": "hugged",
    "grabing": "grabbing", "grabed": "grabbed",
    "draging": "dragging", "draged": "dragged",
    "hiting": "hitting", "hited": "hit", "hitted": "hit",
}


def repair_spelling(sentence: str) -> str:
    for wrong, right in SPELLING_REPAIRS.items():
        sentence = re.sub(rf"\b{wrong}\b", right, sentence, flags=re.I)
    return sentence


def has_multisyllabic_most_adjective(sentence: str) -> bool:
    match = re.search(r"\bmost\s+([a-z]+)", sentence, re.I)
    return bool(
        match and match.group(1).lower() in MULTISYLLABIC_ADJECTIVES
    )


def legacy_generator_bank(obj: dict, page_objects: list[dict]) -> dict[str, str]:
    """Reproduce the classifier state used for the original expansion."""
    current_people = grammar.PERSON_WORDS
    current_animals = grammar.ANIMAL_WORDS
    try:
        grammar.PERSON_WORDS = current_people - PERSON_CLASSIFIER_ADDITIONS
        grammar.ANIMAL_WORDS = current_animals - ANIMAL_CLASSIFIER_ADDITIONS
        return grammar.allowed_fields(
            obj, grammar.sentence_bank(obj, page_objects)
        )
    finally:
        grammar.PERSON_WORDS = current_people
        grammar.ANIMAL_WORDS = current_animals


@dataclass
class Context:
    obj: dict
    subject: str
    obj_phrase: str
    plural: bool
    person: bool
    animal: bool
    kind: str
    pronoun: str
    pronoun_object: str
    owner: str
    be: str
    have: str
    past_be: str
    rule: dict[str, str]
    visible_ing: str
    service_agent: str
    super_adjectives: list[str]
    er_adjectives: list[str]
    count_nouns: list[str]
    mass_nouns: list[str]


def semantic_kind(obj: dict, person: bool, animal: bool) -> str:
    words = grammar.words(obj["name"])
    if person:
        return "person"
    if animal:
        return "animal"
    if words & {
        "train", "car", "truck", "van", "bus", "boat", "bicycle", "bike",
        "scooter", "plane", "helicopter", "engine", "tractor",
    }:
        return "vehicle"
    if words & {
        "house", "building", "station", "shop", "cafe", "hotel", "barn",
        "tower", "garage", "bridge", "roof", "wall", "fence", "door",
        "chimney", "porch", "post", "railing", "balcony",
    }:
        return "structure"
    if words & {
        "tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
        "forest", "spruce", "pine", "cactus", "meadow", "mountain", "peak",
        "hill", "cliff", "rock", "rocks", "valley", "pond", "river",
        "stream", "waterfall", "grass", "sand", "cloud", "molehill",
    }:
        return "nature"
    return "object"


def agree_rule(obj: dict, rule: dict[str, str], plural: bool) -> dict[str, str]:
    gender = grammar.gender(obj)
    if plural:
        return {
            key: re.sub(r"\bits\b", "their", value, flags=re.I)
            for key, value in rule.items()
        }
    if gender not in {"male", "female"}:
        return rule
    subject_pronoun = "he" if gender == "male" else "she"
    object_pronoun = "him" if gender == "male" else "her"
    owner = "his" if gender == "male" else "her"
    result = {}
    for key, value in rule.items():
        value = re.sub(r"\bthey\b", subject_pronoun, value, flags=re.I)
        value = re.sub(r"\bthem\b", object_pronoun, value, flags=re.I)
        value = re.sub(r"\btheir\b", owner, value, flags=re.I)
        result[key] = value
    return result


def semantic_profile(obj: dict, person: bool, animal: bool) -> tuple[
    list[str], list[str], list[str], list[str]
]:
    words = grammar.words(obj["name"])
    if person:
        if words & {
            "worker", "builder", "carpenter", "painter", "plasterer",
            "electrician", "mechanic", "gardener", "nurse", "waiter",
            "driver", "pilot", "photographer", "musician",
        }:
            return (
                ["experienced", "efficient", "dependable", "methodical",
                 "professional", "resourceful", "responsible"],
                ["calmer", "quicker", "safer", "steadier", "stronger"],
                ["interruptions", "delays", "tasks", "requests", "distractions"],
                ["pressure", "noise", "responsibility", "confusion", "fatigue"],
            )
        if words & {"child", "children", "boy", "boys", "girl", "girls", "toddler"}:
            return (
                ["energetic", "enthusiastic", "imaginative", "adventurous",
                 "inquisitive", "adaptable", "observant"],
                ["calmer", "quicker", "friendlier", "braver", "busier"],
                ["distractions", "questions", "games", "instructions", "delays"],
                ["excitement", "noise", "confusion", "pressure", "activity"],
            )
        return (
            ["attentive", "considerate", "dependable", "resourceful",
             "adaptable", "observant", "responsible"],
            ["calmer", "safer", "steadier", "friendlier", "quicker"],
            ["interruptions", "delays", "requests", "tasks", "distractions"],
            ["pressure", "noise", "confusion", "responsibility", "activity"],
        )
    if animal:
        return (
            ["adaptable", "attentive", "energetic", "independent",
             "observant", "responsive", "sociable"],
            ["calmer", "quieter", "quicker", "safer", "gentler", "stronger"],
            ["disturbances", "obstacles", "visitors", "noises", "distractions"],
            ["noise", "heat", "pressure", "activity", "disturbance"],
        )
    if words & {
        "train", "car", "truck", "van", "bus", "boat", "bicycle", "bike",
        "scooter", "plane", "helicopter", "engine", "tractor",
    }:
        return (
            ["economical", "efficient", "practical", "reliable",
             "recognizable", "suitable", "versatile"],
            ["faster", "safer", "quieter", "stronger", "larger"],
            ["passengers", "obstacles", "breakdowns", "delays", "heavy loads"],
            ["traffic", "weight", "damage", "pressure", "heat"],
        )
    if words & {
        "house", "building", "station", "shop", "cafe", "hotel", "barn",
        "tower", "garage", "bridge", "roof", "wall", "fence", "door",
        "chimney", "porch", "post", "railing", "balcony",
    }:
        return (
            ["distinctive", "durable", "impressive", "protective",
             "recognizable", "substantial", "valuable"],
            ["larger", "safer", "stronger", "older", "taller"],
            ["repairs", "alterations", "loads", "weak points",
             "structural changes"],
            ["damage", "weight", "pressure", "moisture", "heat"],
        )
    if words & {
        "tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
        "forest", "spruce", "pine", "cactus", "meadow", "mountain", "peak",
        "hill", "cliff", "rock", "rocks", "valley", "pond", "river",
        "stream", "waterfall", "grass", "sand", "cloud", "molehill",
    }:
        return (
            ["distinctive", "impressive", "noticeable", "recognizable",
             "spectacular", "substantial", "valuable"],
            ["larger", "older", "taller", "greener", "stronger"],
            ["dry days", "storms", "visitors", "obstacles", "changes"],
            ["heat", "rain", "damage", "pressure", "erosion"],
        )
    return (
        ["convenient", "distinctive", "durable", "noticeable", "practical",
         "reliable", "suitable", "valuable", "versatile"],
        ["larger", "safer", "stronger", "lighter", "brighter"],
        ["repairs", "impacts", "obstacles", "changes", "faults"],
        ["damage", "weight", "pressure", "heat", "moisture"],
    )


def service_agent(obj: dict, person: bool, animal: bool) -> str:
    words = grammar.words(obj["name"])
    if person:
        return grammar.choose(
            obj["id"] + "div-agent",
            ["a colleague", "the group leader", "an instructor", "the organizer"],
        )
    if animal:
        return grammar.choose(
            obj["id"] + "div-agent",
            ["a veterinarian", "a ranger", "the keeper", "a wildlife expert"],
        )
    if words & {
        "train", "car", "truck", "van", "bus", "boat", "bike", "bicycle",
        "scooter", "plane", "helicopter", "engine", "tractor",
    }:
        return grammar.choose(
            obj["id"] + "div-agent",
            ["a mechanic", "the maintenance team", "a transport technician"],
        )
    if words & {
        "tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
        "grass", "forest", "spruce", "pine", "cactus",
    }:
        return grammar.choose(
            obj["id"] + "div-agent",
            ["a gardener", "the grounds team", "a local horticulturist"],
        )
    return grammar.choose(
        obj["id"] + "div-agent",
        ["the owner", "a local specialist", "the maintenance team",
         "a careful worker", "the staff"],
    )


def make_context(obj: dict) -> Context:
    plural = grammar.is_plural(obj)
    person = grammar.is_person(obj)
    animal = grammar.is_animal(obj)
    gender = grammar.gender(obj)
    subject = grammar.specific_subject(obj)
    rule = grammar.personalize_rule(obj, grammar.rule_for(obj), plural)
    rule = agree_rule(obj, rule, plural)
    visible_ing = grammar.extract_visible_ing(obj, plural, rule)
    pronoun = (
        "they" if plural else "he" if gender == "male" else
        "she" if gender == "female" else "they" if person else "it"
    )
    pronoun_object = (
        "them" if plural else "him" if gender == "male" else
        "her" if gender == "female" else "them" if person else "it"
    )
    owner = (
        "their" if plural or gender == "unknown"
        else "his" if gender == "male" else "her"
    )
    super_adjectives, er_adjectives, count_nouns, mass_nouns = semantic_profile(
        obj, person, animal
    )
    kind = semantic_kind(obj, person, animal)
    return Context(
        obj=obj,
        subject=subject,
        obj_phrase=grammar.lower_initial(subject),
        plural=plural,
        person=person,
        animal=animal,
        kind=kind,
        pronoun=pronoun,
        pronoun_object=pronoun_object,
        owner=owner,
        be="are" if plural else "is",
        have="have" if plural else "has",
        past_be="were" if plural else "was",
        rule=rule,
        visible_ing=visible_ing,
        service_agent=service_agent(obj, person, animal),
        super_adjectives=super_adjectives,
        er_adjectives=er_adjectives,
        count_nouns=count_nouns,
        mass_nouns=mass_nouns,
    )


def selected(ctx: Context, field: str, values: list[str]) -> str:
    return grammar.choose(ctx.obj["id"] + field + "word", values)


def most_sentence(ctx: Context) -> str:
    adjective = selected(ctx, "most-adjective", ctx.super_adjectives)
    assert adjective in MULTISYLLABIC_ADJECTIVES
    if ctx.kind == "person":
        frames = [
            f"Among the people involved, {ctx.obj_phrase} appears the most {adjective}.",
            f"Past experience suggests that {ctx.obj_phrase} is the most {adjective} person for this task.",
            f"Within the group, {ctx.obj_phrase} seems the most {adjective}.",
            f"Colleagues describe {ctx.obj_phrase} as the most {adjective} member of the team.",
            f"When the day becomes demanding, {ctx.obj_phrase} remains the most {adjective} person available.",
            f"Compared with other participants, {ctx.obj_phrase} is the most {adjective}.",
            f"The group relies on {ctx.obj_phrase} as its most {adjective} member.",
            f"Of everyone taking part, {ctx.obj_phrase} has proved the most {adjective}.",
            f"Those nearby regard {ctx.obj_phrase} as the most {adjective} participant.",
            f"For this part of the activity, {ctx.obj_phrase} may be the most {adjective} person.",
        ]
    elif ctx.kind == "animal":
        frames = [
            f"Among the animals nearby, {ctx.obj_phrase} appears the most {adjective}.",
            f"A wildlife expert describes {ctx.obj_phrase} as the most {adjective} animal in the area.",
            f"Within the group, {ctx.obj_phrase} seems the most {adjective}.",
            f"The keeper regards {ctx.obj_phrase} as the most {adjective} individual.",
            f"When the surroundings become busy, {ctx.obj_phrase} remains the most {adjective} animal.",
            f"Compared with similar animals, {ctx.obj_phrase} is the most {adjective}.",
            f"Local observations suggest that {ctx.obj_phrase} may be the most {adjective}.",
            f"Of the animals in view, {ctx.obj_phrase} has proved the most {adjective}.",
            f"A ranger identifies {ctx.obj_phrase} as the most {adjective} member of the group.",
            f"During a disturbance, {ctx.obj_phrase} can be the most {adjective} animal nearby.",
        ]
    elif ctx.kind == "nature":
        frames = [
            f"Among the natural features nearby, {ctx.obj_phrase} appears the most {adjective}.",
            f"Local guides describe {ctx.obj_phrase} as the most {adjective} feature in the area.",
            f"Within this landscape, {ctx.obj_phrase} seems the most {adjective}.",
            f"Visitors often regard {ctx.obj_phrase} as the most {adjective} natural detail.",
            f"From a distance, {ctx.obj_phrase} remains the most {adjective} feature.",
            f"Compared with similar features elsewhere, {ctx.obj_phrase} is the most {adjective}.",
            f"Local knowledge suggests that {ctx.obj_phrase} may be the most {adjective}.",
            f"Of the natural details in view, {ctx.obj_phrase} looks the most {adjective}.",
            f"Mapmakers identify {ctx.obj_phrase} as the most {adjective} landmark nearby.",
            f"In this part of the landscape, {ctx.obj_phrase} can be the most {adjective} feature.",
        ]
    else:
        frames = [
            f"Among comparable examples, {ctx.obj_phrase} appears the most {adjective}.",
            f"Experience has shown that {ctx.obj_phrase} is the most {adjective} example of its kind.",
            f"For this particular task, {ctx.obj_phrase} seems the most {adjective}.",
            f"People familiar with the item describe {ctx.obj_phrase} as the most {adjective}.",
            f"When conditions become demanding, {ctx.obj_phrase} remains the most {adjective} example.",
            f"Compared with similar examples elsewhere, {ctx.obj_phrase} is the most {adjective}.",
            f"Practical experience suggests that {ctx.obj_phrase} may be the most {adjective}.",
            f"Of the available possibilities, {ctx.obj_phrase} has proved the most {adjective}.",
            f"Those responsible value {ctx.obj_phrase} as the most {adjective} example.",
            f"During a busy day, {ctx.obj_phrase} can be the most {adjective} item available.",
        ]
    return grammar.choose(ctx.obj["id"] + "most-frame", frames)


def est_sentence(ctx: Context) -> str:
    adjective = selected(ctx, "est-adjective", ctx.er_adjectives)
    superlative = {
        "calmer": "calmest", "quicker": "quickest", "safer": "safest",
        "steadier": "steadiest", "stronger": "strongest",
        "friendlier": "friendliest", "braver": "bravest", "busier": "busiest",
        "quieter": "quietest", "gentler": "gentlest", "faster": "fastest",
        "larger": "largest", "older": "oldest", "taller": "tallest",
        "greener": "greenest", "lighter": "lightest", "brighter": "brightest",
    }[adjective]
    if ctx.kind == "person":
        frames = [
            f"Within the group, {ctx.obj_phrase} is considered the {superlative}.",
            f"Of the people nearby, {ctx.obj_phrase} looks the {superlative}.",
            f"On a demanding day, {ctx.obj_phrase} may prove the {superlative} participant.",
            f"Colleagues call {ctx.obj_phrase} the {superlative} member of the team.",
            f"Among the people involved, {ctx.obj_phrase} remains the {superlative}.",
            f"For this particular task, {ctx.obj_phrase} seems the {superlative} person.",
        ]
    elif ctx.kind == "animal":
        frames = [
            f"Within the group, {ctx.obj_phrase} is considered the {superlative} animal.",
            f"Of the animals nearby, {ctx.obj_phrase} looks the {superlative}.",
            f"During a disturbance, {ctx.obj_phrase} may prove the {superlative}.",
            f"A local keeper calls {ctx.obj_phrase} the {superlative} animal in the group.",
            f"Among similar animals, {ctx.obj_phrase} remains the {superlative}.",
            f"In these surroundings, {ctx.obj_phrase} seems the {superlative} animal.",
        ]
    elif ctx.kind == "nature":
        frames = [
            f"Within the landscape, {ctx.obj_phrase} is considered the {superlative}.",
            f"Of the natural features nearby, {ctx.obj_phrase} looks the {superlative}.",
            f"After many seasons, {ctx.obj_phrase} may prove the {superlative} feature.",
            f"Local guides call {ctx.obj_phrase} the {superlative} landmark in the area.",
            f"Among similar natural features, {ctx.obj_phrase} remains the {superlative}.",
            f"From this viewpoint, {ctx.obj_phrase} seems the {superlative} feature.",
        ]
    else:
        frames = [
            f"Within its category, {ctx.obj_phrase} is considered the {superlative}.",
            f"Of the comparable examples nearby, {ctx.obj_phrase} looks the {superlative}.",
            f"On a demanding day, {ctx.obj_phrase} may prove the {superlative}.",
            f"People with practical experience call {ctx.obj_phrase} the {superlative}.",
            f"Among similar examples, {ctx.obj_phrase} remains the {superlative}.",
            f"For this particular purpose, {ctx.obj_phrase} seems the {superlative}.",
        ]
    return grammar.choose(ctx.obj["id"] + "est-frame", frames)


def more_sentence(ctx: Context) -> str:
    adjective = selected(ctx, "more-adjective", ctx.super_adjectives)
    if ctx.kind == "person":
        frames = [
            f"{ctx.subject} seems more {adjective} than another participant.",
            f"With more experience, {ctx.obj_phrase} can be more {adjective} than a new team member.",
            f"Colleagues find {ctx.obj_phrase} more {adjective} than someone new to the task.",
            f"For this activity, {ctx.obj_phrase} is more {adjective} than the average participant.",
            f"Past experience makes {ctx.obj_phrase} appear more {adjective} than a newcomer.",
            f"Under similar conditions, {ctx.obj_phrase} may prove more {adjective} than expected.",
        ]
    elif ctx.kind == "animal":
        frames = [
            f"{ctx.subject} seems more {adjective} than another animal nearby.",
            f"In familiar surroundings, {ctx.obj_phrase} can be more {adjective} than a younger animal.",
            f"A keeper finds {ctx.obj_phrase} more {adjective} than others of the same kind.",
            f"Within this group, {ctx.obj_phrase} is more {adjective} than the average animal.",
            f"Careful observation makes {ctx.obj_phrase} appear more {adjective} than expected.",
            f"Under similar conditions, {ctx.obj_phrase} may prove more {adjective} than another animal.",
        ]
    elif ctx.kind == "nature":
        frames = [
            f"{ctx.subject} seems more {adjective} than a similar natural feature elsewhere.",
            f"From this viewpoint, {ctx.obj_phrase} can be more {adjective} than a distant feature.",
            f"Visitors find {ctx.obj_phrase} more {adjective} than another part of the landscape.",
            f"In this area, {ctx.obj_phrase} is more {adjective} than the average natural feature.",
            f"The light makes {ctx.obj_phrase} appear more {adjective} than a nearby feature.",
            f"Under similar conditions, {ctx.obj_phrase} may look more {adjective} than expected.",
        ]
    else:
        frames = [
            f"{ctx.subject} seems more {adjective} than a comparable example elsewhere.",
            f"With proper care, {ctx.obj_phrase} can be more {adjective} than an older example.",
            f"People find {ctx.obj_phrase} more {adjective} than a poorly prepared alternative.",
            f"For this task, {ctx.obj_phrase} is more {adjective} than the usual alternative.",
            f"Experience makes {ctx.obj_phrase} appear more {adjective} than a newer example.",
            f"Under similar conditions, {ctx.obj_phrase} may prove more {adjective} than expected.",
        ]
    return grammar.choose(ctx.obj["id"] + "more-frame", frames)


def quantifier_sentences(ctx: Context) -> dict[str, str]:
    count_noun = selected(ctx, "count-noun", ctx.count_nouns)
    mass_noun = selected(ctx, "mass-noun", ctx.mass_nouns)
    resource = ctx.rule["resource"]
    too_many = grammar.choose(ctx.obj["id"] + "too-many-frame", [
        f"Too many {count_noun} could prevent {ctx.obj_phrase} from {ctx.rule['ing']}.",
        f"{ctx.subject} might struggle to {ctx.rule['base']} if there were too many {count_noun}.",
        f"With too many {count_noun} at once, {ctx.obj_phrase} could lose the chance to {ctx.rule['base']}.",
        f"There would be too many {count_noun} for {ctx.obj_phrase} to {ctx.rule['base']} safely.",
        f"If there were too many {count_noun}, {ctx.obj_phrase} would need extra help to {ctx.rule['base']}.",
        f"Too many {count_noun} would make {ctx.rule['ing']} harder for {ctx.obj_phrase}.",
    ])
    too_much = grammar.choose(ctx.obj["id"] + "too-much-frame", [
        f"Too much {mass_noun} could stop {ctx.obj_phrase} from {ctx.rule['ing']}.",
        f"Exposure to too much {mass_noun} might prevent {ctx.obj_phrase} from {ctx.rule['ing']}.",
        f"With too much {mass_noun}, {ctx.obj_phrase} would find it harder to {ctx.rule['base']}.",
        f"There could be too much {mass_noun} for {ctx.obj_phrase} to {ctx.rule['base']}.",
        f"If too much {mass_noun} built up, {ctx.obj_phrase} would need assistance.",
        f"Too much {mass_noun} would interfere with {ctx.rule['ing']}.",
    ])
    enough = grammar.choose(ctx.obj["id"] + "enough-frame", [
        f"{ctx.subject} {ctx.have} enough {resource} to {ctx.rule['base']}.",
        f"Enough {resource} allows {ctx.obj_phrase} to {ctx.rule['base']}.",
        f"With enough {resource}, {ctx.obj_phrase} can continue {ctx.rule['ing']}.",
        f"There is enough {resource} available for {ctx.obj_phrase} to {ctx.rule['base']}.",
        f"{ctx.subject} can {ctx.rule['base']} because enough {resource} is available.",
        f"Having enough {resource} makes {ctx.rule['ing']} possible for {ctx.obj_phrase}.",
    ])
    not_enough = grammar.choose(ctx.obj["id"] + "not-enough-frame", [
        f"Without enough {resource}, {ctx.obj_phrase} might not {ctx.rule['base']}.",
        f"{ctx.subject} would struggle to {ctx.rule['base']} if there were not enough {resource}.",
        f"There might not be enough {resource} for {ctx.obj_phrase} to {ctx.rule['base']} safely.",
        f"If {resource} were limited, {ctx.obj_phrase} might not have enough {resource} to {ctx.rule['base']}.",
        f"{ctx.subject} cannot keep {ctx.rule['ing']} when there is not enough {resource}.",
        f"Not enough {resource} would make it difficult for {ctx.obj_phrase} to {ctx.rule['base']}.",
    ])
    return {
        "quantifier_too_many": too_many,
        "quantifier_too_much": too_much,
        "quantifier_enough": enough,
        "quantifier_not_enough": not_enough,
    }


def perception_sentences(ctx: Context) -> dict[str, str]:
    detail_frame = grammar.choose(ctx.obj["id"] + "see-detail-frame", [
        f"The details in the picture make it easy to see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"In this part of the picture, it is easy to see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"Looking closer, we can see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"The scene offers a clear chance to see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"Here, the action is clear enough to see {ctx.obj_phrase} {ctx.visible_ing}.",
    ])
    see = grammar.choose(ctx.obj["id"] + "see-frame", [
        f"Look closely and you can see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"From a clear viewpoint, a visitor can see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"The picture lets us see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"Anyone studying the scene can see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"Near the centre of this detail, we can see {ctx.obj_phrase} {ctx.visible_ing}.",
        detail_frame,
        f"Even at a glance, people can see {ctx.obj_phrase} {ctx.visible_ing}.",
        f"From nearby, you can see {ctx.obj_phrase} {ctx.visible_ing}.",
    ])
    watch = grammar.choose(ctx.obj["id"] + "watch-frame", [
        f"A visitor could watch {ctx.obj_phrase} {ctx.visible_ing} for several minutes.",
        f"From nearby, people can watch {ctx.obj_phrase} {ctx.visible_ing}.",
        f"Someone interested in the scene might watch {ctx.obj_phrase} {ctx.visible_ing}.",
        f"The people nearby can watch {ctx.obj_phrase} {ctx.visible_ing}.",
        f"With a clear view, you could watch {ctx.obj_phrase} {ctx.visible_ing}.",
        f"A patient viewer may watch {ctx.obj_phrase} {ctx.visible_ing} for a while.",
    ])
    return {"perception_see": see, "perception_watch": watch}


def possessive_and_pronoun_sentences(ctx: Context) -> dict[str, str]:
    result: dict[str, str] = {}
    if ctx.plural:
        result["pronoun_they"] = grammar.choose(ctx.obj["id"] + "they-frame", [
            f"They seem ready to {ctx.rule['base']}.",
            f"They can continue {ctx.rule['ing']} when needed.",
            f"They remain {ctx.rule['desc']} throughout the scene.",
            f"They often have enough {ctx.rule['resource']} to {ctx.rule['base']}.",
            f"They appear capable of {ctx.rule['ing']}.",
        ])
        if ctx.person:
            result["pronoun_them"] = grammar.choose(ctx.obj["id"] + "them-frame", [
                f"{ctx.service_agent.capitalize()} asked them to {ctx.rule['base']}.",
                f"A colleague reminded them to keep {ctx.rule['ing']}.",
                f"The group leader gave them enough time to {ctx.rule['base']}.",
                f"People nearby helped them {ctx.rule['base']}.",
            ])
        elif ctx.animal:
            result["pronoun_them"] = grammar.choose(ctx.obj["id"] + "them-frame", [
                f"A ranger watched them {ctx.rule['base']}.",
                f"The keeper gave them space to {ctx.rule['base']}.",
                f"A wildlife expert observed them {ctx.rule['ing']}.",
                f"People nearby avoided disturbing them.",
            ])
        else:
            result["pronoun_them"] = grammar.choose(ctx.obj["id"] + "them-frame", [
                "The owner checked them before the busy day began.",
                "A specialist inspected them during the previous week.",
                "The staff prepared them for regular use.",
                "A careful worker kept them in good condition.",
            ])
        result["possessive_their"] = grammar.choose(ctx.obj["id"] + "their-frame", [
            f"Their {ctx.rule['part']} help them {ctx.rule['base']}.",
            f"Their condition makes {ctx.rule['ing']} possible.",
            f"Their main features provide enough support to {ctx.rule['base']}.",
            f"Their preparation allows them to continue {ctx.rule['ing']}.",
        ])
    gender = grammar.gender(ctx.obj)
    if gender in {"male", "female"}:
        owner = "His" if gender == "male" else "Her"
        obj_pronoun = "him" if gender == "male" else "her"
        field = "possessive_his" if gender == "male" else "possessive_her"
        noun = selected(ctx, field + "noun", [
            "experience", "preparation", "patience", "training", "equipment",
        ])
        result[field] = grammar.choose(ctx.obj["id"] + field + "frame", [
            f"{owner} {noun} helps {obj_pronoun} {ctx.rule['base']}.",
            f"{owner} {noun} gives {obj_pronoun} confidence to {ctx.rule['base']}.",
            f"{owner} {noun} makes {ctx.rule['ing']} easier for {obj_pronoun}.",
            f"{owner} {noun} allows {obj_pronoun} to keep {ctx.rule['ing']}.",
            f"{owner} {noun} is useful whenever {obj_pronoun} must {ctx.rule['base']}.",
        ])
    return result


def causative_sentences(ctx: Context) -> dict[str, str]:
    if ctx.kind == "person":
        service = selected(
            ctx, "person-causative-service",
            ["briefed", "trained", "prepared", "informed"],
        )
        have_agents = ["The organizer", "A supervisor", "The group leader",
                       "An instructor"]
        get_agents = ["The organizer", "A supervisor", "The group leader",
                      "An instructor"]
        time_phrases = ["before the activity", "before the group sets out",
                        "when the plan changes", "before a demanding task"]
    elif ctx.kind == "animal":
        service = selected(
            ctx, "animal-causative-service",
            ["examined", "checked", "treated", "vaccinated"],
        )
        have_agents = ["The keeper", "A ranger", "The owner",
                       "A wildlife specialist"]
        get_agents = ["The keeper", "A ranger", "The owner",
                      "A wildlife specialist"]
        time_phrases = ["before a long journey", "during a routine visit",
                        "when its behaviour changes", "before the busy season"]
    else:
        service = (
            ctx.rule["service"] if ctx.rule["service"].endswith("ed") else "checked"
        )
        have_agents = ["The owner", "The staff", "A local team",
                       "Those responsible"]
        get_agents = ["The owner", "A supervisor", "The person responsible",
                      "A manager"]
        time_phrases = ["before regular use", "whenever necessary",
                        "after a demanding day", "at regular intervals"]
    have_agent = selected(ctx, "have-agent", have_agents)
    get_agent = selected(ctx, "get-agent", get_agents)
    time_phrase = selected(ctx, "cause-time", time_phrases)
    have_sentence = grammar.choose(ctx.obj["id"] + "have-cause-frame", [
        f"{have_agent} has {ctx.obj_phrase} {service} {time_phrase}.",
        f"Before an important event, the staff have {ctx.obj_phrase} {service}.",
        f"Those responsible have {ctx.obj_phrase} carefully {service}.",
        f"A local team has {ctx.obj_phrase} {service} whenever necessary.",
        f"To prevent problems, {grammar.lower_initial(have_agent)} has {ctx.obj_phrase} {service}.",
        f"After reviewing the situation, the staff have {ctx.obj_phrase} {service}.",
    ])
    get_sentence = grammar.choose(ctx.obj["id"] + "get-cause-frame", [
        f"{get_agent} gets {ctx.obj_phrase} {service} {time_phrase}.",
        f"A supervisor gets {ctx.obj_phrase} {service} whenever a problem appears.",
        f"The person responsible gets {ctx.obj_phrase} professionally {service}.",
        f"At planned intervals, {grammar.lower_initial(get_agent)} gets {ctx.obj_phrase} carefully {service}.",
        f"To maintain good preparation, a manager gets {ctx.obj_phrase} {service}.",
        f"After reviewing the situation, {grammar.lower_initial(get_agent)} gets {ctx.obj_phrase} {service}.",
    ])
    return {"causative_have": have_sentence, "causative_get": get_sentence}


def routine_sentences(ctx: Context) -> dict[str, str]:
    third = ctx.rule["base"] if ctx.plural else ctx.rule["third"]
    past_service = (
        ctx.rule["service"] if ctx.rule["service"].endswith("ed") else "checked"
    )
    usually = grammar.choose(ctx.obj["id"] + "usually-diverse", [
        f"{ctx.subject} usually {third} when conditions are suitable.",
        f"On an ordinary day, {ctx.obj_phrase} usually {third}.",
        f"Without much assistance, {ctx.obj_phrase} usually {third}.",
        f"Whenever enough {ctx.rule['resource']} is available, {ctx.obj_phrase} usually {third}.",
        f"{ctx.subject} usually {third} before the busiest part of the day.",
        f"In familiar conditions, {ctx.obj_phrase} usually {third}.",
    ])
    often = grammar.choose(ctx.obj["id"] + "often-diverse", [
        f"{ctx.subject} often {third} when the area becomes busy.",
        f"During regular use, {ctx.obj_phrase} often {third}.",
        f"People nearby often notice {ctx.obj_phrase} {ctx.rule['ing']}.",
        f"With enough {ctx.rule['resource']}, {ctx.obj_phrase} often {third}.",
        f"{ctx.subject} often {third} for longer than expected.",
        f"At this time of day, {ctx.obj_phrase} often {third}.",
    ])
    sometimes = grammar.choose(ctx.obj["id"] + "sometimes-diverse", [
        f"{ctx.subject} sometimes {third} when conditions change.",
        f"On especially busy days, {ctx.obj_phrase} sometimes {third}.",
        f"Without warning, {ctx.obj_phrase} sometimes {third}.",
        f"{ctx.subject} sometimes {third} for only a short time.",
        f"When extra {ctx.rule['resource']} is available, {ctx.obj_phrase} sometimes {third}.",
        f"Even in a quiet setting, {ctx.obj_phrase} sometimes {third}.",
    ])
    obligation_field = "obligation_have_to" if ctx.plural else "obligation_has_to"
    obligation = grammar.choose(ctx.obj["id"] + "obligation-diverse", [
        f"{ctx.subject} {ctx.have} to {ctx.rule['base']} before the day ends.",
        f"To remain useful, {ctx.obj_phrase} {ctx.have} to keep {ctx.rule['ing']}.",
        f"Whenever conditions change, {ctx.obj_phrase} {ctx.have} to {ctx.rule['base']}.",
        f"{ctx.subject} {ctx.have} to use enough {ctx.rule['resource']} to {ctx.rule['base']}.",
        f"During the busiest period, {ctx.obj_phrase} {ctx.have} to {ctx.rule['base']} safely.",
        f"Before anyone can rely on {ctx.pronoun_object}, {ctx.obj_phrase} {ctx.have} to {ctx.rule['base']}.",
    ])
    past_regular = grammar.choose(ctx.obj["id"] + "past-regular-diverse", [
        f"Earlier that morning, {ctx.service_agent} {past_service} {ctx.obj_phrase}.",
        f"Before the area became busy, {ctx.service_agent} {past_service} {ctx.obj_phrase}.",
        f"During a routine visit, {ctx.service_agent} {past_service} {ctx.obj_phrase}.",
        f"Last week, {ctx.service_agent} carefully {past_service} {ctx.obj_phrase}.",
        f"After a brief inspection, {ctx.service_agent} {past_service} {ctx.obj_phrase}.",
        f"{ctx.service_agent.capitalize()} {past_service} {ctx.obj_phrase} before regular use.",
    ])
    passive_field = "passive_simple_were" if ctx.plural else "passive_simple_was"
    passive = grammar.choose(ctx.obj["id"] + "passive-past-diverse", [
        f"{ctx.subject} {ctx.past_be} {past_service} before the busiest part of the day.",
        f"During the previous week, {ctx.obj_phrase} {ctx.past_be} carefully {past_service}.",
        f"After regular use, {ctx.obj_phrase} {ctx.past_be} {past_service} by {ctx.service_agent}.",
        f"{ctx.subject} {ctx.past_be} professionally {past_service} last month.",
        f"Before conditions changed, {ctx.obj_phrase} {ctx.past_be} {past_service}.",
        f"At the start of the season, {ctx.obj_phrase} {ctx.past_be} thoroughly {past_service}.",
    ])
    visual = grammar.choose(ctx.obj["id"] + "past-visual-diverse", [
        f"At that moment, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"Earlier in the day, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"For several minutes, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"While people passed nearby, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"Just before this moment, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"As the scene grew busier, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"During the activity, {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
        f"From a nearby viewpoint, it looked as though {ctx.obj_phrase} {ctx.past_be} {ctx.visible_ing}.",
    ])
    imperative = grammar.choose(ctx.obj["id"] + "negative-diverse", [
        f"Do not interrupt {ctx.obj_phrase} while {ctx.pronoun} {ctx.be} {ctx.visible_ing}!",
        f"Do not damage {grammar.lower_initial(grammar.possessive(ctx.subject))} {ctx.rule['part']}!",
        f"Do not prevent {ctx.obj_phrase} from {ctx.rule['ing']}!",
        f"Do not disturb {ctx.obj_phrase} during {ctx.rule['ing']}!",
        f"Do not remove the {ctx.rule['resource']} needed for {ctx.obj_phrase} to {ctx.rule['base']}!",
        f"Do not handle {ctx.obj_phrase} carelessly while {ctx.pronoun} {ctx.be} {ctx.visible_ing}!",
    ])
    if ctx.person or ctx.animal:
        gerund = grammar.choose(ctx.obj["id"] + "gerund-diverse", [
            f"{ctx.subject} enjoys {ctx.rule['ing']} when conditions are calm.",
            f"{ctx.subject} likes {ctx.rule['ing']} whenever enough time is available.",
            f"{ctx.subject} keeps {ctx.rule['ing']} as the scene becomes busier.",
            f"{ctx.subject} practises {ctx.rule['ing']} whenever possible.",
            f"{ctx.subject} avoids stopping while {ctx.pronoun} {ctx.be} {ctx.rule['ing']}.",
            f"{ctx.subject} appreciates having time for {ctx.rule['ing']}.",
        ])
    elif ctx.kind == "nature":
        gerund = grammar.choose(ctx.obj["id"] + "gerund-diverse", [
            f"Visitors enjoy seeing {ctx.obj_phrase} {ctx.rule['ing']}.",
            f"Local people appreciate having {ctx.obj_phrase} as part of the landscape.",
            f"Watching {ctx.obj_phrase} involves noticing how it is {ctx.rule['ing']}.",
            f"Photographers like observing {ctx.obj_phrase} in changing light.",
            f"Studying {ctx.obj_phrase} means paying attention to its natural features.",
            f"Mapmakers value having {ctx.obj_phrase} available for identifying the area.",
        ])
    else:
        gerund = grammar.choose(ctx.obj["id"] + "gerund-diverse", [
            f"People appreciate seeing {ctx.obj_phrase} {ctx.rule['ing']}.",
            f"Visitors enjoy watching {ctx.obj_phrase} {ctx.rule['ing']}.",
            f"Using {ctx.obj_phrase} involves relying on it for {ctx.rule['ing']}.",
            f"Workers avoid interrupting {ctx.obj_phrase} while {ctx.pronoun} {ctx.be} {ctx.rule['ing']}.",
            f"People value having {ctx.obj_phrase} available when it needs to {ctx.rule['base']}.",
            f"Maintaining {ctx.obj_phrase} includes checking it while {ctx.pronoun} {ctx.be} {ctx.rule['ing']}.",
        ])
    return {
        "frequency_usually": usually,
        "frequency_often": often,
        "frequency_sometimes": sometimes,
        obligation_field: obligation,
        "past_regular": past_regular,
        passive_field: passive,
        "past_continuous_visual": visual,
        "imperative_negative": imperative,
        "gerund_complement": gerund,
    }


def diverse_bank(obj: dict) -> dict[str, str]:
    ctx = make_context(obj)
    bank = {
        "superlative_most": most_sentence(ctx),
        "superlative_est": est_sentence(ctx),
        "comparative_more": more_sentence(ctx),
    }
    bank.update(quantifier_sentences(ctx))
    bank.update(perception_sentences(ctx))
    bank.update(possessive_and_pronoun_sentences(ctx))
    bank.update(causative_sentences(ctx))
    bank.update(routine_sentences(ctx))
    return bank


def target_present(field: str, sentence: str) -> bool:
    checks = {
        "superlative_most": r"\bmost\s+[a-z]+\b",
        "superlative_est": r"\b(?:calmest|quickest|safest|steadiest|strongest|friendliest|bravest|busiest|quietest|gentlest|fastest|largest|oldest|tallest|greenest|lightest|brightest)\b",
        "comparative_more": r"\bmore\s+[a-z]+\s+than\b",
        "quantifier_too_many": r"\btoo many\s+[a-z]+\b",
        "quantifier_too_much": r"\btoo much\s+[a-z]+\b",
        "quantifier_enough": r"\benough\b",
        "quantifier_not_enough": r"\bnot enough\b|\bwithout enough\b|\bnot (?:have|be) enough\b",
        "perception_see": r"\bsee\b.+\b[a-z]+ing\b",
        "perception_watch": r"\bwatch\b.+\b[a-z]+ing\b",
        "pronoun_they": r"^They\b",
        "pronoun_them": r"\bthem\b",
        "possessive_his": r"^His\b",
        "possessive_her": r"^Her\b",
        "possessive_their": r"^Their\b",
        "causative_have": r"\b(?:has|have)\b.+\b[a-z]+ed\b",
        "causative_get": r"\bgets\b.+\b[a-z]+ed\b",
        "frequency_usually": r"\busually\b",
        "frequency_often": r"\boften\b",
        "frequency_sometimes": r"\bsometimes\b",
        "obligation_has_to": r"\bhas to\b",
        "obligation_have_to": r"\bhave to\b",
        "past_regular": r"\b[a-z]+ed\b",
        "passive_simple_was": r"\bwas\b.+\b[a-z]+ed\b",
        "passive_simple_were": r"\bwere\b.+\b[a-z]+ed\b",
        "past_continuous_visual": r"\b(?:was|were)\b.+\b[a-z]+ing\b",
        "imperative_negative": r"^Do not\b",
        "gerund_complement": r"(?:\b(?:enjoys?|likes?|keeps?|practises?|avoids?|appreciates?|involves?|includes?|values?|means?)\b.+\b[a-z]+ing\b|^[a-z]+ing\b)",
    }
    return bool(re.search(checks[field], sentence, re.I))


def prefix_concentration(index: dict, fields: set[str]) -> dict[str, float]:
    values: dict[str, list[str]] = defaultdict(list)
    for page in PAGES:
        for obj in index[page]:
            for field in fields:
                sentence = obj["grammar_data"].get(field)
                if sentence:
                    values[field].append(sentence)
    result = {}
    for field, sentences in values.items():
        prefixes = Counter(
            " ".join(re.findall(r"[a-z']+", sentence.lower())[:4])
            for sentence in sentences
        )
        result[field] = prefixes.most_common(1)[0][1] / len(sentences)
    return result


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
    identity = grammar.identity_snapshot(index)
    if identity != grammar.identity_snapshot(json_index):
        raise SystemExit("HTML and JSON identity/box data differ")

    before_concentration = prefix_concentration(index, TARGET_FIELDS)
    changed: dict[str, dict[str, tuple[str, str]]] = {}
    counts = Counter()
    adjectives = Counter()
    spelling_repairs = 0
    for page in PAGES:
        for obj in index[page]:
            current = obj["grammar_data"]
            old_bank = legacy_generator_bank(obj, index[page])
            new_bank = diverse_bank(obj)
            for field in TARGET_FIELDS:
                old_sentence = current.get(field)
                new_sentence = new_bank.get(field)
                if not old_sentence or not new_sentence or old_sentence == new_sentence:
                    continue
                recognized = (
                    old_sentence == old_bank.get(field)
                    or repair_spelling(old_sentence) == old_bank.get(field)
                    or field == "perception_see"
                    and bool(re.match(
                        r"^(?:I can see|A careful observer can see|"
                        r"The details in the picture make it easy to see)\b",
                        old_sentence,
                        re.I,
                    ))
                    or field == "perception_watch"
                    and bool(re.match(r"^I can watch\b", old_sentence, re.I))
                    or field == "superlative_most"
                    and not has_multisyllabic_most_adjective(old_sentence)
                )
                if not recognized:
                    continue
                new_sentence = re.sub(r"\s+", " ", new_sentence).strip()
                assert target_present(field, new_sentence), (
                    obj["id"], field, new_sentence
                )
                current[field] = new_sentence
                changed.setdefault(obj["id"], {})[field] = (
                    old_sentence, new_sentence
                )
                counts[field] += 1
                if field == "superlative_most":
                    match = re.search(r"\bmost\s+([a-z]+)", new_sentence, re.I)
                    assert match and match.group(1).lower() in MULTISYLLABIC_ADJECTIVES
                    adjectives[match.group(1).lower()] += 1
            for field, sentence in list(current.items()):
                repaired = repair_spelling(sentence)
                if repaired != sentence:
                    current[field] = repaired
                    spelling_repairs += 1

    assert grammar.identity_snapshot(index) == identity
    for page in PAGES:
        json_index[page] = index[page]
    assert grammar.identity_snapshot(json_index) == identity

    for page in PAGES:
        for obj in index[page]:
            for field, sentence in obj["grammar_data"].items():
                if field == "subject":
                    continue
                assert sentence[0].isupper() and sentence[-1] in ".?!"

    after_concentration = prefix_concentration(index, TARGET_FIELDS)
    print(f"Recognized generated sentences diversified: {sum(counts.values())}")
    print(f"Inflection spelling repairs: {spelling_repairs}")
    print("Changes by field:")
    for field, count in counts.most_common():
        print(f"  {field}: {count}")
    print(f"Distinct multi-syllable 'most' adjectives: {len(adjectives)}")
    print("Most-used 'most' adjectives: " + ", ".join(
        f"{word}={count}" for word, count in adjectives.most_common(12)
    ))
    print("Largest top-four-word concentrations:")
    for field in sorted(
        TARGET_FIELDS, key=lambda item: after_concentration.get(item, 0),
        reverse=True,
    )[:12]:
        print(
            f"  {field}: {before_concentration.get(field, 0):.1%} -> "
            f"{after_concentration.get(field, 0):.1%}"
        )

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
