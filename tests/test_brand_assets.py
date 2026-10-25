import base64
from io import BytesIO
import json
from pathlib import Path
from types import SimpleNamespace
import subprocess
import unittest
from unittest.mock import patch

from brand_assets import BrandAssets, RESOURCE_PATHS


class Handler:
    command = "GET"

    def __init__(self):
        self.wfile = BytesIO()
        self.headers = {}

    def send_response(self, value):
        self.code = value

    def send_header(self, name, value):
        self.headers[name] = value

    def end_headers(self):
        pass


class BrandTests(unittest.TestCase):
    def setUp(self):
        self.brand = BrandAssets()

    def run_refresh(self, data):
        result = SimpleNamespace(stdout=json.dumps(data).encode())
        with patch("brand_assets.subprocess.run", return_value=result):
            return self.brand.refresh()

    def test_unchanged_refresh_reports_verified_commit(self):
        self.assertTrue(self.run_refresh({"commit": self.brand._commit, "unchanged": True}))
        self.assertEqual(self.brand.status()["state"], "current")

    def test_atomic_update_and_nested_icon_alias(self):
        resources = {
            path: base64.b64encode(path.encode()).decode() for path in RESOURCE_PATHS
        }
        self.assertTrue(self.run_refresh({"commit": "b" * 40, "resources": resources}))
        handler = Handler()
        self.assertTrue(self.brand.serve(handler, "/daily-check-in/emotions-live/public/favicon.svg"))
        self.assertEqual(handler.wfile.getvalue(), b"/favicon.svg")
        self.assertEqual(handler.headers["X-Brand-Commit"], "b" * 40)
        self.assertIn("no-cache", handler.headers["Cache-Control"])

    def test_partial_update_does_not_replace_working_assets(self):
        before = dict(self.brand._resources)
        self.assertFalse(self.run_refresh({"commit": "b" * 40, "resources": {}}))
        self.assertEqual(self.brand._resources, before)
        self.assertEqual(self.brand.status()["state"], "error")

    def test_network_error_preserves_last_verified_snapshot(self):
        before = self.brand._commit
        with patch("brand_assets.subprocess.run", side_effect=subprocess.TimeoutExpired("node", 90)):
            self.assertFalse(self.brand.refresh())
        self.assertEqual(self.brand._commit, before)
        self.assertTrue(self.brand.status()["error"])

    def test_unrelated_paths_not_intercepted(self):
        self.assertFalse(self.brand.serve(Handler(), "/lost-son/"))

    def test_head_request_has_no_body(self):
        handler = Handler()
        handler.command = "HEAD"
        self.assertTrue(self.brand.serve(handler, "/favicon.svg"))
        self.assertEqual(handler.wfile.getvalue(), b"")


if __name__ == "__main__":
    unittest.main()
