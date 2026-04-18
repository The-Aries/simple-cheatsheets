(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (!common.sharedFooter) {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "CHEATSHEET_COMMON.sharedFooter is unavailable";
    return;
  }

  var gitPlaceholders = [
    { key: "githubUsername", label: "githubUsername", defaultValue: "githubUsername", help: "Your GitHub username, usually visible on your profile page." },
    { key: "githubEmail", label: "githubEmail", defaultValue: "githubEmail", help: "Your GitHub login or commit email used for attribution." },
    { key: "localBranchName", label: "localBranchName", defaultValue: "localBranchName", help: "The branch name you use locally for active work." },
    { key: "remoteBranchName", label: "remoteBranchName", defaultValue: "remoteBranchName", help: "The branch name tracked on the remote repository." },
    { key: "remoteName", label: "remoteName", defaultValue: "remoteName", help: "The remote alias, usually origin." },
    { key: "repoUrl", label: "repoUrl", defaultValue: "repoUrl", help: "Repository URL copied from the GitHub repository page." }
  ];

  var gitSections = [
    {
      number: "1",
      title: "Setup and Repository",
      groups: [
        { number: "1", key: "config", title: "config", intro: "Set user identity and useful defaults before daily work.", rows: [
          { template: 'git config --global user.name "githubUsername"', purpose: "Set commit author name globally." },
          { template: 'git config --global user.email "githubEmail"', purpose: "Set commit email globally." },
          { template: 'git config --global init.defaultBranch "localBranchName"', purpose: "Set default branch name for new repositories." }
        ], description: { text: "global applies settings to all local repositories on this machine.", officialUrl: "https://git-scm.com/docs/git-config", officialLabel: "git-config documentation" } },
        { number: "2", key: "clone", title: "clone", intro: "Create a local repository from an existing remote source.", rows: [
          { template: 'git clone "repoUrl"', purpose: "Clone default branch to local machine." },
          { template: 'git clone -b "remoteBranchName" "repoUrl"', purpose: "Clone and checkout a specific remote branch." }
        ], description: { text: "Use -b when a non default branch is your starting point.", officialUrl: "https://git-scm.com/docs/git-clone", officialLabel: "git-clone documentation" } },
        { number: "3", key: "init", title: "init", intro: "Start Git tracking in an existing local directory.", rows: [
          { template: 'git init', purpose: "Initialize repository with default branch." },
          { template: 'git init -b "localBranchName"', purpose: "Initialize repository with explicit branch name." }
        ], description: { text: "Use explicit branch naming when your team standard differs from machine defaults.", officialUrl: "https://git-scm.com/docs/git-init", officialLabel: "git-init documentation" } },
        { number: "4", key: "remote", title: "remote", intro: "Attach, inspect, and update remote repository links.", rows: [
          { template: 'git remote add "remoteName" "repoUrl"', purpose: "Add a named remote to the local repository." },
          { template: 'git remote -v', purpose: "List configured remotes and URLs." }
        ], description: { text: "add creates the link and -v verifies it.", officialUrl: "https://git-scm.com/docs/git-remote", officialLabel: "git-remote documentation" } }
      ]
    },
    {
      number: "2",
      title: "Save and Sync",
      groups: [
        { number: "1", key: "add", title: "add", intro: "Move working tree changes into staging area.", rows: [
          { template: 'git add .', purpose: "Stage all changed files in current directory." },
          { template: 'git add "file.txt"', purpose: "Stage a specific file only." }
        ], description: { text: "Use targeted add for safer commits and full add for broad checkpoints.", officialUrl: "https://git-scm.com/docs/git-add", officialLabel: "git-add documentation" } },
        { number: "2", key: "commit", title: "commit", intro: "Record staged changes as a local history point.", rows: [
          { template: 'git commit -m "your message"', purpose: "Create commit with one line message." },
          { template: 'git commit --amend -m "updated message"', purpose: "Update most recent commit message or content." }
        ], description: { text: "Use amend before pushing when you need to refine the latest local commit.", officialUrl: "https://git-scm.com/docs/git-commit", officialLabel: "git-commit documentation" } },
        { number: "3", key: "fetch", title: "fetch", intro: "Download remote updates without changing working branch.", rows: [
          { template: 'git fetch', purpose: "Fetch from default remotes." },
          { template: 'git fetch "remoteName"', purpose: "Fetch from a specific remote explicitly." }
        ], description: { text: "Fetch first when you want review control before any merge or rebase.", officialUrl: "https://git-scm.com/docs/git-fetch", officialLabel: "git-fetch documentation" } },
        { number: "4", key: "pull", title: "pull", intro: "Fetch and integrate remote changes into current local branch.", rows: [
          { template: 'git pull', purpose: "Pull from tracked upstream branch." },
          { template: 'git pull "remoteName" "remoteBranchName"', purpose: "Pull a specific remote branch explicitly." }
        ], description: { text: "Explicit pull is safer in multi branch repositories.", officialUrl: "https://git-scm.com/docs/git-pull", officialLabel: "git-pull documentation" } },
        { number: "5", key: "push", title: "push", intro: "Publish local commits to the remote repository.", rows: [
          { template: 'git push', purpose: "Push to tracked upstream branch." },
          { template: 'git push "remoteName" "localBranchName":"remoteBranchName"', purpose: "Push local branch to an explicit remote branch." }
        ], description: { text: "Use explicit branch mapping when local and remote names differ.", officialUrl: "https://git-scm.com/docs/git-push", officialLabel: "git-push documentation" } }
      ]
    },
    {
      number: "3",
      title: "Branching",
      groups: [
        { number: "1", key: "branch", title: "branch", intro: "Create and inspect branch references.", rows: [
          { template: 'git branch "localBranchName"', purpose: "Create a new local branch." },
          { template: 'git branch -a', purpose: "List local and remote branches." }
        ], description: { text: "Use branch listing before switching to avoid mistakes in similar names.", officialUrl: "https://git-scm.com/docs/git-branch", officialLabel: "git-branch documentation" } },
        { number: "2", key: "switch", title: "switch", intro: "Move between branches using modern command syntax.", rows: [
          { template: 'git switch "localBranchName"', purpose: "Switch to an existing local branch." },
          { template: 'git switch -c "localBranchName"', purpose: "Create and switch in one command." }
        ], description: { text: "Prefer switch for clarity when branch movement is your only action.", officialUrl: "https://git-scm.com/docs/git-switch", officialLabel: "git-switch documentation" } },
        { number: "3", key: "checkout", title: "checkout", intro: "Use legacy checkout flows for branch and file operations.", rows: [
          { template: 'git checkout "localBranchName"', purpose: "Switch to an existing branch." },
          { template: 'git checkout -b "localBranchName"', purpose: "Create and switch branch in one step." }
        ], description: { text: "Checkout remains useful for older scripts and mixed workflows.", officialUrl: "https://git-scm.com/docs/git-checkout", officialLabel: "git-checkout documentation" } }
      ]
    },
    {
      number: "4",
      title: "Inspect",
      groups: [
        { number: "1", key: "status", title: "status", intro: "Get quick visibility into local repository state.", rows: [
          { template: 'git status', purpose: "Show staged, unstaged, and untracked files." },
          { template: 'git status -sb', purpose: "Show compact branch aware summary." }
        ], description: { text: "Compact status helps when you need branch and change snapshots quickly.", officialUrl: "https://git-scm.com/docs/git-status", officialLabel: "git-status documentation" } },
        { number: "2", key: "diff", title: "diff", intro: "Inspect exact code differences before and after staging.", rows: [
          { template: 'git diff', purpose: "Show unstaged working tree changes." },
          { template: 'git diff --staged', purpose: "Show staged changes ready to commit." }
        ], description: { text: "Switch between unstaged and staged diffs to verify final commit content.", officialUrl: "https://git-scm.com/docs/git-diff", officialLabel: "git-diff documentation" } },
        { number: "3", key: "log", title: "log", intro: "Read commit history for recent activity and branch context.", rows: [
          { template: 'git log --oneline', purpose: "Show compact commit timeline." },
          { template: 'git log --oneline --graph --decorate', purpose: "Show branch graph and decorations." }
        ], description: { text: "Use graph view when merges make linear history harder to read.", officialUrl: "https://git-scm.com/docs/git-log", officialLabel: "git-log documentation" } }
      ]
    },
    {
      number: "5",
      title: "Fix and Integrate",
      groups: [
        { number: "1", key: "restore", title: "restore", intro: "Revert local file changes safely in working tree.", rows: [
          { template: 'git restore "file.txt"', purpose: "Restore one file from current HEAD." },
          { template: 'git restore .', purpose: "Restore all unstaged file changes." }
        ], description: { text: "Use targeted restore first; full restore is faster but riskier in mixed working trees.", officialUrl: "https://git-scm.com/docs/git-restore", officialLabel: "git-restore documentation" } },
        { number: "2", key: "reset", title: "reset", intro: "Move branch pointers while controlling staging behavior.", rows: [
          { template: 'git reset --soft HEAD~1', purpose: "Undo commit but keep changes staged." },
          { template: 'git reset --hard HEAD~1', purpose: "Discard commit and working tree changes." }
        ], description: { text: "Prefer soft reset for recoverable cleanup; hard reset is destructive.", officialUrl: "https://git-scm.com/docs/git-reset", officialLabel: "git-reset documentation" } },
        { number: "3", key: "merge", title: "merge", intro: "Integrate work from one branch into another branch.", rows: [
          { template: 'git merge "localBranchName"', purpose: "Merge local branch into current branch." },
          { template: 'git merge --no-ff "localBranchName"', purpose: "Keep explicit merge commit for traceability." }
        ], description: { text: "Use --no-ff when you want branch level history to remain visible.", officialUrl: "https://git-scm.com/docs/git-merge", officialLabel: "git-merge documentation" } }
      ]
    }
  ];

  var gitTestPage = {
    slug: "git-test",
    meta: { title: "Git Test Cheatsheet - Simple Cheatsheets", lang: "zh-CN" },
    layout: { hasSidebar: true },
    placeholders: { fields: gitPlaceholders },
    blocks: [
      { type: "pageHeader", id: "page-header", title: "Git Cheatsheet", descriptionTitle: "Description", lead: "This page is a practical cheatsheet for common Git commands. You can fill your placeholders, apply them, and copy commands with your own values. It is not a full Git tutorial. For deeper learning, see the official Git documentation." },
      { type: "placeholderForm", id: "placeholders", headingId: "values-title", title: "Placeholders", intro: "Set once, apply to command lines, then copy ready to run commands.", fields: gitPlaceholders },
      { type: "concepts", id: "key-concepts", title: "Key Concepts", items: [
        "Local repo lives on your machine. Remote repo lives on GitHub.",
        "Git keeps local and remote repositories synchronized in both directions.",
        "Branch is a work line, remote is the linked server target, and sync covers fetch, pull, and push.",
        "These placeholders customize identity, branch names, remote alias, and repository location in command examples."
      ] },
      { type: "workflow", id: "workflow-overview", title: "Workflow Overview", description: "A common Git workflow usually starts with setup, then daily local to remote sync, then branch work, inspection, and integration. The sections below are arranged in that typical usage order, with local and remote repository synchronization as the main thread.", cards: [
        { title: "Setup and Repository", text: "Set identity and connect local repo to remote repo." },
        { title: "Save and Sync", text: "Stage, commit, fetch, pull, and push as the daily sync loop." },
        { title: "Branching", text: "Create and switch branches to isolate work safely." },
        { title: "Inspect", text: "Use status, diff, and log to verify current state." },
        { title: "Fix and Integrate", text: "Restore, reset, and merge to fix and finalize." }
      ] },
      { type: "sectionGroups", sections: gitSections }
    ],
    footer: common.sharedFooter
  };

  window.CHEATSHEET_PAGE_DATA = gitTestPage;
})();
