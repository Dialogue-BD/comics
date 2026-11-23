#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");

const { FOREVERGREEN_STORY: S } = require(path.join(ROOT, "story.js"));
const { FOREVERGREEN_WORD_GLOSSARY: WG } = require(path.join(ROOT, "word-glossary.js"));
const { FOREVERGREEN_ENTITIES: ENTITIES, FOREVERGREEN_SCENES: SCENES } = require(path.join(ROOT, "scene-items.js"));
const { FOREVERGREEN_TIMINGS: T } = require(path.join(ROOT, "beat-timings.js"));

// 1. Metadata, local MP4 video & acts
assert.equal(S.id, "forevergreen");
assert.equal(S.videoSrc, "video/forevergreen.mp4");
const videoPath = path.join(ROOT, S.videoSrc);
assert.ok(fs.existsSync(videoPath), `Missing local film file: ${S.videoSrc}`);
assert.ok(fs.statSync(videoPath).size > 10 * 1024 * 1024, "Local film MP4 unexpectedly small");
const dataSaverVideo = path.join(ROOT, S.dataSaverVideoSrc);
assert.ok(fs.existsSync(dataSaverVideo), `Missing data saver film file: ${S.dataSaverVideoSrc}`);
assert.ok(fs.statSync(dataSaverVideo).size < 30 * 1024 * 1024, "Data saver film must fit under the proxy response limit");
assert.equal(S.acts.length, 5, "Expected exactly 5 acts");

for (let i = 0; i < S.acts.length; i++) {
  const act = S.acts[i];
  assert.equal(act.id, i + 1, `Act ${i + 1} id mismatch`);
  assert.ok(act.start >= 0 && act.end <= S.duration && act.start < act.end, `Act ${act.id} bounds invalid`);
  assert.ok(act.title && act.titleBn, `Act ${act.id} missing English or Bangla title`);
  assert.ok(act.discussionPrompt, `Act ${act.id} missing discussionPrompt`);
  assert.ok(Array.isArray(act.sentenceFrames) && act.sentenceFrames.length >= 2, `Act ${act.id} needs sentenceFrames`);
  assert.ok(Array.isArray(act.memoryPhrases) && act.memoryPhrases.length === 4, `Act ${act.id} needs 4 memoryPhrases`);
  act.memoryPhrases.forEach((phrase) => {
    assert.ok(S.glossary[phrase], `Act ${act.id} memoryPhrase "${phrase}" missing from glossary`);
  });
  if (i > 0) {
    assert.equal(act.start, S.acts[i - 1].end + 1, `Act ${act.id} must be contiguous with Act ${i}`);
  }
}

// 2. Beats, Phonon TTS audio files, durations & zero timing collisions
assert.ok(S.beats.length >= 40, "Expected at least 40 narration beats");
assert.equal(T.version, S.version, "beat-timings.js version must match story.js version");
assert.equal(T.engine, "phonon", "beat-timings.js must be generated with Phonon TTS");

const actsById = Object.fromEntries(S.acts.map((a) => [a.id, a]));
const WORD_RE = /[A-Za-z0-9À-ÖØ-öø-ÿ’'-]+/g;
const missingWords = [];

for (let i = 0; i < S.beats.length; i++) {
  const beat = S.beats[i];
  const act = actsById[beat.act];
  assert.ok(act, `Beat ${beat.id} references unknown act ${beat.act}`);
  assert.ok(beat.start >= act.start && beat.start < act.end, `Beat ${beat.id} start outside Act ${act.id}`);

  const audioPath = path.join(ROOT, beat.audio);
  assert.ok(fs.existsSync(audioPath), `Missing audio file: ${beat.audio}`);
  assert.ok(fs.statSync(audioPath).size > 1000, `Audio file too small: ${beat.audio}`);

  const dur = T.durations[beat.id];
  assert.ok(Number.isFinite(dur) && dur > 0.5, `Missing/invalid timing for ${beat.id}`);
  const endTime = beat.start + dur;
  assert.ok(endTime <= act.end - 0.5, `Beat ${beat.id} overruns Act ${act.id} end (${endTime.toFixed(2)}s > ${act.end - 0.5}s)`);

  if (i + 1 < S.beats.length) {
    const nextBeat = S.beats[i + 1];
    assert.ok(nextBeat.start > beat.start, `Beat ${nextBeat.id} is not strictly after ${beat.id}`);
    const gap = nextBeat.start - endTime;
    assert.ok(gap >= 1.5, `Beat ${beat.id} leaves only ${gap.toFixed(2)}s before ${nextBeat.id}`);
  }

  beat.phrases.forEach((phrase) => {
    assert.ok(S.glossary[phrase], `Beat ${beat.id} phrase "${phrase}" missing from glossary`);
    assert.ok(
      beat.text.toLowerCase().includes(phrase.toLowerCase()),
      `Beat ${beat.id} text does not contain phrase "${phrase}"`
    );
  });

  for (const word of beat.text.match(WORD_RE) || []) {
    const key = word.toLowerCase();
    const wEntry = WG[key];
    if (!wEntry || !wEntry.pos || !wEntry.def || !wEntry.bn) {
      missingWords.push(key);
    }
  }
}

assert.equal(missingWords.length, 0, `Words missing from word-glossary.js: ${[...new Set(missingWords)].join(", ")}`);

// 3. Glossary integrity (phrases + Phonon phrase audio + words)
const phraseAudioMap = T.phraseAudio || {};
const phraseKeys = Object.keys(S.glossary);
phraseKeys.forEach((phrase) => {
  const entry = S.glossary[phrase];
  assert.ok(entry.kind && entry.meaning && entry.bn, `Glossary "${phrase}" missing kind/meaning/bn`);
  assert.ok(/[\u0980-\u09FF]/.test(entry.bn), `Glossary "${phrase}" Bangla field lacks Bangla script`);
  const relAudio = phraseAudioMap[phrase];
  assert.ok(relAudio, `Phrase "${phrase}" missing from beat-timings.js phraseAudio`);
  const fullAudio = path.join(ROOT, relAudio);
  assert.ok(fs.existsSync(fullAudio), `Missing phrase audio file: ${relAudio}`);
  assert.ok(fs.statSync(fullAudio).size > 1000, `Phrase audio file too small: ${relAudio}`);
});

const wordAudioMap = T.wordAudio || {};
Object.entries(WG).forEach(([word, entry]) => {
  assert.ok(entry.pos && entry.def && entry.bn, `Word glossary "${word}" missing pos/def/bn`);
  assert.ok(/[\u0980-\u09FF]/.test(entry.bn), `Word glossary "${word}" Bangla field lacks Bangla script`);
  const relWordAudio = wordAudioMap[word];
  assert.ok(relWordAudio, `Word "${word}" missing from beat-timings.js wordAudio`);
  const fullWordAudio = path.join(ROOT, relWordAudio);
  assert.ok(fs.existsSync(fullWordAudio), `Missing word Phonon audio: ${relWordAudio}`);
  assert.ok(fs.statSync(fullWordAudio).size > 1000, `Word audio too small: ${relWordAudio}`);
});

// 4. Canonical branding, favicons, no YouTube embed, and hub registration
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const classroomHtml = fs.readFileSync(path.join(ROOT, "classroom.html"), "utf8");
const playerCore = fs.readFileSync(path.join(ROOT, "player-core.js"), "utf8");
const rootHub = fs.readFileSync(path.join(REPO_ROOT, "index.html"), "utf8");

[indexHtml, classroomHtml].forEach((html, idx) => {
  const name = idx === 0 ? "index.html" : "classroom.html";
  assert.ok(html.includes("../brand/dialogue-logo.png?v=a53d061"), `${name} missing canonical logo`);
  assert.ok(html.includes('href="/favicon.svg?v=03b"'), `${name} missing 03b SVG favicon`);
  assert.ok(html.includes('href="/favicon.png?v=03b"'), `${name} missing 03b PNG favicon`);
});

assert.ok(!playerCore.includes("youtube.com/embed"), "player-core.js must use local MP4 video, not YouTube embed");
assert.ok(!playerCore.includes("iframe_api"), "player-core.js must not load YouTube iframe API");
assert.ok(rootHub.includes('"/forevergreen/"'), "Root index.html missing /forevergreen/ activity card");
assert.ok(rootHub.includes("https://dialogue-bd.com/forevergreen/"), "Root index.html missing /forevergreen/ qrUrl");

// 5. Entity-First SAM 2 Tracked Busy-Picture Catalog + Phonon item MP3s
assert.ok(Array.isArray(ENTITIES) && ENTITIES.length >= 30, `Expected at least 30 canonical entities, got ${(ENTITIES || []).length}`);
const VALID_CATS = new Set(["character", "prop", "set_piece", "part", "expression"]);
const entityById = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));
ENTITIES.forEach((ent) => {
  assert.ok(ent.id && ent.name && ent.bn && VALID_CATS.has(ent.category), `Invalid canonical entity: ${JSON.stringify(ent)}`);
  assert.ok(/[\u0980-\u09FF]/.test(ent.bn), `Entity ${ent.id} Bangla lacks Bangla script`);
  assert.ok(Array.isArray(ent.appearances) && ent.appearances.length >= 1, `Entity ${ent.id} missing appearances`);
});

assert.equal(SCENES.length, 150, `Expected 150 contiguous Busy-Picture shots, got ${SCENES.length}`);
assert.equal(SCENES[0].start, 0, "First shot must start at 0s");
assert.equal(SCENES[SCENES.length - 1].end, S.storyEndSec, "Last shot must cover storyEndSec (721s)");
let totalItems = 0;
let totalBeats = 0;
let totalFormClips = 0;
const seenItemIds = new Set();
const FORM_KEYS = ["presentContinuous", "simplePast", "simplePresent", "question"];

function verifyAudioSource(itemId, src) {
  assert.ok(src.sentence && src.sentenceBn && src.audio, `Item ${itemId} missing sentence/audio`);
  assert.ok(src.grammar && src.grammar.presentContinuous && src.grammar.simplePast && src.grammar.simplePresent && src.grammar.question, `Item ${itemId} missing grammar forms`);
  const itemAudioPath = path.join(ROOT, src.audio);
  assert.ok(fs.existsSync(itemAudioPath), `Missing item Phonon audio: ${src.audio}`);
  assert.ok(fs.statSync(itemAudioPath).size > 1000, `Item audio too small: ${src.audio}`);
  assert.ok(src.grammarAudio, `Item ${itemId} missing grammarAudio`);
  FORM_KEYS.forEach((gk) => {
    const relForm = src.grammarAudio[gk];
    assert.ok(relForm, `Item ${itemId} missing grammarAudio.${gk}`);
    const formAudioPath = path.join(ROOT, relForm);
    assert.ok(fs.existsSync(formAudioPath), `Missing item form Phonon audio: ${relForm}`);
    assert.ok(fs.statSync(formAudioPath).size > 1000, `Item form audio too small: ${relForm}`);
    totalFormClips++;
  });
}

for (let i = 0; i < SCENES.length; i++) {
  const sc = SCENES[i];
  if (i > 0) {
    const diff = Math.abs(sc.start - SCENES[i - 1].end);
    assert.ok(diff < 0.05, `Shot ${sc.id} not contiguous with ${SCENES[i - 1].id} (diff=${diff})`);
  }
  assert.ok(sc.frameSec >= sc.start - 0.01 && sc.frameSec <= sc.end + 0.01, `Shot ${sc.id} frameSec (${sc.frameSec}) outside [${sc.start}, ${sc.end}]`);
  assert.ok(sc.frameSec >= 0 && sc.frameSec <= S.storyEndSec, `Shot ${sc.id} frameSec out of bounds`);
  if (sc.id !== "s01") {
    assert.ok(Array.isArray(sc.items) && sc.items.length >= 1, `Shot ${sc.id} needs >= 1 canonical entity`);
  }
  (sc.items || []).forEach((item) => {
    totalItems++;
    assert.ok(!seenItemIds.has(item.id), `Duplicate item id: ${item.id}`);
    seenItemIds.add(item.id);
    const canon = entityById[item.entityId];
    assert.ok(canon, `Item ${item.id} references unknown entityId ${item.entityId}`);
    assert.equal(item.name, canon.name, `Item ${item.id} name mismatch with entity ${canon.id}`);
    assert.equal(item.bn, canon.bn, `Item ${item.id} bn mismatch with entity ${canon.id}`);
    assert.equal(item.category, canon.category, `Item ${item.id} category mismatch with entity ${canon.id}`);
    assert.ok(Array.isArray(item.box) && item.box.length === 4, `Item ${item.id} missing 4-element box`);
    const [ymin, xmin, ymax, xmax] = item.box;
    assert.ok(ymin >= 0 && xmin >= 0 && ymax <= 1000 && xmax <= 1000 && ymin < ymax && xmin < xmax, `Item ${item.id} invalid box`);
    if (Array.isArray(item.beats) && item.beats.length) {
      item.beats.forEach((b, bIdx) => {
        totalBeats++;
        verifyAudioSource(`${item.id}#b${bIdx}`, b);
      });
    } else {
      totalBeats++;
      verifyAudioSource(item.id, item);
    }
    if (Array.isArray(item.track)) {
      let prevT = -1;
      item.track.forEach((entry) => {
        assert.ok(Array.isArray(entry) && (entry.length === 2 || entry.length === 5), `Item ${item.id} bad track entry`);
        assert.ok(typeof entry[0] === "number" && entry[0] > prevT, `Item ${item.id} non-increasing track time`);
        prevT = entry[0];
        if (entry.length === 2) {
          assert.equal(entry[1], null, `Item ${item.id} 2-elem track entry must end with null`);
        } else {
          const [ty0, tx0, ty1, tx1] = entry.slice(1);
          assert.ok(ty0 >= 0 && tx0 >= 0 && ty1 <= 1000 && tx1 <= 1000 && ty0 < ty1 && tx0 < tx1, `Item ${item.id} invalid track box`);
        }
      });
    }
  });
}
assert.ok(totalItems >= 800, `Expected at least 800 entity-shot tracks, got ${totalItems}`);

console.log(
  `PASS: local MP4 verified, ${S.acts.length} acts, ${S.beats.length} Phonon beats (0 collisions), ${phraseKeys.length} Phonon phrase clips, ${ENTITIES.length} canonical entities across ${SCENES.length} shots (${totalItems} tracks, ${totalBeats} beat windows w/ Phonon MP3s, ${totalFormClips} grammar-form Phonon MP3s), ${Object.keys(WG).length} clickable words (100% coverage), branding & hub contracts verified.`
);
