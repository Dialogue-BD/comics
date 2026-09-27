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
vm.runInContext(fs.readFileSync(path.join(ROOT, 'scenes.js'), 'utf8') + ';this.SCENES=SCENES;this.NARR=SCENE_NARRATOR;', ctx);
const { SCENARIOS, THEMES, SCENES, NARR } = ctx;
const OUT = process.argv[2] || path.join(ROOT, 'scene', 'culture-circles-scene-assets.md');

const pad = n => String(n).padStart(2, '0');
const clean = t => t.replace(/<[^>]+>\s*/g, '').replace(/\s+/g, ' ').trim();
const tagsOf = t => (t.match(/<[^>]+>/g) || []);
const words = t => (clean(t).match(/[A-Za-z’'-]+/g) || []).length;

/* ------------------------------------------------------------------ beds
   Room-tone recipes for the ambience step, (component, dB relative to the
   take's own speech level). Keyed by the room names used in scenes.js. */
const BED = {
  office:     [['air', -38], ['fluoro', -44], ['keys', -42], ['presence', -40]],
  home:       [['air', -40], ['babble', -34], ['dish', -40]],
  street:     [['wind', -40], ['rumble', -42], ['air', -44]],
  restaurant: [['babble', -30], ['dish', -36], ['clatter', -40], ['air', -42]],
  meeting:    [['air', -38], ['fluoro', -46], ['presence', -42]],
  hall:       [['air', -36], ['presence', -34], ['clatter', -44]],
  lot:        [['wind', -38], ['rumble', -40]],
  kitchen:    [['air', -40], ['mains', -46], ['babble', -42]],
  classroom:  [['air', -40], ['fan', -44], ['presence', -42]],
  corridor:   [['air', -40], ['presence', -40], ['babble', -44]],
  yard:       [['wind', -38], ['birds', -42], ['air', -44]],
  door:       [['wind', -40], ['birds', -46], ['air', -44]],
  pharmacy:   [['fluoro', -40], ['air', -40], ['babble', -38], ['door', -46]],
  waiting:    [['air', -38], ['fan', -44], ['presence', -44]],
  interview:  [['air', -42], ['presence', -44]],
  library:    [['air', -40], ['fan', -46], ['presence', -44]],
  exit:       [['air', -38], ['babble', -38], ['door', -44]],
  garden:     [['birds', -36], ['wind', -40], ['air', -44]]
};

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

function voiceLabel(c){
  if (c.voice.prebuilt) return `${c.voice.prebuilt} (${c.voice.note.split(' —')[0]})`;
  return `Extended Voice Library — ${c.voice.library} · fallback ${c.voice.fallback}`;
}
function voiceShort(c){ return c.voice.prebuilt || ('EVL · ' + c.voice.fallback); }

const scen = id => SCENARIOS.find(s => s.id === id);
const order = SCENARIOS.map(s => s.id).filter(id => SCENES[id]);

let totalLines = 0, totalWords = 0;
order.forEach(id => { totalLines += SCENES[id].lines.length; SCENES[id].lines.forEach(L => totalWords += words(L.t)); });
const allCast = order.flatMap(id => SCENES[id].cast.map(c => Object.assign({ scene: id }, c)));
const secs = Math.round(totalWords / 2.3 + totalLines * 0.45);

const md = [];
const P = s => md.push(s);

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
| Audio | **${totalLines} recordings** — one per line (${totalWords} words, about ${Math.round(secs / 60)} minutes in total) |
| Voices | 1 narrator (the same in every scene) + ${allCast.length} characters |
| Comic panels | **${order.length * 6} images** — six square panels per scene |
| Portraits | **${allCast.length} images** — one per character (the narrator has none) |

---

## What this is for

Each scenario opens with a short story told as a **wordless comic** with a
**narrator** and **two voiced characters**. Students hear it three times:

1. **Just listen** — the comic turns its own pages with the audio. Nothing to read; a face in the corner shows who is talking.
2. **Read along** — the same, with the line being spoken lit up word by word (karaoke).
3. **Explore the words** — the whole conversation as a chat, every glossed word tappable for its meaning, and any line playable on its own.

The page changes panel **exactly when a line starts**, which is why the audio is
one file per line. It also lets a student replay one line, and lets you fix one
line without re-recording a scene.

The listeners are Bangladeshi B1 students. Every recording must be **clear,
natural and a little slower than native speed** — acted, but never theatrical.
The comic must tell the story with the sound off.

## Filenames

\`\`\`
ethnographic-interviews/scene/<scenario-id>-<nn>.mp3          nn = 01, 02 … in line order (the tables below)
ethnographic-interviews/scene/_dry-originals/<id>-<nn>.wav    clean TTS exports — keep, never mix into these
ethnographic-interviews/scene/panels/<scenario-id>-<n>.webp   n = 1–6, 720x720, quality 72
ethnographic-interviews/scene/panels/<scenario-id>-<n>.jpg    the same, JPEG quality 82 (fallback)
ethnographic-interviews/scene/panels/_originals/<id>-<n>.png  full-size originals from the image model
ethnographic-interviews/scene/cast/<slug>.jpg                 384x384, JPEG quality 84
ethnographic-interviews/scene/cast/_originals/<slug>.png      full-size originals
\`\`\`

The page already runs without any of these (browser speech, the old strip
pictures and initials stand in), so assets can land in any order and in batches.

## Order of work

1. **Design the narrator voice once** (below) and save its \`voice_…\` ID.
2. **Pick the six Bangladeshi voices** from the Extended Voice Library (below). Audition them side by side — they must sound like six different people.
3. **Draw the panels, one scene at a time** — panel 1 first, then 2–6 with panel 1 attached for continuity.
4. **Draw the portraits** from each scene's panel 1, so the face matches the comic.
5. **Record the lines** (the generation script at the end does all ${totalLines}).
6. **Convert, level, add room tone, align** — the steps after the script.

---

## Audio

### Model and format

- **Model:** \`gemini-3.8-flash-tts\` for keeper takes; \`gemini-3.8-flash-lite-tts\` is fine for a first draft pass. Check the current model names before running — the TTS API has changed shape across model generations.
- **Call:** the Interactions API, one call per line, single speaker. Style goes in a \`speech_metadata\` annotation on the transcript item; the voice goes in \`generation_config.speech_config\`.
- **Output:** a unary call returns a complete WAV (24 kHz mono 16-bit). Save it untouched to \`scene/_dry-originals/<id>-<nn>.wav\`.
- **Length:** most lines are 2–8 seconds. The whole of one scene is 45–90 seconds.

### How the fields divide

Each character has an **audio profile** (the sound of the voice only), each place
has a **scene** (the room, with the room tone on its last line), and each line
has a **style** (the delivery of that one line). They do different jobs — never
repeat one inside another, or the read goes flat.

- In the **AI Studio speech playground**: paste the character's audio profile into *Audio profile*, the room into *Scene*, the line's sample context into *Sample context*, and the line into the transcript. Put the line's style in the style field.
- Through the **API**: the voice carries the profile (a designed voice, or a prebuilt voice chosen to match it), and \`speech_metadata.style\` carries the line's style. The script below does this.

**Transcripts are verbatim.** The text is read exactly as written. Do not add
stage directions to it.

**Audio tags** such as \`<laugh>\` or \`<sigh>\` are written inside a few lines,
in angle brackets. They are performed, not read. If a tag is **spoken aloud**,
delete it and re-run — the words either side already carry the moment. If it
makes the delivery **too big**, cut it. The page strips tags from the transcript
students see.

### The narrator — one voice for all ${order.length} scenes

**Designed voice** (AI Studio → Voice design, or \`POST /v1beta/voices\` with \`type="prompted"\`). Create it once, keep the \`voice_…\` ID, use it for every \`N\` line.

\`\`\`text
A warm, calm female storyteller in her forties reading a picture book to adult
learners of English. Neutral general American accent. Clear, unhurried and kind;
slightly slower than normal speech, with a small natural pause at every full
stop. Friendly but never childish or sing-song. Every consonant clear, no
vocal fry, no breathiness.
\`\`\`

If voice design is unavailable, use the prebuilt **Sulafat (Warm)**.

**Style for every narrator line:** \`${NARR.style}\`

**Sample context for every narrator line:**

\`\`\`text
Voice-over narration for one panel of a wordless picture-book comic, heard by
Bangladeshi students learning English at B1 level. The narrator is outside the
story, setting the scene simply and warmly. Not an advertisement, not a
documentary. Read slowly enough that a learner can follow every word.
\`\`\`

Narrator lines get **no room tone** — they are voice-over, dry and close.

### The six Bangladeshi voices

Six characters are Bangladeshi students or young professionals in the US:
${allCast.filter(c => c.voice.library).map(c => `**${c.name}** (${scen(c.scene).title})`).join(', ')}.
Students should hear an accent they recognise from home, speaking good, clear
English. Search the **Extended Voice Library** in the AI Studio picker
(Language: English → Accent: Bangladeshi, or South Asian / Indian if there is no
Bangladeshi entry), or:

\`\`\`python
for v in client.voices.list(language_code="en", search="Bangladesh"):
    print(v.name, v.accent, v.gender, v.persona)
# if nothing: region_code="IN", or search="South Asian"
\`\`\`

Pick three male and three female voices that are **clearly different from one
another**, and write the chosen voice names into the cast table below before
recording. If the library has no South Asian English voices at all, use the
fallback prebuilt voice listed for each character and describe the accent in the
style — but check it survives; the lines still have to work read in a neutral
accent.

### Returning characters

Four characters also appear in the scenario's interviews in step 3:
${allCast.filter(c => c.alsoIn).map(c => `**${c.name}** (\`audio/${c.alsoIn}.mp3\`)`).join(', ')}.
Use **the same voice as their interview take**, so students hear the same person.
Dave's interview used **Zubenelgenubi**. For the other three, check the voice
used for their interview recording; the voice listed here is a best guess and
should be swapped if it does not match.

### Cast

| Portrait | Character | Scene | Voice | Audio profile |
|---|---|---|---|---|
| — | **Narrator** | all | designed voice · fallback Sulafat | see above |
${allCast.map(c => `| \`${c.slug}.jpg\` | **${c.name}**, ${c.age} | ${scen(c.scene).title} | ${voiceLabel(c)} | ${c.profile} |`).join('\n')}

---

## Pictures

### The style block

**Paste this at the top of every panel prompt and every portrait prompt, unchanged.**
It is the style of the existing three-panel strips on the page, so old and new
pictures sit together.

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
- **Continuity is everything.** Draw panel 1 first — attach the scenario's existing strip panel \`strip/<id>-1.png\` (or \`strip/_originals/\`) as a reference for the setting and style. For panels 2–6, attach panel 1 and begin the prompt with: *"Same characters, same clothing, same art style and palette as the attached image. Continue the sequence."* If a face or an outfit drifts, regenerate that panel. A student tracking "the same man" across six pictures is doing half the comprehension work.
- **Returning characters** (${allCast.filter(c => c.alsoIn).map(c => c.name).join(', ')}): also attach their existing portrait from \`portraits/\` so they look like the person in the interview.
- **Readable at 300px.** One clear action per panel, the speaker's face visible, nothing important in the bottom-left corner (the page puts the speaker's face there).

### Portraits

Draw each portrait **after** its scene's panels, attaching panel 1 so the
face, hair and clothes match. One prompt per character, in each scene section
below. Crop to a square with the face about 60% of the height, resize to
384×384, JPEG quality 84.

---
`);

/* ---------------------------------------------------------------- scenes */
order.forEach((id, si) => {
  const S = SCENES[id], X = scen(id), th = THEMES[X.theme];
  P(`## ${si + 1} · ${X.title}  —  ${th.label}

**Setting:** ${X.setting}

**What happens (the scenario, as the page tells it):** ${X.observation}

**Cast:** ${S.cast.map(c => `**${c.name}**, ${c.age}, ${c.who}`).join('; ')}.
`);

  /* rooms */
  P(`### Rooms (the *Scene* field)

${Object.keys(S.rooms).map(k => `**${k}** — used by panels ${S.panels.map((p, i) => p.room === k ? i + 1 : null).filter(Boolean).join(', ')}

\`\`\`text
${S.rooms[k]}
\`\`\`

Room-tone bed: ${(BED[k] || []).map(b => `\`${b[0]} ${b[1]} dB\``).join(' · ') || '—'}
`).join('\n')}`);

  /* cast */
  S.cast.forEach(c => {
    P(`### ${c.name} — \`scene/cast/${c.slug}.jpg\`

**Voice** ${voiceLabel(c)}${c.alsoIn ? ` · **same voice as** \`audio/${c.alsoIn}.mp3\`` : ''}

**Audio profile**

\`\`\`text
${c.profile}
\`\`\`

**Sample context (for every ${c.name} line)**

\`\`\`text
One line from a short scripted scene for Bangladeshi students learning English
at B1 level. ${c.name} is ${c.who}. The line is part of a natural conversation,
spoken to another person in the room — not narration, not a performance for an
audience. Clear and a little slower than native speed, with real feeling.
\`\`\`

**Portrait prompt**

\`\`\`text
${STYLE_BLOCK}

Head-and-shoulders character portrait for a profile picture. ${c.look}${c.alsoIn ? ` (match the face in the attached portrait from portraits/${c.alsoIn}.jpg)` : ''}. ${c.name} is ${c.who}. Friendly, natural expression, looking slightly off to one side as if listening. Plain warm cream background with a soft forest-green vignette, no setting. Face and shoulders fill the square, centred, head fully in frame with a little space above. Same character design as the attached panel 1. No text, no logos, no watermarks.
\`\`\`
`);
  });

  /* panels */
  const castLook = S.cast.map(c => `${c.name}: ${c.look}.`).join(' ');
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

${i === 0 ? `Panel 1 of a six-panel wordless comic. Use the attached strip panel as a reference for the setting and style.`
          : `Same characters, same clothing, same art style and palette as the attached image. Continue the sequence: panel ${i + 1} of 6.`}
Characters: ${castLook}
${pn.see}
Square 1:1. Keep the bottom-left corner free of important detail. No words anywhere.
\`\`\`
`);
  });

  /* lines */
  P(`### Lines

| File | Speaker | Voice | Style | Transcript (verbatim) |
|---|---|---|---|---|
${S.lines.map((L, i) => {
    const who = L.w === 'N' ? 'Narrator' : S.cast[L.w].name;
    const v = L.w === 'N' ? 'narrator' : voiceShort(S.cast[L.w]);
    const st = L.w === 'N' ? (L.s || 'narrator style') : (L.s || '');
    return `| \`${id}-${pad(i + 1)}.mp3\` | ${who} | ${v} | ${st} | ${L.t.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;')} |`;
  }).join('\n')}

---
`);
});

/* ------------------------------------------------------------ the script */
const manifest = order.flatMap(id => SCENES[id].lines.map((L, i) => {
  const c = L.w === 'N' ? null : SCENES[id].cast[L.w];
  return {
    key: `${id}-${pad(i + 1)}`,
    who: L.w === 'N' ? 'narrator' : c.slug,
    voice: L.w === 'N' ? 'NARRATOR' : (c.voice.prebuilt || ('EVL:' + c.slug)),
    style: L.w === 'N' ? (L.s ? NARR.style + '; ' + L.s : NARR.style) : (L.s || 'natural and conversational'),
    text: L.t,
    room: L.w === 'N' ? null : SCENES[id].panels[L.p - 1].room
  };
}));

P(`## Generation script

Fill in \`VOICES\` first: the narrator's designed \`voice_…\` ID and the six
Extended Voice Library names you picked. Everything else comes from
\`scenes.js\`. It skips any line whose dry take already exists, so it can be
re-run after fixing a few lines (delete those takes first).

\`\`\`python
# pip install google-genai
import base64, json, os, pathlib
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.8-flash-tts"          # or gemini-3.8-flash-lite-tts for a draft pass
DRY = pathlib.Path("ethnographic-interviews/scene/_dry-originals")
DRY.mkdir(parents=True, exist_ok=True)

VOICES = {
    "NARRATOR":   "voice_...",            # the designed narrator voice (fallback: "Sulafat")
${allCast.filter(c => c.voice.library).map(c => `    "EVL:${c.slug}": "${c.voice.fallback}",   # ${c.name} — replace with the chosen Extended Voice Library voice`).join('\n')}
}

LINES = json.loads(r'''
${JSON.stringify(manifest, null, 0).replace(/\},\{/g, '},\n{')}
''')

def voice_for(v):
    return VOICES.get(v, v)

def make(line):
    out = DRY / (line["key"] + ".wav")
    if out.exists():
        return
    interaction = client.interactions.create(
        model=MODEL,
        input=[{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": line["text"],                     # verbatim, tags and all
                "annotations": [{"type": "speech_metadata", "style": line["style"]}],
            }],
        }],
        response_format={"type": "audio"},
        generation_config={"speech_config": [{"voice": voice_for(line["voice"])}]},
    )
    out.write_bytes(base64.b64decode(interaction.output_audio.data))
    print("wrote", out)

for line in LINES:
    make(line)
\`\`\`

Check the SDK's current call shape before running — these fields have moved
before. Listen to the first scene end to end before running the rest.

## After recording

**1 · Audition.** Play each scene straight through in order. Listen for: a tag
read aloud, a character who sounds like someone else, a line much louder or
quieter than its neighbours, a Bangladeshi voice that drifts into another accent.

**2 · Level and convert.** Per-line takes must sit at the same loudness or the
scene jumps in volume between speakers:

\`\`\`
ffmpeg -i _dry-originals/<key>.wav -af loudnorm=I=-18:TP=-1.5:LRA=11 -ar 24000 -ac 1 -codec:a libmp3lame -b:a 96k <key>.mp3
\`\`\`

**3 · Room tone** (character lines only — narrator lines stay dry). Use the
same pipeline as the interviews (\`ambience/amb.py\`): render every bed **from
the dry original**, never from a mixed file; the recipes are listed under each
scene's rooms, in dB relative to the take's own speech level. Low-pass every bed
at about 3.2 kHz, keep speech-to-bed above 20 dB in the 2–5 kHz band, fade the
bed in and out over 0.3 s (these takes are short), and peak-limit to about 0.97.
Because the lines are separate files, keep each room's bed **seeded by room, not
by line**, so consecutive lines in one room sound like one continuous place.

**4 · Align.** Run \`python3 ethnographic-interviews/tools/align_scenes.py\`. It
matches Whisper word times to the lines in \`scenes.js\` and writes
\`scene-timings.js\`, which makes the karaoke exact. **Re-run it whenever a line
is re-recorded** — otherwise the highlighting goes wrong silently.

---

## Checklists

### Audio — ${totalLines} lines

| File | Speaker | Voice | Tags | Generated | Auditioned | Levelled + mp3 | Bed | Aligned |
|---|---|---|---|:-:|:-:|:-:|:-:|:-:|
${order.flatMap(id => SCENES[id].lines.map((L, i) => {
  const who = L.w === 'N' ? 'Narrator' : SCENES[id].cast[L.w].name;
  const v = L.w === 'N' ? 'narrator' : voiceShort(SCENES[id].cast[L.w]);
  return `| \`${id}-${pad(i + 1)}\` | ${who} | ${v} | ${tagsOf(L.t).map(t => '`' + t.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '`').join(' ')} | ☐ | ☐ | ☐ | ${L.w === 'N' ? '—' : '☐'} | ☐ |`;
})).join('\n')}

### Panels — ${order.length * 6} images

| File | Scene | Generated | Continuity checked | webp + jpg | Placed |
|---|---|:-:|:-:|:-:|:-:|
${order.flatMap(id => SCENES[id].panels.map((_, i) => `| \`panels/${id}-${i + 1}\` | ${scen(id).title} | ☐ | ☐ | ☐ | ☐ |`)).join('\n')}

### Portraits — ${allCast.length} images

| File | Character | Scene | Generated | Cropped | Placed |
|---|---|---|:-:|:-:|:-:|
${allCast.map(c => `| \`cast/${c.slug}.jpg\` | ${c.name} | ${scen(c.scene).title} | ☐ | ☐ | ☐ |`).join('\n')}
`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md.join('\n'));
console.log('wrote', OUT, '—', totalLines, 'lines,', order.length * 6, 'panels,', allCast.length, 'portraits');
