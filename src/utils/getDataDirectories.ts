import { readdir } from 'fs/promises';
import { join } from 'node:path';

export async function getDataDirectories(baseDirectoryPath: string) {
  let dataDirectories = (
    await readdir(baseDirectoryPath, {
      withFileTypes: true,
    })
  )
    .filter((d) => d.isDirectory())
    .map((x) => join(baseDirectoryPath, x.name));

  if (dataDirectories.length === 0) {
    dataDirectories = [baseDirectoryPath];
  }
  return dataDirectories;
}
