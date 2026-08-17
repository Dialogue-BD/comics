#!/usr/bin/env python3
"""Static file server with built-in poll API backed by SQLite.

Endpoints
---------
GET  /api/poll?window=<key>   – fetch current vote counts for a time window
POST /api/poll                – submit / update a vote (upserts by responseToken)

Everything else is served as static files from the same directory.
"""

import http.server
import json
import os
import sqlite3
import socketserver
import threading
from urllib.parse import parse_qs, urlparse

PORT = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DIRECTORY, "poll.db")

# ---------------------------------------------------------------------------
# Database helpers – one connection per thread (SQLite is not thread-safe to share)
# ---------------------------------------------------------------------------
_local = threading.local()


def _get_db() -> sqlite3.Connection:
    if not hasattr(_local, "conn"):
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")   # concurrent reads + writes
        conn.execute("PRAGMA synchronous=NORMAL")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS poll_responses (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                window         TEXT    NOT NULL,
                response_token TEXT    NOT NULL,
                primary_emotion TEXT   NOT NULL,
                emotion        TEXT    NOT NULL,
                reason         TEXT,
                created_at     INTEGER DEFAULT (strftime('%s','now')),
                UNIQUE(window, response_token)
            );
            CREATE INDEX IF NOT EXISTS idx_pr_window ON poll_responses(window);
            CREATE TABLE IF NOT EXISTS debate_active_session (
                id             TEXT    PRIMARY KEY DEFAULT 'current',
                session_data   TEXT    NOT NULL,
                updated_at     INTEGER DEFAULT (strftime('%s','now'))
            );
        """)
        conn.commit()
        _local.conn = conn
    return _local.conn


def _poll_data(window: str) -> dict:
    """Build the response payload the JS renderPoll() function expects."""
    rows = _get_db().execute(
        "SELECT primary_emotion, emotion, reason FROM poll_responses WHERE window = ?",
        (window,)
    ).fetchall()

    total = len(rows)
    counts: dict[str, int] = {}
    specific: dict[str, int] = {}
    reasons = []

    for row in rows:
        counts[row["primary_emotion"]] = counts.get(row["primary_emotion"], 0) + 1
        specific[row["emotion"]] = specific.get(row["emotion"], 0) + 1
        if row["reason"]:
            reasons.append({
                "primaryEmotion": row["primary_emotion"],
                "emotion": row["emotion"],
                "reason": row["reason"],
            })

    specific_counts = sorted(
        [{"emotion": k, "count": v} for k, v in specific.items()],
        key=lambda x: -x["count"],
    )

    return {
        "total": total,
        "counts": counts,
        "specificCounts": specific_counts,
        "reasons": reasons,
        "reasonsVisible": bool(reasons),
    }


# ---------------------------------------------------------------------------
# Request handler
# ---------------------------------------------------------------------------

def _json_response(handler, status: int, payload: dict) -> None:
    body = json.dumps(payload).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.end_headers()
    handler.wfile.write(body)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Suppress routine access logs; keep 4xx/5xx
        if args and len(args) >= 2 and str(args[1]).startswith(("4", "5")):
            super().log_message(format, *args)

    # ── CORS pre-flight ──────────────────────────────────────────────────────
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # ── GET /api/poll and /api/debate ─────────────────────────────────────────
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/poll":
            params = parse_qs(parsed.query)
            window = params.get("window", [""])[0].strip()
            if not window:
                _json_response(self, 400, {"error": "Missing window parameter"})
                return
            _json_response(self, 200, _poll_data(window))
            return
        elif parsed.path == "/api/debate":
            try:
                db = _get_db()
                row = db.execute("SELECT session_data FROM debate_active_session WHERE id = 'current'").fetchone()
                if row and row["session_data"]:
                    _json_response(self, 200, json.loads(row["session_data"]))
                else:
                    _json_response(self, 200, {"active": False})
            except Exception as e:
                _json_response(self, 200, {"active": False, "error": str(e)})
            return
        super().do_GET()

    # ── POST /api/poll and /api/debate ────────────────────────────────────────
    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/debate":
            length = int(self.headers.get("Content-Length", 0))
            try:
                body = json.loads(self.rfile.read(length))
            except (json.JSONDecodeError, ValueError):
                _json_response(self, 400, {"error": "Invalid JSON"})
                return
            try:
                db = _get_db()
                db.execute("""
                    INSERT INTO debate_active_session (id, session_data, updated_at)
                    VALUES ('current', ?, strftime('%s','now'))
                    ON CONFLICT(id) DO UPDATE SET
                        session_data = excluded.session_data,
                        updated_at = strftime('%s','now')
                """, (json.dumps(body),))
                db.commit()
                _json_response(self, 200, {"success": True, "session": body})
            except Exception as exc:
                _json_response(self, 500, {"error": str(exc)})
            return

        if parsed.path != "/api/poll":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, ValueError):
            _json_response(self, 400, {"error": "Invalid JSON"})
            return

        window          = str(body.get("window",         "")).strip()
        response_token  = str(body.get("responseToken",  "")).strip()
        primary_emotion = str(body.get("primaryEmotion", "")).strip()
        emotion         = str(body.get("emotion",        "")).strip()
        reason          = str(body.get("reason",         "")).strip() or None

        if not all([window, response_token, primary_emotion, emotion]):
            _json_response(self, 400, {"error": "Missing required fields"})
            return

        try:
            db = _get_db()
            db.execute("""
                INSERT INTO poll_responses
                    (window, response_token, primary_emotion, emotion, reason)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(window, response_token) DO UPDATE SET
                    primary_emotion = excluded.primary_emotion,
                    emotion         = excluded.emotion,
                    reason          = excluded.reason,
                    created_at      = strftime('%s','now')
            """, (window, response_token, primary_emotion, emotion, reason))
            db.commit()
        except Exception as exc:
            _json_response(self, 500, {"error": str(exc)})
            return

        _json_response(self, 200, _poll_data(window))


# ---------------------------------------------------------------------------
# Threaded server so concurrent poll submissions don't queue behind each other
# ---------------------------------------------------------------------------
class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    # Warm up the DB on the main thread before accepting connections
    _get_db()
    print(f"Poll DB: {DB_PATH}")
    with ThreadedTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving on port {PORT}")
        httpd.serve_forever()
