#!/usr/bin/env node
/* Generate the scene-comic asset brief from scenes.js.

     node tools/gen-scene-assets.js [out.md]

   Default output: scene/culture-circles-scene-assets.md
   scenes.js is the source of truth. Never edit a transcript in the brief:
   change the line in scenes.js and run this again, or the on-page karaoke
   will drift from the recording. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'scenarios.js'), 'utf8') + ';this.SCENARIOS=SCENARIOS;this.THEMES=THEMES;', ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'scenes.js'), 'utf8') +
  ';this.SCENES=SCENES;this.NARR=SCENE_NARRATOR;this.BED=SCENE_BEDS;this.seg=sceneSegments;', ctx);
const { SCENARIOS, THEMES, SCENES, NARR, BED, seg } = ctx;
const OUT = process.argv[2] || path.join(ROOT, 'scene', 'culture-circles-scene-assets.md');

const clean = t => t.replace(/<[^>]+>\s*/g, '').replace(/\s+/g, ' ').trim();
const tagsOf = t => (t.match(/<[^>]+>/g) || []);
const words = t => (clean(t).match(/[A-Za-z’'-]+/g) || []).length;
const mdCell = t => t.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spk = c => c.name.replace(/^Dr\.\s+/, '');       /* speaker id in a conversational call */

const STYLE_BLOCK =
`Editorial comic illustration, clean modern graphic-novel style. Flat colour
with soft cel shading, confident medium-weight ink outlines, warm limited
palette of cream, forest green, muted gold, clay red and soft slate blue.
Square 1:1 composition. Clear silhouettes and readable body language — the
whole story must be understandable with the sound off and no words at all.
Faces expressive but not exaggerated; naturalistic adult proportions, not
caricature. Plain uncluttered backgrounds with just enough detail to place
the scene. Absolutely no text, no lettering, no signage with words, no
watermark, no logos, no speech bubbles containing writing.`;

function voiceLabel(c){ return `${c.voice.prebuilt} (${c.voice.note.split(' —')[0]})`; }
function voiceShort(c){ return c.voice.prebuilt; }
/* a line's style as sent to the model: its delivery, then the speaker's accent */
const turnStyle = (c, L) => [L.s || 'natural and conversational', c.accent].filter(Boolean).join('; ');

const scen = id => SCENARIOS.find(s => s.id === id);
const order = SCENARIOS.map(s => s.id).filter(id => SCENES[id]);
const TAKES = {};
order.forEach(id => { TAKES[id] = seg(id); });

let totalLines = 0, totalWords = 0, nDia = 0, nNar = 0;
order.forEach(id => {
  totalLines += SCENES[id].lines.length;
  SCENES[id].lines.forEach(L => totalWords += words(L.t));
  TAKES[id].forEach(t => t.kind === 'dialogue' ? nDia++ : nNar++);
});
const allCast = order.flatMap(id => SCENES[id].cast.map(c => Object.assign({ scene: id }, c)));
const secs = Math.round(totalWords / 2.3 + totalLines * 0.5);

const md = [];
const P = s => md.push(s);

/* ------------------------------------------------------------ front matter */
P(`# Culture Circles — Scene Comic Assets

**Dialogue · Professional Skills Development Center, Rajshahi**
For \`dialogue-bd.com/ethnographic-interviews/\` — the Watch step (step 1).

Generated from \`ethnographic-interviews/scenes.js\` by \`tools/gen-scene-assets.js\`.
**Do not edit transcripts here.** Change the line in \`scenes.js\` and regenerate —
the page's karaoke and word help read the same file, and a one-word drift
breaks them silently.

| | |
|---|---|
| Scenes | ${order.length} |
| Audio | **${nDia + nNar} takes** — ${nDia} dialogue takes (both characters in one call) and ${nNar} narration takes — assembled into **${order.length} scene files**. ${totalLines} lines, ${totalWords} words, about ${Math.round(secs / 60)} minutes in total |
| Voices | ${allCast.length + 1}, all prebuilt Gemini voices — 1 narrator (the same in every scene) + ${allCast.length} characters |
| Comic panels | **${order.length * 6} images** — six square panels per scene |
| Portraits | **${allCast.length} images** — one per character (the narrator has none) |

---

## What this is for

Each scenario opens with a short story told as a **wordless comic** with a
**narrator** and **two voiced characters**. Students hear it three times:

1. **Just listen** — the comic turns its own pages with the audio. Nothing to read; a face in the corner shows who is talking.
2. **Read along** — the same, with the line being spoken lit up word by word (karaoke).
3. **Explore the words** — the whole conversation as a chat, every glossed word tappable for its meaning, and any line playable on its own.

**The audio is one file per scene**, recorded as takes:

- **Dialogue takes** — every run of character lines in one room is **one conversational-mode call with both characters**, so they actually play off each other: the reactions, the interruptions, the timing of a reply. This is where the performance lives; never split a dialogue take into single lines.
- **Narration takes** — the narrator's lines between them, recorded on their own. The narrator is voice-over, outside the story, as in radio drama. (Conversational mode takes at most two speakers, so this split is also what the API allows.)

\`tools/assemble_scenes.py\` joins the takes into \`scene/<id>.mp3\`, and
\`tools/align_scenes.py\` times every word. The page reads the line boundaries
from those timings — it turns the panel as a line starts, seeks to a line when a
student replays it, and lights up each word.

The listeners are Bangladeshi B1 students. Every take must be **clear, natural
and a little slower than native speed** — acted, but never theatrical. The comic
must tell the story with the sound off.

## Filenames

\`\`\`
ethnographic-interviews/scene/_dry-originals/<scenario-id>-sNN.wav   the takes, untouched (sNN = s01, s02 … — the tables below)
ethnographic-interviews/scene/<scenario-id>.mp3                      the assembled scene (written by assemble_scenes.py)
ethnographic-interviews/scene/_build/<scenario-id>.json             where each take sits in the scene (written by assemble_scenes.py)
ethnographic-interviews/scene-timings.js                            word timings (written by align_scenes.py)
ethnographic-interviews/scene/panels/<scenario-id>-<n>.webp          n = 1–6, 720x720, quality 72
ethnographic-interviews/scene/panels/<scenario-id>-<n>.jpg           the same, JPEG quality 82 (fallback)
ethnographic-interviews/scene/panels/_originals/<id>-<n>.png         full-size originals from the image model
ethnographic-interviews/scene/cast/<slug>.jpg                        384x384, JPEG quality 84
ethnographic-interviews/scene/cast/_originals/<slug>.png             full-size originals
\`\`\`

The page already runs without any of these (browser speech, the old strip
pictures and initials stand in), so scenes can land one at a time.

## Order of work

1. **Draw the panels, one scene at a time** — panel 1 first, then 2–6 with panel 1 attached for continuity.
2. **Draw the portraits** from each scene's panel 1, so the face matches the comic.
3. **Record the takes**, one scene at a time. Record the dinner scene first and listen to it end to end — especially Tania's accent — before doing the rest.
4. **Assemble, then align**: \`python3 tools/assemble_scenes.py\` then \`python3 tools/align_scenes.py\`.

---

## Audio

### Model and calls

- **Model:** \`gemini-3.8-flash-tts\` for keeper takes; \`gemini-3.8-flash-lite-tts\` is fine for a first draft pass. Check the current model names and call shape before running — the TTS API has changed across model generations.
- **Dialogue takes:** one Interactions API call per take with \`speech_config.mode = "conversational"\` and both characters as \`speakers\`. Each line is its own content item carrying a \`speech_metadata\` annotation with its \`speaker\` and \`style\`. Configure both speakers even when only one of them talks in a take.
- **Narration takes:** one single-speaker call per take, the narrator's voice (Sulafat), the take's lines as one transcript.
- **Voices:** all prebuilt — no designed or cloned voices — so every dialogue take can be a conversational call.
- **Output:** a unary call returns a complete WAV (24 kHz mono 16-bit). Save it untouched to \`scene/_dry-originals/<id>-sNN.wav\`. Do not trim, level or edit the takes — the assembler does that, and the aligner needs the originals.
- **Length:** takes run from about 2 to 25 seconds; a whole scene is 45–90 seconds.

### How the fields divide

Each character has an **audio profile** (the sound of the voice only), each place
has a **scene** (the room, with its room tone on the last line), each take has a
**sample context** (what this exchange is), and each line has a **style** (the
delivery of that one line). They do different jobs — never repeat one inside
another, or the read goes flat.

- In the **AI Studio speech playground** (multi-speaker): paste the room into *Scene*, the take's sample context into *Sample context*, each character's audio profile against their speaker, and the turns into the transcript with each turn's style.
- Through the **API**: the prebuilt voice carries the profile — choose it by auditioning against the profile — and each turn's \`speech_metadata.style\` carries its delivery. The script below does this.

**Transcripts are verbatim.** Every word is read exactly as written. Never add
stage directions to the text; delivery goes in the style.

**Audio tags** such as \`<laugh>\` or \`<sigh>\` sit inside a few lines, in angle
brackets. They are performed, not read. If a tag is **spoken aloud**, delete it and
re-run — the words either side already carry the moment. If it makes the delivery
**too big**, cut it. The page strips tags from the transcript students see.

### The narrator — one voice for all ${order.length} scenes

**Voice:** the prebuilt **Sulafat (Warm)** for every narration take. No character uses it.

**Audio profile**

\`\`\`text
A warm, calm woman in her forties reading a picture book to adult learners of
English. Neutral general American accent. Clear, unhurried and kind; slightly
slower than normal speech, with a small natural pause at every full stop.
Friendly but never childish or sing-song. Every consonant clear.
\`\`\`

**Style for every narration take:** \`${NARR.style}\`

**Sample context for every narration take:**

\`\`\`text
Voice-over narration for a wordless picture-book comic, heard by Bangladeshi
students learning English at B1 level. The narrator is outside the story,
setting each picture simply and warmly. Not an advertisement, not a
documentary. Read slowly enough that a learner can follow every word.
\`\`\`

Narration takes get **no room tone** — they are voice-over, dry and close.

### Accents

Six characters are Bangladeshi students or young professionals in the US:
${allCast.filter(c => c.accent).map(c => `**${c.name}** (${scen(c.scene).title})`).join(', ')}.
Students should hear an accent they recognise from home, speaking good, clear
English.

Each of them has a prebuilt voice and an **accent note** — a short inflection
description (a softly tapped r, dental t and d, even syllable timing, and one
habit of their own). The note is added to the style of **every** line they speak,
after that line's delivery, so it stays the same across all of their takes. The
takes below and the script already include it.

Audition the first take of each of these characters. The accent should be
**light and natural** — a real person, not an impression. If it comes out too
strong, add *"very light, subtle"* to the start of that character's note (in
\`scenes.js\`, then regenerate) rather than removing it. If it disappears
entirely, run the take again before changing anything — the model varies from
take to take.

### Returning characters

Four characters also appear in the scenario's interviews in step 3:
${allCast.filter(c => c.alsoIn).map(c => `**${c.name}** (\`audio/${c.alsoIn}.mp3\`)`).join(', ')}.
Use **the same voice as their interview take**, so students hear the same person.
Dave's interview used **Zubenelgenubi**. For the other three, check the voice used
for their interview recording; the voice listed here is a best guess and should be
swapped if it does not match.

### Cast

| Portrait | Character | Scene | Voice | Audio profile | Accent note |
|---|---|---|---|---|---|
| — | **Narrator** | all | Sulafat (Warm) | see above | — |
${allCast.map(c => `| \`${c.slug}.jpg\` | **${c.name}**, ${c.age} | ${scen(c.scene).title} | ${voiceLabel(c)} | ${c.profile} | ${c.accent || '—'} |`).join('\n')}

---

## Pictures

### The style block

**Paste this at the top of every panel prompt and every portrait prompt, unchanged.**
It is the style of the existing three-panel strips on the page, and the casts
below follow the people already drawn in those strips, so old and new pictures
sit together.

\`\`\`text
${STYLE_BLOCK}
\`\`\`

### Rules

- **No words anywhere.** Not in signs, screens, papers or speech balloons. Digits on real objects (a clock, a phone screen, a receipt, a chart label like 20%) are fine — models draw digits well and they read the same in Bangla.
- **Square, at least 1024×1024.** Save the original PNG to \`_originals/\`, then export:
  \`\`\`
  magick <id>-<n>.png -resize 720x720 -quality 72 <id>-<n>.webp
  magick <id>-<n>.png -resize 720x720 -quality 82 <id>-<n>.jpg
  \`\`\`
- **Continuity is everything.** Draw panel 1 first — attach the scenario's existing strip panel \`strip/<id>-1.png\` (or \`strip/_originals/\`) as a reference for the people, setting and style. For panels 2–6, attach panel 1 and begin the prompt with: *"Same characters, same clothing, same art style and palette as the attached image. Continue the sequence."* If a face or an outfit drifts, regenerate that panel. A student tracking "the same man" across six pictures is doing half the comprehension work.
- **Returning characters** (${allCast.filter(c => c.alsoIn).map(c => c.name).join(', ')}): also attach their existing portrait from \`portraits/\` so they look like the person in the interview.
- **Readable at 300px.** One clear action per panel, the speaker's face visible, nothing important in the bottom-left corner (the page puts the speaker's face there).

### Portraits

Draw each portrait **after** its scene's panels, attaching panel 1 so the face,
hair and clothes match. One prompt per character, in each scene section below.
Crop to a square with the face about 60% of the height, resize to 384×384, JPEG
quality 84.

---
`);

/* ---------------------------------------------------------------- scenes */
order.forEach((id, si) => {
  const S = SCENES[id], X = scen(id), th = THEMES[X.theme];
  const castLook = S.cast.map(c => `${c.name}: ${c.look}.`).join(' ');
  P(`## ${si + 1} · ${X.title}  —  ${th.label}

**Setting:** ${X.setting}

**What happens (the scenario, as the page tells it):** ${X.observation}

**Cast:** ${S.cast.map(c => `**${c.name}**, ${c.age}, ${c.who}`).join('; ')}.
`);

  P(`### Rooms (the *Scene* field)

${Object.keys(S.rooms).map(k => `**${k}** — panels ${S.panels.map((p, i) => p.room === k ? i + 1 : null).filter(Boolean).join(', ')}

\`\`\`text
${S.rooms[k]}
\`\`\`

Room tone the assembler lays under dialogue in this room: ${(BED[k] || []).map(b => `\`${b[0]} ${b[1]} dB\``).join(' · ') || '—'}
`).join('\n')}`);

  S.cast.forEach(c => {
    P(`### ${c.name} — speaker \`${spk(c)}\` · \`scene/cast/${c.slug}.jpg\`

**Voice** ${voiceLabel(c)}${c.alsoIn ? ` · **same voice as** \`audio/${c.alsoIn}.mp3\`` : ''}${c.accent ? `

**Accent note** (added to the style of every ${c.name} line): \`${c.accent}\`` : ''}

**Audio profile**

\`\`\`text
${c.profile}
\`\`\`

**Portrait prompt**

\`\`\`text
${STYLE_BLOCK}

Head-and-shoulders character portrait for a profile picture. ${c.look}${c.alsoIn ? ` (match the face in the attached portrait from portraits/${c.alsoIn}.jpg)` : ''}. ${c.name} is ${c.who}. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
\`\`\`
`);
  });

  P(`### Panels

Characters in this scene — keep them identical in every panel: ${castLook}
`);
  S.panels.forEach((pn, i) => {
    const heard = S.lines.filter(L => L.p === i + 1)
      .map(L => (L.w === 'N' ? 'Narrator' : S.cast[L.w].name) + ': “' + clean(L.t) + '”').join(' / ');
    P(`**Panel ${i + 1}** — \`scene/panels/${id}-${i + 1}.webp\` · stand-in until drawn: \`strip/${id}-${pn.beat}\`

*Heard over this panel:* ${heard}

\`\`\`text
${STYLE_BLOCK}

${i === 0 ? `Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the people, setting and style.`
          : `Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel ${i + 1} of 6.`}
Characters: ${castLook}
${pn.see}
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
\`\`\`
`);
  });

  /* takes */
  P(`### Takes

In order. Dialogue takes are one conversational call with both speakers —
\`${spk(S.cast[0])}\` (${voiceShort(S.cast[0])}) and \`${spk(S.cast[1])}\` (${voiceShort(S.cast[1])}).
`);
  TAKES[id].forEach(tk => {
    const Ls = tk.lines.map(i => S.lines[i]);
    const panels = [...new Set(Ls.map(L => L.p))].join(', ');
    if (tk.kind === 'narration'){
      P(`**\`${tk.key}\`** · narration · panel${panels.includes(',') ? 's' : ''} ${panels} · Sulafat

\`\`\`text
${Ls.map(L => L.t).join(' ')}
\`\`\`
`);
      return;
    }
    const who = Ls.map(L => S.cast[L.w].name);
    const both = new Set(who).size > 1;
    P(`**\`${tk.key}\`** · dialogue · room **${tk.room}** · panel${panels.includes(',') ? 's' : ''} ${panels}

*Sample context:* ${both ? `A short, natural exchange between ${S.cast[0].name} and ${S.cast[1].name}.` : `${who[0]} speaking to ${who[0] === S.cast[0].name ? S.cast[1].name : S.cast[0].name}.`} ${S.cast[0].name} is ${S.cast[0].who}; ${S.cast[1].name} is ${S.cast[1].who}. One continuous moment — let each reply land on the line before it. Scripted scene for B1 learners: clear and a little slower than native speed, never theatrical.

| Speaker | Style | Transcript (verbatim) |
|---|---|---|
${Ls.map(L => `| ${spk(S.cast[L.w])} | ${turnStyle(S.cast[L.w], L)} | ${mdCell(L.t)} |`).join('\n')}
`);
  });
  P('---\n');
});

/* ------------------------------------------------------------ the script */
const manifest = order.flatMap(id => TAKES[id].map(tk => {
  const S = SCENES[id];
  if (tk.kind === 'narration'){
    return { key: tk.key, kind: 'narration', voice: NARR.voice.prebuilt, style: NARR.style,
             text: tk.lines.map(i => S.lines[i].t).join(' ') };
  }
  return {
    key: tk.key, kind: 'dialogue',
    speakers: S.cast.map(c => ({ speaker: spk(c), voice: c.voice.prebuilt })),
    turns: tk.lines.map(i => ({ speaker: spk(S.cast[S.lines[i].w]), style: turnStyle(S.cast[S.lines[i].w], S.lines[i]), text: S.lines[i].t }))
  };
}));

P(`## Generation script

Everything comes from \`scenes.js\` — voices, styles (accent notes included) and
transcripts. The script skips any take whose dry file already exists, so to redo
a take, delete its file and run again.

\`\`\`python
# pip install google-genai
import base64, json, os, pathlib
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.8-flash-tts"          # or gemini-3.8-flash-lite-tts for a draft pass
DRY = pathlib.Path("ethnographic-interviews/scene/_dry-originals")
DRY.mkdir(parents=True, exist_ok=True)

TAKES = json.loads(r'''
${JSON.stringify(manifest).replace(/\},\{"key"/g, '},\n{"key"')}
''')

def dialogue(t):
    return client.interactions.create(
        model=MODEL,
        input=[{"type": "user_input", "content": [
            {"type": "text", "text": turn["text"],               # verbatim, tags and all
             "annotations": [{"type": "speech_metadata",
                              "speaker": turn["speaker"], "style": turn["style"]}]}
            for turn in t["turns"]]}],
        response_format={"type": "audio"},
        generation_config={"speech_config": {
            "mode": "conversational",
            "speakers": [{"speaker": s["speaker"], "voice": s["voice"]} for s in t["speakers"]],
        }},
    )

def narration(t):
    return client.interactions.create(
        model=MODEL,
        input=[{"type": "user_input", "content": [
            {"type": "text", "text": t["text"],
             "annotations": [{"type": "speech_metadata", "style": t["style"]}]}]}],
        response_format={"type": "audio"},
        generation_config={"speech_config": [{"voice": t["voice"]}]},
    )

for t in TAKES:
    out = DRY / (t["key"] + ".wav")
    if out.exists():
        continue
    reply = dialogue(t) if t["kind"] == "dialogue" else narration(t)
    out.write_bytes(base64.b64decode(reply.output_audio.data))
    print("wrote", out)
\`\`\`

Check the SDK's current call shape before running — these fields have moved
before. Record one scene, listen to every take, then run the rest.

## After recording

**1 · Audition each take.** Listen for: a tag read aloud; a reply that does not
land on the line before it (re-run the take — do not split it); a character who
sounds like someone else; a Bangladeshi accent that is too strong, or gone; a
word that is not in the transcript (the aligner will flag it too).

**2 · Assemble.** \`python3 ethnographic-interviews/tools/assemble_scenes.py\` —
or name one scene. It trims each take, levels them all to the same speech
loudness, lays the room's tone under dialogue takes (low-passed at 3.2 kHz, seeded
per room so a room sounds continuous across takes; narration stays dry), joins them
with pauses (longer where the panel changes), peak-limits, and writes
\`scene/<id>.mp3\` plus \`scene/_build/<id>.json\`. It prints the 2–5 kHz
speech-to-bed ratio of every dialogue take — **keep it above 20 dB**; if one
falls below, lower that room's recipe in \`SCENE_BEDS\` in \`scenes.js\` and
re-run. It never touches the dry takes.

**3 · Align.** \`python3 ethnographic-interviews/tools/align_scenes.py\` (needs
\`openai-whisper\`). It times every word of every take against the lines in
\`scenes.js\` and writes \`scene-timings.js\`. **Re-run it whenever a take is
re-recorded or re-assembled** — without it the page only estimates where each line
starts, and the panels and highlighting drift.

**4 · Listen through on the page**, all three listens, on a phone and on the projector.

---

## Checklists

### Takes — ${nDia + nNar}

| Take | Kind | Speakers | Tags | Recorded | Auditioned |
|---|---|---|---|:-:|:-:|
${order.flatMap(id => TAKES[id].map(tk => {
  const S = SCENES[id], Ls = tk.lines.map(i => S.lines[i]);
  const who = tk.kind === 'narration' ? 'Narrator' : [...new Set(Ls.map(L => S.cast[L.w].name))].join(' + ');
  const tags = Ls.flatMap(L => tagsOf(L.t)).map(t => '`' + mdCell(t) + '`').join(' ');
  return `| \`${tk.key}\` | ${tk.kind} | ${who} | ${tags} | ☐ | ☐ |`;
})).join('\n')}

### Scenes — ${order.length}

| Scene file | Takes | Assembled (SNR ≥ 20 dB) | Aligned | Checked on the page |
|---|---|:-:|:-:|:-:|
${order.map(id => `| \`scene/${id}.mp3\` | ${TAKES[id].length} | ☐ | ☐ | ☐ |`).join('\n')}

### Panels — ${order.length * 6} images

| File | Scene | Generated | Continuity checked | webp + jpg | Placed |
|---|---|:-:|:-:|:-:|:-:|
${order.flatMap(id => SCENES[id].panels.map((_, i) => `| \`panels/${id}-${i + 1}\` | ${scen(id).title} | ☐ | ☐ | ☐ | ☐ |`)).join('\n')}

### Portraits — ${allCast.length} images

| File | Character | Scene | Generated | Cropped | Placed |
|---|---|---|:-:|:-:|:-:|
${allCast.map(c => `| \`cast/${c.slug}.jpg\` | ${c.name} | ${scen(c.scene).title} | ☐ | ☐ | ☐ |`).join('\n')}

---

Sources for the API limits above: [Gemini API — Text-to-speech generation](https://ai.google.dev/gemini-api/docs/speech-generation).
`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md.join('\n'));
console.log('wrote', OUT, '—', nDia + nNar, 'takes (' + nDia + ' dialogue, ' + nNar + ' narration),',
            order.length * 6, 'panels,', allCast.length, 'portraits');
