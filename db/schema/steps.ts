import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sdlcMethods } from "./methods";

export const methodSteps = sqliteTable("method_steps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  methodId: text("method_id")
    .notNull()
    .references(() => sdlcMethods.id, { onDelete: "cascade" }),
  meshName: text("mesh_name").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  // URL GLB model 3D detail per tahap (opsional). File = di R2, isi kolom ini
  // dengan URL publiknya. Kalau NULL → pakai model hardcode bawaan ar.html.
  stageModelUrl: text("stage_model_url"),
  stepOrder: integer("step_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
