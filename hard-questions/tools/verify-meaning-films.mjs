/* Check the exported pictures without confusing a visual revision with new audio.
   Run after render-three-films.mjs; the renderer keeps the prior films locally. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, '../generated-artifacts/human-voices-verification');
const originals = resolve(root, '../generated-artifacts/human-voices-original-films');
const transcripts = JSON.parse(await readFile(resolve(root, 'transcripts.json')));
const audioHash = path => execFileSync('ffmpeg',
  ['-v', 'error', '-i', path, '-map', '0:a:0', '-c', 'copy', '-f', 'hash', '-'],
  {encoding: 'utf8'}).trim();
const report = [];

for (const [id, transcript] of Object.entries(transcripts)) {
  const path = resolve(root, 'films', `${id}.mp4`);
  const metadata = JSON.parse(execFileSync('ffprobe',
    ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path],
    {encoding: 'utf8'}));
  const video = metadata.streams.find(s => s.codec_type === 'video');
  const audio = metadata.streams.find(s => s.codec_type === 'audio');
  assert.equal(video.codec_name, 'h264', `${id}: H.264`);
  assert.equal(video.width, 1280);
  assert.equal(video.height, 720);
  assert.equal(video.pix_fmt, 'yuv420p');
  assert.equal(video.avg_frame_rate, '24/1');
  assert.equal(audio.codec_name, 'aac');
  assert.ok(Math.abs(Number(metadata.format.duration) - transcript.duration) < .15,
    `${id}: original duration`);
  const originalAudio = audioHash(resolve(originals, `${id}.mp4`));
  const exportedAudio = audioHash(path);
  assert.equal(exportedAudio, originalAudio, `${id}: encoded audio packets unchanged`);
  execFileSync('ffmpeg', ['-v', 'error', '-xerror', '-i', path, '-f', 'null', '-'],
    {stdio: ['ignore', 'pipe', 'pipe']});
  report.push({id, duration: Number(metadata.format.duration), width: video.width,
    height: video.height, fps: video.avg_frame_rate, audioPacketsUnchanged: true,
    fullDecode: 'passed', audioHash: exportedAudio});
  console.log(`PASS ${id}: full decode, 1280×720 / 24 fps, original AAC packets unchanged`);
}
await mkdir(output, {recursive: true});
await writeFile(resolve(output, 'media.json'), JSON.stringify(report, null, 2));
