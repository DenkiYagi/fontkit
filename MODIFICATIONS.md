# Modifications

## [Unreleased]

- Add properties to get the glyph's origin Y coordinate in the vertical writing mode:
    - `TTFFont#defaultVertOriginY`
    - `TTFFont#getVertOriginYMap`
    - `Glyph#vertOriginY`
- Fix data type of `version` property in `vhea` table
- Fix properties `ascent`, `descent` and `lineGap` in `TTFFont` class so that they refer to `OS/2` table when `USE_TYPO_METRICS` flag is ON
