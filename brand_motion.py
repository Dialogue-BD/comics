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
    return Path(root) / "node_modules/lottie-web/build/player/lottie_light.min.js"
