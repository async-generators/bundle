import iterable from '@async-generators/iterable';

async function* untilCount<T>(
  source: AsyncIterable<T> | Iterable<T>,
  count: number
): AsyncIterable<T[]> {
  let items: T[] = [];

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
  condition: ((item: T, current: T[]) => boolean),
): AsyncIterable<T[]> {
  let items: T[] = []

  for await (let item of iterable(source)) {
    if (condition(item, items) == false) {
      yield items;
      items = [];
    }
    items.push(item);
  }
  if (items.length > 0)
    yield items;
}

export default function <T>(
  source: AsyncIterable<T> | Iterable<T>,
  condition: number | ((item: T, current: T[]) => boolean)
): AsyncIterable<T[]> {

  if (typeof condition == "number") {
    return untilCount(source, condition);
  }
  return whileTrue(source, condition);
}