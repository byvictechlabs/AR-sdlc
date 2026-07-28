import Link from "next/link";
import { Box, ArrowRight } from "lucide-react";

export default function SplashPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f8fafc] px-6">
      {/* Logo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
        <Box className="h-8 w-8 text-white" />
      </div>

      {/* Title */}
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground text-center">
        AR SDLC
      </h1>
      <p className="mt-1 text-sm text-muted-foreground text-center">
        Learning Media
      </p>

      {/* Tagline */}
      <p className="mt-6 max-w-xs text-center text-sm text-muted-foreground leading-relaxed">
        Pelajari Software Development Life Cycle melalui{" "}
        <span className="font-medium text-foreground">
          Augmented Reality
        </span>{" "}
        secara interaktif.
      </p>

      {/* Get Started */}
      <Link
        href="/home"
        className="mt-10 inline-flex h-12 w-full max-w-[240px] items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 active:bg-blue-700 transition-colors"
      >
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Footer */}
      
    </div>
  );
}
