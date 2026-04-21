# Architecture Notes

This repository stays on plain HTML, CSS, and vanilla JavaScript. The goal is to keep the static GitHub Pages deployment simple while removing duplicate sources of truth.

## Source Of Truth Map

- `data/common.js`
  - Canonical site config.
  - Owns the shared footer content, author/contact links, title suffix, and fallback / under-construction page factories.
- `scripts/modules.js`
  - Canonical module registry.
  - Homepage navigation and route-entry generation both read from here.
- `data/pages/<slug>/index.js`
  - Canonical page data for one module.
  - `page.placeholders.fields` is the preferred placeholder source.
  - `placeholderForm.fields` is deprecated and should not be added to new pages.
- `templates/module-entry.html`
  - Single HTML template for committed module route entries.
  - Route entries remain checked in so GitHub Pages can serve the clean `/<slug>/` URLs.
- `tools/sync-module-entries.mjs`
  - Generates or checks the committed route-entry HTML files from the registry plus template.
- `tools/check-structure.mjs`
  - Validates the contract between registry, page data, route entries, shared config, and assets.
  - Fails if a page still exposes deprecated `placeholderForm.fields`.

## Runtime Namespace

- `window.CHEATSHEET` is the primary namespace.
- Shared sub-objects live under that namespace:
  - `window.CHEATSHEET.site`
  - `window.CHEATSHEET.common`
  - `window.CHEATSHEET.registry`
  - `window.CHEATSHEET.renderers`
  - `window.CHEATSHEET.shell`
  - `window.CHEATSHEET.validation`
  - `window.CHEATSHEET.release`
- Compatibility aliases such as `window.CHEATSHEET_COMMON`, `window.CHEATSHEET_MODULES`, and `window.CHEATSHEET_PAGE_DATA` still exist for older code and generated artifacts.
- New code should read from `window.CHEATSHEET` first and only add new top-level aliases if they are unavoidable and whitelisted.

## Rendering Layers

- `scripts/cheatsheet-renderers.js`
  - Pure rendering helpers.
  - Handles block HTML, markdown preview, footer HTML, fallback markup, and sidebar model building.
- `scripts/cheatsheet-renderer.js`
  - Page orchestration.
  - Wires page data, shared renderers, sidebar shell, placeholders, copy actions, and preview updates together.
- `scripts/template-page.js`
  - Bootstrap layer.
  - Reads page data, applies page-local extensions, and builds the fallback page when data is missing.
- `scripts/home-renderer.js`
  - Homepage orchestration.
  - Uses the same shared footer and registry data as module pages.

The orchestration files should stay thin. Pure HTML generation belongs in the shared renderer layer, not in the bootstrap code.

## Footer And Fallback Rules

- Footer content is defined once in `data/common.js`.
- Module pages, homepage footer, and fallback pages all render from that same shared config.
- Fallback pages should come from `data/common.js` factories instead of being assembled separately in multiple files.
- If shared contact information changes, the goal is to edit one file rather than synchronizing several copies.

## Page-Local CSS Rules

- Shared, reusable CSS lives under `styles/`.
- Page-local CSS lives under `data/pages/<slug>/styles.css`.
- Page-local styles are loaded via `extensions.styles`.
- Page-local selectors must stay scoped, typically as `body[data-module="<slug>"] ...`.
- Page-local CSS should only exist when a page really needs a unique visual treatment.
- Empty placeholder stylesheets should be removed instead of left behind as stubs.

## Module Addition Flow

1. Add or update the module record in `scripts/modules.js`.
2. Add `data/pages/<slug>/index.js` with the page data and shared footer reference.
3. Add `data/pages/<slug>/styles.css` only if the page needs scoped local CSS.
4. Run `node tools/sync-module-entries.mjs` to regenerate the committed route-entry HTML.
5. Run `node tools/check-structure.mjs` to validate the contract.
6. Smoke-test the homepage and the new `/<slug>/` route.

The route entry file should not be edited by hand. If the template changes, regenerate the committed entries.

## Validation Expectations

- `node tools/sync-module-entries.mjs --check` should pass before merge.
- `node tools/check-structure.mjs` should pass before merge.
- The GitHub Actions deploy workflow should run both checks before Pages upload.
- A failing structure check should point to the specific file or contract that drifted.
