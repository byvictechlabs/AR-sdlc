import Link from "next/link";
import { Box, BookOpen, HelpCircle, ArrowRight } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="min-h-dvh bg-[#f8fafc]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground active:bg-slate-200 transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500">
              <Box className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              AR SDLC
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4 pt-10 pb-12">
        {/* Greeting */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Halo! 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Apa yang ingin kamu pelajari hari ini?
          </p>
        </div>

        {/* Menu Cards */}
        <div className="space-y-3">
          {/* Mulai Belajar */}
          <Link
            href="/home/mulai-belajar"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-sm active:bg-blue-50/50 active:border-blue-200 transition-colors"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/25">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-foreground">
                Mulai Belajar
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Pilih metode SDLC dan pelajari tahapannya melalui AR
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>

          {/* Panduan */}
          <Link
            href="/home/panduan"
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
              <HelpCircle className="h-6 w-6 text-slate-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-foreground">
                Panduan
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Cara menggunakan aplikasi AR SDLC
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
