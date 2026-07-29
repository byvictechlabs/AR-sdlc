import { notFound } from "next/navigation";
import { db } from "@/db";
import { sdlcMethods, methodSteps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ScanPage } from "./ScanPage";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [method] = await db
    .select()
    .from(sdlcMethods)
    .where(eq(sdlcMethods.slug, slug))
    .limit(1);

  if (!method) notFound();

  const steps = await db
    .select()
    .from(methodSteps)
    .where(eq(methodSteps.methodId, method.id));

  return (
    <ScanPage
      method={{
        id: method.id,
        name: method.name,
        slug: method.slug,
        description: method.description,
        modelPath: method.modelPath,
        markerPath: method.markerPath,
        status: method.status,
        sortOrder: method.sortOrder,
        mindTargetIndex: method.mindTargetIndex,
      }}
      steps={steps.map((s) => ({
        id: s.id,
        meshName: s.meshName,
        title: s.title,
        description: s.description,
        content: s.content,
        imageUrl: s.imageUrl,
        audioUrl: s.audioUrl,
        stepOrder: s.stepOrder,
      }))}
    />
  );
}
