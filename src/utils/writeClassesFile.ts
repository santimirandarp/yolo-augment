import { copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { AugmentOptions } from '../types';

import { checkPathExist } from './checkPathExist';

export async function writeClassesFile(
  inputDirectory: string,
  outputDirectory: string,
  options: Partial<AugmentOptions> = {},
) {
  const classesIn = join(inputDirectory, '_classes.txt');
  const classesOut = join(outputDirectory, '_classes.txt');
  try {
    await checkPathExist([classesIn]);
    await copyFile(classesIn, classesOut);
  } catch (e) {
    await writeFile(classesIn, options.className || 'faces', {
      encoding: 'utf-8',
    });
  }
}
