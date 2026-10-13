# Design: Visual & Textual Communication

A self-contained Dialogue classroom activity for A2–B2 learners. Fifteen pairings teach design in pictures, prose, and poetry. The visual and written entry paths lead into the same lessons. Desktop places the mediums side by side; mobile alternates them in one scroll.

The existing fifteen graphic word animations are retained, including the refined divided-O CONTRAST, transparent green SPACE cutouts, geometric SHAPE, multi-texture TEXTURE, and type-anatomy Typography. Their source remains `tools/typographic-reveals.js` and `.css`.

## Two entry identities

The visual entry is a dark graphic-design studio with oversized sans-serif type, chartreuse accents, layered animated prints, and a gallery of the fifteen original concept graphics. The written entry is a tactile paper workspace with serif text on torn strips, handwritten annotations, moving sentence pieces, and a gallery of fifteen torn lesson sheets. Both use the same curriculum, progress records, support controls, and finale.

React renders these entry pages only. Locally bundled Lenis smooths wheel scrolling; GSAP manages reveals and subtle pointer motion; official React Bits SplitText, AnimatedContent, and SpotlightCard components supply headline, scroll, and card interactions. Phone touch scrolling remains native. Reduced motion displays the complete static page. Entry effects are removed when entering a lesson, and there are no CDN or remote runtime requests.

Component source and the exact dependency lock live in `ui/`. React Bits provenance and its MIT + Commons Clause license are retained in `ui/vendor/`; third-party notices are embedded in the final HTML. This app uses the components as part of its application, rather than distributing a component library.

## Paper craft and literary motion

An original generated photographic cotton-paper texture adds tactile parchment to the writing room; a procedural fibre texture gives the studio tinted paper. Lesson sheets, controls, vocabulary tiles, feedback, manuscript art, and gallery cards use paper edges, tabs, tape, and layered shadows. Projection mode retains its low-light palette.

All fifteen literary features now have distinct diagrams in `tools/literary-motion.js` and `.css`. Motion follows the technique: a long sentence travels before a short ending lands; diction changes atmosphere; a chiastic narrative folds around its central turn; repeated sounds ripple; pauses open space; verb forms align; related details gather; recurring openings create a cadence; removable filler lifts away. Genre diagrams distinguish sequence, cause, and supported claim. The subtext diagram literally reads between the printed lines, cycling three possible ghost thoughts rather than presenting one hidden meaning as certain.

Each lesson includes a readable example and a specific explanation beneath its motion. Pause/resume remains available. Offscreen diagrams pause, and reduced motion displays static diagrams; the three possible subtext readings appear together in the static version. The writing-room paper cards reuse these diagrams. Original visual word animations are unchanged.

The editable physical-material styling is `tools/physical-paper.css`. Torn silhouettes cast shadows through their enclosing pieces; hover/focus lifts the paper and changes its shadow, and a GSAP timeline aligns the hero sentence fragments. Readable printed prose stays intact. Handwritten annotations and ghost thoughts use locally embedded Caveat, with its SIL Open Font License preserved in `assets/CAVEAT-OFL.txt` and in the standalone HTML. `assets/paper-texture.png` is the original generated texture and is embedded once in the final page. No external fonts or texture requests occur at runtime.

The material direction was clarified by the user's reference to Allan Peters's physical cut-paper process. His [Target Spring project](https://www.petersdesigncompany.com/target-spring) describes its use of pattern, color, and an Exacto knife. This activity uses original textures, layouts, silhouettes, and literary diagrams.

Shape now uses five short B1 prose sentences, each on its own paper line from the start. GSAP Flip changes only the indentation: A–B–X–B′–A′. Afraid / not afraid and help / helped explicitly support the correspondence; the friend’s arrival is the turn. The game rebuilds the same five-sentence sequence. An optional Psalm 67 comparison shows five selected adapted clauses around the repeated blessing and praise terms, with verse references, omitted material identified, and links to the full passage. It is labelled as a selection and a supported concentric reading, rather than a quotation of the entire psalm. Previous Shape progress/awards remain; earlier tile drafts are replaced when the revised lesson is opened.

Alignment now teaches parallelism through Psalm 114:3–6, laid out as two four-line teaching stanzas. The accessible English adaptation is labelled and attributed, with links to the complete World English Bible passage and Mechon Mamre Hebrew text. Related water and land pairs become visible within each stanza; tapping a line marks its corresponding question or description across the stanzas. The second stanza changes description into direct questions, rather than merely duplicating wording. A matching game checks the four correspondences. A short optional comparison retains grammatical parallelism in everyday prose, and the attributed Lincoln excerpt remains available. Source anchors and interpretive qualifications are recorded in `research/psalm-114-parallelism.json`.

Diction now uses three repeatable semantic word-art transformations in `tools/diction-word-art.js` and `.css`: bright → radiant gains paper depth, colour, and rays; small → tiny contracts into a miniature; empty → deserted uses separated weathered-looking letter pieces. Each pair has an explanation and two context sentences, and the selected pair is saved. The Hear button follows the selected example. The original visual COLOR animation and the existing connotation game remain intact. Reduced motion shows the richer word without animation; the source/richer pair remains labelled. The writing-room Diction card reuses bright → radiant.

Balance now places a large two-dot colon beneath the balancing beam as its fulcrum. The sentence and game use “The room grew quiet: everyone had left,” where the second clause explains the first; the earlier semicolon example has been replaced. Sound & rhythm uses a paper musical staff, six note cues, and five resonating /s/ highlights, with a waveform reinforcing cadence. The score is a visual reading cue. The studio finale enforces a pale heading colour independently of the persisted lesson theme; its contrast is checked in both modes.

## Paired curriculum

| Visual | Prose feature | Main rewriting game |
|---|---|---|
| Line | Sentence length and variety | Connect clauses; follow a longer sentence with a short ending |
| Color | Diction and connotation | Choose words for a descriptive scene |
| Shape | Lexical chiasm in prose | Rebuild afraid → help → friend arrives → helped → not afraid |
| Texture | Sound and cadence | Build an alliterative description |
| Form | Subtext | Infer a possible meaning from dialogue and context |
| Space | Pauses and omission | Give a narrative pause its own paragraph |
| Typography | Emphasis and voice | Choose the stress that fits a contrast |
| Contrast | Antithesis and juxtaposition | Assemble opposed descriptions |
| Hierarchy | Information architecture | Order a main point, explanation, and example |
| Alignment | Poetic and grammatical parallelism | Match the returning questions to earlier images in two stanzas |
| Balance | Punctuation and sentence architecture | Put a colon between a statement and its explanation |
| Proximity | Paragraphing and cohesion | Group related descriptive sentences |
| Repetition | Anaphora, refrain, inclusio | Rebuild a memory sequence with a repeated opening |
| Simplicity | Concision | Remove filler while retaining the action and purpose |
| Function | Genre and purpose | Distinguish narrative, explanation, and argument |

The main writing bank uses original narrative, descriptive, and explanatory prose. It includes brief authentic excerpts from Dickens's *A Tale of Two Cities* and Lincoln's Gettysburg Address, with direct source links. These are examples of a technique rather than prompts to imitate a commercial message.

Each lesson has **See the idea → Change a choice → Play the redesign**. Paired vocabulary tiles reveal both sides together. Meaning experiments change the visual and textual examples. Rewriting games use taps, ordering, grouping, emphasis choices, paragraph-break placement, and keeping/removing tiles. Order games support desktop drag and drop, tap-to-build, and move buttons. No typed answer or self-report checkbox is required. Models are available; all navigation remains open. Checks match a stated task, not every possible valid way of writing.

The finale builds a short prose passage and displays its setting, action, and return as a visual diagram. It does not repeat the full learning map.

## Sources and supporting tools

The runtime embeds 22 intact example pages from Gareth David / TastyTuts's *Beginners guide to Graphic Design*. Pages retain attribution and can be enlarged and zoomed. Repetition, simplicity, and function lack visual example boards in that PDF, so those units use interactive teaching examples.

Fifteen recorded visual definitions and the final graphic-design definition are preserved, alongside the sixteen original foundation conversations: **32 embedded recordings**. Optional new prose playback uses an installed English browser voice; complete text is always available. No new prose recording is represented as produced studio audio.

The optional Word detective sections have been removed from all pairings. The core prose activities, paired vocabulary, original graphic word animations, and design tools remain available.

Color retains a digital HSL palette lab. Contrast retains a live sRGB contrast checker with WCAG source attribution. The visual/textual comparisons are teaching analogies: clause lengths need not match, font categories do not determine register, and subtext remains an inference.

## Coach, progress, and classroom use

Two related vector coach characters identify the entry paths. The bottom feedback sheet turns green on checked success and gives a specific clue on retry. It can be closed or dismissed with Escape; navigation never depends on passing a check. Text games award 10 XP and visual-evidence games 5 XP once each. Existing device records, awards, and drafts are retained. Explored means visited/finished, not certified proficiency.

Projection mode enlarges the teaching content. Reduced motion displays static final examples. QR join and activity taxonomy remain the main homepage's responsibility.

## Build and verify

The editable paired curriculum is `tools/pairings.json`; `tools/author_pairings.py` contains the authoring data, with the prose curriculum replacing the earlier notice-copy draft. The paired controller and styles are `tools/paired-lessons.js` and `.css`. `tools/build.py` embeds all media and data into the root `graphic-design-module.html`; there are no runtime fetch dependencies.

The committed `ui/dist` bundle lets the Python build work without installing npm dependencies. After changing the entry-page React or CSS source, rebuild it first:

```sh
npm --prefix graphic-design-module/ui ci
npm --prefix graphic-design-module/ui run build
```

Then rebuild the standalone page and verify:

```sh
python3 graphic-design-module/tools/author_pairings.py
python3 graphic-design-module/tools/build.py
node graphic-design-module/tools/check-pairings.cjs
node graphic-design-module/tools/check-entry-pages.cjs
node graphic-design-module/tools/check-literary-motion.cjs
node graphic-design-module/tools/check-chiastic-shape.cjs
node graphic-design-module/tools/check-parallel-poetry.cjs
node graphic-design-module/tools/check-diction-word-art.cjs
node graphic-design-module/tools/check-balance-resonance.cjs
```

The browser check covers all fifteen games, retry/success, one-time rewards, both entry paths, source zoom, phone layouts, saved records, reduced motion, the finale, tools, and offline file use. The test requires the local server on port 8766 and the bundled Playwright/Chrome paths in the script. `?qa=1` uses separate test storage to protect learner records.

The entry-page check additionally verifies both identities, all fifteen topic links, motion cleanup, saved entry/support state, desktop/390px/320px widths, reduced motion, and offline entry rendering.

Open `graphic-design-module.html` directly, or use the local preview server. For Replit, import the repository and serve that file. No ZIP packaging or external publishing has been performed.

Earlier versions are preserved in `revisions/full-learning-map-v3.html` and `revisions/foundation-bridge-v4.html`, with their corresponding source snapshots. Their broader workshops are outside this activity's current scope.
