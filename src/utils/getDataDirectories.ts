import { opendir } from 'fs/promises';
import { join } from 'node:path';

export async function getDataDirectories(
  baseDirectoryPath: string,
  dataDirectories: string[] = [],
) {
  const baseDirectory = await opendir(baseDirectoryPath);

  for await (const dirent of baseDirectory) {
    const name = dirent.name;
    if (dirent.isDirectory()) {
      await getDataDirectories(join(baseDirectoryPath, name), dataDirectories);
    } else if (name === '_annotations.txt') {
      dataDirectories.push(baseDirectoryPath);
    }
  }
  return dataDirectories;
}
