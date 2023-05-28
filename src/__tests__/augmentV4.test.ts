import { readdir } from "node:fs/promises";
import { join } from "path";

import { augmentV4 } from "../augmentV4";

describe("augmentV4", () => {
  it("should work with a single dir", async () => {
    const input = join(__dirname, "./data/test");
    const out = join(__dirname, "./out/test");
    await augmentV4(input, {
      outDir: out,
    });
    const result = await readdir(out);
    const inputFiles = await readdir(input);
    expect(result.length).toBe(inputFiles.length * 4 - 6);
  });
  it("should work with multiple dirs", async () => {
    const input = join(__dirname, "./data");
    const out = join(__dirname, "./outAll");

    await augmentV4(input, {
      augmentations: ["blur", "r180", "rc90"],
      random: true,
      outDir: out,
      classNames: ["dark logo", "old logo", "white logo"],
    });
    const result = await readdir(out);
    expect(result).toHaveLength(3);
  });
});
