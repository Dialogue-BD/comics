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
| **Vibe-code an app** (`lesson-build.js`) | Purpose · Hand over · Describe · Steer · Test · Grow | Not a coding lesson: the four Ds as a fluent non-programmer uses them with an AI app builder. **Diligence first** — who is the app for (just me · our 15-person study circle · a product to sell)? That one decision sets logins, private data, testing and what happens if it breaks. **Delegation** — the AI decides architecture and tools (give it rope where it is the expert); Ayesha keeps version 1, how it feels on cheap phones, and local details. **Description** — describe version 1 *and* where it may grow, so the AI structures the code for later. **Discernment** — Studio’s plan streams as it thinks and Ayesha presses ■ Stop when it drifts (sign-in, cloud database and AI reminders “now”; MM/DD dates), then steers it (drop · correct · keep); then she tests the real preview (31/02 silently becomes 3 March) and re-checks the fix. **Grow** — Tanvir wants to sell it: same screen, different app, back round the loop |

Orbit, Sathi and Studio are invented apps modelled on Meta Muse / xAI Grok Bot, Gemini / ChatGPT / Claude, and Google AI Studio Build.

## The 4D gears

`compass.js` draws the framework as four interlocking gears: **Delegation** (plan) at the top, **Diligence** (be responsible) at the bottom, **Description** (say it) on the left and **Discernment** (judge it) on the right. Top–bottom is loop 1, the big decisions; left–right is loop 2, the conversation. Each gear meshes with its two neighbours, so when one turns all four turn (the vertical pair one way, the horizontal pair the other), and the gold spot where they meet is AI fluency. One picture, reused everywhere:

- **The band** under the stage rail shows the D in use at every step; its gear lights up and the whole set turns when the D changes. Tap it for the legend.
- **“Why now?”** — on every step where the D changes, a card comes *before* the instruction: the old gear → the new gear, whether the move stays in one loop or crosses between them, the lesson’s reason (`why`/`whybn` on the beat), and a one-line link between the two Ds.
- **The rail** marks each stage with its gear. **The hub** and the teacher menu carry the legend.
- **The finish** of each workflow shows the gears with what that workflow did with each D, and Ayesha’s path through them — how many times the loops crossed.
- **Paper:** each sheet has a small colour key for the four Ds.

A beat’s D is `b.d` or its stage’s D; `d:'none'` marks story beats where no gear is lit.

## Pedagogy (taken from Culture Circles)

- One thing at a time; the coach speaks to the student in plain B1 English, with Bangla underneath (EN/বাংলা toggle).
- Tap, never drag. No completion locks: **Next** always works; **Show me** plays any step with a ghost finger (good for projector demos).
- English is built in: prompt "recipes" are sentence frames (*Use only ___. If ___, ask me first.*), bug reports are Input/Expected/Actual, every workflow ends with three "Say it to your partner" sentences.
- `print.html` — one single-sided A4 page per workflow for students without a phone.
- **Her documents are always one tap away.** Attachments in the chat open in an Android-style document viewer (drag to pan, pinch / Ctrl+scroll / + − to zoom, double-click to zoom on a spot), beats can show a "Ayesha's documents" strip (`docs:[ids]`), and in Check each AI line has **Where to look** buttons that open the right document zoomed to a gold box around the evidence (`look:[{f,m:'x,y,w,h;…',t}]`, percentages of the page image). The box shows *where* to read, not the answer.

## The four Ds — onboarding animation

`intro.js` + `intro.css`: a 1920×1080 motion graphic for the projector (about 2 minutes, seven scenes) on the theory of the framework: the four Ds as two interlocking loops — Delegation ⇄ Diligence (the big decisions) and Description ⇄ Discernment (the conversation), with the course's own sub-questions and one neutral example (studying for an exam). It deliberately does not preview the phone workflows. Open it from the start screen ("Watch: the four Ds"), the menu, or `/ai-fluency/#intro`. Space pauses, ← → step through scenes, B shows Bangla captions, speed 0.75× for slower readers. The gold ring is the mascot — the human eye that makes every connection.

Every movement is a Web Animation built from `data-a="anim start [duration]"` attributes, so the film is a pure function of (scene, time). `INTRO.seek(scene, t)` freezes any frame; the narrated video is rendered from the same scenes. Narration script and voice settings: `intro-voice-script.md` (record one take in the AI Studio speech playground → `intro/four-ds-narration.wav`).

## Files

- `index.html` — page shell + all CSS
- `compass.js` — the 4D gears (legend, “why now” links, finish recap)
- `engine.js` — Android simulator (app renderers, keyboard, dialogs, streaming AI replies) + coach + lesson runner
- `lesson-cv.js`, `lesson-agent.js`, `lesson-build.js` — content banks (beats, scripted AI replies, Bangla)
- `docs/` — Ayesha's documents as small webp images (~80 KB each)
- `print.html` — paper version · `manifest.webmanifest` — lets the page open full-screen from the home screen

### Beat shape

Each lesson is `{id, title, stages[], beats[]}`. A beat has `stage`, `say`/`bn`, a `scene` (the phone's state — `{app:'sathi', msgs, composer, kb, sheet, dialog…}`) and one interaction: `tap` (a `data-hit` target), `compose` (prompt recipe with chips), `pickShow` (file picker), `decide` (options on the phone), `check` (verdicts on AI lines) or a coach `card` (`info`, `sort`, `choice`, `checklist`, `say`). Any field may be a function of `ctx`. `interrupt:true` lets a tap (Studio’s ■ Stop) cut a streaming reply short instead of finishing it; Studio’s stop bar comes from `scene.stopHit`, and `msg.speed` slows a stream. Deep links: `#cv/12`, `#agent/0`, `#build/7`.

### Replacing scripted replies with real captures

The AI replies are scripted to reproduce what real assistants typically do with these prompts. To swap in a real capture, run the same prompt in Gemini/AI Studio with the same files and paste the reply into the `WEAK`, `ASKS`, `DRAFT`, `FIXED` (CV) or `PLAN_LINES`, `PLAN2`, `FIXED` (build) constants. If you change the draft, update `LINES` so the Check stage still matches.

Keys: → next · ← back · S show me · P projector · B Bangla.

Framework: AI Fluency (4Ds) by Rick Dakan, Joseph Feller and Anthropic, CC BY-NC-SA 4.0.
