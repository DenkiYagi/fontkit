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

export type { Glyph, BBox, Path, GlyphPosition, GlyphRun } from './re-exports';

export type {
  TTFFont,
  Font,
  FontCollection,
  GlyphInfo,
  ShapingPlan,
  Subset,
  LayoutAdvancedParams,
  Shaper,
} from './types';
