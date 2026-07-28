import { db } from "@/db";
import { methodSteps, sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { StepsTable } from "./StepsTable";

export default async function StepsPage() {
  const allSteps = await db
    .select({
      id: methodSteps.id,
      methodId: methodSteps.methodId,
      meshName: methodSteps.meshName,
      title: methodSteps.title,
      description: methodSteps.description,
      content: methodSteps.content,
      imageUrl: methodSteps.imageUrl,
      audioUrl: methodSteps.audioUrl,
      stepOrder: methodSteps.stepOrder,
      createdAt: methodSteps.createdAt,
      updatedAt: methodSteps.updatedAt,
      methodName: sdlcMethods.name,
    })
    .from(methodSteps)
    .leftJoin(sdlcMethods, eq(methodSteps.methodId, sdlcMethods.id))
    .orderBy(asc(methodSteps.stepOrder));

  const allMethods = await db
    .select()
    .from(sdlcMethods)
    .orderBy(asc(sdlcMethods.sortOrder));

  return <StepsTable initialData={allSteps} methods={allMethods} />;
}
