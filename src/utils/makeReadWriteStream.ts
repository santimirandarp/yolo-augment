import { createInterface } from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'node:path';

export function makeReadWriteStreams(
  inputDirectory: string,
  outputDirectory: string,
) {
  const streamFrom = join(inputDirectory, '_annotations.txt');
  const streamTo = join(outputDirectory, '_annotations.txt');
  const readStream = createInterface({
    input: createReadStream(streamFrom, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });
  const writeStream = createWriteStream(streamTo, {
    encoding: 'utf-8',
  });
  return { readStream, writeStream };
}
