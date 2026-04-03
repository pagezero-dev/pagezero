---
name: merge-pr
description: >-
  Squash-merge the open pull request for the current branch and clean up the
  branch, only when that PR exists and all checks pass. Use when the user asks
  to merge a PR, finish a PR, land a PR, or complete a pull request from the
  branch they are on. Never ask for a PR number; the skill applies only to the
  PR tied to the checked-out branch.
---

# Merge PR

Work **only** with the pull request for the **current branch**. Do not ask for a PR number and do not pass a PR number to `gh` commands—`gh pr view`, `gh pr checks`, and `gh pr merge` all resolve the PR from the branch when run without arguments.

Do **not** run `gh pr merge` until the prerequisites below succeed. If any step fails, stop and explain what is missing (no PR for this branch, not open, failing or pending checks).

## Prerequisites

### 1. Open PR for the current branch

```bash
gh pr view --json number,state,url,title
```

- If this errors or `state` is not `OPEN`, do not merge. The branch must have an **open** pull request (create or reopen a PR, or checkout the correct branch).

### 2. All checks passing

```bash
gh pr checks
```

- Exit code **0**: checks are successful; you may merge.
- Exit code **8**: checks still **pending** — do not merge; use `gh pr checks --watch` until finished, then re-verify.
- Any other non-zero exit: checks **failed** or errored — do not merge; point the user to the PR URL for details.

Use `gh pr checks --required` if you only care about required status checks.

## Workflow

After prerequisites pass:

1. **Merge** (PR for the current branch):

```bash
gh pr merge --squash --delete-branch
```

2. **Switch back to main and pull latest:**

```bash
git checkout main && git pull
```
