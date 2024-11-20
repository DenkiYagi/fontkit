// @ts-check

// @ts-ignore
import {DecodeStream} from 'restructure';

/**
 * @typedef {import("./types.js").Font} Font
 * @typedef {import("./types.js").FontCollection} FontCollection
 */

export let logErrors = false;

let formats = [];
export function registerFormat(format) {
  formats.push(format);
};

/**
 * @param {ArrayBufferView} buffer
 * @param {string} [postscriptName]
 * @return {Font | FontCollection} 
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
};

export let defaultLanguage = 'en';
export function setDefaultLanguage(lang = 'en') {
  defaultLanguage = lang;
};
