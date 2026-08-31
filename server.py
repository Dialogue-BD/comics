#!/usr/bin/env python3
"""Static file server with durable classroom APIs.

Endpoints
---------
GET  /api/poll?window=<key>   – fetch current vote counts for a time window
GET  /api/health              – report backend and durable-storage readiness
POST /api/poll                – submit / update a vote (upserts by responseToken)
GET  /api/fgd/session         – fetch a public, participant, or teacher session view
POST /api/fgd/sessions        – create a focus-group discussion session
POST /api/fgd/recover         – reopen a session with its private teacher token
POST /api/fgd/join            – join a selected discussion room
POST /api/fgd/action          – submit a participant contribution, report, or reflection
POST /api/fgd/teacher         – advance phases and manage the room dashboard

Everything else is served as static files from the same directory.
"""

import http.server
import json
import os
import re
import secrets
import socketserver
import threading
import time
from urllib.parse import parse_qs, urlparse

from classroom_db import ClassroomDatabase

PORT = int(os.environ.get("PORT", "5000"))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("DIALOGUE_DB_PATH", os.path.join(DIRECTORY, "poll.db"))
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
IS_DEPLOYMENT = os.environ.get("REPLIT_DEPLOYMENT") == "1"

if IS_DEPLOYMENT and not DATABASE_URL:
    raise RuntimeError(
        "Published classroom data requires Replit Database. "
        "Add Database to the Replit project so DATABASE_URL is available, then publish again."
    )

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
FGD_RECOVERY_GRACE = 30 * 24 * 60 * 60

# ---------------------------------------------------------------------------
# Database helpers – one connection per request thread
# ---------------------------------------------------------------------------
_local = threading.local()


def _get_db() -> ClassroomDatabase:
    if not hasattr(_local, "conn"):
        _local.conn = ClassroomDatabase(database_url=DATABASE_URL, sqlite_path=DB_PATH)
    return _local.conn


def _poll_data(window: str) -> dict:
    """Build the response payload the JS renderPoll() function expects."""
    rows = _get_db().execute(
        'SELECT primary_emotion, emotion, reason FROM poll_responses WHERE "window" = ?',
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


def _new_fgd_code(db: ClassroomDatabase) -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    for _ in range(30):
        code = "".join(secrets.choice(alphabet) for _ in range(5))
        exists = db.execute("SELECT 1 FROM fgd_sessions WHERE code = ?", (code,)).fetchone()
        if not exists:
            return code
    raise RuntimeError("Could not allocate a unique session code")


def _fgd_session_row(db: ClassroomDatabase, code: str):
    return db.execute(
        "SELECT * FROM fgd_sessions WHERE code = ? AND expires_at > ?",
        (code, int(time.time())),
    ).fetchone()


def _fgd_session_row_any_age(db: ClassroomDatabase, code: str):
    """Fetch a session for authenticated recovery, including expired rows."""
    return db.execute(
        "SELECT * FROM fgd_sessions WHERE code = ?",
        (code,),
    ).fetchone()


def _auto_advance_fgd_phase(db: ClassroomDatabase, session, now: int | None = None):
    """Advance one timed phase atomically when its clock has expired."""
    if not session or session["status"] in {"lobby", "ended"} or not session["phase_started_at"]:
        return session
    try:
        durations = json.loads(session["phase_durations"])
        duration = int(durations.get(session["status"], 0))
    except (json.JSONDecodeError, TypeError, ValueError):
        return session
    now = int(time.time()) if now is None else int(now)
    if duration <= 0 or now < session["phase_started_at"] + duration:
        return session

    phase_index = FGD_PHASES.index(session["status"])
    next_phase = FGD_PHASES[min(phase_index + 1, len(FGD_PHASES) - 1)]
    next_started_at = None if next_phase == "ended" else now
    db.execute(
        """UPDATE fgd_sessions
           SET status = ?, phase_started_at = ?
           WHERE code = ? AND status = ? AND phase_started_at = ?""",
        (
            next_phase,
            next_started_at,
            session["code"],
            session["status"],
            session["phase_started_at"],
        ),
    )
    db.commit()
    return _fgd_session_row(db, session["code"])


def _fgd_snapshot(code: str, participant_token: str = "", teacher_token: str = "") -> dict | None:
    db = _get_db()
    session = _fgd_session_row(db, code)
    if not session:
        return None
    session = _auto_advance_fgd_phase(db, session)
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
        if is_teacher:
            participant_rows = db.execute(
                """SELECT p.display_name
                   FROM fgd_participants p
                   WHERE p.session_code = ? AND p.room_number = ?
                   ORDER BY p.joined_at""",
                (code, room["room_number"]),
            ).fetchall()
            item.update({
                "topicId": room["topic_id"],
                "helpRequested": bool(room["help_requested"]),
                "report": _json_object(room["report_data"]),
                "contributionCount": room["contribution_count"],
                "exitCount": room["exit_count"],
                "promptIndex": room["prompt_index"],
                "perspectiveIndex": room["perspective_index"],
                "observation": _json_object(room["observation_data"]),
                "participants": [{"name": p["display_name"]} for p in participant_rows],
            })
        elif participant and participant["room_number"] == room["room_number"]:
            item.update({
                "helpRequested": bool(room["help_requested"]),
                "report": _json_object(room["report_data"]),
                "contributionCount": room["contribution_count"],
                "promptIndex": room["prompt_index"],
                "perspectiveIndex": room["perspective_index"],
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
        payload["participant"] = {
            "name": participant["display_name"],
            "roomNumber": participant["room_number"],
            "level": participant["support_level"],
            "exit": _json_object(participant["exit_data"]),
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
        if parsed.path == "/api/health":
            database = _get_db()
            _json_response(self, 200, {
                "ok": True,
                "database": database.backend_name,
                "durable": database.dialect == "postgres",
            })
            return
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
            if parsed.path == "/api/fgd/recover":
                self._recover_fgd_session(body)
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
                    VALUES ('current', ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        session_data = excluded.session_data,
                        updated_at = excluded.updated_at
                """, (json.dumps(current_data), int(time.time())))
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
                    ("window", response_token, primary_emotion, emotion, reason, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT("window", response_token) DO UPDATE SET
                    primary_emotion = excluded.primary_emotion,
                    emotion         = excluded.emotion,
                    reason          = excluded.reason,
                    created_at      = excluded.created_at
            """, (window, response_token, primary_emotion, emotion, reason, int(time.time())))
            db.commit()
        except Exception as exc:
            _json_response(self, 500, {"error": str(exc)})
            return

        _json_response(self, 200, _poll_data(window))

    def _recover_fgd_session(self, body: dict) -> None:
        code = _clean_text(body.get("code"), 5).upper()
        token = _clean_text(body.get("teacherToken"), 96)
        db = _get_db()
        session = _fgd_session_row_any_age(db, code)
        if not session:
            _json_response(self, 404, {"error": "No saved session remains for this private teacher link."})
            return
        if not token or not secrets.compare_digest(token, session["teacher_token"]):
            _json_response(self, 403, {"error": "Use the private teacher control link created with this session."})
            return
        if session["expires_at"] + FGD_RECOVERY_GRACE <= int(time.time()):
            _json_response(self, 410, {"error": "The 30-day recovery window for this session has ended."})
            return
        if session["status"] == "ended":
            _json_response(self, 409, {"error": "This session was intentionally ended. Create a new session to begin again."})
            return

        now = int(time.time())
        expired = session["expires_at"] <= now
        phase_started_at = session["phase_started_at"]
        if session["status"] not in {"lobby", "ended"}:
            # Continue at the saved stage with a fresh clock instead of
            # auto-advancing while the class was away.
            phase_started_at = now
        db.execute(
            "UPDATE fgd_sessions SET expires_at = ?, phase_started_at = ? WHERE code = ?",
            (now + FGD_SESSION_LIFETIME, phase_started_at, code),
        )
        db.commit()
        _json_response(self, 200, {
            "recovered": expired,
            "session": _fgd_snapshot(code, teacher_token=token),
        })

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

            participant_token = secrets.token_urlsafe(32)
            db.execute(
                """INSERT INTO fgd_participants
                   (token, session_code, room_number, display_name, support_level, role, joined_at, last_seen)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (participant_token, code, room_number, name, level, "Member", now, now),
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
                """UPDATE fgd_participants
                   SET contributions = CASE WHEN contributions < 99 THEN contributions + 1 ELSE 99 END,
                       last_seen = ?
                   WHERE token = ?""",
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
                """UPDATE fgd_participants
                   SET contributions = CASE WHEN contributions < 99 THEN contributions + 1 ELSE 99 END,
                       last_seen = ?
                   WHERE token = ?""",
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
                    """INSERT INTO fgd_report_approvals
                       (session_code, room_number, participant_token) VALUES (?, ?, ?)
                       ON CONFLICT(session_code, room_number, participant_token) DO NOTHING""",
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
    database = _get_db()
    print(f"Classroom database: {database.backend_name}")
    with ThreadedTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving on port {PORT}")
        httpd.serve_forever()
