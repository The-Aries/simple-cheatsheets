(function () {
  var body = document.body;
  var key = (body && body.dataset && body.dataset.module) || "";
  var expectedSource = (body && body.dataset && body.dataset.pageSrc) || "(unknown)";

  var loadError = window.CHEATSHEET_PAGE_LOAD_ERROR || "";
  var pageData = window.CHEATSHEET_PAGE_DATA || null;
  var common = window.CHEATSHEET_COMMON || {};

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

  function makeFallbackPage() {
    var hasData = !!pageData;
    var dataSlug = hasData && pageData.slug ? pageData.slug : "(missing)";
    var diagnostics = [
      "module=" + (key || "(empty)"),
      "hasPageData=" + (hasData ? "yes" : "no"),
      "pageData.slug=" + dataSlug,
      "loadError=" + (loadError ? String(loadError) : "none"),
      "expectedDataSource=" + expectedSource
    ].join(" ; " );

    return {
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
          lead: "Page data missing or module not found. Diagnostics: " + diagnostics
        },
        {
          type: "underConstruction",
          id: "construction-status",
          title: "Status",
          text: "Module not found or page data failed to load. Diagnostics: " + diagnostics
        }
      ],
      footer: common.sharedFooter || fallbackFooter
    };
  }

  var page = null;
  if (pageData && (!pageData.slug || pageData.slug === key)) {
    page = pageData;
  } else {
    page = makeFallbackPage();
  }

  if (!page.slug) {
    page.slug = key || "unknown";
  }

  window.CHEATSHEET_PAGE = page;
})();
