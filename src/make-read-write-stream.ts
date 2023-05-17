import { join } from 'node:path';
import { open } from 'node:fs/promises';
import { WriteStream } from 'node:fs';
import { Interface } from 'node:readline';

export async function makeReadWriteStream(
  from: string,
  to: string,
  currentDir: string,
): Promise<[Interface, WriteStream]> {
  const annotationsPath = join(currentDir, from);
  const newAnnotationsPath = join(currentDir, to);
  const readStream = (await open(annotationsPath, 'r')).readLines();
  const writeStream = (await open(newAnnotationsPath, 'w')).createWriteStream({
    encoding: 'utf8',
  });
  return [readStream, writeStream];
}
