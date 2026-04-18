(function () {
  var body = document.body;
  var key = (body && body.dataset && body.dataset.module) || "";
  var pages = window.CHEATSHEET_TEMPLATE_PAGES || {};
  var page = pages[key] || null;

  if (!page) {
    page = {
      slug: key || "unknown",
      meta: {
        title: "Template Page - Simple Cheatsheets",
        lang: "zh-CN"
      },
      layout: {
        hasSidebar: false
      },
      placeholders: {
        fields: []
      },
      blocks: [
        {
          type: "pageHeader",
          id: "page-header",
          title: "Template Page",
          descriptionTitle: "Description",
          lead: "Page data missing or module not found."
        },
        {
          type: "underConstruction",
          id: "construction-status",
          title: "Status",
          text: "Module not found. Under Construction."
        }
      ],
      footer: {
        contactLinks: [
          { label: "Email the author", href: "mailto:653537305@qq.com" },
          { label: "Raise an issue", href: "https://github.com/The-Aries/simple-cheatsheets/issues/new" }
        ],
        links: [
          { label: "GitHub Profile", href: "https://github.com/The-Aries" },
          { label: "Repository", href: "https://github.com/The-Aries/simple-cheatsheets" }
        ],
        copyright: "Copyright © 2026 Junhao Zhang"
      }
    };
  }

  if (!page.slug) {
    page.slug = key || "unknown";
  }

  window.CHEATSHEET_PAGE = page;
})();
