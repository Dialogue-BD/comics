# Picture This link-puzzle semantic audit

Audit date: 2026-08-14

## Result

- Passing database: 303 puzzles across 101 cards
- Required coverage: exactly 3 puzzles on every card
- Cards below the required coverage: 0

The first audit retained 135 existing puzzles and identified 168 missing or weak puzzle
slots. Those slots were then authored or rewritten against the six pictured items. The
deck is not considered complete unless all 101 cards pass with exactly three puzzles.

## Passing rule

A clue passes only when its ordinary classroom meaning selects exactly the nominated
two items among the six items on that card.

For every clue, the audit asks:

1. Does the word naturally and directly fit both selected items?
2. Could a student reasonably use the same word to defend any of the other four?
3. Do all accepted answer variants preserve the same two-item boundary?
4. Is the connection intrinsic, taxonomic, functional, or a direct object relationship,
   rather than a broad setting, incidental possibility, or long chain of association?
5. Can the explanation state why these are the *only two* matching items without adding
   a hidden qualification that is absent from the displayed clue?

If question 2 is yes, or any other answer is doubtful, the puzzle fails.

## Common failure patterns checked by the audit

- `fruit` for Grapes + Apple: Banana is also fruit.
- `sweet` for Chocolate + Donuts: several pictured fruits can also be sweet.
- a broad `net` clue for Volleyball + Tennis Ball: a soccer ball can also be linked to
  a goal net; the final clue is `courts`, which selects the two court sports shown;
- `money` for Wallet + Purse: a mobile phone can also be linked to payments and money.
- a broad `pips` clue for Game Die + Domino Tile: playing cards also use suit pips; the
  final clue is `dots`, which excludes the playing cards' suit symbols;
- any hyphenated pseudo-word such as `sun-protection` or `goal-scoring`: punctuation
  cannot be used to disguise a phrase as the required single word;
- `water` for Bathtub + Showerhead: the washbasin, toilet, and faucet also use water.
- `wearable` for Sun Hat + Flip-Flops: a towel or sunscreen can reasonably be described
  as worn, so the clue does not force one pair.

## Examples retained or narrowed

- `quadrilaterals`: Square + Diamond
- `handlebars`: Bicycle + Motorcycle
- `legumes`: Beans + Peanuts
- `tentacles`: Octopus + Jellyfish
- `cardio`: Treadmill + Exercise Bike
- `cruciferous`: Cabbage + Cauliflower
- `ultraviolet`: Sun Hat + Sunscreen (replaces the over-broad `sun`)
- `jaws`: Pliers + Wrench (narrowed from `gripping`)
- `waterproof`: Rain Boots + Umbrella (narrowed from `rain`)
- `locking`: Door Key + Deadbolt (narrowed from `security`)

## Enforcement

`scripts/validate-link-data.mjs` now requires:

- exactly three audited puzzles for every card;
- exactly two valid, distinct item indexes per puzzle;
- distinct clue words, accepted answers, and item pairs within a card;
- uninterrupted one-word clues and accepted answers containing no punctuation;
- the `exclusive-among-six-v1` semantic-audit marker; and
- an explanation explicitly stating why the selected items are the only two matches.

It also verifies a deck-wide total of three times the card count (currently 303). The
validator enforces the audit record and structural boundaries. Semantic judgment still
requires the adversarial six-item review described above.
