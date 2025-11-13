// @ts-check

/**
 * @typedef {null | undefined | string | number | boolean | bigint | symbol} Primitive
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

  throw new TypeError('equalArray only supports primitives and arrays');
}

/**
 * @param {unknown} value
 * @returns {value is Primitive}
 */
function isPrimitive(value) {
  return value == null || (typeof value !== 'object' && typeof value !== 'function');
}
