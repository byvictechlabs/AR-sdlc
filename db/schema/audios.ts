import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { methodSteps } from "./steps";

export const audios = sqliteTable("audios", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stepId: text("step_id")
    .notNull()
    .references(() => methodSteps.id, { onDelete: "cascade" }),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
