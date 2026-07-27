import { db } from "@/db";
import { methodSteps } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { stepSchema } from "@/schemas";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allSteps = await db
      .select()
      .from(methodSteps)
      .orderBy(asc(methodSteps.stepOrder));

    return NextResponse.json(allSteps);
  } catch (error) {
    console.error("Failed to fetch steps:", error);
    return NextResponse.json(
      { error: "Failed to fetch steps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = stepSchema.parse(body);

    const [step] = await db.insert(methodSteps).values(data).returning();

    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create step:", error);
    return NextResponse.json(
      { error: "Failed to create step" },
      { status: 500 }
    );
  }
}
