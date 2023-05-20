import { join } from 'node:path';

import { checkPathExist } from '../checkPathExist';

describe('checkDirsExist', () => {
  it('should work with dirs', async () => {
    const dirs = await checkPathExist(__dirname);
    expect(dirs).toBeUndefined();
    await expect(
      checkPathExist(join(__dirname, 'vadfbkjnbue2')),
    ).rejects.toThrowError();
  });
  it('should work with files', async () => {
    const files = await checkPathExist(
      join(__dirname, 'checkPathExist.test.ts'),
    );
    expect(files).toBeUndefined();
  });
  it('should throw error', async () => {
    await expect(
      checkPathExist([
        './src/utils/__tests__/checkFilesDontExist.test.ts',
        './src/utils/__tests__/checkFilesExist.test.ts',
      ]),
    ).rejects.toThrowError();
  });
});
