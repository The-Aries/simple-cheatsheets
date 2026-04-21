(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var common = cheatsheet.common || {};
  if (typeof common.makeUnderConstructionPage !== "function") {
    cheatsheet.pageLoadError = "CHEATSHEET.common.makeUnderConstructionPage is unavailable";
    window.CHEATSHEET_PAGE_LOAD_ERROR = "CHEATSHEET.common.makeUnderConstructionPage is unavailable";
    return;
  }

  var page = common.makeUnderConstructionPage("linux", "Linux");
  cheatsheet.pageData = page;
  cheatsheet.page = page;
  window.CHEATSHEET_PAGE_DATA = page;
  window.CHEATSHEET_PAGE = page;
})();
