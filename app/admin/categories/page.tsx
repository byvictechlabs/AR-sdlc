import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { CategoriesTable } from "./CategoriesTable";

export default async function CategoriesPage() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">
          Organize your learning materials into categories.
        </p>
      </div>
      <CategoriesTable initialData={allCategories} />
    </div>
  );
}
