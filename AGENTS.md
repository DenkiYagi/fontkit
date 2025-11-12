# AI Agent Briefing

## Mission & Scope
- `@denkiyagi/fontkit` is our maintained fork of the upstream `fontkit`, powering typography in `yagisan-reports` (and downstream `@denkiyagi/pdf-lib`).
- Versioning follows `2.0.4-mod.YYYY.N`. Every intentional divergence must land in `MODIFICATIONS.md` so downstream agents understand the API surface we guarantee.
- Recent focus areas captured in `MODIFICATIONS.md`:
    - Better Unicode variation selector (UVS) handling
    - Richer shaping controls
    - Vertical metrics accuracy
    - Predictable type definitions for consumers

## Repository Orientation
- `src/` – Main implementation, mostly ESM `.js` files with `@ts-check`. Key areas: `glyph/`, `layout/`, `opentype/` (shapers, GSUB/GPOS logic), `tables/`, `subset/`, and entrypoints `index.ts` (browser) & `node.ts` (Node/fs helpers).
- `types/` – Generated `.d.ts` output from `npm run build:types`. Never hand-edit.
- `dist/` – Parcel bundles emitted by `npm run build:js` (CJS/ESM/browser targets). Never hand-edit.
- `test/` – Mocha (ESM) regression suite plus `test/data/` font fixtures; keep fixtures stable and small.
- `MODIFICATIONS.md` – Single source of truth for fork-specific behavior; update whenever behavior changes.

## Toolchain & Commands
- Use Node 20+ and npm (repo ships `package-lock.json`). Install with `npm install`.
- Fast feedback loop:
  - `npm run build:js` → Parcel build into `dist/`.
  - `npm run build:types` → `tsc --project tsconfig-types.json` (follows `src/index.ts` & `src/node.ts`, pulls in JS via `allowJs`).
  - `npm run mocha` → run tests without rebuilding.
  - `npm test` → full build + mocha (what CI runs).
  - `npm run coverage` → `c8 mocha`.
- `npm run trie:*` → regenerate shaping tries (`src/opentype/shapers/*.trie` & companion `.json`) when Unicode data/scripts change; outputs are gitignored.
- `npm run clean` removes build outputs—rerun builds before publishing or testing.

## Coding Guidelines & Pitfalls
- Preserve existing `// @ts-check` comments and JSDoc—they drive declaration output.
- Prefer editing sources under `src/`. Touch `types/` or `dist/` only via build scripts.
- When adding TS types or new exports, update `src/types.ts`, re-run `npm run build:types`, and ensure both `index.ts` and `node.ts` export the new surface.
- Keep performance-sensitive code (e.g., cmap processing, shapers) allocation-free; mimic existing patterns (caching decorators, typed arrays).

## Testing & Validation
- Run `npm run mocha` only when `npm run build:*` has already refreshed `dist/` and `types/`; otherwise use `npm test` so the build step runs first (matches CI).
- Use `npm run coverage` only when you need c8 instrumentation (slower but catches missed branches).

## Data & Fixture Workflow
- Unicode trie data (`src/opentype/shapers/*.trie` and `.json`) is generated; edit the source scripts (`generate-data.js`, `gen-use.js`, `gen-indic.js`) or `.machine` files, then re-run the matching `npm run trie:*` task locally (artifacts remain untracked per `.gitignore`).
- The repository intentionally vendors select fonts under `test/data/`; do not rename paths without updating tests.
- Avoid storing unrelated binaries in-tree—use temporary paths outside the repo for manual experiments.
