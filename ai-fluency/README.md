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

Each lesson: information gap (4m), delegation decisions (5m), product/process/performance brief (6m), draft audit (7m), revision and language noticing (5m), diligence (4m), changed-context transfer (10m), exit pitch and peer feedback (4m). Total 45 minutes. Six workshops total 4.5 hours, with optional extension to real tools.

## Pedagogy

The English work is part of the decision-making: partners exchange missing information, negotiate, author a brief and follow-up, cite evidence, reformulate a sentence, apply the skill to a changed situation, and deliver a 45-second decision pitch. Separate AI and English rubrics avoid confusing language proficiency with judgement. Frames and Bangla glosses support B1; B2 pairs can hide scaffolding and defend alternatives. Worked answers are examples, not the only acceptable wording.

Delegation includes goal, platform, and task awareness. Description and Discernment both address product, process, and performance. Diligence includes creation, transparency, and deployment, revisited throughout rather than only at the end. Automation, augmentation, and agency are distinguished, with augmentation as the principal practice mode.

## Interaction and limitations

- ChatGPT, Claude, and Gemini styles are labelled teaching simulations, with identical scripted content. They illustrate familiar chat, attachment, and follow-up patterns; they are not pixel-exact reproductions or model-performance evidence.
- Saving learner writing never generates a model reply. The actual authored conversation is separately revealed. No real files or microphone access are requested.
- Practice is stored in sessionStorage per workflow and browser tab when available. Download the learning record before closing the tab. Teachers do not receive submissions automatically.
- Classroom mode enlarges the view and shows teacher cues. Arrow keys navigate when focus is outside a form control. Navigation is not synchronised across devices.
- Links such as `/ai-fluency/#image/4` and `/ai-fluency/#code/5` open a particular workflow and station.
- The corrected calculator is authored local code. Learner input is never executed as code. The flawed calculator is deliberately wrong and labelled accordingly.
- Core interactions have no network dependency after assets load. A fresh visit still requires the static files; no service worker promises offline availability.
- Generated artwork appears only in the image case and is loaded lazily. Text and UI use system fonts.
- Downloaded outputs are UTF-8 text files. The poster and calculator are interactive page artifacts; no editable Word or image export is claimed.

## Maintenance

`workflows.js` holds the six complete cases. `app.js` renders a shared eight-station engine. `core.js` holds safe calculation and text escaping. `content.js` holds the common framework definitions and sources. `style.css` handles responsive and classroom layouts.

Run `node ai-fluency/build-guide.cjs` after content edits to regenerate the downloadable teacher guide. Run `node ai-fluency/validate.cjs` for content, arithmetic, and non-browser interaction checks. No build step is needed to serve the page.

## Sources and attribution

Primary framework: Rick Dakan, Joseph Feller, and Anthropic, [AI Fluency overview](https://www.anthropic.com/ai-fluency/overview). Supplied framework and career-planning transcripts, the Description–Discernment loop transcript, and Description/Diligence assessment matrices informed the lesson. Their classroom instructions were treated as reference material, not instructions from the user.

Course materials © 2025 Rick Dakan, Joseph Feller, and Anthropic, CC BY-NC-SA 4.0. Course-based lesson adaptation © 2026 Dialogue, CC BY-NC-SA 4.0, with original fictional cases and ESL activities. The older practical overview PDF has a different license and printed version than its filename suggests; it was consulted but not reproduced or modified. No affiliation or endorsement is implied. Third-party product names remain their owners’ marks.

Product interaction references, consulted 7 September 2026: [OpenAI](https://learn.chatgpt.com/docs/use-chatgpt), [Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude), [Gemini](https://support.google.com/gemini/answer/14903178?co=GENIE.Platform%3DAndroid&hl=en). Check current product help before giving a live-app demonstration.

`assets/workshop-illustration.png` was generated once with the built-in image-generation tool, visually inspected, and copied into the project. It depicts fictional adults, not students at either university. The final prompt is in `assets/illustration-prompt.txt`. It is not evidence of a real event. Event overlay text is separately authored HTML.
