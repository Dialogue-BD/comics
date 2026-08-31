---
name: Replit Python dependencies
description: How local and published Python dependencies must avoid Replit's immutable system interpreter.
---

This workspace's wrapped Python includes the project-local `.pythonlibs/lib/python3.13/site-packages` directory on `sys.path`. Local dependency recovery can target that user-site path. Published dependencies must be declared through Nix when a requirements manifest would make the publish builder invoke pip against immutable system Python.

**Why:** Replit's system Python is immutable. Local workflows can load `.pythonlibs`, but that directory is not the durable declaration used to assemble a fresh publish image.

**How to apply:** For local recovery, populate the configured user-site path and verify with the workflow's `python`. For publishing, declare the matching Nix package and avoid a pip manifest that reproduces the externally managed environment failure.