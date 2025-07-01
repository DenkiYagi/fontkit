import * as fontkit from '@denkiyagi/fontkit';
import assert from 'assert';

describe('Japanese IVS glyphs', () => {
  describe('JP IVS with format 14 cmap', () => {
    const testFont = fontkit.openSync(new URL('data/fonttest/TestCMAP14.otf', import.meta.url));
    const hanaFont = fontkit.openSync(new URL('data/Hanazono/HanaMinA.ttf', import.meta.url));
    
    it('should have format 14 cmap support', function() {
      assert(testFont._cmapProcessor.uvs != null, 'TestCMAP14 should have format 14 cmap');
      assert(hanaFont._cmapProcessor.uvs != null, 'HanaMinA should have format 14 cmap');
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
