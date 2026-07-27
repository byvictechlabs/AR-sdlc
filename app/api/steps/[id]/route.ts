import { db } from "@/db";
import { methodSteps } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { stepSchema } from "@/schemas";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [step] = await db
      .select()
      .from(methodSteps)
      .where(eq(methodSteps.id, id))
      .limit(1);

    if (!step) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json(step);
  } catch (error) {
    console.error("Failed to fetch step:", error);
    return NextResponse.json(
      { error: "Failed to fetch step" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = stepSchema.parse(body);

    const [updated] = await db
      .update(methodSteps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(methodSteps.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to update step:", error);
    return NextResponse.json(
      { error: "Failed to update step" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(methodSteps)
      .where(eq(methodSteps.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete step:", error);
    return NextResponse.json(
      { error: "Failed to delete step" },
      { status: 500 }
    );
  }
}
