# Product Requirements Document (PRD)
# AR SDLC Learning Media

Version: 1.0  
Status: Draft  
Author: Bayu Dani Kurniawan  
Last Updated: Oktober 2026

---

## Ringkasan untuk Pembaca

Dokumen ini menjelaskan **kebutuhan produk** aplikasi AR SDLC Learning Media: fitur apa saja yang harus ada, siapa penggunanya, bagian alurnya, dan aturan main sistem. Dokumen ini ditujukan untuk klien, dosen pembimbing, dan tim pengembang.

Pembaca non-teknis cukup membaca bagian 1 sampai 9 (gambaran umum, pengguna, alur, dan fitur). Bagian 10 ke atas berisi persyaratan teknis; boleh dilewati jika tidak diperlukan. Istilah teknis dijelaskan singkat pada **Glosarium Istilah** di bawah ini.

---

## Glosarium Istilah

| Istilah | Penjelasan sederhana |
|---|---|
| **WebAR** | Augmented Reality (AR) yang berjalan di browser web, tanpa perlu instal aplikasi. |
| **Marker** | Gambar cetak yang dipindai kamera. Saat marker dikenali, objek 3D muncul di atasnya. |
| **Image Tracking** | Teknologi mengenali dan melacak gambar marker secara terus-menerus lewat kamera. |
| **MindAR** | Library open-source yang melakukan image tracking di browser; jantung sistem AR aplikasi ini. |
| **Mesh** | Satu bagian permukaan objek 3D. Setiap tahapan SDLC berupa satu mesh yang bisa diklik terpisah. |
| **GLB** | Format file model 3D (satu file berisi seluruh objek, tekstur, dan nama mesh). |
| **Raycaster** | Cara komputer menentukan objek 3D mana yang disentuh pengguna, bekerja seperti "sinar tak terlihat" dari titik sentuh layar. |
| **TTS (Text-to-Speech)** | Fitur browser yang mengubah teks menjadi suara, sehingga materi bisa dibacakan tanpa file audio. |
| **Cache** | Penyimpanan sementara di browser. File yang sudah pernah diunduh tidak diunduh ulang sehingga lebih cepat. |
| **API** | Layanan data berbentuk alamat web yang mengembalikan informasi dalam format JSON, dipakai aplikasi untuk membaca/menyimpan data. |
| **CRUD** | Singkatan dari Create, Read, Update, Delete — yaitu kegiatan menambah, melihat, mengubah, dan menghapus data. |
| **Slug** | Potongan teks pendek pada alamat web yang menjadi penanda unik sebuah metode, contoh: `waterfall`, `agile`, `rad`. |
| **ISR / revalidate** | Teknik menyimpan hasil data di server sementara, lalu menyegarkannya otomatis atau saat admin menyimpan perubahan. |

---

# 1. Overview

## Project Name

**AR SDLC Learning Media**

## Description

AR SDLC Learning Media merupakan aplikasi pembelajaran berbasis Web Augmented Reality (WebAR) yang bertujuan membantu mahasiswa memahami konsep Software Development Life Cycle (SDLC) secara interaktif menggunakan teknologi Augmented Reality.

Pengguna cukup melakukan scan marker menggunakan kamera perangkat. Setelah marker berhasil dikenali, model 3D metode SDLC akan muncul. Setiap tahapan pada model dapat dipilih (clickable) sehingga pengguna dapat mempelajari penjelasan masing-masing tahap disertai audio pembelajaran.

Konten pembelajaran dikelola melalui dashboard admin sehingga materi dapat diperbarui tanpa perlu mengubah aplikasi.

---

# 2. Objectives

## Primary Goals

- Membuat media pembelajaran SDLC yang lebih interaktif.
- Memanfaatkan teknologi WebAR agar dapat diakses langsung melalui browser tanpa instalasi aplikasi.
- Menampilkan visualisasi tahapan SDLC dalam bentuk objek 3D.
- Memudahkan mahasiswa memahami urutan setiap metode SDLC.

## Secondary Goals

- Menyediakan dashboard admin untuk mengelola materi.
- Menyediakan audio pembelajaran (suara TTS aktif; file MP3 disiapkan untuk tahap berikutnya).
- Menjadi dasar pengembangan fitur AI Assistant dan Quiz pada versi berikutnya.

---

# 3. Scope

## Included

- WebAR berbasis browser
- Marker Tracking (MindAR)
- Visualisasi 3D metode SDLC
- Objek 3D interaktif (mesh dapat diklik)
- Detail tahapan (popup materi)
- Audio TTS — membacakan teks materi (aktif)
- Pengelolaan URL audio MP3 per tahapan di dashboard admin (data tersedia)
- Dashboard Admin
- CRUD Metode dan CRUD Tahapan

## Excluded (Future Development)

- AI Chat Assistant
- Quiz
- User Login untuk pengguna belajar (saat ini hanya admin yang login)
- Progress Learning
- Analytics
- Multiplayer
- Pemutaran file audio MP3 di halaman AR (field `audioUrl` sudah tersedia, pemutaran menyusul)

---

# 4. Target Users

## Primary User

Mahasiswa Teknik Informatika

## Secondary User

- Dosen
- Guru
- Siswa SMK
- Pengguna umum yang ingin mempelajari SDLC

---

# 5. SDLC Methods

Versi pertama aplikasi hanya mendukung tiga metode SDLC.

- Waterfall
- Agile
- Rapid Application Development (RAD)

Model 3D untuk ketiga metode bersifat statis dan menjadi bagian dari aplikasi. File model di-host di penyimpanan awan Cloudflare R2, bukan disimpan di database.

---

# 6. User Roles

## 1. User (Pengguna belajar)

Pengguna belajar **tidak perlu login**. Hak akses:

- Membuka aplikasi
- Melihat daftar metode
- Melakukan scan marker
- Berinteraksi dengan objek 3D
- Membaca materi
- Mendengarkan audio TTS

## 2. Admin

Hak akses (login menggunakan akun admin, NextAuth Credentials):

- Login ke dashboard
- Mengelola metode
- Mengelola tahapan
- Mengelola materi
- Mengelola URL audio MP3 per tahapan
- Mengelola akun admin lain

---

# 7. User Flow

Alur pengguna dari awal sampai selesai:

```
Buka halaman awal "/" (Splash Screen)
        ↓
Tombol "Mulai Belajar" diklik
        ↓
Halaman Menu "/home" (Mulai Belajar / Panduan)
        ↓
Klik "Mulai Belajar" → halaman "/home/mulai-belajar"
        ↓
Pilih salah satu kartu metode (Waterfall / Agile / RAD)
        ↓
Model 3D diunduh & disimpan di cache browser
(jika sudah pernah diunduh, langsung dilanjutkan)
        ↓
Halaman AR "/learn/ar.html?method=..."
        ↓
Tombol "Mulai Kamera" diklik
        ↓
Scan marker cetak → marker terdeteksi
        ↓
Model 3D muncul di atas marker
        ↓
User memilih salah satu tahapan (mesh) pada model
        ↓
Popup materi tampil
        ↓
User membaca materi dan menekan "Dengarkan" (suara TTS)
```

---

# 8. Admin Flow

```
Login admin
        ↓
Dashboard (statistik)
        ↓
Kelola Metode
        ↓
Kelola Tahapan
        ↓
Tambah / Edit / Hapus materi
        ↓
Isi URL audio MP3 (opsional)
        ↓
Data tersimpan dan tampil di aplikasi pengguna
```

---

# 9. Functional Requirements

## Splash Screen

### Features

- Menampilkan logo aplikasi
- Menampilkan nama aplikasi
- Menampilkan tombol **"Mulai Belajar"** yang mengarah ke halaman menu `/home` (bukan redirect otomatis)

---

## Menu Utama

### Features

- Tombol **"Mulai Belajar"** → halaman pilih metode `/home/mulai-belajar`
- Tombol **"Panduan"** → halaman panduan penggunaan `/home/panduan`

---

## Menu SDLC

### Features

Menampilkan tiga kartu metode SDLC:

- Waterfall
- Agile
- RAD

Setiap kartu berisi:

- Nomor urut
- Ikon metode
- Nama metode
- Deskripsi singkat

Klik kartu → model 3D metode tersebut diunduh dan disimpan di cache browser, lalu halaman AR terbuka. Pengunduhan hanya terjadi sekali; kunjungan berikutnya langsung memakai cache.

---

## Scan AR

### Features

- Mengakses kamera perangkat (dengan izin pengguna)
- Scan marker cetak
- Tracking marker menggunakan MindAR
- Menampilkan model 3D sesuai metode yang dipilih
- Menampilkan indikator scanning dan status pemuatan model
- Tombol "Mulai Kamera" memulai sesi AR

---

## 3D Interaction

### Features

- Render model GLB
- Setiap tahapan dapat diklik
- Menggunakan Raycaster untuk mendeteksi sentuhan
- Menggunakan nama mesh sebagai identifier penghubung ke database
- Highlight objek ketika disentuh (opsional)
- Gesture memutar dan memperbesar model

---

## Detail Tahapan

Popup berisi:

- Nama tahapan
- Deskripsi singkat
- Isi materi penjelasan
- Tombol "Dengarkan" (memutar suara TTS) dan tombol berhenti
- Tombol tutup (✕)

---

## Audio

### Mode aktif: Text-to-Speech (TTS)

Aplikasi membacakan teks materi menggunakan fitur TTS bawaan browser (Web Speech API, bahasa Indonesia). Pengguna menekan tombol **"Dengarkan"** pada popup materi.

### Mode persiapan: Audio MP3

Field audio MP3 (`audioUrl`) sudah tersedia di database dan pada form admin per tahapan, **tetapi belum diputar di halaman AR**. Pemutaran MP3 merupakan rencana pengembangan berikutnya.

---

## Dashboard Admin

Dashboard terdiri dari:

- Statistik (jumlah metode, tahapan, dan akun admin)
- Kelola Metode (`/admin/methods`)
- Kelola Tahapan (`/admin/steps`)
- Manajemen Akun Admin (`/admin/users`)

Catatan: **tidak ada menu "Kelola Audio" terpisah**. Audio MP3 diisi per tahapan melalui form Kelola Tahapan (field Audio URL).

---

## CRUD Metode

Admin dapat:

- Melihat daftar metode
- Menambah metode baru (tombol Create)
- Mengubah informasi metode
- Menghapus metode

Field: Name, Slug, Description, Model Path (GLB), Marker Path, Status, Sort Order, MindAR Target Index.

Catatan penting — menambah metode baru menyiapkan aset ekstra di luar form:

1. Menyiapkan file model GLB baru dan mengunggahnya ke Cloudflare R2, lalu mengisi URL-nya pada field Model Path.
2. Mengompilasi ulang file marker `targets.mind` karena semua marker disatukan dalam satu file. Urutan upload saat kompilasi harus sama dengan nilai **MindAR Target Index** (Waterfall = 0, Agile = 1, RAD = 2).
3. Mengisi field MindAR Target Index sesuai urutan tersebut.

---

## CRUD Tahapan

Admin dapat:

- Tambah Tahapan
- Edit Tahapan
- Hapus Tahapan

Field:

- Mesh Name
- Judul
- Deskripsi
- Isi materi
- Image URL
- Audio URL (MP3)
- Step Order

Mesh Name **dapat diedit** oleh admin, tetapi **wajib sama persis** dengan nama mesh di dalam file GLB. Aturan penamaan: huruf besar, angka, dan underscore saja (contoh: `WF_REQUIREMENTS`). Jika nama tidak cocok, materi tahapan tersebut tidak akan muncul saat mesh diklik.

---

## Pengelolaan Audio

Admin dapat:

- Mengisi URL audio MP3 (field Audio URL pada form tahapan)
- Mengganti URL audio MP3
- Menghapus URL audio MP3

Saat ini URL tersebut sudah tersimpan di database, tetapi belum diputar di halaman AR. Yang aktif dipakai adalah TTS.

---

# 10. Non Functional Requirements

## Performance

- Waktu loading maksimal 3 detik
- Tracking marker stabil
- Klik objek responsif
- Popup muncul kurang dari 500ms
- Model 3D diunduh sekali lalu disimpan di cache browser
- Daftar metode memakai ISR / revalidate agar halaman cepat dibuka

---

## Compatibility

Browser

- Chrome
- Edge
- Safari
- Firefox (Best Effort)

Device

- Android
- iOS
- Desktop Webcam

---

## Security

- Admin Authentication (NextAuth Credentials)
- Input Validation (Zod)
- File Validation
- SQL Injection Protection (Drizzle ORM)

---

## Scalability

Sistem dirancang agar mudah dikembangkan menjadi:

- AI Chat
- Quiz
- User Progress
- Leaderboard
- Multi Marker

---

# 11. Future Features

## AI Learning Assistant

Floating button pada halaman scan.

AI mengetahui metode yang sedang dipelajari sehingga mampu menjawab pertanyaan berdasarkan tahapan yang sedang dibuka.

Contoh:

> Apa perbedaan Sprint Review dan Sprint Retrospective?

---

## Quiz

Quiz muncul berdasarkan tahapan yang sedang dipelajari.

Setiap tahapan memiliki soal yang berbeda.

Catatan: tabel `quizzes` sudah tersedia di skema database sebagai persiapan, tetapi fiturnya belum diimplementasi.

---

## Progress Learning

- Riwayat belajar
- Nilai quiz
- Persentase penyelesaian

---

# 12. Technical Constraints

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand

AR (implementasi produksi)

- Halaman AR berupa file HTML statis `public/learn/ar.html`
- A-Frame 1.6.0 (dimuat dari CDN)
- MindAR 1.2.5 (dimuat dari CDN)
- Three.js melalui `AFRAME.THREE`
- React Three Fiber **tidak dipakai** di versi produksi (komponen React AR di repo hanya sisa/tidak aktif)

Backend

- Next.js Route Handler
- NextAuth v5 (hanya untuk admin)

Database

- Turso (SQLite cloud)
- Drizzle ORM

Storage

- Cloudflare R2 untuk file model GLB (`https://models.byvictech.site/...`)
- File marker gabungan `public/markers/targets.mind`
- Cache browser (Cache API) untuk model yang sudah pernah diunduh

Build dan Deployment

- Build: `next build --webpack`
- Deployment: Vercel

---

# 13. Business Rules

- Aplikasi menyediakan tiga metode SDLC: Waterfall, Agile, dan RAD.
- Model 3D di-host di Cloudflare R2 dan tidak disimpan di database; dashboard hanya mengelola URL modelnya.
- Semua gambar marker di-kompilasi menjadi SATU file `targets.mind`. Urutan upload di kompiler marker menjadi nilai `mindTargetIndex` (Waterfall = 0, Agile = 1, RAD = 2).
- Marker dicetak fisik oleh pengguna/pengajar.
- Setiap mesh pada model memiliki nama unik.
- Nama mesh pada database harus sama persis dengan nama mesh di file GLB, ditulis huruf besar dengan underscore.
- Konten materi dapat diperbarui kapan saja tanpa mengubah aplikasi.
- Audio MP3 bersifat opsional; yang aktif saat ini adalah Browser Text-to-Speech.
- Hanya admin yang login; pengguna belajar tidak memerlukan akun.
- Fitur AI Assistant, Quiz, progress belajar, dan multi-marker belum diimplementasi (masa depan).

---

# 14. Assumptions

- Pengguna memiliki kamera.
- Browser mendukung WebXR/WebGL dan Web Speech API (TTS).
- Marker dicetak dengan kualitas baik.
- Koneksi internet tersedia.

---

# 15. Success Criteria

Project dianggap berhasil apabila:

- Marker berhasil dikenali.
- Model 3D tampil dengan benar.
- Seluruh tahapan dapat diklik.
- Detail materi muncul sesuai tahapan yang dipilih.
- Suara TTS dapat membacakan materi.
- Dashboard admin dapat mengelola metode, tahapan, materi, dan URL audio.
- Sistem berjalan stabil pada browser modern.

---

# 16. Future Architecture Expansion

Versi berikutnya akan menambahkan:

- AI Chat Assistant
- Quiz (tabel `quizzes` sudah tersedia)
- User Authentication untuk pengguna belajar
- Learning Progress
- Achievement
- Dashboard Analytics
- Pemutaran audio MP3 di halaman AR

Arsitektur saat ini sudah dirancang agar seluruh fitur tersebut dapat ditambahkan tanpa mengubah struktur utama aplikasi.
