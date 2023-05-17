import { join } from 'node:path';

import { checkDirsExist } from '../checkDirsExist';

describe('checkDirsExist', () => {
  it('should work', async () => {
    const dirs = await checkDirsExist([__dirname]);
    expect(dirs).toBeUndefined();
    await expect(
      checkDirsExist([join(__dirname, 'vadfbkjnbue2')]),
    ).rejects.toThrowError();
  });
});
