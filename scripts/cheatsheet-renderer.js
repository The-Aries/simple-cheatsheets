(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var page = cheatsheet.page;
  var modules = (cheatsheet.registry && cheatsheet.registry.modules) || cheatsheet.modules || [];
  var validation = cheatsheet.validation || {};
  var renderers = cheatsheet.renderers || {};
  var shell = (cheatsheet.shell && cheatsheet.shell.renderSidebar) ? cheatsheet.shell : {};
  var body = document.body;
  var root = (body && body.dataset && body.dataset.root) || "../";

  function renderHardFallback(title, message) {
    var content = document.getElementById("page-content");
    var footer = document.getElementById("page-footer");
    var fallback = renderers.renderFallbackMarkup
      ? renderers.renderFallbackMarkup(title, message, page && page.footer ? page.footer : (cheatsheet.site && cheatsheet.site.footer))
      : {
          contentHtml:
            "<section class=\"hero\" id=\"page-header\"><h1>" + String(title || "Template Page") + "</h1><h2 class=\"description-title\">Description</h2><p class=\"lead\">" + String(message || "Under Construction") + "</p></section>" +
            "<section class=\"panel\" id=\"construction-status\"><div class=\"section-heading\"><h2>Status</h2><p>Under Construction</p></div></section>",
          footerHtml: ""
        };

    if (content) {
      content.innerHTML = fallback.contentHtml;
    }
    if (footer) {
      footer.innerHTML = fallback.footerHtml || "";
    }
  }

  if (validation && typeof validation.validatePageData === "function") {
    validation.validatePageData(page, { slug: (page && page.slug) || "unknown", skipSuccess: true });
  }

  if (!page) {
    renderHardFallback("Template Page", "Page data missing or module not found.");
    return;
  }

  function moduleHref(module) {
    return root + module.dir + "/";
  }

  function renderTopNav() {
    var nav = document.getElementById("page-top-nav");
    if (!nav) {
      return;
    }

    var currentSlug = page.slug || "";
    var links = ["<a href=\"" + root + "\">Homepage</a>"];
    modules.forEach(function (module) {
      if (module.key === currentSlug) {
        return;
      }
      links.push("<a href=\"" + moduleHref(module) + "\">" + module.label + "</a>");
    });
    nav.innerHTML = links.join("");
  }

  function hideSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    body.classList.add("no-sidebar");
    if (sidebar) {
      sidebar.hidden = true;
      sidebar.innerHTML = "";
    }
  }

  function renderSidebar() {
    var sidebar = document.getElementById("page-sidebar");
    var renderSidebarShell = shell && shell.renderSidebar;
    var layout = page.layout || {};

    if (!sidebar || !renderSidebarShell) {
      hideSidebar();
      return;
    }

    if (layout.hasSidebar === false) {
      hideSidebar();
      return;
    }

    renderSidebarShell({
      sidebarId: "page-sidebar",
      bodyClassTarget: body,
      model: renderers.buildSidebarModel ? renderers.buildSidebarModel(page) : {}
    });
  }

  function renderMain() {
    var content = document.getElementById("page-content");
    if (!content) {
      return;
    }

    var placeholderFields = renderers.resolvePlaceholderFields ? renderers.resolvePlaceholderFields(page) : ((page.placeholders && Array.isArray(page.placeholders.fields)) ? page.placeholders.fields : []);
    var placeholderValues = {};
    placeholderFields.forEach(function (field) {
      if (!field || !field.key) {
        return;
      }
      placeholderValues[field.key] = field.defaultValue || field.key;
    });

    var blocks = Array.isArray(page.blocks) ? page.blocks : [];
    var html = blocks.map(function (block) {
      return renderers.renderBlock ? renderers.renderBlock(block, placeholderFields, page) : "";
    }).join("");

    content.innerHTML = html && html.trim()
      ? html
      : '<section class="hero" id="page-header"><h1>Template Page</h1><h2 class="description-title">Description</h2><p class="lead">Page data missing.</p></section><section class="panel" id="construction-status"><div class="section-heading"><h2>Status</h2><p>Under Construction</p></div></section>';

    var renderMarkdownPreview = renderers.renderMarkdownPreview;
    var applyPlaceholderValues = renderers.applyPlaceholderValues;

    document.querySelectorAll(".preview-input[data-template]").forEach(function (textarea) {
      var template = textarea.getAttribute("data-template") || "";
      textarea.value = applyPlaceholderValues ? applyPlaceholderValues(template, placeholderValues) : template;
      var previewId = textarea.getAttribute("data-preview-id") || "";
      var output = previewId ? document.querySelector('.preview-output[data-preview-output-for="' + previewId + '"]') : null;
      if (output && renderMarkdownPreview) {
        output.innerHTML = renderMarkdownPreview(textarea.value || "");
      }
    });

    document.querySelectorAll(".row-preview[data-template]").forEach(function (preview) {
      var template = preview.getAttribute("data-template") || "";
      var rendered = applyPlaceholderValues ? applyPlaceholderValues(template, placeholderValues) : template;
      preview.innerHTML = renderMarkdownPreview ? renderMarkdownPreview(rendered) : rendered;
    });
  }

  function renderFooter() {
    var footer = document.getElementById("page-footer");
    if (!footer) {
      return;
    }

    footer.innerHTML = renderers.renderFooterHtml
      ? renderers.renderFooterHtml(page.footer || (cheatsheet.site && cheatsheet.site.footer))
      : "";
  }

  function initActions() {
    var fields = renderers.resolvePlaceholderFields ? renderers.resolvePlaceholderFields(page) : ((page.placeholders && Array.isArray(page.placeholders.fields)) ? page.placeholders.fields : []);
    var placeholderKeys = fields.map(function (field) { return field.key; });
    var autoSizeInputs = document.querySelectorAll(".auto-size-input");
    var renderMarkdownPreview = renderers.renderMarkdownPreview;
    var applyPlaceholderValues = renderers.applyPlaceholderValues;

    function resizeInput(input) {
      var text = input.value || input.placeholder || "";
      var width = Math.max(18, Math.min(46, text.length + 2));
      input.style.width = width + "ch";
    }

    function getPlaceholderValues() {
      var values = {};
      placeholderKeys.forEach(function (key) {
        var input = document.querySelector("[data-placeholder-key=\"" + key + "\"]");
        values[key] = input ? (input.value.trim() || key) : key;
      });
      return values;
    }

    function renderTemplates() {
      var values = getPlaceholderValues();
      document.querySelectorAll(".command-code[data-template]").forEach(function (code) {
        var rendered = code.getAttribute("data-template") || "";
        placeholderKeys.forEach(function (key) {
          rendered = rendered.split(key).join(values[key]);
        });
        code.textContent = rendered;
      });
      document.querySelectorAll(".preview-input[data-template]").forEach(function (textarea) {
        var rendered = textarea.getAttribute("data-template") || "";
        rendered = applyPlaceholderValues ? applyPlaceholderValues(rendered, values) : rendered;
        textarea.value = rendered;
        var previewId = textarea.getAttribute("data-preview-id") || "";
        var output = previewId ? document.querySelector('.preview-output[data-preview-output-for="' + previewId + '"]') : null;
        if (output && renderMarkdownPreview) {
          output.innerHTML = renderMarkdownPreview(textarea.value || "");
        }
      });
      document.querySelectorAll(".row-preview[data-template]").forEach(function (preview) {
        var rendered = preview.getAttribute("data-template") || "";
        rendered = applyPlaceholderValues ? applyPlaceholderValues(rendered, values) : rendered;
        preview.innerHTML = renderMarkdownPreview ? renderMarkdownPreview(rendered) : rendered;
      });
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }

      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return Promise.resolve();
    }

    document.querySelectorAll(".copy-button").forEach(function (button) {
      button.addEventListener("click", function () {
        var code = document.getElementById(button.getAttribute("data-copy-target"));
        if (!code) {
          return;
        }
        var original = button.textContent;
        var text = code.tagName === "TEXTAREA" ? code.value : code.textContent;
        copyText(text).then(function () {
          button.textContent = "Copied";
          window.setTimeout(function () { button.textContent = original; }, 1000);
        });
      });
    });

    autoSizeInputs.forEach(function (input) {
      resizeInput(input);
      input.addEventListener("input", function () { resizeInput(input); });
    });

    var applyButton = document.getElementById("apply-placeholders");
    var resetButton = document.getElementById("reset-placeholders");
    if (applyButton) {
      applyButton.addEventListener("click", renderTemplates);
    }
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        fields.forEach(function (field) {
          var input = document.querySelector("[data-placeholder-key=\"" + field.key + "\"]");
          if (!input) {
            return;
          }
          input.value = field.defaultValue || field.key;
          resizeInput(input);
        });
        renderTemplates();
      });
    }

    document.querySelectorAll(".preview-input[data-template]").forEach(function (textarea) {
      textarea.addEventListener("input", function () {
        var previewId = textarea.getAttribute("data-preview-id") || "";
        var output = previewId ? document.querySelector('.preview-output[data-preview-output-for="' + previewId + '"]') : null;
        if (output && renderMarkdownPreview) {
          output.innerHTML = renderMarkdownPreview(textarea.value || "");
        }
      });
    });

    renderTemplates();
  }

  if (page.meta && page.meta.title) {
    document.title = page.meta.title;
  }
  if (page.meta && page.meta.lang) {
    document.documentElement.lang = page.meta.lang;
  }

  try {
    if (validation && typeof validation.validatePageData === "function") {
      validation.validatePageData(page, { slug: page.slug || "unknown", skipSuccess: true });
    }

    renderTopNav();
    renderSidebar();
    renderMain();
    renderFooter();
    initActions();

    if (validation && typeof validation.validatePageData === "function") {
      validation.validatePageData(page, { slug: page.slug || "unknown", skipSuccess: !!cheatsheet.pageIsFallback });
    }
  } catch (error) {
    renderHardFallback((page.meta && page.meta.title) || "Template Page", "Renderer failed. Under Construction.");
  }
})();
