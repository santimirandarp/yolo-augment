import { readdir } from 'node:fs/promises';
import { join } from 'path';

import { augmentateV4 } from '../augmentate-v4';

describe('augmentateV4', () => {
  it('should work with a single dir', async () => {
    const input = join(__dirname, './data/test');
    const out = join(__dirname, './out');
    await augmentateV4(input, out);
    const result = await readdir(join(out, 'test'));
    const inputFiles = await readdir(input);
    expect(result.length).toBe(inputFiles.length * 4 - 6);
  });
  it('should work with multiple dirs', async () => {
    const input = join(__dirname, './data');
    const out = join(__dirname, './outAll');

    await augmentateV4(input, out);
    const result = await readdir(out);
    expect(result).toHaveLength(2);
  });
});
