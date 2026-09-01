# Action Comic / GitHub Pages Site

A static website originally hosted on GitHub Pages, now running on Replit. Contains an interactive comic/image viewer at the root and multiple subpages (narratives, stories, ecclesiastes, and more).

## Stack
- Pure static HTML, images (JPG), audio (MP3), and PDFs
- Served by Python's built-in `http.server`

## Running
```
python server.py
```
Serves on port 5000.

## Structure
- `index.html` — root comic viewer (random image, pinch-to-zoom)
- `narratives/` — narrative image sets
- `stories/` — PDF story collection
- `ecclesiastes/` — audio + image pages
- `american-fisherman/`, `busy-pictures/`, `cross-cultural-coms/`, `ecclesiastes/`, `good-bird/`, `hingsha/`, `kindness-repentence/`, `mezban/`, `north-end/`, `reflecting-listening/`, `whos-this/` — additional subpages

## Custom Domain
To connect your own domain, publish the Replit app (Deploy) and configure the custom domain in the deployment settings.

## User Preferences
- Keep the repo structure as-is; do not reorganize files.
