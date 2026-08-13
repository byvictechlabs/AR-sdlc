import Link from "next/link";
import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { Box, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";

export default async function MulaiBelajarPage() {
  const methods = await db
    .select()
    .from(sdlcMethods)
    .where(eq(sdlcMethods.status, "published"))
    .orderBy(asc(sdlcMethods.sortOrder));

  return (
    <div className="min-h-dvh bg-[#f8fafc]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link
            href="/home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground active:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-sm font-semibold text-foreground">
            Pilih Metode SDLC
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4 py-6 pb-12">
        <p className="text-xs text-muted-foreground mb-4">
          {methods.length} metode tersedia untuk dipelajari
        </p>

        {methods.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Belum ada metode yang dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {methods.map((method) => (
              <Link
                key={method.id}
                href={`/learn/ar.html?method=${method.slug}`}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-4 shadow-sm active:bg-blue-50/50 active:border-blue-200 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Box className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {method.name}
                  </h3>
                  {method.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {method.description}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    Pelajari
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
