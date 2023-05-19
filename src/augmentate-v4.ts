import { mkdir, open, copyFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

import { write as writeImage, read } from 'image-js';

import type { AugmentateOptions } from './types';
import { checkPathExist } from './utils/checkPathExist';
import { getDataDirectories } from './utils/getDataDirectories';
import { newDatum } from './utils/newDatum';
import parseYoloV4Annotation from './utils/parseYoloV4Annotation';

/**
 * Transform labels and images at `baseDirectoryPath` and output them to `baseOutputDirectory`
 * @param baseDirectoryPath - The directory containing the images and labels
 * (alternatively it can be a parent directory containing multiple directories with images and labels)
 * @param baseOutputDirectory - The directory to output the new data to (images and labels)
 * @param options - Options to augmentate the data
 *
 */
export async function augmentateV4(
  baseDirectoryPath: string,
  baseOutputDirectory: string,
  options: Partial<AugmentateOptions> = {},
) {
  await checkPathExist(baseDirectoryPath, 'directory');

  let { augmentations = ['rc90', 'rac90', 'r180'] } = options;

  if (options.random) {
    const randomIndex = Math.floor(Math.random() * augmentations.length);
    augmentations = [augmentations[randomIndex]];
  }
  const dataDirectories = await getDataDirectories(baseDirectoryPath);
  for (const inputDirectory of dataDirectories) {
    const outputDirectory = join(baseOutputDirectory, basename(inputDirectory));
    try {
      await checkPathExist([outputDirectory], 'directory');
    } catch (e) {
      await mkdir(outputDirectory, { recursive: true });
    }
    const streamFrom = join(inputDirectory, '_annotations.txt');

    const streamTo = join(outputDirectory, '_new_annotations.txt');

    const readStream = (await open(streamFrom, 'r+')).readLines();
    const writeStream = (await open(streamTo, 'w')).createWriteStream({
      encoding: 'utf8',
    });

    for await (const annotation of readStream) {
      const [imageName, bbox] = parseYoloV4Annotation(annotation);
      const image = await read(join(inputDirectory, imageName));

      // do not duplicate augmentations.
      for (const augmentation of new Set(augmentations)) {
        const datum = { bbox, image, augmentation, imageName };

        const { newImageName, newImage, newAnnotation } = newDatum(datum);
        const completeAnnotation = `${newImageName} ${newAnnotation}\n`;

        await writeImage(join(outputDirectory, newImageName), newImage, {
          recursive: true,
        });
        writeStream.write(`${completeAnnotation}`);
      }

      // write original image and annotation
      await writeImage(join(outputDirectory, imageName), image, {
        recursive: true,
      });
      writeStream.write(`${annotation}\n`);
    }

    writeStream.close();
    readStream.close();

    const classesIn = join(inputDirectory, '_classes.txt');
    const classesOut = join(outputDirectory, '_classes.txt');
    await copyFile(classesIn, classesOut);
  }
}
