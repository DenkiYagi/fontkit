import * as fontkit from '@denkiyagi/fontkit';
import assert from 'assert';

describe('metadata', function () {
  let font = fontkit.openSync(new URL('data/NotoSans/NotoSans.ttc', import.meta.url), 'NotoSans');
  let fontCJK = fontkit.openSync(new URL('data/NotoSansCJK/NotoSansCJKkr-Regular.otf', import.meta.url));

  it('has metadata properties', function () {
    assert.equal(font.fullName, 'Noto Sans');
    assert.equal(font.postscriptName, 'NotoSans');
    assert.equal(font.familyName, 'Noto Sans');
    assert.equal(font.subfamilyName, 'Regular');
    assert.equal(font.copyright, 'Copyright 2012 Google Inc. All Rights Reserved.');
    return assert.equal(font.version, 'Version 1.05 uh');
  });

  it('exposes some metrics', function () {
    assert.equal(font.unitsPerEm, 2048);
    assert.equal(font.ascent | 0, 2189);
    assert.equal(font.descent | 0, -600);
    assert.equal(font.lineGap, 0);
    assert.equal(font.underlinePosition, -154);
    assert.equal(font.underlineThickness, 102);
    assert.equal(font.italicAngle, 0);
    assert.equal(font.capHeight, 1462);
    assert.equal(font.xHeight, 1098);
    assert.equal(font.numGlyphs, 8708);
    assert.equal(font.bbox.minX, -1268);
    assert.equal(font.bbox.minY, -600);
    assert.equal(font.bbox.maxX, 2952);
    assert.equal(font.bbox.maxY, 2189);

    assert.strictEqual(font.defaultVertOriginY, null);
    assert.strictEqual(fontCJK.defaultVertOriginY, 880);
  });

  it('exposes tables directly', function () {
    let iterable = ['head', 'hhea', 'OS/2', 'post'];
    for (let i = 0; i < iterable.length; i++) {
      let table = iterable[i];
      assert.equal(typeof font[table], 'object');
    }
  });

  it("exposes vertOriginYMetrics in VORG table", function () {
    assert.strictEqual(font.getVertOriginYMap(), null);

    const vertOriginYMap = fontCJK.getVertOriginYMap();
    const sampleEntries = [
      // first three entries in VORG metrics
      { glyphId: 730, expectedVertOriginY: 867 },
      { glyphId: 746, expectedVertOriginY: 868 },
      { glyphId: 747, expectedVertOriginY: 875 },
    ];
    for (const entry of sampleEntries) {
      assert.strictEqual(
        vertOriginYMap.get(entry.glyphId),
        entry.expectedVertOriginY
      );
    }
  });
});
