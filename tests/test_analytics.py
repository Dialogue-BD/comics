import gzip
from io import BytesIO
import json
import os
import tempfile
import unittest
from unittest.mock import patch

import analytics
import server


class _UnclosableBytesIO(BytesIO):
    """BytesIO whose close() is a no-op so handler responses remain readable."""

    def close(self) -> None:
        self.flush()


class _MockSocket:
    """Minimal socket adapter for driving server.Handler in-process."""

    def __init__(self, raw_request: bytes) -> None:
        self._rfile = BytesIO(raw_request)
        self.wfile = _UnclosableBytesIO()

    def makefile(self, mode: str, *args, **kwargs):
        if "r" in mode:
            return self._rfile
        return self.wfile

    def sendall(self, data: bytes) -> None:
        self.wfile.write(data)


class _DummyServer:
    server_name = "localhost"
    server_port = 5000


def _dispatch(method: str, path: str, headers: dict[str, str] | None = None):
    lines = [f"{method} {path} HTTP/1.1", "Host: localhost"]
    for key, val in (headers or {}).items():
        lines.append(f"{key}: {val}")
    raw_req = ("\r\n".join(lines) + "\r\n\r\n").encode("utf-8")
    sock = _MockSocket(raw_req)
    server.Handler(sock, ("127.0.0.1", 54321), _DummyServer())
    raw_resp = sock.wfile.getvalue()
    head_bytes, _, body = raw_resp.partition(b"\r\n\r\n")
    head_lines = head_bytes.decode("latin-1").split("\r\n")
    status = int(head_lines[0].split(" ", 2)[1])
    resp_headers = {}
    for line in head_lines[1:]:
        if ":" in line:
            k, v = line.split(":", 1)
            resp_headers[k.strip().lower()] = v.strip()
    return status, resp_headers, body


class AnalyticsUnitTests(unittest.TestCase):
    def test_get_measurement_id_validation_and_fallback(self):
        self.assertEqual(analytics.get_measurement_id({}), "")
        self.assertEqual(analytics.get_measurement_id({"GA_MEASUREMENT_ID": "  g-abc123def  "}), "G-ABC123DEF")
        self.assertEqual(analytics.get_measurement_id({"GOOGLE_ANALYTICS_ID": "G-FALLBACK99"}), "G-FALLBACK99")
        self.assertEqual(analytics.get_measurement_id({"GA_MEASUREMENT_ID": "G-XXXXXXXXXX"}), "")
        self.assertEqual(analytics.get_measurement_id({"GA_MEASUREMENT_ID": "G-123"}), "")
        self.assertEqual(analytics.get_measurement_id({"GA_MEASUREMENT_ID": "UA-12345-1"}), "")
        self.assertEqual(
            analytics.get_measurement_id({"GA_MEASUREMENT_ID": "G-TEST1234</script><script>alert(1)"}),
            "",
        )

    def test_inject_ga_html_targets_and_idempotency(self):
        mid = "G-ABC123456"
        html_lower = b"<html><head><title>Hi</title></head><body>Hi</body></html>"
        out = analytics.inject_ga_html(html_lower, mid)
        self.assertIn(b"https://www.googletagmanager.com/gtag/js?id=G-ABC123456", out)
        self.assertIn(b"gtag('config', 'G-ABC123456');", out)
        self.assertLess(out.index(b"gtag.js"), out.index(b"</head>"))
        self.assertEqual(analytics.inject_ga_html(out, mid), out)

        html_upper = b"<HTML><HEAD><TITLE>Upper</TITLE></HEAD><BODY></BODY></HTML>"
        out_upper = analytics.inject_ga_html(html_upper, mid)
        self.assertLess(out_upper.index(b"gtag/js"), out_upper.index(b"</HEAD>"))

        html_body_only = b"<html><body><p>Hello</p></body></html>"
        out_body = analytics.inject_ga_html(html_body_only, mid)
        self.assertLess(out_body.index(b"gtag/js"), out_body.index(b"</body>"))

        self.assertEqual(analytics.inject_ga_html(html_lower, ""), html_lower)
        self.assertEqual(analytics.inject_ga_html(html_lower, "bad-id"), html_lower)


class AnalyticsServerTests(unittest.TestCase):
    def setUp(self):
        self._tmpdir = tempfile.TemporaryDirectory()
        self._db_path = os.path.join(self._tmpdir.name, "test_poll.db")
        self._orig_db_path = server.DB_PATH
        server.DB_PATH = self._db_path
        conn = getattr(server._local, "conn", None)
        if conn is not None:
            try:
                conn._connection.close()
            except Exception:
                pass
            delattr(server._local, "conn")

    def tearDown(self):
        conn = getattr(server._local, "conn", None)
        if conn is not None:
            try:
                conn._connection.close()
            except Exception:
                pass
            delattr(server._local, "conn")
        server.DB_PATH = self._orig_db_path
        self._tmpdir.cleanup()

    def test_unconfigured_does_not_inject_and_health_reports_disabled(self):
        with patch.dict(os.environ, {"GA_MEASUREMENT_ID": "", "GOOGLE_ANALYTICS_ID": ""}, clear=False):
            for route in ("/", "/github-vibecoding/", "/busy-pictures/"):
                status, _, body = _dispatch("GET", route)
                self.assertEqual(status, 200, route)
                self.assertNotIn(b"googletagmanager.com/gtag/js", body, route)

            status, _, body = _dispatch("GET", "/api/health")
            self.assertEqual(status, 200)
            payload = json.loads(body)
            self.assertEqual(payload["analytics"], {"enabled": False, "provider": None, "measurementId": None})

    def test_configured_injects_html_routes_preserves_static_and_redirects(self):
        mid = "G-TEST987654"
        with patch.dict(os.environ, {"GA_MEASUREMENT_ID": mid}, clear=False):
            for route in ("/", "/github-vibecoding/", "/graphic-design-module.html", "/busy-pictures/"):
                status, hdrs, body = _dispatch("GET", route)
                self.assertEqual(status, 200, route)
                self.assertEqual(hdrs["content-type"], "text/html; charset=utf-8", route)
                self.assertEqual(int(hdrs["content-length"]), len(body), route)
                self.assertIn(f"https://www.googletagmanager.com/gtag/js?id={mid}".encode(), body, route)
                self.assertIn(f"gtag('config', '{mid}');".encode(), body, route)

                head_status, head_hdrs, head_body = _dispatch("HEAD", route)
                self.assertEqual(head_status, 200, route)
                self.assertEqual(int(head_hdrs["content-length"]), len(body), route)
                self.assertEqual(head_body, b"", route)

            status, hdrs, _ = _dispatch("GET", "/github-vibecoding")
            self.assertEqual(status, 301)
            self.assertEqual(hdrs["location"], "/github-vibecoding/")

            js_status, _, js_body = _dispatch("GET", "/dialogue-brand.js")
            self.assertEqual(js_status, 200)
            self.assertNotIn(b"googletagmanager.com", js_body)

            gz_status, gz_hdrs, gz_body = _dispatch("GET", "/github-vibecoding/", {"Accept-Encoding": "gzip"})
            self.assertEqual(gz_status, 200)
            self.assertEqual(gz_hdrs.get("content-encoding"), "gzip")
            plain = gzip.decompress(gz_body)
            self.assertIn(f"https://www.googletagmanager.com/gtag/js?id={mid}".encode(), plain)

            h_status, _, h_body = _dispatch("GET", "/api/health")
            self.assertEqual(h_status, 200)
            self.assertEqual(
                json.loads(h_body)["analytics"],
                {"enabled": True, "provider": "ga4", "measurementId": mid},
            )

            trav_status, _, trav_body = _dispatch("GET", "/../etc/passwd")
            self.assertNotEqual(trav_status, 200)
            self.assertNotIn(b"gtag/js", trav_body)


if __name__ == "__main__":
    unittest.main()
