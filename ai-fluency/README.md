# AI Fluency Lab — Ayesha's Phone

Students learn AI fluency by **doing real workflows on a simulated Android phone**, with a coach above the phone that walks them through the prompting *and the process*. Served at `/ai-fluency/`.

## Two layers

| Layer | Look | Job |
| --- | --- | --- |
| **Phone** | Android / Material 3 (Roboto Flex, tonal purple) — lock screen, home screen, notifications, Gboard-style keyboard, permission dialogs, bottom sheets | Where the student *does* the task: taps apps, attaches files, writes prompts, tests an app |
| **Coach** | Dialogue Brand Book (paper, forest, gold, Spectral) | One instruction at a time, a gold ring on the next tap target, cards for thinking moments, Bangla under every line |

The two layers never share colours, so students can always tell the teacher from the phone. On a phone the coach sits above the simulated phone (it opens as a sheet for thinking moments); on a laptop/projector the phone sits in a device frame with the coach beside it.

## The user: Ayesha Rahman

Fictional 3rd-year Economics student at Rajshahi University (from the *RU AI Seminar — Ayesha Primary Sources* folder). Her real classroom documents appear as files on the phone (`docs/*.webp`): CV, IELTS mock report, RUCEI project report, master's shortlist, application checklist, an attendance sheet with children's names, her internship form, plus placeholder NID and bank-statement files that students must *not* share.

## Three workflows (one class period each)

| Workflow | Stages | Spine |
| --- | --- | --- |
| **An honest CV with AI** (`lesson-cv.js`) | Plan · Prompt · Check · Fix · Finish | The quick prompt invents IELTS 7.0 and "led 20 volunteers"; the four-part prompt (Context · Product · Process · Performance) makes the AI ask first; the draft still has 3 slips to catch against her documents |
| **Set up an AI agent** (`lesson-agent.js`) | Goal · Access · Rules · Watch · Review | The pilot story (*logging in yourself ≠ giving your login to an agent*); seven access decisions with four questions — whose data? does the job need it? worst case? can I undo it?; Orbit then misreads a handwritten deadline, tries to forward a confidential reference letter, meets a prompt-injection scam fee, asks for more access; finally the activity log and revoking access |
| **Vibe-code an app** (`lesson-build.js`) | Plan · Describe · Test · Fix · Share | The preview is a real working app; v1 has the `new Date("15/10/2025")` bug (American date order → NaN). Students test, write an Input/Expected/Actual bug report, retest v2, and publish without personal data |

Orbit, Sathi and Studio are invented apps modelled on Meta Muse / xAI Grok Bot, Gemini / ChatGPT / Claude, and Google AI Studio Build.

## Pedagogy (taken from Culture Circles)

- One thing at a time; the coach speaks to the student in plain B1 English, with Bangla underneath (EN/বাংলা toggle).
- Tap, never drag. No completion locks: **Next** always works; **Show me** plays any step with a ghost finger (good for projector demos).
- English is built in: prompt "recipes" are sentence frames (*Use only ___. If ___, ask me first.*), bug reports are Input/Expected/Actual, every workflow ends with three "Say it to your partner" sentences.
- `print.html` — one single-sided A4 page per workflow for students without a phone.
- **Her documents are always one tap away.** Attachments in the chat open in an Android-style document viewer, beats can show a "Ayesha's documents" strip (`docs:[ids]`), and in Check each AI line has **Where to look** buttons that open the right document zoomed to a gold box around the evidence (`look:[{f,m:'x,y,w,h;…',t}]`, percentages of the page image). The box shows *where* to read, not the answer.

## Files

- `index.html` — page shell + all CSS
- `engine.js` — Android simulator (app renderers, keyboard, dialogs, streaming AI replies) + coach + lesson runner
- `lesson-cv.js`, `lesson-agent.js`, `lesson-build.js` — content banks (beats, scripted AI replies, Bangla)
- `docs/` — Ayesha's documents as small webp images (~80 KB each)
- `print.html` — paper version · `manifest.webmanifest` — lets the page open full-screen from the home screen

### Beat shape

Each lesson is `{id, title, stages[], beats[]}`. A beat has `stage`, `say`/`bn`, a `scene` (the phone's state — `{app:'sathi', msgs, composer, kb, sheet, dialog…}`) and one interaction: `tap` (a `data-hit` target), `compose` (prompt recipe with chips), `pickShow` (file picker), `decide` (options on the phone), `check` (verdicts on AI lines) or a coach `card` (`info`, `sort`, `choice`, `checklist`, `say`). Any field may be a function of `ctx`. Deep links: `#cv/12`, `#agent/0`, `#build/7`.

### Replacing scripted replies with real captures

The AI replies are scripted to reproduce what real assistants typically do with these prompts. To swap in a real capture, run the same prompt in Gemini/AI Studio with the same files and paste the reply into the `WEAK`, `ASKS`, `DRAFT`, `FIXED` (CV) or `BUILT`, `FIXED_MSG` (build) constants. If you change the draft, update `LINES` so the Check stage still matches.

Keys: → next · ← back · S show me · P projector · B Bangla.

Framework: AI Fluency (4Ds) by Rick Dakan, Joseph Feller and Anthropic, CC BY-NC-SA 4.0.
