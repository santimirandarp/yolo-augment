import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { relative, resolve, join, basename } from 'node:path';
import { createInterface } from 'node:readline';

import { write as writeImage, read } from 'image-js';

import type { AugmentOptions } from './types';
import {
  checkPathExist,
  getDataDirectories,
  Datum,
  parseYoloV4Annotation,
} from './utils';
import { writeClassesFile } from './utils/writeClassesFile';

/**
 * Transform labels and images at `baseDirectoryPath` and output them to `baseOutputDirectory`
 * @param baseDirectoryPath - The directory containing the images and labels
 * (alternatively it can be a parent directory containing multiple directories with images and labels)
 * @param baseOutputDirectory - The directory to output the new data to (images and labels)
 * @param options - Options to augment the data
 *
 */
export async function augmentV4(
  baseDirectoryPath: string,
  baseOutputDirectory: string,
  options: Partial<AugmentOptions> = {},
) {
  baseDirectoryPath = resolve(baseDirectoryPath);
  baseOutputDirectory = resolve(baseOutputDirectory);

  await checkPathExist(baseDirectoryPath);

  const { augmentations = ['rc90', 'rac90', 'r180'] } = options;
  let augmentationsCopy = [...augmentations];

  let dataDirectories = await getDataDirectories(baseDirectoryPath);
  if (dataDirectories.length === 0) dataDirectories.push(baseDirectoryPath);

  for (const inputDirectory of dataDirectories) {
    let difference = relative(baseDirectoryPath, inputDirectory);
    if (difference === '') difference = basename(inputDirectory);
    const outputDirectory = join(baseOutputDirectory, difference);
    try {
      await checkPathExist([outputDirectory]);
    } catch (e) {
      await mkdir(outputDirectory, { recursive: true });
    }

    // one line in, and `augmentations.length+1` lines out.
    const streamFrom = join(inputDirectory, '_annotations.txt');
    const streamTo = join(outputDirectory, '_annotations.txt');
    const readStream = createInterface({
      input: createReadStream(streamFrom, { encoding: 'utf-8' }),
      crlfDelay: Infinity,
    });
    const writeStream = createWriteStream(streamTo, {
      encoding: 'utf-8',
    });

    for await (const annotation of readStream) {
      const [imageName, bbox] = parseYoloV4Annotation(annotation);
      const image = await read(join(inputDirectory, imageName));
      if (options.random) {
        const randomIndex = Math.floor(
          Math.random() * augmentationsCopy.length,
        );
        augmentationsCopy = [augmentations[randomIndex]];
      }

      for (const augmentation of new Set(augmentationsCopy)) {
        const { newImageName, newImage, newAnnotation } = new Datum(
          imageName,
          bbox,
          image,
          augmentation,
        );
        const completeAnnotation = `${newImageName} ${newAnnotation}\n`;

        await writeImage(join(outputDirectory, newImageName), newImage);
        writeStream.write(`${completeAnnotation}`);
      }

      // write original image as well
      await writeImage(join(outputDirectory, imageName), image);
      writeStream.write(`${annotation}\n`);
    }

    writeStream.close();
    readStream.close();
    await writeClassesFile(inputDirectory, outputDirectory, options);
  }
}
