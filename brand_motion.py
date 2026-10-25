"""Shared motion enhancement for static HTML; original source stays untouched."""
from pathlib import Path

MOTION_TAGS = (
    b'<link rel="stylesheet" href="/dialogue-brand-motion.css">\n'
    b'<script defer src="/dialogue-brand-motion.js"></script>\n'
)


def enhance_html(body):
    if b'src="/dialogue-brand-motion.js"' in body:
        return body
    # The script is deferred so every original page script retains its order.
    if b"</head>" in body:
        return body.replace(b"</head>", MOTION_TAGS + b"</head>", 1)
    return body


def motion_runtime(root):
    # The browser runtime is part of the app, not an install-only dependency.
    # Publishing must work even when node_modules is excluded from the snapshot.
    return Path(root) / "brand/vendor/lottie-light.min.js"
