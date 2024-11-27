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

export type {
  TTFFont,
  Glyph,
  BBox,
  Path,
  GlyphPosition,
  GlyphRun,
  Subset
} from './re-exports';

export type {
  Font,
  FontCollection,
  GlyphInfo,
  ShapingPlan,
  LayoutAdvancedParams,
  Shaper,
} from './types';
