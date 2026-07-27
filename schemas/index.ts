import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  sortOrder: z.number().int().min(0).default(0),
});

export const methodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  modelPath: z.string().min(1, "Model path is required"),
  markerPath: z.string().min(1, "Marker path is required"),
  categoryId: z.string().uuid().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sortOrder: z.number().int().min(0).default(0),
});

export const stepSchema = z.object({
  methodId: z.string().uuid("Invalid method ID"),
  meshName: z.string().min(1, "Mesh name is required").regex(/^[A-Z0-9_]+$/, "Mesh name must be uppercase with underscores"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  stepOrder: z.number().int().min(1).default(1),
});

export const materialSchema = z.object({
  stepId: z.string().uuid("Invalid step ID"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnailUrl: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const assetSchema = z.object({
  methodId: z.string().uuid("Invalid method ID"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  filePath: z.string().min(1, "File path is required"),
  fileFormat: z.enum(["glb", "gltf"]).default("glb"),
  fileSize: z.number().int().positive().nullable().optional(),
  version: z.string().default("1.0"),
});

export const audioSchema = z.object({
  stepId: z.string().uuid("Invalid step ID"),
  audioUrl: z.string().url("Invalid audio URL"),
  duration: z.number().int().positive().nullable().optional(),
});

export const quizSchema = z.object({
  stepId: z.string().uuid("Invalid step ID"),
  question: z.string().min(1, "Question is required"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
});
