import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const [, , outputDirectory, manifestPath, requestedTakes = '1'] = process.argv;
const takes = Number(requestedTakes);
if (!outputDirectory || !Number.isInteger(takes) || takes < 1) {
  throw new Error('Pass an output directory, optional manifest, and a positive take count.');
}

const manifest = manifestPath || new URL('tts/brian-repairs.tsv', import.meta.url);
const client = new ElevenLabsClient();
const voiceIds = { alice: 'Xb7hH8MSUJpSbSDYk0k2', brian: 'nPczCjzI2devNBz1zQrb' };
await mkdir(outputDirectory, { recursive: true });

async function record(voice, id, text, seed) {
  const directory = manifestPath ? join(outputDirectory, voice) : outputDirectory;
  await mkdir(directory, { recursive: true });
  const name = manifestPath ? id + '-' + seed : id;
  const file = join(directory, name + '.mp3');
  const temporary = file + '.part';
  try {
    const speech = await client.textToSpeech.convert(voiceIds[voice], {
      text,
      seed,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
      voiceSettings: { stability: 0.5, similarityBoost: 0.75, useSpeakerBoost: true },
    });
    await pipeline(Readable.fromWeb(speech), createWriteStream(temporary));
    await rename(temporary, file);
    console.log('Recorded ' + voice + ' ' + name);
    return true;
  } catch (error) {
    await rm(temporary, { force: true });
    console.error('Could not record ' + voice + ' ' + name + ' (' + (error.statusCode || error.name) + ').');
    return false;
  }
}

for (const line of (await readFile(manifest, 'utf8')).trim().split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [entry, text] = line.split('\t');
  const match = /^([a-z0-9-]+)@(alice|brian)$/.exec(entry);
  if (!match || !text) throw new Error('Expected a clip ID, an @alice or @brian suffix, and its text.');
  const [, id, voice] = match;
  for (let take = 1; take <= takes; take++) {
    if (!await record(voice, id, text, take)) process.exit(1);
  }
}
