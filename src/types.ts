export type Augmentation = 'rc90' | 'rac90' | 'r180' | 'blur' | 'original';
export type AugmentOptions = {
  /**
   * @default `["rc90", "rac90", "r180"]`
   */
  augmentations: Augmentation[];
  /**
   * Whether to output the original image as well as the augmented
   * @default true
   */
  outOriginal: boolean;
  /**
   * @default "./augmentedData"
   */
  outDir: string;
  /**
   * chooses only one of the operations to transform the image
   * @default false
   */

  random: boolean;
  /**
   * @default ["faces"]
   * Only used if the `_classes.txt` does not exist.
   */
  classNames: string[];
  filterFromBBox: (bbox: number[][]) => boolean;
};
