---
name: create-pr
description: >-
  Create GitHub pull requests following conventional naming patterns, creating a
  branch if needed. Use when the user asks to create or open a PR, submit
  changes for review, or push work to GitHub.
---

# Create PR

## Workflow

1. **Check if already on a feature branch.** If the current branch is `main` or `master`, create and switch to a new branch:

```bash
git checkout -b <type>/<short-description>
```

If already on a non-default branch, use it as-is.

2. **Stage and commit changes** (follow repo conventions for commit messages).

3. **Push the branch:**

```bash
git push -u origin HEAD
```

4. **Create the PR:**

```bash
gh pr create --title "<type>(<scope>): <description>" --body "$(cat <<'EOF'
## Summary
<bullet points describing the changes>

EOF
)"
```

## Branch Naming

When creating a new branch, use the conventional format:

```
<type>/<short-description>
```

- **type**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`, `build`
- **short-description**: lowercase, words separated by hyphens, max ~50 chars

**Examples:**

```
feat/add-user-authentication
fix/resolve-login-redirect-loop
chore/upgrade-dependencies
docs/update-api-reference
refactor/extract-payment-service
```

## PR Title

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<optional-scope>): <description>
```

- **type**: same as branch types above
- **scope** (optional): module or area affected (e.g., `auth`, `ui`, `db`, `payments`)
- **description**: imperative mood, lowercase start, no period at end

**Examples:**

```
feat(auth): add magic link login flow
fix(payments): resolve webhook signature validation
chore: upgrade React to v19
docs(api): add rate limiting documentation
refactor(db): extract query builder utilities
```

## Inferring Type

Pick the type based on the nature of the changes:

| Change | Type |
|--------|------|
| New feature or capability | `feat` |
| Bug fix | `fix` |
| Maintenance, deps, config | `chore` |
| Documentation only | `docs` |
| Code restructure, no behavior change | `refactor` |
| Adding or updating tests | `test` |
| CI/CD pipeline changes | `ci` |
| Performance improvement | `perf` |
| Formatting, whitespace, semicolons | `style` |
| Build system or tooling | `build` |
