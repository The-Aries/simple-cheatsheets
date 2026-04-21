import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(TOOLS_DIR, "..");

export function createBrowserSandbox() {
  const sandbox = {
    console,
    window: null,
    self: null,
    globalThis: null
  };

  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

export function runBrowserScript(filePath, sandbox = createBrowserSandbox()) {
  const code = fs.readFileSync(filePath, "utf8");
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox;
}

export function loadBrowserScript(relativePath, sandbox = createBrowserSandbox()) {
  const filePath = path.join(REPO_ROOT, relativePath);
  return runBrowserScript(filePath, sandbox);
}

export function loadCommonData() {
  const sandbox = createBrowserSandbox();
  loadBrowserScript("data/common.js", sandbox);
  const cheatsheet = sandbox.window.CHEATSHEET || {};
  return {
    sandbox,
    common: cheatsheet.common,
    cheatsheet
  };
}

export function loadModulesRegistry() {
  const sandbox = createBrowserSandbox();
  loadBrowserScript("scripts/modules.js", sandbox);
  const cheatsheet = sandbox.window.CHEATSHEET || {};
  return {
    sandbox,
    modules: (cheatsheet.registry && cheatsheet.registry.modules) || cheatsheet.modules,
    cheatsheet
  };
}

export function loadValidation() {
  const sandbox = createBrowserSandbox();
  loadBrowserScript("scripts/runtime-validation.js", sandbox);
  const cheatsheet = sandbox.window.CHEATSHEET || {};
  return {
    sandbox,
    validation: cheatsheet.validation,
    cheatsheet
  };
}

export function loadPageData(slug) {
  const sandbox = createBrowserSandbox();
  loadBrowserScript("data/common.js", sandbox);
  loadBrowserScript(path.join("data/pages", slug, "index.js"), sandbox);
  const cheatsheet = sandbox.window.CHEATSHEET || {};
  return {
    sandbox,
    common: cheatsheet.common,
    page: cheatsheet.pageData,
    cheatsheet
  };
}

export function loadPageDataWithValidation(slug) {
  const sandbox = createBrowserSandbox();
  loadBrowserScript("data/common.js", sandbox);
  loadBrowserScript("scripts/runtime-validation.js", sandbox);
  loadBrowserScript(path.join("data/pages", slug, "index.js"), sandbox);
  const cheatsheet = sandbox.window.CHEATSHEET || {};
  return {
    sandbox,
    common: cheatsheet.common,
    page: cheatsheet.pageData,
    validation: cheatsheet.validation,
    cheatsheet
  };
}

export function readFile(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

export function writeFile(relativePath, content) {
  fs.writeFileSync(path.join(REPO_ROOT, relativePath), content);
}

export function exists(relativePath) {
  return fs.existsSync(path.join(REPO_ROOT, relativePath));
}
