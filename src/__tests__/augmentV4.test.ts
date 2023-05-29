import { readdir } from "node:fs/promises";
import { join } from "path";

import { augmentV4 } from "../augmentV4";

describe("augmentV4", () => {
  it("throw if no data in dir", async () => {
    const input = join(__dirname, "./data/empty");
    await expect(augmentV4(input)).rejects.toThrow();
  });
  it("parse data in a single dir", async () => {
    const input = join(__dirname, "./data/test");
    const out = join(__dirname, "./out/test");
    await augmentV4(input, {
      outDir: out,
      augmentations: ["original", "rac90"],
    });

    // check number of images generated
    const output = await readdir(out);
    const outputImages = output.filter((file) => file.endsWith(".jpg"));
    const outputText = output.filter((file) => file.endsWith(".txt"));

    const inputFiles = await readdir(input);
    const inputImages = inputFiles.filter((file) => file.endsWith(".jpg"));
    const inputText = inputFiles.filter((file) => file.endsWith(".txt"));

    expect(outputImages).toHaveLength(inputImages.length * 2);
    expect(outputText).toHaveLength(inputText.length);
    expect(inputFiles).toHaveLength(inputImages.length + inputText.length);
  });
  it("Using random the number of files must be the same", async () => {
    const input = join(__dirname, "./data/test");
    const out = join(__dirname, "./out/test2");
    await augmentV4(input, {
      outDir: out,
      augmentations: ["original", "rac90", "r180", "rc90", "blur"],
      random: true,
    });
    const output = await readdir(out);
    const inputFiles = await readdir(input);

    expect(output).toHaveLength(inputFiles.length);
  });
  it("Parse data in multiple dirs", async () => {
    const input = join(__dirname, "./data");
    const out = join(__dirname, "./outAll");

    await augmentV4(input, {
      augmentations: ["blur", "r180", "rc90"],
      random: true,
      outDir: out,
      classNames: ["dark logo", "old logo", "white logo"],
    });
    const result = await readdir(out);
    expect(result).toHaveLength(2);
  });
});
