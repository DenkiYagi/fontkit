import * as fontkit from '@denkiyagi/fontkit';
import assert from 'assert';

describe('japanese', () => {
  describe('JP feature fallback', () => {
    const font = fontkit.openSync(new URL('data/NoteSansJP/NotoSansJP-VariableFont_wght.ttf', import.meta.url));
    
    it('should have jp83 and jp90 features', function() {
      const features = font.getAvailableFeatures();
      assert(features.includes('jp83'));
      assert(features.includes('jp90'));
    });
    
    it('should map VS17 to jp83 feature', function() {
      const run = font.layout('\u9022\uDB40\uDD00'); // 逢 + VS17
      assert(run.features.jp83);
      assert.equal(run.glyphs[0].id, 16541); // jp83 variant
    });
    
    it('should map VS18 to jp90 feature', function() {
      const run = font.layout('\u9022\uDB40\uDD01'); // 逢 + VS18
      assert(run.features.jp90);
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
      
      assert(vs17Run.features.jp83);
      assert(vs18Run.features.jp90);
      assert.equal(vs17Run.glyphs[0].id, vs18Run.glyphs[0].id); // Same glyph
      assert.notEqual(vs17Run.glyphs[0].id, baseRun.glyphs[0].id); // Different from base
    });
    
    it('should not apply fallback for unsupported variation selectors', function() {
      const run = font.layout('\u9022\uDB40\uDD02'); // 逢 + VS19
      assert(!run.features.jp83);
      assert(!run.features.jp90);
      assert.equal(run.glyphs[0].id, 12889); // Base glyph
    });
    
    it('should work with explicit features parameter', function() {
      const run = font.layout('\u9022\uDB40\uDD01', {}); // Empty features object
      assert(run.features.jp90);
      assert.equal(run.glyphs[0].id, 16246);
    });
    
    it('should work with array features parameter', function() {
      const run = font.layout('\u9022\uDB40\uDD01', []); // Empty features array
      assert(run.features.jp90);
      assert.equal(run.glyphs[0].id, 16246);
    });
  });
});