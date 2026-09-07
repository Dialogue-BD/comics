# Forest and Cream UI Audit

**Reviewed:** 7 September 2026  
**Coverage:** 27 public activity routes, desktop at 1280 × 800 and mobile at 390 × 844

## Design standard

The shared visual language uses forest green (`#103d21`) for navigation and primary action, warm cream (`#f4f1e6` / `#fffdf7`) for reading surfaces, gold (`#b9924f` / `#d2b978`) for emphasis, and near-black green (`#1d211c`) for text. Red and other activity colors remain when they carry meaning, such as the opposition team in Debate or the strawberry in the story activity.

The review targeted readable foreground/background pairs, visible keyboard focus, 44px mobile controls where practical, no horizontal page overflow, and a clear visual hierarchy that preserves the different teaching purpose of each activity. These checks support WCAG 2.1 AA goals; they are not a formal conformance claim.

## Route-by-route treatment

| # | Route | Activity identity and custom treatment | Result |
|---:|---|---|---|
| 1 | `/` | Cream catalogue with forest navigation, clearer active views, and larger controls | Pass |
| 2 | `/action-pictures/` | Image-first stage with forest HUD, gold random action, and readable gallery controls | Pass |
| 3 | `/ai-fluency/` | Existing workshop layout retained; shared gold keyboard focus added | Pass |
| 4 | `/american-fisherman/` | Immersive story reader with forest loading and navigation chrome | Pass |
| 5 | `/busy-pictures/` | Reversed from dark panels to cream learning panels with green actions and a gold cue banner | Pass |
| 6 | `/cross-cultural-coms/` | Light editorial scenario cards with forest primary actions | Pass |
| 7 | `/debate/` | Cream working canvas; government green and opposition red; all ten slideshow slides use dark text on pale surfaces | Pass |
| 8 | `/dialogue-comics-practice/` | Illustration-led guide retained; forest header links and darker instructional copy | Pass |
| 9 | `/discussion/` | Warm facilitation cards, forest actions, and accessible dark-gold emphasis | Pass |
| 10 | `/ecclesiastes/` | Forest-framed reader controls around the original visual story | Pass |
| 11 | `/emotions/` | Rebuilt masthead with one logo, cream inset, gold rule, readable date chip, and simplified mobile controls | Pass |
| 12 | `/good-bird/` | Cream text on the forest sequence board, light modals, and a compact two-row mobile mode switcher | Pass |
| 13 | `/guess-what/` | Projector-first forest stage with dark text on gold start and deck controls | Pass |
| 14 | `/hingsha/` | Forest-framed reader controls around the illustrated narrative | Pass |
| 15 | `/icebreakers/` | High-contrast question surface, gold language cue, and readable active theme chips | Pass |
| 16 | `/ielts-reading/` | Restrained academic cream/forest palette with stronger labels and focus states | Pass |
| 17 | `/join-community/` | Welcoming dark-forest community card with cream copy and clear actions | Pass |
| 18 | `/kindness-repentence/` | Forest reader chrome keeps attention on the visual sequence | Pass |
| 19 | `/mezban/` | Forest reader chrome supports the locally grounded visual story | Pass |
| 20 | `/mouse-strawberry/` | Cream labels on forest sequence areas, readable light modals, and compact mobile mode controls | Pass |
| 21 | `/narratives/` | Forest frame and cream instructional surfaces for action narration | Pass |
| 22 | `/north-end/` | Forest-framed reader controls around the photographic narrative | Pass |
| 23 | `/picture-this/` | Physical-card feel retained with forest tabletop controls and cream details | Pass |
| 24 | `/qr/` | Cream utility workspace with forest controls and gold progress accents | Pass |
| 25 | `/reflecting-listening/` | Calm cream listening surface with forest actions and dark-gold prompts | Pass |
| 26 | `/stories/` | Forest reading chrome keeps the wordless story visually dominant | Pass |
| 27 | `/whos-this/` | Forest classroom stage with restored cream card faces and dark readable card text | Pass |

## Verification performed

- Loaded every route at desktop and mobile sizes and confirmed the route-specific theme marker.
- Confirmed zero horizontal document overflow on all 27 routes at both sizes.
- Inspected visible text/background combinations and corrected low-contrast controls and instructional copy.
- Opened and visually checked the Debate classroom slideshow, including its bilingual team slide.
- Visually checked the targeted Busy Pictures, Emotions, Good Bird, Red Ripe Strawberry, Action Pictures, Guess What, Dialogue Comics, Discussion, Join Community, Icebreakers, and Who's This interfaces.
- Checked the shared layer with `git diff --check`.

## Practical follow-up

Text embedded in source illustrations is outside CSS contrast testing. A short projector check in the actual classroom and a VoiceOver or NVDA pass would complement this visual production audit before calling the collection formally WCAG conformant.

## Follow-up corrections

The post-review pass also corrected the Busy Pictures close control and teaching callouts; the home/QR slideshow play, timing, copy, and open controls; the Icebreakers light theme; the full Action Pictures gallery and canvas chrome; the Discussion Rooms token palette; and the Red Ripe Strawberry perspective selector. These six affected routes were rechecked at mobile and desktop widths with no horizontal document overflow.
