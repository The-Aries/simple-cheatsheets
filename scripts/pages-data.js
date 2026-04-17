window.CHEATSHEET_TEMPLATE_PAGES = {
  linux: {
    pageTitle: "Linux Cheatsheet - Simple Cheatsheets",
    heroTitle: "Linux Cheatsheet",
    lead: "This page is a practical cheatsheet for common Linux shell workflows. It keeps daily commands compact and actionable.",
    concepts: [
      "<strong>Filesystem</strong> commands help you navigate and manage files quickly.",
      "<strong>Pipes</strong> and <strong>filters</strong> let you build efficient one line workflows.",
      "<strong>Permissions</strong> and process tools are key for safe system operations."
    ],
    workflow: {
      description: "A common Linux command flow goes from locating files, to inspecting content, then editing, permission handling, and process control.",
      cards: [
        { title: "Navigate", text: "Move across directories and inspect structure." },
        { title: "Inspect", text: "Read file contents and search text quickly." },
        { title: "Modify", text: "Create, move, copy, and remove files safely." },
        { title: "Control Access", text: "Adjust ownership and permission bits." },
        { title: "Manage Processes", text: "Find and control running processes." }
      ]
    },
    sections: [
      {
        title: "Filesystem Basics",
        groups: [
          {
            name: "navigation",
            intro: "Move around directories and list files.",
            rows: [
              { template: "pwd", purpose: "Print current working directory." },
              { template: "ls -la", purpose: "List files including hidden entries." },
              { template: "cd /path/to/dir", purpose: "Change to a target directory." }
            ],
            description: "Many listing and traversal flags are available. See the official <a href=\"https://man7.org/linux/man-pages/man1/ls.1.html\">ls manual page</a> for full reference."
          }
        ]
      },
      {
        title: "Text and Search",
        groups: [
          {
            name: "search",
            intro: "Find files and text content efficiently.",
            rows: [
              { template: "find . -name *.log", purpose: "Find files by name pattern." },
              { template: "rg error .", purpose: "Search text recursively with ripgrep." },
              { template: "head -n 50 app.log", purpose: "Read the first lines of a file." }
            ],
            description: "Advanced patterns and filters are available. See the official <a href=\"https://www.gnu.org/software/findutils/manual/html_mono/find.html\">findutils documentation</a>."
          }
        ]
      }
    ]
  },

  markdown: {
    pageTitle: "Markdown Cheatsheet - Simple Cheatsheets",
    heroTitle: "Markdown Cheatsheet",
    lead: "This page collects practical Markdown patterns for writing docs fast. It focuses on common syntax used in repos and wikis.",
    concepts: [
      "<strong>Structure</strong> comes from headings and lists.",
      "<strong>Readability</strong> improves when links, code, and tables are consistent."
    ],
    workflow: {
      description: "A typical Markdown writing flow starts with page structure, then block formatting, then links and references.",
      cards: [
        { title: "Outline", text: "Build heading hierarchy first." },
        { title: "Compose", text: "Write paragraphs and lists." },
        { title: "Format", text: "Add code, quotes, and emphasis." },
        { title: "Reference", text: "Insert links and images." },
        { title: "Review", text: "Check rendering and consistency." }
      ]
    },
    sections: [
      {
        title: "Core Syntax",
        groups: [
          {
            name: "headings",
            intro: "Create document hierarchy.",
            rows: [
              { template: "# Title", purpose: "Top level heading." },
              { template: "## Section", purpose: "Second level heading." },
              { template: "- item", purpose: "Bullet list item." }
            ],
            description: "Additional heading and list conventions depend on platform. See the <a href=\"https://www.markdownguide.org/basic-syntax/\">official syntax reference</a>."
          }
        ]
      }
    ]
  },

  regex: {
    pageTitle: "Regex Cheatsheet - Simple Cheatsheets",
    heroTitle: "Regex Cheatsheet",
    lead: "This page provides a concise set of regular expression patterns for daily filtering and validation tasks.",
    concepts: [
      "<strong>Character classes</strong> match one character from a set.",
      "<strong>Quantifiers</strong> control how many repetitions are allowed.",
      "<strong>Groups</strong> let you capture and reuse matched parts."
    ],
    workflow: {
      description: "A practical regex flow is to start with boundaries, add token classes, then apply quantifiers and groups.",
      cards: [
        { title: "Anchor", text: "Define line or string boundaries." },
        { title: "Tokenize", text: "Choose classes for each fragment." },
        { title: "Quantify", text: "Set repetition rules." },
        { title: "Capture", text: "Group reusable sub patterns." },
        { title: "Validate", text: "Test against real samples." }
      ]
    },
    sections: [
      {
        title: "Pattern Building",
        groups: [
          {
            name: "essentials",
            intro: "Core symbols and practical examples.",
            rows: [
              { template: "^\\d+$", purpose: "Match a full numeric string." },
              { template: "\\bTODO\\b", purpose: "Match whole word TODO." },
              { template: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$", purpose: "Basic email like pattern." }
            ],
            description: "Regex engines differ in feature support. Refer to your engine docs, such as <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions\">MDN regex reference</a>."
          }
        ]
      }
    ]
  },

  matlab: {
    pageTitle: "MATLAB Cheatsheet - Simple Cheatsheets",
    heroTitle: "MATLAB Cheatsheet",
    lead: "This page covers common MATLAB commands for matrix operations, scripts, and plotting.",
    placeholders: [
      { key: "matrixName", help: "A matrix variable name, such as A or dataMatrix." },
      { key: "scriptName", help: "A script filename, such as analysis_script.m." }
    ],
    concepts: [
      "<strong>Matrices</strong> are MATLAB main data model.",
      "<strong>Vectorization</strong> is preferred over manual loops for performance.",
      "<strong>Scripts and functions</strong> separate reusable logic from execution flow."
    ],
    workflow: {
      description: "A common MATLAB workflow starts with loading data, transforming arrays, visualizing results, and then saving outputs.",
      cards: [
        { title: "Load", text: "Import workspace variables from files." },
        { title: "Prepare", text: "Clean and reshape matrix data." },
        { title: "Compute", text: "Apply vectorized numeric operations." },
        { title: "Visualize", text: "Plot trends and inspect outputs." },
        { title: "Export", text: "Save figures and computed results." }
      ]
    },
    sections: [
      {
        title: "Workspace and Files",
        groups: [
          {
            name: "session",
            intro: "Open scripts, load variables, and inspect workspace.",
            rows: [
              { template: "run(scriptName)", purpose: "Run a MATLAB script file." },
              { template: "load(dataset.mat)", purpose: "Load variables from MAT file." },
              { template: "whos", purpose: "List variables with size and type." }
            ],
            description: "More options for script execution and file loading are available in the <a href=\"https://www.mathworks.com/help/matlab/ref/run.html\">official run documentation</a>."
          }
        ]
      },
      {
        title: "Matrix Operations",
        groups: [
          {
            name: "matrix",
            intro: "Create, transform, and summarize matrix data.",
            rows: [
              { template: "size(matrixName)", purpose: "Return matrix dimensions." },
              { template: "mean(matrixName, 1)", purpose: "Compute mean across each column." },
              { template: "matrixName(:,1:3)", purpose: "Select all rows for first three columns." }
            ],
            description: "MATLAB supports many advanced linear algebra routines. See the <a href=\"https://www.mathworks.com/help/matlab/matrices-and-arrays.html\">matrix and array documentation</a>."
          }
        ]
      }
    ]
  },

  react: {
    pageTitle: "React Cheatsheet - Simple Cheatsheets",
    heroTitle: "React Cheatsheet",
    lead: "This page is a compact React reference focused on component state and side effects.",
    concepts: [
      "<strong>Components</strong> map props and state to UI.",
      "<strong>Hooks</strong> encapsulate stateful logic without classes."
    ],
    workflow: {
      description: "A common React workflow is to define component shape, add state updates, then wire effects and event handlers.",
      cards: [
        { title: "Define", text: "Create component and props contract." },
        { title: "State", text: "Manage local data with hooks." },
        { title: "Handle", text: "Wire user interactions." },
        { title: "Effect", text: "Sync with external systems safely." },
        { title: "Compose", text: "Split UI into reusable pieces." }
      ]
    },
    sections: [
      {
        title: "Core Hooks",
        groups: [
          {
            name: "hooks",
            intro: "Most common hooks in daily component work.",
            rows: [
              { template: "const [count,setCount] = useState(0)", purpose: "Create local state and updater." },
              { template: "useEffect(() => {}, [deps])", purpose: "Run side effects based on dependencies." }
            ],
            description: "React has additional hooks and patterns for advanced use cases. See the <a href=\"https://react.dev/reference/react/hooks\">official hooks reference</a>."
          }
        ]
      }
    ]
  },

  kotlin: {
    pageTitle: "Kotlin Cheatsheet - Simple Cheatsheets",
    heroTitle: "Kotlin Cheatsheet",
    lead: "This page provides a practical Kotlin syntax reference for variables, null safety, and collections.",
    concepts: [
      "<strong>Null safety</strong> is built into the type system.",
      "<strong>Data classes</strong> simplify immutable model objects."
    ],
    workflow: {
      description: "A common Kotlin coding flow starts with type safe models, then collection transformations, and clear function boundaries.",
      cards: [
        { title: "Model", text: "Define clear types and data classes." },
        { title: "Validate", text: "Use null safe operators." },
        { title: "Transform", text: "Map and filter collections fluently." },
        { title: "Organize", text: "Extract reusable functions." },
        { title: "Refine", text: "Leverage concise Kotlin idioms." }
      ]
    },
    sections: [
      {
        title: "Language Basics",
        groups: [
          {
            name: "syntax",
            intro: "Frequent Kotlin language constructs.",
            rows: [
              { template: "val name: String = Aries", purpose: "Immutable variable with type." },
              { template: "val length = name?.length ?: 0", purpose: "Null safe access with fallback value." },
              { template: "val evens = numbers.filter { it % 2 == 0 }", purpose: "Filter collection items using lambda." }
            ],
            description: "Kotlin offers many advanced language features. See the <a href=\"https://kotlinlang.org/docs/basic-syntax.html\">official syntax reference</a>."
          }
        ]
      }
    ]
  }
};
