import { join } from 'node:path';

import { checkPathExist } from '../checkPathExist';

describe('checkDirsExist', () => {
  it('should work with dirs', async () => {
    const dirs = await checkPathExist(__dirname, 'directory');
    expect(dirs).toBeUndefined();
    await expect(
      checkPathExist(join(__dirname, 'vadfbkjnbue2'), 'directory'),
    ).rejects.toThrowError();
  });
  it('should work with files', async () => {
    const files = await checkPathExist(
      join(__dirname, 'checkPathExist.test.ts'),
      'file',
    );
    expect(files).toBeUndefined();
  });
  it('should throw error', async () => {
    await expect(
      checkPathExist(
        [
          './src/utils/__tests__/checkFilesDontExist.test.ts',
          './src/utils/__tests__/checkFilesExist.test.ts',
        ],
        'file',
      ),
    ).rejects.toThrowError();
  });
});
