import { checkFilesExist } from '../checkFilesExist';

describe('checkFilesExist', () => {
  expect(
    checkFilesExist(['./src/utils/__tests__/checkFilesExist.test.ts']),
  ).toBeUndefined();
  expect(
    checkFilesExist([
      './src/utils/__tests__/checkFilesDontExist.test.ts',
      './src/utils/__tests__/checkFilesExist.test.ts',
    ]),
  ).toThrowError();
});
