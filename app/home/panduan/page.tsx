import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Scan,
  BookOpen,
  MousePointerClick,
  Camera,
  Lightbulb,
} from "lucide-react";

export default function PanduanPage() {
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
            Panduan Penggunaan
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Intro */}
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Cara Menggunakan
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Ikuti langkah-langkah berikut untuk menggunakan aplikasi AR SDLC
                Learning Media.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Pilih Metode SDLC
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed ml-11">
              Dari menu utama, pilih metode SDLC yang ingin dipelajari
              (Waterfall, Agile, atau RAD). Setiap metode memiliki model 3D
              yang berbeda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Siapkan Marker
              </h3>
            </div>
            <div className="ml-11 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cetak atau tampilkan marker di layar perangkat lain. Marker
                berupa gambar khusus yang akan dipindai oleh kamera.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <Camera className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pastikan marker terlihat jelas dan memiliki pencahayaan yang
                  cukup. Hindari marker yang buram atau terhalang.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Scan Marker
              </h3>
            </div>
            <div className="ml-11 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tekan tombol scan dan arahkan kamera perangkat ke marker.
                Tunggu hingga marker terdeteksi dan model 3D muncul di layar.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <Scan className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Jika model tidak muncul, coba geser kamera perlahan atau
                  pastikan marker berada dalam jangkauan yang cukup.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                4
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Interaksi dengan Model 3D
              </h3>
            </div>
            <div className="ml-11 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setelah model muncul, ketuk atau klik pada tahapan yang ingin
                dipelajari. Setiap tahapan pada model merupakan objek yang dapat
                diklik.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <MousePointerClick className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ketuk bagian model yang memiliki warna berbeda atau label
                  untuk melihat detail tahapan.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                5
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Baca Materi & Dengarkan Audio
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed ml-11">
              Popup detail akan muncul berisi penjelasan tahapan tersebut.
              Baca materi pembelajaran dan putar audio jika tersedia untuk
              pengalaman belajar yang lebih lengkap.
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tips</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  Gunakan pencahayaan yang cukup saat scan marker
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  Jaga jarak kamera sekitar 20-30 cm dari marker
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  Pastikan marker tidak terlipat atau rusak
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  Gunakan browser Chrome atau Safari untuk hasil terbaik
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <Link
          href="/home"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-medium text-foreground active:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Menu Utama
        </Link>
      </div>
    </div>
  );
}
