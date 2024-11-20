import type TTFFont from "./TTFFont.js";
import type WOFFFont from "./WOFFFont.js";
import type WOFF2Font from "./WOFF2Font.js";
import type TrueTypeCollection from "./TrueTypeCollection.js";
import type DFont from "./DFont.js";

export type Font = TTFFont | WOFFFont | WOFF2Font;
export type FontCollection = TrueTypeCollection | DFont;

export type OTFeatures = string[] | Record<string, boolean>;

export type HorizontalTextDirection = "ltr" | "rtl";
