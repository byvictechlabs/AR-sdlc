import { db } from "@/db";
import { methodSteps, sdlcMethods } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { stepSchema } from "@/schemas";
import { asc, eq } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const allSteps = await db
      .select({
        id: methodSteps.id,
        methodId: methodSteps.methodId,
        meshName: methodSteps.meshName,
        title: methodSteps.title,
        description: methodSteps.description,
        content: methodSteps.content,
        imageUrl: methodSteps.imageUrl,
        audioUrl: methodSteps.audioUrl,
        stepOrder: methodSteps.stepOrder,
        createdAt: methodSteps.createdAt,
        updatedAt: methodSteps.updatedAt,
        methodName: sdlcMethods.name,
      })
      .from(methodSteps)
      .leftJoin(sdlcMethods, eq(methodSteps.methodId, sdlcMethods.id))
      .orderBy(asc(methodSteps.stepOrder));

    return NextResponse.json(allSteps);
  } catch (error) {
    return handleApiError(error, "fetch steps");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = stepSchema.parse(body);

    const [step] = await db.insert(methodSteps).values(data).returning();

    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    return handleApiError(error, "create step");
  }
}
