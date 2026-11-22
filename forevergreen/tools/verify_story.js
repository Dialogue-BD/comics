#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");

const { FOREVERGREEN_STORY: S } = require(path.join(ROOT, "story.js"));
const { FOREVERGREEN_TIMINGS: T } = require(path.join(ROOT, "beat-timings.js"));

// 1. Metadata & acts
assert.equal(S.id, "forevergreen");
assert.equal(S.youtubeId, "B4EPW7JUMTM");
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

// 2. Beats, audio files, durations & zero timing collisions
assert.ok(S.beats.length >= 30, "Expected at least 30 narration beats");
assert.equal(T.version, S.version, "beat-timings.js version must match story.js version");

const actsById = Object.fromEntries(S.acts.map((a) => [a.id, a]));
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
}

// 3. Glossary integrity
Object.entries(S.glossary).forEach(([phrase, entry]) => {
  assert.ok(entry.kind && entry.meaning && entry.bn, `Glossary "${phrase}" missing kind/meaning/bn`);
  assert.ok(/[\u0980-\u09FF]/.test(entry.bn), `Glossary "${phrase}" Bangla field lacks Bangla script`);
});

// 4. Canonical branding, favicons, YouTube referrerpolicy, and hub registration
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

assert.ok(
  playerCore.includes('setAttribute("referrerpolicy", "strict-origin-when-cross-origin")'),
  "player-core.js must set referrerpolicy='strict-origin-when-cross-origin' before YT.Player attaches"
);
assert.ok(rootHub.includes('"/forevergreen/"'), "Root index.html missing /forevergreen/ activity card");
assert.ok(rootHub.includes("https://dialogue-bd.com/forevergreen/"), "Root index.html missing /forevergreen/ qrUrl");

console.log(
  `PASS: ${S.acts.length} acts, ${S.beats.length} beats (0 collisions), ${Object.keys(S.glossary).length} glossary entries, branding & YouTube embed contracts verified.`
);
