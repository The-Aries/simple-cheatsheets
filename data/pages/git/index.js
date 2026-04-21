(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var common = cheatsheet.common || {};
  if (!common.footer) {
    cheatsheet.pageLoadError = "CHEATSHEET.common.footer is unavailable";
    window.CHEATSHEET_PAGE_LOAD_ERROR = "CHEATSHEET.common.footer is unavailable";
    return;
  }

  function makePlaceholder(key, label, defaultValue, help) {
    return {
      key: key,
      label: label,
      defaultValue: defaultValue,
      help: help
    };
  }

  function makeGroup(number, key, title, intro, rows, text, officialUrl) {
    return {
      number: String(number),
      key: key,
      title: title,
      intro: intro,
      rows: rows,
      description: {
        text: text,
        officialUrl: officialUrl
      }
    };
  }

  function makeSection(number, title, groups) {
    return {
      number: String(number),
      title: title,
      groups: groups
    };
  }

  function makeCard(title, text) {
    return {
      title: title,
      text: text
    };
  }

  var gitPlaceholders = [
    makePlaceholder("gitUserName", "Git User Name", "gitUserName", "The author name written into commits."),
    makePlaceholder("gitUserEmail", "Git User Email", "gitUserEmail", "The email address written into commits."),
    makePlaceholder("localBranchName", "Local Branch Name", "localBranchName", "The branch name you use locally for active work."),
    makePlaceholder("remoteBranchName", "Remote Branch Name", "remoteBranchName", "The branch name tracked on the remote repository."),
    makePlaceholder("remoteName", "Remote Name", "remoteName", "The remote alias, usually origin."),
    makePlaceholder("repoUrl", "Repository URL", "repoUrl", "The remote repository URL used for clone and remote setup.")
  ];

  var gitSections = [
    makeSection("1", "Setup And Repository", [
      makeGroup(
        1,
        "config",
        "git config",
        "Set user identity and local defaults before you start committing.",
        [
          { template: 'git config --global user.name "gitUserName"', purpose: "Set the commit author name globally." },
          { template: 'git config --global user.email "gitUserEmail"', purpose: "Set the commit email globally." },
          { template: 'git config --global init.defaultBranch "localBranchName"', purpose: "Set the default branch name for new repositories." }
        ],
        "Configure author identity and machine-wide Git defaults before daily work begins. Use it once per machine or whenever the local defaults need to change.",
        "https://git-scm.com/docs/git-config"
      ),
      makeGroup(
        2,
        "clone",
        "git clone",
        "Create a local copy of an existing remote repository.",
        [
          { template: 'git clone "repoUrl"', purpose: "Clone the default branch to the local machine." },
          { template: 'git clone -b "remoteBranchName" "repoUrl"', purpose: "Clone and checkout a specific remote branch." }
        ],
        "Create a local checkout from a shared remote when you need the full history on disk. Use it when you are starting from existing work instead of creating a fresh repository.",
        "https://git-scm.com/docs/git-clone"
      ),
      makeGroup(
        3,
        "init",
        "git init",
        "Create a new local repository inside an existing folder.",
        [
          { template: "git init", purpose: "Initialize a repository with the current default branch." },
          { template: 'git init -b "localBranchName"', purpose: "Initialize a repository with an explicit branch name." }
        ],
        "Start Git tracking in a folder that already exists on disk. Use it when the project begins locally instead of from a remote clone.",
        "https://git-scm.com/docs/git-init"
      ),
      makeGroup(
        4,
        "remote",
        "git remote",
        "Attach, inspect, and update named remote URLs.",
        [
          { template: 'git remote add "remoteName" "repoUrl"', purpose: "Add a named remote to the local repository." },
          { template: "git remote -v", purpose: "List configured remotes and URLs." }
        ],
        "Bind a local repository to a named remote target so fetch, pull, and push know where to go. Use it whenever you need to review or change the remote relationship.",
        "https://git-scm.com/docs/git-remote"
      )
    ]),
    makeSection("2", "Save And Sync", [
      makeGroup(
        1,
        "add",
        "git add",
        "Move selected changes into the staging area.",
        [
          { template: "git add .", purpose: "Stage all changed files in the current directory." },
          { template: 'git add "file.txt"', purpose: "Stage a specific file only." }
        ],
        "Prepare the next commit by choosing exactly which changes should land together. Use targeted staging when you want a safer commit shape and broad staging when you are ready to checkpoint everything.",
        "https://git-scm.com/docs/git-add"
      ),
      makeGroup(
        2,
        "commit",
        "git commit",
        "Record staged changes as one history point.",
        [
          { template: 'git commit -m "your message"', purpose: "Create a commit with a one-line message." },
          { template: 'git commit --amend -m "updated message"', purpose: "Update the most recent commit message or content." }
        ],
        "Turn staged work into a permanent local snapshot. Use amend only while you are still refining the latest commit before you publish it.",
        "https://git-scm.com/docs/git-commit"
      ),
      makeGroup(
        3,
        "fetch",
        "git fetch",
        "Download remote refs and objects without changing the current branch.",
        [
          { template: "git fetch", purpose: "Fetch from the default remotes." },
          { template: 'git fetch "remoteName"', purpose: "Fetch from a specific remote explicitly." }
        ],
        "Inspect incoming work before you merge or rebase it locally. Use fetch when you want to see the remote state without touching the working branch.",
        "https://git-scm.com/docs/git-fetch"
      ),
      makeGroup(
        4,
        "pull",
        "git pull",
        "Fetch remote changes and integrate them into the current branch.",
        [
          { template: "git pull", purpose: "Pull from the tracked upstream branch." },
          { template: 'git pull "remoteName" "remoteBranchName"', purpose: "Pull a specific remote branch explicitly." }
        ],
        "Update the current branch from the tracked upstream in one step. Use it when you are ready to bring remote changes into the local branch.",
        "https://git-scm.com/docs/git-pull"
      ),
      makeGroup(
        5,
        "push",
        "git push",
        "Publish local commits to the tracked remote branch.",
        [
          { template: "git push", purpose: "Push to the tracked upstream branch." },
          { template: 'git push "remoteName" "localBranchName":"remoteBranchName"', purpose: "Push a local branch to an explicit remote branch." }
        ],
        "Send finished local history to the remote repository. Use explicit branch mapping when the local and remote names differ.",
        "https://git-scm.com/docs/git-push"
      )
    ]),
    makeSection("3", "Branching", [
      makeGroup(
        1,
        "branch",
        "git branch",
        "Create or list branch references.",
        [
          { template: 'git branch "localBranchName"', purpose: "Create a new local branch." },
          { template: "git branch -a", purpose: "List local and remote branches." }
        ],
        "Inspect available branch lines before you switch, rename, or merge. Use it when you want a quick view of what exists locally and remotely.",
        "https://git-scm.com/docs/git-branch"
      ),
      makeGroup(
        2,
        "switch",
        "git switch",
        "Move between branches with branch-focused syntax.",
        [
          { template: 'git switch "localBranchName"', purpose: "Switch to an existing local branch." },
          { template: 'git switch -c "localBranchName"', purpose: "Create and switch in one command." }
        ],
        "Move between branches without the file-centric side effects of older checkout flows. Use it when branch movement is the only thing you need.",
        "https://git-scm.com/docs/git-switch"
      ),
      makeGroup(
        3,
        "checkout",
        "git checkout",
        "Use legacy checkout flows for mixed branch and file operations.",
        [
          { template: 'git checkout "localBranchName"', purpose: "Switch to an existing branch." },
          { template: 'git checkout -b "localBranchName"', purpose: "Create and switch to a branch in one step." }
        ],
        "Keep this around for older scripts or when you still need the legacy branch-and-file behavior. Use it only when switch does not cover the workflow you need.",
        "https://git-scm.com/docs/git-checkout"
      )
    ]),
    makeSection("4", "Inspect", [
      makeGroup(
        1,
        "status",
        "git status",
        "Show tracked, staged, and untracked changes in the working tree.",
        [
          { template: "git status", purpose: "Show staged, unstaged, and untracked files." },
          { template: "git status -sb", purpose: "Show a compact branch-aware summary." }
        ],
        "Check the working tree before you commit, switch, or clean up. Use it as the quick health check for the current repository state.",
        "https://git-scm.com/docs/git-status"
      ),
      makeGroup(
        2,
        "diff",
        "git diff",
        "Compare working tree or staged changes against the previous snapshot.",
        [
          { template: "git diff", purpose: "Show unstaged working tree changes." },
          { template: "git diff --staged", purpose: "Show staged changes ready to commit." }
        ],
        "Inspect exact file changes before you decide what should land in the next commit. Use it to verify the final diff instead of relying on memory.",
        "https://git-scm.com/docs/git-diff"
      ),
      makeGroup(
        3,
        "log",
        "git log",
        "Read recent commit history and branch structure.",
        [
          { template: "git log --oneline", purpose: "Show a compact commit timeline." },
          { template: "git log --oneline --graph --decorate", purpose: "Show branch graph and decorations." }
        ],
        "Review recent commits when you need a compact timeline or a branch-merge view. Use it to understand how the current history was built.",
        "https://git-scm.com/docs/git-log"
      )
    ]),
    makeSection("5", "Fix And Integrate", [
      makeGroup(
        1,
        "restore",
        "git restore",
        "Discard local file changes from the working tree or index.",
        [
          { template: 'git restore "file.txt"', purpose: "Restore one file from the current HEAD." },
          { template: "git restore .", purpose: "Restore all unstaged file changes." }
        ],
        "Recover a file without rewriting history when local edits should be dropped. Use the targeted form first and reach for the broad form only when you are sure.",
        "https://git-scm.com/docs/git-restore"
      ),
      makeGroup(
        2,
        "reset",
        "git reset",
        "Move branch or index state backward with explicit staging control.",
        [
          { template: "git reset --soft HEAD~1", purpose: "Undo the commit but keep changes staged." },
          { template: "git reset --hard HEAD~1", purpose: "Discard the commit and working tree changes." }
        ],
        "Step branch state backward when you need to rework recent history. Use soft reset when you want the changes to stay recoverable and hard reset only when you mean to discard them.",
        "https://git-scm.com/docs/git-reset"
      ),
      makeGroup(
        3,
        "merge",
        "git merge",
        "Integrate another branch into the current branch.",
        [
          { template: 'git merge "localBranchName"', purpose: "Merge a local branch into the current branch." },
          { template: 'git merge --no-ff "localBranchName"', purpose: "Keep the merge commit visible in history." }
        ],
        "Bring another line of work into the current branch and decide whether the merge point should remain visible. Use no-ff when the merge commit itself matters for history.",
        "https://git-scm.com/docs/git-merge"
      )
    ])
  ];

  var gitPage = {
    slug: "git",
    meta: {
      title: "Git Cheatsheet - Simple Cheatsheets",
      lang: "zh-CN"
    },
    layout: {
      hasSidebar: true
    },
    extensions: {
      styles: ["data/pages/git/styles.css"]
    },
    placeholders: {
      fields: gitPlaceholders
    },
    blocks: [
      {
        type: "pageHeader",
        id: "page-header",
        title: "Git Cheatsheet",
        descriptionTitle: "Description",
        lead: "This page is a practical cheatsheet for common Git commands. You can fill your placeholders, apply them, and copy commands with your own values. It is not a full Git tutorial."
      },
      {
        type: "note",
        id: "official-references",
        title: "Official References",
        text: "Use the official Git documentation as the entry point. Each command section below links to the exact command reference.",
        links: [
          { label: "Git official docs", href: "https://git-scm.com/docs" }
        ]
      },
      {
        type: "placeholderForm",
        id: "placeholders",
        headingId: "values-title",
        title: "Placeholders",
        intro: "Set once, apply to command lines, then copy ready-to-run commands."
      },
      {
        type: "concepts",
        id: "key-concepts",
        title: "Key Concepts",
        items: [
          "Local repos live on your machine, while remote repos can live on GitHub, GitLab, Bitbucket, or any other Git host.",
          "Git keeps local and remote repositories synchronized in both directions.",
          "A branch is a line of work, a remote is the linked server target, and sync covers fetch, pull, and push.",
          "These placeholders customize identity, branch names, remote aliases, and repository location in command examples."
        ]
      },
      {
        type: "workflow",
        id: "workflow-overview",
        title: "Workflow Overview",
        description: "A Git workflow usually starts with setup, then moves through save and sync, branching, inspection, and integration. The sections below follow that path from identity setup to branch cleanup.",
        cards: [
          makeCard("Setup And Repository", "Set identity and connect a local repo to its remote."),
          makeCard("Save And Sync", "Stage, commit, fetch, pull, and push as the daily sync loop."),
          makeCard("Branching", "Create and switch branches to isolate work safely."),
          makeCard("Inspect", "Use status, diff, and log to verify current state."),
          makeCard("Fix And Integrate", "Restore, reset, and merge to fix and finalize.")
        ]
      },
      {
        type: "sectionGroups",
        sections: gitSections
      }
    ],
    footer: common.footer
  };

  cheatsheet.pageData = gitPage;
  cheatsheet.page = gitPage;
  window.CHEATSHEET_PAGE_DATA = gitPage;
  window.CHEATSHEET_PAGE = gitPage;
})();
