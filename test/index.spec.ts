import equal from '@async-generators/equal';
import buffer from '../src';
import { expect } from 'chai';

describe("@async-generator/buffer", () => {
  it("should yield nothing and complete with empty source", async () => {
    let source = async function* () { }
    expect(
      await equal(
        buffer(source(), 10),
        [])
    ).to.be.true;
  });
})
