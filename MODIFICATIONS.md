# Modifications

## [2.0.4-mod.2024.1]

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
