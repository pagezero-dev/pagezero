---
name: pagezero-upgrade
description: >-
  Upgrade a PageZERO-based project to the latest starter while keeping
  project-specific business logic and marketing content. Invoke only via
  /pagezero-upgrade; do not apply from ambient context.
disable-model-invocation: true
---

# PageZERO Upgrade

The project is based on the PageZERO starter. Run the official upgrade CLI (it overwrites files), then reconcile from a pre-upgrade snapshot.

If some `./apps/*` are not used by this project, don't bring them from `pagezero`. If there is some marketing content specific to this project, leave it. If there is business logic specific to this project, leave it.

Do not assume a local starter checkout or a fixed PageZERO layout. Discover what belongs to this project from `PRE_HEAD` and `git diff`.

## Hard rules

- Do **not** add starter modules this project did not already use.
- Do **not** run `bun run setup:wrangler` (resets live D1 IDs and related vars).
- Do **not** apply migrations that belong only to dropped modules.
- Do **not** commit `.env` or `.env.test`.
- Do **not** commit unless the user asks.

## Workflow

```
- [ ] 1. Clean tree; branch off main if needed (`chore/pagezero-upgrade`)
- [ ] 2. Snapshot PRE_HEAD and project identity
- [ ] 3. bunx pagezero@latest upgrade -y
- [ ] 4. Classify every change
- [ ] 5. Restore / drop starter / drop site / merge
- [ ] 6. bun install, generate:types, check, test, test:e2e
- [ ] 7. Summarize
```

### Snapshot

`PRE_HEAD=$(git rev-parse HEAD)`. Record (no secrets):

- Directories under `apps/` (used modules). Ignore root route/entry files.
- `wrangler.json` identity: worker name, D1 names/IDs, project-specific env vars
- `package.json` deps this project's code actually imports
- Project-specific `AGENTS.md` rules and extra skills
- Env **key names** this project already uses

Working tree must be clean. Confirm `wrangler.json` exists and `rsync` is available.

### Upgrade

```bash
bunx pagezero@latest upgrade -y
```

If it fails, stop. Site-only files the CLI does not delete should still be present; overwritten files need classification.

### Classify

For each path in `git status` / `git diff "$PRE_HEAD"`:

| Class            | When                                                                                                        | Action                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **KEEP_STARTER** | Shared infra/tooling the project did not customize                                                          | Leave the upgraded file                                                       |
| **RESTORE_SITE** | Copy, branding, assets, live config, unique site features                                                   | `git restore --source=$PRE_HEAD -- <path>`                                    |
| **DROP_STARTER** | New starter module (and its routes, deps, schema, env, tests) this project did not use                      | Delete; do not register                                                       |
| **DROP_SITE**    | Path from `PRE_HEAD` that was leftover starter structure; the new starter removed or replaced that approach | Delete (do not restore). Port unique project logic to the new location if any |
| **MERGE**        | Starter mechanics and project logic in the same file                                                        | Two-way merge                                                                 |

When unsure between KEEP_STARTER and MERGE: **MERGE**. When unsure between DROP_SITE and RESTORE_SITE: **RESTORE_SITE**. Never KEEP_STARTER or DROP_SITE a file whose only real differences are this project's copy, URLs, branding, IDs, or product behavior.

Inspect with `git diff "$PRE_HEAD" -- <path>`:

- Only versions, types, or imports → KEEP_STARTER (MERGE if the project also had extra imports)
- Copy, URLs, IDs, or product behavior → RESTORE_SITE or MERGE
- New file under an unused app → DROP_STARTER
- New shared tooling/shell → KEEP_STARTER
- Gone after upgrade, and it was unique product → RESTORE_SITE
- Gone after upgrade, or still present but unused, and it was old starter layout the new tree no longer uses → DROP_SITE
- Customization still needed but the starter moved the seam → MERGE into the new path, then DROP_SITE the old path

Placeholder starter copy left unchanged in `PRE_HEAD` can KEEP_STARTER. The CLI may not delete files the starter dropped — also scan `PRE_HEAD` paths that the upgrade never touched.

### Restore, drop, merge

**Restore** overwritten product files. If restore would throw away a starter API change in that same file, MERGE instead.

**Drop starter** every `apps/<name>/` the upgrade added that was not in the snapshot, unless the user asked to adopt it. Also drop that module's routes, deps, schema/migrations, env keys, config, sample content, and e2e. Keep shared shell that every PageZERO app needs (app entry, router, core styles, and similar).

**Drop site** obsolete project paths that only existed because an older starter put them there. Do not resurrect files the new starter deleted unless they hold unique product logic. After dropping, remove dangling imports, routes, and tests.

**Merge** by comparing `$PRE_HEAD` with the working tree. Take starter mechanical changes (APIs, types, scripts, tooling, dependency versions). Keep this project's values and behavior. Typical merge surfaces: package manifest/lockfile, route table, wrangler identity vs new structural keys, Vite/test config, app config, `AGENTS.md`, env templates, schema barrels, CI. After merging `package.json`, regenerate the lockfile with `bun install`. Do not add deps, env, or config for dropped modules.

### Verify

```bash
bun install
bun run generate:types
bun run check:fix
bun run check
bun run test
bun run test:e2e
```

Run `db:generate` only if a **kept** feature schema changed. Fix leftover imports from dropped modules and tests that now assert starter placeholder copy or unused-module flows. Use local Playwright (`test:e2e`), not deployed smoke. Do not open a PR unless asked.

### Summarize

Unused starter apps dropped, obsolete site paths dropped, files restored, files merged (starter vs project), remaining risks.
