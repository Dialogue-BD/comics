# Dialogue canonical brand assets

Assets copied from the private `Dialogue-BD/dialogue-brand-identity` repository at commit `0d3d194c9989715ecedeffb94ed27bff059fbae2`.

- `dialogue-logo.svg` and `dialogue-logo.png`: Primary Lockup, Studio Modern (`svg/02-Dialogue-Primary-Studio-Modern.svg` and `png/02-Dialogue-Primary-Studio-Modern.png`).
- `../favicon.svg` and `dialogue-logomark-d.svg`: 03A Breakout Concentric Logomark D, Full Color on Light (`brand_asset_matrix/03_Logomark_Monogram_D/svg/03A-Logomark-D-Color-On-Light-Transparent.svg`).
- `../favicon.png`, `../apple-touch-icon.png`: transparent PNG derivative of the canonical 03A mark, centered in a square canvas with reserved padding for icon legibility.
- `dialogue-logo-motion.json`: official `motion/01-Studio-Modern-Lockup-Intro-lottie.json`, the matching Studio Modern lockup animation. This is the original vector export, not a recreated effect.

The primary lockup is kept as a horizontal asset; UI styles use `object-fit: contain` and do not crop or circle-mask it.

## Automatic updates

`brand/source.json` defines the canonical repository, `main` branch, and selected
asset paths. The server checks GitHub on startup and every five minutes using the
Replit-managed GitHub connection. It downloads all selected assets from one
immutable commit before switching the complete in-memory snapshot, including
square PNG favicon and Apple icon derivatives. The tracked copies remain the
startup/offline snapshot; routine refreshes never modify tracked files.

Browser asset requests are revalidated, so old cache-version query strings do
not pin the served logo. Already open tabs get updated images on their next page
load. `/api/brand-status` reports the actual served commit, last successful check,
and any refresh error. GitHub failures retain the last verified snapshot and are
reported there and in server logs, not silently ignored.

The published app needs the same GitHub integration with read access to this
private repository. Production installs the Node dependencies before launch;
no Git checkout, image-generation service, or raw credentials are needed.

## Hover motion

All HTML pages receive a shared logo enhancement from the Python server, including
silent classroom pages and dynamically inserted hub logos. Animation data and the
local Lottie SVG player load only on hover or keyboard focus. The original static
logo remains the accessible fallback and the print version. Reduced-motion and
touch-only devices do not download the animation. The motion JSON participates in
the same atomic, five-minute repository refresh as the static branding.

The Lottie light SVG player and its MIT license are bundled in `brand/vendor/`.
Serving this browser asset must not depend on a deployed `node_modules` folder.
Mouse and pen hover events trigger playback directly, including on hybrid
devices; touch pointer events never start a download.
