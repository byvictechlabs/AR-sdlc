import Link from "next/link";
import Image from "next/image";
import { Lightbulb, BookOpen } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-between bg-white overflow-hidden pb-12">
      
      {/* --- BAGIAN ATAS: Background Biru (Dibatasi sebelum teks) --- */}
      {/* Tinggi (height) dikurangi drastis menjadi h-36 agar gradasinya hilang sebelum menyentuh teks */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-blue-600 to-transparent z-0 pointer-events-none">
        {/* Lingkaran Bokeh Transparan */}
        <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
        <div className="absolute -top-4 right-10 w-28 h-28 rounded-full bg-white/20 blur-2xl" />
      </div>

      {/* --- KONTEN UTAMA --- */}
      {/* Margin top (mt-32) ditambahkan agar teks benar-benar berada di area putih */}
      <div className="relative z-10 flex flex-col items-center w-full mt-32 px-6 flex-grow">
        
        {/* Teks Judul */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Belajar lebih mudah dengan
          </p>
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">
            Augmented Reality
          </h1>
          <p className="mt-3 text-xs font-medium text-gray-500 leading-relaxed max-w-[280px] mx-auto">
            Jelajahi berbagai metode Software Development Life Cycle (SDLC) secara interaktif dalam bentuk 3D.
          </p>
        </div>

        {/* Ilustrasi Utama (Diperbesar) */}
        {/* max-w diperbesar menjadi 360px dan margin vertikal disesuaikan agar gambar lebih menonjol */}
        <div className="relative my-4 w-full max-w-[360px] aspect-square flex items-center justify-center">
          <Image
            src="/images/ar2.png" // Pastikan nama file ini sesuai
            alt="AR SDLC Illustration"
            width={450} 
            height={450}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* --- KARTU MENU (TOMBOL) --- */}
        {/* mt-auto dihapus dan diganti dengan mt-2 agar posisi tombol lebih naik mendekati gambar */}
        <div className="w-full max-w-sm flex flex-col gap-4 mt-2 mb-20">
          
          {/* Tombol 1: Mulai Belajar (Biru Gradasi) */}
          <Link
            href="/home/mulai-belajar"
            className="flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-200"
          >
            <div className="mr-5">
              <Lightbulb className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg">Mulai Belajar</span>
              <span className="text-[11px] text-blue-50 mt-0.5">
                Pilih metode SDLC dan modelkan 3D
              </span>
            </div>
          </Link>

          {/* Tombol 2: Panduan (Putih) */}
          <Link
            href="/home/panduan"
            className="flex items-center px-6 py-4 rounded-xl bg-white border border-gray-200 shadow-sm shadow-gray-200/50 active:scale-95 transition-all duration-200"
          >
            <div className="mr-5">
              <BookOpen className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg text-blue-500">Panduan</span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                Lihat cara penggunaan aplikasi AR
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* --- FOOTER BAWAH --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 pt-3 pb-5 flex flex-col items-center justify-center z-20">
        <p className="text-[10px] text-white/90 font-medium tracking-wide">
          © 2026 SDLC AR — Media Pembelajaran Interaktif
        </p>
        {/* Indikator Home Screen iPhone */}
        <div className="w-32 h-1 bg-white/50 rounded-full mt-3" />
      </div>

    </div>
  );
}