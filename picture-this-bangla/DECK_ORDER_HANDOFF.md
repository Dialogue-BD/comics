# Handoff for Codex: placing new Bangla cards in teaching order

**From:** Tim (with Claude), 28 Nov 2026
**Applies to:** every new card in `/picture-this-bangla/` (the `source/` build and the `generate-picture-this-cards` skill as used for Bangla). The English deck is unchanged for now.

## 1. What changed

The Bangla deck is no longer in creation order. It now runs from what a newcomer to Bangladesh needs first to the most specialised vocabulary:

- `picture-this-bangla/deck-order.json` lists every card id with a **tier** (1–5), in teaching order.
- `scripts/build_web.py` now calls `scripts/deck_order.py → apply_order()` after it builds the card list. `deck-data.js` therefore always comes out in teaching order.
- Card numbers, `cards/NN-slug/` folders, `pages/NNN-*.jpg`, audio, label boxes and problem reports are **unchanged**. Keep numbering new cards in creation order exactly as before (301, 302, …). The number is an id, not a position.
- `DECK_ORDER.md` holds the tier definitions and the full current order.

**What you need to add:** each new card must say which tier it belongs to. Otherwise the build cannot place it and puts it at the very end, with a warning.

## 2. Two new card.json fields

```json
"deck_tier": 3,
"deck_after": "market-vegetables"
```

| Field | Required | Meaning |
|---|---|---|
| `deck_tier` | **yes**, an integer 1–5 | Which tier the card belongs to (section 4). The card goes at the **end** of that tier. |
| `deck_after` | no, a card slug | Put the card straight after this card. Use it for series and natural follow-ons, e.g. `counting-thirty-one-to-thirty-six` after `counting-twenty-five-to-thirty`, or a third fish card after `more-fish-from-the-market`. |

The first build that sees a new card places it and writes it into `deck-order.json`. From then on its position is fixed. Never renumber or reorder existing entries yourself unless Tim asks.

## 3. Changes to make

### 3a. `source/cards-*.txt`: two optional header fields

The card header line is currently `@title|alternate|slug|rationale`. Extend it to

```
@title|alternate|slug|rationale|tier|after
```

`tier` is required for every card that is **not yet in `deck-order.json`**. `after` is optional; leave the field out, or empty, when it isn't needed. Example:

```
@আরও কিছু সংখ্যা|৩১ থেকে ৩৬ গুনি|counting-thirty-one-to-thirty-six|Count on from thirty in everyday exchanges.|2|counting-twenty-five-to-thirty
```

### 3b. `source/build.py` → `load_cards()`

```python
parts = lines[0][1:].split('|')
title, alternate, slug, rationale = parts[:4]
card = dict(..., usefulness=rationale)          # as now
if len(parts) > 4 and parts[4].strip():
    card['deck_tier'] = int(parts[4])
if len(parts) > 5 and parts[5].strip():
    card['deck_after'] = parts[5].strip()
```

Validation to add, next to the existing asserts:

- `deck_tier`, when present, is an integer from 1 to 5.
- `deck_after`, when present, is the slug of an existing card.
- Every card whose slug is **not** in `deck-order.json` has a `deck_tier`. Read the file with `json.load`; ids are under `cards[*].id`. Fail the build with a clear message rather than relying on the end-of-deck fallback.

Make sure the fields survive into each `cards/NN-slug/card.json`. `render_pair()` writes the whole card dict, so they will, unless a step rebuilds the dict from a fixed list of fields; check `preserved_pair()`. Also update `EXPECTED_CARDS` as you already do.

### 3c. Then build as usual

```
python3 scripts/build_web.py --source <deck folder>
```

Expect lines such as `deck-order: placed new card <slug> (tier 2)`. Commit `deck-order.json` together with `deck-data.js`. To check without building: `python3 scripts/deck_order.py --check`. It lists cards missing from, or extra in, the order and confirms `deck-data.js` is in order.

### 3d. The skill (`generate-picture-this-cards`)

When the skill authors a Bangla card, have it:

1. Decide `deck_tier` (and `deck_after` when the card continues a series) **at authoring time**, alongside `usefulness`. Briefly record the reasoning in the work notes.
2. When planning a batch of new cards, prefer filling gaps in tiers 1–3 before adding more tier 4–5 sets, unless Tim asks for a specialist topic.
3. Add the two fields to the Bangla manifest template, and add a line to `references/card-spec.md` describing them. They have no effect on the English deck.

## 4. Choosing the tier

Judge by **when a newcomer living in Bangladesh actually needs the six words**, not by how basic the topic title sounds.

| Tier | Name | Use it for | Examples already in the deck |
|---|---|---|---|
| 1 | First days | Survival talk and essentials needed in the first days | greeting a neighbour, polite replies, "I don't understand", I/you/this/that, numbers 1–12, prices in taka, ordering food and water, asking for the toilet, paying, a rickshaw, simple directions, an address, today/tomorrow, close family, body, pain, urgent help |
| 2 | First weeks | Daily basics for running a household and getting about | home things and rooms, colours, hot/cold, big/small, more/less, tea and meals, market fruit and vegetables, telling the time, medicine, nearby shops, numbers to 30, renting, prayer times |
| 3 | First month | Everyday life in more depth | home parts, clothing, pantry and cooking, weather, getting around, common animals, body detail, housework, household problems, festivals, money beyond shopping |
| 4 | Settling in | Wider vocabulary once settled | specific markets (fish, spices, sweets, meat cuts), crafts and repairs, nature, customs, fine detail and precise description |
| 5 | Enrichment | Specialist, regional or occasional vocabulary | boats and river gear, sea and wild animals, stage, water fittings, desk and photo equipment |

Quick tests:

- **Would a newcomer be stuck without this in week one?** Then tier 1 or 2.
- **Would they meet it every week but manage without it at first?** Then tier 3.
- **Is it useful but specific to a trade, place or occasion?** Then tier 4.
- **Would most residents rarely say it?** Then tier 5.
- Single words before phrases, and objects before actions and concepts, when choosing between two tiers.
- Continuations of a series go one tier later at most, with `deck_after` pointing at the earlier card.

## 5. Acceptance check for every new Bangla card

1. Its `card.json` has `deck_tier`, and `deck_after` if it follows a series.
2. `build_web.py --source …` prints `placed new card …`, and `deck_order.py --check` reports nothing missing and the deck in order.
3. `deck-order.json` and `deck-data.js` are committed together.
4. In the browser, step through with Next and Prev and confirm the card appears where you expect. You can jump straight to it with `index.html?card=<slug>`.
