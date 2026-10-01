# System Architecture

# AR SDLC Learning Media

Version: 1.0
Status: Draft
Author: Bayu Dani Kurniawan
Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan bagaimana aplikasi media pembelajaran Augmented Reality (AR) untuk materi SDLC disusun secara keseluruhan: bagian mana yang berjalan di browser pengguna, bagian mana yang berjalan di server, dan bagaimana model 3D terhubung dengan materi pembelajaran yang tersimpan di database. Dokumen ini ditujukan kepada dosen, pembimbing, dan klien yang ingin memahami sistem tanpa perlu membaca kode program. Pembaca non-teknis cukup memahami bagian **Overview**, **Alur Pengguna**, dan **Penghubung Kritis (Mesh & Marker)**; bagian-bagian teknis lainnya boleh dilewati tanpa mengurangi pemahaman umum. Seluruh istilah teknis yang digunakan dijelaskan singkat pada Glosarium di bawah ini.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
| --- | --- |
| **API** | Cara resmi agar satu program meminta data ke program lain, berupa alamat khusus dengan format balasan yang tetap. |
| **Endpoint** | Satu alamat API tertentu, misalnya `/api/methods` untuk mengambil daftar metode pembelajaran. |
| **Database** | Tempat penyimpanan data terstruktur yang bisa dicari dan diubah, seperti buku kas digital. |
| **Tabel** | Kumpulan baris data dengan kolom yang sama di dalam database, mirip tabel Excel. |
| **ORM** | Lapisan perantara agar program dapat mengakses database menggunakan bahasa program biasa, bukan bahasa query khusus. |
| **Drizzle** | ORM yang dipakai proyek ini untuk membaca dan menulis data dari kode TypeScript ke database. |
| **Turso** | Layanan database SQLite yang dijalankan di cloud (online), dipakai untuk menyimpan data produksi. |
| **Migration** | Berkas perubahan struktur database yang dijalankan agar tabel di database selalu sesuai dengan kode program. |
| **Cache / ISR / Revalidate** | Penyimpanan sementara hasil data agar tidak dihitung ulang terus-menerus; `revalidate` menentukan kapan cache dianggap kedaluwarsa dan perlu diperbarui. |
| **Service Worker** | Program kecil di browser yang berjalan di latar belakang untuk menyimpan aset (misalnya file model) agar bisa dibuka ulang tanpa mengunduh ulang. |
| **Middleware** | Kode yang dijalankan sebelum halaman dilayani; pada proyek ini dipakai untuk memeriksa login sebelum pengguna masuk halaman admin. |
| **Authentication (Autentikasi)** | Proses memastikan identitas pengguna, misalnya lewat email dan kata sandi. |
| **JWT** | Token (tanda pengenal) digital berisi identitas pengguna yang dibuat setelah login berhasil, dipakai agar sesi login tetap terjaga. |
| **Slug** | Bagian alamat web yang mudah dibaca, misalnya metode "Waterfall" memiliki slug `waterfall` sehingga alamatnya `/learn/waterfall`. |
| **Validasi (Zod)** | Pemeriksaan format data yang masuk (wajib diisi atau tidak, tipe datanya benar atau tidak) sebelum data diproses atau disimpan. |
| **Mesh** | Satu permukaan objek 3D yang diberi nama unik, misalnya `WF_DESIGN`; mesh adalah bagian yang bisa diklik pengguna. |
| **GLB** | Format berkas model 3D tempat seluruh bentuk dan tekstur dikompres dalam satu file. |
| **Marker** | Gambar cetak yang di-scan lewat kamera; saat marker terdeteksi, model 3D muncul di atasnya. |
| **MindAR** | Pustaka open source yang mengenali marker (disebut *image tracking*) melalui kamera browser. |
| **A-Frame** | Pustaka penyusun scene 3D berbasis HTML yang menjadi dasar halaman AR statis `ar.html`. |
| **Raycaster** | Teknik menembakkan "garis pandang" dari posisi klik/tap pengguna untuk menentukan mesh 3D mana yang tersentuh. |
| **TypeScript** | Bahasa JavaScript yang ditambah pemeriksaan tipe data agar kesalahan program terdeteksi lebih awal. |
| **React Component** | Potongan antarmuka (UI) yang bisa dipakai ulang di berbagai halaman. |
| **Server component vs client component** | Server component dihitung di server sehingga lebih ringan dan cocok untuk memuat data awal; client component berjalan di browser dan bisa merespons klik pengguna. |
| **React Three Fiber** | Pustaka React untuk Three.js; pada proyek ini **tidak dipakai di produksi** dan hanya tersisa pada kode lama. |
| **Zustand** | Pustaka penyimpanan data global di React; pada proyek ini hanya dipakai pada kode lama yang tidak aktif. |
| **Next.js** | Kerangka kerja web yang menyediakan halaman (frontend) sekaligus API (backend) dalam satu aplikasi. |
| **Cloudflare R2** | Layanan penyimpanan file di cloud tempat file model 3D GLB di-host. |
| **CDN** | Layanan pengambil pustaka atau file dari server publik yang cepat, sehingga tidak perlu disertakan dalam aplikasi. |

---

# 1. Overview

AR SDLC Learning Media menggunakan arsitektur **Client-Server berbasis WebAR**.

Aplikasi dibangun dengan komponen berikut:

- **Next.js** sebagai frontend sekaligus backend (Route Handler / API).
- **MindAR** sebagai *image tracking engine* (pengenalan marker lewat kamera).
- **A-Frame + Three.js** sebagai renderer 3D pada halaman AR.
- **Turso (SQLite)** sebagai database, diakses melalui **Drizzle ORM**.

Sistem memisahkan aset 3D dengan data pembelajaran:

- Model 3D disimpan sebagai **aset statis** (di-host di Cloudflare R2, bukan di database).
- Konten pembelajaran disimpan di **database**.
- Penghubung antara model 3D dan database adalah dua hal: **`meshName`** (nama bagian/model 3D) dan **`mindTargetIndex`** (urutan marker).

Pendekatan ini membuat aplikasi lebih ringan, mudah dipelihara, dan mudah dikembangkan.

## Status Bagian Kode

Agar tidak terjadi salah paham, berikut status bagian-bagian sistem saat ini:

| Bagian kode | Fungsi | Status |
| --- | --- | --- |
| `public/learn/ar.html` (±1218 baris) | Halaman AR aktif: A-Frame 1.6.0 + MindAR 1.2.5 via CDN, Three.js via `AFRAME.THREE` | **Aktif (produksi)** |
| `app/api/*`, `app/admin/*`, `app/home/*` | API, dashboard admin, halaman publik | **Aktif (produksi)** |
| `public/markers/targets.mind` | Seluruh marker dikompilasi menjadi satu berkas | **Aktif (produksi)** |
| `components/ar/*` (ARViewer, StepPopup), `ar/`, `stores/ar-store.ts` | Komponen AR berbasis React | Tidak aktif (kode mati/sisa) |
| React Three Fiber | Renderer 3D dalam React | Tidak dipakai di produksi |
| `app/learn/ar.html` | Prototipe halaman AR | Tidak dipakai (stale) |
| `app/learn/[slug]/ScanPage.tsx` | Halaman scan React yang memuat komponen AR React | Bagian dari jalur lama, bukan jalur produksi |

---

# 2. High Level Architecture

```
                          +------------------+
                          |     Pengguna     |
                          +--------+---------+
                                   |
                         Browser (Perangkat)
                                   |
   +-------------------------------+-------------------------------+
   |                               |                               |
Halaman Next.js              Halaman Admin                   Halaman AR statis
(home, mulai-belajar,        /admin/*                         public/learn/ar.html
 panduan, login)             (dijaga middleware)              (A-Frame + MindAR)
   |                               |                               |
   +-------------------------------+-----------+-------------------+
                                               |
                                     Next.js Route Handler (API)
                                     /api/methods · /api/steps
                                     /api/users  · /api/auth
                                               |
                              +----------------+----------------+
                              |                                 |
                        Drizzle ORM                      Aset Statis
                              |                                 |
                        Turso (SQLite)                  Model GLB di Cloudflare R2
                                                        Marker di public/markers/
```

---

# 3. Technology Stack

| Teknologi | Peran dalam aplikasi | Status |
| --- | --- | --- |
| Next.js (App Router) | Kerangka aplikasi: halaman dan API dalam satu proyek | Aktif |
| React | Dasar pembuatan antarmuka/halaman | Aktif |
| TypeScript | Bahasa program dengan pemeriksaan tipe data | Aktif |
| Tailwind CSS + shadcn | Penampilan antarmuka (styling) | Aktif |
| A-Frame 1.6.0 (CDN) | Menyusun scene 3D di halaman AR `ar.html` | Aktif |
| MindAR 1.2.5 (CDN) | Image tracking: mengenali marker lewat kamera | Aktif |
| Three.js (via `AFRAME.THREE`) | Menggambar objek 3D di layar | Aktif |
| React Three Fiber | Renderer 3D dalam React | **Tidak dipakai di produksi** (kode lama) |
| Zustand (`stores/ar-store.ts`) | State global React AR | Tidak aktif (kode lama) |
| NextAuth v5 + bcrypt | Login admin (kredensial + JWT) | Aktif |
| Zod (`schemas/index.ts`) | Validasi input | Aktif |
| Drizzle ORM | Akses database dari TypeScript | Aktif |
| Turso (SQLite cloud) | Database produksi | Aktif |
| Serwist (Service Worker) | Cache aset aplikasi & model GLB | Aktif |
| Cloudflare R2 (`models.byvictech.site`) | Hosting file model 3D | Aktif |
| Vercel | Deployment aplikasi | Aktif |

---

# 4. Layer Architecture

```
Presentation Layer  →  Business Layer  →  Data Layer  →  Storage Layer
```

## Presentation Layer (Antarmuka)

Berfungsi sebagai wajah aplikasi bagi pengguna.

- Halaman publik: Splash/Home, Pilih Metode (`/home/mulai-belajar`), Panduan.
- Halaman AR: overlay loading, scanner, popup detail, pemutar audio (berada di `public/learn/ar.html`).
- Dashboard Admin: login, tabel metode, tabel tahapan, tabel pengguna.

## Business Layer (Logika)

Mengatur alur kerja aplikasi, antara lain: scan marker, memuat model, klik mesh, mengambil materi, dan memutar audio.

## Data Layer (Akses Data)

Penghubung aplikasi dengan database, menggunakan Drizzle ORM di dalam Route Handler Next.js.

## Storage Layer (Penyimpanan)

| Jenis | Isi | Tempat penyimpanan |
| --- | --- | --- |
| Statis | Model GLB, marker, texture | Cloudflare R2 dan folder `public/` |
| Dinamis | Metode, tahapan, materi, audio URL | Turso (SQLite) via Drizzle ORM |

---

# 5. Alur Pengguna (Client Flow)

1. Pengguna membuka website (halaman Home).
2. Pengguna memilih menu belajar → halaman **Pilih Metode SDLC** (`/home/mulai-belajar`).
3. Daftar metode dimuat dari database (melalui cache server, lihat bagian Caching).
4. Pengguna menekan kartu metode; aplikasi **mengunduh model 3D sekali dan menyimpannya di cache browser** (`ar-models-v1`), lengkap dengan indikator progres.
5. Browser membuka halaman AR statis: `/learn/ar.html?method=<slug>`.
6. MindAR mengaktifkan kamera dan memindai marker cetak.
7. Saat marker terdeteksi, model GLB dimuat dan muncul mengikuti posisi marker.
8. Pengguna menekan salah satu bagian model; raycaster menentukan mesh yang tersentuh.
9. Nama mesh (`meshName`) dicocokkan dengan data tahapan yang sudah dimuat sebelumnya.
10. Popup detail muncul, lalu audio diputar (MP3 atau teks-ke-suara).

---

# 6. AR Architecture (Aktif)

Halaman AR aktif adalah **`public/learn/ar.html`**, yaitu HTML statis yang memuat A-Frame 1.6.0 dan MindAR 1.2.5 melalui CDN, serta Three.js melalui `AFRAME.THREE`.

```
Kamera perangkat
      ↓
MindAR memindai public/markers/targets.mind
      ↓
mindTargetIndex dari database menentukan target ke-berapa yang dipantau
      ↓
Marker terdeteksi → model GLB dimuat (Cloudflare R2)
      ↓
Pengguna menekan layar (tap)
      ↓
Raycaster menentukan mesh yang tersentuh
      ↓
meshName dibaca → dicocokkan dengan data tahapan
      ↓
Popup detail → pemutar audio / teks-ke-suara
```

Penting:

- `mindTargetIndex` dikirim oleh API (`/api/methods/by-slug/<slug>`); bila kosong di database, sistem memakai nilai bawaan: waterfall `0`, agile `1`, rad `2`.
- Halaman AR memuat **seluruh tahapan metode dalam satu request**, sehingga klik mesh tidak perlu menghubungi database lagi.

---

# 7. Backend Architecture (Alur Permintaan Data)

```
Permintaan (Request)
      ↓
Middleware (hanya untuk route /admin/*)
      ↓
Route Handler Next.js (app/api/...)
      ↓
Validasi input dengan Zod (schemas/index.ts)
      ↓
Query via Drizzle ORM
      ↓
Database Turso (SQLite)
      ↓
Respons JSON + kode status HTTP (200, 201, 400, 404, 500)
```

Kesalahan ditangani terpusat melalui helper `lib/api-error.ts` sehingga seluruh API mengembalikan format error yang konsisten.

---

# 8. Static Asset Architecture (Aset Statis)

Model 3D **tidak pernah disimpan di database**.

| Aset | Lokasi utama | Keterangan |
| --- | --- | --- |
| Model GLB | Cloudflare R2: `https://models.byvictech.site/models/*.glb` | Diambil dari cloud, menyesuaikan kolom `model_path` |
| Cadangan model GLB | `public/models/` | Salinan cadangan, bukan sumber utama |
| Marker (berkas gabungan) | `public/markers/targets.mind` | Seluruh gambar marker dikompilasi menjadi **satu** berkas `.mind` |
| Gambar marker sumber | `public/markers/*.png` | Berkas sumber sebelum dikompilasi |
| Audio | Kolom `audio_url` pada tabel `tahapan` + folder `public/audio/` | Opsional |

Alasan pemisahan ini:

- Loading lebih cepat dan ukuran aplikasi tetap kecil.
- Tidak perlu mengunggah model melalui dashboard admin.
- Database tidak membesar karena berkas binary tidak tersimpan di dalamnya.
- Model hanya terdiri dari tiga metode tetap (Waterfall, Agile, RAD).

---

# 9. Mesh Mapping & Marker (Penghubung Kritis)

Sistem AR bekerja berkat **dua penghubung**. Keduanya harus selalu cocok; **salah satu tidak cocok = fitur AR gagal**.

## 9.1 Penghubung 1: `meshName`

Setiap bagian yang bisa diklik pada model 3D memiliki nama unik (mesh). Nama tersebut sama persis dengan kolom `mesh_name` di tabel `method_steps`.

```
Mesh pada GLB        Kolom database         Konten yang tampil
WF_REQUIREMENTS  ↔   mesh_name       →      Judul, deskripsi, materi, audio
WF_DESIGN        ↔   mesh_name       →      Judul, deskripsi, materi, audio
```

Daftar nama mesh hasil seed:

| Metode | Nama mesh |
| --- | --- |
| Waterfall | `WF_REQUIREMENTS`, `WF_DESIGN`, `WF_IMPLEMENTATION`, `WF_TESTING`, `WF_DEPLOYMENT`, `WF_MAINTENANCE` |
| Agile | `AG_REQUIREMENT`, `AG_DESIGN`, `AG_DEVELOPMENT`, `AG_TESTING`, `AG_DEPLOYMENT`, `AG_REVIEW` |
| RAD | `RAD_REQUIREMENT`, `RAD_DESIGN`, `RAD_CONSTRUCTION`, `RAD_CUTOVER` |

Dengan pendekatan ini, model 3D **tidak menyimpan isi materi**; materi sepenuhnya dikelola lewat database dan dashboard admin.

## 9.2 Penghubung 2: `mindTargetIndex`

Semua gambar marker dikompilasi menjadi satu berkas `public/markers/targets.mind`. **Urutan upload saat kompilasi** menentukan nomor target, dan nomor inilah yang tersimpan di kolom `mind_target_index` tabel `sdlc_methods`.

| Metode | `mindTargetIndex` |
| --- | --- |
| Waterfall | 0 |
| Agile | 1 |
| RAD | 2 |

Jika nomor ini salah, MindAR tetap memindai marker yang benar, tetapi model yang dimuat menjadi salah atau tidak muncul.

---

# 10. Strategi Caching (Performa)

Aplikasi memakai empat lapisan caching agar pengunduhan model dan permintaan data tidak berulang:

| No | Lapisan | Lokasi kode | Cara kerja | Tujuan |
| --- | --- | --- | --- | --- |
| 1 | Cache server halaman metode | `app/home/mulai-belajar/page.tsx` | `unstable_cache` dengan tag `"methods"` dan `revalidate: 3600` detik; di-invalidate oleh `revalidateTag("methods", { expire: 0 })` di API methods (POST/PUT/DELETE). Catatan: pada Next.js 16, `revalidateTag` wajib memakai dua argumen | Daftar metode tidak diambil dari database setiap kali halaman dibuka |
| 2 | Prefetch browser | `components/ModelPreloader.tsx` | Menambahkan `<link rel="prefetch">` hanya untuk `targets.mind` (prefetch seluruh GLB dimatikan agar halaman pemilihan metode tidak lambat; unduhan model kini on-demand saat kartu diklik) | File marker siap dipakai begitu halaman AR dibuka, tanpa membebani jaringan |
| 3 | Cache API `ar-models-v1` | Diisi `app/home/mulai-belajar/MethodCard.tsx` saat kartu diklik; dibaca oleh `public/learn/ar.html` | Model GLB disimpan di browser; klik kedua tidak perlu mengunduh ulang | Menghindari unduhan berulang dan mempercepat pembukaan AR |
| 4 | Service Worker (Serwist) | `app/sw.ts` → `public/sw.js` | Precache app shell + strategi *cache-first* untuk file `.glb` | Aplikasi tetap ringan dan model tersedia meski jaringan sedang tidak stabil |

---

# 11. Request Flow (Alur Data)

Saat pengguna memilih metode dan halaman AR terbuka:

```
GET /api/methods/by-slug/<slug>
        ↓
Respons: data metode + SELURUH daftar tahapan
        ↓
Disimpan di memori halaman AR (JavaScript)
```

Saat pengguna memilih salah satu tahapan:

```
Nama mesh diklik  →  dicari di memori  →  popup muncul
```

Tidak ada permintaan ulang ke server. Keuntungannya:

- Lebih cepat dan popup muncul seketika.
- Mengurangi jumlah permintaan ke server dan database.

Daftar metode pada halaman `/home/mulai-belajar` juga tidak mengambil database setiap kunjungan karena memakai cache server (tag `"methods"`).

---

# 12. Audio Flow

1. Pengguna menekan salah satu tahapan.
2. Sistem memeriksa kolom `audio_url` pada tahapan tersebut.
3. Jika **ada** audio → putar file MP3.
4. Jika **tidak ada** → browser membacakan teks memakai `SpeechSynthesis API` (teks-ke-suara), sehingga materi tetap dapat didengar meski audio belum diunggah.

---

# 13. Component Architecture (Susunan Antarmuka)

## Halaman AR statis (`public/learn/ar.html`)

```
ar.html
├── Overlay loading & status kamera
├── Scene A-Frame
│   ├── Kamera
│   ├── Entity MindAR (mindar-image, target: targets.mind)
│   ├── Entity target + model GLB
│   ├── Pencahayaan
│   └── Raycaster (deteksi klik pada mesh)
├── Popup detail tahapan
└── Pemutar audio / teks-ke-suara
```

## Aplikasi Next.js (React)

```
App
├── Halaman publik (home, mulai-belajar, panduan)
│   ├── MethodCard  (kartu metode + dialog unduh model)
│   └── ModelPreloader (prefetch marker)
├── Dashboard Admin
│   ├── AdminLayout / AdminNavbar / AdminSidebar
│   ├── MethodsTable, StepsTable, UsersTable
│   └── Komponen pendukung (FormField, DataTable, dll.)
└── Komponen UI dasar (shadcn) di components/ui/
```

---

# 14. Folder Architecture (Struktur Folder Aktual)

```
sdlc-ar/
│
├── app/
│   ├── admin/                → dashboard admin (login, methods, steps, users)
│   ├── api/                  → endpoint API
│   │   ├── auth/[...nextauth]/
│   │   ├── dashboard/stats/
│   │   ├── methods/  dan methods/[id]/  dan methods/by-slug/[slug]/
│   │   ├── steps/    dan steps/[id]/
│   │   └── users/    dan users/[id]/
│   ├── home/                 → halaman publik (home, mulai-belajar, panduan)
│   ├── learn/
│   │   ├── [slug]/           → halaman scan versi React (jalur lama)
│   │   └── ar.html           → prototipe lama (TIDAK dipakai)
│   ├── sw.ts                 → sumber Service Worker (di-build ke public/sw.js)
│   ├── layout.tsx
│   └── page.tsx
│
├── ar/                       → utilitas AR React (utils/tts.ts, dll.) — TIDAK aktif
├── components/
│   ├── ar/                   → ARViewer, StepPopup — TIDAK aktif
│   ├── admin/                → komponen UI dashboard
│   ├── ui/                   → komponen dasar shadcn
│   └── ModelPreloader.tsx    → prefetch marker (GLB on-demand)
│
├── db/
│   ├── schema/               → auth.ts, methods.ts, steps.ts, quizzes.ts, relations.ts
│   ├── index.ts              → koneksi database
│   ├── migrate.ts            → menjalankan migration
│   └── seed.ts               → data awal (admin + 3 metode + tahapan)
│
├── docs/                     → dokumentasi proyek
├── lib/                      → auth.ts, api-error.ts, utils.ts
├── schemas/                  → definisi validasi Zod (index.ts)
├── stores/                   → ar-store.ts (Zustand) — TIDAK aktif
├── types/                    → deklarasi tipe (next-auth.d.ts)
│
├── public/
│   ├── learn/ar.html         → HALAMAN AR AKTIF
│   ├── markers/targets.mind  → seluruh marker dalam satu berkas
│   ├── models/               → cadangan model GLB
│   ├── audio/, images/
│   ├── sw.js                 → Service Worker hasil build
│   └── manifest.json
│
├── middleware.ts             → penjaga route /admin/*
├── drizzle.config.ts
├── AGENTS.md / README.md
└── package.json
```

---

# 15. Data Separation (Pemisahan Data)

| Jenis data | Sifat | Contoh | Tempat |
| --- | --- | --- | --- |
| Statis | Tidak berubah | Model GLB, marker, texture | Cloudflare R2 dan `public/` |
| Dinamis | Bisa diubah lewat dashboard admin | Nama metode, deskripsi, tahapan, isi materi, audio URL | Turso (SQLite) |

Model 3D tidak pernah masuk database; konten pembelajaran tidak pernah disematkan di dalam file GLB.

---

# 16. Autentikasi & Keamanan

| Aspek | Implementasi |
| --- | --- |
| Login admin | NextAuth v5 metode Credentials (email + kata sandi) |
| Penyimpanan kata sandi | bcrypt (kata sandi di-hash, tidak disimpan apa adanya) |
| Sesi login | JWT (token login) |
| Penjaga halaman | `middleware.ts` memeriksa login untuk seluruh route `/admin/*`; pengguna yang belum login diarahkan ke `/admin/login` |
| Validasi input | Zod pada setiap request API |

**Known issue (diketahui, belum ditangani):** endpoint API untuk methods, steps, dan users saat ini **belum memeriksa status login**; perlindungan utama baru ada di lapisan halaman admin (`middleware`). Pemeriksaan autentikasi di API menjadi rencana perbaikan.

---

# 17. Build & Deployment

| Kegiatan | Perintah | Keterangan |
| --- | --- | --- |
| Development | `npm run dev` | Server pengembangan dengan Turbopack |
| Build produksi | `next build --webpack` | Turbopack sengaja dimatikan karena belum kompatibel dengan Serwist (Service Worker) |
| Jalankan hasil build | `npm start` | Menjalankan aplikasi hasil build |
| Lint | `npm run lint` | Pemeriksaan gaya kode ESLint |
| Perubahan skema DB | `npx drizzle-kit generate` / `push` | Membuat dan menjalankan migration |
| Data awal | `npx tsx db/seed.ts` | Mengisi admin dan metode bawaan |
| Deployment | Vercel | Sesuai keputusan arsitektur |
| Hosting model 3D | Cloudflare R2 | `https://models.byvictech.site/models/*.glb` |

---

# 18. Future Architecture (Fitur Masa Depan)

Arsitektur dirancang agar fitur berikut dapat ditambahkan tanpa mengubah struktur utama. **Ketiganya belum diimplementasikan pada versi ini.**

| Fitur | Alur singkat | Status |
| --- | --- | --- |
| AI Assistant | Tombol mengambang → jendela chat → LLM API → respons dengan konteks tahapan yang sedang dipelajari | Belum diimplementasi |
| Quiz | Tahapan → daftar pertanyaan (tabel `quizzes` sudah tersedia) → jawaban → skor | Belum diimplementasi (tabel sudah ada, belum dipakai UI) |
| Progress Learning | Pengguna → riwayat belajar → progres → pencapaian | Belum diimplementasi |

---

# 19. Design Principles

| Prinsip | Penerapan |
| --- | --- |
| Separation of Concerns | Model 3D dipisahkan dari data pembelajaran |
| Low Coupling | Model hanya mengenal nama mesh; database hanya mengenal `meshName` |
| High Cohesion | Setiap modul memiliki tanggung jawab yang jelas |
| Scalability | Fitur AI, Quiz, dan Progress dapat ditambahkan tanpa mengubah struktur utama |
| Maintainability | Admin hanya mengelola konten; developer hanya mengelola model 3D; keduanya tidak saling bergantung |

---

# 20. Architecture Decisions

| Keputusan | Alasan |
| --- | --- |
| Next.js | Satu kerangka untuk halaman sekaligus API |
| Turso | SQLite yang ringan dan mudah dideploy di cloud |
| Drizzle ORM | Akses database yang aman terhadap tipe data |
| MindAR | Image tracking open source, berjalan langsung di browser |
| A-Frame + Three.js (via CDN) | Menyusun scene 3D halaman AR tanpa proses build tambahan |
| Model GLB di Cloudflare R2 | Unduhan model besar tidak membebani server aplikasi |
| `meshName` mapping | Menghubungkan objek 3D dengan database tanpa menyimpan konten di dalam GLB |
| `mindTargetIndex` | Menentukan marker ke-berapa di `targets.mind` yang dipantau tiap metode |
| Cache bertingkat (server, prefetch, Cache API, Service Worker) | Mengurangi unduhan dan permintaan berulang |
| Browser TTS fallback | Audio tetap tersedia meski MP3 belum diunggah |
| Single fetch per method | Mengurangi request dan meningkatkan kecepatan popup |

---

# 21. Summary

Arsitektur aplikasi menggunakan pendekatan **Static 3D + Dynamic Learning Content**.

Model 3D hanya berfungsi sebagai media interaksi dan dihosting di Cloudflare R2, sedangkan seluruh materi pembelajaran, audio, dan informasi tahapan dikelola melalui database Turso. Hubungan antara objek 3D dan data dilakukan melalui dua penghubung, yaitu `meshName` dan `mindTargetIndex`, sehingga sistem menjadi ringan, mudah dipelihara, dan siap dikembangkan dengan fitur AI Assistant, Quiz, serta Progress Learning pada versi berikutnya. Halaman AR yang aktif saat ini adalah `public/learn/ar.html` berbasis A-Frame dan MindAR; komponen AR berbasis React Three Fiber/Zustand tersisa sebagai kode lama dan tidak dipakai di produksi.
