import parseYoloV4Annotation from '../parseYoloV4Annotation';

describe('parseYoloV4Annotation', () => {
  it('should work', () => {
    const result = parseYoloV4Annotation('image.jpg 0.1,0.2,0.3,0.4,1');
    expect(result).toEqual(['image.jpg', [[0.1, 0.2, 0.3, 0.4, 1]]]);
  });
});
