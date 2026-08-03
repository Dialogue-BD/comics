import { env } from "cloudflare:workers";

let schemaReady: Promise<void> | null = null;

function getD1() {
  if (!env.DB) throw new Error("The shared poll database is unavailable.");
  return env.DB;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getD1();
      await db.batch([
        db.prepare(`CREATE TABLE IF NOT EXISTS poll_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          poll_window TEXT NOT NULL,
          response_token TEXT NOT NULL,
          primary_emotion TEXT NOT NULL,
          emotion TEXT NOT NULL,
          reason TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (poll_window, response_token)
        )`),
        db.prepare("CREATE INDEX IF NOT EXISTS poll_responses_window_idx ON poll_responses (poll_window)"),
      ]);
    })().catch(error => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

export async function savePollResponse(input: {
  pollWindow: string;
  responseToken: string;
  primaryEmotion: string;
  emotion: string;
  reason: string;
}) {
  await ensureSchema();
  const db = getD1();
  await db.prepare("DELETE FROM poll_responses WHERE poll_window < ?1").bind(input.pollWindow).run();
  await db.prepare(`INSERT INTO poll_responses
    (poll_window, response_token, primary_emotion, emotion, reason)
    VALUES (?1, ?2, ?3, ?4, ?5)
    ON CONFLICT (poll_window, response_token) DO UPDATE SET
      primary_emotion = excluded.primary_emotion,
      emotion = excluded.emotion,
      reason = excluded.reason,
      updated_at = CURRENT_TIMESTAMP`
  ).bind(input.pollWindow, input.responseToken, input.primaryEmotion, input.emotion, input.reason).run();
}

export async function readPoll(pollWindow: string) {
  await ensureSchema();
  const db = getD1();
  await db.prepare("DELETE FROM poll_responses WHERE poll_window < ?1").bind(pollWindow).run();

  const totalRow = await db.prepare("SELECT COUNT(*) AS total FROM poll_responses WHERE poll_window = ?1")
    .bind(pollWindow).first<{ total: number }>();
  const total = Number(totalRow?.total || 0);
  const primaryRows = await db.prepare(`SELECT primary_emotion AS emotion, COUNT(*) AS count
    FROM poll_responses WHERE poll_window = ?1 GROUP BY primary_emotion ORDER BY count DESC`)
    .bind(pollWindow).all<{ emotion: string; count: number }>();
  const specificRows = await db.prepare(`SELECT emotion, COUNT(*) AS count
    FROM poll_responses WHERE poll_window = ?1 GROUP BY emotion ORDER BY count DESC, emotion ASC LIMIT 12`)
    .bind(pollWindow).all<{ emotion: string; count: number }>();

  const reasonsVisible = total > 0;
  const reasonRows = reasonsVisible
    ? await db.prepare(`SELECT primary_emotion AS primaryEmotion, emotion, reason
        FROM poll_responses
        WHERE poll_window = ?1 AND reason <> ''
        ORDER BY updated_at DESC, id DESC LIMIT 18`)
      .bind(pollWindow).all<{ primaryEmotion: string; emotion: string; reason: string }>()
    : { results: [] as Array<{ primaryEmotion: string; emotion: string; reason: string }> };

  return {
    window: pollWindow,
    total,
    counts: Object.fromEntries(primaryRows.results.map(row => [row.emotion, Number(row.count)])),
    specificCounts: specificRows.results.map(row => ({ emotion: row.emotion, count: Number(row.count) })),
    reasonsVisible,
    reasons: reasonRows.results,
  };
}
