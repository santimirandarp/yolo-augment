import { Image } from 'image-js';

import { Augmentation } from '../types';

// augmentateV4('./data')
export type Datum = {
  imageName: string;
  image: Image;
  bbox: number[][];
  augmentation: Augmentation;
};
export function newDatum({
  imageName,
  bbox,
  image, //original image
  augmentation,
}: Datum) {
  const fullHeight = image.height;
  const fullWidth = image.width;
  let result: { newImage: Image; newNumericLabels: string[] };
  switch (augmentation) {
    case 'rac90':
      result = {
        newImage: image.rotate(-90),
        newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
          [y1, fullWidth - x2, y2, fullWidth - x1, c].join(','),
        ),
      };
      break;
    case 'rc90':
      result = {
        newImage: image.rotate(90),
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
            fullWidth - x2,
            fullHeight - y2,
            fullWidth - x1,
            fullHeight - y1,
            c,
          ].join(','),
        ),
      };
      break;
    default:
      throw new Error('augmentation not supported');
  }
  return {
    newImage: result.newImage,
    newAnnotation: result.newNumericLabels.join(' '),
    newImageName: `${augmentation}_${imageName}`,
  };
}
