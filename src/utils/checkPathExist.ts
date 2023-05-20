import { stat } from 'fs/promises';

export async function checkPathExist(
  dirs: string[] | string,
  type: 'file' | 'directory',
) {
  if (typeof dirs === 'string') {
    dirs = [dirs];
  }
  for (const dir of dirs) {
    const st = await stat(dir);
    const isX = type === 'file' ? st.isFile() : st.isDirectory();
    if (!isX) {
      throw new Error(`The path ${dir} is not a ${type}`);
    }
  }
}
