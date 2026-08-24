#!/usr/bin/env python3
"""Static file server with classroom APIs backed by SQLite.

Endpoints
---------
GET  /api/poll?window=<key>   – fetch current vote counts for a time window
POST /api/poll                – submit / update a vote (upserts by responseToken)
GET  /api/fgd/session         – fetch a public, participant, or teacher session view
POST /api/fgd/sessions        – create a focus-group discussion session
POST /api/fgd/join            – join a selected discussion room
POST /api/fgd/action          – submit a participant contribution, report, or reflection
POST /api/fgd/teacher         – advance phases and manage the room dashboard

Everything else is served as static files from the same directory.
"""

import http.server
import hashlib
import json
import os
import re
import secrets
import sqlite3
import socketserver
import threading
import time
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "5000"))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("DIALOGUE_DB_PATH", os.path.join(DIRECTORY, "poll.db"))

FGD_PHASES = [
    "lobby",
    "understand",
    "first-voices",
    "explore",
    "challenge",
    "decide",
    "report",
    "reflect",
    "ended",
]
FGD_ROLES = [
    "Facilitator",
    "Reporter",
    "Participation Encourager",
    "Clarifier",
    "Example Finder",
    "Respectful Challenger",
    "Language Monitor",
    "Timekeeper",
]
FGD_CONTROLLER_ROLES = {
    "understand": "Language Monitor",
    "first-voices": "Facilitator",
    "explore": "Example Finder",
    "challenge": "Respectful Challenger",
    "decide": "Facilitator",
    "report": "Reporter",
    "reflect": "Facilitator",
}
FGD_EVIDENCE_MOVES = {
    "opinion",
    "example",
    "question",
    "build",
    "disagree",
    "invite",
    "summarize",
    "rethink",
}

# A session may be prepared before class and reopened from the private teacher
# link. Authenticated activity renews this window; public code lookups do not.
FGD_SESSION_LIFETIME = 7 * 24 * 60 * 60

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
            CREATE TABLE IF NOT EXISTS fgd_sessions (
                code             TEXT    PRIMARY KEY,
                teacher_token    TEXT    NOT NULL,
                status           TEXT    NOT NULL DEFAULT 'lobby',
                room_count       INTEGER NOT NULL,
                room_capacity    INTEGER NOT NULL,
                support_level    TEXT    NOT NULL DEFAULT 'student-choice',
                phase_durations  TEXT    NOT NULL,
                phase_started_at INTEGER,
                created_at       INTEGER NOT NULL,
                expires_at       INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS fgd_rooms (
                session_code     TEXT    NOT NULL,
                room_number      INTEGER NOT NULL,
                topic_id         INTEGER NOT NULL,
                help_requested   INTEGER NOT NULL DEFAULT 0,
                report_data      TEXT    NOT NULL DEFAULT '{}',
                PRIMARY KEY (session_code, room_number),
                FOREIGN KEY (session_code) REFERENCES fgd_sessions(code) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS fgd_participants (
                token             TEXT    PRIMARY KEY,
                session_code      TEXT    NOT NULL,
                room_number       INTEGER NOT NULL,
                display_name      TEXT    NOT NULL,
                support_level     TEXT    NOT NULL,
                role              TEXT    NOT NULL,
                contributions     INTEGER NOT NULL DEFAULT 0,
                exit_data         TEXT    NOT NULL DEFAULT '{}',
                joined_at         INTEGER NOT NULL,
                last_seen         INTEGER NOT NULL,
                FOREIGN KEY (session_code) REFERENCES fgd_sessions(code) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_fgd_participants_room
                ON fgd_participants(session_code, room_number);
            CREATE TABLE IF NOT EXISTS fgd_room_state (
                session_code      TEXT    NOT NULL,
                room_number       INTEGER NOT NULL,
                prompt_index      INTEGER NOT NULL DEFAULT 0,
                perspective_index INTEGER NOT NULL DEFAULT 0,
                observation_data  TEXT    NOT NULL DEFAULT '{}',
                PRIMARY KEY (session_code, room_number)
            );
            CREATE TABLE IF NOT EXISTS fgd_learning (
                participant_token TEXT    PRIMARY KEY,
                targets_data      TEXT    NOT NULL DEFAULT '{}',
                evidence_data     TEXT    NOT NULL DEFAULT '{}'
            );
            CREATE TABLE IF NOT EXISTS fgd_report_approvals (
                session_code      TEXT    NOT NULL,
                room_number       INTEGER NOT NULL,
                participant_token TEXT    NOT NULL,
                PRIMARY KEY (session_code, room_number, participant_token)
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
# Focus Group Discussion helpers
# ---------------------------------------------------------------------------

def _clean_text(value, limit: int) -> str:
    """Normalize short user-entered classroom text before storing it."""
    return re.sub(r"\s+", " ", str(value or "")).strip()[:limit]


def _json_object(raw: str) -> dict:
    try:
        value = json.loads(raw or "{}")
        return value if isinstance(value, dict) else {}
    except (json.JSONDecodeError, TypeError):
        return {}


def _new_fgd_code(db: sqlite3.Connection) -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    for _ in range(30):
        code = "".join(secrets.choice(alphabet) for _ in range(5))
        exists = db.execute("SELECT 1 FROM fgd_sessions WHERE code = ?", (code,)).fetchone()
        if not exists:
            return code
    raise RuntimeError("Could not allocate a unique session code")


def _fgd_session_row(db: sqlite3.Connection, code: str):
    return db.execute(
        "SELECT * FROM fgd_sessions WHERE code = ? AND expires_at > ?",
        (code, int(time.time())),
    ).fetchone()


def _fgd_controller_role(db: sqlite3.Connection, code: str, room_number: int, phase: str) -> str:
    roles = [
        row["role"]
        for row in db.execute(
            "SELECT role FROM fgd_participants WHERE session_code = ? AND room_number = ? ORDER BY joined_at",
            (code, room_number),
        ).fetchall()
    ]
    preferred = FGD_CONTROLLER_ROLES.get(phase, "Facilitator")
    if preferred in roles:
        return preferred
    if "Facilitator" in roles:
        return "Facilitator"
    return roles[0] if roles else preferred


def _fgd_role_order(session, room_number: int) -> list[str]:
    """Create a private, stable role order with the Facilitator in seats 1–5.

    This keeps the role assignment random from the students' perspective while
    avoiding the cultural signal that the first/oldest/most assertive member is
    automatically entitled to lead.
    """
    seed = f'{session["teacher_token"]}:{room_number}'
    other_roles = [role for role in FGD_ROLES if role != "Facilitator"]
    other_roles.sort(key=lambda role: hashlib.sha256(f"{seed}:{role}".encode()).digest())
    facilitator_range = min(5, session["room_capacity"])
    facilitator_index = int.from_bytes(
        hashlib.sha256(f"{seed}:facilitator-seat".encode()).digest()[:4], "big"
    ) % facilitator_range
    other_roles.insert(facilitator_index, "Facilitator")
    return other_roles


def _fgd_snapshot(code: str, participant_token: str = "", teacher_token: str = "") -> dict | None:
    db = _get_db()
    session = _fgd_session_row(db, code)
    if not session:
        return None

    is_teacher = bool(teacher_token) and secrets.compare_digest(teacher_token, session["teacher_token"])
    participant = None
    if participant_token:
        participant = db.execute(
            "SELECT * FROM fgd_participants WHERE token = ? AND session_code = ?",
            (participant_token, code),
        ).fetchone()
        if participant:
            db.execute(
                "UPDATE fgd_participants SET last_seen = ? WHERE token = ?",
                (int(time.time()), participant_token),
            )
            db.commit()

    # Keep an actively used classroom session available without allowing an
    # unauthenticated code lookup to keep abandoned sessions alive forever.
    if is_teacher or participant:
        db.execute(
            "UPDATE fgd_sessions SET expires_at = ? WHERE code = ?",
            (int(time.time()) + FGD_SESSION_LIFETIME, code),
        )
        db.commit()

    rooms = db.execute(
        """
        SELECT r.room_number, r.topic_id, r.help_requested, r.report_data,
               COALESCE(rs.prompt_index, 0) AS prompt_index,
               COALESCE(rs.perspective_index, 0) AS perspective_index,
               COALESCE(rs.observation_data, '{}') AS observation_data,
               (SELECT COUNT(*) FROM fgd_report_approvals a
                 WHERE a.session_code = r.session_code AND a.room_number = r.room_number) AS approval_count,
               COUNT(p.token) AS participant_count,
               COALESCE(SUM(p.contributions), 0) AS contribution_count,
               COALESCE(SUM(CASE WHEN p.exit_data != '{}' THEN 1 ELSE 0 END), 0) AS exit_count
        FROM fgd_rooms r
        LEFT JOIN fgd_participants p
          ON p.session_code = r.session_code AND p.room_number = r.room_number
        LEFT JOIN fgd_room_state rs
          ON rs.session_code = r.session_code AND rs.room_number = r.room_number
        WHERE r.session_code = ?
        GROUP BY r.room_number, r.topic_id, r.help_requested, r.report_data,
                 rs.prompt_index, rs.perspective_index, rs.observation_data
        ORDER BY r.room_number
        """,
        (code,),
    ).fetchall()

    public_rooms = []
    for room in rooms:
        item = {
            "number": room["room_number"],
            "participantCount": room["participant_count"],
            "capacity": session["room_capacity"],
        }
        reveal_topic = session["status"] != "lobby" and (
            is_teacher or (participant and participant["room_number"] == room["room_number"])
        )
        if reveal_topic:
            item["topicId"] = room["topic_id"]
        controller_role = _fgd_controller_role(db, code, room["room_number"], session["status"])
        reporter_role = _fgd_controller_role(db, code, room["room_number"], "report")
        if is_teacher:
            participant_rows = db.execute(
                """SELECT p.display_name, p.role, p.support_level, p.contributions, p.exit_data,
                          COALESCE(l.targets_data, '{}') AS targets_data,
                          COALESCE(l.evidence_data, '{}') AS evidence_data
                   FROM fgd_participants p
                   LEFT JOIN fgd_learning l ON l.participant_token = p.token
                   WHERE p.session_code = ? AND p.room_number = ?
                   ORDER BY p.joined_at""",
                (code, room["room_number"]),
            ).fetchall()
            move_counts = {}
            target_count = 0
            for person in participant_rows:
                targets = _json_object(person["targets_data"])
                evidence = _json_object(person["evidence_data"])
                if targets:
                    target_count += 1
                for move, count in evidence.items():
                    if move in FGD_EVIDENCE_MOVES:
                        move_counts[move] = move_counts.get(move, 0) + int(count or 0)
            item.update({
                "topicId": room["topic_id"],
                "helpRequested": bool(room["help_requested"]),
                "report": _json_object(room["report_data"]),
                "contributionCount": room["contribution_count"],
                "exitCount": room["exit_count"],
                "promptIndex": room["prompt_index"],
                "perspectiveIndex": room["perspective_index"],
                "controllerRole": controller_role,
                "reporterRole": reporter_role,
                "approvalCount": room["approval_count"],
                "targetCount": target_count,
                "moveCounts": move_counts,
                "observation": _json_object(room["observation_data"]),
                "participants": [
                    {
                        "name": p["display_name"],
                        "role": p["role"],
                        "level": p["support_level"],
                        "contributions": p["contributions"],
                        "hasExit": p["exit_data"] != "{}",
                        "hasTargets": bool(_json_object(p["targets_data"])),
                        "evidence": _json_object(p["evidence_data"]),
                    }
                    for p in participant_rows
                ],
            })
        elif participant and participant["room_number"] == room["room_number"]:
            approved = db.execute(
                """SELECT 1 FROM fgd_report_approvals
                   WHERE session_code = ? AND room_number = ? AND participant_token = ?""",
                (code, room["room_number"], participant_token),
            ).fetchone()
            item.update({
                "helpRequested": bool(room["help_requested"]),
                "report": _json_object(room["report_data"]),
                "contributionCount": room["contribution_count"],
                "promptIndex": room["prompt_index"],
                "perspectiveIndex": room["perspective_index"],
                "controllerRole": controller_role,
                "reporterRole": reporter_role,
                "approvalCount": room["approval_count"],
                "participantApproved": bool(approved),
            })
        public_rooms.append(item)

    payload = {
        "active": session["status"] != "ended",
        "code": code,
        "status": session["status"],
        "roomCount": session["room_count"],
        "roomCapacity": session["room_capacity"],
        "supportLevel": session["support_level"],
        "phaseDurations": json.loads(session["phase_durations"]),
        "phaseStartedAt": session["phase_started_at"],
        "rooms": public_rooms,
        "serverTime": int(time.time()),
        "isTeacher": is_teacher,
    }
    if participant:
        learning = db.execute(
            "SELECT targets_data, evidence_data FROM fgd_learning WHERE participant_token = ?",
            (participant_token,),
        ).fetchone()
        payload["participant"] = {
            "name": participant["display_name"],
            "roomNumber": participant["room_number"],
            "level": participant["support_level"],
            "role": participant["role"],
            "contributions": participant["contributions"],
            "exit": _json_object(participant["exit_data"]),
            "targets": _json_object(learning["targets_data"]) if learning else {},
            "evidence": _json_object(learning["evidence_data"]) if learning else {},
        }
    return payload


# ---------------------------------------------------------------------------
# Request handler
# ---------------------------------------------------------------------------

def _json_response(handler, status: int, payload: dict) -> None:
    body = json.dumps(payload).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Cache-Control", "no-store")
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

    # ── GET classroom APIs ────────────────────────────────────────────────────
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
        elif parsed.path == "/api/fgd/session":
            params = parse_qs(parsed.query)
            code = _clean_text(params.get("code", [""])[0], 5).upper()
            participant_token = _clean_text(params.get("participantToken", [""])[0], 96)
            teacher_token = _clean_text(params.get("teacherToken", [""])[0], 96)
            if not code:
                _json_response(self, 400, {"error": "Missing session code"})
                return
            db = _get_db()
            session = _fgd_session_row(db, code)
            if not session:
                _json_response(self, 404, {"error": "This session is no longer available. Ask the teacher for the current code."})
                return
            if teacher_token and not secrets.compare_digest(teacher_token, session["teacher_token"]):
                _json_response(self, 403, {"error": "This is not the private teacher control link for this session."})
                return
            if participant_token:
                participant_exists = db.execute(
                    "SELECT 1 FROM fgd_participants WHERE token = ? AND session_code = ?",
                    (participant_token, code),
                ).fetchone()
                if not participant_exists:
                    _json_response(self, 403, {"error": "Your saved room pass is no longer available. Please join the room again."})
                    return
            snapshot = _fgd_snapshot(code, participant_token, teacher_token)
            _json_response(self, 200, snapshot)
            return
        elif parsed.path == "/api/debate":
            try:
                params = parse_qs(parsed.query)
                requested_room = params.get("room", ["public"])[0].strip()
                db = _get_db()
                row = db.execute("SELECT session_data FROM debate_active_session WHERE id = 'current'").fetchone()
                if row and row["session_data"]:
                    full_data = json.loads(row["session_data"])
                    if not full_data.get("active"):
                        _json_response(self, 200, {"active": False})
                        return

                    # Build sanitized response based on requested room (prevents cross-team snooping)
                    public_payload = {k: v for k, v in full_data.items() if k not in ["govt_room", "opp_room"]}
                    
                    if requested_room == "govt":
                        res = {**public_payload, "govt_room": full_data.get("govt_room", {})}
                    elif requested_room == "opp":
                        res = {**public_payload, "opp_room": full_data.get("opp_room", {})}
                    else:
                        # Public / master / spectator view: strictly NO private notes
                        res = public_payload
                    _json_response(self, 200, res)
                else:
                    _json_response(self, 200, {"active": False})
            except Exception as e:
                _json_response(self, 200, {"active": False, "error": str(e)})
            return
        super().do_GET()

    # ── POST classroom APIs ───────────────────────────────────────────────────
    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/fgd/"):
            length = int(self.headers.get("Content-Length", 0))
            try:
                body = json.loads(self.rfile.read(length))
                if not isinstance(body, dict):
                    raise ValueError
            except (json.JSONDecodeError, ValueError):
                _json_response(self, 400, {"error": "Invalid JSON"})
                return

            if parsed.path == "/api/fgd/sessions":
                self._create_fgd_session(body)
                return
            if parsed.path == "/api/fgd/join":
                self._join_fgd_session(body)
                return
            if parsed.path == "/api/fgd/action":
                self._fgd_participant_action(body)
                return
            if parsed.path == "/api/fgd/teacher":
                self._fgd_teacher_action(body)
                return
            _json_response(self, 404, {"error": "Unknown discussion endpoint"})
            return

        if parsed.path == "/api/debate":
            length = int(self.headers.get("Content-Length", 0))
            try:
                body = json.loads(self.rfile.read(length))
            except (json.JSONDecodeError, ValueError):
                _json_response(self, 400, {"error": "Invalid JSON"})
                return
            try:
                db = _get_db()
                row = db.execute("SELECT session_data FROM debate_active_session WHERE id = 'current'").fetchone()
                current_data = json.loads(row["session_data"]) if row and row["session_data"] else {}

                # Channel specific updates
                channel = body.get("channel")
                if channel == "govt":
                    current_data["govt_room"] = body.get("payload", {})
                elif channel == "opp":
                    current_data["opp_room"] = body.get("payload", {})
                else:
                    # Update master state while preserving existing isolated rooms
                    govt_room = current_data.get("govt_room", {})
                    opp_room = current_data.get("opp_room", {})
                    current_data = {**body, "govt_room": govt_room, "opp_room": opp_room}

                db.execute("""
                    INSERT INTO debate_active_session (id, session_data, updated_at)
                    VALUES ('current', ?, strftime('%s','now'))
                    ON CONFLICT(id) DO UPDATE SET
                        session_data = excluded.session_data,
                        updated_at = strftime('%s','now')
                """, (json.dumps(current_data),))
                db.commit()
                _json_response(self, 200, {"success": True})
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

    def _create_fgd_session(self, body: dict) -> None:
        try:
            room_count = max(2, min(10, int(body.get("roomCount", 4))))
            room_capacity = max(5, min(8, int(body.get("roomCapacity", 6))))
        except (TypeError, ValueError):
            _json_response(self, 400, {"error": "Invalid room settings"})
            return

        topic_ids = body.get("topicIds", [])
        if not isinstance(topic_ids, list) or len(topic_ids) != room_count:
            _json_response(self, 400, {"error": "Provide one topic ID for each room"})
            return
        try:
            topic_ids = [int(topic_id) for topic_id in topic_ids]
        except (TypeError, ValueError):
            _json_response(self, 400, {"error": "Invalid topic IDs"})
            return
        if any(topic_id < 1 or topic_id > 9999 for topic_id in topic_ids):
            _json_response(self, 400, {"error": "Invalid topic IDs"})
            return

        support_level = _clean_text(body.get("supportLevel", "student-choice"), 24)
        if support_level not in {"student-choice", "basic", "developing", "confident"}:
            support_level = "student-choice"
        default_durations = {
            "understand": 180,
            "first-voices": 300,
            "explore": 420,
            "challenge": 300,
            "decide": 240,
            "report": 120,
            "reflect": 90,
        }
        requested = body.get("phaseDurations", {})
        if isinstance(requested, dict):
            for phase in default_durations:
                try:
                    default_durations[phase] = max(30, min(1800, int(requested.get(phase, default_durations[phase]))))
                except (TypeError, ValueError):
                    pass

        db = _get_db()
        now = int(time.time())
        try:
            code = _new_fgd_code(db)
            teacher_token = secrets.token_urlsafe(32)
            db.execute("BEGIN IMMEDIATE")
            db.execute(
                """INSERT INTO fgd_sessions
                   (code, teacher_token, status, room_count, room_capacity, support_level,
                    phase_durations, phase_started_at, created_at, expires_at)
                   VALUES (?, ?, 'lobby', ?, ?, ?, ?, NULL, ?, ?)""",
                (
                    code,
                    teacher_token,
                    room_count,
                    room_capacity,
                    support_level,
                    json.dumps(default_durations),
                    now,
                    now + FGD_SESSION_LIFETIME,
                ),
            )
            db.executemany(
                "INSERT INTO fgd_rooms (session_code, room_number, topic_id) VALUES (?, ?, ?)",
                [(code, index + 1, topic_ids[index]) for index in range(room_count)],
            )
            db.executemany(
                "INSERT INTO fgd_room_state (session_code, room_number) VALUES (?, ?)",
                [(code, index + 1) for index in range(room_count)],
            )
            db.commit()
        except Exception as exc:
            db.rollback()
            _json_response(self, 500, {"error": str(exc)})
            return

        _json_response(self, 201, {
            "code": code,
            "teacherToken": teacher_token,
            "session": _fgd_snapshot(code, teacher_token=teacher_token),
        })

    def _join_fgd_session(self, body: dict) -> None:
        code = _clean_text(body.get("code"), 5).upper()
        name = _clean_text(body.get("name"), 36)
        level = _clean_text(body.get("level", "developing"), 24)
        try:
            room_number = int(body.get("roomNumber", 0))
        except (TypeError, ValueError):
            room_number = 0
        if not code or not name or level not in {"basic", "developing", "confident"}:
            _json_response(self, 400, {"error": "Name, room, and support level are required"})
            return

        db = _get_db()
        now = int(time.time())
        try:
            db.execute("BEGIN IMMEDIATE")
            session = _fgd_session_row(db, code)
            if not session:
                db.rollback()
                _json_response(self, 404, {"error": "Session not found or expired"})
                return
            if session["status"] == "ended":
                db.rollback()
                _json_response(self, 409, {"error": "This discussion has finished"})
                return
            if room_number < 1 or room_number > session["room_count"]:
                db.rollback()
                _json_response(self, 400, {"error": "Choose an available room"})
                return
            existing = db.execute(
                """SELECT token FROM fgd_participants
                   WHERE session_code = ? AND room_number = ? AND lower(display_name) = lower(?)
                   ORDER BY joined_at LIMIT 1""",
                (code, room_number, name),
            ).fetchone()
            if existing:
                db.commit()
                _json_response(self, 200, {
                    "participantToken": existing["token"],
                    "session": _fgd_snapshot(code, participant_token=existing["token"]),
                    "rejoined": True,
                })
                return
            count = db.execute(
                "SELECT COUNT(*) AS total FROM fgd_participants WHERE session_code = ? AND room_number = ?",
                (code, room_number),
            ).fetchone()["total"]
            if count >= session["room_capacity"]:
                db.rollback()
                _json_response(self, 409, {"error": "That room has just filled up. Please choose another."})
                return

            role = _fgd_role_order(session, room_number)[count % len(FGD_ROLES)]
            participant_token = secrets.token_urlsafe(32)
            db.execute(
                """INSERT INTO fgd_participants
                   (token, session_code, room_number, display_name, support_level, role, joined_at, last_seen)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (participant_token, code, room_number, name, level, role, now, now),
            )
            db.execute(
                "INSERT INTO fgd_learning (participant_token) VALUES (?)",
                (participant_token,),
            )
            db.commit()
        except Exception as exc:
            db.rollback()
            _json_response(self, 500, {"error": str(exc)})
            return

        _json_response(self, 201, {
            "participantToken": participant_token,
            "session": _fgd_snapshot(code, participant_token=participant_token),
        })

    def _fgd_participant_action(self, body: dict) -> None:
        code = _clean_text(body.get("code"), 5).upper()
        token = _clean_text(body.get("participantToken"), 96)
        action = _clean_text(body.get("action"), 24)
        db = _get_db()
        session = _fgd_session_row(db, code)
        participant = db.execute(
            "SELECT * FROM fgd_participants WHERE token = ? AND session_code = ?",
            (token, code),
        ).fetchone()
        if not session or not participant:
            _json_response(self, 403, {"error": "Your discussion pass is no longer valid"})
            return

        if action == "contribute":
            db.execute(
                "UPDATE fgd_participants SET contributions = MIN(contributions + 1, 99), last_seen = ? WHERE token = ?",
                (int(time.time()), token),
            )
        elif action == "advanceCard":
            field = "perspective_index" if session["status"] == "challenge" else "prompt_index"
            db.execute(
                """INSERT INTO fgd_room_state (session_code, room_number, prompt_index, perspective_index)
                   VALUES (?, ?, 0, 0)
                   ON CONFLICT(session_code, room_number) DO NOTHING""",
                (code, participant["room_number"]),
            )
            db.execute(
                f"UPDATE fgd_room_state SET {field} = {field} + 1 WHERE session_code = ? AND room_number = ?",
                (code, participant["room_number"]),
            )
        elif action == "targets":
            targets = body.get("targets", {})
            if not isinstance(targets, dict):
                _json_response(self, 400, {"error": "Invalid learning targets"})
                return
            cleaned = {
                "word": _clean_text(targets.get("word"), 80),
                "phrase": _clean_text(targets.get("phrase"), 180),
                "pattern": _clean_text(targets.get("pattern"), 180),
                "teamwork": _clean_text(targets.get("teamwork"), 180),
            }
            db.execute(
                """INSERT INTO fgd_learning (participant_token, targets_data, evidence_data)
                   VALUES (?, ?, '{}')
                   ON CONFLICT(participant_token) DO UPDATE SET targets_data = excluded.targets_data""",
                (token, json.dumps(cleaned)),
            )
        elif action == "evidence":
            move = _clean_text(body.get("move"), 24)
            if move not in FGD_EVIDENCE_MOVES:
                _json_response(self, 400, {"error": "Choose the discussion move you used"})
                return
            learning = db.execute(
                "SELECT evidence_data FROM fgd_learning WHERE participant_token = ?",
                (token,),
            ).fetchone()
            evidence = _json_object(learning["evidence_data"]) if learning else {}
            evidence[move] = min(99, int(evidence.get(move, 0) or 0) + 1)
            db.execute(
                """INSERT INTO fgd_learning (participant_token, targets_data, evidence_data)
                   VALUES (?, '{}', ?)
                   ON CONFLICT(participant_token) DO UPDATE SET evidence_data = excluded.evidence_data""",
                (token, json.dumps(evidence)),
            )
            db.execute(
                "UPDATE fgd_participants SET contributions = MIN(contributions + 1, 99), last_seen = ? WHERE token = ?",
                (int(time.time()), token),
            )
        elif action == "help":
            requested = 1 if body.get("requested", True) else 0
            db.execute(
                "UPDATE fgd_rooms SET help_requested = ? WHERE session_code = ? AND room_number = ?",
                (requested, code, participant["room_number"]),
            )
        elif action == "report":
            report = body.get("report", {})
            if not isinstance(report, dict):
                _json_response(self, 400, {"error": "Invalid report"})
                return
            cleaned = {
                "position": _clean_text(report.get("position"), 32),
                "strongestInsight": _clean_text(report.get("strongestInsight"), 420),
                "agreement": _clean_text(report.get("agreement"), 420),
                "unresolved": _clean_text(report.get("unresolved"), 420),
                "recommendation": _clean_text(report.get("recommendation"), 420),
                "updatedBy": participant["display_name"],
                "updatedAt": int(time.time()),
            }
            db.execute(
                "UPDATE fgd_rooms SET report_data = ? WHERE session_code = ? AND room_number = ?",
                (json.dumps(cleaned), code, participant["room_number"]),
            )
            db.execute(
                "DELETE FROM fgd_report_approvals WHERE session_code = ? AND room_number = ?",
                (code, participant["room_number"]),
            )
        elif action == "approveReport":
            if body.get("approved", True):
                db.execute(
                    """INSERT OR IGNORE INTO fgd_report_approvals
                       (session_code, room_number, participant_token) VALUES (?, ?, ?)""",
                    (code, participant["room_number"], token),
                )
            else:
                db.execute(
                    """DELETE FROM fgd_report_approvals
                       WHERE session_code = ? AND room_number = ? AND participant_token = ?""",
                    (code, participant["room_number"], token),
                )
        elif action == "exit":
            exit_data = body.get("exit", {})
            if not isinstance(exit_data, dict):
                _json_response(self, 400, {"error": "Invalid reflection"})
                return
            try:
                confidence = max(1, min(5, int(exit_data.get("confidence", 3))))
            except (TypeError, ValueError):
                confidence = 3
            cleaned = {
                "phrase": _clean_text(exit_data.get("phrase"), 180),
                "confidence": confidence,
                "teammateIdea": _clean_text(exit_data.get("teammateIdea"), 280),
                "teamworkMoment": _clean_text(exit_data.get("teamworkMoment"), 280),
                "nextStep": _clean_text(exit_data.get("nextStep"), 280),
            }
            db.execute(
                "UPDATE fgd_participants SET exit_data = ?, last_seen = ? WHERE token = ?",
                (json.dumps(cleaned), int(time.time()), token),
            )
        else:
            _json_response(self, 400, {"error": "Unknown participant action"})
            return
        db.commit()
        _json_response(self, 200, _fgd_snapshot(code, participant_token=token))

    def _fgd_teacher_action(self, body: dict) -> None:
        code = _clean_text(body.get("code"), 5).upper()
        token = _clean_text(body.get("teacherToken"), 96)
        action = _clean_text(body.get("action"), 24)
        db = _get_db()
        session = _fgd_session_row(db, code)
        if not session:
            _json_response(self, 404, {"error": "This session is no longer available. Create a new session for the class."})
            return
        if not secrets.compare_digest(token, session["teacher_token"]):
            _json_response(self, 403, {"error": "Open the private teacher control link created with this session."})
            return

        if action == "setPhase":
            phase = _clean_text(body.get("phase"), 24)
            if phase not in FGD_PHASES:
                _json_response(self, 400, {"error": "Invalid discussion phase"})
                return
            started_at = None if phase in {"lobby", "ended"} else int(time.time())
            db.execute(
                "UPDATE fgd_sessions SET status = ?, phase_started_at = ? WHERE code = ?",
                (phase, started_at, code),
            )
        elif action == "clearHelp":
            try:
                room_number = int(body.get("roomNumber", 0))
            except (TypeError, ValueError):
                room_number = 0
            db.execute(
                "UPDATE fgd_rooms SET help_requested = 0 WHERE session_code = ? AND room_number = ?",
                (code, room_number),
            )
        elif action == "extendPhase":
            try:
                seconds = max(30, min(600, int(body.get("seconds", 120))))
            except (TypeError, ValueError):
                seconds = 120
            if session["phase_started_at"]:
                db.execute(
                    "UPDATE fgd_sessions SET phase_started_at = phase_started_at + ? WHERE code = ?",
                    (seconds, code),
                )
        elif action == "observe":
            try:
                room_number = int(body.get("roomNumber", 0))
            except (TypeError, ValueError):
                room_number = 0
            observation = body.get("observation", {})
            if room_number < 1 or room_number > session["room_count"] or not isinstance(observation, dict):
                _json_response(self, 400, {"error": "Invalid room observation"})
                return
            cleaned = {}
            for dimension in ("language", "interaction", "perspective", "teamwork"):
                value = _clean_text(observation.get(dimension), 16)
                cleaned[dimension] = value if value in {"", "emerging", "developing", "strong"} else ""
            cleaned["note"] = _clean_text(observation.get("note"), 300)
            cleaned["updatedAt"] = int(time.time())
            db.execute(
                """INSERT INTO fgd_room_state (session_code, room_number, observation_data)
                   VALUES (?, ?, ?)
                   ON CONFLICT(session_code, room_number)
                   DO UPDATE SET observation_data = excluded.observation_data""",
                (code, room_number, json.dumps(cleaned)),
            )
        else:
            _json_response(self, 400, {"error": "Unknown teacher action"})
            return
        db.commit()
        _json_response(self, 200, _fgd_snapshot(code, teacher_token=token))


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
