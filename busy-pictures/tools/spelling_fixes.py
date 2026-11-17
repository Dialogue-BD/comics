"""Spelling repairs for Busy Pictures sentences (added 2026-11-17).

The sentence generators produced ~170 kinds of misspelt verb forms: dropped
"e" ("provid", "danc"), wrongly doubled letters ("coverred", "openned"),
stray "e" ("opene", "sheltere"), regular endings on irregular verbs
("digged", "has writed") and a few typos ("wiht"). Students hear these read
aloud, so every tool repairs them on save: bp_data.save_index() runs
fix_index() over every object name and live main_* sentence.

Add a new misspelling to WORD_FIXES (or IRREGULAR for a wrong past form).
Hand rewrites of whole garbled objects live in repair_sentences.py.
"""

import re

# misspelt word -> correct word (lower case; capitals are preserved on use)
WORD_FIXES = {
    "admiting": "admitting",
    "advertis": "advertise",
    "announc": "announce",
    "answere": "answer",
    "answeres": "answers",
    "balanc": "balance",
    "balancs": "balances",
    "bordere": "border",
    "borderes": "borders",
    "bounc": "bounce",
    "bouncs": "bounces",
    "brightene": "brighten",
    "brightenes": "brightens",
    "buz": "buzz",
    "buzes": "buzzes",
    "choos": "choose",
    "communicat": "communicate",
    "communicats": "communicates",
    "controled": "controlled",
    "controling": "controlling",
    "captur": "capture",
    "capturs": "captures",
    "hik": "hike",
    "haves": "has",
    "cupcupboard": "cupboard",
    "hikked": "hiked",
    "hikking": "hiking",
    "hiks": "hikes",
    "coverred": "covered",
    "coverring": "covering",
    "crawle": "crawl",
    "crawles": "crawls",
    "creat": "create",
    "creats": "creates",
    "curle": "curl",
    "curles": "curls",
    "curv": "curve",
    "curvs": "curves",
    "cycl": "cycle",
    "cycls": "cycles",
    "danc": "dance",
    "dancs": "dances",
    "defecat": "defecate",
    "defecats": "defecates",
    "edg": "edge",
    "edgs": "edges",
    "enabl": "enable",
    "enabls": "enables",
    "ensur": "ensure",
    "ensurred": "ensured",
    "ensurring": "ensuring",
    "ensurs": "ensures",
    "enterred": "entered",
    "enterring": "entering",
    "exercis": "exercise",
    "explor": "explore",
    "explors": "explores",
    "fenc": "fence",
    "fencs": "fences",
    "flattene": "flatten",
    "flattenes": "flattens",
    "flickere": "flicker",
    "flickeres": "flickers",
    "flowere": "flower",
    "floweres": "flowers",
    "fluttere": "flutter",
    "forag": "forage",
    "foragged": "foraged",
    "forags": "forages",
    "gallope": "gallop",
    "gathere": "gather",
    "gatheres": "gathers",
    "gazzed": "gazed",
    "gazzing": "gazing",
    "glittere": "glitter",
    "glitteres": "glitters",
    "grazzing": "grazing",
    "hovere": "hover",
    "hoveres": "hovers",
    "hoverred": "hovered",
    "hoverring": "hovering",
    "idl": "idle",
    "idls": "idles",
    "imagin": "imagine",
    "imagins": "imagines",
    "improvs": "improves",
    "indicat": "indicate",
    "indicats": "indicates",
    "invit": "invite",
    "invits": "invites",
    "invitted": "invited",
    "liing": "lying",
    "listene": "listen",
    "littere": "litter",
    "loung": "lounge",
    "loungs": "lounges",
    "lowerred": "lowered",
    "lowerring": "lowering",
    "measur": "measure",
    "measurs": "measures",
    "nammed": "named",
    "namming": "naming",
    "nams": "names",
    "observ": "observe",
    "observs": "observes",
    "offerred": "offered",
    "offerring": "offering",
    "opene": "open",
    "openes": "opens",
    "openned": "opened",
    "openning": "opening",
    "operat": "operate",
    "operats": "operates",
    "ordere": "order",
    "orderred": "ordered",
    "patroled": "patrolled",
    "patroling": "patrolling",
    "pedall": "pedal",
    "possed": "posed",
    "possing": "posing",
    "provid": "provide",
    "provids": "provides",
    "puf": "puff",
    "pufs": "puffs",
    "queu": "queue",
    "queus": "queues",
    "releas": "release",
    "reliev": "relieve",
    "relievs": "relieves",
    "ripenned": "ripened",
    "ripenning": "ripening",
    "rollerblad": "rollerblade",
    "rollerblads": "rollerblades",
    "scampere": "scamper",
    "scamperes": "scampers",
    "scor": "score",
    "scorred": "scored",
    "scorring": "scoring",
    "scors": "scores",
    "scramb": "scramble",
    "scrambl": "scramble",
    "scrambls": "scrambles",
    "scrubing": "scrubbing",
    "servs": "serves",
    "sheltere": "shelter",
    "shelteres": "shelters",
    "shovele": "shovel",
    "snak": "snake",
    "snakked": "snaked",
    "snakking": "snaking",
    "snaks": "snakes",
    "snif": "sniff",
    "snifs": "sniffs",
    "squeez": "squeeze",
    "startl": "startle",
    "startls": "startles",
    "strid": "stride",
    "strids": "strides",
    "struming": "strumming",
    "struting": "strutting",
    "sunbath": "sunbathe",
    "sunbaths": "sunbathes",
    "swirle": "swirl",
    "swirles": "swirls",
    "tangl": "tangle",
    "towerred": "towered",
    "towerring": "towering",
    "travele": "travel",
    "typs": "types",
    "visitted": "visited",
    "visitting": "visiting",
    "wadded": "waded",
    "wadding": "wading",
    "wandere": "wander",
    "waterred": "watered",
    "waterring": "watering",
    "welcom": "welcome",
    "welcoms": "welcomes",
    "wiht": "with",
    "yapps": "yaps",
}

# wrong regular form -> (simple past, past participle)
IRREGULAR = {
    "beated": ("beat", "beaten"),
    "choosed": ("chose", "chosen"),
    "clinged": ("clung", "clung"),
    "digged": ("dug", "dug"),
    "doed": ("did", "done"),
    "haved": ("had", "had"),
    "rised": ("rose", "risen"),
    "sended": ("sent", "sent"),
    "shooted": ("shot", "shot"),
    "shrinked": ("shrank", "shrunk"),
    "spreaded": ("spread", "spread"),
    "stridded": ("strode", "stridden"),
    "strided": ("strode", "stridden"),
    "waked": ("woke", "woken"),
    "writed": ("wrote", "written"),
}

PERFECT_AUX = {"has", "have", "had", "hasn't", "haven't", "hadn't", "'s", "'ve"}
ADVERBS = {"already", "just", "never", "ever", "always", "not", "still", "also",
           "recently", "only", "now", "finally", "since"}

_WORD_RE = re.compile(r"[A-Za-z]+(?:'[a-z]+)?")


def _match_case(original, replacement):
    if original.isupper() and len(original) > 1:
        return replacement.upper()
    if original[:1].isupper():
        return replacement[:1].upper() + replacement[1:]
    return replacement


def fix_word(word):
    """Correct a bare verb or word (used for verb lists in the generators)."""
    lower = word.lower()
    if lower in WORD_FIXES:
        return _match_case(word, WORD_FIXES[lower])
    return word


def fix_text(text):
    tokens = list(_WORD_RE.finditer(text))
    out, last = [], 0
    for i, match in enumerate(tokens):
        word = match.group(0)
        lower = word.lower()
        replacement = word
        if lower in WORD_FIXES:
            replacement = _match_case(word, WORD_FIXES[lower])
        elif lower in IRREGULAR:
            past, participle = IRREGULAR[lower]
            # "Has the man ever written ...?" puts the subject between has and the verb.
            perfect = tokens[0].group(0).lower() in {"has", "have", "had"} and i > 0
            for j in range(i - 1, max(-1, i - 4), -1):
                previous = tokens[j].group(0).lower()
                if previous in PERFECT_AUX or previous.endswith("'ve"):
                    perfect = True
                    break
                if previous not in ADVERBS:
                    break
            replacement = _match_case(word, participle if perfect else past)
        out.append(text[last:match.start()])
        out.append(replacement)
        last = match.end()
    out.append(text[last:])
    return "".join(out)


def fix_index(index):
    """Repair names and live sentences in place. Returns the number of changes."""
    changed = 0
    for objects in index.values():
        for obj in objects:
            name = obj.get("name", "")
            fixed = fix_text(name)
            if fixed != name:
                obj["name"] = fixed
                changed += 1
            data = obj.get("grammar_data") or {}
            for key, value in list(data.items()):
                if key.startswith("main_") and isinstance(value, str):
                    fixed = fix_text(value)
                    if fixed != value:
                        data[key] = fixed
                        changed += 1
    return changed
