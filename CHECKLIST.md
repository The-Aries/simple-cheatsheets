# Development Checklist

Use this checklist before merging changes or adding a new module.

## Add A Module

- [ ] Add the module once in `scripts/modules.js`.
- [ ] Add `data/pages/<slug>/index.js`.
- [ ] Add `data/pages/<slug>/styles.css` only if the page truly needs local CSS.
- [ ] Make sure page data uses `page.placeholders.fields` when placeholders are needed.
- [ ] Make sure the page footer points to the shared footer object from `data/common.js`.
- [ ] Use the right block pattern for the page type: command pages get `concepts` and `workflow`, syntax pages get `playground`.
- [ ] Use Title Case section titles.
- [ ] Use full command group titles on CLI pages such as Git and Docker.
- [ ] Keep placeholder keys camelCase and labels human-readable.
- [ ] Keep group descriptions to `text` plus `officialUrl`; do not add `officialLabel`.
- [ ] Use Git-specific placeholder names on the Git page, not GitHub-specific ones.
- [ ] Run `node tools/sync-module-entries.mjs`.
- [ ] Run `node tools/check-structure.mjs`.
- [ ] Open `/<slug>/` in a browser and confirm the page renders.

## Change Shared Config Or Shell

- [ ] Check the homepage footer.
- [ ] Check at least one module page footer.
- [ ] Check the fallback page path.
- [ ] Check the sidebar still renders and navigates correctly.
- [ ] Check placeholder forms, copy buttons, and markdown preview still work.
- [ ] Check release logging still works if the workflow-generated release script is present.

## Change Page-Local CSS

- [ ] Keep shared styles in `styles/` when the rule is reusable.
- [ ] Keep page-local styles in `data/pages/<slug>/styles.css`.
- [ ] Scope selectors with `body[data-module="<slug>"]`.
- [ ] Remove empty or placeholder CSS files instead of leaving them behind.
- [ ] Confirm the change does not affect another page.

## Before Merge Or Publish

- [ ] `node tools/sync-module-entries.mjs --check`
- [ ] `node tools/check-structure.mjs`
- [ ] Homepage smoke test
- [ ] One module-page smoke test
- [ ] `docs/architecture.md` still matches the actual structure
- [ ] README still describes the real workflow, not a copied module list

## If A Check Fails

- [ ] Fix the source of truth, not the generated artifact.
- [ ] Regenerate route entries after changing the template or registry.
- [ ] Re-run the validation commands before merging again.
