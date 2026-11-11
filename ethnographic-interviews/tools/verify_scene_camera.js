#!/usr/bin/env node
// Exercise the real playback/camera functions against every authored line.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {SCENES} = require('../scenes.js');
const {SCENE_TIMINGS} = require('../scene-timings.js');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function source(name) {
  const start = html.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing ${name}`);
  return html.slice(start, html.indexOf('\n}', start) + 2);
}
const words = text => text.replace(/<[^>]+>\s*/g, '').match(/[A-Za-z’'-]+/g) || [];
for (const [id, scene] of Object.entries(SCENES)) {
  for (const [width, height] of [[640, 360], [320, 320]]) {
    const styles = {};
    const canvas = {
      dataset: {ratio: 2 / 3},
      style: {setProperty(key, value) { styles[key] = value; }},
      querySelector() { return {style: {}}; }
    };
    const root = {
      dataset: {panel: 1},
      classList: {contains() { return true; }},
      querySelector(selector) {
        return selector === '.scn-view' ? {clientWidth: width, clientHeight: height} : canvas;
      }
    };
    let offset = 0;
    const cues = scene.lines.map(line => {
      const times = SCENE_TIMINGS[id].w.slice(offset, offset + words(line.t).length);
      offset += times.length;
      return {t0: times[0][0], t1: times.at(-1)[1]};
    });
    const player = {li: 0, paused: false, cues, audio: {currentTime: 0, duration: SCENE_TIMINGS[id].dur}};
    const context = vm.createContext({
      document: {querySelector() { return root; }},
      sc: {id}, scn: player, scnOverview: {}, scnShown: {},
      scnData: () => scene, scnWords: words, scnEstWord: () => 0,
      scnPaintWords() {}, scnPaintProg() {},
      scnPaint() {
        root.dataset.panel = scene.lines[player.li].p;
        vm.runInContext('scnCamera()', context);
      }
    });
    vm.runInContext(source('scnFileTick') + '\n' + source('scnCamera'), context);
    vm.runInContext('scnCamera()', context);
    // Include backwards seeks, as well as ordinary forward playback.
    for (const lineIndex of [...scene.lines.keys(), ...[...scene.lines.keys()].reverse()]) {
      player.audio.currentTime = cues[lineIndex].t0 + .01;
      vm.runInContext('scnFileTick(scn)', context);
      const panel = scene.lines[lineIndex].p;
      assert.equal(Number(root.dataset.panel), panel, `${id}: wrong panel for line ${lineIndex}`);
      const w = parseFloat(canvas.style.width), h = parseFloat(canvas.style.height);
      const zoom = styles['--zoom'];
      const col = (panel - 1) % 2, row = Math.floor((panel - 1) / 2);
      assert(Math.abs(((col + .5) * w / 2 - w / 2) * zoom + parseFloat(styles['--pan-x'])) < .001);
      assert(Math.abs(((row + .5) * h / 3 - h / 2) * zoom + parseFloat(styles['--pan-y'])) < .001);
    }
    context.scnOverview[id] = true;
    vm.runInContext('scnCamera()', context);
    assert.equal(styles['--pan-x'], '0px');
    assert.equal(styles['--pan-y'], '0px');
    assert.equal(styles['--zoom'], .96);
  }
  console.log(`${id}: dialogue follows panels; backwards seeking and whole-comic view passed`);
}
// The camera properties must actually be consumed by the rendered comic.
assert.match(html, /\.scn-canvas\{[^}]*position:absolute[^}]*left:50%[^}]*top:50%[^}]*var\(--pan-x[^}]*var\(--pan-y[^}]*var\(--zoom/);
assert.match(html, /\.scn-canvas\.is-grid\{[^}]*display:grid[^}]*repeat\(2,[^}]*repeat\(3,/);
console.log('Verified camera synchronization for all 10 scenes at desktop and phone sizes.');
