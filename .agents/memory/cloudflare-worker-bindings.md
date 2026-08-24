---
name: Cloudflare worker binding types
description: The type package’s current namespace shape for project-specific worker bindings.
---

Declare project bindings by augmenting `Cloudflare.Env`, rather than a global `Env` interface.

**Why:** Current `@cloudflare/workers-types` exposes the imported `env` value as `Cloudflare.Env`; a global `Env` declaration does not merge into that namespace.

**How to apply:** When adding or changing a Worker binding, update the project’s binding declaration and run TypeScript validation to confirm imports from `cloudflare:workers` see it.