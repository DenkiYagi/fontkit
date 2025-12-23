// @ts-check

import { AssertionError } from '../errors.js';
import { isPrimitive } from './primitive.js';

/**
 * Deeply clones the value.
 *
 * - Supports primitives, arrays, and plain objects.
 * - Handles circular references by tracking already-cloned objects.
 * - Preserves object prototypes (Object.prototype or null).
 * - Clones only enumerable properties (both string keys and symbols).
 * - Does not support functions, class instances, or built-in objects
 *   (Date, RegExp, Map, Set, Buffer, etc.).
 *
 * @template T
 * @param {T} value - The value to clone.
 * @returns {T} A deep clone of the value.
 * @throws {TypeError} If `value` contains unsupported types.
 */
export function cloneDeep(value) {
  return cloneValue(value, new Map());
}

/**
 * Recursively clones a value, tracking seen objects to handle circular references.
 * 
 * @param {unknown} value
 * @param {Map<object, any>} seen
 * @returns {any}
 */
function cloneValue(value, seen) {
  if (isPrimitive(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return cloneArray(value, seen);
  }

  if (isCloneableObject(value)) {
    return cloneObject(value, seen);
  }

  // Internal misuse if we reach here
  throw new AssertionError('cloneDeep only supports primitives, arrays, and plain objects');
}

/**
 * Checks if a value is a plain object (prototype is Object.prototype or null).
 * 
 * @param {unknown} value
 * @returns {value is Record<string | symbol, any>}
 */
function isCloneableObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Clones an array and recursively clones all its elements.
 * 
 * @param {any[]} value
 * @param {Map<object, any>} seen
 * @returns {any[]}
 */
function cloneArray(value, seen) {
  if (seen.has(value)) {
    return seen.get(value);
  }

  const result = new Array(value.length);
  seen.set(value, result);

  for (let i = 0; i < value.length; i++) {
    result[i] = cloneValue(value[i], seen);
  }

  return result;
}

/**
 * Clones a plain object, preserving its prototype and
 * recursively cloning all properties and enumerable symbols.
 * 
 * @param {Record<string | symbol, any>} value
 * @param {Map<object, any>} seen
 * @returns {Record<string | symbol, any>}
 */
function cloneObject(value, seen) {
  if (seen.has(value)) {
    return seen.get(value);
  }

  const result = Object.create(Object.getPrototypeOf(value));
  seen.set(value, result);

  for (const key of Object.keys(value)) {
    result[key] = cloneValue(value[key], seen);
  }

  const symbols = Object.getOwnPropertySymbols(value);
  for (const symbol of symbols) {
    const descriptor = Object.getOwnPropertyDescriptor(value, symbol);
    if (descriptor && !descriptor.enumerable) {
      continue;
    }
    result[symbol] = cloneValue(value[symbol], seen);
  }

  return result;
}
