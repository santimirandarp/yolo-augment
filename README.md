# yolo-augment

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Input a dataset, obtain them augmentated. **This is still a work in progress.**

## Installation

```shell
npm i yolo-augment
```

## Usage

```js
import { augmentV4 } from 'yolo-augment';

augmentV4(pathToDatasetFolder);
```


## ToDos


* Add a website to visualize the operations in a single image (make a `demo/` folder at the root level and use **vite** to run a server)

Add more augmentation types like:

* scale (positive and negative)
* blur
* Etc

Always with the corresponding test.

Most are straight forward operations in the image library! But labels need careful update.

## Potential additions

* Filters (by number of boxes for example, using fs.unlink to remove files and annotations that do not comply.)
 
-----------------------

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/yolo-augment.svg
[npm-url]: https://www.npmjs.com/package/yolo-augment
[ci-image]: https://github.com/santimirandarp/yolo-augment/workflows/Node.js%20CI/badge.svg
[ci-url]: https://github.com/santimirandarp/yolo-augment/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/santimirandarp/yolo-augment.svg
[codecov-url]: https://codecov.io/gh/santimirandarp/yolo-augment
[download-image]: https://img.shields.io/npm/dm/yolo-augment.svg
[download-url]: https://www.npmjs.com/package/yolo-augment