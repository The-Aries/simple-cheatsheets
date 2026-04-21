(function () {
  var release = {
    version: "v2026.04.21.2",
    branch: "main"
  };

  window.CHEATSHEET_RELEASE = release;

  window.CHEATSHEET_LOG_RELEASE = function () {
    if (window.__CHEATSHEET_RELEASE_LOGGED__) {
      return;
    }
    window.__CHEATSHEET_RELEASE_LOGGED__ = true;
    if (window.console && typeof window.console.info === "function") {
      window.console.info("[simple-cheatsheets] version=" + release.version + " branch=" + release.branch);
    }
  };
})();
