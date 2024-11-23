import type { default as _TTFFont } from "./TTFFont.js";
import type WOFFFont from "./WOFFFont.js";
import type WOFF2Font from "./WOFF2Font.js";
import type TrueTypeCollection from "./TrueTypeCollection.js";
import type DFont from "./DFont.js";
import GlyphInfo from "./opentype/GlyphInfo.js";
import ShapingPlan from "./opentype/ShapingPlan.js";
import Glyph from "./glyph/Glyph.js";

export type TTFFont = _TTFFont & Record<string, object>;
export type Font = TTFFont | WOFFFont | WOFF2Font;
export type FontCollection = TrueTypeCollection | DFont;

/**
 * Advanced parameters for `TTFFont#layout` and `LayoutEngine#layout`.
 */
export type LayoutAdvancedParams = {
  /**
   * If not provided, `fontkit` attempts to detect the script from the string.
   */
  script?: string;

  /**
   * If not provided, `fontkit` uses the default language of the script.
   */
  language?: string;

  /**
   * If not provided, `fontkit` uses the default direction of the script.
   */
  direction?: "ltr" | "rtl";
};

export interface Shaper {
  zeroMarkWidths?: "NONE" | "BEFORE_GPOS" | "AFTER_GPOS";

  plan(
    plan: ShapingPlan,
    glyphs: GlyphInfo[],
    userFeatures: string[] | Record<string, boolean>
  );

  assignFeatures(plan: ShapingPlan, glyphs: GlyphInfo[]);
}

/**
 * Element of `ShapingPlan#stages` that is either an array of feature tags or a single `ShapingPlanStageFunction`.
 */
export type ShapingPlanStage = string[] | ShapingPlanStageFunction;

export type ShapingPlanStageFunction = (
  font: TTFFont,
  glyphs: GlyphInfo[],
  plan: ShapingPlan
) => void;
