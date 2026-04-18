(function () {
  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function renderDetailsGroup(label, items, openClass) {
    if (!items || !items.length) { return ""; }
    var html = "<details class=\"sidebar-group\"" + (openClass ? " open" : "") + "><summary>" + escapeHtml(label) + "</summary><ul>";
    items.forEach(function (item) {
      if (!item) { return; }
      if (item.children && item.children.length) {
        html += "<li><details class=\"sidebar-subgroup\" open><summary><a href=\"" + item.href + "\">" + escapeHtml(item.label) + "</a></summary><ul>";
        item.children.forEach(function (child) {
          html += "<li><a href=\"" + child.href + "\">" + escapeHtml(child.label) + "</a></li>";
        });
        html += "</ul></details></li>";
      } else {
        html += "<li><a href=\"" + item.href + "\">" + escapeHtml(item.label) + "</a></li>";
      }
    });
    html += "</ul></details>";
    return html;
  }

  function renderSimpleLink(label, href) {
    if (!href) { return ""; }
    return "<div class=\"sidebar-group sidebar-link-group\"><a class=\"sidebar-top-link\" href=\"" + href + "\">" + escapeHtml(label) + "</a></div>";
  }

  function renderSidebar(opts) {
    var sidebarId = (opts && opts.sidebarId) || "page-sidebar";
    var sidebar = document.getElementById(sidebarId);
    var body = (opts && opts.bodyClassTarget) || document.body;
    var model = (opts && opts.model) || {};

    if (!sidebar) { return; }

    var hasContent =
      !!(model.overview && model.overview.href) ||
      !!(model.workflow && model.workflow.href) ||
      !!(model.preview && model.preview.href) ||
      !!(model.placeholders && model.placeholders.items && model.placeholders.items.length) ||
      !!(model.sections && model.sections.items && model.sections.items.length);

    if (!hasContent) {
      sidebar.hidden = true;
      sidebar.innerHTML = "";
      if (body) { body.classList.add("no-sidebar"); }
      return;
    }

    sidebar.hidden = false;
    if (body) { body.classList.remove("no-sidebar"); }

    var html = "";
    html += renderSimpleLink((model.overview && model.overview.label) || "Overview", model.overview && model.overview.href);
    html += renderDetailsGroup((model.placeholders && model.placeholders.label) || "Placeholders", model.placeholders && model.placeholders.items, model.placeholders && model.placeholders.open !== false);
    html += renderSimpleLink((model.workflow && model.workflow.label) || "Workflow", model.workflow && model.workflow.href);
    html += renderSimpleLink((model.preview && model.preview.label) || "Preview", model.preview && model.preview.href);
    html += renderDetailsGroup((model.sections && model.sections.label) || "On this page", model.sections && model.sections.items, model.sections && model.sections.open !== false);

    sidebar.innerHTML = html;
  }

  window.CHEATSHEET_SHELL = window.CHEATSHEET_SHELL || {};
  window.CHEATSHEET_SHELL.renderSidebar = renderSidebar;
})();
