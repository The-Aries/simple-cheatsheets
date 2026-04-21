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
          "ATX headings use 1 to 6 leading # marks. Setext headings use underline form with = for level 1 and - for level 2.",
          [
            { template: "# Heading", purpose: "ATX level 1 heading.", previewMarkdown: "# Heading" },
            { template: "###### Heading", purpose: "ATX level 6 heading.", previewMarkdown: "###### Heading" },
            { template: "Heading\n===", purpose: "Setext level 1 heading.", previewMarkdown: "Heading\n===" },
            { template: "Heading\n---", purpose: "Setext level 2 heading.", previewMarkdown: "Heading\n---" }
          ],
          "Use headings to build outline depth. ATX covers levels 1 to 6, while Setext only covers levels 1 and 2.",
          "https://spec.commonmark.org/spec#atx-headings",
          "CommonMark spec"
        ),
        makeGroup(
          2,
          "paragraphs",
          "Paragraphs",
          "A paragraph is one or more lines separated from other blocks by a blank line. Soft line breaks stay inside the same paragraph. Hard line breaks use two trailing spaces or a trailing backslash.",
          [
            { template: "First paragraph.\n\nSecond paragraph.", purpose: "Blank lines split paragraphs.", previewMarkdown: "First paragraph.\n\nSecond paragraph." },
            { template: "Soft line break stays in the same paragraph.\nnext line continues the same paragraph.", purpose: "A plain newline stays inside the same paragraph.", previewMarkdown: "Soft line break stays in the same paragraph.\nnext line continues the same paragraph." },
            { template: "Hard break here  \nNext line.", purpose: "Two trailing spaces force a hard line break.", previewMarkdown: "Hard break here  \nNext line." },
            { template: "Hard break with backslash\\\nNext line.", purpose: "A trailing backslash also forces a hard line break.", previewMarkdown: "Hard break with backslash\\\nNext line." }
          ],
          "Paragraphs carry most prose. Blank lines split blocks, soft breaks do not, and hard breaks use trailing spaces or a trailing backslash.",
          "https://spec.commonmark.org/spec#paragraphs",
          "CommonMark spec"
        ),
        makeGroup(
          3,
          "links-images",
          "Links and images",
          "Links and images share the same bracket and parenthesis structure. Inline forms keep the destination next to the label, while reference forms split the label from the definition.",
          [
            { template: "[resourceLabel](resourceUri \"Open the guide\")", purpose: "Inline link with an optional title.", previewMarkdown: "[resourceLabel](resourceUri \"Open the guide\")" },
            { template: "[fileLabel](fileUri)", purpose: "Inline link to a relative URI.", previewMarkdown: "[fileLabel](fileUri)" },
            { template: "[resourceLabel][guide]\n\n[guide]: resourceUri \"Open the guide\"", purpose: "Reference-style link with a separate definition.", previewMarkdown: "[resourceLabel][guide]\n\n[guide]: resourceUri \"Open the guide\"" },
            { template: "![imageLabel](imageUri \"Preview image\")", purpose: "Inline image with alt text and optional title.", previewMarkdown: "![imageLabel](imageUri \"Preview image\")" },
            { template: "![imageLabel][preview-image]\n\n[preview-image]: imageUri \"Preview image\"", purpose: "Reference-style image with a separate definition.", previewMarkdown: "![imageLabel][preview-image]\n\n[preview-image]: imageUri \"Preview image\"" }
          ],
          "Links and images share the same destination and title pattern. Images are link syntax with a leading !.",
          "https://spec.commonmark.org/spec#links",
          "CommonMark spec"
        ),
        makeGroup(
          4,
          "lists",
          "Lists",
          "Unordered lists use -, +, or *. Ordered lists use a number plus . or ) as the delimiter. The starting number becomes the rendered start value, and changing the delimiter starts a new ordered list.",
          [
            { template: "- item", purpose: "Unordered list with a dash marker.", previewMarkdown: "- item\n- another item" },
            { template: "+ item", purpose: "Unordered list with a plus marker.", previewMarkdown: "+ item\n+ another item" },
            { template: "* item", purpose: "Unordered list with an asterisk marker.", previewMarkdown: "* item\n* another item" },
            { template: "3. first item", purpose: "Ordered list with an explicit start number.", previewMarkdown: "3. first item\n4. second item" },
            { template: "1) first item", purpose: "Ordered list with a parenthesis delimiter.", previewMarkdown: "1) first item\n2) second item" }
          ],
          "Lists are the most common compact structure for docs and READMEs. Indented items nest, and blank lines make a list loose.",
          "https://spec.commonmark.org/spec#lists",
          "CommonMark spec"
        ),
        makeGroup(
          5,
          "emphasis",
          "Emphasis and strong",
          "Single delimiters mark emphasis. Double delimiters mark strong emphasis. Triple delimiters can combine both, but parsing still has boundary rules.",
          [
            { template: "*italic*", purpose: "Emphasis with asterisks.", previewMarkdown: "*italic*" },
            { template: "_italic_", purpose: "Emphasis with underscores.", previewMarkdown: "_italic_" },
            { template: "**bold**", purpose: "Strong emphasis with double delimiters.", previewMarkdown: "**bold**" },
            { template: "__bold__", purpose: "Strong emphasis with underscores.", previewMarkdown: "__bold__" },
            { template: "***bold italic***", purpose: "Combined strong and emphasis with asterisks.", previewMarkdown: "***bold italic***" },
            { template: "___bold italic___", purpose: "Combined strong and emphasis with underscores.", previewMarkdown: "___bold italic___" }
          ],
          "Emphasis is range-sensitive. Not every wrapped run becomes emphasis, so delimiter placement still matters.",
          "https://spec.commonmark.org/spec#emphasis-and-strong-emphasis",
          "CommonMark spec"
        ),
        makeGroup(
          6,
          "code-blocks",
          "Code spans and fenced code blocks",
          "Inline code uses backticks and can use longer fences when the content contains backticks. Fenced code blocks use at least three backticks or tildes with a matching closing fence. Indented code blocks use four spaces or one tab.",
          [
            { template: "`inline code`", purpose: "Inline code span.", previewMarkdown: "Use `inline code` for identifiers." },
            { template: "`` `code` ``", purpose: "Inline code span when the content contains a backtick.", previewMarkdown: "`` `code` ``" },
            { template: "```js\nconsole.log(resourceLabel);\n```", purpose: "Fenced code block with an info string.", previewMarkdown: "```js\nconsole.log(resourceLabel);\n```" },
            { template: "~~~\nplain text code block\n~~~", purpose: "Fenced code block with tildes.", previewMarkdown: "~~~\nplain text code block\n~~~" },
            { template: "    indented code block\n    second line", purpose: "Indented code block with four spaces.", previewMarkdown: "    indented code block\n    second line" }
          ],
          "Code formatting keeps literal text literal. Use spans for inline tokens and blocks for multi-line samples.",
          "https://spec.commonmark.org/spec#code-spans",
          "CommonMark spec"
        ),
        makeGroup(
          7,
          "blockquotes",
          "Blockquotes",
          "Blockquotes begin with >. They can span multiple lines, nest, and contain other block content.",
          [
            { template: "> Quoted text stays visually separated from the main body.", purpose: "Single-line blockquote.", previewMarkdown: "> Quoted text stays visually separated from the main body." },
            { template: "> First line\n> Second line", purpose: "Multi-line blockquote.", previewMarkdown: "> First line\n> Second line" },
            { template: "> outer quote\n> > inner quote", purpose: "Nested blockquote.", previewMarkdown: "> outer quote\n> > inner quote" },
            { template: "> quote\n>\n> - quoted list item\n> - another item", purpose: "Blockquote containing list content.", previewMarkdown: "> quote\n>\n> - quoted list item\n> - another item" }
          ],
          "Use blockquotes for citations, notes, and short callouts. Nested quotes and other blocks are still part of the same structure.",
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
            { template: "***", purpose: "Thematic break with asterisks.", previewMarkdown: "Text above\n\n***\n\nText below" },
            { template: "___", purpose: "Thematic break with underscores.", previewMarkdown: "Text above\n\n___\n\nText below" }
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
          "Task lists support - [ ] for open items and - [x] or - [X] for done items.",
          [
            { template: "- [ ] Draft the README", purpose: "Unchecked task item.", previewMarkdown: "- [ ] Draft the README" },
            { template: "- [x] Review the final copy", purpose: "Checked task item.", previewMarkdown: "- [x] Review the final copy" },
            { template: "- [X] Ship the release", purpose: "Uppercase X is also valid for a completed task.", previewMarkdown: "- [X] Ship the release" },
            { template: "- [ ] Parent task\n  - [x] Child task", purpose: "Nested task list item.", previewMarkdown: "- [ ] Parent task\n  - [x] Child task" }
          ],
          "Task lists are a GFM extension rendered as checkboxes in GitHub surfaces.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists",
          "GitHub Docs"
        ),
        makeGroup(
          2,
          "tables",
          "Tables",
          "Tables require a header row and a delimiter row. Body rows are optional and can repeat. Alignment lives in the delimiter row.",
          [
            { template: "| Left | Center | Right |\n| :-- | :--: | --: |\n| A | B | C |\n| D | E | F |", purpose: "Table with left, center, and right alignment.", previewMarkdown: "| Left | Center | Right |\n| :-- | :--: | --: |\n| A | B | C |\n| D | E | F |" }
          ],
          "Use tables when two-dimensional comparisons are easier than lists.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables",
          "GitHub Docs"
        ),
        makeGroup(
          3,
          "strikethrough",
          "Strikethrough",
          "Strikethrough is a GFM extension. Wrap the text in two tildes, and the opening and closing delimiters must both be present.",
          [
            { template: "~~removed text~~", purpose: "Mark obsolete or replaced text.", previewMarkdown: "~~removed text~~" },
            { template: "~~removed~~ and **kept**", purpose: "Combine strikethrough with other inline formatting.", previewMarkdown: "~~removed~~ and **kept**" }
          ],
          "Strikethrough helps show revision intent without deleting context.",
          "https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
          "GitHub Docs"
        ),
        makeGroup(
          4,
          "autolink-literals",
          "Autolink literals",
          "Autolink literals are a GFM extension. Bare URLs, www. links, and bare email addresses are linked automatically. This is different from CommonMark angle-bracket autolinks.",
          [
            { template: "https://example.com", purpose: "Plain URL autolink.", previewMarkdown: "https://example.com" },
            { template: "www.example.com", purpose: "www. form also becomes a link.", previewMarkdown: "www.example.com" },
            { template: "user@example.com", purpose: "Email autolink.", previewMarkdown: "user@example.com" },
            { template: "https://github.com/The-Aries/simple-cheatsheets", purpose: "Repository URL autolink.", previewMarkdown: "https://github.com/The-Aries/simple-cheatsheets" }
          ],
          "Autolink literals are useful when fast references matter more than custom link labels.",
          "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls",
          "GitHub Docs"
        )
      ]
    )
  ];

  var markdownPlayground = [
    "# Markdown Cheatsheet",
    "",
    "Markdown on this page uses **CommonMark** as the baseline and adds the most useful **GFM** extensions.",
    "",
    "A paragraph can wrap across lines and still stay one paragraph.",
    "",
    "Hard break here  ",
    "Next line.",
    "",
    "[Markdown guide][guide]",
    "",
    "[guide]: resourceUri \"Reference link title\"",
    "",
    "[fileLabel](fileUri)",
    "![imageLabel](imageUri)",
    "",
    "- item",
    "- another item",
    "",
    "> Quote",
    ">",
    "> - quoted list item",
    "> - another item",
    "",
    "---",
    "",
    "- [ ] Draft the README",
    "- [x] Review the final copy",
    "",
    "| Left | Center | Right |",
    "| :-- | :--: | --: |",
    "| A | B | C |",
    "| D | E | F |",
    "",
    "~~removed text~~",
    "",
    "https://example.com",
    "www.example.com",
    "user@example.com"
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
