import { join, basename } from 'node:path';

import { checkDirsExist, getDataDirectories } from './utils';
import { makeReadWriteStream } from './make-read-write-stream';
import type { AugmentateOptions } from './types';
import { write as writeImage, read } from 'image-js';

import { newDatum, parseYolov4Annotation } from './utils';

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
  checkDirsExist([baseDirectoryPath, baseOutputDirectory]);

  const { augmentations = ['rc90', 'rac90', 'r180'] } = options;

  const dataDirectories = await getDataDirectories(baseDirectoryPath);
  for (const currentDir of dataDirectories) {
    baseOutputDirectory = join(baseOutputDirectory, basename(currentDir));

    const [readStream, writeStream] = await makeReadWriteStream(
      '_annotations.txt',
      '_new_annotations.txt',
      currentDir,
    );

    for await (const annotation of readStream) {
      const [imageName, bbox] = parseYolov4Annotation(annotation);
      const image = await read(join(currentDir, imageName));

      // do not duplicate augmentations.
      for (const augmentation of new Set(augmentations)) {
        const datum = { bbox, image, augmentation, imageName };

        const { newImageName, newImage, newAnnotation } = newDatum(datum);
        const completeAnnotation = `${newImageName} ${newAnnotation}\n`;

        await writeImage(join(baseOutputDirectory, newImageName), newImage, {
          recursive: true,
        });
        writeStream.write(completeAnnotation);
      }

      // write original image and annotation
      writeImage(join(baseOutputDirectory, imageName), image, {
        recursive: true,
      });
    }

    writeStream.close();
    readStream.close();
  }
}
