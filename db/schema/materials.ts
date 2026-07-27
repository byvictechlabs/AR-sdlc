import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { methodSteps } from "./steps";

export const learningMaterials = sqliteTable("learning_materials", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stepId: text("step_id")
    .notNull()
    .references(() => methodSteps.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
