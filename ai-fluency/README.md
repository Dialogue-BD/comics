# AI Fluency Lab — Ayesha's Phone

Students learn AI fluency by **doing three missions on a simulated Android phone** — as Ayesha — with Cog, a gear-shaped coach, saying one thing at a time. Served at `/ai-fluency/`.

## Two layers

| Layer | Look | Job |
| --- | --- | --- |
| **Phone** | Android / Material 3 (Roboto Flex, tonal purple) — lock screen, home screen, notifications, Gboard-style keyboard, permission dialogs, bottom sheets | Where the student *does* the task: taps apps, attaches files, writes prompts, tests an app |
| **Play** | Dialogue Brand Book (paper, forest, gold, Spectral + Public Sans) | Cog’s one line (read aloud), cards for thinking moments, the one next button, feedback that slides up, Bangla under every line |

The two layers never share colours, so students can always tell the coach from the phone. See **One screen at a time** below.

## The user: Ayesha Rahman

Fictional 3rd-year Economics student at Rajshahi University (from the *RU AI Seminar — Ayesha Primary Sources* folder). Her real classroom documents appear as files on the phone (`docs/*.webp`): CV, IELTS mock report, RUCEI project report, master's shortlist, application checklist, an attendance sheet with children's names, her internship form, plus placeholder NID and bank-statement files that students must *not* share.

## Three missions (one class period each)

Each mission lets students **get it wrong first**: the AI’s mistakes are never pointed out in advance. They make the choice most people make, see it play out (⏩ *what happens next*), then rewind or carry on. Stars count good calls made first time.

| Mission | Stages | Spine |
| --- | --- | --- |
| **An honest CV with AI** (`lesson-cv.js`) | First try · Plan · Prompt · Check · Fix · Finish | Ayesha wasn’t shortlisted. Students send a quick prompt, are asked *“Would you send this CV?”* (sending it plays out at the interview), then hunt the 5 things that aren’t true in her own documents. Then they plan (who does each job), learn why the AI made things up, choose only the files a CV needs, build a four-part prompt (Context · Product · Process · Performance), answer the AI’s questions truthfully, and hunt the 3 slips that a good prompt still lets through. Fix, add private details themselves, four checks — shortlisted. |
| **Set up an AI agent** (`lesson-agent.js`) | Jobs · Access · Rules · Watch · Review | Eight master’s applications are due. Choose which jobs Orbit may do; seven access decisions with four questions — whose data? does the job need it? worst case? can I undo it? (💡 shows them); rules in plain words. Three hours later: find the deadline Orbit misread against her handwritten checklist, catch a confidential letter in an email draft, spot a prompt-injection scam fee, refuse more access; read the log; remove access when the job is done. Risky choices play out (emails sent in her name, children’s photos, a payment that can’t come back). |
| **Vibe-code an app** (`lesson-build.js`) | Purpose · Hand over · Describe · Steer · Test · Grow | Not a coding lesson. **Diligence first** — who is the app for? That decision sets logins, private data, testing. **Delegation** — the AI chooses architecture and tools; Ayesha keeps version 1, how it feels, local details. **Description** — version 1 *and* where it may grow. **Discernment** — press ■ Stop when Studio’s streaming plan drifts (sign-in and a cloud database “now”, MM/DD dates) and say what went off track; steer it; test the real preview (31/02 silently becomes 3 March); report the bug as input · expected · actual; re-test. **Grow** — Tanvir wants to sell it. |

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
- **What happens next.** A risky choice plays out instead of only getting feedback: the phone jumps ahead in time and shows the result (an email Orbit sent in her name, a payment that can't be reversed, a sign-in screen nobody asked for). The coach says it with one reusable frame — *She ___, so ___.* — asks “What went wrong? Say it.”, and offers **Rewind and choose again** (Next still works). Put `then:AFL.conseq(lesson,{when,line,linebn,scene})` on a risky `decide` or `choice` option, or `cq:x=>…` on a beat for a shortcut taken earlier (with a `rewind` that undoes it, e.g. `AFL.unsay()` + `AFL.goId()`).
- **Paper** (`print.html`) mirrors the phone: picture words, the four phrases, the decision tasks each ending in a frame to say, a *What happens next?* matching task (key in a comment at the end), and the talk questions with A/B roles.
- **Her documents are always one tap away.** Attachments in the chat open in an Android-style document viewer (drag to pan, pinch / Ctrl+scroll / + − to zoom, double-click to zoom on a spot), beats can show a "Ayesha's documents" strip (`docs:[ids]`), and in Check each AI line has **Where to look** buttons that open the right document zoomed to a gold box around the evidence (`look:[{f,m:'x,y,w,h;…',t}]`, percentages of the page image). The box shows *where* to read, not the answer.

## Teaching English and AI fluency together

Each D is also a job you do with English (`D4.SAY` in `compass.js`): **Delegation** = planning and sharing jobs (*I will ___. The AI can ___.*), **Description** = clear instructions (*Use only ___. If ___, ask me first.*), **Discernment** = judging and disagreeing politely (*That's not true. ___ says ___.*), **Diligence** = limits and responsibility (*I won't share ___. It's private.*). When a gear turns, the coach shows that D's phrase with a 🔊 button; the reason ("Why now?") waits behind a tap, so the screen shows rather than tells. A beat can give its own phrase with `frame:{en,bn}`.

**Two halves per workflow.** It opens with a **warm-up for the projector** (`wide:true` beats fill the screen on a laptop or projector and cover the phone on a handset): picture words (`card:{type:'words'}` — tap to hear the word and a sentence), a story told in pictures and heard before it is read (`card:{type:'story'}`), the four phrases of the day (`card:{type:'phrases'}` — listen and repeat), and a first talk question. Then the phone work.

**Three ways to work** (header pill, hub, menu; kept per device in `localStorage['afl-prefs']`): 👤 **Alone** (homework — talk moments offer *Record yourself* and play back), 👥 **Pairs** (one phone, two students; talk moments have a one-minute timer and A/B roles), 🙋 **Class** (teacher drives on the projector: switches on the large projector type, talk moments say *turn to the person next to you*). Only the talk moments change; the AI fluency content is identical. Nothing is locked in any mode.

**Talk moments** (`talk:{q, qbn, frames:[{en,bn}], model, time, roles, pic, big}`) sit on any beat, alone or under a card: a question, sentence frames with gaps, an example answer to hear, and an optional timer (T). **Listening:** the coach reads each new step aloud in English (🔊 in the header, or V, turns it off) — sentence by sentence, because Chrome cuts long speech off; it prefers an en-IN voice, then en-GB.

All three workflows follow this pattern: CV (29 steps), Agent (31) and Build (24), each with four warm-up steps and six or seven talk moments. The story panels are emoji for now; like Culture Circles, they can become wordless comic panels.

## Recorded voices (Gemini TTS, no API)

Every spoken line has a key made from its words (`audioKey()` in `engine.js`, FNV-1a over the normalised text). The page plays `audio/<key>.mp3` when `audio/manifest.json` lists the key, and falls back to the browser's voice otherwise — so a line that changes simply falls back until it is re-recorded, and nothing has to be renamed.

Cog reads every new step by itself. One audio player is unlocked by the student’s first tap (phones block sound that starts on its own), and the lines for this step and the next two are fetched ahead, so a line starts at once. Clips are 40 kb/s mono (~20 KB each). If a phone blocks a clip, 🔊 pulses rather than the line dropping to the robot voice. Bump `v` in `audio/manifest.json` after re-encoding to make phones fetch the new files.

- `node tools/voice-script.js` lists every line from the lesson files (say lines, picture words, story panels, phrases, talk questions, frames and example answers, in every mode) into `audio/lines.json`, groups the lines **not yet recorded** into new takes of up to four per voice, named `r2-…` so old take files can never be cut into the wrong lines in `audio/takes.json`, and writes **`voice-script.md`**: the voice settings and a transcript block per take to paste into the AI Studio speech playground. Run it again after any text change; recorded takes are ticked.
- Two voices: **the coach** (instructions, words, stories, questions) and **Ayesha** (phrases, frames, example answers). Lines in a take are separated by `<long pause>`.
- Download each take as `<take>.wav`, then `python3 tools/split_takes.py ~/Downloads` (needs ffmpeg) cuts each take at its pauses into `audio/<key>.mp3`, trims it, and rewrites the manifest. A take with too few pauses is skipped and reported (when pauses are close it tries the cut that best fits each line's words; a take that still won't cut can be recorded a line at a time as `<take>_L1.wav`, `_L2.wav` …); lines whose length looks wrong for their words are listed to check by ear.

## The four Ds — onboarding animation

`intro.js` + `intro.css`: a 1920×1080 motion graphic for the projector (about 2 minutes, seven scenes) on the theory of the framework: the four Ds as two interlocking loops — Delegation ⇄ Diligence (the big decisions) and Description ⇄ Discernment (the conversation), with the course's own sub-questions and one neutral example (studying for an exam). It deliberately does not preview the phone workflows. Open it from the start screen ("Watch: the four Ds"), the menu, or `/ai-fluency/#intro`. Space pauses, ← → step through scenes, B shows Bangla captions, speed 0.75× for slower readers. The gold ring is the mascot — the human eye that makes every connection.

Every movement is a Web Animation built from `data-a="anim start [duration]"` attributes, so the film is a pure function of (scene, time). `INTRO.seek(scene, t)` freezes any frame; the narrated video is rendered from the same scenes. Narration script and voice settings: `intro-voice-script.md` (record one take in the AI Studio speech playground → `intro/four-ds-narration.wav`).

## One screen at a time (`engine.js` · `play.css`)

The same shape on every screen — the interaction grammar Gen Z students already know from Duolingo:

- **Top** — ✕ (back to Ayesha’s lock screen) · a progress bar in the colours of the stages’ Ds · ★ stars · বাংলা · ⋯ menu.
- **Cog** — the coach: one line, read aloud automatically (🔊 to hear it again), with the D in use above it. Cog takes that D’s colour, turns while it talks and frowns when a choice goes wrong.
- **The stage** — *either* Ayesha’s phone (a framed handset, where students act; a gold ring marks where to tap) *or* a card (a question, a sort, a gear turned, a talk moment). Never both, so there is one place to look.
- **The footer** — the one next thing: Continue — or Skip, 👆 Show me, 📁 her files, 💡 think. Answer buttons appear here when the phone must stay in view (*“Would you send this CV?”*).
- **The sheet** — feedback slides up from the bottom: green (right), amber (think again, with Try again), red (risky — or ⏩ what happened next, with ↩ Choose again). Her documents open over everything, with a gold box on the evidence.

On a laptop or projector the phone sits on the left and Cog, the sheet and the footer stand beside it. A short tour (*How this works*, also in the menu) introduces Cog, the phone and the button on the first visit. **Alone** skips the projector warm-up and partner talk — the English is in the action: the sentences students choose to send, and the phrase at each gear turned. **Pairs** and **Class** keep the warm-up, and talk moments follow the key steps on their own card.

## Files

- `index.html` — page shell + the phone’s CSS · `play.css` — Cog, cards, footer, sheet, layouts
- `compass.js` — the 4D gears (legend, “why now” links, finish recap)
- `engine.js` — Android simulator (app renderers, keyboard, dialogs, streaming AI replies) + the play layer + lesson runner
- `lesson-cv.js`, `lesson-agent.js`, `lesson-build.js` — content banks (beats, scripted AI replies, Bangla)
- `docs/` — Ayesha's documents as small webp images (~80 KB each)
- `tools/voice-script.js`, `tools/split_takes.py`, `voice-script.md`, `audio/` — the recorded voices (above)
- `print.html` — paper version · `manifest.webmanifest` — lets the page open full-screen from the home screen

### Beat shape

Each lesson is `{id, title, stages[], beats[]}`. A beat has `stage`, `say`/`bn`, a `scene` (the phone's state — `{app:'sathi', msgs, composer, kb, sheet, dialog…}`) and one interaction: `tap` (a `data-hit` target, with optional `feedback(x)` → a sheet before moving on), `compose` (chips above the keyboard; `slots` light up as pills), `pickShow` (file picker), `decide` (options on the phone → feedback sheet; an option with `then:AFL.conseq(…)` plays out), `ask` (answer buttons in the footer, phone in view), `hunt` (every `.ln[data-ui=line:id]` in the AI reply can be tapped; `lines:[{id,v:'ok'|'bad',text,look,why}]` — find the ones that aren’t true) — or `view:'card'` with a `card` (`choice`, `sort`, `checklist`, `info`, `html`, `level` — a gear turned, `result` — mission complete, `words`, `story`, `phrases`). `hint` (💡) and `docs` (📁, ids or `{f,m,t}` with a gold box) add footer tools; `talk` adds a talk moment (Pairs/Class); `only:'class'` hides a beat from Alone; `pass:x=>…` skips a beat that doesn’t apply; `kick` labels a beat with no D. Any field may be a function of `ctx`. `interrupt:true` lets a tap (Studio’s ■ Stop) cut a streaming reply short instead of finishing it; Studio’s stop bar comes from `scene.stopHit`, and `msg.speed` slows a stream. Deep links: `#cv/12`, `#agent/0`, `#build/7`.

### Replacing scripted replies with real captures

The AI replies are scripted to reproduce what real assistants typically do with these prompts. To swap in a real capture, run the same prompt in Gemini/AI Studio with the same files and paste the reply into the `WEAK`, `ASKS`, `DRAFT`, `FIXED` (CV) or `PLAN_LINES`, `PLAN2`, `FIXED` (build) constants. If you change the draft, update `LINES` so the Check stage still matches.

Keys: → next · ← back · S show me · P projector · B Bangla.

Framework: AI Fluency (4Ds) by Rick Dakan, Joseph Feller and Anthropic, CC BY-NC-SA 4.0.

## Latest changes
- Orbit has a new logo (planet, ring, spark).
- The prompt box colours Context / Product / Process / Performance to match the chips and the meter.
- The CV "fix" step is an ESL sentence builder: tap or drag chunks into order.
- Build test step: students add deadlines from their own lives, then try to break the app with an impossible date.
- Studio is light, the gear celebration has sound (`fx.js`), wrong-answer sheets are read aloud, "Sathi AI" is used everywhere.
- Docs: attendance, rucei, shortlist and checklist are the un-redacted originals. cv, ielts and the internship form are still redacted.
- Discernment checks teach IELTS skimming and scanning: an animated skim → keywords → scan → check on Ayesha's RUCEI report (`alt.js`), then each "is this true?" runs keywords → scan → TRUE / FALSE / NOT GIVEN.

### Latest changes (prompt parts, gears, progress bar)
- The four prompt parts (Context, Product, Process, Performance) now have their own `parts` card before the prompt step: a tailor story, one part at a time, with Back/Next. The prompt step keeps a "Review the 4 parts" link.
- Gear celebration clicks are driven by the audio clock (`FX.gearTurned`), so every tooth turns exactly when its click is heard. Mission-complete gear symbols sit inside a `.symg` wrapper so the pop animation no longer overrides their centring.
- The progress-bar segments at the top are buttons (`data-p="seg"`): tap one to jump to the start of that section.
- The prompt box scrolls, and its colour overlay scrolls with it.
