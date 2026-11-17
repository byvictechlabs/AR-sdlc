# CODEBASE_MAP — Peta Kode Lengkap

> **Dokumen ini menjelaskan SETIAP folder dan file dalam proyek:** fungsinya apa,
> alurnya bagaimana, dan hubungannya dengan file lain.
>
> Baca bersamaan dengan:
>
> - [`README.md`](../README.md) — overview, install, deploy, troubleshooting
> - [`ARCHITECTURE.md`](./ARCHITECTURE.md) — keputusan arsitektur
> - [`DATABASE.md`](./DATABASE.md) — desain database
> - [`AR_SYSTEM.md`](./AR_SYSTEM.md) — detail sistem AR

---

## Ringkasan untuk Pembaca

Dokumen ini adalah **peta isi repository** — panduan "file mana yang mengurus apa"
untuk developer, reviewer, atau penguji skripsi yang ingin menelusuri kode.
Pembaca non-teknis cukup memahami **§3 (Alur Utama Sistem)** untuk mengetahui
cara kerja aplikasi dari layar pengguna sampai database; bagian §5 (referensi
per-file) ditujukan untuk yang akan membaca atau mengubah kode.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
|---|---|
| **Halaman / Page** | Satu layar di aplikasi (misal `/home`), dibuat dari file `page.tsx`. |
| **Server component** | Komponen React yang dijalankan di server (data diambil langsung dari database). |
| **Client component** | Komponen React yang dijalankan di browser (bereaksi terhadap klik pengguna). |
| **API / Route handler** | Alamat layanan (misal `/api/methods`) yang mengembalikan data dalam format JSON. |
| **CRUD** | Singkatan Create–Read–Update–Delete: tambah, lihat, ubah, hapus data. |
| **Database** | Penyimpanan data permanen (di proyek ini: Turso). |
| **ORM (Drizzle)** | Cara membaca/menulis database lewat kode TypeScript, bukan SQL manual. |
| **Migration** | Berkas perubahan struktur database yang bisa dijalankan ulang. |
| **Validasi (Zod)** | Pemeriksaan data masuk sebelum disimpan agar tidak ada data salah/rusak. |
| **Cache / ISR / revalidate** | Menyimpan hasil sementara agar tidak dihitung ulang terus; `revalidateTag` menghapus cache dari sisi server saat admin menyimpan data. |
| **Service Worker (SW)** | Skrip kecil di browser yang menyimpan file (model 3D) agar tidak diunduh ulang. |
| **Cache API (`ar-models-v1`)** | Tempat penyimpanan file model di browser, diisi saat pengguna mengklik kartu metode. |
| **Middleware** | Skrip yang berjalan sebelum halaman dibuka — di sini untuk menjaga route `/admin`. |
| **Auth / NextAuth** | Sistem login (email + password) untuk admin. |
| **Slug** | Versi nama yang ramak URL, misal `agile`, `mulai-belajar`. |
| **Static HTML (`ar.html`)** | Halaman HTML biasa di luar React — dipakai untuk pengalaman AR agar tidak bentrok dengan A-Frame. |
| **Mesh** | Satu potongan objek 3D = satu tahapan SDLC. |
| **GLB** | Format file model 3D. |
| **Stage model** | Model 3D khusus satu tahap yang menggantikan model utama saat tahap diklik; sumbernya kolom `stageModelUrl` atau model hardcode di `public/learn/stages/<metode>/<tahap>.js` (registry `STAGE_BUILDERS["<metode>/<tahap>"]` di `stage-models.js`, dipilih via `detectMethod()` + `detectStageType()`). |
| **Marker / MindAR / A-Frame** | Lihat glosarium di [`AR_SYSTEM.md`](./AR_SYSTEM.md). |

---

## Daftar Isi

1. [Cara Baca Dokumen Ini](#1-cara-baca-dokumen-ini)
2. [Peta Dependensi Antar-Lapisan](#2-peta-dependensi-antar-lapisan)
3. [Alur Utama Sistem](#3-alur-utama-sistem)
4. [Struktur Folder (Annotated)](#4-struktur-folder-annotated)
5. [Referensi File per Folder](#5-referensi-file-per-folder)
   - [5.1 Root — Config &amp; Setup](#51-root--config-setup)
   - [5.2 app/ — Halaman &amp; API](#52-app--halaman--api)
   - [5.3 components/ — Komponen React](#53-components--komponen-react)
   - [5.4 db/ — Database](#54-db--database)
   - [5.5 lib/, schemas/, stores/, types/, ar/ — Library](#55-lib-schemas-stores-types-ar--library)
   - [5.6 public/ — Aset Statis](#56-public--aset-statis)
   - [5.7 docs/ — Dokumentasi](#57-docs--dokumentasi)
6. [Tabel Hubungan Kunci File ↔ File](#6-tabel-hubungan-kunci-file--file)
7. [Kode Mati &amp; Catatan Teknis](#7-kode-mati--catatan-teknis)

---

## 1. Cara Baca Dokumen Ini

### Untuk developer baru — urutan baca yang disarankan

```
Step 1  README.md            → "Aplikasi ini apa? Cara install & deploy?"
                                ↓
Step 2  Dokumen ini §3       → "Alurnya bagaimana?" (user flow, AR flow, caching)
                                ↓
Step 3  Dokumen ini §4-§5    → "File mana yang ngapain?" (cari file yang mau diubah)
                                ↓
Step 4  docs/ARCHITECTURE.md → "Kenapa desainnya begini?" (static HTML, mesh mapping)
                                ↓
Step 5  Baca file-nya         → Ikuti hubungan di §5 & §6 untuk telusuri dependensi
```

### Konvensi penulisan di dokumen ini

| Notasi                     | Arti                                                    |
| -------------------------- | ------------------------------------------------------- |
| **`app/page.tsx`** | File — path relatif dari root repo                     |
| *dipanggil oleh*         | File ini adalah**konsumen/pemanggil** file target |
| *mengimpor*              | File ini**bergantung** ke file target             |
| ⭐                         | File kritis — perubahan di sini berdampak luas         |
| 🗑                         | Kode mati / tidak dipakai (lihat §7)                   |
| 🔒                         | Terproteksi auth (middleware)                           |
| 🌐                         | Endpoint publik (tanpa auth, by design)                 |

---

## 2. Peta Dependensi Antar-Lapisan

```
═══════════════════════ LAPISAN PRESENTATION (React / Next.js) ═════════════════════

  app/page.tsx ──► app/home/page.tsx ──► app/home/mulai-belajar/page.tsx
  (splash)         (menu)                 │  [server, unstable_cache tag:"methods"]
                                           │
                                           ├─► components/ModelPreloader.tsx  (prefetch marker)
                                           └─► app/home/mulai-belajar/MethodCard.tsx
                                                 │  [client: preload → Cache API → navigate]
                                                 ▼
  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                                                 │  window.location.href
                                                 ▼
═══════════════════════ LAPISAN AR (Static HTML, di luar React) ══════════════════════

                              ⭐ public/learn/ar.html
                                 │
        ┌────────────────────────┼──────────────────────────┐
        ▼                        ▼                          ▼
  fetch API (data)        download GLB (model)       Service Worker
  /api/methods/           R2: models.byvictech.site   app/sw.ts → public/sw.js
  by-slug/{slug}          (cache: ar-models-v1)       (cache-first .glb)
        │
        ▼
═══════════════════════ LAPISAN API (Route Handlers) ═══════════════════════════════

  app/api/methods/by-slug/[slug] ──┐   (🌐 dipakai ar.html)
  app/api/methods (+ [id]) ────────┤   (dipakai MethodsTable, revalidateTag "methods")
  app/api/steps (+ [id]) ──────────┤   (dipakai StepsTable)
  app/api/users (+ [id]) ──────────┤   (dipakai UsersTable)
  app/api/auth/[...nextauth] ──────┤   (dipakai signIn() di login page)
  app/api/dashboard/stats ─────────┘   (dipakai admin dashboard)
                 │
                 ▼  semuanya import
═══════════════════════ LAPISAN DATA (Drizzle + Turso) ═════════════════════════════

  db/index.ts (koneksi) ◄── lib/auth.ts (login query)
        │
        ▼
  db/schema/*  (methods, steps, auth, quizzes, relations)
        │
        ▼
  Turso (cloud) / local.db (dev)

═══════════════════════ Lapisan Silang ══════════════════════════════════════════════

  middleware.ts ──► lib/auth.ts ──► db/        (jaga route /admin/*)
  lib/api-error.ts ◄── SEMUA route API         (penerjemah error → JSON status)
  schemas/index.ts ◄── API methods & steps      (validasi Zod)
```

---

## 3. Alur Utama Sistem

### 3.1 Alur Pengguna (Happy Path)

```
①  /  (app/page.tsx)                      splash, klik "Mulai Belajar"
       │
②  /home  (app/home/page.tsx)             menu utama, klik "Mulai Belajar"
       │
③  /home/mulai-belajar                     server component query DB (cached 1j)
       │   ├─ ModelPreloader: prefetch targets.mind (GLB on-demand di klik kartu)
       │   └─ MethodCard per metode (published only)
       │         │  klik kartu
       │         ▼
       │   [MethodCard.tsx] download GLB → simpan di Cache API "ar-models-v1"
       │         │  (kalau sudah ada di cache → lewati, navigate instan)
       │         ▼
④  /learn/ar.html?method={slug}           static HTML (bukan React!)
       │   ├─ fetch /api/methods/by-slug/{slug}  → method + steps + targetIndex
       │   ├─ loadFromDB non-blocking, fallback 5 detik
       │   ├─ applyTargetIndex(n)  → patch anchor MindAR (BUGFIX kritis)
       │   ├─ user klik "Mulai Kamera"
       │   ├─ MindAR scan marker ke-n di targets.mind
       │   ├─ targetFound → model muncul (dari cache, <1 detik)
       │   ├─ tap mesh → raycaster → resolveMeshName → stepsData[mesh]
       │   │        → highlight hijau + model tahap + tombol aksi → popup + TTS
       │   └─ gesture: drag=rotate Y, pinch=zoom
       │
⑤  Kembali / tutup → selesai
```

### 3.2 Alur Data Dinamis (Konten dari Database)

```
Admin ubah data                    Pengguna scan
      │                                 │
      ▼                                 ▼
CRUD di /admin/* ─► API routes    ar.html fetch by-slug API
      │                 │              │
      │    revalidateTag("methods")    │
      │         │ (methods only)       │
      │         ▼                      │
      │  unstable_cache di             │
      │  /home/mulai-belajar           │
      │  (revalidate 3600s)            │
      │                                │
      └──────────► Turso DB ◄──────────┘
                   (satu-satunya sumber konten dinamis)
```

> **Aturan emas:** GLB & marker = **static asset** (R2 / `public/`).
> Konten belajar (title, description, content, audio) = **database**.
> Penghubungnya cuma 2: **`meshName`** dan **`mindTargetIndex`**.

### 3.3 Alur Caching (4 Lapis)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Lapis 1 — ISR/unstable_cache (server, tag "methods", revalidate 1 jam)  │
│   File: app/home/mulai-belajar/page.tsx                                  │
│   Dibatalkan oleh: revalidateTag() di API methods (POST/PUT/DELETE)      │
├──────────────────────────────────────────────────────────────────────────┤
│ Lapis 2 — <link rel=prefetch> (browser, best-effort)                     │
│   File: components/ModelPreloader.tsx → hanya /markers/targets.mind      │
│   (prefetch GLB DIMATIKAN — unduh model on-demand saat klik kartu)       │
├──────────────────────────────────────────────────────────────────────────┤
│ Lapis 3 — Cache API "ar-models-v1" (client, saat klik kartu)             │
│   File: MethodCard.tsx (tulis) ↔ ar.html (baca)                         │
│   Aturan: URL sama = serve lama → ganti URL untuk bust cache             │
├──────────────────────────────────────────────────────────────────────────┤
│ Lapis 4 — Service Worker (app/sw.ts → public/sw.js)                      │
│   • Serwist precache: app shell (HTML/JS/CSS), auto-update saat deploy   │
│   • Fetch handler: cache-first untuk .glb & /models/                     │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Alur Admin & Auth

```
/admin/* ──► middleware.ts (matcher /admin/:path*)
                │  belum login  ──► /admin/login
                │  sudah login & buka /admin/login ──► /admin
                ▼
          lib/auth.ts (NextAuth v5, Credentials + JWT, role di token)
                │
                ▼ bcrypt compare
          db/schema/users

Setelah login:
  /admin          → dashboard (fetch /api/dashboard/stats)
  /admin/methods  → MethodsTable (CRUD + revalidateTag)
  /admin/steps    → StepsTable  (CRUD, meshName wajib UPPERCASE)
  /admin/users    → UsersTable  (create + delete)
```

### 3.5 Alur Runtime AR (di dalam `public/learn/ar.html`)

> **Catatan file split (2 tahap → lalu dipisah per metode):** logika model 3D tahap dipecah jadi tiga tempat — elemen HTML + CSS tetap di **`public/learn/ar.html`** (1349 baris); logika inti di **`public/learn/stage-models.js`** (206 baris: state `stageToken`/`stageStep`, `showStageCTA()`/`hideStageCTA()`/`openDetailFromStage()`, `detectStageType()`, `detectMethod()`, helper `stageEntity()`/`stageBox()`/`stageWrap()`, `hideStageModel()`, `activateStageSwap()`, `fitStageGltf()`, `showStageModel()`); isi 21 model (7 tahap × 3 metode) di **`public/learn/stages/<metode>/<tahap>.js`** (folder `waterfall/`, `agile/`, `rad/`) yang mendaftarkan dirinya ke registry global `STAGE_BUILDERS` (dihubungkan sebagai `STAGE_BUILDERS["<metode>/<tahap>"] = function () { ... }` — dipisah per metode agar isi tiap metode boleh beda).
>
> **Urutan `<script>` di ar.html (baris 348–369, wajib berurutan):** `stage-models.js` (hub — mendeklarasikan `const STAGE_BUILDERS = {}`) → 21 file builder: `stages/waterfall/*.js` (baris 349–355), `stages/agile/*.js` (baris 356–362), `stages/rad/*.js` (baris 363–369) (mengisi registry) → script inline utama ar.html (baris 370). Hub **wajib** dimuat sebelum file `stages/`, dan semua **wajib** sebelum script inline. Posisi ar.html baris 1171 kini berisi komentar penunjuk bahwa logikanya sudah pindah. Perilaku aplikasi tidak berubah — murni pemisahan file.

```
Page load
  │
  ├─ init()
  │    ├─ pasang event listeners (arReady, loaded → setupGestures, targetFound/Lost)
  │    ├─ loadFromDB()  [tanpa await — non-blocking]
  │    │     ├─ fetch /api/methods/by-slug/{cleanSlug}  (timeout 5s)
  │    │     ├─ methodCfg.targetIndex = data.mindTargetIndex
  │    │     ├─ applyTargetIndex(idx) ──► setAttribute + patch anchorEntities MindAR
  │    │     ├─ stepsData = { meshName → step }   ← kunci klik mesh
  │    │     └─ gagal? fallback config hardcoded
  │    └─ register service worker
  │
  ├─ user klik "Mulai Kamera" → MindAR start
  │
  ├─ targetFound(index sesuai) → isTracking = true
  │     └─ loadModel() → loadModelWithProgress()
  │           ├─ cek Cache API dulu (ar-models-v1)
  │           ├─ tidak ada? fetch dengan progress bar
  │           └─ model-loaded event → sembunyikan overlay
  │
  └─ interaksi
        ├─ tap  → handleClick() → if (stageStep) return   [mode tahap: tap diabaikan]
        │           → findStageNameAt() [raycaster + bounding sphere]
        │           → resolveMeshName() (walk parent, prefer nama yang cocok DB)
        │           → stepsData[name]? → showStageModel(step, name) → boolean
        │                 true  → model tahap tampil (GLB stageModelUrl → STAGE_BUILDERS)
        │                         + showStageCTA()  [tombol "📋 Lihat Penjelasan" + "✕"]
        │                 false → openPopup() langsung [tanpa model tahap, perilaku lama]
        │                              : → toast "mesh belum ada di data admin"
        │           → highlight hijau + feedback
        ├─ tombol "📋 Lihat Penjelasan" → openDetailFromStage() → openPopup()
        │        (openPopup menyembunyikan tombol aksi)
        ├─ tutup popup (✕/backdrop) → showStageCTA() lagi (model tahap tetap tampil)
        ├─ tombol "✕" aksi / targetLost → hideStageModel()
        │        (keluar mode tahap: bersihkan stageStep + tombol aksi + stageToken)
        ├─ drag → rotasi sumbu Y saja (dy sengaja diabaikan)
        └─ pinch→ scale 0.08–3.0 (default 0.35)
```

---

## 4. Struktur Folder (Annotated)

```
sdlc-ar/
│
├── app/                        ─ Next.js App Router: halaman + API
│   ├── page.tsx                   splash "/"
│   ├── layout.tsx                 root layout (font, metadata PWA, Toaster)
│   ├── globals.css                design token shadcn + Tailwind v4
│   ├── sw.ts                      ⭐ source service worker (→ public/sw.js)
│   │
│   ├── home/                      halaman publik
│   │   ├── page.tsx                 menu "/"
│   │   ├── loading.tsx              skeleton
│   │   ├── mulai-belajar/
│   │   │   ├── page.tsx             ⭐ pilih metode (unstable_cache)
│   │   │   ├── MethodCard.tsx       ⭐ preload GLB + navigate
│   │   │   └── loading.tsx          skeleton
│   │   └── panduan/page.tsx         panduan statis
│   │
│   ├── learn/
│   │   ├── [slug]/page.tsx          redirect → /learn/ar.html?method=
│   │   ├── [slug]/ScanPage.tsx      🗑 tidak dipakai
│   │   └── ar.html                  🗑 STALE (prototipe lama, BUMDES!)
│   │
│   ├── admin/                     🔒 semua dijaga middleware
│   │   ├── layout.tsx               shell sidebar+navbar (pass auth() ke client)
│   │   ├── page.tsx                 dashboard stats
│   │   ├── login/page.tsx           form signIn("credentials")
│   │   ├── methods/  (page + MethodsTable)   CRUD methods
│   │   ├── steps/    (page + StepsTable)     CRUD steps
│   │   └── users/    (page + UsersTable)     CRUD users
│   │
│   └── api/                       semua error → lib/api-error
│       ├── auth/[...nextauth]/      NextAuth handler
│       ├── dashboard/stats/         hitung methods/steps/users
│       ├── methods/                 GET list, POST (+revalidateTag)
│       ├── methods/[id]/            GET/PUT/DELETE (+revalidateTag)
│       ├── methods/by-slug/[slug]/  🌐 GET untuk ar.html ⭐
│       ├── steps/ + steps/[id]/     CRUD steps
│       └── users/ + users/[id]/     CRUD users
│
├── components/
│   ├── ui/                        ─ shadcn/ui (button, dialog, input, dll)
│   ├── admin/                     ─ shell & widget admin
│   │   ├── index.ts                 barrel export
│   │   ├── AdminLayout/Sidebar/Navbar
│   │   └── PageHeader, StatCard, StatusBadge, SearchInput, EmptyState,
│   │       DeleteDialog, FormField, Toolbar, DataTablePagination
│   ├── ar/                        ─ 🗑 versi React dari AR (tidak dipakai)
│   │   ├── ARViewer.tsx
│   │   └── StepPopup.tsx
│   └── ModelPreloader.tsx         ⭐ prefetch marker (GLB on-demand)
│
├── db/
│   ├── index.ts                    koneksi Drizzle ↔ Turso ⭐
│   ├── migrate.ts                  jalankan SQL migration (npm run db:migrate)
│   ├── seed.ts                     data awal: admin + 3 methods + 16 steps
│   ├── schema/                     definisi tabel (Drizzle)
│   │   ├── methods.ts, steps.ts, auth.ts, quizzes.ts, relations.ts, index.ts
│   └── migrations/                 SQL hasil drizzle-kit generate
│
├── lib/
│   ├── auth.ts                     ⭐ NextAuth v5 config (Credentials+JWT)
│   ├── api-error.ts                ⭐ error → JSON status (dipakai semua API)
│   └── utils.ts                    cn() helper Tailwind
│
├── schemas/index.ts                ⭐ validasi Zod (methodSchema, stepSchema)
├── stores/ar-store.ts              🗑 Zustand store (hanya dipakai ar/*)
├── ar/utils/tts.ts                 🗑 wrapper TTS (hanya dipakai StepPopup)
├── types/next-auth.d.ts            augmentasi tipe role NextAuth
│
├── middleware.ts                   🔒 jaga /admin/* via lib/auth
│
├── public/                         ─ aset yang di-serve apa adanya
│   ├── learn/ar.html               ⭐⭐ AR ENGINE (file terpenting, 1349 baris; popup, gesture, init)
│   ├── learn/stage-models.js       ⭐ hub model 3D tahap + tombol aksi (206 baris; registry kosong)
│   ├── learn/stages/<metode>/      ⭐ 21 builder model tahap (waterfall/ agile/ rad/ × 7 tahap; 33–417 baris)
│   ├── markers/targets.mind        ⭐ compiled MindAR target (SEMUA marker)
│   ├── markers/targets3.mind       🗑 backup compile lama
│   ├── models/agile-2.glb          backup model lokal
│   ├── lib/mindar/*.js             🗑 vendor MindAR lama (ga dipakai, load dari CDN)
│   ├── images/, manifest.json      ikon PWA
│   └── sw.js                       generated dari app/sw.ts — JANGAN edit
│
├── docs/                          ─ dokumentasi proyek (lihat §5.7)
├── AGENTS.md, CLAUDE.md            instruksi untuk AI agent
├── README.md                      overview & panduan lengkap
│
├── middleware.ts / next.config.ts / drizzle.config.ts / eslint.config.mjs /
│   tsconfig.json / postcss.config.mjs / components.json
│
├── dev.db, local.db                SQLite lokal (gitignored)
└── .env, .env.local, .env.example  environment variables
```

---

## 5. Referensi File per Folder

### 5.1 Root — Config & Setup

| File                                    | Fungsi                                                                                                                                                                                              | Hubungan                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`middleware.ts`** 🔒          | Jaga route`/admin/:path*`: belum login → `/admin/login`, sudah login → `/admin`.                                                                                                            | Mengimpor`lib/auth.ts`. Dipanggil runtime Next.js.                               |
| **`next.config.ts`**            | Config Next.js 16 + plugin Serwist:`app/sw.ts` → `public/sw.js`, cache ≤50MB, hanya aktif di production. Juga `serverExternalPackages: ["@libsql/client"]` + `allowedDevOrigins` (ngrok). | Mengimpor`@serwist/next`. Output-nya: `public/sw.js`.                          |
| **`drizzle.config.ts`**         | Config Drizzle Kit (generate/push migration). Schema:`db/schema/index.ts`, output `db/migrations/`.                                                                                             | Dipakai script`npm run db:generate/push/studio`.                                 |
| **`package.json`**              | Scripts:`dev` (turbopack), **`build` = `next build --webpack`** (Turbopack dimatikan karena Serwist), `db:migrate`, `db:seed`, `lint`.                                            | —                                                                                 |
| **`tsconfig.json`**             | TS strict, alias`@/*` → root.                                                                                                                                                                    | Semua file TS memakai alias`@/`.                                                 |
| **`eslint.config.mjs`**         | Flat config Next (core-web-vitals + TS), ignore`public/lib/**`.                                                                                                                                   | `npm run lint`.                                                                  |
| **`postcss.config.mjs`**        | Plugin`@tailwindcss/postcss` (Tailwind v4).                                                                                                                                                       | Styling`app/globals.css`.                                                        |
| **`components.json`**           | Config shadcn CLI (style base-nova, alias`@/components`).                                                                                                                                         | Menjelaskan asal`components/ui/*`.                                               |
| **`.env.example`**              | Template env. ⚠️**Tidak konsisten** — kode baca `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`, template tulis `DATABASE_URL`.                                                              | Dipakai:`db/index.ts`, `drizzle.config.ts`, `db/migrate.ts`, `db/seed.ts`. |
| **`AGENTS.md` / `CLAUDE.md`** | Instruksi untuk AI agent (CLAUDE.md cuma`@AGENTS.md`).                                                                                                                                            | Dibaca AI sebelum ngoding.                                                         |

### 5.2 app/ — Halaman & API

#### Halaman publik

| File                                             | Fungsi                                                                                                                                                                                                                                                                               | Dipanggil oleh / Mengimpor                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                                 | Splash`/`: judul, gambar, tombol "Mulai Belajar" → `/home`. Statis.                                                                                                                                                                                                             | Next runtime →`app/home/page.tsx`                                                                                    |
| `app/layout.tsx`                               | Root layout: font Poppins+JetBrains Mono, metadata PWA (manifest), viewport kunci zoom (`userScalable:false` — penting untuk AR), mount `<Toaster>`.                                                                                                                            | Mengimpor`./globals.css`, `sonner`. Dipakai semua page.                                                             |
| `app/globals.css`                              | Token tema shadcn (oklch), variant dark, util`safe-top/bottom` (safe-area iPhone).                                                                                                                                                                                                 | Di-import`app/layout.tsx`.                                                                                            |
| `app/home/page.tsx`                            | Menu`/`: hero + 2 tombol (mulai-belajar, panduan). Statis.                                                                                                                                                                                                                         | →`/home/mulai-belajar`, `/home/panduan`                                                                            |
| `app/home/loading.tsx`                         | Skeleton`/home`.                                                                                                                                                                                                                                                                   | Otomatis Next.                                                                                                          |
| **`app/home/mulai-belajar/page.tsx`** ⭐ | Daftar metode**published** (query `sdlcMethods` via `unstable_cache` — revalidate 3600s, **tag `"methods"`**), map ke kartu + `ModelPreloader`.                                                                                                                 | Query langsung`@/db`. Mengimpor `ModelPreloader`, `./MethodCard`. ⚠️ ada fungsi `getMethodIcon` tak terpakai. |
| `app/home/mulai-belajar/MethodCard.tsx` ⭐     | **Client component.** Klik kartu → cek Cache API `ar-models-v1` → kalau kosong download GLB (fetch + progress) → simpan → `window.location.href = /learn/ar.html?method={slug}`. Ada reset state via `pageshow` (bfcache). Ikon dikirim sebagai string `iconName`. | Mengimpor nothing berat. Menuju`public/learn/ar.html`.                                                                |
| `app/home/mulai-belajar/loading.tsx`           | Skeleton grid kartu.                                                                                                                                                                                                                                                                 | Otomatis Next.                                                                                                          |
| `app/home/panduan/page.tsx`                    | Panduan statis 6 langkah (termasuk alur model 3D per tahap + tombol aksi). Statis.                                                                                                                                                                                                                                              | →`/home`                                                                                                             |

#### Halaman belajar / AR

| File                                 | Fungsi                                                                                                                                                               | Hubungan                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `app/learn/[slug]/page.tsx`        | **Hanya redirect**: `/learn/agile` → `/learn/ar.html?method=agile`.                                                                                       | `next/navigation` redirect.             |
| `app/learn/[slug]/ScanPage.tsx` 🗑 | Cek dukungan AR + render`ARViewer`. **Tidak dipakai** (tak ada importer).                                                                                    | Akan mengimpor`components/ar/ARViewer`. |
| `app/learn/ar.html` 🗑             | **STALE** — prototipe lama "AR BumDes" (A-Frame 1.4.2, model lokal `./assets/*.glb`, tanpa API). Bukan route valid, tak terservis. **Jangan diedit.** | Yang benar:`public/learn/ar.html`.      |

#### Halaman admin 🔒

| File                                   | Fungsi                                                                                                                                                                                                     | API yang dipakai                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `app/admin/layout.tsx`               | Ambil`auth()` → teruskan ke `AdminLayout` (client). Membungkus semua `/admin/*` termasuk login.                                                                                                     | `lib/auth.ts`                                             |
| `app/admin/page.tsx`                 | Dashboard: 3 StatCard + quick actions. Client fetch.                                                                                                                                                       | `GET /api/dashboard/stats`                                |
| `app/admin/login/page.tsx`           | Form login →`signIn("credentials", {redirect:false})` → `/admin`.                                                                                                                                    | `POST /api/auth/[...nextauth]`                            |
| `app/admin/methods/page.tsx`         | Server: query semua methods (urut sortOrder) →`MethodsTable`.                                                                                                                                           | Query`@/db`                                               |
| `app/admin/methods/MethodsTable.tsx` | CRUD methods: create/edit/delete, search, filter status. Field: name, slug, description, modelPath, markerPath, status, sortOrder,**mindTargetIndex**. Dialog edit `max-h-[70vh] overflow-y-auto`. | `GET/POST /api/methods`, `PUT/DELETE /api/methods/[id]` |
| `app/admin/steps/page.tsx`           | Server: query steps (join methods, select ikut kolom baru **stageModelUrl**) + list methods.                                                                                                                                                         | Query`@/db`                                               |
| `app/admin/steps/StepsTable.tsx`     | CRUD steps: field methodId,**meshName** (di-uppercase otomatis), title, description, content, imageUrl, audioUrl, **stageModelUrl** (FormField *"Stage Model URL (opsional — GLB 3D tahap di R2)"*, placeholder `https://models.byvictech.site/models/stages/design.glb`), stepOrder. Validasi regex `^[A-Z0-9_]+$`.                                        | `GET/POST /api/steps`, `PUT/DELETE /api/steps/[id]`     |
| `app/admin/users/page.tsx`           | Server: daftar user.                                                                                                                                                                                       | Query`@/db`                                               |
| `app/admin/users/UsersTable.tsx`     | Create + delete user (tanpa edit).                                                                                                                                                                         | `POST /api/users`, `DELETE /api/users/[id]`             |

#### API Routes

Semua error dilempar ke **`lib/api-error.ts`** (Zod→400, UNIQUE→409, FK→400, else→500).

| Route                                       | Methods                  | Fungsi                                                                                                             | Catatan                                                   |
| ------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `api/auth/[...nextauth]`                  | GET, POST                | Handler NextAuth v5.                                                                                               | Dari`lib/auth.ts`.                                      |
| `api/dashboard/stats`                     | GET                      | Hitung rows methods/steps/users.                                                                                   | Tanpa auth check (aman via middleware di halaman).        |
| `api/methods`                             | GET, POST                | List / create method (validasi`methodSchema`).                                                                   | POST →`revalidateTag("methods",{expire:0})` 🌐         |
| `api/methods/[id]`                        | GET, PUT, DELETE         | CRUD per id.                                                                                                       | PUT/DELETE →`revalidateTag` 🌐                         |
| **`api/methods/by-slug/[slug]`** ⭐ | GET                      | **Dipakai `ar.html`.** Method by slug + steps (semua kolom, termasuk `stageModelUrl`), fallback `mindTargetIndex` (waterfall:0, agile:1, rad:2). | 🌐 tanpa cache, by design.                                |
| `api/steps`, `api/steps/[id]`           | GET/POST, GET/PUT/DELETE | CRUD steps (validasi`stepSchema`; GET/POST/PUT otomatis ikut menangani **stageModelUrl**).                                                                               | **Tanpa revalidateTag** — konten step selalu live. |
| `api/users`, `api/users/[id]`           | GET/POST, DELETE         | CRUD user (bcrypt cost 12, password ≥6).                                                                          | ⚠️ Tanpa auth check.                                    |

### 5.3 components/ — Komponen React

| File                                                                                                                | Fungsi                                                                                                                     | Dipakai oleh                                             |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **`ModelPreloader.tsx`** ⭐                                                                                 | Client — inject`<link rel="prefetch">` untuk `/markers/targets.mind` saat mount (prefetch GLB dimatikan agar halaman tidak lambat — unduhan model on-demand di MethodCard). Render null. | `app/home/mulai-belajar/page.tsx`                      |
| `ui/*.tsx` (16 file)                                                                                              | Komponen shadcn/ui: button, dialog, input, select, table, tabs, dll.                                                       | Semua halaman admin & login.`cn()` dari `lib/utils`. |
| `admin/index.ts`                                                                                                  | Barrel: PageHeader, StatCard, StatusBadge, SearchInput, EmptyState, DeleteDialog, FormField, Toolbar, DataTablePagination. | Semua halaman admin.                                     |
| `admin/AdminLayout.tsx`                                                                                           | Shell client: sidebar collapsible + navbar + konten.                                                                       | `app/admin/layout.tsx`                                 |
| `admin/AdminSidebar.tsx`                                                                                          | Sidebar gelap, menu aktif via`usePathname`.                                                                              | `AdminLayout`                                          |
| `admin/AdminNavbar.tsx`                                                                                           | Header: avatar, nama user, dropdown signOut.                                                                               | `AdminLayout`                                          |
| `admin/PageHeader/StatCard/StatusBadge/SearchInput/EmptyState/DeleteDialog/FormField/Toolbar/DataTablePagination` | Widget tabel & form admin (masing-masing satu tanggung jawab).                                                             | via`admin/index.ts`                                    |
| `ar/ARViewer.tsx` 🗑                                                                                              | Versi React dari AR engine (load A-Frame+MindAR dari CDN, scene, tap, gesture, cleanup).                                   | Hanya`ScanPage` (yang juga mati).                      |
| `ar/StepPopup.tsx` 🗑                                                                                             | Modal detail step + kontrol TTS.                                                                                           | Hanya`ARViewer`.                                       |

### 5.4 db/ — Database

| File                         | Fungsi                                                                                                                                                                                          | Hubungan                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **`db/index.ts`** ⭐ | Buat client`@libsql/client` dari env → `drizzle(client, {schema})`. Export `db`.                                                                                                         | Di-impor:`lib/auth.ts`, semua API, halaman admin. |
| `db/migrate.ts`            | Script: jalankan migration Drizzle ke Turso. Client sendiri (bukan`db/index.ts`).                                                                                                             | `npm run db:migrate`                              |
| `db/seed.ts`               | Data awal: super admin (`admin@sdlc-ar.com`/`admin123`), 3 methods (Waterfall/Agile/RAD), 16 steps dengan konten Indonesia + meshName `WF_*`/`AG_*`/`RAD_*`. `onConflictDoNothing`. | `npm run db:seed`                                 |
| `db/schema/methods.ts`     | Tabel`sdlc_methods`: id, name, slug(uq), description, **modelPath**, markerPath, status, sortOrder, **mindTargetIndex**, timestamps.                                              | Dipakai semua query methods.                        |
| `db/schema/steps.ts`       | Tabel`method_steps`: FK methodId (cascade), **meshName (uq)** ← kunci ke mesh GLB, title, description, content, imageUrl, audioUrl, **stageModelUrl** (URL GLB model 3D tahap, opsional), stepOrder.                                         | Dipakai query steps & ar.html.                      |
| `db/schema/auth.ts`        | Tabel`users` (role admin/super_admin), `sessions`, `accounts`.                                                                                                                            | Dipakai`lib/auth.ts`.                             |
| `db/schema/quizzes.ts`     | Tabel`quizzes` (FK stepId cascade). **Belum dipakai UI** — fitur masa depan.                                                                                                           | —                                                  |
| `db/schema/relations.ts`   | Relasi Drizzle: method↔steps 1-many, step↔quizzes, user↔sessions/accounts.                                                                                                                   | Di-export`schema/index.ts`.                       |
| `db/schema/index.ts`       | Barrel export semua tabel + relasi.                                                                                                                                                             | Diimpor sebagai`@/db/schema`.                     |
| `db/migrations/`           | SQL hasil`drizzle-kit generate` (`0000_heavy_skaar.sql`, `0001_add_stage_model_url.sql` + meta). Catatan perbaikan journal ada di `DATABASE.md` bagian *Catatan Pemeliharaan Migrasi*. | Dijalankan`db/migrate.ts`.                        |

### 5.5 lib/, schemas/, stores/, types/, ar/ — Library

| File                              | Fungsi                                                                                                                                                                    | Hubungan                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **`lib/auth.ts`** ⭐      | NextAuth v5: provider Credentials (bcryptjs.compare vs`users.passwordHash`), session JWT, salin `role` ke token/session. Export: `handlers, signIn, signOut, auth`. | Di-impor:`middleware.ts`, `api/auth/[...nextauth]`, `app/admin/layout.tsx`. |
| **`lib/api-error.ts`** ⭐ | `handleApiError(error, context)` → JSON NextResponse: ZodError→400(+details), UNIQUE→409, FK→400, NOT NULL→400, else→500.                                         | Di-impor**semua** route API methods/steps/users.                            |
| `lib/utils.ts`                  | `cn()` = clsx + tailwind-merge.                                                                                                                                         | `components/ui/*`, `components/admin/*`.                                      |
| **`schemas/index.ts`** ⭐ | Zod:`methodSchema` (slug lowercase, status enum, mindTargetIndex), `stepSchema` (**meshName wajib `^[A-Z0-9_]+$`**, `stageModelUrl` opsional + format URL), `loginSchema` 🗑, `quizSchema` 🗑.   | Di-impor API methods & steps.                                                     |
| `stores/ar-store.ts` 🗑         | Zustand: isTracking, isModelLoaded, selectedStep, isSpeaking + tipe`Step`/`Method`.                                                                                   | Hanya`components/ar/*` & `ScanPage` (semua mati).                             |
| `types/next-auth.d.ts`          | Augmentasi tipe:`User.role`, `Session.user.id/role`, `JWT.role`.                                                                                                    | Otomatis dipakai TS di auth code.                                                 |
| `ar/utils/tts.ts` 🗑            | Wrapper Web Speech API (speak/pause/resume/stop, lang id-ID).                                                                                                             | Hanya`components/ar/StepPopup.tsx`.                                             |

### 5.6 public/ — Aset Statis

| File                                         | Fungsi                                                                                                                                                                                                                                                                                                                                                                                                 | Hubungan                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`public/learn/ar.html`** ⭐⭐      | **AR ENGINE — file terpenting proyek (1349 baris).** Berisi: start screen, MindAR scene (`mindar-image` + `imageTargetSrc:/markers/targets.mind`), `loadFromDB()`, `applyTargetIndex()` (patch anchor MindAR), gesture (rotate Y / pinch zoom / tap 8px), raycaster + bounding-sphere klik mesh, `handleClick()` → `showStageModel()` (model 3D tahap + tombol aksi; fallback `openPopup()` bila tanpa model) / `closePopup()` / `targetLost()`, popup detail + TTS, entity `#stage-entity` (model 3D tahap, saudara `#model-entity` dalam `#pivot`), elemen `<div id="stage-cta">` (tombol "📋 Lihat Penjelasan" + "✕", fixed bottom 126px), debug overlay, progress download model, `cleanSlug` safety net. Memuat **22 `<script>` berurutan (baris 348–369)**: `stage-models.js` → `stages/<metode>/*.js` (21 file: waterfall/agile/rad) → script inline utama (baris 370). | Dibuka via`MethodCard` & `app/learn/[slug]`. Fetch `/api/methods/by-slug/`. Baca cache `ar-models-v1`. Register `public/sw.js`. |
| **`public/learn/stage-models.js`** ⭐ | **HUB model 3D tahap (Stage Model) — 206 baris, DIPISAH dari ar.html.** Script klasik (bukan module), dimuat paling awal (ar.html baris 348) sehingga seluruh fungsinya jadi global. Berisi: state `stageToken` + `stageStep`, `showStageCTA()` / `hideStageCTA()` / `openDetailFromStage()`, `detectStageType()`, `detectMethod()` (prefix mesh `WF_`/`AG_`/`RAD_` → metode), helper `stageEntity()` / `stageBox()` / `stageWrap()`, **`const STAGE_BUILDERS = {}` (registry KOSONG, key `<metode>/<tahap>` — isinya di `stages/<metode>/<tahap>.js`)**, `hideStageModel()`, `activateStageSwap()`, `fitStageGltf()`, `showStageModel()` (return boolean). Semua log `[Stage]` dicetak di file ini. | Dipanggil global oleh`ar.html` (`handleClick()`, `openPopup()`, `closePopup()`, `targetLost()`). Butuh `FIT_SIZE`, `AFRAME`, `resetView()`, `openPopup()` dari ar.html. |
| **`public/learn/stages/<metode>/<tahap>.js`** (21) ⭐ | **Isi model 3D tahap — satu file per tahap per metode** (folder `waterfall/`, `agile/`, `rad/`; masing-masing 7 tahap), mendaftarkan diri ke registry global: `STAGE_BUILDERS["waterfall/design"] = function () { ... }` dst. Isi murni A-Frame primitives (`stageBox` / `stageEntity`) yang dibungkus `stageWrap()`; tanpa state, tanpa log. Ukuran per metode: `requirements` 33, `design` 346, `coding` 417, `testing` 346, `deployment` 407, `maintenance` 385, `review` 202 baris (total 21 file ±6400 baris). Isi awal ketiga metode **identik** — dipisah per metode supaya bisa diedit beda sesuai permintaan client. | Dipanggil `showStageModel()` → `STAGE_BUILDERS["<metode>/<tahap>"]()` (dipilih via `detectMethod()` + `detectStageType()`). **WAJIB dimuat setelah** `stage-models.js` (baris 349–369) dan sebelum script inline ar.html. |
| **`public/markers/targets.mind`** ⭐ | Compiled MindAR target — berisi SEMUA marker dalam 1 file.**Urutan upload di compiler = `mindTargetIndex` di DB** (waterfall 0, agile 1, rad 2).                                                                                                                                                                                                                                              | Dirujuk`ar.html` (`imageTargetSrc`) & `ModelPreloader` (prefetch).                                                                  |
| `public/markers/targets3.mind` 🗑          | Compile lama/backup — tak direferensikan.                                                                                                                                                                                                                                                                                                                                                             | —                                                                                                                                        |
| `public/models/agile-2.glb`                | Backup model lokal (Draco+WebP). Model produksi di R2.                                                                                                                                                                                                                                                                                                                                                 | Tak direferensikan kode.                                                                                                                  |
| `public/lib/mindar/*.js` (4) 🗑            | Vendor bundle MindAR lama.**Tak dipakai** — AR load MindAR dari CDN `cdn.jsdelivr.net/npm/mind-ar@1.2.5`.                                                                                                                                                                                                                                                                                     | Kandidat hapus.                                                                                                                           |
| `public/images/ar1.png, ar2.png`           | Ikon PWA 192 & 512 + ilustrasi halaman.                                                                                                                                                                                                                                                                                                                                                                | `manifest.json`, halaman home.                                                                                                          |
| `public/manifest.json`                     | PWA manifest (standalone, portrait).                                                                                                                                                                                                                                                                                                                                                                   | Direferensikan`app/layout.tsx`.                                                                                                         |
| **`public/sw.js`**                   | **GENERATED** dari `app/sw.ts` oleh Serwist saat `next build`. Jangan edit manual — ditimpa terus.                                                                                                                                                                                                                                                                                          | Cache: precache app shell + cache-first`.glb` (`ar-models-v1`).                                                                       |

### 5.7 docs/ — Dokumentasi

| Dokumen                            | Isi                                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `docs/PRD.md`                    | Kebutuhan produk: tujuan, user flow, fitur fungsional/non-fungsional, aturan bisnis, fitur masa depan.    |
| `docs/ARCHITECTURE.md`           | Arsitektur 20 bagian: layer, static-asset+dynamic-content, mesh mapping, alur-alur, keputusan arsitektur. |
| `docs/DATABASE.md`               | ERD, definisi tabel, relasi, migration/seed, endpoint, mapping mesh.                                      |
| `docs/CODING_GUIDELINES.md`      | 26 bagian standar kode (TypeScript, React, DB, API, AR, penamaan mesh, DoD).                              |
| `docs/AR_SYSTEM.md`              | Detail sistem AR: workflow, marker tracking, stage model, raycaster, aturan Blender/export, audio/TTS.  |
| `docs/ROADMAP.md`                | 9 fase pengembangan + milestone.                                                                          |
| `docs/UI_UX.md`                  | Pedoman desain: warna, tipografi, layout, komponen.                                                       |
| **`docs/CODEBASE_MAP.md`** | **Dokumen ini** — peta file, alur, hubungan.                                                       |

---

## 6. Tabel Hubungan Kunci File ↔ File

### Hubungan "siapa memanggil siapa"

| Pemicu Aksi                 | File A                           | → | File B                                  | Mekanisme                                    |
| --------------------------- | -------------------------------- | -- | --------------------------------------- | -------------------------------------------- |
| Buka`/`                   | `app/page.tsx`                 | → | `app/home/page.tsx`                   | `<Link>`                                   |
| Klik menu belajar           | `app/home/page.tsx`            | → | `app/home/mulai-belajar/page.tsx`     | `<Link>`                                   |
| Render halaman metode       | `mulai-belajar/page.tsx`       | → | `db/index.ts`                         | query Drizzle (cached)                       |
| Render halaman metode       | `mulai-belajar/page.tsx`       | → | `ModelPreloader.tsx`                  | import + props modelPaths                    |
| **Klik kartu metode** | `MethodCard.tsx`               | → | Cache API`ar-models-v1`               | fetch GLB + cache.put                        |
| **Klik kartu metode** | `MethodCard.tsx`               | → | `public/learn/ar.html`                | `window.location.href` (bukan `<Link>`!) |
| Buka halaman AR             | `public/learn/ar.html`         | → | `api/methods/by-slug/[slug]`          | fetch (timeout 5s)                           |
| Fetch by-slug               | `by-slug/route.ts`             | → | `db/schema/methods.ts` + `steps.ts` | Drizzle select + join                        |
| Scan marker                 | `public/learn/ar.html`         | → | `public/markers/targets.mind`         | MindAR`imageTargetSrc`                     |
| Download model              | `public/learn/ar.html`         | → | R2`models.byvictech.site`             | fetch (via SW cache-first)                   |
| Simpan model                | `app/sw.ts`                    | → | Cache`ar-models-v1`                   | `cache.put`                                |
| Admin CRUD methods          | `MethodsTable.tsx`             | → | `api/methods*`                        | fetch PUT/POST/DELETE                        |
| Admin CRUD methods          | `api/methods*`                 | → | `mulai-belajar/page.tsx`              | `revalidateTag("methods")`                 |
| Admin CRUD steps            | `StepsTable.tsx`               | → | `api/steps*`                          | fetch (langsung live)                        |
| Buka`/admin/*`            | `middleware.ts`                | → | `lib/auth.ts`                         | `auth()` session check                     |
| Login                       | `login/page.tsx`               | → | `lib/auth.ts`                         | `signIn("credentials")`                    |
| Login                       | `lib/auth.ts`                  | → | `db/schema/auth.ts`                   | bcrypt.compare                               |
| Semua error API             | `api/*/route.ts`               | → | `lib/api-error.ts`                    | `handleApiError`                           |
| Validasi input              | `api/methods*`, `api/steps*` | → | `schemas/index.ts`                    | Zod`.parse`                                |

### Dua "jembatan" penghubung (paling kritis)

```
JEMBATAN 1: meshName  (Database ↔ Model 3D)
═══════════════════════════════════════════════════════════
   GLB mesh name  ────────────  method_steps.mesh_name
   "AG_PLAN"      ──sama──►    "AG_PLAN"
   Klik mesh di ar.html → stepsData["AG_PLAN"] → model tahap + tombol aksi → popup
   ⚠️ Kalau beda → klik ga muncul apa-apa. Fix: admin /admin/steps.

JEMBATAN 2: mindTargetIndex  (Database ↔ File .mind)
═══════════════════════════════════════════════════════════
   Urutan upload foto di  ──►  targets.mind index  ──►  DB mindTargetIndex
   MindAR compiler             (0, 1, 2, ...)           (0, 1, 2, ...)
   ⚠️ Kalau beda → marker salah kebaca. Fix: cocokkan di /admin/methods.
```

---

## 7. Kode Mati & Catatan Teknis

### File/kode yang TIDAK dipakai (kandidat dihapus — jangan di-edit)

| Item                                                    | Status         | Keterangan                                                                                |
| ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| `app/learn/ar.html`                                   | 🗑 stale       | Prototipe lama "AR BumDes", beda total dengan`public/learn/ar.html`. Bukan route valid. |
| `app/learn/[slug]/ScanPage.tsx`                       | 🗑 orphan      | Tak ada importer. Alur AR lewat static HTML.                                              |
| `components/ar/ARViewer.tsx` + `StepPopup.tsx`      | 🗑 orphan      | Hanya dipakai ScanPage.                                                                   |
| `stores/ar-store.ts`                                  | 🗑 orphan      | Hanya dipakai`components/ar/*`.                                                         |
| `ar/utils/tts.ts`                                     | 🗑 orphan      | Hanya dipakai StepPopup. (TTS di produksi ada di dalam`ar.html` sendiri.)               |
| `public/lib/mindar/*.js` (4 file)                     | 🗑 vendor lama | AR load MindAR dari CDN.                                                                  |
| `public/markers/targets3.mind`                        | 🗑 backup      | Tak direferensikan.                                                                       |
| `getMethodIcon` di `mulai-belajar/page.tsx`         | 🗑 unused      | Logic icon inline di JSX.                                                                 |
| `loginSchema`, `quizSchema` di `schemas/index.ts` | 🗑 unused      | Fitur belum dipakai.                                                                      |
| `db/schema/quizzes.ts`                                | future         | Tabel siap, belum ada UI/API.                                                             |
| `dev.db`                                              | 🗑 sisa        | SQLite lama, gitignored. (`local.db` = dev lokal via `file:` URL.)                    |

### Catatan teknis penting

1. **Build HARUS `--webpack`** (`next build --webpack`) — Serwist belum kompatibel Turbopack. Dev tetap turbopack.
2. **`public/sw.js` jangan diedit** — generated dari `app/sw.ts`, ditimpa tiap build.
3. **Next.js 16: `revalidateTag(tag, profile)` wajib 2 argumen** — dipakai `revalidateTag("methods", { expire: 0 })`.
4. **`loadFromDB()` di ar.html harus tanpa `await`** — kalau blocking, event listener (gesture) terlambat pasang.
5. **MindAR `mindar-image-target` baca `targetIndex` hanya saat `init`** — makanya ada `applyTargetIndex()` yang patch `anchorEntities` langsung. Tanpa ini, semua metode dengerin index 1 (agile).
6. **API methods/steps/users tanpa auth check** (hanya halaman `/admin` yang dijaga middleware). Kalau butuh keamanan produksi, tambahkan `await auth()` di route.
7. **Ganti model 3D = WAJIB ganti URL** (`agile.glb` → `agile-v2.glb`) supaya cache bust. URL sama = file lama terus.
8. **Recompile `targets.mind` = cocokkan ulang `mindTargetIndex`** di `/admin/methods`.
9. **`.env.example` tidak sinkron** dengan nama variabel yang dibaca kode (`TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`).
10. **Log debugging di `public/learn/ar.html`**: `[INIT]`, `[DB]`, `[AR]`, `[LoadCache]`, `[Model]`, `[Click]`, `[Highlight]` — aktifkan console browser saat tes. Log **`[Stage]`** kini dicetak dari `public/learn/stage-models.js`. Contoh log stage: `[Stage] Tanpa model (URL kosong & builder tak ditemukan) → popup langsung`.

---

*Dokumen terakhir diperbarui: September 2026*
