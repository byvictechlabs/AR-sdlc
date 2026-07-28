import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { methodSchema } from "@/schemas";
import { asc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const allMethods = await db
      .select()
      .from(sdlcMethods)
      .orderBy(asc(sdlcMethods.sortOrder));

    return NextResponse.json(allMethods);
  } catch (error) {
    return handleApiError(error, "fetch methods");
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
    return handleApiError(error, "create method");
  }
}
