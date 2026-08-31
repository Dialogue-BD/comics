---
name: Replit Python user-site installs
description: How to recover when Python dependency installation targets Replit's immutable system interpreter.
---

This workspace's wrapped Python includes the project-local `.pythonlibs/lib/python3.13/site-packages` directory on `sys.path`. If the package helper fails with an externally managed environment error, install the already-declared requirement into that user-site target rather than creating a virtual environment or changing application imports.

**Why:** Replit's system Python is immutable, and a package helper may invoke its system `pip` even though the workflow loads project packages from `.pythonlibs`.

**How to apply:** Confirm the dependency is declared first, inspect Python's user-site path, then use the available package tooling to populate that exact project-local site-packages directory. Verify the import with the same `python` command used by the workflow.