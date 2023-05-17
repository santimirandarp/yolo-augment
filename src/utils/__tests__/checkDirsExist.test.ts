import { join } from 'node:path';

import { checkDirsExist } from '../checkDirsExist';

describe('checkDirsExist', () => {
  it('should work', () => {
    expect(checkDirsExist([__dirname])).toBeUndefined();
    expect(checkDirsExist([join(__dirname, 'vadfbkjnbue2')])).toThrowError();
  });
});
