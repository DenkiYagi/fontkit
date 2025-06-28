import * as fontkit from '@denkiyagi/fontkit';
import assert from 'assert';

describe('Japanese IVS glyphs', () => {
  describe('JP IVS', () => {
    const font = fontkit.openSync(new URL('data/NotoSansJP/NotoSansJP-VariableFont_wght.ttf', import.meta.url));
    
    it('should have jp83 and jp90 features', function() {
      const features = font.getAvailableFeatures();
      assert(features.includes('jp83'));
      assert(features.includes('jp90'));
    });
    
    it('should apply jp83 variant for VS17', function() {
      const run = font.layout('\u9022\uDB40\uDD00'); // 逢 + VS17
      assert.equal(run.glyphs[0].id, 16541); // jp83 variant
    });
    
    it('should apply jp90 variant for VS18', function() {
      const run = font.layout('\u9022\uDB40\uDD01'); // 逢 + VS18
      assert.equal(run.glyphs[0].id, 16246); // jp90 variant
    });
    
    it('should produce different glyphs for VS17 and VS18', function() {
      const vs17Run = font.layout('\u9022\uDB40\uDD00'); // 逢 + VS17
      const vs18Run = font.layout('\u9022\uDB40\uDD01'); // 逢 + VS18
      assert.notEqual(vs17Run.glyphs[0].id, vs18Run.glyphs[0].id);
    });
    
    it('should produce different glyphs from base character', function() {
      const baseRun = font.layout('\u9022'); // 逢 without VS
      const vs17Run = font.layout('\u9022\uDB40\uDD00'); // 逢 + VS17
      const vs18Run = font.layout('\u9022\uDB40\uDD01'); // 逢 + VS18
      
      assert.notEqual(vs17Run.glyphs[0].id, baseRun.glyphs[0].id);
      assert.notEqual(vs18Run.glyphs[0].id, baseRun.glyphs[0].id);
    });
    
    it('should handle characters with same jp83/jp90 glyphs', function() {
      const baseRun = font.layout('\u82A6'); // 芦 without VS
      const vs17Run = font.layout('\u82A6\uDB40\uDD00'); // 芦 + VS17
      const vs18Run = font.layout('\u82A6\uDB40\uDD01'); // 芦 + VS18
      
      assert.equal(vs17Run.glyphs[0].id, vs18Run.glyphs[0].id); // Same glyph
      assert.notEqual(vs17Run.glyphs[0].id, baseRun.glyphs[0].id); // Different from base
    });
    
    it('should not apply fallback for unsupported variation selectors', function() {
      const run = font.layout('\u9022\uDB40\uDD02'); // 逢 + VS19
      assert.equal(run.glyphs[0].id, 12889); // Base glyph
    });
    
    it('should not affect characters without VS in mixed content', function() {
      // Test string with VS17 on first character, but not on others
      const mixedRun = font.layout('\u9022\uDB40\uDD00\u901A\u82A6'); // 逢+VS17, 通, 芦
      
      // Compare with individual base glyphs
      const baseRun1 = font.layout('\u901A'); // 通 alone
      const baseRun2 = font.layout('\u82A6'); // 芦 alone
      
      assert.equal(mixedRun.glyphs.length, 3);
      assert.equal(mixedRun.glyphs[0].id, 16541); // VS17 variant for 逢
      assert.equal(mixedRun.glyphs[1].id, baseRun1.glyphs[0].id); // Base glyph for 通
      assert.equal(mixedRun.glyphs[2].id, baseRun2.glyphs[0].id); // Base glyph for 芦
    });
    
    it('should handle multiple VS in the same string correctly', function() {
      // String with different VS on different characters
      const mixedRun = font.layout('あ\u9022\uDB40\uDD00\u82A6\uDB40\uDD01'); // 逢+VS17, 芦+VS18
      
      assert.equal(mixedRun.glyphs.length, 3);
      assert.equal(mixedRun.glyphs[0].id, 1203);
      assert.equal(mixedRun.glyphs[1].id, 16541); // jp83 variant for 逢
      assert.equal(mixedRun.glyphs[2].id, 16214); // jp90 variant for 芦
    });
  });

  describe('JP IVS with format 14 cmap', () => {
    const testFont = fontkit.openSync(new URL('data/fonttest/TestCMAP14.otf', import.meta.url));
    const hanaFont = fontkit.openSync(new URL('data/Hanazono/HanaMinA.ttf', import.meta.url));
    
    it('should have format 14 cmap support', function() {
      assert(testFont._cmapProcessor.uvs != null, 'TestCMAP14 should have format 14 cmap');
      assert(hanaFont._cmapProcessor.uvs != null, 'HanaMinA should have format 14 cmap');
    });
    
    it('should NOT apply JP fallback when format 14 is present', function() {
      // Test with ASCII character (which shouldn't have VS variants)
      const baseRun = testFont.layout('A');
      const vs17Run = testFont.layout('A\uDB40\uDD00'); // A + VS17
      const vs18Run = testFont.layout('A\uDB40\uDD01'); // A + VS18
      
      // All should return the same glyph ID
      assert.equal(vs17Run.glyphs[0].id, baseRun.glyphs[0].id);
      assert.equal(vs18Run.glyphs[0].id, baseRun.glyphs[0].id);
      
      // No JP features should be applied
      assert(!vs17Run.features.jp83, 'jp83 should not be applied with format 14');
      assert(!vs18Run.features.jp90, 'jp90 should not be applied with format 14');
    });
    
    it('should use format 14 cmap for variation selector handling', function() {
      // Test with a character that might have actual VS mappings
      // Using a common punctuation that might have variants
      const vs1Run = testFont.layout('.\uFE00'); // . + VS1
      const vs17Run = testFont.layout('.\uDB40\uDD00'); // . + VS17
      
      // The behavior depends on what's actually in the format 14 table
      // But the important thing is JP fallback is NOT used
      assert(!vs1Run.features.jp83 && !vs1Run.features.jp90, 
            'No JP features should be applied with VS1');
      assert(!vs17Run.features.jp83 && !vs17Run.features.jp90, 
            'No JP features should be applied with VS17');
    });

    it('should handle 小小󠄀小󠄁小󠄂', function() {
      const run1 = hanaFont.layout('\u5C0F');             // 小
      const run2 = hanaFont.layout('\u5C0F\uDB40\uDD00'); // 小󠄀
      const run3 = hanaFont.layout('\u5C0F\uDB40\uDD01'); // 小󠄁
      const run4 = hanaFont.layout('\u5C0F\uDB40\uDD02'); // 小󠄂
      
      assert.equal(run1.glyphs.length, 1);
      assert.equal(run2.glyphs.length, 1);
      assert.equal(run3.glyphs.length, 1);
      assert.equal(run3.glyphs.length, 1);

      assert.equal(run2.glyphs[0].id, run1.glyphs[0].id);
      assert.notEqual(run3.glyphs[0].id, run1.glyphs[0].id);
      assert.notEqual(run4.glyphs[0].id, run1.glyphs[0].id);
      assert.notEqual(run4.glyphs[0].id, run3.glyphs[0].id);
    });
  });
});
