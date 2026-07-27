import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { methodSteps } from "./steps";

export const quizzes = sqliteTable("quizzes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stepId: text("step_id")
    .notNull()
    .references(() => methodSteps.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer", {
    enum: ["A", "B", "C", "D"],
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
