# Dependency security

The Next.js and Cloudflare dependencies are updated to patched releases.
Overrides pin fixes for transitive dependencies whose parents still allow or
pin older releases. Both npm and pnpm override configurations must be kept in
sync; `package-lock.json` remains the committed npm lockfile.

## Braces depth-guard backport

Upstream `braces` 3.0.3 has no patched release for GHSA-vfj7-8cjw-p6xm.
The `braces` override uses `@dieub/braces-depth-guard` 3.0.3-pn.0, a
MIT-licensed derivative of upstream 3.0.3 that backports the depth guards from
[upstream pull request 72](https://github.com/micromatch/braces/pull/72).
It keeps the API used by micromatch and fast-glob.

This is not a rename-only remediation. The replacement's parser bounds brace
and parenthesis nesting to 100 levels; its compile, expand, and stringify
walkers also bound AST traversal. Regression tests exercise the installed
replacement, nested-input rejection, caller-supplied deep ASTs, ordinary
expansion, and fast-glob compatibility.

The bootstrap release does not claim GitHub OIDC provenance. Its guard addresses
the reported stack-exhaustion issue, not arbitrary malformed ASTs, cyclic parent
links, or unrestricted expansion cardinality. A clean dependency scan alone is
not evidence of those additional protections. Replace the alias with an
upstream patched release when one becomes available.

## Checks

Run `npm test`, `npm run lint`, and `tsc --noEmit --incremental false` in this
directory after dependency changes, plus a fresh dependency audit. The test suite
checks all instances of the affected packages in the npm lockfile, not just
top-level versions.
