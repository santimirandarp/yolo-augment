import { readdir } from 'node:fs/promises';
import { join } from 'path';

import { augmentateV4 } from '../augmentate-v4';

describe('augmentateV4', () => {
  const input = join(__dirname, './data/test');
  const out = join(__dirname, './out');
  it('should work', async () => {
    await augmentateV4(input, out);
    const result = await readdir(join(out, 'test'));
    const inputFiles = await readdir(input);
    expect(result.length).toBe(inputFiles.length * 4 - 6);
  });
});
