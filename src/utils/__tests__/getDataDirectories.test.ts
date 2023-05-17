import { getDataDirectories } from '../getDataDirectories';

describe('getDataDirectories', () => {
  it('should work', async () => {
    const result = await getDataDirectories(__dirname);
    expect(result).toContain(__dirname);
  });
});
