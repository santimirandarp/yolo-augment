import { Image } from 'image-js';

import { Datum } from '../Datum';

const image = new Image(5, 5, {
  data: new Uint8Array(5 * 5 * 3),
});
describe('newDatum', () => {
  it('should work', () => {
    const bbox = [[1, 1, 1, 1, 1]];
    const augmentation = 'rc90';
    const imageName = 'image.jpg';

    const result = new Datum(imageName, bbox, image, augmentation);
    expect(result).toEqual({
      newImageName: 'rc90_image.jpg',
      newImage: image.rotate(90),
      newAnnotation: '4,1,4,1,1',
    });
  });
});
