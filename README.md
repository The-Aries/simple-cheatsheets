# simple-cheatsheets

A compact static cheatsheet site built with plain HTML, CSS, and vanilla JavaScript.

## v1 Template Schema

Template-driven module pages now follow one data model:

- `slug`
- `meta`
- `layout`
- `placeholders`
- `blocks`
- `footer`

Block types supported in renderer:

- `pageHeader`
- `placeholderForm`
- `concepts`
- `workflow`
- `sectionGroups`
- `preview`
- `note`
- `underConstruction`

Footer is configured separately from blocks through `footer.contactLinks`, `footer.links`, and `footer.copyright`.

## Current Architecture

- `styles.css`: shared visual system for homepage and cheatsheet pages.
- `scripts/modules.js`: central module registry used by homepage and page top navigation.
- `scripts/pages-data.js`: v1 schema page data for template-driven modules.
- `scripts/template-page.js`: resolves `data-module` to the matching v1 page object.
- `scripts/cheatsheet-renderer.js`: v1 renderer for blocks, sidebar derivation, footer rendering, copy, and placeholder apply/reset.
- `scripts/home-renderer.js`: auto renders homepage module links from `modules.js`.

## Module Pages

- `git/index.html`: mature custom page kept as current implementation baseline (not yet migrated to v1 template path).
- `linux/index.html`
- `markdown/index.html`
- `regex/index.html`
- `matlab/index.html`

Currently, only `git/index.html` contains full production content. Other modules intentionally render as under-construction pages through the v1 template schema.

## Add a New Module (Minimum Changes)

1. Add one item in `scripts/modules.js`.
2. Add one page object in `scripts/pages-data.js` using the v1 schema.
3. Add one page shell folder like `newtopic/index.html` with `data-module="newtopic"`.

No CSS duplication is required, and homepage/module navigation updates automatically from the module list.
