import { categories } from "./categories";
import { sdlcMethods } from "./methods";
import { methodSteps } from "./steps";
import { learningMaterials } from "./materials";
import { assets3d } from "./assets";
import { audios } from "./audios";
import { quizzes } from "./quizzes";
import { users, sessions, accounts } from "./auth";
import { relations } from "drizzle-orm";

export const categoriesRelations = relations(categories, ({ many }) => ({
  methods: many(sdlcMethods),
}));

export const sdlcMethodsRelations = relations(sdlcMethods, ({ one, many }) => ({
  category: one(categories, {
    fields: [sdlcMethods.categoryId],
    references: [categories.id],
  }),
  steps: many(methodSteps),
  assets: many(assets3d),
}));

export const methodStepsRelations = relations(methodSteps, ({ one, many }) => ({
  method: one(sdlcMethods, {
    fields: [methodSteps.methodId],
    references: [sdlcMethods.id],
  }),
  materials: many(learningMaterials),
  audio: many(audios),
  quizzes: many(quizzes),
}));

export const learningMaterialsRelations = relations(
  learningMaterials,
  ({ one }) => ({
    step: one(methodSteps, {
      fields: [learningMaterials.stepId],
      references: [methodSteps.id],
    }),
  })
);

export const assets3dRelations = relations(assets3d, ({ one }) => ({
  method: one(sdlcMethods, {
    fields: [assets3d.methodId],
    references: [sdlcMethods.id],
  }),
}));

export const audiosRelations = relations(audios, ({ one }) => ({
  step: one(methodSteps, {
    fields: [audios.stepId],
    references: [methodSteps.id],
  }),
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
