# buffer
![logo](https://avatars1.githubusercontent.com/u/31987273?v=4&s=100)

buffer items until a condition is met and yield as an iterable 

[![NPM version][npm-image]][npm-url]
[![Travis Status][travis-image]][travis-url]
[![Travis Status][codecov-image]][codecov-url]

## Usage

_package requires a system that supports async-iteration, either natively or via down-compiling_

### Install
```
npm install @async-generators/buffer --save
yarn add @async-generators/buffer
```

This package's `main` entry points to a `commonjs` distribution. 

Additionally, the `module` entry points to a `es2015` distribution, which can be used by build systems, such as webpack, to directly use es2015 modules. 

## Api

### buffer(source, selector [,limit=20] [,limited])

<code>buffer()</code> iterates `source` and executes `selector(item, index)` concurrently. Upon resolution of selector promise, the result is yielded. 

`selector(item)` is awaited in a non-blocking fashion and `buffer` results are yielded in the _order of completion_. 

If the the number of concurrent tasks is greater-than or equal-to `limit` further iteration of `source` is halted until other tasks complete. Upon halting, the `limited(item, index)` method is called (sync). If `limited` returns `true` the item is ignored not _not_ passed to   `selector`

`source` must have a `[Symbol.asyncIterator]` or `[Symbol.iterator]` property. If both are present only `[Symbol.asyncIterator]` is used. 



### buffer(source [,limit=20] [,limited])

<code>buffer()</code> iterates `source` and awaits each item concurrently. Upon resolve, the result is yielded. `source` items are awaited in a non-blocking fashion and the results are yielded in the _order of completion_. 

`source` must have a `[Symbol.asyncIterator]` or `[Symbol.iterator]` property. If both are present only `[Symbol.asyncIterator]` is used. `source` should _ideally_ yield executing promises, but technically can yield an object - although this makes the call to `buffer` entirely redundant. 

## Example

example.js
```js
const buffer = require('@async-generators/buffer').default;

async function main() {
  let source = async function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
  for await (let item of buffer(source(), 2)) {
    let items = [];
    for (let subitem of item) {
      items.push(subitem);
    }
    console.log(items);
  }
}

main();

```

Execute with the latest node.js: 

```
node --harmony-async-iteration example.js
```


output:
```
2
1
4
3
```
## Typescript

This library is fully typed and can be imported using: 

```ts
import buffer from '@async-generators/buffer');
```

It is also possible to directly execute your [properly configured](https://stackoverflow.com/a/43694282/1657476) typescript with [ts-node](https://www.npmjs.com/package/ts-node):

```
ts-node --harmony_async_iteration example.ts
```

[npm-url]: https://npmjs.org/package/@async-generators/buffer
[npm-image]: https://img.shields.io/npm/v/@async-generators/buffer.svg
[npm-downloads]: https://img.shields.io/npm/dm/@async-generators/buffer.svg
[travis-url]: https://travis-ci.org/async-generators/buffer
[travis-image]: https://img.shields.io/travis/async-generators/buffer/master.svg
[codecov-url]: https://codecov.io/gh/async-generators/buffer
[codecov-image]: https://codecov.io/gh/async-generators/buffer/branch/master/graph/badge.svg
