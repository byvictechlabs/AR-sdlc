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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage admin accounts and roles.
        </p>
      </div>
      <UsersTable initialData={allUsers} />
    </div>
  );
}
