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
- `scripts/template-page.js`: resolves a single page from `window.CHEATSHEET_PAGE_DATA` and provides detailed fallback diagnostics.
- `data/common.js`: shared footer and `makeUnderConstructionPage()` factory.
- `data/pages/<slug>.js`: one page data file per template module.
- `scripts/pages-data.js`: temporary legacy data file kept for migration safety (not used by template module pages).
- `scripts/cheatsheet-renderer.js`: v1 renderer for blocks, sidebar derivation, footer rendering, copy, and placeholder apply/reset.
- `scripts/home-renderer.js`: auto renders homepage module links from `modules.js`.

## Module Pages

- `git/index.html`: standalone implementation (kept as stable baseline).
- `git-test/index.html`: template-path Git test page, direct URL access only (`/git-test/`).
- `linux/index.html`: template shell + `data/pages/linux.js` (`underConstruction`).
- `markdown/index.html`: template shell + `data/pages/markdown.js` (`underConstruction`).
- `regex/index.html`: template shell + `data/pages/regex.js` (`underConstruction`).
- `matlab/index.html`: template shell + `data/pages/matlab.js` (`underConstruction`).

Official top/home navigation remains `git/linux/markdown/regex/matlab`; `git-test` is intentionally excluded.

## Add a New Module (Minimum Changes)

1. Add one item in `scripts/modules.js` (only for official modules).
2. Add one page data file in `data/pages/<slug>.js`.
3. Add one page shell folder like `<slug>/index.html` and point it to `data/common.js` + `data/pages/<slug>.js`.

No CSS duplication is required, and homepage/module navigation updates automatically from the module list.
