#!/usr/bin/env python3
"""Author negative and question companions for the seven Busy Pictures tenses.

The browser never conjugates or negates a sentence.  This script writes two
complete, object-grounded utterances beside every existing ``main_*`` answer:

    main_present_continuous_negative
    main_present_continuous_question

and the equivalent pair for the other six tenses.  Questions use the visible
action/state named by the object's present-continuous answer.  Negatives use a
human-authored semantic contrast (moving versus staying still, watching versus
looking away, a fixed landmark moving versus remaining in place, and so on),
then state what the object actually does.  That avoids nonsensical mechanical
negation such as claiming that a visible mountain does not tower over a town.

Both data copies are updated because the standalone viewer reads the inline
``spatialIndex`` in index.html rather than fetching spatial_index.json.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from main_tenses import IRREG, STATIVE, past, pp, third


HERE = Path(__file__).resolve().parent
BUSY = HERE.parent
HTML_PATH = BUSY / "index.html"
JSON_PATH = BUSY / "spatial_index.json"

MAIN_FIELDS = (
    "main_simple_present",
    "main_present_continuous",
    "main_simple_past",
    "main_past_continuous",
    "main_present_perfect",
    "main_future_going_to",
    "main_future_will",
)

# ``main_tenses.ing`` intentionally has a very small CVC heuristic and the old
# corpus therefore contains a handful of forms such as "coverring".  New
# answers use the ordinary spelling while leaving the older source untouched.
ING_SPELLING = {
    "coverring": "covering",
    "towerring": "towering",
    "openning": "opening",
    "offerred": "offering",
    "entering": "entering",
}

BASE_TO_ING = {
    "be": "being",
    "die": "dying",
    "lie": "lying",
    "tie": "tying",
    "fly": "flying",
    "play": "playing",
    "say": "saying",
    "pay": "paying",
    "see": "seeing",
    "dye": "dyeing",
    "singe": "singeing",
    "age": "ageing",
    "open": "opening",
    "cover": "covering",
    "tower": "towering",
    "offer": "offering",
    "listen": "listening",
    "visit": "visiting",
    "happen": "happening",
    "enter": "entering",
    "water": "watering",
    "flower": "flowering",
    "answer": "answering",
    "imagine": "imagining",
    "observe": "observing",
}


def present_participle(verb: str) -> str:
    if verb in BASE_TO_ING:
        return BASE_TO_ING[verb]
    if verb.endswith("ie"):
        return verb[:-2] + "ying"
    if verb.endswith(("ee", "oe", "ye")):
        return verb + "ing"
    if verb.endswith("e"):
        return verb[:-1] + "ing"
    if (
        len(verb) <= 4
        and len(verb) >= 3
        and verb[-1] not in "aeiouwxy"
        and verb[-2] in "aeiou"
        and verb[-3] not in "aeiou"
    ):
        return verb + verb[-1] + "ing"
    return verb + "ing"


def inflect_phrase(phrase: str, form: str, plural: bool = False) -> str:
    verb, _, rest = phrase.partition(" ")
    if form == "base":
        head = verb
    elif form == "present":
        head = verb if plural else third(verb)
    elif form == "ing":
        head = present_participle(verb)
    elif form == "past":
        head = past(verb)
    elif form == "pp":
        head = pp(verb)
    else:
        raise ValueError(form)
    return head + ((" " + rest) if rest else "")


def load_inline() -> tuple[str, int, int, dict]:
    html = HTML_PATH.read_text(encoding="utf-8")
    start = html.index("var spatialIndex = ") + len("var spatialIndex = ")
    end = html.index("};", start) + 1
    return html, start, end, json.loads(html[start:end])


def identity(index: dict) -> list[tuple[str, str, str, tuple]]:
    return [
        (page, obj["id"], obj["name"], tuple(obj["box"]))
        for page, objects in index.items()
        for obj in objects
    ]


def candidate_verbs(index: dict) -> set[str]:
    verbs = set(IRREG) | set(STATIVE) | set(BASE_TO_ING)
    for objects in index.values():
        for obj in objects:
            data = obj.get("grammar_data", {})
            for field in ("future_will", "modals_ability", "future_going_to"):
                value = str(data.get(field, ""))
                match = re.search(r"(?:^|\b(?:will|can|to))\s+([a-z]+)\b", value, re.I)
                if match:
                    verbs.add(match.group(1).lower())
    verbs.update(
        "bank circle creak reverse smoke cook cool clean drift gleam glow "
        "brighten darken shrink sparkle observe imagine transport supply "
        "support provide protect inspect decorate organize socialise socialize "
        "reassure photograph practise practice".split()
    )
    return verbs


def reverse_ing_map(index: dict) -> dict[str, str]:
    result: dict[str, str] = {}
    for verb in candidate_verbs(index):
        result[present_participle(verb)] = verb
    # Corpus spellings emitted by the earlier generator also point back to the
    # correctly spelled base, so newly authored forms repair rather than repeat
    # them.
    result.update({"coverring": "cover", "towerring": "tower", "openning": "open"})
    return result


def fallback_base(word: str) -> str:
    if word in {"lying", "dying", "tying"}:
        return {"lying": "lie", "dying": "die", "tying": "tie"}[word]
    stem = word[:-3]
    if len(stem) >= 2 and stem[-1] == stem[-2]:
        stem = stem[:-1]
    return stem


def extract_visible_action(data: dict, reverse: dict[str, str]) -> tuple[str, bool, str, str, bool]:
    sentence = str(data["main_present_continuous"]).strip().rstrip(".!?")
    match = re.match(r"^(.+?)\s+(is|are)\s+([A-Za-z-]+ing)\b(.*)$", sentence, re.I)
    if not match:
        raise ValueError("Cannot read present-continuous answer: " + sentence)
    subject, auxiliary, raw_ing, rest = match.groups()
    raw_ing = raw_ing.lower()
    base = reverse.get(raw_ing, fallback_base(raw_ing))
    canonical_ing = ING_SPELLING.get(raw_ing, present_participle(base))
    plural = auxiliary.lower() == "are"
    passive = base == "be" and bool(rest.strip())
    return subject.strip(), plural, base, canonical_ing + rest, passive


STATIC_NOUNS = set(
    "building house shop cafe school station church castle tower bridge road street "
    "path pavement field pitch lawn garden hedge fence wall roof window door gate "
    "railing handrail staircase steps mountain peak hill valley river stream pond "
    "lake sky cloud sun moon tree bush bushes plant plants flower flowers grass forest "
    "sign signboard poster mural frieze shelf cabinet table bench chair sofa bed crate "
    "box basket planter pole post lamp chimney pipe drainpipe gutter awning balcony "
    "terrace platform track runway sand soil rock rocks stone stones hay bale bales "
    "curtain curtains carpet rug mat counter playground paddock".split()
)

PERSON_NOUNS = set(
    "man woman boy girl child children person people worker workers farmer farmers "
    "teacher teachers student students player players rider riders driver drivers "
    "couple family families mother father grandmother grandfather lady gentleman "
    "policeman police officer officers clown clowns cook cooks painter painters "
    "mechanic mechanics gardener gardeners customer customers visitor visitors".split()
)

ANIMAL_NOUNS = set(
    "dog dogs cat cats bird birds cow cows horse horses pony ponies sheep goat goats "
    "pig pigs chicken chickens hen hens rooster duck ducks goose geese rabbit rabbits "
    "frog frogs snail snails butterfly butterflies bee bees fish lion deer donkey "
    "mouse mice squirrel squirrels fox bear calf calves lamb lambs flock herd".split()

)

VEHICLE_NOUNS = set(
    "car cars van vans bus buses truck trucks lorry lorries taxi taxis train trains "
    "tram trams bicycle bicycles bike bikes motorcycle motorcycles scooter scooters "
    "helicopter helicopters aeroplane aeroplanes airplane airplanes boat boats ship ships".split()
)

WEARABLE_NOUNS = set(
    "boot boots shoe shoes hat hats cap caps coat coats jacket jackets shirt shirts "
    "dress dresses trousers shorts glove gloves sock socks scarf scarves helmet helmets".split()
)

POSTURE = set("stand sit lie lean rest wait sleep crouch kneel perch hide stay hang".split())
MOTION = set(
    "bank circle drift float fly glide hover run walk stroll hurry climb ride roll pull "
    "push trot turn swing reach follow drive steer cross swoop hop swim paddle sail "
    "waddle creep wander chase crawl dash soar jump skip spin flow slide rise fall".split()
)
OBSERVATION = set("look watch peer check read listen point inspect search observe peek peep".split())
FOOD = set("eat drink feed chew nibble graze cook grill pour".split())
SOCIAL = set("wave chat talk smile hug clap sing dance play call welcome help".split())
WORK = set("work fix cut sweep make dig clean paint build repair wash carry hold lift pick".split())
LIGHT = set("shine glow gleam sparkle brighten light".split())
GROWTH = set("grow bloom flower spread rise".split())
GERUND_NOUNS = set(
    "building ceiling flooring lighting painting crossing railing awning edging covering "
    "filling bedding clothing scaffolding parking landing".split()
)


def words(value: str) -> set[str]:
    return set(re.findall(r"[a-z]+", value.lower()))


def entity_kind(name: str, subject: str) -> str:
    # A location noun must not classify the located item: "football on the
    # sand" is a movable object, not scenery merely because "sand" appears.
    name_head = re.split(
        r"\b(?:in|on|under|beside|by|near|behind|above|below|at|across|along|between|inside|outside)\b",
        name,
        maxsplit=1,
        flags=re.I,
    )[0]
    vocabulary = words(name_head + " " + subject)
    if vocabulary & PERSON_NOUNS:
        return "person"
    if vocabulary & ANIMAL_NOUNS:
        return "animal"
    if vocabulary & STATIC_NOUNS:
        return "static"
    return "object"


def contrast_for(name: str, subject: str, action: str, plural: bool) -> str:
    """Select a plausible *different* predicate instead of negating the fact."""
    kind = entity_kind(name, subject)
    if kind == "static":
        return "move from their places" if plural else "move from its place"
    if action in POSTURE:
        return "move around"
    if action in MOTION:
        return "stay still"
    if action in OBSERVATION:
        return "look away"
    if action in FOOD:
        return "leave the food alone"
    if action in SOCIAL:
        return "stay quiet"
    if action in WORK:
        return "stand idle" if kind in {"person", "animal"} else "fail"
    if action in LIGHT:
        return "go dark"
    if action in GROWTH:
        return "shrink"
    if kind in {"person", "animal"}:
        return "stand idle"
    vocabulary = words(name + " " + subject)
    if vocabulary & VEHICLE_NOUNS:
        return "break down"
    if vocabulary & WEARABLE_NOUNS:
        return "wear out"
    return "fail"


SMALL_POSITION_NOUNS = set(
    "ball football book books toy toys tool tools cup cups plate plates bottle bottles "
    "boot boots shoe shoes shell shells stone stones hat cap bag bags box boxes parcel "
    "parcels phone phones key keys apple apples fruit fruits".split()
)


def prefer_label_fact(
    name: str,
    subject: str,
    plural: bool,
    base: str,
    ing_phrase: str,
    passive: bool,
    reverse: dict[str, str],
) -> tuple[str, str, bool]:
    """Prefer an action or location explicitly encoded in the visual label."""
    lowered = name.lower().strip()
    tokens = list(re.finditer(r"\b[a-z]+ing\b", lowered))
    for match in tokens:
        raw_ing = match.group(0)
        if raw_ing not in reverse or raw_ing in GERUND_NOUNS:
            continue
        label_base = reverse[raw_ing]
        if label_base == base:
            return base, ing_phrase, passive
        tail = lowered[match.end():].strip()
        label_ing = present_participle(label_base) + ((" " + tail) if tail else "")
        return label_base, label_ing, False

    # A prepositional tail in an object label is a particularly dependable
    # visual fact.  People and animals keep their more informative action.
    if entity_kind(name, subject) not in {"person", "animal"}:
        location = re.search(
            r"\b(in|on|under|beside|by|near|behind|above|below|at|across|along|between|inside|outside)\b.*$",
            lowered,
        )
        if location:
            head_words = words(lowered[:location.start()])
            position = "lie" if head_words & SMALL_POSITION_NOUNS else "sit"
            if entity_kind(name, subject) == "static" and not head_words & SMALL_POSITION_NOUNS:
                position = "stand"
            tail = location.group(0)
            return position, present_participle(position) + " " + tail, False

    return base, ing_phrase, passive


def lower_initial(value: str) -> str:
    return value[:1].lower() + value[1:]


def trim_time_bound_tail(ing_phrase: str) -> str:
    """Keep embedded present-time clauses out of past/future tense variants."""
    head, separator, rest = ing_phrase.partition(" ")
    if not separator:
        return ing_phrase
    rest = re.split(r"\s+\b(?:as|when|while|before|after|until|because)\b\s+", rest, maxsplit=1)[0]
    return head + ((" " + rest.strip()) if rest.strip() else "")


def continuation_subject(name: str, subject: str, plural: bool) -> str:
    if plural:
        return "they"
    vocabulary = words(name + " " + subject)
    if vocabulary & {"man", "boy", "father", "grandfather", "gentleman", "policeman"}:
        return "he"
    if vocabulary & {"woman", "girl", "mother", "grandmother", "lady"}:
        return "she"
    if entity_kind(name, subject) in {"animal", "object", "static"}:
        return "it"
    # Keep the descriptive noun phrase when presentation is ambiguous.
    return lower_initial(subject)


def replace_subject(sentence: str, subject: str, replacement: str) -> str:
    if sentence.startswith(subject + " "):
        return replacement + sentence[len(subject):]
    return lower_initial(sentence)


def clean(value: str, question: bool = False) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    value = value.rstrip(".!?") + ("?" if question else ".")
    return value[:1].upper() + value[1:]


def actual_clauses(subject: str, plural: bool, base: str, ing_phrase: str, passive: bool, static: bool) -> dict[str, str]:
    be, was, have = ("are", "were", "have") if plural else ("is", "was", "has")
    do_present = base if plural else third(base)
    # The tail begins with the complement after "being" for a passive action.
    if passive:
        complement = ing_phrase[len("being"):].strip()
        return {
            "main_simple_present": f"{subject} {be} usually {complement}",
            "main_present_continuous": f"{subject} {be} being {complement}",
            "main_simple_past": f"{subject} {was} {complement} earlier",
            "main_past_continuous": f"{subject} {was} being {complement} when the picture was taken",
            "main_present_perfect": f"{subject} {have} already been {complement}",
            "main_future_going_to": f"{subject} {be} going to be {complement} next",
            "main_future_will": f"{subject} will be {complement} later",
        }

    _, _, rest = ing_phrase.partition(" ")
    rest = (" " + rest) if rest else ""
    present_marker = "still" if static else "usually"
    past_marker = "still " if static else ""
    perfect_marker = "always " if static else "already "
    future_head = "continue to " if static else ""
    return {
        "main_simple_present": f"{subject} {present_marker} {do_present}{rest}",
        "main_present_continuous": f"{subject} {be} {ing_phrase}",
        "main_simple_past": f"{subject} {past_marker}{past(base)}{rest} earlier",
        "main_past_continuous": f"{subject} {was} {ing_phrase} when the picture was taken",
        "main_present_perfect": f"{subject} {have} {perfect_marker}{pp(base)}{rest}",
        "main_future_going_to": f"{subject} {be} going to {future_head}{base}{rest}",
        "main_future_will": f"{subject} will {future_head}{base}{rest}",
    }


def negative_clauses(subject: str, plural: bool, contrast: str) -> dict[str, str]:
    return {
        "main_simple_present": f"{subject} {'don\'t' if plural else 'doesn\'t'} {inflect_phrase(contrast, 'base')}",
        "main_present_continuous": f"{subject} {'aren\'t' if plural else 'isn\'t'} {inflect_phrase(contrast, 'ing')}",
        "main_simple_past": f"{subject} didn't {inflect_phrase(contrast, 'base')}",
        "main_past_continuous": f"{subject} {'weren\'t' if plural else 'wasn\'t'} {inflect_phrase(contrast, 'ing')}",
        "main_present_perfect": f"{subject} {'haven\'t' if plural else 'hasn\'t'} {inflect_phrase(contrast, 'pp')}",
        "main_future_going_to": f"{subject} {'aren\'t' if plural else 'isn\'t'} going to {inflect_phrase(contrast, 'base')}",
        "main_future_will": f"{subject} won't {inflect_phrase(contrast, 'base')}",
    }


def question_clauses(subject: str, plural: bool, base: str, ing_phrase: str, passive: bool, static: bool) -> dict[str, str]:
    be, was, have, do = ("Are", "Were", "Have", "Do") if plural else ("Is", "Was", "Has", "Does")
    if passive:
        complement = ing_phrase[len("being"):].strip()
        return {
            "main_simple_present": f"{be} {lower_initial(subject)} usually {complement}",
            "main_present_continuous": f"{be} {lower_initial(subject)} being {complement} right now",
            "main_simple_past": f"{was} {lower_initial(subject)} {complement} earlier",
            "main_past_continuous": f"{was} {lower_initial(subject)} being {complement} when the picture was taken",
            "main_present_perfect": f"{have} {lower_initial(subject)} ever been {complement}",
            "main_future_going_to": f"{be} {lower_initial(subject)} going to be {complement} next",
            "main_future_will": f"Will {lower_initial(subject)} be {complement} later",
        }

    _, _, rest = ing_phrase.partition(" ")
    rest = (" " + rest) if rest else ""
    present_marker = "still " if static else "usually "
    perfect_marker = "always " if static else "ever "
    future_head = "continue to " if static else ""
    return {
        "main_simple_present": f"{do} {lower_initial(subject)} {present_marker}{base}{rest}",
        "main_present_continuous": f"{be} {lower_initial(subject)} {ing_phrase} right now",
        "main_simple_past": f"Did {lower_initial(subject)} {'still ' if static else ''}{base}{rest} earlier",
        "main_past_continuous": f"{was} {lower_initial(subject)} {'still ' if static else ''}{ing_phrase} when the picture was taken",
        "main_present_perfect": f"{have} {lower_initial(subject)} {perfect_marker}{pp(base)}{rest}",
        "main_future_going_to": f"{be} {lower_initial(subject)} going to {future_head}{base}{rest}",
        "main_future_will": f"Will {lower_initial(subject)} {future_head}{base}{rest}",
    }


# These flagship examples were written line by line because their scene offers
# richer contrasts than any reusable semantic frame can capture.
HAND_AUTHORED = {
    "p1_obj_1": {
        "main_simple_present_negative": "The helicopter doesn't usually fly this close to the ridge after dark.",
        "main_simple_present_question": "Does the helicopter often circle the ridge before winter storms roll in?",
        "main_present_continuous_negative": "The helicopter isn't landing; it's banking sharply around the snowy mountain peak.",
        "main_present_continuous_question": "Is the helicopter banking around the snowy mountain peak right now?",
        "main_simple_past_negative": "The helicopter didn't land on the ridge; it flew over it twice before turning toward the valley.",
        "main_simple_past_question": "Did the helicopter fly over the ridge before turning toward the valley?",
        "main_past_continuous_negative": "The helicopter wasn't leaving the area; it was hovering near the peak when the climber waved.",
        "main_past_continuous_question": "Was the helicopter hovering near the peak when the climber waved?",
        "main_present_perfect_negative": "The helicopter hasn't landed yet; it has already dropped a rope to the ledge.",
        "main_present_perfect_question": "Has the helicopter dropped a rope to the ledge yet?",
        "main_future_going_to_negative": "The helicopter isn't going to fly away; it's going to land beside the chalet.",
        "main_future_going_to_question": "Is the helicopter going to land beside the chalet?",
        "main_future_will_negative": "The helicopter won't stay in the air forever; it will need more fuel before it flies back down.",
        "main_future_will_question": "Will the helicopter need more fuel before it flies back down?",
    },
    "p1_obj_2": {
        "main_simple_present_negative": "The snowy peak doesn't disappear when the sky is clear; it catches the last of the evening light.",
        "main_simple_present_question": "Does the snowy peak catch the last of the evening light?",
        "main_present_continuous_negative": "The snowy peak isn't fading into the background; it is towering over the whole valley.",
        "main_present_continuous_question": "Is the snowy peak towering over the whole valley?",
        "main_simple_past_negative": "The peak didn't lose all its snow when the valley thawed.",
        "main_simple_past_question": "Did the peak stay capped with snow after the valley thawed?",
        "main_past_continuous_negative": "The peak wasn't changing position while people passed below; it was defining the landscape.",
        "main_past_continuous_question": "Was the peak still defining the landscape while people passed below?",
        "main_present_perfect_negative": "The peak hasn't lost its snow cap; it has collected fresh snow overnight.",
        "main_present_perfect_question": "Has the peak collected fresh snow overnight?",
        "main_future_going_to_negative": "The peak isn't going to remain visible all afternoon; it is going to disappear behind cloud.",
        "main_future_going_to_question": "Is the peak going to disappear behind cloud this afternoon?",
        "main_future_will_negative": "The peak won't keep the same snow cap forever; it will lose snow as the season warms.",
        "main_future_will_question": "Will the peak lose some of its snow as the season warms?",
    },
}


def author_object(obj: dict, reverse: dict[str, str]) -> None:
    data = obj["grammar_data"]
    subject, plural, base, ing_phrase, passive = extract_visible_action(data, reverse)
    base, ing_phrase, passive = prefer_label_fact(
        obj["name"], subject, plural, base, ing_phrase, passive, reverse
    )
    ing_phrase = trim_time_bound_tail(ing_phrase)
    static = entity_kind(obj["name"], subject) == "static"
    contrast = contrast_for(obj["name"], subject, base, plural)
    actual = actual_clauses(subject, plural, base, ing_phrase, passive, static)
    negatives = negative_clauses(subject, plural, contrast)
    questions = question_clauses(subject, plural, base, ing_phrase, passive, static)

    for field in MAIN_FIELDS:
        # The correction clause keeps the negative true in the visible world.
        continuation = replace_subject(
            actual[field],
            subject,
            continuation_subject(obj["name"], subject, plural),
        )
        data[field + "_negative"] = clean(
            negatives[field] + ", but " + continuation
        )
        data[field + "_question"] = clean(questions[field], question=True)

    data.update(HAND_AUTHORED.get(obj["id"], {}))


def validate(index: dict) -> None:
    missing = []
    bad_questions = []
    bad_negatives = []
    for page, objects in index.items():
        for obj in objects:
            data = obj["grammar_data"]
            for field in MAIN_FIELDS:
                negative = data.get(field + "_negative", "")
                question = data.get(field + "_question", "")
                if not negative or not question:
                    missing.append((page, obj["id"], field))
                if question and not question.endswith("?"):
                    bad_questions.append((obj["id"], field, question))
                if negative and not re.search(
                    r"\b(?:isn't|aren't|wasn't|weren't|doesn't|don't|didn't|hasn't|haven't|won't)\b",
                    negative,
                    re.I,
                ):
                    bad_negatives.append((obj["id"], field, negative))
    if missing or bad_questions or bad_negatives:
        raise AssertionError(
            f"missing={len(missing)} bad_questions={len(bad_questions)} "
            f"bad_negatives={len(bad_negatives)}"
        )


def main() -> None:
    html, start, end, inline_index = load_inline()
    json_index = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    if identity(inline_index) != identity(json_index):
        raise SystemExit("Inline and JSON object identities differ; refusing to overwrite.")

    reverse = reverse_ing_map(inline_index)
    for objects in inline_index.values():
        for obj in objects:
            author_object(obj, reverse)
    validate(inline_index)

    encoded = json.dumps(inline_index, ensure_ascii=False, separators=(",", ":"))
    HTML_PATH.write_text(html[:start] + encoded + html[end:], encoding="utf-8")
    JSON_PATH.write_text(
        json.dumps(inline_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    objects = sum(len(items) for items in inline_index.values())
    print(f"Authored {objects * len(MAIN_FIELDS) * 2:,} stored tense forms for {objects:,} objects.")
    print("Validation passed: every negative is marked and every question ends with '?'.")


if __name__ == "__main__":
    main()
