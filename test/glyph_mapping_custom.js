import * as fontkit from '@denkiyagi-gh/fontkit';
import { DefaultShaper } from '@denkiyagi-gh/fontkit';
import assert from 'assert';
import { isDigit } from 'unicode-properties';

class FractionShaper extends DefaultShaper {
  planPreprocessing(plan) {
    super.planPreprocessing(plan);
    plan.add({
      local: ['frac', 'numr', 'dnom']
    });
  }

  assignFeatures(plan, glyphs) {
    // Enable contextual fractions
    for (let i = 0; i < glyphs.length; i++) {
      let glyph = glyphs[i];
      if (glyph.codePoints[0] === 0x2044) { // fraction slash
        let start = i;
        let end = i + 1;

        // Apply numerator
        while (start > 0 && isDigit(glyphs[start - 1].codePoints[0])) {
          glyphs[start - 1].features.numr = true;
          glyphs[start - 1].features.frac = true;
          start--;
        }

        // Apply denominator
        while (end < glyphs.length && isDigit(glyphs[end].codePoints[0])) {
          glyphs[end].features.dnom = true;
          glyphs[end].features.frac = true;
          end++;
        }

        // Apply fraction slash
        glyph.features.frac = true;
        i = end - 1;
      }
    }
  }
}

describe('character to glyph mapping with custom shaper', function () {
  describe('opentype features', function () {
    const font = fontkit.openSync(new URL('data/SourceSansPro/SourceSansPro-Regular.otf', import.meta.url));
    const fractionShaper = new FractionShaper();

    it('should enable fractions when using fraction slash', function () {
      const { glyphs } = font.layout('123 1⁄16 123', undefined, { shaper: fractionShaper });
      return assert.deepEqual(glyphs.map(g => g.id), [1088, 1089, 1090, 1, 1617, 1724, 1603, 1608, 1, 1088, 1089, 1090]);
    });

    it('should not break if can’t enable fractions when using fraction slash', function () {
      const { glyphs } = font.layout('a⁄b ⁄ 1⁄ ⁄2', undefined, { shaper: fractionShaper });
      return assert.deepEqual(glyphs.map(g => g.id), [28, 1724, 29, 1, 1724, 1, 1617, 1724, 1, 1724, 1604]);
    });
  });
});
