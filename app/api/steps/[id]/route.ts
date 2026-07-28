import { db } from "@/db";
import { methodSteps } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { stepSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

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
    return handleApiError(error, "fetch step");
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
    return handleApiError(error, "update step");
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
    return handleApiError(error, "delete step");
  }
}
