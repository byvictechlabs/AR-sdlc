import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Scan,
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
                Ketuk Tahapan → Model 3D Tahapannya
              </h3>
            </div>
            <div className="ml-11 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ketuk salah satu tahapan pada model (misalnya Testing).
                Model utama akan digantikan oleh model 3D khusus tahapan
                tersebut — setiap tahapan punya diorama 3D-nya sendiri.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <Box className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Model tahap masih bisa diputar, digeser, dan di-zoom
                  seperti model utama. Tombol aksi akan muncul di bawah
                  layar.
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
            <div className="ml-11 space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tekan tombol <b>“📋 Lihat Penjelasan”</b> di bawah layar
                untuk membuka popup penjelasan tahapan tersebut. Baca materi
                pembelajaran dan tekan “Dengarkan” untuk memutar audio TTS.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <MousePointerClick className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tutup popup (✕) → model 3D tahapan tetap tampil, jadi kamu
                  bisa memutar modelnya lagi atau membuka penjelasan kembali.
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white">
                6
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Kembali & Jelajahi Tahap Lain
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed ml-11">
              Tekan tombol <b>✕</b> di samping tombol penjelasan untuk
              kembali ke model utama. Dari sana, ketuk tahapan lain untuk
              melihat model 3D-nya — setiap tahapan bisa dibuka bergantian
              selama marker masih terdeteksi.
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
