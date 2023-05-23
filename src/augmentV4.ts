import { mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

import { write as writeImage, read } from 'image-js';

import type { AugmentOptions } from './types';
import {
  checkPathExist,
  getDataDirectories,
  Datum,
  parseYoloV4Annotation,
  writeClassesFile,
  makeOutputDirectoryFromDifference,
} from './utils';
import { makeReadWriteStreams } from './utils/makeReadWriteStream';

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

  for (const annotationDirectory of dataDirectories) {
    const outputDirectory = makeOutputDirectoryFromDifference(
      baseDirectoryPath,
      baseOutputDirectory,
      annotationDirectory,
    );
    try {
      await checkPathExist([outputDirectory]);
    } catch (e) {
      await mkdir(outputDirectory, { recursive: true });
    }

    // one line in, and `augmentations.length+1` lines out.
    const { readStream, writeStream } = makeReadWriteStreams(
      annotationDirectory,
      outputDirectory,
    );

    for await (const annotation of readStream) {
      const [imageName, bbox] = parseYoloV4Annotation(annotation);
      const image = await read(join(annotationDirectory, imageName));
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
    await writeClassesFile(annotationDirectory, outputDirectory, options);
  }
}
