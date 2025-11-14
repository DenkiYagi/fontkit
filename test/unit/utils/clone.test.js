import assert from 'assert';
import { cloneDeep } from '../../../src/utils/clone.js';

describe('unit test: clone', function () {
  describe('cloneDeep', function () {
    it('returns primitives as-is', function () {
      assert.strictEqual(cloneDeep(42), 42);
      assert.strictEqual(cloneDeep(null), null);
      assert.strictEqual(cloneDeep('fontkit'), 'fontkit');
    });

    it('clones nested arrays and objects', function () {
      let source = [{ width: 123, names: ['a', 'b'] }, { width: 456, names: [] }];
      let copy = cloneDeep(source);

      assert.notStrictEqual(copy, source);
      assert.notStrictEqual(copy[0], source[0]);
      assert.notStrictEqual(copy[0].names, source[0].names);
      assert.deepStrictEqual(copy, source);

      source[0].names.push('c');
      assert.deepStrictEqual(copy[0].names, ['a', 'b']);
    });

    it('preserves circular references', function () {
      let source = { name: 'metrics' };
      source.self = source;

      let copy = cloneDeep(source);
      assert.notStrictEqual(copy, source);
      assert.strictEqual(copy.self, copy);
      assert.deepStrictEqual({ name: copy.name }, { name: 'metrics' });
    });

    it('preserves circular arrays', function () {
      let source = [];
      source[0] = source;

      let copy = cloneDeep(source);
      assert.notStrictEqual(copy, source);
      assert.strictEqual(copy[0], copy);
    });

    it('copies enumerable symbols and ignores hidden ones', function () {
      let visible = Symbol('visible');
      let hidden = Symbol('hidden');

      let head = {};
      Object.defineProperty(head, visible, { value: 'ok', enumerable: true });
      Object.defineProperty(head, hidden, { value: 'skip', enumerable: false });

      let copy = cloneDeep(head);
      assert.strictEqual(copy[visible], 'ok');
      assert.strictEqual(Object.prototype.hasOwnProperty.call(copy, hidden), false);
    });

    it('handles structures similar to font tables', function () {
      let maxp = {
        numGlyphs: 42,
        version: 1.0,
        stats: {
          maxPoints: 120,
          maxContours: 10
        }
      };

      let head = Object.assign(Object.create(null), {
        indexToLocFormat: 0,
        flags: {
          baselineAtY0: true,
          forcePPEMToInteger: false
        },
        bbox: { xMin: -10, yMin: -20, xMax: 400, yMax: 800 }
      });

      let cloned = cloneDeep({ maxp, head });

      assert.deepStrictEqual(cloned, { maxp, head });
      assert.notStrictEqual(cloned.maxp, maxp);
      assert.notStrictEqual(cloned.head, head);
      assert.notStrictEqual(cloned.head.bbox, head.bbox);
    });

    it('throws when encountering unsupported values', function () {
      assert.throws(() => cloneDeep(new Date()), /only supports/);
      assert.throws(() => cloneDeep(Buffer.from('a')), /only supports/);
      assert.throws(() => cloneDeep(function noop() { }), /only supports/);
    });
  });
});
