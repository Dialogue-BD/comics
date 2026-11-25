#!/usr/bin/env python3
"""Respell Bangla text for Edge TTS using scripts/edge_respell.json.

Edge reads some everyday words wrongly (কোন → "kono", কেন → "ken" ...).
edge_respell.json lists each problem word and the spelling Edge should be
given instead. Only the text sent to Edge changes: the cards, questions and
site keep the normal spelling.

    python3 scripts/edge_respell.py            # report which words/questions are affected
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LIST = os.path.join(HERE, "edge_respell.json")
BANGLA = "ঀ-৿"


def load_list():
    with open(LIST, encoding="utf-8") as f:
        return json.load(f).get("words", {})


def _pattern(word):
    # Whole word only: no Bangla letter or sign directly before or after.
    return re.compile(f"(?<![{BANGLA}]){re.escape(word)}(?![{BANGLA}])")


_RULES = None


def rules():
    global _RULES
    if _RULES is None:
        _RULES = [(w, _pattern(w), e["say"]) for w, e in load_list().items() if e.get("say")]
    return _RULES


def respell(text):
    """Return the text with every listed whole word replaced by its Edge spelling."""
    for _, pat, say in rules():
        text = pat.sub(say, text)
    return text


def hits(text):
    """Listed words that occur in the text as whole words."""
    return [w for w, pat, _ in rules() if pat.search(text)]


if __name__ == "__main__":
    import sys
    sys.path.insert(0, HERE)
    from edge_backup import load_deck
    from build_web import load_questions
    words = [it for c in load_deck()["cards"] for it in c["items"]]
    questions = [{"id": k, "label": t} for r in load_questions().values() for k, t in zip(r["ids"], r["questions"])]
    for kind, items in (("words", words), ("questions", questions)):
        found = [(it, hits(it["label"])) for it in items]
        found = [(it, h) for it, h in found if h]
        print(f"{len(found)} {kind} contain a listed word")
        for it, h in found[:12]:
            print(f"  {it['label']}  ->  {respell(it['label'])}")
        if len(found) > 12:
            print(f"  ... and {len(found) - 12} more")
