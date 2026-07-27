import { db } from "@/db";
import { assets3d } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { assetSchema } from "@/schemas";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allAssets = await db
      .select()
      .from(assets3d)
      .orderBy(desc(assets3d.createdAt));

    return NextResponse.json(allAssets);
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = assetSchema.parse(body);

    const [asset] = await db.insert(assets3d).values(data).returning();

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}
