import { stat } from 'fs/promises';

export async function checkPathExist(dirs: string[] | string) {
  if (typeof dirs === 'string') {
    dirs = [dirs];
  }
  for (const dir of dirs) {
    await stat(dir);
  }
}
