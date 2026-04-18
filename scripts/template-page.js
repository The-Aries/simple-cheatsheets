(function () {
  var body = document.body;
  var key = (body && body.dataset && body.dataset.module) || "";
  var pages = window.CHEATSHEET_TEMPLATE_PAGES || {};
  var page = pages[key] || null;

  if (page && !page.slug) {
    page.slug = key;
  }

  window.CHEATSHEET_PAGE = page;
})();
