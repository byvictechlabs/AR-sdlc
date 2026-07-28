import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { methodSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [method] = await db
      .select()
      .from(sdlcMethods)
      .where(eq(sdlcMethods.id, id))
      .limit(1);

    if (!method) {
      return NextResponse.json(
        { error: "Method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(method);
  } catch (error) {
    return handleApiError(error, "fetch method");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = methodSchema.parse(body);

    const [updated] = await db
      .update(sdlcMethods)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sdlcMethods.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "update method");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(sdlcMethods)
      .where(eq(sdlcMethods.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "delete method");
  }
}
