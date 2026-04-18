(function () {
  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function renderDirectoryGroup(label, items, open) {
    if (!(items && items.length)) { return ""; }
    var html = "<details class=\"sidebar-group sidebar-root-group\"" + (open === false ? "" : " open") + "><summary class=\"sidebar-root-title\">" + escapeHtml(label) + "</summary><ul class=\"sidebar-root-list\">";
    items.forEach(function (item) {
      if (!item) { return; }
      if (item.children && item.children.length) {
        html += "<li class=\"sidebar-level2-item\"><details class=\"sidebar-subgroup\" open><summary><a class=\"sidebar-level2-link\" href=\"" + item.href + "\">" + escapeHtml(item.label) + "</a></summary><ul class=\"sidebar-level3-list\">";
        item.children.forEach(function (child) {
          html += "<li class=\"sidebar-level3-item\"><a class=\"sidebar-level3-link\" href=\"" + child.href + "\">" + escapeHtml(child.label) + "</a></li>";
        });
        html += "</ul></details></li>";
      } else {
        html += "<li class=\"sidebar-level2-item\"><a class=\"sidebar-level2-link\" href=\"" + item.href + "\">" + escapeHtml(item.label) + "</a></li>";
      }
    });
    html += "</ul></details>";
    return html;
  }

  function renderSidebar(opts) {
    var sidebarId = (opts && opts.sidebarId) || "page-sidebar";
    var sidebar = document.getElementById(sidebarId);
    var body = (opts && opts.bodyClassTarget) || document.body;
    var model = (opts && opts.model) || {};

    if (!sidebar) { return; }

    var overviewItems = model.overview && model.overview.items ? model.overview.items.slice() : [];
    if (!overviewItems.length) {
      var descriptionHref = model.overview && model.overview.href ? model.overview.href : (document.getElementById("page-header") ? "#page-header" : "");
      if (descriptionHref) {
        overviewItems.push({ label: "Description", href: descriptionHref });
      }
      if ((model.placeholders && model.placeholders.items && model.placeholders.items.length) || document.getElementById("placeholders")) {
        overviewItems.push({ label: "Placeholders", href: "#placeholders" });
      }
      var conceptsHref = document.getElementById("key-concepts") ? "#key-concepts" : (document.getElementById("concepts-title") ? "#concepts-title" : "");
      if (conceptsHref) {
        overviewItems.push({ label: "Key Concepts", href: conceptsHref });
      }
      if (model.workflow && model.workflow.href) {
        overviewItems.push({ label: model.workflow.label || "Workflow", href: model.workflow.href });
      }
    }

    var mainItems = model.mainContent && model.mainContent.items ? model.mainContent.items : [];
    if (!mainItems.length && model.sections && model.sections.items) {
      mainItems = model.sections.items;
    }

    var hasContent = !!(overviewItems.length || mainItems.length);
    if (!hasContent) {
      sidebar.hidden = true;
      sidebar.innerHTML = "";
      if (body) { body.classList.add("no-sidebar"); }
      return;
    }

    sidebar.hidden = false;
    if (body) { body.classList.remove("no-sidebar"); }

    var overviewOpen = model.overview ? model.overview.open !== false : true;
    var mainOpen = model.mainContent ? model.mainContent.open !== false : (model.sections ? model.sections.open !== false : true);

    var html = "";
    html += renderDirectoryGroup((model.overview && model.overview.label) || "Overview", overviewItems, overviewOpen);
    html += renderDirectoryGroup((model.mainContent && model.mainContent.label) || "Main content", mainItems, mainOpen);
    sidebar.innerHTML = html;
  }

  window.CHEATSHEET_SHELL = window.CHEATSHEET_SHELL || {};
  window.CHEATSHEET_SHELL.renderSidebar = renderSidebar;
})();
