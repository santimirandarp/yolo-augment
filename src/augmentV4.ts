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

  const deDuplicatedAugmentations = getAugmentations(
    augmentations,
    outOriginal
  );
  const { newAugmentations } = deDuplicatedAugmentations;
  const newAugmentationsLength = newAugmentations.length;

  let dataDirectories = await getDataDirectories(baseDirectoryPath);
  if (dataDirectories.length === 0) dataDirectories.push(baseDirectoryPath);

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
      if (random) {
        const randomIndex = Math.floor(Math.random() * newAugmentationsLength);
        await writeData(
          outputDirectory,
          imageName,
          image,
          newAugmentations[randomIndex],
          bbox,
          writeStream
        );
      }

      for (const augmentation of newAugmentations) {
        await writeData(
          outputDirectory,
          imageName,
          image,
          augmentation,
          bbox,
          writeStream
        );
      }
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
  augmentation: Augmentation,
  bbox: number[][],
  writeStream: WriteStream
) {
  const { newImageName, newImage, newAnnotation } = new Datum(
    imageName,
    bbox,
    image,
    augmentation
  );
  const completeAnnotation = `${newImageName} ${newAnnotation}\n`;

  await writeImage(join(outputDirectory, newImageName), newImage);
  writeStream.write(`${completeAnnotation}`);
}
