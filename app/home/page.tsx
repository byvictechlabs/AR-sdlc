import Link from "next/link";
import Image from "next/image";
import { Lightbulb, BookOpen } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="relative flex h-dvh flex-col bg-white overflow-hidden">
      
      {/* --- BACKGROUND BIRU ATAS --- */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-blue-600 to-transparent z-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
        <div className="absolute -top-4 right-10 w-28 h-28 rounded-full bg-white/20 blur-2xl" />
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-6 pt-20 pb-24">
        
        {/* Judul */}
        <div className="text-center mb-2">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Belajar lebih mudah dengan
          </p>
          <h1 className="text-2xl font-extrabold text-blue-500 tracking-tight">
            Augmented Reality
          </h1>
          <p className="mt-2 text-xs font-medium text-gray-500 leading-relaxed max-w-[260px] mx-auto">
            Jelajahi metode SDLC secara interaktif dalam bentuk 3D.
          </p>
        </div>

        {/* Ilustrasi */}
        <div className="relative my-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
          <Image
            src="/images/ar2.png"
            alt="AR SDLC Illustration"
            width={280}
            height={280}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Menu Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
          <Link
            href="/home/mulai-belajar"
            className="flex items-center px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-200"
          >
            <div className="mr-4">
              <Lightbulb className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-base">Mulai Belajar</span>
              <span className="text-[10px] text-blue-50 mt-0.5">
                Pilih metode SDLC dan modelkan 3D
              </span>
            </div>
          </Link>

          <Link
            href="/home/panduan"
            className="flex items-center px-5 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm shadow-gray-200/50 active:scale-95 transition-all duration-200"
          >
            <div className="mr-4">
              <BookOpen className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-base text-blue-500">Panduan</span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                Lihat cara penggunaan aplikasi AR
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 pt-2.5 pb-4 flex flex-col items-center justify-center z-20">
        <p className="text-[9px] text-white/90 font-medium tracking-wide">
          © 2026 SDLC AR — Media Pembelajaran Interaktif
        </p>
        <div className="w-32 h-1 bg-white/50 rounded-full mt-2" />
      </div>

    </div>
  );
}
