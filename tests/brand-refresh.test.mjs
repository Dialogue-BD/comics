import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fetchBrand, squareIcon } from '../scripts/fetch-brand-assets.mjs';

const config = JSON.parse(await readFile(new URL('../brand/source.json', import.meta.url)));
const commit = 'b'.repeat(40);
const png = PNG.sync.write(new PNG({ width: 40, height: 20 }));
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
const motion = Buffer.from(JSON.stringify({ w: 1920, h: 1080, ip: 0, op: 120, layers: [], assets: [] }));
const response = value => new Response(JSON.stringify(value));

test('unchanged commit needs only one GitHub request', async () => {
  let count = 0;
  assert.deepEqual(await fetchBrand(commit, async () => {
    count++;
    return response({ sha: commit });
  }), { commit, unchanged: true });
  assert.equal(count, 1);
});

test('every asset uses one immutable commit; complete snapshot includes icons', async () => {
  const requests = [];
  const result = await fetchBrand('a'.repeat(40), async path => {
    requests.push(path);
    if (path.includes('/commits/')) return response({ sha: commit });
    assert.ok(path.endsWith(`?ref=${commit}`));
    const bytes = path.includes('.json?') ? motion : path.includes('.svg?') ? svg : png;
    return response({ encoding: 'base64', content: bytes.toString('base64') });
  });
  assert.equal(result.commit, commit);
  assert.equal(requests.length, 6);
  assert.equal(Object.keys(result.resources).length, 8);
  assert.deepEqual(Buffer.from(result.resources['/brand/dialogue-logo-motion.json'], 'base64'), motion);
  assert.deepEqual(Buffer.from(result.resources['/favicon.svg'], 'base64'), svg);
  assert.equal(PNG.sync.read(Buffer.from(result.resources['/favicon.png'], 'base64')).width, 48);
  assert.equal(PNG.sync.read(Buffer.from(result.resources['/apple-touch-icon.png'], 'base64')).width, 180);
});

test('asset failure rejects the entire refresh', async () => {
  await assert.rejects(fetchBrand('', async path => path.includes('/commits/')
    ? response({ sha: commit }) : new Response('', { status: 403 })));
});

test('square icon preserves aspect ratio and transparent padding', () => {
  const source = new PNG({ width: 40, height: 20 });
  source.data.fill(255);
  const icon = PNG.sync.read(squareIcon(PNG.sync.write(source), 100));
  assert.equal(icon.width, 100);
  assert.equal(icon.height, 100);
  assert.equal(icon.data[3], 0);
  assert.equal(icon.data[(50 * 100 + 50) * 4 + 3], 255);
});

test('source paths select the requested Studio Modern and 03A variants', () => {
  assert.ok(config.assets.logoSvg.includes('02-Dialogue-Primary-Studio-Modern'));
  assert.ok(config.assets.iconSvg.includes('03A-Logomark-D-Color-On-Light-Transparent'));
  assert.equal(config.assets.logoMotion, 'motion/01-Studio-Modern-Lockup-Intro-lottie.json');
});
