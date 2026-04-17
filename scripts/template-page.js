(function () {
  var key = (document.body && document.body.dataset && document.body.dataset.module) || "";
  var pages = window.CHEATSHEET_TEMPLATE_PAGES || {};
  window.CHEATSHEET_PAGE = pages[key] || null;
})();
