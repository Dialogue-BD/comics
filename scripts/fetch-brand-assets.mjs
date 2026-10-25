// Private GitHub access stays on the server through Replit's managed connector.
import { ReplitConnectors } from '@replit/connectors-sdk';
import { PNG } from 'pngjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export function squareIcon(bytes, size) {
  const source = PNG.sync.read(bytes);
  const output = new PNG({ width: size, height: size });
  output.data.fill(0);
  const scale = size * 0.88 / Math.max(source.width, source.height);
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const left = Math.floor((size - width) / 2);
  const top = Math.floor((size - height) / 2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = Math.min(source.width - 1, Math.floor(x / scale));
      const sy = Math.min(source.height - 1, Math.floor(y / scale));
      const from = (sy * source.width + sx) * 4;
      const to = ((top + y) * size + left + x) * 4;
      source.data.copy(output.data, to, from, from + 4);
    }
  }
  return PNG.sync.write(output);
}

export async function fetchBrand(knownCommit, proxy) {
  const config = JSON.parse(await readFile(new URL('../brand/source.json', import.meta.url), 'utf8'));
  const base = `/repos/${config.repository}`;
  const commitResponse = await proxy(`${base}/commits/${encodeURIComponent(config.branch)}`);
  if (!commitResponse.ok) throw new Error(`GitHub commit request: HTTP ${commitResponse.status}`);
  const commit = (await commitResponse.json()).sha;
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('Invalid brand commit');
  if (commit === knownCommit) return { commit, unchanged: true };
  const pairs = await Promise.all(Object.entries(config.assets).map(async ([key, path]) => {
    const response = await proxy(`${base}/contents/${path}?ref=${commit}`);
    if (!response.ok) throw new Error(`GitHub asset request: HTTP ${response.status}`);
    const data = await response.json();
    if (data.encoding !== 'base64' || !data.content) throw new Error('Invalid asset response');
    const bytes = Buffer.from(data.content, 'base64');
    if (key.endsWith('Svg') && !bytes.toString('utf8').includes('<svg')) throw new Error('Invalid SVG');
    if (key.endsWith('Png')) PNG.sync.read(bytes);
    return [key, bytes];
  }));
  const assets = Object.fromEntries(pairs);
  const resources = {
    '/brand/dialogue-logo.svg': assets.logoSvg,
    '/brand/dialogue-logo.png': assets.logoPng,
    '/brand/dialogue-logomark-d.svg': assets.iconSvg,
    '/brand/dialogue-logomark-d.png': assets.iconPng,
    '/favicon.svg': assets.iconSvg,
    '/favicon.png': squareIcon(assets.iconPng, 48),
    '/apple-touch-icon.png': squareIcon(assets.iconPng, 180),
  };
  return { commit, resources: Object.fromEntries(
    Object.entries(resources).map(([path, bytes]) => [path, bytes.toString('base64')])
  ) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const sdk = new ReplitConnectors();
    const result = await fetchBrand(process.argv[2], path => sdk.proxy('github-source-control', path));
    process.stdout.write(JSON.stringify(result));
  } catch {
    // Never print connector errors that could contain authentication details.
    process.stderr.write('Brand repository refresh failed; check GitHub integration access.\n');
    process.exitCode = 1;
  }
}
