import { copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { checkPathExist } from './checkPathExist';

export async function writeClassesFile(
  inputDirectory: string,
  outputDirectory: string,
  classNames: string[],
) {
  const classesIn = join(inputDirectory, '_classes.txt');
  const classesOut = join(outputDirectory, '_classes.txt');
  try {
    await checkPathExist([classesIn]);
    await copyFile(classesIn, classesOut);
  } catch (e) {
    await writeFile(classesOut, classNames.join('\n'), {
      encoding: 'utf-8',
    });
  }
}
