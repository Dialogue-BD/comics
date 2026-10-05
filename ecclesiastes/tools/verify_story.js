// Verify the contract between captions, recording, images, and camera cues.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const { ECCLESIASTES_STORY: S } = require(path.join(root, "story.js"));
const { ECCLESIASTES_TIMINGS: T } = require(path.join(root, "story-timings.js"));
const count = text => (text.match(/[A-Za-z’'-]+/g) || []).length;
assert.equal(T.script, S.lines.map(line => line.text).join("\n"), "Stale displayed transcript");
assert.equal(T.w.length, S.lines.reduce((n, line) => n + count(line.text), 0));
const audio = path.join(root, S.audio);
assert.equal(crypto.createHash("sha256").update(fs.readFileSync(audio)).digest("hex"), T.audio_sha256, "Stale audio alignment");
const duration = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio], { encoding: "utf8" });
assert(Math.abs(duration - T.dur) < .3, "Audio duration mismatch");
let previous = 0;
for (const [start, end] of T.w) {
  assert(Number.isFinite(start) && Number.isFinite(end));
  assert(start >= previous - .002 && end >= start && end <= T.dur);
  previous = end;
}
for (const image of S.frames) {
  const file = path.join(root, image.src);
  assert(fs.existsSync(file), `Missing ${image.src}`);
  const info = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=width,height", "-of", "json", file], { encoding: "utf8" })).streams[0];
  assert.equal(info.width, image.width);
  assert.equal(info.height, image.height);
}
for (let i = 0; i < S.lines.length; i++) {
  const line = S.lines[i];
  assert(line.frame >= 1 && line.frame <= S.frames.length);
  assert(count(line.text) <= 25, "Caption is too long");
  assert(S.cameraBeats.some(beat => beat.line === i && beat.word === 0), `Caption ${i} has no opening camera target`);
}
for (const beat of S.cameraBeats) {
  assert(beat.word >= 0 && beat.word < count(S.lines[beat.line].text));
  assert.equal(beat.frame, S.lines[beat.line].frame);
  for (const rect of [beat.portrait, beat.landscape]) {
    assert(rect.length === 4 && rect.every(Number.isFinite));
    const [x, y, width, height] = rect;
    assert(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= 1.001 && y + height <= 1.001, `Out-of-page target: ${beat.label}`);
  }
}
for (const item of S.glossary) {
  assert(S.lines[item.line].text.toLowerCase().includes(item.phrase.toLowerCase()));
  assert(item.meaning && /[\u0980-\u09ff]/.test(item.bn));
}
assert.equal(S.chapters.length, 10);
assert.equal(S.chapters[0].start, 0);
assert(Math.abs(S.chapters.at(-1).end - T.dur) < .02);
console.log(`Verified Ecclesiastes: ${S.chapters.length} chapters, ${S.lines.length} captions, ${S.cameraBeats.length} camera beats, ${S.glossary.length} bilingual explanations, ${T.w.length} timed words, ${T.dur}s.`);
