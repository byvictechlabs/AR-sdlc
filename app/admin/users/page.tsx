import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { UsersTable } from "./UsersTable";

export default async function UsersPage() {
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

  return <UsersTable initialData={allUsers} />;
}
