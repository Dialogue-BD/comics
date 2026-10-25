# Dialogue canonical brand assets

Assets copied from the private `Dialogue-BD/dialogue-brand-identity` repository at commit `a53d0612808cd1923b0207ec7feebd148f4f49a8`.

- `dialogue-logo.svg` and `dialogue-logo.png`: Primary Lockup, Studio Modern (`svg/02-Dialogue-Primary-Studio-Modern.svg` and `png/02-Dialogue-Primary-Studio-Modern.png`).
- `../favicon.svg` and `dialogue-logomark-d.svg`: 03A Breakout Concentric Logomark D, Full Color on Light (`brand_asset_matrix/03_Logomark_Monogram_D/svg/03A-Logomark-D-Color-On-Light-Transparent.svg`).
- `../favicon.png`, `../apple-touch-icon.png`: transparent PNG derivative of the canonical 03A mark, centered in a square canvas with reserved padding for icon legibility.

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
private repository. Production installs the two Node dependencies before launch;
no Git checkout, image-generation service, or raw credentials are needed.
