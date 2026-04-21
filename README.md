# simple-cheatsheets

A compact static cheatsheet site built with plain HTML, CSS, and vanilla JavaScript.

## v1 Template Schema

Template-driven module pages follow one shared data contract:

- `slug`
- `meta`
- `layout`
- `extensions` (optional, page-scoped resources)
- `placeholders`
- `blocks`
- `footer`

Block types supported by renderer:

- `pageHeader`
- `placeholderForm`
- `concepts`
- `workflow`
- `sectionGroups`
- `playground`
- `note`
- `underConstruction`

`note` is a shared content block and participates in the sidebar overview when it has an `id` or title.

Footer is configured through `footer.contactLinks`, `footer.links`, and `footer.copyright`.

## Architecture Layers

- Shared template shell:
  - `scripts/cheatsheet-shell.js`: single structural shell for all cheatsheet pages.
  - `scripts/template-page.js`: page bootstrap + extension loader.
  - `scripts/cheatsheet-renderer.js`: block rendering and interactions.
- Shared data and registry:
  - `scripts/modules.js`: official module registry for homepage and top navigation.
  - `data/common.js`: shared footer + `makeUnderConstructionPage()` factory.
- Shared styles (global reusable layer):
  - `styles/shared/tokens.css`
  - `styles/shared/reset.css`
  - `styles/shared/typography.css`
  - `styles/shared/layout.css`
  - `styles/shared/components.css`
  - `styles.css`: aggregator entry for shared layers.
- Page-scoped resources:
  - `data/pages/<slug>/index.js`: page data + configuration.
  - `data/pages/<slug>/styles.css`: page-local style overrides/extensions.

## Module Pages

All official module entries use the same shell and renderer pipeline:

- `git/index.html` -> `data/pages/git/index.js`
- `linux/index.html` -> `data/pages/linux/index.js`
- `markdown/index.html` -> `data/pages/markdown/index.js`
- `regex/index.html` -> `data/pages/regex/index.js`
- `matlab/index.html` -> `data/pages/matlab/index.js`

## Add a New Module

1. Add one item in `scripts/modules.js`.
2. Add one page folder and data file: `data/pages/<slug>/index.js`.
3. Optional page-specific style: `data/pages/<slug>/styles.css`.
4. Add one route entry page `<slug>/index.html` (same shared shell structure, only `data-module` and `data-page-src` differ).

For a normal page, typically only step 2 is needed (plus module registration).
For a page with custom visual behavior, keep changes in `data/pages/<slug>/styles.css` and `extensions.styles`.
