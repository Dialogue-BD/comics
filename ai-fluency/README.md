# AI Fluency Lab

Six modular 45-minute lessons for B1–B2 Bengali university students, designed for projection or pairs sharing one phone. Served as a static subpage at `/ai-fluency/`; linked from the existing activity launcher. No package installation, AI key, backend, or database change is required.

## Workflows and English outcomes

| Workflow | English outcome | Concrete result |
| --- | --- | --- |
| CV | Precise past-tense achievement verbs | Corrected fictional CV |
| Opportunity research | Evidence, attribution, and uncertainty | Comparison and verification plan |
| Application email | Polite indirect questions | Placement enquiry |
| Document creation | Ordered instructions and conditionals | Volunteer briefing with unresolved facts visible |
| Image creation | Observable visual descriptions and purpose clauses | Illustrated poster with accurate editable overlay text |
| Vibe coding | Input / expected / actual bug reports | Flawed and corrected interactive calculators |

Each lesson starts with a five-minute, six-slide in-page introduction, followed by 40 minutes of guided activities. The deck demonstrates objectives, deliverables, the four Ds, the three Ps, and the pair routine using the selected case. It is an interactive teaching deck, not a downloadable PowerPoint.

## Visual learning sequence

1. See the goal (3m): choose between visible document examples and build three success criteria.
2. Place the jobs (4m): tap Human, AI draft, or Human + AI; each job moves into the work plan.
3. Build the brief (5m): Product (what to make), Process (how to work), and Performance (how AI behaves), with short contextual choices and a live message preview.
4. Compare evidence (7m): a replayable perspective/attention demonstration connects skimming, scanning, and close comparison. The learner taps an output phrase and chooses Supported, Changed meaning, or No evidence. Matched highlights show the specific evidence. Alternative valid error locations are accepted.
5. Repair and say it (5m): select a factual correction, then assemble four sentence chunks and practise aloud.
6. Check before use (3m): resolve privacy, transparency, and release decisions. An unfinished document stays on HOLD.
7. New situation (8m): guided transfer first; optional editable wording after success.
8. Your results (5m): the learner uses the built speaking support, points to evidence, and downloads a learning record.

The first six activity screens have no open-ended writing task. Short instructions, worked examples, input choices, visual feedback, built sentences, and optional device speech precede independent language production. Stamps show completed actions; they do not certify proficiency. Spoken-practice buttons are explicitly self-report. Teacher assessment keeps AI judgement and English separate.

## Interface and state

- Start here opens the onboarding deck; `/ai-fluency/#cv/start` opens it directly. For an activity use a link such as `#cv/4` or `#image/4`.
- Familiar ChatGPT, Claude, and Gemini styles show the same scripted conversation. There is no live AI generation, microphone recording, or real file upload.
- The scanning demo uses CSS perspective and animated attention over real, selectable HTML evidence. Manual step controls, pause/replay, and reduced-motion support provide the same teaching content without animation. No WebGL dependency is required.
- Keyboard-accessible buttons work on phones without drag-and-drop. Desktop/classroom layouts place source and output together; narrow screens stack them closely.
- Learning state is stored per workflow in tab-local sessionStorage when available. Switching workflows preserves work. Restart affects only the selected workflow.
- Listen uses device speech synthesis if available. It sends no app-generated network request; voice availability depends on the device/browser. A visible sentence remains available without audio.
- The coding case retains intentionally flawed and corrected local calculators. No student text is executed as code.
- Classroom navigation is not synchronised with student devices. Core interactions need no network after static assets load; a fresh visit still requires the files.
- The teacher guide and learning records are UTF-8 text. Poster/code outputs are page artifacts; no Word or image export is claimed.

## Maintenance and checks

`visual-data.js` contains six compact visual cases and exact comparison anchors. `visual-lessons.js` provides the guided activity engine and onboarding deck. `app.js` owns navigation, shared chat/artifact helpers, timers, storage, and downloads. `core.js` owns escaped text and the calculator. `workflows.js` retains the full original cases and revised artifacts as reference/extension material. `visual.css` defines the visual teaching surfaces.

Run `node ai-fluency/build-guide.cjs` after content edits, then `node ai-fluency/validate.cjs`. The latter executes the event handlers in a non-browser harness; it checks all teaching slides/activity views, state, scoring, alternatives, sentence construction, data escaping, and calculator edge cases. It does not constitute browser visual QA or classroom learner testing. The page is static and needs no build dependencies.

## Sources and attribution

Primary framework: Rick Dakan, Joseph Feller, and Anthropic, [AI Fluency overview](https://www.anthropic.com/ai-fluency/overview). Supplied framework and career-planning transcripts, the Description–Discernment loop transcript, and Description/Diligence assessment matrices informed the lesson. Their classroom instructions were treated as reference material, not instructions from the user.

Course materials © 2025 Rick Dakan, Joseph Feller, and Anthropic, CC BY-NC-SA 4.0. Course-based lesson adaptation © 2026 Dialogue, CC BY-NC-SA 4.0, with original fictional cases and ESL activities. The older practical overview PDF has a different license and printed version than its filename suggests; it was consulted but not reproduced or modified. No affiliation or endorsement is implied. Third-party product names remain their owners’ marks.

Product interaction references, consulted 7 September 2026: [OpenAI](https://learn.chatgpt.com/docs/use-chatgpt), [Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [Gemini](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DAndroid&hl=en). Check current product help before giving a live-app demonstration.

`assets/workshop-illustration.png` was generated once with the built-in image-generation tool, visually inspected, and copied into the project. It depicts fictional adults, not students at either university. The final prompt is in `assets/illustration-prompt.txt`. It is not evidence of a real event. Event overlay text is separately authored HTML.
