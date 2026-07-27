# Product Requirements Document (PRD)
# AR SDLC Learning Media

Version: 1.0  
Status: Draft  
Author: Bayu Dani Kurniawan  
Last Updated: July 2026

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
- Menyediakan audio pembelajaran.
- Menjadi dasar pengembangan fitur AI Assistant dan Quiz pada versi berikutnya.

---

# 3. Scope

## Included

- WebAR berbasis browser
- Marker Tracking
- 3D SDLC Visualization
- Clickable 3D Object
- Detail Tahapan
- Audio Player
- Dashboard Admin
- CRUD Materi
- CRUD Audio

## Excluded (Future Development)

- AI Chat Assistant
- Quiz
- User Login
- Progress Learning
- Analytics
- Multiplayer

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

Model 3D untuk ketiga metode bersifat statis dan menjadi bagian dari aplikasi.

---

# 6. User Roles

## 1. User

Hak akses:

- Membuka aplikasi
- Melihat daftar metode
- Melakukan scan marker
- Berinteraksi dengan objek 3D
- Membaca materi
- Memutar audio

## 2. Admin

Hak akses:

- Login
- Mengelola metode
- Mengelola tahapan
- Mengelola materi
- Mengelola audio

---

# 7. User Flow

## Splash Screen

↓

Menampilkan logo aplikasi

↓

Menu Utama

↓

Pilih Metode SDLC

↓

Halaman Scan

↓

Scan Marker

↓

Marker terdeteksi

↓

Model 3D muncul

↓

User memilih salah satu tahapan

↓

Popup Detail

↓

User membaca materi

↓

User memutar audio

---

# 8. Admin Flow

Login

↓

Dashboard

↓

Kelola Metode

↓

Kelola Tahapan

↓

Tambah/Edit/Hapus Materi

↓

Upload Audio (Opsional)

↓

Publish

---

# 9. Functional Requirements

## Splash Screen

### Features

- Menampilkan logo aplikasi
- Menampilkan nama aplikasi
- Redirect otomatis ke menu utama

---

## Menu SDLC

### Features

Menampilkan tiga metode SDLC

- Waterfall
- Agile
- RAD

Setiap card berisi:

- Nama metode
- Deskripsi singkat
- Tombol "Pelajari"

---

## Scan AR

### Features

- Mengakses kamera
- Scan marker
- Tracking marker menggunakan MindAR
- Menampilkan model 3D sesuai metode
- Menampilkan indikator scanning

---

## 3D Interaction

### Features

- Render model GLB
- Setiap tahapan dapat diklik
- Menggunakan Raycaster
- Menggunakan nama mesh sebagai identifier
- Highlight objek ketika disentuh (optional)

---

## Detail Tahapan

Popup berisi

- Nama Tahapan
- Nomor Tahapan
- Penjelasan
- Tombol Play Audio
- Tombol Pause Audio
- Tombol Close

---

## Audio

### Mode 1

Audio MP3 yang diupload admin.

### Mode 2

Jika audio tidak tersedia maka aplikasi menggunakan Browser Text To Speech.

---

## Dashboard Admin

Dashboard terdiri dari:

- Statistik
- Kelola Metode
- Kelola Tahapan
- Kelola Audio

---

## CRUD Metode

Admin dapat:

- Melihat metode
- Mengubah informasi metode

Catatan:

Admin tidak dapat menambah metode baru karena model 3D bersifat statis.

---

## CRUD Tahapan

Admin dapat

- Tambah Tahapan
- Edit Tahapan
- Hapus Tahapan

Field:

- Judul
- Deskripsi
- Audio

Mesh Name tidak dapat diubah.

---

## Audio Management

Admin dapat

- Upload MP3
- Mengganti MP3
- Menghapus MP3

---

# 10. Non Functional Requirements

## Performance

- Waktu loading maksimal 3 detik
- Tracking marker stabil
- Klik objek responsif
- Popup muncul kurang dari 500ms

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

- Admin Authentication
- Input Validation
- File Validation
- SQL Injection Protection

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

AR

- MindAR
- Three.js
- React Three Fiber

Backend

- Next.js Route Handler

Database

- Turso SQLite
- Drizzle ORM

Storage

- Local Storage
- Audio Storage

Deployment

- Vercel

---

# 13. Business Rules

- Aplikasi hanya memiliki tiga metode SDLC.
- Model 3D tidak dapat diubah melalui dashboard admin.
- Setiap mesh pada model memiliki nama unik.
- Nama mesh harus sama dengan data pada database.
- Konten materi dapat diperbarui kapan saja.
- Audio bersifat opsional.
- Jika audio tidak tersedia maka sistem menggunakan Browser Text-to-Speech.

---

# 14. Assumptions

- Pengguna memiliki kamera.
- Browser mendukung WebXR/WebGL.
- Marker dicetak dengan kualitas baik.
- Koneksi internet tersedia.

---

# 15. Success Criteria

Project dianggap berhasil apabila:

- Marker berhasil dikenali.
- Model 3D tampil dengan benar.
- Seluruh tahapan dapat diklik.
- Detail materi muncul sesuai tahapan yang dipilih.
- Audio dapat diputar.
- Dashboard admin dapat mengelola seluruh materi.
- Sistem berjalan stabil pada browser modern.

---

# 16. Future Architecture Expansion

Versi berikutnya akan menambahkan:

- AI Chat Assistant
- Quiz
- User Authentication
- Learning Progress
- Achievement
- Dashboard Analytics

Arsitektur saat ini sudah dirancang agar seluruh fitur tersebut dapat ditambahkan tanpa mengubah struktur utama aplikasi.