import assert from 'assert';
import { isPrimitive } from '../../../src/utils/primitive.js';

describe('unit test: primitive', function () {
  describe('isPrimitive', function () {
    it('recognizes primitive values', function () {
      assert.strictEqual(isPrimitive(null), true);
      assert.strictEqual(isPrimitive(undefined), true);
      assert.strictEqual(isPrimitive(0), true);
      assert.strictEqual(isPrimitive(-0), true);
      assert.strictEqual(isPrimitive(NaN), true);
      assert.strictEqual(isPrimitive('fontkit'), true);
      assert.strictEqual(isPrimitive(true), true);
      assert.strictEqual(isPrimitive(Symbol('s')), true);
      assert.strictEqual(isPrimitive(10n), true);
    });

    it('rejects arrays and objects', function () {
      assert.strictEqual(isPrimitive({}), false);
      assert.strictEqual(isPrimitive(Object.create(null)), false);
      assert.strictEqual(isPrimitive([]), false);
    });

    it('rejects functions and class instances', function () {
      assert.strictEqual(isPrimitive(() => { }), false);
      class Foo { }
      assert.strictEqual(isPrimitive(new Foo()), false);
    });
  });
});
