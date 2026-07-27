import { db } from "@/db";
import { categories } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/schemas";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const [category] = await db
      .insert(categories)
      .values(data)
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
