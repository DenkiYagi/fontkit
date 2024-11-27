import { registerFormat } from './base';
import TTFFont from './TTFFont';
import WOFFFont from './WOFFFont';
import WOFF2Font from './WOFF2Font';
import TrueTypeCollection from './TrueTypeCollection';
import DFont from './DFont';

// Register font formats
registerFormat(TTFFont);
registerFormat(WOFFFont);
registerFormat(WOFF2Font);
registerFormat(TrueTypeCollection);
registerFormat(DFont);

export * from './base';
export { DefaultShaper } from './base'; // Explicit export for preventing tree-shaking

export type { default as TTFFont } from './TTFFont';
export type { default as Glyph } from './glyph/Glyph';
export type { default as BBox } from './glyph/BBox';
export type { default as Path } from './glyph/Path';
export type { default as GlyphPosition } from './layout/GlyphPosition';
export type { default as GlyphRun } from './layout/GlyphRun';
export type { default as Subset } from './subset/Subset';

export type {
  Font,
  FontCollection,
  GlyphInfo,
  ShapingPlan,
  LayoutAdvancedParams,
  Shaper,
} from './types';
