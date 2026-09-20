import { db } from "@/db";
import { sdlcMethods, methodSteps } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

// Fallback target index berdasarkan slug (kalau mindTargetIndex null di DB)
const TARGET_INDEX_FALLBACK: Record<string, number> = {
  waterfall: 0,
  agile: 1,
  rad: 2,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [method] = await db
      .select()
      .from(sdlcMethods)
      .where(eq(sdlcMethods.slug, slug))
      .limit(1);

    if (!method) {
      return NextResponse.json(
        { error: "Method not found" },
        { status: 404 }
      );
    }

    const steps = await db
      .select()
      .from(methodSteps)
      .where(eq(methodSteps.methodId, method.id))
      .orderBy(asc(methodSteps.stepOrder));

    // Fallback: kalau mindTargetIndex null, pakai default berdasarkan slug
    const targetIndex =
      method.mindTargetIndex ?? TARGET_INDEX_FALLBACK[slug] ?? 0;

    return NextResponse.json({
      ...method,
      mindTargetIndex: targetIndex,
      steps,
    });
  } catch (error) {
    return handleApiError(error, "fetch method by slug");
  }
}
