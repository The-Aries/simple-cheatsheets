import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./browser-data.mjs";

export const ENTRY_CACHE_BUST = process.env.CHEATSHEET_ENTRY_CACHE_BUST || "20260421e";
export const MODULE_ENTRY_TEMPLATE_PATH = path.join(REPO_ROOT, "templates/module-entry.html");

export function readModuleEntryTemplate() {
  return fs.readFileSync(MODULE_ENTRY_TEMPLATE_PATH, "utf8");
}

export function renderModuleEntryTemplate(template, data) {
  return template
    .replace(/{{TITLE}}/g, data.title)
    .replace(/{{ROOT_PREFIX}}/g, data.rootPrefix)
    .replace(/{{SLUG}}/g, data.slug)
    .replace(/{{CACHE_BUST}}/g, data.cacheBust);
}

export function generateModuleEntryHtml(module) {
  const template = readModuleEntryTemplate();
  return renderModuleEntryTemplate(template, {
    title: `${module.label} Cheatsheet - Simple Cheatsheets`,
    rootPrefix: "../",
    slug: module.key,
    cacheBust: ENTRY_CACHE_BUST
  });
}

export function moduleEntryPath(slug) {
  return path.join(REPO_ROOT, slug, "index.html");
}
