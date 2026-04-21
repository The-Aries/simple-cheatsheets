(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var modules = [
    { key: "git", label: "Git", dir: "git" },
    { key: "docker", label: "Docker", dir: "docker" },
    { key: "linux", label: "Linux", dir: "linux" },
    { key: "markdown", label: "Markdown", dir: "markdown" },
    { key: "regex", label: "Regex", dir: "regex" },
    { key: "matlab", label: "MATLAB", dir: "matlab" }
  ];

  cheatsheet.registry = cheatsheet.registry || {};
  cheatsheet.registry.modules = modules;
  cheatsheet.modules = modules;

  window.CHEATSHEET_MODULES = modules;
})();
