"""Serve one verified brand snapshot, refreshed from the canonical private repo."""
import base64
import json
import logging
import mimetypes
from pathlib import Path
import re
import subprocess
import threading
import time

ROOT = Path(__file__).resolve().parent
RESOURCE_PATHS = frozenset({
    "/brand/dialogue-logo.svg", "/brand/dialogue-logo.png",
    "/brand/dialogue-logomark-d.svg", "/brand/dialogue-logomark-d.png",
    "/favicon.svg", "/favicon.png", "/apple-touch-icon.png",
})
NESTED_ICONS = {
    f"/daily-check-in/emotions-live/public/{name}": f"/{name}"
    for name in ("favicon.svg", "favicon.png", "apple-touch-icon.png")
}


class BrandAssets:
    def __init__(self, root=ROOT):
        self.root = Path(root)
        self.config = json.loads((self.root / "brand/source.json").read_text())
        self._lock = threading.Lock()
        self._refresh_lock = threading.Lock()
        self._commit = self.config["bundledCommit"]
        self._resources = {
            path: (self.root / path.lstrip("/")).read_bytes()
            for path in RESOURCE_PATHS
        }
        self._checked_at = None
        self._error = None

    def refresh(self):
        with self._refresh_lock:
            try:
                result = subprocess.run(
                    ["node", str(self.root / "scripts/fetch-brand-assets.mjs"), self._commit],
                    capture_output=True, timeout=90, check=True, cwd=self.root,
                )
                data = json.loads(result.stdout)
                commit = data["commit"]
                if not re.fullmatch(r"[0-9a-f]{40}", commit):
                    raise ValueError("Invalid commit")
                resources = None
                if not data.get("unchanged"):
                    if set(data["resources"]) != RESOURCE_PATHS:
                        raise ValueError("Incomplete brand snapshot")
                    resources = {
                        path: base64.b64decode(value, validate=True)
                        for path, value in data["resources"].items()
                    }
                    if any(not value for value in resources.values()):
                        raise ValueError("Empty asset")
                elif commit != self._commit:
                    raise ValueError("Unexpected unchanged commit")
                with self._lock:
                    if resources is not None:
                        self._resources = resources
                    self._commit = commit
                    self._checked_at = int(time.time())
                    self._error = None
                return True
            except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
                with self._lock:
                    self._error = "Brand refresh failed; serving the last verified assets. Check GitHub integration access."
                logging.warning(self._error)
                return False

    def start(self):
        def poll():
            while True:
                self.refresh()
                time.sleep(300)
        threading.Thread(target=poll, name="brand-refresh", daemon=True).start()

    def status(self):
        with self._lock:
            return {
                "repository": self.config["repository"],
                "branch": self.config["branch"],
                "commit": self._commit,
                "lastSuccessfulCheck": self._checked_at,
                "refreshIntervalSeconds": 300,
                "state": "error" if self._error else ("current" if self._checked_at else "checking"),
                "error": self._error,
            }

    def serve(self, handler, path):
        path = NESTED_ICONS.get(path, path)
        with self._lock:
            body = self._resources.get(path)
            commit = self._commit
        if body is None:
            return False
        handler.send_response(200)
        handler.send_header("Content-Type", mimetypes.guess_type(path)[0] or "application/octet-stream")
        handler.send_header("Content-Length", str(len(body)))
        handler.send_header("X-Brand-Commit", commit)
        handler.send_header("Cache-Control", "no-cache, max-age=0, must-revalidate")
        handler.end_headers()
        if handler.command != "HEAD":
            handler.wfile.write(body)
        return True
