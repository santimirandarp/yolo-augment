import { join, resolve } from "node:path";

import { getDataDirectories } from "../getDataDirectories";

const data = resolve(join(__dirname, "../", "../", "__tests__", "/data"));
describe("getDataDirectories", () => {
  it("No data directories", async () => {
    const result = await getDataDirectories(__dirname);
    expect(result).toHaveLength(0);
  });
  it("Two data directories", async () => {
    const result = await getDataDirectories(data);
    expect(result).toHaveLength(2);
  });
});
