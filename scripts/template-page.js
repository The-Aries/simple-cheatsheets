(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var body = document.body;
  var key = (body && body.dataset && body.dataset.module) || "";
  var expectedSource = (body && body.dataset && body.dataset.pageSrc) || "(unknown)";

  var loadError = cheatsheet.pageLoadError || "";
  var pageData = cheatsheet.pageData || null;
  var common = cheatsheet.common || {};
  var validation = cheatsheet.validation || {};

  var page = null;
  var pageIsFallback = false;
  var bootstrap = null;

  if (validation && typeof validation.validatePageBootstrap === "function") {
    bootstrap = validation.validatePageBootstrap(pageData, { slug: key, source: expectedSource });
  }

  if (!pageData || (pageData.slug && key && pageData.slug !== key) || (bootstrap && bootstrap.fallback)) {
    if (typeof common.makeFallbackPage !== "function") {
      cheatsheet.pageLoadError = "common.makeFallbackPage is unavailable";
      window.CHEATSHEET_PAGE_LOAD_ERROR = "common.makeFallbackPage is unavailable";
      return;
    }
    page = common.makeFallbackPage({
      slug: key || "unknown",
      title: "Template Page",
      expectedSource: expectedSource,
      loadError: loadError,
      pageData: pageData
    });
    pageIsFallback = true;
  } else {
    page = pageData;
  }

  if (!page.slug) {
    page.slug = key || "unknown";
  }

  function resolveAssetHref(path) {
    if (!path) {
      return "";
    }
    if (/^(https?:)?\/\//.test(path) || path.charAt(0) === "/") {
      return path;
    }
    var root = (body && body.dataset && body.dataset.root) || "../";
    return root + String(path).replace(/^\.?\//, "");
  }

  function applyExtensionStyles(styles) {
    if (!Array.isArray(styles) || !styles.length) {
      return;
    }
    styles.forEach(function (item) {
      var href = resolveAssetHref(item);
      if (!href || document.querySelector('link[data-cheatsheet-extension="' + href + '"]')) {
        return;
      }
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-cheatsheet-extension", href);
      document.head.appendChild(link);
    });
  }

  function applyExtensionScripts(scripts) {
    if (!Array.isArray(scripts) || !scripts.length) {
      return;
    }
    scripts.forEach(function (item) {
      var src = resolveAssetHref(item);
      if (!src || document.querySelector('script[data-cheatsheet-extension="' + src + '"]')) {
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.setAttribute("data-cheatsheet-extension", src);
      document.head.appendChild(script);
    });
  }

  var extensions = page.extensions || {};
  applyExtensionStyles(extensions.styles || []);
  applyExtensionScripts(extensions.scripts || []);

  cheatsheet.pageLoadError = loadError;
  cheatsheet.pageData = pageData;
  cheatsheet.pageExtensions = extensions;
  cheatsheet.pageMode = validation && typeof validation.inferPageMode === "function"
    ? validation.inferPageMode(page.slug || key, page)
    : "underConstruction";
  cheatsheet.pageIsFallback = pageIsFallback;
  cheatsheet.page = page;

  window.CHEATSHEET_PAGE_LOAD_ERROR = loadError;
  window.CHEATSHEET_PAGE_EXTENSIONS = extensions;
  window.CHEATSHEET_PAGE_MODE = cheatsheet.pageMode;
  window.CHEATSHEET_PAGE_IS_FALLBACK = pageIsFallback;
  window.CHEATSHEET_PAGE = page;

  if (typeof cheatsheet.logRelease === "function") {
    cheatsheet.logRelease();
  }
})();
