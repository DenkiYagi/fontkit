import { registerFormat } from './base';
import TTFFont from './TTFFont';
import TrueTypeCollection from './TrueTypeCollection';

// Register font formats
registerFormat(TTFFont);
registerFormat(TrueTypeCollection);

export * from './base';
export { DefaultShaper } from './base'; // Explicit export for preventing tree-shaking

export type { default as TTFFont } from './TTFFont';
export type { default as TrueTypeCollection } from './TrueTypeCollection';
export type { default as Glyph } from './glyph/Glyph';
export type { default as BBox } from './glyph/BBox';
export type { default as Path } from './glyph/Path';
export type { default as GlyphPosition } from './layout/GlyphPosition';
export type { default as GlyphRun } from './layout/GlyphRun';
export type { default as Subset } from './subset/Subset';

export type {
  GlyphInfo,
  ShapingPlan,
  LayoutAdvancedParams,
  Shaper,
} from './types';
