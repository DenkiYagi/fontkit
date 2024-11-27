// @ts-check

export default class Subset {
  /**
   * @type {('TTF' | 'CFF' | 'UNKNOWN')}
   */
  type = 'UNKNOWN';

  /**
   * @param {import("../TTFFont").default} font
   */
  constructor(font) {
    /**
     * @type {import("../TTFFont").default}
     */
    this.font = font;

    /**
     * @type {number[]}
     */
    this.glyphs = [];

    /**
     * @type {Record<number, number>}
     */
    this.mapping = {};

    // always include the missing glyph
    this.includeGlyph(0);
  }

  /**
   * @param {(number | import('../glyph/Glyph').default)} glyph
   * @returns {number}
   */
  includeGlyph(glyph) {
    if (typeof glyph === 'object') {
      glyph = glyph.id;
    }

    if (this.mapping[glyph] == null) {
      this.glyphs.push(glyph);
      this.mapping[glyph] = this.glyphs.length - 1;
    }

    return this.mapping[glyph];
  }

  /**
   * @returns {Uint8Array}
   */
  encode() {
    throw new Error('Not implemented');
  }
}
