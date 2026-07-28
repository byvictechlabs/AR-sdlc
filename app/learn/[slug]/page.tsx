import { notFound } from "next/navigation";
import { db } from "@/db";
import { sdlcMethods, methodSteps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Box, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    <div className="min-h-dvh bg-[#f8fafc]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground active:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500">
              <Box className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {method.name}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {steps.length} tahapan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <ScanPage
        method={{
          id: method.id,
          name: method.name,
          slug: method.slug,
          description: method.description,
          modelPath: method.modelPath,
          markerPath: method.markerPath,
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
    </div>
  );
}
