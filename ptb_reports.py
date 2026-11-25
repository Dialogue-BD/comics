"""Problem reports for Picture This Bangla (/picture-this-bangla/).

Nurturers (Bangla speakers or English-speaking learners) report a problem with
a card from the deck's step-by-step "Report a problem" wizard. Reports are kept
in the classroom database (PostgreSQL on the published site, SQLite locally)
so they can be read by people (reports.html) and by Codex's weekly correction
run, which marks each one resolved or won't-fix with a note.

    POST /api/ptb/report                 a new report (public; size-capped)
    GET  /api/ptb/reports?status=open    list reports            (token)
    GET  /api/ptb/reports/<id>/audio     a report's voice clip    (token)
    POST /api/ptb/reports/status         set status + resolution  (token)

Token: the PTB_REPORTS_TOKEN secret, or TTS_UPLOAD_TOKEN if that is not set,
sent as "Authorization: Bearer <token>". Running locally with neither set,
reading is open so the tools can be tried out.
"""

import base64
import hashlib
import json
import os
import re
import secrets
import threading
import time

IS_DEPLOYMENT = os.environ.get("REPLIT_DEPLOYMENT") == "1"
TOKEN = (os.environ.get("PTB_REPORTS_TOKEN") or os.environ.get("TTS_UPLOAD_TOKEN") or "").strip()

MAX_BODY_BYTES = 600 * 1024
MAX_AUDIO_BYTES = 400 * 1024            # ~40 s of phone-recorded speech
MAX_REPORTS_PER_HOUR = 40              # per client, to stop accidental floods
STATUSES = ("open", "in-progress", "resolved", "wont-fix")
TARGET_KINDS = ("item", "title", "question", "card")
CATEGORIES = (
    "pronunciation", "spelling", "uncommon-word", "wrong-word", "better-word",
    "english-meaning", "picture", "question-unclear", "question-grammar",
    "question-unnatural", "question-too-hard", "question-sensitive",
    "title", "other",
)
AUDIO_MIME_RE = re.compile(r"^audio/(webm|ogg|mp4|mpeg|aac|wav|x-m4a)(;.*)?$")
REPORT_ID_AUDIO_RE = re.compile(r"^/api/ptb/reports/([0-9]{1,12})/audio$")

_recent = {}
_recent_lock = threading.Lock()


def _clean(value, limit):
    if value is None:
        return ""
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(value)).strip()[:limit]


def _clean_obj(value, depth=0):
    """Keep JSON small and plain: strings capped, nesting limited."""
    if depth > 3:
        return None
    if isinstance(value, dict):
        return {_clean(k, 40): _clean_obj(v, depth + 1) for k, v in list(value.items())[:40]}
    if isinstance(value, list):
        return [_clean_obj(v, depth + 1) for v in value[:40]]
    if isinstance(value, bool) or value is None:
        return value
    if isinstance(value, (int, float)):
        return value
    return _clean(value, 2000)


def _authorized(handler):
    if not TOKEN:
        return not IS_DEPLOYMENT
    supplied = handler.headers.get("Authorization", "")
    supplied = supplied[7:].strip() if supplied.lower().startswith("bearer ") else ""
    return bool(supplied) and secrets.compare_digest(supplied, TOKEN)


def _client_hash(handler):
    ip = (handler.headers.get("X-Forwarded-For", "") or handler.client_address[0]).split(",")[0].strip()
    return hashlib.sha256(("ptb:" + ip).encode()).hexdigest()[:16]


def _throttled(client):
    now = time.time()
    with _recent_lock:
        stamps = [t for t in _recent.get(client, []) if now - t < 3600]
        if len(stamps) >= MAX_REPORTS_PER_HOUR:
            _recent[client] = stamps
            return True
        stamps.append(now)
        _recent[client] = stamps
    return False


def _read_json(handler):
    length = int(handler.headers.get("Content-Length", 0) or 0)
    if length <= 0 or length > MAX_BODY_BYTES:
        return None, "Report is empty or too large."
    try:
        body = json.loads(handler.rfile.read(length))
    except (ValueError, UnicodeDecodeError):
        return None, "Invalid JSON."
    if not isinstance(body, dict):
        return None, "Invalid JSON."
    return body, ""


def _row_to_report(row):
    data = json.loads(row["report_json"] or "{}")
    data.update({
        "id": row["id"],
        "status": row["status"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "resolution": row["resolution"] or "",
        "resolved_by": row["resolved_by"] or "",
        "resolved_at": row["resolved_at"],
        "has_audio": bool(row["audio_mime"]),
        "audio_url": "/api/ptb/reports/%d/audio" % row["id"] if row["audio_mime"] else "",
    })
    return data


class PtbReports:
    def __init__(self, get_db, json_response):
        self._get_db = get_db
        self._json = json_response

    # -- POST ---------------------------------------------------------------
    def handle_post(self, handler, path):
        if path == "/api/ptb/report":
            self._create(handler)
            return True
        if path == "/api/ptb/reports/status":
            self._set_status(handler)
            return True
        return False

    def _create(self, handler):
        body, error = _read_json(handler)
        if error:
            self._json(handler, 400, {"error": error})
            return
        client = _client_hash(handler)
        if _throttled(client):
            self._json(handler, 429, {"error": "Too many reports from this device in the last hour. Please try again later."})
            return
        category = _clean(body.get("category"), 40)
        target = body.get("target") if isinstance(body.get("target"), dict) else {}
        card = body.get("card") if isinstance(body.get("card"), dict) else {}
        kind = _clean(target.get("kind"), 20)
        if category not in CATEGORIES or kind not in TARGET_KINDS:
            self._json(handler, 400, {"error": "Unknown problem type or card part."})
            return
        try:
            card_number = int(card.get("number"))
        except (TypeError, ValueError):
            self._json(handler, 400, {"error": "Missing card number."})
            return
        audio_b64, audio_mime = "", ""
        audio = body.pop("audio", None)
        if isinstance(audio, dict) and audio.get("data"):
            audio_mime = _clean(audio.get("mime"), 60)
            if not AUDIO_MIME_RE.match(audio_mime):
                self._json(handler, 400, {"error": "Unsupported recording format."})
                return
            try:
                raw = base64.b64decode(audio["data"], validate=True)
            except (ValueError, TypeError):
                self._json(handler, 400, {"error": "Recording could not be read."})
                return
            if len(raw) > MAX_AUDIO_BYTES:
                self._json(handler, 400, {"error": "Recording is too long. Please keep it under about 30 seconds."})
                return
            audio_b64 = base64.b64encode(raw).decode()
        report = _clean_obj(body)
        report["category"] = category
        now = int(time.time())
        db = self._get_db()
        try:
            db.execute(
                "INSERT INTO ptb_reports (created_at, updated_at, status, card_number, card_slug, target_kind, "
                "target_id, category, report_json, audio_b64, audio_mime, client_hash) "
                "VALUES (?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (now, now, card_number, _clean(card.get("slug"), 80), kind, _clean(target.get("id"), 80),
                 category, json.dumps(report, ensure_ascii=False), audio_b64 or None, audio_mime or None, client),
            )
            db.commit()
            row = db.execute("SELECT MAX(id) AS id FROM ptb_reports WHERE client_hash = ? AND created_at = ?",
                             (client, now)).fetchone()
        except Exception as exc:  # noqa: BLE001
            db.rollback()
            self._json(handler, 500, {"error": "The report could not be saved.", "detail": str(exc)[:200]})
            return
        self._json(handler, 200, {"ok": True, "id": row["id"] if row else None})

    def _set_status(self, handler):
        if not _authorized(handler):
            self._json(handler, 403, {"error": "Needs the reports token."})
            return
        body, error = _read_json(handler)
        if error:
            self._json(handler, 400, {"error": error})
            return
        status = _clean(body.get("status"), 20)
        ids = [int(i) for i in body.get("ids") or [] if str(i).isdigit()][:500]
        if status not in STATUSES or not ids:
            self._json(handler, 400, {"error": "Give ids and a status: " + ", ".join(STATUSES)})
            return
        now = int(time.time())
        done = status in ("resolved", "wont-fix")
        db = self._get_db()
        try:
            for report_id in ids:
                db.execute(
                    "UPDATE ptb_reports SET status = ?, resolution = ?, resolved_by = ?, resolved_at = ?, updated_at = ? "
                    "WHERE id = ?",
                    (status, _clean(body.get("resolution"), 4000) or None, _clean(body.get("by"), 80) or None,
                     now if done else None, now, report_id),
                )
            db.commit()
        except Exception as exc:  # noqa: BLE001
            db.rollback()
            self._json(handler, 500, {"error": "Could not update.", "detail": str(exc)[:200]})
            return
        self._json(handler, 200, {"ok": True, "updated": len(ids), "status": status})

    # -- GET ----------------------------------------------------------------
    def handle_get(self, handler, path, query):
        match = REPORT_ID_AUDIO_RE.match(path)
        if match:
            self._audio(handler, int(match.group(1)))
            return True
        if path == "/api/ptb/reports":
            self._list(handler, query)
            return True
        return False

    def _list(self, handler, query):
        if not _authorized(handler):
            self._json(handler, 403, {"error": "Needs the reports token."})
            return
        status = (query.get("status") or ["open"])[0]
        sql = ("SELECT id, created_at, updated_at, status, report_json, audio_mime, resolution, resolved_by, resolved_at "
               "FROM ptb_reports")
        params = []
        if status != "all":
            wanted = [s for s in status.split(",") if s in STATUSES]
            if not wanted:
                self._json(handler, 400, {"error": "status must be all or one of " + ", ".join(STATUSES)})
                return
            sql += " WHERE status IN (%s)" % ",".join("?" * len(wanted))
            params = wanted
        sql += " ORDER BY id"
        rows = self._get_db().execute(sql, params).fetchall()
        reports = [_row_to_report(r) for r in rows]
        counts = {}
        for r in self._get_db().execute("SELECT status, COUNT(*) AS n FROM ptb_reports GROUP BY status").fetchall():
            counts[r["status"]] = r["n"]
        self._json(handler, 200, {"reports": reports, "counts": counts, "generated_at": int(time.time())})

    def _audio(self, handler, report_id):
        if not _authorized(handler):
            self._json(handler, 403, {"error": "Needs the reports token."})
            return
        row = self._get_db().execute("SELECT audio_b64, audio_mime FROM ptb_reports WHERE id = ?", (report_id,)).fetchone()
        if not row or not row["audio_mime"]:
            self._json(handler, 404, {"error": "No recording for this report."})
            return
        data = base64.b64decode(row["audio_b64"])
        handler.send_response(200)
        handler.send_header("Content-Type", row["audio_mime"].split(";")[0])
        handler.send_header("Content-Length", str(len(data)))
        handler.send_header("Cache-Control", "private, no-store")
        handler.end_headers()
        handler.wfile.write(data)
