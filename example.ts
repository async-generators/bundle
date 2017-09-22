import buffer from './src';

async function main() {
  let source = async function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
  for await (let items of buffer(source(), 2)) {
    console.log(items);
  }
}

main();