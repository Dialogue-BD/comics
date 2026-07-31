#!/usr/bin/env python3
"""Expand selective Busy Pictures grammar with plausible inferred backstory.

The script preserves every valid existing sentence, ID, name, and bounding
box. It removes only fields that violate number/person locks, fills missing
grammar fields, writes both copies of the spatial index, and checks the main
structural invariants before replacing either file.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
JSON_PATH = ROOT / "spatial_index.json"
PAGES = [f"wimmelbook_{n}" for n in range(1, 11)]

PROMPTS_RE = re.compile(
    r"var prompts = (\[.*?\]);\n\s*var spatialIndex", re.DOTALL
)
INDEX_RE = re.compile(
    r"var spatialIndex = (\{.*?\});\n\s*// State", re.DOTALL
)

SINGULAR_PLURAL_PAIRS = [
    ("to_be_is", "to_be_are"),
    ("progressive_is", "progressive_are"),
    ("there_is", "there_are"),
    ("demonstrative_this", "demonstrative_these"),
    ("demonstrative_that", "demonstrative_those"),
    ("passive_simple_is", "passive_simple_are"),
    ("passive_simple_was", "passive_simple_were"),
    ("passive_continuous_is", "passive_continuous_are"),
    ("past_continuous_was", "past_continuous_were"),
    ("future_going_is", "future_going_are"),
    ("present_perfect_has", "present_perfect_have"),
    ("perfect_continuous_has", "perfect_continuous_have"),
    ("obligation_has_to", "obligation_have_to"),
]
PAIR_COUNTERPART = {
    field: counterpart
    for singular, plural in SINGULAR_PLURAL_PAIRS
    for field, counterpart in ((singular, plural), (plural, singular))
}

PERSON_WORDS = {
    "man", "men", "woman", "women", "boy", "boys", "girl", "girls",
    "child", "children", "toddler", "people", "person", "couple", "family",
    "worker", "builder", "driver", "rider", "cyclist", "climber", "pilot",
    "waiter", "nurse", "photographer", "cameraman", "musician", "guitarist",
    "cowboy", "rancher", "farmer", "shopper", "assistant", "policeman",
    "policewoman", "officer", "grandmother", "grandfather", "husband", "wife",
    "mother", "father", "lady", "passenger", "tourist", "skier", "snowboarder",
    "parachutist", "swimmer", "sailor", "painter", "plasterer", "carpenter",
    "electrician", "mechanic", "gardener", "beekeeper", "doctor", "patient",
    "chef", "drummer", "workman", "plumber", "bricklayer", "surveyor",
    "birdwatcher", "parent", "binman", "roofer", "vendor", "clerk",
}
MALE_WORDS = {
    "man", "boy", "father", "grandfather", "husband", "cowboy", "policeman",
}
FEMALE_WORDS = {
    "woman", "girl", "mother", "grandmother", "wife", "lady", "policewoman",
}
ANIMAL_WORDS = {
    "dog", "cat", "horse", "pony", "foal", "cow", "bull", "calf", "sheep",
    "lamb", "goat", "pig", "piglet", "bird", "pigeon", "seagull", "eagle",
    "hawk", "owl", "duck", "goose",
    "swan", "chicken", "rooster", "pelican", "heron", "stork", "turkey",
    "squirrel", "beaver", "deer", "doe", "fox", "rabbit", "mouse", "rat",
    "bison", "buffalo", "chamois", "ibex", "lion", "bobcat", "coyote",
    "badger", "marten", "butterfly", "butterflies", "frog", "fish", "bat",
    "snake", "crocodile", "donkey", "mule", "camel", "llama", "swallow",
    "elk", "moose", "bear", "bee", "chick", "hen",
    "dachshund", "dove", "vulture", "roadrunner", "rattlesnake", "crow",
    "mare", "osprey", "raccoon", "boar", "hare", "woodpecker", "hedgehog",
    "marten", "puppy", "labrador", "retriever", "poodle", "beagle",
    "turtle", "duckling", "lizard", "dane",
    "swallows", "dogs", "cats", "horses", "ponies", "cows", "bulls",
    "birds", "pigeons", "ducks", "geese", "chickens", "prairie", "antelope",
    "pronghorn", "buffalo", "bison", "coyotes", "rabbits", "piglets", "foals",
    "lambs", "seagulls", "bears", "bees", "chicks", "hens",
    "doves", "vultures", "crows", "raccoons", "boars", "hares",
    "woodpeckers", "hedgehogs", "martens", "puppies", "retrievers",
    "poodles", "beagles", "turtles", "ducklings", "lizards",
}


def words(text: str) -> set[str]:
    return set(re.findall(r"[a-z]+", text.lower()))


def choose(seed: str, options: list[str]) -> str:
    digest = hashlib.sha256(seed.encode("utf-8")).digest()
    return options[int.from_bytes(digest[:4], "big") % len(options)]


def possessive(noun_phrase: str) -> str:
    if noun_phrase.lower().endswith("s"):
        return noun_phrase + "'"
    return noun_phrase + "'s"


def lower_initial(text: str) -> str:
    return text[:1].lower() + text[1:] if text else text


def specific_subject(obj: dict) -> str:
    """Prefer the disambiguating hotspot label in newly spoken sentences."""
    name = obj["name"].strip()
    stored = obj["grammar_data"].get("subject", "").strip()
    if name.lower().startswith("the "):
        return name
    first_word = name.split()[0] if name.split() else ""
    if first_word.endswith("'s") and stored:
        return stored
    return "The " + lower_initial(name)


def inflect_first(base: str, form: str, plural: bool = False) -> str:
    first, *rest = base.split(" ", 1)
    tail = " " + rest[0] if rest else ""
    irregular = {
        "be": {"third": "are" if plural else "is", "ing": "being",
               "past": "were" if plural else "was", "pp": "been"},
        "have": {"third": "have" if plural else "has", "ing": "having",
                 "past": "had", "pp": "had"},
        "do": {"third": "do" if plural else "does", "ing": "doing",
               "past": "did", "pp": "done"},
        "go": {"third": "go" if plural else "goes", "ing": "going",
               "past": "went", "pp": "gone"},
        "take": {"third": "take" if plural else "takes", "ing": "taking",
                 "past": "took", "pp": "taken"},
        "make": {"third": "make" if plural else "makes", "ing": "making",
                 "past": "made", "pp": "made"},
        "hold": {"third": "hold" if plural else "holds", "ing": "holding",
                 "past": "held", "pp": "held"},
        "carry": {"third": "carry" if plural else "carries", "ing": "carrying",
                  "past": "carried", "pp": "carried"},
        "hit": {"third": "hit" if plural else "hits", "ing": "hitting",
                "past": "hit", "pp": "hit"},
    }
    if first in irregular:
        return irregular[first][form] + tail
    if form == "third":
        if plural:
            word = first
        elif first.endswith(("s", "sh", "ch", "x", "z", "o")):
            word = first + "es"
        elif first.endswith("y") and len(first) > 1 and first[-2] not in "aeiou":
            word = first[:-1] + "ies"
        else:
            word = first + "s"
    elif form == "ing":
        if first.endswith("e") and first != "be":
            word = first[:-1] + "ing"
        elif first in {"nap", "sit", "run", "swim", "stop", "hop", "drop",
                       "plan", "chat", "clap", "spot", "fit", "pat", "rub",
                       "dig", "get", "step", "skip", "hug", "grab", "drag"}:
            word = first + first[-1] + "ing"
        else:
            word = first + "ing"
    else:
        if first.endswith("e"):
            word = first + "d"
        elif first.endswith("y") and len(first) > 1 and first[-2] not in "aeiou":
            word = first[:-1] + "ied"
        elif first in {"nap", "sit", "run", "swim", "stop", "hop", "drop",
                       "plan", "chat", "clap", "spot", "fit", "pat", "rub",
                       "dig", "get", "step", "skip", "hug", "grab", "drag"}:
            word = first + first[-1] + "ed"
        else:
            word = first + "ed"
    return word + tail


def personalize_rule(obj: dict, rule: dict[str, str], plural: bool) -> dict[str, str]:
    """Reuse a previously accepted ability phrase when it is a stronger fact."""
    if not (is_person(obj) or is_animal(obj) or any(
        word in words(obj["name"])
        for word in ("train", "car", "truck", "van", "bus", "boat", "bike",
                     "bicycle", "scooter", "plane", "helicopter", "engine")
    )):
        return rule
    sentence = obj["grammar_data"].get("ability_can", "")
    match = re.search(r"\bcan\s+([^.!?]+)", sentence, re.IGNORECASE)
    if not match:
        return rule
    base = match.group(1).strip()
    if (not 1 <= len(base.split()) <= 12 or "," in base or " and " in base
            or base.lower().startswith("be ")):
        return rule
    updated = dict(rule)
    updated.update({
        "base": base,
        "third": inflect_first(base, "third", plural),
        "ing": inflect_first(base, "ing", plural),
        "past": inflect_first(base, "past", plural),
        "pp": inflect_first(base, "pp", plural),
    })
    return updated


def identity_snapshot(index: dict) -> dict:
    return {
        page: [(o["id"], o["name"], o["box"]) for o in index[page]]
        for page in PAGES
    }


def is_plural(obj: dict) -> bool:
    name = obj["name"].lower().strip()
    # A plural possessor does not make the possessed object plural.
    if name.startswith(("children's ", "childrens ")):
        return False
    # This label denotes the flock visible in the meadow; the other sheep
    # labels on the individual-animal pages remain singular.
    if name.startswith("sheep in the meadow"):
        return True
    head = re.split(
        r"\s+(?:with|on|in|by|under|over|at|behind|beside|near|above|below|of)\s+",
        name, maxsplit=1
    )[0]
    head_words = words(head)
    if (head in {"group", "flock", "herd", "pair", "couple", "pack"}
            or name.startswith(("two ", "three ", "four ", "several ", "many ",
                                "group ", "flock ", "herd ", "pair ", "couple ",
                                "pack "))):
        return True
    plural_people = {"people", "children", "men", "women", "boys", "girls"}
    singular_people = PERSON_WORDS - plural_people - {"family", "couple"}
    if head_words & plural_people:
        return True
    if len(head_words & singular_people) >= 2 and " and " in head:
        return True
    if head_words & singular_people:
        return False
    known_plural = {
        "people", "children", "men", "women", "boys", "girls", "birds",
        "clouds", "flowers", "trees", "rocks", "panels", "tracks", "wheels",
        "stairs", "girders", "piglets", "foals", "balloons", "swallows",
        "dogs", "cats", "horses", "ponies", "cows", "bulls", "windows",
        "beams", "rooftops", "suitcases", "passengers", "tourists", "reeds",
        "coyotes", "rabbits", "chickens", "geese", "ducks", "pigeons",
    }
    singular_animals = {
        "chamois", "sheep", "bison", "buffalo", "deer", "moose", "swine",
    }
    if head_words & singular_animals:
        return name.startswith(("flock ", "herd ", "group ", "two ", "three "))
    if head_words & known_plural:
        return True
    last = head.split()[-1] if head.split() else ""
    singular_s = {
        "glass", "grass", "bus", "dress", "cactus", "staircase", "compass",
        "mattress", "princess", "waitress", "address", "chamois", "upstairs",
    }
    return last.endswith("s") and last not in singular_s


def is_person(obj: dict) -> bool:
    data = obj["grammar_data"]
    return bool(
        words(obj["name"]) & PERSON_WORDS
        or any(k in data for k in (
            "pronoun_he", "pronoun_she", "pronoun_him", "pronoun_her",
            "relative_defining_who", "relative_nondefining_who",
        ))
    )


def is_animal(obj: dict) -> bool:
    return bool(words(obj["name"]) & ANIMAL_WORDS) and not is_person(obj)


def gender(obj: dict) -> str:
    data = obj["grammar_data"]
    w = words(obj["name"])
    if any(key in data for key in ("pronoun_he", "pronoun_him", "possessive_his")) or w & MALE_WORDS:
        return "male"
    if any(key in data for key in ("pronoun_she", "pronoun_her", "possessive_her")) or w & FEMALE_WORDS:
        return "female"
    return "unknown"


def rule_for(obj: dict) -> dict[str, str]:
    """Return an object-specific semantic rule with inflected verb forms."""
    name = obj["name"].lower()
    w = words(name)

    def rule(**kwargs: str) -> dict[str, str]:
        return kwargs

    if is_person(obj):
        if w & {"musician", "guitarist", "accordion", "horn", "singer"}:
            return rule(desc="focused on the performance", base="entertain the crowd",
                        third="entertains the crowd", ing="entertaining the crowd",
                        past="entertained the crowd", pp="entertained the crowd",
                        part="performance", service="invited", resource="energy",
                        adverb="confidently", reason="the audience is paying attention")
        if w & {"worker", "builder", "carpenter", "painter", "plasterer",
                "electrician", "mechanic", "gardener", "nurse", "waiter"}:
            return rule(desc="busy with a practical job", base="finish the job",
                        third="finishes the job", ing="finishing the job",
                        past="finished the job", pp="finished the job",
                        part="equipment", service="briefed", resource="time",
                        adverb="carefully", reason="the work requires concentration")
        if w & {"driver", "rider", "cyclist", "pilot", "skier", "snowboarder",
                "parachutist", "swimmer"}:
            return rule(desc="alert and ready to react", base="control the journey",
                        third="controls the journey", ing="controlling the journey",
                        past="controlled the journey", pp="controlled the journey",
                        part="equipment", service="trained", resource="experience",
                        adverb="skillfully", reason="the route demands close attention")
        if w & {"child", "children", "boy", "boys", "girl", "girls", "toddler"}:
            return rule(desc="curious and full of energy", base="explore something new",
                        third="explores something new", ing="exploring something new",
                        past="explored something new", pp="explored something new",
                        part="clothes", service="reminded", resource="energy",
                        adverb="eagerly", reason="something interesting has caught their attention")
        return rule(desc="absorbed in the day's events", base="carry out the day's plan",
                    third="carries out the day's plan", ing="carrying out the day's plan",
                    past="carried out the day's plan", pp="carried out the day's plan",
                    part="clothes", service="invited", resource="time",
                    adverb="purposefully", reason="there is still something important to do")

    if is_animal(obj):
        if w & {"bird", "birds", "pigeon", "pigeons", "eagle", "hawk", "owl",
                "duck", "ducks", "goose", "geese", "swan", "pelican", "heron",
                "stork", "rooster", "chicken", "chickens", "bat", "swallow",
                "swallows"}:
            return rule(desc="alert and adapted to life outdoors", base="search for food",
                        third="searches for food", ing="searching for food",
                        past="searched for food", pp="searched for food",
                        part="feathers", service="examined", resource="energy",
                        adverb="gracefully", reason="its sharp eyes have noticed movement")
        return rule(desc="alert and comfortable in its surroundings", base="explore the area",
                    third="explores the area", ing="exploring the area",
                    past="explored the area", pp="explored the area",
                    part="coat", service="examined", resource="energy",
                    adverb="cautiously", reason="a new sound has caught its attention")

    if w & {"wheel", "wheels", "tyre", "tire", "tracks"}:
        return rule(desc="strong enough to support the vehicle", base="keep the vehicle moving",
                    third="keeps the vehicle moving", ing="keeping the vehicle moving",
                    past="kept the vehicle moving", pp="kept the vehicle moving",
                    part="rim", service="inspected", resource="strength",
                    adverb="smoothly", reason="the axle is firmly connected")

    if "solar" in w and w & {"panel", "panels", "array"}:
        return rule(desc="clean and angled towards the sunlight", base="generate electricity",
                    third="generates electricity", ing="generating electricity",
                    past="generated electricity", pp="generated electricity",
                    part="cells", service="cleaned", resource="sunlight",
                    adverb="quietly", reason="sunlight is reaching the cells")

    if w & {"toilet", "sink", "bath", "bathtub", "shower"}:
        return rule(desc="clean and ready for use", base="support daily hygiene",
                    third="supports daily hygiene", ing="supporting daily hygiene",
                    past="supported daily hygiene", pp="supported daily hygiene",
                    part="fittings", service="cleaned", resource="water",
                    adverb="hygienically", reason="the plumbing is connected")

    if w & {"drum", "guitar", "accordion", "horn", "trumpet", "instrument"}:
        return rule(desc="ready to add music to the scene", base="create a clear rhythm",
                    third="creates a clear rhythm", ing="creating a clear rhythm",
                    past="created a clear rhythm", pp="created a clear rhythm",
                    part="sound", service="tuned", resource="volume",
                    adverb="rhythmically", reason="its musical parts are properly adjusted")

    if "hot" in w and "balloon" in w:
        return rule(desc="colorful and ready to rise", base="carry passengers above the landscape",
                    third="carries passengers above the landscape",
                    ing="carrying passengers above the landscape",
                    past="carried passengers above the landscape",
                    pp="carried passengers above the landscape", part="envelope",
                    service="inspected", resource="hot air", adverb="gently",
                    reason="warm air is filling the envelope")

    if "balloon" in w:
        return rule(desc="bright and light enough to float", base="drift with the breeze",
                    third="drifts with the breeze", ing="drifting with the breeze",
                    past="drifted with the breeze", pp="drifted with the breeze",
                    part="string", service="inflated", resource="air",
                    adverb="gently", reason="moving air is pushing it along")

    if w & {"window", "windows"}:
        return rule(desc="bright and carefully framed", base="admit daylight",
                    third="admits daylight", ing="admitting daylight",
                    past="admitted daylight", pp="admitted daylight", part="glass",
                    service="cleaned", resource="daylight", adverb="softly",
                    reason="the glass is clear")

    if w & {"chimney"}:
        return rule(desc="solid and built to withstand heat", base="carry smoke away",
                    third="carries smoke away", ing="carrying smoke away",
                    past="carried smoke away", pp="carried smoke away", part="brickwork",
                    service="swept", resource="draft", adverb="steadily",
                    reason="the flue is open")

    if w & {"door", "doorway", "gate", "railing", "fence",
            "roof", "balcony", "staircase", "stairs", "wall"}:
        return rule(desc="solid and carefully fitted", base="serve the building for many years",
                    third="serves the building for many years",
                    ing="serving the building year after year",
                    past="served the building for many years",
                    pp="served the building for many years", part="frame",
                    service="repaired", resource="strength", adverb="reliably",
                    reason="its frame is firmly secured")

    if w & {"house", "cottage", "farmhouse", "chalet", "building", "station",
            "shop", "cafe", "hotel", "motel", "barn", "tower", "garage", "post",
            "store", "market", "school"}:
        return rule(desc="sturdy and built to last", base="shelter people from the weather",
                    third="shelters people from the weather",
                    ing="sheltering people from the weather",
                    past="sheltered people from the weather",
                    pp="sheltered people from the weather", part="roof",
                    service="renovated", resource="space", adverb="reliably",
                    reason="its walls are thick and well maintained")

    if w & {"train", "car", "truck", "van", "bus", "camper", "coach", "wagon",
            "engine", "locomotive", "boat", "ship", "bicycle", "bike", "scooter",
            "motorcycle", "helicopter", "plane", "biplane", "jeep", "digger",
            "excavator", "crane", "tractor", "kayak"}:
        return rule(desc="ready for another journey", base="carry people and supplies",
                    third="carries people and supplies", ing="carrying people and supplies",
                    past="carried people and supplies", pp="carried people and supplies",
                    part="engine", service="inspected", resource="fuel",
                    adverb="steadily", reason="its main parts are working together")

    if w & {"vase", "flowerpot", "planter"}:
        return rule(desc="stable and arranged to protect its contents",
                    base="hold its flowers securely",
                    third="holds its flowers securely",
                    ing="holding its flowers securely",
                    past="held its flowers securely",
                    pp="held its flowers securely", part="rim",
                    service="cleaned", resource="water",
                    adverb="carefully",
                    reason="its base is resting on a firm surface")

    if w & {"tree", "trees", "bush", "hedge", "plant", "flower", "flowers",
            "grass", "forest", "spruce", "pine", "cactus", "saguaro", "meadow",
            "reeds"}:
        return rule(desc="healthy and full of natural color", base="provide shelter for wildlife",
                    third="provides shelter for wildlife", ing="providing shelter for wildlife",
                    past="provided shelter for wildlife", pp="provided shelter for wildlife",
                    part="branches", service="trimmed", resource="sunlight",
                    adverb="naturally", reason="its roots have reached moist soil")

    if w & {"river", "stream", "waterfall", "pond", "lake", "fountain", "water"}:
        return rule(desc="fresh and constantly changing", base="carry water through the landscape",
                    third="carries water through the landscape",
                    ing="carrying water through the landscape",
                    past="carried water through the landscape",
                    pp="carried water through the landscape", part="edge",
                    service="cleared", resource="water", adverb="continuously",
                    reason="a steady flow keeps it moving")

    if "coal" in w:
        return rule(desc="dark and ready to be used as fuel", base="provide fuel",
                    third="provides fuel", ing="providing fuel",
                    past="provided fuel", pp="provided fuel", part="surface",
                    service="weighed", resource="mass", adverb="effectively",
                    reason="it contains plenty of burnable material")

    if w & {"sand"}:
        return rule(desc="loose and useful for construction", base="supply building material",
                    third="supplies building material", ing="supplying building material",
                    past="supplied building material", pp="supplied building material",
                    part="grains", service="delivered", resource="material",
                    adverb="usefully", reason="the pile contains clean dry grains")

    if w & {"mountain", "peak", "hill", "cliff", "rock", "rocks", "mesa",
            "butte", "ridge", "valley", "outcrop", "spires"}:
        return rule(desc="striking and shaped by the weather", base="define the surrounding landscape",
                    third="defines the surrounding landscape",
                    ing="defining the surrounding landscape",
                    past="defined the surrounding landscape",
                    pp="defined the surrounding landscape", part="outline",
                    service="surveyed", resource="mass", adverb="dramatically",
                    reason="years of weather have shaped its outline")

    if w & {"sign", "board", "poster", "photograph", "photo", "picture", "flag",
            "banner", "display", "painting", "graffiti"}:
        return rule(desc="colorful and easy to recognize", base="catch people's attention",
                    third="catches people's attention", ing="catching people's attention",
                    past="caught people's attention", pp="caught people's attention",
                    part="lettering", service="repainted", resource="color",
                    adverb="clearly", reason="its bold design stands out")

    if w & {"chair", "bench", "table", "desk", "bed", "sofa", "shelf",
            "cupboard", "cabinet", "drawer", "counter", "swing"}:
        return rule(desc="sturdy enough for regular use", base="support its user",
                    third="supports its user", ing="supporting its user",
                    past="supported its user", pp="supported its user",
                    part="frame", service="repaired", resource="strength",
                    adverb="securely", reason="its joints are firmly connected")

    if w & {"cake", "bread", "food", "fruit", "apple", "drink", "juice",
            "hotdog", "meal", "ice", "sandwich"}:
        return rule(desc="fresh and ready to be served", base="feed a hungry visitor",
                    third="feeds a hungry visitor", ing="feeding a hungry visitor",
                    past="fed a hungry visitor", pp="fed a hungry visitor",
                    part="serving", service="prepared", resource="food",
                    adverb="generously", reason="it was prepared shortly before serving")

    if w & {"box", "bag", "case", "basket", "bottle", "cup", "glass", "plate",
            "tray", "bucket", "bin", "suitcase", "lunch", "parcel"}:
        return rule(desc="practical and ready to be used", base="hold its contents safely",
                    third="holds its contents safely", ing="holding its contents safely",
                    past="held its contents safely", pp="held its contents safely",
                    part="handle", service="cleaned", resource="room",
                    adverb="securely", reason="its sides keep the contents together")

    if w & {"tool", "drill", "hammer", "broom", "hose", "ladder", "camera",
            "tripod", "machine", "turbine", "panel", "panels", "wheel",
            "wheels", "track", "tracks", "girder", "girders", "bridge", "dam"}:
        return rule(desc="strong and suited to demanding work", base="perform a practical job",
                    third="performs a practical job", ing="performing a practical job",
                    past="performed a practical job", pp="performed a practical job",
                    part="main section", service="inspected", resource="strength",
                    adverb="efficiently", reason="its main parts are firmly connected")

    if w & {"toy", "doll", "puppet", "kite", "balloon", "ball", "game",
            "tricycle", "rocking"}:
        return rule(desc="bright and ready for another game", base="entertain a child",
                    third="entertains a child", ing="entertaining a child",
                    past="entertained a child", pp="entertained a child",
                    part="bright colors", service="mended", resource="color",
                    adverb="cheerfully", reason="its bright colors attract attention")

    return rule(desc="distinctive and made for regular use", base="do its job",
                third="does its job", ing="doing its job",
                past="did its job", pp="done its job",
                part="main feature", service="checked", resource="strength",
                adverb="reliably", reason="its main feature is still in good shape")


def extract_visible_ing(obj: dict, plural: bool, rule: dict[str, str]) -> str:
    data = obj["grammar_data"]
    sentence = data.get("progressive_are" if plural else "progressive_is", "")
    subject = data.get("subject", obj["name"])
    for prefix in (subject + (" are " if plural else " is "),
                   "They are ", "We are ", "He is ", "She is ", "It is "):
        if sentence.lower().startswith(prefix.lower()):
            phrase = sentence[len(prefix):].rstrip(".?!")
            if re.search(r"\b\w+ing\b", phrase):
                return phrase
    return rule["ing"]


def nearest(obj: dict, page_objects: list[dict], predicate=lambda _o: True) -> dict | None:
    y1, x1, y2, x2 = obj["box"]
    cy, cx = (y1 + y2) / 2, (x1 + x2) / 2
    candidates = []
    for other in page_objects:
        if other["id"] == obj["id"] or not predicate(other):
            continue
        a, b, c, d = other["box"]
        distance = ((cy - (a + c) / 2) ** 2 + (cx - (b + d) / 2) ** 2) ** 0.5
        candidates.append((distance, other))
    return min(candidates, default=(None, None), key=lambda item: item[0])[1]


def sentence_bank(obj: dict, page_objects: list[dict]) -> dict[str, str]:
    data = obj["grammar_data"]
    subject = specific_subject(obj)
    plural = is_plural(obj)
    person = is_person(obj)
    animal = is_animal(obj)
    animate = person or animal
    rule = personalize_rule(obj, rule_for(obj), plural)
    gender_value = gender(obj)
    if plural:
        rule = {
            key: re.sub(r"\bits\b", "their", value, flags=re.IGNORECASE)
            for key, value in rule.items()
        }
    elif gender_value in {"male", "female"}:
        subject_pronoun = "he" if gender_value == "male" else "she"
        object_pronoun = "him" if gender_value == "male" else "her"
        owner_pronoun = "his" if gender_value == "male" else "her"
        rule = {
            key: re.sub(
                r"\btheir\b", owner_pronoun,
                re.sub(
                    r"\bthem\b", object_pronoun,
                    re.sub(r"\bthey\b", subject_pronoun, value,
                           flags=re.IGNORECASE),
                    flags=re.IGNORECASE,
                ),
                flags=re.IGNORECASE,
            )
            for key, value in rule.items()
        }
    visible_ing = extract_visible_ing(obj, plural, rule)
    be, past_be = ("are", "were") if plural else ("is", "was")
    have, do, third = ("have", "do", rule["base"]) if plural else ("has", "does", rule["third"])
    pronoun = "they" if plural else ("he" if gender_value == "male" else
                                    "she" if gender_value == "female" else
                                    "they" if person else "it")
    pronoun_be = "are" if pronoun == "they" else "is"
    obj_phrase = lower_initial(subject)
    owner = "their" if plural or gender_value == "unknown" else (
        "his" if gender_value == "male" else "her"
    )
    neighbour = nearest(obj, page_objects)
    neighbour_person = nearest(obj, page_objects, is_person)
    neighbour_subject = (
        specific_subject(neighbour)
        if neighbour else "another detail in the scene"
    )
    speaker = (
        specific_subject(neighbour_person) if neighbour_person else "A visitor"
    )
    neighbour_plural = bool(neighbour and is_plural(neighbour))
    neighbour_rule = (
        personalize_rule(neighbour, rule_for(neighbour), neighbour_plural)
        if neighbour else rule
    )
    if neighbour_plural:
        neighbour_rule = {
            key: re.sub(r"\bits\b", "their", value, flags=re.IGNORECASE)
            for key, value in neighbour_rule.items()
        }
    neighbour_present = (
        neighbour_rule["base"] if neighbour_plural
        else neighbour_rule["third"]
    )
    neighbour_past = neighbour_rule["past"]
    neighbour_be = "are" if neighbour and is_plural(neighbour) else "is"
    object_words = words(obj["name"])
    if person:
        service_agent = choose(obj["id"] + "agent", [
            "an adult", "the organizer", "a colleague", "the group leader",
        ])
    elif animal:
        service_agent = choose(obj["id"] + "agent", [
            "a wildlife expert", "a veterinarian", "the keeper", "a ranger",
        ])
    elif object_words & {"mountain", "peak", "hill", "cliff", "rock", "rocks",
                         "mesa", "butte", "ridge", "valley", "outcrop", "spires",
                         "coal", "sand"}:
        service_agent = "a surveyor"
    elif object_words & {"tree", "trees", "bush", "hedge", "plant", "flower",
                         "flowers", "grass", "forest", "spruce", "pine", "cactus"}:
        service_agent = "a gardener"
    elif object_words & {"cake", "bread", "food", "fruit", "apple", "drink",
                         "juice", "hotdog", "meal", "sandwich"}:
        service_agent = "a cook"
    elif object_words & {"train", "car", "truck", "van", "bus", "boat", "bike",
                         "bicycle", "scooter", "plane", "helicopter", "engine"}:
        service_agent = "a mechanic"
    else:
        service_agent = choose(obj["id"] + "agent", [
            "a careful worker", "the owner", "a local specialist", "the staff",
        ])
    part_plural = rule["part"] in {"clothes", "branches", "feathers", "colors", "grains"}
    part_be = "are" if part_plural else "is"
    part_help = "help" if part_plural else "helps"
    regular_service = (
        rule["service"] if rule["service"].endswith("ed") else "checked"
    )
    demo_referent = "people" if person and plural else (
        "a person" if person else "animals" if animal and plural else
        "an animal" if animal else "objects" if plural else "an object"
    )
    damage_state = "badly hurt" if animate else "badly damaged"
    bare_subject = re.sub(r"^the\s+", "", obj_phrase, flags=re.IGNORECASE)
    if plural:
        existential_phrase = bare_subject
    else:
        article = "an" if bare_subject[:1].lower() in "aeiou" else "a"
        existential_phrase = f"{article} {bare_subject}"

    bank: dict[str, str] = {}
    bank["to_be_are" if plural else "to_be_is"] = f"{subject} {be} {rule['desc']}."
    bank["progressive_are" if plural else "progressive_is"] = (
        f"{subject} {be} {visible_ing}."
    )
    bank["there_are" if plural else "there_is"] = (
        f"There {'are' if plural else 'is'} {existential_phrase} {visible_ing}."
    )
    bank["demonstrative_these" if plural else "demonstrative_this"] = choose(
        obj["id"] + "demo",
        [
            f"{'These are' if plural else 'This is'} {obj_phrase}, and {pronoun} {pronoun_be} {rule['desc']}.",
            f"{'These are' if plural else 'This is'} {obj_phrase}; {pronoun} can {rule['base']}.",
            f"{'These are' if plural else 'This is'} {obj_phrase}, {demo_referent} known for {rule['ing']}.",
        ],
    )
    bank["demonstrative_those" if plural else "demonstrative_that"] = (
        f"{'Those are' if plural else 'That is'} {obj_phrase}; "
        f"{pronoun} {pronoun_be} {rule['desc']}."
    )
    if plural:
        bank["pronoun_they"] = f"They are {rule['desc']}."
        if person:
            bank["pronoun_them"] = f"{speaker} asked them to {rule['base']}."
        elif animal:
            bank["pronoun_them"] = (
                f"A wildlife expert watched them {rule['base']}."
            )
        else:
            bank["pronoun_them"] = (
                f"The owner checked them before the busy day began."
            )
        bank["possessive_their"] = (
            f"Their {rule['part']} {part_help} them {rule['base']}."
        )
    elif gender_value == "male":
        bank["pronoun_he"] = f"He is ready to {rule['base']}."
        bank["pronoun_him"] = f"{speaker} asked him to {rule['base']}."
        bank["possessive_his"] = (
            f"His {rule['part']} {part_help} him {rule['base']}."
        )
    elif gender_value == "female":
        bank["pronoun_she"] = f"She is ready to {rule['base']}."
        bank["pronoun_her"] = f"{speaker} asked her to {rule['base']}."
        bank["possessive_her"] = (
            f"Her {rule['part']} {part_help} her {rule['base']}."
        )
    if person:
        bank["possessive_noun"] = (
            f"{possessive(subject)} plans include time to {rule['base']}."
        )
    elif animal:
        bank["possessive_noun"] = (
            f"{possessive(subject)} {rule['part']} {part_help} protect {pronoun} outdoors."
        )
    else:
        bank["possessive_noun"] = choose(
            obj["id"] + "possessive",
            [
                f"{possessive(subject)} {rule['part']} {part_help} {pronoun} {rule['base']}.",
                f"{possessive(subject)} {rule['part']} {part_be} important whenever {pronoun} must {rule['base']}.",
                f"Without {lower_initial(possessive(subject))} {rule['part']}, {pronoun} could not {rule['base']}.",
            ],
        )
    bank["ability_can"] = f"{subject} can {rule['base']}."
    bank["ability_cannot"] = (
        f"{subject} cannot {rule['base']} if {pronoun} {pronoun_be} {damage_state}."
    )
    bank["frequency_usually"] = choose(
        obj["id"] + "usually",
        [
            f"{subject} usually {third}.",
            f"During a normal day, {obj_phrase} usually {third}.",
            f"{subject} usually {third} without attracting much attention.",
        ],
    )
    bank["frequency_always"] = (
        f"{subject} always {third} when {rule['reason']}."
    )
    bank["frequency_often"] = (
        f"{subject} often {third} during a busy day."
    )
    bank["frequency_never"] = (
        f"{subject} never {third} without enough {rule['resource']}."
    )
    if animate or any(word in words(obj["name"]) for word in (
        "train", "car", "truck", "van", "bus", "boat", "bike", "bicycle",
        "scooter", "plane", "helicopter", "machine", "turbine",
    )):
        bank["frequency_sometimes"] = choose(
            obj["id"] + "sometimes",
            [
                f"{subject} sometimes {third} for longer than expected.",
                f"On a busy day, {obj_phrase} sometimes {third}.",
                f"{subject} sometimes {third} before anyone notices.",
            ],
        )
    bank["imperative_negative"] = choose(
        obj["id"] + "negative",
        [
            f"Do not interfere with {obj_phrase} while {pronoun} {be} {visible_ing}!",
            f"Do not damage {lower_initial(possessive(subject))} {rule['part']}!",
            f"Do not stop {obj_phrase} from {rule['ing']}!",
        ],
    )
    bank["imperative_affirmative"] = (
        f"Keep watching {obj_phrase} as {pronoun} {pronoun_be} {visible_ing}!"
    )
    if person:
        bank["comparative_er"] = (
            f"{subject} seems calmer than another person doing the same task."
        )
        bank["comparative_more"] = (
            f"{subject} is more experienced than a new member of the group."
        )
        bank["superlative_est"] = (
            f"According to the organizer, {obj_phrase} is the calmest person in the group."
        )
        bank["superlative_most"] = (
            f"The organizer considers {obj_phrase} the most dependable person for this task."
        )
    elif animal:
        bank["comparative_er"] = (
            f"{subject} seems calmer than another animal nearby."
        )
        bank["comparative_more"] = (
            f"{subject} is more alert than a younger animal of the same kind."
        )
        bank["superlative_est"] = (
            f"A local keeper says {obj_phrase} is the calmest animal in the group."
        )
        bank["superlative_most"] = (
            f"The keeper considers {obj_phrase} the most adaptable animal in the area."
        )
    else:
        bank["comparative_er"] = (
            f"{subject} is larger than a similar example kept elsewhere."
        )
        bank["comparative_more"] = (
            f"{subject} is more noticeable than another example of the same kind."
        )
        bank["superlative_est"] = (
            f"A local guide calls {obj_phrase} the clearest example of its kind in the area."
        )
        bank["superlative_most"] = (
            f"In this setting, {obj_phrase} is the most noticeable example of its kind."
        )
    bank["past_regular"] = choose(
        obj["id"] + "regular",
        [
            f"Earlier that day, {service_agent} {regular_service} {obj_phrase}.",
            f"Before the crowds arrived, {service_agent} {regular_service} {obj_phrase}.",
            f"{service_agent.capitalize()} {regular_service} {obj_phrase} during the morning.",
        ],
    )
    bank["past_irregular"] = f"{subject} began to {rule['base']} before the scene became busy."
    bank["obligation_have_to" if plural else "obligation_has_to"] = choose(
        obj["id"] + "haveto",
        [
            f"{subject} {have} to {rule['base']} when needed.",
            f"Before the day ends, {obj_phrase} {have} to {rule['base']}.",
            f"{subject} {have} to keep {rule['ing']} for a little longer.",
        ],
    )
    bank["obligation_must"] = f"{subject} must remain able to {rule['base']}."
    if animate:
        bank["future_going_are" if plural else "future_going_is"] = (
            f"{subject} {be} going to {rule['base']} very soon."
        )
    else:
        bank["future_going_are" if plural else "future_going_is"] = choose(
            obj["id"] + "going",
            [
                f"{subject} {be} going to keep {rule['ing']} throughout the day.",
                f"Before evening, {obj_phrase} {be} going to {rule['base']} again.",
                f"{subject} {be} going to {rule['base']} for a little longer.",
            ],
        )
    bank["future_will"] = choose(
        obj["id"] + "will",
        [
            f"{subject} will keep {rule['ing']} for the rest of the day.",
            f"Later, {obj_phrase} will {rule['base']} again.",
            f"{subject} will probably {rule['base']} before evening.",
        ],
    )
    bank["adverbs_manner"] = choose(
        obj["id"] + "manner",
        [
            f"{subject} {third} {rule['adverb']}.",
            f"{rule['adverb'].capitalize()}, {obj_phrase} {third}.",
            f"{subject} {rule['adverb']} {third}.",
        ],
    )
    name_words = words(obj["name"])
    if animate:
        bank["infinitive_purpose"] = f"{subject} moved into view to {rule['base']}."
    elif name_words & {"mountain", "peak", "hill", "cliff", "rock", "rocks",
                       "mesa", "butte", "ridge", "valley", "outcrop", "spires"}:
        bank["infinitive_purpose"] = (
            f"Mapmakers use {obj_phrase} to identify this part of the landscape."
        )
    elif name_words & {"tree", "trees", "bush", "hedge", "plant", "flower",
                       "flowers", "grass", "forest", "spruce", "pine", "cactus",
                       "meadow", "reeds"}:
        bank["infinitive_purpose"] = (
            f"Wildlife uses {obj_phrase} to find food or shelter."
        )
    elif name_words & {"river", "stream", "waterfall", "pond", "lake",
                       "fountain", "water"}:
        bank["infinitive_purpose"] = (
            f"Animals visit {obj_phrase} to find fresh water."
        )
    else:
        bank["infinitive_purpose"] = (
            f"People use {obj_phrase} to {rule['base']}."
        )
    bank["quantifier_enough"] = choose(
        obj["id"] + "enough",
        [
            f"{subject} {have} enough {rule['resource']} to {rule['base']}.",
            f"There is enough {rule['resource']} for {obj_phrase} to {rule['base']}.",
            f"With enough {rule['resource']}, {obj_phrase} can {rule['base']}.",
        ],
    )
    bank["quantifier_not_enough"] = (
        f"In difficult conditions, {obj_phrase} might not have enough "
        f"{rule['resource']} to {rule['base']}."
    )
    bank["quantifier_too_many"] = (
        f"Too many interruptions would prevent {obj_phrase} from {rule['ing']}."
    )
    bank["quantifier_too_much"] = (
        f"Too much damage would make it difficult for {obj_phrase} to {rule['base']}."
    )
    bank["conjunction_and"] = (
        f"{subject} {third}, and {lower_initial(neighbour_subject)} {neighbour_present}."
    )
    bank["conjunction_but"] = (
        f"{subject} {be} {rule['desc']}, but {lower_initial(neighbour_subject)} "
        f"{neighbour_be} {neighbour_rule['desc']}."
    )
    bank["conjunction_because"] = (
        f"{subject} can {rule['base']} because {rule['reason']}."
    )
    bank["conjunction_so"] = (
        f"{rule['reason'].capitalize()}, so {obj_phrase} can {rule['base']}."
    )
    bank["past_continuous_visual"] = choose(
        obj["id"] + "pcvisual",
        [
            f"At that moment, {obj_phrase} {past_be} {visible_ing}.",
            f"For several minutes, {obj_phrase} {past_be} {visible_ing}.",
            f"Earlier, {obj_phrase} {past_be} {visible_ing}.",
        ],
    )
    bank["past_continuous_were" if plural else "past_continuous_was"] = (
        f"{subject} {past_be} {visible_ing} while {lower_initial(neighbour_subject)} remained nearby."
    )
    bank["past_continuous_interrupted"] = (
        f"{subject} {past_be} {visible_ing} when the routine suddenly changed."
    )
    bank["simultaneous_while"] = (
        f"While {lower_initial(subject)} {past_be} {visible_ing}, "
        f"{lower_initial(neighbour_subject)} {neighbour_past}."
    )
    bank["simultaneous_as"] = (
        f"As {lower_initial(subject)} {past_be} {visible_ing}, "
        f"{lower_initial(neighbour_subject)} remained in view."
    )
    bank["used_to"] = (
        f"{subject} used to {rule['base']} in a quieter setting."
    )
    bank["passive_simple_are" if plural else "passive_simple_is"] = (
        f"{subject} {be} regularly {rule['service']} by {service_agent}."
    )
    bank["passive_simple_were" if plural else "passive_simple_was"] = choose(
        obj["id"] + "passivepast",
        [
            f"{subject} {past_be} {rule['service']} before the day began.",
            f"During the previous week, {obj_phrase} {past_be} {rule['service']}.",
            f"{subject} {past_be} carefully {rule['service']} earlier that morning.",
        ],
    )
    bank["present_perfect_have" if plural else "present_perfect_has"] = (
        f"{subject} {have} {rule['pp']} many times before."
    )
    if person:
        bank["first_conditional"] = (
            f"If {lower_initial(subject)} {third}, {pronoun} will finish what {pronoun} started."
        )
        bank["second_conditional"] = (
            f"If {lower_initial(subject)} could no longer {rule['base']}, "
            f"{pronoun} would ask someone for help."
        )
    elif animal:
        bank["first_conditional"] = (
            f"If {lower_initial(subject)} {third}, {pronoun} will remain safe."
        )
        bank["second_conditional"] = (
            f"If {lower_initial(subject)} could no longer {rule['base']}, "
            f"{pronoun} would stop and rest."
        )
    else:
        bank["first_conditional"] = (
            f"If {lower_initial(subject)} {third}, {pronoun} will remain useful for longer."
        )
        bank["second_conditional"] = (
            f"If {lower_initial(subject)} could no longer {rule['base']}, "
            f"{lower_initial(neighbour_subject)} would have to take over."
        )
    relative = "who" if person else "that"
    if plural:
        bank[f"relative_defining_{relative}"] = (
            f"These are {obj_phrase} {relative} {third}."
        )
    else:
        referent = "person" if person else "one"
        bank[f"relative_defining_{relative}"] = (
            f"{subject} is the {referent} {relative} {third}."
        )
    if animate:
        bank["gerund_complement"] = choose(
            obj["id"] + "gerund",
            [
                f"{subject} enjoys {rule['ing']}, especially when the day is calm.",
                f"{subject} likes {rule['ing']} whenever there is enough time.",
                f"{subject} keeps {rule['ing']} even as the scene grows busier.",
            ],
        )
    else:
        bank["gerund_complement"] = choose(
            obj["id"] + "gerund",
            [
                f"People appreciate seeing {obj_phrase} {rule['ing']}.",
                f"Visitors enjoy watching {obj_phrase} {rule['ing']}.",
                f"Using {obj_phrase} means relying on it for {rule['ing']}.",
            ],
        )
    bank["infinitive_complement"] = f"{subject} seems ready to {rule['base']}."
    must_source = data.get("deduction_present_must", "")
    if re.search(r"\bmust\b", must_source, re.IGNORECASE):
        bank["deduction_present_might"] = re.sub(
            r"\bmust\b", "might", must_source, count=1, flags=re.IGNORECASE
        )
    else:
        bank["deduction_present_might"] = (
            f"{subject} might be {visible_ing}, although the picture leaves some uncertainty."
        )
    if person:
        bank["deduction_present_must"] = (
            f"{subject} must be focused because {rule['reason']}."
        )
        bank["deduction_present_cannot"] = (
            f"{subject} cannot be completely unprepared because {pronoun} can {rule['base']}."
        )
    elif animal:
        bank["deduction_present_must"] = (
            f"{subject} must be alert because {rule['reason']}."
        )
        bank["deduction_present_cannot"] = (
            f"{subject} cannot be too weak because {pronoun} can {rule['base']}."
        )
    else:
        bank["deduction_present_must"] = (
            f"{subject} must be useful because {rule['reason']}."
        )
        bank["deduction_present_cannot"] = (
            f"{subject} cannot be completely unusable because {pronoun} can {rule['base']}."
        )
    bank["deduction_past_must"] = (
        f"{subject} must have been {regular_service} before the busy day began."
    )
    bank["deduction_past_could_not"] = (
        f"{subject} could not have been ignored when the day's work was planned."
    )
    if animate:
        bank["third_conditional_alternate"] = (
            f"If {lower_initial(subject)} had not {rule['pp']}, "
            f"{pronoun} would have had a more difficult day."
        )
    else:
        bank["third_conditional_alternate"] = (
            f"If {lower_initial(subject)} had not {rule['pp']}, "
            f"{pronoun} would have been less useful during the day."
        )
    bank["perfect_continuous_have" if plural else "perfect_continuous_has"] = (
        f"{subject} {have} been {visible_ing} for several minutes."
    )
    bank["deduction_past_might"] = choose(
        obj["id"] + "pastmight",
        [
            f"{subject} might have {rule['pp']} earlier, because {rule['reason']}.",
            f"Because {rule['reason']}, {obj_phrase} might have {rule['pp']} before noon.",
            f"{subject} might have already {rule['pp']}; {rule['reason']}.",
        ],
    )
    bank["passive_continuous_are" if plural else "passive_continuous_is"] = (
        f"{subject} {be} being {rule['service']} by {service_agent}."
    )
    bank["perception_see"] = f"I can see {obj_phrase} {visible_ing}."
    bank["reported_told"] = (
        f"{speaker} told a friend that {obj_phrase} had {rule['pp']} earlier."
    )
    bank["reported_asked"] = (
        f"{speaker} asked whether {obj_phrase} had {rule['pp']} before noon."
    )
    nondef = "who" if person else "which"
    bank[f"relative_nondefining_{nondef}"] = (
        f"{subject}, {nondef} {third}, {be} {rule['desc']}."
    )

    if animate:
        bank["wish"] = (
            f"{subject} wishes {pronoun} had more time for {rule['ing']}."
        )
        bank["if_only"] = (
            f"If only {lower_initial(subject)} had more time to {rule['base']}!"
        )
        bank["third_conditional_regret"] = (
            f"If {lower_initial(subject)} had prepared earlier, "
            f"{pronoun} would have {rule['pp']} more easily."
        )
        bank["criticism_should"] = (
            f"{subject} should have checked {owner} surroundings before continuing."
        )
        bank["criticism_should_not"] = (
            f"{subject} should not have ignored a warning from {lower_initial(speaker)}."
        )
        bank["perception_watch"] = (
            f"I can watch {obj_phrase} {visible_ing} while {lower_initial(neighbour_subject)} stays nearby."
        )

    if person:
        bank["causative_have"] = (
            f"{subject} has {owner} equipment checked at regular intervals."
        )
        bank["causative_get"] = (
            f"{subject} gets {owner} equipment checked before an important day."
        )
    elif not animal:
        bank["causative_have"] = (
            f"The owner has {obj_phrase} {rule['service']} at regular intervals."
        )
        bank["causative_get"] = (
            f"The owner gets {obj_phrase} {rule['service']} before each busy season."
        )

    return bank


def allowed_fields(obj: dict, bank: dict[str, str]) -> dict[str, str]:
    """Enforce the number/person locks while retaining broad inferred coverage."""
    plural = is_plural(obj)
    person = is_person(obj)
    animate = person or is_animal(obj)
    gender_value = gender(obj)

    disallowed = set()
    for singular, plural_field in SINGULAR_PLURAL_PAIRS:
        disallowed.add(singular if plural else plural_field)
    if gender_value != "male":
        disallowed.update({"pronoun_he", "pronoun_him", "possessive_his"})
    if gender_value != "female":
        disallowed.update({"pronoun_she", "pronoun_her", "possessive_her"})
    if not plural:
        disallowed.update({"pronoun_they", "pronoun_them", "possessive_their"})
    if person:
        disallowed.update({"relative_defining_that", "relative_nondefining_which"})
    else:
        disallowed.update({"relative_defining_who", "relative_nondefining_who"})
    if not animate:
        disallowed.update({"wish", "if_only", "third_conditional_regret"})
    return {field: sentence for field, sentence in bank.items() if field not in disallowed}


def normalize_locked_fields(obj: dict) -> dict[str, str]:
    """Remove existing fields that violate SPEC2's hard identity locks."""
    data = obj["grammar_data"]
    plural = is_plural(obj)
    person = is_person(obj)
    gender_value = gender(obj)
    remove = set()
    for singular, plural_field in SINGULAR_PLURAL_PAIRS:
        remove.add(singular if plural else plural_field)
    if gender_value != "male":
        remove.update({"pronoun_he", "pronoun_him", "possessive_his"})
    if gender_value != "female":
        remove.update({"pronoun_she", "pronoun_her", "possessive_her"})
    if not plural:
        remove.update({"pronoun_they", "pronoun_them", "possessive_their"})
    if person:
        remove.update({"relative_defining_that", "relative_nondefining_which"})
    else:
        remove.update({"relative_defining_who", "relative_nondefining_who"})
    removed = {field: data.pop(field) for field in list(data) if field in remove}
    return removed


def target_present(field: str, sentence: str) -> bool:
    service_pp = (
        r"(?:checked|cleaned|repaired|inspected|renovated|trimmed|cleared|"
        r"surveyed|repainted|prepared|mended|invited|briefed|trained|reminded|"
        r"examined|swept|weighed|delivered|tuned|inflated)"
    )
    checks = {
        "to_be_is": r"\bis\b",
        "to_be_are": r"\bare\b",
        "progressive_is": r"\bis\b.+\b\w+ing\b",
        "progressive_are": r"\bare\b.+\b\w+ing\b",
        "there_is": r"^There is\b",
        "there_are": r"^There are\b",
        "demonstrative_this": r"^This is\b",
        "demonstrative_these": r"^These are\b",
        "demonstrative_that": r"^That is\b",
        "demonstrative_those": r"^Those are\b",
        "possessive_noun": r"'",
        "pronoun_he": r"^He\b",
        "pronoun_she": r"^She\b",
        "pronoun_they": r"^They\b",
        "pronoun_him": r"\bhim\b",
        "pronoun_her": r"\bher\b",
        "pronoun_them": r"\bthem\b",
        "possessive_his": r"^His\b",
        "possessive_her": r"^Her\b",
        "possessive_their": r"^Their\b",
        "ability_can": r"\bcan\b",
        "ability_cannot": r"\bcannot\b",
        "frequency_always": r"\balways\b",
        "frequency_often": r"\boften\b",
        "frequency_usually": r"\busually\b",
        "frequency_sometimes": r"\bsometimes\b",
        "frequency_never": r"\bnever\b",
        "imperative_affirmative": r"^Keep\b",
        "imperative_negative": r"^Do not\b",
        "comparative_er": r"\b(?:calmer|larger)\s+than\b",
        "comparative_more": r"\bmore\b.+\bthan\b",
        "superlative_est": r"\b(?:calmest|clearest)\b",
        "superlative_most": r"\bmost\b",
        "past_regular": r"\b\w+ed\b",
        "past_irregular": r"\bbegan\b",
        "obligation_has_to": r"\bhas to\b",
        "obligation_have_to": r"\bhave to\b",
        "obligation_must": r"\bmust\b",
        "future_going_is": r"\bis going to\b",
        "future_going_are": r"\bare going to\b",
        "future_will": r"\bwill\b",
        "adverbs_manner": r"\b\w+ly\b",
        "infinitive_purpose": r"\bto\s+\w+\b",
        "quantifier_enough": r"\benough\b",
        "quantifier_not_enough": r"\bnot have enough\b|\bnot enough\b",
        "quantifier_too_many": r"\btoo many\b",
        "quantifier_too_much": r"\btoo much\b",
        "conjunction_and": r"\band\b",
        "conjunction_but": r"\bbut\b",
        "conjunction_because": r"\bbecause\b",
        "conjunction_so": r"\bso\b",
        "past_continuous_visual": r"\b(?:was|were)\b.+\b\w+ing\b",
        "past_continuous_was": r"\bwas\b.+\b\w+ing\b",
        "past_continuous_were": r"\bwere\b.+\b\w+ing\b",
        "past_continuous_interrupted": r"\b(?:was|were)\b.+\b\w+ing\b.+\bwhen\b",
        "simultaneous_while": r"^While\b",
        "simultaneous_as": r"^As\b",
        "used_to": r"\bused to\b",
        "passive_simple_is": rf"\bis\b.+\b{service_pp}\b",
        "passive_simple_are": rf"\bare\b.+\b{service_pp}\b",
        "passive_simple_was": rf"\bwas\b.+\b{service_pp}\b",
        "passive_simple_were": rf"\bwere\b.+\b{service_pp}\b",
        "present_perfect_has": r"\bhas\b.+\b(?:many times|already|before)\b",
        "present_perfect_have": r"\bhave\b.+\b(?:many times|already|before)\b",
        "first_conditional": r"^If .+,\s.+\bwill\b",
        "second_conditional": r"^If .+,\s.+\bwould\b",
        "relative_defining_who": r"\bwho\b",
        "relative_defining_that": r"\bthat\b",
        "gerund_complement": r"\b(?:enjoys?|likes?|keeps?|seeing|watching|using)\b.+\b\w+ing\b",
        "infinitive_complement": r"\bseems ready to\b",
        "deduction_present_might": r"\bmight be\b",
        "deduction_present_must": r"\bmust be\b",
        "deduction_present_cannot": r"\bcannot be\b",
        "third_conditional_alternate": r"^If .+\bhad\b.+,\s.+\bwould have\b",
        "third_conditional_regret": r"^If .+\bhad\b.+,\s.+\bwould have\b",
        "wish": r"\bwishes\b",
        "if_only": r"^If only\b",
        "perfect_continuous_has": r"\bhas been\b.+\b\w+ing\b",
        "perfect_continuous_have": r"\bhave been\b.+\b\w+ing\b",
        "deduction_past_might": r"\bmight have\b",
        "deduction_past_must": r"\bmust have\b",
        "deduction_past_could_not": r"\bcould not have\b",
        "criticism_should": r"\bshould have\b",
        "criticism_should_not": r"\bshould not have\b",
        "passive_continuous_is": rf"\bis being\b.+\b{service_pp}\b",
        "passive_continuous_are": rf"\bare being\b.+\b{service_pp}\b",
        "causative_have": rf"\bhas\b.+\b{service_pp}\b",
        "causative_get": rf"\bgets\b.+\b{service_pp}\b",
        "perception_see": r"\bsee\b.+\b\w+ing\b",
        "perception_watch": r"\bwatch\b.+\b\w+ing\b",
        "reported_told": r"\btold\b.+\bthat\b.+\bhad\b",
        "reported_asked": r"\basked whether\b.+\bhad\b",
        "relative_nondefining_who": r", who\b",
        "relative_nondefining_which": r", which\b",
    }
    pattern = checks.get(field)
    return not pattern or bool(re.search(pattern, sentence, re.IGNORECASE))


def validate(index: dict, prompt_fields: set[str], added: dict[str, dict[str, str]]) -> None:
    ids = []
    banned = (
        "before conditions changed", "the task would have been easier",
        "the purpose", "the activity", "work as intended", "a steady pace",
        "before the area became busy", "the observer",
    )
    for page in PAGES:
        for obj in index[page]:
            ids.append(obj["id"])
            y1, x1, y2, x2 = obj["box"]
            assert 0 <= y1 < y2 <= 100 and 0 <= x1 < x2 <= 100
            data = obj["grammar_data"]
            assert data.get("subject")
            assert set(data) - {"subject"} <= prompt_fields
            for field, sentence in data.items():
                assert isinstance(sentence, str) and sentence.strip()
                if field == "subject":
                    continue
                assert sentence[0].isupper()
                assert sentence[-1] in ".?!"
                assert "\u2014" not in sentence
            for singular, plural in SINGULAR_PLURAL_PAIRS:
                assert not (singular in data and plural in data), (
                    obj["id"], singular, plural
                )
            for field, sentence in added.get(obj["id"], {}).items():
                assert not any(term in sentence.lower() for term in banned)
                assert target_present(field, sentence), (obj["id"], field, sentence)
    assert len(ids) == len(set(ids))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write expanded data")
    args = parser.parse_args()

    html = HTML_PATH.read_text(encoding="utf-8")
    prompts_match = PROMPTS_RE.search(html)
    index_match = INDEX_RE.search(html)
    if not prompts_match or not index_match:
        raise SystemExit("Could not locate embedded prompts or spatial index")

    prompts = json.loads(prompts_match.group(1))
    prompt_fields = {prompt["field"] for prompt in prompts}
    index = json.loads(index_match.group(1))
    json_index = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    before = identity_snapshot(index)
    if before != identity_snapshot(json_index):
        raise SystemExit("HTML and JSON identity/box data differ before expansion")

    added: dict[str, dict[str, str]] = {}
    before_counts = {}
    removed: dict[str, dict[str, str]] = {}
    after_counts = {}
    for page in PAGES:
        before_counts[page] = sum(
            len(obj["grammar_data"]) - 1 for obj in index[page]
        )
        for obj in index[page]:
            removed_fields = normalize_locked_fields(obj)
            if removed_fields:
                removed[obj["id"]] = removed_fields
            bank = allowed_fields(obj, sentence_bank(obj, index[page]))
            new_fields = {}
            for field, sentence in bank.items():
                if field not in prompt_fields or field in obj["grammar_data"]:
                    continue
                counterpart = PAIR_COUNTERPART.get(field)
                if counterpart and counterpart in obj["grammar_data"]:
                    continue
                sentence = re.sub(r"\s+", " ", sentence).strip()
                if target_present(field, sentence):
                    obj["grammar_data"][field] = sentence
                    new_fields[field] = sentence
            if new_fields:
                added[obj["id"]] = new_fields
        after_counts[page] = sum(
            len(obj["grammar_data"]) - 1 for obj in index[page]
        )

    if identity_snapshot(index) != before:
        raise SystemExit("Identity or bounding-box data changed during expansion")

    # Keep the editable JSON source and embedded file:// snapshot identical.
    for page in PAGES:
        json_index[page] = index[page]
    validate(index, prompt_fields, added)
    validate(json_index, prompt_fields, added)

    new_sentences = [s for fields in added.values() for s in fields.values()]
    duplicates = sum(count - 1 for count in Counter(new_sentences).values() if count > 1)
    duplicate_fields = Counter()
    for field in prompt_fields:
        field_sentences = [
            fields[field] for fields in added.values() if field in fields
        ]
        duplicate_fields[field] = sum(
            count - 1 for count in Counter(field_sentences).values() if count > 1
        )
    within_page_duplicates = 0
    for page_number in range(1, 11):
        prefix = f"p{page_number}_"
        page_sentences = [
            sentence
            for obj_id, fields in added.items() if obj_id.startswith(prefix)
            for sentence in fields.values()
        ]
        within_page_duplicates += sum(
            count - 1 for count in Counter(page_sentences).values() if count > 1
        )
    total_before = sum(before_counts.values())
    total_after = sum(after_counts.values())
    total_objects = sum(len(index[page]) for page in PAGES)
    print(f"Objects: {total_objects}")
    print(f"Grammar slots: {total_before} -> {total_after} (+{total_after-total_before})")
    print(f"New inferred sentences: {sum(len(v) for v in added.values())}")
    print(f"Removed identity-lock violations: {sum(len(v) for v in removed.values())}")
    print(f"Coverage: {total_before/(total_objects*len(prompt_fields)):.1%} -> "
          f"{total_after/(total_objects*len(prompt_fields)):.1%}")
    print(f"Exact duplicate new sentences: {duplicates}/{len(new_sentences)}")
    print(f"Exact duplicates within the same page: {within_page_duplicates}")
    print("Largest duplicate fields: " + ", ".join(
        f"{field}={count}" for field, count in duplicate_fields.most_common(8)
    ))
    for page in PAGES:
        count = len(index[page])
        print(f"{page}: {before_counts[page]} -> {after_counts[page]} "
              f"({after_counts[page]/(count*len(prompt_fields)):.1%})")

    if not args.apply:
        print("Dry run only. Re-run with --apply to write files.")
        return

    encoded_index = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    new_html = html[:index_match.start(1)] + encoded_index + html[index_match.end(1):]
    HTML_PATH.write_text(new_html, encoding="utf-8")
    JSON_PATH.write_text(
        json.dumps(json_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {HTML_PATH}")
    print(f"Wrote {JSON_PATH}")


if __name__ == "__main__":
    main()
