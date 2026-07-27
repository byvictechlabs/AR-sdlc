import { db } from "@/db";
import { learningMaterials } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { materialSchema } from "@/schemas";

export async function GET() {
  try {
    const allMaterials = await db.select().from(learningMaterials);
    return NextResponse.json(allMaterials);
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = materialSchema.parse(body);

    const [material] = await db
      .insert(learningMaterials)
      .values(data)
      .returning();

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create material:", error);
    return NextResponse.json(
      { error: "Failed to create material" },
      { status: 500 }
    );
  }
}
