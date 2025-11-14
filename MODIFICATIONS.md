# Modifications

## [Unreleased]

- Remove WOFF format support
    - Also removing the `tiny-inflate` dependency (the indirect dependency may remain)
- Remove WOFF2 format support
    - Also removing the `brotli` dependency
- Remove DFont format support
- Simplify the published TypeScript types by inlining the concrete format exports (`TTFFont`/`TrueTypeCollection`) in place of the old aliases (`Font`/`FontCollection`).
- Remove the dependencies below by replacing them with new internal helpers (no API changes):
    - `clone` (used by `TTFSubset`)
    - `fast-deep-equal` (used by `CFFDict`)

## [2.0.4-mod.2025.2]

- Improve performance of `CmapProcessor#lookupNonDefaultUVS` by caching variation selector records from `cmap` format 14 subtable

## [2.0.4-mod.2025.1]

- Fix glyph mapping using the cmap format 14 subtable, improving support for UVS in methods like `TTFFont#glyphsForString`
- Add `TTFFont#nonDefaultUVSSet`


## [2.0.4-mod.2024.2]

- Add properties to get the glyph's origin Y coordinate in the vertical writing mode:
    - `TTFFont#defaultVertOriginY`
    - `TTFFont#getVertOriginYMap`
    - `Glyph#vertOriginY`
- Fix data type of `version` property in `vhea` table
- Fix properties `ascent`, `descent` and `lineGap` in `TTFFont` class so that they refer to `OS/2` table when `USE_TYPO_METRICS` flag is ON
- Improve class `DefaultShaper` and its sub-classes
    - Omit fractional features: frac, dnom, numr
    - Move directional features to `ArabicShaper`: ltra, ltrm, rtla, rtlm
    - Expose class `DefaultShaper` from `fontkit`
- Improve `TTFFont#layout`
    - Use named parameters
    - Add parameter `shaper` to override shaping process
    - Add parameter `skipPerGlyphPositioning` to skip calculating `GlyphRun#positions`
- Fix fields `logErrors` and `defaultLanguage` in the top-level API
    - Change to getter functions: `isLoggingErrors()`, `getDefaultLanguage()`
- Expose type definitions


## [2.0.4-mod.2024.1]

- Removed
