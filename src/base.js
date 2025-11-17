// @ts-check

// @ts-ignore
import { DecodeStream } from 'restructure';

// -----------------------------------------------------------------------------

let loggingWarnings = false;

export function isLoggingWarnings() {
  return loggingWarnings;
}

/**
 * @param {boolean} flag
 */
export function logWarnings(flag) {
  loggingWarnings = flag;
}

// -----------------------------------------------------------------------------

let formats = [];
export function registerFormat(format) {
  formats.push(format);
}

// -----------------------------------------------------------------------------

/**
 * @param {ArrayBufferView} buffer
 * @param {string} [postscriptName]
 * @return {(import('./TTFFont.js').default | import('./TrueTypeCollection.js').default)}
 */
export function create(buffer, postscriptName) {
  for (let i = 0; i < formats.length; i++) {
    let format = formats[i];
    if (format.probe(buffer)) {
      let font = new format(new DecodeStream(buffer));
      if (postscriptName) {
        return font.getFont(postscriptName);
      }

      return font;
    }
  }

  throw new Error('Unknown font format');
}

// -----------------------------------------------------------------------------

let defaultLanguage = 'en';
export function getDefaultLanguage() {
  return defaultLanguage;
}
export function setDefaultLanguage(lang = 'en') {
  defaultLanguage = lang;
}

// -----------------------------------------------------------------------------

export { default as DefaultShaper } from './opentype/shapers/DefaultShaper';
