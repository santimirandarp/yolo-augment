import { stat } from 'fs/promises';

export async function checkDirsExist(dirs: string[]) {
  for (const dir of dirs) {
    await stat(dir).then((stats) => {
      if (!stats.isDirectory()) {
        throw new Error(`The path ${dir} is not a directory`);
      }
    });
  }
}
