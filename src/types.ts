import type TTFFont from './TTFFont.js';
import type WOFFFont from './WOFFFont.js';
import type WOFF2Font from './WOFF2Font.js';
import type TrueTypeCollection from './TrueTypeCollection.js';
import type DFont from './DFont.js';
import type GlyphInfo from './opentype/GlyphInfo.js';
import type ShapingPlan from './opentype/ShapingPlan.js';

export type Font = TTFFont | WOFFFont | WOFF2Font;
export type FontCollection = TrueTypeCollection | DFont;

export type { GlyphInfo, ShapingPlan };

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
  direction?: 'ltr' | 'rtl';

  /**
   * If not provided, `fontkit` chooses its own prepared `Shaper` based on the script.
   */
  shaper?: Shaper;

  /**
   * Set to `true` to skip position adjustment for each individual glyph.
   * This results in `GlyphRun#positions` being `null`.
   */
  skipPerGlyphPositioning?: boolean;
};

export interface Shaper {
  zeroMarkWidths?: 'NONE' | 'BEFORE_GPOS' | 'AFTER_GPOS';

  plan(
    plan: ShapingPlan,
    glyphs: GlyphInfo[],
    userFeatures: string[] | Record<string, boolean>
  ): void;

  assignFeatures(plan: ShapingPlan, glyphs: GlyphInfo[]): void;
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
