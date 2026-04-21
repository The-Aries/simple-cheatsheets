(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var modules = (cheatsheet.registry && cheatsheet.registry.modules) || cheatsheet.modules || [];
  var validation = cheatsheet.validation || {};
  var renderers = cheatsheet.renderers || {};
  var body = document.body;
  var root = (body && body.dataset && body.dataset.root) || "./";

  cheatsheet.pageMode = "home";
  window.CHEATSHEET_PAGE_MODE = "home";

  if (typeof cheatsheet.logRelease === "function") {
    cheatsheet.logRelease();
  }

  if (validation && typeof validation.validateHomeData === "function") {
    validation.validateHomeData(modules);
  }

  function moduleHref(module) {
    return root + module.dir + "/";
  }

  var topNav = document.getElementById("home-top-nav");
  if (topNav) {
    topNav.innerHTML = modules.map(function (m) {
      return "<a href=\"" + moduleHref(m) + "\">" + m.label + "</a>";
    }).join("");
  }

  var topicNav = document.getElementById("home-topic-nav");
  if (topicNav) {
    topicNav.innerHTML = modules.map(function (m) {
      return "<a class=\"topic-link\" href=\"" + moduleHref(m) + "\">" + m.label + "</a>";
    }).join("");
  }

  var footer = document.getElementById("home-footer");
  if (footer) {
    footer.innerHTML = renderers.renderFooterHtml
      ? renderers.renderFooterHtml(cheatsheet.site && cheatsheet.site.footer)
      : "";
  }
})();
