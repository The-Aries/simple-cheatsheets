(function () {
  var page = window.CHEATSHEET_PAGE;
  var modules = window.CHEATSHEET_MODULES || [];
  if (!page) { return; }

  var body = document.body;
  var root = (body && body.dataset && body.dataset.root) || "../";
  document.title = page.pageTitle || document.title;

  function moduleHref(module) {
    return root + module.dir + "/";
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function renderTopNav() {
    var nav = document.getElementById("page-top-nav");
    if (!nav) { return; }
    var links = ["<a href=\"" + root + "\">Homepage</a>"];
    modules.forEach(function (m) {
      links.push("<a href=\"" + moduleHref(m) + "\">" + m.label + "</a>");
    });
    nav.innerHTML = links.join("");
  }

  function renderSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    if (!sidebar) { return; }
    var html = "";
    if ((page.placeholders || []).length) {
      html += "<details class=\"sidebar-group\" open><summary>Placeholders</summary><ul class=\"placeholder-links\">";
      page.placeholders.forEach(function (item) {
        html += "<li><a href=\"#placeholder-" + item.key + "\">" + item.key + "</a></li>";
      });
      html += "</ul></details>";
    }
    html += "<details class=\"sidebar-group\" open><summary>On this page</summary><ul class=\"page-nav-list\">";
    (page.sections || []).forEach(function (section, sectionIndex) {
      var sectionId = "section-" + (sectionIndex + 1);
      html += "<li><details class=\"sidebar-subgroup\" open><summary><a href=\"#" + sectionId + "\">" + (sectionIndex + 1) + ". " + section.title + "</a></summary><ul>";
      (section.groups || []).forEach(function (group, groupIndex) {
        var groupId = sectionId + "-" + (groupIndex + 1);
        html += "<li><a href=\"#" + groupId + "\">" + (sectionIndex + 1) + "." + (groupIndex + 1) + " " + group.name + "</a></li>";
      });
      html += "</ul></details></li>";
    });
    html += "</ul></details>";
    sidebar.innerHTML = html;
  }

  function renderMain() {
    var content = document.getElementById("page-content");
    if (!content) { return; }
    var html = "";
    html += "<section class=\"hero\" id=\"page-header\"><h1>" + page.heroTitle + "</h1><h2 class=\"description-title\">Description</h2><p class=\"lead\">" + (page.lead || "") + "</p></section>";

    if ((page.placeholders || []).length) {
      html += "<section class=\"panel values-panel\" aria-labelledby=\"values-title\"><div class=\"section-heading\"><h2 id=\"values-title\">Placeholders</h2><p>Set once, apply to command lines, then copy ready to run commands.</p></div><form class=\"values-form\" id=\"placeholder-form\">";
      page.placeholders.forEach(function (item) {
        html += "<div class=\"value-item\" id=\"placeholder-" + item.key + "\"><label class=\"value-row\" for=\"value-" + item.key + "\"><span>" + item.key + ":</span><input class=\"auto-size-input\" id=\"value-" + item.key + "\" data-placeholder-key=\"" + item.key + "\" value=\"" + item.key + "\" autocomplete=\"off\"></label><p class=\"value-help\">" + item.help + "</p></div>";
      });
      html += "<div class=\"values-actions\"><button type=\"button\" class=\"form-button\" id=\"apply-placeholders\">Apply</button><button type=\"button\" class=\"form-button\" id=\"reset-placeholders\">Reset</button></div></form></section>";
    }

    html += "<section class=\"panel\" aria-labelledby=\"concepts-title\"><div class=\"section-heading\"><h2 id=\"concepts-title\">Key Concepts</h2></div><div class=\"concept-list\">" + (page.concepts || []).map(function (item) { return "<p>" + item + "</p>"; }).join("") + "</div></section>";

    if (page.workflow && (page.workflow.cards || []).length) {
      html += "<section class=\"panel workflow-panel\" aria-labelledby=\"workflow-overview-title\"><div class=\"section-heading\"><h2 id=\"workflow-overview-title\">Workflow Overview</h2><p>" + (page.workflow.description || "") + "</p></div><ol class=\"workflow-sequence\">";
      page.workflow.cards.forEach(function (card) {
        html += "<li><h3>" + card.title + "</h3><p>" + card.text + "</p></li>";
      });
      html += "</ol></section>";
    }

    (page.sections || []).forEach(function (section, sectionIndex) {
      var sectionId = "section-" + (sectionIndex + 1);
      if (sectionIndex > 0 || (page.workflow && (page.workflow.cards || []).length)) {
        html += "<hr class=\"section-divider\">";
      }
      html += "<section class=\"panel\" id=\"" + sectionId + "\"><div class=\"section-heading\"><h2>" + (sectionIndex + 1) + ". " + section.title + "</h2></div>";
      (section.groups || []).forEach(function (group, groupIndex) {
        var groupId = sectionId + "-" + (groupIndex + 1);
        html += "<section class=\"command-group\" id=\"" + groupId + "\"><h3>" + (sectionIndex + 1) + "." + (groupIndex + 1) + " " + group.name + "</h3><p class=\"group-intro\">" + (group.intro || "") + "</p><div class=\"command-table-wrap\"><table class=\"command-table\"><thead><tr><th>Command</th><th>Purpose</th><th>Copy</th></tr></thead><tbody>";
        (group.rows || []).forEach(function (row, rowIndex) {
          var commandId = "cmd-" + (sectionIndex + 1) + "-" + (groupIndex + 1) + "-" + (rowIndex + 1);
          var safe = escapeHtml(row.template);
          html += "<tr><td><code class=\"command-code\" id=\"" + commandId + "\" data-template=\"" + safe + "\">" + safe + "</code></td><td>" + row.purpose + "</td><td><button type=\"button\" class=\"copy-button\" data-copy-target=\"" + commandId + "\">Copy</button></td></tr>";
        });
        html += "</tbody></table></div><div class=\"group-description\"><h4>Description</h4><p>" + (group.description || "") + "</p></div></section>";
      });
      html += "</section>";
    });

    html += "<p class=\"contact-note\">If you have questions or suggestions, you can <a href=\"mailto:653537305@qq.com\">email the author</a> or <a href=\"https://github.com/The-Aries/simple-cheatsheets/issues/new\">raise an issue</a>.</p>";
    content.innerHTML = html;
  }

  function renderFooter() {
    var footer = document.getElementById("page-footer");
    if (!footer) { return; }
    footer.innerHTML = "<a href=\"https://github.com/The-Aries\">GitHub Profile</a><a href=\"https://github.com/The-Aries/simple-cheatsheets\">Repository</a><span>Copyright © 2026 Junhao Zhang</span>";
  }

  function initActions() {
    var placeholderKeys = (page.placeholders || []).map(function (item) { return item.key; });
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
    }
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) { return navigator.clipboard.writeText(text); }
      return Promise.resolve();
    }
    document.querySelectorAll(".copy-button").forEach(function (button) {
      button.addEventListener("click", function () {
        var code = document.getElementById(button.getAttribute("data-copy-target"));
        if (!code) { return; }
        var original = button.textContent;
        copyText(code.textContent).then(function () {
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
        placeholderKeys.forEach(function (key) {
          var input = document.querySelector("[data-placeholder-key=\"" + key + "\"]");
          if (input) { input.value = key; resizeInput(input); }
        });
        renderTemplates();
      });
    }
    renderTemplates();
  }

  renderTopNav();
  renderSidebar();
  renderMain();
  renderFooter();
  initActions();
})();
