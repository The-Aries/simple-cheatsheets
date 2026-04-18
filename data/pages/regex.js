(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (typeof common.makeUnderConstructionPage !== "function") {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "common.makeUnderConstructionPage is unavailable";
    return;
  }

  window.CHEATSHEET_PAGE_DATA = common.makeUnderConstructionPage("regex", "Regex");
})();
