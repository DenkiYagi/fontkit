import { registerFormat } from './base.js';
import TTFFont from './TTFFont.js';
import TrueTypeCollection from './TrueTypeCollection.js';

// Register font formats
registerFormat(TTFFont);
registerFormat(TrueTypeCollection);

export * from './base.js';
export { DefaultShaper } from './base.js'; // Explicit export for preventing tree-shaking

export * from './errors.js';

export type { default as TTFFont } from './TTFFont.js';
export type { default as TrueTypeCollection } from './TrueTypeCollection.js';
export type { default as Glyph } from './glyph/Glyph.js';
export type { default as BBox } from './glyph/BBox.js';
export type { default as Path } from './glyph/Path.js';
export type { default as GlyphPosition } from './layout/GlyphPosition.js';
export type { default as GlyphRun } from './layout/GlyphRun.js';
export type { default as Subset } from './subset/Subset.js';

export type {
  GlyphInfo,
  ShapingPlan,
  LayoutAdvancedParams,
  Shaper,
} from './types.js';

export * from './fs.js';
