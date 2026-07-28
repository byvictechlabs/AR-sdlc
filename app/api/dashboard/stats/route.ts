import { db } from "@/db";
import { sdlcMethods, methodSteps, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const [methodsCount] = await db.select({ value: count() }).from(sdlcMethods);
    const [stepsCount] = await db.select({ value: count() }).from(methodSteps);
    const [usersCount] = await db.select({ value: count() }).from(users);

    return NextResponse.json({
      methods: methodsCount.value,
      steps: stepsCount.value,
      users: usersCount.value,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
