import { stat } from 'fs/promises';

export async function checkFilesExist(dirs: string[]) {
  for (const dir of dirs) {
    await stat(dir).then((stats) => {
      if (!stats.isFile()) {
        throw new Error(`The path ${dir} is not a directory`);
      }
    });
  }
}
