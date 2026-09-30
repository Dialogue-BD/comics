#!/usr/bin/env node
// Check the contract between scripts, recordings, images and karaoke timings.
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const {SCENES, sceneSegments} = require(path.join(root, 'scenes.js'));
const {SCENE_TIMINGS} = require(path.join(root, 'scene-timings.js'));
const clean = t => t.replace(/<[^>]+>\s*/g, '').replace(/\s+/g, ' ').trim();
for (const [id, scene] of Object.entries(SCENES)) {
  const t = SCENE_TIMINGS[id];
  const lines = scene.lines.map(l => clean(l.t));
  const count = lines.reduce((n, text) => n + (text.match(/[A-Za-z’'-]+/g) || []).length, 0);
  assert(t, `${id}: missing timings`);
  assert.equal(t.script, lines.join('\n'), `${id}: stale script timings`);
  assert.equal(t.w.length, count, `${id}: word count`);
  let previous = 0;
  for (const [start, end] of t.w) {
    assert(start >= previous && end >= start && end <= t.dur, `${id}: invalid word interval ${start}–${end}`);
    previous = start;
  }
  for (const line of scene.lines) {
    assert(line.w === 'N' || scene.cast[line.w], `${id}: unknown speaker`);
    assert(line.p >= 1 && line.p <= scene.panels.length, `${id}: missing panel`);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scene/_build', id + '.json')));
  assert.deepEqual(manifest.takes.map(t => t.lines), sceneSegments(id).map(t => t.lines), `${id}: stale assembly`);
  const file = path.join(root, 'scene', id + '.mp3');
  const dur = Number(execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',file], {encoding:'utf8'}));
  assert(Math.abs(dur - t.dur) < .25, `${id}: audio duration mismatch`);
  const images = scene.panelSheet ? [`${id}-sheet.webp`] : scene.panels.map((_,i) => `${id}-${i+1}.webp`);
  for (const image of images) assert(fs.statSync(path.join(root, 'scene/panels', image)).size > 2000, `${id}: empty image`);
  console.log(`${id}: ${scene.lines.length} lines, ${count} timed words, ${dur.toFixed(1)}s, artwork present`);
}
console.log(`Verified ${Object.keys(SCENES).length} scenes.`);
