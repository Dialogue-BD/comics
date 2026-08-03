import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const pollResponses = sqliteTable("poll_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pollWindow: text("poll_window").notNull(),
  responseToken: text("response_token").notNull(),
  primaryEmotion: text("primary_emotion").notNull(),
  emotion: text("emotion").notNull(),
  reason: text("reason").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [
  uniqueIndex("poll_responses_window_token_idx").on(table.pollWindow, table.responseToken),
]);
