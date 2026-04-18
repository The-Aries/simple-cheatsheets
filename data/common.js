(function () {
  var sharedFooter = {
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

  function makeUnderConstructionPage(slug, title) {
    return {
      slug: slug,
      meta: {
        title: title + " Cheatsheet - Simple Cheatsheets",
        lang: "zh-CN"
      },
      layout: {
        hasSidebar: true
      },
      placeholders: {
        fields: []
      },
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
      footer: sharedFooter
    };
  }

  window.CHEATSHEET_COMMON = {
    sharedFooter: sharedFooter,
    makeUnderConstructionPage: makeUnderConstructionPage
  };
})();
