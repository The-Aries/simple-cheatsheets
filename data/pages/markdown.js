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

  var markdownSections = [
    {
      number: "1",
      title: "Headings",
      intro: "Start with the heading markers that structure almost every markdown note, README, and cheatsheet.",
      groups: [
        {
          number: "1",
          key: "heading-levels",
          title: "Heading levels",
          intro: "Use ATX headings for the fastest readable structure in a sample page or document.",
          rows: [
            { template: "# pageTitle", purpose: "Top-level document title that uses the pageTitle placeholder." },
            { template: "## Section Title", purpose: "A section-level heading for a major topic." },
            { template: "### Subsection Title", purpose: "A smaller heading for nested detail." }
          ],
          description: {
            text: "CommonMark supports ATX headings with one to six # markers.",
            officialUrl: "https://spec.commonmark.org/0.31.2/#atx-headings",
            officialLabel: "CommonMark headings"
          }
        }
      ]
    },
    {
      number: "2",
      title: "Emphasis",
      intro: "Inline emphasis is enough for most documentation needs and keeps notes compact.",
      groups: [
        {
          number: "1",
          key: "inline-emphasis",
          title: "Inline styles",
          intro: "Keep inline formatting readable and use code spans when you need literal text.",
          rows: [
            { template: "**bold**", purpose: "Strong emphasis for key terms." },
            { template: "*italic*", purpose: "Light emphasis for names or definitions." },
            { template: "~~strikethrough~~", purpose: "Mark content as removed or outdated." },
            { template: "`inline code`", purpose: "Show literal text, identifiers, and short snippets." }
          ],
          description: {
            text: "Combine strong, emphasis, strike, and code spans sparingly so the page stays readable.",
            officialUrl: "https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis",
            officialLabel: "CommonMark emphasis"
          }
        }
      ]
    },
    {
      number: "3",
      title: "Lists",
      intro: "Lists cover the everyday cases: bullets, ordering, and task tracking.",
      groups: [
        {
          number: "1",
          key: "list-types",
          title: "Bullets, numbers, and tasks",
          intro: "This block shows the minimum list forms that people reach for most often.",
          rows: [
            { template: "- item", purpose: "A simple unordered list item." },
            { template: "1. item", purpose: "An ordered list item with an explicit sequence." },
            { template: "- [ ] task", purpose: "An unchecked task item for follow-up work." },
            { template: "- [x] done", purpose: "A checked task item for completed work." }
          ],
          description: {
            text: "Task lists are useful in docs, issue notes, and practical checklists.",
            officialUrl: "https://spec.commonmark.org/0.31.2/#lists",
            officialLabel: "CommonMark lists"
          }
        }
      ]
    },
    {
      number: "4",
      title: "Links, Images, and Resources",
      intro: "Keep URLs in placeholders so you can swap targets without rewriting the document body.",
      groups: [
        {
          number: "1",
          key: "references",
          title: "References",
          intro: "The same placeholder can power link targets, image sources, and file downloads.",
          rows: [
            { template: "[Open resource](resourceUrl)", purpose: "Link to a web resource." },
            { template: "![Preview image](imageUrl)", purpose: "Embed a preview image from a URL." },
            { template: "[Download file](filePath)", purpose: "Point to a file path or relative download link." }
          ],
          description: {
            text: "Use placeholders for URLs and paths so examples can be reused across pages and environments.",
            officialUrl: "https://spec.commonmark.org/0.31.2/#links",
            officialLabel: "CommonMark links"
          }
        }
      ]
    },
    {
      number: "5",
      title: "Code and Quote",
      intro: "Block-level formatting gives a document rhythm and keeps longer samples readable.",
      groups: [
        {
          number: "1",
          key: "blocks",
          title: "Blocks and separators",
          intro: "Use quotes for callouts, fenced code for snippets, and horizontal rules for separation.",
          rows: [
            { template: "> Quoted text stays visually separated from the main body.", purpose: "A blockquote for short callouts or citations." },
            { template: "---", purpose: "A horizontal rule to divide sections or ideas." },
            { template: "```text\nfileName\nfilePath\nresourceUrl\nimageUrl\n```", purpose: "A fenced code block that keeps literal sample text together." }
          ],
          description: {
            text: "Fenced code blocks and blockquotes are enough for most cheatsheets and quick references.",
            officialUrl: "https://spec.commonmark.org/0.31.2/",
            officialLabel: "CommonMark specification"
          }
        }
      ]
    }
  ];

  var markdownPreview = [
    "# pageTitle",
    "",
    "This sample shows **bold**, *italic*, ~~strikethrough~~, and `inline code`.",
    "",
    "## Section Title",
    "",
    "### Subsection Title",
    "",
    "- item",
    "1. item",
    "- [ ] task",
    "- [x] done",
    "",
    "[Open resource](resourceUrl)",
    "![Preview image](imageUrl)",
    "[Download file](filePath)",
    "",
    "> Quoted text stays visually separated from the main body.",
    "",
    "---",
    "",
    "```text",
    "fileName",
    "filePath",
    "resourceUrl",
    "imageUrl",
    "```"
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
        lead: "Use the placeholder form to swap in a real page title, file name, file path, resource URL, and image URL. The preview panel renders the same content live so you can compare the source and the output quickly."
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
