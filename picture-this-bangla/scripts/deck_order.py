#!/usr/bin/env python3
"""Keep the Bangla Picture This deck in teaching order (deck-order.json).

  python3 scripts/deck_order.py                 # reorder deck-data.js now, using deck-order.json
  python3 scripts/deck_order.py --source <Codex deck folder>   # same, reading new cards' deck_tier/deck_after
  python3 scripts/deck_order.py --check         # report cards missing from or extra in deck-order.json

scripts/build_web.py calls apply_order() whenever it rebuilds deck-data.js, so the
order survives every rebuild.

New cards: card.json carries
  "deck_tier": 1-5      (required; see DECK_ORDER.md for what each tier means)
  "deck_after": "<slug>" (optional; place the card straight after this card)
Without deck_after the card goes at the end of its tier. Without deck_tier it goes
at the very end of the deck and a warning is printed. deck-order.json is then
rewritten to include it, so its position stays fixed from then on.
"""
import argparse, glob, json, os, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # picture-this-bangla/
ORDER_PATH = os.path.join(HERE, "deck-order.json")
DECK_PATH = os.path.join(HERE, "deck-data.js")


def load_order():
    with open(ORDER_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_order(order):
    with open(ORDER_PATH, "w", encoding="utf-8") as f:
        json.dump(order, f, ensure_ascii=False, indent=1)
        f.write("\n")


def manifests_from(source):
    """slug -> card.json for every card in the Codex deck folder (empty if no source)."""
    found = {}
    if source:
        for p in glob.glob(os.path.join(source, "cards", "*", "card.json")):
            with open(p, encoding="utf-8") as f:
                c = json.load(f)
            found[c["slug"]] = c
    return found


def apply_order(cards, manifests=None, write=True):
    """Return cards (dicts with "id") in deck order; place and record any new cards."""
    manifests = manifests or {}
    order = load_order()
    entries = order["cards"]
    known = {e["id"] for e in entries}
    present = {c["id"] for c in cards}
    gone = [e["id"] for e in entries if e["id"] not in present]
    if gone:
        print("deck-order: dropping cards no longer in the deck:", gone)
        entries = [e for e in entries if e["id"] in present]
    for c in cards:
        if c["id"] in known:
            continue
        m = manifests.get(c["id"], {})
        tier, after = m.get("deck_tier"), m.get("deck_after")
        if after and any(e["id"] == after for e in entries):
            i = next(k for k, e in enumerate(entries) if e["id"] == after)
            entry = {"id": c["id"], "tier": tier or entries[i]["tier"]}
            entries.insert(i + 1, entry)
        elif tier in (1, 2, 3, 4, 5):
            last = max((k for k, e in enumerate(entries) if e["tier"] <= tier), default=-1)
            entries.insert(last + 1, {"id": c["id"], "tier": tier})
        else:
            print(f"deck-order: WARNING {c['id']} has no deck_tier in card.json; placed at the end of the deck")
            entries.append({"id": c["id"], "tier": 5})
        print(f"deck-order: placed new card {c['id']} (tier {entries[[e['id'] for e in entries].index(c['id'])]['tier']})")
    order["cards"] = entries
    if write:
        save_order(order)
    pos = {e["id"]: k for k, e in enumerate(entries)}
    return sorted(cards, key=lambda c: pos[c["id"]])


def read_deck_file():
    text = open(DECK_PATH, encoding="utf-8").read()
    head, rest = text.split("window.PTB_DECK = ", 1)
    deck_json, tail = rest.split(";\nwindow.PICTURE_THIS_GAME_DATA", 1)
    return head, json.loads(deck_json), "window.PICTURE_THIS_GAME_DATA" + tail


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", help="Codex deck folder (for new cards' deck_tier / deck_after)")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    head, deck, tail = read_deck_file()
    if a.check:
        ids = [c["id"] for c in deck["cards"]]
        listed = [e["id"] for e in load_order()["cards"]]
        print("missing from deck-order.json:", [i for i in ids if i not in listed])
        print("listed but not in the deck:", [i for i in listed if i not in ids])
        print("deck-data.js already in order:", ids == [i for i in listed if i in ids])
        return
    deck["cards"] = apply_order(deck["cards"], manifests_from(a.source))
    with open(DECK_PATH, "w", encoding="utf-8") as f:
        f.write(head + "window.PTB_DECK = " + json.dumps(deck, ensure_ascii=False, indent=1) + ";\n" + tail)
    print(f"deck-data.js: {len(deck['cards'])} cards in deck order; first: {deck['cards'][0]['id']}")


if __name__ == "__main__":
    main()
