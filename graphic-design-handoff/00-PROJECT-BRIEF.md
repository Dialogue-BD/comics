# PROJECT BRIEF: English for Freelancers — Graphic Design Module

## What you're building

An interactive web-based learning module: a **graphic design crash course that teaches English at the same time**. The audience is Bangladeshi university graduates (Rajshahi) learning professional English for freelance/remote work. They are ESL learners, not native speakers. Many have laptops and internet but cannot afford paid software.

**The core pedagogical insight:** graphic design is *inherently* comprehensible input for language learning. You don't explain "serif" — you show it. You don't define "hierarchy" — you show the before and after. The visual does the teaching; the English just labels what the student already sees.

## What to build

A single-file static web app (HTML/CSS/JS, no build step, deployable to a static site). Projection-optimized for classroom use, mobile-friendly, with a QR-join header. Dialogue-branded (see brand book). React-bits style animations: scroll-triggered reveals, hover states, smooth transitions, tap-to-reveal vocabulary.

**Structure:** hub with 7 standalone sections, usable in any order:

1. **Typography** — serif vs sans-serif, type anatomy (serif, baseline, x-height, ascender, descender, counter, bowl, stem), font pairing. Side-by-side visual comparisons.
2. **Color** — color theory (primary/secondary/tertiary, warm/cool, monochromatic/analogous/complementary/triadic), contrast checker (interactive), palette building, mood.
3. **Layout & Composition** — visual hierarchy, whitespace, alignment, balance, proximity, repetition, simplicity. Before/after sliders.
4. **Client Communication English** — phrase bank built from REAL freelancer-client conversations (in `reference/` — adapt, don't invent). "The client says X, you respond Y." Handling "make it pop," pushing back politely, presenting options.
5. **GenAI Media Creation Toolkit** — cheapest, easiest, best AI tools across the full media stack: image, music, TTS/voiceover, sound effects, video, motion graphics, animation, typography, Canva AI features. Free-tier availability in Bangladesh is the deciding factor. For each: what it does, when a designer uses it, what it costs.
6. **Visual Communication — The Pixar Lens** — lighting, color, perspective, and SHAPE LANGUAGE (circles = friendly, squares = stable, triangles = dynamic) as communication. Same scene in different lighting = different meaning. Culture shapes design: color symbolism varies (white = purity/mourning, red = luck/danger), and reading direction shapes layout (LTR vs RTL — eye-tracking mirrors; critical for Gulf clients). Frame: Bangladesh is a high-context culture — students already read images all day. "You already read images. Now learn to make them."
7. **AI Generation ≠ Design** — the human judgment layer. "Spot the problem" exercises: AI-generated designs with subtle flaws to identify and fix. The durable skill: AI is the tool, design is the thinking.

## Design rules (non-negotiable)

1. **Integration over isolation.** Every section touches English + freelancing + tech tools + AI literacy + durable skills simultaneously. Never teach a skill in a vacuum.
2. **Comprehensible input.** Visual first, English label second. Tap-to-reveal vocabulary throughout.
3. **"This gets me hired" payoff visible.** Every section must answer: how does this win me a client?
4. **Lucide icons only.** No emojis in the tag/UI system.
5. **No machine-translated Bangla.** Any Bangla text must be flagged for native-speaker review. English-first is fine.

## Reference materials (in this package)

- `spec-sheet.md` — full specification with all sections, vocabulary lists, and adaptation notes
- `brand/dialogue-brand-book.pdf` — colors (forest/gold/paper), typography, logo usage
- `reference/guides/beginners-guide-graphic-design.pdf` — 45-episode theory spine (7 visual elements + 8 design principles). Adapt: UK employment → freelance, Adobe → free tools, pre-AI → AI-era. See spec-sheet "Adaptation Notes."
- `reference/guides/graphic-design-jobs.pdf` — 11 design specializations. Add freelance-demand annotations (which have real remote demand).
- `reference/comprehensible-input-slides/` — 37 slides. THE core pedagogy reference. Each word IS its visual definition (LINE made of lines, SPACE with negative space, BALANCE on a fulcrum). Recreate as tap-to-animate web interactives.
- `reference/famous-brand-logos/` — SVG logos (Nike, Apple, McDonald's, Coca-Cola, Amazon, Google, Microsoft, Toyota, Mercedes, Adidas, Samsung, Facebook) + the original ESL worksheet. Use for the logo analysis speaking activity.
- **NOT included (Google-native, in owner's Drive):** "Pixar in a Box — Art of Storytelling Notes" doc, "English for Graphic Design" Classes #4–6 slides, "Develop ESL Curriculum for Graphic Design Freelancers" doc. Ask the owner if you need these.

## Context on the owner

Tim Hall — expat ESL teacher, 10+ years in Rajshahi, Bangladesh. Runs Dialogue Language Center and the PSDP (Professional Skills Development Program). He builds classroom web activities himself and deploys to dialogue-bd.com. He will review your output critically and red-pen it. He prefers plain, direct communication. He does not want AI-jargon, doom-and-gloom framing, or generic advice — everything must be grounded in his students' reality.

## Deliverable

A single self-contained HTML file (inline CSS/JS, Lucide via inline SVG, Google Fonts allowed). No external API calls. Must work offline after first load. Name it `graphic-design-module.html`.
