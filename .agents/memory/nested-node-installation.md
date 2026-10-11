---
name: Nested Node package installation
description: Package-install callback limitations for nested applications with a pnpm workspace.
---

The language-package installation callback has no working-directory parameter, rejects package-manager flags such as `--prefix`, and requires a nonempty package list.

**Why:** Attempts to target a nested application through the callback failed at argument validation, before any package installation.

**How to apply:** For an existing nested pnpm workspace, use the package-management skill's shell exception and run pnpm in that directory. If npm's lockfile remains authoritative, regenerate it with `npm install --package-lock-only --ignore-scripts` and ensure both managers' overrides agree. pnpm override selectors support one parent/child separator, not arbitrarily nested chains.
