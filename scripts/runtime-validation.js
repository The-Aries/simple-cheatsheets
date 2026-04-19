(function () {
  if (window.CHEATSHEET_RUNTIME_VALIDATION) {
    return;
  }

  var warned = Object.create(null);
  var confirmed = Object.create(null);
  var scopeIssues = Object.create(null);
  var currentScope = "global";
  var prefix = "[sc]";
  var formalSlugs = { git: true };
  var underConstructionSlugs = {
    linux: true,
    markdown: true,
    regex: true,
    matlab: true
  };
  var supportedBlockTypes = {
    pageHeader: true,
    placeholderForm: true,
    concepts: true,
    workflow: true,
    sectionGroups: true,
    preview: true,
    note: true,
    underConstruction: true
  };

  function scopeKey(slug, mode) {
    return [pageLabel(slug), mode || "unknown"].join("|");
  }

  function withScope(key, fn) {
    var previous = currentScope;
    currentScope = key || "global";
    try {
      return fn();
    } finally {
      currentScope = previous;
    }
  }

  function markIssue() {
    scopeIssues[currentScope] = true;
  }

  function warnOnce(key, message) {
    if (!key) {
      return;
    }
    var dedupeKey = currentScope + "::" + key;
    if (warned[dedupeKey]) {
      return;
    }
    warned[dedupeKey] = true;
    markIssue();
    if (window.console && typeof window.console.warn === "function") {
      window.console.warn(message);
    }
  }

  function isObject(value) {
    return !!value && typeof value === "object" && Array.isArray(value) === false;
  }

  function isString(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  function pageLabel(slug) {
    return slug || "unknown";
  }

  function formatPath(pathParts) {
    var parts = [];
    (pathParts || []).forEach(function (part) {
      if (!part) {
        return;
      }
      if (part.indexOf("block=") === 0) {
        parts.push(part.slice(6));
        return;
      }
      if (part.indexOf("index=") === 0) {
        parts[parts.length - 1] = (parts[parts.length - 1] || "item") + "[" + part.slice(6) + "]";
        return;
      }
      if (part.indexOf("section=") === 0) {
        parts.push("sections[" + part.slice(8) + "]");
        return;
      }
      if (part.indexOf("group=") === 0) {
        parts.push("groups[" + part.slice(6) + "]");
        return;
      }
      if (part.indexOf("row=") === 0) {
        parts.push("rows[" + part.slice(4) + "]");
        return;
      }
      if (part.indexOf("placeholder=") === 0) {
        parts.push("placeholders[" + part.slice(12) + "]");
        return;
      }
      if (part.indexOf("field=") === 0) {
        parts.push(part.slice(6));
        return;
      }
      parts.push(part);
    });
    return parts.join(".");
  }

  function warn(slug, pathParts, field, issue, message) {
    var key = [pageLabel(slug)].concat(pathParts || [], field || "", issue || "").join("|");
    var location = formatPath(pathParts);
    var parts = [prefix, pageLabel(slug) + "/" + (currentScope.split("|")[1] || "unknown")];
    if (location) {
      parts.push(location);
    }
    if (field) {
      parts.push(field);
    }
    if (issue) {
      parts.push(issue);
    }
    warnOnce(key, parts.join(" "));
  }

  function confirmOnce(key, message) {
    if (!key || confirmed[key]) {
      return;
    }
    confirmed[key] = true;
    if (window.console && typeof window.console.info === "function") {
      window.console.info(message);
    }
  }

  function confirm(slug, mode, phase) {
    confirmOnce(
      [pageLabel(slug), mode || "unknown", phase || "validation"].join("|"),
      prefix + " " + pageLabel(slug) + "/" + (mode || "unknown") + " ok"
    );
  }

  function inferPageMode(slug, page) {
    if (slug === "home") {
      return "home";
    }
    if (formalSlugs[slug]) {
      return "formal";
    }
    if (underConstructionSlugs[slug]) {
      return "underConstruction";
    }
    if (page && Array.isArray(page.blocks)) {
      for (var i = 0; i < page.blocks.length; i += 1) {
        var block = page.blocks[i];
        if (!block) {
          continue;
        }
        if (
          block.type === "sectionGroups" ||
          block.type === "placeholderForm" ||
          block.type === "workflow" ||
          block.type === "concepts" ||
          block.type === "preview" ||
          block.type === "note"
        ) {
          return "formal";
        }
      }
    }
    return "underConstruction";
  }

  function validatePageBootstrap(page, options) {
    options = options || {};
    var slug = options.slug || (page && page.slug) || "unknown";
    var mode = inferPageMode(slug, page);
    var scope = scopeKey(slug, mode);
    var fallback = false;

    withScope(scope, function () {
      if (!isObject(page)) {
        warn(slug, ["page"], "type", "invalid", "bootstrap data is not an object");
        fallback = true;
        return;
      }

      if (!isString(page.slug)) {
        warn(slug, ["page"], "slug", "missing", "missing page.slug");
        fallback = true;
      } else if (options.slug && page.slug !== options.slug) {
        warn(slug, ["page"], "slug", "mismatch", "page.slug " + page.slug + " does not match expected slug " + options.slug);
        fallback = true;
      }

      if (!isObject(page.meta)) {
        warn(slug, ["page"], "meta", "missing", "missing page.meta");
        fallback = true;
      } else {
        if (!isString(page.meta.title)) {
          warn(slug, ["page", "meta"], "title", "missing", "missing meta.title");
          fallback = true;
        }
        if (!isString(page.meta.lang)) {
          warn(slug, ["page", "meta"], "lang", "missing", "missing meta.lang");
          fallback = true;
        }
      }

      if (!Array.isArray(page.blocks)) {
        warn(slug, ["page"], "blocks", "missing", "missing page.blocks");
        fallback = true;
      } else if (page.blocks.length === 0) {
        warn(slug, ["page"], "blocks", "empty", "page.blocks is empty");
        fallback = true;
      }

      if (!isObject(page.footer)) {
        warn(slug, ["page"], "footer", "missing", "missing page.footer");
        fallback = true;
      } else {
        if (!Array.isArray(page.footer.links)) {
          warn(slug, ["page", "footer"], "links", "missing", "missing footer.links");
          fallback = true;
        }
        if (!Array.isArray(page.footer.contactLinks)) {
          warn(slug, ["page", "footer"], "contactLinks", "missing", "missing footer.contactLinks");
          fallback = true;
        }
        if (!isString(page.footer.copyright)) {
          warn(slug, ["page", "footer"], "copyright", "missing", "missing footer.copyright");
          fallback = true;
        }
      }
    });

    return {
      fallback: fallback,
      mode: mode,
      scope: scope
    };
  }

  function validatePlaceholderFields(slug, blockIndex, fields) {
    if (!Array.isArray(fields) || fields.length === 0) {
      warn(slug, ["block=placeholderForm", "index=" + (blockIndex + 1)], "fields", "missing", "missing placeholder fields");
      return;
    }

    var seenKeys = Object.create(null);
    fields.forEach(function (field, fieldIndex) {
      var path = ["block=placeholderForm", "index=" + (blockIndex + 1), "placeholder=" + (fieldIndex + 1)];
      if (!isObject(field)) {
        warn(slug, path, "type", "invalid", "placeholder field is not an object");
        return;
      }
      if (!isString(field.key)) {
        warn(slug, path, "key", "missing", "missing placeholder.key");
      } else if (seenKeys[field.key]) {
        warn(slug, path, "key", "duplicate", "duplicate placeholder.key " + field.key);
      } else {
        seenKeys[field.key] = true;
      }
      if (!isString(field.label)) {
        warn(slug, path, "label", "missing", "missing placeholder.label");
      }
      if (!isString(field.defaultValue)) {
        warn(slug, path, "defaultValue", "missing", "missing placeholder.defaultValue");
      }
    });
  }

  function validateDescription(slug, path, description) {
    if (!isObject(description)) {
      warn(slug, path, "description", "missing", "missing group.description");
      return;
    }
    if (!isString(description.text)) {
      warn(slug, path.concat(["description"]), "text", "missing", "missing description.text");
    }
    if (!isString(description.officialUrl)) {
      warn(slug, path.concat(["description"]), "officialUrl", "missing", "missing description.officialUrl");
    }
  }

  function validateSectionGroups(slug, blockIndex, sections) {
    if (!Array.isArray(sections) || sections.length === 0) {
      warn(slug, ["block=sectionGroups", "index=" + (blockIndex + 1)], "sections", "missing", "missing sectionGroups.sections");
      return;
    }

    sections.forEach(function (section, sectionIndex) {
      var sectionPath = ["block=sectionGroups", "index=" + (blockIndex + 1), "section=" + (sectionIndex + 1)];
      if (!isObject(section)) {
        warn(slug, sectionPath, "type", "invalid", "section is not an object");
        return;
      }
      if (!isString(section.number)) {
        warn(slug, sectionPath, "number", "missing", "missing section.number");
      }
      if (!isString(section.title)) {
        warn(slug, sectionPath, "title", "missing", "missing section.title");
      }
      if (!Array.isArray(section.groups) || section.groups.length === 0) {
        warn(slug, sectionPath, "groups", "missing", "missing section.groups");
        return;
      }

      section.groups.forEach(function (group, groupIndex) {
        var groupPath = sectionPath.concat(["group=" + (groupIndex + 1)]);
        if (!isObject(group)) {
          warn(slug, groupPath, "type", "invalid", "group is not an object");
          return;
        }
        if (!isString(group.number)) {
          warn(slug, groupPath, "number", "missing", "missing group.number");
        }
        if (!isString(group.key)) {
          warn(slug, groupPath, "key", "missing", "missing group.key");
        }
        if (!isString(group.title)) {
          warn(slug, groupPath, "title", "missing", "missing group.title");
        }
        validateDescription(slug, groupPath, group.description);
        if (!Array.isArray(group.rows) || group.rows.length === 0) {
          warn(slug, groupPath, "rows", "missing", "missing group.rows");
          return;
        }

        group.rows.forEach(function (row, rowIndex) {
          var rowPath = groupPath.concat(["row=" + (rowIndex + 1)]);
          if (!isObject(row)) {
            warn(slug, rowPath, "type", "invalid", "row is not an object");
            return;
          }
          if (!isString(row.template)) {
            warn(slug, rowPath, "template", "missing", "missing row.template");
          }
          if (!isString(row.purpose)) {
            warn(slug, rowPath, "purpose", "missing", "missing row.purpose");
          }
        });
      });
    });
  }

  function validateFormalBlocks(page, slug) {
    var placeholderFields = null;
    if (isObject(page.placeholders) && Array.isArray(page.placeholders.fields)) {
      placeholderFields = page.placeholders.fields;
    }

    page.blocks.forEach(function (block, blockIndex) {
      var blockPath = ["block=" + (block && block.type ? block.type : "unknown"), "index=" + (blockIndex + 1)];
      if (!isObject(block)) {
        warn(slug, blockPath, "type", "invalid", "block is not an object");
        return;
      }
      if (!isString(block.type) || !supportedBlockTypes[block.type]) {
        warn(slug, blockPath, "type", "unsupported", "unsupported or missing block.type");
        return;
      }

      if (block.type === "pageHeader") {
        if (!isString(block.title)) {
          warn(slug, blockPath, "title", "missing", "missing pageHeader.title");
        }
        return;
      }

      if (block.type === "placeholderForm") {
        if (placeholderFields == null && Array.isArray(block.fields) && block.fields.length > 0) {
          warn(slug, blockPath, "fields", "deprecated", "placeholderForm.fields is deprecated, use page.placeholders.fields");
          placeholderFields = block.fields;
        }
        validatePlaceholderFields(slug, blockIndex, placeholderFields);
        return;
      }

      if (block.type === "workflow") {
        if (!Array.isArray(block.cards) || block.cards.length === 0) {
          warn(slug, blockPath, "cards", "missing", "missing workflow.cards");
        }
        return;
      }

      if (block.type === "sectionGroups") {
        validateSectionGroups(slug, blockIndex, block.sections);
      }
    });
  }

  function validateUnderConstructionBlocks(page, slug) {
    page.blocks.forEach(function (block, blockIndex) {
      var blockPath = ["block=" + (block && block.type ? block.type : "unknown"), "index=" + (blockIndex + 1)];
      if (!isObject(block)) {
        warn(slug, blockPath, "type", "invalid", "block is not an object");
        return;
      }
      if (!isString(block.type) || !supportedBlockTypes[block.type]) {
        warn(slug, blockPath, "type", "unsupported", "unsupported or missing block.type");
        return;
      }
      if (block.type === "pageHeader") {
        if (!isString(block.title)) {
          warn(slug, blockPath, "title", "missing", "missing pageHeader.title");
        }
        return;
      }
      if (block.type === "underConstruction" && !isString(block.text)) {
        warn(slug, blockPath, "text", "missing", "missing underConstruction.text");
      }
    });
  }

  function validatePageData(page, options) {
    options = options || {};
    var bootstrap = validatePageBootstrap(page, options);
    var slug = options.slug || (page && page.slug) || "unknown";
    var scope = bootstrap.scope;

    if (!bootstrap || bootstrap.fallback) {
      return false;
    }

    withScope(scope, function () {
      if (bootstrap.mode === "home") {
        return;
      }

      if (bootstrap.mode === "formal") {
        validateFormalBlocks(page, slug);
      } else {
        validateUnderConstructionBlocks(page, slug);
      }
    });

    if (!options.skipSuccess && !scopeIssues[scope]) {
      confirm(slug, bootstrap.mode, "page");
    }

    return true;
  }

  function validateHomeData(modules) {
    var scope = scopeKey("home", "home");

    withScope(scope, function () {
      if (!Array.isArray(modules)) {
        warn("home", ["modules"], "type", "missing", "window.CHEATSHEET_MODULES is missing or not an array");
        return;
      }

      modules.forEach(function (module, index) {
        var modulePath = ["module=" + (index + 1)];
        if (!isObject(module)) {
          warn("home", modulePath, "type", "invalid", "module is not an object");
          return;
        }
        if (!isString(module.key)) {
          warn("home", modulePath, "key", "missing", "missing module.key");
        }
        if (!isString(module.label)) {
          warn("home", modulePath, "label", "missing", "missing module.label");
        }
        if (!isString(module.dir)) {
          warn("home", modulePath, "dir", "missing", "missing module.dir");
        }
      });
    });

    if (!scopeIssues[scope]) {
      confirm("home", "home", "page");
    }

    return true;
  }

  window.CHEATSHEET_RUNTIME_VALIDATION = {
    warnOnce: warnOnce,
    inferPageMode: inferPageMode,
    validatePageBootstrap: validatePageBootstrap,
    validatePageData: validatePageData,
    validateHomeData: validateHomeData
  };
})();
