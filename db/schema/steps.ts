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
  stepOrder: integer("step_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
