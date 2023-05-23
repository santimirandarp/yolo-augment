import { join, relative, basename } from 'path';

/**
 *  By adding the difference between the baseDirectoryPath and the annotationDirectory to the baseOutputDirectory,
 * @param baseDirectoryPath
 * @param baseOutputDirectory
 * @param annotationDirectory
 * @returns
 */
export function makeOutputDirectoryFromDifference(
  baseDirectoryPath: string,
  baseOutputDirectory: string,
  annotationDirectory: string,
) {
  let difference = relative(baseDirectoryPath, annotationDirectory);
  if (difference === '') difference = basename(annotationDirectory);

  return join(baseOutputDirectory, difference);
}
