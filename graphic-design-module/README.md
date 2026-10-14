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

Diction now uses three repeatable semantic word-art transformations in `tools/diction-word-art.js` and `.css`: bright → radiant gains paper depth, colour, and rays; small → tiny contracts into a miniature; empty → deserted uses separated weathered-looking letter pieces. Each pair has an explanation and two context sentences, and the selected pair is saved. The Hear button follows the selected example. The original visual COLOR animation remains intact; the new diction game repaints a scene with three word choices and a responding palette. Reduced motion shows the richer word without animation; the source/richer pair remains labelled. The writing-room Diction card reuses bright → radiant.

Balance now places a large two-dot colon beneath the balancing beam as its fulcrum. The sentence and game use “The room grew quiet: everyone had left,” where the second clause explains the first; the earlier semicolon example has been replaced. Sound & rhythm uses a paper musical staff, six note cues, and five resonating /s/ highlights, with a waveform reinforcing cadence. The score is a visual reading cue. The studio finale enforces a pale heading colour independently of the persisted lesson theme; its contrast is checked in both modes.

## Merged curriculum

The current app is the visual and technical base. Selected subtype coverage and interaction ideas from the supplied *Design Module Prototype.html* are adapted into structured content; its full source is preserved as a reference snapshot in `research/design-module-prototype.html`. Source-review findings and the prototype hash are in `research/prototype-merge-review.json`. The prototype was reviewed statically; its blocked local-file URL was not bypassed.

Every unit has a clear learning goal, **independent visual and written example galleries, three named lab states, and three short challenges**. The challenges are distributed through See the idea → Change a choice → Play the redesign:

1. **Notice:** interpret a real applied visual example, rather than recall a label.
2. **Manipulate:** match, order, group, repaint, stress, pause, or cut for a stated effect.
3. **Transfer:** apply the idea to a fresh short prose case.

The comparisons show an actual native diagram alongside a short text example. Reveal controls explain both features and highlight selected words where helpful. Guide pages remain intact, attributed, and zoomable. Named labs show specific choices and identify their effects; the original paired motion remains the opening teaching example.

| Visual / written pairing | Manipulation | Fresh case |
|---|---|---|
| Line / Sentence | Match described movement to straight, curved, and zigzag graphics | Build a sentence with an interruption |
| Color / Diction | Repaint a gathering through word chips and a live palette | Choose wording for an unsettling empty classroom |
| Shape / Document forms | Match six recognisable document templates | Choose a CV for experience, education, and contact details |
| Texture / Sound & rhythm | Sort phrases against rough and smooth surfaces | Choose wording for gentle boat movement |
| Form / Literary structure | Build a problem-to-outcome story arc | Find the centre of a lexical chiasm |
| Space / Silence | Give the final wait its own paragraph | Separate a final event for attention |
| Typography / Emphasis & voice | Move stress to the person being corrected | Emphasise the colour being corrected |
| Contrast / Antithesis | Assemble opposed descriptions | Find empty/full in matching clauses |
| Hierarchy / Information architecture | Order point, reason, and example | Build a fresh explanation about trees and shade |
| Alignment / Parallelism | Match Psalm 114 descriptions with returning questions | Repair a grammatical series |
| Balance / Punctuation | Place the colon between statement and explanation | Distinguish a colon's explanatory job from valid separate sentences and a comma splice |
| Proximity / Paragraphing & cohesion | Move riverside/boat sentence magnets into related groups | Group library/transport details beside visual cues |
| Repetition / Anaphora, refrain, inclusio | Rebuild a memory sequence with repeated openings | Select a returning river image for the close |
| Simplicity / Concision | Cut filler while preserving action and purpose | Reduce eleven words to three without losing present readiness |
| Function / Genre & purpose | Distinguish narrative, explanation, and argument | Choose a story-opening event |

The main writing bank uses original narrative, descriptive, explanatory, and argumentative prose. Brief authentic excerpts from Dickens and Lincoln remain attributed. Recognisable document templates, an original concrete poem, an Oulipo snowball, Psalm 114 stanzas, ghost subtext readings, semantic diction art, colon fulcrum, and musical resonance are specialised teaching anchors. The five-step lexical chiasm now belongs to Form’s underlying literary structures, with an indentation reveal that retains story order.

All controls have tap and keyboard alternatives. Ordering and sentence magnets support desktop drag and drop; order pieces also have move buttons. New word surgery starts with the whole sentence, crosses out removable pieces, calculates the real remaining word count, and removes visual clutter in its preview. Browser voice playback follows the selected lab or current word-chip sentence; complete text stays visible. No extended typed response or self-report completion checkbox is required.

Feedback checks the **stated purpose**. The Space gallery offers several context-supported subtext readings without treating one hidden meaning as guaranteed. Paragraph-break checks use an exact requested pacing goal. Punctuation feedback acknowledges a grammatical period while explaining why the task calls for a colon. Font, colour, and sound analogies are contextual teaching examples, rather than universal rules.

The finale still builds a short prose passage with its setting, action, and return diagram. A compact two-choice synthesis asks which organisation and pacing decisions serve that scene. It does not repeat the full learning map.

## Sources and supporting tools

The runtime embeds 22 intact example pages from Gareth David / TastyTuts's *Beginners guide to Graphic Design*. Pages retain attribution and can be enlarged and zoomed. Repetition, simplicity, and function lack visual example boards in that PDF, so those units use interactive teaching examples.

Fifteen recorded visual definitions and the final graphic-design definition are preserved, alongside the sixteen original foundation conversations: **32 embedded recordings**. Optional new prose playback uses an installed English browser voice; complete text is always available. No new prose recording is represented as produced studio audio.

The optional Word detective sections have been removed from all pairings. The core prose activities, paired vocabulary, original graphic word animations, and design tools remain available.

Color retains a digital HSL palette lab. Contrast retains a live sRGB contrast checker with WCAG source attribution. The visual/textual comparisons are teaching analogies: clause lengths need not match, font categories do not determine register, and subtext remains an inference.

## Coach, progress, and classroom use

Two related vector coach characters identify the entry paths. The bottom feedback sheet turns green on checked success and gives a specific clue on retry. It can be closed or dismissed with Escape; navigation never depends on passing a check. The notice and manipulation challenges award 5 XP each; the fresh-case challenge awards 10, once per challenge. New progress lives in a separate `pair.merged` record with stable challenge IDs. Earlier drafts, completion records, awards, and saved entry/support preferences are retained. A unit goal banner reports 0–3 practised challenges. The finale retains its passage award and adds a one-time 5 XP purpose check. Explored means visited/finished, not certified proficiency.

Projection mode enlarges the teaching content. Reduced motion displays static final examples. QR join and activity taxonomy remain the main homepage's responsibility.

## Build and verify

The original paired motion and prose anchors remain in `tools/pairings.json` and `tools/author_pairings.py`. The merged learning goals, comparisons, labs, and 45 challenges are authored in `tools/author_merged_curriculum.py` and emitted to `tools/merged-curriculum.json`. `tools/prototype-examples.json` is a static authoring reference. `tools/merged-curriculum.js` and `.css` extend the shared lesson shell and interaction controls; the earlier paired controller remains the routing, source, and migration base. `tools/build.py` embeds all media and data into the root `graphic-design-module.html`; there are no runtime fetch dependencies.

The committed `ui/dist` bundle lets the Python build work without installing npm dependencies. After changing the entry-page React or CSS source, rebuild it first:

```sh
npm --prefix graphic-design-module/ui ci
npm --prefix graphic-design-module/ui run build
```

Then rebuild the standalone page and verify:

```sh
python3 graphic-design-module/tools/author_pairings.py
python3 graphic-design-module/tools/author_merged_curriculum.py
python3 graphic-design-module/tools/build.py
node graphic-design-module/tools/check-merged-curriculum.cjs
node graphic-design-module/tools/check-entry-pages.cjs
node graphic-design-module/tools/check-literary-motion.cjs
node graphic-design-module/tools/check-chiastic-shape.cjs
node graphic-design-module/tools/check-parallel-poetry.cjs
node graphic-design-module/tools/check-diction-word-art.cjs
node graphic-design-module/tools/check-balance-resonance.cjs
```

The merged browser check covers all 45 challenges, 199 independent gallery examples, and 45 named lab states; purpose-based retries; context-supported subtext readings; precise paragraph breaks; actual word counts; sentence/palette/speech agreement; native drag and keyboard controls; one-time rewards; preserved records; both entry paths; guide zoom; the finale; phone layouts; and reduced-motion offline use. The specialist motion and entry suites retain their existing assertions with the new game selectors. `check-pairings.cjs` forwards to the merged integration suite for compatibility. The test requires the local server on port 8766 and the bundled Playwright/Chrome paths in the script. `?qa=1` uses separate test storage to protect learner records.

The entry-page check additionally verifies both identities, all fifteen topic links, motion cleanup, saved entry/support state, desktop/390px/320px widths, reduced motion, and offline entry rendering.

Open `graphic-design-module.html` directly, or use the local preview server. For Replit, import the repository and serve that file. No ZIP packaging or external publishing has been performed.

Earlier versions are preserved in `revisions/full-learning-map-v3.html` and `revisions/foundation-bridge-v4.html`, with their corresponding source snapshots. Their broader workshops are outside this activity's current scope.

## Classroom review

Interface and goal-specific checks verify the authored cases, but they do not establish learning outcomes. A short B1 learner trial is still useful: ask learners to describe the effect before revealing the definition, then try the fresh-case challenge. Note whether the paired analogy helps them explain a choice in their own words.


The example galleries now select each medium independently. `tools/author_effects.py` authors 91 visual uses and 108 written demonstrations; `tools/effects-curriculum.json` supplies labels, purposes, concrete examples, and feature notes. `tools/document-forms.js` and `tools/writing-effects.js` draw the actual written operation. The Shape gallery includes letter, haiku and limerick templates, CV, advertisement, newspaper and scientific articles, dramatic dialogue, an original concrete leaf poem, and an Oulipo snowball. Placeholder typography demonstrates layout, not syllables, rhyme, or metre.

`tools/render_effect_clips.py` reproducibly renders 71 adapted guide crops from the supplied PDF. `tools/effect-clips.json` records source page, normalized crop bounds, compositing, and treatment. Monochrome diagrams become transparent green ink; colour wheels and palettes lose the page background while retaining internal white markings; photographs retain detail and blend with the paper surface. Picture captions and the lesson footer credit Gareth David / TastyTuts. The 22 full guide pages remain available for inspection. Repetition, simplicity, and function use original diagrams because the guide provides no example boards for them.

Regenerate in this order: `author_effects.py`, `author_merged_curriculum.py`, `render_effect_clips.py`, then `build.py`. The crop renderer requires Pillow and Poppler. It accepts optional crop IDs for selective regeneration. The built HTML embeds all data, images, and recordings. The new gallery checks exercise every selection and feature reveal at 320px, captions, independent selections, pause persistence, reduced motion, the snowball rule, and migration of old Shape drafts and awards. Challenge regression still covers all 45 short challenges. Historical Shape test entry forwards to the replacement gallery suite. `check-literary-structure.cjs` covers Form’s relocated five-step chiasm, its smooth indentation and pause, Space’s subtext, and preservation of earlier Form awards.

The literary mapping distinguishes visible document Shape, underlying narrative Form, and Space as pauses, omissions, and implications. Form now teaches six underlying structures. Space has fourteen examples, including the six former subtext examples. Changed Form challenges use new IDs; their old drafts and practised flags are archived while previous awards remain.

`check-progress-migration.cjs` seeds partial older Form and Shape records, verifies the lessons render, and checks that first-visit migration persists through reload without duplicating archive records or removing prior drafts, notice progress, or awards. Missing legacy fields are filled individually.
