import iterable from '@async-generators/iterable';

async function* untilCount<T>(
  source: AsyncIterable<T> | Iterable<T>,
  count: number
): AsyncIterable<T[]> {
  let items: T[] = []

  for await (let item of iterable(source)) {
    items.push(item);
    if (items.length >= count) {
      yield items;
      items = [];
    }
  }
  if (items.length > 0)
    yield items;
}

async function* whileTrue<T>(
  source: AsyncIterable<T> | Iterable<T>,
  condition: (() => (Promise<boolean> | boolean))
): AsyncIterable<T[]> {
  let items: T[] = []

  for await (let item of iterable(source)) {
    items.push(item);
    if (await condition() == true) {
      yield items;
      items = [];
    }
  }
  if (items.length > 0)
    yield items;
}

export default function <T>(
  source: AsyncIterable<T> | Iterable<T>,
  condition: number | (() => boolean | Promise<boolean>)
): AsyncIterable<T[]> {

  if (typeof condition == "number") {
    return untilCount(source, condition);
  }
  return whileTrue(source, condition);
}