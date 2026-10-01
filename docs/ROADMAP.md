
# Roadmap

# AR SDLC Learning Media

Version: 2.0

Status: Active Development

Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan **rencana dan kemajuan pengembangan** aplikasi AR SDLC Learning Media, diatur per tahapan (fase) dari persiapan proyek sampai penyelesaian.

Pembaca non-teknis cukup memperhatikan **status tiap fase** (✅ selesai, 🟡 berjalan, ⏳ rencana, 💡 masa depan) pada tabel Milestones di bagian akhir. Daftar tugas teknis di tiap fase boleh dilewati. Istilah teknis dijelaskan pada **Glosarium Istilah** di bawah ini.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
|---|---|
| **WebAR** | Augmented Reality yang berjalan di browser web, tanpa instal aplikasi. |
| **Marker** | Gambar cetak yang dipindai kamera agar objek 3D muncul di atasnya. |
| **MindAR** | Library open-source untuk mengenali marker (image tracking) di browser. |
| **Mesh** | Satu bagian permukaan objek 3D; setiap tahapan SDLC = satu mesh yang bisa diklik. |
| **GLB** | Format file model 3D (satu file berisi objek, tekstur, dan nama mesh). |
| **Raycaster** | Cara menentukan objek 3D mana yang disentuh pengguna, seperti "sinar tak terlihat" dari layar. |
| **TTS (Text-to-Speech)** | Fitur browser yang mengubah teks menjadi suara untuk membacakan materi. |
| **Cache** | Penyimpanan sementara; file yang sudah pernah diunduh tidak diunduh ulang. |
| **API** | Layanan data berbentuk alamat web yang mengembalikan data JSON. |
| **CRUD** | Create, Read, Update, Delete — menambah, melihat, mengubah, menghapus data. |
| **Slug** | Potongan teks penanda unik sebuah metode di alamat web (contoh: `waterfall`). |
| **ISR / revalidate** | Menyimpan hasil data di server sementara, lalu menyegarkannya otomatis atau saat admin menyimpan perubahan. |

---

# Project Goal

Membangun media pembelajaran berbasis Web Augmented Reality (WebAR) untuk mempelajari Software Development Life Cycle (SDLC) menggunakan MindAR, A-Frame (halaman HTML statis), dan Next.js.

Catatan: React Three Fiber tidak dipakai pada versi produksi. Implementasi AR berjalan di file HTML statis `public/learn/ar.html` yang memuat A-Frame 1.6.0 dan MindAR 1.2.5 dari CDN.

---

# Development Strategy

Pengembangan dilakukan secara bertahap dengan pendekatan **Backend First**.

Prioritas utama adalah membangun fondasi sistem (database, dashboard admin, dan API) sebelum mengembangkan fitur WebAR.

---

# Phase 1 — Project Foundation

Status: ✅ Complete

Objective

Menyiapkan fondasi project.

Tasks

- Initialize Next.js Project
- Install Dependencies
- Configure Tailwind CSS
- Configure ESLint
- Configure Drizzle ORM
- Configure SQLite Database (Turso-compatible)
- Create Project Folder Structure
- Create Documentation
- Configure Environment Variables
- Setup shadcn/ui

Deliverables

- Project siap dikembangkan
- Dokumentasi lengkap
- Database terkoneksi

---

# Phase 2 — Database

Status: ✅ Complete

Objective

Membangun struktur database.

Tasks

- Create Database Schema
- Create Migration
- Seed Initial Data
- Test Database Connection

Tables

- Users (Admin authentication)
- Sessions
- Accounts
- Categories
- SDLC Methods
- Method Steps
- Learning Materials
- 3D Assets
- Audios
- Quizzes (preparation only)

Deliverables

- Database siap digunakan
- 10 tables dengan relasi yang benar
- Seed data untuk 3 metode SDLC

---

# Phase 3 — Admin Panel

Status: ✅ Complete

Objective

Membangun Content Management System (CMS) untuk mengelola materi pembelajaran.

Features

- Dashboard dengan statistik (jumlah metode, tahapan, akun admin)
- Login Admin (NextAuth v5)
- Sidebar navigation
- CRUD SDLC Methods
- CRUD Method Steps (termasuk field materi dan URL audio MP3)
- User Management
- Zod validation
- Toast notifications
- Responsive design

Pages

- /admin/login
- /admin (dashboard)
- /admin/methods
- /admin/steps
- /admin/users

Catatan

- Audio MP3 tidak punya halaman kelola terpisah; admin mengisi field Audio URL pada form tiap tahapan.
- Admin dapat menambah metode baru lewat tombol Create, dengan syarat menyiapkan aset ekstra: model GLB baru di Cloudflare R2, kompilasi ulang file marker `targets.mind`, dan pengisian `mindTargetIndex`.

Deliverables

- Seluruh konten dapat dikelola tanpa mengubah kode aplikasi

---

# Phase 4 — REST API

Status: ✅ Complete

Objective

Menyediakan endpoint untuk aplikasi WebAR.

Endpoints

Methods

```
GET    /api/methods
POST   /api/methods
GET    /api/methods/:id
PUT    /api/methods/:id
DELETE /api/methods/:id
GET    /api/methods/by-slug/:slug
```

Steps

```
GET    /api/steps
POST   /api/steps
GET    /api/steps/:id
PUT    /api/steps/:id
DELETE /api/steps/:id
```

Users

```
GET    /api/users
POST   /api/users
DELETE /api/users/:id
```

Dashboard

```
GET    /api/dashboard/stats
```

Auth

```
POST   /api/auth/callback/credentials
GET    /api/auth/session
GET    /api/auth/signout
```

Deliverables

- API siap dikonsumsi frontend
- Endpoint `by-slug` dipakai halaman AR untuk memuat metode + tahapan + urutan marker
- Zod validation pada semua endpoint
- Proper error handling
- Cache halaman daftar metode disegarkan otomatis (ISR / revalidate) saat admin menyimpan perubahan

---

# Phase 5 — WebAR

Status: ✅ Complete

Objective

Mengintegrasikan WebAR.

Tasks

- Camera Access
- MindAR Integration
- Marker Tracking
- Load GLB (dari Cloudflare R2, dengan cache browser)
- Render Scene
- Raycaster
- Mesh Interaction

Implementasi

Berjalan di halaman HTML statis `public/learn/ar.html` dengan A-Frame 1.6.0 + MindAR 1.2.5. Seluruh marker dikompilasi ke satu file `public/markers/targets.mind`.

Deliverables

- Model tampil di AR
- Mesh dapat diklik

---

# Phase 6 — Learning Content

Status: ✅ Complete

Objective

Menampilkan materi pembelajaran.

Features

- Detail Popup
- Description
- Audio TTS (Web Speech API bahasa Indonesia) — aktif dipakai
- Tombol "Dengarkan" / berhenti

Catatan

Field audio MP3 (`audioUrl`) sudah tersedia di database dan form admin, tetapi pemutaran MP3 di halaman AR belum aktif — saat ini yang dipakai adalah TTS.

Deliverables

- Pengguna dapat mempelajari setiap tahapan SDLC

---

# Phase 7 — Optimization

Status: 🟡 In Progress

Tasks

Selesai:

- Lazy Loading model GLB
- Cache model di browser (Service Worker + Cache API `ar-models-v1`)
- Prefetch marker `targets.mind`

Belum:

- Asset Optimization
- Image Optimization
- Audio Optimization
- Database Optimization
- Performance Testing

Deliverables

- Aplikasi lebih cepat dan stabil

---

# Phase 8 — Testing

Status: ⏳ Planned

Testing

- Functional Testing
- API Testing
- Browser Compatibility
- Mobile Testing
- Performance Testing
- User Acceptance Testing (UAT)

Deliverables

- Sistem siap digunakan

---

# Phase 9 — Deployment

Status: ⏳ Planned

Tasks

- Deploy Database (Turso)
- Deploy Next.js (Vercel)
- Configure Environment Variables
- Configure Domain
- Final Testing

Deployment Target

- Vercel
- Turso

Deliverables

- Production Ready

---

# Future Development

## AI Learning Assistant

Status: 💡 Future

Features

- Floating Chat Button
- AI Question Answering
- Context-aware Responses
- Explain SDLC Concepts

---

## Quiz

Status: 💡 Future

Catatan: tabel `quizzes` sudah tersedia di skema database sebagai persiapan, tetapi fiturnya belum diimplementasi.

Features

- Quiz per Tahapan
- Multiple Choice
- Score
- Feedback

---

## Learning Progress

Status: 💡 Future

Features

- Progress Tracking
- Completion Percentage
- Learning History

---

## Analytics Dashboard

Status: 💡 Future

Features

- Most Viewed Methods
- Learning Statistics
- Audio Usage
- Quiz Results

---

# Milestones

| Milestone | Keterangan | Status |
| --- | --- | --- |
| Milestone 1 | Setup Project | ✅ |
| Milestone 2 | Database | ✅ |
| Milestone 3 | Admin Panel | ✅ |
| Milestone 4 | REST API | ✅ |
| Milestone 5 | AR Engine | ✅ |
| Milestone 6 | Learning Module | ✅ |
| Milestone 7 | Optimization | 🟡 |
| Milestone 8 | Testing | ⏳ |
| Milestone 9 | Deployment | ⏳ |
| Milestone 10 | AI Assistant | 💡 |
| Milestone 11 | Quiz | 💡 |

Keterangan status: ✅ selesai · 🟡 berjalan · ⏳ direncanakan · 💡 masa depan

---

# Success Criteria

Project dianggap selesai apabila:

- Database berjalan dengan baik.
- Admin dapat mengelola seluruh konten.
- API dapat diakses frontend.
- WebAR menampilkan model dengan benar.
- Seluruh tahapan dapat diklik.
- Materi tampil sesuai data dan suara TTS berfungsi.
- Sistem berhasil dideploy ke production.
