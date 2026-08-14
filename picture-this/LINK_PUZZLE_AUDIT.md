# Picture This link-puzzle semantic audit

Audit date: 2026-08-14

## Result

- Starting database: 303 puzzles across 101 cards
- Passing database: 135 puzzles across 84 cards
- Rejected: 168 puzzles
- Cards deliberately left without a link puzzle: 17

The audit favors puzzle quality over equal coverage. A card may contain zero to three
puzzles. No puzzle is added merely to reach a per-card quota.

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

## Examples rejected by the audit

- `fruit` for Grapes + Apple: Banana is also fruit.
- `sweet` for Chocolate + Donuts: several pictured fruits can also be sweet.
- `net` for Volleyball + Tennis Ball: a soccer ball can also be linked to a goal net.
- `money` for Wallet + Purse: a mobile phone can also be linked to payments and money.
- `pips` for Game Die + Domino Tile: playing cards also use suit pips.
- `water` for Bathtub + Showerhead: the washbasin, toilet, and faucet also use water.
- `wearable` for Sun Hat + Flip-Flops: a towel or sunscreen can reasonably be described
  as worn, so the clue does not force one pair.

## Examples retained or narrowed

- `four-sided`: Square + Diamond
- `handlebars`: Bicycle + Motorcycle
- `legumes`: Beans + Peanuts
- `tentacles`: Octopus + Jellyfish
- `cardio`: Treadmill + Exercise Bike
- `cruciferous`: Cabbage + Cauliflower
- `sun-protection`: Sun Hat + Sunscreen (narrowed from `sun`)
- `jaws`: Pliers + Wrench (narrowed from `gripping`)
- `waterproof`: Rain Boots + Umbrella (narrowed from `rain`)
- `locking`: Door Key + Deadbolt (narrowed from `security`)

## Cards with no passing puzzle

Weather, Zoo, Feelings, Bugs, Jobs, Getting Dressed, Space Travel, At the Library,
At the Museum, Bathroom Fixtures, Money and Banking, Construction Site, Board Games,
Emergency Room, Kitchen Appliances, Sports Equipment, and At the Pharmacy.

These cards remain fully usable in browsing and guessing modes. The link games draw
only from the audited global pool.

## Enforcement

`scripts/validate-link-data.mjs` now requires:

- an audited array of zero to three puzzles for every card;
- exactly two valid, distinct item indexes per puzzle;
- distinct clue words, accepted answers, and item pairs within a card;
- one-word or hyphenated-one-word clues and accepted answers;
- the `exclusive-among-six-v1` semantic-audit marker; and
- an explanation explicitly stating why the selected items are the only two matches.

The validator enforces the audit record and structural boundaries. Semantic judgment
still requires the adversarial six-item review described above.
