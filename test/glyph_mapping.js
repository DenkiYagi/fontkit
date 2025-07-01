import * as fontkit from '@denkiyagi/fontkit';
import assert from 'assert';

describe('character to glyph mapping', function () {
  describe('basic cmap handling', function () {
    let font = fontkit.openSync(new URL('data/OpenSans/OpenSans-Regular.ttf', import.meta.url));

    it('should get characterSet', function () {
      assert(Array.isArray(font.characterSet));
      return assert.equal(font.characterSet.length, 884);
    });

    it('should check if a character is supported', function () {
      assert(font.hasGlyphForCodePoint('a'.charCodeAt()));
      return assert(!font.hasGlyphForCodePoint(0));
    });

    it('should get a glyph for a character code', function () {
      let glyph = font.glyphForCodePoint('a'.charCodeAt());
      assert.equal(glyph.id, 68);
      return assert.deepEqual(glyph.codePoints, [97]);
    });

    it('should map a string to glyphs', function () {
      let glyphs = font.glyphsForString('hello', []);
      assert(Array.isArray(glyphs));
      assert.equal(glyphs.length, 5);
      assert.deepEqual(glyphs.map(g => g.id), [75, 72, 79, 79, 82]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[104], [101], [108], [108], [111]]);
    });

    it('should support unicode variation selectors', function () {
      let font = fontkit.openSync(new URL('data/fonttest/TestCMAP14.otf', import.meta.url));
      let glyphs = font.glyphsForString('\u{82a6}\u{82a6}\u{E0100}\u{82a6}\u{E0101}');
      assert.deepEqual(glyphs.map(g => g.id), [1, 1, 2]);
    });

    it('should support legacy encodings when no unicode cmap is found', function () {
      let font = fontkit.openSync(new URL('data/fonttest/TestCMAPMacTurkish.ttf', import.meta.url));
      let glyphs = font.glyphsForString("“ABÇĞIİÖŞÜ”");
      assert.deepEqual(glyphs.map(g => g.id), [200, 34, 35, 126, 176, 42, 178, 140, 181, 145, 201]);
    });
  });

  describe('cmap format 14 handling', function () {
    let font = fontkit.openSync(new URL('data/fonttest/TestCMAP14.otf', import.meta.url));

    it('should detect format 14 support', function () {
      assert(font._cmapProcessor);
      assert(font._cmapProcessor.uvs);
    });

    it('should handle VS17 (U+E0100) with layout', function () {
      const run = font.layout('\u82A6\uDB40\uDD00'); // 芦 + VS17
      assert.equal(run.glyphs.length, 1);
      assert.equal(run.glyphs[0].id, 1);
    });

    it('should handle VS18 (U+E0101) with layout', function () {
      const run = font.layout('\u82A6\uDB40\uDD01'); // 芦 + VS18
      assert.equal(run.glyphs.length, 1);
      assert(run.glyphs[0].id > 0);
    });

    it('should preserve codePoints in glyphs with variation selectors', function () {
      const glyphs = font.glyphsForString('\u82A6\uDB40\uDD01');
      assert.equal(glyphs.length, 1);
      assert(glyphs[0].codePoints);
      assert(glyphs[0].codePoints.length >= 1);
      assert.equal(glyphs[0].codePoints[0], 0x82A6);
    });

    it('should handle format 14 as primary cmap table', function () {
      const processor = font._cmapProcessor;
      
      // Base character without VS should return 0 if format 14 is primary
      const baseGlyph = processor.lookup(0x82A6);
      if (processor.cmap.version === 14) {
        assert.equal(baseGlyph, 0);
      }
      
      // With VS should return the correct glyph
      const vsGlyph = processor.lookup(0x82A6, 0xE0100);
      assert(vsGlyph > 0);
    });

    it('should handle lookupNonDefaultVariation correctly', function () {
      const processor = font._cmapProcessor;

      // Test default variation
      const glyph1 = processor.lookupNonDefaultVariation(0x82A6, 0xE0100);
      assert.equal(glyph1, 0); // Not found returns 0

      // Test non-default variation
      const glyph2 = processor.lookupNonDefaultVariation(0x82A6, 0xE0101);
      assert.equal(glyph2, 2); // Variation glyph ID should be 2 according to CMAP format 14

      // Test non-registered variation
      const glyph3 = processor.lookupNonDefaultVariation(0x2269, 0xE01EF);
      assert.equal(glyph3, 0); // Not found returns 0
    });
  });

  describe('opentype features', function () {
    let font = fontkit.openSync(new URL('data/SourceSansPro/SourceSansPro-Regular.otf', import.meta.url));

    it('should list available features', () =>
      assert.deepEqual(font.availableFeatures, [
        'aalt', 'c2sc', 'case', 'ccmp', 'dnom', 'frac', 'liga', 'numr',
        'onum', 'ordn', 'pnum', 'salt', 'sinf', 'smcp', 'ss01', 'ss02',
        'ss03', 'ss04', 'ss05', 'subs', 'sups', 'zero', 'kern', 'mark',
        'mkmk', 'size'
      ])
    );

    it('should apply opentype GSUB features', function () {
      let { glyphs } = font.layout('ffi', ['dlig']);
      assert.equal(glyphs.length, 2);
      assert.deepEqual(glyphs.map(g => g.id), [514, 36]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[102, 102], [105]]);
    });
  });

  describe('AAT features', function () {
    let font = fontkit.openSync(new URL('data/Play/Play-Regular.ttf', import.meta.url));

    it('should list available features', () => assert.deepEqual(font.availableFeatures, ['tnum', 'sups', 'subs', 'numr', 'onum', 'lnum', 'liga', 'kern']));

    it('should apply default AAT morx features', function () {
      let { glyphs } = font.layout('ffi 1⁄2');
      assert.equal(glyphs.length, 5);
      assert.deepEqual(glyphs.map(g => g.id), [767, 3, 20, 645, 21]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[102, 102, 105], [32], [49], [8260], [50]]);
    });

    it('should allow for disabling of default AAT morx features', function () {
      let { glyphs } = font.layout('ffi 1⁄2', { 'liga': false });
      assert.equal(glyphs.length, 7);
      assert.deepEqual(glyphs.map(g => g.id), [73, 73, 76, 3, 20, 645, 21]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[102], [102], [105], [32], [49], [8260], [50]]);
    });

    it('should apply user specified features', function () {
      let { glyphs } = font.layout('ffi 1⁄2', ['numr']);
      assert.equal(glyphs.length, 3);
      assert.deepEqual(glyphs.map(g => g.id), [767, 3, 126]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[102, 102, 105], [32], [49, 8260, 50]]);
    });

    it('should handle rtl direction', function () {
      let { glyphs } = font.layout('ffi', [], {direction: 'rtl'});
      assert.equal(glyphs.length, 3);
      assert.deepEqual(glyphs.map(g => g.id), [76, 73, 73]);
      return assert.deepEqual(glyphs.map(g => g.codePoints), [[105], [102], [102]]);
    });

    it('should apply indic reordering features', function () {
      let f = fontkit.openSync(new URL('data/Khmer/Khmer.ttf', import.meta.url));
      let { glyphs } = f.layout('ខ្ញុំអាចញ៉ាំកញ្ចក់បាន ដោយគ្មានបញ្ហា');
      assert.deepEqual(glyphs.map(g => g.id), [
        45, 153, 177, 112, 248, 188, 49, 296, 44, 187, 149, 44, 117, 236, 188, 63, 3, 107,
        226, 188, 69, 218, 169, 188, 63, 64, 255, 175, 188
      ]);

      return assert.deepEqual(glyphs.map(g => g.codePoints), [
        [6017], [6098, 6025], [6075], [6086], [6050], [6070], [6021],
        [6025, 6089, 6070, 6086], [6016], [6025], [6098, 6021], [6016],
        [6091], [6036], [6070], [6035], [32], [6084], [6026], [6070],
        [6041], [6018], [6098, 6040], [6070], [6035], [6036], [6025],
        [6098, 6048], [6070]
      ]);
    });
  });

  describe('glyph id to strings', function () {
    it('should return strings from cmap that map to a given glyph', function () {
      let font = fontkit.openSync(new URL('data/OpenSans/OpenSans-Regular.ttf', import.meta.url));
      let strings = font.stringsForGlyph(68);
      assert.deepEqual(strings, ['a']);
    });

    it('should return strings from AAT morx table that map to the given glyph', function () {
      let font = fontkit.openSync(new URL('data/Play/Play-Regular.ttf', import.meta.url));
      let strings = font.stringsForGlyph(767);
      assert.deepEqual(strings, ['ffi']);
    });
  });
});
