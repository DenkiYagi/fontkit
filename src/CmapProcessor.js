import { binarySearch, range } from './utils/arrays';
import { encodingExists, getEncoding, getEncodingMapping } from './encodings';
import { cache } from './decorators';
import { AssertionError, InvalidFontDataError, UnsupportedFontDataError } from './errors';

export default class CmapProcessor {
  constructor(cmapTable) {
    // Attempt to find a Unicode cmap first
    this.encoding = null;
    this.cmap = this.findSubtable(cmapTable, [
      // 32-bit subtables
      [3, 10],
      [0, 6],
      [0, 4],

      // 16-bit subtables
      [3, 1],
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0]
    ]);

    // If not unicode cmap was found, take the first table with a supported encoding.
    if (!this.cmap) {
      for (let cmap of cmapTable.tables) {
        let encoding = getEncoding(cmap.platformID, cmap.encodingID, cmap.table.language - 1);
        let mapping = getEncodingMapping(encoding);
        if (mapping) {
          this.cmap = cmap.table;
          this.encoding = mapping;
        }
      }
    }

    if (!this.cmap) {
      throw new UnsupportedFontDataError('Could not find a supported cmap table');
    }

    this.uvs = this.findSubtable(cmapTable, [[0, 5]]);
    if (this.uvs && this.uvs.version !== 14) {
      this.uvs = null;
    }
  }

  findSubtable(cmapTable, pairs) {
    for (let [platformID, encodingID] of pairs) {
      for (let cmap of cmapTable.tables) {
        if (cmap.platformID === platformID && cmap.encodingID === encodingID) {
          return cmap.table;
        }
      }
    }

    return null;
  }

  lookup(codepoint, variationSelector) {
    // If there is no Unicode cmap in this font, we need to re-encode
    // the codepoint in the encoding that the cmap supports.
    if (this.encoding) {
      codepoint = this.encoding.get(codepoint) || codepoint;

      // Otherwise, try to get a Unicode variation selector for this codepoint if one is provided.
    } else if (variationSelector) {
      let gid = this.lookupNonDefaultUVS(codepoint, variationSelector);
      if (gid) {
        return gid;
      }
    }

    let cmap = this.cmap;
    switch (cmap.version) {
      case 0:
        return cmap.codeMap.get(codepoint) || 0;

      case 2:
        // Microsoft OpenType spec says "This format is not commonly used today."
        throw new UnsupportedFontDataError('Unsupported cmap format 2');

      case 4: {
        let min = 0;
        let max = cmap.segCount - 1;
        while (min <= max) {
          let mid = (min + max) >> 1;

          if (codepoint < cmap.startCode.get(mid)) {
            max = mid - 1;
          } else if (codepoint > cmap.endCode.get(mid)) {
            min = mid + 1;
          } else {
            let rangeOffset = cmap.idRangeOffset.get(mid);
            let gid;

            if (rangeOffset === 0) {
              gid = codepoint + cmap.idDelta.get(mid);
            } else {
              let index = rangeOffset / 2 + (codepoint - cmap.startCode.get(mid)) - (cmap.segCount - mid);
              gid = cmap.glyphIndexArray.get(index) || 0;
              if (gid !== 0) {
                gid += cmap.idDelta.get(mid);
              }
            }

            return gid & 0xffff;
          }
        }

        return 0;
      }

      case 8:
        // TODO: support format 8
        throw new UnsupportedFontDataError('Unsupported cmap format 8');

      case 6:
      case 10:
        return cmap.glyphIndices.get(codepoint - cmap.firstCode) || 0;

      case 12:
      case 13: {
        let min = 0;
        let max = cmap.nGroups - 1;
        while (min <= max) {
          let mid = (min + max) >> 1;
          let group = cmap.groups.get(mid);

          if (codepoint < group.startCharCode) {
            max = mid - 1;
          } else if (codepoint > group.endCharCode) {
            min = mid + 1;
          } else {
            if (cmap.version === 12) {
              return group.glyphID + (codepoint - group.startCharCode);
            } else {
              return group.glyphID;
            }
          }
        }

        return 0;
      }

      case 14:
        // Format 14 is handled separately via the uvs property
        throw new AssertionError('Unexpected cmap format 14');

      default:
        throw new InvalidFontDataError(`Unknown cmap format ${cmap.version}`);
    }
  }

  /**
   * Find the glyph ID for a non-default variation of a character.
   *
   * @param {number} codepoint Codepoint for the base character.
   * @param {number} variationSelector Codepoint for the variation selector.
   * @returns {number} The glyph ID for the non-default variation, or 0 if not found.
   */
  lookupNonDefaultUVS(codepoint, variationSelector) {
    if (!this.uvs) {
      return 0;
    }

    let sel = this._getVariationSelectorRecord(variationSelector);

    if (!sel) {
      return 0;
    }

    if (sel.nonDefaultUVS) {
      let nonDefaultIndex = binarySearch(sel.nonDefaultUVS, x => codepoint - x.unicodeValue);
      if (nonDefaultIndex !== -1) {
        return sel.nonDefaultUVS[nonDefaultIndex].glyphID;
      }
    }

    return 0;
  }

  @cache
  getCharacterSet() {
    let cmap = this.cmap;
    switch (cmap.version) {
      case 0:
        return range(0, cmap.codeMap.length);

      case 2:
        // Microsoft OpenType spec says "This format is not commonly used today."
        throw new UnsupportedFontDataError('Unsupported cmap format 2');

      case 4: {
        let res = [];
        let endCodes = cmap.endCode.toArray();
        for (let i = 0; i < endCodes.length; i++) {
          let tail = endCodes[i] + 1;
          let start = cmap.startCode.get(i);
          res.push(...range(start, tail));
        }

        return res;
      }

      case 8:
        // TODO: support format 8
        throw new UnsupportedFontDataError('Unsupported cmap format 8');

      case 6:
      case 10:
        return range(cmap.firstCode, cmap.firstCode + cmap.glyphIndices.length);

      case 12:
      case 13: {
        let res = [];
        for (let group of cmap.groups.toArray()) {
          res.push(...range(group.startCharCode, group.endCharCode + 1));
        }

        return res;
      }

      case 14:
        // Format 14 is handled separately via the uvs property
        throw new AssertionError('Unexpected cmap format 14');

      default:
        throw new InvalidFontDataError(`Unknown cmap format ${cmap.version}`);
    }
  }

  /**
   * @returns {{ baseCharacter: number, variationSelector: number, glyphID: number }[]}
   */
  @cache
  getNonDefaultUVSSet() {
    if (!this.uvs) {
      return [];
    }

    const variations = [];
    for (const sel of this._variationSelectorRecordArray) {
      if (sel.nonDefaultUVS) {
        const { varSelector } = sel;
        for (const uvsMapping of sel.nonDefaultUVS) {
          variations.push({
            baseCharacter: uvsMapping.unicodeValue,
            variationSelector: varSelector,
            glyphID: uvsMapping.glyphID,
          });
        }
      }
    }

    return variations;
  }

  /**
   * Get and cache the array of the `varSelectors` records from the UVS subtable (format 14).
   * 
   * @see https://learn.microsoft.com/en-us/typography/opentype/spec/cmap
   */
  @cache
  get _variationSelectorRecordArray() {
    if (!this.uvs) return [];

    return this.uvs.varSelectors.toArray();
  }

  /**
   * Get a variation selector record by its codepoint.
   *
   * @param {number} variationSelector 
   * @returns The `VarSelectorRecord` instance, or `null` if not found.
   */
  @cache
  _getVariationSelectorRecord(variationSelector) {
    let selectors = this._variationSelectorRecordArray;
    let selectorIndex = binarySearch(selectors, x => variationSelector - x.varSelector);

    if (selectorIndex === -1) {
      return null;
    }

    return selectors[selectorIndex];
  }

  @cache
  codePointsForGlyph(gid) {
    let cmap = this.cmap;
    switch (cmap.version) {
      case 0: {
        let res = [];
        for (let i = 0; i < 256; i++) {
          if (cmap.codeMap.get(i) === gid) {
            res.push(i);
          }
        }

        return res;
      }

      case 4: {
        let res = [];
        for (let i = 0; i < cmap.segCount; i++) {
          let end = cmap.endCode.get(i);
          let start = cmap.startCode.get(i);
          let rangeOffset = cmap.idRangeOffset.get(i);
          let delta = cmap.idDelta.get(i);

          for (var c = start; c <= end; c++) {
            let g = 0;
            if (rangeOffset === 0) {
              g = c + delta;
            } else {
              let index = rangeOffset / 2 + (c - start) - (cmap.segCount - i);
              g = cmap.glyphIndexArray.get(index) || 0;
              if (g !== 0) {
                g += delta;
              }
            }

            if (g === gid) {
              res.push(c);
            }
          }
        }

        return res;
      }

      case 2:
      case 6:
      case 8:
      case 10:
        throw new UnsupportedFontDataError(`Unsupported cmap format ${cmap.version}`);

      case 12: {
        let res = [];
        for (let group of cmap.groups.toArray()) {
          if (gid >= group.glyphID && gid <= group.glyphID + (group.endCharCode - group.startCharCode)) {
            res.push(group.startCharCode + (gid - group.glyphID));
          }
        }

        return res;
      }

      case 13: {
        let res = [];
        for (let group of cmap.groups.toArray()) {
          if (gid === group.glyphID) {
            res.push(...range(group.startCharCode, group.endCharCode + 1));
          }
        }

        return res;
      }

      case 14:
        // Format 14 is handled separately via the uvs property
        throw new AssertionError('Unexpected cmap format 14');

      default:
        throw new InvalidFontDataError(`Unknown cmap format ${cmap.version}`);
    }
  }
}
