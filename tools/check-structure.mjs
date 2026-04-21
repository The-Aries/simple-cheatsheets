import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { REPO_ROOT, loadModulesRegistry, loadPageDataWithValidation } from "./browser-data.mjs";
import { ENTRY_CACHE_BUST, generateModuleEntryHtml, moduleEntryPath } from "./module-entry.mjs";

const allowedTopLevelGlobals = new Set([
  "CHEATSHEET_COMMON",
  "CHEATSHEET_MODULES",
  "CHEATSHEET_RUNTIME_VALIDATION",
  "CHEATSHEET_RELEASE",
  "CHEATSHEET_LOG_RELEASE",
  "CHEATSHEET_PAGE_LOAD_ERROR",
  "CHEATSHEET_PAGE_DATA",
  "CHEATSHEET_PAGE_EXTENSIONS",
  "CHEATSHEET_PAGE_MODE",
  "CHEATSHEET_PAGE_IS_FALLBACK",
  "CHEATSHEET_PAGE",
  "CHEATSHEET_SHELL",
  "CHEATSHEET_RENDERERS"
]);

const ignoredTopLevelDirs = new Set(["data", "scripts", "styles", "tools", "templates"]);

function collectFiles(startDir, extensions, results = []) {
  fs.readdirSync(startDir, { withFileTypes: true }).forEach((entry) => {
    const absolute = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git") {
        return;
      }
      collectFiles(absolute, extensions, results);
      return;
    }
    if (extensions.some((extension) => entry.name.endsWith(extension))) {
      results.push(absolute);
    }
  });
  return results;
}

function rel(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function readText(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function stripCss(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

function addIssue(issues, message) {
  issues.push(message);
}

function checkHomePage(issues) {
  const html = readText("index.html");
  if (!html.includes('<footer id="home-footer"')) {
    addIssue(issues, "index.html is missing the shared home footer container");
  }
  if (!html.includes("data/common.js?v=")) {
    addIssue(issues, "index.html does not load data/common.js");
  }
  if (!html.includes("scripts/cheatsheet-renderers.js?v=")) {
    addIssue(issues, "index.html does not load scripts/cheatsheet-renderers.js");
  }
  if (html.includes("GitHub Profile</a>") || html.includes("Copyright © 2026 Junhao Zhang") || html.includes("mailto:653537305@qq.com")) {
    addIssue(issues, "index.html still contains hardcoded footer content");
  }
}

function checkTopLevelGlobals(issues) {
  const files = collectFiles(REPO_ROOT, [".js", ".mjs"]);
  const regex = /window\.(CHEATSHEET_[A-Z0-9_]+)/g;

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    let match;
    while ((match = regex.exec(content))) {
      const name = match[1];
      if (!allowedTopLevelGlobals.has(name)) {
        addIssue(issues, `${rel(filePath)} exports unexpected top-level global ${name}`);
      }
    }
  });
}

function checkRouteEntriesAndPages(issues) {
  const { modules } = loadModulesRegistry();
  const seenKeys = new Set();
  const seenDirs = new Set();
  const referencedStyles = new Set();

  modules.forEach((module, index) => {
    if (!module || typeof module !== "object") {
      addIssue(issues, `modules[${index}] is not an object`);
      return;
    }
    if (typeof module.key !== "string" || !module.key.trim()) {
      addIssue(issues, `modules[${index}] is missing key`);
      return;
    }
    if (typeof module.dir !== "string" || !module.dir.trim()) {
      addIssue(issues, `modules[${index}] is missing dir`);
      return;
    }
    if (module.key !== module.dir) {
      addIssue(issues, `module key and dir must match for ${module.key}/${module.dir}`);
    }
    if (seenKeys.has(module.key)) {
      addIssue(issues, `duplicate module key: ${module.key}`);
    }
    if (seenDirs.has(module.dir)) {
      addIssue(issues, `duplicate module dir: ${module.dir}`);
    }
    seenKeys.add(module.key);
    seenDirs.add(module.dir);

    const routeEntry = moduleEntryPath(module.key);
    const expectedHtml = generateModuleEntryHtml(module);
    if (!fs.existsSync(routeEntry)) {
      addIssue(issues, `missing route entry: ${rel(routeEntry)}`);
    } else {
      const actualHtml = fs.readFileSync(routeEntry, "utf8");
      if (actualHtml !== expectedHtml) {
        addIssue(issues, `route entry drift: ${rel(routeEntry)}`);
      }
    }

    const pageDataPath = path.join(REPO_ROOT, "data/pages", module.key, "index.js");
    if (!fs.existsSync(pageDataPath)) {
      addIssue(issues, `missing page data file: ${rel(pageDataPath)}`);
      return;
    }

    const { common, page, validation } = loadPageDataWithValidation(module.key);
    if (!page || typeof page !== "object") {
      addIssue(issues, `page data did not export a page object for ${module.key}`);
      return;
    }

    if (page.slug !== module.key) {
      addIssue(issues, `page.slug mismatch for ${module.key}: got ${page.slug}`);
    }

    if (page.meta && page.meta.title !== `${module.label} Cheatsheet - Simple Cheatsheets`) {
      addIssue(issues, `page.meta.title mismatch for ${module.key}`);
    }

    if (page.meta && page.meta.lang !== common.meta.lang) {
      addIssue(issues, `page.meta.lang mismatch for ${module.key}`);
    }

    if (page.footer !== common.footer) {
      addIssue(issues, `page.footer must reference the shared footer object for ${module.key}`);
    }

    if (!page.placeholders || !Array.isArray(page.placeholders.fields)) {
      addIssue(issues, `page.placeholders.fields is missing for ${module.key}`);
    }

    if (Array.isArray(page.blocks)) {
      page.blocks.forEach((block, blockIndex) => {
        if (block && block.type === "placeholderForm" && Object.prototype.hasOwnProperty.call(block, "fields")) {
          addIssue(issues, `placeholderForm.fields is deprecated in ${module.key} block ${blockIndex + 1}`);
        }
      });
    }

    if (validation && typeof validation.validatePageData === "function" && validation.validatePageData(page, { slug: module.key, skipSuccess: true }) === false) {
      addIssue(issues, `runtime validation failed for ${module.key}`);
    }

    const styles = page.extensions && Array.isArray(page.extensions.styles) ? page.extensions.styles : [];
    const scripts = page.extensions && Array.isArray(page.extensions.scripts) ? page.extensions.scripts : [];

    styles.forEach((stylePath) => {
      const absolute = path.join(REPO_ROOT, stylePath);
      referencedStyles.add(path.resolve(absolute));
      if (!stylePath.startsWith(`data/pages/${module.key}/`)) {
        addIssue(issues, `page-local style for ${module.key} must live under data/pages/${module.key}/`);
      }
      if (!fs.existsSync(absolute)) {
        addIssue(issues, `missing referenced style asset: ${stylePath}`);
        return;
      }
      const stripped = stripCss(fs.readFileSync(absolute, "utf8"));
      if (!stripped) {
        addIssue(issues, `empty page-local stylesheet: ${stylePath}`);
      }
      if (!fs.readFileSync(absolute, "utf8").includes(`body[data-module="${module.key}"]`)) {
        addIssue(issues, `page-local stylesheet must use explicit body[data-module="${module.key}"] scoping: ${stylePath}`);
      }
    });

    scripts.forEach((scriptPath) => {
      const absolute = path.join(REPO_ROOT, scriptPath);
      if (!fs.existsSync(absolute)) {
        addIssue(issues, `missing referenced script asset: ${scriptPath}`);
      }
    });

    const entryHtml = fs.readFileSync(routeEntry, "utf8");
    if (!entryHtml.includes(`data-module="${module.key}"`)) {
      addIssue(issues, `route entry module attribute mismatch: ${rel(routeEntry)}`);
    }
    if (!entryHtml.includes(`data/pages/${module.key}/index.js?v=${ENTRY_CACHE_BUST}`)) {
      addIssue(issues, `route entry data-page-src mismatch: ${rel(routeEntry)}`);
    }
  });

  const routeDirs = fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && !ignoredTopLevelDirs.has(entry.name) && fs.existsSync(path.join(REPO_ROOT, entry.name, "index.html")))
    .map((entry) => entry.name);

  routeDirs.forEach((dir) => {
    if (!seenDirs.has(dir)) {
      addIssue(issues, `unexpected route entry directory: ${dir}`);
    }
  });

  const styleFiles = collectFiles(path.join(REPO_ROOT, "data/pages"), [".css"]);
  styleFiles.forEach((styleFile) => {
    const absolute = path.resolve(styleFile);
    if (!fs.existsSync(styleFile)) {
      return;
    }
    const content = fs.readFileSync(styleFile, "utf8");
    if (!stripCss(content)) {
      addIssue(issues, `stale empty page-local stylesheet: ${rel(styleFile)}`);
    }
    if (!referencedStyles.has(absolute)) {
      addIssue(issues, `stale unreferenced page-local stylesheet: ${rel(styleFile)}`);
    }
  });
}

function main() {
  const issues = [];
  checkHomePage(issues);
  checkRouteEntriesAndPages(issues);
  checkTopLevelGlobals(issues);

  if (issues.length) {
    throw new Error(issues.map((issue) => `- ${issue}`).join("\n"));
  }

  console.log("Structure checks passed.");
}

main();
