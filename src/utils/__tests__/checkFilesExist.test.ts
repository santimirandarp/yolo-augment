import { checkFilesExist } from '../checkFilesExist';

describe('checkFilesExist', () => {
  it('should work', async () => {
    const files = await checkFilesExist([
      './src/utils/__tests__/checkFilesExist.test.ts',
    ]);
    expect(files).toBeUndefined();
  });
  it('should throw error', async () => {
    await expect(
      checkFilesExist([
        './src/utils/__tests__/checkFilesDontExist.test.ts',
        './src/utils/__tests__/checkFilesExist.test.ts',
      ]),
    ).rejects.toThrowError();
  });
});
