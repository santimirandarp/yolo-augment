import { Image } from 'image-js';

import { type Datum, newDatum } from '../newDatum';

const image = new Image(5, 5, {
  data: new Uint8Array(5 * 5 * 3),
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
      newAnnotation: '4,1,4,1,1',
    });
  });
});
