(function () {
  var release = {
    version: "local",
    branch: "local"
  };

  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  cheatsheet.release = release;

  function logRelease() {
    if (window.__CHEATSHEET_RELEASE_LOGGED__) {
      return;
    }
    window.__CHEATSHEET_RELEASE_LOGGED__ = true;
    if (window.console && typeof window.console.info === "function") {
      window.console.info("[simple-cheatsheets] version=" + release.version + " branch=" + release.branch);
    }
  }

  cheatsheet.logRelease = logRelease;

  window.CHEATSHEET_RELEASE = release;
  window.CHEATSHEET_LOG_RELEASE = logRelease;
})();
