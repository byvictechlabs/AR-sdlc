import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { methodSchema } from "@/schemas";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allMethods = await db
      .select()
      .from(sdlcMethods)
      .orderBy(asc(sdlcMethods.sortOrder));

    return NextResponse.json(allMethods);
  } catch (error) {
    console.error("Failed to fetch methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch methods" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = methodSchema.parse(body);

    const [method] = await db
      .insert(sdlcMethods)
      .values(data)
      .returning();

    return NextResponse.json(method, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create method:", error);
    return NextResponse.json(
      { error: "Failed to create method" },
      { status: 500 }
    );
  }
}
