# Card manifest

Create one UTF-8 JSON file with this shape:

```json
{
  "title": "At the Beach",
  "slug": "at-the-beach",
  "band_color": "auto",
  "seed": "at-the-beach-v1",
  "items": [
    {
      "label": "Beach Ball",
      "description": "a colorful inflatable beach ball",
      "image": "assets/beach-ball.png",
      "chroma_key": "#00ff00"
    }
  ],
  "questions": [
    "Which items on the card would you take to the beach? Why?"
  ]
}
```

## Field rules

- `title`: 2–32 visible characters; category wording, not an instruction.
- `slug`: lowercase letters, digits, and hyphens only; unique within a deck.
- `band_color`: `auto`, `blue`, `green`, `orange`, or `red`.
- `seed`: optional stable string controlling label order and standalone color selection.
- `items`: exactly six objects.
  - `label`: unique, title-cased, ideally 1–3 words.
  - `description`: concrete visual wording for ImageGen; do not include layout instructions here.
  - `image`: path relative to the manifest.
  - `chroma_key`: normally `#00ff00`; use `#ff00ff` when green is important or the subject is broadly multicolored. Ensure the subject description does not require the chosen key-color family.
- `questions`: exactly six learner-facing questions. See `question-writing.md`.

The build output normalizes the manifest by adding `label_order`, resolving the footer color, and copying the cutouts into its own `assets/` folder.
