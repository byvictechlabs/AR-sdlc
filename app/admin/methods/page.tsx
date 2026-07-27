import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc } from "drizzle-orm";
import { MethodsTable } from "./MethodsTable";

export default async function MethodsPage() {
  const allMethods = await db
    .select()
    .from(sdlcMethods)
    .orderBy(asc(sdlcMethods.sortOrder));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">SDLC Methods</h2>
        <p className="text-muted-foreground">
          Manage your SDLC learning methods and their 3D model references.
        </p>
      </div>
      <MethodsTable initialData={allMethods} />
    </div>
  );
}
