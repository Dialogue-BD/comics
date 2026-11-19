"""Site-wide Google Analytics 4 (GA4) snippet injection helper."""

from __future__ import annotations

import os
import re
from typing import Mapping

GA_ID_RE = re.compile(r"^G-[A-Z0-9]{6,20}$")
PLACEHOLDER_GA_RE = re.compile(r"^G-X+$")
HEAD_CLOSE_RE = re.compile(rb"</head>", re.IGNORECASE)
BODY_CLOSE_RE = re.compile(rb"</body>", re.IGNORECASE)


def get_measurement_id(env: Mapping[str, str] | None = None) -> str:
    """Return a validated GA4 Measurement ID from environment variables, or ''."""
    source = os.environ if env is None else env
    raw = (source.get("GA_MEASUREMENT_ID") or source.get("GOOGLE_ANALYTICS_ID") or "").strip().upper()
    if not raw or not GA_ID_RE.fullmatch(raw) or PLACEHOLDER_GA_RE.fullmatch(raw):
        return ""
    return raw


def build_gtag_snippet(measurement_id: str) -> bytes:
    """Build the official Google tag (gtag.js) HTML snippet as UTF-8 bytes."""
    mid = get_measurement_id({"GA_MEASUREMENT_ID": measurement_id})
    if not mid:
        return b""
    return (
        "<!-- Google tag (gtag.js) -->\n"
        f'<script async src="https://www.googletagmanager.com/gtag/js?id={mid}"></script>\n'
        "<script>\n"
        "  window.dataLayer = window.dataLayer || [];\n"
        "  function gtag(){dataLayer.push(arguments);}\n"
        "  gtag('js', new Date());\n"
        f"  gtag('config', '{mid}');\n"
        "</script>"
    ).encode("utf-8")


def inject_ga_html(body: bytes, measurement_id: str) -> bytes:
    """Inject the GA4 gtag.js snippet into HTML bytes once before </head>."""
    snippet = build_gtag_snippet(measurement_id)
    if not snippet or b"googletagmanager.com/gtag/js" in body.lower():
        return body

    updated, count = HEAD_CLOSE_RE.subn(lambda m: snippet + b"\n" + m.group(0), body, count=1)
    if count:
        return updated

    updated, count = BODY_CLOSE_RE.subn(lambda m: snippet + b"\n" + m.group(0), body, count=1)
    if count:
        return updated

    return body + b"\n" + snippet


def analytics_status(env: Mapping[str, str] | None = None) -> dict:
    """Return analytics readiness metadata for /api/health."""
    mid = get_measurement_id(env)
    return {
        "enabled": bool(mid),
        "provider": "ga4" if mid else None,
        "measurementId": mid or None,
    }
