import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { REPO_ROOT, loadModulesRegistry } from "./browser-data.mjs";
import { generateModuleEntryHtml, moduleEntryPath } from "./module-entry.mjs";

function parseArgs(argv) {
  return {
    check: argv.includes("--check") || argv.includes("-c")
  };
}

function readCurrentEntry(slug) {
  return fs.readFileSync(moduleEntryPath(slug), "utf8");
}

function displayPath(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function writeEntry(slug, content) {
  const filePath = moduleEntryPath(slug);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { modules } = loadModulesRegistry();
  const expectedSlugs = new Set();
  const problems = [];
  let changedCount = 0;

  modules.forEach((module, index) => {
    if (!module || !module.key || !module.dir) {
      problems.push(`modules[${index}] is missing key or dir`);
      return;
    }
    if (expectedSlugs.has(module.key)) {
      problems.push(`duplicate module key: ${module.key}`);
      return;
    }
    expectedSlugs.add(module.key);

    const expectedHtml = generateModuleEntryHtml(module);
    const filePath = moduleEntryPath(module.key);
    if (!fs.existsSync(filePath)) {
      if (args.check) {
        problems.push(`missing route entry: ${displayPath(filePath)}`);
      } else {
        writeEntry(module.key, expectedHtml);
        changedCount += 1;
      }
      return;
    }

    const currentHtml = readCurrentEntry(module.key);
    if (currentHtml !== expectedHtml) {
      if (args.check) {
        problems.push(`route entry drift: ${displayPath(filePath)}`);
      } else {
        writeEntry(module.key, expectedHtml);
        changedCount += 1;
      }
    }
  });

  const routeDirs = fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) {
        return false;
      }
      if (entry.name.startsWith(".")) {
        return false;
      }
      if (["data", "scripts", "styles", "tools", "templates"].includes(entry.name)) {
        return false;
      }
      return fs.existsSync(path.join(REPO_ROOT, entry.name, "index.html"));
    })
    .map((entry) => entry.name);

  routeDirs.forEach((dir) => {
    if (!expectedSlugs.has(dir)) {
      problems.push(`unexpected route entry directory: ${dir}`);
    }
  });

  if (problems.length) {
    throw new Error(problems.join("\n"));
  }

  if (!args.check) {
    console.log(`Synchronized ${changedCount} route entr${changedCount === 1 ? "y" : "ies"}.`);
  } else {
    console.log("Route entries match the template.");
  }
}

main();
