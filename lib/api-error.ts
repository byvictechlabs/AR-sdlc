import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown, context: string) {
  // Zod validation error
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const field = issue.path.join(".");
      fieldErrors[field || "_form"] = issue.message;
    }
    return NextResponse.json(
      { error: "Validation failed", details: fieldErrors },
      { status: 400 }
    );
  }

  // SQLite / LibSQL constraint errors
  if (isLibsqlError(error) || isSqliteError(error)) {
    const message = (error as Error).message || "";

    // UNIQUE constraint
    if (message.includes("UNIQUE constraint failed")) {
      const field = extractFieldName(message);
      const label = formatFieldName(field);
      return NextResponse.json(
        {
          error: `${label} already exists`,
          details: { [field]: `${label} "${extractValue(message)}" is already in use` },
        },
        { status: 409 }
      );
    }

    // FOREIGN KEY constraint
    if (message.includes("FOREIGN KEY constraint failed")) {
      return NextResponse.json(
        {
          error: "Invalid reference",
          details: { _form: "The referenced record does not exist" },
        },
        { status: 400 }
      );
    }

    // NOT NULL constraint
    if (message.includes("NOT NULL constraint failed")) {
      const field = extractFieldName(message);
      const label = formatFieldName(field);
      return NextResponse.json(
        {
          error: `${label} is required`,
          details: { [field]: `Field "${label}" cannot be empty` },
        },
        { status: 400 }
      );
    }
  }

  // Generic error
  console.error(`Failed to ${context}:`, error);
  return NextResponse.json(
    { error: `Failed to ${context}. Please try again.` },
    { status: 500 }
  );
}

function isLibsqlError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("SQLITE")
  );
}

function isSqliteError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("SQLITE_")
  );
}

function extractFieldName(message: string): string {
  // "UNIQUE constraint failed: method_steps.mesh_name" → "mesh_name"
  const match = message.match(/(\w+)\.(\w+)$/);
  if (match) return match[2];
  // "NOT NULL constraint failed: method_steps.mesh_name" → "mesh_name"
  const match2 = message.match(/failed:\s*\w+\.(\w+)/);
  if (match2) return match2[1];
  return "field";
}

function extractValue(message: string): string {
  // Extract the value from the constraint message if available
  const match = message.match(/params:\s*\[.*?,\s*'(.*?)'/);
  return match ? match[1] : "this value";
}

function formatFieldName(field: string): string {
  // "mesh_name" → "Mesh name", "method_id" → "Method id"
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
