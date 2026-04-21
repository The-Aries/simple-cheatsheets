(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (!common.sharedFooter) {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "common.sharedFooter is unavailable";
    return;
  }

  var markdownPlaceholders = [
    { key: "fileLabel", label: "fileLabel", defaultValue: "notes.md", help: "Label used in file-link examples." },
    { key: "fileUri", label: "fileUri", defaultValue: "./docs/notes.md", help: "URI or relative path used for file links." },
    { key: "resourceLabel", label: "resourceLabel", defaultValue: "Markdown guide", help: "Label used in regular link examples." },
    { key: "resourceUri", label: "resourceUri", defaultValue: "https://example.com/markdown-guide", help: "URI used in regular link examples." },
    { key: "imageLabel", label: "imageLabel", defaultValue: "Markdown preview", help: "Alt label used in image examples." },
    { key: "imageUri", label: "imageUri", defaultValue: "https://placehold.co/640x360?text=Markdown+Playground", help: "URI used in image examples." }
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
          "Use 1 to 6 leading # marks. Minimum is 1 # and maximum is 6 #.",
          [
            { template: "# resourceLabel", purpose: "Level 1 heading for the page title.", previewMarkdown: "# resourceLabel" },
            { template: "## Section Title", purpose: "Level 2 heading for major sections.", previewMarkdown: "## Section Title" },
            { template: "### Subsection Title", purpose: "Level 3 heading for nested content.", previewMarkdown: "### Subsection Title" },
            { template: "###### Smallest Heading", purpose: "Level 6 heading, the deepest CommonMark level.", previewMarkdown: "###### Smallest Heading" }
          ],
          "Headings define outline depth. Keep level jumps small so structure stays readable.",
          "https://spec.commonmark.org/spec#atx-headings",
          "CommonMark spec"
        ),
        makeGroup(
          2,
          "paragraphs",
          "Paragraphs",
          "Paragraphs are plain text blocks separated by a blank line. A paragraph can span multiple wrapped lines.",
          [
            { template: "First paragraph.\n\nSecond paragraph.", purpose: "Separate paragraphs with one blank line.", previewMarkdown: "First paragraph.\n\nSecond paragraph." },
            { template: "A short paragraph that wraps naturally.", purpose: "Use plain text for default body copy.", previewMarkdown: "A short paragraph that wraps naturally." }
          ],
          "Paragraphs are the default block in Markdown and should carry most prose.",
          "https://spec.commonmark.org/spec#paragraphs",
          "CommonMark spec"
        ),
        makeGroup(
          3,
          "links-images",
          "Links and images",
          "Links and images share the same bracket-plus-parentheses structure. Links use [label](uri), images use ![label](uri).",
          [
            { template: "[resourceLabel](resourceUri)", purpose: "Inline link with label and URI.", previewMarkdown: "[resourceLabel](resourceUri)" },
            { template: "[fileLabel](fileUri)", purpose: "Relative file link using label and URI.", previewMarkdown: "[fileLabel](fileUri)" },
            { template: "![imageLabel](imageUri)", purpose: "Image with alt label and URI.", previewMarkdown: "![imageLabel](imageUri)" }
          ],
          "Same syntax shell, different output type. Links render clickable text, images render media.",
          "https://spec.commonmark.org/spec#links",
          "CommonMark spec"
        ),
        makeGroup(
          4,
          "lists",
          "Lists",
          "Unordered markers can be -, *, or +. Ordered markers use number plus period, and sequence can start from any number.",
          [
            { template: "- item", purpose: "Unordered list with dash marker.", previewMarkdown: "- item\n- another item" },
            { template: "+ item", purpose: "Unordered list with plus marker.", previewMarkdown: "+ item\n+ another item" },
            { template: "1. item", purpose: "Ordered list when item order matters.", previewMarkdown: "1. first\n2. second" }
          ],
          "Lists are the most common compact structure for docs and READMEs.",
          "https://spec.commonmark.org/spec#lists",
          "CommonMark spec"
        ),
        makeGroup(
          5,
          "emphasis",
          "Emphasis and strong",
          "Emphasis supports *text* or _text_. Strong emphasis supports **text** or __text__.",
          [
            { template: "**bold**", purpose: "Strong emphasis with asterisks.", previewMarkdown: "**bold**" },
            { template: "*italic*", purpose: "Emphasis with asterisks.", previewMarkdown: "*italic*" },
            { template: "__bold__", purpose: "Strong emphasis with underscores.", previewMarkdown: "__bold__" },
            { template: "_italic_", purpose: "Emphasis with underscores.", previewMarkdown: "_italic_" }
          ],
          "Use emphasis sparingly so key words remain visible during scanning.",
          "https://spec.commonmark.org/spec#emphasis-and-strong-emphasis",
          "CommonMark spec"
        ),
        makeGroup(
          6,
          "code-blocks",
          "Code spans and fenced code blocks",
          "Inline code uses single backticks. Fenced blocks use triple backticks or tildes, and optional info strings can follow the opening fence.",
          [
            { template: "`inline code`", purpose: "Literal token inside normal text.", previewMarkdown: "Use `inline code` for identifiers." },
            { template: "```js\nconsole.log(resourceLabel);\n```", purpose: "Fenced code with language info string.", previewMarkdown: "```js\nconsole.log(resourceLabel);\n```" },
            { template: "~~~\nplain text code block\n~~~", purpose: "Alternate fence marker using tildes.", previewMarkdown: "~~~\nplain text code block\n~~~" }
          ],
          "Code formatting prevents accidental markdown interpretation for literal content.",
          "https://spec.commonmark.org/spec#fenced-code-blocks",
          "CommonMark spec"
        ),
        makeGroup(
          7,
          "blockquotes",
          "Blockquotes",
          "Blockquotes begin with >. Multiple quoted lines stay in one block until a blank line ends it.",
          [
            { template: "> Quoted text stays visually separated from the main body.", purpose: "Single-line quote block.", previewMarkdown: "> Quoted text stays visually separated from the main body." },
            { template: "> First line\n> Second line", purpose: "Multi-line quote block.", previewMarkdown: "> First line\n> Second line" }
          ],
          "Use blockquotes for citations, notes, and short callouts.",
          "https://spec.commonmark.org/spec#block-quotes",
          "CommonMark spec"
        ),
        makeGroup(
          8,
          "horizontal-rules",
          "Horizontal rules",
          "Thematic breaks support ---, ***, or ___ on their own line.",
          [
            { template: "---", purpose: "Thematic break with dashes.", previewMarkdown: "Text above\n\n---\n\nText below" },
            { template: "***", purpose: "Thematic break with asterisks.", previewMarkdown: "Text above\n\n***\n\nText below" }
          ],
          "Use thematic breaks as separators, not as heading substitutes.",
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
          "Task lists support - [ ] for open and - [x] or - [X] for done items.",
          [
            { template: "- [ ] Draft the README", purpose: "Unchecked task item.", previewMarkdown: "- [ ] Draft the README" },
            { template: "- [x] Review the final copy", purpose: "Checked task item.", previewMarkdown: "- [x] Review the final copy" }
          ],
          "Task lists are a GFM extension rendered as checkboxes in GitHub surfaces.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists",
          "GitHub Docs"
        ),
        makeGroup(
          2,
          "tables",
          "Tables",
          "Tables require a header row and a delimiter row, followed by zero or more body rows. Alignment markers live in the delimiter row.",
          [
            { template: "| Command | Purpose |\n| --- | --- |\n| git status | Show changes |\n| git diff | Inspect file differences |", purpose: "Basic two-column table.", previewMarkdown: "| Command | Purpose |\n| --- | --- |\n| git status | Show changes |\n| git diff | Inspect file differences |" }
          ],
          "Use tables when two-dimensional comparisons are easier than lists.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables",
          "GitHub Docs"
        ),
        makeGroup(
          3,
          "strikethrough",
          "Strikethrough",
          "Strikethrough uses ~~text~~ and belongs to GFM, not CommonMark core.",
          [
            { template: "~~removed text~~", purpose: "Mark obsolete or replaced text.", previewMarkdown: "~~removed text~~" }
          ],
          "Strikethrough helps show revision intent without deleting context.",
          "https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
          "GitHub Docs"
        ),
        makeGroup(
          4,
          "autolink-literals",
          "Autolink literals",
          "Bare URLs and email addresses are auto-linked in GitHub UI when they match supported forms.",
          [
            { template: "https://example.com", purpose: "Plain URL autolink.", previewMarkdown: "https://example.com" },
            { template: "https://github.com/The-Aries/simple-cheatsheets", purpose: "Repository URL autolink.", previewMarkdown: "https://github.com/The-Aries/simple-cheatsheets" },
            { template: "user@example.com", purpose: "Email autolink.", previewMarkdown: "user@example.com" }
          ],
          "Autolink literals are useful when fast references matter more than custom link labels.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls",
          "GitHub Docs"
        )
      ]
    )
  ];

  var markdownPlayground = [
    "# resourceLabel",
    "",
    "Markdown on this page is split into **CommonMark** and **GFM**.",
    "",
    "[resourceLabel](resourceUri)",
    "[fileLabel](fileUri)",
    "![imageLabel](imageUri)",
    "",
    "- item",
    "- another item",
    "",
    "```js",
    "console.log(resourceLabel);",
    "```",
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
    extensions: {
      styles: ["data/pages/markdown/styles.css"]
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
        type: "playground",
        id: "playground",
        title: "Playground",
        intro: "Edit the Markdown source on the left. The rendered playground on the right updates as you type, and the global Apply and Reset buttons keep the placeholder examples in sync.",
        text: markdownPlayground
      },
      {
        type: "sectionGroups",
        previewColumn: true,
        sections: markdownSections
      }
    ],
    footer: common.sharedFooter
  };
})();
