import { db } from "@/db";
import { assets3d, sdlcMethods } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import { AssetsTable } from "./AssetsTable";

export default async function AssetsPage() {
  const allAssets = await db
    .select({
      id: assets3d.id,
      methodId: assets3d.methodId,
      name: assets3d.name,
      description: assets3d.description,
      filePath: assets3d.filePath,
      fileFormat: assets3d.fileFormat,
      fileSize: assets3d.fileSize,
      version: assets3d.version,
      createdAt: assets3d.createdAt,
      updatedAt: assets3d.updatedAt,
      methodName: sdlcMethods.name,
    })
    .from(assets3d)
    .leftJoin(sdlcMethods, eq(assets3d.methodId, sdlcMethods.id))
    .orderBy(desc(assets3d.createdAt));

  const allMethods = await db
    .select()
    .from(sdlcMethods)
    .orderBy(asc(sdlcMethods.sortOrder));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">3D Assets</h2>
        <p className="text-muted-foreground">
          Manage 3D model metadata and references.
        </p>
      </div>
      <AssetsTable initialData={allAssets} methods={allMethods} />
    </div>
  );
}
