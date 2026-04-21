(function () {
  var body = document.body;
  if (!body) {
    return;
  }

  if (document.getElementById("page-content")) {
    return;
  }

  var root = (body.dataset && body.dataset.root) || "../";
  body.classList.add("cheatsheet-page");
  body.insertAdjacentHTML(
    "afterbegin",
    '<header class="topbar">' +
      '<a class="brand" href="' + root + '">simple-cheatsheets</a>' +
      '<nav id="page-top-nav" aria-label="Global navigation"></nav>' +
    '</header>' +
    '<aside id="page-sidebar" class="sidebar" aria-label="Page navigation"></aside>' +
    '<main id="page-content" class="content"></main>' +
    '<footer id="page-footer" class="footer"></footer>'
  );
})();
