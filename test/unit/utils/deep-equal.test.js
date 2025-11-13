import assert from 'assert';
import { equalArray } from '../../../src/utils/deep-equal.js';

describe('unit test: deep-equal', function () {
  describe('equalArray', function () {
    it('compares primitives via Object.is semantics', function () {
      assert.strictEqual(equalArray(42, 42), true);
      assert.strictEqual(equalArray(-0, 0), false);
      assert.strictEqual(equalArray(NaN, NaN), true);
      assert.strictEqual(equalArray(null, undefined), false);
    });

    it('compares nested arrays of supported values', function () {
      assert.strictEqual(equalArray([1, 2, 3], [1, 2, 3]), true);
      assert.strictEqual(equalArray([1, [2, 3], 4], [1, [2, 3], 4]), true);
      assert.strictEqual(equalArray([1, [2, 3], 4], [1, [3, 2], 4]), false);
      assert.strictEqual(equalArray([1, 2], [1, 2, 3]), false);
      assert.strictEqual(equalArray([1, 2], 1), false);
    });

    it('returns false when only one operand is an array', function () {
      assert.strictEqual(equalArray([1, 2], null), false);
      assert.strictEqual(equalArray(undefined, [1, 2]), false);
      assert.strictEqual(equalArray([1, 2], 1), false);
      assert.strictEqual(equalArray(1, [1, 2]), false);
    });

    it('returns false when only one operand is primitive', function () {
      assert.strictEqual(equalArray({ a: 1 }, null), false);
      assert.strictEqual(equalArray(undefined, { a: 1 }), false);
    });

    it('throws on unsupported values', function () {
      assert.throws(() => equalArray({ a: 1 }, { a: 1 }), /only supports primitives and arrays/);
      assert.throws(() => equalArray([1, { a: 1 }], [1, { a: 1 }]), /only supports primitives and arrays/);
      assert.throws(() => equalArray(Buffer.alloc(1), Buffer.alloc(1)), /only supports primitives and arrays/);
    });
  });
});
