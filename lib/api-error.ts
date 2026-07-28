import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown, context: string) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  console.error(`Failed to ${context}:`, error);
  return NextResponse.json(
    { error: `Failed to ${context}` },
    { status: 500 }
  );
}
