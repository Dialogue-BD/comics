import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { semanticTimeline, semanticAt } from '../semantic-timeline.mjs';

const transcripts = JSON.parse(await readFile(new URL('../transcripts.json', import.meta.url)));
assert.deepEqual(Object.keys(semanticTimeline).sort(), Object.keys(transcripts).sort());
let scenes = 0, beats = 0;
for (const [id, transcript] of Object.entries(transcripts)) {
  const timeline = semanticTimeline[id];
  assert.equal(timeline.length, transcript.scenes.length, `${id}: each original scene needs a teaching visual`);
  for (let index = 0; index < transcript.scenes.length; index++) {
    const scene = transcript.scenes[index], semantic = timeline[index];
    scenes++;
    assert.ok(semantic.visual && semantic.people.length >= 2, `${id}/${index}: name the scene and people`);
    assert.ok(semantic.moments.length, `${id}/${index}: provide timed semantic beats`);
    assert.equal(semantic.moments[0][0], scene.start, `${id}/${index}: first beat starts at scene boundary`);
    let previous = scene.start - 1;
    for (const [time, label, status, action] of semantic.moments) {
      beats++;
      assert.ok(time >= scene.start && time < scene.end, `${id}/${index}: beat lies inside its original scene`);
      assert.ok(time >= previous, `${id}/${index}: beats are sorted`);
      assert.ok(transcript.cues.some(cue => cue.start === time || cue.end === time) || time === scene.start,
        `${id}/${index}: beat aligns with a timed transcript cue (${time})`);
      assert.ok(label && status && action, `${id}/${index}: beat has a plain-language label and visual action`);
      const at = semanticAt(id, index, time);
      assert.equal(at.label, label, `${id}/${index}: seek lands on the intended beat`);
      assert.equal(at.action, action);
      assert.deepEqual(semanticAt(id, index, time), semanticAt(id, index, time), 'repeated seeks are deterministic');
      if (time > scene.start) assert.equal(semanticAt(id, index, time - .001).label,
        semantic.moments[semantic.moments.indexOf(semantic.moments.find(m => m[0] === time)) - 1][1],
        `${id}/${index}: just-before boundary retains previous beat`);
      previous = time;
    }
    assert.equal(semanticAt(id, index, scene.start).label, semantic.moments[0][1]);
    if (index < transcript.scenes.length - 1) {
      assert.equal(semanticAt(id, index + 1, transcript.scenes[index + 1].start).label,
        semanticTimeline[id][index + 1].moments[0][1], `${id}: scene boundary selects next visual beat`);
    }
  }
}
assert.equal(scenes, 27);
const actionAt = (id, sceneIndex, time) => semanticAt(id, sceneIndex, time).action;
assert.equal(actionAt('kamille', 1, 8.95), 'patient');
assert.equal(actionAt('kamille', 1, 8.96), 'six-years');
assert.equal(actionAt('kamille', 1, 10.88), 'answer');
assert.deepEqual([18.76, 23.06, 26.98].map(time => actionAt('larissa', 2, time)), ['replace', 'partner', 'ideas']);
assert.equal(actionAt('larissa', 1, 8.94), 'learning');
assert.equal(actionAt('scott', 1, 15.3), 'create');
assert.deepEqual([3.5, 6.8].map(time => actionAt('tiffany', 0, time)), ['apart', 'together']);
assert.equal(actionAt('daniel', 2, 21.96), 'tedious');
assert.equal(actionAt('sarah', 1, 10.16), 'future');
assert.match(semanticAt('robert', 0, 0).label, /medically retired/);
console.log(`PASS: semantic teaching timeline covers ${scenes} original scenes and ${beats} cue-aligned beats with deterministic seek boundaries.`);
