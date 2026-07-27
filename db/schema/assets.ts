import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sdlcMethods } from "./methods";

export const assets3d = sqliteTable("assets_3d", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  methodId: text("method_id")
    .notNull()
    .references(() => sdlcMethods.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(),
  fileFormat: text("file_format", { enum: ["glb", "gltf"] })
    .notNull()
    .default("glb"),
  fileSize: integer("file_size"),
  version: text("version").notNull().default("1.0"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
