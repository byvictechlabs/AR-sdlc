import { db } from "@/db";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { desc } from "drizzle-orm";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);
  } catch (error) {
    return handleApiError(error, "fetch users");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = body.name as string;
    const email = body.email as string;
    const password = body.password as string;
    const role = (body.role as string) || "admin";

    if (!name || !email || !password) {
      const details: Record<string, string> = {};
      if (!name) details.name = "Name is required";
      if (!email) details.email = "Email is required";
      if (!password) details.password = "Password is required";
      return NextResponse.json(
        { error: "Validation failed", details },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: { password: "Password must be at least 6 characters" },
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcryptjs.hash(password, 12);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: role as "admin" | "super_admin",
      })
      .returning();

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "create user");
  }
}
