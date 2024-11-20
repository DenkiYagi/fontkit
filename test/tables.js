import * as fontkit from "@denkiyagi/fontkit";
import assert from "assert";

describe("tables", function () {
  const font = fontkit.openSync(
    new URL("data/NotoSans/NotoSans.ttc", import.meta.url),
    "NotoSans"
  );
  const fontCJK = fontkit.openSync(
    new URL("data/NotoSansCJK/NotoSansCJKkr-Regular.otf", import.meta.url)
  );

  it("should expose hhea table", function () {
    assert.deepStrictEqual(font.hhea, {
      version: 0x10000, // v1.0
      ascent: 2189,
      descent: -600,
      lineGap: 0,
      advanceWidthMax: 2994,
      minLeftSideBearing: 0,
      minRightSideBearing: -1550,
      xMaxExtent: 0,
      caretSlopeRise: 1,
      caretSlopeRun: 0,
      caretOffset: 0,
      metricDataFormat: 0,
      numberOfMetrics: 8707,
    });
  });

  it("should expose vhea table", function () {
    assert.deepStrictEqual(fontCJK.vhea, {
      version: 0x11000, // v1.1
      ascent: 500,
      descent: -500,
      lineGap: 0,
      advanceHeightMax: 3000,
      minTopSideBearing: -1002,
      minBottomSideBearing: -677,
      yMaxExtent: 2928,
      caretSlopeRise: 0,
      caretSlopeRun: 1,
      caretOffset: 0,
      metricDataFormat: 0,
      numberOfMetrics: 65167,
    });
  });

  it("should expose OS/2 table", function () {
    assert.deepStrictEqual(font["OS/2"], {
      version: 4,
      xAvgCharWidth: 1224,
      usWeightClass: 400,
      usWidthClass: 5,
      fsType: {
        noEmbedding: false,
        viewOnly: false,
        editable: false,
        noSubsetting: false,
        bitmapOnly: false,
      },
      ySubscriptXSize: 1434,
      ySubscriptYSize: 1331,
      ySubscriptXOffset: 0,
      ySubscriptYOffset: 287,
      ySuperscriptXSize: 1434,
      ySuperscriptYSize: 1331,
      ySuperscriptXOffset: 0,
      ySuperscriptYOffset: 977,
      yStrikeoutSize: 102,
      yStrikeoutPosition: 512,
      sFamilyClass: 2050,
      panose: [2, 11, 5, 2, 4, 5, 4, 2, 2, 4],
      ulCharRange: [3758097151, 1073772799, 41, 0],
      vendorID: "GOOG",
      fsSelection: {
        italic: false,
        underscore: false,
        negative: false,
        outlined: false,
        strikeout: false,
        bold: false,
        regular: true,
        useTypoMetrics: false,
        wws: false,
        oblique: false,
      },
      usFirstCharIndex: 13,
      usLastCharIndex: 65533,
      typoAscender: 2189,
      typoDescender: -600,
      typoLineGap: 0,
      winAscent: 2189,
      winDescent: 600,
      codePageRange: [536871327, 3755409408],
      xHeight: 1098,
      capHeight: 1462,
      defaultChar: 0,
      breakChar: 32,
      maxContent: 24,
    });
  });
});
