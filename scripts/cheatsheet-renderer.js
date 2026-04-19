(function () {
  var page = window.CHEATSHEET_PAGE;
  var modules = window.CHEATSHEET_MODULES || [];
  var validation = window.CHEATSHEET_RUNTIME_VALIDATION || {};
  function renderHardFallback(title, message) {
    var content = document.getElementById("page-content");
    var footer = document.getElementById("page-footer");
    if (content) {
      content.innerHTML =
        "<section class=\"hero\" id=\"page-header\"><h1>" + String(title || "Template Page") + "</h1><h2 class=\"description-title\">Description</h2><p class=\"lead\">" + String(message || "Under Construction") + "</p></section>" +
        "<section class=\"panel\" id=\"construction-status\"><div class=\"section-heading\"><h2>Status</h2><p>Under Construction</p></div></section>";
    }
    if (footer) {
      footer.innerHTML = "<a href=\"https://github.com/The-Aries\">GitHub Profile</a><a href=\"https://github.com/The-Aries/simple-cheatsheets\">Repository</a><span>Copyright © 2026 Junhao Zhang</span><a href=\"mailto:653537305@qq.com\">Email the author</a><a href=\"https://github.com/The-Aries/simple-cheatsheets/issues/new\">Raise an issue</a>";
    }
  }
  if (validation && typeof validation.validatePageData === "function") {
    validation.validatePageData(page, { slug: (page && page.slug) || "unknown", skipSuccess: true });
  }

  if (!page) {
    renderHardFallback("Template Page", "Page data missing or module not found.");
    return;
  }

  var body = document.body;
  var root = (body && body.dataset && body.dataset.root) || "../";
  var blocks = Array.isArray(page.blocks) ? page.blocks : [];

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

  function findBlock(type) {
    for (var i = 0; i < blocks.length; i += 1) {
      if (blocks[i] && blocks[i].type === type) { return blocks[i]; }
    }
    return null;
  }

  function resolvePlaceholderFields() {
    var fromPage = page.placeholders && Array.isArray(page.placeholders.fields) ? page.placeholders.fields : [];
    if (fromPage.length) { return fromPage; }
    var placeholderBlock = findBlock("placeholderForm");
    if (placeholderBlock && Array.isArray(placeholderBlock.fields)) {
      return placeholderBlock.fields;
    }
    return [];
  }

  function resolveSectionGroups() {
    var sectionBlock = findBlock("sectionGroups");
    if (!sectionBlock || !Array.isArray(sectionBlock.sections)) { return []; }
    return sectionBlock.sections;
  }

  function resolvePreviewBlock() {
    return findBlock("preview");
  }

  function moduleHref(module) {
    return root + module.dir + "/";
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

  function renderTopNav() {
    var nav = document.getElementById("page-top-nav");
    if (!nav) { return; }

    var currentSlug = page.slug || "";
    var links = ["<a href=\"" + root + "\">Homepage</a>"];
    modules.forEach(function (module) {
      if (module.key === currentSlug) { return; }
      links.push("<a href=\"" + moduleHref(module) + "\">" + module.label + "</a>");
    });
    nav.innerHTML = links.join("");
  }

  function hideSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    body.classList.add("no-sidebar");
    if (sidebar) {
      sidebar.hidden = true;
      sidebar.innerHTML = "";
    }
  }

  function showSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    body.classList.remove("no-sidebar");
    if (sidebar) { sidebar.hidden = false; }
  }

  function renderSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    var shell = window.CHEATSHEET_SHELL && window.CHEATSHEET_SHELL.renderSidebar;
    if (!sidebar) { return; }

    if (!shell) {
      hideSidebar();
      return;
    }

    var layout = page.layout || {};
    if (layout.hasSidebar === false) {
      hideSidebar();
      return;
    }

    var fields = resolvePlaceholderFields();
    var sections = resolveSectionGroups();
    var pageHeader = findBlock("pageHeader");
    var placeholderBlock = findBlock("placeholderForm");
    var previewBlock = resolvePreviewBlock();
    var concepts = findBlock("concepts");
    var workflow = findBlock("workflow");

    var hasDescription = !!pageHeader;
    var hasPlaceholders = !!(placeholderBlock && fields.length);
    var hasPreview = !!previewBlock;
    var hasConcepts = !!(concepts && Array.isArray(concepts.items) && concepts.items.length > 0);
    var hasWorkflow = workflow && Array.isArray(workflow.cards) && workflow.cards.length > 0;
    var overviewItems = [];
    if (hasDescription) {
      overviewItems.push({
        label: "Description",
        href: "#" + (pageHeader.id || "page-header")
      });
    }
    if (hasPlaceholders) {
      overviewItems.push({
        label: "Placeholders",
        href: "#" + (placeholderBlock.id || "placeholders")
      });
    }
    if (hasPreview) {
      overviewItems.push({
        label: previewBlock.title || "Preview",
        href: "#" + (previewBlock.id || "preview")
      });
    }
    if (hasConcepts) {
      overviewItems.push({
        label: concepts.title || "Key Concepts",
        href: "#" + (concepts.id || "key-concepts")
      });
    }
    if (hasWorkflow) {
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

    shell({
      sidebarId: "page-sidebar",
      bodyClassTarget: body,
      model: {
        overview: { label: "Overview", open: true, items: overviewItems },
        mainContent: { label: "Main content", open: true, items: sectionItems }
      }
    });
  }

  function renderPageHeader(block) {
    return "<section class=\"hero\" id=\"" + escapeAttr(block.id || "page-header") + "\"><h1>" + escapeHtml(block.title || "") + "</h1><h2 class=\"description-title\">" + escapeHtml(block.descriptionTitle || "Description") + "</h2><p class=\"lead\">" + escapeHtml(block.lead || "") + "</p></section>";
  }

  function applyPlaceholderValues(text, values) {
    var rendered = String(text || "");
    Object.keys(values || {}).forEach(function (key) {
      rendered = rendered.split(key).join(values[key]);
    });
    return rendered;
  }

  function renderMarkdownInline(text) {
    var output = escapeHtml(text || "");
    output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      return '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '">';
    });
    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + escapeAttr(href) + '">' + label + '</a>';
    });
    output = output.replace(/`([^`]+)`/g, function (_, code) {
      return '<code>' + code + '</code>';
    });
    output = output.replace(/\*\*([^*]+)\*\*/g, function (_, strong) {
      return '<strong>' + strong + '</strong>';
    });
    output = output.replace(/~~([^~]+)~~/g, function (_, strike) {
      return '<del>' + strike + '</del>';
    });
    output = output.replace(/\*([^*]+)\*/g, function (_, italic) {
      return '<em>' + italic + '</em>';
    });
    return output;
  }

  function renderMarkdownPreview(text) {
    var lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var paragraph = [];
    var quote = [];
    var listType = "";
    var listItems = [];
    var inCode = false;
    var codeLines = [];

    function flushParagraph() {
      if (!paragraph.length) { return; }
      html.push("<p>" + renderMarkdownInline(paragraph.join(" ")) + "</p>");
      paragraph = [];
    }

    function flushQuote() {
      if (!quote.length) { return; }
      html.push("<blockquote><p>" + renderMarkdownInline(quote.join(" ")) + "</p></blockquote>");
      quote = [];
    }

    function flushList() {
      if (!listItems.length) { return; }
      var listTag = listType === "ordered" ? "ol" : "ul";
      var listHtml = "<" + listTag + ">";
      listItems.forEach(function (item) {
        if (item.type === "task") {
          listHtml += "<li><label><input type=\"checkbox\" disabled" + (item.checked ? " checked" : "") + "> " + renderMarkdownInline(item.text) + "</label></li>";
        } else {
          listHtml += "<li>" + renderMarkdownInline(item.text) + "</li>";
        }
      });
      listHtml += "</" + listTag + ">";
      html.push(listHtml);
      listItems = [];
      listType = "";
    }

    function flushCode() {
      if (!codeLines.length) { return; }
      html.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
      codeLines = [];
    }

    function flushAll() {
      flushParagraph();
      flushQuote();
      flushList();
    }

    function parseListLine(line) {
      var taskMatch = /^-\s+\[([ xX])\]\s+(.+)$/.exec(line);
      if (taskMatch) {
        return { type: "task", checked: taskMatch[1].toLowerCase() === "x", text: taskMatch[2] };
      }
      var orderedMatch = /^\d+\.\s+(.+)$/.exec(line);
      if (orderedMatch) {
        return { type: "ordered", text: orderedMatch[1] };
      }
      var bulletMatch = /^[-*+]\s+(.+)$/.exec(line);
      if (bulletMatch) {
        return { type: "unordered", text: bulletMatch[1] };
      }
      return null;
    }

    lines.forEach(function (rawLine) {
      var line = rawLine || "";
      if (/^```/.test(line)) {
        if (inCode) {
          flushCode();
          inCode = false;
        } else {
          flushAll();
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      if (!line.trim()) {
        flushAll();
        return;
      }

      var headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
      if (headingMatch) {
        flushAll();
        html.push("<h" + headingMatch[1].length + ">" + renderMarkdownInline(headingMatch[2]) + "</h" + headingMatch[1].length + ">");
        return;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        flushAll();
        html.push("<hr>");
        return;
      }

      var quoteMatch = /^>\s?(.*)$/.exec(line);
      if (quoteMatch) {
        if (listItems.length) { flushList(); }
        if (paragraph.length) { flushParagraph(); }
        quote.push(quoteMatch[1]);
        return;
      }

      var listMatch = parseListLine(line);
      if (listMatch) {
        if (paragraph.length) { flushParagraph(); }
        if (quote.length) { flushQuote(); }
        if (listType && listType !== listMatch.type && !(listType === "task" && listMatch.type === "task")) {
          flushList();
        }
        listType = listMatch.type;
        listItems.push(listMatch);
        return;
      }

      if (quote.length) { flushQuote(); }
      if (listItems.length && listType) { flushList(); }
      paragraph.push(line);
    });

    if (inCode) {
      flushCode();
    }
    flushAll();

    return html.join("");
  }

  function renderPreviewOutputForTextarea(textarea) {
    if (!textarea) { return; }
    var previewId = textarea.getAttribute("data-preview-id") || "";
    var output = previewId ? document.querySelector('.preview-output[data-preview-output-for="' + previewId + '"]') : null;
    if (!output) { return; }
    output.innerHTML = renderMarkdownPreview(textarea.value || "");
  }

  function renderPlaceholderForm(block, fields) {
    if (!fields.length) { return ""; }

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
    if (!items.length) { return ""; }
    var conceptsId = block.id || "key-concepts";
    var headingId = conceptsId + "-title";
    return "<section class=\"panel\" id=\"" + escapeAttr(conceptsId) + "\" aria-labelledby=\"" + escapeAttr(headingId) + "\"><div class=\"section-heading\"><h2 id=\"" + escapeAttr(headingId) + "\">" + escapeHtml(block.title || "Key Concepts") + "</h2></div><div class=\"concept-list\">" + items.map(function (item) { return "<p>" + escapeHtml(item) + "</p>"; }).join("") + "</div></section>";
  }

  function renderWorkflow(block) {
    var cards = Array.isArray(block.cards) ? block.cards : [];
    if (!cards.length) { return ""; }
    var workflowId = block.id || "workflow-overview";
    var workflowHeadingId = workflowId + "-title";
    var html = '<section class="panel workflow-panel" id="' + escapeAttr(workflowId) + '" aria-labelledby="' + escapeAttr(workflowHeadingId) + '"><div class="section-heading"><h2 id="' + escapeAttr(workflowHeadingId) + '">' + escapeHtml(block.title || 'Workflow Overview') + '</h2><p>' + escapeHtml(block.description || '') + '</p></div><ol class="workflow-sequence">';
    cards.forEach(function (card) {
      html += "<li><h3>" + escapeHtml(card.title || "") + "</h3><p>" + escapeHtml(card.text || "") + "</p></li>";
    });
    html += "</ol></section>";
    return html;
  }

  function renderGroupDescription(description) {
    if (!description) { return ""; }
    if (typeof description === "string") { return "<p>" + escapeHtml(description) + "</p>"; }

    var text = description.text ? escapeHtml(description.text) : "";
    var officialUrl = description.officialUrl || "";
    var officialLabel = description.officialLabel || "official documentation";
    var link = officialUrl ? "<a href=\"" + escapeAttr(officialUrl) + "\">" + escapeHtml(officialLabel) + "</a>" : "";

    if (text && link) {
      return "<p>" + text + " More flags and advanced combinations are available in the " + link + ".</p>";
    }
    if (text) { return "<p>" + text + "</p>"; }
    if (link) { return "<p>See the " + link + " for the full command reference.</p>"; }
    return "";
  }

  function renderSectionGroups(block) {
    var sections = Array.isArray(block.sections) ? block.sections : [];
    if (!sections.length) { return ""; }

    var html = "";
    sections.forEach(function (section, sectionIndex) {
      var sAnchor = sectionAnchor(section, sectionIndex);
      var sNumber = section.number || String(sectionIndex + 1);
      var sTitle = section.title || "Untitled section";
      var sIntro = section.intro || "";

      if (sectionIndex > 0) {
        html += "<hr class=\"section-divider\">";
      }

      html += "<section class=\"panel\" id=\"" + escapeAttr(sAnchor) + "\"><div class=\"section-heading\"><h2>" + escapeHtml(sNumber) + ". " + escapeHtml(sTitle) + "</h2>" + (sIntro ? "<p>" + escapeHtml(sIntro) + "</p>" : "") + "</div>";

      (section.groups || []).forEach(function (group, groupIndex) {
        var gAnchor = groupAnchor(section, group, sectionIndex, groupIndex);
        var gNumber = group.number || String(groupIndex + 1);
        var gTitle = group.title || group.key || "Untitled group";
        var gIntro = group.intro || "";
        var gRows = Array.isArray(group.rows) ? group.rows : [];

        html += "<section class=\"command-group\" id=\"" + escapeAttr(gAnchor) + "\"><h3>" + escapeHtml(sNumber) + "." + escapeHtml(gNumber) + " " + escapeHtml(gTitle) + "</h3>" + (gIntro ? "<p class=\"group-intro\">" + escapeHtml(gIntro) + "</p>" : "") + "<div class=\"command-table-wrap\"><table class=\"command-table\"><thead><tr><th>Command</th><th>Purpose</th><th>Copy</th></tr></thead><tbody>";

        gRows.forEach(function (row, rowIndex) {
          var commandId = "cmd-" + safeKey(sNumber) + "-" + safeKey(gNumber) + "-" + String(rowIndex + 1);
          var template = row.template || "";
          var commandClasses = "command-code" + (/\n/.test(template) ? " multiline" : "");
          html += "<tr><td><code class=\"" + commandClasses + "\" id=\"" + escapeAttr(commandId) + "\" data-template=\"" + escapeAttr(template) + "\">" + escapeHtml(template) + "</code></td><td>" + escapeHtml(row.purpose || "") + "</td><td><button type=\"button\" class=\"copy-button\" data-copy-target=\"" + escapeAttr(commandId) + "\">Copy</button></td></tr>";
        });

        html += "</tbody></table></div><div class=\"group-description\"><h4>Description</h4>" + renderGroupDescription(group.description) + "</div></section>";
      });

      html += "</section>";
    });

    return html;
  }

  function renderPreview(block) {
    var previewText = block.text || "";
    var previewId = block.id || "preview";
    var previewHeadingId = previewId + "-title";
    var previewTextareaId = previewId + "-source";
    var previewOutputId = previewId + "-output";
    return "<section class=\"panel preview-panel\" id=\"" + escapeAttr(previewId) + "\" aria-labelledby=\"" + escapeAttr(previewHeadingId) + "\"><div class=\"section-heading\"><h2 id=\"" + escapeAttr(previewHeadingId) + "\">" + escapeHtml(block.title || "Preview") + "</h2>" + (block.intro ? "<p>" + escapeHtml(block.intro) + "</p>" : "") + "</div><div class=\"preview-grid\"><div class=\"preview-column\"><label class=\"preview-label\" for=\"" + escapeAttr(previewTextareaId) + "\">Markdown source</label><textarea class=\"preview-input\" id=\"" + escapeAttr(previewTextareaId) + "\" data-preview-source=\"true\" data-preview-id=\"" + escapeAttr(previewId) + "\" data-template=\"" + escapeAttr(previewText) + "\">" + escapeHtml(previewText) + "</textarea><div class=\"preview-actions\"><button type=\"button\" class=\"copy-button\" data-copy-target=\"" + escapeAttr(previewTextareaId) + "\">Copy</button></div></div><div class=\"preview-column\"><div class=\"preview-output markdown-preview\" id=\"" + escapeAttr(previewOutputId) + "\" data-preview-output-for=\"" + escapeAttr(previewId) + "\"></div></div></div></section>";
  }

  function renderNote(block) {
    var text = block.text || "";
    if (!text) { return ""; }
    return "<section class=\"panel\"><div class=\"section-heading\"><h2>" + escapeHtml(block.title || "Note") + "</h2><p>" + escapeHtml(text) + "</p></div></section>";
  }

  function renderUnderConstruction(block) {
    return "<section class=\"panel\" id=\"" + escapeAttr(block.id || "construction-status") + "\" aria-labelledby=\"construction-title\"><div class=\"section-heading\"><h2 id=\"construction-title\">" + escapeHtml(block.title || "Status") + "</h2><p>" + escapeHtml(block.text || "This cheatsheet is under construction.") + "</p></div></section>";
  }

  function renderBlock(block, placeholderFields) {
    if (!block || !block.type) { return ""; }
    if (block.type === "pageHeader") { return renderPageHeader(block); }
    if (block.type === "placeholderForm") { return renderPlaceholderForm(block, placeholderFields); }
    if (block.type === "concepts") { return renderConcepts(block); }
    if (block.type === "workflow") { return renderWorkflow(block); }
    if (block.type === "sectionGroups") { return renderSectionGroups(block); }
    if (block.type === "preview") { return renderPreview(block); }
    if (block.type === "note") { return renderNote(block); }
    if (block.type === "underConstruction") { return renderUnderConstruction(block); }
    return "";
  }

  function renderMain() {
    var content = document.getElementById("page-content");
    if (!content) { return; }

    var placeholderFields = resolvePlaceholderFields();
    var placeholderValues = {};
    placeholderFields.forEach(function (field) {
      if (!field || !field.key) { return; }
      placeholderValues[field.key] = field.defaultValue || field.key;
    });
    var html = blocks.map(function (block) {
      if (block && block.type === "preview") {
        var previewHtml = renderPreview(block);
        return previewHtml;
      }
      if (block && block.type === "sectionGroups") {
        return renderSectionGroups(block);
      }
      if (block && block.type === "pageHeader") { return renderPageHeader(block); }
      if (block && block.type === "placeholderForm") { return renderPlaceholderForm(block, placeholderFields); }
      if (block && block.type === "concepts") { return renderConcepts(block); }
      if (block && block.type === "workflow") { return renderWorkflow(block); }
      if (block && block.type === "note") { return renderNote(block); }
      if (block && block.type === "underConstruction") { return renderUnderConstruction(block); }
      return "";
    }).join("");

    content.innerHTML = html && html.trim() ? html : '<section class="hero" id="page-header"><h1>Template Page</h1><h2 class="description-title">Description</h2><p class="lead">Page data missing.</p></section><section class="panel" id="construction-status"><div class="section-heading"><h2>Status</h2><p>Under Construction</p></div></section>';

    var previewTextareas = document.querySelectorAll(".preview-input[data-template]");
    previewTextareas.forEach(function (textarea) {
      var template = textarea.getAttribute("data-template") || "";
      textarea.value = applyPlaceholderValues(template, placeholderValues);
      renderPreviewOutputForTextarea(textarea);
    });
  }

  function renderFooter() {
    var footer = document.getElementById("page-footer");
    if (!footer) { return; }

    var fallbackFooter = {
      contactLinks: [
        { label: "Email the author", href: "mailto:653537305@qq.com" },
        { label: "Raise an issue", href: "https://github.com/The-Aries/simple-cheatsheets/issues/new" }
      ],
      links: [
        { label: "GitHub Profile", href: "https://github.com/The-Aries" },
        { label: "Repository", href: "https://github.com/The-Aries/simple-cheatsheets" }
      ],
      copyright: "Copyright © 2026 Junhao Zhang"
    };

    var footerConfig = page.footer || fallbackFooter;
    var contactLinks = Array.isArray(footerConfig.contactLinks) ? footerConfig.contactLinks : [];
    var links = Array.isArray(footerConfig.links) ? footerConfig.links : [];
    var html = "";

    links.forEach(function (item) {
      html += "<a href=\"" + escapeAttr(item.href || "#") + "\">" + escapeHtml(item.label || "") + "</a>";
    });
    html += "<span>" + escapeHtml(footerConfig.copyright || "") + "</span>";
    contactLinks.forEach(function (item) {
      html += "<a href=\"" + escapeAttr(item.href || "#") + "\">" + escapeHtml(item.label || "") + "</a>";
    });
    footer.innerHTML = html;
  }

  function initActions() {
    var fields = resolvePlaceholderFields();
    var placeholderKeys = fields.map(function (field) { return field.key; });
    var autoSizeInputs = document.querySelectorAll(".auto-size-input");

    function resizeInput(input) {
      var text = input.value || input.placeholder || "";
      var width = Math.max(18, Math.min(46, text.length + 2));
      input.style.width = width + "ch";
    }

    function getPlaceholderValues() {
      var values = {};
      placeholderKeys.forEach(function (key) {
        var input = document.querySelector("[data-placeholder-key=\"" + key + "\"]");
        values[key] = input ? (input.value.trim() || key) : key;
      });
      return values;
    }

    function renderTemplates() {
      var values = getPlaceholderValues();
      document.querySelectorAll(".command-code[data-template]").forEach(function (code) {
        var rendered = code.getAttribute("data-template") || "";
        placeholderKeys.forEach(function (key) {
          rendered = rendered.split(key).join(values[key]);
        });
        code.textContent = rendered;
      });
      document.querySelectorAll(".preview-input[data-template]").forEach(function (textarea) {
        var rendered = textarea.getAttribute("data-template") || "";
        placeholderKeys.forEach(function (key) {
          rendered = rendered.split(key).join(values[key]);
        });
        textarea.value = rendered;
        renderPreviewOutputForTextarea(textarea);
      });
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }

      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return Promise.resolve();
    }

    document.querySelectorAll(".copy-button").forEach(function (button) {
      button.addEventListener("click", function () {
        var code = document.getElementById(button.getAttribute("data-copy-target"));
        if (!code) { return; }
        var original = button.textContent;
        var text = code.tagName === "TEXTAREA" ? code.value : code.textContent;
        copyText(text).then(function () {
          button.textContent = "Copied";
          window.setTimeout(function () { button.textContent = original; }, 1000);
        });
      });
    });

    autoSizeInputs.forEach(function (input) {
      resizeInput(input);
      input.addEventListener("input", function () { resizeInput(input); });
    });

    var applyButton = document.getElementById("apply-placeholders");
    var resetButton = document.getElementById("reset-placeholders");
    if (applyButton) { applyButton.addEventListener("click", renderTemplates); }
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        fields.forEach(function (field) {
          var input = document.querySelector("[data-placeholder-key=\"" + field.key + "\"]");
          if (!input) { return; }
          input.value = field.defaultValue || field.key;
          resizeInput(input);
        });
        renderTemplates();
      });
    }

    document.querySelectorAll(".preview-input[data-template]").forEach(function (textarea) {
      textarea.addEventListener("input", function () {
        renderPreviewOutputForTextarea(textarea);
      });
    });

    renderTemplates();
  }

  if (page.meta && page.meta.title) {
    document.title = page.meta.title;
  }
  if (page.meta && page.meta.lang) {
    document.documentElement.lang = page.meta.lang;
  }

  try {
    if (validation && typeof validation.validatePageData === "function") {
      validation.validatePageData(page, { slug: page.slug || "unknown", skipSuccess: true });
    }

    renderTopNav();
    renderSidebar();
    renderMain();
    renderFooter();
    initActions();

    if (validation && typeof validation.validatePageData === "function") {
      validation.validatePageData(page, { slug: page.slug || "unknown", skipSuccess: !!window.CHEATSHEET_PAGE_IS_FALLBACK });
    }
  } catch (error) {
    renderHardFallback((page.meta && page.meta.title) || "Template Page", "Renderer failed. Under Construction.");
  }
})();
