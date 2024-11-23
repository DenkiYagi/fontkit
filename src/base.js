// @ts-check

// @ts-ignore
import {DecodeStream} from 'restructure';

export let logErrors = false;

let formats = [];
export function registerFormat(format) {
  formats.push(format);
};

/**
 * @param {ArrayBufferView} buffer
 * @param {string} [postscriptName]
 * @return {import("./types").Font | import("./types").FontCollection} 
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

export { default as DefaultShaper} from './opentype/shapers/DefaultShaper';
