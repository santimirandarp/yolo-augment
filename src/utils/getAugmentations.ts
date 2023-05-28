import { AugmentOptions, Augmentation } from "../types";

/**
 * Adds `original` to the augmentations if `outOriginal` is true.
 * and deduplicates the augmentations.
 * Pure function i.e it keeps the input array.
 * @param augmentations
 * @param outOriginal
 * @returns
 */
export function getAugmentations(
  augmentations: Augmentation[],
  outOriginal: boolean
) {
  const augmentationsCopy = [...augmentations];
  if (outOriginal) augmentationsCopy.push("original");

  const newAugmentations = Array.from(new Set(augmentationsCopy));
  return {
    newAugmentations,
  };
}
