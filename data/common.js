(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};

  var site = {
    meta: {
      lang: "zh-CN",
      titleSuffix: " - Simple Cheatsheets"
    },
    author: {
      name: "Junhao Zhang",
      email: "653537305@qq.com",
      profileUrl: "https://github.com/The-Aries",
      repositoryUrl: "https://github.com/The-Aries/simple-cheatsheets",
      issueUrl: "https://github.com/The-Aries/simple-cheatsheets/issues/new"
    },
    footer: {
      links: [
        { label: "GitHub Profile", href: "https://github.com/The-Aries" },
        { label: "Repository", href: "https://github.com/The-Aries/simple-cheatsheets" }
      ],
      contactLinks: [
        { label: "Email the author", href: "mailto:653537305@qq.com" },
        { label: "Raise an issue", href: "https://github.com/The-Aries/simple-cheatsheets/issues/new" }
      ],
      copyright: "Copyright © 2026 Junhao Zhang"
    }
  };

  function makePageMeta(title, options) {
    options = options || {};
    return {
      title: String(title || "") + site.meta.titleSuffix,
      lang: options.lang || site.meta.lang
    };
  }

  function makeUnderConstructionPage(slug, title, options) {
    options = options || {};
    return {
      slug: slug,
      meta: makePageMeta(title + " Cheatsheet", options),
      layout: {
        hasSidebar: true
      },
      placeholders: {
        fields: []
      },
      extensions: options.extensions || {},
      blocks: [
        {
          type: "pageHeader",
          id: "page-header",
          title: title + " Cheatsheet",
          descriptionTitle: "Description",
          lead: "This page is being prepared. Content is not published yet."
        },
        {
          type: "underConstruction",
          id: "construction-status",
          title: "Status",
          text: "This cheatsheet is under construction. The v1 schema is already in place and content will be added in a later update."
        }
      ],
      footer: site.footer
    };
  }

  function makeFallbackPage(options) {
    options = options || {};
    var slug = options.slug || "unknown";
    var title = options.title || "Template Page";
    var expectedSource = options.expectedSource || "(unknown)";
    var loadError = options.loadError || "";
    var pageData = options.pageData || null;
    var hasData = !!pageData;
    var dataSlug = hasData && pageData.slug ? pageData.slug : "(missing)";
    var diagnostics = [
      "module=" + (slug || "(empty)"),
      "hasPageData=" + (hasData ? "yes" : "no"),
      "pageData.slug=" + dataSlug,
      "loadError=" + (loadError ? String(loadError) : "none"),
      "expectedDataSource=" + expectedSource
    ].join(" ; ");

    return {
      slug: slug,
      meta: makePageMeta(title, options),
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
          title: title,
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
      footer: site.footer
    };
  }

  site.makePageMeta = makePageMeta;
  site.makeUnderConstructionPage = makeUnderConstructionPage;
  site.makeFallbackPage = makeFallbackPage;

  cheatsheet.site = site;
  cheatsheet.common = site;
  window.CHEATSHEET_COMMON = site;
})();
