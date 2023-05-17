import { augmentateV4 } from "../augmentate-v4";
import {join } from "path";

describe("augmentateV4", () => {
    const input = join(__dirname,"./data")
    const out = join(__dirname,"./out")
    it("should work", async () => {
        await augmentateV4(input, out);
    });
})