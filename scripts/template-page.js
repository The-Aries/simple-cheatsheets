(function () {
  var body = document.body;
  var key = (body && body.dataset && body.dataset.module) || "";
  var expectedSource = (body && body.dataset && body.dataset.pageSrc) || "(unknown)";

  var loadError = window.CHEATSHEET_PAGE_LOAD_ERROR || "";
  var pageData = window.CHEATSHEET_PAGE_DATA || null;
  var common = window.CHEATSHEET_COMMON || {};
  var validation = window.CHEATSHEET_RUNTIME_VALIDATION || {};

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
    ].join(" ; ");

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
  var pageIsFallback = false;
  var bootstrap = null;
  if (validation && typeof validation.validatePageBootstrap === "function") {
    bootstrap = validation.validatePageBootstrap(pageData, { slug: key, source: expectedSource });
  }

  if (!pageData || (pageData.slug && key && pageData.slug !== key) || (bootstrap && bootstrap.fallback)) {
    page = makeFallbackPage();
    pageIsFallback = true;
  } else {
    page = pageData;
  }

  if (!page.slug) {
    page.slug = key || "unknown";
  }

  if (validation && typeof validation.inferPageMode === "function") {
    window.CHEATSHEET_PAGE_MODE = validation.inferPageMode(page.slug || key, page);
  } else {
    window.CHEATSHEET_PAGE_MODE = key === "git" ? "formal" : "underConstruction";
  }

  window.CHEATSHEET_PAGE_IS_FALLBACK = pageIsFallback;
  window.CHEATSHEET_PAGE = page;
})();
