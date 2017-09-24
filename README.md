# bundle
![logo](https://avatars1.githubusercontent.com/u/31987273?v=4&s=100)

bundle items until a condition is met and yield as an iterable 

[![NPM version][npm-image]][npm-url]
[![Travis Status][travis-image]][travis-url]
[![Travis Status][codecov-image]][codecov-url]

## Usage

_package requires a system that supports async-iteration, either natively or via down-compiling_

### Install
```
npm install @async-generators/bundle --save
yarn add @async-generators/bundle
```

This package's `main` entry points to a `commonjs` distribution. 

Additionally, the `module` entry points to a `es2015` distribution, which can be used by build systems, such as webpack, to directly use es2015 modules. 

## Api

### bundle(source, condition)

<code>bundle()</code> iterates `source` and stores each item in an array while a `condition` is true, after which the bundle array is yielded (as an array). If the `source` completes any remaining non-empty bundled array is yielded. 

* when `condition` is a _number_, items are stored until the array contains `condition` number of items. 
* when `condition` is a _function_, `source` items are stored in the current bundle if `condition(item, buffer) === true`. 
* when `condition(item, buffer) === false` the current bundle is yielded (sans `item`) and a new bundle is created containing the latest item. 

## Example 1 - fixed size 

example.js
```js
const bundle = require('@async-generators/bundle').default;

async function main() {
  let source = async function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
  for await (let item of bundle(source(), 2)) {
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
[ 1, 2 ]
[ 3, 4 ]
[ 5 ]
```

## Example 2 - throttle

example.js
```js
const bundle = require('@async-generators/bundle').default;
async function delay(duration) {
  return new Promise(r => setTimeout(r, duration));
}

function throttle(period) {
  let next;
  return function () {
    let start = function(){
      next = false;
      console.log("started timeout", period);
      setTimeout(function () { 
        next = true; 
        console.log("timed-out");
      }, period);
    }

    if (next === undefined) {
      start();
      return true;
    }
    if (next) {      
      start();
      return false;
    }
    if (next) {      
      next = undefined;
      return false;
    }
    return true;
  }
}

async function main() {
  let source = async function* () {
    for (let i = 0; i < 10; i++) {   
      console.log("source yield", i);   
      yield i;      
      await delay(100);     
    }
  }

  for await (let items of bundle(source(), throttle(350))) {
    console.log("bundle yield", items);
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
source yield 0
started timeout 350
source yield 1
source yield 2
source yield 3
timed-out
source yield 4
started timeout 350
bundle yield [ 0, 1, 2, 3 ]
source yield 5
source yield 6
source yield 7
timed-out
source yield 8
started timeout 350
bundle yield [ 4, 5, 6, 7 ]
source yield 9
bundle yield [ 8, 9 ]
timed-out
```
## Typescript

This library is fully typed and can be imported using: 

```ts
import bundle from '@async-generators/bundle');
```

It is also possible to directly execute your [properly configured](https://stackoverflow.com/a/43694282/1657476) typescript with [ts-node](https://www.npmjs.com/package/ts-node):

```
ts-node --harmony_async_iteration example.ts
```

[npm-url]: https://npmjs.org/package/@async-generators/bundle
[npm-image]: https://img.shields.io/npm/v/@async-generators/bundle.svg
[npm-downloads]: https://img.shields.io/npm/dm/@async-generators/bundle.svg
[travis-url]: https://travis-ci.org/async-generators/bundle
[travis-image]: https://img.shields.io/travis/async-generators/bundle/master.svg
[codecov-url]: https://codecov.io/gh/async-generators/bundle
[codecov-image]: https://codecov.io/gh/async-generators/bundle/branch/master/graph/badge.svg
