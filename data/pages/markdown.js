(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (!common.sharedFooter) {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "common.sharedFooter is unavailable";
    return;
  }

  var markdownPlaceholders = [
    { key: "pageTitle", label: "pageTitle", defaultValue: "Markdown Sample Page", help: "The title used in the preview heading and sample document." },
    { key: "fileName", label: "fileName", defaultValue: "notes.md", help: "A markdown file name used in download examples." },
    { key: "filePath", label: "filePath", defaultValue: "./docs/notes.md", help: "A file path or relative URL used in download links." },
    { key: "resourceUrl", label: "resourceUrl", defaultValue: "https://example.com/markdown-guide", help: "A resource URL used in regular links." },
    { key: "imageUrl", label: "imageUrl", defaultValue: "https://placehold.co/640x360?text=Markdown+Preview", help: "An image URL used in the preview image example." }
  ];

  function makeGroup(number, key, title, intro, rows, text, officialUrl, officialLabel) {
    return {
      number: String(number),
      key: key,
      title: title,
      intro: intro,
      rows: rows,
      description: {
        text: text,
        officialUrl: officialUrl,
        officialLabel: officialLabel
      }
    };
  }

  function makeSection(number, title, intro, groups) {
    return {
      number: String(number),
      title: title,
      intro: intro,
      groups: groups
    };
  }

  var markdownSections = [
    makeSection(
      1,
      "CommonMark",
      "This section is the baseline syntax for everyday Markdown writing. The order follows practical README and doc usage, not the spec chapter order.",
      [
        makeGroup(
          1,
          "headings",
          "Headings",
          "Start with headings because they shape almost every note, README, and doc page.",
          [
            { template: "# pageTitle", purpose: "Top-level document title that uses the pageTitle placeholder." },
            { template: "## Section Title", purpose: "A section-level heading for a major topic." },
            { template: "### Subsection Title", purpose: "A smaller heading for nested detail." }
          ],
          "Headings are the fastest way to give a document a readable outline.",
          "https://spec.commonmark.org/spec#atx-headings",
          "CommonMark spec"
        ),
        makeGroup(
          2,
          "paragraphs",
          "Paragraphs",
          "Body text is the default content block, so it belongs near the top of any beginner page.",
          [
            { template: "First paragraph.\n\nSecond paragraph.", purpose: "Separate paragraphs with a blank line." },
            { template: "A short paragraph that wraps naturally.", purpose: "Use plain text for most body copy." }
          ],
          "Paragraphs are the base case. Everything else builds around them.",
          "https://spec.commonmark.org/spec#paragraphs",
          "CommonMark spec"
        ),
        makeGroup(
          3,
          "links",
          "Links",
          "Links are one of the first features people use in READMEs and documentation.",
          [
            { template: "[Open resource](resourceUrl)", purpose: "Link to a web resource or reference page." },
            { template: "[Download file](filePath)", purpose: "Link to a file path or relative document." }
          ],
          "Links show up everywhere, so they deserve an early place in the page.",
          "https://spec.commonmark.org/spec#links",
          "CommonMark spec"
        ),
        makeGroup(
          4,
          "lists",
          "Lists",
          "Bulleted and numbered lists are essential for steps, notes, and short summaries.",
          [
            { template: "- item", purpose: "Use bullets for unordered content." },
            { template: "1. item", purpose: "Use numbers when order matters." }
          ],
          "Lists are a core reading pattern in docs, onboarding pages, and README files.",
          "https://spec.commonmark.org/spec#lists",
          "CommonMark spec"
        ),
        makeGroup(
          5,
          "emphasis",
          "Emphasis and strong",
          "Inline emphasis is common, but it should stay secondary to the content itself.",
          [
            { template: "**bold**", purpose: "Use strong emphasis for key terms and short callouts." },
            { template: "*italic*", purpose: "Use italics for lighter emphasis and names." },
            { template: "`inline code`", purpose: "Use code spans for literal text and identifiers." }
          ],
          "Keep emphasis simple. It should support scanning, not fight with it.",
          "https://spec.commonmark.org/spec#emphasis-and-strong-emphasis",
          "CommonMark spec"
        ),
        makeGroup(
          6,
          "code-blocks",
          "Code spans and fenced code blocks",
          "Code examples deserve an early slot because they are central to README and docs writing.",
          [
            { template: "`inline code`", purpose: "Show a literal value inside a sentence." },
            { template: "```js\nconsole.log(pageTitle);\n```", purpose: "Show a short fenced code block." }
          ],
          "Code spans and fenced blocks are the main way to show literal examples without ambiguity.",
          "https://spec.commonmark.org/spec#fenced-code-blocks",
          "CommonMark spec"
        ),
        makeGroup(
          7,
          "images",
          "Images",
          "Images matter in docs and READMEs, but they usually come after text and links.",
          [
            { template: "![Preview image](imageUrl)", purpose: "Embed an image preview from a URL." }
          ],
          "Images are useful when a picture or diagram adds faster context than text alone.",
          "https://spec.commonmark.org/spec#images",
          "CommonMark spec"
        ),
        makeGroup(
          8,
          "blockquotes",
          "Blockquotes",
          "Quotes are useful for short notes, warnings, or source snippets.",
          [
            { template: "> Quoted text stays visually separated from the main body.", purpose: "Use a blockquote for short callouts or citations." }
          ],
          "Blockquotes are useful, but they are usually a supporting pattern rather than the main structure.",
          "https://spec.commonmark.org/spec#block-quotes",
          "CommonMark spec"
        ),
        makeGroup(
          9,
          "horizontal-rules",
          "Horizontal rules",
          "Rules are mostly a visual separator, so they should stay near the end of a beginner page.",
          [
            { template: "---", purpose: "Separate sections with a simple thematic break." },
            { template: "***", purpose: "Use an alternative thematic break style if you prefer." }
          ],
          "Thematic breaks are useful for visual separation, but they are not a primary writing tool.",
          "https://spec.commonmark.org/spec#thematic-breaks",
          "CommonMark spec"
        )
      ]
    ),
    makeSection(
      2,
      "GFM",
      "This section adds GitHub Flavored Markdown features that show up often in GitHub comments, READMEs, and issue templates.",
      [
        makeGroup(
          1,
          "task-list-items",
          "Task list items",
          "Task lists are one of the most visible GitHub additions for issue tracking and docs.",
          [
            { template: "- [ ] Draft the README", purpose: "Show an open task that still needs work." },
            { template: "- [x] Review the final copy", purpose: "Show a completed task." }
          ],
          "Task lists are practical because they turn plain checklists into trackable GitHub UI elements.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists",
          "GitHub Docs"
        ),
        makeGroup(
          2,
          "tables",
          "Tables",
          "Tables are a top-level GFM skill for structured README and doc content.",
          [
            { template: "| Command | Purpose |\n| --- | --- |\n| git status | Show changes |\n| git diff | Inspect file differences |", purpose: "Create a simple comparison table." }
          ],
          "Tables are common in docs because they compress structured information into a compact view.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables",
          "GitHub Docs"
        ),
        makeGroup(
          3,
          "strikethrough",
          "Strikethrough",
          "Strikethrough is a lightweight editing mark that shows up often in collaborative writing.",
          [
            { template: "~~removed text~~", purpose: "Mark text as obsolete or corrected." }
          ],
          "Strikethrough is popular because it communicates revision without deleting context.",
          "https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
          "GitHub Docs"
        ),
        makeGroup(
          4,
          "autolink-literals",
          "Autolink literals",
          "Plain URLs and GitHub references often become links automatically in GitHub UI.",
          [
            { template: "https://example.com", purpose: "Let GitHub turn a plain URL into a link." },
            { template: "https://github.com/The-Aries/simple-cheatsheets", purpose: "Show how a repository URL is rendered automatically." }
          ],
          "Autolinks reduce friction when you want to paste a reference and move on.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls",
          "GitHub Docs"
        )
      ]
    )
  ];

  var markdownPreview = [
    "# pageTitle",
    "",
    "Markdown on this page is split into **CommonMark** and **GFM**.",
    "",
    "## CommonMark",
    "",
    "A plain paragraph of text keeps the page readable.",
    "",
    "- item",
    "- another item",
    "",
    "[Open resource](resourceUrl)",
    "![Preview image](imageUrl)",
    "",
    "> Quoted text stays visually separated from the main body.",
    "",
    "```js",
    "console.log(pageTitle);",
    "```",
    "",
    "## GFM",
    "",
    "- [ ] Draft the README",
    "- [x] Review the final copy",
    "",
    "~~removed text~~"
  ].join("\n");

  window.CHEATSHEET_PAGE_DATA = {
    slug: "markdown",
    meta: {
      title: "Markdown Cheatsheet - Simple Cheatsheets",
      lang: "zh-CN"
    },
    layout: {
      hasSidebar: true
    },
    placeholders: {
      fields: markdownPlaceholders
    },
    blocks: [
      {
        type: "pageHeader",
        id: "page-header",
        title: "Markdown Cheatsheet",
        descriptionTitle: "Description",
        lead: "Markdown has four common layers: original Markdown, CommonMark, GFM, and platform-specific extensions. This page uses CommonMark as the baseline and adds the GFM syntax that is most useful in READMEs, docs, issues, and comments. Platform-specific extensions are intentionally out of scope."
      },
      {
        type: "placeholderForm",
        id: "placeholders",
        headingId: "values-title",
        title: "Placeholders",
        intro: "Set the sample values once, then apply or reset them to see the Markdown source and preview update together."
      },
      {
        type: "preview",
        id: "preview",
        title: "Preview",
        intro: "Edit the Markdown source on the left. The rendered preview on the right updates as you type, and the global Apply and Reset buttons keep the placeholder examples in sync.",
        text: markdownPreview
      },
      {
        type: "sectionGroups",
        sections: markdownSections
      }
    ],
    footer: common.sharedFooter
  };
})();
