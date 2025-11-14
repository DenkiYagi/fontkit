// @ts-check

/**
 * @typedef {null | undefined | string | number | boolean | bigint | symbol} Primitive
 */

/**
 * Returns true when the value is a primitive (including null/undefined).
 *
 * @param {unknown} value
 * @returns {value is Primitive}
 */
export function isPrimitive(value) {
  return value == null || (typeof value !== 'object' && typeof value !== 'function');
}
