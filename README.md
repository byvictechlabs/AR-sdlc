# AR SDLC Learning Media

> **Media Pembelajaran Interaktif Software Development Life Cycle (SDLC) menggunakan Augmented Reality**

Aplikasi WebAR yang memungkinkan pengguna memindai marker AR untuk melihat model 3D SDLC, mengetuk bagian model untuk penjelasan detail, dan mendengar audio Text-to-Speech (TTS). Dibangun dengan Next.js, MindAR, A-Frame, dan Three.js.

---

## Daftar Isi

- [Tech Stack & Alasan](#tech-stack--alasan)
- [Arsitektur](#arsitektur)
- [Kenapa Menggunakan Static HTML (bukan Next.js Component)?](#kenapa-menggunakan-static-html-bukan-nextjs-component)
- [Database](#database)
- [Alur Pengguna](#alur-pengguna)
- [AR Engine Detail](#ar-engine-detail)
- [Caching Strategy](#caching-strategy)
- [Struktur Proyek](#struktur-proyek)
- [Environment Variables](#environment-variables)
- [Instalasi & Setup](#instalasi--setup)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [API Endpoints](#api-endpoints)
- [Admin Panel](#admin-panel)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack & Alasan

| Teknologi | Versi | Alasan |
|---|---|---|
| **Next.js** | 16.2.12 | Framework React full-stack dengan App Router, SSR, dan API routes. Dipilih karena performa SSR yang baik, ecosystem yang mature, dan deploy ke Vercel yang seamless. |
| **React** | 19.2.4 | Library UI declarative. Digunakan untuk halaman web (home, admin, dll). **TIDAK** digunakan di halaman AR — lihat [penjelasan](#kenapa-menggunakan-static-html-bukan-nextjs-component). |
| **MindAR** | 1.2.5 | Library AR berbasis image tracking yang berjalan di browser (WebAR). Dipilih karena gratis, open-source, tidak perlu aplikasi native, dan mendukung multiple markers. Alternatif: AR.js (kurang stabil), 8thWall (berbayar). |
| **A-Frame** | 1.6.0 | Framework WebVR/WebAR declarative di atas Three.js. Dipilih karena integrasi native dengan MindAR, deklaratif (HTML-like), dan sudah handle rendering 3D + kamera. |
| **Three.js** | (via A-Frame) | Library 3D low-level. Tidak digunakan langsung, tapi diakses via `AFRAME.THREE` untuk raycaster, vector math, dan manipulasi mesh di `ar.html`. |
| **Turso (LibSQL)** | - | Database SQLite edge-compatible. Dipilih karena: (1) gratis untuk tier awal, (2) latensi rendah (replica di edge), (3) kompatibel dengan SQLite sehingga bisa dev lokal, (4) Drizzle ORM support native. Alternatif: PlanetScale (MySQL, lebih berat), Supabase (Postgres, overkill untuk use case ini). |
| **Drizzle ORM** | 0.45.2 | TypeScript ORM type-safe untuk SQL. Dipilih karena: (1) type inference otomatis dari schema, (2) lightweight (no runtime overhead), (3) SQLite/Turso support, (4) migration tool built-in. Alternatif: Prisma (heavier, SQLite support terbatas). |
| **NextAuth v5** | beta.32 | Authentication untuk admin panel. Dipilih karena integrasi native dengan Next.js App Router, mendukung Credentials provider (email/password), dan JWT strategy yang cocok untuk edge deployment. |
| **Serwist (PWA)** | 9.5.12 | Service worker library untuk Next.js. Dipilih untuk: (1) offline capability, (2) caching model 3D agar tidak download ulang, (3) integrasi dengan Next.js build. Alternatif: Workbox (manual setup, tidak Next.js-native). |
| **Tailwind CSS v4** | 4.x | Utility-first CSS. Dipilih untuk styling yang cepat, consistent design system, dan dark mode support. |
| **shadcn/ui** | 4.15.0 | Component library berbasis Radix/Tailwind. Dipilih karena: (1) copy-paste (bukan npm dependency yang terkunci), (2) fully customizable, (3) mendukung Base UI React. |
| **Cloudflare R2** | - | Object storage untuk hosting file GLB model 3D. Dipilih karena: (1) gratis 10GB storage, (2) tidak ada egress fee, (3) cepat (CDN global), (4) S3-compatible API. |

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Edge + Serverless)                │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │ Next.js  │   │ Next.js  │   │ Next.js  │   │ Static  │ │
│  │  Pages   │   │   API    │   │  Auth    │   │  HTML   │ │
│  │ (SSR/SSG)│   │ Routes   │   │ NextAuth │   │ ar.html │ │
│  └──────────┘   └──────────┘   └──────────┘   └─────────┘ │
│       │              │                              │       │
│       └──────────────┼──────────────────────────────┘       │
│                      │                                       │
│              ┌───────┴───────┐                               │
│              │  Turso SQLite │                               │
│              │  (Edge Replicas)│                              │
│              └───────────────┘                               │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │  Service Worker (SW)         │  Model 3D (.glb)
         │  Cache: app shell,          │  Source: Cloudflare R2
         │  API responses              │  Cache: SW CacheFirst
         │                             │
    ┌────┴────┐                  ┌─────┴─────┐
    │ Browser │                  │ R2 Bucket  │
    │ (User)  │                  │ models/    │
    └─────────┘                  └───────────┘
```

### Komunikasi Data

1. **Next.js Pages** ↔ **Turso** (via Drizzle ORM, server-side)
2. **API Routes** ↔ **Turso** (via Drizzle ORM, serverless functions)
3. **ar.html** → **API Routes** (fetch `/api/methods/by-slug/[slug]`)
4. **ar.html** → **R2/CDN** (download model `.glb`)
5. **Service Worker** intercepts `.glb` requests → cache-first strategy

---

## Kenapa Menggunakan Static HTML (bukan Next.js Component)?

Ini adalah **keputusan arsitektural terpenting** dalam proyek ini.

### Masalah

A-Frame dan MindAR membuat **custom elements** (`<a-scene>`, `<a-entity>`, dll) yang mengontrol DOM secara langsung. React (Next.js) juga mengontrol DOM. Ketika keduanya berjalan di elemen yang sama:

1. **DOM Conflict** — React akan overwrite/reconcile DOM nodes yang sudah di-setup A-Frame, menghancurkan scene 3D
2. **Lifecycle Mismatch** — A-Frame menginisialisasi scene di `connectedCallback()`, React bisa unmount/remount kapan saja (re-render, route change, strict mode double-mount)
3. **Memory Leak** — A-Frame scene tidak di-cleanup saat React unmount, menyebabkan WebGL context leak
4. **Event System Clash** — A-Frame menggunakan event emitter sendiri, React menggunakan SyntheticEvent — keduanya tidak kompatibel

### Solusi: Static HTML (`public/learn/ar.html`)

Dengan menempatkan AR experience sebagai **static HTML file** di `public/`:

- ✅ A-Frame punya **kontrol penuh** atas DOM — tidak ada React interference
- ✅ **Lifecycle terpisah** — AR scene hidup dan mati bersama halaman, bukan React component
- ✅ **Zero memory leak** — saat user navigasi keluar, halaman di-destroy seluruhnya
- ✅ **Performance optimal** — tidak ada React runtime overhead di halaman AR
- ✅ **Service Worker tetap aktif** — SW bekerja di seluruh origin, termasuk static files

### Trade-off

- ❌ Tidak bisa menggunakan React components di halaman AR (tapi tidak dibutuhkan)
- ❌ Data harus di-fetch via API (bukan server-side props) — ditangani dengan `fetch()` ke API routes
- ❌ Routing manual — navigasi ke halaman AR menggunakan `<a href>` bukan `<Link>`

> **Catatan:** Percobaan menggunakan `<Link>` dari Next.js ke `ar.html` menyebabkan bug — Next.js client-side routing match ke `/learn/[slug]` route dan redirect ke `/learn/ar.html?method=ar.html` (slug salah). **Solusi:** gunakan `<a>` tag untuk navigasi ke halaman AR.

---

## Database

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   sdlc_methods   │       │  method_steps   │       │    quizzes      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)   │──┐    │ id (PK, UUID)   │──┐    │ id (PK, UUID)   │
│ name            │  │    │ method_id (FK)   │  │    │ step_id (FK)    │
│ slug (UNIQUE)   │  └──<>│ mesh_name (UQ)  │  └──<>│ question        │
│ description     │       │ title           │       │ option_a-d      │
│ model_path      │       │ description     │       │ correct_answer  │
│ marker_path     │       │ content         │       │ created_at      │
│ status          │       │ image_url       │       └─────────────────┘
│ sort_order      │       │ audio_url       │
│ mind_target_idx │       │ step_order      │
│ created_at      │       │ created_at      │
│ updated_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users        │       │    sessions     │       │    accounts     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)   │──┐    │ id (PK, UUID)   │       │ id (PK, UUID)   │
│ name            │  │    │ user_id (FK)    │──<>   │ user_id (FK)    │
│ email (UNIQUE)  │  └──<>│ session_token   │       │ type            │
│ password_hash   │       │ expires_at      │       │ provider        │
│ role            │       └─────────────────┘       │ provider_acc_id│
│ created_at      │                                 └─────────────────┘
│ updated_at      │
└─────────────────┘
```

### Penjelasan Tabel

| Tabel | Fungsi |
|---|---|
| `sdlc_methods` | Metode SDLC (Agile, Waterfall, RAD, dll). Menyimpan info, status (draft/published/archived), path ke model 3D dan marker AR, serta `mindTargetIndex` untuk mapping ke marker di file `.mind`. |
| `method_steps` | Tahapan dalam setiap metode. **`meshName`** adalah kunci yang menghubungkan data penjelasan dengan mesh 3D di file GLB. Ketika user mengetuk mesh, `meshName` di-lookup di tabel ini untuk mendapatkan penjelasan. |
| `quizzes` | Kuis untuk setiap step (opsional, belum diimplementasi di UI). |
| `users` | Admin users. Password di-hash dengan bcryptjs (12 rounds). |
| `sessions` | Session tokens untuk NextAuth. |
| `accounts` | OAuth provider accounts (jika digunakan). |

### Koneksi: `meshName` ↔ GLB Mesh

Ini adalah **hubungan paling kritis** dalam arsitektur:

```
File GLB (3D Model)              Database (method_steps)
┌──────────────────┐             ┌──────────────────┐
│ Mesh: AG_PLAN    │────────────>│ meshName: AG_PLAN│ → title: "Requirement"
│ Mesh: AG_DESIGN  │────────────>│ meshName: AG_DESIGN│ → title: "Design"  
│ Mesh: AG_LAUNCH  │────────────>│ meshName: AG_LAUNCH│ → title: "Development"
│ Mesh: AG_DEPLOY  │────────────>│ meshName: AG_DEPLOY│ → title: "Deployment"
│ Mesh: AG_REVIEW  │────────────>│ meshName: AG_REVIEW│ → title: "Review"
└──────────────────┘             └──────────────────┘
```

- Nama mesh di GLB **harus sama persis** dengan `meshName` di database
- Jika tidak match, mesh bisa diklik tapi tidak ada penjelasan yang muncul
- Mesh names mengikuti konvensi: `[METODE]_[TAHAP]` (contoh: `AG_PLAN`, `WF_REQUIREMENTS`)

---

## Alur Pengguna

```
/ (root)
  │
  ▼
/home ──── Halaman utama (hero + CTA)
  │
  ▼
/home/mulai-belajar ──── Pilih metode SDLC
  │                         │
  │                    ┌────┴────┐
  │                    │         │
  │              <a href>    <a href>
  │                    │         │
  │                    ▼         ▼
  │         /learn/ar.html?method=agile
  │         /learn/ar.html?method=waterfall
  │                    │
  │                    ▼
  │         ┌──────────────────────┐
  │         │   ar.html (static)   │
  │         │                      │
  │         │  1. fetch API → load │
  │         │     method + steps   │
  │         │  2. User klik        │
  │         │     "Mulai Kamera"   │
  │         │  3. MindAR scan      │
  │         │     marker           │
  │         │  4. Target found →   │
  │         │     download model   │
  │         │     dari R2/cache    │
  │         │  5. Model muncul →   │
  │         │     auto-rotate      │
  │         │  6. User ketuk mesh  │
  │         │     → popup detail   │
  │         │     → TTS audio      │
  │         └──────────────────────┘
  │
/home/panduan ──── Halaman panduan

/admin/login ──── Login admin
/admin/methods ──── CRUD metode SDLC
/admin/steps ──── CRUD tahapan
/admin/users ──── CRUD users
```

---

## AR Engine Detail

### File: `public/learn/ar.html`

File ini adalah **single-file application** (~940 baris) yang berisi semua logic AR:

#### Komponen Utama

| Bagian | Fungsi |
|---|---|
| **MindAR Scene** | `<a-scene mindar-image="...">` — inisialisasi AR engine dengan image tracking |
| **Target Entity** | `<a-entity mindar-image-target="targetIndex: N">` — menempelkan model ke marker ke-N |
| **Model Entity** | `<a-entity id="model-entity" scale="0.35 0.35 0.35">` — container model 3D |
| **Loading Overlay** | Progress bar saat download model |
| **Start Screen** | Layar "Mulai Kamera" sebelum AR aktif |
| **Popup Detail** | Modal yang muncul saat mesh diklik |
| **TTS (Text-to-Speech)** | Web Speech API — bacakan penjelasan tahap |

#### Flow Inisialisasi

```javascript
init()
  ├── 1. Pasang event listeners (AR scene events)
  │     ├── "arReady" → AR engine siap
  │     ├── "loaded" → setupGestures() (rotate, zoom, pinch)
  │     └── targetFound/targetLost → tracking state
  ├── 2. loadFromDB() [NON-BLOCKING, background]
  │     ├── fetch /api/methods/by-slug/{slug}
  │     ├── Update methodCfg (modelPath, targetIndex, name)
  │     ├── Build stepsData map (meshName → step data)
  │     └── Fallback ke hardcoded config jika timeout 5 detik
  └── 3. Register service worker
```

> **Penting:** `loadFromDB()` dijalankan **tanpa await** agar tidak mem-block event listener attachment. Jika scene A-Frame sudah "loaded" sebelum listener terpasang, gestures tidak akan berfungsi.

#### Gesture System

| Gesture | Implementasi | Detail |
|---|---|---|
| **Rotate** | 1-finger drag | `rotation.y += dx * 0.025`, `rotation.x += dy * 0.025` |
| **Pinch Zoom** | 2-finger pinch | Scale clamp: `0.08` – `3.0` |
| **Tap** | Pointer event + drag detection | Drag threshold: `8px` (di bawah = tap, di atas = drag) |

#### Mesh Click Detection

1. **Raycaster** (primary) — Cast ray dari kamera ke titik klik, cari intersect mesh. Recursive (`intersectObjects(meshes, true)`).
2. **Bounding Sphere Fallback** — Jika raycaster gagal (model kecil/sudut aneh), project bounding sphere setiap mesh ke layar dan cari yang terdekat dengan klik.

```javascript
resolveMeshName(object)
  → traverse ke parent sampai nemu node yang punya .name
  → return name (e.g. "AG_PLAN")
  → lookup stepsData["AG_PLAN"]
  → tampilkan popup + TTS
```

---

## Caching Strategy

### Service Worker (`app/sw.ts`)

```
┌─────────────────────────────────────┐
│        Service Worker Flow          │
├─────────────────────────────────────┤
│                                     │
│  1. Serwist precache                │
│     → App shell (HTML, JS, CSS)     │
│     → Auto-updated on deploy        │
│                                     │
│  2. GLB Model Cache (CacheFirst)   │
│     → Cache: ar-models-v1          │
│     → Max age: 30 hari             │
│     → Max entries: 10              │
│                                     │
│     Request .glb                    │
│       ├── Ada di cache? → Serve    │
│       └── Tidak? → Fetch + Cache   │
│                                     │
└─────────────────────────────────────┘
```

### Scenarios

| Skenario | Pertama Kali | Kedua Kali |
|---|---|---|
| **Buka AR page** | Download model (~30MB) + cache | Load dari cache (<1 detik) |
| **Admin ganti model (URL beda)** | Download baru + cache | Cache baru |
| **Admin ganti model (URL sama)** | Tetap dari cache (file lama!) | ⚠️ Perlu ganti URL |
| **PWA offline** | ❌ Tidak bisa (butuh kamera HTTPS) | ✅ Model dari cache |

> **Penting untuk admin:** Jika update model 3D, **WAJIB ganti URL modelPath** (misal `agile-new.glb` → `agile-v2.glb`). URL baru = cache miss = download otomatis. URL sama = service worker serve dari cache (file lama).

---

## Struktur Proyek

```
sdlc-ar/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, PWA)
│   ├── globals.css               # Global styles + shadcn import
│   ├── sw.ts                     # Service worker (precache + GLB cache)
│   │
│   ├── home/                     # Halaman publik
│   │   ├── page.tsx              # Home page (hero + CTA)
│   │   ├── loading.tsx           # Skeleton loading
│   │   ├── mulai-belajar/
│   │   │   ├── page.tsx          # Pilih metode SDLC
│   │   │   └── loading.tsx
│   │   └── panduan/
│   │       └── page.tsx          # Panduan penggunaan
│   │
│   ├── learn/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Redirect ke ar.html?method={slug}
│   │   └── ar.html               # [STALE - jangan edit ini]
│   │
│   ├── admin/                    # Admin panel (auth required)
│   │   ├── login/page.tsx
│   │   ├── methods/
│   │   │   ├── page.tsx          # Server component
│   │   │   └── MethodsTable.tsx  # Client component (CRUD)
│   │   ├── steps/
│   │   │   ├── page.tsx
│   │   │   └── StepsTable.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── UsersTable.tsx
│   │
│   └── api/                      # API Routes
│       ├── auth/[...nextauth]/route.ts
│       ├── dashboard/stats/route.ts
│       ├── methods/
│       │   ├── route.ts          # GET all, POST
│       │   ├── [id]/route.ts     # GET, PUT, DELETE
│       │   └── by-slug/[slug]/route.ts  # GET by slug (dipakai ar.html)
│       ├── steps/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── users/
│           ├── route.ts
│           └── [id]/route.ts
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── admin/                    # Admin shared components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── FormField.tsx
│   │   └── ...
│   ├── ar/                       # AR components (unused in prod)
│   │   ├── ARViewer.tsx
│   │   └── StepPopup.tsx
│   └── ModelPreloader.tsx        # <link rel="prefetch"> untuk model
│
├── db/
│   ├── index.ts                  # Drizzle + Turso connection
│   ├── migrate.ts                # Migration runner
│   ├── seed.ts                   # Seed data (admin + methods + steps)
│   ├── schema/
│   │   ├── index.ts              # Schema barrel export
│   │   ├── methods.ts            # sdlc_methods table
│   │   ├── steps.ts              # method_steps table
│   │   ├── quizzes.ts            # quizzes table
│   │   ├── auth.ts               # users, sessions, accounts
│   │   └── relations.ts          # Drizzle relations
│   └── migrations/               # Generated SQL migrations
│
├── lib/
│   ├── auth.ts                   # NextAuth config (Credentials + JWT)
│   ├── api-error.ts              # Error handler helper
│   └── utils.ts                  # cn() utility
│
├── public/
│   ├── learn/
│   │   └── ar.html               # ⭐ AR experience (static HTML)
│   ├── models/
│   │   ├── agile-2.glb           # Compressed model (Draco + WebP)
│   │   └── agile-new-original-backup.glb  # [gitignored] Original 33MB
│   ├── markers/
│   │   └── targets.mind          # MindAR compiled marker targets
│   ├── images/
│   │   ├── ar1.png               # PWA icon 192x192
│   │   └── ar2.png               # PWA icon 512x512
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # [generated] Service worker
│
├── middleware.ts                 # NextAuth middleware (/admin protection)
├── next.config.ts                # Next.js + Serwist config
├── drizzle.config.ts             # Drizzle Kit config
├── tsconfig.json
├── package.json
└── .gitignore
```

### File Penting

| File | Penjelasan |
|---|---|
| `public/learn/ar.html` | **File paling penting.** Semua logic AR ada di sini. ~940 baris. Edit dengan hati-hati. |
| `app/sw.ts` | Service worker — caching model 3D. |
| `app/api/methods/by-slug/[slug]/route.ts` | API yang dipanggil oleh `ar.html` untuk load data. |
| `db/seed.ts` | Data awal (admin account + methods + steps). |

---

## Environment Variables

Buat file `.env.local` di root proyek:

```env
# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Auth
AUTH_SECRET=your-random-secret-min-32-chars
AUTH_URL=https://your-domain.vercel.app

# Optional: Local SQLite for development
# TURSO_DATABASE_URL=file:local.db
# TURSO_AUTH_TOKEN=
```

### Cara Mendapatkan Values

| Variable | Cara |
|---|---|
| `TURSO_DATABASE_URL` | Buat database di [turso.tech](https://turso.tech) → copy URL |
| `TURSO_AUTH_TOKEN` | Turso dashboard → create auth token |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `AUTH_URL` | URL production (misal: `https://ar-sdlc.vercel.app`) |

---

## Instalasi & Setup

### Prerequisites

- **Node.js** 18+ (direkomendasikan 20+)
- **npm** 9+ (atau pnpm/yarn)
- **Git**
- Akun [Turso](https://turso.tech) (gratis)
- Akun [Vercel](https://vercel.com) (gratis)

### 1. Clone Repository

```bash
git clone git@github-byvictech:byvictechlabs/AR-sdlc.git
cd AR-sdlc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.local.example .env.local
# Edit .env.local dengan values yang benar
```

### 4. Setup Database

```bash
# Generate migration files dari schema
npm run db:generate

# Push schema ke Turso (atau local SQLite)
npm run db:push

# Jalankan migrations
npm run db:migrate

# Seed data awal (admin + methods + steps)
npm run db:seed
```

**Default admin account setelah seed:**
- Email: `admin@sdlc-ar.com`
- Password: `admin123`

### 5. Setup MindAR Markers

Marker images harus di-compile ke file `.mind` menggunakan [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/mindarkit/image-targets/):

1. Siapkan gambar marker (1 per metode, resolusi tinggi, kontras tinggi)
2. Upload ke [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/mindarkit/image-targets/)
3. Download file `.mind` hasil compile
4. Taruh di `public/markers/targets.mind`
5. Urutan marker harus sesuai `mindTargetIndex` di database

### 6. Setup Model 3D

Opsi A: **Host di Cloudflare R2** (direkomendasikan untuk file besar)
1. Buat R2 bucket di Cloudflare dashboard
2. Upload file `.glb` ke bucket
3. Set `modelPath` di admin panel ke public URL (misal: `https://models.byvictech.site/models/agile-new.glb`)

Opsi B: **Host di `public/models/`** (untuk file kecil <5MB)
1. Taruh file `.glb` di `public/models/`
2. Set `modelPath` di admin panel ke path lokal (misal: `/models/agile-new.glb`)

**Tips kompresi model:**
```bash
# Install gltf-transform
npm install -g @gltf-transform/cli

# Kompres: Draco geometry + WebP textures + Simplify
gltf-transform optimize input.glb output.glb \
  -- Draco \
  --texture-compress webp,quality=256 \
  --simplify ratio=0.1
```

### 7. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:3000`

### 8. Build Production

```bash
npm run build
```

> **Catatan:** Build menggunakan `--webpack` flag (bukan Turbopack) karena Serwist belum kompatibel dengan Turbopack.

---

## Deploy ke Vercel

### 1. Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Import repository `byvictechlabs/AR-sdlc`
3. Branch: `main`
4. Framework: **Next.js** (auto-detected)
5. Build Command: `next build --webpack`
6. Set **Environment Variables**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `AUTH_SECRET`
   - `AUTH_URL` → `https://your-app.vercel.app`
7. Deploy

### 2. Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Environment Variables di Vercel

Pastikan semua variable sudah diset di **Vercel Dashboard → Settings → Environment Variables**:

```
TURSO_DATABASE_URL = libsql://...
TURSO_AUTH_TOKEN   = eyJ...
AUTH_SECRET        = random-32-char-secret
AUTH_URL           = https://ar-sdlc.vercel.app
```

> ⚠️ **Tanpa `AUTH_URL`, NextAuth akan gagal redirect setelah login (CredentialsSignin error).**

---

## API Endpoints

### Methods

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/methods` | List semua methods |
| `POST` | `/api/methods` | Buat method baru |
| `GET` | `/api/methods/[id]` | Get method by ID |
| `PUT` | `/api/methods/[id]` | Update method |
| `DELETE` | `/api/methods/[id]` | Delete method (+ cascade steps) |
| `GET` | `/api/methods/by-slug/[slug]` | Get method by slug + steps ⭐ |

### Steps

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/steps` | List semua steps |
| `POST` | `/api/steps` | Buat step baru |
| `GET` | `/api/steps/[id]` | Get step by ID |
| `PUT` | `/api/steps/[id]` | Update step |
| `DELETE` | `/api/steps/[id]` | Delete step |

### Users

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/users` | List semua users |
| `POST` | `/api/users` | Buat user baru |
| `GET` | `/api/users/[id]` | Get user by ID |
| `PUT` | `/api/users/[id]` | Update user |
| `DELETE` | `/api/users/[id]` | Delete user |

### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler (login, session, dll) |

### Dashboard

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Statistik admin dashboard |

> ⭐ `/api/methods/by-slug/[slug]` — Endpoint khusus yang dipanggil oleh `ar.html` untuk mendapatkan konfigurasi metode + semua steps. Response format:
> ```json
> {
>   "id": "...",
>   "name": "Agile",
>   "slug": "agile",
>   "modelPath": "https://models.byvictech.site/models/agile-new.glb",
>   "mindTargetIndex": 1,
>   "steps": [
>     { "meshName": "AG_PLAN", "title": "Requirement", "description": "...", "content": "..." },
>     ...
>   ]
> }
> ```

---

## Admin Panel

### Akses

1. Buka `/admin/login`
2. Login dengan email/password
3. Redirect ke `/admin/methods`

### Fitur

| Halaman | Fitur |
|---|---|
| `/admin/methods` | CRUD metode SDLC, search, filter status, edit modelPath/markerPath/mindTargetIndex |
| `/admin/steps` | CRUD tahapan, search, filter by method, edit meshName/title/description/content |
| `/admin/users` | CRUD users, assign roles (admin/super_admin) |

### Edit Dialog

Form edit dialog mendukung scrolling (`max-h-[70vh] overflow-y-auto`) sehingga tombol Simpan selalu terlihat meskipun konten form panjang.

---

## Troubleshooting

### Blank White Page

**Gejala:** Halaman putih kosong, tidak ada konten.

**Penyebab umum:**
1. `shadcn` package tidak ada di `package.json` → `npm install shadcn`
2. `@import "shadcn/tailwind.css"` tidak ada di `globals.css` → tambahkan
3. Console Ninja VS Code extension inject script → disable extension atau clean `npm install`

### CredentialsSignin Error

**Gejala:** Error saat login admin.

**Fix:** Pastikan `AUTH_SECRET` dan `AUTH_URL` sudah diset di environment variables.

### URL Menjadi `ar.html?method=ar.html`

**Gejala:** Parameter method salah.

**Penyebab:** Next.js `<Link>` component melakukan client-side routing yang match ke `/learn/[slug]` route.

**Fix:** Gunakan `<a>` tag (bukan `<Link>`) untuk navigasi ke `ar.html`. Sudah ada safety net: `cleanSlug` yang strip `.html` dari parameter.

### Model Tidak Muncul

**Gejala:** Marker terdeteksi tapi model tidak muncul.

**Cek:**
1. `modelPath` di database benar (buka `/api/methods/by-slug/agile` di browser)
2. URL model bisa diakses (buka langsung di browser)
3. CORS header dari R2 sudah benar
4. File `.mind` sudah di-compile dengan marker yang benar

### Mesh Tidak Bisa Diklik

**Gejala:** Ketuk model tapi tidak ada popup.

**Debug:**
1. Buka devtools console → lihat `[Model] Mesh names in GLB:` dan `[Model] Steps in DB:`
2. Bandingkan — jika mesh name di GLB tidak ada di DB, update `meshName` di admin panel
3. Jika mesh tidak terdeteksi sama sekali, cek scale model (terlalu kecil = raycaster susah)

### Gestures Tidak Berfungsi (Rotate/Zoom)

**Gejala:** Tidak bisa rotate atau zoom model.

**Penyebab:** `setupGestures()` tidak terpanggil karena event listener terlambat dipasang.

**Fix:** Pastikan `loadFromDB()` dipanggil **tanpa await** agar tidak blocking event listener attachment.

### Model Selalu Download Ulang

**Gejala:** Setiap buka AR, model download dari awal.

**Cek:**
1. Service worker ter-registrasi: devtools → Application → Service Workers
2. Cache `ar-models-v1` ada: devtools → Application → Cache Storage
3. Jika SW tidak aktif, cek `app/sw.ts` dan `next.config.ts` (Serwist config)

### Update Model Tidak Tereffect

**Gejala:** Admin sudah ganti modelPath tapi user masih lihat model lama.

**Fix:** Ganti URL modelPath ke URL baru (misal `agile-v2.glb`). URL sama = cache lama yang di-serve. URL baru = cache miss = download baru.

---

## Build Info

| Item | Value |
|---|---|
| **Framework** | Next.js 16.2.12 (App Router) |
| **Build command** | `next build --webpack` |
| **Node** | 18.x+ |
| **Package manager** | npm |
| **Deploy** | Vercel (auto-deploy dari `main` branch) |
| **Domain** | `ar-sdlc.vercel.app` |
| **Model hosting** | Cloudflare R2 (`models.byvictech.site`) |
| **Database** | Turso SQLite (edge replicas) |

---

*Dokumen terakhir diperbarui: September 2026*
