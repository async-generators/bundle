import equal from '@async-generators/equal';
import buffer from '../src';
import { expect } from 'chai';

describe("@async-generator/bundle", () => {
  it("should yield nothing and complete with empty source (number)", async () => {
    let source = async function* () { }
    expect(
      await equal(
        buffer(source(), 10),
        [])
    ).to.be.true;
  });

  it("should yield nothing and complete with empty source (condition)", async () => {
    let source = async function* () { }
    expect(
      await equal(
        buffer(source(), ()=>true),
        [])
    ).to.be.true;
  });

  it("should yield arrays of fixed size", async () => {
    let source = async function* () {
      yield 1; yield 2; yield 3; yield 4;
    }

    let result = buffer(source(), 2);
    let expected = [[1, 2], [3, 4]];

    expect(
      await equal(result, expected, (a, b) => equal(a, b))
    ).to.be.true;
  });

  it("should yield remaining items ", async () => {
    let source = async function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5;
    }

    let result = buffer(source(), 2);
    let expected = [[1, 2], [3, 4], [5]];

    expect(
      await equal(result, expected, (a, b) => equal(a, b))
    ).to.be.true;
  });

  it("should defer to condition method", async () => {
    let source = async function* () {
      yield 1; yield 2; yield 3; yield 4; yield 5; 
    }

    let result = buffer(source(), (x) => {
      if (x == 3) return false;

      return true;
    });

    let expected = [[1, 2], [3, 4, 5]];

    expect(
      await equal(result, expected, (a, b) => equal(a, b))
    ).to.be.true;
  });
})
