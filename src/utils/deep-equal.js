// @ts-check

import { AssertionError } from '../errors.js';
import { isPrimitive } from './primitive.js';

/**
 * @typedef {import('./primitive.js').Primitive} Primitive
 */

/**
 * Compares primitives (via `Object.is`) and arrays (recursively) for equality.
 * Only accepts primitives or arrays composed of supported values.
 *
 * @param {Primitive | (Primitive | Primitive[])[]} left
 * @param {Primitive | (Primitive | Primitive[])[]} right
 * @returns {boolean}
 */
export function equalArray(left, right) {
  if (isPrimitive(left)) {
    if (isPrimitive(right)) {
      return Object.is(left, right);
    }
    return false;
  } else {
    if (isPrimitive(right)) {
      return false;
    }
  }

  if (Array.isArray(left)) {
    if (Array.isArray(right)) {
      if (left.length !== right.length) {
        return false;
      }
      for (let i = 0; i < left.length; i++) {
        if (!equalArray(left[i], right[i])) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  } else {
    if (Array.isArray(right)) {
      return false;
    }
  }

  // Internal misuse if we reach here
  throw new AssertionError('equalArray only supports primitives and arrays');
}
