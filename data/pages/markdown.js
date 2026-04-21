(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (!common.sharedFooter) {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "common.sharedFooter is unavailable";
    return;
  }

  var markdownPlaceholders = [
    { key: "pageTitle", label: "pageTitle", defaultValue: "Markdown Sample Page", help: "The title used in the playground heading and sample document." },
    { key: "fileName", label: "fileName", defaultValue: "notes.md", help: "A markdown file name used in download examples." },
    { key: "filePath", label: "filePath", defaultValue: "./docs/notes.md", help: "A file path or relative URL used in download links." },
    { key: "resourceUrl", label: "resourceUrl", defaultValue: "https://example.com/markdown-guide", help: "A resource URL used in regular links." },
    { key: "imageUrl", label: "imageUrl", defaultValue: "https://placehold.co/640x360?text=Markdown+Playground", help: "An image URL used in the playground image example." }
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
      "",
      [
        makeGroup(
          1,
          "headings",
          "Headings",
          "Use 1 to 6 leading # marks. Do not exceed 6. Headings organize the document outline, and each level can be repeated as needed.",
          [
            { template: "# pageTitle", purpose: "Level 1 heading for the page title." },
            { template: "## Section Title", purpose: "Level 2 heading for the main sections." },
            { template: "### Subsection Title", purpose: "Level 3 heading for nested detail." },
            { template: "###### Smallest Heading", purpose: "Level 6 heading, the deepest CommonMark heading level." }
          ],
          "Headings give the document its outline. Use the smallest level that matches the structure you need.",
          "https://spec.commonmark.org/spec#atx-headings",
          "CommonMark spec"
        ),
        makeGroup(
          2,
          "paragraphs",
          "Paragraphs",
          "Paragraphs are plain text blocks separated by blank lines. One or more lines of text form a paragraph until a blank line starts the next block.",
          [
            { template: "First paragraph.\n\nSecond paragraph.", purpose: "Separate paragraphs with a blank line." },
            { template: "A short paragraph that wraps naturally.", purpose: "Use plain text for most body copy." }
          ],
          "Paragraphs are the default block. They keep prose readable without extra syntax.",
          "https://spec.commonmark.org/spec#paragraphs",
          "CommonMark spec"
        ),
        makeGroup(
          3,
          "links",
          "Links",
          "Use [label](url) for inline links. The label is required, and the URL can be absolute or relative. This page keeps link syntax to the inline form because it is the form most people use first.",
          [
            { template: "[Open resource](resourceUrl)", purpose: "Link to a web resource or reference page." },
            { template: "[Download file](filePath)", purpose: "Link to a file path or relative document." }
          ],
          "Inline links are the most common way to connect documents, files, and references.",
          "https://spec.commonmark.org/spec#links",
          "CommonMark spec"
        ),
        makeGroup(
          4,
          "lists",
          "Lists",
          "Use -, *, or + for unordered items. Use 1. for ordered items. List items can repeat freely, and ordered items can start from any number when you need a different sequence.",
          [
            { template: "- item", purpose: "Use bullets for unordered content." },
            { template: "+ item", purpose: "Use the alternate unordered marker." },
            { template: "1. item", purpose: "Use numbers when order matters." }
          ],
          "Lists cover steps, summaries, and short repeated items. Use the marker that fits the reading pattern.",
          "https://spec.commonmark.org/spec#lists",
          "CommonMark spec"
        ),
        makeGroup(
          5,
          "emphasis",
          "Emphasis and strong",
          "Use *text* or _text_ for emphasis and **text** or __text__ for strong emphasis. This page keeps code spans in the next group so the two inline patterns stay easy to scan.",
          [
            { template: "**bold**", purpose: "Use strong emphasis for key terms and short callouts." },
            { template: "*italic*", purpose: "Use italics for lighter emphasis and names." },
            { template: "__bold__", purpose: "Use the underscore strong-emphasis form when needed." },
            { template: "_italic_", purpose: "Use the underscore emphasis form when needed." }
          ],
          "Emphasis is for scanning and contrast, not for decoration.",
          "https://spec.commonmark.org/spec#emphasis-and-strong-emphasis",
          "CommonMark spec"
        ),
        makeGroup(
          6,
          "code-blocks",
          "Code spans and fenced code blocks",
          "Use `inline code` for short literals, and fenced blocks with ``` or ~~~ for multi-line examples. Fence info strings are optional, and the fence can be any language tag you want to show.",
          [
            { template: "`inline code`", purpose: "Show a literal value inside a sentence." },
            { template: "```js\nconsole.log(pageTitle);\n```", purpose: "Show a fenced code block with an info string." },
            { template: "~~~\nplain text code block\n~~~", purpose: "Use the alternate fence marker." }
          ],
          "Code spans and fenced blocks are the standard way to show literal examples without interpretation.",
          "https://spec.commonmark.org/spec#fenced-code-blocks",
          "CommonMark spec"
        ),
        makeGroup(
          7,
          "images",
          "Images",
          "Use ![alt text](url) for images. The alt text is required for accessibility, and the URL can be absolute or relative like a link.",
          [
            { template: "![Playground image](imageUrl)", purpose: "Embed an image from a URL." }
          ],
          "Images are useful when a picture or diagram explains faster than text alone.",
          "https://spec.commonmark.org/spec#images",
          "CommonMark spec"
        ),
        makeGroup(
          8,
          "blockquotes",
          "Blockquotes",
          "Use > for a blockquote. Multiple quoted lines stay in the same quote block until a blank line ends it, and nested quoting can use more > markers if needed.",
          [
            { template: "> Quoted text stays visually separated from the main body.", purpose: "Use a blockquote for short callouts or citations." }
          ],
          "Blockquotes are a supporting pattern for notes, citations, and short callouts.",
          "https://spec.commonmark.org/spec#block-quotes",
          "CommonMark spec"
        ),
        makeGroup(
          9,
          "horizontal-rules",
          "Horizontal rules",
          "Use ---, ***, or ___ on their own line. A thematic break usually needs a blank line before or after it to stay readable.",
          [
            { template: "---", purpose: "Separate sections with a simple thematic break." },
            { template: "***", purpose: "Use an alternative thematic break style if you prefer." }
          ],
          "Thematic breaks are only for visual separation, not for document structure.",
          "https://spec.commonmark.org/spec#thematic-breaks",
          "CommonMark spec"
        )
      ]
    ),
    makeSection(
      2,
      "GFM",
      "",
      [
        makeGroup(
          1,
          "task-list-items",
          "Task list items",
          "Use - [ ] for an open task and - [x] or - [X] for a completed task. Task list items only make sense inside a list.",
          [
            { template: "- [ ] Draft the README", purpose: "Show an open task that still needs work." },
            { template: "- [x] Review the final copy", purpose: "Show a completed task." }
          ],
          "Task lists are practical because GitHub renders them as interactive checkboxes.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists",
          "GitHub Docs"
        ),
        makeGroup(
          2,
          "tables",
          "Tables",
          "Use a header row, a delimiter row, and one or more body rows. Each column is separated by pipes, and alignment markers live in the delimiter row.",
          [
            { template: "| Command | Purpose |\n| --- | --- |\n| git status | Show changes |\n| git diff | Inspect file differences |", purpose: "Create a simple comparison table." }
          ],
          "Tables are common in docs because they compress structured information into a compact form.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables",
          "GitHub Docs"
        ),
        makeGroup(
          3,
          "strikethrough",
          "Strikethrough",
          "Use ~~text~~ for strikethrough. This is a GFM extension, so it is not part of the CommonMark baseline.",
          [
            { template: "~~removed text~~", purpose: "Mark text as obsolete or corrected." }
          ],
          "Strikethrough is useful for revision history, corrections, and quick edits.",
          "https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
          "GitHub Docs"
        ),
        makeGroup(
          4,
          "autolink-literals",
          "Autolink literals",
          "Bare URLs and email addresses become links automatically in GitHub UI. This page keeps the coverage focused on the literal URL and email forms that people paste most often.",
          [
            { template: "https://example.com", purpose: "Let GitHub turn a plain URL into a link." },
            { template: "https://github.com/The-Aries/simple-cheatsheets", purpose: "Show how a repository URL is rendered automatically." },
            { template: "user@example.com", purpose: "Show how an email address becomes a link automatically." }
          ],
          "Autolinks reduce friction when you want to paste a reference and move on.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls",
          "GitHub Docs"
        )
      ]
    )
  ];

  var markdownPlayground = [
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
    "![Playground image](imageUrl)",
    "",
    "> Quoted text stays visually separated from the main body.",
    "",
    "```js",
    "console.log(pageTitle);",
    "```",
    "",
    "###### Smallest Heading",
    "",
    "## GFM",
    "",
    "- [ ] Draft the README",
    "- [x] Review the final copy",
    "",
    "| Command | Purpose |",
    "| --- | --- |",
    "| https://example.com | Autolink literal example |",
    "| user@example.com | Email autolink example |",
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
        intro: "Set the sample values once, then apply or reset them to see the Markdown source and playground update together."
      },
      {
        type: "preview",
        id: "playground",
        title: "Playground",
        intro: "Edit the Markdown source on the left. The rendered playground on the right updates as you type, and the global Apply and Reset buttons keep the placeholder examples in sync.",
        text: markdownPlayground
      },
      {
        type: "sectionGroups",
        sections: markdownSections
      }
    ],
    footer: common.sharedFooter
  };
})();
