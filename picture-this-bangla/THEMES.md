# Themes (Picture This Bangla)

The **Themes** button in the top bar (shortcut **T**) narrows the deck to one theme. Cards keep their
deck order; Coach Me!, the games, "Card N of M" and go-to-card all work inside the chosen theme. The choice
is remembered in the browser, and `index.html?theme=food` opens a theme directly. A shared `?card=` link to
a card outside the remembered theme opens the whole deck.

- `card-themes.json` — the source: the theme list (id, emoji, English and Bangla names) and, for every card
  id, one or two theme ids (main theme first). Edit this file by hand.
- `card-themes.js` — generated from it by `python3 scripts/build_web.py` (also with `--audio-only`).
  The build warns about cards with no theme, unknown theme ids and entries for cards not in the deck.

Theme ids: talk, people, numbers, shopping, food, kitchen, home, body, clothes, getting-around, nature,
animals, actions, describing, culture, work, study.

For new cards (Codex): add `"<card-id>": ["<main theme>", "<optional second theme>"]` under `cards` in
`card-themes.json` and rebuild. A card left out still appears under All cards, just in no theme.
Add a new theme only when a group of cards fits none of the existing ones well.
