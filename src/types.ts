export type Augmentation = 'rc90' | 'rac90' | 'r180' | 'blur';
export type AugmentateOptions = {
  augmentations: Augmentation[];
  /* chooses only one of the operations to transform the image */
  random: boolean;
};