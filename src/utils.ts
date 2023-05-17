import { Image, write } from 'image-js';
import { basename, extname, join, resolve } from 'path';
import { readdir, stat } from 'fs/promises';
import { Augmentation } from './types';

function checkDirsExist(dirs: string[]) {
  for (const dir of dirs) {
    stat(dir).then((stats) => {
      if (!stats.isDirectory()) {
        throw new Error(`The path ${dir} is not a directory`);
      }
    });
  }
}

// augmentateV4('./data')

type Datum = {
  imageName: string;
  image: Image;
  bbox: number[][];
  augmentation: Augmentation;
};
function newDatum({
  imageName,
  bbox,
  image, //original image
  augmentation,
}: Datum) {
  const fullHeight = image.height;
  const fullWidth = image.width;
  let result: { newImage: Image; newNumericLabels: string[] };
  switch (augmentation) {
    case 'rc90':
      result = {
        newImage: image.rotate(90),
        newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
          [y1, fullWidth - x2, y2, fullWidth - x1, c].join(','),
        ),
      };
      break;
    case 'rac90':
      result = {
        newImage: image.rotate(-90),
        newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
          [fullHeight - y2, x1, fullHeight - y1, x2, c].join(','),
        ),
      };
      break;
    case 'r180':
      result = {
        newImage: image.rotate(180),
        newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
          [
            fullHeight - y2,
            fullWidth - x2,
            fullHeight - y1,
            fullWidth - x1,
            c,
          ].join(','),
        ),
      };
      break;
    default:
      throw new Error(`Augmentation ${augmentation} not supported`);
  }
  return {
    newImage: result.newImage,
    newAnnotation: result.newNumericLabels.join(' '),
    newImageName: `${augmentation}_${imageName}`,
  };
}

async function getDataDirectories(baseDirectoryPath: string) {
  let dataDirectories = (
    await readdir(baseDirectoryPath, {
      withFileTypes: true,
    })
  )
    .filter((d) => d.isDirectory())
    .map((x) => join(baseDirectoryPath, x.name));

  if (dataDirectories.length === 0) {
    dataDirectories = [baseDirectoryPath];
  }
  return dataDirectories;
}

export function parseYolov4Annotation(
  annotation: string,
): [string, number[][]] {
  const [imageName, ...labels] = annotation.split(' ');
  const numbericLabels = labels.map((l) => l.split(',').map(Number.parseFloat));
  return [imageName, numbericLabels];
}

export { checkDirsExist, newDatum, getDataDirectories };
