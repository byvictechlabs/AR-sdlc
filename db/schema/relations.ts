import { sdlcMethods } from "./methods";
import { methodSteps } from "./steps";
import { quizzes } from "./quizzes";
import { users, sessions, accounts } from "./auth";
import { relations } from "drizzle-orm";

export const sdlcMethodsRelations = relations(sdlcMethods, ({ many }) => ({
  steps: many(methodSteps),
}));

export const methodStepsRelations = relations(methodSteps, ({ one, many }) => ({
  method: one(sdlcMethods, {
    fields: [methodSteps.methodId],
    references: [sdlcMethods.id],
  }),
  quizzes: many(quizzes),
}));

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  step: one(methodSteps, {
    fields: [quizzes.stepId],
    references: [methodSteps.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
