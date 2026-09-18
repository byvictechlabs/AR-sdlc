import Link from "next/link";
import Image from "next/image";

export default function SplashPage() {
  return (
    // Kontainer utama tetap putih, tapi kita atur z-index dengan benar di dalamnya
    <div className="relative flex min-h-dvh flex-col items-center justify-between bg-white px-6 py-10 overflow-hidden">
      
      {/* --- BACKGROUND LAYER (GRADASI BIRU) --- */}
      {/* Menggunakan z-0 dan pointer-events-none agar tidak menutupi klik */}
      <div className="absolute top-0 left-0 right-0 w-full h-[50vh] bg-gradient-to-b from-blue-200/90 via-blue-100/50 to-transparent z-0 pointer-events-none">
        
        {/* Pola Bercak Cahaya (Bokeh) */}
        <div className="absolute -top-20 -left-10 w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-10 -right-20 w-[250px] h-[250px] rounded-full bg-blue-300/30 blur-2xl" />
        <div className="absolute top-1/4 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-200/40 blur-2xl" />
      </div>

      {/* --- KONTEN LAYER (Semua konten dibungkus relative z-10 agar selalu di atas background) --- */}
      
      {/* Judul SDLC AR */}
      <div className="relative z-10 flex flex-col items-center mt-12 w-full">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
          <span className="text-gray-900">SDLC</span>{" "}
          <span className="text-blue-600">AR</span>
        </h1>
        {/* Garis Biru Tipis */}
        <div className="h-1 bg-blue-500 w-16 rounded-full mt-3" />
      </div>

      {/* Ilustrasi AR */}
      <div className="relative z-10 my-8 w-full max-w-sm aspect-square flex items-center justify-center">
        <Image
          src="/images/ar1.png"
          alt="SDLC Augmented Reality Illustration"
          width={400} 
          height={400}
          style={{ objectFit: 'contain' }} 
          priority 
        />
      </div>

      {/* Teks Deskripsi dan Tombol */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg mb-16">
        <h2 className="text-3xl font-bold leading-tight text-gray-900">
          Belajar SDLC?
          <br />
          Yuk, eksplorasi dengan AR!
        </h2>
        
        <p className="mt-5 text-base text-gray-500 leading-relaxed max-w-xs font-medium">
          Fitur setiap tahapan SDLC secara lebih nyata, interaktif dan mudah
          dipahami.
        </p>

        <Link
          href="/home"
          className="mt-14 inline-flex h-14 w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-lg font-bold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 active:scale-95 transition-all duration-200"
        >
          Mulai Belajar
        </Link>
      </div>

      {/* Indikator Bawah */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1.5 bg-gray-300/80 w-32 rounded-full z-10" />
    </div>
  );
}