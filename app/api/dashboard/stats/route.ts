import { db } from "@/db";
import { sdlcMethods, methodSteps, categories, assets3d } from "@/db/schema";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const [methodsCount] = await db.select({ value: count() }).from(sdlcMethods);
    const [stepsCount] = await db.select({ value: count() }).from(methodSteps);
    const [categoriesCount] = await db.select({ value: count() }).from(categories);
    const [assetsCount] = await db.select({ value: count() }).from(assets3d);

    return NextResponse.json({
      methods: methodsCount.value,
      steps: stepsCount.value,
      categories: categoriesCount.value,
      assets: assetsCount.value,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
