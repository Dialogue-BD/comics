#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const root = path.resolve(__dirname, "..");
const { HINGSHA_STORY: story } = require(path.join(root, "story.js"));
const { HINGSHA_TIMINGS: timing } = require(path.join(root, "story-timings.js"));
const words = text => text.match(/[A-Za-z’'-]+/g) || [];
const script = story.lines.map(line => line.text).join("\n");
const count = words(script).length;

assert(timing, "missing timing data");
assert.equal(timing.script, script, "stale script timing data");
assert.equal(timing.w.length, count, "word/timing count mismatch");
let previous = 0;
for (const [start, end] of timing.w) {
  assert(Number.isFinite(start) && Number.isFinite(end), "non-numeric timing");
  assert(start >= previous && end >= start && end <= timing.dur, `invalid interval ${start}-${end}`);
  previous = end;
}
for (const [i, line] of story.lines.entries()) {
  assert(story.frames[line.frame - 1], `line ${i + 1}: missing frame ${line.frame}`);
  const camera = story.camera[i];
  assert(camera, `line ${i + 1}: missing camera cue`);
  assert(story.portraitPages[camera.p - 1], `line ${i + 1}: missing portrait page ${camera.p}`);
  for (const key of ["py", "pz", "lx", "ly", "lz"]) assert(Number.isFinite(camera[key]), `line ${i + 1}: invalid camera ${key}`);
}
for (const [i, item] of story.glossary.entries()) {
  assert(story.lines[item.line], `gloss ${i + 1}: missing line ${item.line}`);
  assert(story.lines[item.line].text.toLowerCase().includes(item.phrase.toLowerCase()),
    `gloss ${i + 1}: phrase not found: ${item.phrase}`);
}
for (const [i, frame] of story.frames.entries()) {
  const file = path.join(root, frame.src);
  assert(fs.statSync(file).size > 2000, `frame ${i + 1}: missing or empty asset`);
}
for (const [i, page] of story.portraitPages.entries()) {
  const file = path.join(root, page.src);
  assert(fs.statSync(file).size > 2000, `portrait page ${i + 1}: missing or empty asset`);
}
assert.equal(story.camera.length, story.lines.length, "camera/line count mismatch");
let lastBeatWord = -1;
for (const beat of story.cameraBeats || []) {
  const lineWords = words(story.lines[beat.line]?.text || "");
  assert(beat.word >= 0 && beat.word < lineWords.length, `invalid camera word: ${beat.label}`);
  const globalWord = story.lines.slice(0, beat.line).reduce((n, line) => n + words(line.text).length, 0) + beat.word;
  assert(!beat.page || story.portraitPages[beat.page - 1], `invalid camera page: ${beat.label}`);
  assert(!beat.frame || story.frames[beat.frame - 1], `invalid camera frame: ${beat.label}`);
  assert(globalWord > lastBeatWord, `camera beats out of order: ${beat.label}`);
  lastBeatWord = globalWord;
  for (const mode of ["portrait", "landscape"]) {
    const rect = beat[mode];
    assert(rect.length === 4 && rect.every(Number.isFinite), `invalid ${mode} panel: ${beat.label}`);
    assert(rect[0] >= 0 && rect[1] >= 0 && rect[2] > 0 && rect[3] > 0 && rect[0] + rect[2] <= 1 && rect[1] + rect[3] <= 1,
      `panel exceeds image: ${beat.label}`);
  }
}
for (let line = 0; line < story.lines.length; line++) {
  assert(story.cameraBeats.some(beat => beat.line === line && beat.word === 0), `line ${line + 1} has no opening panel cue`);
}
const audio = path.join(root, story.audio);
const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
  "-of", "default=nw=1:nk=1", audio], { encoding: "utf8" }));
assert(Math.abs(duration - timing.dur) < .25, `audio duration mismatch: ${duration} vs ${timing.dur}`);
const audit = JSON.parse(fs.readFileSync(path.join(root, "review/alignment-audit.json")));
assert(audit.exact_fraction >= .9, `ASR audit below threshold: ${audit.exact_fraction}`);
assert.equal(audit.word_count, count, "audit word count mismatch");

console.log(`Verified Hingsha: ${story.frames.length} landscape frames, ${story.portraitPages.length} portrait pages, ${story.lines.length} camera cues, ${count} timed words, ${duration.toFixed(1)}s audio, ${(audit.exact_fraction * 100).toFixed(1)}% exact ASR.`);
