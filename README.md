# simple-cheatsheets

A compact static cheatsheet site built with plain HTML, CSS, and vanilla JavaScript.

## Current Architecture

- `styles.css`: shared visual system for homepage and cheatsheet pages.
- `scripts/modules.js`: central module registry used by homepage and page top navigation.
- `scripts/pages-data.js`: cheatsheet content data for template driven modules.
- `scripts/cheatsheet-renderer.js`: reusable renderer for sidebar, hero, workflow, section tables, copy, and placeholder logic.
- `scripts/template-page.js`: resolves `data-module` to the matching page data object.
- `scripts/home-renderer.js`: auto renders homepage module links from `modules.js`.

## Module Pages

- `git/index.html`: mature custom page kept as current implementation baseline.
- `linux/index.html`
- `markdown/index.html`
- `regex/index.html`
- `matlab/index.html`
- `react/index.html`
- `kotlin/index.html`

All template driven module pages share one shell and reuse the same renderer + data structure.

## Add a New Module (Minimum Changes)

1. Add one item in `scripts/modules.js`.
2. Add one page object in `scripts/pages-data.js`.
3. Add one page shell folder like `newtopic/index.html` with `data-module="newtopic"`.

No CSS duplication is required, and homepage/module navigation updates automatically from the module list.
