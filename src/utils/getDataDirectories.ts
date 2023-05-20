import { opendir } from 'fs/promises';
import { join } from 'node:path';

export async function getDataDirectories(
  baseDirectoryPath: string,
  dataDirectories: string[] = [],
) {
  const baseDirectory = await opendir(baseDirectoryPath);

  for await (const dirent of baseDirectory) {
    if (dirent.isDirectory()) {
      await getDataDirectories(
        join(baseDirectoryPath, dirent.name),
        dataDirectories,
      );
    } else if (dirent.name === '_annotations.txt') {
      dataDirectories.push(baseDirectoryPath);
    }
  }
  return dataDirectories;
}
