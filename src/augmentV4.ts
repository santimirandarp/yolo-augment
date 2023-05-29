import { type WriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve, join, relative } from "node:path";

import { type Image, write as writeImage, read } from "image-js";

import type { Augmentation, AugmentOptions } from "./types";
import {
  checkPathExist,
  getDataDirectories,
  Datum,
  parseYoloV4Annotation,
  writeClassesFile,
} from "./utils";
import { getAugmentations } from "./utils/getAugmentations";
import { makeReadWriteStreams } from "./utils/makeReadWriteStream";

/**
 * Recursively finds `_annotations.txt` from `startSearchFrom` and outputs to {@link AugmentOptions["outDir"] }
 * @param startSearchFrom - The directory to start to search for images and labels.
 * @param options - Options to augment the data
 *
 */
export async function augmentV4(
  startSearchFrom: string,
  options: Partial<AugmentOptions> = {}
) {
  const {
    augmentations = ["rac90", "r180", "rc90"],
    outDir = "./augmentedData",
    random = false,
    classNames = ["faces"],
    outOriginal = true,
  } = options;

  const baseDirectoryPath = resolve(startSearchFrom);
  const baseOutputDirectory = resolve(outDir);

  await checkPathExist(baseDirectoryPath);

  const { newAugmentations } = getAugmentations(augmentations, outOriginal);
  const newAugmentationsLength = newAugmentations.length;

  const dataDirectories = await getDataDirectories(baseDirectoryPath);
  if (dataDirectories.length === 0) {
    throw new Error(
      `No data directories found in ${baseDirectoryPath}. Please check that the directory is correct and that the data directories are named "_annotations.txt"`
    );
  }

  for (const annotationDirectory of dataDirectories) {
    const outputDirectory = join(
      baseOutputDirectory,
      relative(baseDirectoryPath, annotationDirectory)
    );
    try {
      await checkPathExist(outputDirectory);
    } catch (e) {
      await mkdir(outputDirectory, { recursive: true });
    }

    // one line in, and `augmentations.length+1` lines out.
    const { readStream, writeStream } = makeReadWriteStreams(
      annotationDirectory,
      outputDirectory
    );

    for await (const annotation of readStream) {
      const [imageName, bbox] = parseYoloV4Annotation(annotation);
      const image = await read(join(annotationDirectory, imageName));
      await writeData(
        outputDirectory,
        imageName,
        image,
        random
          ? newAugmentations[randomIndex(newAugmentationsLength)]
          : newAugmentations,
        bbox,
        writeStream
      );
    }

    writeStream.close();
    readStream.close();
    await writeClassesFile(annotationDirectory, outputDirectory, classNames);
  }
}

/**
 *
 * only intended to reduce code duplication in {@link augmentV4}
 */
async function writeData(
  outputDirectory: string,
  imageName: string,
  image: Image,
  augmentation: Augmentation | Augmentation[],
  bbox: number[][],
  writeStream: WriteStream
) {
  augmentation = Array.isArray(augmentation) ? augmentation : [augmentation];

  for (const augmentationType of augmentation) {
    const { newImageName, newImage, newAnnotation } = new Datum(
      imageName,
      bbox,
      image,
      augmentationType
    );
    const completeAnnotation = `${newImageName} ${newAnnotation}\n`;

    await writeImage(join(outputDirectory, newImageName), newImage);
    writeStream.write(`${completeAnnotation}`);
  }
}

function randomIndex(arrLength: number) {
  return Math.floor(Math.random() * arrLength);
}
