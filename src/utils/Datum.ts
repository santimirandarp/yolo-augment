import { Image } from "image-js";

import { Augmentation } from "../types";

export class Datum {
  newImage: Image;
  newAnnotation: string;
  newImageName: string;

  constructor(
    imageName: string,
    bbox: number[][],
    image: Image, //original image
    augmentation: Augmentation
  ) {
    const fullHeight = image.height;
    const fullWidth = image.width;
    let result: { newImage: Image; newNumericLabels: string[] };
    switch (augmentation) {
      case "rac90":
        result = {
          newImage: image.rotate(-90),
          newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
            [y1, fullWidth - x2, y2, fullWidth - x1, c].join(",")
          ),
        };
        break;
      case "rc90":
        result = {
          newImage: image.rotate(90),
          newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
            [fullHeight - y2, x1, fullHeight - y1, x2, c].join(",")
          ),
        };
        break;
      case "r180":
        result = {
          newImage: image.rotate(180),
          newNumericLabels: bbox.map(([x1, y1, x2, y2, c]) =>
            [
              fullWidth - x2,
              fullHeight - y2,
              fullWidth - x1,
              fullHeight - y1,
              c,
            ].join(",")
          ),
        };
        break;
      case "blur":
        result = {
          newImage: image.blur({
            height: 3,
            width: 3,
          }),
          newNumericLabels: bbox.map((datum) => datum.join(",")),
        };
        break;
      case "original":
        result = {
          newImage: image,
          newNumericLabels: bbox.map((datum) => datum.join(",")),
        };
        break;
      default:
        throw new Error("augmentation not supported");
    }
    this.newImage = result.newImage;
    this.newAnnotation = result.newNumericLabels.join(" ");
    this.newImageName = `${augmentation}_${imageName}`;
  }
}
