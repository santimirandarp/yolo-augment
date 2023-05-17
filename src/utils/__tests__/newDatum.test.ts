import { Image } from 'image-js';

import { type Datum, newDatum } from '../newDatum';

const image = new Image(10, 10, {
  data: new Uint8Array(10 * 10 * 4),
});
describe('newDatum', () => {
  it('should work', () => {
    const datum: Datum = {
      bbox: [[1, 1, 1, 1, 1]],
      image,
      augmentation: 'rc90',
      imageName: 'image.jpg',
    };

    const result = newDatum(datum);
    expect(result).toEqual({
      newImageName: 'rc90_image.jpg',
      newImage: image.rotate(90),
      newAnnotation: '9 1 9 1 1',
    });
  });
});
