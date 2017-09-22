import buffer from './src';

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