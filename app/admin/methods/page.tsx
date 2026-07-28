import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc } from "drizzle-orm";
import { MethodsTable } from "./MethodsTable";

export default async function MethodsPage() {
  const allMethods = await db
    .select()
    .from(sdlcMethods)
    .orderBy(asc(sdlcMethods.sortOrder));

  return <MethodsTable initialData={allMethods} />;
}
