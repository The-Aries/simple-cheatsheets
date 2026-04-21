# simple-cheatsheets

A compact static cheatsheet site built with plain HTML, CSS, and vanilla JavaScript. Clean `/<slug>/` module URLs are preserved for GitHub Pages.

## How It Is Organized

- `data/common.js`: canonical site config for author info, footer links, title suffix, and fallback page factories.
- `scripts/modules.js`: canonical module registry and the source for homepage / route navigation.
- `data/pages/<slug>/index.js`: page-specific data, blocks, and placeholder values.
- `data/pages/<slug>/styles.css`: optional page-local CSS, loaded through `extensions.styles`.
- `templates/module-entry.html`: single HTML template for checked-in module route entries.
- `tools/sync-module-entries.mjs`: regenerates the committed `/<slug>/index.html` route entries from the template and registry.
- `tools/check-structure.mjs`: validates the registry, page data, assets, globals, and route-entry consistency.
- `scripts/cheatsheet-renderers.js`: shared pure render helpers for blocks, markdown preview, footer, fallback markup, and sidebar models.
- `scripts/cheatsheet-renderer.js`: page orchestrator that wires the shared renderers into the module shell.
- `scripts/template-page.js`: page bootstrap and page-local extension loader.
- `CHECKLIST.md`: day-to-day development checklist.
- `docs/architecture.md`: architecture and source-of-truth reference.

## Working On A Module

1. Add the module once in `scripts/modules.js`.
2. Add `data/pages/<slug>/index.js`.
3. Add `data/pages/<slug>/styles.css` only if the page truly needs local CSS.
4. Run `node tools/sync-module-entries.mjs`.
5. Run `node tools/check-structure.mjs`.
6. Smoke-test the homepage and `/<slug>/` in a browser.

The checked-in `/<slug>/index.html` files are generated artifacts for GitHub Pages. They should be refreshed from the template instead of edited by hand.

## Validation Commands

- `node tools/sync-module-entries.mjs --check`
- `node tools/check-structure.mjs`

The GitHub Actions deploy workflow runs the same checks before Pages upload.

## CSS Rules

- Shared, reusable CSS stays in `styles/`.
- Page-local CSS stays in `data/pages/<slug>/styles.css`.
- Page-local styles must be loaded through `extensions.styles`.
- Page-local selectors must be scoped with `body[data-module="<slug>"]`.
- Empty placeholder stylesheets should be removed instead of kept as drift-prone stubs.

## Namespace Policy

- Use `window.CHEATSHEET` for new cross-file state.
- Stable sub-objects live under `window.CHEATSHEET`, such as `site`, `common`, `registry`, `renderers`, `shell`, `validation`, and `release`.
- Compatibility aliases like `window.CHEATSHEET_*` remain only for legacy generated artifacts and migration safety.
- Do not add new top-level globals unless the namespace map and validation whitelist are updated with a clear reason.

## More Detail

- [Architecture notes](docs/architecture.md)
- [Development checklist](CHECKLIST.md)
