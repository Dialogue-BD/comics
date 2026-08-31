"""Database adapter for durable production storage and local SQLite development."""

from __future__ import annotations

import sqlite3
from typing import Any, Iterable


_SCHEMA = """
CREATE TABLE IF NOT EXISTS poll_responses (
    id             __POLL_ID__,
    window         TEXT    NOT NULL,
    response_token TEXT    NOT NULL,
    primary_emotion TEXT   NOT NULL,
    emotion        TEXT    NOT NULL,
    reason         TEXT,
    created_at     BIGINT  DEFAULT __NOW__,
    UNIQUE(window, response_token)
);
CREATE INDEX IF NOT EXISTS idx_pr_window ON poll_responses(window);
CREATE TABLE IF NOT EXISTS debate_active_session (
    id             TEXT    PRIMARY KEY DEFAULT 'current',
    session_data   TEXT    NOT NULL,
    updated_at     BIGINT  DEFAULT __NOW__
);
CREATE TABLE IF NOT EXISTS fgd_sessions (
    code             TEXT    PRIMARY KEY,
    teacher_token    TEXT    NOT NULL,
    status           TEXT    NOT NULL DEFAULT 'lobby',
    room_count       INTEGER NOT NULL,
    room_capacity    INTEGER NOT NULL,
    support_level    TEXT    NOT NULL DEFAULT 'student-choice',
    phase_durations  TEXT    NOT NULL,
    phase_started_at BIGINT,
    created_at       BIGINT  NOT NULL,
    expires_at       BIGINT  NOT NULL
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
    exit_data          TEXT    NOT NULL DEFAULT '{}',
    joined_at         BIGINT  NOT NULL,
    last_seen         BIGINT  NOT NULL,
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
"""


class ClassroomDatabase:
    """Expose the small DB-API surface used by server.py across both backends."""

    def __init__(self, *, database_url: str = "", sqlite_path: str = "poll.db") -> None:
        self.dialect = "postgres" if database_url else "sqlite"
        if self.dialect == "postgres":
            try:
                import psycopg
                from psycopg.rows import dict_row
            except ImportError as exc:  # pragma: no cover - depends on deployment package install
                raise RuntimeError(
                    "DATABASE_URL is configured, but psycopg is not installed. "
                    "Install dependencies from requirements.txt before publishing."
                ) from exc
            self._connection = psycopg.connect(database_url, row_factory=dict_row)
        else:
            self._connection = sqlite3.connect(sqlite_path, check_same_thread=False)
            self._connection.row_factory = sqlite3.Row
            self._connection.execute("PRAGMA journal_mode=WAL")
            self._connection.execute("PRAGMA synchronous=NORMAL")
        self._initialize_schema()

    @property
    def backend_name(self) -> str:
        return "PostgreSQL" if self.dialect == "postgres" else "SQLite"

    def _initialize_schema(self) -> None:
        if self.dialect == "postgres":
            script = (_SCHEMA
                      .replace("__POLL_ID__", "BIGSERIAL PRIMARY KEY")
                      .replace("__NOW__", "(CAST(EXTRACT(EPOCH FROM NOW()) AS BIGINT))"))
            for statement in script.split(";"):
                if statement.strip():
                    self._connection.execute(statement)
        else:
            script = (_SCHEMA
                      .replace("__POLL_ID__", "INTEGER PRIMARY KEY AUTOINCREMENT")
                      .replace("__NOW__", "(strftime('%s','now'))"))
            self._connection.executescript(script)
        self._connection.commit()

    def _sql(self, statement: str) -> str:
        if self.dialect == "postgres":
            return statement.replace("?", "%s")
        return statement

    def execute(self, statement: str, parameters: Iterable[Any] = ()):
        if self.dialect == "postgres" and statement.strip().upper() == "BEGIN IMMEDIATE":
            # Psycopg begins a transaction automatically on the first query.
            return self._connection.cursor()
        return self._connection.execute(self._sql(statement), tuple(parameters))

    def executemany(self, statement: str, parameters: Iterable[Iterable[Any]]):
        if self.dialect == "postgres":
            cursor = self._connection.cursor()
            cursor.executemany(self._sql(statement), parameters)
            return cursor
        return self._connection.executemany(statement, parameters)

    def commit(self) -> None:
        self._connection.commit()

    def rollback(self) -> None:
        self._connection.rollback()
