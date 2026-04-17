(function () {
  var modules = window.CHEATSHEET_MODULES || [];
  var body = document.body;
  var root = (body && body.dataset && body.dataset.root) || "./";

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
})();
