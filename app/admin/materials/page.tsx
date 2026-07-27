import { db } from "@/db";
import { learningMaterials, methodSteps, sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { MaterialsTable } from "./MaterialsTable";

export default async function MaterialsPage() {
  const allMaterials = await db
    .select({
      id: learningMaterials.id,
      stepId: learningMaterials.stepId,
      title: learningMaterials.title,
      content: learningMaterials.content,
      thumbnailUrl: learningMaterials.thumbnailUrl,
      status: learningMaterials.status,
      createdAt: learningMaterials.createdAt,
      updatedAt: learningMaterials.updatedAt,
      stepTitle: methodSteps.title,
      methodName: sdlcMethods.name,
    })
    .from(learningMaterials)
    .leftJoin(methodSteps, eq(learningMaterials.stepId, methodSteps.id))
    .leftJoin(sdlcMethods, eq(methodSteps.methodId, sdlcMethods.id))
    .orderBy(asc(learningMaterials.createdAt));

  const allSteps = await db
    .select({
      id: methodSteps.id,
      title: methodSteps.title,
      methodName: sdlcMethods.name,
    })
    .from(methodSteps)
    .leftJoin(sdlcMethods, eq(methodSteps.methodId, sdlcMethods.id))
    .orderBy(asc(methodSteps.stepOrder));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Learning Materials</h2>
        <p className="text-muted-foreground">
          Manage detailed learning content for each step.
        </p>
      </div>
      <MaterialsTable initialData={allMaterials} steps={allSteps} />
    </div>
  );
}
