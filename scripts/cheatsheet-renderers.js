(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  if (cheatsheet.renderers) {
    return;
  }

  function safeKey(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/\n/g, "&#10;");
  }

  function normalizeReferenceKey(text) {
    return String(text || "").trim().toLowerCase();
  }

  function getBlocks(page) {
    return page && Array.isArray(page.blocks) ? page.blocks : [];
  }

  function findBlock(page, type) {
    var blocks = getBlocks(page);
    for (var i = 0; i < blocks.length; i += 1) {
      if (blocks[i] && blocks[i].type === type) {
        return blocks[i];
      }
    }
    return null;
  }

  function resolvePlaceholderFields(page) {
    return page && page.placeholders && Array.isArray(page.placeholders.fields) ? page.placeholders.fields : [];
  }

  function resolveSectionGroups(page) {
    var sectionBlock = findBlock(page, "sectionGroups");
    if (!sectionBlock || !Array.isArray(sectionBlock.sections)) {
      return [];
    }
    return sectionBlock.sections;
  }

  function resolvePlaygroundBlock(page) {
    return findBlock(page, "playground");
  }

  function sectionAnchor(section, sectionIndex) {
    var number = section && section.number ? section.number : String(sectionIndex + 1);
    return "section-" + safeKey(number);
  }

  function groupAnchor(section, group, sectionIndex, groupIndex) {
    var sectionNumber = section && section.number ? section.number : String(sectionIndex + 1);
    var groupNumber = group && group.number ? group.number : String(groupIndex + 1);
    var groupKey = group && group.key ? "-" + safeKey(group.key) : "";
    return "group-" + safeKey(sectionNumber) + "-" + safeKey(groupNumber) + groupKey;
  }

  function applyPlaceholderValues(text, values) {
    var rendered = String(text || "");
    Object.keys(values || {}).forEach(function (key) {
      rendered = rendered.split(key).join(values[key]);
    });
    return rendered;
  }

  function toSentenceCase(text) {
    return String(text || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function buildMarkdownOfficialReferenceLabel(section, group) {
    var sectionTitle = section && section.title ? String(section.title).trim() : "";
    var groupKey = group && group.key ? String(group.key).trim() : "";
    var knownLabels = {
      "CommonMark/headings": "See CommonMark spec ATX headings.",
      "CommonMark/paragraphs": "See CommonMark spec paragraphs.",
      "CommonMark/links-images": "See CommonMark spec links.",
      "CommonMark/lists": "See CommonMark spec lists.",
      "CommonMark/emphasis": "See CommonMark spec emphasis and strong emphasis.",
      "CommonMark/code-blocks": "See CommonMark spec code spans.",
      "CommonMark/blockquotes": "See CommonMark spec block quotes.",
      "CommonMark/horizontal-rules": "See CommonMark spec thematic breaks.",
      "GFM/task-list-items": "See GitHub Docs about task lists.",
      "GFM/tables": "See GitHub Docs organizing information with tables.",
      "GFM/strikethrough": "See GitHub Docs basic writing and formatting syntax.",
      "GFM/autolink-literals": "See GitHub Docs autolinked references and URLs."
    };
    var knownKey = sectionTitle + "/" + groupKey;
    if (knownLabels[knownKey]) {
      return knownLabels[knownKey];
    }
    if (sectionTitle) {
      return "See " + sectionTitle + " " + toSentenceCase(group && group.title ? group.title : groupKey) + ".";
    }
    return "See " + toSentenceCase(group && group.title ? group.title : groupKey) + ".";
  }

  function buildOfficialReferenceLabel(page, section, group) {
    var slug = page && page.slug ? String(page.slug) : "";
    var sectionTitle = section && section.title ? String(section.title).trim() : "";
    var groupTitle = group && group.title ? String(group.title).trim() : "";

    if (!groupTitle) {
      return "See the official reference.";
    }

    if (slug === "git" || slug === "docker" || slug === "linux") {
      return "See " + groupTitle + ".";
    }

    if (slug === "markdown") {
      return buildMarkdownOfficialReferenceLabel(section, group);
    }

    if (sectionTitle) {
      return "See " + sectionTitle + " " + toSentenceCase(groupTitle) + ".";
    }

    return "See " + toSentenceCase(groupTitle) + ".";
  }

  function renderMarkdownInline(text, refs) {
    var source = String(text == null ? "" : text);
    var tokens = [];

    function store(markup) {
      tokens.push(markup);
      return "\u0000" + (tokens.length - 1) + "\u0000";
    }

    source = escapeHtml(source);
    source = source.replace(/(`+)([\s\S]*?)\1/g, function (_, fence, code) {
      return store("<code>" + code + "</code>");
    });
    source = source.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"([^"]*)"|'([^']*)'))?\)/g, function (_, alt, uri, doubleTitle, singleTitle) {
      var title = doubleTitle || singleTitle || "";
      return store('<img src="' + escapeAttr(uri) + '" alt="' + escapeAttr(alt) + '"' + (title ? ' title="' + escapeAttr(title) + '"' : "") + ">");
    });
    source = source.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+(?:"([^"]*)"|'([^']*)'))?\)/g, function (_, label, uri, doubleTitle, singleTitle) {
      var title = doubleTitle || singleTitle || "";
      return store('<a href="' + escapeAttr(uri) + '"' + (title ? ' title="' + escapeAttr(title) + '"' : "") + ">" + label + "</a>");
    });
    source = source.replace(/!\[([^\]]*)\]\[([^\]]*)\]/g, function (_, alt, ref) {
      var key = normalizeReferenceKey(ref || alt);
      var def = refs && refs[key];
      if (!def) {
        return _;
      }
      return store('<img src="' + escapeAttr(def.url) + '" alt="' + escapeAttr(alt) + '"' + (def.title ? ' title="' + escapeAttr(def.title) + '"' : "") + ">");
    });
    source = source.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, function (_, label, ref) {
      var key = normalizeReferenceKey(ref || label);
      var def = refs && refs[key];
      if (!def) {
        return _;
      }
      return store('<a href="' + escapeAttr(def.url) + '"' + (def.title ? ' title="' + escapeAttr(def.title) + '"' : "") + ">" + label + "</a>");
    });
    source = source.replace(/<((?:https?:\/\/|www\.)[^<>\s]+)>/g, function (_, url) {
      var href = url.indexOf("www.") === 0 ? "https://" + url : url;
      return store('<a href="' + escapeAttr(href) + '">' + escapeHtml(url) + "</a>");
    });
    source = source.replace(/<([^\s@<>]+@[^\s@<>]+\.[^<>\s]+)>/g, function (_, email) {
      return store('<a href="mailto:' + escapeAttr(email) + '">' + escapeHtml(email) + "</a>");
    });
    source = source.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    source = source.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");
    source = source.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    source = source.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    source = source.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    source = source.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    source = source.replace(/_([^_]+)_/g, "<em>$1</em>");
    source = source.replace(/(^|[\s(>])((?:https?:\/\/|www\.)[^\s<]+)/g, function (_, prefix, url) {
      var href = url.indexOf("www.") === 0 ? "https://" + url : url;
      return prefix + store('<a href="' + escapeAttr(href) + '">' + escapeHtml(url) + "</a>");
    });
    source = source.replace(/(^|[\s(>])([\w.+-]+@[\w.-]+\.[A-Za-z]{2,})(?=$|[\s<).,!?;:])/g, function (_, prefix, email) {
      return prefix + store('<a href="mailto:' + escapeAttr(email) + '">' + escapeHtml(email) + "</a>");
    });
    source = source.replace(/\u0000(\d+)\u0000/g, function (_, index) {
      return tokens[Number(index)] || "";
    });
    return source;
  }

  function renderMarkdownPreview(text, refs) {
    var lines = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    var referenceMap = refs || {};
    var html = [];
    var paragraph = [];
    var listType = "";
    var listOpen = false;
    var listDelimiter = "";
    var listStart = 1;
    var blockquote = [];
    var codeFence = null;
    var codeLines = [];
    var indentedCode = [];

    lines.forEach(function (line) {
      var def = line.match(/^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*$/);
      if (def) {
        referenceMap[normalizeReferenceKey(def[1])] = {
          url: def[2],
          title: def[3] || def[4] || ""
        };
      }
    });

    function flushParagraph() {
      if (paragraph.length) {
        var paragraphHtml = "";
        paragraph.forEach(function (part, index) {
          var current = part.replace(/\s+$/, "");
          if (index > 0) {
            var prev = paragraph[index - 1];
            if (/\s{2}$/.test(prev) || /\\$/.test(prev)) {
              paragraphHtml += "<br>";
            } else {
              paragraphHtml += " ";
            }
          }
          paragraphHtml += renderMarkdownInline(current, referenceMap);
        });
        html.push("<p>" + paragraphHtml + "</p>");
        paragraph = [];
      }
    }

    function closeList() {
      if (listOpen) {
        html.push(listType === "ol" ? "</ol>" : "</ul>");
        listOpen = false;
        listType = "";
        listDelimiter = "";
        listStart = 1;
      }
    }

    function flushBlockquote() {
      if (blockquote.length) {
        html.push("<blockquote>" + renderMarkdownPreview(blockquote.join("\n"), referenceMap) + "</blockquote>");
        blockquote = [];
      }
    }

    function renderTableRow(line, cellTag, alignments) {
      var cells = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|");
      return "<tr>" + cells.map(function (cell, index) {
        var alignment = alignments && alignments[index] ? ' align="' + alignments[index] + '"' : "";
        return "<" + cellTag + alignment + ">" + renderMarkdownInline(cell.trim(), referenceMap) + "</" + cellTag + ">";
      }).join("") + "</tr>";
    }

    function flushTable(block) {
      if (!block || !block.length) {
        return;
      }
      var rows = block.slice();
      var head = rows.shift();
      var delimiter = rows.shift() || "";
      var alignments = delimiter.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(function (cell) {
        var token = cell.trim();
        if (/^:-+:$/.test(token)) {
          return "center";
        }
        if (/^:-+$/.test(token)) {
          return "left";
        }
        if (/^-+:$/.test(token)) {
          return "right";
        }
        return "";
      });
      var body = rows;
      var tableHtml = ["<table>", "<thead>", renderTableRow(head, "th"), "</thead>"];
      if (body.length) {
        tableHtml.push("<tbody>");
        body.forEach(function (row) {
          tableHtml.push(renderTableRow(row, "td", alignments));
        });
        tableHtml.push("</tbody>");
      }
      tableHtml.push("</table>");
      html.push(tableHtml.join(""));
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      var trimmed = line.trim();
      var next = lines[i + 1] || "";

      if (codeFence) {
        if (new RegExp("^" + codeFence.char.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "{" + codeFence.length + ",}\\s*$").test(trimmed)) {
          html.push("<pre><code>" + codeLines.join("\n") + "</code></pre>");
          codeFence = null;
          codeLines = [];
        } else {
          codeLines.push(escapeHtml(line));
        }
        continue;
      }

      if (indentedCode.length) {
        if (/^(?: {4}|\t)/.test(line)) {
          indentedCode.push(escapeHtml(line.replace(/^(?: {4}|\t)/, "")));
          continue;
        }
        if (!trimmed) {
          indentedCode.push("");
          continue;
        }
        html.push("<pre><code>" + indentedCode.join("\n") + "</code></pre>");
        indentedCode = [];
        i -= 1;
        continue;
      }

      var openingFence = trimmed.match(/^(`{3,}|~{3,})\s*/);
      if (openingFence) {
        flushParagraph();
        closeList();
        flushBlockquote();
        codeFence = { char: openingFence[1].charAt(0), length: openingFence[1].length };
        codeLines = [];
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        closeList();
        flushBlockquote();
        continue;
      }

      if (/^(?: {4}|\t)/.test(line)) {
        flushParagraph();
        closeList();
        flushBlockquote();
        indentedCode = [escapeHtml(line.replace(/^(?: {4}|\t)/, ""))];
        continue;
      }

      if (/^> ?/.test(trimmed)) {
        blockquote.push(trimmed.replace(/^> ?/, ""));
        continue;
      }

      if (/^.+$/.test(trimmed) && /^=+$/.test(next.trim())) {
        flushParagraph();
        closeList();
        flushBlockquote();
        html.push("<h1>" + renderMarkdownInline(trimmed, referenceMap) + "</h1>");
        i += 1;
        continue;
      }

      if (/^.+$/.test(trimmed) && /^-+$/.test(next.trim()) && !/^[-*+]\s+/.test(trimmed) && !/^\d+\.\s+/.test(trimmed)) {
        flushParagraph();
        closeList();
        flushBlockquote();
        html.push("<h2>" + renderMarkdownInline(trimmed, referenceMap) + "</h2>");
        i += 1;
        continue;
      }

      if (/^#{1,6}\s+/.test(trimmed)) {
        flushParagraph();
        closeList();
        flushBlockquote();
        var level = trimmed.match(/^#{1,6}/)[0].length;
        html.push("<h" + level + ">" + renderMarkdownInline(trimmed.replace(/^#{1,6}\s+/, ""), referenceMap) + "</h" + level + ">");
        continue;
      }

      if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
        flushParagraph();
        closeList();
        flushBlockquote();
        html.push("<hr>");
        continue;
      }

      if (/^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*$/.test(trimmed)) {
        continue;
      }

      if (/^\|.*\|$/.test(trimmed) && /^\s*\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(next.trim())) {
        flushParagraph();
        closeList();
        flushBlockquote();
        var tableRows = [trimmed, next.trim()];
        i += 1;
        while (i + 1 < lines.length && lines[i + 1].trim() && /^\|.*\|$/.test(lines[i + 1].trim())) {
          tableRows.push(lines[i + 1].trim());
          i += 1;
        }
        flushTable(tableRows);
        continue;
      }

      var ordered = trimmed.match(/^(\d+)([.)])\s+/);
      var unordered = trimmed.match(/^[-*+]\s+/);
      var task = trimmed.match(/^[-*+]\s+\[( |x|X)\]\s+/);

      if (ordered || unordered) {
        flushParagraph();
        flushBlockquote();
        var nextType = ordered ? "ol" : "ul";
        var nextDelimiter = ordered ? ordered[2] : "";
        var nextStart = ordered ? Number(ordered[1]) || 1 : 1;
        if (!listOpen || listType !== nextType || (nextType === "ol" && listDelimiter !== nextDelimiter)) {
          closeList();
          listType = nextType;
          listOpen = true;
          listDelimiter = nextDelimiter;
          listStart = nextStart;
          html.push(listType === "ol" ? "<ol" + (listStart !== 1 ? ' start="' + listStart + '"' : "") + ">" : "<ul>");
        }
        var itemText = trimmed.replace(/^(\d+[.)]\s+|[-*+]\s+)/, "");
        if (task) {
          itemText = itemText.replace(/^\[( |x|X)\]\s+/, "");
          html.push('<li class="task-item"><input type="checkbox" disabled' + (task[1].toLowerCase() === "x" ? " checked" : "") + "> " + renderMarkdownInline(itemText, referenceMap) + "</li>");
        } else {
          html.push("<li>" + renderMarkdownInline(itemText, referenceMap) + "</li>");
        }
        continue;
      }

      if (blockquote.length) {
        flushBlockquote();
      }

      paragraph.push(line);
    }

    flushParagraph();
    closeList();
    flushBlockquote();
    if (codeFence) {
      html.push("<pre><code>" + codeLines.join("\n") + "</code></pre>");
    }
    if (indentedCode.length) {
      html.push("<pre><code>" + indentedCode.join("\n") + "</code></pre>");
    }
    return html.join("");
  }

  function renderPageHeader(block) {
    return "<section class=\"hero\" id=\"" + escapeAttr(block.id || "page-header") + "\"><h1>" + escapeHtml(block.title || "") + "</h1><h2 class=\"description-title\">" + escapeHtml(block.descriptionTitle || "Description") + "</h2><p class=\"lead\">" + escapeHtml(block.lead || "") + "</p></section>";
  }

  function renderPlaceholderForm(block, fields) {
    if (!fields.length) {
      return "";
    }

    var panelId = block.id || "placeholders";
    var headingId = block.headingId || "values-title";
    var heading = block.title || "Placeholders";
    var intro = block.intro || "Set once, apply to command lines, then copy ready to run commands.";
    var html = '<section class="panel values-panel" id="' + escapeAttr(panelId) + '" aria-labelledby="' + escapeAttr(headingId) + '"><div class="section-heading"><h2 id="' + escapeAttr(headingId) + '">' + escapeHtml(heading) + '</h2><p>' + escapeHtml(intro) + '</p></div><form class="values-form" id="placeholder-form">';

    fields.forEach(function (field) {
      var key = field.key;
      var fieldId = safeKey(key);
      var label = field.label || key;
      var value = field.defaultValue || key;
      var help = field.help || "";
      html += "<div class=\"value-item\" id=\"placeholder-" + fieldId + "\"><label class=\"value-row\" for=\"value-" + fieldId + "\"><span>" + escapeHtml(label) + ":</span><input class=\"auto-size-input\" id=\"value-" + fieldId + "\" data-placeholder-key=\"" + escapeAttr(key) + "\" value=\"" + escapeAttr(value) + "\" autocomplete=\"off\"></label><p class=\"value-help\">" + escapeHtml(help) + "</p></div>";
    });

    html += "<div class=\"values-actions\"><button type=\"button\" class=\"form-button\" id=\"apply-placeholders\">Apply</button><button type=\"button\" class=\"form-button\" id=\"reset-placeholders\">Reset</button></div></form></section>";
    return html;
  }

  function renderConcepts(block) {
    var items = Array.isArray(block.items) ? block.items : [];
    if (!items.length) {
      return "";
    }
    var conceptsId = block.id || "key-concepts";
    var headingId = conceptsId + "-title";
    return "<section class=\"panel\" id=\"" + escapeAttr(conceptsId) + "\" aria-labelledby=\"" + escapeAttr(headingId) + "\"><div class=\"section-heading\"><h2 id=\"" + escapeAttr(headingId) + "\">" + escapeHtml(block.title || "Key Concepts") + "</h2></div><div class=\"concept-list\">" + items.map(function (item) { return "<p>" + escapeHtml(item) + "</p>"; }).join("") + "</div></section>";
  }

  function renderWorkflow(block) {
    var cards = Array.isArray(block.cards) ? block.cards : [];
    if (!cards.length) {
      return "";
    }
    var workflowId = block.id || "workflow-overview";
    var workflowHeadingId = workflowId + "-title";
    var html = '<section class="panel workflow-panel" id="' + escapeAttr(workflowId) + '" aria-labelledby="' + escapeAttr(workflowHeadingId) + '"><div class="section-heading"><h2 id="' + escapeAttr(workflowHeadingId) + '">' + escapeHtml(block.title || "Workflow Overview") + '</h2><p>' + escapeHtml(block.description || '') + '</p></div><ol class="workflow-sequence">';
    cards.forEach(function (card) {
      html += "<li><h3>" + escapeHtml(card.title || "") + "</h3><p>" + escapeHtml(card.text || "") + "</p></li>";
    });
    html += "</ol></section>";
    return html;
  }

  function renderGroupDescription(description, page, section, group) {
    if (!description) {
      return "";
    }
    if (typeof description === "string") {
      return "<p>" + escapeHtml(description) + "</p>";
    }

    var text = description.text ? escapeHtml(description.text) : "";
    var officialUrl = description.officialUrl || "";
    var officialLabel = buildOfficialReferenceLabel(page, section, group);
    var officialLink = officialUrl ? "<a href=\"" + escapeAttr(officialUrl) + "\">" + escapeHtml(officialLabel) + "</a>" : "";
    var html = "";

    if (text) {
      html += "<p>" + text + "</p>";
    }
    if (officialLink) {
      html += "<p>" + officialLink + "</p>";
    }
    return html;
  }

  function renderSectionGroups(block, page) {
    var sections = Array.isArray(block.sections) ? block.sections : [];
    var showPreviewColumn = !!(block && block.previewColumn);
    if (!sections.length) {
      return "";
    }

    var html = "";
    sections.forEach(function (section, sectionIndex) {
      var sAnchor = sectionAnchor(section, sectionIndex);
      var sNumber = section.number || String(sectionIndex + 1);
      var sTitle = section.title || "Untitled section";

      if (sectionIndex > 0) {
        html += "<hr class=\"section-divider\">";
      }

      html += "<section class=\"panel\" id=\"" + escapeAttr(sAnchor) + "\"><div class=\"section-heading\"><h2>" + escapeHtml(sNumber) + ". " + escapeHtml(sTitle) + "</h2></div>";

      (section.groups || []).forEach(function (group, groupIndex) {
        var gAnchor = groupAnchor(section, group, sectionIndex, groupIndex);
        var gNumber = group.number || String(groupIndex + 1);
        var gTitle = group.title || group.key || "Untitled group";
        var gIntro = group.intro || "";
        var gRows = Array.isArray(group.rows) ? group.rows : [];
        html += "<section class=\"command-group\" id=\"" + escapeAttr(gAnchor) + "\"><h3>" + escapeHtml(sNumber) + "." + escapeHtml(gNumber) + " " + escapeHtml(gTitle) + "</h3>" + (gIntro ? "<p class=\"group-intro\">" + escapeHtml(gIntro) + "</p>" : "") + "<div class=\"command-table-wrap\"><table class=\"command-table" + (showPreviewColumn ? "" : " no-preview") + "\"><thead><tr><th>Command</th><th>Purpose</th>" + (showPreviewColumn ? "<th>Preview</th>" : "") + "<th>Copy</th></tr></thead><tbody>";

        gRows.forEach(function (row, rowIndex) {
          var commandId = "cmd-" + safeKey(sNumber) + "-" + safeKey(gNumber) + "-" + String(rowIndex + 1);
          var template = row.template || "";
          var previewTemplate = row.previewMarkdown || "";
          var commandClasses = "command-code" + (/\n/.test(template) ? " multiline" : "");
          var previewHtml = previewTemplate ? "<div class=\"row-preview markdown-preview\" data-template=\"" + escapeAttr(previewTemplate) + "\"></div>" : "<div class=\"row-preview row-preview-empty\">N/A</div>";
          html += "<tr><td><code class=\"" + commandClasses + "\" id=\"" + escapeAttr(commandId) + "\" data-template=\"" + escapeAttr(template) + "\">" + escapeHtml(template) + "</code></td><td><div class=\"command-purpose\">" + escapeHtml(row.purpose || "") + "</div></td>" + (showPreviewColumn ? "<td>" + previewHtml + "</td>" : "") + "<td><button type=\"button\" class=\"copy-button\" data-copy-target=\"" + escapeAttr(commandId) + "\">Copy</button></td></tr>";
        });

        html += "</tbody></table></div><div class=\"group-description\"><h4>Description</h4>" + renderGroupDescription(group.description, page, section, group) + "</div></section>";
      });

      html += "</section>";
    });

    return html;
  }

  function renderPlayground(block) {
    var previewText = block.text || "";
    var previewId = block.id || "playground";
    var previewHeadingId = previewId + "-title";
    var previewTextareaId = previewId + "-source";
    var previewOutputId = previewId + "-output";
    return "<section class=\"panel preview-panel\" id=\"" + escapeAttr(previewId) + "\" aria-labelledby=\"" + escapeAttr(previewHeadingId) + "\"><div class=\"section-heading\"><h2 id=\"" + escapeAttr(previewHeadingId) + "\">" + escapeHtml(block.title || "Playground") + "</h2>" + (block.intro ? "<p>" + escapeHtml(block.intro) + "</p>" : "") + "</div><div class=\"preview-grid\"><div class=\"preview-column\"><label class=\"preview-label\" for=\"" + escapeAttr(previewTextareaId) + "\">Source</label><textarea class=\"preview-input\" id=\"" + escapeAttr(previewTextareaId) + "\" data-preview-source=\"true\" data-preview-id=\"" + escapeAttr(previewId) + "\" data-template=\"" + escapeAttr(previewText) + "\">" + escapeHtml(previewText) + "</textarea><div class=\"preview-actions\"><button type=\"button\" class=\"copy-button\" data-copy-target=\"" + escapeAttr(previewTextareaId) + "\">Copy source</button></div></div><div class=\"preview-column\"><div class=\"preview-label\">Rendered output</div><div class=\"preview-output markdown-preview\" id=\"" + escapeAttr(previewOutputId) + "\" data-preview-output-for=\"" + escapeAttr(previewId) + "\"></div></div></div></section>";
  }

  function renderNote(block) {
    var text = block.text || "";
    var links = Array.isArray(block.links) ? block.links : [];
    if (!text && !links.length) {
      return "";
    }

    var noteId = block.id || safeKey(block.title || "note");
    var headingId = noteId + "-title";
    var html = "<section class=\"panel\" id=\"" + escapeAttr(noteId) + "\" aria-labelledby=\"" + escapeAttr(headingId) + "\"><div class=\"section-heading\"><h2 id=\"" + escapeAttr(headingId) + "\">" + escapeHtml(block.title || "Note") + "</h2>";
    if (text) {
      html += "<p>" + escapeHtml(text) + "</p>";
    }
    if (links.length) {
      html += '<p class="note-links">' + links.map(function (link) {
        return '<a href="' + escapeAttr(link.href || "#") + '">' + escapeHtml(link.label || "") + "</a>";
      }).join(' <span aria-hidden="true">|</span> ') + "</p>";
    }
    html += "</div></section>";
    return html;
  }

  function renderUnderConstruction(block) {
    return "<section class=\"panel\" id=\"" + escapeAttr(block.id || "construction-status") + "\" aria-labelledby=\"construction-title\"><div class=\"section-heading\"><h2 id=\"construction-title\">" + escapeHtml(block.title || "Status") + "</h2><p>" + escapeHtml(block.text || "This cheatsheet is under construction.") + "</p></div></section>";
  }

  function renderBlock(block, placeholderFields, page) {
    if (!block || !block.type) {
      return "";
    }
    if (block.type === "pageHeader") {
      return renderPageHeader(block);
    }
    if (block.type === "placeholderForm") {
      return renderPlaceholderForm(block, placeholderFields);
    }
    if (block.type === "concepts") {
      return renderConcepts(block);
    }
    if (block.type === "workflow") {
      return renderWorkflow(block);
    }
    if (block.type === "sectionGroups") {
      return renderSectionGroups(block, page);
    }
    if (block.type === "playground") {
      return renderPlayground(block);
    }
    if (block.type === "note") {
      return renderNote(block);
    }
    if (block.type === "underConstruction") {
      return renderUnderConstruction(block);
    }
    return "";
  }

  function buildSidebarModel(page) {
    var blocks = getBlocks(page);
    var fields = resolvePlaceholderFields(page);
    var sections = resolveSectionGroups(page);
    var pageHeader = findBlock(page, "pageHeader");
    var placeholderBlock = findBlock(page, "placeholderForm");
    var noteBlocks = blocks.filter(function (block) { return block && block.type === "note"; });
    var previewBlock = resolvePlaygroundBlock(page);
    var concepts = findBlock(page, "concepts");
    var workflow = findBlock(page, "workflow");

    var overviewItems = [];
    if (pageHeader) {
      overviewItems.push({
        label: "Description",
        href: "#" + (pageHeader.id || "page-header")
      });
    }
    noteBlocks.forEach(function (block) {
      overviewItems.push({
        label: block.title || "Note",
        href: "#" + (block.id || safeKey(block.title || "note"))
      });
    });
    if (placeholderBlock && fields.length) {
      overviewItems.push({
        label: "Placeholders",
        href: "#" + (placeholderBlock.id || "placeholders")
      });
    }
    if (previewBlock) {
      overviewItems.push({
        label: previewBlock.title || "Playground",
        href: "#" + (previewBlock.id || "playground")
      });
    }
    if (concepts && Array.isArray(concepts.items) && concepts.items.length > 0) {
      overviewItems.push({
        label: concepts.title || "Key Concepts",
        href: "#" + (concepts.id || "key-concepts")
      });
    }
    if (workflow && Array.isArray(workflow.cards) && workflow.cards.length > 0) {
      overviewItems.push({
        label: workflow.title || "Workflow",
        href: "#" + (workflow.id || "workflow-overview")
      });
    }

    var sectionItems = sections.map(function (section, sectionIndex) {
      var sAnchor = sectionAnchor(section, sectionIndex);
      var sNumber = section.number || String(sectionIndex + 1);
      var sTitle = section.title || "Untitled section";
      var children = (section.groups || []).map(function (group, groupIndex) {
        var gAnchor = groupAnchor(section, group, sectionIndex, groupIndex);
        var gNumber = group.number || String(groupIndex + 1);
        var gTitle = group.title || group.key || "Untitled group";
        return {
          label: sNumber + "." + gNumber + " " + gTitle,
          href: "#" + gAnchor
        };
      });

      return {
        label: sNumber + ". " + sTitle,
        href: "#" + sAnchor,
        children: children
      };
    });

    return {
      overview: { label: "Overview", open: true, items: overviewItems },
      mainContent: { label: "Main content", open: true, items: sectionItems }
    };
  }

  function renderFooterHtml(footerConfig) {
    var config = footerConfig || (cheatsheet.site && cheatsheet.site.footer) || {};
    var contactLinks = Array.isArray(config.contactLinks) ? config.contactLinks : [];
    var links = Array.isArray(config.links) ? config.links : [];
    var html = "";

    links.forEach(function (item) {
      html += "<a href=\"" + escapeAttr(item.href || "#") + "\">" + escapeHtml(item.label || "") + "</a>";
    });
    html += "<span>" + escapeHtml(config.copyright || "") + "</span>";
    contactLinks.forEach(function (item) {
      html += "<a href=\"" + escapeAttr(item.href || "#") + "\">" + escapeHtml(item.label || "") + "</a>";
    });
    return html;
  }

  function renderFallbackMarkup(title, message, footerConfig) {
    return {
      contentHtml:
        "<section class=\"hero\" id=\"page-header\"><h1>" + escapeHtml(title || "Template Page") + "</h1><h2 class=\"description-title\">Description</h2><p class=\"lead\">" + escapeHtml(message || "Under Construction") + "</p></section>" +
        "<section class=\"panel\" id=\"construction-status\"><div class=\"section-heading\"><h2>Status</h2><p>Under Construction</p></div></section>",
      footerHtml: renderFooterHtml(footerConfig)
    };
  }

  var api = {
    applyPlaceholderValues: applyPlaceholderValues,
    buildSidebarModel: buildSidebarModel,
    escapeAttr: escapeAttr,
    escapeHtml: escapeHtml,
    renderBlock: renderBlock,
    renderFallbackMarkup: renderFallbackMarkup,
    renderFooterHtml: renderFooterHtml,
    renderMarkdownPreview: renderMarkdownPreview,
    resolvePlaceholderFields: resolvePlaceholderFields
  };

  cheatsheet.renderers = api;
  window.CHEATSHEET_RENDERERS = api;
})();
